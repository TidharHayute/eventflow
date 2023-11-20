import "@/styles/globals.css";
import "@radix-ui/themes/styles.css";

import type { AppProps } from "next/app";
import { Theme } from "@radix-ui/themes";

import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";
import { SessionContextProvider, Session } from "@supabase/auth-helpers-react";
import { useState } from "react";
import { Toaster } from "sonner";

import { Analytics } from "@vercel/analytics/react";

export default function App({
  Component,
  pageProps,
}: AppProps<{
  initialSession: Session;
}>) {
  const [supabaseClient] = useState(() => createPagesBrowserClient());

  return (
    <SessionContextProvider
      supabaseClient={supabaseClient}
      initialSession={pageProps.initialSession}
    >
      <Theme appearance="dark" radius="large" scaling="95%">
        <Toaster
          theme="dark"
          position="top-right"
          toastOptions={{
            style: {
              borderRadius: "14px",
              background: "#151515",
            },
          }}
        />
        <Component {...pageProps} />
      </Theme>

      <Analytics />
    </SessionContextProvider>
  );
}
