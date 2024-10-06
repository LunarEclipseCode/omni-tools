import React, { Component } from "react";
import { CopyIcon, ClearIcon, SaveIcon } from "../others/Icons";
import { CustomScrollbar } from "../others/CustomScrollbar";

class PasswordGenerator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uppercase: false,
      passwordLength: 12,
      includeLowercase: true,
      includeUppercase: true,
      includeDigits: true,
      includeSpecial: true,
      excludeCharacters: "",
      generatedPasswords: [],
      numberOfPasswords: 1,
    };
  }

  generatePassword = () => {
    const { passwordLength, includeLowercase, includeUppercase, includeDigits, includeSpecial, excludeCharacters, numberOfPasswords } = this.state;
    const lowercaseChars = "abcdefghijklmnopqrstuvwxyz";
    const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const digitChars = "0123456789";
    const specialChars = "!@#$%^&*()-_=+[]{}|;:,.<>?";

    let characterPool = "";

    if (includeLowercase) characterPool += lowercaseChars;
    if (includeUppercase) characterPool += uppercaseChars;
    if (includeDigits) characterPool += digitChars;
    if (includeSpecial) characterPool += specialChars;

    if (excludeCharacters) {
      characterPool = characterPool
        .split("")
        .filter((char) => !excludeCharacters.includes(char))
        .join("");
    }

    if (characterPool.length === 0) {
      this.setState({
        generatedPasswords: [],
        errorMessage: "No password can be generated because no characters are left.",
      });
      return;
    }

    const passwords = [];
    for (let i = 0; i < numberOfPasswords; i++) {
      let password = "";
      for (let j = 0; j < passwordLength; j++) {
        const randomIndex = Math.floor((crypto.getRandomValues(new Uint32Array(1))[0] / (0xffffffff + 1)) * characterPool.length);
        password += characterPool[randomIndex];
      }
      passwords.push(password);
    }

    this.setState({ generatedPasswords: passwords });
  };

  handlePasswordLengthChange = (e) => {
    this.setState({ passwordLength: e.target.value });
  };

  handleExcludeCharactersChange = (e) => {
    this.setState({ excludeCharacters: e.target.value });
  };

  handleToggleOption = (option) => {
    this.setState((prevState) => ({
      [option]: !prevState[option],
    }));
  };

  handleNumberOfPasswordsChange = (e) => {
    this.setState({ numberOfPasswords: e.target.value });
  };

  render() {
    const { passwordLength, includeLowercase, includeUppercase, includeDigits, includeSpecial, excludeCharacters, generatedPasswords, numberOfPasswords, errorMessage } = this.state;

    const handlePasswordLengthChange = (event) => {
      const value = event.target.value;
      if (!isNaN(value) && !value.includes("e")) {
        this.setState({ passwordLength: value });
      }
    };

    const copyPasswordsToClipboard = () => {
      const { generatedPasswords } = this.state;
      navigator.clipboard.writeText(generatedPasswords.join("\n"));
    };

    const saveAsText = () => {
      const { generatedPasswords } = this.state;
      const element = document.createElement("a");
      const file = new Blob([generatedPasswords.join("\n")], { type: "text/plain" });
      element.href = URL.createObjectURL(file);
      element.download = "passwords.txt";
      document.body.appendChild(element); // Required for this to work in FireFox
      element.click();
    };

    const clearPasswords = () => {
      this.setState({ generatedPasswords: [] });
    };

    const processPasswordGen = () => {
      let value = parseInt(this.state.passwordLength);
      let errorMessage = "";

      if (isNaN(value) || value < 8) {
        value = 8;
        errorMessage = "Password has to be at least 8 characters long.";
      } else if (value > 128) {
        value = 128;
        errorMessage = "Sorry, cannot create password with more than 128 characters.";
      }

      this.setState({ passwordLength: value, errorMessage }, this.generatePassword);
    };

    const handleNumberInputChange = (event, handler) => {
      const value = event.target.value;
      if (!isNaN(value) && !value.includes("e")) {
        handler(event);
      }
    };

    const calculateLineNumberWidth = () => {
      const maxDigits = Math.max(generatedPasswords.length.toString().length, 3);
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
          <h1 className="text-3xl text-white font-semibold mb-6">Password Generator</h1>
          <section className="grid gap-4 grid-cols-1 lg:grid-cols-2">
            <div className="order-1 2xl:order-1">
              <div className="flex h-14 items-center gap-6 rounded-lg bg-gray-800 px-4">
                <span className="text-white flex-1">Password Length</span>
                <input type="number" value={passwordLength} onChange={handlePasswordLengthChange} className="h-10 w-16 bg-gray-700 text-white px-2 rounded-lg text-center custom-number-input" min="8" max="128" />
              </div>
            </div>

            <div className="order-2 2xl:order-3">
              <div className="flex h-14 items-center rounded-lg bg-gray-800 px-4">
                <span className="text-white flex-1">Include Lowercase Characters</span>
                <div className="flex flex-1 justify-end">
                  <div className="flex flex-row-reverse items-center">
                    <button
                      type="button"
                      role="switch"
                      aria-checked={includeLowercase}
                      onClick={() => this.handleToggleOption("includeLowercase")}
                      className={`group inline-flex h-6 w-12 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 ease-in-out ${includeLowercase ? "bg-blue-600" : "bg-gray-600"}`}
                    >
                      <span className={`pointer-events-none block h-4 w-4 rounded-full bg-white shadow-lg transform transition-transform duration-200 ease-in-out ${includeLowercase ? "translate-x-7" : "translate-x-1"}`}></span>
                    </button>
                    <label className="leading-none cursor-pointer pr-3 text-white">{includeLowercase ? "On" : "Off"}</label>
                  </div>
                </div>
              </div>
            </div>

            <div className="order-4 2xl:order-5">
              <div className="flex h-14 items-center rounded-lg bg-gray-800 px-4">
                <span className="text-white flex-1">Include Digits</span>
                <div className="flex flex-1 justify-end">
                  <div className="flex flex-row-reverse items-center">
                    <button
                      type="button"
                      role="switch"
                      aria-checked={includeDigits}
                      onClick={() => this.handleToggleOption("includeDigits")}
                      className={`group inline-flex h-6 w-12 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 ease-in-out ${includeDigits ? "bg-blue-600" : "bg-gray-600"}`}
                    >
                      <span className={`pointer-events-none block h-4 w-4 rounded-full bg-white shadow-lg transform transition-transform duration-200 ease-in-out ${includeDigits ? "translate-x-7" : "translate-x-1"}`}></span>
                    </button>
                    <label className="leading-none cursor-pointer pr-3 text-white">{includeDigits ? "On" : "Off"}</label>
                  </div>
                </div>
              </div>
            </div>

            <div className="order-6 2xl:order-2">
              <div className="flex items-center rounded-lg bg-gray-800 px-4 h-14">
                <span className="text-white flex-1">Exclude Characters</span>
                <input type="text" value={excludeCharacters} onChange={this.handleExcludeCharactersChange} className="h-10 w-48 bg-gray-700 text-white px-2 rounded-lg text-left" />
              </div>
            </div>

            <div className="order-3 2xl:order-4">
              <div className="flex h-14 items-center rounded-lg bg-gray-800 px-4">
                <span className="text-white flex-1">Include Uppercase Characters</span>

                <div className="flex flex-1 justify-end">
                  <div className="flex flex-row-reverse items-center">
                    <button
                      type="button"
                      role="switch"
                      aria-checked={includeUppercase}
                      onClick={() => this.handleToggleOption("includeUppercase")}
                      className={`group inline-flex h-6 w-12 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 ease-in-out ${includeUppercase ? "bg-blue-600" : "bg-gray-600"}`}
                    >
                      <span className={`pointer-events-none block h-4 w-4 rounded-full bg-white shadow-lg transform transition-transform duration-200 ease-in-out ${includeUppercase ? "translate-x-7" : "translate-x-1"}`}></span>
                    </button>
                    <label className="leading-none cursor-pointer pr-3 text-white">{includeUppercase ? "On" : "Off"}</label>
                  </div>
                </div>
              </div>
            </div>

            <div className="order-5 2xl:order-6">
              <div className="flex h-14 items-center gap-6 rounded-lg bg-gray-800 px-4">
                <span className="text-white flex-1">Include Special Characters</span>

                <div className="flex flex-1 justify-end">
                  <div className="flex flex-row-reverse items-center">
                    <button
                      type="button"
                      role="switch"
                      aria-checked={includeSpecial}
                      onClick={() => this.handleToggleOption("includeSpecial")}
                      className={`group inline-flex h-6 w-12 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 ease-in-out ${includeSpecial ? "bg-blue-600" : "bg-gray-600"}`}
                    >
                      <span className={`pointer-events-none block h-4 w-4 rounded-full bg-white shadow-lg transform transition-transform duration-200 ease-in-out ${includeSpecial ? "translate-x-7" : "translate-x-1"}`}></span>
                    </button>
                    <label className="leading-none cursor-pointer pr-3 text-white">{includeSpecial ? "On" : "Off"}</label>
                  </div>
                </div>
              </div>
            </div>

            {errorMessage && (
              <div className="order-7 2xl:order-7 col-span-1 2xl:col-span-2">
                <p className="text-red-500 text-base">{errorMessage}</p>
              </div>
            )}
          </section>

          <div className="flex items-center mb-0 mt-6">
            <button onClick={processPasswordGen} className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg">
              Generate Passwords
            </button>
            <span className="text-white mx-2">x</span>
            <input type="number" value={numberOfPasswords} onChange={(event) => handleNumberInputChange(event, this.handleNumberOfPasswordsChange)} className="h-10 w-16 bg-gray-700 text-white px-2 rounded-lg text-center custom-number-input" min="1" />
          </div>
          <div className="flex justify-end">
            <button className="text-gray-400 hover:text-white transition-colors mr-4" onClick={saveAsText}>
              <SaveIcon />
            </button>
            <button className="text-gray-400 hover:text-white transition-colors mr-2" onClick={copyPasswordsToClipboard}>
              <CopyIcon />
            </button>
            <button className="text-gray-400 hover:text-white transition-colors p-2" onClick={clearPasswords}>
              <ClearIcon />
            </button>
          </div>
          <section className="flex flex-col gap-4">
            <div className="relative h-64 2xl:h-96 border-2 rounded-lg border-gray-600 bg-gray-800 px-4 py-2 text-gray-300 overflow-auto custom-scrollbar">
              <div className="absolute top-0 left-0 line-number-background bg-gray-700 text-gray-400 text-right pr-2 pt-2">
                {generatedPasswords.map((_, index) => (
                  <div key={index} className="leading-6">
                    {index + 1}
                  </div>
                ))}
              </div>
              <div className="ml-10 whitespace-nowrap">
                {generatedPasswords.map((password, index) => (
                  <div key={index} className="leading-6 select-text">
                    {password}
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

export default PasswordGenerator;
