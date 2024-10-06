import React, { Component } from "react";
import yaml from "js-yaml";
import { CopyIcon, ClearIcon, SaveIcon } from "../others/Icons";
import { CustomScrollbar } from "../others/CustomScrollbar";

class JsonToYamlConverter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      jsonInput: "",
      yamlInput: "",
      jsonError: null,
      yamlError: null,
    };
  }

  copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  pasteFromClipboard = (onChange) => {
    navigator.clipboard.readText().then((text) => onChange({ target: { value: text } }));
  };

  handleJsonInputChange = (e) => {
    const jsonInput = e.target.value;
    this.setState({ jsonInput });

    if (jsonInput.trim() === "") {
      this.setState({ yamlOutput: "", yamlInput: "", jsonError: null });
      return;
    }

    try {
      const yamlOutput = yaml.dump(JSON.parse(jsonInput));
      this.setState({ yamlOutput, yamlInput: yamlOutput, jsonError: null });
    } catch (error) {
      this.setState({ yamlOutput: "", jsonError: "Invalid JSON" });
    }
  };

  handleYamlInputChange = (e) => {
    const yamlInput = e.target.value;
    this.setState({ yamlInput });

    if (yamlInput.trim() === "") {
      this.setState({ jsonInput: "", yamlError: null });
      return;
    }

    try {
      const jsonOutput = JSON.stringify(yaml.load(yamlInput), null, 2);
      this.setState({ jsonInput: jsonOutput, yamlError: null });
    } catch (error) {
      this.setState({ jsonInput: "", yamlError: "Invalid YAML" });
    }
  };

  // Generic method to save text as a file
  saveAsText = (content, fileName) => {
    if (!content) return;

    const element = document.createElement("a");
    const file = new Blob([content], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = fileName;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  saveJsonAsText = () => {
    const { jsonInput } = this.state;
    this.saveAsText(jsonInput, "output.json");
  };

  saveYamlAsText = () => {
    const { yamlInput } = this.state;
    this.saveAsText(yamlInput, "output.yaml");
  };
  clearJsonInput = () => {
    this.setState({ jsonInput: "", yamlOutput: "", jsonError: null });
  };

  clearYamlInput = () => {
    this.setState({ yamlInput: "", jsonInput: "", yamlError: null });
  };

  render() {
    const { jsonInput, yamlInput, jsonError, yamlError } = this.state;
    return (
      <main className="overflow-y-auto p-4 md:p-6 lg:p-8 xl:p-10 md:pt-4 lg:pt-5 xl:pt-5 h-full">
        <CustomScrollbar />
        <section className="flex flex-col gap-6 h-full">
          <h1 className="text-3xl text-white font-semibold">JSON &lt;&gt; YAML Converter</h1>
          <section className="flex flex-col lg:flex-row gap-4 h-full">
            <div className="flex-1 flex flex-col h-full">
              <div className="flex justify-between items-center">
                <h2 className="text-lg text-gray-300">JSON</h2>
                <div className="flex items-center">
                  <button className="text-gray-400 hover:text-white transition-colors p-2 mr-2" onClick={this.saveJsonAsText} disabled={!yamlInput} aria-label="Save YAML Output" title={!yamlInput ? "Nothing to save" : "Save YAML Output"}>
                    <SaveIcon />
                  </button>
                  <button className="text-gray-400 hover:text-white transition-colors p-2" onClick={() => this.copyToClipboard(jsonInput)}>
                    <CopyIcon />
                  </button>
                  {/* <button className="text-gray-400 hover:text-white transition-colors p-2" onClick={() => this.pasteFromClipboard(this.handleJsonInputChange)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-clipboard">
                      <path d="M16 4h-2a2 2 0 0 0-4 0H8a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"></path>
                      <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
                    </svg>
                  </button> */}
                  <button className="text-gray-400 hover:text-white transition-colors p-2" onClick={this.clearJsonInput}>
                    <ClearIcon />
                  </button>
                </div>
              </div>
              <textarea
                className="flex-1 h-full border-2 rounded-lg border-gray-600 bg-gray-800 px-4 py-2 text-gray-300 outline-none placeholder-gray-500 hover:bg-[#2b3544] focus:border-blue-400 focus:bg-[#2b3544] font-mono custom-scrollbar"
                placeholder="Enter JSON"
                value={jsonInput}
                onChange={this.handleJsonInputChange}
              />
              {jsonError && <span className="text-red-500">{jsonError}</span>}
            </div>
            <div className="flex-1 flex flex-col h-full">
              <div className="flex justify-between items-center">
                <h2 className="text-lg text-gray-300">YAML</h2>
                <div className="flex items-center">
                  <button className="text-gray-400 hover:text-white transition-colors p-2 mr-2" onClick={this.saveYamlAsText} disabled={!jsonInput} aria-label="Save JSON Output" title={!jsonInput ? "Nothing to save" : "Save JSON Output"}>
                    <SaveIcon />
                  </button>
                  <button className="text-gray-400 hover:text-white transition-colors p-2" onClick={() => this.copyToClipboard(yamlInput)}>
                    <CopyIcon />
                  </button>
                  {/* <button className="text-gray-400 hover:text-white transition-colors p-2" onClick={() => this.pasteFromClipboard(this.handleYamlInputChange)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-clipboard">
                      <path d="M16 4h-2a2 2 0 0 0-4 0H8a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"></path>
                      <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
                    </svg>
                  </button> */}
                  <button className="text-gray-400 hover:text-white transition-colors p-2" onClick={this.clearYamlInput}>
                    <ClearIcon />
                  </button>
                </div>
              </div>
              <textarea
                className="flex-1 h-full border-2 rounded-lg border-gray-600 bg-gray-800 px-4 py-2 text-gray-300 outline-none placeholder-gray-500 hover:bg-[#2b3544] focus:border-blue-400 focus:bg-[#2b3544] font-mono custom-scrollbar"
                placeholder="Enter YAML"
                value={yamlInput}
                onChange={this.handleYamlInputChange}
              />
              {yamlError && <span className="text-red-500">{yamlError}</span>}
            </div>
          </section>
        </section>
      </main>
    );
  }
}

export default JsonToYamlConverter;
