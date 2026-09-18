import { lazy, Suspense, useEffect, useMemo, useState, type ComponentType } from "react";
import { Compass, Hammer, Info, Layers } from "lucide-react";
import {
  ASSEMBLY,
  MATERIALS,
  THEATERS,
  type AppState,
  type MaterialKey,
  type TheaterId,
} from "./catalog";

const RaftViewport = lazy(() =>
  import("./scene").then((m) => ({ default: m.RaftViewport })),
);

function cn(...parts: Array<string | false | undefined>) {
  return parts.filter(Boolean).join(" ");
}

const NAV: { id: AppState; label: string; index: string; Icon: ComponentType<{ size?: number }> }[] =
  [
    { id: "MATERIALS", label: "Materials", index: "01", Icon: Info },
    { id: "ASSEMBLY", label: "Assembly", index: "02", Icon: Hammer },
    { id: "RENDER", label: "3D Render", index: "03", Icon: Layers },
    { id: "SIMULATION", label: "Simulation", index: "04", Icon: Compass },
  ];

function useClientFlag() {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  return ready;
}

function ViewportShell({
  mode,
  theater,
}: {
  mode: "inspect" | "simulate";
  theater: TheaterId;
}) {
  const ready = useClientFlag();
  if (!ready) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-ink text-sm text-muted">
        Initializing WebGL
      </div>
    );
  }
  return (
    <Suspense
      fallback={
        <div className="flex h-full w-full items-center justify-center bg-ink text-sm text-muted">
          Loading scene
        </div>
      }
    >
      <RaftViewport mode={mode} theater={theater} />
    </Suspense>
  );
}

function useHydro(theater: TheaterId, active: boolean) {
  const spec = THEATERS[theater];
  const [sample, setSample] = useState(() => spec.currentMin);
  useEffect(() => {
    if (!active) return;
    let frame = 0;
    let last = 0;
    const tick = (now: number) => {
      frame = requestAnimationFrame(tick);
      if (now - last < 240) return;
      last = now;
      const t = now / 1000;
      const span = spec.currentMax - spec.currentMin;
      const wave = (Math.sin(t * 0.35) + 1) / 2;
      setSample(spec.currentMin + span * (0.35 + wave * 0.65));
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active, spec.currentMax, spec.currentMin]);
  return sample;
}

export default function RaftDeploymentCommandCenter() {
  const [activeState, setActiveState] = useState<AppState>("MATERIALS");
  const [activeMaterial, setActiveMaterial] = useState<MaterialKey>("Pontoons");
  const [theater, setTheater] = useState<TheaterId>("mississippi");
  const [openPhase, setOpenPhase] = useState<string>("harvest");
  const current = useHydro(theater, activeState === "SIMULATION");
  const spec = THEATERS[theater];
  const material = MATERIALS[activeMaterial];
  const heading = useMemo(() => {
    if (theater === "mississippi") return 178 + Math.sin(current * 4) * 6;
    return 92 + Math.sin(current * 18) * 14;
  }, [current, theater]);

  return (
    <div className="flex h-dvh min-h-0 flex-col bg-bg text-fg md:flex-row">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-surface md:flex">
        <div className="border-b border-border px-5 py-5">
          <p className="font-mono text-[11px] tracking-[0.22em] text-accent uppercase">
            Field ops
          </p>
          <h1 className="font-display mt-1 text-2xl leading-tight font-semibold tracking-tight">
            Raft Command
          </h1>
          <p className="mt-2 text-xs leading-relaxed text-muted">
            Harvest, bind, verify, deploy.
          </p>
        </div>
        <nav className="flex flex-1 flex-col gap-1 p-3">
          {NAV.map((item) => {
            const on = activeState === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveState(item.id)}
                className={cn(
                  "flex min-h-11 items-center gap-3 rounded-md px-3 text-left transition-colors duration-150",
                  on ? "bg-raised text-fg" : "text-muted hover:bg-raised/60 hover:text-fg",
                )}
              >
                <item.Icon size={16} />
                <span className="font-mono text-[10px] text-accent">{item.index}</span>
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>
        <p className="border-t border-border px-5 py-4 font-mono text-[10px] tracking-wide text-muted uppercase">
          Isolated deployment
        </p>
      </aside>

      <main className="min-h-0 flex-1 overflow-hidden">
        {activeState === "MATERIALS" && (
          <section className="h-full overflow-y-auto px-4 py-6 sm:px-8">
            <header className="mb-6 max-w-2xl">
              <p className="font-mono text-[11px] tracking-[0.2em] text-accent uppercase">
                1.0 Material logistics
              </p>
              <h2 className="font-display mt-1 text-3xl font-semibold tracking-tight">
                What you need at the waterline
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                Standing dead timber, grapevine lashings, and a short tool kit. Select a class
                for the field specification.
              </p>
            </header>
            <div className="grid max-w-4xl grid-cols-1 gap-3 sm:grid-cols-2">
              {(Object.keys(MATERIALS) as MaterialKey[]).map((key) => {
                const item = MATERIALS[key];
                const on = activeMaterial === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setActiveMaterial(key)}
                    className={cn(
                      "min-h-24 rounded-xl border p-4 text-left transition-colors duration-150",
                      on
                        ? "border-accent bg-raised"
                        : "border-border bg-surface hover:border-accent/50",
                    )}
                  >
                    <p className="text-sm font-medium">{item.title}</p>
                    <p className="mt-1 text-xs text-muted">{item.source}</p>
                    <p className="mt-3 font-mono text-[11px] text-accent">{item.qty}</p>
                  </button>
                );
              })}
            </div>
            <div className="mt-6 max-w-4xl rounded-xl border border-border bg-surface p-5">
              <h3 className="text-sm font-medium">{material.title} specification</h3>
              <dl className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <dt className="font-mono text-[10px] tracking-wide text-muted uppercase">Source</dt>
                  <dd className="mt-1 text-sm">{material.source}</dd>
                </div>
                <div>
                  <dt className="font-mono text-[10px] tracking-wide text-muted uppercase">Quantity</dt>
                  <dd className="mt-1 text-sm">{material.qty}</dd>
                </div>
                <div>
                  <dt className="font-mono text-[10px] tracking-wide text-muted uppercase">Size</dt>
                  <dd className="mt-1 text-sm">{material.size}</dd>
                </div>
                <div>
                  <dt className="font-mono text-[10px] tracking-wide text-muted uppercase">Function</dt>
                  <dd className="mt-1 text-sm">{material.function}</dd>
                </div>
              </dl>
            </div>
          </section>
        )}

        {activeState === "ASSEMBLY" && (
          <section className="h-full overflow-y-auto px-4 py-6 sm:px-8">
            <header className="mb-6 max-w-2xl">
              <p className="font-mono text-[11px] tracking-[0.2em] text-accent uppercase">
                2.0 Construction protocol
              </p>
              <h2 className="font-display mt-1 text-3xl font-semibold tracking-tight">
                Bind it dry, launch it once
              </h2>
            </header>
            <div className="mx-auto max-w-3xl space-y-3">
              {ASSEMBLY.map((phase) => {
                const open = openPhase === phase.id;
                return (
                  <div key={phase.id} className="overflow-hidden rounded-xl border border-border bg-surface">
                    <button
                      type="button"
                      onClick={() => setOpenPhase(open ? "" : phase.id)}
                      className="flex min-h-14 w-full items-center justify-between gap-3 px-4 py-3 text-left"
                    >
                      <span className="text-sm font-medium">{phase.title}</span>
                      <span className="font-mono text-[10px] text-muted">{open ? "Close" : "Open"}</span>
                    </button>
                    {open && (
                      <div className="border-t border-border px-4 py-4">
                        <p className="text-sm leading-relaxed text-muted">{phase.summary}</p>
                        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed">
                          {phase.steps.map((step) => (
                            <li key={step}>{step}</li>
                          ))}
                        </ol>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {activeState === "RENDER" && (
          <section className="flex h-full min-h-0 flex-col">
            <div className="flex items-end justify-between gap-4 border-b border-border px-4 py-4 sm:px-6">
              <div>
                <p className="font-mono text-[11px] tracking-[0.2em] text-accent uppercase">
                  3.0 3D topographical verification
                </p>
                <h2 className="font-display mt-1 text-2xl font-semibold tracking-tight">Inspect the hull</h2>
              </div>
              <p className="hidden font-mono text-[10px] text-muted sm:block">
                Drag rotate · Scroll zoom · Right-drag pan
              </p>
            </div>
            <div className="relative min-h-0 flex-1 bg-ink">
              <ViewportShell mode="inspect" theater={theater} />
            </div>
          </section>
        )}

        {activeState === "SIMULATION" && (
          <section className="flex h-full min-h-0 flex-col lg:flex-row">
            <div className="relative min-h-[42vh] flex-1 bg-ink lg:min-h-0">
              <ViewportShell mode="simulate" theater={theater} />
            </div>
            <aside className="max-h-[48vh] overflow-y-auto border-t border-border bg-surface lg:max-h-none lg:w-96 lg:border-t-0 lg:border-l">
              <div className="border-b border-border px-5 py-4">
                <p className="font-mono text-[11px] tracking-[0.2em] text-accent uppercase">
                  4.0 Hydrodynamic variables
                </p>
                <h2 className="font-display mt-1 text-xl font-semibold">Deployment theater</h2>
              </div>
              <div className="flex gap-2 px-4 pt-4">
                {(Object.keys(THEATERS) as TheaterId[]).map((id) => {
                  const on = theater === id;
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setTheater(id)}
                      className={cn(
                        "min-h-11 flex-1 rounded-md border px-2 text-xs font-medium transition-colors duration-150",
                        on ? "border-accent bg-raised text-fg" : "border-border text-muted hover:text-fg",
                      )}
                    >
                      {THEATERS[id].title}
                    </button>
                  );
                })}
              </div>
              <div className="grid grid-cols-2 gap-3 p-4">
                <div className="rounded-lg border border-border bg-raised p-3">
                  <p className="font-mono text-[10px] text-muted uppercase">Current</p>
                  <p className="mt-1 font-mono text-lg tabular-nums">
                    {current.toFixed(2)}
                    <span className="ml-1 text-xs text-muted">m/s</span>
                  </p>
                </div>
                <div className="rounded-lg border border-border bg-raised p-3">
                  <p className="font-mono text-[10px] text-muted uppercase">Heading</p>
                  <p className="mt-1 font-mono text-lg tabular-nums">
                    {heading.toFixed(0)}
                    <span className="ml-1 text-xs text-muted">deg</span>
                  </p>
                </div>
              </div>
              <dl className="space-y-3 px-5 pb-2 text-sm">
                <div>
                  <dt className="font-mono text-[10px] text-muted uppercase">Vector</dt>
                  <dd className="mt-1 leading-relaxed">{spec.vector}</dd>
                </div>
                <div>
                  <dt className="font-mono text-[10px] text-muted uppercase">Steering</dt>
                  <dd className="mt-1 leading-relaxed">{spec.steering}</dd>
                </div>
                <div>
                  <dt className="font-mono text-[10px] text-muted uppercase">Propulsion</dt>
                  <dd className="mt-1 leading-relaxed">{spec.propulsion}</dd>
                </div>
              </dl>
              <div className="px-5 pb-6">
                <p className="font-mono text-[10px] text-muted uppercase">Hazards</p>
                <ul className="mt-2 space-y-1 text-sm">
                  {spec.hazards.map((h) => (
                    <li key={h} className="border-b border-border/60 py-1.5">
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          </section>
        )}
      </main>

      <nav className="grid grid-cols-4 border-t border-border bg-surface md:hidden">
        {NAV.map((item) => {
          const on = activeState === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveState(item.id)}
              className={cn(
                "flex min-h-14 flex-col items-center justify-center gap-1 text-[10px]",
                on ? "text-fg" : "text-muted",
              )}
            >
              <item.Icon size={16} />
              {item.label}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
