import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";
import { Droplets, Grid3X3, Gauge, Timer, TrendingUp, Play, Pause, RotateCcw, CheckCircle2, XCircle, AlertTriangle, Waves } from "lucide-react";
import { useUnits } from "@/contexts/UnitsContext";

export function BaseFlowStabilityDiagram() {
  const { u, conv } = useUnits();
  const [baseFlowFactor, setBaseFlowFactor] = useState([0.001]);
  const [minBaseFlowDepth, setMinBaseFlowDepth] = useState([0.001]);
  const [slope, setSlope] = useState([0.01]);
  const [sedimentDepth, setSedimentDepth] = useState([0.05]);
  
  const pipeHeight = 1.0;
  const yFull = pipeHeight;
  const ySed = sedimentDepth[0];
  const dlFac = baseFlowFactor[0];
  const dlMin = minBaseFlowDepth[0];
  
  const calculatedBaseFlow = ySed + Math.max(dlMin, dlFac * (yFull - ySed));
  const slopeDoubled = 0.001;
  const slopeMultiplier = slope[0] > slopeDoubled ? Math.min(2, 1 + (slope[0] - slopeDoubled) / 0.01) : 1;
  const effectiveBaseFlow = calculatedBaseFlow * slopeMultiplier;
  
  const pipeRadius = 80;
  const centerY = 100;
  const baseFlowHeight = effectiveBaseFlow * pipeRadius * 2;
  const sedHeight = ySed * pipeRadius * 2;
  
  return (
    <Card className="p-6 bg-gradient-to-br from-sky-100/80 to-blue-100/80 dark:from-sky-900/30 dark:to-blue-900/30 border-sky-300/50 dark:border-sky-700/30" data-testid="diagram-base-flow-stability">
      <div className="flex items-center gap-2 mb-4">
        <Droplets className="h-5 w-5 text-blue-400" />
        <h3 className="font-semibold text-lg text-blue-800 dark:text-blue-100">Base Flow for Numerical Stability</h3>
        <Badge variant="outline" className="ml-auto text-blue-600 dark:text-blue-400 border-blue-400/50">ICM Parameter</Badge>
      </div>
      
      <p className="text-sm text-muted-foreground mb-4">
        ICM adds a "virtual" thin film of water at the pipe invert for numerical stability. This base flow is added upstream but subtracted downstream, so it doesn't affect net flow or mass balance.
      </p>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label className="text-xs text-blue-300">Base Flow Factor (DLFAC): {baseFlowFactor[0].toFixed(4)}</Label>
            <Slider
              value={baseFlowFactor}
              onValueChange={setBaseFlowFactor}
              min={0.0001}
              max={0.01}
              step={0.0001}
              className="mt-2"
              data-testid="slider-base-flow-factor"
            />
          </div>
          
          <div>
            <Label className="text-xs text-blue-300">Min Base Flow Depth (DLMIN): {conv.length(minBaseFlowDepth[0]).toFixed(4)} {u.length}</Label>
            <Slider
              value={minBaseFlowDepth}
              onValueChange={setMinBaseFlowDepth}
              min={0.0001}
              max={0.01}
              step={0.0001}
              className="mt-2"
              data-testid="slider-min-base-flow-depth"
            />
          </div>
          
          <div>
            <Label className="text-xs text-blue-300">Conduit Slope: {(slope[0] * 100).toFixed(2)}%</Label>
            <Slider
              value={slope}
              onValueChange={setSlope}
              min={0.001}
              max={0.05}
              step={0.001}
              className="mt-2"
              data-testid="slider-conduit-slope"
            />
          </div>
          
          <div>
            <Label className="text-xs text-blue-300">Sediment Depth: {(sedimentDepth[0] * 100).toFixed(1)}% of pipe</Label>
            <Slider
              value={sedimentDepth}
              onValueChange={setSedimentDepth}
              min={0}
              max={0.2}
              step={0.01}
              className="mt-2"
              data-testid="slider-sediment-depth"
            />
          </div>
          
          <div className="p-3 rounded bg-blue-900/30 border border-blue-700/30 space-y-1">
            <div className="text-xs font-mono text-blue-300">
              y_base = y_sed + MAX(DLMIN, DLFAC × (y_full - y_sed))
            </div>
            <div className="text-xs text-blue-200" data-testid="text-calculated-base-flow">
              Calculated: <span className="font-bold">{conv.lengthSmall(calculatedBaseFlow * 1000).toFixed(2)} {u.lengthSmall}</span>
            </div>
            <div className="text-xs text-blue-200" data-testid="text-effective-base-flow">
              With slope factor: <span className="font-bold">{conv.lengthSmall(effectiveBaseFlow * 1000).toFixed(2)} {u.lengthSmall}</span>
            </div>
            {slopeMultiplier > 1 && (
              <div className="text-xs text-yellow-400">
                Steep slope increases base flow by {((slopeMultiplier - 1) * 100).toFixed(0)}%
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center justify-center">
          <svg role="img" aria-label="Base flow stability visualization" viewBox="0 0 200 200" className="w-full max-w-[200px]">
            <defs>
              <clipPath id="pipeClip">
                <circle cx="100" cy={centerY} r={pipeRadius} />
              </clipPath>
              <linearGradient id="waterGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#0284c7" stopOpacity="0.9" />
              </linearGradient>
              <linearGradient id="sedimentGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#78716c" />
                <stop offset="100%" stopColor="#57534e" />
              </linearGradient>
            </defs>
            
            <circle cx="100" cy={centerY} r={pipeRadius} fill="none" stroke="#475569" strokeWidth="4" />
            <circle cx="100" cy={centerY} r={pipeRadius - 2} fill="#1e293b" />
            
            {sedHeight > 0 && (
              <motion.rect
                x={100 - pipeRadius}
                y={centerY + pipeRadius - sedHeight}
                width={pipeRadius * 2}
                height={sedHeight}
                fill="url(#sedimentGradient)"
                clipPath="url(#pipeClip)"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              />
            )}
            
            <motion.rect
              x={100 - pipeRadius}
              y={centerY + pipeRadius - baseFlowHeight}
              width={pipeRadius * 2}
              height={baseFlowHeight}
              fill="url(#waterGradient)"
              clipPath="url(#pipeClip)"
              initial={{ height: 0, opacity: 1 }}
              animate={{ height: Math.max(1, baseFlowHeight), opacity: 1 }}
              transition={{ duration: 0.3 }}
              data-testid="visual-base-flow"
            />
            
            <line x1="20" y1={centerY + pipeRadius} x2="180" y2={centerY + pipeRadius} stroke="#64748b" strokeWidth="1" strokeDasharray="4,4" />
            <text x="185" y={centerY + pipeRadius + 4} className="text-[8px] fill-slate-400">Invert</text>
            
            <line x1="20" y1={centerY + pipeRadius - baseFlowHeight} x2="180" y2={centerY + pipeRadius - baseFlowHeight} stroke="#06b6d4" strokeWidth="1" strokeDasharray="2,2" />
            <text x="10" y={centerY + pipeRadius - baseFlowHeight - 5} className="text-[7px] fill-cyan-400">y_base</text>
            
            <text x="100" y="195" textAnchor="middle" className="text-[8px] fill-slate-300">Virtual Wetting Film</text>
            
            <motion.g
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {[0, 1, 2].map((i) => (
                <motion.circle
                  key={i}
                  cx={70 + i * 30}
                  cy={centerY + pipeRadius - baseFlowHeight / 2}
                  r="2"
                  fill="#22d3ee"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ 
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{ 
                    duration: 2,
                    delay: i * 0.3,
                    repeat: Infinity 
                  }}
                />
              ))}
            </motion.g>
          </svg>
        </div>
      </div>
      
      <div className="mt-4 p-3 rounded bg-slate-800/50 border border-slate-700/30">
        <div className="text-xs text-slate-300">
          <strong className="text-blue-400">Key Insight:</strong> This virtual base flow prevents the solver from encountering zero-depth conditions which cause numerical instability. 
          The flow is balanced (added upstream, subtracted downstream) so it doesn't affect your results—it's purely a stabilization technique.
        </div>
      </div>
    </Card>
  );
}

export function SpatialDiscretizationDiagram() {
  const { u, conv } = useUnits();
  const [conduitLength, setConduitLength] = useState([500]);
  const [conduitWidth, setConduitWidth] = useState([2.0]);
  const [conduitHeight, setConduitHeight] = useState([1.5]);
  const [widthMultiplier, setWidthMultiplier] = useState([10]);
  const [minSpaceStep, setMinSpaceStep] = useState([5]);
  const [maxSpaceStep, setMaxSpaceStep] = useState([50]);
  
  const minDimension = Math.min(conduitWidth[0], conduitHeight[0]);
  const calculatedSpaceStep = widthMultiplier[0] * minDimension;
  const boundedSpaceStep = Math.max(minSpaceStep[0], Math.min(maxSpaceStep[0], calculatedSpaceStep));
  const numNodes = Math.max(5, Math.ceil(conduitLength[0] / boundedSpaceStep) + 1);
  const actualSpacing = conduitLength[0] / (numNodes - 1);
  
  const pipeViewWidth = 300;
  const nodePositions = Array.from({ length: numNodes }, (_, i) => 
    (i / (numNodes - 1)) * pipeViewWidth
  );
  
  return (
    <Card className="p-6 bg-gradient-to-br from-cyan-100/80 to-teal-100/80 dark:from-cyan-900/30 dark:to-teal-900/30 border-cyan-300/50 dark:border-cyan-700/30" data-testid="diagram-spatial-discretization">
      <div className="flex items-center gap-2 mb-4">
        <Grid3X3 className="h-5 w-5 text-emerald-400" />
        <h3 className="font-semibold text-lg text-cyan-800 dark:text-cyan-100">Spatial Discretization & Computational Nodes</h3>
        <Badge variant="outline" className="ml-auto text-cyan-600 dark:text-cyan-400 border-cyan-400/50">ICM Parameter</Badge>
      </div>
      
      <p className="text-sm text-muted-foreground mb-4">
        ICM divides each conduit into computational segments. More nodes = finer resolution but higher computational cost.
      </p>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <div>
            <Label className="text-xs text-emerald-300">Conduit Length: {conv.length(conduitLength[0]).toFixed(0)} {u.length}</Label>
            <Slider
              value={conduitLength}
              onValueChange={setConduitLength}
              min={50}
              max={1000}
              step={50}
              className="mt-2"
              data-testid="slider-conduit-length"
            />
          </div>
          
          <div>
            <Label className="text-xs text-emerald-300">Conduit Width: {conv.length(conduitWidth[0]).toFixed(1)} {u.length}</Label>
            <Slider
              value={conduitWidth}
              onValueChange={setConduitWidth}
              min={0.5}
              max={5}
              step={0.1}
              className="mt-2"
              data-testid="slider-conduit-width"
            />
          </div>
          
          <div>
            <Label className="text-xs text-emerald-300">Conduit Height: {conv.length(conduitHeight[0]).toFixed(1)} {u.length}</Label>
            <Slider
              value={conduitHeight}
              onValueChange={setConduitHeight}
              min={0.5}
              max={5}
              step={0.1}
              className="mt-2"
              data-testid="slider-conduit-height"
            />
          </div>
          
          <div>
            <Label className="text-xs text-emerald-300">Width Multiplier: {widthMultiplier[0]}</Label>
            <Slider
              value={widthMultiplier}
              onValueChange={setWidthMultiplier}
              min={5}
              max={20}
              step={1}
              className="mt-2"
              data-testid="slider-width-multiplier"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-xs text-emerald-300">Min Step: {conv.length(minSpaceStep[0]).toFixed(0)} {u.length}</Label>
              <Slider
                value={minSpaceStep}
                onValueChange={setMinSpaceStep}
                min={1}
                max={20}
                step={1}
                className="mt-2"
                data-testid="slider-min-space-step"
              />
            </div>
            <div>
              <Label className="text-xs text-emerald-300">Max Step: {conv.length(maxSpaceStep[0]).toFixed(0)} {u.length}</Label>
              <Slider
                value={maxSpaceStep}
                onValueChange={setMaxSpaceStep}
                min={20}
                max={100}
                step={5}
                className="mt-2"
                data-testid="slider-max-space-step"
              />
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="p-3 rounded bg-emerald-900/30 border border-emerald-700/30 space-y-1">
            <div className="text-xs font-mono text-emerald-300">
              Space Step = Multiplier × MIN(Width, Height)
            </div>
            <div className="text-xs text-emerald-200">
              Calculated: {conv.length(calculatedSpaceStep).toFixed(1)} {u.length} → Bounded: {conv.length(boundedSpaceStep).toFixed(1)} {u.length}
            </div>
            <div className="text-xs text-emerald-200" data-testid="text-num-nodes">
              <span className="font-bold text-emerald-100">{numNodes}</span> computational nodes
            </div>
            <div className="text-xs text-emerald-200" data-testid="text-actual-spacing">
              Actual spacing: <span className="font-bold">{conv.length(actualSpacing).toFixed(1)} {u.length}</span>
            </div>
          </div>
          
          <svg role="img" aria-label="ICM spatial discretization diagram" viewBox="0 0 320 100" className="w-full">
            <rect x="10" y="35" width="300" height="30" rx="5" fill="#1e3a3a" stroke="#10b981" strokeWidth="2" />
            
            {nodePositions.map((x, i) => (
              <motion.g key={i} initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}>
                <circle cx={10 + x} cy="50" r="6" fill="#ef4444" stroke="#fca5a5" strokeWidth="1" />
                <text x={10 + x} y="80" textAnchor="middle" className="text-[6px] fill-slate-400">
                  {i === 0 ? "US" : i === numNodes - 1 ? "DS" : `N${i}`}
                </text>
              </motion.g>
            ))}
            
            <text x="160" y="95" textAnchor="middle" className="text-[8px] fill-slate-300">
              {numNodes} nodes along {conv.length(conduitLength[0]).toFixed(0)} {u.length} conduit
            </text>
            
            <text x="10" y="25" className="text-[8px] fill-emerald-400">
              Width: {conv.length(conduitWidth[0]).toFixed(1)} {u.length} × Height: {conv.length(conduitHeight[0]).toFixed(1)} {u.length}
            </text>
          </svg>
          
          <div className={`p-2 rounded text-xs ${numNodes < 10 ? 'bg-yellow-900/30 text-yellow-300' : 'bg-emerald-900/30 text-emerald-300'}`}>
            {numNodes < 10 
              ? "⚠️ Low node count may reduce accuracy for wave propagation"
              : numNodes > 50 
                ? "⚠️ High node count increases computation time significantly"
                : "✓ Node count is within typical range for good accuracy"
            }
          </div>
        </div>
      </div>
    </Card>
  );
}

export function ICMPreissmannSlotDiagram() {
  const { u, conv } = useUnits();
  const [celerityRatio, setCelerityRatio] = useState([0.1]);
  const [minSlotWidth, setMinSlotWidth] = useState([0.01]);
  const [waterLevel, setWaterLevel] = useState([0.8]);
  const [showPressurized, setShowPressurized] = useState(false);
  
  const pipeArea = Math.PI * 0.5 * 0.5;
  const gravity = 9.81;
  const targetCelerity = 300;
  const calculatedSlotWidth = (gravity * pipeArea) / Math.pow(celerityRatio[0] * targetCelerity, 2);
  const effectiveSlotWidth = Math.max(minSlotWidth[0], calculatedSlotWidth);
  
  const pipeRadius = 50;
  const centerY = 80;
  const slotHeight = 40;
  const slotPixelWidth = Math.max(2, effectiveSlotWidth * 200);
  
  return (
    <Card className="p-6 bg-gradient-to-br from-blue-100/80 to-indigo-100/80 dark:from-blue-900/30 dark:to-indigo-900/30 border-blue-300/50 dark:border-blue-700/30" data-testid="diagram-preissmann-slot">
      <div className="flex items-center gap-2 mb-4">
        <Gauge className="h-5 w-5 text-purple-400" />
        <h3 className="font-semibold text-lg text-blue-800 dark:text-blue-100">Preissmann Slot & Pressurization</h3>
        <Badge variant="outline" className="ml-auto text-blue-600 dark:text-blue-400 border-blue-400/50">ICM Parameter</Badge>
      </div>
      
      <p className="text-sm text-muted-foreground mb-4">
        The Preissmann slot is a virtual narrow opening above the pipe crown that allows ICM to transition smoothly from free-surface to pressurized flow using the same equations.
      </p>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label className="text-xs text-purple-300">Celerity Ratio: {celerityRatio[0].toFixed(2)}</Label>
            <Slider
              value={celerityRatio}
              onValueChange={setCelerityRatio}
              min={0.01}
              max={0.5}
              step={0.01}
              className="mt-2"
              data-testid="slider-celerity-ratio"
            />
            <p className="text-[10px] text-purple-400 mt-1">
              Lower ratio = wider slot, more stable but adds virtual storage
            </p>
          </div>
          
          <div>
            <Label className="text-xs text-purple-300">Min Slot Width: {conv.lengthSmall(minSlotWidth[0] * 1000).toFixed(1)} {u.lengthSmall}</Label>
            <Slider
              value={minSlotWidth}
              onValueChange={setMinSlotWidth}
              min={0.001}
              max={0.05}
              step={0.001}
              className="mt-2"
              data-testid="slider-min-slot-width"
            />
          </div>
          
          <div>
            <Label className="text-xs text-purple-300">Water Level: {(waterLevel[0] * 100).toFixed(0)}% of pipe</Label>
            <Slider
              value={waterLevel}
              onValueChange={setWaterLevel}
              min={0.3}
              max={1.5}
              step={0.05}
              className="mt-2"
              data-testid="slider-water-level"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Switch
              checked={showPressurized}
              onCheckedChange={setShowPressurized}
              data-testid="switch-show-pressurized"
            />
            <Label className="text-xs text-purple-300">Show pressurized state</Label>
          </div>
          
          <div className="p-3 rounded bg-purple-900/30 border border-purple-700/30 space-y-1">
            <div className="text-xs font-mono text-purple-300">
              B_slot = g × A / (CELRAT × c)²
            </div>
            <div className="text-xs text-purple-200" data-testid="text-calculated-slot-width">
              Calculated width: <span className="font-bold">{conv.lengthSmall(calculatedSlotWidth * 1000).toFixed(2)} {u.lengthSmall}</span>
            </div>
            <div className="text-xs text-purple-200" data-testid="text-effective-slot-width">
              Effective: <span className="font-bold">{conv.lengthSmall(effectiveSlotWidth * 1000).toFixed(2)} {u.lengthSmall}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-center">
          <svg role="img" aria-label="ICM Preissmann slot visualization" viewBox="0 0 160 180" className="w-full max-w-[180px]">
            <defs>
              <clipPath id="pipeSlotClip">
                <circle cx="80" cy={centerY} r={pipeRadius} />
                <rect x={80 - slotPixelWidth / 2} y={centerY - pipeRadius - slotHeight} width={slotPixelWidth} height={slotHeight} />
              </clipPath>
              <linearGradient id="slotWaterGrad" x1="0%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#a78bfa" stopOpacity="0.7" />
              </linearGradient>
            </defs>
            
            <circle cx="80" cy={centerY} r={pipeRadius} fill="none" stroke="#6b21a8" strokeWidth="3" />
            <circle cx="80" cy={centerY} r={pipeRadius - 2} fill="#1e1b4b" />
            
            <motion.rect
              x={80 - slotPixelWidth / 2}
              y={centerY - pipeRadius - slotHeight}
              width={slotPixelWidth}
              height={slotHeight}
              fill="#1e1b4b"
              stroke="#6b21a8"
              strokeWidth="2"
              initial={{ width: 2, opacity: 1 }}
              animate={{ width: slotPixelWidth, opacity: 1 }}
              transition={{ duration: 0.3 }}
            />
            
            {(waterLevel[0] > 0.3 || showPressurized) && (
              <motion.rect
                x="30"
                y={showPressurized || waterLevel[0] > 1 
                  ? centerY - pipeRadius - slotHeight * (waterLevel[0] - 1) 
                  : centerY + pipeRadius - waterLevel[0] * pipeRadius * 2}
                width="100"
                height={showPressurized || waterLevel[0] > 1 
                  ? pipeRadius * 2 + slotHeight * (waterLevel[0] - 1)
                  : waterLevel[0] * pipeRadius * 2}
                fill="url(#slotWaterGrad)"
                clipPath="url(#pipeSlotClip)"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
            )}
            
            <line x1={80 - slotPixelWidth / 2 - 10} y1={centerY - pipeRadius} x2={80 + slotPixelWidth / 2 + 10} y2={centerY - pipeRadius} stroke="#a78bfa" strokeWidth="1" strokeDasharray="3,2" />
            <text x="130" y={centerY - pipeRadius + 4} className="text-[7px] fill-purple-400">Crown</text>
            
            <text x="80" y="170" textAnchor="middle" className="text-[8px] fill-slate-300">
              {effectiveSlotWidth > 0.02 ? "Wide Slot (Stable)" : "Narrow Slot (Accurate)"}
            </text>
            
            <motion.text
              x="80"
              y={centerY - pipeRadius - slotHeight / 2}
              textAnchor="middle"
              className="text-[6px] fill-purple-300"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {conv.lengthSmall(slotPixelWidth / 10).toFixed(1)} {u.lengthSmall}
            </motion.text>
            
            {waterLevel[0] > 1 && (
              <motion.text
                x="80"
                y="15"
                textAnchor="middle"
                className="text-[8px] fill-red-400 font-bold"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                PRESSURIZED
              </motion.text>
            )}
          </svg>
        </div>
      </div>
      
      <div className="mt-4 grid grid-cols-2 gap-2">
        <div className="p-2 rounded bg-purple-900/20 border border-purple-700/20 text-xs">
          <span className="text-purple-400 font-medium">Wide Slot:</span>
          <span className="text-slate-300 ml-1">More stable, adds virtual storage</span>
        </div>
        <div className="p-2 rounded bg-purple-900/20 border border-purple-700/20 text-xs">
          <span className="text-purple-400 font-medium">Narrow Slot:</span>
          <span className="text-slate-300 ml-1">Physically accurate, less stable</span>
        </div>
      </div>
    </Card>
  );
}

export function AdaptiveTimeSteppingDiagram() {
  const [theta, setTheta] = useState([0.7]);
  const [tolerance, setTolerance] = useState([0.001]);
  const [maxIterations, setMaxIterations] = useState([16]);
  const [maxHalvings, setMaxHalvings] = useState([10]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [currentIteration, setCurrentIteration] = useState(0);
  const [currentHalving, setCurrentHalving] = useState(0);
  const [converged, setConverged] = useState<boolean | null>(null);
  const [timestep, setTimestep] = useState(60);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  
  const runSimulation = () => {
    if (isSimulating) return;
    setIsSimulating(true);
    setCurrentIteration(0);
    setCurrentHalving(0);
    setConverged(null);
    setTimestep(60);
    
    let iter = 0;
    let halvings = 0;
    let dt = 60;
    
    intervalRef.current = setInterval(() => {
      iter++;
      setCurrentIteration(iter);
      
      const convergeChance = (1 - tolerance[0] * 100) * (theta[0] > 0.6 ? 0.7 : 0.4);
      const didConverge = Math.random() < convergeChance / maxIterations[0] * iter;
      
      if (didConverge) {
        setConverged(true);
        setIsSimulating(false);
        if (intervalRef.current) clearInterval(intervalRef.current);
      } else if (iter >= maxIterations[0]) {
        halvings++;
        setCurrentHalving(halvings);
        dt = dt / 2;
        setTimestep(dt);
        iter = 0;
        setCurrentIteration(0);
        
        if (halvings >= maxHalvings[0]) {
          setConverged(false);
          setIsSimulating(false);
          if (intervalRef.current) clearInterval(intervalRef.current);
        }
      }
    }, 200);
  };
  
  const reset = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsSimulating(false);
    setCurrentIteration(0);
    setCurrentHalving(0);
    setConverged(null);
    setTimestep(60);
  };
  
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);
  
  return (
    <Card className="p-6 bg-gradient-to-br from-sky-100/80 to-cyan-100/80 dark:from-sky-900/30 dark:to-cyan-900/30 border-sky-300/50 dark:border-sky-700/30" data-testid="diagram-adaptive-time-stepping">
      <div className="flex items-center gap-2 mb-4">
        <Timer className="h-5 w-5 text-amber-400" />
        <h3 className="font-semibold text-lg text-sky-800 dark:text-sky-100">Adaptive Time Stepping & Convergence</h3>
        <Badge variant="outline" className="ml-auto text-sky-600 dark:text-sky-400 border-sky-400/50">ICM Parameter</Badge>
      </div>
      
      <p className="text-sm text-muted-foreground mb-4">
        ICM uses Newton-Raphson iteration to solve each timestep. If it fails to converge, the timestep is halved and retried.
      </p>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <div>
            <Label className="text-xs text-amber-300">Time Weighting θ: {theta[0].toFixed(2)}</Label>
            <Slider
              value={theta}
              onValueChange={setTheta}
              min={0.5}
              max={1.0}
              step={0.05}
              className="mt-2"
              data-testid="slider-theta"
            />
            <p className="text-[10px] text-amber-400 mt-1">
              θ=0.5: Crank-Nicolson (accurate) | θ=1.0: Fully implicit (stable)
            </p>
          </div>
          
          <div>
            <Label className="text-xs text-amber-300">Convergence Tolerance: {tolerance[0].toFixed(4)}</Label>
            <Slider
              value={tolerance}
              onValueChange={setTolerance}
              min={0.0001}
              max={0.01}
              step={0.0001}
              className="mt-2"
              data-testid="slider-tolerance"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-xs text-amber-300">Max Iterations: {maxIterations[0]}</Label>
              <Slider
                value={maxIterations}
                onValueChange={setMaxIterations}
                min={4}
                max={32}
                step={1}
                className="mt-2"
                data-testid="slider-max-iterations"
              />
            </div>
            <div>
              <Label className="text-xs text-amber-300">Max Halvings: {maxHalvings[0]}</Label>
              <Slider
                value={maxHalvings}
                onValueChange={setMaxHalvings}
                min={5}
                max={20}
                step={1}
                className="mt-2"
                data-testid="slider-max-halvings"
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button
              onClick={runSimulation}
              disabled={isSimulating}
              size="sm"
              className="bg-amber-600 hover:bg-amber-700"
              data-testid="button-run-simulation"
            >
              <Play className="h-3 w-3 mr-1" />
              Simulate Timestep
            </Button>
            <Button
              onClick={reset}
              size="sm"
              variant="outline"
              data-testid="button-reset-simulation"
            >
              <RotateCcw className="h-3 w-3 mr-1" />
              Reset
            </Button>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="p-4 rounded bg-slate-900/50 border border-slate-700/30">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-amber-300">Current Timestep</span>
              <Badge variant="outline" className="font-mono" data-testid="text-current-timestep">{timestep}s</Badge>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Iteration</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-slate-800 rounded overflow-hidden">
                    <motion.div
                      className="h-full bg-amber-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${(currentIteration / maxIterations[0]) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-mono text-amber-300" data-testid="text-current-iteration">
                    {currentIteration}/{maxIterations[0]}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Halvings</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-slate-800 rounded overflow-hidden">
                    <motion.div
                      className="h-full bg-red-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${(currentHalving / maxHalvings[0]) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-mono text-red-300" data-testid="text-current-halving">
                    {currentHalving}/{maxHalvings[0]}
                  </span>
                </div>
              </div>
            </div>
            
            <AnimatePresence mode="wait">
              {converged === true && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-3 p-2 rounded bg-green-900/30 border border-green-700/30 flex items-center gap-2"
                >
                  <CheckCircle2 className="h-4 w-4 text-green-400" />
                  <span className="text-xs text-green-300" data-testid="text-converged">Converged! Timestep may double.</span>
                </motion.div>
              )}
              {converged === false && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-3 p-2 rounded bg-red-900/30 border border-red-700/30 flex items-center gap-2"
                >
                  <XCircle className="h-4 w-4 text-red-400" />
                  <span className="text-xs text-red-300" data-testid="text-failed">Simulation failed - max halvings reached!</span>
                </motion.div>
              )}
              {isSimulating && converged === null && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-3 p-2 rounded bg-amber-900/30 border border-amber-700/30 flex items-center gap-2"
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <Timer className="h-4 w-4 text-amber-400" />
                  </motion.div>
                  <span className="text-xs text-amber-300">Solving...</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <div className="text-[10px] text-slate-400 p-2 bg-slate-800/30 rounded">
            θ = {theta[0].toFixed(2)}: {theta[0] < 0.6 ? "More accurate but may oscillate" : theta[0] > 0.8 ? "Very stable, some numerical damping" : "Balanced accuracy and stability"}
          </div>
        </div>
      </div>
    </Card>
  );
}

export function HeadlossTransitionDiagram() {
  const [transitionBottom, setTransitionBottom] = useState([0.01]);
  const [transitionTop, setTransitionTop] = useState([0.05]);
  const [linearizeK, setLinearizeK] = useState(true);
  const [hoverDepth, setHoverDepth] = useState<number | null>(null);
  
  const graphWidth = 280;
  const graphHeight = 150;
  const padding = { left: 40, right: 20, top: 20, bottom: 30 };
  
  const getHeadlossFactor = (depth: number): number => {
    if (depth <= transitionBottom[0]) return 0;
    if (depth >= transitionTop[0]) return 1;
    return (depth - transitionBottom[0]) / (transitionTop[0] - transitionBottom[0]);
  };
  
  const getNonLinearFactor = (depth: number): number => {
    const n = 0.013;
    const r = depth / 2;
    const conveyance = (1 / n) * Math.pow(r, 2/3);
    return Math.min(1, conveyance / 10);
  };
  
  const depthPoints = Array.from({ length: 50 }, (_, i) => i / 49);
  
  const scaleX = (d: number) => padding.left + d * (graphWidth - padding.left - padding.right);
  const scaleY = (f: number) => graphHeight - padding.bottom - f * (graphHeight - padding.top - padding.bottom);
  
  const linearPath = depthPoints.map((d, i) => 
    `${i === 0 ? 'M' : 'L'} ${scaleX(d)} ${scaleY(getHeadlossFactor(d))}`
  ).join(' ');
  
  const nonLinearPath = depthPoints.map((d, i) => 
    `${i === 0 ? 'M' : 'L'} ${scaleX(d)} ${scaleY(getNonLinearFactor(d))}`
  ).join(' ');
  
  return (
    <Card className="p-6 bg-gradient-to-br from-blue-100/80 to-sky-100/80 dark:from-blue-900/30 dark:to-sky-900/30 border-blue-300/50 dark:border-blue-700/30" data-testid="diagram-headloss-transition">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="h-5 w-5 text-rose-400" />
        <h3 className="font-semibold text-lg text-blue-800 dark:text-blue-100">Headloss Transition Zone</h3>
        <Badge variant="outline" className="ml-auto text-blue-600 dark:text-blue-400 border-blue-400/50">ICM Parameter</Badge>
      </div>
      
      <p className="text-sm text-muted-foreground mb-4">
        ICM phases in friction headloss gradually as depth increases. This prevents unrealistically high resistance at very low depths that can stall the model.
      </p>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label className="text-xs text-rose-300">Bottom of Transition: {(transitionBottom[0] * 100).toFixed(1)}% depth</Label>
            <Slider
              value={transitionBottom}
              onValueChange={(v) => {
                if (v[0] < transitionTop[0]) setTransitionBottom(v);
              }}
              min={0}
              max={0.1}
              step={0.005}
              className="mt-2"
              data-testid="slider-transition-bottom"
            />
          </div>
          
          <div>
            <Label className="text-xs text-rose-300">Top of Transition: {(transitionTop[0] * 100).toFixed(1)}% depth</Label>
            <Slider
              value={transitionTop}
              onValueChange={(v) => {
                if (v[0] > transitionBottom[0]) setTransitionTop(v);
              }}
              min={0.02}
              max={0.2}
              step={0.005}
              className="mt-2"
              data-testid="slider-transition-top"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Switch
              checked={linearizeK}
              onCheckedChange={setLinearizeK}
              data-testid="switch-linearize-k"
            />
            <Label className="text-xs text-rose-300">Show non-linear conveyance curve</Label>
          </div>
          
          <div className="p-3 rounded bg-rose-900/30 border border-rose-700/30 space-y-1">
            <div className="text-xs text-rose-300">
              <strong>Transition Zone:</strong> {(transitionBottom[0] * 100).toFixed(1)}% → {(transitionTop[0] * 100).toFixed(1)}%
            </div>
            <div className="text-xs text-rose-200">
              Below {(transitionBottom[0] * 100).toFixed(1)}%: No friction applied
            </div>
            <div className="text-xs text-rose-200">
              Above {(transitionTop[0] * 100).toFixed(1)}%: Full friction applied
            </div>
          </div>
          
          {hoverDepth !== null && (
            <div className="p-2 rounded bg-slate-800/50 text-xs" data-testid="text-hover-info">
              At {(hoverDepth * 100).toFixed(1)}% depth: {(getHeadlossFactor(hoverDepth) * 100).toFixed(0)}% headloss applied
            </div>
          )}
        </div>
        
        <div>
          <svg role="img" aria-label="Headloss transition diagram" 
            viewBox={`0 0 ${graphWidth} ${graphHeight}`} 
            className="w-full"
            onMouseMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = (e.clientX - rect.left) / rect.width * graphWidth;
              const depth = (x - padding.left) / (graphWidth - padding.left - padding.right);
              if (depth >= 0 && depth <= 1) setHoverDepth(depth);
            }}
            onMouseLeave={() => setHoverDepth(null)}
          >
            <rect x={padding.left} y={padding.top} width={graphWidth - padding.left - padding.right} height={graphHeight - padding.top - padding.bottom} fill="#1e1e2e" />
            
            <line x1={padding.left} y1={graphHeight - padding.bottom} x2={graphWidth - padding.right} y2={graphHeight - padding.bottom} stroke="#64748b" strokeWidth="1" />
            <line x1={padding.left} y1={padding.top} x2={padding.left} y2={graphHeight - padding.bottom} stroke="#64748b" strokeWidth="1" />
            
            <text x={graphWidth / 2} y={graphHeight - 5} textAnchor="middle" className="text-[9px] fill-slate-400">Flow Depth (% of full)</text>
            <text x="12" y={graphHeight / 2} textAnchor="middle" transform={`rotate(-90 12 ${graphHeight / 2})`} className="text-[9px] fill-slate-400">Headloss Factor</text>
            
            {[0, 0.25, 0.5, 0.75, 1].map((v) => (
              <g key={v}>
                <line x1={padding.left - 3} y1={scaleY(v)} x2={padding.left} y2={scaleY(v)} stroke="#64748b" />
                <text x={padding.left - 5} y={scaleY(v) + 3} textAnchor="end" className="text-[7px] fill-slate-500">{(v * 100).toFixed(0)}%</text>
              </g>
            ))}
            
            {[0, 0.25, 0.5, 0.75, 1].map((v) => (
              <g key={v}>
                <line x1={scaleX(v)} y1={graphHeight - padding.bottom} x2={scaleX(v)} y2={graphHeight - padding.bottom + 3} stroke="#64748b" />
                <text x={scaleX(v)} y={graphHeight - padding.bottom + 12} textAnchor="middle" className="text-[7px] fill-slate-500">{(v * 100).toFixed(0)}%</text>
              </g>
            ))}
            
            <motion.rect
              x={scaleX(transitionBottom[0])}
              y={padding.top}
              width={scaleX(transitionTop[0]) - scaleX(transitionBottom[0])}
              height={graphHeight - padding.top - padding.bottom}
              fill="#f43f5e"
              fillOpacity="0.1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            />
            
            {!linearizeK && (
              <motion.path
                d={nonLinearPath}
                fill="none"
                stroke="#94a3b8"
                strokeWidth="1.5"
                strokeDasharray="4,4"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5 }}
              />
            )}
            
            <motion.path
              d={linearPath}
              fill="none"
              stroke="#f43f5e"
              strokeWidth="2"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.5 }}
            />
            
            {hoverDepth !== null && (
              <g>
                <line x1={scaleX(hoverDepth)} y1={padding.top} x2={scaleX(hoverDepth)} y2={graphHeight - padding.bottom} stroke="#f43f5e" strokeWidth="1" strokeDasharray="2,2" />
                <circle cx={scaleX(hoverDepth)} cy={scaleY(getHeadlossFactor(hoverDepth))} r="4" fill="#f43f5e" />
              </g>
            )}
            
            <g>
              <rect x={graphWidth - 100} y="5" width="90" height={linearizeK ? 30 : 45} fill="#1e1e2e" fillOpacity="0.8" rx="3" />
              <line x1={graphWidth - 95} y1="15" x2={graphWidth - 75} y2="15" stroke="#f43f5e" strokeWidth="2" />
              <text x={graphWidth - 70} y="18" className="text-[7px] fill-rose-300">Linear (ICM)</text>
              {!linearizeK && (
                <>
                  <line x1={graphWidth - 95} y1="30" x2={graphWidth - 75} y2="30" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="4,4" />
                  <text x={graphWidth - 70} y="33" className="text-[7px] fill-slate-400">Non-linear</text>
                </>
              )}
            </g>
          </svg>
        </div>
      </div>
      
      <div className="mt-4 p-3 rounded bg-slate-800/50 border border-slate-700/30">
        <div className="text-xs text-slate-300">
          <strong className="text-rose-400">Why This Matters:</strong> At very low depths, the true Manning's equation produces extremely high friction. 
          ICM's linear ramp prevents this from causing numerical instability while having minimal effect on results once depths are above the transition zone.
        </div>
      </div>
    </Card>
  );
}

export function ColdStartInitializationDiagram() {
  const { u, conv } = useUnits();
  const [phaseInTime, setPhaseInTime] = useState([300]);
  const [steadyTolFlow, setSteadyTolFlow] = useState([0.01]);
  const [steadyTolDepth, setSteadyTolDepth] = useState([0.001]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<"idle" | "ramping" | "steady" | "complete">("idle");
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  
  const startAnimation = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setProgress(0);
    setPhase("ramping");
    
    let p = 0;
    intervalRef.current = setInterval(() => {
      p += 2;
      setProgress(p);
      
      if (p >= 100) {
        setPhase("steady");
        setTimeout(() => {
          setPhase("complete");
          setIsAnimating(false);
          if (intervalRef.current) clearInterval(intervalRef.current);
        }, 1500);
        if (intervalRef.current) clearInterval(intervalRef.current);
      }
    }, phaseInTime[0] / 50);
  };
  
  const reset = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsAnimating(false);
    setProgress(0);
    setPhase("idle");
  };
  
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);
  
  return (
    <Card className="p-6 bg-gradient-to-br from-indigo-100/80 to-blue-100/80 dark:from-indigo-900/30 dark:to-blue-900/30 border-indigo-300/50 dark:border-indigo-700/30" data-testid="diagram-cold-start">
      <div className="flex items-center gap-2 mb-4">
        <Play className="h-5 w-5 text-indigo-400" />
        <h3 className="font-semibold text-lg text-indigo-800 dark:text-indigo-100">Initialization Process (Cold Start)</h3>
        <Badge variant="outline" className="ml-auto text-indigo-600 dark:text-indigo-400 border-indigo-400/50">ICM Parameter</Badge>
      </div>
      
      <p className="text-sm text-muted-foreground mb-4">
        Before the main simulation, ICM runs an initialization phase with maximum damping (θ=1.0) to find a stable starting state without numerical shock.
      </p>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label className="text-xs text-indigo-300">Phase-In Time: {phaseInTime[0]}s</Label>
            <Slider
              value={phaseInTime}
              onValueChange={setPhaseInTime}
              min={60}
              max={900}
              step={30}
              className="mt-2"
              data-testid="slider-phase-in-time"
            />
          </div>
          
          <div>
            <Label className="text-xs text-indigo-300">Steady State Flow Tolerance: {(steadyTolFlow[0] * 100).toFixed(1)}%</Label>
            <Slider
              value={steadyTolFlow}
              onValueChange={setSteadyTolFlow}
              min={0.001}
              max={0.05}
              step={0.001}
              className="mt-2"
              data-testid="slider-steady-tol-flow"
            />
          </div>
          
          <div>
            <Label className="text-xs text-indigo-300">Steady State Depth Tolerance: {conv.lengthSmall(steadyTolDepth[0] * 1000).toFixed(1)} {u.lengthSmall}</Label>
            <Slider
              value={steadyTolDepth}
              onValueChange={setSteadyTolDepth}
              min={0.0001}
              max={0.01}
              step={0.0001}
              className="mt-2"
              data-testid="slider-steady-tol-depth"
            />
          </div>
          
          <div className="flex gap-2">
            <Button
              onClick={startAnimation}
              disabled={isAnimating}
              size="sm"
              className="bg-indigo-600 hover:bg-indigo-700"
              data-testid="button-start-init"
            >
              <Play className="h-3 w-3 mr-1" />
              Run Initialization
            </Button>
            <Button
              onClick={reset}
              size="sm"
              variant="outline"
              data-testid="button-reset-init"
            >
              <RotateCcw className="h-3 w-3 mr-1" />
              Reset
            </Button>
          </div>
          
          <div className="p-3 rounded bg-indigo-900/30 border border-indigo-700/30">
            <div className="text-xs text-indigo-300 mb-2">Initialization Settings:</div>
            <div className="text-xs text-indigo-200">• Time Weighting θ = 1.0 (maximum damping)</div>
            <div className="text-xs text-indigo-200">• Boundary conditions ramp from 0 to initial</div>
            <div className="text-xs text-indigo-200">• Seeks steady-state before main simulation</div>
          </div>
        </div>
        
        <div className="space-y-4">
          <svg role="img" aria-label="Cold start initialization diagram" viewBox="0 0 300 120" className="w-full">
            <rect x="30" y="10" width="240" height="80" fill="#1e1b4b" rx="5" stroke="#4f46e5" strokeWidth="1" />
            
            <line x1="30" y1="85" x2="270" y2="85" stroke="#64748b" strokeWidth="1" />
            <line x1="30" y1="15" x2="30" y2="85" stroke="#64748b" strokeWidth="1" />
            
            <text x="150" y="105" textAnchor="middle" className="text-[8px] fill-slate-400">Time → (Phase-in: {phaseInTime[0]}s)</text>
            <text x="22" y="50" textAnchor="middle" transform="rotate(-90 22 50)" className="text-[8px] fill-slate-400">Boundary Values</text>
            
            <motion.path
              d={`M 30 85 L ${30 + progress * 2.4} ${85 - progress * 0.65}`}
              fill="none"
              stroke="#818cf8"
              strokeWidth="2"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
            />
            
            {progress === 100 && (
              <line x1={30 + 100 * 2.4} y1={85 - 100 * 0.65} x2="270" y2={85 - 100 * 0.65} stroke="#818cf8" strokeWidth="2" />
            )}
            
            <text x="35" y="80" className="text-[7px] fill-slate-500">0%</text>
            <text x="35" y="25" className="text-[7px] fill-slate-500">100%</text>
            
            <motion.circle
              cx={30 + progress * 2.4}
              cy={85 - progress * 0.65}
              r="4"
              fill="#818cf8"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
            />
            
            <line x1={30 + 100 * 2.4} y1="10" x2={30 + 100 * 2.4} y2="90" stroke="#22c55e" strokeWidth="1" strokeDasharray="4,4" />
            <text x={30 + 100 * 2.4 + 5} y="20" className="text-[7px] fill-green-400">Start Sim</text>
          </svg>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge 
                variant={phase === "ramping" ? "default" : "outline"} 
                className={phase === "ramping" ? "bg-indigo-600" : ""}
                data-testid="badge-phase-ramping"
              >
                1. Ramping
              </Badge>
              <Badge 
                variant={phase === "steady" ? "default" : "outline"}
                className={phase === "steady" ? "bg-yellow-600" : ""}
                data-testid="badge-phase-steady"
              >
                2. Steady State
              </Badge>
              <Badge 
                variant={phase === "complete" ? "default" : "outline"}
                className={phase === "complete" ? "bg-green-600" : ""}
                data-testid="badge-phase-complete"
              >
                3. Ready
              </Badge>
            </div>
            
            <div className="w-full h-3 bg-slate-800 rounded overflow-hidden">
              <motion.div
                className={`h-full ${phase === "complete" ? "bg-green-500" : phase === "steady" ? "bg-yellow-500" : "bg-indigo-500"}`}
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
              />
            </div>
            
            <AnimatePresence mode="wait">
              {phase === "complete" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-2 rounded bg-green-900/30 border border-green-700/30 flex items-center gap-2"
                >
                  <CheckCircle2 className="h-4 w-4 text-green-400" />
                  <span className="text-xs text-green-300" data-testid="text-init-complete">Initialization complete. Main simulation can begin.</span>
                </motion.div>
              )}
              {phase === "steady" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-2 rounded bg-yellow-900/30 border border-yellow-700/30 flex items-center gap-2"
                >
                  <AlertTriangle className="h-4 w-4 text-yellow-400" />
                  <span className="text-xs text-yellow-300">Finding steady state with θ=1.0...</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </Card>
  );
}

export function HeadlossJunctionDiagram() {
  const { u, conv } = useUnits();
  const [pipeAngle, setPipeAngle] = useState([90]);
  const [headlossType, setHeadlossType] = useState<"normal" | "high" | "fixed" | "fhwa">("normal");
  const [flowRate, setFlowRate] = useState([0.5]);
  const [surchargeRatio, setSurchargeRatio] = useState([0.8]);
  
  const angle = pipeAngle[0];
  const kuTable: Record<number, number> = { 30: 3.3, 45: 4.5, 60: 5.5, 90: 6.6, 120: 7.5, 150: 8.0 };
  const closestAngle = [30, 45, 60, 90, 120, 150].reduce((prev, curr) => 
    Math.abs(curr - angle) < Math.abs(prev - angle) ? curr : prev
  );
  const ku = kuTable[closestAngle];
  
  const sr = surchargeRatio[0];
  let ks = 0;
  if (headlossType === "normal" || headlossType === "high") {
    if (sr < 0.5) ks = 0.05;
    else if (sr < 1.0) ks = 0.05 + (sr - 0.5) * 1.9;
    else if (sr < 1.2) ks = 1.0 - (sr - 1.0) * 0.5;
    else ks = 0.9;
    if (headlossType === "high") ks *= 1.5;
  } else if (headlossType === "fixed") {
    ks = 1.0;
  } else {
    ks = 0.8;
  }
  
  const velocity = flowRate[0] * 2;
  const kv = Math.min(1.0, 0.5 + velocity * 0.25);
  const g = 9.81;
  const velocityHead = (velocity * velocity) / (2 * g);
  const headloss = ku * ks * kv * velocityHead;
  
  return (
    <Card className="p-6 bg-gradient-to-br from-cyan-100/80 to-sky-100/80 dark:from-cyan-900/30 dark:to-sky-900/30 border-cyan-300/50 dark:border-cyan-700/30" data-testid="diagram-headloss-junction">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="h-5 w-5 text-orange-400" />
        <h3 className="font-semibold text-lg text-cyan-800 dark:text-cyan-100">Headloss at Junction (Minor Loss Calculator)</h3>
        <Badge variant="outline" className="ml-auto text-cyan-600 dark:text-cyan-400 border-cyan-400/50">ICM Headloss</Badge>
      </div>
      
      <p className="text-sm text-muted-foreground mb-4">
        Δh = k<sub>u</sub> × k<sub>s</sub> × k<sub>v</sub> × (v²/2g) — Visualize how geometry, submergence, and velocity combine to create energy loss.
      </p>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label className="text-xs text-orange-300">Pipe Entry Angle: {pipeAngle[0]}°</Label>
            <Slider
              value={pipeAngle}
              onValueChange={setPipeAngle}
              min={30}
              max={150}
              step={1}
              className="mt-2"
              data-testid="slider-pipe-angle"
            />
            <p className="text-[10px] text-orange-400 mt-1">k<sub>u</sub> = {ku.toFixed(1)} (from angle table)</p>
          </div>
          
          <div>
            <Label className="text-xs text-orange-300">Headloss Type</Label>
            <div className="flex gap-2 mt-2 flex-wrap">
              {(["normal", "high", "fixed", "fhwa"] as const).map(type => (
                <Button
                  key={type}
                  variant={headlossType === type ? "default" : "outline"}
                  size="sm"
                  className="text-xs capitalize"
                  onClick={() => setHeadlossType(type)}
                  data-testid={`button-headloss-${type}`}
                >
                  {type}
                </Button>
              ))}
            </div>
          </div>
          
          <div>
            <Label className="text-xs text-orange-300">Flow Rate: {conv.flow(flowRate[0]).toFixed(2)} {u.flow}</Label>
            <Slider
              value={flowRate}
              onValueChange={setFlowRate}
              min={0.1}
              max={2.0}
              step={0.05}
              className="mt-2"
              data-testid="slider-flow-rate"
            />
          </div>
          
          <div>
            <Label className="text-xs text-orange-300">Surcharge Ratio: {surchargeRatio[0].toFixed(2)}</Label>
            <Slider
              value={surchargeRatio}
              onValueChange={setSurchargeRatio}
              min={0.2}
              max={1.5}
              step={0.05}
              className="mt-2"
              data-testid="slider-surcharge-ratio"
            />
            <p className="text-[10px] text-orange-400 mt-1">Depth / Pipe Height (1.0 = pipe full)</p>
          </div>
          
          <div className="p-3 rounded bg-orange-900/30 border border-orange-700/30 space-y-2">
            <div className="text-xs font-mono text-orange-300">
              Δh = {ku.toFixed(1)} × {ks.toFixed(3)} × {kv.toFixed(3)} × {velocityHead.toFixed(4)}
            </div>
            <div className="text-lg font-bold text-orange-200" data-testid="text-headloss-result">
              Headloss: {conv.lengthSmall(headloss * 1000).toFixed(2)} {u.lengthSmall}
            </div>
            <div className="grid grid-cols-3 gap-2 text-[10px] text-orange-300">
              <div>k<sub>u</sub>: {ku.toFixed(1)}</div>
              <div>k<sub>s</sub>: {ks.toFixed(3)}</div>
              <div>k<sub>v</sub>: {kv.toFixed(3)}</div>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col items-center justify-center">
          <svg role="img" aria-label="Headloss at junction diagram" viewBox="0 0 200 200" className="w-full max-w-[200px]">
            <circle cx="100" cy="100" r="30" fill="#1e293b" stroke="#f97316" strokeWidth="3" />
            <text x="100" y="105" textAnchor="middle" className="text-[8px] fill-orange-300">Junction</text>
            
            <motion.line
              x1="100"
              y1="100"
              x2={100 + 60 * Math.cos((angle - 90) * Math.PI / 180)}
              y2={100 + 60 * Math.sin((angle - 90) * Math.PI / 180)}
              stroke="#3b82f6"
              strokeWidth="12"
              strokeLinecap="round"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            />
            <text 
              x={100 + 75 * Math.cos((angle - 90) * Math.PI / 180)}
              y={100 + 75 * Math.sin((angle - 90) * Math.PI / 180)}
              textAnchor="middle"
              className="text-[7px] fill-blue-400"
            >
              In ({angle}°)
            </text>
            
            <line x1="100" y1="130" x2="100" y2="190" stroke="#22c55e" strokeWidth="12" strokeLinecap="round" />
            <text x="100" y="198" textAnchor="middle" className="text-[7px] fill-green-400">Out</text>
            
            <motion.path
              d={`M ${100 + 20 * Math.cos((angle - 90) * Math.PI / 180)} ${100 + 20 * Math.sin((angle - 90) * Math.PI / 180)} A 20 20 0 0 1 100 120`}
              fill="none"
              stroke="#fbbf24"
              strokeWidth="2"
              strokeDasharray="4,2"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.5 }}
            />
            
            <motion.circle
              cx="100"
              cy="140"
              r="3"
              fill="#ef4444"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.5, 1, 0.5], y: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <text x="115" y="145" className="text-[6px] fill-red-400">Δh</text>
          </svg>
          
          <div className="mt-4 p-2 rounded bg-slate-800 text-[10px] text-center">
            <div className="text-slate-400">Velocity Head</div>
            <div className="text-white font-mono">{conv.length(velocityHead).toFixed(4)} {u.length}</div>
          </div>
        </div>
      </div>
    </Card>
  );
}

export function HeadlossSurchargeTransitionDiagram() {
  const { u, conv } = useUnits();
  const [isPlaying, setIsPlaying] = useState(false);
  const [simTime, setSimTime] = useState(0);
  const [headlossType, setHeadlossType] = useState<"normal" | "fixed">("normal");
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  
  const maxTime = 120;
  const depthProgress = Math.min(1.5, simTime / 80);
  const surchargeRatio = depthProgress;
  
  let ks = 0;
  if (headlossType === "normal") {
    if (surchargeRatio < 0.5) ks = 0.05;
    else if (surchargeRatio < 1.0) ks = 0.05 + (surchargeRatio - 0.5) * 1.9;
    else if (surchargeRatio < 1.2) ks = 1.0 - (surchargeRatio - 1.0) * 0.5;
    else ks = 0.9;
  } else {
    ks = 1.0;
  }
  
  const velocity = 1.5 + depthProgress * 0.5;
  const g = 9.81;
  const headloss = 6.6 * ks * 0.8 * (velocity * velocity) / (2 * g);
  
  const togglePlay = () => {
    if (isPlaying) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = null;
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      intervalRef.current = setInterval(() => {
        setSimTime(prev => {
          if (prev >= maxTime) {
            if (intervalRef.current) clearInterval(intervalRef.current);
            intervalRef.current = null;
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 100);
    }
  };
  
  const reset = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = null;
    setIsPlaying(false);
    setSimTime(0);
  };
  
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);
  
  const historyPoints = Array.from({ length: Math.min(simTime, 100) }, (_, i) => {
    const t = i;
    const sr = Math.min(1.5, t / 80);
    let k = 0;
    if (headlossType === "normal") {
      if (sr < 0.5) k = 0.05;
      else if (sr < 1.0) k = 0.05 + (sr - 0.5) * 1.9;
      else if (sr < 1.2) k = 1.0 - (sr - 1.0) * 0.5;
      else k = 0.9;
    } else {
      k = 1.0;
    }
    return { x: i * 2.8, y: 80 - k * 70 };
  });
  
  return (
    <Card className="p-6 bg-gradient-to-br from-sky-100/80 to-blue-100/80 dark:from-sky-900/30 dark:to-blue-900/30 border-sky-300/50 dark:border-sky-700/30" data-testid="diagram-headloss-surcharge">
      <div className="flex items-center gap-2 mb-4">
        <Waves className="h-5 w-5 text-rose-400" />
        <h3 className="font-semibold text-lg text-sky-800 dark:text-sky-100">Headloss Type & Surcharge Transition</h3>
        <Badge variant="outline" className="ml-auto text-sky-600 dark:text-sky-400 border-sky-400/50">ICM Headloss</Badge>
      </div>
      
      <p className="text-sm text-muted-foreground mb-4">
        Observe how headloss behavior changes as flow transitions from open-channel to pressurized (surcharged).
      </p>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex gap-2">
            <Button
              variant={headlossType === "normal" ? "default" : "outline"}
              size="sm"
              onClick={() => { setHeadlossType("normal"); reset(); }}
              data-testid="button-normal-type"
            >
              Normal
            </Button>
            <Button
              variant={headlossType === "fixed" ? "default" : "outline"}
              size="sm"
              onClick={() => { setHeadlossType("fixed"); reset(); }}
              data-testid="button-fixed-type"
            >
              Fixed
            </Button>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={togglePlay} data-testid="button-play-storm">
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              {isPlaying ? "Pause" : "Play Storm"}
            </Button>
            <Button variant="outline" size="sm" onClick={reset} data-testid="button-reset-storm">
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="p-3 rounded bg-rose-900/30 border border-rose-700/30 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-rose-300">Time:</span>
              <span className="text-white font-mono">{simTime}s</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-rose-300">Surcharge Ratio:</span>
              <span className={`font-mono ${surchargeRatio >= 1 ? 'text-red-400' : 'text-green-400'}`} data-testid="text-surcharge-ratio">
                {surchargeRatio.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-rose-300">k<sub>s</sub> Coefficient:</span>
              <span className="text-white font-mono" data-testid="text-ks-value">{ks.toFixed(3)}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-rose-300">Headloss:</span>
              <span className="text-white font-mono font-bold" data-testid="text-headloss-value">{conv.lengthSmall(headloss * 1000).toFixed(1)} {u.lengthSmall}</span>
            </div>
          </div>
          
          <div className="text-[10px] text-rose-300 bg-rose-900/20 p-2 rounded">
            {headlossType === "normal" ? (
              <>For "Normal" headloss, energy loss peaks during transition to pressurization (SR ≈ 1.0), reflecting real-world turbulence at manholes during filling.</>
            ) : (
              <>For "Fixed" headloss, k<sub>s</sub> remains constant at 1.0 regardless of depth. Loss is simply proportional to v²/2g at all times.</>
            )}
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="bg-slate-900 rounded-lg p-2">
            <div className="text-[9px] text-slate-400 mb-1">k<sub>s</sub> vs Time</div>
            <svg role="img" aria-label="Headloss surcharge transition diagram" viewBox="0 0 280 100" className="w-full h-24">
              <line x1="0" y1="80" x2="280" y2="80" stroke="#475569" strokeWidth="1" />
              <line x1="0" y1="10" x2="0" y2="80" stroke="#475569" strokeWidth="1" />
              
              <line x1="0" y1="10" x2="280" y2="10" stroke="#ef4444" strokeWidth="1" strokeDasharray="4,4" strokeOpacity="0.5" />
              <text x="282" y="14" className="text-[6px] fill-red-400">k<sub>s</sub>=1.0</text>
              
              <line x1={80 * 2.8} y1="10" x2={80 * 2.8} y2="80" stroke="#fbbf24" strokeWidth="1" strokeDasharray="2,2" />
              <text x={80 * 2.8 - 20} y="95" className="text-[6px] fill-yellow-400">SR=1.0</text>
              
              {historyPoints.length > 1 && (
                <motion.path
                  d={`M ${historyPoints[0].x} ${historyPoints[0].y} ${historyPoints.map(p => `L ${p.x} ${p.y}`).join(' ')}`}
                  fill="none"
                  stroke={headlossType === "normal" ? "#f43f5e" : "#22c55e"}
                  strokeWidth="2"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                />
              )}
              
              {historyPoints.length > 0 && (
                <circle
                  cx={historyPoints[historyPoints.length - 1]?.x || 0}
                  cy={historyPoints[historyPoints.length - 1]?.y || 80}
                  r="4"
                  fill={headlossType === "normal" ? "#f43f5e" : "#22c55e"}
                />
              )}
            </svg>
          </div>
          
          <div className="relative h-20 bg-slate-800 rounded-lg overflow-hidden">
            <div className="absolute inset-x-0 bottom-0 h-full flex items-end">
              <div className="w-8 h-full bg-slate-700 border-r-2 border-slate-500 relative">
                <motion.div
                  className="absolute bottom-0 left-0 right-0 bg-blue-500/70"
                  style={{ height: `${Math.min(100, surchargeRatio * 70)}%` }}
                />
                <div className="absolute top-1 left-1 text-[7px] text-slate-400">Node</div>
              </div>
              
              <div className="flex-1 h-8 relative">
                <div className="absolute inset-0 bg-slate-600 rounded-r" />
                <motion.div
                  className="absolute bottom-0 left-0 right-0 bg-blue-500/60 rounded-r"
                  style={{ height: `${Math.min(100, surchargeRatio * 100)}%` }}
                />
                <div className="absolute top-1 right-2 text-[7px] text-slate-400">Conduit</div>
              </div>
            </div>
            {surchargeRatio >= 1 && (
              <div className="absolute top-1 left-10 text-[8px] text-red-400 font-bold">SURCHARGED</div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}

export function HeadlossInferenceDiagram() {
  const { u, conv } = useUnits();
  const [pipes, setPipes] = useState([
    { id: 1, angle: 90, diameter: 0.6, isMajor: true },
    { id: 2, angle: 45, diameter: 0.3, isMajor: false },
    { id: 3, angle: 135, diameter: 0.3, isMajor: false },
  ]);
  const [showInference, setShowInference] = useState(false);
  const [equalInverts, setEqualInverts] = useState(true);
  
  const kuTable: Record<number, number> = { 30: 3.3, 45: 4.5, 60: 5.5, 90: 6.6, 120: 7.5, 135: 7.8, 150: 8.0 };
  
  const getKu = (angle: number) => {
    const angles = Object.keys(kuTable).map(Number);
    const closest = angles.reduce((prev, curr) => 
      Math.abs(curr - angle) < Math.abs(prev - angle) ? curr : prev
    );
    return kuTable[closest];
  };
  
  const majorPipe = pipes.find(p => p.isMajor);
  const minorPipes = pipes.filter(p => !p.isMajor);
  const totalArea = pipes.reduce((sum, p) => sum + Math.PI * (p.diameter / 2) ** 2, 0);
  
  const kuMajor = majorPipe ? getKu(majorPipe.angle) : 0;
  const weightedMinorKu = minorPipes.reduce((sum, p) => {
    const area = Math.PI * (p.diameter / 2) ** 2;
    const proportion = area / totalArea;
    return sum + proportion * getKu(p.angle);
  }, 0);
  
  const totalKu = kuMajor + weightedMinorKu;
  
  const runInference = () => {
    setShowInference(true);
    const widest = [...pipes].sort((a, b) => b.diameter - a.diameter)[0];
    setPipes(pipes.map(p => ({ ...p, isMajor: p.id === widest.id })));
  };
  
  const setMajor = (id: number) => {
    setPipes(pipes.map(p => ({ ...p, isMajor: p.id === id })));
    setShowInference(false);
  };
  
  return (
    <Card className="p-6 bg-gradient-to-br from-blue-100/80 to-cyan-100/80 dark:from-blue-900/30 dark:to-cyan-900/30 border-blue-300/50 dark:border-blue-700/30" data-testid="diagram-headloss-inference">
      <div className="flex items-center gap-2 mb-4">
        <Grid3X3 className="h-5 w-5 text-teal-400" />
        <h3 className="font-semibold text-lg text-blue-800 dark:text-blue-100">Headloss Inference Tool</h3>
        <Badge variant="outline" className="ml-auto text-blue-600 dark:text-blue-400 border-blue-400/50">ICM Headloss</Badge>
      </div>
      
      <p className="text-sm text-muted-foreground mb-4">
        Explore how ICM automatically assigns k<sub>u</sub> values at complex junctions, and when manual review is needed.
      </p>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="text-sm font-medium text-teal-300">Incoming Pipes</div>
          {pipes.map(pipe => (
            <div key={pipe.id} className={`p-2 rounded border ${pipe.isMajor ? 'border-teal-500 bg-teal-900/30' : 'border-slate-600 bg-slate-800/50'}`}>
              <div className="flex items-center justify-between">
                <span className="text-xs text-teal-300">Pipe {pipe.id}</span>
                <Button
                  variant={pipe.isMajor ? "default" : "ghost"}
                  size="sm"
                  className="text-[10px] h-5"
                  onClick={() => setMajor(pipe.id)}
                  data-testid={`button-major-pipe-${pipe.id}`}
                >
                  {pipe.isMajor ? "Major" : "Set Major"}
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-2 text-[10px]">
                <div>
                  <span className="text-slate-400">Angle: </span>
                  <span className="text-white">{pipe.angle}°</span>
                </div>
                <div>
                  <span className="text-slate-400">Ø: </span>
                  <span className="text-white">{conv.length(pipe.diameter).toFixed(1)} {u.length}</span>
                </div>
                <div>
                  <span className="text-slate-400">k<sub>u</sub>: </span>
                  <span className="text-teal-400">{getKu(pipe.angle).toFixed(1)}</span>
                </div>
              </div>
            </div>
          ))}
          
          <div className="flex items-center gap-2">
            <Switch
              checked={equalInverts}
              onCheckedChange={setEqualInverts}
              data-testid="switch-equal-inverts"
            />
            <Label className="text-xs text-teal-300">Equal Inverts</Label>
          </div>
          
          {!equalInverts && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="p-2 rounded bg-yellow-900/30 border border-yellow-700/30 text-[10px] text-yellow-300"
            >
              <AlertTriangle className="h-3 w-3 inline mr-1" />
              Inference assumes equal inverts. Different inverts require manual adjustment.
            </motion.div>
          )}
          
          <Button
            variant="outline"
            size="sm"
            onClick={runInference}
            className="w-full"
            data-testid="button-run-inference"
          >
            Run Inference
          </Button>
          
          {showInference && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-2 rounded bg-teal-900/30 border border-teal-700/30 text-[10px] text-teal-300"
            >
              <CheckCircle2 className="h-3 w-3 inline mr-1 text-teal-400" />
              Inference selected widest pipe (Ø{conv.length(Math.max(...pipes.map(p => p.diameter))).toFixed(1)} {u.length}) as major branch.
              <p className="mt-1 text-slate-400 italic">Note: Does not account for multiple branches or unequal inverts.</p>
            </motion.div>
          )}
        </div>
        
        <div className="space-y-4">
          <svg role="img" aria-label="Headloss inference diagram" viewBox="0 0 200 200" className="w-full max-w-[200px] mx-auto">
            <circle cx="100" cy="100" r="25" fill="#1e293b" stroke="#14b8a6" strokeWidth="3" />
            <text x="100" y="105" textAnchor="middle" className="text-[7px] fill-teal-300">Manhole</text>
            
            {pipes.map(pipe => {
              const rad = (pipe.angle - 90) * Math.PI / 180;
              const x2 = 100 + 70 * Math.cos(rad);
              const y2 = 100 + 70 * Math.sin(rad);
              const strokeWidth = pipe.diameter * 20;
              return (
                <g key={pipe.id}>
                  <motion.line
                    x1="100"
                    y1="100"
                    x2={x2}
                    y2={y2}
                    stroke={pipe.isMajor ? "#14b8a6" : "#64748b"}
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  />
                  <text
                    x={100 + 85 * Math.cos(rad)}
                    y={100 + 85 * Math.sin(rad)}
                    textAnchor="middle"
                    className={`text-[7px] ${pipe.isMajor ? 'fill-teal-400' : 'fill-slate-400'}`}
                  >
                    {pipe.angle}°
                  </text>
                </g>
              );
            })}
            
            <line x1="100" y1="125" x2="100" y2="190" stroke="#22c55e" strokeWidth="12" strokeLinecap="round" />
            <text x="100" y="198" textAnchor="middle" className="text-[7px] fill-green-400">Out</text>
          </svg>
          
          <div className="p-3 rounded bg-teal-900/30 border border-teal-700/30 space-y-2">
            <div className="text-xs font-medium text-teal-300">Calculated k<sub>u</sub></div>
            <div className="text-xs text-slate-400">
              k<sub>u</sub> = k<sub>u,major</sub> + Σ(proportion × k<sub>u,minor</sub>)
            </div>
            <div className="text-xs font-mono text-white">
              = {kuMajor.toFixed(1)} + {weightedMinorKu.toFixed(2)}
            </div>
            <div className="text-lg font-bold text-teal-200" data-testid="text-total-ku">
              Total k<sub>u</sub>: {totalKu.toFixed(2)}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

export function InfoSewerSteadyStateEmulationDiagram() {
  const { u } = useUnits();
  const [peakingFormula, setPeakingFormula] = useState<"federov" | "babbitt" | "harman">("federov");
  const [runDuration, setRunDuration] = useState([30]);
  const [loadType, setLoadType] = useState<"base" | "coverage">("base");
  const [showComparison, setShowComparison] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  
  const formulas = {
    federov: { name: "Federov", formula: "PF = K / Q^r", params: "K=2.4, r=0.89", factor: 2.8 },
    babbitt: { name: "Babbitt", formula: "PF = 5 / P^0.2", params: "P = Population (1000s)", factor: 2.5 },
    harman: { name: "Harman", formula: "PF = (18 + √P) / (4 + √P)", params: "P = Population (1000s)", factor: 3.2 },
  };
  
  const sampleResults = [
    { link: "P-101", infosewer: 45.2, icm: 44.8, diff: -0.9 },
    { link: "P-102", infosewer: 32.1, icm: 31.9, diff: -0.6 },
    { link: "P-103", infosewer: 78.5, icm: 77.8, diff: -0.9 },
    { link: "P-104", infosewer: 56.3, icm: 55.9, diff: -0.7 },
  ];
  
  return (
    <Card className="p-6 bg-gradient-to-br from-amber-100/80 to-orange-100/80 dark:from-amber-900/30 dark:to-orange-900/30 border-amber-300/50 dark:border-amber-700/30" data-testid="diagram-infosewer-steady-state">
      <div className="flex items-center gap-2 mb-4">
        <Gauge className="h-5 w-5 text-amber-500" />
        <h3 className="font-semibold text-lg text-amber-800 dark:text-amber-100">Emulating InfoSewer Steady State in ICM</h3>
        <Badge variant="outline" className="ml-auto text-amber-600 dark:text-amber-400 border-amber-400/50">Model Translation</Badge>
      </div>
      
      <p className="text-sm text-muted-foreground mb-4">
        ICM has no native steady-state solver. To match InfoSewer's peak-load snapshot, pre-peak the loads externally and run a very short EPS with constant inflows.
      </p>
      
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* InfoSewer Workflow */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-2">
            <Badge className="bg-blue-600">InfoSewer Native</Badge>
          </div>
          
          <div className="space-y-2">
            <motion.div 
              className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/40 border-2 border-blue-300 dark:border-blue-700"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0 }}
            >
              <div className="text-xs font-semibold text-blue-700 dark:text-blue-300 mb-1">1. Inputs</div>
              <div className="text-xs text-blue-600 dark:text-blue-400">DWF loads at manholes</div>
            </motion.div>
            
            <div className="flex justify-center">
              <TrendingUp className="w-4 h-4 text-blue-400" />
            </div>
            
            <motion.div 
              className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/40 border-2 border-blue-300 dark:border-blue-700"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="text-xs font-semibold text-blue-700 dark:text-blue-300 mb-1">2. Peaking Engine</div>
              <div className="text-xs text-blue-600 dark:text-blue-400">Applies {formulas[peakingFormula].name} formula</div>
              <div className="text-[10px] font-mono text-blue-500 mt-1">{formulas[peakingFormula].formula}</div>
            </motion.div>
            
            <div className="flex justify-center">
              <TrendingUp className="w-4 h-4 text-blue-400" />
            </div>
            
            <motion.div 
              className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/40 border-2 border-blue-300 dark:border-blue-700"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="text-xs font-semibold text-blue-700 dark:text-blue-300 mb-1">3. Steady-State Solver</div>
              <div className="text-xs text-blue-600 dark:text-blue-400">Single equilibrium snapshot</div>
            </motion.div>
            
            <div className="flex justify-center">
              <TrendingUp className="w-4 h-4 text-blue-400" />
            </div>
            
            <motion.div 
              className="p-3 rounded-lg bg-green-100 dark:bg-green-900/40 border-2 border-green-300 dark:border-green-700"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="text-xs font-semibold text-green-700 dark:text-green-300">Output</div>
              <div className="text-xs text-green-600 dark:text-green-400">Peak flows, velocities, depths</div>
            </motion.div>
          </div>
        </div>
        
        {/* ICM Emulation Workflow */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-2">
            <Badge className="bg-teal-600">ICM Emulation</Badge>
          </div>
          
          <div className="space-y-2">
            <motion.div 
              className="p-3 rounded-lg bg-teal-100 dark:bg-teal-900/40 border-2 border-teal-300 dark:border-teal-700"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0 }}
            >
              <div className="text-xs font-semibold text-teal-700 dark:text-teal-300 mb-1">A. Input Translation</div>
              <div className="text-xs text-teal-600 dark:text-teal-400">Export peaked loads from InfoSewer</div>
            </motion.div>
            
            <div className="flex justify-center">
              <TrendingUp className="w-4 h-4 text-teal-400" />
            </div>
            
            <motion.div 
              className="p-3 rounded-lg bg-teal-100 dark:bg-teal-900/40 border-2 border-teal-300 dark:border-teal-700"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="text-xs font-semibold text-teal-700 dark:text-teal-300 mb-1">B. Load Assignment</div>
              <div className="text-xs text-teal-600 dark:text-teal-400">DWF <span className="font-bold">without pattern</span> (constant)</div>
            </motion.div>
            
            <div className="flex justify-center">
              <TrendingUp className="w-4 h-4 text-teal-400" />
            </div>
            
            <motion.div 
              className="p-3 rounded-lg bg-teal-100 dark:bg-teal-900/40 border-2 border-teal-300 dark:border-teal-700"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="text-xs font-semibold text-teal-700 dark:text-teal-300 mb-1">C. Short EPS Run</div>
              <div className="text-xs text-teal-600 dark:text-teal-400">Duration: {runDuration[0]}s with initialization</div>
            </motion.div>
            
            <div className="flex justify-center">
              <TrendingUp className="w-4 h-4 text-teal-400" />
            </div>
            
            <motion.div 
              className="p-3 rounded-lg bg-green-100 dark:bg-green-900/40 border-2 border-green-300 dark:border-green-700"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="text-xs font-semibold text-green-700 dark:text-green-300">Output</div>
              <div className="text-xs text-green-600 dark:text-green-400">Final timestep ≈ Steady-State</div>
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* Controls */}
      <div className="grid md:grid-cols-3 gap-4 p-4 bg-slate-100 dark:bg-slate-800/50 rounded-lg mb-4">
        <div className="space-y-2">
          <Label className="text-xs font-medium">Peaking Formula</Label>
          <div className="flex gap-1">
            {(["federov", "babbitt", "harman"] as const).map(f => (
              <Button
                key={f}
                size="sm"
                variant={peakingFormula === f ? "default" : "outline"}
                onClick={() => setPeakingFormula(f)}
                className="text-xs flex-1"
                data-testid={`btn-formula-${f}`}
              >
                {formulas[f].name}
              </Button>
            ))}
          </div>
          <div className="text-[10px] font-mono text-muted-foreground">
            {formulas[peakingFormula].params}
          </div>
        </div>
        
        <div className="space-y-2">
          <Label className="text-xs font-medium">Short-Run Duration: {runDuration[0]}s</Label>
          <Slider
            value={runDuration}
            onValueChange={setRunDuration}
            min={1}
            max={300}
            step={1}
            data-testid="slider-run-duration"
          />
          <div className="text-[10px] text-muted-foreground">
            {runDuration[0] < 30 ? "Very quick stabilization" : runDuration[0] < 120 ? "Balanced run time" : "Extended stabilization"}
          </div>
        </div>
        
        <div className="space-y-2">
          <Label className="text-xs font-medium">Load Type</Label>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={loadType === "base" ? "default" : "outline"}
              onClick={() => setLoadType("base")}
              className="text-xs flex-1"
              data-testid="btn-load-base"
            >
              Peakable Base Flow
            </Button>
            <Button
              size="sm"
              variant={loadType === "coverage" ? "default" : "outline"}
              onClick={() => setLoadType("coverage")}
              className="text-xs flex-1"
              data-testid="btn-load-coverage"
            >
              Coverage Flow
            </Button>
          </div>
          <div className="text-[10px] text-muted-foreground">
            {loadType === "base" ? "Flow-based peaking" : "Population-based peaking"}
          </div>
        </div>
      </div>
      
      {/* Comparison */}
      <Button 
        onClick={() => setShowComparison(!showComparison)} 
        variant="outline" 
        size="sm"
        className="mb-4"
        data-testid="btn-run-comparison"
      >
        {showComparison ? "Hide" : "Run"} Comparison
      </Button>
      
      <AnimatePresence>
        {showComparison && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4 bg-slate-100 dark:bg-slate-800/50 rounded-lg">
              <div className="text-sm font-medium mb-3">Sample Network Results Comparison</div>
              <div className="grid grid-cols-4 gap-2 text-xs font-medium mb-2">
                <div>Link</div>
                <div>InfoSewer ({u.flowSmall})</div>
                <div>ICM ({u.flowSmall})</div>
                <div>Diff (%)</div>
              </div>
              {sampleResults.map((r, i) => (
                <motion.div
                  key={r.link}
                  className="grid grid-cols-4 gap-2 text-xs py-1 border-t border-slate-200 dark:border-slate-700"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div className="font-mono">{r.link}</div>
                  <div>{r.infosewer.toFixed(1)}</div>
                  <div>{r.icm.toFixed(1)}</div>
                  <div className={r.diff < 0 ? "text-amber-600" : "text-green-600"}>{r.diff.toFixed(1)}%</div>
                </motion.div>
              ))}
              <div className="mt-3 p-2 bg-green-100 dark:bg-green-900/30 rounded text-xs text-green-700 dark:text-green-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Results within 1% tolerance - emulation successful
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="mt-4 p-3 bg-amber-100 dark:bg-amber-900/30 rounded-lg border border-amber-300 dark:border-amber-700/50">
        <div className="text-xs font-semibold text-amber-700 dark:text-amber-300 mb-1">Key Insights</div>
        <ul className="text-xs text-amber-600 dark:text-amber-400 space-y-1 list-disc list-inside">
          <li>ICM's initialization phase is effectively a steady-state solution</li>
          <li>Peaking must be pre-computed externally (ICM doesn't apply peaking formulas)</li>
          <li>DWF without pattern keeps inflows constant throughout the short run</li>
          <li>Always validate key results between models to ensure emulation accuracy</li>
        </ul>
      </div>
    </Card>
  );
}
