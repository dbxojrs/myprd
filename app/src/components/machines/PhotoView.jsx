import { has, Label } from './parts.jsx'

// 노광 장비 + 트랙 그림. 왼쪽은 감광액을 바르는 회전 도포기, 오른쪽은 마스크·렌즈로 빛을 줄여 비추는 노광기입니다.
// 오른쪽 아래 작은 단면은 현상 뒤 감광액 무늬입니다.
export default function PhotoView({ values, running, findings }) {
  const spin = ['1.6s', '0.8s', '0.35s'][values.spin]
  const resist = [7, 4.5, 2.5][values.spin]
  const light = ['ms-ph-light dim', 'ms-ph-light', 'ms-ph-light bright'][values.dose]
  const blurred = values.focus === 1
  const residue = has(findings, ['덜 열림', '찌꺼기'])
  const narrow = has(findings, ['선폭', '깎임'])
  const collapsed = has(findings, ['무너짐'])
  const repeat = has(findings, ['같은 자리'])
  // 현상 뒤 무늬: 열린 곳(gap)과 남은 선(line)의 너비
  const lineW = narrow ? 4 : 7
  return (
    <svg viewBox="0 0 240 140" className="ms-view" role="img" aria-label="노광 장비와 트랙 그림">
      {/* 트랙: 회전 도포 */}
      <Label x={45} y={14}>트랙 · 감광액 도포</Label>
      <path d="M14 70 Q45 96 76 70" className="ms-ph-cup" />
      <rect x="42" y="18" width="6" height="14" className="il-tool" />
      {values.pr === 0 && <circle cx="45" cy="38" r="1.8" className="ms-ph-drop" />}
      {values.pr === 1 && <Label x={45} y={44}>감광액 바닥남</Label>}
      <g transform="translate(45 64)">
        <g className={running ? 'ms-spin run' : 'ms-spin'} style={{ '--dur': spin }}>
          <ellipse rx="26" ry="8" className="il-wafer" />
          <ellipse rx="26" ry="8" className="ms-ph-resist" style={{ strokeWidth: resist / 3 }} />
          <line x1="0" y1="0" x2="24" y2="0" className="zs-spoke" />
        </g>
      </g>
      <Label x={45} y={92}>회전 {['느림(두껍게)', '적정', '빠름(얇게)'][values.spin]}</Label>
      <Label x={45} y={103}>베이크 {['안 함', '짧게', '적정', '과다'][values.softbake]}</Label>

      {/* 노광기: 광원 → 마스크 → 렌즈 → 웨이퍼 */}
      <Label x={168} y={10}>노광기</Label>
      <circle cx="168" cy="20" r="6" className={light} />
      <rect x="138" y="32" width="60" height="5" className="il-oxide" />
      {[144, 156, 168, 180, 190].map((x) => (
        <rect key={x} x={x} y="32" width="5" height="5" className="il-frame" />
      ))}
      {values.reticle === 1 && [151, 175].map((x) => <circle key={x} cx={x} cy="30" r="1.8" className="ms-dirt" />)}
      <Label x={218} y={37}>마스크</Label>
      <path d="M146 46 H190 L182 56 H154 Z" className="il-tool" />
      <Label x={216} y={54}>렌즈</Label>
      {/* 빛: 초점이 맞으면 웨이퍼 면에서 모이고, 어긋나면 위에서 모였다 퍼집니다 */}
      <polygon points={blurred ? '156,56 180,56 172,80 164,80' : '156,56 180,56 171,96 165,96'} className={light} />
      {blurred && <polygon points="164,80 172,80 178,96 158,96" className={light} />}
      {blurred && <Label x={208} y={80}>초점 어긋남</Label>}
      <g className={running ? 'ms-table run' : 'ms-table'} style={{ '--dur': '3s' }}>
        <rect x="130" y={96 - resist} width="76" height={resist} className="ms-ph-resist-fill" />
        <rect x="130" y="96" width="76" height="6" className="il-wafer" />
        <rect x="126" y="102" width="84" height="6" className="il-tool" />
      </g>
      <Label x={168} y={118}>노광량 {['부족', '적정', '과다'][values.dose]} · 현상 {['짧음', '적정', '김'][values.develop]}</Label>

      {/* 현상 뒤 무늬 단면 */}
      <rect x="20" y="124" width="56" height="5" className="il-wafer" />
      {[24, 38, 52, 66].map((x) => (
        <rect
          key={x}
          x={x + (7 - lineW) / 2}
          y={collapsed ? 120 : 115}
          width={collapsed ? lineW + 3 : lineW}
          height={collapsed ? 4 : 9}
          className="ms-ph-resist-fill"
        />
      ))}
      {residue && [31, 45, 59].map((x) => <rect key={x} x={x} y="120" width="7" height="4" className="ms-ph-residue" />)}
      {repeat && <path d="M40 112 l6 6 m0 -6 l-6 6" className="ms-defect-line" />}
      <Label x={48} y={138}>현상 뒤 무늬</Label>
    </svg>
  )
}
