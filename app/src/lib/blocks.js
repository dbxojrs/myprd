// 노트 본문(Markdown 글) ↔ 블록 목록 변환. 노트는 계속 Markdown 글 하나(body)로 저장하고,
// 페이지 편집기는 이 글을 블록으로 나눠 보여 준 뒤 다시 글로 합쳐 저장합니다.
// 그래서 떠 있는 노트 창(글 편집)·검색·내보내기·노션 복사가 모두 그대로 동작합니다.
//
// 블록 문법
//   # / ## / ###      제목 1~3              - 글          글머리 목록
//   1. 글             번호 목록             - [ ] / - [x]  할 일
//   > 글              인용                  > [!💡|blue] 글  콜아웃(아이콘|색)
//   ---               구분선                ```언어 … ```   코드
//   | a | b |         표                    ![설명](주소)   이미지
//   <details><summary>제목</summary> … </details>         토글
// 글자 서식: **굵게** *기울임* ~~취소선~~ `코드` ==형광펜== =={red}색 형광펜== [글](https://…)

export const COLORS = ['gray', 'brown', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink', 'red']
export const COLOR_LABEL = { gray: '회색', brown: '갈색', orange: '주황', yellow: '노랑', green: '초록', blue: '파랑', purple: '보라', pink: '분홍', red: '빨강' }

export const BLOCK_TYPES = [
  { type: 'p', label: '글', icon: '¶', keys: 'text 글 본문 문단', desc: '그냥 글' },
  { type: 'h1', label: '제목 1', icon: 'H1', keys: 'h1 heading 제목 큰', desc: '가장 큰 제목' },
  { type: 'h2', label: '제목 2', icon: 'H2', keys: 'h2 heading 제목 중간', desc: '중간 제목' },
  { type: 'h3', label: '제목 3', icon: 'H3', keys: 'h3 heading 제목 작은', desc: '작은 제목' },
  { type: 'bullet', label: '글머리 목록', icon: '•', keys: 'bullet list 목록 글머리', desc: '점 목록' },
  { type: 'number', label: '번호 목록', icon: '1.', keys: 'number list 번호 순서', desc: '순서 목록' },
  { type: 'todo', label: '할 일', icon: '☑', keys: 'todo check 할일 체크 체크리스트', desc: '체크박스' },
  { type: 'toggle', label: '토글', icon: '▸', keys: 'toggle 토글 접기 펼치기', desc: '접고 펼치는 내용' },
  { type: 'callout', label: '콜아웃', icon: '💡', keys: 'callout 콜아웃 강조 박스 상자', desc: '아이콘과 색 상자' },
  { type: 'quote', label: '인용', icon: '❝', keys: 'quote 인용', desc: '인용 글' },
  { type: 'divider', label: '구분선', icon: '—', keys: 'divider hr 구분선 줄', desc: '가로줄' },
  { type: 'code', label: '코드', icon: '</>', keys: 'code 코드', desc: '고정폭 글' },
  { type: 'table', label: '표', icon: '▦', keys: 'table 표 테이블', desc: '행과 열' },
  { type: 'image', label: '이미지', icon: '🖼', keys: 'image 이미지 사진 그림', desc: '주소나 파일' },
]
export const typeInfo = (type) => BLOCK_TYPES.find((t) => t.type === type) ?? BLOCK_TYPES[0]
export const TEXT_TYPES = new Set(['p', 'h1', 'h2', 'h3', 'bullet', 'number', 'todo', 'quote', 'callout', 'code', 'toggle'])
const LIST_TYPES = new Set(['bullet', 'number', 'todo'])

let seq = 0
export const blockId = () => `b${Date.now().toString(36)}${(seq++).toString(36)}`

export function newBlock(type = 'p', extra = {}) {
  const b = { id: blockId(), type, text: '' }
  if (type === 'todo') b.checked = false
  if (type === 'callout') Object.assign(b, { emoji: '💡', color: 'yellow' })
  if (type === 'toggle') Object.assign(b, { title: '', open: true })
  if (type === 'code') b.lang = ''
  if (type === 'table') b.rows = [['', ''], ['', '']]
  if (type === 'image') Object.assign(b, { url: '', alt: '' })
  return { ...b, ...extra }
}

const cells = (line) =>
  line
    .trim()
    .replace(/^\|/, '')
    .replace(/\|$/, '')
    .split('|')
    .map((c) => c.trim())

export function parseBlocks(md = '') {
  const lines = String(md).replace(/\r\n?/g, '\n').split('\n')
  const out = []
  let i = 0
  while (i < lines.length) {
    const line = lines[i]
    let m
    if ((m = line.match(/^```(.*)$/))) {
      const body = []
      i += 1
      while (i < lines.length && !/^```\s*$/.test(lines[i])) body.push(lines[i++])
      out.push(newBlock('code', { lang: m[1].trim(), text: body.join('\n') }))
      i += 1
      continue
    }
    if ((m = line.match(/^<details( open)?>\s*(?:<summary>(.*?)<\/summary>)?\s*$/))) {
      let title = m[2] ?? ''
      const body = []
      i += 1
      if (!m[2] && i < lines.length && (m = lines[i].match(/^<summary>(.*?)<\/summary>\s*$/))) {
        title = m[1]
        i += 1
      }
      while (i < lines.length && !/^<\/details>\s*$/.test(lines[i])) body.push(lines[i++])
      out.push(newBlock('toggle', { title, text: body.join('\n').trim(), open: true }))
      i += 1
      continue
    }
    if (/^\|.*\|\s*$/.test(line)) {
      const rows = []
      while (i < lines.length && /^\|.*\|\s*$/.test(lines[i])) {
        if (!/^\|(\s*:?-+:?\s*\|)+\s*$/.test(lines[i])) rows.push(cells(lines[i]))
        i += 1
      }
      const width = Math.max(...rows.map((r) => r.length))
      out.push(newBlock('table', { rows: rows.map((r) => [...r, ...Array(width - r.length).fill('')]) }))
      continue
    }
    if ((m = line.match(/^>\s?\[!([^\]|]*)(?:\|(\w+))?\]\s?(.*)$/))) {
      const body = [m[3]]
      i += 1
      while (i < lines.length && /^>/.test(lines[i]) && !/^>\s?\[!/.test(lines[i])) body.push(lines[i++].replace(/^>\s?/, ''))
      out.push(newBlock('callout', { emoji: m[1].trim() || '💡', color: COLORS.includes(m[2]) ? m[2] : 'yellow', text: body.join('\n') }))
      continue
    }
    if (/^>/.test(line)) {
      const body = []
      while (i < lines.length && /^>/.test(lines[i]) && !/^>\s?\[!/.test(lines[i])) body.push(lines[i++].replace(/^>\s?/, ''))
      out.push(newBlock('quote', { text: body.join('\n') }))
      continue
    }
    i += 1
    if (line.trim() === '') continue
    if ((m = line.match(/^(#{1,3})\s+(.*)$/))) out.push(newBlock(`h${m[1].length}`, { text: m[2] }))
    else if ((m = line.match(/^\s*[-*]\s+\[( |x|X)\]\s?(.*)$/))) out.push(newBlock('todo', { checked: m[1] !== ' ', text: m[2] }))
    else if ((m = line.match(/^\s*[-*]\s+(.*)$/))) out.push(newBlock('bullet', { text: m[1] }))
    else if ((m = line.match(/^\s*\d+[.)]\s+(.*)$/))) out.push(newBlock('number', { text: m[1] }))
    else if (/^\s*(-{3,}|\*{3,}|_{3,})\s*$/.test(line)) out.push(newBlock('divider'))
    else if ((m = line.match(/^!\[(.*?)\]\((\S+?)\)\s*$/))) out.push(newBlock('image', { alt: m[1], url: m[2] }))
    else out.push(newBlock('p', { text: line }))
  }
  return out
}

function blockText(b, n) {
  const t = b.text ?? ''
  switch (b.type) {
    case 'h1':
    case 'h2':
    case 'h3':
      return `${'#'.repeat(Number(b.type[1]))} ${t}`
    case 'bullet':
      return `- ${t}`
    case 'number':
      return `${n}. ${t}`
    case 'todo':
      return `- [${b.checked ? 'x' : ' '}] ${t}`
    case 'quote':
      return t.split('\n').map((l) => `> ${l}`).join('\n')
    case 'callout':
      return t
        .split('\n')
        .map((l, i) => (i === 0 ? `> [!${b.emoji || '💡'}|${b.color || 'yellow'}] ${l}` : `> ${l}`))
        .join('\n')
    case 'divider':
      return '---'
    case 'code':
      return `\`\`\`${b.lang ?? ''}\n${t}\n\`\`\``
    case 'toggle':
      return `<details><summary>${(b.title ?? '').replace(/\n/g, ' ')}</summary>\n\n${t}\n\n</details>`
    case 'table': {
      const rows = b.rows?.length ? b.rows : [['']]
      const esc = (c) => String(c ?? '').replace(/\|/g, '/').replace(/\n/g, ' ')
      const line = (r) => `| ${r.map(esc).join(' | ')} |`
      return [line(rows[0]), `| ${rows[0].map(() => '---').join(' | ')} |`, ...rows.slice(1).map(line)].join('\n')
    }
    case 'image':
      return b.url ? `![${b.alt ?? ''}](${b.url})` : ''
    default:
      return t
  }
}

export function serializeBlocks(blocks) {
  const parts = []
  let n = 0
  blocks.forEach((b, i) => {
    const prev = blocks[i - 1]
    n = b.type === 'number' ? (prev?.type === 'number' ? n + 1 : 1) : 0
    const text = blockText(b, n)
    if (b.type === 'image' && !text) return
    // 같은 종류의 목록은 한 줄씩, 나머지는 빈 줄로 띄웁니다.
    const sep = !parts.length ? '' : LIST_TYPES.has(b.type) && prev?.type === b.type ? '\n' : '\n\n'
    parts.push(sep + text)
  })
  return parts.join('')
}
