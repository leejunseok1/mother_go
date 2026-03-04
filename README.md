# 든든 AI Mobile MVP (Expo + React Native)

웹 데모의 핵심 UX를 모바일로 이식한 MVP입니다.

## 포함된 화면 (5개)
- 온보딩/연결 상태: `app/(tabs)/onboarding.tsx`
- 데이터 소스 허브: `app/(tabs)/sources.tsx`
- 교차분석 플레이어: `app/(tabs)/analysis.tsx`
- 답변 상세: `app/(tabs)/answer.tsx`
- 기록/신뢰도: `app/(tabs)/history.tsx`

## 핵심 구현 포인트
- Reanimated 기반 step 슬라이드인 + 답변 페이드업
- DataSource 카드 glow/pulse 인터랙션
- 탭/카드/완료/오류 햅틱(`expo-haptics`)
- React Query loading/error/empty 상태 처리
- BFF 계약 기반 API 레이어 + mock fallback
  - `POST /v1/analysis/sessions`
  - `GET /v1/analysis/sessions/{id}/stream` (SSE)
  - `GET /v1/sources`
  - `GET /v1/history`

## 환경변수
- `EXPO_PUBLIC_BFF_URL`
  - 미설정 시 mock 데이터/스트림으로 동작
  - 설정 시 BFF API 호출

## 실행
```bash
npm install
npm run start
```

## 참고
- 현재 샌드박스 환경에는 `node/npm`이 설치되어 있지 않아 실제 실행 검증은 수행하지 못했습니다.
