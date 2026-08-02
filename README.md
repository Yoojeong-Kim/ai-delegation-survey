# AI Proxy Delegation Study — Survey Web App

이 프로젝트는 별도의 백엔드 서버(Node.js 등) 없이 **순수 HTML/CSS/JS**와 **Google Apps Script**만을 이용하여 구동되는 정적 설문조사 웹 애플리케이션입니다. 현재 GitHub Pages를 통해 배포되어 있으며, 수집된 모든 데이터는 Google Sheets로 자동 전송됩니다.

---

## 📌 배포 주소 (접속 링크)

- **참가자용 (설문조사 링크)**: [https://yoojeong-kim.github.io/ai-delegation-survey/](https://yoojeong-kim.github.io/ai-delegation-survey/)
- **관리자용 (대시보드 링크)**: [https://yoojeong-kim.github.io/ai-delegation-survey/admin.html](https://yoojeong-kim.github.io/ai-delegation-survey/admin.html)

---

## 🔁 실험 Flow

```
접속 (index.html) → 조건 자동 배정 (서버 통신) →
안내문 (intro.html) →
기본 인적사항 Q1-Q5 (demographics.html) →
시나리오 1: 상황 확인 → Yes/No → Q6-Q15 (simulation.html) →
시나리오 2: 상황 확인 → Yes/No → Q6-Q15 (simulation.html) →
시나리오 3: 상황 확인 → Yes/No → Q6-Q15 (simulation.html) →
시나리오 4: 상황 확인 → Yes/No → Q6-Q15 (simulation.html) →
최종 질문 Q1-Q3 (post-survey.html) →
완료 및 데이터 제출 (complete.html)
```

---

## 🖼 시나리오 이미지 및 내용 수정 방법

이제 정적 웹사이트로 변경되었으므로, 시나리오 내용이나 이미지를 변경하려면 로컬 파일을 직접 수정하고 GitHub에 커밋해야 합니다.

1. **이미지 추가하기**
   - 사용할 이미지(JPG, PNG 등)를 로컬 프로젝트의 `images/` 폴더 안에 넣습니다.
   - 예: `sc1_ai.jpg`, `sc1_human.jpg`
2. **설정 파일(config.js) 수정하기**
   - `js/config.js` 파일을 엽니다.
   - 각 시나리오(`scenarioId: 1~4`) 안에 있는 `conditionImages` 객체에서 파일명을 실제 `images/` 폴더에 넣은 이미지 이름과 똑같이 맞춰줍니다.
   - 각 시나리오의 제목(`title`)과 상황 설명(`description`) 텍스트도 이 파일에서 바로 수정할 수 있습니다.
3. **적용하기**
   - 변경된 `images/` 폴더의 이미지들과 수정된 `js/config.js` 파일을 GitHub 레포지토리에 업로드(Push)하면 잠시 후 웹사이트에 자동 반영됩니다.

---

## 📊 Google Sheets (데이터베이스) 연동 관리

이 앱은 참가자들의 응답을 Google Sheets에 실시간으로 저장합니다. 새로 세팅하거나 업데이트해야 할 경우 아래를 참고하세요.

### 스크립트 수정 및 재배포
1. 구글 스프레드시트 상단 메뉴에서 **확장 프로그램(Extensions) → Apps Script** 클릭
2. 편집기 창에 프로젝트 내 **`google-apps-script.js`** 파일 내용 붙여넣기
3. 코드 수정 후 반드시 **배포(Deploy) → 새 배포(New deployment)** 클릭! (기존 배포 덮어쓰기 금지)
   - 유형 선택: **웹 앱(Web app)**
   - 다음 사용자 계정으로 실행: **나(Me)**
   - 액세스 권한 보유자: **모든 사용자(Anyone)**
4. 배포 완료 후 나타나는 **웹 앱 URL** 복사
5. 로컬의 `js/config.js` 파일을 열어 `GOOGLE_SCRIPT_URL` 값을 방금 복사한 URL로 변경하고 저장
6. `config.js`를 GitHub에 업로드

---

## 📋 CSV 컬럼 구조 (Google Sheets)

스프레드시트의 'Responses' 시트에 기록되는 열 구조는 다음과 같습니다.

```
participant_id, timestamp, server_timestamp, total_time_seconds, condition,
q1_gender, q2_birth_year, q3_ai_usage, q4_work_exp, q5_work_type, q5_other,
s1_yesno, s1_q6~s1_q15,
s2_yesno, s2_q6~s2_q15,
s3_yesno, s3_q6~s3_q15,
s4_yesno, s4_q6~s4_q15,
q86, q87, q88
```

---

## 🗂 프로젝트 파일 구조

```
survey-app/
├── google-apps-script.js         # Google Sheets 백엔드 구축용 스크립트 (구글에만 복붙)
├── index.html                    # 시작 페이지 및 조건 배정
├── intro.html                    # 실험 안내문
├── demographics.html             # 인구통계학적 질문
├── simulation.html               # 시나리오 진행 화면 (4회 반복)
├── post-survey.html              # 사후 질문 (General Attitudes)
├── complete.html                 # 최종 완료 화면
├── admin.html                    # 실시간 대시보드 화면
├── css/
│   └── style.css                 # 전체 레이아웃 및 디자인
├── js/
│   ├── config.js                 # 시나리오 내용, 이미지 파일명, 구글 스크립트 주소 설정
│   └── app.js                    # 공통 로직 및 세션 관리
└── images/                       # 시나리오에 사용되는 이미지 파일 (GitHub 업로드용)
```

---

## ⚠️ 주의사항

- **이미지 파일명 일치:** `js/config.js`에 작성된 이미지 이름과 `images/` 폴더 안의 실제 파일 이름(대소문자, 확장자 포함)이 **정확히 일치**해야 엑스박스가 뜨지 않습니다.
- **구글 스크립트 재배포:** Apps Script 코드를 수정했다면 무조건 **'새 배포(New deployment)'**를 해서 새 URL을 발급받아야 적용됩니다.
- **GitHub 캐시 딜레이:** 수정된 파일을 GitHub에 올리더라도 전 세계 서버망(CDN)에 반영되는 데 보통 1~3분 정도 소요됩니다. 엑스박스가 뜨면 조금 기다렸다가 새로고침(Ctrl + Shift + R) 해보세요.
