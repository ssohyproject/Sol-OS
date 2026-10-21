# SolOS 개발자 & 코드베이스 가이드 (CODE_README.md)

> 본 문서는 **SolOS 코드베이스의 파일 구조, 페이지/모달 매핑, 데이터 상태 흐름, 빌드 시스템**을 상세히 정리한 개발자 가이드입니다.  
> 사용자가 AI 어시스턴트(Antigravity)나 동료 개발자에게 기능 수정 및 기능 추가를 요청할 때 정확한 파일 위치와 맥락을 파악할 수 있도록 돕습니다.

---

## 📌 목차
1. [프로젝트 아키텍처 개요](#1-프로젝트-아키텍처-개요)
2. [전체 디렉터리 구조도](#2-전체-디렉터리-구조도)
3. [페이지(서브뷰)별 파일 매핑표](#3-페이지서브뷰별-파일-매핑표)
4. [모달(Modals) 파일 매핑표](#4-모달modals-파일-매핑표)
5. [핵심 코어 레이어 (js/core/)](#5-핵심-코어-레이어-jscore)
6. [HTML 빌드 시스템 (src/ 및 bin/build-html.js)](#6-html-빌드-시스템-src-및-binbuild-htmljs)
7. [상태 관리 및 데이터 라이프사이클 (appState)](#7-상태-관리-및-데이터-라이프사이클-appstate)
8. [서버 & API 엔드포인트 (server.js)](#8-서버--api-엔드포인트-serverjs)
9. [수정 요청 팁 & 프롬프트 가이드 (Prompting Cheat Sheet)](#9-수정-요청-팁--프롬프트-가이드-prompting-cheat-sheet)

---

## 1. 프로젝트 아키텍처 개요

- **Zero-Dependency Native Architecture**:
  - Webpack, Vite, Babel 등 무거운 외부 번들러 없이, 순수 웹 표준(Vanilla HTML5/ES6+ CSS)과 네이티브 Node.js로 구동됩니다.
  - 외부 런타임 종속성이 없어 초고속 콜드스타트(<1초)와 강력한 보안을 유지합니다.
- **PWS (Progressive Web Service) & PWA**:
  - `manifest.json`, 서비스워커(`sw.js`) 및 오프라인 로컬스토리지 완벽 지원.
- **클라우드 & 로컬 듀얼 호환**:
  - **Local Development**: `npm run dev` (또는 `node server.js`)
  - **Google Cloud Run**: `Dockerfile` 기반 멀티스테이지 컨테이너 배포
  - **Firebase Hosting**: 정적 호스팅 및 Auth/Firestore 클라우드 동기화 지원

---

## 2. 전체 디렉터리 구조도

```
solo-os/
├── bin/                                # 실행 바이너리 및 빌드 유틸리티
│   ├── build-html.js                   # src/ 마크업 파셜을 root index.html로 합성하는 컴파일러
│   └── macos-ocr                       # macOS 네이티브 OCR 엔진 (Receipt 파싱 백엔드)
│
├── src/                                # [HTML 마크업 소스 레이어]
│   ├── index.html                      # 기본 셸 (doctype, head, 메인 컨테이너, include 지시문)
│   ├── layout/                         # 공통 레이아웃 컴포넌트
│   │   ├── header.html                 # 상단 헤더, 도메인 드롭다운, 모드 전환기
│   │   └── sidebar.html                # 반응형 사이드바, 네비게이션, 게스트 배너
│   ├── pages/                          # 각 서브뷰 페이지별 순수 HTML 마크업 (10종)
│   └── modals/                         # 각 독립 팝업/모달별 순수 HTML 마크업 (25종)
│
├── js/                                 # [JavaScript 비즈니스 로직 레이어]
│   ├── core/                           # 전역 공통 코어 모듈
│   │   ├── state.js                    # appState, 샘플/비로그인 데이터 스토리지, refreshAllUI
│   │   ├── router.js                   # switchSubView, switchViewMode, 사이드바 드로어
│   │   ├── auth.js                     # Google OAuth, Firebase Auth, 사용자 세션
│   │   └── ui-utils.js                 # showToast, 쉬운 용어 변환, 온보딩, PWS 설치
│   ├── pages/                          # 각 페이지별 독립 컨트롤러 (10종)
│   ├── modals/                         # 각 모달별 이벤트/파싱 핸들러 (8종)
│   ├── tax-engine.js                   # 순수 3대 세무(3.3%, 10% VAT, 8.8%) 산술 계산 엔진
│   ├── firebase-service.js             # Firebase 클라우드 동기화 서비스
│   └── app.js                          # 메인 앱 엔트리포인트 (초기화 및 DOMContentLoaded)
│
├── data/                               # 로컬 데이터 및 백업 저장소
│   ├── default-state.json              # 기본 워크스페이스 상태
│   ├── users.json                      # 사용자 계정 데이터베이스
│   └── tax-rules.json                  # 세무 규칙 및 공제율 데이터
│
├── mcp/                                # Model Context Protocol 서버 (Claude, Cursor 연동)
│   ├── server.js                       # Stdio JSON-RPC 2.0 프로토콜 서버
│   └── mcp_config.json                 # 클라이언트 도구 명세
│
├── index.html                          # [배포용 컴파일 산출물] bin/build-html.js에 의해 자동 생성
├── server.js                           # 네이티브 Node.js HTTP/API 서버 (포트 3000)
├── package.json                        # 실행 스크립트 및 테스트 정의
└── README.md                           # 서비스 기획 및 제품 소개 문서
```

---

## 3. 페이지(서브뷰)별 파일 매핑표

UI 수정이나 기능 개선을 요청할 때, 아래 표를 참조하여 관련 파일만 타겟팅하면 빠르고 정확하게 작업할 수 있습니다.

| 서브뷰 ID | 메뉴명 및 역할 | HTML 마크업 파일 | JavaScript 로직 파일 |
| :--- | :--- | :--- | :--- |
| `subview-overview` | **메인 대시보드** (KPI 카드, 캐시플로우 차트) | [`src/pages/overview.html`](file:///Users/ssohy/Desktop/Project/DAY22-27/solo-os/src/pages/overview.html) | [`js/pages/overview.js`](file:///Users/ssohy/Desktop/Project/DAY22-27/solo-os/js/pages/overview.js) |
| `subview-schedule` | **세부 일정 관리** (월간 캘린더, 칸반, 간트) | [`src/pages/schedule.html`](file:///Users/ssohy/Desktop/Project/DAY22-27/solo-os/src/pages/schedule.html) | [`js/pages/schedule.js`](file:///Users/ssohy/Desktop/Project/DAY22-27/solo-os/js/pages/schedule.js) |
| `subview-statements` | **자금 현황** (손익 폭포수, 런웨이 진단) | [`src/pages/statements.html`](file:///Users/ssohy/Desktop/Project/DAY22-27/solo-os/src/pages/statements.html) | [`js/pages/statements.js`](file:///Users/ssohy/Desktop/Project/DAY22-27/solo-os/js/pages/statements.js) |
| `subview-ledger` | **자금 정리** (입출금 장부, 엑셀 대량 편집) | [`src/pages/ledger.html`](file:///Users/ssohy/Desktop/Project/DAY22-27/solo-os/src/pages/ledger.html) | [`js/pages/ledger.js`](file:///Users/ssohy/Desktop/Project/DAY22-27/solo-os/js/pages/ledger.js) |
| `subview-tax` | **세금 관리** (3대 세무 예비금 통장, 계산기) | [`src/pages/tax.html`](file:///Users/ssohy/Desktop/Project/DAY22-27/solo-os/src/pages/tax.html) | [`js/pages/tax.js`](file:///Users/ssohy/Desktop/Project/DAY22-27/solo-os/js/pages/tax.js) |
| `subview-contract` | **계약 관리** (공인 서식 자료실, 독소조항 스캐너) | [`src/pages/contract.html`](file:///Users/ssohy/Desktop/Project/DAY22-27/solo-os/src/pages/contract.html) | [`js/pages/contract.js`](file:///Users/ssohy/Desktop/Project/DAY22-27/solo-os/js/pages/contract.js) |
| `subview-legal` | **법적 보호** (상법 제69조 검수, 내용증명, 소액소송) | [`src/pages/legal.html`](file:///Users/ssohy/Desktop/Project/DAY22-27/solo-os/src/pages/legal.html) | [`js/pages/legal.js`](file:///Users/ssohy/Desktop/Project/DAY22-27/solo-os/js/pages/legal.js) |
| `subview-settlement` | **정산 관리** (미수금 청구 내역표, 유예 설정) | [`src/pages/settlement.html`](file:///Users/ssohy/Desktop/Project/DAY22-27/solo-os/src/pages/settlement.html) | [`js/pages/settlement.js`](file:///Users/ssohy/Desktop/Project/DAY22-27/solo-os/js/pages/settlement.js) |
| `subview-clients` | **클라이언트 관리** (거래처 카드, 신뢰등급, 체크리스트) | [`src/pages/clients.html`](file:///Users/ssohy/Desktop/Project/DAY22-27/solo-os/src/pages/clients.html) | [`js/pages/clients.js`](file:///Users/ssohy/Desktop/Project/DAY22-27/solo-os/js/pages/clients.js) |
| `conversationalView` | **대화형 AI 에이전트** (CFO 상담 챗봇 인터페이스) | [`src/pages/agent.html`](file:///Users/ssohy/Desktop/Project/DAY22-27/solo-os/src/pages/agent.html) | [`js/pages/agent.js`](file:///Users/ssohy/Desktop/Project/DAY22-27/solo-os/js/pages/agent.js) |

---

## 4. 모달(Modals) 파일 매핑표

SolOS는 총 25개의 독립 모달을 갖추고 있으며, 각각 `src/modals/*.html` 파일로 모듈화되어 있습니다.

| 모달 DOM ID | 모달 명칭 및 용도 | HTML 마크업 파일 | 연동 JS 컨트롤러 |
| :--- | :--- | :--- | :--- |
| `onboardingModal` | 첫 방문 시작 모드 선택 (대시보드형 vs AI 대화형) | [`src/modals/onboarding-modal.html`](file:///Users/ssohy/Desktop/Project/DAY22-27/solo-os/src/modals/onboarding-modal.html) | [`js/core/ui-utils.js`](file:///Users/ssohy/Desktop/Project/DAY22-27/solo-os/js/core/ui-utils.js) |
| `smartIngestionModal` | 엑셀, 영수증 이미지, SMS 스마트 업로드 모달 | [`src/modals/smart-ingestion-modal.html`](file:///Users/ssohy/Desktop/Project/DAY22-27/solo-os/src/modals/smart-ingestion-modal.html) | [`js/modals/smart-ingestion.js`](file:///Users/ssohy/Desktop/Project/DAY22-27/solo-os/js/modals/smart-ingestion.js) |
| `receiptConfirmModal` | 영수증 Vision OCR 인식 결과 대조 및 최종 분개 모달 | [`src/modals/receipt-confirm-modal.html`](file:///Users/ssohy/Desktop/Project/DAY22-27/solo-os/src/modals/receipt-confirm-modal.html) | [`js/modals/smart-ingestion.js`](file:///Users/ssohy/Desktop/Project/DAY22-27/solo-os/js/modals/smart-ingestion.js) |
| `legalCertModal` | 상법 제69조 타임스탬프 산출물 검수 로그 모달 | [`src/modals/legal-cert-modal.html`](file:///Users/ssohy/Desktop/Project/DAY22-27/solo-os/src/modals/legal-cert-modal.html) | [`js/pages/legal.js`](file:///Users/ssohy/Desktop/Project/DAY22-27/solo-os/js/pages/legal.js) |
| `taskModal` | 과업(일정) 신규 등록 및 수정 모달 | [`src/modals/task-modal.html`](file:///Users/ssohy/Desktop/Project/DAY22-27/solo-os/src/modals/task-modal.html) | [`js/modals/task-modal.js`](file:///Users/ssohy/Desktop/Project/DAY22-27/solo-os/js/modals/task-modal.js) |
| `qrModal` | 모바일 PWS 접속용 스마트 QR 코드 모달 | [`src/modals/qr-modal.html`](file:///Users/ssohy/Desktop/Project/DAY22-27/solo-os/src/modals/qr-modal.html) | [`js/core/ui-utils.js`](file:///Users/ssohy/Desktop/Project/DAY22-27/solo-os/js/core/ui-utils.js) |
| `clientModal` | 거래처(클라이언트) 신규 등록 및 서류 설정 모달 | [`src/modals/client-modal.html`](file:///Users/ssohy/Desktop/Project/DAY22-27/solo-os/src/modals/client-modal.html) | [`js/modals/client-modal.js`](file:///Users/ssohy/Desktop/Project/DAY22-27/solo-os/js/modals/client-modal.js) |
| `receivableModal` | 미수금 및 정산 청구 건 신규 등록 모달 | [`src/modals/receivable-modal.html`](file:///Users/ssohy/Desktop/Project/DAY22-27/solo-os/src/modals/receivable-modal.html) | [`js/modals/receivable-modal.js`](file:///Users/ssohy/Desktop/Project/DAY22-27/solo-os/js/modals/receivable-modal.js) |
| `authModal` | 회원가입 및 로그인 팝업 모달 | [`src/modals/auth-modal.html`](file:///Users/ssohy/Desktop/Project/DAY22-27/solo-os/src/modals/auth-modal.html) | [`js/core/auth.js`](file:///Users/ssohy/Desktop/Project/DAY22-27/solo-os/js/core/auth.js) |
| `googleModal` | Google Workspace 연동 (캘린더 동기화 & 드라이브 백업) | [`src/modals/google-modal.html`](file:///Users/ssohy/Desktop/Project/DAY22-27/solo-os/src/modals/google-modal.html) | [`js/modals/google-modal.js`](file:///Users/ssohy/Desktop/Project/DAY22-27/solo-os/js/modals/google-modal.js) |
| `mcpModal` | Model Context Protocol 설정 및 클로드/커서 연결 | [`src/modals/mcp-modal.html`](file:///Users/ssohy/Desktop/Project/DAY22-27/solo-os/src/modals/mcp-modal.html) | [`js/modals/mcp-modal.js`](file:///Users/ssohy/Desktop/Project/DAY22-27/solo-os/js/modals/mcp-modal.js) |
| `accountBalanceModal` | 사업 통장 잔고 및 세금 통장 설정 모달 | [`src/modals/account-balance-modal.html`](file:///Users/ssohy/Desktop/Project/DAY22-27/solo-os/src/modals/account-balance-modal.html) | [`js/core/state.js`](file:///Users/ssohy/Desktop/Project/DAY22-27/solo-os/js/core/state.js) |
| `runwayFormulaModal` | 현금 유지 가능 기간(Runway) 산식 상세 안내 모달 | [`src/modals/runway-formula-modal.html`](file:///Users/ssohy/Desktop/Project/DAY22-27/solo-os/src/modals/runway-formula-modal.html) | [`js/pages/statements.js`](file:///Users/ssohy/Desktop/Project/DAY22-27/solo-os/js/pages/statements.js) |
| `receivablesDetailModal` | 받을 돈(입금 예정 대금) 상세 목록 모달 | [`src/modals/receivables-detail-modal.html`](file:///Users/ssohy/Desktop/Project/DAY22-27/solo-os/src/modals/receivables-detail-modal.html) | [`js/pages/settlement.js`](file:///Users/ssohy/Desktop/Project/DAY22-27/solo-os/js/pages/settlement.js) |
| `liabilitiesDetailModal` | 예정 지출 및 세무 부채 상세 목록 모달 | [`src/modals/liabilities-detail-modal.html`](file:///Users/ssohy/Desktop/Project/DAY22-27/solo-os/src/modals/liabilities-detail-modal.html) | [`js/pages/statements.js`](file:///Users/ssohy/Desktop/Project/DAY22-27/solo-os/js/pages/statements.js) |
| `fixedExpenseScheduleModal` | 매월 고정비 자동 납부일(출금일) 설정 모달 | [`src/modals/fixed-expense-schedule-modal.html`](file:///Users/ssohy/Desktop/Project/DAY22-27/solo-os/src/modals/fixed-expense-schedule-modal.html) | [`js/pages/ledger.js`](file:///Users/ssohy/Desktop/Project/DAY22-27/solo-os/js/pages/ledger.js) |
| `alignmentArchitectureModal`| 4-Way 실시간 자동 얼라인 아키텍처 구조도 팝업 | [`src/modals/alignment-architecture-modal.html`](file:///Users/ssohy/Desktop/Project/DAY22-27/solo-os/src/modals/alignment-architecture-modal.html) | [`js/pages/contract.js`](file:///Users/ssohy/Desktop/Project/DAY22-27/solo-os/js/pages/contract.js) |
| `taxActionModal` | 국세청 세무 일정 상세 및 신고 조치 가이드 모달 | [`src/modals/tax-action-modal.html`](file:///Users/ssohy/Desktop/Project/DAY22-27/solo-os/src/modals/tax-action-modal.html) | [`js/pages/tax.js`](file:///Users/ssohy/Desktop/Project/DAY22-27/solo-os/js/pages/tax.js) |
| `contractPreviewModal` | 정부 공인 표준계약서 서식 전문 미리보기 모달 | [`src/modals/contract-preview-modal.html`](file:///Users/ssohy/Desktop/Project/DAY22-27/solo-os/src/modals/contract-preview-modal.html) | [`js/pages/contract.js`](file:///Users/ssohy/Desktop/Project/DAY22-27/solo-os/js/pages/contract.js) |
| `contractRegisterModal` | 새 용역 계약 체결 등록 모달 | [`src/modals/contract-register-modal.html`](file:///Users/ssohy/Desktop/Project/DAY22-27/solo-os/src/modals/contract-register-modal.html) | [`js/pages/contract.js`](file:///Users/ssohy/Desktop/Project/DAY22-27/solo-os/js/pages/contract.js) |
| `recordInspectionModal` | 산출물 검수 완료 및 클라이언트 승인 기록 모달 | [`src/modals/record-inspection-modal.html`](file:///Users/ssohy/Desktop/Project/DAY22-27/solo-os/src/modals/record-inspection-modal.html) | [`js/pages/legal.js`](file:///Users/ssohy/Desktop/Project/DAY22-27/solo-os/js/pages/legal.js) |
| `legalDocPdfModal` | [L-03] 납품·검수 증빙 확인서 PDF 생성 모달 | [`src/modals/legal-doc-pdf-modal.html`](file:///Users/ssohy/Desktop/Project/DAY22-27/solo-os/src/modals/legal-doc-pdf-modal.html) | [`js/pages/legal.js`](file:///Users/ssohy/Desktop/Project/DAY22-27/solo-os/js/pages/legal.js) |
| `addTimelineModal` | 새 분쟁·이행 사실관계 타임라인 수기 추가 모달 | [`src/modals/add-timeline-modal.html`](file:///Users/ssohy/Desktop/Project/DAY22-27/solo-os/src/modals/add-timeline-modal.html) | [`js/pages/legal.js`](file:///Users/ssohy/Desktop/Project/DAY22-27/solo-os/js/pages/legal.js) |
| `contractDetailModal` | 계약 통합 상세 & 4-Way 실시간 연동 상태 검토 모달 | [`src/modals/contract-detail-modal.html`](file:///Users/ssohy/Desktop/Project/DAY22-27/solo-os/src/modals/contract-detail-modal.html) | [`js/modals/contract-detail-modal.js`](file:///Users/ssohy/Desktop/Project/DAY22-27/solo-os/js/modals/contract-detail-modal.js) |
| `privacyTermsModal` | 서비스 이용약관 및 개인정보 처리방침 전문 모달 | [`src/modals/privacy-terms-modal.html`](file:///Users/ssohy/Desktop/Project/DAY22-27/solo-os/src/modals/privacy-terms-modal.html) | [`js/modals/privacy-terms.js`](file:///Users/ssohy/Desktop/Project/DAY22-27/solo-os/js/modals/privacy-terms.js) |

---

## 5. 핵심 코어 레이어 (`js/core/`)

1. **[`js/core/state.js`](file:///Users/ssohy/Desktop/Project/DAY22-27/solo-os/js/core/state.js)**:
   - `appState`: 전역 반응형 상태 객체 (`workingCapital`, `transactions`, `tasks`, `clients`, `receivables`, `contracts` 등).
   - `SAMPLE_WORKSPACE` / `EMPTY_WORKSPACE`: 가상 데모 데이터셋 및 비로그인 클린 상태.
   - `saveCurrentWorkspaceData()`: 로컬스토리지 `soloos_workspace_state_v1` 자동 영속화.
   - `refreshAllUI()`: 각 페이지 렌더러 함수를 한 번에 안전하게 호출하는 중앙 동기화 허브.
2. **[`js/core/router.js`](file:///Users/ssohy/Desktop/Project/DAY22-27/solo-os/js/core/router.js)**:
   - `switchSubView(viewId)`: 9개 서브뷰 화면 전환 및 네비게이션 액티브 탭 갱신.
   - `switchViewMode('dashboard' | 'conversational')`: ERP 대시보드형과 AI 대화형 모드 전환.
   - `toggleSidebarDrawer()`, `closeSidebarDrawer()`: 모바일 오프캔버스 반응형 메뉴 제어.
3. **[`js/core/auth.js`](file:///Users/ssohy/Desktop/Project/DAY22-27/solo-os/js/core/auth.js)**:
   - Google One-Click 로그인, 이메일/비밀번호 인증, 데모 계정 자동 입력, 로그아웃 제어.
4. **[`js/core/ui-utils.js`](file:///Users/ssohy/Desktop/Project/DAY22-27/solo-os/js/core/ui-utils.js)**:
   - `showToast(msg)`: 화면 우하단 토스트 알림 생성.
   - `togglePlainLanguageMode()`: 회계 용어 <-> 초보자 쉬운 용어 실시간 교체.
   - `installPWS()`: PWS 앱 홈화면 추가 프롬프트.

---

## 6. HTML 빌드 시스템 (`src/` 및 `bin/build-html.js`)

SolOS는 개발할 때는 작은 조각 파일로 쾌적하게 작업하고, 브라우저가 실행할 때는 1개의 온전한 HTML로 읽도록 하는 **초경량 Node.js 빌더**를 내장하고 있습니다.

### 작동 원리
- 소스 파일: [`src/index.html`](file:///Users/ssohy/Desktop/Project/DAY22-27/solo-os/src/index.html)
- 파셜 파일: `src/layout/*.html`, `src/pages/*.html`, `src/modals/*.html`
- 빌더 스크립트: [`bin/build-html.js`](file:///Users/ssohy/Desktop/Project/DAY22-27/solo-os/bin/build-html.js)
- 컴파일 결과물: 루트 [`index.html`](file:///Users/ssohy/Desktop/Project/DAY22-27/solo-os/index.html)

### 파셜 포함 문법
```html
<!-- @include pages/overview.html -->
<!-- @include modals/task-modal.html -->
```

### 빌드 및 실행 명령어
```bash
# 1. HTML 단독 빌드 (약 2ms 소요)
npm run build

# 2. 로컬 개발 서버 실행 (자동으로 빌드 후 server.js 실행)
npm run dev

# 3. 구문 검사 및 유효성 테스트 (빌드 + 모든 JS 파일 문법 체크)
npm test
```

> **💡 자동 빌드 안전장치**:  
> `server.js` 구동 시에도 `bin/build-html.js`를 자동으로 1회 호출하므로, `src/` 내의 HTML을 수정한 뒤 서버를 재시작하기만 하면 항상 최신 내용이 반영됩니다.

---

## 7. 상태 관리 및 데이터 라이프사이클 (`appState`)

SolOS의 모든 비즈니스 데이터는 [`js/core/state.js`](file:///Users/ssohy/Desktop/Project/DAY22-27/solo-os/js/core/state.js)의 `appState` 객체에 집중되어 있습니다.

```javascript
const appState = {
  viewMode: "dashboard",            // 'dashboard' 또는 'conversational'
  plainLanguage: true,              // 쉬운 회계 용어 활성화 여부
  currentWorkstream: "all",         // 업무 도메인 필터 ('all', 'client', 'publishing', 'knowledge')
  workingCapital: 14200000,         // 사업 통장 잔고 (원)
  monthlyFixedExpense: 2730000,     // 월 고정 지출 합계 (원)
  taxSaved: 580000,                 // 3대 세무 예비금 (원)
  scheduleBufferEnabled: false,     // 일정 버퍼(+3일) 보호 모드
  transactions: [ ... ],            // 입출금 거래내역 리스트
  tasks: [ ... ],                   // 캘린더 및 마일스톤 과업 리스트
  clients: [ ... ],                 // 등록 거래처 리스트 (신뢰등급, 체크리스트 포함)
  receivables: [ ... ],             // 미수금 및 정산 관리 데이터
  contracts: [ ... ]                // 체결된 계약 프로젝트 데이터
};
```

데이터가 추가되거나 변경되면 `saveCurrentWorkspaceData()`가 로컬스토리지에 저장하고, `refreshAllUI()`가 연결된 모든 컴포넌트를 즉각 리렌더링합니다.

---

## 8. 서버 & API 엔드포인트 (`server.js`)

Node.js 내장 모듈만을 사용한 초경량 HTTP 서버입니다 (포트 `3000`).

- **정적 파일 서빙**: `public` 루트 및 `src`, `js`, `data` 지원
- **인증 REST API**:
  - `POST /api/auth/register`, `POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/auth/me`
- **구글 연동 API**:
  - `GET /api/google/settings`, `POST /api/google/settings`, `POST /api/google/sync-calendar`
- **스마트 영수증 OCR API**:
  - `POST /api/ai/parse-receipt` (Gemini Vision API 또는 macOS 로컬 OCR을 활용하여 1초 만에 공급가액/부가세/상호명 자동 추출)
- **MCP (Model Context Protocol) API**:
  - `GET /api/mcp/status`, `POST /api/mcp/execute`

---

## 9. 수정 요청 팁 & 프롬프트 가이드 (Prompting Cheat Sheet)

사용자가 AI(Antigravity)에게 기능을 수정하거나 추가해 달라고 요청할 때, 아래 예시처럼 **도메인이나 파일명**을 함께 언급하면 훨씬 빠르고 정확하게 작업이 진행됩니다.

### 예시 1: 특정 화면 UI 수정
- ❌ *"계약서 화면에 다운로드 버튼 하나 만들어줘"*
-  *"**계약 관리 페이지(`src/pages/contract.html` 및 `js/pages/contract.js`)**에 표준계약서 Word 다운로드 버튼과 클릭 핸들러를 추가해줘."*

### 예시 2: 팝업/모달 수정
- ❌ *"영수증 올릴 때 뜨는 창에서 글자 좀 바꿔줘"*
-  *"**영수증 확인 모달(`src/modals/receipt-confirm-modal.html`)**에서 승인일시 입력 레이블 문구를 정제해줘."*

### 예시 3: 새로운 세금 계산기 추가
- ❌ *"새로운 세금 계산 기능 넣어줘"*
-  *"**세금 관리 페이지(`src/pages/tax.html`, `js/pages/tax.js`)**에 4대보험 간이 계산기 탭을 추가하고, 계산 로직은 **`js/tax-engine.js`**에 함수로 분리해줘."*

### 예시 4: 신규 데이터 필드 추가
- ❌ *"거래처에 메모 항목도 저장하고 싶어"*
-  *"**`appState.clients`** 객체에 `memo` 필드를 추가하고, **`src/modals/client-modal.html`**과 **`js/modals/client-modal.js`**에 메모 입력란을 반영해줘."*
