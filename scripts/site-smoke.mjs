import { spawn } from 'node:child_process';
import { access, mkdir } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');
const artifactDir = path.join(repoRoot, '.artifacts', 'playwright');
const distDir = path.join(repoRoot, 'dist');
const host = '127.0.0.1';
const astroCli = path.join(repoRoot, 'node_modules', 'astro', 'astro.js');
const providedBaseUrl = process.env.SITE_SMOKE_BASE_URL?.replace(/\/$/, '');
const port = providedBaseUrl ? null : await getFreePort();
const baseUrl = providedBaseUrl ?? `http://${host}:${port}/Portfolio`;

const routes = [
  {
    name: 'home',
    url: `${baseUrl}/`,
    screenshot: 'home.png',
    fullPage: true,
    selectors: ['.hero', '#selected-work', '.featured-grid', '.utility-links', 'footer', '.contact-link'],
    expectedTitle: 'Emilio Melis | Aatricks',
    expectedText: 'Android-native AI tools built for real device constraints.',
  },
  {
    name: 'work-9',
    url: `${baseUrl}/work/9`,
    screenshot: 'work-9.png',
    selectors: ['h1', 'a[href="/Portfolio/"]', 'img'],
    expectedText: 'llmedge',
  },
  {
    name: 'work-3',
    url: `${baseUrl}/work/3`,
    screenshot: 'work-3.png',
    selectors: ['h1', 'a[href="/Portfolio/"]', 'img'],
    expectedText: 'LightDiffusion-Next',
  },
  {
    name: 'work-10',
    url: `${baseUrl}/work/10`,
    screenshot: 'work-10.png',
    selectors: ['h1', 'a[href="/Portfolio/"]', 'img'],
    expectedText: 'EasyReader',
  },
];

await mkdir(artifactDir, { recursive: true });
if (!providedBaseUrl) {
  await access(distDir).catch(() => {
    throw new Error('Missing dist/. Run "npm run build" before "npm run smoke:site", or use "npm run smoke:site:fresh".');
  });
}

const preview = providedBaseUrl ? null : startPreviewServer();

try {
  await waitForServer(`${baseUrl}/`);
  const failures = await runBrowserChecks();

  if (failures.length > 0) {
    console.error('Smoke check failed:');
    for (const failure of failures) {
      console.error(`- ${failure}`);
    }
    process.exitCode = 1;
  } else {
    console.log(`Smoke check passed against ${baseUrl}. Artifacts saved to ${artifactDir}`);
  }
} finally {
  stopPreviewServer(preview);
}

function startPreviewServer() {
  const spawned = spawn(process.execPath, [astroCli, 'preview', '--host', host, '--port', String(port)], {
    cwd: repoRoot,
    windowsHide: true,
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  spawned.stdout.on('data', (chunk) => {
    process.stdout.write(`[preview] ${chunk}`);
  });

  spawned.stderr.on('data', (chunk) => {
    process.stderr.write(`[preview] ${chunk}`);
  });

  spawned.on('exit', (code) => {
    if (code !== null && code !== 0) {
      console.error(`Preview server exited early with code ${code}`);
    }
  });

  return spawned;
}

function stopPreviewServer(child) {
  if (!child || child.killed) {
    return;
  }

  child.kill('SIGTERM');
}

async function runBrowserChecks() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 2200 } });
  const failures = [];

  try {
    for (const route of routes) {
      const routeErrors = [];
      page.removeAllListeners('console');
      page.removeAllListeners('pageerror');

      page.on('console', (message) => {
        if (message.type() === 'error') {
          routeErrors.push(`console error on ${route.name}: ${message.text()}`);
        }
      });

      page.on('pageerror', (error) => {
        routeErrors.push(`page error on ${route.name}: ${error.message}`);
      });

      const response = await page.goto(route.url, { waitUntil: 'load', timeout: 30_000 });

      if (!response || response.status() >= 400) {
        failures.push(`${route.name} returned ${response ? response.status() : 'no response'}`);
        continue;
      }

      for (const selector of route.selectors) {
        const locator = page.locator(selector).first();
        const count = await locator.count();
        if (count === 0) {
          failures.push(`${route.name} missing selector ${selector}`);
          continue;
        }

        await locator.waitFor({ state: 'visible', timeout: 10_000 });
      }

      if (route.expectedTitle) {
        const title = await page.title();
        if (title !== route.expectedTitle) {
          failures.push(`${route.name} title was "${title}" instead of "${route.expectedTitle}"`);
        }
      }

      if (route.expectedText) {
        const bodyText = await page.locator('body').textContent();
        if (!bodyText?.includes(route.expectedText)) {
          failures.push(`${route.name} was missing expected text "${route.expectedText}"`);
        }
      }

      if (routeErrors.length > 0) {
        failures.push(...routeErrors);
      }

      await page.screenshot({
        path: path.join(artifactDir, route.screenshot),
        fullPage: Boolean(route.fullPage),
      });
    }
  } finally {
    await browser.close();
  }

  return failures;
}

async function waitForServer(url) {
  const startedAt = Date.now();

  while (Date.now() - startedAt < 20_000) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        return;
      }
    } catch {
      // Preview startup is asynchronous; retry until timeout.
    }

    await new Promise((resolve) => setTimeout(resolve, 250));
  }

  throw new Error(`Timed out waiting for preview server at ${url}`);
}

async function getFreePort() {
  const net = await import('node:net');

  return await new Promise((resolve, reject) => {
    const server = net.createServer();
    server.unref();
    server.on('error', reject);
    server.listen(0, host, () => {
      const address = server.address();
      if (!address || typeof address === 'string') {
        reject(new Error('Unable to determine a free port'));
        return;
      }

      const { port: freePort } = address;
      server.close((error) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(freePort);
      });
    });
  });
}
