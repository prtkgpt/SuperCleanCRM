import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { MobileNav } from "@/components/MobileNav";
import { Sidebar } from "@/components/Sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Solo Cleaner App",
  description: "Simple management for solo cleaners",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 pb-20 md:pb-0`}
      >
        <Sidebar />
        <div className="md:pl-64 min-h-screen">
            <div className="max-w-4xl mx-auto md:p-8 bg-white md:bg-transparent shadow-sm md:shadow-none min-h-screen">
             {children}
            </div>
        </div>
        <MobileNav />
      </body>
    </html>
  );
}
