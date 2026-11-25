# handoff: 반도체 공정 튜터
작성일: 2026-11-25 · 작성자: 유태건

> 다음 작업자(또는 다음 수업의 나)가 바로 이어받을 수 있게 남기는 기록입니다. 모르는 값은 이유를 적습니다.

| 항목 | 내용 |
|---|---|
| Repo/폴더 | GitHub `dbxojrs/myprd` · 앱 코드 `app/` · 문서 `docs/` (PRD.md, architecture.md, wireframe.md, benchmark.md, handoff.md, 배포-로그인-설정.md) |
| branch/commit | `main` · 최신 커밋은 `git log -1`로 확인 (이 문서를 올린 커밋의 바로 앞 기능 커밋: `38b4f94` FAB 공정 시뮬레이션) |
| 실행 | `cd app && npm ci && npm run dev` → http://localhost:3068/ (포트는 `vite.config.js`에 3068로 고정) · 빌드 `npm run build` · 검사 `npm run check-content`, `npm run check-machines` |
| P8 선택 | 해당 없음 — 수업 공통 앱(AX 보드)의 A/B 선택이 아니라 개인 과제 앱이라 기록할 선택이 없음 |
| 확인 | 빌드 통과, `check-content` 통과, 자동 브라우저 테스트(Playwright): 현장 시나리오 7개·15개 경로 점수 일치, FAB 공정 시뮬레이션 21항목, 시나리오 시각화 38항목, 애니메이션 22항목, 수락조건 AC-01~AC-10 (PRD v2 표) |
| PR/리뷰 | PR 없음 — 개인 저장소라 `main`에 직접 커밋·푸시. 다른 사람 코드 리뷰는 받지 않음 |
| 남은 문제/다음 행동 | 1) **배포**: GitHub → Netlify 가져오기(본인 계정 작업, `docs/배포-로그인-설정.md`) → AC-11 확인 2) 구글 로그인(선택): Supabase 프로젝트·구글 OAuth·Netlify 환경 변수 3) 설명 출처에 기대는 판정 근거를 1순위 출처로 교체(PRD v2 "출처 현황") 4) 현직자·교수 검수 — 모든 내용 "검수 전" 5) 실제 학생 사용 테스트로 PRD의 [가설] 확인 |

## 구조도 위험 (architecture.md v2에서 옮김)
설비 규칙 175개 중 65개와 현장 시나리오 일부 원인이 설명 출처(2순위)에 기댐. 화면에 "설명 출처·검수 전"을 표시하고 있으며, 1순위 출처 교체와 검수가 다음 단계.

## 와이어프레임 동료 점검에서 남은 조건 (wireframe.md v2에서 옮김)
배포 주소에서의 동작(AC-11) — 배포 전이라 미확인.

## 주의
- `.env`는 커밋하지 않음(`.env.example`만). Supabase는 anon(공개) 키만 쓰고 service_role 키·DB 비밀번호는 어디에도 넣지 않음.
- `.claude/`, `career/` 폴더는 저장소에 올리지 않음.
