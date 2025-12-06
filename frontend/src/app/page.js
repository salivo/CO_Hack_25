"use client";
import HeaderComponent from "./components/header";
import Planetspace from "./components/planetspace";
import { useEffect, useState } from "react";

export default function Home() {
  const [status, setStatus] = useState("loading"); // loading|ok|fail
  const [user, setUser] = useState(null);

  // useEffect(() => {
  //   let cancelled = false;

  //   (async () => {
  //     try {
  //       const res = await fetch("/api/auth/verify", {
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //       });

  //       const json = await res.json();

  //       if (cancelled) return;

  //       if (res.ok && json.ok) {
  //         setUser(json.user);
  //         setStatus("ok");
  //       } else {
  //         setStatus("fail");
  //       }
  //     } catch {
  //       if (!cancelled) setStatus("fail");
  //     }
  //   })();

  //   return () => {
  //     cancelled = true;
  //   };
  // }, []);

  // if (status === "loading") return <p>Verifying…</p>;
  // if (status === "fail") return <p>Not logged in</p>;

  return (
    <div className="flex flex-col h-full">
      <HeaderComponent>
        <div className="flex items-center">
          <button className="login-submit-button w-auto">About Us</button>
        </div>

        <div className="flex space-x-10">
          <button className="login-submit-button w-auto">Login</button>

          <button className="login-submit-button w-auto">Register</button>
        </div>
      </HeaderComponent>

      <Planetspace />
      {/* <Planetspace2 />*/}
    </div>
  );
}
