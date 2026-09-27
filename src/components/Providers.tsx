"use client";

import { AppProgressBar as ProgressBar } from "next-nprogress-bar";
import { ToastProvider } from "@/components/ui/Toast";
export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ToastProvider position="bottom-right">{children}</ToastProvider>
      <ProgressBar
        height="3px"
        color="#2563eb"
        options={{ showSpinner: false }}
        shallowRouting
      />
    </>
  );
}
