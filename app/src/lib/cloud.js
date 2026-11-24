import { createStore, useStore } from './sharedStore.js'

// 계정(구글 로그인)과 공부 기록 동기화. Supabase를 씁니다(선택 기능).
// - 설정: app/.env 의 VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY (공개 키라 화면 코드에 들어가도 되는 값. RLS로 내 행만 읽고 씀)
// - 저장: Supabase 표 study_data(user_id, data jsonb, updated_at) 한 줄에 이 브라우저의 'tutor.*' 기록을 묶어 둡니다(app/supabase/schema.sql).
// - 로그인하면 계정 기록과 이 기기 기록을 합치고(노트는 최신 것, 진도·오답은 합집합), 그 뒤로는 바뀔 때마다 계정에 올립니다.
// - API 키(tutor.aiKey)와 기기별 화면 설정(창 위치·접기 상태·테마)은 올리지 않습니다.

const URL_ = import.meta.env.VITE_SUPABASE_URL
const KEY = import.meta.env.VITE_SUPABASE_ANON_KEY
export const cloudConfigured = Boolean(URL_ && KEY)

const EXCLUDE = [/^tutor\.aiKey$/, /^tutor\.ui(\.|$)/, /^tutor\.float$/]
const synced = (key) => key.startsWith('tutor.') && !EXCLUDE.some((re) => re.test(key))

// status: 'off'(설정 없음) | 'loading' | 'out' | 'in' ; sync: 'idle' | 'saving' | 'saved' | 'error'
export const authStore = createStore(null, { status: cloudConfigured ? 'loading' : 'off', user: null, sync: 'idle', error: '' })
export const useAuth = () => useStore(authStore)
const setAuth = (p) => authStore.set((s) => ({ ...s, ...p }))

let clientPromise = null
function getClient() {
  if (!cloudConfigured) return null
  clientPromise ??= import('@supabase/supabase-js').then(({ createClient }) => createClient(URL_, KEY, { auth: { persistSession: true, detectSessionInUrl: true, flowType: 'pkce' } }))
  return clientPromise
}

function readLocal() {
  const out = {}
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i)
      if (!synced(k)) continue
      try {
        out[k] = JSON.parse(localStorage.getItem(k))
      } catch {
        out[k] = localStorage.getItem(k)
      }
    }
  } catch {
    // 저장소를 못 쓰면 빈 기록으로 둡니다.
  }
  return out
}

function writeLocal(data) {
  try {
    for (const [k, v] of Object.entries(data)) if (synced(k)) localStorage.setItem(k, JSON.stringify(v))
  } catch {
    setAuth({ sync: 'error', error: '이 브라우저 저장 공간이 가득 차 계정 기록을 다 받지 못했습니다.' })
  }
}

const byId = (a = [], b = [], id = (x) => x.id, pick = (x, y) => x) => {
  const map = new Map()
  for (const x of a) map.set(id(x), x)
  for (const y of b) map.set(id(y), map.has(id(y)) ? pick(map.get(id(y)), y) : y)
  return [...map.values()]
}
const newer = (x, y, f) => ((f(y) ?? '') > (f(x) ?? '') ? y : x)

// 계정 기록(remote)과 이 기기 기록(local)을 합칩니다.
export function mergeData(remote = {}, local = {}) {
  const out = { ...local, ...remote }
  const both = (k) => remote[k] !== undefined && local[k] !== undefined
  if (both('tutor.notes')) out['tutor.notes'] = byId(remote['tutor.notes'], local['tutor.notes'], (n) => n.id, (x, y) => newer(x, y, (n) => n.updatedAt))
  if (both('tutor.reports')) {
    const list = byId(remote['tutor.reports'].list ?? [], local['tutor.reports'].list ?? [], (r) => r.id, (x, y) => newer(x, y, (r) => r.updatedAt))
    out['tutor.reports'] = { list: list.sort((x, y) => (y.updatedAt > x.updatedAt ? 1 : -1)).slice(0, 50), open: local['tutor.reports'].open ?? null }
  }
  if (both('tutor.noteTemplates')) out['tutor.noteTemplates'] = byId(remote['tutor.noteTemplates'], local['tutor.noteTemplates'])
  if (both('tutor.completed')) out['tutor.completed'] = [...new Set([...remote['tutor.completed'], ...local['tutor.completed']])]
  if (both('tutor.activity')) {
    const a = { ...remote['tutor.activity'] }
    for (const [d, n] of Object.entries(local['tutor.activity'])) a[d] = Math.max(a[d] ?? 0, n)
    out['tutor.activity'] = a
  }
  for (const k of ['tutor.wrong', 'tutor.wrongWritten']) if (both(k)) out[k] = byId(remote[k], local[k], (w) => w.q?.id, (x, y) => newer(x, y, (w) => w.at))
  for (const k of ['tutor.quizHistory', 'tutor.wq.history'])
    if (both(k)) out[k] = byId(remote[k], local[k], (h) => h.at).sort((x, y) => (y.at > x.at ? 1 : -1)).slice(0, 20)
  if (both('tutor.cases')) {
    const c = { ...remote['tutor.cases'] }
    for (const [id, v] of Object.entries(local['tutor.cases'])) c[id] = c[id] ? newer(c[id], v, (x) => x.at) : v
    out['tutor.cases'] = c
  }
  if (both('tutor.plan')) {
    const r = remote['tutor.plan']
    const l = local['tutor.plan']
    out['tutor.plan'] = { ...(r.settings ? r : l), done: { ...l.done, ...r.done } }
  }
  return out
}

let client = null
let lastPushed = ''
let pushTimer = null
// 계정 기록을 받아 합치기 전에는 절대 올리지 않습니다(새 기기의 빈 기록이 계정 기록을 덮어쓰지 않게).
let ready = false
let pulling = null

async function pull(user) {
  const { data, error } = await client.from('study_data').select('data').eq('user_id', user.id).maybeSingle()
  if (error) throw error
  const local = readLocal()
  const merged = data?.data ? mergeData(data.data, local) : local
  const changedLocal = JSON.stringify(merged) !== JSON.stringify(local)
  if (changedLocal) writeLocal(merged)
  await push(user, merged)
  return changedLocal
}

async function push(user, snapshot = readLocal()) {
  const text = JSON.stringify(snapshot)
  if (text === lastPushed) return
  setAuth({ sync: 'saving' })
  const { error } = await client.from('study_data').upsert({ user_id: user.id, data: snapshot, updated_at: new Date().toISOString() })
  if (error) {
    setAuth({ sync: 'error', error: `계정에 저장하지 못했습니다: ${error.message}` })
    return
  }
  lastPushed = text
  setAuth({ sync: 'saved', error: '' })
}

const userInfo = (u) => ({
  id: u.id,
  email: u.email,
  name: u.user_metadata?.full_name || u.user_metadata?.name || u.email?.split('@')[0] || '나',
  avatar: u.user_metadata?.avatar_url || u.user_metadata?.picture || '',
})

// 앱 시작 때 한 번 부릅니다.
export async function initCloud() {
  if (!cloudConfigured) return
  try {
    client = await getClient()
  } catch {
    setAuth({ status: 'out', error: '로그인 모듈을 불러오지 못했습니다.' })
    return
  }
  const onUser = async (u) => {
    if (!u) {
      ready = false
      setAuth({ status: 'out', user: null, sync: 'idle' })
      return
    }
    setAuth({ status: 'in', user: userInfo(u) })
    // 로그인 직후 한 번만 합칩니다. 이 기기 기록이 바뀌었으면 화면을 새로 읽습니다.
    const flag = `tutor-merged-${u.id}`
    let done = false
    try {
      done = sessionStorage.getItem(flag) === '1'
    } catch {
      // 무시
    }
    if (done) {
      ready = true
      return
    }
    try {
      pulling ??= pull(u)
      const changed = await pulling
      pulling = null
      ready = true
      try {
        sessionStorage.setItem(flag, '1')
      } catch {
        // 무시
      }
      if (changed) window.location.reload()
    } catch (e) {
      pulling = null
      setAuth({ sync: 'error', error: `계정 기록을 불러오지 못했습니다: ${e.message}` })
    }
  }
  const { data } = await client.auth.getSession()
  await onUser(data.session?.user ?? null)
  client.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') onUser(session?.user ?? null)
  })
  // 바뀐 기록을 5초마다 확인해 계정에 올리고, 탭을 닫거나 숨길 때도 올립니다.
  const tick = () => {
    const u = authStore.get().user
    if (ready && u && authStore.get().status === 'in') push(u).catch(() => {})
  }
  pushTimer ??= setInterval(tick, 5000)
  document.addEventListener('visibilitychange', () => document.visibilityState === 'hidden' && tick())
}

export async function signInWithGoogle() {
  const c = await getClient()
  if (!c) return
  const { error } = await c.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin + window.location.pathname } })
  if (error) setAuth({ error: `구글 로그인을 시작하지 못했습니다: ${error.message}` })
}

// 로그아웃. clearLocal이면 이 기기의 공부 기록도 지웁니다(공용 컴퓨터).
export async function signOut({ clearLocal = false } = {}) {
  const u = authStore.get().user
  if (u && ready) await push(u).catch(() => {})
  ready = false
  await client?.auth.signOut()
  try {
    sessionStorage.removeItem(`tutor-merged-${u?.id}`)
    if (clearLocal) for (const k of Object.keys(readLocal())) localStorage.removeItem(k)
  } catch {
    // 무시
  }
  lastPushed = ''
  if (clearLocal) window.location.reload()
}
