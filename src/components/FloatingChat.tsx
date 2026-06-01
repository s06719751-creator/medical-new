/* eslint-disable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useDb } from '../context/DbContext';
import { getChatbotResponse } from '../services/aiService';
import { MessageSquare, X, Send, Bot, ShieldAlert, Sparkles, RefreshCw, User, Stethoscope } from 'lucide-react';

interface FloatingChatProps {
  onNavigate: (tab: string) => void;
}

const generateUniqueId = (prefix: string): string => {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
};

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
  // Self-generated unique session_id for this chat session
  const [sessionId] = useState<string>(() => 'sess_' + Math.random().toString(36).substring(2, 9));

  // Load chat logs on load or session change
  useEffect(() => {
    const hist = getChatHistory(activeUserId);
    if (hist.length === 0) {
      // Seed initial welcoming message from AI Assistant
      setLocalHistory([
        {
          id: 'welcome',
          sender: 'ai',
          message: `Hello ${user ? user.fullName : 'Guest'}! ✦ I am the Medora AI Assistant, your digital clinical wellness companion. I can guide symptom triages, explain lab values, summarize health reports, or assist in scheduling consultations. How can I help you today?`,
          createdAt: new Date().toISOString()
        }
      ]);
    } else {
      setLocalHistory(hist.map(h => ({
        id: h.id,
        sender: h.sender,
        message: h.message,
        createdAt: h.createdAt
      })));
    }
  }, [activeUserId, isOpen]);

  // Scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [localHistory, isTyping]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;
    
    setInput('');
    setErrorMsg('');
    
    // 1. Push user message to state
    const userMsgId = generateUniqueId('usr');
    const userMsg = {
      id: userMsgId,
      sender: 'user' as const,
      message: textToSend,
      createdAt: new Date().toISOString()
    };
    
    setLocalHistory(prev => [...prev, userMsg]);
    setIsTyping(true);
    
    // Save to Database / LocalStorage Context (attaches session_id and metadata)
    await saveChatMessage(activeUserId, textToSend, 'user', sessionId, { client: 'web-floating-chat' });
    
    // 2. Fetch AI response
    try {
      const response = await getChatbotResponse(
        textToSend,
        localHistory.map(h => ({ sender: h.sender, message: h.message })),
        knowledge
      );
      
      const aiMsgId = generateUniqueId('ai');
      const aiMsg = {
        id: aiMsgId,
        sender: 'ai' as const,
        message: response.message,
        createdAt: new Date().toISOString()
      };
      
      setLocalHistory(prev => [...prev, aiMsg]);
      
      // Save AI message to Database
      await saveChatMessage(activeUserId, response.message, 'ai', sessionId, { client: 'web-floating-chat-ai' });
      
      // If AI suggested an action, trigger it
      if (response.suggestedAction) {
        if (response.suggestedAction.type === 'link') {
          let targetTab = response.suggestedAction.value;
          if (['reports', 'reminders', 'chats'].includes(targetTab)) {
            targetTab = 'dashboard';
          }
          // Dynamic redirect to correct page/view
          onNavigate(targetTab);
        }
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Digital Assistant processing delay. Please retry.');
    } finally {
      setIsTyping(false);
    }
  };

  const handlePromptClick = (promptType: string) => {
    handleSendMessage(promptType);
  };

  const handleClearChat = () => {
    clearChatHistory(activeUserId);
    setLocalHistory([
      {
        id: 'welcome',
        sender: 'ai',
        message: "Chat history cleared. ✦ I am ready for new medical questions. How can I help you?",
        createdAt: new Date().toISOString()
      }
    ]);
  };

  // Six Quick Prompts
  const quickPrompts = [
    { label: 'Check Symptoms', action: 'Check my symptoms', icon: Stethoscope, color: 'border-purple-500/20 text-purple-300 hover:border-purple-500/50 bg-purple-500/5 hover:bg-purple-500/10' },
    { label: 'Explain Report', action: 'Explain my medical report', icon: ShieldAlert, color: 'border-cyan-500/20 text-cyan-300 hover:border-cyan-500/50 bg-cyan-500/5 hover:bg-cyan-500/10' },
    { label: 'Find a Doctor', action: 'Find a doctor', icon: User, color: 'border-fuchsia-500/20 text-fuchsia-300 hover:border-fuchsia-500/50 bg-fuchsia-500/5 hover:bg-fuchsia-500/10' },
    { label: 'Book Appointment', action: 'Book appointment', icon: Sparkles, color: 'border-indigo-500/20 text-indigo-300 hover:border-indigo-500/50 bg-indigo-500/5 hover:bg-indigo-500/10' },
    { label: 'Medicine Reminder', action: 'Medicine reminder', icon: RefreshCw, color: 'border-emerald-500/20 text-emerald-300 hover:border-emerald-500/50 bg-emerald-500/5 hover:bg-emerald-500/10' },
    { label: 'General Health Tips', action: 'General health tips', icon: Bot, color: 'border-slate-500/20 text-slate-300 hover:border-slate-500/50 bg-white/5 hover:bg-white/10' },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end">
      
      {/* 1. Chat Widget Window (Deep dark purple glassmorphism) */}
      {isOpen && (
        <div className="fixed inset-0 sm:inset-auto sm:mb-4 sm:bottom-24 sm:right-6 w-full h-full sm:w-[400px] sm:h-[600px] rounded-none sm:rounded-3xl glass-panel border-purple-500/30 shadow-[0_15px_40px_-5px_rgba(168,85,247,0.3)] flex flex-col overflow-hidden animate-[slideIn_0.3s_cubic-bezier(0.16,1,0.3,1)] bg-[#030014]/95">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-950/60 via-[#07051a]/95 to-indigo-950/40 p-4 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-400/20 shadow-[0_0_15px_rgba(168,85,247,0.35)] animate-pulse">
                <Bot className="w-5 h-5 text-purple-400" />
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider font-sans">Medora AI Assistant</h4>
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                </div>
                <span className="text-[9px] text-slate-400 font-mono font-semibold uppercase tracking-wider">Clinical Care System</span>
              </div>
            </div>
            
            <div className="flex items-center gap-1.5">
              <button 
                onClick={handleClearChat}
                title="Clear History"
                className="text-slate-400 hover:text-slate-200 p-1.5 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-slate-200 p-1.5 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Mandatory Clinical Disclaimer Banner */}
          <div className="bg-purple-950/10 border-b border-purple-500/10 p-3 flex items-start gap-2.5">
            <ShieldAlert className="w-4.5 h-4.5 text-purple-400 flex-shrink-0 mt-0.5 animate-pulse" />
            <p className="text-[10px] leading-normal text-slate-400 text-left font-mono font-medium">
              “This AI assistant provides general health information only and is not a substitute for professional medical advice, diagnosis, or treatment.”
            </p>
          </div>

          {/* Messages Body */}
          <div className="flex-grow overflow-y-auto p-4 flex flex-col gap-4 bg-slate-950/30">
            {localHistory.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 max-w-[85%] ${
                  msg.sender === 'user' ? 'self-end flex-row-reverse' : 'self-start'
                }`}
              >
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border shrink-0 ${
                  msg.sender === 'user'
                    ? 'bg-purple-600/10 border-purple-500/20'
                    : 'bg-purple-500/10 border-purple-400/20'
                }`}>
                  {msg.sender === 'user' ? (
                    <User className="w-4.5 h-4.5 text-purple-400" />
                  ) : (
                    <Bot className="w-4.5 h-4.5 text-purple-400" />
                  )}
                </div>
                
                {/* Chat Bubble */}
                <div className="text-left">
                  <div className={`rounded-2xl p-3 text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-purple-600 text-white shadow-md rounded-tr-none'
                      : 'glass-panel text-slate-200 rounded-tl-none border-white/5'
                  }`}>
                    {msg.message.split('\n').map((para, i) => (
                      <p key={i} className={i > 0 ? 'mt-1.5' : ''}>{para}</p>
                    ))}
                  </div>
                  <span className="text-[9px] text-slate-500 font-mono mt-1 block px-1">
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}

            {/* AI Typing indicator */}
            {isTyping && (
              <div className="flex gap-2.5 max-w-[80%] self-start text-left">
                <div className="w-8 h-8 rounded-full bg-purple-500/10 border border-purple-400/20 flex items-center justify-center shrink-0">
                  <Bot className="w-4.5 h-4.5 text-purple-400 animate-pulse" />
                </div>
                <div className="glass-panel rounded-2xl rounded-tl-none p-3 border-white/5 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}

            {errorMsg && (
              <p className="text-rose-400 text-[10px] font-mono text-center">✕ {errorMsg}</p>
            )}
            
            <div ref={chatEndRef} />
          </div>

          {/* Quick Prompts Panel Drawer (Exactly 6 options) */}
          <div className="p-3 bg-[#05041a] border-t border-white/5 grid grid-cols-2 gap-1.5">
            {quickPrompts.map((btn, index) => {
              const IconComp = btn.icon;
              return (
                <button
                  key={index}
                  onClick={() => handlePromptClick(btn.action)}
                  className={`text-[9px] font-bold font-mono py-2 px-2.5 rounded-xl border flex items-center gap-1.5 transition-all text-left uppercase tracking-wider cursor-pointer ${btn.color}`}
                >
                  <IconComp className="w-3 h-3 flex-shrink-0" />
                  <span className="truncate">{btn.label}</span>
                </button>
              );
            })}
          </div>

          {/* Chat Input form footer */}
          <form
            onSubmit={(e) => { e.preventDefault(); handleSendMessage(input); }}
            className="p-3 bg-[#080721]/95 border-t border-white/5 flex gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask wellness metrics, symptom checker..."
              className="flex-grow glass-panel rounded-xl px-4 py-3 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500/50"
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="p-3 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-medium transition-all shadow-lg flex items-center justify-center shrink-0 cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}

      {/* 2. Floating Circular bubble toggle (Purple Glow Ambient) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-gradient-to-tr from-purple-600 via-fuchsia-600 to-indigo-600 p-[1.5px] shadow-[0_0_25px_rgba(168,85,247,0.45)] hover:shadow-[0_0_35px_rgba(168,85,247,0.75)] hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center cursor-pointer"
      >
        <div className="w-full h-full bg-[#030014] rounded-full flex items-center justify-center text-purple-400 hover:text-white transition-colors">
          {isOpen ? <X className="w-5 h-5" /> : <MessageSquare className="w-5 h-5" />}
        </div>
      </button>

    </div>
  );
};
