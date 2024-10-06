import React, { Component } from "react";
import { CopyIcon, ClearIcon, SaveIcon } from "../others/Icons";
import { CustomScrollbar } from "../others/CustomScrollbar";

class UrlEncoderDecoder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isEncoding: true,
      input: "",
      output: "",
      error: null,
    };
  }

  encodeRFC3986 = (str) => {
    return encodeURIComponent(str).replace(/[!'()*]/g, (c) => {
      return '%' + c.charCodeAt(0).toString(16).toUpperCase();
    }).replace(/%7E/g, '~'); 
  };

  decodeRFC3986 = (str) => {
    try {
      return decodeURIComponent(str);
    } catch (e) {
      throw new Error('Invalid URI Component');
    }
  };

  handleInputChange = (e) => {
    const input = e.target.value;
    this.setState({ input });

    try {
      let output = "";
      const { isEncoding } = this.state;

      if (isEncoding && input) {
        output = this.encodeRFC3986(input);
      } else if (!isEncoding && input) {
        output = this.decodeRFC3986(input);
      }

      this.setState({ output, error: null });
    } catch (error) {
      this.setState({ output: "", error: "Invalid input" });
    }
  };

  clearInput = () => {
    this.setState({ input: "", output: "", error: null });
  };

  toggleMode = () => {
    this.setState((prevState) => {
      const shouldReset = prevState.error !== null && !prevState.isEncoding;
      return {
        isEncoding: !prevState.isEncoding,
        input: shouldReset ? "" : prevState.output,
        output: shouldReset ? "" : prevState.input,
        error: shouldReset ? null : prevState.error,
      };
    });
  };

  copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  saveOutputAsText = () => {
    const { output } = this.state;
    const element = document.createElement("a");
    const file = new Blob([output], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "url_output.txt";
    document.body.appendChild(element);
    element.click();
  };

  render() {
    const { input, output, error, isEncoding } = this.state;

    return (
      <main className="overflow-y-auto p-4 md:p-6 lg:p-8 xl:p-10 md:pt-4 lg:pt-5 xl:pt-5 h-full">
        <CustomScrollbar />
        <section className="flex flex-col gap-6 h-full">
          <h1 className="text-3xl text-white font-semibold">URL Encoder/Decoder</h1>
          <section className="flex flex-col gap-4">
            <ul className="flex flex-col gap-4">
              <li>
                <div className="flex h-12 items-center gap-6 rounded-lg bg-gray-700 px-4">
                  <span className="text-white">Mode</span>
                  <div className="flex flex-1 justify-end">
                    <div className="flex flex-row-reverse items-center">
                      <button
                        type="button"
                        role="switch"
                        aria-checked={isEncoding}
                        onClick={this.toggleMode}
                        className={`group inline-flex h-6 w-12 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 ease-in-out ${
                          isEncoding ? "bg-blue-600" : "bg-gray-600"
                        }`}
                      >
                        <span
                          className={`pointer-events-none block h-4 w-4 rounded-full bg-white shadow-lg transform transition-transform duration-200 ease-in-out ${
                            isEncoding ? "translate-x-7" : "translate-x-1"
                          }`}
                        ></span>
                      </button>
                      <label className="leading-none cursor-pointer pr-3 text-white">
                        {isEncoding ? "Encode" : "Decode"}
                      </label>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </section>
          <section className="flex flex-col lg:flex-row gap-4 h-full">
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
                className="flex-1 h-full border-2 rounded-lg border-gray-600 bg-gray-800 px-4 py-2 text-gray-300 outline-none placeholder-gray-500 hover:bg-[#2b3544] focus:border-blue-400 focus:bg-[#2b3544] font-mono custom-scrollbar"
                style={{ overflowWrap: "anywhere" }}
                placeholder={isEncoding ? "Enter text to encode" : "Enter text to decode"}
                value={input}
                onChange={this.handleInputChange}
              />
            </div>
            <div className="flex-1 flex flex-col h-full">
              <div className="flex justify-between items-center">
                <h2 className="text-lg text-gray-300">Output</h2>
                <div className="flex items-center">
                <button className="text-gray-400 hover:text-white transition-colors p-2" onClick={this.saveOutputAsText}>
                    <SaveIcon />
                  </button>
                  <button className="text-gray-400 hover:text-white transition-colors p-2" onClick={() => this.copyToClipboard(output)}>
                    <CopyIcon />
                  </button>
                </div>
              </div>
              <textarea
                className={`flex-1 h-full border-2 rounded-lg ${error ? "border-red-600" : "border-gray-600"} bg-gray-800 px-4 py-2 text-gray-300 outline-none placeholder-gray-500 hover:bg-[#2b3544] focus:border-blue-400 focus:bg-[#2b3544] font-mono custom-scrollbar`}
                style={{ overflowWrap: "anywhere" }}
                placeholder={error || (isEncoding && !input ? "" : isEncoding ? "Encoded output" : "Decoded output")}
                value={error || output}
                readOnly
              />
            </div>
          </section>
        </section>
      </main>
    );
  }
}

export default UrlEncoderDecoder;
