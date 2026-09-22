import React, { createContext, useContext } from "react";
import useApi from "../api/useApi";

/**
 * Site content (profile, projects, experience, skills) comes from GET /api/content, the same
 * way the highlights page pulls from /api/highlights. It is fetched once per page load and
 * shared with every section through this context.
 */
const ContentContext = createContext(null);

export function ContentProvider({ children }) {
  const content = useApi("/api/content");
  return <ContentContext.Provider value={content}>{children}</ContentContext.Provider>;
}

export function useContent() {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error("useContent must be used inside <ContentProvider>");
  return ctx;
}

/** One section of the content: { status, error, reload, data }; `data` is null until ready. */
export function useSection(name) {
  const { status, error, reload, data } = useContent();
  return { status, error, reload, data: data && data[name] ? data[name] : null };
}
