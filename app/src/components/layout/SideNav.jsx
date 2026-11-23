import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { MENU_GROUPS } from '../menu.js'
import { useOpen } from '../../lib/uiOpen.js'
import { togglePanel, useFloat } from '../../lib/floatState.js'
import Icon from './icons.jsx'
import { TermModeSwitch } from '../../lib/terms.jsx'
import AccountBox from './AccountBox.jsx'

// 왼쪽 메뉴: 흰 사이드바 + 영역별 묶음(펼치고 접기) + 아래쪽 노트·질문하기·다크 모드.
// 데스크톱은 접으면 아이콘만(60px), 모바일은 ☰로 여는 서랍입니다.
const GROUP_ICON = { overview: 'map', fab: 'fab', pkg: 'box', exam: 'quiz', mine: 'memo', deep: 'rocket' }

export default function SideNav({ screen, activeGroup, collapsed, onGo, onToggleCollapse, onClose, dark, onDark }) {
  const float = useFloat()
  const navRef = useRef(null)
  const hlRef = useRef(null)
  useSlidingHighlight(navRef, hlRef, [screen, collapsed, activeGroup?.id])
  const go = (id) => {
    onGo(id)
    onClose?.()
  }
  return (
    <nav className="side" aria-label="메뉴" ref={navRef}>
      <span className="side-hl" ref={hlRef} aria-hidden="true" />
      <div className="side-top">
        <button type="button" className="side-brand" onClick={() => go('home')} title="홈">
          <span className="side-logo" aria-hidden="true">
            ◆
          </span>
          <span className="side-text side-brand-text">
            반도체 공정 튜터
            <small>FAB · PKG · TEST</small>
          </span>
        </button>
        <button
          type="button"
          className="icon-btn side-col"
          title={collapsed ? '메뉴 펴기' : '메뉴 접기'}
          aria-label={collapsed ? '메뉴 펴기' : '메뉴 접기'}
          aria-expanded={!collapsed}
          onClick={onToggleCollapse}
        >
          <Icon name="collapse" />
        </button>
        <button type="button" className="icon-btn side-close" aria-label="메뉴 닫기" onClick={onClose}>
          <Icon name="close" />
        </button>
      </div>

      <button
        type="button"
        className={`side-item nav${screen === 'home' ? ' active' : ''}`}
        aria-current={screen === 'home' ? 'page' : undefined}
        onClick={() => go('home')}
        title="홈: 이어서 공부하기 · 전체 메뉴"
      >
        <Icon name="home" />
        <span className="side-text">
          홈<small>이어서 공부하기 · 전체 메뉴</small>
        </span>
      </button>

      <span className="side-label">공부</span>
      {MENU_GROUPS.map((group) => (
        <SideGroup key={group.id} group={group} screen={screen} active={group === activeGroup} collapsed={collapsed} onGo={go} />
      ))}

      <div className="side-bottom">
        <AccountBox />
        <span className="side-label">도구</span>
        <button type="button" className={`side-item${float.open.notes ? ' on' : ''}`} onClick={() => togglePanel('notes')} title="노트 창 열기·닫기 (Alt+N)">
          <Icon name="memo" />
          <span className="side-text">노트</span>
          <kbd className="side-text">Alt N</kbd>
        </button>
        <button type="button" className={`side-item${float.open.chat ? ' on' : ''}`} onClick={() => togglePanel('chat')} title="질문하기 창 열기·닫기 (Alt+K)">
          <Icon name="chat" />
          <span className="side-text">질문하기</span>
          <kbd className="side-text">Alt K</kbd>
        </button>
        <div className="side-terms">
          <TermModeSwitch />
        </div>
        <button type="button" role="switch" aria-checked={dark} className="side-item toggle" onClick={() => onDark(!dark)} title={dark ? '밝은 화면으로' : '어두운 화면으로'}>
          <Icon name="moon" />
          <span className="side-text">다크 모드</span>
          <span className="switch side-text" aria-hidden="true" />
        </button>
      </div>
    </nav>
  )
}

function SideGroup({ group, screen, active, collapsed, onGo }) {
  // 기본은 지금 보는 영역만 펼칩니다. 직접 펼친 묶음은 기억합니다.
  const [open, setOpen] = useOpen(`nav.${group.id}`, false)
  // 지금 영역은 늘 펼쳐 보이되, 사용자가 접으면 그 영역을 떠날 때까지 접어 둡니다.
  const [foldActive, setFoldActive] = useState(false)
  useEffect(() => setFoldActive(false), [active])
  const shown = active ? !foldActive : open
  return (
    <div className={`side-group${active ? ' active' : ''}`}>
      <button
        type="button"
        className={`side-item group-h${active ? ' active' : ''}${shown ? ' open' : ''}`}
        aria-expanded={shown}
        title={`${group.label} (${group.en}): ${group.desc}`}
        onClick={() => (collapsed ? onGo(group.items[0].id) : active ? setFoldActive(!foldActive) : setOpen(!open))}
      >
        <Icon name={GROUP_ICON[group.id] ?? 'box'} />
        <span className="side-text">{group.label}</span>
        <span className="chev side-text">
          <Icon name="chevron" size={16} />
        </span>
      </button>
      {!collapsed && (
        <div className={`side-sub-wrap${shown ? ' open' : ''}`} inert={!shown}>
        <div className="side-sub">
          {group.items.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`side-item sm${screen === item.id ? ' active' : ''}`}
              aria-current={screen === item.id ? 'page' : undefined}
              title={item.desc}
              onClick={() => onGo(item.id)}
            >
              <span className="dot" aria-hidden="true" />
              <span className="side-text">{item.label}</span>
            </button>
          ))}
        </div>
        </div>
      )}
    </div>
  )
}

// 고른 메뉴의 바탕이 메뉴 사이를 미끄러지듯 따라갑니다(계약서 대조 캔버스의 메뉴 움직임과 같은 방식).
// 메뉴가 펼쳐지거나 접혀 위치가 바뀌어도 따라갑니다.
function useSlidingHighlight(navRef, hlRef, deps) {
  useLayoutEffect(() => {
    const nav = navRef.current
    const hl = hlRef.current
    if (!nav || !hl) return
    let frame = 0
    const place = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        // 세부 메뉴 → 홈 → (접혀 있으면) 영역 제목 순으로 찾습니다.
        const target =
          nav.querySelector('.side-sub-wrap.open .side-item.sm.active') ??
          nav.querySelector('.side-item.nav.active') ??
          nav.querySelector('.side-item.group-h.active')
        if (!target) {
          hl.style.opacity = '0'
          return
        }
        hl.style.opacity = '1'
        // 메뉴 안쪽 기준 위치 (메뉴가 스크롤돼도 맞게)
        const box = target.getBoundingClientRect()
        const base = nav.getBoundingClientRect()
        const x = box.left - base.left + nav.scrollLeft - nav.clientLeft
        const y = box.top - base.top + nav.scrollTop - nav.clientTop
        hl.style.transform = `translate(${x}px, ${y}px)`
        hl.style.width = `${box.width}px`
        hl.style.height = `${box.height}px`
        // 처음 자리 잡을 때는 움직이지 않고, 그다음부터 미끄러집니다.
        if (!hl.classList.contains('ready')) requestAnimationFrame(() => hl.classList.add('ready'))
      })
    }
    place()
    const mo = new MutationObserver(place)
    mo.observe(nav, { subtree: true, childList: true, attributes: true, attributeFilter: ['class'] })
    const ro = new ResizeObserver(place)
    ro.observe(nav)
    nav.addEventListener('transitionend', place)
    return () => {
      cancelAnimationFrame(frame)
      mo.disconnect()
      ro.disconnect()
      nav.removeEventListener('transitionend', place)
    }
  }, deps) // eslint-disable-line react-hooks/exhaustive-deps
}
