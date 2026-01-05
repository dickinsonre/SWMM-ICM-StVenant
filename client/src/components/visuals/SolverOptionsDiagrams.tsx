import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, AlertTriangle, ArrowRight } from "lucide-react";

export function CFLStabilityDiagram() {
  const [routeStep, setRouteStep] = useState([15]);
  const [pipeLength, setPipeLength] = useState([300]);
  const [waveSpeed, setWaveSpeed] = useState([3]);

  const dt = routeStep[0];
  const L = pipeLength[0];
  const c = waveSpeed[0];
  const courantNumber = (c * dt) / L;

  const getStabilityStatus = () => {
    if (courantNumber <= 1) return { status: "stable", color: "text-green-500", bg: "bg-green-500/20", label: "Stable" };
    if (courantNumber <= 1.5) return { status: "risky", color: "text-yellow-500", bg: "bg-yellow-500/20", label: "Risky" };
    return { status: "unstable", color: "text-red-500", bg: "bg-red-500/20", label: "Unstable" };
  };

  const stability = getStabilityStatus();
  const wavePosition = ((Date.now() / 50) % 100);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Badge variant="outline" className="text-blue-600 border-blue-500">SWMM5</Badge>
          CFL Stability Condition
        </CardTitle>
        <CardDescription>Routing step vs. model stability (Courant-Friedrichs-Lewy)</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Visualization */}
          <div className="relative h-64 bg-muted/30 rounded-lg border border-border p-4 overflow-hidden">
            <div className="absolute top-2 left-2 text-[10px] text-muted-foreground font-mono">Wave Propagation</div>
            
            {/* Pipe representation */}
            <div className="absolute top-1/2 left-4 right-4 -translate-y-1/2">
              <div className="h-8 bg-slate-300 dark:bg-slate-600 rounded-full relative overflow-hidden">
                {/* Flow wave */}
                <motion.div
                  className={`absolute top-1 bottom-1 w-16 rounded-full ${
                    stability.status === "stable" ? "bg-blue-400/80" :
                    stability.status === "risky" ? "bg-yellow-400/80" :
                    "bg-red-400/80"
                  }`}
                  animate={{
                    left: ["0%", "100%"],
                  }}
                  transition={{
                    duration: Math.max(0.5, 4 - courantNumber * 2),
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  style={{ marginLeft: "-32px", marginRight: "-32px" }}
                />
              </div>
              
              {/* Length indicator */}
              <div className="flex justify-between mt-2 text-[9px] text-muted-foreground">
                <span>0 m</span>
                <span className="font-mono">{L} m</span>
              </div>
            </div>

            {/* Courant Number Gauge */}
            <div className={`absolute bottom-4 left-4 right-4 p-3 rounded-lg border ${stability.bg} border-current/20`}>
              <div className="flex items-center justify-between">
                <div className="text-xs">
                  <span className="text-muted-foreground">Courant Number: </span>
                  <span className={`font-mono font-bold ${stability.color}`} data-testid="text-courant-number">
                    Cr = {courantNumber.toFixed(2)}
                  </span>
                </div>
                <div className={`flex items-center gap-1 ${stability.color}`} data-testid="text-stability-status">
                  {stability.status === "stable" && <CheckCircle className="h-4 w-4" />}
                  {stability.status === "risky" && <AlertTriangle className="h-4 w-4" />}
                  {stability.status === "unstable" && <XCircle className="h-4 w-4" />}
                  <span className="text-xs font-semibold">{stability.label}</span>
                </div>
              </div>
              <div className="mt-2 h-2 bg-background rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-300 ${
                    stability.status === "stable" ? "bg-green-500" :
                    stability.status === "risky" ? "bg-yellow-500" :
                    "bg-red-500"
                  }`}
                  style={{ width: `${Math.min(100, courantNumber * 50)}%` }}
                />
              </div>
              <div className="flex justify-between mt-1 text-[8px] text-muted-foreground">
                <span>0</span>
                <span>1.0</span>
                <span>2.0</span>
              </div>
            </div>

            {/* Formula */}
            <div className="absolute top-2 right-2 text-[9px] font-mono bg-background/80 px-2 py-1 rounded border border-border">
              Cr = c × Δt / L
            </div>
          </div>

          {/* Controls */}
          <div className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="route-step" className="text-sm font-medium">
                Route Step (Δt): <span className="font-mono text-primary" data-testid="text-route-step">{dt} sec</span>
              </Label>
              <Slider
                id="route-step"
                value={routeStep}
                onValueChange={setRouteStep}
                min={1}
                max={60}
                step={1}
                data-testid="slider-route-step"
              />
              <p className="text-[10px] text-muted-foreground">SWMM5 uses fixed time steps (1-60 sec typical)</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="pipe-length" className="text-sm font-medium">
                Pipe Length (L): <span className="font-mono text-primary">{L} m</span>
              </Label>
              <Slider
                id="pipe-length"
                value={pipeLength}
                onValueChange={setPipeLength}
                min={50}
                max={1000}
                step={50}
                data-testid="slider-pipe-length"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="wave-speed" className="text-sm font-medium">
                Wave Speed (c): <span className="font-mono text-primary">{c} m/s</span>
              </Label>
              <Slider
                id="wave-speed"
                value={waveSpeed}
                onValueChange={setWaveSpeed}
                min={1}
                max={10}
                step={0.5}
                data-testid="slider-wave-speed"
              />
              <p className="text-[10px] text-muted-foreground">Depends on depth and geometry</p>
            </div>

            <div className="bg-muted/30 rounded-lg p-3 border border-border text-xs">
              <h4 className="font-semibold mb-1">Why it matters:</h4>
              <p className="text-muted-foreground">
                When Cr &gt; 1, the wave travels faster than the solver can track, causing 
                instability or crashes. This is why SWMM5 often requires short time steps.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function SurchargeMethodDiagram() {
  const [usePreissmann, setUsePreissmann] = useState(false);
  const [waterLevel, setWaterLevel] = useState([80]);
  const level = waterLevel[0];
  const isSurcharged = level > 100;

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Badge variant="outline" className="text-blue-600 border-blue-500">SWMM5</Badge>
          Surcharge Method Comparison
        </CardTitle>
        <CardDescription>Preissmann Slot vs Traditional Surcharge Algorithm</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border border-border">
          <Label htmlFor="preissmann-toggle" className="text-sm font-medium cursor-pointer">
            Use Preissmann Slot
          </Label>
          <Switch
            id="preissmann-toggle"
            checked={usePreissmann}
            onCheckedChange={setUsePreissmann}
            data-testid="switch-preissmann"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Visualization */}
          <div className="relative h-64 bg-muted/30 rounded-lg border border-border overflow-hidden">
            <svg className="w-full h-full" viewBox="0 0 200 160" aria-hidden="true">
              {/* Ground */}
              <rect x="0" y="20" width="200" height="6" className="fill-amber-700/50" />
              
              {/* Manhole shaft */}
              <rect x="80" y="26" width="40" height="90" className="fill-slate-300 dark:fill-slate-600" />
              <rect x="85" y="26" width="30" height="90" className="fill-background" />
              
              {/* Manhole cover */}
              <ellipse cx="100" cy="22" rx="25" ry="4" className="fill-slate-500" />
              
              {/* Pipe */}
              <rect x="0" y="90" width="85" height="16" rx="8" className="fill-slate-400 dark:fill-slate-500" />
              <rect x="5" y="93" width="80" height="10" rx="5" className="fill-slate-300 dark:fill-slate-600" />
              
              {/* Preissmann Slot (only when enabled and surcharged) */}
              {usePreissmann && isSurcharged && (
                <rect x="97" y="26" width="6" height={Math.min(64, (level - 100) * 0.8)} className="fill-blue-300/50 dark:fill-blue-700/50" />
              )}
              
              {/* Water level in pipe */}
              <rect 
                x="5" y={103 - Math.min(10, level / 10)} 
                width="75" 
                height={Math.min(10, level / 10)} 
                rx="2" 
                className="fill-blue-400/70"
              />
              
              {/* Water in manhole */}
              <motion.rect 
                x="85" 
                y={116 - Math.min(90, level * 0.9)}
                width="30" 
                height={Math.min(90, level * 0.9)}
                className="fill-blue-400/60"
                animate={isSurcharged && !usePreissmann ? { 
                  y: [116 - Math.min(90, level * 0.9), 116 - Math.min(90, level * 0.9) - 3, 116 - Math.min(90, level * 0.9)]
                } : {}}
                transition={{ duration: 0.3, repeat: Infinity }}
              />
              
              {/* Water level indicator */}
              <line 
                x1="120" y1={116 - Math.min(90, level * 0.9)} 
                x2="145" y2={116 - Math.min(90, level * 0.9)} 
                className="stroke-blue-500 stroke-1" 
                strokeDasharray="3,2" 
              />
              <text x="148" y={119 - Math.min(90, level * 0.9)} className="text-[7px] fill-blue-600 font-mono">H</text>
              
              {/* Crown line */}
              <line x1="5" y1="93" x2="80" y2="93" className="stroke-amber-500 stroke-1" strokeDasharray="2,2" />
              <text x="45" y="88" textAnchor="middle" className="text-[6px] fill-amber-600">Crown</text>
            </svg>

            {/* Status indicator */}
            <div className={`absolute bottom-2 left-2 text-[9px] font-mono px-2 py-1 rounded border ${
              isSurcharged 
                ? (usePreissmann ? "bg-emerald-500/20 border-emerald-500 text-emerald-600" : "bg-amber-500/20 border-amber-500 text-amber-600")
                : "bg-blue-500/20 border-blue-500 text-blue-600"
            }`} data-testid="text-surcharge-status">
              {isSurcharged 
                ? (usePreissmann ? "Pressurized (Slot Active)" : "Surcharged (Traditional)")
                : "Free Surface"}
            </div>
          </div>

          {/* Info panel */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Water Level: <span className="font-mono text-primary">{level}%</span>
              </Label>
              <Slider
                value={waterLevel}
                onValueChange={setWaterLevel}
                min={20}
                max={150}
                step={5}
                data-testid="slider-surcharge-level"
              />
              <p className="text-[10px] text-muted-foreground">100% = pipe crown</p>
            </div>

            <div className={`p-3 rounded-lg border text-xs ${
              usePreissmann 
                ? "bg-emerald-500/10 border-emerald-500/30" 
                : "bg-amber-500/10 border-amber-500/30"
            }`}>
              {usePreissmann ? (
                <div className="space-y-2">
                  <h4 className="font-semibold text-emerald-600 dark:text-emerald-400">Preissmann Slot Method</h4>
                  <ul className="text-muted-foreground space-y-1">
                    <li>• Virtual narrow slot above crown</li>
                    <li>• Smooth transition to pressurized flow</li>
                    <li>• Wave speed: c = √(gA/T<sub>slot</sub>)</li>
                    <li>• More numerically stable</li>
                  </ul>
                </div>
              ) : (
                <div className="space-y-2">
                  <h4 className="font-semibold text-amber-600 dark:text-amber-400">Traditional Surcharge</h4>
                  <ul className="text-muted-foreground space-y-1">
                    <li>• Continuity solved via dQ/dH</li>
                    <li>• No physical slot representation</li>
                    <li>• Head rises rapidly at surcharge</li>
                    <li>• May cause oscillations</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function RoutingMethodFlowchart() {
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const [answers, setAnswers] = useState<{q1?: boolean, q2?: boolean}>({});

  const getRecommendation = () => {
    if (answers.q1 === true) return "dynamic";
    if (answers.q1 === false && answers.q2 === true) return "kinematic";
    if (answers.q1 === false && answers.q2 === false) return "steady";
    return null;
  };

  const recommendation = getRecommendation();

  const reset = () => {
    setAnswers({});
    setSelectedPath(null);
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Badge variant="outline" className="text-blue-600 border-blue-500">SWMM5</Badge>
          Routing Method Selection Guide
        </CardTitle>
        <CardDescription>Choose the right method for your model</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-muted/30 rounded-lg border border-border p-4 space-y-4">
          {/* Question 1 */}
          <div className={`p-3 rounded-lg border transition-colors ${
            answers.q1 !== undefined ? "border-primary/50 bg-primary/5" : "border-border"
          }`}>
            <p className="text-sm font-medium mb-3">Does backwater, flow reversal, or pressure flow matter?</p>
            <div className="flex gap-2">
              <Button 
                size="sm" 
                variant={answers.q1 === true ? "default" : "outline"}
                onClick={() => setAnswers({ q1: true })}
                data-testid="button-q1-yes"
              >
                Yes
              </Button>
              <Button 
                size="sm" 
                variant={answers.q1 === false ? "default" : "outline"}
                onClick={() => setAnswers(prev => ({ ...prev, q1: false }))}
                data-testid="button-q1-no"
              >
                No
              </Button>
            </div>
          </div>

          {/* Question 2 - only show if Q1 is No */}
          {answers.q1 === false && (
            <div className={`p-3 rounded-lg border transition-colors ${
              answers.q2 !== undefined ? "border-primary/50 bg-primary/5" : "border-border"
            }`}>
              <div className="flex items-center gap-2 mb-3">
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm font-medium">Are slopes steep (&gt;0.1%) and system primarily overland flow?</p>
              </div>
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant={answers.q2 === true ? "default" : "outline"}
                  onClick={() => setAnswers(prev => ({ ...prev, q2: true }))}
                  data-testid="button-q2-yes"
                >
                  Yes
                </Button>
                <Button 
                  size="sm" 
                  variant={answers.q2 === false ? "default" : "outline"}
                  onClick={() => setAnswers(prev => ({ ...prev, q2: false }))}
                  data-testid="button-q2-no"
                >
                  No
                </Button>
              </div>
            </div>
          )}

          {/* Result */}
          {recommendation && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-lg border-2 ${
                recommendation === "dynamic" ? "border-blue-500 bg-blue-500/10" :
                recommendation === "kinematic" ? "border-emerald-500 bg-emerald-500/10" :
                "border-amber-500 bg-amber-500/10"
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className={`h-5 w-5 ${
                  recommendation === "dynamic" ? "text-blue-500" :
                  recommendation === "kinematic" ? "text-emerald-500" :
                  "text-amber-500"
                }`} />
                <h4 className={`font-bold ${
                  recommendation === "dynamic" ? "text-blue-600 dark:text-blue-400" :
                  recommendation === "kinematic" ? "text-emerald-600 dark:text-emerald-400" :
                  "text-amber-600 dark:text-amber-400"
                }`} data-testid="text-recommendation">
                  {recommendation === "dynamic" && "Dynamic Wave Routing"}
                  {recommendation === "kinematic" && "Kinematic Wave Routing"}
                  {recommendation === "steady" && "Steady Flow Routing"}
                </h4>
              </div>
              <p className="text-xs text-muted-foreground">
                {recommendation === "dynamic" && "Full Saint-Venant equations. Handles backwater, surcharging, reverse flow, and looped networks. Most computationally intensive."}
                {recommendation === "kinematic" && "Simplified wave equation. Good for steep slopes, overland flow, and systems where backwater effects are minimal."}
                {recommendation === "steady" && "Assumes steady, uniform flow. Quick for simple design checks but cannot handle dynamic conditions."}
              </p>
            </motion.div>
          )}

          {recommendation && (
            <Button variant="outline" size="sm" onClick={reset} className="w-full" data-testid="button-start-over">
              Start Over
            </Button>
          )}
        </div>

        {/* Method comparison cards */}
        <div className="grid grid-cols-3 gap-2 text-[10px]">
          <div className={`p-2 rounded border text-center transition-colors ${
            recommendation === "dynamic" ? "border-blue-500 bg-blue-500/10" : "border-border"
          }`}>
            <div className="font-semibold text-blue-600 dark:text-blue-400">Dynamic</div>
            <p className="text-muted-foreground mt-1">Full St-Venant</p>
          </div>
          <div className={`p-2 rounded border text-center transition-colors ${
            recommendation === "kinematic" ? "border-emerald-500 bg-emerald-500/10" : "border-border"
          }`}>
            <div className="font-semibold text-emerald-600 dark:text-emerald-400">Kinematic</div>
            <p className="text-muted-foreground mt-1">Simplified</p>
          </div>
          <div className={`p-2 rounded border text-center transition-colors ${
            recommendation === "steady" ? "border-amber-500 bg-amber-500/10" : "border-border"
          }`}>
            <div className="font-semibold text-amber-600 dark:text-amber-400">Steady</div>
            <p className="text-muted-foreground mt-1">Uniform flow</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function AdaptiveTimestepDiagram() {
  const [minTimestep, setMinTimestep] = useState([0.5]);
  const [maxTimestep, setMaxTimestep] = useState([30]);
  const [convergenceTolerance, setConvergenceTolerance] = useState([0.01]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [time, setTime] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const startAnimation = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setTime(0);
    setIsAnimating(true);
    intervalRef.current = setInterval(() => {
      setTime(prev => {
        if (prev >= 100) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          setIsAnimating(false);
          return 0;
        }
        return prev + 1;
      });
    }, 80);
  };

  const getTimestepAtTime = (t: number) => {
    const hydrographPeak = 50;
    const distance = Math.abs(t - hydrographPeak);
    const tolerance = convergenceTolerance[0];
    const min = minTimestep[0];
    const max = maxTimestep[0];
    
    if (distance < 15 / (tolerance * 10)) {
      return min + (distance / 30) * (max - min) * tolerance * 5;
    }
    return max;
  };

  const hydrographValue = (t: number) => {
    const peak = 50;
    const base = 10;
    const amplitude = 80;
    return base + amplitude * Math.exp(-Math.pow((t - peak) / 15, 2));
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Badge variant="outline" className="text-emerald-600 border-emerald-500">ICM</Badge>
          Adaptive Timestep Governor
        </CardTitle>
        <CardDescription>How ICM dynamically adjusts computation timesteps</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={startAnimation} 
          disabled={isAnimating}
          className="w-full"
          data-testid="button-start-timestep-animation"
        >
          {isAnimating ? "Simulating..." : "Run Simulation"}
        </Button>

        <div className="relative h-48 bg-muted/30 rounded-lg border border-border p-4 overflow-hidden">
          <svg className="w-full h-full" viewBox="0 0 400 140" preserveAspectRatio="none">
            {/* Hydrograph */}
            <path
              d={`M 0 ${130 - hydrographValue(0)} ${Array.from({length: 100}, (_, i) => 
                `L ${i * 4} ${130 - hydrographValue(i)}`
              ).join(' ')}`}
              fill="none"
              className="stroke-blue-400"
              strokeWidth="2"
            />
            <text x="10" y="20" className="text-[10px] fill-blue-500 font-medium">Inflow Hydrograph</text>

            {/* Timestep bars */}
            {Array.from({length: 25}, (_, i) => {
              const t = i * 4;
              const timestep = getTimestepAtTime(t);
              const barHeight = (timestep / maxTimestep[0]) * 30;
              const isActive = time >= t && time < t + 4;
              return (
                <rect
                  key={i}
                  x={t * 4}
                  y={135 - barHeight}
                  width="12"
                  height={barHeight}
                  className={`transition-colors ${
                    isActive ? "fill-emerald-500" :
                    time > t ? "fill-emerald-400/50" : "fill-slate-400/30"
                  }`}
                  rx="2"
                />
              );
            })}

            {/* Current time indicator */}
            {isAnimating && (
              <line
                x1={time * 4}
                y1="0"
                x2={time * 4}
                y2="140"
                className="stroke-red-500 stroke-2"
                strokeDasharray="4,4"
              />
            )}

            {/* Labels */}
            <text x="10" y="138" className="text-[8px] fill-muted-foreground">Time →</text>
            <text x="380" y="138" textAnchor="end" className="text-[8px] fill-emerald-500">Δt bars</text>
          </svg>

          {/* Current timestep display */}
          <div className="absolute top-2 right-2 bg-background/90 border border-border rounded-lg p-2 text-xs">
            <div className="text-muted-foreground">Current Δt:</div>
            <div className="font-mono font-bold text-emerald-500" data-testid="text-current-timestep">
              {getTimestepAtTime(time).toFixed(1)} sec
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="space-y-2">
            <Label className="text-xs">Min Timestep: <span className="font-mono">{minTimestep[0]}s</span></Label>
            <Slider
              value={minTimestep}
              onValueChange={setMinTimestep}
              min={0.1}
              max={2}
              step={0.1}
              data-testid="slider-min-timestep"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Max Timestep: <span className="font-mono">{maxTimestep[0]}s</span></Label>
            <Slider
              value={maxTimestep}
              onValueChange={setMaxTimestep}
              min={5}
              max={60}
              step={5}
              data-testid="slider-max-timestep"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Tolerance: <span className="font-mono">{convergenceTolerance[0]}</span></Label>
            <Slider
              value={convergenceTolerance}
              onValueChange={setConvergenceTolerance}
              min={0.001}
              max={0.1}
              step={0.001}
              data-testid="slider-convergence"
            />
          </div>
        </div>

        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3 text-xs">
          <p className="text-muted-foreground">
            <strong className="text-emerald-600 dark:text-emerald-400">Key insight:</strong> ICM shrinks timesteps 
            during rapid changes (peak flow) for accuracy, then expands during steady periods for speed. 
            Tighter tolerance = more conservative stepping.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export function ThetaParameterDiagram() {
  const [theta, setTheta] = useState([0.65]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [wavePosition, setWavePosition] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const startAnimation = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setWavePosition(0);
    setIsAnimating(true);
    intervalRef.current = setInterval(() => {
      setWavePosition(prev => {
        if (prev >= 100) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          setIsAnimating(false);
          return 0;
        }
        return prev + 2;
      });
    }, 60);
  };

  const thetaValue = theta[0];
  const dampingFactor = (thetaValue - 0.5) * 2;
  const dispersion = thetaValue < 0.55;

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Badge variant="outline" className="text-emerald-600 border-emerald-500">ICM</Badge>
          Theta (θ) Parameter Effect
        </CardTitle>
        <CardDescription>Implicit weighting in the Preissmann scheme</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium">
            Theta (θ): <span className="font-mono text-primary" data-testid="text-theta-value">{thetaValue.toFixed(2)}</span>
          </Label>
          <Slider
            value={theta}
            onValueChange={setTheta}
            min={0.5}
            max={1.0}
            step={0.05}
            data-testid="slider-theta"
          />
          <div className="flex justify-between text-[9px] text-muted-foreground">
            <span>0.5 (Crank-Nicolson)</span>
            <span>0.65 (ICM default)</span>
            <span>1.0 (Fully Implicit)</span>
          </div>
        </div>

        <Button 
          onClick={startAnimation} 
          disabled={isAnimating}
          variant="outline"
          className="w-full"
          data-testid="button-start-theta-animation"
        >
          {isAnimating ? "Wave Propagating..." : "Propagate Wave"}
        </Button>

        <div className="relative h-40 bg-muted/30 rounded-lg border border-border overflow-hidden">
          <svg className="w-full h-full" viewBox="0 0 400 120" preserveAspectRatio="none">
            {/* Channel bed */}
            <rect x="0" y="100" width="400" height="20" className="fill-amber-700/30" />
            
            {/* Theoretical wave (reference) */}
            <path
              d={`M 0 80 
                ${Array.from({length: 100}, (_, i) => {
                  const x = i * 4;
                  const waveCenter = wavePosition * 4;
                  const dist = Math.abs(x - waveCenter);
                  const height = dist < 30 ? 40 * Math.exp(-Math.pow(dist / 15, 2)) : 0;
                  return `L ${x} ${80 - height}`;
                }).join(' ')}
              `}
              fill="none"
              className="stroke-slate-400"
              strokeWidth="2"
              strokeDasharray="4,4"
            />
            
            {/* Numerical wave (affected by theta) */}
            <path
              d={`M 0 80 
                ${Array.from({length: 100}, (_, i) => {
                  const x = i * 4;
                  const lag = dampingFactor * 5;
                  const waveCenter = Math.max(0, wavePosition * 4 - lag);
                  const dist = Math.abs(x - waveCenter);
                  const peakReduction = 1 - dampingFactor * 0.4;
                  const height = dist < 30 ? 40 * peakReduction * Math.exp(-Math.pow(dist / (15 + dampingFactor * 5), 2)) : 0;
                  const oscillation = dispersion && dist < 40 ? Math.sin(dist * 0.3) * 3 * (1 - dampingFactor) : 0;
                  return `L ${x} ${80 - height + oscillation}`;
                }).join(' ')}
              `}
              fill="none"
              className="stroke-emerald-500"
              strokeWidth="2.5"
            />
            
            {/* Legend */}
            <line x1="20" y1="15" x2="50" y2="15" className="stroke-slate-400" strokeWidth="2" strokeDasharray="4,4" />
            <text x="55" y="18" className="text-[9px] fill-muted-foreground">Theoretical</text>
            
            <line x1="120" y1="15" x2="150" y2="15" className="stroke-emerald-500" strokeWidth="2.5" />
            <text x="155" y="18" className="text-[9px] fill-emerald-500">Numerical</text>
          </svg>

          {/* Effect indicator */}
          <div className={`absolute bottom-2 left-2 text-[9px] font-mono px-2 py-1 rounded border ${
            thetaValue < 0.55 ? "bg-yellow-500/20 border-yellow-500 text-yellow-600" :
            thetaValue > 0.8 ? "bg-amber-500/20 border-amber-500 text-amber-600" :
            "bg-emerald-500/20 border-emerald-500 text-emerald-600"
          }`} data-testid="text-theta-effect">
            {thetaValue < 0.55 && "Low damping, possible oscillations"}
            {thetaValue >= 0.55 && thetaValue <= 0.8 && "Balanced (typical range)"}
            {thetaValue > 0.8 && "High damping, peak reduction"}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 text-[10px]">
          <div className={`p-2 rounded border text-center ${thetaValue < 0.55 ? "border-yellow-500 bg-yellow-500/10" : "border-border"}`}>
            <div className="font-semibold">θ ≈ 0.5</div>
            <p className="text-muted-foreground">Less damping</p>
            <p className="text-muted-foreground">May oscillate</p>
          </div>
          <div className={`p-2 rounded border text-center ${thetaValue >= 0.55 && thetaValue <= 0.8 ? "border-emerald-500 bg-emerald-500/10" : "border-border"}`}>
            <div className="font-semibold">θ ≈ 0.65</div>
            <p className="text-muted-foreground">ICM default</p>
            <p className="text-muted-foreground">Good balance</p>
          </div>
          <div className={`p-2 rounded border text-center ${thetaValue > 0.8 ? "border-amber-500 bg-amber-500/10" : "border-border"}`}>
            <div className="font-semibold">θ = 1.0</div>
            <p className="text-muted-foreground">Heavy damping</p>
            <p className="text-muted-foreground">Reduces peaks</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function Coupling1D2DDiagram() {
  const [exchangeTimestep, setExchangeTimestep] = useState([2]);
  const [waterLevel, setWaterLevel] = useState([80]);
  const [isAnimating, setIsAnimating] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const level = waterLevel[0];
  const isSurfaceFlooding = level > 100;
  const isReverseFlow = level > 120;

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const simulateFlood = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setWaterLevel([60]);
    setIsAnimating(true);
    
    intervalRef.current = setInterval(() => {
      setWaterLevel(prev => {
        const newLevel = prev[0] + 2;
        if (newLevel >= 140) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          setIsAnimating(false);
          return [140];
        }
        return [newLevel];
      });
    }, 150);
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Badge variant="outline" className="text-emerald-600 border-emerald-500">ICM</Badge>
          1D-2D Coupling & Exchange
        </CardTitle>
        <CardDescription>How the pipe network interacts with surface flooding</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Visualization */}
          <div className="relative h-72 bg-muted/30 rounded-lg border border-border overflow-hidden">
            <svg className="w-full h-full" viewBox="0 0 200 180" aria-hidden="true">
              {/* Ground surface / 2D mesh representation */}
              <rect x="0" y="40" width="200" height="8" className="fill-amber-700/50" />
              <line x1="0" y1="40" x2="200" y2="40" className="stroke-amber-800 stroke-2" />
              
              {/* 2D mesh grid lines */}
              {[0, 40, 80, 120, 160, 200].map(x => (
                <line key={x} x1={x} y1="0" x2={x} y2="40" className="stroke-slate-400/30 stroke-1" />
              ))}
              {[0, 20, 40].map(y => (
                <line key={y} x1="0" y1={y} x2="200" y2={y} className="stroke-slate-400/30 stroke-1" />
              ))}
              <text x="5" y="15" className="text-[7px] fill-slate-500">2D Surface Mesh</text>
              
              {/* Surface flood water */}
              {isSurfaceFlooding && (
                <motion.rect 
                  x="0" y={35 - Math.min(35, (level - 100) * 0.5)}
                  width="200" 
                  height={Math.min(35, (level - 100) * 0.5) + 5}
                  className="fill-blue-400/40"
                  animate={{ opacity: [0.3, 0.5, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}
              
              {/* Manhole */}
              <rect x="80" y="48" width="40" height="80" className="fill-slate-300 dark:fill-slate-600" />
              <rect x="85" y="48" width="30" height="80" className="fill-background" />
              <ellipse cx="100" cy="44" rx="25" ry="5" className="fill-slate-600" />
              
              {/* Pipes (1D network) */}
              <rect x="0" y="100" width="85" height="14" rx="7" className="fill-slate-400 dark:fill-slate-500" />
              <rect x="115" y="100" width="85" height="14" rx="7" className="fill-slate-400 dark:fill-slate-500" />
              <text x="5" y="95" className="text-[7px] fill-slate-500">1D Network</text>
              
              {/* Water in manhole */}
              <rect 
                x="85" 
                y={128 - Math.min(80, level * 0.8)}
                width="30" 
                height={Math.min(80, level * 0.8)}
                className="fill-blue-400/60"
              />
              
              {/* Outflow to surface (orifice) */}
              {isSurfaceFlooding && !isReverseFlow && (
                <g>
                  <motion.path
                    d="M 100 48 Q 100 30 120 25"
                    fill="none"
                    className="stroke-blue-500"
                    strokeWidth="3"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                  />
                  <motion.path
                    d="M 100 48 Q 100 30 80 25"
                    fill="none"
                    className="stroke-blue-500"
                    strokeWidth="3"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 0.5, repeat: Infinity, delay: 0.25 }}
                  />
                  <text x="130" y="30" className="text-[7px] fill-blue-600">Orifice outflow</text>
                </g>
              )}
              
              {/* Reverse flow (weir) */}
              {isReverseFlow && (
                <g>
                  <motion.path
                    d="M 120 20 Q 100 35 100 50"
                    fill="none"
                    className="stroke-cyan-500"
                    strokeWidth="3"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                  />
                  <motion.path
                    d="M 80 20 Q 100 35 100 50"
                    fill="none"
                    className="stroke-cyan-500"
                    strokeWidth="3"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 0.5, repeat: Infinity, delay: 0.25 }}
                  />
                  <text x="130" y="20" className="text-[7px] fill-cyan-600">Weir inflow</text>
                </g>
              )}
              
              {/* Exchange timestep indicator */}
              <rect x="150" y="140" width="45" height="35" rx="4" className="fill-background stroke-border" />
              <text x="172" y="152" textAnchor="middle" className="text-[7px] fill-muted-foreground">Exchange Δt</text>
              <text x="172" y="168" textAnchor="middle" className="text-[11px] fill-emerald-500 font-mono font-bold">{exchangeTimestep[0]}s</text>
            </svg>

            {/* Status indicator */}
            <div className={`absolute bottom-2 left-2 text-[9px] font-mono px-2 py-1 rounded border ${
              isReverseFlow ? "bg-cyan-500/20 border-cyan-500 text-cyan-600" :
              isSurfaceFlooding ? "bg-blue-500/20 border-blue-500 text-blue-600" :
              "bg-slate-500/20 border-slate-500 text-slate-600"
            }`} data-testid="text-coupling-status">
              {isReverseFlow ? "Weir Inflow (2D→1D)" :
               isSurfaceFlooding ? "Orifice Outflow (1D→2D)" :
               "Below Ground (1D only)"}
            </div>
          </div>

          {/* Controls */}
          <div className="space-y-4">
            <Button 
              onClick={simulateFlood} 
              disabled={isAnimating}
              className="w-full"
              data-testid="button-simulate-flood"
            >
              {isAnimating ? "Flooding..." : "Simulate Rising Water"}
            </Button>

            <div className="space-y-2">
              <Label className="text-sm">Water Level: <span className="font-mono">{level}%</span></Label>
              <Slider
                value={waterLevel}
                onValueChange={setWaterLevel}
                min={40}
                max={140}
                step={5}
                data-testid="slider-coupling-water"
                disabled={isAnimating}
              />
              <p className="text-[10px] text-muted-foreground">100% = ground level</p>
            </div>

            <div className="space-y-2">
              <Label className="text-sm">Exchange Timestep: <span className="font-mono">{exchangeTimestep[0]}s</span></Label>
              <Slider
                value={exchangeTimestep}
                onValueChange={setExchangeTimestep}
                min={0.5}
                max={10}
                step={0.5}
                data-testid="slider-exchange-timestep"
              />
              <p className="text-[10px] text-muted-foreground">How often 1D/2D data is exchanged</p>
            </div>

            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3 text-xs space-y-2">
              <h4 className="font-semibold text-emerald-600 dark:text-emerald-400">Key Parameters</h4>
              <ul className="text-muted-foreground space-y-1">
                <li>• <strong>Exchange Timestep:</strong> Data sync frequency</li>
                <li>• <strong>Weir Coefficient:</strong> Surface→pipe flow rate</li>
                <li>• <strong>Orifice Coefficient:</strong> Pipe→surface flow rate</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
