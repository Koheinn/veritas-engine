/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { ShieldCheck, ShieldAlert, ShieldQuestion, Loader2, Smile, Frown, Meh, Activity } from 'lucide-react';
import { motion } from 'motion/react';

type CredibilityResult = {
  status: 'Fake' | 'Real' | 'Unsure';
  score: number;
  reasoning: string;
  sourceAnalysis: {
    sourceName: string;
    sourceCredibilityScore: number;
    domainAge: string;
    knownBiases: string;
    factCheckHistory: string;
  };
};

type SentimentResult = {
  sentiment: 'Positive' | 'Negative' | 'Neutral' | string;
  explanation: string;
};

export default function App() {
  // Credibility State
  const [credInput, setCredInput] = useState('');
  const [isCredLoading, setIsCredLoading] = useState(false);
  const [credResult, setCredResult] = useState<CredibilityResult | null>(null);
  const [credError, setCredError] = useState('');

  // Sentiment State
  const [sentInput, setSentInput] = useState('');
  const [isSentLoading, setIsSentLoading] = useState(false);
  const [sentResult, setSentResult] = useState<SentimentResult | null>(null);
  const [sentError, setSentError] = useState('');

  const analyzeCredibility = async () => {
    if (!credInput.trim()) {
      setCredError('Please enter some news text to analyze.');
      return;
    }
    
    setCredError('');
    setIsCredLoading(true);
    setCredResult(null);

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: credInput.trim(), mode: 'credibility' }),
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to analyze news.');
      }

      setCredResult(data);
    } catch (err: any) {
      setCredError(err.message || 'Something went wrong.');
    } finally {
      setIsCredLoading(false);
    }
  };

  const analyzeSentiment = async () => {
    if (!sentInput.trim()) {
      setSentError('Please enter text to analyze sentiment.');
      return;
    }
    
    setSentError('');
    setIsSentLoading(true);
    setSentResult(null);

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: sentInput.trim(), mode: 'sentiment' }),
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to analyze sentiment.');
      }

      setSentResult(data);
    } catch (err: any) {
      setSentError(err.message || 'Something went wrong.');
    } finally {
      setIsSentLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
      <div className="w-full max-w-7xl space-y-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-light mb-2 text-slate-800">Veritas <span className="font-bold">Engine</span></h1>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto">
            Select a tool below to audit news credibility or analyze linguistic sentiment.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          
          {/* Credibility Column */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3 mb-2">
              <ShieldCheck className="w-6 h-6 text-indigo-600" />
              <h2 className="text-xl font-bold uppercase tracking-widest text-slate-800">Fake News Detector</h2>
            </div>
            
            <div className="bg-white shadow-sm border border-slate-200">
              <div className="p-8">
                <label htmlFor="cred-input" className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-6">
                  News Text or Claim
                </label>
                <textarea
                  id="cred-input"
                  rows={5}
                  className="w-full h-48 p-6 bg-slate-50 border-2 border-slate-200 focus:border-indigo-600 focus:outline-none transition-all resize-none font-serif text-lg leading-relaxed text-slate-700 placeholder:text-slate-300"
                  placeholder="Paste the news content here for credibility audit..."
                  value={credInput}
                  onChange={(e) => setCredInput(e.target.value)}
                />
                
                {credError && (
                  <p className="mt-4 text-xs font-bold uppercase tracking-widest text-rose-600">{credError}</p>
                )}

                <div className="mt-6 flex items-center space-x-4">
                  <button
                    onClick={analyzeCredibility}
                    disabled={isCredLoading}
                    className="flex-grow bg-indigo-600 text-white h-14 text-sm font-bold uppercase tracking-[0.2em] hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isCredLoading ? (
                      <>
                        <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                        Auditing...
                      </>
                    ) : (
                      'Run Credibility Audit'
                    )}
                  </button>
                </div>
              </div>
            </div>

            {credResult && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`bg-white shadow-sm border border-slate-200 border-l-4 ${
                  credResult.status === 'Real' ? 'border-l-emerald-500' :
                  credResult.status === 'Fake' ? 'border-l-rose-500' :
                  'border-l-amber-500'
                }`}
              >
                <div className="p-8">
                  <div className="flex justify-between items-start mb-6 border-b border-slate-100 pb-6">
                    <div>
                      <span className={`text-sm font-mono font-bold uppercase tracking-widest ${
                        credResult.status === 'Real' ? 'text-emerald-600' :
                        credResult.status === 'Fake' ? 'text-rose-600' :
                        'text-amber-600'
                      }`}>
                        {credResult.status === 'Real' ? 'Likely Real' : credResult.status === 'Fake' ? 'Likely Fake' : 'Unsure'}
                      </span>
                      <p className="text-slate-400 font-medium text-xs mt-2 uppercase tracking-wider">
                        Credibility Score: <span className="text-slate-800 font-bold font-mono text-sm ml-1">{credResult.score}/100</span>
                      </p>
                    </div>
                    
                    <div className="p-3 border-2 border-slate-100 text-slate-400">
                      {credResult.status === 'Real' && <ShieldCheck className="w-6 h-6 text-emerald-500" />}
                      {credResult.status === 'Fake' && <ShieldAlert className="w-6 h-6 text-rose-500" />}
                      {(credResult.status !== 'Real' && credResult.status !== 'Fake') && <ShieldQuestion className="w-6 h-6 text-amber-500" />}
                    </div>
                  </div>

                  <div className="prose prose-slate max-w-none">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Analysis Reasoning</h3>
                    <p className="text-slate-700 leading-relaxed font-serif text-base whitespace-pre-wrap">
                      {credResult.reasoning}
                    </p>
                  </div>

                  <div className="mt-8 border-t border-slate-100 pt-8">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6">Source Verification Profile</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-slate-50 border border-slate-200 p-4 flex flex-col justify-between">
                        <span className="text-[10px] uppercase font-bold text-slate-400">Source Name</span>
                        <span className="text-lg font-bold font-mono text-slate-800 mt-1">{credResult.sourceAnalysis.sourceName}</span>
                      </div>
                      <div className="bg-slate-50 border border-slate-200 p-4 flex flex-col justify-between">
                        <span className="text-[10px] uppercase font-bold text-slate-400">Credibility</span>
                        <span className="text-lg font-bold font-mono text-indigo-600 mt-1">{credResult.sourceAnalysis.sourceCredibilityScore} / 10</span>
                      </div>
                      <div className="bg-slate-50 border border-slate-200 p-4 flex flex-col justify-between md:col-span-2">
                        <span className="text-[10px] uppercase font-bold text-slate-400">Domain Age / Est.</span>
                        <span className="text-sm font-medium text-slate-700 mt-1">{credResult.sourceAnalysis.domainAge}</span>
                      </div>
                      <div className="bg-slate-50 border border-slate-200 p-4 flex flex-col justify-between md:col-span-2">
                        <span className="text-[10px] uppercase font-bold text-slate-400">Known Biases</span>
                        <span className="text-sm font-medium text-slate-700 mt-1 leading-relaxed">{credResult.sourceAnalysis.knownBiases}</span>
                      </div>
                      <div className="bg-slate-50 border border-slate-200 p-4 flex flex-col justify-between md:col-span-2">
                        <span className="text-[10px] uppercase font-bold text-slate-400">Fact-Check History</span>
                        <span className="text-sm font-medium text-slate-700 mt-1 leading-relaxed">{credResult.sourceAnalysis.factCheckHistory}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Sentiment Column */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3 mb-2">
              <Activity className="w-6 h-6 text-indigo-600" />
              <h2 className="text-xl font-bold uppercase tracking-widest text-slate-800">Sentiment Analyzer</h2>
            </div>

            <div className="bg-white shadow-sm border border-slate-200">
              <div className="p-8">
                <label htmlFor="sent-input" className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-6">
                  Text to Analyze
                </label>
                <textarea
                  id="sent-input"
                  rows={5}
                  className="w-full h-48 p-6 bg-slate-50 border-2 border-slate-200 focus:border-indigo-600 focus:outline-none transition-all resize-none font-serif text-lg leading-relaxed text-slate-700 placeholder:text-slate-300"
                  placeholder="Paste text here to extract its emotional tone..."
                  value={sentInput}
                  onChange={(e) => setSentInput(e.target.value)}
                />
                
                {sentError && (
                  <p className="mt-4 text-xs font-bold uppercase tracking-widest text-rose-600">{sentError}</p>
                )}

                <div className="mt-6 flex items-center space-x-4">
                  <button
                    onClick={analyzeSentiment}
                    disabled={isSentLoading}
                    className="flex-grow bg-slate-900 text-white h-14 text-sm font-bold uppercase tracking-[0.2em] hover:bg-slate-800 shadow-lg shadow-slate-200 transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSentLoading ? (
                      <>
                        <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                        Analyzing...
                      </>
                    ) : (
                      'Run Sentiment Analysis'
                    )}
                  </button>
                </div>
              </div>
            </div>

            {sentResult && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`bg-white shadow-sm border border-slate-200 border-l-4 ${
                  sentResult.sentiment === 'Positive' ? 'border-l-emerald-500' :
                  sentResult.sentiment === 'Negative' ? 'border-l-rose-500' :
                  'border-l-amber-500'
                }`}
              >
                <div className="p-8">
                  <div className="flex flex-col items-center mb-6 pb-6 border-b border-slate-100">
                    <span className="text-[10px] uppercase font-bold text-slate-400 mb-4">Detected Tone</span>
                    {sentResult.sentiment === 'Positive' ? (
                      <Smile className="w-12 h-12 text-emerald-500 mb-3" />
                    ) : sentResult.sentiment === 'Negative' ? (
                      <Frown className="w-12 h-12 text-rose-500 mb-3" />
                    ) : (
                      <Meh className="w-12 h-12 text-amber-500 mb-3" />
                    )}
                    <span className={`text-2xl font-bold uppercase tracking-widest ${
                      sentResult.sentiment === 'Positive' ? 'text-emerald-600' :
                      sentResult.sentiment === 'Negative' ? 'text-rose-600' :
                      'text-amber-600'
                    }`}>{sentResult.sentiment}</span>
                  </div>
                  
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4 text-center">Explanation</h3>
                    <p className="text-sm font-medium text-slate-700 leading-relaxed text-center max-w-sm mx-auto">
                      {sentResult.explanation}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
