import { ClientOnly, createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { ArrowRight, Check, Download, Linkedin, Share2, Instagram, X as XIcon } from "lucide-react";
import PhotoEditor from "@/components/PhotoEditor";
import BuilderCard from "@/components/BuilderCard";
import {
  ROLES,
  TECHS,
  builderTitle,
  emptyBuilder,
  fmtCoord,
  generateSignalId,
  techColor,
  NODES,
  type BuilderData,
  type Stage,
} from "@/lib/builder";
import { renderBuilderWave, waveCaption } from "@/lib/wave";
import {
  canShareFiles,
  dataUrlToFile,
  downloadDataUrl,
  isMobile,
  openLinkedIn,
  openTwitterIntent,
} from "@/lib/share";

const GoaMap = lazy(() => import("@/components/GoaMap"));

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Goa Signal Map — Hacker House Goa 2026 Builder Wave" },
      {
        name: "description",
        content:
          "Explore real Goa on a live 3D map, create your Hacker House Goa 2026 builder identity, activate your stack as signal and download your Builder Wave card.",
      },
      { property: "og:title", content: "Goa Signal Map — Hacker House Goa 2026" },
      {
        property: "og:description",
        content:
          "Enter the network: build your Hacker House Goa 2026 Builder Wave on a real 3D map of Goa. No login, instant download and share.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SignalMap,
});

const STEPS: { id: Stage; n: string; label: string }[] = [
  { id: "builder", n: "01", label: "BUILDER" },
  { id: "stack", n: "02", label: "STACK" },
  { id: "team", n: "03", label: "TEAM" },
  { id: "network", n: "04", label: "GOA NODE" },
  { id: "wave", n: "05", label: "BROADCAST" },
];

const STORAGE_KEY = "hh_goa_builder_session_v1";

function SignalMap() {
  const [stage, setStage] = useState<Stage>(() => {
    if (typeof window === "undefined") return "enter";
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.stage && STEPS.some((s) => s.id === parsed.stage)) return parsed.stage;
      }
    } catch {
      /* ignore storage errors */
    }
    return "enter";
  });

  const [data, setData] = useState<BuilderData>(() => {
    if (typeof window === "undefined") return emptyBuilder();
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.data) return { ...emptyBuilder(), ...parsed.data };
      }
    } catch {
      /* ignore storage errors */
    }
    return emptyBuilder();
  });

  const [wave, setWave] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [confirmEdit, setConfirmEdit] = useState(false);

  // Browser Back Button integration
  const goToStage = useCallback((nextStage: Stage) => {
    setStage(nextStage);
    if (typeof window !== "undefined" && window.history) {
      try {
        window.history.pushState({ stage: nextStage }, "");
      } catch {
        /* ignore history errors */
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const onPopState = (e: PopStateEvent) => {
      if (e.state && e.state.stage) {
        setStage(e.state.stage);
      }
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ stage, data }));
    } catch {
      /* storage quota/disabled */
    }
  }, [stage, data]);

  const patch = useCallback((p: Partial<BuilderData>) => setData((d) => ({ ...d, ...p })), []);

  const stepIndex = STEPS.findIndex((s) => s.id === stage);
  const canLeaveBuilder = data.name.trim().length > 1 && !!data.role;

  const broadcast = useCallback(async () => {
    setBusy(true);
    try {
      const id = data.signalId || generateSignalId(data.name);
      const next = { ...data, signalId: id };
      setData(next);
      const canvas = await renderBuilderWave(next);
      setWave(canvas.toDataURL("image/png"));
      setStage("wave");
      if (typeof window !== "undefined" && window.history) {
        try {
          window.history.pushState({ stage: "wave" }, "");
        } catch {
          /* ignore history error */
        }
      }
    } catch {
      toast.error("Could not render the Builder Wave. Try again.");
    } finally {
      setBusy(false);
    }
  }, [data]);

  const filename = useMemo(
    () =>
      `hacker-house-goa-2026-${(data.name || "builder")
        .toLowerCase()
        .replace(/[^a-z0-9_-]/g, "-")
        .replace(/-+/g, "-")}.png`,
    [data.name],
  );

  // --- ISOLATED SHARE & DOWNLOAD HANDLERS (Download ONLY happens on downloadWave) ---
  const downloadWave = useCallback(() => {
    if (!wave) return;
    downloadDataUrl(wave, filename);
    toast.success("Builder Wave PNG downloaded!");
  }, [wave, filename]);

  const shareToX = useCallback(() => {
    openTwitterIntent(waveCaption(data), window.location.href);
    toast.info(
      "X share window opened. Click 'DOWNLOAD PNG' if you want to attach your card image!",
    );
  }, [data]);

  const shareToLinkedIn = useCallback(() => {
    openLinkedIn(window.location.href);
    toast.info(
      "LinkedIn share window opened. Click 'DOWNLOAD PNG' if you want to attach your card image!",
    );
  }, []);

  const shareToInstagram = useCallback(async () => {
    if (!wave) return;
    if (isMobile()) {
      const file = await dataUrlToFile(wave, filename);
      if (canShareFiles(file)) {
        try {
          await navigator.share({ files: [file], text: waveCaption(data), title: "Builder Wave" });
          return;
        } catch {
          /* fallback */
        }
      }
    }
    toast.info(
      "Instagram native sharing is available via mobile share sheet. On desktop, click 'DOWNLOAD PNG' to save the card and upload to Instagram.",
    );
  }, [wave, filename, data]);

  const shareWithFriends = useCallback(async () => {
    if (!wave) return;
    const file = await dataUrlToFile(wave, filename);
    if (canShareFiles(file)) {
      try {
        await navigator.share({
          files: [file],
          text: waveCaption(data),
          title: "Hacker House Goa 2026",
        });
        return;
      } catch {
        /* fallback */
      }
    }
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Event link copied to clipboard!");
    } catch {
      toast.info("Copy the page URL from your browser bar to share.");
    }
  }, [wave, filename, data]);

  return (
    <main
      id="main-content"
      className="relative h-[100dvh] w-full overflow-hidden bg-deep text-cream"
    >
      <Toaster position="top-center" />

      {/* REAL 3D GOA — the map is the interface */}
      <ClientOnly
        fallback={
          <div className="absolute inset-0 grid place-items-center bg-deep font-mono text-[10px] tracking-[0.3em] text-gold">
            LOADING REAL GOA…
          </div>
        }
      >
        <Suspense fallback={<div className="absolute inset-0 bg-deep" />}>
          <GoaMap
            stage={stage}
            stack={data.stack}
            teamName={data.teamName}
            onEnterNetwork={() => goToStage(stage === "enter" ? "builder" : stage)}
          />
        </Suspense>
      </ClientOnly>

      {/* HUD — top band */}
      <header className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-start justify-between gap-3 p-3 sm:p-5">
        <div className="pointer-events-auto border border-gold/60 bg-deep/90 px-3.5 py-2 backdrop-blur shadow-md">
          <p className="font-display text-lg font-bold leading-none text-gold sm:text-2xl">
            HACKER HOUSE <span className="font-bold text-magenta drop-shadow-sm">गोवा</span>
          </p>
          <p className="mt-1 font-mono text-[8px] font-bold tracking-[0.26em] text-cream/80 sm:text-[9px]">
            GOA SIGNAL MAP · HH26
          </p>
        </div>

        {/* Mobile Step Counter */}
        {stage !== "enter" && stage !== "wave" && (
          <div className="pointer-events-auto border border-gold/50 bg-deep/90 px-3 py-1.5 font-mono text-[9px] font-bold tracking-[0.16em] text-gold backdrop-blur sm:hidden">
            0{stepIndex + 1}/05 · {STEPS[stepIndex]?.label}
          </div>
        )}

        <div className="pointer-events-auto hidden gap-1.5 sm:flex">
          {STEPS.map((s, i) => {
            const done = stepIndex > i && stage !== "enter";
            const active = stage === s.id;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => done && goToStage(s.id)}
                disabled={!done && !active}
                className={`border px-2.5 py-1.5 font-mono text-[9px] font-bold tracking-[0.18em] transition-colors ${
                  active
                    ? "border-gold bg-gold text-gold-foreground shadow-sm"
                    : done
                      ? "border-magenta bg-magenta/15 text-magenta hover:bg-magenta/25 cursor-pointer"
                      : "border-cream/30 bg-deep/80 text-cream/60 cursor-not-allowed"
                }`}
              >
                {s.n} {s.label} {done ? "✓" : ""}
              </button>
            );
          })}
        </div>
      </header>

      {/* Live builder card anchored to the scene */}
      {stage !== "enter" && stage !== "wave" && (
        <div className="pointer-events-none absolute right-3 top-24 z-20 hidden w-[300px] animate-fade-in lg:block">
          <BuilderCard data={data} />
        </div>
      )}

      {/* CONTEXTUAL PANELS */}
      {stage === "enter" && (
        <section className="absolute inset-x-0 bottom-0 z-20 p-4 sm:p-8">
          <div className="mx-auto max-w-xl border border-gold/60 bg-deep/90 p-5 backdrop-blur animate-fade-in sm:p-7">
            <p className="font-mono text-[9px] tracking-[0.28em] text-magenta">
              {fmtCoord(NODES.hackerHouse.coord)} · SIGNAL DETECTED
            </p>
            <h1 className="mt-2 font-display text-4xl leading-[0.95] text-cream sm:text-5xl">
              WELCOME,
              <br />
              <span className="text-gold">BUILDER.</span>
            </h1>
            <p className="mt-3 max-w-md text-sm text-cream/75">
              You are looking at real Goa. Tap the Hacker House node on the map — or enter below —
              to create your builder identity, turn your stack into signal and broadcast your
              Builder Wave.
            </p>
            <button
              onClick={() => setStage("builder")}
              className="mt-5 flex w-full items-center justify-center gap-2 bg-gold px-5 py-3 font-mono text-[11px] font-bold tracking-[0.24em] text-gold-foreground transition-colors hover:bg-magenta hover:text-magenta-foreground sm:w-auto"
            >
              ENTER THE NETWORK <ArrowRight className="size-4" />
            </button>
          </div>
        </section>
      )}

      {stage === "builder" && (
        <Panel
          eyebrow={`${NODES.builderCove.name} · ${fmtCoord(NODES.builderCove.coord)}`}
          title="WHO ARE YOU?"
        >
          <div className="grid gap-5 sm:grid-cols-[auto_1fr]">
            <PhotoEditor
              photo={data.photo}
              crop={data}
              onPhoto={(photo) => patch({ photo })}
              onCrop={(c) => patch(c)}
            />
            <div className="flex flex-col gap-3">
              <Field label="BUILDER NAME">
                <input
                  value={data.name}
                  onChange={(e) => patch({ name: e.target.value })}
                  placeholder="DANNY"
                  className="w-full border border-cream/25 bg-black/25 px-3 py-2.5 font-sans font-bold text-2xl tracking-wide text-cream outline-none placeholder:text-cream/25 focus:border-gold focus:ring-1 focus:ring-gold"
                />
              </Field>
              <Field label="ROLE">
                <div className="flex max-h-[136px] flex-wrap gap-1.5 overflow-y-auto pr-1">
                  {ROLES.map((r) => (
                    <button
                      key={r}
                      onClick={() => patch({ role: data.role === r ? "" : r })}
                      className={`border px-2 py-1 font-mono text-[9px] tracking-[0.12em] transition-colors ${
                        data.role === r
                          ? "border-gold bg-gold text-gold-foreground"
                          : "border-cream/25 text-cream/80 hover:border-gold"
                      }`}
                    >
                      {r.toUpperCase()}
                    </button>
                  ))}
                </div>
              </Field>
              {data.role && (
                <p className="font-mono text-[11px] font-bold tracking-[0.2em] text-magenta drop-shadow-sm">
                  BUILDER TITLE → {builderTitle(data.role).toUpperCase()}
                </p>
              )}
              <div className="lg:hidden">
                <BuilderCard data={data} compact />
              </div>
              <NextButton
                disabled={!canLeaveBuilder}
                label="ACTIVATE STACK"
                onClick={() => setStage("stack")}
              />
            </div>
          </div>
        </Panel>
      )}

      {stage === "stack" && (
        <Panel
          eyebrow={`${NODES.stackBay.name} · ${fmtCoord(NODES.stackBay.coord)}`}
          title="WHAT POWERS YOUR SIGNAL?"
        >
          <div className="flex flex-wrap gap-1.5">
            {TECHS.map((t) => {
              const on = data.stack.includes(t.name);
              return (
                <button
                  key={t.name}
                  onClick={() =>
                    patch({
                      stack: on ? data.stack.filter((s) => s !== t.name) : [...data.stack, t.name],
                    })
                  }
                  className="flex items-center gap-1.5 border px-2.5 py-1.5 font-mono text-[10px] tracking-[0.14em] transition-all"
                  style={{
                    borderColor: techColor(t.name),
                    background: on ? techColor(t.name) : "transparent",
                    color: on ? "#073F23" : "var(--cream)",
                  }}
                >
                  <i
                    className="size-1.5 rounded-full"
                    style={{ background: on ? "#073F23" : techColor(t.name) }}
                  />
                  {t.name.toUpperCase()}
                </button>
              );
            })}
          </div>
          <p className="mt-3 font-mono text-[10px] font-bold tracking-[0.2em] text-cream/80">
            {data.stack.length} SIGNAL{data.stack.length === 1 ? "" : "S"} ROUTING FROM STACK BAY →
            HACKER HOUSE
          </p>
          <div className="mt-4 flex gap-2">
            <BackButton onClick={() => setStage("builder")} />
            <NextButton
              disabled={data.stack.length === 0}
              label="CONNECT TEAM"
              onClick={() => setStage("team")}
            />
          </div>
        </Panel>
      )}

      {stage === "team" && (
        <Panel
          eyebrow={`${NODES.teamNode.name} · ${fmtCoord(NODES.teamNode.coord)}`}
          title="WHO ARE YOU BUILDING WITH?"
        >
          <input
            value={data.teamName}
            onChange={(e) => patch({ teamName: e.target.value })}
            placeholder="SIGNALSEEKERS"
            className="w-full border border-cream/25 bg-black/25 px-3 py-3 font-mono text-lg tracking-[0.2em] text-cream outline-none placeholder:text-cream/25 focus:border-magenta focus:ring-1 focus:ring-magenta"
          />
          <p className="mt-2 font-mono text-[10px] font-bold tracking-[0.2em] text-cream/80">
            BUILDER → TEAM → HACKER HOUSE. BUILDERS GET STRONGER WHEN THEY CONNECT.
          </p>
          <div className="mt-4 flex gap-2">
            <BackButton onClick={() => setStage("stack")} />
            <NextButton
              disabled={data.teamName.trim().length < 2}
              label="OPEN THE NETWORK"
              onClick={() => setStage("network")}
            />
          </div>
        </Panel>
      )}

      {stage === "network" && (
        <Panel
          eyebrow={`${NODES.lighthouse.name} · ${fmtCoord(NODES.lighthouse.coord)}`}
          title="GOA SIGNAL NETWORK ONLINE"
        >
          <ul className="grid grid-cols-2 gap-1.5 font-mono text-[10px] tracking-[0.18em] sm:grid-cols-5">
            {[
              ["IDENTITY", !!data.name],
              ["ROLE", !!data.role],
              ["STACK", data.stack.length > 0],
              ["TEAM", !!data.teamName],
              ["GOA NODE", true],
            ].map(([label, ok]) => (
              <li
                key={String(label)}
                className={`flex items-center justify-between border px-2 py-1.5 ${
                  ok ? "border-signal-green/70 text-signal-green" : "border-cream/20 text-cream/40"
                }`}
              >
                {label} {ok ? <Check className="size-3" /> : "·"}
              </li>
            ))}
          </ul>
          <div className="mt-4 flex gap-2">
            <BackButton onClick={() => setStage("team")} />
            <NextButton
              disabled={busy}
              label={busy ? "LOCKING SIGNAL…" : "BROADCAST SIGNAL"}
              onClick={() => void broadcast()}
            />
          </div>
        </Panel>
      )}

      {stage === "wave" && wave && (
        <section className="absolute inset-0 z-30 overflow-y-auto bg-deep/92 p-4 backdrop-blur-sm sm:p-8">
          <div className="mx-auto max-w-3xl animate-fade-in">
            <p className="font-mono text-[10px] tracking-[0.3em] text-signal-green">
              SIGNAL LOCKED ✦ {data.signalId}
            </p>
            <h2 className="mt-1 font-display text-3xl text-cream sm:text-5xl">
              YOUR <span className="text-gold">BUILDER WAVE</span>
            </h2>
            <img
              src={wave}
              alt={`Hacker House Goa 2026 Builder Wave for ${data.name}`}
              className="mt-4 w-full border border-gold/60 shadow-2xl"
            />
            <p className="mt-4 font-mono text-[10px] tracking-[0.24em] text-cream/60">
              SHARE YOUR WAVE
            </p>
            <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
              <Action
                icon={<Download className="size-4" />}
                label="DOWNLOAD PNG"
                primary
                onClick={downloadWave}
              />
              <Action icon={<XIcon className="size-4" />} label="SHARE ON X" onClick={shareToX} />
              <Action
                icon={<Linkedin className="size-4" />}
                label="LINKEDIN"
                onClick={shareToLinkedIn}
              />
              <Action
                icon={<Instagram className="size-4" />}
                label="INSTAGRAM"
                onClick={() => void shareToInstagram()}
              />
              <Action
                icon={<Share2 className="size-4" />}
                label="SHARE WITH FRIENDS"
                onClick={() => void shareWithFriends()}
              />
              {confirmEdit ? (
                <div className="col-span-2 flex gap-1 border border-magenta/60 bg-magenta/10 p-1 sm:col-span-1">
                  <button
                    type="button"
                    onClick={() => {
                      setWave(null);
                      setConfirmEdit(false);
                      setStage("builder");
                    }}
                    className="flex-1 bg-magenta px-2 py-1.5 font-mono text-[9px] font-bold text-magenta-foreground hover:bg-magenta/80"
                  >
                    CONFIRM RESET
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmEdit(false)}
                    className="border border-cream/30 px-2 py-1.5 font-mono text-[9px] text-cream hover:border-cream"
                  >
                    CANCEL
                  </button>
                </div>
              ) : (
                <Action
                  icon={<ArrowRight className="size-4" />}
                  label="EDIT SIGNAL"
                  onClick={() => setConfirmEdit(true)}
                />
              )}
            </div>
            <p className="mt-4 font-mono text-[10px] font-bold leading-relaxed tracking-[0.16em] text-cream/75">
              1600×900 PNG · NO LOGIN · NO SIGNUP · GENERATED IN YOUR BROWSER
            </p>
          </div>
        </section>
      )}
    </main>
  );
}

function Panel({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="absolute inset-x-0 bottom-0 z-20 max-h-[68dvh] overflow-y-auto p-3 sm:max-h-[74dvh] sm:p-6">
      <div className="mx-auto w-full max-w-2xl border border-gold/60 bg-deep/95 p-4.5 backdrop-blur animate-fade-in sm:p-6.5 shadow-2xl">
        <p className="font-mono text-[10px] font-bold tracking-[0.24em] text-magenta drop-shadow-sm">
          {eyebrow}
        </p>
        <h2 className="mb-4 mt-1 font-display text-2xl font-bold leading-none text-cream sm:text-3xl">
          {title}
        </h2>
        {children}
      </div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="font-mono text-[10px] font-bold tracking-[0.24em] text-cream/80">
        {label}
      </span>
      {children}
    </label>
  );
}

function NextButton({
  label,
  onClick,
  disabled,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="flex flex-1 items-center justify-center gap-2 bg-gold px-4 py-3 font-mono text-[11px] font-bold tracking-[0.2em] text-gold-foreground transition-colors hover:bg-magenta hover:text-magenta-foreground disabled:cursor-not-allowed disabled:bg-cream/15 disabled:text-cream/40"
    >
      {label} <ArrowRight className="size-4" />
    </button>
  );
}

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="border border-cream/25 px-3 py-3 font-mono text-[10px] tracking-[0.2em] text-cream/70 hover:border-gold hover:text-gold"
    >
      BACK
    </button>
  );
}

function Action({
  icon,
  label,
  onClick,
  primary,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  primary?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center gap-2 px-3 py-3 font-mono text-[10px] tracking-[0.16em] transition-colors ${
        primary
          ? "bg-gold text-gold-foreground hover:bg-magenta hover:text-magenta-foreground"
          : "border border-cream/25 text-cream hover:border-gold hover:text-gold"
      }`}
    >
      {icon} {label}
    </button>
  );
}
