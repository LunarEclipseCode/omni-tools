import React, { Component } from "react";
import debounce from "lodash.debounce";
import { ClearIcon, CopyIcon, SaveIcon } from "../others/Icons"; 
import { CustomScrollbar } from "../others/CustomScrollbar";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkMath from "remark-math";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeKatex from "rehype-katex";
import rehypeReact from "rehype-react";
import "katex/dist/katex.min.css";
import CodeBlock from "./CodeBlock";

class CMDCheatSheet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      languages: [
        { code: "ar", name: "العربية" },
        { code: "bn", name: "বাংলা" },
        { code: "bs", name: "Bosanski" },
        { code: "ca", name: "Català" },
        { code: "cs", name: "Čeština" },
        { code: "da", name: "Dansk" },
        { code: "de", name: "Deutsch" },
        { code: "en", name: "English" },
        { code: "es", name: "Español" },
        { code: "fa", name: "فارسی" },
        { code: "fi", name: "Suomi" },
        { code: "fr", name: "Français" },
        { code: "hi", name: "हिन्दी" },
        { code: "id", name: "Bahasa Indonesia" },
        { code: "it", name: "Italiano" },
        { code: "ja", name: "日本語" },
        { code: "ko", name: "한국어" },
        { code: "lo", name: "ລາວ" },
        { code: "ml", name: "മലയാളം" },
        { code: "ne", name: "नेपाली" },
        { code: "nl", name: "Nederlands" },
        { code: "no", name: "Polski" },
        { code: "pl", name: "Polish" },
        { code: "pt_BR", name: "Português (Brasil)" },
        { code: "pt_PT", name: "Português (Portugal)" },
        { code: "ro", name: "Română" },
        { code: "ru", name: "Русский" },
        { code: "sh", name: "Srpskohrvatski" },
        { code: "sr", name: "Српски" },
        { code: "sv", name: "Svenska" },
        { code: "ta", name: "தமிழ்" },
        { code: "th", name: "ไทย" },
        { code: "tr", name: "Türkçe" },
        { code: "uk", name: "Українська" },
        { code: "uz", name: "Oʻzbek" },
        { code: "zh", name: "简体中文" },
        { code: "zh_TW", name: "繁體中文" },
      ],
      selectedLanguage: "en",
      categories: {
        ar: ["common", "linux", "windows"], 
        bn: ["android", "common", "linux", "osx", "sunos", "windows"],
        bs: ["common", "linux", "windows"],
        ca: ["common", "linux", "windows"],
        cs: ["common", "windows"],
        da: ["common", "linux", "windows"],
        de: ["android", "common", "linux", "osx", "windows"],
        en: ["android", "common", "freebsd", "linux", "netbsd", "openbsd", "osx", "sunos", "windows"], 
        es: ["android", "common", "freebsd", "linux", "netbsd", "osx", "windows"],
        fa: ["android", "common", "linux", "windows"],
        fi: ["linux"],
        fr: ["android", "common", "linux", "osx", "sunos", "windows"],
        hi: ["android", "common", "linux", "osx", "sunos", "windows"],
        id: ["android", "common", "freebsd", "linux", "netbsd", "openbsd", "osx", "sunos", "windows"],
        it: ["android", "common", "linux", "osx", "windows"],
        ja: ["common", "linux", "windows"],
        ko: ["android", "common", "freebsd", "linux", "netbsd", "openbsd", "osx", "sunos", "windows"],
        lo: ["common", "linux", "windows"],
        ml: ["common", "linux", "windows"],
        ne: ["android", "common", "linux", "osx", "windows"],
        nl: ["android", "common", "freebsd", "linux", "netbsd", "openbsd", "osx", "sunos", "windows"],
        no: ["common", "linux", "windows"],
        pl: ["android", "common", "linux", "openbsd", "osx", "sunos", "windows"],
        pt_BR: ["android", "common", "freebsd", "linux", "osx", "windows"],
        pt_PT: ["android", "common", "linux", "osx", "windows"],
        ro: ["android", "common", "linux", "osx", "windows"],
        ru: ["android", "common", "linux", "osx", "sunos", "windows"],
        sh: ["common"],
        sr: ["common"],
        sv: ["common", "linux", "windows"],
        ta: ["android", "common", "linux", "osx", "sunos", "windows"],
        th: ["common", "linux", "osx", "windows"],
        tr: ["android", "common", "linux", "osx", "sunos", "windows"],
        uk: ["android", "common", "linux", "windows"],
        uz: ["android"],
        zh: ["android", "common", "linux", "osx", "sunos", "windows"],
        zh_TW: ["android", "common", "linux", "osx", "windows"],
      },
      manifest: null, // Add a state for storing the manifest
      selectedCategory: "All",
      inputCommand: "",
      outputContents: [],
      outputReact: [],
      error: null,
      loading: false,
      loadingTimeout: null, // Add a timeout reference to manage loading display
      displayedResults: 30, // Show 30 results initially
      totalResults: 0, 
    };

    this.debouncedSearch = debounce(this.handleSearch, 0);
    this.latestRequestId = 0;
  }

  // Load the manifest file once the component is mounted
  async componentDidMount() {
    try {
      const response = await fetch("/tldr/manifest.json");
      if (!response.ok) {
        throw new Error("Failed to load manifest.");
      }
      const manifest = await response.json();
      this.setState({ manifest });
    } catch (error) {
      console.error("Failed to load the manifest:", error);
      this.setState({ error: "Failed to load command manifest." });
    }
  }

  handleLanguageChange = (e) => {
    const selectedLanguage = e.target.value;
    this.setState(
      {
        selectedLanguage,
        selectedCategory: "All",
        outputContents: [],
        outputReact: [],
        error: null,
      },
      () => {
        if (this.state.inputCommand.trim() !== "") {
          this.debouncedSearch();
        }
      }
    );
  };

  handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;
    this.setState(
      {
        selectedCategory,
        outputContents: [],
        outputReact: [],
        error: null,
      },
      () => {
        if (this.state.inputCommand.trim() !== "") {
          this.debouncedSearch();
        }
      }
    );
  };

  handleInputChange = (e) => {
    this.setState({ inputCommand: e.target.value, displayedResults: 30 }, () => {
      this.debouncedSearch();
    });
  };

  handleSearch = async () => {
    const { selectedLanguage, selectedCategory, inputCommand, manifest, outputContents, error } = this.state;
    const command = inputCommand.trim().toLowerCase().replace(/\s+/g, "-"); // Normalize input command

    // Increment the request ID to avoid race conditions
    this.latestRequestId += 1;
    const currentRequestId = this.latestRequestId;

    if (command === "" || !manifest) {
      clearTimeout(this.state.loadingTimeout);
      this.setState({
        outputContents: [],
        outputReact: [],
        error: null,
        loading: false,
        loadingTimeout: null,
        totalResults: 0,
      });
      return;
    }

    const languageManifest = manifest[selectedLanguage];
    let categoriesToSearch = [];

    // If 'All' is selected, search across all categories for the current language
    if (selectedCategory === "All") {
      categoriesToSearch = Object.keys(languageManifest);
    } else {
      categoriesToSearch.push(selectedCategory);

      // Include 'common' category if it's available and the current category is not 'common'
      if (selectedCategory !== "common" && languageManifest.common) {
        categoriesToSearch.push("common");
      }
    }

    // Step 1: Find all matching commands across all selected categories
    let matchingCommands = [];
    for (let category of categoriesToSearch) {
      if (languageManifest[category]) {
        const matches = languageManifest[category].filter((cmd) => cmd.startsWith(command));
        if (matches.length > 0) {
          matches.forEach((cmd) => {
            matchingCommands.push({
              category,
              command: cmd,
            });
          });
        }
      }
    }

    if (matchingCommands.length === 0) {
      clearTimeout(this.state.loadingTimeout);
      this.setState({ loadingTimeout: null, totalResults: 0 });

      if (error !== "Command not found.") {
        this.setState({
          error: "Command not found.",
          outputContents: [],
          outputReact: [],
          loading: false,
        });
      }
      return;
    }

    // Step 2: Sort matching commands by the command name (alphabetically)
    matchingCommands.sort((a, b) => a.command.localeCompare(b.command));

    const totalResults = matchingCommands.length;

    clearTimeout(this.state.loadingTimeout);
    const loadingTimeout = setTimeout(() => {
      if (currentRequestId === this.latestRequestId) {
        this.setState({ loading: true });
      }
    }, 500); // Delay loading by 500ms
    this.setState({ loadingTimeout });

    try {
      // Step 3: Fetch the first 30 matching results (sorted)
      const fetchPromises = [];
      matchingCommands.slice(0, 30).forEach(({ category, command }) => {
        const filePath = `/tldr/pages.${selectedLanguage}/${category}/${command}.md`;
        fetchPromises.push(this.fetchCommandMarkdown(filePath, category));
      });

      const fetchedResults = await Promise.all(fetchPromises);
      const validResults = fetchedResults.filter((result) => result !== null);

      if (validResults.length === 0) {
        throw new Error("No matching commands found.");
      }

      if (currentRequestId !== this.latestRequestId) {
        return; // Ignore outdated responses
      }

      const processedResults = await Promise.all(
        validResults.map(async ({ category, markdown }) => {
          const reactElement = await this.processMarkdown(markdown);
          return { category, reactElement };
        })
      );

      clearTimeout(this.state.loadingTimeout);
      this.setState({
        loadingTimeout: null,
        loading: false,
        outputReact: processedResults.map((result) => ({
          category: result.category,
          element: result.reactElement,
        })),
        totalResults, // Set the total number of results
        error: null,
      });
    } catch (error) {
      if (currentRequestId !== this.latestRequestId) {
        return; 
      }

      clearTimeout(this.state.loadingTimeout);
      this.setState({ loadingTimeout: null, loading: false });

      if (this.state.error !== error.message) {
        this.setState({ outputContents: [], outputReact: [], error: error.message, loading: false });
      }
    }
  };

  loadMoreResults = async () => {
    const { selectedLanguage, displayedResults, totalResults, inputCommand, manifest, selectedCategory } = this.state;

    const command = inputCommand.trim().toLowerCase().replace(/\s+/g, "-"); // Normalize input command
    const languageManifest = manifest[selectedLanguage];
    let categoriesToSearch = [];

    if (selectedCategory === "All") {
      categoriesToSearch = Object.keys(languageManifest);
    } else {
      categoriesToSearch.push(selectedCategory);

      if (selectedCategory !== "common" && languageManifest.common) {
        categoriesToSearch.push("common");
      }
    }

    let matchingCommands = [];
    for (let category of categoriesToSearch) {
      if (languageManifest[category]) {
        const matches = languageManifest[category].filter((cmd) => cmd.startsWith(command));
        if (matches.length > 0) {
          matchingCommands.push({
            category,
            commands: matches,
          });
        }
      }
    }

    if (matchingCommands.length === 0 || displayedResults >= totalResults) {
      return;
    }

    const newDisplayedResults = Math.min(displayedResults + 30, totalResults);

    // Fetch the next batch of results
    const fetchPromises = [];
    let resultsToShow = 0;
    matchingCommands.forEach(({ category, commands }) => {
      commands.slice(displayedResults, newDisplayedResults - resultsToShow).forEach((command) => {
        const filePath = `/tldr/pages.${selectedLanguage}/${category}/${command}.md`;
        fetchPromises.push(this.fetchCommandMarkdown(filePath, category));
      });
      resultsToShow += Math.min(newDisplayedResults - displayedResults, commands.length);
      if (resultsToShow >= newDisplayedResults - displayedResults) return;
    });

    const fetchedResults = await Promise.all(fetchPromises);
    const validResults = fetchedResults.filter((result) => result !== null);

    const processedResults = await Promise.all(
      validResults.map(async ({ category, markdown }) => {
        const reactElement = await this.processMarkdown(markdown);
        return { category, reactElement };
      })
    );

    this.setState((prevState) => ({
      outputReact: [
        ...prevState.outputReact,
        ...processedResults.map((result) => ({
          category: result.category,
          element: result.reactElement,
        })),
      ],
      displayedResults: newDisplayedResults, // Update the number of displayed results
    }));
  };

  fetchCommandMarkdown = async (filePath, category) => {
    try {
      const exists = await this.checkFileExists(filePath);
      if (exists) {
        const response = await fetch(filePath);
        if (!response.ok) {
          throw new Error(`Failed to fetch the command markdown file for ${filePath}`);
        }
        const markdown = await response.text();
        return { category, markdown };
      }
      return null;
    } catch (error) {
      console.error(`Error fetching ${filePath}:`, error);
      return null;
    }
  };

  checkFileExists = async (url) => {
    try {
      const response = await fetch(url, { method: "HEAD" });
      return response.ok;
    } catch {
      return false;
    }
  };

  processMarkdown = async (markdown) => {
    try {
      const processedResult = await unified()
        .use(remarkParse)
        .use(remarkMath)
        .use(remarkGfm)
        .use(remarkRehype)
        .use(rehypeKatex)
        .use(rehypeReact, {
          createElement: React.createElement,
          components: {
            pre: (props) => {
              const child = props.children[0];
              if (child && child.props && child.props.className) {
                const className = child.props.className || "";
                const language = className.replace("language-", "");

                // Render code blocks with syntax highlighting
                return <CodeBlock className={className}>{child.props.children}</CodeBlock>;
              }
              // Default rendering for pre elements without className
              return <pre {...props} />;
            },
          },
        })
        .process(markdown);

      return processedResult.result;
    } catch (error) {
      console.error("Error processing markdown:", error);
      this.setState({ error: "Error processing markdown." });
      return null;
    }
  };

  clearInput = () => {
    this.setState({
      inputCommand: "",
      outputContents: [],
      outputReact: [],
      error: null,
      loading: false,
      displayedResults: 30,
    });
  };

  copyToClipboard = () => {
    const { outputContents } = this.state;
    if (outputContents.length > 0) {
      // Combine all markdown contents with separators
      const combinedContent = outputContents.join("\n\n---\n\n"); 
      navigator.clipboard.writeText(combinedContent);
    }
  };

  saveOutputAsText = () => {
    const { outputContents } = this.state;
    if (!outputContents.length) return;
    const combinedContent = outputContents.join("\n\n---\n\n");

    const element = document.createElement("a");
    const file = new Blob([combinedContent], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "cmd_cheat_sheet.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  saveOutputAsHTML = () => {
    const { outputReact } = this.state;
    if (!outputReact.length) return;

    import("react-dom/server")
      .then((ReactDOMServer) => {
        // Combine all React elements into a single HTML string
        const htmlString = outputReact
          .map((item) => {
            // Render each React element to static markup and prepend category label
            const categoryLabel = `<div style="position: absolute; top: 10px; right: 10px; background-color: #3b82f6; color: white; padding: 5px 10px; border-radius: 4px; font-size: 12px;">${this.capitalizeCategory(item.category)}</div>`;
            const elementHtml = ReactDOMServer.renderToStaticMarkup(item.element);
            return `<div style="position: relative; margin-bottom: 20px;">${categoryLabel}${elementHtml}</div>`;
          })
          .join("\n");

        const element = document.createElement("a");
        const file = new Blob([htmlString], { type: "text/html" });
        element.href = URL.createObjectURL(file);
        element.download = "cmd_cheat_sheet.html";
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
      })
      .catch((err) => console.error("Error saving HTML:", err));
  };

  // Handle capitalization of specific OS
  capitalizeCategory = (category) => {
    switch (category) {
      case "common":
      case "linux":
      case "windows":
      case "android":
        return category.charAt(0).toUpperCase() + category.slice(1);
      case "osx":
        return "macOS";
      case "sunos":
        return "SunOS";
      case "freebsd":
        return "FreeBSD";
      case "netbsd":
        return "NetBSD";
      case "openbsd":
        return "OpenBSD";
      default:
        return category;
    }
  };

  render() {
    const { languages, selectedLanguage, categories, selectedCategory, inputCommand, outputReact, error, loading, displayedResults, totalResults } = this.state;

    const currentCategories = categories[selectedLanguage] || [];

    return (
      <main className="overflow-y-auto p-4 md:p-6 lg:p-8 xl:p-10 md:pt-4 lg:pt-5 xl:pt-5 h-full bg-gray-900">
        <CustomScrollbar />
        <section className="flex flex-col h-full">
          <h1 className="text-3xl text-white font-semibold">Command-Line Cheat Sheet</h1>

          {/* Language and Category Selection */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-7 mb-4">
            <div className="flex h-[3.2rem] items-center gap-6 rounded-lg bg-gray-800 px-4">
              <span className="text-white flex-1">Language</span>
              <select value={selectedLanguage} onChange={this.handleLanguageChange} className="h-[2.45rem] w-48 bg-gray-700 text-white px-2 rounded-lg custom-scrollbar">
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
              <style>{`
          .custom-scrollbar::-webkit-scrollbar {
            width: 0.5em;
          }

          .custom-scrollbar::-webkit-scrollbar-track {
            background-color: #334155;
          }

          .custom-scrollbar::-webkit-scrollbar-thumb {
            background-color: #4b5563;
            border-radius: 0.5em;
          }

          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background-color: #9ca3af;
            
          }
        `}</style>
            </div>

            <div className="flex h-[3.2rem] items-center gap-6 rounded-lg bg-gray-800 px-4">
              <span className="text-white flex-1">Category</span>
              <select value={selectedCategory} onChange={this.handleCategoryChange} className="h-[2.45rem] w-48 bg-gray-700 text-white px-2 rounded-lg">
                {currentCategories.length === 1 ? (
                  <option value={currentCategories[0]}>{this.capitalizeCategory(currentCategories[0])}</option>
                ) : (
                  <>
                    {/* Don't show 'All' if there's only one category */}
                    <option value="All">All</option>
                    {currentCategories.map((category) => (
                      <option key={category} value={category}>
                        {this.capitalizeCategory(category)}
                      </option>
                    ))}
                  </>
                )}
              </select>
            </div>
          </section>

          <section className="flex flex-col gap-1.5">
            <div className="flex justify-between">
              <h2 className="self-end text-lg text-gray-300">Input Command</h2>
              <div className="flex">
                <button className="text-gray-400 hover:text-white transition-colors mr-2" onClick={this.clearInput} title="Clear Input">
                  <ClearIcon />
                </button>
              </div>
            </div>
            <div className="flex items-center border-b-2 border-gray-600 bg-gray-800 rounded-lg">
              <input
                className="h-10 flex-grow bg-transparent px-4 py-2 text-white outline-none placeholder-gray-500 hover:bg-[#2b3544] focus:border-blue-400 focus:bg-[#2b3544] font-mono rounded-md"
                spellCheck="false"
                value={inputCommand}
                onChange={this.handleInputChange}
                placeholder="Enter a command to get its cheat sheet"
              />
            </div>
          </section>

          <section className="flex flex-col gap-2 mt-6">
            <div className="flex justify-between mb-2">
              <h2 className="self-end text-lg text-gray-300">Results</h2>
            </div>

            {/* Show the content if available */}
            {loading ? (
              <p className="text-gray-500">Loading...</p>
            ) : outputReact.length > 0 ? (
              <>
                <div className="text-gray-300 space-y-6 overflow-auto custom-scrollbar markdown-output bg-transparent rounded-lg">
                  {outputReact.map((item, index) => (
                    <div key={index} className="relative bg-gray-800 p-4 rounded-lg">
                      {/* Category Label */}
                      <span className="absolute top-2 right-2 bg-gray-700 text-white text-sm px-2 py-1 rounded">{this.capitalizeCategory(item.category)}</span>
                      {/* Cheat Sheet Content */}
                      {item.element}
                    </div>
                  ))}
                </div>
                {displayedResults < totalResults && (
                  <button className="w-28 mt-4 py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none" onClick={this.loadMoreResults}>
                    Load More
                  </button>
                )}
              </>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : (
              <p className="text-gray-500">No output available.</p>
            )}
          </section>
        </section>

        <style>
          {`
            html, body, #root {
              overflow: hidden;
            }

            .flex-1 {
              flex: 1 1 0%;
            }

            .equal-width > div {
              flex: 1;
              min-width: 0;
            }

            .markdown-output h1 {
              font-size: 2em;
              font-weight: bold;
              margin-bottom: 0.5em;
            }
            .markdown-output h2 {
              font-size: 1.75em;
              font-weight: bold;
              margin-bottom: 0.5em;
            }
            .markdown-output h3 {
              font-size: 1.5em;
              font-weight: bold;
              margin-bottom: 0.5em;
            }
            .markdown-output p {
              margin-bottom: 1em;
            }
            .markdown-output ul {
              list-style-type: disc;
              margin-left: 1.5em;
            }
            .markdown-output ol {
              list-style-type: decimal;
              margin-left: 1.5em;
            }
            .markdown-output code {
              background-color: #111827;
              padding: 0.25em 0.45em;
              border-radius: 4px;
            }
            .markdown-output blockquote {
              border-left: 4px solid #6b7280;
              padding-left: 1em;
              margin-left: 0.5em;
              color: #9ca3af;
            }
            .markdown-output strong {
              font-weight: bold;
            }
            .markdown-output em {
              font-style: italic;
            }
            .markdown-output pre {
              background: transparent;
              padding: 1em;
              border-radius: 4px;
              overflow: auto;
            }
            .markdown-output pre code {
              background: none;
              padding: 0;
            }
            .markdown-output a {
              color: #3b82f6;
              text-decoration: underline;
            }
            .markdown-output table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 1em;
            }
            .markdown-output th,
            .markdown-output td {
              border: 1px solid #374151;
              padding: 0.5em;
            }
            .markdown-output th {
              background-color: #1f2937;
            }

            /* Style for regular code blocks with spacing */
            .markdown-output pre:not(.mermaid) {
              background-color: #111827;
              padding: 1em;
              border-radius: 4px;
              margin-bottom: 1.5em; /* Adds spacing between code blocks */
              overflow-x: auto; /* Enables horizontal scrolling */
              overflow-y: hidden;
              scrollbar-width: thin; /* For Firefox */
              scrollbar-color: #3b82f6 #2b3544; /* For Firefox - thumb color and track color */
            }

            .markdown-output pre::-webkit-scrollbar {
              height: 8px; 
            }

            .markdown-output pre::-webkit-scrollbar-track {
              background: #2b3544; /* Background of the scrollbar track */
            }

            .markdown-output pre::-webkit-scrollbar-thumb {
              background-color: #3b82f6; /* Scrollbar thumb (handle) color */
              border-radius: 4px;
            }

            /* Category Label Styling */
            .markdown-output .relative {
              position: relative;
            }
            .markdown-output .absolute {
              position: absolute;
            }

            /* Apply margin only to block-level code elements */
            .markdown-output pre code, /* Code inside <pre> elements */
            .markdown-output div > code, 
            .markdown-output p > code:only-child {
              display: inline; 
              margin-left: 1.5em; 
              padding: 0.45em 0.6em;
            }

            .markdown-output li {
              margin-bottom: 0.4em;
            }

            /* Ensure inline code snippets remain unaffected */
            .markdown-output p code:not(:only-child) {
              display: inline; 
              margin-left: 0; /* No margin for inline code */
            }

          `}
        </style>
      </main>
    );
  }
}

export default CMDCheatSheet;
