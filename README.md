# htmlpdf
A library that converts HTML to PDF using Headless Chrome ([puppeteer](https://github.com/GoogleChrome/puppeteer))

## Gettings started

### Installation

`npm install --save htmlpdf`

### Usage

The following example creates a PDF file of the index.html file.
```js
const fs = require('fs');
const htmlPdf = require('htmlpdf');

(async () => {
  const options = {
    format: 'Letter'
  };

  const pdfBuffer = await htmlPdf(fs.readFileSync('index.html'), options);
  fs.writeFileSync('index.pdf', pdfBuffer); // Write PDF file
})();
```

## Documentation

### #htmlPdf(html[, options]) <[Buffer](https://nodejs.org/api/buffer.html#buffer_class_buffer)> (async function)

Creates a PDF Buffer of the provided HTML using puppeteer. For available options see the [puppeteer documentation](https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#pagepdfoptions).
