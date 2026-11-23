import { Ball, Tag, anim } from '../kit.jsx'

// 첨단 패키지 1: 왜 필요한가와 대표 구조. 자막은 data/processMovies/adv-overview.js (직접 그린 그림)

// 칩 하나를 키우기 vs 여러 칩을 한 패키지에
const Why = ({ B }) => (
  <g>
    <g style={anim('mv-rise', 0.2, 0.6)}>
      <rect x="30" y="50" width="100" height="70" rx="4" className="m-si" />
      {Array.from({ length: 6 }, (_, r) =>
        Array.from({ length: 8 }, (_, c) => <rect key={`${r}-${c}`} x={36 + c * 11.6} y={56 + r * 10.4} width="8" height="7" rx="1" className="mv-cell-tiny" />),
      )}
      <text x="80" y="136" textAnchor="middle" className="mv-tag strong">
        칩 하나를 더 미세하게?
      </text>
      <text x="80" y="148" textAnchor="middle" className="mv-tag">
        점점 어렵고 비쌈
      </text>
    </g>
    <g style={anim('mv-rise', B(1), 0.7)}>
      <rect x="180" y="104" width="120" height="12" rx="2" className="mv-subst" />
      <rect x="186" y="60" width="50" height="44" rx="2" className="m-si" />
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x="244" y={62 + i * 10.5} width="22" height="9" rx="1" className="mv-hbm" />
      ))}
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x="272" y={62 + i * 10.5} width="22" height="9" rx="1" className="mv-hbm" />
      ))}
      <text x="240" y="136" textAnchor="middle" className="mv-tag strong">
        여러 칩을 한 패키지에 가깝게
      </text>
      <text x="240" y="148" textAnchor="middle" className="mv-tag">
        예: GPU 옆에 HBM
      </text>
    </g>
    <Tag x={160} y={28} anchor="middle" at={0.2} strong>
      패키징이 성능을 만드는 공정으로
    </Tag>
  </g>
)

// 대표 구조 4가지 (작은 단면)
const Kinds = ({ B }) => {
  const box = (x, y, label, at, children) => (
    <g style={anim('mv-rise', at, 0.6)}>
      <rect x={x} y={y} width="140" height="56" rx="8" className="mv-legendbox" />
      {children}
      <text x={x + 70} y={y + 67} textAnchor="middle" className="mv-tag strong">
        {label}
      </text>
    </g>
  )
  return (
    <g>
      {box(14, 8, '2.5D: 인터포저 위에 나란히', 0.2, (
        <g>
          <rect x="28" y="56" width="112" height="6" className="mv-subst" />
          <rect x="34" y="48" width="100" height="8" className="mv-interposer" />
          <rect x="40" y="32" width="40" height="16" className="m-si" />
          <rect x="88" y="32" width="40" height="16" className="mv-hbm" />
        </g>
      ))}
      {box(166, 8, '3D: 위로 쌓아 TSV로', B(1) * 0.5, (
        <g>
          <rect x="180" y="56" width="112" height="6" className="mv-subst" />
          {[0, 1, 2, 3].map((i) => (
            <rect key={i} x="206" y={46 - i * 7} width="60" height="6" className="mv-hbm" />
          ))}
          {[216, 236, 256].map((x) => (
            <rect key={x} x={x} y="25" width="2" height="27" className="m-metal" />
          ))}
        </g>
      ))}
      {box(14, 80, '팬아웃: 칩 바깥까지 배선', B(1), (
        <g>
          <rect x="30" y="90" width="108" height="20" rx="2" className="mv-emc" />
          <rect x="62" y="92" width="44" height="14" className="m-si" />
          <rect x="30" y="110" width="108" height="3" className="m-metal" />
          {[38, 56, 74, 92, 110, 128].map((x) => (
            <Ball key={x} cx={x} cy={117} r={3} tone="silver" />
          ))}
        </g>
      ))}
      {box(166, 80, '칩렛: 나눠 만들고 다시 이음', B(1) + 0.6, (
        <g>
          <rect x="180" y="114" width="112" height="6" className="mv-subst" />
          {[184, 212, 240, 268].map((x) => (
            <rect key={x} x={x} y="94" width="22" height="20" rx="1" className="m-si" />
          ))}
          <rect x="200" y="112" width="80" height="3" className="mv-bridge" />
        </g>
      ))}
    </g>
  )
}

export default {
  id: 'adv-overview',
  scenes: {
    why: { beat: 3.8, draw: (B) => <Why B={B} /> },
    kinds: { beat: 3.8, draw: (B) => <Kinds B={B} /> },
  },
}
