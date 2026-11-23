// 선 아이콘 (24px 기준, currentColor). 왼쪽 메뉴와 상단 막대에서 씁니다.
const P = {
  home: 'M4 11l8-7 8 7M6 9.5V20h12V9.5M10 20v-5h4v5',
  map: 'M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2zM9 4v14M15 6v14',
  fab: 'M4 20V9l5 3V9l5 3V6l6 3v11zM4 20h16',
  box: 'M12 3l8 4.5v9L12 21l-8-4.5v-9zM4 7.5l8 4.5 8-4.5M12 12v9',
  quiz: 'M9 4h6M9 4a1 1 0 00-1 1v1h8V5a1 1 0 00-1-1M6 6h12v15H6zM9 11l2 2 4-4M9 17h6',
  memo: 'M5 4h14v11l-5 5H5zM14 20v-5h5M8 9h8M8 13h5',
  rocket: 'M12 15l-3-3c1-4 4-8 10-9-1 6-5 9-9 10zM9 12l-4 1-2 3 4 1M12 15l-1 4 3 2 1-4M15 8.5h.01',
  chat: 'M4 5h16v11H9l-5 4z M8 9h8M8 12h5',
  chevron: 'M6 9l6 6 6-6',
  collapse: 'M14.5 6.5L9 12l5.5 5.5',
  menu: 'M4 6h16M4 12h16M4 18h16',
  moon: 'M20 14.5A8 8 0 019.5 4a7 7 0 1010.5 10.5z',
  focus: 'M4 9V4h5M15 4h5v5M20 15v5h-5M9 20H4v-5',
  shrink: 'M9 4v5H4M15 4v5h5M15 20v-5h5M9 20v-5H4',
  close: 'M6 6l12 12M18 6L6 18',
}

export default function Icon({ name, size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={P[name]} />
    </svg>
  )
}
