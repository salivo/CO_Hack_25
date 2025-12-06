"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LoginComponent from "@/components/login";

export default function LoginPage() {
  const [status, setStatus] = useState("loading"); // loading | ok | fail
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const res = await fetch("/api/auth/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });

        const json = await res.json();
        if (cancelled) return;

        if (res.ok && json.ok) {
          setStatus("ok");
          router.replace("/");
        } else {
          setStatus("fail");
        }
      } catch {
        if (!cancelled) setStatus("fail");
      }
    })();

    return () => (cancelled = true);
  }, [router]);

  if (status === "loading") return <p>Checking session…</p>;
  const overlayColor = "rgba(10, 10, 10, 0.75)";

  return (
    <div
      className="flex min-h-screen w-screen items-center justify-center bg-[#0a0a0a] font-mono"
      style={{
        backgroundImage: `linear-gradient(${overlayColor}, ${overlayColor}), url('/background.jpg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        backgroundRepeat: "no-repeat",
      }}
    >
      <LoginComponent />
    </div>
  );
}
