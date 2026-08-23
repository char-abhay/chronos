import type { Metadata, Viewport } from "next";
import { Instrument_Sans, Inter, JetBrains_Mono } from "next/font/google";
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
    <html lang="en">
      <body
        className={`${instrumentSans.variable} ${inter.variable} ${jetbrainsMono.variable}`}
      >
        <SkipLink />

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
