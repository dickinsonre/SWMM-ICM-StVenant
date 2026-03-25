import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useUnits } from "@/contexts/UnitsContext";

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const WATER_DEPTHS: Record<string, number> = {
  Jan:8, Feb:10, Mar:12, Apr:15, May:18, Jun:22, Jul:14, Aug:6, Sep:7, Oct:10, Nov:9, Dec:9
};

export function IndianStepwellAnimation() {
  const { u, conv } = useUnits();
  const [month, setMonth] = useState("Aug");
  const [animOffset, setAnimOffset] = useState(0);

  const waterDepth = WATER_DEPTHS[month];

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimOffset((prev) => (prev + 1) % 100);
    }, 80);
    return () => clearInterval(interval);
  }, []);

  const svgW = 400;
  const svgH = 320;
  const wellTop = 40;
  const wellBottom = 280;
  const wellHeight = wellBottom - wellTop;
  const totalDepth = 30;
  const depthScale = wellHeight / totalDepth;

  const waterY = wellTop + waterDepth * depthScale;

  const terraces = [
    { depth: 0, widthLeft: 30, widthRight: 370 },
    { depth: 5, widthLeft: 60, widthRight: 340 },
    { depth: 10, widthLeft: 90, widthRight: 310 },
    { depth: 15, widthLeft: 120, widthRight: 280 },
    { depth: 20, widthLeft: 140, widthRight: 260 },
    { depth: 25, widthLeft: 160, widthRight: 240 },
    { depth: 30, widthLeft: 170, widthRight: 230 },
  ];

  const temps = [
    { depth: 0, temp: 42, color: "#ef4444" },
    { depth: 10, temp: 32, color: "#f97316" },
    { depth: 20, temp: 26, color: "#3b82f6" },
    { depth: 30, temp: 22, color: "#1d4ed8" },
  ];

  const submergedCount = terraces.filter(t => t.depth >= waterDepth).length;

  return (
    <Card data-testid="card-indian-stepwell">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Indian Stepwell (Vav/Baoli)</CardTitle>
          <Badge data-testid="badge-vertical-access">Vertical Access</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full border rounded bg-muted/20" data-testid="svg-indian-stepwell">
          <defs>
            <linearGradient id="tempGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ef4444" stopOpacity="0.15" />
              <stop offset="33%" stopColor="#f97316" stopOpacity="0.1" />
              <stop offset="66%" stopColor="#3b82f6" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#1d4ed8" stopOpacity="0.15" />
            </linearGradient>
          </defs>

          <rect x="30" y={wellTop} width="340" height={wellHeight} fill="url(#tempGrad)" />

          <text x="200" y="15" textAnchor="middle" fontSize="9" fill="#64748b" fontWeight="bold">
            Stepwell Cross-Section — {conv.length(30).toFixed(0)} {u.length} Deep
          </text>
          <text x="200" y="27" textAnchor="middle" fontSize="7" fill="#64748b">
            Month: {month} | Water Table: {conv.length(waterDepth).toFixed(0)} {u.length} below surface
          </text>

          {terraces.map((t, i) => {
            const y = wellTop + t.depth * depthScale;
            const submerged = t.depth >= waterDepth;
            const stepH = i < terraces.length - 1
              ? (terraces[i + 1].depth - t.depth) * depthScale
              : 0;
            return (
              <g key={`terrace-${i}`}>
                <rect
                  x={t.widthLeft}
                  y={y}
                  width={10}
                  height={stepH || depthScale}
                  fill={submerged ? "#6b8f71" : "#a78b5a"}
                  stroke="#8B7355"
                  strokeWidth="1"
                />
                <rect
                  x={t.widthRight - 10}
                  y={y}
                  width={10}
                  height={stepH || depthScale}
                  fill={submerged ? "#6b8f71" : "#a78b5a"}
                  stroke="#8B7355"
                  strokeWidth="1"
                />
                {i > 0 && (
                  <>
                    <line x1={terraces[i-1].widthLeft + 10} y1={y} x2={t.widthLeft} y2={y} stroke="#8B7355" strokeWidth="1.5" />
                    <line x1={t.widthRight} y1={y} x2={terraces[i-1].widthRight - 10} y2={y} stroke="#8B7355" strokeWidth="1.5" />
                  </>
                )}
                {i % 2 === 0 && !submerged && (
                  <text x={t.widthLeft - 3} y={y + 8} textAnchor="end" fontSize="5" fill="#64748b">
                    {conv.length(t.depth).toFixed(0)} {u.length}
                  </text>
                )}
              </g>
            );
          })}

          <rect
            x={terraces[terraces.length - 1].widthLeft}
            y={waterY}
            width={terraces[terraces.length - 1].widthRight - terraces[terraces.length - 1].widthLeft}
            height={wellBottom - waterY}
            fill="rgba(59,130,246,0.4)"
          />

          {terraces.slice(0, -1).map((t, i) => {
            const tY = wellTop + t.depth * depthScale;
            const nextY = wellTop + terraces[i + 1].depth * depthScale;
            if (waterY > nextY) return null;
            const fillTop = Math.max(waterY, tY);
            const fillBottom = nextY;
            if (fillTop >= fillBottom) return null;
            return (
              <g key={`water-fill-${i}`}>
                <rect
                  x={t.widthLeft}
                  y={fillTop}
                  width={t.widthRight - t.widthLeft}
                  height={fillBottom - fillTop}
                  fill="rgba(59,130,246,0.35)"
                />
              </g>
            );
          })}

          {[0, 1, 2].map((d) => {
            const t = ((animOffset + d * 33) % 100) / 100;
            const y = waterY + t * (wellBottom - waterY) * 0.3;
            return (
              <circle key={`bubble-${d}`} cx={200 + (d - 1) * 15} cy={wellBottom - (y - waterY)} r="2" fill="#3b82f6" opacity={0.6 - t * 0.3}>
                <animate attributeName="cy" values={`${wellBottom};${waterY + 5}`} dur="3s" repeatCount="indefinite" />
              </circle>
            );
          })}

          {temps.map((t, i) => {
            const y = wellTop + t.depth * depthScale;
            return (
              <g key={`temp-${i}`}>
                <rect x="375" y={y - 4} width="20" height="10" fill={t.color} opacity="0.3" rx="2" />
                <text x="385" y={y + 3} textAnchor="middle" fontSize="6" fill={t.color} fontWeight="bold">
                  {t.temp}°C
                </text>
              </g>
            );
          })}

          <line x1="375" y1={wellTop} x2="375" y2={wellBottom} stroke="#94a3b8" strokeWidth="0.5" strokeDasharray="2,2" />

          <line x1={waterY > wellTop ? 30 : 30} y1={waterY} x2={370} y2={waterY} stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="4,2" />
          <text x="25" y={waterY + 4} textAnchor="end" fontSize="6" fill="#3b82f6">WL</text>
        </svg>

        <div className="flex items-center gap-1 flex-wrap">
          <span className="text-xs font-medium text-muted-foreground">Month:</span>
          {MONTHS.map((m) => (
            <Button
              key={m}
              variant={month === m ? "default" : "outline"}
              size="sm"
              className="px-2 py-1 h-7 text-xs"
              onClick={() => setMonth(m)}
              data-testid={`button-month-${m.toLowerCase()}`}
            >
              {m}
            </Button>
          ))}
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800 p-3">
          <div className="text-xs font-semibold mb-2 text-blue-700 dark:text-blue-300">SWMM5 Model</div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div data-testid="text-water-depth">
              <span className="text-muted-foreground">Water Table:</span>{" "}
              <span className="font-bold">{conv.length(waterDepth).toFixed(0)} {u.length} deep</span>
            </div>
            <div data-testid="text-submerged-steps">
              <span className="text-muted-foreground">Submerged Steps:</span>{" "}
              <span className="font-bold">{submergedCount}/{terraces.length}</span>
            </div>
            <div data-testid="text-temp-surface">
              <span className="text-muted-foreground">Surface Temp:</span>{" "}
              <span className="font-bold text-red-500">42°C</span>
            </div>
            <div data-testid="text-temp-bottom">
              <span className="text-muted-foreground">Bottom Temp:</span>{" "}
              <span className="font-bold text-blue-500">22°C</span>
            </div>
          </div>
          <div className="text-xs text-muted-foreground mt-2">
            Storage nodes at each terrace • Orifice links for step overflow • Groundwater inflow at bottom
          </div>
        </div>

        <div className="bg-amber-50 dark:bg-amber-900/20 rounded border border-amber-200 dark:border-amber-800 p-3" data-testid="text-historical-fact-stepwell">
          <span className="text-xs font-semibold text-amber-700 dark:text-amber-300">Historical Fact: </span>
          <span className="text-xs text-amber-800 dark:text-amber-200">
            The stepwell is an AIR CONDITIONER — hot air enters at top, cools as it descends. Temperature drops 20°C from surface to bottom, providing natural cooling in the scorching Indian heat.
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

type AztecScenario = "dry" | "flood1449" | "flush";

export function AztecDikeAnimation() {
  const { u, conv } = useUnits();
  const [scenario, setScenario] = useState<AztecScenario>("dry");
  const [sluiceOpen, setSluiceOpen] = useState(false);
  const [lakeLevel, setLakeLevel] = useState([2.0]);
  const [animOffset, setAnimOffset] = useState(0);

  const level = lakeLevel[0];

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimOffset((prev) => (prev + 2) % 200);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (scenario === "dry") { setLakeLevel([1.5]); setSluiceOpen(false); }
    else if (scenario === "flood1449") { setLakeLevel([3.8]); setSluiceOpen(false); }
    else if (scenario === "flush") { setLakeLevel([2.5]); setSluiceOpen(true); }
  }, [scenario]);

  const dikeHeight = 4.0;
  const overtopping = level > dikeHeight;
  const freshwaterLevel = sluiceOpen ? Math.min(level, 2.5) : 1.8;

  const waterParticles = (startX: number, startY: number, endX: number, endY: number, count: number, color: string) => {
    const particles = [];
    for (let i = 0; i < count; i++) {
      const t = ((animOffset + i * (200 / count)) % 200) / 200;
      const x = startX + t * (endX - startX);
      const y = startY + t * (endY - startY);
      particles.push(
        <circle key={`wp-${startX}-${startY}-${i}`} cx={x} cy={y} r="2" fill={color} opacity={0.5 + t * 0.3}>
          <animate attributeName="opacity" values="0.3;0.7;0.3" dur="1.5s" repeatCount="indefinite" />
        </circle>
      );
    }
    return particles;
  };

  return (
    <Card data-testid="card-aztec-dike">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Aztec Great Dike — Lake Texcoco</CardTitle>
          <Badge data-testid="badge-flood-control">Flood Control</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <svg viewBox="0 0 400 300" className="w-full border rounded bg-muted/20" data-testid="svg-aztec-dike">
          <rect x="0" y="0" width="400" height="300" fill="#fef9ef" />

          <text x="200" y="15" textAnchor="middle" fontSize="9" fill="#64748b" fontWeight="bold">
            Lake Texcoco — Plan View
          </text>

          <rect x="10" y="40" width="150" height="160" rx="8" fill="rgba(139,115,85,0.15)" stroke="#8B7355" strokeWidth="1.5" />
          <rect x="12" y="42" width="146" height="156" rx="7" fill={`rgba(139,115,85,${0.1 + level * 0.05})`} />
          <text x="85" y="70" textAnchor="middle" fontSize="9" fill="#8B7355" fontWeight="bold">Lake Texcoco</text>
          <text x="85" y="82" textAnchor="middle" fontSize="7" fill="#8B7355">(Brackish/Salt)</text>
          <text x="85" y="94" textAnchor="middle" fontSize="7" fill="#8B7355">Level: {conv.length(level).toFixed(1)} {u.length}</text>

          {waterParticles(30, 110, 140, 130, 5, "#a78b5a")}
          {waterParticles(50, 150, 130, 140, 4, "#a78b5a")}

          <rect x="165" y="40" width="12" height="160" fill="#a78b5a" stroke="#8B7355" strokeWidth="2" rx="1" />
          <text x="171" y="35" textAnchor="middle" fontSize="6" fill="#8B7355" fontWeight="bold">DIKE</text>
          <text x="171" y="210" textAnchor="middle" fontSize="5" fill="#8B7355">{conv.length(16000).toFixed(0)} {u.length}</text>

          {sluiceOpen && (
            <rect x="167" y="100" width="8" height="12" fill="#3b82f6" opacity="0.6" rx="1" />
          )}
          <rect x="166" y="98" width="10" height="3" fill={sluiceOpen ? "#22c55e" : "#ef4444"} rx="1" />
          <rect x="166" y="111" width="10" height="3" fill={sluiceOpen ? "#22c55e" : "#ef4444"} rx="1" />
          <text x="171" y="125" textAnchor="middle" fontSize="5" fill="#64748b">Sluice</text>

          {sluiceOpen && waterParticles(163, 106, 180, 106, 3, "#3b82f6")}

          <ellipse cx="260" cy="120" rx="55" ry="50" fill="rgba(59,130,246,0.15)" stroke="#3b82f6" strokeWidth="1.5" />
          <text x="260" y="105" textAnchor="middle" fontSize="7" fill="#1e40af" fontWeight="bold">Freshwater</text>
          <text x="260" y="115" textAnchor="middle" fontSize="7" fill="#1e40af" fontWeight="bold">Lagoon</text>

          <rect x="240" y="125" width="40" height="25" rx="3" fill="#a78b5a" stroke="#8B7355" strokeWidth="1" />
          <text x="260" y="140" textAnchor="middle" fontSize="5" fill="white" fontWeight="bold">Tenochtitlan</text>

          {waterParticles(210, 100, 280, 90, 4, "#3b82f6")}

          {[0, 1, 2].map(i => (
            <g key={`chinampa-${i}`}>
              <rect x={320 + i * 20} y={90 + i * 15} width="15" height="10" fill="#22c55e" stroke="#15803d" strokeWidth="0.5" rx="1" />
              <text x={327 + i * 20} y={88 + i * 15} textAnchor="middle" fontSize="4" fill="#15803d">🌿</text>
            </g>
          ))}
          <text x="350" y="145" fontSize="5" fill="#15803d">Chinampas</text>

          {overtopping && (
            <g>
              <rect x="160" y="38" width="22" height="6" fill="#ef4444" opacity="0.6" rx="1" />
              <text x="171" y="32" textAnchor="middle" fontSize="7" fill="#ef4444" fontWeight="bold">⚠ OVERTOPPING</text>
              {waterParticles(170, 45, 210, 80, 5, "#ef4444")}
            </g>
          )}

          <rect x="10" y="220" width="180" height="70" fill="#f5f0e8" stroke="#8B7355" strokeWidth="1" rx="3" />
          <text x="100" y="235" textAnchor="middle" fontSize="7" fill="#8B7355" fontWeight="bold">Dike Cross-Section</text>
          <polygon points="30,280 60,250 140,250 170,280" fill="#a78b5a" stroke="#8B7355" strokeWidth="1.5" />
          <polygon points="50,275 70,258 130,258 150,275" fill="#8B7355" opacity="0.5" />
          <text x="100" y="270" textAnchor="middle" fontSize="5" fill="white">Earth + Stone Core</text>
          <text x="30" y="290" fontSize="5" fill="#64748b">Base: {conv.length(8).toFixed(0)} {u.length}</text>
          <text x="140" y="246" fontSize="5" fill="#64748b">Height: {conv.length(4).toFixed(0)} {u.length}</text>

          <rect x="200" y="220" width="190" height="70" fill="#f5f0e8" stroke="#8B7355" strokeWidth="1" rx="3" />
          <text x="295" y="235" textAnchor="middle" fontSize="7" fill="#64748b" fontWeight="bold">SWMM5 Model</text>
          <text x="210" y="250" fontSize="5" fill="#64748b">• Storage nodes for both lakes</text>
          <text x="210" y="260" fontSize="5" fill="#64748b">• High weir link for dike (crest={conv.length(dikeHeight).toFixed(1)} {u.length})</text>
          <text x="210" y="270" fontSize="5" fill="#64748b">• Orifice + RTC for sluice gate</text>
          <text x="210" y="280" fontSize="5" fill="#64748b">• {overtopping ? "⚠ Weir overflow active!" : "Dike holding"}</text>
        </svg>

        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-medium text-muted-foreground">Scenario:</span>
          {([
            { id: "dry" as const, label: "Normal Dry Season" },
            { id: "flood1449" as const, label: "Flood Event 1449" },
            { id: "flush" as const, label: "Controlled Flush" },
          ]).map((s) => (
            <Button
              key={s.id}
              variant={scenario === s.id ? "default" : "outline"}
              size="sm"
              onClick={() => setScenario(s.id)}
              data-testid={`button-scenario-${s.id}`}
            >
              {s.label}
            </Button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant={sluiceOpen ? "default" : "outline"}
            size="sm"
            onClick={() => setSluiceOpen(!sluiceOpen)}
            data-testid="button-sluice-toggle"
          >
            Sluice: {sluiceOpen ? "OPEN" : "CLOSED"}
          </Button>
          <div className="flex-1 space-y-1">
            <label className="text-xs font-medium" data-testid="label-lake-level">Lake Level: {conv.length(level).toFixed(1)} {u.length}</label>
            <Slider value={lakeLevel} onValueChange={setLakeLevel} min={1.0} max={4.0} step={0.1} data-testid="slider-lake-level" />
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800 p-3">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div data-testid="text-lake-status">
              <span className="text-muted-foreground">Lake Texcoco:</span>{" "}
              <span className="font-bold">{conv.length(level).toFixed(1)} {u.length} ({level > 3.5 ? "Critical" : level > 2.5 ? "High" : "Normal"})</span>
            </div>
            <div data-testid="text-dike-status">
              <span className="text-muted-foreground">Dike Status:</span>{" "}
              <span className={`font-bold ${overtopping ? "text-red-500" : "text-green-500"}`}>
                {overtopping ? "OVERTOPPING!" : "Holding"}
              </span>
            </div>
            <div data-testid="text-sluice-status">
              <span className="text-muted-foreground">Sluice Gate:</span>{" "}
              <span className="font-bold">{sluiceOpen ? "Open — Water Exchange" : "Closed"}</span>
            </div>
            <div data-testid="text-freshwater-level">
              <span className="text-muted-foreground">Freshwater Lagoon:</span>{" "}
              <span className="font-bold">{conv.length(freshwaterLevel).toFixed(1)} {u.length}</span>
            </div>
          </div>
        </div>

        <div className="bg-amber-50 dark:bg-amber-900/20 rounded border border-amber-200 dark:border-amber-800 p-3" data-testid="text-historical-fact-aztec">
          <span className="text-xs font-semibold text-amber-700 dark:text-amber-300">Historical Fact: </span>
          <span className="text-xs text-amber-800 dark:text-amber-200">
            Nezahualcóyotl's Great Dike — {conv.length(16000).toFixed(0)} {u.length} long, protecting 200,000+ people from brackish flooding. The Aztecs separated salt and fresh water to sustain their island city of Tenochtitlan.
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

export function DutchPolderAnimation() {
  const { u, conv } = useUnits();
  const [rainfall, setRainfall] = useState([10]);
  const [windSpeed, setWindSpeed] = useState([20]);
  const [animOffset, setAnimOffset] = useState(0);

  const rain = rainfall[0];
  const wind = windSpeed[0];

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimOffset((prev) => (prev + 2) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const polderArea = 1000;
  const rainInflow = (rain / 1000) * polderArea * 1000;
  const seepage = 5;
  const evaporation = 3;
  const maxPumpPerMill = 5;
  const windFactor = Math.min(1, wind / 25);
  const pumpPerMill = maxPumpPerMill * windFactor;
  const totalPumping = pumpPerMill * 3;
  const netBalance = rainInflow + seepage - evaporation - totalPumping;
  const polderVolume = 4.5 * polderArea;
  const floodDays = netBalance > 0 ? polderVolume / (netBalance * 1440) : Infinity;

  const seaY = 60;
  const dikeTopY = 50;
  const polderY = 200;
  const canalY = [170, 140, 110];

  const renderWindmill = (x: number, baseY: number, index: number) => {
    const sailAngle = (animOffset * (wind / 20) + index * 90) * (Math.PI / 180);
    const sailLen = 18;
    const hubY = baseY - 25;
    return (
      <g key={`mill-${index}`}>
        <rect x={x - 3} y={baseY - 30} width={6} height={30} fill="#a78b5a" stroke="#8B7355" strokeWidth="1" />
        <polygon points={`${x - 6},${baseY - 28} ${x + 6},${baseY - 28} ${x + 4},${baseY - 32} ${x - 4},${baseY - 32}`} fill="#8B7355" />
        {[0, 1, 2, 3].map(s => {
          const angle = sailAngle + (s * Math.PI) / 2;
          const ex = x + Math.cos(angle) * sailLen;
          const ey = hubY + Math.sin(angle) * sailLen;
          return (
            <line key={`sail-${index}-${s}`} x1={x} y1={hubY} x2={ex} y2={ey} stroke="#8B7355" strokeWidth="1.5" />
          );
        })}
        <circle cx={x} cy={hubY} r="2.5" fill="#8B7355" />
        <text x={x} y={baseY + 10} textAnchor="middle" fontSize="5" fill="#64748b">
          {conv.volume(pumpPerMill).toFixed(1)} {u.volume}/min
        </text>
      </g>
    );
  };

  return (
    <Card data-testid="card-dutch-polder">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Dutch Polder — Chain Windmill Pumping</CardTitle>
          <Badge data-testid="badge-below-sea-level">Below Sea Level</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <svg viewBox="0 0 400 300" className="w-full border rounded bg-muted/20" data-testid="svg-dutch-polder">
          <rect x="0" y="0" width="400" height="300" fill="#f0f9ff" />

          <text x="200" y="15" textAnchor="middle" fontSize="9" fill="#64748b" fontWeight="bold">
            Polder Cross-Section — {conv.length(4.5).toFixed(1)} {u.length} Below Sea Level
          </text>

          <rect x="0" y={seaY} width="70" height={250 - seaY} fill="rgba(59,130,246,0.3)" />
          <line x1="0" y1={seaY} x2="70" y2={seaY} stroke="#3b82f6" strokeWidth="2" />
          <text x="35" y={seaY - 5} textAnchor="middle" fontSize="7" fill="#3b82f6" fontWeight="bold">SEA LEVEL</text>
          <text x="35" y={seaY + 15} textAnchor="middle" fontSize="6" fill="#1e40af">North Sea</text>

          {[0, 1, 2].map(i => {
            const t = ((animOffset + i * 40) % 200) / 200;
            return (
              <circle key={`wave-${i}`} cx={15 + i * 20} cy={seaY + 5 + Math.sin(t * Math.PI * 2) * 3} r="2" fill="#3b82f6" opacity="0.5" />
            );
          })}

          <polygon points={`70,${seaY - 5} 70,${250} 100,${250} 100,${dikeTopY}`} fill="#a78b5a" stroke="#8B7355" strokeWidth="2" />
          <text x="85" y={seaY + 30} textAnchor="middle" fontSize="6" fill="white" fontWeight="bold" transform="rotate(-80 85 150)">DIKE</text>

          <line x1="100" y1={seaY} x2="395" y2={seaY} stroke="#3b82f6" strokeWidth="0.5" strokeDasharray="3,3" />
          <text x="395" y={seaY - 3} textAnchor="end" fontSize="5" fill="#3b82f6">0.0{u.length} (Sea Level)</text>

          <rect x="100" y={polderY} width="290" height={250 - polderY} fill="#dcfce7" stroke="#22c55e" strokeWidth="1" />
          <text x="245" y={polderY + 15} textAnchor="middle" fontSize="7" fill="#15803d" fontWeight="bold">POLDER FARMLAND</text>
          <text x="245" y={polderY + 25} textAnchor="middle" fontSize="6" fill="#15803d">−{conv.length(4.5).toFixed(1)} {u.length} below sea level</text>

          {[0, 1, 2, 3, 4].map(i => (
            <line key={`grass-${i}`} x1={140 + i * 40} y1={polderY} x2={140 + i * 40} y2={polderY - 5} stroke="#22c55e" strokeWidth="1" />
          ))}

          {rain > 0 && Array.from({ length: Math.min(rain, 20) }, (_, i) => {
            const rx = 110 + (i * 17) % 280;
            const ry = ((animOffset * 2 + i * 37) % 180) + 30;
            return (
              <line key={`rain-${i}`} x1={rx} y1={ry} x2={rx - 1} y2={ry + 5} stroke="#3b82f6" strokeWidth="0.8" opacity="0.5" />
            );
          })}

          <rect x="105" y={polderY - 15} width="60" height="15" fill="rgba(59,130,246,0.2)" stroke="#3b82f6" strokeWidth="0.5" />
          <text x="135" y={polderY - 5} textAnchor="middle" fontSize="5" fill="#3b82f6">Ring Canal (low)</text>

          {canalY.map((cy, i) => (
            <g key={`canal-${i}`}>
              <rect x={180 + i * 70} y={cy} width="40" height="12" fill="rgba(59,130,246,0.25)" stroke="#3b82f6" strokeWidth="0.5" rx="1" />
              <text x={200 + i * 70} y={cy + 8} textAnchor="middle" fontSize="4" fill="#3b82f6">Canal {i + 1}</text>
            </g>
          ))}

          {renderWindmill(195, canalY[0], 0)}
          {renderWindmill(265, canalY[1], 1)}
          {renderWindmill(335, canalY[2], 2)}

          {wind > 0 && canalY.map((cy, i) => {
            const nextCy = i < 2 ? canalY[i + 1] : seaY + 10;
            const mx = 195 + i * 70;
            return (
              <g key={`pump-arrow-${i}`}>
                <line x1={mx + 8} y1={cy - 2} x2={mx + 8} y2={nextCy + 14} stroke="#3b82f6" strokeWidth="1.5" markerEnd="url(#arrowUp)" />
                <polygon points={`${mx + 5},${nextCy + 18} ${mx + 8},${nextCy + 12} ${mx + 11},${nextCy + 18}`} fill="#3b82f6" />
              </g>
            );
          })}

          <text x="5" y={polderY + 5} fontSize="5" fill="#64748b">−{conv.length(4.5).toFixed(1)} {u.length}</text>
          <text x="5" y={seaY + 4} fontSize="5" fill="#64748b">0.0{u.length}</text>

          {[1.5, 3.0].map((h, i) => {
            const y = polderY - (h / 4.5) * (polderY - seaY);
            return (
              <g key={`elev-${i}`}>
                <line x1="100" y1={y} x2="110" y2={y} stroke="#94a3b8" strokeWidth="0.5" />
                <text x="5" y={y + 3} fontSize="5" fill="#94a3b8">−{conv.length(4.5 - h).toFixed(1)} {u.length}</text>
              </g>
            );
          })}
        </svg>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-medium" data-testid="label-rainfall">Rainfall: {conv.rainfall(rain / 24).toFixed(1)} {u.rainfall}</label>
            <Slider value={rainfall} onValueChange={setRainfall} min={0} max={30} step={1} data-testid="slider-rainfall" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium" data-testid="label-wind-speed">Wind Speed: {conv.velocity(wind / 3.6).toFixed(1)} {u.velocity}</label>
            <Slider value={windSpeed} onValueChange={setWindSpeed} min={0} max={40} step={1} data-testid="slider-wind-speed" />
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800 p-3">
          <div className="text-xs font-semibold mb-2 text-blue-700 dark:text-blue-300">Water Balance ({u.volume}/min)</div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div data-testid="text-rain-inflow">
              <span className="text-muted-foreground">Rain on polder:</span>{" "}
              <span className="font-bold text-blue-500">+{conv.volume(rainInflow).toFixed(1)}</span>
            </div>
            <div data-testid="text-seepage">
              <span className="text-muted-foreground">Groundwater seepage:</span>{" "}
              <span className="font-bold text-blue-500">+{conv.volume(seepage).toFixed(0)}</span>
            </div>
            <div data-testid="text-evaporation">
              <span className="text-muted-foreground">Evaporation:</span>{" "}
              <span className="font-bold text-green-500">−{conv.volume(evaporation).toFixed(0)}</span>
            </div>
            <div data-testid="text-pumping">
              <span className="text-muted-foreground">Windmill pumping:</span>{" "}
              <span className={`font-bold ${totalPumping > 0 ? "text-green-500" : "text-red-500"}`}>−{conv.volume(totalPumping).toFixed(1)}</span>
            </div>
          </div>
          <div className="mt-2 pt-2 border-t border-blue-200 dark:border-blue-700">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold" data-testid="text-net-balance">
                Net Balance: <span className={netBalance > 0 ? "text-red-500" : "text-green-500"}>{netBalance > 0 ? "+" : ""}{conv.volume(netBalance).toFixed(1)} {u.volume}/min</span>
              </span>
              {netBalance > 0 && (
                <Badge variant="destructive" className="text-[10px]" data-testid="badge-flood-warning">
                  Floods in {floodDays.toFixed(1)} days!
                </Badge>
              )}
            </div>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-900/20 rounded border border-gray-200 dark:border-gray-700 p-3">
          <div className="text-xs font-semibold mb-1 text-gray-700 dark:text-gray-300">Modern vs Historical</div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div data-testid="text-windmill-capacity">
              <span className="text-muted-foreground">Windmill:</span>{" "}
              <span className="font-bold">{conv.volume(5).toFixed(0)} {u.volume}/min</span>
            </div>
            <div data-testid="text-gemaal-capacity">
              <span className="text-muted-foreground">Modern Gemaal:</span>{" "}
              <span className="font-bold text-blue-600">{conv.volume(500).toFixed(0)} {u.volume}/min</span>
            </div>
          </div>
        </div>

        <div className="bg-amber-50 dark:bg-amber-900/20 rounded border border-amber-200 dark:border-amber-800 p-3" data-testid="text-historical-fact-polder">
          <span className="text-xs font-semibold text-amber-700 dark:text-amber-300">Historical Fact: </span>
          <span className="text-xs text-amber-800 dark:text-amber-200">
            If wind stops, polder floods in 3.2 days — this is why the Dutch never sleep. The chain of windmills must lift water in stages, each mill raising it {conv.length(1.5).toFixed(1)} {u.length} to the next canal level.
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

export function RomanSiphonAnimation() {
  const { u, conv } = useUnits();
  const [pipeDiameter, setPipeDiameter] = useState([0.20]);
  const [frictionFactor, setFrictionFactor] = useState([0.025]);
  const [animOffset, setAnimOffset] = useState(0);

  const D = pipeDiameter[0];
  const f = frictionFactor[0];
  const numPipes = 9;
  const headerElev = 263;
  const receiverElev = 260;
  const valleyFloor = 143;
  const headAvailable = headerElev - receiverElev;
  const pipeLength = 2 * Math.sqrt(Math.pow((headerElev - valleyFloor), 2) + Math.pow(500, 2));
  const g = 9.81;

  const A = Math.PI * Math.pow(D / 2, 2);
  const velocity = Math.sqrt((2 * g * headAvailable * D) / (f * pipeLength));
  const headLoss = f * (pipeLength / D) * Math.pow(velocity, 2) / (2 * g);
  const flowPerPipe = A * velocity * 1000;
  const totalFlow = flowPerPipe * numPipes;
  const maxPressure = ((headerElev - valleyFloor) * 9810) / 101325;

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimOffset((prev) => (prev + 3) % 300);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const svgW = 400;
  const svgH = 300;
  const topY = 30;
  const bottomY = 250;
  const headerX = 40;
  const receiverX = 360;
  const valleyX = 200;

  const elevToY = (elev: number) => {
    const range = headerElev - valleyFloor;
    return topY + ((headerElev - elev) / range) * (bottomY - topY);
  };

  const headerY = elevToY(headerElev);
  const receiverY = elevToY(receiverElev);
  const valleyY = elevToY(valleyFloor);

  const pipePath = `M ${headerX + 20},${headerY + 5} L ${valleyX},${valleyY} L ${receiverX - 20},${receiverY + 5}`;

  const pressurePoints = [0, 0.25, 0.5, 0.75, 1.0].map(t => {
    let elev: number;
    if (t <= 0.5) {
      elev = headerElev - (headerElev - valleyFloor) * (t / 0.5);
    } else {
      elev = valleyFloor + (receiverElev - valleyFloor) * ((t - 0.5) / 0.5);
    }
    const hglElev = headerElev - (headLoss * t);
    const pressureHead = hglElev - elev;
    const pressureAtm = (pressureHead * 9810) / 101325;
    return { t, elev, hglElev, pressureAtm };
  });

  return (
    <Card data-testid="card-roman-siphon">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Roman Inverted Siphon — Valley Crossing</CardTitle>
          <Badge data-testid="badge-pressure-flow">Pressure Flow</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full border rounded bg-muted/20" data-testid="svg-roman-siphon">
          <rect x="0" y="0" width={svgW} height={svgH} fill="#fefce8" opacity="0.3" />

          <text x="200" y="15" textAnchor="middle" fontSize="9" fill="#64748b" fontWeight="bold">
            Roman Inverted Siphon — 9 Parallel Pipes
          </text>

          <polygon points={`${headerX - 10},${headerY} ${headerX + 30},${headerY} ${valleyX},${valleyY + 15} ${valleyX - 30},${valleyY + 15}`} fill="#dcfce7" opacity="0.3" />
          <polygon points={`${valleyX + 30},${valleyY + 15} ${receiverX + 10},${receiverY} ${receiverX - 30},${receiverY} ${valleyX},${valleyY + 15}`} fill="#dcfce7" opacity="0.3" />

          <line x1={headerX - 10} y1={headerY} x2={valleyX} y2={valleyY + 15} stroke="#a78b5a" strokeWidth="1.5" />
          <line x1={valleyX} y1={valleyY + 15} x2={receiverX + 10} y2={receiverY} stroke="#a78b5a" strokeWidth="1.5" />

          <rect x={headerX - 5} y={headerY - 15} width={30} height={20} fill="#a78b5a" stroke="#8B7355" strokeWidth="1.5" rx="2" />
          <rect x={headerX - 3} y={headerY - 10} width={26} height={12} fill="rgba(59,130,246,0.4)" rx="1" />
          <text x={headerX + 10} y={headerY - 18} textAnchor="middle" fontSize="6" fill="#8B7355" fontWeight="bold">Header Tank</text>
          <text x={headerX + 10} y={headerY + 15} textAnchor="middle" fontSize="5" fill="#64748b">{conv.length(headerElev).toFixed(0)} {u.length}</text>

          <rect x={receiverX - 25} y={receiverY - 15} width={30} height={20} fill="#a78b5a" stroke="#8B7355" strokeWidth="1.5" rx="2" />
          <rect x={receiverX - 23} y={receiverY - 10} width={26} height={12} fill="rgba(59,130,246,0.4)" rx="1" />
          <text x={receiverX - 10} y={receiverY - 18} textAnchor="middle" fontSize="6" fill="#8B7355" fontWeight="bold">Receiver</text>
          <text x={receiverX - 10} y={receiverY + 15} textAnchor="middle" fontSize="5" fill="#64748b">{conv.length(receiverElev).toFixed(0)} {u.length}</text>

          {[-2, -1, 0, 1, 2].map(offset => (
            <path
              key={`pipe-${offset}`}
              d={pipePath}
              fill="none"
              stroke="#94a3b8"
              strokeWidth="2"
              transform={`translate(0, ${offset * 3})`}
              opacity={0.6}
            />
          ))}

          <text x={valleyX} y={valleyY + 25} textAnchor="middle" fontSize="5" fill="#64748b">{conv.length(valleyFloor).toFixed(0)} {u.length} (Valley Floor)</text>
          <text x={valleyX} y={valleyY + 33} textAnchor="middle" fontSize="5" fill="#64748b">9 parallel lead pipes</text>

          {velocity > 0 && Array.from({ length: 12 }, (_, i) => {
            const t = ((animOffset + i * 25) % 300) / 300;
            let px: number, py: number;
            if (t < 0.5) {
              const seg = t / 0.5;
              px = headerX + 20 + seg * (valleyX - headerX - 20);
              py = headerY + 5 + seg * (valleyY - headerY - 5);
            } else {
              const seg = (t - 0.5) / 0.5;
              px = valleyX + seg * (receiverX - 20 - valleyX);
              py = valleyY + seg * (receiverY + 5 - valleyY);
            }
            return (
              <circle key={`flow-${i}`} cx={px} cy={py} r="2.5" fill="#3b82f6" opacity={0.6}>
                <animate attributeName="opacity" values="0.3;0.8;0.3" dur="1s" repeatCount="indefinite" />
              </circle>
            );
          })}

          <line
            x1={headerX + 20}
            y1={headerY}
            x2={receiverX - 20}
            y2={receiverY + headLoss * 0.5}
            stroke="#ef4444"
            strokeWidth="1.5"
            strokeDasharray="6,3"
          />
          <text x={valleyX + 50} y={headerY + (receiverY - headerY) * 0.3} fontSize="6" fill="#ef4444">HGL</text>

          {pressurePoints.map((pp, i) => {
            let px: number, py: number;
            if (pp.t <= 0.5) {
              const seg = pp.t / 0.5;
              px = headerX + 20 + seg * (valleyX - headerX - 20);
              py = headerY + 5 + seg * (valleyY - headerY - 5);
            } else {
              const seg = (pp.t - 0.5) / 0.5;
              px = valleyX + seg * (receiverX - 20 - valleyX);
              py = valleyY + seg * (receiverY + 5 - valleyY);
            }
            const barH = Math.min(40, Math.max(2, pp.pressureAtm * 3));
            return (
              <g key={`pressure-${i}`}>
                <rect x={px - 3} y={py - barH} width={6} height={barH} fill="rgba(239,68,68,0.3)" rx="1" />
                <text x={px} y={py - barH - 3} textAnchor="middle" fontSize="4" fill="#ef4444">
                  {pp.pressureAtm.toFixed(1)}
                </text>
              </g>
            );
          })}

          <text x={valleyX} y={270} textAnchor="middle" fontSize="5" fill="#64748b">
            Max pressure at valley bottom: {conv.pressure(maxPressure * 101.325).toFixed(1)} {u.pressure} ({((headerElev - valleyFloor) * 9.81 / 1000).toFixed(1)} MPa)
          </text>

          <text x="10" y={headerY + 4} fontSize="5" fill="#94a3b8">{conv.length(headerElev).toFixed(0)} {u.length}</text>
          <text x="10" y={valleyY + 4} fontSize="5" fill="#94a3b8">{conv.length(valleyFloor).toFixed(0)} {u.length}</text>
          <text x="10" y={receiverY + 4} fontSize="5" fill="#94a3b8">{conv.length(receiverElev).toFixed(0)} {u.length}</text>
        </svg>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-medium" data-testid="label-pipe-diameter">Pipe Diameter: {conv.length(D).toFixed(2)} {u.length}</label>
            <Slider value={pipeDiameter} onValueChange={setPipeDiameter} min={0.10} max={0.30} step={0.01} data-testid="slider-pipe-diameter" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium" data-testid="label-friction-factor">Friction Factor (f): {f.toFixed(3)}</label>
            <Slider value={frictionFactor} onValueChange={setFrictionFactor} min={0.015} max={0.035} step={0.001} data-testid="slider-friction-factor" />
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800 p-3">
          <div className="text-xs font-semibold mb-2 text-blue-700 dark:text-blue-300" data-testid="text-darcy-weisbach">
            h_f = f × (L/D) × v² / (2g) — Darcy-Weisbach
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div data-testid="text-max-pressure">
              <span className="text-muted-foreground">Max Pressure:</span>{" "}
              <span className="font-bold text-red-500">{conv.pressure(maxPressure * 101.325).toFixed(1)} {u.pressure}</span>
            </div>
            <div data-testid="text-flow-velocity">
              <span className="text-muted-foreground">Velocity:</span>{" "}
              <span className="font-bold">{conv.velocity(velocity).toFixed(2)} {u.velocity}</span>
            </div>
            <div data-testid="text-total-flow">
              <span className="text-muted-foreground">Total Flow (9 pipes):</span>{" "}
              <span className="font-bold text-blue-600">{conv.flowSmall(totalFlow).toFixed(1)} {u.flowSmall}</span>
            </div>
            <div data-testid="text-head-loss">
              <span className="text-muted-foreground">Head Loss:</span>{" "}
              <span className="font-bold">{conv.length(headLoss).toFixed(2)} {u.length}</span>
            </div>
            <div data-testid="text-pipe-length">
              <span className="text-muted-foreground">Pipe Length:</span>{" "}
              <span className="font-bold">{conv.length(pipeLength).toFixed(0)} {u.length}</span>
            </div>
            <div data-testid="text-flow-per-pipe">
              <span className="text-muted-foreground">Per Pipe:</span>{" "}
              <span className="font-bold">{conv.flowSmall(flowPerPipe).toFixed(2)} {u.flowSmall}</span>
            </div>
          </div>
        </div>

        <div className="bg-amber-50 dark:bg-amber-900/20 rounded border border-amber-200 dark:border-amber-800 p-3" data-testid="text-historical-fact-siphon">
          <span className="text-xs font-semibold text-amber-700 dark:text-amber-300">Historical Fact: </span>
          <span className="text-xs text-amber-800 dark:text-amber-200">
            Romans used 9 parallel pipes — smaller pipes = thicker wall ratio = higher pressure rating. Same principle as modern force mains. The Aspendos siphon crossed a {conv.length(60).toFixed(0)} {u.length} deep valley under 12 atmospheres of pressure.
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
