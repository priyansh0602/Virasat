/**
 * App.jsx
 * Root component — manages auth state & screen routing:
 *   auth → onboarding → dashboard
 */
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { supabase } from './lib/SupabaseClient'
import Auth        from './components/Auth'
import Onboarding  from './components/Onboarding'
import Dashboard   from './components/Dashboard'
import Game        from './components/Game'

/* ─── Cinematic full-screen loader ─── */
function Loader() {
  return (
    <div className="min-h-screen bg-parchment-texture flex flex-col items-center justify-center gap-6 relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-regal-gold/5 rounded-full blur-[100px]" />

      <motion.svg
        viewBox="0 0 60 60"
        className="w-16 h-16"
        fill="none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <motion.circle
          cx="30" cy="30" r="28"
          stroke="#d4a853" strokeWidth="1.5"
          initial={{ pathLength: 0, opacity: 0.3 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.path
          d="M15 38 L30 16 L45 38"
          stroke="#d4a853" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, delay: 0.3, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.path
          d="M20 38 L40 38"
          stroke="#d4a853" strokeWidth="1.8" strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1, delay: 0.6, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.circle
          cx="30" cy="13" r="2.5" fill="#d4a853"
          animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.svg>

      <motion.p
        className="font-cinzel text-regal-gold/60 text-sm tracking-[0.3em] uppercase"
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        Loading Virasat…
      </motion.p>
    </div>
  )
}

export default function App() {
  const [session,  setSession]  = useState(undefined) // undefined = loading
  const [profile,  setProfile]  = useState(null)      // { city, state }
  const [screen,   setScreen]   = useState('loading') // loading | auth | onboard | dashboard

  /* ── Bootstrap auth state ── */
  useEffect(() => {
    // Verify session on mount - getUser() is more secure as it hits the server
    supabase.auth.getUser().then(({ data: { user }, error }) => {
      if (error || !user) {
        handleSession(null)
      } else {
        supabase.auth.getSession().then(({ data: { session } }) => {
          handleSession(session)
        })
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Virasat Auth Event:", event);
      if (event === 'SIGNED_OUT' || event === 'USER_DELETED') {
        handleSession(null)
      } else {
        handleSession(session)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleSession = (sess) => {
    setSession(sess)
    console.log("Virasat Auth Debug: Session changed", { 
      uid: sess?.user?.id, 
      email: sess?.user?.email,
      meta: sess?.user?.user_metadata 
    });
    
    if (!sess) {
      setScreen('auth')
      setProfile(null)
      return
    }
    const meta = sess.user?.user_metadata ?? {}
    if (meta.onboarded && meta.city) {
      setProfile({ city: meta.city, state: meta.state ?? '' })
      setScreen('dashboard')
    } else {
      setScreen('onboard')
    }
  }

  const handleAuthSuccess = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    handleSession(session)
  }

  const handleOnboardComplete = async (profileData) => {
    // Refresh session to get latest metadata (onboarded=true)
    const { data: { session } } = await supabase.auth.getSession()
    setSession(session)
    setProfile(profileData)
    setScreen('dashboard')
  }

  /* ── Render ── */
  return (
    <>
      {screen === 'loading' && <Loader />}
      
      {screen === 'auth' && <Auth onAuthSuccess={handleAuthSuccess} />}
      
      {screen === 'onboard' && <Onboarding user={session?.user} onComplete={handleOnboardComplete} />}
      
      {screen === 'game' && <Game onBack={() => setScreen('dashboard')} user={session?.user} profile={profile} />}
      
      {screen === 'dashboard' && <Dashboard user={session?.user} profile={profile} onPlayGame={() => setScreen('game')} />}
    </>
  )
}
