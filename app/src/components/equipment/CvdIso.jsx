import { LotToken } from './isoKit.jsx'
import { CLUSTER_ANCHORS, ClusterTool } from './clusterKit.jsx'

// CVD 증착 장비(매엽 클러스터) 입체 그림. 오른쪽·왼쪽은 평행판 전극·RF 박스가 달린 PECVD 챔버,
// 뒤쪽은 한 모듈 안에 스테이션 4개가 있어 웨이퍼가 순차 이동하며 나눠 증착하는 멀티 스테이션 모듈(Lam VECTOR QSM)입니다.
// 배치는 review/equipment-front.md 4.2를 따릅니다.

export const ANCHORS = {
  loadport: CLUSTER_ANCHORS.loadport,
  efem: CLUSTER_ANCHORS.efem,
  loadlock: CLUSTER_ANCHORS.loadlock,
  transfer: CLUSTER_ANCHORS.transfer,
  chamber: CLUSTER_ANCHORS.chamberR,
  qsm: CLUSTER_ANCHORS.chamberB,
  gas: CLUSTER_ANCHORS.gas,
}

const NAMES = { loadport: '로드포트', efem: 'EFEM', loadlock: '로드락', transfer: '진공 이송 챔버', chamber: 'PECVD 챔버', qsm: '멀티 스테이션 모듈', gas: '가스 캐비닛', pump: '배기' }

export default function CvdIso({ focus = null, lot = null, step = null, onPick, tags = true }) {
  const active = step === 'deposit' ? 'R' : step === 'station' ? 'B' : null
  return (
    <svg viewBox="0 0 400 290" className="eq-iso" role="img" aria-label="CVD 증착 장비 클러스터 툴 입체 그림">
      <g transform="translate(-44,-88) scale(1.25)">
        <ClusterTool
          focus={focus}
          onPick={onPick}
          names={NAMES}
          chambers={{ L: { id: 'chamber', deco: 'plate' }, B: { id: 'qsm', deco: null, wafers: 4 }, R: { id: 'chamber', deco: 'plate' } }}
          active={active}
          glowTone={step === 'station' ? 'eq-fe-glow-dep eq-fe-spin' : 'eq-fe-glow-dep'}
          flow={step === 'deposit' || step === 'station'}
          pumping={step === 'transfer'}
          tags={
            tags
              ? [
                  ['loadport', '로드포트', -40, 26, 'end'],
                  ['efem', 'EFEM', -50, 2, 'end'],
                  ['loadlock', '로드락', 30, 52, 'start'],
                  ['transfer', '진공 이송 챔버', -36, -38, 'end'],
                  ['chamberB', '멀티 스테이션 모듈', -30, -30, 'end'],
                  ['chamberR', 'PECVD 챔버', 60, 26, 'start'],
                  ['gas', '가스 캐비닛', 26, -26, 'start'],
                ]
              : []
          }
          extra={step === 'heat' ? <circle cx={ANCHORS.chamber[0]} cy={ANCHORS.chamber[1] + 6} r="10" className="eq-fe-heat" /> : null}
        />
        <LotToken at={lot ? ANCHORS[lot] : null} />
      </g>
    </svg>
  )
}
