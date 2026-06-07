import { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, Sparkles, Loader2, BookOpen, Settings, Key, Check } from 'lucide-react';
import { askGemini } from '../services/gemini';
import type { Message } from '../services/gemini';

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [customApiKey, setCustomApiKey] = useState(() => localStorage.getItem('aether_custom_gemini_key') || '');
  const [isSavedAlert, setIsSavedAlert] = useState(false);

  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      text: "Hello! I am your AetherML AI Tutor. I can help you with anything related to Machine Learning, statistics, and this platform. Ask me any ML questions!"
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (!showSettings) {
      scrollToBottom();
    }
  }, [messages, isLoading, showSettings]);

  const handleSend = async (textToSend = input) => {
    if (!textToSend.trim()) return;
    
    const userMessage: Message = { role: 'user', text: textToSend };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await askGemini(messages, textToSend);
      setMessages(prev => [...prev, { role: 'model', text: response }]);
    } catch (err: any) {
      console.error(err);
      setMessages(prev => [
        ...prev,
        { 
          role: 'model', 
          text: `Error: ${err.message || "Something went wrong."}\n\nPlease verify your API key is correctly configured. You can click the settings icon in the top right to configure your Gemini API Key.` 
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSend(suggestion);
  };

  const handleSaveSettings = () => {
    if (customApiKey.trim()) {
      localStorage.setItem('aether_custom_gemini_key', customApiKey.trim());
    } else {
      localStorage.removeItem('aether_custom_gemini_key');
    }
    setIsSavedAlert(true);
    setTimeout(() => {
      setIsSavedAlert(false);
      setShowSettings(false);
    }, 1000);
  };

  // Simple Markdown and Code Parser
  const formatMessageText = (text: string) => {
    const parts = text.split(/(```[\s\S]*?```|\*\*.*?\*\*)/g);
    return parts.map((part, idx) => {
      if (part.startsWith('```') && part.endsWith('```')) {
        const code = part.slice(3, -3).trim();
        const firstLineBreak = code.indexOf('\n');
        const language = firstLineBreak !== -1 ? code.slice(0, firstLineBreak) : '';
        const actualCode = firstLineBreak !== -1 ? code.slice(firstLineBreak + 1) : code;
        
        return (
          <pre key={idx} className="bg-slate-900 text-slate-100 p-3 rounded-lg my-2 overflow-x-auto font-mono text-[11px] leading-relaxed select-text">
            {language && (
              <div className="text-[9px] text-slate-500 uppercase font-bold border-b border-slate-800 pb-1 mb-1">
                {language}
              </div>
            )}
            <code>{actualCode}</code>
          </pre>
        );
      }
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={idx} className="font-bold text-slate-850">{part.slice(2, -2)}</strong>;
      }
      return <span key={idx} className="whitespace-pre-line">{part}</span>;
    });
  };

  const suggestions = [
    "What is Gradient Descent?",
    "Explain Decision Tree Splits",
    "How does the K-Means visualizer work?",
    "Give me an example of an SVM kernel"
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* Chat Bubble Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="relative group p-4 rounded-full bg-gradient-to-tr from-indigo-650 to-violet-600 hover:from-indigo-600 hover:to-violet-550 text-white shadow-premium transition-all duration-300 hover:scale-110 flex items-center justify-center animate-bounce-subtle"
          title="Ask AetherML AI"
        >
          <span className="absolute -inset-0.5 rounded-full bg-indigo-500/30 animate-ping opacity-75"></span>
          <Bot size={22} className="relative z-10" />
          <span className="absolute right-14 bg-slate-900 text-white text-[10px] px-2.5 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap font-medium font-mono">
            ML Assistant
          </span>
        </button>
      )}

      {/* Floating Chat Interface */}
      {isOpen && (
        <div className="w-[360px] sm:w-[380px] h-[520px] bg-white border border-slate-150 rounded-2xl shadow-premium-lg flex flex-col overflow-hidden animate-fade-in">
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 px-4 py-3.5 flex items-center justify-between text-white border-b border-slate-880">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-indigo-400">
                <Sparkles size={16} className="animate-pulse" />
              </div>
              <div>
                <h3 className="text-xs font-bold font-display tracking-wide uppercase">AetherML Tutor</h3>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  <span className="text-[9px] font-mono text-slate-400">Gemini 2.5 Flash</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-1">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className={`p-1.5 rounded-md transition-colors ${
                  showSettings ? 'bg-indigo-600/30 text-indigo-400' : 'hover:bg-slate-800 text-slate-400 hover:text-white'
                }`}
                title="API Settings"
              >
                <Settings size={15} />
              </button>
              <button
                onClick={() => {
                  setIsOpen(false);
                  setShowSettings(false);
                }}
                className="p-1.5 rounded-md hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              >
                <X size={15} />
              </button>
            </div>
          </div>

          {/* Settings Panel vs Message Window */}
          {showSettings ? (
            <div className="flex-1 p-5 space-y-4 bg-slate-50/50 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-slate-800 font-semibold text-xs">
                  <Key size={14} className="text-indigo-650" />
                  <span>Gemini API Settings</span>
                </div>
                
                <p className="text-[11px] text-slate-500 leading-normal">
                  Configure your Google Gemini API key below. This key is saved locally in your browser's storage and never sent to our servers.
                </p>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                    API Key
                  </label>
                  <input
                    type="password"
                    value={customApiKey}
                    onChange={(e) => setCustomApiKey(e.target.value)}
                    placeholder="Enter gemini api key..."
                    className="w-full bg-white border border-slate-200 hover:border-slate-300 focus:border-indigo-450 rounded-xl px-3 py-2 text-xs outline-none transition-colors"
                  />
                  <span className="text-[9px] text-slate-400 leading-normal block">
                    If empty, falls back to the backend environment configurations.
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setShowSettings(false)}
                  className="flex-1 py-2 bg-white hover:bg-slate-100 text-slate-650 font-semibold border border-slate-200 rounded-xl text-xs transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveSettings}
                  className="flex-1 py-2 bg-indigo-650 hover:bg-indigo-700 text-white font-semibold rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  {isSavedAlert ? (
                    <>
                      <Check size={13} />
                      Saved!
                    </>
                  ) : (
                    'Save Settings'
                  )}
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Chat Logs Window */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {msg.role === 'model' && (
                      <div className="w-6 h-6 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center shrink-0 mt-0.5 text-[10px]">
                        <Bot size={13} />
                      </div>
                    )}
                    
                    <div
                      className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                        msg.role === 'user'
                          ? 'bg-indigo-600 text-white rounded-tr-none'
                          : 'bg-white border border-slate-105 text-slate-700 shadow-sm rounded-tl-none'
                      }`}
                    >
                      {msg.role === 'user' ? (
                        <div className="whitespace-pre-wrap select-text">{msg.text}</div>
                      ) : (
                        <div className="space-y-1 select-text">{formatMessageText(msg.text)}</div>
                      )}
                    </div>
                  </div>
                ))}

                {/* Loading / Typing indicator */}
                {isLoading && (
                  <div className="flex gap-2.5 justify-start">
                    <div className="w-6 h-6 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
                      <Loader2 size={13} className="animate-spin" />
                    </div>
                    <div className="bg-white border border-slate-100 text-slate-400 px-3.5 py-2.5 rounded-2xl rounded-tl-none text-xs flex items-center gap-1 shadow-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-300 animate-bounce"></span>
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-350 animate-bounce delay-100"></span>
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce delay-200"></span>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Quick Suggestion Chips */}
              {messages.length === 1 && !isLoading && (
                <div className="px-4 py-2 border-t border-slate-100/50 bg-slate-50/20 space-y-1.5">
                  <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1">
                    <BookOpen size={10} />
                    <span>Suggested Questions:</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {suggestions.map((sug, i) => (
                      <button
                        key={i}
                        onClick={() => handleSuggestionClick(sug)}
                        className="text-[10px] text-indigo-650 hover:text-indigo-700 bg-indigo-50/50 hover:bg-indigo-50 border border-indigo-100/50 rounded-lg px-2.5 py-1 text-left transition-colors"
                      >
                        {sug}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input Bar Form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="p-3 bg-white border-t border-slate-150 flex gap-2 items-center"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask anything about Machine Learning..."
                  disabled={isLoading}
                  className="flex-1 bg-slate-50 border border-slate-150 hover:border-slate-200 focus:border-indigo-400 rounded-xl px-3 py-2 text-xs outline-none transition-colors text-slate-800 disabled:opacity-50 placeholder:text-slate-400"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="p-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-100 disabled:text-slate-400 text-white rounded-xl transition-all flex items-center justify-center cursor-pointer disabled:cursor-not-allowed shadow-sm shrink-0"
                >
                  <Send size={14} />
                </button>
              </form>
            </>
          )}
        </div>
      )}
    </div>
  );
}
