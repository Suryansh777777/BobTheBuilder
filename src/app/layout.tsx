import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BobTheBuilder - 3D Brick Editor",
  description:
    "A modern 3D LEGO-style brick editor built with Next.js and React Three Fiber.",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "BobTheBuilder - 3D Brick Editor",
    description:
      "A modern 3D LEGO-style brick editor built with Next.js and React Three Fiber.",
    url: "https://bob-the-builder-kappa.vercel.app/",
    siteName: "BobTheBuilder",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BobTheBuilder - 3D Brick Editor",
    description:
      "A modern 3D LEGO-style brick editor built with Next.js and React Three Fiber.",
    creator: "@suryansh777777",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#0f172a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${plusJakarta.variable} ${geistMono.variable} antialiased bg-slate-950 text-slate-50 overflow-hidden font-sans`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
