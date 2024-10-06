import React, { Component } from "react";
import { CopyIcon, ClearIcon, SaveIcon } from "../others/Icons"; 
import { CustomScrollbar } from "../others/CustomScrollbar";

class Base64ImageEncoderDecoder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imageInput: "",
      imageOutput: "",
      imageError: null,
      mode: "encode",
      uploadedImage: null,
    };
  }

  copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  handleInputChange = (e) => {
    const imageInput = e.target.value;
    this.setState({ imageInput });

    if (this.state.mode === "decode") {
      try {
        const imgSrc = `data:image/png;base64,${imageInput}`;
        this.setState({ imageOutput: imgSrc, imageError: null });
      } catch (error) {
        this.setState({ imageOutput: "", imageError: "Failed to decode Base64 image" });
      }
    }
  };

  handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result.split(",")[1];
        this.setState({ imageOutput: base64String, imageError: null, uploadedImage: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  saveImageAsFile = () => {
    const { uploadedImage } = this.state;
    if (uploadedImage) {
      const link = document.createElement("a");
      link.href = uploadedImage;
      link.download = "image.png";
      link.click();
    }
  };

  clearInput = () => {
    this.setState({ imageInput: "", imageOutput: "", imageError: null, uploadedImage: null });
  };

  toggleMode = () => {
    this.setState((prevState) => ({
      mode: prevState.mode === "encode" ? "decode" : "encode",
      imageInput: "",
      imageOutput: "",
      imageError: null,
      uploadedImage: null,
    }));
  };

  render() {
    const { imageOutput, imageInput, imageError, mode, uploadedImage } = this.state;
    return (
      <main className="overflow-y-auto p-4 md:p-6 lg:p-8 xl:p-10 md:pt-4 lg:pt-5 xl:pt-5 h-full">
        <CustomScrollbar />
        <section className="flex flex-col gap-6 h-full">
          <h1 className="text-3xl text-white font-semibold">Base64 Image Encoder/Decoder</h1>
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
                        aria-checked={mode === "encode"}
                        onClick={this.toggleMode}
                        className={`group inline-flex h-6 w-12 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 ease-in-out ${mode === "encode" ? "bg-blue-600" : "bg-gray-600"}`}
                      >
                        <span
                          className={`pointer-events-none block h-4 w-4 rounded-full bg-white shadow-lg transform transition-transform duration-200 ease-in-out ${
                            mode === "encode" ? "translate-x-7" : "translate-x-1"
                          }`}
                        ></span>
                      </button>
                      <label className="leading-none cursor-pointer pr-3 text-white">
                        {mode === "encode" ? "Encoder" : "Decoder"}
                      </label>
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
                  <button className="text-gray-400 hover:text-white transition-colors p-2" onClick={this.clearInput}>
                    <ClearIcon />
                  </button>
                </div>
              </div>
              {mode === "encode" && !uploadedImage && (
                <label className="flex items-center justify-center flex-1 h-full border-2 rounded-lg border-gray-600 bg-gray-800 text-gray-400 hover:text-white cursor-pointer">
                  <input type="file" accept="image/*" onChange={this.handleImageUpload} className="hidden" />
                  Click to upload an image
                </label>
              )}
              {mode === "encode" && uploadedImage && (
                <div className="flex items-center justify-center flex-1 h-full border-2 rounded-lg border-gray-600 bg-gray-800">
                  <img src={uploadedImage} alt="Uploaded Image" className="min-w-1/2 min-h-1/2 max-w-[95%] max-h-[95%]" />
                </div>
              )}
              {mode === "decode" && (
                <textarea
                  className="flex-1 h-full border-2 rounded-lg border-gray-600 bg-gray-800 px-4 py-2 text-gray-300 outline-none placeholder-gray-500 hover:bg-[#2b3544] focus:border-blue-400 focus:bg-[#2b3544] font-mono custom-scrollbar"
                  placeholder="Paste Base64 string here"
                  value={imageInput}
                  onChange={this.handleInputChange}
                />
              )}
            </div>
            <div className="flex-1 flex flex-col h-full">
              <div className="flex justify-between items-center">
                <h2 className="text-lg text-gray-300">Output</h2>
                <div className="flex items-center">
                  {mode === "encode" && imageOutput && (
                    <button className="text-gray-400 hover:text-white transition-colors p-2" onClick={this.saveImageAsFile}>
                      <SaveIcon />
                    </button>
                  )}
                  <button className="text-gray-400 hover:text-white transition-colors p-2" onClick={() => this.copyToClipboard(imageOutput)}>
                    <CopyIcon />
                  </button>
                </div>
              </div>
              {mode === "encode" ? (
                imageOutput ? (
                  <div className="flex items-center justify-center flex-1">
                    <textarea
                      readOnly
                      className="flex-1 h-full border-2 rounded-lg border-gray-600 bg-gray-800 px-4 py-2 text-gray-300 outline-none placeholder-gray-500 hover:bg-[#2b3544] focus:border-blue-400 focus:bg-[#2b3544] font-mono custom-scrollbar"
                      value={imageOutput}
                    />
                  </div>
                ) : (
                  <div className="flex-1 h-full border-2 rounded-lg border-gray-600 bg-gray-800 px-4 py-2 text-gray-300 outline-none placeholder-gray-500 hover:bg-[#2b3544] focus:border-blue-400 focus:bg-[#2b3544] font-mono custom-scrollbar"></div>
                )
              ) : (
                <div
                  className={`flex-1 h-full border-2 rounded-lg px-4 py-2 text-gray-300 outline-none placeholder-gray-500 hover:bg-[#2b3544] focus:border-blue-400 focus:bg-[#2b3544] font-mono custom-scrollbar ${
                    imageError ? "border-red-500 bg-red-500/10" : "border-gray-600 bg-gray-800"
                  }`}
                >
                  {imageError ? imageError : <img src={imageOutput} alt="Decoded Image" className="min-w-1/2 min-h-1/2 max-w-[95%] max-h-[95%]" />}
                </div>
              )}
            </div>
          </section>
        </section>
      </main>
    );
  }
}
export default Base64ImageEncoderDecoder;
