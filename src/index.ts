import crypto from 'crypto';
import http from 'http';
import puppeteer, { Page, PDFOptions } from 'puppeteer';

export async function htmlToPdf(html: string, options: PDFOptions = {}) {
  return browseHtml(html, page => page.pdf(options));
}

export async function urlToPdf(url: string, options: PDFOptions = {}) {
  return browseUrl(url, page => page.pdf(options));
}

export async function browseUrl<T>(
  url: string,
  action: (page: Page) => Promise<T>
): Promise<T> {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url, {
    waitUntil: 'networkidle2', // Wait until page is fully loaded
  });
  const result = await action(page);
  await browser.close();
  return result;
}

export async function browseHtml<T>(
  html: string,
  action: (page: Page) => Promise<T>
): Promise<T> {
  const { url, close } = await launchServer(html);
  const result = browseUrl(url, action);

  // Shutdown temporary http server
  await close();
  return result;
}

async function launchServer(
  html: string
): Promise<{ url: string; close: () => Promise<void> }> {
  // Generate an authorization token
  // Authorization is used to protect the HTML code from getting read by others, while the server is running.
  const token = crypto.randomBytes(256).toString('hex');

  const server = http.createServer((req, res) => {
    // Check if request is authorized
    if (req.url?.endsWith(token)) {
      res.setHeader('Content-Type', 'text/html');
      res.end(html);
    } else {
      res.statusCode = 403;
      res.end('Not authorized');
    }
  });

  // Wait until server has started
  await new Promise((resolve, reject) => {
    server.on('error', reject);
    server.listen(resolve);
  });

  const address = server.address();

  if (!address || typeof address === 'string')
    throw new Error('Could not find address of server');
  const url = `http://127.0.0.1:${address.port}/${token}`;

  return {
    url,
    close: () =>
      new Promise((resolve, reject) =>
        server.close(err => {
          if (err) reject(err);
          else resolve();
        })
      ),
  };
}
