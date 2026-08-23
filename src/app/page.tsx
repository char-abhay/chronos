/* Phase 0 placeholder.
   Proves the token layer, font pipeline and Tailwind theme wiring are live.
   Replaced entirely in Phase 4 by the real HOME first screen (plan E.1). */
export default function Home() {
  return (
    <main
      data-destination="home"
      className="mx-auto flex min-h-[80dvh] max-w-chronos flex-col justify-center px-6 py-24"
    >
      <p className="font-mono text-label uppercase tracking-label text-faint">
        Phase 0 · foundation
      </p>

      <h1 className="mt-6 font-display text-display-lg leading-display tracking-display text-primary">
        CHRONOS
      </h1>

      <p className="mt-4 max-w-reading text-secondary">
        Scaffold is live. Design tokens, typography and the Tailwind theme layer
        are wired. No content, no motion, no 3D yet.
      </p>

      <hr className="my-10 border-0 border-t border-hairline" />

      <dl className="grid gap-4 font-mono text-body-sm sm:grid-cols-2">
        <div>
          <dt className="text-faint">Ground</dt>
          <dd className="text-muted">--ground #08090b</dd>
        </div>
        <div>
          <dt className="text-faint">Signal (interactive)</dt>
          <dd className="text-signal">--signal #e3a857</dd>
        </div>
        <div>
          <dt className="text-faint">Data (measurement)</dt>
          <dd className="text-data">--data #8fb8c4 · τ Δt γ c ∞</dd>
        </div>
        <div>
          <dt className="text-faint">Text floor</dt>
          <dd className="text-muted">--text-muted ≥ 4.5:1</dd>
        </div>
      </dl>
    </main>
  );
}
