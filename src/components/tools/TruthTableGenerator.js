import React, { Component } from "react";
import { ClearIcon, CopyIcon, SaveIcon, AlignLeftIcon, AlignCenterIcon, AlignRightIcon } from "../others/Icons";
import { generateTable } from "@lusc/truth-table";

const scrollbarStyles = `
  .custom-appscrollbar::-webkit-scrollbar {
    width: 0.5em;
    height: 0.6em;
  }
  .custom-appscrollbar::-webkit-scrollbar-track {
    background: #2b3544;
    border-radius: 0.5em;
  }
  .custom-appscrollbar::-webkit-scrollbar-thumb {
    background-color: #111827;
    border-radius: 0.5em;
  }
  .custom-appscrollbar::-webkit-scrollbar-thumb:hover {
    background-color: #111827;
    border-radius: 0.5em;
  }
`;

// Replace specific operators with ⊼, ⊽, and ===
function preprocessExpression(expression) {
  return (
    expression
      // Replace !& or ~& with ⊼
      .replace(/(!&|~&)/g, "⊼")
      // Replace !+ or ~+ with ⊽
      .replace(/(!\+|~\+)/g, "⊽")
      // Replace !|, ~|, !||, ~||, !∨, ~∨ with ⊽
      .replace(/(!\||~\||!\|\||~\|\||!∨|~∨)/g, "⊽")
      // Replace !^ or ~^ with === (XNOR)
      .replace(/(!\^|~\^)/g, "===")
  );
}

// Interpret attached letters as AND
function interpretAttachedLetters(expression) {
  // List of keywords to ignore
  const keywords = ["and", "not", "or", "xor", "iff", "ifthen", "nand", "nor"];
  const keywordsPattern = keywords.map((kw) => `\\b${kw}\\b`).join("|");

  return expression.replace(/([a-zA-Z]{2,})(?!\w)/g, (match) => {
    const regex = new RegExp(keywordsPattern, "i"); // Case-insensitive match
    if (regex.test(match)) {
      return match;
    } else {
      return `(${match.split("").join(" & ")})`;
    }
  });
}

class TruthTableGenerator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      input: "",
      columns: [],
      rows: [],
      error: null,
      interpretAttachedLetters: true,
      includeSteps: false,
      tableAlignment: "left",
    };
  }

  handleToggleAttached = () => {
    this.setState(
      (prevState) => ({
        interpretAttachedLetters: !prevState.interpretAttachedLetters,
      }),
      this.handleInputChange
    );
  };

  handleToggleSteps = () => {
    this.setState(
      (prevState) => ({
        includeSteps: !prevState.includeSteps,
      }),
      this.handleInputChange
    );
  };

  handleAlignmentChange = (alignment) => {
    this.setState({ tableAlignment: alignment });
  };

  handleInputChange = (e) => {
    const input = e ? e.target.value : this.state.input; // Use current input if toggle changes
    this.setState({ input });

    // Skip processing if input is empty
    if (!input.trim()) {
      this.setState({ columns: [], rows: [], error: null });
      return;
    }

    try {
      // Preprocess the input to replace the custom operators with ⊼, ⊽, and ===
      let processedInput = preprocessExpression(input);

      if (this.state.interpretAttachedLetters) {
        processedInput = interpretAttachedLetters(processedInput);
      }

      const { columns, rows } = generateTable(processedInput, this.state.includeSteps);

      this.setState({ columns, rows, error: null });
    } catch (error) {
      if (error.from !== undefined && error.to !== undefined) {
        const errorMessage = `Error: ${error.message} at position ${error.from}`;
        this.setState({ error: errorMessage });
      } else {
        this.setState({ error: "Invalid Boolean expression or evaluation error" });
      }

      this.setState({ columns: [], rows: [] });
    }
  };

  clearInput = () => {
    this.setState({ input: "", columns: [], rows: [], error: null });
  };

  copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  saveTruthTableAsCSV = () => {
    const { columns, rows } = this.state;
    if (columns.length === 0 || rows.length === 0) {
      return;
    }

    const header = columns.join(",");
    const rowsText = rows.map((row) => row.map((value) => (value ? "1" : "0")).join(",")).join("\n");

    const output = `${header}\n${rowsText}`;

    const element = document.createElement("a");
    const file = new Blob([output], { type: "text/csv" });
    element.href = URL.createObjectURL(file);
    element.download = "truth_table.csv";
    document.body.appendChild(element);
    element.click();
  };

  renderTruthTable = () => {
    const { columns, rows, tableAlignment } = this.state;

    if (rows.length === 0) {
      return <p className="text-gray-500">No truth table available.</p>;
    }

    let alignmentClass = "text-left";
    if (tableAlignment === "center") alignmentClass = "text-center";
    if (tableAlignment === "right") alignmentClass = "text-right";

    return (
      <div className="custom-appscrollbar overflow-x-auto">
        <table className={`min-w-full table-auto text-gray-300 ${alignmentClass}`} style={{ tableLayout: "auto" }}>
          <thead>
            <tr>
              {columns.map((col, index) => (
                <th
                  key={index}
                  className="px-4 py-2"
                  style={{
                    whiteSpace: "nowrap", // Prevent breaking column header into multiple lines
                  }}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((value, colIndex) => (
                  <td key={colIndex} className="border px-4 py-2">
                    {value ? "1" : "0"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  render() {
    const { input, error, interpretAttachedLetters, includeSteps, tableAlignment } = this.state;

    return (
      <main className="overflow-y-auto p-4 md:p-6 lg:p-8 xl:p-10 md:pt-4 lg:pt-5 xl:pt-5 h-full">
        <style>{scrollbarStyles}</style>
        <section className="flex flex-col gap-6 h-full">
          <h1 className="text-3xl text-white font-semibold">Truth Table Generator</h1>

          <section className="bg-gray-800 text-gray-300 p-4 rounded-lg">
            <h3 className="text-xl font-semibold mb-2">Supported operations and notations</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ul className="list-disc pl-6 mb-2 space-y-1 font-mono">
                <li>
                  <strong>AND:</strong> &, &&, ∧, *
                </li>
                <li>
                  <strong>OR:</strong> |, ||, +
                </li>
                <li>
                  <strong>XOR:</strong> !=, !==, ~=, ^, &gt;=&lt;, &gt;-&lt;, &lt;-&gt;
                </li>
                <li>
                  <strong>IfThen:</strong> →, ⇒, ⊃, -&gt;, =&gt;
                </li>
              </ul>
              <ul className="list-disc pl-6 mb-2 space-y-1 font-mono">
                <li>
                  <strong>NOT:</strong> !, ~, ¬
                </li>
                <li>
                  <strong>NAND:</strong> ⊼, !&, ~&
                </li>
                <li>
                  <strong>NOR:</strong> !|, ~|, !||, ~||, !+, ~+
                </li>
                <li>
                  <strong>IFF:</strong> &lt;-&gt;, &lt;=&gt;, =, ==, ===, !^, ~^
                </li>
              </ul>
            </div>
            <p>Moreover, all operators can be used in their word form case insensitively.</p>
          </section>

          {/* Toggles Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6">
            <div className="flex h-14 items-center gap-6 rounded-lg bg-gray-800 px-4">
              <span className="text-white flex-1">Interpret attached letters as AND</span>
              <div className="flex justify-end">
                <div className="flex flex-row-reverse items-center">
                  <button
                    type="button"
                    role="switch"
                    aria-checked={interpretAttachedLetters}
                    onClick={this.handleToggleAttached}
                    className={`group inline-flex h-6 w-12 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 ease-in-out ${interpretAttachedLetters ? "bg-blue-600" : "bg-gray-600"}`}
                  >
                    <span className={`pointer-events-none block h-4 w-4 rounded-full bg-white shadow-lg transform transition-transform duration-200 ease-in-out ${interpretAttachedLetters ? "translate-x-7" : "translate-x-1"}`}></span>
                  </button>
                  <label className="leading-none cursor-pointer pr-3 text-white">{interpretAttachedLetters ? "On" : "Off"}</label>
                </div>
              </div>
            </div>

            <div className="flex h-14 items-center gap-6 rounded-lg bg-gray-800 px-4">
              <span className="text-white flex-1">Include Steps</span>
              <div className="flex flex-1 justify-end">
                <div className="flex flex-row-reverse items-center">
                  <button
                    type="button"
                    role="switch"
                    aria-checked={includeSteps}
                    onClick={this.handleToggleSteps}
                    className={`group inline-flex h-6 w-12 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 ease-in-out ${includeSteps ? "bg-blue-600" : "bg-gray-600"}`}
                  >
                    <span className={`pointer-events-none block h-4 w-4 rounded-full bg-white shadow-lg transform transition-transform duration-200 ease-in-out ${includeSteps ? "translate-x-7" : "translate-x-1"}`}></span>
                  </button>
                  <label className="leading-none cursor-pointer pr-3 text-white">{includeSteps ? "On" : "Off"}</label>
                </div>
              </div>
            </div>
          </div>

          <section className="flex flex-col gap-1.5">
            <div className="flex justify-between">
              <h2 className="self-end text-lg text-gray-300">Input</h2>
              <div className="flex">
                <button className="text-gray-400 hover:text-white transition-colors mr-2" onClick={this.clearInput}>
                  <ClearIcon />
                </button>
              </div>
            </div>
            <div className="flex items-center border-b-2 border-gray-600 bg-gray-800 rounded-lg">
              <input
                className="h-10 flex-grow bg-transparent px-4 py-2 text-white outline-none placeholder-gray-500 hover:bg-[#2b3544] focus:border-blue-400 focus:bg-[#2b3544] font-mono rounded-md"
                spellCheck="false"
                value={input}
                onChange={this.handleInputChange}
                placeholder="Enter Boolean expression"
              />
            </div>
          </section>

          <section className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <h2 className="self-end text-lg text-gray-300">Truth Table</h2>
              <div className="flex items-center gap-2">
                <button className={`text-gray-400 hover:text-white transition-colors mr-1 ${tableAlignment === "left" ? "text-blue-600" : ""}`} onClick={() => this.handleAlignmentChange("left")} title="Align Left">
                  <AlignLeftIcon />
                </button>
                <button className={`text-gray-400 hover:text-white transition-colors mr-1 ${tableAlignment === "center" ? "text-blue-600" : ""}`} onClick={() => this.handleAlignmentChange("center")} title="Align Center">
                  <AlignCenterIcon />
                </button>
                <button className={`text-gray-400 hover:text-white transition-colors mr-1.5 ${tableAlignment === "right" ? "text-blue-600" : ""}`} onClick={() => this.handleAlignmentChange("right")} title="Align Right">
                  <AlignRightIcon />
                </button>

                <button className="text-gray-400 hover:text-white transition-colors mr-2" onClick={this.saveTruthTableAsCSV} title="Save Table as CSV">
                  <SaveIcon />
                </button>

                <button className="text-gray-400 hover:text-white transition-colors mr-2" onClick={() => this.copyToClipboard(JSON.stringify(this.state.rows))} title="Copy Table">
                  <CopyIcon />
                </button>
              </div>
            </div>

            <div className="border-b-2 border-gray-600 bg-gray-800 rounded-lg p-4">{error ? <p className="text-red-500">{error}</p> : this.renderTruthTable()}</div>
          </section>
        </section>
      </main>
    );
  }
}

export default TruthTableGenerator;
