import React, { Component } from "react";
import { CopyIcon, ClearIcon, SaveIcon } from "../others/Icons";
import { md5, sha3, blake2b, blake3 } from "hash-wasm";

class ChecksumGenerator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      file: null,
      checksum: "",
      selectedAlgorithm: "blake3",
      algorithms: [
        { label: "MD5", value: "md5" },
        { label: "SHA3-256", value: "sha3256" },
        { label: "SHA3-512", value: "sha3512" },
        { label: "BLAKE3", value: "blake3" },
        { label: "BLAKE2b", value: "blake2b" },
      ],
      uppercase: false,
      comparerInput: "",
      comparerStatus: null, // null: not compared, true: match, false: no match
    };
    this.fileInputRef = React.createRef();
  }

  copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  clearFileInput = () => {
    this.setState({
      file: null,
      checksum: "",
      comparerStatus: null,
    });
    this.fileInputRef.current.value = null; // Reset the file input to show "No file chosen"
  };

  toggleUppercase = () => {
    this.setState(
      (prevState) => ({
        uppercase: !prevState.uppercase,
      }),
      () => {
        if (this.state.file) {
          this.generateChecksum(this.state.file);
        }
      }
    );
  };

  handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      this.setState({ file }, () => this.generateChecksum(file));
    }
  };

  handleAlgorithmChange = (e) => {
    const selectedAlgorithm = e.target.value;
    this.setState({ selectedAlgorithm }, () => {
      if (this.state.file) {
        this.generateChecksum(this.state.file);
      }
    });
  };

  async generateChecksum(file) {
    const reader = new FileReader();

    reader.onload = async (event) => {
      const fileContent = new Uint8Array(event.target.result);

      let checksum = "";

      switch (this.state.selectedAlgorithm) {
        case "md5":
          checksum = await md5(fileContent);
          break;
        case "sha3256":
          checksum = await sha3(fileContent, 256);
          break;
        case "sha3512":
          checksum = await sha3(fileContent, 512);
          break;
        case "blake3":
          checksum = await blake3(fileContent);
          break;
        case "blake2b":
          checksum = await blake2b(fileContent);
          break;
        default:
          return;
      }

      const comparerStatus = this.state.comparerInput && checksum ? this.state.comparerInput === (this.state.uppercase ? checksum.toUpperCase() : checksum) : null;

      this.setState({
        checksum: this.state.uppercase ? checksum.toUpperCase() : checksum,
        comparerStatus,
      });
    };

    reader.readAsArrayBuffer(file);
  }

  handleComparerInputChange = (e) => {
    const comparerInput = e.target.value;
    this.setState({ comparerInput }, this.compareChecksums);
  };

  compareChecksums = () => {
    const { comparerInput, checksum } = this.state;

    if (comparerInput.trim() === "") {
      this.setState({ comparerStatus: null });
      return;
    }

    const match = comparerInput === checksum;
    this.setState({ comparerStatus: match });
  };

  saveChecksumAsText = () => {
    const { checksum, selectedAlgorithm } = this.state;
    const blob = new Blob([checksum], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.style.display = "none";
    a.href = url;
    a.download = `${selectedAlgorithm}_checksum.txt`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  render() {
    const { file, checksum, algorithms, selectedAlgorithm, uppercase, comparerInput, comparerStatus } = this.state;
    return (
      <main className="overflow-y-auto p-4 md:p-6 lg:p-8 xl:p-10 md:pt-4 lg:pt-5 xl:pt-5 h-full">
        <section className="flex flex-col">
          <h1 className="text-3xl text-white font-semibold">Checksum Generator</h1>

          {/* Uppercase and Algorithm Selection */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-6">
            <div className="flex h-12 items-center gap-6 rounded-lg bg-gray-700 px-4 justify-between">
              <span className="text-white">Uppercase</span>
              <div className="flex items-center">
                <label className="leading-none cursor-pointer pr-3 text-white">{uppercase ? "On" : "Off"}</label>
                <button
                  type="button"
                  role="switch"
                  aria-checked={uppercase}
                  onClick={this.toggleUppercase}
                  className={`group inline-flex h-6 w-12 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 ease-in-out ${uppercase ? "bg-blue-600" : "bg-gray-600"}`}
                >
                  <span className={`pointer-events-none block h-4 w-4 rounded-full bg-white shadow-lg transform transition-transform duration-200 ease-in-out ${uppercase ? "translate-x-7" : "translate-x-1"}`}></span>
                </button>
              </div>
            </div>

            <div className="flex h-12 items-center gap-6 rounded-lg bg-gray-700 px-4 justify-between">
              <span className="text-white">Select Algorithm:</span>
              <select value={selectedAlgorithm} onChange={this.handleAlgorithmChange} className="bg-gray-800 text-white rounded-lg p-2.5 outline-none ml-auto pl-3 pr-3">
                {algorithms.map((algo) => (
                  <option key={algo.value} value={algo.value}>
                    {algo.label}
                  </option>
                ))}
              </select>
            </div>
          </section>

          {/* File Input */}
          <section className="flex flex-col gap-2 mt-6">
            <div className="flex justify-between">
              <h2 className="text-lg text-gray-300">Upload File</h2>
              <button className="text-gray-400 hover:text-white transition-colors px-1" onClick={this.clearFileInput}>
                <ClearIcon />
              </button>
            </div>
            <input
              type="file"
              onChange={this.handleFileChange}
              ref={this.fileInputRef}
              className="block w-full text-gray-400 bg-gray-800 border border-gray-600 rounded-md cursor-pointer focus:outline-none file:bg-gray-700 file:text-base text-base file:text-gray-400 file:border-0 file:py-[0.55rem] file:px-4 file:mr-4 hover:file:bg-gray-600"
            />
          </section>

          {/* Output Section */}
          <section className="mt-5">
            <div className="flex justify-between items-center mb-0.5">
              <h2 className="text-lg text-gray-300">Output</h2>
              <div className="flex items-center">
                <button className="text-gray-400 hover:text-white transition-colors p-1 mr-2" onClick={this.saveChecksumAsText} disabled={!checksum} aria-label="Save Checksum" title={!checksum ? "Nothing to save" : "Save Checksum"}>
                  <SaveIcon />
                </button>
                <button className="text-gray-400 hover:text-white transition-colors p-2" onClick={() => this.copyToClipboard(checksum)} disabled={!checksum} aria-label="Copy Checksum" title="Copy Checksum">
                  <CopyIcon />
                </button>
              </div>
            </div>
            <div className="flex items-center border-b-2 border-gray-600 bg-gray-800 rounded-lg">
              <textarea
                className="h-52 md:h-56 flex-grow bg-transparent px-4 py-2 text-white outline-none placeholder-gray-500 hover:bg-[#2b3544] focus:border-blue-400 focus:bg-[#2b3544] font-mono rounded-md resize-none"
                spellCheck="false"
                value={checksum}
                readOnly
                placeholder="Checksum will appear here..."
              />
            </div>
          </section>

          {/* Output Comparer */}
          <section className="mt-6">
            <h2 className="text-lg text-gray-300 mb-1">Output Comparer</h2>
            <div className="flex items-center border-b-2 border-gray-600 bg-gray-800 rounded-lg">
              <textarea
                className="h-52 md:h-56 flex-grow bg-transparent px-4 py-2 text-white outline-none placeholder-gray-500 hover:bg-[#2b3544] focus:border-blue-400 focus:bg-[#2b3544] font-mono rounded-md resize-none"
                spellCheck="false"
                value={comparerInput}
                onChange={this.handleComparerInputChange}
                placeholder="Enter checksum to compare"
              />
            </div>
            {comparerStatus === true && <p className="text-green-500 mt-2">The checksums match!</p>}
            {comparerStatus === false && <p className="text-red-500 mt-2">The checksums do not match.</p>}
          </section>
        </section>
      </main>
    );
  }
}

export default ChecksumGenerator;
