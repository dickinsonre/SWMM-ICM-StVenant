import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function DiscretizationDiagram() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg">Spatial Discretization</CardTitle>
        <CardDescription>How the solver splits up the network</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* SWMM 5 Approach */}
        <div className="space-y-2">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-semibold text-blue-600 dark:text-blue-400">SWMM 5: Node-Link</h4>
            <Badge variant="outline" className="text-[10px]">EXTRAN-derived</Badge>
          </div>
          <div className="relative h-24 bg-muted/30 rounded-lg border border-border flex items-center justify-center p-4">
            {/* Pipe */}
            <div className="absolute h-4 w-[80%] bg-slate-300 dark:bg-slate-700 rounded-full" />
            
            {/* Water Level */}
            <motion.div 
              className="absolute h-2 w-[80%] bg-blue-400/50 rounded-full blur-[1px]"
              animate={{ opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 3, repeat: Infinity }}
            />

            {/* Nodes */}
            <div className="absolute left-[10%] h-12 w-12 rounded-full border-2 border-blue-500 bg-background flex items-center justify-center z-10 shadow-sm">
              <div className="text-xs font-mono font-bold text-blue-600">H1</div>
            </div>
            <div className="absolute right-[10%] h-12 w-12 rounded-full border-2 border-blue-500 bg-background flex items-center justify-center z-10 shadow-sm">
              <div className="text-xs font-mono font-bold text-blue-600">H2</div>
            </div>

            {/* Link Label */}
            <div className="absolute top-[60%] bg-background/80 px-2 py-0.5 rounded text-[10px] font-mono border border-border">
              Link (Q calculated)
            </div>
            
             {/* Annotations */}
             <div className="absolute top-2 left-[12%] text-[9px] text-muted-foreground">Head</div>
             <div className="absolute top-2 right-[12%] text-[9px] text-muted-foreground">Head</div>
          </div>
          <p className="text-xs text-muted-foreground">
            Calculates Head (H) at nodes and Flow (Q) in the link. No internal computation points.
          </p>
          <p className="text-[10px] text-muted-foreground/80 italic">
            Historical note: EXTRAN (Extended Transport) was SWMM's predecessor module for dynamic wave routing in earlier versions.
          </p>
        </div>

        {/* ICM Approach */}
        <div className="space-y-2">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">InfoWorks ICM: Distributed</h4>
            <Badge variant="outline" className="text-[10px]">Finite Difference</Badge>
          </div>
          <div className="relative h-24 bg-muted/30 rounded-lg border border-border flex items-center justify-center p-4">
            {/* Pipe */}
            <div className="absolute h-4 w-[80%] bg-slate-300 dark:bg-slate-700 rounded-full" />
            
             {/* Water Level Gradient */}
            <motion.div 
              className="absolute h-2 w-[80%] bg-gradient-to-r from-emerald-400/50 via-emerald-500/50 to-emerald-400/50 rounded-full blur-[1px]"
              animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
              transition={{ duration: 5, repeat: Infinity }}
            />

            {/* Nodes */}
            <div className="absolute left-[10%] h-12 w-12 rounded-full border-2 border-emerald-500 bg-background flex items-center justify-center z-10 shadow-sm">
              <div className="text-xs font-mono font-bold text-emerald-600">Node</div>
            </div>
            <div className="absolute right-[10%] h-12 w-12 rounded-full border-2 border-emerald-500 bg-background flex items-center justify-center z-10 shadow-sm">
              <div className="text-xs font-mono font-bold text-emerald-600">Node</div>
            </div>

            {/* Internal Points */}
            <div className="absolute w-[60%] flex justify-between z-0">
               {[1,2,3,4,5].map(i => (
                 <div key={i} className="flex flex-col items-center gap-1">
                   <div className="h-2 w-2 rounded-full bg-emerald-500" />
                   <div className="h-3 w-px bg-emerald-500/30" />
                   <div className="text-[8px] font-mono text-emerald-600">H,Q</div>
                 </div>
               ))}
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Splits conduit into N segments. Calculates Head (H) and Flow (Q) at multiple points <i>along</i> the pipe.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export function PreissmannSlotDiagram() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg">Surcharge Handling</CardTitle>
        <CardDescription>Transition to pressurized flow</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4 h-full">
           {/* Concept */}
           <div className="col-span-2 relative h-48 bg-muted/30 rounded-lg border border-border p-4 flex flex-col items-center justify-end overflow-hidden">
              <div className="absolute top-2 left-2 text-xs font-medium text-muted-foreground">Preissmann Slot Concept</div>
              
              {/* Container for pipe + slot */}
              <div className="relative flex flex-col items-center">
                 {/* The Slot (above pipe) */}
                 <div className="relative w-3 h-10 bg-background border-x-2 border-slate-400 dark:border-slate-600 overflow-hidden">
                    {/* Water in Slot - fills from bottom up when pipe is full */}
                    <motion.div 
                      className="absolute bottom-0 left-0 right-0 bg-blue-500/70"
                      animate={{ 
                        height: ["0px", "0px", "0px", "40px", "40px", "40px", "0px", "0px"]
                      }}
                      transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                    />
                 </div>
                 
                 {/* The Pipe Cross Section */}
                 <div className="relative w-28 h-28 border-4 border-slate-400 dark:border-slate-600 rounded-full bg-background overflow-hidden">
                    {/* Water Level Animation - clipped to circle */}
                    <motion.div 
                      className="absolute bottom-0 left-0 right-0 bg-blue-500/60"
                      animate={{ 
                        height: ["30%", "60%", "100%", "100%", "100%", "100%", "60%", "30%"]
                      }}
                      transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                    />
                 </div>

                 <div className="mt-2 text-[10px] text-slate-500 font-mono">Pipe Cross-Section</div>
              </div>
              
              {/* Legend */}
              <div className="absolute top-4 right-6 flex flex-col items-start gap-1.5">
                 <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500/60 rounded-sm" />
                    <span className="text-[10px]">Free Surface Flow</span>
                 </div>
                 <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500/70 rounded-sm ring-1 ring-blue-400" />
                    <span className="text-[10px]">Pressurized (in Slot)</span>
                 </div>
                 <div className="flex items-center gap-2 mt-1">
                    <div className="w-3 h-0.5 bg-slate-400" />
                    <span className="text-[10px]">Pipe Wall</span>
                 </div>
              </div>
              
              {/* State indicator */}
              <motion.div 
                className="absolute bottom-3 left-3 text-[10px] font-mono px-2 py-1 rounded bg-background border border-border"
                animate={{
                  opacity: [1, 1, 1, 1, 1, 1, 1, 1]
                }}
              >
                <motion.span
                  animate={{
                    opacity: [1, 1, 0, 0, 0, 0, 1, 1]
                  }}
                  transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                  className="text-blue-600"
                >
                  Free Surface
                </motion.span>
                <motion.span
                  animate={{
                    opacity: [0, 0, 1, 1, 1, 1, 0, 0]
                  }}
                  transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                  className="text-amber-600 absolute left-2"
                >
                  Surcharged
                </motion.span>
              </motion.div>
           </div>

           <div className="space-y-2">
             <h4 className="text-sm font-semibold text-blue-600 dark:text-blue-400">SWMM 5</h4>
             <p className="text-xs text-muted-foreground">
               Historically used a "Surcharge Algorithm" (vertical walls). 
               Preissmann Slot option available since <strong>v5.1.013</strong> (~2018) for smooth pressurization handling.
             </p>
           </div>

           <div className="space-y-2">
             <h4 className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">InfoWorks ICM</h4>
             <p className="text-xs text-muted-foreground">
               Uses Preissmann Slot by default.
               Ensures continuity of wave speed equations when water level hits the pipe crown.
             </p>
           </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function NodeAreaDiagram() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg">SWMM Node Surface Area</CardTitle>
        <CardDescription>How link areas contribute to node storage</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative h-56 bg-muted/30 rounded-lg border border-border p-4 overflow-hidden">
          <div className="absolute top-2 left-2 text-xs font-medium text-muted-foreground">Node-Link Area Assignment</div>
          
          {/* Central Node */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
            <div className="relative">
              <div className="h-16 w-16 rounded-full border-3 border-blue-500 bg-blue-500/20 flex items-center justify-center shadow-lg">
                <div className="text-xs font-mono font-bold text-blue-700 dark:text-blue-300">Node</div>
              </div>
              <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[9px] font-mono text-blue-600 whitespace-nowrap">
                A<sub>node</sub>
              </div>
            </div>
          </div>

          {/* Link 1 - Top */}
          <div className="absolute left-1/2 top-4 -translate-x-1/2">
            <div className="flex flex-col items-center">
              <div className="h-3 w-3 rounded-full bg-slate-400" />
              <div className="h-12 w-6 bg-gradient-to-b from-slate-300 to-amber-400/60 dark:from-slate-600 dark:to-amber-500/60 rounded-sm border border-slate-400">
                <div className="h-1/2 w-full border-b border-dashed border-slate-500" />
              </div>
            </div>
            <div className="absolute -right-12 top-6 text-[8px] font-mono text-amber-600">½ A<sub>1</sub></div>
          </div>

          {/* Link 2 - Right */}
          <div className="absolute right-8 top-1/2 -translate-y-1/2">
            <div className="flex items-center">
              <div className="w-16 h-6 bg-gradient-to-r from-amber-400/60 to-slate-300 dark:from-amber-500/60 dark:to-slate-600 rounded-sm border border-slate-400">
                <div className="w-1/2 h-full border-r border-dashed border-slate-500" />
              </div>
              <div className="h-3 w-3 rounded-full bg-slate-400" />
            </div>
            <div className="absolute -bottom-4 left-2 text-[8px] font-mono text-amber-600">½ A<sub>2</sub></div>
          </div>

          {/* Link 3 - Bottom */}
          <div className="absolute left-1/2 bottom-4 -translate-x-1/2">
            <div className="flex flex-col items-center">
              <div className="h-12 w-8 bg-gradient-to-t from-slate-300 to-amber-400/60 dark:from-slate-600 dark:to-amber-500/60 rounded-sm border border-slate-400">
                <div className="h-1/2 w-full border-b border-dashed border-slate-500" />
              </div>
              <div className="h-3 w-3 rounded-full bg-slate-400" />
            </div>
            <div className="absolute -right-12 top-2 text-[8px] font-mono text-amber-600">½ A<sub>3</sub></div>
          </div>

          {/* Link 4 - Left */}
          <div className="absolute left-8 top-1/2 -translate-y-1/2">
            <div className="flex items-center">
              <div className="h-3 w-3 rounded-full bg-slate-400" />
              <div className="w-12 h-5 bg-gradient-to-l from-amber-400/60 to-slate-300 dark:from-amber-500/60 dark:to-slate-600 rounded-sm border border-slate-400">
                <div className="w-1/2 h-full border-r border-dashed border-slate-500" />
              </div>
            </div>
            <div className="absolute -bottom-4 right-2 text-[8px] font-mono text-amber-600">½ A<sub>4</sub></div>
          </div>

          {/* Legend */}
          <div className="absolute bottom-2 right-2 flex flex-col gap-1">
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-2 bg-amber-400/60 rounded-sm" />
              <span className="text-[9px]">Area → Node</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-2 bg-slate-300 dark:bg-slate-600 rounded-sm" />
              <span className="text-[9px]">Area → Other Node</span>
            </div>
          </div>
        </div>

        {/* Formula */}
        <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-3 border border-border">
          <div className="text-center font-mono text-sm text-blue-700 dark:text-blue-300">
            A<sub>effective</sub> = A<sub>node</sub> + ½·Σ(W<sub>i</sub> × L<sub>i</sub>)
          </div>
          <p className="text-[10px] text-muted-foreground text-center mt-2">
            Each connecting link contributes half its top surface area (width × length) to the node's storage capacity
          </p>
        </div>

        {/* Legend for diagram labels */}
        <div className="bg-muted/20 rounded-lg p-3 border border-border text-xs space-y-1" role="note" aria-label="Diagram legend explaining surface area notation">
          <p className="font-medium text-foreground/80">Diagram Key:</p>
          <ul className="space-y-1 text-muted-foreground">
            <li><span className="font-mono text-amber-600" aria-label="One-half A subscript 1, one-half A subscript 2">½ A₁, ½ A₂...</span> = Half of each link's surface area assigned to this node</li>
            <li><span className="font-mono text-blue-600" aria-label="A subscript node">A<sub>node</sub></span> = Node's own surface area (manhole shaft)</li>
            <li><span className="text-amber-500">Orange gradient</span> = Portion of link area contributing to this node</li>
            <li><span className="text-slate-400">Gray gradient</span> = Portion contributing to the other end node</li>
          </ul>
        </div>

        <p className="text-xs text-muted-foreground">
          <strong>Free surface flow:</strong> SWMM 5 assigns <strong>half the top surface area</strong> of each connecting conduit to the node for depth change calculations (∂H/∂t = ΣQ / A<sub>effective</sub>). 
          <strong>Surcharged:</strong> Method switches to dQ/dH relationship; half-link contribution becomes less relevant.
        </p>
      </CardContent>
    </Card>
  );
}
