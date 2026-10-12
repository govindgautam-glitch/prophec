import type { Metadata } from "next";
import { Urbanist, Space_Grotesk } from "next/font/google";
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
        {children}
      </body>
    </html>
  );
}
