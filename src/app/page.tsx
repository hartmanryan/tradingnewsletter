'use client';

import { useState } from 'react';

export default function Home() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await res.json();
      
      if (res.ok) {
        setStatus('success');
        setMessage('Success! You are now subscribed to receive our daily PineScript ideas.');
        setEmail('');
      } else {
        setStatus('error');
        setMessage(data.error || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Network error. Please try again.');
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 relative overflow-hidden flex flex-col items-center justify-center p-4">
      {/* Background glowing orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/30 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-500/20 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-3xl w-full z-10 flex flex-col items-center text-center space-y-8 p-8 md:p-12 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
          </span>
          <span>Daily Custom PineScripts via AI</span>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-white via-slate-200 to-indigo-300 drop-shadow-sm">
          Automate Your Trading Ideas.
        </h1>
        
        <p className="text-lg md:text-xl text-slate-400 max-w-xl">
          Join our exclusive newsletter and receive a fresh, AI-generated TradingView PineScript straight to your inbox every single day.
        </p>

        <form onSubmit={handleSubmit} className="w-full max-w-md mt-4 relative">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-xl blur opacity-30 group-hover:opacity-60 transition duration-500"></div>
            <div className="relative flex items-center bg-slate-900 rounded-xl p-1 shadow-inner">
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                disabled={status === 'loading' || status === 'success'}
                className="w-full bg-transparent text-white px-4 py-3 outline-none placeholder-slate-500 rounded-l-lg disabled:opacity-50"
              />
              <button 
                type="submit"
                disabled={status === 'loading' || status === 'success'}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-6 py-3 rounded-lg transition-colors whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[120px]"
              >
                {status === 'loading' ? (
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : status === 'success' ? 'Subscribed!' : 'Subscribe'}
              </button>
            </div>
          </div>
          
          {/* Status Messages */}
          <div className="h-6 mt-4 transition-all">
            {status === 'success' && <p className="text-emerald-400 text-sm font-medium animate-fade-in">{message}</p>}
            {status === 'error' && <p className="text-rose-400 text-sm font-medium animate-fade-in">{message}</p>}
          </div>
        </form>

        <div className="flex items-center gap-6 text-sm text-slate-500 font-medium">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            100% Free
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            Unsubscribe anytime
          </div>
        </div>
      </div>
    </main>
  );
}
