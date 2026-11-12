import { has, Label } from './parts.jsx'

// 다이 본더 그림: 왼쪽은 테이프에서 다이를 떼는 곳, 오른쪽은 리드프레임에 붙이는 곳과 경화 오븐입니다.
export default function DieBonderView({ values, running, findings }) {
  const dieH = values.die === 1 ? 3 : 7
  const pinUp = [1, 4, 9][values.pin]
  const glueW = [18, 30, 46][values.amount]
  const fillet = [1, 3, 7][values.amount]
  const press = ['0.5px', '1.5px', '3px'][values.force]
  const oven = ['ms-heater-low', 'ms-heater-high', 'ms-heater-mid', 'ms-heater-high'][values.cure]
  const cracked = has(findings, ['깨짐'])
  const voided = has(findings, ['보이드', '빈 공간'])
  const spilled = has(findings, ['넘침'])
  const dieTop = 100 - dieH
  return (
    <svg viewBox="0 0 240 140" className="ms-view" role="img" aria-label="다이 본더 그림">
      {/* 왼쪽: 다이싱 테이프 위 다이와 이젝터 핀 */}
      <rect x="6" y="100" width="92" height="4" className="il-tape" />
      {[10, 58].map((x) => (
        <rect key={x} x={x} y={dieTop} width="30" height={dieH} className="il-die" />
      ))}
      <rect x="40" y={dieTop - pinUp} width="16" height={dieH} className={cracked && values.pin === 2 ? 'il-die ms-db-hot' : 'il-die'} />
      <rect x="46" y={104 - pinUp} width="4" height={pinUp + 12} className="ms-db-pin" />
      <Label x={48} y={128}>이젝터 핀</Label>
      <Label x={52} y={116}>다이싱 테이프</Label>
      {/* 콜릿: 내려와 다이를 빨아들였다 올라갑니다 */}
      <g className={running ? 'ms-bond run' : 'ms-bond'} style={{ '--dur': '1.6s' }}>
        <rect x="41" y={dieTop - pinUp - 34} width="14" height="30" className={values.collet === 1 ? 'il-tool ms-worn' : 'il-tool'} />
        <rect x="44" y={dieTop - pinUp - 6} width="8" height="4" className="il-frame" />
        {values.collet === 0 && <path d={`M48 ${dieTop - pinUp - 8} v-18`} className="ms-db-vacuum" />}
      </g>
      <Label x={20} y={dieTop - pinUp - 20}>콜릿</Label>
      {values.collet === 1 && <Label x={78} y={dieTop - pinUp - 30}>진공 샘</Label>}

      {/* 오른쪽: 리드프레임 패드 위 접착제와 다이 */}
      <rect x="116" y="100" width="118" height="6" className="il-frame" />
      <Label x={175} y={118}>리드프레임 다이 패드</Label>
      {values.adhesive === 0 ? (
        <>
          <rect x={175 - glueW / 2} y="96" width={glueW} height="4" className={spilled ? 'il-glue ms-db-spill' : 'il-glue'} />
          <polygon points={`155,96 155,${96 - fillet} ${155 - fillet - 2},96`} className="il-glue" />
          <polygon points={`195,96 195,${96 - fillet} ${195 + fillet + 2},96`} className="il-glue" />
        </>
      ) : (
        <rect x="155" y="96" width="40" height="3" className="il-daf" />
      )}
      {voided && [164, 182].map((x) => <circle key={x} cx={x} cy="97.6" r="1.6" className="il-void" />)}
      <g className={running ? 'ms-shake run' : 'ms-shake'} style={{ '--amp': press }}>
        <rect x="155" y={96 - dieH} width="40" height={dieH} className="il-die" />
      </g>
      {cracked && <path d={`M168 ${96 - dieH} l3 ${dieH / 2} l-2 ${dieH / 4} l3 ${dieH / 4}`} className="ms-defect-line" />}
      <path d={`M175 ${70 - values.force * 6} v${10 + values.force * 6}`} className="ms-db-force" />
      <polygon points={`171,${80} 179,${80} 175,${85}`} className="ms-db-force-head" />
      <Label x={206} y={74}>하중</Label>
      <Label x={130} y={90}>{values.adhesive === 0 ? '에폭시' : 'DAF'}</Label>

      {/* 경화 오븐 */}
      <rect x="150" y="14" width="80" height="30" rx="3" className={oven} />
      <Label x={190} y={32}>경화 오븐</Label>
    </svg>
  )
}
