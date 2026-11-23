import { useEffect, useState } from 'react'
import { findPackage } from './data/packages.js'
import { findProcess } from './data/processes.js'
import { useStoredState } from './lib/storage.js'
import PackageSelect from './components/PackageSelect.jsx'
import FlowChart from './components/FlowChart.jsx'
import ProcessMap from './components/ProcessMap.jsx'
import FrontFlow from './components/FrontFlow.jsx'
import ProcessQuery from './components/ProcessQuery.jsx'
import ProcessSim from './components/ProcessSim.jsx'
import MachineSim from './components/MachineSim.jsx'
import QuizPage from './components/QuizPage.jsx'
import { machines } from './data/machineSim.js'
import AdvancedPackage from './components/AdvancedPackage.jsx'
import LineSim from './components/LineSim.jsx'
import FlowBar from './components/FlowBar.jsx'
import Home from './components/Home.jsx'
import { MENU_GROUPS } from './components/menu.js'
import { TermModeSwitch } from './lib/terms.jsx'
import FloatDock from './components/float/FloatDock.jsx'
import SelectionToNote from './components/notes/SelectionToNote.jsx'
import NotesPage from './components/notes/NotesPage.jsx'
import CoursePage from './components/CoursePage.jsx'
import WrittenQuiz from './components/WrittenQuiz.jsx'
import CasePractice from './components/CasePractice.jsx'
import FieldSim from './components/field/FieldSim.jsx'
import TodayPage from './components/TodayPage.jsx'
import StudyPlan from './components/StudyPlan.jsx'
import { markActive } from './lib/activity.js'
import { useEdit } from './lib/notes.js'
import Collapsible from './components/ui/Collapsible.jsx'
import { COURSES, courseStorageKey } from './data/courses.js'
import { writeStored } from './lib/storage.js'
import { setUi, useUi } from './lib/uiOpen.js'
import SideNav from './components/layout/SideNav.jsx'
import Icon from './components/layout/icons.jsx'
import { useTheme } from './lib/theme.js'

export default function App() {
  // 지금 보는 화면은 이 탭(sessionStorage)에만 기억합니다. 새로고침하면 보던 화면으로 돌아오고, 새 탭은 홈부터.
  const [screen, setScreenState] = useState(() => {
    try {
      return sessionStorage.getItem('tutor-screen') || 'home'
    } catch {
      return 'home'
    }
  })
  const setScreen = (next) => {
    setScreenState(next)
    try {
      sessionStorage.setItem('tutor-screen', next)
    } catch {
      // 저장 못 해도 화면 이동에는 영향 없음
    }
  }
  const [packageId, setPackageId] = useState(null)
  const [processId, setProcessId] = useState(null)
  const [lineProcessId, setLineProcessId] = useState(null)
  const [queryKey, setQueryKey] = useState(0)
  const [machineFocus, setMachineFocus] = useState(null)
  const [machineView, setMachineView] = useState(null)
  const ui = useUi()
  const [navOpen, setNavOpen] = useState(false)
  const [dark, setDark] = useTheme()

  // 모바일 메뉴 서랍: Esc로 닫고, 화면을 옮기면 맨 위로
  useEffect(() => {
    if (!navOpen) return
    const onKey = (event) => event.key === 'Escape' && setNavOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [navOpen])
  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [screen])
  // 어디서든 노트를 "페이지로 열기"하면 내 노트 화면으로 옮깁니다.
  const { pageId } = useEdit()
  useEffect(() => {
    if (pageId) setScreen('notes')
  }, [pageId])
  const [completed, setCompleted] = useStoredState('tutor.completed', [])
  const [, setReports] = useStoredState('tutor.reports', [])

  const pkg = findPackage(packageId)
  const studyingFront = screen === 'front' || screen === 'map' || (screen === 'query' && findProcess(processId)?.stage === 'front')
  const flowMode = screen === 'line' ? 'line' : studyingFront ? 'front' : 'learn'
  const activeId = flowMode === 'line' ? lineProcessId : processId
  // 공정 상세 화면은 그 공정의 단계에 맞는 영역 탭을 켭니다(전공정 공정이면 FAB 탭).
  const queryStage = screen === 'query' ? findProcess(processId)?.stage : null
  const activeGroup =
    (queryStage && MENU_GROUPS.find((group) => group.stages.includes(queryStage))) ||
    MENU_GROUPS.find((group) => group.items.some((item) => item.id === screen))
  // 공정 흐름 막대는 공정을 따라가는 화면에서만 보여줍니다.
  const showFlowBar = ['front', 'flow', 'query', 'line'].includes(screen)

  const activeItem = activeGroup?.items.find((item) => item.id === screen)

  // 노트·챗봇 창이 "지금 보고 있는 대상"으로 쓰는 값
  const refProcessId = screen === 'query' ? processId : screen === 'line' ? lineProcessId : null
  const refProcess = refProcessId ? findProcess(refProcessId) : null
  const refMachine = screen === 'machine-fab' || screen === 'machine-pkg' ? machines.find((m) => m.id === machineView) : null
  const currentRef = refProcess
    ? { kind: 'process', id: refProcess.id, label: refProcess.name.ko }
    : refMachine
      ? { kind: 'machine', id: refMachine.id, label: refMachine.name }
      : null
  const activeFlowName = findProcess(activeId)?.name.ko

  const openProcess = (id) => {
    setProcessId(id)
    setQueryKey((key) => key + 1)
    setScreen('query')
  }

  // 다른 화면(시험 해설 등)에서 특정 장비 시뮬레이터를 바로 엽니다.
  const openMachine = (id) => {
    setMachineFocus(id)
    setScreen(machines.find((m) => m.id === id)?.stage === 'front' ? 'machine-fab' : 'machine-pkg')
  }

  // 공정 상세의 "강의로 돌아가기"에서 씁니다. 그 단원을 골라 둔 채 강의가 있는 학습 화면으로 갑니다.
  const openCourse = (courseId, lessonId) => {
    if (lessonId) writeStored(courseStorageKey(courseId), lessonId)
    setScreen(COURSES[courseId].screen)
    window.scrollTo({ top: 0 })
  }

  // 공부 일정의 단원 열기: 공정 상세 / 영상 강의 단원 / 다른 화면
  const openUnit = (unit) => {
    const go = unit.go
    if (go.kind === 'process') openProcess(go.id)
    else if (go.kind === 'course') {
      writeStored(courseStorageKey(go.course), go.lesson)
      setScreen(go.course === 'basics' ? 'basics' : COURSES[go.course].screen)
    } else setScreen(go.screen)
  }

  const openPackage = (id) => {
    setPackageId(id)
    setScreen('package')
  }

  return (
    <div
      className={`app tutor-frame${ui.collapsed ? ' collapsed' : ''}${ui.focus ? ' focus-mode' : ''}${navOpen ? ' nav-open' : ''}`}
      data-area={activeGroup?.id ?? 'home'}
    >
      <SideNav
        screen={screen}
        activeGroup={activeGroup}
        collapsed={ui.collapsed}
        onGo={setScreen}
        onToggleCollapse={() => setUi({ collapsed: !ui.collapsed })}
        onClose={() => setNavOpen(false)}
        dark={dark}
        onDark={setDark}
      />
      {navOpen && <div className="side-scrim" onClick={() => setNavOpen(false)} aria-hidden="true" />}

      <div className="tutor-main">
      <header className="topbar">
        <button type="button" className="icon-btn topbar-menu" aria-label="메뉴 열기" onClick={() => setNavOpen(true)}>
          <Icon name="menu" />
        </button>
        <div className="topbar-title page-title-in" key={screen}>
          {activeGroup ? (
            <>
              <span className="crumb">{activeGroup.label}</span>
              <strong>{activeItem?.label ?? '공정 상세'}</strong>
              {activeItem?.desc && <small className="topbar-desc">{activeItem.desc}</small>}
            </>
          ) : (
            <>
              <span className="crumb">반도체 공정 튜터</span>
              <strong>홈</strong>
              <small className="topbar-desc">칩 설계부터 FAB · PKG·TEST · 보드 실장까지</small>
            </>
          )}
        </div>
        <div className="topbar-tools">
          <TermModeSwitch />
          <button
            type="button"
            className={ui.focus ? 'icon-btn focus-toggle active' : 'icon-btn focus-toggle'}
            aria-pressed={ui.focus}
            title={ui.focus ? '집중 모드 끄기' : '집중 모드: 메뉴·흐름 막대·아래 안내를 숨기고 본문만 봅니다'}
            onClick={() => setUi({ focus: !ui.focus })}
          >
            <Icon name={ui.focus ? 'shrink' : 'focus'} />
            <span>{ui.focus ? '집중 해제' : '집중 모드'}</span>
          </button>
        </div>
      </header>

      <div className={`app-body${['field', 'field-fab', 'field-pkg'].includes(screen) ? ' wide' : ''}`}>
      {showFlowBar && !ui.focus && !ui.flowbar && (
        <button type="button" className="flowbar-collapsed" aria-expanded="false" onClick={() => setUi({ flowbar: true })}>
          공정 흐름{activeFlowName ? ` · 현재: ${activeFlowName}` : ''} ▾ 펼치기
        </button>
      )}
      {showFlowBar && !ui.focus && ui.flowbar && (
        <div className="flowbar-wrap">
        <button type="button" className="link flowbar-fold" aria-expanded="true" onClick={() => setUi({ flowbar: false })} title="공정 흐름 막대 접기">
          ▴ 접기
        </button>
        <FlowBar
          pkg={pkg}
          activeId={activeId}
          mode={flowMode}
          completed={completed}
          onOpenProcess={openProcess}
          onChoosePackage={() => setScreen('package')}
        />
        </div>
      )}

      {/* 화면이 바뀌면 본문이 부드럽게 들어오고, 카드들이 차례로 떠오릅니다. */}
      <main key={screen === 'query' ? `query-${queryKey}` : screen} className="page-enter">
        {screen === 'package' && (
          <PackageSelect packageId={packageId} onSelect={setPackageId} onStart={() => setScreen('flow')} onOpenProcess={openProcess} />
        )}
        {screen === 'home' && <Home pkg={pkg} completed={completed} onGo={setScreen} onOpenProcess={openProcess} onOpenUnit={openUnit} />}
        {screen === 'plan' && <StudyPlan completed={completed} onOpenUnit={openUnit} />}
        {screen === 'map' && (
          <ProcessMap
            pkg={pkg}
            completed={completed}
            currentId={processId}
            onOpenProcess={openProcess}
            onChoosePackage={() => setScreen('package')}
          />
        )}
        {screen === 'front' && <FrontFlow completed={completed} currentId={processId} onOpenProcess={openProcess} />}
        {screen === 'flow' && (
          <CourseBlock courseId="pkg" onOpenProcess={openProcess} onGo={setScreen} />
        )}
        {screen === 'flow' && (
          <FlowChart
            pkg={pkg}
            completed={completed}
            currentId={processId}
            onOpenProcess={openProcess}
            onChangePackage={() => setScreen('package')}
            onStartLine={() => setScreen('line')}
          />
        )}
        {screen === 'query' && (
          <ProcessQuery
            key={queryKey}
            initialId={processId}
            pkg={pkg}
            completed={completed}
            onComplete={(id) => {
              markActive()
              setCompleted((list) => (list.includes(id) ? list : [...list, id]))
            }}
            onOpenProcess={setProcessId}
            onOpenMap={() => setScreen('map')}
            onOpenCourse={openCourse}
            onOpenField={(id, category) => {
              writeStored('tutor.field.open', id)
              setScreen(category === 'FAB' ? 'field-fab' : 'field-pkg')
            }}
            onReport={(id) => setReports((list) => [...list, { processId: id, at: new Date().toISOString() }])}
          />
        )}
        {screen === 'sim' && <ProcessSim />}
        {(screen === 'machine-fab' || screen === 'machine-pkg') && (
          <MachineSim
            key={`${screen}-${machineFocus ?? 'default'}`}
            area={screen === 'machine-fab' ? 'front' : 'back'}
            initialId={machineFocus}
            onOpenProcess={openProcess}
            onMachineChange={setMachineView}
          />
        )}
        {['quiz', 'wrong', 'ai'].includes(screen) && <QuizPage view={screen} onOpenProcess={openProcess} onOpenMachine={openMachine} />}
        {screen === 'line' && (
          <LineSim
            key={packageId}
            pkg={pkg}
            onLearn={openProcess}
            onChangePackage={() => setScreen('package')}
            onActiveChange={setLineProcessId}
          />
        )}
        {screen === 'written' && <WrittenQuiz onOpenProcess={openProcess} />}
        {screen === 'cases' && <CasePractice onOpenProcess={openProcess} onOpenMachine={openMachine} />}
        {['field', 'field-fab', 'field-pkg'].includes(screen) && (
          <FieldSim key={screen} tab={screen === 'field-fab' ? 'FAB' : screen === 'field-pkg' ? 'PKG' : 'ALL'} onOpenProcess={openProcess} onOpenMachine={openMachine} onGo={setScreen} />
        )}
        {screen === 'today' && <TodayPage pkg={pkg} completed={completed} onGo={setScreen} onOpenProcess={openProcess} onOpenUnit={openUnit} />}
        {screen === 'notes' && <NotesPage onOpenProcess={openProcess} />}
        {screen === 'basics' && <CoursePage key="basics" courseId="basics" onOpenProcess={openProcess} onGo={setScreen} />}
        {screen === 'advanced' && <CourseBlock courseId="adv" onOpenProcess={openProcess} onGo={setScreen} />}
        {screen === 'advanced' && <AdvancedPackage onOpenProcess={openProcess} onOpenPackage={openPackage} />}
      </main>

      {!ui.focus && <footer className="disclaimer">
        모든 설명과 시뮬레이션 규칙은 검수 전 교육용 초안입니다. 출처가 등록되기 전까지 학습 참고용으로만 쓰세요.
      </footer>}
      </div>

      </div>

      <SelectionToNote currentRef={currentRef} />
      <FloatDock currentRef={currentRef} onOpenProcess={openProcess} onOpenMachine={openMachine} />
    </div>
  )
}

// 학습 화면 맨 위에 넣는 영상 강의 상자. 접어 두면 아래 학습 내용만 봅니다.
function CourseBlock({ courseId, onOpenProcess, onGo }) {
  const course = COURSES[courseId]
  return (
    <section className="screen course-block">
      <Collapsible id={`course.${courseId}`} title={`🎬 영상으로 배우기 · ${course.title}`} badge={`${course.lessons.length}단원`}>
        <CoursePage key={courseId} courseId={courseId} embedded onOpenProcess={onOpenProcess} onGo={onGo} />
      </Collapsible>
    </section>
  )
}
