import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Snowflake, Thermometer, Wind, Sun, CloudRain, Zap } from "lucide-react";
import { useUnits } from "@/contexts/UnitsContext";

export function SnowmeltAlgorithmsDiagram() {
  const { u, conv } = useUnits();
  const [model, setModel] = useState<"swmm" | "icm">("swmm");
  const [airTemp, setAirTemp] = useState([2]);
  const [windSpeed, setWindSpeed] = useState([3]);
  const [solarRadiation, setSolarRadiation] = useState([150]);
  const [rainfall, setRainfall] = useState([0]);
  const [degreeDay, setDegreeDay] = useState([3]);
  
  const [isAnimating, setIsAnimating] = useState(false);
  const [snowDepth, setSnowDepth] = useState(30);
  const [liquidContent, setLiquidContent] = useState(5);
  const [packTemp, setPackTemp] = useState(-2);
  const [meltRate, setMeltRate] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const calculateSWMMMelt = () => {
    if (airTemp[0] <= 0) return 0;
    const baseMelt = degreeDay[0] * airTemp[0];
    const rainMelt = rainfall[0] > 0 ? rainfall[0] * 0.007 * Math.max(0, airTemp[0]) : 0;
    return baseMelt + rainMelt;
  };

  const calculateICMMelt = () => {
    const shortWave = solarRadiation[0] * 0.8;
    const longWave = (airTemp[0] + 273) ** 4 * 5.67e-8 * 0.97 - 315;
    const convective = 5 * windSpeed[0] * (airTemp[0] - packTemp);
    const latent = windSpeed[0] * 0.5;
    const rainHeat = rainfall[0] * 4.18 * Math.max(0, airTemp[0]);
    const groundHeat = 2;
    
    const netFlux = shortWave + longWave + convective + latent + rainHeat + groundHeat;
    return Math.max(0, netFlux / 334);
  };

  useEffect(() => {
    if (isAnimating) {
      intervalRef.current = setInterval(() => {
        const rate = model === "swmm" ? calculateSWMMMelt() : calculateICMMelt();
        setMeltRate(rate);
        
        setSnowDepth(prev => Math.max(0, prev - rate * 0.01));
        setLiquidContent(prev => Math.min(15, prev + rate * 0.05));
        setPackTemp(airTemp[0] < 0 ? Math.max(-10, airTemp[0]) : Math.min(0, packTemp + 0.1));
      }, 100);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isAnimating, model, airTemp, windSpeed, solarRadiation, rainfall, degreeDay]);

  const reset = () => {
    setIsAnimating(false);
    setSnowDepth(30);
    setLiquidContent(5);
    setPackTemp(-2);
    setMeltRate(0);
  };

  const getFluxSize = (value: number, max: number) => Math.min(1, Math.max(0.2, value / max));

  return (
    <Card className="w-full" data-testid="snowmelt-diagram">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Snowflake className="w-5 h-5 text-blue-400" />
          Snowmelt Algorithms: SWMM5 Degree-Day vs ICM Energy Balance
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs value={model} onValueChange={(v) => { setModel(v as "swmm" | "icm"); reset(); }}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="swmm" data-testid="tab-swmm-snowmelt">SWMM5 (Degree-Day)</TabsTrigger>
            <TabsTrigger value="icm" data-testid="tab-icm-snowmelt">ICM (Energy Balance)</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-medium">Weather Controls</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Thermometer className="w-4 h-4" />
                <span className="text-sm w-32">Air Temp: {airTemp[0]}°C</span>
                <Slider value={airTemp} onValueChange={setAirTemp} min={-10} max={15} step={0.5} className="flex-1" data-testid="slider-air-temp" />
              </div>
              <div className="flex items-center gap-2">
                <Wind className="w-4 h-4" />
                <span className="text-sm w-32">Wind: {windSpeed[0]} {u.velocity}</span>
                <Slider value={windSpeed} onValueChange={setWindSpeed} min={0} max={10} step={0.5} className="flex-1" data-testid="slider-wind" />
              </div>
              <div className="flex items-center gap-2">
                <Sun className="w-4 h-4" />
                <span className="text-sm w-32">Solar: {solarRadiation[0]} W/m²</span>
                <Slider value={solarRadiation} onValueChange={setSolarRadiation} min={0} max={400} step={10} className="flex-1" data-testid="slider-solar" />
              </div>
              <div className="flex items-center gap-2">
                <CloudRain className="w-4 h-4" />
                <span className="text-sm w-32">Rain: {rainfall[0]} {u.rainfall}</span>
                <Slider value={rainfall} onValueChange={setRainfall} min={0} max={20} step={0.5} className="flex-1" data-testid="slider-rain" />
              </div>
              {model === "swmm" && (
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  <span className="text-sm w-32">Degree-Day: {degreeDay[0]}</span>
                  <Slider value={degreeDay} onValueChange={setDegreeDay} min={1} max={8} step={0.5} className="flex-1" data-testid="slider-degree-day" />
                </div>
              )}
            </div>

            <div className="bg-muted p-3 rounded-lg space-y-2">
              <h4 className="font-medium">Snowpack State</h4>
              <div className="grid grid-cols-3 gap-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Depth</span>
                  <div className="font-mono text-lg">{snowDepth.toFixed(1)} cm</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Liquid</span>
                  <div className="font-mono text-lg">{liquidContent.toFixed(1)}%</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Temp</span>
                  <div className="font-mono text-lg">{packTemp.toFixed(1)}°C</div>
                </div>
              </div>
              <div className="pt-2 border-t">
                <span className="text-muted-foreground text-sm">Melt Rate</span>
                <div className="font-mono text-xl text-blue-500">{meltRate.toFixed(2)} {u.rainfall}</div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={() => setIsAnimating(!isAnimating)} data-testid="btn-toggle-snowmelt">
                {isAnimating ? "Pause" : "Start"} Simulation
              </Button>
              <Button variant="outline" onClick={reset} data-testid="btn-reset-snowmelt">Reset</Button>
            </div>
          </div>

          <div className="relative bg-gradient-to-b from-sky-100 to-sky-50 dark:from-sky-900 dark:to-sky-950 rounded-lg p-4 min-h-[400px]">
            {model === "icm" && (
              <div className="absolute top-2 left-2 right-2 flex justify-around">
                <motion.div 
                  className="flex flex-col items-center"
                  initial={{ opacity: 1 }}
                  animate={{ opacity: 1, scale: getFluxSize(solarRadiation[0], 400) }}
                >
                  <Sun className="w-6 h-6 text-yellow-500" />
                  <div className="w-1 bg-yellow-400 rounded" style={{ height: solarRadiation[0] / 10 }} />
                  <span className="text-xs mt-1">Solar</span>
                </motion.div>
                <motion.div 
                  className="flex flex-col items-center"
                  initial={{ opacity: 1 }}
                  animate={{ opacity: 1, scale: getFluxSize(Math.abs(airTemp[0] * 5), 50) }}
                >
                  <Thermometer className="w-6 h-6 text-red-400" />
                  <div className="w-1 bg-red-300 rounded" style={{ height: Math.abs(airTemp[0]) * 3 }} />
                  <span className="text-xs mt-1">Long-wave</span>
                </motion.div>
                <motion.div 
                  className="flex flex-col items-center"
                  initial={{ opacity: 1 }}
                  animate={{ opacity: 1, scale: getFluxSize(windSpeed[0], 10) }}
                >
                  <Wind className="w-6 h-6 text-cyan-500" />
                  <div className="w-1 bg-cyan-300 rounded" style={{ height: windSpeed[0] * 4 }} />
                  <span className="text-xs mt-1">Convective</span>
                </motion.div>
                {rainfall[0] > 0 && (
                  <motion.div 
                    className="flex flex-col items-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <CloudRain className="w-6 h-6 text-blue-500" />
                    <div className="w-1 bg-blue-400 rounded" style={{ height: rainfall[0] * 2 }} />
                    <span className="text-xs mt-1">Rain Heat</span>
                  </motion.div>
                )}
              </div>
            )}

            {model === "swmm" && (
              <div className="absolute top-4 left-1/2 -translate-x-1/2 text-center">
                <Badge variant={airTemp[0] > 0 ? "default" : "secondary"}>
                  {airTemp[0] > 0 ? `Melt = ${degreeDay[0]} × ${airTemp[0]}°C = ${(degreeDay[0] * airTemp[0]).toFixed(1)} mm/day` : "T ≤ 0°C: No Melt"}
                </Badge>
              </div>
            )}

            <svg viewBox="0 0 300 250" className="w-full h-64 mt-16">
              <defs>
                <linearGradient id="snowGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#e0f2fe" />
                  <stop offset="100%" stopColor="#bae6fd" />
                </linearGradient>
                <pattern id="snowPattern" patternUnits="userSpaceOnUse" width="10" height="10">
                  <circle cx="5" cy="5" r="1" fill="#94a3b8" />
                </pattern>
              </defs>

              <rect x="50" y="200" width="200" height="40" fill="#8b5a2b" />
              <text x="150" y="225" textAnchor="middle" className="text-xs fill-white">Ground</text>

              <motion.rect 
                x="50" 
                y={200 - snowDepth * 4}
                width="200" 
                height={snowDepth * 4}
                fill="url(#snowGradient)"
                stroke="#60a5fa"
                strokeWidth="2"
                initial={{ height: 120 }}
                animate={{ height: snowDepth * 4, y: 200 - snowDepth * 4 }}
              />
              <motion.rect 
                x="50" 
                y={200 - snowDepth * 4}
                width="200" 
                height={snowDepth * 4}
                fill="url(#snowPattern)"
                initial={{ opacity: 1 }}
                animate={{ opacity: 0.5 }}
              />

              {meltRate > 0 && (
                <>
                  {[0, 1, 2, 3, 4].map((i) => (
                    <motion.circle
                      key={i}
                      cx={80 + i * 35}
                      cy={200}
                      r={3}
                      fill="#3b82f6"
                      initial={{ cy: 200, opacity: 1 }}
                      animate={{ 
                        cy: [200, 230],
                        opacity: [1, 0]
                      }}
                      transition={{
                        duration: 1 / Math.max(0.1, meltRate * 0.2),
                        repeat: Infinity,
                        delay: i * 0.2
                      }}
                    />
                  ))}
                </>
              )}

              <text x="150" y={200 - snowDepth * 4 - 5} textAnchor="middle" className="text-xs fill-foreground">
                Snowpack: {snowDepth.toFixed(0)}cm
              </text>
            </svg>

            <div className="absolute bottom-2 left-2 right-2 bg-background/80 p-2 rounded text-xs">
              {model === "swmm" ? (
                <div>
                  <strong>SWMM5 Degree-Day Method:</strong> Simple empirical approach. Melt = DDF × (T - Tbase).
                  Best for data-limited regions. Rain-on-snow adds advective heat.
                </div>
              ) : (
                <div>
                  <strong>ICM Energy Balance:</strong> Physically-based. Accounts for solar, longwave, convective,
                  latent, rain, and ground heat fluxes. Better for climate studies.
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function InfiltrationShootoutDiagram() {
  const { u, conv } = useUnits();
  const [soilType, setSoilType] = useState<"sand" | "loam" | "clay">("loam");
  const [initialCondition, setInitialCondition] = useState<"dry" | "average" | "wet">("average");
  const [rainPattern, setRainPattern] = useState<"constant" | "storm">("constant");
  const [selectedMethods, setSelectedMethods] = useState<string[]>(["horton", "greenampt"]);
  
  const [isAnimating, setIsAnimating] = useState(false);
  const [time, setTime] = useState(0);
  const [wettingFronts, setWettingFronts] = useState<Record<string, number>>({});
  const [infiltrationRates, setInfiltrationRates] = useState<Record<string, number[]>>({});
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const soilParams = {
    sand: { f0: 120, fmin: 30, k: 4, Ks: 50, psi: 5, theta_s: 0.4, theta_i: 0.1, CN: 65 },
    loam: { f0: 75, fmin: 8, k: 2, Ks: 12, psi: 20, theta_s: 0.45, theta_i: 0.2, CN: 75 },
    clay: { f0: 25, fmin: 2, k: 1, Ks: 2, psi: 35, theta_s: 0.5, theta_i: 0.3, CN: 85 }
  };

  const initialDeficit = {
    dry: 0.3,
    average: 0.5,
    wet: 0.8
  };

  const getRainIntensity = (t: number) => {
    if (rainPattern === "constant") return 50;
    const peak = 30;
    if (t < peak) return 20 + (80 * t / peak);
    return Math.max(10, 100 - (t - peak) * 2);
  };

  const calculateHorton = (t: number, params: typeof soilParams.loam) => {
    const { f0, fmin, k } = params;
    return fmin + (f0 - fmin) * Math.exp(-k * t / 60);
  };

  const calculateGreenAmpt = (t: number, F: number, params: typeof soilParams.loam) => {
    const { Ks, psi, theta_s, theta_i } = params;
    const deficit = (theta_s - theta_i) * initialDeficit[initialCondition];
    if (F === 0) return params.f0;
    return Ks * (1 + (psi * deficit) / F);
  };

  const calculateCN = (cumRain: number, params: typeof soilParams.loam) => {
    const S = (1000 / params.CN - 10) * 25.4;
    const Ia = 0.2 * S;
    if (cumRain <= Ia) return cumRain;
    return ((cumRain - Ia) ** 2) / (cumRain - Ia + S);
  };

  useEffect(() => {
    if (isAnimating) {
      const params = soilParams[soilType];
      let cumF: Record<string, number> = { horton: 0, greenampt: 0, cn: 0 };
      let cumRain = 0;
      
      intervalRef.current = setInterval(() => {
        setTime(prev => {
          const newTime = prev + 1;
          const rain = getRainIntensity(newTime);
          cumRain += rain / 60;
          
          const rates: Record<string, number> = {};
          const fronts: Record<string, number> = {};
          
          if (selectedMethods.includes("horton")) {
            rates.horton = Math.min(rain, calculateHorton(newTime, params));
            cumF.horton += rates.horton / 60;
            fronts.horton = cumF.horton / (params.theta_s * 100);
          }
          
          if (selectedMethods.includes("greenampt")) {
            rates.greenampt = Math.min(rain, calculateGreenAmpt(newTime, cumF.greenampt, params));
            cumF.greenampt += rates.greenampt / 60;
            fronts.greenampt = cumF.greenampt / (params.theta_s * 100);
          }
          
          if (selectedMethods.includes("cn")) {
            const loss = calculateCN(cumRain, params);
            rates.cn = (loss - (cumF.cn || 0)) * 60;
            cumF.cn = loss;
            fronts.cn = loss / (params.theta_s * 100);
          }
          
          setWettingFronts(fronts);
          setInfiltrationRates(prev => {
            const newRates = { ...prev };
            Object.keys(rates).forEach(method => {
              newRates[method] = [...(prev[method] || []), rates[method]].slice(-60);
            });
            return newRates;
          });
          
          return newTime;
        });
      }, 100);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isAnimating, soilType, initialCondition, rainPattern, selectedMethods]);

  const reset = () => {
    setIsAnimating(false);
    setTime(0);
    setWettingFronts({});
    setInfiltrationRates({});
  };

  const toggleMethod = (method: string) => {
    setSelectedMethods(prev => 
      prev.includes(method) ? prev.filter(m => m !== method) : [...prev, method]
    );
  };

  const methodColors = {
    horton: "#ef4444",
    greenampt: "#22c55e",
    cn: "#3b82f6"
  };

  return (
    <Card className="w-full" data-testid="infiltration-diagram">
      <CardHeader>
        <CardTitle>Infiltration Method Shootout: Horton vs Green-Ampt vs Curve Number</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-4 gap-4">
          <div className="space-y-2">
            <span className="text-sm font-medium">Soil Type</span>
            <div className="flex gap-1">
              {(["sand", "loam", "clay"] as const).map(type => (
                <Button
                  key={type}
                  size="sm"
                  variant={soilType === type ? "default" : "outline"}
                  onClick={() => { setSoilType(type); reset(); }}
                  data-testid={`btn-soil-${type}`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </Button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <span className="text-sm font-medium">Initial Condition</span>
            <div className="flex gap-1">
              {(["dry", "average", "wet"] as const).map(cond => (
                <Button
                  key={cond}
                  size="sm"
                  variant={initialCondition === cond ? "default" : "outline"}
                  onClick={() => { setInitialCondition(cond); reset(); }}
                  data-testid={`btn-condition-${cond}`}
                >
                  {cond.charAt(0).toUpperCase() + cond.slice(1)}
                </Button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <span className="text-sm font-medium">Rain Pattern</span>
            <div className="flex gap-1">
              <Button
                size="sm"
                variant={rainPattern === "constant" ? "default" : "outline"}
                onClick={() => { setRainPattern("constant"); reset(); }}
                data-testid="btn-rain-constant"
              >
                Constant
              </Button>
              <Button
                size="sm"
                variant={rainPattern === "storm" ? "default" : "outline"}
                onClick={() => { setRainPattern("storm"); reset(); }}
                data-testid="btn-rain-storm"
              >
                Storm
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <span className="text-sm font-medium">Methods</span>
            <div className="flex gap-1 flex-wrap">
              {[
                { id: "horton", label: "Horton" },
                { id: "greenampt", label: "Green-Ampt" },
                { id: "cn", label: "Curve Number" }
              ].map(method => (
                <Button
                  key={method.id}
                  size="sm"
                  variant={selectedMethods.includes(method.id) ? "default" : "outline"}
                  onClick={() => toggleMethod(method.id)}
                  style={{ 
                    backgroundColor: selectedMethods.includes(method.id) ? methodColors[method.id as keyof typeof methodColors] : undefined 
                  }}
                  data-testid={`btn-method-${method.id}`}
                >
                  {method.label}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="bg-gradient-to-b from-amber-100 to-amber-200 dark:from-amber-900 dark:to-amber-800 rounded-lg p-4 relative min-h-[300px]">
            <div className="absolute top-2 left-2 text-sm font-medium">Soil Column Infiltrometer</div>
            <div className="absolute top-2 right-2">
              <Badge>t = {time}s</Badge>
            </div>
            
            <svg viewBox="0 0 200 250" className="w-full h-64 mt-6">
              <rect x="40" y="10" width="120" height="20" fill="#60a5fa" opacity="0.5" />
              <text x="100" y="24" textAnchor="middle" className="text-xs fill-foreground">
                Ponding: {getRainIntensity(time).toFixed(0)} {u.rainfall}
              </text>
              
              <rect x="40" y="30" width="120" height="200" fill="#d4a574" stroke="#8b5a2b" strokeWidth="2" />
              
              {selectedMethods.includes("horton") && (
                <motion.rect
                  x="45"
                  y="30"
                  width="35"
                  height={(wettingFronts.horton || 0) * 200}
                  fill={methodColors.horton}
                  opacity={0.6}
                  initial={{ height: 0 }}
                  animate={{ height: Math.min(200, (wettingFronts.horton || 0) * 200) }}
                />
              )}
              {selectedMethods.includes("greenampt") && (
                <motion.rect
                  x="82"
                  y="30"
                  width="35"
                  height={(wettingFronts.greenampt || 0) * 200}
                  fill={methodColors.greenampt}
                  opacity={0.6}
                  initial={{ height: 0 }}
                  animate={{ height: Math.min(200, (wettingFronts.greenampt || 0) * 200) }}
                />
              )}
              {selectedMethods.includes("cn") && (
                <motion.rect
                  x="120"
                  y="30"
                  width="35"
                  height={(wettingFronts.cn || 0) * 200}
                  fill={methodColors.cn}
                  opacity={0.6}
                  initial={{ height: 0 }}
                  animate={{ height: Math.min(200, (wettingFronts.cn || 0) * 200) }}
                />
              )}

              {[50, 100, 150, 200].map((y, i) => (
                <g key={y}>
                  <line x1="35" y1={30 + y / 200 * 200} x2="40" y2={30 + y / 200 * 200} stroke="#666" />
                  <text x="32" y={34 + y / 200 * 200} textAnchor="end" className="text-[8px] fill-muted-foreground">
                    {i * 25}cm
                  </text>
                </g>
              ))}
            </svg>
          </div>

          <div className="space-y-4">
            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-medium mb-2">Infiltration Rate vs Time</h4>
              <svg viewBox="0 0 300 150" className="w-full h-36">
                <line x1="30" y1="130" x2="290" y2="130" stroke="currentColor" strokeWidth="1" />
                <line x1="30" y1="10" x2="30" y2="130" stroke="currentColor" strokeWidth="1" />
                <text x="160" y="148" textAnchor="middle" className="text-[10px] fill-muted-foreground">Time (min)</text>
                <text x="12" y="70" textAnchor="middle" className="text-[10px] fill-muted-foreground" transform="rotate(-90, 12, 70)">f ({u.rainfall})</text>
                
                {Object.entries(infiltrationRates).map(([method, rates]) => (
                  <polyline
                    key={method}
                    points={rates.map((r, i) => `${30 + i * 4.3},${130 - r}`).join(" ")}
                    fill="none"
                    stroke={methodColors[method as keyof typeof methodColors]}
                    strokeWidth="2"
                  />
                ))}
              </svg>
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="bg-red-50 dark:bg-red-900/20 p-2 rounded border-l-4 border-red-500">
                <strong>Horton</strong>
                <p className="text-muted-foreground">Empirical decay from f₀ to f∞. Simple calibration.</p>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 p-2 rounded border-l-4 border-green-500">
                <strong>Green-Ampt</strong>
                <p className="text-muted-foreground">Physics-based. Uses suction head & conductivity.</p>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded border-l-4 border-blue-500">
                <strong>Curve Number</strong>
                <p className="text-muted-foreground">Event-total method. Not rate-based.</p>
              </div>
            </div>

            <div className="bg-muted p-3 rounded text-sm">
              <strong>Soil: {soilType.toUpperCase()}</strong>
              <div className="grid grid-cols-4 gap-2 mt-1 text-xs">
                <div>f₀: {soilParams[soilType].f0} {u.rainfall}</div>
                <div>f∞: {soilParams[soilType].fmin} {u.rainfall}</div>
                <div>Ks: {soilParams[soilType].Ks} {u.rainfall}</div>
                <div>CN: {soilParams[soilType].CN}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button onClick={() => setIsAnimating(!isAnimating)} data-testid="btn-toggle-infiltration">
            {isAnimating ? "Pause" : "Start"} Infiltration Test
          </Button>
          <Button variant="outline" onClick={reset} data-testid="btn-reset-infiltration">Reset</Button>
        </div>
      </CardContent>
    </Card>
  );
}
