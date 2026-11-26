// CMP 애니메이션 자막. 문장마다 출처 키. 그림: components/movie/scenes/cmp.jsx (검수 전)
export default {
  id: 'cmp',
  title: 'CMP: 울퉁불퉁한 표면을 평평하게',
  reviewed: false,
  scenes: [
    {
      id: 'why',
      title: '왜 평평하게 할까',
      beats: [
        { text: '막을 여러 번 쌓으면 웨이퍼 표면이 울퉁불퉁해집니다. CMP는 이 표면을 갈아 평평하게 만듭니다.', cite: ['hynix-clean-cmp'] },
        { text: '표면의 단차가 심하면 포토 공정과 증착·식각 공정에 문제가 생기는데, CMP가 이 단차를 없애 줍니다.', cite: ['sandia-cmp-design'] },
        { text: '높이 솟은 곳이 더 큰 압력을 받아 먼저 깎이기 때문에 표면이 점점 평평해집니다.', cite: ['hynix-clean-cmp', 'sandia-cmp-design'] },
      ],
    },
    {
      id: 'tool',
      title: '패드 · 헤드 · 슬러리',
      beats: [
        { text: '웨이퍼는 홈이 파인 폴리우레탄 패드에 일정한 힘으로 눌립니다.', cite: ['seo-cmp-review'] },
        { text: '웨이퍼를 패드에 눌러 돌리면서, 연마 입자와 약품이 섞인 슬러리를 뿌려 함께 갈아 냅니다.', cite: ['hynix-clean-cmp', 'sandia-cmp-design'] },
        { text: '프레스턴 식에 따르면 깎이는 속도는 계수 × 압력 × 상대 속도입니다. 누르는 힘이나 속도를 키우면 더 빨리 깎입니다.', cite: ['seo-cmp-review'] },
      ],
    },
    {
      id: 'damascene',
      title: '다마신과 디싱',
      beats: [
        { text: '다마신은 홈에 구리 같은 재료를 넘치게 채운 뒤, 넘친 부분을 CMP로 갈아 내는 방식입니다.', cite: ['sandia-cmp-design'] },
        { text: '구리와 배리어를 확실히 걷어 내려고 더 가는 과연마 단계에서 디싱과 이로전이 크게 생길 수 있습니다.', cite: ['mit-cmp-pattern'] },
        { text: '디싱은 금속 배선이 접시처럼 오목하게 패이는 불량입니다.', cite: ['mit-cmp-pattern'] },
      ],
    },
    {
      id: 'after',
      title: 'CMP 후 세정',
      beats: [
        { text: '남은 입자·이물·긁힘 같은 결함을 연마 중에 모두 막을 수는 없어서, CMP 후 세정이 꼭 필요합니다.', cite: ['seo-cmp-review'] },
        { text: '연마가 끝나면 브러시로 습식 세정을 해서 남은 물질을 없애고, 이어서 건조합니다.', cite: ['hynix-clean-cmp'] },
      ],
    },
  ],
}
