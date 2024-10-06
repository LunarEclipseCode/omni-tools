import React, { Component } from "react";
import { CopyIcon, ClearIcon, SaveIcon } from "../others/Icons";
import { CustomScrollbar } from "../others/CustomScrollbar";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkMath from "remark-math";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeKatex from "rehype-katex";
import rehypeReact from "rehype-react";
import "katex/dist/katex.min.css";
import Prism from "prismjs"; 
import "prismjs/themes/prism-tomorrow.css"; // Import Prism.js dark theme

// Import Prism.js language components
import "prismjs/components/prism-clike";
import "prismjs/components/prism-c"; // Requires clike
import "prismjs/components/prism-cpp"; // Requires c
import "prismjs/components/prism-csharp"; // Requires clike
import "prismjs/components/prism-python";
import "prismjs/components/prism-java"; // Requires clike
import "prismjs/components/prism-ruby";
import "prismjs/components/prism-go"; // Requires clike
import "prismjs/components/prism-swift";
import "prismjs/components/prism-kotlin"; // Requires clike
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-sql";
import "prismjs/components/prism-r";
import "prismjs/components/prism-rust";
import "prismjs/components/prism-perl";
import "prismjs/components/prism-haskell";
import "prismjs/components/prism-scala"; 
import "prismjs/components/prism-lua";
import "prismjs/components/prism-julia";
import "prismjs/components/prism-dart";
import "prismjs/components/prism-fortran";
import "prismjs/components/prism-pascal";
import "prismjs/components/prism-matlab";
import "prismjs/components/prism-groovy";
import "prismjs/components/prism-cobol";
import "prismjs/components/prism-objectivec";
import "prismjs/components/prism-elixir";
import "prismjs/components/prism-fsharp";
import "prismjs/components/prism-lisp";
import "prismjs/components/prism-prolog";
import "prismjs/components/prism-powershell";
import "prismjs/components/prism-tcl";
import "prismjs/components/prism-abap";
import "prismjs/components/prism-basic";
import "prismjs/components/prism-vbnet"; 
import "prismjs/components/prism-markup-templating"
import "prismjs/components/prism-php"; 
import "prismjs/components/prism-ocaml";
import "prismjs/components/prism-scheme";
import "prismjs/components/prism-erlang";
import "prismjs/components/prism-smalltalk";
import "prismjs/components/prism-ada";
import "prismjs/components/prism-vhdl";
import "prismjs/components/prism-verilog";
import "prismjs/components/prism-brainfuck";
import "prismjs/components/prism-nim";
import "prismjs/components/prism-crystal"; // Requires ruby
import "prismjs/components/prism-d"; // Requires clike
import "prismjs/components/prism-racket"; // Requires scheme
import "prismjs/components/prism-zig";
import "prismjs/components/prism-sml";
import "prismjs/components/prism-regex"
import "prismjs/components/prism-haxe"; // Requires clike, optional regex
import "prismjs/components/prism-eiffel";
import "prismjs/components/prism-clojure";
import "prismjs/components/prism-cobol";
import "prismjs/components/prism-actionscript";
import "prismjs/components/prism-makefile";
import "prismjs/components/prism-opencl";
import "prismjs/components/prism-glsl"; // Requires c
import "prismjs/components/prism-vala"; // Requires clike, optional regex
import "prismjs/components/prism-hcl";
import "prismjs/components/prism-wolfram";
import "prismjs/components/prism-yaml";
import "prismjs/components/prism-toml";
import "prismjs/components/prism-abnf";
import "prismjs/components/prism-agda";
import "prismjs/components/prism-al";
import "prismjs/components/prism-apex"; // Requires clike, sql
import "prismjs/components/prism-apl";
import "prismjs/components/prism-applescript";
import "prismjs/components/prism-aql";
import "prismjs/components/prism-arduino"; // Requires cpp
import "prismjs/components/prism-arff";
import "prismjs/components/prism-aspnet"; // Requires markup, csharp
import "prismjs/components/prism-autoit";
import "prismjs/components/prism-avisynth";
import "prismjs/components/prism-avro-idl";
import "prismjs/components/prism-bicep";
import "prismjs/components/prism-birb"; // Requires clike
import "prismjs/components/prism-bison"; // Requires c
import "prismjs/components/prism-bnf";
import "prismjs/components/prism-brightscript";
import "prismjs/components/prism-bro";
import "prismjs/components/prism-bsl";
import "prismjs/components/prism-chaiscript"; // Requires clike, cpp
import "prismjs/components/prism-cfscript"; // Requires clike
import "prismjs/components/prism-cil";
import "prismjs/components/prism-cmake";
import "prismjs/components/prism-coffeescript"; // Requires javascript
import "prismjs/components/prism-concurnas";
import "prismjs/components/prism-coq";
import "prismjs/components/prism-dhall";
import "prismjs/components/prism-ebnf";
import "prismjs/components/prism-elm";
import "prismjs/components/prism-ftl"; // Requires markup-templating
import "prismjs/components/prism-gap";
import "prismjs/components/prism-gcode";
import "prismjs/components/prism-gdscript";
import "prismjs/components/prism-gherkin";
import "prismjs/components/prism-gml"; // Requires clike
import "prismjs/components/prism-haml"; // Requires ruby, optional css, coffeescript
import "prismjs/components/prism-handlebars"; // Requires markup-templating
import "prismjs/components/prism-idris"; // Requires haskell
import "prismjs/components/prism-io";
import "prismjs/components/prism-j";
import "prismjs/components/prism-jexl";
import "prismjs/components/prism-jolie"; // Requires clike
import "prismjs/components/prism-jq";
import debounce from "lodash.debounce";
import Mermaid from "./Mermaid";
import CodeBlock from "./CodeBlock";

class MarkdownRenderer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      input: "",
      outputReact: null,
      error: null,
    };

    // Bind the debounced function in the constructor
    this.debouncedHandleInputChange = debounce(this.processMarkdown, 100);
  }

  handleInputChange = (e) => {
    const input = e.target.value;

    // Update input state immediately to prevent cursor jump
    this.setState({ input });
    this.debouncedHandleInputChange(input);
  };

  processMarkdown = async (input) => {
    try {
      // Parse Markdown and convert it to React elements
      const processedResult = await unified()
        .use(remarkParse)
        .use(remarkMath)
        .use(remarkGfm)
        .use(remarkRehype)
        .use(rehypeKatex)
        .use(rehypeReact, {
          createElement: React.createElement,
          components: {
            // Handle <pre> elements for code blocks
            pre: (props) => {
              const child = props.children[0];
              if (child && child.props && child.props.className) {
                const className = child.props.className || "";
                const language = className.replace("language-", "");

                if (language === "mermaid") {
                  // Render Mermaid diagrams using the custom component
                  return <Mermaid chart={child.props.children.join("")} />;
                } else {
                  // Render other code blocks with syntax highlighting
                  return <CodeBlock className={className}>{child.props.children}</CodeBlock>;
                }
              }
              // Default rendering for pre elements without className
              return <pre {...props} />;
            },
          },
        })
        .process(input);

      this.setState({
        outputReact: processedResult.result,
        error: null,
      });
    } catch (error) {
      this.setState({ error: "Error processing markdown." });
    }
  };

  clearInput = () => {
    this.setState({ input: "", outputReact: null, error: null });
  };

  copyToClipboard = (html) => {
    navigator.clipboard.writeText(html);
  };

  saveOutputAsHTML = () => {
    const { outputReact } = this.state;
    const htmlString = ReactDOMServer.renderToStaticMarkup(outputReact);
    const element = document.createElement("a");
    const file = new Blob([htmlString], { type: "text/html" });
    element.href = URL.createObjectURL(file);
    element.download = "markdown_output.html";
    document.body.appendChild(element);
    element.click();
  };

  render() {
    const { input, outputReact } = this.state;

    return (
      <main className="overflow-y-auto p-4 md:p-6 lg:p-8 xl:p-10 md:pt-4 lg:pt-5 xl:pt-5 h-full">
        <CustomScrollbar />
        <section className="flex flex-col gap-6 h-full">
          <h1 className="text-3xl text-white font-semibold">Markdown Renderer</h1>
          <section className="flex flex-col lg:flex-row gap-4 h-full equal-width">
            <div className="flex-1 flex flex-col h-full">
              <div className="flex justify-between items-center">
                <h2 className="text-lg text-gray-300">Input</h2>
                <div className="flex items-center">
                  <button className="text-gray-400 hover:text-white transition-colors p-2" onClick={this.clearInput}>
                    <ClearIcon />
                  </button>
                </div>
              </div>
              <textarea
                className="flex-1 h-full border-2 rounded-lg border-gray-600 bg-gray-800 px-4 py-2 text-gray-300 outline-none placeholder-gray-500 hover:bg-[#2b3544] focus:border-blue-400 focus:bg-[#2b3544] font-mono custom-scrollbar resize-none lg:max-h-[76vh] max-h-[36vh] min-h-[36vh]"
                placeholder="Enter markdown text here..."
                value={input}
                onChange={this.handleInputChange}
              />
            </div>
            <div className="flex-1 flex flex-col h-full">
              <div className="flex justify-between items-center">
                <h2 className="text-lg text-gray-300 p-1">Output</h2>
              </div>
              <div className="flex-1 border-2 rounded-lg border-gray-600 bg-gray-800 p-4 text-gray-300 overflow-auto custom-scrollbar markdown-output lg:max-h-[76vh] max-h-[36vh] min-h-[36vh]">{outputReact}</div>
            </div>
          </section>
        </section>
        <style>
          {`
            html, body, #root {
              overflow: hidden;
            }

            .flex-1 {
              flex: 1 1 0%;
            }

            .equal-width > div {
              flex: 1;
              min-width: 0;
            }

            .markdown-output h1 {
              font-size: 2em;
              font-weight: bold;
              margin-bottom: 0.5em;
            }
            .markdown-output h2 {
              font-size: 1.75em;
              font-weight: bold;
              margin-bottom: 0.5em;
            }
            .markdown-output h3 {
              font-size: 1.5em;
              font-weight: bold;
              margin-bottom: 0.5em;
            }
            .markdown-output p {
              margin-bottom: 1em;
            }
            .markdown-output ul {
              list-style-type: disc;
              margin-left: 1.5em;
            }
            .markdown-output ol {
              list-style-type: decimal;
              margin-left: 1.5em;
            }
            .markdown-output code {
              background-color: #2d2d2d;
              padding: 0.2em 0.4em;
              border-radius: 4px;
            }
            .markdown-output blockquote {
              border-left: 4px solid #6b7280;
              padding-left: 1em;
              color: #9ca3af;
            }
            .markdown-output strong {
              font-weight: bold;
            }
            .markdown-output em {
              font-style: italic;
            }
            .markdown-output pre {
              background: transparent;
              padding: 1em;
              border-radius: 4px;
              overflow: auto;
            }
            .markdown-output pre code {
              background: none;
              padding: 0;
            }
            .markdown-output a {
              color: #3b82f6;
              text-decoration: underline;
            }
            .markdown-output table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 1em;
            }
            .markdown-output th,
            .markdown-output td {
              border: 1px solid #374151;
              padding: 0.5em;
            }
            .markdown-output th {
              background-color: #1f2937;
            }

            /* Remove background from Mermaid diagrams */
            .markdown-output .mermaid {
              background: transparent;
              padding: 0;
              border: none;
            }

            /* Style for regular code blocks with spacing */
            .markdown-output pre:not(.mermaid) {
              background-color: #111827;
              padding: 1em;
              border-radius: 4px;
              margin-bottom: 1.5em; /* Adds spacing between code blocks */
              overflow-x: auto; /* Enables horizontal scrolling */
              overflow-y: hidden;
              scrollbar-width: thin; /* For Firefox */
              scrollbar-color: #3b82f6 #2b3544;
            }

    
            .markdown-output pre::-webkit-scrollbar {
              height: 8px; /* Makes scrollbar thinner */
            }

            .markdown-output pre::-webkit-scrollbar-track {
              background: #2b3544; /* Background of the scrollbar track */
            }

            .markdown-output pre::-webkit-scrollbar-thumb {
              background-color: #3b82f6; /* Scrollbar thumb (handle) color */
              border-radius: 4px;
            }
          `}
        </style>
      </main>
    );
  }
}

export default MarkdownRenderer;
