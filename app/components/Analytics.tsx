"use client";
import Script from "next/script";
import { useEffect, useState } from "react";

export default function Analytics() {
  const [ok, setOk] = useState(false);
  useEffect(() => {
    const read = () => setOk(localStorage.getItem("hrc-consent") === "accepted");
    read();
    window.addEventListener("hrc-consent-changed", read);
    return () => window.removeEventListener("hrc-consent-changed", read);
  }, []);
  const domain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
  if (!ok || !domain) return null;
  return <Script defer data-domain={domain} src="https://plausible.io/js/script.js" strategy="afterInteractive" />;
}
