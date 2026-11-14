import { Box, Cylinder, P, Part, S, Tag } from './isoKit.jsx'

// 클러스터 툴(Cluster Tool) 입체 그림 골격. 식각기·CVD·PVD가 함께 씁니다.
// 배치는 review/equipment-front.md 3.2·4.2·6.2의 작도용 설명을 따릅니다:
// 앞쪽 로드포트 → EFEM(대기압 로봇) → 로드락 2개 → 가운데 진공 이송 챔버 → 둘레에 공정 챔버, 옆에 가스 박스·배기.
// 실제 장비 사진을 따라 그리지 않은, 이 앱이 직접 만든 도식입니다.

export const CLUSTER_ANCHORS = {
  loadport: P(1.6, 7.0, 2.2),
  efem: P(2.6, 5.4, 2.8),
  loadlock: P(2.6, 4.2, 1.9),
  transfer: P(3.0, 2.5, 1.6),
  chamberL: P(0.5, 2.5, 2.4),
  chamberB: P(3.0, 0.2, 2.4),
  chamberR: P(5.6, 2.5, 2.4),
  gas: P(8.3, 1.2, 3.4),
  pump: P(8.3, 4.2, 1.6),
}

// 공정 챔버 하나. deco: 챔버 위 장치 모양('coil' ICP 코일, 'plate' 평행판 전극·RF 박스, 'target' 타깃·마그넷 하우징)
// glow: 플라즈마 켜짐, glowTone: 색(eq-fe-glow-etch/dep/pvd)
function Chamber({ x, y, deco, glow, glowTone, wafers = 1 }) {
  const [cx, cy] = P(x, y, 0.75)
  return (
    <g>
      <Cylinder x={x} y={y} r={0.85} h={1.35} tone="metal" />
      {wafers > 1 &&
        Array.from({ length: wafers }, (_, i) => {
          const a = (i / wafers) * Math.PI * 2
          const [wx, wy] = P(x + Math.cos(a) * 0.42, y + Math.sin(a) * 0.42, 1.36)
          return <ellipse key={i} cx={wx} cy={wy} rx={0.24 * S} ry={0.12 * S} className="eq-fe-station" />
        })}
      {deco === 'coil' && (
        <g>
          <Cylinder x={x} y={y} z={1.35} r={0.55} h={0.25} tone="glass" />
          {[0.1, 0.2].map((dz) => {
            const [kx, ky] = P(x, y, 1.45 + dz)
            return <ellipse key={dz} cx={kx} cy={ky} rx={0.62 * S} ry={0.31 * S} className="eq-fe-coil" />
          })}
        </g>
      )}
      {deco === 'plate' && <Box x={x - 0.35} y={y - 0.35} z={1.35} w={0.7} d={0.7} h={0.45} tone="gas" />}
      {deco === 'target' && <Cylinder x={x} y={y} z={1.35} r={0.7} h={0.5} tone="foup" />}
      {/* 플라즈마: 챔버 몸통 가운데에서 빛나는 띠(위 장치에 가리지 않게 마지막에 그림) */}
      {glow && <ellipse cx={cx} cy={cy} rx={0.95 * S} ry={0.5 * S} className={`eq-fe-glow ${glowTone}`} />}
    </g>
  )
}

// focus: 강조 부위 · step: 조작 순서 단계 · active: 지금 공정 중인 챔버 위치('L'|'B'|'R') · glowTone · deco
// chambers: { L, B, R } 각각 { id, deco, wafers } — 부위 id를 장비마다 다르게 붙입니다.
// flow: 가스 배관 흐름 · pumping: 로드락 감압 표시 · tags: [[anchorKey, text, dx, dy, anchor]]
// showPump: 배기·스크러버 상자를 그릴지(그 장비의 modules에 'pump'가 있을 때만 켭니다)
export function ClusterTool({ focus, onPick, chambers, active = null, glowTone = 'eq-fe-glow-etch', flow = false, pumping = false, tags = [], extra = null, names = {}, showPump = false }) {
  const label = (id) => names[id] ?? id
  return (
    <>
      <polygon points={[P(-0.6, -0.6), P(9.4, -0.6), P(9.4, 7.8), P(-0.6, 7.8)].map((p) => p.join(',')).join(' ')} className="eq-floor" />

      {/* 가스 박스·배기 */}
      <Part id="gas" focus={focus} onPick={onPick} label={label('gas')}>
        <Box x={7.6} y={0.3} w={1.4} d={1.8} h={3.4} tone="gas" />
        <polyline
          points={[P(8.3, 1.2, 3.4), P(8.3, 1.2, 3.9), P(5.6, 2.5, 3.9), P(5.6, 2.5, 2.1)].map((p) => p.join(',')).join(' ')}
          className={`eq-pipe${flow ? ' flow' : ''}`}
        />
      </Part>
      {showPump && (
        <Part id="pump" focus={focus} onPick={onPick} label={label('pump')}>
          <Box x={7.6} y={3.4} w={1.4} d={1.6} h={1.6} tone="metal" />
          <Cylinder x={8.3} y={4.2} z={1.6} r={0.35} h={0.5} tone="metal" />
        </Part>
      )}

      {/* 공정 챔버(뒤·왼쪽) */}
      {chambers.B && (
        <Part id={chambers.B.id} focus={focus} onPick={onPick} label={label(chambers.B.id)}>
          <Chamber x={3.0} y={0.2} deco={chambers.B.deco} wafers={chambers.B.wafers} glow={active === 'B'} glowTone={glowTone} />
        </Part>
      )}
      {chambers.L && (
        <Part id={chambers.L.id} focus={focus} onPick={onPick} label={label(chambers.L.id)}>
          <Chamber x={0.5} y={2.5} deco={chambers.L.deco} wafers={chambers.L.wafers} glow={active === 'L'} glowTone={glowTone} />
        </Part>
      )}

      {/* 진공 이송 챔버 */}
      <Part id="transfer" focus={focus} onPick={onPick} label={label('transfer')}>
        <Box x={1.7} y={1.3} w={2.6} d={2.4} h={1.2} tone="metal" />
        <Cylinder x={3.0} y={2.5} z={1.2} r={0.4} h={0.25} tone="metal" />
      </Part>

      {/* 오른쪽 공정 챔버 */}
      {chambers.R && (
        <Part id={chambers.R.id} focus={focus} onPick={onPick} label={label(chambers.R.id)}>
          <Chamber x={5.6} y={2.5} deco={chambers.R.deco} wafers={chambers.R.wafers} glow={active === 'R'} glowTone={glowTone} />
        </Part>
      )}

      {/* 로드락 2개 */}
      <Part id="loadlock" focus={focus} onPick={onPick} label={label('loadlock')}>
        <Box x={1.7} y={3.8} w={1.1} d={0.9} h={1.3} tone="rack" className={pumping ? 'eq-fe-pumping' : ''} />
        <Box x={3.2} y={3.8} w={1.1} d={0.9} h={1.3} tone="rack" className={pumping ? 'eq-fe-pumping' : ''} />
      </Part>

      {/* EFEM(대기압 로봇 박스) */}
      <Part id="efem" focus={focus} onPick={onPick} label={label('efem')}>
        <Box x={0.6} y={4.8} w={4.6} d={1.4} h={2.2} tone="rack" />
      </Part>

      {/* 로드포트 + FOUP */}
      <Part id="loadport" focus={focus} onPick={onPick} label={label('loadport')}>
        {[0.8, 2.3, 3.8].map((x) => (
          <g key={x}>
            <Box x={x} y={6.3} w={1.1} d={0.8} h={1.0} tone="metal" />
            <Box x={x + 0.1} y={6.3} w={0.9} d={0.8} h={0.8} z={1.0} tone="foup" />
          </g>
        ))}
      </Part>

      {extra}

      <g className="eq-tags">
        {tags.map(([key, text, dx, dy, anchor]) => (
          <Tag key={key} at={CLUSTER_ANCHORS[key]} dx={dx} dy={dy} anchor={anchor}>
            {text}
          </Tag>
        ))}
      </g>
    </>
  )
}
