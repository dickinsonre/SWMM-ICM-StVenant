import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Droplets, Layers, Network, CircleDot, ArrowDown, ArrowRight } from "lucide-react";

type LIDPractice = "greenroof" | "permeable" | "bioretention" | "trench";

export function LIDvsSUDSDiagram() {
  const [practice, setPractice] = useState<LIDPractice>("greenroof");
  const [isAnimating, setIsAnimating] = useState(false);
  const [time, setTime] = useState(0);
  
  const [swmmParams, setSwmmParams] = useState({
    surfaceRoughness: [0.1],
    soilThickness: [150],
    soilConductivity: [10],
    storageVoid: [0.75],
    drainCoeff: [0.5]
  });
  
  const [icmParams, setIcmParams] = useState({
    subcatchArea: [100],
    storageDepth: [0.3],
    orificeSize: [50],
    soakawayRate: [15]
  });
  
  const [swmmOutflow, setSwmmOutflow] = useState<number[]>([]);
  const [icmOutflow, setIcmOutflow] = useState<number[]>([]);
  const [waterLevels, setWaterLevels] = useState({ surface: 0, soil: 0, storage: 0 });
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const practiceConfigs = {
    greenroof: { name: "Green Roof", layers: ["Surface", "Soil", "Drainage Mat", "Drain"] },
    permeable: { name: "Permeable Pavement", layers: ["Surface", "Pavement", "Storage", "Underdrain"] },
    bioretention: { name: "Bio-Retention Cell", layers: ["Ponding", "Soil Media", "Gravel Storage", "Underdrain"] },
    trench: { name: "Infiltration Trench", layers: ["Surface", "Gravel Fill", "Native Soil", "Overflow"] }
  };

  const getRainfall = (t: number) => {
    if (t < 30) return 40 + t * 2;
    if (t < 60) return 100 - (t - 30) * 2;
    return Math.max(5, 40 - (t - 60) * 0.5);
  };

  useEffect(() => {
    if (isAnimating) {
      let storedWater = { surface: 0, soil: 0, storage: 0 };
      
      intervalRef.current = setInterval(() => {
        setTime(prev => {
          const rain = getRainfall(prev);
          
          const surfaceOverflow = Math.max(0, storedWater.surface + rain * 0.01 - 0.1);
          storedWater.surface = Math.min(0.1, storedWater.surface + rain * 0.01);
          
          const toSoil = storedWater.surface * swmmParams.soilConductivity[0] / 100;
          storedWater.surface -= toSoil;
          storedWater.soil = Math.min(1, storedWater.soil + toSoil);
          
          const toStorage = storedWater.soil * swmmParams.storageVoid[0] * 0.1;
          storedWater.soil -= toStorage;
          storedWater.storage = Math.min(1, storedWater.storage + toStorage);
          
          const drainOut = storedWater.storage * swmmParams.drainCoeff[0] * 0.1;
          storedWater.storage -= drainOut;
          
          const swmmTotal = surfaceOverflow + drainOut * 10;
          setSwmmOutflow(p => [...p, swmmTotal].slice(-120));
          
          const icmInflow = rain * icmParams.subcatchArea[0] / 10000;
          const icmStorageOut = Math.min(icmInflow, icmParams.orificeSize[0] / 1000);
          const icmInfil = icmParams.soakawayRate[0] / 100;
          const icmTotal = Math.max(0, icmInflow - icmStorageOut - icmInfil) * 100;
          setIcmOutflow(p => [...p, icmTotal].slice(-120));
          
          setWaterLevels({ ...storedWater });
          
          return prev + 1;
        });
      }, 100);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isAnimating, swmmParams, icmParams]);

  const reset = () => {
    setIsAnimating(false);
    setTime(0);
    setSwmmOutflow([]);
    setIcmOutflow([]);
    setWaterLevels({ surface: 0, soil: 0, storage: 0 });
  };

  const config = practiceConfigs[practice];

  return (
    <Card className="w-full" data-testid="lid-suds-diagram">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-green-500" />
          LID Controls (SWMM5) vs SUDS (ICM InfoWorks)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium">Practice Type:</span>
          <Select value={practice} onValueChange={(v) => { setPractice(v as LIDPractice); reset(); }}>
            <SelectTrigger className="w-48" data-testid="select-practice">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(practiceConfigs).map(([key, val]) => (
                <SelectItem key={key} value={key}>{val.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Badge variant="outline">t = {time}s</Badge>
          <Badge>Rain: {getRainfall(time).toFixed(0)} mm/hr</Badge>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
              <Layers className="w-4 h-4" />
              <span className="font-medium">SWMM5 LID Control</span>
              <Badge variant="secondary">Vertical Layers</Badge>
            </div>
            
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <div className="relative h-48">
                {config.layers.map((layer, i) => (
                  <motion.div
                    key={layer}
                    className="absolute left-0 right-0 border-2 border-blue-300 rounded flex items-center justify-center text-xs font-medium"
                    style={{
                      top: `${i * 25}%`,
                      height: "23%",
                      backgroundColor: i === 0 ? `rgba(96, 165, 250, ${0.3 + waterLevels.surface})` :
                                       i === 1 ? `rgba(34, 197, 94, ${0.3 + waterLevels.soil * 0.5})` :
                                       i === 2 ? `rgba(168, 162, 158, ${0.3 + waterLevels.storage * 0.5})` :
                                       "rgba(59, 130, 246, 0.3)"
                    }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    {layer}
                    {i < 3 && <ArrowDown className="absolute -bottom-3 w-4 h-4 text-blue-500 z-10" />}
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="w-36">Surface Roughness:</span>
                <Slider value={swmmParams.surfaceRoughness} onValueChange={v => setSwmmParams(p => ({...p, surfaceRoughness: v}))} min={0.01} max={0.3} step={0.01} className="flex-1" data-testid="slider-swmm-roughness" />
                <span className="w-12 text-right">{swmmParams.surfaceRoughness[0]}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-36">Soil Thickness (mm):</span>
                <Slider value={swmmParams.soilThickness} onValueChange={v => setSwmmParams(p => ({...p, soilThickness: v}))} min={50} max={500} step={10} className="flex-1" data-testid="slider-swmm-thickness" />
                <span className="w-12 text-right">{swmmParams.soilThickness[0]}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-36">Conductivity (mm/hr):</span>
                <Slider value={swmmParams.soilConductivity} onValueChange={v => setSwmmParams(p => ({...p, soilConductivity: v}))} min={1} max={50} step={1} className="flex-1" data-testid="slider-swmm-conductivity" />
                <span className="w-12 text-right">{swmmParams.soilConductivity[0]}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-36">Storage Void Ratio:</span>
                <Slider value={swmmParams.storageVoid} onValueChange={v => setSwmmParams(p => ({...p, storageVoid: v}))} min={0.3} max={0.9} step={0.05} className="flex-1" data-testid="slider-swmm-void" />
                <span className="w-12 text-right">{swmmParams.storageVoid[0]}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-36">Drain Coefficient:</span>
                <Slider value={swmmParams.drainCoeff} onValueChange={v => setSwmmParams(p => ({...p, drainCoeff: v}))} min={0.1} max={2} step={0.1} className="flex-1" data-testid="slider-swmm-drain" />
                <span className="w-12 text-right">{swmmParams.drainCoeff[0]}</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
              <Network className="w-4 h-4" />
              <span className="font-medium">ICM InfoWorks SUDS</span>
              <Badge variant="secondary">Network Objects</Badge>
            </div>
            
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <div className="relative h-48">
                <div className="absolute top-0 left-4 w-20 h-16 border-2 border-green-500 rounded bg-green-100 dark:bg-green-800 flex items-center justify-center text-xs">
                  <div className="text-center">
                    <CircleDot className="w-4 h-4 mx-auto mb-1" />
                    Subcatchment
                  </div>
                </div>
                <ArrowRight className="absolute top-6 left-28 w-6 h-6 text-green-500" />
                
                <div className="absolute top-0 left-36 w-20 h-24 border-2 border-green-500 rounded bg-green-200 dark:bg-green-700 flex items-center justify-center text-xs">
                  <div className="text-center">
                    <Droplets className="w-4 h-4 mx-auto mb-1" />
                    Storage Node
                  </div>
                </div>
                <ArrowDown className="absolute top-[100px] left-44 w-6 h-6 text-green-500" />
                
                <div className="absolute top-32 left-36 w-20 h-12 border-2 border-green-500 rounded-full bg-green-300 dark:bg-green-600 flex items-center justify-center text-xs">
                  Orifice
                </div>
                <ArrowDown className="absolute top-44 left-44 w-6 h-6 text-green-500" />
                
                <div className="absolute bottom-0 left-28 w-28 h-10 border-2 border-green-500 rounded bg-amber-100 dark:bg-amber-800 flex items-center justify-center text-xs">
                  Soakaway/Outfall
                </div>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="w-36">Subcatch Area (m²):</span>
                <Slider value={icmParams.subcatchArea} onValueChange={v => setIcmParams(p => ({...p, subcatchArea: v}))} min={10} max={500} step={10} className="flex-1" data-testid="slider-icm-area" />
                <span className="w-12 text-right">{icmParams.subcatchArea[0]}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-36">Storage Depth (m):</span>
                <Slider value={icmParams.storageDepth} onValueChange={v => setIcmParams(p => ({...p, storageDepth: v}))} min={0.1} max={1} step={0.05} className="flex-1" data-testid="slider-icm-depth" />
                <span className="w-12 text-right">{icmParams.storageDepth[0]}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-36">Orifice Size (mm):</span>
                <Slider value={icmParams.orificeSize} onValueChange={v => setIcmParams(p => ({...p, orificeSize: v}))} min={10} max={200} step={5} className="flex-1" data-testid="slider-icm-orifice" />
                <span className="w-12 text-right">{icmParams.orificeSize[0]}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-36">Soakaway Rate (mm/hr):</span>
                <Slider value={icmParams.soakawayRate} onValueChange={v => setIcmParams(p => ({...p, soakawayRate: v}))} min={0} max={50} step={1} className="flex-1" data-testid="slider-icm-soakaway" />
                <span className="w-12 text-right">{icmParams.soakawayRate[0]}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-muted p-4 rounded-lg">
          <h4 className="font-medium mb-2">Outflow Hydrograph Comparison</h4>
          <svg viewBox="0 0 400 120" className="w-full h-28">
            <line x1="40" y1="100" x2="380" y2="100" stroke="currentColor" strokeWidth="1" />
            <line x1="40" y1="10" x2="40" y2="100" stroke="currentColor" strokeWidth="1" />
            <text x="210" y="118" textAnchor="middle" className="text-[10px] fill-muted-foreground">Time</text>
            <text x="15" y="55" textAnchor="middle" className="text-[10px] fill-muted-foreground" transform="rotate(-90, 15, 55)">Flow</text>
            
            <polyline
              points={swmmOutflow.map((v, i) => `${40 + i * 2.8},${100 - v * 2}`).join(" ")}
              fill="none"
              stroke="#3b82f6"
              strokeWidth="2"
            />
            <polyline
              points={icmOutflow.map((v, i) => `${40 + i * 2.8},${100 - v * 2}`).join(" ")}
              fill="none"
              stroke="#22c55e"
              strokeWidth="2"
              strokeDasharray="4"
            />
            
            <rect x="280" y="5" width="10" height="3" fill="#3b82f6" />
            <text x="295" y="10" className="text-[9px] fill-foreground">SWMM5 LID</text>
            <rect x="280" y="15" width="10" height="3" fill="#22c55e" />
            <text x="295" y="20" className="text-[9px] fill-foreground">ICM SUDS</text>
          </svg>
        </div>

        <div className="flex gap-2">
          <Button onClick={() => setIsAnimating(!isAnimating)} data-testid="btn-toggle-lid">
            {isAnimating ? "Pause" : "Start"} Simulation
          </Button>
          <Button variant="outline" onClick={reset} data-testid="btn-reset-lid">Reset</Button>
        </div>

        <div className="bg-amber-50 dark:bg-amber-900/20 p-3 rounded text-sm">
          <strong>Key Difference:</strong> SWMM5 LIDs are pre-packaged vertical columns with specialized algorithms.
          ICM SUDS are flexible networks using standard hydraulic objects (nodes, links, storage). 
          Try adjusting parameters to match the outflow curves!
        </div>
      </CardContent>
    </Card>
  );
}

export function DualSolverArchitectureDiagram() {
  const [selectedNetwork, setSelectedNetwork] = useState<"network1" | "network2" | null>(null);
  const [solverAssignments, setSolverAssignments] = useState<Record<string, "icm" | "swmm">>({
    network1: "icm",
    network2: "swmm"
  });
  const [isSimulating, setIsSimulating] = useState(false);
  const [time, setTime] = useState(0);
  const [flows, setFlows] = useState<Record<string, number[]>>({ network1: [], network2: [] });
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const assignSolver = (solver: "icm" | "swmm") => {
    if (selectedNetwork) {
      setSolverAssignments(prev => ({ ...prev, [selectedNetwork]: solver }));
    }
  };

  useEffect(() => {
    if (isSimulating) {
      intervalRef.current = setInterval(() => {
        setTime(prev => {
          const newFlows: Record<string, number[]> = { ...flows };
          
          const baseFlow = Math.sin(prev * 0.1) * 20 + 30;
          
          if (solverAssignments.network1 === "icm") {
            const adaptiveNoise = Math.sin(prev * 0.3) * 3;
            newFlows.network1 = [...(flows.network1 || []), baseFlow + adaptiveNoise].slice(-100);
          } else {
            const fixedNoise = (prev % 10 < 5 ? 2 : -2);
            newFlows.network1 = [...(flows.network1 || []), baseFlow + fixedNoise].slice(-100);
          }
          
          const phase = 0.5;
          const baseFlow2 = Math.sin(prev * 0.1 + phase) * 15 + 25;
          
          if (solverAssignments.network2 === "icm") {
            const adaptiveNoise = Math.sin(prev * 0.25) * 2;
            newFlows.network2 = [...(flows.network2 || []), baseFlow2 + adaptiveNoise].slice(-100);
          } else {
            const fixedNoise = (prev % 8 < 4 ? 1.5 : -1.5);
            newFlows.network2 = [...(flows.network2 || []), baseFlow2 + fixedNoise].slice(-100);
          }
          
          setFlows(newFlows);
          return prev + 1;
        });
      }, 100);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isSimulating, solverAssignments]);

  const reset = () => {
    setIsSimulating(false);
    setTime(0);
    setFlows({ network1: [], network2: [] });
  };

  const NetworkBox = ({ id, name, xPos, yPos }: { id: "network1" | "network2"; name: string; xPos: number; yPos: number }) => {
    const solver = solverAssignments[id];
    const isSelected = selectedNetwork === id;
    
    return (
      <motion.g 
        onClick={() => setSelectedNetwork(id)} 
        className="cursor-pointer"
        data-testid={`network-${id}`}
        initial={{ opacity: 1 }}
        whileHover={{ scale: 1.02 }}
      >
        <rect
          x={xPos}
          y={yPos}
          width={140}
          height={80}
          rx={8}
          fill={solver === "icm" ? "#3b82f6" : "#22c55e"}
          stroke={isSelected ? "#fbbf24" : "#666"}
          strokeWidth={isSelected ? 4 : 2}
        />
        <text x={xPos + 70} y={yPos + 25} textAnchor="middle" className="text-sm fill-white font-medium">
          {name}
        </text>
        <text x={xPos + 70} y={yPos + 45} textAnchor="middle" className="text-xs fill-white/80">
          {solver === "icm" ? "ICM Native Solver" : "SWMM5 Engine"}
        </text>
        <text x={xPos + 70} y={yPos + 65} textAnchor="middle" className="text-[10px] fill-white/60">
          {solver === "icm" ? "Preissmann Slot" : "Node-Link Method"}
        </text>
      </motion.g>
    );
  };

  return (
    <Card className="w-full" data-testid="dual-solver-diagram">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Network className="w-5 h-5 text-purple-500" />
          ICM Dual-Solver Architecture: Native vs Embedded SWMM5 Engine
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4 flex-wrap">
          <span className="text-sm">Click a network to select, then assign a solver:</span>
          <Button
            size="sm"
            variant={selectedNetwork && solverAssignments[selectedNetwork] === "icm" ? "default" : "outline"}
            className="bg-blue-500 hover:bg-blue-600"
            onClick={() => assignSolver("icm")}
            disabled={!selectedNetwork}
            data-testid="btn-assign-icm"
          >
            Use ICM Solver
          </Button>
          <Button
            size="sm"
            variant={selectedNetwork && solverAssignments[selectedNetwork] === "swmm" ? "default" : "outline"}
            className="bg-green-500 hover:bg-green-600"
            onClick={() => assignSolver("swmm")}
            disabled={!selectedNetwork}
            data-testid="btn-assign-swmm"
          >
            Use SWMM5 Engine
          </Button>
          <Badge variant="outline">t = {time}</Badge>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4">
            <svg viewBox="0 0 400 200" className="w-full h-48">
              <rect x="0" y="0" width="400" height="200" fill="none" />
              
              <text x="200" y="15" textAnchor="middle" className="text-xs fill-muted-foreground">City Drainage Network Map</text>
              
              <NetworkBox id="network1" name="Combined Sewer" xPos={30} yPos={40} />
              <NetworkBox id="network2" name="Storm Channel" xPos={220} yPos={40} />
              
              <motion.g
                initial={{ opacity: 0.5 }}
                animate={{ opacity: isSimulating ? [0.5, 1, 0.5] : 0.8 }}
                transition={{ repeat: Infinity, duration: 1 }}
              >
                <rect x="155" y="140" width="90" height="40" rx="4" fill="#a855f7" stroke="#7c3aed" strokeWidth="2" />
                <text x="200" y="163" textAnchor="middle" className="text-xs fill-white font-medium">Transfer Node</text>
              </motion.g>
              
              <line x1="100" y1="120" x2="175" y2="140" stroke="#666" strokeWidth="2" strokeDasharray="4" />
              <line x1="290" y1="120" x2="225" y2="140" stroke="#666" strokeWidth="2" strokeDasharray="4" />

              <circle cx="60" cy="100" r="6" fill="#94a3b8" />
              <circle cx="100" cy="80" r="6" fill="#94a3b8" />
              <circle cx="140" cy="100" r="6" fill="#94a3b8" />
              <line x1="60" y1="100" x2="100" y2="80" stroke="#64748b" strokeWidth="2" />
              <line x1="100" y1="80" x2="140" y2="100" stroke="#64748b" strokeWidth="2" />
              
              <circle cx="260" cy="100" r="6" fill="#94a3b8" />
              <circle cx="300" cy="80" r="6" fill="#94a3b8" />
              <circle cx="340" cy="100" r="6" fill="#94a3b8" />
              <line x1="260" y1="100" x2="300" y2="80" stroke="#64748b" strokeWidth="2" />
              <line x1="300" y1="80" x2="340" y2="100" stroke="#64748b" strokeWidth="2" />
            </svg>
          </div>

          <div className="space-y-4">
            <div className="bg-muted p-3 rounded-lg">
              <h4 className="font-medium text-sm mb-2">Solver Characteristics</h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded">
                  <strong className="text-blue-600 dark:text-blue-400">ICM Native</strong>
                  <ul className="mt-1 space-y-0.5 text-muted-foreground">
                    <li>• Preissmann Slot</li>
                    <li>• Adaptive Δt</li>
                    <li>• Full St-Venant</li>
                  </ul>
                </div>
                <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded">
                  <strong className="text-green-600 dark:text-green-400">SWMM5 Engine</strong>
                  <ul className="mt-1 space-y-0.5 text-muted-foreground">
                    <li>• Node-Link Method</li>
                    <li>• Fixed/User Δt</li>
                    <li>• Dynamic Wave</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-muted p-3 rounded-lg">
              <h4 className="font-medium text-sm mb-2">Simulation Results</h4>
              <svg viewBox="0 0 200 80" className="w-full h-20">
                <line x1="20" y1="70" x2="190" y2="70" stroke="currentColor" strokeWidth="1" />
                <line x1="20" y1="10" x2="20" y2="70" stroke="currentColor" strokeWidth="1" />
                
                <polyline
                  points={flows.network1.map((v, i) => `${20 + i * 1.7},${70 - v}`).join(" ")}
                  fill="none"
                  stroke={solverAssignments.network1 === "icm" ? "#3b82f6" : "#22c55e"}
                  strokeWidth="1.5"
                />
                <polyline
                  points={flows.network2.map((v, i) => `${20 + i * 1.7},${70 - v}`).join(" ")}
                  fill="none"
                  stroke={solverAssignments.network2 === "icm" ? "#3b82f6" : "#22c55e"}
                  strokeWidth="1.5"
                  strokeDasharray="3"
                />
              </svg>
              <div className="flex gap-4 text-xs mt-1">
                <span>— Combined Sewer ({solverAssignments.network1.toUpperCase()})</span>
                <span>--- Storm Channel ({solverAssignments.network2.toUpperCase()})</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button onClick={() => setIsSimulating(!isSimulating)} data-testid="btn-toggle-dual">
            {isSimulating ? "Pause" : "Run"} Simulation
          </Button>
          <Button variant="outline" onClick={reset} data-testid="btn-reset-dual">Reset</Button>
        </div>

        <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded text-sm">
          <strong>Key Concept:</strong> ICM can host multiple solver engines in one project. The <span className="text-purple-600 font-medium">Transfer Node</span> manages 
          data exchange between networks using different hydraulic cores. This enables legacy SWMM model integration while using ICM's 
          advanced solver for new areas.
        </div>
      </CardContent>
    </Card>
  );
}
