"use client";

import { useState } from "react";

/** =========================
 *  SCHEMA TEMPLATES (defaults)
 *  ========================= */

const USERS_CREATE_TEMPLATE = {
  name: "string",
  avatar: "string",
  role: "student",
  xp_points: 0,
  level: 0,
  learning_streak: 0,
  completed_lessons_count: 0,
};

const USERS_UPDATE_TEMPLATE = {
  name: null,
  avatar: null,
  role: null,
  xp_points: null,
  level: null,
  learning_streak: null,
  completed_lessons_count: null,
};

const COURSE_CREATE_TEMPLATE = {
  name: "demo-course",
};

const TASK_CREATE_TEMPLATE = {
  title: "string",
  data: "string",
  text: "string",
  video: "string",
  image: "string",
};

const TASK_UPDATE_TEMPLATE = {
  title: null,
  data: null,
  text: null,
  video: null,
  image: null,
};

const PARAMS_TEMPLATE = {
  user_id: "1",
  course_name: "demo-course",
  task_id: "1",
  file_id: "1",
};

/** =========================
 *  ACTIONS
 *  editableFields = fields to render inputs for JSON body
 *  ========================= */

const SERVICES = [
  {
    key: "files",
    actions: [
      {
        id: "files_upload",
        label: "POST /upload (upload file)",
        method: "POST",
        path: "/upload",
        bodyType: "upload",
      },
      {
        id: "files_download",
        label: "GET /download/{file_id} (download file)",
        method: "GET",
        path: "/download/{file_id}",
        bodyType: "none",
      },
      {
        id: "files_stream",
        label: "GET /stream/{file_id} (stream video)",
        method: "GET",
        path: "/stream/{file_id}",
        bodyType: "none",
      },
    ],
  },
  {
    key: "tasks",
    actions: [
      {
        id: "tasks_make_course",
        label: "POST /courses (make course)",
        method: "POST",
        path: "/courses",
        bodyType: "json",
        template: COURSE_CREATE_TEMPLATE,
        editableFields: ["name"], // <-- you asked for this
      },
      {
        id: "tasks_make_task",
        label: "POST /courses/{course_name}/tasks (make task)",
        method: "POST",
        path: "/courses/{course_name}/tasks",
        bodyType: "json",
        template: TASK_CREATE_TEMPLATE,
        editableFields: ["title", "data", "text", "video", "image"], // <-- you asked for these
      },
      {
        id: "tasks_get_all",
        label: "GET /courses/{course_name}/tasks (get all tasks)",
        method: "GET",
        path: "/courses/{course_name}/tasks",
        bodyType: "none",
      },
      {
        id: "tasks_get_one",
        label: "GET /courses/{course_name}/tasks/{task_id} (get task by id)",
        method: "GET",
        path: "/courses/{course_name}/tasks/{task_id}",
        bodyType: "none",
      },
      {
        id: "tasks_patch",
        label: "PATCH /courses/{course_name}/tasks/{task_id} (update task)",
        method: "PATCH",
        path: "/courses/{course_name}/tasks/{task_id}",
        bodyType: "json",
        template: TASK_UPDATE_TEMPLATE,
        // no editableFields requested, so none
      },
      {
        id: "tasks_delete",
        label: "DELETE /courses/{course_name}/tasks/{task_id} (delete task)",
        method: "DELETE",
        path: "/courses/{course_name}/tasks/{task_id}",
        bodyType: "none",
      },
    ],
  },
  {
    key: "users",
    actions: [
      {
        id: "users_get_all",
        label: "GET /users (get all users)",
        method: "GET",
        path: "/users",
        bodyType: "none",
      },
      {
        id: "users_make",
        label: "POST /users (make user)",
        method: "POST",
        path: "/users",
        bodyType: "json",
        template: USERS_CREATE_TEMPLATE,
        editableFields: [
          "name",
          "avatar",
          "role",
          "xp_points",
          "level",
          "learning_streak",
          "completed_lessons_count",
        ], // <-- you asked for these
      },
      {
        id: "users_get_one",
        label: "GET /users/{user_id} (get user by id)",
        method: "GET",
        path: "/users/{user_id}",
        bodyType: "none",
      },
      {
        id: "users_patch",
        label: "PATCH /users/{user_id} (update user)",
        method: "PATCH",
        path: "/users/{user_id}",
        bodyType: "json",
        template: USERS_UPDATE_TEMPLATE,
      },
      {
        id: "users_delete",
        label: "DELETE /users/{user_id} (delete user)",
        method: "DELETE",
        path: "/users/{user_id}",
        bodyType: "none",
      },
    ],
  },
  { key: "bruth", actions: [] },
];

function getPathParams(path) {
  const matches = path.match(/\{(\w+)\}/g) || [];
  return matches.map((m) => m.slice(1, -1));
}

/** button styles for dark bg */
const buttonBaseStyle = {
  padding: "8px 12px",
  borderRadius: 8,
  border: "1px solid #334155",
  background: "#0b1220",
  color: "#e2e8f0",
  fontSize: 14,
  fontWeight: 600,
  cursor: "pointer",
  boxShadow: "0 0 0 1px rgba(255,255,255,0.03) inset",
  transition:
    "transform 80ms ease, border-color 120ms ease, background 120ms ease",
};
const buttonHoverStyle = {
  border: "1px solid #60a5fa",
  background: "#0f172a",
  transform: "translateY(-1px)",
};
const buttonDisabledStyle = {
  opacity: 0.6,
  cursor: "default",
  border: "1px solid #1f2937",
  background: "#050814",
};

export default function Page() {
  const [sending, setSending] = useState({});
  const [lastResponse, setLastResponse] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);

  // param inputs per action
  const [paramValues, setParamValues] = useState({});

  // body inputs per action (for json bodies)
  const [bodyValues, setBodyValues] = useState({});

  function setParam(serviceKey, actionId, paramName, value) {
    setParamValues((prev) => ({
      ...prev,
      [serviceKey]: {
        ...(prev[serviceKey] || {}),
        [actionId]: {
          ...((prev[serviceKey] || {})[actionId] || {}),
          [paramName]: value,
        },
      },
    }));
  }

  function setBodyField(serviceKey, action, field, value) {
    setBodyValues((prev) => {
      const svc = prev[serviceKey] || {};
      const act = svc[action.id] || { ...(action.template || {}) };
      return {
        ...prev,
        [serviceKey]: {
          ...svc,
          [action.id]: {
            ...act,
            [field]: value,
          },
        },
      };
    });
  }

  function buildParamsFor(serviceKey, action) {
    const needed = getPathParams(action.path);
    const typed = (paramValues[serviceKey] || {})[action.id] || {};
    const params = { ...PARAMS_TEMPLATE };
    for (const p of needed) {
      if (typed[p] !== undefined && typed[p] !== "") params[p] = typed[p];
    }
    return params;
  }

  function buildBodyFor(serviceKey, action) {
    const typed = (bodyValues[serviceKey] || {})[action.id];
    return typed ?? action.template ?? {};
  }

  async function sendAction(serviceKey, action) {
    setSending((p) => ({ ...p, [action.id]: true }));
    setLastResponse((p) => ({ ...p, [action.id]: null }));

    try {
      const params = buildParamsFor(serviceKey, action);

      let res;

      if (action.bodyType === "upload") {
        const fd = new FormData();
        fd.append("serviceKey", serviceKey);
        fd.append("actionId", action.id);

        if (selectedFile) {
          fd.append("uploaded_file", selectedFile);
        } else {
          fd.append("uploaded_file", new Blob([]), "empty.bin");
        }

        res = await fetch("/api/dispatch", {
          method: "POST",
          body: fd,
        });
      } else {
        const bodyToSend =
          action.bodyType === "json" ? buildBodyFor(serviceKey, action) : null;

        res = await fetch("/api/dispatch", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            serviceKey,
            actionId: action.id,
            method: action.method,
            path: action.path,
            bodyType: action.bodyType,
            template: bodyToSend,
            params,
          }),
        });
      }

      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        data = text;
      }

      if (!res.ok)
        throw new Error(typeof data === "string" ? data : JSON.stringify(data));

      setLastResponse((p) => ({ ...p, [action.id]: { ok: true, data } }));
    } catch (e) {
      setLastResponse((p) => ({
        ...p,
        [action.id]: { ok: false, error: e.message },
      }));
    } finally {
      setSending((p) => ({ ...p, [action.id]: false }));
    }
  }

  return (
    <main
      style={{
        padding: 24,
        fontFamily: "system-ui",
        background: "#000",
        color: "#e5e7eb",
        minHeight: "100vh",
      }}
    >
      <h1>Microservices actions</h1>

      <div style={{ marginTop: 10, marginBottom: 16 }}>
        <label style={{ fontSize: 14, opacity: 0.9 }}>
          File for /upload:&nbsp;
          <input
            type="file"
            onChange={(e) => setSelectedFile(e.target.files?.[0] ?? null)}
            style={{ color: "#e5e7eb" }}
          />
        </label>
      </div>

      {SERVICES.map((service) => (
        <section key={service.key} style={{ marginTop: 20 }}>
          <h2>{service.key}</h2>

          {service.actions.length === 0 && (
            <div style={{ opacity: 0.7, fontSize: 14 }}>
              No actions defined.
            </div>
          )}

          <div
            style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 8 }}
          >
            {service.actions.map((action) => {
              const isSending = !!sending[action.id];
              const resp = lastResponse[action.id];

              const neededParams = getPathParams(action.path);
              const editableFields = action.editableFields || [];

              const currentBody = buildBodyFor(service.key, action);

              return (
                <div
                  key={action.id}
                  style={{ display: "grid", gap: 6, paddingBottom: 10 }}
                >
                  <button
                    onClick={() => sendAction(service.key, action)}
                    disabled={isSending}
                    onMouseEnter={(e) => {
                      if (!isSending)
                        Object.assign(e.currentTarget.style, buttonHoverStyle);
                    }}
                    onMouseLeave={(e) => {
                      Object.assign(e.currentTarget.style, buttonBaseStyle);
                      if (isSending)
                        Object.assign(
                          e.currentTarget.style,
                          buttonDisabledStyle,
                        );
                    }}
                    style={{
                      ...buttonBaseStyle,
                      ...(isSending ? buttonDisabledStyle : null),
                    }}
                  >
                    {isSending ? "Sending..." : action.label}
                  </button>

                  {/* URL param inputs */}
                  {neededParams.length > 0 && (
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      {neededParams.map((pname) => {
                        const current =
                          ((paramValues[service.key] || {})[action.id] || {})[
                            pname
                          ] ??
                          PARAMS_TEMPLATE[pname] ??
                          "";

                        return (
                          <label
                            key={pname}
                            style={{
                              fontSize: 12,
                              opacity: 0.9,
                              display: "grid",
                              gap: 4,
                            }}
                          >
                            <span>{pname}</span>
                            <input
                              value={current}
                              onChange={(e) =>
                                setParam(
                                  service.key,
                                  action.id,
                                  pname,
                                  e.target.value,
                                )
                              }
                              placeholder={PARAMS_TEMPLATE[pname] ?? pname}
                              style={{
                                background: "#050814",
                                color: "#e5e7eb",
                                border: "1px solid #334155",
                                borderRadius: 6,
                                padding: "4px 6px",
                                minWidth: 120,
                                fontSize: 12,
                              }}
                            />
                          </label>
                        );
                      })}
                    </div>
                  )}

                  {/* JSON body inputs (only for actions you asked) */}
                  {editableFields.length > 0 && (
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      {editableFields.map((fname) => {
                        const val = currentBody?.[fname] ?? "";
                        const isNumber =
                          typeof action.template?.[fname] === "number";

                        return (
                          <label
                            key={fname}
                            style={{
                              fontSize: 12,
                              opacity: 0.9,
                              display: "grid",
                              gap: 4,
                            }}
                          >
                            <span>{fname}</span>
                            <input
                              type={isNumber ? "number" : "text"}
                              value={val === null ? "" : val}
                              onChange={(e) =>
                                setBodyField(
                                  service.key,
                                  action,
                                  fname,
                                  isNumber
                                    ? Number(e.target.value)
                                    : e.target.value,
                                )
                              }
                              placeholder={String(
                                action.template?.[fname] ?? fname,
                              )}
                              style={{
                                background: "#050814",
                                color: "#e5e7eb",
                                border: "1px solid #334155",
                                borderRadius: 6,
                                padding: "4px 6px",
                                minWidth: 140,
                                fontSize: 12,
                              }}
                            />
                          </label>
                        );
                      })}
                    </div>
                  )}

                  {resp && (
                    <pre
                      style={{
                        margin: 0,
                        padding: 8,
                        background: "#0a0a0a",
                        color: "#eee",
                        fontSize: 12,
                        maxWidth: 520,
                        whiteSpace: "pre-wrap",
                        border: "1px solid #222",
                        borderRadius: 6,
                      }}
                    >
                      {resp.ok
                        ? JSON.stringify(resp.data, null, 2)
                        : `Error: ${resp.error}`}
                    </pre>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </main>
  );
}
