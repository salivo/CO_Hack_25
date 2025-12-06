import { NextResponse } from "next/server";

export const runtime = "nodejs"; // ✅ force Node, so localhost fetch works

export async function POST(req) {
  try {
    const body = await req.json();

    const rustRes = await fetch("http://127.0.0.1:5432/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const text = await rustRes.text();
    let data = {};
    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      data = text ? { message: text } : {};
    }

    const nextRes = NextResponse.json(
      rustRes.ok ? { ok: true, ...data } : data,
      { status: rustRes.status },
    );

    const auth = rustRes.headers.get("authorization");
    if (auth?.startsWith("Bearer ")) {
      const token = auth.slice("Bearer ".length).trim();
      nextRes.cookies.set("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });
    }

    return nextRes;
  } catch (err) {
    console.error("REGISTER ROUTE ERROR:", err); // ✅ log real cause
    return NextResponse.json(
      { ok: false, message: "Bad request", error: String(err) },
      { status: 400 },
    );
  }
}
