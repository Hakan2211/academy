import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { MotionConfig } from 'motion/react'

// Client-side learner preferences (Settings → Appearance). Persisted to
// localStorage so they survive reloads; deliberately device-local rather than on
// the account row, since they tune *this* device's rendering. The only setting
// today is "reduce motion", bridged into Motion via <MotionConfig> below so that
// every existing useReducedMotion() call across the app honors it.

const STORAGE_KEY = 'orbisle:reduce-motion'

type Preferences = {
  reduceMotion: boolean
  setReduceMotion: (value: boolean) => void
}

const PreferencesContext = createContext<Preferences>({
  reduceMotion: false,
  setReduceMotion: () => {},
})

export function PreferencesProvider({ children }: { children: ReactNode }) {
  // Start `false` so SSR and the first client render agree; the persisted value
  // is read after mount (mirrors DeviceIdProvider) to avoid a hydration mismatch.
  const [reduceMotion, setReduceMotionState] = useState(false)

  useEffect(() => {
    try {
      setReduceMotionState(localStorage.getItem(STORAGE_KEY) === '1')
    } catch {
      /* localStorage unavailable (private mode) — keep the default */
    }
  }, [])

  const setReduceMotion = (value: boolean) => {
    setReduceMotionState(value)
    try {
      localStorage.setItem(STORAGE_KEY, value ? '1' : '0')
    } catch {
      /* ignore persistence failure */
    }
  }

  return (
    <PreferencesContext.Provider value={{ reduceMotion, setReduceMotion }}>
      {/* `always` forces reduced motion app-wide; `user` defers to the OS
          setting (the prior default behavior). */}
      <MotionConfig reducedMotion={reduceMotion ? 'always' : 'user'}>
        {children}
      </MotionConfig>
    </PreferencesContext.Provider>
  )
}

export function usePreferences(): Preferences {
  return useContext(PreferencesContext)
}
