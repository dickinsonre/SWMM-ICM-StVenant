import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Zap, Waves, Gauge, Timer, Ruler, Box, Target, Cpu, Play, Pause, RotateCcw, AlertTriangle, CheckCircle } from "lucide-react";
import { useUnits } from "@/contexts/UnitsContext";

export function InertialTermsDiagram() {
  const [inertiaMode, setInertiaMode] = useState<"keep" | "dampen" | "ignore">("dampen");
  const [isAnimating, setIsAnimating] = useState(false);
  const [time, setTime] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
    if (isAnimating) {
      intervalRef.current = setInterval(() => {
        setTime(t => (t + 0.05) % 10);
      }, 50);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isAnimating]);
  
  const generateWave = (t: number, mode: string) => {
    const base = Math.sin(t * 2) * 0.5 + 0.5;
    if (mode === "keep") {
      return base + Math.sin(t * 8) * 0.15 * Math.exp(-t * 0.1);
    } else if (mode === "dampen") {
      return base + Math.sin(t * 8) * 0.05 * Math.exp(-t * 0.3);
    } else {
      return base * 0.8;
    }
  };

  return (
    <Card className="w-full" data-testid="inertial-terms-diagram">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Zap className="w-5 h-5 text-yellow-500" />
          Inertial Terms Selector: The Momentum Equation Tuner
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="p-4 bg-slate-900 rounded-lg font-mono text-sm overflow-x-auto">
          <div className="flex flex-wrap items-center gap-1 text-slate-100">
            <span className={`px-2 py-1 rounded ${inertiaMode !== "ignore" ? "bg-yellow-500/30 text-yellow-300" : "bg-slate-700 text-slate-500 line-through"}`}>
              ∂Q/∂t
            </span>
            <span className="text-slate-400">+</span>
            <span className={`px-2 py-1 rounded ${inertiaMode !== "ignore" ? "bg-yellow-500/30 text-yellow-300" : "bg-slate-700 text-slate-500 line-through"}`}>
              ∂(Q²/A)/∂x
            </span>
            <span className="text-slate-400">+</span>
            <span className="px-2 py-1 bg-blue-500/30 text-blue-300 rounded">gA(∂H/∂x)</span>
            <span className="text-slate-400">+</span>
            <span className="px-2 py-1 bg-green-500/30 text-green-300 rounded">gAS_f</span>
            <span className="text-slate-400">= 0</span>
          </div>
          <div className="mt-2 text-xs text-slate-400">
            <span className="text-yellow-400">Local + Convective Inertia</span> | 
            <span className="text-blue-400 ml-2">Pressure Gradient</span> | 
            <span className="text-green-400 ml-2">Friction</span>
          </div>
        </div>
        
        <Tabs value={inertiaMode} onValueChange={(v) => setInertiaMode(v as any)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="keep" data-testid="tab-keep">KEEP</TabsTrigger>
            <TabsTrigger value="dampen" data-testid="tab-dampen">DAMPEN (Default)</TabsTrigger>
            <TabsTrigger value="ignore" data-testid="tab-ignore">IGNORE</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="relative h-48 bg-gradient-to-b from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 rounded-lg overflow-hidden">
          <svg role="img" aria-label="Inertial terms visualization" viewBox="0 0 400 180" className="w-full h-full">
            <line x1="30" y1="150" x2="380" y2="150" stroke="#94a3b8" strokeWidth="2" />
            <line x1="30" y1="30" x2="30" y2="150" stroke="#94a3b8" strokeWidth="1" />
            
            <text x="200" y="170" className="text-[10px] fill-slate-500" textAnchor="middle">Time / Distance</text>
            <text x="15" y="90" className="text-[10px] fill-slate-500" textAnchor="middle" transform="rotate(-90, 15, 90)">Head/Flow</text>
            
            <polyline
              points={Array.from({ length: 70 }, (_, i) => {
                const t = i * 0.15;
                const y = 90 - generateWave(t + time, "keep") * 50;
                return `${30 + i * 5},${y}`;
              }).join(" ")}
              fill="none"
              stroke={inertiaMode === "keep" ? "#ef4444" : "#94a3b8"}
              strokeWidth={inertiaMode === "keep" ? "3" : "1"}
              strokeDasharray={inertiaMode === "keep" ? "0" : "4,4"}
            />
            
            <polyline
              points={Array.from({ length: 70 }, (_, i) => {
                const t = i * 0.15;
                const y = 90 - generateWave(t + time, "dampen") * 50;
                return `${30 + i * 5},${y}`;
              }).join(" ")}
              fill="none"
              stroke={inertiaMode === "dampen" ? "#22c55e" : "#94a3b8"}
              strokeWidth={inertiaMode === "dampen" ? "3" : "1"}
              strokeDasharray={inertiaMode === "dampen" ? "0" : "4,4"}
            />
            
            <polyline
              points={Array.from({ length: 70 }, (_, i) => {
                const t = i * 0.15;
                const y = 90 - generateWave(t + time, "ignore") * 50;
                return `${30 + i * 5},${y}`;
              }).join(" ")}
              fill="none"
              stroke={inertiaMode === "ignore" ? "#3b82f6" : "#94a3b8"}
              strokeWidth={inertiaMode === "ignore" ? "3" : "1"}
              strokeDasharray={inertiaMode === "ignore" ? "0" : "4,4"}
            />
            
            <rect x="280" y="10" width="110" height="55" fill="white" fillOpacity="0.95" rx="3" />
            <line x1="290" y1="22" x2="310" y2="22" stroke="#ef4444" strokeWidth="2" />
            <text x="315" y="25" className="text-[9px] fill-slate-600">KEEP</text>
            <line x1="290" y1="37" x2="310" y2="37" stroke="#22c55e" strokeWidth="2" />
            <text x="315" y="40" className="text-[9px] fill-slate-600">DAMPEN</text>
            <line x1="290" y1="52" x2="310" y2="52" stroke="#3b82f6" strokeWidth="2" />
            <text x="315" y="55" className="text-[9px] fill-slate-600">IGNORE</text>
          </svg>
        </div>
        
        <div className="flex gap-2">
          <Button onClick={() => setIsAnimating(!isAnimating)} size="sm" data-testid="btn-toggle-inertia">
            {isAnimating ? <Pause className="w-4 h-4 mr-1" /> : <Play className="w-4 h-4 mr-1" />}
            {isAnimating ? "Pause" : "Animate"}
          </Button>
          <Button variant="outline" size="sm" onClick={() => setTime(0)} data-testid="btn-reset-inertia">
            <RotateCcw className="w-4 h-4 mr-1" /> Reset
          </Button>
        </div>
        
        <div className={`p-3 rounded-lg border-2 ${
          inertiaMode === "keep" ? "border-red-500 bg-red-50 dark:bg-red-900/20" :
          inertiaMode === "dampen" ? "border-green-500 bg-green-50 dark:bg-green-900/20" :
          "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
        }`}>
          <p className="text-sm">
            {inertiaMode === "keep" && (
              <><strong className="text-red-600">KEEP:</strong> Full inertia terms retained. Most accurate for subcritical flow, but can oscillate or become unstable with large timesteps or near-critical conditions.</>
            )}
            {inertiaMode === "dampen" && (
              <><strong className="text-green-600">DAMPEN (Recommended):</strong> Reduces inertia influence as flow approaches critical. Provides stability "safety net" while retaining dynamic wave fidelity.</>
            )}
            {inertiaMode === "ignore" && (
              <><strong className="text-blue-600">IGNORE:</strong> Diffusion Wave approximation. Very stable but misses inertial "overshoot" in surge events. Use for slow-changing flows only.</>
            )}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export function NormalFlowCriterionDiagram() {
  const { u, conv } = useUnits();
  const [criterion, setCriterion] = useState<"slope" | "froude" | "both" | "none">("both");
  const [pipeSlope, setPipeSlope] = useState([0.05]);
  const [flowDepth, setFlowDepth] = useState([0.6]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [wavePosition, setWavePosition] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const velocity = 2.5 * Math.sqrt(pipeSlope[0]) * Math.pow(flowDepth[0], 0.67);
  const froudeNumber = velocity / Math.sqrt(9.81 * flowDepth[0]);
  const waterSurfaceSlope = pipeSlope[0] * (1 + 0.3 * Math.sin(wavePosition * 0.5));
  
  const isLimited = criterion !== "none" && (
    (criterion === "slope" && waterSurfaceSlope > pipeSlope[0]) ||
    (criterion === "froude" && froudeNumber > 1.0) ||
    (criterion === "both" && (waterSurfaceSlope > pipeSlope[0] || froudeNumber > 1.0))
  );
  
  useEffect(() => {
    if (isAnimating) {
      intervalRef.current = setInterval(() => {
        setWavePosition(p => (p + 0.1) % 20);
      }, 50);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isAnimating]);

  return (
    <Card className="w-full" data-testid="normal-flow-criterion-diagram">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Waves className="w-5 h-5 text-cyan-500" />
          Normal Flow Criterion & Regime Map
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-xs">Criterion</Label>
            <Select value={criterion} onValueChange={(v: any) => setCriterion(v)}>
              <SelectTrigger data-testid="select-criterion">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="both">Slope & Froude (Recommended)</SelectItem>
                <SelectItem value="slope">Slope Only</SelectItem>
                <SelectItem value="froude">Froude Only</SelectItem>
                <SelectItem value="none">None (Uncapped)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Pipe Slope: {(pipeSlope[0] * 100).toFixed(1)}%</Label>
            <Slider value={pipeSlope} onValueChange={setPipeSlope} min={0.01} max={0.15} step={0.005} />
          </div>
        </div>
        
        <div className="relative h-52 bg-gradient-to-b from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-950/30 rounded-lg overflow-hidden">
          <svg role="img" aria-label="Normal flow criterion diagram" viewBox="0 0 400 200" className="w-full h-full">
            <line x1="20" y1="40" x2="380" y2="100" stroke="#78716c" strokeWidth="8" />
            <line x1="20" y1="50" x2="380" y2="110" stroke="#57534e" strokeWidth="3" />
            
            <path
              d={`M 20 ${45 - flowDepth[0] * 30} 
                  Q ${100 + wavePosition * 5} ${40 - flowDepth[0] * 30 + Math.sin(wavePosition) * 8}
                  ${200 + wavePosition * 3} ${55 - flowDepth[0] * 30 + Math.sin(wavePosition * 1.5) * 6}
                  T 380 ${95 - flowDepth[0] * 30}`}
              fill="none"
              stroke={isLimited ? "#ef4444" : "#3b82f6"}
              strokeWidth="3"
            />
            
            <polygon
              points={`20,${45 - flowDepth[0] * 30} 20,50 380,110 380,${95 - flowDepth[0] * 30}`}
              fill={isLimited ? "rgba(239, 68, 68, 0.3)" : "rgba(59, 130, 246, 0.3)"}
            />
            
            {isAnimating && (
              <motion.circle
                cx={50 + wavePosition * 15}
                cy={47 - flowDepth[0] * 25 + wavePosition * 0.3}
                r="5"
                fill={isLimited ? "#ef4444" : "#3b82f6"}
                animate={{ cx: [50, 350], cy: [47 - flowDepth[0] * 25, 97 - flowDepth[0] * 25] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
            )}
            
            <rect x="250" y="130" width="140" height="60" fill="white" fillOpacity="0.95" rx="5" />
            <text x="260" y="148" className="text-[11px] fill-slate-700 font-semibold">Flow Regime</text>
            <text x="260" y="165" className={`text-[10px] ${froudeNumber > 1 ? "fill-red-600" : "fill-green-600"}`}>
              Fr = {froudeNumber.toFixed(2)} {froudeNumber > 1 ? "(Supercritical)" : "(Subcritical)"}
            </text>
            <text x="260" y="180" className={`text-[10px] ${waterSurfaceSlope > pipeSlope[0] ? "fill-red-600" : "fill-green-600"}`}>
              S_w = {(waterSurfaceSlope * 100).toFixed(2)}% {waterSurfaceSlope > pipeSlope[0] ? "> S₀" : "≤ S₀"}
            </text>
            
            {isLimited && (
              <g>
                <rect x="20" y="10" width="180" height="25" fill="#fef2f2" stroke="#ef4444" rx="3" />
                <text x="30" y="27" className="text-[11px] fill-red-600 font-bold">⚠ Normal Flow Limit Applied</text>
              </g>
            )}
          </svg>
        </div>
        
        <div className="flex gap-2">
          <Button onClick={() => setIsAnimating(!isAnimating)} size="sm">
            {isAnimating ? <Pause className="w-4 h-4 mr-1" /> : <Play className="w-4 h-4 mr-1" />}
            {isAnimating ? "Pause" : "Animate"}
          </Button>
          <div className="space-y-1 flex-1">
            <Label className="text-xs">{`Flow Depth: ${conv.length(flowDepth[0]).toFixed(2)} ${u.length}`}</Label>
            <Slider value={flowDepth} onValueChange={setFlowDepth} min={0.1} max={1.0} step={0.05} />
          </div>
        </div>
        
        <div className="p-3 rounded-lg bg-muted/50 text-sm">
          <strong>Slope & Froude</strong> is the most robust safeguard. It prevents unrealistic supercritical flow in steep pipes—a common source of mass balance errors.
        </div>
      </CardContent>
    </Card>
  );
}

export function SurchargeMethodDeepDiveDiagram() {
  const [method, setMethod] = useState<"extran" | "slot">("slot");
  const [headLevel, setHeadLevel] = useState([1.1]);
  const [isAnimating, setIsAnimating] = useState(false);
  
  return (
    <Card className="w-full" data-testid="surcharge-method-deep-dive">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Gauge className="w-5 h-5 text-purple-500" />
          Surcharge Method: EXTRAN vs Preissmann Slot
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs value={method} onValueChange={(v) => setMethod(v as any)}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="extran" data-testid="tab-extran">EXTRAN Algorithm</TabsTrigger>
            <TabsTrigger value="slot" data-testid="tab-slot">Preissmann Slot</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="relative h-56 bg-gradient-to-b from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 rounded-lg overflow-hidden">
          <svg role="img" aria-label="Surcharge method deep dive" viewBox="0 0 400 220" className="w-full h-full">
            <rect x="50" y="80" width="120" height="60" fill="#374151" rx="5" />
            <rect x="230" y="80" width="120" height="60" fill="#374151" rx="5" />
            
            <rect x="160" y="90" width="80" height="50" fill="#1f2937" rx="3" />
            
            <motion.rect
              x="165"
              y={140 - headLevel[0] * 40}
              width="70"
              height={Math.min(headLevel[0] * 40, 45)}
              fill={headLevel[0] > 1.0 ? "#ef4444" : "#3b82f6"}
              opacity="0.7"
              animate={{ height: Math.min(headLevel[0] * 40, 45), y: 140 - Math.min(headLevel[0] * 40, 45) }}
            />
            
            {method === "slot" && headLevel[0] > 1.0 && (
              <>
                <rect x="195" y={90 - (headLevel[0] - 1.0) * 60} width="10" height={(headLevel[0] - 1.0) * 60} fill="#1e293b" />
                <motion.rect
                  x="196"
                  y={90 - (headLevel[0] - 1.0) * 55}
                  width="8"
                  height={(headLevel[0] - 1.0) * 55}
                  fill="#f97316"
                  opacity="0.8"
                />
              </>
            )}
            
            <rect x="55" y="90" width="110" height="40" fill="#0ea5e9" opacity="0.6" />
            <rect x="235" y="90" width="110" height="40" fill="#0ea5e9" opacity="0.6" />
            
            <rect x="50" y="160" width="300" height="50" fill="white" fillOpacity="0.95" rx="5" />
            {method === "extran" ? (
              <>
                <text x="60" y="180" className="text-[10px] fill-slate-700 font-mono">dH/dt = (ΣQ_in - ΣQ_out) / (dΣQ/dH)</text>
                <text x="60" y="200" className="text-[9px] fill-slate-500">Head via derivative. No physical storage change.</text>
              </>
            ) : (
              <>
                <text x="60" y="180" className="text-[10px] fill-slate-700 font-mono">dH/dt = (ΣQ_in - ΣQ_out) / A_slot</text>
                <text x="60" y="200" className="text-[9px] fill-slate-500">Head rises smoothly into slot. Wave speed maintained.</text>
              </>
            )}
            
            <text x="200" y="25" className="text-[12px] fill-slate-700 font-semibold" textAnchor="middle">
              {method === "extran" ? "EXTRAN Surcharge Algorithm" : "Preissmann Slot Method"}
            </text>
            
            <text x="110" y="75" className="text-[10px] fill-slate-500" textAnchor="middle">Pipe 1 (Full)</text>
            <text x="290" y="75" className="text-[10px] fill-slate-500" textAnchor="middle">Pipe 2 (Full)</text>
            <text x="200" y="155" className="text-[10px] fill-slate-600" textAnchor="middle">Junction</text>
          </svg>
        </div>
        
        <div className="space-y-2">
          <Label className="text-xs">Head Level: {headLevel[0].toFixed(2)} (1.0 = crown)</Label>
          <Slider value={headLevel} onValueChange={setHeadLevel} min={0.5} max={1.5} step={0.05} />
        </div>
        
        <div className={`p-3 rounded-lg border-2 ${method === "extran" ? "border-amber-500 bg-amber-50 dark:bg-amber-900/20" : "border-green-500 bg-green-50 dark:bg-green-900/20"}`}>
          {method === "extran" ? (
            <p className="text-sm"><strong className="text-amber-600">EXTRAN:</strong> Uses derivative-based head update. Can become unstable if derivatives change quickly. Legacy method from original SWMM.</p>
          ) : (
            <p className="text-sm"><strong className="text-green-600">Preissmann Slot:</strong> Changes the numerical method from derivative-based to continuity-based. The slot maintains wave speed continuity and improves stability significantly.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function VariableTimestepDiagram() {
  const { u, conv } = useUnits();
  const [routingStep, setRoutingStep] = useState([30]);
  const [adjustmentFactor, setAdjustmentFactor] = useState([0.75]);
  const [minStep, setMinStep] = useState([0.5]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [variableTimesteps, setVariableTimesteps] = useState<number[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const pipes = [
    { id: 1, length: 100, waveSpeed: 5, name: "Long Pipe" },
    { id: 2, length: 30, waveSpeed: 8, name: "Short Steep" },
    { id: 3, length: 80, waveSpeed: 4, name: "Medium Pipe" },
  ];
  
  useEffect(() => {
    if (isAnimating) {
      intervalRef.current = setInterval(() => {
        setCurrentStep(s => {
          const newStep = s + 1;
          const criticalPipe = pipes.reduce((min, p) => {
            const cr = (p.waveSpeed * routingStep[0]) / p.length;
            const minCr = (min.waveSpeed * routingStep[0]) / min.length;
            return cr > minCr ? p : min;
          });
          const maxCr = (criticalPipe.waveSpeed * routingStep[0]) / criticalPipe.length;
          const requiredDt = Math.max(minStep[0], (criticalPipe.length / criticalPipe.waveSpeed) * adjustmentFactor[0]);
          
          setVariableTimesteps(prev => [...prev.slice(-20), requiredDt]);
          return newStep % 100;
        });
      }, 200);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isAnimating, routingStep, adjustmentFactor, minStep]);

  return (
    <Card className="w-full" data-testid="variable-timestep-diagram">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Timer className="w-5 h-5 text-indigo-500" />
          Variable Time Step & CFL Governor
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label className="text-xs">Routing Step: {routingStep[0]}s</Label>
            <Slider value={routingStep} onValueChange={setRoutingStep} min={5} max={60} step={5} />
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Adjust Factor: {adjustmentFactor[0]}</Label>
            <Slider value={adjustmentFactor} onValueChange={setAdjustmentFactor} min={0.5} max={1.0} step={0.05} />
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Min Step: {minStep[0]}s</Label>
            <Slider value={minStep} onValueChange={setMinStep} min={0.1} max={2.0} step={0.1} />
          </div>
        </div>
        
        <div className="space-y-3">
          {pipes.map(pipe => {
            const courant = (pipe.waveSpeed * routingStep[0]) / pipe.length;
            const isStable = courant <= 1.0;
            return (
              <div key={pipe.id} className="flex items-center gap-4 p-2 rounded-lg bg-muted/30">
                <div className="w-24 text-sm font-medium">{pipe.name}</div>
                <div className="flex-1">
                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span>L={conv.length(pipe.length).toFixed(0)} {u.length}, c={conv.velocity(pipe.waveSpeed).toFixed(1)} {u.velocity}</span>
                    <span className={isStable ? "text-green-600" : "text-red-600"}>
                      Cr = {courant.toFixed(2)}
                    </span>
                  </div>
                  <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full ${isStable ? "bg-green-500" : "bg-red-500"}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(courant * 100, 100)}%` }}
                    />
                  </div>
                </div>
                <Badge variant={isStable ? "default" : "destructive"} className="w-16 justify-center">
                  {isStable ? "Stable" : "Unstable"}
                </Badge>
              </div>
            );
          })}
        </div>
        
        <div className="relative h-24 bg-slate-100 dark:bg-slate-800 rounded-lg p-2">
          <div className="text-xs text-muted-foreground mb-2">Variable Timestep History</div>
          <svg role="img" aria-label="Variable timestep visualization" viewBox="0 0 400 60" className="w-full h-12">
            <line x1="0" y1="30" x2="400" y2="30" stroke="#94a3b8" strokeDasharray="2,2" />
            {variableTimesteps.map((dt, i) => (
              <rect
                key={i}
                x={i * 19}
                y={55 - (dt / routingStep[0]) * 50}
                width="16"
                height={(dt / routingStep[0]) * 50}
                fill={dt <= minStep[0] ? "#ef4444" : "#22c55e"}
                rx="2"
              />
            ))}
          </svg>
        </div>
        
        <div className="flex gap-2">
          <Button onClick={() => setIsAnimating(!isAnimating)} size="sm">
            {isAnimating ? <Pause className="w-4 h-4 mr-1" /> : <Play className="w-4 h-4 mr-1" />}
            {isAnimating ? "Pause" : "Simulate"}
          </Button>
          <Button variant="outline" size="sm" onClick={() => { setVariableTimesteps([]); setCurrentStep(0); }}>
            <RotateCcw className="w-4 h-4 mr-1" /> Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export function ConduitLengtheningDiagram() {
  const { u, conv } = useUnits();
  const [actualLength, setActualLength] = useState([15]);
  const [waveSpeed, setWaveSpeed] = useState([8]);
  const [lengtheningStep, setLengtheningStep] = useState([5]);
  
  const waveTravelTime = actualLength[0] / waveSpeed[0];
  const needsLengthening = waveTravelTime < lengtheningStep[0];
  const virtualLength = needsLengthening ? waveSpeed[0] * lengtheningStep[0] : actualLength[0];
  const lengtheningRatio = (virtualLength / actualLength[0] * 100).toFixed(0);

  return (
    <Card className="w-full" data-testid="conduit-lengthening-diagram">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Ruler className="w-5 h-5 text-orange-500" />
          Conduit Lengthening: The Virtual Pipe Stretcher
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label className="text-xs">{`Actual Length: ${conv.length(actualLength[0]).toFixed(0)} ${u.length}`}</Label>
            <Slider value={actualLength} onValueChange={setActualLength} min={5} max={100} step={5} />
          </div>
          <div className="space-y-2">
            <Label className="text-xs">{`Wave Speed: ${conv.velocity(waveSpeed[0]).toFixed(1)} ${u.velocity}`}</Label>
            <Slider value={waveSpeed} onValueChange={setWaveSpeed} min={2} max={15} step={1} />
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Lengthening Step: {lengtheningStep[0]}s</Label>
            <Slider value={lengtheningStep} onValueChange={setLengtheningStep} min={1} max={30} step={1} />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-lg border-2 border-slate-300 dark:border-slate-600">
            <h4 className="text-sm font-semibold mb-3">Original Pipe</h4>
            <div className="relative h-16 bg-slate-200 dark:bg-slate-700 rounded">
              <div 
                className="absolute inset-y-0 left-0 bg-blue-500 rounded"
                style={{ width: `${(actualLength[0] / 100) * 100}%` }}
              />
              <div className="absolute inset-0 flex items-center justify-center text-xs font-mono text-white">
                L = {conv.length(actualLength[0]).toFixed(0)} {u.length}
              </div>
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              Wave Travel Time: {waveTravelTime.toFixed(2)}s
            </div>
          </div>
          
          <div className={`p-4 rounded-lg border-2 ${needsLengthening ? "border-orange-500 bg-orange-50 dark:bg-orange-900/20" : "border-green-500 bg-green-50 dark:bg-green-900/20"}`}>
            <h4 className="text-sm font-semibold mb-3">
              {needsLengthening ? "Lengthened (Virtual)" : "No Change Needed"}
            </h4>
            <div className="relative h-16 bg-slate-200 dark:bg-slate-700 rounded overflow-hidden">
              <motion.div 
                className={`absolute inset-y-0 left-0 ${needsLengthening ? "bg-orange-500" : "bg-green-500"} rounded`}
                animate={{ width: `${Math.min((virtualLength / 100) * 100, 100)}%` }}
                transition={{ duration: 0.5 }}
              />
              <div className="absolute inset-0 flex items-center justify-center text-xs font-mono text-white">
                L = {conv.length(virtualLength).toFixed(1)} {u.length}
              </div>
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              {needsLengthening ? (
                <span className="text-orange-600 font-semibold">Ratio: {lengtheningRatio}%</span>
              ) : (
                <span className="text-green-600">Travel time ≥ timestep</span>
              )}
            </div>
          </div>
        </div>
        
        {needsLengthening && (
          <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-300 text-sm">
            <AlertTriangle className="w-4 h-4 inline mr-2 text-amber-600" />
            <strong>Lengthening Applied:</strong> Wave travel time ({waveTravelTime.toFixed(2)}s) &lt; timestep ({lengtheningStep[0]}s). 
            Pipe virtually stretched to {conv.length(virtualLength).toFixed(1)} {u.length} ({lengtheningRatio}% of actual).
          </div>
        )}
        
        <div className="p-3 rounded-lg bg-muted/50 text-sm">
          <strong>Why pipes show &gt;1000% length in reports:</strong> Very short pipes are artificially lengthened 
          to slow wave propagation, allowing larger global timesteps without stability violations. 
          Trade-off: some temporal smoothing of the hydrograph.
        </div>
      </CardContent>
    </Card>
  );
}

export function MinNodalSurfaceAreaDiagram() {
  const { u, conv } = useUnits();
  const [surfaceArea, setSurfaceArea] = useState([12.6]);
  const [inflowRate, setInflowRate] = useState([0.5]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [waterLevel, setWaterLevel] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const dHdt = inflowRate[0] / surfaceArea[0];
  
  useEffect(() => {
    if (isAnimating) {
      intervalRef.current = setInterval(() => {
        setWaterLevel(l => Math.min(1, l + dHdt * 0.05));
      }, 50);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isAnimating, dHdt]);
  
  const reset = () => {
    setIsAnimating(false);
    setWaterLevel(0);
  };

  return (
    <Card className="w-full" data-testid="min-nodal-surface-area-diagram">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Box className="w-5 h-5 text-teal-500" />
          Minimum Nodal Surface Area: The Junction "Bathtub"
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-xs">{`Surface Area: ${conv.area(surfaceArea[0]).toFixed(1)} ${u.area} (Default: ${conv.area(12.6).toFixed(1)})`}</Label>
            <Slider value={surfaceArea} onValueChange={setSurfaceArea} min={1} max={50} step={1} />
          </div>
          <div className="space-y-2">
            <Label className="text-xs">{`Inflow Rate: ${conv.flow(inflowRate[0]).toFixed(2)} ${u.flow}`}</Label>
            <Slider value={inflowRate} onValueChange={setInflowRate} min={0.1} max={2.0} step={0.1} />
          </div>
        </div>
        
        <div className="relative h-64 bg-gradient-to-b from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 rounded-lg overflow-hidden">
          <svg role="img" aria-label="Minimum nodal surface area diagram" viewBox="0 0 400 240" className="w-full h-full">
            <ellipse cx="200" cy="200" rx={30 + surfaceArea[0] * 2} ry="20" fill="#374151" />
            <rect x={200 - 30 - surfaceArea[0] * 2} y="60" width={(30 + surfaceArea[0] * 2) * 2} height="140" fill="#4b5563" />
            
            <motion.rect
              x={200 - 28 - surfaceArea[0] * 2}
              y={200 - waterLevel * 130}
              width={(28 + surfaceArea[0] * 2) * 2}
              height={waterLevel * 130}
              fill="#3b82f6"
              opacity="0.7"
            />
            
            {isAnimating && (
              <motion.g
                animate={{ y: [0, 100], opacity: [1, 0] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              >
                <circle cx="200" cy="30" r="4" fill="#3b82f6" />
                <circle cx="195" cy="25" r="3" fill="#3b82f6" />
                <circle cx="205" cy="28" r="3" fill="#3b82f6" />
              </motion.g>
            )}
            
            <text x="200" y="25" className="text-[11px] fill-slate-600" textAnchor="middle">
              {`Q_in = ${conv.flow(inflowRate[0]).toFixed(2)} ${u.flow}`}
            </text>
            
            <rect x="20" y="80" width="100" height="50" fill="white" fillOpacity="0.95" rx="5" />
            <text x="30" y="100" className="text-[10px] fill-slate-700 font-mono">dH/dt = Q/A</text>
            <text x="30" y="118" className="text-[10px] fill-slate-600">{`= ${conv.velocity(dHdt).toFixed(3)} ${u.velocity}`}</text>
            
            <rect x="280" y="80" width="100" height="50" fill="white" fillOpacity="0.95" rx="5" />
            <text x="290" y="100" className="text-[10px] fill-slate-700">Water Level</text>
            <text x="290" y="118" className={`text-[12px] font-bold ${waterLevel > 0.8 ? "fill-red-600" : "fill-blue-600"}`}>
              {(waterLevel * 100).toFixed(0)}%
            </text>
          </svg>
        </div>
        
        <div className="flex gap-2">
          <Button onClick={() => setIsAnimating(!isAnimating)} size="sm">
            {isAnimating ? <Pause className="w-4 h-4 mr-1" /> : <Play className="w-4 h-4 mr-1" />}
            {isAnimating ? "Pause" : "Fill Junction"}
          </Button>
          <Button variant="outline" size="sm" onClick={reset}>
            <RotateCcw className="w-4 h-4 mr-1" /> Reset
          </Button>
        </div>
        
        <div className={`p-3 rounded-lg border-2 ${surfaceArea[0] < 5 ? "border-red-500 bg-red-50 dark:bg-red-900/20" : "border-green-500 bg-green-50 dark:bg-green-900/20"}`}>
          {surfaceArea[0] < 5 ? (
            <p className="text-sm"><AlertTriangle className="w-4 h-4 inline mr-1 text-red-600" />
              <strong className="text-red-600">Small area:</strong> Water level changes very rapidly (dH/dt = {conv.velocity(dHdt).toFixed(3)} {u.velocity}). 
              This can cause oscillations and instability.
            </p>
          ) : (
            <p className="text-sm"><CheckCircle className="w-4 h-4 inline mr-1 text-green-600" />
              <strong className="text-green-600">Adequate area:</strong> Water level changes gradually (dH/dt = {conv.velocity(dHdt).toFixed(3)} {u.velocity}). 
              This mimics the "swirl and storage" effect in real manholes.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function ConvergenceTolerancesDiagram() {
  const { u, conv } = useUnits();
  const [headTolerance, setHeadTolerance] = useState([0.005]);
  const [maxTrials, setMaxTrials] = useState([8]);
  const [isSolving, setIsSolving] = useState(false);
  const [trials, setTrials] = useState<number[]>([]);
  const [converged, setConverged] = useState<boolean | null>(null);
  
  const simulateSolve = () => {
    setIsSolving(true);
    setTrials([]);
    setConverged(null);
    
    let currentError = 0.5;
    const iterations: number[] = [];
    
    const runIteration = (i: number) => {
      if (i >= maxTrials[0]) {
        setTrials(iterations);
        setConverged(false);
        setIsSolving(false);
        return;
      }
      
      currentError = currentError * (0.4 + Math.random() * 0.3);
      iterations.push(currentError);
      setTrials([...iterations]);
      
      if (currentError < headTolerance[0]) {
        setConverged(true);
        setIsSolving(false);
        return;
      }
      
      setTimeout(() => runIteration(i + 1), 300);
    };
    
    setTimeout(() => runIteration(0), 100);
  };

  return (
    <Card className="w-full" data-testid="convergence-tolerances-diagram">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Target className="w-5 h-5 text-rose-500" />
          Convergence Tolerances & Iteration Limit
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-xs">{`Head Tolerance: ${conv.length(headTolerance[0]).toFixed(4)} ${u.length}`}</Label>
            <Slider value={headTolerance} onValueChange={setHeadTolerance} min={0.001} max={0.05} step={0.001} />
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Max Trials: {maxTrials[0]}</Label>
            <Slider value={maxTrials} onValueChange={(v) => setMaxTrials(v.map(Math.round))} min={2} max={20} step={1} />
          </div>
        </div>
        
        <div className="relative h-48 bg-slate-100 dark:bg-slate-800 rounded-lg p-4">
          <div className="text-xs text-muted-foreground mb-2">Max Node Error (log scale)</div>
          <svg role="img" aria-label="Convergence tolerances visualization" viewBox="0 0 400 140" className="w-full h-32">
            <line x1="40" y1="120" x2="380" y2="120" stroke="#94a3b8" strokeWidth="1" />
            <line x1="40" y1="20" x2="40" y2="120" stroke="#94a3b8" strokeWidth="1" />
            
            <line 
              x1="40" 
              y1={120 - (Math.log10(headTolerance[0]) + 3) * 25} 
              x2="380" 
              y2={120 - (Math.log10(headTolerance[0]) + 3) * 25} 
              stroke="#22c55e" 
              strokeWidth="2" 
              strokeDasharray="5,5" 
            />
            <text x="385" y={123 - (Math.log10(headTolerance[0]) + 3) * 25} className="text-[9px] fill-green-600">Tolerance</text>
            
            {trials.map((error, i) => (
              <g key={i}>
                <circle
                  cx={60 + i * 35}
                  cy={120 - (Math.log10(error) + 3) * 25}
                  r="6"
                  fill={error < headTolerance[0] ? "#22c55e" : "#ef4444"}
                />
                <text x={60 + i * 35} y="135" className="text-[8px] fill-slate-500" textAnchor="middle">{i + 1}</text>
              </g>
            ))}
            
            {trials.length > 1 && (
              <polyline
                points={trials.map((error, i) => `${60 + i * 35},${120 - (Math.log10(error) + 3) * 25}`).join(" ")}
                fill="none"
                stroke="#6366f1"
                strokeWidth="2"
              />
            )}
          </svg>
        </div>
        
        <div className="flex items-center gap-4">
          <Button onClick={simulateSolve} disabled={isSolving} size="sm">
            {isSolving ? (
              <><motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity }} className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" /> Solving...</>
            ) : (
              <>Solve Time Step</>
            )}
          </Button>
          
          {converged !== null && (
            <Badge variant={converged ? "default" : "destructive"} className="text-sm">
              {converged ? (
                <><CheckCircle className="w-4 h-4 mr-1" /> CONVERGED in {trials.length} trials</>
              ) : (
                <><AlertTriangle className="w-4 h-4 mr-1" /> MAX TRIALS REACHED</>
              )}
            </Badge>
          )}
        </div>
        
        <div className="p-3 rounded-lg bg-muted/50 text-sm">
          <strong>"NO CONVERGENCE" warnings</strong> occur when error stays above tolerance after max trials. 
          Solutions: increase max trials, loosen tolerance, or reduce timestep.
        </div>
      </CardContent>
    </Card>
  );
}

export function ParallelThreadsDiagram() {
  const [numThreads, setNumThreads] = useState([4]);
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState<number[]>([]);
  
  const tasks = 12;
  const baseTime = 3;
  const overhead = 0.3;
  const computeTime = baseTime / numThreads[0] + overhead * (numThreads[0] - 1);
  
  useEffect(() => {
    if (isRunning) {
      setProgress(Array(numThreads[0]).fill(0));
      const interval = setInterval(() => {
        setProgress(prev => {
          const next = prev.map(p => Math.min(1, p + 0.1 / numThreads[0] + Math.random() * 0.05));
          if (next.every(p => p >= 1)) {
            setIsRunning(false);
          }
          return next;
        });
      }, 100);
      return () => clearInterval(interval);
    }
  }, [isRunning, numThreads]);

  return (
    <Card className="w-full" data-testid="parallel-threads-diagram">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Cpu className="w-5 h-5 text-violet-500" />
          Parallel Threads: The Workload Dispatcher
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label className="text-xs">Number of Threads: {numThreads[0]}</Label>
          <Slider value={numThreads} onValueChange={(v) => setNumThreads(v.map(Math.round))} min={1} max={8} step={1} />
        </div>
        
        <div className="space-y-2">
          {Array.from({ length: numThreads[0] }).map((_, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-20 text-xs font-mono">Thread {i + 1}</div>
              <div className="flex-1 h-6 bg-slate-200 dark:bg-slate-700 rounded overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-violet-500 to-purple-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${(progress[i] || 0) * 100}%` }}
                />
              </div>
              <div className="w-12 text-xs text-right">
                {Math.floor(tasks / numThreads[0]) + (i < tasks % numThreads[0] ? 1 : 0)} tasks
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex items-center gap-4">
          <Button onClick={() => setIsRunning(true)} disabled={isRunning} size="sm">
            <Play className="w-4 h-4 mr-1" /> Run Computation
          </Button>
          <div className="text-sm">
            Est. Time: <span className="font-mono font-bold">{computeTime.toFixed(2)}s</span>
            <span className="text-muted-foreground ml-2">
              ({((1 - computeTime / baseTime) * 100).toFixed(0)}% faster)
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-2 rounded bg-green-50 dark:bg-green-900/20 border border-green-200">
            <strong className="text-green-700">Parallelized:</strong>
            <p className="text-muted-foreground">Matrix assembly, conduit flow calculations</p>
          </div>
          <div className="p-2 rounded bg-amber-50 dark:bg-amber-900/20 border border-amber-200">
            <strong className="text-amber-700">Not Parallelized:</strong>
            <p className="text-muted-foreground">Linear solver, node updates</p>
          </div>
        </div>
        
        <div className="p-3 rounded-lg bg-muted/50 text-sm">
          <strong>Diminishing returns:</strong> Most effective for large, branched networks. 
          Small or highly looped networks see less benefit due to solver overhead.
        </div>
      </CardContent>
    </Card>
  );
}
