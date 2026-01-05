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
  BarChart2
} from "lucide-react";
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
import { DiscretizationDiagram, PreissmannSlotDiagram, WavePropagationDiagram, DryNetworkDiagram, NodeAreaDiagram, ManholeVsNodeDiagram } from "@/components/visuals/SolverDiagrams";
import { CFLStabilityDiagram, SurchargeMethodDiagram, RoutingMethodFlowchart, AdaptiveTimestepDiagram, ThetaParameterDiagram, Coupling1D2DDiagram } from "@/components/visuals/SolverOptionsDiagrams";
import { ConvergenceSnapshotsDiagram, MassBalanceErrorDiagram, OscillationChallengeDiagram, WettingFrontDiagram, TimestepDashboardDiagram, SolverDecisionTreeDiagram } from "@/components/visuals/AdvancedDiagrams";
import heroImage from "@assets/generated_images/abstract_fluid_dynamics_network_blueprint.png";

export default function Dashboard() {
  const [activeView, setActiveView] = useState<"visuals" | "topic" | "table">("visuals");

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
              <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-wider mt-1">Hydraulic Solver Comparison</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="hidden md:flex gap-2"
              onClick={() => handleExport("json")}
            >
              <Download className="h-3.5 w-3.5" />
              <span>JSON</span>
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="hidden md:flex gap-2"
              onClick={() => handleExport("md")}
            >
              <Download className="h-3.5 w-3.5" />
              <span>Markdown</span>
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
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>

            <Separator orientation="vertical" className="h-6 mx-2 hidden md:block" />

            <Tabs value={activeView} onValueChange={(v) => setActiveView(v as any)} className="w-[300px]">
              <TabsList className="grid w-full grid-cols-3 h-9">
                <TabsTrigger value="visuals" className="text-xs">
                  <BarChart2 className="h-3.5 w-3.5 mr-2" />
                  Visuals
                </TabsTrigger>
                <TabsTrigger value="topic" className="text-xs">
                  <LayoutGrid className="h-3.5 w-3.5 mr-2" />
                  Topic
                </TabsTrigger>
                <TabsTrigger value="table" className="text-xs">
                  <TableIcon className="h-3.5 w-3.5 mr-2" />
                  Table
                </TabsTrigger>
              </TabsList>
            </Tabs>
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

        {activeView === "visuals" && (
           <div className="space-y-6 animate-in fade-in duration-500">
             <div className="relative h-56 w-full rounded-xl overflow-hidden mb-8 border border-border shadow-md">
                {/* Network Pattern Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
                  <svg className="absolute inset-0 w-full h-full opacity-30" aria-hidden="true">
                    <defs>
                      <pattern id="network-grid" width="60" height="60" patternUnits="userSpaceOnUse">
                        <circle cx="30" cy="30" r="3" className="fill-blue-400" />
                        <circle cx="0" cy="0" r="2" className="fill-emerald-400" />
                        <circle cx="60" cy="0" r="2" className="fill-emerald-400" />
                        <circle cx="0" cy="60" r="2" className="fill-emerald-400" />
                        <circle cx="60" cy="60" r="2" className="fill-emerald-400" />
                        <line x1="0" y1="0" x2="30" y2="30" className="stroke-blue-400/50" strokeWidth="1" />
                        <line x1="60" y1="0" x2="30" y2="30" className="stroke-emerald-400/50" strokeWidth="1" />
                        <line x1="0" y1="60" x2="30" y2="30" className="stroke-blue-400/50" strokeWidth="1" />
                        <line x1="60" y1="60" x2="30" y2="30" className="stroke-emerald-400/50" strokeWidth="1" />
                        <line x1="30" y1="0" x2="30" y2="30" className="stroke-slate-500/30" strokeWidth="1" />
                        <line x1="30" y1="60" x2="30" y2="30" className="stroke-slate-500/30" strokeWidth="1" />
                        <line x1="0" y1="30" x2="30" y2="30" className="stroke-slate-500/30" strokeWidth="1" />
                        <line x1="60" y1="30" x2="30" y2="30" className="stroke-slate-500/30" strokeWidth="1" />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#network-grid)" />
                  </svg>
                  {/* Animated flow lines */}
                  <svg className="absolute inset-0 w-full h-full" aria-hidden="true">
                    <defs>
                      <linearGradient id="flow-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="transparent" />
                        <stop offset="50%" stopColor="rgba(59, 130, 246, 0.6)" />
                        <stop offset="100%" stopColor="transparent" />
                      </linearGradient>
                    </defs>
                    <line x1="0" y1="80" x2="100%" y2="80" stroke="url(#flow-gradient)" strokeWidth="3" strokeLinecap="round">
                      <animate attributeName="x1" values="-200;100%" dur="4s" repeatCount="indefinite" />
                      <animate attributeName="x2" values="0;200%" dur="4s" repeatCount="indefinite" />
                    </line>
                    <line x1="0" y1="140" x2="100%" y2="140" stroke="url(#flow-gradient)" strokeWidth="2" strokeLinecap="round">
                      <animate attributeName="x1" values="-300;100%" dur="6s" repeatCount="indefinite" />
                      <animate attributeName="x2" values="0;200%" dur="6s" repeatCount="indefinite" />
                    </line>
                  </svg>
                  {/* Pipe-like decorative elements */}
                  <div className="absolute bottom-4 right-8 flex items-center gap-2 opacity-40">
                    <div className="h-4 w-24 bg-slate-600 rounded-full" />
                    <div className="h-8 w-8 rounded-full border-2 border-slate-500 bg-slate-700" />
                    <div className="h-4 w-16 bg-slate-600 rounded-full" />
                  </div>
                  <div className="absolute top-4 right-16 flex items-center gap-1 opacity-30">
                    <div className="h-3 w-12 bg-emerald-600/50 rounded-full" />
                    <div className="h-5 w-5 rounded-full border border-emerald-500/50" />
                    <div className="h-3 w-20 bg-emerald-600/50 rounded-full" />
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/70 to-transparent flex flex-col justify-center px-8">
                  <h2 className="text-3xl font-bold tracking-tight mb-2">Visual Analysis</h2>
                  <p className="text-muted-foreground max-w-md">Key architectural differences between the solvers visualized.</p>
                  <div className="flex items-center gap-4 mt-4">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <div className="h-2 w-2 rounded-full bg-blue-500" />
                      <span>SWMM5</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <div className="h-2 w-2 rounded-full bg-emerald-500" />
                      <span>ICM</span>
                    </div>
                  </div>
                </div>
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

             {/* Solver Options & Parameters Section */}
             <div className="mt-12 pt-8 border-t border-border">
               <div className="mb-6">
                 <h3 className="text-2xl font-bold tracking-tight mb-2">Solver Options & Parameters</h3>
                 <p className="text-muted-foreground">Interactive controls that engineers use to tune model behavior.</p>
               </div>

               <div className="grid md:grid-cols-2 gap-6">
                  <CFLStabilityDiagram />
                  <AdaptiveTimestepDiagram />
               </div>
               
               <div className="grid md:grid-cols-2 gap-6 mt-6">
                  <SurchargeMethodDiagram />
                  <ThetaParameterDiagram />
               </div>
               
               <div className="grid md:grid-cols-2 gap-6 mt-6">
                  <RoutingMethodFlowchart />
                  <Coupling1D2DDiagram />
               </div>
             </div>

             {/* Advanced Solver Behavior & Diagnostics Section */}
             <div className="mt-12 pt-8 border-t border-border">
               <div className="mb-6">
                 <h3 className="text-2xl font-bold tracking-tight mb-2">Advanced Solver Behavior & Diagnostics</h3>
                 <p className="text-muted-foreground">Deep insights into solver convergence, stability, and practical engineering scenarios.</p>
               </div>

               <div className="grid md:grid-cols-2 gap-6">
                  <ConvergenceSnapshotsDiagram />
                  <MassBalanceErrorDiagram />
               </div>
               
               <div className="grid md:grid-cols-2 gap-6 mt-6">
                  <OscillationChallengeDiagram />
                  <WettingFrontDiagram />
               </div>
               
               <div className="grid md:grid-cols-2 gap-6 mt-6">
                  <TimestepDashboardDiagram />
                  <SolverDecisionTreeDiagram />
               </div>
             </div>
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
                    <div className="flex items-center gap-3 text-left">
                      <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center shrink-0 text-muted-foreground text-xs font-mono font-medium">
                        {topic.key.substring(0, 2).toUpperCase()}
                      </div>
                      <span className="font-semibold text-lg">{topic.label}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-6 pt-2">
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
                      <div className="p-4 text-sm font-medium text-foreground/80">
                        {topic.label}
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
      </main>
    </div>
  );
}
