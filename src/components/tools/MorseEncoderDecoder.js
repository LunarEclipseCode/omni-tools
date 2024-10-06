import React, { Component } from "react";
import { CopyIcon, ClearIcon, SaveIcon } from "../others/Icons";
import { CustomScrollbar } from "../others/CustomScrollbar";
import morse from '@ozdemirburak/morse-code-translator';

class MorseEncoderDecoder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      morseInput: "",
      morseOutput: "",
      morseError: null,
      isMorseEncoding: true,
    };
  }

  copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  handleMorseInputChange = (e) => {
    const morseInput = e.target.value;
    this.setState({ morseInput });

    if (this.state.isMorseEncoding) {
      try {
        const morseOutput = morse.encode(morseInput);
        this.setState({ morseOutput, morseError: null });
      } catch (error) {
        this.setState({ morseOutput: "", morseError: "Invalid input for encoding" });
      }
    } else {
      try {
        const morseOutput = morse.decode(morseInput);
        this.setState({ morseOutput, morseError: null });
      } catch (error) {
        this.setState({ morseOutput: "", morseError: "Invalid input for decoding" });
      }
    }
  };

  handleMorseOutputChange = (e) => {
    const morseOutput = e.target.value;
    this.setState({ morseOutput });

    if (this.state.isMorseEncoding) {
      try {
        const morseInput = morse.decode(morseOutput);
        this.setState({ morseInput, morseError: null });
      } catch (error) {
        this.setState({ morseInput: "", morseError: "Invalid input for decoding" });
      }
    } else {
      try {
        const morseInput = morse.encode(morseOutput);
        this.setState({ morseInput, morseError: null });
      } catch (error) {
        this.setState({ morseInput: "", morseError: "Invalid input for encoding" });
      }
    }
  };

  clearMorseInput = () => {
    this.setState({ morseInput: "", morseOutput: "", morseError: null });
  };

  toggleMorseConversionMode = () => {
    this.setState((prevState) => ({
      isMorseEncoding: !prevState.isMorseEncoding,
      morseInput: prevState.morseOutput,
      morseOutput: prevState.morseInput,
    }));
  };

  render() {
    const { morseInput, morseOutput, morseError, isMorseEncoding } = this.state;

    const saveMorseOutputAsText = () => {
      const element = document.createElement("a");
      const file = new Blob([morseOutput], { type: "text/plain" });
      element.href = URL.createObjectURL(file);
      element.download = "morse_output.txt";
      document.body.appendChild(element);
      element.click();
    };

    return (
      <main className="overflow-y-auto p-4 md:p-6 lg:p-8 xl:p-10 md:pt-4 lg:pt-5 xl:pt-5 h-full">
        <CustomScrollbar />
        <section className="flex flex-col gap-6 h-full">
          <h1 className="text-3xl text-white font-semibold">Morse Code Encoder/Decoder</h1>
          <section className="flex flex-col gap-4">
            <ul className="flex flex-col gap-4">
              <li>
                <div className="flex h-14 items-center gap-6 rounded-lg bg-gray-700 px-4">
                  <span className="text-white">Mode</span>
                  <div className="flex flex-1 justify-end">
                    <div className="flex flex-row-reverse items-center">
                      <button
                        type="button"
                        role="switch"
                        aria-checked={isMorseEncoding}
                        onClick={this.toggleMorseConversionMode}
                        className={`group inline-flex h-6 w-12 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 ease-in-out ${isMorseEncoding ? "bg-blue-600" : "bg-gray-600"}`}
                      >
                        <span className={`pointer-events-none block h-4 w-4 rounded-full bg-white shadow-lg transform transition-transform duration-200 ease-in-out ${isMorseEncoding ? "translate-x-7" : "translate-x-1"}`}></span>
                      </button>
                      <label className="leading-none cursor-pointer pr-3 text-white">{isMorseEncoding ? "Encoder" : "Decoder"}</label>
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
                  <button className="text-gray-400 hover:text-white transition-colors p-2" onClick={this.clearMorseInput}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </div>
              </div>
              <textarea
                className="flex-1 h-full border-2 rounded-lg border-gray-600 bg-gray-800 px-4 py-2 text-gray-300 outline-none placeholder-gray-500 hover:bg-[#2b3544] focus:border-blue-400 focus:bg-[#2b3544] font-mono custom-scrollbar"
                placeholder={isMorseEncoding ? "Enter text to encode" : "Enter Morse Code to decode"}
                value={morseInput}
                onChange={this.handleMorseInputChange}
              />
            </div>
            <div className="flex-1 flex flex-col h-full">
              <div className="flex justify-between items-center">
                <h2 className="text-lg text-gray-300">Output</h2>
                <div className="flex items-center">
                  <button className="text-gray-400 hover:text-white transition-colors p-2" onClick={saveMorseOutputAsText}>
                    <SaveIcon />
                  </button>
                  <button className="text-gray-400 hover:text-white transition-colors p-2" onClick={() => this.copyToClipboard(morseOutput)}>
                    <CopyIcon />
                  </button>
                </div>
              </div>
              <textarea
                className="flex-1 h-full border-2 rounded-lg border-gray-600 bg-gray-800 px-4 py-2 text-gray-300 outline-none placeholder-gray-500 hover:bg-[#2b3544] focus:border-blue-400 focus:bg-[#2b3544] font-mono custom-scrollbar"
                placeholder={isMorseEncoding ? "" : ""}
                value={morseOutput}
                readOnly
              />
              {morseError && <span className="text-red-500">{morseError}</span>}
            </div>
          </section>
        </section>
      </main>
    );
  }
}

export default MorseEncoderDecoder;
