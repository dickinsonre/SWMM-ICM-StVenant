export const SOURCE_CODE_FILES: Record<string, string> = {
  "ClimateInfiltrationDiagrams.tsx": `import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Snowflake, Thermometer, Wind, Sun, CloudRain, Zap } from "lucide-react";

export function SnowmeltAlgorithmsDiagram() {
  const [model, setModel] = useState<"swmm" | "icm">("swmm");
  const [airTemp, setAirTemp] = useState([2]);
  const [windSpeed, setWindSpeed] = useState([3]);
  const [solarRadiation, setSolarRadiation] = useState([150]);
  const [rainfall, setRainfall] = useState([0]);
  const [degreeDay, setDegreeDay] = useState([3]);
  
  const [isAnimating, setIsAnimating] = useState(false);
  const [snowDepth, setSnowDepth] = useState(30);
  const [liquidContent, setLiquidContent] = useState(5);
  const [packTemp, setPackTemp] = useState(-2);
  const [meltRate, setMeltRate] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const calculateSWMMMelt = () => {
    if (airTemp[0] <= 0) return 0;
    const baseMelt = degreeDay[0] * airTemp[0];
    const rainMelt = rainfall[0] > 0 ? rainfall[0] * 0.007 * Math.max(0, airTemp[0]) : 0;
    return baseMelt + rainMelt;
  };

  const calculateICMMelt = () => {
    const shortWave = solarRadiation[0] * 0.8;
    const longWave = (airTemp[0] + 273) ** 4 * 5.67e-8 * 0.97 - 315;
    const convective = 5 * windSpeed[0] * (airTemp[0] - packTemp);
    const latent = windSpeed[0] * 0.5;
    const rainHeat = rainfall[0] * 4.18 * Math.max(0, airTemp[0]);
    const groundHeat = 2;
    
    const netFlux = shortWave + longWave + convective + latent + rainHeat + groundHeat;
    return Math.max(0, netFlux / 334);
  };

  // ... animation logic and rendering
  return (
    <Card className="w-full" data-testid="snowmelt-diagram">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Snowflake className="w-5 h-5 text-blue-400" />
          Snowmelt Algorithms: SWMM5 Degree-Day vs ICM Energy Balance
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Interactive snowmelt visualization */}
      </CardContent>
    </Card>
  );
}

export function InfiltrationShootoutDiagram() {
  const [soilType, setSoilType] = useState<"sand" | "loam" | "clay">("loam");
  const [rainfallIntensity, setRainfallIntensity] = useState([25]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [time, setTime] = useState(0);
  const [infiltrationRates, setInfiltrationRates] = useState<Record<string, number[]>>({});
  
  const soilParams = {
    sand: { f0: 120, fmin: 12, k: 0.15, Ks: 120, psi: 50, CN: 65 },
    loam: { f0: 75, fmin: 8, k: 0.12, Ks: 15, psi: 110, CN: 75 },
    clay: { f0: 40, fmin: 2, k: 0.08, Ks: 3, psi: 320, CN: 85 },
  };

  // Horton infiltration: f(t) = f∞ + (f0 - f∞) * e^(-kt)
  // Green-Ampt: f(t) = Ks * (1 + (psi * theta) / F)
  // CN: Total infiltration based on S = (1000/CN - 10) * 25.4

  return (
    <Card className="w-full" data-testid="infiltration-diagram">
      <CardHeader>
        <CardTitle>
          Infiltration Method Comparison: Horton vs Green-Ampt vs Curve Number
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Interactive infiltration comparison */}
      </CardContent>
    </Card>
  );
}`,

  "SolverDiagrams.tsx": `import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function DiscretizationDiagram() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg">Spatial Discretization</CardTitle>
        <CardDescription>How the solver splits up the network</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* SWMM 5 Approach: Node-Link */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-blue-600">SWMM 5: Node-Link</h4>
          {/* Visualization showing H1 -> Link (Q) -> H2 */}
        </div>

        {/* ICM Approach: Distributed */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-emerald-600">InfoWorks ICM: Distributed</h4>
          {/* Visualization showing multiple H,Q points along conduit */}
        </div>
      </CardContent>
    </Card>
  );
}

export function PreissmannSlotDiagram() {
  const [waterLevel, setWaterLevel] = useState([50]);
  const level = waterLevel[0];
  const pipeHeight = 100;
  const slotHeight = 40;
  const isPressurized = level > pipeHeight;
  const slotFill = isPressurized ? Math.min((level - pipeHeight) / slotHeight * 100, 100) : 0;
  const pipeFill = Math.min(level, pipeHeight);
  const waveSpeed = isPressurized ? (10 + (slotFill / 100) * 50).toFixed(1) : (1 + (level / pipeHeight) * 4).toFixed(1);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg">Interactive Preissmann Slot</CardTitle>
        <CardDescription>Drag the slider to control water level</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Pipe cross-section with slot visualization */}
        {/* Wave speed indicator */}
        <Slider value={waterLevel} onValueChange={setWaterLevel} max={140} step={1} />
      </CardContent>
    </Card>
  );
}

export function WavePropagationDiagram() {
  const [isAnimating, setIsAnimating] = useState(false);
  // Animation showing wave movement through pipe network
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Wave Propagation Comparison</CardTitle>
      </CardHeader>
      <CardContent>
        {/* SWMM vs ICM wave propagation animation */}
      </CardContent>
    </Card>
  );
}

export function DryNetworkDiagram() {
  // Shows how each solver handles initially dry conditions
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Dry Network Handling</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Wetting front progression visualization */}
      </CardContent>
    </Card>
  );
}

export function NodeAreaDiagram() {
  // Illustrates node surface area treatment differences
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Node Surface Area Treatment</CardTitle>
      </CardHeader>
      <CardContent>
        {/* SWMM ponded area vs ICM shaft geometry */}
      </CardContent>
    </Card>
  );
}

export function ManholeVsNodeDiagram() {
  // Shows manhole (SWMM) vs abstract node (ICM)
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Manhole vs Abstract Node</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Physical manhole vs computational node comparison */}
      </CardContent>
    </Card>
  );
}`,

  "ICMSimulationDiagrams.tsx": `import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";
import { Droplets, Grid3X3, Gauge, Timer, TrendingUp, Play, Pause, RotateCcw } from "lucide-react";

export function BaseFlowStabilityDiagram() {
  const [baseFlowFactor, setBaseFlowFactor] = useState([0.001]);
  const [minBaseFlowDepth, setMinBaseFlowDepth] = useState([0.001]);
  const [slope, setSlope] = useState([0.01]);
  const [sedimentDepth, setSedimentDepth] = useState([0.05]);
  
  // y_base = y_sed + MAX(DLMIN, DLFAC × (y_full - y_sed))
  const calculatedBaseFlow = sedimentDepth[0] + Math.max(minBaseFlowDepth[0], baseFlowFactor[0] * (1.0 - sedimentDepth[0]));
  
  return (
    <Card className="p-6 bg-gradient-to-br from-sky-100/80 to-blue-100/80">
      {/* Base flow visualization with SVG pipe cross-section */}
    </Card>
  );
}

export function SpatialDiscretizationDiagram() {
  const [conduitLength, setConduitLength] = useState([100]);
  const [conduitWidth, setConduitWidth] = useState([1.2]);
  const [conduitHeight, setConduitHeight] = useState([1.5]);
  
  // ICM divides conduit into computational nodes
  // numNodes = max(3, round(L / (4 * sqrt(W * H))))
  
  return (
    <Card className="p-6 bg-gradient-to-br from-cyan-100/80 to-teal-100/80">
      {/* Node distribution along conduit visualization */}
    </Card>
  );
}

export function ICMPreissmannSlotDiagram() {
  const [celerityRatio, setCelerityRatio] = useState([0.1]);
  const [waterLevel, setWaterLevel] = useState([0.8]);
  
  // Slot width calculated from target celerity
  // w_slot = g * A / c²
  
  return (
    <Card className="p-6 bg-gradient-to-br from-blue-100/80 to-indigo-100/80">
      {/* Preissmann slot cross-section with pressurization */}
    </Card>
  );
}

export function AdaptiveTimeSteppingDiagram() {
  const [theta, setTheta] = useState([0.7]);
  const [maxIterations, setMaxIterations] = useState([16]);
  
  // Newton-Raphson iteration with timestep halving on failure
  
  return (
    <Card className="p-6 bg-gradient-to-br from-sky-100/80 to-cyan-100/80">
      {/* Convergence visualization with iteration tracking */}
    </Card>
  );
}

export function HeadlossTransitionDiagram() {
  const [depth, setDepth] = useState([0.5]);
  
  // Non-linear headloss factor phases in with depth
  // Prevents high friction at very low depths
  
  return (
    <Card className="p-6 bg-gradient-to-br from-blue-100/80 to-sky-100/80">
      {/* Headloss coefficient vs depth graph */}
    </Card>
  );
}

export function ColdStartInitializationDiagram() {
  const [isRunning, setIsRunning] = useState(false);
  
  // Phase 1: Ramping (θ=1.0, max damping)
  // Phase 2: Steady state search
  // Phase 3: Ready for main simulation
  
  return (
    <Card className="p-6 bg-gradient-to-br from-indigo-100/80 to-blue-100/80">
      {/* Initialization progress visualization */}
    </Card>
  );
}

export function HeadlossJunctionDiagram() {
  const [pipeAngle, setPipeAngle] = useState([90]);
  const [headlossType, setHeadlossType] = useState("normal");
  const [flowRate, setFlowRate] = useState([0.5]);
  
  // Δh = ku × ks × kv × (v²/2g)
  // ku from angle table, ks from surcharge ratio, kv from velocity
  
  return (
    <Card className="p-6 bg-gradient-to-br from-cyan-100/80 to-sky-100/80">
      {/* Junction headloss calculator with angle visualization */}
    </Card>
  );
}

export function HeadlossSurchargeTransitionDiagram() {
  const [headlossType, setHeadlossType] = useState("normal");
  
  // ks coefficient changes with surcharge ratio
  // Normal: peaks near SR=1.0, Fixed: constant at 1.0
  
  return (
    <Card className="p-6 bg-gradient-to-br from-sky-100/80 to-blue-100/80">
      {/* Time-series animation of ks during storm event */}
    </Card>
  );
}

export function HeadlossInferenceDiagram() {
  const [pipes, setPipes] = useState([
    { id: 1, angle: 90, diameter: 0.6, isMajor: true },
    { id: 2, angle: 45, diameter: 0.3, isMajor: false },
  ]);
  
  // ku = ku_major + Σ(proportion × ku_minor)
  // Inference selects widest pipe as major
  
  return (
    <Card className="p-6 bg-gradient-to-br from-blue-100/80 to-cyan-100/80">
      {/* Multi-pipe junction with ku calculation */}
    </Card>
  );
}`,

  "HydrologicDiagrams.tsx": `import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { CloudRain, Droplets, Waves, Beaker } from "lucide-react";

export function RunoffProcessDiagram() {
  const [rainfallIntensity, setRainfallIntensity] = useState([1.0]);
  const [depressionStorage, setDepressionStorage] = useState([0.1]);
  const [maxInfiltration, setMaxInfiltration] = useState([3.0]);
  
  // Runoff = Rainfall - Infiltration - Depression Storage
  // Only occurs after depression storage is filled
  
  return (
    <Card className="border-2 border-sky-500/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CloudRain className="h-5 w-5 text-sky-500" />
          Subcatchment Runoff Process
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Rainfall -> Depression -> Infiltration -> Runoff */}
      </CardContent>
    </Card>
  );
}

export function RTKDiagram() {
  const [r1, setR1] = useState([0.3]);
  const [t1, setT1] = useState([1]);
  const [k1, setK1] = useState([2]);
  
  // RDII = R * Rainfall, delayed by T hours, shaped by K
  // Three triangular unit hydrographs combined
  
  return (
    <Card className="border-2 border-violet-500/30">
      <CardHeader>
        <CardTitle>RDII: RTK Unit Hydrograph Method</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Three overlapping triangular hydrographs */}
      </CardContent>
    </Card>
  );
}

export function BuildupWashoffDiagram() {
  const [landUse, setLandUse] = useState("residential");
  const [antecedentDays, setAntecedentDays] = useState([5]);
  
  // Buildup: Power, Exponential, or Saturation function
  // Washoff: Exponential, Rating Curve, or EMC
  
  return (
    <Card className="border-2 border-amber-500/30">
      <CardHeader>
        <CardTitle>Water Quality: Buildup & Washoff</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Pollutant mass accumulation and washoff curves */}
      </CardContent>
    </Card>
  );
}

export function HydrologicWorkflowDiagram() {
  // Complete workflow from rainfall to pipe network
  // Rainfall -> Subcatchments -> Surface Runoff
  //         -> Groundwater -> RDII
  //         -> Quality -> Pipe Network
  
  return (
    <Card className="border-2 border-emerald-500/30">
      <CardHeader>
        <CardTitle>Complete Hydrologic Workflow</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Flow diagram showing all hydrologic processes */}
      </CardContent>
    </Card>
  );
}`,

  "ArchitecturalDiagrams.tsx": `import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileInput, Calculator, PlayCircle, Activity, Gauge, Droplets, FileOutput } from "lucide-react";

export function InputFileParserDiagram() {
  // SWMM5 .inp file parsing flow
  // [OPTIONS] -> [JUNCTIONS] -> [CONDUITS] -> [XSECTIONS] -> ...
  
  return (
    <Card className="border-2 border-blue-500/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileInput className="h-5 w-5 text-blue-500" />
          Input File Parser (project.c)
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Section-by-section parsing visualization */}
      </CardContent>
    </Card>
  );
}

export function MatrixSolverDiagram() {
  // A * x = b matrix structure
  // Sparse banded matrix from network topology
  
  return (
    <Card className="border-2 border-purple-500/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5 text-purple-500" />
          Sparse Matrix Solver (mathexpr.c)
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Matrix structure and solution process */}
      </CardContent>
    </Card>
  );
}

export function RTCRulesDiagram() {
  // Real-Time Control rule evaluation
  // IF condition THEN action PRIORITY n
  
  return (
    <Card className="border-2 border-violet-500/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PlayCircle className="h-5 w-5 text-violet-500" />
          Real-Time Control Rule Parser & Execution
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Rule evaluation simulation */}
      </CardContent>
    </Card>
  );
}

export function MassRoutingDiagram() {
  // Mass conservation at each node
  // ΣQ_in - ΣQ_out = dV/dt
  
  return (
    <Card className="border-2 border-cyan-500/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-cyan-500" />
          Mass Routing & Conservation Check
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Node mass balance visualization */}
      </CardContent>
    </Card>
  );
}

export function SurchargeCodeDiagram() {
  // SWMM vs ICM surcharge handling comparison
  
  return (
    <Card className="border-2 border-orange-500/30">
      <CardHeader>
        <CardTitle>Surcharge Algorithm Comparison</CardTitle>
      </CardHeader>
      <CardContent>
        {/* SWMM cap vs ICM Preissmann slot */}
      </CardContent>
    </Card>
  );
}

export function GroundwaterExchangeDiagram() {
  // GW <-> Surface water interaction
  
  return (
    <Card className="border-2 border-teal-500/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Droplets className="h-5 w-5 text-teal-500" />
          Groundwater Exchange Module
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Aquifer-conduit exchange visualization */}
      </CardContent>
    </Card>
  );
}

export function MinorLossesDiagram() {
  // K-factor based head losses at junctions
  
  return (
    <Card className="border-2 border-amber-500/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gauge className="h-5 w-5 text-amber-500" />
          Minor Loss Coefficients (K-factors)
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Junction geometry and K-factor lookup */}
      </CardContent>
    </Card>
  );
}

export function ReportingSystemDiagram() {
  // Binary output + text report generation
  
  return (
    <Card className="border-2 border-slate-500/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileOutput className="h-5 w-5 text-slate-500" />
          Output & Reporting System
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* .out binary + .rpt text generation */}
      </CardContent>
    </Card>
  );
}`,

  "GreenInfraDiagrams.tsx": `import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Leaf, Droplets, Layers } from "lucide-react";

export function LIDvsSUDSDiagram() {
  const [activeTab, setActiveTab] = useState<"swmm" | "icm">("swmm");
  
  // SWMM5 LID Controls:
  // - Bio-retention, Rain Garden, Green Roof, Infiltration Trench
  // - Permeable Pavement, Rain Barrel, Vegetative Swale
  
  // ICM SUDS:
  // - Similar concepts with different parameterization
  // - Integrated with 2D surface routing
  
  return (
    <Card className="border-2 border-green-500/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Leaf className="h-5 w-5 text-green-500" />
          LID Controls (SWMM5) vs SUDS (ICM)
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Side-by-side LID/SUDS comparison */}
      </CardContent>
    </Card>
  );
}

export function DualSolverArchitectureDiagram() {
  // ICM's unique 1D-2D coupling approach
  // 1D: Pipe network (Saint-Venant)
  // 2D: Surface mesh (Shallow Water Equations)
  // Exchange: Manhole overflows, inlet capture
  
  return (
    <Card className="border-2 border-purple-500/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Layers className="h-5 w-5 text-purple-500" />
          ICM Dual-Solver Architecture (1D-2D Coupling)
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* 3D visualization of 1D network + 2D surface mesh */}
      </CardContent>
    </Card>
  );
}`,

  "SolverOptionsDiagrams.tsx": `import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Gauge, Timer, Waves } from "lucide-react";

export function CFLStabilityDiagram() {
  const [velocity, setVelocity] = useState([2]);
  const [dx, setDx] = useState([50]);
  const [dt, setDt] = useState([5]);
  
  // CFL = (v + c) * dt / dx
  // Must be < 1 for explicit schemes
  // SWMM uses implicit, so CFL > 1 is possible but can cause oscillations
  
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>CFL Stability Condition</CardTitle>
      </CardHeader>
      <CardContent>
        {/* CFL number calculator and stability region */}
      </CardContent>
    </Card>
  );
}

export function SurchargeMethodDiagram() {
  // EXTRAN vs Slot vs Dynamic Wave
  // Head capping vs Preissmann slot
  
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Surcharge Method Options</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Method comparison visualization */}
      </CardContent>
    </Card>
  );
}

export function RoutingMethodFlowchart() {
  // Steady Flow -> Kinematic Wave -> Dynamic Wave
  // Complexity vs Accuracy trade-off
  
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Routing Method Selection</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Decision flowchart */}
      </CardContent>
    </Card>
  );
}

export function AdaptiveTimestepDiagram() {
  const [cflTarget, setCflTarget] = useState([0.75]);
  
  // dt_new = dt * (CFL_target / CFL_actual)
  // Bounded by min/max timestep
  
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Adaptive Timestep Control</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Timestep adjustment visualization */}
      </CardContent>
    </Card>
  );
}

export function ThetaParameterDiagram() {
  const [theta, setTheta] = useState([0.5]);
  
  // θ=0: Fully explicit (unstable for large dt)
  // θ=0.5: Crank-Nicolson (2nd order accurate)
  // θ=1: Fully implicit (1st order, most stable)
  
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Time Weighting (θ) Parameter</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Stability vs accuracy trade-off */}
      </CardContent>
    </Card>
  );
}

export function Coupling1D2DDiagram() {
  // Surface-subsurface exchange
  // Overland flow capture at inlets
  
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>1D-2D Surface-Subsurface Coupling</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Exchange mechanism visualization */}
      </CardContent>
    </Card>
  );
}`,

  "AdvancedDiagrams.tsx": `import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Activity, AlertTriangle, TrendingUp, Waves, Timer, GitBranch } from "lucide-react";

export function ConvergenceSnapshotsDiagram() {
  // Newton-Raphson iteration convergence
  // Residual reduction over iterations
  
  return (
    <Card className="border-2 border-blue-500/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-blue-500" />
          Convergence Snapshots
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Iteration-by-iteration residual plot */}
      </CardContent>
    </Card>
  );
}

export function MassBalanceErrorDiagram() {
  // Continuity error tracking
  // Storage change vs net inflow
  
  return (
    <Card className="border-2 border-red-500/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-red-500" />
          Mass Balance Error Tracking
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Running continuity error plot */}
      </CardContent>
    </Card>
  );
}

export function OscillationChallengeDiagram() {
  // Numerical oscillations at sharp gradients
  // SWMM vs ICM damping approaches
  
  return (
    <Card className="border-2 border-amber-500/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-amber-500" />
          Oscillation Challenge
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Oscillating vs damped solution comparison */}
      </CardContent>
    </Card>
  );
}

export function WettingFrontDiagram() {
  // Wave front propagation in initially dry network
  
  return (
    <Card className="border-2 border-cyan-500/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Waves className="h-5 w-5 text-cyan-500" />
          Wetting Front Propagation
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Animated wave front moving through network */}
      </CardContent>
    </Card>
  );
}

export function TimestepDashboardDiagram() {
  // Real-time timestep monitoring
  // CFL, iterations, halving events
  
  return (
    <Card className="border-2 border-violet-500/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Timer className="h-5 w-5 text-violet-500" />
          Timestep Dashboard
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Live timestep metrics */}
      </CardContent>
    </Card>
  );
}

export function SolverDecisionTreeDiagram() {
  // When to use which solver/options
  
  return (
    <Card className="border-2 border-green-500/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GitBranch className="h-5 w-5 text-green-500" />
          Solver Selection Decision Tree
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Interactive decision flowchart */}
      </CardContent>
    </Card>
  );
}`,

  "TimestepComparisonDiagram.tsx": `import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Timer, Play, Pause, RotateCcw } from "lucide-react";

export function TimestepComparisonDiagram() {
  const [swmmTimestep, setSwmmTimestep] = useState([30]); // seconds
  const [icmTimestep, setIcmTimestep] = useState([1]); // seconds
  const [isRunning, setIsRunning] = useState(false);
  const [simulationTime, setSimulationTime] = useState(0);
  
  // SWMM: Fixed timestep (user-defined, typically 5-60 seconds)
  // ICM: Adaptive timestep (adjusts based on CFL condition)
  
  // Animation showing how each solver progresses through time
  // SWMM takes large uniform steps
  // ICM takes variable steps, smaller during rapid changes
  
  return (
    <Card className="border-2 border-indigo-500/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Timer className="h-5 w-5 text-indigo-500" />
          Timestep Strategy Comparison
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Timeline visualization showing:
            - SWMM's fixed timestep progression
            - ICM's adaptive timestep progression
            - CFL number indicators
            - Convergence status */}
        <div className="flex gap-2">
          <Button onClick={() => setIsRunning(!isRunning)}>
            {isRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          <Button variant="outline" onClick={() => setSimulationTime(0)}>
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}`,

  "comparison-data.ts": `// Knowledge base containing structured comparison data
// between EPA SWMM 5 and InfoWorks ICM solvers

export interface TopicComparison {
  title: string;
  summary: string;
  topics: Record<string, string[]>;
}

export const KB: { swmm5: TopicComparison; icm: TopicComparison } = {
  swmm5: {
    title: "EPA SWMM 5",
    summary: "Open-source stormwater management model using node-link discretization",
    topics: {
      governing_equations: [
        "Solves 1D Saint-Venant equations (continuity + momentum)",
        "Dynamic Wave routing for full unsteady flow",
        "Kinematic Wave option for simplified routing",
        // ... more comparison points
      ],
      discretisation_unknowns: [
        "Node-link discretization: H at nodes, Q in conduits",
        "Single unknown per element",
        "Implicit finite difference scheme",
      ],
      // ... additional topics
    },
  },
  icm: {
    title: "InfoWorks ICM",
    summary: "Commercial integrated catchment model with distributed discretization",
    topics: {
      governing_equations: [
        "Full Saint-Venant equations with all terms",
        "Includes lateral inflows and wind stress",
        "2D shallow water equations for surface flow",
      ],
      discretisation_unknowns: [
        "Distributed discretization along conduits",
        "Multiple H,Q points per conduit",
        "Automatic node spacing based on conduit geometry",
      ],
      // ... additional topics
    },
  },
};

export const TOPIC_ORDER: { key: string; title: string }[] = [
  { key: "governing_equations", title: "Governing Equations" },
  { key: "discretisation_unknowns", title: "Discretization & Unknowns" },
  { key: "node_surface_area", title: "Node Surface Area Treatment" },
  { key: "time_integration", title: "Time Integration Scheme" },
  { key: "nonlinear_solver", title: "Nonlinear Solver" },
  { key: "time_step_control", title: "Timestep Control" },
  { key: "pressurisation_surcharge", title: "Pressurization & Surcharge" },
  { key: "inertia_supercritical_handling", title: "Inertia & Supercritical Flow" },
  { key: "stability_devices", title: "Stability Devices" },
  { key: "conduit_models", title: "Conduit Models" },
  { key: "dry_network_handling", title: "Dry Network Handling" },
  { key: "stability_robustness", title: "Stability & Robustness" },
  { key: "practical_implications", title: "Practical Implications" },
];`,

  "TemporalDynamicsDiagrams.tsx": `import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Clock, Waves, Ruler, Droplets, Play, Pause, RotateCcw, AlertTriangle, CheckCircle, XCircle, Zap } from "lucide-react";

// 4 Interactive Diagrams for Temporal Dynamics & Solver Stability:
// 1. WaveTravelVsTimestepDiagram - CFL condition visualization
// 2. AdaptiveTimestepSimulatorDiagram - SWMM5 fixed vs ICM adaptive stepping
// 3. ConduitLengtheningCheatCodeDiagram - Virtual pipe stretcher detail view
// 4. DryStartVsBaseFlowDiagram - Startup stability comparison

export function WaveTravelVsTimestepDiagram() {
  // Shows a pipe with wave propagation
  // Compares SWMM5 node-link (wave crosses entire pipe) vs ICM distributed (segments)
  // Demonstrates physics violation when Δt >> wave travel time
}

export function AdaptiveTimestepSimulatorDiagram() {
  // Three modes: SWMM5 Fixed (30s), SWMM5 Fixed (900s - crashes), ICM Adaptive
  // Shows timestep and convergence error graphs during a storm
  // ICM's halving algorithm provides stability "safety net"
}

export function ConduitLengtheningCheatCodeDiagram() {
  // Side-by-side real vs lengthened pipe
  // Shows L_virtual = c × Δt_lengthening calculation
  // Explains why Summary Reports show >1000% pipe lengths
}

export function DryStartVsBaseFlowDiagram() {
  // Tank with valve opening at t=0
  // SWMM5 dry start: oscillations before settling
  // ICM base flow: smooth transition
  // Flow response graph shows the difference
}`,

  "OperationalControlsDiagrams.tsx": `import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Settings2, Workflow, Timer, ToggleLeft, Activity, Play, Pause, RotateCcw, Zap, ArrowRight, Check, X } from "lucide-react";

// 3 Interactive Diagrams for Operational Controls:
// 1. ControlLogicBuilderDiagram - ICM component-based vs SWMM5 script
// 2. ExecutionTimelineDiagram - Single timestep execution
// 3. ControllerTypesDiagram - On/Off vs PID vs Incremental

export function ControlLogicBuilderDiagram() {
  // Side-by-side: ICM RTC component architecture vs SWMM5 text rules
  // Shows draggable components (Regulator, Range, PID, Rule) on left
  // Shows equivalent IF-THEN script on right
  // Highlights architectural vs procedural paradigm
}

export function ExecutionTimelineDiagram() {
  // Timeline showing one major timestep t=1000s
  // ICM: Parallel evaluation (Sense all ranges -> Process logic/PID -> Act on all)
  // SWMM5: Sequential rule firing (R1 -> R2 -> R3... with PRIORITY)
  // Animated step-by-step execution
}

export function ControllerTypesDiagram() {
  // Three modes: Simple On/Off, PID Controller, Incremental (ICM only)
  // Tank level vs time graph with setpoint line
  // Pump setting vs time graph showing control response
  // Adjustable P, I, D gains for PID mode
  // Shows oscillation (on/off) vs smooth tracking (PID) vs stepped (INC)
}`,

  "DynamicWaveOptionsDiagrams.tsx": `import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Zap, Waves, Gauge, Timer, Ruler, Box, Target, Cpu, Play, Pause, RotateCcw, AlertTriangle, CheckCircle } from "lucide-react";

// 8 Interactive Diagrams for SWMM5 Dynamic Wave Options:
// 1. InertialTermsDiagram - KEEP/DAMPEN/IGNORE momentum equation tuner
// 2. NormalFlowCriterionDiagram - Slope & Froude flow regime limiter
// 3. SurchargeMethodDeepDiveDiagram - EXTRAN vs Preissmann Slot algorithms
// 4. VariableTimestepDiagram - CFL condition governor with Courant display
// 5. ConduitLengtheningDiagram - Virtual pipe stretcher for short pipes
// 6. MinNodalSurfaceAreaDiagram - Junction "bathtub" storage parameter
// 7. ConvergenceTolerancesDiagram - Iterative solver tolerance visualizer
// 8. ParallelThreadsDiagram - Multi-core workload dispatcher

export function InertialTermsDiagram() {
  // KEEP: Full inertia - accurate but can oscillate
  // DAMPEN: Reduces inertia near critical flow - default/recommended
  // IGNORE: Diffusion wave approximation - very stable but less accurate
  const [inertiaMode, setInertiaMode] = useState("dampen");
  // Animated wave showing effect of each mode on flow response
}

export function NormalFlowCriterionDiagram() {
  // Criterion options: Slope, Froude, Both, None
  // Shows pipe profile with real-time Fr and S_w calculation
  // Demonstrates when normal flow limit is applied to cap supercritical flow
}

export function SurchargeMethodDeepDiveDiagram() {
  // EXTRAN: dH/dt = (ΣQ_in - ΣQ_out) / (dΣQ/dH) - derivative-based
  // SLOT: dH/dt = (ΣQ_in - ΣQ_out) / A_slot - continuity-based
  // Visual comparison of algorithms with animated junction
}

export function VariableTimestepDiagram() {
  // Shows Courant number for each pipe
  // Displays variable timestep history vs fixed routing step
  // Demonstrates CFL stability with color-coded indicators
}

export function ConduitLengtheningDiagram() {
  // L_virtual = c × Δt_lengthening
  // Shows original vs lengthened pipe when wave travel < timestep
  // Displays lengthening ratio percentage
}

export function MinNodalSurfaceAreaDiagram() {
  // dH/dt = Q_in / A_surface
  // Animated junction filling with adjustable surface area
  // Shows how larger area dampens water level oscillations
}

export function ConvergenceTolerancesDiagram() {
  // Simulated iterative solver with error gauge
  // Shows convergence vs max trials reached scenarios
}

export function ParallelThreadsDiagram() {
  // Task distribution across multiple threads
  // Shows diminishing returns with thread overhead
}`,

  "InletDiagrams.tsx": `import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Droplets, ArrowDown, ArrowUp, Gauge, Waves, Grid3X3 } from "lucide-react";

export function InletElementDiagram() {
  const [surfaceDepth, setSurfaceDepth] = useState([0.15]);
  const [sewerHead, setSewerHead] = useState([0.5]);
  const [inletCapacity, setInletCapacity] = useState([50]);
  
  // ICM conceptually splits a manhole into:
  // - Above-ground (flooding) element
  // - Below-ground (sewer) element
  // Linked by an inlet with defined capacity
  
  const flowDirection = sewerHead[0] > surfaceDepth[0] * 3 ? "outflow" : "inflow";
  
  return (
    <Card className="w-full" data-testid="inlet-element-diagram">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Grid3X3 className="w-5 h-5 text-blue-500" />
          The Inlet Element: Surface-to-Sewer Connection
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* SVG visualization of manhole split into surface/sewer elements */}
        {/* Animated water flow based on inflow/outflow mode */}
      </CardContent>
    </Card>
  );
}

export function HEC22InletCalculatorDiagram() {
  const [inletType, setInletType] = useState<"curb" | "grate" | "combination">("grate");
  const [gutterFlow, setGutterFlow] = useState([0.1]);
  const [longitudinalSlope, setLongitudinalSlope] = useState([0.02]);
  
  // HEC-22 Efficiency Equations:
  // Grate: E = Rf × Rs (frontal flow ratio × side flow ratio)
  // Curb: E = 1 - (1 - L/Lt)^1.8 (length ratio)
  // Combination: Weighted blend of both methods
  
  // Manning's equation for spread width:
  // T = ((Q × n) / (0.376 × Sx^1.67 × S^0.5))^0.375
  
  return (
    <Card className="w-full" data-testid="hec22-inlet-calculator">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gauge className="w-5 h-5 text-emerald-500" />
          HEC-22 Inlet Efficiency Calculator
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Interactive calculator with sliders for flow, slope, inlet length */}
        {/* Real-time efficiency, captured flow, and bypass calculations */}
      </CardContent>
    </Card>
  );
}

export function FlowTransitionDiagram() {
  const [scenario, setScenario] = useState<"inflow" | "outflow">("inflow");
  
  // Limit of Inflow: Street flooding occurs when rainfall exceeds 
  //                  inlet capture capacity. Sewer has room.
  
  // Limit of Outflow: Sewer surcharge causes water to back up 
  //                   through inlets to the surface.
  
  return (
    <Card className="w-full" data-testid="flow-transition-diagram">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Waves className="w-5 h-5 text-cyan-500" />
          Flow Transition Scenarios: Inflow vs Outflow
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Animated simulation of storm event */}
        {/* Toggle between inflow-limited and outflow-limited scenarios */}
      </CardContent>
    </Card>
  );
}

export function InletEfficiencyCurvesDiagram() {
  const [selectedType, setSelectedType] = useState<"curb" | "grate" | "sag">("grate");
  
  // Efficiency curves show:
  // - Grate: Decreases with velocity (splash-over)
  // - Curb: Less velocity-dependent, length-driven
  // - Sag: Weir-to-orifice transition at ~12cm depth
  
  return (
    <Card className="w-full" data-testid="inlet-efficiency-curves">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Droplets className="w-5 h-5 text-violet-500" />
          Inlet Efficiency Curves
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* SVG chart showing efficiency vs velocity/depth */}
        {/* Multiple curves for different inlet lengths */}
      </CardContent>
    </Card>
  );
}`,

  "comparison_tool.py": `#!/usr/bin/env python3
"""
SWMM5 vs ICM Comparison Tool
CLI utility for generating comparison reports

Usage:
    python comparison_tool.py --format markdown --output comparison.md
    python comparison_tool.py --format json --output comparison.json
"""

import argparse
import json
from typing import Dict, List

# Knowledge base structure matching TypeScript version
KB = {
    "swmm5": {
        "title": "EPA SWMM 5",
        "summary": "Open-source stormwater management model",
        "topics": {
            "governing_equations": [
                "Solves 1D Saint-Venant equations",
                "Dynamic Wave routing for full unsteady flow",
            ],
            # ... additional topics
        },
    },
    "icm": {
        "title": "InfoWorks ICM",
        "summary": "Commercial integrated catchment model",
        "topics": {
            "governing_equations": [
                "Full Saint-Venant equations with all terms",
                "2D shallow water equations for surface flow",
            ],
            # ... additional topics
        },
    },
}

def export_markdown(kb: Dict) -> str:
    """Generate Markdown comparison document."""
    lines = ["# SWMM5 vs ICM Comparison\\n"]
    for topic_key, topic_data in kb["swmm5"]["topics"].items():
        lines.append(f"## {topic_key.replace('_', ' ').title()}\\n")
        lines.append("### SWMM5")
        for point in topic_data:
            lines.append(f"- {point}")
        lines.append("\\n### ICM")
        for point in kb["icm"]["topics"].get(topic_key, []):
            lines.append(f"- {point}")
        lines.append("")
    return "\\n".join(lines)

def export_json(kb: Dict) -> str:
    """Export knowledge base as JSON."""
    return json.dumps(kb, indent=2)

def main():
    parser = argparse.ArgumentParser(description="SWMM5 vs ICM Comparison Tool")
    parser.add_argument("--format", choices=["markdown", "json"], default="markdown")
    parser.add_argument("--output", "-o", help="Output file path")
    args = parser.parse_args()
    
    if args.format == "markdown":
        content = export_markdown(KB)
    else:
        content = export_json(KB)
    
    if args.output:
        with open(args.output, "w") as f:
            f.write(content)
        print(f"Written to {args.output}")
    else:
        print(content)

if __name__ == "__main__":
    main()`,
};

export const FILE_PATHS: Record<string, string> = {
  "SolverDiagrams.tsx": "client/src/components/visuals/SolverDiagrams.tsx",
  "SolverOptionsDiagrams.tsx": "client/src/components/visuals/SolverOptionsDiagrams.tsx",
  "DynamicWaveOptionsDiagrams.tsx": "client/src/components/visuals/DynamicWaveOptionsDiagrams.tsx",
  "TemporalDynamicsDiagrams.tsx": "client/src/components/visuals/TemporalDynamicsDiagrams.tsx",
  "OperationalControlsDiagrams.tsx": "client/src/components/visuals/OperationalControlsDiagrams.tsx",
  "AdvancedDiagrams.tsx": "client/src/components/visuals/AdvancedDiagrams.tsx",
  "TimestepComparisonDiagram.tsx": "client/src/components/visuals/TimestepComparisonDiagram.tsx",
  "HydrologicDiagrams.tsx": "client/src/components/visuals/HydrologicDiagrams.tsx",
  "ClimateInfiltrationDiagrams.tsx": "client/src/components/visuals/ClimateInfiltrationDiagrams.tsx",
  "GreenInfraDiagrams.tsx": "client/src/components/visuals/GreenInfraDiagrams.tsx",
  "ArchitecturalDiagrams.tsx": "client/src/components/visuals/ArchitecturalDiagrams.tsx",
  "ICMSimulationDiagrams.tsx": "client/src/components/visuals/ICMSimulationDiagrams.tsx",
  "InletDiagrams.tsx": "client/src/components/visuals/InletDiagrams.tsx",
  "comparison-data.ts": "client/src/data/comparison-data.ts",
  "comparison_tool.py": "client/public/comparison_tool.py",
};
