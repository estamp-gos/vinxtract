import fs from 'fs'
import puppeteer from 'puppeteer'

/**
 * Puppeteer resolves bundled Chromium when downloaded; env / common paths handle skip-download installs.
 */
export function resolveChromeExecutable(): string | undefined {
  const fromEnv =
    process.env.PUPPETEER_EXECUTABLE_PATH || process.env.CHROME_PATH
  if (fromEnv && fs.existsSync(fromEnv)) {
    return fromEnv
  }

  try {
    const bundled = puppeteer.executablePath()
    if (bundled && fs.existsSync(bundled)) return bundled
  } catch {
    /* no bundled browser */
  }

  if (process.platform === 'win32') {
    const candidates = [
      'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
      'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
      process.env.LOCALAPPDATA
        ? `${process.env.LOCALAPPDATA}\\Google\\Chrome\\Application\\chrome.exe`
        : '',
    ].filter(Boolean) as string[]
    for (const p of candidates) {
      if (fs.existsSync(p)) return p
    }
  }

  if (process.platform === 'darwin') {
    const p =
      '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
    if (fs.existsSync(p)) return p
  }

  if (process.platform === 'linux') {
    const candidates = [
      '/usr/bin/google-chrome',
      '/usr/bin/google-chrome-stable',
      '/usr/bin/chromium',
      '/usr/bin/chromium-browser',
    ]
    for (const p of candidates) {
      if (fs.existsSync(p)) return p
    }
  }

  return undefined
}
