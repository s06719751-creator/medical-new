/* eslint-disable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useDb } from '../context/DbContext';
import { getChatbotResponse } from '../services/aiService';
import {
  Send, Bot, ShieldAlert,
  RefreshCw, User, Stethoscope, Activity, Heart, AlertCircle,
  ShieldCheck
} from 'lucide-react';
import { GlowingCard } from '../components/GlowingCard';

const generateUniqueId = (prefix: string): string =>
  `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

export const AIChat: React.FC = () => {
  const { user } = useAuth();
  const { saveChatMessage, getChatHistory, clearChatHistory, knowledge } = useDb();

  const [input, setInput] = useState<string>('');
  const [localHistory, setLocalHistory] = useState<{ id: string; sender: 'user' | 'ai'; message: string; createdAt: string }[]>([]);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const chatEndRef = useRef<HTMLDivElement>(null);
  const activeUserId = user ? user.id : 'guest_session';
  const [sessionId] = useState<string>(() => 'sess_' + Math.random().toString(36).substring(2, 9));

  useEffect(() => {
    const hist = getChatHistory(activeUserId);
    if (hist.length === 0) {
      setLocalHistory([{
        id: 'welcome',
        sender: 'ai',
        message: `Hello ${user ? user.fullName : 'there'}! 👋 I'm Medora AI — your dedicated medical assistant powered by GPT-4.\n\nI'm here to help with health questions, symptom guidance, finding specialists, and more. I'm strictly focused on medical topics only.\n\nHow can I support your health today?`,
        createdAt: new Date().toISOString()
      }]);
    } else {
      setLocalHistory(hist.map(h => ({ id: h.id, sender: h.sender, message: h.message, createdAt: h.createdAt })));
    }
  }, [activeUserId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [localHistory, isTyping]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;
    setInput('');
    setErrorMsg('');

    const userMsg = { id: generateUniqueId('usr'), sender: 'user' as const, message: textToSend, createdAt: new Date().toISOString() };
    setLocalHistory(prev => [...prev, userMsg]);
    setIsTyping(true);

    await saveChatMessage(activeUserId, textToSend, 'user', sessionId, { client: 'web-full-chat' });

    try {
      const response = await getChatbotResponse(
        textToSend,
        localHistory.map(h => ({ sender: h.sender, message: h.message })),
        knowledge
      );

      const aiMsg = {
        id: generateUniqueId('ai'),
        sender: 'ai' as const,
        message: response.message || "I'm having trouble analyzing this right now. Please ask again in a moment.",
        createdAt: new Date().toISOString()
      };

      setLocalHistory(prev => [...prev, aiMsg]);
      await saveChatMessage(activeUserId, response.message, 'ai', sessionId, { client: 'web-full-chat-ai' });

      if (response.suggestedAction?.type === 'link') {
        let targetTab = response.suggestedAction.value;
        if (['reports', 'reminders', 'chats'].includes(targetTab)) targetTab = 'dashboard';
        window.location.hash = `#/${targetTab}`;
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Connection issue. Please try again.');
    } finally {
      setIsTyping(false);
    }
  };

  const handleClearChat = () => {
    clearChatHistory(activeUserId);
    setLocalHistory([{
      id: 'welcome',
      sender: 'ai',
      message: 'Chat cleared. I\'m ready for new health questions. How can I help?',
      createdAt: new Date().toISOString()
    }]);
  };

  const quickPrompts = [
    { label: 'Check Symptoms', action: 'Check my symptoms', icon: Stethoscope, color: 'border-teal-100 text-teal-700 hover:border-teal-300 bg-teal-50 hover:bg-teal-100/50' },
    { label: 'Explain Report', action: 'Explain my medical report', icon: ShieldAlert, color: 'border-emerald-100 text-emerald-700 hover:border-emerald-300 bg-emerald-50 hover:bg-emerald-100/50' },
    { label: 'Find a Doctor', action: 'Find a doctor for me', icon: User, color: 'border-sky-100 text-sky-700 hover:border-sky-300 bg-sky-50 hover:bg-sky-100/50' },
    { label: 'Heart Health', action: 'Tell me about heart health tips', icon: Heart, color: 'border-rose-100 text-rose-700 hover:border-rose-300 bg-rose-50 hover:bg-rose-100/50' },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-8 text-left animate-[fadeIn_0.5s_ease-out]">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start min-h-[78vh]">

        {/* LEFT COLUMN: Sidebar info (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-6 lg:sticky lg:top-24">
          
          {/* Main Info Card */}
          <GlowingCard glowColor="teal" className="p-6 flex flex-col gap-4 border-teal-100/70">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center shrink-0">
                <Bot className="w-5 h-5 text-teal-600 animate-pulse" />
              </div>
              <div>
                <h3 className="font-extrabold text-teal-900 text-base">Medora AI Clinical Care</h3>
                <span className="text-[10px] text-emerald-600 font-bold tracking-wider uppercase font-mono">GPT-4 Secured</span>
              </div>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed border-t border-teal-50 pt-4">
              Consult Medora AI about localized symptoms, preventative habits, blood work diagnostics, and diagnostic triage values.
            </p>
            <div className="flex flex-col gap-2.5 text-xs text-slate-600 font-medium">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>HIPAA Compliant & Fully Encrypted</span>
              </div>
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-teal-500 shrink-0" />
                <span>Restricted to Medical Topics Only</span>
              </div>
            </div>
            
            <button
              onClick={handleClearChat}
              className="mt-2 py-3 w-full rounded-xl border border-teal-100 text-teal-700 bg-teal-50 hover:bg-teal-100/50 hover:border-teal-300 text-xs font-bold uppercase tracking-wider font-mono flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reset Chat Session
            </button>
          </GlowingCard>

          {/* Emergency Pulse Card */}
          <GlowingCard glowColor="none" className="p-5 border-rose-100/80 bg-rose-50/20 flex gap-3.5 items-start">
            <div className="w-9 h-9 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center shrink-0 text-rose-500 animate-pulse">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h4 className="font-extrabold text-rose-900 text-xs uppercase tracking-wider">Emergency Protocol</h4>
              <p className="text-[11px] text-slate-500 leading-normal">
                If you are experiencing severe symptoms like **chest pain**, difficulty breathing, stroke markers (numbness, slurring), or severe injuries, please immediately call **911** or **112**.
              </p>
            </div>
          </GlowingCard>

        </div>

        {/* RIGHT COLUMN: Chat (8 cols) */}
        <div className="lg:col-span-8 bg-white border border-teal-100/80 shadow-[0_10px_40px_rgba(13,148,136,0.04)] rounded-[28px] overflow-hidden flex flex-col h-[78vh]">
          
          {/* Conversation view header */}
          <div className="bg-gradient-to-r from-teal-600 to-emerald-600 px-6 py-4 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2.5">
              <Bot className="w-5 h-5 text-white" />
              <div className="text-left">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-white leading-none">AI Care Assistant</h4>
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                  </span>
                </div>
                <span className="text-[9px] text-teal-100 uppercase tracking-widest font-semibold font-mono">Live Session Channel</span>
              </div>
            </div>
          </div>

          {/* Messages Stream area */}
          <div className="flex-grow overflow-y-auto p-6 flex flex-col gap-5 bg-teal-50/20">
            
            {localHistory.map((msg) => (
              <div key={msg.id} className={`flex gap-3 max-w-[85%] ${msg.sender === 'user' ? 'self-end flex-row-reverse' : 'self-start'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border ${
                  msg.sender === 'user' ? 'bg-teal-100 border-teal-200' : 'bg-white border-teal-100 shadow-sm'
                }`}>
                  {msg.sender === 'user' ? <User className="w-4 h-4 text-teal-700" /> : <Bot className="w-4 h-4 text-teal-600" />}
                </div>
                <div className="text-left">
                  <div className={`rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed shadow-sm ${
                    msg.sender === 'user'
                      ? 'bg-teal-600 text-white rounded-tr-none'
                      : 'bg-white text-slate-700 rounded-tl-none border border-teal-50'
                  }`}>
                    {msg.message.split('\n').map((para, idx) => (
                      <p key={idx} className={idx > 0 ? 'mt-2' : ''}>{para}</p>
                    ))}
                  </div>
                  <span className="text-[9px] text-slate-400 font-mono mt-1 px-1 block">
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-3 max-w-[80%] self-start">
                <div className="w-8 h-8 rounded-full bg-white border border-teal-100 flex items-center justify-center shrink-0 shadow-sm">
                  <Bot className="w-4 h-4 text-teal-500 animate-pulse" />
                </div>
                <div className="bg-white rounded-2xl rounded-tl-none px-4 py-3.5 border border-teal-50 shadow-sm flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2.5 h-2.5 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2.5 h-2.5 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}

            {errorMsg && (
              <div className="p-3.5 rounded-2xl border border-rose-100 bg-rose-50 text-rose-600 text-xs font-mono text-center flex items-center justify-center gap-2 self-center">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Quick clinical triage suggestions */}
          <div className="px-6 py-3 bg-white border-t border-teal-50 flex flex-wrap gap-2 text-left justify-start">
            <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 font-mono w-full mb-1">Quick Clinical Scopes</span>
            {quickPrompts.map((btn, idx) => {
              const IconComp = btn.icon;
              return (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(btn.action)}
                  className={`text-[10px] font-bold py-2 px-3 rounded-xl border flex items-center gap-1.5 transition-all uppercase tracking-wider cursor-pointer active:scale-95 ${btn.color}`}
                >
                  <IconComp className="w-3.5 h-3.5 shrink-0" />
                  <span>{btn.label}</span>
                </button>
              );
            })}
          </div>

          {/* Entry Form input */}
          <form
            onSubmit={(e) => { e.preventDefault(); handleSendMessage(input); }}
            className="p-4 bg-white border-t border-teal-100 flex gap-3 items-center"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Query localized symptoms, preventative metrics, report analysis..."
              className="flex-grow bg-teal-50/50 border border-teal-100/80 rounded-2xl px-5 py-4 text-xs sm:text-sm text-teal-950 placeholder-teal-400 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-200"
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="p-4 rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 disabled:opacity-50 text-white transition-all shadow-md flex items-center justify-center shrink-0 cursor-pointer active:scale-95 duration-150"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>

        </div>

      </div>
    </div>
  );
};
