import { useState, useMemo, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { 
  HelpCircle, 
  Zap, 
  DollarSign, 
  Network, 
  Droplets, 
  Clock, 
  Settings2, 
  CheckCircle2, 
  AlertTriangle,
  ArrowRight,
  Waves,
  Building2,
  TreePine,
  BarChart2
} from "lucide-react";

type Factor = {
  id: string;
  label: string;
  description: string;
  icon: ReactNode;
  swmmWeight: number;
  icmWeight: number;
};

export function DecisionEngineDiagram() {
  const [networkSize, setNetworkSize] = useState([50]);
  const [needs2D, setNeeds2D] = useState(false);
  const [budgetConstrained, setBudgetConstrained] = useState(true);
  const [dryWeatherModeling, setDryWeatherModeling] = useState(false);
  const [complexRTC, setComplexRTC] = useState(false);
  const [needsStability, setNeedsStability] = useState([50]);
  const [hasLargeTimesteps, setHasLargeTimesteps] = useState(false);
  const [needsGreenInfra, setNeedsGreenInfra] = useState(false);
  const [regulatoryEPA, setRegulatoryEPA] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const factors: Factor[] = useMemo(() => [
    {
      id: "network",
      label: "Network Size",
      description: networkSize[0] < 30 ? "Small network favors SWMM5's simplicity" : 
                   networkSize[0] < 70 ? "Medium network - both work well" : 
                   "Large network benefits from ICM's distributed discretization",
      icon: <Network className="w-4 h-4" />,
      swmmWeight: networkSize[0] < 50 ? 2 : networkSize[0] < 70 ? 1 : -1,
      icmWeight: networkSize[0] > 50 ? 2 : networkSize[0] > 30 ? 1 : 0,
    },
    {
      id: "2d",
      label: "2D Surface Flooding",
      description: needs2D ? "ICM has native, tightly-coupled 2D" : "1D-only - both platforms capable",
      icon: <Waves className="w-4 h-4" />,
      swmmWeight: needs2D ? -2 : 0,
      icmWeight: needs2D ? 3 : 0,
    },
    {
      id: "budget",
      label: "Budget Constraints",
      description: budgetConstrained ? "SWMM5 is free/open-source" : "Commercial license affordable",
      icon: <DollarSign className="w-4 h-4" />,
      swmmWeight: budgetConstrained ? 3 : 0,
      icmWeight: budgetConstrained ? -2 : 1,
    },
    {
      id: "dry",
      label: "Dry Weather Modeling",
      description: dryWeatherModeling ? "SWMM5 handles true-dry (zero flow) natively" : "Not a primary concern",
      icon: <Droplets className="w-4 h-4" />,
      swmmWeight: dryWeatherModeling ? 2 : 0,
      icmWeight: dryWeatherModeling ? -1 : 0,
    },
    {
      id: "rtc",
      label: "Complex Real-Time Control",
      description: complexRTC ? "ICM's component-based RTC is more powerful" : "Simple controls - both adequate",
      icon: <Settings2 className="w-4 h-4" />,
      swmmWeight: complexRTC ? -1 : 0,
      icmWeight: complexRTC ? 2 : 0,
    },
    {
      id: "stability",
      label: "Numerical Stability Priority",
      description: needsStability[0] > 60 ? "ICM's implicit scheme handles stiff problems better" : 
                   needsStability[0] > 40 ? "Both acceptable with proper setup" :
                   "SWMM5's explicit scheme is simpler to tune",
      icon: <Zap className="w-4 h-4" />,
      swmmWeight: needsStability[0] < 40 ? 1 : needsStability[0] < 60 ? 0 : -1,
      icmWeight: needsStability[0] > 60 ? 2 : needsStability[0] > 40 ? 1 : 0,
    },
    {
      id: "timestep",
      label: "Large Timestep Needs",
      description: hasLargeTimesteps ? "ICM's convergence-based stepping allows larger Δt" : "Small timesteps acceptable",
      icon: <Clock className="w-4 h-4" />,
      swmmWeight: hasLargeTimesteps ? -1 : 0,
      icmWeight: hasLargeTimesteps ? 2 : 0,
    },
    {
      id: "green",
      label: "Green Infrastructure / LID",
      description: needsGreenInfra ? "SWMM5 has comprehensive LID module" : "Conventional drainage focus",
      icon: <TreePine className="w-4 h-4" />,
      swmmWeight: needsGreenInfra ? 2 : 0,
      icmWeight: needsGreenInfra ? 0 : 0,
    },
    {
      id: "epa",
      label: "EPA Regulatory Compliance",
      description: regulatoryEPA ? "SWMM5 is the EPA-endorsed standard" : "No specific regulatory requirement",
      icon: <Building2 className="w-4 h-4" />,
      swmmWeight: regulatoryEPA ? 3 : 0,
      icmWeight: regulatoryEPA ? 0 : 0,
    },
  ], [networkSize, needs2D, budgetConstrained, dryWeatherModeling, complexRTC, needsStability, hasLargeTimesteps, needsGreenInfra, regulatoryEPA]);

  const scores = useMemo(() => {
    const swmmScore = factors.reduce((sum, f) => sum + f.swmmWeight, 0);
    const icmScore = factors.reduce((sum, f) => sum + f.icmWeight, 0);
    return { swmm: swmmScore, icm: icmScore };
  }, [factors]);

  const recommendation = useMemo(() => {
    const diff = scores.swmm - scores.icm;
    if (diff > 4) return { solver: "SWMM5", confidence: "Strong", color: "text-blue-600" };
    if (diff > 2) return { solver: "SWMM5", confidence: "Moderate", color: "text-blue-500" };
    if (diff > 0) return { solver: "SWMM5", confidence: "Slight", color: "text-blue-400" };
    if (diff === 0) return { solver: "Either", confidence: "Equal", color: "text-purple-500" };
    if (diff > -2) return { solver: "ICM", confidence: "Slight", color: "text-emerald-400" };
    if (diff > -4) return { solver: "ICM", confidence: "Moderate", color: "text-emerald-500" };
    return { solver: "ICM", confidence: "Strong", color: "text-emerald-600" };
  }, [scores]);

  const getReasoningText = () => {
    const reasons: string[] = [];
    
    if (budgetConstrained) reasons.push("free/open-source licensing");
    if (regulatoryEPA) reasons.push("EPA regulatory compliance");
    if (needs2D) reasons.push("native 2D surface flooding capability");
    if (complexRTC) reasons.push("advanced real-time control logic");
    if (networkSize[0] > 70) reasons.push("efficient handling of large networks");
    if (dryWeatherModeling) reasons.push("true dry-weather flow modeling");
    if (needsGreenInfra) reasons.push("comprehensive LID/green infrastructure");
    if (hasLargeTimesteps) reasons.push("convergence-based adaptive timesteps");
    
    if (reasons.length === 0) return "Based on your neutral inputs, either solver would work well.";
    
    const solver = recommendation.solver;
    if (solver === "Either") return "Your requirements are balanced between both solvers.";
    
    return `${solver} is recommended primarily for: ${reasons.slice(0, 3).join(", ")}.`;
  };

  const maxScore = Math.max(scores.swmm, scores.icm, 1);
  const swmmBarWidth = Math.max(5, (scores.swmm / maxScore) * 100);
  const icmBarWidth = Math.max(5, (scores.icm / maxScore) * 100);

  return (
    <Card className="w-full border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5" data-testid="decision-engine">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-xl">
          <HelpCircle className="w-6 h-6 text-primary" />
          Which Solver Should I Use?
        </CardTitle>
        <CardDescription>
          Answer these questions about your project to get a personalized recommendation
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-5">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2 text-sm font-medium">
                  <Network className="w-4 h-4 text-muted-foreground" />
                  Network Size
                </Label>
                <span className="text-xs text-muted-foreground">
                  {networkSize[0] < 30 ? "Small (<500 pipes)" : networkSize[0] < 70 ? "Medium" : "Large (>5000 pipes)"}
                </span>
              </div>
              <Slider
                value={networkSize}
                onValueChange={setNetworkSize}
                min={0}
                max={100}
                step={1}
                aria-label="Network Size"
                data-testid="slider-network-size"
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2 text-sm font-medium">
                  <Zap className="w-4 h-4 text-muted-foreground" />
                  Stability Priority
                </Label>
                <span className="text-xs text-muted-foreground">
                  {needsStability[0] < 40 ? "Low" : needsStability[0] < 70 ? "Medium" : "High"}
                </span>
              </div>
              <Slider
                value={needsStability}
                onValueChange={setNeedsStability}
                min={0}
                max={100}
                step={1}
                aria-label="Stability Priority"
                data-testid="slider-stability"
              />
            </div>

            <Separator />

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="needs2d" className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                  <Waves className="w-4 h-4 text-muted-foreground" />
                  Need 2D Surface Flooding?
                </Label>
                <Switch id="needs2d" checked={needs2D} onCheckedChange={setNeeds2D} data-testid="switch-2d" />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="budget" className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                  <DollarSign className="w-4 h-4 text-muted-foreground" />
                  Budget Constrained?
                </Label>
                <Switch id="budget" checked={budgetConstrained} onCheckedChange={setBudgetConstrained} data-testid="switch-budget" />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="dry" className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                  <Droplets className="w-4 h-4 text-muted-foreground" />
                  Dry Weather / Intermittent Flow?
                </Label>
                <Switch id="dry" checked={dryWeatherModeling} onCheckedChange={setDryWeatherModeling} data-testid="switch-dry" />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="rtc" className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                  <Settings2 className="w-4 h-4 text-muted-foreground" />
                  Complex RTC / Control Logic?
                </Label>
                <Switch id="rtc" checked={complexRTC} onCheckedChange={setComplexRTC} data-testid="switch-rtc" />
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="timestep" className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  Need Large Timesteps?
                </Label>
                <Switch id="timestep" checked={hasLargeTimesteps} onCheckedChange={setHasLargeTimesteps} data-testid="switch-timestep" />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="green" className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                  <TreePine className="w-4 h-4 text-muted-foreground" />
                  Green Infrastructure / LID Focus?
                </Label>
                <Switch id="green" checked={needsGreenInfra} onCheckedChange={setNeedsGreenInfra} data-testid="switch-green" />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="epa" className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                  <Building2 className="w-4 h-4 text-muted-foreground" />
                  EPA Regulatory Requirement?
                </Label>
                <Switch id="epa" checked={regulatoryEPA} onCheckedChange={setRegulatoryEPA} data-testid="switch-epa" />
              </div>
            </div>

            <Separator />

            <motion.div 
              className="p-4 rounded-lg bg-card border-2 border-primary/30 shadow-lg"
              layout
              data-testid="recommendation-panel"
            >
              <div className="text-center mb-4">
                <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Recommendation</div>
                <motion.div 
                  className={`text-2xl font-bold ${recommendation.color}`}
                  key={recommendation.solver}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  data-testid="text-recommendation-solver"
                >
                  {recommendation.solver === "Either" ? "Either Solver" : recommendation.solver}
                </motion.div>
                <Badge variant="secondary" className="mt-1" data-testid="badge-confidence">
                  {recommendation.confidence} preference
                </Badge>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2" data-testid="score-bar-swmm">
                  <span className="text-xs font-medium text-blue-600 w-16">SWMM5</span>
                  <div className="flex-1 h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-blue-500 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${swmmBarWidth}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                  <span className="text-xs font-mono w-8 text-right" data-testid="text-score-swmm">{scores.swmm}</span>
                </div>
                <div className="flex items-center gap-2" data-testid="score-bar-icm">
                  <span className="text-xs font-medium text-emerald-600 w-16">ICM</span>
                  <div className="flex-1 h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-emerald-500 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${icmBarWidth}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                  <span className="text-xs font-mono w-8 text-right" data-testid="text-score-icm">{scores.icm}</span>
                </div>
              </div>

              <p className="text-xs text-muted-foreground mt-3 text-center" data-testid="text-reasoning">
                {getReasoningText()}
              </p>
            </motion.div>
          </div>
        </div>

        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setShowDetails(!showDetails)}
          className="w-full"
          data-testid="btn-show-details"
        >
          <BarChart2 className="w-4 h-4 mr-2" />
          {showDetails ? "Hide" : "Show"} Factor Breakdown
        </Button>

        <AnimatePresence>
          {showDetails && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="grid md:grid-cols-3 gap-3 pt-2">
                {factors.map((factor) => (
                  <motion.div
                    key={factor.id}
                    data-testid={`factor-card-${factor.id}`}
                    className={`p-3 rounded-lg border ${
                      factor.swmmWeight > factor.icmWeight 
                        ? "border-blue-300 bg-blue-50 dark:bg-blue-900/20" 
                        : factor.icmWeight > factor.swmmWeight
                          ? "border-emerald-300 bg-emerald-50 dark:bg-emerald-900/20"
                          : "border-slate-200 bg-slate-50 dark:bg-slate-800/30"
                    }`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      {factor.icon}
                      <span className="text-xs font-medium">{factor.label}</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground">{factor.description}</p>
                    <div className="flex gap-2 mt-2">
                      <Badge variant="outline" className={`text-[9px] ${factor.swmmWeight > 0 ? "bg-blue-100 text-blue-700" : factor.swmmWeight < 0 ? "bg-red-100 text-red-700" : ""}`}>
                        SWMM: {factor.swmmWeight > 0 ? "+" : ""}{factor.swmmWeight}
                      </Badge>
                      <Badge variant="outline" className={`text-[9px] ${factor.icmWeight > 0 ? "bg-emerald-100 text-emerald-700" : factor.icmWeight < 0 ? "bg-red-100 text-red-700" : ""}`}>
                        ICM: {factor.icmWeight > 0 ? "+" : ""}{factor.icmWeight}
                      </Badge>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-700/50">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
            <div className="text-xs text-amber-700 dark:text-amber-300">
              <strong>Disclaimer:</strong> This tool provides general guidance based on typical use cases. 
              Your specific project requirements, team expertise, and organizational constraints should 
              inform the final decision. Both solvers are capable tools when properly configured.
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
