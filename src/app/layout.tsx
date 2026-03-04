import type { Metadata } from "next";
import { Inter, Instrument_Serif, Geist_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "900"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://sigstack.dev"),
  title: "sigstack — Claude Code Stack for AI-Powered Development",
  description: "84 skills, 36 plugins, 27 MCP servers. Built on Cowork Plugins architecture. My personal Claude Code stack for shipping software with AI. Ready to clone.",
  keywords: ["Claude Code", "AI coding", "developer tools", "MCP servers", "Claude AI", "Cowork Plugins", "sigstack"],
  authors: [{ name: "Will Sigmon", url: "https://willsigmon.media" }],
  openGraph: {
    title: "sigstack — Claude Code Stack for AI-Powered Development",
    description: "84 skills, 36 plugins, 27 MCP servers. Built on Cowork Plugins. Ready to clone.",
    url: "https://sigstack.dev",
    siteName: "sigstack",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "sigstack — Claude Code Stack",
    description: "84 skills, 36 plugins, 27 MCP servers. Built on Cowork Plugins. Ready to clone.",
    creator: "@willsigmon",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${instrumentSerif.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {/* WSM Atmospheric Overlays */}
        <div className="paper-grain" aria-hidden="true" />
        <div className="vignette" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
