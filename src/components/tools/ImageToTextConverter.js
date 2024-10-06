import React, { Component, createRef } from "react";
import Tesseract from "tesseract.js";
import { CopyIcon, ClearIcon, SaveIcon } from "../others/Icons";
import { CustomScrollbar } from "../others/CustomScrollbar";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import JSZip from "jszip";

class ImageToTextConverter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uploadedImages: [],
      rawExtractedTexts: [], // Store raw extracted text for each image
      extractedTexts: [], // Store extracted text (with/without content headers)
      ocrError: null,
      isProcessing: false,
      selectedLanguage: "eng",
      isSingleMode: true, // Toggle for single or batch mode
      showContentHeaders: true, // Toggle for showing "Content from" and separator in batch mode
      showSaveOptions: false, // Toggle for save options dropdown
    };
    this.saveDropdownRef = createRef(); // Reference for dropdown click detection
  }

  componentDidMount() {
    document.addEventListener("mousedown", this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutside);
  }

  handleClickOutside = (event) => {
    // Close the save dropdown if clicked outside of it
    if (this.saveDropdownRef.current && !this.saveDropdownRef.current.contains(event.target)) {
      this.setState({ showSaveOptions: false });
    }
  };

  // Method to handle the OCR process for a single image
  processImageWithOCR = (image, language) => {
    this.setState({ isProcessing: true, ocrError: null });

    Tesseract.recognize(image, language, {})
      .then(({ data: { text } }) => {
        this.setState({ rawExtractedTexts: [text], isProcessing: false }, this.updateDisplayedTexts);
      })
      .catch((error) => {
        this.setState({ ocrError: "Failed to extract text", isProcessing: false });
      });
  };

  processImagesInBatch = (images, language) => {
    this.setState({ isProcessing: true, rawExtractedTexts: [], extractedTexts: [], ocrError: null });
    const rawExtractedTexts = [];

    images.forEach((image, index) => {
      Tesseract.recognize(image, language, {})
        .then(({ data: { text } }) => {
          rawExtractedTexts[index] = text; // Store raw text
          // Update state once all images are processed
          if (rawExtractedTexts.length === images.length) {
            this.setState({ rawExtractedTexts, isProcessing: false }, this.updateDisplayedTexts);
          }
        })
        .catch((error) => {
          this.setState({ ocrError: `Failed to extract text from ${image.name}`, isProcessing: false });
        });
    });
  };

  updateDisplayedTexts = () => {
    const { rawExtractedTexts, uploadedImages, showContentHeaders } = this.state;
    const extractedTexts = rawExtractedTexts.map((text, index) => {
      if (showContentHeaders) {
        return `Content from ${uploadedImages[index].name}:\n${text}\n=====================\n`;
      } else {
        return `${text.trim()}\n`; // Trim any extra newlines and add a single break
      }
    });
    this.setState({ extractedTexts });
  };

  // Handle language change and rerun OCR if an image is already uploaded
  handleLanguageChange = (e) => {
    const newLanguage = e.target.value;
    this.setState({ selectedLanguage: newLanguage });

    if (this.state.uploadedImages.length > 0) {
      if (this.state.isSingleMode) {
        this.processImageWithOCR(this.state.uploadedImages[0], newLanguage);
      } else {
        this.processImagesInBatch(this.state.uploadedImages, newLanguage);
      }
    }
  };

  // Toggle between single and batch modes
  toggleMode = () => {
    this.setState((prevState) => ({
      isSingleMode: !prevState.isSingleMode,
      uploadedImages: [],
      rawExtractedTexts: [],
      extractedTexts: [],
      ocrError: null,
    }));
  };

  // Toggle for showing content headers in batch mode without re-running OCR
  toggleContentHeaders = () => {
    this.setState(
      (prevState) => ({
        showContentHeaders: !prevState.showContentHeaders,
      }),
      this.updateDisplayedTexts
    );
  };

  // Toggle Save options dropdown
  toggleSaveOptions = () => {
    this.setState((prevState) => ({
      showSaveOptions: !prevState.showSaveOptions,
    }));
  };

  copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  saveAsTextFile = () => {
    const blob = new Blob([this.state.extractedTexts.join("")], { type: "text/plain;charset=utf-8" });
    saveAs(blob, "extracted_text.txt");
  };

  saveAsPDF = () => {
    const doc = new jsPDF({
      unit: "in",
      format: "letter",
    });
    const margin = 1;
    const pageHeight = doc.internal.pageSize.height;
    const text = this.state.extractedTexts.join("").split("\n");

    doc.setFont("Times", "normal");
    doc.setFontSize(12.5);

    let y = margin;
    text.forEach((line) => {
      if (y + 0.5 >= pageHeight - margin) {
        doc.addPage();
        y = margin;
      }
      doc.text(line, margin, y);
      y += 0.25;
    });

    doc.save("extracted_text.pdf");
  };

  saveAsSeparateTextFiles = async () => {
    const zip = new JSZip();
    const zipFilename = "extracted_texts.zip";

    this.state.uploadedImages.forEach((image, index) => {
      const fileName = image.name.replace(/\.[^/.]+$/, ""); // Remove extension
      const text = this.state.extractedTexts[index];
      zip.file(`${fileName}_extracted.txt`, text);
    });

    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, zipFilename);
  };

  saveAsSeparatePDFs = async () => {
    const zip = new JSZip();
    const zipFilename = "extracted_pdfs.zip";

    this.state.uploadedImages.forEach((image, index) => {
      const doc = new jsPDF({
        unit: "in",
        format: "letter",
      });
      const margin = 1;
      const pageHeight = doc.internal.pageSize.height;
      const text = this.state.extractedTexts[index].split("\n");

      doc.setFont("Times", "normal");
      doc.setFontSize(12.5);

      let y = margin;
      text.forEach((line) => {
        if (y + 0.5 >= pageHeight - margin) {
          doc.addPage();
          y = margin;
        }
        doc.text(line, margin, y);
        y += 0.25;
      });

      const fileName = image.name.replace(/\.[^/.]+$/, ""); // Remove extension
      const pdfBlob = doc.output("blob");
      zip.file(`${fileName}_extracted.pdf`, pdfBlob);
    });

    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, zipFilename);
  };

  handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    this.setState({ uploadedImages: files });

    if (this.state.isSingleMode && files.length > 0) {
      // Single mode: process first image
      this.processImageWithOCR(files[0], this.state.selectedLanguage);
    } else if (!this.state.isSingleMode && files.length > 0) {
      // Batch mode: process all images
      this.processImagesInBatch(files, this.state.selectedLanguage);
    }
  };

  clearImageInput = () => {
    this.setState({ uploadedImages: [], rawExtractedTexts: [], extractedTexts: [], ocrError: null });
  };

  render() {
    const { uploadedImages, extractedTexts, ocrError, isProcessing, selectedLanguage, isSingleMode, showSaveOptions, showContentHeaders } = this.state;

    const languages = [
      { code: "afr", name: "Afrikaans" }, // Afrikaans
      { code: "amh", name: "አማርኛ" }, // Amharic
      { code: "ara", name: "العربية" }, // Arabic
      { code: "asm", name: "অসমীয়া" }, // Assamese
      { code: "aze", name: "Azərbaycan dili" }, // Azerbaijani
      { code: "aze_cyrl", name: "Азəрбайджан" }, // Azerbaijani - Cyrillic
      { code: "bel", name: "Беларуская" }, // Belarusian
      { code: "ben", name: "বাংলা" }, // Bengali
      { code: "bod", name: "བོད་ཡིག" }, // Tibetan
      { code: "bos", name: "Bosanski" }, // Bosnian
      { code: "bul", name: "български" }, // Bulgarian
      { code: "cat", name: "Català" }, // Catalan
      { code: "ceb", name: "Cebuano" }, // Cebuano
      { code: "ces", name: "čeština" }, // Czech
      { code: "chi_sim", name: "简体中文" }, // Chinese - Simplified
      { code: "chi_tra", name: "繁體中文" }, // Chinese - Traditional
      { code: "chr", name: "ᏣᎳᎩ" }, // Cherokee
      { code: "cym", name: "Cymraeg" }, // Welsh
      { code: "dan", name: "Dansk" }, // Danish
      { code: "deu", name: "Deutsch" }, // German
      { code: "dzo", name: "རྫོང་ཁ" }, // Dzongkha
      { code: "ell", name: "Ελληνικά" }, // Greek
      { code: "eng", name: "English" }, // English
      { code: "epo", name: "Esperanto" }, // Esperanto
      { code: "est", name: "Eesti" }, // Estonian
      { code: "eus", name: "Euskara" }, // Basque
      { code: "fas", name: "فارسی" }, // Persian
      { code: "fin", name: "Suomi" }, // Finnish
      { code: "fra", name: "Français" }, // French
      { code: "gle", name: "Gaeilge" }, // Irish
      { code: "glg", name: "Galego" }, // Galician
      { code: "guj", name: "ગુજરાતી" }, // Gujarati
      { code: "hat", name: "Kreyòl ayisyen" }, // Haitian
      { code: "heb", name: "עברית" }, // Hebrew
      { code: "hin", name: "हिंदी" }, // Hindi
      { code: "hrv", name: "Hrvatski" }, // Croatian
      { code: "hun", name: "Magyar" }, // Hungarian
      { code: "isl", name: "Íslenska" }, // Icelandic
      { code: "ita", name: "Italiano" }, // Italian
      { code: "jpn", name: "日本語" }, // Japanese
      { code: "kan", name: "ಕನ್ನಡ" }, // Kannada
      { code: "kat", name: "ქართული" }, // Georgian
      { code: "kaz", name: "Қазақ тілі" }, // Kazakh
      { code: "khm", name: "ភាសាខ្មែរ" }, // Central Khmer
      { code: "kor", name: "한국어" }, // Korean
      { code: "kur", name: "Kurdî" }, // Kurdish
      { code: "lao", name: "ລາວ" }, // Lao
      { code: "lat", name: "Latina" }, // Latin
      { code: "lav", name: "Latviešu" }, // Latvian
      { code: "lit", name: "Lietuvių" }, // Lithuanian
      { code: "mal", name: "മലയാളം" }, // Malayalam
      { code: "mar", name: "मराठी" }, // Marathi
      { code: "mkd", name: "Македонски" }, // Macedonian
      { code: "mlt", name: "Malti" }, // Maltese
      { code: "msa", name: "Bahasa Melayu" }, // Malay
      { code: "mya", name: "မြန်မာဘာသာ" }, // Burmese
      { code: "nep", name: "नेपाली" }, // Nepali
      { code: "nld", name: "Nederlands" }, // Dutch
      { code: "nor", name: "Norsk" }, // Norwegian
      { code: "pan", name: "ਪੰਜਾਬੀ" }, // Punjabi
      { code: "pol", name: "Polski" }, // Polish
      { code: "por", name: "Português" }, // Portuguese
      { code: "ron", name: "Română" }, // Romanian
      { code: "rus", name: "Русский" }, // Russian
      { code: "san", name: "संस्कृतम्" }, // Sanskrit
      { code: "sin", name: "සිංහල" }, // Sinhalese
      { code: "slk", name: "Slovenčina" }, // Slovak
      { code: "slv", name: "Slovenščina" }, // Slovenian
      { code: "spa", name: "Español" }, // Spanish
      { code: "sqi", name: "Shqip" }, // Albanian
      { code: "srp", name: "Српски" }, // Serbian
      { code: "swa", name: "Kiswahili" }, // Swahili
      { code: "swe", name: "Svenska" }, // Swedish
      { code: "tam", name: "தமிழ்" }, // Tamil
      { code: "tel", name: "తెలుగు" }, // Telugu
      { code: "tha", name: "ไทย" }, // Thai
      { code: "tur", name: "Türkçe" }, // Turkish
      { code: "uig", name: "ئۇيغۇرچە" }, // Uighur
      { code: "ukr", name: "Українська" }, // Ukrainian
      { code: "urd", name: "اردو" }, // Urdu
      { code: "vie", name: "Tiếng Việt" }, // Vietnamese
      { code: "yid", name: "ייִדיש" }, // Yiddish
    ];
    

    return (
      <main className="overflow-y-auto p-4 md:p-6 lg:p-8 xl:p-10 md:pt-4 lg:pt-5 xl:pt-5 h-full">
        <CustomScrollbar />
        <section className="flex flex-col gap-6 h-full">
          <h1 className="text-3xl text-white font-semibold">Image to Text Converter</h1>

          {/* Layout for Single and Batch Mode Settings */}
          <div className={`flex flex-col gap-4`}>
            <div className={`flex flex-col gap-4 lg:${isSingleMode ? "grid-cols-1" : "grid-cols-2"} lg:grid`}>
              <div className="flex h-12 items-center gap-6 rounded-lg bg-gray-700 px-4 justify-between">
                <span className="text-white">Mode:</span>
                <div className="flex items-center">
                  <label className="leading-none cursor-pointer pr-3 text-white">{isSingleMode ? "Single Image" : "Batch Images"}</label>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={isSingleMode}
                    onClick={this.toggleMode}
                    className={`group inline-flex h-6 w-12 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 ease-in-out ${isSingleMode ? "bg-blue-600" : "bg-gray-600"}`}
                  >
                    <span className={`pointer-events-none block h-4 w-4 rounded-full bg-white shadow-lg transform transition-transform duration-200 ease-in-out ${isSingleMode ? "translate-x-7" : "translate-x-1"}`}></span>
                  </button>
                </div>
              </div>

              {!isSingleMode && (
                <div className="flex h-12 items-center gap-6 rounded-lg bg-gray-700 px-4 justify-between">
                  <span className="text-white">Show Content Headers:</span>
                  <div className="flex items-center">
                    <label className="leading-none cursor-pointer pr-3 text-white">{showContentHeaders ? "Enabled" : "Disabled"}</label>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={showContentHeaders}
                      onClick={this.toggleContentHeaders}
                      className={`group inline-flex h-6 w-12 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 ease-in-out ${showContentHeaders ? "bg-blue-600" : "bg-gray-600"}`}
                    >
                      <span className={`pointer-events-none block h-4 w-4 rounded-full bg-white shadow-lg transform transition-transform duration-200 ease-in-out ${showContentHeaders ? "translate-x-7" : "translate-x-1"}`}></span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="flex h-12 items-center gap-6 rounded-lg bg-gray-800 px-4">
              <style>
                {`
                  .custom-scrollbar::-webkit-scrollbar {
                    width: 0.6em;
                  }

                  .custom-scrollbar::-webkit-scrollbar-track {
                    background-color: #1f2937;
                  }

                  .custom-scrollbar::-webkit-scrollbar-thumb {
                    background-color: #374151;
                    border-radius: 0.5em;
                  }
              `}
              </style>

              <label className="text-white">Select Language:</label>
              <select value={selectedLanguage} onChange={this.handleLanguageChange} className="bg-gray-700 text-white rounded-md p-2 pl-3 focus:outline-none focus:ring-2 focus:ring-blue-400 custom-scrollbar">
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code} className="bg-gray-800">
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <section className="flex flex-col lg:flex-row gap-4 h-full">
            <div className="flex-1 flex flex-col h-full">
              <div className="flex justify-between items-center">
                <h2 className="text-lg text-gray-300">{isSingleMode ? "Input Image" : "Input Images"}</h2>
                <div className="flex items-center">
                  <button className="text-gray-400 hover:text-white transition-colors p-2" onClick={this.clearImageInput}>
                    <ClearIcon />
                  </button>
                </div>
              </div>

              {!uploadedImages.length && (
                <label className="flex items-center justify-center flex-1 h-full border-2 rounded-lg border-gray-600 bg-gray-800 text-gray-400 hover:text-white cursor-pointer">
                  <input
                    type="file"
                    accept="image/png, image/jpeg, image/webp"
                    multiple={!isSingleMode} // Enable multiple file upload in batch mode
                    onChange={this.handleImageUpload}
                    className="hidden"
                  />
                  Click to upload {isSingleMode ? "an image" : "images"}
                </label>
              )}

              {uploadedImages.length > 0 && (
                <div className="flex flex-col items-start justify-start flex-1 h-full border-2 rounded-lg border-gray-600 bg-gray-800 p-4 space-y-4">
                  {uploadedImages.map((file, index) => (
                    <div key={index} className="flex flex-col items-start justify-start">
                      <p className="text-white">{file.name}</p>
                      <img src={URL.createObjectURL(file)} alt={`Preview of ${file.name}`} className="min-w-1/2 min-h-1/2 max-w-[95%] max-h-[95%] rounded-lg border-2 border-gray-600 mt-2" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right side: Extracted text and output */}
            <div className="flex-1 flex flex-col h-full">
              <div className="flex justify-between items-center">
                <h2 className="text-lg text-gray-300">Extracted Text</h2>
                <div className="flex items-center space-x-2">
                  <div className="relative" ref={this.saveDropdownRef}>
                    <button className="text-gray-400 hover:text-white transition-colors p-2" onClick={this.toggleSaveOptions}>
                      <SaveIcon />
                    </button>
                    {showSaveOptions && (
                      <div className={`absolute right-0 mt-2 ${isSingleMode ? "w-36" : "w-64"} bg-gray-800 rounded-lg border border-gray-700 text-white shadow-lg z-10`}>
                        <ul className="py-1">
                          {isSingleMode ? (
                            <>
                              <li className="px-4 py-2 cursor-pointer hover:bg-gray-700 hover:rounded-md hover:mx-1 hover:px-3" onClick={this.saveAsTextFile}>
                                Save as Text
                              </li>
                              <li className="px-4 py-2 cursor-pointer hover:bg-gray-700 hover:rounded-md hover:mx-1 hover:px-3" onClick={this.saveAsPDF}>
                                Save as PDF
                              </li>
                            </>
                          ) : (
                            <>
                              <li className="px-4 py-2 cursor-pointer hover:bg-gray-700 hover:rounded-md hover:mx-1 hover:px-3" onClick={this.saveAsTextFile}>
                                Save as Text
                              </li>
                              <li className="px-4 py-2 cursor-pointer hover:bg-gray-700 hover:rounded-md hover:mx-1 hover:px-3" onClick={this.saveAsSeparateTextFiles}>
                                Save as Separate Text Files
                              </li>
                              <li className="px-4 py-2 cursor-pointer hover:bg-gray-700 hover:rounded-md hover:mx-1 hover:px-3" onClick={this.saveAsPDF}>
                                Save as PDF
                              </li>
                              <li className="px-4 py-2 cursor-pointer hover:bg-gray-700 hover:rounded-md hover:mx-1 hover:px-3" onClick={this.saveAsSeparatePDFs}>
                                Save as Separate PDF Files
                              </li>
                            </>
                          )}
                        </ul>
                      </div>
                    )}
                  </div>
                  <button className="text-gray-400 hover:text-white transition-colors p-2" onClick={() => this.copyToClipboard(extractedTexts.join(""))}>
                    <CopyIcon />
                  </button>
                </div>
              </div>
              <div
                className={`flex-1 h-full border-2 rounded-lg px-4 py-2 text-gray-300 outline-none placeholder-gray-500 hover:bg-[#2b3544] focus:border-blue-400 focus:bg-[#2b3544] font-mono custom-scrollbar ${
                  ocrError ? "border-red-500 bg-red-500/10" : "border-gray-600 bg-gray-800"
                }`}
                style={{ whiteSpace: "pre-wrap" }} // Preserve line breaks
              >
                {isProcessing ? "Processing image(s)..." : ocrError ? ocrError : extractedTexts.join("")}
              </div>
            </div>
          </section>
        </section>
      </main>
    );
  }
}

export default ImageToTextConverter;
