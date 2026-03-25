import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useUnits } from "@/contexts/UnitsContext";

export function CSOModelingAnimation() {
  const [rainIntensity, setRainIntensity] = useState([50]);
  const [animOffset, setAnimOffset] = useState(0);
  const [csoVolume, setCsoVolume] = useState(0);

  const rain = rainIntensity[0];
  const pipeCapacity = 10;
  const totalFlow = (rain / 100) * pipeCapacity * 2;
  const wwtpFlow = Math.min(totalFlow, pipeCapacity);
  const csoFlow = Math.max(0, totalFlow - pipeCapacity);
  const wwtpPct = totalFlow > 0 ? ((wwtpFlow / totalFlow) * 100).toFixed(0) : "0";
  const csoPct = totalFlow > 0 ? ((csoFlow / totalFlow) * 100).toFixed(0) : "0";

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimOffset((prev) => (prev + 3) % 400);
      if (csoFlow > 0) {
        setCsoVolume((prev) => prev + csoFlow * 0.01);
      }
    }, 50);
    return () => clearInterval(interval);
  }, [csoFlow]);

  const resetVolume = useCallback(() => setCsoVolume(0), []);

  const flowParticles = (
    startX: number, startY: number, endX: number, endY: number,
    count: number, color: string, active: boolean
  ) => {
    if (!active) return null;
    const particles = [];
    for (let i = 0; i < count; i++) {
      const t = ((animOffset + i * (400 / count)) % 400) / 400;
      const x = startX + t * (endX - startX);
      const y = startY + t * (endY - startY);
      particles.push(
        <circle key={`fp-${startX}-${startY}-${i}`} cx={x} cy={y} r="3" fill={color} opacity={0.6 + t * 0.3}>
          <animate attributeName="opacity" values="0.4;0.9;0.4" dur="1s" repeatCount="indefinite" />
        </circle>
      );
    }
    return particles;
  };

  const waterQualityColor = rain <= 100 ? "#22c55e" : rain <= 150 ? "#eab308" : "#ef4444";
  const waterQualityLabel = rain <= 100 ? "Good" : rain <= 150 ? "Impacted" : "Degraded";

  return (
    <Card data-testid="card-cso-modeling">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Combined Sewer Overflow Modeling</CardTitle>
          <Badge data-testid="badge-cso">CSO</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <svg role="img" aria-label="CSO modeling animation" viewBox="0 0 400 280" className="w-full border rounded bg-muted/20" data-testid="svg-cso-modeling">
          <rect x="0" y="0" width="400" height="280" fill="#f8fafc" />

          <text x="200" y="15" textAnchor="middle" fontSize="9" fill="#64748b" fontWeight="bold">
            Combined Sewer System — CSO Regulator
          </text>

          {rain > 0 && Array.from({ length: Math.min(Math.floor(rain / 10), 20) }, (_, i) => (
            <line
              key={`rain-${i}`}
              x1={20 + i * 18 + ((animOffset * 0.5) % 18)}
              y1={20}
              x2={15 + i * 18 + ((animOffset * 0.5) % 18)}
              y2={35}
              stroke="#93c5fd"
              strokeWidth="1.5"
              opacity={0.4 + (rain / 200) * 0.5}
            />
          ))}

          <rect x="20" y="100" width="160" height="30" rx="4" fill="#94a3b8" stroke="#64748b" strokeWidth="2" />
          <text x="100" y="119" textAnchor="middle" fontSize="8" fill="white" fontWeight="bold">Combined Sewer Pipe</text>
          <text x="100" y="90" textAnchor="middle" fontSize="7" fill="#64748b">Flow: {totalFlow.toFixed(1)} MGD</text>

          <polygon points="180,100 210,85 210,145 180,130" fill="#a78b5a" stroke="#8B7355" strokeWidth="2" />
          <text x="195" y="118" textAnchor="middle" fontSize="6" fill="white" fontWeight="bold">REG</text>

          <rect x="220" y="60" width="140" height="30" rx="4" fill="#3b82f6" stroke="#2563eb" strokeWidth="2" />
          <text x="290" y="78" textAnchor="middle" fontSize="7" fill="white" fontWeight="bold">To WWTP (max {pipeCapacity} MGD)</text>
          <line x1="210" y1="95" x2="220" y2="75" stroke="#3b82f6" strokeWidth="3" />

          {flowParticles(180, 115, 220, 75, 5, "#3b82f6", totalFlow > 0)}

          <rect x="220" y="140" width="140" height="30" rx="4"
            fill={csoFlow > 0 ? "#92400e" : "#d1d5db"}
            stroke={csoFlow > 0 ? "#78350f" : "#94a3b8"}
            strokeWidth="2"
          />
          <text x="290" y="158" textAnchor="middle" fontSize="7" fill="white" fontWeight="bold">
            CSO Outfall → River
          </text>
          <line x1="210" y1="125" x2="220" y2="155" stroke={csoFlow > 0 ? "#92400e" : "#d1d5db"} strokeWidth="3" />

          {flowParticles(180, 115, 220, 155, 4, "#92400e", csoFlow > 0)}

          <rect x="370" y="130" width="25" height="50" rx="2" fill="rgba(59,130,246,0.2)" stroke="#3b82f6" strokeWidth="1" />
          <text x="382" y="128" textAnchor="middle" fontSize="5" fill="#64748b">River</text>
          {csoFlow > 0 && (
            <rect x="371" y={180 - Math.min(csoFlow / pipeCapacity, 1) * 48} width="23"
              height={Math.min(csoFlow / pipeCapacity, 1) * 48}
              fill={waterQualityColor} opacity="0.5" rx="1"
            />
          )}

          <rect x="365" y="55" width="30" height="25" rx="2" fill="#dcfce7" stroke="#22c55e" strokeWidth="1" />
          <text x="380" y="66" textAnchor="middle" fontSize="5" fill="#15803d">WWTP</text>
          <text x="380" y="74" textAnchor="middle" fontSize="4" fill="#15803d">Treatment</text>

          <rect x="20" y="195" width="170" height="70" rx="4" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="1" />
          <text x="105" y="210" textAnchor="middle" fontSize="7" fill="#64748b" fontWeight="bold">Flow Split</text>
          <rect x="30" y="218" width={Math.max(1, 150 * (wwtpFlow / Math.max(totalFlow, 0.1)))} height="12" fill="#3b82f6" rx="2" />
          <text x="35" y="227" fontSize="6" fill="white" fontWeight="bold">WWTP: {wwtpPct}%</text>
          <rect x="30" y="235" width={Math.max(1, 150 * (csoFlow / Math.max(totalFlow, 0.1)))} height="12" fill="#92400e" rx="2" />
          {csoFlow > 0 && <text x="35" y="244" fontSize="6" fill="white" fontWeight="bold">CSO: {csoPct}%</text>}
          <text x="105" y="260" textAnchor="middle" fontSize="6" fill="#64748b">
            WWTP: {wwtpFlow.toFixed(1)} MGD | CSO: {csoFlow.toFixed(1)} MGD
          </text>

          <text x="290" y="200" textAnchor="middle" fontSize="7" fill="#64748b">
            CSO Volume: {csoVolume.toFixed(1)} MG
          </text>
          <text x="290" y="215" textAnchor="middle" fontSize="7" fill={waterQualityColor} fontWeight="bold">
            Water Quality: {waterQualityLabel}
          </text>
        </svg>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium" data-testid="label-rain-intensity">Rain Intensity: {rain}% of pipe capacity</label>
            <Button variant="outline" size="sm" onClick={resetVolume} data-testid="button-reset-cso">Reset Volume</Button>
          </div>
          <Slider value={rainIntensity} onValueChange={setRainIntensity} min={0} max={200} step={5} data-testid="slider-rain-intensity" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800 p-3">
            <div className="text-xs font-semibold text-blue-700 dark:text-blue-300 mb-1" data-testid="text-swmm-cso">SWMM5</div>
            <div className="text-xs text-blue-800 dark:text-blue-200">
              Regulator = Flow Divider (WEIR type), WWTP = Outfall with max flow
            </div>
          </div>
          <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded border border-emerald-200 dark:border-emerald-800 p-3">
            <div className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 mb-1" data-testid="text-icm-cso">ICM</div>
            <div className="text-xs text-emerald-800 dark:text-emerald-200">
              Can model RTC to minimize CSO, real-time control adjusts gates/pumps
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function DetentionPondAnimation() {
  const { u, conv } = useUnits();
  const [stormSize, setStormSize] = useState<"2-yr" | "10-yr" | "25-yr" | "100-yr">("10-yr");
  const [withPond, setWithPond] = useState(true);
  const [time, setTime] = useState(0);

  const stormParams: Record<string, { peakIn: number; duration: number; peakOut: number; delay: number; volume: number }> = {
    "2-yr": { peakIn: 45, duration: 6, peakOut: 18, delay: 1.2, volume: 2.1 },
    "10-yr": { peakIn: 85, duration: 8, peakOut: 32, delay: 1.8, volume: 5.3 },
    "25-yr": { peakIn: 120, duration: 10, peakOut: 55, delay: 2.2, volume: 8.7 },
    "100-yr": { peakIn: 180, duration: 12, peakOut: 105, delay: 2.8, volume: 15.2 },
  };

  const params = stormParams[stormSize];
  const peakReduction = ((1 - params.peakOut / params.peakIn) * 100).toFixed(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime((prev) => (prev + 0.05) % (params.duration + 4));
    }, 50);
    return () => clearInterval(interval);
  }, [params.duration]);

  const getInflowAt = useCallback((t: number) => {
    const peakTime = params.duration * 0.35;
    if (t < 0 || t > params.duration) return 0;
    if (t <= peakTime) return params.peakIn * (t / peakTime);
    return params.peakIn * (1 - (t - peakTime) / (params.duration - peakTime));
  }, [params]);

  const getOutflowAt = useCallback((t: number) => {
    const peakTime = params.duration * 0.35 + params.delay;
    const tailDuration = params.duration + 3;
    if (t < 0.3 || t > tailDuration) return 0;
    const adjustedT = t - 0.3;
    if (adjustedT <= peakTime) return params.peakOut * (adjustedT / peakTime);
    return params.peakOut * Math.exp(-(adjustedT - peakTime) * 0.4);
  }, [params]);

  const currentInflow = getInflowAt(time);
  const currentOutflow = withPond ? getOutflowAt(time) : currentInflow;
  const pondLevel = withPond ? Math.min(1, (currentInflow - currentOutflow + 5) / (params.peakIn * 0.8)) : 0;

  const orificeActive = pondLevel > 0.1;
  const weirActive = pondLevel > 0.4;
  const spillwayActive = pondLevel > 0.85;

  const inflowPath = Array.from({ length: 50 }, (_, i) => {
    const t = (i / 49) * (params.duration + 2);
    const q = getInflowAt(t);
    const x = 20 + (i / 49) * 360;
    const y = 120 - (q / params.peakIn) * 90;
    return `${i === 0 ? "M" : "L"} ${x},${y}`;
  }).join(" ");

  const outflowPath = Array.from({ length: 50 }, (_, i) => {
    const t = (i / 49) * (params.duration + 2);
    const q = getOutflowAt(t);
    const x = 20 + (i / 49) * 360;
    const y = 120 - (q / params.peakIn) * 90;
    return `${i === 0 ? "M" : "L"} ${x},${y}`;
  }).join(" ");

  const timeX = 20 + (time / (params.duration + 2)) * 360;

  return (
    <Card data-testid="card-detention-pond">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Detention Pond Hydrograph Attenuation</CardTitle>
          <Badge data-testid="badge-detention">Detention</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <svg role="img" aria-label="Detention pond routing animation" viewBox="0 0 400 280" className="w-full border rounded bg-muted/20" data-testid="svg-detention-hydrograph">
          <rect x="0" y="0" width="400" height="280" fill="#f8fafc" />
          <text x="200" y="15" textAnchor="middle" fontSize="9" fill="#64748b" fontWeight="bold">
            Inflow vs Outflow Hydrograph
          </text>

          <line x1="20" y1="120" x2="380" y2="120" stroke="#e2e8f0" strokeWidth="0.5" />
          <line x1="20" y1="80" x2="380" y2="80" stroke="#e2e8f0" strokeWidth="0.5" strokeDasharray="2,2" />
          <line x1="20" y1="40" x2="380" y2="40" stroke="#e2e8f0" strokeWidth="0.5" strokeDasharray="2,2" />

          <text x="15" y="123" textAnchor="end" fontSize="6" fill="#94a3b8">0</text>
          <text x="15" y="83" textAnchor="end" fontSize="6" fill="#94a3b8">{(params.peakIn * 0.44).toFixed(0)}</text>
          <text x="15" y="43" textAnchor="end" fontSize="6" fill="#94a3b8">{params.peakIn}</text>
          <text x="8" y="70" textAnchor="middle" fontSize="6" fill="#94a3b8" transform="rotate(-90, 8, 70)">Q ({u.flow})</text>

          <path d={inflowPath} fill="none" stroke="#ef4444" strokeWidth="2" strokeDasharray="6,3" />

          {withPond && <path d={outflowPath} fill="none" stroke="#3b82f6" strokeWidth="2.5" />}

          <line x1={timeX} y1="25" x2={timeX} y2="120" stroke="#f59e0b" strokeWidth="1" strokeDasharray="3,2" />
          <circle cx={timeX} cy={120 - (currentInflow / params.peakIn) * 90} r="3" fill="#ef4444" />
          {withPond && <circle cx={timeX} cy={120 - (currentOutflow / params.peakIn) * 90} r="3" fill="#3b82f6" />}

          <rect x="250" y="22" width="10" height="2" fill="#ef4444" />
          <text x="265" y="26" fontSize="6" fill="#64748b">Inflow (dashed)</text>
          <rect x="250" y="32" width="10" height="2" fill="#3b82f6" />
          <text x="265" y="36" fontSize="6" fill="#64748b">Outflow (solid)</text>

          <text x="200" y="140" textAnchor="middle" fontSize="8" fill="#64748b" fontWeight="bold">
            Pond Cross-Section
          </text>

          <polygon points="40,250 80,180 320,180 360,250" fill="none" stroke="#8B7355" strokeWidth="2" />
          <line x1="30" y1="250" x2="370" y2="250" stroke="#8B7355" strokeWidth="2" />

          {pondLevel > 0 && withPond && (() => {
            const waterY = 250 - pondLevel * 65;
            const leftX = 40 + (1 - pondLevel) * 40 * 0.57;
            const rightX = 360 - (1 - pondLevel) * 40 * 0.57;
            return (
              <polygon
                points={`80,250 ${leftX},${waterY} ${rightX},${waterY} 320,250`}
                fill="rgba(59,130,246,0.35)"
              />
            );
          })()}

          <g>
            <rect x="322" y="235" width="8" height="15" fill={orificeActive ? "#22c55e" : "#d1d5db"} stroke="#64748b" strokeWidth="1" rx="1" />
            <text x="340" y="245" fontSize="5" fill="#64748b">Orifice {conv.diameter(6).toFixed(0)} {u.diameter}</text>

            <rect x="322" y="215" width="12" height="5" fill={weirActive ? "#f59e0b" : "#d1d5db"} stroke="#64748b" strokeWidth="1" />
            <text x="345" y="220" fontSize="5" fill="#64748b">Weir {conv.length(2).toFixed(0)} {u.length}</text>

            <rect x="322" y="190" width="16" height="4" fill={spillwayActive ? "#ef4444" : "#d1d5db"} stroke="#64748b" strokeWidth="1" />
            <text x="350" y="194" fontSize="5" fill="#64748b">Spillway</text>
          </g>

          <text x="200" y="270" textAnchor="middle" fontSize="7" fill="#64748b">
            Stage: {conv.length(pondLevel * 8).toFixed(1)} {u.length} | Outlets: {orificeActive ? "Orifice" : ""}{weirActive ? " + Weir" : ""}{spillwayActive ? " + Spillway" : ""}
          </text>
        </svg>

        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-medium text-muted-foreground">Storm:</span>
          {(["2-yr", "10-yr", "25-yr", "100-yr"] as const).map((s) => (
            <Button key={s} variant={stormSize === s ? "default" : "outline"} size="sm" onClick={() => setStormSize(s)} data-testid={`button-storm-${s}`}>
              {s}
            </Button>
          ))}
          <Button variant={withPond ? "default" : "outline"} size="sm" onClick={() => setWithPond(!withPond)} data-testid="button-toggle-pond">
            {withPond ? "With Pond" : "Without Pond"}
          </Button>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800 p-3">
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div data-testid="text-peak-reduction">
              <span className="text-muted-foreground">Peak Reduction:</span>{" "}
              <span className="font-bold text-green-600">{peakReduction}%</span>
            </div>
            <div data-testid="text-peak-delay">
              <span className="text-muted-foreground">Peak Delay:</span>{" "}
              <span className="font-bold">{params.delay.toFixed(1)} hrs</span>
            </div>
            <div data-testid="text-volume-stored">
              <span className="text-muted-foreground">Vol. Stored:</span>{" "}
              <span className="font-bold">{params.volume.toFixed(1)} ac-ft</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function ParallelPipeAnimation() {
  const { u, conv } = useUnits();
  const [largeDia, setLargeDia] = useState([36]);
  const [numPipes, setNumPipes] = useState([2]);
  const [animOffset, setAnimOffset] = useState(0);

  const D = largeDia[0];
  const N = numPipes[0];
  const manningN = 0.013;
  const slope = 0.005;

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimOffset((prev) => (prev + 2) % 400);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const calcFullFlow = useCallback((diameter: number) => {
    const dFt = diameter / 12;
    const A = Math.PI * (dFt / 2) ** 2;
    const R = dFt / 4;
    const Q = (1.49 / manningN) * A * Math.pow(R, 2 / 3) * Math.pow(slope, 0.5);
    return Q;
  }, []);

  const largeArea = Math.PI * (D / 2) ** 2;
  const smallDia = Math.sqrt(largeArea / N) * 2;
  const smallDiaRounded = Math.round(smallDia * 10) / 10;

  const qSingle = calcFullFlow(D);
  const qSmall = calcFullFlow(smallDiaRounded);
  const qParallel = qSmall * N;
  const capacityRatio = ((qParallel / qSingle) * 100).toFixed(1);
  const capacityLoss = ((1 - qParallel / qSingle) * 100).toFixed(1);

  const largeDiaFt = D / 12;
  const smallDiaFt = smallDiaRounded / 12;
  const rLarge = largeDiaFt / 4;
  const rSmall = smallDiaFt / 4;

  const flowParticles = (y: number, count: number) => {
    const particles = [];
    for (let i = 0; i < count; i++) {
      const t = ((animOffset + i * (400 / count)) % 400) / 400;
      const x = 60 + t * 280;
      particles.push(
        <circle key={`p-${y}-${i}`} cx={x} cy={y} r="2.5" fill="#3b82f6" opacity={0.5 + t * 0.4}>
          <animate attributeName="opacity" values="0.3;0.8;0.3" dur="1.2s" repeatCount="indefinite" />
        </circle>
      );
    }
    return particles;
  };

  return (
    <Card data-testid="card-parallel-pipe">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Parallel Pipe Capacity Comparison</CardTitle>
          <Badge data-testid="badge-parallel-pipes">Parallel Pipes</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <svg role="img" aria-label="Parallel pipe analysis animation" viewBox="0 0 400 280" className="w-full border rounded bg-muted/20" data-testid="svg-parallel-pipe">
          <rect x="0" y="0" width="400" height="280" fill="#f8fafc" />

          <text x="200" y="15" textAnchor="middle" fontSize="9" fill="#64748b" fontWeight="bold">
            Single Large Pipe vs {N} Parallel Smaller Pipes
          </text>

          <text x="50" y="40" fontSize="7" fill="#64748b" fontWeight="bold">Option A: Single {conv.diameter(D).toFixed(0)} {u.diameter} Pipe</text>
          <rect x="60" y={70 - D * 0.4} width="280" height={Math.max(D * 0.8, 16)} rx={D * 0.4} fill="rgba(148,163,184,0.2)" stroke="#94a3b8" strokeWidth="2" />
          <rect x="60" y={70 - D * 0.4 + 2} width="280" height={Math.max(D * 0.8 - 4, 12)} rx={D * 0.4 - 2} fill="rgba(59,130,246,0.15)" />
          {flowParticles(70, 6)}
          <text x="360" y={75} fontSize="7" fill="#3b82f6" fontWeight="bold">Q = {conv.flow(qSingle).toFixed(1)} {u.flow}</text>
          <circle cx="40" cy="70" r={Math.min(D * 0.4, 20)} fill="none" stroke="#94a3b8" strokeWidth="1.5" />
          <text x="40" y={73} textAnchor="middle" fontSize="5" fill="#64748b">{conv.diameter(D).toFixed(0)} {u.diameter}</text>

          <text x="50" y={135} fontSize="7" fill="#64748b" fontWeight="bold">Option B: {N}× {conv.diameter(smallDiaRounded).toFixed(0)} {u.diameter} Pipes</text>
          {Array.from({ length: N }, (_, i) => {
            const pipeSpacing = Math.min(40, 120 / N);
            const baseY = 160 + i * pipeSpacing;
            const pipeH = Math.max(smallDiaRounded * 0.5, 10);
            return (
              <g key={`small-pipe-${i}`}>
                <rect x="60" y={baseY - pipeH / 2} width="280" height={pipeH} rx={pipeH / 2} fill="rgba(148,163,184,0.2)" stroke="#94a3b8" strokeWidth="1.5" />
                <rect x="60" y={baseY - pipeH / 2 + 1} width="280" height={pipeH - 2} rx={pipeH / 2 - 1} fill="rgba(59,130,246,0.15)" />
                {flowParticles(baseY, 4)}
              </g>
            );
          })}
          <text x="360" y={165} fontSize="7" fill="#3b82f6" fontWeight="bold">
            Q = {conv.flow(qSmall).toFixed(1)}×{N} = {conv.flow(qParallel).toFixed(1)} {u.flow}
          </text>
          <circle cx="40" cy="170" r={Math.min(smallDiaRounded * 0.25, 12)} fill="none" stroke="#94a3b8" strokeWidth="1.5" />
          <text x="40" y={173} textAnchor="middle" fontSize="5" fill="#64748b">{conv.diameter(smallDiaRounded).toFixed(0)} {u.diameter}</text>

          <rect x="30" y="225" width="340" height="45" rx="4" fill="#fef3c7" stroke="#f59e0b" strokeWidth="1" />
          <text x="200" y="240" textAnchor="middle" fontSize="7" fill="#92400e" fontWeight="bold">
            Capacity Ratio: {capacityRatio}% — {N} smaller pipes carry {capacityLoss}% LESS
          </text>
          <text x="200" y="253" textAnchor="middle" fontSize="6" fill="#92400e">
            Area scales with D², but hydraulic radius also changes: Q ∝ A × R^(2/3)
          </text>
          <text x="200" y="264" textAnchor="middle" fontSize="6" fill="#64748b">
            R(single) = {conv.length(rLarge).toFixed(3)} {u.length} | R(small) = {conv.length(rSmall).toFixed(3)} {u.length}
          </text>
        </svg>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-medium" data-testid="label-large-dia">Large Pipe Diameter: {conv.diameter(D).toFixed(0)} {u.diameter}</label>
            <Slider value={largeDia} onValueChange={setLargeDia} min={12} max={60} step={1} data-testid="slider-large-dia" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium" data-testid="label-num-pipes">Number of Parallel Pipes: {N}</label>
            <Slider value={numPipes} onValueChange={setNumPipes} min={1} max={4} step={1} data-testid="slider-num-pipes" />
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800 p-3">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div data-testid="text-single-capacity">
              <span className="text-muted-foreground">Single {conv.diameter(D).toFixed(0)} {u.diameter} Q_full:</span>{" "}
              <span className="font-bold">{conv.flow(qSingle).toFixed(1)} {u.flow}</span>
            </div>
            <div data-testid="text-parallel-capacity">
              <span className="text-muted-foreground">{N}× {conv.diameter(smallDiaRounded).toFixed(0)} {u.diameter} Q_full:</span>{" "}
              <span className="font-bold">{conv.flow(qParallel).toFixed(1)} {u.flow}</span>
            </div>
            <div data-testid="text-small-dia">
              <span className="text-muted-foreground">Small Pipe Dia:</span>{" "}
              <span className="font-bold">{conv.diameter(smallDiaRounded).toFixed(1)} {u.diameter}</span>
            </div>
            <div data-testid="text-area-check">
              <span className="text-muted-foreground">Area Match:</span>{" "}
              <span className="font-bold">{conv.area(Math.PI * (smallDiaRounded / 2) ** 2 * N).toFixed(0)} vs {conv.area(largeArea).toFixed(0)} {u.area}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800 p-3">
            <div className="text-xs font-semibold text-blue-700 dark:text-blue-300 mb-1" data-testid="text-swmm-parallel">SWMM5</div>
            <div className="text-xs text-blue-800 dark:text-blue-200">
              Use BARRELS parameter in [XSECTIONS]
            </div>
          </div>
          <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded border border-emerald-200 dark:border-emerald-800 p-3">
            <div className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 mb-1" data-testid="text-icm-parallel">ICM</div>
            <div className="text-xs text-emerald-800 dark:text-emerald-200">
              Create N parallel conduits explicitly
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function CalibrationVisualAnimation() {
  const { u, conv } = useUnits();
  const [manningN, setManningN] = useState([0.013]);
  const [imperviousness, setImperviousness] = useState([65]);
  const [width, setWidth] = useState([400]);
  const [depStorage, setDepStorage] = useState([0.05]);

  const n = manningN[0];
  const imp = imperviousness[0];
  const w = width[0];
  const ds = depStorage[0];

  const observedData = [
    { t: 0, q: 0 }, { t: 1, q: 5 }, { t: 2, q: 18 }, { t: 3, q: 42 },
    { t: 4, q: 78 }, { t: 5, q: 95 }, { t: 6, q: 88 }, { t: 7, q: 65 },
    { t: 8, q: 45 }, { t: 9, q: 30 }, { t: 10, q: 18 }, { t: 11, q: 10 },
    { t: 12, q: 5 }, { t: 13, q: 2 }, { t: 14, q: 0 },
  ];

  const getModeledQ = useCallback((t: number) => {
    const nEffect = (n - 0.013) / 0.007;
    const impEffect = (imp - 65) / 25;
    const wEffect = (w - 400) / 400;
    const dsEffect = (ds - 0.05) / 0.05;

    const peakShift = nEffect * 1.5 + wEffect * 0.8;
    const peakScale = 1 + impEffect * 0.35 - dsEffect * 0.25;
    const widthScale = 1 + nEffect * 0.3 + wEffect * 0.2;

    const tAdj = t - peakShift;
    const peakT = 5;
    const sigma = 2.8 * widthScale;
    const peak = 95 * peakScale;

    const q = peak * Math.exp(-0.5 * ((tAdj - peakT) / sigma) ** 2);
    return Math.max(0, q);
  }, [n, imp, w, ds]);

  const modeledData = observedData.map((d) => ({ t: d.t, q: getModeledQ(d.t) }));

  const meanObs = observedData.reduce((s, d) => s + d.q, 0) / observedData.length;
  const ssRes = observedData.reduce((s, d, i) => s + (d.q - modeledData[i].q) ** 2, 0);
  const ssTot = observedData.reduce((s, d) => s + (d.q - meanObs) ** 2, 0);

  const nse = ssTot > 0 ? 1 - ssRes / ssTot : 0;
  const r2 = ssTot > 0 ? Math.max(0, 1 - ssRes / ssTot) : 0;
  const sumObs = observedData.reduce((s, d) => s + d.q, 0);
  const sumMod = modeledData.reduce((s, d) => s + d.q, 0);
  const pbias = sumObs > 0 ? ((sumMod - sumObs) / sumObs) * 100 : 0;
  const rmse = Math.sqrt(ssRes / observedData.length);

  const nseColor = nse > 0.75 ? "#22c55e" : nse > 0.5 ? "#eab308" : "#ef4444";
  const nseLabel = nse > 0.75 ? "Good" : nse > 0.5 ? "Acceptable" : "Poor";

  const xScale = (t: number) => 40 + (t / 14) * 340;
  const yScale = (q: number) => 240 - (q / 120) * 200;

  const observedPath = observedData.map((d, i) => `${i === 0 ? "M" : "L"} ${xScale(d.t)},${yScale(d.q)}`).join(" ");
  const modeledPath = modeledData.map((d, i) => `${i === 0 ? "M" : "L"} ${xScale(d.t)},${yScale(d.q)}`).join(" ");

  return (
    <Card data-testid="card-calibration-visual">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Calibration — Observed vs Modeled</CardTitle>
          <Badge data-testid="badge-calibration">Calibration</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <svg role="img" aria-label="Calibration visual comparison" viewBox="0 0 400 280" className="w-full border rounded bg-muted/20" data-testid="svg-calibration">
          <rect x="0" y="0" width="400" height="280" fill="#f8fafc" />

          <text x="200" y="15" textAnchor="middle" fontSize="9" fill="#64748b" fontWeight="bold">
            Hydrograph Comparison
          </text>

          <line x1="40" y1="240" x2="380" y2="240" stroke="#94a3b8" strokeWidth="1" />
          <line x1="40" y1="40" x2="40" y2="240" stroke="#94a3b8" strokeWidth="1" />

          {[0, 30, 60, 90, 120].map((q) => (
            <g key={`grid-${q}`}>
              <line x1="40" y1={yScale(q)} x2="380" y2={yScale(q)} stroke="#e2e8f0" strokeWidth="0.5" strokeDasharray="2,2" />
              <text x="36" y={yScale(q) + 3} textAnchor="end" fontSize="6" fill="#94a3b8">{q}</text>
            </g>
          ))}
          {[0, 2, 4, 6, 8, 10, 12, 14].map((t) => (
            <g key={`t-${t}`}>
              <line x1={xScale(t)} y1="240" x2={xScale(t)} y2="243" stroke="#94a3b8" strokeWidth="0.5" />
              <text x={xScale(t)} y="252" textAnchor="middle" fontSize="6" fill="#94a3b8">{t}h</text>
            </g>
          ))}

          <text x="10" y="140" textAnchor="middle" fontSize="7" fill="#94a3b8" transform="rotate(-90, 10, 140)">Q ({u.flow})</text>
          <text x="200" y="265" textAnchor="middle" fontSize="7" fill="#94a3b8">Time (hours)</text>

          <path d={observedPath} fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="4,3" />
          {observedData.map((d, i) => (
            <circle key={`obs-${i}`} cx={xScale(d.t)} cy={yScale(d.q)} r="3" fill="none" stroke="#64748b" strokeWidth="1.5" />
          ))}

          <path d={modeledPath} fill="none" stroke="#3b82f6" strokeWidth="2.5" />

          <rect x="260" y="22" width="8" height="8" fill="none" stroke="#64748b" strokeWidth="1" rx="4" />
          <text x="273" y="30" fontSize="6" fill="#64748b">Observed</text>
          <line x1="260" y1="40" x2="268" y2="40" stroke="#3b82f6" strokeWidth="2" />
          <text x="273" y="43" fontSize="6" fill="#64748b">Modeled</text>

          <rect x="270" y="55" width="120" height="55" rx="4" fill="white" stroke={nseColor} strokeWidth="1.5" />
          <text x="330" y="68" textAnchor="middle" fontSize="7" fill={nseColor} fontWeight="bold">
            Fit: {nseLabel}
          </text>
          <text x="330" y="80" textAnchor="middle" fontSize="6" fill="#64748b" data-testid="text-nse">
            NSE: {nse.toFixed(3)}
          </text>
          <text x="330" y="89" textAnchor="middle" fontSize="6" fill="#64748b" data-testid="text-r2">
            R²: {r2.toFixed(3)}
          </text>
          <text x="330" y="98" textAnchor="middle" fontSize="6" fill="#64748b" data-testid="text-pbias">
            PBIAS: {pbias.toFixed(1)}%
          </text>
          <text x="330" y="107" textAnchor="middle" fontSize="6" fill="#64748b" data-testid="text-rmse">
            RMSE: {conv.flow(rmse).toFixed(2)} {u.flow}
          </text>

          <circle cx="285" cy="66" r="5" fill={nseColor} opacity="0.8" />
        </svg>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-medium" data-testid="label-cal-manning">Manning's n: {n.toFixed(3)}</label>
            <Slider value={manningN} onValueChange={setManningN} min={0.010} max={0.020} step={0.001} data-testid="slider-cal-manning" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium" data-testid="label-cal-imperviousness">Imperviousness: {imp}%</label>
            <Slider value={imperviousness} onValueChange={setImperviousness} min={40} max={90} step={1} data-testid="slider-cal-imperviousness" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium" data-testid="label-cal-width">Width: {conv.length(w).toFixed(0)} {u.length}</label>
            <Slider value={width} onValueChange={setWidth} min={100} max={800} step={10} data-testid="slider-cal-width" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium" data-testid="label-cal-depstorage">Depression Storage: {conv.lengthSmall(ds).toFixed(2)} {u.lengthSmall}</label>
            <Slider value={depStorage} onValueChange={setDepStorage} min={0.01} max={0.10} step={0.005} data-testid="slider-cal-depstorage" />
          </div>
        </div>

        <div className="bg-amber-50 dark:bg-amber-900/20 rounded border border-amber-200 dark:border-amber-800 p-3" data-testid="text-calibration-note">
          <span className="text-xs font-semibold text-amber-700 dark:text-amber-300">Note: </span>
          <span className="text-xs text-amber-800 dark:text-amber-200">
            SWMM5 uses .CAL calibration files. ICM offers automated sensitivity analysis, Monte Carlo sampling.
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
