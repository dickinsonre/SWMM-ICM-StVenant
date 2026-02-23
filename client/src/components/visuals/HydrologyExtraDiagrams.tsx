import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function LIDLayerStackAnimation() {
  const [rainIntensity, setRainIntensity] = useState([1]);
  const [animOffset, setAnimOffset] = useState(0);
  const [elapsed, setElapsed] = useState(0);

  const rain = rainIntensity[0];

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimOffset((prev) => (prev + 2) % 400);
      setElapsed((prev) => prev + 0.05);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const surfaceCapacity = 6;
  const soilThickness = 18;
  const soilConductivity = 0.5;
  const storageThickness = 12;
  const storageVoidRatio = 0.75;
  const drainOffset = 6;
  const drainCoeff = 0.5;

  const infiltRate = Math.min(rain, soilConductivity);
  const excessRain = Math.max(0, rain - infiltRate);

  const surfaceMoisture = rain > 0 ? Math.min(1, (elapsed * excessRain) / surfaceCapacity) : Math.max(0, 1 - elapsed * 0.1);
  const soilMoisture = rain > 0 ? Math.min(1, elapsed * infiltRate / (soilThickness * 0.5) * 0.3) : Math.max(0, 0.3 - elapsed * 0.02);
  const storageFill = rain > 0 ? Math.min(1, elapsed * infiltRate / (storageThickness * storageVoidRatio) * 0.15) : Math.max(0, 0.5 - elapsed * 0.05);

  const storageDepth = storageFill * storageThickness;
  const drainActive = storageDepth > drainOffset;
  const drainFlow = drainActive ? drainCoeff * Math.sqrt(storageDepth - drainOffset) : 0;
  const isOverflow = surfaceMoisture >= 0.95 && rain > soilConductivity;

  const phase = isOverflow ? "Overflow" : drainActive ? "Draining" : rain > 0 ? "Filling" : "Idle";

  const surfaceY = 30;
  const surfaceH = 45;
  const soilY = surfaceY + surfaceH;
  const soilH = 70;
  const storageY = soilY + soilH;
  const storageH = 55;
  const drainY = storageY + storageH;
  const drainH = 30;
  const layerX = 60;
  const layerW = 280;

  const soilR = Math.round(180 - soilMoisture * 80);
  const soilG = Math.round(160 - soilMoisture * 60);
  const soilB = Math.round(120 - soilMoisture * 40);
  const soilColor = `rgb(${soilR},${soilG},${soilB})`;

  const rainDrops = [];
  if (rain > 0) {
    const count = Math.floor(rain * 5) + 2;
    for (let i = 0; i < count; i++) {
      const x = layerX + 10 + ((animOffset * 3 + i * 47) % (layerW - 20));
      const y = ((animOffset * 4 + i * 31) % (surfaceY + 10));
      rainDrops.push({ x, y, key: `rain-${i}` });
    }
  }

  const infiltDrops = [];
  if (rain > 0 && infiltRate > 0) {
    for (let i = 0; i < 4; i++) {
      const x = layerX + 40 + i * 60;
      const progress = ((animOffset * 2 + i * 25) % 100) / 100;
      const y = soilY + progress * soilH;
      infiltDrops.push({ x, y, key: `infilt-${i}` });
    }
  }

  return (
    <Card data-testid="card-lid-layer-stack">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">SWMM5 Bio-Retention Cell — LID Layer Stack</CardTitle>
          <Badge data-testid="badge-lid-layers">LID Layers</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium" data-testid="label-rain-intensity-lid">Rain Intensity: {rain.toFixed(1)} in/hr</label>
            <Badge variant={phase === "Overflow" ? "destructive" : phase === "Draining" ? "default" : "outline"} data-testid="badge-lid-phase">
              {phase}
            </Badge>
          </div>
          <Slider value={rainIntensity} onValueChange={setRainIntensity} min={0} max={4} step={0.1} data-testid="slider-rain-intensity-lid" />
        </div>

        <svg viewBox="0 0 400 280" className="w-full border rounded bg-muted/20" data-testid="svg-lid-layer-stack">
          <text x="200" y="15" textAnchor="middle" fontSize="9" fill="#64748b" fontWeight="bold">
            Bio-Retention Cell Cross-Section
          </text>

          {rainDrops.map((d) => (
            <line key={d.key} x1={d.x} y1={d.y} x2={d.x - 1} y2={d.y + 6} stroke="#3b82f6" strokeWidth="1.5" opacity="0.7" />
          ))}

          <rect x={layerX} y={surfaceY} width={layerW} height={surfaceH} fill="#90c695" stroke="#4a7c4f" strokeWidth="1.5" rx="2" />
          {[0, 1, 2, 3, 4].map((i) => {
            const vx = layerX + 30 + i * 55;
            return (
              <g key={`veg-${i}`}>
                <line x1={vx} y1={surfaceY + surfaceH} x2={vx} y2={surfaceY + surfaceH - 20} stroke="#2d6a2e" strokeWidth="1.5" />
                <circle cx={vx} cy={surfaceY + surfaceH - 22} r="6" fill="#4caf50" opacity="0.8" />
              </g>
            );
          })}
          {surfaceMoisture > 0.1 && (
            <rect
              x={layerX + 1}
              y={surfaceY + surfaceH - surfaceMoisture * 15}
              width={layerW - 2}
              height={surfaceMoisture * 15}
              fill="rgba(59,130,246,0.35)"
              rx="1"
            />
          )}
          <text x={layerX + layerW + 5} y={surfaceY + 15} fontSize="7" fill="#4a7c4f">Surface Layer</text>
          <text x={layerX + layerW + 5} y={surfaceY + 25} fontSize="6" fill="#94a3b8">Berm: 6in, n=0.1</text>
          {isOverflow && (
            <g>
              <line x1={layerX + layerW} y1={surfaceY + 10} x2={layerX + layerW + 30} y2={surfaceY + 20} stroke="#ef4444" strokeWidth="2" />
              <text x={layerX + layerW + 32} y={surfaceY + 38} fontSize="6" fill="#ef4444" fontWeight="bold">Overflow!</text>
            </g>
          )}

          <rect x={layerX} y={soilY} width={layerW} height={soilH} fill={soilColor} stroke="#8B7355" strokeWidth="1.5" />
          {infiltDrops.map((d) => (
            <circle key={d.key} cx={d.x} cy={d.y} r="2" fill="#3b82f6" opacity="0.6" />
          ))}
          <text x={layerX + layerW + 5} y={soilY + 15} fontSize="7" fill="#8B7355">Soil Layer</text>
          <text x={layerX + layerW + 5} y={soilY + 25} fontSize="6" fill="#94a3b8">18in, φ=0.5</text>
          <text x={layerX + layerW + 5} y={soilY + 35} fontSize="6" fill="#94a3b8">K=0.5 in/hr</text>

          <rect x={layerX} y={storageY} width={layerW} height={storageH} fill="#d4c5a9" stroke="#a0926b" strokeWidth="1.5" />
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) =>
            [0, 1, 2].map((j) => (
              <circle
                key={`gravel-${i}-${j}`}
                cx={layerX + 15 + i * 35}
                cy={storageY + 12 + j * 16}
                r="5"
                fill="#b8a88a"
                stroke="#a0926b"
                strokeWidth="0.5"
              />
            ))
          )}
          {storageFill > 0 && (
            <rect
              x={layerX + 1}
              y={storageY + storageH - storageFill * storageH}
              width={layerW - 2}
              height={storageFill * storageH}
              fill="rgba(59,130,246,0.4)"
            />
          )}
          <text x={layerX + layerW + 5} y={storageY + 15} fontSize="7" fill="#a0926b">Storage Layer</text>
          <text x={layerX + layerW + 5} y={storageY + 25} fontSize="6" fill="#94a3b8">12in, VR=0.75</text>

          <line x1={layerX + 1} y1={storageY + storageH - (drainOffset / storageThickness) * storageH} x2={layerX + layerW - 1} y2={storageY + storageH - (drainOffset / storageThickness) * storageH} stroke="#f97316" strokeWidth="1" strokeDasharray="3,2" />
          <text x={layerX - 3} y={storageY + storageH - (drainOffset / storageThickness) * storageH + 3} fontSize="5" fill="#f97316" textAnchor="end">Drain offset</text>

          <rect x={layerX} y={drainY} width={layerW} height={drainH} fill="#e5e7eb" stroke="#9ca3af" strokeWidth="1.5" rx="3" />
          <ellipse cx={layerX + layerW / 2} cy={drainY + drainH / 2} rx={layerW / 2 - 10} ry="8" fill="none" stroke="#6b7280" strokeWidth="1" strokeDasharray="4,3" />
          {drainActive && (
            <g>
              {[0, 1, 2].map((i) => {
                const dx = layerX + layerW + 5 + ((animOffset + i * 15) % 40);
                return <circle key={`drain-drop-${i}`} cx={dx} cy={drainY + drainH / 2} r="2" fill="#3b82f6" opacity="0.7" />;
              })}
            </g>
          )}
          <text x={layerX + layerW + 5} y={drainY + 12} fontSize="7" fill="#6b7280">Underdrain</text>
          <text x={layerX + layerW + 5} y={drainY + 22} fontSize="6" fill="#94a3b8">C=0.5, offset=6in</text>

          <text x={layerX - 5} y={surfaceY + surfaceH / 2} textAnchor="end" fontSize="6" fill="#64748b">↓ Rain</text>
          <text x={layerX - 5} y={soilY + soilH / 2} textAnchor="end" fontSize="6" fill="#64748b">↓ Infilt.</text>
          <text x={layerX - 5} y={storageY + storageH / 2} textAnchor="end" fontSize="6" fill="#64748b">↓ Perc.</text>
        </svg>

        <div className="grid grid-cols-4 gap-2">
          {[
            { label: "Surface", value: surfaceMoisture, color: "#4caf50" },
            { label: "Soil", value: soilMoisture, color: "#8B7355" },
            { label: "Storage", value: storageFill, color: "#3b82f6" },
            { label: "Drain Q", value: drainFlow / 2, color: "#6b7280" },
          ].map((bar) => (
            <div key={bar.label} className="text-center">
              <div className="text-[10px] text-muted-foreground mb-1">{bar.label}</div>
              <div className="h-16 w-6 mx-auto bg-gray-200 dark:bg-gray-700 rounded overflow-hidden relative">
                <div
                  className="absolute bottom-0 w-full rounded-b transition-all"
                  style={{ height: `${Math.min(100, bar.value * 100)}%`, backgroundColor: bar.color }}
                />
              </div>
              <div className="text-[10px] font-bold mt-1" data-testid={`text-lid-${bar.label.toLowerCase().replace(" ", "-")}`}>
                {(bar.value * 100).toFixed(0)}%
              </div>
            </div>
          ))}
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800 p-3">
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div data-testid="text-lid-infilt-rate">
              <span className="text-muted-foreground">Infiltration:</span>{" "}
              <span className="font-bold">{infiltRate.toFixed(2)} in/hr</span>
            </div>
            <div data-testid="text-lid-drain-flow">
              <span className="text-muted-foreground">Drain Flow:</span>{" "}
              <span className="font-bold">{drainFlow.toFixed(2)} in/hr</span>
            </div>
            <div data-testid="text-lid-excess">
              <span className="text-muted-foreground">Excess Rain:</span>{" "}
              <span className="font-bold">{excessRain.toFixed(2)} in/hr</span>
            </div>
          </div>
        </div>

        <div className="bg-amber-50 dark:bg-amber-900/20 rounded border border-amber-200 dark:border-amber-800 p-3" data-testid="text-lid-icm-note">
          <span className="text-xs font-semibold text-amber-700 dark:text-amber-300">ICM Note: </span>
          <span className="text-xs text-amber-800 dark:text-amber-200">
            LID only in ICM SWMM networks, NOT in native InfoWorks networks
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

export function NonlinearReservoirAnimation() {
  const [rainIntensity, setRainIntensity] = useState([2]);
  const [animOffset, setAnimOffset] = useState(0);
  const [simTime, setSimTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [currentPhase, setCurrentPhase] = useState(1);

  const rain = rainIntensity[0];
  const ds = 0.1;
  const n = 0.015;
  const S = 0.02;
  const W = 200;
  const A = 5 * 43560;
  const evap = 0.01;
  const fInfilt = 0.3;

  const [depth, setDepth] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimOffset((prev) => (prev + 2) % 400);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const startSimulation = useCallback(() => {
    setIsRunning(true);
    setSimTime(0);
    setDepth(0);
    setCurrentPhase(1);
  }, []);

  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      setSimTime((prev) => {
        const next = prev + 0.5;
        if (next >= 60) {
          setIsRunning(false);
          return 60;
        }
        return next;
      });

      setDepth((prevD) => {
        const t = simTime;
        const activeRain = t < 40 ? rain / 12 : 0;
        const Q = prevD > ds ? (W / n) * Math.pow(prevD - ds, 5 / 3) * Math.pow(S, 0.5) / A : 0;
        const dd = (activeRain - evap / 12 - fInfilt / 12 - Q) * 0.5;
        const newD = Math.max(0, prevD + dd);

        if (t < 40) {
          if (newD < ds) setCurrentPhase(1);
          else if (newD < ds * 2) setCurrentPhase(2);
          else setCurrentPhase(3);
        } else {
          setCurrentPhase(4);
        }

        return newD;
      });
    }, 100);
    return () => clearInterval(interval);
  }, [isRunning, rain, simTime, n, S, W, A, ds, evap, fInfilt]);

  const Q = depth > ds ? (W / n) * Math.pow(depth - ds, 5 / 3) * Math.pow(S, 0.5) : 0;
  const Q_cfs = Q;

  const phaseLabels: Record<number, string> = {
    1: "Phase 1: Depression Storage Filling",
    2: "Phase 2: Runoff Begins",
    3: "Phase 3: Steady State",
    4: "Phase 4: Recession",
  };

  const surfaceStartX = 50;
  const surfaceEndX = 350;
  const surfaceStartY = 160;
  const surfaceEndY = 180;

  const depressionPositions = [100, 150, 200, 250, 300];
  const depthPx = Math.min(60, depth * 400);

  const rainDrops = [];
  if (rain > 0 && simTime < 40 && isRunning) {
    const count = Math.floor(rain * 3) + 2;
    for (let i = 0; i < count; i++) {
      const x = surfaceStartX + 10 + ((animOffset * 2 + i * 53) % (surfaceEndX - surfaceStartX - 20));
      const y = ((animOffset * 3 + i * 37) % 80) + 30;
      rainDrops.push({ x, y, key: `rain-${i}` });
    }
  }

  return (
    <Card data-testid="card-nonlinear-reservoir">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Nonlinear Reservoir — Subcatchment Runoff</CardTitle>
          <Badge data-testid="badge-nonlinear-reservoir">Nonlinear Reservoir</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium" data-testid="label-rain-intensity-nlr">Rain Intensity: {rain.toFixed(1)} in/hr</label>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={startSimulation} data-testid="button-run-nlr">
                {isRunning ? "Restart" : "Run"}
              </Button>
              <Badge variant="outline" data-testid="badge-nlr-phase">
                {phaseLabels[currentPhase]}
              </Badge>
            </div>
          </div>
          <Slider value={rainIntensity} onValueChange={setRainIntensity} min={0} max={4} step={0.1} data-testid="slider-rain-intensity-nlr" />
        </div>

        <svg viewBox="0 0 400 280" className="w-full border rounded bg-muted/20" data-testid="svg-nonlinear-reservoir">
          <text x="200" y="15" textAnchor="middle" fontSize="9" fill="#64748b" fontWeight="bold">
            Subcatchment Surface — Nonlinear Reservoir Model
          </text>

          {rainDrops.map((d) => (
            <line key={d.key} x1={d.x} y1={d.y} x2={d.x - 1} y2={d.y + 8} stroke="#3b82f6" strokeWidth="1.5" opacity="0.6" />
          ))}

          <line x1={surfaceStartX} y1={surfaceStartY} x2={surfaceEndX} y2={surfaceEndY} stroke="#8B7355" strokeWidth="3" />

          {depressionPositions.map((x, i) => {
            const localY = surfaceStartY + ((x - surfaceStartX) / (surfaceEndX - surfaceStartX)) * (surfaceEndY - surfaceStartY);
            const dsFillPx = Math.min(6, depth > 0 ? (Math.min(depth, ds) / ds) * 6 : 0);
            return (
              <g key={`dep-${i}`}>
                <path
                  d={`M ${x - 12},${localY} Q ${x},${localY + 8} ${x + 12},${localY}`}
                  fill="#a0926b"
                  stroke="#8B7355"
                  strokeWidth="1"
                />
                {dsFillPx > 0 && (
                  <path
                    d={`M ${x - 10},${localY} Q ${x},${localY + dsFillPx + 2} ${x + 10},${localY}`}
                    fill="rgba(59,130,246,0.5)"
                  />
                )}
              </g>
            );
          })}

          {depthPx > 0 && depth > ds && (
            <polygon
              points={`${surfaceStartX},${surfaceStartY} ${surfaceEndX},${surfaceEndY} ${surfaceEndX},${surfaceEndY - depthPx} ${surfaceStartX},${surfaceStartY - depthPx}`}
              fill="rgba(59,130,246,0.3)"
            />
          )}

          <line x1={surfaceStartX - 15} y1={surfaceStartY} x2={surfaceStartX - 15} y2={surfaceStartY - depthPx} stroke="#3b82f6" strokeWidth="1.5" />
          {depthPx > 5 && (
            <>
              <line x1={surfaceStartX - 20} y1={surfaceStartY} x2={surfaceStartX - 10} y2={surfaceStartY} stroke="#3b82f6" strokeWidth="1" />
              <line x1={surfaceStartX - 20} y1={surfaceStartY - depthPx} x2={surfaceStartX - 10} y2={surfaceStartY - depthPx} stroke="#3b82f6" strokeWidth="1" />
              <text x={surfaceStartX - 25} y={surfaceStartY - depthPx / 2 + 3} textAnchor="end" fontSize="7" fill="#3b82f6">d</text>
            </>
          )}

          <line x1={surfaceStartX} y1={surfaceEndY + 15} x2={surfaceEndX} y2={surfaceEndY + 15} stroke="#64748b" strokeWidth="1" markerEnd="url(#arrow)" />
          <text x={(surfaceStartX + surfaceEndX) / 2} y={surfaceEndY + 28} textAnchor="middle" fontSize="7" fill="#64748b">W = {W} ft</text>

          {Q_cfs > 0 && (
            <g>
              {[0, 1, 2].map((i) => {
                const px = surfaceEndX + 5 + ((animOffset + i * 12) % 35);
                const py = surfaceEndY - 5 + i * 3;
                return <circle key={`qflow-${i}`} cx={px} cy={py} r="2.5" fill="#3b82f6" opacity="0.7" />;
              })}
              <text x={surfaceEndX + 10} y={surfaceEndY - 15} fontSize="7" fill="#3b82f6" fontWeight="bold">Q →</text>
            </g>
          )}

          <text x={200} y={surfaceStartY + 45} textAnchor="middle" fontSize="7" fill="#94a3b8">
            ↓ Infiltration (f) into soil
          </text>
          <rect x={surfaceStartX} y={surfaceEndY + 35} width={surfaceEndX - surfaceStartX} height={25} fill="#c4a97d" stroke="#a0926b" strokeWidth="1" rx="2" />
          <text x={200} y={surfaceEndY + 50} textAnchor="middle" fontSize="7" fill="#6b5b3e">Soil / Pervious Surface</text>

          <text x="25" y={surfaceStartY - depthPx - 10} fontSize="6" fill="#94a3b8">↑ Evap (e)</text>

          <text x={150} y={surfaceStartY + 8} fontSize="6" fill="#8B7355">ds (depression storage)</text>

          <text x="200" y={250} textAnchor="middle" fontSize="7" fill="#64748b">
            S = {(S * 100).toFixed(1)}% slope | n = {n} | ds = {ds} in
          </text>
        </svg>

        <div className="bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800 p-3">
          <div className="text-xs font-semibold mb-2 text-blue-700 dark:text-blue-300" data-testid="text-manning-eq-nlr">
            Q = (W/n) × (d - ds)^(5/3) × S^(1/2)
          </div>
          <div className="text-xs mb-2 text-blue-600 dark:text-blue-400" data-testid="text-mass-balance-nlr">
            d(d)/dt = i - e - f - Q/A
          </div>
          <div className="grid grid-cols-4 gap-2 text-xs">
            <div data-testid="text-nlr-depth">
              <span className="text-muted-foreground">Depth d:</span>{" "}
              <span className="font-bold">{depth.toFixed(4)} in</span>
            </div>
            <div data-testid="text-nlr-ds">
              <span className="text-muted-foreground">ds:</span>{" "}
              <span className="font-bold">{ds} in</span>
            </div>
            <div data-testid="text-nlr-runoff">
              <span className="text-muted-foreground">Runoff Q:</span>{" "}
              <span className="font-bold">{Q_cfs.toFixed(4)} cfs</span>
            </div>
            <div data-testid="text-nlr-infilt">
              <span className="text-muted-foreground">Infiltration:</span>{" "}
              <span className="font-bold">{fInfilt.toFixed(2)} in/hr</span>
            </div>
          </div>
        </div>

        <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded border border-emerald-200 dark:border-emerald-800 p-3" data-testid="text-nlr-solver-note">
          <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">Solver Note: </span>
          <span className="text-xs text-emerald-800 dark:text-emerald-200">
            Both solvers use this model. SWMM5: native. ICM: SWMM Runoff Surface type replicates exactly
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

export function WidthSensitivityAnimation() {
  const [widthVal, setWidthVal] = useState([300]);
  const [animOffset, setAnimOffset] = useState(0);

  const width = widthVal[0];
  const area = 5;
  const areaSqFt = area * 43560;
  const flowLength = areaSqFt / width;

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimOffset((prev) => (prev + 1) % 400);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const widthNorm = (width - 50) / (1000 - 50);
  const Tp = 52 - widthNorm * 42;
  const Qp = 1.5 + widthNorm * 12.5;
  const duration = 70 + (1 - widthNorm) * 50;

  const chartX = 50;
  const chartY = 20;
  const chartW = 300;
  const chartH = 120;

  const hydrographPoints: string[] = [];
  const steps = 60;
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * duration;
    const tNorm = t / Tp;
    let q = 0;
    if (tNorm <= 1) {
      q = Qp * Math.pow(tNorm, 2);
    } else {
      q = Qp * Math.exp(-1.5 * (tNorm - 1));
    }
    const px = chartX + (t / duration) * chartW;
    const py = chartY + chartH - (q / 12) * chartH;
    hydrographPoints.push(`${px},${py}`);
  }

  const shapeX = 50;
  const shapeY = 170;
  const shapeMaxW = 200;
  const shapeMaxH = 80;
  const rectW = Math.max(30, (width / 1000) * shapeMaxW);
  const rectH = Math.max(20, ((1 - widthNorm) * 0.8 + 0.2) * shapeMaxH);

  return (
    <Card data-testid="card-width-sensitivity">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Subcatchment Width Sensitivity</CardTitle>
          <Badge data-testid="badge-width-sensitivity">Width Sensitivity</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium" data-testid="label-width-slider">Width: {width} ft</label>
            <span className="text-xs text-muted-foreground">Area fixed at {area} acres</span>
          </div>
          <Slider value={widthVal} onValueChange={setWidthVal} min={50} max={1000} step={10} data-testid="slider-width" />
        </div>

        <svg viewBox="0 0 400 280" className="w-full border rounded bg-muted/20" data-testid="svg-width-sensitivity">
          <text x="200" y="14" textAnchor="middle" fontSize="9" fill="#64748b" fontWeight="bold">
            Hydrograph Response vs. Width
          </text>

          <line x1={chartX} y1={chartY} x2={chartX} y2={chartY + chartH} stroke="#94a3b8" strokeWidth="1" />
          <line x1={chartX} y1={chartY + chartH} x2={chartX + chartW} y2={chartY + chartH} stroke="#94a3b8" strokeWidth="1" />

          {[0, 3, 6, 9, 12].map((q, i) => {
            const y = chartY + chartH - (q / 12) * chartH;
            return (
              <g key={`yaxis-${i}`}>
                <line x1={chartX - 3} y1={y} x2={chartX} y2={y} stroke="#94a3b8" strokeWidth="0.5" />
                <text x={chartX - 5} y={y + 3} textAnchor="end" fontSize="6" fill="#94a3b8">{q}</text>
              </g>
            );
          })}
          <text x={chartX - 20} y={chartY + chartH / 2} textAnchor="middle" fontSize="7" fill="#64748b" transform={`rotate(-90, ${chartX - 20}, ${chartY + chartH / 2})`}>
            Q (cfs)
          </text>

          {[0, 20, 40, 60, 80, 100].map((t, i) => {
            const x = chartX + (t / duration) * chartW;
            if (x > chartX + chartW) return null;
            return (
              <g key={`xaxis-${i}`}>
                <line x1={x} y1={chartY + chartH} x2={x} y2={chartY + chartH + 3} stroke="#94a3b8" strokeWidth="0.5" />
                <text x={x} y={chartY + chartH + 12} textAnchor="middle" fontSize="6" fill="#94a3b8">{t}</text>
              </g>
            );
          })}
          <text x={chartX + chartW / 2} y={chartY + chartH + 22} textAnchor="middle" fontSize="7" fill="#64748b">Time (min)</text>

          <polyline
            points={hydrographPoints.join(" ")}
            fill="none"
            stroke="#3b82f6"
            strokeWidth="2"
          />

          <polygon
            points={`${hydrographPoints.join(" ")} ${chartX + chartW},${chartY + chartH} ${chartX},${chartY + chartH}`}
            fill="rgba(59,130,246,0.15)"
          />

          {(() => {
            const peakIdx = Math.round((Tp / duration) * steps);
            const peakT = (peakIdx / steps) * duration;
            const peakX = chartX + (peakT / duration) * chartW;
            const peakY = chartY + chartH - (Qp / 12) * chartH;
            return (
              <g>
                <line x1={peakX} y1={peakY} x2={peakX} y2={chartY + chartH} stroke="#ef4444" strokeWidth="0.8" strokeDasharray="3,2" />
                <circle cx={peakX} cy={peakY} r="3" fill="#ef4444" />
                <text x={peakX + 5} y={peakY - 5} fontSize="6" fill="#ef4444" fontWeight="bold">
                  Qp={Qp.toFixed(1)} cfs
                </text>
                <text x={peakX} y={chartY + chartH + 22} textAnchor="middle" fontSize="6" fill="#ef4444">
                  Tp={Tp.toFixed(0)} min
                </text>
              </g>
            );
          })()}

          <text x={shapeX + shapeMaxW / 2} y={shapeY - 5} textAnchor="middle" fontSize="8" fill="#64748b" fontWeight="bold">
            Subcatchment Shape
          </text>
          <rect
            x={shapeX + (shapeMaxW - rectW) / 2}
            y={shapeY + (shapeMaxH - rectH) / 2}
            width={rectW}
            height={rectH}
            fill="rgba(34,197,94,0.2)"
            stroke="#22c55e"
            strokeWidth="1.5"
            rx="2"
          />

          <line
            x1={shapeX + (shapeMaxW - rectW) / 2}
            y1={shapeY + shapeMaxH / 2 + rectH / 2 + 8}
            x2={shapeX + (shapeMaxW + rectW) / 2}
            y2={shapeY + shapeMaxH / 2 + rectH / 2 + 8}
            stroke="#22c55e"
            strokeWidth="1"
          />
          <text
            x={shapeX + shapeMaxW / 2}
            y={shapeY + shapeMaxH / 2 + rectH / 2 + 18}
            textAnchor="middle"
            fontSize="6"
            fill="#22c55e"
          >
            W = {width} ft
          </text>

          <line
            x1={shapeX + (shapeMaxW + rectW) / 2 + 8}
            y1={shapeY + (shapeMaxH - rectH) / 2}
            x2={shapeX + (shapeMaxW + rectW) / 2 + 8}
            y2={shapeY + (shapeMaxH + rectH) / 2}
            stroke="#64748b"
            strokeWidth="1"
          />
          <text
            x={shapeX + (shapeMaxW + rectW) / 2 + 15}
            y={shapeY + shapeMaxH / 2 + 3}
            fontSize="6"
            fill="#64748b"
          >
            L = {flowLength.toFixed(0)} ft
          </text>

          <rect x={275} y={shapeY} width={115} height={75} fill="rgba(59,130,246,0.05)" stroke="#94a3b8" strokeWidth="0.5" rx="3" />
          <text x={332} y={shapeY + 14} textAnchor="middle" fontSize="7" fill="#64748b" fontWeight="bold">Results</text>
          <text x={280} y={shapeY + 28} fontSize="7" fill="#64748b" data-testid="text-peak-q">
            Peak Q: <tspan fontWeight="bold" fill="#3b82f6">{Qp.toFixed(1)} cfs</tspan>
          </text>
          <text x={280} y={shapeY + 40} fontSize="7" fill="#64748b" data-testid="text-time-to-peak">
            Time to Peak: <tspan fontWeight="bold" fill="#ef4444">{Tp.toFixed(0)} min</tspan>
          </text>
          <text x={280} y={shapeY + 52} fontSize="7" fill="#64748b" data-testid="text-flow-length">
            Flow Length: <tspan fontWeight="bold">{flowLength.toFixed(0)} ft</tspan>
          </text>
          <text x={280} y={shapeY + 64} fontSize="7" fill="#64748b" data-testid="text-width-val">
            Width: <tspan fontWeight="bold">{width} ft</tspan>
          </text>
        </svg>

        <div className="bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800 p-3" data-testid="text-width-rule-of-thumb">
          <span className="text-xs font-semibold text-blue-700 dark:text-blue-300">Rule of Thumb: </span>
          <span className="text-xs text-blue-800 dark:text-blue-200">
            Width ≈ Area / Length of longest overland flow path
          </span>
        </div>

        <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded border border-emerald-200 dark:border-emerald-800 p-3" data-testid="text-width-solver-note">
          <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">Solver Comparison: </span>
          <span className="text-xs text-emerald-800 dark:text-emerald-200">
            Same parameter, same effect in both solvers
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
