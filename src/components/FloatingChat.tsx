/* eslint-disable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useDb } from '../context/DbContext';
import { getChatbotResponse } from '../services/aiService';
import { MessageSquare, X, Send, Bot, ShieldAlert, Sparkles, RefreshCw, User, Stethoscope, Activity, Heart } from 'lucide-react';

interface FloatingChatProps {
  onNavigate: (tab: string) => void;
}

const generateUniqueId = (prefix: string): string =>
  `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

export const FloatingChat: React.FC<FloatingChatProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const { saveChatMessage, getChatHistory, clearChatHistory, knowledge } = useDb();

  const [isOpen, setIsOpen] = useState<boolean>(false);
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
  }, [activeUserId, isOpen]);

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

    await saveChatMessage(activeUserId, textToSend, 'user', sessionId, { client: 'web-floating-chat' });

    try {
      const response = await getChatbotResponse(
        textToSend,
        localHistory.map(h => ({ sender: h.sender, message: h.message })),
        knowledge
      );

      const aiMsg = { id: generateUniqueId('ai'), sender: 'ai' as const, message: response.message, createdAt: new Date().toISOString() };
      setLocalHistory(prev => [...prev, aiMsg]);
      await saveChatMessage(activeUserId, response.message, 'ai', sessionId, { client: 'web-floating-chat-ai' });

      if (response.suggestedAction?.type === 'link') {
        let targetTab = response.suggestedAction.value;
        if (['reports', 'reminders', 'chats'].includes(targetTab)) targetTab = 'dashboard';
        onNavigate(targetTab);
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
    setLocalHistory([{ id: 'welcome', sender: 'ai', message: 'Chat cleared. I\'m ready for new health questions. How can I help?', createdAt: new Date().toISOString() }]);
  };

  const quickPrompts = [
    { label: 'Check Symptoms', action: 'Check my symptoms', icon: Stethoscope, color: 'border-teal-200 text-teal-700 hover:border-teal-400 bg-teal-50 hover:bg-teal-100' },
    { label: 'Explain Report', action: 'Explain my medical report', icon: ShieldAlert, color: 'border-emerald-200 text-emerald-700 hover:border-emerald-400 bg-emerald-50 hover:bg-emerald-100' },
    { label: 'Find a Doctor', action: 'Find a doctor for me', icon: User, color: 'border-sky-200 text-sky-700 hover:border-sky-400 bg-sky-50 hover:bg-sky-100' },
    { label: 'Book Appointment', action: 'Book an appointment', icon: Sparkles, color: 'border-teal-200 text-teal-700 hover:border-teal-400 bg-teal-50 hover:bg-teal-100' },
    { label: 'Heart Health', action: 'Tell me about heart health tips', icon: Heart, color: 'border-rose-200 text-rose-600 hover:border-rose-400 bg-rose-50 hover:bg-rose-100' },
    { label: 'General Wellness', action: 'General health and wellness tips', icon: Activity, color: 'border-emerald-200 text-emerald-700 hover:border-emerald-400 bg-emerald-50 hover:bg-emerald-100' },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end">

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed inset-0 sm:inset-auto sm:mb-4 sm:bottom-24 sm:right-6 w-full h-full sm:w-[400px] sm:h-[610px] rounded-none sm:rounded-3xl bg-white border border-teal-100 shadow-[0_20px_60px_rgba(13,148,136,0.2)] flex flex-col overflow-hidden animate-[slideIn_0.3s_cubic-bezier(0.16,1,0.3,1)]">

          {/* Header */}
          <div className="bg-gradient-to-r from-teal-600 to-emerald-600 p-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="text-sm font-bold text-white">Medora AI Assistant</h4>
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
                  </span>
                </div>
                <span className="text-[10px] text-teal-100 font-mono uppercase tracking-wider">Medical Only · GPT-4 Powered</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <button onClick={handleClearChat} title="Clear History" className="text-white/70 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors">
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => setIsOpen(false)} className="text-white/70 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="bg-teal-50 border-b border-teal-100 p-3 flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-teal-500 flex-shrink-0 mt-0.5" />
            <p className="text-[10px] leading-normal text-teal-700 font-mono">
              Medical guidance only · Not a substitute for professional care · For emergencies, call 911/112
            </p>
          </div>

          {/* Messages */}
          <div className="flex-grow overflow-y-auto p-4 flex flex-col gap-4 bg-slate-50/50">
            {localHistory.map((msg) => (
              <div key={msg.id} className={`flex gap-2.5 max-w-[88%] ${msg.sender === 'user' ? 'self-end flex-row-reverse' : 'self-start'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border shrink-0 ${
                  msg.sender === 'user'
                    ? 'bg-teal-100 border-teal-200'
                    : 'bg-teal-50 border-teal-100'
                }`}>
                  {msg.sender === 'user'
                    ? <User className="w-4 h-4 text-teal-600" />
                    : <Bot className="w-4 h-4 text-teal-500" />}
                </div>
                <div className="text-left">
                  <div className={`rounded-2xl p-3 text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-teal-600 text-white rounded-tr-none'
                      : 'bg-white text-slate-700 rounded-tl-none border border-teal-100 shadow-sm'
                  }`}>
                    {msg.message.split('\n').map((para, i) => (
                      <p key={i} className={i > 0 ? 'mt-1.5' : ''}>{para}</p>
                    ))}
                  </div>
                  <span className="text-[9px] text-slate-400 font-mono mt-1 block px-1">
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex gap-2.5 max-w-[80%] self-start">
                <div className="w-8 h-8 rounded-full bg-teal-50 border border-teal-100 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 text-teal-500 animate-pulse" />
                </div>
                <div className="bg-white rounded-2xl rounded-tl-none p-3 border border-teal-100 shadow-sm flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}

            {errorMsg && <p className="text-rose-500 text-[10px] font-mono text-center">✕ {errorMsg}</p>}
            <div ref={chatEndRef} />
          </div>

          {/* Quick Prompts */}
          <div className="p-3 bg-white border-t border-teal-100 grid grid-cols-2 gap-1.5">
            {quickPrompts.map((btn, i) => {
              const IconComp = btn.icon;
              return (
                <button
                  key={i}
                  onClick={() => handleSendMessage(btn.action)}
                  className={`text-[9px] font-bold py-2 px-2.5 rounded-xl border flex items-center gap-1.5 transition-all text-left uppercase tracking-wider ${btn.color}`}
                >
                  <IconComp className="w-3 h-3 flex-shrink-0" />
                  <span className="truncate">{btn.label}</span>
                </button>
              );
            })}
          </div>

          {/* Input */}
          <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(input); }} className="p-3 bg-white border-t border-teal-100 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask any health or medical question..."
              className="flex-grow bg-teal-50 border border-teal-100 rounded-xl px-4 py-3 text-xs text-teal-900 placeholder-teal-400 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-200"
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="p-3 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 disabled:opacity-50 text-white transition-all shadow-sm flex items-center justify-center shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-gradient-to-br from-teal-500 to-emerald-600 shadow-[0_6px_24px_rgba(13,148,136,0.45)] hover:shadow-[0_8px_32px_rgba(13,148,136,0.65)] hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center"
        style={{ animation: 'tealPulse 2s infinite ease-in-out' }}
      >
        {isOpen ? <X className="w-5 h-5 text-white" /> : <MessageSquare className="w-5 h-5 text-white" />}
      </button>
    </div>
  );
};
