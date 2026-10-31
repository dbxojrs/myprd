// 공정과 패키지를 설명하는 단순한 그림(SVG). 실제 장비·제품 사진이 아니라 개념도입니다.
// compact가 true이면 상단 흐름 막대용으로 글자 없이 작게 그립니다.

const Arrow = ({ x1, y1, x2, y2 }) => (
  <g className="il-arrow">
    <line x1={x1} y1={y1} x2={x2} y2={y2} />
    <polygon
      points={(() => {
        const angle = Math.atan2(y2 - y1, x2 - x1)
        const s = 5
        const p1 = [x2 - s * Math.cos(angle - 0.5), y2 - s * Math.sin(angle - 0.5)]
        const p2 = [x2 - s * Math.cos(angle + 0.5), y2 - s * Math.sin(angle + 0.5)]
        return `${x2},${y2} ${p1.join(',')} ${p2.join(',')}`
      })()}
    />
  </g>
)

const Label = ({ x, y, children, compact }) =>
  compact ? null : (
    <text x={x} y={y} className="il-label" textAnchor="middle">
      {children}
    </text>
  )

const processDrawings = {
  'wafer-make': (c) => (
    <>
      <rect x="14" y="24" width="44" height="24" rx="12" className="il-tool" />
      <Arrow x1="64" y1="36" x2="78" y2="36" />
      {[84, 92, 100].map((x) => (
        <rect key={x} x={x} y="22" width="4" height="28" rx="2" className="il-wafer" />
      ))}
      <Label x="36" y="16" compact={c}>잉곳</Label>
      <Label x="60" y="72" compact={c}>잉곳을 얇게 잘라 웨이퍼로</Label>
    </>
  ),
  oxidation: (c) => (
    <>
      <rect x="20" y="40" width="80" height="12" className="il-wafer" />
      <rect x="20" y="35" width="80" height="5" className="il-oxide" />
      {[34, 60, 86].map((x) => (
        <Arrow key={x} x1={x} y1="12" x2={x} y2="30" />
      ))}
      <Label x="60" y="8" compact={c}>O₂ · 고온</Label>
      <Label x="60" y="70" compact={c}>표면에 얇은 산화막이 자람</Label>
    </>
  ),
  photo: (c) => (
    <>
      <rect x="20" y="50" width="80" height="8" className="il-wafer" />
      <rect x="20" y="45" width="80" height="5" className="il-resist" />
      <rect x="20" y="24" width="24" height="4" className="il-tool" />
      <rect x="54" y="24" width="12" height="4" className="il-tool" />
      <rect x="76" y="24" width="24" height="4" className="il-tool" />
      {[49, 71].map((x) => (
        <line key={x} x1={x} y1="6" x2={x} y2="44" className="il-laser" />
      ))}
      <Label x="60" y="20" compact={c}>마스크</Label>
      <Label x="60" y="72" compact={c}>빛으로 회로 무늬를 옮김</Label>
    </>
  ),
  etch: (c) => (
    <>
      <rect x="20" y="46" width="80" height="10" className="il-wafer" />
      {[20, 54, 82].map((x, i) => (
        <rect key={x} x={x} y="36" width={[26, 12, 18][i]} height="10" className="il-oxide" />
      ))}
      {[20, 54, 82].map((x, i) => (
        <rect key={`r${x}`} x={x} y="32" width={[26, 12, 18][i]} height="4" className="il-resist" />
      ))}
      {[50, 74].map((x) => (
        <Arrow key={x} x1={x} y1="12" x2={x} y2="40" />
      ))}
      <Label x="60" y="8" compact={c}>플라즈마</Label>
      <Label x="60" y="72" compact={c}>가려지지 않은 막을 깎아 냄</Label>
    </>
  ),
  deposition: (c) => (
    <>
      <rect x="20" y="46" width="80" height="10" className="il-wafer" />
      <rect x="20" y="40" width="80" height="6" className="il-oxide" />
      <rect x="20" y="35" width="80" height="5" className="il-substrate" />
      {[28, 44, 60, 76, 92].map((x) => (
        <circle key={x} cx={x} cy={x % 32 === 12 ? 18 : 24} r="2" className="il-bump" />
      ))}
      <Label x="60" y="10" compact={c}>기체 원료</Label>
      <Label x="60" y="72" compact={c}>얇은 막을 고르게 쌓음</Label>
    </>
  ),
  'ion-implant': (c) => (
    <>
      <rect x="20" y="40" width="80" height="16" className="il-wafer" />
      <rect x="20" y="34" width="28" height="6" className="il-resist" />
      <rect x="72" y="34" width="28" height="6" className="il-resist" />
      <rect x="48" y="40" width="24" height="6" className="il-substrate" />
      {[54, 66].map((x) => (
        <Arrow key={x} x1={x} y1="10" x2={x} y2="38" />
      ))}
      <Label x="60" y="8" compact={c}>불순물 이온</Label>
      <Label x="60" y="72" compact={c}>정해진 영역에 이온을 넣음</Label>
    </>
  ),
  metallization: (c) => (
    <>
      <rect x="20" y="46" width="80" height="10" className="il-wafer" />
      <rect x="20" y="28" width="80" height="18" className="il-oxide" />
      <rect x="30" y="36" width="60" height="4" className="il-cu" />
      {[34, 60, 86].map((x) => (
        <rect key={x} x={x - 2} y="40" width="4" height="6" className="il-cu" />
      ))}
      <rect x="58" y="28" width="4" height="8" className="il-cu" />
      <rect x="50" y="22" width="20" height="6" className="il-cu" />
      <Label x="60" y="16" compact={c}>패드</Label>
      <Label x="60" y="72" compact={c}>금속 선으로 소자를 연결</Label>
    </>
  ),
  eds: (c) => (
    <>
      <circle cx="60" cy="44" r="18" className="il-wafer" />
      {[
        [52, 36], [62, 36], [48, 46], [58, 46], [68, 46], [54, 54], [64, 54],
      ].map(([x, y], i) => (
        <rect key={i} x={x - 4} y={y - 4} width="8" height="8" className={i === 4 ? 'il-glue' : 'il-die'} />
      ))}
      <line x1="58" y1="8" x2="58" y2="42" className="il-probe" />
      <rect x="44" y="4" width="28" height="6" className="il-tool" />
      <Label x="60" y="76" compact={c}>칩마다 전기 검사 · 불량 표시</Label>
    </>
  ),
  backgrind: (c) => (
    <>
      <rect x="20" y="22" width="80" height="10" className="il-wafer" />
      <rect x="20" y="16" width="80" height="6" className="il-tape" />
      <rect x="30" y="38" width="60" height="12" rx="3" className="il-tool" />
      <Arrow x1="60" y1="62" x2="60" y2="52" />
      <path d="M40 58 a20 6 0 1 0 40 0" className="il-line" />
      <Label x="60" y="12" compact={c}>보호 테이프 + 웨이퍼</Label>
      <Label x="60" y="76" compact={c}>연마 휠이 뒷면을 갈아냄</Label>
    </>
  ),
  'wafer-saw': (c) => (
    <>
      <rect x="15" y="40" width="90" height="10" className="il-wafer" />
      {[30, 45, 60, 75, 90].map((x) => (
        <line key={x} x1={x} y1="40" x2={x} y2="50" className="il-cut" />
      ))}
      <circle cx="60" cy="24" r="14" className="il-tool" />
      <line x1="60" y1="38" x2="60" y2="44" className="il-blade" />
      <Label x="60" y="66" compact={c}>블레이드가 선을 따라 자름</Label>
    </>
  ),
  'die-attach': (c) => (
    <>
      <rect x="20" y="52" width="80" height="8" className="il-frame" />
      <rect x="40" y="46" width="40" height="6" className="il-glue" />
      <rect x="42" y="18" width="36" height="14" rx="1" className="il-die" />
      <Arrow x1="60" y1="34" x2="60" y2="44" />
      <Label x="60" y="12" compact={c}>다이</Label>
      <Label x="60" y="74" compact={c}>접착제 위에 다이를 붙임</Label>
    </>
  ),
  'wire-bond': (c) => (
    <>
      <rect x="40" y="48" width="40" height="8" className="il-frame" />
      <rect x="44" y="36" width="32" height="12" className="il-die" />
      <rect x="10" y="48" width="18" height="8" className="il-frame" />
      <rect x="92" y="48" width="18" height="8" className="il-frame" />
      <path d="M48 36 Q34 14 20 48" className="il-wire" />
      <path d="M72 36 Q86 14 100 48" className="il-wire" />
      <Label x="60" y="72" compact={c}>와이어로 다이와 리드를 연결</Label>
    </>
  ),
  molding: (c) => (
    <>
      <rect x="14" y="20" width="92" height="38" rx="4" className="il-mold" />
      <rect x="44" y="40" width="32" height="10" className="il-die il-ghost" />
      <path d="M48 40 Q34 24 22 52" className="il-wire il-ghost" />
      <path d="M72 40 Q86 24 98 52" className="il-wire il-ghost" />
      <rect x="14" y="52" width="92" height="6" className="il-frame" />
      <Arrow x1="60" y1="6" x2="60" y2="18" />
      <Label x="60" y="72" compact={c}>수지로 다이와 와이어를 감쌈</Label>
    </>
  ),
  marking: (c) => (
    <>
      <rect x="20" y="36" width="80" height="22" rx="3" className="il-mold" />
      <line x1="60" y1="6" x2="60" y2="36" className="il-laser" />
      <rect x="50" y="2" width="20" height="8" className="il-tool" />
      <text x="60" y="51" textAnchor="middle" className="il-mark">
        AX01
      </text>
      <Label x="60" y="72" compact={c}>레이저로 표면에 식별 정보를 새김</Label>
    </>
  ),
  'package-saw': (c) => (
    <>
      {[14, 46, 78].map((x) => (
        <rect key={x} x={x} y="36" width="28" height="18" rx="2" className="il-mold" />
      ))}
      <circle cx="44" cy="22" r="12" className="il-tool" />
      <line x1="44" y1="34" x2="44" y2="56" className="il-blade" />
      <Label x="60" y="72" compact={c}>스트립을 개별 패키지로 자름</Label>
    </>
  ),
  test: (c) => (
    <>
      <rect x="36" y="40" width="48" height="16" rx="2" className="il-mold" />
      {[44, 54, 66, 76].map((x) => (
        <line key={x} x1={x} y1="20" x2={x} y2="40" className="il-probe" />
      ))}
      <rect x="36" y="12" width="48" height="8" className="il-tool" />
      <path d="M92 44 l6 6 l12 -14" className="il-check" />
      <Label x="60" y="72" compact={c}>전기·외관을 검사해 양품 판정</Label>
    </>
  ),
  'flipchip-bond': (c) => (
    <>
      <rect x="20" y="52" width="80" height="8" className="il-substrate" />
      <rect x="40" y="18" width="40" height="12" className="il-die" />
      {[46, 54, 62, 70].map((x) => (
        <circle key={x} cx={x + 2} cy="33" r="3" className="il-bump" />
      ))}
      <Arrow x1="60" y1="38" x2="60" y2="50" />
      <Label x="60" y="12" compact={c}>뒤집은 다이 + 범프</Label>
      <Label x="60" y="74" compact={c}>범프를 기판에 바로 붙임</Label>
    </>
  ),
  underfill: (c) => (
    <>
      <rect x="20" y="52" width="80" height="8" className="il-substrate" />
      <rect x="40" y="38" width="40" height="8" className="il-die" />
      <rect x="40" y="46" width="40" height="6" className="il-glue" />
      {[46, 54, 62, 70].map((x) => (
        <circle key={x} cx={x + 2} cy="49" r="2.5" className="il-bump" />
      ))}
      <path d="M96 20 L88 44" className="il-needle" />
      <Label x="60" y="74" compact={c}>다이와 기판 사이 틈을 수지로 채움</Label>
    </>
  ),
}

const packageDrawings = {
  qfn: () => (
    <>
      <rect x="30" y="20" width="100" height="30" rx="3" className="il-mold" />
      <rect x="62" y="30" width="36" height="10" className="il-die" />
      <rect x="58" y="44" width="44" height="6" className="il-frame" />
      <rect x="30" y="44" width="16" height="6" className="il-frame" />
      <rect x="114" y="44" width="16" height="6" className="il-frame" />
      <text x="80" y="66" textAnchor="middle" className="il-label">바닥에 리드와 노출 패드</text>
    </>
  ),
  bga: () => (
    <>
      <rect x="30" y="22" width="100" height="18" rx="3" className="il-mold" />
      <rect x="62" y="30" width="36" height="8" className="il-die" />
      <rect x="26" y="40" width="108" height="6" className="il-substrate" />
      {[34, 48, 62, 76, 90, 104, 118].map((x) => (
        <circle key={x} cx={x + 4} cy="50" r="4" className="il-bump" />
      ))}
      <text x="80" y="66" textAnchor="middle" className="il-label">기판 아래 솔더볼 배열</text>
    </>
  ),
  flipchip: () => (
    <>
      <rect x="56" y="24" width="48" height="10" className="il-die" />
      <rect x="56" y="34" width="48" height="5" className="il-glue" />
      {[62, 72, 82, 92].map((x) => (
        <circle key={x} cx={x + 3} cy="36.5" r="2.5" className="il-bump" />
      ))}
      <rect x="26" y="39" width="108" height="6" className="il-substrate" />
      {[36, 52, 68, 84, 100, 116].map((x) => (
        <circle key={x} cx={x + 4} cy="49" r="4" className="il-bump" />
      ))}
      <text x="80" y="66" textAnchor="middle" className="il-label">뒤집은 다이 + 언더필 + 기판</text>
    </>
  ),
  wlcsp: () => (
    <>
      <rect x="50" y="24" width="60" height="16" className="il-die" />
      {[56, 70, 84, 98].map((x) => (
        <circle key={x} cx={x + 3} cy="44" r="4" className="il-bump" />
      ))}
      <text x="80" y="66" textAnchor="middle" className="il-label">다이 바로 아래 솔더볼</text>
    </>
  ),
  fanout: () => (
    <>
      <rect x="30" y="20" width="100" height="20" rx="2" className="il-mold" />
      <rect x="62" y="26" width="36" height="12" className="il-die" />
      <rect x="30" y="40" width="100" height="4" className="il-rdl" />
      {[36, 54, 72, 90, 108, 122].map((x) => (
        <circle key={x} cx={x + 2} cy="48" r="4" className="il-bump" />
      ))}
      <text x="80" y="66" textAnchor="middle" className="il-label">재배선층으로 다이 바깥까지 단자</text>
    </>
  ),
}

const Bumps = ({ x, y, width, count, r = 1.6 }) =>
  Array.from({ length: count }, (_, i) => (
    <circle key={i} cx={x + ((i + 0.5) * width) / count} cy={y} r={r} className="il-bump" />
  ))

const advancedDrawings = {
  '2.5d': () => (
    <>
      <rect x="14" y="50" width="132" height="8" className="il-substrate" />
      <rect x="24" y="40" width="112" height="8" className="il-rdl il-interposer" />
      {[44, 64, 84, 104, 124].map((x) => (
        <line key={x} x1={x - 8} y1="40" x2={x - 8} y2="48" className="il-tsv" />
      ))}
      <Bumps x={24} y={49} width={112} count={10} r={1.3} />
      <rect x="30" y="20" width="22" height="18" className="il-die" />
      <rect x="58" y="22" width="44" height="16" className="il-die il-logic" />
      <rect x="108" y="20" width="22" height="18" className="il-die" />
      <Bumps x={30} y={39} width={100} count={14} r={1} />
      <text x="41" y="32" textAnchor="middle" className="il-tag">HBM</text>
      <text x="80" y="33" textAnchor="middle" className="il-tag">GPU</text>
      <text x="119" y="32" textAnchor="middle" className="il-tag">HBM</text>
      <text x="80" y="68" textAnchor="middle" className="il-label">인터포저 위에 칩을 나란히 놓고 촘촘히 연결</text>
    </>
  ),
  '3d': () => (
    <>
      <rect x="40" y="48" width="80" height="8" className="il-die il-logic" />
      {[38, 28, 18, 8].map((y) => (
        <g key={y}>
          <rect x="48" y={y} width="64" height="8" className="il-die" />
          <Bumps x={48} y={y + 9} width={64} count={6} r={1} />
        </g>
      ))}
      {[60, 80, 100].map((x) => (
        <line key={x} x1={x} y1="8" x2={x} y2="56" className="il-tsv" />
      ))}
      <text x="132" y="14" className="il-label">메모리 다이</text>
      <text x="124" y="54" className="il-label">로직 다이</text>
      <text x="80" y="68" textAnchor="middle" className="il-label">칩을 위로 쌓고 TSV(세로 통로)로 연결</text>
    </>
  ),
  hybrid: () => (
    <>
      <rect x="40" y="14" width="80" height="16" className="il-die" />
      <rect x="40" y="32" width="80" height="16" className="il-die il-logic" />
      {[48, 60, 72, 84, 96, 108].map((x) => (
        <g key={x}>
          <rect x={x} y="27" width="6" height="3" className="il-cu" />
          <rect x={x} y="32" width="6" height="3" className="il-cu" />
        </g>
      ))}
      <line x1="34" y1="31" x2="126" y2="31" className="il-line il-dashed" />
      <text x="132" y="34" className="il-label">범프 없음</text>
      <text x="80" y="64" textAnchor="middle" className="il-label">구리 패드끼리 직접 맞붙임</text>
    </>
  ),
  chiplet: () => (
    <>
      <rect x="14" y="48" width="132" height="8" className="il-substrate" />
      {[
        [24, 'CPU'],
        [56, 'CPU'],
        [88, 'I/O'],
        [120, 'AI'],
      ].map(([x, label]) => (
        <g key={x}>
          <rect x={x} y="28" width="24" height="18" className={label === 'I/O' ? 'il-die il-logic' : 'il-die'} />
          <Bumps x={x} y={47} width={24} count={4} r={1} />
          <text x={x + 12} y="40" textAnchor="middle" className="il-tag">{label}</text>
        </g>
      ))}
      {[48, 80, 112].map((x) => (
        <path key={x} d={`M${x} 36 h8`} className="il-link" />
      ))}
      <text x="80" y="68" textAnchor="middle" className="il-label">작은 칩(칩렛) 여러 개를 한 패키지로 묶음</text>
    </>
  ),
  'hd-fanout': () => (
    <>
      <rect x="20" y="16" width="120" height="24" rx="2" className="il-mold" />
      <rect x="34" y="24" width="36" height="14" className="il-die" />
      <rect x="90" y="24" width="36" height="14" className="il-die" />
      <rect x="20" y="40" width="120" height="6" className="il-rdl" />
      {[44, 56, 68, 80, 92, 104, 116].map((x) => (
        <line key={x} x1={x} y1="40.5" x2={x + 6} y2="45.5" className="il-cut" />
      ))}
      <Bumps x={20} y={50} width={120} count={9} r={3} />
      <text x="80" y="68" textAnchor="middle" className="il-label">몰딩 속 칩 아래에 촘촘한 재배선층</text>
    </>
  ),
  bridge: () => (
    <>
      <rect x="14" y="40" width="132" height="16" className="il-substrate" />
      <rect x="62" y="40" width="36" height="6" className="il-rdl il-interposer" />
      <rect x="28" y="20" width="44" height="18" className="il-die" />
      <rect x="88" y="20" width="44" height="18" className="il-die" />
      <Bumps x={28} y={39} width={44} count={6} r={1.2} />
      <Bumps x={88} y={39} width={44} count={6} r={1.2} />
      <text x="80" y="14" textAnchor="middle" className="il-label">실리콘 브리지</text>
      <line x1="80" y1="16" x2="80" y2="40" className="il-line il-dashed" />
      <text x="80" y="68" textAnchor="middle" className="il-label">두 칩이 만나는 곳에만 작은 다리를 넣음</text>
    </>
  ),
}

export function AdvancedIllustration({ id }) {
  const draw = advancedDrawings[id]
  if (!draw) return null
  return (
    <svg viewBox="0 0 160 72" className="il il-package" role="img" aria-label="첨단 패키지 개념도">
      {draw()}
    </svg>
  )
}

export function ProcessIllustration({ id, compact = false }) {
  const draw = processDrawings[id]
  if (!draw) return null
  return (
    <svg
      viewBox={compact ? '0 0 120 66' : '0 0 120 80'}
      className={compact ? 'il il-compact' : 'il'}
      role={compact ? undefined : 'img'}
      aria-hidden={compact ? 'true' : undefined}
      aria-label={compact ? undefined : '공정 개념도'}
    >
      {draw(compact)}
    </svg>
  )
}

export function PackageIllustration({ id }) {
  const draw = packageDrawings[id]
  if (!draw) return null
  return (
    <svg viewBox="0 0 160 72" className="il il-package" role="img" aria-label="패키지 단면 개념도">
      {draw()}
    </svg>
  )
}
