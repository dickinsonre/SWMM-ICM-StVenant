import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { XAxis, YAxis, Tooltip, ReferenceLine, ResponsiveContainer, Area, AreaChart, Line, ComposedChart } from "recharts";

interface ManholeGeometry {
  totalDepth: number;
  invert: number;
  shaftTop: number;
  shaftBottom: number;
  chamberTop: number;
  chamberBottom: number;
  shaftArea: number;
  chamberArea: number;
  chamberVolume: number;
  shaftVolume: number;
  totalVolume: number;
}

interface HistoryEntry {
  time: number;
  elevation: number;
  inflow: number;
  outflow: number;
}

interface SliderProps {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step: number;
  color?: string;
  suffix?: string;
  disabled?: boolean;
}

interface StatProps {
  label: string;
  value: string;
  color?: string;
  alert?: boolean;
}

const COLORS = {
  bg: "#0a1628",
  panel: "#111d33",
  panelBorder: "#1e3a5f",
  accent: "#00b4d8",
  water: "#00b4d8",
  waterDeep: "#0077b6",
  waterSurface: "#48cae4",
  concrete: "#4a5568",
  concreteDark: "#2d3748",
  pipe: "#636e72",
  pipeInner: "#2d3436",
  text: "#e2e8f0",
  textDim: "#94a3b8",
  warning: "#f59e0b",
  danger: "#ef4444",
  chamberColor: "#f59e0b",
  shaftColor: "#00b4d8",
  outletColor: "#10b981",
  gateOpen: "#10b981",
  gateClosed: "#ef4444",
  gatePartial: "#f59e0b",
};

const GROUND_LEVEL = 5.0;
const GRAVITY = 9.81;
const CD = 0.62;

function getManholeGeometry(shaftDia: number, chamberDia: number, shaftDepth: number, chamberDepth: number): ManholeGeometry {
  const totalDepth = shaftDepth + chamberDepth;
  const invert = GROUND_LEVEL - totalDepth;
  const shaftArea = Math.PI * Math.pow(shaftDia / 2, 2);
  const chamberArea = Math.PI * Math.pow(chamberDia / 2, 2);
  const chamberVolume = chamberArea * chamberDepth;
  const shaftVolume = shaftArea * shaftDepth;
  const totalVolume = chamberVolume + shaftVolume;
  return {
    totalDepth, invert,
    shaftTop: GROUND_LEVEL,
    shaftBottom: GROUND_LEVEL - shaftDepth,
    chamberTop: GROUND_LEVEL - shaftDepth,
    chamberBottom: invert,
    shaftArea, chamberArea,
    chamberVolume, shaftVolume, totalVolume,
  };
}

function volumeToElevation(vol: number, geo: ManholeGeometry): number {
  if (vol <= 0) return geo.chamberBottom;
  if (vol <= geo.chamberVolume) {
    return geo.chamberBottom + vol / geo.chamberArea;
  }
  const excess = vol - geo.chamberVolume;
  if (excess <= geo.shaftVolume) {
    return geo.chamberTop + excess / geo.shaftArea;
  }
  const flood = vol - geo.totalVolume;
  return GROUND_LEVEL + flood / 10.0;
}

function calcOutflow(waterElev: number, geo: ManholeGeometry, outletDia: number, outletInvert: number, gateOpen: boolean, gatePosition: number): number {
  if (!gateOpen || outletDia <= 0 || gatePosition <= 0) return 0;
  const outletCenterY = outletInvert + outletDia / 2;
  const head = waterElev - outletCenterY;
  if (head <= 0) return 0;

  const fullArea = Math.PI * Math.pow(outletDia / 2, 2);
  const effectiveArea = fullArea * gatePosition;
  const Q = CD * effectiveArea * Math.sqrt(2 * GRAVITY * head);
  return Q;
}

function riseRate(vol: number, geo: ManholeGeometry, netInflow: number): number {
  if (vol <= geo.chamberVolume) return netInflow / geo.chamberArea;
  if (vol <= geo.totalVolume) return netInflow / geo.shaftArea;
  return netInflow / 10.0;
}

export function ICMManholeSimulator() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const timeRef = useRef<number>(0);

  const [shaftDia, setShaftDia] = useState(0.6);
  const [chamberDia, setChamberDia] = useState(1.2);
  const [shaftDepth, setShaftDepth] = useState(2.0);
  const [chamberDepth, setChamberDepth] = useState(1.5);

  const [inletDia, setInletDia] = useState(0.45);
  const [inflowRate, setInflowRate] = useState(0.015);

  const [outletDia, setOutletDia] = useState(0.45);
  const [outletOffset, setOutletOffset] = useState(0.0);
  const [gateOpen, setGateOpen] = useState(true);
  const [gatePosition, setGatePosition] = useState(1.0);

  const [accumulatedVolume, setAccumulatedVolume] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [simTime, setSimTime] = useState(0);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [showLabels, setShowLabels] = useState(true);
  const [units, setUnits] = useState("metric");
  const [currentOutflow, setCurrentOutflow] = useState(0);

  const geo = useMemo(
    () => getManholeGeometry(shaftDia, chamberDia, shaftDepth, chamberDepth),
    [shaftDia, chamberDia, shaftDepth, chamberDepth]
  );

  const outletInvert = geo.chamberBottom + outletOffset;
  const waterElev = useMemo(() => volumeToElevation(accumulatedVolume, geo), [accumulatedVolume, geo]);
  const isFlooding = waterElev > GROUND_LEVEL;
  const floodDepth = Math.max(0, waterElev - GROUND_LEVEL);
  const pctFull = Math.min(100, (accumulatedVolume / geo.totalVolume) * 100);
  const waterDepthAboveInvert = Math.max(0, waterElev - geo.invert);

  const zone = accumulatedVolume <= 0.0001 ? "EMPTY" :
    accumulatedVolume <= geo.chamberVolume ? "CHAMBER" :
    accumulatedVolume <= geo.totalVolume ? "SHAFT" : "FLOODING";

  const gateLabel = !gateOpen ? "CLOSED" : gatePosition >= 0.95 ? "FULL OPEN" : `${(gatePosition * 100).toFixed(0)}% OPEN`;
  const gateColor = !gateOpen ? COLORS.gateClosed : gatePosition >= 0.95 ? COLORS.gateOpen : COLORS.gatePartial;

  const convert = useCallback((val: number, type: string): string => {
    if (units === "imperial") {
      if (type === "length") return (val * 3.281).toFixed(2) + " ft";
      if (type === "dia") return (val * 39.37).toFixed(0) + " in";
      if (type === "vol") return (val * 35.315).toFixed(2) + " ft³";
      if (type === "flow") return (val * 35.315).toFixed(3) + " cfs";
      if (type === "rate") return (val * 3.281 * 60).toFixed(1) + " ft/min";
    }
    if (type === "length") return val.toFixed(2) + " m";
    if (type === "dia") return (val * 1000).toFixed(0) + " mm";
    if (type === "vol") return val.toFixed(3) + " m³";
    if (type === "flow") return val.toFixed(3) + " m³/s";
    if (type === "rate") return (val * 60).toFixed(2) + " m/min";
    return val.toFixed(2);
  }, [units]);

  useEffect(() => {
    if (!isAnimating) return;
    let running = true;
    let lastTime = performance.now();
    const step = (now: number) => {
      if (!running) return;
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;
      const simDt = dt * 10;

      setAccumulatedVolume(prev => {
        const wElev = volumeToElevation(prev, geo);
        const Qout = calcOutflow(wElev, geo, outletDia, outletInvert, gateOpen, gatePosition);
        setCurrentOutflow(Qout);
        const net = inflowRate - Qout;
        const newVol = Math.max(0, prev + net * simDt);
        return newVol;
      });
      setSimTime(prev => prev + simDt);
      requestAnimationFrame(step);
    };
    const frame = requestAnimationFrame(step);
    return () => { running = false; cancelAnimationFrame(frame); };
  }, [isAnimating, inflowRate, outletDia, outletInvert, gateOpen, gatePosition, geo]);

  useEffect(() => {
    if (!isAnimating) return;
    const interval = setInterval(() => {
      setHistory(prev => {
        const elev = volumeToElevation(accumulatedVolume, geo);
        const entry: HistoryEntry = {
          time: Math.round(simTime),
          elevation: parseFloat(elev.toFixed(3)),
          inflow: parseFloat((inflowRate * 1000).toFixed(1)),
          outflow: parseFloat((currentOutflow * 1000).toFixed(1)),
        };
        const h = [...prev, entry];
        return h.length > 300 ? h.slice(-300) : h;
      });
    }, 150);
    return () => clearInterval(interval);
  }, [isAnimating, accumulatedVolume, simTime, geo, inflowRate, currentOutflow]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const W = canvas.width;
    const H = canvas.height;
    let frame: number;

    const draw = () => {
      timeRef.current += 0.016;
      const t = timeRef.current;
      ctx.clearRect(0, 0, W, H);

      const bgGrad = ctx.createLinearGradient(0, 0, 0, H);
      bgGrad.addColorStop(0, "#0f1923");
      bgGrad.addColorStop(1, "#0a1628");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, W, H);

      const margin = 50;
      const groundY = margin + (H - margin * 2) * 0.2;
      const invertY = margin + (H - margin * 2) * 0.9;
      const totalVisualDepth = invertY - groundY;
      const centerX = W * 0.5;
      const meterToPixel = totalVisualDepth / geo.totalDepth;

      const chamberPixelW = Math.min(W * 0.3, chamberDia * meterToPixel * 0.75);
      const shaftPixelW = Math.min(chamberPixelW * 0.95, shaftDia * meterToPixel * 0.75);
      const inletPixelH = Math.min(chamberPixelW * 0.3, inletDia * meterToPixel * 0.75);
      const outletPixelH = Math.min(chamberPixelW * 0.3, outletDia * meterToPixel * 0.75);
      const wallThick = 7;

      const shaftTopY = groundY;
      const shaftBottomY = groundY + shaftDepth * meterToPixel;
      const chamberTopY = shaftBottomY;
      const chamberBottomY = invertY;

      const chamberLeft = centerX - chamberPixelW / 2;
      const chamberRight = centerX + chamberPixelW / 2;
      const shaftLeft = centerX - shaftPixelW / 2;
      const shaftRight = centerX + shaftPixelW / 2;

      const inletPipeY = chamberBottomY - inletPixelH * 0.9;
      const outletOffsetPix = outletOffset * meterToPixel;
      const outletPipeY = chamberBottomY - outletOffsetPix - outletPixelH * 0.5;

      const soilGrad = ctx.createLinearGradient(0, groundY, 0, invertY + 30);
      soilGrad.addColorStop(0, "#4a3728");
      soilGrad.addColorStop(0.4, "#5c4033");
      soilGrad.addColorStop(1, "#3d2b1f");
      ctx.fillStyle = soilGrad;
      ctx.fillRect(0, groundY, W, invertY - groundY + 40);

      ctx.fillStyle = "rgba(139, 105, 20, 0.1)";
      for (let i = 0; i < 150; i++) {
        ctx.beginPath();
        ctx.arc(Math.random() * W, groundY + Math.random() * (invertY - groundY + 30), Math.random() * 1.5 + 0.3, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.fillStyle = "rgba(120, 120, 120, 0.1)";
      ctx.beginPath();
      ctx.ellipse(centerX, chamberBottomY + 14, chamberPixelW / 2 + 22, 16, 0, 0, Math.PI * 2);
      ctx.fill();

      const grassGrad = ctx.createLinearGradient(0, groundY - 12, 0, groundY + 4);
      grassGrad.addColorStop(0, "#40916c");
      grassGrad.addColorStop(1, "#2d6a4f");
      ctx.fillStyle = grassGrad;
      ctx.fillRect(0, groundY - 8, W, 14);
      ctx.strokeStyle = "#52b788";
      ctx.lineWidth = 1;
      for (let i = 0; i < 70; i++) {
        const gx = (i / 70) * W;
        const sway = Math.sin(t * 1.5 + i * 0.4) * 2.5;
        ctx.beginPath();
        ctx.moveTo(gx, groundY - 8);
        ctx.quadraticCurveTo(gx + sway, groundY - 14, gx + sway * 0.5, groundY - 17 - Math.random() * 3);
        ctx.stroke();
      }

      ctx.fillStyle = COLORS.concrete;
      ctx.fillRect(chamberLeft - wallThick, chamberTopY, wallThick, chamberBottomY - chamberTopY + wallThick);
      ctx.fillRect(chamberRight, chamberTopY, wallThick, chamberBottomY - chamberTopY + wallThick);
      ctx.fillRect(chamberLeft - wallThick, chamberBottomY, chamberPixelW + wallThick * 2, wallThick);
      ctx.fillStyle = "#12121e";
      ctx.fillRect(chamberLeft, chamberTopY, chamberPixelW, chamberBottomY - chamberTopY);

      ctx.fillStyle = COLORS.concreteDark;
      ctx.beginPath();
      ctx.moveTo(chamberLeft, chamberBottomY);
      ctx.lineTo(chamberLeft + chamberPixelW * 0.12, chamberBottomY - 7);
      ctx.lineTo(centerX - inletPixelH * 0.3, chamberBottomY);
      ctx.lineTo(centerX + outletPixelH * 0.3, chamberBottomY);
      ctx.lineTo(chamberRight - chamberPixelW * 0.12, chamberBottomY - 7);
      ctx.lineTo(chamberRight, chamberBottomY);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = COLORS.concrete;
      ctx.fillRect(shaftLeft - wallThick, shaftTopY - 4, wallThick, shaftBottomY - shaftTopY + 4);
      ctx.fillRect(shaftRight, shaftTopY - 4, wallThick, shaftBottomY - shaftTopY + 4);
      ctx.fillStyle = "#12121e";
      ctx.fillRect(shaftLeft, shaftTopY, shaftPixelW, shaftBottomY - shaftTopY);

      ctx.fillStyle = COLORS.concrete;
      ctx.beginPath(); ctx.moveTo(shaftLeft - wallThick, chamberTopY); ctx.lineTo(chamberLeft - wallThick, chamberTopY + 5); ctx.lineTo(chamberLeft - wallThick, chamberTopY); ctx.closePath(); ctx.fill();
      ctx.beginPath(); ctx.moveTo(shaftRight + wallThick, chamberTopY); ctx.lineTo(chamberRight + wallThick, chamberTopY + 5); ctx.lineTo(chamberRight + wallThick, chamberTopY); ctx.closePath(); ctx.fill();
      ctx.fillStyle = "#12121e";
      ctx.beginPath(); ctx.moveTo(shaftLeft, chamberTopY); ctx.lineTo(chamberLeft, chamberTopY + 4); ctx.lineTo(chamberLeft, chamberTopY); ctx.closePath(); ctx.fill();
      ctx.beginPath(); ctx.moveTo(shaftRight, chamberTopY); ctx.lineTo(chamberRight, chamberTopY + 4); ctx.lineTo(chamberRight, chamberTopY); ctx.closePath(); ctx.fill();

      if (!isFlooding) {
        ctx.fillStyle = "#555";
        ctx.fillRect(shaftLeft - 10, groundY - 12, shaftPixelW + 20, 5);
        ctx.fillStyle = "#666";
        for (let i = 0; i < 5; i++) ctx.fillRect(shaftLeft - 6 + (i / 4) * (shaftPixelW + 12), groundY - 11, 2, 3);
      }

      const inletEntryX = chamberLeft - wallThick;
      const inletStartX = 0;
      ctx.fillStyle = COLORS.pipe;
      ctx.fillRect(inletStartX, inletPipeY - inletPixelH / 2 - 3, inletEntryX - inletStartX + wallThick + 2, 4);
      ctx.fillRect(inletStartX, inletPipeY + inletPixelH / 2 - 1, inletEntryX - inletStartX + wallThick + 2, 4);
      ctx.fillStyle = COLORS.pipeInner;
      ctx.fillRect(inletStartX, inletPipeY - inletPixelH / 2 + 1, inletEntryX - inletStartX, inletPixelH - 2);

      const outletExitX = chamberRight + wallThick;
      const outletEndX = W;
      ctx.fillStyle = COLORS.pipe;
      ctx.fillRect(outletExitX - 2, outletPipeY - outletPixelH / 2 - 3, outletEndX - outletExitX + 2, 4);
      ctx.fillRect(outletExitX - 2, outletPipeY + outletPixelH / 2 - 1, outletEndX - outletExitX + 2, 4);
      ctx.fillStyle = COLORS.pipeInner;
      ctx.fillRect(outletExitX, outletPipeY - outletPixelH / 2 + 1, outletEndX - outletExitX, outletPixelH - 2);

      const gateX = outletExitX + 6;
      const gateFullH = outletPixelH + 6;
      const gateOpenH = gateOpen ? gateFullH * (1 - gatePosition) : gateFullH;
      ctx.fillStyle = "#333";
      ctx.fillRect(gateX - 2, outletPipeY - gateFullH / 2 - 8, 10, 8);
      ctx.fillRect(gateX + 1, outletPipeY - gateFullH / 2 - 16, 4, 10);
      ctx.fillStyle = !gateOpen ? COLORS.gateClosed : gatePosition < 0.5 ? COLORS.gatePartial : COLORS.gateOpen;
      if (gateOpenH > 1) {
        ctx.fillRect(gateX, outletPipeY - gateFullH / 2, 6, gateOpenH);
      }
      ctx.strokeStyle = "#555";
      ctx.lineWidth = 1.5;
      ctx.strokeRect(gateX - 1, outletPipeY - gateFullH / 2, 8, gateFullH);

      if (waterDepthAboveInvert > 0.01) {
        let waterSurfaceY: number;
        if (waterElev <= geo.chamberTop) {
          waterSurfaceY = chamberBottomY - waterDepthAboveInvert * meterToPixel;
        } else if (waterElev <= geo.shaftTop) {
          waterSurfaceY = chamberTopY - (waterElev - geo.chamberTop) * meterToPixel;
        } else {
          waterSurfaceY = groundY - Math.min(floodDepth * meterToPixel, 28);
        }

        const chamberWaterTop = Math.max(waterSurfaceY, chamberTopY);
        if (chamberWaterTop < chamberBottomY) {
          const wGrad = ctx.createLinearGradient(0, chamberWaterTop, 0, chamberBottomY);
          wGrad.addColorStop(0, "rgba(0, 180, 216, 0.65)");
          wGrad.addColorStop(0.5, "rgba(0, 119, 182, 0.75)");
          wGrad.addColorStop(1, "rgba(0, 78, 146, 0.85)");
          ctx.fillStyle = wGrad;
          ctx.fillRect(chamberLeft + 1, chamberWaterTop, chamberPixelW - 2, chamberBottomY - chamberWaterTop);
        }

        if (waterElev > geo.chamberTop) {
          const shaftWaterTop = Math.max(waterSurfaceY, shaftTopY);
          const sGrad = ctx.createLinearGradient(0, shaftWaterTop, 0, chamberTopY);
          sGrad.addColorStop(0, "rgba(72, 202, 228, 0.6)");
          sGrad.addColorStop(1, "rgba(0, 180, 216, 0.7)");
          ctx.fillStyle = sGrad;
          ctx.fillRect(shaftLeft + 1, shaftWaterTop, shaftPixelW - 2, chamberTopY - shaftWaterTop);
        }

        const inShaft = waterElev > geo.chamberTop && waterElev <= geo.shaftTop;
        const wLeft = inShaft ? shaftLeft + 2 : chamberLeft + 2;
        const wRight = inShaft ? shaftRight - 2 : chamberRight - 2;
        const wY = Math.max(waterSurfaceY, shaftTopY + 2);
        if (!isFlooding) {
          ctx.strokeStyle = "rgba(144, 224, 239, 0.7)";
          ctx.lineWidth = 2;
          ctx.beginPath();
          for (let x = wLeft; x < wRight; x++) {
            const freq = inShaft ? 0.18 : 0.09;
            const wave = Math.sin((x - wLeft) * freq + t * 3.5) * (isAnimating ? 2.5 : 1.5);
            if (x === wLeft) ctx.moveTo(x, wY + wave); else ctx.lineTo(x, wY + wave);
          }
          ctx.stroke();
        }

        const inPipeWaterH = Math.min(inletPixelH * 0.6, inletPixelH * Math.min(1, inflowRate * 25));
        ctx.fillStyle = "rgba(0, 150, 200, 0.6)";
        ctx.fillRect(inletStartX, inletPipeY + inletPixelH / 2 - inPipeWaterH, inletEntryX - inletStartX, inPipeWaterH - 1);

        if (currentOutflow > 0.0001 && gateOpen && gatePosition > 0) {
          const outPipeWaterH = Math.min(outletPixelH * 0.55, outletPixelH * Math.min(1, currentOutflow * 30));
          ctx.fillStyle = "rgba(16, 185, 129, 0.5)";
          ctx.fillRect(gateX + 8, outletPipeY + outletPixelH / 2 - outPipeWaterH, outletEndX - gateX - 8, outPipeWaterH - 1);

          const headWaterH = Math.min(outletPixelH - 2, outletPixelH * Math.min(1, (waterElev - outletInvert) / outletDia));
          if (headWaterH > 0) {
            ctx.fillStyle = "rgba(0, 150, 200, 0.55)";
            ctx.fillRect(outletExitX, outletPipeY + outletPixelH / 2 - headWaterH, gateX - outletExitX, headWaterH);
          }

          if (isAnimating) {
            ctx.strokeStyle = "rgba(16, 185, 129, 0.5)";
            ctx.lineWidth = 1.5;
            const speed = 50 + currentOutflow * 800;
            for (let i = 0; i < 5; i++) {
              const ax = gateX + 15 + ((t * speed + i * 40) % (outletEndX - gateX - 25));
              const ay = outletPipeY + 2;
              ctx.beginPath();
              ctx.moveTo(ax - 5, ay - 3); ctx.lineTo(ax, ay); ctx.lineTo(ax - 5, ay + 3);
              ctx.stroke();
            }
          }
        }

        if (isAnimating && inflowRate > 0) {
          ctx.strokeStyle = "rgba(144, 224, 239, 0.5)";
          ctx.lineWidth = 1.5;
          const speed = 60 + inflowRate * 600;
          for (let i = 0; i < 6; i++) {
            const ax = 15 + ((t * speed + i * 40) % (inletEntryX - 15));
            const ay = inletPipeY + 2;
            ctx.beginPath();
            ctx.moveTo(ax - 5, ay - 3); ctx.lineTo(ax, ay); ctx.lineTo(ax - 5, ay + 3);
            ctx.stroke();
          }
          for (let i = 0; i < 8; i++) {
            const bx = chamberLeft + 3 + Math.random() * 14;
            const by = inletPipeY - 5 + Math.random() * (inletPixelH + 4);
            ctx.strokeStyle = `rgba(144, 224, 239, ${Math.random() * 0.3 + 0.1})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(bx, by, Math.random() * 3 + 1, 0, Math.PI * 2);
            ctx.stroke();
          }
        }

        if (isAnimating && currentOutflow > 0.001) {
          for (let i = 0; i < 6; i++) {
            const bx = chamberRight - 16 + Math.random() * 14;
            const by = outletPipeY - 4 + Math.random() * (outletPixelH + 2);
            ctx.strokeStyle = `rgba(16, 185, 129, ${Math.random() * 0.25 + 0.1})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(bx, by, Math.random() * 2.5 + 0.5, 0, Math.PI * 2);
            ctx.stroke();
          }
        }

        if (accumulatedVolume > 0) {
          for (let i = 0; i < 18; i++) {
            const px_n = Math.sin(t * 1.1 + i * 2.5) * 0.4 + 0.5;
            const py_n = Math.sin(t * 0.7 + i * 1.8) * 0.5 + 0.5;
            let px: number, py: number;
            const inShaftZone = waterElev > geo.chamberTop;
            if (inShaftZone && py_n < 0.3) {
              px = shaftLeft + 4 + px_n * (shaftPixelW - 8);
              const top = Math.max(waterSurfaceY, shaftTopY);
              py = top + py_n * 3.3 * (chamberTopY - top);
            } else {
              px = chamberLeft + 4 + px_n * (chamberPixelW - 8);
              const top = inShaftZone ? chamberTopY : Math.max(waterSurfaceY, chamberTopY);
              py = top + (py_n - (inShaftZone ? 0.3 : 0)) * 1.43 * (chamberBottomY - top);
            }
            const limitTop = inShaftZone ? Math.max(waterSurfaceY, shaftTopY) : Math.max(waterSurfaceY, chamberTopY);
            if (py > limitTop && py < chamberBottomY) {
              ctx.fillStyle = `rgba(144, 224, 239, ${0.12 + Math.sin(t + i) * 0.08})`;
              ctx.beginPath(); ctx.arc(px, py, 1.5, 0, Math.PI * 2); ctx.fill();
            }
          }
        }

        if (isFlooding) {
          const floodExtent = Math.min(floodDepth * 100, W * 0.42);
          const fGrad = ctx.createRadialGradient(centerX, groundY - 6, shaftPixelW / 2, centerX, groundY - 6, floodExtent + 50);
          fGrad.addColorStop(0, "rgba(0, 180, 216, 0.5)");
          fGrad.addColorStop(0.5, "rgba(0, 180, 216, 0.25)");
          fGrad.addColorStop(1, "rgba(0, 180, 216, 0.0)");
          ctx.fillStyle = fGrad;
          const fH = Math.min(floodDepth * meterToPixel, 26);
          ctx.fillRect(centerX - floodExtent - 50, groundY - 10 - fH, (floodExtent + 50) * 2, fH + 6);
          ctx.strokeStyle = "rgba(144, 224, 239, 0.3)";
          ctx.lineWidth = 1;
          for (let r = 1; r <= 5; r++) {
            const radius = shaftPixelW / 2 + r * 15 + Math.sin(t * 2 + r) * 3;
            ctx.beginPath(); ctx.ellipse(centerX, groundY - 8, radius, radius * 0.2, 0, 0, Math.PI * 2); ctx.stroke();
          }
          for (let i = 0; i < 8; i++) {
            const angle = (t * 1.3 + i * 0.7) % (Math.PI * 2);
            ctx.fillStyle = `rgba(144, 224, 239, ${0.2 + Math.random() * 0.2})`;
            ctx.beginPath(); ctx.arc(centerX + Math.cos(angle) * (8 + i * 3), groundY - 14 - Math.abs(Math.sin(t * 4 + i)) * 10, 1.2, 0, Math.PI * 2); ctx.fill();
          }
          ctx.save();
          ctx.translate(centerX + 14, groundY - 17);
          ctx.rotate(0.18 + Math.sin(t) * 0.04);
          ctx.fillStyle = "#555";
          ctx.fillRect(-shaftPixelW / 2 - 8, -2, shaftPixelW + 16, 4);
          ctx.restore();
        }
      }

      if (showLabels) {
        ctx.font = "11px 'JetBrains Mono', monospace";

        const sdY = (shaftTopY + shaftBottomY) / 2 - 5;
        ctx.fillStyle = ctx.strokeStyle = COLORS.shaftColor; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(shaftLeft + 3, sdY); ctx.lineTo(shaftRight - 3, sdY); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(shaftLeft + 3, sdY); ctx.lineTo(shaftLeft + 8, sdY - 3); ctx.lineTo(shaftLeft + 8, sdY + 3); ctx.fill();
        ctx.beginPath(); ctx.moveTo(shaftRight - 3, sdY); ctx.lineTo(shaftRight - 8, sdY - 3); ctx.lineTo(shaftRight - 8, sdY + 3); ctx.fill();
        ctx.fillStyle = "#fff";
        ctx.textAlign = "center";
        ctx.fillText(`Shaft Ø ${convert(shaftDia, "dia")}`, centerX, sdY - 8);

        const cdY = (chamberTopY + chamberBottomY) / 2;
        ctx.fillStyle = ctx.strokeStyle = COLORS.chamberColor;
        ctx.beginPath(); ctx.moveTo(chamberLeft + 3, cdY); ctx.lineTo(chamberRight - 3, cdY); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(chamberLeft + 3, cdY); ctx.lineTo(chamberLeft + 8, cdY - 3); ctx.lineTo(chamberLeft + 8, cdY + 3); ctx.fill();
        ctx.beginPath(); ctx.moveTo(chamberRight - 3, cdY); ctx.lineTo(chamberRight - 8, cdY - 3); ctx.lineTo(chamberRight - 8, cdY + 3); ctx.fill();
        ctx.fillStyle = "#fff";
        ctx.fillText(`Chamber Ø ${convert(chamberDia, "dia")}`, centerX, cdY - 8);

        ctx.textAlign = "left";
        ctx.fillStyle = COLORS.accent;
        ctx.fillText(`Inlet Ø ${convert(inletDia, "dia")}`, 8, inletPipeY - inletPixelH / 2 - 8);
        ctx.fillStyle = COLORS.textDim;
        ctx.font = "10px 'JetBrains Mono', monospace";
        ctx.fillText(`Q=${convert(inflowRate, "flow")}`, 8, inletPipeY - inletPixelH / 2 - 22);

        ctx.font = "11px 'JetBrains Mono', monospace";
        ctx.textAlign = "right";
        ctx.fillStyle = COLORS.outletColor;
        ctx.fillText(`Outlet Ø ${convert(outletDia, "dia")}`, W - 8, outletPipeY - outletPixelH / 2 - 8);
        ctx.fillStyle = COLORS.textDim;
        ctx.font = "10px 'JetBrains Mono', monospace";
        ctx.fillText(`Q=${convert(currentOutflow, "flow")}`, W - 8, outletPipeY - outletPixelH / 2 - 22);

        ctx.textAlign = "left";
        ctx.font = "bold 9px 'JetBrains Mono', monospace";
        ctx.fillStyle = gateColor;
        ctx.fillText(gateLabel, gateX - 4, outletPipeY - outletPixelH / 2 - 32);

        ctx.font = "10px 'JetBrains Mono', monospace";
        ctx.textAlign = "left";
        const lx = chamberRight + wallThick + 50;
        ctx.fillStyle = COLORS.textDim;
        ctx.fillText(`GL: ${convert(GROUND_LEVEL, "length")}`, lx, groundY + 4);
        ctx.fillStyle = COLORS.shaftColor;
        ctx.fillText(`Shaft: ${convert(shaftDepth, "length")}`, lx, (shaftTopY + shaftBottomY) / 2 + 4);
        ctx.fillStyle = COLORS.chamberColor;
        ctx.fillText(`Chamber: ${convert(chamberDepth, "length")}`, lx, (chamberTopY + chamberBottomY) / 2 + 4);
        ctx.fillStyle = COLORS.textDim;
        ctx.fillText(`IL: ${convert(geo.invert, "length")}`, lx, invertY + 4);

        if (waterDepthAboveInvert > 0.01) {
          ctx.font = "bold 11px 'JetBrains Mono', monospace";
          ctx.fillStyle = isFlooding ? COLORS.danger : zone === "SHAFT" ? COLORS.shaftColor : COLORS.chamberColor;
          const wlText = isFlooding ? `⚠ FLOOD +${convert(floodDepth, "length")}` : `WL: ${convert(waterElev, "length")}`;
          let wlPixY: number;
          if (waterElev <= geo.chamberTop) wlPixY = chamberBottomY - waterDepthAboveInvert * meterToPixel;
          else if (waterElev <= geo.shaftTop) wlPixY = chamberTopY - (waterElev - geo.chamberTop) * meterToPixel;
          else wlPixY = groundY - 28;
          ctx.fillText(wlText, lx, Math.max(wlPixY, shaftTopY + 10));
        }
      }

      ctx.font = "bold 13px 'JetBrains Mono', monospace";
      ctx.fillStyle = COLORS.text;
      ctx.textAlign = "center";
      ctx.fillText("ICM InfoWorks — Manhole with Inlet & Outlet Pipes", W / 2, 20);
      ctx.font = "10px 'JetBrains Mono', monospace";
      ctx.fillStyle = COLORS.textDim;
      ctx.fillText("Volume-driven: Q_in fills manhole → head drives Q_out through outlet → gate valve controls outflow", W / 2, 35);

      frame = requestAnimationFrame(draw);
    };
    frame = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frame);
  }, [waterElev, shaftDia, chamberDia, shaftDepth, chamberDepth, inletDia, outletDia, outletOffset,
      showLabels, isFlooding, floodDepth, geo, convert, units, zone, isAnimating, inflowRate,
      accumulatedVolume, waterDepthAboveInvert, currentOutflow, gateOpen, gatePosition, gateLabel, gateColor, outletInvert]);

  const reset = () => {
    setAccumulatedVolume(0);
    setSimTime(0);
    setHistory([]);
    setIsAnimating(false);
    setCurrentOutflow(0);
  };

  const Slider = ({ label, value, onChange, min, max, step, color = COLORS.accent, suffix = "", disabled = false }: SliderProps) => (
    <div className="mb-2">
      <div className="flex justify-between items-center mb-0.5">
        <span className="text-xs" style={{ color: disabled ? "#444" : COLORS.textDim }}>{label}</span>
        <span className="text-xs font-mono font-bold" style={{ color: disabled ? "#444" : color }}>{value.toFixed(step < 0.01 ? 3 : 2)}{suffix}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value} disabled={disabled}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
        style={{ background: `linear-gradient(to right, ${color} 0%, ${color} ${((value - min) / (max - min)) * 100}%, #1e3a5f ${((value - min) / (max - min)) * 100}%, #1e3a5f 100%)`, opacity: disabled ? 0.35 : 1 }} />
    </div>
  );

  const Stat = ({ label, value, color = COLORS.accent, alert = false }: StatProps) => (
    <div className="rounded-lg p-1.5 text-center" style={{ background: alert ? "rgba(239,68,68,0.12)" : "rgba(0,180,216,0.06)", border: `1px solid ${alert ? "rgba(239,68,68,0.25)" : COLORS.panelBorder}` }}>
      <div style={{ color: COLORS.textDim, fontSize: 9 }}>{label}</div>
      <div className="font-mono font-bold" style={{ color: alert ? COLORS.danger : color, fontSize: 11 }}>{value}</div>
    </div>
  );

  const areaRatio = (geo.chamberArea / geo.shaftArea).toFixed(1);
  const netFlow = inflowRate - currentOutflow;
  const netRise = riseRate(accumulatedVolume, geo, Math.max(0, netFlow));

  return (
    <div data-testid="diagram-icm-manhole-simulator" className="p-2" style={{ background: COLORS.bg, color: COLORS.text, fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-2">
          <h1 className="text-lg font-bold" style={{ color: COLORS.accent }}>💧 ICM InfoWorks Manhole — Inlet + Outlet with Gate Valve</h1>
          <p className="text-xs mt-0.5" style={{ color: COLORS.textDim }}>
            Inflow fills volume → head drives outflow through orifice equation (Q=Cd·A·√2gh) → gate valve controls outlet capacity
          </p>
        </div>

        <div className="flex flex-col xl:flex-row gap-2.5">
          <div className="flex-1 rounded-xl overflow-hidden" style={{ border: `1px solid ${COLORS.panelBorder}`, background: COLORS.panel }}>
            <canvas ref={canvasRef} width={720} height={480} className="w-full" style={{ display: "block" }} />
          </div>

          <div className="w-full xl:w-60 space-y-2">
            <div className="rounded-xl p-2.5" style={{ background: COLORS.panel, border: `1px solid ${COLORS.panelBorder}` }}>
              <h3 className="text-xs font-bold uppercase tracking-widest mb-1.5" style={{ color: COLORS.accent }}>Manhole</h3>
              <Slider label="Shaft Ø" value={shaftDia} onChange={(v: number) => setShaftDia(Math.min(v, chamberDia))} min={0.3} max={2.0} step={0.05} suffix=" m" color={COLORS.shaftColor} disabled={isAnimating} />
              <Slider label="Chamber Ø" value={chamberDia} onChange={(v: number) => { setChamberDia(v); if (shaftDia > v) setShaftDia(v); }} min={0.5} max={3.0} step={0.05} suffix=" m" color={COLORS.chamberColor} disabled={isAnimating} />
              <Slider label="Shaft Depth" value={shaftDepth} onChange={setShaftDepth} min={0.5} max={4.0} step={0.1} suffix=" m" disabled={isAnimating} />
              <Slider label="Chamber Depth" value={chamberDepth} onChange={setChamberDepth} min={0.5} max={3.0} step={0.1} suffix=" m" disabled={isAnimating} />
            </div>

            <div className="rounded-xl p-2.5" style={{ background: COLORS.panel, border: `1px solid ${COLORS.panelBorder}` }}>
              <h3 className="text-xs font-bold uppercase tracking-widest mb-1.5" style={{ color: COLORS.accent }}>
                ← Inlet Pipe
              </h3>
              <Slider label="Pipe Ø" value={inletDia} onChange={setInletDia} min={0.1} max={1.2} step={0.05} suffix=" m" color={COLORS.accent} disabled={isAnimating} />
              <Slider label="Inflow Rate" value={inflowRate} onChange={setInflowRate} min={0.001} max={0.1} step={0.001} suffix=" m³/s" color={COLORS.accent} />
            </div>

            <div className="rounded-xl p-2.5" style={{ background: COLORS.panel, border: `1px solid ${COLORS.panelBorder}` }}>
              <h3 className="text-xs font-bold uppercase tracking-widest mb-1.5" style={{ color: COLORS.outletColor }}>
                Outlet Pipe →
              </h3>
              <Slider label="Pipe Ø" value={outletDia} onChange={setOutletDia} min={0.1} max={1.5} step={0.05} suffix=" m" color={COLORS.outletColor} disabled={isAnimating} />
              <Slider label="Invert Offset" value={outletOffset} onChange={setOutletOffset} min={0} max={chamberDepth * 0.8} step={0.05} suffix=" m" color={COLORS.outletColor} disabled={isAnimating} />

              <div className="mt-1 pt-1.5 border-t" style={{ borderColor: COLORS.panelBorder }}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold" style={{ color: gateColor }}>Gate Valve: {gateLabel}</span>
                  <button onClick={() => setGateOpen(!gateOpen)}
                    className="px-2 py-0.5 rounded text-xs font-bold transition-all"
                    style={{ background: gateOpen ? "rgba(16,185,129,0.2)" : "rgba(239,68,68,0.2)", border: `1px solid ${gateOpen ? COLORS.gateOpen : COLORS.gateClosed}`, color: gateOpen ? COLORS.gateOpen : COLORS.gateClosed }}>
                    {gateOpen ? "OPEN" : "CLOSED"}
                  </button>
                </div>
                {gateOpen && (
                  <Slider label="Gate Position" value={gatePosition} onChange={setGatePosition} min={0.05} max={1.0} step={0.05} suffix="" color={gateColor} />
                )}
              </div>
            </div>

            <div className="flex gap-2">
              <button onClick={() => setIsAnimating(!isAnimating)} className="flex-1 py-2 rounded-lg text-xs font-bold transition-all"
                style={{ background: isAnimating ? "rgba(239,68,68,0.2)" : "rgba(0,180,216,0.2)", border: `1px solid ${isAnimating ? COLORS.danger : COLORS.accent}`, color: isAnimating ? COLORS.danger : COLORS.accent }}>
                {isAnimating ? "⏸ PAUSE" : "▶ START"}
              </button>
              <button onClick={reset} className="flex-1 py-2 rounded-lg text-xs font-bold"
                style={{ background: "rgba(148,163,184,0.1)", border: `1px solid ${COLORS.panelBorder}`, color: COLORS.textDim }}>
                ↺ RESET
              </button>
            </div>

            <div className="rounded-xl p-2 flex items-center justify-between" style={{ background: COLORS.panel, border: `1px solid ${COLORS.panelBorder}` }}>
              <div className="flex items-center gap-2">
                <span className="text-xs" style={{ color: COLORS.textDim }}>Labels</span>
                <button onClick={() => setShowLabels(!showLabels)} className="w-8 h-4 rounded-full relative" style={{ background: showLabels ? COLORS.accent : COLORS.panelBorder }}>
                  <div className="w-3 h-3 rounded-full bg-white absolute top-0.5 transition-all" style={{ left: showLabels ? 17 : 2 }} />
                </button>
              </div>
              <div className="flex rounded-lg overflow-hidden" style={{ border: `1px solid ${COLORS.panelBorder}` }}>
                {(["metric", "imperial"] as const).map(u => (
                  <button key={u} onClick={() => setUnits(u)} className="px-2 py-0.5 text-xs font-bold" style={{ background: units === u ? COLORS.accent : "transparent", color: units === u ? COLORS.bg : COLORS.textDim }}>
                    {u === "metric" ? "SI" : "US"}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-2.5 mt-2.5">
          <div className="w-full lg:w-56 rounded-xl p-2.5" style={{ background: COLORS.panel, border: `1px solid ${COLORS.panelBorder}` }}>
            <h3 className="text-xs font-bold uppercase tracking-widest mb-1.5" style={{ color: COLORS.accent }}>Hydraulic State</h3>
            <div className="grid grid-cols-2 gap-1.5">
              <Stat label="Zone" value={zone} alert={zone === "FLOODING"} color={zone === "CHAMBER" ? COLORS.chamberColor : zone === "SHAFT" ? COLORS.shaftColor : COLORS.accent} />
              <Stat label="% Full" value={`${pctFull.toFixed(1)}%`} alert={pctFull > 100} />
              <Stat label="Q in" value={convert(inflowRate, "flow")} color={COLORS.accent} />
              <Stat label="Q out" value={convert(currentOutflow, "flow")} color={COLORS.outletColor} />
              <Stat label="Q net" value={convert(Math.abs(netFlow), "flow")} color={netFlow > 0 ? COLORS.warning : COLORS.outletColor} />
              <Stat label="dh/dt" value={convert(netRise, "rate")} color={zone === "SHAFT" ? COLORS.warning : COLORS.accent} />
              <Stat label="Volume" value={convert(Math.min(accumulatedVolume, geo.totalVolume * 1.3), "vol")} />
              <Stat label="WL Elev" value={convert(waterElev, "length")} />
              <Stat label="Head" value={convert(waterDepthAboveInvert, "length")} />
              <Stat label="Time" value={`${simTime.toFixed(0)} s`} />
            </div>
            {isFlooding && (
              <div className="mt-1.5 p-1.5 rounded-lg text-center text-xs font-bold" style={{ background: "rgba(239,68,68,0.12)", color: COLORS.danger, border: "1px solid rgba(239,68,68,0.25)" }}>
                ⚠ FLOOD: +{convert(floodDepth, "length")}
              </div>
            )}
            {netFlow < -0.0001 && (
              <div className="mt-1.5 p-1.5 rounded-lg text-center text-xs font-bold" style={{ background: "rgba(16,185,129,0.12)", color: COLORS.outletColor, border: "1px solid rgba(16,185,129,0.25)" }}>
                ✓ DRAINING: Q_out &gt; Q_in
              </div>
            )}

            <div className="mt-2 space-y-1.5">
              <div>
                <div className="flex justify-between text-xs mb-0.5">
                  <span style={{ color: COLORS.chamberColor }}>Chamber</span>
                  <span className="font-mono" style={{ color: COLORS.chamberColor }}>{convert(geo.chamberVolume, "vol")}</span>
                </div>
                <div className="h-2.5 rounded-full overflow-hidden" style={{ background: "rgba(245,158,11,0.1)" }}>
                  <div className="h-full rounded-full transition-all duration-200" style={{ width: `${Math.min(100, (accumulatedVolume / geo.chamberVolume) * 100)}%`, background: COLORS.chamberColor }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-0.5">
                  <span style={{ color: COLORS.shaftColor }}>Shaft</span>
                  <span className="font-mono" style={{ color: COLORS.shaftColor }}>{convert(geo.shaftVolume, "vol")}</span>
                </div>
                <div className="h-2.5 rounded-full overflow-hidden" style={{ background: "rgba(0,180,216,0.1)" }}>
                  <div className="h-full rounded-full transition-all duration-200" style={{ width: `${Math.min(100, Math.max(0, ((accumulatedVolume - geo.chamberVolume) / geo.shaftVolume) * 100))}%`, background: COLORS.shaftColor }} />
                </div>
              </div>
              <div className="flex justify-between text-xs pt-1 border-t" style={{ borderColor: COLORS.panelBorder }}>
                <span style={{ color: COLORS.textDim }}>Area Ratio</span>
                <span className="font-mono font-bold" style={{ color: COLORS.warning }}>{areaRatio}×</span>
              </div>
            </div>
          </div>

          <div className="flex-1 rounded-xl p-2.5" style={{ background: COLORS.panel, border: `1px solid ${COLORS.panelBorder}` }}>
            <h3 className="text-xs font-bold uppercase tracking-widest mb-1.5" style={{ color: COLORS.accent }}>
              Water Level & Flow Hydrograph
            </h3>
            {history.length > 3 ? (
              <div className="space-y-2">
                <ResponsiveContainer width="100%" height={130}>
                  <AreaChart data={history} margin={{ top: 5, right: 10, bottom: 15, left: 10 }}>
                    <defs>
                      <linearGradient id="wg" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#00b4d8" stopOpacity={0.35} />
                        <stop offset="95%" stopColor="#00b4d8" stopOpacity={0.05} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="time" tick={{ fill: COLORS.textDim, fontSize: 9 }} label={{ value: "Time (s)", position: "bottom", fill: COLORS.textDim, fontSize: 9 }} />
                    <YAxis tick={{ fill: COLORS.textDim, fontSize: 9 }} label={{ value: "Elev (m)", angle: -90, position: "insideLeft", fill: COLORS.textDim, fontSize: 9 }} domain={['auto', 'auto']} />
                    <Tooltip contentStyle={{ background: COLORS.panel, border: `1px solid ${COLORS.panelBorder}`, borderRadius: 6, fontSize: 10 }}
                      formatter={(val: number) => [val.toFixed(3) + " m", "WL Elev"]} />
                    <ReferenceLine y={GROUND_LEVEL} stroke={COLORS.danger} strokeDasharray="4 4" label={{ value: "GL", fill: COLORS.danger, fontSize: 8, position: "right" }} />
                    <ReferenceLine y={geo.chamberTop} stroke={COLORS.chamberColor} strokeDasharray="3 3" label={{ value: "Ch Top", fill: COLORS.chamberColor, fontSize: 8, position: "right" }} />
                    <Area type="monotone" dataKey="elevation" stroke={COLORS.accent} fill="url(#wg)" strokeWidth={2} dot={false} />
                  </AreaChart>
                </ResponsiveContainer>

                <ResponsiveContainer width="100%" height={100}>
                  <ComposedChart data={history} margin={{ top: 5, right: 10, bottom: 15, left: 10 }}>
                    <XAxis dataKey="time" tick={{ fill: COLORS.textDim, fontSize: 9 }} label={{ value: "Time (s)", position: "bottom", fill: COLORS.textDim, fontSize: 9 }} />
                    <YAxis tick={{ fill: COLORS.textDim, fontSize: 9 }} label={{ value: "Q (L/s)", angle: -90, position: "insideLeft", fill: COLORS.textDim, fontSize: 9 }} domain={[0, 'auto']} />
                    <Tooltip contentStyle={{ background: COLORS.panel, border: `1px solid ${COLORS.panelBorder}`, borderRadius: 6, fontSize: 10 }}
                      formatter={(val: number, name: string) => [val.toFixed(1) + " L/s", name === "inflow" ? "Inflow" : "Outflow"]} />
                    <Line type="monotone" dataKey="inflow" stroke={COLORS.accent} strokeWidth={1.5} dot={false} name="inflow" />
                    <Line type="monotone" dataKey="outflow" stroke={COLORS.outletColor} strokeWidth={1.5} dot={false} name="outflow" />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="flex items-center justify-center h-48 text-xs" style={{ color: COLORS.textDim }}>
                Press ▶ START — the top chart shows WL with slope change at chamber→shaft; bottom chart shows inflow vs head-driven outflow
              </div>
            )}
          </div>

          <div className="w-full lg:w-56 rounded-xl p-2.5" style={{ background: COLORS.panel, border: `1px solid ${COLORS.panelBorder}` }}>
            <h3 className="text-xs font-bold uppercase tracking-widest mb-1.5" style={{ color: COLORS.accent }}>ICM Physics</h3>
            <div className="space-y-2 text-xs leading-relaxed" style={{ color: COLORS.textDim }}>
              <div className="p-2 rounded-lg" style={{ background: "rgba(0,180,216,0.05)" }}>
                <strong style={{ color: COLORS.accent }}>Water Level Rise:</strong><br />
                dh/dt = Q_net / A(h)<br />
                Chamber: A = {geo.chamberArea.toFixed(3)} m²<br />
                Shaft: A = {geo.shaftArea.toFixed(3)} m²<br />
                Ratio: <strong style={{ color: COLORS.warning }}>{areaRatio}× faster in shaft</strong>
              </div>
              <div className="p-2 rounded-lg" style={{ background: "rgba(16,185,129,0.05)" }}>
                <strong style={{ color: COLORS.outletColor }}>Outlet Outflow:</strong><br />
                Q = Cd · A_eff · √(2gh)<br />
                Cd = {CD}, g = {GRAVITY} m/s²<br />
                A_eff = A_pipe × gate_pos<br />
                h = WL - pipe center<br />
                <strong style={{ color: COLORS.outletColor }}>More head → more outflow</strong>
              </div>
              <div className="p-2 rounded-lg" style={{ background: "rgba(245,158,11,0.05)" }}>
                <strong style={{ color: COLORS.warning }}>Equilibrium:</strong><br />
                System seeks Q_in = Q_out<br />
                WL stabilizes when balanced<br />
                Close gate → surcharge<br />
                Small outlet → slow drain → flood
              </div>
              <div className="p-2 rounded-lg" style={{ background: "rgba(239,68,68,0.05)" }}>
                <strong style={{ color: COLORS.danger }}>Try This:</strong><br />
                1. Start with gate open → watch WL stabilize<br />
                2. Close gate mid-sim → watch surcharge<br />
                3. Set small outlet Ø → see flooding<br />
                4. Reopen gate → watch drain
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
