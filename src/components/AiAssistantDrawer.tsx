import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  X, 
  Send, 
  Bot, 
  User, 
  Loader2, 
  HelpCircle,
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import { AuditResult } from '../types/seo';
import { askAssistant } from '../services/api';

interface AiAssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  audit: AuditResult | null;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export const AiAssistantDrawer: React.FC<AiAssistantDrawerProps> = ({
  isOpen,
  onClose,
  audit,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome',
      role: 'assistant',
      text: audit
        ? `Hello! I am your AuditPulse SEO Strategist. I have loaded the verified audit data for ${audit.url} (Score: ${audit.overallScore}/100 with ${audit.issues.length} detected findings). Ask me to explain any technical issue, suggest copy rewrites, or plan your next sprint.`
        : `Hello! I am ready to answer your technical SEO, Core Web Vitals, and content optimization questions. Start an audit to analyze a live domain with verified data!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    'What are my 3 most critical issues to fix first?',
    'How do I resolve the Largest Contentful Paint (LCP) bottleneck?',
    'Suggest internal links based on the audited page data.',
    'Explain how missing canonical tags harm my rankings.',
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  if (!isOpen) return null;

  const handleSend = async (question: string) => {
    if (!question.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      text: question.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const history = messages.slice(-6).map((m) => ({
        role: m.role,
        text: m.text,
      }));

      const auditId = audit?.id || 'demo-audit';
      const answer = await askAssistant(auditId, question.trim(), history);

      const aiMsg: ChatMessage = {
        id: `msg-ai-${Date.now()}`,
        role: 'assistant',
        text: answer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: `msg-err-${Date.now()}`,
        role: 'assistant',
        text: `Error analyzing with Gemini: ${err.message || 'Service unavailable'}. Please verify your GEMINI_API_KEY environment variable.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-slate-950 border-l border-slate-800 shadow-2xl flex flex-col select-none animate-in slide-in-from-right duration-300">
      {/* Drawer Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-xs text-white flex items-center gap-1.5">
              <span>AuditPulse SEO Advisor</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-indigo-500/20 text-indigo-300 font-mono">
                Gemini 3.8
              </span>
            </h3>
            <p className="text-[11px] text-slate-400 truncate max-w-[220px]">
              {audit ? audit.url : 'Ready for questions'}
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex items-start gap-2.5 ${
              m.role === 'user' ? 'flex-row-reverse' : 'flex-row'
            }`}
          >
            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-xs ${
                m.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/30'
              }`}
            >
              {m.role === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
            </div>

            <div
              className={`p-3 rounded-2xl max-w-[85%] text-xs leading-relaxed ${
                m.role === 'user'
                  ? 'bg-blue-600 text-white rounded-tr-none'
                  : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none whitespace-pre-wrap'
              }`}
            >
              {m.text}
              <div
                className={`text-[9px] mt-1 text-right ${
                  m.role === 'user' ? 'text-blue-200' : 'text-slate-500'
                }`}
              >
                {m.timestamp}
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-indigo-400 p-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Consulting audit context with Gemini 3.8 Flash...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts Suggestion Chips */}
      {messages.length <= 3 && (
        <div className="p-3 border-t border-slate-900 bg-slate-950/90 space-y-1.5">
          <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
            Quick Inquiries:
          </div>
          <div className="flex flex-wrap gap-1.5">
            {quickPrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(p)}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-850 text-slate-300 hover:text-white border border-slate-800 transition text-left"
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend(inputText);
        }}
        className="p-3 border-t border-slate-800 bg-slate-900 flex items-center gap-2"
      >
        <input
          type="text"
          placeholder="Ask a technical SEO or strategy question..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          disabled={isLoading}
          className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
        />
        <button
          type="submit"
          disabled={!inputText.trim() || isLoading}
          className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white transition shadow-sm"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
