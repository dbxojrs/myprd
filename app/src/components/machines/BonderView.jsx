import { has, Label, stageTools } from './parts.jsx'

// 와이어 본더 그림
// 가동 중에는 단계(stage)마다 장면이 바뀝니다(단계 설명 글은 data/machines/wireBond.js의 sequence.scene):
//   load 리드프레임이 들어오고 히터가 데워짐 → efo 불꽃으로 와이어 끝에 볼 → ball1 패드에 눌러 떨며 붙임
//   → loop 와이어를 풀며 리드 쪽으로 고리 → stitch 리드에 눌러 붙임 → tail 들어 올려 끊음 → repeat 다음 패드로
const ORDER = ['load', 'efo', 'ball1', 'loop', 'stitch', 'tail', 'repeat']

export default function BonderView({ values, running, findings, stage = null }) {
  const s = stageTools(stage, ORDER)
  const cycle = ['0.9s', '1.5s', '2.6s'][values.time]
  const shake = ['0.5px', '1.5px', '3px'][values.power]
  const ballRx = [3, 5, 7.5][values.force]
  const ballRy = [3.5, 3, 2.4][values.force]
  const heater = ['ms-heater-low', 'ms-heater-mid', 'ms-heater-high'][values.temp]
  const crater = has(findings, ['크레이터링', '깨짐'])
  const noStick = has(findings, ['붙지 않음'])
  const padY = values.pad === 2 ? 83 : 82
  const padH = values.pad === 2 ? 1.5 : 3
  const wireClass = values.wire === 1 ? 'ms-wire-cu' : 'il-wire'
  const ballClass = values.wire === 1 ? 'ms-ball-cu' : 'il-ball'

  // 단계별 상태
  const heated = !s.at('start')
  const ballOnTool = s.idle || s.at('efo') || s.at('ball1') || s.at('repeat') || s.at('done') // 캐필러리 끝의 볼
  const bonded = !s.idle && (s.done('ball1') || (s.at('ball1') && !noStick)) // 패드에 붙은 볼
  const loopShown = s.idle ? !noStick : s.at('loop') || (s.done('loop') && !noStick)
  const stitched = !s.idle && s.done('stitch')
  // 캐필러리 위치: 단계마다 정해진 움직임(CSS 키프레임)
  const capClass = s.idle ? (running ? 'ms-bond run' : 'ms-bond') : `ms-st-wb-cap at-${stage}`
  const capShake = s.idle ? running : s.at('ball1') || s.at('stitch')
  const showMarks = s.idle || s.done('ball1')

  return (
    <svg viewBox="0 0 240 140" className="ms-view" role="img" aria-label="와이어 본더 그림">
      <rect x="20" y="100" width="200" height="16" rx="2" className={heated ? `${heater}${s.at('load') ? ' ms-ox-warm' : ''}` : 'ms-heater-low'} />
      <Label x={120} y={130}>{s.at('load') ? '히터 블록 데우는 중 (본딩 온도)' : '히터 블록 (본딩 온도)'}</Label>
      {values.temp === 2 &&
        heated &&
        [60, 120, 180].map((x) => <path key={x} d={`M${x} 98 q3 -4 0 -8 q-3 -4 0 -8`} className="zs-cure-heat" />)}
      <g className={s.at('load') ? 'ms-st-wb-slide' : undefined}>
        <rect x="30" y="94" width="180" height="6" className="il-frame" />
        <rect x="70" y="85" width="60" height="9" className="il-die" />
        <rect x="92" y={padY} width="16" height={padH} className="zs-pad" />
        {values.pad === 1 && [95, 100, 105].map((x) => <circle key={x} cx={x} cy={padY} r="1.2" className="ms-dirt" />)}
        <rect x="160" y="88" width="30" height="6" className="il-frame" />
      </g>
      {crater && showMarks && <path d="M96 86 l3 4 l2 -3 l3 5" className="ms-defect-line" />}
      <Label x={196} y={86}>리드</Label>
      <Label x={80} y={81}>패드 →</Label>
      {/* 패드에 붙은 볼(1차 본드)과 리드에 눌린 자국(스티치) */}
      {bonded && <ellipse cx="100" cy={padY - ballRy} rx={ballRx} ry={ballRy} className={`${ballClass}${s.at('ball1') ? ' ms-st-wb-flat' : ''}`} />}
      {stitched && <path d="M168 88 l8 0" className="ms-st-wb-stitch" />}
      {/* 와이어 루프: 루프 단계에서 그려집니다 */}
      {loopShown && (
        <path d="M100 82 C 104 50, 160 50, 172 88" pathLength="1" className={`${wireClass}${s.at('loop') ? ' ms-st-wb-draw' : ''}`} />
      )}
      {/* 전기 불꽃(EFO): 와이어 끝을 녹여 볼을 만듦 */}
      {s.at('efo') && (
        <g>
          <rect x="62" y="56" width="16" height="5" rx="1" className="il-tool" />
          <path d="M78 59 l6 3 l-3 2 l8 4 l-3 2 l6 3" className="ms-st-wb-spark" />
          <Label x={62} y={52}>전기 불꽃</Label>
        </g>
      )}
      {/* 캐필러리: 단계마다 내려와 누르고, 리드 쪽으로 옮겨 가고, 들어 올립니다 */}
      <g className={capClass} style={{ '--dur': cycle }}>
        <g className={capShake ? 'ms-shake run' : 'ms-shake'} style={{ '--amp': shake }}>
          <path d="M94 20 L106 20 L103 70 L97 70 Z" className={values.tool === 1 ? 'il-tool ms-worn' : 'il-tool'} />
          <line x1="100" y1="10" x2="100" y2="74" className={wireClass} />
          {ballOnTool && !(s.at('ball1') && !noStick) && (
            <ellipse cx="100" cy={74 + ballRy} rx={ballRx} ry={ballRy} className={`${ballClass}${s.at('efo') ? ' ms-st-wb-ball' : ''}`} />
          )}
        </g>
      </g>
      {(s.idle || s.before('loop')) && <Label x={130} y={30}>캐필러리</Label>}
      {s.at('ball1') && <Label x={150} y={64}>하중·초음파·열로 붙이는 중</Label>}
      {s.at('stitch') && <Label x={196} y={74}>스티치</Label>}
      {s.at('tail') && <Label x={196} y={74}>끊고 꼬리 남김</Label>}
      {s.at('repeat') && <Label x={150} y={64}>다음 와이어로</Label>}
      {values.tool === 1 && <Label x={130} y={40}>끝이 닳고 더러움</Label>}
      {values.pad === 1 && <Label x={60} y={70}>패드 오염</Label>}
      {values.pad === 2 && <Label x={60} y={70}>얇은 패드 금속층</Label>}
      <Label x={40} y={20}>{values.wire === 1 ? '구리(Cu) 와이어' : '금(Au) 와이어'}</Label>
    </svg>
  )
}
