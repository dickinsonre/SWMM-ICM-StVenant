import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useUnits } from "@/contexts/UnitsContext";

export function LoopDetectionAnimation() {
  const [mode, setMode] = useState<"dry" | "storm" | "post">("dry");
  const [animOffset, setAnimOffset] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimOffset((prev) => (prev + 2) % 400);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const dendriticNodes = [
    { x: 200, y: 30, id: "D1" },
    { x: 120, y: 70, id: "D2" },
    { x: 280, y: 70, id: "D3" },
    { x: 80, y: 110, id: "D4" },
    { x: 160, y: 110, id: "D5" },
    { x: 240, y: 110, id: "D6" },
    { x: 320, y: 110, id: "D7" },
    { x: 200, y: 150, id: "OUT" },
  ];

  const dendriticLinks = [
    { from: 0, to: 1 }, { from: 0, to: 2 },
    { from: 1, to: 3 }, { from: 1, to: 4 },
    { from: 2, to: 5 }, { from: 2, to: 6 },
    { from: 4, to: 7 }, { from: 5, to: 7 },
  ];

  const loopedNodes = [
    { x: 80, y: 180, id: "L1" },
    { x: 200, y: 180, id: "L2" },
    { x: 320, y: 180, id: "L3" },
    { x: 80, y: 240, id: "L4" },
    { x: 200, y: 240, id: "L5" },
    { x: 320, y: 240, id: "L6" },
  ];

  const loopedLinks = [
    { from: 0, to: 1 }, { from: 1, to: 2 },
    { from: 0, to: 3 }, { from: 1, to: 4 },
    { from: 2, to: 5 }, { from: 3, to: 4 },
    { from: 4, to: 5 },
  ];

  const getArrowDir = (linkIdx: number, isLoop: boolean) => {
    if (!isLoop) return 1;
    if (mode === "storm" && (linkIdx === 5 || linkIdx === 6)) return -1;
    return 1;
  };

  const renderArrow = (
    x1: number, y1: number, x2: number, y2: number,
    dir: number, color: string, key: string
  ) => {
    const mx = (x1 + x2) / 2;
    const my = (y1 + y2) / 2;
    const dx = x2 - x1;
    const dy = y2 - y1;
    const len = Math.sqrt(dx * dx + dy * dy);
    const nx = (dx / len) * dir;
    const ny = (dy / len) * dir;
    const arrowSize = 6;
    const t = ((animOffset) % 400) / 400;
    const px = x1 + t * (x2 - x1);
    const py = y1 + t * (y2 - y1);

    return (
      <g key={key}>
        <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth="2" opacity="0.6" />
        <polygon
          points={`${mx + nx * 8},${my + ny * 8} ${mx - nx * 2 - ny * arrowSize * 0.5},${my - ny * 2 + nx * arrowSize * 0.5} ${mx - nx * 2 + ny * arrowSize * 0.5},${my - ny * 2 - nx * arrowSize * 0.5}`}
          fill={color}
        />
        <circle cx={px} cy={py} r="3" fill={color} opacity="0.8">
          <animate attributeName="opacity" values="0.4;1;0.4" dur="1.5s" repeatCount="indefinite" />
        </circle>
      </g>
    );
  };

  return (
    <Card data-testid="card-loop-detection">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Loop Detection — Dendritic vs Looped</CardTitle>
          <Badge data-testid="badge-loop-networks">Loop Networks</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-medium text-muted-foreground">Condition:</span>
          {(["dry", "storm", "post"] as const).map((m) => (
            <Button
              key={m}
              variant={mode === m ? "default" : "outline"}
              size="sm"
              onClick={() => setMode(m)}
              data-testid={`button-mode-${m}`}
            >
              {m === "dry" ? "Dry Weather" : m === "storm" ? "Storm" : "Post-Storm"}
            </Button>
          ))}
        </div>

        <svg viewBox="0 0 400 280" className="w-full border rounded bg-muted/20" data-testid="svg-loop-detection">
          <text x="200" y="18" textAnchor="middle" fontSize="9" fill="#64748b" fontWeight="bold">
            Dendritic (Tree) Network
          </text>
          {dendriticLinks.map((link, i) => {
            const n1 = dendriticNodes[link.from];
            const n2 = dendriticNodes[link.to];
            return renderArrow(n1.x, n1.y, n2.x, n2.y, 1, "#3b82f6", `dlink-${i}`);
          })}
          {dendriticNodes.map((n, i) => (
            <g key={`dnode-${i}`}>
              <circle cx={n.x} cy={n.y} r="10" fill="white" stroke="#3b82f6" strokeWidth="2" />
              <text x={n.x} y={n.y + 3} textAnchor="middle" fontSize="6" fill="#3b82f6">{n.id}</text>
            </g>
          ))}

          <line x1="20" y1="168" x2="380" y2="168" stroke="#94a3b8" strokeWidth="0.5" strokeDasharray="4,2" />
          <text x="200" y="175" textAnchor="middle" fontSize="9" fill="#64748b" fontWeight="bold">
            Looped Network {mode === "storm" ? "(Flow Reversal!)" : ""}
          </text>

          {loopedLinks.map((link, i) => {
            const n1 = loopedNodes[link.from];
            const n2 = loopedNodes[link.to];
            const dir = getArrowDir(i, true);
            const color = dir === -1 ? "#ef4444" : "#10b981";
            const startX = dir === 1 ? n1.x : n2.x;
            const startY = dir === 1 ? n1.y : n2.y;
            const endX = dir === 1 ? n2.x : n1.x;
            const endY = dir === 1 ? n2.y : n1.y;
            return renderArrow(
              startX, startY, endX, endY,
              1, color, `llink-${i}`
            );
          })}
          {loopedNodes.map((n, i) => (
            <g key={`lnode-${i}`}>
              <circle cx={n.x} cy={n.y} r="10" fill="white" stroke="#10b981" strokeWidth="2" />
              <text x={n.x} y={n.y + 3} textAnchor="middle" fontSize="6" fill="#10b981">{n.id}</text>
            </g>
          ))}

          {mode === "storm" && (
            <text x="200" y="262" textAnchor="middle" fontSize="8" fill="#ef4444" fontWeight="bold">
              ⚠ Flow reversal in bottom loop links during storm
            </text>
          )}
        </svg>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800 p-3">
            <div className="text-xs font-semibold text-blue-700 dark:text-blue-300 mb-1">SWMM5</div>
            <div className="text-xs text-blue-800 dark:text-blue-200">
              Handles loops in DYNWAVE only. Kinematic wave cannot handle flow reversal.
            </div>
          </div>
          <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded border border-emerald-200 dark:border-emerald-800 p-3">
            <div className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 mb-1">ICM</div>
            <div className="text-xs text-emerald-800 dark:text-emerald-200">
              Always handles loops (always dynamic wave). No solver mode selection needed.
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function BoundaryInfluenceAnimation() {
  const [regime, setRegime] = useState<"subcritical" | "supercritical" | "mixed">("subcritical");
  const [slope, setSlope] = useState([0.5]);
  const [dsLevel, setDsLevel] = useState([70]);
  const [animOffset, setAnimOffset] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimOffset((prev) => (prev + 2) % 400);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const slopeVal = slope[0];
  const dsLevelVal = dsLevel[0];

  const pipeStartX = 40;
  const pipeEndX = 360;
  const pipeTopY = 100;
  const pipeBottomY = 140;
  const pipeLen = pipeEndX - pipeStartX;

  const froudeNum = regime === "subcritical" ? 0.4 + slopeVal * 0.1 : regime === "supercritical" ? 1.2 + slopeVal * 0.3 : 0.95;

  const renderInfoArrows = () => {
    const arrows = [];
    if (regime === "subcritical") {
      for (let i = 0; i < 5; i++) {
        const t = ((animOffset + i * 80) % 400) / 400;
        const x = pipeEndX - t * pipeLen;
        const y = (pipeTopY + pipeBottomY) / 2 - 15;
        arrows.push(
          <g key={`info-${i}`}>
            <polygon points={`${x - 6},${y} ${x},${y - 4} ${x},${y + 4}`} fill="#f59e0b" opacity={0.6 + t * 0.4} />
            <line x1={x} y1={y} x2={x + 15} y2={y} stroke="#f59e0b" strokeWidth="1.5" opacity={0.6 + t * 0.4} />
          </g>
        );
      }
    } else if (regime === "supercritical") {
      for (let i = 0; i < 5; i++) {
        const t = ((animOffset + i * 80) % 400) / 400;
        const x = pipeStartX + t * pipeLen;
        const y = (pipeTopY + pipeBottomY) / 2 - 15;
        arrows.push(
          <g key={`info-${i}`}>
            <line x1={x - 15} y1={y} x2={x} y2={y} stroke="#3b82f6" strokeWidth="1.5" opacity={0.6 + t * 0.4} />
            <polygon points={`${x + 6},${y} ${x},${y - 4} ${x},${y + 4}`} fill="#3b82f6" opacity={0.6 + t * 0.4} />
          </g>
        );
      }
    } else {
      const jumpX = pipeStartX + pipeLen * 0.55;
      for (let i = 0; i < 3; i++) {
        const t = ((animOffset + i * 130) % 400) / 400;
        const x1 = pipeStartX + t * (jumpX - pipeStartX);
        const y = (pipeTopY + pipeBottomY) / 2 - 15;
        arrows.push(
          <g key={`info-us-${i}`}>
            <line x1={x1 - 10} y1={y} x2={x1} y2={y} stroke="#3b82f6" strokeWidth="1.5" opacity={0.5 + t * 0.5} />
            <polygon points={`${x1 + 4},${y} ${x1},${y - 3} ${x1},${y + 3}`} fill="#3b82f6" opacity={0.5 + t * 0.5} />
          </g>
        );
      }
      for (let i = 0; i < 3; i++) {
        const t = ((animOffset + i * 130) % 400) / 400;
        const x2 = pipeEndX - t * (pipeEndX - jumpX);
        const y = (pipeTopY + pipeBottomY) / 2 - 15;
        arrows.push(
          <g key={`info-ds-${i}`}>
            <polygon points={`${x2 - 4},${y} ${x2},${y - 3} ${x2},${y + 3}`} fill="#f59e0b" opacity={0.5 + t * 0.5} />
            <line x1={x2} y1={y} x2={x2 + 10} y2={y} stroke="#f59e0b" strokeWidth="1.5" opacity={0.5 + t * 0.5} />
          </g>
        );
      }
      arrows.push(
        <rect key="jump-rect" x={jumpX - 3} y={pipeTopY - 5} width={6} height={pipeBottomY - pipeTopY + 10} fill="rgba(239,68,68,0.3)" stroke="#ef4444" strokeWidth="1" />
      );
    }
    return arrows;
  };

  const waterSurfacePath = () => {
    if (regime === "subcritical") {
      const dsY = pipeTopY + (pipeBottomY - pipeTopY) * (dsLevelVal / 100);
      const usY = dsY - 8;
      return `M ${pipeStartX},${usY} Q ${pipeStartX + pipeLen * 0.5},${(usY + dsY) / 2} ${pipeEndX},${dsY}`;
    } else if (regime === "supercritical") {
      const usY = pipeTopY + 8;
      const dsY = usY + 5;
      return `M ${pipeStartX},${usY} L ${pipeEndX},${dsY}`;
    } else {
      const jumpX = pipeStartX + pipeLen * 0.55;
      const usY = pipeTopY + 8;
      const dsY = pipeTopY + (pipeBottomY - pipeTopY) * 0.7;
      return `M ${pipeStartX},${usY} L ${jumpX - 5},${usY + 3} L ${jumpX},${dsY} L ${pipeEndX},${dsY - 3}`;
    }
  };

  return (
    <Card data-testid="card-boundary-influence">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Boundary Influence — Flow Regimes</CardTitle>
          <Badge data-testid="badge-flow-regimes">Flow Regimes</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-medium text-muted-foreground">Regime:</span>
          {(["subcritical", "supercritical", "mixed"] as const).map((r) => (
            <Button
              key={r}
              variant={regime === r ? "default" : "outline"}
              size="sm"
              onClick={() => setRegime(r)}
              data-testid={`button-regime-${r}`}
            >
              {r === "subcritical" ? "Subcritical (Fr<1)" : r === "supercritical" ? "Supercritical (Fr>1)" : "Mixed (Hyd. Jump)"}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-medium" data-testid="label-pipe-slope">Pipe Slope: {slopeVal.toFixed(1)}%</label>
            <Slider value={slope} onValueChange={setSlope} min={0.1} max={5} step={0.1} data-testid="slider-pipe-slope" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium" data-testid="label-ds-level">DS Level: {dsLevelVal}%</label>
            <Slider value={dsLevel} onValueChange={setDsLevel} min={10} max={100} step={5} data-testid="slider-ds-level" />
          </div>
        </div>

        <svg viewBox="0 0 400 220" className="w-full border rounded bg-muted/20" data-testid="svg-boundary-influence">
          <text x="200" y="18" textAnchor="middle" fontSize="9" fill="#64748b" fontWeight="bold">
            {regime === "subcritical" ? "Subcritical Flow — Downstream Controls" :
             regime === "supercritical" ? "Supercritical Flow — Upstream Controls" :
             "Mixed Flow — Hydraulic Jump"}
          </text>

          <rect x={pipeStartX} y={pipeTopY} width={pipeLen} height={pipeBottomY - pipeTopY}
            fill="none" stroke="#94a3b8" strokeWidth="2" />

          <path d={waterSurfacePath()} fill="none" stroke="#3b82f6" strokeWidth="2.5" />

          {renderInfoArrows()}

          {regime === "mixed" && (
            <g>
              <rect x={pipeStartX + pipeLen * 0.55 - 3} y={pipeTopY - 5}
                width={6} height={pipeBottomY - pipeTopY + 10}
                fill="rgba(239,68,68,0.3)" stroke="#ef4444" strokeWidth="1" />
              <text x={pipeStartX + pipeLen * 0.55} y={pipeTopY - 10}
                textAnchor="middle" fontSize="7" fill="#ef4444" fontWeight="bold">
                Hydraulic Jump
              </text>
            </g>
          )}

          <text x={pipeStartX} y={pipeBottomY + 18} fontSize="7" fill="#64748b">Upstream</text>
          <text x={pipeEndX - 40} y={pipeBottomY + 18} fontSize="7" fill="#64748b">Downstream</text>

          <text x={200} y={pipeBottomY + 35} textAnchor="middle" fontSize="8" fill="#64748b">
            Fr = {froudeNum.toFixed(2)} | Slope = {slopeVal.toFixed(1)}%
          </text>

          {regime === "subcritical" && (
            <g>
              <text x="60" y="75" fontSize="7" fill="#f59e0b">← Information propagates upstream</text>
              <text x="200" y={pipeBottomY + 50} textAnchor="middle" fontSize="7" fill="#64748b">
                Backwater visible — downstream boundary controls water surface
              </text>
            </g>
          )}
          {regime === "supercritical" && (
            <g>
              <text x="60" y="75" fontSize="7" fill="#3b82f6">Information propagates downstream →</text>
              <text x="200" y={pipeBottomY + 50} textAnchor="middle" fontSize="7" fill="#64748b">
                No backwater — upstream boundary controls water surface
              </text>
            </g>
          )}
          {regime === "mixed" && (
            <text x="200" y={pipeBottomY + 50} textAnchor="middle" fontSize="7" fill="#64748b">
              Both regimes in same pipe — most challenging for solvers
            </text>
          )}
        </svg>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800 p-3">
            <div className="text-xs font-semibold text-blue-700 dark:text-blue-300 mb-1">SWMM5</div>
            <div className="text-xs text-blue-800 dark:text-blue-200">
              Inertial damping handles supercritical transitions. User selects damping mode (NONE/PARTIAL/FULL).
            </div>
          </div>
          <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded border border-emerald-200 dark:border-emerald-800 p-3">
            <div className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 mb-1">ICM</div>
            <div className="text-xs text-emerald-800 dark:text-emerald-200">
              Automatic internal handling. No user configuration needed for regime transitions.
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

const perfData = [
  { nodes: 100, swmm: 2, icm: 3 },
  { nodes: 500, swmm: 15, icm: 12 },
  { nodes: 1000, swmm: 45, icm: 25 },
  { nodes: 5000, swmm: 480, icm: 180 },
  { nodes: 10000, swmm: 2100, icm: 480 },
  { nodes: 50000, swmm: 21600, icm: 2700 },
];

function formatTime(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  if (seconds < 3600) return `${Math.round(seconds / 60)}min`;
  return `${(seconds / 3600).toFixed(1)}hrs`;
}

function interpolatePerf(nodeCount: number): { swmm: number; icm: number } {
  if (nodeCount <= perfData[0].nodes) return { swmm: perfData[0].swmm, icm: perfData[0].icm };
  if (nodeCount >= perfData[perfData.length - 1].nodes)
    return { swmm: perfData[perfData.length - 1].swmm, icm: perfData[perfData.length - 1].icm };

  for (let i = 0; i < perfData.length - 1; i++) {
    if (nodeCount >= perfData[i].nodes && nodeCount <= perfData[i + 1].nodes) {
      const logN = Math.log10(nodeCount);
      const logN1 = Math.log10(perfData[i].nodes);
      const logN2 = Math.log10(perfData[i + 1].nodes);
      const t = (logN - logN1) / (logN2 - logN1);
      const logS1 = Math.log10(perfData[i].swmm);
      const logS2 = Math.log10(perfData[i + 1].swmm);
      const logI1 = Math.log10(perfData[i].icm);
      const logI2 = Math.log10(perfData[i + 1].icm);
      return {
        swmm: Math.pow(10, logS1 + t * (logS2 - logS1)),
        icm: Math.pow(10, logI1 + t * (logI2 - logI1)),
      };
    }
  }
  return { swmm: 0, icm: 0 };
}

export function PerformanceScalingAnimation() {
  const [nodeSlider, setNodeSlider] = useState([2.7]);
  const nodeCount = Math.round(Math.pow(10, nodeSlider[0]));
  const current = interpolatePerf(nodeCount);

  const chartX = 60;
  const chartY = 30;
  const chartW = 280;
  const chartH = 160;
  const maxTime = Math.max(current.swmm, current.icm, 1);
  const barW = 60;

  const swmmBarH = (current.swmm / maxTime) * chartH;
  const icmBarH = (current.icm / maxTime) * chartH;

  return (
    <Card data-testid="card-performance-scaling">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Performance Scaling — SWMM5 vs ICM</CardTitle>
          <Badge data-testid="badge-performance">Performance</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1">
          <label className="text-xs font-medium" data-testid="label-network-size">
            Network Size: {nodeCount.toLocaleString()} nodes
          </label>
          <Slider
            value={nodeSlider}
            onValueChange={setNodeSlider}
            min={2}
            max={4.7}
            step={0.01}
            data-testid="slider-network-size"
          />
          <div className="flex justify-between text-[10px] text-muted-foreground">
            <span>100</span><span>500</span><span>1K</span><span>5K</span><span>10K</span><span>50K</span>
          </div>
        </div>

        <svg viewBox="0 0 400 240" className="w-full border rounded bg-muted/20" data-testid="svg-performance-chart">
          <text x="200" y="18" textAnchor="middle" fontSize="9" fill="#64748b" fontWeight="bold">
            Computation Time at {nodeCount.toLocaleString()} Nodes
          </text>

          <line x1={chartX} y1={chartY} x2={chartX} y2={chartY + chartH} stroke="#94a3b8" strokeWidth="1" />
          <line x1={chartX} y1={chartY + chartH} x2={chartX + chartW} y2={chartY + chartH} stroke="#94a3b8" strokeWidth="1" />

          <rect
            x={chartX + chartW * 0.2}
            y={chartY + chartH - swmmBarH}
            width={barW}
            height={swmmBarH}
            fill="rgba(59,130,246,0.7)"
            stroke="#3b82f6"
            strokeWidth="1"
            rx="2"
          />
          <text
            x={chartX + chartW * 0.2 + barW / 2}
            y={chartY + chartH - swmmBarH - 8}
            textAnchor="middle" fontSize="9" fill="#3b82f6" fontWeight="bold"
          >
            {formatTime(Math.round(current.swmm))}
          </text>
          <text
            x={chartX + chartW * 0.2 + barW / 2}
            y={chartY + chartH + 14}
            textAnchor="middle" fontSize="8" fill="#3b82f6"
          >
            SWMM5
          </text>

          <rect
            x={chartX + chartW * 0.55}
            y={chartY + chartH - icmBarH}
            width={barW}
            height={icmBarH}
            fill="rgba(16,185,129,0.7)"
            stroke="#10b981"
            strokeWidth="1"
            rx="2"
          />
          <text
            x={chartX + chartW * 0.55 + barW / 2}
            y={chartY + chartH - icmBarH - 8}
            textAnchor="middle" fontSize="9" fill="#10b981" fontWeight="bold"
          >
            {formatTime(Math.round(current.icm))}
          </text>
          <text
            x={chartX + chartW * 0.55 + barW / 2}
            y={chartY + chartH + 14}
            textAnchor="middle" fontSize="8" fill="#10b981"
          >
            ICM
          </text>

          {nodeCount <= 600 && nodeCount >= 400 && (
            <text x="200" y={chartY + chartH + 30} textAnchor="middle" fontSize="8" fill="#f59e0b" fontWeight="bold">
              ≈ Crossover Point (~500 nodes)
            </text>
          )}
        </svg>

        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse" data-testid="table-performance">
            <thead>
              <tr className="border-b">
                <th className="text-left p-1.5 text-muted-foreground">Nodes</th>
                <th className="text-right p-1.5 text-blue-600">SWMM5</th>
                <th className="text-right p-1.5 text-emerald-600">ICM</th>
                <th className="text-right p-1.5 text-muted-foreground">Faster</th>
              </tr>
            </thead>
            <tbody>
              {perfData.map((row) => (
                <tr key={row.nodes} className="border-b border-muted">
                  <td className="p-1.5">{row.nodes.toLocaleString()}</td>
                  <td className="text-right p-1.5 text-blue-600">{formatTime(row.swmm)}</td>
                  <td className="text-right p-1.5 text-emerald-600">{formatTime(row.icm)}</td>
                  <td className="text-right p-1.5 font-bold" style={{ color: row.swmm < row.icm ? "#3b82f6" : "#10b981" }}>
                    {row.swmm < row.icm ? "SWMM5" : "ICM"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-amber-50 dark:bg-amber-900/20 rounded border border-amber-200 dark:border-amber-800 p-3" data-testid="text-insight-performance">
          <span className="text-xs font-semibold text-amber-700 dark:text-amber-300">Key Insight: </span>
          <span className="text-xs text-amber-800 dark:text-amber-200">
            Below ~500 nodes: SWMM5 often faster. Above: ICM increasingly faster due to implicit solver and multi-threading.
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

const swmmWarnings = [
  {
    code: "WARNING 01",
    text: "WARNING 01: modified inertial damping applied",
    translation: "Froude number exceeded the limit at one or more conduits. The solver had to reduce momentum terms to prevent instability.",
    fix: "Check for steep pipes or sudden geometry changes. Consider increasing minimum slope or adjusting inertial damping settings.",
  },
  {
    code: "WARNING 02",
    text: "WARNING 02: Node J15 flooding occurred",
    translation: "Water level exceeded the maximum depth at node J15. Excess water is being lost from the system.",
    fix: "Add ponding area to node J15, increase max depth, or verify inflow hydrographs are reasonable.",
  },
  {
    code: "WARNING 04",
    text: "WARNING 04: Node J22 has very small volume",
    translation: "The junction volume at J22 is very small relative to flows, causing potential numerical oscillations.",
    fix: "Add surcharge depth, increase junction area, or use a storage node instead of a junction.",
  },
];

const icmWarnings = [
  {
    code: "CONV",
    text: "Convergence not achieved at timestep 1234",
    translation: "Newton-Raphson iteration failed to converge within the allowed number of iterations at this timestep.",
    fix: "Usually self-correcting. If persistent, check for abrupt geometry changes or unrealistic boundary conditions.",
  },
  {
    code: "MINDT",
    text: "Minimum timestep reached",
    translation: "Instability detected — the solver reduced the timestep to its minimum allowed value to maintain stability.",
    fix: "Check geometry for discontinuities, verify cross-section data, and ensure Manning's n values are reasonable.",
  },
  {
    code: "FLOOD",
    text: "Flooding at node MH_001",
    translation: "Water level exceeded ground level at manhole MH_001. Water is being lost or stored on the surface.",
    fix: "Check inflow magnitudes, verify pipe sizes downstream, or enable 2D surface routing to capture overland flow.",
  },
];

export function WarningMessagesAnimation() {
  const [activeTab, setActiveTab] = useState<"swmm" | "icm">("swmm");
  const [highlightIdx, setHighlightIdx] = useState(0);
  const [fadeIn, setFadeIn] = useState(true);

  useEffect(() => {
    setFadeIn(false);
    const timeout = setTimeout(() => {
      setHighlightIdx(0);
      setFadeIn(true);
    }, 150);
    return () => clearTimeout(timeout);
  }, [activeTab]);

  const warnings = activeTab === "swmm" ? swmmWarnings : icmWarnings;

  return (
    <Card data-testid="card-warning-messages">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Warning Messages Decoded</CardTitle>
          <Badge data-testid="badge-warnings">Warnings</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <Button
            variant={activeTab === "swmm" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveTab("swmm")}
            data-testid="button-tab-swmm"
          >
            SWMM5 Warnings
          </Button>
          <Button
            variant={activeTab === "icm" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveTab("icm")}
            data-testid="button-tab-icm"
          >
            ICM Warnings
          </Button>
        </div>

        <div className="flex items-center gap-1 flex-wrap">
          {warnings.map((w, i) => (
            <Button
              key={w.code}
              variant={highlightIdx === i ? "default" : "outline"}
              size="sm"
              onClick={() => { setFadeIn(false); setTimeout(() => { setHighlightIdx(i); setFadeIn(true); }, 100); }}
              data-testid={`button-warning-${i}`}
            >
              {w.code}
            </Button>
          ))}
        </div>

        <div
          className={`space-y-3 transition-opacity duration-200 ${fadeIn ? "opacity-100" : "opacity-0"}`}
          data-testid="warning-detail"
        >
          <div className="bg-red-50 dark:bg-red-900/20 rounded border border-red-300 dark:border-red-800 p-3">
            <div className="text-xs font-semibold text-red-700 dark:text-red-300 mb-1">⚠ Warning</div>
            <div className="text-xs text-red-800 dark:text-red-200 font-mono">{warnings[highlightIdx].text}</div>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 rounded border border-green-300 dark:border-green-800 p-3">
            <div className="text-xs font-semibold text-green-700 dark:text-green-300 mb-1">💡 Translation</div>
            <div className="text-xs text-green-800 dark:text-green-200">{warnings[highlightIdx].translation}</div>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-300 dark:border-blue-800 p-3">
            <div className="text-xs font-semibold text-blue-700 dark:text-blue-300 mb-1">🔧 Recommended Fix</div>
            <div className="text-xs text-blue-800 dark:text-blue-200">{warnings[highlightIdx].fix}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

const swmmMilestones = [
  { year: 1971, label: "SWMM I", detail: "First version by EPA/CDM. Batch-mode mainframe simulation." },
  { year: 1975, label: "SWMM II", detail: "Added EXTRAN for dynamic wave routing." },
  { year: 1981, label: "SWMM III", detail: "EXTRAN module refined. Became the standard for urban drainage." },
  { year: 1988, label: "SWMM IV", detail: "Improved numerical methods and GUI interface." },
  { year: 2004, label: "SWMM 5.0", detail: "Complete rewrite in C. Open source. Modern architecture." },
  { year: 2012, label: "v5.1", detail: "Preissmann slot added for pressurized flow." },
  { year: 2024, label: "v5.2.4", detail: "Latest release with bug fixes and LID improvements." },
];

const icmMilestones = [
  { year: 1987, label: "InfoWorks", detail: "Wallingford Software releases InfoWorks CS. Implicit solver." },
  { year: 2004, label: "ICM", detail: "Integrated Catchment Modeling with 2D surface added." },
  { year: 2019, label: "ICM+SWMM5", detail: "ICM adds SWMM5 engine as an alternative solver option." },
  { year: 2025, label: "ICM 2025.1", detail: "Latest release with enhanced GPU acceleration." },
];

const convergenceLines = [
  { fromYear: 2012, toYear: 2012, label: "Preissmann slot" },
  { fromYear: 2019, toYear: 2019, label: "SWMM5 engine in ICM" },
];

export function SolverEvolutionTimeline() {
  const [animProgress, setAnimProgress] = useState(0);
  const [selectedMilestone, setSelectedMilestone] = useState<{ label: string; detail: string; year: number } | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimProgress((prev) => {
        if (prev >= 100) return 100;
        return prev + 0.3;
      });
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const timelineStartYear = 1968;
  const timelineEndYear = 2028;
  const yearRange = timelineEndYear - timelineStartYear;
  const yearToX = (year: number) => 30 + ((year - timelineStartYear) / yearRange) * 340;

  const swmmTrackY = 80;
  const icmTrackY = 180;
  const progressX = yearToX(timelineStartYear + (animProgress / 100) * yearRange);

  return (
    <Card data-testid="card-solver-evolution">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Solver Evolution Timeline</CardTitle>
          <Badge data-testid="badge-evolution">Evolution</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <svg viewBox="0 0 400 260" className="w-full border rounded bg-muted/20" data-testid="svg-evolution-timeline">
          <text x="200" y="18" textAnchor="middle" fontSize="9" fill="#64748b" fontWeight="bold">
            SWMM &amp; ICM/InfoWorks Development Timeline
          </text>

          <line x1="30" y1={swmmTrackY} x2="370" y2={swmmTrackY} stroke="#3b82f6" strokeWidth="2" opacity="0.3" />
          <line x1="30" y1={swmmTrackY} x2={Math.min(progressX, 370)} y2={swmmTrackY} stroke="#3b82f6" strokeWidth="3" />
          <text x="15" y={swmmTrackY + 4} fontSize="7" fill="#3b82f6" fontWeight="bold">SWMM</text>

          <line x1="30" y1={icmTrackY} x2="370" y2={icmTrackY} stroke="#10b981" strokeWidth="2" opacity="0.3" />
          <line x1={yearToX(1987)} y1={icmTrackY} x2={Math.min(progressX, 370)} y2={icmTrackY} stroke="#10b981" strokeWidth="3" />
          <text x="15" y={icmTrackY + 4} fontSize="7" fill="#10b981" fontWeight="bold">ICM</text>

          {swmmMilestones.map((m, i) => {
            const x = yearToX(m.year);
            const visible = x <= progressX;
            return (
              <g key={`swmm-${i}`} opacity={visible ? 1 : 0.2}
                style={{ cursor: "pointer" }}
                onClick={() => setSelectedMilestone(m)}
                data-testid={`milestone-swmm-${m.year}`}
              >
                <circle cx={x} cy={swmmTrackY} r="6" fill={visible ? "#3b82f6" : "#94a3b8"} />
                <text x={x} y={swmmTrackY - 12} textAnchor="middle" fontSize="6" fill="#3b82f6" fontWeight="bold">
                  {m.year}
                </text>
                <text x={x} y={swmmTrackY + 18} textAnchor="middle" fontSize="5.5" fill="#64748b">
                  {m.label}
                </text>
              </g>
            );
          })}

          {icmMilestones.map((m, i) => {
            const x = yearToX(m.year);
            const visible = x <= progressX;
            return (
              <g key={`icm-${i}`} opacity={visible ? 1 : 0.2}
                style={{ cursor: "pointer" }}
                onClick={() => setSelectedMilestone(m)}
                data-testid={`milestone-icm-${m.year}`}
              >
                <circle cx={x} cy={icmTrackY} r="6" fill={visible ? "#10b981" : "#94a3b8"} />
                <text x={x} y={icmTrackY - 12} textAnchor="middle" fontSize="6" fill="#10b981" fontWeight="bold">
                  {m.year}
                </text>
                <text x={x} y={icmTrackY + 18} textAnchor="middle" fontSize="5.5" fill="#64748b">
                  {m.label}
                </text>
              </g>
            );
          })}

          {convergenceLines.map((c, i) => {
            const x = yearToX(c.fromYear);
            const visible = x <= progressX;
            return (
              <g key={`conv-${i}`} opacity={visible ? 0.6 : 0.1}>
                <line x1={x} y1={swmmTrackY + 8} x2={x} y2={icmTrackY - 8}
                  stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="4,3" />
                <text x={x + 4} y={(swmmTrackY + icmTrackY) / 2 + 3} fontSize="5" fill="#f59e0b">
                  {c.label}
                </text>
              </g>
            );
          })}

          {[1970, 1980, 1990, 2000, 2010, 2020].map((yr) => (
            <g key={`year-${yr}`}>
              <line x1={yearToX(yr)} y1={230} x2={yearToX(yr)} y2={235} stroke="#94a3b8" strokeWidth="0.5" />
              <text x={yearToX(yr)} y={244} textAnchor="middle" fontSize="6" fill="#94a3b8">{yr}</text>
            </g>
          ))}
          <line x1="30" y1={235} x2="370" y2={235} stroke="#94a3b8" strokeWidth="0.5" />
        </svg>

        {selectedMilestone && (
          <div className="bg-slate-50 dark:bg-slate-900/20 rounded border border-slate-300 dark:border-slate-700 p-3" data-testid="milestone-detail">
            <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              {selectedMilestone.year} — {selectedMilestone.label}
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">{selectedMilestone.detail}</div>
          </div>
        )}

        <Button
          variant="outline"
          size="sm"
          onClick={() => setAnimProgress(0)}
          data-testid="button-replay-timeline"
        >
          Replay Timeline
        </Button>
      </CardContent>
    </Card>
  );
}

const termColors: Record<string, string> = {
  local: "#3b82f6",
  convective: "#10b981",
  pressure: "#f59e0b",
  friction: "#ef4444",
};

const termLabels: Record<string, string> = {
  local: "Local Acceleration",
  convective: "Convective Acceleration",
  pressure: "Pressure Gradient",
  friction: "Friction Slope",
};

export function EquationsSideBySideAnimation() {
  const [highlightTerm, setHighlightTerm] = useState<string | null>(null);
  const [autoStep, setAutoStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setAutoStep((prev) => (prev + 1) % 200);
    }, 80);
    return () => clearInterval(interval);
  }, []);

  const autoTerm = highlightTerm === null
    ? (["local", "convective", "pressure", "friction"] as const)[Math.floor(autoStep / 50) % 4]
    : highlightTerm;

  const getOpacity = (term: string) => {
    if (autoTerm === term) return 1;
    return 0.3;
  };

  const swmmApprox: Record<string, string> = {
    local: "Backward Euler (θ=1.0)",
    convective: "Upstream weighting",
    pressure: "Node head difference ÷ link length",
    friction: "Manning's at midpoint",
  };

  const icmApprox: Record<string, string> = {
    local: "Preissmann (θ=0.65)",
    convective: "Centered difference",
    pressure: "Segment-level gradient",
    friction: "Manning's at each segment",
  };

  return (
    <Card data-testid="card-equations-comparison">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Saint-Venant Equations — Side by Side</CardTitle>
          <Badge data-testid="badge-saint-venant">Saint-Venant</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <svg viewBox="0 0 400 160" className="w-full border rounded bg-muted/20" data-testid="svg-equations">
          <text x="200" y="20" textAnchor="middle" fontSize="9" fill="#64748b" fontWeight="bold">
            Full Saint-Venant Equations
          </text>

          <text x="30" y="45" fontSize="8" fill="#64748b" fontWeight="bold">Continuity:</text>
          <text x="110" y="45" fontSize="9" fill="#64748b">∂A/∂t + ∂Q/∂x = q</text>

          <text x="30" y="75" fontSize="8" fill="#64748b" fontWeight="bold">Momentum:</text>

          <text x="110" y="75" fontSize="9" fill={termColors.local} opacity={getOpacity("local")} fontWeight={autoTerm === "local" ? "bold" : "normal"}>
            ∂Q/∂t
          </text>
          <text x="147" y="75" fontSize="9" fill="#64748b">+</text>
          <text x="157" y="75" fontSize="9" fill={termColors.convective} opacity={getOpacity("convective")} fontWeight={autoTerm === "convective" ? "bold" : "normal"}>
            ∂(Q²/A)/∂x
          </text>
          <text x="222" y="75" fontSize="9" fill="#64748b">+</text>
          <text x="232" y="75" fontSize="9" fill={termColors.pressure} opacity={getOpacity("pressure")} fontWeight={autoTerm === "pressure" ? "bold" : "normal"}>
            gA·∂H/∂x
          </text>
          <text x="296" y="75" fontSize="9" fill="#64748b">+</text>
          <text x="306" y="75" fontSize="9" fill={termColors.friction} opacity={getOpacity("friction")} fontWeight={autoTerm === "friction" ? "bold" : "normal"}>
            gA·Sf
          </text>
          <text x="352" y="75" fontSize="9" fill="#64748b">= 0</text>

          {(["local", "convective", "pressure", "friction"] as const).map((term, i) => (
            <g key={term}>
              <rect x={30 + i * 90} y={100} width={12} height={12} fill={termColors[term]} rx="2" opacity={getOpacity(term)} />
              <text x={46 + i * 90} y={110} fontSize="6.5" fill={termColors[term]} opacity={getOpacity(term)}>
                {termLabels[term]}
              </text>
            </g>
          ))}

          <text x="200" y="145" textAnchor="middle" fontSize="7" fill="#94a3b8">
            Highlighted: {termLabels[autoTerm]}
          </text>
        </svg>

        <div className="flex items-center gap-1 flex-wrap">
          <span className="text-xs font-medium text-muted-foreground">Highlight:</span>
          <Button variant={highlightTerm === null ? "default" : "outline"} size="sm" onClick={() => setHighlightTerm(null)} data-testid="button-term-auto">
            Auto
          </Button>
          {(["local", "convective", "pressure", "friction"] as const).map((term) => (
            <Button
              key={term}
              variant={highlightTerm === term ? "default" : "outline"}
              size="sm"
              onClick={() => setHighlightTerm(term)}
              data-testid={`button-term-${term}`}
              style={{ borderColor: termColors[term], color: highlightTerm === term ? "white" : termColors[term] }}
            >
              {termLabels[term]}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800 p-3">
            <div className="text-xs font-semibold text-blue-700 dark:text-blue-300 mb-2">SWMM5 Approximation</div>
            <div className="text-xs text-blue-800 dark:text-blue-200 space-y-1">
              <div>Solves at <span className="font-bold">link level</span> (coarse)</div>
              <div className="font-mono bg-blue-100 dark:bg-blue-800/30 rounded px-1.5 py-0.5" data-testid="text-swmm-approx">
                {autoTerm}: {swmmApprox[autoTerm]}
              </div>
              <div className="text-[10px] text-blue-600 dark:text-blue-400">Relaxation for convergence</div>
            </div>
          </div>
          <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded border border-emerald-200 dark:border-emerald-800 p-3">
            <div className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 mb-2">ICM Approximation</div>
            <div className="text-xs text-emerald-800 dark:text-emerald-200 space-y-1">
              <div>Solves at <span className="font-bold">segment level</span> (fine)</div>
              <div className="font-mono bg-emerald-100 dark:bg-emerald-800/30 rounded px-1.5 py-0.5" data-testid="text-icm-approx">
                {autoTerm}: {icmApprox[autoTerm]}
              </div>
              <div className="text-[10px] text-emerald-600 dark:text-emerald-400">Newton-Raphson for convergence</div>
            </div>
          </div>
        </div>

        <div className="bg-amber-50 dark:bg-amber-900/20 rounded border border-amber-200 dark:border-amber-800 p-3" data-testid="text-insight-equations">
          <span className="text-xs font-semibold text-amber-700 dark:text-amber-300">Key Insight: </span>
          <span className="text-xs text-amber-800 dark:text-amber-200">
            Same physics. Different numerical methods. Both valid. Both approximate.
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
