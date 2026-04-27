import React, { useState, useEffect, useRef } from 'react'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import { Loader2, Clock, Hourglass } from 'lucide-react'
import { generateCityTimeline } from '../services/GroqService'

export default function Timeline({ location }) {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(false)
  
  // Cache to avoid refetching during the same session
  const [cachedLocation, setCachedLocation] = useState('')

  useEffect(() => {
    if (!location || location === cachedLocation) return
    
    const fetchTimeline = async () => {
      setLoading(true)
      try {
        const data = await generateCityTimeline(location)
        if (data && data.length > 0) {
          setEvents(data)
          setCachedLocation(location)
        }
      } catch (err) {
        console.error('Timeline error:', err)
      } finally {
        setLoading(false)
      }
    }
    
    fetchTimeline()
  }, [location, cachedLocation])

  const containerRef = useRef(null)
  
  const { scrollXProgress } = useScroll({ container: containerRef })
  
  // A subtle parallax background element
  const bgX = useTransform(scrollXProgress, [0, 1], ['0%', '-20%'])

  if (!location) return null

  return (
    <div className="relative w-full overflow-hidden py-10 bg-gradient-to-b from-heritage-900/40 to-transparent rounded-sm border border-regal-gold/10">
      
      {/* Background decoration */}
      <motion.div 
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{ x: bgX, backgroundImage: 'url(/hero-bg.png)', backgroundSize: 'cover', backgroundBlendMode: 'overlay' }}
      />
      
      <div className="px-6 mb-6 flex items-center gap-3 relative z-10">
        <Hourglass className="text-regal-gold" size={24} />
        <div>
          <h2 className="font-cinzel text-xl text-parchment uppercase tracking-widest">Evolution of {location}</h2>
          <p className="text-heritage-400 text-xs font-body italic mt-1">Journey through time, from origins to modern era</p>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-heritage-500 font-cinzel gap-4">
          <Loader2 size={32} className="animate-spin text-regal-gold" />
          <p className="tracking-widest animate-pulse">Unearthing historical records...</p>
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-16 text-heritage-600 font-body">
          <Clock size={48} className="mx-auto mb-4 opacity-20 text-regal-gold" />
          <p className="italic">Chronicles are currently unavailable for this region.</p>
        </div>
      ) : (
        <div className="relative z-10 w-full overflow-x-auto hide-scrollbar custom-scrollbar" ref={containerRef}>
          {/* Main timeline line */}
          <div className="absolute top-[88px] left-0 right-0 h-0.5 bg-gradient-to-r from-regal-gold/10 via-regal-gold/40 to-regal-gold/10 min-w-max" 
               style={{ width: `${Math.max(100, events.length * 25)}%` }} />
          
          <div className="flex px-6 pb-6 pt-4 gap-8 w-max">
            {events.map((event, index) => (
              <TimelineEvent key={index} event={event} index={index} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function TimelineEvent({ event, index }) {
  const cardRef = useRef(null)
  const isInView = useInView(cardRef, { once: true, margin: '-50px' })
  
  return (
    <motion.div 
      ref={cardRef}
      className="relative flex flex-col items-center w-72 shrink-0 group"
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.15, ease: 'easeOut' }}
    >
      {/* Timeline Node */}
      <div className="w-10 h-10 rounded-full border-2 border-regal-gold bg-heritage-950 flex items-center justify-center z-10 shadow-[0_0_15px_rgba(212,168,83,0.3)] group-hover:scale-110 group-hover:shadow-[0_0_25px_rgba(212,168,83,0.5)] transition-all duration-300 mb-6">
        <div className="w-4 h-4 rounded-full bg-gradient-to-br from-regal-gold to-regal-amber" />
      </div>

      {/* Content Card */}
      <motion.div 
        className="bg-heritage-950/80 backdrop-blur-sm border border-heritage-700/50 group-hover:border-regal-gold/40 rounded-sm p-5 w-full shadow-cinematic transition-colors duration-300"
        whileHover={{ y: -5 }}
      >
        <div className="flex justify-between items-start mb-3">
          <span className="text-[10px] font-cinzel tracking-widest text-regal-gold/70 uppercase px-2 py-0.5 border border-regal-gold/20 rounded-sm bg-regal-gold/5">
            {event.era}
          </span>
          <span className="text-xs font-semibold font-body text-heritage-300 bg-heritage-900 px-2 py-0.5 rounded-sm">
            {event.year}
          </span>
        </div>
        
        <h3 className="font-cinzel text-lg text-parchment leading-snug mb-2 group-hover:text-regal-gold transition-colors">
          {event.title}
        </h3>
        
        <p className="text-heritage-400 text-xs font-body leading-relaxed">
          {event.description}
        </p>
      </motion.div>
    </motion.div>
  )
}
