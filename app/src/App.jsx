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
  const [completed, setCompleted] = useStoredState('tutor.completed', [])
  const [, setReports] = useStoredState('tutor.reports', [])

  const pkg = findPackage(packageId)
  const studyingFront = screen === 'front' || screen === 'map' || (screen === 'query' && findProcess(processId)?.stage === 'front')
  const flowMode = screen === 'line' ? 'line' : studyingFront ? 'front' : 'learn'
  const activeId = flowMode === 'line' ? lineProcessId : processId

  const openProcess = (id) => {
    setProcessId(id)
    setQueryKey((key) => key + 1)
    setScreen('query')
  }

  const openPackage = (id) => {
    setPackageId(id)
    setScreen('package')
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-title">
          <h1>패키징 공정 튜터</h1>
          <TermModeSwitch />
        </div>
        <nav className="nav">
          <button
            type="button"
            className={screen === 'home' ? 'nav-item nav-active' : 'nav-item'}
            aria-current={screen === 'home' ? 'page' : undefined}
            onClick={() => setScreen('home')}
          >
            🏠 홈
          </button>
          {MENU_GROUPS.map((group) => (
            <div key={group.id} className="nav-group" role="group" aria-label={group.label}>
              <span className="nav-group-label">{group.label}</span>
              {group.items.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={screen === item.id ? 'nav-item nav-active' : 'nav-item'}
                  aria-current={screen === item.id ? 'page' : undefined}
                  onClick={() => setScreen(item.id)}
                >
                  {item.label}
                </button>
              ))}
            </div>
          ))}
        </nav>
      </header>

      {screen !== 'home' && (
        <FlowBar
          pkg={pkg}
          activeId={activeId}
          mode={flowMode}
          completed={completed}
          onOpenProcess={openProcess}
          onChoosePackage={() => setScreen('package')}
        />
      )}

      <p className="disclaimer">
        모든 설명과 시뮬레이션 규칙은 검수 전 교육용 초안입니다. 출처가 등록되기 전까지 학습 참고용으로만 쓰세요.
      </p>

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
        {screen === 'machine' && <MachineSim onOpenProcess={openProcess} />}
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
    </div>
  )
}
