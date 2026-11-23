import { useEffect, useState } from 'react'
import { loadModels, useAiModel } from '../../lib/aiModel.js'
import { useApiKey } from '../../lib/apiKey.js'

// 내 API 키로 쓸 수 있는 모델을 불러와 고르게 합니다. 목록을 못 받으면 모델 ID를 직접 넣습니다.
export default function ModelPicker({ compact = false }) {
  const { apiKey } = useApiKey()
  const { model, setModel, list } = useAiModel()
  const [custom, setCustom] = useState(false)
  const [draft, setDraft] = useState(model)

  useEffect(() => {
    if (apiKey) loadModels(apiKey)
  }, [apiKey])

  if (!apiKey) return null
  const hasList = list.status === 'done' && list.models.length > 0
  const inList = hasList && list.models.some((m) => m.id === model)

  return (
    <div className={`model-picker${compact ? ' compact' : ''}`}>
      <label>
        <span>{compact ? '모델' : 'AI 모델'}</span>
        {hasList && !custom ? (
          <select
            value={inList ? model : '__custom'}
            onChange={(e) => {
              if (e.target.value === '__custom') {
                setDraft(model)
                setCustom(true)
              } else setModel(e.target.value)
            }}
          >
            {!inList && <option value="__custom">{model} (직접 입력)</option>}
            {list.models.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
            {inList && <option value="__custom">모델 ID 직접 입력…</option>}
          </select>
        ) : (
          <form
            className="model-custom"
            onSubmit={(e) => {
              e.preventDefault()
              if (draft.trim()) setModel(draft)
              setCustom(false)
            }}
          >
            <input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="claude-..." aria-label="모델 ID" />
            <button type="submit">적용</button>
          </form>
        )}
      </label>
      {list.status === 'loading' && <small className="muted">모델 목록을 불러오는 중…</small>}
      {list.status === 'error' && (
        <small className="muted">
          모델 목록을 불러오지 못했습니다. 모델 ID를 직접 넣으세요.{' '}
          <button type="button" className="link" onClick={() => loadModels(apiKey, { force: true })}>
            다시 불러오기
          </button>
        </small>
      )}
      {!compact && <small className="muted">큰 모델일수록 답이 깊지만 요금이 더 듭니다. 요금은 키 주인에게 청구됩니다.</small>}
    </div>
  )
}
