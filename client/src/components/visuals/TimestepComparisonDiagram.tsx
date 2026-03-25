import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Play, 
  Pause,
  RotateCcw,
  ChevronRight,
  AlertTriangle,
  CheckCircle,
  Clock,
  Zap,
  Activity
} from "lucide-react";

type WaveType = "gentle" | "surge" | "dry";

interface SimulationState {
  time: number;
  fixedPoints: { time: number; value: number; error: "good" | "warning" | "error" }[];
  adaptivePoints: { time: number; value: number; dt: number }[];
  fixedComputations: number;
  adaptiveComputations: number;
}

export function TimestepComparisonDiagram() {
  const [waveType, setWaveType] = useState<WaveType>("surge");
  const [fixedDt, setFixedDt] = useState([10]);
  const [minDt, setMinDt] = useState([0.5]);
  const [maxDt, setMaxDt] = useState([30]);
  const [tolerance, setTolerance] = useState([0.01]);
  
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [stepMode, setStepMode] = useState(false);
  const [simState, setSimState] = useState<SimulationState>({
    time: 0,
    fixedPoints: [],
    adaptivePoints: [],
    fixedComputations: 0,
    adaptiveComputations: 0,
  });
  const [statusMessage, setStatusMessage] = useState({ fixed: "", adaptive: "" });
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const simStateRef = useRef(simState);
  simStateRef.current = simState;
  
  const getWaveValue = (t: number, type: WaveType): number => {
    switch (type) {
      case "gentle":
        return 0.3 + 0.2 * Math.sin(t * 0.1);
      case "surge":
        if (t < 20) return 0.1;
        if (t < 30) return 0.1 + 0.8 * ((t - 20) / 10);
        if (t < 50) return 0.9;
        return Math.max(0.1, 0.9 - 0.4 * ((t - 50) / 30));
      case "dry":
        if (t < 15) return 0;
        if (t < 25) return 0.6 * ((t - 15) / 10);
        return 0.6 * Math.exp(-(t - 25) * 0.03);
      default:
        return 0.3;
    }
  };
  
  const getWaveDerivative = (t: number, type: WaveType): number => {
    const dt = 0.1;
    return Math.abs(getWaveValue(t + dt, type) - getWaveValue(t, type)) / dt;
  };
  
  const getCourantNumber = (dt: number, waveSpeed: number = 5, dx: number = 100): number => {
    return (waveSpeed * dt) / dx;
  };
  
  const runSimulation = () => {
    if (isAnimating && !isPaused) {
      setIsPaused(true);
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = null;
      return;
    }
    
    if (isPaused) {
      setIsPaused(false);
      startAnimation();
      return;
    }
    
    setIsAnimating(true);
    setIsPaused(false);
    setStepMode(false);
    setSimState({
      time: 0,
      fixedPoints: [],
      adaptivePoints: [],
      fixedComputations: 0,
      adaptiveComputations: 0,
    });
    
    startAnimation();
  };
  
  const startAnimation = () => {
    let simTime = simStateRef.current.time;
    let fixedNextTime = simTime;
    let adaptiveNextTime = simTime;
    let adaptiveCurrentDt = (minDt[0] + maxDt[0]) / 2;
    
    const fixedPts = [...simStateRef.current.fixedPoints];
    const adaptivePts = [...simStateRef.current.adaptivePoints];
    let fixedComps = simStateRef.current.fixedComputations;
    let adaptiveComps = simStateRef.current.adaptiveComputations;
    
    intervalRef.current = setInterval(() => {
      simTime += 0.5;
      
      if (simTime >= fixedNextTime) {
        const currentFixedTime = fixedNextTime;
        const value = getWaveValue(currentFixedTime, waveType);
        const derivative = getWaveDerivative(currentFixedTime, waveType);
        const courant = getCourantNumber(fixedDt[0]);
        
        let error: "good" | "warning" | "error" = "good";
        if (courant > 1.5 || (derivative > 0.05 && fixedDt[0] > 15)) {
          error = "error";
        } else if (courant > 0.8 || (derivative > 0.03 && fixedDt[0] > 10)) {
          error = "warning";
        }
        
        fixedPts.push({ time: currentFixedTime, value, error });
        fixedNextTime += fixedDt[0];
        fixedComps++;
        
        setStatusMessage(prev => ({
          ...prev,
          fixed: `Computed at t=${currentFixedTime.toFixed(1)}s. Fixed Δt=${fixedDt[0]}s`
        }));
      }
      
      if (simTime >= adaptiveNextTime) {
        const currentAdaptiveTime = adaptiveNextTime;
        const value = getWaveValue(currentAdaptiveTime, waveType);
        const derivative = getWaveDerivative(currentAdaptiveTime, waveType);
        
        const activity = derivative / 0.1;
        const targetDt = maxDt[0] - (maxDt[0] - minDt[0]) * Math.min(1, activity * (1 + tolerance[0] * 100));
        
        const dtChange = (targetDt - adaptiveCurrentDt) * 0.3;
        adaptiveCurrentDt = Math.max(minDt[0], Math.min(maxDt[0], adaptiveCurrentDt + dtChange));
        
        adaptivePts.push({ time: currentAdaptiveTime, value, dt: adaptiveCurrentDt });
        adaptiveNextTime += adaptiveCurrentDt;
        adaptiveComps++;
        
        if (derivative > 0.03) {
          setStatusMessage(prev => ({
            ...prev,
            adaptive: `t=${currentAdaptiveTime.toFixed(1)}s: High activity → Δt=${adaptiveCurrentDt.toFixed(1)}s`
          }));
        } else {
          setStatusMessage(prev => ({
            ...prev,
            adaptive: `t=${currentAdaptiveTime.toFixed(1)}s: Stable → Δt=${adaptiveCurrentDt.toFixed(1)}s`
          }));
        }
      }
      
      setSimState({
        time: simTime,
        fixedPoints: fixedPts,
        adaptivePoints: adaptivePts,
        fixedComputations: fixedComps,
        adaptiveComputations: adaptiveComps,
      });
      
      if (simTime >= 100) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        intervalRef.current = null;
        setIsAnimating(false);
        setIsPaused(false);
      }
    }, 50);
  };
  
  const stepForward = () => {
    let currentState = simStateRef.current;
    
    if (!stepMode) {
      setStepMode(true);
      setIsAnimating(true);
      setIsPaused(true);
      currentState = {
        time: 0,
        fixedPoints: [],
        adaptivePoints: [],
        fixedComputations: 0,
        adaptiveComputations: 0,
      };
      setSimState(currentState);
    }
    const fixedPts = [...currentState.fixedPoints];
    const adaptivePts = [...currentState.adaptivePoints];
    
    const lastFixedTime = fixedPts.length > 0 ? fixedPts[fixedPts.length - 1].time : 0;
    const fixedTime = lastFixedTime + fixedDt[0];
    
    const fixedValue = getWaveValue(fixedTime, waveType);
    const fixedDerivative = getWaveDerivative(fixedTime, waveType);
    const courant = getCourantNumber(fixedDt[0]);
    
    let error: "good" | "warning" | "error" = "good";
    if (courant > 1.5 || (fixedDerivative > 0.05 && fixedDt[0] > 15)) {
      error = "error";
    } else if (courant > 0.8 || (fixedDerivative > 0.03 && fixedDt[0] > 10)) {
      error = "warning";
    }
    
    fixedPts.push({ time: fixedTime, value: fixedValue, error });
    
    const lastAdaptiveTime = adaptivePts.length > 0 ? adaptivePts[adaptivePts.length - 1].time : 0;
    const lastAdaptiveDt = adaptivePts.length > 0 ? adaptivePts[adaptivePts.length - 1].dt : maxDt[0];
    
    const adaptiveDerivative = getWaveDerivative(lastAdaptiveTime, waveType);
    const activity = adaptiveDerivative / 0.1;
    const targetDt = maxDt[0] - (maxDt[0] - minDt[0]) * Math.min(1, activity * (1 + tolerance[0] * 100));
    const newDt = Math.max(minDt[0], Math.min(maxDt[0], lastAdaptiveDt + (targetDt - lastAdaptiveDt) * 0.5));
    
    const adaptiveTime = lastAdaptiveTime + newDt;
    const adaptiveValue = getWaveValue(adaptiveTime, waveType);
    adaptivePts.push({ time: adaptiveTime, value: adaptiveValue, dt: newDt });
    
    const maxTime = Math.max(fixedTime, adaptiveTime);
    
    setSimState({
      time: maxTime,
      fixedPoints: fixedPts,
      adaptivePoints: adaptivePts,
      fixedComputations: currentState.fixedComputations + 1,
      adaptiveComputations: currentState.adaptiveComputations + 1,
    });
    
    setStatusMessage({
      fixed: `Step ${currentState.fixedComputations + 1}: t=${fixedTime.toFixed(1)}s, Δt=${fixedDt[0]}s (fixed)`,
      adaptive: adaptiveDerivative > 0.03 
        ? `Step ${currentState.adaptiveComputations + 1}: t=${adaptiveTime.toFixed(1)}s, High activity → Δt=${newDt.toFixed(1)}s`
        : `Step ${currentState.adaptiveComputations + 1}: t=${adaptiveTime.toFixed(1)}s, Stable → Δt=${newDt.toFixed(1)}s`
    });
    
    if (maxTime >= 100) {
      setIsAnimating(false);
      setIsPaused(false);
      setStepMode(false);
    }
  };
  
  const reset = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = null;
    setIsAnimating(false);
    setIsPaused(false);
    setStepMode(false);
    setSimState({
      time: 0,
      fixedPoints: [],
      adaptivePoints: [],
      fixedComputations: 0,
      adaptiveComputations: 0,
    });
    setStatusMessage({ fixed: "", adaptive: "" });
  };
  
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);
  
  const courant = getCourantNumber(fixedDt[0]);
  const courantStatus = courant > 1.5 ? "error" : courant > 0.8 ? "warning" : "good";
  
  const renderWavePath = (points: { time: number; value: number }[], maxTime: number) => {
    if (points.length < 2) return "";
    return points.map((p, i) => `${i === 0 ? "M" : "L"} ${(p.time / maxTime) * 280 + 10},${80 - p.value * 60}`).join(" ");
  };
  
  const trueWavePath = Array.from({ length: 101 }, (_, i) => ({
    time: i,
    value: getWaveValue(i, waveType)
  }));

  return (
    <Card className="border-2 border-orange-500/30 bg-gradient-to-br from-orange-500/5 to-background">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Clock className="h-5 w-5 text-orange-500" />
          Fixed vs Adaptive Time-Stepping
          <Badge variant="outline" className="ml-auto text-orange-600 border-orange-500">Hydraulic Wave Runner</Badge>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Compare how fixed and adaptive time-stepping handle the same hydraulic wave event
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="space-y-1">
            <Label className="text-xs">Test Wave</Label>
            <Select value={waveType} onValueChange={(v) => setWaveType(v as WaveType)}>
              <SelectTrigger className="w-36 h-8 text-xs" data-testid="select-wave-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gentle">Gentle Ramp</SelectItem>
                <SelectItem value="surge">Sharp Surge</SelectItem>
                <SelectItem value="dry">Dry Start</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex gap-2">
            <Button 
              onClick={runSimulation} 
              size="sm"
              className="h-8"
              data-testid="button-run-simulation"
            >
              {isAnimating && !isPaused ? <Pause className="h-4 w-4 mr-1" /> : <Play className="h-4 w-4 mr-1" />}
              {isAnimating && !isPaused ? "Pause" : isPaused ? "Resume" : "Run"}
            </Button>
            <Button 
              onClick={stepForward} 
              variant="outline" 
              size="sm"
              className="h-8"
              disabled={isAnimating && !isPaused && !stepMode}
              data-testid="button-step-forward"
            >
              <ChevronRight className="h-4 w-4 mr-1" />
              Step
            </Button>
            <Button 
              onClick={reset} 
              variant="ghost" 
              size="sm"
              className="h-8"
              data-testid="button-reset-timestep"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="ml-auto flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span className="font-mono">{simState.time.toFixed(1)}s</span>
            </div>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-blue-500/5 border border-blue-500/30 rounded-lg p-3 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-blue-600 dark:text-blue-400 text-sm flex items-center gap-2">
                <Activity className="h-4 w-4" />
                SWMM5 Fixed Time Step
              </h4>
              <div className={`flex items-center gap-1 text-[10px] px-2 py-0.5 rounded ${
                courantStatus === "error" ? "bg-red-500/20 text-red-600" :
                courantStatus === "warning" ? "bg-amber-500/20 text-amber-600" :
                "bg-emerald-500/20 text-emerald-600"
              }`} data-testid="indicator-courant">
                {courantStatus === "error" && <AlertTriangle className="h-3 w-3" />}
                {courantStatus === "good" && <CheckCircle className="h-3 w-3" />}
                Cr = {courant.toFixed(2)}
              </div>
            </div>
            
            <div className="relative h-24 bg-muted/30 rounded border border-border overflow-hidden">
              <svg role="img" aria-label="Timestep comparison dashboard" className="w-full h-full" viewBox="0 0 300 100" preserveAspectRatio="none" aria-hidden="true">
                <path
                  d={renderWavePath(trueWavePath, 100)}
                  fill="none"
                  className="stroke-slate-300 dark:stroke-slate-600 stroke-1"
                  strokeDasharray="2,2"
                />
                
                {simState.fixedPoints.length > 1 && (
                  <path
                    d={renderWavePath(simState.fixedPoints, 100)}
                    fill="none"
                    className="stroke-blue-500 stroke-2"
                  />
                )}
                
                {simState.fixedPoints.map((p, i) => (
                  <circle
                    key={i}
                    cx={(p.time / 100) * 280 + 10}
                    cy={80 - p.value * 60}
                    r="3"
                    className={
                      p.error === "error" ? "fill-red-500" :
                      p.error === "warning" ? "fill-amber-500" :
                      "fill-emerald-500"
                    }
                  />
                ))}
              </svg>
              
              <div className="absolute bottom-1 left-1 right-1 h-6 bg-background/80 rounded flex items-center px-2">
                {Array.from({ length: Math.ceil(100 / fixedDt[0]) }).map((_, i) => (
                  <div 
                    key={i}
                    className={`h-3 w-0.5 ${i * fixedDt[0] <= simState.time ? "bg-blue-500" : "bg-slate-300"}`}
                    style={{ marginLeft: i === 0 ? 0 : `${(fixedDt[0] / 100) * 100}%` }}
                  />
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label className="text-xs">Routing Δt: <span className="font-mono text-blue-500">{fixedDt[0]}s</span></Label>
              <Slider
                value={fixedDt}
                onValueChange={setFixedDt}
                min={1}
                max={30}
                step={1}
                disabled={isAnimating && !isPaused}
                data-testid="slider-fixed-dt"
              />
            </div>
            
            <div className="flex justify-between text-[10px] text-muted-foreground">
              <span>Computations: <span className="font-mono text-blue-500">{simState.fixedComputations}</span></span>
              <span className="text-blue-600 dark:text-blue-400 italic">Steady metronome</span>
            </div>
            
            {statusMessage.fixed && (
              <div className="text-[10px] bg-blue-500/10 rounded p-2 text-blue-700 dark:text-blue-300">
                {statusMessage.fixed}
              </div>
            )}
          </div>
          
          <div className="bg-emerald-500/5 border border-emerald-500/30 rounded-lg p-3 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-emerald-600 dark:text-emerald-400 text-sm flex items-center gap-2">
                <Zap className="h-4 w-4" />
                ICM Adaptive Time Step
              </h4>
              <div className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-600">
                <CheckCircle className="h-3 w-3" />
                Auto-optimized
              </div>
            </div>
            
            <div className="relative h-24 bg-muted/30 rounded border border-border overflow-hidden">
              <svg className="w-full h-full" viewBox="0 0 300 100" preserveAspectRatio="none" aria-hidden="true">
                <path
                  d={renderWavePath(trueWavePath, 100)}
                  fill="none"
                  className="stroke-slate-300 dark:stroke-slate-600 stroke-1"
                  strokeDasharray="2,2"
                />
                
                {simState.adaptivePoints.length > 1 && (
                  <path
                    d={renderWavePath(simState.adaptivePoints, 100)}
                    fill="none"
                    className="stroke-emerald-500 stroke-2"
                  />
                )}
                
                {simState.adaptivePoints.map((p, i) => (
                  <circle
                    key={i}
                    cx={(p.time / 100) * 280 + 10}
                    cy={80 - p.value * 60}
                    r="3"
                    className="fill-emerald-500"
                  />
                ))}
              </svg>
              
              <div className="absolute bottom-1 left-1 right-1 h-6 bg-background/80 rounded flex items-center overflow-hidden">
                {simState.adaptivePoints.map((p, i) => (
                  <motion.div 
                    key={i}
                    className="h-3 w-0.5 bg-emerald-500"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{ marginLeft: i === 0 ? `${(p.time / 100) * 100}%` : `${((p.time - simState.adaptivePoints[i-1].time) / 100) * 100}%` }}
                  />
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-2">
              <div className="space-y-1">
                <Label className="text-[10px]">Min Δt: {minDt[0]}s</Label>
                <Slider
                  value={minDt}
                  onValueChange={setMinDt}
                  min={0.1}
                  max={5}
                  step={0.1}
                  disabled={isAnimating && !isPaused}
                  data-testid="slider-min-dt"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-[10px]">Max Δt: {maxDt[0]}s</Label>
                <Slider
                  value={maxDt}
                  onValueChange={setMaxDt}
                  min={10}
                  max={60}
                  step={1}
                  disabled={isAnimating && !isPaused}
                  data-testid="slider-max-dt"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-[10px]">Tolerance</Label>
                <Slider
                  value={tolerance}
                  onValueChange={setTolerance}
                  min={0.001}
                  max={0.1}
                  step={0.001}
                  disabled={isAnimating && !isPaused}
                  data-testid="slider-tolerance-adaptive"
                />
              </div>
            </div>
            
            <div className="flex justify-between text-[10px] text-muted-foreground">
              <span>Computations: <span className="font-mono text-emerald-500">{simState.adaptiveComputations}</span></span>
              <span className="text-emerald-600 dark:text-emerald-400 italic">Adaptive rhythm</span>
            </div>
            
            {statusMessage.adaptive && (
              <div className="text-[10px] bg-emerald-500/10 rounded p-2 text-emerald-700 dark:text-emerald-300">
                {statusMessage.adaptive}
              </div>
            )}
          </div>
        </div>
        
        {simState.adaptivePoints.length > 5 && (
          <div className="bg-muted/30 rounded-lg border border-border p-3">
            <div className="text-xs font-semibold text-muted-foreground mb-2">Adaptive Δt Over Time</div>
            <svg className="w-full h-12" viewBox="0 0 300 40" preserveAspectRatio="none" aria-hidden="true">
              {simState.adaptivePoints.length > 1 && (
                <path
                  d={simState.adaptivePoints.map((p, i) => 
                    `${i === 0 ? "M" : "L"} ${(p.time / 100) * 290 + 5},${35 - (p.dt / maxDt[0]) * 30}`
                  ).join(" ")}
                  fill="none"
                  className="stroke-emerald-500 stroke-2"
                />
              )}
              <line x1="0" y1="35" x2="300" y2="35" className="stroke-border stroke-1" />
              <text x="5" y="10" className="text-[8px] fill-muted-foreground">Δt</text>
            </svg>
          </div>
        )}
        
        <div className="grid grid-cols-3 gap-3 text-[10px]">
          <div className="bg-blue-500/10 border border-blue-500/30 rounded p-2">
            <div className="font-semibold text-blue-600 dark:text-blue-400 mb-1">Stability vs Speed</div>
            <p className="text-muted-foreground">Small fixed Δt is stable but slow. Large fixed Δt is fast but may crash.</p>
          </div>
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded p-2">
            <div className="font-semibold text-emerald-600 dark:text-emerald-400 mb-1">Adaptive Efficiency</div>
            <p className="text-muted-foreground">Spends effort only when needed. Fast during calm, precise during surges.</p>
          </div>
          <div className="bg-amber-500/10 border border-amber-500/30 rounded p-2">
            <div className="font-semibold text-amber-600 dark:text-amber-400 mb-1">Courant Condition</div>
            <p className="text-muted-foreground">Cr = (v·Δt)/Δx. Cr &gt; 1 risks instability in explicit schemes.</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
