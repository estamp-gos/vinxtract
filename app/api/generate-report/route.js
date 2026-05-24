import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'
import chromium from '@sparticuz/chromium'
import puppeteerCore from 'puppeteer-core'

export const runtime = 'nodejs'
export const maxDuration = 120

/** @returns {Record<string,string>} */
function coerceReportBody(payload) {
  const e =
    typeof payload.enrichment === 'object' && payload.enrichment !== null
      ? payload.enrichment
      : {}
  const reg = String(
    payload.registration ?? payload.reg ?? payload.vin ?? ''
  ).trim()
  const year = String(payload.year ?? '').trim()
  const modelFromUser = String(
    payload.vehicleModel ?? payload.carModel ?? ''
  ).trim()
  const mk = String(e.make ?? 'N/A').trim()
  const md = String(e.model ?? modelFromUser ?? 'N/A').trim()
  const banner = [year, mk, md].filter(Boolean).join(' ').trim()

  const reportDate =
    typeof payload.reportDate === 'string' && payload.reportDate.trim()
      ? payload.reportDate.trim()
      : new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })

  return {
    REG: reg || 'N/A',
    YEAR: year || 'N/A',
    MAKE: mk || 'N/A',
    MODEL: md || 'N/A',
    BANNER_TITLE: banner || 'Vehicle report',
    BODY_STYLE: String(e.bodyStyle ?? 'N/A'),
    ENGINE: String(e.engine ?? 'N/A'),
    TRANSMISSION: String(e.transmission ?? 'N/A'),
    FUEL_TYPE: String(e.fuelType ?? 'N/A'),
    COLOR: String(e.color ?? 'N/A'),
      DOORS: String(
        e.doors ??
          payload.doors ??
          // try to infer doors from bodyStyle, model, or provided vehicleModel
          (function inferDoors() {
            const sources = [String(e.bodyStyle ?? ''), String(e.model ?? ''), String(payload.vehicleModel ?? '')]
            for (const s of sources) {
              const m = String(s || '').match(/(\d)\s*-?\s*door/i)
              if (m && m[1]) return m[1]
              const m2 = String(s || '').match(/\b(2|3|4|5)\b\s*(?:door|doors)?/i)
              if (m2 && m2[1]) return m2[1]
            }
            return 'N/A'
          })()
      ),
    DRIVE_TRAIN: String(e.driveTrain ?? 'N/A'),
    REPORT_DATE: reportDate,
    LOGO_SRC: '{{LOGO_SRC}}',
  }
}

function escapeReplacement(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function applyPlaceholders(html, map) {
  let out = html
  const ordered = [...Object.entries(map)].sort(
    (a, b) => b[0].length - a[0].length
  )
  for (const [key, val] of ordered) {
    const token = new RegExp(
      `\\{\\{\\s*${key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*\\}\\}`,
      'g'
    )
    out = out.replace(token, escapeReplacement(val))
  }
  return out
}

async function resolveLogoSrc(cwd) {
  const logoCandidates = [
    path.join(cwd, 'public', 'car-logo.webp'),
    path.join(cwd, 'public', 'car-logo.png'),
    path.join(cwd, 'report-template', 'car-logo.png'),
  ]
  for (const candidate of logoCandidates) {
    try {
      await fs.access(candidate)
      const data = await fs.readFile(candidate)
      const ext = path.extname(candidate).toLowerCase()
      const mime = ext === '.webp' ? 'image/webp' : ext === '.png' ? 'image/png' : ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg' : 'application/octet-stream'
      return `data:${mime};base64,${Buffer.from(data).toString('base64')}`
    } catch {
      /* try next */
    }
  }
  return ''
}

async function resolveExampleCarImage(cwd) {
  const imageCandidates = [
    path.join(cwd, 'report-template', 'example-car-2.png'),
    path.join(cwd, 'public', 'example-car-2.png'),
  ]
  for (const candidate of imageCandidates) {
    try {
      await fs.access(candidate)
      const data = await fs.readFile(candidate)
      const ext = path.extname(candidate).toLowerCase()
      const mime = ext === '.webp' ? 'image/webp' : ext === '.png' ? 'image/png' : ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg' : 'application/octet-stream'
      return `data:${mime};base64,${Buffer.from(data).toString('base64')}`
    } catch {
      /* try next */
    }
  }
  return ''
}

function stripTrailingScript(html) {
  return html.replace(
    /<script\b[\s\S]*?<\/script>\s*(?=<\/body>)/i,
    '<!-- scripts omitted for pdf -->\n'
  )
}

function safeFilename(reg) {
  const base =
    String(reg || 'vehicle')
      .replace(/[^\w\d-]+/gi, '')
      .slice(0, 32) || 'vehicle'
  return `VinXtract-Report-${base}.pdf`
}

export async function POST(request) {
  let payload
  try {
    payload = await request.json()
  } catch {
    return NextResponse.json(
      { success: false, message: 'Invalid JSON body' },
      { status: 400 }
    )
  }

  const cwd = process.cwd()
  const templatePath = path.join(cwd, 'report-template', 'index.html')

  let rawTemplate
  try {
    rawTemplate = await fs.readFile(templatePath, 'utf8')
  } catch {
    return NextResponse.json(
      { success: false, message: 'Report template not found' },
      { status: 500 }
    )
  }

  const placeholders = coerceReportBody(payload)
  const logoHref = await resolveLogoSrc(cwd)
  placeholders.LOGO_SRC =
    logoHref ||
    `data:image/svg+xml,${encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><rect fill="#3a9aab" width="64" height="64" rx="8"/><text x="32" y="40" text-anchor="middle" fill="white" font-size="12" font-family="sans-serif">VX</text></svg>'
    )}`

  const exampleCarHref = await resolveExampleCarImage(cwd)
  placeholders.EXAMPLE_CAR_IMAGE =
    exampleCarHref ||
    `data:image/svg+xml,${encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="150"><rect fill="#f0f0f0" width="200" height="150" rx="4"/><text x="100" y="75" text-anchor="middle" fill="#999" font-size="14" font-family="sans-serif">Vehicle Image</text></svg>'
    )}`

  let html = rawTemplate
  html = stripTrailingScript(html)
  html = applyPlaceholders(html, placeholders)

  let executablePath = process.env.PUPPETEER_EXECUTABLE_PATH || process.env.CHROME_PATH
  try {
    if (!executablePath) {
      executablePath = await chromium.executablePath()
    }
  } catch (e) {
    // ignore; chromium may not provide a local binary in dev environments
  }

  // Ensure the executablePath actually exists; if it doesn't, unset to allow fallback.
  if (executablePath) {
    try {
      await fs.access(executablePath)
      const stat = await fs.stat(executablePath)
      if (typeof stat.isDirectory === 'function' && stat.isDirectory()) {
        // chromium.executablePath() may return a directory; try common names inside it
        const insideCandidates = ['chrome.exe', 'chromium.exe', 'chrome', 'chromium']
        let found = false
        for (const name of insideCandidates) {
          const candidate = path.join(executablePath, name)
          try {
            await fs.access(candidate)
            executablePath = candidate
            found = true
            break
          } catch {
            // try next
          }
        }
        if (!found) {
          throw new Error('no executable inside chromium dir')
        }
      }
    } catch (e) {
      console.warn('Chromium executablePath not found, falling back to bundled puppeteer:', executablePath)
      executablePath = undefined
    }
  }

  // If still not found, probe common system locations for Chrome/Chromium (helpful in local dev).
  if (!executablePath) {
    const candidates = [
      'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
      'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
      '/usr/bin/google-chrome-stable',
      '/usr/bin/google-chrome',
      '/usr/bin/chromium-browser',
      '/usr/bin/chromium',
      '/snap/bin/chromium',
    ]
    for (const c of candidates) {
      try {
        await fs.access(c)
        executablePath = c
        console.log('Found system Chrome at', c)
        break
      } catch {
        // try next
      }
    }
  }

  // Also check Puppeteer's cache for a downloaded Chrome binary (e.g. C:\Users\...\.cache\puppeteer\chrome\<version>\chrome-win64\chrome.exe)
  if (!executablePath) {
    const userHome = process.env.USERPROFILE || process.env.HOME || ''
    const puppeteerCache = path.join(userHome, '.cache', 'puppeteer', 'chrome')
    try {
      const versions = await fs.readdir(puppeteerCache)
      // pick the most recent-looking folder
      versions.sort().reverse()
      for (const v of versions) {
        const candidate = path.join(puppeteerCache, v, 'chrome-win64', 'chrome.exe')
        try {
          await fs.access(candidate)
          executablePath = candidate
          console.log('Using puppeteer cached chrome at', candidate)
          break
        } catch {
          // continue
        }
      }
    } catch {
      // ignore if cache dir missing
    }
  }

  const requireExecutableInProd = process.env.NODE_ENV === 'production' || !!process.env.VERCEL
  if (!executablePath && requireExecutableInProd) {
    return NextResponse.json(
      {
        success: false,
        message:
          'No Chrome/Chromium executable found for PDF rendering. Install Chrome locally or set PUPPETE_EXECUTABLE_PATH.',
      },
      { status: 503 }
    )
  }

  /** @type {import('puppeteer-core').Browser} */
  let browser
  try {
    const extraArgs = [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--disable-software-rasterizer',
    ]

    const baseArgs = (chromium.args || []).filter(a => a !== '--single-process' && a !== '--no-zygote')
    const launchOptions = {
      headless: chromium.headless ?? true,
      executablePath,
      args: baseArgs.concat(extraArgs),
      ignoreHTTPSErrors: true,
      dumpio: true,
    }

    // Choose puppeteer implementation: prefer puppeteer-core when we have an executablePath,
    // otherwise fall back to the full puppeteer package (which bundles Chromium) for local dev.
    const puppeteerImpl = executablePath ? puppeteerCore : (await import('puppeteer')).default

    console.log('Launching Chromium for PDF generation', {
      executablePath: String(executablePath).slice(0, 200),
      headless: launchOptions.headless,
      using: executablePath ? 'puppeteer-core' : 'puppeteer',
    })

    try {
      browser = await puppeteerImpl.launch(launchOptions)
    } catch (launchErr) {
      console.warn('Primary puppeteer launch failed:', String(launchErr).slice(0, 200))
      // If we tried puppeteer-core with a missing executable, try fallback to full puppeteer (bundled chrome)
      if (executablePath) {
        try {
          const alt = (await import('puppeteer')).default
          const altOptions = { ...launchOptions }
          delete altOptions.executablePath
          console.log('Retrying launch with bundled puppeteer (no executablePath)')
          browser = await alt.launch(altOptions)
        } catch (altErr) {
          console.error('Fallback puppeteer launch also failed:', altErr)
          throw launchErr
        }
      } else {
        throw launchErr
      }
    }

    const page = await browser.newPage()
    await page.setViewport({ width: 1024, height: 1400 })
    await page.emulateMediaType('print')
    // instrument page for extra debug info in non-production
    if (process.env.NODE_ENV !== 'production') {
      page.on('console', (m) => console.log('PAGE_CONSOLE:', m.text ? m.text() : String(m)))
      page.on('pageerror', (err) => console.error('PAGE_ERROR:', err && err.stack ? err.stack : err))
    }

    await page.setContent(html, { waitUntil: 'networkidle0', timeout: 90_000 })
    // allow content to stabilise
    await new Promise((r) => setTimeout(r, 1500))

    // Debug: capture HTML length and screenshot when not in production
    if (process.env.NODE_ENV !== 'production') {
      try {
        const bodyHtml = await page.content()
        console.log('PAGE_HTML_LENGTH:', bodyHtml.length)
        const debugPath = path.join(process.cwd(), 'tmp-pdf-debug.png')
        await page.screenshot({ path: debugPath, fullPage: true })
        try {
          const st = await fs.stat(debugPath)
          console.log('DEBUG_SCREENSHOT_SIZE:', st.size, 'bytes ->', debugPath)
        } catch (e) {
          console.warn('Could not stat debug screenshot', e)
        }
      } catch (e) {
        console.warn('Debug capture failed', e)
      }
    }

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '14px', right: '14px', bottom: '14px', left: '14px' },
    })

    await browser.close()
    browser = undefined

    const filename = safeFilename(placeholders.REG)

    return new NextResponse(Buffer.from(pdfBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    })
  } catch (err) {
    if (browser) {
      await browser.close().catch(() => {})
    }
    console.error('PDF generation error:', err)
    const msg = err instanceof Error ? err.message : 'PDF generation failed'
    const stack = err && err.stack ? String(err.stack).slice(0, 2000) : undefined
    return NextResponse.json({ success: false, message: msg, stack }, { status: 500 })
  }
}
