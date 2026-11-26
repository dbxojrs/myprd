import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { findPackage } from './data/packages.js'
import { findProcess } from './data/processes.js'
import { useStoredState } from './lib/storage.js'
import PackageSelect from './components/PackageSelect.jsx'
import FlowChart from './components/FlowChart.jsx'
import ProcessMap from './components/ProcessMap.jsx'
import FrontFlow from './components/FrontFlow.jsx'
import ProcessQuery from './components/ProcessQuery.jsx'
import { machines } from './data/machineSim.js'
import FlowBar from './components/FlowBar.jsx'
import Home from './components/Home.jsx'
import { MENU_GROUPS } from './components/menu.js'
import { TermModeSwitch } from './lib/terms.jsx'
import FloatDock from './components/float/FloatDock.jsx'
import SelectionToNote from './components/notes/SelectionToNote.jsx'
import CoursePage from './components/CoursePage.jsx'
import TodayPage from './components/TodayPage.jsx'
import { markActive } from './lib/activity.js'
import { useEdit } from './lib/notes.js'
import Collapsible from './components/ui/Collapsible.jsx'
import { COURSES, courseStorageKey } from './data/courses.js'
import { writeStored } from './lib/storage.js'
import { setUi, useUi } from './lib/uiOpen.js'
import SideNav from './components/layout/SideNav.jsx'
import Icon from './components/layout/icons.jsx'
import { useTheme } from './lib/theme.js'
import { togglePanel } from './lib/floatState.js'
import { pushNav, readHash, replaceNav, useBackLayer, useCanGoBack } from './lib/nav.js'
import { closePeek, openMachinePeek, openPeek } from './lib/peek.js'
import ProcessPeek from './components/ProcessPeek.jsx'

// 설명 버튼을 미리보기 창으로 여는 화면(진행 중인 일이 있는 화면)
const PEEK_SCREENS = new Set(['quiz', 'wrong', 'ai', 'written', 'cases', 'machine-fab', 'machine-pkg', 'fab-sim', 'sim', 'line', 'field', 'field-fab', 'field-pkg', 'defects', 'report', 'datalab', 'analytics', 'notes'])

// 큰 화면은 처음 열 때 나눠 받습니다(첫 로딩을 가볍게). 첫 화면이 뜬 뒤 쉬는 시간에 미리 받아 두어 이동할 때 기다리지 않습니다.
const LOADERS = [
  () => import('./components/ProcessSim.jsx'),
  () => import('./components/MachineSim.jsx'),
  () => import('./components/QuizPage.jsx'),
  () => import('./components/AdvancedPackage.jsx'),
  () => import('./components/LineSim.jsx'),
  () => import('./components/notes/NotesPage.jsx'),
  () => import('./components/WrittenQuiz.jsx'),
  () => import('./components/CasePractice.jsx'),
  () => import('./components/field/FieldSim.jsx'),
  () => import('./components/analysis/DataLab.jsx'),
  () => import('./components/fab/FabProcessSim.jsx'),
  () => import('./components/analysis/DefectAtlas.jsx'),
  () => import('./components/analysis/LearningAnalytics.jsx'),
  () => import('./components/report/EngineerReport.jsx'),
  () => import('./components/StudyPlan.jsx'),
]
const ProcessSim = lazy(LOADERS[0])
const MachineSim = lazy(LOADERS[1])
const QuizPage = lazy(LOADERS[2])
const AdvancedPackage = lazy(LOADERS[3])
const LineSim = lazy(LOADERS[4])
const NotesPage = lazy(LOADERS[5])
const WrittenQuiz = lazy(LOADERS[6])
const CasePractice = lazy(LOADERS[7])
const FieldSim = lazy(LOADERS[8])
const DataLab = lazy(LOADERS[9])
const FabProcessSim = lazy(LOADERS[10])
const DefectAtlas = lazy(LOADERS[11])
const LearningAnalytics = lazy(LOADERS[12])
const EngineerReport = lazy(LOADERS[13])
const StudyPlan = lazy(LOADERS[14])

export default function App() {
  // 지금 보는 화면은 주소(#/화면)와 이 탭(sessionStorage)에 기억합니다. 새로고침하면 보던 화면으로 돌아오고, 새 탭은 홈부터.
  // 화면을 옮길 때마다 브라우저 기록을 남겨, "뒤로 가기"가 앱 안의 이전 화면으로 갑니다(lib/nav.js).
  const [initial] = useState(() => {
    const fromHash = readHash()
    if (fromHash) return fromHash
    try {
      return { screen: sessionStorage.getItem('tutor-screen') || 'home', processId: null }
    } catch {
      return { screen: 'home', processId: null }
    }
  })
  const [screen, setScreenState] = useState(initial.screen)
  const [packageId, setPackageId] = useState(null)
  const [processId, setProcessId] = useState(initial.processId)
  const processRef = useRef(processId)
  processRef.current = processId
  const remember = (next) => {
    try {
      sessionStorage.setItem('tutor-screen', next)
    } catch {
      // 저장 못 해도 화면 이동에는 영향 없음
    }
  }
  const setScreen = (next, pid = processId) => {
    setScreenState(next)
    remember(next)
    pushNav({ screen: next, processId: pid })
  }
  const [lineProcessId, setLineProcessId] = useState(null)
  const [queryKey, setQueryKey] = useState(0)
  const [machineFocus, setMachineFocus] = useState(null)
  const [machineView, setMachineView] = useState(null)
  const ui = useUi()
  const [navOpen, setNavOpen] = useState(false)
  const [dark, setDark] = useTheme()
  const canBack = useCanGoBack()

  // 모바일 메뉴 서랍: Esc로 닫고, 화면을 옮기면 맨 위로
  useEffect(() => {
    if (!navOpen) return
    const onKey = (event) => event.key === 'Escape' && setNavOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [navOpen])
  useEffect(() => {
    window.scrollTo({ top: 0 })
    closePeek()
  }, [screen])
  // 첫 화면이 뜬 뒤 브라우저가 한가할 때 나머지 화면 코드를 미리 받아 둡니다.
  useEffect(() => {
    const idle = window.requestIdleCallback ?? ((fn) => setTimeout(fn, 1200))
    idle(() => LOADERS.forEach((load) => load().catch(() => {})))
  }, [])
  // 메뉴 서랍은 뒤로 가기로 닫습니다.
  useBackLayer(navOpen, () => setNavOpen(false), 'nav', { transient: true })
  // 처음 열 때 지금 화면을 기록에 적고, 뒤로·앞으로 가기를 하면 그 기록의 화면으로 돌아갑니다.
  useEffect(() => {
    if (!history.state?.tutor) replaceNav({ screen: initial.screen, processId: initial.processId })
    const onPop = (event) => {
      const st = event.state?.tutor ? event.state : readHash()
      if (!st) return
      setScreenState(st.screen)
      remember(st.screen)
      if (st.screen === 'query' && st.processId) {
        if (processRef.current !== st.processId) setQueryKey((key) => key + 1)
        setProcessId(st.processId)
      }
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [initial])
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
  // 공정 검색 첫 화면(아직 공정을 고르지 않음)에서는 흐름 막대를 숨깁니다.
  const showFlowBar = ['front', 'flow', 'line'].includes(screen) || (screen === 'query' && Boolean(processId))

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

  // 공정 설명 화면으로 옮깁니다.
  const goProcess = (id) => {
    setProcessId(id)
    setQueryKey((key) => key + 1)
    setScreen('query', id)
  }
  // 진행 중인 화면(문제풀이·설비 실습·시나리오 등)에서는 화면을 옮기지 않고 설명 미리보기 창을 띄웁니다.
  // 학습 화면(이론 학습·공정 검색·흐름도)에서는 지금처럼 설명 화면으로 옮깁니다.
  const openProcess = (id) => (PEEK_SCREENS.has(screen) ? openPeek(id) : goProcess(id))

  // 다른 화면(시험 해설 등)에서 특정 장비 시뮬레이터를 바로 엽니다.
  const goMachine = (id) => {
    setMachineFocus(id)
    setScreen(machines.find((m) => m.id === id)?.stage === 'front' ? 'machine-fab' : 'machine-pkg')
  }
  // 진행 중인 화면에서는 장비 둘러보기를 미리보기 창으로 띄웁니다(설비 실습 화면 자체에서는 그대로 이동).
  const openMachine = (id) => (PEEK_SCREENS.has(screen) && !['machine-fab', 'machine-pkg'].includes(screen) ? openMachinePeek(id) : goMachine(id))

  // 다른 화면(도감·분석·보고서)에서 현장 실무 시나리오 하나를 바로 엽니다.
  const openField = (id, category) => {
    writeStored('tutor.field.open', id)
    setScreen(category === 'FAB' ? 'field-fab' : 'field-pkg')
    window.scrollTo({ top: 0 })
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
    if (go.kind === 'process') goProcess(go.id)
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
        {/* 앱 안에 이전 화면이 있을 때만 보입니다(처음 들어온 화면에서는 숨겨 앱 밖으로 나가지 않게). */}
        {canBack && (
          <button type="button" className="topbar-back" aria-label="이전 화면으로" title="이전 화면으로 (브라우저 뒤로 가기와 같음)" onClick={() => history.back()}>
            <span aria-hidden="true">←</span>
            <span className="topbar-back-text">뒤로</span>
          </button>
        )}
        <div className="topbar-title page-title-in" key={screen}>
          {activeGroup ? (
            <>
              <span className="crumb">{activeGroup.label}</span>
              {/* 화면 설명은 본문 머리에 있으므로 위 막대에는 제목만 둡니다(마우스를 올리면 설명). */}
              <strong title={activeItem?.desc}>{activeItem?.label ?? '공정 상세'}</strong>
            </>
          ) : (
            <>
              <span className="crumb">반도체 공정 튜터</span>
              <strong>홈</strong>
            </>
          )}
        </div>
        <div className="topbar-tools">
          <TermModeSwitch />
          {/* 휴대폰: 떠 있는 동그라미 대신 위 막대에서 노트·질문하기를 엽니다(본문을 가리지 않게). */}
          <button type="button" className="icon-btn topbar-float" aria-label="노트 열기" title="노트" onClick={() => togglePanel('notes')}>
            <Icon name="memo" />
          </button>
          <button type="button" className="icon-btn topbar-float" aria-label="질문하기 열기" title="질문하기" onClick={() => togglePanel('chat')}>
            <Icon name="chat" />
          </button>
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

      <div className={`app-body${['field', 'field-fab', 'field-pkg', 'report', 'fab-sim'].includes(screen) ? ' wide' : ''}`}>
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
      <Suspense fallback={<PageSkeleton />}>
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
            onOpenProcess={(id) => {
              setProcessId(id)
              pushNav({ screen: 'query', processId: id })
            }}
            onOpenMap={() => setScreen('map')}
            onOpenCourse={openCourse}
            onOpenField={openField}
            onReport={(id) => setReports((list) => [...list, { processId: id, at: new Date().toISOString() }])}
          />
        )}
        {screen === 'fab-sim' && <FabProcessSim onOpenProcess={openProcess} onOpenMachine={openMachine} />}
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
        {screen === 'datalab' && <DataLab onOpenField={openField} />}
        {screen === 'defects' && <DefectAtlas onOpenMachine={openMachine} onOpenProcess={openProcess} onOpenField={openField} />}
        {screen === 'report' && <EngineerReport onOpenField={openField} />}
        {screen === 'analytics' && <LearningAnalytics completed={completed} onGo={setScreen} onOpenField={openField} />}
        {screen === 'today' && <TodayPage pkg={pkg} completed={completed} onGo={setScreen} onOpenProcess={openProcess} onOpenUnit={openUnit} />}
        {screen === 'notes' && <NotesPage onOpenProcess={openProcess} />}
        {screen === 'basics' && <CoursePage key="basics" courseId="basics" onOpenProcess={openProcess} onGo={setScreen} />}
        {screen === 'advanced' && <CourseBlock courseId="adv" onOpenProcess={openProcess} onGo={setScreen} />}
        {screen === 'advanced' && <AdvancedPackage onOpenProcess={openProcess} onOpenPackage={openPackage} />}
      </main>
      </Suspense>

      {!ui.focus && <footer className="disclaimer">
        모든 설명과 시뮬레이션 규칙은 검수 전 교육용 초안입니다. 출처가 등록되기 전까지 학습 참고용으로만 쓰세요.
      </footer>}
      </div>

      </div>

      <ProcessPeek onNavigate={goProcess} onNavigateMachine={goMachine} />
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

// 화면 코드를 받는 동안 빈 화면 대신 보여 주는 뼈대
function PageSkeleton() {
  return (
    <div className="page-skeleton" role="status" aria-label="화면을 불러오는 중">
      <div className="sk sk-title" />
      <div className="sk sk-line" />
      <div className="sk-grid">
        <div className="sk sk-card" />
        <div className="sk sk-card" />
        <div className="sk sk-card" />
      </div>
    </div>
  )
}
