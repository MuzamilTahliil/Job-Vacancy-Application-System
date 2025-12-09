"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";

export default function ConditionalHeader() {
  const pathname = usePathname();
  
  // Don't show header on admin and employer routes
  if (pathname?.startsWith("/admin") || pathname?.startsWith("/employer")) {
    return null;
  }
  
  return <Header />;
}

