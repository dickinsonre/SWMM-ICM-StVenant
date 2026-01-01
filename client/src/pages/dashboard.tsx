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
import { DiscretizationDiagram, PreissmannSlotDiagram } from "@/components/visuals/SolverDiagrams";
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
              <h1 className="text-lg font-bold tracking-tight leading-none">SWMM5 vs ICM</h1>
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
             <div className="relative h-48 w-full rounded-xl overflow-hidden mb-8 border border-border shadow-md">
                <img src={heroImage} alt="Fluid Dynamics Visualization" className="w-full h-full object-cover opacity-80" />
                <div className="absolute inset-0 bg-gradient-to-r from-background/90 to-transparent flex flex-col justify-center px-8">
                  <h2 className="text-3xl font-bold tracking-tight mb-2">Visual Analysis</h2>
                  <p className="text-muted-foreground max-w-md">Key architectural differences between the solvers visualized.</p>
                </div>
             </div>

             <div className="grid md:grid-cols-2 gap-6 min-h-[400px]">
                <DiscretizationDiagram />
                <PreissmannSlotDiagram />
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
