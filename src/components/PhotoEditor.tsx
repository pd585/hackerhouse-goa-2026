import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Upload, RotateCcw, ZoomIn } from "lucide-react";
import { drawCroppedPhoto, loadImage, readFileAsDataURL, type CropState } from "@/lib/photo";

interface Props {
  photo: string | null;
  crop: CropState;
  onPhoto: (dataUrl: string | null) => void;
  onCrop: (crop: Partial<CropState>) => void;
}

const SIZE = 260;

export default function PhotoEditor({ photo, crop, onPhoto, onCrop }: Props) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const drag = useRef<{ x: number; y: number } | null>(null);
  const localOffset = useRef({ x: crop.photoOffsetX, y: crop.photoOffsetY });
  const isDragging = useRef(false);
  const rafId = useRef<number | null>(null);

  // Sync crop props to local ref when not dragging
  useEffect(() => {
    if (!isDragging.current) {
      localOffset.current = { x: crop.photoOffsetX, y: crop.photoOffsetY };
    }
  }, [crop.photoOffsetX, crop.photoOffsetY]);

  useEffect(() => {
    if (!photo) {
      setImg(null);
      return;
    }
    let alive = true;
    loadImage(photo)
      .then((i) => alive && setImg(i))
      .catch(() =>
        toast.error("This image format couldn't be decoded here — try a JPG or PNG export."),
      );
    return () => {
      alive = false;
    };
  }, [photo]);

  const renderCanvas = useCallback(() => {
    const c = canvas.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    c.width = SIZE * dpr;
    c.height = SIZE * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, SIZE, SIZE);
    if (img) {
      drawCroppedPhoto(ctx, img, 0, 0, SIZE, SIZE, {
        photoZoom: crop.photoZoom,
        photoOffsetX: localOffset.current.x,
        photoOffsetY: localOffset.current.y,
      });
    }
  }, [img, crop.photoZoom]);

  useEffect(() => {
    renderCanvas();
  }, [renderCanvas]);

  const pick = async (file?: File | null) => {
    if (!file) return;
    if (file.size > 20 * 1024 * 1024) {
      toast.error("Photo is larger than 20MB.");
      return;
    }
    const url = await readFileAsDataURL(file);
    localOffset.current = { x: 0, y: 0 };
    onCrop({ photoZoom: 1, photoOffsetX: 0, photoOffsetY: 0 });
    onPhoto(url);
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if (!img) return;
    isDragging.current = true;
    drag.current = { x: e.clientX, y: e.clientY };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag.current || !isDragging.current) return;
    const dx = (e.clientX - drag.current.x) / (SIZE / 2);
    const dy = (e.clientY - drag.current.y) / (SIZE / 2);
    drag.current = { x: e.clientX, y: e.clientY };

    const bound = Math.max(1, crop.photoZoom);
    localOffset.current = {
      x: Math.max(-bound, Math.min(bound, localOffset.current.x + dx)),
      y: Math.max(-bound, Math.min(bound, localOffset.current.y + dy)),
    };

    if (rafId.current === null) {
      rafId.current = requestAnimationFrame(() => {
        rafId.current = null;
        renderCanvas();
      });
    }
  };

  const onPointerUp = () => {
    if (isDragging.current) {
      isDragging.current = false;
      drag.current = null;
      onCrop({
        photoOffsetX: localOffset.current.x,
        photoOffsetY: localOffset.current.y,
      });
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <input
        ref={input}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/*"
        className="hidden"
        onChange={(e) => void pick(e.target.files?.[0])}
      />
      <div
        className="relative mx-auto w-full max-w-[260px] aspect-square touch-none border border-gold/40 bg-deep/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
        tabIndex={img ? 0 : -1}
        aria-label="Profile photo editor preview"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onDrop={(e) => {
          e.preventDefault();
          void pick(e.dataTransfer.files?.[0]);
        }}
        onDragOver={(e) => e.preventDefault()}
      >
        <canvas
          ref={canvas}
          style={{ width: SIZE, height: SIZE }}
          className="block h-full w-full"
        />
        {!img && (
          <button
            type="button"
            onClick={() => input.current?.click()}
            className="absolute inset-0 flex flex-col items-center justify-center gap-2 font-mono text-[10px] tracking-[0.2em] text-cream/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          >
            <Upload className="size-5 text-gold" />
            UPLOAD PHOTO
            <span className="text-cream/50">JPG · PNG · WEBP</span>
          </button>
        )}
        <span className="pointer-events-none absolute inset-0 border-[6px] border-transparent shadow-[inset_0_0_0_1px_var(--gold)]" />
      </div>

      {img && (
        <div className="flex flex-col gap-2">
          <label className="flex items-center gap-2 font-mono text-[10px] tracking-[0.18em] text-cream/70">
            <ZoomIn className="size-3.5 text-gold" /> ZOOM
            <input
              type="range"
              min={1}
              max={3}
              step={0.01}
              aria-label="Photo zoom scale"
              value={crop.photoZoom}
              onChange={(e) => onCrop({ photoZoom: Number(e.target.value) })}
              className="h-1 flex-1 accent-[var(--magenta)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            />
          </label>
          <div className="flex gap-2 font-mono text-[10px] tracking-[0.18em]">
            <button
              type="button"
              onClick={() => input.current?.click()}
              className="flex-1 border border-gold/50 px-2 py-1.5 text-cream hover:bg-gold hover:text-gold-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            >
              REPLACE
            </button>
            <button
              type="button"
              onClick={() => {
                localOffset.current = { x: 0, y: 0 };
                onCrop({ photoZoom: 1, photoOffsetX: 0, photoOffsetY: 0 });
              }}
              className="flex items-center gap-1 border border-cream/30 px-2 py-1.5 text-cream/80 hover:border-magenta hover:text-magenta focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            >
              <RotateCcw className="size-3" /> RESET
            </button>
          </div>
          <p className="font-mono text-[9px] tracking-[0.16em] text-cream/45">
            DRAG INSIDE FRAME TO REPOSITION
          </p>
        </div>
      )}
    </div>
  );
}
