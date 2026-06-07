import { useState, useEffect, useRef } from 'react';
import type { KeyboardEvent } from 'react';
import { Play, RotateCcw, Copy, Check, Terminal, Cpu } from 'lucide-react';
import { usePyodide } from '../hooks/usePyodide';
import type { PyodideResult } from '../hooks/usePyodide';

interface CodePlaygroundProps {
  initialCode: string;
  exerciseTask: string;
  packagesToLoad: string[];
}

export default function CodePlayground({ initialCode, exerciseTask, packagesToLoad }: CodePlaygroundProps) {
  const [code, setCode] = useState<string>(initialCode);
  const { status, runCode } = usePyodide();
  const [terminalOutput, setTerminalOutput] = useState<{ text: string; type: 'stdout' | 'stderr' | 'system' }[]>([]);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Sync initial code when topic changes
  useEffect(() => {
    setCode(initialCode);
    setTerminalOutput([
      { text: 'Python environment initialized. Ready to execute code.', type: 'system' }
    ]);
  }, [initialCode]);

  // Handle tab indent key interceptor
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = e.currentTarget;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const val = textarea.value;

      const newValue = val.substring(0, start) + '    ' + val.substring(end);
      setCode(newValue);

      // Reset cursor position
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 4;
        }
      }, 0);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const executeCode = async () => {
    setIsRunning(true);
    setTerminalOutput(prev => [...prev, { text: '>>> Running script...', type: 'system' }]);

    // Small delay to let loading state render
    await new Promise(resolve => setTimeout(resolve, 50));

    const res: PyodideResult = await runCode(code, packagesToLoad);

    const outputs: typeof terminalOutput = [];
    if (res.success) {
      if (res.stdout) {
        outputs.push({ text: res.stdout, type: 'stdout' });
      }
      if (res.result !== undefined && res.result !== null) {
        outputs.push({ text: `Result: ${String(res.result)}`, type: 'system' });
      }
      if (!res.stdout && (res.result === undefined || res.result === null)) {
        outputs.push({ text: 'Script finished successfully with no output.', type: 'system' });
      }
    } else {
      outputs.push({ text: res.stderr, type: 'stderr' });
    }

    setTerminalOutput(prev => [...prev, ...outputs]);
    setIsRunning(false);
  };

  // Generate line numbers column
  const lineCount = code.split('\n').length;
  const lineNumbers = Array.from({ length: Math.max(1, lineCount) }, (_, i) => i + 1);

  return (
    <div className="flex flex-col h-full bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-premium">
      {/* Playground Header */}
      <div className="bg-slate-950 border-b border-slate-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Cpu size={16} className="text-indigo-400" />
          <span className="text-xs font-semibold text-slate-300 font-display">Interactive Code Sandbox</span>
        </div>
        
        {/* Environment Loading indicator */}
        <div className="flex items-center gap-2">
          {status === 'loading' && (
            <span className="text-[10px] text-amber-400 flex items-center gap-1.5 animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
              WASM Engine Loading / Installing dependencies...
            </span>
          )}
          {status === 'ready' && (
            <span className="text-[10px] text-emerald-400 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              Pyodide Environment Active
            </span>
          )}
          {status === 'error' && (
            <span className="text-[10px] text-rose-400 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
              Engine initialization error
            </span>
          )}
        </div>
      </div>

      {/* Task Instruction Banner */}
      <div className="bg-slate-950/65 border-b border-slate-800 px-5 py-3 text-xs text-slate-300 leading-relaxed font-sans flex items-start gap-2.5">
        <span className="text-indigo-400 font-semibold uppercase tracking-wider shrink-0 text-[10px] bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">Task</span>
        <p>{exerciseTask}</p>
      </div>

      {/* Code Editor Panel */}
      <div className="relative flex flex-1 overflow-hidden min-h-[200px]">
        {/* Line numbers bar */}
        <div className="bg-slate-950/40 text-right pr-3 pl-4 py-4 select-none border-r border-slate-800/50 font-mono text-xs text-slate-600 space-y-1">
          {lineNumbers.map((n) => (
            <div key={n} style={{ height: '20px', lineHeight: '20px' }}>{n}</div>
          ))}
        </div>

        {/* Textarea Codebox */}
        <textarea
          ref={textareaRef}
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onKeyDown={handleKeyDown}
          spellCheck={false}
          autoComplete="off"
          className="flex-1 w-full bg-transparent text-slate-200 outline-none resize-none font-mono text-xs p-4 focus:ring-0 leading-[20px] whitespace-pre overflow-x-auto"
          style={{ tabSize: 4 }}
        />

        {/* Floating action buttons inside editor */}
        <div className="absolute top-4 right-4 flex gap-1.5">
          <button
            onClick={handleCopy}
            className="p-1.5 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-slate-200 border border-slate-700/50 transition-colors"
            title="Copy Code"
          >
            {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
          </button>
          <button
            onClick={() => setCode(initialCode)}
            className="p-1.5 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-slate-200 border border-slate-700/50 transition-colors"
            title="Reset code"
          >
            <RotateCcw size={13} />
          </button>
        </div>
      </div>

      {/* Code Run Bar */}
      <div className="bg-slate-950 border-t border-slate-800 px-4 py-3 flex justify-between items-center">
        <div className="text-[10px] text-slate-500 font-mono">
          Required: {packagesToLoad.length > 0 ? packagesToLoad.join(', ') : 'none'}
        </div>
        <button
          onClick={executeCode}
          disabled={isRunning || status === 'loading'}
          className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition-all duration-150 ${
            isRunning || status === 'loading'
              ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700 text-white border-transparent'
          }`}
        >
          <Play size={13} fill="currentColor" />
          {isRunning ? 'Running...' : 'Run Code'}
        </button>
      </div>

      {/* Terminal Output Logs */}
      <div className="border-t border-slate-800 bg-slate-950/95 flex-1 min-h-[140px] max-h-[220px] overflow-y-auto flex flex-col">
        <div className="border-b border-slate-800 px-4 py-1.5 bg-slate-950 flex items-center justify-between text-[10px] font-mono text-slate-500 select-none">
          <span className="flex items-center gap-1.5">
            <Terminal size={11} />
            Console Output
          </span>
          <button
            onClick={() => setTerminalOutput([])}
            className="hover:text-slate-300 transition-colors"
          >
            Clear Console
          </button>
        </div>
        <div className="p-4 font-mono text-xs flex-1 space-y-1.5 overflow-x-auto leading-relaxed selection:bg-indigo-500/20 select-text">
          {terminalOutput.map((log, idx) => (
            <div
              key={idx}
              className={`whitespace-pre-wrap ${
                log.type === 'stdout' ? 'text-slate-300' :
                log.type === 'stderr' ? 'text-rose-400 font-medium' :
                'text-indigo-400 font-medium'
              }`}
            >
              {log.text}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
