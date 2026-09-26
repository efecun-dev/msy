"use client";

import { AppProgressBar as ProgressBar } from "next-nprogress-bar";
import { ToastProvider } from "@/components/ui/Toast";
import { ThemeProvider } from "next-themes";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <ToastProvider position="bottom-right">{children}</ToastProvider>
      <ProgressBar
        height="3px"
        color="#2563eb"
        options={{ showSpinner: false }}
        shallowRouting
      />
    </ThemeProvider>
  );
}
