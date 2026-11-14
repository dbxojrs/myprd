import { LotToken } from './isoKit.jsx'
import { CLUSTER_ANCHORS, ClusterTool } from './clusterKit.jsx'

// PVD 스퍼터 장비(클러스터 툴) 입체 그림. 챔버 위 원판은 타깃·마그넷 하우징이고(MIT PVD: 음극 = 타깃),
// 왼쪽 챔버는 증착 전에 표면을 걷어 내는 프리클린 챔버입니다. 배치는 review/equipment-front.md 6.2를 따릅니다.

export const ANCHORS = {
  loadport: CLUSTER_ANCHORS.loadport,
  efem: CLUSTER_ANCHORS.efem,
  loadlock: CLUSTER_ANCHORS.loadlock,
  transfer: CLUSTER_ANCHORS.transfer,
  preclean: CLUSTER_ANCHORS.chamberL,
  barrier: CLUSTER_ANCHORS.chamberB,
  sputter: CLUSTER_ANCHORS.chamberR,
  gas: CLUSTER_ANCHORS.gas,
}

const NAMES = { loadport: '로드포트', efem: 'EFEM', loadlock: '로드락', transfer: '진공 이송 챔버', preclean: '프리클린 챔버', barrier: '배리어 챔버', sputter: '스퍼터 챔버', gas: '아르곤 가스 박스', pump: '진공 펌프' }

export default function PvdIso({ focus = null, lot = null, step = null, onPick, tags = true }) {
  const active = step === 'preclean' ? 'L' : step === 'barrier' ? 'B' : step === 'seed' ? 'R' : null
  return (
    <svg viewBox="0 0 400 290" className="eq-iso" role="img" aria-label="PVD 스퍼터 장비 클러스터 툴 입체 그림">
      <g transform="translate(-44,-88) scale(1.25)">
        <ClusterTool
          focus={focus}
          onPick={onPick}
          names={NAMES}
          chambers={{ L: { id: 'preclean', deco: 'plate' }, B: { id: 'barrier', deco: 'target' }, R: { id: 'sputter', deco: 'target' } }}
          active={active}
          glowTone={step === 'preclean' ? 'eq-fe-glow-etch' : 'eq-fe-glow-pvd'}
          flow={active !== null}
          pumping={step === 'loadlock'}
          tags={
            tags
              ? [
                  ['loadport', '로드포트', -40, 26, 'end'],
                  ['efem', 'EFEM', -50, 2, 'end'],
                  ['loadlock', '로드락', 30, 52, 'start'],
                  ['chamberL', '프리클린', -30, -26, 'end'],
                  ['chamberB', '배리어 챔버', 6, -40, 'middle'],
                  ['chamberR', '스퍼터(시드) 챔버', 60, 26, 'start'],
                  ['gas', '아르곤 가스', 26, -26, 'start'],
                ]
              : []
          }
        />
        <LotToken at={lot ? ANCHORS[lot] : null} />
      </g>
    </svg>
  )
}
