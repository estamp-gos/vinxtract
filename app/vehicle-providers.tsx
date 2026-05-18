'use client'

import type { ReactNode } from 'react'
import { VehicleProvider } from '@/lib/vehicleContext'

export default function VehicleProviders({ children }: { children: ReactNode }) {
  return <VehicleProvider>{children}</VehicleProvider>
}
