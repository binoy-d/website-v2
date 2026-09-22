import React from "react";
import { Link } from "react-router-dom";

/** Paths on this site ("/highlights") use the router; anything else opens in a new tab. */
export const isInternal = (href) => typeof href === "string" && href.startsWith("/") && !href.startsWith("//");

export default function SmartLink({ href, children, ...rest }) {
  if (isInternal(href)) {
    return (
      <Link to={href} {...rest}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" {...rest}>
      {children}
    </a>
  );
}
