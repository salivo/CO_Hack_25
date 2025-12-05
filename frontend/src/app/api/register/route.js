import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    // 1) read JSON from browser request
    const body = await req.json();

    // 2) forward it to Rust backend
    const rustRes = await fetch("http://127.0.0.1:5432/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    // 3) Rust might return JSON error OR empty body on success
    const data = await rustRes.json().catch(() => ({}));

    // 4) build response to browser with same status + data
    const nextRes = NextResponse.json(data, { status: rustRes.status });

    // 5) forward Authorization token header if Rust sent it
    const auth = rustRes.headers.get("authorization");
    if (auth) nextRes.headers.set("authorization", auth);

    return nextRes;
  } catch (err) {
    // if request body isn't valid JSON, etc.
    return NextResponse.json(
      { message: "Bad request", error: String(err) },
      { status: 400 },
    );
  }
}
