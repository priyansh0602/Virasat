import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Loader2, Volume2, VolumeX, Sparkles } from 'lucide-react';
import { interviewMonument } from '../services/GroqService';

export default function MonumentChat({ monumentName, wikiText, onClose }) {
  const [isOpen, setIsOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  const messagesEndRef = useRef(null);

  // Automatically open the chat bubble with a greeting when mounted
  useEffect(() => {
    setIsOpen(true);
    const greeting = `Greetings, traveler. I am the spirit of ${monumentName}. Ask me of the centuries I have witnessed, and I shall answer.`;
    setChatHistory([{ role: 'assistant', content: greeting }]);
  }, [monumentName]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const toggleSpeech = (text) => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    setIsSpeaking(true);
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.85; // Slow, ancient, wise speed
    utterance.pitch = 0.9;
    
    // Try to find an Indian English or Hindi voice for thematic resonance
    const voices = window.speechSynthesis.getVoices();
    const indianVoice = voices.find(v => v.lang.includes('IN') || v.name.includes('India'));
    if (indianVoice) utterance.voice = indianVoice;

    utterance.onend = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  // Stop speaking when closed
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!chatInput.trim() || isLoading) return;

    window.speechSynthesis.cancel();
    setIsSpeaking(false);

    const userMessage = chatInput.trim();
    setChatInput('');
    
    const newHistory = [...chatHistory, { role: 'user', content: userMessage }];
    setChatHistory(newHistory);
    setIsLoading(true);

    const apiHistory = newHistory.filter(msg => msg.role !== 'system');
    
    const response = await interviewMonument(monumentName, wikiText, userMessage, apiHistory);
    
    setChatHistory([...newHistory, { role: 'assistant', content: response }]);
    setIsLoading(false);
  };

  const chatContent = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          className="fixed bottom-6 right-6 z-[100] w-80 shadow-2xl flex flex-col"
        >
          {/* Parchment background styling */}
          <div className="relative rounded-lg overflow-hidden border border-[#c4a475] shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
            <div className="absolute inset-0 bg-[#f4ebd0] opacity-100 z-0"></div>
            {/* Grit overlay for parchment texture */}
            <div className="absolute inset-0 opacity-40 mix-blend-multiply z-[1]" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/old-wall.png")' }}></div>
            
            {/* Header */}
            <div className="relative z-10 bg-[#e3cd9a] border-b border-[#c4a475] p-3 flex justify-between items-center text-[#5c4033]">
              <div className="flex items-center gap-2 font-cinzel font-bold text-sm tracking-widest truncate max-w-[80%]">
                <Sparkles size={16} className="text-[#8b5a2b] shrink-0" />
                <span className="truncate">{monumentName}</span>
              </div>
              <button onClick={() => { setIsOpen(false); if (onClose) onClose(); }} className="hover:text-red-800 transition-colors shrink-0">
                <X size={18} />
              </button>
            </div>

            {/* Chat Area */}
            <div className="relative z-10 h-72 overflow-y-auto p-3 flex flex-col gap-3 custom-scrollbar">
              {chatHistory.map((msg, idx) => {
                const isAssistant = msg.role === 'assistant';
                return (
                  <div key={idx} className={`flex flex-col ${isAssistant ? 'items-start' : 'items-end'}`}>
                    <div className={`p-2.5 rounded-md max-w-[85%] text-sm font-body shadow-sm ${
                      isAssistant 
                        ? 'bg-[#ffffff] text-[#3e2723] border border-[#d2b48c] rounded-tl-none' 
                        : 'bg-[#8b5a2b] text-[#f4ebd0] rounded-tr-none'
                    }`}>
                      {msg.content}
                    </div>
                    {/* Speech Button for Assistant */}
                    {isAssistant && (
                      <button 
                        onClick={() => toggleSpeech(msg.content)}
                        className="mt-1 text-xs text-[#8b5a2b] hover:text-[#5c4033] flex items-center gap-1 font-cinzel font-bold"
                      >
                        {isSpeaking && idx === chatHistory.length - 1 ? <VolumeX size={12} /> : <Volume2 size={12} />}
                        {isSpeaking && idx === chatHistory.length - 1 ? 'Stop' : 'Speak'}
                      </button>
                    )}
                  </div>
                );
              })}
              {isLoading && (
                <div className="self-start p-2 rounded-md bg-[#ffffff] border border-[#d2b48c] text-[#8b5a2b] flex items-center gap-2">
                  <Loader2 size={14} className="animate-spin" />
                  <span className="text-xs font-cinzel tracking-wider">Communing...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="relative z-10 bg-[#eee0b7] border-t border-[#c4a475] p-2">
              <form onSubmit={handleSend} className="relative flex items-center">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder={`Ask ${monumentName}...`}
                  className="w-full bg-[#f8f1e0] border border-[#c4a475] rounded-full pl-4 pr-10 py-2 text-sm text-[#3e2723] placeholder-[#a68a61] focus:outline-none focus:ring-1 focus:ring-[#8b5a2b]"
                />
                <button 
                  type="submit"
                  disabled={isLoading || !chatInput.trim()}
                  className="absolute right-2 text-[#8b5a2b] hover:text-[#5c4033] transition-colors disabled:opacity-50"
                >
                  <Send size={18} />
                </button>
              </form>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // Render outside of the parent container to break out of overflow:hidden blocks
  return typeof document !== 'undefined' ? createPortal(chatContent, document.body) : null;
}
