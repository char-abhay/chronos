import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { Arrival } from "@/components/sections/Arrival";
import { Departure } from "@/components/sections/Departure";
import { Reveal } from "@/components/interactive/Reveal";
import { getDestination } from "@/content/destinations";
import { certifications, education, isKnown, profile } from "@/content";

const destination = getDestination("earth")!;

export const metadata: Metadata = {
  title: destination.name,
  description:
    "Abhay P — from Kasaragod, Kerala to CMR University, Bangalore. BCA specialising in Cloud Computing.",
};

export default function OriginPage() {
  return (
    <>
      <Arrival
        index={destination.index}
        name={destination.name}
        scale={destination.scale}
        hook={destination.hook}
      />

      <Container className="pt-12 sm:pt-16">
        <p className="max-w-reading text-body-lg text-secondary">
          Home is {profile.location}. The degree meant moving 300+ kilometres
          south, to Bangalore.
        </p>

        <div className="mt-12 flex flex-col gap-3">
          <Reveal
            label={education.qualification}
            meta={education.dates.label}
            hint="Three major subjects, and only one of them became a specialisation."
          >
            <div className="text-secondary">
              <p>
                {education.institution} · {education.location}
              </p>
              <ul className="mt-5 flex flex-col gap-3">
                {education.majorSubjects.map((subject) => (
                  <li
                    key={subject}
                    className="flex items-baseline gap-3 border-s border-hairline ps-4"
                  >
                    <span className="font-display text-primary">{subject}</span>
                    {subject === "Cloud Computing" ? (
                      <span className="font-mono text-label uppercase tracking-label text-signal">
                        specialisation
                      </span>
                    ) : null}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal
            label="Studied alongside the degree"
            meta={String(certifications.length) + " courses"}
            hint="Taken because they were interesting, not because they were required."
          >
            <ul className="flex flex-col gap-3 text-secondary">
              {certifications.map((cert) => (
                <li key={cert.title}>
                  <span className="text-primary">{cert.title}</span>
                  {isKnown(cert.provider) ? (
                    <span className="text-muted"> — {cert.provider}</span>
                  ) : null}
                  <span className="ms-2 font-mono text-label text-faint">
                    {cert.format}
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </Container>

      <Departure from="earth" />
    </>
  );
}
