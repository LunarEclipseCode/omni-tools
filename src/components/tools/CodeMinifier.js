import React, { Component } from "react";
import { CopyIcon, ClearIcon, SaveIcon } from "../others/Icons";
import { CustomScrollbar } from "../others/CustomScrollbar";
import * as Terser from "terser";
import { minify } from "csso";
import { minify as htmlMinify } from "../html-minifier-terser/htmlminifier";
import { minify as minifyXML } from "./minify-xml";

class CodeMinifier extends Component {
  constructor(props) {
    super(props);
    this.state = {
      codeInput: "",
      minifiedCode: "",
      codeError: null,
      selectedLanguage: "javascript",
    };
  }

  handleLanguageChange = (e) => {
    this.setState({
      selectedLanguage: e.target.value,
      codeInput: "",
      minifiedCode: "",
      codeError: null,
    });
  };

  handleCodeInputChange = async (e) => {
    const codeInput = e.target.value;
    this.setState({ codeInput });

    if (!codeInput.trim()) {
      this.setState({ minifiedCode: "", codeError: null });
      return;
    }

    try {
      const { selectedLanguage } = this.state;
      let minifiedCode = "";

      switch (selectedLanguage) {
        case "javascript":
          const terserResult = await Terser.minify(codeInput);
          if (terserResult.error) {
            throw terserResult.error;
          }
          minifiedCode = terserResult.code;
          break;

        case "css":
          const cssoOptions = {
            compress: {
              restructure: true,
              forceMediaMerge: true,
            },
            comments: false,
          };
          const cssoResult = minify(codeInput, cssoOptions);
          minifiedCode = cssoResult.css;
          break;

        case "html":
          // Use custom HTML minifier with csso
          const htmlOptions = {
            caseSensitive: false,
            collapseBooleanAttributes: true,
            collapseInlineTagWhitespace: false,
            collapseWhitespace: true,
            conservativeCollapse: false,
            continueOnParseError: true,
            decodeEntities: true,
            html5: true,
            includeAutoGeneratedTags: false,
            keepClosingSlash: false,
            maxLineLength: 0,
            minifyCSS: true,
            minifyJS: true,
            preserveLineBreaks: false,
            preventAttributesEscaping: false,
            processConditionalComments: true,
            processScripts: ["text/html"],
            removeAttributeQuotes: true,
            removeComments: true,
            removeEmptyAttributes: true,
            removeEmptyElements: true,
            removeOptionalTags: true,
            removeRedundantAttributes: true,
            removeScriptTypeAttributes: true,
            removeStyleLinkTypeAttributes: true,
            removeTagWhitespace: true,
            sortAttributes: true,
            sortClassName: true,
            trimCustomFragments: true,
            useShortDoctype: true,
          };
          minifiedCode = await htmlMinify(codeInput, htmlOptions);
          break;
        case "json":
          minifiedCode = JSON.stringify(JSON.parse(codeInput));
          break;

        case "xml":
          minifiedCode = minifyXML(codeInput);
          break;

        default:
          throw new Error("Unsupported language selected for minification.");
      }

      this.setState({ minifiedCode, codeError: null });
    } catch (error) {
      this.setState({ minifiedCode: `Error: ${error.message}`, codeError: error.message });
    }
  };

  clearCodeInput = () => {
    this.setState({
      codeInput: "",
      minifiedCode: "",
      codeError: null,
    });
  };

  getFileExtension = () => {
    const { selectedLanguage } = this.state;
    switch (selectedLanguage) {
      case "javascript":
        return "js";
      case "css":
        return "css";
      case "html":
        return "html";
      case "json":
        return "json";
      case "xml":
        return "xml";
      default:
        return "txt";
    }
  };

  saveMinifiedCode = () => {
    const { minifiedCode, selectedLanguage } = this.state;
    if (!minifiedCode || minifiedCode.startsWith("Error")) {
      return;
    }
    const fileExtension = this.getFileExtension();
    const element = document.createElement("a");
    const file = new Blob([minifiedCode], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `minified_code.${fileExtension}`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  render() {
    const { codeInput, minifiedCode, selectedLanguage, codeError } = this.state;

    return (
      <main className="overflow-y-auto p-4 md:p-6 lg:p-8 xl:p-10 md:pt-4 lg:pt-5 xl:pt-5 h-full bg-gray-900">
        <CustomScrollbar />
        <section className="flex flex-col gap-6 h-full">
          <h1 className="text-3xl text-white font-semibold">Code Minifier</h1>

          <section className="flex flex-col gap-4">
            <ul className="flex flex-col gap-4">
              <li>
                <div className="flex h-14 items-center gap-6 rounded-lg bg-gray-800 px-4">
                  <label className="text-white">Select Language:</label>
                  <select value={selectedLanguage} onChange={this.handleLanguageChange} className="bg-gray-700 text-white rounded-md p-2 pl-3 focus:outline-none focus:ring-2 focus:ring-blue-400">
                    <option value="javascript">JavaScript</option>
                    <option value="css">CSS</option>
                    <option value="html">HTML</option>
                    <option value="json">JSON</option>
                    <option value="xml">XML</option>
                  </select>
                </div>
              </li>
            </ul>
          </section>

          <section className="flex flex-col lg:flex-row gap-4 h-full">
            <div className="flex-1 flex flex-col h-full">
              <div className="flex justify-between items-center">
                <h2 className="text-lg text-gray-300">Input</h2>
                <div className="flex items-center">
                  <button className="text-gray-400 hover:text-white transition-colors p-2" onClick={this.clearCodeInput} title="Clear Input">
                    <ClearIcon />
                  </button>
                </div>
              </div>
              <textarea
                className="flex-1 h-full border-2 rounded-lg border-gray-600 bg-gray-800 px-4 py-2 text-gray-300 outline-none placeholder-gray-500 hover:bg-[#2b3544] focus:border-blue-400 focus:bg-[#2b3544] font-mono custom-scrollbar resize-none"
                placeholder="Enter code to minify"
                value={codeInput}
                onChange={this.handleCodeInputChange}
                style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}
              />
            </div>

            <div className="flex-1 flex flex-col h-full">
              <div className="flex justify-between items-center">
                <h2 className="text-lg text-gray-300">Minified Output</h2>
                <div className="flex items-center">
                  <button className="text-gray-400 hover:text-white transition-colors p-2" onClick={this.saveMinifiedCode} title="Save Minified Code">
                    <SaveIcon />
                  </button>
                  <button className="text-gray-400 hover:text-white transition-colors p-2" onClick={() => this.copyToClipboard(minifiedCode)} title="Copy Minified Code">
                    <CopyIcon />
                  </button>
                </div>
              </div>
              <textarea
                className={`flex-1 h-full border-2 rounded-lg border-gray-600 bg-gray-800 px-4 py-2 text-gray-300 outline-none placeholder-gray-500 hover:bg-gray-700 focus:border-blue-400 focus:bg-gray-700 font-mono custom-scrollbar resize-none overflow-auto`}
                value={minifiedCode}
                readOnly
                style={{
                  whiteSpace: "pre-wrap",
                  wordWrap: "break-word",
                  overflowWrap: "break-word",
                }}
              />
              {codeError && <p className="text-red-500 mt-2">{codeError}</p>}
            </div>
          </section>
        </section>
      </main>
    );
  }
}

export default CodeMinifier;
