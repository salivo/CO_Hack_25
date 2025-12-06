import { NextResponse } from "next/server";
export async function POST(req) {
  const body = await req.json();

  const rustRes = await fetch(process.env.AUTH_HOST + "/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await rustRes.json().catch(() => ({}));

  const nextRes = NextResponse.json(data, { status: rustRes.status });

  const auth = rustRes.headers.get("authorization");

  if (auth?.startsWith("Bearer ")) {
    const token = auth.slice("Bearer ".length);
    console.log(token);
    nextRes.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
  }

  return nextRes;
}
