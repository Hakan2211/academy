import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { getOrCreateDeviceId } from './deviceId'

const DeviceIdContext = createContext<string | undefined>(undefined)

export function DeviceIdProvider({ children }: { children: ReactNode }) {
  const [deviceId, setDeviceId] = useState<string | undefined>(undefined)
  useEffect(() => {
    setDeviceId(getOrCreateDeviceId())
  }, [])
  return (
    <DeviceIdContext.Provider value={deviceId}>
      {children}
    </DeviceIdContext.Provider>
  )
}

/** The device id, or `undefined` during SSR / the first client render. */
export function useDeviceId(): string | undefined {
  return useContext(DeviceIdContext)
}
