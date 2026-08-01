const BASE_URL = "/api/v1";

let csrfToken = null;

export function setCsrfToken(token) {
  csrfToken = token;
}

export default async function request(path, { method = "GET", body } = {}) {
  const headers = { "Content-Type": "application/json", Accept: "application/json" };
  if (method !== "GET") {
    headers["X-CSRF-Token"] = csrfToken;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    credentials: "include",
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = res.status === 204 ? null : await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(data?.error || "Something went wrong");
  }

  return data;
}
