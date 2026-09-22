"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";

export default function ClientNavbarWrapper() {
  const pathname = usePathname();
  
  if (pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <div className="pt-24"> {/* This pushes content down on non-admin/non-login pages */}
      <Navbar />
    </div>
  );
}