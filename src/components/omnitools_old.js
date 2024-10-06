import React, { Component } from "react";
import JsonToYamlConverter from "./tools/JsonToYamlConverter";
import BaseConverter from "./tools/BaseConverter";
import HashGenerator from "./tools/HashGenerator";
import PasswordGenerator from "./tools/PasswordGenerator";
import LoremIpsumGenerator from "./tools/LoremIpsumGenerator";
import CodeFormatter from "./tools/CodeFormatter";
import MorseEncoderDecoder from "./tools/MorseEncoderDecoder";
import ToolItem from "./others/ToolItem";
import QrCodeEncoderDecoder from "./tools/QrCodeEncoderDecoder";
import BaseEncoderDecoder from "./tools/BaseEncoderDecoder";
import ColorConverter from "./tools/ColorConverter";
import AesEncrypterDecrypter from "./tools/AesEncrypterDecrypter";
import UUIDGenerator from "./tools/UUIDGenerator";
import UrlEncoderDecoder from "./tools/URLEncoderDecoder";
import HtmlEncoderDecoder from "./tools/HtmlEncoderDecoder";
import GzipCompressDecompress from "./tools/GzipCompressDecompress";
import SvgOptimizer from "./tools/SvgOptimizer";
import MarkdownRenderer from "./tools/MarkdownRenderer";
import KeyPairGenerator from "./tools/KeyPairGenerator";
import BooleanSimplifier from "./tools/BooleanSimplifier";
import IPLookup from "./tools/IPLookup";
import ColorBlindnessSimulator from "./tools/ColorBlindSim";
import TruthTableGenerator from "./tools/TruthTableGenerator";
import CMDCheatSheet from "./tools/CMDCheatSheet";
import CodeCommentTranslator from "./tools/CodeCommentTranslator";
import CodeMinifier from "./tools/CodeMinifier";
import BrailleTranslator from "./tools/BraileTranslator";
import DateConverter from "./tools/DateConverter";
import {
  JsonYamlIcon,
  BaseConverterIcon,
  HashGeneratorIcon,
  PasswordGeneratorIcon,
  LoremIpsumGeneratorIcon,
  CodeFormatterIcon,
  MorseEncoderDecoderIcon,
  QRCodeIcon,
  BaseEncoderDecoderIcon,
  ColorConverterIcon,
  AES256Icon,
  UUIDGeneratorIcon,
  UrlEncoderDecoderIcon,
  HtmlEncoderDecoderIcon,
  GzipCompressDecompressIcon,
  MarkdownIcon,
  SvgIcon,
  CodeMinifierIcon,
  KeyPairGeneratorIcon,
  KeyPairGeneratorIcon2,
  LogicEquationIcon,
  IPLookupIcon,
  ColorBlindSimIcon,
  CommandLineIcon,
  TranslatorIcon,
  TimestampConverterIcon,
  TruthTableIcon,
} from "./others/Icons";

const tools = [
  {
    toolName: "Json <> Yaml Converter",
    component: "jsonToYaml",
    icon: JsonYamlIcon,
    description: "Convert data easily between JSON and YAML format",
  },
  {
    toolName: "Number Base Converter",
    component: "baseConverter",
    icon: BaseConverterIcon,
    description: "Convert numbers between different bases",
  },
  {
    toolName: "Hash Generator",
    component: "hashGenerator",
    icon: HashGeneratorIcon,
    description: "Generate cryptographic hashes from any text input",
  },
  {
    toolName: "Password Generator",
    component: "passwordGenerator",
    icon: PasswordGeneratorIcon,
    description: "Generate random passwords",
  },
  {
    toolName: "Lorem Ipsum Generator",
    component: "loremipsumGenerator",
    icon: LoremIpsumGeneratorIcon,
    description: "Generate placeholder text for designs and prototypes",
  },
  {
    toolName: "Code Beautifier / Formatter",
    component: "codeFormatter",
    icon: CodeFormatterIcon,
    description: "Make your code prettier with better readability",
  },
  {
    toolName: "Morse Code Encoder/Decoder",
    component: "morseEncoderDecoder",
    icon: MorseEncoderDecoderIcon,
    description: "Convert text to Morse code and vice versa",
  },
  {
    toolName: "QR Code Encoder/Decoder",
    component: "qrCodeEncoderDecoder",
    icon: QRCodeIcon,
    description: "Encode or decode QR Code",
  },
  {
    toolName: "Base Encoder/Decoder",
    component: "baseEncoderDecoder",
    icon: BaseEncoderDecoderIcon,
    description: "Encode or decode text using various base encodings",
  },
  {
    toolName: "Color Converter",
    component: "colorConverter",
    icon: ColorConverterIcon,
    description: "Convert color code between different conventions",
  },
  {
    toolName: "AES256 Encrypter/Decrypter",
    component: "aesEncrypterDecrypter",
    icon: AES256Icon,
    description: "Encrypt or decrypt your text using AES256-GCM",
  },
  {
    toolName: "UUID Generator",
    component: "uuidGenerator",
    icon: UUIDGeneratorIcon,
    description: "Generate UUIDs version 1, 4, 6, and 7",
  },
  {
    toolName: "URL Encoder/Decoder",
    component: "urlEncoderDecoder",
    icon: UrlEncoderDecoderIcon,
    description: "Encode or decode applicable characters to their URL entities",
  },
  {
    toolName: "HTML Encoder/Decoder",
    component: "htmlEncoderDecoder",
    icon: HtmlEncoderDecoderIcon,
    description: "Encode and decode HTML text data",
  },
  {
    toolName: "Gzip Compress/Decompress",
    component: "gzipCompressDecompress",
    icon: GzipCompressDecompressIcon,
    description: "Compress or decompress a text in GZip",
  },
  {
    toolName: "Markdown Renderer",
    component: "markdownRenderer",
    icon: MarkdownIcon,
    description: "Preview Markdown text with tables, equations, UML diagrams, and code syntax highlighting",
  },
  {
    toolName: "SVG Optimizer",
    component: "svgOptimizer",
    icon: SvgIcon,
    description: "Optimize SVG files to reduce file size",
  },
  {
    toolName: "Key Pair Generator",
    component: "keypairGenerator",
    icon: KeyPairGeneratorIcon,
    description: "Generate public and private key pairs for RSA and ECDSA encryption",
  },
  {
    toolName: "Logic Equation Simplifier",
    component: "booleanSimplifier",
    icon: LogicEquationIcon,
    description: "Simplify complex Boolean logic equations step by step",
  },
  {
    toolName: "IP Lookup",
    component: "ipLookup",
    icon: IPLookupIcon,
    description: "Batch retrieve detailed info about multiple IP addresses",
  },
  {
    toolName: "Color Blindness Simulator",
    component: "colorBlindnessSimulator",
    icon: ColorBlindSimIcon,
    description: "Shows how color appears to people with different types of color blindness.",
  },
  {
    toolName: "Truth Table Generator",
    component: "truthTableGenerator",
    icon: TruthTableIcon,
    description: "Generate truth tables for logical expressions",
  },
  {
    toolName: "Command Line CheatSheet",
    component: "cmdCheatSheet",
    icon: CommandLineIcon,
    description: "Access a quick reference for common command-line instructions in multiple languages",
  },
  {
    toolName: "Code Comment Translator",
    component: "codeCommentTranslator",
    icon: TranslatorIcon,
    description: "Translate only the comments of a codeblock",
  },
  {
    toolName: "Code Minifier",
    component: "codeMinifier",
    icon: CodeMinifierIcon,
    description: "Minify code to reduce file size",
  },
  // {
  //   toolName: "Braile Translator",
  //   component: "braileTranslator",
  //   icon: SvgIcon,
  //   description: "Optimize SVG files to reduce file size",
  // },
  {
    toolName: "Timestamp Converter",
    component: "dateConverter",
    icon: TimestampConverterIcon,
    description: "Convert between human-readable dates and UNIX timestamps.",
  },
];

class OmniTools extends Component {
  constructor() {
    super();
    this.state = {
      selectedTool: null,
      showTopBar: false,
      searchQuery: "",
      isSidebarOpen: false,
      homeScrollPosition: 0,
      lastNavigationSource: 'home',
    };
    this.scrollableRef = React.createRef();
    this.sidebarRef = React.createRef(); // Ref to detect clicks outside the sidebar
  }

  componentDidMount() {
    // Add a click event listener to detect clicks outside the sidebar
    document.addEventListener("mousedown", this.handleClickOutside);
  }

  componentDidUpdate(prevProps, prevState) {
    // Check if we've just navigated back to the home screen
    if (prevState.selectedTool !== this.state.selectedTool && this.state.selectedTool === null) {
      // Restore the scroll position
      if (this.scrollableRef.current) {
        this.scrollableRef.current.scrollTop = this.state.homeScrollPosition;
      }
    }
  }
  

  componentWillUnmount() {
    // Remove the event listener when the component unmounts
    document.removeEventListener("mousedown", this.handleClickOutside);
  }

  handleClickOutside = (event) => {
    // Check if the sidebar is open and the click happened outside the sidebar
    if (this.state.isSidebarOpen && this.sidebarRef.current && !this.sidebarRef.current.contains(event.target)) {
      this.setState({ isSidebarOpen: false }); // Close the sidebar
    }
  };

  handleCardClick = (tool) => {
    const { selectedTool } = this.state;
  
    // Save the current scroll position only if navigating from home
    if (selectedTool === null && this.scrollableRef.current) {
      const currentScrollTop = this.scrollableRef.current.scrollTop;
      this.setState({ homeScrollPosition: currentScrollTop });
    }
  
    this.setState({
      selectedTool: tool,
      showTopBar: true,
      isSidebarOpen: false, // Close sidebar when a tool is selected
      lastNavigationSource: selectedTool === null ? 'home' : 'tool', // Update navigation source
    });
  };
  

  handleBackToHome = () => {
    this.setState(
      {
        selectedTool: null,
        showTopBar: false,
        searchQuery: "", // **Reset the search query here**
        lastNavigationSource: 'home', // Update navigation source
      },
      () => {
        // Restore the scroll position after state update
        if (this.scrollableRef.current) {
          this.scrollableRef.current.scrollTop = this.state.homeScrollPosition;
        }
      }
    );
  };
  

  handleSearchInput = (e) => {
    this.setState({ searchQuery: e.target.value });
  };

  clearSearch = () => {
    this.setState({ searchQuery: "" });
  };

  toggleSidebar = () => {
    this.setState((prevState) => ({
      isSidebarOpen: !prevState.isSidebarOpen, // Toggle the sidebar open/close
    }));
  };

  // Filter tools based on search query
  filterTools = (tools) => {
    const { searchQuery } = this.state;
    if (!searchQuery) return tools; // Return all tools if searchQuery is empty
    const lowerCaseQuery = searchQuery.toLowerCase();
    return tools.filter((tool) =>
      tool.toolName.toLowerCase().includes(lowerCaseQuery) ||
      tool.description.toLowerCase().includes(lowerCaseQuery)
    );
  };

  renderToolContent = () => {
    switch (this.state.selectedTool) {
      case "jsonToYaml":
        return <JsonToYamlConverter />;
      case "baseConverter":
        return <BaseConverter />;
      case "hashGenerator":
        return <HashGenerator />;
      case "passwordGenerator":
        return <PasswordGenerator />;
      case "loremipsumGenerator":
        return <LoremIpsumGenerator />;
      case "codeFormatter":
        return <CodeFormatter />;
      case "morseEncoderDecoder":
        return <MorseEncoderDecoder />;
      case "qrCodeEncoderDecoder":
        return <QrCodeEncoderDecoder />;
      case "baseEncoderDecoder":
        return <BaseEncoderDecoder />;
      case "colorConverter":
        return <ColorConverter />;
      case "aesEncrypterDecrypter":
        return <AesEncrypterDecrypter />;
      case "uuidGenerator":
        return <UUIDGenerator />;
      case "urlEncoderDecoder":
        return <UrlEncoderDecoder />;
      case "htmlEncoderDecoder":
        return <HtmlEncoderDecoder />;
      case "gzipCompressDecompress":
        return <GzipCompressDecompress />;
      case "markdownRenderer":
        return <MarkdownRenderer />;
      case "svgOptimizer":
        return <SvgOptimizer />;
      case "keypairGenerator":
        return <KeyPairGenerator />;
      case "booleanSimplifier":
        return <BooleanSimplifier />;
      case "ipLookup":
        return <IPLookup />;
      case "colorBlindnessSimulator":
        return <ColorBlindnessSimulator />;
      case "truthTableGenerator":
        return <TruthTableGenerator />;
      case "cmdCheatSheet":
        return <CMDCheatSheet />;
      case "codeCommentTranslator":
        return <CodeCommentTranslator />;
      case "codeMinifier":
        return <CodeMinifier />;
      case "braileTranslator":
        return <BrailleTranslator />;
      case "dateConverter":
        return <DateConverter />;
      default:
        return this.renderHomeScreen();
    }
  };

  renderSidebar = () => {
    const sortedTools = tools.sort((a, b) => a.toolName.localeCompare(b.toolName));
    return (
      <div ref={this.sidebarRef} className={`z-50 fixed top-0 left-0 h-full w-[19rem] bg-gray-900 text-white transform transition-transform duration-300 ${this.state.isSidebarOpen ? "translate-x-0" : "-translate-x-[19rem]"}`}>
        <div className="p-4 h-full overflow-y-auto custom-scrollbar">
          <h2 className="text-2xl font-bold mb-4 pl-2">Tools</h2>
          <ul className="space-y-1">
            {sortedTools.map((tool) => (
              <li key={tool.component} className="cursor-pointer hover:bg-gray-700 p-1 rounded flex items-center overflow-hidden" onClick={() => this.handleCardClick(tool.component)}>
                <div className="h-8 w-8 mr-2 flex items-center justify-center">
                  {tool.icon && <tool.icon className="object-cover h-full w-full pointer-events-none" />}
                  {tool.altText && <span className="sr-only">{tool.altText}</span>}
                </div>
                {tool.toolName}
              </li>
            ))}
          </ul>
          <style jsx>{`
            .custom-scrollbar::-webkit-scrollbar {
              width: 0.5em;
            }

            .custom-scrollbar::-webkit-scrollbar-track {
              background-color: #1f2937;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb {
              background-color: #4b5563;
              border-radius: 10px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb:hover {
              background-color: #9ca3af;
            }
          `}</style>
        </div>
      </div>
    );
  };

  renderHomeScreen = () => {
    // Filter tools based on search query
    const filteredTools = this.filterTools(tools.sort((a, b) => a.toolName.localeCompare(b.toolName)));

    return (
      <div className="p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold text-white">Omni Tools</h1>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <input type="text" placeholder="Search tools..." value={this.state.searchQuery} className="px-4 py-2 rounded-lg bg-gray-800 text-white outline-none focus:ring-2 focus:ring-blue-400" onChange={this.handleSearchInput} />

              {this.state.searchQuery && (
                <button onClick={this.clearSearch} className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              )}
            </div>

            <a href="https://github.com/LunarEclipseCode/omni-tools" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
              <svg width="35" height="31" xmlns="http://www.w3.org/2000/svg">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0112.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z"
                  fill="currentColor"
                  transform="scale(0.31)"
                />
              </svg>
            </a>
          </div>
        </div>

        <div className="grid gap-3 xl:gap-4 grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 mt-4">
          {filteredTools.map((tool) => (
            <ToolItem key={tool.component} onClick={() => this.handleCardClick(tool.component)} IconComponent={tool.icon} toolName={tool.toolName} description={tool.description} />
          ))}
        </div>
      </div>
    );
  };

  render() {
    const isSidebarOpen = this.state.isSidebarOpen;

    return (
      <div className="w-full h-screen flex flex-col bg-gray-900 text-white select-none overflow-y-auto custom-appscrollbar" ref={this.scrollableRef}>
        {this.state.showTopBar && (
          <div className="flex items-center justify-between w-full bg-gray-800 bg-opacity-60 text-sm p-2 py-1.5 px-7 md:px-9 lg:px-11 xl:px-14 xl:pl-12">
            <div className="flex items-center space-x-2">
              <button onClick={this.toggleSidebar} className="p-1.5 rounded hover:bg-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                  <line x1="3" y1="12" x2="21" y2="12"></line>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
              </button>

              <button onClick={this.handleBackToHome} className="p-2 rounded hover:bg-gray-700">
                <svg height="24" width="24" version="1.1" id="_x32_" xmlns="http://www.w3.org/2000/svg" viewBox="0 30 512 512" fill="currentColor">
                  <g>
                    <polygon
                      points="434.162,293.382 434.162,493.862 308.321,493.862 308.321,368.583 203.682,368.583 203.682,493.862 
		77.841,493.862 77.841,293.382 256.002,153.862 	"
                    />
                    <polygon points="0,242.682 256,38.93 512,242.682 482.21,285.764 256,105.722 29.79,285.764 	" />
                  </g>
                </svg>
              </button>
            </div>

            <a href="https://github.com/LunarEclipseCode/omni-tools" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
              <svg width="35" height="28" xmlns="http://www.w3.org/2000/svg">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0112.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z"
                  fill="currentColor"
                  transform="scale(0.29)"
                />
              </svg>
            </a>
          </div>
        )}

        {this.renderSidebar()}

        <div className={`flex-grow flex flex-col p-4 ${isSidebarOpen ? "blur-background" : ""}`}>{this.renderToolContent()}</div>

        {/* Overlay for background dimming */}
        {isSidebarOpen && <div className="overlay" onClick={this.toggleSidebar}></div>}

        <style jsx>{`
          .custom-appscrollbar::-webkit-scrollbar {
            width: 0.7em;
          }
          .custom-appscrollbar::-webkit-scrollbar-track {
            background: #121928;
          }
          .custom-appscrollbar::-webkit-scrollbar-thumb {
            background-color: #1f2937;
            border-radius: 10px;
          }
          .custom-appscrollbar::-webkit-scrollbar-thumb:hover {
            background-color: #1f2937;
            border-radius: 10px;
          }

          /* Blurred background effect */
          .blur-background {
            filter: blur(5px);
          }

          /* Dimming overlay */
          .overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background-color: rgba(0, 0, 0, 0.5); /* Ppacity for the dim effect */
            z-index: 40; /* Should be below the sidebar but above the content */
          }
        `}</style>
      </div>
    );
  }
}

export default OmniTools;
