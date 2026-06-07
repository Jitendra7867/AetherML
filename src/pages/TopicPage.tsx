import { useState, useEffect } from 'react';
import { ChevronRight, CheckCircle2, ChevronLeft, BarChart3, Code } from 'lucide-react';
import { curriculumData } from '../data/curriculumData';
import TableOfContents from '../components/TableOfContents';
import CodePlayground from '../components/CodePlayground';

import GradientDescentVisualizer from '../components/visualizers/GradientDescentVisualizer';
import KMeansVisualizer from '../components/visualizers/KMeansVisualizer';
import DecisionTreeVisualizer from '../components/visualizers/DecisionTreeVisualizer';

interface TopicPageProps {
  topicId: string;
  completedTopics: string[];
  onToggleComplete: (id: string) => void;
  onNavigate: (page: 'dashboard' | 'topic' | 'library', id?: string) => void;
}

export default function TopicPage({ topicId, completedTopics, onToggleComplete, onNavigate }: TopicPageProps) {
  const topic = curriculumData.find(t => t.id === topicId);
  const [activeTab, setActiveTab] = useState<'visualizer' | 'code'>('visualizer');

  // Find next/prev topics in the curriculum for bottom navigation
  const currentIndex = curriculumData.findIndex(t => t.id === topicId);
  const prevTopic = currentIndex > 0 ? curriculumData[currentIndex - 1] : null;
  const nextTopic = currentIndex < curriculumData.length - 1 ? curriculumData[currentIndex + 1] : null;

  useEffect(() => {
    // If a topic has no visualizer, default tab to code
    if (topic && !topic.visualizer) {
      setActiveTab('code');
    } else {
      setActiveTab('visualizer');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [topicId, topic?.visualizer]);

  if (!topic) {
    return (
      <div className="text-center py-16">
        <p className="text-slate-500">Topic not found.</p>
        <button onClick={() => onNavigate('dashboard')} className="mt-4 text-indigo-650 font-semibold text-sm">
          Go back to dashboard
        </button>
      </div>
    );
  }

  const isCompleted = completedTopics.includes(topic.id);

  // Render mathematical formulas in readable text/symbol formatting
  const formatMath = (latex: string) => {
    // Basic substitution to render common math symbols in HTML beautifully
    return latex
      .replace(/\\begin{pmatrix}/g, '(')
      .replace(/\\end{pmatrix}/g, ')')
      .replace(/\\\\/g, '\n')
      .replace(/&/g, ' ')
      .replace(/\\dots/g, '...')
      .replace(/\\vdots/g, '⋮')
      .replace(/\\ddots/g, '⋱')
      .replace(/\\sum_{([a-zA-Z0-9=]+)}^{([a-zA-Z0-9]+)}/g, 'Σ ($1 to $2)')
      .replace(/\\sum_{([a-zA-Z0-9]+)}/g, 'Σ_($1)')
      .replace(/\\nabla J\(w\^{\(t\)}\)/g, '∇J(w(t))')
      .replace(/\\alpha/g, 'α')
      .replace(/\\gamma/g, 'γ')
      .replace(/\\theta/g, 'θ')
      .replace(/\\text{Distance}/g, 'Distance')
      .replace(/\\leftarrow/g, '←')
      .replace(/\\left\[/g, '[')
      .replace(/\\right\]/g, ']')
      .replace(/\\max_{([a-zA-Z']+)}/g, 'max_($1)')
      .replace(/\\partial/g, '∂')
      .replace(/\\frac{([^}]+)}{([^}]+)}/g, '($1)/($2)')
      .replace(/\\log_2/g, 'log₂')
      .replace(/\\cdot/g, '·')
      .replace(/\\sigma/g, 'σ')
      .replace(/\\hat{y}/g, 'ŷ')
      .replace(/w\^{\(t\+1\)}/g, 'w(t+1)')
      .replace(/w\^{\(t\)}/g, 'w(t)')
      .replace(/a\^{\[l-1\]}/g, 'a[l-1]')
      .replace(/a\^{\[l\]}/g, 'a[l]')
      .replace(/z\^{\[l\]}/g, 'z[l]')
      .replace(/\\lim_{([^}]+)}/g, 'lim ($1)');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Left Column: Theory Explanation */}
      <div className="lg:col-span-6 space-y-6">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
          <button onClick={() => onNavigate('dashboard')} className="hover:text-indigo-600 transition-colors">
            Curriculum
          </button>
          <ChevronRight size={12} />
          <span className="text-slate-500 font-mono text-[10px]">{topic.module}</span>
        </div>

        <div className="flex items-center justify-between border-b border-slate-100 pb-5">
          <h1 className="text-3xl font-bold font-display text-slate-900 tracking-tight">
            {topic.title}
          </h1>

          <button
            onClick={() => onToggleComplete(topic.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              isCompleted
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <CheckCircle2 size={14} className={isCompleted ? 'text-emerald-605' : 'text-slate-400'} />
            {isCompleted ? 'Completed' : 'Mark Complete'}
          </button>
        </div>

        {/* Dynamic Theory Renderer */}
        <article className="theory-content prose prose-slate max-w-none text-slate-500 text-sm leading-relaxed space-y-5">
          {topic.theory.map((sect, idx) => {
            if (sect.type === 'header') {
              const headerId = typeof sect.content === 'string'
                ? sect.content.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
                : '';
              return (
                <h2
                  key={idx}
                  id={headerId}
                  className="text-lg font-bold font-display text-slate-800 pt-3 border-b border-slate-50 pb-1 scroll-mt-20"
                >
                  {sect.content}
                </h2>
              );
            }
            if (sect.type === 'paragraph') {
              return <p key={idx}>{sect.content}</p>;
            }
            if (sect.type === 'math') {
              return (
                <div key={idx} className="math-block font-mono leading-normal whitespace-pre-wrap">
                  {formatMath(sect.content as string)}
                </div>
              );
            }
            if (sect.type === 'list' && Array.isArray(sect.content)) {
              return (
                <ul key={idx} className="list-disc list-inside space-y-1.5 pl-2">
                  {sect.content.map((item, itemIdx) => (
                    <li key={itemIdx}>{item}</li>
                  ))}
                </ul>
              );
            }
            return null;
          })}
        </article>

        {/* Bottom Course Progression Buttons */}
        <div className="pt-8 border-t border-slate-100 flex items-center justify-between gap-4">
          {prevTopic ? (
            <button
              onClick={() => onNavigate('topic', prevTopic.id)}
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-805 transition-colors"
            >
              <ChevronLeft size={16} />
              {prevTopic.title}
            </button>
          ) : (
            <div />
          )}

          {nextTopic ? (
            <button
              onClick={() => {
                if (!isCompleted) onToggleComplete(topic.id);
                onNavigate('topic', nextTopic.id);
              }}
              className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-xs shadow-sm hover:shadow-md transition-all"
            >
              Next: {nextTopic.title}
              <ChevronRight size={14} />
            </button>
          ) : (
            <button
              onClick={() => {
                if (!isCompleted) onToggleComplete(topic.id);
                onNavigate('dashboard');
              }}
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-xs shadow-sm transition-all"
            >
              Finish Roadmap
              <CheckCircle2 size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Middle Spacer: Sticky Table of Contents */}
      <div className="lg:col-span-2">
        <TableOfContents />
      </div>

      {/* Right Column: Interaction Sandbox & Visualizers */}
      <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-6">
        {/* Visualizer / Sandbox Tab Bar (renders only if visualizer is available) */}
        {topic.visualizer && (
          <div className="flex bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('visualizer')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'visualizer'
                  ? 'bg-white text-slate-850 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <BarChart3 size={13} />
              Visual Explorer
            </button>
            <button
              onClick={() => setActiveTab('code')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'code'
                  ? 'bg-white text-slate-850 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Code size={13} />
              Python Code
            </button>
          </div>
        )}

        {/* Tab content renders */}
        <div className="transition-all duration-300">
          {activeTab === 'visualizer' && topic.visualizer === 'gradient-descent' && (
            <GradientDescentVisualizer />
          )}
          {activeTab === 'visualizer' && topic.visualizer === 'k-means' && (
            <KMeansVisualizer />
          )}
          {activeTab === 'visualizer' && topic.visualizer === 'decision-tree' && (
            <DecisionTreeVisualizer />
          )}
          
          {activeTab === 'code' && (
            <CodePlayground
              initialCode={topic.defaultCode}
              exerciseTask={topic.exerciseTask}
              packagesToLoad={topic.packages}
            />
          )}
        </div>
      </div>
    </div>
  );
}
