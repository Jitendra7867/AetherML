import { useState } from 'react';
import { Menu, X, CheckCircle2, Compass, Library, BookOpen, GraduationCap } from 'lucide-react';
import { modules, curriculumData } from '../data/curriculumData';

interface LayoutProps {
  activePage: 'dashboard' | 'topic' | 'library';
  activeTopicId: string | null;
  completedTopics: string[];
  onNavigate: (page: 'dashboard' | 'topic' | 'library', id?: string) => void;
  children: React.ReactNode;
}

export default function Layout({ activePage, activeTopicId, completedTopics, onNavigate, children }: LayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Group topics by their modules
  const topicsByModule = modules.reduce((acc, m) => {
    acc[m] = curriculumData.filter(t => t.module === m);
    return acc;
  }, {} as Record<string, typeof curriculumData>);

  const percentComplete = Math.round((completedTopics.length / curriculumData.length) * 100);

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans">
      {/* Top Header Navbar */}
      <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-md border-b border-slate-100 px-4 lg:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          
          <div
            onClick={() => onNavigate('dashboard')}
            className="flex items-center gap-2.5 cursor-pointer"
          >
            <GraduationCap className="text-indigo-600 w-7 h-7" />
            <span className="font-display font-bold text-lg text-slate-850 tracking-tight">
              Aether<span className="text-indigo-600">ML</span>
            </span>
          </div>
        </div>

        {/* Navigation Actions */}
        <div className="flex items-center gap-4">
          <nav className="flex items-center gap-1.5">
            <button
              onClick={() => onNavigate('dashboard')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activePage === 'dashboard'
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-850'
              }`}
            >
              <Compass size={14} />
              Roadmap
            </button>
            
            <button
              onClick={() => onNavigate('library')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activePage === 'library'
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-850'
              }`}
            >
              <Library size={14} />
              Library Hub
            </button>
          </nav>

          <span className="w-px h-5 bg-slate-200 hidden sm:block"></span>

          {/* Progress gauge */}
          <div className="hidden sm:flex items-center gap-2">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Progress:</span>
            <div className="w-24 bg-slate-100 rounded-full h-1.5 overflow-hidden border border-slate-200/50">
              <div
                className="bg-indigo-600 h-1.5 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${percentComplete}%` }}
              ></div>
            </div>
            <span className="text-xs font-semibold text-slate-700 font-mono">{percentComplete}%</span>
          </div>
        </div>
      </header>

      <div className="flex flex-1 relative">
        {/* Left Sidebar Curriculum Navigation */}
        <aside
          className={`fixed inset-y-16 left-0 z-30 w-64 bg-white border-r border-slate-100 flex flex-col transition-all duration-300 transform ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          {/* Scrollable Curriculum Tree */}
          <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6 select-none">
            {modules.map((m) => (
              <div key={m} className="space-y-2">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2.5">
                  {m}
                </h4>
                
                <div className="space-y-0.5">
                  {topicsByModule[m].map((t) => {
                    const isActive = activeTopicId === t.id && activePage === 'topic';
                    const isCompleted = completedTopics.includes(t.id);
                    return (
                      <button
                        key={t.id}
                        onClick={() => onNavigate('topic', t.id)}
                        className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium text-left transition-all ${
                          isActive
                            ? 'bg-indigo-50/70 text-indigo-700 font-semibold'
                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                        }`}
                      >
                        <span className="truncate flex items-center gap-2">
                          <BookOpen size={12} className={isActive ? 'text-indigo-600' : 'text-slate-450'} />
                          {t.title}
                        </span>
                        {isCompleted && (
                          <CheckCircle2 size={13} className="text-emerald-500 shrink-0 ml-1.5" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Footer inside sidebar */}
          <div className="p-4 border-t border-slate-50 bg-slate-50/40 text-[10px] text-slate-400 font-mono text-center flex items-center justify-center gap-1">
            <span>AetherML Platform v1.0.0</span>
          </div>
        </aside>

        {/* Main Content Area */}
        <main
          className={`flex-1 transition-all duration-300 min-h-[calc(100vh-64px)] flex flex-col ${
            isSidebarOpen ? 'pl-0 lg:pl-64' : 'pl-0'
          }`}
        >
          <div className="flex-1 px-4 py-8 md:px-8 max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
