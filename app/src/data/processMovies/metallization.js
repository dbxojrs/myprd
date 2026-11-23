// 금속 배선 애니메이션 자막. 문장마다 출처 키. 그림: components/movie/scenes/metallization.jsx (검수 전)
export default {
  id: 'metallization',
  title: '금속 배선: 소자들을 전기가 통하는 길로 잇기',
  reviewed: false,
  scenes: [
    {
      id: 'why',
      title: '왜 배선이 필요한가',
      beats: [
        { text: '앞 공정들로 만든 소자(트랜지스터)는 그대로는 서로 신호를 주고받지 못합니다.', cite: ['samsung-8-7', 'hynix-fe-6'] },
        { text: '그래서 금속선으로 소자들을 연결합니다. 같은 소자라도 어떻게 잇느냐에 따라 CPU가 되기도, GPU가 되기도 합니다.', cite: ['samsung-8-7', 'hynix-fe-6'] },
      ],
    },
    {
      id: 'contact',
      title: '콘택: 소자와 배선의 연결부',
      beats: [
        { text: '절연막에 뚫은 깊은 구멍(콘택)은 알루미늄으로 잘 채워지지 않아, 텅스텐(W)으로 먼저 채웁니다.', cite: ['hynix-fe-6'] },
        { text: '금속이 실리콘과 섞여 접합부를 망가뜨리지 않도록, 둘 사이에 방지막을 넣습니다.', cite: ['samsung-8-7', 'hynix-fe-6'] },
        { text: '금속과 실리콘이 만나는 곳에는 실리사이드를 만들어 접촉 저항을 낮춥니다.', cite: ['hynix-fe-6'] },
      ],
    },
    {
      id: 'aluminum',
      title: '알루미늄 배선',
      beats: [
        { text: '알루미늄 배선은 금속막을 입히고, 포토로 무늬를 그린 뒤, 금속을 깎아 선을 만듭니다.', cite: ['hynix-fe-6'] },
        { text: '선 사이는 절연막으로 채웁니다. 알루미늄은 산화막과 잘 붙고 가공이 쉬워 오래 쓰였습니다.', cite: ['samsung-8-7', 'hynix-fe-6'] },
      ],
    },
    {
      id: 'copper',
      title: '구리 배선(다마신)과 CMP',
      beats: [
        { text: '구리는 깎기 어려워 순서를 바꿉니다. 절연막에 먼저 홈을 파고, 방지막과 씨앗층을 입힌 뒤 전기 도금으로 구리를 채웁니다.', cite: ['hynix-fe-6', 'hynix-fe-4'] },
        { text: '넘친 구리는 화학 작용과 기계적 연마를 함께 쓰는 CMP로 갈아냅니다. 높은 곳이 패드에 먼저 닿아 먼저 깎이면서 평평해집니다.', cite: ['hynix-fe-6', 'hynix-clean-cmp'] },
        { text: '구리는 산화막 속으로 퍼지기 쉬워, 탄탈럼(Ta) 방지막으로 감쌉니다.', cite: ['hynix-fe-6'] },
      ],
    },
    {
      id: 'multi',
      title: '여러 층으로 쌓인 배선',
      beats: [{ text: '배선은 여러 층으로 쌓이며, 위층으로 갈수록 선이 굵어집니다.', cite: ['hynix-fe-6'] }],
    },
  ],
}
