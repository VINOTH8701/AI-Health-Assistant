import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { analyzeSymptomsWithAI } from '../services/geminiService';
import { EmergencyBanner } from '../components/EmergencyBanner';
import { Disclaimers } from '../components/Disclaimers';
import { 
  Stethoscope, 
  Mic, 
  MicOff, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  UserCheck, 
  RefreshCw,
  Sliders,
  ShieldCheck,
  Volume2,
  Brain,
  Video,
  Cpu
} from 'lucide-react';

export const AISymptomAnalysis = ({ setActiveTab }) => {
  const { user, apiKey, addSymptomRecord, selectedModel, changeModel, plan, setIsTelehealthModalOpen, setIsPremiumModalOpen } = useAuth();
  
  const [symptomInput, setSymptomInput] = useState('');
  const [severityScale, setSeverityScale] = useState(5);
  const [durationDays, setDurationDays] = useState(1);
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [speechSupported, setSpeechSupported] = useState(true);
  const [usedVoice, setUsedVoice] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setSpeechSupported(false);
    }
  }, []);

  const toggleVoiceInput = () => {
    if (!speechSupported) {
      alert("Web Speech API is not supported on this browser. Please type your symptoms instead.");
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    setIsListening(true);
    recognition.start();

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setSymptomInput(prev => (prev ? prev + ' ' + transcript : transcript));
      setCharCount(prev => prev + transcript.length + 1);
      setUsedVoice(true);
      setIsListening(false);
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
  };

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!symptomInput.trim()) return;

    setIsLoading(true);
    setAnalysisResult(null);

    const result = await analyzeSymptomsWithAI(
      symptomInput,
      severityScale,
      user?.profile || {},
      apiKey,
      selectedModel
    );

    setAnalysisResult(result);
    setIsLoading(false);

    const newRecord = {
      id: 'sym_' + Date.now(),
      timestamp: new Date().toISOString(),
      rawInput: symptomInput,
      inputMode: usedVoice ? 'voice' : 'text',
      severityScale,
      durationDays,
      aiAnalysis: result
    };
    addSymptomRecord(newRecord);
    setUsedVoice(false);
  };

  const handleTextChange = (e) => {
    setSymptomInput(e.target.value);
    setCharCount(e.target.value.length);
  };

  const clearInput = () => {
    setSymptomInput('');
    setCharCount(0);
    setUsedVoice(false);
    setAnalysisResult(null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-6">
      
      {/* Page Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
          <Brain className="w-4 h-4 animate-pulse" />
          <span>Google Gemini AI Triage Engine ({selectedModel})</span>
        </div>
        <h1 className="text-3xl font-black text-white">AI Symptom Triage Workspace</h1>
        <p className="text-xs text-slate-400 max-w-lg mx-auto leading-relaxed">
          Describe your symptoms using natural text or speech dictation. Our AI safety engine scans for emergency red-flags and delivers non-diagnostic wellness insights.
        </p>
      </div>

      {/* Model & Tier Selector Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <Cpu className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-bold text-slate-300">Select Reasoning Model:</span>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          {[
            { id: 'gemini-1.5-flash', label: 'Gemini 1.5 Flash (Fast)', proOnly: false },
            { id: 'gemini-1.5-pro', label: 'Gemini 1.5 Pro (Deep Clinical Reasoning)', proOnly: true }
          ].map((m) => {
            const isActive = selectedModel === m.id;
            return (
              <button
                key={m.id}
                onClick={() => {
                  if (m.proOnly && plan === 'free') {
                    setIsPremiumModalOpen(true);
                  } else {
                    changeModel(m.id);
                  }
                }}
                className={`flex-1 md:flex-none px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  isActive 
                    ? 'bg-emerald-500 text-slate-950 shadow-md' 
                    : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <span>{m.label}</span>
                {m.proOnly && plan === 'free' && <span className="ml-1 text-[10px] text-amber-400">PRO</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* API Key Notice */}
      {!apiKey && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300 flex items-center gap-3">
          <Sparkles className="w-4 h-4 shrink-0" />
          <span>
            <strong>Tip:</strong> Set your custom Google Gemini API Key (via navbar <strong>🔑 Set Gemini Key</strong>) for live LLM generation. Default intelligent medical engine is active.
          </span>
        </div>
      )}

      {/* Main Input Card */}
      <div className="glass-panel p-6 md:p-8 rounded-3xl border border-slate-800 space-y-6">
        
        <form onSubmit={handleAnalyze} className="space-y-6">
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <Stethoscope className="w-4 h-4 text-emerald-400" />
                <span>Describe Your Symptoms</span>
              </label>

              <div className="flex items-center gap-2">
                {usedVoice && (
                  <span className="flex items-center gap-1 px-2 py-1 rounded-lg bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-[10px] font-bold">
                    <Volume2 className="w-3 h-3" /> Voice Input Active
                  </span>
                )}

                <button
                  type="button"
                  onClick={toggleVoiceInput}
                  disabled={!speechSupported}
                  title={!speechSupported ? 'Speech API not supported in this browser' : isListening ? 'Stop Listening' : 'Start Voice Input'}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    isListening 
                      ? 'bg-red-500 text-white shadow-lg shadow-red-500/30 animate-pulse' 
                      : !speechSupported
                        ? 'bg-slate-900 border border-slate-800 text-slate-600 cursor-not-allowed'
                        : 'bg-slate-950 border border-slate-800 text-slate-300 hover:text-emerald-400 hover:border-emerald-500/40'
                  }`}
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4 text-emerald-400" />}
                  <span>{isListening ? 'Listening… Click to Stop' : 'Voice Speech Input'}</span>
                </button>
              </div>
            </div>

            {isListening && (
              <div className="flex items-center gap-3 p-3 rounded-xl bg-red-500/10 border border-red-500/30 animate-pulse">
                <div className="flex gap-1 items-center">
                  {[1, 2, 3, 4].map(i => (
                    <div
                      key={i}
                      className="w-1 bg-red-400 rounded-full"
                      style={{ 
                        height: `${8 + i * 4}px`,
                        animation: `pulse ${0.5 + i * 0.15}s ease-in-out infinite alternate`
                      }}
                    />
                  ))}
                </div>
                <span className="text-xs font-bold text-red-300">🎙️ Listening… Speak your symptoms clearly into microphone</span>
              </div>
            )}

            <div className="relative">
              <textarea
                rows={5}
                required
                value={symptomInput}
                onChange={handleTextChange}
                placeholder="e.g. Throbbing migraine on the left side of head with mild light sensitivity for past 2 days..."
                className="w-full px-4 py-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-emerald-500 leading-relaxed transition-colors resize-none"
              />
              <div className="absolute bottom-3 right-3 flex items-center gap-2">
                {symptomInput && (
                  <button
                    type="button"
                    onClick={clearInput}
                    className="text-[10px] text-slate-500 hover:text-red-400 transition-colors font-bold"
                  >
                    Clear
                  </button>
                )}
                <span className="text-[10px] text-slate-600 font-mono">{charCount} chars</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5 rounded-2xl bg-slate-950/60 border border-slate-800/80">
            
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-300 flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Pain / Severity Scale</span>
                </span>
                <span className={`font-black font-mono text-sm px-2.5 py-0.5 rounded-lg ${
                  severityScale >= 7 ? 'text-red-400 bg-red-500/15 border border-red-500/30' :
                  severityScale >= 4 ? 'text-amber-400 bg-amber-500/15 border border-amber-500/30' :
                  'text-emerald-400 bg-emerald-500/15 border border-emerald-500/30'
                }`}>
                  {severityScale} / 10
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={severityScale}
                onChange={(e) => setSeverityScale(Number(e.target.value))}
                className={`w-full h-2 rounded-lg cursor-pointer ${
                  severityScale >= 7 ? 'accent-red-500' : severityScale >= 4 ? 'accent-amber-500' : 'accent-emerald-500'
                }`}
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-semibold">
                <span>😌 Mild (1-3)</span>
                <span>😣 Moderate (4-6)</span>
                <span>🤕 Severe (7-10)</span>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-teal-400" />
                <span>Symptom Duration</span>
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min="1"
                  max="365"
                  value={durationDays}
                  onChange={(e) => setDurationDays(Number(e.target.value))}
                  className="w-24 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-emerald-500 font-mono"
                />
                <span className="text-xs text-slate-400 font-semibold">
                  {durationDays === 1 ? 'Day' : 'Days'} 
                  {durationDays > 7 ? ' 🔴 Consult a doctor' : durationDays > 3 ? ' 🟡 Monitor closely' : ' 🟢 Recent onset'}
                </span>
              </div>
            </div>

          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={isLoading || !symptomInput.trim()}
              className="flex-1 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black text-sm shadow-xl shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-[1.01] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>Evaluating with {selectedModel}…</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>Run AI Triage Analysis</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>

      {/* ANALYSIS RESULT DISPLAY */}
      {analysisResult && (
        <div className="space-y-6 animate-fade-in">
          
          {analysisResult.emergencyFlag ? (
            <EmergencyBanner onFindHospitals={() => setActiveTab('hospitals')} />
          ) : (
            <div className="glass-panel p-6 md:p-8 rounded-3xl border border-emerald-500/40 space-y-6 glow-emerald animate-slide-up">
              
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-extrabold text-white">AI Wellness Assessment</h3>
                    <span className="text-[11px] text-emerald-400 font-semibold">
                      ✓ Saved via {analysisResult.modelUsed || selectedModel}
                    </span>
                  </div>
                </div>
                
                <button
                  onClick={() => setIsTelehealthModalOpen(true)}
                  className="px-3.5 py-1.5 rounded-xl bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-bold hover:bg-cyan-500/30 flex items-center gap-1.5"
                >
                  <Video className="w-4 h-4" />
                  <span>Telehealth Consult</span>
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-emerald-400">Triage Summary</span>
                <p className="text-sm font-semibold text-slate-100 leading-relaxed">
                  {analysisResult.summary}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                    <span>Potential Causes to Discuss</span>
                  </h4>
                  <ul className="space-y-2">
                    {analysisResult.potentialCauses?.map((cause, idx) => (
                      <li key={idx} className="text-xs text-slate-300 flex items-start gap-2 bg-slate-950 p-2.5 rounded-xl border border-slate-800/80">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0"></span>
                        <span>{cause}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Recommended Self-Care Steps</span>
                  </h4>
                  <ul className="space-y-2">
                    {analysisResult.recommendedActions?.map((action, idx) => (
                      <li key={idx} className="text-xs text-slate-300 flex items-start gap-2 bg-slate-950 p-2.5 rounded-xl border border-slate-800/80">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0"></span>
                        <span>{action}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <UserCheck className="w-5 h-5 text-teal-400 shrink-0" />
                  <div>
                    <span className="text-[10px] uppercase font-bold text-teal-300 tracking-wider">Suggested Medical Specialist</span>
                    <p className="text-sm font-extrabold text-white">{analysisResult.suggestedSpecialist}</p>
                  </div>
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                  <button
                    onClick={() => setActiveTab('history')}
                    className="flex-1 md:flex-none px-4 py-2 rounded-xl bg-slate-900 text-teal-300 text-xs font-bold border border-teal-500/30 hover:bg-slate-800 transition-colors"
                  >
                    View in Timeline
                  </button>
                  <button
                    onClick={() => setActiveTab('hospitals')}
                    className="flex-1 md:flex-none px-4 py-2 rounded-xl bg-teal-500/20 text-teal-200 text-xs font-bold border border-teal-500/30 hover:bg-teal-500/30 transition-colors"
                  >
                    Find Hospital
                  </button>
                </div>
              </div>

              <Disclaimers inline={true} />

            </div>
          )}

        </div>
      )}

    </div>
  );
};
