"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginComponent() {
  const router = useRouter();
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login, password }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setMessage(data.error || "Login failed");
        return;
      }

      setMessage("Login successful!");

      router.push("/");
      router.refresh();
    } catch (e) {
      setMessage(e?.message || "Network error");
    }
  }

  const overlayColor = "rgba(10, 10, 10, 0.75)";

  return (
    <div
      className="flex min-h-screen w-screen items-center justify-center bg-[#0a0a0a] font-mono text-gray-200"
      style={{
        backgroundImage: `linear-gradient(${overlayColor}, ${overlayColor}), url('/background.jpg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        backgroundRepeat: "no-repeat",
      }}
    >
      <form
        className="bg-[#1a2a3a]/40 p-12 rounded-2xl w-full max-w-md border-2 border-[#2f6f6f] backdrop-blur-sm shadow-xl shadow-[#142f3f]/60"
        onSubmit={handleSubmit}
      >
        <h2 className="text-3xl font-bold mb-10 text-center text-[#678666]">
          Login
        </h2>

        <div className="mb-6">
          <label
            htmlFor="login"
            className="block text-sm font-medium mb-2 text-[#678666]"
          >
            Login:
          </label>
          <input
            type="text"
            id="login"
            name="login"
            placeholder="Enter your login"
            required
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            className="w-full p-3 bg-[#1f3f4f] border border-[#1a3a4a] rounded-md text-gray-200 focus:ring-2 focus:ring-[#2f6f6f] focus:border-[#2f6f6f] transition duration-200"
          />
        </div>

        <div className="mb-8">
          <label
            htmlFor="password"
            className="block text-sm font-medium mb-2 text-[#678666]"
          >
            Password:
          </label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Enter password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 bg-[#1f3f4f] border border-[#1a3a4a] rounded-md text-gray-200 focus:ring-2 focus:ring-[#2f6f6f] focus:border-[#2f6f6f] transition duration-200"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-[#2f6f6f] text-[#0a0a0a] font-semibold rounded-md hover:bg-[#2f6f6f]/80 transition duration-200 shadow-lg shadow-[#1a3a4a]/50 active:translate-y-0.5 disabled:opacity-60"
        >
          Sign In
        </button>

        {message && <p className="mt-4 text-center text-sm">{message}</p>}
      </form>
    </div>
  );
}
