"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import CartDrawer from "./CartDrawer";

// Shows the customer navbar + cart drawer everywhere except the admin area.
export default function ClientNavbarWrapper() {
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <>
      <Navbar />
      <CartDrawer />
    </>
  );
}