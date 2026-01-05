import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { FileText, Cpu, PlayCircle, Beaker, Droplets, ArrowDownUp, Gauge, FileOutput, AlertTriangle, CheckCircle2, Code } from "lucide-react";

export function InputFileParserDiagram() {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [parsedNodes, setParsedNodes] = useState<Array<{id: string, elevation: string, maxDepth: string}>>([]);
  const [errorLine, setErrorLine] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [parseStep, setParseStep] = useState(0);
  
  const inpFileContent = `[TITLE]
Simple Network Model

[OPTIONS]
FLOW_UNITS  CFS
ROUTING_STEP  00:00:30

[JUNCTIONS]
;;ID     Elev   MaxDepth
J1       100.0  6.0
J2       98.5   5.5
J3       BAD    4.0

[CONDUITS]
;;ID     From   To     Length
C1       J1     J2     500
C2       J2     J3     400`;

  const sections = ["TITLE", "OPTIONS", "JUNCTIONS", "CONDUITS"];
  
  const parseSection = (section: string) => {
    setActiveSection(section);
    setErrorLine(null);
    setErrorMessage("");
    setParsedNodes([]);
    setParseStep(0);
    
    if (section === "JUNCTIONS") {
      let step = 0;
      const interval = setInterval(() => {
        step++;
        setParseStep(step);
        
        if (step === 1) {
          setParsedNodes([{ id: "J1", elevation: "100.0", maxDepth: "6.0" }]);
        } else if (step === 2) {
          setParsedNodes(prev => [...prev, { id: "J2", elevation: "98.5", maxDepth: "5.5" }]);
        } else if (step === 3) {
          setErrorLine(12);
          setErrorMessage("ERROR 234: Invalid number format in elevation field for junction J3");
          clearInterval(interval);
        }
      }, 800);
    }
  };
  
  const reset = () => {
    setActiveSection(null);
    setParsedNodes([]);
    setErrorLine(null);
    setErrorMessage("");
    setParseStep(0);
  };

  return (
    <Card className="border-2 border-orange-500/30 bg-gradient-to-br from-orange-500/5 to-background">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <FileText className="h-5 w-5 text-orange-500" />
          Input File Parser & Network Object Builder
          <Badge variant="outline" className="ml-auto text-orange-600 border-orange-500">SWMM5 Architecture</Badge>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          How SWMM5 reads .inp files and builds internal C structures
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Input File (.inp)</span>
              <div className="flex gap-1">
                {sections.map(s => (
                  <Button
                    key={s}
                    size="sm"
                    variant={activeSection === s ? "default" : "outline"}
                    className="text-xs h-7"
                    onClick={() => parseSection(s)}
                    data-testid={`button-parse-${s.toLowerCase()}`}
                  >
                    [{s}]
                  </Button>
                ))}
              </div>
            </div>
            <div className="bg-slate-900 rounded-lg p-3 font-mono text-xs overflow-auto max-h-72" data-testid="inp-file-content">
              {inpFileContent.split('\n').map((line, i) => (
                <div 
                  key={i} 
                  className={`${
                    errorLine === i + 1 ? 'bg-red-500/30 text-red-300' : 
                    activeSection && line.includes(`[${activeSection}]`) ? 'bg-blue-500/30 text-blue-300' :
                    activeSection === "JUNCTIONS" && i >= 8 && i <= 11 && parseStep > 0 ? 'bg-green-500/20' : ''
                  } px-1`}
                >
                  <span className="text-slate-500 mr-2">{String(i + 1).padStart(2)}</span>
                  {line}
                </div>
              ))}
            </div>
          </div>
          
          <div className="space-y-2">
            <span className="text-sm font-medium">Memory Structures (C structs)</span>
            <div className="bg-slate-800 rounded-lg p-3 min-h-72 space-y-3">
              <AnimatePresence mode="popLayout">
                {parsedNodes.map((node, i) => (
                  <motion.div
                    key={node.id}
                    initial={{ opacity: 0, x: 20, scale: 0.9 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    className="bg-slate-700 rounded p-2 border border-green-500/50"
                    data-testid={`struct-node-${node.id}`}
                  >
                    <div className="text-xs text-green-400 font-mono mb-1">tNode *{node.id}</div>
                    <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                      <div className="bg-slate-800 rounded px-2 py-1">
                        <span className="text-slate-400">ID:</span> <span className="text-blue-300">{node.id}</span>
                      </div>
                      <div className="bg-slate-800 rounded px-2 py-1">
                        <span className="text-slate-400">elev:</span> <span className="text-yellow-300">{node.elevation}</span>
                      </div>
                      <div className="bg-slate-800 rounded px-2 py-1">
                        <span className="text-slate-400">maxDepth:</span> <span className="text-purple-300">{node.maxDepth}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {errorMessage && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-900/50 border border-red-500 rounded p-2 mt-4"
                  data-testid="text-error-message"
                >
                  <div className="flex items-center gap-2 text-red-400 text-xs font-mono">
                    <AlertTriangle className="h-4 w-4" />
                    {errorMessage}
                  </div>
                </motion.div>
              )}
              
              {!activeSection && (
                <div className="flex items-center justify-center h-full text-slate-500 text-sm">
                  Click a section to parse
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <Button size="sm" variant="outline" onClick={reset} data-testid="button-reset-parser">
            Reset
          </Button>
          <div className="text-xs text-muted-foreground">
            <Badge variant="secondary" className="mr-2">ICM Contrast</Badge>
            Uses database-centric object model instead of text parsing
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function MatrixSolverDiagram() {
  const [step, setStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [matrix, setMatrix] = useState<number[][]>([[0, 0], [0, 0]]);
  const [vectorB, setVectorB] = useState<number[]>([0, 0]);
  const [solution, setSolution] = useState<number[]>([0, 0]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  
  const nodes = [
    { id: "N1", x: 30, y: 90, head: 10.0, type: "boundary" },
    { id: "N2", x: 100, y: 90, head: 0, type: "unknown" },
    { id: "N3", x: 170, y: 90, head: 0, type: "unknown" },
  ];
  
  const links = [
    { id: "L12", from: 0, to: 1, flow: 0 },
    { id: "L23", from: 1, to: 2, flow: 0 },
  ];
  
  const solveStep = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setStep(0);
    
    let currentStep = 0;
    intervalRef.current = setInterval(() => {
      currentStep++;
      setStep(currentStep);
      
      if (currentStep === 1) {
        // Step 1: Show unknowns
      } else if (currentStep === 2) {
        // Step 2: Build equations
      } else if (currentStep === 3) {
        // Step 3: Populate matrix
        setMatrix([[2.5, -1.0], [-1.0, 2.5]]);
        setVectorB([10.0, 5.0]);
      } else if (currentStep === 4) {
        // Step 4: Solve (Gaussian elimination visualization)
      } else if (currentStep === 5) {
        // Step 5: Solution
        setSolution([6.43, 3.57]);
        if (intervalRef.current) clearInterval(intervalRef.current);
        intervalRef.current = null;
        setIsAnimating(false);
      }
    }, 1200);
  };
  
  const reset = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = null;
    setStep(0);
    setIsAnimating(false);
    setMatrix([[0, 0], [0, 0]]);
    setVectorB([0, 0]);
    setSolution([0, 0]);
  };
  
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <Card className="border-2 border-red-500/30 bg-gradient-to-br from-red-500/5 to-background">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Cpu className="h-5 w-5 text-red-500" />
          Dynamic Wave Routing Matrix & Solver
          <Badge variant="outline" className="ml-auto text-red-600 border-red-500">The Engine Room</Badge>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Visualizing the Ax = b linear system assembly and solution
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="relative h-48 bg-gradient-to-b from-slate-100/20 to-slate-200/20 dark:from-slate-800/20 dark:to-slate-900/20 rounded-lg border border-border overflow-hidden">
            <svg className="w-full h-full" viewBox="0 0 200 120" data-testid="svg-network">
              {links.map((link, i) => (
                <g key={link.id}>
                  <line
                    x1={nodes[link.from].x}
                    y1={nodes[link.from].y}
                    x2={nodes[link.to].x}
                    y2={nodes[link.to].y}
                    className={`stroke-2 ${step >= 1 ? 'stroke-blue-400' : 'stroke-slate-400'}`}
                  />
                  <text x={(nodes[link.from].x + nodes[link.to].x) / 2} y={70} textAnchor="middle" className="text-[8px] fill-slate-500">
                    {link.id}
                  </text>
                  {step >= 1 && (
                    <text x={(nodes[link.from].x + nodes[link.to].x) / 2} y={105} textAnchor="middle" className="text-[8px] fill-blue-400">
                      Q{i + 1}=?
                    </text>
                  )}
                </g>
              ))}
              
              {nodes.map((node, i) => (
                <g key={node.id}>
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={12}
                    className={`${node.type === 'boundary' ? 'fill-green-500' : step >= 1 ? 'fill-yellow-500' : 'fill-slate-500'}`}
                  />
                  <text x={node.x} y={node.y + 3} textAnchor="middle" className="text-[8px] fill-white font-bold">
                    {node.id}
                  </text>
                  {step >= 1 && node.type === "unknown" && (
                    <text x={node.x} y={node.y - 18} textAnchor="middle" className="text-[8px] fill-yellow-400">
                      H{i}=?
                    </text>
                  )}
                  {step >= 5 && node.type === "unknown" && (
                    <text x={node.x} y={node.y + 25} textAnchor="middle" className="text-[8px] fill-green-400 font-bold">
                      {solution[i - 1]?.toFixed(2)}
                    </text>
                  )}
                </g>
              ))}
              
              <text x={10} y={15} className="text-[9px] fill-slate-400">3-Node Network</text>
            </svg>
          </div>
          
          <div className="space-y-3">
            <div className="bg-slate-800 rounded-lg p-3 font-mono text-xs">
              <div className="text-slate-400 mb-2">Step {step}/5: {
                step === 0 ? "Ready" :
                step === 1 ? "Identify unknowns (H2, H3)" :
                step === 2 ? "Write continuity + momentum eqns" :
                step === 3 ? "Build matrix coefficients" :
                step === 4 ? "Gaussian elimination..." :
                "Solution found!"
              }</div>
              
              {step >= 3 && (
                <div className="flex items-center gap-2 mt-2">
                  <div className="border border-slate-600 rounded p-1">
                    <div className="grid grid-cols-2 gap-1 text-center">
                      {matrix.map((row, i) => (
                        <div key={i} className="contents">
                          {row.map((val, j) => (
                            <motion.div
                              key={`${i}-${j}`}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="w-10 text-blue-300"
                            >
                              {val.toFixed(1)}
                            </motion.div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                  <span className="text-slate-500">×</span>
                  <div className="border border-slate-600 rounded p-1">
                    <div className="text-yellow-300">
                      <div>H2</div>
                      <div>H3</div>
                    </div>
                  </div>
                  <span className="text-slate-500">=</span>
                  <div className="border border-slate-600 rounded p-1">
                    <div className="text-green-300">
                      {vectorB.map((v, i) => <div key={i}>{v.toFixed(1)}</div>)}
                    </div>
                  </div>
                </div>
              )}
              
              {step >= 5 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-3 p-2 bg-green-900/30 border border-green-500/50 rounded"
                  data-testid="text-solution"
                >
                  <div className="text-green-400">H2 = {solution[0]} ft, H3 = {solution[1]} ft</div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <Button size="sm" onClick={solveStep} disabled={isAnimating} data-testid="button-solve-step">
              <PlayCircle className="h-4 w-4 mr-1" />
              Solve Time Step
            </Button>
            <Button size="sm" variant="outline" onClick={reset} data-testid="button-reset-solver">
              Reset
            </Button>
          </div>
          <div className="text-xs text-muted-foreground">
            <Badge variant="secondary" className="mr-2">ICM</Badge>
            Uses distributed solver with larger matrix system
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function RTCRulesDiagram() {
  const [isRunning, setIsRunning] = useState(false);
  const [simTime, setSimTime] = useState(0);
  const [nodeDepth, setNodeDepth] = useState(1.0);
  const [pumpStatus, setPumpStatus] = useState(false);
  const [ruleTriggered, setRuleTriggered] = useState<string | null>(null);
  const [flowRate, setFlowRate] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  
  const rules = [
    { id: "R1", condition: "NODE 123 DEPTH > 2.0", action: "PUMP P45 STATUS = ON" },
    { id: "R2", condition: "NODE 123 DEPTH < 1.0", action: "PUMP P45 STATUS = OFF" },
  ];
  
  const runSimulation = () => {
    if (isRunning) return;
    setIsRunning(true);
    setSimTime(0);
    setNodeDepth(1.0);
    setPumpStatus(false);
    setFlowRate(0);
    setRuleTriggered(null);
    
    intervalRef.current = setInterval(() => {
      setSimTime(t => {
        const newTime = t + 300;
        
        setNodeDepth(d => {
          const inflow = 0.05;
          const outflow = pumpStatus ? 0.08 : 0.02;
          const newDepth = Math.max(0.5, Math.min(4.0, d + inflow - outflow));
          
          if (newDepth > 2.0 && !pumpStatus) {
            setPumpStatus(true);
            setRuleTriggered("R1");
            setFlowRate(5.0);
          } else if (newDepth < 1.0 && pumpStatus) {
            setPumpStatus(false);
            setRuleTriggered("R2");
            setFlowRate(0);
          }
          
          return newDepth;
        });
        
        if (newTime >= 7200) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          intervalRef.current = null;
          setIsRunning(false);
        }
        
        return newTime;
      });
    }, 100);
  };
  
  const reset = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = null;
    setIsRunning(false);
    setSimTime(0);
    setNodeDepth(1.0);
    setPumpStatus(false);
    setFlowRate(0);
    setRuleTriggered(null);
  };
  
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);
  
  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return `${hrs}:${String(mins).padStart(2, '0')}`;
  };

  return (
    <Card className="border-2 border-violet-500/30 bg-gradient-to-br from-violet-500/5 to-background">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <PlayCircle className="h-5 w-5 text-violet-500" />
          Real-Time Control Rule Parser & Execution
          <Badge variant="outline" className="ml-auto text-violet-600 border-violet-500">RTC Engine</Badge>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          How SWMM5 evaluates and executes control rules during simulation
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="text-sm font-medium">Control Rules</div>
            <div className="bg-slate-900 rounded-lg p-3 font-mono text-xs space-y-2">
              {rules.map(rule => (
                <div 
                  key={rule.id}
                  className={`p-2 rounded border ${
                    ruleTriggered === rule.id 
                      ? 'border-green-500 bg-green-500/20' 
                      : 'border-slate-700'
                  }`}
                  data-testid={`rule-${rule.id}`}
                >
                  <div className="text-violet-400">RULE {rule.id}</div>
                  <div className="text-blue-300">  IF {rule.condition}</div>
                  <div className="text-yellow-300">  THEN {rule.action}</div>
                  {ruleTriggered === rule.id && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-green-400 mt-1"
                    >
                      ✓ TRIGGERED
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
            
            <div className="bg-slate-800 rounded-lg p-3 text-xs">
              <div className="flex justify-between mb-2">
                <span className="text-slate-400">Simulation Time:</span>
                <span className="text-white font-mono" data-testid="text-sim-time">{formatTime(simTime)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Node 123 Depth:</span>
                <span className={`font-mono ${nodeDepth > 2 ? 'text-red-400' : 'text-green-400'}`} data-testid="text-node-depth">
                  {nodeDepth.toFixed(2)} ft
                </span>
              </div>
            </div>
          </div>
          
          <div className="relative h-64 bg-gradient-to-b from-slate-100/20 to-slate-200/20 dark:from-slate-800/20 dark:to-slate-900/20 rounded-lg border border-border overflow-hidden">
            <svg className="w-full h-full" viewBox="0 0 200 160" data-testid="svg-pump-station">
              <rect x="30" y="40" width="60" height="80" rx="5" className="fill-slate-600 stroke-slate-400" />
              <text x="60" y="35" textAnchor="middle" className="text-[9px] fill-slate-400">Node 123</text>
              
              <motion.rect
                x="32"
                y={120 - nodeDepth * 18}
                width="56"
                height={nodeDepth * 18}
                className="fill-blue-500/60"
                initial={{ height: 18 }}
                animate={{ height: nodeDepth * 18, y: 120 - nodeDepth * 18 }}
              />
              
              <line x1="68" y1="80" x2="68" y2="40" className="stroke-yellow-400 stroke-dashed" strokeWidth="1" strokeDasharray="3,3" />
              <text x="75" y="65" className="text-[7px] fill-yellow-400">2.0 ft</text>
              
              <g transform="translate(120, 70)">
                <rect x="0" y="0" width="40" height="30" rx="3" className={`${pumpStatus ? 'fill-green-600' : 'fill-slate-700'} stroke-slate-400`} />
                <text x="20" y="18" textAnchor="middle" className="text-[8px] fill-white font-bold">P45</text>
                {pumpStatus && (
                  <motion.g
                    initial={{ rotate: 0 }}
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  >
                    <circle cx="20" cy="40" r="8" className="fill-none stroke-green-400" strokeWidth="2" />
                    <line x1="20" y1="32" x2="20" y2="48" className="stroke-green-400" strokeWidth="2" />
                  </motion.g>
                )}
              </g>
              
              {pumpStatus && (
                <motion.path
                  d="M90 85 L115 85"
                  className="stroke-blue-400"
                  strokeWidth="3"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ repeat: Infinity, duration: 0.5 }}
                />
              )}
              
              <text x="140" y="120" textAnchor="middle" className="text-[8px] fill-slate-400">
                {pumpStatus ? `Flow: ${flowRate} cfs` : "Pump OFF"}
              </text>
            </svg>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <Button size="sm" onClick={runSimulation} disabled={isRunning} data-testid="button-run-rtc">
              <PlayCircle className="h-4 w-4 mr-1" />
              Run Simulation
            </Button>
            <Button size="sm" variant="outline" onClick={reset} data-testid="button-reset-rtc">
              Reset
            </Button>
          </div>
          <div className="text-xs text-muted-foreground">
            <Badge variant="secondary" className="mr-2">ICM</Badge>
            More sophisticated control editors with PID logic
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function MassRoutingDiagram() {
  const [isAnimating, setIsAnimating] = useState(false);
  const [inflowConc, setInflowConc] = useState([50]);
  const [decayCoeff, setDecayCoeff] = useState([0.1]);
  const [parcelPosition, setParcelPosition] = useState(0);
  const [concentrations, setConcentrations] = useState<number[]>([]);
  const [showMixing, setShowMixing] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  
  const advanceFlow = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setParcelPosition(0);
    setConcentrations([inflowConc[0]]);
    
    let pos = 0;
    intervalRef.current = setInterval(() => {
      pos += 5;
      setParcelPosition(pos);
      
      const travelTime = pos / 50;
      const k = decayCoeff[0];
      const newConc = inflowConc[0] * Math.exp(-k * travelTime);
      setConcentrations(prev => [...prev, newConc]);
      
      if (pos >= 100) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        intervalRef.current = null;
        setIsAnimating(false);
      }
    }, 200);
  };
  
  const reset = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = null;
    setIsAnimating(false);
    setParcelPosition(0);
    setConcentrations([]);
  };
  
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);
  
  const currentConc = concentrations.length > 0 
    ? concentrations[concentrations.length - 1] 
    : inflowConc[0];

  return (
    <Card className="border-2 border-teal-500/30 bg-gradient-to-br from-teal-500/5 to-background">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Beaker className="h-5 w-5 text-teal-500" />
          Water Quality Mass Routing & Reaction Kinetics
          <Badge variant="outline" className="ml-auto text-teal-600 border-teal-500">Quality Transport</Badge>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Pollutant transport, mixing, and first-order decay in conveyance
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid md:grid-cols-3 gap-4">
          <div className="space-y-3">
            <div className="space-y-2">
              <Label className="text-xs">Inflow Concentration (mg/L)</Label>
              <Slider
                value={inflowConc}
                onValueChange={setInflowConc}
                min={10}
                max={100}
                step={5}
                disabled={isAnimating}
                data-testid="slider-inflow-conc"
              />
              <div className="text-xs text-muted-foreground text-center">{inflowConc[0]} mg/L</div>
            </div>
            
            <div className="space-y-2">
              <Label className="text-xs">Decay Coefficient k (1/hr)</Label>
              <Slider
                value={decayCoeff}
                onValueChange={setDecayCoeff}
                min={0}
                max={0.5}
                step={0.05}
                disabled={isAnimating}
                data-testid="slider-decay-coeff"
              />
              <div className="text-xs text-muted-foreground text-center">k = {decayCoeff[0].toFixed(2)}</div>
            </div>
            
            <div className="bg-slate-800 rounded p-2 text-xs font-mono">
              <div className="text-teal-400">First-Order Decay:</div>
              <div className="text-white">C(t) = C₀ × e^(-k×t)</div>
            </div>
          </div>
          
          <div className="md:col-span-2 relative h-52 bg-gradient-to-b from-slate-100/20 to-slate-200/20 dark:from-slate-800/20 dark:to-slate-900/20 rounded-lg border border-border overflow-hidden">
            <svg className="w-full h-full" viewBox="0 0 220 130" data-testid="svg-mass-routing">
              <rect x="20" y="60" width="180" height="30" rx="15" className="fill-slate-600 stroke-slate-400" />
              <text x="110" y="52" textAnchor="middle" className="text-[9px] fill-slate-400">Pipe Segment (L = 500 ft)</text>
              
              {parcelPosition > 0 && (
                <motion.rect
                  x={20 + parcelPosition * 1.6}
                  y="65"
                  width="20"
                  height="20"
                  rx="3"
                  className="fill-teal-500"
                  style={{ opacity: currentConc / inflowConc[0] }}
                  initial={{ x: 20, opacity: 1 }}
                  animate={{ x: 20 + parcelPosition * 1.6, opacity: currentConc / inflowConc[0] }}
                />
              )}
              
              <text x="20" y="105" className="text-[8px] fill-teal-400">0 ft</text>
              <text x="110" y="105" textAnchor="middle" className="text-[8px] fill-teal-400">250 ft</text>
              <text x="195" y="105" textAnchor="end" className="text-[8px] fill-teal-400">500 ft</text>
              
              {concentrations.length > 1 && (
                <g>
                  <polyline
                    points={concentrations.map((c, i) => 
                      `${20 + i * 8},${45 - (c / inflowConc[0]) * 30}`
                    ).join(' ')}
                    className="fill-none stroke-teal-400 stroke-2"
                  />
                  <text x="110" y="15" textAnchor="middle" className="text-[8px] fill-slate-400">Concentration vs Distance</text>
                </g>
              )}
              
              <text x="110" y="125" textAnchor="middle" className="text-[9px] fill-teal-300" data-testid="text-current-conc">
                Current: {currentConc.toFixed(1)} mg/L
              </text>
            </svg>
          </div>
        </div>
        
        {showMixing && (
          <div className="bg-slate-800 rounded-lg p-3">
            <div className="text-sm font-medium text-teal-400 mb-2">Node Mixing (Complete Mix)</div>
            <div className="font-mono text-xs text-white">
              C_mix = (C₁×Q₁ + C₂×Q₂) / (Q₁ + Q₂)
            </div>
          </div>
        )}
        
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <Button size="sm" onClick={advanceFlow} disabled={isAnimating} data-testid="button-advance-flow">
              <PlayCircle className="h-4 w-4 mr-1" />
              Advance Flow
            </Button>
            <Button size="sm" variant="outline" onClick={reset} data-testid="button-reset-mass">
              Reset
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Switch checked={showMixing} onCheckedChange={setShowMixing} id="show-mixing" />
            <Label htmlFor="show-mixing" className="text-xs">Show Mixing</Label>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function SurchargeCodeDiagram() {
  const [activeTab, setActiveTab] = useState("algorithm");
  const [waterLevel, setWaterLevel] = useState([70]);
  const [method, setMethod] = useState("swmm");
  
  const crownHeight = 80;
  const isSurcharged = waterLevel[0] > crownHeight;
  
  const waveSpeed = method === "preissmann"
    ? isSurcharged ? 150 : 20 + waterLevel[0] * 0.3
    : isSurcharged ? 0 : 20 + waterLevel[0] * 0.3;

  return (
    <Card className="border-2 border-pink-500/30 bg-gradient-to-br from-pink-500/5 to-background">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Code className="h-5 w-5 text-pink-500" />
          Surcharge Algorithm vs Preissmann Slot (Code-Level)
          <Badge variant="outline" className="ml-auto text-pink-600 border-pink-500">Deep Dive</Badge>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Detailed comparison of pressurized flow handling methods
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="algorithm" data-testid="tab-algorithm">Algorithm</TabsTrigger>
            <TabsTrigger value="code" data-testid="tab-code">Code Logic</TabsTrigger>
          </TabsList>
          
          <TabsContent value="algorithm" className="space-y-4">
            <div className="flex items-center gap-4 mb-2">
              <Select value={method} onValueChange={setMethod}>
                <SelectTrigger className="w-48" data-testid="select-surcharge-method">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="swmm">SWMM5 Surcharge</SelectItem>
                  <SelectItem value="preissmann">Preissmann Slot</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex-1">
                <Slider
                  value={waterLevel}
                  onValueChange={setWaterLevel}
                  min={20}
                  max={100}
                  step={1}
                  data-testid="slider-water-level"
                />
              </div>
              <span className="text-sm">{waterLevel[0]}%</span>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="relative h-48 bg-gradient-to-b from-slate-100/20 to-slate-200/20 dark:from-slate-800/20 dark:to-slate-900/20 rounded-lg border border-border overflow-hidden">
                <svg className="w-full h-full" viewBox="0 0 200 120" data-testid="svg-surcharge">
                  <ellipse cx="100" cy="80" rx="60" ry="35" className="fill-slate-700 stroke-slate-500" strokeWidth="2" />
                  
                  {method === "preissmann" && isSurcharged && (
                    <rect x="97" y="25" width="6" height="20" className="fill-slate-600 stroke-pink-400" strokeDasharray="2,2" />
                  )}
                  
                  <clipPath id="pipe-clip">
                    <ellipse cx="100" cy="80" rx="58" ry="33" />
                  </clipPath>
                  
                  <motion.rect
                    x="40"
                    y={115 - waterLevel[0] * 0.7}
                    width="120"
                    height={waterLevel[0] * 0.7}
                    className="fill-blue-500/60"
                    clipPath="url(#pipe-clip)"
                    initial={{ height: 50 }}
                    animate={{ height: waterLevel[0] * 0.7, y: 115 - waterLevel[0] * 0.7 }}
                  />
                  
                  {method === "preissmann" && isSurcharged && (
                    <motion.rect
                      x="98"
                      y="25"
                      width="4"
                      height={45 - (100 - waterLevel[0]) * 0.4}
                      className="fill-blue-500/60"
                      initial={{ height: 0 }}
                      animate={{ height: Math.max(0, 45 - (100 - waterLevel[0]) * 0.4) }}
                    />
                  )}
                  
                  <line x1="40" y1="45" x2="160" y2="45" className="stroke-pink-400 stroke-dashed" strokeDasharray="4,4" />
                  <text x="165" y="48" className="text-[8px] fill-pink-400">Crown</text>
                  
                  <text x="100" y="15" textAnchor="middle" className="text-[9px] fill-slate-300">
                    {method === "preissmann" ? "Preissmann Slot" : "SWMM Surcharge Alg"}
                  </text>
                </svg>
              </div>
              
              <div className="bg-slate-800 rounded-lg p-3 text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Status:</span>
                  <Badge variant={isSurcharged ? "destructive" : "outline"}>
                    {isSurcharged ? "SURCHARGED" : "Free Surface"}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Wave Speed:</span>
                  <span className="text-pink-400 font-mono">{waveSpeed.toFixed(1)} m/s</span>
                </div>
                {method === "swmm" && isSurcharged && (
                  <div className="text-yellow-400 mt-2 p-2 bg-yellow-500/10 rounded">
                    Surcharge algorithm activates - adjusting dQ/dH
                  </div>
                )}
                {method === "preissmann" && (
                  <div className="text-pink-400 mt-2 p-2 bg-pink-500/10 rounded">
                    c = √(g×A/T) → c_slot = √(g×A_slot/T_slot)
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="code" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-slate-900 rounded-lg p-3 text-xs font-mono">
                <div className="text-blue-400 mb-2">// SWMM5 - link.c</div>
                <pre className="text-slate-300 whitespace-pre-wrap">{`void link_setOldHydState(int j)
{
  // Store previous state
  Link[j].oldFlow = Link[j].newFlow;
  Link[j].oldDepth = Link[j].newDepth;
  
  // Check for surcharge
  if (Link[j].newDepth >= 
      Link[j].xsect.yFull)
  {
    Link[j].isSurcharged = TRUE;
  }
}`}</pre>
              </div>
              
              <div className="bg-slate-900 rounded-lg p-3 text-xs font-mono">
                <div className="text-emerald-400 mb-2">// ICM - Preissmann Slot</div>
                <pre className="text-slate-300 whitespace-pre-wrap">{`// Modified area in continuity
A_total = A_pipe + A_slot;
T_total = T_pipe + T_slot;

// Wave celerity transition
if (depth > soffit) {
  // Smooth transition zone
  c = sqrt(g * A_slot / T_slot);
  // ~10x free-surface celerity
}

// Slot width ~2% of diameter`}</pre>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

export function GroundwaterExchangeDiagram() {
  const [aquiferHead, setAquiferHead] = useState([8]);
  const [nodeHead, setNodeHead] = useState([5]);
  const [hydCond] = useState(0.01);
  
  const headDiff = aquiferHead[0] - nodeHead[0];
  const flowRate = hydCond * 100 * headDiff / 2;
  const flowDirection = headDiff > 0 ? "into_pipe" : headDiff < 0 ? "out_of_pipe" : "none";

  return (
    <Card className="border-2 border-amber-500/30 bg-gradient-to-br from-amber-500/5 to-background">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Droplets className="h-5 w-5 text-amber-500" />
          Groundwater & Aquifer Exchange
          <Badge variant="outline" className="ml-auto text-amber-600 border-amber-500">Two-Way Flow</Badge>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Gradient-driven flow between aquifer and drainage system
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="space-y-2">
              <Label className="text-xs">Aquifer Head (ft)</Label>
              <Slider
                value={aquiferHead}
                onValueChange={setAquiferHead}
                min={2}
                max={12}
                step={0.5}
                data-testid="slider-aquifer-head"
              />
              <div className="text-xs text-muted-foreground text-center">{aquiferHead[0]} ft</div>
            </div>
            
            <div className="space-y-2">
              <Label className="text-xs">Node Head (ft)</Label>
              <Slider
                value={nodeHead}
                onValueChange={setNodeHead}
                min={2}
                max={12}
                step={0.5}
                data-testid="slider-node-head"
              />
              <div className="text-xs text-muted-foreground text-center">{nodeHead[0]} ft</div>
            </div>
            
            <div className="bg-slate-800 rounded-lg p-3 text-xs font-mono">
              <div className="text-amber-400 mb-1">Darcy's Law:</div>
              <div className="text-white">Q = K × A × (H_aq - H_node) / L</div>
              <div className="mt-2 text-slate-400">
                Q = {hydCond} × 100 × ({aquiferHead[0]} - {nodeHead[0]}) / 2
              </div>
              <div className="text-amber-300 mt-1">
                Q = {flowRate.toFixed(2)} cfs
              </div>
            </div>
          </div>
          
          <div className="relative h-56 bg-gradient-to-b from-slate-100/20 to-slate-200/20 dark:from-slate-800/20 dark:to-slate-900/20 rounded-lg border border-border overflow-hidden">
            <svg className="w-full h-full" viewBox="0 0 200 140" data-testid="svg-groundwater">
              <defs>
                <pattern id="soil" patternUnits="userSpaceOnUse" width="8" height="8">
                  <circle cx="2" cy="2" r="1" className="fill-amber-800/50" />
                  <circle cx="6" cy="6" r="1" className="fill-amber-800/50" />
                </pattern>
              </defs>
              
              <rect x="0" y="20" width="200" height="120" fill="url(#soil)" />
              
              <rect x="0" y="20" width="200" height={20 + (12 - aquiferHead[0]) * 8} className="fill-amber-900/30" />
              
              <motion.rect
                x="0"
                y={20 + (12 - aquiferHead[0]) * 8}
                width="200"
                height={aquiferHead[0] * 8}
                className="fill-blue-500/30"
                initial={{ y: 60 }}
                animate={{ y: 20 + (12 - aquiferHead[0]) * 8 }}
              />
              
              <line 
                x1="0" 
                y1={20 + (12 - aquiferHead[0]) * 8} 
                x2="200" 
                y2={20 + (12 - aquiferHead[0]) * 8} 
                className="stroke-blue-400 stroke-2 stroke-dashed"
              />
              <text x="5" y={15 + (12 - aquiferHead[0]) * 8} className="text-[8px] fill-blue-400">GWT</text>
              
              <ellipse cx="100" cy="85" rx="25" ry="15" className="fill-slate-700 stroke-slate-500" strokeWidth="2" />
              <motion.ellipse
                cx="100"
                cy="85"
                rx="23"
                ry="13"
                className="fill-blue-500/60"
                style={{ 
                  clipPath: `inset(${Math.max(0, 100 - nodeHead[0] * 8)}% 0 0 0)` 
                }}
              />
              <text x="100" y="115" textAnchor="middle" className="text-[8px] fill-slate-400">Drain Pipe</text>
              
              {flowDirection !== "none" && (
                <motion.g
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <motion.path
                    d={flowDirection === "into_pipe" 
                      ? "M60 50 Q80 70 75 85" 
                      : "M75 85 Q80 70 60 50"}
                    className="fill-none stroke-cyan-400 stroke-2"
                    markerEnd="url(#arrow)"
                  />
                  <motion.path
                    d={flowDirection === "into_pipe" 
                      ? "M140 50 Q120 70 125 85" 
                      : "M125 85 Q120 70 140 50"}
                    className="fill-none stroke-cyan-400 stroke-2"
                  />
                  <defs>
                    <marker id="arrow" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
                      <path d="M0,0 L0,6 L6,3 z" className="fill-cyan-400" />
                    </marker>
                  </defs>
                </motion.g>
              )}
              
              <text x="100" y="12" textAnchor="middle" className="text-[9px] fill-slate-300">
                {flowDirection === "into_pipe" ? "Infiltration into Pipe" : 
                 flowDirection === "out_of_pipe" ? "Exfiltration from Pipe" : "No Flow"}
              </text>
            </svg>
          </div>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <Badge variant={flowDirection === "into_pipe" ? "default" : flowDirection === "out_of_pipe" ? "secondary" : "outline"}>
            {flowDirection === "into_pipe" ? "↓ Infiltration" : 
             flowDirection === "out_of_pipe" ? "↑ Exfiltration" : "Equilibrium"}
          </Badge>
          <span className="text-xs text-muted-foreground">
            Flow Rate: <span className="font-mono text-amber-400" data-testid="text-gw-flow">{Math.abs(flowRate).toFixed(2)} cfs</span>
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

export function MinorLossesDiagram() {
  const [showLosses, setShowLosses] = useState(false);
  const [kInlet, setKInlet] = useState([0.5]);
  const [kOutlet, setKOutlet] = useState([1.0]);
  const [velocity] = useState(5);
  
  const g = 32.2;
  const velocityHead = (velocity * velocity) / (2 * g);
  const inletLoss = kInlet[0] * velocityHead;
  const outletLoss = kOutlet[0] * velocityHead;

  return (
    <Card className="border-2 border-indigo-500/30 bg-gradient-to-br from-indigo-500/5 to-background">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Gauge className="h-5 w-5 text-indigo-500" />
          Conduit Inlet/Outlet Loss Coefficients
          <Badge variant="outline" className="ml-auto text-indigo-600 border-indigo-500">Energy Grade</Badge>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Impact of minor losses on HGL and EGL
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4 mb-2">
          <div className="flex items-center gap-2">
            <Switch checked={showLosses} onCheckedChange={setShowLosses} id="show-losses" data-testid="switch-minor-losses" />
            <Label htmlFor="show-losses">Minor Losses</Label>
          </div>
          
          {showLosses && (
            <>
              <div className="flex-1 space-y-1">
                <Label className="text-xs">K_inlet: {kInlet[0]}</Label>
                <Slider value={kInlet} onValueChange={setKInlet} min={0} max={1.5} step={0.1} data-testid="slider-k-inlet" />
              </div>
              <div className="flex-1 space-y-1">
                <Label className="text-xs">K_outlet: {kOutlet[0]}</Label>
                <Slider value={kOutlet} onValueChange={setKOutlet} min={0} max={1.5} step={0.1} data-testid="slider-k-outlet" />
              </div>
            </>
          )}
        </div>
        
        <div className="relative h-48 bg-gradient-to-b from-slate-100/20 to-slate-200/20 dark:from-slate-800/20 dark:to-slate-900/20 rounded-lg border border-border overflow-hidden">
          <svg className="w-full h-full" viewBox="0 0 220 120" data-testid="svg-minor-losses">
            <rect x="20" y="80" width="180" height="25" className="fill-slate-700 stroke-slate-500" />
            <text x="110" y="95" textAnchor="middle" className="text-[8px] fill-white">Conduit</text>
            
            <circle cx="20" cy="70" r="12" className="fill-slate-600 stroke-slate-400" />
            <text x="20" y="55" textAnchor="middle" className="text-[7px] fill-slate-400">Node 1</text>
            
            <circle cx="200" cy="70" r="12" className="fill-slate-600 stroke-slate-400" />
            <text x="200" y="55" textAnchor="middle" className="text-[7px] fill-slate-400">Node 2</text>
            
            <polyline
              points={showLosses 
                ? `20,30 35,${30 + inletLoss * 3} 165,${45 + inletLoss * 3} 180,${45 + inletLoss * 3 + outletLoss * 3} 200,${50 + inletLoss * 3 + outletLoss * 3}`
                : "20,30 35,32 165,48 180,50 200,52"}
              className="fill-none stroke-red-400 stroke-2"
            />
            <text x="110" y="20" textAnchor="middle" className="text-[8px] fill-red-400">EGL (Energy Grade Line)</text>
            
            <polyline
              points={showLosses 
                ? `20,40 35,${40 + inletLoss * 3} 165,${55 + inletLoss * 3} 180,${55 + inletLoss * 3 + outletLoss * 3} 200,${60 + inletLoss * 3 + outletLoss * 3}`
                : "20,40 35,42 165,58 180,60 200,62"}
              className="fill-none stroke-blue-400 stroke-2"
            />
            <text x="30" y="48" className="text-[7px] fill-blue-400">HGL</text>
            
            {showLosses && (
              <>
                <line x1="35" y1="30" x2="35" y2={30 + inletLoss * 3} className="stroke-yellow-400 stroke-2" />
                <text x="45" y={30 + inletLoss * 1.5} className="text-[7px] fill-yellow-400">
                  -{inletLoss.toFixed(2)} ft
                </text>
                
                <line x1="180" y1={45 + inletLoss * 3} x2="180" y2={45 + inletLoss * 3 + outletLoss * 3} className="stroke-yellow-400 stroke-2" />
                <text x="155" y={45 + inletLoss * 3 + outletLoss * 1.5} className="text-[7px] fill-yellow-400">
                  -{outletLoss.toFixed(2)} ft
                </text>
              </>
            )}
          </svg>
        </div>
        
        <div className="bg-slate-800 rounded-lg p-3 text-xs font-mono flex items-center justify-between">
          <div>
            <span className="text-indigo-400">h_loss = K × (V² / 2g)</span>
          </div>
          {showLosses && (
            <div className="text-right">
              <div>Inlet: {inletLoss.toFixed(3)} ft</div>
              <div>Outlet: {outletLoss.toFixed(3)} ft</div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function ReportingSystemDiagram() {
  const [reportOption, setReportOption] = useState("subcatch");
  const [step, setStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  
  const dataSizes: Record<string, { binary: number, report: number }> = {
    none: { binary: 0.5, report: 0.1 },
    subcatch: { binary: 5, report: 0.5 },
    node: { binary: 10, report: 1.0 },
    all: { binary: 50, report: 5.0 },
  };
  
  const generateReport = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setStep(0);
    
    let s = 0;
    intervalRef.current = setInterval(() => {
      s++;
      setStep(s);
      
      if (s >= 4) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        intervalRef.current = null;
        setIsAnimating(false);
      }
    }, 800);
  };
  
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <Card className="border-2 border-cyan-500/30 bg-gradient-to-br from-cyan-500/5 to-background">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <FileOutput className="h-5 w-5 text-cyan-500" />
          Reporting System: Binary Output to .RPT
          <Badge variant="outline" className="ml-auto text-cyan-600 border-cyan-500">Output Pipeline</Badge>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          How results flow from memory to report files
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <Label className="text-sm">Report Level:</Label>
          <Select value={reportOption} onValueChange={setReportOption}>
            <SelectTrigger className="w-40" data-testid="select-report-option">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">NONE</SelectItem>
              <SelectItem value="subcatch">SUBCATCH ALL</SelectItem>
              <SelectItem value="node">NODE ALL</SelectItem>
              <SelectItem value="all">ALL</SelectItem>
            </SelectContent>
          </Select>
          <Button size="sm" onClick={generateReport} disabled={isAnimating} data-testid="button-generate-report">
            Generate Report
          </Button>
        </div>
        
        <div className="relative h-32 bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 rounded-lg p-4 flex items-center justify-between">
          <motion.div
            className={`w-20 h-20 rounded-lg border-2 flex flex-col items-center justify-center ${
              step >= 1 ? 'border-green-500 bg-green-500/20' : 'border-slate-500 bg-slate-600'
            }`}
            animate={{ scale: step === 1 ? 1.1 : 1 }}
          >
            <Cpu className="h-6 w-6 text-slate-300" />
            <span className="text-[8px] text-slate-300 mt-1">Memory</span>
          </motion.div>
          
          <motion.div
            className="flex-1 h-2 mx-2 bg-slate-600 rounded relative overflow-hidden"
          >
            {step >= 1 && (
              <motion.div
                className="absolute inset-y-0 left-0 bg-cyan-500"
                initial={{ width: 0 }}
                animate={{ width: step >= 2 ? "100%" : "50%" }}
                transition={{ duration: 0.5 }}
              />
            )}
          </motion.div>
          
          <motion.div
            className={`w-24 h-20 rounded-lg border-2 flex flex-col items-center justify-center ${
              step >= 2 ? 'border-yellow-500 bg-yellow-500/20' : 'border-slate-500 bg-slate-600'
            }`}
            animate={{ scale: step === 2 ? 1.1 : 1 }}
          >
            <FileText className="h-6 w-6 text-slate-300" />
            <span className="text-[8px] text-slate-300 mt-1">.out Binary</span>
            <span className="text-[8px] text-yellow-400">{dataSizes[reportOption].binary} MB</span>
          </motion.div>
          
          <motion.div
            className="flex-1 h-2 mx-2 bg-slate-600 rounded relative overflow-hidden"
          >
            {step >= 3 && (
              <motion.div
                className="absolute inset-y-0 left-0 bg-cyan-500"
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 0.5 }}
              />
            )}
          </motion.div>
          
          <motion.div
            className={`w-24 h-20 rounded-lg border-2 flex flex-col items-center justify-center ${
              step >= 4 ? 'border-green-500 bg-green-500/20' : 'border-slate-500 bg-slate-600'
            }`}
            animate={{ scale: step === 4 ? 1.1 : 1 }}
          >
            <FileOutput className="h-6 w-6 text-slate-300" />
            <span className="text-[8px] text-slate-300 mt-1">.rpt Report</span>
            <span className="text-[8px] text-green-400">{dataSizes[reportOption].report} MB</span>
          </motion.div>
        </div>
        
        <div className="bg-slate-800 rounded-lg p-3 text-xs">
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Status:</span>
            <span className={step === 4 ? 'text-green-400' : 'text-slate-300'}>
              {step === 0 && "Ready"}
              {step === 1 && "Reading simulation memory..."}
              {step === 2 && "Writing binary output file..."}
              {step === 3 && "Generating text report..."}
              {step === 4 && (
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" /> Complete
                </span>
              )}
            </span>
          </div>
          <div className="mt-2 text-muted-foreground">
            Trade-off: More output = larger files, slower simulations
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
