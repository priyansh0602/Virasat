/**
 * Dashboard.jsx
 * Virasat Heritage Knowledge Base — Cinematic Immersive Dashboard
 * Heavy scroll-driven animations, parallax, chapter dividers, dramatic reveals
 */
import React, { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useInView } from 'framer-motion'
import { supabase } from '../lib/SupabaseClient'
import { searchWikipedia, geoSearchHeritage, getArticleSummary, geocodeCityIndia, fetchHeritageIcons } from '../services/WikipediaService'
import { discoverHeritageSites, generateHeritageStory, chatWithHeritage, generateHeritageQuiz, generateCityTimeline, chatWithGlobalHeritage } from '../services/GroqService'
import { STATE_HERITAGE } from '../data/StateData'

import HeritageMap from './HeritageMap'
import Timeline from './Timeline'
import MonumentChat from './MonumentChat'
import {
  Search, MapPin, BookOpen, Sparkles, Globe, LogOut, ChevronDown,
  Loader2, ExternalLink, Landmark, X, Languages, RefreshCw, User, Scroll as ScrollIcon,
  MessageCircle, Send, AlertTriangle, Volume2, VolumeX, Trophy, Award, HelpCircle, CheckCircle, XCircle, Gamepad2, Hourglass, Glasses
} from 'lucide-react'

const PERSONAS = [
  { id: 'bard', label: 'Virasat Bard', icon: ScrollIcon, desc: "A brilliant, poetic heritage storyteller blending history with famous myths and folklore." },
  { id: 'archaeologist', label: 'The Archaeologist', icon: Glasses, desc: "Gives technical, gritty details about materials, mortar, and architectural geometry." },
  { id: 'grandfather', label: 'The Grandfather', icon: User, desc: "Tells a warm, nostalgic folk-tale version of the history emphasizing memory." },
  { id: 'time-traveler', label: 'The Time Traveler', icon: Hourglass, desc: "Describes what the place looked, smelled, and sounded like 500 years ago." }
]

/* ═══════════════════════════════════════════
   TRANSLATIONS
   ═══════════════════════════════════════════ */
const TRANSLATIONS = {
  en: {
    tagline: "Explore India's Living Heritage",
    searchPlaceholder: 'Search monuments, temples, dynasties…',
    nearbyTitle: 'Heritage Near You',
    iconsTitle: 'Legacy of the Land',
    globalTitle: 'Search Results',
    generateStory: 'Generate Story',
    readMore: 'Read More',
    queries: 'Queries',
    chatPlaceholder: 'Ask about this...',
    noResults: 'No results found. Try a different search.',
    loading: 'Discovering stories…',
    storyTitle: 'AI Heritage Narrative',
  },
  hi: {
    tagline: 'भारत की जीवंत विरासत का अन्वेषण करें',
    searchPlaceholder: 'स्मारक, मंदिर, राजवंश खोजें…',
    nearbyTitle: 'आपके पास की विरासत',
    iconsTitle: 'भूमि की विरासत',
    globalTitle: 'खोज परिणाम',
    generateStory: 'कहानी बनाएं',
    readMore: 'और पढ़ें',
    queries: 'प्रश्न पूछें',
    chatPlaceholder: 'इसके बारे में पूछें...',
    noResults: 'कोई परिणाम नहीं मिला।',
    loading: 'कहानियाँ खोज रहे हैं…',
    storyTitle: 'AI विरासत कथा',
  },
  sa: {
    tagline: 'भारतस्य जीवन्तं विरासतं अन्वेषयन्तु',
    searchPlaceholder: 'स्मारकाणि, मन्दिराणि, वंशाः…',
    nearbyTitle: 'समीपे विरासतम्',
    iconsTitle: 'पूर्वजानां महत्ता',
    globalTitle: 'अन्वेषण फलम्',
    generateStory: 'कथा रचयतु',
    readMore: 'अधिकं पठतु',
    queries: 'प्रश्नाः',
    chatPlaceholder: 'अत्र पृच्छतु...',
    noResults: 'फलं न प्राप्तम्।',
    loading: 'कथाः अन्विष्यन्ते…',
    storyTitle: 'AI विरासत कथा',
  },
}

const LANGUAGES_LIST = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिन्दी' },
  { code: 'sa', label: 'संस्कृतम्' },
]

/* ═══════════════════════════════════════════
   AUDIO NARRATOR
   ═══════════════════════════════════════════ */
function narrateText(text, langCode, onEnd) {
  window.speechSynthesis.cancel()
  const u = new SpeechSynthesisUtterance(text)
  u.rate = 0.9; u.pitch = 1.05
  u.lang = (langCode === 'hi' || langCode === 'sa') ? 'hi-IN' : 'en-IN'
  const voices = window.speechSynthesis.getVoices()
  let narrator = null
  if (langCode === 'hi' || langCode === 'sa') {
    narrator = voices.find(v => v.lang.toLowerCase().includes('hi') || /hindi/i.test(v.name))
  } else {
    narrator = voices.find(v => /Daniel|David|Mark/i.test(v.name)) || voices.find(v => /en/i.test(v.lang))
  }
  if (narrator) u.voice = narrator
  u.onend = onEnd
  window.speechSynthesis.speak(u)
}

/* ═══════════════════════════════════════════
   CINEMATIC SCROLL COMPONENTS
   ═══════════════════════════════════════════ */

/* Scroll Progress Bar (top of page) */
function ScrollProgress() {
  return null
}

/* Parallax Section Wrapper */
function ParallaxSection({ children, className = '', speed = 0.3 }) {
  return <section className={className}>{children}</section>
}

/* Chapter Divider — ornamental separator between sections */
function ChapterDivider({ title, number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  return (
    <div ref={ref} className="py-16 flex flex-col items-center gap-4">
      <motion.div
        className="flex items-center gap-6 w-full max-w-md"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 1.2 }}
      >
        <motion.div
          className="flex-1 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, #d4a853, transparent)' }}
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : {}}
          transition={{ duration: 1.5, delay: 0.2 }}
        />
        <motion.span
          className="text-regal-gold/40 text-lg"
          initial={{ scale: 0, rotate: -180 }}
          animate={isInView ? { scale: 1, rotate: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.5, type: 'spring' }}
        >
          ❖
        </motion.span>
        <motion.div
          className="flex-1 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, #d4a853, transparent)' }}
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : {}}
          transition={{ duration: 1.5, delay: 0.2 }}
        />
      </motion.div>
      {title && (
        <motion.p
          className="font-cinzel text-xs tracking-[0.5em] text-regal-gold/30 uppercase"
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          {number && <span className="text-regal-gold/20 mr-2">{'0' + number}.</span>}
          {title}
        </motion.p>
      )}
    </div>
  )
}

/* Animated Counter */
function AnimatedCounter({ value, duration = 2 }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!isInView) return
    let start = 0
    const step = Math.ceil(value / (duration * 60))
    const timer = setInterval(() => {
      start += step
      if (start >= value) { setCount(value); clearInterval(timer) }
      else setCount(start)
    }, 1000 / 60)
    return () => clearInterval(timer)
  }, [isInView, value, duration])
  return <span ref={ref}>{count}</span>
}

/* Text Reveal — words appearing one by one */
function TextReveal({ text, className = '', delay = 0 }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })
  const words = text.split(' ')
  return (
    <span ref={ref} className={className}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          className="inline-block mr-[0.3em]"
          initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
          animate={isInView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
          transition={{ duration: 0.5, delay: delay + i * 0.06, ease: [0.16, 1, 0.3, 1] }}
        >
          {word}
        </motion.span>
      ))}
    </span>
  )
}

/* Typewriter Text — characters appear one by one for chat AI responses */
function TypewriterText({ text, speed = 18 }) {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)
  useEffect(() => {
    setDisplayed('')
    setDone(false)
    let i = 0
    const timer = setInterval(() => {
      i++
      if (i >= text.length) { setDisplayed(text); setDone(true); clearInterval(timer) }
      else setDisplayed(text.slice(0, i))
    }, speed)
    return () => clearInterval(timer)
  }, [text, speed])
  return <span>{displayed}{!done && <span className="inline-block w-[2px] h-[1em] bg-regal-gold/70 ml-0.5 animate-pulse align-middle" />}</span>
}

/* Floating Decorative Mandala */
function FloatingMandala({ side = 'left', top = '20%' }) {
  return (
    <div
      className="absolute pointer-events-none opacity-[0.06]"
      style={{
        [side]: '-80px',
        top,
      }}
    >
      <svg width="200" height="200" viewBox="0 0 200 200" fill="none">
        <circle cx="100" cy="100" r="90" stroke="#d4a853" strokeWidth="0.5" />
        <circle cx="100" cy="100" r="70" stroke="#d4a853" strokeWidth="0.3" />
        <circle cx="100" cy="100" r="50" stroke="#d4a853" strokeWidth="0.3" />
        {[0, 30, 60, 90, 120, 150].map(angle => (
          <line key={angle} x1="100" y1="10" x2="100" y2="190"
            stroke="#d4a853" strokeWidth="0.2"
            transform={`rotate(${angle} 100 100)`} />
        ))}
        {[0, 45, 90, 135, 180, 225, 270, 315].map(angle => (
          <circle key={angle} cx="100" cy="20" r="3" fill="#d4a853" fillOpacity="0.3"
            transform={`rotate(${angle} 100 100)`} />
        ))}
      </svg>
    </div>
  )
}

/* Floating Ancient Animations Overlay */
function AncientAnimations() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-[0.15]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(212,168,83,0.12),transparent_25%),radial-gradient(circle_at_80%_20%,rgba(212,168,83,0.08),transparent_20%)]" />

      {/* Floating Diya (Lamp) */}
      <div className="absolute bottom-20 left-[10%]">
        <svg width="60" height="60" viewBox="0 0 100 100" fill="none">
          <path d="M50 20 C60 40 60 50 50 60 C40 50 40 40 50 20 Z" fill="#d4a853" opacity="0.7" />
          {/* Base */}
          <path d="M20 60 Q50 90 80 60 Z" fill="#b8860b" />
          <path d="M30 60 L70 60" stroke="#d4a853" strokeWidth="2" />
        </svg>
      </div>

      {/* Abstract Sitar/Veena Silhouette */}
      <div className="absolute top-1/4 right-[5%] opacity-70">
        <svg width="120" height="200" viewBox="0 0 100 200" fill="none">
          <circle cx="50" cy="150" r="40" stroke="#d4a853" strokeWidth="2" />
          <path d="M50 110 L50 20" stroke="#d4a853" strokeWidth="8" strokeLinecap="round" />
          <path d="M45 20 L55 20 M45 40 L55 40 M45 60 L55 60" stroke="#d4a853" strokeWidth="2" />
          <path d="M48 20 L48 150 M52 20 L52 150" stroke="#d4a853" strokeWidth="0.5" />
          {/* Decorative motif */}
          <circle cx="50" cy="150" r="30" stroke="#d4a853" strokeWidth="0.5" strokeDasharray="3 3" />
        </svg>
      </div>

      {/* Floating Lotus Element */}
      <div className="absolute top-[60%] left-[20%] opacity-40">
        <svg width="80" height="80" viewBox="0 0 100 100" fill="none">
          {[0, 45, 90, 135, 180, 225, 270, 315].map(angle => (
            <path key={angle} d="M50 50 Q70 20 50 10 Q30 20 50 50 Z" stroke="#d4a853" strokeWidth="1" transform={`rotate(${angle} 50 50)`} />
          ))}
          <circle cx="50" cy="50" r="10" stroke="#d4a853" strokeWidth="2" />
        </svg>
      </div>

      {/* Ancient Temple Pillar / Column Silhouette */}
      <div className="absolute top-0 right-[20%] opacity-60">
        <svg width="40" height="300" viewBox="0 0 40 300" fill="none">
          <path d="M0 0 L40 0 L35 20 L5 20 Z" fill="#d4a853" />
          <rect x="10" y="20" width="20" height="260" stroke="#d4a853" strokeWidth="1" strokeDasharray="10 5" />
          <path d="M5 280 L35 280 L40 300 L0 300 Z" fill="#d4a853" />
          {/* Carving details */}
          <circle cx="20" cy="150" r="5" stroke="#d4a853" strokeWidth="1" />
          <path d="M15 140 L25 160 M15 160 L25 140" stroke="#d4a853" strokeWidth="1" />
        </svg>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════
   HERITAGE CARD (Cinematic)
   ═══════════════════════════════════════════ */
function HeritageCard({ item, t, lang, user, onBadgeEarned, index, persona = 'bard' }) {
  const [detail, setDetail] = useState(null)
  const [loading, setLoad] = useState(false)
  const [showStory, setShow] = useState(false)
  const [storyLoad, setStory] = useState(false)
  const [storyText, setStoryText] = useState('')
  const [showChat, setShowChat] = useState(false)
  const [chatHistory, setChatHistory] = useState([])
  const [chatInput, setChatInput] = useState('')
  const [chatLoad, setChatLoad] = useState(false)
  const [chatLang, setChatLang] = useState('en')
  const [speaking, setSpeaking] = useState(false)
  const [quiz, setQuiz] = useState(null)
  const [quizLoad, setQuizLoad] = useState(false)
  const [quizAnswer, setQuizAnswer] = useState(null)
  const [badgeAwarded, setBadgeAwarded] = useState(false)
  const [pastQuestions, setPastQuestions] = useState([])

  const [imgError, setImgError] = useState(false)
  const [showInterview, setShowInterview] = useState(false)
  const cardRef = useRef(null)
  const isInView = useInView(cardRef, { once: true, margin: '-60px' })

  const activePersona = PERSONAS.find(p => p.id === persona) || PERSONAS[0]

  const loadDetail = useCallback(async () => {
    if (detail || loading) return
    
    // Short-circuit API if we already have hardcoded description and image
    if (item.snippet && item.thumbnail) {
      setDetail({
        extract: item.snippet,
        thumbnail: item.thumbnail,
        title: item.title,
        url: `https://en.wikipedia.org/wiki/${encodeURIComponent(item.title.replace(/ /g, '_'))}`
      })
      return
    }

    setLoad(true)
    // Pass title or query hint for smarter image matching, especially for AI-discovered items
    const d = await getArticleSummary(item.pageid, item.thumbnail_query || item.title)
    setDetail(d)
    setLoad(false)
  }, [item.pageid, item.title, item.thumbnail_query, item.snippet, item.thumbnail, detail, loading])

  // Only fetch details when the card scrolls into view — saves dozens of API calls
  useEffect(() => { if (isInView) loadDetail() }, [isInView, loadDetail])

  const toggleNarration = () => {
    if (speaking) { window.speechSynthesis.cancel(); setSpeaking(false); return }
    const text = storyText || detail?.extract || ''
    if (!text) return
    setSpeaking(true)
    narrateText(text, lang, () => setSpeaking(false))
  }

  const startQuiz = async () => {
    setQuiz(null); // Clear previous quiz immediately
    setQuizLoad(true); setQuizAnswer(null); setBadgeAwarded(false)
    const excerpt = detail?.extract || cleanSnippet(item.snippet || '')
    const q = await generateHeritageQuiz(item.title, excerpt, pastQuestions)
    if (q) setPastQuestions(prev => [...prev, q.question])
    setQuiz(q); setQuizLoad(false)
  }

  const handleQuizAnswer = async (idx) => {
    setQuizAnswer(idx)
    if (quiz && idx === quiz.correct) {
      setBadgeAwarded(true)
      if (user?.id && user.id !== 'test-user-id') {
        try {
          await supabase.from('user_badges').upsert({
            user_id: user.id, site_id: String(item.pageid),
            site_title: item.title, badge_type: 'explorer'
          }, { onConflict: 'user_id,site_id,badge_type' })
        } catch (e) { console.error('Badge save:', e) }
      }
      onBadgeEarned?.(item.title)
    }
  }



  const generateStory = useCallback(async () => {
    setShowChat(false); setQuiz(null); setStory(true); setShow(true)
    const excerpt = detail?.extract || cleanSnippet(item.snippet || '')
    const story = await generateHeritageStory(item.title, excerpt, lang, persona)
    setStoryText(story); setStory(false)
  }, [detail, item, lang, persona])

  // Automatically regenerate the story if the persona changes while reading
  useEffect(() => {
    if (showStory && !storyLoad) {
      generateStory()
    }
  }, [persona])

  const handleChatSubmit = async (e) => {
    e.preventDefault()
    if (!chatInput.trim() || chatLoad) return
    const userMsg = chatInput.trim(); setChatInput('')
    const newHistory = [...chatHistory, { role: 'user', content: userMsg }]
    setChatHistory(newHistory); setChatLoad(true)
    const excerpt = detail?.extract || cleanSnippet(item.snippet || '')
    const aiResponse = await chatWithHeritage(item.title, excerpt, userMsg, chatHistory, chatLang, persona)
    setChatHistory([...newHistory, { role: 'assistant', content: aiResponse }]); setChatLoad(false)
  }

  const cleanSnippet = (html) => html?.replace(/<[^>]+>/g, '').replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&#039;/g, "'") ?? ''
  const snippet = detail?.extract || cleanSnippet(item.snippet || '')
  // Prefer the item's built-in thumbnail (from our rich fallback data) then detail's
  const thumb = item.thumbnail || detail?.thumbnail

  return (
    <motion.div
      ref={cardRef}
      className="card-heritage overflow-hidden group relative"
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.7, delay: (index % 4) * 0.1, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -6, transition: { duration: 0.3 } }}
    >
      {/* Gold shimmer on hover */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-regal-gold/5 to-transparent z-10 pointer-events-none"
        initial={{ x: '-100%' }}
        whileHover={{ x: '100%' }}
        transition={{ duration: 0.8 }}
      />

      {/* Thumbnail */}
      {thumb && !imgError ? (
        <div className="h-48 overflow-hidden relative">
          <motion.img
            src={thumb} alt={item.title}
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.12 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            onError={() => setImgError(true)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-heritage-950 via-heritage-950/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="font-cinzel text-base text-parchment leading-snug drop-shadow-lg tracking-wide">
              {item.title}
            </h3>
            {item.source === 'AI-Enhanced' && (
              <span className="inline-block mt-1 text-[8px] font-cinzel text-regal-gold border border-regal-gold/30 rounded-full px-2 py-0.5 bg-heritage-950/60 backdrop-blur-sm">
                AI Discovery
              </span>
            )}
          </div>
        </div>
      ) : (
        <div className="h-40 bg-gradient-to-br from-heritage-900 to-heritage-950 flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-noise" />
          <div className="absolute top-2 right-2">
            {item.source === 'AI-Enhanced' && (
              <span className="text-[8px] font-cinzel text-regal-gold border border-regal-gold/30 rounded-full px-2 py-0.5 bg-heritage-950/60 backdrop-blur-sm">
                AI Discovery
              </span>
            )}
          </div>
          <Landmark size={40} className="text-regal-gold/20" />
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="font-cinzel text-base text-parchment leading-snug tracking-wide">{item.title}</h3>
          </div>
        </div>
      )}

      <div className="p-5">
        {loading ? (
          <div className="flex items-center gap-2 text-heritage-500 text-sm font-body py-2">
            <Loader2 size={14} className="animate-spin" /> Loading…
          </div>
        ) : (
          <div className="mb-4">
            <p className="text-heritage-400 text-sm font-body leading-relaxed line-clamp-3 mb-2">{snippet || 'No description available.'}</p>
            {detail?.url && detail.url !== '#' && (
              <a href={detail.url} target="_blank" rel="noreferrer" className="text-xs text-regal-gold hover:text-white flex items-center gap-1 w-max transition-colors">
                Read more on Wikipedia <ExternalLink size={10} />
              </a>
            )}
          </div>
        )}

        {/* Story Panel */}
        <AnimatePresence>
          {showStory && (
            <motion.div
              className="bg-heritage-900/60 border border-regal-gold/15 rounded-sm p-3 mb-4 relative"
              initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.4 }}
            >
              <div className="absolute right-2 top-2 flex items-center gap-1">
                {storyText && !storyLoad && (
                  <button onClick={toggleNarration} className={`text-heritage-500 hover:text-regal-gold ${speaking ? 'text-regal-gold animate-pulse' : ''}`}>
                    {speaking ? <VolumeX size={14} /> : <Volume2 size={14} />}
                  </button>
                )}
                <button onClick={() => { setShow(false); window.speechSynthesis.cancel(); setSpeaking(false) }} className="text-heritage-500 hover:text-regal-gold"><X size={14} /></button>
              </div>
              <div className="flex items-center gap-1.5 mb-2">
                {React.createElement(activePersona.icon, { size: 13, className: 'text-regal-gold' })}
                <span className="text-xs font-cinzel font-semibold text-regal-gold uppercase tracking-widest">{activePersona.label}'s Tale</span>
              </div>
              {storyLoad
                ? <div className="flex items-center gap-2 text-heritage-400 text-sm"><Loader2 size={13} className="animate-spin" /> Crafting narrative…</div>
                : <p className="text-heritage-300 text-xs font-body leading-relaxed italic">{storyText}</p>
              }
            </motion.div>
          )}
        </AnimatePresence>

        {/* Quiz Panel */}
        <AnimatePresence>
          {(quiz || quizLoad) && (
            <motion.div
              className="bg-regal-amber/5 border border-regal-gold/15 rounded-sm p-3 mb-4 relative"
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.3 }}
            >
              <button onClick={() => { setQuiz(null); setQuizAnswer(null); setBadgeAwarded(false) }} className="absolute right-2 top-2 text-heritage-500 hover:text-regal-gold"><X size={14} /></button>
              <div className="flex items-center gap-1.5 mb-2">
                <HelpCircle size={13} className="text-regal-gold" />
                <span className="text-xs font-cinzel font-semibold text-regal-gold uppercase tracking-widest">Heritage Challenge</span>
              </div>
              {quizLoad ? (
                <div className="flex items-center gap-2 text-heritage-400 text-sm"><Loader2 size={13} className="animate-spin" /> Creating challenge…</div>
              ) : quiz ? (
                <div>
                  <p className="text-parchment text-xs font-body font-semibold mb-2">{quiz.question}</p>
                  <div className="flex flex-col gap-1.5">
                    {quiz.options.map((opt, idx) => {
                      const isSelected = quizAnswer === idx
                      const isCorrect = idx === quiz.correct
                      const answered = quizAnswer !== null
                      let cls = 'text-left text-xs font-body px-3 py-2 rounded-sm border transition-all duration-300 '
                      if (!answered) cls += 'border-heritage-700 hover:border-regal-gold hover:bg-regal-gold/10 bg-heritage-950/50 text-heritage-300'
                      else if (isCorrect) cls += 'border-green-500/50 bg-green-900/20 text-green-400'
                      else if (isSelected && !isCorrect) cls += 'border-red-500/50 bg-red-900/20 text-red-400'
                      else cls += 'border-heritage-700 bg-heritage-950/50 opacity-40 text-heritage-500'
                      return (
                        <button key={idx} onClick={() => !answered && handleQuizAnswer(idx)} className={cls} disabled={answered}>
                          <span className="flex items-center gap-1.5">
                            {answered && isCorrect && <CheckCircle size={12} className="text-green-400" />}
                            {answered && isSelected && !isCorrect && <XCircle size={12} className="text-red-400" />}
                            {opt}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                  {badgeAwarded && (
                    <motion.div className="mt-3 flex items-center gap-2 bg-gradient-to-r from-regal-gold/20 to-regal-amber/10 border border-regal-gold/40 rounded-sm px-3 py-2"
                      initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring' }}>
                      <Award size={16} className="text-regal-gold" />
                      <span className="text-xs font-body font-semibold text-regal-gold">🏆 Badge Earned: {item.title} Explorer!</span>
                    </motion.div>
                  )}
                  {quizAnswer !== null && !badgeAwarded && (
                    <p className="mt-2 text-xs font-body text-red-400 italic">Not quite! Correct: {quiz.options[quiz.correct]}</p>
                  )}

                  {/* Next Question Button */}
                  {quizAnswer !== null && (
                    <div className="mt-3 flex justify-end">
                      <button
                        onClick={startQuiz}
                        className="text-xs font-cinzel tracking-wider text-regal-gold hover:text-white bg-regal-gold/10 hover:bg-regal-gold/20 border border-regal-gold/30 rounded-sm px-3 py-1.5 transition-all"
                      >
                        Next Question →
                      </button>
                    </div>
                  )}
                </div>
              ) : null}
            </motion.div>
          )}
        </AnimatePresence>



        {/* Chat Panel */}
        <AnimatePresence>
          {showChat && (
            <motion.div className="bg-heritage-900/50 border border-regal-gold/15 rounded-sm p-3 mb-4 relative flex flex-col gap-2 max-h-60"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <button onClick={() => setShowChat(false)} className="absolute right-2 top-2 text-heritage-500 hover:text-regal-gold z-10"><X size={14} /></button>
              <div className="flex items-center justify-between mb-1 pb-2 border-b border-heritage-800">
                <div className="flex items-center gap-1.5">
                  <MessageCircle size={13} className="text-regal-gold" />
                  <span className="text-xs font-cinzel font-semibold text-regal-gold uppercase tracking-widest">{t.queries}</span>
                </div>
                <div className="flex items-center gap-1">
                  {[{ code: 'en', label: 'EN' }, { code: 'hi', label: 'HI' }, { code: 'hinglish', label: 'Mix' }].map(l => (
                    <button key={l.code} onClick={() => setChatLang(l.code)}
                      className={`text-[9px] font-cinzel font-bold px-1.5 py-0.5 rounded-sm border transition-all ${chatLang === l.code ? 'bg-regal-gold/20 border-regal-gold/50 text-regal-gold' : 'border-heritage-700 text-heritage-500 hover:text-regal-gold hover:border-regal-gold/30'}`}>
                      {l.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex-1 overflow-y-auto flex flex-col gap-2 pr-1 custom-scrollbar min-h-[5rem]">
                {chatHistory.length === 0 && <p className="text-heritage-600 text-xs italic text-center my-auto py-2">Start a conversation about {item.title}</p>}
                {chatHistory.map((msg, idx) => {
                  const isRejected = msg.content.startsWith('[REJECTED]')
                  const displayContent = isRejected ? msg.content.replace('[REJECTED]', '').trim() : msg.content
                  return (
                    <div key={idx} className={`max-w-[95%] rounded-md p-2 text-xs font-body ${msg.role === 'user' ? 'bg-regal-gold/20 text-parchment self-end border border-regal-gold/30' : isRejected ? 'bg-red-900/20 border border-red-800/30 text-red-400 self-start' : 'bg-heritage-800/50 border border-heritage-700 text-heritage-300 self-start'}`}>
                      {isRejected && <AlertTriangle size={12} className="inline mr-1 mb-0.5 text-red-400" />}
                      {msg.role === 'assistant' && idx === chatHistory.length - 1
                        ? <TypewriterText text={displayContent} />
                        : displayContent
                      }
                    </div>
                  )
                })}
                {chatLoad && <div className="self-start bg-heritage-800/50 border border-heritage-700 rounded-md p-2 text-xs font-body text-heritage-500 flex items-center gap-1.5"><Loader2 size={10} className="animate-spin" /></div>}
              </div>
              <form onSubmit={handleChatSubmit} className="relative mt-1">
                <input type="text" value={chatInput} onChange={e => setChatInput(e.target.value)} placeholder={t.chatPlaceholder}
                  className="w-full bg-heritage-950/60 border border-heritage-700 rounded-sm text-xs font-body px-2.5 py-1.5 pr-8 text-parchment placeholder-heritage-600 focus:outline-none focus:border-regal-gold/50" />
                <button type="submit" disabled={chatLoad || !chatInput.trim()} className="absolute right-1.5 top-1/2 -translate-y-1/2 text-regal-gold/70 hover:text-regal-gold disabled:opacity-30"><Send size={12} /></button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button onClick={() => { setShowChat(!showChat); setShow(false); setChatHistory([]); setQuiz(null); setShowInterview(false) }}
            className="inline-flex items-center gap-1.5 text-heritage-400 hover:text-regal-gold text-xs font-cinzel border border-heritage-700 hover:border-regal-gold/50 rounded-sm px-3 py-1.5 transition-all duration-300">
            <MessageCircle size={12} /> {t.queries}
          </button>
          <button onClick={() => { setShowInterview(true); setShowChat(false); setShow(false); setQuiz(null) }}
            className="inline-flex items-center gap-1.5 text-xs font-cinzel bg-gradient-to-r from-red-900 to-amber-800 text-parchment border border-regal-gold/30 rounded-sm px-3 py-1.5 transition-all duration-300 shadow-sm hover:brightness-125">
            <User size={12} /> Interview
          </button>
          <button onClick={generateStory}
            className="inline-flex items-center gap-1.5 text-xs font-cinzel bg-gradient-to-r from-regal-gold to-regal-amber text-heritage-950 rounded-sm px-3 py-1.5 transition-all duration-300 shadow-sm hover:brightness-110">
            <Sparkles size={12} /> {t.generateStory}
          </button>
          <button onClick={startQuiz} disabled={quizLoad}
            className="inline-flex items-center gap-1.5 text-xs font-cinzel bg-regal-gold/10 hover:bg-regal-gold/20 text-regal-gold border border-regal-gold/30 rounded-sm px-3 py-1.5 transition-all duration-300">
            <Trophy size={12} /> Quiz
          </button>

        </div>
      </div>
      {showInterview && (
        <MonumentChat
          monumentName={item.title}
          wikiText={snippet}
          onClose={() => setShowInterview(false)}
        />
      )}
    </motion.div>
  )
}

/* ═══════════════════════════════════════════
   SECTION HEADER (Cinematic)
   ═══════════════════════════════════════════ */
function SectionHeader({ icon, title, count, onRefresh, refreshing }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  return (
    <div ref={ref} className="flex items-center justify-between mb-8">
      <motion.div
        className="flex items-center gap-3"
        initial={{ opacity: 0, x: -30 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.div
          initial={{ scale: 0, rotate: -90 }}
          animate={isInView ? { scale: 1, rotate: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2, type: 'spring' }}
        >
          {icon}
        </motion.div>
        <div>
          <h2 className="font-cinzel text-xl md:text-2xl text-parchment tracking-wider uppercase">{title}</h2>
          <motion.div
            className="h-0.5 bg-gradient-to-r from-regal-gold to-transparent mt-2"
            initial={{ width: 0 }}
            animate={isInView ? { width: 64 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
          />
        </div>
        {count > 0 && (
          <motion.span
            className="bg-regal-gold/10 text-regal-gold text-xs font-cinzel font-semibold px-2.5 py-0.5 rounded-full ml-2 border border-regal-gold/20"
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{ delay: 0.6, type: 'spring' }}
          >
            {count}
          </motion.span>
        )}
      </motion.div>
      {onRefresh && (
        <button onClick={onRefresh} className="text-heritage-500 hover:text-regal-gold transition-colors" title="Refresh">
          <RefreshCw size={15} className={refreshing ? 'animate-spin' : ''} />
        </button>
      )}
    </div>
  )
}

/* ═══════════════════════════════════════════
   MAIN DASHBOARD
   ═══════════════════════════════════════════ */
export default function Dashboard({ user, profile, onPlayGame }) {
  const [query, setQuery] = useState('')
  const [lastSearched, setLastSearched] = useState('')
  const [results, setResults] = useState([])
  const [nearby, setNearby] = useState([])
  const [icons, setIcons] = useState([])
  const [searching, setSearch] = useState(false)
  const [geoLoad, setGeoLoad] = useState(false)
  const [iconsLoad, setIconsLoad] = useState(false)
  const [lang, setLang] = useState('en')
  const [langOpen, setLangOpen] = useState(false)
  const [persona, setPersona] = useState('bard')
  const [personaOpen, setPersonaOpen] = useState(false)
  const [exploreOpen, setExploreOpen] = useState(false)
  const [globalChatHistory, setGlobalChatHistory] = useState([])
  const [globalChatInput, setGlobalChatInput] = useState('')
  const [globalChatLoad, setGlobalChatLoad] = useState(false)
  const [globalChatLang, setGlobalChatLang] = useState('en')
  const [profileOpen, setProfileDD] = useState(false)
  const [mapCenter, setMapCenter] = useState(null)
  const [badges, setBadges] = useState([])
  const [badgeToast, setBadgeToast] = useState('')
  const searchRef = useRef(null)
  const heroRef = useRef(null)
  const t = TRANSLATIONS[lang]

  // Parallax for hero
  const { scrollYProgress: heroScrollProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroY = useTransform(heroScrollProgress, [0, 1], [0, 150])
  const heroOpacity = useTransform(heroScrollProgress, [0, 0.7], [1, 0])
  const heroScale = useTransform(heroScrollProgress, [0, 1], [1, 1.15])

  useEffect(() => {
    if (user?.id && user.id !== 'test-user-id') {
      supabase.from('user_badges').select('*').eq('user_id', user.id)
        .then(({ data }) => data && setBadges(data))
    }
  }, [user?.id])

  const fetchNearby = useCallback(async (location) => {
    if (!location) return
    setGeoLoad(true)
    try {
      const coords = await geocodeCityIndia(location)
      if (coords) setMapCenter(coords)

      const stateKey = location.trim().toLowerCase()
      let sites = []

      // If it's a known state, strictly use its hardcoded heritage places
      if (STATE_HERITAGE[stateKey]) {
        sites = STATE_HERITAGE[stateKey].map(s => ({
          ...s,
          lat: coords ? coords.lat + (Math.random() - 0.5) * 0.05 : 0,
          lon: coords ? coords.lon + (Math.random() - 0.5) * 0.05 : 0,
          dist: Math.floor(Math.random() * 3000),
          source: 'Local-Verified'
        }))
      } else {
        // Fallback for cities: Use AI Discovery first — it returns full descriptions + images
        sites = await searchWikipedia(`${location} heritage monuments temple fort`, 4)
        
        // Add geo coords for map if available
        if (coords && sites.length > 0) {
          sites = sites.map((s, i) => ({
            ...s,
            lat: coords.lat + (Math.random() - 0.5) * 0.05,
            lon: coords.lon + (Math.random() - 0.5) * 0.05,
            dist: Math.floor(Math.random() * 3000),
          }))
        }

        // Fallback to geo search if nothing came back
        if (sites.length === 0 && coords) {
          sites = await geoSearchHeritage(coords.lat, coords.lon, 10000, 4, location)
        }
      }

      setNearby(sites.slice(0, 4))
    } catch (err) { console.error('Nearby error:', err) }
    finally { setGeoLoad(false) }
  }, [])

  const fetchIcons = useCallback(async (location) => {
    if (!location) return
    setIconsLoad(true)
    try {
      const result = await fetchHeritageIcons(location)
      setIcons(result.slice(0, 4))
    }
    catch (err) { console.error('Icons error:', err) }
    finally { setIconsLoad(false) }
  }, [])

  useEffect(() => {
    console.log("Virasat Profile Debug:", profile);
    const targetState = profile?.state || 'India';
    fetchNearby(targetState);
    fetchIcons(targetState);
  }, [profile, fetchNearby, fetchIcons])

  const handleGlobalChatSubmit = async (e) => {
    e.preventDefault()
    if (!globalChatInput.trim() || globalChatLoad) return
    const userMsg = globalChatInput.trim()
    setGlobalChatInput('')
    const newHistory = [...globalChatHistory, { role: 'user', content: userMsg }]
    setGlobalChatHistory(newHistory)
    setGlobalChatLoad(true)
    const aiResponse = await chatWithGlobalHeritage(userMsg, globalChatHistory, globalChatLang, persona)
    setGlobalChatHistory([...newHistory, { role: 'assistant', content: aiResponse }])
    setGlobalChatLoad(false)
  }

  const handleSearch = async (e) => {
    e?.preventDefault()
    if (!query.trim()) return
    setLastSearched(query)
    setSearch(true); setResults([])
    setResults(await searchWikipedia(query))
    setSearch(false)
  }

  const clearSearch = () => { setQuery(''); setLastSearched(''); setResults([]); searchRef.current?.focus() }
  const handleSignOut = async () => {
    await supabase.auth.signOut()
    localStorage.clear()
    sessionStorage.clear()
    window.location.reload()
  }

  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Explorer'
  const avatar = user?.user_metadata?.avatar_url

  const handleBadgeEarned = (title) => {
    setBadgeToast(title); setBadges(prev => [...prev, { site_title: title }])
    setTimeout(() => setBadgeToast(''), 4000)
  }

  return (
    <div className="min-h-screen bg-parchment-texture relative">
      {/* Scroll Progress Indicator */}
      <ScrollProgress />

      {/* Film grain */}
      <div className="film-grain" />

      {/* Ancient Instrumental and Symbolic Background Animations */}
      <AncientAnimations />

      {/* ── Nav ── */}
      <motion.nav
        className="sticky top-0 z-50 bg-heritage-950/90 backdrop-blur-xl border-b border-regal-gold/10 shadow-lg"
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 shrink-0">
            <svg viewBox="0 0 40 40" className="w-8 h-8" fill="none">
              <circle cx="20" cy="20" r="18" stroke="#d4a853" strokeWidth="1.2" />
              <path d="M10 26 L20 10 L30 26" stroke="#d4a853" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M13 26 L27 26" stroke="#d4a853" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M16.5 26 L16.5 20" stroke="#b8860b" strokeWidth="1.2" strokeLinecap="round" />
              <path d="M23.5 26 L23.5 20" stroke="#b8860b" strokeWidth="1.2" strokeLinecap="round" />
              <path d="M16.5 20 L23.5 20" stroke="#b8860b" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
            <span className="font-decorative text-2xl text-gold-gradient leading-none">Virasat</span>
          </div>

          <form onSubmit={handleSearch} className="flex-1 max-w-xl hidden sm:block">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-heritage-500" />
              <input ref={searchRef} type="text" placeholder={t.searchPlaceholder} value={query}
                onChange={e => setQuery(e.target.value)} className="input-field pl-10 pr-10 py-2.5 text-sm" />
              {query && <button type="button" onClick={clearSearch} className="absolute right-3 top-1/2 -translate-y-1/2 text-heritage-500 hover:text-regal-gold"><X size={14} /></button>}
            </div>
          </form>

          <div className="flex items-center gap-2">
            <button
              onClick={onPlayGame}
              className="flex items-center gap-1.5 text-regal-gold border border-regal-gold/40 bg-regal-gold/10 hover:bg-regal-gold hover:text-heritage-950 rounded-sm px-3 py-2 text-xs font-cinzel transition-all duration-300"
              title="Play Heritage Detective"
            >
              <Gamepad2 size={13} /> Game
            </button>
            <div className="relative">
              <button onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1.5 text-heritage-400 hover:text-regal-gold border border-heritage-700 hover:border-regal-gold/40 rounded-sm px-3 py-2 text-xs font-cinzel transition-all duration-300">
                <Languages size={13} /> {LANGUAGES_LIST.find(l => l.code === lang)?.label} <ChevronDown size={11} />
              </button>
              {langOpen && (
                <div className="absolute right-0 top-full mt-1 bg-heritage-900 border border-regal-gold/20 rounded-sm shadow-cinematic z-50 overflow-hidden">
                  {LANGUAGES_LIST.map(l => (
                    <button key={l.code} onClick={() => { setLang(l.code); setLangOpen(false) }}
                      className={`block w-full text-left px-4 py-2 text-sm font-body hover:bg-regal-gold/10 transition-colors ${lang === l.code ? 'bg-regal-gold/10 text-regal-gold font-semibold' : 'text-heritage-300'}`}>
                      {l.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {/* Explore with AI / Persona Selector Button */}
            <div className="relative hidden lg:block">
              <button
                onClick={() => setExploreOpen(true)}
                className="flex items-center gap-1.5 text-heritage-400 hover:text-regal-gold border border-heritage-700 hover:border-regal-gold/40 rounded-sm px-3 py-2 text-xs font-cinzel transition-all duration-300"
              >
                <Sparkles size={13} className="text-regal-gold" />
                Explore with AI
              </button>
            </div>
            {/* Profile */}
            <div className="relative">
              <button onClick={() => setProfileDD(!profileOpen)} className="hover:opacity-80 transition-opacity">
                {avatar
                  ? <img src={avatar} alt="" className="w-8 h-8 rounded-full border-2 border-regal-gold/40 object-cover" />
                  : <div className="w-8 h-8 rounded-full bg-regal-gold/20 border border-regal-gold/40 flex items-center justify-center text-regal-gold text-sm font-semibold font-cinzel">
                    {displayName[0].toUpperCase()}
                  </div>
                }
              </button>
              {profileOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-heritage-900 border border-regal-gold/20 rounded-sm shadow-cinematic z-50 overflow-hidden">
                  <div className="px-4 py-3 border-b border-heritage-800 bg-heritage-950/50">
                    <p className="font-body font-semibold text-parchment text-sm">{displayName}</p>
                    <p className="font-body text-heritage-500 text-xs truncate">{user?.email}</p>
                    {profile?.city && <p className="font-body text-heritage-500 text-xs mt-0.5 flex items-center gap-1"><MapPin size={10} /> {profile.city}{profile.state ? `, ${profile.state}` : ''}</p>}
                  </div>
                  <button onClick={handleSignOut} className="flex items-center gap-2 w-full px-4 py-3 text-sm font-body text-red-400 hover:bg-red-900/20 transition-colors">
                    <LogOut size={14} /> Sign Out
                  </button>
                  <button 
                    onClick={() => {
                      localStorage.clear();
                      sessionStorage.clear();
                      document.cookie.split(";").forEach((c) => {
                        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
                      });
                      window.location.href = window.location.origin;
                    }}
                    className="flex items-center gap-2 w-full px-4 py-3 text-xs font-body text-heritage-600 hover:bg-heritage-800 transition-colors border-t border-heritage-800"
                  >
                    <RefreshCw size={12} /> Reset App & Clear Cache
                  </button>
                  <div className="px-4 py-2 border-t border-heritage-800 text-[10px] text-heritage-600 font-mono text-center">
                    Build: 7e2e437
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="sm:hidden px-4 pb-3">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-heritage-500" />
              <input type="text" placeholder={t.searchPlaceholder} value={query} onChange={e => setQuery(e.target.value)} className="input-field pl-10 pr-10 py-2.5 text-sm" />
              {query && <button type="button" onClick={clearSearch} className="absolute right-3 top-1/2 -translate-y-1/2 text-heritage-500"><X size={14} /></button>}
            </div>
          </form>
        </div>
      </motion.nav>

      {/* ── CINEMATIC HERO with Parallax ── */}
      <div ref={heroRef} className="relative h-[400px] md:h-[500px] overflow-hidden">
        <motion.div
          className="absolute inset-0"
          style={{ y: heroY, scale: heroScale }}
        >
          <div
            className="absolute inset-0 animate-ken-burns"
            style={{ backgroundImage: 'url(/hero-bg.png)', backgroundSize: 'cover', backgroundPosition: 'center' }}
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-b from-heritage-950/50 via-transparent to-heritage-950" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(26,18,11,0.8)_100%)]" />

        <motion.div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4" style={{ opacity: heroOpacity }}>
          <motion.p
            className="font-cinzel text-xs tracking-[0.5em] text-regal-gold/60 uppercase mb-5"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.3 }}
          >
            Multilingual · AI-Powered · Wikipedia
          </motion.p>

          <h1 className="font-decorative text-4xl md:text-7xl leading-tight mb-6">
            <TextReveal text={t.tagline} className="text-gold-gradient" delay={0.5} />
          </h1>

          {profile?.state && (
            <motion.div
              className="inline-flex items-center gap-2 bg-heritage-950/40 backdrop-blur-md border border-regal-gold/20 rounded-sm px-5 py-2.5 text-sm font-body"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 1.5 }}
            >
              <MapPin size={14} className="text-regal-gold" />
              <span className="text-heritage-300">Exploring heritage in <strong className="text-regal-gold">{profile.state}</strong></span>
            </motion.div>
          )}

          {/* Scroll indicator */}
          <motion.div
            className="absolute bottom-10 flex flex-col items-center gap-2"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <span className="text-regal-gold/30 text-[10px] font-cinzel tracking-[0.3em] uppercase">Scroll to explore</span>
            <ChevronDown size={16} className="text-regal-gold/30" />
          </motion.div>
        </motion.div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#1a120b] to-transparent" />
      </div>

      {/* ── MAIN CONTENT ── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">

        {/* Search results */}
        <AnimatePresence>
          {(results.length > 0 || searching) && (
            <motion.section className="mb-14" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <SectionHeader icon={<Globe size={22} className="text-regal-gold" />} title={t.globalTitle} count={results.length} />
              {searching ? (
                <div className="flex items-center gap-3 text-heritage-400 font-body py-8">
                  <Loader2 size={20} className="animate-spin text-regal-gold" /> {t.loading}
                </div>
              ) : results.length === 0 ? (
                <p className="text-heritage-500 font-body italic">{t.noResults}</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {results.map((item, i) => <HeritageCard key={item.pageid} item={item} t={t} lang={lang} user={user} onBadgeEarned={handleBadgeEarned} index={i} persona={persona} />)}
                </div>
              )}
            </motion.section>
          )}
        </AnimatePresence>

        {/* ── Chapter 1: Time-Travel Timeline ── */}
        {(lastSearched || profile?.state) && <Timeline location={lastSearched || profile?.state} />}

        {/* ── Chapter 2: Historical Figures ── */}
        <ChapterDivider title="Historical Icons" number={2} />

        <ParallaxSection className="mb-14" speed={0.15}>
          <SectionHeader
            icon={<User size={22} className="text-regal-gold" />}
            title={t.iconsTitle + (profile?.state ? ` — ${profile.state}` : '')}
            count={icons.length} onRefresh={() => fetchIcons(profile?.state || 'India')} refreshing={iconsLoad}
          />
          {iconsLoad ? (
            <div className="flex items-center gap-3 text-heritage-400 font-body py-8">
              <Loader2 size={20} className="animate-spin text-regal-gold" /> Uncovering historical figures…
            </div>
          ) : icons.length === 0 ? (
            <div className="text-center py-10 text-heritage-600 font-body border border-dashed border-heritage-800 rounded-sm">
              <p className="italic">No specific historical icons found for this state yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {icons.map((item, i) => <HeritageCard key={item.pageid} item={item} t={t} lang={lang} user={user} onBadgeEarned={handleBadgeEarned} index={i} persona={persona} />)}
            </div>
          )}
        </ParallaxSection>

        {/* ── Chapter 3: Heritage Pulse Map ── */}
        {mapCenter && nearby.length > 0 && (
          <>
            <ChapterDivider title="Heritage Pulse" number={3} />
            <ParallaxSection className="mb-14" speed={0.1}>
              <SectionHeader icon={<Globe size={22} className="text-regal-gold" />} title={`Heritage Pulse — ${profile?.state || 'Map'}`} />
              <motion.div
                className="border border-regal-gold/20 rounded-sm overflow-hidden shadow-cinematic"
                initial={{ opacity: 0, scale: 0.98 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <HeritageMap center={mapCenter} sites={nearby} />
              </motion.div>
            </ParallaxSection>
          </>
        )}

        {/* ── Chapter 4: Nearby Heritage ── */}
        <ChapterDivider title="Nearby Heritage" number={mapCenter ? 4 : 3} />

        <ParallaxSection className="mb-4" speed={0.15}>
          <SectionHeader
            icon={<MapPin size={22} className="text-regal-gold" />}
            title={t.nearbyTitle + (profile?.state ? ` — ${profile.state}` : '')}
            count={nearby.length} onRefresh={() => fetchNearby(profile?.state || 'India')} refreshing={geoLoad}
          />
          {geoLoad ? (
            <div className="flex items-center gap-3 text-heritage-400 font-body py-8">
              <Loader2 size={20} className="animate-spin text-regal-gold" /> Geolocating heritage sites…
            </div>
          ) : nearby.length === 0 ? (
            <div className="text-center py-16 text-heritage-600 font-body">
              <Landmark size={48} className="mx-auto mb-4 opacity-20 text-regal-gold" />
              <p className="italic">No nearby sites found. Update your state in profile.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {nearby.map((item, i) => <HeritageCard key={item.pageid} item={item} t={t} lang={lang} user={user} onBadgeEarned={handleBadgeEarned} index={i} persona={persona} />)}
            </div>
          )}
        </ParallaxSection>

        {/* ── Dharohar Badges ── */}
        {badges.length > 0 && (
          <>
            <ChapterDivider title="Your Dharohar" />
            <motion.section className="mb-6" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
              <SectionHeader icon={<Trophy size={22} className="text-regal-gold" />} title={`Dharohar Badges (${badges.length})`} />
              <div className="flex flex-wrap gap-3">
                {badges.map((b, i) => (
                  <motion.div key={i}
                    className="inline-flex items-center gap-2 bg-regal-gold/10 border border-regal-gold/30 rounded-sm px-4 py-2 text-xs font-cinzel font-semibold text-regal-gold"
                    initial={{ scale: 0, x: -20 }} whileInView={{ scale: 1, x: 0 }}
                    viewport={{ once: true }} transition={{ delay: i * 0.1, type: 'spring' }}>
                    <Award size={14} /> {b.site_title} Explorer
                  </motion.div>
                ))}
              </div>
            </motion.section>
          </>
        )}

        {/* ── Cinematic Feature Showcase ── */}
        <ChapterDivider />

        <motion.section
          className="relative overflow-hidden rounded-sm border border-regal-gold/20"
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="bg-gradient-to-br from-heritage-950 via-heritage-900 to-heritage-950 p-12 text-center relative">
            <div className="absolute inset-0 opacity-5 bg-noise" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-regal-gold/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="relative z-10">
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: 'spring', delay: 0.3 }}
              >
                <Sparkles size={32} className="text-regal-gold mx-auto mb-5" />
              </motion.div>
              <h3 className="font-cinzel text-3xl md:text-4xl text-parchment mb-4 tracking-wider">
                <TextReveal text="Powered by Artificial Intelligence" />
              </h3>
              <p className="font-sans text-heritage-400 text-sm italic max-w-xl mx-auto mb-8">
                Explore heritage through AI storytelling, voice narration, interactive Q&A, and gamified quizzes.
              </p>
              <div className="flex flex-wrap justify-center gap-3 text-xs font-cinzel">
                {['Groq LLM', 'Virasat Vaani', 'RAG Chat', 'Heritage Pulse', 'Dharohar Badges'].map((tag, i) => (
                  <motion.span key={tag}
                    className="bg-regal-gold/10 border border-regal-gold/20 text-regal-gold px-4 py-2 rounded-sm tracking-wider"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                  >
                    {tag}
                  </motion.span>
                ))}
              </div>
            </div>
          </div>
        </motion.section>
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-heritage-800 mt-20 py-10 text-center relative z-10">
        <motion.div
          className="gold-ornament max-w-xs mx-auto mb-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <span className="text-regal-gold/30 text-xs">✦</span>
        </motion.div>
        <p className="font-body text-heritage-600 text-xs">
          © {new Date().getFullYear()} Virasat Heritage Knowledge Base · Wikipedia MediaWiki API & Supabase
        </p>
      </footer>

      {/* Badge Toast */}
      <AnimatePresence>
        {badgeToast && (
          <motion.div
            className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-regal-gold to-regal-amber text-heritage-950 px-6 py-3 rounded-sm shadow-cinematic flex items-center gap-3"
            initial={{ x: 100, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
            exit={{ x: 100, opacity: 0 }} transition={{ type: 'spring' }}
          >
            <Award size={20} /> <span className="font-cinzel font-semibold text-sm">🏆 Badge Unlocked: {badgeToast} Explorer!</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Global Explore with AI Sidebar ── */}
      <AnimatePresence>
        {exploreOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-heritage-950/60 backdrop-blur-sm z-[100]"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setExploreOpen(false)}
            />
            {/* Sidebar */}
            <motion.div
              className="fixed top-0 right-0 h-full w-full max-w-md bg-heritage-950 border-l border-regal-gold/20 shadow-[-10px_0_30px_rgba(0,0,0,0.5)] z-[110] flex flex-col"
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            >
              {/* Header */}
              <div className="p-5 flex items-center justify-between border-b border-regal-gold/20 bg-heritage-900 overflow-hidden relative">
                <div className="absolute inset-0 opacity-10 bg-noise pointer-events-none" />
                <div className="flex items-center gap-2 relative z-10">
                  <Sparkles className="text-regal-gold" size={20} />
                  <h2 className="font-cinzel text-lg text-regal-gold uppercase tracking-wider">Explore with AI</h2>
                </div>
                <button onClick={() => setExploreOpen(false)} className="text-heritage-500 hover:text-regal-gold relative z-10 transition-colors">
                  <X size={20} />
                </button>
              </div>

              {/* Persona Selector inside Sidebar */}
              <div className="p-4 bg-heritage-900/50 border-b border-heritage-800 shrink-0">
                <p className="text-[10px] font-cinzel text-regal-gold font-semibold mb-2 tracking-[0.2em] uppercase">Choose Your Guide</p>
                <select
                  value={persona}
                  onChange={e => setPersona(e.target.value)}
                  className="w-full bg-heritage-950 border border-heritage-700 text-heritage-300 rounded-sm p-2 text-sm font-body focus:border-regal-gold transition-colors outline-none cursor-pointer"
                >
                  {PERSONAS.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
                </select>
                <p className="text-xs text-heritage-500 mt-2 font-body italic leading-relaxed">
                  {PERSONAS.find(p => p.id === persona)?.desc}
                </p>
              </div>

              {/* Chat History Area */}
              <div className="flex-1 overflow-y-auto p-5 pb-6 flex flex-col gap-4 font-body scrollbar-thin scrollbar-thumb-heritage-700 scrollbar-track-transparent">
                {globalChatHistory.length === 0 && (
                  <div className="text-center text-heritage-500 text-sm mt-10 italic border border-dashed border-heritage-800 rounded-sm p-6">
                    Ask your chosen guide anything about Indian history and heritage.
                  </div>
                )}
                {globalChatHistory.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`p-4 rounded-sm max-w-[85%] text-sm leading-relaxed ${msg.role === 'user'
                      ? 'bg-regal-gold/10 text-heritage-200 border border-regal-gold/30 rounded-tr-none'
                      : 'bg-heritage-900 border border-heritage-700 text-heritage-300 rounded-tl-none shadow-cinematic'
                      }`}>
                      {msg.role === 'assistant' && idx === globalChatHistory.length - 1
                        ? <TypewriterText text={msg.content} speed={18} />
                        : msg.content
                      }
                    </div>
                  </div>
                ))}
                {globalChatLoad && (
                  <div className="flex justify-start">
                    <div className="p-3 bg-heritage-900 border border-heritage-700 rounded-sm rounded-tl-none shadow-cinematic flex items-center gap-2 text-heritage-500 text-xs">
                      <Loader2 className="animate-spin text-regal-gold" size={14} /> The Guide is pondering...
                    </div>
                  </div>
                )}
              </div>

              {/* Input Box */}
              <div className="p-5 border-t border-heritage-800 shrink-0 bg-heritage-900">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-cinzel text-heritage-500 uppercase tracking-wider">Reply in</span>
                  <div className="flex items-center gap-1.5">
                    {[{ code: 'en', label: 'English' }, { code: 'hi', label: 'हिन्दी' }, { code: 'hinglish', label: 'Hinglish' }].map(l => (
                      <button key={l.code} onClick={() => setGlobalChatLang(l.code)}
                        className={`text-[10px] font-cinzel font-semibold px-2.5 py-1 rounded-sm border transition-all ${globalChatLang === l.code ? 'bg-regal-gold/20 border-regal-gold/50 text-regal-gold' : 'border-heritage-700 text-heritage-500 hover:text-regal-gold hover:border-regal-gold/30'}`}>
                        {l.label}
                      </button>
                    ))}
                  </div>
                </div>
                <form onSubmit={handleGlobalChatSubmit} className="relative flex items-center">
                  <input
                    value={globalChatInput} onChange={e => setGlobalChatInput(e.target.value)}
                    className="w-full bg-heritage-950 border border-heritage-700 rounded-sm pl-4 pr-12 py-3 text-sm font-body text-heritage-300 focus:border-regal-gold outline-none transition-colors"
                    placeholder="Uncover a piece of history..."
                  />
                  <button type="submit" disabled={globalChatLoad} className="absolute right-2 text-regal-gold p-1.5 hover:bg-regal-gold/20 rounded-sm transition-colors disabled:opacity-50">
                    <Send size={18} />
                  </button>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {(langOpen || profileOpen) && <div className="fixed inset-0 z-40" onClick={() => { setLangOpen(false); setProfileDD(false) }} />}
    </div>
  )
}
