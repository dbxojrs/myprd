import { useState } from 'react'
import { findPackage } from './data/packages.js'
import { findProcess } from './data/processes.js'
import { useStoredState } from './lib/storage.js'
import PackageSelect from './components/PackageSelect.jsx'
import FlowChart from './components/FlowChart.jsx'
import FrontFlow from './components/FrontFlow.jsx'
import ProcessQuery from './components/ProcessQuery.jsx'
import ProcessSim from './components/ProcessSim.jsx'
import AdvancedPackage from './components/AdvancedPackage.jsx'
import LineSim from './components/LineSim.jsx'
import FlowBar from './components/FlowBar.jsx'
import { TermModeSwitch } from './lib/terms.jsx'

// 메뉴는 실제 공정 순서(전공정 → 패키지 고르기 → 후공정)를 따릅니다.
const NAV = [
  { id: 'front', label: '전공정' },
  { id: 'package', label: '패키지' },
  { id: 'flow', label: '후공정 흐름도' },
  { id: 'query', label: '공정 질문' },
  { id: 'sim', label: '시뮬레이션' },
  { id: 'line', label: '라인 실습' },
  { id: 'advanced', label: 'Advanced' },
]

export default function App() {
  const [screen, setScreen] = useState('front')
  const [packageId, setPackageId] = useState(null)
  const [processId, setProcessId] = useState(null)
  const [lineProcessId, setLineProcessId] = useState(null)
  const [queryKey, setQueryKey] = useState(0)
  const [completed, setCompleted] = useStoredState('tutor.completed', [])
  const [, setReports] = useStoredState('tutor.reports', [])

  const pkg = findPackage(packageId)
  const studyingFront = screen === 'front' || (screen === 'query' && findProcess(processId)?.stage === 'front')
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
          {NAV.map((item) => (
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
        </nav>
      </header>

      <FlowBar
        pkg={pkg}
        activeId={activeId}
        mode={flowMode}
        completed={completed}
        onOpenProcess={openProcess}
        onChoosePackage={() => setScreen('package')}
      />

      <p className="disclaimer">
        모든 설명과 시뮬레이션 규칙은 검수 전 교육용 초안입니다. 출처가 등록되기 전까지 학습 참고용으로만 쓰세요.
      </p>

      <main>
        {screen === 'package' && (
          <PackageSelect packageId={packageId} onSelect={setPackageId} onStart={() => setScreen('flow')} />
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
            onReport={(id) => setReports((list) => [...list, { processId: id, at: new Date().toISOString() }])}
          />
        )}
        {screen === 'sim' && <ProcessSim />}
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
