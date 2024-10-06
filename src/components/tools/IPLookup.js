import React, { Component } from "react";
import { CopyIcon, ClearIcon, SaveIcon, SearchIcon } from "../others/Icons";
import { CustomScrollbar } from "../others/CustomScrollbar";

class IPLookup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      input: "",
      output: "",
      error: null,
      selectedService: "ipapi",
      isSingleIPMode: true,
      lastFetchedIp: "",
      // Caches for Single Mode
      ipapiData: null,
      ipApiData: null,
      geoJsData: null,
      ipWhoisData: null,
      // Caches for Batch Mode
      batchCaches: {
        ipapi: {},
        "ip-api": {},
        geojs: {},
      },
      isFetching: false,
    };

    // debounceTimeout removed because live search is removed
    // this.debounceTimeout = null;
  }

  getServiceOptions = () => {
    const { isSingleIPMode } = this.state;
    const allServices = [
      { value: "ipapi", label: "ipapi" },
      { value: "ip-api", label: "ip-api" },
      { value: "geojs", label: "geojs" },
    ];

    // Include 'ipwhois' only in Single Mode
    if (isSingleIPMode) {
      allServices.push({ value: "ipwhois", label: "ipwhois" });
    }

    return allServices;
  };

  handleInputChange = (e) => {
    const input = e.target.value.trim();
    this.setState({
      input,
      error: null,
    });

    // Remove live search trigger
    /*
    clearTimeout(this.debounceTimeout);

    // If input is cleared, also clear the output
    if (input === "") {
      this.setState({ output: "", error: null });
      return;
    }

    this.debounceTimeout = setTimeout(() => {
      if (this.state.isSingleIPMode) {
        this.fetchIPInfo(input);
      } else {
        this.fetchBatchIPInfo(input);
      }
    }, 0);
    */
  };

  handleSearch = () => {
    const { input, isSingleIPMode } = this.state;
    if (input === "") {
      this.setState({ output: "", error: null });
      return;
    }

    if (isSingleIPMode) {
      this.fetchIPInfo(input);
    } else {
      this.fetchBatchIPInfo(input);
    }
  };

  /**
   * Fetch IP information for single mode.
   * Use cached data if available; otherwise, fetch from the selected service.
   */
  fetchIPInfo = async (ip) => {
    const { selectedService, lastFetchedIp } = this.state;

    // If the IP hasn't changed, check the cache for the selected service
    if (ip === lastFetchedIp) {
      const cachedData = this.getSingleModeCache(selectedService);
      if (cachedData) {
        const newOutput = JSON.stringify({ ip, info: cachedData }, null, 2);
        if (newOutput !== this.state.output) {
          this.setState({ output: newOutput });
        }
        return;
      }
    }

    this.setState({ isFetching: true });

    try {
      let response, data;
      switch (selectedService) {
        case "ipapi":
          response = await fetch(`https://ipapi.co/${ip}/json/`);
          break;
        case "ip-api":
          response = await fetch(`http://ip-api.com/json/${ip}`);
          break;
        case "geojs":
          response = await fetch(`https://get.geojs.io/v1/ip/geo/${ip}.json`);
          break;
        case "ipwhois":
          response = await fetch(`https://ipwhois.app/json/${ip}`);
          break;
        default:
          throw new Error("Unsupported service selected");
      }

      if (!response.ok) {
        throw new Error(`Failed to fetch IP information for ${ip}`);
      }

      data = await response.json();

      // Update cache for the selected service
      this.updateSingleModeCache(selectedService, data);

      const newOutput = JSON.stringify({ ip, info: data }, null, 2);

      // Only update output if the new data is different
      if (newOutput !== this.state.output) {
        this.setState({
          output: newOutput,
          error: null,
        });
      }

      this.setState({
        lastFetchedIp: ip,
        isFetching: false,
      });
    } catch (error) {
      this.setState({
        output: "",
        error: `Error fetching data for ${ip}: ${error.message}`,
        isFetching: false,
      });
    }
  };

  // Fetches IP information for Batch Mode.
  fetchBatchIPInfo = async (input) => {
    const { selectedService, batchCaches } = this.state;
    const cachedBatchData = batchCaches[selectedService] || {};

    // Split input into unique IPs, separated by commas or new lines
    const ipArray = [...new Set(input.split(/[\s,]+/).filter(Boolean))];

    // Special validation for 'ipapi' in Batch Mode
    if (selectedService === "ipapi" && ipArray.length > 25) {
      this.setState({
        error: "You can make a maximum of 25 IP addresses per request for source ipapi.",
        output: "",
      });
      return;
    }

    this.setState({ isFetching: true, error: null });

    // Prepare an array to hold promises for fetching IP info
    const fetchPromises = ipArray.map(async (ip) => {
      const cachedData = this.getBatchModeCache(this.state.selectedService, ip);
      if (cachedData) {
        return { ip, info: cachedData };
      } else {
        const fetchedData = await this.fetchIPInfoForBatch(ip);
        // Update batch cache if data was fetched successfully
        if (fetchedData && !fetchedData.error) {
          this.updateBatchModeCache(this.state.selectedService, ip, fetchedData);
        }
        return { ip, info: fetchedData };
      }
    });

    try {
      const results = await Promise.all(fetchPromises);
      const newOutput = JSON.stringify(results, null, 2);

      // Only update output if the new data is different
      if (newOutput !== this.state.output) {
        this.setState({ output: newOutput });
      }

      this.setState({ isFetching: false });
    } catch (error) {
      this.setState({
        error: "Failed to fetch some IP information",
        isFetching: false,
      });
    }
  };

  fetchIPInfoForBatch = async (ip) => {
    const { selectedService } = this.state;

    try {
      let response, data;
      switch (selectedService) {
        case "ipapi":
          response = await fetch(`https://ipapi.co/${ip}/json/`);
          break;
        case "ip-api":
          response = await fetch(`http://ip-api.com/json/${ip}`);
          break;
        case "geojs":
          response = await fetch(`https://get.geojs.io/v1/ip/geo/${ip}.json`);
          break;
        default:
          throw new Error("Unsupported service selected");
      }

      if (!response.ok) {
        throw new Error(`Failed to fetch IP information for ${ip}`);
      }

      data = await response.json();
      return data;
    } catch (error) {
      return { error: `Error fetching data for ${ip}: ${error.message}` };
    }
  };

  clearInput = () => {
    this.setState({
      input: "",
      output: "",
      error: null,
    });
  };

  copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  saveOutputAsText = () => {
    const { output } = this.state;
    const element = document.createElement("a");
    const file = new Blob([output], { type: "application/json" });
    element.href = URL.createObjectURL(file);
    element.download = "ip_lookup_output.json";
    document.body.appendChild(element);
    element.click();
  };

  handleServiceSelection = (e) => {
    const selectedService = e.target.value;
    this.setState({ selectedService }, () => {
      if (this.state.input) {
        if (this.state.isSingleIPMode) {
          this.fetchIPInfo(this.state.input);
        } else {
          this.fetchBatchIPInfo(this.state.input);
        }
      }
    });
  };

  // Clears relevant caches when switching modes.
  toggleMode = () => {
    this.setState((prevState) => ({
      isSingleIPMode: !prevState.isSingleIPMode,
      input: "", // Reset input when mode changes
      output: "",
      error: null,
      // Clear Single Mode caches when switching away from Single Mode
      ipapiData: prevState.isSingleIPMode ? null : prevState.ipapiData,
      ipApiData: prevState.isSingleIPMode ? null : prevState.ipApiData,
      geoJsData: prevState.isSingleIPMode ? null : prevState.geoJsData,
      ipWhoisData: prevState.isSingleIPMode ? null : prevState.ipWhoisData,
    }));
  };

  getSingleModeCache = (service) => {
    switch (service) {
      case "ipapi":
        return this.state.ipapiData;
      case "ip-api":
        return this.state.ipApiData;
      case "geojs":
        return this.state.geoJsData;
      case "ipwhois":
        return this.state.ipWhoisData;
      default:
        return null;
    }
  };

  updateSingleModeCache = (service, data) => {
    switch (service) {
      case "ipapi":
        this.setState({ ipapiData: data });
        break;
      case "ip-api":
        this.setState({ ipApiData: data });
        break;
      case "geojs":
        this.setState({ geoJsData: data });
        break;
      case "ipwhois":
        this.setState({ ipWhoisData: data });
        break;
      default:
        break;
    }
  };

  getBatchModeCache = (service, ip) => {
    return this.state.batchCaches[service][ip] || null;
  };

  updateBatchModeCache = (service, ip, data) => {
    this.setState((prevState) => ({
      batchCaches: {
        ...prevState.batchCaches,
        [service]: {
          ...prevState.batchCaches[service],
          [ip]: data,
        },
      },
    }));
  };

  render() {
    const { input, output, error, selectedService, isSingleIPMode, isFetching } = this.state;

    return (
      <main className="overflow-y-auto p-4 md:p-6 lg:p-8 xl:p-10 md:pt-4 lg:pt-5 xl:pt-5 h-full">
        <CustomScrollbar />
        <section className="flex flex-col gap-6 h-full">
          <h1 className="text-3xl text-white font-semibold">IP Lookup Tool</h1>

          <section className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex h-12 items-center gap-6 rounded-lg bg-gray-700 px-4 justify-between">
              <span className="text-white">Mode:</span>
              <div className="flex items-center">
                <label className="leading-none cursor-pointer pr-3 text-white">{isSingleIPMode ? "Single IP" : "Batch IP"}</label>
                <button
                  type="button"
                  role="switch"
                  aria-checked={isSingleIPMode}
                  onClick={this.toggleMode}
                  className={`group inline-flex h-6 w-12 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 ease-in-out ${isSingleIPMode ? "bg-blue-600" : "bg-gray-600"}`}
                >
                  <span className={`pointer-events-none block h-4 w-4 rounded-full bg-white shadow-lg transform transition-transform duration-200 ease-in-out ${isSingleIPMode ? "translate-x-7" : "translate-x-1"}`}></span>
                </button>
              </div>
            </div>

            {/* Service Selection */}
            <div className="flex h-12 items-center gap-6 rounded-lg bg-gray-700 px-4 justify-between">
              <span className="text-white">Select IP Lookup Service:</span>
              <select value={selectedService} onChange={this.handleServiceSelection} className="bg-gray-800 text-white rounded-lg p-2.5 outline-none ml-auto pl-3 pr-3">
                {this.getServiceOptions().map((service) => (
                  <option key={service.value} value={service.value}>
                    {service.label}
                  </option>
                ))}
              </select>
            </div>
          </section>

          {/* Input and Output Sections */}
          {isSingleIPMode ? (
            <div className="flex flex-col gap-2">
              <div className="flex justify-between">
                <h2 className="self-end text-lg text-gray-300">IP Address</h2>
                <div className="flex">
                  <button className="text-gray-400 hover:text-white transition-colors mr-[0.9rem]" onClick={this.handleSearch} title="Search">
                    <SearchIcon />
                  </button>
                  <button className="text-gray-400 hover:text-white transition-colors mr-2.5" onClick={this.clearInput} title="Clear Input">
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
                  placeholder="Enter IP address"
                />
              </div>

              {/* Single IP Output */}
              <div className="flex flex-col gap-2 mt-2">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg text-gray-300 ml-0.5">Output</h2>

                  <div className="flex gap-2">
                    <button className="text-gray-400 hover:text-white transition-colors mr-2" onClick={this.saveOutputAsText} title="Save Output">
                      <SaveIcon />
                    </button>
                    <button className="text-gray-400 hover:text-white transition-colors mr-2" onClick={() => this.copyToClipboard(output)} title="Copy Output">
                      <CopyIcon />
                    </button>
                  </div>
                </div>

                <textarea
                  className={`h-[33.6rem] border-2 rounded-lg ${error ? "border-red-600" : "border-gray-600"} bg-gray-800 px-4 py-2 text-gray-300 outline-none placeholder-gray-500 hover:bg-[#2b3544] focus:border-blue-400 focus:bg-[#2b3544] font-mono custom-scrollbar`}
                  placeholder={error || !output ? "" : ""}
                  value={error || output}
                  readOnly
                />
              </div>
            </div>
          ) : (
            <section className="flex flex-col lg:flex-row gap-4 h-full">
              {/* Batch Input */}
              <div className="flex-1 flex flex-col h-full">
                <div className="flex justify-between items-center mb-1.5">
                  <h2 className="text-lg text-gray-300 ml-0.5">Batch Input</h2>
                  <div className="flex items-center">
                    <button className="text-gray-400 hover:text-white transition-colors mr-[0.9rem]" onClick={this.handleSearch} title="Search">
                      <SearchIcon />
                    </button>
                    <button className="text-gray-400 hover:text-white transition-colors mr-2" onClick={this.clearInput} title="Clear Input">
                      <ClearIcon />
                    </button>
                  </div>
                </div>
                <textarea
                  className="flex-1 h-full border-2 rounded-lg border-gray-600 bg-gray-800 px-4 py-2 text-gray-300 outline-none placeholder-gray-500 hover:bg-[#2b3544] focus:border-blue-400 focus:bg-[#2b3544] font-mono custom-scrollbar"
                  placeholder="Enter multiple IP addresses, separated by commas or new lines"
                  value={input}
                  onChange={this.handleInputChange}
                />
              </div>

              {/* Batch Output */}
              <div className="flex-1 flex flex-col h-full">
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-lg text-gray-300">Output</h2>

                  <div className="flex items-center">
                    <button className="text-gray-400 hover:text-white transition-colors mr-3" onClick={() => this.saveOutputAsText()} title="Save Output">
                      <SaveIcon />
                    </button>
                    <button className="text-gray-400 hover:text-white transition-colors mr-2" onClick={() => this.copyToClipboard(output)} title="Copy Output">
                      <CopyIcon />
                    </button>
                  </div>
                </div>
                <textarea
                  className={`flex-1 h-full border-2 rounded-lg ${error ? "border-red-600" : "border-gray-600"} bg-gray-800 px-4 py-2 text-gray-300 outline-none placeholder-gray-500 hover:bg-[#2b3544] focus:border-blue-400 focus:bg-[#2b3544] font-mono custom-scrollbar`}
                  placeholder={error || !output ? "IP Information will appear here" : ""}
                  value={error || output}
                  readOnly
                />
              </div>
            </section>
          )}
        </section>
      </main>
    );
  }
}

export default IPLookup;
