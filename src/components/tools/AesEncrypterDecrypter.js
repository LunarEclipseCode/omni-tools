import React, { Component } from "react";
import { CopyIcon, ClearIcon, SaveIcon } from "../others/Icons";
import { CustomScrollbar } from "../others/CustomScrollbar";

class AesEncrypterDecrypter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isEncrypting: true,
      encryptionPassword: "",
      encryptionInput: "",
      encryptionOutput: "",
      encryptionError: null,
      showPassword: false,
    };
  }

  async encrypt(text, password) {
    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(text);
      const salt = crypto.getRandomValues(new Uint8Array(16));
      const iv = crypto.getRandomValues(new Uint8Array(12));
      const keyMaterial = await crypto.subtle.importKey("raw", encoder.encode(password), { name: "PBKDF2" }, false, ["deriveKey"]);
      const key = await crypto.subtle.deriveKey(
        {
          name: "PBKDF2",
          salt: salt,
          iterations: 100000,
          hash: "SHA-256",
        },
        keyMaterial,
        { name: "AES-GCM", length: 256 },
        false,
        ["encrypt", "decrypt"]
      );
      const encrypted = await crypto.subtle.encrypt({ name: "AES-GCM", iv: iv }, key, data);
      const encryptedData = new Uint8Array(encrypted);
      const result = new Uint8Array(salt.length + iv.length + encryptedData.length);
      result.set(salt);
      result.set(iv, salt.length);
      result.set(encryptedData, salt.length + iv.length);
      return btoa(String.fromCharCode(...result));
    } catch (error) {
      throw new Error("Encryption failed.");
    }
  }

  async decrypt(encryptedText, password) {
    try {
      const decodedData = Uint8Array.from(atob(encryptedText), (c) => c.charCodeAt(0));
      const salt = decodedData.slice(0, 16);
      const iv = decodedData.slice(16, 28);
      const data = decodedData.slice(28);
      const keyMaterial = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), { name: "PBKDF2" }, false, ["deriveKey"]);
      const key = await crypto.subtle.deriveKey(
        {
          name: "PBKDF2",
          salt: salt,
          iterations: 100000,
          hash: "SHA-256",
        },
        keyMaterial,
        { name: "AES-GCM", length: 256 },
        false,
        ["encrypt", "decrypt"]
      );
      const decrypted = await crypto.subtle.decrypt({ name: "AES-GCM", iv: iv }, key, data);
      return new TextDecoder().decode(decrypted);
    } catch (error) {
      throw new Error("Decryption failed.");
    }
  }

  handleEncryptionInputChange = async (e) => {
    const encryptionInput = e.target.value;
    this.setState({ encryptionInput });

    if (this.state.encryptionPassword.trim() === "") {
      this.setState({ encryptionOutput: "", encryptionError: "Password is required" });
      return;
    }

    try {
      let encryptionOutput = "";
      const { encryptionPassword, isEncrypting } = this.state;

      if (isEncrypting && encryptionInput) {
        encryptionOutput = await this.encrypt(encryptionInput, encryptionPassword);
      } else if (!isEncrypting) {
        encryptionOutput = await this.decrypt(encryptionInput, encryptionPassword);
      }

      this.setState({ encryptionOutput, encryptionError: null });
    } catch (error) {
      this.setState({ encryptionOutput: "", encryptionError: "Invalid input or password" });
    }
  };

  clearEncryptionInput = () => {
    this.setState({ encryptionInput: "", encryptionOutput: "", encryptionError: null });
  };

  handlePasswordChange = (e) => {
    this.setState({ encryptionPassword: e.target.value }, () => {
      this.handleEncryptionInputChange({ target: { value: this.state.encryptionInput } });
    });
  };

  toggleEncryptionMode = () => {
    this.setState((prevState) => {
      const shouldReset = prevState.encryptionError !== null && !prevState.isEncrypting;
      return {
        isEncrypting: !prevState.isEncrypting,
        encryptionInput: shouldReset ? "" : prevState.encryptionOutput,
        encryptionOutput: shouldReset ? "" : prevState.encryptionInput,
        encryptionPassword: shouldReset ? "" : prevState.encryptionPassword,
        encryptionError: shouldReset ? null : prevState.encryptionError,
      };
    });
  };

  toggleShowPassword = () => {
    this.setState((prevState) => ({ showPassword: !prevState.showPassword }));
  };

  genPassword = () => {
    const length = 16;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+<>?{}[]";
    let password = "";
    for (let i = 0, n = charset.length; i < length; ++i) {
      password += charset.charAt(Math.floor(Math.random() * n));
    }
    this.setState({ encryptionPassword: password }, () => {
      this.handleEncryptionInputChange({ target: { value: this.state.encryptionInput } });
    });
  };

  saveOutputAsText = () => {
    const { encryptionOutput, isEncrypting } = this.state;
    const element = document.createElement("a");
    const file = new Blob([encryptionOutput], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    const fileName = isEncrypting ? "encrypted.txt" : "decrypted.txt";
    element.download = fileName;
    document.body.appendChild(element); // Required for Firefox
    element.click();
    document.body.removeChild(element);
  };
  
  render() {
    const { encryptionInput, encryptionOutput, encryptionError, isEncrypting, encryptionPassword, showPassword } = this.state;

    return (
      <main className="overflow-y-auto p-4 md:p-6 lg:p-8 xl:p-10 md:pt-4 lg:pt-5 xl:pt-5 h-full">
        <CustomScrollbar />
        <section className="flex flex-col gap-6 h-full">
          <h1 className="text-3xl text-white font-semibold">AES256-GCM Encrypter/Decrypter</h1>
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
                        aria-checked={isEncrypting}
                        onClick={this.toggleEncryptionMode}
                        className={`group inline-flex h-6 w-12 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 ease-in-out ${isEncrypting ? "bg-blue-600" : "bg-gray-600"}`}
                      >
                        <span className={`pointer-events-none block h-4 w-4 rounded-full bg-white shadow-lg transform transition-transform duration-200 ease-in-out ${isEncrypting ? "translate-x-7" : "translate-x-1"}`}></span>
                      </button>
                      <label className="leading-none cursor-pointer pr-3 text-white">{isEncrypting ? "Encrypt" : "Decrypt"}</label>
                    </div>
                  </div>
                </div>
              </li>
              <li>
                <div className="flex flex-col gap-4">
                  <div className="flex flex-row items-center gap-4 justify-end">
                    <label htmlFor="password" className="text-white">
                      Password:
                    </label>
                    <div className="flex items-center flex-grow bg-gray-800 px-4 py-2 rounded-lg text-white outline-none border-2 border-gray-600 focus-within:border-blue-400">
                      <input type={showPassword ? "text" : "password"} id="password" className="flex-grow bg-transparent outline-none text-left" value={encryptionPassword} onChange={this.handlePasswordChange} placeholder="" />
                      <button onClick={this.toggleShowPassword} className="text-gray-400 hover:text-white transition-colors">
                        {showPassword ? (
                          <svg width="20" height="20" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
                            <path
                              d="M876.8 156.8c0-9.6-3.2-16-9.6-22.4-6.4-6.4-12.8-9.6-22.4-9.6-9.6 0-16 3.2-22.4 9.6L736 220.8c-64-32-137.6-51.2-224-60.8-160 16-288 73.6-377.6 176C44.8 438.4 0 496 0 512s48 73.6 134.4 176c22.4 25.6 44.8 48 73.6 67.2l-86.4 89.6c-6.4 6.4-9.6 12.8-9.6 22.4 0 9.6 3.2 16 9.6 22.4 6.4 6.4 12.8 9.6 22.4 9.6 9.6 0 16-3.2 22.4-9.6l704-710.4c3.2-6.4 6.4-12.8 6.4-22.4Zm-646.4 528c-76.8-70.4-128-128-153.6-172.8 28.8-48 80-105.6 153.6-172.8C304 272 400 230.4 512 224c64 3.2 124.8 19.2 176 44.8l-54.4 54.4C598.4 300.8 560 288 512 288c-64 0-115.2 22.4-160 64s-64 96-64 160c0 48 12.8 89.6 35.2 124.8L256 707.2c-9.6-6.4-19.2-16-25.6-22.4Zm140.8-96c-12.8-22.4-19.2-48-19.2-76.8 0-44.8 16-83.2 48-112 32-28.8 67.2-48 112-48 28.8 0 54.4 6.4 73.6 19.2L371.2 588.8ZM889.599 336c-12.8-16-28.8-28.8-41.6-41.6l-48 48c73.6 67.2 124.8 124.8 150.4 169.6-28.8 48-80 105.6-153.6 172.8-73.6 67.2-172.8 108.8-284.8 115.2-51.2-3.2-99.2-12.8-140.8-28.8l-48 48c57.6 22.4 118.4 38.4 188.8 44.8 160-16 288-73.6 377.6-176C979.199 585.6 1024 528 1024 512s-48.001-73.6-134.401-176Z"
                              fill="currentColor"
                            />
                            <path
                              d="M511.998 672c-12.8 0-25.6-3.2-38.4-6.4l-51.2 51.2c28.8 12.8 57.6 19.2 89.6 19.2 64 0 115.2-22.4 160-64 41.6-41.6 64-96 64-160 0-32-6.4-64-19.2-89.6l-51.2 51.2c3.2 12.8 6.4 25.6 6.4 38.4 0 44.8-16 83.2-48 112-32 28.8-67.2 48-112 48Z"
                              fill="currentColor"
                            />
                          </svg>
                        ) : (
                          <svg width="20" height="20" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
                            <path
                              fill="currentColor"
                              d="M512 160c320 0 512 352 512 352S832 864 512 864 0 512 0 512s192-352 512-352zm0 64c-225.28 0-384.128 208.064-436.8 288 52.608 79.872 211.456 288 436.8 288 225.28 0 384.128-208.064 436.8-288-52.608-79.872-211.456-288-436.8-288zm0 64a224 224 0 1 1 0 448 224 224 0 0 1 0-448zm0 64a160.192 160.192 0 0 0-160 160c0 88.192 71.744 160 160 160s160-71.808 160-160-71.744-160-160-160z"
                            />
                          </svg>
                        )}
                      </button>
                      <button onClick={this.genPassword} className="ml-3 text-gray-400 hover:text-white transition-colors">
                        <svg fill="currentColor" width="20" height="20" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg">
                          <title>lightbulb-on</title>
                          <path d="M20 24.75h-8c-0.69 0-1.25 0.56-1.25 1.25v2c0 0 0 0 0 0 0 0.345 0.14 0.658 0.366 0.885l2 2c0.226 0.226 0.538 0.365 0.883 0.365 0 0 0.001 0 0.001 0h4c0 0 0.001 0 0.002 0 0.345 0 0.657-0.14 0.883-0.365l2-2c0.226-0.226 0.365-0.538 0.365-0.883 0-0.001 0-0.001 0-0.002v0-2c-0.001-0.69-0.56-1.249-1.25-1.25h-0zM18.75 27.482l-1.268 1.268h-2.965l-1.268-1.268v-0.232h5.5zM27.125 12.558c0.003-0.098 0.005-0.214 0.005-0.329 0-2.184-0.654-4.216-1.778-5.91l0.025 0.040c-1.919-3.252-5.328-5.447-9.263-5.644l-0.027-0.001h-0.071c-3.934 0.165-7.338 2.292-9.274 5.423l-0.028 0.049c-1.17 1.687-1.869 3.777-1.869 6.031 0 0.012 0 0.025 0 0.037v-0.002c0.184 2.294 0.923 4.383 2.081 6.176l-0.032-0.052c0.322 0.555 0.664 1.102 1.006 1.646 0.671 0.991 1.314 2.13 1.862 3.322l0.062 0.151c0.194 0.455 0.637 0.768 1.153 0.768 0 0 0.001 0 0.001 0h-0c0.173-0 0.338-0.035 0.489-0.099l-0.008 0.003c0.455-0.194 0.768-0.638 0.768-1.155 0-0.174-0.036-0.34-0.1-0.49l0.003 0.008c-0.669-1.481-1.374-2.739-2.173-3.929l0.060 0.095c-0.327-0.523-0.654-1.044-0.962-1.575-0.939-1.397-1.557-3.083-1.71-4.901l-0.003-0.038c0.019-1.735 0.565-3.338 1.485-4.662l-0.018 0.027c1.512-2.491 4.147-4.17 7.185-4.332l0.022-0.001h0.052c3.071 0.212 5.697 1.934 7.162 4.423l0.023 0.042c0.864 1.293 1.378 2.883 1.378 4.593 0 0.053-0 0.107-0.002 0.16l0-0.008c-0.22 1.839-0.854 3.496-1.807 4.922l0.026-0.041c-0.287 0.487-0.588 0.968-0.889 1.446-0.716 1.066-1.414 2.298-2.020 3.581l-0.074 0.175c-0.067 0.148-0.106 0.321-0.106 0.503 0 0.69 0.56 1.25 1.25 1.25 0.512 0 0.952-0.308 1.146-0.749l0.003-0.008c0.625-1.33 1.264-2.452 1.978-3.52l-0.060 0.096c0.313-0.498 0.625-0.998 0.924-1.502 1.131-1.708 1.891-3.756 2.12-5.961l0.005-0.058zM15.139 5.687c-0.199-0.438-0.633-0.737-1.136-0.737-0.188 0-0.365 0.041-0.525 0.116l0.008-0.003c-2.463 1.415-4.215 3.829-4.711 6.675l-0.008 0.057c-0.011 0.061-0.017 0.132-0.017 0.204 0 0.617 0.447 1.129 1.035 1.231l0.007 0.001c0.063 0.011 0.135 0.018 0.209 0.018h0c0.615-0.001 1.126-0.446 1.23-1.031l0.001-0.008c0.366-2.067 1.575-3.797 3.252-4.852l0.030-0.017c0.437-0.2 0.735-0.634 0.735-1.138 0-0.187-0.041-0.364-0.115-0.523l0.003 0.008zM1.441 3.118l4 2c0.16 0.079 0.348 0.126 0.546 0.126 0.69 0 1.25-0.56 1.25-1.25 0-0.482-0.273-0.9-0.672-1.109l-0.007-0.003-4-2c-0.16-0.079-0.348-0.126-0.546-0.126-0.69 0-1.25 0.56-1.25 1.25 0 0.482 0.273 0.9 0.672 1.109l0.007 0.003zM26 5.25c0.001 0 0.001 0 0.002 0 0.203 0 0.395-0.049 0.564-0.135l-0.007 0.003 4-2c0.407-0.212 0.679-0.63 0.679-1.112 0-0.69-0.56-1.25-1.25-1.25-0.199 0-0.387 0.046-0.554 0.129l0.007-0.003-4 2c-0.413 0.21-0.69 0.631-0.69 1.118 0 0.69 0.559 1.25 1.249 1.25h0zM30.559 20.883l-4-2c-0.163-0.083-0.355-0.132-0.559-0.132-0.69 0-1.249 0.559-1.249 1.249 0 0.486 0.278 0.908 0.683 1.114l0.007 0.003 4 2c0.163 0.083 0.355 0.132 0.559 0.132 0.69 0 1.249-0.559 1.249-1.249 0-0.486-0.278-0.908-0.683-1.114l-0.007-0.003zM5.561 18.867l-3.913 1.83c-0.428 0.205-0.718 0.634-0.718 1.131 0 0.691 0.56 1.25 1.25 1.25 0.191 0 0.372-0.043 0.534-0.119l-0.008 0.003 3.913-1.83c0.428-0.205 0.718-0.634 0.718-1.131 0-0.691-0.56-1.25-1.25-1.25-0.191 0-0.372 0.043-0.534 0.119l0.008-0.003zM2 13.25h1c0.69 0 1.25-0.56 1.25-1.25s-0.56-1.25-1.25-1.25v0h-1c-0.69 0-1.25 0.56-1.25 1.25s0.56 1.25 1.25 1.25v0zM30 10.75h-1c-0.69 0-1.25 0.56-1.25 1.25s0.56 1.25 1.25 1.25v0h1c0.69 0 1.25-0.56 1.25-1.25s-0.56-1.25-1.25-1.25v0z"></path>
                        </svg>
                      </button>
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
                  {/* <button className="text-gray-400 hover:text-white transition-colors p-2" onClick={() => this.copyToClipboard(encryptionInput)}>
                    <CopyIcon />
                  </button> */}
                  {/* <button className="text-gray-400 hover:text-white transition-colors p-2" onClick={() => this.pasteFromClipboard(this.handleEncryptionInputChange)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-clipboard">
                      <path d="M16 4h-2a2 2 0 0 0-4 0H8a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"></path>
                      <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
                    </svg>
                  </button> */}
                  <button className="text-gray-400 hover:text-white transition-colors p-2" onClick={this.clearEncryptionInput}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </div>
              </div>
              <textarea
                className="flex-1 h-full border-2 rounded-lg border-gray-600 bg-gray-800 px-4 py-2 text-gray-300 outline-none placeholder-gray-500 hover:bg-[#2b3544] focus:border-blue-400 focus:bg-[#2b3544] font-mono custom-scrollbar"
                placeholder={isEncrypting ? "Enter text to encrypt" : "Enter text to decrypt"}
                value={encryptionInput}
                onChange={this.handleEncryptionInputChange}
              />
            </div>
            <div className="flex-1 flex flex-col h-full">
              <div className="flex justify-between items-center">
                <h2 className="text-lg text-gray-300">Output</h2>
                <div className="flex items-center">
                <button
                    className="text-gray-400 hover:text-white transition-colors p-2"
                    onClick={this.saveOutputAsText}
                  >
                    <SaveIcon />
                  </button>
                  <button className="text-gray-400 hover:text-white transition-colors p-2" onClick={() => this.copyToClipboard(encryptionOutput)}>
                    <CopyIcon />
                  </button>
                  {/* <button className="text-gray-400 hover:text-white transition-colors p-2" onClick={() => this.pasteFromClipboard(this.handleEncryptionInputChange)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-clipboard">
                      <path d="M16 4h-2a2 2 0 0 0-4 0H8a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"></path>
                      <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
                    </svg>
                  </button> */}
                  {/* <button className="text-gray-400 hover:text-white transition-colors p-2" onClick={this.clearEncryptionInput}>
                    <ClearIcon />
                  </button> */}
                </div>
              </div>
              <textarea
                className={`flex-1 h-full border-2 rounded-lg ${
                  encryptionError ? "border-red-600" : "border-gray-600"
                } bg-gray-800 px-4 py-2 text-gray-300 outline-none placeholder-gray-500 hover:bg-[#2b3544] focus:border-blue-400 focus:bg-[#2b3544] font-mono custom-scrollbar`}
                placeholder={encryptionError || (isEncrypting && !encryptionInput && encryptionPassword ? "" : isEncrypting ? "Encrypted output" : "Decrypted output")}
                value={encryptionError || encryptionOutput}
                readOnly
              />
            </div>
          </section>
        </section>
      </main>
    );
  }
}

export default AesEncrypterDecrypter;
