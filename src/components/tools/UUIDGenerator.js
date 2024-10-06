import React, { Component } from "react";
import { v1 as uuidv1, v4 as uuidv4, v6 as uuidv6, v7 as uuidv7 } from "uuid";
import { CopyIcon, ClearIcon, SaveIcon } from "../others/Icons";
import { CustomScrollbar } from "../others/CustomScrollbar";

class UUIDGenerator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hyphens: true,
      uppercase: false,
      numberOfUUIDs: 1,
      uuidVersion: "v4",
      rawUUIDs: [],
      generatedUUIDs: [],
    };
  }

  generateUUIDs = () => {
    const { numberOfUUIDs, uuidVersion } = this.state;
    let uuids = [];
    for (let i = 0; i < numberOfUUIDs; i++) {
      let uuid;
      if (uuidVersion === "v1") {
        uuid = uuidv1();
      } else if (uuidVersion === "v4") {
        uuid = uuidv4();
      } else if (uuidVersion === "v6") {
        uuid = uuidv6();
      } else if (uuidVersion === "v7") {
        uuid = uuidv7();
      } else {
        uuid = "Unsupported UUID version";
      }
      uuids.push(uuid);
    }
    this.setState({ rawUUIDs: uuids }, this.reformatUUIDs);
  };

  reformatUUIDs = () => {
    const { rawUUIDs, hyphens, uppercase } = this.state;
    const formattedUUIDs = rawUUIDs.map((uuid) => {
      let formattedUuid = uuid;
      if (!hyphens) {
        formattedUuid = formattedUuid.replace(/-/g, "");
      }
      if (uppercase) {
        formattedUuid = formattedUuid.toUpperCase();
      }
      return formattedUuid;
    });
    this.setState({ generatedUUIDs: formattedUUIDs });
  };

  handleToggleOption = (option) => {
    this.setState(
      (prevState) => ({
        [option]: !prevState[option],
      }),
      this.reformatUUIDs
    );
  };

  handleNumberOfUUIDsChange = (e) => {
    const value = e.target.value;
    if (!isNaN(value) && !value.includes("e")) {
      this.setState({ numberOfUUIDs: value });
    }
  };

  render() {
    const { hyphens, uppercase, numberOfUUIDs, generatedUUIDs, uuidVersion } = this.state;

    const copyUUIDsToClipboard = () => {
      navigator.clipboard.writeText(generatedUUIDs.join("\n"));
    };

    const saveAsText = () => {
      const element = document.createElement("a");
      const file = new Blob([generatedUUIDs.join("\n")], { type: "text/plain" });
      element.href = URL.createObjectURL(file);
      element.download = "uuids.txt";
      document.body.appendChild(element);
      element.click();
    };

    const clearUUIDs = () => {
      this.setState({ rawUUIDs: [], generatedUUIDs: [] });
    };

    const processUUIDGen = () => {
      this.generateUUIDs();
    };

    const calculateLineNumberWidth = () => {
      const maxDigits = Math.max(generatedUUIDs.length.toString().length, 3);
      return 8 + maxDigits * 8;
    };

    return (
      <main className="overflow-y-auto p-4 md:p-6 lg:p-8 xl:p-10 md:pt-4 lg:pt-5 xl:pt-5 h-full">
        <CustomScrollbar />
        <style>{`
          .line-number-background {
            background-color: #4a5568;
            padding-bottom: 0.5em;
            min-height: 100%;
            width: ${calculateLineNumberWidth()}px; /* Dynamically calculated width */
          }

          .custom-number-input {
            -webkit-appearance: none;
            -moz-appearance: textfield;
            text-align: center;
          }

          /* Remove arrows */
          .custom-number-input::-webkit-outer-spin-button,
          .custom-number-input::-webkit-inner-spin-button {
            -webkit-appearance: none;
            margin: 0;
          }

          /* Remove arrows in Firefox */
          .custom-number-input {
            -moz-appearance: textfield;
          }
        `}</style>
        <section className="flex flex-col gap-0">
          <h1 className="text-3xl text-white font-semibold mb-6">UUID Generator</h1>

          <div className="flex h-14 items-center gap-6 rounded-lg bg-gray-800 px-4 mb-4">
            <span className="text-white flex-1">UUID Version</span>
            <select value={uuidVersion} onChange={(e) => this.setState({ uuidVersion: e.target.value })} className="h-10 w-32 bg-gray-700 text-white px-2 rounded-lg">
              <option value="v1">v1</option>
              <option value="v4">v4</option>
              <option value="v6">v6</option>
              <option value="v7">v7</option>
            </select>
          </div>
          <section className="grid gap-4 grid-cols-1 md:grid-cols-2">
            <div className="order-1 2xl:order-1">
              <div className="flex h-14 items-center gap-6 rounded-lg bg-gray-800 px-4">
                <span className="text-white flex-1">Hyphens</span>
                <div className="flex flex-1 justify-end">
                  <div className="flex flex-row-reverse items-center">
                    <button
                      type="button"
                      role="switch"
                      aria-checked={hyphens}
                      onClick={() => this.handleToggleOption("hyphens")}
                      className={`group inline-flex h-6 w-12 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 ease-in-out ${hyphens ? "bg-blue-600" : "bg-gray-600"}`}
                    >
                      <span className={`pointer-events-none block h-4 w-4 rounded-full bg-white shadow-lg transform transition-transform duration-200 ease-in-out ${hyphens ? "translate-x-7" : "translate-x-1"}`}></span>
                    </button>
                    <label className="leading-none cursor-pointer pr-3 text-white">{hyphens ? "On" : "Off"}</label>
                  </div>
                </div>
              </div>
            </div>

            <div className="order-2 2xl:order-2">
              <div className="flex h-14 items-center gap-6 rounded-lg bg-gray-800 px-4">
                <span className="text-white flex-1">Uppercase</span>
                <div className="flex flex-1 justify-end">
                  <div className="flex flex-row-reverse items-center">
                    <button
                      type="button"
                      role="switch"
                      aria-checked={uppercase}
                      onClick={() => this.handleToggleOption("uppercase")}
                      className={`group inline-flex h-6 w-12 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 ease-in-out ${uppercase ? "bg-blue-600" : "bg-gray-600"}`}
                    >
                      <span className={`pointer-events-none block h-4 w-4 rounded-full bg-white shadow-lg transform transition-transform duration-200 ease-in-out ${uppercase ? "translate-x-7" : "translate-x-1"}`}></span>
                    </button>
                    <label className="leading-none cursor-pointer pr-3 text-white">{uppercase ? "On" : "Off"}</label>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <div className="flex items-center mb-0 mt-6">
            <button onClick={processUUIDGen} className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg">
              Generate UUIDs
            </button>
            <span className="text-white mx-2">x</span>
            <input type="number" value={numberOfUUIDs} onChange={this.handleNumberOfUUIDsChange} className="h-10 w-16 bg-gray-700 text-white px-2 rounded-lg text-center custom-number-input" min="1" />
          </div>

          <div className="flex justify-end">
            <button className="text-gray-400 hover:text-white transition-colors mr-4" onClick={saveAsText}>
              <SaveIcon />
            </button>
            <button className="text-gray-400 hover:text-white transition-colors mr-2" onClick={copyUUIDsToClipboard}>
              <CopyIcon />
            </button>
            <button className="text-gray-400 hover:text-white transition-colors p-2" onClick={clearUUIDs}>
              <ClearIcon />
            </button>
          </div>
          <section className="flex flex-col gap-4">
            <div className="relative h-[31rem] 2xl:h-[34rem] border-2 rounded-lg border-gray-600 bg-gray-800 px-4 py-2 text-gray-300 overflow-auto custom-scrollbar">
              <div className="absolute top-0 left-0 line-number-background bg-gray-700 text-gray-400 text-right pr-2 pt-2" style={{ width: calculateLineNumberWidth() }}>
                {generatedUUIDs.map((_, index) => (
                  <div key={index} className="leading-6">
                    {index + 1}
                  </div>
                ))}
              </div>
              <div className="ml-10 whitespace-nowrap">
                {generatedUUIDs.map((uuid, index) => (
                  <div key={index} className="leading-6 select-text">
                    {uuid}
                  </div>
                ))}
              </div>
            </div>
          </section>
        </section>
      </main>
    );
  }
}

export default UUIDGenerator;
