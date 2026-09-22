import { useCallback, useEffect, useState } from "react";
import { fetchJson } from "./client";

/**
 * Loads a JSON endpoint when the component mounts (and again when `path` changes or
 * `reload()` is called). Returns { status, data, error, reload } with status one of
 * "loading" | "ready" | "error". In-flight requests are aborted on unmount.
 */
export default function useApi(path) {
  const [state, setState] = useState({ status: "loading", data: null, error: "" });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setState((prev) => ({ ...prev, status: "loading", error: "" }));
    fetchJson(path, { signal: controller.signal })
      .then((data) => setState({ status: "ready", data, error: "" }))
      .catch((err) => {
        if (err.name === "AbortError") return;
        setState({ status: "error", data: null, error: err.message || "Request failed" });
      });
    return () => controller.abort();
  }, [path, attempt]);

  const reload = useCallback(() => setAttempt((n) => n + 1), []);
  return { ...state, reload };
}
