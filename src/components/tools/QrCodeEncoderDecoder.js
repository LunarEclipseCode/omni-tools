import React, { Component } from "react";
import { CopyIcon, ClearIcon, SaveIcon } from "../others/Icons"; 
import { CustomScrollbar } from "../others/CustomScrollbar";
import QRCode from "qrcode";
import jsQR from "jsqr";

class QrCodeEncoderDecoder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      qrInput: "",
      qrOutput: "",
      qrError: null,
      qrMode: "encode",
      qrCanvas: null,
      uploadedImage: null,
    };
  }

  copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  handleQrInputChange = (e) => {
    const qrInput = e.target.value;
    this.setState({ qrInput });

    if (this.state.qrMode === "encode") {
      QRCode.toDataURL(qrInput, { width: 400, height: 400, margin: 2 })
        .then((url) => {
          this.setState({ qrOutput: url, qrError: null });
        })
        .catch((error) => {
          this.setState({ qrOutput: "", qrError: "Failed to generate QR Code" });
        });
    }
  };

  handleQrImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.src = reader.result;
        this.setState({ uploadedImage: img.src });
        img.onload = () => {
          const canvas = this.state.qrCanvas;
          const context = canvas.getContext("2d");
          context.drawImage(img, 0, 0, canvas.width, canvas.height);
          const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, canvas.width, canvas.height);
          if (code) {
            this.setState({ qrOutput: code.data, qrError: null });
          } else {
            this.setState({ qrOutput: "", qrError: "Failed to decode QR Code" });
          }
        };
      };
      reader.readAsDataURL(file);
    }
  };

  saveQrAsJpg = () => {
    const { qrOutput } = this.state;
    if (qrOutput) {
      const link = document.createElement("a");
      link.href = qrOutput;
      link.download = "qrcode.jpg";
      link.click();
    }
  };

  clearQrInput = () => {
    this.setState({ qrInput: "", qrOutput: "", qrError: null, uploadedImage: null });
  };

  toggleQrMode = () => {
    this.setState((prevState) => ({
      qrMode: prevState.qrMode === "encode" ? "decode" : "encode",
      qrInput: "",
      qrOutput: "",
      qrError: null,
      uploadedImage: null,
    }));
  };

  render() {
    const { qrOutput, qrInput, qrError, qrMode, uploadedImage } = this.state;
    return (
      <main className="overflow-y-auto p-4 md:p-6 lg:p-8 xl:p-10 md:pt-4 lg:pt-5 xl:pt-5 h-full">
        <CustomScrollbar />
        <section className="flex flex-col gap-6 h-full">
          <h1 className="text-3xl text-white font-semibold">QR Code Encoder/Decoder</h1>
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
                        aria-checked={qrMode === "encode"}
                        onClick={this.toggleQrMode}
                        className={`group inline-flex h-6 w-12 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 ease-in-out ${qrMode === "encode" ? "bg-blue-600" : "bg-gray-600"}`}
                      >
                        <span className={`pointer-events-none block h-4 w-4 rounded-full bg-white shadow-lg transform transition-transform duration-200 ease-in-out ${qrMode === "encode" ? "translate-x-7" : "translate-x-1"}`}></span>
                      </button>
                      <label className="leading-none cursor-pointer pr-3 text-white">{qrMode === "encode" ? "Encoder" : "Decoder"}</label>
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
                  <button className="text-gray-400 hover:text-white transition-colors p-2" onClick={this.clearQrInput}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </div>
              </div>
              <textarea
                className="flex-1 h-full border-2 rounded-lg border-gray-600 bg-gray-800 px-4 py-2 text-gray-300 outline-none placeholder-gray-500 hover:bg-[#2b3544] focus:border-blue-400 focus:bg-[#2b3544] font-mono custom-scrollbar"
                placeholder={qrMode === "encode" ? "Enter text" : ""}
                value={qrInput}
                onChange={this.handleQrInputChange}
                style={{ display: qrMode === "decode" ? "none" : "block" }}
              />

              {qrMode === "decode" && !uploadedImage && (
                <label className="flex items-center justify-center flex-1 h-full border-2 rounded-lg border-gray-600 bg-gray-800 text-gray-400 hover:text-white cursor-pointer">
                  <input type="file" accept="image/png, image/jpeg, image/webp" onChange={this.handleQrImageUpload} className="hidden" />
                  Click to upload a QR code image
                </label>
              )}
              {qrMode === "decode" && uploadedImage && (
                <div className="flex items-center justify-center flex-1 h-full border-2 rounded-lg border-gray-600 bg-gray-800">
                  <img src={uploadedImage} alt="Uploaded QR" className="min-w-1/2 min-h-1/2 max-w-[95%] max-h-[95%]" />
                </div>
              )}
            </div>
            <div className="flex-1 flex flex-col h-full">
              <div className="flex justify-between items-center">
                <h2 className="text-lg text-gray-300">Output</h2>
                <div className="flex items-center">
                  {qrMode === "encode" && qrOutput && (
                    <button className="text-gray-400 hover:text-white transition-colors p-2" onClick={this.saveQrAsJpg}>
                      <SaveIcon />
                    </button>
                  )}
                  <button className="text-gray-400 hover:text-white transition-colors p-2" onClick={() => this.copyToClipboard(qrOutput)}>
                    <CopyIcon />
                  </button>
                </div>
              </div>
              {qrMode === "encode" ? (
                qrOutput ? (
                  <div className="flex items-center justify-center flex-1">
                    <img src={qrOutput} alt="QR Code" className="min-w-1/2 min-h-1/2 max-w-[95%] max-h-[95%] rounded-lg border-2 border-gray-600" />
                  </div>
                ) : (
                  <div className="flex-1 h-full border-2 rounded-lg border-gray-600 bg-gray-800 px-4 py-2 text-gray-300 outline-none placeholder-gray-500 hover:bg-[#2b3544] focus:border-blue-400 focus:bg-[#2b3544] font-mono custom-scrollbar"></div>
                )
              ) : (
                <div
                  className={`flex-1 h-full border-2 rounded-lg px-4 py-2 text-gray-300 outline-none placeholder-gray-500 hover:bg-[#2b3544] focus:border-blue-400 focus:bg-[#2b3544] font-mono custom-scrollbar ${
                    qrError ? "border-red-500 bg-red-500/10" : "border-gray-600 bg-gray-800"
                  }`}
                >
                  {qrError ? qrError : qrOutput}
                </div>
              )}
            </div>
            {qrMode === "decode" && <canvas ref={(canvas) => (this.state.qrCanvas = canvas)} className="hidden" />}
          </section>
        </section>
      </main>
    );
  }
}
export default QrCodeEncoderDecoder;
