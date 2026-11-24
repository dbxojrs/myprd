// 공정 데이터 분석 계산(규칙 기반, AI·무작위 없음).
// 공식 출처
//   개별값 관리도: NIST/SEMATECH e-Handbook 6.3.2.2 — UCL/LCL = x̄ ± 3·MR̄/1.128 (1.128 = n=2일 때 d2)
//   관리 이탈 규칙(WECO): NIST 6.3.2 — 3σ 밖 1점, 3점 중 2점이 2σ 밖(같은 쪽), 5점 중 4점이 1σ 밖(같은 쪽), 8점 연속 같은 쪽
//   공정능력: NIST 6.1.6 — Cp = (USL−LSL)/6s, Cpk = min[(USL−x̄)/3s, (x̄−LSL)/3s] (s: 표본 표준편차)

export const mean = (xs) => (xs.length ? xs.reduce((s, x) => s + x, 0) / xs.length : NaN)

// 표본 표준편차(n−1)
export function stdev(xs) {
  if (xs.length < 2) return NaN
  const m = mean(xs)
  return Math.sqrt(xs.reduce((s, x) => s + (x - m) ** 2, 0) / (xs.length - 1))
}

// 숫자 목록 글자 → 숫자 배열 (쉼표·공백·줄바꿈 구분)
export const parseNumbers = (text) =>
  String(text)
    .split(/[\s,;]+/)
    .map((t) => t.trim())
    .filter(Boolean)
    .map(Number)
    .filter((n) => Number.isFinite(n))

// 개별값(I) 관리도 한계선. base: 한계선을 계산할 앞쪽 점 수(없으면 전체)
export function individualsLimits(xs, base = xs.length) {
  const ref = xs.slice(0, Math.max(2, Math.min(base, xs.length)))
  const mr = ref.slice(1).map((x, i) => Math.abs(x - ref[i]))
  const center = mean(ref)
  const mrBar = mean(mr)
  const sigma = mrBar / 1.128
  return { center, mrBar, sigma, ucl: center + 3 * sigma, lcl: center - 3 * sigma, base: ref.length }
}

export const WECO_RULES = [
  { id: 1, label: '3σ 밖 1점', desc: '관리 한계선(±3σ) 밖에 점이 하나 있습니다.' },
  { id: 2, label: '3점 중 2점이 2σ 밖', desc: '연속 3점 중 2점이 중심선 같은 쪽 2σ 밖에 있습니다.' },
  { id: 3, label: '5점 중 4점이 1σ 밖', desc: '연속 5점 중 4점이 중심선 같은 쪽 1σ 밖에 있습니다.' },
  { id: 4, label: '8점 연속 같은 쪽', desc: '연속 8점이 중심선 한쪽에만 있습니다(평균이 옮겨 갔을 수 있음).' },
]

// 각 점이 걸린 규칙 번호 목록. 규칙에 걸린 묶음의 마지막 점에 표시합니다.
export function wecoFlags(xs, { center, sigma }) {
  const z = xs.map((x) => (x - center) / sigma)
  const flags = xs.map(() => [])
  const sideCount = (from, to, lim, sign) => {
    let n = 0
    for (let k = from; k <= to; k++) if (sign * z[k] > lim) n++
    return n
  }
  z.forEach((v, i) => {
    if (Math.abs(v) > 3) flags[i].push(1)
    for (const sign of [1, -1]) {
      if (i >= 2 && sign * v > 2 && sideCount(i - 2, i, 2, sign) >= 2) flags[i].push(2)
      if (i >= 4 && sign * v > 1 && sideCount(i - 4, i, 1, sign) >= 4) flags[i].push(3)
      if (i >= 7 && sideCount(i - 7, i, 0, sign) === 8) flags[i].push(4)
    }
  })
  return flags.map((f) => [...new Set(f)])
}

export const firstSignal = (flags) => flags.findIndex((f) => f.length > 0)

// 공정능력. lsl/usl 중 하나만 있어도 됩니다(한쪽 규격).
export function capability(xs, lsl, usl) {
  const m = mean(xs)
  const s = stdev(xs)
  const hasL = Number.isFinite(lsl)
  const hasU = Number.isFinite(usl)
  const cpu = hasU ? (usl - m) / (3 * s) : null
  const cpl = hasL ? (m - lsl) / (3 * s) : null
  const cp = hasL && hasU ? (usl - lsl) / (6 * s) : null
  const cpk = [cpu, cpl].filter((v) => v != null).reduce((a, b) => Math.min(a, b), Infinity)
  const out = xs.filter((x) => (hasL && x < lsl) || (hasU && x > usl)).length
  return { n: xs.length, mean: m, s, cp, cpk: Number.isFinite(cpk) ? cpk : null, cpu, cpl, out }
}

// Pareto: 많은 순서로 정렬하고 누적 비율을 붙입니다.
export function pareto(counts) {
  const rows = Object.entries(counts)
    .map(([label, n]) => ({ label, n }))
    .sort((a, b) => b.n - a.n)
  const total = rows.reduce((s, r) => s + r.n, 0)
  let acc = 0
  return {
    total,
    rows: rows.map((r) => {
      acc += r.n
      return { ...r, pct: total ? (r.n / total) * 100 : 0, cum: total ? (acc / total) * 100 : 0 }
    }),
  }
}

export const fmt = (v, d = 2) => (v == null || !Number.isFinite(v) ? '—' : v.toFixed(d))
