"use client";

import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/cn";

type Cluster = {
  id: string;
  label: string;
  items: string[];
  note?: string;
  relatedProjects?: string[];
};

type ProjectRef = { slug: string; name: string; dates: string };

/**
 * Click a cluster; the projects that actually use it light up.
 *
 * This is the interaction that earns its place: it is genuinely
 * curious to poke at, and it answers the question a technical reviewer
 * is silently asking anyway -- "where has he actually used this?"
 *
 * Clusters with no project behind them simply say nothing extra. There
 * is no "0 projects" state, because advertising a gap helps nobody.
 *
 * Data is passed in as props so the content modules stay on the server.
 */
export function SkillConstellation({
  clusters,
  projects,
}: {
  clusters: Cluster[];
  projects: ProjectRef[];
}) {
  const [active, setActive] = useState<string | null>(null);

  const activeCluster = clusters.find((c) => c.id === active);
  const linked = new Set(activeCluster?.relatedProjects ?? []);

  return (
    <div className="flex flex-col gap-10">
      <div>
        <p className="text-body-sm text-muted">
          {active
            ? "Highlighted below: where this has actually been used."
            : "Select a cluster."}
        </p>

        <ul className="mt-4 flex flex-wrap gap-2">
          {clusters.map((cluster) => {
            const isActive = cluster.id === active;
            return (
              <li key={cluster.id}>
                <button
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => setActive(isActive ? null : cluster.id)}
                  className={cn(
                    "inline-flex min-h-11 items-center rounded-[2px] border px-4",
                    "text-body-sm transition-colors dur-micro",
                    isActive
                      ? "border-signal bg-[color-mix(in_srgb,var(--signal)_12%,transparent)] text-signal"
                      : "border-hairline text-secondary hover:border-signal hover:text-primary"
                  )}
                >
                  {cluster.label}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* The selected cluster's contents. */}
      <div
        aria-live="polite"
        className="min-h-24 rounded-[2px] border border-hairline bg-ground-raised p-6"
      >
        {activeCluster ? (
          <>
            <p className="font-mono text-label uppercase tracking-label text-data">
              {activeCluster.label}
              {activeCluster.note ? (
                <span className="ms-3 text-faint">{activeCluster.note}</span>
              ) : null}
            </p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {activeCluster.items.map((item) => (
                <li
                  key={item}
                  className="rounded-[2px] border border-hairline px-2.5 py-1 font-mono text-label text-primary"
                >
                  {item}
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p className="text-body-sm text-muted">
            Six clusters. Pick one to see what is in it, and which builds
            it turned up in.
          </p>
        )}
      </div>

      {/* Projects. Dim when a cluster is selected and they are not in it. */}
      <div>
        <p className="font-mono text-label uppercase tracking-label text-faint">
          Built
        </p>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
          {projects.map((project) => {
            const lit = active ? linked.has(project.slug) : true;
            return (
              <li key={project.slug}>
                <Link
                  href={"/projects/" + project.slug}
                  className={cn(
                    "flex min-h-11 flex-col justify-center rounded-[2px] border px-4 py-3",
                    "transition-all dur-ui",
                    lit
                      ? "border-hairline opacity-100"
                      : "border-transparent opacity-30"
                  )}
                >
                  <span
                    className={cn(
                      "font-display",
                      active && lit ? "text-signal" : "text-primary"
                    )}
                  >
                    {project.name}
                  </span>
                  <span className="font-mono text-label text-faint tabular">
                    {project.dates}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
