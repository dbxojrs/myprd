import { anim, Callout, Tag } from '../kit.jsx'

// TSV 애니메이션 그림(직접 그린 단면도). 자막은 data/processMovies/tsv.js

// 와이어로 쌓은 칩 vs TSV로 쌓은 칩
const Stack = ({ B }) => (
  <g>
    {/* 왼쪽: 와이어 적층 */}
    <rect x="16" y="130" width="130" height="10" rx="2" className="mv-subst" />
    {[0, 1, 2, 3].map((i) => (
      <g key={i} style={anim('mv-drop', 0.2 + i * 0.3, 0.6)}>
        <rect x={36 + i * 6} y={116 - i * 14} width={70} height="10" className="m-si" />
        <path d={`M${40 + i * 6} ${116 - i * 14} C${24} ${110 - i * 14} 22 ${124} 22 130`} className="mv-wire" />
      </g>
    ))}
    <Tag x={81} y={152} anchor="middle" at={0}>
      와이어로 쌓기
    </Tag>
    {/* 오른쪽: TSV 적층 */}
    <rect x="174" y="130" width="130" height="10" rx="2" className="mv-subst" />
    {[0, 1, 2, 3].map((i) => (
      <g key={i} style={anim('mv-drop', B(1) + i * 0.3, 0.6)}>
        <rect x="204" y={116 - i * 14} width="70" height="10" className="m-si" />
        {[214, 230, 246, 262].map((x) => (
          <rect key={x} x={x - 1.5} y={116 - i * 14} width="3" height="14" className="m-metal" />
        ))}
      </g>
    ))}
    <Tag x={239} y={152} anchor="middle" at={B(1)}>
      칩을 뚫어 위아래로 연결(TSV)
    </Tag>
    <Tag x={160} y={30} anchor="middle" at={B(2)} strong>
      연결 통로가 훨씬 많고 짧음
    </Tag>
  </g>
)

// 비아 만들기: 구멍 식각 → 절연막 → 배리어 → 구리 채우기 → 평탄화 → 뒷면 갈아 드러내기
const Via = ({ B }) => (
  <g>
    <rect x="40" y="40" width="240" height="100" className="m-si" />
    {[110, 210].map((x) => (
      <g key={x}>
        <g className="mv-box top" style={anim('mv-grow', 0.4, 1.2)}>
          <rect x={x - 10} y="40" width="20" height="70" className="mv-void" />
        </g>
        <g style={anim('mv-fade', B(1) - 0.6, 0.5)}>
          <path d={`M${x - 10} 40 V110 H${x + 10} V40`} className="mv-liner" />
        </g>
        <g className="mv-box" style={anim('mv-grow', B(1) + 0.4, 1.6)}>
          <rect x={x - 8} y="42" width="16" height="70" className="m-metal" />
        </g>
      </g>
    ))}
    {/* 뒷면을 갈아 구리 기둥 끝이 드러남 */}
    <g className="mv-box top" style={anim('mv-erase', B(2), 1.6)}>
      <rect x="40" y="110" width="240" height="30" className="m-si" />
    </g>
    <Callout x={100} y={60} tx={30} ty={20} text="깊은 구멍 식각" at={0.6} />
    <Callout x={200} y={44} tx={300} ty={20} text="절연막·배리어 → 구리 채움" at={B(1)} anchor="end" />
    <Tag x={160} y={152} anchor="middle" at={B(2) + 0.4} strong>
      뒷면을 얇게 갈아 구리 끝을 드러냄
    </Tag>
  </g>
)

export default {
  id: 'tsv',
  scenes: {
    stack: { beat: 3.8, draw: (B) => <Stack B={B} />, legend: ['si', 'metal'] },
    via: { beat: 3.8, draw: (B) => <Via B={B} />, legend: ['si', 'metal'] },
  },
}
