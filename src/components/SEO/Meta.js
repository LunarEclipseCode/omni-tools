import React from 'react';
import Head from 'next/head';

export default function Meta() {
  return (
    <Head>
      {/* Primary Meta Tags */}
      <title>Omni Tools - All-in-One Developer Toolbox</title>
      <meta charSet="utf-8" />
      <meta name="title" content="Omni Tools - All-in-One Developer Toolbox" />
      <meta
        name="description"
        content="Omni Tools is a versatile developer toolbox offering essential utilities for encryption, conversion, formatting, and more. Inspired by DevToys, it provides a sleek, intuitive interface with full mobile support."
      />
      <meta name="author" content="Raj Datta (LunarEclipseCode)" />
      <meta
        name="keywords"
        content="omnitools, developer toolbox, devtools, encryption, conversion, formatting, beautifier, base encoder, checksum generator, JSON YAML Converter, IP lookup, QR Code, password generator, markdown renderer"
      />
      <meta name="robots" content="index, follow" />
      <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
      <meta name="language" content="English" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="theme-color" content="#E95420" />

      {/* Open Graph / Facebook */}
      <meta property="og:title" content="Omni Tools - All-in-One Developer Toolbox" />
      <meta
        property="og:description"
        content="Discover Omni Tools, a comprehensive suite of utilities for developers."
      />
      <meta property="og:image" content="/favicon.png" />
      <meta property="og:url" content="https://omnitools.dev/" />
      <meta property="og:site_name" content="Omni Tools" />
      <meta property="og:locale" content="en_US" />
      <meta property="og:type" content="website" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="Omni Tools - All-in-One Developer Toolbox" />
      <meta
        name="twitter:description"
        content="Omni Tools offers a versatile set of utilities for developers, including encryption, conversion, formatting, and more. Accessible on all devices with a sleek, intuitive interface."
      />
      <meta name="twitter:image" content="/favicon.png" />

      {/* Schema.org for Google */}
      <meta itemProp="name" content="Omni Tools - All-in-One Developer Toolbox" />
      <meta
        itemProp="description"
        content="A comprehensive developer toolbox for encryption, conversion, formatting, and more. Inspired by DevToys, Omni Tools offers a sleek, intuitive interface with full mobile support."
      />
      <meta itemProp="image" content="/favicon.png" />

      {/* Icons */}
      <link rel="icon" href="/favicon.png" />
      <link rel="apple-touch-icon" href="/favicon.png" />

      {/* Fonts */}
      <link
        rel="preload"
        href="https://fonts.googleapis.com/css2?family=Ubuntu:wght@300;400;500;700&display=swap"
        as="style"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Ubuntu:wght@300;400;500;700&display=swap"
        rel="stylesheet"
      />
    </Head>
  );
}
