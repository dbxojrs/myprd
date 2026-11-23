// 웨이퍼 제조 애니메이션 자막. 문장마다 출처 키. 그림: components/movie/scenes/wafer-make.jsx (검수 전)
export default {
  id: 'wafer-make',
  title: '웨이퍼 제조: 모래에서 거울 같은 원판까지',
  reviewed: false,
  scenes: [
    {
      id: 'silicon',
      title: '재료: 실리콘',
      beats: [
        { text: '웨이퍼의 주재료는 모래에서 얻는 실리콘입니다. 양이 많아 구하기 쉽고 독성이 없습니다.', cite: ['samsung-8-1'] },
        { text: '실리콘을 아주 높은 순도로 정제한 뒤, 높은 온도에서 녹입니다.', cite: ['samsung-8-1', 'hynix-epitaxy'] },
      ],
    },
    {
      id: 'ingot',
      title: '결정 기둥(잉곳) 키우기',
      beats: [
        { text: '녹은 실리콘에 작은 씨앗 결정을 담갔다가 천천히 끌어올리면, 원자가 가지런히 늘어선 기둥(잉곳)이 자랍니다.', cite: ['siltronic-wafers', 'samsung-8-1'] },
        { text: '이 방법을 초크랄스키(CZ)법이라고 하며, 대부분의 단결정 실리콘을 이렇게 만듭니다.', cite: ['siltronic-wafers'] },
        { text: '반도체용 잉곳은 순도가 거의 100%에 가까워야 합니다.', cite: ['samsung-8-1', 'hynix-epitaxy'] },
      ],
    },
    {
      id: 'slice',
      title: '얇게 썰기',
      beats: [
        { text: '잉곳을 일정한 두께로 얇게 썰어 둥근 판, 웨이퍼를 만듭니다. 여러 가닥의 와이어 톱으로 한 번에 수백 장을 자르기도 합니다.', cite: ['samsung-8-1', 'siltronic-wafers'] },
        { text: '웨이퍼 지름은 잉곳 지름이 정합니다. 150mm(6인치), 200mm(8인치), 300mm(12인치)가 있고, 클수록 한 번에 칩을 많이 만듭니다.', cite: ['samsung-8-1'] },
      ],
    },
    {
      id: 'polish',
      title: '갈고 닦기',
      beats: [
        { text: '자른 직후의 표면은 거칠고 손상돼 있어, 갈아 내고 연마액과 연마 장비로 매끈하게 다듬습니다.', cite: ['samsung-8-1', 'siltronic-wafers'] },
        { text: '아무 공정도 거치지 않은 이 매끈한 웨이퍼를 베어 웨이퍼라고 하며, 이제 반도체 공장(FAB)으로 보냅니다.', cite: ['samsung-8-1', 'hynix-101'] },
      ],
    },
    {
      id: 'parts',
      title: '웨이퍼 부위 이름',
      beats: [
        { text: '웨이퍼 위 네모 하나하나가 칩(다이)이 되고, 칩 사이의 좁은 틈은 나중에 자를 길(스크라이브 라인)입니다.', cite: ['samsung-8-1'] },
        { text: '결정 방향을 알려 주는 표시로 한쪽을 평평하게 깎은 플랫존이나 작은 홈인 노치를 둡니다. 노치를 쓰면 칩을 더 많이 얻을 수 있습니다.', cite: ['samsung-8-1', 'siltronic-wafers'] },
      ],
    },
  ],
}
