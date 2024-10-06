import React, { Component } from "react";
import { CopyIcon, ClearIcon, SaveIcon } from "../others/Icons";
import { md5, sha3, blake2b, blake3 } from "hash-wasm";
import { CustomScrollbar } from "../others/CustomScrollbar";

class HashGenerator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hashInput: "",
      md5: "",
      sha3256: "",
      sha3512: "",
      blake3: "",
      blake2b: "",
    };
  }

  copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  pasteFromClipboard = (onChange) => {
    navigator.clipboard.readText().then((text) => onChange({ target: { value: text } }));
  };

  
  clearHashInput = () => {
    this.setState({ hashInput: "",
      md5: "",
      sha3256: "",
      sha3512: "",
      blake3: "",
      blake2b: "",});
  };

  toggleUppercase = () => {
    this.setState(
      (prevState) => ({
        uppercase: !prevState.uppercase,
      }),
      () => {
        this.updateHashes(this.state.hashInput);
      }
    );
  };

  async updateHashes(input) {
    if (input.trim() === "") {
      this.setState({
        md5: "",
        sha3256: "",
        sha3512: "",
        blake3: "",
        blake2b: "",
      });
      return;
    }

    const md5Hash = await md5(input);
    const sha3256Hash = await sha3(input, 256);
    const sha3512Hash = await sha3(input, 512);
    const blake3Hash = await blake3(input);
    const blake2bHash = await blake2b(input);

    this.setState({
      md5: this.state.uppercase ? md5Hash.toUpperCase() : md5Hash,
      sha3256: this.state.uppercase ? sha3256Hash.toUpperCase() : sha3256Hash,
      sha3512: this.state.uppercase ? sha3512Hash.toUpperCase() : sha3512Hash,
      blake3: this.state.uppercase ? blake3Hash.toUpperCase() : blake3Hash,
      blake2b: this.state.uppercase ? blake2bHash.toUpperCase() : blake2bHash,
    });
  }

  handleHashInputChange = async (e) => {
    const hashInput = e.target.value;
    this.setState({ hashInput });
    await this.updateHashes(hashInput);
  };

  renderHashSection = (label, value) => {
    return (
      <section className="flex flex-col gap-2">
        <div className="flex justify-between">
          <h2 className="self-end text-lg text-gray-300">{label}</h2>
          <div className="flex">
            <button className=" text-gray-400 hover:text-white transition-colors mr-2" onClick={() => this.copyToClipboard(value)}>
              <CopyIcon />
            </button>
          </div>
        </div>
        <div className="flex items-center border-b-2 border-gray-600 bg-gray-800 rounded-lg">
          <input className="h-10 flex-grow bg-transparent px-4 py-2 text-white outline-none placeholder-gray-500 hover:bg-gray-700 focus:border-blue-400 focus:bg-gray-700 font-mono rounded-md" spellCheck="false" value={value} readOnly />
        </div>
      </section>
    );
  };

  render() {
    const { hashInput, md5, sha3256, sha3512, blake3, blake2b, uppercase } = this.state;
    return (
      <main className="overflow-y-auto p-4 md:p-6 lg:p-8 xl:p-10 md:pt-4 lg:pt-5 xl:pt-5 h-full">
        <section className="flex flex-col">
          <h1 className="text-3xl text-white font-semibold">Hash Generator</h1>
          <section className="flex flex-col gap-4">
            <ul className="flex flex-col gap-4">
              <li>
                <div className="flex h-[3.25rem] items-center gap-6 rounded-lg bg-gray-700 px-4 mt-6 mb-5">
                  <span className="text-white">Uppercase</span>
                  <div className="flex flex-1 justify-end">
                    <div className="flex flex-row-reverse items-center">
                      <button
                        type="button"
                        role="switch"
                        aria-checked={uppercase}
                        onClick={this.toggleUppercase}
                        className={`group inline-flex h-6 w-12 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 ease-in-out ${uppercase ? "bg-blue-600" : "bg-gray-600"}`}
                      >
                        <span className={`pointer-events-none block h-4 w-4 rounded-full bg-white shadow-lg transform transition-transform duration-200 ease-in-out ${uppercase ? "translate-x-7" : "translate-x-1"}`}></span>
                      </button>
                      <label className="leading-none cursor-pointer pr-3 text-white">{uppercase ? "On" : "Off"}</label>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </section>
          <section className="flex flex-col gap-3">
            <div className="flex justify-between items-center">

              <h2 className="text-lg text-gray-300">Input</h2>
              <div className="flex items-center">
                {/* <button className="text-gray-400 hover:text-white transition-colors px-2" onClick={() => this.pasteFromClipboard(this.handleHashInputChange)}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-clipboard">
                    <path d="M16 4h-2a2 2 0 0 0-4 0H8a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"></path>
                    <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
                  </svg>
                </button> */}
                <button className="text-gray-400 hover:text-white transition-colors px-1" onClick={this.clearHashInput}>
                  <ClearIcon />
                </button>
              </div>
            </div>
            <div className="flex items-center rounded-lg">
            <CustomScrollbar />
              <textarea
                className="flex-1 h-52 border-2 rounded-lg border-gray-600 bg-gray-800 text-gray-300 outline-none placeholder-gray-500 hover:bg-[#2b3544] focus:border-blue-400 focus:bg-gray-800 font-mono custom-scrollbar"
                placeholder="Enter text to hash"
                value={hashInput}
                onChange={this.handleHashInputChange}
              />
            </div>
            {this.renderHashSection("MD5", md5)}
            {this.renderHashSection("SHA3-256", sha3256)}
            {this.renderHashSection("SHA3-512", sha3512)}
            {this.renderHashSection("BLAKE3", blake3)}
            {this.renderHashSection("BLAKE2b", blake2b)}
          </section>
        </section>
      </main>
    );
  }
}

export default HashGenerator;
