import { Fragment } from 'react'
import { processes } from '../data/processes.js'
import { parseBlocks } from '../lib/blocks.js'

// 노트·챗봇 답의 간단한 서식을 React 요소로 그립니다(HTML을 직접 넣지 않음).
// 블록 문법과 글자 서식은 lib/blocks.js 설명을 따릅니다(제목·목록·할 일·콜아웃·토글·표·이미지 등).
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

// 글자 서식: **굵게** *기울임* ~~취소선~~ `코드` ==형광펜== =={red}색 형광펜== [글](https://…)
const INLINE_RE = /(\*\*.+?\*\*|==(?:\{\w+\})?.+?==|~~.+?~~|`[^`]+`|\*[^*\s][^*]*\*|\[[^\]]+\]\(https?:\/\/[^)\s]+\))/g
export function inline(text, onOpenProcess, key) {
  return String(text ?? '')
    .split(INLINE_RE)
    .map((part, i) => {
      const k = `${key}-${i}`
      let m
      if (/^\*\*.+\*\*$/.test(part)) return <strong key={k}>{linkify(part.slice(2, -2), onOpenProcess, k)}</strong>
      if ((m = part.match(/^==(?:\{(\w+)\})?(.+)==$/))) return <mark key={k} className={m[1] ? `hl-${m[1]}` : undefined}>{linkify(m[2], onOpenProcess, k)}</mark>
      if (/^~~.+~~$/.test(part)) return <s key={k}>{part.slice(2, -2)}</s>
      if (/^`[^`]+`$/.test(part)) return <code key={k}>{part.slice(1, -1)}</code>
      if ((m = part.match(/^\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)$/)))
        return (
          <a key={k} href={m[2]} target="_blank" rel="noreferrer">
            {m[1]}
          </a>
        )
      if (/^\*[^*\s][^*]*\*$/.test(part)) return <em key={k}>{part.slice(1, -1)}</em>
      return <Fragment key={k}>{linkify(part, onOpenProcess, k)}</Fragment>
    })
}

const lines = (text, onOpenProcess, key) =>
  String(text ?? '')
    .split('\n')
    .map((l, i) => (
      <Fragment key={i}>
        {i > 0 && <br />}
        {inline(l, onOpenProcess, `${key}-${i}`)}
      </Fragment>
    ))

// 블록 하나 그리기(편집기의 "보기" 상태에서도 씁니다)
export function BlockView({ b, onOpenProcess, k = b.id, onToggleTodo }) {
  switch (b.type) {
    case 'h1':
      return <h2 className="nb-h1">{inline(b.text, onOpenProcess, k)}</h2>
    case 'h2':
      return <h3 className="nb-h2">{inline(b.text, onOpenProcess, k)}</h3>
    case 'h3':
      return <h4 className="nb-h3">{inline(b.text, onOpenProcess, k)}</h4>
    case 'todo':
      return (
        <div className={`nb-todo${b.checked ? ' checked' : ''}`}>
          <input type="checkbox" checked={Boolean(b.checked)} readOnly={!onToggleTodo} onChange={onToggleTodo} aria-label="할 일 체크" />
          <span>{inline(b.text, onOpenProcess, k)}</span>
        </div>
      )
    case 'quote':
      return <blockquote>{lines(b.text, onOpenProcess, k)}</blockquote>
    case 'callout':
      return (
        <div className={`nb-callout c-${b.color || 'yellow'}`}>
          <span className="nb-callout-icon" aria-hidden="true">
            {b.emoji || '💡'}
          </span>
          <div>{lines(b.text, onOpenProcess, k)}</div>
        </div>
      )
    case 'divider':
      return <hr className="nb-divider" />
    case 'code':
      return (
        <pre className="nb-code">
          {b.lang && <span className="nb-code-lang">{b.lang}</span>}
          <code>{b.text}</code>
        </pre>
      )
    case 'toggle':
      return (
        <details className="nb-toggle" open={b.open !== false}>
          <summary>{inline(b.title || '토글', onOpenProcess, k)}</summary>
          <MiniText text={b.text} onOpenProcess={onOpenProcess} className="nb-toggle-body" />
        </details>
      )
    case 'table':
      return (
        <div className="nb-table-wrap">
          <table className="nb-table">
            <thead>
              <tr>
                {(b.rows?.[0] ?? []).map((c, j) => (
                  <th key={j}>{inline(c, onOpenProcess, `${k}-h${j}`)}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(b.rows ?? []).slice(1).map((r, i) => (
                <tr key={i}>
                  {r.map((c, j) => (
                    <td key={j}>{inline(c, onOpenProcess, `${k}-${i}-${j}`)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
    case 'image':
      return b.url ? (
        <figure className="nb-image">
          <img src={b.url} alt={b.alt || ''} loading="lazy" />
          {b.alt && <figcaption>{b.alt}</figcaption>}
        </figure>
      ) : null
    default:
      return <p>{inline(b.text, onOpenProcess, k)}</p>
  }
}

// 노트·챗봇 답을 그립니다. 같은 종류의 목록은 묶어서 ul/ol로 그립니다.
export default function MiniText({ text, onOpenProcess, className = 'mini-text' }) {
  const blocks = parseBlocks(text)
  const groups = []
  for (const b of blocks) {
    const last = groups.at(-1)
    if ((b.type === 'bullet' || b.type === 'number') && last?.type === b.type) last.items.push(b)
    else groups.push(b.type === 'bullet' || b.type === 'number' ? { type: b.type, items: [b], id: b.id } : b)
  }
  return (
    <div className={className}>
      {groups.map((g, i) => {
        if (g.items) {
          const List = g.type === 'number' ? 'ol' : 'ul'
          return (
            <List key={i}>
              {g.items.map((b, j) => (
                <li key={j}>{inline(b.text, onOpenProcess, `${i}-${j}`)}</li>
              ))}
            </List>
          )
        }
        return <BlockView key={i} b={g} k={String(i)} onOpenProcess={onOpenProcess} />
      })}
    </div>
  )
}
