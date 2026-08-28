import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { InView } from "@/components/motion/InView";
import { Departure } from "@/components/sections/Departure";
import { ButtonLink } from "@/components/ui/Button";
import { ExternalLink } from "@/components/ui/ExternalLink";
import { Stamp } from "@/components/ui/Stamp";
import { destinations } from "@/content/destinations";
import { education, experience, profile, projectsOrdered } from "@/content";

/**
 * FIRST SCREEN.
 *
 * The recruiter guarantee holds regardless of anything cinematic: name,
 * credential and current status are in server-rendered HTML, above the
 * fold, before any scroll, animation or JavaScript.
 *
 * The atmosphere sits behind this in a fixed layer, so nothing here has
 * to wait for it -- and if it never loads, the page is unchanged apart
 * from being darker.
 */
export default function Home() {
  const role = experience[0];
  const featured = projectsOrdered.find((p) => p.featured);

  return (
    <>
      {/* ---------- ARRIVAL ---------- */}
      <Container className="flex min-h-[82dvh] flex-col justify-center pt-16">
        <InView>
          <Stamp>01 · Home · Here · now</Stamp>
        </InView>

        <InView delay={80}>
          <h1 className="mt-6 font-display text-display-xl leading-display tracking-display text-primary">
            {profile.name}
          </h1>
        </InView>

        <InView delay={160}>
          <p className="mt-5 max-w-reading text-body-lg text-secondary">
            {profile.credential}, specialising in Cloud Computing. Five things
            built — one of them on the job.
          </p>
        </InView>

        {/* Identity block: the facts, immediately, no interaction needed. */}
        <InView delay={240}>
          <div className="mt-10 flex flex-col gap-1 border-s border-hairline ps-5 text-body-sm">
            <p className="text-secondary">
              {education.qualification} · {education.institution},{" "}
              {education.location}{" "}
              <span className="font-mono text-label text-faint tabular">
                {education.dates.label}
              </span>
            </p>
            <p className="text-secondary">
              {role.role} · {role.organisation}{" "}
              <span className="font-mono text-label text-faint tabular">
                {role.dates.label}
              </span>
            </p>
            <p className="text-muted">{profile.location}</p>
          </div>
        </InView>

        <InView delay={320}>
          <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-body-sm">
            <ExternalLink href={profile.links.github.href}>
              {profile.links.github.label}
            </ExternalLink>
            <ExternalLink href={profile.links.linkedin.href}>
              {profile.links.linkedin.label}
            </ExternalLink>
            <a
              href={profile.links.resume.href}
              className="text-secondary underline underline-offset-4 decoration-hairline transition-colors dur-micro hover:text-primary hover:decoration-signal"
            >
              Resume (PDF)
            </a>
          </div>
        </InView>

        <InView delay={400}>
          <div className="mt-10 flex flex-wrap gap-4">
            <ButtonLink href="/time" variant="primary">
              Begin
            </ButtonLink>
            <ButtonLink href="/profile" variant="secondary">
              View profile
            </ButtonLink>
          </div>
        </InView>

        <InView delay={520}>
          <p
            aria-hidden="true"
            className="mt-16 font-mono text-label uppercase tracking-label text-faint"
          >
            Scroll
          </p>
        </InView>
      </Container>

      {/* ---------- BEAT ONE: the featured build ---------- */}
      {featured ? (
        <Container className="pt-24 sm:pt-32">
          <InView>
            <Stamp>Selected</Stamp>
          </InView>
          <InView delay={80}>
            <h2 className="mt-5 max-w-reading font-display text-display-md leading-display tracking-display text-primary">
              {featured.name}
            </h2>
          </InView>
          <InView delay={160}>
            <p className="mt-4 max-w-reading text-body-lg text-secondary">
              {featured.what}
            </p>
          </InView>
          <InView delay={240}>
            <p className="mt-6">
              <Link
                href={"/projects/" + featured.slug}
                className="text-signal underline underline-offset-[6px] decoration-hairline transition-colors dur-micro hover:decoration-signal"
              >
                Open the build →
              </Link>
            </p>
          </InView>
        </Container>
      ) : null}

      {/* ---------- BEAT TWO: the regions ---------- */}
      <Container className="pt-24 sm:pt-32">
        <InView>
          <Stamp>Eight regions</Stamp>
        </InView>
        <InView delay={80}>
          <p className="mt-5 max-w-reading text-body-lg text-secondary">
            Everything is reachable from anywhere. Nothing is locked, and no
            order is required.
          </p>
        </InView>

        <ol className="mt-10 border-t border-hairline">
          {destinations.slice(1).map((destination, i) => (
            <li key={destination.id}>
              <InView delay={i * 60}>
                <Link
                  href={destination.href}
                  className="group flex items-baseline gap-5 border-b border-hairline py-5 transition-colors dur-micro hover:bg-ground-raised"
                >
                  <span className="font-mono text-label text-faint tabular">
                    {destination.index}
                  </span>
                  <span className="flex-1">
                    <span className="block font-display text-body-lg text-primary transition-colors dur-micro group-hover:text-signal">
                      {destination.name}
                    </span>
                    <span className="mt-0.5 block text-body-sm text-muted">
                      {destination.hook}
                    </span>
                  </span>
                  <span className="hidden font-mono text-label text-faint tabular sm:block">
                    {destination.scale}
                  </span>
                </Link>
              </InView>
            </li>
          ))}
        </ol>
      </Container>

      <Departure from="home" />
    </>
  );
}
