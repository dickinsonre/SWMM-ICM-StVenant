import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  CloudRain, 
  Droplets, 
  Play, 
  Pause,
  RotateCcw,
  Layers,
  Waves,
  Beaker,
  ArrowRight,
  Timer
} from "lucide-react";

export function RunoffProcessDiagram() {
  const [rainfallIntensity, setRainfallIntensity] = useState([1.0]);
  const [depressionStorage, setDepressionStorage] = useState([0.1]);
  const [maxInfiltration, setMaxInfiltration] = useState([3.0]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [time, setTime] = useState(0);
  const [runoffData, setRunoffData] = useState<number[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const rainfall = rainfallIntensity[0];
  const depStorage = depressionStorage[0];
  const maxInfil = maxInfiltration[0];
  
  const depFillLevel = Math.min(1, time * rainfall * 0.1 / depStorage);
  const currentInfil = maxInfil * Math.exp(-time * 0.05);
  const excessRainfall = Math.max(0, rainfall - currentInfil);
  const runoffRate = depFillLevel >= 1 ? excessRainfall * 0.8 : 0;
  
  const simulate = () => {
    if (isAnimating) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = null;
      setIsAnimating(false);
      return;
    }
    
    setIsAnimating(true);
    setTime(0);
    setRunoffData([]);
    
    const data: number[] = [];
    let step = 0;
    
    intervalRef.current = setInterval(() => {
      step++;
      const t = step * 0.5;
      setTime(t);
      
      const fill = Math.min(1, t * rainfall * 0.1 / depStorage);
      const infil = maxInfil * Math.exp(-t * 0.05);
      const excess = Math.max(0, rainfall - infil);
      const runoff = fill >= 1 ? excess * 0.8 : 0;
      
      data.push(runoff);
      setRunoffData([...data]);
      
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
    setRunoffData([]);
  };
  
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <Card className="border-2 border-sky-500/30 bg-gradient-to-br from-sky-500/5 to-background">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <CloudRain className="h-5 w-5 text-sky-500" />
          Subcatchment Runoff Process
          <Badge variant="outline" className="ml-auto text-sky-600 border-sky-500">SWMM5 Hydrology</Badge>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          How rainfall transforms into runoff through infiltration and depression storage
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="relative h-72 bg-gradient-to-b from-sky-100/20 to-amber-100/20 dark:from-sky-900/20 dark:to-amber-900/20 rounded-lg border border-border overflow-hidden">
            <svg className="w-full h-full" viewBox="0 0 200 180" aria-hidden="true">
              {isAnimating && Array.from({ length: 8 }).map((_, i) => (
                <motion.circle
                  key={i}
                  cx={20 + i * 22}
                  cy={10}
                  r="2"
                  className="fill-sky-400"
                  animate={{ y: [0, 50, 100] }}
                  transition={{ duration: 0.8, delay: i * 0.1, repeat: Infinity }}
                />
              ))}
              
              <rect x="10" y="80" width="85" height="90" className="fill-slate-400/50" />
              <text x="52" y="95" textAnchor="middle" className="text-[8px] fill-slate-600 font-semibold">IMPERVIOUS</text>
              
              <rect x="105" y="80" width="85" height="90" className="fill-amber-600/30" />
              <text x="147" y="95" textAnchor="middle" className="text-[8px] fill-amber-700 font-semibold">PERVIOUS</text>
              
              <rect x="30" y={130 - depFillLevel * 20} width="45" height={depFillLevel * 20} className="fill-sky-400/60" rx="2" />
              <rect x="30" y="110" width="45" height="20" className="fill-none stroke-slate-500 stroke-1" rx="2" />
              <text x="52" y="145" textAnchor="middle" className="text-[6px] fill-slate-500">Depression</text>
              
              {isAnimating && (
                <g>
                  <motion.rect
                    x="125"
                    y="100"
                    width="45"
                    height={currentInfil * 5}
                    className="fill-sky-300/40"
                    initial={{ opacity: 0.3 }}
                    animate={{ opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                  <motion.path
                    d="M 147 100 L 147 130 L 145 125 M 147 130 L 149 125"
                    className="stroke-sky-400 fill-none stroke-1"
                    initial={{ opacity: 0.5 }}
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                  />
                </g>
              )}
              <text x="147" y="145" textAnchor="middle" className="text-[6px] fill-amber-600">Infiltration</text>
              
              {runoffRate > 0 && (
                <motion.g
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 0.3, repeat: Infinity }}
                >
                  <rect x="85" y="165" width="20" height="8" className="fill-blue-500" rx="2" />
                  <path d="M 105 169 L 115 169" className="stroke-blue-500 stroke-2" />
                  <text x="130" y="172" className="text-[7px] fill-blue-600 font-bold">RUNOFF</text>
                </motion.g>
              )}
              
              <text x="10" y="178" className="text-[7px] fill-muted-foreground">
                t = {time.toFixed(1)}s | Infil = {currentInfil.toFixed(2)} in/hr | Runoff = {runoffRate.toFixed(2)} in/hr
              </text>
            </svg>
            
            <div className={`absolute top-2 right-2 text-[9px] font-mono px-2 py-1 rounded border ${
              depFillLevel >= 1 ? "bg-blue-500/20 border-blue-500 text-blue-600" : "bg-amber-500/20 border-amber-500 text-amber-600"
            }`} data-testid="text-runoff-status">
              {depFillLevel >= 1 ? "Runoff Active" : "Filling Depression"}
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="h-24 bg-muted/30 rounded-lg border border-border p-2">
              <div className="text-[9px] text-muted-foreground mb-1">Runoff Hydrograph</div>
              <svg className="w-full h-16" viewBox="0 0 120 40" preserveAspectRatio="none" aria-hidden="true">
                <line x1="0" y1="35" x2="120" y2="35" className="stroke-border stroke-1" />
                {runoffData.length > 1 && (
                  <path
                    d={`M 0,35 ${runoffData.map((v, i) => `L ${i * 2},${35 - v * 15}`).join(' ')}`}
                    fill="none"
                    className="stroke-blue-500 stroke-2"
                  />
                )}
              </svg>
            </div>
            
            <div className="flex gap-2">
              <Button 
                onClick={simulate} 
                className="flex-1"
                data-testid="button-simulate-runoff"
              >
                {isAnimating ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                {isAnimating ? "Pause" : "Start Rain"}
              </Button>
              <Button variant="outline" onClick={reset} data-testid="button-reset-runoff">
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm">Rainfall: <span className="font-mono text-primary">{rainfall.toFixed(1)} in/hr</span></Label>
              <Slider value={rainfallIntensity} onValueChange={setRainfallIntensity} min={0.5} max={3.0} step={0.1} data-testid="slider-rainfall" />
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm">Depression Storage: <span className="font-mono text-primary">{depStorage.toFixed(2)} in</span></Label>
              <Slider value={depressionStorage} onValueChange={setDepressionStorage} min={0.01} max={0.3} step={0.01} data-testid="slider-depression" />
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm">Max Infiltration: <span className="font-mono text-primary">{maxInfil.toFixed(1)} in/hr</span></Label>
              <Slider value={maxInfiltration} onValueChange={setMaxInfiltration} min={0.5} max={5.0} step={0.1} data-testid="slider-infiltration" />
            </div>
          </div>
        </div>
        
        <div className="bg-sky-500/10 border border-sky-500/30 rounded-lg p-3 text-xs">
          <p className="text-muted-foreground">
            <strong className="text-sky-600 dark:text-sky-400">Key concept:</strong> Runoff begins only after depression storage is filled. 
            Infiltration decreases exponentially over time as soil saturates.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export function RTKDiagram() {
  const [r1, setR1] = useState([0.3]);
  const [t1, setT1] = useState([1]);
  const [k1, setK1] = useState([2]);
  const [r2, setR2] = useState([0.2]);
  const [t2, setT2] = useState([4]);
  const [k2, setK2] = useState([4]);
  const [r3, setR3] = useState([0.1]);
  const [t3, setT3] = useState([8]);
  const [k3, setK3] = useState([8]);
  
  const generateUH = (r: number, t: number, k: number, time: number) => {
    if (time < 0) return 0;
    const peak = r * 2;
    if (time <= t) {
      return peak * (time / t);
    } else {
      return peak * Math.exp(-(time - t) / k);
    }
  };
  
  const timePoints = Array.from({ length: 30 }, (_, i) => i);
  const uh1 = timePoints.map(t => generateUH(r1[0], t1[0], k1[0], t));
  const uh2 = timePoints.map(t => generateUH(r2[0], t2[0], k2[0], t));
  const uh3 = timePoints.map(t => generateUH(r3[0], t3[0], k3[0], t));
  const composite = timePoints.map((_, i) => uh1[i] + uh2[i] + uh3[i]);
  
  const maxVal = Math.max(...composite, 1);
  
  const pathFromData = (data: number[], height: number, width: number) => {
    const scaleX = width / (data.length - 1);
    const scaleY = height / maxVal;
    return `M 0,${height} ${data.map((v, i) => `L ${i * scaleX},${height - v * scaleY}`).join(' ')} L ${width},${height}`;
  };

  return (
    <Card className="border-2 border-violet-500/30 bg-gradient-to-br from-violet-500/5 to-background">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Waves className="h-5 w-5 text-violet-500" />
          RTK Unit Hydrograph (RDII)
          <Badge variant="outline" className="ml-auto text-violet-600 border-violet-500">SWMM5 Hydrology</Badge>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          R (Response), T (Time to Peak), K (Recession) parameters shape RDII inflow
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="bg-muted/30 rounded-lg border border-border p-3">
              <div className="text-[10px] text-muted-foreground mb-2">Rainfall Input (Hyetograph)</div>
              <div className="flex items-end gap-1 h-8">
                {[0.5, 1.0, 0.8, 0.3, 0.1].map((v, i) => (
                  <div key={i} className="flex-1 bg-sky-500 rounded-t" style={{ height: `${v * 100}%` }} />
                ))}
              </div>
            </div>
            
            <div className="bg-muted/30 rounded-lg border border-border p-3">
              <div className="text-[10px] text-muted-foreground mb-2">Individual Unit Hydrographs</div>
              <svg className="w-full h-20" viewBox="0 0 120 50" preserveAspectRatio="none" aria-hidden="true">
                <path d={pathFromData(uh1, 45, 115)} className="fill-blue-500/30 stroke-blue-500 stroke-1" />
                <path d={pathFromData(uh2, 45, 115)} className="fill-emerald-500/30 stroke-emerald-500 stroke-1" />
                <path d={pathFromData(uh3, 45, 115)} className="fill-amber-500/30 stroke-amber-500 stroke-1" />
              </svg>
              <div className="flex gap-4 text-[8px] mt-1">
                <div className="flex items-center gap-1"><div className="w-2 h-2 bg-blue-500 rounded" /> Fast</div>
                <div className="flex items-center gap-1"><div className="w-2 h-2 bg-emerald-500 rounded" /> Medium</div>
                <div className="flex items-center gap-1"><div className="w-2 h-2 bg-amber-500 rounded" /> Slow</div>
              </div>
            </div>
            
            <div className="bg-violet-500/10 border-2 border-violet-500/30 rounded-lg p-3">
              <div className="text-[10px] text-violet-600 dark:text-violet-400 font-semibold mb-2">Composite RDII Inflow</div>
              <svg className="w-full h-16" viewBox="0 0 120 45" preserveAspectRatio="none" aria-hidden="true">
                <path d={pathFromData(composite, 40, 115)} className="fill-violet-500/40 stroke-violet-500 stroke-2" />
              </svg>
              <div className="text-[8px] text-muted-foreground mt-1" data-testid="text-rdii-peak">
                Peak: {Math.max(...composite).toFixed(2)} | Volume: {composite.reduce((a, b) => a + b, 0).toFixed(1)}
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-2 space-y-2">
              <div className="text-xs font-semibold text-blue-600 dark:text-blue-400">Fast Response (UH1)</div>
              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-1">
                  <Label className="text-[10px]">R: {r1[0].toFixed(2)}</Label>
                  <Slider value={r1} onValueChange={setR1} min={0.05} max={0.5} step={0.01} data-testid="slider-r1" />
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px]">T: {t1[0]}hr</Label>
                  <Slider value={t1} onValueChange={setT1} min={0.5} max={4} step={0.5} data-testid="slider-t1" />
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px]">K: {k1[0]}</Label>
                  <Slider value={k1} onValueChange={setK1} min={1} max={6} step={0.5} data-testid="slider-k1" />
                </div>
              </div>
            </div>
            
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-2 space-y-2">
              <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">Medium Response (UH2)</div>
              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-1">
                  <Label className="text-[10px]">R: {r2[0].toFixed(2)}</Label>
                  <Slider value={r2} onValueChange={setR2} min={0.05} max={0.4} step={0.01} data-testid="slider-r2" />
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px]">T: {t2[0]}hr</Label>
                  <Slider value={t2} onValueChange={setT2} min={2} max={8} step={0.5} data-testid="slider-t2" />
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px]">K: {k2[0]}</Label>
                  <Slider value={k2} onValueChange={setK2} min={2} max={10} step={0.5} data-testid="slider-k2" />
                </div>
              </div>
            </div>
            
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-2 space-y-2">
              <div className="text-xs font-semibold text-amber-600 dark:text-amber-400">Slow Response (UH3)</div>
              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-1">
                  <Label className="text-[10px]">R: {r3[0].toFixed(2)}</Label>
                  <Slider value={r3} onValueChange={setR3} min={0.01} max={0.3} step={0.01} data-testid="slider-r3" />
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px]">T: {t3[0]}hr</Label>
                  <Slider value={t3} onValueChange={setT3} min={4} max={16} step={1} data-testid="slider-t3" />
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px]">K: {k3[0]}</Label>
                  <Slider value={k3} onValueChange={setK3} min={4} max={16} step={1} data-testid="slider-k3" />
                </div>
              </div>
            </div>
            
            <div className="text-[10px] text-muted-foreground bg-muted/30 rounded p-2">
              <strong>R</strong> = Response ratio (volume) | <strong>T</strong> = Time to peak (lag) | <strong>K</strong> = Recession constant (tail)
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function BuildupWashoffDiagram() {
  const [mode, setMode] = useState<"buildup" | "washoff">("buildup");
  const [dryDays, setDryDays] = useState([7]);
  const [buildupFunction, setBuildupFunction] = useState("exponential");
  const [washoffFunction, setWashoffFunction] = useState("rating");
  const [isAnimating, setIsAnimating] = useState(false);
  const [time, setTime] = useState(0);
  const [pollutantMass, setPollutantMass] = useState(0);
  const [washoffLoad, setWashoffLoad] = useState<number[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const maxBuildup = 50;
  
  const calculateBuildup = (days: number) => {
    switch (buildupFunction) {
      case "power":
        return Math.min(maxBuildup, 5 * Math.pow(days, 0.8));
      case "exponential":
        return maxBuildup * (1 - Math.exp(-0.3 * days));
      case "saturation":
        return (maxBuildup * days) / (5 + days);
      default:
        return 0;
    }
  };
  
  const simulateBuildup = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setMode("buildup");
    setTime(0);
    setPollutantMass(0);
    
    let step = 0;
    intervalRef.current = setInterval(() => {
      step++;
      const days = step * 0.5;
      setTime(days);
      setPollutantMass(calculateBuildup(days));
      
      if (days >= dryDays[0]) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        intervalRef.current = null;
        setIsAnimating(false);
      }
    }, 150);
  };
  
  const simulateWashoff = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setMode("washoff");
    setWashoffLoad([]);
    
    const initialMass = calculateBuildup(dryDays[0]);
    let currentMass = initialMass;
    let step = 0;
    const loads: number[] = [];
    
    intervalRef.current = setInterval(() => {
      step++;
      const t = step * 0.5;
      setTime(t);
      
      const runoffRate = Math.sin(t * 0.3) * 0.5 + 0.5;
      let load = 0;
      
      if (washoffFunction === "emc") {
        load = 10 * runoffRate;
      } else if (washoffFunction === "rating") {
        load = 0.5 * Math.pow(runoffRate, 1.5) * (currentMass / 10);
      } else {
        const k = 0.3;
        load = k * currentMass * runoffRate;
      }
      
      currentMass = Math.max(0, currentMass - load * 0.3);
      setPollutantMass(currentMass);
      loads.push(load);
      setWashoffLoad([...loads]);
      
      if (step >= 40 || currentMass < 0.5) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        intervalRef.current = null;
        setIsAnimating(false);
      }
    }, 150);
  };
  
  const reset = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = null;
    setIsAnimating(false);
    setTime(0);
    setPollutantMass(0);
    setWashoffLoad([]);
    setMode("buildup");
  };
  
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);
  
  const buildupCurve = Array.from({ length: 20 }, (_, i) => calculateBuildup(i));

  return (
    <Card className="border-2 border-lime-500/30 bg-gradient-to-br from-lime-500/5 to-background">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Beaker className="h-5 w-5 text-lime-500" />
          Buildup & Washoff (Water Quality)
          <Badge variant="outline" className="ml-auto text-lime-600 border-lime-500">SWMM5 Quality</Badge>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Pollutant accumulation during dry weather and removal during rain events
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="relative h-72 bg-gradient-to-b from-slate-100/20 to-slate-200/20 dark:from-slate-800/20 dark:to-slate-900/20 rounded-lg border border-border overflow-hidden">
            <svg className="w-full h-full" viewBox="0 0 200 180" aria-hidden="true">
              <rect x="20" y="120" width="160" height="40" className="fill-slate-500/30" />
              <text x="100" y="145" textAnchor="middle" className="text-[10px] fill-slate-500">Street Surface</text>
              
              {mode === "washoff" && isAnimating && Array.from({ length: 6 }).map((_, i) => (
                <motion.circle
                  key={i}
                  cx={30 + i * 28}
                  cy={10}
                  r="2"
                  className="fill-sky-400"
                  animate={{ y: [0, 100] }}
                  transition={{ duration: 0.6, delay: i * 0.1, repeat: Infinity }}
                />
              ))}
              
              <g>
                {Array.from({ length: Math.ceil(pollutantMass / 5) }).map((_, i) => (
                  <circle
                    key={i}
                    cx={30 + (i % 15) * 10}
                    cy={115 - Math.floor(i / 15) * 8}
                    r="3"
                    className="fill-amber-600/70"
                  />
                ))}
              </g>
              
              {mode === "washoff" && washoffLoad.length > 0 && (
                <motion.g
                  animate={{ x: [0, 10, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                >
                  <rect x="170" y="125" width="15" height="30" className="fill-lime-500/50" rx="2" />
                  <path d="M 185 140 L 195 140" className="stroke-lime-500 stroke-2" />
                </motion.g>
              )}
              
              <text x="100" y="175" textAnchor="middle" className="text-[8px] fill-muted-foreground">
                {mode === "buildup" 
                  ? `Day ${time.toFixed(1)} | Mass: ${pollutantMass.toFixed(1)} lbs`
                  : `Rain t=${time.toFixed(1)}s | Remaining: ${pollutantMass.toFixed(1)} lbs`
                }
              </text>
            </svg>
            
            <div className={`absolute top-2 right-2 text-[9px] font-mono px-2 py-1 rounded border ${
              mode === "buildup" 
                ? "bg-amber-500/20 border-amber-500 text-amber-600" 
                : "bg-sky-500/20 border-sky-500 text-sky-600"
            }`} data-testid="text-quality-mode">
              {mode === "buildup" ? "Dry Days (Buildup)" : "Rain Event (Washoff)"}
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="h-20 bg-muted/30 rounded-lg border border-border p-2">
              <div className="text-[9px] text-muted-foreground mb-1">
                {mode === "buildup" ? "Buildup Curve" : "Washoff Load"}
              </div>
              <svg className="w-full h-12" viewBox="0 0 120 35" preserveAspectRatio="none" aria-hidden="true">
                {mode === "buildup" ? (
                  <path
                    d={`M 0,30 ${buildupCurve.map((v, i) => `L ${i * 6},${30 - v * 0.5}`).join(' ')}`}
                    fill="none"
                    className="stroke-amber-500 stroke-2"
                  />
                ) : (
                  washoffLoad.length > 1 && (
                    <path
                      d={`M 0,30 ${washoffLoad.map((v, i) => `L ${i * 3},${30 - v * 2}`).join(' ')}`}
                      fill="none"
                      className="stroke-lime-500 stroke-2"
                    />
                  )
                )}
              </svg>
            </div>
            
            <div className="flex gap-2">
              <Button onClick={simulateBuildup} disabled={isAnimating} className="flex-1" size="sm" data-testid="button-simulate-buildup">
                <Layers className="h-4 w-4 mr-1" />
                Buildup
              </Button>
              <Button 
                onClick={simulateWashoff} 
                disabled={isAnimating} 
                className="flex-1" 
                size="sm" 
                variant="secondary" 
                data-testid="button-simulate-washoff"
                title={pollutantMass < 1 ? "Run Buildup first to accumulate pollutants" : "Start rain event"}
              >
                <CloudRain className="h-4 w-4 mr-1" />
                {pollutantMass < 1 ? "Washoff (need buildup)" : "Washoff"}
              </Button>
              <Button variant="outline" size="sm" onClick={reset} data-testid="button-reset-quality">
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm">Dry Days: <span className="font-mono text-primary">{dryDays[0]}</span></Label>
              <Slider value={dryDays} onValueChange={setDryDays} min={1} max={30} step={1} data-testid="slider-dry-days" />
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label className="text-[10px]">Buildup Function</Label>
                <Select value={buildupFunction} onValueChange={setBuildupFunction}>
                  <SelectTrigger className="h-8 text-xs" data-testid="select-buildup-function">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="power">Power</SelectItem>
                    <SelectItem value="exponential">Exponential</SelectItem>
                    <SelectItem value="saturation">Saturation</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-[10px]">Washoff Function</Label>
                <Select value={washoffFunction} onValueChange={setWashoffFunction}>
                  <SelectTrigger className="h-8 text-xs" data-testid="select-washoff-function">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="emc">EMC (Constant)</SelectItem>
                    <SelectItem value="rating">Rating Curve</SelectItem>
                    <SelectItem value="exponential">Exponential</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-lime-500/10 border border-lime-500/30 rounded-lg p-3 text-xs">
          <p className="text-muted-foreground">
            <strong className="text-lime-600 dark:text-lime-400">Two phases:</strong> Pollutants slowly accumulate during dry weather (buildup), 
            then are rapidly removed during rain events (washoff). Remaining mass carries over to the next event.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export function HydrologicWorkflowDiagram() {

  return (
    <Card className="border-2 border-slate-500/30 bg-gradient-to-br from-slate-500/5 to-background">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Timer className="h-5 w-5 text-slate-500" />
          The Full Story: SWMM5 Process Workflow
          <Badge variant="outline" className="ml-auto text-slate-600 border-slate-500">Integration</Badge>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          How rainfall transforms into runoff, RDII, and pollutant loads entering the pipe network
        </p>
      </CardHeader>
      <CardContent>
        <div className="relative py-8">
          <svg className="w-full h-64" viewBox="0 0 400 200" aria-hidden="true">
            <circle cx="200" cy="30" r="25" className="fill-sky-500/20 stroke-sky-500 stroke-2" />
            <CloudRain className="h-6 w-6 text-sky-500" x="188" y="18" />
            <text x="200" y="70" textAnchor="middle" className="text-[10px] fill-sky-600 font-semibold">Rainfall</text>
            
            <path d="M 175 50 L 100 90" className="stroke-slate-400 stroke-2" markerEnd="url(#arrow)" />
            <path d="M 225 50 L 300 90" className="stroke-slate-400 stroke-2" markerEnd="url(#arrow)" />
            
            <circle cx="100" cy="110" r="22" className="fill-blue-500/20 stroke-blue-500 stroke-2" />
            <text x="100" y="115" textAnchor="middle" className="text-[9px] fill-blue-600 font-semibold">Runoff</text>
            <text x="100" y="145" textAnchor="middle" className="text-[8px] fill-muted-foreground">Subcatchment</text>
            
            <circle cx="300" cy="110" r="22" className="fill-violet-500/20 stroke-violet-500 stroke-2" />
            <text x="300" y="115" textAnchor="middle" className="text-[9px] fill-violet-600 font-semibold">RDII</text>
            <text x="300" y="145" textAnchor="middle" className="text-[8px] fill-muted-foreground">RTK Method</text>
            
            <path d="M 100 132 L 100 155 L 180 155" className="stroke-slate-400 stroke-2" />
            <circle cx="180" cy="155" r="18" className="fill-lime-500/20 stroke-lime-500 stroke-2" />
            <text x="180" y="159" textAnchor="middle" className="text-[8px] fill-lime-600 font-semibold">Quality</text>
            
            <path d="M 198 155 L 220 155 L 220 175" className="stroke-slate-400 stroke-2" markerEnd="url(#arrow)" />
            <path d="M 300 132 L 300 155 L 240 155 L 240 175" className="stroke-slate-400 stroke-2" />
            
            <rect x="170" y="175" width="80" height="20" rx="4" className="fill-emerald-500/20 stroke-emerald-500 stroke-2" />
            <text x="210" y="189" textAnchor="middle" className="text-[9px] fill-emerald-600 font-semibold">Pipe Network</text>
            
            <defs>
              <marker id="arrow" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
                <path d="M0,0 L8,4 L0,8 Z" className="fill-slate-400" />
              </marker>
            </defs>
          </svg>
          
          <div className="grid grid-cols-4 gap-2 mt-4 text-center text-[10px]">
            <div className="p-2 rounded bg-sky-500/10 border border-sky-500/30">
              <div className="font-semibold text-sky-600">Input</div>
              <div className="text-muted-foreground">Time series data</div>
            </div>
            <div className="p-2 rounded bg-blue-500/10 border border-blue-500/30">
              <div className="font-semibold text-blue-600">Surface</div>
              <div className="text-muted-foreground">Depression + Infiltration</div>
            </div>
            <div className="p-2 rounded bg-violet-500/10 border border-violet-500/30">
              <div className="font-semibold text-violet-600">Subsurface</div>
              <div className="text-muted-foreground">R-T-K parameters</div>
            </div>
            <div className="p-2 rounded bg-emerald-500/10 border border-emerald-500/30">
              <div className="font-semibold text-emerald-600">Hydraulics</div>
              <div className="text-muted-foreground">Saint-Venant eqs</div>
            </div>
          </div>
        </div>
        
        <div className="bg-slate-500/10 border border-slate-500/30 rounded-lg p-3 text-xs mt-4">
          <p className="text-muted-foreground">
            <strong className="text-slate-600 dark:text-slate-400">Complete workflow:</strong> Rainfall feeds both surface runoff (subcatchments) and subsurface RDII. 
            Runoff carries pollutant loads via buildup/washoff. All flows converge at the pipe network for hydraulic routing.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
