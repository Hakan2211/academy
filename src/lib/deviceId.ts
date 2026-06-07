const KEY = 'orbisle.deviceId'
// Pre-rename key (app was called "Academy") — migrated below so existing
// devices keep their anonymous identity and the progress attached to it.
const LEGACY_KEY = 'academy.deviceId'

/**
 * Stable per-device id used as our anonymous identity until real auth lands.
 * Client-only (touches localStorage) — returns undefined during SSR.
 */
export function getOrCreateDeviceId(): string | undefined {
  if (typeof window === 'undefined') return undefined
  try {
    let id = window.localStorage.getItem(KEY)
    if (!id) {
      const legacy = window.localStorage.getItem(LEGACY_KEY)
      if (legacy) {
        window.localStorage.setItem(KEY, legacy)
        return legacy
      }
    }
    if (!id) {
      id = crypto.randomUUID()
      window.localStorage.setItem(KEY, id)
    }
    return id
  } catch {
    // localStorage blocked (e.g. private mode) — fall back to an ephemeral id.
    return crypto.randomUUID()
  }
}
