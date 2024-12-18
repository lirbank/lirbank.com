import type { Metadata } from "next";
import localFont from "next/font/local";
import { Analytics } from "@vercel/analytics/next";
import Link from "next/link";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "Mikael Lirbank",
  description: `I help companies build better software, focusing on AI and web technologies.`,
  openGraph: {
    url: "https://lirbank.com/",
    siteName: "Mikael Lirbank",
  },
};

export default function RootLayout(
  props: Readonly<{
    children: React.ReactNode;
  }>,
) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} scroll-smooth`}
    >
      <body className={"bg-stone-100 font-sans text-stone-800 antialiased"}>
        <header className="sticky top-0 border-b border-stone-300/50 bg-stone-50/70 backdrop-blur-sm">
          <div className="mx-auto flex max-w-3xl justify-between px-6">
            <Link href="/#testimonials" className="px-2 py-3">
              Testimonials
            </Link>
            <Link href="/#projects" className="px-2 py-3">
              Projects
            </Link>
            <Link href="/#services" className="px-2 py-3">
              Services
            </Link>
            <Link href="/#benefits" className="px-2 py-3">
              Benefits
            </Link>
            <Link href="/#contact" className="hidden px-2 py-3 md:block">
              Contact
            </Link>
            <Link href="/#talks" className="hidden px-2 py-3 md:block">
              Talks
            </Link>
            <Link href="/#about" className="hidden px-2 py-3 md:block">
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
          . All rights reserved. San Francisco Bay Area.
        </footer>
        <nav className="sticky bottom-0 border-t border-stone-300/50 bg-stone-50/70 backdrop-blur-sm md:hidden">
          <div className="mx-auto flex max-w-3xl justify-between px-6">
            <Link href="/#contact" className="px-2 py-3">
              Contact
            </Link>
            <Link href="/#talks" className="px-2 py-3">
              Talks
            </Link>
            <Link href="/#about" className="px-2 py-3">
              About
            </Link>
            <Link href="/#main" className="px-2 py-3">
              Home
            </Link>
          </div>
        </nav>
        <Analytics />
      </body>
    </html>
  );
}
