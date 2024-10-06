import React, { Component } from "react";
import DOMPurify from "dompurify";
import { CopyIcon, ClearIcon, SaveIcon } from "../others/Icons";
import { CustomScrollbar } from "../others/CustomScrollbar";
import * as prettier from "prettier/standalone";
import parserHtml from "prettier/plugins/html";
import SVGO from "../../../public/svgo";
import parse from "html-react-parser";

class SvgOptimizer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      svgInput: "",
      svgOutput: "",
      optimizationError: null,
      isLoading: false,
      removeXmlns: false,
      convertShapesToPaths: true,
      convertStylesToAttributes: true,
      useViewBox: false,
      showInputSvg: false,
      showOutputSvg: false,
    };
  }

  toggleShowInputSvg = () => {
    this.setState((prevState) => ({ showInputSvg: !prevState.showInputSvg }));
  };

  toggleShowOutputSvg = () => {
    this.setState((prevState) => ({ showOutputSvg: !prevState.showOutputSvg }));
  };

  isValidSvg = (svgString) => {
    try {
      const parser = new DOMParser();
      const parsedDoc = parser.parseFromString(svgString, "image/svg+xml");
      const svgElement = parsedDoc.querySelector("svg");

      if (svgElement) {
        const parserError = parsedDoc.getElementsByTagName("parsererror");
        return parserError.length === 0; // Ensure there's no parsing error
      }
    } catch (error) {
      console.error("SVG parsing error:", error);
    }

    return false;
  };

  // Remove duplicate elements in the SVG
  removeDuplicateElements = (svgString) => {
    const parser = new DOMParser();
    const xmlSerializer = new XMLSerializer();
    const svgDocument = parser.parseFromString(svgString, "image/svg+xml");
    const allElements = svgDocument.querySelectorAll("*");
    const seenElements = new Set();
    const duplicates = [];

    const getElementSignature = (element) => {
      const tagName = element.tagName;
      const attributes = Array.from(element.attributes)
        .map((attr) => `${attr.name}="${attr.value}"`)
        .sort()
        .join(" ");
      return `${tagName} ${attributes}`;
    };

    allElements.forEach((element) => {
      const signature = getElementSignature(element);
      if (seenElements.has(signature)) {
        duplicates.push(element);
      } else {
        seenElements.add(signature);
      }
    });

    duplicates.forEach((duplicate) => duplicate.remove());
    return xmlSerializer.serializeToString(svgDocument);
  };

  optimizeSvg = async (svgInput) => {
    if (!svgInput.trim()) {
      this.setState({ optimizationError: "Please enter valid SVG data." });
      return;
    }

    if (!this.isValidSvg(svgInput)) {
      this.setState({ optimizationError: "Invalid SVG input. Please check the SVG structure." });
      return;
    }

    const { removeXmlns, convertShapesToPaths, convertStylesToAttributes, useViewBox } = this.state;

    this.setState({ isLoading: true, optimizationError: null });

    try {
      // Build the plugins array based on the toggle options
      const plugins = [
        {
          name: "preset-default",
          params: {
            overrides: {
              convertShapeToPath: convertShapesToPaths,
            },
          },
        },
        removeXmlns && { name: "removeXMLNS" },
        convertStylesToAttributes && { name: "convertStyleToAttrs", params: { onlyMatchedOnce: false } }, // Add the convertStyleToAttrs plugin
        useViewBox ? { name: "removeDimensions" } : { name: "addAttributesToSVGElement", params: { attributes: [{ width: "100", height: "100" }] } },
      ].filter(Boolean);

      const result = await SVGO.optimize(svgInput, { plugins });

      let optimizedSvg = this.removeDuplicateElements(result.data);
      optimizedSvg = optimizedSvg.replace(/\{\s*["'][\s]*["']\s*\}/g, "");

      optimizedSvg = await prettier.format(optimizedSvg, {
        parser: "html",
        plugins: [parserHtml],
        tabWidth: 2,
        useTabs: false,
        singleQuote: false,
        bracketSpacing: true,
        printWidth: 200,
      });

      this.setState({ svgOutput: optimizedSvg, isLoading: false });
    } catch (error) {
      console.error("SVG optimization error:", error);
      this.setState({ optimizationError: "Error optimizing the SVG.", isLoading: false });
    }
  };

  handleSvgInputChange = (e) => {
    const svgInput = e.target.value;
    this.setState({ svgInput });

    this.optimizeSvg(svgInput);
  };

  toggleOption = (option) => {
    // Update the option and re-optimize after state change
    this.setState(
      (prevState) => ({ [option]: !prevState[option] }),
      () => {
        const { svgInput } = this.state;
        if (svgInput) {
          console.log(`Toggled ${option}, re-optimizing SVG...`);
          this.optimizeSvg(svgInput); // Re-optimize the SVG after toggling the option
        }
      }
    );
  };

  clearSvgInput = () => {
    this.setState({
      svgInput: "",
      svgOutput: "",
      optimizationError: null,
      showInputSvg: false, // Exit view after clearing SVG
      showOutputSvg: false,
    });
  };

  copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  saveOutputAsSvg = () => {
    const { svgOutput } = this.state;
    const element = document.createElement("a");
    const file = new Blob([svgOutput], { type: "image/svg+xml" });
    element.href = URL.createObjectURL(file);
    element.download = "optimized.svg";
    document.body.appendChild(element);
    element.click();
  };

  render() {
    const { svgInput, svgOutput, optimizationError, isLoading, removeXmlns, convertShapesToPaths, convertStylesToAttributes, useViewBox, showInputSvg, showOutputSvg } = this.state;

    const EyeIcon = ({ isOpen }) =>
      isOpen ? (
        <svg width="20" height="20" viewBox="0 0 1024 1024">
          <path
            d="M876.8 156.8c0-9.6-3.2-16-9.6-22.4-6.4-6.4-12.8-9.6-22.4-9.6-9.6 0-16 3.2-22.4 9.6L736 220.8c-64-32-137.6-51.2-224-60.8-160 16-288 73.6-377.6 176C44.8 438.4 0 496 0 512s48 73.6 134.4 176c22.4 25.6 44.8 48 73.6 67.2l-86.4 89.6c-6.4 6.4-9.6 12.8-9.6 22.4 0 9.6 3.2 16 9.6 22.4 6.4 6.4 12.8 9.6 22.4 9.6 9.6 0 16-3.2 22.4-9.6l704-710.4c3.2-6.4 6.4-12.8 6.4-22.4Zm-646.4 528c-76.8-70.4-128-128-153.6-172.8 28.8-48 80-105.6 153.6-172.8C304 272 400 230.4 512 224c64 3.2 124.8 19.2 176 44.8l-54.4 54.4C598.4 300.8 560 288 512 288c-64 0-115.2 22.4-160 64s-64 96-64 160c0 48 12.8 89.6 35.2 124.8L256 707.2c-9.6-6.4-19.2-16-25.6-22.4Zm140.8-96c-12.8-22.4-19.2-48-19.2-76.8 0-44.8 16-83.2 48-112 32-28.8 67.2-48 112-48 28.8 0 54.4 6.4 73.6 19.2L371.2 588.8ZM889.599 336c-12.8-16-28.8-28.8-41.6-41.6l-48 48c73.6 67.2 124.8 124.8 150.4 169.6-28.8 48-80 105.6-153.6 172.8-73.6 67.2-172.8 108.8-284.8 115.2-51.2-3.2-99.2-12.8-140.8-28.8l-48 48c57.6 22.4 118.4 38.4 188.8 44.8 160-16 288-73.6 377.6-176C979.199 585.6 1024 528 1024 512s-48.001-73.6-134.401-176Z"
            fill="currentColor"
          />
          <path
            d="M511.998 672c-12.8 0-25.6-3.2-38.4-6.4l-51.2 51.2c28.8 12.8 57.6 19.2 89.6 19.2 64 0 115.2-22.4 160-64 41.6-41.6 64-96 64-160 0-32-6.4-64-19.2-89.6l-51.2 51.2c3.2 12.8 6.4 25.6 6.4 38.4 0 44.8-16 83.2-48 112-32 28.8-67.2 48-112 48Z"
            fill="currentColor"
          />
        </svg>
      ) : (
        <svg width="20" height="20" viewBox="0 0 1024 1024">
          <path
            fill="currentColor"
            d="M512 160c320 0 512 352 512 352S832 864 512 864 0 512 0 512s192-352 512-352zm0 64c-225.28 0-384.128 208.064-436.8 288 52.608 79.872 211.456 288 436.8 288 225.28 0 384.128-208.064 436.8-288-52.608-79.872-211.456-288-436.8-288zm0 64a224 224 0 1 1 0 448 224 224 0 0 1 0-448zm0 64a160.192 160.192 0 0 0-160 160c0 88.192 71.744 160 160 160s160-71.808 160-160-71.744-160-160-160z"
          />
        </svg>
      );

    const renderSvg = (svgContent) => {
      const sanitizedSvg = DOMPurify.sanitize(svgContent, { USE_PROFILES: { svg: true } });

      if (this.isValidSvg(sanitizedSvg)) {
        try {
          const reactSvgElement = parse(sanitizedSvg);
          return <div className="flex-1 h-full border-2 rounded-lg border-gray-600 bg-gray-800 p-4 overflow-auto custom-scrollsvg">{reactSvgElement}</div>;
        } catch (error) {
          console.error("Error rendering SVG:", error);
          return <div className="flex-1 h-full border-2 rounded-lg border-red-600 bg-gray-800 p-4 text-red-500">Error rendering SVG</div>;
        }
      } else {
        return <div className="flex-1 h-full border-2 rounded-lg border-red-600 bg-gray-800 p-4 text-red-500">Invalid SVG Content</div>;
      }
    };

    return (
      <main className="overflow-y-auto p-4 md:p-6 lg:p-8 xl:p-10 md:pt-4 lg:pt-5 xl:pt-5 h-full">
        <style>{`
          .custom-scrollsvg::-webkit-scrollbar {
            height: 8px;
            width: 8px;
          }
          .custom-scrollsvg::-webkit-scrollbar-thumb {
            background-color: #4a5568;
            border-radius: 4px;
          }
          .custom-scrollsvg::-webkit-scrollbar-thumb:hover {
            background-color: #2d3748;
          }
          .custom-scrollsvg::-webkit-scrollbar-track {
            background-color: #1a202c;
          }
        `}</style>
        <CustomScrollbar />
        <section className="flex flex-col gap-6 h-full">
          <h1 className="text-3xl text-white font-semibold">SVG Optimizer</h1>
          <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex h-12 items-center gap-6 rounded-lg bg-gray-800 px-4">
              <span className="text-white">Remove xmlns</span>
              <div className="flex flex-1 justify-end">
                <div className="flex flex-row-reverse items-center">
                  <button
                    type="button"
                    role="switch"
                    aria-checked={removeXmlns}
                    onClick={() => this.toggleOption("removeXmlns")}
                    className={`group inline-flex h-6 w-12 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 ease-in-out ${removeXmlns ? "bg-blue-600" : "bg-gray-600"}`}
                  >
                    <span className={`pointer-events-none block h-4 w-4 rounded-full bg-white shadow-lg transform transition-transform duration-200 ease-in-out ${removeXmlns ? "translate-x-7" : "translate-x-1"}`}></span>
                  </button>
                </div>
              </div>
            </div>

            <div className="flex h-12 items-center gap-6 rounded-lg bg-gray-800 px-4">
              <span className="text-white">Convert Shapes to Paths</span>
              <div className="flex flex-1 justify-end">
                <div className="flex flex-row-reverse items-center">
                  <button
                    type="button"
                    role="switch"
                    aria-checked={convertShapesToPaths}
                    onClick={() => this.toggleOption("convertShapesToPaths")}
                    className={`group inline-flex h-6 w-12 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 ease-in-out ${convertShapesToPaths ? "bg-blue-600" : "bg-gray-600"}`}
                  >
                    <span className={`pointer-events-none block h-4 w-4 rounded-full bg-white shadow-lg transform transition-transform duration-200 ease-in-out ${convertShapesToPaths ? "translate-x-7" : "translate-x-1"}`}></span>
                  </button>
                </div>
              </div>
            </div>

            <div className="flex h-12 items-center gap-6 rounded-lg bg-gray-800 px-4">
              <span className="text-white">Convert Styles to Attributes</span>
              <div className="flex flex-1 justify-end">
                <div className="flex flex-row-reverse items-center">
                  <button
                    type="button"
                    role="switch"
                    aria-checked={convertStylesToAttributes}
                    onClick={() => this.toggleOption("convertStylesToAttributes")}
                    className={`group inline-flex h-6 w-12 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 ease-in-out ${convertStylesToAttributes ? "bg-blue-600" : "bg-gray-600"}`}
                  >
                    <span className={`pointer-events-none block h-4 w-4 rounded-full bg-white shadow-lg transform transition-transform duration-200 ease-in-out ${convertStylesToAttributes ? "translate-x-7" : "translate-x-1"}`}></span>
                  </button>
                </div>
              </div>
            </div>

            <div className="flex h-12 items-center gap-6 rounded-lg bg-gray-800 px-4">
              <span className="text-white">Replace width/height with viewbox</span>
              <div className="flex flex-1 justify-end">
                <div className="flex flex-row-reverse items-center">
                  <button
                    type="button"
                    role="switch"
                    aria-checked={useViewBox}
                    onClick={() => this.toggleOption("useViewBox")}
                    className={`group inline-flex h-6 w-12 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 ease-in-out ${useViewBox ? "bg-blue-600" : "bg-gray-600"}`}
                  >
                    <span className={`pointer-events-none block h-4 w-4 rounded-full bg-white shadow-lg transform transition-transform duration-200 ease-in-out ${useViewBox ? "translate-x-7" : "translate-x-1"}`}></span>
                  </button>
                </div>
              </div>
            </div>
          </section>

          <section className="flex flex-col lg:flex-row gap-4 h-full">
            <div className="flex-1 flex flex-col h-full min-h-[26vh]">
              <div className="flex justify-between items-center">
                <h2 className="text-lg text-gray-300">Input SVG</h2>
                <div className="flex items-center">
                  <button className="text-gray-400 hover:text-white transition-colors p-2" onClick={this.toggleShowInputSvg}>
                    <EyeIcon isOpen={showInputSvg} />
                  </button>
                  <button className="text-gray-400 hover:text-white transition-colors p-2" onClick={this.clearSvgInput}>
                    <ClearIcon />
                  </button>
                </div>
              </div>
              {/* Conditional Rendering of Textarea or SVG */}
              {showInputSvg ? (
                renderSvg(svgInput)
              ) : (
                <textarea
                  className="flex-1 h-full border-2 rounded-lg border-gray-600 bg-gray-800 px-4 py-2 text-gray-300 outline-none placeholder-gray-500 hover:bg-[#2b3544] focus:border-blue-400 focus:bg-[#2b3544] font-mono custom-scrollbar"
                  placeholder="Enter SVG code to optimize"
                  value={svgInput}
                  onChange={this.handleSvgInputChange}
                />
              )}
            </div>

            <div className="flex-1 flex flex-col h-full min-h-[26vh]">
              <div className="flex justify-between items-center">
                <h2 className="text-lg text-gray-300">Optimized SVG</h2>
                <div className="flex items-center">
                  <button className="text-gray-400 hover:text-white transition-colors p-2" onClick={this.toggleShowOutputSvg}>
                    <EyeIcon isOpen={showOutputSvg} />
                  </button>
                  <button className="text-gray-400 hover:text-white transition-colors p-2" onClick={this.saveOutputAsSvg}>
                    <SaveIcon />
                  </button>
                  <button className="text-gray-400 hover:text-white transition-colors p-2" onClick={() => this.copyToClipboard(svgOutput)}>
                    <CopyIcon />
                  </button>
                </div>
              </div>
              {/* Conditional Rendering of Textarea or SVG */}
              {showOutputSvg ? (
                renderSvg(svgOutput)
              ) : (
                <textarea
                  className={`flex-1 h-full border-2 rounded-lg ${
                    optimizationError ? "border-red-600" : "border-gray-600"
                  } bg-gray-800 px-4 py-2 text-gray-300 outline-none placeholder-gray-500 hover:bg-[#2b3544] focus:border-blue-400 focus:bg-[#2b3544] font-mono custom-scrollbar`}
                  placeholder={optimizationError || "Optimized output"}
                  value={optimizationError || svgOutput}
                  readOnly
                />
              )}
            </div>
          </section>
          {isLoading && <p className="text-white">Optimizing...</p>}
        </section>
      </main>
    );
  }
}

export default SvgOptimizer;
