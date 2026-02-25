'use client';

import { useState } from 'react';

export default function AdminDashboard() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');

    const [prompt, setPrompt] = useState('');
    const [affiliateLink, setAffiliateLink] = useState('');
    const [status, setStatus] = useState<'idle' | 'generating' | 'broadcasting' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');
    const [logs, setLogs] = useState<string[]>([]);

    const addLog = (log: string) => {
        setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${log}`]);
    };

    const verifyPassword = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === (process.env.NEXT_PUBLIC_ADMIN_DEV_PASSWORD || 'admin123')) {
            setIsAuthenticated(true);
        } else {
            alert('Incorrect password');
        }
    };

    const handleBroadcast = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!prompt || !affiliateLink) return;

        setStatus('generating');
        setLogs([]);
        setMessage('');
        addLog('Starting request...');

        try {
            addLog('Sending prompt to Gemini API for PineScript generation...');

            const res = await fetch('/api/admin/broadcast', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt, affiliateLink, password })
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.error || 'Failed to process request');

            addLog('Script generated successfully! Broadcasting to subscribers explicitly via Quentn...');
            setStatus('broadcasting');

            // In real life, the broadcast logic might be in the same API route or a separate one.
            // We will assume the API route handles both generating AND sending to Quentn for atomicity.

            setStatus('success');
            setMessage(`Successfully sent email to ${data.subscriberCount || 0} subscribers!`);
            addLog('Process completed completely.');
            setPrompt('');
            setAffiliateLink('');
        } catch (error: any) {
            setStatus('error');
            setMessage(error.message || 'An error occurred');
            addLog(`Error: ${error.message}`);
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
                <form onSubmit={verifyPassword} className="bg-slate-900 p-8 rounded-2xl border border-white/10 w-full max-w-sm space-y-6">
                    <h1 className="text-2xl font-bold text-white text-center">Admin Login</h1>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter Admin Password"
                        className="w-full bg-slate-950 text-white px-4 py-3 rounded-lg border border-white/10 focus:border-indigo-500 outline-none"
                    />
                    <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-3 rounded-lg transition-colors">
                        Login
                    </button>
                </form>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 text-slate-300 p-6 md:p-12">
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="flex justify-between items-center border-b border-white/10 pb-6">
                    <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                        <span className="bg-indigo-500/20 text-indigo-400 p-2 rounded-lg">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        </span>
                        Newsletter Control Center
                    </h1>
                    <div className="bg-emerald-500/10 text-emerald-400 px-4 py-2 rounded-full text-sm font-medium border border-emerald-500/20">
                        System Online
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-slate-900 border border-white/5 p-6 rounded-2xl shadow-xl">
                        <h2 className="text-xl font-semibold text-white mb-6">Create Broadcast</h2>

                        <form onSubmit={handleBroadcast} className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-400">Gemini Prompt (Trading Idea)</label>
                                <textarea
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                    placeholder="e.g. Create a PineScript strategy that goes long on golden crosses and short on death crosses..."
                                    className="w-full bg-slate-950 border border-white/10 rounded-xl p-4 text-white h-40 resize-none focus:outline-none focus:border-indigo-500 transition-colors"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-400">Daily Affiliate Link</label>
                                <input
                                    type="url"
                                    value={affiliateLink}
                                    onChange={(e) => setAffiliateLink(e.target.value)}
                                    placeholder="https://your-affiliate-link.com"
                                    className="w-full bg-slate-950 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={status === 'generating' || status === 'broadcasting'}
                                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-indigo-500/25 disabled:opacity-50 disabled:cursor-not-allowed group flex items-center justify-center gap-2"
                            >
                                {status === 'generating' && 'Thinking & Generating Code...'}
                                {status === 'broadcasting' && 'Sending to Quentn...'}
                                {status === 'idle' && (
                                    <>
                                        <svg className="w-5 h-5 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                                        Generate & Broadcast Now
                                    </>
                                )}
                                {status === 'success' && 'Reset & Send Another'}
                                {status === 'error' && 'Retry Broadcast'}
                            </button>

                            {message && (
                                <div className={`p-4 rounded-lg mt-4 border ${status === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-400'}`}>
                                    {message}
                                </div>
                            )}
                        </form>
                    </div>

                    <div className="bg-black/50 border border-white/5 p-6 rounded-2xl font-mono text-sm h-full max-h-[600px] flex flex-col">
                        <h2 className="text-slate-400 font-semibold mb-4 border-b border-white/10 pb-4 flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                            Execution Logs
                        </h2>
                        <div className="flex-1 overflow-y-auto space-y-2 text-slate-400">
                            {logs.length === 0 ? (
                                <div className="text-slate-600 italic mt-4">Awaiting execution...</div>
                            ) : (
                                logs.map((log, i) => (
                                    <div key={i} className="animate-fade-in break-words">
                                        {log}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
