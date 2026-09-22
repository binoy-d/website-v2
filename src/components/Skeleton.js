import React from "react";
import "./Skeleton.css";

/** Grey shimmering placeholder lines shown while content loads; the last line is shorter. */
export function SkeletonLines({ count = 3 }) {
  return (
    <div className="skeleton-lines" aria-hidden="true">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className={`skeleton-line${i === count - 1 ? " short" : ""}`} />
      ))}
    </div>
  );
}

/** A block-shaped placeholder (e.g. where a cover or a footer would be). */
export function SkeletonBlock({ className = "" }) {
  return <div className={`skeleton-block ${className}`.trim()} aria-hidden="true" />;
}
