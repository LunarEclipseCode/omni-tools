import React, { Component } from "react";
import { ClearIcon, CopyIcon, SaveIcon } from "../others/Icons";
import { CustomScrollbar } from "../others/CustomScrollbar";
import { simplify, parse, toString, LOGIC } from "../../../node_modules/@fordi-org/bsimp/dist/bsimp";

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

  handleInputChange = (e) => {
    const input = e.target.value;
    this.setState({ input });

    try {
      let output = "";
      let steps = [];
      const expression = parse(input);

      // Simplify the expression and capture steps
      const simplified = simplify(expression, steps);
      output = toString(simplified, LOGIC);

      this.setState({ output, steps, error: null });
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

  // Function to convert simplification steps to a string
  getStepsAsString = () => {
    const { steps } = this.state;
    if (steps.length === 0) return "";
    return steps.map(([transform, , fromExpr, toExpr]) => `${transform}: ${toString(fromExpr, LOGIC)} → ${toString(toExpr, LOGIC)}`).join("\n");
  };

  capitalizeFirstLetter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  renderSimplificationSteps = () => {
    const { steps } = this.state;

    return (
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <h2 className="text-lg text-gray-300">Simplification Steps:</h2>
          <button className="text-gray-400 hover:text-white transition-colors mr-2" onClick={() => this.copyToClipboard(this.getStepsAsString())}>
            <CopyIcon />
          </button>
        </div>
        {/* Show the list only if steps are available */}
        {steps.length > 0 ? (
          <ul className="list-disc text-gray-300 pl-5 space-y-2">
            {steps
              .filter(
                ([transform, , fromExpr, toExpr]) =>
                  // Filter out 'unwrap' steps where the left and right side are the same
                  !(transform === "unwrap" && toString(fromExpr, LOGIC) === toString(toExpr, LOGIC))
              )
              .map(([transform, , fromExpr, toExpr], index) => (
                <li key={index} className="break-words whitespace-normal" style={{ wordBreak: "break-word" }}>
                  <strong>{this.capitalizeFirstLetter(transform)}:</strong> {this.capitalizeFirstLetter(toString(fromExpr, LOGIC))} → {this.capitalizeFirstLetter(toString(toExpr, LOGIC))}
                </li>
              ))}
          </ul>
        ) : (
          <p className="text-gray-500">No simplification steps available.</p>
        )}
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

          <section className="bg-gray-800 text-gray-300 p-4 rounded-lg">
            <h3 className="text-xl font-semibold mb-2">Supported operations and notations</h3>
            <ul className="list-disc pl-6 mb-2 space-y-1">
              <li>
                <strong>AND:</strong> &, &&, ∩, ^, AND or no space (like AB)
              </li>
              <li>
                <strong>OR:</strong> |, ||, +, ∪, v, or OR
              </li>
              <li>
                <strong>NOT:</strong> !A, ~A, or NOT A
              </li>
            </ul>
            <p>You can freely mix and match these notations. So, you can simplify ~(A!B^!CD) + AD ∪ BC</p>
          </section>

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
                placeholder="Enter Boolean logic to simplify"
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

          <section className="flex flex-col gap-4">{this.renderSimplificationSteps()}</section>
        </section>
      </main>
    );
  }
}

export default BooleanSimplifier;
