import React from "react";
import "./SectionState.css";
import { SkeletonLines } from "./Skeleton";

/**
 * Wraps the body of a content section: skeleton lines while it loads, a message with a retry
 * button when it fails, the children once ready. Pass children as a function so the section's
 * data is only read after it has loaded.
 */
export default function SectionState({ status, error, onRetry, label = "this section", lines = 4, children }) {
  if (status === "loading") {
    return (
      <div className="section-state" aria-busy="true" aria-label={`Loading ${label}`}>
        <SkeletonLines count={lines} />
      </div>
    );
  }
  if (status === "error") {
    return (
      <div className="section-state section-state-error" role="alert">
        <p>Couldn't load {label} right now{error ? ` (${error})` : ""}.</p>
        {onRetry && (
          <button type="button" className="link-button" onClick={onRetry}>
            Try again
          </button>
        )}
      </div>
    );
  }
  return typeof children === "function" ? children() : children;
}
