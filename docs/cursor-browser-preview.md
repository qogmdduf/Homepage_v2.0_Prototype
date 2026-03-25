# Cursor / VS Code 내장 브라우저에서 실시간 반영(HMR)이 안 될 때

이 프로젝트는 **Vite + React**이며, 저장 시 갱신은 **개발 서버의 HMR(WebSocket)** 이 담당합니다.

## 권장 워크플로 (기본 설정)

1. **`pnpm dev`** — **폴링 감시**(`VITE_USE_POLLING=1`) + 시작 시 **기본 브라우저 자동 오픈**(`server.open: true`).  
   Cursor 내장 브라우저 대신 **열린 Chrome/Safari 탭**에서 작업하면 HMR이 가장 안정적입니다.
2. **`pnpm dev:fast`** — 네이티브 파일 감시만 사용(더 가볍지만, 동기화 폴더에서는 저장이 안 잡힐 수 있음).
3. **`pnpm dev:poll`** — `dev`와 동일(호환용 별칭).

## 1. 올바른 주소로 열었는지 확인

- 기본: `http://localhost:5173`
- `127.0.0.1` vs `localhost` 혼용 시 이슈가 있으면 **둘 중 하나로 통일**합니다.

## 2. 저장 후 터미널에 Vite 로그가 뜨는지 확인

- **`[vite] hmr update`** 가 전혀 없으면 **파일 감시** 문제입니다. 기본 `pnpm dev`는 폴링이라 대부분 해결됩니다. 그래도 안 되면 프로젝트 경로(동기화 폴더 등)를 확인하세요.

## 3. 내장 브라우저에서만 HMR이 안 될 때

- **시스템 브라우저**에서 열었을 때만 되면 **내장 WebView 제한**일 수 있습니다 → **`pnpm dev`로 자동으로 열린 외부 탭**을 사용하세요.

## 4. `vite.config.ts`에서 한 일

- `server.host` / `server.hmr` 을 **localhost:5173** 기준으로 명시.
- `server.open: true` 로 외부 브라우저 유도.
