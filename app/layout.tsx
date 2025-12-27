import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { OfflineDetector } from "./components/OfflineDetector";
import { UpdateBanner } from "./components/UpdateBanner";
import { InstallPrompt } from "./components/InstallPrompt";
import { AppSessionProvider } from "./components/SessionProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "OLX EMP",
  description: "OLX Employee Management Portal",
  manifest: "/manifest.json",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <OfflineDetector />
        <UpdateBanner />
        <InstallPrompt />
        <AppSessionProvider>{children}</AppSessionProvider>
      </body>
    </html>
  );
}
