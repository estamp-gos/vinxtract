'use client'

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

export type EnrichedVehicle = {
  make: string
  model: string
  bodyStyle: string
  engine: string
  transmission: string
  fuelType: string
  color: string
  driveTrain: string
}

const STORAGE_KEY = 'vinReport'

export type PersistedVinReport = {
  vin?: string
  registration?: string
  year?: string
  email?: string
  carModel?: string
  vehicleType?: string
  tier?: string
  tierName?: string
  tierPrice?: number
  currency?: string
  currencySymbol?: string
  timestamp?: string
  enrichment?: EnrichedVehicle | null
}

export type VehicleContextValue = {
  registration: string
  setRegistration: (v: string) => void
  year: string
  setYear: (v: string) => void
  vehicleModel: string
  setVehicleModel: (v: string) => void
  email: string
  setEmail: (v: string) => void
  enrichment: EnrichedVehicle | null
  setEnrichment: React.Dispatch<React.SetStateAction<EnrichedVehicle | null>>
  lookupLoading: boolean
  lookupError: string | null
  runLookup: () => Promise<void>
  clearLookupError: () => void
  persistSnapshot: (extra?: Partial<PersistedVinReport>) => void
  hydrateFromStorage: () => void
}

const VehicleContext = createContext<VehicleContextValue | null>(null)

export function useVehicle(): VehicleContextValue {
  const ctx = useContext(VehicleContext)
  if (!ctx) {
    throw new Error('useVehicle must be used within VehicleProvider')
  }
  return ctx
}

export function VehicleProvider({ children }: { children: React.ReactNode }) {
  const [registration, setRegistrationState] = useState('')
  const [year, setYear] = useState('')
  const [vehicleModel, setVehicleModel] = useState('')
  const [email, setEmail] = useState('')
  const [enrichment, setEnrichment] = useState<EnrichedVehicle | null>(null)
  const [lookupLoading, setLookupLoading] = useState(false)
  const [lookupError, setLookupError] = useState<string | null>(null)

  const setRegistration = useCallback((v: string) => {
    setRegistrationState(v.toUpperCase().replace(/[^A-Z0-9]/g, ''))
  }, [])

  const hydrateFromStorage = useCallback(() => {
    if (typeof window === 'undefined') return
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return
      const data = JSON.parse(raw) as PersistedVinReport
      const reg = (data.registration ?? data.vin ?? '').toString()
      if (reg) setRegistrationState(reg.toUpperCase().replace(/[^A-Z0-9]/g, ''))
      if (data.year != null && data.year !== '') setYear(String(data.year))
      if (data.carModel) setVehicleModel(data.carModel)
      if (data.email) setEmail(data.email)
      if (data.enrichment) setEnrichment(data.enrichment)
    } catch {
      /* ignore */
    }
  }, [])

  useEffect(() => {
    hydrateFromStorage()
  }, [hydrateFromStorage])

  const persistSnapshot = useCallback(
    (extra?: Partial<PersistedVinReport>) => {
      if (typeof window === 'undefined') return
      try {
        let prev: Record<string, unknown> = {}
        const rawPrev = localStorage.getItem(STORAGE_KEY)
        if (rawPrev) prev = JSON.parse(rawPrev)

        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            ...prev,
            vin: registration,
            registration,
            year,
            carModel: vehicleModel,
            email,
            enrichment,
            ...extra,
          })
        )
      } catch {
        /* ignore */
      }
    },
    [registration, year, vehicleModel, email, enrichment]
  )

  const runLookup = useCallback(async () => {
    const reg = registration.trim()
    const y = year.trim()
    const model = vehicleModel.trim()
    if (!reg || !y || !model) {
      setLookupError(
        'Please enter registration, model year, and vehicle model before lookup.'
      )
      return
    }
    setLookupError(null)
    setLookupLoading(true)
    try {
      const res = await fetch('/api/lookup-vehicle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          registration: reg,
          year: y,
          vehicleModel: model,
        }),
      })
      const data = (await res.json()) as {
        success?: boolean
        message?: string
        data?: EnrichedVehicle
      }
      if (!res.ok || !data.success || !data.data) {
        throw new Error(data.message || 'Vehicle lookup failed')
      }
      setEnrichment(data.data)
      persistSnapshot({ enrichment: data.data })
    } catch (e) {
      const msg =
        e instanceof Error ? e.message : 'Vehicle lookup failed'
      setLookupError(msg)
      setEnrichment(null)
    } finally {
      setLookupLoading(false)
    }
  }, [
    registration,
    year,
    vehicleModel,
    persistSnapshot,
  ])

  const clearLookupError = useCallback(() => setLookupError(null), [])

  const value = useMemo(
    (): VehicleContextValue => ({
      registration,
      setRegistration,
      year,
      setYear,
      vehicleModel,
      setVehicleModel,
      email,
      setEmail,
      enrichment,
      setEnrichment,
      lookupLoading,
      lookupError,
      runLookup,
      clearLookupError,
      persistSnapshot,
      hydrateFromStorage,
    }),
    [
      registration,
      setRegistration,
      year,
      vehicleModel,
      email,
      enrichment,
      lookupLoading,
      lookupError,
      runLookup,
      clearLookupError,
      persistSnapshot,
      hydrateFromStorage,
    ]
  )

  return (
    <VehicleContext.Provider value={value}>{children}</VehicleContext.Provider>
  )
}
