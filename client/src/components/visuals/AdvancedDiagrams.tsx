import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useUnits } from "@/contexts/UnitsContext";
import { 
  Activity, 
  Droplets, 
  Gauge, 
  Waves, 
  Calculator,
  RefreshCcw,
  Play,
  Pause,
  RotateCcw,
  CheckCircle,
  AlertTriangle,
  Zap
} from "lucide-react";

export function ConvergenceSnapshotsDiagram() {
  const { u, conv } = useUnits();
  const [iteration, setIteration] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [converged, setConverged] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const inflow = 0.5;
  
  const iterations = [
    { H: "NaN", Q1: "NaN", Q2: "NaN", residual: 1.0 },
    { H: 2.8, Q1: 0.32, Q2: 0.18, residual: 0.42 },
    { H: 3.15, Q1: 0.28, Q2: 0.24, residual: 0.15 },
    { H: 3.08, Q1: 0.255, Q2: 0.248, residual: 0.04 },
    { H: 3.05, Q1: 0.251, Q2: 0.249, residual: 0.008 },
    { H: 3.04, Q1: 0.2502, Q2: 0.2498, residual: 0.001 },
  ];
  
  const currentState = iterations[Math.min(iteration, iterations.length - 1)];
  
  const solve = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setIteration(0);
    setConverged(false);
    
    let step = 0;
    intervalRef.current = setInterval(() => {
      step++;
      setIteration(step);
      if (step >= iterations.length - 1) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        intervalRef.current = null;
        setIsAnimating(false);
        setConverged(true);
      }
    }, 800);
  };
  
  const reset = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = null;
    setIsAnimating(false);
    setIteration(0);
    setConverged(false);
  };
  
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <Card className="border-2 border-purple-500/30 bg-gradient-to-br from-purple-500/5 to-background">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Calculator className="h-5 w-5 text-purple-500" />
          Convergence Iteration Snapshots
          <Badge variant="outline" className="ml-auto text-purple-600 border-purple-500">ICM Newton-Raphson</Badge>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Watch ICM's iterative solver converge on a solution for a single timestep
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="relative h-72 bg-muted/30 rounded-lg border border-border overflow-hidden">
            <svg role="img" aria-label="Convergence snapshots visualization" className="w-full h-full" viewBox="0 0 200 180" aria-hidden="true">
              <rect x="0" y="0" width="200" height="180" className="fill-slate-950/30" />
              
              <line x1="20" y1="90" x2="80" y2="90" className="stroke-slate-400 stroke-[8]" strokeLinecap="round" />
              <text x="50" y="75" textAnchor="middle" className="text-[8px] fill-slate-400">Pipe 1</text>
              
              <line x1="120" y1="90" x2="180" y2="90" className="stroke-slate-400 stroke-[8]" strokeLinecap="round" />
              <text x="150" y="75" textAnchor="middle" className="text-[8px] fill-slate-400">Pipe 2</text>
              
              <motion.circle 
                cx="100" cy="90" r="18" 
                className="fill-purple-500/20 stroke-purple-500 stroke-2"
                animate={isAnimating ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 0.4, repeat: Infinity }}
              />
              <text x="100" y="94" textAnchor="middle" className="text-[10px] fill-purple-400 font-bold">Node</text>
              
              <g>
                <path d="M 20 60 L 20 90" className="stroke-blue-400 stroke-2" markerEnd="url(#arrowBlue)" />
                <text x="20" y="50" textAnchor="middle" className="text-[8px] fill-blue-400">
                  Q_in={inflow}
                </text>
              </g>
              
              <defs>
                <marker id="arrowBlue" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
                  <path d="M0,0 L6,3 L0,6 Z" className="fill-blue-400" />
                </marker>
              </defs>
              
              <g transform="translate(10, 115)">
                <rect x="0" y="0" width="180" height="55" rx="4" className="fill-background/80 stroke-border" />
                <text x="90" y="14" textAnchor="middle" className="text-[9px] fill-muted-foreground font-semibold">
                  Iteration {iteration === 0 && !converged ? "—" : iteration}
                </text>
                
                <text x="15" y="30" className="text-[8px] fill-muted-foreground">H =</text>
                <text x="35" y="30" className="text-[10px] fill-purple-400 font-mono" data-testid="text-convergence-h">
                  {currentState.H === "NaN" ? "?" : Number(currentState.H).toFixed(2)}
                </text>
                <text x="60" y="30" className="text-[6px] fill-muted-foreground">{u.length}</text>
                
                <text x="80" y="30" className="text-[8px] fill-muted-foreground">Q1 =</text>
                <text x="105" y="30" className="text-[10px] fill-blue-400 font-mono" data-testid="text-convergence-q1">
                  {currentState.Q1 === "NaN" ? "?" : Number(currentState.Q1).toFixed(3)}
                </text>
                <text x="130" y="30" className="text-[6px] fill-muted-foreground">{u.flow}</text>
                
                <text x="145" y="30" className="text-[8px] fill-muted-foreground">Q2 =</text>
                <text x="168" y="30" className="text-[10px] fill-emerald-400 font-mono" data-testid="text-convergence-q2">
                  {currentState.Q2 === "NaN" ? "?" : Number(currentState.Q2).toFixed(3)}
                </text>
                
                <text x="15" y="48" className="text-[8px] fill-muted-foreground">Residual:</text>
                <rect x="55" y="40" width={100 * currentState.residual} height="10" rx="2" className="fill-red-500/70" />
                <rect x="55" y="40" width="100" height="10" rx="2" className="fill-none stroke-red-500/30" />
                <text x="160" y="48" className="text-[8px] fill-red-400 font-mono" data-testid="text-convergence-residual">
                  {currentState.residual.toFixed(3)}
                </text>
              </g>
            </svg>
            
            <div className={`absolute top-2 right-2 text-[9px] font-mono px-2 py-1 rounded border ${
              converged ? "bg-emerald-500/20 border-emerald-500 text-emerald-600" :
              isAnimating ? "bg-purple-500/20 border-purple-500 text-purple-600" :
              "bg-slate-500/20 border-slate-500 text-slate-600"
            }`} data-testid="text-convergence-status">
              {converged ? "Converged!" : isAnimating ? "Iterating..." : "Ready"}
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex gap-2">
              <Button 
                onClick={solve} 
                disabled={isAnimating}
                className="flex-1"
                data-testid="button-solve-timestep"
              >
                <Play className="h-4 w-4 mr-2" />
                Solve This Timestep
              </Button>
              <Button 
                variant="outline" 
                onClick={reset}
                data-testid="button-reset-convergence"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-3 text-xs space-y-2">
              <h4 className="font-semibold text-purple-600 dark:text-purple-400 flex items-center gap-2">
                <Calculator className="h-4 w-4" />
                ICM Newton-Raphson Method
              </h4>
              <ul className="text-muted-foreground space-y-1">
                <li>• Builds Jacobian matrix of all equations</li>
                <li>• Solves simultaneously for all unknowns</li>
                <li>• Quadratic convergence near solution</li>
                <li>• More stable for ill-conditioned networks</li>
              </ul>
            </div>
            
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 text-xs space-y-2">
              <h4 className="font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                <RefreshCcw className="h-4 w-4" />
                SWMM5 Successive Relaxation
              </h4>
              <ul className="text-muted-foreground space-y-1">
                <li>• Solves nodes one at a time</li>
                <li>• Uses under-relaxation factors (0.5–1.0)</li>
                <li>• Linear convergence rate</li>
                <li>• May need more iterations for complex systems</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function MassBalanceErrorDiagram() {
  const { u, conv } = useUnits();
  const [tolerance, setTolerance] = useState([0.001]);
  const [routeStep, setRouteStep] = useState([30]);
  const [dryDepth, setDryDepth] = useState([0.001]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [time, setTime] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const tol = tolerance[0];
  const step = routeStep[0];
  const dry = dryDepth[0];
  
  const errorFactor = (tol * 100 + step / 60 + dry * 50) / 10;
  
  const stormProgress = Math.min(time / 100, 1);
  const inflow = Math.sin(stormProgress * Math.PI) * 100;
  const outflow = Math.sin(Math.max(0, stormProgress - 0.1) * Math.PI) * 95;
  const storage = Math.max(0, (inflow - outflow) * 0.5);
  const massError = errorFactor * stormProgress * 5;
  
  const simulateStorm = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setTime(0);
    
    intervalRef.current = setInterval(() => {
      setTime(prev => {
        if (prev >= 100) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          intervalRef.current = null;
          setIsAnimating(false);
          return 100;
        }
        return prev + 2;
      });
    }, 100);
  };
  
  const reset = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = null;
    setIsAnimating(false);
    setTime(0);
  };
  
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <Card className="border-2 border-red-500/30 bg-gradient-to-br from-red-500/5 to-background">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Gauge className="h-5 w-5 text-red-500" />
          Mass Balance Error Tracker
          <Badge variant="outline" className="ml-auto text-red-600 border-red-500">Diagnostic Tool</Badge>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Visualize how solver settings affect cumulative mass balance error
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="relative h-72 bg-muted/30 rounded-lg border border-border overflow-hidden p-4">
            <div className="text-xs text-muted-foreground mb-2 text-center">
              Water Balance: (Initial + Inflow) = (Final + Outflow) ± Error
            </div>
            
            <div className="flex items-end justify-center gap-4 h-48">
              <div className="flex flex-col items-center">
                <motion.div 
                  className="w-12 bg-blue-500 rounded-t"
                  style={{ height: `${inflow * 1.5}px` }}
                  data-testid="bar-inflow"
                />
                <span className="text-[10px] text-blue-500 mt-1">Inflow</span>
                <span className="text-[9px] font-mono text-muted-foreground">{inflow.toFixed(0)}</span>
              </div>
              
              <div className="flex flex-col items-center">
                <motion.div 
                  className="w-12 bg-emerald-500 rounded-t"
                  style={{ height: `${outflow * 1.5}px` }}
                  data-testid="bar-outflow"
                />
                <span className="text-[10px] text-emerald-500 mt-1">Outflow</span>
                <span className="text-[9px] font-mono text-muted-foreground">{outflow.toFixed(0)}</span>
              </div>
              
              <div className="flex flex-col items-center">
                <motion.div 
                  className="w-12 bg-amber-500 rounded-t"
                  style={{ height: `${storage * 3}px` }}
                  data-testid="bar-storage"
                />
                <span className="text-[10px] text-amber-500 mt-1">Storage</span>
                <span className="text-[9px] font-mono text-muted-foreground">{storage.toFixed(0)}</span>
              </div>
              
              <div className="flex flex-col items-center">
                <motion.div 
                  className="w-12 bg-red-500 rounded-t"
                  style={{ height: `${massError * 10}px` }}
                  animate={massError > 3 ? { opacity: [1, 0.5, 1] } : {}}
                  transition={{ duration: 0.5, repeat: Infinity }}
                  data-testid="bar-mass-error"
                />
                <span className="text-[10px] text-red-500 mt-1">Error</span>
                <span className="text-[9px] font-mono text-muted-foreground">{massError.toFixed(2)}%</span>
              </div>
            </div>
            
            <div className="absolute bottom-2 left-2 right-2">
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 transition-all duration-100"
                  style={{ width: `${stormProgress * 100}%` }}
                />
              </div>
              <div className="text-[9px] text-center mt-1 text-muted-foreground">Storm Progress: {(stormProgress * 100).toFixed(0)}%</div>
            </div>
            
            <div className={`absolute top-2 right-2 text-[9px] font-mono px-2 py-1 rounded border ${
              massError > 3 ? "bg-red-500/20 border-red-500 text-red-600" :
              massError > 1 ? "bg-amber-500/20 border-amber-500 text-amber-600" :
              "bg-emerald-500/20 border-emerald-500 text-emerald-600"
            }`} data-testid="text-mass-balance-status">
              {massError > 3 ? "High Error!" : massError > 1 ? "Moderate" : "Acceptable"}
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex gap-2">
              <Button 
                onClick={simulateStorm} 
                disabled={isAnimating}
                className="flex-1"
                data-testid="button-simulate-storm"
              >
                <Droplets className="h-4 w-4 mr-2" />
                Simulate Storm
              </Button>
              <Button 
                variant="outline" 
                onClick={reset}
                data-testid="button-reset-mass-balance"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-3">
              <div className="space-y-2">
                <Label className="text-sm">Numerical Tolerance: <span className="font-mono text-primary">{tol}</span></Label>
                <Slider
                  value={tolerance}
                  onValueChange={setTolerance}
                  min={0.0001}
                  max={0.01}
                  step={0.0001}
                  data-testid="slider-tolerance"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm">Route Step: <span className="font-mono text-primary">{step}s</span></Label>
                <Slider
                  value={routeStep}
                  onValueChange={setRouteStep}
                  min={1}
                  max={120}
                  step={1}
                  data-testid="slider-route-step-mass"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm">Dry Depth: <span className="font-mono text-primary">{conv.lengthSmall(dry * 1000).toFixed(1)} {u.lengthSmall}</span></Label>
                <Slider
                  value={dryDepth}
                  onValueChange={setDryDepth}
                  min={0.0001}
                  max={0.01}
                  step={0.0001}
                  data-testid="slider-dry-depth"
                />
              </div>
            </div>
            
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-xs space-y-1">
              <h4 className="font-semibold text-red-600 dark:text-red-400">Error Sources</h4>
              <ul className="text-muted-foreground space-y-0.5">
                <li>• Numerical truncation from large timesteps</li>
                <li>• Convergence tolerance affects precision</li>
                <li>• Tiny "lost" flows below dry depth threshold</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function OscillationChallengeDiagram() {
  const [inflowMagnitude, setInflowMagnitude] = useState([1.0]);
  const [inflowDuration, setInflowDuration] = useState([5]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [time, setTime] = useState(0);
  const [swmmData, setSwmmData] = useState<number[]>([]);
  const [icmData, setIcmData] = useState<number[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const magnitude = inflowMagnitude[0];
  const duration = inflowDuration[0];
  
  const simulate = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setTime(0);
    setSwmmData([]);
    setIcmData([]);
    
    const swmm: number[] = [];
    const icm: number[] = [];
    
    let step = 0;
    intervalRef.current = setInterval(() => {
      step++;
      const t = step * 0.5;
      
      const impulse = t < duration ? magnitude : 0;
      const omega = 2;
      const dampingSwmm = 0.1;
      const dampingIcm = 0.5;
      
      const swmmLevel = impulse > 0 
        ? magnitude * (1 - Math.exp(-t * 0.5))
        : swmm.length > 0 
          ? swmm[swmm.length - 1] * Math.exp(-dampingSwmm * (t - duration)) * Math.cos(omega * (t - duration))
          : 0;
      
      const icmLevel = impulse > 0
        ? magnitude * (1 - Math.exp(-t * 0.8))
        : icm.length > 0
          ? icm[icm.length - 1] * Math.exp(-dampingIcm * (t - duration))
          : 0;
      
      swmm.push(swmmLevel);
      icm.push(icmLevel);
      setSwmmData([...swmm]);
      setIcmData([...icm]);
      setTime(t);
      
      if (step >= 60) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        intervalRef.current = null;
        setIsAnimating(false);
      }
    }, 100);
  };
  
  const reset = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = null;
    setIsAnimating(false);
    setTime(0);
    setSwmmData([]);
    setIcmData([]);
  };
  
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <Card className="border-2 border-amber-500/30 bg-gradient-to-br from-amber-500/5 to-background">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Waves className="h-5 w-5 text-amber-500" />
          Oscillation Challenge
          <Badge variant="outline" className="ml-auto text-amber-600 border-amber-500">Stability Test</Badge>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Compare SWMM5 node-link oscillation vs ICM's damped response to abrupt inflows
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="text-xs font-semibold text-blue-500 flex items-center gap-2">
              <Activity className="h-4 w-4" />
              SWMM5 Response (Node-Link)
            </div>
            <div className="relative h-32 bg-muted/30 rounded-lg border border-blue-500/30 overflow-hidden">
              <svg role="img" aria-label="Oscillation challenge interactive diagram" className="w-full h-full" viewBox="0 0 200 80" preserveAspectRatio="none" aria-hidden="true">
                <line x1="10" y1="40" x2="190" y2="40" className="stroke-slate-600/30 stroke-1" strokeDasharray="2,2" />
                
                {swmmData.length > 1 && (
                  <path
                    d={`M ${swmmData.map((v, i) => `${10 + i * 3},${40 - v * 25}`).join(' L ')}`}
                    fill="none"
                    className="stroke-blue-500 stroke-2"
                  />
                )}
              </svg>
              <div className="absolute bottom-1 left-2 text-[8px] text-muted-foreground">Potential oscillation at concentrated node</div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="text-xs font-semibold text-emerald-500 flex items-center gap-2">
              <Activity className="h-4 w-4" />
              ICM Response (Distributed)
            </div>
            <div className="relative h-32 bg-muted/30 rounded-lg border border-emerald-500/30 overflow-hidden">
              <svg className="w-full h-full" viewBox="0 0 200 80" preserveAspectRatio="none" aria-hidden="true">
                <line x1="10" y1="40" x2="190" y2="40" className="stroke-slate-600/30 stroke-1" strokeDasharray="2,2" />
                
                {icmData.length > 1 && (
                  <path
                    d={`M ${icmData.map((v, i) => `${10 + i * 3},${40 - v * 25}`).join(' L ')}`}
                    fill="none"
                    className="stroke-emerald-500 stroke-2"
                  />
                )}
              </svg>
              <div className="absolute bottom-1 left-2 text-[8px] text-muted-foreground">Damped by distributed friction & Preissmann slot</div>
            </div>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button 
            onClick={simulate} 
            disabled={isAnimating}
            className="flex-1"
            data-testid="button-simulate-oscillation"
          >
            <Zap className="h-4 w-4 mr-2" />
            Apply Inflow Pulse
          </Button>
          <Button 
            variant="outline" 
            onClick={reset}
            data-testid="button-reset-oscillation"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm">Pulse Magnitude: <span className="font-mono text-primary">{magnitude.toFixed(1)}x</span></Label>
            <Slider
              value={inflowMagnitude}
              onValueChange={setInflowMagnitude}
              min={0.5}
              max={2.0}
              step={0.1}
              data-testid="slider-pulse-magnitude"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm">Pulse Duration: <span className="font-mono text-primary">{duration}s</span></Label>
            <Slider
              value={inflowDuration}
              onValueChange={setInflowDuration}
              min={1}
              max={10}
              step={1}
              data-testid="slider-pulse-duration"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-2">
            <h4 className="font-semibold text-blue-600 dark:text-blue-400">SWMM5 Behavior</h4>
            <p className="text-muted-foreground mt-1">Concentrated node inertia can cause "sloshing" oscillation after abrupt changes</p>
          </div>
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-2">
            <h4 className="font-semibold text-emerald-600 dark:text-emerald-400">ICM Behavior</h4>
            <p className="text-muted-foreground mt-1">Distributed internal friction and slot damping prevent spurious oscillation</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function WettingFrontDiagram() {
  const [pipeSlope, setPipeSlope] = useState([0.5]);
  const [roughness, setRoughness] = useState([0.015]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [time, setTime] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const slope = pipeSlope[0];
  const n = roughness[0];
  
  const swmmFrontPosition = Math.min(time * (slope / n) * 0.15, 180);
  const icmFrontPosition = Math.min(time * (slope / n) * 0.2, 180);
  
  const simulate = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setTime(0);
    
    intervalRef.current = setInterval(() => {
      setTime(prev => {
        if (prev >= 100) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          intervalRef.current = null;
          setIsAnimating(false);
          return 100;
        }
        return prev + 1;
      });
    }, 100);
  };
  
  const reset = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = null;
    setIsAnimating(false);
    setTime(0);
  };
  
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <Card className="border-2 border-cyan-500/30 bg-gradient-to-br from-cyan-500/5 to-background">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Droplets className="h-5 w-5 text-cyan-500" />
          Dry Startup / Wetting Front
          <Badge variant="outline" className="ml-auto text-cyan-600 border-cyan-500">Initial Conditions</Badge>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Compare how each solver initiates flow in a dry, flat conduit
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid md:grid-cols-1 gap-4">
          <div className="space-y-2">
            <div className="text-xs font-semibold text-blue-500">SWMM5: Stepwise Wetting Front</div>
            <div className="relative h-24 bg-muted/30 rounded-lg border border-blue-500/30 overflow-hidden">
              <svg role="img" aria-label="Wetting front progression animation" className="w-full h-full" viewBox="0 0 200 60" aria-hidden="true">
                <rect x="10" y="25" width="180" height="20" rx="10" className="fill-slate-400/30 stroke-slate-500" />
                
                <clipPath id="swmmPipe">
                  <rect x="10" y="25" width="180" height="20" rx="10" />
                </clipPath>
                
                <g clipPath="url(#swmmPipe)">
                  <rect 
                    x="10" 
                    y="35" 
                    width={Math.floor(swmmFrontPosition / 30) * 30} 
                    height="10" 
                    className="fill-blue-400/60"
                  />
                </g>
                
                <text x="10" y="55" className="text-[7px] fill-blue-500">Inflow →</text>
                <text x="190" y="55" textAnchor="end" className="text-[7px] fill-muted-foreground">Downstream (Q=0 until front arrives)</text>
              </svg>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="text-xs font-semibold text-emerald-500">ICM: Smooth Film Propagation</div>
            <div className="relative h-24 bg-muted/30 rounded-lg border border-emerald-500/30 overflow-hidden">
              <svg className="w-full h-full" viewBox="0 0 200 60" aria-hidden="true">
                <rect x="10" y="25" width="180" height="20" rx="10" className="fill-slate-400/30 stroke-slate-500" />
                
                <clipPath id="icmPipe">
                  <rect x="10" y="25" width="180" height="20" rx="10" />
                </clipPath>
                
                <g clipPath="url(#icmPipe)">
                  <defs>
                    <linearGradient id="icmGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="rgb(52, 211, 153)" stopOpacity="0.8" />
                      <stop offset={`${(icmFrontPosition / 180) * 100}%`} stopColor="rgb(52, 211, 153)" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="rgb(52, 211, 153)" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <rect 
                    x="10" 
                    y="38" 
                    width={icmFrontPosition} 
                    height="7" 
                    fill="url(#icmGradient)"
                  />
                </g>
                
                <text x="10" y="55" className="text-[7px] fill-emerald-500">Inflow →</text>
                <text x="190" y="55" textAnchor="end" className="text-[7px] fill-muted-foreground">Base flow spreads as shallow film</text>
              </svg>
            </div>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button 
            onClick={simulate} 
            disabled={isAnimating}
            className="flex-1"
            data-testid="button-simulate-wetting"
          >
            <Play className="h-4 w-4 mr-2" />
            Start Dry Flow
          </Button>
          <Button 
            variant="outline" 
            onClick={reset}
            data-testid="button-reset-wetting"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm">Pipe Slope: <span className="font-mono text-primary">{slope}%</span></Label>
            <Slider
              value={pipeSlope}
              onValueChange={setPipeSlope}
              min={0.1}
              max={2.0}
              step={0.1}
              data-testid="slider-wetting-slope"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm">Manning's n: <span className="font-mono text-primary">{n}</span></Label>
            <Slider
              value={roughness}
              onValueChange={setRoughness}
              min={0.010}
              max={0.025}
              step={0.001}
              data-testid="slider-wetting-roughness"
            />
          </div>
        </div>
        
        <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-3 text-xs">
          <p className="text-muted-foreground">
            <strong className="text-cyan-600 dark:text-cyan-400">Why it matters:</strong> ICM's base flow approach often starts more easily in dry systems. 
            SWMM5 may require careful initialization or "priming" flows for dry startup scenarios.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export function TimestepDashboardDiagram() {
  const [swmmStep, setSwmmStep] = useState([30]);
  const [icmMinStep, setIcmMinStep] = useState([0.5]);
  const [icmMaxStep, setIcmMaxStep] = useState([30]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [time, setTime] = useState(0);
  const [icmCurrentStep, setIcmCurrentStep] = useState(15);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const swmmCFL = swmmStep[0] > 20 ? "yellow" : swmmStep[0] > 40 ? "red" : "green";
  
  const simulate = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setTime(0);
    
    intervalRef.current = setInterval(() => {
      setTime(prev => {
        const stormPhase = Math.sin(prev * 0.1);
        const activity = Math.abs(stormPhase);
        const newStep = icmMinStep[0] + (icmMaxStep[0] - icmMinStep[0]) * (1 - activity);
        setIcmCurrentStep(newStep);
        
        if (prev >= 100) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          intervalRef.current = null;
          setIsAnimating(false);
          return 100;
        }
        return prev + 1;
      });
    }, 100);
  };
  
  const reset = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = null;
    setIsAnimating(false);
    setTime(0);
    setIcmCurrentStep(15);
  };
  
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <Card className="border-2 border-indigo-500/30 bg-gradient-to-br from-indigo-500/5 to-background">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Activity className="h-5 w-5 text-indigo-500" />
          Time-Step Strategy Dashboard
          <Badge variant="outline" className="ml-auto text-indigo-600 border-indigo-500">Philosophy Comparison</Badge>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Compare fixed vs adaptive timestep philosophies
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-blue-500/10 border-2 border-blue-500/30 rounded-lg p-4 space-y-3">
            <h4 className="font-bold text-blue-600 dark:text-blue-400 text-center">SWMM5: Fixed & CFL-Limited</h4>
            
            <div className="flex items-center justify-center gap-2">
              <div className={`w-4 h-4 rounded-full ${
                swmmCFL === "green" ? "bg-emerald-500" :
                swmmCFL === "yellow" ? "bg-amber-500" : "bg-red-500"
              }`} data-testid="indicator-swmm-cfl" />
              <span className="text-xs text-muted-foreground">CFL Status</span>
            </div>
            
            <div className="relative h-16 bg-muted/30 rounded overflow-hidden">
              <svg role="img" aria-label="Timestep performance dashboard" className="w-full h-full" viewBox="0 0 150 40" aria-hidden="true">
                {Array.from({ length: 10 }).map((_, i) => (
                  <motion.line
                    key={i}
                    x1={15 + i * 15}
                    y1="10"
                    x2={15 + i * 15}
                    y2="30"
                    className="stroke-blue-500 stroke-2"
                    animate={isAnimating ? { opacity: [0.3, 1, 0.3] } : { opacity: 0.5 }}
                    transition={{ duration: 1, delay: i * 0.1, repeat: Infinity }}
                  />
                ))}
              </svg>
              <div className="absolute bottom-0 left-0 right-0 text-center text-[8px] text-muted-foreground">
                Steady metronome: Δt = {swmmStep[0]}s
              </div>
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm">Route Step: <span className="font-mono">{swmmStep[0]}s</span></Label>
              <Slider
                value={swmmStep}
                onValueChange={setSwmmStep}
                min={1}
                max={60}
                step={1}
                data-testid="slider-dashboard-swmm-step"
              />
            </div>
            
            <div className="text-center text-xs italic text-muted-foreground border-t pt-2">
              "Stability dictated by your input. Choose carefully."
            </div>
          </div>
          
          <div className="bg-emerald-500/10 border-2 border-emerald-500/30 rounded-lg p-4 space-y-3">
            <h4 className="font-bold text-emerald-600 dark:text-emerald-400 text-center">ICM: Adaptive & Convergence-Limited</h4>
            
            <div className="flex items-center justify-center gap-2">
              <div className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                isAnimating ? "bg-amber-500/20 text-amber-600" : "bg-emerald-500/20 text-emerald-600"
              }`} data-testid="indicator-icm-status">
                {isAnimating ? "Iterating..." : "Converged"}
              </div>
            </div>
            
            <div className="relative h-16 bg-muted/30 rounded overflow-hidden">
              <svg className="w-full h-full" viewBox="0 0 150 40" aria-hidden="true">
                <motion.path
                  d={`M 0,20 ${Array.from({ length: 15 }).map((_, i) => {
                    const x = i * 10;
                    const y = 20 + Math.sin((time + i) * 0.3) * 10;
                    return `L ${x},${y}`;
                  }).join(' ')}`}
                  fill="none"
                  className="stroke-emerald-500 stroke-2"
                />
              </svg>
              <div className="absolute bottom-0 left-0 right-0 text-center text-[8px] text-muted-foreground">
                Adaptive: Δt = {icmCurrentStep.toFixed(1)}s
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label className="text-[10px]">Min: <span className="font-mono">{icmMinStep[0]}s</span></Label>
                <Slider
                  value={icmMinStep}
                  onValueChange={setIcmMinStep}
                  min={0.1}
                  max={5}
                  step={0.1}
                  data-testid="slider-dashboard-icm-min"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-[10px]">Max: <span className="font-mono">{icmMaxStep[0]}s</span></Label>
                <Slider
                  value={icmMaxStep}
                  onValueChange={setIcmMaxStep}
                  min={10}
                  max={60}
                  step={1}
                  data-testid="slider-dashboard-icm-max"
                />
              </div>
            </div>
            
            <div className="text-center text-xs italic text-muted-foreground border-t pt-2">
              "Stability managed by the engine. Speed optimized."
            </div>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button 
            onClick={simulate} 
            disabled={isAnimating}
            className="flex-1"
            data-testid="button-simulate-dashboard"
          >
            <Play className="h-4 w-4 mr-2" />
            Simulate Storm Event
          </Button>
          <Button 
            variant="outline" 
            onClick={reset}
            data-testid="button-reset-dashboard"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export function SolverDecisionTreeDiagram() {
  const [answers, setAnswers] = useState<Record<string, boolean | null>>({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [recommendation, setRecommendation] = useState<string | null>(null);
  
  const questions = [
    { id: "surcharge", text: "Modeling complex surcharge or pressurized flow?" },
    { id: "regulation", text: "Need strict EPA SWMM5 replication for regulation?" },
    { id: "2d", text: "Integrating 2D overland flow?" },
    { id: "freesurface", text: "System mostly free-surface with steep slopes?" },
    { id: "legacy", text: "Prior model built in SWMM5?" },
  ];
  
  const answer = (value: boolean) => {
    const q = questions[currentQuestion];
    const newAnswers = { ...answers, [q.id]: value };
    setAnswers(newAnswers);
    
    if (q.id === "surcharge" && value) {
      setRecommendation("ICM Native Solver");
      return;
    }
    if (q.id === "regulation" && value) {
      setRecommendation("Embedded SWMM5 Engine");
      return;
    }
    if (q.id === "2d" && value) {
      setRecommendation("ICM Native Solver");
      return;
    }
    if (q.id === "freesurface" && value && !newAnswers["surcharge"] && !newAnswers["2d"]) {
      setRecommendation("Either (SWMM5 Kinematic may be faster)");
      return;
    }
    if (q.id === "legacy" && value) {
      setRecommendation("Consider Embedded SWMM5 for consistency");
      return;
    }
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setRecommendation("ICM Native Solver (general recommendation)");
    }
  };
  
  const reset = () => {
    setAnswers({});
    setCurrentQuestion(0);
    setRecommendation(null);
  };

  return (
    <Card className="border-2 border-pink-500/30 bg-gradient-to-br from-pink-500/5 to-background">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <CheckCircle className="h-5 w-5 text-pink-500" />
          Which Solver For My Problem?
          <Badge variant="outline" className="ml-auto text-pink-600 border-pink-500">Decision Guide</Badge>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Interactive guide for choosing between ICM native solver and embedded SWMM5 engine
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <AnimatePresence mode="wait">
          {!recommendation ? (
            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-muted/30 rounded-lg border border-border p-6 space-y-4"
            >
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>Question {currentQuestion + 1} of {questions.length}</span>
                <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-pink-500 transition-all"
                    style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                  />
                </div>
              </div>
              
              <h3 className="text-lg font-semibold text-center" data-testid="text-current-question">
                {questions[currentQuestion].text}
              </h3>
              
              <div className="flex gap-4 justify-center">
                <Button 
                  onClick={() => answer(true)} 
                  className="w-24 bg-emerald-500 hover:bg-emerald-600"
                  data-testid="button-answer-yes"
                >
                  Yes
                </Button>
                <Button 
                  onClick={() => answer(false)} 
                  variant="outline"
                  className="w-24"
                  data-testid="button-answer-no"
                >
                  No
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-lg border-2 border-pink-500/50 p-6 space-y-4"
            >
              <div className="flex items-center justify-center gap-2">
                <CheckCircle className="h-8 w-8 text-pink-500" />
              </div>
              <h3 className="text-xl font-bold text-center text-pink-600 dark:text-pink-400" data-testid="text-solver-recommendation">
                {recommendation}
              </h3>
              
              <div className="text-sm text-center text-muted-foreground space-y-2">
                {recommendation.includes("ICM Native") && (
                  <p>The ICM native solver handles surcharge, 2D coupling, and complex hydraulics with its Newton-Raphson method and Preissmann slot.</p>
                )}
                {recommendation.includes("SWMM5") && (
                  <p>The embedded SWMM5 engine ensures regulatory compliance and consistency with existing SWMM5 models.</p>
                )}
                {recommendation.includes("Either") && (
                  <p>For simple free-surface systems with steep slopes, SWMM5's Kinematic Wave routing may offer faster computation.</p>
                )}
              </div>
              
              <div className="flex justify-center">
                <Button onClick={reset} variant="outline" data-testid="button-restart-decision">
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Start Over
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3">
            <h4 className="font-semibold text-emerald-600 dark:text-emerald-400 mb-1">ICM Native Solver</h4>
            <ul className="text-muted-foreground space-y-0.5">
              <li>• Newton-Raphson iteration</li>
              <li>• Preissmann slot for surcharge</li>
              <li>• Native 2D integration</li>
              <li>• Adaptive timestep</li>
            </ul>
          </div>
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
            <h4 className="font-semibold text-blue-600 dark:text-blue-400 mb-1">Embedded SWMM5</h4>
            <ul className="text-muted-foreground space-y-0.5">
              <li>• EPA SWMM5 compatibility</li>
              <li>• Regulatory compliance</li>
              <li>• Legacy model support</li>
              <li>• Fixed timestep routing</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
