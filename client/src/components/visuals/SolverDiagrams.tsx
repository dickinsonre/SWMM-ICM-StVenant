import { useState, useEffect, useRef } from "react";
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
        {/* SWMM 5 Approach */}
        <div className="space-y-2">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-semibold text-blue-600 dark:text-blue-400">SWMM 5: Node-Link</h4>
            <Badge variant="outline" className="text-[10px]">EXTRAN-derived</Badge>
          </div>
          <div className="relative h-24 bg-muted/30 rounded-lg border border-border flex items-center justify-center p-4">
            <div className="absolute h-4 w-[80%] bg-slate-300 dark:bg-slate-700 rounded-full" />
            <motion.div 
              className="absolute h-2 w-[80%] bg-blue-400/50 rounded-full blur-[1px]"
              animate={{ opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            <div className="absolute left-[10%] h-12 w-12 rounded-full border-2 border-blue-500 bg-background flex items-center justify-center z-10 shadow-sm">
              <div className="text-xs font-mono font-bold text-blue-600">H1</div>
            </div>
            <div className="absolute right-[10%] h-12 w-12 rounded-full border-2 border-blue-500 bg-background flex items-center justify-center z-10 shadow-sm">
              <div className="text-xs font-mono font-bold text-blue-600">H2</div>
            </div>
            <div className="absolute top-[60%] bg-background/80 px-2 py-0.5 rounded text-[10px] font-mono border border-border">
              Link (Q calculated)
            </div>
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
            <div className="absolute h-4 w-[80%] bg-slate-300 dark:bg-slate-700 rounded-full" />
            <motion.div 
              className="absolute h-2 w-[80%] bg-gradient-to-r from-emerald-400/50 via-emerald-500/50 to-emerald-400/50 rounded-full blur-[1px]"
              animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
              transition={{ duration: 5, repeat: Infinity }}
            />
            <div className="absolute left-[10%] h-12 w-12 rounded-full border-2 border-emerald-500 bg-background flex items-center justify-center z-10 shadow-sm">
              <div className="text-xs font-mono font-bold text-emerald-600">Node</div>
            </div>
            <div className="absolute right-[10%] h-12 w-12 rounded-full border-2 border-emerald-500 bg-background flex items-center justify-center z-10 shadow-sm">
              <div className="text-xs font-mono font-bold text-emerald-600">Node</div>
            </div>
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Interactive Visualization */}
          <div className="relative h-64 bg-muted/30 rounded-lg border border-border p-4 flex flex-col items-center justify-end overflow-hidden">
            <div className="absolute top-2 left-2 text-xs font-medium text-muted-foreground">Preissmann Slot Concept</div>
            
            <div className="relative flex flex-col items-center">
              {/* The Slot */}
              <div className="relative w-4 h-12 bg-background border-x-2 border-slate-400 dark:border-slate-600 overflow-hidden" aria-hidden="true">
                <div 
                  className="absolute bottom-0 left-0 right-0 bg-blue-500/70 transition-all duration-150"
                  style={{ height: `${slotFill}%` }}
                />
                {isPressurized && (
                  <div className="absolute -right-8 top-1/2 -translate-y-1/2 text-[9px] font-mono text-amber-500 whitespace-nowrap">
                    Slot
                  </div>
                )}
              </div>
              
              {/* The Pipe */}
              <div className="relative w-32 h-32 border-4 border-slate-400 dark:border-slate-600 rounded-full bg-background overflow-hidden" aria-hidden="true">
                <div 
                  className="absolute bottom-0 left-0 right-0 bg-blue-500/60 transition-all duration-150"
                  style={{ height: `${pipeFill}%` }}
                />
              </div>
              <div className="mt-2 text-[10px] text-slate-500 font-mono">Pipe Cross-Section</div>
            </div>
            
            {/* Wave Speed Indicator */}
            <div className="absolute top-4 right-4 bg-background/90 border border-border rounded-lg p-2" aria-live="polite">
              <div className="text-[9px] text-muted-foreground" id="wave-speed-label">Wave Speed (c)</div>
              <div 
                className={`text-lg font-mono font-bold ${isPressurized ? 'text-amber-500' : 'text-blue-500'}`}
                data-testid="text-wave-speed"
                aria-labelledby="wave-speed-label"
              >
                {waveSpeed} m/s
              </div>
            </div>
            
            {/* State Indicator */}
            <div 
              className={`absolute bottom-3 left-3 text-[10px] font-mono px-2 py-1 rounded border ${
                isPressurized 
                  ? 'bg-amber-500/20 border-amber-500 text-amber-600' 
                  : 'bg-blue-500/20 border-blue-500 text-blue-600'
              }`}
              data-testid="text-flow-state"
              aria-live="polite"
            >
              {isPressurized ? 'Surcharged (Pressurized)' : 'Free Surface'}
            </div>
          </div>

          {/* Controls & Info */}
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="water-level-slider" className="text-sm font-medium">
                Water Level: <span data-testid="text-water-level">{level}%</span>
              </label>
              <Slider
                id="water-level-slider"
                value={waterLevel}
                onValueChange={setWaterLevel}
                max={140}
                step={1}
                className="w-full"
                data-testid="slider-water-level"
                aria-label="Water level percentage"
              />
              <p className="text-[10px] text-muted-foreground">
                100% = pipe full, &gt;100% = water rises into slot
              </p>
            </div>

            <div className="bg-muted/30 rounded-lg p-3 border border-border space-y-2">
              <h4 className="text-sm font-semibold">Key Concept</h4>
              <p className="text-xs text-muted-foreground">
                The narrow slot allows water to rise above the pipe crown, creating "virtual" storage. 
                Wave speed increases dramatically in the slot, enabling smooth transition to pressurized flow.
              </p>
              <div className="text-[10px] font-mono text-muted-foreground mt-2">
                c = √(g·A / B<sub>slot</sub>)
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-blue-500/10 border border-blue-500/30 rounded p-2">
                <div className="font-semibold text-blue-600 dark:text-blue-400">SWMM 5</div>
                <p className="text-muted-foreground mt-1">Optional since v5.1.013</p>
              </div>
              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded p-2">
                <div className="font-semibold text-emerald-600 dark:text-emerald-400">ICM</div>
                <p className="text-muted-foreground mt-1">Default behavior</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function WavePropagationDiagram() {
  const [isRunning, setIsRunning] = useState(false);
  const [wavePosition, setWavePosition] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const startWave = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setWavePosition(0);
    setIsRunning(true);
    
    intervalRef.current = setInterval(() => {
      setWavePosition(prev => {
        if (prev >= 100) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          setIsRunning(false);
          return 0;
        }
        return prev + 2;
      });
    }, 100);
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg">Wave Propagation Comparison</CardTitle>
        <CardDescription>How flow waves travel through the models</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={startWave} 
          disabled={isRunning}
          className="w-full"
          data-testid="button-start-wave"
          aria-label="Start wave propagation animation"
        >
          {isRunning ? "Wave Propagating..." : "Introduce Inflow Wave"}
        </Button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* SWMM5 View */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-blue-500" aria-hidden="true" />
              <h4 className="text-sm font-semibold text-blue-600 dark:text-blue-400">SWMM 5: Node-Link</h4>
            </div>
            <div className="relative h-24 bg-muted/30 rounded-lg border border-border p-4 overflow-hidden" role="img" aria-label="SWMM5 wave propagation visualization">
              {/* Pipe */}
              <div className="absolute top-1/2 left-[15%] right-[15%] h-6 bg-slate-200 dark:bg-slate-700 rounded-full -translate-y-1/2" />
              
              {/* Wave - fills entire link at once */}
              <motion.div 
                className="absolute top-1/2 left-[15%] right-[15%] h-4 rounded-full -translate-y-1/2 overflow-hidden"
                style={{ opacity: wavePosition > 0 ? 1 : 0 }}
              >
                <div 
                  className="h-full bg-blue-400/70 transition-all duration-300"
                  style={{ width: wavePosition > 20 ? '100%' : '0%' }}
                />
              </motion.div>

              {/* Nodes */}
              <div className="absolute left-[10%] top-1/2 -translate-y-1/2 h-10 w-10 rounded-full border-2 border-blue-500 bg-background flex items-center justify-center z-10">
                <div className={`text-[10px] font-mono font-bold transition-colors ${wavePosition > 10 ? 'text-blue-600' : 'text-muted-foreground'}`}>
                  H↑
                </div>
              </div>
              <div className="absolute right-[10%] top-1/2 -translate-y-1/2 h-10 w-10 rounded-full border-2 border-blue-500 bg-background flex items-center justify-center z-10">
                <div className={`text-[10px] font-mono font-bold transition-colors ${wavePosition > 50 ? 'text-blue-600' : 'text-muted-foreground'}`}>
                  H↑
                </div>
              </div>

              {/* Q label */}
              <div className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[9px] font-mono text-blue-600" data-testid="text-swmm-flow">
                Q = {wavePosition > 20 ? '1.5' : '0.0'} m³/s (entire link)
              </div>
            </div>
            <p className="text-[10px] text-muted-foreground">
              Flow (Q) updates for entire link simultaneously. Head (H) only at nodes.
            </p>
          </div>

          {/* ICM View */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-emerald-500" aria-hidden="true" />
              <h4 className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">ICM: Distributed</h4>
            </div>
            <div className="relative h-24 bg-muted/30 rounded-lg border border-border p-4 overflow-hidden" role="img" aria-label="ICM wave propagation visualization">
              {/* Pipe segments */}
              <div className="absolute top-1/2 left-[15%] right-[15%] h-6 bg-slate-200 dark:bg-slate-700 rounded-full -translate-y-1/2 flex">
                {[0, 1, 2, 3, 4].map(i => (
                  <div 
                    key={i}
                    className="flex-1 h-full flex items-center justify-center transition-colors duration-200"
                    style={{ 
                      backgroundColor: wavePosition > (i + 1) * 20 ? 'rgba(52, 211, 153, 0.5)' : 'transparent',
                    }}
                  >
                    <div className={`h-2 w-2 rounded-full transition-colors ${
                      wavePosition > (i + 1) * 20 ? 'bg-emerald-500' : 'bg-slate-400'
                    }`} />
                  </div>
                ))}
              </div>

              {/* Nodes */}
              <div className="absolute left-[10%] top-1/2 -translate-y-1/2 h-10 w-10 rounded-full border-2 border-emerald-500 bg-background flex items-center justify-center z-10">
                <div className={`text-[10px] font-mono font-bold ${wavePosition > 10 ? 'text-emerald-600' : 'text-muted-foreground'}`}>
                  Node
                </div>
              </div>
              <div className="absolute right-[10%] top-1/2 -translate-y-1/2 h-10 w-10 rounded-full border-2 border-emerald-500 bg-background flex items-center justify-center z-10">
                <div className={`text-[10px] font-mono font-bold ${wavePosition > 90 ? 'text-emerald-600' : 'text-muted-foreground'}`}>
                  Node
                </div>
              </div>

              {/* Segment labels */}
              <div className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[9px] font-mono text-emerald-600" data-testid="text-icm-segment">
                Wave at segment {Math.min(5, Math.ceil(wavePosition / 20))}/5
              </div>
            </div>
            <p className="text-[10px] text-muted-foreground">
              Wave propagates through segments. H and Q computed at each point.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function DryNetworkDiagram() {
  const [mode, setMode] = useState<"swmm" | "icm">("swmm");
  const [flowActive, setFlowActive] = useState(false);
  const [flowPosition, setFlowPosition] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const startFlow = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setFlowPosition(0);
    setFlowActive(true);
    
    intervalRef.current = setInterval(() => {
      setFlowPosition(prev => {
        if (prev >= 100) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          setFlowActive(false);
          return 0;
        }
        return prev + 3;
      });
    }, 100);
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg">Dry Network Handling</CardTitle>
        <CardDescription>How each solver handles empty/low-flow pipes</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs value={mode} onValueChange={(v) => setMode(v as "swmm" | "icm")} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="swmm" data-testid="tab-swmm-dry">SWMM 5 (Truly Dry)</TabsTrigger>
            <TabsTrigger value="icm" data-testid="tab-icm-dry">ICM (Base Flow)</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="relative h-40 bg-muted/30 rounded-lg border border-border p-4 overflow-hidden" role="img" aria-label={`${mode === 'swmm' ? 'SWMM5' : 'ICM'} dry network visualization`}>
          {/* Network of pipes */}
          <svg className="w-full h-full" viewBox="0 0 300 100" aria-hidden="true">
            {/* Pipe 1 */}
            <rect x="20" y="40" width="80" height="20" rx="10" 
              className={mode === "icm" ? "fill-blue-200/50 dark:fill-blue-900/50" : "fill-slate-200 dark:fill-slate-700"} 
            />
            {(mode === "swmm" && flowPosition > 0) && (
              <rect 
                x="20" y="45" 
                width={Math.min(flowPosition * 0.8, 80)} height="10" rx="5" 
                className="fill-blue-400/70"
              />
            )}
            {mode === "icm" && (
              <rect x="20" y="52" width="80" height="4" rx="2" className="fill-blue-300/50" />
            )}
            {(mode === "icm" && flowPosition > 0) && (
              <rect 
                x="20" y="45" 
                width={Math.min(flowPosition * 0.8, 80)} height="10" rx="5" 
                className="fill-blue-400/70"
              />
            )}

            {/* Pipe 2 */}
            <rect x="110" y="40" width="80" height="20" rx="10" 
              className={mode === "icm" ? "fill-blue-200/50 dark:fill-blue-900/50" : "fill-slate-200 dark:fill-slate-700"} 
            />
            {(mode === "swmm" && flowPosition > 30) && (
              <rect 
                x="110" y="45" 
                width={Math.min((flowPosition - 30) * 0.8, 80)} height="10" rx="5" 
                className="fill-blue-400/70"
              />
            )}
            {mode === "icm" && (
              <rect x="110" y="52" width="80" height="4" rx="2" className="fill-blue-300/50" />
            )}
            {(mode === "icm" && flowPosition > 30) && (
              <rect 
                x="110" y="45" 
                width={Math.min((flowPosition - 30) * 0.8, 80)} height="10" rx="5" 
                className="fill-blue-400/70"
              />
            )}

            {/* Pipe 3 */}
            <rect x="200" y="40" width="80" height="20" rx="10" 
              className={mode === "icm" ? "fill-blue-200/50 dark:fill-blue-900/50" : "fill-slate-200 dark:fill-slate-700"} 
            />
            {(mode === "swmm" && flowPosition > 60) && (
              <rect 
                x="200" y="45" 
                width={Math.min((flowPosition - 60) * 0.8, 80)} height="10" rx="5" 
                className="fill-blue-400/70"
              />
            )}
            {mode === "icm" && (
              <rect x="200" y="52" width="80" height="4" rx="2" className="fill-blue-300/50" />
            )}
            {(mode === "icm" && flowPosition > 60) && (
              <rect 
                x="200" y="45" 
                width={Math.min((flowPosition - 60) * 0.8, 80)} height="10" rx="5" 
                className="fill-blue-400/70"
              />
            )}

            {/* Nodes */}
            <circle cx="20" cy="50" r="8" className="fill-background stroke-2 stroke-current" />
            <circle cx="100" cy="50" r="8" className="fill-background stroke-2 stroke-current" />
            <circle cx="190" cy="50" r="8" className="fill-background stroke-2 stroke-current" />
            <circle cx="280" cy="50" r="8" className="fill-background stroke-2 stroke-current" />

            {/* Labels */}
            <text x="10" y="20" className="text-[8px] fill-current">Inflow</text>
            <text x="270" y="20" className="text-[8px] fill-current">Outfall</text>
          </svg>

          {/* Legend */}
          <div className="absolute bottom-2 right-2 text-[9px] space-y-1">
            {mode === "icm" && (
              <div className="flex items-center gap-1" data-testid="legend-base-flow">
                <div className="w-3 h-1 bg-blue-300/50 rounded" aria-hidden="true" />
                <span>Base flow (~5% depth)</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <div className="w-3 h-2 bg-blue-400/70 rounded" aria-hidden="true" />
              <span>Active flow</span>
            </div>
          </div>

          {/* Mode indicator */}
          <div 
            className="absolute top-2 left-2 text-[9px] font-mono px-2 py-1 rounded bg-background/80 border border-border"
            data-testid="text-network-mode"
            aria-live="polite"
          >
            {mode === "swmm" ? "Dry pipes (zero flow)" : "Base flow maintained"}
          </div>
        </div>

        <Button 
          onClick={startFlow} 
          disabled={flowActive}
          variant="outline"
          className="w-full"
          data-testid="button-start-flow"
          aria-label="Start flow animation"
        >
          {flowActive ? "Flow Propagating..." : "Start Inflow"}
        </Button>

        <div className={`p-3 rounded-lg border text-xs ${
          mode === "swmm" 
            ? "bg-blue-500/10 border-blue-500/30" 
            : "bg-emerald-500/10 border-emerald-500/30"
        }`}>
          {mode === "swmm" ? (
            <div className="space-y-1">
              <div className="font-semibold text-blue-600 dark:text-blue-400">SWMM 5: Truly Dry Networks</div>
              <p className="text-muted-foreground">
                Pipes can be completely empty (zero flow). Networks can start from dry conditions.
                Useful for intermittent streams and long dry periods.
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              <div className="font-semibold text-emerald-600 dark:text-emerald-400">ICM: Base Flow Maintained</div>
              <p className="text-muted-foreground">
                A thin film of water (~5% depth) is maintained for numerical stability.
                This is a computational device, not actual flow. More stable but cannot model truly dry conditions.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function NodeAreaDiagram() {
  const [hoveredSegment, setHoveredSegment] = useState<string | null>(null);
  const [mode, setMode] = useState<"swmm" | "icm">("swmm");

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg">Head & Flow Calculation Points</CardTitle>
        <CardDescription>Click/hover to explore where values are computed</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs value={mode} onValueChange={(v) => setMode(v as "swmm" | "icm")} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="swmm" data-testid="tab-swmm-points">SWMM 5</TabsTrigger>
            <TabsTrigger value="icm" data-testid="tab-icm-points">ICM</TabsTrigger>
          </TabsList>
        </Tabs>

        <div 
          className="relative h-48 bg-muted/30 rounded-lg border border-border p-4 overflow-hidden"
          role="application"
          aria-label="Interactive diagram showing computation points"
        >
          <svg className="w-full h-full" viewBox="0 0 300 120">
            {/* Pipe */}
            <rect x="40" y="50" width="220" height="20" rx="10" 
              className="fill-slate-200 dark:fill-slate-700"
            />

            {/* SWMM mode - only nodes have data */}
            {mode === "swmm" && (
              <>
                {/* Pipe click area */}
                <rect 
                  x="60" y="50" width="180" height="20" 
                  className="fill-transparent cursor-pointer"
                  onMouseEnter={() => setHoveredSegment("link")}
                  onMouseLeave={() => setHoveredSegment(null)}
                  onFocus={() => setHoveredSegment("link")}
                  onBlur={() => setHoveredSegment(null)}
                  tabIndex={0}
                  role="button"
                  aria-label="Link C-10, Flow 0.85 cubic meters per second"
                />
              </>
            )}

            {/* ICM mode - segments have data */}
            {mode === "icm" && (
              <>
                {[0, 1, 2, 3, 4].map(i => (
                  <g key={i}>
                    <rect 
                      x={60 + i * 36} y="50" width="36" height="20" 
                      className={`cursor-pointer transition-colors ${hoveredSegment === `seg${i}` ? 'fill-emerald-400/50' : 'fill-transparent'}`}
                      onMouseEnter={() => setHoveredSegment(`seg${i}`)}
                      onMouseLeave={() => setHoveredSegment(null)}
                      onFocus={() => setHoveredSegment(`seg${i}`)}
                      onBlur={() => setHoveredSegment(null)}
                      tabIndex={0}
                      role="button"
                      aria-label={`Segment ${i + 1} of 5, Head ${(12.5 - i * 0.15).toFixed(2)} meters, Flow ${(0.82 + i * 0.01).toFixed(2)} cubic meters per second`}
                    />
                    <circle 
                      cx={78 + i * 36} cy="60" r="4" 
                      className="fill-emerald-500 pointer-events-none"
                    />
                  </g>
                ))}
              </>
            )}

            {/* Nodes */}
            <circle 
              cx="40" cy="60" r="15" 
              className={`fill-background stroke-2 cursor-pointer transition-colors ${
                hoveredSegment === "node1" 
                  ? (mode === "swmm" ? "stroke-blue-500" : "stroke-emerald-500") 
                  : "stroke-current"
              }`}
              onMouseEnter={() => setHoveredSegment("node1")}
              onMouseLeave={() => setHoveredSegment(null)}
              onFocus={() => setHoveredSegment("node1")}
              onBlur={() => setHoveredSegment(null)}
              tabIndex={0}
              role="button"
              aria-label="Node J-01, Head 12.7 meters"
            />
            <text x="40" y="64" textAnchor="middle" className="text-[8px] fill-current font-mono pointer-events-none">J-01</text>

            <circle 
              cx="260" cy="60" r="15" 
              className={`fill-background stroke-2 cursor-pointer transition-colors ${
                hoveredSegment === "node2" 
                  ? (mode === "swmm" ? "stroke-blue-500" : "stroke-emerald-500") 
                  : "stroke-current"
              }`}
              onMouseEnter={() => setHoveredSegment("node2")}
              onMouseLeave={() => setHoveredSegment(null)}
              onFocus={() => setHoveredSegment("node2")}
              onBlur={() => setHoveredSegment(null)}
              tabIndex={0}
              role="button"
              aria-label="Node J-02, Head 11.9 meters"
            />
            <text x="260" y="64" textAnchor="middle" className="text-[8px] fill-current font-mono pointer-events-none">J-02</text>
          </svg>

          {/* Tooltip */}
          {hoveredSegment && (
            <div 
              className="absolute top-2 right-2 bg-background border border-border rounded-lg p-2 shadow-lg text-xs max-w-[150px]"
              data-testid="tooltip-calculation-point"
              role="tooltip"
            >
              {hoveredSegment === "node1" && (
                <div>
                  <div className="font-semibold">Node J-01</div>
                  <div className="text-muted-foreground mt-1">
                    <div>Head (H) = 12.7 m</div>
                    {mode === "icm" && <div>Inflow = 0.5 m³/s</div>}
                  </div>
                </div>
              )}
              {hoveredSegment === "node2" && (
                <div>
                  <div className="font-semibold">Node J-02</div>
                  <div className="text-muted-foreground mt-1">
                    <div>Head (H) = 11.9 m</div>
                    {mode === "icm" && <div>Outflow = 0.85 m³/s</div>}
                  </div>
                </div>
              )}
              {hoveredSegment === "link" && mode === "swmm" && (
                <div>
                  <div className="font-semibold">Link C-10</div>
                  <div className="text-muted-foreground mt-1">
                    <div>Flow (Q) = 0.85 m³/s</div>
                    <div className="text-[10px] italic mt-1">Same for entire link</div>
                  </div>
                </div>
              )}
              {hoveredSegment.startsWith("seg") && mode === "icm" && (
                <div>
                  <div className="font-semibold">Segment {parseInt(hoveredSegment.slice(3)) + 1}/5</div>
                  <div className="text-muted-foreground mt-1">
                    <div>Head (H) = {(12.5 - parseInt(hoveredSegment.slice(3)) * 0.15).toFixed(2)} m</div>
                    <div>Flow (Q) = {(0.82 + parseInt(hoveredSegment.slice(3)) * 0.01).toFixed(2)} m³/s</div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Instructions */}
          <div className="absolute bottom-2 left-2 text-[9px] text-muted-foreground">
            Hover over nodes {mode === "icm" ? "or pipe segments" : "or pipe"} to see computed values
          </div>
        </div>

        <div className={`p-3 rounded-lg border text-xs ${
          mode === "swmm" 
            ? "bg-blue-500/10 border-blue-500/30" 
            : "bg-emerald-500/10 border-emerald-500/30"
        }`}>
          {mode === "swmm" ? (
            <p className="text-muted-foreground">
              <strong className="text-blue-600 dark:text-blue-400">SWMM 5:</strong> Head computed only at nodes. 
              Flow is constant for entire link between nodes.
            </p>
          ) : (
            <p className="text-muted-foreground">
              <strong className="text-emerald-600 dark:text-emerald-400">ICM:</strong> Head and Flow computed at 
              each internal segment. Provides detailed spatial resolution along the conduit.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
