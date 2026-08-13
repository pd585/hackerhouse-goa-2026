import { builderTitle, techColor, type BuilderData } from "./builder";
import { drawCroppedPhoto, loadImage } from "./photo";
import {
  PALETTE as P,
  beam,
  coastContours,
  constellation,
  frequencyTrace,
  geoMarker,
  grain,
  lighthouse,
  ocean,
  palm,
  roundRect,
  ruler,
  signalTower,
  sky,
  star,
  type Ctx,
} from "./wave-art";

const W = 1600;
const H = 900;
const HORIZON = 430;
const SHORE = 572; // cream panel top / shoreline
const DISPLAY = "'Bodoni Moda', 'Playfair Display', Georgia, serif";
const SANS = "'Space Grotesk', system-ui, sans-serif";
const MONO = "'JetBrains Mono', ui-monospace, monospace";

let fontsLoaded = false;
async function ensureFonts() {
  if (fontsLoaded || typeof document === "undefined" || !document.fonts) return;
  const faces = [
    `700 92px ${DISPLAY}`,
    `700 34px ${SANS}`,
    `500 18px ${MONO}`,
    `700 28px ${SANS}`,
    `500 22px ${MONO}`,
  ];
  try {
    await Promise.all(faces.map((f) => document.fonts.load(f).catch(() => null)));
    await document.fonts.ready;
    fontsLoaded = true;
  } catch {
    /* fallback fonts available */
  }
}

function setText(ctx: Ctx, font: string, color: string, spacing = "0px") {
  ctx.font = font;
  ctx.fillStyle = color;
  ctx.letterSpacing = spacing;
}

/** Fit a display string into a max width by stepping the size down. */
function fitFont(
  ctx: Ctx,
  text: string,
  family: string,
  weight: string,
  max: number,
  maxW: number,
) {
  let size = max;
  do {
    ctx.font = `${weight} ${size}px ${family}`;
    if (ctx.measureText(text).width <= maxW) break;
    size -= 2;
  } while (size > 28);
  return size;
}

function label(ctx: Ctx, text: string, x: number, y: number, color = "rgba(4,35,21,0.85)") {
  setText(ctx, `700 13px ${MONO}`, color, "5px");
  ctx.fillText(text, x, y);
  ctx.letterSpacing = "0px";
}

/** Renders the final 1600x900 illustrated Builder Wave collectible. */
export async function renderBuilderWave(data: BuilderData): Promise<HTMLCanvasElement> {
  await ensureFonts();
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;
  ctx.textBaseline = "alphabetic";

  const stackColors = data.stack.length ? data.stack.map(techColor) : [P.gold, P.pink];

  /* ---------------- BACKGROUND: Goa sky, sun, ocean ---------------- */
  ctx.fillStyle = P.deep;
  ctx.fillRect(0, 0, W, H);
  sky(ctx, W, HORIZON);

  ocean(ctx, W, HORIZON, H);
  coastContours(ctx, W, HORIZON + 132);
  constellation(ctx, 620, 96, 520, 150, 14);

  /* ---------------- MIDGROUND: lighthouse, palms, towers ---------------- */
  const lamp = lighthouse(ctx, 1288, 548, 300);
  beam(ctx, lamp, 300, 420, 120);

  signalTower(ctx, 760, 588, 132, P.gold);
  signalTower(ctx, 928, 592, 88, "rgba(246,242,227,0.7)");

  palm(ctx, 486, 600, 214);
  palm(ctx, 566, 604, 156, true);
  palm(ctx, 1466, 604, 226, true);
  palm(ctx, 1402, 606, 150);

  // signal path: lighthouse -> builder -> stack
  stackColors.slice(0, 3).forEach((c, i) => {
    frequencyTrace(ctx, 440, 1200, 336 + i * 30, 22 - i * 4, c, i * 1.4, 0.85 - i * 0.16);
  });
  star(ctx, 1180, 200, 13);
  star(ctx, 1132, 236, 7, P.pink);
  star(ctx, 640, 262, 8);

  /* ---------------- FRAME + HEADER ---------------- */
  ctx.strokeStyle = P.gold;
  ctx.lineWidth = 3;
  ctx.strokeRect(36, 36, W - 72, H - 72);
  ctx.strokeStyle = "rgba(246,242,227,0.32)";
  ctx.lineWidth = 1;
  ctx.strokeRect(52, 52, W - 104, H - 104);

  setText(ctx, `700 30px ${SANS}`, P.gold, "10px");
  ctx.fillText("HACKER HOUSE", 96, 122);
  setText(ctx, `700 30px ${SANS}`, P.pink, "10px");
  ctx.fillText("GOA 2026", 96, 162);
  setText(ctx, `500 15px ${MONO}`, "rgba(246,242,227,0.75)", "6px");
  ctx.fillText("SIGNAL MAP · BUILDER EDITION", 96, 192);

  ctx.textAlign = "right";
  setText(ctx, `500 16px ${MONO}`, "rgba(246,242,227,0.8)", "7px");
  ctx.fillText("BUILDER WAVE", W - 96, 122);
  setText(ctx, `700 26px ${MONO}`, P.gold, "5px");
  ctx.fillText(data.signalId || "HH26-0000", W - 96, 160);
  setText(ctx, `500 14px ${MONO}`, "rgba(246,242,227,0.55)", "5px");
  ctx.fillText("FIG. 01 — SIGNAL PATH", W - 96, 190);
  ctx.textAlign = "left";
  ctx.letterSpacing = "0px";

  ruler(ctx, 96, 214, 200, P.cream);

  /* ---------------- FOREGROUND: builder portrait ---------------- */
  const px = 112;
  const py = 236;
  const ps = 296;
  ctx.save();
  ctx.shadowColor = "rgba(0,0,0,0.25)";
  ctx.shadowBlur = 22;
  ctx.shadowOffsetY = 10;
  ctx.fillStyle = P.deep;
  ctx.fillRect(px - 10, py - 10, ps + 20, ps + 20);
  ctx.restore();

  if (data.photo) {
    try {
      const img = await loadImage(data.photo);
      drawCroppedPhoto(ctx, img, px, py, ps, ps, data);
    } catch {
      ctx.fillStyle = "rgba(246,242,227,0.1)";
      ctx.fillRect(px, py, ps, ps);
    }
  } else {
    ctx.fillStyle = "rgba(246,242,227,0.1)";
    ctx.fillRect(px, py, ps, ps);
    setText(ctx, `500 16px ${MONO}`, "rgba(246,242,227,0.5)", "5px");
    ctx.textAlign = "center";
    ctx.fillText("NO SIGNAL", px + ps / 2, py + ps / 2);
    ctx.textAlign = "left";
  }

  ctx.strokeStyle = P.gold;
  ctx.lineWidth = 3;
  ctx.strokeRect(px, py, ps, ps);
  ctx.strokeStyle = P.pink;
  ctx.lineWidth = 5;
  (
    [
      [px, py, 1, 1],
      [px + ps, py, -1, 1],
      [px, py + ps, 1, -1],
      [px + ps, py + ps, -1, -1],
    ] as [number, number, number, number][]
  ).forEach(([x, y, sx, sy]) => {
    ctx.beginPath();
    ctx.moveTo(x, y + 36 * sy);
    ctx.lineTo(x, y);
    ctx.lineTo(x + 36 * sx, y);
    ctx.stroke();
  });

  // geo marker anchoring the builder to Goa
  geoMarker(ctx, px + ps + 44, py + ps - 22, P.pink, 15);
  setText(ctx, `500 13px ${MONO}`, "rgba(246,242,227,0.85)", "3px");
  ctx.fillText("15.5735°N", px + ps + 68, py + ps - 26);
  ctx.fillText("73.7407°E", px + ps + 68, py + ps - 8);
  ctx.letterSpacing = "0px";

  /* ---------------- FOREGROUND: cream credential panel ---------------- */
  const pnX = 96;
  const pnW = W - 192;
  const pnY = 560;
  const pnH = 265;

  ctx.save();
  ctx.shadowColor = "rgba(0,0,0,0.22)";
  ctx.shadowBlur = 24;
  ctx.shadowOffsetY = -6;
  ctx.fillStyle = P.paper;
  roundRect(ctx, pnX, pnY, pnW, pnH, 4);
  ctx.fill();
  ctx.restore();
  ctx.strokeStyle = "rgba(4,35,21,0.22)";
  ctx.lineWidth = 1;
  roundRect(ctx, pnX + 8, pnY + 8, pnW - 16, pnH - 16, 3);
  ctx.stroke();
  ctx.fillStyle = P.gold;
  ctx.fillRect(pnX, pnY, pnW, 6);

  const colL = pnX + 40;
  const colR = pnX + 760;
  const colRw = pnX + pnW - 40 - colR;

  // column divider + node insignia (builder → goa node)
  ctx.strokeStyle = "rgba(4,35,21,0.2)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(colR - 44, pnY + 34);
  ctx.lineTo(colR - 44, pnY + pnH - 34);
  ctx.stroke();
  star(ctx, colR - 44, pnY + pnH / 2, 8, P.pink);
  ctx.fillStyle = P.paper;
  ctx.beginPath();
  ctx.arc(colR - 44, pnY + pnH / 2, 14, 0, Math.PI * 2);
  ctx.fill();
  star(ctx, colR - 44, pnY + pnH / 2, 8, P.pink);

  // left column: identity
  label(ctx, "BUILDER", colL, pnY + 38);
  const name = (data.name || "BUILDER").toUpperCase();
  const nameSize = fitFont(ctx, name, SANS, "700", 84, colR - colL - 60);
  setText(ctx, `700 ${nameSize}px ${SANS}`, P.ink, "2px");
  ctx.fillText(name, colL, pnY + 112);

  setText(ctx, `700 18px ${MONO}`, "rgba(4,35,21,0.92)", "4px");
  ctx.fillText((data.role || "BUILDER").toUpperCase(), colL, pnY + 142);

  const title = builderTitle(data.role).toUpperCase();
  ctx.font = `700 24px ${SANS}`;
  ctx.letterSpacing = "3px";
  const tw = Math.min(ctx.measureText(title).width + 36, colR - colL - 60);
  ctx.fillStyle = P.pink;
  roundRect(ctx, colL, pnY + 154, tw, 38, 3);
  ctx.fill();
  setText(ctx, `700 24px ${SANS}`, P.cream, "3px");
  ctx.fillText(title, colL + 18, pnY + 181);

  ctx.letterSpacing = "0px";

  // right column: team, stack, signal
  label(ctx, "TEAM", colR, pnY + 38);
  const team = (data.teamName || "SOLO SIGNAL").toUpperCase();
  const teamSize = fitFont(ctx, team, SANS, "700", 32, colRw);
  setText(ctx, `700 ${teamSize}px ${SANS}`, P.ink, "3px");
  ctx.fillText(team, colR, pnY + 76);
  ctx.letterSpacing = "0px";

  label(ctx, "STACK · SIGNAL", colR, pnY + 114);
  let cx = colR;
  let cy = pnY + 128;
  const badgeFont = `700 16px ${MONO}`;
  data.stack.slice(0, 8).forEach((tech) => {
    const t = tech.toUpperCase();
    ctx.font = badgeFont;
    ctx.letterSpacing = "2px";
    const bw = ctx.measureText(t).width + 36;
    if (cx + bw > colR + colRw) {
      cx = colR;
      cy += 38;
    }
    if (cy > pnY + 195) return;

    const c = techColor(tech);
    ctx.fillStyle = "rgba(4,35,21,0.05)";
    roundRect(ctx, cx, cy, bw, 32, 3);
    ctx.fill();
    ctx.strokeStyle = c;
    ctx.lineWidth = 1.6;
    roundRect(ctx, cx, cy, bw, 32, 3);
    ctx.stroke();
    ctx.fillStyle = c;
    ctx.beginPath();
    ctx.arc(cx + 14, cy + 16, 4, 0, Math.PI * 2);
    ctx.fill();
    setText(ctx, badgeFont, P.ink, "2px");
    ctx.fillText(t, cx + 24, cy + 22);
    cx += bw + 8;
  });
  ctx.letterSpacing = "0px";

  // signal id + tagline row inside the panel
  const rowY = pnY + 242;
  ctx.strokeStyle = P.ink;
  ctx.lineWidth = 1.6;
  ctx.globalAlpha = 0.8;
  roundRect(ctx, colR, rowY - 26, 240, 34, 3);
  ctx.stroke();
  ctx.globalAlpha = 1;
  setText(ctx, `700 19px ${MONO}`, P.ink, "3px");
  ctx.fillText(data.signalId || "HH26-0000", colR + 16, rowY - 3);
  star(ctx, colR + 268, rowY - 9, 9, P.pink);
  setText(ctx, `700 14px ${MONO}`, "rgba(4,35,21,0.88)", "4px");
  ctx.fillText("SIGNAL LOCKED", colR + 286, rowY - 4);
  ctx.letterSpacing = "0px";

  setText(ctx, `700 15px ${MONO}`, "rgba(4,35,21,0.88)", "5px");
  ctx.fillText("LESS NOISE. MORE SIGNAL.", colL, rowY - 2);
  ctx.letterSpacing = "0px";

  /* ---------------- MICRO DETAIL + ATMOSPHERE ---------------- */
  setText(ctx, `700 13px ${MONO}`, "rgba(246,242,227,0.85)", "4px");
  ctx.fillText("F 2.4 GHz · TRANSMISSION STABLE", 470, 300);
  ctx.textAlign = "right";
  ctx.fillText("SIGNAL LIGHTHOUSE · AGUADA", 1236, 470);

  ctx.textAlign = "left";
  ctx.letterSpacing = "0px";

  grain(ctx, W, H);

  return canvas;
}

export const waveCaption = (data: BuilderData) =>
  `Just got my Hacker House Goa 2026 Builder Wave 🌊\n${builderTitle(data.role)} | ${data.role || "Builder"}\nLess noise. More signal.\n#FrameInGoa #HHGoa26`;
