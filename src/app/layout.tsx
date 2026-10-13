import type { Metadata } from "next";
import { Urbanist, Space_Grotesk } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const urbanist = Urbanist({
  variable: "--font-urbanist",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "PropheC AI — AI-Driven Technology & Digital Solutions",
  description:
    "AI products, business systems and automation—from concept to deployment and beyond. Building the systems behind modern businesses.",
  keywords: [
    "PropheC AI",
    "AI Ecosystem",
    "Workflow Automation",
    "Enterprise AI",
    "Argus AI",
  ],
  authors: [{ name: "PropheC AI" }],
  openGraph: {
    title: "PropheC AI — AI-Driven Technology & Digital Solutions",
    description:
      "AI products, business systems and automation—from concept to deployment and beyond.",
    type: "website",
    url: "https://x.com/prophecai",
  },
  verification: {
    google: "EAYorVI8hMWnbvAdWaphIUZ_OEziOaOO26l3EYoIflA",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${urbanist.variable} ${spaceGrotesk.variable} scroll-smooth antialiased`}
    >
      <body className="min-h-screen bg-[#08090B] text-white font-urbanist selection:bg-[#03FEA7] selection:text-[#08090B]">
        {/* Google tag (gtag.js) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-NP1TJQ1L7Y"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-NP1TJQ1L7Y');
          `}
        </Script>
        {children}
      </body>
    </html>
  );
}
