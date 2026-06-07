import { useState, useEffect } from 'react';
import type { MouseEvent } from 'react';
import { RotateCcw, Plus, Dice5, ChevronRight } from 'lucide-react';

interface Point {
  x: number;
  y: number;
  cluster: number; // -1 means unassigned
}

interface Centroid {
  x: number;
  y: number;
  color: string;
}

const CLUSTER_COLORS = [
  '#3b82f6', // blue
  '#ec4899', // pink
  '#10b981', // emerald
  '#f59e0b', // amber
  '#8b5cf6', // violet
];

export default function KMeansVisualizer() {
  const [k, setK] = useState<number>(3);
  const [points, setPoints] = useState<Point[]>([]);
  const [centroids, setCentroids] = useState<Centroid[]>([]);
  const [phase, setPhase] = useState<'setup' | 'initialized' | 'assign' | 'update' | 'converged'>('setup');
  const [stepCount, setStepCount] = useState<number>(0);

  // Width and height of visualizer canvas
  const canvasWidth = 500;
  const canvasHeight = 300;

  // Initialize random data points
  const generateRandomPoints = () => {
    const newPoints: Point[] = [];
    // Generate clusters of points around 3 hot spots to make it visually satisfying
    const hotSpots = [
      { cx: 120, cy: 100, radius: 45 },
      { cx: 380, cy: 90, radius: 45 },
      { cx: 250, cy: 220, radius: 55 }
    ];

    for (let i = 0; i < 45; i++) {
      const spot = hotSpots[i % hotSpots.length];
      const r = Math.random() * spot.radius;
      const theta = Math.random() * 2 * Math.PI;
      const x = Math.max(15, Math.min(canvasWidth - 15, spot.cx + r * Math.cos(theta)));
      const y = Math.max(15, Math.min(canvasHeight - 15, spot.cy + r * Math.sin(theta)));
      newPoints.push({ x, y, cluster: -1 });
    }
    
    setPoints(newPoints);
    setCentroids([]);
    setPhase('setup');
    setStepCount(0);
  };

  useEffect(() => {
    generateRandomPoints();
  }, []);

  // Handle clicking on canvas to add a custom point
  const handleCanvasClick = (e: MouseEvent<SVGSVGElement>) => {
    if (phase !== 'setup' && phase !== 'initialized') return;
    
    const svg = e.currentTarget;
    const rect = svg.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Add point and reset centroids if we already started
    setPoints(prev => [...prev, { x, y, cluster: -1 }]);
    setCentroids([]);
    setPhase('setup');
    setStepCount(0);
  };

  // Initialize centroids using K-Means++ style or simple random points
  const handleInitialize = () => {
    if (points.length < k) return;
    
    const newCentroids: Centroid[] = [];
    const chosenIndices = new Set<number>();
    
    // Pick unique random points to serve as initial centroids
    while (newCentroids.length < k) {
      const idx = Math.floor(Math.random() * points.length);
      if (!chosenIndices.has(idx)) {
        chosenIndices.add(idx);
        newCentroids.push({
          x: points[idx].x,
          y: points[idx].y,
          color: CLUSTER_COLORS[newCentroids.length]
        });
      }
    }

    setCentroids(newCentroids);
    setPoints(prev => prev.map(p => ({ ...p, cluster: -1 })));
    setPhase('initialized');
    setStepCount(0);
  };

  // Run a single step of the K-Means algorithm
  const handleStep = () => {
    if (centroids.length === 0) return;

    if (phase === 'initialized' || phase === 'update') {
      // PHASE: ASSIGNMENT STEP
      // Assign points to nearest centroid
      const updatedPoints = points.map(p => {
        let minDist = Infinity;
        let nearestCluster = -1;
        
        centroids.forEach((c, idx) => {
          const dist = Math.pow(p.x - c.x, 2) + Math.pow(p.y - c.y, 2);
          if (dist < minDist) {
            minDist = dist;
            nearestCluster = idx;
          }
        });

        return { ...p, cluster: nearestCluster };
      });

      setPoints(updatedPoints);
      setPhase('assign');
      setStepCount(prev => prev + 1);
    } else if (phase === 'assign') {
      // PHASE: UPDATE STEP
      // Move centroids to the mean of their assigned points
      let centroidsMoved = false;
      const updatedCentroids = centroids.map((c, idx) => {
        const assignedPoints = points.filter(p => p.cluster === idx);
        
        if (assignedPoints.length === 0) return c; // Centroid stays put if no points assigned

        const sumX = assignedPoints.reduce((sum, p) => sum + p.x, 0);
        const sumY = assignedPoints.reduce((sum, p) => sum + p.y, 0);
        const newX = sumX / assignedPoints.length;
        const newY = sumY / assignedPoints.length;

        // Check if centroid moved significantly
        if (Math.abs(c.x - newX) > 0.5 || Math.abs(c.y - newY) > 0.5) {
          centroidsMoved = true;
        }

        return { ...c, x: newX, y: newY };
      });

      setCentroids(updatedCentroids);
      
      // If centroids did not move, the algorithm has converged!
      if (!centroidsMoved) {
        setPhase('converged');
      } else {
        setPhase('update');
      }
    }
  };

  const handleReset = () => {
    setPoints([]);
    setCentroids([]);
    setPhase('setup');
    setStepCount(0);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-premium p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold font-display text-slate-800">K-Means Interactive Sandbox</h3>
        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
          phase === 'converged' 
            ? 'bg-emerald-50 border border-emerald-100 text-emerald-600'
            : 'bg-slate-50 border border-slate-100 text-slate-500'
        }`}>
          {phase === 'setup' && '1. Draw or generate points'}
          {phase === 'initialized' && '2. Centroids set! Click Step'}
          {phase === 'assign' && 'Assignment Phase'}
          {phase === 'update' && 'Update Phase'}
          {phase === 'converged' && 'Converged successfully'}
        </span>
      </div>

      {/* SVG Canvas Workspace */}
      <div className="relative border border-slate-100 rounded-xl bg-slate-50/35 overflow-hidden mb-5">
        <svg
          width="100%"
          height={canvasHeight}
          onClick={handleCanvasClick}
          className={`cursor-crosshair overflow-visible ${phase !== 'setup' && phase !== 'initialized' ? 'pointer-events-none' : ''}`}
        >
          {/* Background grid helper */}
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#f1f5f9" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* Connect points to centroids with light lines in assignment phase */}
          {phase === 'assign' && points.map((p, idx) => {
            if (p.cluster === -1 || !centroids[p.cluster]) return null;
            const centroid = centroids[p.cluster];
            return (
              <line
                key={`line-${idx}`}
                x1={p.x}
                y1={p.y}
                x2={centroid.x}
                y2={centroid.y}
                stroke={centroid.color}
                strokeWidth={0.75}
                strokeOpacity={0.25}
              />
            );
          })}

          {/* Data Points */}
          {points.map((p, idx) => (
            <circle
              key={`pt-${idx}`}
              cx={p.x}
              cy={p.y}
              r={5}
              fill={p.cluster === -1 ? '#94a3b8' : CLUSTER_COLORS[p.cluster]}
              stroke="#ffffff"
              strokeWidth={1}
              className="transition-all duration-500 ease-out"
            />
          ))}

          {/* Centroids represented as larger diamonds */}
          {centroids.map((c, idx) => (
            <g key={`c-${idx}`} className="transition-all duration-500 ease-out">
              {/* Outer ring */}
              <circle
                cx={c.x}
                cy={c.y}
                r={12}
                fill="none"
                stroke={c.color}
                strokeWidth={1.5}
                strokeDasharray="2 2"
              />
              {/* Center Diamond */}
              <rect
                x={c.x - 6}
                y={c.y - 6}
                width={12}
                height={12}
                transform={`rotate(45 ${c.x} ${c.y})`}
                fill={c.color}
                stroke="#ffffff"
                strokeWidth={2}
                className="shadow-sm"
              />
            </g>
          ))}
        </svg>

        {points.length === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-slate-400 text-sm">
            <Plus size={24} className="mb-1" />
            <p>Click inside the grid to place data points</p>
            <p className="text-xs text-slate-300">or click "Generate Dataset" below</p>
          </div>
        )}
      </div>

      {/* Control Actions Row */}
      <div className="flex flex-col gap-4">
        {/* Setup Parameters */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-slate-500">Number of clusters (k):</span>
            <div className="flex gap-1">
              {[2, 3, 4, 5].map((val) => (
                <button
                  key={val}
                  onClick={() => {
                    setK(val);
                    setCentroids([]);
                    setPhase('setup');
                    setPoints(prev => prev.map(p => ({ ...p, cluster: -1 })));
                  }}
                  disabled={phase !== 'setup' && phase !== 'initialized'}
                  className={`w-7 h-7 rounded-lg text-xs font-semibold transition-all ${
                    k === val
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-600 disabled:opacity-50'
                  }`}
                >
                  {val}
                </button>
              ))}
            </div>
          </div>
          
          <button
            onClick={generateRandomPoints}
            className="text-xs flex items-center gap-1.5 font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            <Dice5 size={14} />
            Generate Dataset
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          {centroids.length === 0 ? (
            <button
              onClick={handleInitialize}
              disabled={points.length < k}
              className="flex-1 py-2 px-4 rounded-xl flex items-center justify-center gap-2 font-medium text-sm bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-all duration-200 disabled:opacity-50"
            >
              Initialize Centroids
            </button>
          ) : (
            <button
              onClick={handleStep}
              disabled={phase === 'converged'}
              className={`flex-1 py-2 px-4 rounded-xl flex items-center justify-center gap-2 font-medium text-sm shadow-sm transition-all duration-200 ${
                phase === 'converged'
                  ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white border-transparent'
              }`}
            >
              <ChevronRight size={16} />
              {phase === 'initialized' && 'Step 1: Assign Points'}
              {phase === 'assign' && 'Step 2: Update Centroids'}
              {phase === 'update' && `Step ${stepCount + 1}: Assign Points`}
              {phase === 'converged' && 'Clustering Converged'}
            </button>
          )}

          <button
            onClick={handleReset}
            className="py-2 px-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-500 hover:text-slate-800 border border-slate-200 shadow-sm transition-all duration-200"
            title="Clear All"
          >
            <RotateCcw size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
