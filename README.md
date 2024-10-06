![omni-tools-banner.png](public/omni-tools-banner.png)

<h1 align="center">
  Omni Tools
</h1>

Omni Tools is a versatile, all-in-one developer toolbox providing essential utilities for encryption, conversion, formatting, and much more. Designed with inspiration from [DevToys](https://github.com/DevToys-app/DevToys), it offers a sleek and intuitive interface with full mobile support, making it accessible across all devices.

## 🚀 Features and Dependencies

Omni Tools includes a comprehensive set of tools to simplify daily development tasks. Here’s an overview of the key features:

1. **🔒 AES256-GCM Encrypter Decrypter**

2. **🛠️ Base Encoder/Decoder**
   
   - Encode or decode text using various base encodings (Base16, Base32, Base58, Base62, Base64, Base85, Base91).
   
   - **Packages**: [hi-base32](https://www.npmjs.com/package/hi-base32), [base-64](https://www.npmjs.com/package/base-64), and [base-x](https://www.npmjs.com/package/base-x) for base 58, 62, 85 & 91.

3. **🧮 Checksum Generator**
   
   - Compute checksums (MD5, SHA3-256, SHA3-512, BLAKE3, BLAKE2b) for any uploaded file.

4. **✨ Code Beautifier/Formatter**
   
   - Format code for better readability. Supports JavaScript, TypeScript, HTML, CSS, GraphQL, YAML, XML, Java, and PHP.
   
   - **Package:** [Prettier](https://prettier.io/).

5. **🌐 Code Comment Translator**
   
   - Translate comments within a code block across 40+ different languages. Supports 15+ programming languages. 
   - **Experimental Feature:** Can exclude translating commented out codeblock by recognizing certain keywords. Performance varies depending on the language. 
   - Does not support code snippets containing multiple languages

6. **✂️Code Minifier**
   
   - Minify JavaScript, CSS, HTML, JSON, and XML files to reduce file size.
   
   - **Packages:** [terser](https://terser.org/), [csso](https://www.npmjs.com/package/csso), modified version of [minify-xml](https://github.com/kristian/minify-xml) (so that it can be run on the browser), modified version of [html-minifier-terser](https://github.com/terser/html-minifier-terser) ([clean-css](https://www.npmjs.com/package/clean-css) has been replaced with [csso](https://www.npmjs.com/package/csso) so that it can be run on the browser).

7. **🎨 Color Blinderness Simulator**
   
   - Simulate how a color is perceived by people with different types of color blindness. Supported conditions: Protanomaly, Protanopia, Deuteranomaly, Deuteranopia, Tritanomaly, Tritanopia, Achromatomaly, and Achromatopsia
   
   - **Package:** [color-blind](https://www.npmjs.com/package/color-blind)

8. **🔄 Color Converter**
   
   - Convert color codes between HEX, RGB, HSL, and CMYK. Additionally, find the nearest Pantone and Tailwind CSS colors along with the CSS filter to generate a  similar color.
   
   - **Packages:** [color-convert](https://www.npmjs.com/package/color-convert), [nearest-pantone](https://www.npmjs.com/package/nearest-pantone), [hex-to-css-filter](https://www.npmjs.com/package/hex-to-css-filter)

9. **📕 Command Line CheatSheet**
   
   - Access quick references for common CLI commands across multiple operating systems. Supports 30+ languages and multiple operating systems (Linux, Windows, Android, FreeBSD, NetBSD, OpenBSD, OSX, SunOS)
   
   - **Packages:** [tldr](https://github.com/tldr-pages/tldr)

10. **🕰️ Cron Expression Parser**
    
    - Parse cron expressions to schedule recurring tasks and interpret to human-readable descriptions.
    
    - **Packages:** [cron-parser](https://www.npmjs.com/package/cron-parser), [cronstrue](https://www.npmjs.com/package/cronstrue), and [date-fns](https://www.npmjs.com/package/date-fns)

11. **📂 Git Folder Downloader**
    
    - Download specific folders from GitHub or GitLab repositories without cloning the entire repo
    
    - **Packages:**  [jszip](https://www.npmjs.com/package/jszip), [file-saver](https://www.npmjs.com/package/file-saver)

12. **📦 GZip Compressor/Decompressor**
    
    - Compress and decompress text in GZip
    
    - **Package:** [pako](https://www.npmjs.com/package/pako)

13. **#️⃣ Hash Generator**
    
    - Computes MD5, SHA3-256, SHA3-512, BLAKE3, and BLAKE2b of input text
    
    - **Package:** [hash-wasm](https://www.npmjs.com/package/hash-wasm/v/2.5.1)

14. **💻 HTML Encoder/Decoder**
    
    - Encode and decode HTML entities, supporting both named and numeric formats. (In numeric entity < is encoded as &#60; while in numeric < is encoded as &lt)

15. **🖼️ Image to Text Converter**
    
    - Extract text from images with support for batch processing and 70+ languages.
    
    - **Package**: [Tesseract](https://tesseract.projectnaptha.com/)

16. **🌍 IP Lookup**
    
    - Retrieve detailed information about IP addresses in single or batch mode from [ipapi](https://ipapi.co/), [ip-api](https://ip-api.com/), [geojs](https://www.geojs.io/), and [ipwhois](https://ipwhois.io/) (ipwhois not available in batch mode)

17. **⚙️ JSON <> YAML Converter**
    
    - Convert data seamlessly between JSON and YAML formats
    
    - **Package:** [js-yaml](https://www.npmjs.com/package/js-yaml)

18. **🛡️ Key Pair Generator**
    
    - Generate public and private key pairs for RSA and ECDSA encryption schemes.
    
    - Supports key sizes: 1024, 2048, 4096 (RSA) and P-256, P-384, P-521 (ECDSA)

19. **🧩 Logic Equation Simplifier**
    
    - Simplifies logic equation step by step. Supports expressions with AND, NOT and OR gates.
    
    - **Package:** [@fordi-org/bsimp](https://www.npmjs.com/package/@fordi-org/bsimp)

20. **📰 Lorem Ipsum Generator**
    
    - Generate placeholder text
    
    - **Package:** [lorem-ipsum](https://www.npmjs.com/package/lorem-ipsum)

21. **📝 Markdown Renderer**
    
    - Preview Markdown with support for tables, equations, UML diagrams and syntax highlighting for 100+ programming languages
    
    - **Packages:** [rehype-katex](https://www.npmjs.com/package/rehype-katex), [mermaid](https://www.npmjs.com/package/mermaid), [prismjs](https://www.npmjs.com/package/prismjs), and others

22. **💡 Morse Code Encoder/Decoder**
    
    - Convert text to Morse code and vice versa
    
    - **Package:** [morse-decoder](https://www.npmjs.com/package/morse-decoder)

23. **🔢 Number Base Converter**
    
    - Convert numbers across binary, octal, decimal, and hexadecimal systems

24. **🔑 Password Generator**
    
    - Generate strong, random passwords with customizable criterias

25. **📷 QR Code Encoder/Decoder**
    
    - Generate QR codes from text and decode QR codes to extract embedded information
    
    - **Packages:** [qrcode](https://www.npmjs.com/package/qrcode), [jsqr](https://www.npmjs.com/package/jsqr)

26. **📐 SVG Optimizer**
    
    - Optimize SVG files to reduce file size without compromising quality
    
    - **Package:** modified version of [svgo](https://github.com/svg/svgo) to run it the browser

27. **🕒 Timestamp Converter**
    
    - Convert human-readable dates to timestamps and ISO 8601 format across all global timezones
    
    - **Package:** [luxon](https://www.npmjs.com/package/luxon)

28. **📊 Truth Table Generator**
    
    - Generate truth table for boolean expressions. Supports AND, NOT, OR, NAND, NOR, XOR, XNOR, IFTHEN operations.
    
    - **Package:** [@lusc/truth-table](https://www.npmjs.com/package/@lusc/truth-table)

29. **🔗 URL Encoder/Decoder**
    
    - Encode applicable characters to their URL entities and vice versa.

30. **♾️ UUID Generator**
    
    - Generate universally unique identifiers (UUIDs) of versions 1, 4, 6, and 7
    
    - **Package:** [uuid](https://www.npmjs.com/package/uuid)

## 📦 Development

To get started with Omni Tools, clone the repository and install the required dependencies:

```bash
git clone https://github.com/LunarEclipseCode/omni-tools
cd omni-tools
npm install
npm start
```

Once the application is running, navigate to `http://localhost:3000` in your browser. 

## 🤝 Contributing

Contributions are welcome! Whether it's reporting a bug, suggesting a feature, or contributing code, your involvement helps make Omni Tools better for everyone.
