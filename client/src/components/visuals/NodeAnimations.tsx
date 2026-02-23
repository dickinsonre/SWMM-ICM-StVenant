import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function BackwaterPropagation() {
  const [tideLevel, setTideLevel] = useState([0]);
  const tide = tideLevel[0];

  const nodeXPositions = [40, 110, 180, 250, 320];
  const pipeInvert = 180;
  const pipeCrown = 140;

  const getSwmmWaterLevels = useCallback((t: number) => {
    const levels: number[] = [];
    for (let i = 0; i < 5; i++) {
      const distFromDS = 4 - i;
      const attenuation = Math.max(0, 1 - distFromDS * 0.25);
      const waterY = pipeInvert - (t / 5) * (pipeInvert - pipeCrown) * attenuation;
      levels.push(Math.min(pipeInvert, Math.max(pipeCrown, waterY)));
    }
    return levels;
  }, []);

  const getIcmWaterLevels = useCallback((t: number) => {
    const points: { x: number; y: number }[] = [];
    const totalPoints = 25;
    for (let i = 0; i < totalPoints; i++) {
      const fraction = i / (totalPoints - 1);
      const x = 40 + fraction * 280;
      const distFromDS = 1 - fraction;
      const attenuation = Math.max(0, 1 - distFromDS * 1.0);
      const rawY = pipeInvert - (t / 5) * (pipeInvert - pipeCrown) * attenuation;
      const y = Math.min(pipeInvert, Math.max(pipeCrown, rawY));
      points.push({ x, y });
    }
    return points;
  }, []);

  const swmmLevels = getSwmmWaterLevels(tide);
  const icmPoints = getIcmWaterLevels(tide);

  const renderPipeNetwork = (isIcm: boolean) => (
    <>
      {[0, 1, 2, 3].map((i) => (
        <rect
          key={`pipe-${i}`}
          x={nodeXPositions[i] + 10}
          y={pipeCrown}
          width={nodeXPositions[i + 1] - nodeXPositions[i] - 20}
          height={pipeInvert - pipeCrown}
          fill="none"
          stroke="#94a3b8"
          strokeWidth="2"
        />
      ))}
      {nodeXPositions.map((x, i) => (
        <g key={`node-${i}`}>
          <circle cx={x} cy={(pipeInvert + pipeCrown) / 2} r="12" fill="white" stroke="#94a3b8" strokeWidth="2" />
          <text x={x} y={(pipeInvert + pipeCrown) / 2 + 4} textAnchor="middle" fontSize="8" fill="#64748b">
            N{i + 1}
          </text>
        </g>
      ))}
      <line x1="30" y1={pipeInvert} x2="330" y2={pipeInvert} stroke="#94a3b8" strokeWidth="1" strokeDasharray="4,2" />
      <text x="335" y={pipeInvert + 4} fontSize="8" fill="#94a3b8">Invert</text>
      <line x1="30" y1={pipeCrown} x2="330" y2={pipeCrown} stroke="#94a3b8" strokeWidth="1" strokeDasharray="4,2" />
      <text x="335" y={pipeCrown + 4} fontSize="8" fill="#94a3b8">Crown</text>
    </>
  );

  const renderSwmmWater = () => {
    if (tide <= 0) return null;
    return swmmLevels.map((level, i) => {
      if (i >= 4) return null;
      const x1 = nodeXPositions[i] + 10;
      const x2 = nodeXPositions[i + 1] - 10;
      const upstreamY = level;
      const downstreamY = swmmLevels[i + 1];
      return (
        <g key={`water-${i}`}>
          <polygon
            points={`${x1},${pipeInvert} ${x1},${upstreamY} ${x2},${upstreamY} ${x2},${pipeInvert}`}
            fill="rgba(59,130,246,0.4)"
          />
          {i < 3 && (
            <line x1={x2} y1={upstreamY} x2={x2} y2={downstreamY} stroke="rgba(59,130,246,0.6)" strokeWidth="2" />
          )}
        </g>
      );
    });
  };

  const renderIcmWater = () => {
    if (tide <= 0) return null;
    const pathPoints = icmPoints.map((p) => `${p.x},${p.y}`).join(" ");
    const firstX = icmPoints[0].x;
    const lastX = icmPoints[icmPoints.length - 1].x;
    return (
      <polygon
        points={`${firstX},${pipeInvert} ${pathPoints} ${lastX},${pipeInvert}`}
        fill="rgba(59,130,246,0.4)"
      />
    );
  };

  return (
    <Card data-testid="card-backwater-propagation">
      <CardHeader>
        <CardTitle className="text-lg">Backwater Effect Propagation</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Tide Level: {tide.toFixed(1)}</label>
            <span className="text-xs text-muted-foreground">0 = Low, 5 = High</span>
          </div>
          <Slider
            value={tideLevel}
            onValueChange={setTideLevel}
            min={0}
            max={5}
            step={0.1}
            data-testid="slider-tide-level"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="text-sm font-semibold text-blue-600 text-center" data-testid="label-swmm-backwater">
              SWMM5 — Staircase
            </div>
            <svg viewBox="0 0 400 250" className="w-full border rounded bg-muted/20" data-testid="svg-swmm-backwater">
              {renderPipeNetwork(false)}
              {renderSwmmWater()}
              <text x="200" y="220" textAnchor="middle" fontSize="9" fill="#64748b">
                Water level changes only at node boundaries
              </text>
              <text x="330" y="135" fontSize="9" fill="#3b82f6" fontWeight="bold">↑ Tide</text>
            </svg>
          </div>
          <div className="space-y-2">
            <div className="text-sm font-semibold text-emerald-600 text-center" data-testid="label-icm-backwater">
              ICM — Smooth M1 Curve
            </div>
            <svg viewBox="0 0 400 250" className="w-full border rounded bg-muted/20" data-testid="svg-icm-backwater">
              {renderPipeNetwork(true)}
              {renderIcmWater()}
              {tide > 0 && icmPoints.map((p, i) =>
                i % 3 === 0 ? (
                  <circle key={`cp-${i}`} cx={p.x} cy={p.y} r="2" fill="#10b981" />
                ) : null
              )}
              <text x="200" y="220" textAnchor="middle" fontSize="9" fill="#64748b">
                Multiple computational points along each pipe
              </text>
              <text x="330" y="135" fontSize="9" fill="#10b981" fontWeight="bold">↑ Tide</text>
            </svg>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

type AnimPhase = "filling" | "surcharging" | "flooding" | "idle";

export function OneDTwoDCoupling() {
  const [phase, setPhase] = useState<AnimPhase>("idle");
  const [elapsed, setElapsed] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const cleanup = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => () => cleanup(), [cleanup]);

  const startAnimation = useCallback(() => {
    cleanup();
    setElapsed(0);
    setPhase("filling");
    intervalRef.current = setInterval(() => {
      setElapsed((prev) => {
        const next = prev + 0.1;
        if (next >= 8) {
          cleanup();
          setPhase("idle");
          return 0;
        }
        if (next < 3) setPhase("filling");
        else if (next < 5) setPhase("surcharging");
        else setPhase("flooding");
        return next;
      });
    }, 100);
  }, [cleanup]);

  const manholeXPositions = [80, 180, 280];
  const groundY = 100;
  const pipeY = 160;
  const pipeH = 20;

  const fillProgress = Math.min(1, elapsed / 3);
  const surchargeProgress = phase === "surcharging" || phase === "flooding" ? Math.min(1, (elapsed - 3) / 2) : 0;
  const floodProgress = phase === "flooding" ? Math.min(1, (elapsed - 5) / 3) : 0;

  const gridCells = [];
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 9; col++) {
      gridCells.push({ x: 50 + col * 30, y: groundY - 60 + row * 20, row, col });
    }
  }

  const getCellDepth = (cell: { x: number; y: number; col: number; row: number }) => {
    if (floodProgress <= 0) return 0;
    let maxDepth = 0;
    for (const mx of manholeXPositions) {
      const dist = Math.abs(cell.x + 15 - mx) / 100;
      const depth = Math.max(0, floodProgress * (1 - dist * 0.8));
      maxDepth = Math.max(maxDepth, depth);
    }
    return maxDepth;
  };

  return (
    <Card data-testid="card-1d2d-coupling">
      <CardHeader>
        <CardTitle className="text-lg">1D-2D Coupling Comparison</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <Button
            onClick={startAnimation}
            variant="outline"
            data-testid="button-play-reset"
          >
            {phase === "idle" ? "Play" : "Reset"}
          </Button>
          <Badge variant="outline" data-testid="badge-phase">
            {phase === "idle" ? "Ready" : phase === "filling" ? "Filling Pipes" : phase === "surcharging" ? "Surcharging" : "Flooding"}
          </Badge>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="text-sm font-semibold text-blue-600 text-center">SWMM5 — No surface routing</div>
            <svg viewBox="0 0 360 220" className="w-full border rounded bg-muted/20" data-testid="svg-swmm-1d2d">
              <line x1="30" y1={groundY} x2="330" y2={groundY} stroke="#94a3b8" strokeWidth="1" strokeDasharray="4,2" />
              <text x="335" y={groundY + 4} fontSize="8" fill="#94a3b8">Ground</text>
              {[0, 1].map((i) => {
                const x1 = manholeXPositions[i] + 10;
                const x2 = manholeXPositions[i + 1] - 10;
                return (
                  <g key={`pipe-${i}`}>
                    <rect x={x1} y={pipeY} width={x2 - x1} height={pipeH} fill="none" stroke="#94a3b8" strokeWidth="2" />
                    {fillProgress > 0 && (
                      <rect
                        x={x1}
                        y={pipeY + pipeH - fillProgress * pipeH}
                        width={(x2 - x1) * Math.min(1, fillProgress * (i === 0 ? 1.5 : 1))}
                        height={fillProgress * pipeH}
                        fill="rgba(59,130,246,0.5)"
                      />
                    )}
                  </g>
                );
              })}
              {manholeXPositions.map((x, i) => {
                const shaftTop = groundY;
                const shaftBot = pipeY + pipeH;
                const waterHeight = surchargeProgress * (shaftBot - shaftTop);
                return (
                  <g key={`mh-${i}`}>
                    <rect x={x - 10} y={shaftTop} width={20} height={shaftBot - shaftTop} fill="none" stroke="#94a3b8" strokeWidth="2" />
                    {surchargeProgress > 0 && (
                      <rect
                        x={x - 9}
                        y={shaftBot - waterHeight}
                        width={18}
                        height={waterHeight}
                        fill="rgba(59,130,246,0.5)"
                      />
                    )}
                    {floodProgress > 0 && (
                      <circle
                        cx={x}
                        cy={groundY - 10 - floodProgress * 20}
                        r={8 + floodProgress * 15}
                        fill="rgba(59,130,246,0.3)"
                        stroke="rgba(59,130,246,0.5)"
                        strokeWidth="1"
                      />
                    )}
                    <text x={x} y={shaftBot + 15} textAnchor="middle" fontSize="8" fill="#64748b">MH{i + 1}</text>
                  </g>
                );
              })}
              {floodProgress > 0 && (
                <text x="180" y="30" textAnchor="middle" fontSize="9" fill="#ef4444">
                  Simple ponding — no flow between pools
                </text>
              )}
            </svg>
          </div>
          <div className="space-y-2">
            <div className="text-sm font-semibold text-emerald-600 text-center">ICM — 2D shallow water equations</div>
            <svg viewBox="0 0 360 220" className="w-full border rounded bg-muted/20" data-testid="svg-icm-1d2d">
              <line x1="30" y1={groundY} x2="330" y2={groundY} stroke="#94a3b8" strokeWidth="1" strokeDasharray="4,2" />
              <text x="335" y={groundY + 4} fontSize="8" fill="#94a3b8">Ground</text>
              {floodProgress > 0 && gridCells.map((cell, idx) => {
                const depth = getCellDepth(cell);
                if (depth <= 0) return null;
                const opacity = 0.15 + depth * 0.6;
                const blue = Math.round(150 + depth * 105);
                return (
                  <rect
                    key={`cell-${idx}`}
                    x={cell.x}
                    y={cell.y}
                    width={28}
                    height={18}
                    fill={`rgba(59,${blue},246,${opacity})`}
                    stroke="rgba(59,130,246,0.3)"
                    strokeWidth="0.5"
                    rx="1"
                  />
                );
              })}
              {floodProgress > 0 && (
                <g>
                  {gridCells.filter((_, i) => i % 3 === 0).map((cell, idx) => (
                    <rect
                      key={`grid-${idx}`}
                      x={cell.x}
                      y={cell.y}
                      width={28}
                      height={18}
                      fill="none"
                      stroke="rgba(16,185,129,0.3)"
                      strokeWidth="0.5"
                      strokeDasharray="2,2"
                    />
                  ))}
                </g>
              )}
              {[0, 1].map((i) => {
                const x1 = manholeXPositions[i] + 10;
                const x2 = manholeXPositions[i + 1] - 10;
                return (
                  <g key={`pipe-${i}`}>
                    <rect x={x1} y={pipeY} width={x2 - x1} height={pipeH} fill="none" stroke="#94a3b8" strokeWidth="2" />
                    {fillProgress > 0 && (
                      <rect
                        x={x1}
                        y={pipeY + pipeH - fillProgress * pipeH}
                        width={(x2 - x1) * Math.min(1, fillProgress * (i === 0 ? 1.5 : 1))}
                        height={fillProgress * pipeH}
                        fill="rgba(59,130,246,0.5)"
                      />
                    )}
                  </g>
                );
              })}
              {manholeXPositions.map((x, i) => {
                const shaftTop = groundY;
                const shaftBot = pipeY + pipeH;
                const waterHeight = surchargeProgress * (shaftBot - shaftTop);
                return (
                  <g key={`mh-${i}`}>
                    <rect x={x - 10} y={shaftTop} width={20} height={shaftBot - shaftTop} fill="none" stroke="#94a3b8" strokeWidth="2" />
                    {surchargeProgress > 0 && (
                      <rect
                        x={x - 9}
                        y={shaftBot - waterHeight}
                        width={18}
                        height={waterHeight}
                        fill="rgba(59,130,246,0.5)"
                      />
                    )}
                    <text x={x} y={shaftBot + 15} textAnchor="middle" fontSize="8" fill="#64748b">MH{i + 1}</text>
                  </g>
                );
              })}
              {floodProgress > 0 && (
                <text x="180" y="30" textAnchor="middle" fontSize="9" fill="#10b981">
                  Water flows between cells via 2D mesh
                </text>
              )}
            </svg>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function ManholeStorageVolume() {
  const [waterDepth, setWaterDepth] = useState([0]);
  const depth = waterDepth[0];

  const groundLevel = 4;
  const swmmDiameter = 1.2;
  const swmmRadius = swmmDiameter / 2;

  const swmmVolume = (() => {
    const belowGround = Math.min(depth, groundLevel);
    let vol = Math.PI * swmmRadius * swmmRadius * belowGround;
    if (depth > groundLevel) {
      const excess = depth - groundLevel;
      const pondedRadius = swmmRadius * 2;
      vol += Math.PI * pondedRadius * pondedRadius * excess;
    }
    return vol;
  })();

  const icmVolume = (() => {
    const steps = 100;
    const h = Math.min(depth, 6) / steps;
    let vol = 0;
    for (let i = 0; i < steps; i++) {
      const d1 = i * h;
      const d2 = (i + 1) * h;
      const r1 = swmmRadius * (1 - 0.15 * (d1 / 6));
      const r2 = swmmRadius * (1 - 0.15 * (d2 / 6));
      const a1 = Math.PI * r1 * r1;
      const a2 = Math.PI * r2 * r2;
      vol += ((a1 + a2) / 2) * h;
    }
    return vol;
  })();

  const pctDiff = swmmVolume > 0 ? ((swmmVolume - icmVolume) / icmVolume * 100) : 0;
  const isFlooded = depth > groundLevel;

  const svgH = 280;
  const svgW = 180;
  const groundYpx = 80;
  const invertYpx = 240;
  const shaftWidth = 50;
  const scale = (invertYpx - groundYpx) / groundLevel;

  const depthToY = (d: number) => invertYpx - d * scale;

  return (
    <Card data-testid="card-manhole-storage">
      <CardHeader>
        <CardTitle className="text-lg">Manhole Storage Volume Comparison</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Water Depth: {depth.toFixed(1)} m</label>
            <span className="text-xs text-muted-foreground">Ground at 4m</span>
          </div>
          <Slider
            value={waterDepth}
            onValueChange={setWaterDepth}
            min={0}
            max={6}
            step={0.1}
            data-testid="slider-water-depth"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="text-sm font-semibold text-blue-600 text-center">SWMM5 — Uniform Shaft</div>
            <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full border rounded bg-muted/20" data-testid="svg-swmm-storage">
              <rect
                x={(svgW - shaftWidth) / 2}
                y={groundYpx}
                width={shaftWidth}
                height={invertYpx - groundYpx}
                fill="none"
                stroke="#94a3b8"
                strokeWidth="2"
              />
              {depth > 0 && (
                <rect
                  x={(svgW - shaftWidth) / 2 + 1}
                  y={Math.max(groundYpx, depthToY(Math.min(depth, groundLevel)))}
                  width={shaftWidth - 2}
                  height={invertYpx - Math.max(groundYpx, depthToY(Math.min(depth, groundLevel)))}
                  fill="rgba(59,130,246,0.5)"
                />
              )}
              {isFlooded && (
                <g>
                  <rect
                    x={(svgW - shaftWidth * 2.5) / 2}
                    y={groundYpx - (depth - groundLevel) * scale}
                    width={shaftWidth * 2.5}
                    height={(depth - groundLevel) * scale}
                    fill="rgba(147,197,253,0.4)"
                    stroke="rgba(59,130,246,0.3)"
                    strokeWidth="1"
                    rx="4"
                  />
                  <text
                    x={svgW / 2}
                    y={groundYpx - (depth - groundLevel) * scale - 5}
                    textAnchor="middle"
                    fontSize="8"
                    fill="#ef4444"
                  >
                    Ponded Area
                  </text>
                </g>
              )}
              <line x1="10" y1={groundYpx} x2={svgW - 10} y2={groundYpx} stroke="#22c55e" strokeWidth="1.5" strokeDasharray="4,2" />
              <text x={svgW - 8} y={groundYpx - 3} fontSize="8" fill="#22c55e" textAnchor="end">GL (4m)</text>
              <text x={svgW / 2} y={invertYpx + 15} textAnchor="middle" fontSize="8" fill="#64748b">
                Ø {swmmDiameter}m uniform
              </text>
            </svg>
            <div className="text-center p-2 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800">
              <div className="text-xs text-muted-foreground">Volume</div>
              <div className="text-lg font-bold text-blue-600" data-testid="text-swmm-volume">
                {swmmVolume.toFixed(3)} m³
              </div>
              {isFlooded && (
                <Badge variant="destructive" className="mt-1 text-[10px]" data-testid="badge-swmm-flood">
                  Flooding
                </Badge>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-sm font-semibold text-emerald-600 text-center">ICM — Tapered Shaft</div>
            <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full border rounded bg-muted/20" data-testid="svg-icm-storage">
              <polygon
                points={`
                  ${(svgW - shaftWidth) / 2},${groundYpx}
                  ${(svgW - shaftWidth * 0.7) / 2},${invertYpx}
                  ${(svgW + shaftWidth * 0.7) / 2},${invertYpx}
                  ${(svgW + shaftWidth) / 2},${groundYpx}
                `}
                fill="none"
                stroke="#94a3b8"
                strokeWidth="2"
              />
              {depth > 0 && (() => {
                const clampedD = Math.min(depth, groundLevel);
                const topY = depthToY(clampedD);
                const topFraction = clampedD / groundLevel;
                const topWidthFactor = 1 - 0.15 * (1 - topFraction);
                const topHalfW = (shaftWidth / 2) * topWidthFactor + (shaftWidth * 0.7 / 2) * (1 - topWidthFactor);
                const botHalfW = shaftWidth * 0.7 / 2;
                return (
                  <polygon
                    points={`
                      ${svgW / 2 - topHalfW + 1},${topY}
                      ${svgW / 2 - botHalfW + 1},${invertYpx}
                      ${svgW / 2 + botHalfW - 1},${invertYpx}
                      ${svgW / 2 + topHalfW - 1},${topY}
                    `}
                    fill="rgba(59,130,246,0.5)"
                  />
                );
              })()}
              <line x1="10" y1={groundYpx} x2={svgW - 10} y2={groundYpx} stroke="#22c55e" strokeWidth="1.5" strokeDasharray="4,2" />
              <text x={svgW - 8} y={groundYpx - 3} fontSize="8" fill="#22c55e" textAnchor="end">GL (4m)</text>
              <text x={svgW / 2} y={invertYpx + 15} textAnchor="middle" fontSize="8" fill="#64748b">
                Tapered (depth-area table)
              </text>
            </svg>
            <div className="text-center p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded border border-emerald-200 dark:border-emerald-800">
              <div className="text-xs text-muted-foreground">Volume</div>
              <div className="text-lg font-bold text-emerald-600" data-testid="text-icm-volume">
                {icmVolume.toFixed(3)} m³
              </div>
              {isFlooded && (
                <Badge variant="destructive" className="mt-1 text-[10px]" data-testid="badge-icm-flood">
                  Flooding
                </Badge>
              )}
            </div>
          </div>
        </div>
        <div className="text-center p-2 bg-muted/50 rounded-lg border">
          <div className="text-xs text-muted-foreground">Volume Difference</div>
          <div className="text-lg font-bold" data-testid="text-volume-diff">
            {depth > 0 ? `${pctDiff.toFixed(1)}%` : "—"}
          </div>
          <div className="text-[10px] text-muted-foreground">
            SWMM5 linear (π·r²·h) vs ICM trapezoidal integration
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

type FloodType = "lost" | "ponded" | "stored" | "2d";

export function FloodTypeComparison() {
  const [floodType, setFloodType] = useState<FloodType>("lost");
  const [waterDepth, setWaterDepth] = useState([0]);
  const depth = waterDepth[0];

  const groundLevel = 4;
  const svgH = 300;
  const svgW = 300;
  const groundYpx = 100;
  const invertYpx = 250;
  const shaftWidth = 50;
  const scale = (invertYpx - groundYpx) / groundLevel;
  const isAboveGround = depth > groundLevel;
  const excessDepth = Math.max(0, depth - groundLevel);

  const tabs: { key: FloodType; label: string }[] = [
    { key: "lost", label: "Lost" },
    { key: "ponded", label: "Ponded (SWMM5)" },
    { key: "stored", label: "Stored (ICM)" },
    { key: "2d", label: "2D (ICM)" },
  ];

  const renderShaftWater = () => {
    if (depth <= 0) return null;
    const clampedD = Math.min(depth, groundLevel);
    const topY = invertYpx - clampedD * scale;
    return (
      <rect
        x={(svgW - shaftWidth) / 2 + 1}
        y={topY}
        width={shaftWidth - 2}
        height={invertYpx - topY}
        fill="rgba(59,130,246,0.5)"
      />
    );
  };

  const renderShaft = () => (
    <g>
      <rect
        x={(svgW - shaftWidth) / 2}
        y={groundYpx}
        width={shaftWidth}
        height={invertYpx - groundYpx}
        fill="none"
        stroke="#94a3b8"
        strokeWidth="2"
      />
      <line x1="20" y1={groundYpx} x2={svgW - 20} y2={groundYpx} stroke="#22c55e" strokeWidth="1.5" strokeDasharray="4,2" />
      <text x={svgW - 18} y={groundYpx - 4} fontSize="9" fill="#22c55e" textAnchor="end">Ground (4m)</text>
      <line x1="20" y1={invertYpx} x2={svgW - 20} y2={invertYpx} stroke="#94a3b8" strokeWidth="1" />
      <text x={svgW - 18} y={invertYpx - 4} fontSize="8" fill="#94a3b8" textAnchor="end">Invert</text>
    </g>
  );

  const renderLost = () => (
    <g>
      {renderShaft()}
      {renderShaftWater()}
      {isAboveGround && (
        <g>
          <motion.g
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <text x={svgW / 2} y={groundYpx - 25} textAnchor="middle" fontSize="20" fill="#ef4444">
              ✕
            </text>
            <text x={svgW / 2} y={groundYpx - 40} textAnchor="middle" fontSize="9" fill="#ef4444">
              Excess water lost!
            </text>
          </motion.g>
          <text x={svgW / 2} y={30} textAnchor="middle" fontSize="8" fill="#64748b">
            Depth capped at ground level
          </text>
        </g>
      )}
    </g>
  );

  const renderPonded = () => (
    <g>
      {renderShaft()}
      {renderShaftWater()}
      {isAboveGround && (
        <g>
          <rect
            x={(svgW - shaftWidth * 3) / 2}
            y={groundYpx - excessDepth * scale * 0.5}
            width={shaftWidth * 3}
            height={excessDepth * scale * 0.5}
            fill="rgba(147,197,253,0.4)"
            stroke="rgba(59,130,246,0.3)"
            strokeWidth="1"
            rx="4"
          />
          <text x={svgW / 2} y={groundYpx - excessDepth * scale * 0.5 - 5} textAnchor="middle" fontSize="8" fill="#3b82f6">
            Ponded area (Apond)
          </text>
          <text x={svgW / 2} y={30} textAnchor="middle" fontSize="8" fill="#64748b">
            SWMM5: Flat ponding reservoir
          </text>
        </g>
      )}
    </g>
  );

  const renderStored = () => (
    <g>
      {renderShaft()}
      {renderShaftWater()}
      {isAboveGround && (
        <g>
          <rect
            x={(svgW - shaftWidth * 2.5) / 2}
            y={groundYpx - excessDepth * scale * 0.5}
            width={shaftWidth * 2.5}
            height={excessDepth * scale * 0.5}
            fill="rgba(147,197,253,0.35)"
            stroke="rgba(16,185,129,0.4)"
            strokeWidth="1"
            rx="4"
          />
          <text x={svgW / 2} y={groundYpx - excessDepth * scale * 0.5 - 5} textAnchor="middle" fontSize="8" fill="#10b981">
            Stored volume (flood_depth)
          </text>
          <text x={svgW / 2} y={30} textAnchor="middle" fontSize="8" fill="#64748b">
            ICM: Uses flood_type = stored
          </text>
        </g>
      )}
    </g>
  );

  const render2D = () => {
    const meshCols = 7;
    const meshRows = 2;
    const cellW = 28;
    const cellH = 16;
    const meshStartX = (svgW - meshCols * cellW) / 2;
    const meshStartY = groundYpx - meshRows * cellH - 10;

    return (
      <g>
        {renderShaft()}
        {renderShaftWater()}
        {isAboveGround && (
          <g>
            {Array.from({ length: meshRows }).map((_, row) =>
              Array.from({ length: meshCols }).map((_, col) => {
                const cx = meshStartX + col * cellW + cellW / 2;
                const distFromCenter = Math.abs(cx - svgW / 2) / (svgW / 2);
                const cellDepth = Math.max(0, excessDepth * (1 - distFromCenter * 0.8));
                const opacity = 0.1 + (cellDepth / 3) * 0.6;
                return (
                  <rect
                    key={`mesh-${row}-${col}`}
                    x={meshStartX + col * cellW}
                    y={meshStartY + row * cellH}
                    width={cellW - 1}
                    height={cellH - 1}
                    fill={`rgba(59,130,246,${opacity})`}
                    stroke="rgba(59,130,246,0.3)"
                    strokeWidth="0.5"
                    rx="1"
                  />
                );
              })
            )}
            <text x={svgW / 2} y={meshStartY - 5} textAnchor="middle" fontSize="8" fill="#3b82f6">
              2D mesh — depth varies by cell
            </text>
            <text x={svgW / 2} y={30} textAnchor="middle" fontSize="8" fill="#64748b">
              ICM: 2D shallow water equations on surface
            </text>
          </g>
        )}
      </g>
    );
  };

  const renderers: Record<FloodType, () => React.JSX.Element> = {
    lost: renderLost,
    ponded: renderPonded,
    stored: renderStored,
    "2d": render2D,
  };

  return (
    <Card data-testid="card-flood-type">
      <CardHeader>
        <CardTitle className="text-lg">Flood Type Comparison</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <Button
              key={tab.key}
              variant={floodType === tab.key ? "default" : "outline"}
              size="sm"
              onClick={() => setFloodType(tab.key)}
              data-testid={`button-flood-${tab.key}`}
            >
              {tab.label}
            </Button>
          ))}
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Water Depth: {depth.toFixed(1)} m</label>
            <span className="text-xs text-muted-foreground">Ground at 4m</span>
          </div>
          <Slider
            value={waterDepth}
            onValueChange={setWaterDepth}
            min={0}
            max={7}
            step={0.1}
            data-testid="slider-flood-depth"
          />
        </div>
        <div className="flex justify-center">
          <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full max-w-md border rounded bg-muted/20" data-testid="svg-flood-type">
            <AnimatePresence mode="wait">
              <motion.g
                key={floodType}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {renderers[floodType]()}
              </motion.g>
            </AnimatePresence>
            <text x={svgW / 2} y={svgH - 10} textAnchor="middle" fontSize="9" fill="#64748b">
              Depth: {depth.toFixed(1)}m | {isAboveGround ? `Excess: ${excessDepth.toFixed(1)}m` : "Below ground"}
            </text>
          </svg>
        </div>
        {isAboveGround && floodType === "lost" && (
          <div className="flex justify-center">
            <Badge variant="destructive" data-testid="badge-mass-balance-error">
              Mass balance error
            </Badge>
          </div>
        )}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2 rounded bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
            <div className="font-semibold text-blue-700 dark:text-blue-300">SWMM5</div>
            <div className="text-muted-foreground">Lost or Ponded modes. No 2D capability.</div>
          </div>
          <div className="p-2 rounded bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
            <div className="font-semibold text-emerald-700 dark:text-emerald-300">ICM</div>
            <div className="text-muted-foreground">Stored, 2D mesh, or sealed modes available.</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
