import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useUnits } from "@/contexts/UnitsContext";

export function NewtonRaphsonConvergence() {
  const { u, conv } = useUnits();
  const [nonlinearity, setNonlinearity] = useState([5]);
  const [animStep, setAnimStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const nl = nonlinearity[0];
  const targetQ = 8.9;
  const targetH = 4.95;

  const getSwmmIterations = useCallback((nl: number) => {
    if (nl <= 3) return [12.0, 10.5, 9.3, 8.9];
    if (nl <= 6) return [14.0, 11.5, 10.0, 9.5, 8.7, 9.1, 8.9];
    if (nl <= 9) return [16.0, 12.0, 10.5, 9.0, 10.0, 9.2, 8.7, 9.1, 8.85, 8.9];
    return [18.0, 13.0, 8.0, 12.0, 7.5, 11.0, 8.2, 10.5, 9.0, 9.8, NaN];
  }, []);

  const getIcmIterations = useCallback((nl: number) => {
    if (nl <= 3) return [12.0, 9.2, 8.9];
    if (nl <= 6) return [14.0, 9.8, 8.92, 8.9];
    return [16.0, 10.5, 9.1, 8.91, 8.9];
  }, []);

  const swmmIters = getSwmmIterations(nl);
  const icmIters = getIcmIterations(nl);
  const swmmFailed = nl >= 10 && swmmIters.some(v => isNaN(v));
  const maxIters = Math.max(swmmIters.length, icmIters.length);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setAnimStep(prev => {
        if (prev >= maxIters - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, 600);
    return () => clearInterval(interval);
  }, [isPlaying, maxIters]);

  const startAnimation = useCallback(() => {
    setAnimStep(0);
    setIsPlaying(true);
  }, []);

  const chartX = (iter: number, total: number) => 50 + (iter / Math.max(total - 1, 1)) * 300;
  const chartY = (val: number) => {
    const minV = 6;
    const maxV = 20;
    const clamped = Math.max(minV, Math.min(maxV, val));
    return 30 + ((maxV - clamped) / (maxV - minV)) * 200;
  };

  const renderChart = (iterations: number[], color: string, label: string, failed: boolean) => {
    const visibleIters = iterations.slice(0, animStep + 1).filter(v => !isNaN(v));
    const pathPoints = visibleIters.map((v, i) => `${chartX(i, iterations.length)},${chartY(v)}`).join(" ");

    return (
      <g>
        <line x1="50" y1="30" x2="50" y2="240" stroke="#94a3b8" strokeWidth="1" />
        <line x1="50" y1="240" x2="360" y2="240" stroke="#94a3b8" strokeWidth="1" />

        <line x1="48" y1={chartY(targetQ)} x2="360" y2={chartY(targetQ)} stroke="#22c55e" strokeWidth="1.5" strokeDasharray="4,2" />
        <text x="365" y={chartY(targetQ) + 3} fontSize="7" fill="#22c55e">Q={targetQ}</text>

        {[8, 10, 12, 14, 16, 18].map(v => (
          <g key={`tick-${v}`}>
            <line x1="47" y1={chartY(v)} x2="50" y2={chartY(v)} stroke="#94a3b8" strokeWidth="0.5" />
            <text x="44" y={chartY(v) + 3} textAnchor="end" fontSize="6" fill="#94a3b8">{v}</text>
          </g>
        ))}

        {iterations.map((_, i) => (
          <g key={`iter-label-${i}`}>
            <line x1={chartX(i, iterations.length)} y1="240" x2={chartX(i, iterations.length)} y2="243" stroke="#94a3b8" strokeWidth="0.5" />
            <text x={chartX(i, iterations.length)} y="252" textAnchor="middle" fontSize="6" fill="#94a3b8">{i + 1}</text>
          </g>
        ))}

        <text x="30" y="20" fontSize="8" fill={color} fontWeight="bold">{label}</text>
        <text x="200" y="268" textAnchor="middle" fontSize="7" fill="#64748b">Iteration</text>
        <text x="15" y="140" fontSize="7" fill="#64748b" transform="rotate(-90, 15, 140)">{`Q (${u.flow})`}</text>

        {visibleIters.length > 1 && (
          <polyline points={pathPoints} fill="none" stroke={color} strokeWidth="2" />
        )}

        {visibleIters.map((v, i) => (
          <circle key={`pt-${i}`} cx={chartX(i, iterations.length)} cy={chartY(v)} r="4" fill={color} opacity={i === visibleIters.length - 1 ? 1 : 0.5} />
        ))}

        {visibleIters.length > 0 && (
          <circle cx={chartX(visibleIters.length - 1, iterations.length)} cy={chartY(visibleIters[visibleIters.length - 1])} r="6" fill="none" stroke={color} strokeWidth="2">
            <animate attributeName="r" values="4;8;4" dur="1s" repeatCount="indefinite" />
          </circle>
        )}

        {failed && animStep >= iterations.length - 1 && (
          <text x="200" y="140" textAnchor="middle" fontSize="12" fill="#ef4444" fontWeight="bold">✗ DIVERGED</text>
        )}
      </g>
    );
  };

  return (
    <Card data-testid="card-newton-raphson-convergence">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Newton-Raphson vs Successive Relaxation</CardTitle>
          <Badge data-testid="badge-convergence">Convergence</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <Button onClick={startAnimation} variant="outline" size="sm" data-testid="button-play-convergence">
            {isPlaying ? "Playing..." : "Play Animation"}
          </Button>
          <Badge variant="outline" data-testid="badge-iteration-count">
            SWMM5: {Math.min(animStep + 1, swmmIters.length)}/{swmmIters.length} iters | ICM: {Math.min(animStep + 1, icmIters.length)}/{icmIters.length} iters
          </Badge>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium" data-testid="label-nonlinearity">Problem Nonlinearity: {nl}</label>
            <span className="text-xs text-muted-foreground">1 = Linear, 10 = Extreme</span>
          </div>
          <Slider value={nonlinearity} onValueChange={(v) => { setNonlinearity(v); setAnimStep(0); setIsPlaying(false); }} min={1} max={10} step={1} data-testid="slider-nonlinearity" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="text-sm font-semibold text-blue-600 text-center" data-testid="label-swmm-convergence">SWMM5 — Successive Relaxation</div>
            <svg role="img" aria-label="Newton-Raphson convergence visualization" viewBox="0 0 400 280" className="w-full border rounded bg-muted/20" data-testid="svg-swmm-convergence">
              {renderChart(swmmIters, "#3b82f6", "SWMM5", swmmFailed)}
            </svg>
          </div>
          <div className="space-y-2">
            <div className="text-sm font-semibold text-emerald-600 text-center" data-testid="label-icm-convergence">ICM — Newton-Raphson</div>
            <svg viewBox="0 0 400 280" className="w-full border rounded bg-muted/20" data-testid="svg-icm-convergence">
              {renderChart(icmIters, "#10b981", "ICM", false)}
            </svg>
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800 p-3">
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div data-testid="text-swmm-method">
              <span className="font-semibold text-blue-700 dark:text-blue-300">SWMM5:</span>{" "}
              <span>Simple update rule, many iterations ({swmmIters.length}){swmmFailed ? " — may FAIL at high nonlinearity" : ""}</span>
            </div>
            <div data-testid="text-icm-method">
              <span className="font-semibold text-emerald-700 dark:text-emerald-300">ICM:</span>{" "}
              <span>Jacobian matrix solve, few iterations ({icmIters.length}) — quadratic convergence</span>
            </div>
          </div>
        </div>

        <div className="bg-amber-50 dark:bg-amber-900/20 rounded border border-amber-200 dark:border-amber-800 p-3" data-testid="text-convergence-insight">
          <span className="text-xs font-semibold text-amber-700 dark:text-amber-300">Key Insight: </span>
          <span className="text-xs text-amber-800 dark:text-amber-200">
            Both methods converge to Q≈{conv.flow(targetQ).toFixed(1)} {u.flow}, H≈{conv.length(targetH).toFixed(1)} {u.length}. But Newton-Raphson converges quadratically (error² each step), while successive relaxation converges linearly. For nonlinear problems, ICM's approach is dramatically faster.
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

export function ThetaWeightingAnimation() {
  const [theta, setTheta] = useState([0.65]);
  const [animOffset, setAnimOffset] = useState(0);

  const th = theta[0];

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimOffset(prev => (prev + 2) % 400);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const getWaveShape = useCallback((th: number, offset: number) => {
    const points: { x: number; y: number }[] = [];
    const baseY = 180;
    const peakAmplitude = 100;
    const waveCenter = 80 + (offset / 400) * 240;
    const diffusion = (th - 0.5) * 4.0;
    const waveWidth = 30 + diffusion * 25;

    for (let x = 30; x <= 370; x += 2) {
      const dist = x - waveCenter;
      const normalizedDist = dist / waveWidth;
      let amplitude = 0;

      if (th <= 0.55) {
        amplitude = Math.exp(-normalizedDist * normalizedDist * 2) * peakAmplitude * (1 - diffusion * 0.3);
        if (dist < 0 && dist > -waveWidth * 2) {
          const wigglePhase = (dist / 12) * Math.PI;
          const wiggleDecay = Math.exp(dist / (waveWidth * 0.8));
          amplitude += Math.sin(wigglePhase) * 8 * wiggleDecay * (1 - (th - 0.5) * 10);
        }
      } else if (th <= 0.75) {
        const smoothing = (th - 0.5) / 0.5;
        const sharpPeak = Math.exp(-normalizedDist * normalizedDist * 2) * peakAmplitude;
        const roundedPeak = Math.exp(-normalizedDist * normalizedDist * 0.8) * peakAmplitude * 0.75;
        amplitude = sharpPeak * (1 - smoothing) + roundedPeak * smoothing;
      } else {
        const heavySmoothing = (th - 0.75) / 0.25;
        const roundedPeak = Math.exp(-normalizedDist * normalizedDist * 0.8) * peakAmplitude * 0.75;
        const flatPeak = Math.exp(-normalizedDist * normalizedDist * 0.3) * peakAmplitude * 0.4;
        amplitude = roundedPeak * (1 - heavySmoothing) + flatPeak * heavySmoothing;
      }

      points.push({ x, y: baseY - Math.max(0, amplitude) });
    }
    return points;
  }, []);

  const wavePoints = getWaveShape(th, animOffset);
  const wavePath = wavePoints.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x},${p.y}`).join(" ");

  const getThetaLabel = (th: number) => {
    if (th <= 0.52) return "Crank-Nicolson";
    if (th <= 0.55) return "Near Crank-Nicolson";
    if (th >= 0.63 && th <= 0.67) return "ICM Sweet Spot";
    if (th >= 0.95) return "Fully Implicit (SWMM5)";
    if (th >= 0.85) return "Near Fully Implicit";
    return `θ = ${th.toFixed(2)}`;
  };

  const peakValue = Math.min(...wavePoints.map(p => p.y));
  const peakAmplitudeDisplay = (180 - peakValue).toFixed(0);

  return (
    <Card data-testid="card-theta-weighting">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Preissmann θ Parameter Effect</CardTitle>
          <Badge data-testid="badge-theta-parameter">θ Parameter</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium" data-testid="label-theta">θ = {th.toFixed(2)} — {getThetaLabel(th)}</label>
            <span className="text-xs text-muted-foreground">Peak amplitude: {peakAmplitudeDisplay}</span>
          </div>
          <Slider value={theta} onValueChange={setTheta} min={0.5} max={1.0} step={0.01} data-testid="slider-theta" />
          <div className="flex justify-between text-[10px] text-muted-foreground">
            <span>0.5 — Crank-Nicolson</span>
            <span>0.65 — ICM</span>
            <span>1.0 — SWMM5</span>
          </div>
        </div>

        <svg role="img" aria-label="Theta weighting factor animation" viewBox="0 0 400 280" className="w-full border rounded bg-muted/20" data-testid="svg-theta-wave">
          <line x1="30" y1="180" x2="370" y2="180" stroke="#94a3b8" strokeWidth="1" />
          <text x="375" y="183" fontSize="7" fill="#94a3b8">Base level</text>

          <rect x="30" y="185" width="340" height="15" fill="#e2e8f0" rx="3" />
          <text x="200" y="195" textAnchor="middle" fontSize="7" fill="#64748b">Pipe / Conduit</text>

          <path d={wavePath} fill="none" stroke="#3b82f6" strokeWidth="2.5" />
          <path d={`${wavePath} L 370,180 L 30,180 Z`} fill="rgba(59,130,246,0.15)" />

          {th <= 0.55 && (
            <text x="100" y="210" fontSize="7" fill="#ef4444">⚠ Oscillations behind wave front</text>
          )}
          {th >= 0.63 && th <= 0.67 && (
            <text x="200" y="25" textAnchor="middle" fontSize="8" fill="#10b981" fontWeight="bold">✓ ICM Sweet Spot — balanced accuracy & stability</text>
          )}
          {th >= 0.95 && (
            <text x="200" y="25" textAnchor="middle" fontSize="8" fill="#f97316" fontWeight="bold">Maximum numerical diffusion — peak flattened</text>
          )}

          <text x="30" y="245" fontSize="7" fill="#64748b">Sharp peak enters →</text>

          {[0.5, 0.65, 1.0].map(marker => {
            const markerX = 50 + ((marker - 0.5) / 0.5) * 300;
            return (
              <g key={`marker-${marker}`}>
                <line x1={markerX} y1="255" x2={markerX} y2="265" stroke="#94a3b8" strokeWidth="1" />
                <text x={markerX} y="273" textAnchor="middle" fontSize="6" fill="#94a3b8">θ={marker}</text>
              </g>
            );
          })}

          <rect x={50 + ((th - 0.5) / 0.5) * 300 - 2} y="255" width="4" height="10" fill="#3b82f6" rx="1" />
        </svg>

        <div className="bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800 p-3" data-testid="text-theta-insight">
          <span className="text-xs font-semibold text-blue-700 dark:text-blue-300">Key Insight: </span>
          <span className="text-xs text-blue-800 dark:text-blue-200">
            This is WHY SWMM5 tends to smooth out sharp peaks more than ICM — it is more diffusive by design. SWMM5 uses θ≈1.0 (fully implicit), while ICM uses θ≈0.65, preserving sharp wave fronts with minimal numerical diffusion.
          </span>
        </div>

        <div className="bg-gray-50 dark:bg-gray-900/20 rounded border border-gray-200 dark:border-gray-800 p-3">
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div data-testid="text-cn-desc">
              <span className="font-semibold">θ=0.5:</span> Sharp peak preserved, but spurious oscillations
            </div>
            <div data-testid="text-icm-desc">
              <span className="font-semibold text-emerald-600">θ=0.65:</span> Slight rounding, no oscillations — ICM default
            </div>
            <div data-testid="text-implicit-desc">
              <span className="font-semibold text-orange-600">θ=1.0:</span> Very rounded peak, maximum diffusion — SWMM5
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function StaggeredGridAnimation() {
  const [fieldView, setFieldView] = useState<"H" | "Q" | "both">("both");
  const [icmPoints, setIcmPoints] = useState([5]);
  const [animOffset, setAnimOffset] = useState(0);

  const numIcmPts = icmPoints[0];
  const nodeXPositions = [40, 110, 180, 250, 320];
  const swmmY = 80;
  const icmY = 200;

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimOffset(prev => (prev + 1) % 200);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const waveProgress = animOffset / 200;
  const waveX = 40 + waveProgress * 300;

  const showH = fieldView === "H" || fieldView === "both";
  const showQ = fieldView === "Q" || fieldView === "both";

  const getNodeActivation = (nodeX: number) => {
    const dist = waveX - nodeX;
    if (dist < 0) return 0;
    return Math.min(1, dist / 30);
  };

  const getLinkActivation = (linkStartX: number, linkEndX: number) => {
    const midX = (linkStartX + linkEndX) / 2;
    const dist = waveX - midX;
    if (dist < -20) return 0;
    return Math.min(1, (dist + 20) / 40);
  };

  const getIcmPointActivation = (ptX: number) => {
    const dist = waveX - ptX;
    if (dist < 0) return 0;
    return Math.min(1, dist / 15);
  };

  return (
    <Card data-testid="card-staggered-grid">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Staggered Grid — H & Q Locations</CardTitle>
          <Badge data-testid="badge-staggered-grid">Staggered Grid</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-medium text-muted-foreground">Show:</span>
          {(["H", "Q", "both"] as const).map(mode => (
            <Button
              key={mode}
              variant={fieldView === mode ? "default" : "outline"}
              size="sm"
              onClick={() => setFieldView(mode)}
              data-testid={`button-field-${mode}`}
            >
              {mode === "H" ? "H field (Head)" : mode === "Q" ? "Q field (Flow)" : "Show Both"}
            </Button>
          ))}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium" data-testid="label-icm-points">ICM computational points per conduit: {numIcmPts}</label>
            <span className="text-xs text-muted-foreground">More points = higher resolution</span>
          </div>
          <Slider value={icmPoints} onValueChange={setIcmPoints} min={3} max={10} step={1} data-testid="slider-icm-points" />
        </div>

        <svg role="img" aria-label="Staggered grid arrangement animation" viewBox="0 0 400 280" className="w-full border rounded bg-muted/20" data-testid="svg-staggered-grid">
          <text x="200" y="18" textAnchor="middle" fontSize="9" fill="#64748b" fontWeight="bold">
            Computational Point Locations
          </text>

          <text x="20" y={swmmY - 25} fontSize="9" fill="#3b82f6" fontWeight="bold">SWMM5</text>
          <text x="80" y={swmmY - 25} fontSize="7" fill="#94a3b8">H at nodes, Q at links</text>

          {[0, 1, 2, 3].map(i => {
            const x1 = nodeXPositions[i] + 15;
            const x2 = nodeXPositions[i + 1] - 15;
            const midX = (x1 + x2) / 2;
            const activation = getLinkActivation(nodeXPositions[i], nodeXPositions[i + 1]);
            return (
              <g key={`swmm-link-${i}`}>
                <line x1={nodeXPositions[i] + 12} y1={swmmY} x2={nodeXPositions[i + 1] - 12} y2={swmmY} stroke="#94a3b8" strokeWidth="3" />
                {showQ && (
                  <g>
                    <rect
                      x={midX - 12}
                      y={swmmY - 8}
                      width={24}
                      height={16}
                      fill={activation > 0 ? `rgba(249,115,22,${0.2 + activation * 0.6})` : "rgba(249,115,22,0.15)"}
                      stroke="#f97316"
                      strokeWidth={activation > 0.5 ? 2 : 1}
                      rx="2"
                    />
                    <text x={midX} y={swmmY + 4} textAnchor="middle" fontSize="7" fill="#f97316" fontWeight="bold">Q</text>
                  </g>
                )}
                {showQ && (
                  <text x={midX} y={swmmY + 22} textAnchor="middle" fontSize="6" fill="#94a3b8">L{i + 1}</text>
                )}
              </g>
            );
          })}

          {nodeXPositions.map((x, i) => {
            const activation = getNodeActivation(x);
            return (
              <g key={`swmm-node-${i}`}>
                {showH && (
                  <g>
                    <circle
                      cx={x}
                      cy={swmmY}
                      r="10"
                      fill={activation > 0 ? `rgba(59,130,246,${0.2 + activation * 0.6})` : "rgba(59,130,246,0.15)"}
                      stroke="#3b82f6"
                      strokeWidth={activation > 0.5 ? 2.5 : 1.5}
                    />
                    <text x={x} y={swmmY + 3} textAnchor="middle" fontSize="7" fill="#3b82f6" fontWeight="bold">H</text>
                  </g>
                )}
                {!showH && (
                  <circle cx={x} cy={swmmY} r="5" fill="none" stroke="#94a3b8" strokeWidth="1" />
                )}
                <text x={x} y={swmmY + 22} textAnchor="middle" fontSize="6" fill="#94a3b8">N{i + 1}</text>
              </g>
            );
          })}

          {waveProgress > 0 && waveProgress < 1 && (
            <g>
              <line x1={waveX} y1={swmmY - 30} x2={waveX} y2={swmmY + 30} stroke="rgba(59,130,246,0.3)" strokeWidth="1" strokeDasharray="2,2" />
              <text x={waveX} y={swmmY - 33} textAnchor="middle" fontSize="6" fill="#3b82f6">wave →</text>
            </g>
          )}

          <line x1="30" y1="140" x2="370" y2="140" stroke="#e2e8f0" strokeWidth="1" />

          <text x="20" y={icmY - 25} fontSize="9" fill="#10b981" fontWeight="bold">ICM</text>
          <text x="55" y={icmY - 25} fontSize="7" fill="#94a3b8">H and Q at every computational point</text>

          {[0, 1, 2, 3].map(linkIdx => {
            const startX = nodeXPositions[linkIdx];
            const endX = nodeXPositions[linkIdx + 1];
            const totalPts = numIcmPts * 2 + 1;

            return (
              <g key={`icm-link-${linkIdx}`}>
                <line x1={startX} y1={icmY} x2={endX} y2={icmY} stroke="#94a3b8" strokeWidth="3" />

                {Array.from({ length: totalPts }, (_, ptIdx) => {
                  const frac = ptIdx / (totalPts - 1);
                  const ptX = startX + frac * (endX - startX);
                  const isH = ptIdx % 2 === 0;
                  const activation = getIcmPointActivation(ptX);

                  if (isH && !showH) return null;
                  if (!isH && !showQ) return null;

                  if (isH) {
                    return (
                      <g key={`icm-h-${linkIdx}-${ptIdx}`}>
                        <circle
                          cx={ptX}
                          cy={icmY}
                          r="5"
                          fill={activation > 0 ? `rgba(59,130,246,${0.2 + activation * 0.6})` : "rgba(59,130,246,0.1)"}
                          stroke="#3b82f6"
                          strokeWidth={activation > 0.5 ? 1.5 : 0.8}
                        />
                        <text x={ptX} y={icmY + 3} textAnchor="middle" fontSize="5" fill="#3b82f6">H</text>
                      </g>
                    );
                  } else {
                    return (
                      <g key={`icm-q-${linkIdx}-${ptIdx}`}>
                        <rect
                          x={ptX - 4}
                          y={icmY - 4}
                          width={8}
                          height={8}
                          fill={activation > 0 ? `rgba(249,115,22,${0.2 + activation * 0.6})` : "rgba(249,115,22,0.1)"}
                          stroke="#f97316"
                          strokeWidth={activation > 0.5 ? 1.5 : 0.8}
                          rx="1"
                        />
                        <text x={ptX} y={icmY + 3} textAnchor="middle" fontSize="5" fill="#f97316">Q</text>
                      </g>
                    );
                  }
                })}
              </g>
            );
          })}

          {waveProgress > 0 && waveProgress < 1 && (
            <g>
              <line x1={waveX} y1={icmY - 30} x2={waveX} y2={icmY + 30} stroke="rgba(16,185,129,0.3)" strokeWidth="1" strokeDasharray="2,2" />
              <text x={waveX} y={icmY - 33} textAnchor="middle" fontSize="6" fill="#10b981">wave →</text>
            </g>
          )}

          <g>
            <circle cx="50" cy="260" r="5" fill="rgba(59,130,246,0.5)" stroke="#3b82f6" strokeWidth="1" />
            <text x="60" y="263" fontSize="7" fill="#3b82f6">H (Head)</text>
            <rect x="110" y="256" width="8" height="8" fill="rgba(249,115,22,0.5)" stroke="#f97316" strokeWidth="1" rx="1" />
            <text x="123" y="263" fontSize="7" fill="#f97316">Q (Flow)</text>
            <text x="200" y="263" fontSize="7" fill="#94a3b8">SWMM5: {5 + 4} points | ICM: {4 * (numIcmPts * 2 + 1)} points</text>
          </g>
        </svg>

        <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded border border-emerald-200 dark:border-emerald-800 p-3" data-testid="text-staggered-insight">
          <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">Key Difference: </span>
          <span className="text-xs text-emerald-800 dark:text-emerald-200">
            SWMM5 computes H only at {nodeXPositions.length} nodes and Q at {nodeXPositions.length - 1} links (total {nodeXPositions.length + nodeXPositions.length - 1} points). ICM computes H and Q at {4 * (numIcmPts * 2 + 1)} points — capturing within-conduit variation that SWMM5 misses entirely.
          </span>
        </div>

        <div className="bg-gray-50 dark:bg-gray-900/20 rounded border border-gray-200 dark:border-gray-800 p-3">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div data-testid="text-swmm-grid">
              <span className="font-semibold text-blue-600">SWMM5:</span> H jumps discretely at node boundaries. Q is uniform across each link. No within-pipe variation.
            </div>
            <div data-testid="text-icm-grid">
              <span className="font-semibold text-emerald-600">ICM:</span> H and Q update progressively point-by-point. Captures hydraulic gradients within each conduit.
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
