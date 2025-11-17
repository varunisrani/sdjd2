import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Doit Music - Your Yellow-Themed Music Experience",
  description: "Discover and enjoy your favorite music with Doit Music's distinctive yellow theme. Stream, create playlists, and explore new tracks in a beautifully designed music player.",
  keywords: "music, streaming, playlists, yellow theme, music player, audio",
  authors: [{ name: "Doit Music" }],
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#FFC107",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-900 text-white`}
      >
        {children}
      </body>
    </html>
  );
}
