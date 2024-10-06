import React, { Component } from "react";
import { ClearIcon, CopyIcon, SaveIcon } from "../others/Icons";
import { CustomScrollbar } from "../others/CustomScrollbar";
import { simplify, parse, toString, LOGIC } from "@fordi-org/bsimp";

class BooleanSimplifier extends Component {
  constructor(props) {
    super(props);
    this.state = {
      input: "",
      output: "",
      steps: [],
      error: null,
    };
  }

  // Preprocess the input to replace NAND, NOR, XOR, and XNOR symbols with AND, NOT, OR gates
  preprocessInput = (input) => {
    let gateConversions = [];

    // NAND (A ~& B, A !& B, A ~&& B, A !&& B, A NAND B) -> !(A & B)
    input = input.replace(/\s*(~&&|!&&|~&|!&| NAND )\s*/gi, (match, p1, offset, fullString) => {
      const expr = fullString.match(/([A-Za-z0-9]+)\s*(~&&|!&&|~&|!&| NAND )\s*([A-Za-z0-9]+)/i);
      if (expr) {
        gateConversions.push(`Gate Conversion: ${expr[1]} NAND ${expr[3]} = !(${expr[1]} & ${expr[3]})`);
        return `!(${expr[1]} & ${expr[3]})`;
      }
      return match;
    });

    // NOR (A ~| B, A !| B, A ~|| B, A !|| B, A NOR B)  -> !(A | B)
    input = input.replace(/\s*(~\|{1,2}|!\|{1,2}| NOR )\s*/gi, (match, p1, offset, fullString) => {
      const expr = fullString.match(/([A-Za-z0-9]+)\s*(~\|{1,2}|!\|{1,2}| NOR )\s*([A-Za-z0-9]+)/i);
      if (expr) {
        gateConversions.push(`Gate Conversion: ${expr[1]} NOR ${expr[3]} = !(${expr[1]} | ${expr[3]})`);
        return `!(${expr[1]} | ${expr[3]})`;
      }
      return match;
    });

    // XOR (A ^ B, A XOR B) -> (A & !B) | (!A & B)
    input = input.replace(/\s*(\^| XOR )\s*/gi, (match, p1, offset, fullString) => {
      const expr = fullString.match(/([A-Za-z0-9]+)\s*(\^| XOR )\s*([A-Za-z0-9]+)/i);
      if (expr) {
        gateConversions.push(`Gate Conversion: ${expr[1]} XOR ${expr[3]} = (${expr[1]} & !${expr[3]}) | (!${expr[1]} & ${expr[3]})`);
        return `((${expr[1]} & !${expr[3]}) | (!${expr[1]} & ${expr[3]}))`;
      }
      return match;
    });

    // XNOR (A ~^ B, A !^ B, A XNOR B) -> !((A & !B) | (!A & B))
    input = input.replace(/\s*(~\^|!\^| XNOR )\s*/gi, (match, p1, offset, fullString) => {
      const expr = fullString.match(/([A-Za-z0-9]+)\s*(~\^|!\^| XNOR )\s*([A-Za-z0-9]+)/i);
      if (expr) {
        gateConversions.push(`Gate Conversion: ${expr[1]} XNOR ${expr[3]} = !(((${expr[1]} & !${expr[3]}) | (!${expr[1]} & ${expr[3]})))`);
        return `!(((${expr[1]} & !${expr[3]}) | (!${expr[1]} & ${expr[3]})))`;
      }
      return match;
    });

    return { preprocessedInput: input, gateConversions };
  };

  handleInputChange = (e) => {
    let input = e.target.value;
    this.setState({ input });

    try {
      const { preprocessedInput, gateConversions } = this.preprocessInput(input);

      let output = "";
      let steps = [];

      const expression = parse(preprocessedInput);
      const simplified = simplify(expression, steps);
      output = toString(simplified, LOGIC);

      // Add gate conversions at the beginning of the steps
      const conversionSteps = gateConversions.map((conversion) => ["Gate Conversion", null, conversion, null]);

      // Add the processed input as a step
      const inputStep = [`Input: ${preprocessedInput}`, null, preprocessedInput, null];

      const allSteps = [...conversionSteps, inputStep, ...steps];

      this.setState({ output, steps: allSteps, error: null });
    } catch (error) {
      this.setState({
        output: "",
        steps: [],
        error: "Invalid Boolean expression or simplification error",
      });
    }
  };

  clearInput = () => {
    this.setState({ input: "", output: "", steps: [], error: null });
  };

  copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  saveOutputAsText = () => {
    const { output } = this.state;
    const element = document.createElement("a");
    const file = new Blob([output], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "boolean_simplified_output.txt";
    document.body.appendChild(element);
    element.click();
  };

  renderSimplificationSteps = () => {
    const { steps } = this.state;
    if (steps.length === 0) return null;

    return (
      <div className="flex flex-col gap-2">
        <ul className="list-disc text-gray-300 pl-5 space-y-2">
          {steps.map(([transform, , fromExpr, toExpr], index) => (
            <li key={index} className="break-words whitespace-normal" style={{ wordBreak: "break-word" }}>
              <strong>{transform}:</strong> {toString(fromExpr, LOGIC)} → {toString(toExpr, LOGIC)}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  render() {
    const { input, output, error } = this.state;

    return (
      <main className="overflow-y-auto p-4 md:p-6 lg:p-8 xl:p-10 md:pt-4 lg:pt-5 xl:pt-5 h-full">
        <CustomScrollbar />
        <section className="flex flex-col gap-6 h-full">
          <h1 className="text-3xl text-white font-semibold">Logic Equation Simplifier</h1>

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
                placeholder="ACD XNOR BC"
              />
            </div>
          </section>

          <section className="flex flex-col gap-2">
            <div className="flex justify-between">
              <h2 className="self-end text-lg text-gray-300">Output</h2>
              <div className="flex items-center">
                <button className="text-gray-400 hover:text-white transition-colors mr-2" onClick={() => this.copyToClipboard(output)}>
                  <CopyIcon />
                </button>
              </div>
            </div>
            <div className="flex items-center border-b-2 border-gray-600 bg-gray-800 rounded-lg">
              <input className="h-10 flex-grow bg-transparent px-4 py-2 text-white outline-none placeholder-gray-500 hover:bg-[#2b3544] focus:border-blue-400 focus:bg-[#2b3544] font-mono rounded-md" spellCheck="false" value={error || output} readOnly />
            </div>
          </section>

          <section className="flex flex-col gap-4">
            <h2 className="text-lg text-gray-300">Simplification Steps:</h2>
            {this.renderSimplificationSteps()}
          </section>
        </section>
      </main>
    );
  }
}

export default BooleanSimplifier;
