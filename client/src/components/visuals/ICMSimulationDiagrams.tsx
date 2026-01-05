import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";
import { Droplets, Grid3X3, Gauge, Timer, TrendingUp, Play, RotateCcw, CheckCircle2, XCircle, AlertTriangle } from "lucide-react";

export function BaseFlowStabilityDiagram() {
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
    <Card className="p-6 bg-gradient-to-br from-blue-950/50 to-cyan-950/50 border-blue-800/30" data-testid="diagram-base-flow-stability">
      <div className="flex items-center gap-2 mb-4">
        <Droplets className="h-5 w-5 text-blue-400" />
        <h3 className="font-semibold text-lg text-blue-100">Base Flow for Numerical Stability</h3>
        <Badge variant="outline" className="ml-auto text-blue-400 border-blue-400/30">ICM Parameter</Badge>
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
            <Label className="text-xs text-blue-300">Min Base Flow Depth (DLMIN): {minBaseFlowDepth[0].toFixed(4)} m</Label>
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
              Calculated: <span className="font-bold">{(calculatedBaseFlow * 1000).toFixed(2)} mm</span>
            </div>
            <div className="text-xs text-blue-200" data-testid="text-effective-base-flow">
              With slope factor: <span className="font-bold">{(effectiveBaseFlow * 1000).toFixed(2)} mm</span>
            </div>
            {slopeMultiplier > 1 && (
              <div className="text-xs text-yellow-400">
                Steep slope increases base flow by {((slopeMultiplier - 1) * 100).toFixed(0)}%
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center justify-center">
          <svg viewBox="0 0 200 200" className="w-full max-w-[200px]">
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
    <Card className="p-6 bg-gradient-to-br from-emerald-950/50 to-teal-950/50 border-emerald-800/30" data-testid="diagram-spatial-discretization">
      <div className="flex items-center gap-2 mb-4">
        <Grid3X3 className="h-5 w-5 text-emerald-400" />
        <h3 className="font-semibold text-lg text-emerald-100">Spatial Discretization & Computational Nodes</h3>
        <Badge variant="outline" className="ml-auto text-emerald-400 border-emerald-400/30">ICM Parameter</Badge>
      </div>
      
      <p className="text-sm text-muted-foreground mb-4">
        ICM divides each conduit into computational segments. More nodes = finer resolution but higher computational cost.
      </p>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <div>
            <Label className="text-xs text-emerald-300">Conduit Length: {conduitLength[0]} m</Label>
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
            <Label className="text-xs text-emerald-300">Conduit Width: {conduitWidth[0].toFixed(1)} m</Label>
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
            <Label className="text-xs text-emerald-300">Conduit Height: {conduitHeight[0].toFixed(1)} m</Label>
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
              <Label className="text-xs text-emerald-300">Min Step: {minSpaceStep[0]} m</Label>
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
              <Label className="text-xs text-emerald-300">Max Step: {maxSpaceStep[0]} m</Label>
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
              Calculated: {calculatedSpaceStep.toFixed(1)} m → Bounded: {boundedSpaceStep.toFixed(1)} m
            </div>
            <div className="text-xs text-emerald-200" data-testid="text-num-nodes">
              <span className="font-bold text-emerald-100">{numNodes}</span> computational nodes
            </div>
            <div className="text-xs text-emerald-200" data-testid="text-actual-spacing">
              Actual spacing: <span className="font-bold">{actualSpacing.toFixed(1)} m</span>
            </div>
          </div>
          
          <svg viewBox="0 0 320 100" className="w-full">
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
              {numNodes} nodes along {conduitLength[0]}m conduit
            </text>
            
            <text x="10" y="25" className="text-[8px] fill-emerald-400">
              Width: {conduitWidth[0].toFixed(1)}m × Height: {conduitHeight[0].toFixed(1)}m
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
    <Card className="p-6 bg-gradient-to-br from-purple-950/50 to-violet-950/50 border-purple-800/30" data-testid="diagram-preissmann-slot">
      <div className="flex items-center gap-2 mb-4">
        <Gauge className="h-5 w-5 text-purple-400" />
        <h3 className="font-semibold text-lg text-purple-100">Preissmann Slot & Pressurization</h3>
        <Badge variant="outline" className="ml-auto text-purple-400 border-purple-400/30">ICM Parameter</Badge>
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
            <Label className="text-xs text-purple-300">Min Slot Width: {(minSlotWidth[0] * 1000).toFixed(1)} mm</Label>
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
              Calculated width: <span className="font-bold">{(calculatedSlotWidth * 1000).toFixed(2)} mm</span>
            </div>
            <div className="text-xs text-purple-200" data-testid="text-effective-slot-width">
              Effective: <span className="font-bold">{(effectiveSlotWidth * 1000).toFixed(2)} mm</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-center">
          <svg viewBox="0 0 160 180" className="w-full max-w-[180px]">
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
              {(slotPixelWidth / 10).toFixed(1)}mm
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
    <Card className="p-6 bg-gradient-to-br from-amber-950/50 to-orange-950/50 border-amber-800/30" data-testid="diagram-adaptive-time-stepping">
      <div className="flex items-center gap-2 mb-4">
        <Timer className="h-5 w-5 text-amber-400" />
        <h3 className="font-semibold text-lg text-amber-100">Adaptive Time Stepping & Convergence</h3>
        <Badge variant="outline" className="ml-auto text-amber-400 border-amber-400/30">ICM Parameter</Badge>
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
    <Card className="p-6 bg-gradient-to-br from-rose-950/50 to-pink-950/50 border-rose-800/30" data-testid="diagram-headloss-transition">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="h-5 w-5 text-rose-400" />
        <h3 className="font-semibold text-lg text-rose-100">Headloss Transition Zone</h3>
        <Badge variant="outline" className="ml-auto text-rose-400 border-rose-400/30">ICM Parameter</Badge>
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
          <svg 
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
    <Card className="p-6 bg-gradient-to-br from-indigo-950/50 to-blue-950/50 border-indigo-800/30" data-testid="diagram-cold-start">
      <div className="flex items-center gap-2 mb-4">
        <Play className="h-5 w-5 text-indigo-400" />
        <h3 className="font-semibold text-lg text-indigo-100">Initialization Process (Cold Start)</h3>
        <Badge variant="outline" className="ml-auto text-indigo-400 border-indigo-400/30">ICM Parameter</Badge>
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
            <Label className="text-xs text-indigo-300">Steady State Depth Tolerance: {(steadyTolDepth[0] * 1000).toFixed(1)}mm</Label>
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
          <svg viewBox="0 0 300 120" className="w-full">
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
