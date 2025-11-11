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
  title: "Doit Music - Your Red-Themed Music Experience",
  description: "Discover and enjoy your favorite music with Doit Music's distinctive red theme. Stream, create playlists, and explore new tracks in a beautifully designed music player.",
  keywords: "music, streaming, playlists, red theme, music player, audio",
  authors: [{ name: "Doit Music" }],
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#dc2626",
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
