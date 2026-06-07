import { useState } from 'react';
import { Compass, GraduationCap, ChevronRight, Layers, CheckCircle2, Circle, HelpCircle } from 'lucide-react';
import { modules, curriculumData } from '../data/curriculumData';

interface DashboardProps {
  completedTopics: string[];
  onNavigate: (page: 'dashboard' | 'topic' | 'library', id?: string) => void;
}

interface Node {
  id: string;
  label: string;
  x: number;
  y: number;
  module: string;
}

interface Edge {
  from: string;
  to: string;
}

// Coordinate layout mapping for our 16 concepts on a 740x370 viewBox grid
const GRAPH_NODES: Node[] = [
  // Math Foundations (x = 65)
  { id: "linear-algebra", label: "Linear Algebra", x: 65, y: 50, module: "Math & Stats Foundations" },
  { id: "calculus", label: "Calculus & Gradients", x: 65, y: 140, module: "Math & Stats Foundations" },
  { id: "statistics", label: "Probability & Bayes", x: 65, y: 230, module: "Math & Stats Foundations" },

  // Core Overviews (x = 210)
  { id: "regression-overview", label: "Regression Concepts", x: 210, y: 75, module: "Supervised Learning" },
  { id: "classification-overview", label: "Classification Concepts", x: 210, y: 165, module: "Supervised Learning" },
  { id: "gradient-descent", label: "Gradient Descent", x: 210, y: 255, module: "Supervised Learning" },

  // Algorithms (x = 365)
  { id: "linear-regression", label: "Linear Regression", x: 365, y: 40, module: "Supervised Learning" },
  { id: "logistic-regression", label: "Logistic Regression", x: 365, y: 110, module: "Supervised Learning" },
  { id: "decision-trees", label: "Decision Trees", x: 365, y: 180, module: "Supervised Learning" },
  { id: "support-vector-machines", label: "Support Vector Machines", x: 365, y: 250, module: "Supervised Learning" },
  { id: "k-means", label: "K-Means Clustering", x: 365, y: 320, module: "Unsupervised Learning" },

  // Intermediate & Optimization (x = 520)
  { id: "neural-networks", label: "Neural Networks", x: 520, y: 110, module: "Deep Learning" },
  { id: "genetic-algorithms", label: "Genetic Algorithms", x: 520, y: 220, module: "Unsupervised Learning" },
  { id: "pca", label: "PCA Dimensions", x: 520, y: 320, module: "Unsupervised Learning" },

  // Advanced Paradigms (x = 670)
  { id: "cnn", label: "CNN Vision", x: 670, y: 110, module: "Deep Learning" },
  { id: "q-learning", label: "Q-Learning (RL)", x: 670, y: 200, module: "Reinforcement Learning" }
];

const GRAPH_EDGES: Edge[] = [
  { from: "linear-algebra", to: "linear-regression" },
  { from: "calculus", to: "gradient-descent" },
  { from: "statistics", to: "classification-overview" },
  { from: "regression-overview", to: "linear-regression" },
  { from: "classification-overview", to: "logistic-regression" },
  { from: "classification-overview", to: "decision-trees" },
  { from: "gradient-descent", to: "logistic-regression" },
  { from: "gradient-descent", to: "neural-networks" },
  { from: "logistic-regression", to: "neural-networks" },
  { from: "decision-trees", to: "support-vector-machines" },
  { from: "k-means", to: "pca" },
  { from: "neural-networks", to: "cnn" },
  { from: "neural-networks", to: "q-learning" },
  { from: "genetic-algorithms", to: "neural-networks" }
];

const MODULE_ACCENT_COLORS: Record<string, string> = {
  "Math & Stats Foundations": "#f59e0b", // Amber
  "Supervised Learning": "#3b82f6",       // Blue
  "Unsupervised Learning": "#10b981",     // Emerald
  "Deep Learning": "#8b5cf6",             // Violet
  "Reinforcement Learning": "#ec4899"     // Pink
};

export default function Dashboard({ completedTopics, onNavigate }: DashboardProps) {
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  // Group topics by their modules
  const topicsByModule = modules.reduce((acc, m) => {
    acc[m] = curriculumData.filter(t => t.module === m);
    return acc;
  }, {} as Record<string, typeof curriculumData>);

  const totalTopics = curriculumData.length;
  const totalCompleted = completedTopics.length;
  const percentComplete = totalTopics > 0 ? Math.round((totalCompleted / totalTopics) * 100) : 0;

  // Track prerequisites and dependents for highlighting
  const activeIncoming = hoveredNodeId 
    ? GRAPH_EDGES.filter(e => e.to === hoveredNodeId).map(e => e.from)
    : [];
  
  const activeOutgoing = hoveredNodeId
    ? GRAPH_EDGES.filter(e => e.from === hoveredNodeId).map(e => e.to)
    : [];

  const isHighlighted = (nodeId: string) => {
    if (!hoveredNodeId) return true;
    return nodeId === hoveredNodeId || activeIncoming.includes(nodeId) || activeOutgoing.includes(nodeId);
  };

  const isEdgeHighlighted = (from: string, to: string) => {
    if (!hoveredNodeId) return false;
    return (from === hoveredNodeId && activeOutgoing.includes(to)) || (to === hoveredNodeId && activeIncoming.includes(from));
  };

  return (
    <div className="space-y-10 animate-fade-in max-w-5xl mx-auto">
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-indigo-50/70 via-white to-indigo-50/20 rounded-3xl border border-slate-100 p-8 md:p-12 shadow-premium relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-50/40 rounded-full blur-3xl -z-10 translate-x-20 -translate-y-20"></div>
        
        <div className="max-w-2xl space-y-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 border border-indigo-100/50 rounded-full text-indigo-700 text-xs font-semibold">
            <GraduationCap size={14} />
            <span>Interactive WebAssembly Sandbox</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-display font-bold text-slate-900 tracking-tight leading-[1.15]">
            Master Machine Learning <br />
            <span className="text-indigo-650 bg-gradient-to-r from-indigo-600 to-indigo-800 bg-clip-text text-transparent">
              Through Interactive Play
            </span>
          </h1>

          <p className="text-slate-500 text-base md:text-lg leading-relaxed font-sans">
            AetherML blends math foundations, theory, and hands-on algorithms. Run real Python models inside your browser via WebAssembly without setting up code runtimes.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={() => onNavigate('topic', 'linear-algebra')}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-sm shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-1.5"
            >
              Start Learning
              <ChevronRight size={16} />
            </button>
            <button
              onClick={() => onNavigate('library')}
              className="px-6 py-2.5 bg-white hover:bg-slate-50 text-slate-700 font-semibold rounded-xl text-sm border border-slate-200 shadow-sm transition-all duration-200"
            >
              Explore Cheat Sheets
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-100 shadow-premium p-6 rounded-2xl flex items-center gap-4">
          <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600">
            <Layers size={22} />
          </div>
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Total Chapters</div>
            <div className="text-2xl font-bold font-display text-slate-800">{totalTopics} Modules</div>
          </div>
        </div>

        <div className="bg-white border border-slate-100 shadow-premium p-6 rounded-2xl flex items-center gap-4">
          <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600">
            <CheckCircle2 size={22} />
          </div>
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Completed</div>
            <div className="text-2xl font-bold font-display text-slate-800">{totalCompleted} / {totalTopics}</div>
          </div>
        </div>

        <div className="bg-white border border-slate-100 shadow-premium p-6 rounded-2xl flex items-center gap-4">
          <div className="p-3 bg-violet-50 rounded-xl text-violet-600">
            <Compass size={22} />
          </div>
          <div className="flex-1">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Overall Progress</div>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex-1 bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-violet-600 h-2 rounded-full" style={{ width: `${percentComplete}%` }}></div>
              </div>
              <span className="text-sm font-bold text-slate-700 font-mono">{percentComplete}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Concept dependency road map graph section */}
      <div className="bg-white border border-slate-100 shadow-premium rounded-3xl p-6 md:p-8 space-y-6">
        <div className="flex justify-between items-center pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-bold font-display text-slate-850">Interactive Knowledge Map</h2>
            <p className="text-xs text-slate-400 mt-1">
              Hover over modules to trace prerequisites (incoming lines) and applications (outgoing lines). Click to study.
            </p>
          </div>

          <div className="hidden md:flex items-center gap-4 text-[10px] font-semibold text-slate-450 uppercase tracking-wider">
            {Object.keys(MODULE_ACCENT_COLORS).map(modName => (
              <div key={modName} className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: MODULE_ACCENT_COLORS[modName] }} />
                <span>{modName.split(' ')[0]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* SVG Canvas Map */}
        <div className="relative border border-slate-50/50 rounded-2xl bg-slate-50/20 p-2 overflow-x-auto">
          <svg
            viewBox="0 0 740 370"
            width="100%"
            height="auto"
            className="min-w-[680px] overflow-visible"
          >
            {/* Draw arrows marker definition */}
            <defs>
              <marker id="arrow" viewBox="0 0 10 10" refX="15" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#cbd5e1" />
              </marker>
              <marker id="arrow-highlighted" viewBox="0 0 10 10" refX="15" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#6366f1" />
              </marker>
            </defs>

            {/* Draw connections edges */}
            {GRAPH_EDGES.map((edge, idx) => {
              const fromNode = GRAPH_NODES.find(n => n.id === edge.from);
              const toNode = GRAPH_NODES.find(n => n.id === edge.to);
              if (!fromNode || !toNode) return null;

              const highlighted = isEdgeHighlighted(edge.from, edge.to);
              
              // Draw a clean curved Bezier line
              const pathD = `M ${fromNode.x + 50} ${fromNode.y} C ${(fromNode.x + toNode.x) / 2} ${fromNode.y}, ${(fromNode.x + toNode.x) / 2} ${toNode.y}, ${toNode.x - 50} ${toNode.y}`;

              return (
                <path
                  key={`edge-${idx}`}
                  d={pathD}
                  fill="none"
                  stroke={highlighted ? '#6366f1' : '#e2e8f0'}
                  strokeWidth={highlighted ? 2 : 1.25}
                  markerEnd={highlighted ? 'url(#arrow-highlighted)' : 'url(#arrow)'}
                  className="transition-all duration-300"
                />
              );
            })}

            {/* Draw concept nodes */}
            {GRAPH_NODES.map((node) => {
              const active = isHighlighted(node.id);
              const done = completedTopics.includes(node.id);
              const accentColor = MODULE_ACCENT_COLORS[node.module];
              const isHovered = node.id === hoveredNodeId;

              return (
                <g
                  key={node.id}
                  onClick={() => onNavigate('topic', node.id)}
                  onMouseEnter={() => setHoveredNodeId(node.id)}
                  onMouseLeave={() => setHoveredNodeId(null)}
                  className={`cursor-pointer transition-all duration-300 ${
                    active ? 'opacity-100 scale-100' : 'opacity-35 scale-98'
                  }`}
                  transform={`translate(0, 0)`}
                >
                  {/* Node box shadow card */}
                  <rect
                    x={node.x - 52}
                    y={node.y - 17}
                    width={104}
                    height={34}
                    rx={8}
                    fill="#ffffff"
                    stroke={isHovered ? '#6366f1' : (done ? '#10b981' : '#f1f5f9')}
                    strokeWidth={isHovered ? 2 : 1.5}
                    className="shadow-sm transition-all duration-200"
                  />

                  {/* Left accent strip colored by module */}
                  <rect
                    x={node.x - 52}
                    y={node.y - 17}
                    width={4}
                    height={34}
                    rx={2}
                    fill={accentColor}
                  />

                  {/* Text Title */}
                  <text
                    x={node.x + 2}
                    y={node.y + 4}
                    textAnchor="middle"
                    className="text-[9px] font-bold font-display fill-slate-700 transition-colors"
                  >
                    {node.label}
                  </text>

                  {/* Done status indicator */}
                  {done && (
                    <circle
                      cx={node.x + 42}
                      cy={node.y - 10}
                      r={4}
                      fill="#10b981"
                    />
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        {/* Legend Help Indicator */}
        <div className="p-3 bg-slate-50/50 rounded-xl border border-slate-100/50 flex items-start gap-2.5 text-xs text-slate-500 max-w-xl">
          <HelpCircle size={14} className="text-slate-400 shrink-0 mt-0.5" />
          <p>
            <strong>Prerequisite Paths:</strong> Hover over <span className="font-semibold text-slate-700">Neural Networks</span> to trace its inputs (Linear Algebra, Calculus, Gradient Descent, Logistic Regression, Genetic Algorithms) and outputs (CNN Vision, Q-Learning).
          </p>
        </div>
      </div>

      {/* Course curriculum outline tree list */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold font-display text-slate-850">Curriculum Path Details</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {modules.map((m, mIdx) => {
            const completedInModule = topicsByModule[m].filter(t => completedTopics.includes(t.id)).length;
            const totalInModule = topicsByModule[m].length;

            return (
              <div
                key={m}
                className="bg-white border border-slate-100 shadow-premium rounded-2xl p-6 space-y-4 hover:border-slate-200 transition-all duration-200"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[9px] font-bold text-indigo-500 uppercase tracking-wider bg-indigo-50 border border-indigo-100/50 px-2.5 py-0.5 rounded">
                      Step {mIdx + 1}
                    </span>
                    <h3 className="text-lg font-bold font-display text-slate-800 mt-2">{m}</h3>
                  </div>
                  <span className="text-xs font-mono text-slate-400">
                    {completedInModule}/{totalInModule} done
                  </span>
                </div>

                <div className="space-y-2 pt-2">
                  {topicsByModule[m].map((topic) => {
                    const done = completedTopics.includes(topic.id);
                    return (
                      <button
                        key={topic.id}
                        onClick={() => onNavigate('topic', topic.id)}
                        className="w-full flex items-center justify-between p-2.5 bg-slate-50/50 border border-slate-100 hover:bg-slate-50 rounded-xl text-left transition-colors"
                      >
                        <div className="flex items-center gap-2.5 text-xs text-slate-700 font-medium">
                          {done ? (
                            <CheckCircle2 size={15} className="text-emerald-500 shrink-0" />
                          ) : (
                            <Circle size={15} className="text-slate-350 shrink-0" />
                          )}
                          <span>{topic.title}</span>
                        </div>
                        <ChevronRight size={14} className="text-slate-400" />
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
