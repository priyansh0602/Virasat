/**
 * Auth.jsx
 * Cinematic heritage landing — Handles Signup / Login / Email OTP / Google OAuth.
 */
import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../lib/SupabaseClient'
import { Mail, Lock, Eye, EyeOff, AlertCircle, Loader2, LogIn, UserPlus, ArrowLeft } from 'lucide-react'

/* ─── Floating Particles ─── */
function FloatingParticles() {
  const particles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    duration: Math.random() * 8 + 6,
    delay: Math.random() * 5,
  }))

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map(p => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: `rgba(212, 168, 83, ${0.15 + Math.random() * 0.25})`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.6, 0.2],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}

/* ─── Heritage Logo (animated) ─── */
function AnimatedLogo() {
  return (
    <motion.svg
      viewBox="0 0 60 60"
      className="w-16 h-16"
      fill="none"
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
    >
      <motion.circle
        cx="30" cy="30" r="28"
        stroke="#d4a853" strokeWidth="1.5"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2, ease: 'easeInOut' }}
      />
      <motion.path
        d="M15 38 L30 16 L45 38"
        stroke="#d4a853" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, delay: 0.5, ease: 'easeInOut' }}
      />
      <motion.path
        d="M20 38 L40 38"
        stroke="#d4a853" strokeWidth="1.8" strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1, delay: 1, ease: 'easeInOut' }}
      />
      <motion.path d="M25 38 L25 30" stroke="#b8860b" strokeWidth="1.4" strokeLinecap="round"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ duration: 0.8, delay: 1.3 }} />
      <motion.path d="M35 38 L35 30" stroke="#b8860b" strokeWidth="1.4" strokeLinecap="round"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ duration: 0.8, delay: 1.4 }} />
      <motion.path d="M25 30 L35 30" stroke="#b8860b" strokeWidth="1.4" strokeLinecap="round"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ duration: 0.8, delay: 1.5 }} />
      <motion.circle cx="30" cy="13" r="2.5" fill="#d4a853"
        initial={{ scale: 0 }} animate={{ scale: 1 }}
        transition={{ duration: 0.5, delay: 1.8, type: 'spring' }} />
    </motion.svg>
  )
}

/* ─── Historical Quotes Rotator ─── */
const QUOTES = [
  { text: "A nation's culture resides in the hearts and in the soul of its people.", author: "Mahatma Gandhi" },
  { text: "History is not the past. It is the present.", author: "James Baldwin" },
  { text: "Heritage is our legacy from our past, what we live with today.", author: "UNESCO" },
  { text: "The more you know about the past, the better prepared you are for the future.", author: "Theodore Roosevelt" },
]

function QuoteRotator() {
  const [idx, setIdx] = useState(0)
  useEffect(() => {
    const timer = setInterval(() => setIdx(prev => (prev + 1) % QUOTES.length), 6000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="h-16 flex items-center justify-center">
      <AnimatePresence mode="wait">
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <p className="text-heritage-300/80 text-sm font-sans italic leading-relaxed">
            "{QUOTES[idx].text}"
          </p>
          <p className="text-regal-gold/50 text-xs font-body mt-1 tracking-wider uppercase">
            — {QUOTES[idx].author}
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

/* ─── OTP Input ─── */
function OtpVerify({ email, onVerified, onBack }) {
  const [otp, setOtp]       = useState(Array(6).fill(''))
  const [loading, setLoading] = useState(false)
  const [error, setError]   = useState('')
  const [resent, setResent] = useState(false)
  const inputRefs           = useRef([])

  const handleChange = (val, idx) => {
    if (!/^\d?$/.test(val)) return
    const next = [...otp]
    next[idx] = val
    setOtp(next)
    if (val && idx < 5) inputRefs.current[idx + 1]?.focus()
  }

  const handleKeyDown = (e, idx) => {
    if (e.key === 'Backspace' && !otp[idx] && idx > 0)
      inputRefs.current[idx - 1]?.focus()
  }

  const handlePaste = (e) => {
    const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (!text) return
    const next = Array(6).fill('')
    text.split('').forEach((c, i) => { next[i] = c })
    setOtp(next)
    inputRefs.current[Math.min(text.length, 5)]?.focus()
  }

  const verify = async () => {
    const token = otp.join('')
    if (token.length < 6) { setError('Please enter the 6-digit code.'); return }
    setLoading(true); setError('')
    const { error: err } = await supabase.auth.verifyOtp({ email, token, type: 'email' })
    if (err) { setError(err.message); setLoading(false) }
    else onVerified()
  }

  const resend = async () => {
    await supabase.auth.signInWithOtp({ email })
    setResent(true)
    setTimeout(() => setResent(false), 30000)
  }

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
      <button onClick={onBack} className="flex items-center gap-1 text-regal-gold/70 hover:text-regal-gold text-sm mb-6 transition-colors font-body">
        <ArrowLeft size={14} /> Back
      </button>

      <div className="text-center mb-8">
        <div className="w-14 h-14 bg-regal-gold/10 border border-regal-gold/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <Mail className="text-regal-gold" size={24} />
        </div>
        <h2 className="font-cinzel text-2xl text-parchment mb-1 tracking-wide">Verify Your Email</h2>
        <p className="text-heritage-400 text-sm font-body">
          We sent a 6-digit code to<br />
          <span className="font-semibold text-regal-gold">{email}</span>
        </p>
      </div>

      <div className="flex justify-center gap-2 mb-6" onPaste={handlePaste}>
        {otp.map((digit, idx) => (
          <input
            key={idx}
            ref={el => inputRefs.current[idx] = el}
            className="otp-input"
            maxLength={1}
            value={digit}
            onChange={e => handleChange(e.target.value, idx)}
            onKeyDown={e => handleKeyDown(e, idx)}
            inputMode="numeric"
            autoComplete="one-time-code"
          />
        ))}
      </div>

      {error && (
        <div className="flex items-center gap-2 text-red-400 bg-red-900/20 border border-red-800/30 rounded-sm px-3 py-2 mb-4 text-sm font-body">
          <AlertCircle size={14} /> {error}
        </div>
      )}

      <button onClick={verify} disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
        {loading ? <><Loader2 size={16} className="animate-spin" /> Verifying…</> : 'Confirm & Enter'}
      </button>

      <p className="text-center text-sm text-heritage-500 mt-5 font-body">
        Didn't receive it?{' '}
        {resent
          ? <span className="text-green-400 font-semibold">Sent! Check your inbox.</span>
          : <button onClick={resend} className="text-regal-gold underline hover:text-regal-amber">Resend code</button>
        }
      </p>
    </motion.div>
  )
}

/* ─── Main Auth ─── */
export default function Auth({ onAuthSuccess }) {
  const [mode, setMode]     = useState('login')
  const [email, setEmail]   = useState('')
  const [password, setPass] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoad]  = useState(false)
  const [error, setError]   = useState('')
  const [info, setInfo]     = useState('')

  const clear = () => { setError(''); setInfo('') }

  const toAbsoluteUrl = (value) => {
    const raw = (value ?? '').trim()
    if (!raw) return window.location.origin
    if (/^https?:\/\//i.test(raw)) return raw
    if (raw.startsWith('//')) return `${window.location.protocol}${raw}`
    return `https://${raw}`
  }

  const appRedirectUrl = toAbsoluteUrl(import.meta.env.VITE_APP_URL || window.location.origin)

  const handleGoogle = async () => {
    setLoad(true); clear()
    const { error: err } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { 
        redirectTo: appRedirectUrl,
        queryParams: {
          prompt: 'select_account',
        },
      },
    })
    if (err) { setError(err.message); setLoad(false) }
  }

  const handleEmailAuth = async (e) => {
    e.preventDefault(); clear(); setLoad(true)
    if (mode === 'signup') {
      const { error: err } = await supabase.auth.signUp({ email, password })
      if (err) setError(err.message)
      else { setInfo('Account created! Check your email to verify, then sign in.'); setMode('login') }
    } else {
      const { error: err } = await supabase.auth.signInWithPassword({ email, password })
      if (err) setError(err.message)
      else onAuthSuccess()
    }
    setLoad(false)
  }

  const handleOtp = async () => {
    if (!email) { setError('Enter your email address first.'); return }
    setLoad(true); clear()
    const { error: err } = await supabase.auth.signInWithOtp({ email })
    if (err) setError(err.message)
    else setMode('otp')
    setLoad(false)
  }

  const isLogin = mode === 'login'

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center">
      {/* Cinematic Background */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 animate-ken-burns"
          style={{
            backgroundImage: 'url(/auth-bg.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-heritage-950/80 to-black/90" />
        {/* Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(0,0,0,0.7)_100%)]" />
      </div>

      {/* Floating gold particles */}
      <FloatingParticles />

      {/* Content */}
      <div className="relative z-10 w-full max-w-md px-4 py-12">

        {/* Header — Animated Logo + Title */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          <div className="flex justify-center mb-4">
            <AnimatedLogo />
          </div>
          <motion.h1
            className="font-decorative text-5xl md:text-6xl text-gold-gradient tracking-widest"
            initial={{ opacity: 0, letterSpacing: '0.5em' }}
            animate={{ opacity: 1, letterSpacing: '0.15em' }}
            transition={{ duration: 1.5, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            Virasat
          </motion.h1>
          <motion.p
            className="font-cinzel text-heritage-400/80 text-xs mt-2 tracking-[0.35em] uppercase"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.5 }}
          >
            Heritage Knowledge Base
          </motion.p>
        </motion.div>

        {/* Card */}
        <motion.div
          className="card-heritage px-8 py-10 glow-gold"
          initial={{ opacity: 0, y: 40, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.8, delay: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          <AnimatePresence mode="wait">
            {mode === 'otp' ? (
              <OtpVerify key="otp" email={email} onVerified={onAuthSuccess} onBack={() => setMode('login')} />
            ) : (
              <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <h2 className="font-cinzel text-2xl text-parchment mb-6 text-center tracking-wider">
                  {isLogin ? 'Welcome Back' : 'Begin Your Journey'}
                </h2>

                {/* Google */}
                <button
                  onClick={handleGoogle}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10
                             border border-heritage-600/30 hover:border-regal-gold/40 rounded-sm py-3 px-4 text-sm font-body font-medium
                             text-parchment shadow-sm transition-all duration-300 mb-5 backdrop-blur-sm"
                >
                  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Continue with Google
                </button>

                <div className="ornament-divider"><span className="text-regal-gold/40">✦</span></div>

                {/* Form */}
                <form onSubmit={handleEmailAuth} className="space-y-4">
                  <div className="relative">
                    <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-heritage-500" />
                    <input
                      type="email"
                      placeholder="Email address"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="input-field pl-10"
                      required
                      autoComplete="email"
                    />
                  </div>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-heritage-500" />
                    <input
                      type={showPw ? 'text' : 'password'}
                      placeholder="Password"
                      value={password}
                      onChange={e => setPass(e.target.value)}
                      className="input-field pl-10 pr-10"
                      required
                      minLength={6}
                      autoComplete={isLogin ? "current-password" : "new-password"}
                    />
                    <button type="button" onClick={() => setShowPw(!showPw)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-heritage-500 hover:text-regal-gold transition-colors">
                      {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>

                  {error && (
                    <div className="flex items-center gap-2 text-red-400 bg-red-900/20 border border-red-800/30 rounded-sm px-3 py-2 text-sm font-body">
                      <AlertCircle size={14} /> {error}
                    </div>
                  )}
                  {info && (
                    <div className="text-green-400 bg-green-900/20 border border-green-800/30 rounded-sm px-3 py-2 text-sm font-body">
                      {info}
                    </div>
                  )}

                  <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
                    {loading
                      ? <><Loader2 size={16} className="animate-spin" /> Please wait…</>
                      : isLogin
                        ? <><LogIn size={16} /> Enter the Archive</>
                        : <><UserPlus size={16} /> Begin Journey</>
                    }
                  </button>
                </form>

                {/* OTP Option */}
                <div className="mt-3">
                  <button
                    onClick={handleOtp}
                    disabled={loading}
                    className="btn-secondary w-full flex items-center justify-center gap-2 text-sm"
                  >
                    <Mail size={15} /> Sign in with Email OTP
                  </button>
                </div>


                <p className="text-center text-sm text-heritage-500 mt-6 font-body">
                  {isLogin ? "Don't have an account? " : 'Already have an account? '}
                  <button
                    onClick={() => { setMode(isLogin ? 'signup' : 'login'); clear() }}
                    className="text-regal-gold font-semibold hover:underline"
                  >
                    {isLogin ? 'Sign Up' : 'Sign In'}
                  </button>
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Rotating Quote */}
        <motion.div
          className="mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2 }}
        >
          <QuoteRotator />
        </motion.div>
      </div>
    </div>
  )
}
