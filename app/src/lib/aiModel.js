import { createStore, useStore } from './sharedStore.js'

// 사용자가 고른 Claude 모델. 키와 달리 모델 이름은 비밀이 아니므로 늘 이 브라우저에 저장합니다.
// 목록은 사용자의 API 키로 받아 온 "그 키로 쓸 수 있는 모델"입니다.
export const DEFAULT_MODEL = 'claude-opus-5-5'

const modelStore = createStore('tutor.aiModel', '')
const listStore = createStore(null, { status: 'idle', models: [], forKey: '' })

export function getModel() {
  return modelStore.get() || DEFAULT_MODEL
}

export function useAiModel() {
  const saved = useStore(modelStore)
  const list = useStore(listStore)
  return {
    model: saved || DEFAULT_MODEL,
    chosen: saved,
    setModel: (id) => modelStore.set(id.trim()),
    list,
  }
}

// 키로 모델 목록을 받아 옵니다. 같은 키로 이미 받았으면 다시 부르지 않습니다.
export async function loadModels(apiKey, { force = false } = {}) {
  const now = listStore.get()
  if (!force && now.forKey === apiKey && (now.status === 'done' || now.status === 'loading')) return
  listStore.set({ status: 'loading', models: [], forKey: apiKey })
  try {
    const { default: Anthropic } = await import('@anthropic-ai/sdk')
    const client = new Anthropic({ apiKey, dangerouslyAllowBrowser: true })
    const models = []
    for await (const info of client.models.list({ limit: 100 })) {
      models.push({ id: info.id, name: info.display_name || info.id })
    }
    listStore.set({ status: 'done', models, forKey: apiKey })
    // 아직 고른 적이 없거나 고른 모델이 목록에 없으면 첫 번째(가장 최신)를 고릅니다.
    const chosen = modelStore.get()
    if (models.length > 0 && (!chosen || !models.some((m) => m.id === chosen))) {
      const preferred = models.find((m) => m.id === DEFAULT_MODEL) ?? models[0]
      if (!chosen) modelStore.set(preferred.id)
    }
  } catch (error) {
    listStore.set({ status: 'error', models: [], forKey: apiKey, message: error?.message ?? '' })
  }
}
