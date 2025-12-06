"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import RegisterComponent from "@/components/register";

export default function RegisterPage() {
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

  if (status === "loading") {
    return <p>Checking session…</p>;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <RegisterComponent />
    </div>
  );
}
