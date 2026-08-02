# AI Proxy Delegation Study — Survey Web App

## 📌 빠른 시작

### 1. 서버 실행
```bash
cd survey-app
npm install      # 최초 1회만
npm run dev      # 서버 시작 (포트 3000)
```

### 2. 브라우저에서 접속
- **참가자용**: http://localhost:3000
- **관리자용**: http://localhost:3000/admin/

---

## 🔁 실험 Flow

```
접속 → 조건 자동 배정 (교대 방식, 1→2→1→2→...) →
안내문 (Part 1 + 2) →
기본 질문 Q1-Q5 →
시나리오 1: 이미지 → Yes/No → Q6-Q15 →
시나리오 2: 이미지 → Yes/No → Q6-Q15 →
시나리오 3: 이미지 → Yes/No → Q6-Q15 →
시나리오 4: 이미지 → Yes/No → Q6-Q15 →
최종 질문 Q86-Q89 →
완료 (데이터 자동 저장)
```

---

## 🖼 이미지 추가 방법

관리자 페이지 (http://localhost:3000/admin/) → **Scenarios 탭**으로 이동

각 시나리오마다:
- **Condition 1 (AI Secretary)** 이미지 업로드 또는 URL 입력
- **Condition 2 (Human Secretary)** 이미지 업로드 또는 URL 입력
- 시나리오 제목, 설명 텍스트 편집

저장 후 바로 참가자 페이지에 반영됩니다.

---

## 📊 Google Sheets 연동

### 설정 방법
1. Google Sheets에서 새 스프레드시트 생성
2. **Extensions → Apps Script** 클릭
3. `google-apps-script.js` 파일의 내용 전체 붙여넣기
4. **Deploy → New deployment → Web App** 선택
   - Execute as: **Me**
   - Who has access: **Anyone**
5. 배포 후 URL 복사
6. 관리자 페이지 → **Settings 탭** → URL 붙여넣기 → Save

이후 모든 응답이 Sheets에 자동으로 한 행씩 추가됩니다.

---

## 💾 데이터 저장 위치

| 저장소 | 위치 | 설명 |
|--------|------|------|
| 로컬 백업 | `data/responses.json` | 서버에 자동 저장 (항상) |
| CSV 다운로드 | Admin → Responses → Download CSV | 관리자 페이지에서 다운로드 |
| Google Sheets | 설정한 스프레드시트 | 연동 시 자동 저장 |

---

## 📋 CSV 컬럼 구조

```
participant_id, timestamp, server_timestamp, condition,
q1_gender, q2_birth_year, q3_ai_usage, q4_work_exp, q5_work_type, q5_other,
s1_yesno, s1_q6~s1_q15,
s2_yesno, s2_q6~s2_q15,
s3_yesno, s3_q6~s3_q15,
s4_yesno, s4_q6~s4_q15,
q86, q87, q88, q89
```

---

## 🗂 프로젝트 구조

```
survey-app/
├── server.js                     # Express 서버
├── package.json
├── google-apps-script.js         # Google Sheets 연동 스크립트
├── data/
│   ├── counter.json              # 조건 배정 카운터 (자동 생성)
│   ├── config.json               # 시나리오/설정 저장 (자동 생성)
│   └── responses.json            # 응답 로컬 백업 (자동 생성)
└── public/
    ├── index.html                # 안내문 (시작 페이지)
    ├── demographics.html         # Q1-Q5
    ├── simulation.html           # 시나리오 + Q6-Q15
    ├── post-survey.html          # Q86-Q89
    ├── complete.html             # 완료 화면
    ├── admin/
    │   └── index.html            # 관리자 패널
    ├── css/style.css
    ├── js/app.js
    └── images/                   # 업로드된 이미지 저장 폴더
```

---

## ⚠️ 주의사항

- 실험 중 서버가 꺼지면 안 됩니다 (응답 수집 중단됨)
- 브라우저를 닫거나 뒤로 가면 진행 중인 데이터는 세션에만 있으므로 서버에 저장되지 않습니다
- 실험 시작 전 반드시 관리자 페이지에서 이미지를 업로드하세요
- 테스트 후 **Admin → Dashboard → Reset Counter**로 카운터를 초기화하세요
- 수집된 `data/responses.json`은 주기적으로 백업하세요
