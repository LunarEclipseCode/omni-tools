import React, { Component } from "react";
import { CopyIcon, ClearIcon, SaveIcon } from "../others/Icons";
import { CustomScrollbar } from "../others/CustomScrollbar";

// US Grade 1 Braille mapping
const brailleMap = {
  a: "⠁",
  b: "⠃",
  c: "⠉",
  d: "⠙",
  e: "⠑",
  f: "⠋",
  g: "⠛",
  h: "⠓",
  i: "⠊",
  j: "⠚",
  k: "⠅",
  l: "⠇",
  m: "⠍",
  n: "⠝",
  o: "⠕",
  p: "⠏",
  q: "⠟",
  r: "⠗",
  s: "⠎",
  t: "⠞",
  u: "⠥",
  v: "⠧",
  w: "⠺",
  x: "⠭",
  y: "⠽",
  z: "⠵",
  " ": " ", // Space remains the same

  // Numbers
  1: "⠼⠁",
  2: "⠼⠃",
  3: "⠼⠉",
  4: "⠼⠙",
  5: "⠼⠑",
  6: "⠼⠋",
  7: "⠼⠛",
  8: "⠼⠓",
  9: "⠼⠊",
  0: "⠼⠚",

  // Punctuation
  ",": "⠂",
  ";": "⠆",
  ":": "⠒",
  ".": "⠲",
  "!": "⠖",
  "?": "⠦",
  "'": "⠄",
  "-": "⠤",
  "/": "⠌",
  '"': "⠶",
  "(": "⠐⠣",
  ")": "⠐⠜",
  "&": "⠈⠯",
  "*": "⠔",
  "+": "⠖",
  "=": "⠶",
  "@": "⠈⠁",
  "#": "⠼",
};

class BrailleTranslator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      textInput: "",
      translatedText: "",
      textError: null,
    };
  }

  handleTextInputChange = (e) => {
    const textInput = e.target.value;
    this.setState({ textInput });

    if (!textInput.trim()) {
      this.setState({ translatedText: "", textError: null });
      return;
    }

    try {
      let translatedText = "";
      for (const char of textInput.toLowerCase()) {
        if (brailleMap[char]) {
          translatedText += brailleMap[char];
        } else {
          translatedText += char; // Non-supported characters are added as is
        }
      }

      this.setState({ translatedText, textError: null });
    } catch (error) {
      this.setState({ translatedText: `Error: ${error.message}`, textError: error.message });
    }
  };

  clearTextInput = () => {
    this.setState({
      textInput: "",
      translatedText: "",
      textError: null,
    });
  };

  saveTranslatedText = () => {
    const { translatedText } = this.state;
    if (!translatedText || translatedText.startsWith("Error")) {
      return;
    }
    const element = document.createElement("a");
    const file = new Blob([translatedText], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `translated_text.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  render() {
    const { textInput, translatedText, textError } = this.state;

    return (
      <main className="overflow-y-auto p-4 md:p-6 lg:p-8 xl:p-10 md:pt-4 lg:pt-5 xl:pt-5 h-full bg-gray-900">
        <CustomScrollbar />
        <section className="flex flex-col gap-6 h-full">
          <h1 className="text-3xl text-white font-semibold">Braille Translator</h1>

          <section className="flex flex-col lg:flex-row gap-4 h-full">
            <div className="flex-1 flex flex-col h-full">
              <div className="flex justify-between items-center">
                <h2 className="text-lg text-gray-300">Text Input</h2>
                <div className="flex items-center">
                  <button className="text-gray-400 hover:text-white transition-colors p-2" onClick={this.clearTextInput} title="Clear Input">
                    <ClearIcon />
                  </button>
                </div>
              </div>
              <textarea
                className="flex-1 h-full border-2 rounded-lg border-gray-600 bg-gray-800 px-4 py-2 text-gray-300 outline-none placeholder-gray-500 hover:bg-[#2b3544] focus:border-blue-400 focus:bg-[#2b3544] font-mono custom-scrollbar resize-none"
                placeholder="Enter text"
                value={textInput}
                onChange={this.handleTextInputChange}
                style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}
              />
            </div>

            <div className="flex-1 flex flex-col h-full">
              <div className="flex justify-between items-center">
                <h2 className="text-lg text-gray-300">Braille Output</h2>
                <div className="flex items-center">
                  <button className="text-gray-400 hover:text-white transition-colors p-2" onClick={this.saveTranslatedText} title="Save Braille Text">
                    <SaveIcon />
                  </button>
                  <button className="text-gray-400 hover:text-white transition-colors p-2" onClick={() => this.copyToClipboard(translatedText)} title="Copy Braille Text">
                    <CopyIcon />
                  </button>
                </div>
              </div>
              <textarea
                className={`flex-1 h-full border-2 rounded-lg border-gray-600 bg-gray-800 px-4 py-2 text-gray-300 outline-none placeholder-gray-500 hover:bg-[#2b3544] focus:border-blue-400 focus:bg-[#2b3544] font-mono custom-scrollbar resize-none overflow-auto`}
                placeholder="Braille text will appear here"
                value={translatedText}
                readOnly
                style={{
                  whiteSpace: "pre-wrap",
                  wordWrap: "break-word",
                  overflowWrap: "break-word",
                }}
              />
              {textError && <p className="text-red-500 mt-2">{textError}</p>}
            </div>
          </section>
        </section>
      </main>
    );
  }
}

export default BrailleTranslator;
