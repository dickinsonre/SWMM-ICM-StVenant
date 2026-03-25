import { useState, Component, type ReactNode, type ErrorInfo } from "react";
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
  Landmark,
  MapPin,
  FlaskConical,
  AlertTriangle,
  Star,
  Heart,
  Trash2
} from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { useUnits } from "@/contexts/UnitsContext";
import { useFavorites } from "@/contexts/FavoritesContext";
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
import { NewtonRaphsonConvergence, ThetaWeightingAnimation, StaggeredGridAnimation } from "@/components/visuals/SolverMechanicsExtra";
import { RoutingMethodComparison, TimestepInstabilityAnimation } from "@/components/visuals/SolverOptionsExtra";
import { OutfallTypesAnimation, InflowTypesAnimation, TreatmentAtNodesAnimation, CoefficientConversionAnimation } from "@/components/visuals/BoundaryDiagrams";
import { LIDLayerStackAnimation, NonlinearReservoirAnimation, WidthSensitivityAnimation } from "@/components/visuals/HydrologyExtraDiagrams";
import { CSOModelingAnimation, DetentionPondAnimation, ParallelPipeAnimation, CalibrationVisualAnimation } from "@/components/visuals/ScenarioDiagrams";
import { LoopDetectionAnimation, BoundaryInfluenceAnimation, PerformanceScalingAnimation, WarningMessagesAnimation, SolverEvolutionTimeline, EquationsSideBySideAnimation } from "@/components/visuals/PerformanceDiagrams";
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
  { id: "favorites", label: "Favorites", icon: "star", count: 0 },
  { id: "solver", label: "Solver Mechanics", icon: "cpu", count: 16 },
  { id: "options", label: "Solver Options", icon: "settings", count: 8 },
  { id: "dynwave", label: "Dynamic Wave Options", icon: "zap", count: 10 },
  { id: "temporal", label: "Temporal Dynamics", icon: "clock", count: 6 },
  { id: "controls", label: "Operational Controls", icon: "workflow", count: 3 },
  { id: "advanced", label: "Advanced Analysis", icon: "chart", count: 10 },
  { id: "hydrologic", label: "Hydrologic", icon: "droplet", count: 6 },
  { id: "climate", label: "Climate & Infiltration", icon: "cloud", count: 2 },
  { id: "icm", label: "ICM Simulation", icon: "gauge", count: 17 },
  { id: "inlets", label: "Surface-to-Sewer", icon: "grid", count: 4 },
  { id: "green", label: "Green Infrastructure", icon: "leaf", count: 3 },
  { id: "architecture", label: "Code Architecture", icon: "code", count: 5 },
  { id: "boundary", label: "Boundary Conditions", icon: "mappin", count: 4 },
  { id: "scenarios", label: "Real-World Scenarios", icon: "flask", count: 4 },
  { id: "performance", label: "Performance & Topology", icon: "alert", count: 6 },
  { id: "historical", label: "Historical Engineering", icon: "landmark", count: 13 },
];

function FavoriteButton({ id, className = "" }: { id: string; className?: string }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const fav = isFavorite(id);
  return (
    <button
      onClick={(e) => { e.stopPropagation(); toggleFavorite(id); }}
      className={`absolute top-3 right-3 z-10 p-1.5 rounded-full transition-all ${fav ? "bg-yellow-100 dark:bg-yellow-900/40 text-yellow-500" : "bg-muted/60 text-muted-foreground/40 hover:text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/20"} ${className}`}
      title={fav ? "Remove from favorites" : "Add to favorites"}
      data-testid={`button-favorite-${id}`}
    >
      <Star className={`h-4 w-4 ${fav ? "fill-yellow-500" : ""}`} />
    </button>
  );
}

class DiagramErrorBoundary extends Component<
  { children: ReactNode; name: string },
  { hasError: boolean }
> {
  constructor(props: { children: ReactNode; name: string }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(`Diagram error in ${this.props.name}:`, error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 border border-destructive/30 rounded-lg bg-destructive/5 text-center" data-testid="diagram-error">
          <p className="text-sm text-destructive font-medium">This diagram failed to render</p>
          <button
            className="mt-2 text-xs text-muted-foreground underline"
            onClick={() => this.setState({ hasError: false })}
            data-testid="button-retry-diagram"
          >
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

function Fav({ id, children }: { id: string; children: ReactNode }) {
  return (
    <div className="relative">
      <FavoriteButton id={id} />
      <DiagramErrorBoundary name={id}>
        {children}
      </DiagramErrorBoundary>
    </div>
  );
}

export default function Dashboard() {
  const { theme, toggleTheme } = useTheme();
  const { unitSystem, toggleUnits } = useUnits();
  const { favorites, isFavorite, toggleFavorite, count: favCount, clearAll: clearFavorites } = useFavorites();
  const [activeView, setActiveView] = useState<"visuals" | "topic" | "table" | "source">("visuals");
  const [activeCategory, setActiveCategory] = useState("solver");
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  const DIAGRAM_REGISTRY: { id: string; label: string; category: string; component: ReactNode }[] = [
    { id: "d-discretization", label: "Spatial Discretization", category: "solver", component: <DiscretizationDiagram /> },
    { id: "d-preissmann-slot", label: "Preissmann Slot", category: "solver", component: <PreissmannSlotDiagram /> },
    { id: "d-wave-propagation", label: "Wave Propagation", category: "solver", component: <WavePropagationDiagram /> },
    { id: "d-dry-network", label: "Dry Network", category: "solver", component: <DryNetworkDiagram /> },
    { id: "d-manhole-vs-node", label: "Manhole vs Node", category: "solver", component: <ManholeVsNodeDiagram /> },
    { id: "d-node-area", label: "Node Area", category: "solver", component: <NodeAreaDiagram /> },
    { id: "d-preissmann-calc", label: "Preissmann Slot Calculator", category: "solver", component: <PreissmannSlotCalculator /> },
    { id: "d-mannings-calc", label: "Manning's Flow Calculator", category: "solver", component: <ManningsFlowCalculator /> },
    { id: "d-comp-points", label: "Computational Points", category: "solver", component: <ComputationalPointsDiagram /> },
    { id: "d-surcharge-algo", label: "Surcharge Algorithm", category: "solver", component: <SurchargeAlgorithmDiagram /> },
    { id: "d-live-network", label: "Live Network Comparison", category: "solver", component: <LiveNetworkComparison /> },
    { id: "d-force-main", label: "Force Main Comparison", category: "solver", component: <ForceMainComparison /> },
    { id: "d-backwater", label: "Backwater Propagation", category: "solver", component: <BackwaterPropagation /> },
    { id: "d-newton-raphson", label: "Newton-Raphson Convergence", category: "solver", component: <NewtonRaphsonConvergence /> },
    { id: "d-theta-weighting", label: "Theta Weighting", category: "solver", component: <ThetaWeightingAnimation /> },
    { id: "d-staggered-grid", label: "Staggered Grid", category: "solver", component: <StaggeredGridAnimation /> },
    { id: "d-cfl-stability", label: "CFL Stability", category: "options", component: <CFLStabilityDiagram /> },
    { id: "d-adaptive-timestep", label: "Adaptive Timestep", category: "options", component: <AdaptiveTimestepDiagram /> },
    { id: "d-surcharge-method", label: "Surcharge Method", category: "options", component: <SurchargeMethodDiagram /> },
    { id: "d-theta-param", label: "Theta Parameter", category: "options", component: <ThetaParameterDiagram /> },
    { id: "d-routing-flowchart", label: "Routing Flowchart", category: "options", component: <RoutingMethodFlowchart /> },
    { id: "d-coupling-1d2d", label: "1D-2D Coupling", category: "options", component: <Coupling1D2DDiagram /> },
    { id: "d-routing-comparison", label: "Routing Method Comparison", category: "options", component: <RoutingMethodComparison /> },
    { id: "d-timestep-instability", label: "Timestep Instability", category: "options", component: <TimestepInstabilityAnimation /> },
    { id: "d-inertial-terms", label: "Inertial Terms", category: "dynwave", component: <InertialTermsDiagram /> },
    { id: "d-normal-flow", label: "Normal Flow Criterion", category: "dynwave", component: <NormalFlowCriterionDiagram /> },
    { id: "d-surcharge-deep", label: "Surcharge Deep Dive", category: "dynwave", component: <SurchargeMethodDeepDiveDiagram /> },
    { id: "d-variable-timestep", label: "Variable Timestep", category: "dynwave", component: <VariableTimestepDiagram /> },
    { id: "d-conduit-lengthening", label: "Conduit Lengthening", category: "dynwave", component: <ConduitLengtheningDiagram /> },
    { id: "d-min-nodal-area", label: "Min Nodal Surface Area", category: "dynwave", component: <MinNodalSurfaceAreaDiagram /> },
    { id: "d-convergence-tol", label: "Convergence Tolerances", category: "dynwave", component: <ConvergenceTolerancesDiagram /> },
    { id: "d-parallel-threads", label: "Parallel Threads", category: "dynwave", component: <ParallelThreadsDiagram /> },
    { id: "d-froude-calc", label: "Froude Number Calculator", category: "dynwave", component: <FroudeNumberCalculator /> },
    { id: "d-inertial-calc", label: "Inertial Terms Calculator", category: "dynwave", component: <InertialTermsCalculator /> },
    { id: "d-wave-travel", label: "Wave Travel vs Timestep", category: "temporal", component: <WaveTravelVsTimestepDiagram /> },
    { id: "d-adaptive-sim", label: "Adaptive Timestep Simulator", category: "temporal", component: <AdaptiveTimestepSimulatorDiagram /> },
    { id: "d-conduit-cheat", label: "Conduit Lengthening Cheat Code", category: "temporal", component: <ConduitLengtheningCheatCodeDiagram /> },
    { id: "d-dry-start", label: "Dry Start vs Base Flow", category: "temporal", component: <DryStartVsBaseFlowDiagram /> },
    { id: "d-cfl-calc", label: "CFL Stability Calculator", category: "temporal", component: <CFLStabilityCalculator /> },
    { id: "d-timestep-efficiency", label: "TimeStep Efficiency Estimator", category: "temporal", component: <TimeStepEfficiencyEstimator /> },
    { id: "d-control-logic", label: "Control Logic Builder", category: "controls", component: <ControlLogicBuilderDiagram /> },
    { id: "d-execution-timeline", label: "Execution Timeline", category: "controls", component: <ExecutionTimelineDiagram /> },
    { id: "d-controller-types", label: "Controller Types", category: "controls", component: <ControllerTypesDiagram /> },
    { id: "d-convergence-snap", label: "Convergence Snapshots", category: "advanced", component: <ConvergenceSnapshotsDiagram /> },
    { id: "d-mass-balance", label: "Mass Balance Error", category: "advanced", component: <MassBalanceErrorDiagram /> },
    { id: "d-oscillation", label: "Oscillation Challenge", category: "advanced", component: <OscillationChallengeDiagram /> },
    { id: "d-wetting-front", label: "Wetting Front", category: "advanced", component: <WettingFrontDiagram /> },
    { id: "d-timestep-dash", label: "Timestep Dashboard", category: "advanced", component: <TimestepDashboardDiagram /> },
    { id: "d-solver-decision", label: "Solver Decision Tree", category: "advanced", component: <SolverDecisionTreeDiagram /> },
    { id: "d-timestep-comparison", label: "Timestep Comparison", category: "advanced", component: <TimestepComparisonDiagram /> },
    { id: "d-conduit-sensitivity", label: "Conduit Length Sensitivity", category: "advanced", component: <ConduitLengthSensitivity /> },
    { id: "d-migration-pitfalls", label: "Common Migration Pitfalls", category: "advanced", component: <CommonPitfalls /> },
    { id: "d-runoff-process", label: "Runoff Process", category: "hydrologic", component: <RunoffProcessDiagram /> },
    { id: "d-rtk", label: "RTK Method", category: "hydrologic", component: <RTKDiagram /> },
    { id: "d-buildup-washoff", label: "Buildup & Washoff", category: "hydrologic", component: <BuildupWashoffDiagram /> },
    { id: "d-hydro-workflow", label: "Hydrologic Workflow", category: "hydrologic", component: <HydrologicWorkflowDiagram /> },
    { id: "d-nonlinear-reservoir", label: "Nonlinear Reservoir", category: "hydrologic", component: <NonlinearReservoirAnimation /> },
    { id: "d-width-sensitivity", label: "Width Sensitivity", category: "hydrologic", component: <WidthSensitivityAnimation /> },
    { id: "d-snowmelt", label: "Snowmelt Algorithms", category: "climate", component: <SnowmeltAlgorithmsDiagram /> },
    { id: "d-infiltration", label: "Infiltration Shootout", category: "climate", component: <InfiltrationShootoutDiagram /> },
    { id: "d-baseflow", label: "Base Flow Stability", category: "icm", component: <BaseFlowStabilityDiagram /> },
    { id: "d-spatial-discr", label: "Spatial Discretization (ICM)", category: "icm", component: <SpatialDiscretizationDiagram /> },
    { id: "d-icm-preissmann", label: "ICM Preissmann Slot", category: "icm", component: <ICMPreissmannSlotDiagram /> },
    { id: "d-icm-adaptive", label: "Adaptive Time Stepping (ICM)", category: "icm", component: <AdaptiveTimeSteppingDiagram /> },
    { id: "d-headloss-trans", label: "Headloss Transition", category: "icm", component: <HeadlossTransitionDiagram /> },
    { id: "d-cold-start", label: "Cold Start Initialization", category: "icm", component: <ColdStartInitializationDiagram /> },
    { id: "d-headloss-junction", label: "Headloss Junction", category: "icm", component: <HeadlossJunctionDiagram /> },
    { id: "d-headloss-surcharge", label: "Headloss Surcharge Transition", category: "icm", component: <HeadlossSurchargeTransitionDiagram /> },
    { id: "d-headloss-inference", label: "Headloss Inference", category: "icm", component: <HeadlossInferenceDiagram /> },
    { id: "d-infosewer", label: "InfoSewer Emulation", category: "icm", component: <InfoSewerSteadyStateEmulationDiagram /> },
    { id: "d-surface-flooding", label: "Surface Flooding", category: "icm", component: <SurfaceFloodingDiagram /> },
    { id: "d-three-engine", label: "Three-Engine Comparison", category: "icm", component: <ICMSWMMEngineComparison /> },
    { id: "d-manhole-sim", label: "Manhole Hydraulics Simulator", category: "icm", component: <ICMManholeSimulator /> },
    { id: "d-1d2d-coupling", label: "1D-2D Coupling (ICM)", category: "icm", component: <OneDTwoDCoupling /> },
    { id: "d-manhole-storage", label: "Manhole Storage Volume", category: "icm", component: <ManholeStorageVolume /> },
    { id: "d-flood-type", label: "Flood Type Comparison", category: "icm", component: <FloodTypeComparison /> },
    { id: "d-inlet-element", label: "Inlet Elements", category: "inlets", component: <InletElementDiagram /> },
    { id: "d-hec22", label: "HEC-22 Calculator", category: "inlets", component: <HEC22InletCalculatorDiagram /> },
    { id: "d-flow-transition", label: "Flow Transition", category: "inlets", component: <FlowTransitionDiagram /> },
    { id: "d-inlet-efficiency", label: "Inlet Efficiency Curves", category: "inlets", component: <InletEfficiencyCurvesDiagram /> },
    { id: "d-lid-suds", label: "LID vs SUDS", category: "green", component: <LIDvsSUDSDiagram /> },
    { id: "d-dual-solver", label: "Dual Solver Architecture", category: "green", component: <DualSolverArchitectureDiagram /> },
    { id: "d-lid-layer", label: "LID Layer Stack", category: "green", component: <LIDLayerStackAnimation /> },
    { id: "d-input-parser", label: "Input File Parser", category: "architecture", component: <InputFileParserDiagram /> },
    { id: "d-matrix-solver", label: "Matrix Solver", category: "architecture", component: <MatrixSolverDiagram /> },
    { id: "d-rtc-rules", label: "RTC Rules", category: "architecture", component: <RTCRulesDiagram /> },
    { id: "d-mass-routing", label: "Mass Routing", category: "architecture", component: <MassRoutingDiagram /> },
    { id: "d-surcharge-code", label: "Surcharge Code", category: "architecture", component: <SurchargeCodeDiagram /> },
    { id: "d-gw-exchange", label: "Groundwater Exchange", category: "architecture", component: <GroundwaterExchangeDiagram /> },
    { id: "d-minor-losses", label: "Minor Losses", category: "architecture", component: <MinorLossesDiagram /> },
    { id: "d-reporting", label: "Reporting System", category: "architecture", component: <ReportingSystemDiagram /> },
    { id: "d-outfall-types", label: "Outfall Types", category: "boundary", component: <OutfallTypesAnimation /> },
    { id: "d-inflow-types", label: "Inflow Types", category: "boundary", component: <InflowTypesAnimation /> },
    { id: "d-treatment-nodes", label: "Treatment at Nodes", category: "boundary", component: <TreatmentAtNodesAnimation /> },
    { id: "d-coeff-conversion", label: "Coefficient Conversion", category: "boundary", component: <CoefficientConversionAnimation /> },
    { id: "d-cso", label: "CSO Modeling", category: "scenarios", component: <CSOModelingAnimation /> },
    { id: "d-detention", label: "Detention Pond", category: "scenarios", component: <DetentionPondAnimation /> },
    { id: "d-parallel-pipe", label: "Parallel Pipe Analysis", category: "scenarios", component: <ParallelPipeAnimation /> },
    { id: "d-calibration", label: "Calibration Visual", category: "scenarios", component: <CalibrationVisualAnimation /> },
    { id: "d-loop-detection", label: "Loop Detection", category: "performance", component: <LoopDetectionAnimation /> },
    { id: "d-boundary-influence", label: "Boundary Influence", category: "performance", component: <BoundaryInfluenceAnimation /> },
    { id: "d-perf-scaling", label: "Performance Scaling", category: "performance", component: <PerformanceScalingAnimation /> },
    { id: "d-warnings", label: "Warning Messages Decoded", category: "performance", component: <WarningMessagesAnimation /> },
    { id: "d-solver-evolution", label: "Solver Evolution Timeline", category: "performance", component: <SolverEvolutionTimeline /> },
    { id: "d-equations", label: "Saint-Venant Equations", category: "performance", component: <EquationsSideBySideAnimation /> },
    { id: "d-roman-aqueduct", label: "Roman Aqueduct", category: "historical", component: <RomanAqueductAnimation /> },
    { id: "d-dujiangyan", label: "Dujiangyan", category: "historical", component: <DujiangyanAnimation /> },
    { id: "d-inca-fountain", label: "Inca Fountains", category: "historical", component: <IncaFountainAnimation /> },
    { id: "d-persian-qanat", label: "Persian Qanat", category: "historical", component: <PersianQanatAnimation /> },
    { id: "d-indian-stepwell", label: "Indian Stepwell", category: "historical", component: <IndianStepwellAnimation /> },
    { id: "d-aztec-dike", label: "Aztec Dike", category: "historical", component: <AztecDikeAnimation /> },
    { id: "d-dutch-polder", label: "Dutch Polder", category: "historical", component: <DutchPolderAnimation /> },
    { id: "d-roman-siphon", label: "Roman Siphon", category: "historical", component: <RomanSiphonAnimation /> },
    { id: "d-maya-filtration", label: "Maya Filtration", category: "historical", component: <MayaFiltrationAnimation /> },
    { id: "d-khmer-baray", label: "Khmer Baray", category: "historical", component: <KhmerBarayAnimation /> },
    { id: "d-cloaca-maxima", label: "Cloaca Maxima", category: "historical", component: <CloacaMaximaAnimation /> },
    { id: "d-indus-valley", label: "Indus Valley Drains", category: "historical", component: <IndusValleyDrainAnimation /> },
    { id: "d-archimedes-screw", label: "Archimedes Screw", category: "historical", component: <ArchimedesScrewAnimation /> },
  ];

  const favoritedDiagrams = DIAGRAM_REGISTRY.filter(d => isFavorite(d.id));
  const favoritedTopics = TOPIC_ORDER.filter(t => isFavorite(`t-${t.key}`));

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
                <Badge variant="destructive" className="text-sm px-2 py-0.5 font-bold" data-testid="badge-diagram-count">118 Interactive Diagrams</Badge>
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
              variant={unitSystem === "SI" ? "default" : "outline"}
              size="sm"
              onClick={toggleUnits}
              title={`Switch to ${unitSystem === "USA" ? "SI (metric)" : "USA (imperial)"} units`}
              data-testid="button-units-toggle"
              className="font-mono text-xs px-2 h-8 min-w-[70px]"
            >
              {unitSystem === "USA" ? "USA" : "SI"}
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
                 const IconComponent = cat.id === "favorites" ? Star :
                                       cat.id === "solver" ? Cpu : 
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
                                      cat.id === "boundary" ? MapPin :
                                      cat.id === "scenarios" ? FlaskConical :
                                      cat.id === "performance" ? AlertTriangle :
                                      cat.id === "historical" ? Landmark : Code;
                 const displayCount = cat.id === "favorites" ? favCount : cat.count;
                 return (
                   <Button
                     key={cat.id}
                     variant={activeCategory === cat.id ? "default" : (cat.id === "favorites" && favCount > 0) ? "secondary" : "outline"}
                     size="sm"
                     onClick={() => setActiveCategory(cat.id)}
                     className={`flex items-center gap-2 ${cat.id === "favorites" && favCount > 0 ? "border-yellow-300 dark:border-yellow-700" : ""}`}
                     data-testid={`button-category-${cat.id}`}
                   >
                     <IconComponent className={`h-4 w-4 ${cat.id === "favorites" && favCount > 0 ? "fill-yellow-500 text-yellow-500" : ""}`} />
                     {cat.label}
                     {cat.id === "favorites" && favCount > 0 && (
                       <Badge variant="destructive" className="text-[10px] px-1.5 py-0 ml-1 h-4 min-w-[18px] flex items-center justify-center">{favCount}</Badge>
                     )}
                     {activeCategory === cat.id && cat.id !== "favorites" && <ChevronRight className="h-3 w-3 ml-1" />}
                   </Button>
                 );
               })}
             </div>

             {/* Favorites */}
             {activeCategory === "favorites" && (
               <div className="space-y-6" data-testid="section-favorites">
                 <div className="mb-4 flex items-center justify-between">
                   <div>
                     <h3 className="text-2xl font-bold tracking-tight mb-2 flex items-center gap-2">
                       <Star className="h-6 w-6 text-yellow-500 fill-yellow-500" />
                       Your Favorites
                     </h3>
                     <p className="text-muted-foreground">Quick access to your saved diagrams and comparisons. Click the star on any diagram or topic to add it here.</p>
                   </div>
                   {favCount > 0 && (
                     <Button variant="outline" size="sm" onClick={clearFavorites} className="gap-2 text-destructive hover:text-destructive" data-testid="button-clear-favorites">
                       <Trash2 className="h-3.5 w-3.5" />
                       Clear All
                     </Button>
                   )}
                 </div>
                 {favCount === 0 ? (
                   <Card className="p-12 text-center border-dashed">
                     <Star className="h-12 w-12 mx-auto mb-4 text-muted-foreground/30" />
                     <h4 className="text-lg font-semibold mb-2">No favorites yet</h4>
                     <p className="text-sm text-muted-foreground max-w-md mx-auto">
                       Click the star icon on any diagram or comparison topic to save it here for quick access.
                     </p>
                   </Card>
                 ) : (
                   <>
                     {favoritedDiagrams.length > 0 && (
                       <div>
                         <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                           <BarChart2 className="h-4 w-4" />
                           Saved Diagrams ({favoritedDiagrams.length})
                         </h4>
                         <div className="grid md:grid-cols-1 gap-6">
                           {favoritedDiagrams.map(d => (
                             <Fav key={d.id} id={d.id}>
                               <div>
                                 <Badge variant="secondary" className="mb-2 text-[10px]">{DIAGRAM_CATEGORIES.find(c => c.id === d.category)?.label}</Badge>
                                 {d.component}
                               </div>
                             </Fav>
                           ))}
                         </div>
                       </div>
                     )}
                     {favoritedTopics.length > 0 && (
                       <div>
                         <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                           <BookOpen className="h-4 w-4" />
                           Saved Comparisons ({favoritedTopics.length})
                         </h4>
                         <Accordion type="single" collapsible className="w-full space-y-4">
                           {favoritedTopics.map(topic => (
                             <AccordionItem key={topic.key} value={topic.key} className="border border-border rounded-lg bg-card px-4 shadow-sm overflow-hidden">
                               <AccordionTrigger className="hover:no-underline py-4">
                                 <div className="flex items-center gap-3 text-left flex-1">
                                   <button
                                     onClick={(e) => { e.stopPropagation(); toggleFavorite(`t-${topic.key}`); }}
                                     className="p-1 rounded-full bg-yellow-100 dark:bg-yellow-900/40 text-yellow-500"
                                     data-testid={`button-unfav-topic-${topic.key}`}
                                   >
                                     <Star className="h-3.5 w-3.5 fill-yellow-500" />
                                   </button>
                                   <span className="font-semibold text-lg">{topic.label}</span>
                                 </div>
                               </AccordionTrigger>
                               <AccordionContent className="pb-6 pt-2">
                                 <div className="grid md:grid-cols-2 gap-8 relative">
                                   <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-border -translate-x-1/2"></div>
                                   <div className="space-y-3">
                                     <h4 className="font-medium text-sm text-blue-600 dark:text-blue-400 flex items-center gap-2">
                                       <span className="h-1.5 w-1.5 rounded-full bg-blue-500"></span>
                                       SWMM 5
                                     </h4>
                                     <ul className="space-y-3">
                                       {(KB.swmm5.topics as any)[topic.key].map((point: string, i: number) => (
                                         <li key={i} className="text-sm text-muted-foreground leading-relaxed pl-4 border-l-2 border-border/50">{point}</li>
                                       ))}
                                     </ul>
                                   </div>
                                   <div className="space-y-3">
                                     <h4 className="font-medium text-sm text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                                       <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                                       InfoWorks ICM
                                     </h4>
                                     <ul className="space-y-3">
                                       {(KB.icm.topics as any)[topic.key].map((point: string, i: number) => (
                                         <li key={i} className="text-sm text-muted-foreground leading-relaxed pl-4 border-l-2 border-border/50">{point}</li>
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
                   </>
                 )}
               </div>
             )}

             {/* Solver Mechanics */}
             {activeCategory === "solver" && (
               <div className="space-y-6" data-testid="section-solver">
                 <div className="mb-4">
                   <h3 className="text-2xl font-bold tracking-tight mb-2">Solver Mechanics</h3>
                   <p className="text-muted-foreground">Core discretization and fundamental solver architecture differences.</p>
                 </div>
                 <div className="grid md:grid-cols-2 gap-6">
                    <Fav id="d-discretization"><DiscretizationDiagram /></Fav>
                    <Fav id="d-preissmann-slot"><PreissmannSlotDiagram /></Fav>
                 </div>
                 <div className="grid md:grid-cols-2 gap-6">
                    <Fav id="d-wave-propagation"><WavePropagationDiagram /></Fav>
                    <Fav id="d-dry-network"><DryNetworkDiagram /></Fav>
                 </div>
                 <div className="grid md:grid-cols-1 gap-6">
                    <Fav id="d-manhole-vs-node"><ManholeVsNodeDiagram /></Fav>
                 </div>
                 <div className="grid md:grid-cols-1 gap-6 max-w-3xl mx-auto">
                    <Fav id="d-node-area"><NodeAreaDiagram /></Fav>
                 </div>
                 <div className="mt-6 mb-4">
                   <h4 className="text-xl font-bold tracking-tight mb-2">Interactive Calculators</h4>
                   <p className="text-muted-foreground text-sm">Hands-on tools to explore solver differences and build intuition.</p>
                 </div>
                 <div className="grid md:grid-cols-1 gap-6">
                    <Fav id="d-preissmann-calc"><PreissmannSlotCalculator /></Fav>
                    <Fav id="d-mannings-calc"><ManningsFlowCalculator /></Fav>
                    <Fav id="d-comp-points"><ComputationalPointsDiagram /></Fav>
                    <Fav id="d-surcharge-algo"><SurchargeAlgorithmDiagram /></Fav>
                 </div>
                 <div className="mt-6 mb-4">
                   <h4 className="text-xl font-bold tracking-tight mb-2">Network-Level Simulation</h4>
                   <p className="text-muted-foreground text-sm">Watch how the same network behaves under each solver and explore force main differences.</p>
                 </div>
                 <div className="grid md:grid-cols-1 gap-6">
                    <Fav id="d-live-network"><LiveNetworkComparison /></Fav>
                    <Fav id="d-force-main"><ForceMainComparison /></Fav>
                 </div>
                 <div className="mt-6 mb-4">
                   <h4 className="text-xl font-bold tracking-tight mb-2">Backwater Effects</h4>
                   <p className="text-muted-foreground text-sm">How downstream boundary changes propagate upstream through each solver's computational grid.</p>
                 </div>
                 <div className="grid md:grid-cols-1 gap-6">
                    <Fav id="d-backwater"><BackwaterPropagation /></Fav>
                 </div>
                 <div className="mt-6 mb-4">
                   <h4 className="text-xl font-bold tracking-tight mb-2">Numerical Methods Deep Dive</h4>
                   <p className="text-muted-foreground text-sm">Convergence behavior, weighting schemes, and computational grid differences between the two solvers.</p>
                 </div>
                 <div className="grid md:grid-cols-1 gap-6">
                    <Fav id="d-newton-raphson"><NewtonRaphsonConvergence /></Fav>
                    <Fav id="d-theta-weighting"><ThetaWeightingAnimation /></Fav>
                    <Fav id="d-staggered-grid"><StaggeredGridAnimation /></Fav>
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
                    <Fav id="d-cfl-stability"><CFLStabilityDiagram /></Fav>
                    <Fav id="d-adaptive-timestep"><AdaptiveTimestepDiagram /></Fav>
                 </div>
                 <div className="grid md:grid-cols-2 gap-6">
                    <Fav id="d-surcharge-method"><SurchargeMethodDiagram /></Fav>
                    <Fav id="d-theta-param"><ThetaParameterDiagram /></Fav>
                 </div>
                 <div className="grid md:grid-cols-2 gap-6">
                    <Fav id="d-routing-flowchart"><RoutingMethodFlowchart /></Fav>
                    <Fav id="d-coupling-1d2d"><Coupling1D2DDiagram /></Fav>
                 </div>
                 <div className="mt-6 mb-4">
                   <h4 className="text-xl font-bold tracking-tight mb-2">Routing & Stability Analysis</h4>
                   <p className="text-muted-foreground text-sm">Compare routing methods side-by-side and explore what happens when timesteps are too large.</p>
                 </div>
                 <div className="grid md:grid-cols-1 gap-6">
                    <Fav id="d-routing-comparison"><RoutingMethodComparison /></Fav>
                    <Fav id="d-timestep-instability"><TimestepInstabilityAnimation /></Fav>
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
                    <Fav id="d-convergence-snap"><ConvergenceSnapshotsDiagram /></Fav>
                    <Fav id="d-mass-balance"><MassBalanceErrorDiagram /></Fav>
                 </div>
                 <div className="grid md:grid-cols-2 gap-6">
                    <Fav id="d-oscillation"><OscillationChallengeDiagram /></Fav>
                    <Fav id="d-wetting-front"><WettingFrontDiagram /></Fav>
                 </div>
                 <div className="grid md:grid-cols-2 gap-6">
                    <Fav id="d-timestep-dash"><TimestepDashboardDiagram /></Fav>
                    <Fav id="d-solver-decision"><SolverDecisionTreeDiagram /></Fav>
                 </div>
                 <div className="grid md:grid-cols-1 gap-6">
                    <Fav id="d-timestep-comparison"><TimestepComparisonDiagram /></Fav>
                 </div>
                 <div className="mt-6 mb-4">
                   <h4 className="text-xl font-bold tracking-tight mb-2">Conduit Discretization Impact</h4>
                   <p className="text-muted-foreground text-sm">How conduit length and element count affect accuracy.</p>
                 </div>
                 <div className="grid md:grid-cols-1 gap-6">
                    <Fav id="d-conduit-sensitivity"><ConduitLengthSensitivity /></Fav>
                 </div>
                 <div className="mt-6 mb-4">
                   <h4 className="text-xl font-bold tracking-tight mb-2">Migration Pitfalls</h4>
                   <p className="text-muted-foreground text-sm">Common mistakes when comparing or converting between solvers.</p>
                 </div>
                 <div className="grid md:grid-cols-1 gap-6">
                    <Fav id="d-migration-pitfalls"><CommonPitfalls /></Fav>
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
                    <Fav id="d-hydro-workflow"><HydrologicWorkflowDiagram /></Fav>
                 </div>
                 <div className="grid md:grid-cols-2 gap-6">
                    <Fav id="d-runoff-process"><RunoffProcessDiagram /></Fav>
                    <Fav id="d-rtk"><RTKDiagram /></Fav>
                 </div>
                 <div className="grid md:grid-cols-1 gap-6">
                    <Fav id="d-buildup-washoff"><BuildupWashoffDiagram /></Fav>
                 </div>
                 <div className="mt-6 mb-4">
                   <h4 className="text-xl font-bold tracking-tight mb-2">Subcatchment Runoff Mechanics</h4>
                   <p className="text-muted-foreground text-sm">The nonlinear reservoir model and how width controls hydrograph shape.</p>
                 </div>
                 <div className="grid md:grid-cols-1 gap-6">
                    <Fav id="d-nonlinear-reservoir"><NonlinearReservoirAnimation /></Fav>
                    <Fav id="d-width-sensitivity"><WidthSensitivityAnimation /></Fav>
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
                    <Fav id="d-snowmelt"><SnowmeltAlgorithmsDiagram /></Fav>
                    <Fav id="d-infiltration"><InfiltrationShootoutDiagram /></Fav>
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
                    <Fav id="d-lid-suds"><LIDvsSUDSDiagram /></Fav>
                 </div>
                 <div className="grid md:grid-cols-1 gap-6">
                    <Fav id="d-dual-solver"><DualSolverArchitectureDiagram /></Fav>
                 </div>
                 <div className="mt-6 mb-4">
                   <h4 className="text-xl font-bold tracking-tight mb-2">LID Layer Mechanics</h4>
                   <p className="text-muted-foreground text-sm">Interactive cross-section of a bio-retention cell showing infiltration, storage, and underdrain processes.</p>
                 </div>
                 <div className="grid md:grid-cols-1 gap-6">
                    <Fav id="d-lid-layer"><LIDLayerStackAnimation /></Fav>
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
                    <Fav id="d-baseflow"><BaseFlowStabilityDiagram /></Fav>
                    <Fav id="d-spatial-discr"><SpatialDiscretizationDiagram /></Fav>
                    <Fav id="d-icm-preissmann"><ICMPreissmannSlotDiagram /></Fav>
                    <Fav id="d-icm-adaptive"><AdaptiveTimeSteppingDiagram /></Fav>
                    <Fav id="d-headloss-trans"><HeadlossTransitionDiagram /></Fav>
                    <Fav id="d-cold-start"><ColdStartInitializationDiagram /></Fav>
                 </div>
                 <div className="mt-6 mb-4">
                   <h4 className="text-xl font-bold tracking-tight mb-2">Junction Headloss Mechanics</h4>
                   <p className="text-muted-foreground text-sm">Physics of energy loss at junctions and transitions.</p>
                 </div>
                 <div className="grid md:grid-cols-1 gap-6">
                    <Fav id="d-headloss-junction"><HeadlossJunctionDiagram /></Fav>
                    <Fav id="d-headloss-surcharge"><HeadlossSurchargeTransitionDiagram /></Fav>
                    <Fav id="d-headloss-inference"><HeadlossInferenceDiagram /></Fav>
                 </div>
                 <div className="mt-6 mb-4">
                   <h4 className="text-xl font-bold tracking-tight mb-2">Model Translation & Workflows</h4>
                   <p className="text-muted-foreground text-sm">Bridging workflows between InfoSewer and ICM.</p>
                 </div>
                 <div className="grid md:grid-cols-1 gap-6">
                    <Fav id="d-infosewer"><InfoSewerSteadyStateEmulationDiagram /></Fav>
                 </div>
                 <div className="mt-6 mb-4">
                   <h4 className="text-xl font-bold tracking-tight mb-2">Surface Flooding Approach</h4>
                   <p className="text-muted-foreground text-sm">Compare SWMM5's ponded area vs ICM's full 2D mesh for overland flow.</p>
                 </div>
                 <div className="grid md:grid-cols-1 gap-6">
                    <Fav id="d-surface-flooding"><SurfaceFloodingDiagram /></Fav>
                 </div>
                 <div className="mt-6 mb-4">
                   <h4 className="text-xl font-bold tracking-tight mb-2">Three-Engine Comparison</h4>
                   <p className="text-muted-foreground text-sm">EPA SWMM5 vs ICM SWMM (embedded) vs ICM InfoWorks (native) — which engine to use when.</p>
                 </div>
                 <div className="grid md:grid-cols-1 gap-6">
                    <Fav id="d-three-engine"><ICMSWMMEngineComparison /></Fav>
                 </div>
                 <div className="mt-6 mb-4">
                   <h4 className="text-xl font-bold tracking-tight mb-2">Manhole Hydraulics Simulator</h4>
                   <p className="text-muted-foreground text-sm">Interactive ICM manhole with inlet/outlet pipes, gate valve, and head-driven orifice outflow — watch the water level respond in real time.</p>
                 </div>
                 <div className="grid md:grid-cols-1 gap-6">
                    <Fav id="d-manhole-sim"><ICMManholeSimulator /></Fav>
                 </div>
                 <div className="mt-6 mb-4">
                   <h4 className="text-xl font-bold tracking-tight mb-2">1D-2D Coupling</h4>
                   <p className="text-muted-foreground text-sm">ICM's signature capability — coupling underground pipe networks with surface flood routing.</p>
                 </div>
                 <div className="grid md:grid-cols-1 gap-6">
                    <Fav id="d-1d2d-coupling"><OneDTwoDCoupling /></Fav>
                 </div>
                 <div className="mt-6 mb-4">
                   <h4 className="text-xl font-bold tracking-tight mb-2">Storage & Flooding</h4>
                   <p className="text-muted-foreground text-sm">How each solver computes manhole storage volume and handles surface flooding.</p>
                 </div>
                 <div className="grid md:grid-cols-2 gap-6">
                    <Fav id="d-manhole-storage"><ManholeStorageVolume /></Fav>
                    <Fav id="d-flood-type"><FloodTypeComparison /></Fav>
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
                    <Fav id="d-inertial-terms"><InertialTermsDiagram /></Fav>
                    <Fav id="d-normal-flow"><NormalFlowCriterionDiagram /></Fav>
                    <Fav id="d-surcharge-deep"><SurchargeMethodDeepDiveDiagram /></Fav>
                 </div>
                 <div className="mt-6 mb-4">
                   <h4 className="text-xl font-bold tracking-tight mb-2">Timestep & Stability Controls</h4>
                   <p className="text-muted-foreground text-sm">Parameters that govern computational timesteps and numerical stability.</p>
                 </div>
                 <div className="grid md:grid-cols-1 gap-6">
                    <Fav id="d-variable-timestep"><VariableTimestepDiagram /></Fav>
                    <Fav id="d-conduit-lengthening"><ConduitLengtheningDiagram /></Fav>
                    <Fav id="d-min-nodal-area"><MinNodalSurfaceAreaDiagram /></Fav>
                 </div>
                 <div className="mt-6 mb-4">
                   <h4 className="text-xl font-bold tracking-tight mb-2">Solver Performance</h4>
                   <p className="text-muted-foreground text-sm">Convergence settings and parallel processing options.</p>
                 </div>
                 <div className="grid md:grid-cols-1 gap-6">
                    <Fav id="d-convergence-tol"><ConvergenceTolerancesDiagram /></Fav>
                    <Fav id="d-parallel-threads"><ParallelThreadsDiagram /></Fav>
                 </div>
                 <div className="mt-6 mb-4">
                   <h4 className="text-xl font-bold tracking-tight mb-2">Interactive Calculators</h4>
                   <p className="text-muted-foreground text-sm">Explore flow regime behavior and momentum equation effects.</p>
                 </div>
                 <div className="grid md:grid-cols-1 gap-6">
                    <Fav id="d-froude-calc"><FroudeNumberCalculator /></Fav>
                    <Fav id="d-inertial-calc"><InertialTermsCalculator /></Fav>
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
                    <Fav id="d-wave-travel"><WaveTravelVsTimestepDiagram /></Fav>
                    <Fav id="d-adaptive-sim"><AdaptiveTimestepSimulatorDiagram /></Fav>
                 </div>
                 <div className="mt-6 mb-4">
                   <h4 className="text-xl font-bold tracking-tight mb-2">Stability Techniques</h4>
                   <p className="text-muted-foreground text-sm">How solvers maintain stability through lengthening and base flow.</p>
                 </div>
                 <div className="grid md:grid-cols-1 gap-6">
                    <Fav id="d-conduit-cheat"><ConduitLengtheningCheatCodeDiagram /></Fav>
                    <Fav id="d-dry-start"><DryStartVsBaseFlowDiagram /></Fav>
                 </div>
                 <div className="mt-6 mb-4">
                   <h4 className="text-xl font-bold tracking-tight mb-2">Interactive Calculators</h4>
                   <p className="text-muted-foreground text-sm">Calculate CFL numbers and estimate simulation efficiency.</p>
                 </div>
                 <div className="grid md:grid-cols-1 gap-6">
                    <Fav id="d-cfl-calc"><CFLStabilityCalculator /></Fav>
                    <Fav id="d-timestep-efficiency"><TimeStepEfficiencyEstimator /></Fav>
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
                    <Fav id="d-control-logic"><ControlLogicBuilderDiagram /></Fav>
                    <Fav id="d-execution-timeline"><ExecutionTimelineDiagram /></Fav>
                 </div>
                 <div className="mt-6 mb-4">
                   <h4 className="text-xl font-bold tracking-tight mb-2">Controller Sophistication</h4>
                   <p className="text-muted-foreground text-sm">From simple on/off to advanced PID and incremental control.</p>
                 </div>
                 <div className="grid md:grid-cols-1 gap-6">
                    <Fav id="d-controller-types"><ControllerTypesDiagram /></Fav>
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
                    <Fav id="d-inlet-element"><InletElementDiagram /></Fav>
                    <Fav id="d-hec22"><HEC22InletCalculatorDiagram /></Fav>
                    <Fav id="d-flow-transition"><FlowTransitionDiagram /></Fav>
                    <Fav id="d-inlet-efficiency"><InletEfficiencyCurvesDiagram /></Fav>
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
                    <Fav id="d-input-parser"><InputFileParserDiagram /></Fav>
                    <Fav id="d-matrix-solver"><MatrixSolverDiagram /></Fav>
                 </div>
                 <div className="grid md:grid-cols-2 gap-6">
                    <Fav id="d-rtc-rules"><RTCRulesDiagram /></Fav>
                    <Fav id="d-mass-routing"><MassRoutingDiagram /></Fav>
                 </div>
                 <div className="grid md:grid-cols-2 gap-6">
                    <Fav id="d-surcharge-code"><SurchargeCodeDiagram /></Fav>
                    <Fav id="d-gw-exchange"><GroundwaterExchangeDiagram /></Fav>
                 </div>
                 <div className="grid md:grid-cols-2 gap-6">
                    <Fav id="d-minor-losses"><MinorLossesDiagram /></Fav>
                    <Fav id="d-reporting"><ReportingSystemDiagram /></Fav>
                 </div>
               </div>
             )}

             {/* Boundary Conditions */}
             {activeCategory === "boundary" && (
               <div className="space-y-6" data-testid="section-boundary">
                 <div className="mb-4">
                   <h3 className="text-2xl font-bold tracking-tight mb-2">Boundary Conditions & Data Exchange</h3>
                   <p className="text-muted-foreground">Outfall types, inflow definitions, treatment functions, and the critical coefficient conversions between solvers.</p>
                 </div>
                 <div className="mt-6 mb-4">
                   <h4 className="text-xl font-bold tracking-tight mb-2">Outfall & Inflow Definitions</h4>
                   <p className="text-muted-foreground text-sm">How each solver defines system boundaries — outfall types and node inflow components.</p>
                 </div>
                 <div className="grid md:grid-cols-1 gap-6">
                    <Fav id="d-outfall-types"><OutfallTypesAnimation /></Fav>
                    <Fav id="d-inflow-types"><InflowTypesAnimation /></Fav>
                 </div>
                 <div className="mt-6 mb-4">
                   <h4 className="text-xl font-bold tracking-tight mb-2">Water Quality Treatment</h4>
                   <p className="text-muted-foreground text-sm">How treatment functions reduce pollutant concentrations at nodes.</p>
                 </div>
                 <div className="grid md:grid-cols-1 gap-6">
                    <Fav id="d-treatment-nodes"><TreatmentAtNodesAnimation /></Fav>
                 </div>
                 <div className="mt-6 mb-4">
                   <h4 className="text-xl font-bold tracking-tight mb-2">Coefficient Conversion Cheat Sheet</h4>
                   <p className="text-muted-foreground text-sm">The TOP 5 mistakes when converting models between SWMM5 and ICM — and how to fix them.</p>
                 </div>
                 <div className="grid md:grid-cols-1 gap-6">
                    <Fav id="d-coeff-conversion"><CoefficientConversionAnimation /></Fav>
                 </div>
               </div>
             )}

             {/* Real-World Scenarios */}
             {activeCategory === "scenarios" && (
               <div className="space-y-6" data-testid="section-scenarios">
                 <div className="mb-4">
                   <h3 className="text-2xl font-bold tracking-tight mb-2">Real-World Scenarios</h3>
                   <p className="text-muted-foreground">Practical modeling scenarios connecting theory to practice — CSO events, detention design, pipe sizing, and calibration.</p>
                 </div>
                 <div className="grid md:grid-cols-1 gap-6">
                    <Fav id="d-cso"><CSOModelingAnimation /></Fav>
                    <Fav id="d-detention"><DetentionPondAnimation /></Fav>
                 </div>
                 <div className="mt-6 mb-4">
                   <h4 className="text-xl font-bold tracking-tight mb-2">Pipe Design & Calibration</h4>
                   <p className="text-muted-foreground text-sm">Parallel pipe analysis and interactive model calibration.</p>
                 </div>
                 <div className="grid md:grid-cols-1 gap-6">
                    <Fav id="d-parallel-pipe"><ParallelPipeAnimation /></Fav>
                    <Fav id="d-calibration"><CalibrationVisualAnimation /></Fav>
                 </div>
               </div>
             )}

             {/* Performance & Topology */}
             {activeCategory === "performance" && (
               <div className="space-y-6" data-testid="section-performance">
                 <div className="mb-4">
                   <h3 className="text-2xl font-bold tracking-tight mb-2">Performance, Topology & Diagnostics</h3>
                   <p className="text-muted-foreground">Network topology handling, computational scaling, warning message decoding, solver evolution, and the full Saint-Venant equations.</p>
                 </div>
                 <div className="mt-6 mb-4">
                   <h4 className="text-xl font-bold tracking-tight mb-2">Network Topology</h4>
                   <p className="text-muted-foreground text-sm">How solvers handle loops and flow regime transitions.</p>
                 </div>
                 <div className="grid md:grid-cols-1 gap-6">
                    <Fav id="d-loop-detection"><LoopDetectionAnimation /></Fav>
                    <Fav id="d-boundary-influence"><BoundaryInfluenceAnimation /></Fav>
                 </div>
                 <div className="mt-6 mb-4">
                   <h4 className="text-xl font-bold tracking-tight mb-2">Computational Performance</h4>
                   <p className="text-muted-foreground text-sm">How computation time scales with network size and common warning messages decoded.</p>
                 </div>
                 <div className="grid md:grid-cols-1 gap-6">
                    <Fav id="d-perf-scaling"><PerformanceScalingAnimation /></Fav>
                    <Fav id="d-warnings"><WarningMessagesAnimation /></Fav>
                 </div>
                 <div className="mt-6 mb-4">
                   <h4 className="text-xl font-bold tracking-tight mb-2">Solver History & Equations</h4>
                   <p className="text-muted-foreground text-sm">The evolution of hydraulic solvers from 1971 to today, and the complete Saint-Venant equations compared.</p>
                 </div>
                 <div className="grid md:grid-cols-1 gap-6">
                    <Fav id="d-solver-evolution"><SolverEvolutionTimeline /></Fav>
                    <Fav id="d-equations"><EquationsSideBySideAnimation /></Fav>
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
                    <Fav id="d-roman-aqueduct"><RomanAqueductAnimation /></Fav>
                 </div>
                 <div className="grid md:grid-cols-1 gap-6">
                    <Fav id="d-dujiangyan"><DujiangyanAnimation /></Fav>
                 </div>
                 <div className="grid md:grid-cols-1 gap-6">
                    <Fav id="d-inca-fountain"><IncaFountainAnimation /></Fav>
                 </div>
                 <div className="mt-6 mb-4">
                   <h4 className="text-xl font-bold tracking-tight mb-2">Underground & Groundwater</h4>
                   <p className="text-muted-foreground text-sm">Ingenious systems for tapping aquifers and accessing water tables.</p>
                 </div>
                 <div className="grid md:grid-cols-1 gap-6">
                    <Fav id="d-persian-qanat"><PersianQanatAnimation /></Fav>
                 </div>
                 <div className="grid md:grid-cols-1 gap-6">
                    <Fav id="d-indian-stepwell"><IndianStepwellAnimation /></Fav>
                 </div>
                 <div className="mt-6 mb-4">
                   <h4 className="text-xl font-bold tracking-tight mb-2">Flood Control</h4>
                   <p className="text-muted-foreground text-sm">How ancient engineers protected cities from floods using dikes, polders, and passive flow control.</p>
                 </div>
                 <div className="grid md:grid-cols-1 gap-6">
                    <Fav id="d-aztec-dike"><AztecDikeAnimation /></Fav>
                 </div>
                 <div className="grid md:grid-cols-1 gap-6">
                    <Fav id="d-dutch-polder"><DutchPolderAnimation /></Fav>
                 </div>
                 <div className="mt-6 mb-4">
                   <h4 className="text-xl font-bold tracking-tight mb-2">Pressure Flow</h4>
                   <p className="text-muted-foreground text-sm">Pressurized pipe systems that predate modern force main engineering.</p>
                 </div>
                 <div className="grid md:grid-cols-1 gap-6">
                    <Fav id="d-roman-siphon"><RomanSiphonAnimation /></Fav>
                 </div>
                 <div className="mt-6 mb-4">
                   <h4 className="text-xl font-bold tracking-tight mb-2">Water Treatment & Storage</h4>
                   <p className="text-muted-foreground text-sm">Filtration, reservoir management, and water quality — solved millennia ago.</p>
                 </div>
                 <div className="grid md:grid-cols-1 gap-6">
                    <Fav id="d-maya-filtration"><MayaFiltrationAnimation /></Fav>
                 </div>
                 <div className="grid md:grid-cols-1 gap-6">
                    <Fav id="d-khmer-baray"><KhmerBarayAnimation /></Fav>
                 </div>
                 <div className="mt-6 mb-4">
                   <h4 className="text-xl font-bold tracking-tight mb-2">Sanitation & Drainage</h4>
                   <p className="text-muted-foreground text-sm">The world's first sewers and urban drainage networks — some still in operation.</p>
                 </div>
                 <div className="grid md:grid-cols-1 gap-6">
                    <Fav id="d-cloaca-maxima"><CloacaMaximaAnimation /></Fav>
                 </div>
                 <div className="grid md:grid-cols-1 gap-6">
                    <Fav id="d-indus-valley"><IndusValleyDrainAnimation /></Fav>
                 </div>
                 <div className="mt-6 mb-4">
                   <h4 className="text-xl font-bold tracking-tight mb-2">Water Lifting</h4>
                   <p className="text-muted-foreground text-sm">Mechanical pumping technology that hasn't been improved in 2,200 years.</p>
                 </div>
                 <div className="grid md:grid-cols-1 gap-6">
                    <Fav id="d-archimedes-screw"><ArchimedesScrewAnimation /></Fav>
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
                      <button
                        onClick={(e) => { e.stopPropagation(); toggleFavorite(`t-${topic.key}`); }}
                        className={`p-1.5 rounded-full transition-colors shrink-0 ${isFavorite(`t-${topic.key}`) ? "bg-yellow-100 dark:bg-yellow-900/40 text-yellow-500" : "bg-muted text-muted-foreground hover:text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/20"}`}
                        data-testid={`button-fav-topic-${topic.key}`}
                      >
                        <Star className={`h-3.5 w-3.5 ${isFavorite(`t-${topic.key}`) ? "fill-yellow-500" : ""}`} />
                      </button>
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
                          <button
                            onClick={() => toggleFavorite(`t-${topic.key}`)}
                            className={`p-1 rounded-full transition-colors shrink-0 ${isFavorite(`t-${topic.key}`) ? "text-yellow-500" : "text-muted-foreground/40 hover:text-yellow-500"}`}
                            data-testid={`button-table-fav-${topic.key}`}
                          >
                            <Star className={`h-3.5 w-3.5 ${isFavorite(`t-${topic.key}`) ? "fill-yellow-500" : ""}`} />
                          </button>
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
