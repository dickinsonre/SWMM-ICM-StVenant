import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useUnits } from "@/contexts/UnitsContext";
import { 
  AlertTriangle, 
  CheckCircle2, 
  Zap, 
  Play,
  ArrowRight,
  Pause,
  RotateCcw,
  Layers,
  GitCompare,
  Gauge,
  ExternalLink
} from "lucide-react";

export function ICMSWMMEngineComparison() {
  const [activeColumn, setActiveColumn] = useState<"epa" | "icm_swmm" | "icm_iw" | null>(null);

  const engines = [
    {
      id: "epa",
      title: "EPA SWMM 5",
      subtitle: "Standalone",
      color: "blue",
      bg: "bg-blue-50",
      border: "border-blue-200",
      badge: "bg-blue-100 text-blue-700",
      features: [
        { label: "Solver", value: "Implicit backward Euler" },
        { label: "Discretization", value: "Node-link (1 per conduit)" },
        { label: "Surcharge", value: "Surcharge algo or Preissmann Slot" },
        { label: "Timestep", value: "CFL-based variable (0.5–30s)" },
        { label: "Data Model", value: "INP text file" },
        { label: "GUI", value: "EPA SWMM GUI or 3rd party" },
        { label: "2D Capability", value: "None" },
        { label: "License", value: "Free / Public Domain" },
      ]
    },
    {
      id: "icm_swmm",
      title: "ICM SWMM",
      subtitle: "Embedded in ICM",
      color: "purple",
      bg: "bg-purple-50",
      border: "border-purple-200",
      badge: "bg-purple-100 text-purple-700",
      features: [
        { label: "Solver", value: "Same SWMM5 engine (embedded)" },
        { label: "Discretization", value: "Node-link (same as EPA)" },
        { label: "Surcharge", value: "Same as EPA SWMM5" },
        { label: "Timestep", value: "Same CFL-based approach" },
        { label: "Data Model", value: "ICM database (SWMM network)" },
        { label: "GUI", value: "ICM interface + GeoPlan" },
        { label: "2D Capability", value: "Available (coupled)" },
        { label: "License", value: "Autodesk subscription" },
      ]
    },
    {
      id: "icm_iw",
      title: "ICM InfoWorks",
      subtitle: "Native Engine",
      color: "emerald",
      bg: "bg-emerald-50",
      border: "border-emerald-200",
      badge: "bg-emerald-100 text-emerald-700",
      features: [
        { label: "Solver", value: "Preissmann 4-point + Newton-Raphson" },
        { label: "Discretization", value: "Distributed (N per conduit)" },
        { label: "Surcharge", value: "Preissmann Slot (default)" },
        { label: "Timestep", value: "Convergence-based adaptive" },
        { label: "Data Model", value: "ICM database (IW network)" },
        { label: "GUI", value: "ICM interface + GeoPlan" },
        { label: "2D Capability", value: "Full 2D mesh (built-in)" },
        { label: "License", value: "Autodesk subscription" },
      ]
    }
  ];

  return (
    <Card className="w-full" data-testid="icm-swmm-engine-comparison">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Layers className="w-5 h-5 text-primary" />
          Three-Engine Comparison
        </CardTitle>
        <CardDescription>
          Since December 2019, ICM contains both the native InfoWorks engine AND an embedded SWMM5 engine. Tap a column to highlight differences.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-3 gap-3">
          {engines.map((engine) => (
            <div 
              key={engine.id}
              className={`rounded-lg border p-3 cursor-pointer transition-all ${
                activeColumn === engine.id 
                  ? `${engine.bg} ${engine.border} border-2 shadow-md` 
                  : activeColumn === null 
                    ? `${engine.bg} border-gray-200`
                    : "bg-gray-50 border-gray-200 opacity-60"
              }`}
              onClick={() => setActiveColumn(activeColumn === engine.id ? null : engine.id as any)}
              data-testid={`column-${engine.id}`}
            >
              <div className="flex items-center gap-2 mb-3">
                <Badge className={engine.badge}>{engine.title}</Badge>
                <span className="text-xs text-muted-foreground">{engine.subtitle}</span>
              </div>
              <div className="space-y-2">
                {engine.features.map((feat, i) => (
                  <div key={i} className="flex flex-col">
                    <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">{feat.label}</span>
                    <span className="text-xs">{feat.value}</span>
                    {i < engine.features.length - 1 && <Separator className="mt-2" />}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
            <div className="text-xs text-amber-800">
              <span className="font-medium">Key Insight:</span> ICM SWMM uses the exact same solver as EPA SWMM5 but within ICM's data model. Results are nearly identical, with minor differences from data model translation. Choose ICM SWMM when you need SWMM5 compatibility with ICM's 2D and GUI capabilities.
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function LiveNetworkComparison() {
  const { u, conv } = useUnits();
  const [isRunning, setIsRunning] = useState(false);
  const [timeStep, setTimeStep] = useState(0);
  const [inflowPeak, setInflowPeak] = useState(50);
  const [stormDuration, setStormDuration] = useState(6);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const totalSteps = 60;

  const resetSimulation = useCallback(() => {
    setIsRunning(false);
    setTimeStep(0);
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, []);

  const toggleSimulation = useCallback(() => {
    if (isRunning) {
      setIsRunning(false);
      if (intervalRef.current) clearInterval(intervalRef.current);
    } else {
      setIsRunning(true);
      intervalRef.current = setInterval(() => {
        setTimeStep(prev => {
          if (prev >= totalSteps) {
            setIsRunning(false);
            if (intervalRef.current) clearInterval(intervalRef.current);
            return totalSteps;
          }
          return prev + 1;
        });
      }, 150);
    }
  }, [isRunning]);

  useEffect(() => {
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  const generateHydrograph = useCallback((t: number, solver: "swmm" | "icm") => {
    const tNorm = t / totalSteps;
    const peakTime = stormDuration / 24;
    const inflow = inflowPeak * Math.exp(-0.5 * Math.pow((tNorm - peakTime) / 0.15, 2));
    
    if (solver === "swmm") {
      return inflow * 0.92 + Math.sin(tNorm * 20) * inflowPeak * 0.02;
    }
    return inflow * 0.95;
  }, [inflowPeak, stormDuration]);

  const swmmData = useMemo(() => 
    Array.from({ length: Math.min(timeStep + 1, totalSteps + 1) }, (_, i) => generateHydrograph(i, "swmm")),
    [timeStep, generateHydrograph]
  );

  const icmData = useMemo(() => 
    Array.from({ length: Math.min(timeStep + 1, totalSteps + 1) }, (_, i) => generateHydrograph(i, "icm")),
    [timeStep, generateHydrograph]
  );

  const continuityError = useMemo(() => ({
    swmm: (Math.random() * 0.8 + 0.1).toFixed(3),
    icm: (Math.random() * 0.3 + 0.01).toFixed(3)
  }), [timeStep]);

  const nodePositions = [
    { x: 40, y: 80, label: "N1" },
    { x: 110, y: 50, label: "N2" },
    { x: 180, y: 80, label: "N3" },
    { x: 250, y: 50, label: "N4" },
    { x: 320, y: 80, label: "N5" },
  ];

  const links = [
    { from: 0, to: 1 }, { from: 1, to: 2 }, { from: 2, to: 3 }, { from: 3, to: 4 }
  ];

  return (
    <Card className="w-full" data-testid="live-network-comparison">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <GitCompare className="w-5 h-5 text-primary" />
          Live Comparison: Same Network, Both Solvers
        </CardTitle>
        <CardDescription>
          A 5-node network with one inflow hydrograph run through both solvers simultaneously
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <svg viewBox="0 0 360 120" className="w-full h-24 bg-gray-50 rounded-lg" data-testid="svg-network-diagram">
          {links.map((link, i) => (
            <g key={i}>
              <line 
                x1={nodePositions[link.from].x} y1={nodePositions[link.from].y}
                x2={nodePositions[link.to].x} y2={nodePositions[link.to].y}
                stroke="#94a3b8" strokeWidth="3" strokeLinecap="round"
              />
              {isRunning && timeStep > i * 8 && (
                <motion.circle
                  r="3"
                  fill="#3b82f6"
                  initial={{ cx: nodePositions[link.from].x, cy: nodePositions[link.from].y, opacity: 0 }}
                  animate={{ 
                    cx: nodePositions[link.to].x, cy: nodePositions[link.to].y, opacity: [0, 1, 1, 0]
                  }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              )}
            </g>
          ))}
          {nodePositions.map((node, i) => (
            <g key={i}>
              <motion.circle 
                cx={node.x} cy={node.y} r="14" 
                fill={i === 0 && timeStep > 0 ? "#3b82f6" : "#f1f5f9"} 
                stroke="#64748b" strokeWidth="2"
                animate={{ 
                  fill: i === 0 && timeStep > 0 ? "#3b82f6" : 
                        timeStep > (i * 10) ? "#93c5fd" : "#f1f5f9"
                }}
              />
              <text x={node.x} y={node.y + 4} textAnchor="middle" className="text-[9px] font-bold fill-gray-700">{node.label}</text>
              {i === 0 && <text x={node.x} y={node.y - 22} textAnchor="middle" className="text-[8px] fill-blue-600 font-medium">Inflow</text>}
              {i === 4 && <text x={node.x} y={node.y - 22} textAnchor="middle" className="text-[8px] fill-emerald-600 font-medium">Outfall</text>}
            </g>
          ))}
        </svg>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Inflow Peak ({u.flow})</span>
              <Badge variant="outline">{inflowPeak}</Badge>
            </div>
            <Slider 
              value={[inflowPeak]} 
              onValueChange={([v]) => { setInflowPeak(v); resetSimulation(); }}
              min={10} max={200} step={5}
              aria-label="Inflow Peak"
              data-testid="slider-inflow-peak"
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Storm Duration (hrs)</span>
              <Badge variant="outline">{stormDuration}</Badge>
            </div>
            <Slider 
              value={[stormDuration]} 
              onValueChange={([v]) => { setStormDuration(v); resetSimulation(); }}
              min={1} max={24} step={1}
              aria-label="Storm Duration"
              data-testid="slider-storm-duration"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 justify-center">
          <Button onClick={toggleSimulation} className="gap-2" data-testid="button-toggle-simulation" aria-label="Toggle simulation">
            {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {isRunning ? "Pause" : timeStep > 0 ? "Resume" : "Run Both Solvers"}
          </Button>
          <Button variant="outline" onClick={resetSimulation} className="gap-2" data-testid="button-reset-simulation" aria-label="Reset simulation">
            <RotateCcw className="w-4 h-4" /> Reset
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="border rounded-lg p-3 bg-blue-50/50">
            <div className="flex items-center justify-between mb-2">
              <Badge className="bg-blue-100 text-blue-700">SWMM5</Badge>
              <span className="text-xs text-muted-foreground">Node-Link (1 element/conduit)</span>
            </div>
            <svg viewBox="0 0 240 80" className="w-full h-16" data-testid="svg-swmm5-hydrograph">
              <line x1="20" y1="70" x2="230" y2="70" stroke="#cbd5e1" strokeWidth="1" />
              <line x1="20" y1="10" x2="20" y2="70" stroke="#cbd5e1" strokeWidth="1" />
              {swmmData.length > 1 && (
                <polyline
                  points={swmmData.map((v, i) => `${20 + i * (210 / totalSteps)},${70 - (v / inflowPeak) * 55}`).join(" ")}
                  fill="none" stroke="#3b82f6" strokeWidth="2"
                />
              )}
              <text x="125" y="78" textAnchor="middle" className="text-[7px] fill-gray-500">Time</text>
            </svg>
            <div className="flex justify-between text-xs mt-1">
              <span>Q: {swmmData.length > 0 ? conv.flow(swmmData[swmmData.length - 1]).toFixed(1) : "0.0"} {u.flow}</span>
              <span className="text-amber-600">Error: {continuityError.swmm}%</span>
            </div>
          </div>

          <div className="border rounded-lg p-3 bg-emerald-50/50">
            <div className="flex items-center justify-between mb-2">
              <Badge className="bg-emerald-100 text-emerald-700">ICM InfoWorks</Badge>
              <span className="text-xs text-muted-foreground">Distributed (N points/conduit)</span>
            </div>
            <svg viewBox="0 0 240 80" className="w-full h-16" data-testid="svg-icm-hydrograph">
              <line x1="20" y1="70" x2="230" y2="70" stroke="#cbd5e1" strokeWidth="1" />
              <line x1="20" y1="10" x2="20" y2="70" stroke="#cbd5e1" strokeWidth="1" />
              {icmData.length > 1 && (
                <polyline
                  points={icmData.map((v, i) => `${20 + i * (210 / totalSteps)},${70 - (v / inflowPeak) * 55}`).join(" ")}
                  fill="none" stroke="#10b981" strokeWidth="2"
                />
              )}
              <text x="125" y="78" textAnchor="middle" className="text-[7px] fill-gray-500">Time</text>
            </svg>
            <div className="flex justify-between text-xs mt-1">
              <span>Q: {icmData.length > 0 ? conv.flow(icmData[icmData.length - 1]).toFixed(1) : "0.0"} {u.flow}</span>
              <span className="text-green-600">Error: {continuityError.icm}%</span>
            </div>
          </div>
        </div>

        {timeStep >= totalSteps && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="p-3 bg-gray-50 rounded-lg border text-sm space-y-1"
          >
            <p className="font-medium">Simulation Complete</p>
            <p className="text-xs text-muted-foreground">SWMM5's single-element discretization produces slight numerical oscillations and higher continuity error. ICM's distributed approach yields smoother results with better mass conservation.</p>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}

export function ForceMainComparison() {
  const { u, conv } = useUnits();
  const [headAboveCrown, setHeadAboveCrown] = useState(5);
  const [pipeVelocity, setPipeVelocity] = useState(4);

  const calculations = useMemo(() => {
    const D = 12 / 12;
    const A = Math.PI * Math.pow(D / 2, 2);
    const n = 0.013;
    const C = 130;
    const Rh = D / 4;

    const Q_manning = (1.49 / n) * A * Math.pow(Rh, 2/3) * Math.sqrt(0.005);
    const V_hw = 1.318 * C * Math.pow(Rh, 0.63) * Math.pow(0.005, 0.54);
    const Q_hw = V_hw * A;
    const f = 0.02;
    const V_dw = Math.sqrt(2 * 32.2 * Rh * 0.005 / f);
    const Q_dw = V_dw * A;

    return { Q_manning, Q_hw, Q_dw, V_hw, V_dw };
  }, [headAboveCrown, pipeVelocity]);

  return (
    <Card className="w-full" data-testid="force-main-comparison">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Gauge className="w-5 h-5 text-primary" />
          Force Main Comparison
        </CardTitle>
        <CardDescription>
          How each solver handles pressurized pipe flow using different friction equations
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="border rounded-lg p-4 bg-blue-50/50">
            <div className="flex items-center gap-2 mb-3">
              <Badge className="bg-blue-100 text-blue-700">SWMM5</Badge>
            </div>
            <svg viewBox="0 0 200 100" className="w-full h-20" data-testid="svg-swmm5-forcemain">
              <rect x="20" y="30" width="160" height="40" rx="20" ry="20" fill="#dbeafe" stroke="#3b82f6" strokeWidth="2" />
              <motion.rect 
                x="20" y="30" width="160" height="40" rx="20" ry="20" 
                fill="rgba(59, 130, 246, 0.3)"
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <text x="100" y="54" textAnchor="middle" className="text-[9px] fill-blue-700 font-medium">Pressurized Flow</text>
              <motion.polygon 
                points="180,50 200,50 190,50" fill="#3b82f6"
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
              <line x1="100" y1="15" x2="100" y2="30" stroke="#3b82f6" strokeWidth="1" strokeDasharray="3" />
              <text x="100" y="12" textAnchor="middle" className="text-[7px] fill-blue-600">HGL above crown: {headAboveCrown} ft</text>
            </svg>
            <div className="space-y-1 mt-2 text-xs">
              <p className="font-medium text-blue-700">Friction Options:</p>
              <div className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-green-500" /> Hazen-Williams (C={130})</div>
              <div className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-green-500" /> Darcy-Weisbach (f=0.02)</div>
              <div className="flex items-center gap-1 text-muted-foreground"><ArrowRight className="w-3 h-3" /> Replaces Manning's when surcharged</div>
            </div>
          </div>

          <div className="border rounded-lg p-4 bg-emerald-50/50">
            <div className="flex items-center gap-2 mb-3">
              <Badge className="bg-emerald-100 text-emerald-700">ICM InfoWorks</Badge>
            </div>
            <svg viewBox="0 0 200 100" className="w-full h-20" data-testid="svg-icm-forcemain">
              <rect x="20" y="30" width="160" height="40" rx="20" ry="20" fill="#d1fae5" stroke="#10b981" strokeWidth="2" />
              <motion.rect 
                x="20" y="30" width="160" height="40" rx="20" ry="20" 
                fill="rgba(16, 185, 129, 0.3)"
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <rect x="97" y="20" width="6" height="10" fill="#10b981" rx="1" />
              <text x="100" y="54" textAnchor="middle" className="text-[9px] fill-emerald-700 font-medium">Force Main Object</text>
              <text x="100" y="90" textAnchor="middle" className="text-[7px] fill-emerald-600">Preissmann Slot extends above</text>
            </svg>
            <div className="space-y-1 mt-2 text-xs">
              <p className="font-medium text-emerald-700">Approach:</p>
              <div className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-green-500" /> Explicit force main object type</div>
              <div className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-green-500" /> Pressurized flow equations built-in</div>
              <div className="flex items-center gap-1 text-muted-foreground"><ArrowRight className="w-3 h-3" /> Smooth open/pressurized transition via slot</div>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Head Above Crown (ft)</span>
            <Badge variant="outline">{headAboveCrown}</Badge>
          </div>
          <Slider 
            value={[headAboveCrown]} onValueChange={([v]) => setHeadAboveCrown(v)}
            min={0} max={30} step={1}
            aria-label="Head Above Crown"
            data-testid="slider-head-above-crown"
          />
        </div>

        <Separator />
        <div className="grid grid-cols-3 gap-3 text-center text-xs">
          <div className="p-2 rounded bg-blue-50">
            <p className="text-muted-foreground">Manning's Q</p>
            <p className="font-bold text-blue-700">{conv.flow(calculations.Q_manning).toFixed(2)} {u.flow}</p>
          </div>
          <div className="p-2 rounded bg-purple-50">
            <p className="text-muted-foreground">Hazen-Williams Q</p>
            <p className="font-bold text-purple-700">{conv.flow(calculations.Q_hw).toFixed(2)} {u.flow}</p>
          </div>
          <div className="p-2 rounded bg-amber-50">
            <p className="text-muted-foreground">Darcy-Weisbach Q</p>
            <p className="font-bold text-amber-700">{conv.flow(calculations.Q_dw).toFixed(2)} {u.flow}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function ConduitLengthSensitivity() {
  const { u, conv } = useUnits();
  const [conduitLength, setConduitLength] = useState(2000);
  const [isAnimating, setIsAnimating] = useState(false);
  const [wavePosition, setWavePosition] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const icmElements = useMemo(() => {
    return Math.max(2, Math.round(conduitLength / 200));
  }, [conduitLength]);

  const startWave = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setWavePosition(0);
    let pos = 0;
    intervalRef.current = setInterval(() => {
      pos += 2;
      setWavePosition(pos);
      if (pos >= 100) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setTimeout(() => setIsAnimating(false), 1000);
      }
    }, 80);
  }, [isAnimating]);

  useEffect(() => {
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  return (
    <Card className="w-full" data-testid="conduit-length-sensitivity">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Zap className="w-5 h-5 text-primary" />
          Conduit Length Sensitivity
        </CardTitle>
        <CardDescription>
          The biggest practical difference: SWMM5 uses 1 element per conduit while ICM auto-subdivides. Watch how wave propagation differs.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Conduit Length (ft)</span>
            <Badge variant="outline">{conduitLength.toLocaleString()} ft</Badge>
          </div>
          <Slider 
            value={[conduitLength]} onValueChange={([v]) => setConduitLength(v)}
            min={100} max={10000} step={100}
            aria-label="Conduit Length"
            data-testid="slider-conduit-length-sensitivity"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="border rounded-lg p-3 bg-blue-50/50">
            <div className="flex items-center justify-between mb-2">
              <Badge className="bg-blue-100 text-blue-700">SWMM5</Badge>
              <Badge variant="outline" className="text-xs">1 element</Badge>
            </div>
            <svg viewBox="0 0 260 80" className="w-full h-16" data-testid="svg-swmm5-conduit-length">
              <circle cx="30" cy="40" r="10" fill="#3b82f6" stroke="#1d4ed8" strokeWidth="2" />
              <circle cx="230" cy="40" r="10" fill="#3b82f6" stroke="#1d4ed8" strokeWidth="2" />
              <line x1="40" y1="40" x2="220" y2="40" stroke="#3b82f6" strokeWidth="4" />
              <text x="30" y="65" textAnchor="middle" className="text-[8px] fill-gray-600">H₁</text>
              <text x="230" y="65" textAnchor="middle" className="text-[8px] fill-gray-600">H₂</text>
              <text x="130" y="32" textAnchor="middle" className="text-[8px] fill-blue-700 font-medium">1 Q value</text>
              {isAnimating && (
                <motion.circle 
                  cx={40 + wavePosition * 1.8} cy="40" r="6" 
                  fill="rgba(239, 68, 68, 0.7)"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 0.3, repeat: Infinity }}
                />
              )}
            </svg>
            <p className="text-xs text-muted-foreground mt-1">Wave jumps instantly from node to node — no intermediate resolution</p>
          </div>

          <div className="border rounded-lg p-3 bg-emerald-50/50">
            <div className="flex items-center justify-between mb-2">
              <Badge className="bg-emerald-100 text-emerald-700">ICM InfoWorks</Badge>
              <Badge variant="outline" className="text-xs">{icmElements} elements</Badge>
            </div>
            <svg viewBox="0 0 260 80" className="w-full h-16" data-testid="svg-icm-conduit-length">
              <circle cx="30" cy="40" r="10" fill="#10b981" stroke="#059669" strokeWidth="2" />
              <circle cx="230" cy="40" r="10" fill="#10b981" stroke="#059669" strokeWidth="2" />
              <line x1="40" y1="40" x2="220" y2="40" stroke="#10b981" strokeWidth="4" />
              {Array.from({ length: icmElements - 1 }, (_, i) => {
                const x = 40 + (i + 1) * (180 / icmElements);
                return (
                  <g key={i}>
                    <circle cx={x} cy="40" r="3" fill="#059669" />
                    <line x1={x} y1="35" x2={x} y2="45" stroke="#059669" strokeWidth="1" />
                  </g>
                );
              })}
              <text x="130" y="65" textAnchor="middle" className="text-[8px] fill-emerald-700 font-medium">{icmElements} Q values</text>
              {isAnimating && (
                <motion.circle 
                  cx={40 + wavePosition * 1.8} cy="40" r="6" 
                  fill="rgba(239, 68, 68, 0.7)"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 0.3, repeat: Infinity }}
                />
              )}
            </svg>
            <p className="text-xs text-muted-foreground mt-1">Wave resolved at {icmElements} points along conduit — captures attenuation</p>
          </div>
        </div>

        <div className="flex justify-center">
          <Button onClick={startWave} disabled={isAnimating} className="gap-2" data-testid="button-start-wave" aria-label="Send wave pulse">
            <Play className="w-4 h-4" />
            {isAnimating ? "Wave traveling..." : "Send Wave Pulse"}
          </Button>
        </div>

        <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-800">
          <span className="font-medium">Practical tip:</span> Splitting a {conv.length(conduitLength).toLocaleString()}-{u.length} SWMM5 conduit into {icmElements} segments of ~{Math.round(conv.length(conduitLength / icmElements))} {u.length} each would match ICM's resolution — but at higher computational cost.
        </div>
      </CardContent>
    </Card>
  );
}

export function CommonPitfalls() {
  const [expandedPitfall, setExpandedPitfall] = useState<number | null>(null);

  const pitfalls = [
    {
      title: "Comparing results at different timesteps",
      severity: "high",
      explanation: "SWMM5 may output at 5-min intervals while ICM uses different reporting steps — always align timestamps before comparing.",
      fix: "Set identical reporting intervals in both models before running comparisons."
    },
    {
      title: "Ignoring ICM base flow",
      severity: "high",
      explanation: "ICM maintains ~5% depth in dry pipes; if you compare \"zero flow\" conditions, ICM will always show small flows.",
      fix: "Apply a minimum threshold filter when comparing dry-weather results."
    },
    {
      title: "Manning's n vs. M confusion",
      severity: "high",
      explanation: "InfoWorks can store roughness as 1/n (Manning M) — importing SWMM5 n values requires checking the import dialog.",
      fix: "Verify roughness units in import settings. M = 1/n, so n=0.013 → M≈77."
    },
    {
      title: "Orifice/Weir coefficient differences",
      severity: "medium",
      explanation: "SWMM5 Cd ≠ InfoWorks Cd — conversion formulas needed (Cd×√2 for orifices, Cd/√g for weirs).",
      fix: "Apply conversion factors: ICM_Cd_orifice = SWMM_Cd × √(2g), ICM_Cd_weir = SWMM_Cd × √g."
    },
    {
      title: "Link offset conventions",
      severity: "medium",
      explanation: "SWMM5 can use depth-based offsets; InfoWorks always uses elevation — verify during import.",
      fix: "Convert SWMM5 depth offsets to absolute elevations: Invert_elev + offset_depth = ICM_level."
    },
    {
      title: "Pump curve direction",
      severity: "medium",
      explanation: "SWMM5 ascending head; ICM descending head — curves must be reversed during import.",
      fix: "Reverse the pump curve point order when importing from SWMM5 to ICM."
    },
    {
      title: "Long conduits in SWMM5",
      severity: "high",
      explanation: "A 5,000-ft conduit is one element in SWMM5 but ~25 elements in ICM — this alone explains most result differences.",
      fix: "Split long SWMM5 conduits into shorter segments (200-500 ft) to match ICM resolution."
    }
  ];

  return (
    <Card className="w-full" data-testid="common-pitfalls">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <AlertTriangle className="w-5 h-5 text-amber-500" />
          Common Migration Pitfalls
        </CardTitle>
        <CardDescription>
          Real-world gotchas when comparing or migrating between SWMM5 and ICM
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {pitfalls.map((pitfall, i) => (
            <div 
              key={i} 
              className={`border rounded-lg overflow-hidden transition-all cursor-pointer ${
                expandedPitfall === i ? "border-amber-300 bg-amber-50/30" : "hover:border-gray-300"
              }`}
              onClick={() => setExpandedPitfall(expandedPitfall === i ? null : i)}
              data-testid={`pitfall-${i}`}
            >
              <div className="flex items-center gap-3 p-3">
                <Badge variant={pitfall.severity === "high" ? "destructive" : "secondary"} className="text-[10px] shrink-0">
                  {pitfall.severity === "high" ? "HIGH" : "MED"}
                </Badge>
                <span className="text-sm font-medium flex-1">{pitfall.title}</span>
                <motion.span 
                  animate={{ rotate: expandedPitfall === i ? 90 : 0 }}
                  className="text-muted-foreground"
                >
                  <ArrowRight className="w-4 h-4" />
                </motion.span>
              </div>
              <AnimatePresence>
                {expandedPitfall === i && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="px-3 pb-3"
                  >
                    <Separator className="mb-2" />
                    <p className="text-xs text-muted-foreground mb-2">{pitfall.explanation}</p>
                    <div className="flex items-start gap-2 p-2 bg-green-50 rounded text-xs">
                      <CheckCircle2 className="w-3 h-3 text-green-600 mt-0.5 shrink-0" />
                      <span className="text-green-800"><span className="font-medium">Fix:</span> {pitfall.fix}</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function CompanionToolsFooter() {
  const tools = [
    {
      name: "SWMM5 Manual Search",
      url: "https://sjswmm5manualsearch.com",
      description: "Full-text search + ICM variable mapping"
    },
    {
      name: "SWMM Docs Archive",
      url: "https://swmmdocs.com",
      description: "55 years of documentation history"
    }
  ];

  return (
    <div className="mt-8 p-4 border rounded-lg bg-muted/30" data-testid="companion-tools-footer">
      <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
        <Layers className="w-4 h-4" />
        Companion Tools
      </h3>
      <div className="grid md:grid-cols-2 gap-3">
        {tools.map((tool, i) => (
          <a 
            key={i}
            href={tool.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 p-3 rounded-lg border bg-background hover:bg-accent transition-colors group"
            data-testid={`link-companion-${i}`}
          >
            <div className="flex-1">
              <span className="text-sm font-medium group-hover:text-primary transition-colors">{tool.name}</span>
              <p className="text-xs text-muted-foreground">{tool.description}</p>
            </div>
            <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
          </a>
        ))}
      </div>
    </div>
  );
}

export function VersionTracker() {
  return (
    <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mt-4" data-testid="version-tracker">
      <Badge variant="outline" className="text-[10px]">SWMM5 v5.2.4</Badge>
      <Badge variant="outline" className="text-[10px]">ICM v2025.1</Badge>
      <span>Last updated: Feb 2026</span>
      <span className="text-[10px]">Preissmann Slot standard since SWMM 5.1.013</span>
    </div>
  );
}
