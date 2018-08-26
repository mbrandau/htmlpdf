const http = require('http'),
  crypto = require('crypto'),
  defaults = require('lodash.defaults');
  puppeteer = require('puppeteer');

const defaultOptions = {
  format: 'A4'
};

async function htmlToPdf(html, options) {
  // Generate an authorization token
  // Authorization is used to protect the HTML code from getting read by others, while the server is running.
  const token = crypto.randomBytes(256).toString('hex');

  const server = http.createServer((req, res) => {
    // Check if request is authorized
    if (req.headers.token === token) {
      res.setHeader('Content-Type', 'text/html');
      // Serve html to puppeteer
      res.end(html);
    } else {
      res.statusCode = 403;
      res.end('Not authorized');
    }
  });

  // Wait until server has started
  await new Promise((resolve, reject) => {
    server.on('error', reject);

    // Start server on random port
    server.listen(resolve);
  });

  const address = server.address();
  const url = `http://localhost:${address.port}`;

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Set authorization token header for new requests
  await page.setExtraHTTPHeaders({
    token
  });

  // Navigate to the running HTTP server
  await page.goto(url, {
    waitUntil: 'networkidle2'
  });
  // Get the PDF buffer of the current page with the given options
  const pdfBuffer = await page.pdf(defaults(options, defaultOptions));

  // Wait until server and browser are closed
  await Promise.all([browser.close(), new Promise((resolve, reject) => server.close(resolve))]);
  return pdfBuffer;
}

module.exports = htmlToPdf;
