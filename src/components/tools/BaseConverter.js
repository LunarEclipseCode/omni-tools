import React, { Component } from "react";
import { CopyIcon, ClearIcon } from "../others/Icons";

class BaseConverter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      decimalInput: "",
      hexInput: "",
      octalInput: "",
      binaryInput: "",
      formatNumber: true,
      error: null,
    };
  }

  copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  pasteFromClipboard = (onChange) => {
    navigator.clipboard.readText().then((text) => onChange({ target: { value: text } }));
  };

  formatOutput = (value, groupSize) => {
    return value.replace(new RegExp(`(.{1,${groupSize}})(?=(.{${groupSize}})+$)`, "g"), "$1 ");
  };

  clearFields = () => {
    this.setState({
      decimalInput: "",
      hexInput: "",
      octalInput: "",
      binaryInput: "",
      error: null,
    });
  };

  handleDecimalChange = (e) => {
    const decimalValue = e.target.value.trim();

    if (decimalValue === "") {
      this.clearFields();
      return;
    }
    if (isNaN(decimalValue)) {
      this.setState({
        error: "Decimal",
        decimalInput: decimalValue,
        hexInput: "NaN",
        octalInput: "NaN",
        binaryInput: "NaN",
      });
      return;
    }

    const hexValue = parseInt(decimalValue, 10).toString(16).toUpperCase();
    const octalValue = parseInt(decimalValue, 10).toString(8);
    const binaryValue = parseInt(decimalValue, 10).toString(2);

    this.setState({
      error: null,
      decimalInput: decimalValue,
      hexInput: this.state.formatNumber ? this.formatOutput(hexValue, 4) : hexValue,
      octalInput: this.state.formatNumber ? this.formatOutput(octalValue, 3) : octalValue,
      binaryInput: this.state.formatNumber ? this.formatOutput(binaryValue, 4) : binaryValue,
    });
  };

  handleHexChange = (e) => {
    const baseHexValue = e.target.value.replace(/\s+/g, "").trim();

    if (baseHexValue === "") {
      this.clearFields();
      return;
    }

    if (!/^[0-9A-Fa-f]*$/.test(baseHexValue)) {
      this.setState({
        error: "Hexadecimal",
        hexInput: baseHexValue,
        decimalInput: "NaN",
        octalInput: "NaN",
        binaryInput: "NaN",
      });
      return;
    }

    const hexValue = baseHexValue.toUpperCase();
    const decimalValue = parseInt(hexValue, 16).toString(10);
    const octalValue = parseInt(decimalValue, 10).toString(8);
    const binaryValue = parseInt(decimalValue, 10).toString(2);

    this.setState({
      error: null,
      decimalInput: decimalValue,
      hexInput: this.state.formatNumber ? this.formatOutput(hexValue, 4) : hexValue,
      octalInput: this.state.formatNumber ? this.formatOutput(octalValue, 3) : octalValue,
      binaryInput: this.state.formatNumber ? this.formatOutput(binaryValue, 4) : binaryValue,
    });
  };

  handleOctalChange = (e) => {
    const octalValue = e.target.value.replace(/\s+/g, "").trim();

    if (octalValue === "") {
      this.clearFields();
      return;
    }
    if (!/^[0-7]*$/.test(octalValue)) {
      this.setState({
        error: "Octal",
        octalInput: octalValue,
        decimalInput: "NaN",
        hexInput: "NaN",
        binaryInput: "NaN",
      });
      return;
    }

    const decimalValue = parseInt(octalValue, 8).toString(10);
    const hexValue = parseInt(decimalValue, 10).toString(16).toUpperCase();
    const binaryValue = parseInt(decimalValue, 10).toString(2);

    this.setState({
      error: null,
      decimalInput: decimalValue,
      hexInput: this.state.formatNumber ? this.formatOutput(hexValue, 4) : hexValue,
      octalInput: this.state.formatNumber ? this.formatOutput(octalValue, 3) : octalValue,
      binaryInput: this.state.formatNumber ? this.formatOutput(binaryValue, 4) : binaryValue,
    });
  };

  handleBinaryChange = (e) => {
    const binaryValue = e.target.value.replace(/\s+/g, "").trim();

    if (binaryValue === "") {
      this.clearFields();
      return;
    }
    if (!/^[01]*$/.test(binaryValue)) {
      this.setState({
        error: "Binary",
        binaryInput: binaryValue,
        decimalInput: "NaN",
        hexInput: "NaN",
        octalInput: "NaN",
      });
      return;
    }

    const decimalValue = parseInt(binaryValue, 2).toString(10);
    const hexValue = parseInt(decimalValue, 10).toString(16).toUpperCase();
    const octalValue = parseInt(decimalValue, 10).toString(8);

    this.setState({
      error: null,
      decimalInput: decimalValue,
      hexInput: this.state.formatNumber ? this.formatOutput(hexValue, 4) : hexValue,
      octalInput: this.state.formatNumber ? this.formatOutput(octalValue, 3) : octalValue,
      binaryInput: this.state.formatNumber ? this.formatOutput(binaryValue, 4) : binaryValue,
    });
  };

  toggleFormatNumber = () => {
    this.setState(
      (prevState) => ({
        formatNumber: !prevState.formatNumber,
      }),
      () => {
        this.handleDecimalChange({ target: { value: this.state.decimalInput } });
      }
    );
  };

  renderBaseSection = (label, value, onChange, showClear = false) => {
    return (
      <section className="flex flex-col gap-2">
        <div className="flex justify-between">
          <h2 className="self-end text-lg text-gray-300">{label}</h2>
          <div className="flex">
            <button className="text-gray-400 hover:text-white transition-colors mr-3" onClick={() => this.copyToClipboard(value)}>
              <CopyIcon />
            </button>
            {showClear && (
              <button className="text-gray-400 hover:text-white transition-colors mr-2" onClick={this.clearFields} aria-label="Clear Fields">
                <ClearIcon />
              </button>
            )}
          </div>
        </div>
        <div className="flex items-center border-b-2 border-gray-600 bg-gray-800 rounded-lg">
          <input className="h-10 flex-grow bg-transparent px-4 py-2 text-white outline-none placeholder-gray-500 hover:bg-gray-700 focus:border-blue-400 focus:bg-gray-700 font-mono rounded-md" spellCheck="false" value={value} onChange={onChange} />
        </div>
      </section>
    );
  };

  render() {
    const { decimalInput, hexInput, octalInput, binaryInput, formatNumber, error } = this.state;
    return (
      <main className="overflow-y-auto p-4 md:p-6 lg:p-8 xl:p-10 md:pt-4 lg:pt-5 xl:pt-5 h-full">
        <section className="flex flex-col gap-6">
          <h1 className="text-3xl text-white font-semibold lg:pb-1">Number Base Converter</h1>
          <section className="flex flex-col gap-4">
            <ul className="flex flex-col gap-4">
              <li>
                <div className="flex h-14 items-center gap-6 rounded-lg bg-gray-700 px-4">
                  <span className="text-white">Format number</span>
                  <div className="flex flex-1 justify-end">
                    <div className="flex flex-row-reverse items-center">
                      <button
                        type="button"
                        role="switch"
                        aria-checked={formatNumber}
                        onClick={this.toggleFormatNumber}
                        className={`group inline-flex h-6 w-12 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 ease-in-out ${formatNumber ? "bg-blue-600" : "bg-gray-600"}`}
                      >
                        <span className={`pointer-events-none block h-4 w-4 rounded-full bg-white shadow-lg transform transition-transform duration-200 ease-in-out ${formatNumber ? "translate-x-7" : "translate-x-1"}`}></span>
                      </button>
                      <label className="leading-none cursor-pointer pr-3 text-white">{formatNumber ? "On" : "Off"}</label>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </section>
          {error && <div className="text-red-500 font-semibold">The current value isn't a valid {error}.</div>}
          <div className="flex flex-col gap-4">
            {this.renderBaseSection("Decimal", decimalInput, this.handleDecimalChange, true)}
            {this.renderBaseSection("Hexadecimal", hexInput, this.handleHexChange)}
            {this.renderBaseSection("Octal", octalInput, this.handleOctalChange)}
            {this.renderBaseSection("Binary", binaryInput, this.handleBinaryChange)}
          </div>
        </section>
      </main>
    );
  }
}

export default BaseConverter;
