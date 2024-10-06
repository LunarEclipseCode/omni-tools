import React, { Component } from "react";
import { LoremIpsum } from "lorem-ipsum";
import { CopyIcon, ClearIcon, SaveIcon } from "../others/Icons";
import { CustomScrollbar } from "../others/CustomScrollbar";

class LoremIpsumGenerator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loremType: "paragraphs",
      loremLength: 3,
      generatedLorem: "",
    };
  }

  lorem = new LoremIpsum({
    sentencesPerParagraph: {
      max: 12,
      min: 7,
    },
    wordsPerSentence: {
      max: 16,
      min: 8,
    },
  });

  handleLoremTypeChange = (event) => {
    this.setState({ loremType: event.target.value });
  };

  handleLoremLengthChange = (event) => {
    const value = event.target.value;
    if (!isNaN(value) && !value.includes("e")) {
      this.setState({ loremLength: value });
    }
  };

  generateLoremIpsum = () => {
    const { loremType, loremLength } = this.state;
    const length = parseInt(loremLength);

    if (length < 1 || isNaN(length)) {
      this.setState({
        generatedLorem: "",
        errorMessage: "Length must be at least 1.",
      });
      return;
    }

    let generatedLorem = "";
    if (loremType === "words") {
      generatedLorem = this.lorem.generateWords(length);
    } else if (loremType === "sentences") {
      generatedLorem = this.lorem.generateSentences(length);
    } else if (loremType === "paragraphs") {
      generatedLorem = this.lorem.generateParagraphs(length);
    }

    this.setState({ generatedLorem, errorMessage: "" });
  };

  copyLoremToClipboard = () => {
    const { generatedLorem } = this.state;
    navigator.clipboard.writeText(generatedLorem);
  };

  clearLorem = () => {
    this.setState({ generatedLorem: "" });
  };

  render() {
    const { loremType, loremLength, generatedLorem, errorMessage } = this.state;

    const saveLoremAsText = () => {
      const element = document.createElement("a");
      const file = new Blob([generatedLorem], { type: "text/plain" });
      element.href = URL.createObjectURL(file);
      element.download = "lorem_ipsum.txt";
      document.body.appendChild(element); // Required for this to work in FireFox
      element.click();
    };

    return (
      <main className="overflow-y-auto p-4 md:p-6 lg:p-8 xl:p-10 md:pt-4 lg:pt-5 xl:pt-5 h-full">
        <CustomScrollbar />
        <style>{`
          .button-group {
              display: flex;
              margin-top: 0em; /* Move the buttons closer to the output box */
              position: relative;
              top: 1.5em;
              right: 0;
          }
            .dropdown-container {
              position: relative;
              display: inline-block;
          }
          .dropdown-select {
              appearance: none;
              width: 100%;
              height: 100%;
              background-color: #374151;
              color: white;
              text-align: center;
              padding: 0.45em; 
              padding-right: 2em;
              padding-left: 1em;
              margin-right: 1em;
              border: none;
              border-radius: 0.4em;
              font-size: 1rem;
              position: relative;
          }
          .dropdown-select option {
              text-align: left; /* Align dropdown options to the left */
              padding: 0.5rem;
          }
          .dropdown-select::after {
              content: '';
              position: absolute;
              top: 50%;
              width: 0;
              height: 0;
              border-left: 5px solid transparent;
              border-right: 5px solid transparent;
              border-top: 5px solid white;
              transform: translateY(-50%);
              pointer-events: none; 
          }
          .length-input {
              text-align: center; /* Center the number in the input field */
              -webkit-appearance: none;
              -moz-appearance: textfield;
          }

          .length-input::-webkit-outer-spin-button,
          .length-input::-webkit-inner-spin-button {
              -webkit-appearance: none;
              margin: 0;
          }

          .length-input {
              -moz-appearance: textfield;
          }
          .custom-dropdown-icon {
              position: absolute;
              right: 10px;
              top: 50%;
              transform: translateY(-50%);
              pointer-events: none;
          }
              
      `}</style>
        <section className="flex flex-col gap-6">
          <h1 className="text-3xl text-white font-semibold">Lorem Ipsum Generator</h1>
          <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex h-[3.25rem] items-center gap-6 rounded-lg bg-gray-800 px-4">
              <span className="text-white flex-1">Type</span>
              <div className="dropdown-container">
                <select value={loremType} onChange={this.handleLoremTypeChange} className="dropdown-select">
                  <option value="words">Words</option>
                  <option value="sentences">Sentences</option>
                  <option value="paragraphs">Paragraphs</option>
                </select>
                <svg className="custom-dropdown-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </div>
            </div>

            <div className="flex h-[3.25rem] items-center gap-6 rounded-lg bg-gray-800 px-4">
              <span className="text-white flex-1">Length</span>
              <input type="number" value={loremLength} onChange={this.handleLoremLengthChange} className="h-10 w-16 bg-gray-700 text-white px-2 rounded-lg length-input" min="1" />
            </div>
            {errorMessage && <p className="text-red-500 text-base">{errorMessage}</p>}
          </section>

          <section className="flex justify-between items-center">
            <div className="flex items-center">
              <button onClick={this.generateLoremIpsum} className="bg-blue-600 hover:bg-blue-500 text-white py-2 px-4 rounded-lg text-lg">
                Generate
              </button>
            </div>
            <div className="button-group">
              <button className="text-gray-400 hover:text-white transition-colors mr-4" onClick={saveLoremAsText}>
                <SaveIcon />
              </button>
              <button className="text-gray-400 hover:text-white transition-colors mr-2" onClick={this.copyLoremToClipboard}>
                <CopyIcon />
              </button>
              <button className="text-gray-400 hover:text-white transition-colors p-2" onClick={this.clearLorem}>
                <ClearIcon />
              </button>
            </div>
          </section>

          <section className="flex flex-col gap-4">
            <div className="relative h-[36.3rem] border-2 rounded-lg border-gray-600 bg-gray-800 px-4 py-2 text-gray-300 overflow-auto custom-scrollbar">
              <div className="ml-2 pt-2 whitespace-pre-line select-text">{generatedLorem}</div>
            </div>
          </section>
        </section>
      </main>
    );
  }
}

export default LoremIpsumGenerator;
