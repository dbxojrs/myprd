import { Anim, Arrow, Label, Move, StepCaption, Visible } from '../illustrationKit.jsx'

// 전공정 8대 공정의 움직이는 그림. 단계 자막은 processes.js의 summary를 단계로 나눈 것입니다.
// animate가 false이면 공정이 끝난 모습을 멈춘 그림으로 그리고, compact이면 글자 없이 작게 그립니다.

// 움직일 때는 단계 자막, 멈춘 그림에서는 한 줄 설명
const Caption = ({ c, animate, dur, items, still }) =>
  animate ? <StepCaption dur={dur} items={items} /> : <Label x="60" y="76" compact={c}>{still}</Label>

// 움직일 때만 from–to 동안 보이고, 멈춘 그림에서는 show가 true일 때만 보입니다.
const When = ({ animate, from, to = 1, dur, show = true, children }) =>
  animate ? (
    <Visible from={from} to={to} dur={dur}>
      {children}
    </Visible>
  ) : show ? (
    children
  ) : null

export default {
  // ── 웨이퍼 제조: 잉곳을 돌리며 끌어올림 → 얇게 자름 → 연마 ──
  'wafer-make': (c, animate) => {
    const dur = '6s'
    return (
      <>
        {/* 도가니와 녹은 실리콘 */}
        <rect x="14" y="56" width="36" height="12" rx="2" className="il-tool" />
        <rect x="17" y="56" width="30" height="5" className="il-fe-melt" />
        {/* 자라는 잉곳 */}
        <line x1="32" y1="8" x2="32" y2="18" className="il-probe" />
        <rect x="25" y={animate ? 50 : 18} width="14" height={animate ? 6 : 38} rx="3" className="il-wafer">
          {animate && (
            <>
              <Anim attr="y" points={[[0, 50], [0.35, 18], [1, 18]]} dur={dur} />
              <Anim attr="height" points={[[0, 6], [0.35, 38], [1, 38]]} dur={dur} />
            </>
          )}
        </rect>
        {animate && (
          <line x1="26" y1="30" x2="38" y2="30" className="il-fe-turn">
            <Anim attr="stroke-dashoffset" points={[[0, 0], [1, 8]]} dur="0.5s" />
          </line>
        )}
        {/* 자르기: 누운 잉곳과 블레이드 */}
        <When animate={animate} from={0.35} dur={dur}>
          <rect x="62" y="16" width="40" height="14" rx="3" className="il-wafer" />
          {[70, 78, 86, 94].map((x) => (
            <line key={x} x1={x} y1="16" x2={x} y2="30" className="il-cut" />
          ))}
          {animate && (
            <line x1="66" y1="10" x2="66" y2="34" className="il-blade">
              <Move points={[[0.35, '0 0'], [0.65, '28 0'], [1, '28 0']]} dur={dur} />
            </line>
          )}
        </When>
        {/* 잘린 웨이퍼와 연마 */}
        <When animate={animate} from={0.5} dur={dur}>
          {[66, 80, 94].map((x) => (
            <ellipse key={x} cx={x} cy="56" rx="6" ry="2.2" className="il-wafer" />
          ))}
        </When>
        <When animate={animate} from={0.65} to={1} dur={dur} show={false}>
          <g>
            <rect x="72" y="46" width="16" height="6" rx="1" className="il-tool" />
            <Move points={[[0.65, '-8 0'], [0.75, '8 0'], [0.85, '-8 0'], [0.95, '8 0']]} dur={dur} />
          </g>
        </When>
        <When animate={animate} from={0.85} dur={dur}>
          <line x1="76" y1="55" x2="84" y2="55" className="il-fe-shine" />
        </When>
        <Label x="32" y="7" compact={c}>잉곳</Label>
        <Caption
          c={c}
          animate={animate}
          dur={dur}
          items={[
            [0, 0.35, '① 녹인 실리콘에서 잉곳을 키움'],
            [0.35, 0.65, '② 잉곳을 얇게 잘라 웨이퍼로'],
            [0.65, 1, '③ 표면을 매끄럽게 연마'],
          ]}
          still="잉곳을 잘라 연마하면 웨이퍼"
        />
      </>
    )
  },

  // ── 산화: 노를 데우고 산소·수증기를 넣으면 표면에 산화막이 자람 ──
  oxidation: (c, animate) => {
    const dur = '6s'
    return (
      <>
        <rect x="8" y="16" width="104" height="38" rx="8" className="il-fe-chamber" />
        <rect x="28" y="40" width="64" height="8" className="il-wafer" />
        <rect x="28" y={animate ? 40 : 36} width="64" height={animate ? 0 : 4} className="il-oxide">
          {animate && (
            <>
              <Anim attr="y" points={[[0.55, 40], [0.95, 36]]} dur={dur} />
              <Anim attr="height" points={[[0.55, 0], [0.95, 4]]} dur={dur} />
            </>
          )}
        </rect>
        {/* 열 */}
        <When animate={animate} from={0} dur={dur}>
          {[24, 48, 72, 96].map((x) => (
            <path key={x} d={`M${x} 60 q3 -3 0 -6 q-3 -3 0 -6`} className="il-fe-heat" transform="translate(0 6)" />
          ))}
        </When>
        {/* 산소·수증기 분자가 흘러 들어와 표면에 닿음 */}
        <When animate={animate} from={0.25} dur={dur} show={false}>
          {[0, 1, 2, 3].map((i) => (
            <circle key={i} cx="10" cy="26" r="1.8" className="il-fe-gas">
              <animateTransform
                attributeName="transform"
                type="translate"
                values={`0 0;${30 + i * 12} 0;${36 + i * 12} 10`}
                dur="1.2s"
                begin={`${i * 0.3}s`}
                repeatCount="indefinite"
              />
            </circle>
          ))}
        </When>
        <Arrow x1={2} y1={26} x2={14} y2={26} />
        <Label x="22" y="12" compact={c}>O₂ · H₂O</Label>
        <Label x="92" y="12" compact={c}>고온의 노</Label>
        <Caption
          c={c}
          animate={animate}
          dur={dur}
          items={[
            [0, 0.25, '① 노 안을 높은 온도로 데움'],
            [0.25, 0.55, '② 산소나 수증기를 흘려 넣음'],
            [0.55, 1, '③ 표면에 얇은 산화막(SiO₂)이 자람'],
          ]}
          still="표면에 얇은 산화막이 자람"
        />
      </>
    )
  },

  // ── 포토: 감광액 바르기 → 마스크를 지난 빛을 렌즈로 줄여 쬠 → 현상하면 무늬가 남음 ──
  photo: (c, animate) => {
    const dur = '7s'
    const openings = [44, 58, 72]
    return (
      <>
        <rect x="25" y="60" width="70" height="6" className="il-wafer" />
        {/* 감광액: 가운데에서 바깥으로 퍼짐, 현상 뒤에는 무늬만 남음 */}
        {animate ? (
          <>
            <rect x="55" y="57" width="10" height="3" className="il-resist">
              <Anim attr="x" points={[[0.05, 55], [0.25, 25], [0.65, 25], [0.66, 25]]} dur={dur} />
              <Anim attr="width" points={[[0.05, 10], [0.25, 70], [0.65, 70], [0.66, 0], [0.99, 0], [1, 10]]} dur={dur} />
            </rect>
            <Visible from={0.66} to={1} dur={dur}>
              {[25, 50, 64, 78].map((x, i) => (
                <rect key={x} x={x} y="57" width={i === 0 ? 19 : 8} height="3" className="il-resist" />
              ))}
              <rect x="86" y="57" width="9" height="3" className="il-resist" />
            </Visible>
            <Visible from={0} to={0.25} dur={dur}>
              <rect x="56" y="38" width="8" height="8" className="il-tool" />
              <circle cx="60" cy="50" r="1.6" className="il-fe-gas">
                <Anim attr="cy" points={[[0, 48], [0.2, 56]]} dur={dur} />
              </circle>
            </Visible>
          </>
        ) : (
          <>
            {[25, 50, 64, 78].map((x, i) => (
              <rect key={x} x={x} y="57" width={i === 0 ? 19 : 8} height="3" className="il-resist" />
            ))}
            <rect x="86" y="57" width="9" height="3" className="il-resist" />
          </>
        )}
        {/* 빛·마스크·렌즈 */}
        <When animate={animate} from={0.25} to={0.66} dur={dur}>
          <rect x="34" y="12" width="52" height="4" className="il-tool" />
          {openings.map((x) => (
            <rect key={x} x={x - 2} y="12" width="4" height="4" className="il-fe-open" />
          ))}
          <ellipse cx="60" cy="30" rx="18" ry="3" className="il-fe-lens" />
          {openings.map((x, i) => (
            <line key={x} x1={x} y1="16" x2={47 + i * 13} y2="57" className="il-fe-light" />
          ))}
        </When>
        <When animate={animate} from={0.45} to={0.66} dur={dur} show={false}>
          {[44, 58, 72].map((x) => (
            <rect key={x} x={x + 1} y="57" width="5" height="3" className="il-fe-exposed" />
          ))}
        </When>
        <Label x="60" y="8" compact={c}>빛 → 마스크 → 렌즈</Label>
        <Caption
          c={c}
          animate={animate}
          dur={dur}
          items={[
            [0, 0.25, '① 웨이퍼에 감광액을 바름'],
            [0.25, 0.66, '② 마스크를 지난 빛을 렌즈로 줄여 쬠'],
            [0.66, 1, '③ 현상하면 회로 무늬가 남음'],
          ]}
          still="마스크의 회로 무늬를 감광액에 옮김"
        />
      </>
    )
  },

  // ── 식각: 플라즈마 이온이 감광액이 열린 곳의 막을 깎아 냄 ──
  etch: (c, animate) => {
    const dur = '6s'
    const holes = [40, 68]
    return (
      <>
        <rect x="20" y="56" width="80" height="8" className="il-wafer" />
        {/* 깎일 막: 열린 곳만 얇아짐 */}
        <rect x="20" y="50" width="20" height="6" className="il-oxide" />
        <rect x="52" y="50" width="16" height="6" className="il-oxide" />
        <rect x="80" y="50" width="20" height="6" className="il-oxide" />
        {holes.map((x) => (
          <rect key={x} x={x} y={animate ? 50 : 56} width="12" height={animate ? 6 : 0} className="il-oxide">
            {animate && (
              <>
                <Anim attr="y" points={[[0.3, 50], [0.75, 56]]} dur={dur} />
                <Anim attr="height" points={[[0.3, 6], [0.75, 0]]} dur={dur} />
              </>
            )}
          </rect>
        ))}
        {/* 감광액: 마지막에 벗겨 냄 */}
        <When animate={animate} from={0} to={0.75} dur={dur} show={false}>
          <rect x="20" y="46" width="20" height="4" className="il-resist" />
          <rect x="52" y="46" width="16" height="4" className="il-resist" />
          <rect x="80" y="46" width="20" height="4" className="il-resist" />
        </When>
        {/* 플라즈마와 이온 */}
        <When animate={animate} from={0} to={0.75} dur={dur}>
          <ellipse cx="60" cy="18" rx="40" ry="8" className="il-fe-plasma">
            {animate && <Anim attr="ry" points={[[0, 7], [0.5, 9], [1, 7]]} dur="1s" />}
          </ellipse>
        </When>
        <When animate={animate} from={0.25} to={0.75} dur={dur} show={false}>
          {holes.flatMap((x, h) =>
            [0, 1].map((i) => (
              <circle key={`${x}-${i}`} cx={x + 4 + i * 4} cy="24" r="1.4" className="il-fe-ion">
                <animateTransform attributeName="transform" type="translate" values="0 0;0 26" dur="0.7s" begin={`${(h + i) * 0.17}s`} repeatCount="indefinite" />
              </circle>
            )),
          )}
        </When>
        <Label x="60" y="7" compact={c}>플라즈마</Label>
        <Caption
          c={c}
          animate={animate}
          dur={dur}
          items={[
            [0, 0.25, '① 가스를 플라즈마로 만듦'],
            [0.25, 0.75, '② 이온이 열린 곳의 막을 깎아 냄'],
            [0.75, 1, '③ 감광액을 벗기면 막에 무늬가 남음'],
          ]}
          still="감광액이 없는 곳의 막을 깎아 무늬를 새김"
        />
      </>
    )
  },

  // ── 증착: 원료 기체 분자가 내려앉아 얇은 막이 쌓임 ──
  deposition: (c, animate) => {
    const dur = '6s'
    return (
      <>
        <rect x="14" y="10" width="92" height="58" rx="4" className="il-fe-chamber" />
        <rect x="52" y="6" width="16" height="6" className="il-tool" />
        <rect x="24" y="56" width="72" height="8" className="il-wafer" />
        <rect x="24" y={animate ? 56 : 50} width="72" height={animate ? 0 : 6} className="il-oxide">
          {animate && (
            <>
              <Anim attr="y" points={[[0.25, 56], [0.8, 50]]} dur={dur} />
              <Anim attr="height" points={[[0.25, 0], [0.8, 6]]} dur={dur} />
            </>
          )}
        </rect>
        <When animate={animate} from={0.05} to={0.8} dur={dur} show={false}>
          {[30, 42, 54, 66, 78, 90].map((x, i) => (
            <circle key={x} cx={60} cy="14" r="1.6" className="il-fe-gas">
              <animateTransform
                attributeName="transform"
                type="translate"
                values={`0 0;${(x - 60) / 2} 18;${x - 60} 38`}
                dur="1.3s"
                begin={`${i * 0.2}s`}
                repeatCount="indefinite"
              />
            </circle>
          ))}
        </When>
        <When animate={animate} from={0.8} dur={dur}>
          <line x1="100" y1="50" x2="100" y2="56" className="il-dim" />
          <Label x="84" y="46" compact={c}>목표 두께</Label>
        </When>
        <Label x="90" y="9" compact={c}>원료 기체 ↓</Label>
        <Caption
          c={c}
          animate={animate}
          dur={dur}
          items={[
            [0, 0.25, '① 원료 기체를 넣음'],
            [0.25, 0.8, '② 분자가 내려앉아 얇은 막이 쌓임'],
            [0.8, 1, '③ 원하는 두께에서 멈춤'],
          ]}
          still="웨이퍼 위에 얇은 막을 원하는 두께로 쌓음"
        />
      </>
    )
  },

  // ── 이온 주입: 불순물 이온을 가속해 열린 영역에 넣어 성질을 바꿈 ──
  'ion-implant': (c, animate) => {
    const dur = '6s'
    return (
      <>
        <rect x="20" y="42" width="80" height="22" className="il-wafer" />
        <rect x="20" y="38" width="30" height="4" className="il-resist" />
        <rect x="70" y="38" width="30" height="4" className="il-resist" />
        {/* 바뀐 영역 */}
        <rect x="50" y="42" width="20" height="12" className="il-fe-doped" opacity={animate ? 0 : 1}>
          {animate && <Anim attr="opacity" points={[[0.3, 0], [0.85, 1], [0.99, 1], [1, 0]]} dur={dur} />}
        </rect>
        {/* 이온원과 빔 */}
        <rect x="48" y="4" width="24" height="10" rx="2" className="il-tool" />
        <When animate={animate} from={0.1} to={0.9} dur={dur}>
          <line x1="60" y1="14" x2="60" y2="40" className="il-fe-beam" />
        </When>
        <When animate={animate} from={0.25} to={0.9} dur={dur} show={false}>
          {[0, 1, 2, 3, 4].map((i) => (
            <circle key={i} cx={53 + i * 3.5} cy="16" r="1.4" className="il-fe-ion">
              <animateTransform attributeName="transform" type="translate" values={`0 0;0 ${30 + (i % 3) * 3}`} dur="0.8s" begin={`${i * 0.16}s`} repeatCount="indefinite" />
            </circle>
          ))}
        </When>
        <Label x="96" y="12" compact={c}>붕소·인 이온</Label>
        <Label x="35" y="34" compact={c}>가림막</Label>
        <Caption
          c={c}
          animate={animate}
          dur={dur}
          items={[
            [0, 0.25, '① 불순물 이온을 가속'],
            [0.25, 0.85, '② 열린 영역에 이온이 박힘'],
            [0.85, 1, '③ 그 영역의 전기적 성질이 바뀜'],
          ]}
          still="이온을 넣은 영역의 전기적 성질이 바뀜"
        />
      </>
    )
  },

  // ── 금속 배선: 홈을 금속으로 채움 → CMP로 평평하게 → 맨 위에 패드 ──
  metallization: (c, animate) => {
    const dur = '7s'
    const trenches = [30, 55, 80]
    return (
      <>
        <rect x="18" y="58" width="84" height="6" className="il-wafer" />
        <rect x="18" y="42" width="84" height="16" className="il-oxide" />
        {/* 홈을 채운 금속 */}
        {trenches.map((x) => (
          <rect key={x} x={x} y={animate ? 58 : 42} width="10" height={animate ? 0 : 16} className="il-cu">
            {animate && (
              <>
                <Anim attr="y" points={[[0.05, 58], [0.35, 42]]} dur={dur} />
                <Anim attr="height" points={[[0.05, 0], [0.35, 16]]} dur={dur} />
              </>
            )}
          </rect>
        ))}
        {/* 넘친 금속층 → CMP로 깎임 */}
        {animate && (
          <rect x="18" y="42" width="84" height="0" className="il-cu">
            <Anim attr="y" points={[[0.3, 42], [0.4, 38], [0.6, 38], [0.75, 42]]} dur={dur} />
            <Anim attr="height" points={[[0.3, 0], [0.4, 4], [0.6, 4], [0.75, 0]]} dur={dur} />
          </rect>
        )}
        <When animate={animate} from={0.45} to={0.75} dur={dur} show={false}>
          <g>
            <rect x="44" y="28" width="32" height="8" rx="1" className="il-tool" />
            <Move points={[[0.45, '-20 0'], [0.55, '20 0'], [0.65, '-20 0'], [0.75, '20 0']]} dur={dur} />
          </g>
        </When>
        <When animate={animate} from={0.78} dur={dur}>
          <rect x="52" y="37" width="16" height="5" className="il-frame" />
          <Label x="60" y="32" compact={c}>패드</Label>
        </When>
        <Label x="60" y="8" compact={c}>구리·알루미늄 배선</Label>
        <Caption
          c={c}
          animate={animate}
          dur={dur}
          items={[
            [0, 0.4, '① 홈을 금속으로 채움'],
            [0.4, 0.75, '② CMP로 넘친 금속을 깎아 평평하게'],
            [0.75, 1, '③ 맨 위에 패키징용 패드를 만듦'],
          ]}
          still="금속 전선으로 트랜지스터를 잇고 맨 위에 패드"
        />
      </>
    )
  },

  // ── EDS: 탐침을 칩마다 대어 검사하고 불량 칩을 표시 ──
  eds: (c, animate) => {
    const dur = '6s'
    const chips = [
      [44, 26], [56, 26], [68, 26],
      [44, 38], [56, 38], [68, 38],
      [44, 50], [56, 50], [68, 50],
    ]
    const bad = [4, 6]
    const visit = (i) => 0.08 + i * 0.075
    return (
      <>
        <circle cx="60" cy="42" r="26" className="il-wafer" />
        {chips.map(([x, y], i) => (
          <g key={i}>
            <rect x={x - 5} y={y - 5} width="10" height="10" className="il-die" />
            <When animate={animate} from={visit(i) + 0.05} dur={dur}>
              <rect x={x - 5} y={y - 5} width="10" height="10" className={bad.includes(i) ? 'il-glue' : 'il-fe-pass'} />
              {bad.includes(i) && !c && <path d={`M${x - 3} ${y - 3} l6 6 m0 -6 l-6 6`} className="il-crack" />}
            </When>
          </g>
        ))}
        {/* 탐침: 칩을 차례로 옮겨 다님 */}
        <g>
          {animate && (
            <animateTransform
              attributeName="transform"
              type="translate"
              values={chips.map(([x, y]) => `${x - 56} ${y - 26}`).concat(['0 0']).join(';')}
              keyTimes={[...chips.map((_, i) => visit(i)), 1].map((t, i) => (i === 0 ? 0 : t)).map((t) => +t.toFixed(3)).join(';')}
              calcMode="discrete"
              dur={dur}
              repeatCount="indefinite"
            />
          )}
          <rect x="44" y="4" width="24" height="5" className="il-tool" />
          <line x1="54" y1="9" x2="55" y2="24" className="il-probe" />
          <line x1="58" y1="9" x2="57" y2="24" className="il-probe" />
        </g>
        <Label x="96" y="10" compact={c}>탐침(프로브)</Label>
        <Caption
          c={c}
          animate={animate}
          dur={dur}
          items={[
            [0, 0.3, '① 탐침을 칩의 패드에 댐'],
            [0.3, 0.75, '② 칩마다 전기적으로 동작하는지 검사'],
            [0.75, 1, '③ 불량 칩을 표시 → 패키징하지 않음'],
          ]}
          still="칩마다 검사하고 불량 칩을 표시"
        />
      </>
    )
  },
}
