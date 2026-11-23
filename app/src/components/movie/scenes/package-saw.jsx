import { anim, Callout, Rain, Tag, loop } from '../kit.jsx'

// 패키지 쏘잉(싱귤레이션) 애니메이션 그림(직접 그린 그림). 자막은 data/processMovies/package-saw.js

const COLS = 6
const ROWS = 3
const CW = 40
const CH = 32
const X0 = 40
const Y0 = 44

// 위에서 본 스트립: 여러 패키지가 한 판에
const Strip = ({ cutAt = null, splitAt = null }) => (
  <g>
    {Array.from({ length: ROWS }, (_, r) =>
      Array.from({ length: COLS }, (_, c) => (
        <rect
          key={`${r}-${c}`}
          x={X0 + c * CW + 2}
          y={Y0 + r * CH + 2}
          width={CW - 4}
          height={CH - 4}
          rx="2"
          className="mv-emc"
          style={splitAt !== null ? { ...anim('mv-spread2', splitAt, 1.2), '--sx': `${(c - 2.5) * 4}px`, '--sy': `${(r - 1) * 4}px` } : undefined}
        />
      )),
    )}
    {cutAt !== null &&
      Array.from({ length: COLS + 1 }, (_, c) => (
        <g key={`v${c}`} className="mv-box top" style={anim('mv-grow', cutAt + c * 0.35, 0.35)}>
          <rect x={X0 + c * CW - 1} y={Y0 - 6} width="2" height={ROWS * CH + 12} className="mv-cutline" />
        </g>
      ))}
    {cutAt !== null &&
      Array.from({ length: ROWS + 1 }, (_, r) => (
        <g key={`h${r}`} className="mv-box left" style={anim('mv-widenx', cutAt + 2.8 + r * 0.35, 0.35)}>
          <rect x={X0 - 6} y={Y0 + r * CH - 1} width={COLS * CW + 12} height="2" className="mv-cutline" />
        </g>
      ))}
  </g>
)

const StripScene = ({ B }) => (
  <g>
    <rect x={X0 - 10} y={Y0 - 10} width={COLS * CW + 20} height={ROWS * CH + 20} rx="4" className="mv-frame" />
    <Strip />
    <Tag x={160} y={24} anchor="middle" at={0.2} strong>
      한 판(스트립)에 여러 패키지가 함께 몰딩됨
    </Tag>
    <Tag x={160} y={150} anchor="middle" at={B(1)}>
      → 하나씩 잘라 내야 함
    </Tag>
  </g>
)

const Cut = ({ B }) => (
  <g>
    <Strip cutAt={0.6} splitAt={B(2)} />
    <g style={anim('mv-travel2', 0.6, 2.4, { ease: 'linear' })}>
      <g className="mv-box center" style={loop('mv-spin', 0, 0.4)}>
        <circle cx={X0} cy="22" r="14" className="mv-blade" />
      </g>
    </g>
    <Rain x0={X0} x1={X0 + COLS * CW} y0={30} y1={Y0} n={8} at={0.6} dur={0.6} r={1.4} cls="mv-water" until={B(2)} />
    <Tag x={160} y={150} anchor="middle" at={B(1)}>
      자를 길을 따라 한 줄씩
    </Tag>
  </g>
)

// 옆에서 본 QFN 절단면: 구리 리드의 버
const Burr = ({ B }) => (
  <g>
    <rect x="60" y="70" width="200" height="40" className="mv-emc" />
    <rect x="60" y="110" width="60" height="10" className="mv-lead" />
    <rect x="200" y="110" width="60" height="10" className="mv-lead" />
    <path d="M60 120 l-4 6 l4 0 z" className="mv-lead" style={anim('mv-fade', B(1), 0.5)} />
    <Callout x={56} y={124} tx={30} ty={148} text="버(구리가 늘어진 자국)" at={B(1) + 0.2} />
    <Tag x={160} y={94} anchor="middle" at={0} strong>
      QFN 패키지 옆모습
    </Tag>
    <Callout x={230} y={115} tx={270} ty={50} text="구리 리드" at={0.5} anchor="end" />
  </g>
)

export default {
  id: 'package-saw',
  scenes: {
    strip: { beat: 3.6, draw: (B) => <StripScene B={B} /> },
    cut: { beat: 3.8, draw: (B) => <Cut B={B} /> },
    burr: { beat: 3.6, draw: (B) => <Burr B={B} /> },
  },
}
