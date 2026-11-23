// 공정 애니메이션 그림. 키는 공정 id, 값은 { 장면 id: { beat: 문장 하나의 길이(초), legend: [재료], draw: (B) => svg } }
// B(i)는 i번째 자막 문장이 시작하는 시각(초)입니다. 그림의 움직임을 자막에 맞출 때 씁니다.
const modules = import.meta.glob('./*.jsx', { eager: true })
export const movieArt = Object.fromEntries(Object.entries(modules).map(([, m]) => [m.default.id, m.default.scenes]))
