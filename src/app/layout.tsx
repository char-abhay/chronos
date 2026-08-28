import type { Metadata, Viewport } from "next";
import { Instrument_Sans, Inter, JetBrains_Mono } from "next/font/google";
import { Atmosphere } from "@/components/atmosphere/Atmosphere";
import { ScrollProvider } from "@/components/motion/ScrollProvider";
import { SceneRoot } from "@/components/three/SceneRoot";
import { Footer } from "@/components/layout/Footer";
import { Chrome } from "@/components/navigation/Chrome";
import { SkipLink } from "@/components/navigation/SkipLink";
import { ProfileContent } from "@/components/portfolio/ProfileContent";
import "./globals.css";

/* Three roles, three families (plan F.2).
   Only the weights actually used are loaded. */
const instrumentSans = Instrument_Sans({
  variable: "--font-instrument-sans",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  // Greek subset carries the recurring symbols: tau, gamma, delta.
  subsets: ["latin", "greek"],
  display: "swap",
});

/* TODO(Phase 10): replace with the real custom domain once chosen.
   Deliberately not invented — see plan L.4. */
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Abhay P — BCA Graduate, Cloud Computing",
    template: "%s · CHRONOS — Abhay P",
  },
  description:
    "Abhay P — BCA graduate specialising in Cloud Computing. Full Stack Development Intern at EduPhoenix Solutions. Projects in blockchain, AI, IoT and web development.",
  authors: [{ name: "Abhay P" }],
  creator: "Abhay P",
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "CHRONOS — Abhay P",
    title: "Abhay P — BCA Graduate, Cloud Computing",
    description:
      "A journey through space and time that happens to be a developer portfolio.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#08090b",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <head>
        {/* Scroll reveals render hidden and are unhidden by script. With
            JavaScript off, this forces them visible so the portfolio is
            fully readable -- the content must never depend on the
            animation layer. */}
        <noscript>
          <style>{"[data-reveal]{opacity:1 !important;transform:none !important}"}</style>
        </noscript>
      </head>
      <body
        className={`${instrumentSans.variable} ${inter.variable} ${jetbrainsMono.variable}`}
      >
        <SkipLink />

        {/* Smooth scroll and the scroll-to-camera link. Renders nothing,
            and loads nothing at all under reduced motion. */}
        <ScrollProvider />

        {/* Persistent across every route: never unmounts, so moving
            between regions shifts hue rather than flashing black. */}
        <Atmosphere />

        {/* The WebGL world, layered over the CSS atmosphere. Loads only
            on devices that can run it; everywhere else this renders
            nothing and the atmosphere above is the whole picture. */}
        <SceneRoot />

        {/* ProfileContent is rendered on the server and handed to the
            client Chrome as a node, so the profile content never enters
            the client JavaScript bundle. */}
        <Chrome profileContent={<ProfileContent headingLevel={2} />} />

        {/* Padding clears the fixed rail on desktop and the fixed bottom
            bar on mobile. */}
        <div className="lg:ps-[var(--rail-width)]">
          <main id="main" className="pb-28 lg:pb-0">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
