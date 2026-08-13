import { useEffect, useRef } from "react";
import { drawCroppedPhoto, loadImage, type CropState } from "@/lib/photo";

interface Props {
  photo: string | null;
  crop: CropState;
  size: number;
  className?: string;
}

export default function CropCanvas({ photo, crop, size, className }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    c.width = size * dpr;
    c.height = size * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, size, size);
    if (!photo) return;
    let alive = true;
    void loadImage(photo)
      .then((img) => {
        if (alive) drawCroppedPhoto(ctx, img, 0, 0, size, size, crop);
      })
      .catch(() => undefined);
    return () => {
      alive = false;
    };
  }, [photo, crop, size]);

  return <canvas ref={ref} style={{ width: size, height: size }} className={className} />;
}
