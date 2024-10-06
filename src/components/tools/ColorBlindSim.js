import React, { Component, createRef } from "react";
import colorBlind from "color-blind";
import { CopyIcon, ClearIcon } from "../others/Icons";

class ColorBlindnessSimulator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      colorInput: "3498db",
      lastValidHex: "#3498db", // Default color for clear state
      defaultHex: "#3498db", // Default color for invalid state
      isValidHex: true,
      colorBlindness: {
        protanomaly: "", // Anomalous Trichromat (low amounts of red)
        protanopia: "", // Dichromat (no red)
        deuteranomaly: "", // Anomalous Trichromat (low amounts of green)
        deuteranopia: "", // Dichromat (no green)
        tritanomaly: "", // Anomalous Trichromat (low amounts of blue)
        tritanopia: "", // Dichromat (no blue)
        achromatomaly: "", // Monochromat (absence of most color)
        achromatopsia: "", // Monochromat (no color at all)
      },
    };
    this.colorInputRef = createRef();
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    this.updateColorValues(this.state.defaultHex);
  }

  handleHexInputChange = (e) => {
    const inputValue = e.target.value; // Allow any characters, no sanitization

    this.setState({ colorInput: inputValue }, () => {
      const hex = this.formatHex(inputValue); // Convert the input into a valid hex format (if possible)

      // Validate the hex format; fallback to the default color if invalid
      if (/^#([0-9A-Fa-f]{3}){1,2}$/.test(hex)) {
        this.setState({ lastValidHex: hex, isValidHex: true });
        this.updateColorValues(hex);
      } else {
        // If invalid, show default colors and set the error state
        this.setState({ isValidHex: false });
        this.updateColorValues(this.state.defaultHex);
      }
    });
  };

  // Convert user input to hex format
  formatHex = (input) => {
    if (input.startsWith("#")) {
      return input; // Keep the # if the user included it
    }
    return `#${input}`; // Add a # if missing
  };

  handleColorPickerChange = (e) => {
    const hex = e.target.value;
    const sanitizedHex = hex.toUpperCase();

    // Remove the '#' for display
    const displayHex = sanitizedHex.slice(1);

    this.setState({ colorInput: displayHex, isValidHex: true }, () => {
      this.setState({ lastValidHex: sanitizedHex });
      this.updateColorValues(sanitizedHex);
    });
  };

  updateColorValues = (hex) => {
    try {
      const colorBlindness = {
        Protanomaly: colorBlind.protanomaly(hex).slice(1).toUpperCase(),
        Protanopia: colorBlind.protanopia(hex).slice(1).toUpperCase(),
        Deuteranomaly: colorBlind.deuteranomaly(hex).slice(1).toUpperCase(),
        Deuteranopia: colorBlind.deuteranopia(hex).slice(1).toUpperCase(),
        Tritanomaly: colorBlind.tritanomaly(hex).slice(1).toUpperCase(),
        Tritanopia: colorBlind.tritanopia(hex).slice(1).toUpperCase(),
        Achromatomaly: colorBlind.achromatomaly(hex).slice(1).toUpperCase(),
        Achromatopsia: colorBlind.achromatopsia(hex).slice(1).toUpperCase(),
      };

      this.setState({ colorBlindness });
    } catch (e) {
      // In case of any unexpected errors, retain the last valid color blindness
      console.error("Error updating color blindness simulations:", e);
    }
  };

  clearField = () => {
    this.setState({
      colorInput: "",
      isValidHex: false,
      colorBlindness: {
        protanomaly: "undefined",
        protanopia: "undefined",
        deuteranomaly: "undefined",
        deuteranopia: "undefined",
        tritanomaly: "undefined",
        tritanopia: "undefined",
        achromatomaly: "undefined",
        achromatopsia: "undefined",
      },
    });
  };

  renderColorSection = (label, value, isEditable = false, description = "", isClearable = false) => {
    // If the hex is invalid, display 'undefined'
    const displayValue = this.state.isValidHex || isEditable ? value : "undefined";

    return (
      <section className="flex items-center gap-[1.125rem]">
        <div
          className={`w-[4.25rem] h-[4.35rem] rounded-lg ${isEditable ? "cursor-pointer" : ""}`}
          style={{
            backgroundColor: this.state.isValidHex || !isEditable ? `#${value}` : this.state.defaultHex,
          }}
          title={isEditable ? "Click to pick color" : ""}
          onClick={isEditable ? this.openColorPicker : undefined} // Only clickable for the hex code
        ></div>
        <div className="flex flex-col flex-grow">
          <div className="flex justify-between items-center">
            <h2 className="self-end text-lg p-0.5 text-gray-300">{label}</h2>
            <div className="flex items-center space-x-2">
              {/* {description && (
                <div className="relative group">
                  <InfoIcon />
                  <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 hidden group-hover:flex flex-col items-center">
                    <div className="bg-slate-700 w-72 mr-[11.8rem] text-white text-sm rounded-md px-3 py-2 shadow-lg transition-opacity duration-200 opacity-0 group-hover:opacity-100">
                      {description}
                    </div>
                    <div className="w-3 h-3 bg-slate-700 rotate-45 transform mt-[-0.5rem]"></div>
                  </div>
                </div>
              )} */}
              {isClearable ? (
                <button className="text-gray-400 hover:text-white transition-colors px-1.5" onClick={this.clearField} title="Clear Hex Code">
                  <ClearIcon />
                </button>
              ) : (
                <button className="text-gray-400 hover:text-white transition-colors px-1.5" onClick={() => this.copyToClipboard(value)} title="Copy Hex Code">
                  <CopyIcon />
                </button>
              )}
            </div>
          </div>
          <div className="flex flex-col">
            <input
              className={`h-[2.375rem] flex-grow bg-gray-800 px-4 py-1.5 text-white outline-none placeholder-gray-500 hover:bg-gray-700 focus:border-blue-400 focus:bg-gray-700 font-mono rounded-md border-b-2 border-gray-600 ${isEditable ? "" : ""}`}
              spellCheck="false"
              value={isEditable ? this.state.colorInput : this.state.isValidHex || isEditable ? value : "undefined"}
              placeholder="Hex Code"
              onChange={isEditable ? this.handleHexInputChange : undefined}
              readOnly={!isEditable}
            />
            {/* Show "Invalid Hex Value" error when the input is invalid */}
            {!this.state.isValidHex && isEditable && <span className="text-red-500 text-sm mt-1">Invalid Hex Value</span>}
          </div>
        </div>
      </section>
    );
  };

  openColorPicker = () => {
    if (this.colorInputRef.current) {
      this.colorInputRef.current.click();
    }
  };

  copyToClipboard = (text) => {
    navigator.clipboard.writeText(`#${text}`).then();
  };

  render() {
    const { colorInput, colorBlindness, lastValidHex, defaultHex } = this.state;
    const hexToShow = /^#([0-9A-Fa-f]{3}){1,2}$/.test(this.formatHex(colorInput)) ? colorInput.toUpperCase() : lastValidHex.slice(1); // Use last valid hex if input is invalid

    const colorBlindnessDescriptions = {
      Protanomaly: "",
      Protanopia: "",
      Deuteranomaly: "",
      Deuteranopia: "",
      Tritanomaly: "",
      Tritanopia: "",
      Achromatomaly: "",
      Achromatopsia: "",
    };

    return (
      <main className="overflow-y-auto p-4 md:p-6 lg:p-8 xl:p-10 pt-4 lg:pt-5 xl:pt-5 h-full bg-gray-900">
        <section className="flex flex-col gap-6">
          <h1 className="text-3xl text-white font-semibold">Color Blindness Simulator</h1>
          <p className="text-gray-300 text-lg">Enter a hex value or click on the color box to pick a color.</p>
          {this.renderColorSection("Hex Code", hexToShow, true, "", true)}

          <input type="color" ref={this.colorInputRef} style={{ display: "none" }} onChange={this.handleColorPickerChange} defaultValue={`#${hexToShow}`} />

          {/* Color Blindness Simulations (Non-Editable) */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-x-8 lg:gap-x-10 md:gap-y-7 mt-4">
            {this.renderColorSection("Protanomaly", colorBlindness.Protanomaly, false, colorBlindnessDescriptions.Protanomaly)}
            {this.renderColorSection("Protanopia", colorBlindness.Protanopia, false, colorBlindnessDescriptions.Protanopia)}
            {this.renderColorSection("Deuteranomaly", colorBlindness.Deuteranomaly, false, colorBlindnessDescriptions.Deuteranomaly)}
            {this.renderColorSection("Deuteranopia", colorBlindness.Deuteranopia, false, colorBlindnessDescriptions.Deuteranopia)}
            {this.renderColorSection("Tritanomaly", colorBlindness.Tritanomaly, false, colorBlindnessDescriptions.Tritanomaly)}
            {this.renderColorSection("Tritanopia", colorBlindness.Tritanopia, false, colorBlindnessDescriptions.Tritanopia)}
            {this.renderColorSection("Achromatomaly", colorBlindness.Achromatomaly, false, colorBlindnessDescriptions.Achromatomaly)}
            {this.renderColorSection("Achromatopsia", colorBlindness.Achromatopsia, false, colorBlindnessDescriptions.Achromatopsia)}
          </section>
        </section>
      </main>
    );
  }
}

export default ColorBlindnessSimulator;
