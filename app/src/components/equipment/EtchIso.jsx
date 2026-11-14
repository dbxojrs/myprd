import { LotToken } from './isoKit.jsx'
import { CLUSTER_ANCHORS, ClusterTool } from './clusterKit.jsx'

// 플라즈마 건식 식각기(클러스터 툴) 입체 그림. 공정 챔버 위의 코일은 ICP 방식을 나타냅니다
// (MIT 6.152J L17: 유도 코일 + 유전체 창). 배치는 review/equipment-front.md 3.2를 따릅니다.

export const ANCHORS = {
  loadport: CLUSTER_ANCHORS.loadport,
  efem: CLUSTER_ANCHORS.efem,
  loadlock: CLUSTER_ANCHORS.loadlock,
  transfer: CLUSTER_ANCHORS.transfer,
  chamber: CLUSTER_ANCHORS.chamberR,
  gas: CLUSTER_ANCHORS.gas,
  pump: CLUSTER_ANCHORS.pump,
}

const NAMES = { loadport: '로드포트', efem: 'EFEM', loadlock: '로드락', transfer: '진공 이송 챔버', chamber: '식각 챔버', gas: '가스 박스', pump: '배기·스크러버' }

export default function EtchIso({ focus = null, lot = null, step = null, onPick, tags = true }) {
  const etching = step === 'etch' || step === 'epd'
  return (
    <svg viewBox="0 0 400 290" className="eq-iso" role="img" aria-label="건식 식각기 클러스터 툴 입체 그림">
      <g transform="translate(-44,-88) scale(1.25)">
        <ClusterTool
          focus={focus}
          onPick={onPick}
          names={NAMES}
          chambers={{ L: { id: 'chamber', deco: 'coil' }, B: { id: 'chamber', deco: 'coil' }, R: { id: 'chamber', deco: 'coil' } }}
          active={etching ? 'R' : null}
          glowTone={step === 'epd' ? 'eq-fe-glow-etch eq-fe-epd' : 'eq-fe-glow-etch'}
          flow={etching}
          pumping={step === 'loadlock'}
          showPump
          tags={
            tags
              ? [
                  ['loadport', '로드포트', -40, 26, 'end'],
                  ['efem', 'EFEM', -50, 2, 'end'],
                  ['loadlock', '로드락', 30, 52, 'start'],
                  ['transfer', '진공 이송 챔버', -36, -38, 'end'],
                  ['chamberR', '식각 챔버(ICP)', 60, 26, 'start'],
                  ['gas', '가스 박스', 26, -26, 'start'],
                  ['pump', '배기·스크러버', 40, 22, 'start'],
                ]
              : []
          }
        />
        <LotToken at={lot ? ANCHORS[lot] : null} />
      </g>
    </svg>
  )
}
