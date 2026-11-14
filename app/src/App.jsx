import { useState } from 'react'
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

export default function App() {
  const [screen, setScreen] = useState('home')
  const [packageId, setPackageId] = useState(null)
  const [processId, setProcessId] = useState(null)
  const [lineProcessId, setLineProcessId] = useState(null)
  const [queryKey, setQueryKey] = useState(0)
  const [machineFocus, setMachineFocus] = useState(null)
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

  const openPackage = (id) => {
    setPackageId(id)
    setScreen('package')
  }

  return (
    <div className="app" data-area={activeGroup?.id ?? 'home'}>
      <header className="app-header">
        <div className="app-bar">
          <button type="button" className="app-brand" onClick={() => setScreen('home')}>
            <span aria-hidden="true">◆</span> 반도체 공정 튜터
          </button>
          <nav className="top-tabs" aria-label="메뉴">
            <button
              type="button"
              className={screen === 'home' ? 'top-tab active' : 'top-tab'}
              aria-current={screen === 'home' ? 'page' : undefined}
              onClick={() => setScreen('home')}
            >
              홈
            </button>
            {MENU_GROUPS.map((group) => (
              <button
                key={group.id}
                type="button"
                className={group === activeGroup ? 'top-tab active' : 'top-tab'}
                onClick={() => setScreen(group.items[0].id)}
              >
                {group.label}
              </button>
            ))}
          </nav>
          <TermModeSwitch />
        </div>
        <div className="app-subbar">
        {activeGroup ? (
          <nav className="subtabs" aria-label={`${activeGroup.label} 화면`}>
            <span className="area-label">
              <span aria-hidden="true">{activeGroup.icon}</span> {activeGroup.label}
              <small>{activeGroup.en}</small>
            </span>
            {activeGroup.items.map((item) => (
              <button
                key={item.id}
                type="button"
                className={screen === item.id ? 'subtab active' : 'subtab'}
                aria-current={screen === item.id ? 'page' : undefined}
                title={item.desc}
                onClick={() => setScreen(item.id)}
              >
                {item.label}
              </button>
            ))}
          </nav>
        ) : (
          <p className="subbar-note">칩 설계부터 FAB · PKG·TEST · 보드 실장까지</p>
        )}
        </div>
      </header>

      <div className="app-body">
      {showFlowBar && (
        <FlowBar
          pkg={pkg}
          activeId={activeId}
          mode={flowMode}
          completed={completed}
          onOpenProcess={openProcess}
          onChoosePackage={() => setScreen('package')}
        />
      )}

      <main>
        {screen === 'package' && (
          <PackageSelect packageId={packageId} onSelect={setPackageId} onStart={() => setScreen('flow')} />
        )}
        {screen === 'home' && <Home pkg={pkg} completed={completed} onGo={setScreen} onOpenProcess={openProcess} />}
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
            onComplete={(id) => setCompleted((list) => (list.includes(id) ? list : [...list, id]))}
            onOpenProcess={setProcessId}
            onOpenMap={() => setScreen('map')}
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
        {screen === 'advanced' && <AdvancedPackage onOpenProcess={openProcess} onOpenPackage={openPackage} />}
      </main>

      <footer className="disclaimer">
        모든 설명과 시뮬레이션 규칙은 검수 전 교육용 초안입니다. 출처가 등록되기 전까지 학습 참고용으로만 쓰세요.
      </footer>
      </div>
    </div>
  )
}
