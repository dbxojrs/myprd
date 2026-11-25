import { memo } from 'react'

// FAB 공정 시뮬레이션의 웨이퍼 단면(교육용 개념 단면, 실제 치수·비율 아님).
// 모양은 설비 규칙표(data/machines/*.js)의 판정 결과(findings 제목)와 상대 지표(metrics, 0~100)로만 정합니다.
// 같은 조건이면 늘 같은 그림이 나옵니다(무작위 없음).

const has = (result, ...words) => (result?.findings ?? []).some((f) => words.some((w) => f.title.includes(w)))
const lvl = (v, a, b, c) => (v === 0 ? a : v === 1 ? b : c)
const W = 320
const SI_TOP = 128

function Base({ children, label, result }) {
  const bad = (result?.findings ?? []).filter((f) => f.severity === 'bad').length
  const warn = (result?.findings ?? []).filter((f) => f.severity === 'warn').length
  return (
    <svg viewBox={`0 0 ${W} 180`} className="ws-svg" role="img" aria-label={label}>
      <rect x="10" y={SI_TOP} width={W - 20} height="40" className="ws-si" />
      <text x="16" y="164" className="ws-tag">
        실리콘 기판
      </text>
      {children}
      {result?.alarm && (
        <g>
          <rect x="10" y="10" width={W - 20} height="160" className="ws-stop" />
          <text x={W / 2} y="92" textAnchor="middle" className="ws-stop-text">
            ⛔ 장비 정지 — 공정이 진행되지 않음
          </text>
        </g>
      )}
      {!result?.alarm && (bad > 0 || warn > 0) && (
        <g className="ws-badge">
          {bad > 0 && (
            <text x={W - 14} y="20" textAnchor="end" className="ws-bad">
              ✕ 불량 {bad}
            </text>
          )}
          {warn > 0 && (
            <text x={W - 14} y={bad ? 36 : 20} textAnchor="end" className="ws-warn">
              ⚠ 경고 {warn}
            </text>
          )}
        </g>
      )}
    </svg>
  )
}

// 일정한 간격의 점(무작위 아님)
const dotsIn = (x0, x1, y0, y1, n, cls) =>
  Array.from({ length: n }, (_, i) => {
    const fx = ((i * 37) % 97) / 97
    const fy = ((i * 53) % 89) / 89
    return <circle key={`${cls}${i}`} cx={x0 + fx * (x1 - x0)} cy={y0 + fy * (y1 - y0)} r="2.2" className={cls} />
  })

function Oxidation({ values, result }) {
  const m = result.metrics
  const none = has(result, '거의 자라지')
  const h = none ? 2 : 6 + (m.thickness ?? 50) * 0.3
  const dirty = values.clean === 1 || has(result, '오염')
  const porous = has(result, '밀도 낮음')
  const bow = has(result, '휨')
  return (
    <Base result={result} label={`산화 단면: 산화막 두께 지수 ${m.thickness}${dirty ? ', 오염 입자 있음' : ''}${porous ? ', 막 밀도 낮음' : ''}`}>
      <path d={bow ? `M10 ${SI_TOP} Q${W / 2} ${SI_TOP - 8} ${W - 10} ${SI_TOP} L${W - 10} ${SI_TOP - h} Q${W / 2} ${SI_TOP - 8 - h} 10 ${SI_TOP - h} Z` : `M10 ${SI_TOP} L${W - 10} ${SI_TOP} L${W - 10} ${SI_TOP - h} L10 ${SI_TOP - h} Z`} className={`ws-oxide${porous ? ' porous' : ''}`} />
      {dirty && dotsIn(30, W - 30, SI_TOP - h, SI_TOP - 1, 7, 'ws-dirt')}
      <text x={W / 2} y={SI_TOP - h - 8} textAnchor="middle" className="ws-tag">
        산화막 (SiO₂){none ? ' — 거의 안 자람' : ''}
      </text>
    </Base>
  )
}

function Photo({ values, result }) {
  const m = result.metrics
  const ox = 14
  const top = SI_TOP - ox
  const rh = 6 + (m.resist ?? 50) * 0.3
  const eroded = values.develop === 2
  const hRes = eroded ? rh * 0.6 : rh
  const base = 30
  const dw = (100 - (m.accuracy ?? 100)) * 0.22 * (values.dose === 0 ? -1 : 1)
  const w = Math.max(10, base + dw)
  const centers = [90, 160, 230]
  const residue = values.dose === 0 || values.develop === 0
  const collapsed = values.softbake === 0
  const blur = values.spin === 0 || values.softbake === 1
  const edges = [10, ...centers.flatMap((c) => [c - w / 2, c + w / 2]), W - 10]
  const blocks = []
  for (let i = 0; i < edges.length; i += 2) blocks.push([edges[i], edges[i + 1]])
  return (
    <Base result={result} label={`포토 단면: 감광액 두께 지수 ${m.resist}, 무늬 정확도 ${m.accuracy}${residue ? ', 열린 곳에 찌꺼기' : ''}`}>
      <rect x="10" y={top} width={W - 20} height={ox} className="ws-oxide" />
      {blocks.map(([a, b], i) => (
        <path key={i} d={collapsed && i > 0 && i < blocks.length - 1 ? `M${a} ${top} L${b} ${top} L${b - 6} ${top - hRes} L${a + 6} ${top - hRes * 0.7} Z` : `M${a} ${top} L${b} ${top} L${b} ${top - hRes} L${a} ${top - hRes} Z`} className={`ws-resist${blur ? ' blur' : ''}`} />
      ))}
      {residue && centers.map((c) => <rect key={c} x={c - w / 2} y={top - 4} width={w} height="4" className="ws-residue" />)}
      {values.reticle === 1 && <circle cx={centers[1]} cy={top - 3} r="5" className="ws-defect" />}
      <text x={W / 2} y={top - hRes - 8} textAnchor="middle" className="ws-tag">
        감광액 무늬 (열린 폭 {Math.round(w)} / 기준 {base})
      </text>
    </Base>
  )
}

function Etch({ values, result }) {
  const m = result.metrics
  const ox = 26
  const top = SI_TOP - ox
  const mask = values.bias === 2 ? 6 : 12
  const slant = (100 - (m.anisotropy ?? 100)) * 0.16
  const under = has(result, '덜 식각')
  const over = has(result, '과식각') ? 8 : 0
  const damage = has(result, '기판 손상')
  const micro = has(result, '마이크로')
  const wide = values.area === 1
  const opens = wide ? [[70, 26, true], [118, 26, true], [222, 80, false]] : [[90, 28, false], [160, 28, false], [230, 28, false]]
  const bottom = SI_TOP + over
  const leftover = (narrow) => (under ? 10 : micro && narrow ? 8 : 0)
  // 산화막(위에서 연 구멍 모양으로 깎아 냄)을 덩어리로 그립니다.
  const edges = [10]
  for (const [c, w] of opens) edges.push(c - w / 2, c + w / 2)
  edges.push(W - 10)
  return (
    <Base result={result} label={`식각 단면: 수직성 ${m.anisotropy}, 선택비 ${m.selectivity}${over ? ', 과식각' : ''}${under ? ', 덜 식각' : ''}${micro ? ', 좁은 무늬에 막 남음' : ''}`}>
      {Array.from({ length: edges.length / 2 }, (_, i) => {
        const a = edges[i * 2]
        const b = edges[i * 2 + 1]
        const l = i === 0 ? a : a + slant
        const r = i === edges.length / 2 - 1 ? b : b - slant
        return (
          <g key={i}>
            <path d={`M${i === 0 ? a : a} ${SI_TOP} L${i === edges.length / 2 - 1 ? b : b} ${SI_TOP} L${r} ${top} L${l} ${top} Z`} className="ws-oxide" />
            <rect x={i === 0 ? a : a + slant * 0.6} y={top - mask} width={Math.max(2, b - a - (i === 0 || i === edges.length / 2 - 1 ? slant * 0.6 : slant * 1.2))} height={mask} className="ws-resist" />
          </g>
        )
      })}
      {opens.map(([c, w, narrow]) => (
        <g key={c}>
          {leftover(narrow) > 0 && <rect x={c - w / 2} y={SI_TOP - leftover(narrow)} width={w} height={leftover(narrow)} className="ws-residue" />}
          {over > 0 && <rect x={c - w / 2 + 2} y={SI_TOP} width={w - 4} height={over} className="ws-gouge" />}
          {damage && <path d={`M${c - w / 2 + 3} ${bottom + 2} l4 4 l4 -4 l4 4 l4 -4 l4 4`} className="ws-damage" />}
        </g>
      ))}
      <text x={W / 2} y={top - mask - 8} textAnchor="middle" className="ws-tag">
        산화막 식각 {slant > 4 ? '(벽 기울어짐)' : '(수직)'}
        {wide ? ' · 넓게 열린 영역 포함' : ''}
      </text>
    </Base>
  )
}

function Deposition({ values, result }) {
  const m = result.metrics
  const t = has(result, '목표 두께 미달', '목표보다 얇음') ? 4 : has(result, '목표보다 두꺼움') ? 14 : 9
  const cov = (m.coverage ?? 80) / 100
  const nonuni = (100 - (m.uniformity ?? 100)) * 0.08
  const trench = values.pattern === 1
  const parts = Math.round((m.particle ?? 0) / 20)
  const poor = has(result, '단차 피복')
  const ft = (x) => t + nonuni * (1 - Math.abs(x - W / 2) / (W / 2)) // 가운데가 두꺼운 불균일
  const trenches = trench ? [[110, 34], [210, 34]] : []
  const depth = 40
  return (
    <Base result={result} label={`증착 단면: 두께 균일도 ${m.uniformity}, 단차 피복 ${m.coverage}, 파티클 위험 ${m.particle}${poor ? ', 홈 안쪽이 덜 덮임' : ''}`}>
      {trenches.map(([c, w]) => (
        <rect key={c} x={c - w / 2} y={SI_TOP} width={w} height={depth} className="ws-hole" />
      ))}
      <path
        d={(() => {
          let d = `M10 ${SI_TOP} `
          const pts = []
          for (let x = 10; x <= W - 10; x += 10) pts.push(x)
          d += pts.map((x) => `L${x} ${SI_TOP - ft(x)}`).join(' ')
          d += ` L${W - 10} ${SI_TOP} Z`
          return d
        })()}
        className="ws-film"
      />
      {trenches.map(([c, w]) => {
        const sw = Math.max(1, t * cov * (poor ? 0.4 : 1))
        return (
          <g key={c}>
            <rect x={c - w / 2} y={SI_TOP} width={sw} height={depth} className="ws-film" />
            <rect x={c + w / 2 - sw} y={SI_TOP} width={sw} height={depth} className="ws-film" />
            <rect x={c - w / 2} y={SI_TOP + depth - sw} width={w} height={sw} className="ws-film" />
            {cov < 0.55 && (
              <>
                <circle cx={c - w / 2 + 2} cy={SI_TOP - 2} r={t * 0.6} className="ws-film" />
                <circle cx={c + w / 2 - 2} cy={SI_TOP - 2} r={t * 0.6} className="ws-film" />
              </>
            )}
          </g>
        )
      })}
      {parts > 0 && dotsIn(30, W - 30, SI_TOP - t - 12, SI_TOP - t - 2, parts, 'ws-dirt')}
      <text x={W / 2} y={SI_TOP - t - nonuni - 16} textAnchor="middle" className="ws-tag">
        증착막{trench ? ' (홈이 있는 표면)' : ''}
        {nonuni > 2 ? ' · 두께 불균일' : ''}
      </text>
    </Base>
  )
}

function Implant({ values, result }) {
  const m = result.metrics
  const thin = values.mask === 1
  const mh = thin ? 8 : 22
  const open = [120, 200]
  const d = 6 + (m.depth ?? 50) * 0.32
  const dmg = (m.damage ?? 0) * 0.08
  const sparse = values.dose === 0
  const channel = has(result, '채널링')
  const shadow = has(result, '그림자')
  const through = has(result, '뚫고')
  const x0 = open[0] + (shadow ? 14 : 0)
  return (
    <Base result={result} label={`이온 주입 단면: 주입 깊이 지수 ${m.depth}, 결정 손상 ${m.damage}${through ? ', 이온이 마스크를 뚫고 들어감' : ''}${channel ? ', 채널링으로 깊이 들어감' : ''}`}>
      <path d={`M${x0} ${SI_TOP} Q${(x0 + open[1]) / 2} ${SI_TOP + d * 2} ${open[1]} ${SI_TOP} Z`} className={`ws-doped${sparse ? ' sparse' : ''}`} />
      {channel && <path d={`M${(x0 + open[1]) / 2 - 6} ${SI_TOP + d} L${(x0 + open[1]) / 2} ${SI_TOP + d + 14} L${(x0 + open[1]) / 2 + 6} ${SI_TOP + d}`} className="ws-doped tail" />}
      {dmg > 1 && <rect x={x0} y={SI_TOP} width={open[1] - x0} height={Math.min(10, dmg)} className="ws-amorph" />}
      {through && (
        <>
          <path d={`M30 ${SI_TOP} Q70 ${SI_TOP + 14} 110 ${SI_TOP} Z`} className="ws-doped stray" />
          <path d={`M210 ${SI_TOP} Q250 ${SI_TOP + 14} 290 ${SI_TOP} Z`} className="ws-doped stray" />
        </>
      )}
      <rect x="10" y={SI_TOP - mh} width={open[0] - 10} height={mh} className="ws-resist" />
      <rect x={open[1]} y={SI_TOP - mh} width={W - 10 - open[1]} height={mh} className="ws-resist" />
      {[0, 1, 2, 3, 4].map((k) => (
        <path key={k} d={`M${130 + k * 15} 30 L${130 + k * 15 + (values.tilt === 2 ? 10 : values.tilt === 1 ? 4 : 0)} ${SI_TOP - 6}`} className="ws-beam" markerEnd="url(#ws-arrow)" />
      ))}
      <defs>
        <marker id="ws-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto">
          <path d="M0 0 L10 5 L0 10 Z" className="ws-beam-head" />
        </marker>
      </defs>
      <text x="16" y={SI_TOP - mh - 6} className="ws-tag">
        마스크(감광막){thin ? ' — 얇음' : ''}
      </text>
      <text x={(x0 + open[1]) / 2} y={SI_TOP + Math.min(34, d * 2 + 12)} textAnchor="middle" className="ws-tag light">
        주입 영역
      </text>
    </Base>
  )
}

function Metal({ values, result }) {
  const m = result.metrics
  const ox = 30
  const top = SI_TOP - ox
  const tm = lvl(values.time, 4, 8, 14)
  const via = values.pattern === 1
  const vw = via ? 28 : 54
  const vc = W / 2
  const cov = (m.coverage ?? 90) / 100
  const noBottom = has(result, '바닥이 덮이지')
  const thinWall = via ? Math.max(1, tm * cov * 0.6) : tm
  const contact = values.surface === 1 || has(result, '접촉 저항')
  const porous = has(result, '성기')
  return (
    <Base result={result} label={`금속 배선 단면: 비아 덮임 ${m.coverage}, 배선 저항 지수 ${m.resistance}${noBottom ? ', 비아 바닥이 덮이지 않음' : ''}${contact ? ', 접촉 저항 증가' : ''}`}>
      <rect x="10" y={top} width={vc - vw / 2 - 10} height={ox} className="ws-oxide" />
      <rect x={vc + vw / 2} y={top} width={W - 10 - vc - vw / 2} height={ox} className="ws-oxide" />
      <rect x="10" y={top - tm} width={W - 20} height={tm} className={`ws-metal${porous ? ' porous' : ''}`} />
      <rect x={vc - vw / 2} y={top} width={thinWall} height={ox} className="ws-metal" />
      <rect x={vc + vw / 2 - thinWall} y={top} width={thinWall} height={ox} className="ws-metal" />
      {!noBottom && <rect x={vc - vw / 2} y={SI_TOP - Math.max(2, tm * cov * 0.7)} width={vw} height={Math.max(2, tm * cov * 0.7)} className="ws-metal" />}
      {noBottom && <rect x={vc - vw / 2 + thinWall} y={SI_TOP - 3} width={vw - thinWall * 2} height="3" className="ws-gap" />}
      {contact && <line x1={vc - vw / 2} y1={SI_TOP} x2={vc + vw / 2} y2={SI_TOP} className="ws-contact" />}
      <text x={W / 2} y={top - tm - 8} textAnchor="middle" className="ws-tag">
        금속막{via ? ' + 깊은 비아' : ' + 접촉 구멍'}
        {contact ? ' · 접촉면 오염' : ''}
      </text>
    </Base>
  )
}

const BY_ID = { oxidation: Oxidation, photo: Photo, etch: Etch, deposition: Deposition, 'ion-implant': Implant, metallization: Metal }

export const WaferSection = memo(function WaferSection({ machineId, values, result }) {
  const Comp = BY_ID[machineId]
  if (!Comp || !result) return null
  return <Comp values={values} result={result} />
})

export const SECTION_IDS = Object.keys(BY_ID)
