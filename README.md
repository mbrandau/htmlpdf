# htmlpdf

![npm](https://img.shields.io/npm/v/@mbrandau/htmlpdf.svg) ![npm](https://img.shields.io/npm/dt/@mbrandau/htmlpdf.svg) ![GitHub](https://img.shields.io/github/license/mbrandau/htmlpdf.svg)

A library that converts HTML to PDF using Headless Chrome ([puppeteer](https://github.com/GoogleChrome/puppeteer))

## Gettings started

### Installation

`npm install --save @mbrandau/htmlpdf`

### Usage

The following example creates a PDF file of the index.html file.
```js
import fs from 'fs';
import { htmlToPdf } from '@mbrandau/htmlpdf';

(async () => {
  const options = {
    format: 'A4'
  };

  const pdfBuffer = await htmlToPdf(fs.readFileSync('index.html'), options);
  fs.writeFileSync('index.pdf', pdfBuffer); // Write PDF file
})();
```

## Documentation

### #htmlPdf(html[, options]) <[Buffer](https://nodejs.org/api/buffer.html#buffer_class_buffer)> (async function)

Creates a PDF Buffer of the provided HTML using puppeteer. For available options see the [puppeteer documentation](https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#pagepdfoptions).
