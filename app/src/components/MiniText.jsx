import { Fragment } from 'react'
import { processes } from '../data/processes.js'

// 노트·챗봇 답의 간단한 서식을 React 요소로 그립니다(HTML을 직접 넣지 않음).
// 줄 앞 "- " 또는 "* " 목록, "> " 인용, "**굵게**", "==형광펜==".
// onOpenProcess를 주면 글 안의 공정 이름을 눌러 그 공정 설명으로 갈 수 있게 합니다.

const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
// 짧은 이름은 엉뚱한 곳에 걸리기 쉬워 3글자 이상만 링크합니다. 긴 이름을 먼저 맞춥니다.
const NAMES = processes
  .flatMap((p) => [p.name.ko, p.name.ko.replace(/\(.*?\)/g, '').trim()].map((name) => ({ name, id: p.id })))
  .filter((x) => x.name.length >= 3)
  .filter((x, i, all) => all.findIndex((y) => y.name === x.name) === i)
  .sort((a, b) => b.name.length - a.name.length)
const NAME_RE = new RegExp(`(${NAMES.map((x) => escape(x.name)).join('|')})`, 'g')
const idOf = (name) => NAMES.find((x) => x.name === name)?.id

function linkify(text, onOpenProcess, keyBase) {
  if (!onOpenProcess) return text
  return text.split(NAME_RE).map((part, i) => {
    const id = i % 2 === 1 ? idOf(part) : null
    return id ? (
      <button key={`${keyBase}-${i}`} type="button" className="link inline-link" onClick={() => onOpenProcess(id)} title="이 공정 설명 열기">
        {part}
      </button>
    ) : (
      <Fragment key={`${keyBase}-${i}`}>{part}</Fragment>
    )
  })
}

function inline(text, onOpenProcess, key) {
  // **굵게**와 ==형광펜==을 나눕니다.
  return text.split(/(\*\*.+?\*\*|==.+?==)/g).map((part, i) => {
    const k = `${key}-${i}`
    if (/^\*\*.+\*\*$/.test(part)) return <strong key={k}>{linkify(part.slice(2, -2), onOpenProcess, k)}</strong>
    if (/^==.+==$/.test(part)) return <mark key={k}>{linkify(part.slice(2, -2), onOpenProcess, k)}</mark>
    return <Fragment key={k}>{linkify(part, onOpenProcess, k)}</Fragment>
  })
}

export default function MiniText({ text, onOpenProcess, className = 'mini-text' }) {
  const blocks = []
  for (const line of text.split('\n')) {
    const list = line.match(/^\s*[-*]\s+(.*)$/)
    const quote = line.match(/^\s*>\s?(.*)$/)
    const kind = list ? 'ul' : quote ? 'quote' : line.trim() === '' ? 'gap' : 'p'
    const body = list ? list[1] : quote ? quote[1] : line
    const last = blocks.at(-1)
    if (last && last.kind === kind && kind !== 'p' && kind !== 'gap') last.lines.push(body)
    else blocks.push({ kind, lines: [body] })
  }
  return (
    <div className={className}>
      {blocks.map((b, i) => {
        if (b.kind === 'gap') return null
        if (b.kind === 'ul')
          return (
            <ul key={i}>
              {b.lines.map((l, j) => (
                <li key={j}>{inline(l, onOpenProcess, `${i}-${j}`)}</li>
              ))}
            </ul>
          )
        if (b.kind === 'quote')
          return (
            <blockquote key={i}>
              {b.lines.map((l, j) => (
                <p key={j}>{inline(l, onOpenProcess, `${i}-${j}`)}</p>
              ))}
            </blockquote>
          )
        return <p key={i}>{inline(b.lines[0], onOpenProcess, i)}</p>
      })}
    </div>
  )
}
