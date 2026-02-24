import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useUnits } from "@/contexts/UnitsContext";

type MethodFilter = "all" | "steady" | "kinwave" | "dynwave";

export function RoutingMethodComparison() {
  const [methodFilter, setMethodFilter] = useState<MethodFilter>("all");
  const [stormIntensity, setStormIntensity] = useState([3]);
  const [animOffset, setAnimOffset] = useState(0);

  const intensity = stormIntensity[0];

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimOffset((prev) => (prev + 1) % 200);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const generateInflowCurve = useCallback((peak: number) => {
    const points: { x: number; y: number }[] = [];
    for (let i = 0; i <= 40; i++) {
      const t = i / 40;
      const x = 50 + t * 300;
      let y: number;
      if (t < 0.3) {
        y = 240 - (t / 0.3) * peak * 30;
      } else if (t < 0.7) {
        y = 240 - peak * 30 * (1 - (t - 0.3) / 0.4);
      } else {
        y = 240;
      }
      points.push({ x, y });
    }
    return points;
  }, []);

  const generateSteadyCurve = useCallback((peak: number) => {
    const points: { x: number; y: number }[] = [];
    for (let i = 0; i <= 40; i++) {
      const t = i / 40;
      const x = 50 + t * 300;
      let y: number;
      if (t < 0.3) {
        y = 240 - (t / 0.3) * peak * 30;
      } else if (t < 0.7) {
        y = 240 - peak * 30 * (1 - (t - 0.3) / 0.4);
      } else {
        y = 240;
      }
      points.push({ x, y });
    }
    return points;
  }, []);

  const generateKinwaveCurve = useCallback((peak: number) => {
    const points: { x: number; y: number }[] = [];
    const peakAtten = 0.85;
    const delay = 0.066;
    for (let i = 0; i <= 40; i++) {
      const t = i / 40;
      const td = Math.max(0, t - delay);
      const x = 50 + t * 300;
      let y: number;
      if (td < 0.35) {
        y = 240 - (td / 0.35) * peak * 30 * peakAtten;
      } else if (td < 0.75) {
        const decay = 1 - (td - 0.35) / 0.4;
        y = 240 - peak * 30 * peakAtten * decay;
      } else {
        y = 240;
      }
      points.push({ x, y: Math.min(240, y) });
    }
    return points;
  }, []);

  const generateDynwaveCurve = useCallback((peak: number) => {
    const points: { x: number; y: number }[] = [];
    const peakAtten = 0.77;
    const delay = 0.12;
    for (let i = 0; i <= 40; i++) {
      const t = i / 40;
      const td = Math.max(0, t - delay);
      const x = 50 + t * 300;
      let y: number;
      if (td < 0.38) {
        y = 240 - (td / 0.38) * peak * 30 * peakAtten;
      } else if (td < 0.8) {
        const decay = 1 - (td - 0.38) / 0.42;
        const backwater = Math.sin((td - 0.38) * 15) * peak * 2 * Math.max(0, 1 - (td - 0.38) / 0.3);
        y = 240 - peak * 30 * peakAtten * decay + backwater;
      } else if (td < 0.95) {
        const tail = (0.95 - td) / 0.15;
        y = 240 - peak * 3 * tail;
      } else {
        y = 240;
      }
      points.push({ x, y: Math.min(240, Math.max(30, y)) });
    }
    return points;
  }, []);

  const inflowPts = generateInflowCurve(intensity);
  const steadyPts = generateSteadyCurve(intensity);
  const kinwavePts = generateKinwaveCurve(intensity);
  const dynwavePts = generateDynwaveCurve(intensity);

  const toPath = (pts: { x: number; y: number }[]) =>
    pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");

  const showSteady = methodFilter === "all" || methodFilter === "steady";
  const showKin = methodFilter === "all" || methodFilter === "kinwave";
  const showDyn = methodFilter === "all" || methodFilter === "dynwave";

  const peakFlowSteady = (100).toFixed(0);
  const peakFlowKin = (85 * intensity / 3).toFixed(0);
  const peakFlowDyn = (77 * intensity / 3).toFixed(0);
  const ttpSteady = "0:30";
  const ttpKin = "0:37 (+22%)";
  const ttpDyn = "0:42 (+41%)";

  return (
    <Card data-testid="card-routing-method-comparison">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Routing Method Comparison</CardTitle>
          <Badge data-testid="badge-routing-methods">Routing Methods</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <svg viewBox="0 0 400 280" className="w-full border rounded bg-muted/20" data-testid="svg-routing-comparison">
          <text x="200" y="18" textAnchor="middle" fontSize="9" fill="#64748b" fontWeight="bold">
            Same Network, Same Storm — Three Routing Methods
          </text>

          <line x1="50" y1="30" x2="50" y2="245" stroke="#94a3b8" strokeWidth="1" />
          <line x1="50" y1="240" x2="355" y2="240" stroke="#94a3b8" strokeWidth="1" />
          <text x="45" y="35" textAnchor="end" fontSize="7" fill="#94a3b8">Q</text>
          <text x="360" y="244" fontSize="7" fill="#94a3b8">t</text>

          {[0.25, 0.5, 0.75, 1.0].map((frac, i) => (
            <g key={`grid-${i}`}>
              <line
                x1="50" y1={240 - frac * 210}
                x2="355" y2={240 - frac * 210}
                stroke="#e2e8f0" strokeWidth="0.5" strokeDasharray="3,3"
              />
            </g>
          ))}

          <path d={toPath(inflowPts)} fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="4,3" />
          <text x="200" y={240 - intensity * 32} fontSize="7" fill="#94a3b8" textAnchor="middle">Inflow</text>

          {showSteady && (
            <>
              <path d={toPath(steadyPts)} fill="none" stroke="#ef4444" strokeWidth="2" opacity="0.8" />
              {animOffset % 20 < 10 && (
                <circle
                  cx={steadyPts[Math.floor((animOffset / 200) * steadyPts.length) % steadyPts.length].x}
                  cy={steadyPts[Math.floor((animOffset / 200) * steadyPts.length) % steadyPts.length].y}
                  r="3" fill="#ef4444"
                />
              )}
            </>
          )}

          {showKin && (
            <path d={toPath(kinwavePts)} fill="none" stroke="#f97316" strokeWidth="2" opacity="0.8" />
          )}

          {showDyn && (
            <>
              <path d={toPath(dynwavePts)} fill="none" stroke="#3b82f6" strokeWidth="2" opacity="0.8" />
              <path
                d={toPath(dynwavePts)}
                fill="rgba(59,130,246,0.08)"
                stroke="none"
              />
            </>
          )}

          <g transform="translate(260, 30)">
            {showSteady && (
              <g>
                <line x1="0" y1="0" x2="15" y2="0" stroke="#ef4444" strokeWidth="2" />
                <text x="18" y="3" fontSize="7" fill="#ef4444">STEADY</text>
              </g>
            )}
            {showKin && (
              <g transform="translate(0, 12)">
                <line x1="0" y1="0" x2="15" y2="0" stroke="#f97316" strokeWidth="2" />
                <text x="18" y="3" fontSize="7" fill="#f97316">KINWAVE</text>
              </g>
            )}
            {showDyn && (
              <g transform="translate(0, 24)">
                <line x1="0" y1="0" x2="15" y2="0" stroke="#3b82f6" strokeWidth="2" />
                <text x="18" y="3" fontSize="7" fill="#3b82f6">DYNWAVE</text>
              </g>
            )}
          </g>

          <text x="200" y="265" textAnchor="middle" fontSize="7" fill="#64748b">
            Time (minutes) →
          </text>
        </svg>

        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-medium text-muted-foreground">Show:</span>
          {([
            { key: "all", label: "All Three" },
            { key: "steady", label: "Steady Only" },
            { key: "kinwave", label: "KinWave Only" },
            { key: "dynwave", label: "DynWave Only" },
          ] as const).map((opt) => (
            <Button
              key={opt.key}
              variant={methodFilter === opt.key ? "default" : "outline"}
              size="sm"
              onClick={() => setMethodFilter(opt.key)}
              data-testid={`button-method-${opt.key}`}
            >
              {opt.label}
            </Button>
          ))}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium" data-testid="label-storm-intensity">Storm Intensity: {intensity}</label>
            <span className="text-xs text-muted-foreground">1 = light, 5 = extreme</span>
          </div>
          <Slider
            value={stormIntensity}
            onValueChange={setStormIntensity}
            min={1}
            max={5}
            step={1}
            data-testid="slider-storm-intensity"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse" data-testid="table-routing-results">
            <thead>
              <tr className="border-b">
                <th className="text-left p-1.5 text-muted-foreground">Metric</th>
                <th className="text-center p-1.5 text-red-500">STEADY</th>
                <th className="text-center p-1.5 text-orange-500">KINWAVE</th>
                <th className="text-center p-1.5 text-blue-500">DYNWAVE</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="p-1.5 text-muted-foreground">Peak Flow</td>
                <td className="text-center p-1.5 font-bold" data-testid="text-peak-steady">100%</td>
                <td className="text-center p-1.5 font-bold" data-testid="text-peak-kinwave">~85%</td>
                <td className="text-center p-1.5 font-bold" data-testid="text-peak-dynwave">~77%</td>
              </tr>
              <tr className="border-b">
                <td className="p-1.5 text-muted-foreground">Time to Peak</td>
                <td className="text-center p-1.5" data-testid="text-ttp-steady">Same as input</td>
                <td className="text-center p-1.5" data-testid="text-ttp-kinwave">+22%</td>
                <td className="text-center p-1.5" data-testid="text-ttp-dynwave">+41%</td>
              </tr>
              <tr className="border-b">
                <td className="p-1.5 text-muted-foreground">Backwater Effects</td>
                <td className="text-center p-1.5" data-testid="text-bw-steady">No</td>
                <td className="text-center p-1.5" data-testid="text-bw-kinwave">No</td>
                <td className="text-center p-1.5 text-blue-600 font-bold" data-testid="text-bw-dynwave">Yes</td>
              </tr>
              <tr>
                <td className="p-1.5 text-muted-foreground">Reverse Flow</td>
                <td className="text-center p-1.5" data-testid="text-rf-steady">No</td>
                <td className="text-center p-1.5" data-testid="text-rf-kinwave">No</td>
                <td className="text-center p-1.5 text-blue-600 font-bold" data-testid="text-rf-dynwave">Yes</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800 p-3" data-testid="text-icm-note">
          <span className="text-xs font-semibold text-blue-700 dark:text-blue-300">ICM Note: </span>
          <span className="text-xs text-blue-800 dark:text-blue-200">
            ICM ALWAYS uses dynamic wave (full St. Venant). There is no kinematic wave option in ICM. This is a fundamental design philosophy difference.
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

export function TimestepInstabilityAnimation() {
  const [forcedTimestep, setForcedTimestep] = useState([5]);
  const [animOffset, setAnimOffset] = useState(0);

  const dt = forcedTimestep[0];

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimOffset((prev) => (prev + 1) % 200);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const getStabilityStatus = useCallback((timestep: number): { label: string; color: string } => {
    if (timestep <= 10) return { label: "Stable", color: "#22c55e" };
    if (timestep <= 60) return { label: "Marginal", color: "#f97316" };
    return { label: "UNSTABLE", color: "#ef4444" };
  }, []);

  const getCFL = useCallback((timestep: number): number => {
    return Math.min(20, timestep * 0.15);
  }, []);

  const generateHydrograph = useCallback((timestep: number, offset: number) => {
    const points: { x: number; y: number }[] = [];
    const instabilityFactor = Math.max(0, (timestep - 10) / 290);
    const noiseScale = instabilityFactor * instabilityFactor * 80;

    for (let i = 0; i <= 50; i++) {
      const t = i / 50;
      const x = 50 + t * 300;

      let baseY: number;
      if (t < 0.15) {
        baseY = 230 - (t / 0.15) * 160;
      } else if (t < 0.35) {
        baseY = 70;
      } else if (t < 0.8) {
        const decay = (t - 0.35) / 0.45;
        baseY = 70 + decay * 160;
      } else {
        baseY = 230;
      }

      let noise = 0;
      if (instabilityFactor > 0.05) {
        const freq1 = Math.sin(t * 30 + offset * 0.05) * noiseScale * 0.6;
        const freq2 = Math.sin(t * 55 + offset * 0.08) * noiseScale * 0.3;
        const freq3 = Math.sin(t * 90 + offset * 0.12) * noiseScale * 0.15;
        noise = freq1 + freq2 + freq3;

        if (t > 0.35 && t < 0.8) {
          noise *= 1.5;
        }
      }

      const y = Math.max(20, Math.min(250, baseY + noise));
      points.push({ x, y });
    }
    return points;
  }, []);

  const smoothPts = generateHydrograph(5, animOffset);
  const currentPts = generateHydrograph(dt, animOffset);

  const toPath = (pts: { x: number; y: number }[]) =>
    pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");

  const stability = getStabilityStatus(dt);
  const cfl = getCFL(dt);

  const refPts5 = generateHydrograph(5, 0);
  const refPts30 = generateHydrograph(30, 0);
  const refPts120 = generateHydrograph(120, 0);

  return (
    <Card data-testid="card-timestep-instability">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Timestep Instability</CardTitle>
          <Badge data-testid="badge-timestep-stability">Timestep Stability</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <svg viewBox="0 0 400 280" className="w-full border rounded bg-muted/20" data-testid="svg-timestep-instability">
          <text x="200" y="16" textAnchor="middle" fontSize="9" fill="#64748b" fontWeight="bold">
            Same Simulation — Different Forced Timesteps
          </text>

          <line x1="50" y1="20" x2="50" y2="240" stroke="#94a3b8" strokeWidth="1" />
          <line x1="50" y1="235" x2="355" y2="235" stroke="#94a3b8" strokeWidth="1" />
          <text x="45" y="28" textAnchor="end" fontSize="7" fill="#94a3b8">Q</text>
          <text x="360" y="239" fontSize="7" fill="#94a3b8">t</text>

          <line x1="50" y1="235" x2="355" y2="235" stroke="#e2e8f0" strokeWidth="0.5" />

          <path d={toPath(refPts5)} fill="none" stroke="#22c55e" strokeWidth="1.5" opacity="0.5" strokeDasharray="4,2" />
          <path d={toPath(refPts30)} fill="none" stroke="#f97316" strokeWidth="1.5" opacity="0.4" strokeDasharray="3,3" />
          <path d={toPath(refPts120)} fill="none" stroke="#ef4444" strokeWidth="1.5" opacity="0.3" strokeDasharray="2,4" />

          <path d={toPath(currentPts)} fill="none" stroke={stability.color} strokeWidth="2.5" />

          {dt > 60 && currentPts.filter((p) => p.y > 235).length > 0 && (
            <text x="200" y="255" textAnchor="middle" fontSize="8" fill="#ef4444" fontWeight="bold">
              ⚠ Negative flows detected!
            </text>
          )}

          <g transform="translate(260, 25)">
            <line x1="0" y1="0" x2="12" y2="0" stroke="#22c55e" strokeWidth="1.5" strokeDasharray="4,2" />
            <text x="15" y="3" fontSize="6" fill="#22c55e">Δt=5s</text>
            <line x1="0" y1="10" x2="12" y2="10" stroke="#f97316" strokeWidth="1.5" strokeDasharray="3,3" />
            <text x="15" y="13" fontSize="6" fill="#f97316">Δt=30s</text>
            <line x1="0" y1="20" x2="12" y2="20" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="2,4" />
            <text x="15" y="23" fontSize="6" fill="#ef4444">Δt=120s</text>
            <line x1="0" y1="33" x2="12" y2="33" stroke={stability.color} strokeWidth="2.5" />
            <text x="15" y="36" fontSize="6" fill={stability.color} fontWeight="bold">Current</text>
          </g>

          <text x="200" y="272" textAnchor="middle" fontSize="7" fill="#64748b">
            Time →
          </text>
        </svg>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium" data-testid="label-forced-timestep">Forced Timestep: Δt = {dt} sec</label>
            <span className="text-xs text-muted-foreground">1–300 seconds</span>
          </div>
          <Slider
            value={forcedTimestep}
            onValueChange={setForcedTimestep}
            min={1}
            max={300}
            step={1}
            data-testid="slider-forced-timestep"
          />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="text-center p-2 bg-muted/30 rounded border" data-testid="text-current-dt">
            <div className="text-xs text-muted-foreground">Current Δt</div>
            <div className="text-lg font-bold">{dt}s</div>
          </div>
          <div className="text-center p-2 bg-muted/30 rounded border" data-testid="text-stability-status">
            <div className="text-xs text-muted-foreground">Stability</div>
            <div className="text-lg font-bold" style={{ color: stability.color }}>{stability.label}</div>
          </div>
          <div className="text-center p-2 bg-muted/30 rounded border" data-testid="text-cfl-number">
            <div className="text-xs text-muted-foreground">CFL Number</div>
            <div className="text-lg font-bold" style={{ color: cfl > 1 ? "#ef4444" : "#22c55e" }}>{cfl.toFixed(2)}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800 p-3" data-testid="text-swmm-response">
            <div className="text-xs font-semibold text-blue-700 dark:text-blue-300 mb-1">SWMM5 Response</div>
            <span className="text-xs text-blue-800 dark:text-blue-200">
              Automatically reduces Δt (VARIABLE_STEP), reports in RPT file
            </span>
          </div>
          <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded border border-emerald-200 dark:border-emerald-800 p-3" data-testid="text-icm-response">
            <div className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 mb-1">ICM Response</div>
            <span className="text-xs text-emerald-800 dark:text-emerald-200">
              Halves Δt and retries, if still fails halves again
            </span>
          </div>
        </div>

        <div className="bg-amber-50 dark:bg-amber-900/20 rounded border border-amber-200 dark:border-amber-800 p-3" data-testid="text-key-insight">
          <span className="text-xs font-semibold text-amber-700 dark:text-amber-300">Key Insight: </span>
          <span className="text-xs text-amber-800 dark:text-amber-200">
            SWMM5 instability = CFL violation. ICM instability = convergence failure. Different causes, similar symptoms.
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
