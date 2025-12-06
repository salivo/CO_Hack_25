import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return NextResponse.json(
      { ok: false, error: "No token cookie" },
      { status: 401 },
    );
  }

  const rustRes = await fetch("http://127.0.0.1:5432/verify", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!rustRes.ok) {
    const text = await rustRes.text().catch(() => "");
    return NextResponse.json(
      { ok: false, error: text || "Invalid token" },
      { status: 401 },
    );
  }

  const user = await rustRes.json().catch(() => ({}));
  return NextResponse.json({ ok: true, user });
}
