import type { Metadata } from "next";
import localFont from "next/font/local";
import { Analytics } from "@vercel/analytics/react";
import Link from "next/link";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Mikael Lirbank",
  description:
    "I help companies build better software, focusing on AI and web technologies.",
};

export default function RootLayout(
  props: Readonly<{
    children: React.ReactNode;
  }>,
) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-stone-100 font-sans text-stone-800 antialiased`}
      >
        <header className="sticky top-0 border-b border-stone-300/50 bg-stone-50/70 backdrop-blur-sm">
          <div className="mx-auto flex max-w-3xl justify-between px-6">
            <Link href="/#testimonials" className="hidden p-2 sm:block">
              Testimonials
            </Link>
            <Link href="/#projects" className="p-2">
              Projects
            </Link>
            <Link href="/#services" className="p-2">
              Services
            </Link>
            <Link href="/#benefits" className="p-2">
              Benefits
            </Link>
            <Link href="/#contact" className="p-2">
              Contact
            </Link>
            <Link href="/#about" className="hidden p-2 sm:block">
              About
            </Link>
          </div>
        </header>
        {props.children}
        <footer className="mx-auto max-w-3xl px-8 py-4 text-center">
          © {new Date().getFullYear()} Mikael Lirbank /{" "}
          <a
            href="https://www.airlab.io/"
            className="text-cyan-600 underline underline-offset-3 hover:text-cyan-700"
            target="_blank"
          >
            Airlab LLC
          </a>
          . All rights reserved.
        </footer>
        <Analytics />
      </body>
    </html>
  );
}
