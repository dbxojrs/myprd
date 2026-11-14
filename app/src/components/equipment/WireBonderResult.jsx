import { has } from '../machines/parts.jsx'

// 와이어 본더 결과물: 지금 조건으로 이은 와이어 하나를 옆에서 확대해 보여줍니다.
// 왼쪽 칩 패드 위 1st 본드(볼) → 루프 → 오른쪽 리드 위 2nd 본드(스티치).
// 누르는 힘에 따라 볼이 납작해지고, 크레이터링·목 가늘어짐·볼 넘침·패드 깨짐은 판정 결과(findings)로 표시합니다.
// 알람이면 그 알람이 뜻하는 모습(볼이 안 붙음, 와이어가 안 끊김, 테일 없음)을 그립니다. 크기는 그림용 상대값입니다.

export default function WireBonderResult({ values, result }) {
  const findings = result?.findings ?? []
  const alarm = result?.grade === 'alarm' ? result.alarm?.title ?? findings[0]?.title ?? '' : ''
  const noStick = alarm.includes('붙지 않음')
  const noCut = alarm.includes('끊기지 않음')
  const noTail = alarm.includes('꼬리')
  const crater = has(findings, ['크레이터링'])
  const padCrack = has(findings, ['패드가 깨짐'])
  const neck = has(findings, ['목이 가늘어짐'])
  const overflow = has(findings, ['패드보다 커짐'])
  const cu = values.wire === 1
  // 볼 본드가 핵심이라 크게 확대해서 그립니다.
  const ballRx = [16, 23, 32][values.force]
  const ballRy = [18, 14, 9][values.force]
  const padY = 150
  const padH = values.pad === 2 ? 4 : 9
  const ballCx = 110
  const ballCy = padY - ballRy + 1 - (noStick ? 14 : 0)
  const leadY = 196
  const stitchX = 300
  const loop = `M${ballCx} ${ballCy - ballRy + 2} C ${ballCx} 62, ${stitchX - 90} 66, ${stitchX - 4} ${leadY - 4}`

  return (
    <svg viewBox="0 0 400 240" className="eq-result" role="img" aria-label="와이어 본딩 결과물 확대 그림">
      <text x="200" y="18" textAnchor="middle" className="eq-result-title">
        옆에서 본 와이어 하나 (1st 볼 → 루프 → 2nd 스티치)
      </text>
      <rect x="20" y="26" width="360" height="208" rx="6" className="eq-zoombox" />
      {/* 칩(다이)과 패드 */}
      <rect x="30" y={padY} width="160" height="70" className="eq-si" />
      <rect x={ballCx - 34} y={padY - padH} width="68" height={padH} className={`eq-ba-pad${values.pad === 1 ? ' dirty' : ''}`} />
      <text x="70" y={padY + 40} textAnchor="middle" className="eq-si-label">
        칩
      </text>
      {/* 리드 */}
      <rect x="240" y={leadY} width="130" height="14" className="eq-ba-leadframe" />
      <text x="330" y={leadY + 30} textAnchor="middle" className="eq-dim">
        리드
      </text>

      {/* 와이어 루프 */}
      {!noStick && <path d={loop} className={`eq-ba-loopwire grow${cu ? ' cu' : ''}`} key={`${values.force}-${values.wire}`} />}
      {noStick && <line x1={ballCx} y1={ballCy - ballRy} x2={ballCx} y2="36" className={`eq-ba-loopwire${cu ? ' cu' : ''}`} />}
      {/* 1st 본드 볼 */}
      <ellipse cx={ballCx} cy={ballCy} rx={ballRx} ry={ballRy} className={`eq-ba-ball${cu ? ' cu' : ''} pop`} />
      {neck && <circle cx={ballCx} cy={ballCy - ballRy - 2} r="6" className="eq-bad-ring" />}
      {overflow && <ellipse cx={ballCx} cy={ballCy} rx={ballRx + 4} ry={ballRy + 4} className="eq-bad-ring" />}
      {(crater || padCrack) && (
        <polyline points={`${ballCx - 14},${padY + 2} ${ballCx - 6},${padY + 16} ${ballCx + 2},${padY + 6} ${ballCx + 12},${padY + 20}`} className="eq-ba-crack" />
      )}
      {/* 2nd 본드 스티치 */}
      {!noStick && <path d={`M${stitchX - 10} ${leadY} Q${stitchX} ${leadY - 7} ${stitchX + 14} ${leadY} Z`} className={`eq-ba-ball${cu ? ' cu' : ''}`} />}
      {noCut && <polyline points={`${stitchX + 14},${leadY - 2} ${stitchX + 40},${leadY - 30} ${stitchX + 48},36`} className={`eq-ba-loopwire${cu ? ' cu' : ''}`} />}
      {!noStick && !noCut && !noTail && alarm === '' && <line x1={stitchX + 6} y1={leadY - 4} x2={stitchX + 6} y2={leadY - 20} className={`eq-ba-tail${cu ? ' cu' : ''}`} />}

      <text x="200" y="44" textAnchor="middle" className={`eq-dim strong${findings.length ? ' bad' : ''}`}>
        {noStick
          ? '볼이 패드에 붙지 않음'
          : noCut
            ? '2nd 본드 뒤 와이어가 끊기지 않음'
            : noTail
              ? '테일이 남지 않아 다음 볼을 만들 수 없음'
              : [
                  `${cu ? '구리(Cu)' : '금(Au)'} 와이어 · 볼 ${['둥긂', '적당히 눌림', '납작함'][values.force]}`,
                  crater ? '패드 아래 손상' : '',
                  padCrack ? '얇은 패드 깨짐' : '',
                  neck ? '볼 위 목 가늘어짐' : '',
                  overflow ? '볼이 패드보다 큼' : '',
                ]
                  .filter(Boolean)
                  .join(' · ')}
      </text>
    </svg>
  )
}
