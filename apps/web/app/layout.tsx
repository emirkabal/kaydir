import type { Metadata } from "next";
import { Rubik } from "next/font/google";
import "./globals.css";
import AppReady from "./app-ready";

const rubik = Rubik({
  subsets: ["latin"],
  variable: "--font-rubik",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Kaydir",
  description: "A monorepo with Kaydir",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${rubik.variable}`}>
        <AppReady>{children}</AppReady>
      </body>
    </html>
  );
}
