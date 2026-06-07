import { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, ArrowRight, Info } from 'lucide-react';

export default function GradientDescentVisualizer() {
  const [learningRate, setLearningRate] = useState<number>(0.2);
  const [startX, setStartX] = useState<number>(-4.0);
  const [currentX, setCurrentX] = useState<number>(-4.0);
  const [history, setHistory] = useState<number[]>([-4.0]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [stepCount, setStepCount] = useState<number>(0);

  // Define the loss function: f(x) = 0.04 * x^4 - 0.8 * x^2 + 0.1 * x + 5
  // Derivative f'(x) = 0.16 * x^3 - 1.6 * x + 0.1
  const f = (x: number) => 0.04 * Math.pow(x, 4) - 0.8 * Math.pow(x, 2) + 0.1 * x + 5;
  const df = (x: number) => 0.16 * Math.pow(x, 3) - 1.6 * x + 0.1;

  // Reset visualization
  const handleReset = () => {
    setIsPlaying(false);
    setCurrentX(startX);
    setHistory([startX]);
    setStepCount(0);
  };

  useEffect(() => {
    handleReset();
  }, [startX]);

  // Single step of gradient descent
  const takeStep = () => {
    const gradient = df(currentX);
    // w_next = w - alpha * grad
    const nextX = currentX - learningRate * gradient;
    
    // Bounds check to keep the ball on the chart
    const boundedNextX = Math.max(-5, Math.min(5, nextX));
    
    if (Math.abs(boundedNextX - currentX) < 0.0001 || stepCount >= 100) {
      setIsPlaying(false);
      return;
    }

    setCurrentX(boundedNextX);
    setHistory(prev => [...prev, boundedNextX]);
    setStepCount(prev => prev + 1);
  };

  // Play loop
  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        takeStep();
      }, 400);
      return () => clearInterval(interval);
    }
  }, [isPlaying, currentX, learningRate, stepCount]);

  // SVG dimensions
  const width = 500;
  const height = 250;
  const margin = { top: 20, right: 20, bottom: 20, left: 20 };

  // Map math coordinates to SVG coordinates
  // x: [-5, 5] -> [margin.left, width - margin.right]
  // y: [-1, 7] -> [height - margin.bottom, margin.top]
  const mapX = (x: number) => {
    return margin.left + ((x - (-5)) / 10) * (width - margin.left - margin.right);
  };
  const mapY = (y: number) => {
    return (height - margin.bottom) - ((y - (-1)) / 8) * (height - margin.top - margin.bottom);
  };

  // Generate curve path
  const curvePoints: string[] = [];
  for (let x = -5; x <= 5; x += 0.1) {
    const px = mapX(x);
    const py = mapY(f(x));
    curvePoints.push(`${x === -5 ? 'M' : 'L'} ${px} ${py}`);
  }
  const curvePath = curvePoints.join(' ');

  // Tangent line at current point
  const slope = df(currentX);
  const tangentLength = 0.8;
  const dx = tangentLength / Math.sqrt(1 + slope * slope);
  const dy = slope * dx;
  const x1 = currentX - dx;
  const y1 = f(currentX) - dy;
  const x2 = currentX + dx;
  const y2 = f(currentX) + dy;

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-premium p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold font-display text-slate-800">Gradient Descent Explorer</h3>
        <span className="text-xs px-2.5 py-1 bg-slate-50 border border-slate-100 rounded-full font-medium text-slate-500">
          Loss landscape: non-convex
        </span>
      </div>

      {/* SVG Canvas */}
      <div className="relative border border-slate-50 rounded-xl bg-slate-50/50 p-2 mb-6">
        <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
          {/* Grid lines */}
          <line x1={mapX(-5)} y1={mapY(0)} x2={mapX(5)} y2={mapY(0)} stroke="#e2e8f0" strokeWidth={1} strokeDasharray="4 4" />
          <line x1={mapX(0)} y1={mapY(-1)} x2={mapX(0)} y2={mapY(7)} stroke="#e2e8f0" strokeWidth={1} strokeDasharray="4 4" />

          {/* Loss Curve */}
          <path d={curvePath} fill="none" stroke="#94a3b8" strokeWidth={3} strokeLinecap="round" />

          {/* History line (descent trace) */}
          {history.length > 1 && (
            <path
              d={history.map((x, idx) => `${idx === 0 ? 'M' : 'L'} ${mapX(x)} ${mapY(f(x))}`).join(' ')}
              fill="none"
              stroke="#6366f1"
              strokeWidth={1.5}
              strokeDasharray="3 3"
            />
          )}

          {/* History step marker circles */}
          {history.map((x, idx) => (
            <circle
              key={idx}
              cx={mapX(x)}
              cy={mapY(f(x))}
              r={idx === history.length - 1 ? 5 : 2.5}
              fill={idx === history.length - 1 ? '#4f46e5' : '#818cf8'}
              className="transition-all duration-300"
            />
          ))}

          {/* Active ball representing weights state */}
          <circle
            cx={mapX(currentX)}
            cy={mapY(f(currentX))}
            r={8}
            fill="#4f46e5"
            stroke="#ffffff"
            strokeWidth={2}
            className="drop-shadow-sm transition-all duration-300"
          />

          {/* Tangent slope line */}
          <line
            x1={mapX(x1)}
            y1={mapY(y1)}
            x2={mapX(x2)}
            y2={mapY(y2)}
            stroke="#ef4444"
            strokeWidth={2}
          />
        </svg>

        {/* Floating statistics panel */}
        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm shadow-premium border border-slate-100 rounded-lg p-3 text-xs space-y-1 font-mono">
          <div>Loss: <span className="font-semibold text-slate-800">{f(currentX).toFixed(4)}</span></div>
          <div>Weight (x): <span className="font-semibold text-slate-800">{currentX.toFixed(4)}</span></div>
          <div>Slope: <span className={`font-semibold ${Math.abs(df(currentX)) < 0.1 ? 'text-emerald-500' : 'text-red-500'}`}>{df(currentX).toFixed(4)}</span></div>
          <div>Steps: <span className="font-semibold text-slate-800">{stepCount}</span></div>
        </div>
      </div>

      {/* Parameter Sliders */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <div className="flex justify-between text-xs font-semibold text-slate-500 mb-1.5">
            <span>Learning Rate (α)</span>
            <span className="text-slate-800 font-mono font-medium">{learningRate.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min="0.05"
            max="1.20"
            step="0.05"
            value={learningRate}
            onChange={(e) => setLearningRate(parseFloat(e.target.value))}
            className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
          />
          <span className="text-[10px] text-slate-400 mt-1 block">Controls step size down the slope.</span>
        </div>

        <div>
          <div className="flex justify-between text-xs font-semibold text-slate-500 mb-1.5">
            <span>Starting Point (x₀)</span>
            <span className="text-slate-800 font-mono font-medium">{startX.toFixed(1)}</span>
          </div>
          <input
            type="range"
            min="-4.5"
            max="4.5"
            step="0.5"
            value={startX}
            onChange={(e) => setStartX(parseFloat(e.target.value))}
            disabled={isPlaying}
            className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 disabled:opacity-50"
          />
          <span className="text-[10px] text-slate-400 mt-1 block">Drag to set start weight.</span>
        </div>
      </div>

      {/* Visualizer Controls */}
      <div className="flex gap-2">
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className={`flex-1 py-2 px-4 rounded-xl flex items-center justify-center gap-2 font-medium text-sm border shadow-sm transition-all duration-200 ${
            isPlaying
              ? 'bg-slate-800 hover:bg-slate-900 text-white border-transparent'
              : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
          }`}
        >
          {isPlaying ? <Pause size={16} /> : <Play size={16} />}
          {isPlaying ? 'Pause' : 'Animate'}
        </button>

        <button
          onClick={takeStep}
          disabled={isPlaying}
          className="flex-1 py-2 px-4 rounded-xl flex items-center justify-center gap-2 font-medium text-sm bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-sm transition-all duration-200 disabled:opacity-50"
        >
          <ArrowRight size={16} />
          Step
        </button>

        <button
          onClick={handleReset}
          className="p-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-500 hover:text-slate-800 border border-slate-200 shadow-sm transition-all duration-200"
          title="Reset"
        >
          <RotateCcw size={16} />
        </button>
      </div>

      {/* Theory Connection note */}
      <div className="mt-4 p-3 bg-slate-50/50 rounded-xl border border-slate-100 flex items-start gap-2.5 text-xs text-slate-500">
        <Info size={14} className="text-slate-400 shrink-0 mt-0.5" />
        <p>
          <strong>Visual Guide:</strong> Try <span className="font-semibold text-slate-700">α = 1.05</span> starting at <span className="font-semibold text-slate-700">x₀ = -4.0</span> to watch the algorithm overshoot and bounce out of the local minimum, or <span className="font-semibold text-slate-700">α = 0.10</span> to watch it settle slowly.
        </p>
      </div>
    </div>
  );
}
