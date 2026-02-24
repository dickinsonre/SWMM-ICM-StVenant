import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useUnits } from "@/contexts/UnitsContext";

export function RomanAqueductAnimation() {
  const { u, conv } = useUnits();
  const [sourceFlow, setSourceFlow] = useState([500]);
  const [channelWidth, setChannelWidth] = useState([1.5]);
  const [manningN, setManningN] = useState([0.015]);
  const [gradient, setGradient] = useState([0.05]);
  const [animOffset, setAnimOffset] = useState(0);

  const Q_input = sourceFlow[0];
  const w = channelWidth[0];
  const n = manningN[0];
  const S = gradient[0] / 100;

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimOffset((prev) => (prev + 2) % 400);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const solveDepth = useCallback((Q_ls: number, width: number, nVal: number, slope: number) => {
    const Q = Q_ls / 1000;
    let y = 0.5;
    for (let iter = 0; iter < 50; iter++) {
      const A = width * y;
      const P = width + 2 * y;
      const R = A / P;
      const Qcalc = (1 / nVal) * A * Math.pow(R, 2 / 3) * Math.pow(slope, 0.5);
      const diff = Qcalc - Q;
      if (Math.abs(diff) < 0.0001) break;
      y = y - diff * 0.1;
      if (y < 0.01) y = 0.01;
      if (y > 5) y = 5;
    }
    return y;
  }, []);

  const depth = solveDepth(Q_input, w, n, S);
  const A = w * depth;
  const P = w + 2 * depth;
  const R = A / P;
  const velocity = (1 / n) * Math.pow(R, 2 / 3) * Math.pow(S, 0.5);
  const froude = velocity / Math.sqrt(9.81 * depth);
  const travelTime = 50000 / velocity / 3600;
  const dailyDelivery = (Q_input / 1000) * 86400;

  const aqueductPath = "M 30,80 Q 100,85 150,110 Q 200,135 250,160 Q 300,185 370,200";

  const particles = [];
  for (let i = 0; i < 8; i++) {
    const t = ((animOffset + i * 50) % 400) / 400;
    const x = 30 + t * 340;
    const y = 80 + t * 120;
    particles.push({ x, y, key: `p-${i}` });
  }

  return (
    <Card data-testid="card-roman-aqueduct">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Roman Aqueduct — Gravity Flow</CardTitle>
          <Badge data-testid="badge-gravity-flow">Gravity Flow</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <svg viewBox="0 0 400 300" className="w-full border rounded bg-muted/20" data-testid="svg-roman-aqueduct">
          <defs>
            <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#e0f2fe" />
              <stop offset="100%" stopColor="#f0f9ff" />
            </linearGradient>
          </defs>
          <rect x="0" y="0" width="400" height="300" fill="url(#skyGrad)" />

          <polygon points="20,60 50,30 80,60" fill="#8B7355" />
          <polygon points="10,65 90,65 80,60 20,60" fill="#a78b5a" />
          <circle cx="50" cy="55" r="5" fill="#3b82f6" opacity="0.6" />
          <text x="50" y="22" textAnchor="middle" fontSize="8" fill="#64748b">Spring Source</text>
          <text x="50" y="75" textAnchor="middle" fontSize="7" fill="#64748b">~{conv.length(400).toFixed(0)}{u.length} elev.</text>

          <path d={aqueductPath} fill="none" stroke="#a78b5a" strokeWidth="8" />
          <path d={aqueductPath} fill="none" stroke="#8B7355" strokeWidth="6" />

          {velocity > 0 && particles.map((p) => (
            <circle key={p.key} cx={p.x} cy={p.y} r="3" fill="#3b82f6" opacity="0.7">
              <animate attributeName="opacity" values="0.4;0.9;0.4" dur="1s" repeatCount="indefinite" />
            </circle>
          ))}

          {[0.2, 0.4, 0.6, 0.8].map((t, i) => {
            const x = 30 + t * 340;
            const y = 80 + t * 120;
            return (
              <g key={`arch-${i}`}>
                <rect x={x - 8} y={y + 4} width={4} height={40 - i * 5} fill="#a78b5a" />
                <rect x={x + 4} y={y + 4} width={4} height={40 - i * 5} fill="#a78b5a" />
                <path d={`M ${x - 8},${y + 4} Q ${x},${y - 4} ${x + 8},${y + 4}`} fill="none" stroke="#8B7355" strokeWidth="2" />
              </g>
            );
          })}

          <rect x="340" y="190" width="50" height="30" fill="#a78b5a" stroke="#8B7355" strokeWidth="2" rx="2" />
          <rect x="342" y="195" width="46" height="20" fill="rgba(59,130,246,0.4)" />
          <text x="365" y="235" textAnchor="middle" fontSize="7" fill="#64748b">Castellum</text>
          <text x="365" y="245" textAnchor="middle" fontSize="7" fill="#64748b">~{conv.length(200).toFixed(0)}{u.length} elev.</text>

          <rect x="200" y="145" width="30" height="20" fill="#a78b5a" stroke="#8B7355" strokeWidth="1" rx="1" />
          <rect x="202" y="150" width="26" height="12" fill="rgba(59,130,246,0.3)" />
          <text x="215" y="175" textAnchor="middle" fontSize="6" fill="#64748b">Settling Basin</text>
          <text x="215" y="183" textAnchor="middle" fontSize="5" fill="#94a3b8">v drops → sediment falls</text>

          <text x="200" y="15" textAnchor="middle" fontSize="9" fill="#64748b" fontWeight="bold">
            Roman Aqueduct Profile — {conv.length(50000).toFixed(0)} {u.length}
          </text>

          <line x1="30" y1="265" x2="370" y2="265" stroke="#94a3b8" strokeWidth="0.5" />
          {[0, 10, 20, 30, 40, 50].map((km) => {
            const x = 30 + (km / 50) * 340;
            return (
              <g key={`km-${km}`}>
                <line x1={x} y1="263" x2={x} y2="267" stroke="#94a3b8" strokeWidth="0.5" />
                <text x={x} y="275" textAnchor="middle" fontSize="6" fill="#94a3b8">{conv.length(km * 1000).toFixed(0)}{u.length}</text>
              </g>
            );
          })}

          <polygon points="15,60 15,260 25,260 25,80" fill="none" stroke="#94a3b8" strokeWidth="0.5" strokeDasharray="2,2" />
          <text x="12" y="58" fontSize="6" fill="#94a3b8" textAnchor="end">{conv.length(400).toFixed(0)}{u.length}</text>
          <text x="12" y="210" fontSize="6" fill="#94a3b8" textAnchor="end">{conv.length(200).toFixed(0)}{u.length}</text>
        </svg>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-medium" data-testid="label-source-flow">Source Flow: {conv.flowSmall(Q_input).toFixed(0)} {u.flowSmall}</label>
            <Slider value={sourceFlow} onValueChange={setSourceFlow} min={100} max={1000} step={10} data-testid="slider-source-flow" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium" data-testid="label-channel-width">Channel Width: {conv.length(w).toFixed(1)} {u.length}</label>
            <Slider value={channelWidth} onValueChange={setChannelWidth} min={0.5} max={3} step={0.1} data-testid="slider-channel-width" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium" data-testid="label-manning-n">Manning's n: {n.toFixed(3)}</label>
            <Slider value={manningN} onValueChange={setManningN} min={0.010} max={0.030} step={0.001} data-testid="slider-manning-n" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium" data-testid="label-gradient">Gradient: {gradient[0].toFixed(2)}%</label>
            <Slider value={gradient} onValueChange={setGradient} min={0.01} max={0.10} step={0.01} data-testid="slider-gradient" />
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800 p-3">
          <div className="text-xs font-semibold mb-2 text-blue-700 dark:text-blue-300" data-testid="text-manning-equation">
            Q = (1/n) × A × R^(2/3) × S^(1/2)
          </div>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div data-testid="text-velocity">
              <span className="text-muted-foreground">Velocity:</span>{" "}
              <span className="font-bold">{conv.velocity(velocity).toFixed(2)} {u.velocity}</span>
            </div>
            <div data-testid="text-flow-depth">
              <span className="text-muted-foreground">Flow Depth:</span>{" "}
              <span className="font-bold">{conv.length(depth).toFixed(3)} {u.length}</span>
            </div>
            <div data-testid="text-froude">
              <span className="text-muted-foreground">Froude №:</span>{" "}
              <span className="font-bold">{froude.toFixed(3)}</span>
            </div>
            <div data-testid="text-travel-time">
              <span className="text-muted-foreground">Travel Time:</span>{" "}
              <span className="font-bold">{travelTime.toFixed(1)} hrs</span>
            </div>
            <div data-testid="text-daily-delivery">
              <span className="text-muted-foreground">Daily Delivery:</span>{" "}
              <span className="font-bold">{(conv.volume(dailyDelivery) / 1000).toFixed(0)}k {u.volume}</span>
            </div>
            <div data-testid="text-hydraulic-radius">
              <span className="text-muted-foreground">Hyd. Radius:</span>{" "}
              <span className="font-bold">{conv.length(R).toFixed(3)} {u.length}</span>
            </div>
          </div>
        </div>

        <div className="bg-amber-50 dark:bg-amber-900/20 rounded border border-amber-200 dark:border-amber-800 p-3" data-testid="text-historical-fact-aqueduct">
          <span className="text-xs font-semibold text-amber-700 dark:text-amber-300">Historical Fact: </span>
          <span className="text-xs text-amber-800 dark:text-amber-200">
            Roman engineers maintained a precise 0.05% grade over tens of kilometers — a drop of just 50cm per kilometer — using only gravity, groma surveying tools, and chorobates water levels.
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

export function DujiangyanAnimation() {
  const { u, conv } = useUnits();
  const [season, setSeason] = useState<"dry" | "normal" | "flood" | "extreme">("normal");
  const [animOffset, setAnimOffset] = useState(0);

  const seasonFlows: Record<string, number> = { dry: 100, normal: 250, flood: 500, extreme: 800 };
  const totalFlow = seasonFlows[season];

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimOffset((prev) => (prev + 3) % 400);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const irrigationRatio = totalFlow <= 200 ? 0.6 : totalFlow <= 400 ? 0.5 : 0.4;
  const rawIrrigation = totalFlow * irrigationRatio;
  const bottleneckMax = 150;
  const innerFlow = Math.min(rawIrrigation, bottleneckMax);
  const outerFlow = totalFlow - innerFlow;
  const sedimentRemoval = Math.min(totalFlow * 0.02, 15);

  const innerPct = ((innerFlow / totalFlow) * 100).toFixed(0);
  const outerPct = ((outerFlow / totalFlow) * 100).toFixed(0);

  const flowParticles = (startX: number, startY: number, endX: number, endY: number, count: number, offset: number) => {
    const particles = [];
    for (let i = 0; i < count; i++) {
      const t = ((offset + i * (400 / count)) % 400) / 400;
      const x = startX + t * (endX - startX);
      const y = startY + t * (endY - startY);
      particles.push(
        <circle key={`fp-${startX}-${i}`} cx={x} cy={y} r="2.5" fill="#3b82f6" opacity={0.5 + t * 0.4}>
          <animate attributeName="opacity" values="0.3;0.8;0.3" dur="1.5s" repeatCount="indefinite" />
        </circle>
      );
    }
    return particles;
  };

  return (
    <Card data-testid="card-dujiangyan">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Dujiangyan Irrigation System</CardTitle>
          <Badge data-testid="badge-passive-flow">Passive Flow Control</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <svg viewBox="0 0 400 300" className="w-full border rounded bg-muted/20" data-testid="svg-dujiangyan">
          <rect x="0" y="0" width="400" height="300" fill="#f0fdf4" />

          <text x="200" y="15" textAnchor="middle" fontSize="9" fill="#64748b" fontWeight="bold">
            Dujiangyan — Top-Down View
          </text>

          <rect x="10" y="110" width="130" height="60" rx="4" fill="rgba(59,130,246,0.3)" stroke="#3b82f6" strokeWidth="1.5" />
          <text x="75" y="145" textAnchor="middle" fontSize="9" fill="#1e40af" fontWeight="bold">Min River</text>
          <text x="75" y="157" textAnchor="middle" fontSize="7" fill="#3b82f6">{conv.flow(totalFlow).toFixed(0)} {u.flow}</text>

          {flowParticles(15, 130, 140, 140, 6, animOffset)}

          <polygon points="140,120 175,100 180,100 180,105 145,122" fill="#a78b5a" stroke="#8B7355" strokeWidth="1.5" />
          <polygon points="140,160 175,180 180,180 180,175 145,158" fill="#a78b5a" stroke="#8B7355" strokeWidth="1.5" />
          <ellipse cx="150" cy="140" rx="12" ry="22" fill="rgba(59,130,246,0.15)" stroke="#8B7355" strokeWidth="1" />
          <text x="150" y="138" textAnchor="middle" fontSize="6" fill="#8B7355" fontWeight="bold">Fish</text>
          <text x="150" y="146" textAnchor="middle" fontSize="6" fill="#8B7355" fontWeight="bold">Mouth</text>

          <rect x="180" y="80" width="140" height="30" rx="3" fill="rgba(59,130,246,0.25)" stroke="#3b82f6" strokeWidth="1" />
          <text x="250" y="98" textAnchor="middle" fontSize="7" fill="#1e40af">Inner Channel (Irrigation)</text>
          {flowParticles(185, 95, 320, 95, 5, animOffset + 50)}

          <rect x="180" y="170" width="140" height="30" rx="3" fill="rgba(59,130,246,0.4)" stroke="#3b82f6" strokeWidth="1.5" />
          <text x="250" y="188" textAnchor="middle" fontSize="7" fill="#1e40af">Outer Channel (Flood)</text>
          {flowParticles(185, 185, 320, 185, 5, animOffset + 100)}

          <line x1="240" y1="110" x2="240" y2="130" stroke="#a78b5a" strokeWidth="3" />
          <rect x="225" y="125" width="30" height="10" fill="#a78b5a" stroke="#8B7355" strokeWidth="1" rx="1" />
          <text x="240" y="145" textAnchor="middle" fontSize="5" fill="#8B7355">Flying Sand Fence</text>
          <text x="240" y="152" textAnchor="middle" fontSize="5" fill="#94a3b8">Sediment weir</text>

          <rect x="290" y="82" width="8" height="26" fill="#a78b5a" stroke="#8B7355" strokeWidth="1" rx="1" />
          <text x="305" y="92" fontSize="5" fill="#8B7355">Bottle</text>
          <text x="305" y="99" fontSize="5" fill="#8B7355">Neck</text>

          <rect x="330" y="75" width="60" height="40" rx="3" fill="#dcfce7" stroke="#22c55e" strokeWidth="1" />
          <text x="360" y="93" textAnchor="middle" fontSize="6" fill="#15803d">Chengdu</text>
          <text x="360" y="101" textAnchor="middle" fontSize="6" fill="#15803d">Plains</text>
          {flowParticles(320, 95, 330, 95, 2, animOffset + 150)}

          <rect x="330" y="165" width="60" height="40" rx="3" fill="rgba(59,130,246,0.1)" stroke="#3b82f6" strokeWidth="1" />
          <text x="360" y="183" textAnchor="middle" fontSize="6" fill="#1e40af">Min River</text>
          <text x="360" y="191" textAnchor="middle" fontSize="6" fill="#1e40af">Continues</text>
          {flowParticles(320, 185, 330, 185, 3, animOffset + 200)}

          <rect x="30" y="220" width={160 * (innerFlow / totalFlow)} height="16" fill="#22c55e" rx="2" />
          <rect x={30 + 160 * (innerFlow / totalFlow)} y="220" width={160 * (outerFlow / totalFlow)} height="16" fill="#3b82f6" rx="2" />
          <text x="30" y="215" fontSize="7" fill="#64748b">Flow Distribution</text>
          <text x={30 + 80 * (innerFlow / totalFlow)} y="231" textAnchor="middle" fontSize="6" fill="white" fontWeight="bold">{innerPct}%</text>
          <text x={30 + 160 * (innerFlow / totalFlow) + 80 * (outerFlow / totalFlow)} y="231" textAnchor="middle" fontSize="6" fill="white" fontWeight="bold">{outerPct}%</text>

          <text x="30" y="250" fontSize="7" fill="#15803d">Inner: {conv.flow(innerFlow).toFixed(0)} {u.flow}</text>
          <text x="30" y="260" fontSize="7" fill="#1e40af">Outer: {conv.flow(outerFlow).toFixed(0)} {u.flow}</text>
          <text x="30" y="270" fontSize="7" fill="#94a3b8">Sediment removed: {sedimentRemoval.toFixed(1)} t/hr</text>

          {innerFlow >= bottleneckMax && (
            <text x="300" y="70" fontSize="7" fill="#ef4444" fontWeight="bold">⚠ Bottleneck limiting!</text>
          )}
        </svg>

        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-medium text-muted-foreground">Season:</span>
          {(["dry", "normal", "flood", "extreme"] as const).map((s) => (
            <Button
              key={s}
              variant={season === s ? "default" : "outline"}
              size="sm"
              onClick={() => setSeason(s)}
              data-testid={`button-season-${s}`}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)} ({conv.flow(seasonFlows[s]).toFixed(0)} {u.flow})
            </Button>
          ))}
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800 p-3">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div data-testid="text-inner-flow">
              <span className="text-muted-foreground">Irrigation Flow:</span>{" "}
              <span className="font-bold text-green-600">{conv.flow(innerFlow).toFixed(0)} {u.flow}</span>
            </div>
            <div data-testid="text-outer-flow">
              <span className="text-muted-foreground">Flood Channel:</span>{" "}
              <span className="font-bold text-blue-600">{conv.flow(outerFlow).toFixed(0)} {u.flow}</span>
            </div>
            <div data-testid="text-split-ratio">
              <span className="text-muted-foreground">Split Ratio:</span>{" "}
              <span className="font-bold">{innerPct}/{outerPct}</span>
            </div>
            <div data-testid="text-bottleneck-status">
              <span className="text-muted-foreground">Bottleneck:</span>{" "}
              <span className={`font-bold ${innerFlow >= bottleneckMax ? "text-red-500" : "text-green-500"}`}>
                {innerFlow >= bottleneckMax ? `Active (${conv.flow(150).toFixed(0)} ${u.flow} max)` : "Open"}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-amber-50 dark:bg-amber-900/20 rounded border border-amber-200 dark:border-amber-800 p-3" data-testid="text-historical-fact-dujiangyan">
          <span className="text-xs font-semibold text-amber-700 dark:text-amber-300">Historical Fact: </span>
          <span className="text-xs text-amber-800 dark:text-amber-200">
            Built 256 BCE by Li Bing, still operates today — NO MOVING PARTS. It irrigates over {conv.area(5300 * 1e6).toFixed(0)} {u.area} of farmland, turning Sichuan into "The Land of Abundance."
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

export function IncaFountainAnimation() {
  const { u, conv } = useUnits();
  const [season, setSeason] = useState<"dry" | "wet" | "heavy">("wet");
  const [animOffset, setAnimOffset] = useState(0);

  const seasonFlows: Record<string, number> = { dry: 10, wet: 25, heavy: 60 };
  const sourceFlow = seasonFlows[season];
  const seepageLoss = 0.15;
  const numFountains = 16;
  const totalHead = 24;
  const headPerFountain = totalHead / numFountains;

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimOffset((prev) => (prev + 1) % 100);
    }, 60);
    return () => clearInterval(interval);
  }, []);

  const fountainFlows: number[] = [];
  let currentFlow = sourceFlow;
  for (let i = 0; i < numFountains; i++) {
    fountainFlows.push(currentFlow);
    currentFlow = Math.max(0, currentFlow - seepageLoss);
  }

  const activeFountains = fountainFlows.filter((f) => f > 0.1).length;
  const totalEnergy = (sourceFlow / 60000) * 9.81 * totalHead;

  const svgW = 400;
  const svgH = 300;
  const startX = 20;
  const endX = 385;
  const startY = 40;
  const endY = 260;
  const stepW = (endX - startX) / numFountains;
  const stepH = (endY - startY) / numFountains;

  return (
    <Card data-testid="card-inca-fountain">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Inca Fountain Cascade — Machu Picchu</CardTitle>
          <Badge data-testid="badge-cascade-system">Cascade System</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full border rounded bg-muted/20" data-testid="svg-inca-fountain">
          <rect x="0" y="0" width={svgW} height={svgH} fill="#fefce8" opacity="0.3" />

          <text x="200" y="15" textAnchor="middle" fontSize="9" fill="#64748b" fontWeight="bold">
            16 Cascading Fountains — Profile View ({conv.length(24).toFixed(0)}{u.length} total head)
          </text>

          <rect x={startX - 5} y={startY - 15} width="30" height="15" fill="rgba(59,130,246,0.3)" stroke="#3b82f6" strokeWidth="1" rx="2" />
          <text x={startX + 10} y={startY - 5} textAnchor="middle" fontSize="5" fill="#1e40af">Spring</text>

          {Array.from({ length: numFountains }, (_, i) => {
            const x = startX + i * stepW;
            const y = startY + i * stepH;
            const nextX = x + stepW;
            const nextY = y + stepH;
            const flow = fountainFlows[i];
            const isDry = flow <= 0.1;
            const flowIntensity = Math.min(1, flow / sourceFlow);

            return (
              <g key={`fountain-${i}`}>
                <rect
                  x={x}
                  y={y}
                  width={stepW - 2}
                  height={stepH * 0.6}
                  fill={isDry ? "#d1d5db" : "#a78b5a"}
                  stroke="#8B7355"
                  strokeWidth="0.8"
                  rx="1"
                />

                {!isDry && (
                  <>
                    <rect
                      x={x + 1}
                      y={y + stepH * 0.15}
                      width={stepW - 4}
                      height={stepH * 0.35 * flowIntensity}
                      fill={`rgba(59,130,246,${0.3 + flowIntensity * 0.4})`}
                      rx="0.5"
                    />

                    {i < numFountains - 1 && (
                      <>
                        <line
                          x1={x + stepW - 3}
                          y1={y + stepH * 0.5}
                          x2={nextX + 1}
                          y2={nextY + 2}
                          stroke={`rgba(59,130,246,${0.4 + flowIntensity * 0.4})`}
                          strokeWidth={1 + flowIntensity}
                          strokeDasharray="2,2"
                        />
                        {[0, 1, 2].map((d) => {
                          const dt = ((animOffset + d * 33 + i * 7) % 100) / 100;
                          const dx = (x + stepW - 3) + dt * (nextX + 1 - (x + stepW - 3));
                          const dy = (y + stepH * 0.5) + dt * (nextY + 2 - (y + stepH * 0.5));
                          return (
                            <circle
                              key={`drop-${i}-${d}`}
                              cx={dx}
                              cy={dy}
                              r={1.5 * flowIntensity + 0.5}
                              fill="#3b82f6"
                              opacity={0.5 + flowIntensity * 0.4}
                            />
                          );
                        })}
                      </>
                    )}
                  </>
                )}

                {i % 4 === 0 && (
                  <text x={x + stepW / 2} y={y + stepH + 6} textAnchor="middle" fontSize="5" fill={isDry ? "#ef4444" : "#64748b"}>
                    F{i + 1}: {flow.toFixed(1)}
                  </text>
                )}
              </g>
            );
          })}

          <text x="200" y="285" textAnchor="middle" fontSize="7" fill="#64748b">
            Active: {activeFountains}/{numFountains} fountains | Seepage: {conv.flowSmall(seepageLoss).toFixed(2)} {u.flowSmall} per fountain
          </text>

          {season === "dry" && activeFountains < numFountains && (
            <text x="200" y="295" textAnchor="middle" fontSize="7" fill="#ef4444" fontWeight="bold">
              ⚠ Lower fountains dry — insufficient source flow
            </text>
          )}
        </svg>

        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-medium text-muted-foreground">Season:</span>
          {(["dry", "wet", "heavy"] as const).map((s) => (
            <Button
              key={s}
              variant={season === s ? "default" : "outline"}
              size="sm"
              onClick={() => setSeason(s)}
              data-testid={`button-fountain-${s}`}
            >
              {s === "heavy" ? "Heavy Rain" : s.charAt(0).toUpperCase() + s.slice(1)} ({conv.flowSmall(seasonFlows[s]).toFixed(0)} {u.flowSmall})
            </Button>
          ))}
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800 p-3">
          <div className="text-xs font-semibold mb-2 text-blue-700 dark:text-blue-300" data-testid="text-energy-equation">
            E = mgh | Total Head = {conv.length(totalHead).toFixed(0)}{u.length} | {conv.length(headPerFountain).toFixed(1)}{u.length} per fountain
          </div>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div data-testid="text-source-flow-inca">
              <span className="text-muted-foreground">Source:</span>{" "}
              <span className="font-bold">{conv.flowSmall(sourceFlow).toFixed(0)} {u.flowSmall}</span>
            </div>
            <div data-testid="text-exit-flow">
              <span className="text-muted-foreground">Exit Flow:</span>{" "}
              <span className="font-bold">{conv.flowSmall(fountainFlows[numFountains - 1]).toFixed(1)} {u.flowSmall}</span>
            </div>
            <div data-testid="text-total-loss">
              <span className="text-muted-foreground">Total Loss:</span>{" "}
              <span className="font-bold">{conv.flowSmall(sourceFlow - fountainFlows[numFountains - 1]).toFixed(1)} {u.flowSmall}</span>
            </div>
            <div data-testid="text-active-fountains">
              <span className="text-muted-foreground">Active:</span>{" "}
              <span className="font-bold">{activeFountains}/{numFountains}</span>
            </div>
            <div data-testid="text-power">
              <span className="text-muted-foreground">Power:</span>{" "}
              <span className="font-bold">{totalEnergy.toFixed(2)} W</span>
            </div>
            <div data-testid="text-head-per-fountain">
              <span className="text-muted-foreground">Head/Fountain:</span>{" "}
              <span className="font-bold">{conv.length(headPerFountain).toFixed(1)} {u.length}</span>
            </div>
          </div>
        </div>

        <div className="bg-amber-50 dark:bg-amber-900/20 rounded border border-amber-200 dark:border-amber-800 p-3" data-testid="text-historical-fact-inca">
          <span className="text-xs font-semibold text-amber-700 dark:text-amber-300">Historical Fact: </span>
          <span className="text-xs text-amber-800 dark:text-amber-200">
            Royal fountain FIRST — hydraulic engineering as social hierarchy. The Sapa Inca received the purest, strongest flow before anyone else. Each subsequent fountain served progressively lower-ranking citizens.
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

export function PersianQanatAnimation() {
  const { u, conv } = useUnits();
  const [waterTable, setWaterTable] = useState([-15]);
  const [tunnelGradient, setTunnelGradient] = useState([0.3]);
  const [season, setSeason] = useState<"spring" | "summer" | "autumn" | "winter">("summer");
  const [animOffset, setAnimOffset] = useState(0);

  const seasonTableOffsets: Record<string, number> = { spring: 5, summer: 0, autumn: -5, winter: 2 };
  const effectiveTable = waterTable[0] + seasonTableOffsets[season];
  const grad = tunnelGradient[0];

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimOffset((prev) => (prev + 1) % 200);
    }, 60);
    return () => clearInterval(interval);
  }, []);

  const shafts = [
    { name: "Mother Well", depth: 45, x: 60, baseFlow: 12 },
    { name: "Shaft 2", depth: 35, x: 140, baseFlow: 8 },
    { name: "Shaft 3", depth: 25, x: 220, baseFlow: 5 },
    { name: "Shaft 4", depth: 15, x: 300, baseFlow: 2 },
  ];

  const tableDepthFactor = Math.max(0, Math.min(1, (-effectiveTable - 5) / 20));
  const flowMultiplier = 1 - tableDepthFactor * 0.7;
  const gradientMultiplier = 0.5 + (grad / 0.5) * 0.5;

  const cumulativeFlows: number[] = [];
  let cumFlow = 0;
  for (const shaft of shafts) {
    cumFlow += shaft.baseFlow * flowMultiplier * gradientMultiplier;
    cumulativeFlows.push(Math.round(cumFlow * 10) / 10);
  }

  const totalFlow = cumulativeFlows[cumulativeFlows.length - 1];

  const svgW = 400;
  const svgH = 300;
  const groundY = 60;
  const tunnelBaseY = 240;

  const groundProfile = `M 0,${groundY} Q 50,${groundY - 30} 100,${groundY - 20} Q 200,${groundY - 5} 300,${groundY + 5} Q 350,${groundY + 8} 400,${groundY + 10}`;

  const tableY = groundY + Math.abs(effectiveTable) * 4;

  const tunnelY = (x: number) => {
    const t = x / svgW;
    return tunnelBaseY - (1 - t) * 80 * (grad / 0.3);
  };

  return (
    <Card data-testid="card-persian-qanat">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Persian Qanat System</CardTitle>
          <Badge data-testid="badge-groundwater">Groundwater</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full border rounded bg-muted/20" data-testid="svg-persian-qanat">
          <rect x="0" y="0" width={svgW} height={svgH} fill="#fef3c7" opacity="0.2" />

          <text x="200" y="15" textAnchor="middle" fontSize="9" fill="#64748b" fontWeight="bold">
            Qanat Longitudinal Section
          </text>

          <path d={groundProfile} fill="#d4a574" stroke="#a78b5a" strokeWidth="2" />
          <rect x="0" y={groundY - 30} width={svgW} height={30} fill="#87CEEB" opacity="0.15" />

          <polygon points="30,25 60,10 90,25" fill="#8B7355" />
          <text x="60" y="8" textAnchor="middle" fontSize="6" fill="#64748b">Mountain</text>

          <line
            x1="0"
            y1={tableY}
            x2={svgW}
            y2={tableY + 15}
            stroke="#3b82f6"
            strokeWidth="1.5"
            strokeDasharray="6,3"
          />
          <text x={svgW - 5} y={tableY + 10} textAnchor="end" fontSize="6" fill="#3b82f6">Water Table ({conv.length(effectiveTable).toFixed(0)}{u.length})</text>

          <rect x="0" y={tableY} width={svgW} height={tunnelBaseY - tableY + 20} fill="rgba(59,130,246,0.05)" />

          {shafts.map((shaft, i) => {
            const tY = tunnelY(shaft.x);
            const shaftTop = groundY - (i === 0 ? 20 : i === 1 ? 10 : i === 2 ? 3 : -5);
            const shaftBottom = tY;

            return (
              <g key={`shaft-${i}`}>
                <rect
                  x={shaft.x - 3}
                  y={shaftTop}
                  width={6}
                  height={shaftBottom - shaftTop}
                  fill="#8B7355"
                  stroke="#a78b5a"
                  strokeWidth="0.5"
                />

                {tableY < shaftBottom && (
                  <rect
                    x={shaft.x - 2}
                    y={Math.max(tableY, shaftTop)}
                    width={4}
                    height={shaftBottom - Math.max(tableY, shaftTop)}
                    fill="rgba(59,130,246,0.3)"
                  />
                )}

                {[0, 1, 2].map((d) => {
                  const dt = ((animOffset + d * 67 + i * 30) % 200) / 200;
                  const seepY = Math.max(tableY, shaftTop) + dt * (shaftBottom - Math.max(tableY, shaftTop));
                  if (tableY > shaftBottom) return null;
                  return (
                    <circle
                      key={`seep-${i}-${d}`}
                      cx={shaft.x + (d - 1) * 3}
                      cy={seepY}
                      r="1.5"
                      fill="#3b82f6"
                      opacity={0.4 + dt * 0.4}
                    />
                  );
                })}

                <rect x={shaft.x - 5} y={shaftTop - 4} width={10} height={4} fill="#a78b5a" />

                <text x={shaft.x} y={shaftTop - 7} textAnchor="middle" fontSize="5" fill="#8B7355" fontWeight="bold">
                  {shaft.name}
                </text>
                <text x={shaft.x} y={shaftBottom + 10} textAnchor="middle" fontSize="5" fill="#3b82f6">
                  {conv.flowSmall(cumulativeFlows[i]).toFixed(0)} {u.flowSmall}
                </text>
              </g>
            );
          })}

          <line
            x1={shafts[0].x}
            y1={tunnelY(shafts[0].x)}
            x2={370}
            y2={tunnelY(370)}
            stroke="#8B7355"
            strokeWidth="4"
          />
          <line
            x1={shafts[0].x}
            y1={tunnelY(shafts[0].x)}
            x2={370}
            y2={tunnelY(370)}
            stroke="rgba(59,130,246,0.3)"
            strokeWidth="2"
          />

          {Array.from({ length: 8 }, (_, i) => {
            const t = ((animOffset * 2 + i * 25) % 200) / 200;
            const x = shafts[0].x + t * (370 - shafts[0].x);
            const y = tunnelY(x);
            return (
              <circle key={`tflow-${i}`} cx={x} cy={y} r="2" fill="#3b82f6" opacity={0.3 + t * 0.5}>
                <animate attributeName="opacity" values="0.3;0.7;0.3" dur="2s" repeatCount="indefinite" />
              </circle>
            );
          })}

          <rect x="355" y={tunnelY(370) - 10} width="35" height="25" fill="#a78b5a" stroke="#8B7355" strokeWidth="1" rx="2" />
          <rect x="357" y={tunnelY(370) - 5} width="31" height="15" fill="rgba(59,130,246,0.4)" />
          <text x="372" y={tunnelY(370) + 22} textAnchor="middle" fontSize="5" fill="#64748b">Outlet</text>

          <rect x="355" y={tunnelY(370) + 25} width="40" height="15" fill="#dcfce7" stroke="#22c55e" strokeWidth="0.5" rx="2" />
          <text x="375" y={tunnelY(370) + 35} textAnchor="middle" fontSize="5" fill="#15803d">Settlement</text>
        </svg>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-medium" data-testid="label-water-table">Water Table: {conv.length(waterTable[0]).toFixed(0)}{u.length}</label>
            <Slider value={waterTable} onValueChange={setWaterTable} min={-25} max={-5} step={1} data-testid="slider-water-table" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium" data-testid="label-tunnel-gradient">Gradient: {grad.toFixed(1)}%</label>
            <Slider value={tunnelGradient} onValueChange={setTunnelGradient} min={0.1} max={0.5} step={0.05} data-testid="slider-tunnel-gradient" />
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-medium text-muted-foreground">Season:</span>
          {(["spring", "summer", "autumn", "winter"] as const).map((s) => (
            <Button
              key={s}
              variant={season === s ? "default" : "outline"}
              size="sm"
              onClick={() => setSeason(s)}
              data-testid={`button-qanat-${s}`}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </Button>
          ))}
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800 p-3">
          <div className="text-xs font-semibold mb-2 text-blue-700 dark:text-blue-300">Cumulative Flow at Each Shaft</div>
          <div className="grid grid-cols-4 gap-2 text-xs">
            {shafts.map((shaft, i) => (
              <div key={shaft.name} data-testid={`text-shaft-flow-${i}`}>
                <span className="text-muted-foreground">{shaft.name}:</span>{" "}
                <span className="font-bold">{conv.flowSmall(cumulativeFlows[i]).toFixed(1)} {u.flowSmall}</span>
              </div>
            ))}
          </div>
          <div className="mt-2 flex items-center gap-4 text-xs">
            <div data-testid="text-total-qanat-flow">
              <span className="text-muted-foreground">Total Output:</span>{" "}
              <span className="font-bold text-blue-600">{conv.flowSmall(totalFlow).toFixed(1)} {u.flowSmall}</span>
            </div>
            <div data-testid="text-daily-qanat">
              <span className="text-muted-foreground">Daily:</span>{" "}
              <span className="font-bold">{(conv.volume((totalFlow * 86400) / 1000)).toFixed(0)} {u.volume}/day</span>
            </div>
          </div>

          <div className="mt-2 flex gap-1">
            {shafts.map((_, i) => (
              <div
                key={`bar-${i}`}
                className="flex-1 rounded"
                style={{
                  height: `${Math.max(4, (cumulativeFlows[i] / 40) * 30)}px`,
                  backgroundColor: `rgba(59,130,246,${0.3 + (cumulativeFlows[i] / 40) * 0.6})`,
                }}
                data-testid={`bar-shaft-${i}`}
              />
            ))}
          </div>
        </div>

        <div className="bg-amber-50 dark:bg-amber-900/20 rounded border border-amber-200 dark:border-amber-800 p-3" data-testid="text-historical-fact-qanat">
          <span className="text-xs font-semibold text-amber-700 dark:text-amber-300">Historical Fact: </span>
          <span className="text-xs text-amber-800 dark:text-amber-200">
            {conv.length(270000000).toFixed(0)} {u.length} of qanat tunnels in Iran — 6.7 times around Earth. Some qanats have operated continuously for over 3,000 years, delivering water purely by gravity with zero energy input.
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
