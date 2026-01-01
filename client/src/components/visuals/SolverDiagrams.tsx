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
            <Badge variant="outline" className="text-[10px]">EXTRAN-based</Badge>
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
              
              {/* The Pipe Cross Section */}
              <div className="relative w-32 h-32 border-4 border-slate-400 dark:border-slate-600 rounded-full bg-background z-10 flex items-center justify-center overflow-visible">
                 
                 {/* The Slot */}
                 <div className="absolute -top-12 w-2 h-14 bg-background border-x-4 border-slate-400 dark:border-slate-600 z-0"></div>
                 
                 {/* Water Level Animation */}
                 <motion.div 
                   className="absolute bottom-0 w-full bg-blue-500/60"
                   initial={{ height: "40%" }}
                   animate={{ height: ["40%", "95%", "130%", "130%", "95%", "40%"] }}
                   transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                 />
                 
                 {/* Water in Slot */}
                 <motion.div 
                   className="absolute -top-12 w-1 h-14 bg-blue-500/60"
                   initial={{ opacity: 0, height: 0, bottom: 0 }}
                   animate={{ 
                     opacity: [0, 0, 1, 1, 0, 0], 
                     height: ["0%", "0%", "100%", "100%", "0%", "0%"],
                     bottom: [0, 0, 0, 0, 0, 0]
                   }}
                   transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                 />

                 <div className="absolute text-[10px] text-slate-500 font-mono mt-16">Pipe</div>
              </div>
              
              <div className="absolute top-4 right-10 flex flex-col items-start gap-1">
                 <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                    <span className="text-[10px]">Free Surface</span>
                 </div>
                 <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500/30 rounded-full border border-blue-500" />
                    <span className="text-[10px]">Pressurized (in Slot)</span>
                 </div>
              </div>
           </div>

           <div className="space-y-2">
             <h4 className="text-sm font-semibold text-blue-600 dark:text-blue-400">SWMM 5</h4>
             <p className="text-xs text-muted-foreground">
               Historically used a "Surcharge Algorithm" (vertical walls). 
               Newer versions support Preissmann Slot as an option to handle pressurization smoothly.
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
