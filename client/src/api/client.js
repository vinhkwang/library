const BASE_URL = "/api/v1";

let csrfToken = null;

export function setCsrfToken(token) {
  csrfToken = token;
}

export default async function request(path, { method = "GET", body } = {}) {
  const isFormData = body instanceof FormData;
  const headers = { Accept: "application/json" };
  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }
  if (method !== "GET") {
    headers["X-CSRF-Token"] = csrfToken;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    credentials: "include",
    body: isFormData ? body : body ? JSON.stringify(body) : undefined,
  });

  const data = res.status === 204 ? null : await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(data?.error || "Something went wrong");
  }

  return data;
}
