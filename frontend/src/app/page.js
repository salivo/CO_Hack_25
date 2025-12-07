"use client";
import HeaderComponent from "../components/header";
import AnimatedHero from "../components/heropage";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Statistic from "../components/statbar";
import PlanetSpace from "@/components/planetspace3";
import HamburgerMenu from "@/components/hamburger";
import MissionLog from "@/components/missionlog";
import StarBackground from "@/components/star_bg";

function Logined() {
  return (
    <>
      <div className="absolute top-5 left-5 z-10">
        <Statistic />
      </div>
      <div className="absolute bottom-5 left-5 z-20">
        <MissionLog />
      </div>
      <PlanetSpace />
    </>
  );
}

const handleLogin = () => router.push("/login");
const handleRegister = () => router.push("/register");
const handleAbout = () => router.push("/about");

function HeroPage({ onLogin, onRegister }) {
  const router = useRouter();
  return (
    <div className="page-scroll overflow-x-hidden">
      <div className="flex flex-col h-full">
        <HeaderComponent>
          <div className="flex items-center">
            <button className="login-submit-button w-auto">About Us</button>
          </div>

          <div className="flex space-x-10">
            <button className="login-submit-button w-auto" onClick={onLogin}>
              Login
            </button>
            <button className="login-submit-button w-auto" onClick={onRegister}>
              Register
            </button>
          </div>
        </HeaderComponent>
        <StarBackground />

        <AnimatedHero />
      </div>
    </div>
  );
}

export default function Home() {
  const [status, setStatus] = useState("loading"); // loading | ok | fail
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

  if (status === "loading") return <p>Verifying…</p>;

  if (status === "ok") return <Logined user={user} />;

  if (status === "fail")
    return <HeroPage onLogin={handleLogin} onRegister={handleRegister} />;
}
