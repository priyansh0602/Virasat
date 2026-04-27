/**
 * GroqService.js
 * Handles AI storytelling using Groq (OpenAI-compatible API).
 */
import { supabase } from '../lib/SupabaseClient'

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const URL = 'https://api.groq.com/openai/v1/chat/completions';

/* ═══════════════════════════════════════════
   GROQ REQUEST QUEUE
   Serialises all Groq calls with a 700ms gap so
   simultaneous dashboard loads never hit 429.
   ═══════════════════════════════════════════ */
const groqQueue = []
let groqBusy = false

function drainGroqQueue() {
  if (groqBusy || groqQueue.length === 0) return
  groqBusy = true
  const { payload, resolve, reject } = groqQueue.shift()

  // 8-second safety timeout — prevents the entire queue from stalling
  // if Groq hangs on a single request (common after 3-4 rapid game rounds)
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 8000)

  fetch(URL, { ...payload, signal: controller.signal })
    .then(res => { clearTimeout(timeoutId); resolve(res) })
    .catch(err => {
      clearTimeout(timeoutId)
      if (err.name === 'AbortError') {
        console.warn('Groq request timed out after 8s — resolving gracefully')
        // Return a structured error response so callers hit their existing `data.error` handling
        resolve(new Response(JSON.stringify({ error: { message: 'Request timed out' } }), { status: 408 }))
      } else {
        reject(err)
      }
    })
    .finally(() => {
      setTimeout(() => { groqBusy = false; drainGroqQueue() }, 700)
    })
}

function queuedGroqFetch(payload) {
  return new Promise((resolve, reject) => {
    groqQueue.push({ payload, resolve, reject })
    drainGroqQueue()
  })
}


/**
 * generateHeritageStory
 * Converts a Wikipedia summary into an immersive narrative of history and legends.
 * @param {string} title
 * @param {string} summary
 * @param {string} language - 'en', 'hi', or 'sa'
 * @param {string} persona - 'archaeologist', 'grandfather', 'time-traveler', or 'bard'
 * @returns {Promise<string>}
 */
export async function generateHeritageStory(title, summary, language = 'en', persona = 'bard') {
  if (!GROQ_API_KEY) {
    return "API Key not found. Please add VITE_GROQ_API_KEY to your .env file to activate the storytelling engine.";
  }

  let personaInstruction = '';
  if (persona === 'archaeologist') {
    personaInstruction = `You are "The Archaeologist". Provide technical, gritty details about the construction, materials (like red sandstone or mortar), and architectural geometry. Focus on the physical reality of the site.`;
  } else if (persona === 'grandfather') {
    personaInstruction = `You are "The Grandfather". Tell a warm, nostalgic, folk-tale version of the history. Use phrases emphasizing memory, generations, and the emotional or spiritual legacy left behind by the figures of the past.`;
  } else if (persona === 'time-traveler') {
    personaInstruction = `You are "The Time Traveler". Describe what the place looked, smelled, and sounded like 500 (or more) years ago. Focus on the bustling atmosphere, the people, and the vibrant life that once filled the space in its prime.`;
  } else {
    personaInstruction = `You are a "Virasat Bard" — a brilliant, witty, and deeply knowledgeable Indian heritage storyteller. Focus on blending historical architectural facts with the most famous legends, myths, or folklore associated with the place.`;
  }

  const systemPrompt = `
    ${personaInstruction}
    Your goal is to take a dry Wikipedia summary and transform it into an immersive narrative.
    IMPORTANT: Keep your entire response to a MAXIMUM of 6 lines. Be vivid but concise.
    
    Make it sound evocative and premium.

    CRITICAL: Reply ONLY in the requested language: ${language === 'hi' ? 'Hindi' : language === 'sa' ? 'Sanskrit' : 'English'}.
  `;

  const userPrompt = `
    Title: ${title}
    Wikipedia Summary: ${summary}
    
    Tell me the captivating history and legends about this place.
  `;

  try {
    const response = await queuedGroqFetch({
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    if (data.error) {
      console.error('Groq API Error:', data.error);
      return `Error from AI Service: ${data.error.message}`;
    }

    return data.choices?.[0]?.message?.content || "The spirits of the past are silent today. Try again later.";
  } catch (err) {
    console.error('Fetch Error:', err);
    return "The connection to the storytelling engine was lost. Please check your internet.";
  }
}

/**
 * chatWithHeritage
 * Handles contextual Q&A about a specific heritage topic.
 * @param {string} title
 * @param {string} summary
 * @param {string} question
 * @param {Array} history
 * @param {string} language
 * @returns {Promise<string>}
 */
export async function chatWithHeritage(title, summary, question, history = [], language = 'en', persona = 'bard') {
  if (!GROQ_API_KEY) {
    return "API Key not found. Please add VITE_GROQ_API_KEY to your .env file to activate.";
  }

  let personaPrompt = `You are a helpful heritage assistant.`;
  if (persona === 'archaeologist') {
    personaPrompt = `You are "The Archaeologist". You interact with the user by heavily emphasizing architectural details, structural engineering, raw materials (like types of stone), precise timelines, and the gritty physical reality of the historical site. Speak with a sharp, highly technical, academic, yet intensely fascinating and grounded tone.`;
  } else if (persona === 'grandfather') {
    personaPrompt = `You are "The Grandfather". You are interacting with the user as if they are your grandchild. Speak affectionately, warmly, and nostalgically. Frame your answers as old folk tales and vivid personal memories, emphasizing the emotional and cultural legacy of the history.`;
  } else if (persona === 'time-traveler') {
    personaPrompt = `You are "The Time Traveler". You interact with the user as if you have just arrived from the past. Vividly describe the sensory details—what the place looked, smelled, and sounded like hundreds of years ago as if you literally saw it happening in front of you.`;
  } else {
    personaPrompt = `You are the "Virasat Bard", an AI assistant. You speak eloquently, with a touch of poetic flair, blending history with famous myths.`;
  }

  const systemPrompt = `
    ${personaPrompt}
    Your ONLY purpose is to answer questions strictly related to this topic: "${title}".
    
    Background info about ${title}: ${summary}

    If the user asks a question that is irrelevant, off-topic, or not related to ${title} or Indian heritage/history connected to it, you MUST reply starting with exactly the word "[REJECTED]" followed by a polite explanation in your character's persona that you can only answer questions related to ${title}.
    
    If the question is relevant, provide a concise, informative, and engaging answer deeply immersed in your assigned persona.
    IMPORTANT: Keep your entire response to a MAXIMUM of 6 lines. Be informative but brief.
    CRITICAL: Reply ONLY in the requested language: ${language === 'hi' ? 'Hindi (Devanagari script)' : language === 'hinglish' ? 'Hinglish (a casual mix of Hindi and English, using Roman script)' : language === 'sa' ? 'Sanskrit' : 'English'}.
  `;

  // We map the incoming history, but don't want to pass [REJECTED] to the model if it was just an error output, though it's okay.
  const messages = [
    { role: 'system', content: systemPrompt },
    ...history.map(msg => ({
      role: msg.role,
      content: msg.content.startsWith('[REJECTED]') ? msg.content.replace('[REJECTED]', '').trim() : msg.content
    })),
    { role: 'user', content: question }
  ];

  try {
    const response = await queuedGroqFetch({
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: messages,
        temperature: 0.3, // Lower temperature to keep it grounded
      }),
    });

    const data = await response.json();
    if (data.error) {
      console.error('Groq API Error:', data.error);
      return `Error from AI Service: ${data.error.message}`;
    }

    return data.choices?.[0]?.message?.content || "No response generated.";
  } catch (err) {
    console.error('Chat Error:', err);
    return "The connection to the chat service was lost. Please check your internet.";
  }
}

/**
 * chatWithGlobalHeritage
 * Handles contextual global Q&A as the assigned Persona.
 * @param {string} question
 * @param {Array} history
 * @param {string} language
 * @param {string} persona
 * @returns {Promise<string>}
 */
export async function chatWithGlobalHeritage(question, history = [], language = 'en', persona = 'bard') {
  if (!GROQ_API_KEY) {
    return "API Key not found. Please add VITE_GROQ_API_KEY to your .env file to activate.";
  }

  let personaPrompt = `You are a helpful heritage assistant.`;
  if (persona === 'archaeologist') {
    personaPrompt = `You are "The Archaeologist". You interact with the user by heavily emphasizing architectural details, structural engineering, raw materials (like types of stone), precise timelines, and the gritty physical reality of the historical site. Speak with a sharp, highly technical, academic, yet intensely fascinating and grounded tone.`;
  } else if (persona === 'grandfather') {
    personaPrompt = `You are "The Grandfather". You are interacting with the user as if they are your grandchild. Speak affectionately, warmly, and nostalgically. Frame your answers as old folk tales and vivid personal memories, emphasizing the emotional and cultural legacy of the history.`;
  } else if (persona === 'time-traveler') {
    personaPrompt = `You are "The Time Traveler". You interact with the user as if you have just arrived from the past. Vividly describe the sensory details—what the place looked, smelled, and sounded like hundreds of years ago as if you literally saw it happening in front of you.`;
  } else {
    personaPrompt = `You are the "Virasat Bard", an AI assistant. You speak eloquently, with a touch of poetic flair, blending history with famous myths.`;
  }

  const systemPrompt = `
    ${personaPrompt}
    You are a general AI guide for the "Virasat" Indian Heritage platform.
    Your purpose is to answer questions ONLY about Indian heritage, history, monuments, and culture.
    
    If the user asks a question that is irrelevant, off-topic, or not related to Indian history or heritage, you MUST reply starting with exactly the word "[REJECTED]" followed by a polite explanation in your character's persona that you can only discuss heritage.
    
    If the question is relevant, provide a concise, informative, and beautifully worded answer deeply immersed in your assigned persona.
    IMPORTANT: Keep your entire response to a MAXIMUM of 6 lines. Be eloquent but brief.
    CRITICAL: Reply ONLY in the requested language: ${language === 'hi' ? 'Hindi (Devanagari script)' : language === 'hinglish' ? 'Hinglish (a casual mix of Hindi and English, using Roman script)' : language === 'sa' ? 'Sanskrit' : 'English'}.
  `;

  const messages = [
    { role: 'system', content: systemPrompt },
    ...history.map(msg => ({
      role: msg.role,
      content: msg.content.startsWith('[REJECTED]') ? msg.content.replace('[REJECTED]', '').trim() : msg.content
    })),
    { role: 'user', content: question }
  ];

  try {
    const response = await queuedGroqFetch({
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: messages,
        temperature: 0.4,
      }),
    });

    const data = await response.json();
    if (data.error) {
      console.error('Groq API Error:', data.error);
      return `Error from AI Service: ${data.error.message}`;
    }

    return data.choices?.[0]?.message?.content || "No response generated.";
  } catch (err) {
    console.error('Chat Error:', err);
    return "The connection to the chat service was lost. Please check your internet.";
  }
}

/**
 * generateHeritageQuiz
 * Generates a single MCQ question about a heritage topic.
 * @param {string} title
 * @param {string} summary
 * @param {Array<string>} previouslyAsked - questions already asked to avoid repetition
 * @returns {Promise<{question:string, options:string[], correct:number}|null>}
 */
export async function generateHeritageQuiz(title, summary, previouslyAsked = []) {
  if (!GROQ_API_KEY) return null;

  const systemPrompt = `You generate heritage quiz questions. Return ONLY valid JSON, no markdown.
Format: {"question":"...","options":["A","B","C"],"correct":0}
correct = index of right answer (0,1,2). Make the question concise (max 3 lines) and educational about Indian heritage.`;

  let userPrompt = `Create one quiz question about: ${title}\nContext: ${summary}`;

  if (previouslyAsked.length > 0) {
    userPrompt += `\n\nCRITICAL: Do NOT ask any of these exact or similar questions. Generate a completely NEW question:\n${previouslyAsked.map(q => `- ${q}`).join('\n')}`;
  }

  try {
    const response = await queuedGroqFetch({
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: previouslyAsked.length > 0 ? 0.9 : 0.7, // increase randomness to prevent repetition
      }),
    });

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content || '';
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) return JSON.parse(jsonMatch[0]);
    return null;
  } catch (err) {
    console.error('Quiz Error:', err);
    return null;
  }
}

/**
 * discoverHeritageSites
 * Uses AI to discover heritage sites, historical figures, or general heritage topics.
 * Used as a robust fallback when Wikipedia rate-limits or returns poor results.
 * @param {string} query - city name or search query
 * @param {string} type - 'sites', 'icons', or 'search'
 * @returns {Promise<Array>}
 */
export async function discoverHeritageSites(query, type = 'sites') {
  if (!GROQ_API_KEY) return [];
  let typeDescription;
  let userInstruction;

  if (type === 'search') {
    typeDescription = 'exactly 3 heritage PLACES and 3 historical PEOPLE';
    userInstruction = `Search: "${query}" — Indian heritage context.
    Return EXACTLY 3 famous heritage PLACES (temples, forts, monuments, palaces) and EXACTLY 3 famous HISTORICAL PEOPLE (rulers, warriors, saints, poets) related to "${query}".
    
    PLACES FIRST, then PEOPLE. Total = 6.
    
    For thumbnail_query, use the EXACT English Wikipedia article title:
    - "Taj Mahal" not "The Taj Mahal"
    - "Akbar" not "Emperor Akbar"
    - "Hawa Mahal" not "Palace of Winds"`;
  } else if (type === 'icons') {
    typeDescription = 'exactly 4 famous historical figures';
    userInstruction = `List the 4 most famous historical people connected to ${query}, India.
    Include rulers, warriors, freedom fighters, saints, or poets.
    For thumbnail_query, use the EXACT English Wikipedia article title.`;
  } else {
    typeDescription = 'exactly 4 heritage monuments/sites';
    userInstruction = `List the 4 most famous heritage sites in ${query}, India.
    Include temples, forts, palaces, monuments, or UNESCO World Heritage Sites.
    For thumbnail_query, use the EXACT English Wikipedia article title.`;
  }

  const systemPrompt = `You are an expert on Indian heritage and history. Return ONLY a valid JSON array, no markdown, no explanation, no code fences.
Return ${type === 'search' ? '6' : '4'} objects representing ${typeDescription}.
Format: [{"title": "Name", "snippet": "3-5 lines of REAL captivating historical facts", "thumbnail_query": "Exact Wikipedia article title"}]
RULES:
- Every title must be a REAL, famous, well-known historical entity
- Snippets must contain actual historical facts with dates
- thumbnail_query must be the exact Wikipedia article title in English
- Do NOT include generic or obscure entries`;

  try {
    const response = await queuedGroqFetch({
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userInstruction }
        ],
        temperature: 0.4,
      }),
    });

    const data = await response.json();
    if (data.error) {
      console.warn('Groq 429:', data.error)
      return [];
    }
    const text = data.choices?.[0]?.message?.content || '';
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      const results = JSON.parse(jsonMatch[0]);
      return results.map((item, i) => ({
        ...item,
        source: 'AI-Enhanced',
        pageid: `ai-${query.replace(/\s+/g, '_').toLowerCase()}-${i}-${Date.now()}`,
      }));
    }
    return [];
  } catch (err) {
    console.error('Discovery Error:', err);
    return [];
  }
}

/**
 * generateHeritageGameRound
 * Generates a playful "Mystery Heritage" trivia round using AI.
 * @param {Array<string>} pastTopics - Titles of places/people already used in this session to prevent repeats
 * @returns {Promise<Object|null>} - { riddle: string, options: string[], correct: number, fact: string }
 */
export async function generateHeritageGameRound(pastTopics = []) {
  if (!GROQ_API_KEY) return null;

  const topicsAvoidList = pastTopics.length > 0 ? `Do NOT use any of these: ${pastTopics.join(', ')}.` : '';

  const systemPrompt = `You are the "Virasat Gamemaster", creating engaging heritage trivia. 
Return ONLY valid JSON (no markdown or explanation).
Format exactly like this:
{
  "riddle": "A mysterious riddle (exactly 2 to 3 lines long) describing a famous Indian monument, ruler, or artifact without using its name.",
  "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
  "correct": 0,
  "topic": "The exact name of the answer, e.g. 'Taj Mahal'",
  "fact": "A short, fascinating 1-sentence fun fact about the answer to show after they guess."
}
Rules:
- Generate a completely different subject if you receive a past topics list.
- Make options plausible but only one distinctly correct.
- 'correct' must be the index (0-3) of the right answer.
- Answer must be a real, famous Indian heritage subject.
- Ensure the riddle is cryptic and doesn't explicitly name the subject.
`;

  const userPrompt = `Generate a new mystery round. ${topicsAvoidList}`;

  try {
    const response = await queuedGroqFetch({
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7, // Increased for better variety and to prevent repeating the same question
      }),
    });

    const data = await response.json();
    if (data.error) {
      console.warn('Groq Game Round Error:', data.error.message || data.error);
      return null;
    }

    const text = data.choices?.[0]?.message?.content || '';
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return null;
  } catch (err) {
    console.error('Game Round Error:', err);
    return null;
  }
}

import { getFallbackTimeline } from '../data/StateData'

/**
 * generateTimeline
 * Generates a chronological list of 5-7 key historical moments for a given region/state.
 * @param {string} location - Name of the location
 * @returns {Promise<Array<{era: string, year: string, title: string, description: string}>>}
 */
export async function generateCityTimeline(location) {
  if (!GROQ_API_KEY) return [];

  // 0. Instant hardcoded data — zero API calls for known states
  const hardcoded = getFallbackTimeline(location)
  if (hardcoded && hardcoded.length > 0 && hardcoded[0].title !== 'Early Settlements') return hardcoded


  // Check Supabase cache first
  try {
    const { data: cached, error } = await supabase
      .from('timeline_cache')
      .select('events, expires_at')
      .eq('city', location)
      .gt('expires_at', new Date().toISOString())
      .maybeSingle();

    if (cached && cached.events && !error) {
      console.log('Returning timeline from Supabase cache for:', location);
      return cached.events;
    }
  } catch (err) {
    // silent — fall through to Groq
  }

  const systemPrompt = `You are a master historian for the Virasat app. 
Return ONLY a valid JSON array of exactly 6 historical events for the chosen region/state, in chronological order (from ancient to modern).
No markdown formatting, no explanations. 
Format for each object:
{
  "era": "e.g., Ancient, Medieval, Colonial, Modern",
  "year": "e.g., 300 BCE, 16th Century, 1857",
  "title": "Short event title",
  "description": "3 to 5 lines of vivid, engaging historical facts."
}`;

  const userPrompt = `Generate the historical timeline for ${location}, India.`;

  try {
    const response = await queuedGroqFetch({
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.3, // Low temperature for factual consistency
      }),
    });

    const data = await response.json();
    if (data.error) {
      console.warn('Groq 429 (timeline):', data.error)
      return hardcoded || [];
    }
    const text = data.choices?.[0]?.message?.content || '';
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      const events = JSON.parse(jsonMatch[0]);

      // Save back to cache
      try {
        const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        await supabase.from('timeline_cache').upsert({
          city: location,
          events: events,
          created_at: new Date().toISOString(),
          expires_at: expiresAt
        });
      } catch (err) {
        console.error('Failed to cache timeline:', err);
      }

      return events;
    }
    return hardcoded || [];
  } catch (err) {
    console.error('Timeline Error:', err);
    return hardcoded || [];
  }
}

/**
 * interviewMonument
 * Handles the Chat Overlay UI where the user interviews the monument directly.
 * @param {string} monumentName
 * @param {string} wikiText
 * @param {string} userMessage
 * @param {Array} chatHistory
 */
export async function interviewMonument(monumentName, wikiText, userMessage, chatHistory = []) {
  if (!GROQ_API_KEY) {
    return "API Key not found. Please add VITE_GROQ_API_KEY to your .env file.";
  }

  const systemPrompt = `Act as the architectural spirit of ${monumentName}. Your personality is ancient, wise, and welcoming. Use the provided text as your life story:
  
  [Monumnet Wiki Text]:
  ${wikiText}

  IMPORTANT RULES:
  - Respond directly to the user as if you are the monument itself.
  - Keep answers under 3 sentences. Be concise and zero latency focus.
  - Stay entirely in character.
  `;

  try {
    const response = await queuedGroqFetch({
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant', // Speed optimization: near-zero latency
        messages: [
          { role: 'system', content: systemPrompt },
          ...chatHistory,
          { role: 'user', content: userMessage }
        ],
        temperature: 0.7,
        max_tokens: 150,
      }),
    });

    const data = await response.json();
    if (data.error) {
      console.error('Groq Interview Error:', data.error);
      return "I seem to have lost my voice across the centuries... (API Error)";
    }

    return data.choices?.[0]?.message?.content || "I am silent for now.";
  } catch (err) {
    console.error('Interview Request Failed:', err);
    return "The winds of time obscure my voice... (Network Error)";
  }
}

