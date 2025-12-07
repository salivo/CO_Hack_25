// Server-side proxy to avoid CORS.
// Put this at: app/api/dispatch/route.js

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BASE_URLS = {
  files: "http://localhost:8000",
  tasks: "http://localhost:8001",
  users: "http://localhost:8002",
  bruth: "http://localhost:5000",
};

function fillPathParams(path, params) {
  return path.replace(/\{(\w+)\}/g, (_, p1) => {
    return params?.[p1] ?? `{${p1}}`;
  });
}

export async function POST(req) {
  try {
    const contentType = req.headers.get("content-type") || "";

    // ===== multipart upload =====
    if (contentType.includes("multipart/form-data")) {
      const form = await req.formData();
      const serviceKey = form.get("serviceKey");
      const actionId = form.get("actionId");
      const file = form.get("uploaded_file");

      const baseUrl = BASE_URLS[serviceKey];
      if (!baseUrl) return new Response("Unknown serviceKey", { status: 400 });

      // only one upload action exists right now → /upload
      const targetUrl = baseUrl + "/upload";

      const fd = new FormData();
      fd.append("uploaded_file", file);

      const upstream = await fetch(targetUrl, {
        method: "POST",
        body: fd,
      });

      const body = await upstream.text();
      return new Response(body, {
        status: upstream.status,
        headers: {
          "Content-Type": upstream.headers.get("content-type") || "text/plain",
        },
      });
    }

    // ===== json actions =====
    const { serviceKey, actionId, method, path, bodyType, template, params } =
      await req.json();

    const baseUrl = BASE_URLS[serviceKey];
    if (!baseUrl) return new Response("Unknown serviceKey", { status: 400 });

    const filledPath = fillPathParams(path, params);
    const targetUrl = baseUrl + filledPath;

    const fetchOptions = { method, headers: {} };

    if (bodyType === "json") {
      fetchOptions.headers["Content-Type"] = "application/json";
      fetchOptions.body = JSON.stringify(template ?? {});
    }

    const upstream = await fetch(targetUrl, fetchOptions);
    const body = await upstream.text();

    return new Response(body, {
      status: upstream.status,
      headers: {
        "Content-Type": upstream.headers.get("content-type") || "text/plain",
      },
    });
  } catch (e) {
    return new Response(`Dispatch error: ${e.message}`, { status: 500 });
  }
}
