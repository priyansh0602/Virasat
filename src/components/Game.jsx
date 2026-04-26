import { useState, useEffect, useMemo, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Loader2, Sparkles, Award, Heart, Timer, Flame, RefreshCw, Box } from 'lucide-react'
import { generateHeritageGameRound } from '../services/GroqService'
import { supabase } from '../lib/SupabaseClient'
import HeritageMemoryGame from './HeritageMemoryGame'

const FALLBACK_ROUNDS = [
  {
    riddle: "I am a monument of pure white love, standing on the banks where Yamuna flows. Four minarets guard my dome, a vision that the world knows.",
    options: ["Taj Mahal", "Humayun's Tomb", "Bibi Ka Maqbara", "Victoria Memorial"],
    correct: 0,
    topic: "Taj Mahal",
    fact: "It was built by Shah Jahan in memory of his wife Mumtaz Mahal and took 22 years to complete."
  },
  {
    riddle: "A palace of 953 stone-carved windows, designed for royal ladies to see the street. I look like the crown of Krishna, where the desert winds meet.",
    options: ["City Palace", "Umaid Bhawan", "Hawa Mahal", "Amer Fort"],
    correct: 2,
    topic: "Hawa Mahal",
    fact: "Designed by Lal Chand Ustad, its uniquely shaped windows were built to allow royal women to watch festivals without being seen."
  },
  {
    riddle: "I stand tall in the heart of Delhi, a tower of victory made of sandstone red. My balcony's gaze sees centuries past, where sultans and empires once led.",
    options: ["Charminar", "Qutub Minar", "Chand Minar", "Victory Tower"],
    correct: 1,
    topic: "Qutub Minar",
    fact: "At 73 meters, it is the tallest brick minaret in the world and part of the UNESCO World Heritage site."
  },
  {
    riddle: "I was built to honor a visit of a King, a gateway standing by the Arabian Sea. In Mumbai I greet the morning sun, a symbol of pride and history.",
    options: ["India Gate", "Buland Darwaza", "Gateway of India", "Lucknow Gate"],
    correct: 2,
    topic: "Gateway of India",
    fact: "It was built to commemorate the landing of King George V and Queen Mary at Apollo Bunder in 1911."
  },
  {
    riddle: "Born in 1336, I was the last bastion of Hindu power in the South. My stone chariot stands as testimony to a golden age that ended on a bloody battlefield.",
    options: ["Vijayanagara Empire", "Chola Dynasty", "Pandya Kingdom", "Hoysala Empire"],
    correct: 0,
    topic: "Vijayanagara Empire",
    fact: "At its peak under Krishnadevaraya, Hampi had a population of 500,000 — larger than Rome at the time."
  },
  {
    riddle: "I am the pool of nectar, a shimmering golden sanctuary surrounded by sacred water. All who enter must walk across a causeway of devotion.",
    options: ["Lotus Temple", "Golden Temple", "Meenakshi Temple", "Somnath Temple"],
    correct: 1,
    topic: "Golden Temple",
    fact: "The Golden Temple serves free meals (langar) to over 100,000 people every single day, regardless of religion or caste."
  },
  {
    riddle: "My Sun never sets. Carved as a colossal chariot with 24 stone wheels, I was built to honor the charioteer of the heavens on Odisha's coast.",
    options: ["Jagannath Temple", "Konark Sun Temple", "Lingaraja Temple", "Mukteshwar Temple"],
    correct: 1,
    topic: "Konark Sun Temple",
    fact: "Each of Konark's 24 intricately carved wheels functions as a sundial, accurately telling the time of day."
  },
  {
    riddle: "A warrior queen on horseback, I refused to surrender my kingdom to the British. My battle cry echoed across the plains of Central India in 1857.",
    options: ["Ahilyabai Holkar", "Rani Lakshmibai", "Razia Sultan", "Chand Bibi"],
    correct: 1,
    topic: "Rani Lakshmibai",
    fact: "Rani Lakshmibai rode into battle with her adopted son tied to her back, fighting against the British in the 1857 rebellion."
  },
  {
    riddle: "Thirty painted caves tell the stories of the Buddha's past lives over a thousand years. I was lost to the jungle before a British officer found me chasing a tiger.",
    options: ["Ellora Caves", "Ajanta Caves", "Elephanta Caves", "Badami Caves"],
    correct: 1,
    topic: "Ajanta Caves",
    fact: "The Ajanta Caves were lost to the world for nearly 1,000 years before being accidentally rediscovered by a British officer in 1819."
  },
  {
    riddle: "I am the diamond of the Deccan, a pearl among cities. My four arches face the four cardinal directions, crowned by four minarets of light.",
    options: ["Golconda Fort", "Charminar", "Mecca Masjid", "Falaknuma Palace"],
    correct: 1,
    topic: "Charminar",
    fact: "Muhammad Quli Qutb Shah built the Charminar in 1591 to mark the end of a devastating plague, as a symbol of gratitude."
  },
  {
    riddle: "Carved from a single rock, I stand 57 feet tall, unclothed and serene, visible from miles around in Karnataka. Monks have revered me for over a millennium.",
    options: ["Statue of Unity", "Gommateshwara", "Nandi Bull", "Brihadeeswarar"],
    correct: 1,
    topic: "Gommateshwara",
    fact: "The Gommateshwara statue is bathed in milk, saffron, and sandalwood paste during the Mahamastakabhisheka ceremony held once every 12 years."
  },
  {
    riddle: "I am where the Buddha first turned the Wheel of Dharma, in a deer park near the holiest city on the Ganges. An Ashokan pillar still marks the spot.",
    options: ["Bodh Gaya", "Sarnath", "Kushinagar", "Lumbini"],
    correct: 1,
    topic: "Sarnath",
    fact: "The Lion Capital of Ashoka found at Sarnath was adopted as the national emblem of India after independence."
  },
];

function normalizeRound(candidate) {
  if (!candidate || typeof candidate !== 'object') return null

  const riddle = typeof candidate.riddle === 'string' ? candidate.riddle.trim() : ''
  const options = Array.isArray(candidate.options)
    ? candidate.options
        .filter(opt => typeof opt === 'string')
        .map(opt => opt.trim())
        .filter(Boolean)
        .slice(0, 4)
    : []

  const parsedCorrect = Number.isInteger(candidate.correct)
    ? candidate.correct
    : Number.parseInt(candidate.correct, 10)

  if (!riddle || options.length < 2) return null

  const correct = Number.isInteger(parsedCorrect) && parsedCorrect >= 0 && parsedCorrect < options.length
    ? parsedCorrect
    : 0

  const topic = typeof candidate.topic === 'string' && candidate.topic.trim()
    ? candidate.topic.trim()
    : options[correct]

  const fact = typeof candidate.fact === 'string' && candidate.fact.trim()
    ? candidate.fact.trim()
    : `A key clue points to ${options[correct]}.`

  return { riddle, options, correct, topic, fact }
}

export default function Game({ onBack, user, profile }) {
  const [mode, setMode] = useState('selection') // selection | detective | memory
  const [round, setRound] = useState(null)
  const [loading, setLoading] = useState(false) // Changed to false by default for cleaner mode entry
  const [selected, setSelected] = useState(null)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [history, setHistory] = useState([])
  const [showFact, setShowFact] = useState(false)
  
  // Gamification features
  const [lives, setLives] = useState(3)
  const [timeLeft, setTimeLeft] = useState(20)
  const [milestone, setMilestone] = useState(null)
  const [gameOver, setGameOver] = useState(false)
  const [highScore, setHighScore] = useState(0)

  const showFactTimeoutRef = useRef(null)
  const gameOverTimeoutRef = useRef(null)

  // Memoize profile for HeritageMemoryGame to prevent infinite re-renders
  const memoryProfile = useMemo(() => ({ ...profile, id: user?.id }), [profile, user?.id])

  useEffect(() => {
    return () => {
      if (showFactTimeoutRef.current) clearTimeout(showFactTimeoutRef.current)
      if (gameOverTimeoutRef.current) clearTimeout(gameOverTimeoutRef.current)
    }
  }, [])

  // Load high score on mount
  useEffect(() => {
    if (user?.id && user.id !== 'test-user-id') {
      supabase.from('game_scores').select('high_score').eq('user_id', user.id).single()
        .then(({ data }) => { if (data) setHighScore(data.high_score) })
    }
  }, [user?.id])

  // Save high score on game over
  useEffect(() => {
    if (gameOver && user?.id && user.id !== 'test-user-id' && score > highScore) {
      setHighScore(score);
      supabase.from('game_scores').upsert({
        user_id: user.id,
        high_score: score,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id' }).catch(e => console.error('score save err:', e));
    }
  }, [gameOver, score, highScore, user?.id]);

  const loadNextRound = async (customHistory = history) => {
    if (showFactTimeoutRef.current) clearTimeout(showFactTimeoutRef.current)
    if (gameOverTimeoutRef.current) clearTimeout(gameOverTimeoutRef.current)

    setLoading(true)
    setSelected(null)
    setShowFact(false)
    setMilestone(null)
    setTimeLeft(20)
    setRound(null) // Clear previous round to avoid stale display

    let nextRound = null

    try {
      // Attempt 1: AI Generation
      nextRound = normalizeRound(await generateHeritageGameRound(customHistory))

      if (!nextRound) {
        // Attempt 2: AI Retry
        console.log('AI Failed, retrying...')
        nextRound = normalizeRound(await generateHeritageGameRound(customHistory))
      }

      if (!nextRound) {
        // Final Fallback: Hardcoded (12 rounds — enough for a full session)
        console.log('AI unavailable, using fallback.')
        const untapped = FALLBACK_ROUNDS.filter(r => !customHistory.includes(r.topic))
        const pool = untapped.length > 0 ? untapped : FALLBACK_ROUNDS
        nextRound = normalizeRound(pool[Math.floor(Math.random() * pool.length)])
      }

      if (nextRound) {
        setRound(nextRound)
        setHistory(prev => [...prev, nextRound.topic].slice(-10))
      }
    } catch (err) {
      console.error('Game Load Err:', err)
      // Immediate fallback on error
      const fallback = normalizeRound(FALLBACK_ROUNDS[Math.floor(Math.random() * FALLBACK_ROUNDS.length)])
      if (fallback) setRound(fallback)
    }

    setLoading(false)
  }

  const restartGame = () => {
    if (showFactTimeoutRef.current) clearTimeout(showFactTimeoutRef.current)
    if (gameOverTimeoutRef.current) clearTimeout(gameOverTimeoutRef.current)
    setLives(3)
    setScore(0)
    setStreak(0)
    setGameOver(false)
    loadNextRound([]) // Clear history
  }

  useEffect(() => {
    if (mode === 'detective') {
      loadNextRound()
    }
  }, [mode])

  // Timer Effect
  useEffect(() => {
    if (mode !== 'detective' || !round || loading || selected !== null || gameOver) return
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          handleSelect(-1) // Time out
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [mode, round, loading, selected, gameOver])

  const handleSelect = (idx) => {
    if (selected !== null || gameOver || !round) return // prevent double clicking
    if (!Array.isArray(round.options) || typeof round.correct !== 'number') return

    if (showFactTimeoutRef.current) clearTimeout(showFactTimeoutRef.current)
    if (gameOverTimeoutRef.current) clearTimeout(gameOverTimeoutRef.current)

    setSelected(idx)

    const answeredCorrectly = idx === round.correct
    const finalLifeWouldBeLost = !answeredCorrectly && lives <= 1

    if (answeredCorrectly) {
      const timeBonus = Math.floor((timeLeft / 20) * 15) // max 15 bonus
      // Use functional updaters to avoid stale closures from timer effect
      setStreak(prev => {
        const newStreak = prev + 1
        setScore(s => s + 10 * newStreak + timeBonus)
        if (newStreak === 3) setMilestone('🔥 HAT-TRICK! 🔥')
        else if (newStreak === 5) setMilestone('🏆 MASTER HISTORIAN! 🏆')
        else if (newStreak === 10) setMilestone('👑 EMPEROR OF KNOWLEDGE! 👑')
        else setMilestone(null)
        return newStreak
      })
    } else {
      setStreak(0)
      setMilestone(null)
      // Functional updater ensures we always read the latest lives value,
      // even when called from a stale timer closure
      setLives(prev => Math.max(0, prev - 1))

      if (finalLifeWouldBeLost) {
        setShowFact(false)
        gameOverTimeoutRef.current = setTimeout(() => setGameOver(true), 900)
      }
    }

    // Show fact after a brief delay when game is still active
    if (!finalLifeWouldBeLost) {
      showFactTimeoutRef.current = setTimeout(() => {
        setShowFact(true)
      }, 600)
    }
  }

  if (mode === 'memory') {
    return (
      <div className="min-h-screen bg-heritage-950 text-parchment font-body flex flex-col pt-6">
        <div className="px-6 mb-4">
          <button onClick={() => setMode('selection')} className="text-heritage-400 hover:text-regal-gold flex items-center gap-2 transition-colors font-cinzel text-sm group">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Selection
          </button>
        </div>
        <HeritageMemoryGame current_city={profile?.city || 'Jaipur'} userProfile={memoryProfile} />
      </div>
    )
  }

  const hasValidRound = round && Array.isArray(round.options) && round.options.length > 0 && Number.isInteger(round.correct)

  return (
    <div className="min-h-screen bg-heritage-950 text-parchment font-body relative overflow-hidden flex flex-col">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-noise opacity-30 pointer-events-none mix-blend-overlay" />
      <div className="absolute inset-0 bg-gradient-to-b from-heritage-900/40 via-transparent to-heritage-950 pointer-events-none" />
      
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-regal-gold/20"
            style={{ width: Math.random() * 200 + 50, height: Math.random() * 200 + 50, filter: 'blur(40px)' }}
            animate={{
              x: [Math.random() * 1920, Math.random() * 1920],
              y: [Math.random() * 1080, Math.random() * 1080],
            }}
            transition={{ duration: Math.random() * 20 + 20, repeat: Infinity, ease: 'linear' }}
          />
        ))}
      </div>

      {/* Mode Selection */}
      <AnimatePresence mode="wait">
        {mode === 'selection' ? (
          <motion.div key="selection" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 flex flex-col items-center justify-center p-6 relative z-10">
            <div className="text-center mb-12">
               <motion.div initial={{ y: -20 }} animate={{ y: 0 }} className="inline-block p-3 rounded-full bg-regal-gold/10 border border-regal-gold/20 mb-4">
                  <Award size={32} className="text-regal-gold" />
               </motion.div>
               <h1 className="text-5xl md:text-6xl font-cinzel text-regal-gold tracking-tight mb-4 drop-shadow-2xl">Virasat Trials</h1>
               <p className="text-heritage-400 font-cinzel text-sm tracking-[0.2em] uppercase">Choose your path to glory</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
               {/* Mode 1: Riddles */}
               <motion.button 
                 whileHover={{ scale: 1.02, y: -5 }} whileTap={{ scale: 0.98 }}
                 onClick={() => setMode('detective')}
                 className="group relative h-80 bg-heritage-900/40 border border-regal-gold/10 rounded-xl overflow-hidden shadow-2xl transition-all hover:border-regal-gold/40"
               >
                 <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80')] bg-cover bg-center opacity-20 transition-opacity group-hover:opacity-40" />
                 <div className="absolute inset-0 bg-gradient-to-t from-heritage-950 via-heritage-950/40 to-transparent" />
                 <div className="absolute inset-0 p-8 flex flex-col justify-end items-center text-center">
                    <Sparkles className="text-regal-gold mb-4 group-hover:scale-110 transition-transform" size={40} />
                    <h2 className="text-2xl font-cinzel text-parchment mb-2">Heritage Detective</h2>
                    <p className="text-heritage-400 text-sm italic font-body">Solve cryptic riddles about India's most hidden treasures.</p>
                 </div>
               </motion.button>

               {/* Mode 2: Memory */}
               <motion.button 
                 whileHover={{ scale: 1.02, y: -5 }} whileTap={{ scale: 0.98 }}
                 onClick={() => setMode('memory')}
                 className="group relative h-80 bg-heritage-900/40 border border-regal-gold/10 rounded-xl overflow-hidden shadow-2xl transition-all hover:border-regal-gold/40"
               >
                 <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=800&q=80')] bg-cover bg-center opacity-20 transition-opacity group-hover:opacity-40" />
                 <div className="absolute inset-0 bg-gradient-to-t from-heritage-950 via-heritage-950/40 to-transparent" />
                 <div className="absolute inset-0 p-8 flex flex-col justify-end items-center text-center">
                    <Box className="text-regal-gold mb-4 group-hover:scale-110 transition-transform" size={40} />
                    <h2 className="text-2xl font-cinzel text-parchment mb-2">Memory Echoes</h2>
                    <p className="text-heritage-400 text-sm italic font-body">Match sacred imagery with their historical lineages.</p>
                 </div>
               </motion.button>
            </div>

            <button onClick={onBack} className="mt-12 text-heritage-500 hover:text-parchment font-cinzel text-xs tracking-widest uppercase flex items-center gap-2 group">
              <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Return to Dashboard
            </button>
          </motion.div>
        ) : (
          <motion.div key="gameplay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 flex flex-col">
            {/* Header */}
            <header className="relative z-20 px-6 py-4 border-b border-regal-gold/10 flex flex-col gap-3 backdrop-blur-md bg-heritage-950/80">
              <div className="flex justify-between items-center w-full">
                <button onClick={() => setMode('selection')} className="text-heritage-400 hover:text-regal-gold flex items-center gap-2 transition-colors font-cinzel text-sm group shrink-0">
                  <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> <span className="hidden md:inline">Back to Selection</span>
                </button>
                
                <div className="font-cinzel text-xl text-regal-gold tracking-widest flex items-center gap-2">
                  <Sparkles size={20} className="text-regal-gold/70" />
                  <span className="hidden sm:inline">Heritage Detective</span>
                </div>

                <div className="flex items-center gap-4 text-sm font-cinzel rounded-md bg-heritage-900 border border-regal-gold/20 px-3 py-1.5 shadow-inner">
                  <div className="flex gap-1 text-red-500 mr-2">
                    {[...Array(3)].map((_, i) => (
                      <Heart key={i} size={16} className={i < lives ? 'fill-red-500' : 'text-heritage-700'} />
                    ))}
                  </div>
                  <span className="text-heritage-400 border-l border-heritage-700 pl-3">Score: <span className="text-parchment text-lg font-bold">{score}</span></span>
                  {highScore > 0 && <span className="text-regal-gold/50 border-l border-heritage-700 pl-3 hidden md:inline">High Score: <span className="text-regal-gold">{Math.max(score, highScore)}</span></span>}
                  {streak > 1 && <span className="text-regal-gold border border-regal-gold/30 px-2 rounded-full bg-regal-gold/10 ml-2 animate-pulse flex items-center gap-1"><Flame size={12}/>{streak}x</span>}
                </div>
              </div>

              {/* Timer Bar */}
              {!gameOver && (
                <div className="w-full h-1 bg-heritage-900 rounded-full overflow-hidden mt-1 relative">
                  <motion.div 
                    className={`h-full ${timeLeft <= 5 ? 'bg-red-500' : 'bg-regal-gold'} origin-left`}
                    animate={{ width: `${(timeLeft / 20) * 100}%` }}
                    transition={{ duration: 1, ease: "linear" }}
                  />
                </div>
              )}
            </header>

            {/* Main Game Area */}
            <main className="relative z-10 flex-1 flex flex-col items-center justify-center p-6 max-w-3xl mx-auto w-full">
              <AnimatePresence mode="wait">
                {gameOver ? (
                  <motion.div key="gameover" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center text-center p-8 bg-heritage-900/60 border border-regal-gold/20 rounded-sm shadow-2xl relative overflow-hidden">
                     <div className="absolute inset-0 bg-noise mix-blend-overlay opacity-50" />
                     <Heart size={48} className="text-red-500/50 mb-4" />
                     <h2 className="text-4xl font-cinzel text-regal-gold mb-2">Journey Ended</h2>
                     <p className="text-heritage-300 font-cinzel text-lg mb-8 uppercase tracking-widest">Final Score: <span className="text-parchment text-3xl">{score}</span></p>
                     <button onClick={restartGame} className="flex items-center gap-2 bg-gold-gradient text-heritage-950 font-cinzel font-bold px-8 py-3 rounded-sm shadow-[0_0_20px_rgba(212,168,83,0.3)] hover:shadow-[0_0_30px_rgba(212,168,83,0.5)] transition-shadow">
                       <RefreshCw size={18} /> New Journey
                     </button>
                  </motion.div>
                )
                : loading ? (
                  <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center gap-4 text-heritage-500">
                    <Loader2 size={32} className="animate-spin text-regal-gold" />
                    <p className="font-cinzel uppercase tracking-widest text-sm">Consulting the Oracles...</p>
                  </motion.div>
                ) : hasValidRound ? (
                  <motion.div key="game" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} className="w-full flex flex-col items-center">
                    <div className="mb-10 text-center relative w-full pt-4">
                      <div className="flex justify-center mb-4">
                         <div className="flex items-center gap-1.5 text-regal-gold/60 font-cinzel text-sm border border-regal-gold/20 rounded-full px-4 py-1 bg-heritage-950">
                           <Timer size={14}/> {timeLeft}s remaining
                         </div>
                      </div>
                      <h2 className="text-2xl md:text-3xl font-cinzel text-parchment leading-relaxed drop-shadow-lg">
                        {round.riddle}
                      </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                      {round.options.map((opt, idx) => {
                        let btnState = 'waiting' 
                        if (selected !== null) {
                          if (idx === round.correct) btnState = 'right'
                          else if (selected === idx && idx !== round.correct) btnState = 'wrong'
                          else btnState = 'correct-unselected'
                        }

                        return (
                          <motion.button
                            key={idx}
                            whileHover={selected === null ? { scale: 1.02, backgroundColor: 'rgba(212, 168, 83, 0.1)' } : {}}
                            whileTap={selected === null ? { scale: 0.98 } : {}}
                            onClick={() => handleSelect(idx)}
                            disabled={selected !== null}
                            className={`relative overflow-hidden p-6 rounded-sm border text-left font-body text-lg transition-all duration-300
                              ${btnState === 'waiting' ? 'border-regal-gold/30 bg-heritage-900/50 hover:border-regal-gold text-heritage-200' : ''}
                              ${btnState === 'right' ? 'border-green-500/50 bg-green-900/30 text-green-300 shadow-[0_0_20px_rgba(34,197,94,0.2)]' : ''}
                              ${btnState === 'wrong' ? 'border-red-500/50 bg-red-900/30 text-red-300 opacity-60' : ''}
                              ${btnState === 'correct-unselected' ? 'border-heritage-800 bg-heritage-900/50 text-heritage-500 opacity-40' : ''}
                            `}
                          >
                            <span className="font-cinzel text-regal-gold/50 mr-3">{String.fromCharCode(65 + idx)}.</span>
                            {opt}
                            {btnState === 'right' && (
                              <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="absolute right-4 top-1/2 -translate-y-1/2 text-green-400">
                                <Award size={24} />
                              </motion.div>
                            )}
                          </motion.button>
                        )
                      })}
                    </div>

                    <AnimatePresence>
                      {showFact && !gameOver && (
                        <motion.div
                          initial={{ opacity: 0, y: 20, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          className="mt-12 w-full bg-heritage-900/80 border border-regal-gold/20 p-6 rounded-sm text-center shadow-2xl relative overflow-hidden"
                        >
                          <h3 className="font-cinzel text-regal-gold text-lg mb-2 flex items-center justify-center gap-2">
                             {selected === round.correct ? <><Award size={18}/> Brilliant Discovery!</> : `The Answer was ${round.options[round.correct] || 'Unknown'}`}
                          </h3>
                          <p className="text-heritage-300 leading-relaxed mb-6">{round.fact}</p>
                          <motion.button
                            onClick={() => loadNextRound(history)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-gold-gradient text-heritage-950 font-cinzel font-bold px-8 py-3 rounded-sm transition-shadow"
                          >
                            Next Mystery
                          </motion.button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ) : (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-4">
                     <p className="text-heritage-400 font-cinzel">The Oracles are busy... try again in a moment.</p>
                     <button onClick={() => loadNextRound()} className="text-regal-gold border border-regal-gold/30 px-6 py-2 rounded hover:bg-regal-gold/10 font-cinzel text-sm">
                       Try Again
                     </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </main>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {milestone && (
          <motion.div
            initial={{ scale: 0.5, opacity: 0, y: 50 }}
            animate={{ scale: 1.1, opacity: 1, y: -20 }}
            exit={{ scale: 1.5, opacity: 0, transition: { duration: 0.5 } }}
            className="absolute inset-0 pointer-events-none flex items-center justify-center z-50 mix-blend-screen"
          >
            <h1 className="text-5xl md:text-7xl font-cinzel text-regal-gold drop-shadow-[0_0_40px_rgba(212,168,83,0.8)] px-8 text-center bg-heritage-950/40 rounded-full py-4 backdrop-blur-sm border border-regal-gold/30">
              {milestone}
            </h1>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

