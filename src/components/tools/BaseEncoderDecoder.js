import React, { Component } from "react";
import { CopyIcon, ClearIcon, SaveIcon } from "../others/Icons";
import { CustomScrollbar } from "../others/CustomScrollbar";
import base64 from "base-64";
import base32 from "hi-base32";
import baseX from "base-x";

class BaseEncoderDecoder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      baseInput: "", // Base Encoder/Decoder state
      baseOutput: "",
      baseError: null,
      isEncoding: true,
      selectedBase: "base64",
    };
  }

  handleBaseInputChange = (e) => {
    const baseInput = e.target.value;
    this.setState({ baseInput });

    this.processBaseConversion(baseInput, this.state.isEncoding);
  };

  processBaseConversion = (input, isEncoding) => {
    const { selectedBase } = this.state;
    let baseOutput = "";
    let baseError = null;

    try {
      if (isEncoding) {
        baseOutput = this.encode(input, selectedBase);
      } else {
        baseOutput = this.decode(input, selectedBase);
      }
    } catch (error) {
      baseError = "Invalid input for " + (isEncoding ? "encoding" : "decoding");
    }

    this.setState({ baseOutput, baseError });
  };

  encode = (input, base) => {
    switch (base) {
      case "base16":
        return Buffer.from(input, "utf8").toString("hex");
      case "base32":
        return base32.encode(input);
      case "base64":
        return base64.encode(input);
      case "base58":
        return baseX("123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz").encode(Buffer.from(input, "utf8"));
      case "base62":
        return baseX("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz").encode(Buffer.from(input, "utf8"));
      case "base85":
        return baseX("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!#$%&()*+-;<=>?@^_`{|}~").encode(Buffer.from(input, "utf8"));
      case "base91":
        return baseX('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!#$%&()*+,./:;<=>?@[\\]^_`{|}~"').encode(Buffer.from(input, "utf8"));
      default:
        throw new Error("Unsupported encoding");
    }
  };

  decode = (input, base) => {
    switch (base) {
      case "base16":
        return Buffer.from(input, "hex").toString("utf8");
      case "base32":
        return base32.decode(input);
      case "base64":
        return base64.decode(input);
      case "base58":
        return Buffer.from(baseX("123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz").decode(input)).toString("utf8");
      case "base62":
        return Buffer.from(baseX("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz").decode(input)).toString("utf8");
      case "base85":
        return Buffer.from(baseX("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!#$%&()*+-;<=>?@^_`{|}~").decode(input)).toString("utf8");
      case "base91":
        return Buffer.from(baseX('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!#$%&()*+,./:;<=>?@[\\]^_`{|}~"').decode(input)).toString("utf8");
      default:
        throw new Error("Unsupported decoding");
    }
  };

  clearBaseInput = () => {
    this.setState({ baseInput: "", baseOutput: "", baseError: null });
  };

  toggleConversionMode = () => {
    this.setState(
      (prevState) => ({
        isEncoding: !prevState.isEncoding,
        baseInput: prevState.baseOutput,
        baseOutput: prevState.baseInput,
      }),
      () => {
        this.processBaseConversion(this.state.baseInput, this.state.isEncoding);
      }
    );
  };

  handleBaseSelection = (e) => {
    const { baseInput, isEncoding } = this.state;
    const selectedBase = e.target.value;

    if (isEncoding) {
      this.setState({ selectedBase }, () => {
        if (baseInput) {
          this.processBaseConversion(baseInput, isEncoding);
        }
      });
    } else {
      this.setState({
        selectedBase,
        baseInput: "",
        baseOutput: "",
        baseError: null,
      });
    }
  };

  saveOutputAsText = () => {
    const { baseOutput, isEncoding } = this.state;
    const element = document.createElement("a");
    const file = new Blob([baseOutput], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    const fileName = isEncoding ? "encoded.txt" : "decoded.txt";
    element.download = fileName;
    document.body.appendChild(element); // Required for Firefox
    element.click();
    document.body.removeChild(element);
  };

  render() {
    const { baseInput, baseOutput, baseError, isEncoding, selectedBase } = this.state;
    return (
      <main className="overflow-y-auto p-4 md:p-6 lg:p-8 xl:p-10 md:pt-4 lg:pt-5 xl:pt-5 h-full">
        <CustomScrollbar />
        <section className="flex flex-col gap-6 h-full">
          <h1 className="text-3xl text-white font-semibold">Base Encoder/Decoder</h1>
          <section className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex h-12 items-center gap-6 rounded-lg bg-gray-700 px-4 justify-between">
              <span className="text-white">Mode:</span>
              <div className="flex items-center">
                <label className="leading-none cursor-pointer pr-3 text-white">{isEncoding ? "Encoder" : "Decoder"}</label>
                <button
                  type="button"
                  role="switch"
                  aria-checked={isEncoding}
                  onClick={this.toggleConversionMode}
                  className={`group inline-flex h-6 w-12 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 ease-in-out ${isEncoding ? "bg-blue-600" : "bg-gray-600"}`}
                >
                  <span className={`pointer-events-none block h-4 w-4 rounded-full bg-white shadow-lg transform transition-transform duration-200 ease-in-out ${isEncoding ? "translate-x-7" : "translate-x-1"}`}></span>
                </button>
              </div>
            </div>
            {/* Base Selection */}
            <div className="flex h-12 items-center gap-6 rounded-lg bg-gray-700 px-4 justify-between">
              <span className="text-white">Base:</span>
              <select value={selectedBase} onChange={this.handleBaseSelection} className="bg-gray-800 text-white rounded-lg p-2.5 outline-none ml-auto pl-3 pr-3">
                <option value="base16">Base16</option>
                <option value="base32">Base32</option>
                <option value="base58">Base58</option>
                <option value="base62">Base62</option>
                <option value="base64">Base64</option>
                <option value="base85">Base85</option>
                <option value="base91">Base91</option>
              </select>
            </div>
          </section>
          <section className="flex flex-col lg:flex-row gap-4 h-full">
            <div className="flex-1 flex flex-col h-full">
              <div className="flex justify-between items-center">
                <h2 className="text-lg text-gray-300">Input</h2>
                <div className="flex items-center">
                  {/* <button className="text-gray-400 hover:text-white transition-colors p-2" onClick={() => this.copyToClipboard(baseInput)}>
                    <CopyIcon />
                  </button> */}
                  {/* <button className="text-gray-400 hover:text-white transition-colors p-2" onClick={() => this.pasteFromClipboard(this.handleBaseInputChange)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-clipboard">
                      <path d="M16 4h-2a2 2 0 0 0-4 0H8a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"></path>
                      <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
                    </svg>
                  </button> */}
                  <button className="text-gray-400 hover:text-white transition-colors p-2" onClick={this.clearBaseInput}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </div>
              </div>
              <textarea
                className="flex-1 h-full border-2 rounded-lg border-gray-600 bg-gray-800 px-4 py-2 text-gray-300 outline-none placeholder-gray-500 hover:bg-[#2b3544] focus:border-blue-400 focus:bg-[#2b3544] font-mono custom-scrollbar"
                placeholder={isEncoding ? "Enter text to encode" : "Enter text to decode"}
                value={baseInput}
                onChange={this.handleBaseInputChange}
              />
            </div>
            <div className="flex-1 flex flex-col h-full">
              <div className="flex justify-between items-center">
                <h2 className="text-lg text-gray-300">Output</h2>
                <div className="flex items-center">
                  <button className="text-gray-400 hover:text-white transition-colors p-2" onClick={this.saveOutputAsText}>
                    <SaveIcon />
                  </button>
                  <button className="text-gray-400 hover:text-white transition-colors p-2" onClick={() => this.copyToClipboard(baseOutput)}>
                    <CopyIcon />
                  </button>
                </div>
              </div>
              <textarea
                className="flex-1 h-full border-2 rounded-lg border-gray-600 bg-gray-800 px-4 py-2 text-gray-300 outline-none placeholder-gray-500 hover:bg-[#2b3544] focus:border-blue-400 focus:bg-[#2b3544] font-mono custom-scrollbar"
                placeholder={baseError ? baseError : isEncoding ? "" : ""}
                value={baseError ? baseError : baseOutput}
                readOnly
              />
            </div>
          </section>
        </section>
      </main>
    );
  }
}

export default BaseEncoderDecoder;
