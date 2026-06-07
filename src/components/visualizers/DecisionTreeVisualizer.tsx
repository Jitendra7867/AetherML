import React, { useState, useEffect } from 'react';
import { RotateCcw, Play, CheckCircle2 } from 'lucide-react';

interface Point {
  x: number;
  y: number;
  label: 0 | 1; // 0 = Red (Class A), 1 = Blue (Class B)
}

interface TreeNode {
  id: string;
  axis: 'x' | 'y' | null;
  threshold: number | null;
  left: TreeNode | null;
  right: TreeNode | null;
  label: 0 | 1 | null;
  redCount: number;
  blueCount: number;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export default function DecisionTreeVisualizer() {
  const [points, setPoints] = useState<Point[]>([]);
  const [activeClass, setActiveClass] = useState<0 | 1>(0); // Class to place
  const [maxDepth, setMaxDepth] = useState<number>(2);
  const [tree, setTree] = useState<TreeNode | null>(null);
  const [boundaryRects, setBoundaryRects] = useState<{ x1: number; y1: number; x2: number; y2: number; label: 0 | 1 }[]>([]);

  const width = 500;
  const height = 280;

  // Generate a default dataset
  const generateDefaultDataset = () => {
    const defaultPts: Point[] = [
      // Class 0 (Red) - generally left and lower
      { x: 100, y: 80, label: 0 },
      { x: 120, y: 140, label: 0 },
      { x: 180, y: 100, label: 0 },
      { x: 80, y: 220, label: 0 },
      { x: 210, y: 70, label: 0 },
      { x: 220, y: 160, label: 0 },

      // Class 1 (Blue) - generally right and upper
      { x: 380, y: 100, label: 1 },
      { x: 410, y: 160, label: 1 },
      { x: 320, y: 200, label: 1 },
      { x: 340, y: 250, label: 1 },
      { x: 440, y: 220, label: 1 },
      { x: 260, y: 240, label: 1 },
    ];
    setPoints(defaultPts);
    setTree(null);
    setBoundaryRects([]);
  };

  useEffect(() => {
    generateDefaultDataset();
  }, []);

  const handleCanvasClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const svg = e.currentTarget;
    const rect = svg.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Add point
    setPoints(prev => [...prev, { x, y, label: activeClass }]);
    setTree(null);
    setBoundaryRects([]);
  };

  // Entropy helper
  const entropy = (red: number, blue: number): number => {
    const total = red + blue;
    if (total === 0) return 0;
    const p0 = red / total;
    const p1 = blue / total;
    const e0 = p0 > 0 ? -p0 * Math.log2(p0) : 0;
    const e1 = p1 > 0 ? -p1 * Math.log2(p1) : 0;
    return e0 + e1;
  };

  // Train decision tree algorithm in TS
  const trainTree = () => {
    if (points.length === 0) return;

    let nodeIdCounter = 0;

    const buildTree = (
      nodePoints: Point[],
      depth: number,
      x1: number,
      y1: number,
      x2: number,
      y2: number
    ): TreeNode => {
      const id = `node-${nodeIdCounter++}`;
      const redCount = nodePoints.filter(p => p.label === 0).length;
      const blueCount = nodePoints.filter(p => p.label === 1).length;

      // Base cases: pure node, no points, or reached max depth
      if (depth >= maxDepth || redCount === 0 || blueCount === 0 || nodePoints.length <= 1) {
        return {
          id,
          axis: null,
          threshold: null,
          left: null,
          right: null,
          label: redCount >= blueCount ? 0 : 1,
          redCount,
          blueCount,
          x1, y1, x2, y2
        };
      }

      // Find best split
      let bestGain = -1;
      let bestAxis: 'x' | 'y' | null = null;
      let bestThreshold = 0;
      let bestLeftPoints: Point[] = [];
      let bestRightPoints: Point[] = [];

      const parentEntropy = entropy(redCount, blueCount);

      // We test split positions in grid steps
      // For X: test thresholds from x1+20 to x2-20 in steps of 20
      // For Y: test thresholds from y1+20 to y2-20 in steps of 20
      
      // Try X splits
      for (let t = x1 + 25; t <= x2 - 25; t += 25) {
        const left = nodePoints.filter(p => p.x < t);
        const right = nodePoints.filter(p => p.x >= t);
        if (left.length === 0 || right.length === 0) continue;

        const leftRed = left.filter(p => p.label === 0).length;
        const leftBlue = left.filter(p => p.label === 1).length;
        const rightRed = right.filter(p => p.label === 0).length;
        const rightBlue = right.filter(p => p.label === 1).length;

        const eLeft = entropy(leftRed, leftBlue);
        const eRight = entropy(rightRed, rightBlue);
        const splitEntropy = (left.length / nodePoints.length) * eLeft + (right.length / nodePoints.length) * eRight;
        const gain = parentEntropy - splitEntropy;

        if (gain > bestGain) {
          bestGain = gain;
          bestAxis = 'x';
          bestThreshold = t;
          bestLeftPoints = left;
          bestRightPoints = right;
        }
      }

      // Try Y splits
      for (let t = y1 + 25; t <= y2 - 25; t += 25) {
        const left = nodePoints.filter(p => p.y < t);
        const right = nodePoints.filter(p => p.y >= t);
        if (left.length === 0 || right.length === 0) continue;

        const leftRed = left.filter(p => p.label === 0).length;
        const leftBlue = left.filter(p => p.label === 1).length;
        const rightRed = right.filter(p => p.label === 0).length;
        const rightBlue = right.filter(p => p.label === 1).length;

        const eLeft = entropy(leftRed, leftBlue);
        const eRight = entropy(rightRed, rightBlue);
        const splitEntropy = (left.length / nodePoints.length) * eLeft + (right.length / nodePoints.length) * eRight;
        const gain = parentEntropy - splitEntropy;

        if (gain > bestGain) {
          bestGain = gain;
          bestAxis = 'y';
          bestThreshold = t;
          bestLeftPoints = left;
          bestRightPoints = right;
        }
      }

      // If no gain was achieved, return leaf node
      if (bestGain <= 0.0001 || !bestAxis) {
        return {
          id,
          axis: null,
          threshold: null,
          left: null,
          right: null,
          label: redCount >= blueCount ? 0 : 1,
          redCount,
          blueCount,
          x1, y1, x2, y2
        };
      }

      // Recurse on child regions
      let leftChild: TreeNode;
      let rightChild: TreeNode;

      if (bestAxis === 'x') {
        leftChild = buildTree(bestLeftPoints, depth + 1, x1, y1, bestThreshold, y2);
        rightChild = buildTree(bestRightPoints, depth + 1, bestThreshold, y1, x2, y2);
      } else {
        leftChild = buildTree(bestLeftPoints, depth + 1, x1, y1, x2, bestThreshold);
        rightChild = buildTree(bestRightPoints, depth + 1, x1, bestThreshold, x2, y2);
      }

      return {
        id,
        axis: bestAxis,
        threshold: bestThreshold,
        left: leftChild,
        right: rightChild,
        label: null,
        redCount,
        blueCount,
        x1, y1, x2, y2
      };
    };

    const root = buildTree(points, 0, 0, 0, width, height);
    setTree(root);

    // Flatten leaves to draw boundary regions
    const rects: { x1: number; y1: number; x2: number; y2: number; label: 0 | 1 }[] = [];
    const extractLeaves = (node: TreeNode) => {
      if (node.axis === null && node.label !== null) {
        rects.push({
          x1: node.x1,
          y1: node.y1,
          x2: node.x2,
          y2: node.y2,
          label: node.label
        });
        return;
      }
      if (node.left) extractLeaves(node.left);
      if (node.right) extractLeaves(node.right);
    };
    extractLeaves(root);
    setBoundaryRects(rects);
  };

  const handleReset = () => {
    setPoints([]);
    setTree(null);
    setBoundaryRects([]);
  };

  // Helper to draw split boundaries
  const renderSplitLines = (node: TreeNode | null): React.ReactNode[] => {
    if (!node || node.axis === null || node.threshold === null) return [];
    
    let line: React.ReactNode;
    if (node.axis === 'x') {
      line = (
        <line
          key={`split-line-${node.id}`}
          x1={node.threshold}
          y1={node.y1}
          x2={node.threshold}
          y2={node.y2}
          stroke="#475569"
          strokeWidth={2}
          strokeDasharray="4 2"
        />
      );
    } else {
      line = (
        <line
          key={`split-line-${node.id}`}
          x1={node.x1}
          y1={node.threshold}
          x2={node.x2}
          y2={node.threshold}
          stroke="#475569"
          strokeWidth={2}
          strokeDasharray="4 2"
        />
      );
    }

    return [
      line,
      ...renderSplitLines(node.left),
      ...renderSplitLines(node.right)
    ];
  };

  // Helper to render tree node hierarchy graph
  const renderTreeGraph = (node: TreeNode | null, px: number, py: number, levelWidth: number): React.ReactNode => {
    if (!node) return null;

    const childY = py + 55;
    const leftX = px - levelWidth;
    const rightX = px + levelWidth;

    const isLeaf = node.axis === null;

    return (
      <g key={`graph-node-${node.id}`}>
        {/* Connection lines to children */}
        {!isLeaf && node.left && (
          <>
            <line x1={px} y1={py + 15} x2={leftX} y2={childY} stroke="#cbd5e1" strokeWidth={1.5} />
            <text x={px - levelWidth/2 - 10} y={py + 35} className="text-[9px] font-mono fill-slate-400 font-semibold" textAnchor="middle">
              {node.axis === 'x' ? `Yes` : `Yes`}
            </text>
          </>
        )}
        {!isLeaf && node.right && (
          <>
            <line x1={px} y1={py + 15} x2={rightX} y2={childY} stroke="#cbd5e1" strokeWidth={1.5} />
            <text x={px + levelWidth/2 + 10} y={py + 35} className="text-[9px] font-mono fill-slate-400 font-semibold" textAnchor="middle">
              {node.axis === 'x' ? `No` : `No`}
            </text>
          </>
        )}

        {/* Node Box */}
        <g transform={`translate(${px - 50}, ${py - 12})`}>
          <rect
            width={100}
            height={26}
            rx={6}
            fill="#ffffff"
            stroke={isLeaf ? (node.label === 0 ? '#ef4444' : '#3b82f6') : '#64748b'}
            strokeWidth={1.5}
            className="shadow-sm"
          />
          <text x={50} y={16} textAnchor="middle" className="text-[9px] font-semibold font-display fill-slate-700">
            {isLeaf 
              ? `Leaf: Class ${node.label === 0 ? 'Red' : 'Blue'}` 
              : `Is ${node.axis === 'x' ? 'X' : 'Y'} < ${Math.round(node.threshold!)}?`
            }
          </text>
          <text x={50} y={24} textAnchor="middle" className="text-[7px] font-mono fill-slate-400">
            {`R:${node.redCount} B:${node.blueCount}`}
          </text>
        </g>

        {/* Render Children */}
        {!isLeaf && renderTreeGraph(node.left, leftX, childY, levelWidth * 0.5)}
        {!isLeaf && renderTreeGraph(node.right, rightX, childY, levelWidth * 0.5)}
      </g>
    );
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-premium p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold font-display text-slate-800">Decision Tree Boundary Map</h3>
        <span className="text-xs px-2.5 py-1 bg-slate-50 border border-slate-100 rounded-full font-medium text-slate-500">
          Information Gain (Entropy)
        </span>
      </div>

      {/* Grid Canvas */}
      <div className="relative border border-slate-100 rounded-xl bg-slate-50/25 overflow-hidden mb-5">
        <svg
          width="100%"
          height={height}
          onClick={handleCanvasClick}
          className="cursor-crosshair overflow-visible"
        >
          {/* Shaded decision boundary regions */}
          {boundaryRects.map((r, idx) => (
            <rect
              key={`rect-${idx}`}
              x={r.x1}
              y={r.y1}
              width={r.x2 - r.x1}
              height={r.y2 - r.y1}
              fill={r.label === 0 ? '#fee2e2' : '#dbeafe'}
              fillOpacity={0.4}
              className="transition-all duration-300"
            />
          ))}

          {/* Grid background lines */}
          <line x1={0} y1={height/2} x2={width} y2={height/2} stroke="#f1f5f9" strokeWidth={1} />
          <line x1={width/2} y1={0} x2={width/2} y2={height} stroke="#f1f5f9" strokeWidth={1} />

          {/* Recursively drawn split lines */}
          {renderSplitLines(tree)}

          {/* Points */}
          {points.map((p, idx) => (
            <circle
              key={`pt-${idx}`}
              cx={p.x}
              cy={p.y}
              r={5.5}
              fill={p.label === 0 ? '#ef4444' : '#3b82f6'}
              stroke="#ffffff"
              strokeWidth={1.5}
              className="drop-shadow-sm transition-all duration-300"
            />
          ))}
        </svg>

        {points.length === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-slate-400 text-sm">
            <p>Click inside the grid to place points</p>
            <p className="text-xs text-slate-300">or click "Reset / Seed" to restore standard dataset</p>
          </div>
        )}
      </div>

      {/* Settings Panel */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
          <div className="flex items-center gap-1.5">
            <span>Adding Class:</span>
            <button
              onClick={() => setActiveClass(0)}
              className={`px-3 py-1 rounded-lg text-xs font-medium border transition-all ${
                activeClass === 0
                  ? 'bg-red-50 text-red-600 border-red-200'
                  : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
              }`}
            >
              Class Red
            </button>
            <button
              onClick={() => setActiveClass(1)}
              className={`px-3 py-1 rounded-lg text-xs font-medium border transition-all ${
                activeClass === 1
                  ? 'bg-blue-50 text-blue-600 border-blue-200'
                  : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
              }`}
            >
              Class Blue
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            <span>Max Depth:</span>
            {[1, 2, 3].map((val) => (
              <button
                key={val}
                onClick={() => {
                  setMaxDepth(val);
                  setTree(null);
                  setBoundaryRects([]);
                }}
                className={`w-6 h-6 rounded-md font-semibold text-xs transition-all ${
                  maxDepth === val
                    ? 'bg-slate-800 text-white shadow-sm'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                }`}
              >
                {val}
              </button>
            ))}
          </div>
        </div>

        {/* Action controls */}
        <div className="flex gap-2">
          <button
            onClick={trainTree}
            disabled={points.length === 0}
            className="flex-1 py-2 px-4 rounded-xl flex items-center justify-center gap-2 font-medium text-sm bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-all duration-200 disabled:opacity-50"
          >
            <Play size={15} />
            Train Decision Tree
          </button>
          
          <button
            onClick={generateDefaultDataset}
            className="py-2 px-3 rounded-xl bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 shadow-sm transition-all text-xs font-medium"
          >
            Load Default
          </button>

          <button
            onClick={handleReset}
            className="p-2 rounded-xl bg-white hover:bg-slate-50 text-slate-400 hover:text-slate-700 border border-slate-200 shadow-sm transition-all"
            title="Clear all points"
          >
            <RotateCcw size={15} />
          </button>
        </div>

        {/* Decision Tree Nodes Graph */}
        {tree && (
          <div className="mt-5 pt-5 border-t border-slate-100 bg-slate-50/50 rounded-xl p-4 overflow-x-auto">
            <div className="text-xs font-semibold text-slate-500 mb-4 flex items-center gap-1">
              <CheckCircle2 size={13} className="text-emerald-500" />
              Trained Model Graph (Hierarchy)
            </div>
            <svg width="100%" height={210} className="overflow-visible mx-auto" style={{ maxWidth: '440px' }}>
              {renderTreeGraph(tree, 220, 20, 100)}
            </svg>
          </div>
        )}
      </div>
    </div>
  );
}
