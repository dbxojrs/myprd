import { Appear, Callout, Keys, Note, Path, Vanish } from './kit.jsx'
import { Arrow } from '../Illustrations.jsx'

// 다이 어태치 확대 스토리의 장면 그림. 설명 문장은 data/zoomStories/dieAttach.js에 있습니다.
// 장면 1(장비) → 2(다이 떼어내기) → 3(올려 누르기) → 4(다이 가장자리) → 5(경화)

// ── 장면 1: 옆에서 본 장비. 왼쪽은 다이싱 테이프 위 다이, 오른쪽은 리드프레임 ──
const DIES = Array.from({ length: 7 }, (_, k) => 15 + k * 10)
const PICK = 45 // 집어 갈 다이의 왼쪽 x (가운데 49)
const PAD1 = 131
const PAD2 = 165

const machine = {
  dur: 12,
  focus: [43, 75.4, 32, 19.2],
  focusAt: 10.8,
  draw: () => (
    <>
      <rect x="10" y="88" width="76" height="4" className="il-tape" />
      {DIES.filter((x) => x !== PICK).map((x) => (
        <rect key={x} x={x} y="82" width="8" height="6" className="il-die" />
      ))}
      <Callout at={0.6} from={[30, 90]} to={[6, 108]}>다이싱 테이프 위의 다이</Callout>

      <rect x="110" y="90" width="86" height="4" className="il-frame" />
      {[PAD1, PAD2].map((x) => (
        <rect key={x} x={x - 9} y="89" width="18" height="1.5" className="il-frame" />
      ))}
      <Callout at={0.6} from={[150, 94]} to={[150, 108]} anchor="middle">리드프레임 (다이 패드)</Callout>

      {/* 디스펜서 바늘이 패드마다 접착제를 찍습니다 */}
      <Appear at={1.2}>
        <ellipse cx={PAD1} cy="88.5" rx="3" ry="1.6" className="il-glue">
          <Keys attr="rx" keys={[[9.2, 3], [10, 8.5]]} />
        </ellipse>
      </Appear>
      <Appear at={2.8}>
        <ellipse cx={PAD2} cy="88.5" rx="3" ry="1.6" className="il-glue" />
      </Appear>
      <g transform="translate(0 -30)">
        <Path keys={[[0.4, '0 -30'], [1.2, '0 0'], [1.8, '0 -30'], [2.3, '34 -30'], [2.8, '34 0'], [3.4, '34 -30'], [4, '34 -90']]} />
        <Keys attr="opacity" keys={[[3.4, 1], [4, 0]]} />
        <rect x={PAD1 - 4} y="56" width="8" height="22" rx="1.5" className="il-tool" />
        <line x1={PAD1} y1="78" x2={PAD1} y2="87" className="il-probe" />
        <Note x={PAD1} y={53}>디스펜서</Note>
      </g>
      <Callout at={1.6} from={[PAD1 + 2, 88]} to={[150, 76]}>접착제(에폭시)</Callout>

      {/* 이젝터 핀이 아래에서 밀어 올리고, 콜릿이 집어 옮깁니다 */}
      <Appear at={4}>
        <rect x={PICK + 3} y="93" width="2" height="10" className="il-tool">
          <Keys attr="y" keys={[[4.4, 93], [4.9, 90], [6.4, 90], [6.9, 93]]} />
        </rect>
      </Appear>
      <g transform="translate(0 0)">
        <Path keys={[[4.9, '0 0'], [5.6, '0 -1'], [6.4, '0 -50'], [7.4, '82 -50'], [8, '82 -50'], [9.2, '82 0.5']]} />
        <rect x={PICK} y="82" width="8" height="6" className="il-die" />
      </g>
      <g transform="translate(0 -50)">
        <Path keys={[[4, '0 -50'], [4.8, '0 -1'], [5.6, '0 -1'], [6.4, '0 -50'], [7.4, '82 -50'], [8, '82 -50'], [9.2, '82 0.5'], [10.2, '82 0.5'], [11, '82 -50']]} />
        <rect x={PICK + 1} y="66" width="6" height="16" className="il-tool" />
        <line x1={PICK + 4} y1="68" x2={PICK + 4} y2="81" className="il-water" />
        <Note at={4} x={PICK + 4} y={63}>콜릿 (진공 집게)</Note>
      </g>

      <Appear at={9.2}>
        <Vanish at={11}>
          <Note x={PAD1} y={70}>↓ 내려놓고 누름</Note>
        </Vanish>
      </Appear>
    </>
  ),
}

// ── 장면 2: 다이 떼어내기. 아래에서 핀이 밀고, 위에서 콜릿이 빨아들입니다. ──
const TAPE_FLAT = 'M 0 70 L 64 70 L 70 70 L 130 70 L 136 70 L 200 70 L 200 78 L 136 78 L 130 78 L 70 78 L 64 78 L 0 78 Z'
const TAPE_PUSHED = 'M 0 70 L 64 70 L 70 64 L 130 64 L 136 70 L 200 70 L 200 78 L 136 78 L 130 72 L 70 72 L 64 78 L 0 78 Z'

const pickup = {
  dur: 12,
  focus: null,
  draw: () => (
    <>
      <rect x="-10" y="52" width="72" height="18" className="il-die" />
      <rect x="138" y="52" width="72" height="18" className="il-die" />
      <path d={TAPE_FLAT} className="il-tape">
        <Keys attr="d" keys={[[2.1, TAPE_FLAT], [3, TAPE_PUSHED], [9.5, TAPE_PUSHED], [10.5, TAPE_FLAT]]} />
      </path>
      <Note at={0.6} x={30} y={88}>다이싱 테이프</Note>

      {/* 핀 아래쪽은 받침 블록에 가려져, 블록에서 핀이 솟아오르는 것처럼 보입니다 */}
      <g>
        <Path keys={[[1.2, '0 0'], [3, '0 -12'], [9.5, '0 -12'], [10.5, '0 0']]} />
        {[85, 100, 115].map((x) => (
          <line key={x} x1={x} y1="84" x2={x} y2="112" className="il-needle" />
        ))}
      </g>
      <rect x="70" y="94" width="60" height="26" className="il-tool" />
      <Callout at={1} from={[118, 104]} to={[150, 108]}>이젝터 핀</Callout>

      <g>
        <Path keys={[[2.1, '0 0'], [3, '0 -6'], [9, '0 -6'], [11, '0 -56']]} />
        <rect x="70" y="52" width="60" height="18" className="il-die" />
        <Note x={100} y={63}>다이</Note>
      </g>
      <Appear at={3.2}>
        <Vanish at={6}>
          <Note x={165} y={38}>테이프에서 떼기 쉽게</Note>
          <Note x={165} y={30}>핀이 아래에서 밀어 올림 ↑</Note>
        </Vanish>
      </Appear>

      <Appear at={6}>
        <g transform="translate(0 -50)">
          <Path keys={[[6, '0 -50'], [7.5, '0 -6'], [9, '0 -6'], [11, '0 -56']]} />
          <rect x="82" y="10" width="36" height="42" className="il-tool" />
          <rect x="97" y="12" width="6" height="40" className="il-hole" />
          <Appear at={7.6}>
            <Arrow x1={100} y1={49} x2={100} y2={20} />
          </Appear>
          <Note x={70} y={30} anchor="end">콜릿</Note>
        </g>
      </Appear>
      <Appear at={7.8}>
        <Note x={196} y={30} anchor="end">진공으로 빨아들여</Note>
        <Note x={196} y={38} anchor="end">집어 올림</Note>
      </Appear>
    </>
  ),
}

// ── 장면 3: 다이 패드 위 접착제에 다이를 내려 누릅니다. ──
// 접착제 모양: 둥근 방울 → 눌려 퍼지며 다이 양옆으로 밀려 나옴(필렛)
const DROP = 'M 86 86 C 88 78, 94 76, 100 76 L 100 76 C 106 76, 112 78, 114 86 Z'
const SPREAD = 'M 52 86 C 57 85, 60 82, 60 79 L 140 79 C 140 82, 143 85, 148 86 Z'

const press = {
  dur: 12,
  focus: [128, 72.4, 32, 19.2],
  focusAt: 9.4,
  draw: () => (
    <>
      <rect x="20" y="86" width="160" height="14" className="il-frame" />
      <Note at={0.6} x={50} y={96}>리드프레임 다이 패드</Note>
      <path d={DROP} className="il-glue">
        <Keys attr="d" keys={[[2.6, DROP], [4.8, SPREAD]]} />
      </path>
      <Appear at={0.9}>
        <Vanish at={5.6}>
          <Callout from={[110, 82]} to={[150, 64]}>접착제 방울</Callout>
        </Vanish>
      </Appear>

      <g transform="translate(0 -40)">
        <Path keys={[[0.8, '0 -40'], [2.6, '0 -8'], [4.8, '0 0']]} />
        <rect x="60" y="70" width="80" height="14" className="il-die" />
        <Note x={100} y={79.5}>다이</Note>
      </g>
      <g transform="translate(0 -40)">
        <Path keys={[[0.8, '0 -40'], [2.6, '0 -8'], [4.8, '0 0'], [6.4, '0 0'], [8, '0 -90']]} />
        <rect x="88" y="40" width="24" height="30" className="il-tool" />
        <Note x={100} y={36}>콜릿</Note>
      </g>
      <Appear at={2.8}>
        <Vanish at={6}>
          <Arrow x1={70} y1={52} x2={70} y2={66} />
          <Arrow x1={130} y1={52} x2={130} y2={66} />
          <Note x={40} y={58}>누름</Note>
          <Note x={40} y={110} className="zs-note-hot">→ 아래에 고르게 퍼짐</Note>
        </Vanish>
      </Appear>

      <Appear at={6.4}>
        <Callout from={[145, 84]} to={[168, 66]} anchor="middle">필렛</Callout>
        <Callout from={[55, 84]} to={[32, 66]} anchor="middle">필렛</Callout>
        <Note x={100} y={112}>밀려 나온 접착제가 다이 옆을 감쌈</Note>
      </Appear>
    </>
  ),
}

// ── 장면 4: 다이 오른쪽 가장자리 확대. 적당한 필렛 → 너무 많음 → 보이드 ──
const FILLET_NONE = 'M 100 70 Q 100 80 100 80 L 100 80 Z'
const FILLET_GOOD = 'M 100 62 Q 104 78 128 80 L 100 80 Z'
const FILLET_MUCH = 'M 100 46 Q 118 78 192 80 L 100 80 Z'

const fillet = {
  dur: 16,
  focus: null,
  draw: () => (
    <>
      <rect x="0" y="80" width="200" height="40" className="il-frame" />
      <rect x="0" y="70" width="100" height="10" className="il-glue" />
      <path d={FILLET_NONE} className="il-glue">
        <Keys attr="d" keys={[[0.6, FILLET_NONE], [2.4, FILLET_GOOD], [4.4, FILLET_GOOD], [6, FILLET_MUCH], [8, FILLET_MUCH], [8.8, FILLET_GOOD]]} />
      </path>
      <rect x="0" y="10" width="100" height="60" className="il-die" />
      <Note at={0.4} x={50} y={40}>다이 (오른쪽 가장자리)</Note>
      <Note at={0.4} x={150} y={104}>다이 패드</Note>

      <Appear at={2.4}>
        <Vanish at={4.4}>
          <path d="M 140 60 l 5 5 l 10 -10" className="il-check" />
          <Note x={150} y={44}>적당한 필렛 = 잘 붙었다는 표시</Note>
        </Vanish>
      </Appear>
      <Appear at={6}>
        <Vanish at={8.4}>
          <circle cx="178" cy="79" r="9" className="il-warn-ring" />
          <Note x={150} y={30}>너무 많으면 넘쳐서</Note>
          <Note x={150} y={38}>주변 패드를 더럽힘</Note>
        </Vanish>
      </Appear>

      {/* 접착층 속 보이드: 열이 내려가다 막힙니다 */}
      <Appear at={8.6}>
        <ellipse cx="40" cy="75" rx="10" ry="3.4" className="il-void" />
        <Callout from={[40, 75]} to={[40, 100]} anchor="middle">보이드 (갇힌 공기)</Callout>
      </Appear>
      <Appear at={9.4}>
        <g className="zs-heat-path">
          <Arrow x1={76} y1={50} x2={76} y2={94} />
        </g>
        <Note x={70} y={64} anchor="end">열이 빠져나감</Note>
        <line x1="40" y1="50" x2="40" y2="69" className="zs-heat-line" />
        <Note x={36} y={56} anchor="end" className="zs-note-hot">막힘 ✕</Note>
        <Note x={150} y={30}>열이 잘 빠지지 않고</Note>
        <Note x={150} y={38}>나중에 들뜰 수 있음</Note>
      </Appear>
      <Appear at={12}>
        <Arrow x1={60} y1={0} x2={60} y2={12} />
        <Arrow x1={88} y1={0} x2={88} y2={12} />
        <Note x={150} y={58}>바르는 모양과 누르는 힘이 중요</Note>
      </Appear>
    </>
  ),
}

// ── 장면 5: 경화. 오븐에서 굳힌 뒤, 접착 필름(DAF)이라는 다른 방법을 봅니다. ──
const HEAT = [50, 80, 110, 140]

const cure = {
  dur: 12,
  focus: null,
  draw: () => (
    <>
      <Vanish at={6} fade={0.8}>
        <rect x="24" y="12" width="152" height="84" rx="4" className="zs-oven" />
        <line x1="34" y1="20" x2="166" y2="20" className="zs-heat-line" />
        <line x1="34" y1="88" x2="166" y2="88" className="zs-heat-line" />
        <Note x={100} y={9}>오븐</Note>
        {HEAT.map((x, i) => (
          <path key={x} d={`M ${x} 82 q 3 -4 0 -8 q -3 -4 0 -8 q 3 -4 0 -8`} className="zs-heat-line" opacity="0">
            <Keys loop attr="opacity" keys={[[0.6 + i * 0.3, 0], [1.2 + i * 0.3, 1], [2.2 + i * 0.3, 0]]} />
            <Path loop keys={[[0.6 + i * 0.3, '0 0'], [2.2 + i * 0.3, '0 -18']]} />
          </path>
        ))}
        <rect x="36" y="66" width="128" height="4" className="il-frame" />
        {[50, 90, 130].map((x) => (
          <g key={x}>
            <rect x={x} y="63" width="20" height="3" className="il-glue">
              <Keys attr="opacity" keys={[[1.5, 1], [5, 0]]} />
            </rect>
            <rect x={x} y="63" width="20" height="3" className="il-cured" opacity="0">
              <Keys attr="opacity" keys={[[1.5, 0], [5, 1]]} />
            </rect>
            <rect x={x + 2} y="57" width="16" height="6" className="il-die" />
          </g>
        ))}
        <Note x={100} y={108}>열로 접착제를 단단하게 굳힘</Note>
      </Vanish>

      {/* 접착 필름(DAF): 웨이퍼 뒷면에 붙임 → 함께 자름 → 필름째 붙임 */}
      <Appear at={6.4}>
        <Note x={100} y={12}>다른 방법: 접착 필름(DAF)</Note>
        <rect x="14" y="40" width="50" height="8" className="il-wafer" />
        <rect x="14" y="48" width="50" height="3" className="il-daf" />
        <Note x={39} y={66}>① 웨이퍼 뒷면에 필름</Note>
      </Appear>
      <Appear at={7.6}>
        {[0, 1, 2, 3].map((i) => (
          <g key={i}>
            <rect x={78 + i * 12.5} y="40" width="11" height="8" className="il-wafer" />
            <rect x={78 + i * 12.5} y="48" width="11" height="3" className="il-daf" />
          </g>
        ))}
        <Note x={102} y={66}>② 함께 자름</Note>
      </Appear>
      <Appear at={8.8}>
        <rect x="140" y="51" width="50" height="4" className="il-frame" />
        <rect x="155" y="48" width="20" height="3" className="il-daf" />
        <rect x="155" y="40" width="20" height="8" className="il-wafer" />
        <Note x={165} y={66}>③ 필름째 붙임</Note>
      </Appear>
      <Appear at={9.8}>
        <Note x={100} y={92}>두께가 일정하고 넘치지 않음</Note>
      </Appear>
    </>
  ),
}

export default { machine, pickup, press, fillet, cure }
