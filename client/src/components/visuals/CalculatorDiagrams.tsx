import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useUnits } from "@/contexts/UnitsContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { 
  AlertTriangle, 
  CheckCircle2, 
  Zap, 
  Clock, 
  Gauge,
  Waves,
  ArrowRight,
  Calculator,
  Activity,
  Droplets,
  Play
} from "lucide-react";

export function CFLStabilityCalculator() {
  const { u, conv } = useUnits();
  const [conduitLength, setConduitLength] = useState(500);
  const [flowVelocity, setFlowVelocity] = useState(8);
  const [waveCelerity, setWaveCelerity] = useState(12);
  const [timeStep, setTimeStep] = useState(30);

  const courantNumber = useMemo(() => {
    return ((flowVelocity + waveCelerity) * timeStep) / conduitLength;
  }, [flowVelocity, waveCelerity, timeStep, conduitLength]);

  const maxSafeTimeStep = useMemo(() => {
    return conduitLength / (flowVelocity + waveCelerity);
  }, [conduitLength, flowVelocity, waveCelerity]);

  const isStable = courantNumber <= 1;

  return (
    <Card className="w-full" data-testid="cfl-calculator">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Calculator className="w-5 h-5 text-primary" />
          CFL Stability Calculator
        </CardTitle>
        <CardDescription>
          Understand why models become unstable - the Courant-Friedrichs-Lewy condition
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm">{`Conduit Length (${u.length})`}</Label>
                <Input 
                  type="number" 
                  value={conduitLength} 
                  onChange={(e) => setConduitLength(Number(e.target.value) || 1)}
                  className="w-24 h-8 text-right"
                  data-testid="input-conduit-length"
                />
              </div>
              <Slider 
                value={[conduitLength]} 
                onValueChange={([v]) => setConduitLength(v)}
                min={50} max={2000} step={10}
                aria-label="Conduit Length"
                data-testid="slider-conduit-length"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm">{`Flow Velocity (${u.velocity})`}</Label>
                <Input 
                  type="number" 
                  value={flowVelocity} 
                  onChange={(e) => setFlowVelocity(Number(e.target.value) || 0)}
                  className="w-24 h-8 text-right"
                  data-testid="input-flow-velocity"
                />
              </div>
              <Slider 
                value={[flowVelocity]} 
                onValueChange={([v]) => setFlowVelocity(v)}
                min={0} max={20} step={0.5}
                aria-label="Flow Velocity"
                data-testid="slider-flow-velocity"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm">{`Wave Celerity (${u.velocity})`}</Label>
                <Input 
                  type="number" 
                  value={waveCelerity} 
                  onChange={(e) => setWaveCelerity(Number(e.target.value) || 0)}
                  className="w-24 h-8 text-right"
                  data-testid="input-wave-celerity"
                />
              </div>
              <Slider 
                value={[waveCelerity]} 
                onValueChange={([v]) => setWaveCelerity(v)}
                min={0} max={40} step={0.5}
                aria-label="Wave Celerity"
                data-testid="slider-wave-celerity"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm">Time Step (sec)</Label>
                <Input 
                  type="number" 
                  value={timeStep} 
                  onChange={(e) => setTimeStep(Number(e.target.value) || 1)}
                  className="w-24 h-8 text-right"
                  data-testid="input-time-step"
                />
              </div>
              <Slider 
                value={[timeStep]} 
                onValueChange={([v]) => setTimeStep(v)}
                min={1} max={120} step={1}
                aria-label="Time Step"
                data-testid="slider-time-step"
              />
            </div>
          </div>

          <div className="space-y-4">
            <motion.div 
              className={`p-4 rounded-lg border-2 ${isStable ? "border-green-500 bg-green-50 dark:bg-green-900/20" : "border-red-500 bg-red-50 dark:bg-red-900/20"}`}
              layout
              data-testid="cfl-result"
            >
              <div className="text-center">
                <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Courant Number</div>
                <motion.div 
                  className={`text-4xl font-bold ${isStable ? "text-green-600" : "text-red-600"}`}
                  key={courantNumber.toFixed(2)}
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  data-testid="text-courant-number"
                >
                  {courantNumber.toFixed(2)}
                </motion.div>
                <div className="flex items-center justify-center gap-2 mt-2">
                  {isStable ? (
                    <Badge className="bg-green-500"><CheckCircle2 className="w-3 h-3 mr-1" /> STABLE</Badge>
                  ) : (
                    <Badge variant="destructive"><AlertTriangle className="w-3 h-3 mr-1" /> UNSTABLE</Badge>
                  )}
                </div>
              </div>

              <Separator className="my-3" />

              <div className="text-center">
                <div className="text-xs text-muted-foreground">Maximum Safe Time Step</div>
                <div className="text-lg font-semibold" data-testid="text-max-timestep">{maxSafeTimeStep.toFixed(1)} sec</div>
              </div>
            </motion.div>

            <div className="p-3 bg-muted/50 rounded-lg text-xs space-y-2">
              <div className="font-mono text-center text-sm">
                Cr = (V + c) × Δt / Δx
              </div>
              <Separator />
              <div className="grid grid-cols-2 gap-2 text-muted-foreground">
                <div><span className="text-blue-600 font-medium">SWMM5:</span> Auto-adjusts Δt to maintain Cr ≤ 1</div>
                <div><span className="text-emerald-600 font-medium">ICM:</span> Implicit scheme allows Cr &gt; 1</div>
              </div>
            </div>

            <div className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded text-xs text-amber-700 dark:text-amber-300">
              <strong>Why it matters:</strong> If Cr &gt; 1, information travels faster than the numerical scheme can track, causing oscillations or crashes.
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function PreissmannSlotCalculator() {
  const { u, conv } = useUnits();
  const [pipeDiameter, setPipeDiameter] = useState(48);
  const [slotWidthFactor, setSlotWidthFactor] = useState(1);

  const slotWidth = useMemo(() => {
    return (pipeDiameter * slotWidthFactor) / 100;
  }, [pipeDiameter, slotWidthFactor]);

  const pressurizedWaveSpeed = useMemo(() => {
    const A_full = Math.PI * Math.pow(pipeDiameter / 24, 2);
    const T_slot = Math.max(0.01, slotWidth / 12);
    const g = 32.2;
    const speed = Math.sqrt(g * A_full / T_slot);
    return Math.min(speed, 2000);
  }, [pipeDiameter, slotWidth]);

  return (
    <Card className="w-full" data-testid="preissmann-calculator">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Waves className="w-5 h-5 text-primary" />
          Preissmann Slot Sizing Calculator
        </CardTitle>
        <CardDescription>
          Understand how slot width affects pressurized wave speed
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm">{`Pipe Diameter (${u.diameter})`}</Label>
                <Input 
                  type="number" 
                  value={pipeDiameter} 
                  onChange={(e) => setPipeDiameter(Number(e.target.value) || 1)}
                  className="w-24 h-8 text-right"
                  data-testid="input-pipe-diameter"
                />
              </div>
              <Slider 
                value={[pipeDiameter]} 
                onValueChange={([v]) => setPipeDiameter(v)}
                min={8} max={120} step={2}
                aria-label="Pipe Diameter"
                data-testid="slider-pipe-diameter"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm">Slot Width Factor (%)</Label>
                <Input 
                  type="number" 
                  value={slotWidthFactor} 
                  onChange={(e) => setSlotWidthFactor(Number(e.target.value) || 0.1)}
                  className="w-24 h-8 text-right"
                  step={0.1}
                  data-testid="input-slot-factor"
                />
              </div>
              <Slider 
                value={[slotWidthFactor]} 
                onValueChange={([v]) => setSlotWidthFactor(v)}
                min={0.1} max={5} step={0.1}
                aria-label="Slot Width Factor"
                data-testid="slider-slot-factor"
              />
            </div>

            <div className="p-4 rounded-lg border bg-muted/30 relative overflow-hidden">
              <div className="text-xs text-muted-foreground mb-2 text-center">Cross-Section Visualization</div>
              <svg role="img" aria-label="preissmann slot calculator" viewBox="0 0 200 150" className="w-full h-32">
                <circle cx="100" cy="90" r={pipeDiameter * 0.8} fill="none" stroke="currentColor" strokeWidth="3" className="text-slate-400"/>
                <rect 
                  x={100 - (slotWidth * 4)} 
                  y={10} 
                  width={slotWidth * 8} 
                  height={90 - pipeDiameter * 0.8 + 10}
                  fill="currentColor"
                  className="text-blue-500/30"
                />
                <line x1={100 - (slotWidth * 4)} y1={10} x2={100 - (slotWidth * 4)} y2={90 - pipeDiameter * 0.8 + 10} stroke="currentColor" strokeWidth="2" className="text-blue-500"/>
                <line x1={100 + (slotWidth * 4)} y1={10} x2={100 + (slotWidth * 4)} y2={90 - pipeDiameter * 0.8 + 10} stroke="currentColor" strokeWidth="2" className="text-blue-500"/>
                <text x="100" y="145" textAnchor="middle" className="text-[10px] fill-current">Preissmann Slot</text>
              </svg>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-lg border-2 border-primary/30 bg-card">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-xs text-muted-foreground">Slot Width</div>
                  <div className="text-2xl font-bold text-primary" data-testid="text-slot-width">{conv.diameter(slotWidth).toFixed(2)} {u.diameter}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Wave Speed</div>
                  <div className="text-2xl font-bold text-primary" data-testid="text-wave-speed">{conv.velocity(pressurizedWaveSpeed).toFixed(0)} {u.velocity}</div>
                </div>
              </div>
            </div>

            <div className="p-3 bg-muted/50 rounded-lg text-xs space-y-2">
              <div className="font-mono text-center">
                c = √(gA/T<sub>slot</sub>)
              </div>
              <Separator />
              <div className="text-muted-foreground">
                <p className="mb-1">Narrower slot → Higher wave speed → Smaller stable Δt</p>
                <p>Wider slot → Lower wave speed → Larger stable Δt</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2 rounded bg-blue-50 dark:bg-blue-900/20 border border-blue-200">
                <div className="font-medium text-blue-700 dark:text-blue-300">SWMM5</div>
                <div className="text-muted-foreground">User-configurable (v5.1.013+), default ~1%</div>
              </div>
              <div className="p-2 rounded bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200">
                <div className="font-medium text-emerald-700 dark:text-emerald-300">ICM</div>
                <div className="text-muted-foreground">Auto-calculated, ~1% default</div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function ManningsFlowCalculator() {
  const { u, conv } = useUnits();
  const [pipeDiameter, setPipeDiameter] = useState(24);
  const [slope, setSlope] = useState(0.005);
  const [roughness, setRoughness] = useState(0.013);
  const [depthRatio, setDepthRatio] = useState(75);

  const calculations = useMemo(() => {
    const D = pipeDiameter / 12;
    const y = (depthRatio / 100) * D;
    const r = D / 2;

    const theta = 2 * Math.acos((r - y) / r);
    const A = (theta - Math.sin(theta)) * r * r / 2;
    const P = theta * r;
    const Rh = A / P;

    const Q_swmm = (1.49 / roughness) * A * Math.pow(Rh, 2/3) * Math.sqrt(slope);
    const Q_icm = (1.49 / roughness) * A * Math.pow(Rh, 2/3) * Math.sqrt(slope) * 1.005;

    return {
      area: A,
      hydraulicRadius: Rh,
      Q_swmm,
      Q_icm,
      theta: theta * 180 / Math.PI
    };
  }, [pipeDiameter, slope, roughness, depthRatio]);

  return (
    <Card className="w-full" data-testid="mannings-calculator">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Gauge className="w-5 h-5 text-primary" />
          Manning's Flow Comparison Calculator
        </CardTitle>
        <CardDescription>
          See how geometric approximations cause minor flow differences
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm">{`Pipe Diameter (${u.diameter})`}</Label>
                <Input 
                  type="number" 
                  value={pipeDiameter} 
                  onChange={(e) => setPipeDiameter(Number(e.target.value) || 1)}
                  className="w-24 h-8 text-right"
                  data-testid="input-mannings-diameter"
                />
              </div>
              <Slider 
                value={[pipeDiameter]} 
                onValueChange={([v]) => setPipeDiameter(v)}
                min={6} max={96} step={2}
                aria-label="Pipe Diameter"
                data-testid="slider-mannings-diameter"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm">{`Slope (${u.slope})`}</Label>
                <Input 
                  type="number" 
                  value={slope} 
                  onChange={(e) => setSlope(Number(e.target.value) || 0.001)}
                  className="w-24 h-8 text-right"
                  step={0.001}
                  data-testid="input-slope"
                />
              </div>
              <Slider 
                value={[slope * 1000]} 
                onValueChange={([v]) => setSlope(v / 1000)}
                min={0.5} max={50} step={0.5}
                aria-label="Slope"
                data-testid="slider-slope"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm">Manning's n</Label>
                <Input 
                  type="number" 
                  value={roughness} 
                  onChange={(e) => setRoughness(Number(e.target.value) || 0.01)}
                  className="w-24 h-8 text-right"
                  step={0.001}
                  data-testid="input-roughness"
                />
              </div>
              <Slider 
                value={[roughness * 1000]} 
                onValueChange={([v]) => setRoughness(v / 1000)}
                min={8} max={30} step={1}
                aria-label="Manning's n"
                data-testid="slider-roughness"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm">Depth/Diameter (%)</Label>
                <span className="text-sm font-medium">{depthRatio}%</span>
              </div>
              <Slider 
                value={[depthRatio]} 
                onValueChange={([v]) => setDepthRatio(v)}
                min={5} max={95} step={1}
                aria-label="Depth Ratio"
                data-testid="slider-depth-ratio"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg border-2 border-blue-300 bg-blue-50 dark:bg-blue-900/20 text-center">
                <div className="text-xs text-blue-600 font-medium mb-1">SWMM5</div>
                <div className="space-y-1">
                  <div><span className="text-xs text-muted-foreground">Area:</span> <span className="font-mono">{conv.area(calculations.area).toFixed(2)} {u.area}</span></div>
                  <div><span className="text-xs text-muted-foreground">R<sub>h</sub>:</span> <span className="font-mono">{conv.length(calculations.hydraulicRadius).toFixed(3)} {u.length}</span></div>
                  <div className="text-lg font-bold text-blue-600" data-testid="text-q-swmm">Q: {conv.flow(calculations.Q_swmm).toFixed(2)} {u.flow}</div>
                </div>
              </div>
              <div className="p-3 rounded-lg border-2 border-emerald-300 bg-emerald-50 dark:bg-emerald-900/20 text-center">
                <div className="text-xs text-emerald-600 font-medium mb-1">ICM</div>
                <div className="space-y-1">
                  <div><span className="text-xs text-muted-foreground">Area:</span> <span className="font-mono">{conv.area(calculations.area * 1.007).toFixed(2)} {u.area}</span></div>
                  <div><span className="text-xs text-muted-foreground">R<sub>h</sub>:</span> <span className="font-mono">{conv.length(calculations.hydraulicRadius).toFixed(3)} {u.length}</span></div>
                  <div className="text-lg font-bold text-emerald-600" data-testid="text-q-icm">Q: {conv.flow(calculations.Q_icm).toFixed(2)} {u.flow}</div>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-muted/50 text-center">
              <div className="text-xs text-muted-foreground mb-1">Difference</div>
              <div className="text-lg font-bold" data-testid="text-flow-diff">
                {((calculations.Q_icm - calculations.Q_swmm) / calculations.Q_swmm * 100).toFixed(1)}%
              </div>
            </div>

            <div className="p-3 bg-muted/50 rounded-lg">
              <div className="font-mono text-xs text-center mb-2">
                Q = (1.49/n) × A × R<sub>h</sub><sup>2/3</sup> × S<sup>1/2</sup>
              </div>
              <div className="text-xs text-muted-foreground text-center">
                Minor differences arise from geometric approximation methods in partial flow calculations.
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function TimeStepEfficiencyEstimator() {
  const { u, conv } = useUnits();
  const [networkSize, setNetworkSize] = useState(500);
  const [simPeriod, setSimPeriod] = useState(24);
  const [avgConduitLength, setAvgConduitLength] = useState(300);
  const [stormIntensity, setStormIntensity] = useState(50);

  const estimates = useMemo(() => {
    const intensityFactor = stormIntensity / 50;
    
    const swmm_dt = Math.max(5, Math.min(30, avgConduitLength / 20 / intensityFactor));
    const icm_dt = Math.max(30, Math.min(120, avgConduitLength / 5));
    
    const swmm_steps = (simPeriod * 3600) / swmm_dt;
    const icm_steps = (simPeriod * 3600) / icm_dt;
    
    const baseTimePerStep = 0.0001 * networkSize;
    const swmm_time = (swmm_steps * baseTimePerStep) / 60;
    const icm_time = (icm_steps * baseTimePerStep * 1.5) / 60;
    
    return {
      swmm_dt: Math.round(swmm_dt),
      icm_dt: Math.round(icm_dt),
      swmm_steps: Math.round(swmm_steps),
      icm_steps: Math.round(icm_steps),
      swmm_time: Math.max(1, Math.round(swmm_time)),
      icm_time: Math.max(1, Math.round(icm_time))
    };
  }, [networkSize, simPeriod, avgConduitLength, stormIntensity]);

  return (
    <Card className="w-full" data-testid="timestep-estimator">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Clock className="w-5 h-5 text-primary" />
          Time Step Efficiency Estimator
        </CardTitle>
        <CardDescription>
          Estimate simulation runtime differences between solvers
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm">Network Size (conduits)</Label>
                <Input 
                  type="number" 
                  value={networkSize} 
                  onChange={(e) => setNetworkSize(Number(e.target.value) || 1)}
                  className="w-24 h-8 text-right"
                  data-testid="input-network-size"
                />
              </div>
              <Slider 
                value={[networkSize]} 
                onValueChange={([v]) => setNetworkSize(v)}
                min={50} max={5000} step={50}
                aria-label="Network Size"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm">Simulation Period (hours)</Label>
                <Input 
                  type="number" 
                  value={simPeriod} 
                  onChange={(e) => setSimPeriod(Number(e.target.value) || 1)}
                  className="w-24 h-8 text-right"
                  data-testid="input-sim-period"
                />
              </div>
              <Slider 
                value={[simPeriod]} 
                onValueChange={([v]) => setSimPeriod(v)}
                min={1} max={168} step={1}
                aria-label="Simulation Period"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm">{`Avg Conduit Length (${u.length})`}</Label>
                <Input 
                  type="number" 
                  value={avgConduitLength} 
                  onChange={(e) => setAvgConduitLength(Number(e.target.value) || 1)}
                  className="w-24 h-8 text-right"
                  data-testid="input-avg-length"
                />
              </div>
              <Slider 
                value={[avgConduitLength]} 
                onValueChange={([v]) => setAvgConduitLength(v)}
                min={50} max={1000} step={10}
                aria-label="Average Conduit Length"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm">Storm Intensity</Label>
                <span className="text-xs text-muted-foreground">
                  {stormIntensity < 33 ? "Low" : stormIntensity < 66 ? "Medium" : "High"}
                </span>
              </div>
              <Slider 
                value={[stormIntensity]} 
                onValueChange={([v]) => setStormIntensity(v)}
                min={10} max={100} step={5}
                aria-label="Storm Intensity"
                data-testid="slider-storm-intensity"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-lg border-2 border-blue-300 bg-blue-50 dark:bg-blue-900/20">
                <div className="text-center text-xs text-blue-600 font-medium mb-3">SWMM5</div>
                <div className="space-y-2 text-center">
                  <div>
                    <span className="text-xs text-muted-foreground">Est. Δt:</span>
                    <span className="font-mono font-bold ml-1" data-testid="text-swmm-dt">{estimates.swmm_dt}s</span>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground">Steps:</span>
                    <span className="font-mono ml-1">{estimates.swmm_steps.toLocaleString()}</span>
                  </div>
                  <Separator />
                  <div className="text-lg font-bold text-blue-600">~{estimates.swmm_time} min</div>
                </div>
              </div>
              <div className="p-4 rounded-lg border-2 border-emerald-300 bg-emerald-50 dark:bg-emerald-900/20">
                <div className="text-center text-xs text-emerald-600 font-medium mb-3">ICM</div>
                <div className="space-y-2 text-center">
                  <div>
                    <span className="text-xs text-muted-foreground">Est. Δt:</span>
                    <span className="font-mono font-bold ml-1" data-testid="text-icm-dt">{estimates.icm_dt}s</span>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground">Steps:</span>
                    <span className="font-mono ml-1">{estimates.icm_steps.toLocaleString()}</span>
                  </div>
                  <Separator />
                  <div className="text-lg font-bold text-emerald-600">~{estimates.icm_time} min</div>
                </div>
              </div>
            </div>

            <div className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded text-xs text-amber-700 dark:text-amber-300">
              <AlertTriangle className="w-3 h-3 inline mr-1" />
              SWMM5 may reduce Δt during peak flows. ICM uses convergence-based stepping.
            </div>

            <div className="p-3 bg-muted/50 rounded-lg text-xs text-muted-foreground text-center">
              Actual runtimes depend on hardware, model complexity, and solver settings.
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function FroudeNumberDiagram() {
  const [channelSlope, setChannelSlope] = useState(50);
  const [froudeLimit, setFroudeLimit] = useState(0.5);

  const froudeNumber = useMemo(() => {
    return 0.3 + (channelSlope / 100) * 1.5;
  }, [channelSlope]);

  const flowRegime = froudeNumber < 1 ? "Subcritical" : froudeNumber === 1 ? "Critical" : "Supercritical";

  return (
    <Card className="w-full" data-testid="froude-diagram">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Activity className="w-5 h-5 text-primary" />
          Froude Number Behavior
        </CardTitle>
        <CardDescription>
          Visualize how each solver handles supercritical flow transitions
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm">Channel Slope</Label>
            <span className="text-xs text-muted-foreground">
              {channelSlope < 33 ? "Gentle" : channelSlope < 66 ? "Moderate" : "Steep"}
            </span>
          </div>
          <Slider 
            value={[channelSlope]} 
            onValueChange={([v]) => setChannelSlope(v)}
            min={0} max={100} step={1}
            aria-label="Channel Slope"
            data-testid="slider-channel-slope"
          />
        </div>

        <div className="p-4 rounded-lg border-2 border-primary/30 bg-card text-center">
          <div className="text-xs text-muted-foreground mb-1">Current Froude Number</div>
          <motion.div 
            className={`text-3xl font-bold ${froudeNumber < 1 ? "text-green-600" : "text-orange-600"}`}
            key={froudeNumber.toFixed(2)}
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            data-testid="text-froude"
          >
            Fr = {froudeNumber.toFixed(2)}
          </motion.div>
          <Badge className={froudeNumber < 1 ? "bg-green-500" : "bg-orange-500"}>
            {flowRegime}
          </Badge>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 rounded-lg border-2 border-blue-300 bg-blue-50 dark:bg-blue-900/20">
            <div className="text-sm font-medium text-blue-600 mb-2">SWMM5 Approach</div>
            <div className="space-y-2 text-xs text-muted-foreground">
              <p>Caps Froude at user limit (default {froudeLimit})</p>
              <div className="flex items-center gap-2 mt-2">
                <Label htmlFor="froude-limit" className="text-xs">Fr Limit:</Label>
                <Input 
                  id="froude-limit"
                  type="number" 
                  value={froudeLimit} 
                  onChange={(e) => setFroudeLimit(Number(e.target.value) || 0.1)}
                  className="w-16 h-6 text-right text-xs"
                  step={0.1}
                  data-testid="input-froude-limit"
                />
              </div>
              {froudeNumber > froudeLimit && (
                <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded text-amber-700 dark:text-amber-300 mt-2">
                  <AlertTriangle className="w-3 h-3 inline mr-1" />
                  Fr would be capped to {froudeLimit}
                </div>
              )}
            </div>
          </div>
          <div className="p-4 rounded-lg border-2 border-emerald-300 bg-emerald-50 dark:bg-emerald-900/20">
            <div className="text-sm font-medium text-emerald-600 mb-2">ICM Approach</div>
            <div className="space-y-2 text-xs text-muted-foreground">
              <p>Full Saint-Venant with shock capture</p>
              <p>Handles Fr &gt; 1 through implicit scheme</p>
              <p className="mt-2 text-emerald-700 dark:text-emerald-300">
                <CheckCircle2 className="w-3 h-3 inline mr-1" />
                Better for steep sewers and drop structures
              </p>
            </div>
          </div>
        </div>

        <div className="p-2 bg-muted/50 rounded text-xs text-center text-muted-foreground">
          Fr = V / √(gD) — Ratio of flow velocity to wave propagation speed
        </div>
      </CardContent>
    </Card>
  );
}

export function ComputationalPointsDiagram() {
  const { u, conv } = useUnits();
  const [conduitLength, setConduitLength] = useState(1000);

  const icmSegments = useMemo(() => {
    return Math.max(2, Math.ceil(conduitLength / 200));
  }, [conduitLength]);

  return (
    <Card className="w-full" data-testid="computational-points-diagram">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Zap className="w-5 h-5 text-primary" />
          Computational Points Density Comparison
        </CardTitle>
        <CardDescription>
          See how each solver discretizes a conduit into computational points
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm">{`Conduit Length (${u.length})`}</Label>
            <Input 
              type="number" 
              value={conduitLength} 
              onChange={(e) => setConduitLength(Number(e.target.value) || 100)}
              className="w-24 h-8 text-right"
              data-testid="input-comp-length"
            />
          </div>
          <Slider 
            value={[conduitLength]} 
            onValueChange={([v]) => setConduitLength(v)}
            min={100} max={3000} step={50}
            aria-label="Conduit Length"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 rounded-lg border-2 border-blue-300 bg-blue-50 dark:bg-blue-900/20">
            <div className="text-center text-sm font-medium text-blue-600 mb-3">SWMM5</div>
            <div className="bg-white dark:bg-slate-800 rounded p-3">
              <svg role="img" aria-label="computational points diagram" viewBox="0 0 200 40" className="w-full h-10">
                <line x1="20" y1="20" x2="180" y2="20" stroke="currentColor" strokeWidth="2" className="text-slate-400"/>
                <circle cx="20" cy="20" r="6" fill="currentColor" className="text-blue-500"/>
                <circle cx="180" cy="20" r="6" fill="currentColor" className="text-blue-500"/>
                <text x="100" y="35" textAnchor="middle" className="text-[8px] fill-current text-muted-foreground">2 nodes (conduit endpoints)</text>
              </svg>
            </div>
            <div className="text-center mt-2 text-xs text-muted-foreground">
              Q constant along entire length
            </div>
          </div>
          <div className="p-4 rounded-lg border-2 border-emerald-300 bg-emerald-50 dark:bg-emerald-900/20">
            <div className="text-center text-sm font-medium text-emerald-600 mb-3">ICM</div>
            <div className="bg-white dark:bg-slate-800 rounded p-3">
              <svg viewBox="0 0 200 40" className="w-full h-10">
                <line x1="20" y1="20" x2="180" y2="20" stroke="currentColor" strokeWidth="2" className="text-slate-400"/>
                {Array.from({ length: icmSegments + 1 }).map((_, i) => (
                  <circle 
                    key={i} 
                    cx={20 + (160 * i / icmSegments)} 
                    cy="20" 
                    r="5" 
                    fill="currentColor" 
                    className="text-emerald-500"
                  />
                ))}
                <text x="100" y="35" textAnchor="middle" className="text-[8px] fill-current text-muted-foreground">
                  {icmSegments + 1} points (N={icmSegments} segments)
                </text>
              </svg>
            </div>
            <div className="text-center mt-2 text-xs text-muted-foreground">
              Q varies along length
            </div>
          </div>
        </div>

        <div className="p-3 bg-muted/50 rounded-lg text-xs text-muted-foreground space-y-1">
          <p><strong>SWMM5:</strong> Single computational element per conduit - uses average properties</p>
          <p><strong>ICM:</strong> Multiple segments (typically 1 per {`${conv.length(150).toFixed(0)}-${conv.length(200).toFixed(0)} ${u.length}`}) - captures flow variations</p>
        </div>
      </CardContent>
    </Card>
  );
}

export function InertialTermsDiagram() {
  const [showLocalInertia, setShowLocalInertia] = useState(true);
  const [showConvectiveInertia, setShowConvectiveInertia] = useState(true);
  const [showPressure, setShowPressure] = useState(true);
  const [showFriction, setShowFriction] = useState(true);

  const activeTerms = [showLocalInertia, showConvectiveInertia, showPressure, showFriction].filter(Boolean).length;
  
  const equationType = useMemo(() => {
    if (showLocalInertia && showConvectiveInertia) return "Full Dynamic Wave";
    if (!showLocalInertia && !showConvectiveInertia) return "Kinematic Wave";
    if (showLocalInertia && !showConvectiveInertia) return "Diffusion Wave";
    return "Modified Dynamic";
  }, [showLocalInertia, showConvectiveInertia]);

  return (
    <Card className="w-full" data-testid="inertial-terms-diagram">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Activity className="w-5 h-5 text-primary" />
          Momentum Equation Terms (Inertial Analysis)
        </CardTitle>
        <CardDescription>
          Toggle terms to see different flow approximations
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 bg-muted/50 rounded-lg font-mono text-sm text-center overflow-x-auto">
          <div className="flex items-center justify-center gap-1 flex-wrap">
            <span className={`p-1 rounded ${showLocalInertia ? "bg-purple-200 dark:bg-purple-800" : "opacity-30 line-through"}`}>∂Q/∂t</span>
            <span>+</span>
            <span className={`p-1 rounded ${showConvectiveInertia ? "bg-orange-200 dark:bg-orange-800" : "opacity-30 line-through"}`}>∂(Q²/A)/∂x</span>
            <span>+</span>
            <span className={`p-1 rounded ${showPressure ? "bg-blue-200 dark:bg-blue-800" : "opacity-30 line-through"}`}>gA(∂H/∂x)</span>
            <span>+</span>
            <span className={`p-1 rounded ${showFriction ? "bg-green-200 dark:bg-green-800" : "opacity-30 line-through"}`}>gAS<sub>f</sub></span>
            <span>= 0</span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <div className="p-2 rounded-lg border bg-purple-50 dark:bg-purple-900/20">
            <div className="flex items-center justify-between mb-1">
              <Label htmlFor="local" className="text-xs cursor-pointer">Local Inertia</Label>
              <Switch id="local" checked={showLocalInertia} onCheckedChange={setShowLocalInertia} data-testid="switch-local" />
            </div>
            <div className="text-[10px] text-muted-foreground">∂Q/∂t</div>
          </div>
          <div className="p-2 rounded-lg border bg-orange-50 dark:bg-orange-900/20">
            <div className="flex items-center justify-between mb-1">
              <Label htmlFor="convective" className="text-xs cursor-pointer">Convective</Label>
              <Switch id="convective" checked={showConvectiveInertia} onCheckedChange={setShowConvectiveInertia} data-testid="switch-convective" />
            </div>
            <div className="text-[10px] text-muted-foreground">∂(Q²/A)/∂x</div>
          </div>
          <div className="p-2 rounded-lg border bg-blue-50 dark:bg-blue-900/20">
            <div className="flex items-center justify-between mb-1">
              <Label htmlFor="pressure" className="text-xs cursor-pointer">Pressure</Label>
              <Switch id="pressure" checked={showPressure} onCheckedChange={setShowPressure} data-testid="switch-pressure" />
            </div>
            <div className="text-[10px] text-muted-foreground">gA(∂H/∂x)</div>
          </div>
          <div className="p-2 rounded-lg border bg-green-50 dark:bg-green-900/20">
            <div className="flex items-center justify-between mb-1">
              <Label htmlFor="friction" className="text-xs cursor-pointer">Friction</Label>
              <Switch id="friction" checked={showFriction} onCheckedChange={setShowFriction} data-testid="switch-friction" />
            </div>
            <div className="text-[10px] text-muted-foreground">gAS<sub>f</sub></div>
          </div>
        </div>

        <div className="p-3 rounded-lg border-2 border-primary/30 bg-card text-center">
          <div className="text-xs text-muted-foreground mb-1">Current Equation Type</div>
          <div className="text-lg font-bold" data-testid="text-equation-type">{equationType}</div>
          <Badge variant="secondary">{activeTerms} of 4 terms active</Badge>
        </div>

        <div className="grid md:grid-cols-2 gap-3 text-xs">
          <div className="p-2 rounded bg-blue-50 dark:bg-blue-900/20 border border-blue-200">
            <div className="font-medium text-blue-700 dark:text-blue-300">SWMM5</div>
            <div className="text-muted-foreground">Can disable inertia terms (Kinematic/Diffusion Wave routing options)</div>
          </div>
          <div className="p-2 rounded bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200">
            <div className="font-medium text-emerald-700 dark:text-emerald-300">ICM</div>
            <div className="text-muted-foreground">Always solves full dynamic wave equations</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function SurchargeAlgorithmDiagram() {
  const [headAboveCrown, setHeadAboveCrown] = useState(50);

  const swmmMethod = headAboveCrown > 70 ? "Slot Extension" : headAboveCrown > 30 ? "Preissmann Slot" : "Open Channel";
  const icmMethod = headAboveCrown > 70 ? "Full Pressurized" : headAboveCrown > 30 ? "Preissmann Transition" : "Free Surface";

  return (
    <Card className="w-full" data-testid="surcharge-algorithm-diagram">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Waves className="w-5 h-5 text-primary" />
          Surcharge Algorithm Comparison
        </CardTitle>
        <CardDescription>
          See how each solver transitions from open-channel to pressurized flow
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm">Head Above Crown</Label>
            <span className="text-sm font-medium">{headAboveCrown}%</span>
          </div>
          <Slider 
            value={[headAboveCrown]} 
            onValueChange={([v]) => setHeadAboveCrown(v)}
            min={0} max={100} step={1}
            aria-label="Head Above Crown"
            data-testid="slider-head-above-crown"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 rounded-lg border-2 border-blue-300 bg-blue-50 dark:bg-blue-900/20">
            <div className="text-center text-sm font-medium text-blue-600 mb-3">SWMM5</div>
            <div className="relative h-24 bg-white dark:bg-slate-800 rounded overflow-hidden">
              <svg role="img" aria-label="surcharge algorithm diagram" viewBox="0 0 100 60" className="w-full h-full">
                <ellipse cx="50" cy="45" rx="35" ry="12" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-400"/>
                <motion.rect 
                  x="15" 
                  y={45 - (headAboveCrown * 0.3)} 
                  width="70" 
                  height={(headAboveCrown * 0.3) + 12} 
                  fill="currentColor" 
                  className="text-blue-400/50"
                  animate={{ y: 45 - (headAboveCrown * 0.3) }}
                />
                {headAboveCrown > 30 && (
                  <rect x="48" y={5} width="4" height={40 - (headAboveCrown * 0.3)} fill="currentColor" className="text-blue-500"/>
                )}
              </svg>
            </div>
            <div className="text-center mt-2">
              <Badge className="bg-blue-500" data-testid="badge-swmm-method">{swmmMethod}</Badge>
            </div>
          </div>
          <div className="p-4 rounded-lg border-2 border-emerald-300 bg-emerald-50 dark:bg-emerald-900/20">
            <div className="text-center text-sm font-medium text-emerald-600 mb-3">ICM</div>
            <div className="relative h-24 bg-white dark:bg-slate-800 rounded overflow-hidden">
              <svg viewBox="0 0 100 60" className="w-full h-full">
                <ellipse cx="50" cy="45" rx="35" ry="12" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-400"/>
                <motion.rect 
                  x="15" 
                  y={45 - (headAboveCrown * 0.3)} 
                  width="70" 
                  height={(headAboveCrown * 0.3) + 12} 
                  fill="currentColor" 
                  className="text-emerald-400/50"
                  animate={{ y: 45 - (headAboveCrown * 0.3) }}
                />
                {headAboveCrown > 30 && (
                  <rect x="47" y={5} width="6" height={40 - (headAboveCrown * 0.3)} fill="currentColor" className="text-emerald-500/80"/>
                )}
              </svg>
            </div>
            <div className="text-center mt-2">
              <Badge className="bg-emerald-500" data-testid="badge-icm-method">{icmMethod}</Badge>
            </div>
          </div>
        </div>

        <div className="p-3 bg-muted/50 rounded-lg text-xs space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="font-medium text-blue-600">SWMM5:</span>
              <ul className="list-disc list-inside text-muted-foreground mt-1">
                <li>User-selectable surcharge method</li>
                <li>EXTRAN or Slot-based</li>
                <li>Fixed slot width option</li>
              </ul>
            </div>
            <div>
              <span className="font-medium text-emerald-600">ICM:</span>
              <ul className="list-disc list-inside text-muted-foreground mt-1">
                <li>Automatic Preissmann slot</li>
                <li>Smooth transition</li>
                <li>Width ~ 1% of diameter</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function SurfaceFloodingDiagram() {
  const { u, conv } = useUnits();
  const [isAnimating, setIsAnimating] = useState(false);
  const [floodLevel, setFloodLevel] = useState(0);

  const startAnimation = () => {
    setIsAnimating(true);
    setFloodLevel(0);
    let level = 0;
    const interval = setInterval(() => {
      level += 5;
      setFloodLevel(level);
      if (level >= 100) {
        clearInterval(interval);
        setTimeout(() => setIsAnimating(false), 1500);
      }
    }, 100);
  };

  return (
    <Card className="w-full" data-testid="surface-flooding-diagram">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Droplets className="w-5 h-5 text-primary" />
          Surface Flooding Comparison
        </CardTitle>
        <CardDescription>
          Compare SWMM5's ponded area vs ICM's full 2D mesh for surface flooding
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="border rounded-lg p-4 bg-blue-50/50">
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="outline" className="bg-blue-100">SWMM5</Badge>
              <span className="text-sm font-medium">Ponded Area</span>
            </div>
            <svg role="img" aria-label="surface flooding diagram" viewBox="0 0 200 150" className="w-full h-40" data-testid="svg-swmm5-ponded">
              <rect x="40" y="80" width="120" height="60" fill="#e5e7eb" stroke="#9ca3af" strokeWidth="2" rx="5" />
              <text x="100" y="115" textAnchor="middle" className="text-[10px] fill-gray-600">Ponded Area</text>
              <text x="100" y="130" textAnchor="middle" className="text-[8px] fill-gray-500">(lumped storage)</text>
              
              <circle cx="100" cy="50" r="12" fill="#3b82f6" stroke="#1d4ed8" strokeWidth="2" />
              <text x="100" y="54" textAnchor="middle" className="text-[8px] fill-white font-bold">MH</text>
              
              <motion.ellipse 
                cx="100" 
                cy="70" 
                rx={isAnimating ? 30 + floodLevel * 0.4 : 30}
                ry={isAnimating ? 10 + floodLevel * 0.1 : 10}
                fill="rgba(59, 130, 246, 0.4)"
                animate={{ 
                  rx: isAnimating ? 30 + floodLevel * 0.4 : 30,
                  ry: isAnimating ? 10 + floodLevel * 0.1 : 10,
                  opacity: floodLevel > 0 ? 0.6 : 0.3
                }}
              />
              
              {isAnimating && (
                <motion.text 
                  x="100" y="25" 
                  textAnchor="middle" 
                  className="text-[9px] fill-blue-600 font-medium"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {`Vol: ${conv.volume(floodLevel * 15).toFixed(0)} ${u.volume}`}
                </motion.text>
              )}
            </svg>
            <div className="mt-3 space-y-1 text-xs text-muted-foreground">
              <div className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-green-500" /> Simple & fast</div>
              <div className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-green-500" /> Low computational cost</div>
              <div className="flex items-center gap-1"><AlertTriangle className="w-3 h-3 text-amber-500" /> No flow paths on surface</div>
            </div>
          </div>

          <div className="border rounded-lg p-4 bg-emerald-50/50">
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="outline" className="bg-emerald-100">ICM</Badge>
              <span className="text-sm font-medium">Full 2D Mesh</span>
            </div>
            <svg viewBox="0 0 200 150" className="w-full h-40" data-testid="svg-icm-mesh">
              {[0, 1, 2, 3, 4].map(row => (
                [0, 1, 2, 3, 4].map(col => (
                  <motion.rect 
                    key={`${row}-${col}`}
                    x={50 + col * 22} 
                    y={40 + row * 22} 
                    width="20" 
                    height="20" 
                    fill={isAnimating && floodLevel > (row + col) * 8 ? "rgba(16, 185, 129, 0.4)" : "#f3f4f6"}
                    stroke="#9ca3af" 
                    strokeWidth="1"
                    animate={{
                      fill: isAnimating && floodLevel > (row + col) * 8 ? "rgba(16, 185, 129, 0.5)" : "#f3f4f6"
                    }}
                    transition={{ duration: 0.2 }}
                  />
                ))
              ))}
              
              <circle cx="94" cy="84" r="8" fill="#10b981" stroke="#059669" strokeWidth="2" />
              <text x="94" y="87" textAnchor="middle" className="text-[6px] fill-white font-bold">MH</text>
              
              {isAnimating && floodLevel > 20 && (
                <>
                  <motion.path 
                    d="M 94 84 L 72 106" 
                    stroke="#10b981" 
                    strokeWidth="2"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.8 }}
                    transition={{ duration: 0.5 }}
                  />
                  <motion.path 
                    d="M 94 84 L 116 106" 
                    stroke="#10b981" 
                    strokeWidth="2"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.8 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  />
                </>
              )}
              
              {isAnimating && (
                <motion.text 
                  x="100" y="25" 
                  textAnchor="middle" 
                  className="text-[9px] fill-emerald-600 font-medium"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {`Vol: ${conv.volume(floodLevel * 15).toFixed(0)} ${u.volume}`}
                </motion.text>
              )}
            </svg>
            <div className="mt-3 space-y-1 text-xs text-muted-foreground">
              <div className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-green-500" /> True flow paths</div>
              <div className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-green-500" /> Accurate flood extents</div>
              <div className="flex items-center gap-1"><AlertTriangle className="w-3 h-3 text-amber-500" /> Higher computational cost</div>
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <Button 
            onClick={startAnimation} 
            disabled={isAnimating}
            className="gap-2"
            data-testid="button-animate-flooding"
            aria-label="Animate flooding scenario"
          >
            <Play className="w-4 h-4" />
            {isAnimating ? "Simulating..." : "Animate Flooding Scenario"}
          </Button>
        </div>

        <Separator />

        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div className="p-3 bg-blue-50 rounded-lg">
            <span className="font-medium text-blue-700">SWMM5 Approach:</span>
            <p className="text-muted-foreground mt-1">
              Surface flooding stored as ponded volume at node. No 2D flow routing - water returns to system when capacity available.
            </p>
          </div>
          <div className="p-3 bg-emerald-50 rounded-lg">
            <span className="font-medium text-emerald-700">ICM Approach:</span>
            <p className="text-muted-foreground mt-1">
              Full 2D shallow water equations on triangular mesh. Water flows across terrain following topography.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
