// CodeBlock.js
import React, { useEffect, useRef } from "react";
import Prism from "prismjs";

const CodeBlock = ({ className = "", children }) => {
  const codeRef = useRef(null);
  const language = className.replace("language-", "") || "text";

  useEffect(() => {
    if (codeRef && codeRef.current) {
      Prism.highlightElement(codeRef.current);
    }
  }, [children]);

  return (
    <pre className={className}>
      <code ref={codeRef} className={className}>
        {children}
      </code>
    </pre>
  );
};

export default CodeBlock;
