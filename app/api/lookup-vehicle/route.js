import { NextResponse } from 'next/server'
import Groq from 'groq-sdk'

const DEFAULT_MODEL =
  process.env.GROQ_MODEL?.trim() || 'llama-3.3-70b-versatile'

/** @typedef {{ make: string; model: string; bodyStyle: string; engine: string; transmission: string; fuelType: string; color: string; driveTrain: string }} VehicleDetails */

/** @returns {VehicleDetails | null} */
function safeParseGroqJson(text) {
  if (!text || typeof text !== 'string') return null
  const trimmed = text.trim()
  const start = trimmed.indexOf('{')
  const end = trimmed.lastIndexOf('}')
  const slice =
    start >= 0 && end > start ? trimmed.slice(start, end + 1) : trimmed
  try {
    /** @type {Record<string, unknown>} */
    const obj = JSON.parse(slice)
    return {
      make: String(obj.make ?? 'N/A'),
      model: String(obj.model ?? 'N/A'),
      bodyStyle: String(obj.bodyStyle ?? 'N/A'),
      engine: String(obj.engine ?? 'N/A'),
      transmission: String(obj.transmission ?? 'N/A'),
      fuelType: String(obj.fuelType ?? 'N/A'),
      color: String(obj.color ?? 'N/A'),
      driveTrain: String(obj.driveTrain ?? 'N/A'),
    }
  } catch {
    return null
  }
}

export async function POST(request) {
  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) {
    return NextResponse.json(
      {
        success: false,
        message:
          'GROQ_API_KEY is not set. Add it to your environment (see .env.example).',
      },
      { status: 503 }
    )
  }

  let body
  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      { success: false, message: 'Invalid JSON body' },
      { status: 400 }
    )
  }

  const registration = String(body?.registration ?? '').trim()
  const year = String(body?.year ?? '').trim()
  const vehicleModel = String(body?.vehicleModel ?? '').trim()

  if (!registration || !year || !vehicleModel) {
    return NextResponse.json(
      {
        success: false,
        message: 'registration, year, and vehicleModel are required',
      },
      { status: 400 }
    )
  }

  const prompt = `You are a vehicle specification expert. Given the following vehicle information, provide detailed specifications:
- Registration/Plate: ${registration}
- Year: ${year}
- Model: ${vehicleModel}

For a ${year} ${vehicleModel}, provide typical specifications. Return ONLY a valid JSON object (no explanation, no markdown):
{
  "make": "the manufacturer brand",
  "model": "the exact model name",
  "bodyStyle": "sedan/hatchback/suv/coupe/wagon etc",
  "engine": "typical engine size/type like 1.6L 4-cylinder or 2.0L petrol",
  "transmission": "manual/automatic/CVT - be specific",
  "fuelType": "petrol/diesel/hybrid/electric",
  "color": "common color for this model",
  "driveTrain": "FWD/RWD/AWD"
}
Based on your knowledge of ${year} ${vehicleModel} specifications. If absolutely unknown, use "N/A". Provide real specs, not N/A.`

  try {
    const client = new Groq({ apiKey })
    const completion = await client.chat.completions.create({
      model: DEFAULT_MODEL,
      temperature: 0.2,
      max_tokens: 512,
      messages: [
        {
          role: 'system',
          content:
            'You output only compact JSON matching the requested schema.',
        },
        { role: 'user', content: prompt },
      ],
    })

    const text = completion.choices[0]?.message?.content ?? ''
    const parsed = safeParseGroqJson(text)

    if (!parsed) {
      return NextResponse.json(
        {
          success: false,
          message:
            'Could not parse structured vehicle data from the model response.',
          rawPreview: text.slice(0, 500),
        },
        { status: 502 }
      )
    }

    return NextResponse.json({ success: true, data: parsed })
  } catch (err) {
    const msg =
      err instanceof Error ? err.message : 'Groq lookup request failed'
    return NextResponse.json({ success: false, message: msg }, { status: 502 })
  }
}
