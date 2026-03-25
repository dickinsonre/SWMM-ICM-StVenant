import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Droplets, ArrowDown, ArrowUp, Gauge, Waves, Grid3X3, Play, Pause, RotateCcw } from "lucide-react";
import { useUnits } from "@/contexts/UnitsContext";

export function InletElementDiagram() {
  const { u, conv } = useUnits();
  const [surfaceDepth, setSurfaceDepth] = useState([0.15]);
  const [sewerHead, setSewerHead] = useState([0.5]);
  const [inletCapacity, setInletCapacity] = useState([50]);
  
  const isSurcharged = sewerHead[0] > 0.8;
  const isFlooding = surfaceDepth[0] > 0.2;
  const flowDirection = sewerHead[0] > surfaceDepth[0] * 3 ? "outflow" : "inflow";
  
  const capturedFlow = Math.min(
    inletCapacity[0] * Math.sqrt(surfaceDepth[0]),
    inletCapacity[0]
  );
  
  return (
    <Card className="w-full" data-testid="inlet-element-diagram">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Grid3X3 className="w-5 h-5 text-blue-500" />
          The Inlet Element: Surface-to-Sewer Connection
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-sm text-muted-foreground">
          ICM conceptually splits a manhole into an above-ground (flooding) element and a below-ground (sewer) element, linked by an inlet with defined capacity.
        </div>
        
        <div className="relative h-80 bg-gradient-to-b from-sky-100 to-slate-200 dark:from-sky-900/30 dark:to-slate-800 rounded-lg overflow-hidden">
          <svg role="img" aria-label="Street inlet element diagram" viewBox="0 0 400 300" className="w-full h-full">
            <defs>
              <linearGradient id="streetGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#64748b" />
                <stop offset="100%" stopColor="#475569" />
              </linearGradient>
              <linearGradient id="waterGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="100%" stopColor="#0284c7" />
              </linearGradient>
              <linearGradient id="pipeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#374151" />
                <stop offset="100%" stopColor="#1f2937" />
              </linearGradient>
            </defs>
            
            <rect x="0" y="80" width="400" height="30" fill="url(#streetGradient)" />
            <text x="20" y="98" className="text-[10px] fill-white font-medium">STREET SURFACE</text>
            
            <rect x="170" y="100" width="60" height="10" fill="#374151" />
            <rect x="175" y="100" width="50" height="5" fill="#1f2937" />
            <line x1="180" y1="100" x2="180" y2="105" stroke="#0f172a" strokeWidth="2" />
            <line x1="190" y1="100" x2="190" y2="105" stroke="#0f172a" strokeWidth="2" />
            <line x1="200" y1="100" x2="200" y2="105" stroke="#0f172a" strokeWidth="2" />
            <line x1="210" y1="100" x2="210" y2="105" stroke="#0f172a" strokeWidth="2" />
            <line x1="220" y1="100" x2="220" y2="105" stroke="#0f172a" strokeWidth="2" />
            
            <rect x="160" y="110" width="80" height="120" fill="url(#pipeGradient)" rx="5" />
            <rect x="165" y="115" width="70" height="110" fill="#1e293b" rx="3" />
            
            <motion.rect
              x="165"
              y={225 - sewerHead[0] * 100}
              width="70"
              height={sewerHead[0] * 100}
              fill="url(#waterGradient)"
              opacity="0.8"
              animate={{ y: 225 - sewerHead[0] * 100, height: sewerHead[0] * 100 }}
              transition={{ duration: 0.3 }}
            />
            
            <rect x="100" y="170" width="60" height="40" fill="url(#pipeGradient)" />
            <rect x="240" y="170" width="60" height="40" fill="url(#pipeGradient)" />
            <rect x="105" y="175" width="55" height="30" fill="#1e293b" />
            <rect x="240" y="175" width="55" height="30" fill="#1e293b" />
            
            {sewerHead[0] > 0.3 && (
              <>
                <motion.rect x="105" y={205 - sewerHead[0] * 30} width="55" height={sewerHead[0] * 30} fill="url(#waterGradient)" opacity="0.7" />
                <motion.rect x="240" y={205 - sewerHead[0] * 30} width="55" height={sewerHead[0] * 30} fill="url(#waterGradient)" opacity="0.7" />
              </>
            )}
            
            {surfaceDepth[0] > 0.05 && (
              <motion.rect
                x="0"
                y={80 - surfaceDepth[0] * 80}
                width="400"
                height={surfaceDepth[0] * 80}
                fill="url(#waterGradient)"
                opacity="0.6"
                animate={{ y: 80 - surfaceDepth[0] * 80, height: surfaceDepth[0] * 80 }}
              />
            )}
            
            {flowDirection === "inflow" && surfaceDepth[0] > 0.05 && (
              <g>
                <motion.circle
                  cx="200"
                  cy="90"
                  r="3"
                  fill="#38bdf8"
                  animate={{ cy: [90, 130], opacity: [1, 0] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
                <motion.circle
                  cx="195"
                  cy="95"
                  r="2"
                  fill="#38bdf8"
                  animate={{ cy: [95, 135], opacity: [1, 0] }}
                  transition={{ duration: 1, repeat: Infinity, delay: 0.3 }}
                />
                <motion.circle
                  cx="205"
                  cy="92"
                  r="2"
                  fill="#38bdf8"
                  animate={{ cy: [92, 132], opacity: [1, 0] }}
                  transition={{ duration: 1, repeat: Infinity, delay: 0.6 }}
                />
              </g>
            )}
            
            {flowDirection === "outflow" && isSurcharged && (
              <g>
                <motion.circle
                  cx="200"
                  cy="115"
                  r="3"
                  fill="#ef4444"
                  animate={{ cy: [115, 75], opacity: [1, 0] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                />
                <motion.circle
                  cx="195"
                  cy="120"
                  r="2"
                  fill="#ef4444"
                  animate={{ cy: [120, 80], opacity: [1, 0] }}
                  transition={{ duration: 0.8, repeat: Infinity, delay: 0.2 }}
                />
              </g>
            )}
            
            <rect x="10" y="30" width="120" height="45" fill="white" fillOpacity="0.9" rx="5" stroke="#94a3b8" />
            <text x="20" y="48" className="text-[11px] fill-slate-700 font-semibold">Above Ground</text>
            <text x="20" y="62" className="text-[10px] fill-slate-500">(Flooding Element)</text>
            <line x1="130" y1="52" x2="160" y2="70" stroke="#94a3b8" strokeDasharray="3,3" />
            
            <rect x="270" y="240" width="120" height="45" fill="white" fillOpacity="0.9" rx="5" stroke="#94a3b8" />
            <text x="280" y="258" className="text-[11px] fill-slate-700 font-semibold">Below Ground</text>
            <text x="280" y="272" className="text-[10px] fill-slate-500">(Sewer Element)</text>
            <line x1="270" y1="262" x2="240" y2="200" stroke="#94a3b8" strokeDasharray="3,3" />
            
            <rect x="280" y="95" width="110" height="35" fill={flowDirection === "inflow" ? "#dcfce7" : "#fee2e2"} rx="5" stroke={flowDirection === "inflow" ? "#22c55e" : "#ef4444"} />
            <text x="290" y="112" className="text-[10px] fill-slate-700 font-medium">
              {flowDirection === "inflow" ? "↓ Inflow Mode" : "↑ Outflow Mode"}
            </text>
            <text x="290" y="124" className="text-[9px] fill-slate-500">
              {flowDirection === "inflow" ? "Surface → Sewer" : "Sewer → Surface"}
            </text>
          </svg>
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label className="text-xs">Surface Depth: {(surfaceDepth[0] * 100).toFixed(0)} cm</Label>
            <Slider
              value={surfaceDepth}
              onValueChange={setSurfaceDepth}
              min={0}
              max={0.4}
              step={0.01}
              data-testid="slider-surface-depth"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Sewer Head: {(sewerHead[0] * 100).toFixed(0)}%</Label>
            <Slider
              value={sewerHead}
              onValueChange={setSewerHead}
              min={0}
              max={1.2}
              step={0.05}
              data-testid="slider-sewer-head"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Inlet Capacity: {inletCapacity[0]} {u.flowSmall}</Label>
            <Slider
              value={inletCapacity}
              onValueChange={setInletCapacity}
              min={10}
              max={100}
              step={5}
              data-testid="slider-inlet-capacity"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className={`p-2 rounded ${isFlooding ? "bg-red-100 dark:bg-red-900/30 border-red-300" : "bg-green-100 dark:bg-green-900/30 border-green-300"} border`}>
            <strong>Surface:</strong> {isFlooding ? "Flooding" : "Normal"}
          </div>
          <div className={`p-2 rounded ${isSurcharged ? "bg-amber-100 dark:bg-amber-900/30 border-amber-300" : "bg-green-100 dark:bg-green-900/30 border-green-300"} border`}>
            <strong>Sewer:</strong> {isSurcharged ? "Surcharged" : "Free Flow"}
          </div>
          <div className="p-2 rounded bg-blue-100 dark:bg-blue-900/30 border border-blue-300">
            <strong>Captured:</strong> {capturedFlow.toFixed(1)} {u.flowSmall}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function HEC22InletCalculatorDiagram() {
  const { u, conv } = useUnits();
  const [inletType, setInletType] = useState<"curb" | "grate" | "combination">("grate");
  const [gutterFlow, setGutterFlow] = useState([0.1]);
  const [longitudinalSlope, setLongitudinalSlope] = useState([0.02]);
  const [crossSlope, setCrossSlope] = useState([0.02]);
  const [inletLength, setInletLength] = useState([1.0]);
  const [grateWidth, setGrateWidth] = useState([0.6]);
  
  const manningsN = 0.016;
  const spreadWidth = Math.pow((gutterFlow[0] * manningsN) / (0.376 * Math.pow(crossSlope[0], 1.67) * Math.pow(longitudinalSlope[0], 0.5)), 0.375);
  
  const splashVelocity = gutterFlow[0] / (0.5 * spreadWidth * spreadWidth * crossSlope[0]);
  
  let efficiency = 0;
  let capturedFlow = 0;
  let bypassFlow = 0;
  
  if (inletType === "grate") {
    const Rf = 1 - 0.09 * Math.pow(splashVelocity - 0.3, 1.8);
    const Rs = 1 / (1 + 0.0828 * Math.pow(splashVelocity, 1.8) / (crossSlope[0] * inletLength[0]));
    efficiency = Math.max(0, Math.min(1, Rf * Rs));
  } else if (inletType === "curb") {
    const Lt = 0.6 * Math.pow(gutterFlow[0], 0.42) * Math.pow(longitudinalSlope[0], 0.3) / Math.pow(crossSlope[0] * manningsN, 0.6);
    efficiency = Math.max(0, Math.min(1, 1 - Math.pow(1 - inletLength[0] / Lt, 1.8)));
  } else {
    const grateEff = 1 - 0.09 * Math.pow(splashVelocity - 0.3, 1.8);
    const Lt = 0.6 * Math.pow(gutterFlow[0], 0.42) * Math.pow(longitudinalSlope[0], 0.3) / Math.pow(crossSlope[0] * manningsN, 0.6);
    const curbEff = 1 - Math.pow(1 - inletLength[0] / Lt, 1.8);
    efficiency = Math.max(0, Math.min(1, grateEff * 0.6 + curbEff * 0.4));
  }
  
  capturedFlow = gutterFlow[0] * efficiency;
  bypassFlow = gutterFlow[0] - capturedFlow;
  
  return (
    <Card className="w-full" data-testid="hec22-inlet-calculator">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Gauge className="w-5 h-5 text-emerald-500" />
          HEC-22 Inlet Efficiency Calculator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs value={inletType} onValueChange={(v) => setInletType(v as any)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="curb" data-testid="tab-curb">Curb Opening</TabsTrigger>
            <TabsTrigger value="grate" data-testid="tab-grate">Grate Inlet</TabsTrigger>
            <TabsTrigger value="combination" data-testid="tab-combo">Combination</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="relative h-48 bg-gradient-to-r from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 rounded-lg overflow-hidden">
          <svg role="img" aria-label="HEC-22 inlet calculator diagram" viewBox="0 0 400 180" className="w-full h-full">
            <defs>
              <linearGradient id="gutterWater" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.8" />
                <stop offset={`${efficiency * 100}%`} stopColor="#0ea5e9" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.3" />
              </linearGradient>
            </defs>
            
            <polygon points="0,140 400,140 400,160 0,180" fill="#4b5563" />
            
            <polygon 
              points={`0,${140 - spreadWidth * 200} 0,140 ${Math.min(spreadWidth * 400, 180)},140`}
              fill="url(#gutterWater)"
            />
            
            <rect x="150" y="130" width={inletLength[0] * 60} height="15" fill="#1f2937" rx="2" />
            
            {inletType === "grate" || inletType === "combination" ? (
              <g>
                {Array.from({ length: Math.floor(inletLength[0] * 8) }).map((_, i) => (
                  <line
                    key={i}
                    x1={155 + i * 7}
                    y1="132"
                    x2={155 + i * 7}
                    y2="143"
                    stroke="#64748b"
                    strokeWidth="2"
                  />
                ))}
              </g>
            ) : null}
            
            {inletType === "curb" || inletType === "combination" ? (
              <rect x="145" y="125" width="5" height="20" fill="#374151" />
            ) : null}
            
            <motion.g
              animate={{ x: [0, 150 - 20], opacity: [1, efficiency] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <circle cx="20" cy="135" r="4" fill="#38bdf8" />
              <circle cx="35" cy="133" r="3" fill="#38bdf8" />
              <circle cx="50" cy="136" r="3" fill="#38bdf8" />
            </motion.g>
            
            {bypassFlow > 0.01 && (
              <motion.g
                animate={{ x: [150 + inletLength[0] * 60, 380], opacity: [0.5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 1 }}
              >
                <circle cx="0" cy="135" r="3" fill="#94a3b8" />
                <circle cx="15" cy="134" r="2" fill="#94a3b8" />
              </motion.g>
            )}
            
            <motion.circle
              cx="180"
              cy="137"
              r="3"
              fill="#22c55e"
              animate={{ cy: [137, 155], opacity: [1, 0] }}
              transition={{ duration: 0.8, repeat: Infinity }}
            />
            
            <text x="10" y="25" className="text-[12px] fill-slate-700 dark:fill-slate-200 font-semibold">
              Gutter Flow: {(gutterFlow[0] * 1000).toFixed(0)} {u.flowSmall}
            </text>
            <text x="10" y="42" className="text-[11px] fill-slate-500 dark:fill-slate-400">
              Spread Width (T): {(spreadWidth * 100).toFixed(1)} {u.lengthSmall}
            </text>
            
            <rect x="250" y="10" width="140" height="70" fill="white" fillOpacity="0.95" rx="5" />
            <text x="260" y="30" className="text-[11px] fill-slate-700 font-semibold">Results:</text>
            <text x="260" y="47" className="text-[10px] fill-emerald-600">Captured: {(capturedFlow * 1000).toFixed(1)} {u.flowSmall}</text>
            <text x="260" y="62" className="text-[10px] fill-amber-600">Bypass: {(bypassFlow * 1000).toFixed(1)} {u.flowSmall}</text>
            <text x="260" y="77" className="text-[10px] fill-blue-600">Efficiency: {(efficiency * 100).toFixed(1)}%</text>
          </svg>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label className="text-xs">Gutter Flow: {(gutterFlow[0] * 1000).toFixed(0)} {u.flowSmall}</Label>
            <Slider
              value={gutterFlow}
              onValueChange={setGutterFlow}
              min={0.01}
              max={0.3}
              step={0.01}
              data-testid="slider-gutter-flow"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Long. Slope: {(longitudinalSlope[0] * 100).toFixed(1)}%</Label>
            <Slider
              value={longitudinalSlope}
              onValueChange={setLongitudinalSlope}
              min={0.005}
              max={0.1}
              step={0.005}
              data-testid="slider-long-slope"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Cross Slope: {(crossSlope[0] * 100).toFixed(1)}%</Label>
            <Slider
              value={crossSlope}
              onValueChange={setCrossSlope}
              min={0.01}
              max={0.08}
              step={0.005}
              data-testid="slider-cross-slope"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Inlet Length: {inletLength[0].toFixed(1)} {u.length}</Label>
            <Slider
              value={inletLength}
              onValueChange={setInletLength}
              min={0.3}
              max={3.0}
              step={0.1}
              data-testid="slider-inlet-length"
            />
          </div>
          {(inletType === "grate" || inletType === "combination") && (
            <div className="space-y-2">
              <Label className="text-xs">Grate Width: {grateWidth[0].toFixed(1)} {u.length}</Label>
              <Slider
                value={grateWidth}
                onValueChange={setGrateWidth}
                min={0.3}
                max={1.2}
                step={0.1}
                data-testid="slider-grate-width"
              />
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded border-l-4 border-blue-500">
            <strong>Curb Opening</strong>
            <p className="text-muted-foreground mt-1">Best for low-velocity flow. Length determines capture.</p>
          </div>
          <div className="bg-emerald-50 dark:bg-emerald-900/20 p-2 rounded border-l-4 border-emerald-500">
            <strong>Grate Inlet</strong>
            <p className="text-muted-foreground mt-1">Higher capacity but splash-over at high velocities.</p>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/20 p-2 rounded border-l-4 border-purple-500">
            <strong>Combination</strong>
            <p className="text-muted-foreground mt-1">Best of both—curb catches what grate misses.</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function FlowTransitionDiagram() {
  const { u, conv } = useUnits();
  const [scenario, setScenario] = useState<"inflow" | "outflow">("inflow");
  const [isAnimating, setIsAnimating] = useState(false);
  const [time, setTime] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const [surfaceLevel, setSurfaceLevel] = useState(0);
  const [sewerLevel, setSewerLevel] = useState(0.3);
  const [rainfall, setRainfall] = useState(0);
  
  useEffect(() => {
    if (isAnimating) {
      intervalRef.current = setInterval(() => {
        setTime(t => t + 0.1);
        
        if (scenario === "inflow") {
          const stormPeak = Math.sin(time * 0.3) * 0.5 + 0.5;
          setRainfall(stormPeak * 50);
          setSurfaceLevel(prev => Math.min(0.4, prev + stormPeak * 0.01 - 0.005));
          setSewerLevel(prev => Math.min(1.2, prev + stormPeak * 0.008));
        } else {
          setRainfall(0);
          setSewerLevel(prev => Math.min(1.5, prev + 0.02));
          setSurfaceLevel(prev => sewerLevel > 1.0 ? Math.min(0.5, prev + 0.01) : Math.max(0, prev - 0.005));
        }
      }, 100);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isAnimating, scenario, time, sewerLevel]);
  
  const reset = () => {
    setIsAnimating(false);
    setTime(0);
    setSurfaceLevel(0);
    setSewerLevel(0.3);
    setRainfall(0);
  };
  
  return (
    <Card className="w-full" data-testid="flow-transition-diagram">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Waves className="w-5 h-5 text-cyan-500" />
          Flow Transition Scenarios: Inflow vs Outflow
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs value={scenario} onValueChange={(v) => { setScenario(v as any); reset(); }}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="inflow" data-testid="tab-inflow">
              <ArrowDown className="w-4 h-4 mr-1" /> Limit of Inflow
            </TabsTrigger>
            <TabsTrigger value="outflow" data-testid="tab-outflow">
              <ArrowUp className="w-4 h-4 mr-1" /> Limit of Outflow
            </TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="text-sm text-muted-foreground">
          {scenario === "inflow" 
            ? "Street flooding occurs when rainfall exceeds inlet capture capacity. The sewer has capacity, but inlets can't deliver flow fast enough."
            : "Sewer surcharge causes water to back up through inlets to the surface. The inlet acts as a relief valve."
          }
        </div>
        
        <div className="relative h-64 bg-gradient-to-b from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 rounded-lg overflow-hidden">
          <svg role="img" aria-label="Flow transition visualization" viewBox="0 0 400 240" className="w-full h-full">
            <defs>
              <linearGradient id="rainGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.7" />
              </linearGradient>
            </defs>
            
            {rainfall > 0 && (
              <g>
                {Array.from({ length: 20 }).map((_, i) => (
                  <motion.line
                    key={i}
                    x1={20 + i * 20}
                    y1={-10}
                    x2={20 + i * 20 - 5}
                    y2={0}
                    stroke="#60a5fa"
                    strokeWidth="2"
                    animate={{ y1: [-10, 80], y2: [0, 90] }}
                    transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.05 }}
                  />
                ))}
              </g>
            )}
            
            <rect x="0" y="80" width="400" height="25" fill="#6b7280" />
            
            {surfaceLevel > 0 && (
              <motion.rect
                x="0"
                y={80 - surfaceLevel * 100}
                width="400"
                height={surfaceLevel * 100}
                fill="url(#rainGrad)"
                animate={{ height: surfaceLevel * 100, y: 80 - surfaceLevel * 100 }}
              />
            )}
            
            <rect x="180" y="100" width="40" height="10" fill="#374151" />
            
            <rect x="170" y="110" width="60" height="100" fill="#1f2937" rx="3" />
            <rect x="175" y="115" width="50" height="90" fill="#0f172a" />
            
            <motion.rect
              x="175"
              y={205 - sewerLevel * 70}
              width="50"
              height={Math.min(sewerLevel * 70, 90)}
              fill={sewerLevel > 1.0 ? "#ef4444" : "#0ea5e9"}
              opacity="0.8"
              animate={{ height: Math.min(sewerLevel * 70, 90), y: 205 - Math.min(sewerLevel * 70, 90) }}
            />
            
            <rect x="80" y="160" width="90" height="30" fill="#374151" rx="2" />
            <rect x="230" y="160" width="90" height="30" fill="#374151" rx="2" />
            
            {scenario === "inflow" && surfaceLevel > 0.1 && (
              <motion.g
                animate={{ y: [0, 30], opacity: [1, 0] }}
                transition={{ duration: 0.6, repeat: Infinity }}
              >
                <circle cx="200" cy="90" r="4" fill="#3b82f6" />
              </motion.g>
            )}
            
            {scenario === "outflow" && sewerLevel > 1.0 && (
              <motion.g
                animate={{ y: [0, -40], opacity: [1, 0] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              >
                <circle cx="200" cy="110" r="4" fill="#ef4444" />
                <circle cx="195" cy="115" r="3" fill="#ef4444" />
                <circle cx="205" cy="112" r="3" fill="#ef4444" />
              </motion.g>
            )}
            
            <rect x="10" y="10" width="100" height="55" fill="white" fillOpacity="0.9" rx="5" />
            <text x="20" y="28" className="text-[10px] fill-slate-600">Rainfall</text>
            <text x="20" y="42" className="text-[12px] fill-blue-600 font-bold">{rainfall.toFixed(0)} {u.rainfall}</text>
            <text x="20" y="58" className="text-[10px] fill-slate-500">Surface: {(surfaceLevel * 100).toFixed(0)} cm</text>
            
            <rect x="290" y="10" width="100" height="55" fill="white" fillOpacity="0.9" rx="5" />
            <text x="300" y="28" className="text-[10px] fill-slate-600">Sewer Status</text>
            <text x="300" y="42" className={`text-[12px] font-bold ${sewerLevel > 1.0 ? "fill-red-600" : "fill-emerald-600"}`}>
              {sewerLevel > 1.0 ? "SURCHARGED" : "Normal"}
            </text>
            <text x="300" y="58" className="text-[10px] fill-slate-500">Level: {(sewerLevel * 100).toFixed(0)}%</text>
          </svg>
        </div>
        
        <div className="flex gap-2">
          <Button onClick={() => setIsAnimating(!isAnimating)} data-testid="btn-toggle-animation">
            {isAnimating ? <Pause className="w-4 h-4 mr-1" /> : <Play className="w-4 h-4 mr-1" />}
            {isAnimating ? "Pause" : "Start"} Simulation
          </Button>
          <Button variant="outline" onClick={reset} data-testid="btn-reset">
            <RotateCcw className="w-4 h-4 mr-1" /> Reset
          </Button>
        </div>
        
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className={`p-3 rounded-lg border-2 ${scenario === "inflow" ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" : "border-slate-300 bg-slate-50 dark:bg-slate-800"}`}>
            <strong className="text-blue-700 dark:text-blue-300">Limit of Inflow</strong>
            <p className="text-muted-foreground mt-1">
              Inlet capacity is the bottleneck. Sewer has room but water can't enter fast enough. Result: Street flooding with unsurcharged sewers.
            </p>
          </div>
          <div className={`p-3 rounded-lg border-2 ${scenario === "outflow" ? "border-red-500 bg-red-50 dark:bg-red-900/20" : "border-slate-300 bg-slate-50 dark:bg-slate-800"}`}>
            <strong className="text-red-700 dark:text-red-300">Limit of Outflow</strong>
            <p className="text-muted-foreground mt-1">
              Sewer is at capacity and surcharges. Water backs up through inlets to the surface. Inlet acts as a pressure relief valve.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function InletEfficiencyCurvesDiagram() {
  const { u, conv } = useUnits();
  const [selectedType, setSelectedType] = useState<"curb" | "grate" | "sag">("grate");
  const [velocity, setVelocity] = useState([1.5]);
  const [inletLength, setInletLength] = useState([1.5]);
  
  const calculateGrateEfficiency = (v: number, L: number) => {
    const Rf = Math.max(0, 1 - 0.09 * Math.pow(v - 0.3, 1.8));
    return Math.max(0, Math.min(1, Rf * (1 - Math.exp(-L / 1.5))));
  };
  
  const calculateCurbEfficiency = (v: number, L: number) => {
    const Lt = 0.8 + v * 2;
    return Math.max(0, Math.min(1, 1 - Math.pow(1 - L / Lt, 1.8)));
  };
  
  const calculateSagEfficiency = (depth: number, L: number, W: number) => {
    const weirQ = 1.66 * L * Math.pow(depth, 1.5);
    const orificeQ = 0.67 * L * W * Math.sqrt(2 * 9.81 * depth);
    const transitionDepth = 0.12;
    if (depth < transitionDepth) {
      return Math.min(1, weirQ / (L * W * 2));
    } else {
      return Math.min(1, orificeQ / (L * W * 3));
    }
  };
  
  const velocities = Array.from({ length: 20 }, (_, i) => 0.5 + i * 0.2);
  
  return (
    <Card className="w-full" data-testid="inlet-efficiency-curves">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Droplets className="w-5 h-5 text-violet-500" />
          Inlet Efficiency Curves
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs value={selectedType} onValueChange={(v) => setSelectedType(v as any)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="grate" data-testid="tab-grate-curve">Grate (Continuous)</TabsTrigger>
            <TabsTrigger value="curb" data-testid="tab-curb-curve">Curb Opening</TabsTrigger>
            <TabsTrigger value="sag" data-testid="tab-sag-curve">Sag Inlet</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="relative h-64 bg-white dark:bg-slate-900 rounded-lg border">
          <svg role="img" aria-label="Inlet efficiency curves diagram" viewBox="0 0 400 220" className="w-full h-full">
            <line x1="50" y1="20" x2="50" y2="190" stroke="#94a3b8" strokeWidth="1" />
            <line x1="50" y1="190" x2="380" y2="190" stroke="#94a3b8" strokeWidth="1" />
            
            {[0, 25, 50, 75, 100].map((v, i) => (
              <g key={i}>
                <line x1="45" y1={190 - v * 1.7} x2="50" y2={190 - v * 1.7} stroke="#94a3b8" />
                <text x="40" y={194 - v * 1.7} className="text-[9px] fill-slate-500" textAnchor="end">{v}%</text>
              </g>
            ))}
            
            <text x="25" y="105" className="text-[10px] fill-slate-600" textAnchor="middle" transform="rotate(-90, 25, 105)">
              Efficiency
            </text>
            
            {velocities.filter((_, i) => i % 4 === 0).map((v, i) => (
              <g key={i}>
                <line x1={50 + i * 80} y1="190" x2={50 + i * 80} y2="195" stroke="#94a3b8" />
                <text x={50 + i * 80} y="205" className="text-[9px] fill-slate-500" textAnchor="middle">
                  {v.toFixed(1)}
                </text>
              </g>
            ))}
            <text x="215" y="218" className="text-[10px] fill-slate-600" textAnchor="middle">
              {selectedType === "sag" ? `Depth (${u.length})` : `Velocity (${u.velocity})`}
            </text>
            
            {selectedType !== "sag" && (
              <>
                <polyline
                  points={velocities.map((v, i) => {
                    const eff = selectedType === "grate" 
                      ? calculateGrateEfficiency(v, 1.0) 
                      : calculateCurbEfficiency(v, 1.0);
                    return `${50 + i * 16.5},${190 - eff * 170}`;
                  }).join(" ")}
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="2"
                />
                <polyline
                  points={velocities.map((v, i) => {
                    const eff = selectedType === "grate" 
                      ? calculateGrateEfficiency(v, 2.0) 
                      : calculateCurbEfficiency(v, 2.0);
                    return `${50 + i * 16.5},${190 - eff * 170}`;
                  }).join(" ")}
                  fill="none"
                  stroke="#22c55e"
                  strokeWidth="2"
                />
                <polyline
                  points={velocities.map((v, i) => {
                    const eff = selectedType === "grate" 
                      ? calculateGrateEfficiency(v, 3.0) 
                      : calculateCurbEfficiency(v, 3.0);
                    return `${50 + i * 16.5},${190 - eff * 170}`;
                  }).join(" ")}
                  fill="none"
                  stroke="#a855f7"
                  strokeWidth="2"
                />
              </>
            )}
            
            {selectedType === "sag" && (
              <>
                <polyline
                  points={Array.from({ length: 20 }, (_, i) => {
                    const d = 0.02 + i * 0.02;
                    const eff = calculateSagEfficiency(d, 1.0, 0.6);
                    return `${50 + i * 16.5},${190 - eff * 170}`;
                  }).join(" ")}
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="2"
                />
                <line x1="130" y1="20" x2="130" y2="190" stroke="#ef4444" strokeDasharray="4,4" />
                <text x="135" y="35" className="text-[9px] fill-red-500">Weir→Orifice</text>
              </>
            )}
            
            <rect x="280" y="25" width="95" height="65" fill="white" fillOpacity="0.95" rx="3" stroke="#e2e8f0" />
            <text x="290" y="42" className="text-[9px] fill-slate-600 font-medium">Legend</text>
            <line x1="290" y1="52" x2="310" y2="52" stroke="#3b82f6" strokeWidth="2" />
            <text x="315" y="55" className="text-[8px] fill-slate-600">L = 1.0{u.length}</text>
            <line x1="290" y1="65" x2="310" y2="65" stroke="#22c55e" strokeWidth="2" />
            <text x="315" y="68" className="text-[8px] fill-slate-600">L = 2.0{u.length}</text>
            <line x1="290" y1="78" x2="310" y2="78" stroke="#a855f7" strokeWidth="2" />
            <text x="315" y="81" className="text-[8px] fill-slate-600">L = 3.0{u.length}</text>
            
            {selectedType !== "sag" && (
              <circle
                cx={50 + (velocity[0] - 0.5) / 0.2 * 16.5}
                cy={190 - (selectedType === "grate" 
                  ? calculateGrateEfficiency(velocity[0], inletLength[0]) 
                  : calculateCurbEfficiency(velocity[0], inletLength[0])) * 170}
                r="6"
                fill="#ef4444"
                stroke="white"
                strokeWidth="2"
              />
            )}
          </svg>
        </div>
        
        {selectedType !== "sag" && (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs">Approach Velocity: {velocity[0].toFixed(1)} {u.velocity}</Label>
              <Slider
                value={velocity}
                onValueChange={setVelocity}
                min={0.5}
                max={4.0}
                step={0.1}
                data-testid="slider-velocity"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Inlet Length: {inletLength[0].toFixed(1)} {u.length}</Label>
              <Slider
                value={inletLength}
                onValueChange={setInletLength}
                min={0.5}
                max={3.5}
                step={0.1}
                data-testid="slider-length"
              />
            </div>
          </div>
        )}
        
        <div className="p-3 rounded-lg bg-muted/50">
          <p className="text-sm text-muted-foreground">
            {selectedType === "grate" && (
              <>
                <strong>Grate inlets</strong> lose efficiency at high velocities due to splash-over. 
                Longer grates capture more, but efficiency still drops above ~2.5 {u.velocity}.
              </>
            )}
            {selectedType === "curb" && (
              <>
                <strong>Curb openings</strong> are less affected by velocity but require longer lengths 
                for equivalent capture. Best for low-slope, low-velocity situations.
              </>
            )}
            {selectedType === "sag" && (
              <>
                <strong>Sag inlets</strong> at low points transition from weir flow (shallow) to orifice 
                flow (deep). The transition occurs around 12cm depth and affects the Q-H relationship.
              </>
            )}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
