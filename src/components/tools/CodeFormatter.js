import React, { Component } from "react";
import { CopyIcon, ClearIcon, SaveIcon } from "../others/Icons";
import * as prettier from "prettier/standalone";
import parserBabel from "prettier/plugins/babel";
import parserHtml from "prettier/plugins/html";
import parserCss from "prettier/plugins/postcss";
import parserMarkdown from "prettier/plugins/markdown";
import parserTypeScript from "prettier/plugins/typescript";
import parserGraphql from "prettier/plugins/graphql";
import parserYaml from "prettier/plugins/yaml";
import parserXml from "@prettier/plugin-xml";
import parserJava from "prettier-plugin-java";
import parserPhp from "@prettier/plugin-php";
import * as prettierPluginEstree from "prettier/plugins/estree";
import { CustomScrollbar } from "../others/CustomScrollbar";

class CodeFormatter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      codeInput: "",
      formattedCode: "",
      codeError: null,
      selectedLanguage: "babel",
    };
  }

  copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  handleLanguageChange = (e) => {
    this.setState({ selectedLanguage: e.target.value, codeInput: "", formattedCode: "", codeError: null });
  };

  handleCodeInputChange = async (e) => {
    const codeInput = e.target.value;
    this.setState({ codeInput });

    try {
      const parserMap = {
        babel: "babel",
        html: "html",
        css: "css",
        markdown: "markdown",
        typescript: "typescript",
        graphql: "graphql",
        yaml: "yaml",
        xml: "xml",
        java: "java",
        kotlin: "kotlin",
        php: "php",
        sql: "sql",
        svelte: "svelte",
        ruby: "ruby",
      };

      const selectedParser = parserMap[this.state.selectedLanguage];

      const pluginsMap = {
        babel: [parserBabel, prettierPluginEstree],
        html: [parserHtml],
        css: [parserCss],
        markdown: [parserMarkdown],
        typescript: [parserTypeScript, prettierPluginEstree],
        graphql: [parserGraphql],
        yaml: [parserYaml],
        xml: [parserXml],
        java: [parserJava],
        php: [parserPhp],
      };

      const formattedCode = await prettier.format(codeInput, {
        parser: selectedParser,
        plugins: pluginsMap[this.state.selectedLanguage],
        tabWidth: 2,
        useTabs: false,
        singleQuote: true,
        trailingComma: "es5",
        bracketSpacing: true,
        jsxBracketSameLine: false,
        embeddedLanguageFormatting: "auto",
      });

      this.setState({ formattedCode, codeError: null });
    } catch (error) {
      this.setState({ formattedCode: `Error: ${error.message}`, codeError: error.message });
    }
  };

  clearCodeInput = () => {
    this.setState({ codeInput: "", formattedCode: "", codeError: null });
  };

  render() {
    const { codeInput, formattedCode, selectedLanguage } = this.state;

    const getFileExtension = () => {
      switch (selectedLanguage) {
        case "babel":
        case "typescript":
          return "js";
        case "typescript":
          return "ts";
        case "html":
          return "html";
        case "css":
          return "css";
        case "graphql":
          return "graphql";
        case "yaml":
          return "yaml";
        case "xml":
          return "xml";
        case "java":
          return "java";
        case "php":
          return "php";
        default:
          return "txt";
      }
    };

    const saveFormattedCode = () => {
      const fileExtension = getFileExtension();
      const element = document.createElement("a");
      const file = new Blob([formattedCode], { type: "text/plain" });
      element.href = URL.createObjectURL(file);
      element.download = `formatted_code.${fileExtension}`;
      document.body.appendChild(element);
      element.click();
    };

    return (
      <main className="overflow-y-auto p-4 md:p-6 lg:p-8 xl:p-10 md:pt-4 lg:pt-5 xl:pt-5 h-full">
        <CustomScrollbar />
        <section className="flex flex-col gap-6 h-full">
          <h1 className="text-3xl text-white font-semibold">Code Beautifier/Formatter</h1>
          <section className="flex flex-col gap-4">
            <ul className="flex flex-col gap-4">
              <li>
                <div className="flex h-14 items-center gap-6 rounded-lg bg-gray-800 px-4">
                  <label className="text-white">Select Language:</label>
                  <select value={selectedLanguage} onChange={this.handleLanguageChange} className="bg-gray-700 text-white rounded-md p-2 pl-3">
                    <option value="babel">JavaScript</option>
                    <option value="typescript">TypeScript</option>
                    <option value="html">HTML</option>
                    <option value="css">CSS</option>
                    <option value="graphql">GraphQL</option>
                    <option value="yaml">YAML</option>
                    <option value="xml">XML</option>
                    <option value="java">Java</option>
                    <option value="php">PHP</option>
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
                  <button className="text-gray-400 hover:text-white transition-colors p-2" onClick={this.clearCodeInput}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </div>
              </div>
              <textarea
                className="flex-1 h-full border-2 rounded-lg border-gray-600 bg-gray-800 px-4 py-2 text-gray-300 outline-none placeholder-gray-500 hover:bg-[#2b3544] focus:border-blue-400 focus:bg-[#2b3544] font-mono custom-scrollbar"
                placeholder="Enter code"
                value={codeInput}
                onChange={this.handleCodeInputChange}
              />
            </div>
            <div className="flex-1 flex flex-col h-full">
              <div className="flex justify-between items-center">
                <h2 className="text-lg text-gray-300">Output</h2>
                <div className="flex items-center">
                  <button className="text-gray-400 hover:text-white transition-colors p-2" onClick={saveFormattedCode}>
                    <SaveIcon />
                  </button>
                  <button className="text-gray-400 hover:text-white transition-colors p-2" onClick={() => this.copyToClipboard(formattedCode)}>
                    <CopyIcon />
                  </button>
                </div>
              </div>
              <textarea
                className={`flex-1 h-full border-2 rounded-lg border-gray-600 bg-gray-800 px-4 py-2 text-gray-300 outline-none placeholder-gray-500 hover:bg-[#2b3544] focus:border-blue-400 focus:bg-[#2b3544] font-mono custom-scrollbar ${
                  this.state.codeError ? "text-red-500" : ""
                }`}
                placeholder=""
                value={formattedCode}
                readOnly
              />
            </div>
          </section>
        </section>
      </main>
    );
  }
}

export default CodeFormatter;
