import React, { useState, useEffect, useRef, useMemo, useCallback, Suspense } from "react";
import ToolItem from "./others/ToolItem";
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
  LogicEquationIcon,
  IPLookupIcon,
  ColorBlindSimIcon,
  CommandLineIcon,
  TranslatorIcon,
  TimestampConverterIcon,
  TruthTableIcon,
  ChecksumGeneratorIcon,
  CronParserIcon,
  GitIcon,
  ScanIcon,
} from "./others/Icons";

const tools = [
  {
    toolName: "Json <> Yaml Converter",
    component: "JsonToYamlConverter",
    icon: JsonYamlIcon,
    description: "Convert data easily between JSON and YAML format",
  },
  {
    toolName: "Number Base Converter",
    component: "BaseConverter",
    icon: BaseConverterIcon,
    description: "Convert numbers between different bases",
  },
  {
    toolName: "Hash Generator",
    component: "HashGenerator",
    icon: HashGeneratorIcon,
    description: "Generate cryptographic hashes from any text input",
  },
  {
    toolName: "Password Generator",
    component: "PasswordGenerator",
    icon: PasswordGeneratorIcon,
    description: "Generate random passwords",
  },
  {
    toolName: "Lorem Ipsum Generator",
    component: "LoremIpsumGenerator",
    icon: LoremIpsumGeneratorIcon,
    description: "Generate placeholder text for designs and prototypes",
  },
  {
    toolName: "Code Beautifier / Formatter",
    component: "CodeFormatter",
    icon: CodeFormatterIcon,
    description: "Make your code prettier with better readability",
  },
  {
    toolName: "Morse Code Encoder/Decoder",
    component: "MorseEncoderDecoder",
    icon: MorseEncoderDecoderIcon,
    description: "Convert text to Morse code and vice versa",
  },
  {
    toolName: "QR Code Encoder/Decoder",
    component: "QrCodeEncoderDecoder",
    icon: QRCodeIcon,
    description: "Encode or decode QR Code",
  },
  {
    toolName: "Base Encoder/Decoder",
    component: "BaseEncoderDecoder",
    icon: BaseEncoderDecoderIcon,
    description: "Encode or decode text using various base encodings",
  },
  {
    toolName: "Color Converter",
    component: "ColorConverter",
    icon: ColorConverterIcon,
    description: "Convert color code between different conventions",
  },
  {
    toolName: "AES256 Encrypter/Decrypter",
    component: "AesEncrypterDecrypter",
    icon: AES256Icon,
    description: "Encrypt or decrypt your text using AES256-GCM",
  },
  {
    toolName: "UUID Generator",
    component: "UUIDGenerator",
    icon: UUIDGeneratorIcon,
    description: "Generate UUIDs version 1, 4, 6, and 7",
  },
  {
    toolName: "URL Encoder/Decoder",
    component: "UrlEncoderDecoder",
    icon: UrlEncoderDecoderIcon,
    description: "Encode or decode applicable characters to their URL entities",
  },
  {
    toolName: "HTML Encoder/Decoder",
    component: "HtmlEncoderDecoder",
    icon: HtmlEncoderDecoderIcon,
    description: "Encode and decode HTML text data",
  },
  {
    toolName: "Gzip Compress/Decompress",
    component: "GzipCompressDecompress",
    icon: GzipCompressDecompressIcon,
    description: "Compress or decompress a text in GZip",
  },
  {
    toolName: "Markdown Renderer",
    component: "MarkdownRenderer",
    icon: MarkdownIcon,
    description: "Preview Markdown text with tables, equations, UML diagrams, and code syntax highlighting",
  },
  {
    toolName: "SVG Optimizer",
    component: "SvgOptimizer",
    icon: SvgIcon,
    description: "Optimize SVG files to reduce file size",
  },
  {
    toolName: "Key Pair Generator",
    component: "KeyPairGenerator",
    icon: KeyPairGeneratorIcon,
    description: "Generate public and private key pairs for RSA and ECDSA encryption",
  },
  {
    toolName: "Logic Equation Simplifier",
    component: "BooleanSimplifier",
    icon: LogicEquationIcon,
    description: "Simplify complex Boolean logic equations step by step",
  },
  {
    toolName: "IP Lookup",
    component: "IPLookup",
    icon: IPLookupIcon,
    description: "Batch retrieve detailed info about multiple IP addresses",
  },
  {
    toolName: "Color Blindness Simulator",
    component: "ColorBlindnessSimulator",
    icon: ColorBlindSimIcon,
    description: "Shows how color appears to people with different types of color blindness.",
  },
  {
    toolName: "Truth Table Generator",
    component: "TruthTableGenerator",
    icon: TruthTableIcon,
    description: "Generate truth tables for logical expressions",
  },
  {
    toolName: "Command Line CheatSheet",
    component: "CMDCheatSheet",
    icon: CommandLineIcon,
    description: "Access a quick reference for common command-line instructions in multiple languages",
  },
  {
    toolName: "Code Comment Translator",
    component: "CodeCommentTranslator",
    icon: TranslatorIcon,
    description: "Translate only the comments of a codeblock",
  },
  {
    toolName: "Code Minifier",
    component: "CodeMinifier",
    icon: CodeMinifierIcon,
    description: "Minify code to reduce file size",
  },
  // Uncomment if needed
  // {
  //   toolName: "Braile Translator",
  //   component: "BrailleTranslator",
  //   icon: SvgIcon,
  //   description: "Translate text to Braille",
  // },
  {
    toolName: "Timestamp Converter",
    component: "DateConverter",
    icon: TimestampConverterIcon,
    description: "Convert between human-readable dates and UNIX timestamps.",
  },
  {
    toolName: "Git Folder Downloader",
    component: "GitFolderDownloader",
    icon: GitIcon,
    description: "Download specific folders from GitHub or GitLab repos without cloning entire repo",
  },
  {
    toolName: "Image to Text Converter",
    component: "ImageToTextConverter",
    icon: ScanIcon,
    description: "Extract text from images",
  },
  {
    toolName: "Cron Expression Parser",
    component: "CronExpressionParser",
    icon: CronParserIcon,
    description: "Parse and generate cron expressions to schedule recurring tasks",
  },
  {
    toolName: "Checksum Generator",
    component: "ChecksumGenerator",
    icon: ChecksumGeneratorIcon,
    description: "Generate and verify checksums for data integrity",
  },
  // {
  //   toolName: "Base File Encoder/Decoder",
  //   component: "Base64ImageEncoderDecoder",
  //   icon: TimestampConverterIcon,
  //   description: "Convert between human-readable dates and UNIX timestamps.",
  // },
];

// Helper function to dynamically import tool components
const loadToolComponent = async (componentName) => {
  const componentMap = {
    JsonToYamlConverter: () => import("./tools/JsonToYamlConverter"),
    BaseConverter: () => import("./tools/BaseConverter"),
    HashGenerator: () => import("./tools/HashGenerator"),
    PasswordGenerator: () => import("./tools/PasswordGenerator"),
    LoremIpsumGenerator: () => import("./tools/LoremIpsumGenerator"),
    CodeFormatter: () => import("./tools/CodeFormatter"),
    MorseEncoderDecoder: () => import("./tools/MorseEncoderDecoder"),
    QrCodeEncoderDecoder: () => import("./tools/QrCodeEncoderDecoder"),
    BaseEncoderDecoder: () => import("./tools/BaseEncoderDecoder"),
    ColorConverter: () => import("./tools/ColorConverter"),
    AesEncrypterDecrypter: () => import("./tools/AesEncrypterDecrypter"),
    UUIDGenerator: () => import("./tools/UUIDGenerator"),
    UrlEncoderDecoder: () => import("./tools/URLEncoderDecoder"),
    HtmlEncoderDecoder: () => import("./tools/HtmlEncoderDecoder"),
    GzipCompressDecompress: () => import("./tools/GzipCompressDecompress"),
    MarkdownRenderer: () => import("./tools/MarkdownRenderer"),
    SvgOptimizer: () => import("./tools/SvgOptimizer"),
    KeyPairGenerator: () => import("./tools/KeyPairGenerator"),
    BooleanSimplifier: () => import("./tools/BooleanSimplifier"),
    IPLookup: () => import("./tools/IPLookup"),
    ColorBlindnessSimulator: () => import("./tools/ColorBlindSim"),
    TruthTableGenerator: () => import("./tools/TruthTableGenerator"),
    CMDCheatSheet: () => import("./tools/CMDCheatSheet"),
    CodeCommentTranslator: () => import("./tools/CodeCommentTranslator"),
    CodeMinifier: () => import("./tools/CodeMinifier"),
    // BrailleTranslator: () => import("./tools/BrailleTranslator"),
    DateConverter: () => import("./tools/DateConverter"),
    GitFolderDownloader: () => import("./tools/GitFolderDownloader"),
    ImageToTextConverter: () => import("./tools/ImageToTextConverter"),
    CronExpressionParser: () => import("./tools/CronExpressionParser"),
    ChecksumGenerator: () => import("./tools/ChecksumGenerator"),
    // Base64ImageEncoderDecoder: () => import("./tools/Base64ImageEncoderDecoder")
  };

  const importer = componentMap[componentName];
  if (importer) {
    const module = await importer();
    return module.default;
  }
  throw new Error(`Component ${componentName} not found`);
};

const OmniTools = () => {
  const [selectedTool, setSelectedTool] = useState(null);
  const [showTopBar, setShowTopBar] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [homeScrollPosition, setHomeScrollPosition] = useState(0);
  const [loadedTools, setLoadedTools] = useState({});
  const scrollableRef = useRef(null);
  const sidebarRef = useRef(null);

  // Load tool components in the background after the homepage is mounted
  useEffect(() => {
    let isMounted = true; // To prevent setting state on unmounted component

    const loadAllTools = async () => {
      const promises = tools.map((tool) =>
        loadToolComponent(tool.component)
          .then((Component) => ({ [tool.component]: Component }))
          .catch((error) => {
            console.error(`Error loading ${tool.component}:`, error);
            return { [tool.component]: null };
          })
      );

      // Use Promise.allSettled to ensure all promises are handled, even if some fail
      const results = await Promise.allSettled(promises);

      if (isMounted) {
        const toolsMap = results.reduce((acc, result, index) => {
          const toolComponentName = tools[index].component;
          if (result.status === "fulfilled") {
            acc[toolComponentName] = result.value[toolComponentName];
          } else {
            console.error(`Failed to load ${toolComponentName}:`, result.reason);
            acc[toolComponentName] = null;
          }
          return acc;
        }, {});

        setLoadedTools(toolsMap);
      }
    };

    loadAllTools();

    return () => {
      isMounted = false;
    };
  }, []);

  // Handle clicks outside the sidebar to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isSidebarOpen && sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsSidebarOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isSidebarOpen]);

  // Restore scroll position when navigating back home
  useEffect(() => {
    if (selectedTool === null && scrollableRef.current) {
      scrollableRef.current.scrollTop = homeScrollPosition;
    }
  }, [selectedTool, homeScrollPosition]);

  const handleCardClick = useCallback(
    (toolComponent) => {
      if (selectedTool === null && scrollableRef.current) {
        setHomeScrollPosition(scrollableRef.current.scrollTop);
      }
      setSelectedTool(toolComponent);
      setShowTopBar(true);
      setIsSidebarOpen(false);
    },
    [selectedTool]
  );

  const handleBackToHome = useCallback(() => {
    setSelectedTool(null);
    setShowTopBar(false);
    setSearchQuery("");
  }, []);

  const handleSearchInput = useCallback((e) => {
    setSearchQuery(e.target.value);
  }, []);

  const clearSearch = useCallback(() => {
    setSearchQuery("");
  }, []);

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen((prev) => !prev);
  }, []);

  // Memoize sorted tools to avoid sorting on every render
  const sortedTools = useMemo(() => {
    return [...tools].sort((a, b) => a.toolName.localeCompare(b.toolName));
  }, []);

  // Filter tools based on search query
  const filteredTools = useMemo(() => {
    if (!searchQuery) return sortedTools;
    const lowerCaseQuery = searchQuery.toLowerCase();
    return sortedTools.filter((tool) => tool.toolName.toLowerCase().includes(lowerCaseQuery) || tool.description.toLowerCase().includes(lowerCaseQuery));
  }, [searchQuery, sortedTools]);

  const renderToolContent = () => {
    if (!selectedTool) return renderHomeScreen();

    const ToolComponent = loadedTools[selectedTool];

    if (!ToolComponent) {
      return <div className="text-center text-white">Loading Tool...</div>;
    }

    return <ToolComponent />;
  };

  const renderSidebar = () => (
    <div ref={sidebarRef} className={`z-50 fixed top-0 left-0 h-full w-[19rem] bg-gray-900 text-white transform transition-transform duration-300 ${isSidebarOpen ? "translate-x-0" : "-translate-x-[19rem]"}`}>
      <div className="p-4 h-full overflow-y-auto custom-scrollbar">
        <h2 className="text-2xl font-bold mb-4 pl-2">Tools</h2>
        <ul className="space-y-1">
          {sortedTools.map((tool) => (
            <li key={tool.component} className="cursor-pointer hover:bg-gray-700 p-1 rounded flex items-center overflow-hidden" onClick={() => handleCardClick(tool.component)}>
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

  const renderHomeScreen = () => (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl sm:text-4xl font-bold text-white">Omni Tools</h1>

        <div className="flex items-center space-x-4">
          <div className="relative">
            <input type="text" placeholder="Search tools..." value={searchQuery} className="w-full sm:w-48 md:w-64 lg:w-80 px-4 py-2 rounded-lg bg-gray-800 text-white outline-none focus:ring-1 focus:ring-blue-400" onChange={handleSearchInput} />

            {searchQuery && (
              <button onClick={clearSearch} className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white">
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

      <div className="grid gap-3 xl:gap-4 grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 mt-4">
        {filteredTools.map((tool) => (
          <MemoizedToolItem key={tool.component} onClick={() => handleCardClick(tool.component)} IconComponent={tool.icon} toolName={tool.toolName} description={tool.description} />
        ))}
      </div>
    </div>
  );

  return (
    <div className="w-full h-screen flex flex-col bg-gray-900 text-white select-none overflow-y-auto custom-appscrollbar" ref={scrollableRef}>
      {showTopBar && (
        <div className="flex items-center justify-between w-full bg-gray-800 bg-opacity-60 text-sm p-2 py-1.5 px-7 md:px-9 lg:px-11 xl:px-14 xl:pl-12">
          <div className="flex items-center space-x-2">
            <button onClick={toggleSidebar} className="p-1.5 rounded hover:bg-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>

            <button onClick={handleBackToHome} className="p-2 rounded hover:bg-gray-700">
              <svg height="24" width="24" version="1.1" id="_x32_" xmlns="http://www.w3.org/2000/svg" viewBox="0 30 512 512" fill="currentColor">
                <g>
                  <polygon
                    points="434.162,293.382 434.162,493.862 308.321,493.862 308.321,368.583 203.682,368.583 203.682,493.862 
                      77.841,493.862 77.841,293.382 256.002,153.862"
                  />
                  <polygon points="0,242.682 256,38.93 512,242.682 482.21,285.764 256,105.722 29.79,285.764" />
                </g>
              </svg>
            </button>
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
      )}

      {renderSidebar()}

      <div className={`flex-grow flex flex-col p-4 ${isSidebarOpen ? "blur-background" : ""}`}>
        <Suspense fallback={<div className="text-center text-white">Loading...</div>}>{renderToolContent()}</Suspense>
      </div>

      {/* Overlay for background dimming */}
      {isSidebarOpen && <div className="overlay" onClick={toggleSidebar}></div>}

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
          background-color: rgba(0, 0, 0, 0.5); /* Opacity for the dim effect */
          z-index: 40; /* Should be below the sidebar but above the content */
        }
      `}</style>
    </div>
  );
};

// Memoize ToolItem to prevent unnecessary re-renders
const MemoizedToolItem = React.memo(({ onClick, IconComponent, toolName, description }) => <ToolItem onClick={onClick} IconComponent={IconComponent} toolName={toolName} description={description} />);

export default OmniTools;
