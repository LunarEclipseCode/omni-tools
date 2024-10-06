// Mermaid.js
import React, { useEffect, useRef } from "react";
import mermaid from "mermaid";

const Mermaid = ({ chart }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: true,
      theme: "dark",
      themeVariables: {
        primaryTextColor: "#ff0000",
        secondaryTextColor: "#ffffff",
        primaryBorderColor: "#ffffff",
        secondaryBorderColor: "#ffffff",
        secondaryColor: "#1f2937",
        tertiaryColor: "#6b7280",
        nodeTextColor: "#ffffff",
        edgeLabelBackground: "#475569",
        mainBkg: "transparent",
        noteBkgColor: "#ffffaa",
        noteTextColor: "#000000",
      },
    });

    if (containerRef.current) {
      mermaid.contentLoaded();
    }
  }, [chart]);

  return (
    <div ref={containerRef} className="mermaid" style={{ overflow: "auto" }}>
      {chart}
    </div>
  );
};

export default Mermaid;
