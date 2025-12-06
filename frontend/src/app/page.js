"use client";
import HeaderComponent from "../components/header";
import Planetspace from "../components/planetspace";
import Planetspace2 from "../components/planetspace2";
import AnimatedHero from "../components/heropage";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [status, setStatus] = useState("loading");
  const [user, setUser] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const router = useRouter();

  const handleLogin = () => router.push("/login");
  const handleRegister = () => router.push("/register");
  const handleAbout = () => router.push("/about");

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
          setUser(json.user);
          setStatus("ok");
        } else {
          setStatus("fail");
        }
      } catch {
        if (!cancelled) setStatus("fail");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (status === "ok") {
      router.replace("/planetspace2");
    }
  }, [status, router]);

  useEffect(() => {
    const timeout = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timeout);
  }, []);

  if (status === "loading") return <p>Verifying…</p>;

  if (status === "fail") {
    return (
      <div className="relative flex flex-col h-full min-h-screen overflow-hidden">
        <div
          className={`absolute inset-0 z-0 transition-all duration-1000 ${
            isVisible ? "opacity-50 translate-y-0" : "opacity-0 translate-y-20"
          }`}
          style={{
            backgroundImage: "url('/cosmos.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        <div className="relative z-10 flex flex-col h-full">
          <HeaderComponent>
            <div className="flex items-center">
              <button
                className="login-submit-button w-auto"
                onClick={handleAbout}
              >
                About Us
              </button>
            </div>

            <div className="flex space-x-10">
              <button
                className="login-submit-button w-auto"
                onClick={handleLogin}
              >
                Login
              </button>
              <button
                className="login-submit-button w-auto"
                onClick={handleRegister}
              >
                Register
              </button>
            </div>
          </HeaderComponent>

          <AnimatedHero />
        </div>
      </div>
    );
  }
}
