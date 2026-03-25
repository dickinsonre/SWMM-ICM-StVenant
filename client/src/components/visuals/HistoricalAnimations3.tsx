import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useUnits } from "@/contexts/UnitsContext";

export function MayaFiltrationAnimation() {
  const { u, conv } = useUnits();
  const [rainfall, setRainfall] = useState([25]);
  const [animOffset, setAnimOffset] = useState(0);

  const intensity = rainfall[0];

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimOffset((prev) => (prev + 2) % 400);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const scaleFactor = intensity / 25;
  const particleCount = Math.floor(4 + scaleFactor * 6);

  const qualityData = [
    { stage: "Inlet", tss: Math.round(500 * scaleFactor), color: "Brown", bacteria: "High", colorHex: "#8B4513" },
    { stage: "After Settle", tss: Math.round(100 * scaleFactor), color: "Yellow", bacteria: "Medium", colorHex: "#DAA520" },
    { stage: "After Filter", tss: Math.round(15 * scaleFactor), color: "Clear", bacteria: "Low", colorHex: "#87CEEB" },
    { stage: "Storage", tss: Math.round(8 * scaleFactor), color: "Clear", bacteria: "Very Low", colorHex: "#3b82f6" },
  ];

  const tssRemoval = qualityData[0].tss > 0 ? ((1 - qualityData[3].tss / qualityData[0].tss) * 100).toFixed(1) : "0";
  const HRT = 2.0 / scaleFactor;
  const treatmentC = (15 * Math.exp(-0.5 * HRT)).toFixed(1);

  const inletParticles = [];
  for (let i = 0; i < particleCount; i++) {
    const t = ((animOffset + i * (400 / particleCount)) % 400) / 400;
    inletParticles.push({ x: 20 + t * 60, y: 140 + Math.sin(t * 6) * 8, opacity: 0.6 + Math.random() * 0.3, key: `inlet-${i}` });
  }

  const settleParticles = [];
  for (let i = 0; i < particleCount; i++) {
    const t = ((animOffset + i * 50) % 400) / 400;
    const settling = t * t;
    settleParticles.push({ x: 100 + t * 70, y: 120 + settling * 60, opacity: 0.4 + (1 - t) * 0.4, key: `settle-${i}` });
  }

  const filterParticles = [];
  for (let i = 0; i < Math.floor(particleCount * 0.6); i++) {
    const t = ((animOffset + i * 60) % 400) / 400;
    filterParticles.push({ x: 200 + t * 60, y: 130 + t * 30, opacity: 0.3 + t * 0.3, key: `filter-${i}` });
  }

  const cleanParticles = [];
  for (let i = 0; i < Math.floor(particleCount * 0.4); i++) {
    const t = ((animOffset + i * 80) % 400) / 400;
    cleanParticles.push({ x: 290 + t * 80, y: 145 + Math.sin(t * 4) * 3, key: `clean-${i}` });
  }

  return (
    <Card data-testid="card-maya-filtration">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Maya Water Filtration — Corriental Reservoir, Tikal</CardTitle>
          <Badge data-testid="badge-water-treatment">Water Treatment</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <svg viewBox="0 0 400 300" className="w-full border rounded bg-muted/20" data-testid="svg-maya-filtration">
          <rect x="0" y="0" width="400" height="300" fill="#f0fdf4" opacity="0.3" />
          <text x="200" y="15" textAnchor="middle" fontSize="9" fill="#64748b" fontWeight="bold">
            Corriental Reservoir Cross-Section (250–900 CE)
          </text>

          {Array.from({ length: Math.floor(intensity / 5) }, (_, i) => {
            const rx = 30 + ((animOffset * 3 + i * 47) % 360);
            const ry = ((animOffset + i * 23) % 80);
            return <line key={`rain-${i}`} x1={rx} y1={ry} x2={rx - 2} y2={ry + 8} stroke="#3b82f6" strokeWidth="1" opacity="0.4" />;
          })}

          <rect x="15" y="100" width="70" height="100" fill="none" stroke="#8B7355" strokeWidth="2" />
          <rect x="17" y={200 - 80 * scaleFactor} width="66" height={80 * scaleFactor} fill="rgba(139,69,19,0.3)" />
          <text x="50" y="95" textAnchor="middle" fontSize="7" fill="#8B7355" fontWeight="bold">Raw Water</text>
          <text x="50" y="210" textAnchor="middle" fontSize="6" fill="#64748b">Inlet</text>

          {inletParticles.map((p) => (
            <circle key={p.key} cx={p.x} cy={p.y} r="2.5" fill="#8B4513" opacity={p.opacity} />
          ))}

          <rect x="95" y="100" width="85" height="100" fill="none" stroke="#8B7355" strokeWidth="2" />
          <rect x="97" y={200 - 70 * scaleFactor} width="81" height={70 * scaleFactor} fill="rgba(218,165,32,0.2)" />
          <rect x="97" y="175" width="81" height="23" fill="rgba(139,69,19,0.15)" />
          <text x="137" y="95" textAnchor="middle" fontSize="7" fill="#8B7355" fontWeight="bold">Settling Zone</text>

          {settleParticles.map((p) => (
            <circle key={p.key} cx={p.x} cy={p.y} r="2" fill="#DAA520" opacity={p.opacity} />
          ))}

          <rect x="190" y="100" width="80" height="100" fill="none" stroke="#8B7355" strokeWidth="2" />
          <rect x="192" y="145" width="76" height="20" fill="#c2b280" opacity="0.6" />
          <text x="230" y="158" textAnchor="middle" fontSize="5" fill="#8B7355">Sand/Zeolite</text>
          <rect x="192" y="130" width="76" height="15" fill="rgba(135,206,235,0.2)" />
          <rect x="192" y="165" width="76" height="33" fill="rgba(59,130,246,0.15)" />
          <text x="230" y="95" textAnchor="middle" fontSize="7" fill="#8B7355" fontWeight="bold">Filter</text>

          {filterParticles.map((p) => (
            <circle key={p.key} cx={p.x} cy={p.y} r="1.5" fill="#87CEEB" opacity={p.opacity} />
          ))}

          <rect x="280" y="100" width="100" height="100" fill="none" stroke="#8B7355" strokeWidth="2" />
          <rect x="282" y={200 - 75 * Math.min(scaleFactor, 1)} width="96" height={75 * Math.min(scaleFactor, 1)} fill="rgba(59,130,246,0.25)" />
          <text x="330" y="95" textAnchor="middle" fontSize="7" fill="#8B7355" fontWeight="bold">Clean Storage</text>

          {cleanParticles.map((p) => (
            <circle key={p.key} cx={p.x} cy={p.y} r="2" fill="#3b82f6" opacity="0.6" />
          ))}

          <line x1="85" y1="150" x2="95" y2="150" stroke="#3b82f6" strokeWidth="2" markerEnd="url(#arrow)" />
          <line x1="180" y1="150" x2="190" y2="150" stroke="#87CEEB" strokeWidth="2" />
          <line x1="270" y1="150" x2="280" y2="150" stroke="#3b82f6" strokeWidth="2" />

          <text x="50" y="225" fontSize="6" fill="#8B4513">TSS: {qualityData[0].tss} mg/L</text>
          <text x="115" y="225" fontSize="6" fill="#DAA520">TSS: {qualityData[1].tss}</text>
          <text x="205" y="225" fontSize="6" fill="#87CEEB">TSS: {qualityData[2].tss}</text>
          <text x="300" y="225" fontSize="6" fill="#3b82f6">TSS: {qualityData[3].tss}</text>

          <text x="200" y="250" textAnchor="middle" fontSize="7" fill="#64748b">
            SWMM5: R=0.80, C={treatmentC} mg/L (HRT={HRT.toFixed(1)} hr)
          </text>

          <rect x="15" y="260" width="370" height="1" fill="#a78b5a" />
          <text x="200" y="275" textAnchor="middle" fontSize="6" fill="#94a3b8">
            Removal: TSS {tssRemoval}% | Color 95% | Bacteria 90%+
          </text>
        </svg>

        <div className="space-y-1">
          <label className="text-xs font-medium" data-testid="label-rainfall-intensity">Rainfall Intensity: {conv.rainfall(intensity).toFixed(0)} {u.rainfall}</label>
          <Slider value={rainfall} onValueChange={setRainfall} min={5} max={50} step={1} data-testid="slider-rainfall-intensity" />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse" data-testid="table-water-quality">
            <thead>
              <tr className="bg-muted/50">
                <th className="border p-1 text-left">Stage</th>
                <th className="border p-1">TSS (mg/L)</th>
                <th className="border p-1">Color</th>
                <th className="border p-1">Bacteria</th>
              </tr>
            </thead>
            <tbody>
              {qualityData.map((row) => (
                <tr key={row.stage}>
                  <td className="border p-1 font-medium">{row.stage}</td>
                  <td className="border p-1 text-center">{row.tss}</td>
                  <td className="border p-1 text-center">
                    <span className="inline-flex items-center gap-1">
                      <span className="w-3 h-3 rounded-full inline-block" style={{ backgroundColor: row.colorHex }} />
                      {row.color}
                    </span>
                  </td>
                  <td className="border p-1 text-center">{row.bacteria}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800 p-3">
          <div className="text-xs font-semibold mb-1 text-blue-700 dark:text-blue-300" data-testid="text-swmm-model">
            SWMM5 Water Quality: LOADINGS + TREATMENT
          </div>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div data-testid="text-removal-r"><span className="text-muted-foreground">R:</span> <span className="font-bold">0.80</span></div>
            <div data-testid="text-treatment-c"><span className="text-muted-foreground">C:</span> <span className="font-bold">{treatmentC} mg/L</span></div>
            <div data-testid="text-hrt"><span className="text-muted-foreground">HRT:</span> <span className="font-bold">{HRT.toFixed(1)} hr</span></div>
          </div>
        </div>

        <div className="bg-amber-50 dark:bg-amber-900/20 rounded border border-amber-200 dark:border-amber-800 p-3" data-testid="text-historical-fact-maya">
          <span className="text-xs font-semibold text-amber-700 dark:text-amber-300">Historical Fact: </span>
          <span className="text-xs text-amber-800 dark:text-amber-200">
            Maya deliberately imported zeolite mineral — same material used in modern water treatment plants. They understood filtration chemistry 1,500 years before European science.
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

export function KhmerBarayAnimation() {
  const { u, conv } = useUnits();
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const monthlyLevels = [25, 22, 19, 16, 13, 15, 25, 35, 45, 50, 45, 35];
  const [selectedMonth, setSelectedMonth] = useState(0);
  const [animOffset, setAnimOffset] = useState(0);

  const maxStorage = 50;
  const level = monthlyLevels[selectedMonth];
  const fillFraction = level / maxStorage;

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimOffset((prev) => (prev + 1) % 200);
    }, 60);
    return () => clearInterval(interval);
  }, []);

  const isMonsoon = selectedMonth >= 5 && selectedMonth <= 9;
  const isIrrigation = selectedMonth >= 10 || selectedMonth <= 4;

  const inflow = isMonsoon ? Math.round(40 / 5) : 0;
  const outflow = isIrrigation ? Math.round(35 / 7) : 0;
  const evaporation = Math.round(5 / 12);

  return (
    <Card data-testid="card-khmer-baray">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Khmer West Baray — Angkor</CardTitle>
          <Badge data-testid="badge-mega-reservoir">Mega-Reservoir</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <svg viewBox="0 0 400 300" className="w-full border rounded bg-muted/20" data-testid="svg-khmer-baray">
          <rect x="0" y="0" width="400" height="300" fill="#fefce8" opacity="0.3" />
          <text x="200" y="15" textAnchor="middle" fontSize="9" fill="#64748b" fontWeight="bold">
            West Baray — Plan View ({conv.length(8000).toFixed(0)} {u.length} × {conv.length(2300).toFixed(0)} {u.length}, {conv.volume(50000000).toFixed(0)} {u.volume})
          </text>

          <rect x="50" y="40" width="300" height="130" fill="none" stroke="#a78b5a" strokeWidth="3" rx="2" />
          <rect x="52" y={170 - 128 * fillFraction} width="296" height={128 * fillFraction} fill={`rgba(59,130,246,${0.2 + fillFraction * 0.3})`} rx="1" />

          {isMonsoon && Array.from({ length: 4 }, (_, i) => {
            const cx = 100 + i * 60;
            const t = ((animOffset + i * 40) % 200) / 200;
            return (
              <g key={`inflow-${i}`}>
                <rect x={cx - 5} y="30" width="10" height="12" fill="#a78b5a" stroke="#8B7355" strokeWidth="1" />
                <circle cx={cx} cy={30 + t * 15} r="2" fill="#3b82f6" opacity={0.7}>
                  <animate attributeName="opacity" values="0.4;0.8;0.4" dur="1s" repeatCount="indefinite" />
                </circle>
              </g>
            );
          })}

          {isIrrigation && Array.from({ length: 3 }, (_, i) => {
            const cx = 120 + i * 70;
            const t = ((animOffset + i * 50) % 200) / 200;
            return (
              <g key={`outflow-${i}`}>
                <rect x={cx - 5} y="170" width="10" height="12" fill="#a78b5a" stroke="#8B7355" strokeWidth="1" />
                <circle cx={cx} cy={175 + t * 15} r="2" fill="#22c55e" opacity={0.7}>
                  <animate attributeName="opacity" values="0.4;0.8;0.4" dur="1s" repeatCount="indefinite" />
                </circle>
              </g>
            );
          })}

          <g>
            <circle cx="200" cy="105" r="12" fill="#a78b5a" stroke="#8B7355" strokeWidth="1.5" />
            <text x="200" y="103" textAnchor="middle" fontSize="4" fill="white" fontWeight="bold">Neak</text>
            <text x="200" y="109" textAnchor="middle" fontSize="4" fill="white" fontWeight="bold">Poan</text>
          </g>

          <text x="200" y="60" textAnchor="middle" fontSize="7" fill="#1e40af">
            Storage: {level}M {u.volume} ({(fillFraction * 100).toFixed(0)}%)
          </text>

          {months.map((m, i) => {
            const bx = 25 + i * 30;
            const barH = (monthlyLevels[i] / maxStorage) * 80;
            return (
              <g key={`bar-${i}`}>
                <rect x={bx} y={280 - barH} width="22" height={barH} fill={i === selectedMonth ? "#3b82f6" : "rgba(59,130,246,0.3)"} rx="1" stroke={i === selectedMonth ? "#1e40af" : "none"} strokeWidth="1" />
                <text x={bx + 11} y="295" textAnchor="middle" fontSize="5" fill={i === selectedMonth ? "#1e40af" : "#94a3b8"}>{m}</text>
              </g>
            );
          })}
          <text x="15" y="205" fontSize="6" fill="#94a3b8">Storage (M {u.volume})</text>
        </svg>

        <div className="flex items-center gap-1 flex-wrap">
          <span className="text-xs font-medium text-muted-foreground mr-1">Month:</span>
          {months.map((m, i) => (
            <Button
              key={m}
              variant={selectedMonth === i ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedMonth(i)}
              className="text-[10px] px-2 py-0 h-6"
              data-testid={`button-month-${m.toLowerCase()}`}
            >
              {m}
            </Button>
          ))}
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800 p-3">
          <div className="text-xs font-semibold mb-2 text-blue-700 dark:text-blue-300" data-testid="text-water-balance">
            Water Balance — {months[selectedMonth]}
          </div>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div data-testid="text-baray-inflow">
              <span className="text-muted-foreground">Inflow:</span>{" "}
              <span className="font-bold text-blue-600">{inflow}M {u.volume}/mo</span>
            </div>
            <div data-testid="text-baray-outflow">
              <span className="text-muted-foreground">Irrigation:</span>{" "}
              <span className="font-bold text-green-600">{outflow}M {u.volume}/mo</span>
            </div>
            <div data-testid="text-baray-evap">
              <span className="text-muted-foreground">Evaporation:</span>{" "}
              <span className="font-bold text-orange-500">{evaporation}M {u.volume}/mo</span>
            </div>
          </div>
        </div>

        <div className="bg-amber-50 dark:bg-amber-900/20 rounded border border-amber-200 dark:border-amber-800 p-3" data-testid="text-historical-fact-khmer">
          <span className="text-xs font-semibold text-amber-700 dark:text-amber-300">Historical Fact: </span>
          <span className="text-xs text-amber-800 dark:text-amber-200">
            Angkor's population exceeded 750,000 — larger than any European city. When the hydraulic system failed, the city was abandoned.
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

export function CloacaMaximaAnimation() {
  const { u, conv } = useUnits();
  const [weather, setWeather] = useState<"dry" | "light" | "heavy" | "extreme">("dry");
  const [animOffset, setAnimOffset] = useState(0);

  const weatherFlows: Record<string, number> = { dry: 0.5, light: 3.0, heavy: 12.0, extreme: 25.0 };
  const weatherLabels: Record<string, string> = { dry: "Dry", light: "Light Rain", heavy: "Heavy Storm", extreme: "100-yr Extreme" };
  const Q = weatherFlows[weather];

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimOffset((prev) => (prev + 3) % 400);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const D = 3.2;
  const n = 0.020;
  const S = 0.003;
  const A_full = Math.PI * (D / 2) * (D / 2);
  const P_full = Math.PI * D;
  const R_full = A_full / P_full;
  const Q_full = (1 / n) * A_full * Math.pow(R_full, 2 / 3) * Math.pow(S, 0.5);

  const fillRatio = Math.min(1, Q / Q_full);
  const depth = fillRatio * D;

  const nodePositions = [50, 150, 250, 350];
  const nodeLabels = ["Forum", "Subura", "Velabrum", "Tiber"];
  const nodeDepths = nodePositions.map((_, i) => {
    const factor = 1 - (i * 0.05);
    return Math.min(D, depth * factor + (i * 0.1 * fillRatio));
  });

  const velocity = Q / (A_full * fillRatio + 0.001);
  const isCSO = Q > Q_full;

  const modernQ = 8.0;
  const modernD = 2.4;

  return (
    <Card data-testid="card-cloaca-maxima">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Cloaca Maxima — Rome's Great Sewer</CardTitle>
          <Badge data-testid="badge-ancient-sewer">Ancient Sewer</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <svg viewBox="0 0 400 300" className="w-full border rounded bg-muted/20" data-testid="svg-cloaca-maxima">
          <rect x="0" y="0" width="400" height="300" fill="#fefce8" opacity="0.2" />
          <text x="200" y="15" textAnchor="middle" fontSize="9" fill="#64748b" fontWeight="bold">
            Cloaca Maxima — Longitudinal Section (Grade 0.3%)
          </text>

          <line x1="30" y1="80" x2="380" y2="80" stroke="#a78b5a" strokeWidth="1" strokeDasharray="4,2" />
          <text x="385" y="83" fontSize="6" fill="#a78b5a">Ground Level</text>

          {nodePositions.map((x, i) => {
            const sewerTop = 120;
            const sewerBot = 120 + 60;
            const waterH = (nodeDepths[i] / D) * 60;
            return (
              <g key={`node-${i}`}>
                <path d={`M ${x - 30},${sewerBot} L ${x - 30},${sewerTop + 15} Q ${x},${sewerTop - 5} ${x + 30},${sewerTop + 15} L ${x + 30},${sewerBot} Z`} fill="none" stroke="#8B7355" strokeWidth="2" />

                {waterH > 0 && (
                  <rect x={x - 28} y={sewerBot - waterH} width="56" height={waterH} fill={`rgba(59,130,246,${0.3 + fillRatio * 0.3})`} rx="1" />
                )}

                {i < 3 && (
                  <line x1={x + 30} y1={sewerBot - 5} x2={nodePositions[i + 1] - 30} y2={sewerBot - 5} stroke="#8B7355" strokeWidth="2" />
                )}

                {Q > 0 && Array.from({ length: 3 }, (_, j) => {
                  const t = ((animOffset + j * 40 + i * 30) % 200) / 200;
                  const px = x - 25 + t * 50;
                  const py = sewerBot - waterH * 0.5 + Math.sin(t * 8) * 3;
                  return <circle key={`flow-${i}-${j}`} cx={px} cy={py} r="2" fill="#3b82f6" opacity={0.5 + t * 0.3} />;
                })}

                <rect x={x - 3} y="80" width="6" height={sewerTop - 80 + 15} fill="#a78b5a" stroke="#8B7355" strokeWidth="0.5" />

                <text x={x} y={sewerBot + 15} textAnchor="middle" fontSize="7" fill="#64748b" fontWeight="bold">{nodeLabels[i]}</text>
                <text x={x} y={sewerBot + 25} textAnchor="middle" fontSize="6" fill="#3b82f6">d={conv.length(nodeDepths[i]).toFixed(1)} {u.length}</text>
              </g>
            );
          })}

          <rect x="355" y="170" width="35" height="20" fill="rgba(59,130,246,0.3)" stroke="#3b82f6" strokeWidth="1" />
          <text x="372" y="200" textAnchor="middle" fontSize="6" fill="#3b82f6">Tiber River</text>

          <g transform="translate(50, 220)">
            <text x="0" y="0" fontSize="7" fill="#8B7355" fontWeight="bold">Cross-Section (Ø{conv.length(3.2).toFixed(1)} {u.length}):</text>
            <path d={`M 0,50 L 0,20 Q 25,0 50,20 L 50,50 Z`} fill="none" stroke="#8B7355" strokeWidth="2" />
            <rect x="2" y={50 - fillRatio * 45} width="46" height={fillRatio * 45} fill="rgba(59,130,246,0.4)" rx="1" />
            <text x="25" y="60" textAnchor="middle" fontSize="6" fill="#64748b">{conv.length(3.2).toFixed(1)} {u.length} stone arch</text>
          </g>

          {isCSO && (
            <text x="200" y="285" textAnchor="middle" fontSize="8" fill="#ef4444" fontWeight="bold">
              ⚠ CSO OVERFLOW — Q ({conv.flow(Q).toFixed(1)}) &gt; Q_full ({conv.flow(Q_full).toFixed(1)} {u.flow})
            </text>
          )}
        </svg>

        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-medium text-muted-foreground">Weather:</span>
          {(["dry", "light", "heavy", "extreme"] as const).map((w) => (
            <Button
              key={w}
              variant={weather === w ? "default" : "outline"}
              size="sm"
              onClick={() => setWeather(w)}
              data-testid={`button-weather-${w}`}
            >
              {weatherLabels[w]} ({conv.flow(weatherFlows[w]).toFixed(1)} {u.flow})
            </Button>
          ))}
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800 p-3">
          <div className="text-xs font-semibold mb-2 text-blue-700 dark:text-blue-300" data-testid="text-manning-cloaca">
            Manning's: Q = (1/n)·A·R^(2/3)·S^(1/2) | n={n}, S={S}
          </div>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div data-testid="text-q-full"><span className="text-muted-foreground">Q_full:</span> <span className="font-bold">{conv.flow(Q_full).toFixed(1)} {u.flow}</span></div>
            <div data-testid="text-current-q"><span className="text-muted-foreground">Q_current:</span> <span className="font-bold">{conv.flow(Q).toFixed(1)} {u.flow}</span></div>
            <div data-testid="text-flow-depth-cloaca"><span className="text-muted-foreground">Depth:</span> <span className="font-bold">{conv.length(depth).toFixed(2)} {u.length}</span></div>
            <div data-testid="text-velocity-cloaca"><span className="text-muted-foreground">Velocity:</span> <span className="font-bold">{conv.velocity(velocity).toFixed(2)} {u.velocity}</span></div>
            <div data-testid="text-fill-ratio"><span className="text-muted-foreground">Fill:</span> <span className="font-bold">{(fillRatio * 100).toFixed(0)}%</span></div>
            <div data-testid="text-a-full"><span className="text-muted-foreground">A_full:</span> <span className="font-bold">{conv.area(A_full).toFixed(2)} {u.area}</span></div>
          </div>
        </div>

        <div className="bg-red-50 dark:bg-red-900/20 rounded border border-red-200 dark:border-red-800 p-3" data-testid="text-cso-warning">
          <span className="text-xs font-semibold text-red-700 dark:text-red-300">CSO Warning: </span>
          <span className="text-xs text-red-800 dark:text-red-200">
            This IS a CSO — the world's first Combined Sewer Overflow is 2,600 years old.
          </span>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800 p-3" data-testid="text-comparison-modern">
          <div className="text-xs font-semibold mb-1 text-blue-700 dark:text-blue-300">Modern vs Ancient:</div>
          <div className="text-xs text-blue-800 dark:text-blue-200">
            Modern trunk sewer: Ø{conv.length(modernD).toFixed(1)} {u.length}, Q={conv.flow(modernQ).toFixed(1)} {u.flow} | Cloaca Maxima: Ø{conv.length(D).toFixed(1)} {u.length}, Q={conv.flow(Q_full).toFixed(1)} {u.flow}
          </div>
          <div className="text-xs font-bold text-blue-800 dark:text-blue-200 mt-1">
            "The Romans overbuilt. That's why it still works."
          </div>
        </div>

        <div className="bg-amber-50 dark:bg-amber-900/20 rounded border border-amber-200 dark:border-amber-800 p-3" data-testid="text-historical-fact-cloaca">
          <span className="text-xs font-semibold text-amber-700 dark:text-amber-300">Historical Fact: </span>
          <span className="text-xs text-amber-800 dark:text-amber-200">
            The Cloaca Maxima was built around 600 BCE and portions are still in service today — making it one of the oldest functioning engineered structures on Earth.
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

export function IndusValleyDrainAnimation() {
  const { u, conv } = useUnits();
  const [numHouses, setNumHouses] = useState([40]);
  const [personsPerHouse, setPersonsPerHouse] = useState([6]);
  const [waterUse, setWaterUse] = useState([20]);
  const [rainfallRate, setRainfallRate] = useState([0]);
  const [animOffset, setAnimOffset] = useState(0);

  const houses = numHouses[0];
  const persons = personsPerHouse[0];
  const usage = waterUse[0];
  const rain = rainfallRate[0];

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimOffset((prev) => (prev + 2) % 300);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const DWF = (houses * persons * usage * 0.8) / 86400;
  const roofArea = houses * 30;
  const streetArea = houses * 10;
  const totalCatchArea = roofArea + streetArea;
  const WWF = (rain / 1000 / 3600) * totalCatchArea;
  const totalFlow = DWF + WWF;

  const drainW = 0.6;
  const drainH = 0.9;
  const drainN = 0.015;
  const drainS = 0.015;
  const drainA = drainW * drainH;
  const drainP = drainW + 2 * drainH;
  const drainR = drainA / drainP;
  const Q_full = (1 / drainN) * drainA * Math.pow(drainR, 2 / 3) * Math.pow(drainS, 0.5) * 1000;

  const utilization = (totalFlow * 1000 / Q_full) * 100;

  const gridCols = Math.min(8, Math.ceil(Math.sqrt(houses)));
  const gridRows = Math.ceil(houses / gridCols);
  const displayHouses = Math.min(houses, gridCols * gridRows);

  return (
    <Card data-testid="card-indus-valley-drain">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Indus Valley Urban Drainage — Mohenjo-Daro</CardTitle>
          <Badge data-testid="badge-urban-drainage">Urban Drainage</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <svg viewBox="0 0 400 300" className="w-full border rounded bg-muted/20" data-testid="svg-indus-valley">
          <rect x="0" y="0" width="400" height="300" fill="#fefce8" opacity="0.2" />
          <text x="200" y="15" textAnchor="middle" fontSize="9" fill="#64748b" fontWeight="bold">
            Mohenjo-Daro — Urban Drainage Plan (2600 BCE)
          </text>

          {rain > 0 && Array.from({ length: Math.min(rain * 2, 30) }, (_, i) => {
            const rx = 20 + ((animOffset * 2 + i * 31) % 370);
            const ry = ((animOffset + i * 17) % 50) + 20;
            return <line key={`rain-${i}`} x1={rx} y1={ry} x2={rx - 1} y2={ry + 6} stroke="#3b82f6" strokeWidth="0.8" opacity="0.3" />;
          })}

          {Array.from({ length: Math.min(displayHouses, 48) }, (_, i) => {
            const col = i % gridCols;
            const row = Math.floor(i / gridCols);
            const hx = 30 + col * 42;
            const hy = 30 + row * 35;
            if (hy > 210) return null;
            return (
              <g key={`house-${i}`}>
                <rect x={hx} y={hy} width="30" height="22" fill="#e8d5b7" stroke="#a78b5a" strokeWidth="1" rx="1" />
                <rect x={hx + 10} y={hy + 8} width="10" height="8" fill="rgba(59,130,246,0.3)" stroke="#3b82f6" strokeWidth="0.5" rx="0.5" />
                <text x={hx + 15} y={hy + 14} textAnchor="middle" fontSize="3" fill="#3b82f6">bath</text>

                {totalFlow > 0 && (() => {
                  const t = ((animOffset + i * 15) % 200) / 200;
                  return (
                    <circle cx={hx + 15 + t * 20} cy={hy + 24 + t * 5} r="1.5" fill="#3b82f6" opacity={0.4 + t * 0.3} />
                  );
                })()}
              </g>
            );
          })}

          <rect x="25" y="225" width="320" height="8" fill="#a78b5a" stroke="#8B7355" strokeWidth="1.5" rx="1" />
          <text x="185" y="222" textAnchor="middle" fontSize="6" fill="#8B7355">Main Trunk Drain ({conv.length(0.6).toFixed(1)} {u.length} × {conv.length(0.9).toFixed(1)} {u.length}, covered)</text>

          {totalFlow > 0 && Array.from({ length: 8 }, (_, i) => {
            const t = ((animOffset + i * 35) % 300) / 300;
            return <circle key={`trunk-${i}`} cx={25 + t * 320} cy="229" r="2" fill="#3b82f6" opacity={0.5 + t * 0.3} />;
          })}

          {[0.25, 0.5, 0.75].map((frac, i) => {
            const sx = 25 + frac * 320;
            return (
              <g key={`soak-${i}`}>
                <circle cx={sx} cy="245" r="6" fill="rgba(139,115,85,0.3)" stroke="#8B7355" strokeWidth="1" strokeDasharray="2,1" />
                <text x={sx} y="248" textAnchor="middle" fontSize="4" fill="#8B7355">soak</text>
                <text x={sx} y="253" textAnchor="middle" fontSize="4" fill="#8B7355">pit</text>
              </g>
            );
          })}

          <rect x="350" y="218" width="30" height="22" fill="rgba(59,130,246,0.2)" stroke="#3b82f6" strokeWidth="1" rx="2" />
          <text x="365" y="232" textAnchor="middle" fontSize="5" fill="#3b82f6">Outfall</text>

          <rect x="25" y="265" width={Math.min(utilization, 100) * 3.2} height="10" fill={utilization > 80 ? "#ef4444" : utilization > 50 ? "#f59e0b" : "#22c55e"} rx="2" />
          <rect x="25" y="265" width="320" height="10" fill="none" stroke="#94a3b8" strokeWidth="0.5" rx="2" />
          <text x="185" y="288" textAnchor="middle" fontSize="6" fill="#64748b">
            Utilization: {utilization.toFixed(1)}% of {conv.flowSmall(Q_full).toFixed(0)} {u.flowSmall} capacity
          </text>
        </svg>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-medium" data-testid="label-num-houses">Houses: {houses}</label>
            <Slider value={numHouses} onValueChange={setNumHouses} min={10} max={100} step={5} data-testid="slider-num-houses" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium" data-testid="label-persons">Persons/House: {persons}</label>
            <Slider value={personsPerHouse} onValueChange={setPersonsPerHouse} min={4} max={12} step={1} data-testid="slider-persons" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium" data-testid="label-water-use">Water Use: {conv.flowSmall(usage / 86.4).toFixed(1)} {u.flowSmall}/person</label>
            <Slider value={waterUse} onValueChange={setWaterUse} min={10} max={40} step={2} data-testid="slider-water-use" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium" data-testid="label-rainfall-rate">Rainfall: {conv.rainfall(rain).toFixed(0)} {u.rainfall}</label>
            <Slider value={rainfallRate} onValueChange={setRainfallRate} min={0} max={20} step={1} data-testid="slider-rainfall-rate" />
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800 p-3">
          <div className="text-xs font-semibold mb-2 text-blue-700 dark:text-blue-300" data-testid="text-drain-calcs">
            Drainage Calculations
          </div>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div data-testid="text-dwf"><span className="text-muted-foreground">DWF:</span> <span className="font-bold">{conv.flowSmall(DWF * 1000).toFixed(1)} {u.flowSmall}</span></div>
            <div data-testid="text-wwf"><span className="text-muted-foreground">WWF:</span> <span className="font-bold">{conv.flowSmall(WWF * 1000).toFixed(1)} {u.flowSmall}</span></div>
            <div data-testid="text-total-flow"><span className="text-muted-foreground">Total:</span> <span className="font-bold">{conv.flowSmall(totalFlow * 1000).toFixed(1)} {u.flowSmall}</span></div>
            <div data-testid="text-q-capacity"><span className="text-muted-foreground">Q_full:</span> <span className="font-bold">{conv.flowSmall(Q_full).toFixed(0)} {u.flowSmall}</span></div>
            <div data-testid="text-utilization">
              <span className="text-muted-foreground">Used:</span>{" "}
              <span className={`font-bold ${utilization < 20 ? "text-green-600" : "text-blue-600"}`}>{utilization.toFixed(1)}%</span>
            </div>
            <div data-testid="text-overdesign">
              <span className="text-muted-foreground">Overdesign:</span>{" "}
              <span className="font-bold text-green-600">{utilization > 0 ? (100 / utilization).toFixed(0) : "∞"}×</span>
            </div>
          </div>
          {utilization < 20 && (
            <div className="text-xs font-bold text-green-600 mt-2" data-testid="text-overdesign-note">
              MASSIVELY overdesigned, like the Romans!
            </div>
          )}
        </div>

        <div className="bg-amber-50 dark:bg-amber-900/20 rounded border border-amber-200 dark:border-amber-800 p-3" data-testid="text-historical-fact-indus">
          <span className="text-xs font-semibold text-amber-700 dark:text-amber-300">Historical Fact: </span>
          <span className="text-xs text-amber-800 dark:text-amber-200">
            4,600 years ago: indoor bathrooms in EVERY house, covered street drains, soak pits for overflow. Most European cities didn't have covered drains until the 1800s.
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

export function ArchimedesScrewAnimation() {
  const { u, conv } = useUnits();
  const [screwAngle, setScrewAngle] = useState([30]);
  const [diameter, setDiameter] = useState([0.6]);
  const [rpm, setRpm] = useState([20]);
  const [animOffset, setAnimOffset] = useState(0);

  const angle = screwAngle[0];
  const D = diameter[0];
  const speed = rpm[0];

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimOffset((prev) => (prev + speed / 5) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, [speed]);

  const angleRad = (angle * Math.PI) / 180;
  const liftH = 3.0;
  const screwLength = liftH / Math.sin(angleRad);

  const baseEfficiency = 0.70;
  const anglePenalty = Math.abs(angle - 30) / 30;
  const efficiency = Math.max(0.3, baseEfficiency * (1 - anglePenalty * 0.5));

  const volumePerRev = 0.5 * Math.PI * (D / 2) * (D / 2) * 0.3;
  const Q = volumePerRev * (speed / 60) * efficiency;

  const rho = 1000;
  const g = 9.81;
  const P_out = rho * g * Q * liftH;
  const P_in = P_out / efficiency;

  const svgAngle = angle;
  const screwStartX = 80;
  const screwStartY = 240;
  const screwEndX = screwStartX + 200 * Math.cos(angleRad);
  const screwEndY = screwStartY - 200 * Math.sin(angleRad);

  const numFlights = 8;

  return (
    <Card data-testid="card-archimedes-screw">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Archimedes Screw Pump</CardTitle>
          <Badge data-testid="badge-water-lifting">Water Lifting</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <svg viewBox="0 0 400 300" className="w-full border rounded bg-muted/20" data-testid="svg-archimedes-screw">
          <rect x="0" y="0" width="400" height="300" fill="#f0fdf4" opacity="0.2" />
          <text x="200" y="15" textAnchor="middle" fontSize="9" fill="#64748b" fontWeight="bold">
            Archimedes Screw — Profile View ({angle}° angle)
          </text>

          <rect x="20" y="230" width="80" height="50" fill="rgba(59,130,246,0.3)" stroke="#3b82f6" strokeWidth="1" rx="2" />
          <text x="60" y="260" textAnchor="middle" fontSize="7" fill="#1e40af">Lower Basin</text>
          <text x="60" y="270" textAnchor="middle" fontSize="6" fill="#3b82f6">El: {conv.length(100).toFixed(0)} {u.length}</text>

          {Array.from({ length: 3 }, (_, i) => {
            const t = ((animOffset + i * 40) % 200) / 200;
            return <circle key={`lb-${i}`} cx={30 + t * 60} cy={245 + Math.sin(t * 6) * 3} r="2" fill="#3b82f6" opacity="0.5" />;
          })}

          <rect x={screwEndX - 20} y={screwEndY - 30} width="80" height="50" fill="rgba(59,130,246,0.3)" stroke="#3b82f6" strokeWidth="1" rx="2" />
          <text x={screwEndX + 20} y={screwEndY - 5} textAnchor="middle" fontSize="7" fill="#1e40af">Upper Basin</text>
          <text x={screwEndX + 20} y={screwEndY + 5} textAnchor="middle" fontSize="6" fill="#3b82f6">El: {conv.length(103).toFixed(0)} {u.length}</text>

          <line x1={screwStartX} y1={screwStartY} x2={screwEndX} y2={screwEndY} stroke="#8B7355" strokeWidth="4" />
          <line x1={screwStartX} y1={screwStartY - D * 40} x2={screwEndX} y2={screwEndY - D * 40} stroke="#8B7355" strokeWidth="1.5" strokeDasharray="3,2" />
          <line x1={screwStartX} y1={screwStartY + D * 40} x2={screwEndX} y2={screwEndY + D * 40} stroke="#8B7355" strokeWidth="1.5" strokeDasharray="3,2" />

          {Array.from({ length: numFlights }, (_, i) => {
            const frac = i / numFlights;
            const fx = screwStartX + frac * (screwEndX - screwStartX);
            const fy = screwStartY + frac * (screwEndY - screwStartY);
            const phaseOffset = (animOffset + i * (360 / numFlights)) % 360;
            const wobble = Math.sin((phaseOffset * Math.PI) / 180) * D * 35;

            return (
              <g key={`flight-${i}`}>
                <line x1={fx} y1={fy - D * 35} x2={fx} y2={fy + D * 35} stroke="#a78b5a" strokeWidth="1.5" opacity="0.6" />
                <circle cx={fx} cy={fy + wobble} r={3 + D * 5} fill="rgba(59,130,246,0.5)" opacity={0.4 + efficiency * 0.4}>
                  <animate attributeName="opacity" values="0.3;0.7;0.3" dur="1s" repeatCount="indefinite" />
                </circle>
              </g>
            );
          })}

          <circle cx={screwStartX} cy={screwStartY} r="5" fill="#8B7355" stroke="#a78b5a" strokeWidth="1" />
          <circle cx={screwEndX} cy={screwEndY} r="5" fill="#8B7355" stroke="#a78b5a" strokeWidth="1" />

          <line x1={screwStartX + 10} y1={screwStartY + 30} x2={screwEndX - 10} y2={screwStartY + 30} stroke="#94a3b8" strokeWidth="0.5" strokeDasharray="2,2" />
          <text x={(screwStartX + screwEndX) / 2} y={screwStartY + 42} textAnchor="middle" fontSize="6" fill="#94a3b8">
            L = {conv.length(screwLength).toFixed(1)} {u.length} | Lift = {conv.length(liftH).toFixed(1)} {u.length}
          </text>

          <g transform="translate(290, 200)">
            <text x="0" y="0" fontSize="7" fill="#64748b" fontWeight="bold">Efficiency vs Angle</text>
            {[15, 20, 25, 30, 35, 40, 45].map((a, i) => {
              const pen = Math.abs(a - 30) / 30;
              const eff = Math.max(0.3, baseEfficiency * (1 - pen * 0.5));
              const bh = eff * 60;
              const bx = i * 13;
              return (
                <g key={`eff-${a}`}>
                  <rect x={bx} y={70 - bh} width="10" height={bh} fill={a === angle ? "#3b82f6" : "rgba(59,130,246,0.3)"} rx="1" />
                  <text x={bx + 5} y="80" textAnchor="middle" fontSize="4" fill="#94a3b8">{a}°</text>
                </g>
              );
            })}
          </g>

          <text x="320" y="155" textAnchor="middle" fontSize="6" fill="#94a3b8">
            SWMM5: Pump Type 4
          </text>
          <text x="320" y="165" textAnchor="middle" fontSize="6" fill="#94a3b8">
            (Variable Speed)
          </text>
        </svg>

        <div className="grid grid-cols-3 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-medium" data-testid="label-screw-angle">Angle: {angle}°</label>
            <Slider value={screwAngle} onValueChange={setScrewAngle} min={15} max={45} step={1} data-testid="slider-screw-angle" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium" data-testid="label-diameter">Diameter: {conv.length(D).toFixed(1)} {u.length}</label>
            <Slider value={diameter} onValueChange={setDiameter} min={0.3} max={1.0} step={0.1} data-testid="slider-diameter" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium" data-testid="label-rpm">Speed: {speed} RPM</label>
            <Slider value={rpm} onValueChange={setRpm} min={5} max={40} step={1} data-testid="slider-rpm" />
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800 p-3">
          <div className="text-xs font-semibold mb-2 text-blue-700 dark:text-blue-300" data-testid="text-screw-results">
            P_out = ρ × g × Q × h | P_in = P_out / η
          </div>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div data-testid="text-lift-height"><span className="text-muted-foreground">Lift:</span> <span className="font-bold">{conv.length(liftH).toFixed(1)} {u.length}</span></div>
            <div data-testid="text-flow-rate"><span className="text-muted-foreground">Flow:</span> <span className="font-bold">{conv.flowSmall(Q * 1000).toFixed(1)} {u.flowSmall}</span></div>
            <div data-testid="text-efficiency"><span className="text-muted-foreground">Efficiency:</span> <span className="font-bold">{(efficiency * 100).toFixed(0)}%</span></div>
            <div data-testid="text-power-out"><span className="text-muted-foreground">P_out:</span> <span className="font-bold">{P_out.toFixed(0)} W</span></div>
            <div data-testid="text-power-in"><span className="text-muted-foreground">P_in:</span> <span className="font-bold">{P_in.toFixed(0)} W</span></div>
            <div data-testid="text-screw-length"><span className="text-muted-foreground">Length:</span> <span className="font-bold">{conv.length(screwLength).toFixed(1)} {u.length}</span></div>
          </div>
        </div>

        <div className="bg-amber-50 dark:bg-amber-900/20 rounded border border-amber-200 dark:border-amber-800 p-3" data-testid="text-historical-fact-archimedes">
          <span className="text-xs font-semibold text-amber-700 dark:text-amber-300">Historical Fact: </span>
          <span className="text-xs text-amber-800 dark:text-amber-200">
            Still used today in wastewater treatment plants worldwide. The design hasn't improved in 2,200 years because it's already optimal for low-head, high-flow pumping.
          </span>
        </div>
      </CardContent>
    </Card>
  );
}