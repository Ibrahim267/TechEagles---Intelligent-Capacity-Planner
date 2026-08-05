import React, { useState } from 'react';
import { useCapacity } from '../../context/CapacityContext';
import { queryAIAssistant, ChatMessage } from '../../services/aiAssistantService';
import { X, Sparkles, Send, Bot, User, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AIChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const PRESET_QUESTIONS = [
  "Which dark store has the highest risk of understaffing in Week 4?",
  "Why is FTC recommended over FTE for Al Quoz?",
  "How does courier leave impact Friday evening delivery capacity?",
  "What is the financial impact of shifting to a 60/40 FTE/FTC mix?",
  "How are lead times factored into the hiring recommendations?"
];

export const AIChatDrawer: React.FC<AIChatDrawerProps> = ({ isOpen, onClose }) => {
  const { simulatedDataset } = useCapacity();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: 'Hello! I am your **EMX QComm Capacity Intelligence Assistant**. I analyze 43,680 30-minute demand slots and 67 courier schedules across 10 dark stores.\n\nHow can I help optimize your dark store capacity today?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');

  if (!isOpen) return null;

  const handleSend = (textToSend?: string) => {
    const queryText = textToSend || input;
    if (!queryText.trim()) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: queryText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInput('');

    // Generate context-aware response
    setTimeout(() => {
      const responseText = queryAIAssistant(queryText, simulatedDataset);
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMsg]);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end bg-slate-950/60 backdrop-blur-xs">
      <div className="w-full max-w-md bg-slate-900 border-l border-slate-800 h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100">EMX AI Logistics Assistant</h3>
              <p className="text-[10px] text-slate-400">Context-Aware Operational Planning</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          
          {/* Preset Prompts */}
          <div className="space-y-2 pb-2 border-b border-slate-800/80">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Preset Operational Inquiries:
            </div>
            <div className="space-y-1.5">
              {PRESET_QUESTIONS.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(q)}
                  className="w-full text-left text-xs p-2 rounded-lg bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 text-slate-300 hover:text-cyan-300 transition-all flex items-center justify-between group"
                >
                  <span className="line-clamp-1">{q}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 transition-colors shrink-0 ml-2" />
                </button>
              ))}
            </div>
          </div>

          {/* Messages List */}
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-start space-x-2 max-w-[85%] ${msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                  msg.sender === 'user' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-indigo-600/20 text-cyan-400 border border-indigo-500/30'
                }`}>
                  {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                <div className={`rounded-xl p-3 text-xs leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-blue-600 text-white font-medium shadow-md'
                    : 'bg-slate-800/90 border border-slate-700 text-slate-200 shadow-md'
                }`}>
                  <div className="whitespace-pre-line">{msg.text}</div>
                  <div className={`text-[9px] mt-1.5 ${msg.sender === 'user' ? 'text-blue-200' : 'text-slate-500'}`}>
                    {msg.timestamp}
                  </div>
                </div>
              </div>
            </div>
          ))}

        </div>

        {/* Input Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/80">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center space-x-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about store gaps, FTE/FTC mix, lead times..."
              className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="p-2 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};
