import React, { Component } from "react";
import { CopyIcon, ClearIcon, SaveIcon } from "../others/Icons";
import * as prettier from "prettier/standalone";
import parserBabel from "prettier/plugins/babel";
import parserHtml from "prettier/plugins/html";
import parserCss from "prettier/plugins/postcss";
import parserMarkdown from "prettier/plugins/markdown";
import parserTypeScript from "prettier/plugins/typescript";
import parserGraphql from "prettier/plugins/graphql";
import parserYaml from "prettier/plugins/yaml";
import parserXml from "@prettier/plugin-xml";
import parserJava from "prettier-plugin-java";
import parserPhp from "@prettier/plugin-php";
import * as prettierPluginEstree from "prettier/plugins/estree";
import { CustomScrollbar } from "../others/CustomScrollbar";

class CodeCommentTranslator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      codeInput: "",
      extractedComments: "",
      translatedCode: "",
      codeError: null,
      selectedLanguage: "babel",
      targetLanguage: "en",
      translating: false,
      includesCommentedOutCode: false,
    };

    // Cache dictionary for storing translations by language and comments
    this.translationCache = this.loadTranslationCache();

    // Track if codeInput, targetLanguage, or selectedLanguage has changed
    this.previousCodeInput = "";
    this.previousTargetLanguage = "";
    this.previousSelectedLanguage = "";
    this.previousIncludesCommentedOutCode = false;

    // Patterns that are indicative of code for each language
    this.codePatternsPerLanguage = {
      babel: [
        /{[^}]*}/, // Curly braces
        /\([^)]*\)/, // Parentheses
        /;$/, // Semicolon at the end
        /\b(function|const|let|var|if|else|for|while|return|import|export)\b/, // Common keywords
        /=>/, // Arrow functions
        /=\s*\w+/, // Assignments
        /\bclass\b/, // Class declarations
        /\bnew\b/, // Object instantiation
        /\/\/\s*@/, // Annotations or decorators
      ],
      typescript: [
        /{[^}]*}/, // Curly braces
        /\([^)]*\)/, // Parentheses
        /;$/, // Semicolon at the end
        /\b(function|const|let|var|if|else|for|while|return|import|export|interface|implements|extends|public|private|protected)\b/,
        /=>/, // Arrow functions
        /=\s*\w+/, // Assignments
        /\bclass\b/, // Class declarations
        /\bnew\b/, // Object instantiation
        /\/\/\s*@/, // Annotations or decorators
        /:\s*\w+/, // Type annotations
      ],
      java: [
        /\bclass\b/,
        /\bpublic|private|protected\b\s+(static\s+)?\w+\s+\w+\s*\([^)]*\)/, // Method definitions
        /;$/, // Semicolon at the end
        /\b(if|else|for|while|return|import|package|try|catch|finally|new|throw|throws|void|int|double|float|char|boolean|byte|short|long|String|this|super)\b/,
        /@\w+/, // Annotations
      ],
      php: [
        /\bfunction\b/,
        /\bclass\b/,
        /\b(if|else|elseif|for|foreach|while|return|include|require|namespace|use|public|private|protected|static|new|echo|print)\b/,
        /\$\w+/, // Variables starting with $
        /;$/, // Semicolon at the end
        /=>/, // Arrow functions or array syntax
        /@\w+/, // Annotations
      ],
      python: [
        /\bdef\b/,
        /\bclass\b/,
        /:\s*$/, // Colon at the end of a line
        /\b(if|else|elif|for|while|return|import|from|lambda|with|try|except|finally|pass|break|continue|yield|global|nonlocal|assert|async|await|raise)\b/,
        /@\w+/, // Decorators
      ],
      ruby: [
        /\bdef\b/,
        /\bclass\b/,
        /:\s*$/, // Symbols
        /\b(if|else|elsif|for|while|return|require|include|module|begin|end|do|yield|super|self|unless|until|rescue|ensure|case|when)\b/,
        /@\w+/, // Instance variables
      ],
      csharp: [
        /\bclass\b/,
        /\b(?:public|private|protected|internal|static|void|int|string|double|float|bool|char|byte|short|long|this|base|using|namespace|new|return|if|else|for|while|do|switch|case|default|break|continue|try|catch|finally|throw|async|await|var|dynamic|override|virtual|abstract|interface|struct|enum|delegate|event|get|set|add|remove|operator|implicit|explicit)\b/,
        /;$/, // Semicolon at the end
        /@\w+/, // Attributes
      ],
      cpp: [
        /\bclass\b/,
        /\b(?:public|private|protected|static|void|int|string|double|float|bool|char|unsigned|signed|long|short|if|else|for|while|do|switch|case|default|break|continue|return|new|delete|namespace|using|try|catch|throw|this|virtual|override|const|enum|struct|typedef|template|operator|friend|inline|extern|static_cast|dynamic_cast|reinterpret_cast|const_cast|sizeof|typeid|typename|volatile|mutable|register|goto|asm|auto|union)\b/,
        /;$/, // Semicolon at the end
        /#include\s*<[^>]+>/, // Include directives
      ],
      go: [
        /\bfunc\b/,
        /\bpackage\b/,
        /\bimport\b/,
        /\b(if|else|for|while|return|defer|go|select|switch|case|default|break|continue|type|struct|interface|map|chan|const|var|range|make|new|len|cap|append|copy|close|delete|panic|recover)\b/,
        /:=/, // Short variable declaration
        /\/\/\s*@/, // Annotations or directives
      ],
      kotlin: [
        /\bfun\b/,
        /\bclass\b/,
        /\bval\b/,
        /\bvar\b/,
        /\b(if|else|for|while|return|import|package|try|catch|finally|when|object|interface|data|sealed|enum|companion|override|open|lateinit|lazy|in|is|as|this|super)\b/,
        /\/\/\s*@/, // Annotations
        /:\s*\w+/, // Type annotations
      ],
      swift: [
        /\bfunc\b/,
        /\bclass\b/,
        /\bvar\b/,
        /\blet\b/,
        /\b(if|else|for|while|return|import|try|catch|finally|guard|defer|switch|case|default|break|continue|typealias|enum|struct|protocol|extension|self|super|init|deinit|subscript|operator|inout|as|is|throws|rethrows|throw|do)\b/,
        /\/\/\s*@/, // Annotations
        /:\s*\w+/, // Type annotations
      ],
      rust: [
        /\bfn\b/,
        /\bstruct\b/,
        /\benum\b/,
        /\bimpl\b/,
        /\b(if|else|for|while|loop|return|use|mod|pub|crate|self|super|extern|let|mut|const|static|ref|match|break|continue|yield|async|await|move|unsafe|trait|type|where|dyn|as|in|from|to|into|try|macro_rules!)\b/,
        /#!?\[.*\]/, // Attributes
        /->\s*\w+/, // Return type annotations
      ],
      haskell: [
        /\bmodule\b/,
        /\bimport\b/,
        /\bdata\b/,
        /\btype\b/,
        /\b(if|then|else|case|of|let|in|where|do|deriving|instance|class|newtype|default|infix|infixl|infixr|foreign|forall|mdo|rec|proc)\b/,
        /::/, // Type annotations
        /->/, // Function types
        /<-/, // Do notation
        /=>/, // Typeclass constraints
      ],
      html: [
        /<[^>]+>/, // HTML tags
        /&\w+;/, // HTML entities
      ],
      css: [
        /\b\w+\s*{\s*[^}]*}/, // CSS rules
        /@\w+/, // At-rules like @media, @import
        /#\w+/, // IDs
        /\.\w+/, // Classes
      ],
      markdown: [
        /^#{1,6}\s+/, // Headings
        /^\s*-\s+/, // Unordered list
        /^\s*\d+\.\s+/, // Ordered list
        /\[.*\]\(.*\)/, // Links
        /!\[.*\]\(.*\)/, // Images
        />\s+/, // Blockquotes
        /`{1,3}[^`]*`{1,3}/, // Inline code
        /```[\s\S]*?```/, // Code blocks
      ],
      graphql: [
        /\btype\b/,
        /\bquery\b/,
        /\bmutation\b/,
        /\bsubscription\b/,
        /\bfragment\b/,
        /\bon\b/,
        /\bscalar\b/,
        /\benum\b/,
        /\binput\b/,
        /\binterface\b/,
        /\bimplements\b/,
        /\bextends\b/,
        /\bunion\b/,
        /\b@[a-zA-Z0-9_]+/, // Directives
      ],
      yaml: [
        /^\s*\w+:\s*/,
        /-\s+/, // Lists
        /#\s*/, // Comments
      ],
      xml: [
        /<[^>]+>/, // XML tags
        /&\w+;/, // XML entities
      ],
    };
  }

  // Detect if a comment likely contains code
  isCodeComment = (comment, language) => {
    const codePatterns = this.codePatternsPerLanguage[language] || [];

    // Check if any pattern matches the comment
    return codePatterns.some((pattern) => pattern.test(comment));
  };

  // Load translation cache from localStorage (if it exists)
  loadTranslationCache = () => {
    const cachedData = localStorage.getItem("translationCache");
    if (cachedData) {
      return JSON.parse(cachedData);
    }
    return {};
  };

  // Save translation cache to localStorage
  saveTranslationCache = () => {
    localStorage.setItem("translationCache", JSON.stringify(this.translationCache));
  };

  copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  handleLanguageChange = (e) => {
    this.setState({
      selectedLanguage: e.target.value,
      codeInput: "",
      extractedComments: "",
      translatedCode: "",
      codeError: null,
    });
  };

  handleTargetLanguageChange = (e) => {
    this.setState({
      targetLanguage: e.target.value,
      extractedComments: "",
      translatedCode: "",
      codeError: null,
    });
  };

  handleToggle = () => {
    this.setState((prevState) => ({
      includesCommentedOutCode: !prevState.includesCommentedOutCode,
    }));
  };

  handleTranslateClick = async () => {
    const { codeInput, selectedLanguage, targetLanguage, includesCommentedOutCode } = this.state;

    if (codeInput === this.previousCodeInput && targetLanguage === this.previousTargetLanguage && selectedLanguage === this.previousSelectedLanguage && includesCommentedOutCode === this.previousIncludesCommentedOutCode) {
      console.log("No changes detected, skipping API call.");
      return;
    }

    this.setState({ translating: true });

    try {
      const parserMap = {
        babel: "babel",
        html: "html",
        css: "css",
        markdown: "markdown",
        typescript: "typescript",
        graphql: "graphql",
        yaml: "yaml",
        xml: "xml",
        java: "java",
        php: "php",
        python: null,
        ruby: null,
        csharp: null,
        cpp: null,
        go: null,
        kotlin: null,
        swift: null,
        rust: null,
        haskell: null,
      };

      const selectedParser = parserMap[selectedLanguage];

      const pluginsMap = {
        babel: [parserBabel, prettierPluginEstree],
        html: [parserHtml],
        css: [parserCss],
        markdown: [parserMarkdown],
        typescript: [parserTypeScript, prettierPluginEstree],
        graphql: [parserGraphql],
        yaml: [parserYaml],
        xml: [parserXml],
        java: [parserJava],
        php: [parserPhp],
        python: [],
        ruby: [],
        csharp: [],
        cpp: [],
        go: [],
        kotlin: [],
        swift: [],
        rust: [],
        haskell: [],
      };

      // Format the code first if parser is available
      let formattedCode = codeInput;
      if (selectedParser && pluginsMap[selectedLanguage].length > 0) {
        formattedCode = await prettier.format(codeInput, {
          parser: selectedParser,
          plugins: pluginsMap[selectedLanguage],
          tabWidth: 2,
          useTabs: false,
          singleQuote: true,
          trailingComma: "es5",
          bracketSpacing: true,
          jsxBracketSameLine: false,
          embeddedLanguageFormatting: "auto",
        });
      }

      // Extract comments
      const comments = this.extractComments(formattedCode, selectedLanguage);

      // Depending on the toggle, decide which comments to translate
      let commentsToProcess = comments;
      if (includesCommentedOutCode) {
        // Filter out comments that contain code-like patterns
        commentsToProcess = comments.filter((comment) => !comment.isCode);
      }

      // Check cache for existing translations
      const cachedTranslations = this.getCachedTranslations(selectedLanguage, targetLanguage, commentsToProcess);

      // Send API request for comments not in cache
      const commentsToTranslate = cachedTranslations.commentsToTranslate;
      let translatedComments = cachedTranslations.cachedTranslations;

      if (commentsToTranslate.length > 0) {
        const apiTranslations = await this.translateCommentsAzure(commentsToTranslate, targetLanguage);
        translatedComments = [...translatedComments, ...apiTranslations];

        // Update cache with new translations
        this.updateTranslationCache(selectedLanguage, targetLanguage, commentsToTranslate, apiTranslations);
      }

      // Replace comments in the code
      const translatedCode = this.replaceComments(formattedCode, comments, translatedComments, selectedLanguage, includesCommentedOutCode);

      // Store previous values to track changes
      this.previousCodeInput = codeInput;
      this.previousTargetLanguage = targetLanguage;
      this.previousSelectedLanguage = selectedLanguage;
      this.previousIncludesCommentedOutCode = includesCommentedOutCode;

      // Prepare the debug info with the comments sent to the API
      const commentsSentToApi = commentsToTranslate.map((comment) => comment.original).join("\n");
      const extractedCommentsText = comments.map((comment) => (comment.isCode ? `[Code Comment] ${comment.original}` : `[Text Comment] ${comment.original}`)).join("\n") + "\n===========\n" + commentsSentToApi;

      this.setState({
        translatedCode,
        extractedComments: extractedCommentsText,
        codeError: null,
        translating: false,
      });
    } catch (error) {
      this.setState({
        translatedCode: `Error: ${error.message}`,
        codeError: error.message,
        translating: false,
      });
    }
  };

  extractComments = (code, language) => {
    const commentPatterns = {
      babel: /\/\/(.*)|\/\*([\s\S]*?)\*\//g,
      typescript: /\/\/(.*)|\/\*([\s\S]*?)\*\//g,
      java: /\/\/(.*)|\/\*([\s\S]*?)\*\//g,
      php: /\/\/(.*)|\/\*([\s\S]*?)\*\//g,
      html: /<!--([\s\S]*?)-->/g,
      css: /\/\*([\s\S]*?)\*\//g,
      markdown: /<!--([\s\S]*?)-->/g,
      graphql: /#(.*)/g,
      yaml: /#(.*)/g,
      xml: /<!--([\s\S]*?)-->/g,
      python: /#(.*)/g,
      ruby: /#(.*)|=begin([\s\S]*?)=end/g,
      csharp: /\/\/(.*)|\/\*([\s\S]*?)\*\//g,
      cpp: /\/\/(.*)|\/\*([\s\S]*?)\*\//g,
      go: /\/\/(.*)|\/\*([\s\S]*?)\*\//g,
      kotlin: /\/\/(.*)|\/\*([\s\S]*?)\*\//g,
      swift: /\/\/(.*)|\/\*([\s\S]*?)\*\//g,
      rust: /\/\/\/(.*)|\/\/(.*)|\/\*([\s\S]*?)\*\//g,
      haskell: /--(.*)|\{-[\s\S]*?-\}/g,
    };

    const pattern = commentPatterns[language] || /\/\/(.*)|\/\*([\s\S]*?)\*\//g;
    const comments = [];
    let match;

    while ((match = pattern.exec(code)) !== null) {
      for (let i = 1; i < match.length; i++) {
        if (match[i]) {
          let commentText = match[i].trim();
          let commentType = "single";
          if (match[0].startsWith("/*") || match[0].startsWith("{-") || match[0].startsWith("=begin") || match[0].startsWith("<!--")) {
            commentType = "multi";
          } else if (match[0].startsWith("//") || match[0].startsWith("#") || match[0].startsWith("--") || match[0].startsWith("///")) {
            commentType = "single";
          }

          const isCode = this.isCodeComment(commentText, language);

          comments.push({
            original: commentText,
            fullMatch: match[0],
            type: commentType,
            isCode, // Flag indicating if the comment contains code
          });
          break;
        }
      }
    }

    return comments;
  };

  translateCommentsAzure = async (comments, targetLang) => {
    if (comments.length === 0) return [];

    const texts = comments.map((comment) => ({ Text: comment.original }));

    try {
      const response = await fetch("https://translate.omnitools.dev", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          texts,
          targetLanguage: targetLang,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to translate comments. Please consider opening a GitHub issue.");
      }

      const data = await response.json();
      return data.map((item) => item.translations[0].text);
    } catch (error) {
      throw new Error("Failed to translate comments via Azure Translate.");
    }
  };

  // Check cache for existing translations and determine which comments need to be translated
  getCachedTranslations = (language, targetLanguage, comments) => {
    const cachedTranslations = [];
    const commentsToTranslate = [];

    // Ensure language and targetLanguage exist in the cache
    if (!this.translationCache[language]) {
      this.translationCache[language] = {};
    }
    if (!this.translationCache[language][targetLanguage]) {
      this.translationCache[language][targetLanguage] = {};
    }

    comments.forEach((comment) => {
      const cacheForLanguage = this.translationCache[language][targetLanguage];
      if (cacheForLanguage[comment.original]) {
        cachedTranslations.push(cacheForLanguage[comment.original]); // Use cached translation
      } else {
        commentsToTranslate.push(comment); // Needs API translation
      }
    });

    return { cachedTranslations, commentsToTranslate };
  };

  // Update the cache with newly translated comments
  updateTranslationCache = (language, targetLanguage, comments, translations) => {
    comments.forEach((comment, index) => {
      this.translationCache[language][targetLanguage][comment.original] = translations[index];
    });

    // Save the updated cache to localStorage
    this.saveTranslationCache();
  };

  replaceComments = (code, allComments, translatedComments, language, includesCommentedOutCode) => {
    let translatedCode = code;
    let translationIndex = 0; // To track the index in translatedComments

    allComments.forEach((comment) => {
      if (includesCommentedOutCode && comment.isCode) {
        // Skip replacing code-like comments if heuristic is enabled
        return;
      }

      let translatedComment = translatedComments[translationIndex];
      translationIndex += 1;

      if (comment.type === "single") {
        // Handle single-line comments
        const singleLinePattern = new RegExp(`${escapeRegExp(comment.fullMatch)}`);
        translatedCode = translatedCode.replace(singleLinePattern, `${comment.fullMatch.replace(comment.original, translatedComment)}`);
      } else if (comment.type === "multi") {
        // Handle multi-line comments
        const multiLinePattern = new RegExp(`${escapeRegExp(comment.fullMatch)}`, "g");
        translatedCode = translatedCode.replace(multiLinePattern, `${comment.fullMatch.replace(comment.original, translatedComment)}`);
      }
    });

    return translatedCode;
  };

  clearCodeInput = () => {
    this.setState({
      codeInput: "",
      translatedCode: "",
      extractedComments: "",
      codeError: null,
    });

    // Reset previous translation tracking variables
    this.previousCodeInput = "";
    this.previousTargetLanguage = "";
    this.previousSelectedLanguage = "";
    this.previousIncludesCommentedOutCode = false;
  };

  saveTranslatedCode = () => {
    const { translatedCode } = this.state;
    const fileExtension = this.getFileExtension();
    const element = document.createElement("a");
    const file = new Blob([translatedCode], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `translated_code.${fileExtension}`;
    document.body.appendChild(element);
    element.click();
  };

  getFileExtension = () => {
    const { selectedLanguage } = this.state;
    switch (selectedLanguage) {
      case "babel":
      case "typescript":
        return "js";
      case "typescript":
        return "ts";
      case "html":
        return "html";
      case "css":
        return "css";
      case "graphql":
        return "graphql";
      case "yaml":
        return "yaml";
      case "xml":
        return "xml";
      case "java":
        return "java";
      case "php":
        return "php";
      case "python":
        return "py";
      case "ruby":
        return "rb";
      case "csharp":
        return "cs";
      case "cpp":
        return "cpp";
      case "go":
        return "go";
      case "kotlin":
        return "kt";
      case "swift":
        return "swift";
      case "rust":
        return "rs";
      case "haskell":
        return "hs";
      default:
        return "txt";
    }
  };

  render() {
    const { codeInput, extractedComments, translatedCode, selectedLanguage, targetLanguage, translating, includesCommentedOutCode } = this.state;

    const languageOptions = [
      { value: "babel", label: "JavaScript" },
      { value: "typescript", label: "TypeScript" },
      { value: "html", label: "HTML" },
      { value: "css", label: "CSS" },
      { value: "graphql", label: "GraphQL" },
      { value: "yaml", label: "YAML" },
      { value: "xml", label: "XML" },
      { value: "java", label: "Java" },
      { value: "php", label: "PHP" },
      { value: "python", label: "Python" },
      { value: "ruby", label: "Ruby" },
      { value: "csharp", label: "C#" },
      { value: "cpp", label: "C++" },
      { value: "go", label: "Go" },
      { value: "kotlin", label: "Kotlin" },
      { value: "swift", label: "Swift" },
      { value: "rust", label: "Rust" },
      { value: "haskell", label: "Haskell" },
    ];

    const targetLanguageOptions = [
      { value: "af", label: "Afrikaans" },
      { value: "am", label: "አማርኛ" },
      { value: "ar", label: "العربية" },
      { value: "as", label: "অসমীয়া" },
      { value: "bg", label: "Български" },
      { value: "bn", label: "বাংলা" },
      { value: "bo", label: "Tibetan" },
      { value: "ca", label: "Català" },
      { value: "cr", label: "Hrvatski" },
      { value: "da", label: "Dansk" },
      { value: "de", label: "Deutsch" },
      { value: "el", label: "Ελληνικά" },
      { value: "en", label: "English" },
      { value: "es", label: "Español" },
      { value: "fi", label: "Suomi" },
      { value: "fr", label: "Français" },
      { value: "gu", label: "ગુજરાતી" },
      { value: "ha", label: "Hausa" },
      { value: "he", label: "עברית" },
      { value: "hi", label: "हिन्दी" },
      { value: "hy", label: "Հայերեն" },
      { value: "id", label: "Bahasa Indonesia" },
      { value: "is", label: "Íslenska" },
      { value: "it", label: "Italiano" },
      { value: "ja", label: "日本語" },
      { value: "ko", label: "한국어" },
      { value: "nl", label: "Nederlands" },
      { value: "ne", label: "नेपाली" },
      { value: "nb", label: "Norsk Bokmål" },
      { value: "pa", label: "ਪੰਜਾਬੀ" },
      { value: "pl", label: "Polski" },
      { value: "pt", label: "Português (Brasil)" },
      { value: "pt-pt", label: "Português (Portugal)" },
      { value: "ru", label: "Русский" },
      { value: "sq", label: "Shqip" },
      { value: "sv", label: "Svenska" },
      { value: "sw", label: "Kiswahili" },
      { value: "ta", label: "தமிழ்" },
      { value: "th", label: "ไทย" },
      { value: "tr", label: "Türkçe" },
      { value: "uk", label: "Українська" },
      { value: "ur", label: "اردو" },
      { value: "vi", label: "Tiếng Việt" },
      { value: "yue", label: "廣東話" },
      { value: "zh-Hans", label: "简体中文" },
      { value: "zu", label: "Zulu" },
    ];

    return (
      <main className="overflow-y-auto p-4 md:p-6 lg:p-8 xl:p-10 md:pt-4 lg:pt-5 xl:pt-5 h-full">
        <CustomScrollbar />
        <section className="flex flex-col h-full">
          <h1 className="text-3xl text-white font-semibold">Code Comment Translator</h1>

          <section className="flex flex-col gap-4 mt-5">
            <ul className="flex flex-col gap-4">
              <li>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-3">
                  <div className="flex h-12 items-center gap-6 rounded-lg bg-gray-800 px-4 w-full">
                    <div className="flex flex-1 items-center justify-between gap-2 sm:justify-start">
                      <label className="text-white">Select Language:</label>
                      <select value={selectedLanguage} onChange={this.handleLanguageChange} className="bg-gray-700 text-white rounded-md p-2 pl-3 w-2/5 sm:w-48 sm:ml-5">
                        {languageOptions.map((lang) => (
                          <option key={lang.value} value={lang.value}>
                            {lang.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="flex h-12 items-center gap-6 rounded-lg bg-gray-800 px-4 w-full">
                    <div className="flex flex-1 items-center justify-between gap-2 sm:justify-start">
                      <style>
                        {`
                          .custom-scrollbar::-webkit-scrollbar {
                            width: 0.5em;
                          }
    
                          .custom-scrollbar::-webkit-scrollbar-track {
                            background-color: #334155;
                          }
    
                          .custom-scrollbar::-webkit-scrollbar-thumb {
                            background-color: #4b5563;
                            border-radius: 10px;
                          }
    
                          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                            background-color: #9ca3af;
                          }
                        `}
                      </style>
                      <label className="text-white">Translate to:</label>
                      <select value={targetLanguage} onChange={this.handleTargetLanguageChange} className="bg-gray-700 text-white rounded-md p-2 pl-3 custom-scrollbar w-2/5 sm:w-48 sm:ml-5">
                        {targetLanguageOptions.map((lang) => (
                          <option key={lang.value} value={lang.value} className="bg-[#2b3544]">
                            {lang.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
            <div className="flex h-12 items-center gap-6 rounded-lg bg-gray-800 px-4 justify-between">
              <span className="text-white">Includes commented out code</span>
              <div className="flex items-center">
                <button
                  type="button"
                  role="switch"
                  aria-checked={includesCommentedOutCode}
                  onClick={this.handleToggle}
                  className={`group inline-flex h-6 w-12 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 ease-in-out ${includesCommentedOutCode ? "bg-blue-600" : "bg-gray-600"}`}
                >
                  <span className={`pointer-events-none block h-4 w-4 rounded-full bg-white shadow-lg transform transition-transform duration-200 ease-in-out ${includesCommentedOutCode ? "translate-x-7" : "translate-x-1"}`}></span>
                </button>
              </div>
            </div>

            {/* Warning Message */}
            {includesCommentedOutCode && (
              <div className="flex items-center">
                <span className="text-gray-300 text-sm xl:text-base pl-2">Result may not be perfect as some commented out code will be translated while some comments with certain keywords will not be translated to avoid breaking the commented out code.</span>
              </div>
            )}
          </section>

          {/* Input and Output Sections */}
          <section className="flex flex-col lg:flex-row gap-4 h-full">
            {/* Input Section */}
            <div className="flex-1 flex flex-col h-full">
              <div className="flex justify-between items-center">
                <h2 className="text-lg text-gray-300">Input</h2>
                <div className="flex items-center">
                  <button
                    className="text-gray-400 hover:text-white transition-colors p-1"
                    onClick={this.handleTranslateClick}
                    disabled={translating} // Disable button while translating
                  >
                    <svg width="24" height="24" viewBox="-2 -1.5 27.75 27.75" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M12.913 17H20.087M12.913 17L11 21M12.913 17L15.7783 11.009C16.0092 10.5263 16.1246 10.2849 16.2826 10.2086C16.4199 10.1423 16.5801 10.1423 16.7174 10.2086C16.8754 10.2849 16.9908 10.5263 17.2217 11.009L20.087 17M20.087 17L22 21M2 5H8M8 5H11.5M8 5V3M11.5 5H14M11.5 5C11.0039 7.95729 9.85259 10.6362 8.16555 12.8844M10 14C9.38747 13.7248 8.76265 13.3421 8.16555 12.8844M8.16555 12.8844C6.81302 11.8478 5.60276 10.4266 5 9M8.16555 12.8844C6.56086 15.0229 4.47143 16.7718 2 18"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                  <button className="text-gray-400 hover:text-white transition-colors p-2" onClick={this.clearCodeInput}>
                    <ClearIcon />
                  </button>
                </div>
              </div>
              <textarea
                className="flex-1 h-full border-2 rounded-lg border-gray-600 bg-gray-800 px-4 py-2 text-gray-300 outline-none placeholder-gray-500 hover:bg-[#2b3544] focus:border-blue-400 focus:bg-[#2b3544] font-mono custom-scrollbar"
                placeholder="Enter code with comments"
                value={codeInput}
                onChange={(e) => this.setState({ codeInput: e.target.value })}
              />
            </div>

            {/* Box for showing extracted comments */}
            {/* <div className="flex-1 flex flex-col h-full">
              <div className="flex justify-between items-center">
                <h2 className="text-lg text-gray-300">Extracted Comments</h2>
              </div>
              <textarea
                className="flex-1 h-full border-2 rounded-lg border-gray-600 bg-gray-800 px-4 py-2 text-gray-300 outline-none placeholder-gray-500 hover:bg-[#2b3544] focus:border-blue-400 focus:bg-[#2b3544] font-mono custom-scrollbar"
                placeholder="Extracted comments will appear here"
                value={extractedComments}
                readOnly
              />
            </div> */}

            {/* Output Section */}
            <div className="flex-1 flex flex-col h-full">
              <div className="flex justify-between items-center">
                <h2 className="text-lg text-gray-300">Output</h2>
                <div className="flex items-center">
                  <button className="text-gray-400 hover:text-white transition-colors p-2" onClick={this.saveTranslatedCode}>
                    <SaveIcon />
                  </button>
                  <button className="text-gray-400 hover:text-white transition-colors p-2" onClick={() => this.copyToClipboard(translatedCode)}>
                    <CopyIcon />
                  </button>
                </div>
              </div>
              <textarea
                className={`flex-1 h-full border-2 rounded-lg border-gray-600 bg-gray-800 px-4 py-2 text-gray-300 outline-none placeholder-gray-500 hover:bg-[#2b3544] focus:border-blue-400 focus:bg-[#2b3544] font-mono custom-scrollbar ${
                  this.state.codeError ? "text-red-500" : ""
                }`}
                placeholder={translating ? "Translating comments..." : ""}
                value={translatedCode}
                readOnly
              />
            </div>
          </section>
        </section>
      </main>
    );
  }
}

// Function to escape RegExp special characters
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export default CodeCommentTranslator;
