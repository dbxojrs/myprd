import { has, Label } from './parts.jsx'

// CVD 증착 장비 그림. 위 샤워헤드에서 원료 가스가 내려오고(PECVD는 플라즈마가 켜짐), 데워진 웨이퍼 위에 막이 쌓입니다.
// 압력이 높으면 깊은 홈 안쪽 막이 얇아지고, 다른 막이 쌓인 벽은 주황 점선으로 보입니다.
export default function CvdView({ values, running, findings }) {
  const pecvd = values.method === 1
  const gasLines = [0, 2, 3, 5][values.gas]
  const film = [2, 4, 7][values.time]
  const heater = ['ms-heater-low', 'ms-heater-mid', 'ms-heater-high'][values.temp]
  const trench = values.pattern === 1
  const poorCoverage = values.pressure === 2
  const bad = {
    uneven: has(findings, ['불균일']),
    coverage: has(findings, ['덜 덮임']),
    thin: has(findings, ['얇음', '미달']),
    particle: has(findings, ['입자', '파티클', '오염']),
  }
  const top = 96 - film
  const filmClass = bad.thin || bad.uneven ? 'ms-cvd-film bad' : 'ms-cvd-film'
  // 홈 두 개: x 95~115, 135~155, 깊이 14
  const trenches = trench ? [95, 135] : []

  return (
    <svg viewBox="0 0 240 140" className="ms-view" role="img" aria-label="CVD 증착 장비 그림">
      <rect x="30" y="14" width="180" height="106" rx="6" className={values.chamber === 1 ? 'ms-cvd-wall dirty' : 'ms-cvd-wall'} />
      <Label x={120} y={11}>{pecvd ? 'PECVD 챔버' : 'LPCVD 챔버 (고온벽)'}</Label>
      {/* 샤워헤드와 가스 */}
      <rect x="60" y="22" width="120" height="8" rx="2" className="il-tool" />
      <Label x={196} y={28} anchor="start">가스</Label>
      {Array.from({ length: gasLines }, (_, i) => {
        const x = 70 + i * (100 / Math.max(gasLines - 1, 1))
        return <line key={i} x1={x} y1={31} x2={x} y2={56} className={running ? 'il-water ms-flow run' : 'il-water ms-flow'} />
      })}
      {values.gas === 0 && <Label x={120} y={46}>가스 없음</Label>}
      {/* 플라즈마 */}
      {pecvd && values.rf > 0 && (
        <ellipse cx="120" cy="64" rx="70" ry={values.rf === 2 ? 12 : 8} className={running ? 'ms-cvd-glow run' : 'ms-cvd-glow'} style={{ '--dur': values.rf === 2 ? '0.4s' : '0.8s' }} />
      )}
      {pecvd && values.rf > 0 && <Label x={120} y={66}>플라즈마</Label>}
      {/* 웨이퍼와 막 */}
      <rect x="50" y="96" width="140" height="10" className="il-wafer" />
      {trenches.map((x) => (
        <rect key={x} x={x} y={96} width="20" height="10" className="ms-cvd-hole" />
      ))}
      <rect x="50" y={top} width="140" height={film} className={filmClass} />
      {trenches.map((x) => (
        <g key={x}>
          <rect x={x} y={96} width="20" height="10" className="ms-cvd-hole" />
          {/* 홈 벽과 바닥의 막: 압력이 높으면 얇음 */}
          <rect x={x} y={106 - (poorCoverage ? 1 : film)} width="20" height={poorCoverage ? 1 : film} className={filmClass} />
          <rect x={x} y={96} width={poorCoverage ? 1 : film * 0.8} height="10" className={filmClass} />
          <rect x={x + 20 - (poorCoverage ? 1 : film * 0.8)} y={96} width={poorCoverage ? 1 : film * 0.8} height="10" className={filmClass} />
          {bad.coverage && <circle cx={x + 10} cy={103} r="7" className="il-warn-ring" />}
        </g>
      ))}
      {bad.uneven && <path d={`M50 ${top} q 17 -4 35 0 t 35 0 t 35 0 t 35 0`} className="ms-defect-line" />}
      {bad.particle && [70, 112, 160].map((x) => <circle key={x} cx={x} cy={top - 2} r="1.6" className="ms-dirt" />)}
      <rect x="45" y="106" width="150" height="8" rx="2" className={heater} />
      <Label x={120} y={130}>히터 · 기판 온도</Label>
      <Label x={40} y={88} anchor="start">{['막 얇음', '막 보통', '막 두꺼움'][values.time]}</Label>
      <Label x={200} y={88} anchor="end">압력 {['낮음', '저압', '대기압'][values.pressure]}</Label>
      {values.chamber === 1 && <Label x={120} y={82}>벽에 다른 막이 쌓임</Label>}
    </svg>
  )
}
