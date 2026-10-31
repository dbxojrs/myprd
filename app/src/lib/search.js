import { processes } from '../data/processes.js'

const normalize = (text) => text.toLowerCase().replace(/\s+/g, '')

// 결과 status: empty | found | ambiguous | none
export function searchProcess(query) {
  const q = normalize(query)
  if (!q) return { status: 'empty' }

  let best = null
  let bestLength = 0
  for (const process of processes) {
    for (const alias of [...process.aliases, process.name.en, process.name.ko]) {
      const a = normalize(alias)
      if (q.includes(a) && a.length > bestLength) {
        best = process
        bestLength = a.length
      }
    }
  }
  if (best) return { status: 'found', process: best }

  const grouped = processes.filter((p) => p.group && q.includes(normalize(p.group)))
  if (grouped.length > 1) return { status: 'ambiguous', group: grouped[0].group, options: grouped }
  if (grouped.length === 1) return { status: 'found', process: grouped[0] }

  return { status: 'none' }
}
