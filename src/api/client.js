export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

/**
 * GET a JSON endpoint. Rejects with an ApiError carrying the server's `error` message
 * (or a generic one with the status) when the response is not 2xx.
 */
export async function fetchJson(path, { signal } = {}) {
  const response = await fetch(path, { signal, headers: { accept: "application/json" } });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new ApiError((data && data.error) || `Request failed (${response.status})`, response.status);
  }
  return data;
}
