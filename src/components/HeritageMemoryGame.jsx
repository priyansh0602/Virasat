import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2, Trophy, Timer, Award, User, MapPin, RefreshCw, CheckCircle2, Sparkles } from 'lucide-react'
import { supabase } from '../lib/SupabaseClient'
import { geoSearchHeritage, getArticleSummary, geocodeCityIndia, getMultiSummary, fetchHeritageIcons, getInstantHeritage } from '../services/WikipediaService'
import { discoverHeritageSites } from '../services/GroqService'

/**
 * HeritageMemoryGame.jsx
 * A standalone memory matching game for heritage sites.
 * Pairs: Image <-> Name/Title
 */
export default function HeritageMemoryGame({ current_city, userProfile }) {
  const [cards, setCards] = useState([])
  const [flipped, setFlipped] = useState([])
  const [matched, setMatched] = useState([])
  const [loading, setLoading] = useState(true)
  const [timeLeft, setTimeLeft] = useState(30)
  const [gameState, setGameState] = useState('playing') // playing, won, lost
  const [xpClaimed, setXpClaimed] = useState(false)
  const [leaderboard, setLeaderboard] = useState([])
  const [userRank, setUserRank] = useState(null)
  const [level, setLevel] = useState(1)
  const [levelBonus, setLevelBonus] = useState(0)

  // 1. Fetch Heritage Data & Setup Game
  const initGame = useCallback(async (newLevel = level) => {
    setLoading(true)
    setFlipped([])
    setMatched([])
    setTimeLeft(Math.max(15, 30 - (newLevel - 1) * 5)) 
    setGameState('playing')
    setXpClaimed(false)
    setLevel(newLevel)

    // The Race Logic: Network vs. Instant Fallback (1200ms timeout)
    let gameResolved = false;

    // 1. Setup the Instant Fallback timer
    const fallbackTimer = setTimeout(() => {
      if (!gameResolved) {
        console.warn('Network slow - using instant pool');
        const instantItems = getInstantHeritage(newLevel);
        setupCards(instantItems);
        setLoading(false);
        gameResolved = true;
      }
    }, 1200);

    try {
      const coords = await geocodeCityIndia(current_city)
      let rawItems = []
      
      if (newLevel === 1) {
        if (coords) rawItems = await geoSearchHeritage(coords.lat, coords.lon, 15000, 10, current_city)
        else rawItems = await discoverHeritageSites(current_city, 'sites')
      } else {
        const sites = coords ? await geoSearchHeritage(coords.lat, coords.lon, 15000, 5, current_city) : await discoverHeritageSites(current_city, 'sites')
        const icons = await fetchHeritageIcons(current_city)
        rawItems = [...sites.slice(0, 3), ...icons.slice(0, 3)]
      }

      const resolved = await getMultiSummary(rawItems)
      const verifiedSites = resolved.filter(r => r.thumbnail).slice(0, 6)

      if (verifiedSites.length === 6 && !gameResolved) {
        clearTimeout(fallbackTimer);
        setupCards(verifiedSites);
        setLoading(false);
        gameResolved = true;
      }
    } catch (err) {
      console.error('Game Load Err:', err)
      if (!gameResolved) {
        clearTimeout(fallbackTimer);
        const instantItems = getInstantHeritage(newLevel);
        setupCards(instantItems);
        setLoading(false);
        gameResolved = true;
      }
    }
  }, [current_city]);

  const setupCards = (items) => {
    const gameCards = []
    items.slice(0, 6).forEach((item, index) => {
      gameCards.push({
        id: `img-${index}`,
        matchId: index,
        type: 'image',
        content: item.thumbnail,
        title: item.title
      })
      gameCards.push({
        id: `text-${index}`,
        matchId: index,
        type: 'text',
        content: item.title
      })
    })
    setCards(gameCards.sort(() => Math.random() - 0.5))
  }

  useEffect(() => {
    initGame()
  }, [initGame])

  // 2. Timer Logic
  useEffect(() => {
    if (gameState !== 'playing' || loading) return
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          setGameState('lost')
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [gameState, loading])

  // 3. Game Mechanics
  const handleCardClick = (index) => {
    if (gameState !== 'playing' || flipped.length >= 2 || flipped.includes(index) || matched.includes(cards[index].matchId)) return

    const newFlipped = [...flipped, index]
    setFlipped(newFlipped)

    if (newFlipped.length === 2) {
      const first = cards[newFlipped[0]]
      const second = cards[newFlipped[1]]

      if (first.matchId === second.matchId) {
        setMatched(prev => [...prev, first.matchId])
        setFlipped([])
        if (matched.length + 1 === 6) {
          setGameState('won')
        }
      } else {
        setTimeout(() => setFlipped([]), 1000)
      }
    }
  }

  // 4. Supabase Integration (XP & Leaderboard)
  const claimXP = async () => {
    if (xpClaimed || !userProfile?.id) return
    try {
      const bonus = (level - 1) * 10
      const { error } = await supabase
        .from('profiles')
        .update({ 
          xp: (userProfile.xp || 0) + 50 + bonus,
          last_played_daily: new Date().toISOString().split('T')[0]
        })
        .eq('id', userProfile.id)

      if (!error) {
        setXpClaimed(true)
        setLevelBonus(bonus)
        fetchLeaderboard()
      }
    } catch (err) {
      console.error('XP Claim Error:', err)
    }
  }

  const fetchLeaderboard = useCallback(async () => {
    if (!userProfile?.state) return
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('username, xp, city')
        .eq('state', userProfile.state)
        .order('xp', { ascending: false })

      if (data && !error) {
        setLeaderboard(data.slice(0, 5))
        const rank = data.findIndex(u => u.username === userProfile.username)
        setUserRank(rank !== -1 ? rank + 1 : null)
      }
    } catch (err) {
      console.error('Leaderboard Fetch Error:', err)
    }
  }, [userProfile])

  useEffect(() => {
    if (userProfile?.state) fetchLeaderboard()
  }, [userProfile, fetchLeaderboard])

  if (loading) {
    return (
      <div className="h-[500px] flex flex-col items-center justify-center gap-4 bg-heritage-900/20 rounded-xl border border-regal-gold/10 backdrop-blur-sm">
        <Loader2 className="w-10 h-10 text-regal-gold animate-spin" />
        <p className="font-cinzel text-regal-gold/60 animate-pulse tracking-widest text-sm uppercase">Preparing Artifacts...</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8 w-full max-w-4xl mx-auto p-4 md:p-8 relative">
      
      {/* HUD Bar */}
      <div className="flex justify-between items-center bg-heritage-900/40 backdrop-blur-md p-4 rounded-lg border border-regal-gold/20 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <span className="text-[10px] font-cinzel text-regal-gold/50 uppercase tracking-tighter">Current Location</span>
            <div className="flex items-center gap-1.5">
              <MapPin size={14} className="text-regal-gold" />
              <span className="font-cinzel text-sm text-parchment tracking-wider">{current_city}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-cinzel text-regal-gold/50 uppercase tracking-tighter">Memory Level</span>
            <div className="flex items-center gap-1.5 font-cinzel text-xl text-regal-gold">
              <Award size={18} />
              <span>Level {level}</span>
            </div>
          </div>
          <div className="h-8 w-px bg-regal-gold/10" />
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-cinzel text-regal-gold/50 uppercase tracking-tighter">Time Remaining</span>
            <div className={`flex items-center gap-1.5 font-cinzel text-xl ${timeLeft <= 10 ? 'text-red-500 animate-pulse' : 'text-regal-gold'}`}>
              <Timer size={18} />
              <span>{timeLeft}s</span>
            </div>
          </div>
          <div className="h-8 w-px bg-regal-gold/10 hidden sm:block" />
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-[10px] font-cinzel text-regal-gold/50 uppercase tracking-tighter">Progress</span>
            <span className="font-cinzel text-sm text-parchment tracking-widest">{matched.length}/6 Pairs</span>
          </div>
        </div>
      </div>

      {/* Game Grid */}
      <div className="grid grid-cols-3 md:grid-cols-4 gap-3 md:gap-4 perspective-1000">
        {cards.map((card, index) => (
          <MemoryCard
            key={card.id}
            card={card}
            isFlipped={flipped.includes(index) || matched.includes(card.matchId)}
            onClick={() => handleCardClick(index)}
            isMatched={matched.includes(card.matchId)}
          />
        ))}
      </div>

      {/* Success/Failure Overlays */}
      <AnimatePresence>
        {gameState !== 'playing' && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 z-50 flex items-center justify-center p-6 bg-heritage-950/90 backdrop-blur-xl rounded-2xl border border-regal-gold/30"
          >
            <div className="flex flex-col items-center text-center gap-6 max-w-sm">
              {gameState === 'won' ? (
                <>
                  <div className="relative">
                    <Trophy className="w-20 h-20 text-regal-gold drop-shadow-[0_0_20px_rgba(212,168,83,0.5)]" />
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                      className="absolute inset-x-[-20%] inset-y-[-20%] border border-dashed border-regal-gold/20 rounded-full"
                    />
                  </div>
                  <h2 className="text-3xl font-cinzel text-regal-gold tracking-tight">Venerated Success!</h2>
                  <p className="text-heritage-300 font-body text-sm leading-relaxed italic">
                    {level === 1 
                      ? `You have recalled the monuments of ${current_city}.` 
                      : `You have mastered the legends and architecture of ${current_city}!`}
                  </p>
                  
                  <div className="flex flex-col gap-3 w-full">
                    {!xpClaimed ? (
                      <button 
                        onClick={claimXP}
                        className="group relative px-8 py-3 bg-regal-gold text-heritage-950 font-cinzel font-bold text-sm rounded transition-all hover:scale-105 active:scale-95 shadow-[0_4px_20px_rgba(212,168,83,0.3)]"
                      >
                        <Sparkles className="absolute -top-2 -right-2 w-5 h-5 animate-bounce" />
                        Claim {50 + (level-1)*10} XP
                      </button>
                    ) : (
                      <div className="flex items-center justify-center gap-2 text-green-500 font-cinzel text-sm bg-green-500/10 px-4 py-2 rounded-full border border-green-500/20">
                        <CheckCircle2 size={16} /> XP Claimed (+{levelBonus} Level Bonus)
                      </div>
                    )}

                    <button 
                      onClick={() => initGame(level + 1)}
                      className="px-8 py-3 bg-heritage-800 border border-regal-gold/30 text-regal-gold font-cinzel font-bold text-sm rounded transition-all hover:bg-heritage-700 hover:border-regal-gold/60"
                    >
                      Enter Level {level + 1}
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <RefreshCw className="w-20 h-20 text-heritage-600 animate-spin-slow" />
                  <h2 className="text-3xl font-cinzel text-heritage-400">Timeless Echoes</h2>
                  <p className="text-heritage-500 font-body text-sm italic">The artifacts fade back into history. Steel your mind for another attempt.</p>
                </>
              )}
              
              <button 
                onClick={() => initGame(level)}
                className="mt-4 text-xs font-cinzel text-regal-gold/60 hover:text-regal-gold transition-colors tracking-widest uppercase flex items-center gap-2"
              >
                <RefreshCw size={12} /> Restart Level {level}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Leaderboard Section */}
      <div className="mt-4 bg-heritage-900/30 rounded-xl border border-regal-gold/10 p-6 flex flex-col gap-4">
        <div className="flex items-center justify-between border-b border-regal-gold/10 pb-4">
          <div className="flex items-center gap-4">
             <Award className="text-regal-gold w-6 h-6" />
             <h3 className="font-cinzel text-regal-gold tracking-widest text-lg uppercase">State Rankings</h3>
          </div>
          {userRank && (
            <span className="text-xs font-cinzel text-parchment/60 bg-regal-gold/10 px-3 py-1 rounded-full border border-regal-gold/20">
              You are <span className="text-regal-gold font-bold">#{userRank}</span> in {current_city}!
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {leaderboard.map((player, i) => (
            <div key={i} className="flex flex-col items-center text-center gap-1 p-3 rounded-lg bg-heritage-950/50 border border-regal-gold/5">
               <span className="text-[10px] font-cinzel text-regal-gold uppercase tracking-tighter">Rank #{i+1}</span>
               <span className="font-cinzel text-parchment text-sm truncate w-full">{player.username}</span>
               <div className="flex items-center gap-1 text-xs text-regal-gold font-bold">
                 <Trophy size={10} />
                 {player.xp} XP
               </div>
            </div>
          ))}
          {leaderboard.length === 0 && (
            <div className="col-span-5 py-4 text-center text-heritage-600 font-cinzel text-sm italic">
               The chronicles are empty. Be the first to claim glory!
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function MemoryCard({ card, onClick, isFlipped, isMatched }) {
  return (
    <div 
      className={`relative h-32 md:h-44 cursor-pointer transition-all duration-500 preserve-3d ${isMatched ? 'opacity-60 scale-95' : 'hover:scale-105 active:scale-95'}`}
      onClick={onClick}
    >
      <motion.div 
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        className="relative w-full h-full transform-style-3d"
      >
        {/* Card Front (The Hidden Side) */}
        <div className="absolute inset-0 bg-regal-gold/5 border-2 border-regal-gold/40 rounded-lg backface-hidden overflow-hidden flex items-center justify-center p-2 shadow-2xl">
           {/* Vintage Vintage Pattern */}
           <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
             backgroundImage: 'radial-gradient(#d4a853 1px, transparent 1px)',
             backgroundSize: '20px 20px'
           }} />
           <div className="w-full h-full border border-regal-gold/20 flex items-center justify-center">
             <div className="relative">
                <div className="w-12 h-12 rotate-45 border-2 border-regal-gold/20" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                   <Award className="text-regal-gold/40 w-6 h-6" />
                </div>
             </div>
           </div>
        </div>

        {/* Card Back (Revealed Content) */}
        <div 
          className="absolute inset-0 bg-heritage-900 border-2 border-regal-gold rounded-lg backface-hidden overflow-hidden shadow-card rotate-y-180"
        >
          {card.type === 'image' ? (
            <img src={card.content} alt={card.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-3 text-center bg-parchment-texture text-regal-gold">
               <span className="font-cinzel text-[10px] md:text-xs font-bold leading-tight uppercase tracking-tight">{card.content}</span>
            </div>
          )}
          {isMatched && (
            <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center backdrop-blur-[2px]">
               <CheckCircle2 className="text-green-400 w-10 h-10 drop-shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}
