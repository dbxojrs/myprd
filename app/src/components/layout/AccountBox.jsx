import { useState } from 'react'
import { cloudConfigured, signInWithGoogle, signOut, useAuth } from '../../lib/cloud.js'

// 왼쪽 메뉴 아래 계정 칸. 구글로 로그인하면 이름·사진이 보이고, 공부 기록이 계정에 저장됩니다.
// Supabase 설정(.env)이 없으면 아무것도 그리지 않습니다.
const SYNC_TEXT = { idle: '', saving: '저장 중…', saved: '계정에 저장됨 ✓', error: '저장 실패' }

export default function AccountBox() {
  const auth = useAuth()
  const [menu, setMenu] = useState(false)
  if (!cloudConfigured) return null
  if (auth.status === 'loading') return <div className="side-account muted side-text">계정 확인 중…</div>
  if (auth.status !== 'in')
    return (
      <div className="side-account">
        <button type="button" className="side-item google-btn" onClick={signInWithGoogle} title="구글 계정으로 로그인하면 노트·진도가 어느 기기에서든 이어집니다">
          <span className="google-g" aria-hidden="true">
            G
          </span>
          <span className="side-text">구글로 로그인</span>
        </button>
        {auth.error && <p className="side-text ai-error">{auth.error}</p>}
      </div>
    )
  const u = auth.user
  return (
    <div className="side-account">
      <button type="button" className="side-item side-user" onClick={() => setMenu((m) => !m)} aria-expanded={menu} title={u.email}>
        {u.avatar ? <img src={u.avatar} alt="" className="side-avatar" referrerPolicy="no-referrer" /> : <span className="side-avatar fallback">{u.name[0]}</span>}
        <span className="side-text side-user-text">
          <strong>{u.name}</strong>
          <small className={auth.sync === 'error' ? 'bad' : ''}>{SYNC_TEXT[auth.sync] || u.email}</small>
        </span>
      </button>
      {menu && (
        <div className="side-account-menu side-text">
          <p className="muted">{u.email}</p>
          {auth.error && <p className="ai-error">{auth.error}</p>}
          <button type="button" onClick={() => signOut()}>
            로그아웃
          </button>
          <button
            type="button"
            className="link"
            onClick={() => window.confirm('로그아웃하고 이 기기의 공부 기록도 지울까요? (계정에는 남아 있습니다. 공용 컴퓨터일 때 쓰세요)') && signOut({ clearLocal: true })}
          >
            로그아웃 + 이 기기 기록 지우기
          </button>
        </div>
      )}
    </div>
  )
}
