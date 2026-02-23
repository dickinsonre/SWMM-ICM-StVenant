import { useState } from "react";
import { 
  Activity, 
  BookOpen, 
  Info, 
  ExternalLink,
  Table as TableIcon,
  LayoutGrid,
  Download,
  FileCode,
  HelpCircle,
  BarChart2,
  Cpu,
  Settings,
  Droplet,
  Cloud,
  Leaf,
  Code,
  ChevronRight,
  Gauge,
  Grid3X3,
  Zap,
  Clock,
  Workflow,
  Moon,
  Sun,
  Landmark
} from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { KB, TOPIC_ORDER } from "@/data/comparison-data";
import { SOURCE_CODE_FILES, FILE_PATHS } from "@/data/source-code-snippets";
import { DiscretizationDiagram, PreissmannSlotDiagram, WavePropagationDiagram, DryNetworkDiagram, NodeAreaDiagram, ManholeVsNodeDiagram } from "@/components/visuals/SolverDiagrams";
import { CFLStabilityDiagram, SurchargeMethodDiagram, RoutingMethodFlowchart, AdaptiveTimestepDiagram, ThetaParameterDiagram, Coupling1D2DDiagram } from "@/components/visuals/SolverOptionsDiagrams";
import { ConvergenceSnapshotsDiagram, MassBalanceErrorDiagram, OscillationChallengeDiagram, WettingFrontDiagram, TimestepDashboardDiagram, SolverDecisionTreeDiagram } from "@/components/visuals/AdvancedDiagrams";
import { RunoffProcessDiagram, RTKDiagram, BuildupWashoffDiagram, HydrologicWorkflowDiagram } from "@/components/visuals/HydrologicDiagrams";
import { TimestepComparisonDiagram } from "@/components/visuals/TimestepComparisonDiagram";
import { SnowmeltAlgorithmsDiagram, InfiltrationShootoutDiagram } from "@/components/visuals/ClimateInfiltrationDiagrams";
import { LIDvsSUDSDiagram, DualSolverArchitectureDiagram } from "@/components/visuals/GreenInfraDiagrams";
import { InputFileParserDiagram, MatrixSolverDiagram, RTCRulesDiagram, MassRoutingDiagram, SurchargeCodeDiagram, GroundwaterExchangeDiagram, MinorLossesDiagram, ReportingSystemDiagram } from "@/components/visuals/ArchitecturalDiagrams";
import { BaseFlowStabilityDiagram, SpatialDiscretizationDiagram, ICMPreissmannSlotDiagram, AdaptiveTimeSteppingDiagram, HeadlossTransitionDiagram, ColdStartInitializationDiagram, HeadlossJunctionDiagram, HeadlossSurchargeTransitionDiagram, HeadlossInferenceDiagram, InfoSewerSteadyStateEmulationDiagram } from "@/components/visuals/ICMSimulationDiagrams";
import { InletElementDiagram, HEC22InletCalculatorDiagram, FlowTransitionDiagram, InletEfficiencyCurvesDiagram } from "@/components/visuals/InletDiagrams";
import { InertialTermsDiagram, NormalFlowCriterionDiagram, SurchargeMethodDeepDiveDiagram, VariableTimestepDiagram, ConduitLengtheningDiagram, MinNodalSurfaceAreaDiagram, ConvergenceTolerancesDiagram, ParallelThreadsDiagram } from "@/components/visuals/DynamicWaveOptionsDiagrams";
import { WaveTravelVsTimestepDiagram, AdaptiveTimestepSimulatorDiagram, ConduitLengtheningCheatCodeDiagram, DryStartVsBaseFlowDiagram } from "@/components/visuals/TemporalDynamicsDiagrams";
import { ControlLogicBuilderDiagram, ExecutionTimelineDiagram, ControllerTypesDiagram } from "@/components/visuals/OperationalControlsDiagrams";
import { DecisionEngineDiagram } from "@/components/visuals/DecisionEngineDiagram";
import { 
  CFLStabilityCalculator, 
  PreissmannSlotCalculator, 
  ManningsFlowCalculator, 
  TimeStepEfficiencyEstimator,
  FroudeNumberDiagram as FroudeNumberCalculator,
  ComputationalPointsDiagram,
  InertialTermsDiagram as InertialTermsCalculator,
  SurchargeAlgorithmDiagram,
  SurfaceFloodingDiagram
} from "@/components/visuals/CalculatorDiagrams";
import { 
  ICMSWMMEngineComparison, 
  LiveNetworkComparison, 
  ForceMainComparison, 
  ConduitLengthSensitivity, 
  CommonPitfalls,
  CompanionToolsFooter,
  VersionTracker
} from "@/components/visuals/ReviewDiagrams";
import { ICMManholeSimulator } from "@/components/visuals/ICMManholeSimulator";
import { BackwaterPropagation, OneDTwoDCoupling, ManholeStorageVolume, FloodTypeComparison } from "@/components/visuals/NodeAnimations";
import { RomanAqueductAnimation, DujiangyanAnimation, IncaFountainAnimation, PersianQanatAnimation } from "@/components/visuals/HistoricalAnimations";
import { IndianStepwellAnimation, AztecDikeAnimation, DutchPolderAnimation, RomanSiphonAnimation } from "@/components/visuals/HistoricalAnimations2";
import { MayaFiltrationAnimation, KhmerBarayAnimation, CloacaMaximaAnimation, IndusValleyDrainAnimation, ArchimedesScrewAnimation } from "@/components/visuals/HistoricalAnimations3";
import heroImage from "@assets/generated_images/abstract_fluid_dynamics_network_blueprint.png";

const TOPIC_DIAGRAM_MAP: Record<string, { category: string; label: string }[]> = {
  governing_equations: [{ category: "solver", label: "Wave Propagation" }],
  discretisation_unknowns: [{ category: "solver", label: "Discretization" }, { category: "icm", label: "Spatial Discretization" }],
  node_surface_area: [{ category: "solver", label: "Node Area" }, { category: "solver", label: "Manhole vs Node" }],
  time_integration: [{ category: "options", label: "Theta Parameter" }],
  nonlinear_solver: [{ category: "architecture", label: "Matrix Solver" }, { category: "icm", label: "Adaptive Time Stepping" }],
  time_step_control: [{ category: "options", label: "Adaptive Timestep" }, { category: "options", label: "CFL Stability" }, { category: "advanced", label: "Timestep Dashboard" }],
  pressurisation_surcharge: [{ category: "solver", label: "Preissmann Slot" }, { category: "icm", label: "ICM Preissmann Slot" }, { category: "options", label: "Surcharge Method" }],
  inertia_supercritical_handling: [{ category: "solver", label: "Wave Propagation" }],
  stability_devices: [{ category: "icm", label: "Base Flow Stability" }, { category: "icm", label: "Headloss Transition" }],
  conduit_models: [{ category: "options", label: "Routing Flowchart" }],
  dry_network_handling: [{ category: "solver", label: "Dry Network" }, { category: "advanced", label: "Wetting Front" }, { category: "icm", label: "Cold Start" }],
  stability_robustness: [{ category: "advanced", label: "Convergence Snapshots" }, { category: "advanced", label: "Mass Balance Error" }, { category: "advanced", label: "Oscillation Challenge" }],
  practical_implications: [{ category: "advanced", label: "Timestep Dashboard" }, { category: "advanced", label: "Solver Decision Tree" }],
};

const DIAGRAM_CATEGORIES = [
  { id: "solver", label: "Solver Mechanics", icon: "cpu", count: 13 },
  { id: "options", label: "Solver Options", icon: "settings", count: 6 },
  { id: "dynwave", label: "Dynamic Wave Options", icon: "zap", count: 10 },
  { id: "temporal", label: "Temporal Dynamics", icon: "clock", count: 6 },
  { id: "controls", label: "Operational Controls", icon: "workflow", count: 3 },
  { id: "advanced", label: "Advanced Analysis", icon: "chart", count: 10 },
  { id: "hydrologic", label: "Hydrologic", icon: "droplet", count: 4 },
  { id: "climate", label: "Climate & Infiltration", icon: "cloud", count: 2 },
  { id: "icm", label: "ICM Simulation", icon: "gauge", count: 17 },
  { id: "inlets", label: "Surface-to-Sewer", icon: "grid", count: 4 },
  { id: "green", label: "Green Infrastructure", icon: "leaf", count: 2 },
  { id: "architecture", label: "Code Architecture", icon: "code", count: 5 },
  { id: "historical", label: "Historical Engineering", icon: "landmark", count: 13 },
];

export default function Dashboard() {
  const { theme, toggleTheme } = useTheme();
  const [activeView, setActiveView] = useState<"visuals" | "topic" | "table" | "source">("visuals");
  const [activeCategory, setActiveCategory] = useState("solver");
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  const handleExport = (format: "json" | "md") => {
    let content = "";
    let filename = "";
    let type = "";

    if (format === "json") {
      content = JSON.stringify(KB, null, 2);
      filename = "comparison.json";
      type = "application/json";
    } else {
      // Markdown generation matching the Python script's logic
      const now = new Date().toISOString().replace('T', ' ').substring(0, 16) + ' UTC';
      const lines = [
        "# SWMM5 vs InfoWorks ICM — Saint‑Venant Solver Comparison",
        "",
        `_Generated: ${now}_`,
        "",
        "## High-level summary",
        "",
        `**SWMM 5:** ${KB.swmm5.tagline}`,
        "",
        `**InfoWorks ICM:** ${KB.icm.tagline}`,
        "",
        "## Detailed comparison by topic",
        ""
      ];

      TOPIC_ORDER.forEach(topic => {
        lines.push(`### ${topic.label}`);
        lines.push("");
        lines.push("**SWMM 5**");
        (KB.swmm5.topics as any)[topic.key].forEach((b: string) => lines.push(`- ${b}`));
        lines.push("");
        lines.push("**InfoWorks ICM**");
        (KB.icm.topics as any)[topic.key].forEach((b: string) => lines.push(`- ${b}`));
        lines.push("");
      });

      lines.push("## Sources");
      lines.push("");
      
      (["swmm5", "icm"] as const).forEach(key => {
        lines.push(`### ${KB[key].product}`);
        KB[key].sources.forEach(s => {
          lines.push(`- ${s.label} — ${s.url}`);
          if (s.notes) lines.push(`  - Notes: ${s.notes}`);
        });
        lines.push("");
      });

      content = lines.join("\n");
      filename = "comparison.md";
      type = "text/markdown";
    }

    // Create download link
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur sticky top-0 z-20">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 bg-primary/10 rounded-lg flex items-center justify-center text-primary ring-1 ring-primary/20">
              <Activity className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight leading-none">SWMM5 vs ICM InfoWorks Networks</h1>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-wider">Hydraulic Solver Comparison</p>
                <Badge variant="destructive" className="text-sm px-2 py-0.5 font-bold" data-testid="badge-diagram-count">95 Interactive Diagrams</Badge>
              </div>
            </div>
            
            <Separator orientation="vertical" className="h-6 mx-3 hidden md:block" />
            
            <Tabs value={activeView} onValueChange={(v) => setActiveView(v as any)} className="w-[400px] hidden md:block">
              <TabsList className="grid w-full grid-cols-4 h-9">
                <TabsTrigger value="visuals" className="text-xs">
                  <BarChart2 className="h-3.5 w-3.5 mr-1" />
                  Visuals
                </TabsTrigger>
                <TabsTrigger value="topic" className="text-xs">
                  <LayoutGrid className="h-3.5 w-3.5 mr-1" />
                  Topic
                </TabsTrigger>
                <TabsTrigger value="table" className="text-xs">
                  <TableIcon className="h-3.5 w-3.5 mr-1" />
                  Table
                </TabsTrigger>
                <TabsTrigger value="source" className="text-xs" data-testid="tab-source">
                  <FileCode className="h-3.5 w-3.5 mr-1" />
                  Source
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="hidden md:flex gap-2"
              onClick={() => handleExport("json")}
              title="Download comparison data as JSON file"
            >
              <Download className="h-3.5 w-3.5" />
              <span>JSON</span>
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="hidden md:flex gap-2"
              onClick={() => handleExport("md")}
              title="Download comparison data as Markdown document"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Markdown</span>
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              data-testid="button-theme-toggle"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            
            <Separator orientation="vertical" className="h-6 mx-2 hidden md:block" />
            
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                   <HelpCircle className="h-5 w-5" />
                </Button>
              </DialogTrigger>
              <DialogTrigger asChild>
                 <Button variant="ghost" size="sm" className="hidden md:flex gap-2">
                   <HelpCircle className="h-4 w-4" />
                   <span>About</span>
                 </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>About this Tool</DialogTitle>
                  <DialogDescription className="pt-4 space-y-4">
                    <p>
                      This is an educational, self-contained comparison tool intended for hydraulic modelers.
                    </p>
                    <div className="space-y-2">
                      <p className="font-medium text-foreground">What it does:</p>
                      <ul className="list-disc pl-5 text-sm space-y-1">
                        <li>Presents a structured compare/contrast of how EPA SWMM 5 and InfoWorks ICM solve the 1D Saint-Venant equations for unsteady flow.</li>
                        <li>Lets you browse by topic, view a side-by-side summary table, and export the content to Markdown or JSON.</li>
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <p className="font-medium text-foreground">It does NOT:</p>
                      <ul className="list-disc pl-5 text-sm space-y-1">
                        <li>Run SWMM or InfoWorks ICM</li>
                        <li>Read SWMM/ICM model files</li>
                        <li>Provide engineering sign-off</li>
                      </ul>
                    </div>
                    <div className="space-y-2 pt-2 border-t">
                      <p className="font-medium text-foreground">Export Options:</p>
                      <ul className="list-disc pl-5 text-sm space-y-1">
                        <li><strong>JSON:</strong> Raw data format for developers or importing into other tools</li>
                        <li><strong>Markdown:</strong> Formatted document for Word, Notion, or documentation systems</li>
                      </ul>
                    </div>
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8 max-w-7xl">
        
        {/* Executive Summary Table */}
        <Card className="mb-8 border-border/60 shadow-sm overflow-hidden" data-testid="executive-summary">
          <CardHeader className="pb-2 bg-muted/30">
            <CardTitle className="text-lg flex items-center gap-2">
              <TableIcon className="h-4 w-4" />
              Executive Summary
            </CardTitle>
            <CardDescription>Key differences at a glance</CardDescription>
          </CardHeader>
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm" role="table" aria-label="Executive summary comparing SWMM5 and ICM InfoWorks Networks">
              <thead>
                <tr className="border-b border-border bg-muted/20">
                  <th className="text-left p-3 font-bold" scope="col">Characteristic</th>
                  <th className="text-left p-3 font-bold text-blue-600 dark:text-blue-400" scope="col">SWMM 5</th>
                  <th className="text-left p-3 font-bold text-emerald-600 dark:text-emerald-400" scope="col">InfoWorks ICM</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/50" data-testid="row-solution-method">
                  <td className="p-3 font-semibold">Solution Method</td>
                  <td className="p-3 text-foreground/80 font-medium" data-testid="text-swmm-solution">Implicit backward Euler with successive relaxation</td>
                  <td className="p-3 text-foreground/80 font-medium" data-testid="text-icm-solution">Preissmann 4-point scheme with Newton-Raphson</td>
                </tr>
                <tr className="border-b border-border/50 bg-muted/10" data-testid="row-discretization">
                  <td className="p-3 font-semibold">Discretization</td>
                  <td className="p-3 text-foreground/80 font-medium" data-testid="text-swmm-discretization">Node-link (1 link per conduit)</td>
                  <td className="p-3 text-foreground/80 font-medium" data-testid="text-icm-discretization">Distributed (N points per conduit)</td>
                </tr>
                <tr className="border-b border-border/50" data-testid="row-surcharge">
                  <td className="p-3 font-semibold">Surcharge Handling</td>
                  <td className="p-3 text-foreground/80 font-medium" data-testid="text-swmm-surcharge">Surcharge algorithm or Preissmann Slot (v5.1.013+)</td>
                  <td className="p-3 text-foreground/80 font-medium" data-testid="text-icm-surcharge">Preissmann Slot (default)</td>
                </tr>
                <tr className="border-b border-border/50 bg-muted/10" data-testid="row-timestep">
                  <td className="p-3 font-semibold">Time Step</td>
                  <td className="p-3 text-foreground/80 font-medium" data-testid="text-swmm-timestep">CFL-based variable (typically 0.5-30s)</td>
                  <td className="p-3 text-foreground/80 font-medium" data-testid="text-icm-timestep">Convergence-based adaptive (larger steps possible)</td>
                </tr>
                <tr className="border-b border-border/50" data-testid="row-dry-networks">
                  <td className="p-3 font-semibold">Dry Networks</td>
                  <td className="p-3 text-foreground/80 font-medium" data-testid="text-swmm-dry">Fully supported (zero flow)</td>
                  <td className="p-3 text-foreground/80 font-medium" data-testid="text-icm-dry">Base flow maintained (~5% depth)</td>
                </tr>
                <tr className="border-b border-border/50 bg-muted/10" data-testid="row-best-for">
                  <td className="p-3 font-semibold">Best For</td>
                  <td className="p-3 text-foreground/80 font-medium" data-testid="text-swmm-usecase">Regulatory compliance, water quality, LID, research</td>
                  <td className="p-3 text-foreground/80 font-medium" data-testid="text-icm-usecase">Large networks, 1D/2D integration, real-time control</td>
                </tr>
                <tr data-testid="row-license">
                  <td className="p-3 font-semibold">License</td>
                  <td className="p-3 text-foreground/80 font-medium" data-testid="text-swmm-license">Public domain (free)</td>
                  <td className="p-3 text-foreground/80 font-medium" data-testid="text-icm-license">Commercial (Autodesk)</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          {/* Mobile Card Layout */}
          <div className="md:hidden space-y-3 p-4">
            {[
              { label: "Solution Method", swmm: "Implicit backward Euler", icm: "Preissmann 4-point + Newton-Raphson" },
              { label: "Discretization", swmm: "Node-link (1 link/conduit)", icm: "Distributed (N points/conduit)" },
              { label: "Surcharge", swmm: "Surcharge algo or Preissmann Slot (v5.1.013+)", icm: "Preissmann Slot (default)" },
              { label: "Time Step", swmm: "CFL-based (0.5-30s)", icm: "Convergence-based (larger)" },
              { label: "Dry Networks", swmm: "Fully supported", icm: "Base flow (~5% depth)" },
              { label: "Best For", swmm: "Regulatory, WQ, LID, research", icm: "Large networks, 1D/2D, RTC" },
              { label: "License", swmm: "Public domain (free)", icm: "Commercial (Autodesk)" },
            ].map((row, i) => (
              <div key={i} className="border border-border rounded-lg p-3 bg-card">
                <div className="font-bold text-sm mb-2">{row.label}</div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <div className="font-semibold text-blue-600 dark:text-blue-400 mb-1">SWMM 5</div>
                    <div className="text-foreground/80 font-medium">{row.swmm}</div>
                  </div>
                  <div>
                    <div className="font-semibold text-emerald-600 dark:text-emerald-400 mb-1">ICM</div>
                    <div className="text-foreground/80 font-medium">{row.icm}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Intro Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="border-l-4 border-l-blue-500 bg-gradient-to-br from-card to-blue-50/5 dark:to-blue-900/10">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <Badge variant="outline" className="mb-2 border-blue-200 text-blue-700 bg-blue-50 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800">EPA SWMM 5</Badge>
                  <CardTitle className="text-xl">Dynamic Wave Routing</CardTitle>
                </div>
                <Info className="h-5 w-5 text-muted-foreground/50" />
              </div>
              <CardDescription className="text-sm leading-relaxed mt-2">
                {KB.swmm5.tagline}
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-l-4 border-l-emerald-500 bg-gradient-to-br from-card to-emerald-50/5 dark:to-emerald-900/10">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <Badge variant="outline" className="mb-2 border-emerald-200 text-emerald-700 bg-emerald-50 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800">InfoWorks ICM</Badge>
                  <CardTitle className="text-xl">1D Saint-Venant Solver</CardTitle>
                </div>
                <Info className="h-5 w-5 text-muted-foreground/50" />
              </div>
              <CardDescription className="text-sm leading-relaxed mt-2">
                {KB.icm.tagline}
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Python Script Download Banner */}
        <div className="mb-8 p-4 border border-dashed border-border rounded-lg bg-muted/30 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-yellow-500/10 rounded-md flex items-center justify-center">
              <FileCode className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">Original Python Tool</h3>
              <p className="text-xs text-muted-foreground">Download the CLI version of this comparison tool.</p>
            </div>
          </div>
          <Button variant="outline" size="sm" asChild>
            <a href="/comparison_tool.py" download>
              <Download className="h-3.5 w-3.5 mr-2" />
              Download Script
            </a>
          </Button>
        </div>

        {/* Decision Engine - Prominent Placement */}
        <div className="mb-8">
          <DecisionEngineDiagram />
        </div>

        {activeView === "visuals" && (
           <div className="space-y-6 animate-in fade-in duration-500">
             {/* Category Menu */}
             <div className="flex flex-wrap gap-2 p-4 bg-muted/30 rounded-lg border border-border" data-testid="diagram-category-menu">
               {DIAGRAM_CATEGORIES.map(cat => {
                 const IconComponent = cat.id === "solver" ? Cpu : 
                                       cat.id === "options" ? Settings : 
                                       cat.id === "dynwave" ? Zap : 
                                       cat.id === "temporal" ? Clock : 
                                       cat.id === "controls" ? Workflow : 
                                       cat.id === "advanced" ? BarChart2 : 
                                       cat.id === "hydrologic" ? Droplet : 
                                       cat.id === "climate" ? Cloud : 
                                       cat.id === "green" ? Leaf : 
                                       cat.id === "icm" ? Gauge : 
                                       cat.id === "inlets" ? Grid3X3 : 
                                      cat.id === "historical" ? Landmark : Code;
                 return (
                   <Button
                     key={cat.id}
                     variant={activeCategory === cat.id ? "default" : "outline"}
                     size="sm"
                     onClick={() => setActiveCategory(cat.id)}
                     className="flex items-center gap-2"
                     data-testid={`button-category-${cat.id}`}
                   >
                     <IconComponent className="h-4 w-4" />
                     {cat.label}
                     {activeCategory === cat.id && <ChevronRight className="h-3 w-3 ml-1" />}
                   </Button>
                 );
               })}
             </div>

             {/* Solver Mechanics */}
             {activeCategory === "solver" && (
               <div className="space-y-6" data-testid="section-solver">
                 <div className="mb-4">
                   <h3 className="text-2xl font-bold tracking-tight mb-2">Solver Mechanics</h3>
                   <p className="text-muted-foreground">Core discretization and fundamental solver architecture differences.</p>
                 </div>
                 <div className="grid md:grid-cols-2 gap-6">
                    <DiscretizationDiagram />
                    <PreissmannSlotDiagram />
                 </div>
                 <div className="grid md:grid-cols-2 gap-6">
                    <WavePropagationDiagram />
                    <DryNetworkDiagram />
                 </div>
                 <div className="grid md:grid-cols-1 gap-6">
                    <ManholeVsNodeDiagram />
                 </div>
                 <div className="grid md:grid-cols-1 gap-6 max-w-3xl mx-auto">
                    <NodeAreaDiagram />
                 </div>
                 <div className="mt-6 mb-4">
                   <h4 className="text-xl font-bold tracking-tight mb-2">Interactive Calculators</h4>
                   <p className="text-muted-foreground text-sm">Hands-on tools to explore solver differences and build intuition.</p>
                 </div>
                 <div className="grid md:grid-cols-1 gap-6">
                    <PreissmannSlotCalculator />
                    <ManningsFlowCalculator />
                    <ComputationalPointsDiagram />
                    <SurchargeAlgorithmDiagram />
                 </div>
                 <div className="mt-6 mb-4">
                   <h4 className="text-xl font-bold tracking-tight mb-2">Network-Level Simulation</h4>
                   <p className="text-muted-foreground text-sm">Watch how the same network behaves under each solver and explore force main differences.</p>
                 </div>
                 <div className="grid md:grid-cols-1 gap-6">
                    <LiveNetworkComparison />
                    <ForceMainComparison />
                 </div>
                 <div className="mt-6 mb-4">
                   <h4 className="text-xl font-bold tracking-tight mb-2">Backwater Effects</h4>
                   <p className="text-muted-foreground text-sm">How downstream boundary changes propagate upstream through each solver's computational grid.</p>
                 </div>
                 <div className="grid md:grid-cols-1 gap-6">
                    <BackwaterPropagation />
                 </div>
               </div>
             )}

             {/* Solver Options */}
             {activeCategory === "options" && (
               <div className="space-y-6" data-testid="section-options">
                 <div className="mb-4">
                   <h3 className="text-2xl font-bold tracking-tight mb-2">Solver Options & Parameters</h3>
                   <p className="text-muted-foreground">Interactive controls that engineers use to tune model behavior.</p>
                 </div>
                 <div className="grid md:grid-cols-2 gap-6">
                    <CFLStabilityDiagram />
                    <AdaptiveTimestepDiagram />
                 </div>
                 <div className="grid md:grid-cols-2 gap-6">
                    <SurchargeMethodDiagram />
                    <ThetaParameterDiagram />
                 </div>
                 <div className="grid md:grid-cols-2 gap-6">
                    <RoutingMethodFlowchart />
                    <Coupling1D2DDiagram />
                 </div>
               </div>
             )}

             {/* Advanced Analysis */}
             {activeCategory === "advanced" && (
               <div className="space-y-6" data-testid="section-advanced">
                 <div className="mb-4">
                   <h3 className="text-2xl font-bold tracking-tight mb-2">Advanced Solver Behavior & Diagnostics</h3>
                   <p className="text-muted-foreground">Deep insights into solver convergence, stability, and practical engineering scenarios.</p>
                 </div>
                 <div className="grid md:grid-cols-2 gap-6">
                    <ConvergenceSnapshotsDiagram />
                    <MassBalanceErrorDiagram />
                 </div>
                 <div className="grid md:grid-cols-2 gap-6">
                    <OscillationChallengeDiagram />
                    <WettingFrontDiagram />
                 </div>
                 <div className="grid md:grid-cols-2 gap-6">
                    <TimestepDashboardDiagram />
                    <SolverDecisionTreeDiagram />
                 </div>
                 <div className="grid md:grid-cols-1 gap-6">
                    <TimestepComparisonDiagram />
                 </div>
                 <div className="mt-6 mb-4">
                   <h4 className="text-xl font-bold tracking-tight mb-2">Conduit Discretization Impact</h4>
                   <p className="text-muted-foreground text-sm">How conduit length and element count affect accuracy.</p>
                 </div>
                 <div className="grid md:grid-cols-1 gap-6">
                    <ConduitLengthSensitivity />
                 </div>
                 <div className="mt-6 mb-4">
                   <h4 className="text-xl font-bold tracking-tight mb-2">Migration Pitfalls</h4>
                   <p className="text-muted-foreground text-sm">Common mistakes when comparing or converting between solvers.</p>
                 </div>
                 <div className="grid md:grid-cols-1 gap-6">
                    <CommonPitfalls />
                 </div>
               </div>
             )}

             {/* Hydrologic Processes */}
             {activeCategory === "hydrologic" && (
               <div className="space-y-6" data-testid="section-hydrologic">
                 <div className="mb-4">
                   <h3 className="text-2xl font-bold tracking-tight mb-2">SWMM5 Hydrologic Processes</h3>
                   <p className="text-muted-foreground">Rainfall-runoff transformation, RDII, and water quality modeling.</p>
                 </div>
                 <div className="grid md:grid-cols-1 gap-6">
                    <HydrologicWorkflowDiagram />
                 </div>
                 <div className="grid md:grid-cols-2 gap-6">
                    <RunoffProcessDiagram />
                    <RTKDiagram />
                 </div>
                 <div className="grid md:grid-cols-1 gap-6">
                    <BuildupWashoffDiagram />
                 </div>
               </div>
             )}

             {/* Climate & Infiltration */}
             {activeCategory === "climate" && (
               <div className="space-y-6" data-testid="section-climate">
                 <div className="mb-4">
                   <h3 className="text-2xl font-bold tracking-tight mb-2">Climate & Infiltration</h3>
                   <p className="text-muted-foreground">Snowmelt algorithms and infiltration method comparisons.</p>
                 </div>
                 <div className="grid md:grid-cols-2 gap-6">
                    <SnowmeltAlgorithmsDiagram />
                    <InfiltrationShootoutDiagram />
                 </div>
               </div>
             )}

             {/* Green Infrastructure */}
             {activeCategory === "green" && (
               <div className="space-y-6" data-testid="section-green">
                 <div className="mb-4">
                   <h3 className="text-2xl font-bold tracking-tight mb-2">Green Infrastructure</h3>
                   <p className="text-muted-foreground">LID/SUDS controls and ICM's dual-solver architecture.</p>
                 </div>
                 <div className="grid md:grid-cols-1 gap-6">
                    <LIDvsSUDSDiagram />
                 </div>
                 <div className="grid md:grid-cols-1 gap-6">
                    <DualSolverArchitectureDiagram />
                 </div>
               </div>
             )}

             {/* ICM Simulation Parameters */}
             {activeCategory === "icm" && (
               <div className="space-y-6" data-testid="section-icm">
                 <div className="mb-4">
                   <h3 className="text-2xl font-bold tracking-tight mb-2">ICM Simulation Parameters</h3>
                   <p className="text-muted-foreground">Interactive diagrams explaining InfoWorks ICM's critical solver parameters and numerical stability controls.</p>
                 </div>
                 <div className="grid md:grid-cols-1 gap-6">
                    <BaseFlowStabilityDiagram />
                    <SpatialDiscretizationDiagram />
                    <ICMPreissmannSlotDiagram />
                    <AdaptiveTimeSteppingDiagram />
                    <HeadlossTransitionDiagram />
                    <ColdStartInitializationDiagram />
                 </div>
                 <div className="mt-6 mb-4">
                   <h4 className="text-xl font-bold tracking-tight mb-2">Junction Headloss Mechanics</h4>
                   <p className="text-muted-foreground text-sm">Physics of energy loss at junctions and transitions.</p>
                 </div>
                 <div className="grid md:grid-cols-1 gap-6">
                    <HeadlossJunctionDiagram />
                    <HeadlossSurchargeTransitionDiagram />
                    <HeadlossInferenceDiagram />
                 </div>
                 <div className="mt-6 mb-4">
                   <h4 className="text-xl font-bold tracking-tight mb-2">Model Translation & Workflows</h4>
                   <p className="text-muted-foreground text-sm">Bridging workflows between InfoSewer and ICM.</p>
                 </div>
                 <div className="grid md:grid-cols-1 gap-6">
                    <InfoSewerSteadyStateEmulationDiagram />
                 </div>
                 <div className="mt-6 mb-4">
                   <h4 className="text-xl font-bold tracking-tight mb-2">Surface Flooding Approach</h4>
                   <p className="text-muted-foreground text-sm">Compare SWMM5's ponded area vs ICM's full 2D mesh for overland flow.</p>
                 </div>
                 <div className="grid md:grid-cols-1 gap-6">
                    <SurfaceFloodingDiagram />
                 </div>
                 <div className="mt-6 mb-4">
                   <h4 className="text-xl font-bold tracking-tight mb-2">Three-Engine Comparison</h4>
                   <p className="text-muted-foreground text-sm">EPA SWMM5 vs ICM SWMM (embedded) vs ICM InfoWorks (native) — which engine to use when.</p>
                 </div>
                 <div className="grid md:grid-cols-1 gap-6">
                    <ICMSWMMEngineComparison />
                 </div>
                 <div className="mt-6 mb-4">
                   <h4 className="text-xl font-bold tracking-tight mb-2">Manhole Hydraulics Simulator</h4>
                   <p className="text-muted-foreground text-sm">Interactive ICM manhole with inlet/outlet pipes, gate valve, and head-driven orifice outflow — watch the water level respond in real time.</p>
                 </div>
                 <div className="grid md:grid-cols-1 gap-6">
                    <ICMManholeSimulator />
                 </div>
                 <div className="mt-6 mb-4">
                   <h4 className="text-xl font-bold tracking-tight mb-2">1D-2D Coupling</h4>
                   <p className="text-muted-foreground text-sm">ICM's signature capability — coupling underground pipe networks with surface flood routing.</p>
                 </div>
                 <div className="grid md:grid-cols-1 gap-6">
                    <OneDTwoDCoupling />
                 </div>
                 <div className="mt-6 mb-4">
                   <h4 className="text-xl font-bold tracking-tight mb-2">Storage & Flooding</h4>
                   <p className="text-muted-foreground text-sm">How each solver computes manhole storage volume and handles surface flooding.</p>
                 </div>
                 <div className="grid md:grid-cols-2 gap-6">
                    <ManholeStorageVolume />
                    <FloodTypeComparison />
                 </div>
               </div>
             )}

             {/* Dynamic Wave Options */}
             {activeCategory === "dynwave" && (
               <div className="space-y-6" data-testid="section-dynwave">
                 <div className="mb-4">
                   <h3 className="text-2xl font-bold tracking-tight mb-2">Dynamic Wave Options</h3>
                   <p className="text-muted-foreground">SWMM5's "control panel" for the numerical engine—inertia handling, flow limits, surcharge methods, and solver tuning.</p>
                 </div>
                 <div className="mt-6 mb-4">
                   <h4 className="text-xl font-bold tracking-tight mb-2">Momentum & Flow Regime Controls</h4>
                   <p className="text-muted-foreground text-sm">Settings that control how the solver handles inertia and limits flow conditions.</p>
                 </div>
                 <div className="grid md:grid-cols-1 gap-6">
                    <InertialTermsDiagram />
                    <NormalFlowCriterionDiagram />
                    <SurchargeMethodDeepDiveDiagram />
                 </div>
                 <div className="mt-6 mb-4">
                   <h4 className="text-xl font-bold tracking-tight mb-2">Timestep & Stability Controls</h4>
                   <p className="text-muted-foreground text-sm">Parameters that govern computational timesteps and numerical stability.</p>
                 </div>
                 <div className="grid md:grid-cols-1 gap-6">
                    <VariableTimestepDiagram />
                    <ConduitLengtheningDiagram />
                    <MinNodalSurfaceAreaDiagram />
                 </div>
                 <div className="mt-6 mb-4">
                   <h4 className="text-xl font-bold tracking-tight mb-2">Solver Performance</h4>
                   <p className="text-muted-foreground text-sm">Convergence settings and parallel processing options.</p>
                 </div>
                 <div className="grid md:grid-cols-1 gap-6">
                    <ConvergenceTolerancesDiagram />
                    <ParallelThreadsDiagram />
                 </div>
                 <div className="mt-6 mb-4">
                   <h4 className="text-xl font-bold tracking-tight mb-2">Interactive Calculators</h4>
                   <p className="text-muted-foreground text-sm">Explore flow regime behavior and momentum equation effects.</p>
                 </div>
                 <div className="grid md:grid-cols-1 gap-6">
                    <FroudeNumberCalculator />
                    <InertialTermsCalculator />
                 </div>
               </div>
             )}

             {/* Temporal Dynamics & Solver Stability */}
             {activeCategory === "temporal" && (
               <div className="space-y-6" data-testid="section-temporal">
                 <div className="mb-4">
                   <h3 className="text-2xl font-bold tracking-tight mb-2">Temporal Dynamics & Solver Stability</h3>
                   <p className="text-muted-foreground">How SWMM5 and ICM translate physical reality into numerical solutions across time—CFL conditions, adaptive stepping, and startup behavior.</p>
                 </div>
                 <div className="mt-6 mb-4">
                   <h4 className="text-xl font-bold tracking-tight mb-2">The CFL Challenge</h4>
                   <p className="text-muted-foreground text-sm">Why timesteps must "catch" physical waves and what happens when they don't.</p>
                 </div>
                 <div className="grid md:grid-cols-1 gap-6">
                    <WaveTravelVsTimestepDiagram />
                    <AdaptiveTimestepSimulatorDiagram />
                 </div>
                 <div className="mt-6 mb-4">
                   <h4 className="text-xl font-bold tracking-tight mb-2">Stability Techniques</h4>
                   <p className="text-muted-foreground text-sm">How solvers maintain stability through lengthening and base flow.</p>
                 </div>
                 <div className="grid md:grid-cols-1 gap-6">
                    <ConduitLengtheningCheatCodeDiagram />
                    <DryStartVsBaseFlowDiagram />
                 </div>
                 <div className="mt-6 mb-4">
                   <h4 className="text-xl font-bold tracking-tight mb-2">Interactive Calculators</h4>
                   <p className="text-muted-foreground text-sm">Calculate CFL numbers and estimate simulation efficiency.</p>
                 </div>
                 <div className="grid md:grid-cols-1 gap-6">
                    <CFLStabilityCalculator />
                    <TimeStepEfficiencyEstimator />
                 </div>
               </div>
             )}

             {/* Operational Controls */}
             {activeCategory === "controls" && (
               <div className="space-y-6" data-testid="section-controls">
                 <div className="mb-4">
                   <h3 className="text-2xl font-bold tracking-tight mb-2">Operational Control & Logic</h3>
                   <p className="text-muted-foreground">How ICM's component-based RTC architecture compares to SWMM5's procedural control scripts—from building logic to execution.</p>
                 </div>
                 <div className="mt-6 mb-4">
                   <h4 className="text-xl font-bold tracking-tight mb-2">Control Logic Definition</h4>
                   <p className="text-muted-foreground text-sm">Architecture vs scripting approaches to defining control rules.</p>
                 </div>
                 <div className="grid md:grid-cols-1 gap-6">
                    <ControlLogicBuilderDiagram />
                    <ExecutionTimelineDiagram />
                 </div>
                 <div className="mt-6 mb-4">
                   <h4 className="text-xl font-bold tracking-tight mb-2">Controller Sophistication</h4>
                   <p className="text-muted-foreground text-sm">From simple on/off to advanced PID and incremental control.</p>
                 </div>
                 <div className="grid md:grid-cols-1 gap-6">
                    <ControllerTypesDiagram />
                 </div>
               </div>
             )}

             {/* Surface-to-Sewer Transitions (Inlets) */}
             {activeCategory === "inlets" && (
               <div className="space-y-6" data-testid="section-inlets">
                 <div className="mb-4">
                   <h3 className="text-2xl font-bold tracking-tight mb-2">Surface-to-Sewer Transitions</h3>
                   <p className="text-muted-foreground">Inlet representation, HEC-22 equations, and flow transition scenarios between surface and sewer systems.</p>
                 </div>
                 <div className="grid md:grid-cols-1 gap-6">
                    <InletElementDiagram />
                    <HEC22InletCalculatorDiagram />
                    <FlowTransitionDiagram />
                    <InletEfficiencyCurvesDiagram />
                 </div>
               </div>
             )}

             {/* Code Architecture */}
             {activeCategory === "architecture" && (
               <div className="space-y-6" data-testid="section-architecture">
                 <div className="mb-4">
                   <h3 className="text-2xl font-bold tracking-tight mb-2">Code Architecture & Internals</h3>
                   <p className="text-muted-foreground">Deep dive into SWMM5's internal operations, data structures, and processing pipeline.</p>
                 </div>
                 <div className="grid md:grid-cols-2 gap-6">
                    <InputFileParserDiagram />
                    <MatrixSolverDiagram />
                 </div>
                 <div className="grid md:grid-cols-2 gap-6">
                    <RTCRulesDiagram />
                    <MassRoutingDiagram />
                 </div>
                 <div className="grid md:grid-cols-2 gap-6">
                    <SurchargeCodeDiagram />
                    <GroundwaterExchangeDiagram />
                 </div>
                 <div className="grid md:grid-cols-2 gap-6">
                    <MinorLossesDiagram />
                    <ReportingSystemDiagram />
                 </div>
               </div>
             )}

             {activeCategory === "historical" && (
               <div className="space-y-6" data-testid="section-historical">
                 <div className="mb-4">
                   <h3 className="text-2xl font-bold tracking-tight mb-2">Historical Water Engineering</h3>
                   <p className="text-muted-foreground">300,000 years of water engineering brought to life through interactive hydraulic simulations — with SWMM5/ICM equations visible and parameters adjustable.</p>
                 </div>
                 <div className="mt-4 mb-4">
                   <h4 className="text-xl font-bold tracking-tight mb-2">Gravity Flow Systems</h4>
                   <p className="text-muted-foreground text-sm">Ancient civilizations mastered gravity-driven water delivery across vast distances.</p>
                 </div>
                 <div className="grid md:grid-cols-1 gap-6">
                    <RomanAqueductAnimation />
                 </div>
                 <div className="grid md:grid-cols-1 gap-6">
                    <DujiangyanAnimation />
                 </div>
                 <div className="grid md:grid-cols-1 gap-6">
                    <IncaFountainAnimation />
                 </div>
                 <div className="mt-6 mb-4">
                   <h4 className="text-xl font-bold tracking-tight mb-2">Underground & Groundwater</h4>
                   <p className="text-muted-foreground text-sm">Ingenious systems for tapping aquifers and accessing water tables.</p>
                 </div>
                 <div className="grid md:grid-cols-1 gap-6">
                    <PersianQanatAnimation />
                 </div>
                 <div className="grid md:grid-cols-1 gap-6">
                    <IndianStepwellAnimation />
                 </div>
                 <div className="mt-6 mb-4">
                   <h4 className="text-xl font-bold tracking-tight mb-2">Flood Control</h4>
                   <p className="text-muted-foreground text-sm">How ancient engineers protected cities from floods using dikes, polders, and passive flow control.</p>
                 </div>
                 <div className="grid md:grid-cols-1 gap-6">
                    <AztecDikeAnimation />
                 </div>
                 <div className="grid md:grid-cols-1 gap-6">
                    <DutchPolderAnimation />
                 </div>
                 <div className="mt-6 mb-4">
                   <h4 className="text-xl font-bold tracking-tight mb-2">Pressure Flow</h4>
                   <p className="text-muted-foreground text-sm">Pressurized pipe systems that predate modern force main engineering.</p>
                 </div>
                 <div className="grid md:grid-cols-1 gap-6">
                    <RomanSiphonAnimation />
                 </div>
                 <div className="mt-6 mb-4">
                   <h4 className="text-xl font-bold tracking-tight mb-2">Water Treatment & Storage</h4>
                   <p className="text-muted-foreground text-sm">Filtration, reservoir management, and water quality — solved millennia ago.</p>
                 </div>
                 <div className="grid md:grid-cols-1 gap-6">
                    <MayaFiltrationAnimation />
                 </div>
                 <div className="grid md:grid-cols-1 gap-6">
                    <KhmerBarayAnimation />
                 </div>
                 <div className="mt-6 mb-4">
                   <h4 className="text-xl font-bold tracking-tight mb-2">Sanitation & Drainage</h4>
                   <p className="text-muted-foreground text-sm">The world's first sewers and urban drainage networks — some still in operation.</p>
                 </div>
                 <div className="grid md:grid-cols-1 gap-6">
                    <CloacaMaximaAnimation />
                 </div>
                 <div className="grid md:grid-cols-1 gap-6">
                    <IndusValleyDrainAnimation />
                 </div>
                 <div className="mt-6 mb-4">
                   <h4 className="text-xl font-bold tracking-tight mb-2">Water Lifting</h4>
                   <p className="text-muted-foreground text-sm">Mechanical pumping technology that hasn't been improved in 2,200 years.</p>
                 </div>
                 <div className="grid md:grid-cols-1 gap-6">
                    <ArchimedesScrewAnimation />
                 </div>
               </div>
             )}
           </div>
        )}

        {activeView === "topic" && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Detailed Comparison by Topic</h2>
            </div>
            
            <Accordion type="single" collapsible defaultValue="governing_equations" className="w-full space-y-4">
              {TOPIC_ORDER.map((topic) => (
                <AccordionItem 
                  key={topic.key} 
                  value={topic.key} 
                  className="border border-border rounded-lg bg-card px-4 shadow-sm overflow-hidden"
                >
                  <AccordionTrigger className="hover:no-underline py-4">
                    <div className="flex items-center gap-3 text-left flex-1">
                      <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center shrink-0 text-muted-foreground text-xs font-mono font-medium">
                        {topic.key.substring(0, 2).toUpperCase()}
                      </div>
                      <span className="font-semibold text-lg">{topic.label}</span>
                      {TOPIC_DIAGRAM_MAP[topic.key] && (
                        <Badge variant="secondary" className="ml-2 text-[10px]" data-testid={`badge-diagram-${topic.key}`}>
                          {TOPIC_DIAGRAM_MAP[topic.key].length} diagram{TOPIC_DIAGRAM_MAP[topic.key].length > 1 ? 's' : ''}
                        </Badge>
                      )}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-6 pt-2">
                    {TOPIC_DIAGRAM_MAP[topic.key] && (
                      <div className="mb-4 p-3 rounded-lg bg-muted/30 border border-border/50">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs text-muted-foreground">Related diagrams:</span>
                          {TOPIC_DIAGRAM_MAP[topic.key].map((diag, idx) => (
                            <Button 
                              key={idx}
                              variant="outline" 
                              size="sm" 
                              className="h-6 text-xs gap-1"
                              onClick={() => {
                                setActiveView("visuals");
                                setActiveCategory(diag.category);
                              }}
                              data-testid={`button-view-diagram-${topic.key}-${idx}`}
                            >
                              <BarChart2 className="h-3 w-3" />
                              {diag.label}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="grid md:grid-cols-2 gap-8 relative">
                      {/* Vertical separator line for desktop */}
                      <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-border -translate-x-1/2"></div>
                      
                      {/* SWMM5 Content */}
                      <div className="space-y-3">
                        <h4 className="font-medium text-sm text-blue-600 dark:text-blue-400 flex items-center gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-blue-500"></span>
                          SWMM 5
                        </h4>
                        <ul className="space-y-3">
                          {(KB.swmm5.topics as any)[topic.key].map((point: string, i: number) => (
                            <li key={i} className="text-sm text-muted-foreground leading-relaxed pl-4 border-l-2 border-border/50">
                              {point}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* ICM Content */}
                      <div className="space-y-3">
                        <h4 className="font-medium text-sm text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                          InfoWorks ICM
                        </h4>
                        <ul className="space-y-3">
                          {(KB.icm.topics as any)[topic.key].map((point: string, i: number) => (
                            <li key={i} className="text-sm text-muted-foreground leading-relaxed pl-4 border-l-2 border-border/50">
                              {point}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        )}
        
        {activeView === "table" && (
          <div className="space-y-6 animate-in fade-in duration-500">
             <div className="flex items-center gap-2 mb-4">
              <TableIcon className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Side-by-Side Comparison Table</h2>
            </div>
            
            <Card className="overflow-hidden border-border/60 shadow-md">
              <ScrollArea className="w-full">
                <div className="min-w-[800px]">
                  {/* Table Header */}
                  <div className="grid grid-cols-[250px_1fr_1fr] bg-muted/50 border-b border-border">
                    <div className="p-4 font-semibold text-sm">Topic</div>
                    <div className="p-4 font-semibold text-sm text-blue-600 dark:text-blue-400 border-l border-border">SWMM 5 (Dynamic Wave)</div>
                    <div className="p-4 font-semibold text-sm text-emerald-600 dark:text-emerald-400 border-l border-border">InfoWorks ICM (1D)</div>
                  </div>
                  
                  {/* Table Body */}
                  {TOPIC_ORDER.map((topic, index) => (
                    <div 
                      key={topic.key} 
                      className={`grid grid-cols-[250px_1fr_1fr] border-b border-border/50 last:border-0 hover:bg-muted/20 transition-colors ${index % 2 === 0 ? 'bg-card' : 'bg-card/50'}`}
                    >
                      <div className="p-4 text-sm font-medium text-foreground/80 space-y-2">
                        <div className="flex items-center gap-2">
                          <span>{topic.label}</span>
                          {TOPIC_DIAGRAM_MAP[topic.key] && (
                            <Badge variant="secondary" className="text-[9px] px-1.5 py-0">
                              {TOPIC_DIAGRAM_MAP[topic.key].length} diagram{TOPIC_DIAGRAM_MAP[topic.key].length > 1 ? 's' : ''}
                            </Badge>
                          )}
                        </div>
                        {TOPIC_DIAGRAM_MAP[topic.key] && (
                          <div className="flex flex-wrap gap-1 pt-1">
                            {TOPIC_DIAGRAM_MAP[topic.key].map((diag, idx) => (
                              <Button 
                                key={idx}
                                variant="outline" 
                                size="sm" 
                                className="h-6 text-[10px] px-2 gap-1 bg-primary/5 hover:bg-primary/10 border-primary/20"
                                onClick={() => {
                                  setActiveView("visuals");
                                  setActiveCategory(diag.category);
                                }}
                                data-testid={`button-table-diagram-${topic.key}-${idx}`}
                              >
                                <BarChart2 className="h-3 w-3 text-primary" />
                                {diag.label}
                              </Button>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="p-4 text-sm text-muted-foreground border-l border-border/50 space-y-2">
                         <ul className="list-disc pl-4 space-y-1 marker:text-blue-300">
                          {(KB.swmm5.topics as any)[topic.key].map((point: string, i: number) => (
                            <li key={i}>{point}</li>
                          ))}
                         </ul>
                      </div>
                      <div className="p-4 text-sm text-muted-foreground border-l border-border/50 space-y-2">
                        <ul className="list-disc pl-4 space-y-1 marker:text-emerald-300">
                          {(KB.icm.topics as any)[topic.key].map((point: string, i: number) => (
                            <li key={i}>{point}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </Card>
          </div>
        )}

        {activeView === "source" && (
          <div className="space-y-6 animate-in fade-in duration-500" data-testid="source-view">
            <div className="flex items-center gap-2 mb-4">
              <FileCode className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold" data-testid="text-source-title">Source Code Files</h2>
              <span className="text-sm text-muted-foreground ml-2">(Click a file to view source code)</span>
            </div>
            
            <Dialog open={selectedFile !== null} onOpenChange={(open) => !open && setSelectedFile(null)}>
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <FileCode className="h-5 w-5" />
                    {selectedFile}
                  </DialogTitle>
                  <DialogDescription>
                    {selectedFile && FILE_PATHS[selectedFile]}
                  </DialogDescription>
                </DialogHeader>
                <ScrollArea className="flex-1 mt-4">
                  <pre className="text-xs font-mono bg-slate-950 text-slate-100 p-4 rounded-lg overflow-x-auto whitespace-pre-wrap">
                    <code>{selectedFile && SOURCE_CODE_FILES[selectedFile]}</code>
                  </pre>
                </ScrollArea>
              </DialogContent>
            </Dialog>
            
            <Card className="border-border/60 shadow-md" data-testid="card-visualization-components">
              <CardHeader className="pb-2 bg-muted/30">
                <CardTitle className="text-base">Visualization Components</CardTitle>
                <CardDescription>Interactive diagrams organized by category</CardDescription>
              </CardHeader>
              <div className="p-4 space-y-6">
                <div className="space-y-3">
                  <h4 className="font-medium text-sm text-blue-600 dark:text-blue-400 uppercase tracking-wide">Solver Mechanics</h4>
                  <div className="grid md:grid-cols-2 gap-2">
                    {[
                      { file: "SolverDiagrams.tsx", components: ["DiscretizationDiagram", "PreissmannSlotDiagram", "WavePropagationDiagram", "DryNetworkDiagram", "NodeAreaDiagram", "ManholeVsNodeDiagram"] },
                      { file: "SolverOptionsDiagrams.tsx", components: ["CFLStabilityDiagram", "SurchargeMethodDiagram", "RoutingMethodFlowchart", "AdaptiveTimestepDiagram", "ThetaParameterDiagram", "Coupling1D2DDiagram"] },
                      { file: "DynamicWaveOptionsDiagrams.tsx", components: ["InertialTermsDiagram", "NormalFlowCriterionDiagram", "SurchargeMethodDeepDiveDiagram", "VariableTimestepDiagram", "ConduitLengtheningDiagram", "MinNodalSurfaceAreaDiagram", "ConvergenceTolerancesDiagram", "ParallelThreadsDiagram"] },
                      { file: "TemporalDynamicsDiagrams.tsx", components: ["WaveTravelVsTimestepDiagram", "AdaptiveTimestepSimulatorDiagram", "ConduitLengtheningCheatCodeDiagram", "DryStartVsBaseFlowDiagram"] },
                      { file: "AdvancedDiagrams.tsx", components: ["ConvergenceSnapshotsDiagram", "MassBalanceErrorDiagram", "OscillationChallengeDiagram", "WettingFrontDiagram", "TimestepDashboardDiagram", "SolverDecisionTreeDiagram"] },
                      { file: "TimestepComparisonDiagram.tsx", components: ["TimestepComparisonDiagram"] },
                    ].map((item, i) => (
                      <div 
                        key={i} 
                        className="p-3 rounded-lg border border-border/50 bg-card/50 hover:bg-muted/30 hover:border-primary/50 transition-colors cursor-pointer" 
                        data-testid={`card-file-solver-${i}`}
                        onClick={() => setSelectedFile(item.file)}
                      >
                        <code className="text-xs font-mono text-primary" data-testid={`text-filename-solver-${i}`}>{item.file}</code>
                        <div className="mt-2 flex flex-wrap gap-1">
                          {item.components.map((c, j) => (
                            <Badge key={j} variant="outline" className="text-[10px]" data-testid={`badge-component-solver-${i}-${j}`}>{c}</Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <h4 className="font-medium text-sm text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">Hydrologic Processes</h4>
                  <div className="grid md:grid-cols-2 gap-2">
                    {[
                      { file: "HydrologicDiagrams.tsx", components: ["RunoffProcessDiagram", "RTKDiagram", "BuildupWashoffDiagram", "HydrologicWorkflowDiagram"] },
                    ].map((item, i) => (
                      <div 
                        key={i} 
                        className="p-3 rounded-lg border border-border/50 bg-card/50 hover:bg-muted/30 hover:border-primary/50 transition-colors cursor-pointer" 
                        data-testid={`card-file-hydro-${i}`}
                        onClick={() => setSelectedFile(item.file)}
                      >
                        <code className="text-xs font-mono text-primary" data-testid={`text-filename-hydro-${i}`}>{item.file}</code>
                        <div className="mt-2 flex flex-wrap gap-1">
                          {item.components.map((c, j) => (
                            <Badge key={j} variant="outline" className="text-[10px]" data-testid={`badge-component-hydro-${i}-${j}`}>{c}</Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <h4 className="font-medium text-sm text-amber-600 dark:text-amber-400 uppercase tracking-wide">Climate & Infiltration</h4>
                  <div className="grid md:grid-cols-2 gap-2">
                    {[
                      { file: "ClimateInfiltrationDiagrams.tsx", components: ["SnowmeltAlgorithmsDiagram", "InfiltrationShootoutDiagram"] },
                    ].map((item, i) => (
                      <div 
                        key={i} 
                        className="p-3 rounded-lg border border-border/50 bg-card/50 hover:bg-muted/30 hover:border-primary/50 transition-colors cursor-pointer" 
                        data-testid={`card-file-climate-${i}`}
                        onClick={() => setSelectedFile(item.file)}
                      >
                        <code className="text-xs font-mono text-primary" data-testid={`text-filename-climate-${i}`}>{item.file}</code>
                        <div className="mt-2 flex flex-wrap gap-1">
                          {item.components.map((c, j) => (
                            <Badge key={j} variant="outline" className="text-[10px]" data-testid={`badge-component-climate-${i}-${j}`}>{c}</Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <h4 className="font-medium text-sm text-purple-600 dark:text-purple-400 uppercase tracking-wide">Green Infrastructure</h4>
                  <div className="grid md:grid-cols-2 gap-2">
                    {[
                      { file: "GreenInfraDiagrams.tsx", components: ["LIDvsSUDSDiagram", "DualSolverArchitectureDiagram"] },
                    ].map((item, i) => (
                      <div 
                        key={i} 
                        className="p-3 rounded-lg border border-border/50 bg-card/50 hover:bg-muted/30 hover:border-primary/50 transition-colors cursor-pointer" 
                        data-testid={`card-file-green-${i}`}
                        onClick={() => setSelectedFile(item.file)}
                      >
                        <code className="text-xs font-mono text-primary" data-testid={`text-filename-green-${i}`}>{item.file}</code>
                        <div className="mt-2 flex flex-wrap gap-1">
                          {item.components.map((c, j) => (
                            <Badge key={j} variant="outline" className="text-[10px]" data-testid={`badge-component-green-${i}-${j}`}>{c}</Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <h4 className="font-medium text-sm text-orange-600 dark:text-orange-400 uppercase tracking-wide">Code Architecture</h4>
                  <div className="grid md:grid-cols-2 gap-2">
                    {[
                      { file: "ArchitecturalDiagrams.tsx", components: ["InputFileParserDiagram", "MatrixSolverDiagram", "RTCRulesDiagram", "MassRoutingDiagram", "SurchargeCodeDiagram", "GroundwaterExchangeDiagram", "MinorLossesDiagram", "ReportingSystemDiagram"] },
                    ].map((item, i) => (
                      <div 
                        key={i} 
                        className="p-3 rounded-lg border border-border/50 bg-card/50 hover:bg-muted/30 hover:border-primary/50 transition-colors cursor-pointer" 
                        data-testid={`card-file-arch-${i}`}
                        onClick={() => setSelectedFile(item.file)}
                      >
                        <code className="text-xs font-mono text-primary" data-testid={`text-filename-arch-${i}`}>{item.file}</code>
                        <div className="mt-2 flex flex-wrap gap-1">
                          {item.components.map((c, j) => (
                            <Badge key={j} variant="outline" className="text-[10px]" data-testid={`badge-component-arch-${i}-${j}`}>{c}</Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <h4 className="font-medium text-sm text-cyan-600 dark:text-cyan-400 uppercase tracking-wide">ICM Simulation</h4>
                  <div className="grid md:grid-cols-2 gap-2">
                    {[
                      { file: "ICMSimulationDiagrams.tsx", components: ["BaseFlowStabilityDiagram", "SpatialDiscretizationDiagram", "ICMPreissmannSlotDiagram", "AdaptiveTimeSteppingDiagram", "HeadlossTransitionDiagram", "ColdStartInitializationDiagram", "HeadlossJunctionDiagram", "HeadlossSurchargeTransitionDiagram", "HeadlossInferenceDiagram"] },
                    ].map((item, i) => (
                      <div 
                        key={i} 
                        className="p-3 rounded-lg border border-border/50 bg-card/50 hover:bg-muted/30 hover:border-primary/50 transition-colors cursor-pointer" 
                        data-testid={`card-file-icm-${i}`}
                        onClick={() => setSelectedFile(item.file)}
                      >
                        <code className="text-xs font-mono text-primary" data-testid={`text-filename-icm-${i}`}>{item.file}</code>
                        <div className="mt-2 flex flex-wrap gap-1">
                          {item.components.map((c, j) => (
                            <Badge key={j} variant="outline" className="text-[10px]" data-testid={`badge-component-icm-${i}-${j}`}>{c}</Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <h4 className="font-medium text-sm text-indigo-600 dark:text-indigo-400 uppercase tracking-wide">Surface-to-Sewer (Inlets)</h4>
                  <div className="grid md:grid-cols-2 gap-2">
                    {[
                      { file: "InletDiagrams.tsx", components: ["InletElementDiagram", "HEC22InletCalculatorDiagram", "FlowTransitionDiagram", "InletEfficiencyCurvesDiagram"] },
                    ].map((item, i) => (
                      <div 
                        key={i} 
                        className="p-3 rounded-lg border border-border/50 bg-card/50 hover:bg-muted/30 hover:border-primary/50 transition-colors cursor-pointer" 
                        data-testid={`card-file-inlets-${i}`}
                        onClick={() => setSelectedFile(item.file)}
                      >
                        <code className="text-xs font-mono text-primary" data-testid={`text-filename-inlets-${i}`}>{item.file}</code>
                        <div className="mt-2 flex flex-wrap gap-1">
                          {item.components.map((c, j) => (
                            <Badge key={j} variant="outline" className="text-[10px]" data-testid={`badge-component-inlets-${i}-${j}`}>{c}</Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <h4 className="font-medium text-sm text-slate-600 dark:text-slate-400 uppercase tracking-wide">Data & Configuration</h4>
                  <div className="grid md:grid-cols-2 gap-2">
                    {[
                      { file: "comparison-data.ts", components: ["KB (Knowledge Base)", "TOPIC_ORDER"] },
                      { file: "comparison_tool.py", components: ["CLI Tool (Python)"] },
                    ].map((item, i) => (
                      <div 
                        key={i} 
                        className="p-3 rounded-lg border border-border/50 bg-card/50 hover:bg-muted/30 hover:border-primary/50 transition-colors cursor-pointer" 
                        data-testid={`card-file-data-${i}`}
                        onClick={() => setSelectedFile(item.file)}
                      >
                        <code className="text-xs font-mono text-primary" data-testid={`text-filename-data-${i}`}>{item.file}</code>
                        <div className="mt-2 flex flex-wrap gap-1">
                          {item.components.map((c, j) => (
                            <Badge key={j} variant="outline" className="text-[10px]" data-testid={`badge-component-data-${i}-${j}`}>{c}</Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
            
            <Card className="border-border/60 shadow-md" data-testid="card-file-paths">
              <CardHeader className="pb-2 bg-muted/30">
                <CardTitle className="text-base">File Paths</CardTitle>
                <CardDescription>Full paths for all source files</CardDescription>
              </CardHeader>
              <div className="p-4">
                <ScrollArea className="h-64" data-testid="scroll-file-paths">
                  <div className="space-y-1 font-mono text-xs">
                    <div className="p-2 rounded bg-muted/30" data-testid="text-path-0">client/src/components/visuals/SolverDiagrams.tsx</div>
                    <div className="p-2 rounded bg-muted/30" data-testid="text-path-1">client/src/components/visuals/SolverOptionsDiagrams.tsx</div>
                    <div className="p-2 rounded bg-muted/30" data-testid="text-path-2">client/src/components/visuals/DynamicWaveOptionsDiagrams.tsx</div>
                    <div className="p-2 rounded bg-muted/30" data-testid="text-path-3">client/src/components/visuals/TemporalDynamicsDiagrams.tsx</div>
                    <div className="p-2 rounded bg-muted/30" data-testid="text-path-4">client/src/components/visuals/AdvancedDiagrams.tsx</div>
                    <div className="p-2 rounded bg-muted/30" data-testid="text-path-4">client/src/components/visuals/TimestepComparisonDiagram.tsx</div>
                    <div className="p-2 rounded bg-muted/30" data-testid="text-path-5">client/src/components/visuals/HydrologicDiagrams.tsx</div>
                    <div className="p-2 rounded bg-muted/30" data-testid="text-path-6">client/src/components/visuals/ClimateInfiltrationDiagrams.tsx</div>
                    <div className="p-2 rounded bg-muted/30" data-testid="text-path-7">client/src/components/visuals/GreenInfraDiagrams.tsx</div>
                    <div className="p-2 rounded bg-muted/30" data-testid="text-path-8">client/src/components/visuals/ArchitecturalDiagrams.tsx</div>
                    <div className="p-2 rounded bg-muted/30" data-testid="text-path-9">client/src/components/visuals/ICMSimulationDiagrams.tsx</div>
                    <div className="p-2 rounded bg-muted/30" data-testid="text-path-10">client/src/components/visuals/InletDiagrams.tsx</div>
                    <div className="p-2 rounded bg-muted/30" data-testid="text-path-11">client/src/data/comparison-data.ts</div>
                    <div className="p-2 rounded bg-muted/30" data-testid="text-path-12">client/public/comparison_tool.py</div>
                    <div className="p-2 rounded bg-muted/30" data-testid="text-path-13">client/src/pages/dashboard.tsx</div>
                  </div>
                </ScrollArea>
              </div>
            </Card>
          </div>
        )}

        {/* References Section */}
        <div className="mt-12 pt-8 border-t border-border">
          <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Sources & References
          </h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h4 className="font-medium text-blue-600 dark:text-blue-400 text-sm uppercase tracking-wide">SWMM 5 References</h4>
              <ul className="space-y-4">
                {KB.swmm5.sources.map((source, i) => (
                  <li key={i} className="group">
                    <a 
                      href={source.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm font-medium hover:text-primary transition-colors flex items-start gap-1"
                    >
                      {source.label}
                      <ExternalLink className="h-3 w-3 mt-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                    {source.notes && (
                      <p className="text-xs text-muted-foreground mt-1 pl-4 border-l-2 border-border">
                        {source.notes}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-medium text-emerald-600 dark:text-emerald-400 text-sm uppercase tracking-wide">InfoWorks ICM References</h4>
              <ul className="space-y-4">
                {KB.icm.sources.map((source, i) => (
                  <li key={i} className="group">
                    <a 
                      href={source.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm font-medium hover:text-primary transition-colors flex items-start gap-1"
                    >
                      {source.label}
                      <ExternalLink className="h-3 w-3 mt-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                    {source.notes && (
                      <p className="text-xs text-muted-foreground mt-1 pl-4 border-l-2 border-border">
                        {source.notes}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <CompanionToolsFooter />
        <VersionTracker />
      </main>
    </div>
  );
}
