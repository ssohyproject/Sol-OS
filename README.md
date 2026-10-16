# SoloOS - 1인 사업가를 위한 올인원 ERP & 워크웨어 서비스

> **SoloOS**는 디지털 프리랜서, 1인 창업가, 콘텐츠 크리에이터를 위한 자금 흐름(런웨이), 일정 마감, 전자 계약, 세무 자동 분개 올인원 서비스입니다.

---

## 주요 기능 및 연동

### 1. 회원가입 및 사용자 인증 (Auth)
- **Google 원클릭 로그인**: Google 계정으로 1초 만에 회원가입 및 캘린더/드라이브 자동 연계
- **이메일 회원가입**: 1인 외주 개발, 출판, 지식창업 등 사업 유형별 맞춤 워크스페이스 제공
- **체험용 데모 계정 지원**: `demo@soloos.io` / `demo1234`

### 2. Google Workspace 연동 (구글 캘린더 & 구글 드라이브)
- **Google Calendar 실시간 동기화**: 프로젝트 마감 일정 및 세무 신고 일정 동기화 + RFC 5545 `.ics` 파일 다운로드 지원
- **Google Drive ERP 장부 백업**: `내 드라이브/SoloOS_ERP_Backups` 폴더에 장부, 세무 분개 데이터 백업 및 복원

### 3. Model Context Protocol (MCP) 연동
- Claude Desktop, Cursor, Antigravity AI Agent와 실시간 stdio 통신
- 8대 전용 도구(Tools) 제공: 재무 런웨이 분석, 세무 3대 역산, 거래 자동 분개, 구글 캘린더/드라이브 연계 등
- 웹 UI 내 **[MCP 연동 센터]**에서 1클릭 설정 복사 및 실시간 도구 테스트 지원

---

## 빠른 시작 (Quick Start)

```bash
# 1. 의존성 확인 및 서버 실행
npm start
# 웹 브라우저에서 http://localhost:3000 접속

# 2. MCP 서버 단독 실행
npm run mcp
```
