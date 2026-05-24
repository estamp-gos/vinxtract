import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'
import chromium from '@sparticuz/chromium'
import puppeteer from 'puppeteer-core'

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

  const executablePath =
    process.env.PUPPETEER_EXECUTABLE_PATH ||
    process.env.CHROME_PATH ||
    (await chromium.executablePath())

  if (!executablePath) {
    return NextResponse.json(
      {
        success: false,
        message:
          'No Chrome/Chromium executable found for PDF rendering. Install Chrome locally or set PUPPETEER_EXECUTABLE_PATH.',
      },
      { status: 503 }
    )
  }

  /** @type {import('puppeteer-core').Browser} */
  let browser
  try {
    browser = await puppeteer.launch({
      headless: true,
      executablePath,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
    })

    const page = await browser.newPage()
    await page.setViewport({ width: 1024, height: 1400 })
    await page.emulateMediaType('print')
    await page.setContent(html, { waitUntil: 'networkidle0', timeout: 90_000 })
    await new Promise((r) => setTimeout(r, 800))
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
    const msg = err instanceof Error ? err.message : 'PDF generation failed'
    return NextResponse.json({ success: false, message: msg }, { status: 500 })
  }
}
