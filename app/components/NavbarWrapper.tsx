"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Navbar from "@/components/navbar";
import AnnouncementTicker from "@/components/AnnouncementTicker";

export default function NavbarWrapper() {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

  if (isAdmin) return null;

  return (
    <>
      <AnnouncementTicker />
      <div className="announcement-navbar-offset">
        <Navbar />
      </div>
      <div
        aria-hidden="true"
        className="h-[130px] sm:h-[155px]"
      />
    </>
  );
}
