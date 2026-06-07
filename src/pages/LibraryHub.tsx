import { useState } from 'react';
import { BookOpen, Copy, Check, Sparkles } from 'lucide-react';
import { libraryData } from '../data/libraryData';
import CodePlayground from '../components/CodePlayground';

export default function LibraryHub() {
  const [activeLibId, setActiveLibId] = useState<string>('numpy');
  const [copyStates, setCopyStates] = useState<Record<string, boolean>>({});

  const activeLib = libraryData.find(lib => lib.id === activeLibId) || libraryData[0];

  const handleCopyCode = (code: string, idx: number) => {
    navigator.clipboard.writeText(code);
    setCopyStates(prev => ({ ...prev, [idx]: true }));
    setTimeout(() => {
      setCopyStates(prev => ({ ...prev, [idx]: false }));
    }, 2000);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Premium Hub Header */}
      <div className="border-b border-slate-100 pb-6">
        <div className="flex items-center gap-2 text-xs text-indigo-600 font-semibold uppercase tracking-wider mb-2">
          <Sparkles size={13} />
          <span>Cheat Sheets & Sandboxes</span>
        </div>
        <h1 className="text-3xl font-bold font-display text-slate-900 tracking-tight">
          Python ML Library Hub
        </h1>
        <p className="text-slate-500 text-sm mt-1 max-w-xl">
          Quick-reference API cheat sheets and interactive code examples for standard scientific tools.
        </p>
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Library Selector Tabs */}
        <div className="lg:col-span-3 space-y-2 lg:sticky lg:top-24">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2">
            Select Library
          </span>
          <div className="space-y-1">
            {libraryData.map((lib) => (
              <button
                key={lib.id}
                onClick={() => setActiveLibId(lib.id)}
                className={`w-full text-left px-3.5 py-3 rounded-xl text-xs font-semibold flex items-center justify-between border transition-all ${
                  activeLibId === lib.id
                    ? 'bg-indigo-50 text-indigo-700 border-indigo-150 shadow-sm'
                    : 'bg-white hover:bg-slate-50 text-slate-600 border-slate-100'
                }`}
              >
                <span>{lib.name}</span>
                <BookOpen size={13} className={activeLibId === lib.id ? 'text-indigo-650' : 'text-slate-400'} />
              </button>
            ))}
          </div>
        </div>

        {/* Middle Column: Cheat Sheets */}
        <div className="lg:col-span-5 space-y-6">
          {/* Library Info Card */}
          <div className="bg-white border border-slate-100 shadow-premium p-6 rounded-2xl space-y-3">
            <h2 className="text-xl font-bold font-display text-slate-805">{activeLib.name} Reference</h2>
            <p className="text-xs text-indigo-600 font-medium font-display italic leading-relaxed">
              "{activeLib.tagline}"
            </p>
            <p className="text-slate-500 text-xs leading-relaxed">
              {activeLib.description}
            </p>
          </div>

          {/* Quick-copy Code Cards List */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-1">
              Core API Commands
            </h3>

            <div className="space-y-2">
              {activeLib.cheatSheet.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white hover:bg-slate-50/50 border border-slate-100 hover:border-slate-200 shadow-sm rounded-xl p-3.5 flex items-center justify-between gap-4 transition-all"
                >
                  <div className="space-y-1 min-w-0">
                    <code className="text-xs font-mono font-semibold text-indigo-600 block truncate bg-slate-50 py-0.5 px-1.5 rounded w-max max-w-full">
                      {item.code}
                    </code>
                    <span className="text-[11px] text-slate-500 block leading-tight">
                      {item.description}
                    </span>
                  </div>

                  <button
                    onClick={() => handleCopyCode(item.code, idx)}
                    className="p-1.5 rounded-lg border border-slate-100 bg-white hover:bg-slate-50 text-slate-400 hover:text-slate-700 shadow-sm transition-colors shrink-0"
                    title="Copy Code"
                  >
                    {copyStates[idx] ? (
                      <Check size={12} className="text-emerald-500" />
                    ) : (
                      <Copy size={12} />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Code Playground */}
        <div className="lg:col-span-4 lg:sticky lg:top-24">
          <CodePlayground
            key={activeLib.id}
            initialCode={activeLib.playgroundCode}
            exerciseTask={activeLib.exercise}
            packagesToLoad={activeLib.packages}
          />
        </div>
      </div>
    </div>
  );
}
