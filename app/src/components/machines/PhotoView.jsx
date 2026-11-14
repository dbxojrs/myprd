import { has, Label, stageTools } from './parts.jsx'
import { HeatWaves } from './frontStage.jsx'

// 노광 장비 + 트랙 그림. 왼쪽은 감광액을 바르는 회전 도포기, 오른쪽은 마스크·렌즈로 빛을 줄여 비추는 노광기입니다.
// 왼쪽 아래 작은 단면은 현상 뒤 감광액 무늬입니다.
// 가동 중에는 단계(stage)마다 장면이 바뀝니다(단계 설명 글은 data/machines/photo.js의 sequence.scene):
//   coat 감광액을 떨어뜨리고 돌려 펴기 → bake 핫플레이트로 굽기 → align 마스크를 제자리로 맞추기
//   → expose 빛을 비추며 웨이퍼를 옮김 → develop 현상액으로 빛 받은 부분을 녹임 → inspect 무늬 검사
const ORDER = ['coat', 'bake', 'align', 'expose', 'develop', 'inspect']

export default function PhotoView({ values, running, findings, stage = null }) {
  const s = stageTools(stage, ORDER)
  const spin = ['1.6s', '0.8s', '0.35s'][values.spin]
  const resist = [7, 4.5, 2.5][values.spin]
  const light = ['ms-ph-light dim', 'ms-ph-light', 'ms-ph-light bright'][values.dose]
  const blurred = values.focus === 1
  const showResult = s.done('develop')
  const residue = showResult && has(findings, ['덜 열림', '찌꺼기'])
  const narrow = showResult && has(findings, ['선폭', '깎임'])
  const collapsed = showResult && has(findings, ['무너짐'])
  const repeat = showResult && has(findings, ['같은 자리'])
  const lineW = narrow ? 4 : 7

  // 단계별 상태
  const coating = s.at('coat')
  const coated = s.idle || !s.before('coat') // 트랙 웨이퍼에 감광액이 있음
  const onTrack = s.idle || s.before('align') // 웨이퍼가 트랙에 있음
  const onStage = s.idle || !s.before('align') // 웨이퍼가 노광기 스테이지에 있음
  const spinning = running && (s.idle || coating)
  const baking = s.at('bake')
  const aligning = s.at('align')
  const maskClass = s.idle || s.done('align') ? '' : aligning ? 'ms-st-fe-maskin' : 'ms-st-fe-maskoff'
  const exposing = s.at('expose')
  const beamOn = s.idle || exposing
  const developing = s.at('develop')
  const developed = s.done('develop') || s.idle
  const inspecting = s.at('inspect')

  return (
    <svg viewBox="0 0 240 140" className="ms-view" role="img" aria-label="노광 장비와 트랙 그림">
      {/* 트랙: 회전 도포 */}
      <Label x={45} y={14}>트랙 · 감광액 {baking ? '굽기' : '도포'}</Label>
      <path d="M14 70 Q45 96 76 70" className="ms-ph-cup" />
      <rect x="42" y="18" width="6" height="14" className="il-tool" />
      {values.pr === 0 && (s.idle || coating) && <circle cx="45" cy="38" r="1.8" className={coating ? 'ms-ph-drop ms-st-fe-drop' : 'ms-ph-drop'} />}
      {values.pr === 1 && <Label x={45} y={44}>감광액 바닥남</Label>}
      {baking && <rect x="20" y="70" width="50" height="4" rx="1" className={['ms-heater-low', 'ms-heater-mid', 'ms-heater-mid', 'ms-heater-high'][values.softbake]} />}
      {baking && values.softbake > 0 && <HeatWaves xs={[30, 45, 60]} y={56} />}
      {onTrack && (
        <g transform="translate(45 64)">
          <g className={spinning ? 'ms-spin run' : 'ms-spin'} style={{ '--dur': spin }}>
            <ellipse rx="26" ry="8" className="il-wafer" />
            {coated && <ellipse rx="26" ry="8" className={`ms-ph-resist${coating ? ' ms-st-fe-fade' : ''}`} style={{ strokeWidth: resist / 3 }} />}
            <line x1="0" y1="0" x2="24" y2="0" className="zs-spoke" />
          </g>
        </g>
      )}
      {!onTrack && <Label x={45} y={66}>웨이퍼 → 노광기</Label>}
      <Label x={45} y={92}>회전 {['느림(두껍게)', '적정', '빠름(얇게)'][values.spin]}</Label>
      <Label x={45} y={103}>베이크 {['안 함', '짧게', '적정', '과다'][values.softbake]}</Label>

      {/* 노광기: 광원 → 마스크 → 렌즈 → 웨이퍼 */}
      <Label x={168} y={10}>노광기</Label>
      <circle cx="168" cy="20" r="6" className={beamOn ? light : 'ms-ph-light dim'} />
      <g className={maskClass}>
        <rect x="138" y="32" width="60" height="5" className="il-oxide" />
        {[144, 156, 168, 180, 190].map((x) => (
          <rect key={x} x={x} y="32" width="5" height="5" className="il-frame" />
        ))}
        {values.reticle === 1 && [151, 175].map((x) => <circle key={x} cx={x} cy="30" r="1.8" className="ms-dirt" />)}
      </g>
      <Label x={218} y={37}>{aligning ? '맞추는 중' : '마스크'}</Label>
      <path d="M146 46 H190 L182 56 H154 Z" className="il-tool" />
      <Label x={216} y={54}>렌즈</Label>
      {/* 빛: 초점이 맞으면 웨이퍼 면에서 모이고, 어긋나면 위에서 모였다 퍼집니다 */}
      {beamOn && (
        <g className={exposing ? 'ms-st-fe-fade' : ''}>
          <polygon points={blurred ? '156,56 180,56 172,80 164,80' : '156,56 180,56 171,96 165,96'} className={light} />
          {blurred && <polygon points="164,80 172,80 178,96 158,96" className={light} />}
        </g>
      )}
      {blurred && <Label x={208} y={80}>초점 어긋남</Label>}
      <g className={running && (s.idle || exposing) ? 'ms-table run' : 'ms-table'} style={{ '--dur': exposing ? 'calc(var(--step) / 2)' : '3s' }}>
        {onStage && <rect x="130" y={96 - resist} width="76" height={resist} className="ms-ph-resist-fill" />}
        <rect x="130" y="96" width="76" height="6" className={onStage ? 'il-wafer' : 'il-wafer ms-st-fe-ghost'} />
        <rect x="126" y="102" width="84" height="6" className="il-tool" />
      </g>
      {aligning && [140, 196].map((x) => <path key={x} d={`M${x - 4} 86 h8 M${x} 82 v8`} className="ms-st-fe-cross" />)}
      <Label x={168} y={118}>노광량 {['부족', '적정', '과다'][values.dose]} · 현상 {['짧음', '적정', '김'][values.develop]}</Label>

      {/* 현상 뒤 무늬 단면: 현상 전에는 감광액 막 그대로, 현상 중에 빛 받은 부분이 녹아 나감 */}
      <rect x="20" y="124" width="56" height="5" className="il-wafer" />
      {coated && !developed && (
        <rect x="20" y="115" width="56" height="9" className={`ms-ph-resist-fill${developing ? ' ms-st-fe-dissolve' : ''}`} />
      )}
      {(developing || developed) &&
        [24, 38, 52, 66].map((x) => (
          <rect
            key={x}
            x={x + (7 - lineW) / 2}
            y={collapsed ? 120 : 115}
            width={collapsed ? lineW + 3 : lineW}
            height={collapsed ? 4 : 9}
            className="ms-ph-resist-fill"
          />
        ))}
      {developing && [30, 45, 60].map((x, i) => <circle key={x} cx={x} cy="108" r="1.3" className="ms-ph-dev ms-st-fe-drop" style={{ animationDelay: `${i * -0.2}s` }} />)}
      {residue && [31, 45, 59].map((x) => <rect key={x} x={x} y="120" width="7" height="4" className="ms-ph-residue" />)}
      {repeat && <path d="M40 112 l6 6 m0 -6 l-6 6" className="ms-defect-line" />}
      {inspecting && <rect x="17" y="110" width="62" height="21" rx="2" className="ms-st-fe-scan" />}
      <Label x={48} y={138}>{developing ? '현상 중' : inspecting ? '무늬 검사 중' : '현상 뒤 무늬'}</Label>
    </svg>
  )
}
