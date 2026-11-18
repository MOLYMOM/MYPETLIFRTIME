# 한 생애의 반려 배포 + 구글 검색 등록 가이드

전체 흐름: **GitHub에 올리기 → Render로 배포(무료) → 구글 서치 콘솔에 등록** (+ 선택: 네이버 서치어드바이저)
코딩 도구 없이 웹 브라우저만으로 할 수 있어요. 처음이면 30분 정도 걸려요.

---

## 1단계. GitHub에 코드 올리기
1. https://github.com 가입 → 오른쪽 위 **+ → New repository**
2. 이름: `hanpet` / **Public** 선택 → **Create repository**
3. 새 저장소 화면에서 **uploading an existing file** 클릭
4. 압축을 푼 `hanpet` 폴더 **안의 파일들**(server.js, game.js, i18n.js, style.css, index.html, package.json, render.yaml, favicon.svg, og.png …)을 끌어다 놓기 → **Commit changes**

## 2단계. Render로 배포하기 (무료)
1. https://render.com 가입 → **GitHub 계정으로 로그인**
2. 대시보드에서 **New + → Blueprint** 선택 → 방금 만든 `hanpet` 저장소 연결
   (render.yaml 덕분에 설정이 자동으로 채워져요. Blueprint가 안 보이면 **New + → Web Service** 선택 후
   Runtime `Node`, Build Command `echo ok`, Start Command `node server.js`, Instance Type `Free`)
3. 배포가 끝나면 `https://hanpet-xxxx.onrender.com` 같은 주소가 생겨요. 접속해서 게임이 뜨는지 확인!
4. 서비스 화면의 **Environment** 탭 → `SITE_URL` 값에 **방금 받은 주소**를 그대로 입력 (끝에 / 없이) → 저장
   - 이 값이 구글에 보여 줄 대표 주소(canonical), 사이트맵, 미리보기 이미지 주소에 쓰여요.

> **무료 플랜 참고**
> - 15분 동안 아무도 접속하지 않으면 서버가 잠들고, 다음 접속 때 깨어나는 데 1분 정도 걸려요.
> - 게임 진행과 저장은 모두 **플레이어의 브라우저**에 저장되므로, 서버가 잠들어도 키우던 아이는 사라지지 않아요.
>   (단, 브라우저 기록·사이트 데이터를 지우거나 다른 기기·브라우저로 접속하면 이어서 할 수 없어요.)

## 3단계. 구글 검색에 등록하기 (Google Search Console)
1. https://search.google.com/search-console 접속 → **속성 추가**
2. 오른쪽 **URL 접두어** 칸에 배포 주소 입력 (예: `https://hanpet-xxxx.onrender.com`) → 계속
3. 소유권 확인 방법 중 **HTML 태그** 선택 → `<meta name="google-site-verification" content="여기있는값">`에서
   **content 안의 값만** 복사
4. Render **Environment** 탭 → `GOOGLE_SITE_VERIFICATION`에 붙여넣기 → 저장 (자동 재배포, 1~2분)
5. 서치 콘솔로 돌아와 **확인** 클릭 → 성공!
6. 왼쪽 메뉴 **Sitemaps** → `sitemap.xml` 입력 → 제출
7. 위쪽 검색창에 배포 주소 입력 → **색인 생성 요청**

구글에 실제로 뜨기까지는 보통 **며칠~2주** 걸려요. 처음엔 "한 생애의 반려"처럼 이름으로 검색했을 때 먼저 잡히고,
"반려동물 키우기 게임" 같은 일반 검색어 순위는 방문자·링크가 쌓이면서 올라가요.

## 4단계(선택). 네이버 검색 등록 — 한국 사용자에게 중요
1. https://searchadvisor.naver.com → 웹마스터 도구 → 사이트 등록 (배포 주소)
2. 소유 확인: **HTML 태그** → content 값만 복사 → Render `NAVER_SITE_VERIFICATION`에 넣고 저장 → 확인
3. 요청 → **사이트맵 제출**: `https://내주소/sitemap.xml`

## 더 잘 검색되게 하는 팁
- **나만의 도메인**(예: hanpet.kr, 연 1~2만원대)을 사서 Render **Settings → Custom Domain**에 연결하면
  주소가 기억하기 쉽고 신뢰도도 올라가요. 연결 후 `SITE_URL`도 새 도메인으로 바꾸고 서치 콘솔에 새 속성으로 다시 등록하세요.
  (도메인이 바뀌면 브라우저 저장 데이터는 새 주소로 넘어가지 않아요.)
- 블로그·커뮤니티·SNS에 링크를 공유하면 색인과 순위에 도움이 돼요. 카톡에 링크를 붙이면 og.png 미리보기 카드가 떠요.
- 검색 결과 제목·설명 문구를 바꾸고 싶으면 `index.html` 맨 위 `<title>`과 `<meta name="description">`을 수정하세요.

## 이미 들어 있는 검색 최적화
| 항목 | 위치 |
|---|---|
| 검색 결과 제목·설명, 키워드 | index.html `<head>` |
| 대표 주소(canonical), 공유 미리보기(OG·트위터 카드) | index.html, `SITE_URL`로 자동 채움 |
| 구조화 데이터(VideoGame) | index.html JSON-LD |
| robots.txt, sitemap.xml | server.js가 자동 생성 |
| 소유 확인 태그(구글·네이버) | 환경변수로 자동 삽입 |
| 검색엔진이 읽는 소개 본문 | index.html `<div id="app">` 안 (게임이 시작되면 화면이 바뀌어 플레이어에겐 안 보여요) |

## 내 컴퓨터에서 실행해 보기
Node.js 18 이상이 설치돼 있다면 이 폴더에서 `node server.js` → 브라우저로 http://localhost:3000 접속.
