import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Clock, Waves, Ruler, Droplets, Play, Pause, RotateCcw, AlertTriangle, CheckCircle, XCircle, Zap } from "lucide-react";

export function WaveTravelVsTimestepDiagram() {
  const [timestep, setTimestep] = useState([5]);
  const [solverType, setSolverType] = useState<"swmm" | "icm">("swmm");
  const [isAnimating, setIsAnimating] = useState(false);
  const [wavePosition, setWavePosition] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const pipeLength = 100;
  const celerity = 1400;
  const travelTime = pipeLength / celerity;
  const segments = solverType === "icm" ? 5 : 1;
  const segmentLength = pipeLength / segments;
  
  const cflViolated = timestep[0] > travelTime * segments;
  const severeViolation = timestep[0] > 100;
  
  useEffect(() => {
    if (isAnimating) {
      const stepTime = Math.max(50, timestep[0] * 10);
      intervalRef.current = setInterval(() => {
        setWavePosition(p => {
          const increment = timestep[0] > travelTime ? 1 : timestep[0] / travelTime * 0.1;
          const newPos = p + increment;
          if (newPos >= segments) {
            setIsAnimating(false);
            return segments;
          }
          return newPos;
        });
      }, stepTime);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isAnimating, timestep, travelTime, segments]);
  
  const reset = () => {
    setIsAnimating(false);
    setWavePosition(0);
  };

  return (
    <Card className="w-full" data-testid="wave-travel-vs-timestep-diagram">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Clock className="w-5 h-5 text-blue-500" />
          The Wave Travel vs. Time Step Race
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-lg">
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <div className="text-muted-foreground">Pipe Length</div>
              <div className="font-mono font-bold">{pipeLength} m</div>
            </div>
            <div>
              <div className="text-muted-foreground">Wave Celerity</div>
              <div className="font-mono font-bold">{celerity} m/s</div>
            </div>
            <div>
              <div className="text-muted-foreground">Travel Time</div>
              <div className="font-mono font-bold">{(travelTime * 1000).toFixed(1)} ms</div>
            </div>
          </div>
        </div>
        
        <Tabs value={solverType} onValueChange={(v) => { setSolverType(v as any); reset(); }}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="swmm" data-testid="tab-swmm-wave">SWMM5 (Node-Link)</TabsTrigger>
            <TabsTrigger value="icm" data-testid="tab-icm-wave">ICM (Distributed)</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="space-y-2">
          <Label className="text-xs">Time Step (Δt): {timestep[0]}s</Label>
          <Slider 
            value={timestep} 
            onValueChange={(v) => { setTimestep(v); reset(); }} 
            min={0.1} 
            max={900} 
            step={timestep[0] < 1 ? 0.1 : timestep[0] < 10 ? 1 : 10} 
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>0.1s</span>
            <span>Physical</span>
            <span>900s (15 min)</span>
          </div>
        </div>
        
        <div className="relative h-40 bg-gradient-to-b from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 rounded-lg overflow-hidden p-4">
          <svg viewBox="0 0 400 100" className="w-full h-full">
            <circle cx="30" cy="50" r="12" fill="#3b82f6" />
            <text x="30" y="80" className="text-[8px] fill-slate-600" textAnchor="middle">Upstream</text>
            
            <circle cx="370" cy="50" r="12" fill="#3b82f6" />
            <text x="370" y="80" className="text-[8px] fill-slate-600" textAnchor="middle">Downstream</text>
            
            <line x1="42" y1="50" x2="358" y2="50" stroke="#64748b" strokeWidth="8" />
            
            {solverType === "icm" && Array.from({ length: segments - 1 }).map((_, i) => (
              <circle 
                key={i} 
                cx={42 + ((i + 1) * (316 / segments))} 
                cy="50" 
                r="4" 
                fill="#94a3b8"
              />
            ))}
            
            <motion.g
              animate={{ 
                x: severeViolation ? 316 : wavePosition * (316 / segments)
              }}
              transition={{ 
                duration: severeViolation ? 0.1 : 0.3,
                ease: severeViolation ? "linear" : "easeInOut"
              }}
            >
              <rect x="42" y="42" width="30" height="16" fill="#22c55e" rx="3" opacity="0.8" />
              <text x="57" y="53" className="text-[7px] fill-white font-bold" textAnchor="middle">WAVE</text>
            </motion.g>
            
            {solverType === "swmm" && (
              <text x="200" y="25" className="text-[9px] fill-slate-500" textAnchor="middle">
                Node-Link: Wave must cross entire pipe
              </text>
            )}
            {solverType === "icm" && (
              <text x="200" y="25" className="text-[9px] fill-slate-500" textAnchor="middle">
                Distributed: Wave crosses segments ({segments} segments)
              </text>
            )}
          </svg>
        </div>
        
        <div className="flex gap-2">
          <Button onClick={() => setIsAnimating(!isAnimating)} size="sm" disabled={wavePosition >= segments}>
            {isAnimating ? <Pause className="w-4 h-4 mr-1" /> : <Play className="w-4 h-4 mr-1" />}
            {isAnimating ? "Pause" : "Send Wave"}
          </Button>
          <Button variant="outline" size="sm" onClick={reset}>
            <RotateCcw className="w-4 h-4 mr-1" /> Reset
          </Button>
        </div>
        
        <div className={`p-3 rounded-lg border-2 ${
          severeViolation ? "border-red-500 bg-red-50 dark:bg-red-900/20" :
          cflViolated ? "border-amber-500 bg-amber-50 dark:bg-amber-900/20" :
          "border-green-500 bg-green-50 dark:bg-green-900/20"
        }`}>
          {severeViolation ? (
            <p className="text-sm">
              <XCircle className="w-4 h-4 inline mr-1 text-red-600" />
              <strong className="text-red-600">Physics Violated:</strong> Δt={timestep[0]}s is {Math.round(timestep[0] / travelTime).toLocaleString()}× larger than wave travel time. 
              Wave "teleports" instantly—mass/energy errors guaranteed, solver crash likely.
            </p>
          ) : cflViolated ? (
            <p className="text-sm">
              <AlertTriangle className="w-4 h-4 inline mr-1 text-amber-600" />
              <strong className="text-amber-600">CFL Warning:</strong> Timestep exceeds physical wave travel. 
              {solverType === "icm" ? " ICM's distributed scheme provides some margin, but accuracy suffers." : " SWMM5 may experience instability."}
            </p>
          ) : (
            <p className="text-sm">
              <CheckCircle className="w-4 h-4 inline mr-1 text-green-600" />
              <strong className="text-green-600">Stable:</strong> Timestep properly resolves wave propagation physics.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function AdaptiveTimestepSimulatorDiagram() {
  const [solverMode, setSolverMode] = useState<"swmm-fixed-ok" | "swmm-fixed-bad" | "icm-adaptive">("swmm-fixed-ok");
  const [isAnimating, setIsAnimating] = useState(false);
  const [simTime, setSimTime] = useState(0);
  const [crashed, setCrashed] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const maxTime = 100;
  
  const getTimestep = (t: number, mode: string): number => {
    if (mode === "swmm-fixed-ok") return 30;
    if (mode === "swmm-fixed-bad") return 900;
    const stormPeak = 50;
    const intensity = Math.exp(-Math.pow((t - stormPeak) / 20, 2));
    if (intensity > 0.8) return 5;
    if (intensity > 0.5) return 30;
    if (intensity > 0.2) return 120;
    return 300;
  };
  
  const getError = (t: number, mode: string): number => {
    const stormPeak = 50;
    const intensity = Math.exp(-Math.pow((t - stormPeak) / 20, 2));
    if (mode === "swmm-fixed-ok") return 0.1 + intensity * 0.3;
    if (mode === "swmm-fixed-bad") return intensity > 0.3 ? 999 : 0.5 + intensity * 2;
    return 0.1 + intensity * 0.15;
  };
  
  useEffect(() => {
    if (isAnimating && !crashed) {
      intervalRef.current = setInterval(() => {
        setSimTime(t => {
          const newT = t + 1;
          if (solverMode === "swmm-fixed-bad" && newT > 40 && newT < 60) {
            setCrashed(true);
            setIsAnimating(false);
          }
          if (newT >= maxTime) {
            setIsAnimating(false);
            return maxTime;
          }
          return newT;
        });
      }, 100);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isAnimating, crashed, solverMode]);
  
  const reset = () => {
    setIsAnimating(false);
    setSimTime(0);
    setCrashed(false);
  };
  
  const timestepHistory = Array.from({ length: Math.min(simTime, 50) }, (_, i) => 
    getTimestep(simTime - 50 + i, solverMode)
  );
  const errorHistory = Array.from({ length: Math.min(simTime, 50) }, (_, i) => 
    getError(simTime - 50 + i, solverMode)
  );

  return (
    <Card className="w-full" data-testid="adaptive-timestep-simulator">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Zap className="w-5 h-5 text-amber-500" />
          Adaptive Time Step "Safety Net" Simulator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs value={solverMode} onValueChange={(v) => { setSolverMode(v as any); reset(); }}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="swmm-fixed-ok" data-testid="tab-swmm-ok">SWMM5 (Δt=30s)</TabsTrigger>
            <TabsTrigger value="swmm-fixed-bad" data-testid="tab-swmm-bad">SWMM5 (Δt=900s)</TabsTrigger>
            <TabsTrigger value="icm-adaptive" data-testid="tab-icm-adaptive">ICM Adaptive</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg">
            <div className="text-xs text-muted-foreground mb-2">Solver Time Step</div>
            <div className="h-24 relative">
              <svg viewBox="0 0 200 80" className="w-full h-full">
                <line x1="20" y1="70" x2="190" y2="70" stroke="#94a3b8" strokeWidth="1" />
                <line x1="20" y1="10" x2="20" y2="70" stroke="#94a3b8" strokeWidth="1" />
                
                {timestepHistory.length > 1 && (
                  <polyline
                    points={timestepHistory.map((dt, i) => {
                      const x = 20 + (i / 50) * 170;
                      const y = 70 - (Math.log10(dt + 1) / Math.log10(1000)) * 55;
                      return `${x},${y}`;
                    }).join(" ")}
                    fill="none"
                    stroke={solverMode === "icm-adaptive" ? "#22c55e" : "#3b82f6"}
                    strokeWidth="2"
                  />
                )}
                
                <text x="105" y="78" className="text-[7px] fill-slate-500" textAnchor="middle">Time</text>
              </svg>
            </div>
            <div className="text-center font-mono text-sm">
              Δt = {getTimestep(simTime, solverMode)}s
            </div>
          </div>
          
          <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg">
            <div className="text-xs text-muted-foreground mb-2">Convergence Error</div>
            <div className="h-24 relative">
              <svg viewBox="0 0 200 80" className="w-full h-full">
                <line x1="20" y1="70" x2="190" y2="70" stroke="#94a3b8" strokeWidth="1" />
                <line x1="20" y1="10" x2="20" y2="70" stroke="#94a3b8" strokeWidth="1" />
                
                <line x1="20" y1="25" x2="190" y2="25" stroke="#ef4444" strokeWidth="1" strokeDasharray="3,3" />
                <text x="192" y="28" className="text-[6px] fill-red-500">Crash</text>
                
                {errorHistory.length > 1 && (
                  <polyline
                    points={errorHistory.map((err, i) => {
                      const x = 20 + (i / 50) * 170;
                      const y = Math.max(10, 70 - Math.min(err, 1) * 55);
                      return `${x},${y}`;
                    }).join(" ")}
                    fill="none"
                    stroke={crashed ? "#ef4444" : "#f59e0b"}
                    strokeWidth="2"
                  />
                )}
                
                <text x="105" y="78" className="text-[7px] fill-slate-500" textAnchor="middle">Time</text>
              </svg>
            </div>
            {crashed && (
              <div className="text-center text-red-600 font-bold text-sm animate-pulse">
                CRASH - No Convergence
              </div>
            )}
          </div>
        </div>
        
        <div className="h-16 relative bg-slate-100 dark:bg-slate-800 rounded-lg p-2">
          <div className="text-xs text-muted-foreground mb-1">Storm Hydrograph</div>
          <svg viewBox="0 0 400 40" className="w-full h-8">
            <path
              d="M 0 35 Q 100 35 150 30 Q 200 10 250 30 Q 300 35 400 35"
              fill="rgba(59, 130, 246, 0.3)"
              stroke="#3b82f6"
              strokeWidth="2"
            />
            <line 
              x1={simTime * 4} 
              y1="5" 
              x2={simTime * 4} 
              y2="38" 
              stroke="#ef4444" 
              strokeWidth="2" 
            />
          </svg>
        </div>
        
        <div className="flex gap-2">
          <Button onClick={() => setIsAnimating(!isAnimating)} size="sm" disabled={crashed || simTime >= maxTime}>
            {isAnimating ? <Pause className="w-4 h-4 mr-1" /> : <Play className="w-4 h-4 mr-1" />}
            {isAnimating ? "Pause" : "Run Storm"}
          </Button>
          <Button variant="outline" size="sm" onClick={reset}>
            <RotateCcw className="w-4 h-4 mr-1" /> Reset
          </Button>
          <Badge variant="outline" className="ml-auto">
            Sim Time: {simTime}%
          </Badge>
        </div>
        
        <div className={`p-3 rounded-lg border-2 ${
          crashed ? "border-red-500 bg-red-50 dark:bg-red-900/20" :
          solverMode === "icm-adaptive" ? "border-green-500 bg-green-50 dark:bg-green-900/20" :
          "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
        }`}>
          {solverMode === "swmm-fixed-ok" && (
            <p className="text-sm"><strong className="text-blue-600">SWMM5 Fixed (30s):</strong> Reasonable timestep handles the storm, though error spikes during peak.</p>
          )}
          {solverMode === "swmm-fixed-bad" && (
            <p className="text-sm"><strong className="text-red-600">SWMM5 Fixed (900s):</strong> Timestep too large for storm dynamics. Solver crashes with "No Convergence" at peak.</p>
          )}
          {solverMode === "icm-adaptive" && (
            <p className="text-sm"><strong className="text-green-600">ICM Adaptive:</strong> Halving algorithm acts as a shock absorber—automatically shrinks to 5s at peak, expands during dry weather.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function ConduitLengtheningCheatCodeDiagram() {
  const [lengtheningStep, setLengtheningStep] = useState([5]);
  
  const realLength = 30;
  const waveSpeed = 1400;
  const travelTime = realLength / waveSpeed;
  
  const needsLengthening = travelTime < lengtheningStep[0];
  const virtualLength = needsLengthening ? waveSpeed * lengtheningStep[0] : realLength;
  const effectiveWaveSpeed = realLength / lengtheningStep[0];
  const lengtheningRatio = (virtualLength / realLength * 100);

  return (
    <Card className="w-full" data-testid="conduit-lengthening-cheat-code">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Ruler className="w-5 h-5 text-purple-500" />
          Conduit Lengthening: SWMM5's "Cheat Code"
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label className="text-xs">Time Step for Conduit Lengthening: {lengtheningStep[0]}s</Label>
          <Slider value={lengtheningStep} onValueChange={setLengtheningStep} min={0.1} max={30} step={0.5} />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-lg border-2 border-blue-300 bg-blue-50 dark:bg-blue-900/20">
            <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-blue-500"></span>
              Real Pipe
            </h4>
            <div className="relative h-12 bg-blue-200 dark:bg-blue-800 rounded mb-3">
              <div className="absolute inset-0 flex items-center justify-center text-sm font-mono text-blue-800 dark:text-blue-200">
                L = {realLength} m
              </div>
            </div>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Wave Speed:</span>
                <span className="font-mono">{waveSpeed} m/s</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Travel Time:</span>
                <span className="font-mono">{(travelTime * 1000).toFixed(1)} ms</span>
              </div>
            </div>
          </div>
          
          <div className={`p-4 rounded-lg border-2 ${needsLengthening ? "border-orange-400 bg-orange-50 dark:bg-orange-900/20" : "border-green-400 bg-green-50 dark:bg-green-900/20"}`}>
            <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full ${needsLengthening ? "bg-orange-500" : "bg-green-500"}`}></span>
              Model Pipe {needsLengthening && "(Lengthened)"}
            </h4>
            <div className="relative h-12 overflow-hidden rounded mb-3">
              <motion.div 
                className={`absolute inset-y-0 left-0 ${needsLengthening ? "bg-orange-300 dark:bg-orange-700" : "bg-green-200 dark:bg-green-800"} rounded`}
                animate={{ width: `${Math.min((virtualLength / realLength) * 100, 100)}%` }}
                transition={{ duration: 0.5 }}
              >
                <div className="absolute inset-0 flex items-center justify-center text-sm font-mono">
                  L = {virtualLength.toFixed(0)} m
                </div>
              </motion.div>
            </div>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Effective c:</span>
                <span className="font-mono">{needsLengthening ? effectiveWaveSpeed.toFixed(1) : waveSpeed} m/s</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Ratio:</span>
                <span className={`font-mono font-bold ${needsLengthening ? "text-orange-600" : "text-green-600"}`}>
                  {lengtheningRatio.toFixed(0)}%
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {needsLengthening && (
          <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-300 text-sm">
            <AlertTriangle className="w-4 h-4 inline mr-2 text-amber-600" />
            <strong>Lengthening Applied:</strong> Real travel time ({(travelTime * 1000).toFixed(1)}ms) &lt; timestep ({lengtheningStep[0]}s). 
            Pipe virtually stretched {lengtheningRatio.toFixed(0)}× to match routing step.
          </div>
        )}
        
        <div className="p-3 rounded-lg bg-muted/50 text-sm">
          <strong>The Trade-off:</strong> SWMM5 artificially slows waves to allow your chosen routing time step without violating CFL. 
          It trades <em>wave timing accuracy</em> for <em>stability</em>. This is why Summary Reports may show pipe lengths &gt;1000% of actual.
        </div>
      </CardContent>
    </Card>
  );
}

export function DryStartVsBaseFlowDiagram() {
  const [solverType, setSolverType] = useState<"swmm" | "icm">("swmm");
  const [isAnimating, setIsAnimating] = useState(false);
  const [valveOpen, setValveOpen] = useState(false);
  const [flowLevel, setFlowLevel] = useState(0);
  const [oscillation, setOscillation] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
    if (isAnimating && valveOpen) {
      intervalRef.current = setInterval(() => {
        setFlowLevel(l => {
          if (l >= 1) return 1;
          if (solverType === "swmm") {
            setOscillation(o => Math.sin(l * 20) * Math.exp(-l * 2) * 0.5);
            return l + 0.02;
          } else {
            setOscillation(0);
            return l + 0.03;
          }
        });
      }, 50);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isAnimating, valveOpen, solverType]);
  
  const startSimulation = () => {
    setIsAnimating(true);
    setTimeout(() => setValveOpen(true), 500);
  };
  
  const reset = () => {
    setIsAnimating(false);
    setValveOpen(false);
    setFlowLevel(0);
    setOscillation(0);
  };

  return (
    <Card className="w-full" data-testid="dry-start-vs-base-flow">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Droplets className="w-5 h-5 text-cyan-500" />
          Dry Start vs. Base Flow Stability
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs value={solverType} onValueChange={(v) => { setSolverType(v as any); reset(); }}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="swmm" data-testid="tab-swmm-dry">SWMM5 (Dry Start)</TabsTrigger>
            <TabsTrigger value="icm" data-testid="tab-icm-base">ICM (Base Flow)</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="relative h-56 bg-gradient-to-b from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 rounded-lg overflow-hidden">
          <svg viewBox="0 0 400 200" className="w-full h-full">
            <rect x="30" y="30" width="60" height="80" fill="#374151" rx="3" />
            <motion.rect
              x="35"
              y={110 - 70}
              width="50"
              height="70"
              fill="#3b82f6"
              opacity="0.7"
            />
            <text x="60" y="125" className="text-[10px] fill-slate-600" textAnchor="middle">Tank</text>
            
            <rect x="90" y="70" width="20" height="20" fill={valveOpen ? "#22c55e" : "#ef4444"} rx="2" />
            <text x="100" y="105" className="text-[8px] fill-slate-600" textAnchor="middle">
              {valveOpen ? "OPEN" : "CLOSED"}
            </text>
            
            <rect x="110" y="75" width="250" height="10" fill="#4b5563" rx="2" />
            
            {solverType === "icm" && !valveOpen && (
              <rect x="115" y="78" width="240" height="4" fill="#3b82f6" opacity="0.3" />
            )}
            
            {valveOpen && (
              <motion.rect
                x="115"
                y={78 + oscillation * 3}
                width={flowLevel * 240}
                height="4"
                fill="#3b82f6"
                opacity="0.8"
              />
            )}
            
            <rect x="340" y="55" width="40" height="50" fill="#374151" rx="3" />
            <text x="360" y="120" className="text-[10px] fill-slate-600" textAnchor="middle">Outlet</text>
            
            <rect x="50" y="140" width="300" height="50" fill="white" fillOpacity="0.95" rx="5" />
            <text x="200" y="160" className="text-[11px] fill-slate-700" textAnchor="middle">
              {solverType === "swmm" ? "Pipes start completely dry (Q=0, d=0)" : "Pipes maintain small base flow"}
            </text>
            <text x="200" y="178" className={`text-[10px] ${solverType === "swmm" ? "fill-amber-600" : "fill-green-600"}`} textAnchor="middle">
              {solverType === "swmm" ? "Wet/dry transitions cause numerical shocks" : "Equations remain well-behaved"}
            </text>
          </svg>
        </div>
        
        <div className="h-24 relative bg-slate-100 dark:bg-slate-800 rounded-lg p-3">
          <div className="text-xs text-muted-foreground mb-1">Flow Response</div>
          <svg viewBox="0 0 300 50" className="w-full h-12">
            <line x1="20" y1="45" x2="280" y2="45" stroke="#94a3b8" strokeWidth="1" />
            <line x1="20" y1="5" x2="20" y2="45" stroke="#94a3b8" strokeWidth="1" />
            
            <line x1="50" y1="5" x2="50" y2="45" stroke="#94a3b8" strokeWidth="1" strokeDasharray="2,2" />
            <text x="50" y="55" className="text-[7px] fill-slate-500" textAnchor="middle">Valve Opens</text>
            
            {flowLevel > 0 && (
              <path
                d={`M 50 45 ${Array.from({ length: Math.floor(flowLevel * 50) }, (_, i) => {
                  const x = 50 + i * 4.5;
                  const progress = i / 50;
                  const targetY = 10;
                  const osc = solverType === "swmm" ? Math.sin(progress * 20) * Math.exp(-progress * 3) * 15 : 0;
                  const y = 45 - (progress * 35) + osc;
                  return `L ${x} ${Math.max(5, Math.min(45, y))}`;
                }).join(" ")}`}
                fill="none"
                stroke={solverType === "swmm" ? "#f59e0b" : "#22c55e"}
                strokeWidth="2"
              />
            )}
          </svg>
        </div>
        
        <div className="flex gap-2">
          <Button onClick={startSimulation} size="sm" disabled={isAnimating}>
            <Play className="w-4 h-4 mr-1" /> Open Valve
          </Button>
          <Button variant="outline" size="sm" onClick={reset}>
            <RotateCcw className="w-4 h-4 mr-1" /> Reset
          </Button>
        </div>
        
        <div className={`p-3 rounded-lg border-2 ${solverType === "swmm" ? "border-amber-500 bg-amber-50 dark:bg-amber-900/20" : "border-green-500 bg-green-50 dark:bg-green-900/20"}`}>
          {solverType === "swmm" ? (
            <p className="text-sm">
              <AlertTriangle className="w-4 h-4 inline mr-1 text-amber-600" />
              <strong className="text-amber-600">Dry Start:</strong> Empty pipes create mathematical singularities. 
              The solver "hunts" for a solution, causing oscillations before settling to steady state.
            </p>
          ) : (
            <p className="text-sm">
              <CheckCircle className="w-4 h-4 inline mr-1 text-green-600" />
              <strong className="text-green-600">Base Flow:</strong> A small base flow keeps the equations well-behaved, 
              ensuring stable startup and smooth wet/dry transitions.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
