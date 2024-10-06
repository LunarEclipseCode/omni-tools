import React, { Component } from "react";
import cronParser from "cron-parser";
import cronstrue from "cronstrue";
import { format } from "date-fns";
import { CopyIcon, ClearIcon, SaveIcon } from "../others/Icons";
import { CustomScrollbar } from "../others/CustomScrollbar";

class CronExpressionParser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      includeSeconds: true,
      numberOfScheduledDates: 5,
      outputFormat: "yyyy-MM-dd eee HH:mm:ss",
      cronExpression: "* 15 10 ? * MON-FRI",
      cronDescription: "",
      outputDates: [],
      errorMessage: "",
    };
  }

  componentDidMount() {
    this.parseCronExpression();
  }

  handleToggleIncludeSeconds = () => {
    this.setState(
      (prevState) => ({ includeSeconds: !prevState.includeSeconds }),
      () => {
        // Re-parse the cron expression when toggling seconds
        if (this.state.cronExpression) {
          this.parseCronExpression();
        }
      }
    );
  };

  handleNumberOfDatesChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (value > 0) {
      this.setState({ numberOfScheduledDates: value }, () => {
        if (this.state.cronExpression && !this.state.errorMessage) {
          this.parseCronExpression();
        }
      });
    }
  };

  handleOutputFormatChange = (e) => {
    this.setState({ outputFormat: e.target.value, errorMessage: "" }, () => {
      if (this.state.cronExpression) {
        this.parseCronExpression();
      }
    });
  };

  handleCronExpressionChange = (e) => {
    this.setState({ cronExpression: e.target.value, errorMessage: "" }, () => {
      this.parseCronExpression();
    });
  };

  clearOutputFormat = () => {
    this.setState({ outputFormat: "", outputDates: [] });
  };

  clearCronExpression = () => {
    this.setState({ cronExpression: "", cronDescription: "", outputDates: [] });
  };

  parseCronExpression = () => {
    const { cronExpression, includeSeconds, numberOfScheduledDates, outputFormat } = this.state;

    this.setState({
      cronDescription: "",
      outputDates: [],
      errorMessage: "",
    });

    // If cron expression is empty, do not show an error
    if (!cronExpression.trim()) {
      return;
    }

    try {
      const parts = cronExpression.trim().split(" ");

      if (includeSeconds) {
        if (parts.length !== 6) {
          throw new Error("Invalid Cron expression. Expected 6 fields when including seconds.");
        }
      } else {
        if (parts.length !== 5) {
          throw new Error("Invalid Cron expression. Expected 5 fields when excluding seconds.");
        }
      }

      const description = cronstrue.toString(cronExpression, {
        throwExceptionOnParseError: true,
        use24HourTimeFormat: true,
        useSeconds: includeSeconds,
      });
      this.setState({ cronDescription: description });

      const effectiveOutputFormat = outputFormat || " ";

      // Parse the cron expression
      const options = {
        currentDate: new Date(),
        iterator: true,
      };
      const interval = cronParser.parseExpression(cronExpression, options);

      // Generate next scheduled dates
      const dates = [];
      for (let i = 0; i < numberOfScheduledDates; i++) {
        const obj = interval.next();
        const date = obj.value;
        dates.push(format(date, effectiveOutputFormat));
      }

      this.setState({ outputDates: dates });
    } catch (err) {
      this.setState({ errorMessage: `Error: ${err.message}` });
    }
  };

  copyDatesToClipboard = () => {
    const { outputDates } = this.state;
    navigator.clipboard.writeText(outputDates.join("\n"));
  };

  copyDescriptionToClipboard = () => {
    const { cronDescription } = this.state;
    navigator.clipboard.writeText(cronDescription);
  };

  saveDatesAsText = () => {
    const { outputDates } = this.state;
    const element = document.createElement("a");
    const file = new Blob([outputDates.join("\n")], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "scheduled_dates.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element); // Clean up
  };

  clearOutput = () => {
    this.setState({
      outputDates: [],
      cronDescription: "",
      errorMessage: "",
      cronExpression: "",
    });
  };

  handleNumberInputChange = (event, handler) => {
    const value = event.target.value;
    if (!isNaN(value) && !value.includes("e")) {
      handler(event);
    }
  };

  calculateLineNumberWidth = () => {
    const { outputDates } = this.state;
    const maxDigits = Math.max(outputDates.length.toString().length, 3);
    return 8 + maxDigits * 8;
  };

  render() {
    const { includeSeconds, numberOfScheduledDates, outputFormat, cronExpression, cronDescription, outputDates, errorMessage } = this.state;

    return (
      <main className="overflow-y-auto p-4 md:p-6 lg:p-8 xl:p-10 md:pt-4 lg:pt-5 xl:pt-5 h-full">
        <CustomScrollbar />
        <style>{`
          .line-number-background {
            background-color: #4a5568;
            padding-bottom: 0.5em;
            min-height: 100%;
            width: ${this.calculateLineNumberWidth()}px; /* Dynamically calculated width */
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
          <h1 className="text-3xl text-white font-semibold mb-5">Cron Expression Parser</h1>
          <section className="grid gap-4 grid-cols-1 lg:grid-cols-2">
            {errorMessage && (
              <div className="order-1 lg:col-span-2">
                <p className="text-red-500 text-base">{errorMessage}</p>
              </div>
            )}

            <div className="order-2">
              <div className="flex h-[3.1rem] lg:h-[3.25rem] items-center gap-6 rounded-lg bg-gray-800 px-4">
                <span className="text-white flex-1">Include Seconds</span>
                <div className="flex flex-1 justify-end">
                  <div className="flex flex-row-reverse items-center">
                    <button
                      type="button"
                      role="switch"
                      aria-checked={includeSeconds}
                      onClick={this.handleToggleIncludeSeconds}
                      className={`group inline-flex h-6 w-12 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 ease-in-out ${includeSeconds ? "bg-blue-600" : "bg-gray-600"}`}
                    >
                      <span className={`pointer-events-none block h-4 w-4 rounded-full bg-white shadow-lg transform transition-transform duration-200 ease-in-out ${includeSeconds ? "translate-x-7" : "translate-x-1"}`}></span>
                    </button>
                    <label className="leading-none cursor-pointer pr-3 text-white">{includeSeconds ? "On" : "Off"}</label>
                  </div>
                </div>
              </div>
            </div>

            <div className="order-3">
              <div className="flex h-[3.1rem] lg:h-[3.25rem] items-center gap-6 rounded-lg bg-gray-800 px-4">
                <span className="text-white flex-1">Number of Scheduled Dates</span>
                <select value={numberOfScheduledDates} onChange={this.handleNumberOfDatesChange} className="h-10 w-16 bg-gray-700 text-white px-2 rounded-lg">
                  {[1, 2, 3, 5, 10, 20, 50, 100].map((num) => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="order-4 lg:col-span-2">
              <div className="flex flex-col gap-2">
                <div className="flex justify-between">
                  <h2 className="self-end text-lg text-gray-300">Output Format</h2>
                  <div className="flex">
                    <button className="text-gray-400 hover:text-white transition-colors mr-2 px-1.5" onClick={this.clearOutputFormat}>
                      <ClearIcon />
                    </button>
                  </div>
                </div>
                <div className="flex items-center border-b-2 border-gray-600 bg-gray-800 rounded-lg">
                  <input
                    type="text"
                    value={outputFormat}
                    onChange={this.handleOutputFormatChange}
                    className="h-10 flex-grow bg-transparent px-4 py-2 text-white outline-none placeholder-gray-500 hover:bg-[#2b3544] focus:border-blue-400 focus:bg-[#2b3544] font-mono rounded-md"
                  />
                </div>
              </div>
            </div>

            <div className="order-5 lg:col-span-2">
              <div className="flex flex-col gap-2">
                <div className="flex justify-between">
                  <h2 className="self-end text-lg text-gray-300">Cron Expression</h2>
                  <div className="flex">
                    <button className="text-gray-400 hover:text-white transition-colors mr-2 px-1.5" onClick={this.clearCronExpression}>
                      <ClearIcon />
                    </button>
                  </div>
                </div>
                <div className="flex items-center border-b-2 border-gray-600 bg-gray-800 rounded-lg">
                  <input type="text" value={cronExpression} onChange={this.handleCronExpressionChange} className="h-10 flex-grow bg-transparent px-4 py-1.5 text-white outline-none hover:bg-[#2b3544] focus:border-blue-400 focus:bg-[#2b3544] font-mono rounded-md" />
                </div>
              </div>
            </div>

            <div className="order-6 lg:col-span-2">
              <div className="flex flex-col gap-2">
                <div className="flex justify-between">
                  <h2 className="self-end text-lg text-gray-300">Cron Description</h2>
                  <div className="flex">
                    <button className="text-gray-400 hover:text-white transition-colors mr-2 px-1.5" onClick={this.copyDescriptionToClipboard}>
                      <CopyIcon />
                    </button>
                  </div>
                </div>
                <div className="flex items-center border-b-2 border-gray-600 bg-gray-800 rounded-lg">
                  <input type="text" value={cronDescription} readOnly className="h-10 flex-grow bg-transparent px-4 py-2 text-white outline-none placeholder-gray-500 hover:bg-[#2b3544] focus:border-blue-400 focus:bg-[#2b3544] font-mono rounded-md" />
                </div>
              </div>
            </div>
          </section>

          <div className="flex justify-between items-center mt-5 mb-1">
            <h2 className="text-lg text-gray-300">Scheduled Dates</h2>
            <div className="flex items-center">
              <button className="text-gray-400 hover:text-white transition-colors p-1 mr-2" onClick={this.saveDatesAsText}>
                <SaveIcon />
              </button>
              <button className="text-gray-400 hover:text-white transition-colors p-1 mr-2" onClick={this.copyDatesToClipboard}>
                <CopyIcon />
              </button>
            </div>
          </div>

          <section className="flex flex-col gap-4 mt-1">
            <div className="relative h-72 lg:h-80 border-2 rounded-lg border-gray-600 bg-gray-800 px-4 py-2 text-gray-300 overflow-auto custom-scrollbar">
              <div className="absolute top-0 left-0 line-number-background bg-gray-700 text-gray-400 text-right pr-2 pt-2 font-mono">
                {outputDates.length > 0
                  ? outputDates.map((_, index) => (
                      <div key={index} className="leading-6">
                        {index + 1}
                      </div>
                    ))
                  : null}
              </div>
              <div className="ml-10 whitespace-nowrap font-mono">
                {outputDates.length > 0 ? (
                  outputDates.map((date, index) => (
                    <div key={index} className="leading-6 select-text">
                      {date}
                    </div>
                  ))
                ) : (
                  <div className="leading-6 select-text text-gray-500"></div>
                )}
              </div>
            </div>
          </section>
        </section>
      </main>
    );
  }
}

export default CronExpressionParser;
