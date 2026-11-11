import { Appear, Callout, Keys, Note, Path, Vanish } from './kit.jsx'

// 패키지 쏘잉 확대 스토리의 장면 그림. 설명 문장은 data/zoomStories/packageSaw.js에 있습니다.
// 장면 1(장비) → 2(절단면) → 3(구리 절단면) → 4(기판에 붙이면)

// ── 장면 1: 위에서 본 스트립(3×3 패키지). 한 방향을 자르고 90° 돌려 나머지 방향을 자릅니다. ──
const S = { x: 26, y: 18, size: 84, cx: 68, cy: 60 }
const LINES = [46, 74] // 패키지 사이 절단 위치(y)

// 블레이드 가운데가 x=10에서 126까지 움직이는 동안, 스트립 안(26–110)에서만 자른 줄이 늘어납니다.
const cutKeys = (start, end, stopX = 126) => {
  const at = (x) => start + ((x - 10) / (stopX - 10)) * (end - start)
  return [[at(S.x), S.x], [at(Math.min(stopX, S.x + S.size)), Math.min(stopX, S.x + S.size)]]
}

const machine = {
  dur: 12,
  focus: [84, 64.4, 32, 19.2],
  focusAt: 11,
  draw: () => (
    <>
      <rect x="18" y="10" width="100" height="100" rx="2" className="il-tool" />
      <g>
        <Path type="rotate" keys={[[8, `0 ${S.cx} ${S.cy}`], [9, `90 ${S.cx} ${S.cy}`]]} />
        <rect x={S.x} y={S.y} width={S.size} height={S.size} className="il-mold" />
        {LINES.map((v) => (
          <g key={v}>
            <line x1={S.x} y1={v} x2={S.x + S.size} y2={v} className="il-street" />
            <line x1={v + 8} y1={S.y} x2={v + 8} y2={S.y + S.size} className="il-street" />
          </g>
        ))}
        <line x1={S.x} y1={LINES[0]} x2={S.x} y2={LINES[0]} className="zs-cut">
          <Keys attr="x2" keys={cutKeys(4, 5.6)} />
        </line>
        <line x1={S.x} y1={LINES[1]} x2={S.x} y2={LINES[1]} className="zs-cut">
          <Keys attr="x2" keys={cutKeys(5.65, 7.2)} />
        </line>
      </g>
      {/* 90° 돌린 뒤 자르는 줄 */}
      <line x1={S.x} y1={LINES[0]} x2={S.x} y2={LINES[0]} className="zs-cut">
        <Keys attr="x2" keys={cutKeys(9.25, 10.2)} />
      </line>
      <line x1={S.x} y1={LINES[1]} x2={S.x} y2={LINES[1]} className="zs-cut">
        <Keys attr="x2" keys={cutKeys(10.25, 11, 100)} />
      </line>

      {/* 카메라 십자선이 첫 절단 위치를 찾습니다 */}
      <rect x="150" y="96" width="18" height="11" rx="2" className="il-tool" />
      <circle cx="159" cy="101.5" r="3" className="il-hole" />
      <Note x={159} y={115}>카메라</Note>
      <Appear at={0.8}>
        <Vanish at={4}>
          <g transform="translate(159 96)">
            <Path keys={[[1, '159 96'], [3, `${S.x + 10} ${LINES[0]}`]]} />
            <circle r="4" className="zs-crosshair" />
            <line x1="-6" y1="0" x2="6" y2="0" className="zs-crosshair" />
            <line x1="0" y1="-6" x2="0" y2="6" className="zs-crosshair" />
          </g>
        </Vanish>
      </Appear>

      <Appear at={3.8}>
        <g transform={`translate(10 ${LINES[0]})`}>
          <Path
            keys={[
              [4, `10 ${LINES[0]}`],
              [5.6, `126 ${LINES[0]}`],
              [5.65, `10 ${LINES[1]}`],
              [7.2, `126 ${LINES[1]}`],
              [9.2, `126 ${LINES[1]}`],
              [9.25, `10 ${LINES[0]}`],
              [10.2, `126 ${LINES[0]}`],
              [10.25, `10 ${LINES[1]}`],
              [11, `100 ${LINES[1]}`],
            ]}
          />
          <rect x="-10" y="-1" width="20" height="2" rx="1" className="il-blade-top" />
        </g>
      </Appear>

      <Callout at={0.6} from={[100, 30]} to={[128, 22]}>몰딩된 스트립</Callout>
      <Callout at={1.2} from={[114, 104]} to={[128, 40]}>지그 (진공으로 고정)</Callout>
      <Note at={4.2} x={128} y={58} anchor="start">블레이드가 한 줄씩 자름</Note>
      <Note at={8.2} x={128} y={70} anchor="start">90° 돌려 나머지 방향</Note>
      <Note at={10.4} x={128} y={82} anchor="start">→ 개별 패키지로 나뉨</Note>
    </>
  ),
}

// ── 장면 2: 자르는 곳을 옆에서 본 단면. 블레이드(날 두께 방향)가 수지와 구리를 함께 지납니다. ──
const TIP_START = 42
const section = {
  dur: 12,
  focus: [84, 74.4, 32, 19.2],
  focusAt: 10,
  draw: () => (
    <>
      <rect x="0" y="104" width="200" height="16" className="il-tool" />
      <rect x="0" y="96" width="200" height="8" className="il-tape" />
      <rect x="0" y="84" width="200" height="12" className="il-cu" />
      <rect x="0" y="44" width="200" height="40" className="il-mold" />
      {[
        { x: 36, wire: 'M 70 72 Q 82 56 90 84' },
        { x: 128, wire: 'M 130 72 Q 118 56 110 84' },
      ].map((d) => (
        <g key={d.x}>
          <rect x={d.x} y="72" width="36" height="12" className="il-die" />
          <path d={d.wire} className="il-wire" />
        </g>
      ))}

      <Note at={0.6} x={40} y={56}>몰딩 수지 (단단함)</Note>
      <Note at={1.4} x={40} y={93}>구리 리드프레임 (무름)</Note>
      <Note at={2.2} x={54} y={81}>칩</Note>
      <Note at={2.6} x={150} y={114}>테이프 · 지그</Note>

      <g transform={`translate(0 ${TIP_START - 98})`}>
        <Path keys={[[4.4, `0 ${TIP_START - 98}`], [7, '0 0']]} />
        <rect x="97" y="-30" width="6" height="128" className="il-tool" />
      </g>
      <Callout at={4.2} from={[103, 20]} to={[128, 14]}>블레이드</Callout>

      {/* 수지 가루, 그다음 구리 가루 */}
      <Appear at={5}>
        {[0, 1, 2].map((i) => (
          <circle key={i} cx="104" cy="46" r="1" className="zs-debris" opacity="0">
            <Path loop keys={[[5 + i * 0.25, '0 0'], [6 + i * 0.25, `${14 + i * 6} ${-12 - i * 3}`]]} />
            <Keys loop attr="opacity" keys={[[5 + i * 0.25, 1], [6 + i * 0.25, 0]]} />
          </circle>
        ))}
      </Appear>
      <Appear at={6.4}>
        {[0, 1, 2].map((i) => (
          <circle key={i} cx="104" cy="86" r="1.1" className="il-cu" opacity="0">
            <Path loop keys={[[6.4 + i * 0.3, '0 0'], [7.5 + i * 0.3, `${18 + i * 6} ${-30 - i * 4}`]]} />
            <Keys loop attr="opacity" keys={[[6.4 + i * 0.3, 1], [7.5 + i * 0.3, 0]]} />
          </circle>
        ))}
        <Note x={160} y={54}>수지와 구리를 한 번에 자름</Note>
      </Appear>

      <Appear at={8.2}>
        <Note x={6} y={14} anchor="start">웨이퍼 쏘잉: 실리콘만</Note>
        <Note x={6} y={22} anchor="start">패키지 쏘잉: 수지 + 구리</Note>
        <Note x={6} y={34} anchor="start" className="zs-note-hot">→ 블레이드 종류가 다르고 빨리 닳음</Note>
      </Appear>
    </>
  ),
}

// ── 장면 3: 구리 절단면 확대. 날카로운 날은 깨끗하게, 무딘 날은 구리를 늘여 버를 남깁니다. ──
const burr = {
  dur: 12,
  focus: null,
  draw: () => (
    <>
      <rect x="0" y="100" width="200" height="20" className="il-tape" />
      <rect x="0" y="0" width="88" height="60" className="il-mold" />
      <rect x="112" y="0" width="88" height="60" className="il-mold" />
      <rect x="0" y="60" width="88" height="40" className="il-cu" />
      <rect x="112" y="60" width="88" height="40" className="il-cu" />
      <rect x="88" y="0" width="24" height="100" className="zs-kerf" />

      <Note at={0.6} x={44} y={32}>몰딩 수지</Note>
      <Note at={1.2} x={44} y={82}>구리 리드</Note>
      <Note at={1.8} x={44} y={113}>테이프</Note>

      {/* 거스러미: 무딘 날에서 구리가 늘어나 아래로 밀려 나옵니다 */}
      <polygon points="80,100 88,100 88,100" className="il-cu">
        <Keys attr="points" keys={[[8.6, '80,100 88,100 88,100'], [10.4, '80,100 88,100 95,111']]} />
      </polygon>
      <polygon points="112,100 120,100 112,100" className="il-cu">
        <Keys attr="points" keys={[[8.6, '112,100 120,100 112,100'], [10.4, '112,100 120,100 105,111']]} />
      </polygon>

      <Appear at={4}>
        <Vanish at={8}>
          <line x1="88" y1="60" x2="88" y2="100" className="zs-clean" />
          <line x1="112" y1="60" x2="112" y2="100" className="zs-clean" />
          <Note x={156} y={82} className="zs-note-good">절단면이 깨끗함</Note>
        </Vanish>
      </Appear>

      <g>
        <Path keys={[[10.6, '0 0'], [11.4, '0 -110']]} />
        <rect x="90" y="-10" width="20" height="108" className="il-tool" />
        <Appear at={8}>
          <rect x="90.5" y="90" width="19" height="7.5" className="il-worn" />
        </Appear>
      </g>
      <Vanish at={8}>
        <Callout at={0.6} from={[110, 30]} to={[130, 24]}>날카로운 날</Callout>
      </Vanish>
      <Appear at={8}>
        <Vanish at={10.6}>
          <Callout from={[110, 92]} to={[130, 24]}>무딘 날 (닳음)</Callout>
        </Vanish>
      </Appear>

      <Appear at={10.4}>
        <circle cx="92" cy="105" r="6" className="il-warn-ring" />
        <circle cx="108" cy="105" r="6" className="il-warn-ring" />
        <Callout from={[114, 106]} to={[132, 44]} anchor="start">구리가 늘어나 거스러미(버)</Callout>
      </Appear>
    </>
  ),
}

// ── 장면 4: 기판 위에 놓인 패키지(위에서 봄). 버가 옆 단자의 패드까지 닿습니다. ──
const LEADS = [58, 76, 94, 112, 130]
const board = {
  dur: 12,
  focus: null,
  draw: () => (
    <>
      <rect x="4" y="6" width="192" height="108" rx="3" className="il-substrate" />
      {LEADS.map((x) => (
        <rect key={x} x={x - 2} y="74" width="14" height="20" rx="1" className="zs-board-pad" />
      ))}
      <Callout at={0.6} from={[134, 90]} to={[172, 72]} anchor="middle">기판 패드</Callout>

      <g transform="translate(0 -40)" opacity="0">
        <Path keys={[[0.8, '0 -40'], [3, '0 0']]} />
        <Keys attr="opacity" keys={[[0.8, 0], [1.4, 1]]} />
        <rect x="50" y="20" width="100" height="56" rx="2" className="il-mold" />
        {LEADS.map((x) => (
          <rect key={x} x={x} y="76" width="10" height="8" className="il-cu" />
        ))}
        <polygon points="104,79 104,83 104,81" className="il-cu">
          <Keys attr="points" keys={[[4.6, '104,79 104,83 104,81'], [6.4, '104,79 104,83 111,82']]} />
        </polygon>
      </g>
      <Note at={3.2} x={100} y={48}>패키지 (위에서 본 모습)</Note>
      <Callout at={3.4} from={[60, 81]} to={[30, 72]} anchor="middle">단자(리드)</Callout>

      <Appear at={6.4}>
        <circle cx="108" cy="82" r="6" className="il-warn-ring" />
        <Note x={100} y={103} className="zs-note-hot">버가 커서 옆 단자 패드에 닿음</Note>
      </Appear>
      <Appear at={8.4}>
        <circle cx="108" cy="82" r="13" className="zs-lens" />
        <line x1="117" y1="91" x2="121" y2="95" className="zs-nozzle" />
        <Note x={100} y={111}>그래서 세정·건조 뒤 외관을 확인하고 다음 공정으로</Note>
      </Appear>
    </>
  ),
}

export default { machine, section, burr, board }
