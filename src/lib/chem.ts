// Small chemistry helpers shared by the Mole/Stoichiometry visual components:
// a formula parser (handles parentheses + subscripts) plus atomic masses and
// CPK-ish element colours for drawing atoms.

export const ATOMIC_MASS: Record<string, number> = {
  H: 1.008, C: 12.01, N: 14.01, O: 16.0, F: 19.0, Na: 22.99, Mg: 24.31,
  Al: 26.98, Si: 28.09, P: 30.97, S: 32.07, Cl: 35.45, K: 39.1, Ca: 40.08,
  Fe: 55.85, Cu: 63.55, Zn: 65.38, Ag: 107.87, I: 126.9, Au: 196.97,
}

export const ELEMENT_COLOR: Record<string, string> = {
  H: '#E8ECF2', C: '#34404F', N: '#5DADE2', O: '#E74C3C', F: '#48C9B0',
  Na: '#9B59B6', Mg: '#27AE60', Al: '#A9A9B3', Si: '#C9A66B', P: '#E67E22',
  S: '#F1C40F', Cl: '#2ECC71', K: '#8E44AD', Ca: '#95A5A6', Fe: '#D35400',
  Cu: '#E08A50', Zn: '#7F8C8D', Ag: '#BDC3C7', I: '#6C3483', Au: '#F1C40F',
}

export type ElCount = { el: string; count: number }

// Parse e.g. "Ca(OH)2", "(NH4)2SO4", "C6H12O6" into ordered element counts.
export function parseFormula(formula: string): Array<ElCount> {
  let i = 0
  function group(): Record<string, number> {
    const counts: Record<string, number> = {}
    const add = (el: string, n: number) => {
      counts[el] = (counts[el] ?? 0) + n
    }
    while (i < formula.length) {
      const c = formula[i]
      if (c === '(') {
        i++
        const inner = group()
        let num = ''
        while (i < formula.length && /\d/.test(formula[i])) num += formula[i++]
        const m = num ? Number(num) : 1
        for (const k of Object.keys(inner)) add(k, inner[k] * m)
      } else if (c === ')') {
        i++
        return counts
      } else if (/[A-Z]/.test(c)) {
        let el = c
        i++
        while (i < formula.length && /[a-z]/.test(formula[i])) el += formula[i++]
        let num = ''
        while (i < formula.length && /\d/.test(formula[i])) num += formula[i++]
        add(el, num ? Number(num) : 1)
      } else {
        i++
      }
    }
    return counts
  }
  const merged = group()
  // preserve first-appearance order
  const order: Array<string> = []
  let j = 0
  while (j < formula.length) {
    const c = formula[j]
    if (/[A-Z]/.test(c)) {
      let el = c
      j++
      while (j < formula.length && /[a-z]/.test(formula[j])) el += formula[j++]
      if (!order.includes(el)) order.push(el)
    } else j++
  }
  return order.map((el) => ({ el, count: merged[el] ?? 0 }))
}

export function molarMass(formula: string): number {
  return parseFormula(formula).reduce(
    (sum, { el, count }) => sum + (ATOMIC_MASS[el] ?? 0) * count,
    0,
  )
}

const SUB = ['₀', '₁', '₂', '₃', '₄', '₅', '₆', '₇', '₈', '₉']
// Render a code formula like "C6H12O6" with subscript digits for display.
export function prettyFormula(formula: string): string {
  return formula.replace(/\d/g, (d) => SUB[Number(d)])
}
