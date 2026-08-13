/**
 * Illustration primitives for the Builder Wave poster.
 * Every object is meaningful: Goa coastline, lighthouse (signal origin),
 * palms (place), sun (atmosphere), towers + traces (transmission).
 */

export type Ctx = CanvasRenderingContext2D;

export const PALETTE = {
  deep: "#062E1C",
  green: "#0B5A32",
  greenMid: "#0F7A45",
  teal: "#128A7A",
  cream: "#F6F2E3",
  paper: "#EFE9D6",
  gold: "#F5DE19",
  amber: "#F2A93B",
  pink: "#F4237F",
  ink: "#042315",
};

export function roundRect(ctx: Ctx, x: number, y: number, w: number, h: number, r = 6) {
  const rr = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
}

/** Warm tropical sky with a low Goa sun and atmospheric haze. */
export function sky(ctx: Ctx, w: number, horizon: number) {
  const g = ctx.createLinearGradient(0, 0, 0, horizon);
  g.addColorStop(0, PALETTE.deep);
  g.addColorStop(0.45, "#0A4A2C");
  g.addColorStop(0.78, "#1A7A55");
  g.addColorStop(1, "#E9A84C");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, horizon);

  // sun glow
  const sx = w * 0.7;
  const sy = horizon - 46;
  const glow = ctx.createRadialGradient(sx, sy, 8, sx, sy, 300);
  glow.addColorStop(0, "rgba(245,222,25,0.85)");
  glow.addColorStop(0.35, "rgba(242,169,59,0.35)");
  glow.addColorStop(1, "rgba(242,169,59,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, w, horizon);

  ctx.fillStyle = "rgba(246,242,227,0.92)";
  ctx.beginPath();
  ctx.arc(sx, sy, 54, 0, Math.PI * 2);
  ctx.fill();
  // sun banding (print-style)
  ctx.save();
  ctx.beginPath();
  ctx.arc(sx, sy, 54, 0, Math.PI * 2);
  ctx.clip();
  ctx.fillStyle = "rgba(242,169,59,0.75)";
  for (let i = 0; i < 6; i++) ctx.fillRect(sx - 60, sy + 6 + i * 9, 120, 3.5);
  ctx.restore();
}

/** Ocean band with sun reflection and coastline foam. */
export function ocean(ctx: Ctx, w: number, horizon: number, bottom: number) {
  const g = ctx.createLinearGradient(0, horizon, 0, bottom);
  g.addColorStop(0, "#0E6E63");
  g.addColorStop(0.5, "#0B5A4E");
  g.addColorStop(1, "#073F30");
  ctx.fillStyle = g;
  ctx.fillRect(0, horizon, w, bottom - horizon);

  const sx = w * 0.7;
  ctx.save();
  ctx.globalAlpha = 0.55;
  ctx.strokeStyle = PALETTE.gold;
  for (let i = 0; i < 16; i++) {
    const y = horizon + 8 + i * ((bottom - horizon) / 18);
    const len = 30 + i * 9 + (i % 3) * 14;
    ctx.lineWidth = 1 + (i % 2) * 0.8;
    ctx.globalAlpha = 0.5 - i * 0.026;
    ctx.beginPath();
    ctx.moveTo(sx - len / 2, y);
    ctx.lineTo(sx + len / 2, y);
    ctx.stroke();
  }
  ctx.restore();

  // ocean texture strokes
  ctx.save();
  ctx.strokeStyle = "rgba(246,242,227,0.16)";
  ctx.lineWidth = 1;
  for (let i = 0; i < 22; i++) {
    const y = horizon + 6 + i * ((bottom - horizon) / 22);
    ctx.beginPath();
    for (let x = 0; x <= w; x += 8) {
      const yy = y + Math.sin(x / 46 + i) * (1.2 + i * 0.12);
      if (x === 0) {
        ctx.moveTo(x, yy);
      } else {
        ctx.lineTo(x, yy);
      }
    }
    ctx.stroke();
  }
  ctx.restore();
}

/** Layered coastline contour lines (topographic map language). */
export function coastContours(ctx: Ctx, w: number, baseY: number) {
  ctx.save();
  ctx.strokeStyle = "rgba(246,242,227,0.14)";
  ctx.lineWidth = 1.1;
  for (let k = 0; k < 7; k++) {
    ctx.beginPath();
    for (let x = 0; x <= w; x += 10) {
      const y = baseY - k * 16 + Math.sin(x / 190 + k * 0.6) * 22 + Math.sin(x / 61 + k) * 6;
      if (x === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.stroke();
  }
  ctx.restore();
}

/** Goa lighthouse — the origin of the signal. Returns the lamp point. */
export function lighthouse(ctx: Ctx, x: number, baseY: number, h: number): [number, number] {
  const topW = 30;
  const botW = 58;
  const bodyTop = baseY - h;

  // rock base
  ctx.fillStyle = PALETTE.ink;
  ctx.beginPath();
  ctx.moveTo(x - 96, baseY + 34);
  ctx.lineTo(x - 44, baseY + 2);
  ctx.lineTo(x + 6, baseY + 10);
  ctx.lineTo(x + 62, baseY - 2);
  ctx.lineTo(x + 112, baseY + 34);
  ctx.closePath();
  ctx.fill();

  // tower
  ctx.fillStyle = PALETTE.cream;
  ctx.beginPath();
  ctx.moveTo(x - botW / 2, baseY + 6);
  ctx.lineTo(x - topW / 2, bodyTop + 26);
  ctx.lineTo(x + topW / 2, bodyTop + 26);
  ctx.lineTo(x + botW / 2, baseY + 6);
  ctx.closePath();
  ctx.fill();

  // painted bands
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(x - botW / 2, baseY + 6);
  ctx.lineTo(x - topW / 2, bodyTop + 26);
  ctx.lineTo(x + topW / 2, bodyTop + 26);
  ctx.lineTo(x + botW / 2, baseY + 6);
  ctx.closePath();
  ctx.clip();
  ctx.fillStyle = PALETTE.pink;
  for (let i = 0; i < 5; i++) ctx.fillRect(x - 40, bodyTop + 44 + i * 44, 80, 18);
  ctx.restore();

  // gallery + lamp room
  ctx.fillStyle = PALETTE.deep;
  ctx.fillRect(x - 24, bodyTop + 14, 48, 12);
  ctx.fillStyle = PALETTE.gold;
  ctx.beginPath();
  ctx.arc(x, bodyTop + 2, 13, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = PALETTE.deep;
  ctx.fillRect(x - 15, bodyTop - 12, 30, 8);
  // finial
  ctx.strokeStyle = PALETTE.gold;
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(x, bodyTop - 12);
  ctx.lineTo(x, bodyTop - 30);
  ctx.stroke();

  // lamp glow
  const glow = ctx.createRadialGradient(x, bodyTop + 2, 4, x, bodyTop + 2, 130);
  glow.addColorStop(0, "rgba(245,222,25,0.6)");
  glow.addColorStop(1, "rgba(245,222,25,0)");
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(x, bodyTop + 2, 130, 0, Math.PI * 2);
  ctx.fill();

  return [x, bodyTop + 2];
}

/** Transmission beam from the lamp toward a target point. */
export function beam(ctx: Ctx, from: [number, number], toX: number, toY: number, spread = 90) {
  ctx.save();
  const g = ctx.createLinearGradient(from[0], from[1], toX, toY);
  g.addColorStop(0, "rgba(245,222,25,0.34)");
  g.addColorStop(1, "rgba(245,222,25,0)");
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.moveTo(from[0], from[1]);
  ctx.lineTo(toX, toY - spread);
  ctx.lineTo(toX, toY + spread);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

/** Coconut palm silhouette. */
export function palm(
  ctx: Ctx,
  x: number,
  baseY: number,
  h: number,
  flip = false,
  color = PALETTE.ink,
) {
  ctx.save();
  ctx.translate(x, baseY);
  if (flip) ctx.scale(-1, 1);
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineCap = "round";

  // trunk
  ctx.lineWidth = Math.max(4, h * 0.035);
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.quadraticCurveTo(h * 0.12, -h * 0.55, h * 0.02, -h);
  ctx.stroke();

  const tx = h * 0.02;
  const ty = -h;
  // fronds
  const angles = [-2.9, -2.3, -1.75, -1.2, -0.55, 0.05, 0.6];
  angles.forEach((a, i) => {
    const len = h * (0.34 + (i % 3) * 0.05);
    const ex = tx + Math.cos(a) * len;
    const ey = ty + Math.sin(a) * len * 0.55 + len * 0.16;
    ctx.lineWidth = Math.max(2.5, h * 0.022);
    ctx.beginPath();
    ctx.moveTo(tx, ty);
    ctx.quadraticCurveTo(
      tx + Math.cos(a) * len * 0.6,
      ty + Math.sin(a) * len * 0.55 - len * 0.16,
      ex,
      ey,
    );
    ctx.stroke();
    // leaflets
    ctx.lineWidth = 1.4;
    for (let s = 0.25; s < 1; s += 0.16) {
      const px = tx + (ex - tx) * s;
      const py = ty + (ey - ty) * s - Math.sin(s * Math.PI) * len * 0.13;
      ctx.beginPath();
      ctx.moveTo(px, py);
      ctx.lineTo(px + Math.cos(a) * 12, py + 12);
      ctx.stroke();
    }
  });

  // coconuts
  [-6, 6, 0].forEach((o, i) => {
    ctx.beginPath();
    ctx.arc(tx + o, ty + 8 + i * 4, 3.4, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.restore();
}

/** Signal / communication tower with broadcast arcs. */
export function signalTower(ctx: Ctx, x: number, baseY: number, h: number, color = PALETTE.gold) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.globalAlpha = 0.85;
  ctx.lineWidth = 2;
  const halfB = h * 0.13;
  ctx.beginPath();
  ctx.moveTo(x - halfB, baseY);
  ctx.lineTo(x, baseY - h);
  ctx.lineTo(x + halfB, baseY);
  ctx.stroke();
  // cross bracing
  const rungs = 7;
  for (let i = 0; i < rungs; i++) {
    const t0 = i / rungs;
    const t1 = (i + 1) / rungs;
    const y0 = baseY - h * t0;
    const y1 = baseY - h * t1;
    const w0 = halfB * (1 - t0);
    const w1 = halfB * (1 - t1);
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(x - w0, y0);
    ctx.lineTo(x + w1, y1);
    ctx.moveTo(x + w0, y0);
    ctx.lineTo(x - w1, y1);
    ctx.moveTo(x - w1, y1);
    ctx.lineTo(x + w1, y1);
    ctx.stroke();
  }
  // broadcast arcs
  ctx.lineWidth = 1.6;
  for (let i = 1; i <= 3; i++) {
    ctx.globalAlpha = 0.5 - i * 0.11;
    ctx.beginPath();
    ctx.arc(x, baseY - h, 14 * i + 8, Math.PI * 1.15, Math.PI * 1.85);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, baseY - h, 3.4, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

/** A frequency trace: the builder's transmission. */
export function frequencyTrace(
  ctx: Ctx,
  x0: number,
  x1: number,
  y: number,
  amp: number,
  color: string,
  seed = 0,
  alpha = 0.9,
) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.lineJoin = "round";
  ctx.beginPath();
  const span = x1 - x0;
  for (let x = x0; x <= x1; x += 4) {
    const t = (x - x0) / span;
    const env = Math.sin(Math.PI * t) ** 0.7;
    const yy =
      y -
      (Math.sin((x - x0) / 26 + seed) * 0.55 + Math.sin((x - x0) / 9 + seed * 2) * 0.45) *
        amp *
        env;
    if (x === x0) {
      ctx.moveTo(x, yy);
    } else {
      ctx.lineTo(x, yy);
    }
  }
  ctx.stroke();
  ctx.restore();
}

/** Constellation of network nodes — the builder community. */
export function constellation(ctx: Ctx, x: number, y: number, w: number, h: number, count = 12) {
  const pts: [number, number][] = [];
  let s = 7;
  const rnd = () => {
    s = (s * 16807) % 2147483647;
    return s / 2147483647;
  };
  for (let i = 0; i < count; i++) pts.push([x + rnd() * w, y + rnd() * h]);
  ctx.save();
  ctx.strokeStyle = "rgba(246,242,227,0.22)";
  ctx.lineWidth = 0.9;
  pts.forEach((p, i) => {
    const q = pts[(i + 3) % pts.length]!;
    ctx.beginPath();
    ctx.moveTo(p[0], p[1]);
    ctx.lineTo(q[0], q[1]);
    ctx.stroke();
  });
  pts.forEach((p, i) => {
    ctx.fillStyle = i % 4 === 0 ? PALETTE.gold : "rgba(246,242,227,0.7)";
    ctx.beginPath();
    ctx.arc(p[0], p[1], i % 4 === 0 ? 2.6 : 1.6, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.restore();
}

/** Coordinate crosshair marker. */
export function geoMarker(ctx: Ctx, x: number, y: number, color = PALETTE.pink, r = 16) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(x, y, r * 0.42, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x - r - 9, y);
  ctx.lineTo(x - r + 4, y);
  ctx.moveTo(x + r - 4, y);
  ctx.lineTo(x + r + 9, y);
  ctx.moveTo(x, y - r - 9);
  ctx.lineTo(x, y - r + 4);
  ctx.moveTo(x, y + r - 4);
  ctx.lineTo(x, y + r + 9);
  ctx.stroke();
  ctx.restore();
}

/** Four-point Hacker House star. */
export function star(ctx: Ctx, x: number, y: number, r: number, color = PALETTE.gold) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x, y - r);
  ctx.quadraticCurveTo(x + r * 0.16, y - r * 0.16, x + r, y);
  ctx.quadraticCurveTo(x + r * 0.16, y + r * 0.16, x, y + r);
  ctx.quadraticCurveTo(x - r * 0.16, y + r * 0.16, x - r, y);
  ctx.quadraticCurveTo(x - r * 0.16, y - r * 0.16, x, y - r);
  ctx.fill();
  ctx.restore();
}

/** Print grain + vignette so it reads as a physical artifact. */
export function grain(ctx: Ctx, w: number, h: number) {
  ctx.save();
  ctx.globalAlpha = 0.05;
  ctx.fillStyle = PALETTE.cream;
  let s = 91;
  const rnd = () => {
    s = (s * 16807) % 2147483647;
    return s / 2147483647;
  };
  for (let i = 0; i < 5200; i++) ctx.fillRect(rnd() * w, rnd() * h, 1.4, 1.4);
  ctx.restore();

  const v = ctx.createRadialGradient(w / 2, h / 2, h * 0.3, w / 2, h / 2, h * 0.95);
  v.addColorStop(0, "rgba(0,0,0,0)");
  v.addColorStop(1, "rgba(0,0,0,0.14)");
  ctx.fillStyle = v;
  ctx.fillRect(0, 0, w, h);
}

/** Tiny technical tick ruler. */
export function ruler(
  ctx: Ctx,
  x: number,
  y: number,
  len: number,
  color: string,
  vertical = false,
) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.globalAlpha = 0.55;
  ctx.lineWidth = 1;
  for (let i = 0; i <= len; i += 10) {
    const big = i % 50 === 0;
    ctx.beginPath();
    if (vertical) {
      ctx.moveTo(x, y + i);
      ctx.lineTo(x + (big ? 12 : 6), y + i);
    } else {
      ctx.moveTo(x + i, y);
      ctx.lineTo(x + i, y + (big ? 12 : 6));
    }
    ctx.stroke();
  }
  ctx.restore();
}
