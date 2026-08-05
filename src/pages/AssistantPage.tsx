import React, { useState } from 'react';
import { useCapacity } from '../context/CapacityContext';
import { queryAIAssistant, ChatMessage } from '../services/aiAssistantService';
import { 
  Bot, 
  Sparkles, 
  Send, 
  User, 
  ArrowRight, 
  MessageSquare,
  HelpCircle,
  Brain
} from 'lucide-react';

const PRESET_QUESTIONS = [
  "Which dark store has the highest risk of understaffing in Week 4?",
  "Why is FTC recommended over FTE for Al Quoz?",
  "How does courier leave impact Friday evening delivery capacity?",
  "What is the financial impact of shifting to a 60/40 FTE/FTC mix?",
  "How are lead times factored into the hiring recommendations?"
];

export const AssistantPage: React.FC = () => {
  const { simulatedDataset } = useCapacity();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-page',
      sender: 'assistant',
      text: 'Welcome to the **EMX AI Logistics Assistant** full-page workspace. I am directly integrated with your 13-week 30-minute interval dataset.\n\nAsk any question about store staffing gaps, lead-time hiring triggers, or shift reallocations!',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');

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
    <div className="max-w-4xl mx-auto space-y-6 py-4 min-h-[85vh] flex flex-col justify-between">
      
      {/* Header */}
      <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 shadow-xl flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 p-0.5 shadow-lg shadow-blue-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Brain className="w-6 h-6 text-cyan-400" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-white">AI Logistics Assistant Workspace</h1>
            <p className="text-xs text-slate-400">Context-Aware Operational Planning & Strategic QComm Intelligence</p>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full bg-blue-500/10 text-cyan-400 border border-blue-500/20 text-xs font-semibold">
          Active Dataset Context (43,680 Slots)
        </span>
      </div>

      {/* Preset Buttons Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {PRESET_QUESTIONS.slice(0, 3).map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(q)}
            className="p-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-left text-xs text-slate-300 hover:text-cyan-300 transition-all flex items-center justify-between group"
          >
            <span className="line-clamp-2">{q}</span>
            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 shrink-0 ml-2" />
          </button>
        ))}
      </div>

      {/* Messages Stream */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 flex-1 overflow-y-auto space-y-4 max-h-[500px] shadow-2xl">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex items-start space-x-3 max-w-[85%] ${msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                msg.sender === 'user' 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'bg-indigo-600/20 text-cyan-400 border border-indigo-500/30'
              }`}>
                {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div className={`rounded-2xl p-4 text-xs leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-blue-600 text-white font-medium shadow-md'
                  : 'bg-slate-950/80 border border-slate-800 text-slate-200 shadow-md'
              }`}>
                <div className="whitespace-pre-line">{msg.text}</div>
                <div className={`text-[9px] mt-2 ${msg.sender === 'user' ? 'text-blue-200' : 'text-slate-500'}`}>
                  {msg.timestamp}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Input Form */}
      <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 shadow-xl">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center space-x-3"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your operational capacity inquiry..."
            className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 text-white font-bold text-xs shadow-lg shadow-blue-500/25 transition-all flex items-center space-x-2"
          >
            <span>Ask Assistant</span>
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

    </div>
  );
};
