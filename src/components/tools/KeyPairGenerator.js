import React, { Component } from "react";
import { CopyIcon, ClearIcon, SaveIcon } from "../others/Icons";
import { CustomScrollbar } from "../others/CustomScrollbar";

class KeyPairGenerator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      algorithmType: "RSA",
      keySize: 2048,
      publicKeyPEM: "",
      privateKeyPEM: "",
      errorMessage: "",
    };
  }

  handleAlgorithmChange = (event) => {
    const algorithmType = event.target.value;
    let keySize;
    if (algorithmType === "RSA") {
      keySize = 2048; // Default RSA key size
    } else if (algorithmType === "ECDSA") {
      keySize = "P-256"; // Default ECDSA curve
    }
    this.setState({ algorithmType, keySize });
  };

  handleKeySizeChange = (event) => {
    const keySize = event.target.value;
    this.setState({ keySize });
  };

  generateKeyPair = async () => {
    const { algorithmType, keySize } = this.state;
    try {
      let keyPair;
      if (algorithmType === "RSA") {
        const modulusLength = parseInt(keySize);
        const algorithm = {
          name: "RSASSA-PKCS1-v1_5",
          modulusLength: modulusLength,
          publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
          hash: "SHA-256",
        };
        keyPair = await window.crypto.subtle.generateKey(algorithm, true, ["sign", "verify"]);
      } else if (algorithmType === "ECDSA") {
        const namedCurve = keySize;
        const algorithm = {
          name: "ECDSA",
          namedCurve: namedCurve,
        };
        keyPair = await window.crypto.subtle.generateKey(algorithm, true, ["sign", "verify"]);
      }

      const publicKey = await window.crypto.subtle.exportKey("spki", keyPair.publicKey);
      const privateKey = await window.crypto.subtle.exportKey("pkcs8", keyPair.privateKey);

      const publicKeyPEM = this.arrayBufferToPem(publicKey, "PUBLIC KEY");
      const privateKeyPEM = this.arrayBufferToPem(privateKey, "PRIVATE KEY");

      this.setState({ publicKeyPEM, privateKeyPEM, errorMessage: "" });
    } catch (error) {
      console.error(error);
      this.setState({ errorMessage: "Error generating key pair." });
    }
  };

  arrayBufferToPem = (buffer, type) => {
    const base64String = window.btoa(String.fromCharCode(...new Uint8Array(buffer)));
    const formattedBase64String = base64String.match(/.{1,64}/g).join("\n");
    return `-----BEGIN ${type}-----\n${formattedBase64String}\n-----END ${type}-----`;
  };

  copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  clearKeys = (keyType) => {
    this.setState({ publicKeyPEM: "", privateKeyPEM: "", errorMessage: "" });
  };

  saveKeyAsFile = (keyText, fileName) => {
    const element = document.createElement("a");
    const file = new Blob([keyText], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = fileName;
    document.body.appendChild(element);
    element.click();
  };

  render() {
    const { algorithmType, keySize, publicKeyPEM, privateKeyPEM, errorMessage } = this.state;

    const rsaKeySizes = [1024, 2048, 4096];
    const ecdsaKeySizes = ["P-256", "P-384", "P-521"];

    const keySizeOptions = algorithmType === "RSA" ? rsaKeySizes : ecdsaKeySizes;

    return (
      <main className="overflow-y-auto p-4 md:p-6 lg:p-8 xl:p-10 md:pt-4 lg:pt-5 xl:pt-5 h-full">
        <CustomScrollbar />
        <style>
          {`
            .button-group {
              display: flex;
              margin-top: 0em;
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
              text-align: left;
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
            .custom-dropdown-icon {
              position: absolute;
              right: 10px;
              top: 50%;
              transform: translateY(-50%);
              pointer-events: none;
            }
          `}
        </style>
        <section className="flex flex-col gap-5 h-full">
          <h1 className="text-3xl text-white font-semibold">Key Pair Generator</h1>
          <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex h-[3.25rem] items-center gap-6 rounded-lg bg-gray-800 px-4">
              <span className="text-white flex-1">Algorithm</span>
              <div className="dropdown-container">
                <select value={algorithmType} onChange={this.handleAlgorithmChange} className="dropdown-select">
                  <option value="RSA">RSA</option>
                  <option value="ECDSA">ECDSA</option>
                </select>
                <svg className="custom-dropdown-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </div>
            </div>

            <div className="flex h-[3.25rem] items-center gap-6 rounded-lg bg-gray-800 px-4">
              <span className="text-white flex-1">Key Size</span>
              <div className="dropdown-container">
                <select value={keySize} onChange={this.handleKeySizeChange} className="dropdown-select">
                  {keySizeOptions.map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
                <svg className="custom-dropdown-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </div>
            </div>
            {errorMessage && <p className="text-red-500 text-base">{errorMessage}</p>}
          </section>

          <section className="flex justify-between items-center">
            <div className="flex items-center">
              <button onClick={this.generateKeyPair} className="bg-blue-600 hover:bg-blue-500 text-white py-2 px-4 rounded-lg text-lg">
                Generate
              </button>
            </div>
          </section>

          <section className="flex flex-col lg:flex-row gap-4 h-full">
            <div className="flex-1 flex flex-col h-full">
              <div className="flex justify-between items-center">
                <h2 className="text-lg text-gray-300">Public Key</h2>
                <div className="flex items-center">
                  <button className="text-gray-400 hover:text-white transition-colors p-2" onClick={() => this.copyToClipboard(publicKeyPEM)}>
                    <CopyIcon />
                  </button>
                  <button className="text-gray-400 hover:text-white transition-colors p-2" onClick={() => this.saveKeyAsFile(publicKeyPEM, "public_key.pem")}>
                    <SaveIcon />
                  </button>
                  <button className="text-gray-400 hover:text-white transition-colors p-2" onClick={() => this.clearKeys("public")}>
                    <ClearIcon />
                  </button>
                </div>
              </div>
              <textarea
                className="flex-1 h-full border-2 rounded-lg border-gray-600 bg-gray-800 px-4 py-2 text-gray-300 outline-none placeholder-gray-500 hover:bg-[#2b3544] focus:border-blue-400 focus:bg-[#2b3544] font-mono custom-scrollbar"
                readOnly
                value={publicKeyPEM}
              />
            </div>

            <div className="flex-1 flex flex-col h-full">
              <div className="flex justify-between items-center">
                <h2 className="text-lg text-gray-300">Private Key</h2>
                <div className="flex items-center">
                  <button className="text-gray-400 hover:text-white transition-colors p-2" onClick={() => this.copyToClipboard(privateKeyPEM)}>
                    <CopyIcon />
                  </button>
                  <button className="text-gray-400 hover:text-white transition-colors p-2" onClick={() => this.saveKeyAsFile(privateKeyPEM, "private_key.pem")}>
                    <SaveIcon />
                  </button>
                  <button className="text-gray-400 hover:text-white transition-colors p-2" onClick={() => this.clearKeys("private")}>
                    <ClearIcon />
                  </button>
                </div>
              </div>
              <textarea
                className="flex-1 h-full border-2 rounded-lg border-gray-600 bg-gray-800 px-4 py-2 text-gray-300 outline-none placeholder-gray-500 hover:bg-[#2b3544] focus:border-blue-400 focus:bg-[#2b3544] font-mono custom-scrollbar"
                readOnly
                value={privateKeyPEM}
              />
            </div>
          </section>
        </section>
      </main>
    );
  }
}

export default KeyPairGenerator;
