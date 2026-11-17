import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { SiteHeader } from "@/components/layout/SiteHeader";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <Component {...pageProps} />
      </main>
    </div>
  );
}
