import { fetchJson } from "./client";

const jsonResponse = (status, body) => ({ ok: status < 400, status, json: async () => body });
const brokenResponse = (status) => ({ ok: false, status, json: async () => { throw new Error("no json"); } });

afterEach(() => {
  delete global.fetch;
});

test("fetchJson resolves with the parsed body", async () => {
  global.fetch = jest.fn().mockResolvedValue(jsonResponse(200, { items: [1, 2] }));
  await expect(fetchJson("/api/x")).resolves.toEqual({ items: [1, 2] });
  expect(global.fetch).toHaveBeenCalledWith("/api/x", expect.objectContaining({ headers: { accept: "application/json" } }));
});

test("fetchJson rejects with the server's error message and status", async () => {
  global.fetch = jest.fn().mockResolvedValue(jsonResponse(503, { error: "Highlights are not configured yet." }));
  await expect(fetchJson("/api/x")).rejects.toMatchObject({
    name: "ApiError",
    status: 503,
    message: "Highlights are not configured yet.",
  });
});

test("fetchJson falls back to a generic message when the body is not json", async () => {
  global.fetch = jest.fn().mockResolvedValue(brokenResponse(502));
  await expect(fetchJson("/api/x")).rejects.toMatchObject({ status: 502, message: "Request failed (502)" });
});
