/**
 * Onboarding.jsx
 * Cinematic profile setup: Indian State dropdown + City text input.
 * Saves preferences to Supabase user metadata.
 */
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '../lib/SupabaseClient'
import { MapPin, ChevronDown, Loader2, CheckCircle2 } from 'lucide-react'

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  // Union Territories
  'Andaman & Nicobar Islands', 'Chandigarh', 'Dadra & Nagar Haveli and Daman & Diu',
  'Delhi (NCT)', 'Jammu & Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry',
]

const STEPS = [
  { num: 1, label: 'Account' },
  { num: 2, label: 'Profile' },
  { num: 3, label: 'Explore' },
]

export default function Onboarding({ user, onComplete }) {
  const [state, setState]   = useState('')
  const [city, setCity]     = useState('')
  const [loading, setLoad]  = useState(false)
  const [error, setError]   = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!state) { setError('Please select your state.'); return }
    if (!city.trim()) { setError('Please enter your city.'); return }
    setLoad(true); setError('')

    const { error: err } = await supabase.auth.updateUser({
      data: { state, city: city.trim(), onboarded: true },
    })

    if (err) { setError(err.message); setLoad(false) }
    else onComplete({ state, city: city.trim() })
  }

  return (
    <div className="min-h-screen bg-parchment-texture flex items-center justify-center px-4 py-16 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-regal-gold/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-lg relative z-10">

        {/* Progress */}
        <motion.div
          className="flex items-center justify-center gap-0 mb-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {STEPS.map((s, i) => (
            <React.Fragment key={s.num}>
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors
                  ${s.num < 2 ? 'bg-regal-gold text-heritage-950' : s.num === 2 ? 'bg-regal-gold text-heritage-950 ring-4 ring-regal-gold/20' : 'bg-heritage-800 text-heritage-500'}`}>
                  {s.num < 2 ? <CheckCircle2 size={16} /> : s.num}
                </div>
                <span className={`text-xs mt-1 font-body ${s.num === 2 ? 'text-regal-gold font-semibold' : 'text-heritage-600'}`}>{s.label}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`h-px w-16 mx-1 mb-5 ${s.num < 2 ? 'bg-regal-gold' : 'bg-heritage-700'}`} />
              )}
            </React.Fragment>
          ))}
        </motion.div>

        <motion.div
          className="card-heritage px-8 py-10 glow-gold"
          initial={{ opacity: 0, y: 40, filter: 'blur(6px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="text-center mb-8">
            <motion.div
              className="w-14 h-14 bg-regal-gold/10 border border-regal-gold/30 rounded-full
                          flex items-center justify-center mx-auto mb-4"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.5, type: 'spring' }}
            >
              <MapPin className="text-regal-gold" size={24} />
            </motion.div>
            <h2 className="font-cinzel text-2xl text-parchment tracking-wider">Where Are You From?</h2>
            <p className="font-body text-heritage-400 text-sm mt-1 italic">
              We'll personalise heritage stories near you
            </p>
          </div>

          {user?.email && (
            <div className="bg-regal-gold/5 border border-regal-gold/20 rounded-sm px-4 py-2 mb-6 text-center">
              <p className="text-xs font-body text-heritage-400">Signed in as <span className="font-semibold text-regal-gold">{user.email}</span></p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* State */}
            <div>
              <label className="block text-xs font-cinzel font-semibold text-regal-gold/70 uppercase tracking-widest mb-1.5">
                State / Union Territory
              </label>
              <div className="relative">
                <select
                  value={state}
                  onChange={e => setState(e.target.value)}
                  className="input-field appearance-none pr-10 cursor-pointer"
                >
                  <option value="">— Select State —</option>
                  {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-heritage-500 pointer-events-none" />
              </div>
            </div>

            {/* City */}
            <div>
              <label className="block text-xs font-cinzel font-semibold text-regal-gold/70 uppercase tracking-widest mb-1.5">
                City / Town
              </label>
              <div className="relative">
                <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-heritage-500" />
                <input
                  type="text"
                  placeholder="e.g. Jaipur, Varanasi, Hampi…"
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  className="input-field pl-10"
                />
              </div>
              <p className="text-xs text-heritage-600 font-body mt-1">
                Used to find nearby heritage landmarks via Geosearch.
              </p>
            </div>

            {error && (
              <div className="text-red-400 bg-red-900/20 border border-red-800/30 rounded-sm px-3 py-2 text-sm font-body">
                {error}
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 mt-2">
              {loading
                ? <><Loader2 size={16} className="animate-spin" /> Saving…</>
                : 'Begin Exploration →'
              }
            </button>
          </form>
        </motion.div>

        {/* Decorative quote */}
        <motion.blockquote
          className="text-center mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
        >
          <p className="font-sans italic text-heritage-500/60 text-sm leading-relaxed">
            "The more you know about the past, the better you are prepared for the future."
          </p>
          <cite className="text-regal-gold/40 text-xs font-body not-italic mt-1 block tracking-wider uppercase">— Theodore Roosevelt</cite>
        </motion.blockquote>
      </div>
    </div>
  )
}
