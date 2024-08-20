"use client";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { ThemeProvider } from "next-themes";

import { Global } from "@/components/global/global";
import * as ga from '@/lib/ga'

export function Providers({ children }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (pathname && searchParams) {
      const qs = searchParams.toString();
      ga.pageview(`${pathname}${qs ? `?${qs}` : ""}`);
    }
  }, [pathname, searchParams]);

  return (
    <ThemeProvider attribute="class" disableTransitionOnChange>
      <Global />
      {children}
    </ThemeProvider>
  );
}
