import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useUnits } from "@/contexts/UnitsContext";

type OutfallType = "FREE" | "NORMAL" | "FIXED" | "TIDAL" | "TIMESERIES";

const outfallEquivalents: Record<OutfallType, { swmm: string; icm: string }> = {
  FREE: { swmm: "FREE outfall", icm: "Free discharge BC" },
  NORMAL: { swmm: "NORMAL outfall", icm: "Normal depth BC" },
  FIXED: { swmm: "FIXED outfall", icm: "Level BC (constant)" },
  TIDAL: { swmm: "TIDAL outfall", icm: "Level BC (tidal curve)" },
  TIMESERIES: { swmm: "TIMESERIES outfall", icm: "Level BC (time-varying)" },
};

export function OutfallTypesAnimation() {
  const [outfallType, setOutfallType] = useState<OutfallType>("FREE");
  const [downstreamLevel, setDownstreamLevel] = useState([120]);
  const [flapGate, setFlapGate] = useState(false);
  const [animOffset, setAnimOffset] = useState(0);

  const dsLevel = downstreamLevel[0];
  const pipeHeadY = 140;
  const pipeInvertY = 180;
  const pipeCrownY = 140;

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimOffset((prev) => (prev + 1) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const getTidalLevel = useCallback((offset: number) => {
    return 160 - 30 * Math.sin((offset / 360) * Math.PI * 2);
  }, []);

  const getTimeSeriesLevel = useCallback((offset: number) => {
    const t = (offset / 360) * Math.PI * 6;
    return 160 - 15 * Math.sin(t) - 10 * Math.sin(t * 2.3) - 5 * Math.cos(t * 0.7);
  }, []);

  const currentDSWaterY = (() => {
    switch (outfallType) {
      case "FREE": return pipeInvertY + 20;
      case "NORMAL": return 160;
      case "FIXED": return dsLevel;
      case "TIDAL": return getTidalLevel(animOffset);
      case "TIMESERIES": return getTimeSeriesLevel(animOffset);
    }
  })();

  const isReversed = currentDSWaterY < pipeHeadY;
  const gateBlocking = flapGate && isReversed;

  const flowParticles: React.ReactNode[] = [];
  if (!gateBlocking) {
    for (let i = 0; i < 6; i++) {
      const t = ((animOffset * 3 + i * 60) % 360) / 360;
      const x = 60 + t * 200;
      const y = 160 + Math.sin(t * Math.PI) * 3;
      flowParticles.push(
        <circle key={`fp-${i}`} cx={x} cy={y} r="3" fill="#3b82f6" opacity={0.6}>
          <animate attributeName="opacity" values="0.3;0.8;0.3" dur="1s" repeatCount="indefinite" />
        </circle>
      );
    }
  }

  const reverseArrows = isReversed && !gateBlocking ? (
    <g>
      {[0, 1, 2].map((i) => {
        const x = 240 - i * 40;
        return (
          <g key={`ra-${i}`}>
            <line x1={x + 15} y1={160} x2={x} y2={160} stroke="#ef4444" strokeWidth="2" />
            <polygon points={`${x},160 ${x + 6},156 ${x + 6},164`} fill="#ef4444" />
          </g>
        );
      })}
      <text x="200" y="130" textAnchor="middle" fontSize="8" fill="#ef4444" fontWeight="bold">Reverse Flow!</text>
    </g>
  ) : null;

  const renderOutfallSVG = () => {
    const pipeRect = (
      <rect x="60" y={pipeCrownY} width="200" height={pipeInvertY - pipeCrownY} fill="none" stroke="#94a3b8" strokeWidth="2" />
    );

    const waterInPipe = !gateBlocking ? (
      <rect x="61" y={pipeCrownY + 10} width="198" height={pipeInvertY - pipeCrownY - 10} fill="rgba(59,130,246,0.4)" />
    ) : null;

    const gateElement = flapGate ? (
      <g>
        <rect
          x="258"
          y={gateBlocking ? pipeCrownY - 2 : pipeInvertY - 8}
          width="4"
          height={gateBlocking ? pipeInvertY - pipeCrownY + 4 : 10}
          fill={gateBlocking ? "#ef4444" : "#f59e0b"}
          stroke="#333"
          strokeWidth="1"
        />
        <circle cx="260" cy={gateBlocking ? pipeCrownY - 2 : pipeInvertY - 8} r="3" fill="#333" />
        <text x="265" y={gateBlocking ? pipeCrownY + 15 : pipeInvertY} fontSize="7" fill={gateBlocking ? "#ef4444" : "#f59e0b"}>
          {gateBlocking ? "CLOSED" : "Gate"}
        </text>
      </g>
    ) : null;

    let dsWater = null;
    switch (outfallType) {
      case "FREE":
        dsWater = (
          <g>
            {[0, 1, 2].map((i) => {
              const dropT = ((animOffset * 2 + i * 120) % 360) / 360;
              return (
                <ellipse key={`drop-${i}`} cx={270 + i * 15} cy={pipeInvertY + dropT * 40} rx="3" ry="4" fill="rgba(59,130,246,0.6)">
                  <animate attributeName="opacity" values="0.8;0.2" dur="0.8s" repeatCount="indefinite" />
                </ellipse>
              );
            })}
            <text x="290" y={pipeCrownY + 10} fontSize="7" fill="#64748b">Critical depth</text>
            <line x1="260" y1={pipeInvertY - 5} x2="320" y2={pipeInvertY - 5} stroke="#f59e0b" strokeWidth="1" strokeDasharray="3,2" />
          </g>
        );
        break;
      case "NORMAL":
        dsWater = (
          <g>
            <rect x="260" y={155} width="80" height={pipeInvertY - 155} fill="rgba(59,130,246,0.3)" />
            <line x1="260" y1={155} x2="340" y2={155} stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="4,2" />
            <text x="300" y={148} textAnchor="middle" fontSize="7" fill="#3b82f6">Normal depth</text>
          </g>
        );
        break;
      case "FIXED":
        dsWater = (
          <g>
            <rect x="262" y={Math.min(currentDSWaterY, pipeInvertY + 30)} width="100" height={pipeInvertY + 30 - Math.min(currentDSWaterY, pipeInvertY + 30)} fill="rgba(59,130,246,0.35)" />
            <line x1="260" y1={currentDSWaterY} x2="365" y2={currentDSWaterY} stroke="#3b82f6" strokeWidth="2" />
            <text x="320" y={currentDSWaterY - 5} textAnchor="middle" fontSize="7" fill="#3b82f6">Fixed: {dsLevel}</text>
          </g>
        );
        break;
      case "TIDAL":
        dsWater = (
          <g>
            <rect x="262" y={Math.min(currentDSWaterY, pipeInvertY + 30)} width="100" height={pipeInvertY + 30 - Math.min(currentDSWaterY, pipeInvertY + 30)} fill="rgba(59,130,246,0.35)" />
            <path
              d={`M 262,${currentDSWaterY} Q 290,${currentDSWaterY - 5} 315,${currentDSWaterY + 3} Q 340,${currentDSWaterY - 2} 362,${currentDSWaterY}`}
              fill="none" stroke="#3b82f6" strokeWidth="2"
            />
            <text x="320" y={Math.min(currentDSWaterY, 135) - 5} textAnchor="middle" fontSize="7" fill="#3b82f6">Tidal ≈ {currentDSWaterY.toFixed(0)}</text>
          </g>
        );
        break;
      case "TIMESERIES":
        dsWater = (
          <g>
            <rect x="262" y={Math.min(currentDSWaterY, pipeInvertY + 30)} width="100" height={pipeInvertY + 30 - Math.min(currentDSWaterY, pipeInvertY + 30)} fill="rgba(59,130,246,0.35)" />
            <line x1="262" y1={currentDSWaterY} x2="362" y2={currentDSWaterY} stroke="#3b82f6" strokeWidth="2" strokeDasharray="6,3" />
            <text x="320" y={Math.min(currentDSWaterY, 135) - 5} textAnchor="middle" fontSize="7" fill="#3b82f6">TS ≈ {currentDSWaterY.toFixed(0)}</text>
          </g>
        );
        break;
    }

    return (
      <>
        <line x1="50" y1={pipeInvertY + 30} x2="370" y2={pipeInvertY + 30} stroke="#94a3b8" strokeWidth="1" strokeDasharray="4,2" />
        <text x="375" y={pipeInvertY + 34} fontSize="7" fill="#94a3b8">Ground</text>
        {pipeRect}
        {waterInPipe}
        {!gateBlocking && flowParticles}
        {dsWater}
        {gateElement}
        {reverseArrows}
        <line x1="260" y1={pipeHeadY} x2="280" y2={pipeHeadY} stroke="#f59e0b" strokeWidth="1" strokeDasharray="2,2" />
        <text x="283" y={pipeHeadY + 3} fontSize="6" fill="#f59e0b">Pipe head</text>
        <text x="30" y={160} fontSize="8" fill="#64748b">Pipe →</text>
        <text x="300" y={pipeInvertY + 45} textAnchor="middle" fontSize="8" fill="#64748b">Downstream</text>
      </>
    );
  };

  const eq = outfallEquivalents[outfallType];

  return (
    <Card data-testid="card-outfall-types">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Outfall Boundary Conditions</CardTitle>
          <Badge data-testid="badge-outfall-types">Outfall Types</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2 flex-wrap">
          {(["FREE", "NORMAL", "FIXED", "TIDAL", "TIMESERIES"] as const).map((t) => (
            <Button
              key={t}
              variant={outfallType === t ? "default" : "outline"}
              size="sm"
              onClick={() => setOutfallType(t)}
              data-testid={`button-outfall-${t.toLowerCase()}`}
            >
              {t === "TIMESERIES" ? "TIME SERIES" : t}
            </Button>
          ))}
        </div>

        <svg role="img" aria-label="Outfall boundary types animation" viewBox="0 0 400 280" className="w-full border rounded bg-muted/20" data-testid="svg-outfall-types">
          <rect x="0" y="0" width="400" height="280" fill="#f8fafc" />
          <text x="200" y="15" textAnchor="middle" fontSize="9" fill="#64748b" fontWeight="bold">
            Outfall Type: {outfallType === "TIMESERIES" ? "TIME SERIES" : outfallType}
          </text>
          {renderOutfallSVG()}
          {gateBlocking && (
            <text x="200" y="260" textAnchor="middle" fontSize="8" fill="#ef4444" fontWeight="bold">
              ⚠ Flap gate closed — no reverse flow
            </text>
          )}
          {isReversed && !flapGate && (
            <text x="200" y="260" textAnchor="middle" fontSize="8" fill="#ef4444" fontWeight="bold">
              ⚠ Downstream exceeds pipe head — reverse flow!
            </text>
          )}
        </svg>

        {(outfallType === "FIXED" || outfallType === "TIDAL") && (
          <div className="space-y-1">
            <label className="text-xs font-medium" data-testid="label-ds-level">Downstream Level: {dsLevel}</label>
            <Slider value={downstreamLevel} onValueChange={setDownstreamLevel} min={100} max={200} step={1} data-testid="slider-ds-level" />
          </div>
        )}

        <div className="flex items-center gap-3">
          <Button
            variant={flapGate ? "default" : "outline"}
            size="sm"
            onClick={() => setFlapGate(!flapGate)}
            data-testid="button-flap-gate"
          >
            Flap Gate: {flapGate ? "ON" : "OFF"}
          </Button>
          {flapGate && (
            <span className="text-xs text-muted-foreground">Prevents reverse flow when downstream &gt; pipe head</span>
          )}
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800 p-3">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div data-testid="text-swmm-equivalent">
              <span className="text-muted-foreground">SWMM5:</span>{" "}
              <span className="font-bold text-blue-600">{eq.swmm}</span>
            </div>
            <div data-testid="text-icm-equivalent">
              <span className="text-muted-foreground">ICM:</span>{" "}
              <span className="font-bold text-emerald-600">{eq.icm}</span>
            </div>
          </div>
        </div>

        <div className="bg-amber-50 dark:bg-amber-900/20 rounded border border-amber-200 dark:border-amber-800 p-3" data-testid="text-outfall-insight">
          <span className="text-xs font-semibold text-amber-700 dark:text-amber-300">Key Insight: </span>
          <span className="text-xs text-amber-800 dark:text-amber-200">
            SWMM5 outfall types map directly to ICM boundary conditions. The flap gate option works identically in both solvers — it prevents backflow when the downstream water level exceeds the pipe crown.
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

type InflowMode = "DIRECT" | "DWF" | "RDII" | "ALL";

export function InflowTypesAnimation() {
  const { u, conv } = useUnits();
  const [inflowMode, setInflowMode] = useState<InflowMode>("ALL");
  const [rainIntensity, setRainIntensity] = useState([30]);
  const [dwfBase, setDwfBase] = useState([50]);
  const [animOffset, setAnimOffset] = useState(0);
  const [currentHour, setCurrentHour] = useState(0);

  const rain = rainIntensity[0];
  const dwfBaseVal = dwfBase[0];

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimOffset((prev) => (prev + 1) % 400);
      setCurrentHour((prev) => (prev + 0.05) % 24);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const getDirectFlow = useCallback((hr: number) => {
    if (hr >= 2 && hr <= 6) {
      const peak = 40;
      const mid = 4;
      return peak * Math.max(0, 1 - Math.abs(hr - mid) / 2);
    }
    return 0;
  }, []);

  const getDWFFlow = useCallback((hr: number, base: number) => {
    const morningPeak = 1.8 * Math.exp(-0.5 * Math.pow((hr - 8) / 1.5, 2));
    const lunchPeak = 1.3 * Math.exp(-0.5 * Math.pow((hr - 12) / 1, 2));
    const eveningPeak = 1.6 * Math.exp(-0.5 * Math.pow((hr - 19) / 2, 2));
    const nightDip = 0.4;
    const factor = nightDip + morningPeak + lunchPeak + eveningPeak;
    return base * Math.min(factor, 2.5);
  }, []);

  const getRDIIFlow = useCallback((hr: number, intensity: number) => {
    const scale = intensity / 50;
    const shortResp = hr >= 1 && hr <= 3 ? scale * 30 * Math.max(0, 1 - Math.abs(hr - 2) / 1) : 0;
    const medResp = hr >= 2 && hr <= 8 ? scale * 20 * Math.max(0, 1 - Math.abs(hr - 5) / 3) : 0;
    const longResp = hr >= 4 && hr <= 16 ? scale * 10 * Math.max(0, 1 - Math.abs(hr - 10) / 6) : 0;
    return shortResp + medResp + longResp;
  }, []);

  const directQ = getDirectFlow(currentHour);
  const dwfQ = getDWFFlow(currentHour, dwfBaseVal);
  const rdiiQ = getRDIIFlow(currentHour, rain);
  const totalQ = directQ + dwfQ + rdiiQ;

  const chartW = 340;
  const chartH = 100;
  const chartX = 30;
  const chartY = 30;

  const renderChart = () => {
    const points: { direct: string; dwf: string; rdii: string; all: string } = { direct: "", dwf: "", rdii: "", all: "" };
    const steps = 96;
    for (let i = 0; i <= steps; i++) {
      const hr = (i / steps) * 24;
      const x = chartX + (i / steps) * chartW;
      const d = getDirectFlow(hr);
      const w = getDWFFlow(hr, dwfBaseVal);
      const r = getRDIIFlow(hr, rain);
      const maxQ = 200;
      const scaleY = (v: number) => chartY + chartH - (v / maxQ) * chartH;
      points.direct += `${x},${scaleY(d)} `;
      points.dwf += `${x},${scaleY(w)} `;
      points.rdii += `${x},${scaleY(r)} `;
      points.all += `${x},${scaleY(d + w + r)} `;
    }
    return points;
  };

  const chartPoints = renderChart();
  const baseline = `${chartX},${chartY + chartH} ${chartX + chartW},${chartY + chartH}`;

  const showDirect = inflowMode === "DIRECT" || inflowMode === "ALL";
  const showDWF = inflowMode === "DWF" || inflowMode === "ALL";
  const showRDII = inflowMode === "RDII" || inflowMode === "ALL";

  const currentX = chartX + (currentHour / 24) * chartW;

  const nodeX = 200;
  const nodeY = 190;

  return (
    <Card data-testid="card-inflow-types">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Node Inflow Types</CardTitle>
          <Badge data-testid="badge-inflow-types">Inflow Types</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2 flex-wrap">
          {(["DIRECT", "DWF", "RDII", "ALL"] as const).map((m) => (
            <Button
              key={m}
              variant={inflowMode === m ? "default" : "outline"}
              size="sm"
              onClick={() => setInflowMode(m)}
              data-testid={`button-inflow-${m.toLowerCase()}`}
            >
              {m === "ALL" ? "All Combined" : m}
            </Button>
          ))}
        </div>

        <svg role="img" aria-label="Node inflow types animation" viewBox="0 0 400 280" className="w-full border rounded bg-muted/20" data-testid="svg-inflow-types">
          <rect x="0" y="0" width="400" height="280" fill="#f8fafc" />
          <text x="200" y="15" textAnchor="middle" fontSize="9" fill="#64748b" fontWeight="bold">
            Inflow Hydrographs — 24hr Period
          </text>

          <rect x={chartX} y={chartY} width={chartW} height={chartH} fill="white" stroke="#e2e8f0" strokeWidth="1" />
          {[0, 6, 12, 18, 24].map((hr) => {
            const x = chartX + (hr / 24) * chartW;
            return (
              <g key={`ax-${hr}`}>
                <line x1={x} y1={chartY + chartH} x2={x} y2={chartY + chartH + 5} stroke="#94a3b8" strokeWidth="0.5" />
                <text x={x} y={chartY + chartH + 13} textAnchor="middle" fontSize="6" fill="#94a3b8">{hr}h</text>
              </g>
            );
          })}

          {showDirect && (
            <polyline points={chartPoints.direct} fill="none" stroke="#f59e0b" strokeWidth="1.5" />
          )}
          {showDWF && (
            <polyline points={chartPoints.dwf} fill="none" stroke="#8b5cf6" strokeWidth="1.5" />
          )}
          {showRDII && (
            <polyline points={chartPoints.rdii} fill="none" stroke="#10b981" strokeWidth="1.5" />
          )}
          {inflowMode === "ALL" && (
            <polyline points={chartPoints.all} fill="none" stroke="#ef4444" strokeWidth="2" />
          )}

          <line x1={currentX} y1={chartY} x2={currentX} y2={chartY + chartH} stroke="#333" strokeWidth="1" strokeDasharray="3,2" />
          <text x={currentX} y={chartY - 3} textAnchor="middle" fontSize="7" fill="#333">{currentHour.toFixed(1)}h</text>

          <g transform={`translate(${chartX + chartW + 5}, ${chartY})`}>
            {showDirect && <><rect x="0" y="0" width="8" height="8" fill="#f59e0b" /><text x="11" y="7" fontSize="6" fill="#64748b">Direct</text></>}
            {showDWF && <><rect x="0" y="12" width="8" height="8" fill="#8b5cf6" /><text x="11" y="19" fontSize="6" fill="#64748b">DWF</text></>}
            {showRDII && <><rect x="0" y="24" width="8" height="8" fill="#10b981" /><text x="11" y="31" fontSize="6" fill="#64748b">RDII</text></>}
            {inflowMode === "ALL" && <><rect x="0" y="36" width="8" height="8" fill="#ef4444" /><text x="11" y="43" fontSize="6" fill="#64748b">Total</text></>}
          </g>

          <circle cx={nodeX} cy={nodeY} r="18" fill="white" stroke="#94a3b8" strokeWidth="2" />
          <text x={nodeX} y={nodeY + 4} textAnchor="middle" fontSize="8" fill="#64748b">Node</text>
          <rect x={nodeX + 25} y={nodeY - 5} width="80" height="10" fill="none" stroke="#94a3b8" strokeWidth="1.5" />

          {showDirect && directQ > 0.5 && (
            <>
              {[0, 1, 2].map((i) => {
                const t = ((animOffset + i * 130) % 400) / 400;
                return <circle key={`dp-${i}`} cx={nodeX - 50 + t * 30} cy={nodeY - 25 + t * 10} r="3" fill="#f59e0b" opacity={0.7} />;
              })}
              <text x={nodeX - 45} y={nodeY - 30} fontSize="6" fill="#f59e0b">Direct</text>
            </>
          )}
          {showDWF && dwfQ > 0.5 && (
            <>
              {[0, 1, 2].map((i) => {
                const t = ((animOffset + i * 130) % 400) / 400;
                return <circle key={`wp-${i}`} cx={nodeX - 30 - t * 5} cy={nodeY + 25 - t * 10} r="3" fill="#8b5cf6" opacity={0.7} />;
              })}
              <text x={nodeX - 45} y={nodeY + 35} fontSize="6" fill="#8b5cf6">DWF</text>
            </>
          )}
          {showRDII && rdiiQ > 0.5 && (
            <>
              {[0, 1, 2].map((i) => {
                const t = ((animOffset + i * 130) % 400) / 400;
                return <circle key={`rp-${i}`} cx={nodeX + 10 + t * 5} cy={nodeY - 35 + t * 15} r="3" fill="#10b981" opacity={0.7} />;
              })}
              <text x={nodeX + 5} y={nodeY - 38} fontSize="6" fill="#10b981">RDII</text>
            </>
          )}

          {totalQ > 0.5 && [0, 1, 2, 3].map((i) => {
            const t = ((animOffset * 2 + i * 100) % 400) / 400;
            return <circle key={`op-${i}`} cx={nodeX + 25 + t * 80} cy={nodeY} r="2.5" fill="#3b82f6" opacity={0.6} />;
          })}

          <text x={nodeX + 65} y={nodeY + 25} textAnchor="middle" fontSize="7" fill="#64748b">
            Q = {conv.flowSmall(totalQ).toFixed(1)} {u.flowSmall}
          </text>
        </svg>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-medium" data-testid="label-rain-intensity">Rain Intensity: {conv.rainfall(rain).toFixed(0)} {u.rainfall}</label>
            <Slider value={rainIntensity} onValueChange={setRainIntensity} min={0} max={100} step={1} data-testid="slider-rain-intensity" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium" data-testid="label-dwf-base">DWF Base Flow: {conv.flowSmall(dwfBaseVal).toFixed(0)} {u.flowSmall}</label>
            <Slider value={dwfBase} onValueChange={setDwfBase} min={10} max={150} step={5} data-testid="slider-dwf-base" />
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800 p-3">
          <div className="grid grid-cols-4 gap-2 text-xs">
            <div data-testid="text-direct-q">
              <span className="text-muted-foreground">Direct:</span>{" "}
              <span className="font-bold text-amber-600">{conv.flowSmall(directQ).toFixed(1)} {u.flowSmall}</span>
            </div>
            <div data-testid="text-dwf-q">
              <span className="text-muted-foreground">DWF:</span>{" "}
              <span className="font-bold text-purple-600">{conv.flowSmall(dwfQ).toFixed(1)} {u.flowSmall}</span>
            </div>
            <div data-testid="text-rdii-q">
              <span className="text-muted-foreground">RDII:</span>{" "}
              <span className="font-bold text-emerald-600">{conv.flowSmall(rdiiQ).toFixed(1)} {u.flowSmall}</span>
            </div>
            <div data-testid="text-total-q">
              <span className="text-muted-foreground">Total:</span>{" "}
              <span className="font-bold text-red-600">{conv.flowSmall(totalQ).toFixed(1)} {u.flowSmall}</span>
            </div>
          </div>
        </div>

        <div className="bg-amber-50 dark:bg-amber-900/20 rounded border border-amber-200 dark:border-amber-800 p-3" data-testid="text-inflow-insight">
          <span className="text-xs font-semibold text-amber-700 dark:text-amber-300">Key Difference: </span>
          <span className="text-xs text-amber-800 dark:text-amber-200">
            SWMM5: DWF defined at NODES. ICM: DWF from SUBCATCHMENT population (trade/domestic waste water profiles applied per capita).
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

export function TreatmentAtNodesAnimation() {
  const { u, conv } = useUnits();
  const [inflowRate, setInflowRate] = useState([20]);
  const [inflowTSS, setInflowTSS] = useState([150]);
  const [animOffset, setAnimOffset] = useState(0);

  const Q = inflowRate[0];
  const TSS_in = inflowTSS[0];

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimOffset((prev) => (prev + 1) % 400);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const nodeVolume = 5;
  const HRT = nodeVolume / (Q / 1000);
  const R = 0.75 * HRT / (0.5 + HRT);
  const TSS_out = TSS_in * (1 - R);

  const treatmentColor = R > 0.5 ? "#22c55e" : R > 0.3 ? "#f59e0b" : "#ef4444";
  const treatmentLabel = R > 0.5 ? "Good" : R > 0.3 ? "Moderate" : "Poor";

  const inletColor = `rgb(${139}, ${90}, ${43})`;

  const outR = Math.round(59 + (1 - R) * 80);
  const outG = Math.round(130 + R * 100);
  const outB = Math.round(246);
  const outletColor = `rgb(${outR}, ${outG}, ${outB})`;

  const curvePoints = [];
  const curveX = 250;
  const curveY = 160;
  const curveW = 130;
  const curveH = 80;

  for (let i = 0; i <= 40; i++) {
    const hrt = (i / 40) * 5;
    const r = 0.75 * hrt / (0.5 + hrt);
    const x = curveX + (hrt / 5) * curveW;
    const y = curveY + curveH - r * curveH;
    curvePoints.push(`${x},${y}`);
  }

  const currentCurveX = curveX + (Math.min(HRT, 5) / 5) * curveW;
  const currentCurveY = curveY + curveH - R * curveH;

  return (
    <Card data-testid="card-treatment-nodes">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Treatment at Nodes</CardTitle>
          <Badge data-testid="badge-treatment">Treatment</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <svg role="img" aria-label="Treatment at nodes animation" viewBox="0 0 400 280" className="w-full border rounded bg-muted/20" data-testid="svg-treatment">
          <rect x="0" y="0" width="400" height="280" fill="#f8fafc" />
          <text x="120" y="15" textAnchor="middle" fontSize="9" fill="#64748b" fontWeight="bold">
            Inflow → Treatment Node → Outflow
          </text>

          <rect x="20" y="60" width="80" height="20" fill="none" stroke="#94a3b8" strokeWidth="2" />
          <rect x="21" y="65" width="78" height="10" fill="rgba(139,90,43,0.5)" />

          <circle cx="130" cy="70" r="25" fill="white" stroke={treatmentColor} strokeWidth="3" />
          <text x="130" y="66" textAnchor="middle" fontSize="7" fill="#64748b">Treatment</text>
          <text x="130" y="76" textAnchor="middle" fontSize="7" fill={treatmentColor} fontWeight="bold">{treatmentLabel}</text>

          <rect x="165" y="60" width="80" height="20" fill="none" stroke="#94a3b8" strokeWidth="2" />
          <rect x="166" y="65" width="78" height="10" fill={`rgba(${outR},${outG},${outB},0.5)`} />

          {[0, 1, 2, 3, 4].map((i) => {
            const t = ((animOffset * 2 + i * 80) % 400) / 400;
            const x = 20 + t * 80;
            return <circle key={`ip-${i}`} cx={x} cy={70} r="3" fill={inletColor} opacity={0.8} />;
          })}

          {[0, 1, 2, 3, 4].map((i) => {
            const t = ((animOffset * 2 + i * 80) % 400) / 400;
            const x = 165 + t * 80;
            return <circle key={`op-${i}`} cx={x} cy={70} r="3" fill={outletColor} opacity={0.8} />;
          })}

          <text x="60" y="55" textAnchor="middle" fontSize="7" fill="#8b5a2b">TSS = {TSS_in} mg/L</text>
          <text x="205" y="55" textAnchor="middle" fontSize="7" fill={treatmentColor}>TSS = {TSS_out.toFixed(0)} mg/L</text>

          <rect x="20" y="100" width="225" height="45" fill="rgba(243,244,246,0.8)" stroke="#e2e8f0" strokeWidth="1" rx="4" />
          <text x="30" y="115" fontSize="8" fill="#64748b" fontWeight="bold">Treatment Equation:</text>
          <text x="30" y="128" fontSize="8" fill="#333">R = 0.75 × HRT / (0.5 + HRT)</text>
          <text x="30" y="140" fontSize="7" fill="#64748b">
            HRT = V/Q = {nodeVolume}/{(Q / 1000).toFixed(3)} = {HRT.toFixed(2)}s → R = {R.toFixed(3)}
          </text>

          <text x={curveX + curveW / 2} y={curveY - 8} textAnchor="middle" fontSize="8" fill="#64748b" fontWeight="bold">
            Removal Efficiency Curve
          </text>
          <rect x={curveX} y={curveY} width={curveW} height={curveH} fill="white" stroke="#e2e8f0" strokeWidth="1" />

          {[0, 0.25, 0.5, 0.75].map((r) => {
            const y = curveY + curveH - r * curveH;
            return (
              <g key={`gy-${r}`}>
                <line x1={curveX} y1={y} x2={curveX + curveW} y2={y} stroke="#f1f5f9" strokeWidth="0.5" />
                <text x={curveX - 3} y={y + 3} textAnchor="end" fontSize="5" fill="#94a3b8">{(r * 100).toFixed(0)}%</text>
              </g>
            );
          })}
          <text x={curveX} y={curveY + curveH + 10} fontSize="5" fill="#94a3b8">0</text>
          <text x={curveX + curveW} y={curveY + curveH + 10} textAnchor="end" fontSize="5" fill="#94a3b8">5s</text>
          <text x={curveX + curveW / 2} y={curveY + curveH + 10} textAnchor="middle" fontSize="5" fill="#94a3b8">HRT</text>

          <polyline points={curvePoints.join(" ")} fill="none" stroke="#3b82f6" strokeWidth="1.5" />

          <circle cx={currentCurveX} cy={currentCurveY} r="4" fill={treatmentColor} stroke="white" strokeWidth="1.5" />
          <line x1={currentCurveX} y1={curveY} x2={currentCurveX} y2={currentCurveY} stroke={treatmentColor} strokeWidth="0.5" strokeDasharray="2,2" />
          <line x1={curveX} y1={currentCurveY} x2={currentCurveX} y2={currentCurveY} stroke={treatmentColor} strokeWidth="0.5" strokeDasharray="2,2" />
        </svg>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-medium" data-testid="label-inflow-rate">Inflow Rate: {conv.flowSmall(Q).toFixed(0)} {u.flowSmall}</label>
            <Slider value={inflowRate} onValueChange={setInflowRate} min={1} max={100} step={1} data-testid="slider-inflow-rate" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium" data-testid="label-inflow-tss">Inflow TSS: {TSS_in} mg/L</label>
            <Slider value={inflowTSS} onValueChange={setInflowTSS} min={50} max={300} step={5} data-testid="slider-inflow-tss" />
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800 p-3">
          <div className="grid grid-cols-4 gap-2 text-xs">
            <div data-testid="text-hrt">
              <span className="text-muted-foreground">HRT:</span>{" "}
              <span className="font-bold">{HRT.toFixed(2)} s</span>
            </div>
            <div data-testid="text-removal">
              <span className="text-muted-foreground">R:</span>{" "}
              <span className="font-bold" style={{ color: treatmentColor }}>{(R * 100).toFixed(1)}%</span>
            </div>
            <div data-testid="text-tss-in">
              <span className="text-muted-foreground">TSS in:</span>{" "}
              <span className="font-bold">{TSS_in} mg/L</span>
            </div>
            <div data-testid="text-tss-out">
              <span className="text-muted-foreground">TSS out:</span>{" "}
              <span className="font-bold" style={{ color: treatmentColor }}>{TSS_out.toFixed(0)} mg/L</span>
            </div>
          </div>
        </div>

        <div className="bg-amber-50 dark:bg-amber-900/20 rounded border border-amber-200 dark:border-amber-800 p-3" data-testid="text-treatment-insight">
          <span className="text-xs font-semibold text-amber-700 dark:text-amber-300">Note: </span>
          <span className="text-xs text-amber-800 dark:text-amber-200">
            Both solvers: Same expression syntax. R = removal fraction, HRT and DT available. Treatment expressions evaluate each timestep using current hydraulic conditions.
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

type ConversionTab = "WEIR" | "ORIFICE" | "MANNING" | "OFFSET" | "PUMP";

const conversionData: Record<ConversionTab, {
  title: string;
  swmmLabel: string;
  icmLabel: string;
  swmmDefault: number;
  min: number;
  max: number;
  step: number;
  convert: (v: number) => number;
  reverse: (v: number) => number;
  formula: string;
  warning: string;
}> = {
  WEIR: {
    title: "Weir Discharge Coefficient",
    swmmLabel: "SWMM5 Cd (US)",
    icmLabel: "ICM Cd (SI)",
    swmmDefault: 3.33,
    min: 1,
    max: 6,
    step: 0.01,
    convert: (v) => v / 5.37,
    reverse: (v) => v * 5.37,
    formula: "ICM Cd = SWMM5 Cd / 5.37",
    warning: "Using SWMM5 Cd=3.33 in ICM gives 5.4× too much flow!",
  },
  ORIFICE: {
    title: "Orifice Discharge Coefficient",
    swmmLabel: "SWMM5 Cd",
    icmLabel: "ICM Cd",
    swmmDefault: 0.65,
    min: 0.1,
    max: 1.5,
    step: 0.01,
    convert: (v) => v * Math.sqrt(2),
    reverse: (v) => v / Math.sqrt(2),
    formula: "ICM Cd = SWMM5 Cd × √2",
    warning: "Using SWMM5 Cd=0.65 in ICM underestimates flow by ~29%!",
  },
  MANNING: {
    title: "Manning's n vs Colebrook-White M",
    swmmLabel: "Manning's n",
    icmLabel: "ICM M (= 1/n)",
    swmmDefault: 0.013,
    min: 0.008,
    max: 0.035,
    step: 0.001,
    convert: (v) => 1 / v,
    reverse: (v) => 1 / v,
    formula: "M = 1/n",
    warning: "Entering n=0.013 as M=0.013 gives 5900× roughness error!",
  },
  OFFSET: {
    title: "Link Offset Convention",
    swmmLabel: "SWMM5 Offset (depth above invert, m)",
    icmLabel: "ICM Offset (absolute elevation, m)",
    swmmDefault: 0.5,
    min: 0,
    max: 5,
    step: 0.1,
    convert: (v) => v + 100,
    reverse: (v) => v - 100,
    formula: "ICM Elevation = Invert (100m) + SWMM5 Offset",
    warning: "SWMM5 can use DEPTH or ELEVATION. ICM always ELEVATION!",
  },
  PUMP: {
    title: "Pump Control Levels",
    swmmLabel: "SWMM5 (depth above invert, m)",
    icmLabel: "ICM (absolute elevation, m)",
    swmmDefault: 1.5,
    min: 0,
    max: 5,
    step: 0.1,
    convert: (v) => v + 95,
    reverse: (v) => v - 95,
    formula: "ICM Elevation = Invert (95m) + SWMM5 Depth",
    warning: "Pump ON at 1.5m depth ≠ ON at 1.5m elevation!",
  },
};

export function CoefficientConversionAnimation() {
  const [tab, setTab] = useState<ConversionTab>("WEIR");
  const [swmmValue, setSwmmValue] = useState([3.33]);

  const data = conversionData[tab];
  const val = swmmValue[0];
  const icmVal = data.convert(val);

  useEffect(() => {
    setSwmmValue([data.swmmDefault]);
  }, [tab, data.swmmDefault]);

  const svgBarMaxW = 150;
  const swmmBarW = Math.min(svgBarMaxW, (val / data.max) * svgBarMaxW);
  const icmBarW = Math.min(svgBarMaxW, (Math.abs(icmVal) / (data.convert(data.max))) * svgBarMaxW);

  const tabLabels: Record<ConversionTab, string> = {
    WEIR: "Weir Cd",
    ORIFICE: "Orifice Cd",
    MANNING: "Manning's n/M",
    OFFSET: "Offset",
    PUMP: "Pump Levels",
  };

  return (
    <Card data-testid="card-coefficient-conversion">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">SWMM5 ↔ ICM Coefficient Conversion</CardTitle>
          <Badge data-testid="badge-conversion">Conversion</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2 flex-wrap">
          {(["WEIR", "ORIFICE", "MANNING", "OFFSET", "PUMP"] as const).map((t) => (
            <Button
              key={t}
              variant={tab === t ? "default" : "outline"}
              size="sm"
              onClick={() => setTab(t)}
              data-testid={`button-tab-${t.toLowerCase()}`}
            >
              {tabLabels[t]}
            </Button>
          ))}
        </div>

        <svg role="img" aria-label="Coefficient conversion animation" viewBox="0 0 400 280" className="w-full border rounded bg-muted/20" data-testid="svg-conversion">
          <rect x="0" y="0" width="400" height="280" fill="#f8fafc" />
          <text x="200" y="20" textAnchor="middle" fontSize="10" fill="#64748b" fontWeight="bold">
            {data.title}
          </text>

          <text x="30" y="50" fontSize="9" fill="#333" fontWeight="bold">Formula:</text>
          <text x="30" y="65" fontSize="9" fill="#3b82f6">{data.formula}</text>

          <text x="30" y="95" fontSize="8" fill="#3b82f6" fontWeight="bold">{data.swmmLabel}</text>
          <rect x="30" y="100" width={swmmBarW} height="20" fill="rgba(59,130,246,0.6)" rx="3" />
          <text x={35 + swmmBarW} y="114" fontSize="9" fill="#3b82f6" fontWeight="bold">{val.toFixed(3)}</text>

          <text x="30" y="145" fontSize="8" fill="#10b981" fontWeight="bold">{data.icmLabel}</text>
          <rect x="30" y="150" width={icmBarW} height="20" fill="rgba(16,185,129,0.6)" rx="3" />
          <text x={35 + icmBarW} y="164" fontSize="9" fill="#10b981" fontWeight="bold">{icmVal.toFixed(3)}</text>

          <line x1="220" y1="85" x2="220" y2="175" stroke="#94a3b8" strokeWidth="1" strokeDasharray="4,2" />
          <text x="225" y="95" fontSize="8" fill="#64748b">Conversion</text>

          <g transform="translate(225, 100)">
            <rect x="0" y="0" width="160" height="25" fill="rgba(59,130,246,0.1)" stroke="#3b82f6" strokeWidth="1" rx="4" />
            <text x="80" y="16" textAnchor="middle" fontSize="8" fill="#3b82f6">
              SWMM5: {val.toFixed(3)}
            </text>
          </g>

          <path d="M 305,130 L 305,140 L 300,138 M 305,140 L 310,138" stroke="#64748b" strokeWidth="1.5" fill="none" />

          <g transform="translate(225, 145)">
            <rect x="0" y="0" width="160" height="25" fill="rgba(16,185,129,0.1)" stroke="#10b981" strokeWidth="1" rx="4" />
            <text x="80" y="16" textAnchor="middle" fontSize="8" fill="#10b981">
              ICM: {icmVal.toFixed(3)}
            </text>
          </g>

          <g transform="translate(20, 195)">
            <rect x="0" y="0" width="360" height="35" fill="rgba(239,68,68,0.08)" stroke="#ef4444" strokeWidth="1" rx="4" />
            <text x="15" y="15" fontSize="12" fill="#ef4444">⚠</text>
            <text x="32" y="15" fontSize="8" fill="#ef4444" fontWeight="bold">Common Mistake:</text>
            <text x="32" y="27" fontSize="7" fill="#dc2626">{data.warning}</text>
          </g>

          <g transform="translate(20, 240)">
            <rect x="0" y="0" width="360" height="30" fill="rgba(59,130,246,0.05)" stroke="#e2e8f0" strokeWidth="1" rx="4" />
            <text x="10" y="12" fontSize="7" fill="#64748b">SWMM5 value → </text>
            <text x="80" y="12" fontSize="7" fill="#3b82f6" fontWeight="bold">{val.toFixed(3)}</text>
            <text x="130" y="12" fontSize="7" fill="#64748b"> converts to ICM → </text>
            <text x="220" y="12" fontSize="7" fill="#10b981" fontWeight="bold">{icmVal.toFixed(3)}</text>
            {tab === "MANNING" && (
              <text x="10" y="24" fontSize="7" fill="#64748b">ICM value → {icmVal.toFixed(1)} converts to SWMM5 → {data.reverse(icmVal).toFixed(4)}</text>
            )}
          </g>
        </svg>

        <div className="space-y-1">
          <label className="text-xs font-medium" data-testid="label-swmm-value">{data.swmmLabel}: {val.toFixed(3)}</label>
          <Slider value={swmmValue} onValueChange={setSwmmValue} min={data.min} max={data.max} step={data.step} data-testid="slider-swmm-value" />
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800 p-3">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div data-testid="text-swmm-val">
              <span className="text-muted-foreground">SWMM5:</span>{" "}
              <span className="font-bold text-blue-600">{val.toFixed(3)}</span>
            </div>
            <div data-testid="text-icm-val">
              <span className="text-muted-foreground">ICM:</span>{" "}
              <span className="font-bold text-emerald-600">{icmVal.toFixed(3)}</span>
            </div>
          </div>
        </div>

        <div className="bg-red-50 dark:bg-red-900/20 rounded border border-red-200 dark:border-red-800 p-3" data-testid="text-conversion-warning">
          <span className="text-xs font-semibold text-red-700 dark:text-red-300">⚠ Top Import Mistake: </span>
          <span className="text-xs text-red-800 dark:text-red-200">{data.warning}</span>
        </div>

        <div className="bg-amber-50 dark:bg-amber-900/20 rounded border border-amber-200 dark:border-amber-800 p-3" data-testid="text-conversion-insight">
          <span className="text-xs font-semibold text-amber-700 dark:text-amber-300">Tip: </span>
          <span className="text-xs text-amber-800 dark:text-amber-200">
            Always verify coefficient conventions when importing models between SWMM5 and ICM. These 5 conversions account for &gt;90% of import errors.
          </span>
        </div>
      </CardContent>
    </Card>
  );
}