import type { Metadata, Viewport } from "next";
import { Nunito, Fredoka } from "next/font/google";
import "./globals.css";
import { CartProvider } from "./components/CartProvider";
import ClientNavbarWrapper from "./components/ClientNavbarWrapper";
import Footer from "./components/Footer";

// Body text: Nunito (soft, rounded, easy to read on phones)
// Headings / brand: Fredoka (playful, fits an ice cream shop)
// To try another font, change the two lines below (e.g. Poppins, DM_Sans, Baloo_2, Quicksand).
const sans = Nunito({ subsets: ["latin"], variable: "--font-sans" });
const display = Fredoka({ subsets: ["latin"], variable: "--font-display" });

export const metadata: Metadata = {
  title: "SweetIce - Ice Cream Parlour",
  description: "Delivering sweet treats to your door",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${display.variable}`}>
      <body className="font-sans antialiased min-h-screen bg-gradient-to-b from-pink-50/50 via-white to-pink-50/30 text-gray-900 overflow-x-hidden">
        <CartProvider>
          <ClientNavbarWrapper />
          <main className="w-full">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}