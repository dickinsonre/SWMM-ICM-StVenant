import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Settings2, Workflow, Timer, ToggleLeft, Activity, Play, Pause, RotateCcw, Zap, ArrowRight, Check, X } from "lucide-react";
import { useUnits } from "@/contexts/UnitsContext";

export function ControlLogicBuilderDiagram() {
  const { u, conv } = useUnits();
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
  
  const icmComponents = [
    { id: "regulator", label: "Regulator", desc: "Pump P1", color: "bg-blue-500" },
    { id: "range_hi", label: "Range", desc: `Level > ${conv.length(5.5).toFixed(1)}${u.length}`, color: "bg-amber-500" },
    { id: "range_lo", label: "Range", desc: `Level < ${conv.length(4.5).toFixed(1)}${u.length}`, color: "bg-amber-500" },
    { id: "pid", label: "PID Controller", desc: `SP: ${conv.length(5.0).toFixed(1)}${u.length}`, color: "bg-purple-500" },
    { id: "rule", label: "Rule", desc: "→ Pump Setting", color: "bg-green-500" },
  ];
  
  const swmmCode = `RULE R1
  IF NODE TANK1 DEPTH > 5.5
  THEN PUMP P1 SETTING = 0.0

RULE R2
  IF NODE TANK1 DEPTH < 4.5
  THEN PUMP P1 SETTING = 1.0

RULE R3
  IF NODE TANK1 DEPTH >= 4.5
  AND NODE TANK1 DEPTH <= 5.5
  THEN PUMP P1 SETTING = PID 5.0 0.1 0.0

PRIORITY 2`;

  return (
    <Card className="w-full" data-testid="control-logic-builder-diagram">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Workflow className="w-5 h-5 text-indigo-500" />
          Control Logic Builder: Architecture vs Script
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="p-3 bg-muted/50 rounded-lg text-sm">
          <strong>Scenario:</strong> Maintain Tank 1 water level between {conv.length(4.5).toFixed(1)}{u.length} and {conv.length(5.5).toFixed(1)}{u.length} by modulating Pump 1.
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge className="bg-cyan-600">InfoWorks ICM</Badge>
              <span className="text-xs text-muted-foreground">Component-Based Architecture</span>
            </div>
            
            <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-lg min-h-[280px]">
              <div className="text-xs text-muted-foreground mb-3">Drag & Connect Components</div>
              
              <div className="space-y-2">
                {icmComponents.map((comp, i) => (
                  <motion.div
                    key={comp.id}
                    className={`p-2 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedComponent === comp.id 
                        ? "border-primary ring-2 ring-primary/30" 
                        : "border-transparent"
                    }`}
                    onClick={() => setSelectedComponent(comp.id)}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded ${comp.color}`}></div>
                      <span className="text-xs font-medium">{comp.label}</span>
                      <span className="text-xs text-muted-foreground ml-auto">{comp.desc}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              <svg className="w-full h-16 mt-2" viewBox="0 0 200 50">
                <path d="M 20 10 L 20 40" stroke="#94a3b8" strokeWidth="2" fill="none" />
                <path d="M 20 25 L 60 25 L 60 10" stroke="#94a3b8" strokeWidth="2" fill="none" />
                <path d="M 20 25 L 60 25 L 60 40" stroke="#94a3b8" strokeWidth="2" fill="none" />
                <path d="M 60 25 L 100 25" stroke="#94a3b8" strokeWidth="2" fill="none" />
                <path d="M 100 25 L 140 25" stroke="#94a3b8" strokeWidth="2" fill="none" />
                <path d="M 140 25 L 180 25" stroke="#94a3b8" strokeWidth="2" fill="none" />
                
                <circle cx="20" cy="10" r="4" fill="#3b82f6" />
                <circle cx="60" cy="10" r="4" fill="#f59e0b" />
                <circle cx="60" cy="40" r="4" fill="#f59e0b" />
                <circle cx="100" cy="25" r="4" fill="#a855f7" />
                <circle cx="140" cy="25" r="4" fill="#22c55e" />
                <circle cx="180" cy="25" r="4" fill="#3b82f6" />
                
                <text x="20" y="52" className="text-[6px] fill-slate-500" textAnchor="middle">Regulator</text>
                <text x="60" y="52" className="text-[6px] fill-slate-500" textAnchor="middle">Ranges</text>
                <text x="100" y="52" className="text-[6px] fill-slate-500" textAnchor="middle">PID</text>
                <text x="140" y="52" className="text-[6px] fill-slate-500" textAnchor="middle">Rule</text>
                <text x="180" y="52" className="text-[6px] fill-slate-500" textAnchor="middle">Output</text>
              </svg>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge className="bg-emerald-600">EPA SWMM5</Badge>
              <span className="text-xs text-muted-foreground">Procedural Script</span>
            </div>
            
            <div className="p-4 bg-slate-900 rounded-lg min-h-[280px] font-mono text-xs">
              <div className="text-slate-400 mb-2">; Control Rules Editor</div>
              <pre className="text-green-400 whitespace-pre-wrap leading-relaxed">
                {swmmCode}
              </pre>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="p-3 bg-cyan-50 dark:bg-cyan-900/20 rounded-lg border border-cyan-200">
            <strong className="text-cyan-700 dark:text-cyan-400">ICM Approach:</strong>
            <p className="text-muted-foreground mt-1">Visual programming with modular objects. Build a control "panel" by wiring components together hierarchically.</p>
          </div>
          <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-200">
            <strong className="text-emerald-700 dark:text-emerald-400">SWMM5 Approach:</strong>
            <p className="text-muted-foreground mt-1">Text-based IF-THEN rules evaluated sequentially. Simple and portable but less visual.</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function ExecutionTimelineDiagram() {
  const { u } = useUnits();
  const [isAnimating, setIsAnimating] = useState(false);
  const [step, setStep] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const icmSteps = [
    { phase: "Sense", items: ["Range_Hi", "Range_Lo", "Time", "Flow"], color: "bg-blue-500" },
    { phase: "Process", items: ["Logic Ops", "PID Calc", "Variables"], color: "bg-purple-500" },
    { phase: "Act", items: ["Apply Rules", "Update Regulators"], color: "bg-green-500" },
  ];
  
  const swmmRules = [
    { rule: "R1", condition: "DEPTH > 5.5", action: "PUMP = OFF", result: false },
    { rule: "R2", condition: "DEPTH < 4.5", action: "PUMP = ON", result: false },
    { rule: "R3", condition: "4.5 ≤ DEPTH ≤ 5.5", action: "PID Control", result: true },
  ];
  
  useEffect(() => {
    if (isAnimating) {
      intervalRef.current = setInterval(() => {
        setStep(s => {
          if (s >= 5) {
            setIsAnimating(false);
            return 5;
          }
          return s + 1;
        });
      }, 800);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isAnimating]);
  
  const reset = () => {
    setIsAnimating(false);
    setStep(0);
  };

  return (
    <Card className="w-full" data-testid="execution-timeline-diagram">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Timer className="w-5 h-5 text-amber-500" />
          Execution Timeline: One Time Step
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Simulation Time: t = 1000s</span>
            <Badge variant="outline">Tank Level: {conv.length(5.2).toFixed(1)}{u.length}</Badge>
          </div>
          <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full mt-2">
            <motion.div 
              className="h-full bg-primary rounded-full"
              animate={{ width: `${(step / 5) * 100}%` }}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge className="bg-cyan-600">ICM: State-Based Evaluation</Badge>
            </div>
            
            <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-lg space-y-3">
              {icmSteps.map((phase, i) => (
                <motion.div
                  key={phase.phase}
                  className={`p-2 rounded-lg border-2 transition-all ${
                    step >= i + 1 && step <= i + 2 
                      ? "border-primary bg-white dark:bg-slate-700" 
                      : step > i + 2 
                        ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                        : "border-slate-300 dark:border-slate-600"
                  }`}
                  animate={{ 
                    scale: step === i + 1 ? 1.02 : 1,
                  }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div className={`w-2 h-2 rounded-full ${phase.color}`}></div>
                    <span className="text-xs font-bold">{phase.phase}</span>
                    {step > i + 1 && <Check className="w-3 h-3 text-green-500 ml-auto" />}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {phase.items.map((item, j) => (
                      <Badge 
                        key={j} 
                        variant="outline" 
                        className={`text-[9px] ${step === i + 1 ? "animate-pulse" : ""}`}
                      >
                        {item}
                      </Badge>
                    ))}
                  </div>
                </motion.div>
              ))}
              
              <div className="text-xs text-center text-muted-foreground mt-2">
                All phases execute as a "system snapshot"
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge className="bg-emerald-600">SWMM5: Sequential Rule Firing</Badge>
            </div>
            
            <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-lg space-y-2">
              {swmmRules.map((rule, i) => (
                <motion.div
                  key={rule.rule}
                  className={`p-2 rounded-lg border-2 transition-all ${
                    step === i + 1
                      ? "border-primary bg-white dark:bg-slate-700"
                      : step > i + 1
                        ? rule.result 
                          ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                          : "border-slate-300 dark:border-slate-600 opacity-50"
                        : "border-slate-300 dark:border-slate-600"
                  }`}
                  animate={{
                    scale: step === i + 1 ? 1.02 : 1,
                    x: step === i + 1 ? 5 : 0,
                  }}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold">{rule.rule}</span>
                    {step > i + 1 && (
                      rule.result 
                        ? <Check className="w-3 h-3 text-green-500" />
                        : <X className="w-3 h-3 text-slate-400" />
                    )}
                  </div>
                  <div className="text-[10px] text-muted-foreground mt-1">
                    IF {rule.condition} → {rule.action}
                  </div>
                </motion.div>
              ))}
              
              <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                <ArrowRight className="w-3 h-3" />
                Rules evaluated top-to-bottom
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button onClick={() => setIsAnimating(!isAnimating)} size="sm" disabled={step >= 5}>
            {isAnimating ? <Pause className="w-4 h-4 mr-1" /> : <Play className="w-4 h-4 mr-1" />}
            {isAnimating ? "Pause" : "Execute Step"}
          </Button>
          <Button variant="outline" size="sm" onClick={reset}>
            <RotateCcw className="w-4 h-4 mr-1" /> Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export function ControllerTypesDiagram() {
  const { u } = useUnits();
  const [controlMode, setControlMode] = useState<"onoff" | "pid" | "inc">("onoff");
  const [pGain, setPGain] = useState([1.0]);
  const [iGain, setIGain] = useState([0.1]);
  const [dGain, setDGain] = useState([0.0]);
  const [incStep, setIncStep] = useState([0.1]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [time, setTime] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const setpoint = 5.0;
  
  const generateLevel = (t: number, mode: string): number => {
    if (mode === "onoff") {
      const cycle = Math.sin(t * 0.3) * 0.8;
      return setpoint + cycle + (cycle > 0 ? 0.3 : -0.3);
    } else if (mode === "pid") {
      const damping = 1 - Math.exp(-t * 0.1 * pGain[0]);
      const oscillation = Math.sin(t * 0.5) * Math.exp(-t * 0.05 * (pGain[0] + iGain[0] * 5)) * 0.5;
      return setpoint + (1 - damping) * 1.5 + oscillation;
    } else {
      const steps = Math.floor(t / 2);
      const error = Math.max(0, 1.5 - steps * incStep[0]);
      return setpoint + error * Math.exp(-t * 0.03);
    }
  };
  
  const generatePumpSetting = (t: number, mode: string, level: number): number => {
    if (mode === "onoff") {
      return level > 5.5 ? 0 : level < 4.5 ? 1 : (level > setpoint ? 0.3 : 0.7);
    } else if (mode === "pid") {
      const error = setpoint - level;
      return Math.max(0, Math.min(1, 0.5 + error * pGain[0]));
    } else {
      return Math.max(0, Math.min(1, 0.5 + (setpoint - level) * 0.3));
    }
  };
  
  useEffect(() => {
    if (isAnimating) {
      intervalRef.current = setInterval(() => {
        setTime(t => (t + 0.1) % 30);
      }, 50);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isAnimating]);

  const levelHistory = Array.from({ length: 60 }, (_, i) => generateLevel(i * 0.5, controlMode));
  const pumpHistory = levelHistory.map((l, i) => generatePumpSetting(i * 0.5, controlMode, l));

  return (
    <Card className="w-full" data-testid="controller-types-diagram">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Settings2 className="w-5 h-5 text-purple-500" />
          Controller Types: On/Off vs Modulated
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs value={controlMode} onValueChange={(v) => setControlMode(v as any)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="onoff" data-testid="tab-onoff">
              <ToggleLeft className="w-4 h-4 mr-1" /> Simple On/Off
            </TabsTrigger>
            <TabsTrigger value="pid" data-testid="tab-pid">
              <Activity className="w-4 h-4 mr-1" /> PID Controller
            </TabsTrigger>
            <TabsTrigger value="inc" data-testid="tab-inc">
              <Zap className="w-4 h-4 mr-1" /> Incremental (ICM)
            </TabsTrigger>
          </TabsList>
        </Tabs>
        
        {controlMode === "pid" && (
          <div className="grid grid-cols-3 gap-4 p-3 bg-muted/30 rounded-lg">
            <div className="space-y-1">
              <Label className="text-xs">P Gain: {pGain[0].toFixed(1)}</Label>
              <Slider value={pGain} onValueChange={setPGain} min={0.1} max={3.0} step={0.1} />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">I Gain: {iGain[0].toFixed(2)}</Label>
              <Slider value={iGain} onValueChange={setIGain} min={0} max={0.5} step={0.01} />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">D Gain: {dGain[0].toFixed(2)}</Label>
              <Slider value={dGain} onValueChange={setDGain} min={0} max={0.5} step={0.01} />
            </div>
          </div>
        )}
        
        {controlMode === "inc" && (
          <div className="p-3 bg-muted/30 rounded-lg">
            <div className="space-y-1">
              <Label className="text-xs">Increment Step: {incStep[0].toFixed(2)}</Label>
              <Slider value={incStep} onValueChange={setIncStep} min={0.02} max={0.3} step={0.02} />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              <Badge variant="outline" className="text-[10px]">ICM Only</Badge> Changes pump setting in discrete steps at fixed intervals
            </p>
          </div>
        )}
        
        <div className="space-y-4">
          <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg">
            <div className="text-xs text-muted-foreground mb-2">Tank Level ({u.length})</div>
            <svg viewBox="0 0 400 80" className="w-full h-20">
              <line x1="30" y1="70" x2="380" y2="70" stroke="#94a3b8" strokeWidth="1" />
              <line x1="30" y1="10" x2="30" y2="70" stroke="#94a3b8" strokeWidth="1" />
              
              <line x1="30" y1="40" x2="380" y2="40" stroke="#22c55e" strokeWidth="1" strokeDasharray="4,4" />
              <text x="385" y="43" className="text-[8px] fill-green-600">SP: 5.0{u.length}</text>
              
              <line x1="30" y1="20" x2="380" y2="20" stroke="#ef4444" strokeWidth="1" strokeDasharray="2,2" opacity="0.5" />
              <line x1="30" y1="60" x2="380" y2="60" stroke="#ef4444" strokeWidth="1" strokeDasharray="2,2" opacity="0.5" />
              
              <polyline
                points={levelHistory.map((l, i) => {
                  const x = 30 + i * 5.8;
                  const y = 40 - (l - setpoint) * 30;
                  return `${x},${Math.max(10, Math.min(70, y))}`;
                }).join(" ")}
                fill="none"
                stroke="#3b82f6"
                strokeWidth="2"
              />
              
              <motion.circle
                cx={30 + (time * 2) * 5.8}
                cy={40 - (generateLevel(time * 2, controlMode) - setpoint) * 30}
                r="4"
                fill="#3b82f6"
                animate={{ 
                  cx: 30 + (time * 2) * 5.8,
                  cy: Math.max(10, Math.min(70, 40 - (generateLevel(time * 2, controlMode) - setpoint) * 30))
                }}
              />
            </svg>
          </div>
          
          <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg">
            <div className="text-xs text-muted-foreground mb-2">Pump Setting (0-1)</div>
            <svg viewBox="0 0 400 60" className="w-full h-16">
              <line x1="30" y1="55" x2="380" y2="55" stroke="#94a3b8" strokeWidth="1" />
              <line x1="30" y1="5" x2="30" y2="55" stroke="#94a3b8" strokeWidth="1" />
              
              <polyline
                points={pumpHistory.map((p, i) => {
                  const x = 30 + i * 5.8;
                  const y = 55 - p * 45;
                  return `${x},${y}`;
                }).join(" ")}
                fill="none"
                stroke="#f59e0b"
                strokeWidth="2"
              />
              
              <motion.circle
                cx={30 + (time * 2) * 5.8}
                cy={55 - generatePumpSetting(time * 2, controlMode, generateLevel(time * 2, controlMode)) * 45}
                r="4"
                fill="#f59e0b"
              />
            </svg>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button onClick={() => setIsAnimating(!isAnimating)} size="sm">
            {isAnimating ? <Pause className="w-4 h-4 mr-1" /> : <Play className="w-4 h-4 mr-1" />}
            {isAnimating ? "Pause" : "Animate"}
          </Button>
          <Button variant="outline" size="sm" onClick={() => setTime(0)}>
            <RotateCcw className="w-4 h-4 mr-1" /> Reset
          </Button>
        </div>
        
        <div className={`p-3 rounded-lg border-2 ${
          controlMode === "onoff" ? "border-amber-500 bg-amber-50 dark:bg-amber-900/20" :
          controlMode === "pid" ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20" :
          "border-cyan-500 bg-cyan-50 dark:bg-cyan-900/20"
        }`}>
          {controlMode === "onoff" && (
            <p className="text-sm"><strong className="text-amber-600">Simple On/Off:</strong> Binary control causes oscillation. Level swings widely around setpoint. Equipment cycles frequently.</p>
          )}
          {controlMode === "pid" && (
            <p className="text-sm"><strong className="text-purple-600">PID Controller:</strong> Proportional-Integral-Derivative control provides smooth modulation. Level converges to setpoint with minimal overshoot.</p>
          )}
          {controlMode === "inc" && (
            <p className="text-sm"><strong className="text-cyan-600">Incremental (ICM Only):</strong> Changes setting in discrete steps at fixed intervals. Provides stepped response—useful for equipment that can't handle continuous modulation.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
