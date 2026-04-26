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

/* ═══════════════════════════════════════════
   HARDCODED CITY TIMELINES
   Instant fallback so the timeline never shows empty
   for the most common heritage cities.
   ═══════════════════════════════════════════ */
const CITY_TIMELINES = {
  jaipur: [
    { era: 'Ancient', year: '~1000 BCE', title: 'Meena & Gurjar Settlements', description: 'The region around modern Jaipur was home to Meena and Gurjar tribes long before recorded history, with evidence of habitation dating to the pre-historic era.' },
    { era: 'Medieval', year: '1150 CE', title: 'Amber Kingdom Founded', description: 'The Rajput Kachhwaha clan established the Amber Kingdom, which would become the predecessor state to Jaipur, building the iconic hilltop Amber Fort.' },
    { era: 'Medieval', year: '1627', title: 'Jai Singh II Born', description: 'Sawai Jai Singh II, the visionary astronomer-king, is born. He would go on to found Jaipur and build the Jantar Mantar observatories across India.' },
    { era: 'Early Modern', year: '1727', title: 'Jaipur Founded', description: 'Sawai Jai Singh II founded Jaipur — the first planned city in India — designed by architect Vidyadhar Bhattacharya on a precise grid following ancient Vastu Shastra.' },
    { era: 'Colonial', year: '1876', title: 'City Painted Pink', description: 'Maharaja Ram Singh II had the entire city painted terracotta pink to welcome the Prince of Wales (Edward VII), earning Jaipur the nickname "Pink City."' },
    { era: 'Modern', year: '1949', title: 'Merger with India', description: 'After Indian independence, the Jaipur State merged with the Indian Union in 1949. Jaipur became the capital of the newly formed state of Rajasthan.' },
  ],
  udaipur: [
    { era: 'Ancient', year: '734 CE', title: 'Mewar Dynasty Rises', description: 'Bappa Rawal founded the Mewar kingdom, one of the oldest and most storied Hindu royal dynasties in the world, who would rule for over 1400 years.' },
    { era: 'Medieval', year: '1303', title: 'Fall of Chittorgarh', description: 'Alauddin Khilji besieged Chittorgarh. Queen Padmini led the legendary act of Jauhar — mass self-immolation — to preserve honour, a defining moment in Rajput history.' },
    { era: 'Medieval', year: '1559', title: 'Udaipur Founded', description: 'Maharana Udai Singh II founded Udaipur on the banks of Lake Pichola after the fall of Chittorgarh, establishing it as the new capital of Mewar.' },
    { era: 'Medieval', year: '1576', title: 'Battle of Haldighati', description: 'Maharana Pratap faced the Mughal emperor Akbar\'s forces under Man Singh I. Though tactically inconclusive, Pratap\'s resistance became a symbol of Rajput valor.' },
    { era: 'Colonial', year: '1818', title: 'British Treaty', description: 'The Mewar kingdom signed a treaty with the British East India Company, becoming a princely state under British suzerainty while retaining nominal autonomy.' },
    { era: 'Modern', year: '1971', title: 'City of Lakes Fame', description: 'Udaipur was recognised globally as the "Venice of the East," with its palaces, lakes, and heritage drawing international tourists and filmmakers alike.' },
  ],
  varanasi: [
    { era: 'Ancient', year: '~1200 BCE', title: 'City of Shiva Founded', description: 'Varanasi is one of the world\'s oldest continuously inhabited cities, sacred to Hindus as the abode of Lord Shiva, with Vedic rituals performed since at least 1200 BCE.' },
    { era: 'Ancient', year: '528 BCE', title: 'Buddha\'s First Sermon', description: 'Near Varanasi at Sarnath, Siddhartha Gautama delivered his first sermon after attaining enlightenment, setting in motion the Wheel of Dharma.' },
    { era: 'Medieval', year: '1194', title: 'Ghurids Sack Varanasi', description: 'Muhammad of Ghor\'s forces destroyed thousands of temples in Varanasi, erasing much of its ancient architectural heritage. The city rebuilt itself over centuries.' },
    { era: 'Mughal', year: '1585', title: 'Akbar\'s Temple Grants', description: 'Emperor Akbar, known for his religious tolerance, granted land for the construction of the Vishwanath Temple, marking a rare period of harmony between the Mughals and Varanasi\'s Hindus.' },
    { era: 'Colonial', year: '1780s', title: 'Benares Kingdom', description: 'The Benares Kingdom rose under Chet Singh, who famously resisted Warren Hastings\' excessive tax demands, triggering a major revolt against British authority.' },
    { era: 'Modern', year: '2014', title: 'Narendra Modi Elected', description: 'Varanasi became the parliamentary constituency of Narendra Modi, who won the 2014 Lok Sabha election from here, marking a new political chapter for the ancient city.' },
  ],
  agra: [
    { era: 'Ancient', year: '~1000 CE', title: 'Early Settlements', description: 'The Agra region, mentioned in the Sanskrit epic Mahabharata as Agrabana (forest of Agra), was an important hub on the Yamuna river long before Mughal rule.' },
    { era: 'Medieval', year: '1504', title: 'Sikandar Lodi Founds Agra', description: 'Sultan Sikandar Lodi moved his capital from Delhi to Agra in 1504, establishing it as a major city for the first time and initiating its era of imperial importance.' },
    { era: 'Mughal', year: '1526', title: 'Babur Captures Agra', description: 'After defeating Ibrahim Lodi at the First Battle of Panipat, Babur captured Agra and its legendary Koh-i-Noor diamond, establishing the Mughal Empire\'s first capital here.' },
    { era: 'Mughal', year: '1632', title: 'Taj Mahal Construction Begins', description: 'Emperor Shah Jahan commissioned the Taj Mahal in memory of his wife Mumtaz Mahal, who died during childbirth. Over 20,000 artisans worked for 22 years to complete it.' },
    { era: 'Colonial', year: '1803', title: 'British Capture Agra', description: 'The British East India Company defeated the Marathas and captured Agra, making it the capital of the North-Western Provinces and a key administrative centre.' },
    { era: 'Modern', year: '1983', title: 'UNESCO World Heritage', description: 'The Taj Mahal, Agra Fort, and Fatehpur Sikri were designated UNESCO World Heritage Sites, cementing Agra\'s status as the crown jewel of Indian heritage tourism.' },
  ],
  delhi: [
    { era: 'Ancient', year: '~900 BCE', title: 'Indraprastha Founded', description: 'The Mahabharata describes Indraprastha as the capital of the Pandavas, believed to be located near modern Delhi — one of the earliest references to human settlement in the region.' },
    { era: 'Medieval', year: '1193', title: 'Delhi Sultanate Begins', description: 'Qutb-ud-din Aibak captured Delhi from the last Hindu ruler, establishing the Delhi Sultanate and beginning 320 years of Sultanate rule that shaped India\'s medieval identity.' },
    { era: 'Medieval', year: '1526', title: 'Mughal Empire Established', description: 'Babur defeated Ibrahim Lodi at Panipat and established the Mughal Empire, which would rule from Delhi for three centuries and leave monuments that define the city today.' },
    { era: 'Mughal', year: '1648', title: 'Shahjahanabad Built', description: 'Shah Jahan built his new capital Shahjahanabad (Old Delhi), including the iconic Red Fort and Jama Masjid, making Delhi the grandest city in Asia at the time.' },
    { era: 'Colonial', year: '1911', title: 'Capital Moved to Delhi', description: 'The British moved India\'s capital from Calcutta to Delhi, and began building New Delhi — designed by Edwin Lutyens — as a grand imperial capital.' },
    { era: 'Modern', year: '1947', title: 'Independence & Partition', description: 'India gained independence on 15 August 1947. Delhi witnessed both the joy of freedom and the trauma of Partition, with millions of refugees arriving from the newly formed Pakistan.' },
  ],
  amritsar: [
    { era: 'Medieval', year: '1577', title: 'City Founded', description: 'The fourth Sikh Guru, Guru Ram Das, founded Amritsar and excavated the sacred Amrit Sarovar (Pool of Nectar) around which the city would grow.' },
    { era: 'Sikh', year: '1604', title: 'Golden Temple Completed', description: 'Guru Arjan Dev, the fifth Sikh Guru, completed the construction of Harmandir Sahib (the Golden Temple) and installed the Adi Granth (Sikh scripture) within it.' },
    { era: 'Sikh', year: '1799', title: 'Ranjit Singh Captures Amritsar', description: 'Maharaja Ranjit Singh captured Amritsar and made it the cultural and spiritual heart of his mighty Sikh Empire, which stretched from the Khyber Pass to the Sutlej River.' },
    { era: 'Colonial', year: '1849', title: 'British Annexation of Punjab', description: 'After the Anglo-Sikh Wars, the British East India Company annexed Punjab and took control of the Koh-i-Noor diamond from the Sikh Empire.' },
    { era: 'Colonial', year: '1919', title: 'Jallianwala Bagh Massacre', description: 'British General Dyer ordered troops to fire on unarmed civilians in the enclosed Jallianwala Bagh garden, killing over 1,000 people — a pivotal moment in India\'s independence movement.' },
    { era: 'Modern', year: '1947', title: 'Partition & Independence', description: 'Amritsar, located near the newly drawn Pakistan border, became a focal point of the violent Partition of India, with the city witnessing mass migration and communal violence.' },
  ],
  hampi: [
    { era: 'Ancient', year: '~300 CE', title: 'Kishkindha — Land of Vanaras', description: 'Ancient Hindu texts describe the Hampi region as Kishkindha — the realm of the monkey god Sugriva from the Ramayana — marking it as a sacred site long before Vijayanagara.' },
    { era: 'Medieval', year: '1336', title: 'Vijayanagara Empire Founded', description: 'Brothers Harihara and Bukka Raya founded the Vijayanagara Empire at Hampi, establishing what would become the last great Hindu empire of South India, a bulwark against Sultanate expansion.' },
    { era: 'Medieval', year: '1510', title: 'Golden Age of Krishnadevaraya', description: 'Under Emperor Krishnadevaraya, Vijayanagara became one of the largest cities in the world with a population of 500,000, famous for its grand temples, bazaars, and learning.' },
    { era: 'Medieval', year: '1565', title: 'Battle of Talikota', description: 'A coalition of five Deccan Sultanates defeated Vijayanagara at the Battle of Talikota. The magnificent capital was sacked and burned for months, leaving the ruins we see today.' },
    { era: 'Colonial', year: '1800s', title: 'Rediscovery by British', description: 'British surveyors and archaeologists "rediscovered" Hampi\'s ruins in the 19th century, sparking scholarly interest in the lost grandeur of the Vijayanagara Empire.' },
    { era: 'Modern', year: '1986', title: 'UNESCO World Heritage Site', description: 'Hampi was inscribed as a UNESCO World Heritage Site, recognising its extraordinary collection of over 1,600 surviving monuments spanning 25 sq km of rocky landscape.' },
  ],
  mumbai: [
    { era: 'Ancient', year: '~250 BCE', title: 'Ashoka\'s Inscriptions Nearby', description: 'Rock edicts of Emperor Ashoka found near Mumbai indicate the region was part of the Mauryan Empire. The seven islands that would become Mumbai were home to Koli fishing communities.' },
    { era: 'Medieval', year: '1343', title: 'Muslim Sultanate Rule', description: 'The islands of Mumbai came under the Gujarat Sultanate, which built several mosques and established trade routes. The Koli and Agri communities continued to inhabit the islands.' },
    { era: 'Colonial', year: '1661', title: 'Gifted to Britain', description: 'The islands of Bombay were gifted to King Charles II of England as part of the dowry of Catherine of Braganza of Portugal, and then leased to the East India Company for £10 per year.' },
    { era: 'Colonial', year: '1853', title: 'First Railway in Asia', description: 'India\'s first passenger railway line opened between Bombay and Thane on 16 April 1853 — the first railway in all of Asia — transforming Bombay into a modern industrial city.' },
    { era: 'Nationalist', year: '1942', title: 'Quit India Movement', description: 'Gandhi launched the Quit India Movement from Bombay\'s Gowalia Tank Maidan on 8 August 1942, demanding an end to British rule in the most decisive call of the independence struggle.' },
    { era: 'Modern', year: '1995', title: 'Renamed Mumbai', description: 'Bombay was officially renamed Mumbai by the Shiv Sena-led state government, reclaiming the city\'s original Marathi name derived from the goddess Mumbadevi.' },
  ],
  kota: [
    { era: 'Ancient', year: '12th Century', title: 'Kota Region Origins', description: 'The region, once part of the kingdom of Bundi, was given as a jagir (fiefdom) to princes of the Chauhan clan. It was originally inhabited by the Bhil tribes.' },
    { era: 'Medieval', year: '1241', title: 'Prince Jait Singh Captures Kota', description: 'Prince Jait Singh of Bundi defeated the Bhil chieftain Kotiya and captured the region, naming it Kota in his honour and establishing it as a separate principality.' },
    { era: 'Mughal', year: '1631', title: 'Independent Statehood', description: 'Emperor Shah Jahan granted Kota the status of an independent state under Madho Singh, separating it from Bundi as a reward for his military service to the Mughals.' },
    { era: 'Late Modern', year: '18th Century', title: 'The Rise of Zalim Singh', description: 'The brilliant administrator and diplomat Zalim Singh became the de facto ruler, building several fortifications and making Kota an oasis of stability during the Maratha wars.' },
    { era: 'Colonial', year: '1818', title: 'British Alliance', description: 'Kota was one of the first Rajput states to sign a treaty of subsidiary alliance with the British East India Company, ensuring its protection and administrative continuity.' },
    { era: 'Modern', year: '1948', title: 'Integration with Rajasthan', description: 'After Indian independence, the princely state of Kota merged into the United State of Rajasthan, eventually becoming part of the current state of Rajasthan.' },
  ],
}

/**
 * generateCityTimeline
 * Generates a chronological list of 5-7 key historical moments for a given city.
 * @param {string} city - Name of the city
 * @returns {Promise<Array<{era: string, year: string, title: string, description: string}>>}
 */
export async function generateCityTimeline(city) {
  if (!GROQ_API_KEY) return [];

  // 0. Instant hardcoded data — zero API calls for known cities
  const hardcoded = CITY_TIMELINES[city.trim().toLowerCase()]
  if (hardcoded) return hardcoded


  // Check Supabase cache first
  try {
    const { data: cached, error } = await supabase
      .from('timeline_cache')
      .select('events, expires_at')
      .eq('city', city)
      .gt('expires_at', new Date().toISOString())
      .maybeSingle();

    if (cached && cached.events && !error) {
      console.log('Returning timeline from Supabase cache for:', city);
      return cached.events;
    }
  } catch (err) {
    // silent — fall through to Groq
  }

  const systemPrompt = `You are a master historian for the Virasat app. 
Return ONLY a valid JSON array of exactly 6 historical events for the chosen city, in chronological order (from ancient to modern).
No markdown formatting, no explanations. 
Format for each object:
{
  "era": "e.g., Ancient, Medieval, Colonial, Modern",
  "year": "e.g., 300 BCE, 16th Century, 1857",
  "title": "Short event title",
  "description": "3 to 5 lines of vivid, engaging historical facts."
}`;

  const userPrompt = `Generate the historical timeline for ${city}, India.`;

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
      return [];
    }
    const text = data.choices?.[0]?.message?.content || '';
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      const events = JSON.parse(jsonMatch[0]);

      // Save back to cache
      try {
        const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        await supabase.from('timeline_cache').upsert({
          city: city,
          events: events,
          created_at: new Date().toISOString(),
          expires_at: expiresAt
        });
      } catch (err) {
        console.error('Failed to cache timeline:', err);
      }

      return events;
    }
    return [];
  } catch (err) {
    console.error('Timeline Error:', err);
    return [];
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

