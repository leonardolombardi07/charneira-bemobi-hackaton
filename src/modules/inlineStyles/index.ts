import React from "react";

function containText({ lines }: { lines: number }): React.CSSProperties {
  return {
    overflow: "hidden",
    textOverflow: "ellipsis",
    display: "-webkit-box",
    WebkitLineClamp: lines,
    WebkitBoxOrient: "vertical",
  };
}

export { containText };
