import { anim, Callout, Tag, loop } from '../kit.jsx'

// EDS(웨이퍼 테스트) 애니메이션 그림(직접 그린 그림). 자막은 data/processMovies/eds.js

// 위에서 본 웨이퍼: 원 안의 칩 격자. bad: 불량 칩 위치
const DIES = []
for (let r = 0; r < 9; r++)
  for (let c = 0; c < 9; c++) {
    const x = 104 + c * 12.5
    const y = 34 + r * 12.5
    if ((x + 5 - 160) ** 2 + (y + 5 - 90) ** 2 < 52 ** 2) DIES.push({ x, y, k: `${r}-${c}` })
  }
const BAD = new Set(['1-4', '3-1', '4-6', '6-3', '7-5', '2-7'])

const Wafer = ({ mapAt = null, scanAt = null }) => (
  <g>
    <circle cx="160" cy="90" r="62" className="mv-waferdisc" />
    <path d="M154 151 q6 -6 12 0" className="mv-notch" />
    {DIES.map((d, i) => {
      const bad = BAD.has(d.k)
      return (
        <g key={d.k}>
          <rect x={d.x} y={d.y} width="11" height="11" rx="1" className="mv-die" />
          {mapAt !== null && (
            <rect x={d.x} y={d.y} width="11" height="11" rx="1" className={bad ? 'mv-die-bad' : 'mv-die-good'} style={anim('mv-fade', mapAt + i * 0.03, 0.3)} />
          )}
          {scanAt !== null && <rect x={d.x} y={d.y} width="11" height="11" rx="1" className="mv-die-scan" style={anim('mv-blink1', scanAt + i * 0.03, 0.4)} />}
        </g>
      )
    })}
  </g>
)

// 옆에서 본 프로브 카드와 웨이퍼
const Probe = ({ B }) => (
  <g>
    <rect x="40" y="140" width="240" height="10" rx="2" className="m-si" />
    {[60, 100, 140, 180, 220, 260].map((x) => (
      <rect key={x} x={x - 8} y="136" width="16" height="4" className="m-metal" />
    ))}
    <g style={loop('mv-press', 0.4, 2.2, 'ease-in-out')}>
      <rect x="30" y="60" width="260" height="26" rx="4" className="mv-card" />
      <Tag x={160} y={77} anchor="middle" strong>
        프로브 카드
      </Tag>
      {[60, 100, 140, 180, 220, 260].map((x) => (
        <path key={x} d={`M${x - 10} 86 L${x} 128`} className="mv-needle" />
      ))}
      <rect x="110" y="20" width="100" height="30" rx="4" className="mv-soft" />
      <Tag x={160} y={39} anchor="middle">
        테스터
      </Tag>
      <path d="M160 50 V60" className="mv-line" />
    </g>
    <Callout x={100} y={136} tx={40} ty={120} text="패드" at={0.6} />
    <g style={anim('mv-fade', B(1), 0.6)}>
      <rect x="236" y="104" width="10" height="30" rx="5" className="mv-soft" />
      <rect x="239" y="114" width="4" height="18" rx="2" className="mv-temp" style={loop('mv-pulse', B(1), 1.4)} />
      <Tag x={252} y={118}>
        고온·저온
      </Tag>
    </g>
    <Tag x={314} y={14} anchor="end" at={B(2)} strong>
      번인: 온도·전압으로
    </Tag>
    <Tag x={314} y={26} anchor="end" at={B(2)} strong>
      약한 칩을 미리 드러냄
    </Tag>
  </g>
)

// 메모리 셀 격자: 불량 셀이 예비 셀로 바뀜
const Repair = ({ B }) => (
  <g>
    {Array.from({ length: 6 }, (_, r) =>
      Array.from({ length: 10 }, (_, c) => {
        const bad = r === 2 && c === 6
        return (
          <g key={`${r}-${c}`}>
            <rect x={70 + c * 16} y={30 + r * 16} width="13" height="13" rx="2" className="mv-cell" />
            {bad && <rect x={70 + c * 16} y={30 + r * 16} width="13" height="13" rx="2" className="mv-die-bad" style={anim('mv-fadeout', B(1), 0.6)} />}
          </g>
        )
      }),
    )}
    {Array.from({ length: 10 }, (_, c) => (
      <rect key={c} x={70 + c * 16} y={30 + 6 * 16 + 6} width="13" height="13" rx="2" className="mv-spare" />
    ))}
    <Tag x={40} y={136} anchor="middle">
      예비 셀
    </Tag>
    <Callout x={172} y={68} tx={250} ty={24} text="불량 셀" at={0.5} />
    <g style={anim('mv-fade', B(1), 0.5)}>
      <path d="M182 74 C230 90 230 120 182 138" className="mv-arrow" markerEnd="url(#mv-head)" />
      <Tag x={234} y={110}>
        예비 셀로 바꿔 살림
      </Tag>
    </g>
  </g>
)

export default {
  id: 'eds',
  scenes: {
    where: {
      beat: 3.6,
      draw: (B) => (
        <>
          <Wafer />
          <Tag x={160} y={18} anchor="middle" at={0.2} strong>
            FAB을 마친 웨이퍼: 칩 하나하나를 검사
          </Tag>
          <g style={anim('mv-fade', B(1), 0.6)}>
            {['① 웨이퍼 테스트(EDS)', '② 패키지 테스트', '③ 출하 전 품질 테스트'].map((t, i) => (
              <text key={t} x="236" y={70 + i * 16} className={`mv-tag${i === 0 ? ' strong' : ''}`}>
                {t}
              </text>
            ))}
          </g>
        </>
      ),
    },
    probe: { beat: 3.8, draw: (B) => <Probe B={B} /> },
    repair: { beat: 3.8, draw: (B) => <Repair B={B} /> },
    sort: {
      beat: 3.6,
      draw: (B) => (
        <>
          <Wafer scanAt={0} mapAt={1.2} />
          <g style={anim('mv-fade', B(1), 0.5)}>
            <rect x="236" y="60" width="76" height="44" rx="6" className="mv-legendbox" />
            <rect x="242" y="68" width="9" height="9" rx="1" className="mv-die-good" />
            <text x="256" y="76" className="mv-tag">
              양품
            </text>
            <rect x="242" y="84" width="9" height="9" rx="1" className="mv-die-bad" />
            <text x="256" y="92" className="mv-tag">
              불량 → 조립 안 함
            </text>
          </g>
          <Tag x={40} y={90} anchor="middle" at={B(2)} strong>
            수율 =
          </Tag>
          <Tag x={40} y={104} anchor="middle" at={B(2)}>
            양품 칩 ÷ 전체 칩
          </Tag>
        </>
      ),
    },
  },
}
