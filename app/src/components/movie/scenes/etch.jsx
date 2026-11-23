import { anim, Callout, Rain, Slab, Substrate, Tag, loop, SI_TOP, W } from '../kit.jsx'

// 식각 공정 애니메이션 그림(직접 그린 단면도). 자막은 data/processMovies/etch.js
// 단면: 실리콘(132~) 위 깎을 막(108~132), 그 위 감광액 무늬(96~108)
const FILM = { y: 108, h: 24 }
const PR = { y: 96, h: 12 }
const HOLE = [120, 80] // 가운데 뚫린 곳 [x, 너비]

const Stack = ({ prOut = null }) => (
  <>
    <Substrate />
    <Slab x={0} w={HOLE[0]} {...FILM} mat="oxide" />
    <Slab x={HOLE[0] + HOLE[1]} w={W - HOLE[0] - HOLE[1]} {...FILM} mat="oxide" />
    <Slab x={0} w={HOLE[0]} {...PR} mat="pr" exit={prOut !== null ? 'mv-fadeout' : undefined} exitAt={prOut ?? 0} exitDur={1.2} />
    <Slab x={HOLE[0] + HOLE[1]} w={W - HOLE[0] - HOLE[1]} {...PR} mat="pr" exit={prOut !== null ? 'mv-fadeout' : undefined} exitAt={prOut ?? 0} exitDur={1.2} />
  </>
)

// 뚫린 곳의 막 (깎여 나갈 부분)
const Target = ({ at, dur }) => <Slab x={HOLE[0]} w={HOLE[1]} {...FILM} mat="oxide" exit="mv-erase" exitAt={at} exitDur={dur} origin="top" exitOrigin="bottom" />

export default {
  id: 'etch',
  scenes: {
    intro: {
      beat: 3.6,
      legend: ['si', 'oxide', 'pr'],
      draw: (B) => (
        <>
          <Stack />
          <Slab x={HOLE[0]} w={HOLE[1]} {...FILM} mat="oxide" />
          <Callout x={60} y={102} tx={40} ty={70} text="감광액 무늬(덮개)" at={0.3} />
          <Callout x={160} y={120} tx={200} ty={70} text="덮이지 않은 막 = 없앨 부분" at={0.9} />
          <Tag x={160} y={30} anchor="middle" at={B(1)} strong>
            판화처럼, 덮이지 않은 곳만 깎아 냅니다
          </Tag>
        </>
      ),
    },
    wet: {
      beat: 3.8,
      legend: ['si', 'oxide', 'pr'],
      draw: (B) => (
        <>
          <Stack />
          <Target at={0.8} dur={2.4} />
          {/* 등방성: 감광액 밑으로도 둥글게 파임(언더컷) */}
          <g className="mv-box center" style={anim('mv-grow', B(1), 1.8)}>
            <path d={`M${HOLE[0] - 14} ${FILM.y} Q${HOLE[0] - 14} ${FILM.y + FILM.h} ${HOLE[0]} ${FILM.y + FILM.h} H${HOLE[0] + 2} V${FILM.y} Z`} className="mv-void" />
          </g>
          <g className="mv-box center" style={anim('mv-grow', B(1), 1.8)}>
            <path d={`M${HOLE[0] + HOLE[1] + 14} ${FILM.y} Q${HOLE[0] + HOLE[1] + 14} ${FILM.y + FILM.h} ${HOLE[0] + HOLE[1]} ${FILM.y + FILM.h} H${HOLE[0] + HOLE[1] - 2} V${FILM.y} Z`} className="mv-void" />
          </g>
          <Rain x0={HOLE[0] + 6} x1={HOLE[0] + HOLE[1] - 6} y0={30} y1={FILM.y + 10} n={8} at={0.2} dur={1.4} r={3} cls="mv-water" until={B(2) + 2} />
          <Tag x={160} y={24} anchor="middle" at={0.2} strong>
            습식: 약액
          </Tag>
          <Callout x={HOLE[0] - 8} y={FILM.y + 6} tx={60} ty={70} text="옆으로도 파임(등방성)" at={B(1) + 1} anchor="end" />
          <Tag x={160} y={160} anchor="middle" at={B(2)}>
            빠르지만 미세한 무늬에는 부정확
          </Tag>
        </>
      ),
    },
    dry: {
      beat: 3.8,
      legend: ['si', 'oxide', 'pr'],
      draw: (B) => (
        <>
          <Stack />
          <Target at={B(1) + 0.4} dur={2.6} />
          {/* 진공 챔버 속 플라즈마 */}
          <g style={anim('mv-fade', 0.2, 0.8)}>
            <rect x="20" y="10" width="280" height="54" rx="10" className="mv-plasma" style={loop('mv-pulse', 0.2, 1.8, 'ease-in-out')} />
            <Tag x={160} y={22} anchor="middle" strong>
              진공 챔버 속 플라즈마
            </Tag>
          </g>
          {/* 이온은 곧게 아래로 */}
          <Rain x0={HOLE[0] + 8} x1={HOLE[0] + HOLE[1] - 8} y0={60} y1={FILM.y + 18} n={6} at={B(1)} dur={0.9} r={2} cls="mv-ion" />
          <Rain x0={20} x1={110} y0={60} y1={PR.y - 2} n={4} at={B(1)} dur={0.9} r={2} cls="mv-ion" />
          <Rain x0={210} x1={300} y0={60} y1={PR.y - 2} n={4} at={B(1)} dur={0.9} r={2} cls="mv-ion" />
          <Callout x={HOLE[0] + 2} y={FILM.y + 12} tx={70} ty={84} text="벽이 곧게(이방성)" at={B(1) + 2} anchor="end" />
          <Tag x={160} y={160} anchor="middle" at={B(2)} strong>
            이온 + 라디칼(RIE)
          </Tag>
        </>
      ),
    },
    strip: {
      beat: 3.6,
      legend: ['si', 'oxide', 'pr'],
      draw: (B) => (
        <>
          <Stack prOut={0.6} />
          <Tag x={160} y={60} anchor="middle" at={1.4} strong>
            감광액을 벗기면 막에 무늬가 남습니다
          </Tag>
          {/* 깊고 좁은 구멍(고종횡비) */}
          <g style={anim('mv-fade', B(1), 0.8)}>
            <rect x="244" y="18" width="60" height="100" rx="4" className="mv-soft" />
            {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
              <rect key={i} x="248" y={24 + i * 11} width="52" height="6" className={i % 2 ? 'm-oxide' : 'm-nitride'} />
            ))}
            <g className="mv-box top" style={anim('mv-grow', B(1) + 0.5, 2)}>
              <rect x="270" y="20" width="8" height="96" className="mv-void" />
            </g>
            <Tag x={274} y={128} anchor="middle">
              수많은 층을 뚫는 깊은 구멍
            </Tag>
          </g>
        </>
      ),
    },
  },
}
