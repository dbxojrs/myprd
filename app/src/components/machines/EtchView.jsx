import { has, Label } from './parts.jsx'

// 건식 식각기 그림. 왼쪽은 챔버(가스·플라즈마·이온·웨이퍼), 오른쪽은 식각된 홈의 단면 모양입니다.
export default function EtchView({ values, running, findings }) {
  const icp = values.reactor === 1
  // 플라즈마 밀도: 가스와 압력이 많을수록, ICP일수록 짙게(그림용)
  const density = Math.min(0.85, 0.15 + values.gas * 0.15 + values.pressure * 0.12 + (icp ? 0.2 : 0))
  const ionLen = [10, 18, 26][values.bias]
  const scatter = [0, 2, 9][values.pressure]
  const undercut = has(findings, ['언더컷', '비스듬'])
  const damage = has(findings, ['손상'])
  const under = has(findings, ['덜 식각'])
  const over = has(findings, ['과식각'])
  const loading = has(findings, ['로딩'])
  // 감광액 윗면(y 74)부터의 깊이. 막 아래면은 y 92(깊이 18)입니다.
  const depth = under ? 10 : over ? 30 : 19
  // 홈 단면 경로: 수직(이방성) 또는 옆으로 파인 모양(등방성)
  const slope = values.pressure === 2 ? 7 : values.bias === 0 ? 4 : 0
  const top = 74
  const trench = (x, w, d) =>
    slope
      ? `M${x} ${top} Q${x - slope} ${top + d / 2} ${x + 1} ${top + d} H${x + w - 1} Q${x + w + slope} ${top + d / 2} ${x + w} ${top}`
      : `M${x} ${top} V${top + d} H${x + w} V${top}`
  return (
    <svg viewBox="0 0 240 140" className="ms-view" role="img" aria-label="건식 식각기 그림">
      {/* 챔버 */}
      <rect x="14" y="14" width="140" height="112" rx="6" className="ms-et-chamber" />
      {values.chamber === 1 &&
        [[18, 40], [18, 70], [18, 100], [150, 50], [150, 84], [60, 18], [110, 18]].map(([x, y]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r="1.6" className="ms-dirt" />
        ))}
      {icp ? (
        <>
          <rect x="40" y="10" width="88" height="5" className="il-oxide" />
          {[50, 66, 82, 98, 114].map((x) => (
            <circle key={x} cx={x} cy="6" r="3" className="ms-et-coil" />
          ))}
          <Label x={150} y={8}>ICP 코일</Label>
        </>
      ) : (
        <>
          <rect x="40" y="20" width="88" height="5" className="il-frame" />
          <Label x={150} y={8}>위 전극</Label>
        </>
      )}
      {/* 가스 */}
      {Array.from({ length: values.gas + 1 }, (_, i) => (
        <line key={i} x1={54 + i * 30} y1="26" x2={54 + i * 30} y2="38" className={running ? 'il-water ms-flow run' : 'il-water'} />
      ))}
      {/* 플라즈마 */}
      <ellipse cx="84" cy="56" rx="56" ry="16" className="ms-et-plasma" style={{ opacity: running ? density : density * 0.5 }} />
      <Label x={84} y={58}>플라즈마</Label>
      {/* 이온: 바이어스가 크면 길고 세게, 압력이 높으면 비스듬히 흩어짐 */}
      <g className={running ? 'ms-shake run' : 'ms-shake'} style={{ '--amp': `${0.4 + scatter / 6}px` }}>
        {[50, 66, 84, 102, 118].map((x, i) => (
          <line
            key={x}
            x1={x}
            y1={74}
            x2={x + (i % 2 ? scatter : -scatter)}
            y2={74 + ionLen}
            className="ms-et-ion"
          />
        ))}
      </g>
      <Label x={136} y={84}>이온</Label>
      {/* 웨이퍼와 척 */}
      <rect x="36" y="104" width="96" height="5" className="il-wafer" />
      <rect x="30" y="109" width="108" height="10" className="il-tool" />
      <Label x={84} y={124}>정전척 · 압력 {['낮음', '중간', '높음'][values.pressure]}</Label>

      {/* 홈 단면 */}
      <Label x={198} y={22}>식각 단면</Label>
      <rect x="164" y="92" width="70" height="40" className="il-wafer" />
      <rect x="164" y="80" width="70" height="12" className="il-oxide" />
      <rect x="164" y="74" width="70" height="6" className="ms-ph-resist-fill" />
      {/* 넓게 열린 홈 */}
      <path d={trench(170, 22, depth)} className="ms-et-trench" />
      {/* 좁은 홈: 마이크로 로딩이면 덜 깎임 */}
      <path d={trench(206, 10, loading ? depth * 0.5 : depth)} className="ms-et-trench" />
      {undercut && <path d={trench(170, 22, depth)} className="ms-et-trench-bad" />}
      {damage && <path d={`M170 ${top + depth + 2} l4 3 l4 -3 l4 3 l4 -3 l4 3`} className="ms-defect-line" />}
      {over && <rect x="168" y="92" width="26" height={top + depth - 92} className="ms-et-over" />}
      <Label x={181} y={68}>넓은 무늬</Label>
      <Label x={213} y={68}>좁은 무늬</Label>
      <Label x={199} y={138}>{under ? '막이 남음' : over ? '아래 막까지 깎임' : '막 · 감광액'}</Label>
    </svg>
  )
}
