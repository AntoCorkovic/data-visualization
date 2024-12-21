import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Metadata } from "next";


export const metadata: Metadata = {
  title: "My SaaS Application",
  description: "Navigation and dynamic pages in Next.js",
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <div className="flex">

          <main className="flex-1 overflow-auto">{children}</main>
        </div>
      </body>
    </html>
  );
}