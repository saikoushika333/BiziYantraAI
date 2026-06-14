
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
import { AnalysisResult } from '../types.ts';
import { X, Send, Bot, User, Sparkles, Loader2 } from 'lucide-react';

interface ChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentAnalysis: AnalysisResult | null;
}

interface Message {
  role: 'user' | 'model';
  text: string;
}

const ChatDrawer: React.FC<ChatDrawerProps> = ({ isOpen, onClose, currentAnalysis }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<any>(null);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const initialGreeting = currentAnalysis 
        ? `Hi! I've reviewed your analysis for **${currentAnalysis.locationOverview}**. It looks like a promising scenario with a **${currentAnalysis.prediction.successProb}%** success probability. How can I help you refine your strategy or answer any questions about the costs and risks?`
        : "Hello! I am your **AI Business Companion**. I can help you understand market data, find the best locations, and plan your startup budget. What's on your mind?";
      
      setMessages([{ role: 'model', text: initialGreeting }]);
    }
  }, [isOpen, currentAnalysis, messages.length]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      if (!chatRef.current) {
        const systemInstruction = `
          You are SMART BUZIBOT ANALYZER, a friendly and expert AI Business Strategist.
          Your mission is to help people turn their business dreams into reality using data and smart logic.
          
          Tone:
          - Conversational, supportive, and encouraging yet realistic.
          - Avoid overly complex jargon. If you use a technical term (like "Heuristic" or "OpEx"), explain it simply as "smart guessing" or "monthly bills".
          - Speak like a helpful mentor who knows a lot about data but values human grit and clarity.
          
          Context:
          ${currentAnalysis ? `Current analysis: ${currentAnalysis.locationOverview}. 
          Success Prob: ${currentAnalysis.prediction.successProb}%, 
          Risk Level: ${currentAnalysis.riskAnalysis.level}, 
          Key advice: ${currentAnalysis.finalRecommendation}` : 'The user is just starting their inquiry.'}
          
          Goals:
          - Provide clear, actionable advice in small, understandable chunks.
          - Break down complex financial or geospatial data into "plain English".
          - Always highlight at least one positive opportunity and one specific risk to watch out for.
          - Keep responses relatively concise but thorough enough to be useful.
        `;

        chatRef.current = ai.chats.create({
          model: 'gemini-3.5-flash',
          config: {
            systemInstruction,
          }
        });
      }

      const streamResponse = await chatRef.current.sendMessageStream({ message: userMsg });
      
      let fullText = "";
      setMessages(prev => [...prev, { role: 'model', text: "" }]);

      for await (const chunk of streamResponse) {
        const chunkText = chunk.text;
        fullText += chunkText;
        setMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1].text = fullText;
          return updated;
        });
      }

    } catch (err) {
      console.error("Chat error:", err);
      setMessages(prev => [...prev, { role: 'model', text: "I'm having a little trouble connecting to my database. Could you try asking that again in a moment?" }]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex justify-end animate-in fade-in duration-300">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      {/* Panel */}
      <div className="relative w-full max-w-lg bg-[#0b1426] border-l border-slate-800 shadow-2xl flex flex-col animate-in slide-in-from-right duration-500">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-[#020617]/50 backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 shadow-lg shadow-teal-500/20">
              <Bot className="text-white" size={24} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">AI Strategy Chat</h2>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Expert Mentor Active</span>
              </div>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Messages */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth custom-scrollbar"
        >
          {messages.map((msg, idx) => (
            <div 
              key={idx} 
              className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''} animate-in fade-in slide-in-from-bottom-2 duration-300`}
            >
              <div className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center border ${msg.role === 'model' ? 'bg-teal-500/10 border-teal-500/30 text-teal-400' : 'bg-blue-500/10 border-blue-500/30 text-blue-400'}`}>
                {msg.role === 'model' ? <Sparkles size={18} /> : <User size={18} />}
              </div>
              <div className={`max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed ${msg.role === 'model' ? 'bg-slate-900 border border-slate-800 text-slate-200' : 'bg-teal-500 text-slate-950 font-bold'}`}>
                <div className="whitespace-pre-wrap break-words prose prose-invert prose-sm">
                  {msg.text || (loading && msg.role === 'model' && <Loader2 className="animate-spin text-teal-400" size={16} />)}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="p-6 bg-[#020617]/50 border-t border-slate-800">
          <div className="relative group">
            <input 
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask me about your plan..."
              className="w-full bg-[#16213e] border border-slate-800 rounded-xl py-4 pl-5 pr-14 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/20 text-slate-200 transition-all font-medium placeholder:text-slate-600"
            />
            <button 
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-teal-500 hover:bg-teal-400 disabled:bg-slate-700 text-slate-950 rounded-lg transition-all shadow-lg active:scale-90"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
            </button>
          </div>
          <p className="mt-4 text-[9px] text-center text-slate-500 font-bold uppercase tracking-[0.2em]">
            Empowering your decisions with AI logic
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatDrawer;
