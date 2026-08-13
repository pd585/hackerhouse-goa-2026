import { memo } from "react";
import { builderTitle, techColor, type BuilderData } from "@/lib/builder";
import CropCanvas from "./CropCanvas";

function BuilderCardComponent({ data, compact }: { data: BuilderData; compact?: boolean }) {
  const size = compact ? 84 : 132;
  return (
    <div className="hh-grain relative w-full max-w-[300px] overflow-hidden border border-gold/70 bg-deep/95 p-4 shadow-[0_18px_50px_-18px_rgba(0,0,0,0.85)]">
      <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />
      <div className="flex items-start justify-between font-mono text-[9px] font-bold tracking-[0.24em] text-gold">
        <span>HH26</span>
        <span className="font-bold text-magenta">GOA NODE</span>
      </div>

      <div className="mt-3 flex gap-3">
        <div className="relative shrink-0 border border-gold/80 bg-black/40">
          <CropCanvas photo={data.photo} crop={data} size={size} className="block" />
          {!data.photo && (
            <span
              className="absolute inset-0 flex items-center justify-center font-mono text-[8px] font-bold tracking-[0.2em] text-cream/70"
              style={{ width: size, height: size }}
            >
              NO SIGNAL
            </span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate font-sans text-2xl font-bold leading-none tracking-wide text-cream drop-shadow-sm">
            {(data.name || "BUILDER").toUpperCase()}
          </p>
          <p className="mt-1.5 font-mono text-[10px] font-bold tracking-[0.18em] text-gold">
            {(data.role || "UNASSIGNED").toUpperCase()}
          </p>
          {data.role && (
            <p className="mt-2 inline-block bg-magenta px-2 py-1 font-sans text-[10px] font-bold tracking-[0.14em] text-magenta-foreground shadow-sm">
              {builderTitle(data.role).toUpperCase()}
            </p>
          )}
        </div>
      </div>

      <div className="mt-3 border-t border-cream/20 pt-2 font-mono text-[9px] font-bold tracking-[0.2em] text-cream/80">
        TEAM · {(data.teamName || "—").toUpperCase()}
      </div>

      {data.stack.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {data.stack.map((t) => (
            <span
              key={t}
              className="flex items-center gap-1 border px-1.5 py-0.5 font-mono text-[8px] font-bold tracking-[0.12em] text-cream bg-black/20"
              style={{ borderColor: techColor(t) }}
            >
              <i className="size-1.5 rounded-full" style={{ background: techColor(t) }} />
              {t.toUpperCase()}
            </span>
          ))}
        </div>
      )}

      <div className="mt-3 flex items-center justify-between font-mono text-[9px] font-bold tracking-[0.2em]">
        <span className="text-gold">{data.signalId || "HH26-····"}</span>
        <span className="text-cream/70">15.57°N 73.74°E</span>
      </div>
    </div>
  );
}

const BuilderCard = memo(BuilderCardComponent);
export default BuilderCard;
