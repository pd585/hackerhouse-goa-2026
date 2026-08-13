/** Shared crop math so the editor, the Builder Card and the exported Builder Wave agree. */
export interface CropState {
  photoZoom: number;
  photoOffsetX: number; // -1..1 relative to overflow
  photoOffsetY: number;
}

export function drawCroppedPhoto(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number,
  y: number,
  w: number,
  h: number,
  crop: CropState,
) {
  const scale = Math.max(w / img.width, h / img.height) * crop.photoZoom;
  const dw = img.width * scale;
  const dh = img.height * scale;
  const maxX = Math.max(0, (dw - w) / 2);
  const maxY = Math.max(0, (dh - h) / 2);
  const dx = x + (w - dw) / 2 + crop.photoOffsetX * maxX;
  const dy = y + (h - dh) / 2 + crop.photoOffsetY * maxY;
  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.clip();
  ctx.drawImage(img, dx, dy, dw, dh);
  ctx.restore();
}

export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Could not decode image"));
    img.src = src;
  });
}

export function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = async () => {
      const result = String(r.result);
      try {
        const optimized = await optimizePhotoDataUrl(result);
        resolve(optimized);
      } catch {
        resolve(result);
      }
    };
    r.onerror = () => reject(new Error("Could not read file"));
    r.readAsDataURL(file);
  });
}

/** Resizes photos larger than MAX_DIMENSION to prevent MBs of base64 in React state. */
export function optimizePhotoDataUrl(dataUrl: string, maxDim = 1200): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      if (img.width <= maxDim && img.height <= maxDim) {
        resolve(dataUrl);
        return;
      }
      const scale = maxDim / Math.max(img.width, img.height);
      const w = Math.round(img.width * scale);
      const h = Math.round(img.height * scale);
      const c = document.createElement("canvas");
      c.width = w;
      c.height = h;
      const ctx = c.getContext("2d");
      if (!ctx) {
        resolve(dataUrl);
        return;
      }
      ctx.drawImage(img, 0, 0, w, h);
      resolve(c.toDataURL("image/jpeg", 0.92));
    };
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
}
