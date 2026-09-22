import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import ClientNavbarWrapper from "./components/ClientNavbarWrapper"; // or conditionally check

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const display = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: "IceBar - Ice Cream Parlour",
  description: "Delivering sweet treats to your door",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${display.variable}`}>
      <body className="font-sans antialiased bg-gradient-to-b from-pink-50/50 via-white to-pink-50/30 text-gray-900">
        <ClientNavbarWrapper />
        <main>{children}</main>
      </body>
    </html>
  );
}