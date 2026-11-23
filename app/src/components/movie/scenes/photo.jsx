import { anim, Callout, Heat, Rain, Rays, Slab, Substrate, Tag, W, loop } from '../kit.jsx'

// 포토 공정 애니메이션 그림(직접 그린 단면도). 자막은 data/processMovies/photo.js
// 단면: 실리콘(132~) 위 산화막(120~132), 그 위 감광액(108~120)
const OX = { y: 120, h: 12 }
const PR = { y: 108, h: 12 }
const OPEN = [
  [70, 40],
  [150, 40],
  [230, 40],
] // 마스크의 뚫린 곳 [x, 너비]
const KEEP = [
  [0, 70],
  [110, 40],
  [190, 40],
  [270, 50],
] // 빛을 받지 않는 곳

const Base = () => (
  <>
    <Substrate />
    <Slab {...OX} mat="oxide" />
  </>
)

// 감광액 층. exposedAt: 빛 받은 곳 색이 바뀌는 시각, removeAt: 현상으로 녹아 없어지는 시각
const PrLayer = ({ exposedAt = null, removeAt = null }) => (
  <>
    {KEEP.map(([x, w]) => (
      <Slab key={x} x={x} w={w} {...PR} mat="pr" />
    ))}
    {OPEN.map(([x, w]) => (
      <g key={x}>
        {removeAt === null ? (
          <Slab x={x} w={w} {...PR} mat="pr" />
        ) : (
          <g style={anim('mv-fadeout', removeAt, 0.3)}>
            <rect x={x} y={PR.y} width={w} height={PR.h} className="m-pr" />
          </g>
        )}
        {exposedAt !== null && (
          <Slab x={x} w={w} {...PR} mat="prx" enter="mv-fade" at={exposedAt} dur={1.2} exit={removeAt !== null ? 'mv-erase' : undefined} exitAt={removeAt ?? 0} exitDur={1.6} />
        )}
      </g>
    ))}
  </>
)

// 위쪽 빛 장치와 마스크
const Mask = ({ at = 0 }) => (
  <g style={anim('mv-drop', at, 1)}>
    <rect x="10" y="44" width={W - 20} height="7" rx="1.5" className="m-mask" />
    {OPEN.map(([x, w]) => (
      <rect key={x} x={x} y="44" width={w} height="7" className="mv-soft" />
    ))}
    <text x={W - 14} y="41" textAnchor="end" className="mv-tag">
      마스크(회로 무늬)
    </text>
  </g>
)

const Lamp = ({ at = 0 }) => (
  <g style={anim('mv-fade', at, 0.6)}>
    <ellipse cx="160" cy="10" rx="120" ry="46" fill="url(#mv-flare)" style={loop('mv-pulse', at, 2.4, 'ease-in-out')} />
    <rect x="110" y="4" width="100" height="14" rx="4" className="mv-soft" />
    <text x="160" y="13.5" textAnchor="middle" className="mv-tag">
      빛(노광 장비)
    </text>
  </g>
)

export default {
  id: 'photo',
  scenes: {
    coat: {
      beat: 3.6,
      legend: ['si', 'oxide', 'pr'],
      draw: (B) => (
        <>
          <Base />
          {/* 노즐에서 감광액 한 방울 → 돌리며 고르게 펴짐 */}
          <g style={anim('mv-fade', B(1), 0.4)}>
            <path d="M154 20 h12 v14 l-6 6 l-6 -6z" className="mv-soft" />
            <text x="172" y="28" className="mv-tag">
              노즐
            </text>
          </g>
          <g style={anim('mv-fadeout', B(1) + 1.4, 0.4)}>
            <circle cx="160" cy="60" r="5" className="m-pr" style={anim('mv-drop', B(1) + 0.3, 1)} />
          </g>
          <Slab {...PR} mat="pr" enter="mv-widen" origin="center" at={B(1) + 1.3} dur={1.6} />
          <g style={anim('mv-fade', B(1) + 1.3, 0.5)}>
            <g className="mv-box center" style={loop('mv-spin', B(1) + 1.3, 1.2)}>
              <path d="M150 88 a10 4 0 1 0 20 0" className="mv-line" markerEnd="url(#mv-head)" />
            </g>
            <text x="176" y="92" className="mv-tag">
              빠르게 회전
            </text>
          </g>
          <Callout x={40} y={114} tx={28} ty={92} text="감광액(PR)" at={B(1) + 2.2} />
          <Callout x={40} y={126} tx={70} ty={150} text="산화막" at={0.3} />
          <Heat at={B(2)} y={70} />
          <Tag x={160} y={60} anchor="middle" at={B(2) + 0.3} strong>
            살짝 구워 단단하게
          </Tag>
        </>
      ),
    },
    expose: {
      beat: 3.6,
      legend: ['si', 'oxide', 'pr', 'prx', 'mask'],
      draw: (B) => (
        <>
          <Base />
          <PrLayer exposedAt={B(1) + 0.8} />
          <Lamp at={0.2} />
          <Mask at={0.4} />
          <Rays xs={OPEN.map(([x, w]) => x + w / 2)} w={40} y0={51} y1={PR.y} at={B(1)} />
          <Rays xs={[160]} w={100} y0={18} y1={44} at={B(1)} />
          <Callout x={90} y={113} tx={60} ty={86} text="빛 받은 부분" at={B(2)} anchor="end" />
          <Callout x={130} y={113} tx={140} ty={86} text="가려진 부분" at={B(2) + 0.4} />
        </>
      ),
    },
    develop: {
      beat: 3.6,
      legend: ['si', 'oxide', 'pr', 'prx'],
      draw: (B) => (
        <>
          <Base />
          <PrLayer exposedAt={-1} removeAt={B(1)} />
          <Rain x0={20} x1={300} y0={20} y1={PR.y - 2} n={18} at={0.3} until={B(1) + 1.6} cls="mv-gas" />
          <Tag x={160} y={16} anchor="middle" at={0.3} strong>
            현상액
          </Tag>
          <Callout x={90} y={118} tx={70} ty={84} text="녹아 없어짐" at={B(1) + 1} anchor="end" />
          <Callout x={130} y={112} tx={150} ty={84} text="남은 감광액 = 회로 무늬" at={B(2)} />
        </>
      ),
    },
    result: {
      beat: 3.6,
      legend: ['si', 'oxide', 'pr'],
      draw: (B) => (
        <>
          <Base />
          {KEEP.map(([x, w]) => (
            <Slab key={x} x={x} w={w} {...PR} mat="pr" />
          ))}
          {/* 다음 공정 미리보기: 뚫린 곳의 산화막이 깎임 */}
          {OPEN.map(([x, w]) => (
            <Slab key={x} x={x} w={w} {...OX} mat="oxide" exit="mv-erase" exitAt={B(1)} exitDur={1.6} />
          ))}
          <Tag x={160} y={70} anchor="middle" at={B(1)} strong>
            다음 공정(식각): 뚫린 곳만 깎아 냅니다
          </Tag>
          <Callout x={170} y={114} tx={196} ty={88} text="감광액이 덮개 역할" at={0.4} />
        </>
      ),
    },
  },
}
