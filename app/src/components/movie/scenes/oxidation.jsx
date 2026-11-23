import { anim, Callout, Rain, Slab, Substrate, Tag, loop, SI_TOP } from '../kit.jsx'

// 산화 공정 애니메이션 그림(직접 그린 그림). 자막은 data/processMovies/oxidation.js

// 산화로: 가로로 누운 관 안에 웨이퍼들이 세워져 있고, 양 끝에 더미 웨이퍼
const Furnace = ({ B }) => (
  <g>
    <rect x="30" y="50" width="260" height="70" rx="34" className="mv-soft" />
    {/* 가열 코일 */}
    {Array.from({ length: 12 }, (_, i) => (
      <rect key={i} x={48 + i * 19} y="44" width="8" height="82" rx="3" className="mv-coil" style={anim('mv-coilon', B(1), 1.5)} />
    ))}
    {Array.from({ length: 14 }, (_, i) => {
      const dummy = i === 0 || i === 13
      return <rect key={i} x={62 + i * 14} y="62" width="4" height="46" rx="1.5" className={dummy ? 'm-mask' : 'm-si'} style={anim('mv-slidein', 0.3 + i * 0.05, 0.8)} />
    })}
    <rect x="58" y="106" width="200" height="4" rx="2" className="mv-boat" style={anim('mv-slidein', 0.3, 0.8)} />
    <Tag x={160} y={40} anchor="middle" at={0.2} strong>
      산화로(Furnace)
    </Tag>
    <Tag x={160} y={140} anchor="middle" at={B(1) + 0.4} strong>
      800~1,200℃
    </Tag>
    <Callout x={64} y={66} tx={40} ty={150} text="더미 웨이퍼" at={B(2)} />
    <Callout x={246} y={66} tx={280} ty={150} text="더미 웨이퍼" at={B(2) + 0.3} anchor="end" />
    <g style={anim('mv-fade', B(1), 0.6)}>
      <circle cx="160" cy="85" r="60" fill="url(#mv-glow)" style={loop('mv-pulse', B(1), 2.2, 'ease-in-out')} />
    </g>
  </g>
)

// 건식과 습식을 반으로 나눠 비교 (같은 시간 동안 자라는 두께가 다름)
const DryWet = ({ B }) => (
  <g>
    <rect x="0" y={SI_TOP} width="158" height={48} className="m-si" />
    <rect x="162" y={SI_TOP} width="158" height={48} className="m-si" />
    <path d={`M160 20 V${SI_TOP + 40}`} className="mv-leader" strokeDasharray="3 3" />
    <Tag x={79} y={18} anchor="middle" at={0} strong>
      건식: 산소(O₂)만
    </Tag>
    <Tag x={241} y={18} anchor="middle" at={B(1)} strong>
      습식: 산소 + 수증기(H₂O)
    </Tag>
    <Rain x0={14} x1={146} y0={28} y1={SI_TOP - 8} n={7} at={0.2} dur={2.6} r={2.6} cls="mv-gas" />
    <Rain x0={176} x1={306} y0={28} y1={SI_TOP - 8} n={14} at={B(1)} dur={1.3} r={1.8} cls="mv-water" />
    {/* 건식은 얇게, 습식은 두껍게 자람 */}
    <Slab x={0} w={158} y={SI_TOP - 5} h={5} mat="oxide" enter="mv-grow" at={0.6} dur={B(2) + 2 - 0.6} />
    <Slab x={162} w={158} y={SI_TOP - 30} h={30} mat="oxide" enter="mv-grow" at={B(1) + 0.4} dur={B(2) + 2 - B(1) - 0.4} />
    <Tag x={79} y={SI_TOP - 10} anchor="middle" at={B(2)}>
      얇고 치밀한 막
    </Tag>
    <Tag x={241} y={SI_TOP - 34} anchor="middle" at={B(2)}>
      약 5~10배 두꺼운 막
    </Tag>
  </g>
)

// 3D 구조(턱이 있는 표면)에서 라디칼 산화로 고르게 자라는 막
const Conformal = ({ B }) => (
  <g>
    <path d={`M0 ${SI_TOP} H110 V90 H210 V${SI_TOP} H320 V180 H0 Z`} className="m-si" />
    <g className="mv-box" style={anim('mv-fade', 0.4, 1.4)}>
      <path d={`M0 ${SI_TOP - 6} H104 V84 H216 V${SI_TOP - 6} H320 V${SI_TOP} H210 V90 H110 V${SI_TOP} H0 Z`} className="m-oxide" />
    </g>
    <Rain x0={20} x1={300} y0={14} y1={80} n={12} at={0} dur={1.6} cls="mv-gas" />
    <Callout x={110} y={110} tx={60} ty={70} text="모서리·옆면" at={B(1)} anchor="end" />
    <Tag x={160} y={70} anchor="middle" at={B(1) + 0.4} strong>
      라디칼 산화: 두께가 고르게
    </Tag>
  </g>
)

// 산화막이 하는 일: 절연, 보호(이온 주입·식각 때), 게이트 절연막
const Roles = ({ B }) => (
  <g>
    <Substrate label={false} />
    <Slab x={40} w={240} y={SI_TOP - 10} h={10} mat="oxide" />
    {/* 1. 절연: 위의 전극과 아래 실리콘 사이 전류를 막음 */}
    <g style={anim('mv-fade', 0, 0.5)}>
      <Slab x={70} w={60} y={SI_TOP - 22} h={12} mat="metal" />
      <path d={`M100 ${SI_TOP - 10} v12`} className="mv-block" />
      <Tag x={100} y={SI_TOP - 28} anchor="middle" strong>
        전류 차단(절연)
      </Tag>
    </g>
    {/* 2. 보호: 위에서 오는 이온·식각 가스를 막음 */}
    <Rain x0={180} x1={270} y0={20} y1={SI_TOP - 14} n={6} at={B(1)} dur={1.2} cls="mv-ion" />
    <Tag x={225} y={14} anchor="middle" at={B(1)} strong>
      이온·식각으로부터 보호
    </Tag>
    {/* 3. 게이트 절연막 */}
    <Callout x={100} y={SI_TOP - 5} tx={150} ty={150} text="트랜지스터의 게이트 절연막" at={B(2)} />
  </g>
)

export default {
  id: 'oxidation',
  scenes: {
    furnace: { beat: 3.6, draw: (B) => <Furnace B={B} />, legend: ['si'] },
    drywet: { beat: 3.8, draw: (B) => <DryWet B={B} />, legend: ['si', 'oxide'] },
    conformal: { beat: 3.6, draw: (B) => <Conformal B={B} />, legend: ['si', 'oxide'] },
    roles: {
      beat: 3.6,
      legend: ['si', 'oxide', 'metal'],
      draw: (B) => <Roles B={B} />,
    },
  },
}
