# 반도체 후공정(Back-end) 장비 조사 노트

작성일: 2026-11-13
용도: 교육용 시뮬레이터(한국어)의 장비 일러스트(오리지널 아이소메트릭 SVG)와 작업 흐름 설명 참고

## 표기 규칙
- **[읽음]**: 내가 직접 WebFetch로 페이지 본문을 열어 확인한 출처
- **[검색요약]**: 검색 엔진 결과 요약만 봤고 원문은 열지 않았거나 열지 못한 출처. 근거로 쓰기 전에 원문을 다시 확인해야 함
- **[실패]**: 로드 실패(403/404/타임아웃 또는 PDF 바이너리라 텍스트 추출 불가)
- **[출처 미확인]**: 일반적인 업계 묘사지만 이번 조사에서 허용 출처로 뒷받침하지 못한 내용. 시뮬레이터에 쓰려면 별도 검증 필요
- 벤더와 뉴스룸 자료는 모두 **설명 출처**다. 시뮬레이션 규칙(수치, 판정 기준)의 근거로 쓰지 않는다.
- 논문 수치(예: 70 mW, 0.60 N)는 특정 와이어와 특정 장비 조건의 결과다. 일반 기준값이 아니다.

## 삼성전자 / SK하이닉스 공식 페이지 확인 결과 (요약)
- **삼성반도체 뉴스룸** "[반도체 8대 공정] 9탄 패키징 공정" [읽음]
  https://news.samsungsemiconductor.com/kr/%eb%b0%98%eb%8f%84%ec%b2%b4-8%eb%8c%80-%ea%b3%b5%ec%a0%95-9%ed%83%84-%ec%99%b8%eb%b6%80%ed%99%98%ea%b2%bd%ec%9c%bc%eb%a1%9c%eb%b6%80%ed%84%b0-%eb%b0%98%eb%8f%84%ec%b2%b4%eb%a5%bc-%eb%b3%b4%ed%98%b8/
  - 공정 흐름을 웨이퍼 절단 → 칩 접착 → 금선 연결(와이어 본딩/플립칩) → 성형(몰딩) → 패키지 테스트로 설명한다.
  - 절단을 "웨이퍼 소잉(Wafer Sawing)" 또는 "다이싱(Dicing)"이라 부르며, 다이아몬드 톱이나 레이저 광선을 쓴다고 쓴다.
  - 칩은 리드프레임이나 PCB에 접착한다. 패키지 테스트에는 검사장비(Tester)를 쓰고 전압, 전기신호, 온도, 습도 조건을 가한다.
  - **장비 제조사나 모델명은 언급하지 않는다.** 백그라인딩과 마킹은 이 글에 나오지 않는다.
- **SK하이닉스 뉴스룸(영문)** "Semiconductor Back-End Process Episode 6: Conventional Packages" (2023-08-03, 작성자 표기 SK hynix) [읽음]
  https://news.skhynix.com/semiconductor-back-end-process-episode-6-conventional-packages/
  - 백그라인딩(BG 테이프, 거친 휠 → 미세 휠 → 폴리싱 패드, 마운팅 테이프와 링 프레임) → 소잉(블레이드 다이싱, 레이저 다이싱, DBG) → 다이 어태치(액상 접착제는 디스펜서나 스텐실 인쇄, 필름형은 DAF/WBL, UV로 점착력 약화 후 픽업) → 와이어 본딩(캐필러리, EFO, 주로 금 와이어) → 몰딩(EMC, 트랜스퍼 몰딩과 컴프레션 몰딩) → 레이저 마킹 → 솔더볼 마운팅 → 싱귤레이션(블레이드로 스트립 절단 후 트레이) 순서다. 리드프레임 패키지는 트림/폼 공정을 거친다.
  - 단일 칩 패키지의 백그라인딩 두께는 대략 200~250 μm라고 쓴다.
  - **장비 제조사나 모델명은 언급하지 않는다.** 그림 출처는 Hanol Publishing이다.
- **SK하이닉스 뉴스룸(영문)** "Semiconductor Back-End Process Episode 1: Understanding Semiconductor Testing" [읽음]
  https://news.skhynix.com/semiconductor-back-end-process-episode-1-understanding-semiconductor-testing/
  - 패키지 테스트는 패키지 테스트 보드의 소켓에서 진행한다.
  - 패키지 후 번인은 TDBI(Test During Burn-In)라 부른다.
  - Hot 테스트는 스펙 최대 온도보다 10% 이상 높은 온도, Cold 테스트는 최소 온도보다 10% 낮은 온도, Room 테스트는 보통 25°C다. 여기에 Speed 테스트가 있다.
  - 이후 레이저 마킹, 트레이 적재, 외관(Visual) 검사로 크랙, 마킹, 트레이 적재 불량, 솔더볼 눌림이나 누락을 확인한다.
  - **장비 제조사는 언급하지 않는다.** 핸들러와 bin이라는 용어도 이 글에는 없다.
- SK하이닉스 국문 뉴스룸(news.skhynix.co.kr): 서민석 칼럼과 "D램·낸드 테스트 매니저" 글 모두 **403으로 로드 실패**했다 [실패]. 검색요약상 칼럼은 외부 기고이며, 공식 입장과 다를 수 있다는 면책 문구가 있다고 나온다.
- **결론:** 이번 조사에서 삼성전자나 SK하이닉스 공식 페이지가 특정 장비 벤더나 모델을 "사용한다"고 밝힌 사례는 **확인 못 함**.
  - 언론 보도에는 다음 내용이 있으나, 모두 공식 페이지 확인이 아니므로 규칙상 근거로 쓰지 않는다.
    - SK하이닉스가 한미반도체, ASMPT, 한화세미텍에서 HBM용 TC 본더를 도입했다.
    - 삼성전기가 한미반도체 MSVP를 수주했다(삼성전기는 삼성전자와 별개 회사다).

---

## 1. 백 그라인더 (Back Grinder / Grinder-Polisher, 테이핑·디테이핑 포함)

### 벤더와 제품
- **DISCO DGP8761** (Fully Automatic Grinder/Polisher, Φ300 mm) [읽음] https://disco.co.jp/eg/products/polisher_etcher/dgp8761.html
  - 백사이드 그라인딩과 스트레스 릴리프를 한 장비에서 처리한다. 25 μm 미만까지 얇게 갈 수 있다.
  - Z3 축은 드라이 폴리싱, 웨트 폴리싱(CMP 옵션), Poligrind/UltraPoligrind 중 하나를 쓴다.
  - DFM2800 마운터와 인라인으로 연결해 DAF를 부착할 수 있고, DBG와도 인라인 운용할 수 있다.
  - 후속 모델 DGP8762 [검색요약]: https://disco.co.jp/eg/products/polisher_etcher/dgp8762.html
- **DISCO DFM2800** (인라인 웨이퍼 마운터) [읽음] https://www.disco.co.jp/eg/products/mounter/dfm2800.html
  - 그라인더에서 웨이퍼를 받아 다이싱 테이프 또는 DAF 일체형 다이싱 테이프를 붙이고 프레임에 마운트한다.
  - 표면 보호 테이프는 옵션 기구로 박리한다. UV 테이프를 쓰면 박리 전에 UV를 조사한다. 완료된 프레임은 카세트에 수납한다.
  - DGP8761과 연동하면 그라인더 조작부에서 레시피 선택과 시작/정지를 할 수 있다.
- **ACCRETECH(Tokyo Seimitsu) PG3000RMII / PG3000RMX** (Polish Grinder) [읽음] https://www.accretech.com/en/product/semicon/semi/polish/pg3000rmx.html
  - "high accuracy grinding and wet polishing"으로 데미지 없는 가공을 내세운다. 처리량은 20 WPH @ 25 μm이고 메모리용 게터링을 지원한다.
  - RM 기구가 DC 테이프 부착과 BG 테이프 디테이핑을 맡는다.
  - 검색요약에 따르면 PG3000RMX는 동일 척 테이블 위에서 거친 연삭 → 미세 연삭 → 폴리싱 → 세정을 진행한다 [검색요약]. 카탈로그 PDF는 바이너리라 텍스트 추출에 실패했다 [실패].

### 외형과 레이아웃 (DGP8761 페이지 기준 [읽음])
- 앞쪽(로드 포트) **카세트**: 오픈 카세트 또는 FOUP
- **로봇 픽**: 카세트에서 웨이퍼를 꺼내 **포지셔닝 테이블**에 올려 센터링한다.
- **T1 암**: 웨이퍼를 **척 테이블**에 로딩한다.
- 척 테이블 4개, 연삭 축 3개
  - Z1: 거친 연삭(rough), Φ300 다이아몬드 휠
  - Z2: 미세 연삭(fine)
  - Z3: 드라이 폴리싱(Φ450 휠) 또는 웨트 폴리싱 패드
- **T2 암**: 웨이퍼를 **스피너 테이블**로 옮겨 세정하고 건조한다.
- 외형 치수는 약 1,690 × 3,315 × 1,800 mm, 무게는 약 6.7~6.9 t이다. 길쭉한 직육면체 장비이며, 인라인 마운터(DFM2800)를 옆에 붙일 수 있다.
- 페이지에는 턴테이블 언급이 없다. 그림에서는 "척 테이블 여러 개가 축 아래를 순환"하는 정도로만 표현하는 것이 안전하다.
- 조작 패널(터치패널) 모습: [출처 미확인]

### 운영 흐름과 용어
1. 웨이퍼 앞면에 **BG 테이프(백그라인딩 테이프, 보호 테이프)** 라미네이트 (SK hynix Ep.6 [읽음])
2. 카세트 로드 → **레시피** 선택(목표 두께 등). DFM2800 연동 시 레시피 선택은 DISCO DFM2800 페이지 [읽음]
3. **거친 연삭 → 미세 연삭 → 스트레스 릴리프(드라이 폴리싱 등)** (DISCO DGP8761, DISCO thin grinding 라이브러리 [읽음], SK hynix Ep.6 [읽음])
4. 목표 두께에 가까워지면 휠 스핀들 이송 속도를 줄여 연삭 부하를 낮춘다 (DISCO thin grinding [읽음])
5. 스피너 세정·건조 → (인라인) **다이싱 테이프 또는 DAF 부착, 링 프레임 마운트 → BG 테이프 박리(디테이핑)**, UV 테이프면 UV 조사 (DISCO DFM2800 [읽음], ACCRETECH PG3000RMII [읽음], SK hynix Ep.6 [읽음])
6. 프레임에 마운트된 웨이퍼를 카세트에 수납 → 다이싱 공정으로 이동
- 변형 공정
  - **DBG(Dicing Before Grinding)**: 먼저 하프컷하고 그 뒤에 연삭 (SK hynix Ep.6 [읽음], DISCO [읽음])
  - **SDBG**: 스텔스 다이싱 후 연삭 (DISCO SDBG 검색요약 [검색요약])

### 산출물과 결함/검사
- 산출물: 목표 두께로 얇아지고 프레임에 마운트된 웨이퍼
  - 예: DISCO 기술 리뷰의 4~40 μm 사례, TTV 2 μm 미만 [검색요약]
  - SK hynix는 단일 칩 패키지를 대략 200~250 μm로 쓴다 [읽음]
- 결함 (DISCO thin grinding [읽음])
  - **엣지 칩핑(edge chipping)**: 얇아지면 웨이퍼 가장자리가 날카로워져 생긴다. 대책은 엣지 트리밍.
  - **웨이퍼 파손(크랙)**
  - **연삭 데미지층**: 다이 강도 저하의 원인이며, 스트레스 릴리프로 제거한다.
  - **휨(warpage)**: 연삭 데미지와 관련이 있다(관련 글 링크만 확인).
  - 패드와 웨이퍼 사이 파티클 끼임은 파손 원인이다(DFM2800 [읽음]).
- 검사 방법: 페이지에 구체적인 설명이 없음 → **확인 못 함**

### 이 섹션에서 읽은 출처
- [읽음] https://disco.co.jp/eg/products/polisher_etcher/dgp8761.html
- [읽음] https://disco.co.jp/eg/solution/library/grinder/thin.html
- [읽음] https://www.disco.co.jp/eg/products/mounter/dfm2800.html
- [읽음] https://www.accretech.com/en/product/semicon/semi/polish/pg3000rmx.html
- [읽음] https://news.skhynix.com/semiconductor-back-end-process-episode-6-conventional-packages/
- [실패] https://www.accretech.com/jp/assets/pg3000rmx.pdf (바이너리)
- [검색요약] DISCO TR16-06 박막 연삭 기술 리뷰 PDF, DGP8762 페이지

---

## 2. 웨이퍼 다이싱 소 (Blade Dicing, 레이저/스텔스 다이싱 포함)

### 벤더와 제품
- **DISCO DFD6362** (Fully automatic, Φ300 mm, Facing dual spindle) [읽음] https://www.disco.co.jp/eg/products/dicer/dfd6362.html
- **DISCO DAD3351** (Semi-automatic, 단일 스핀들, 최대 Φ8") [읽음] https://disco.co.jp/eg/products/dicer/dad3351.html
  - 1.8 kW 스핀들, 6,000~60,000 min⁻¹
  - 커프 체크용 현미경 링 라이트 3채널
  - 소프트웨어: XIS(현미경 화면에 조작 버튼 배치), 웨이퍼 매핑, 로그 뷰어
- **ACCRETECH AD3000T-PLUS** (Fully automatic, Φ300 mm) [읽음] https://www.accretech.com/en/product/semicon/semi/dicer_semi/ad3000t-plus.html
  - 2축 대향 스핀들을 대각선으로 배치했다. 1.8 kW, 최대 60,000 rpm.
  - OPC(광학 커터 셋) 2기, 옵션으로 자동 블레이드 교환(ABES)
  - 최대 12인치 프레임(SEMI G74)
- **레이저/스텔스 다이싱**
  - DISCO Stealth Dicing 라이브러리 [읽음] https://disco.co.jp/eg/solution/library/laser/stealth.html
    - 웨이퍼 내부에 레이저를 집속해 개질층을 만들고 **테이프 익스팬션**으로 분리한다.
    - 200°C 이상에서 테이프를 수축시켜 처짐을 없앤다.
    - 드라이 공정이라 절삭 부스러기가 적고 스트리트를 좁힐 수 있다. SD 엔진은 Hamamatsu Photonics가 개발했다.
    - 제품 예: DFL7362, DFL7341 [검색요약]
  - **EO Technics LMC3200G / LMC3200D** [읽음] https://www.eotechnics.com/page/products/equipment_catno3.php
    - G(그루빙): 쏘우레인의 Low-k와 금속 배선층을 레이저 스크라이빙으로 미리 제거해 후속 블레이드 다이싱의 칩핑을 최소화한다.
    - D(다이싱): 주로 200 μm 이하의 얇은 웨이퍼를 레이저로 직접 절단한다.
  - SK hynix Ep.6 [읽음]: 블레이드 다이싱은 얇은 웨이퍼를 깨뜨리기 쉽고, 레이저 다이싱은 비접촉이라 얇은 웨이퍼에 적합하다고 설명한다.

### 외형과 레이아웃 (DFD6362 [읽음] 기준 + 표시된 항목은 출처 미확인)
- **카세트**(Φ300 프레임 카세트)
  - 카세트 엘리베이터 형태 자체는 페이지에 명시되지 않음 → [출처 미확인]
- **아래쪽 암**: 카세트 → **프리얼라인 스테이지**
- **척 테이블**: 프레임에 붙은 웨이퍼를 진공 흡착. 옵션으로 척 테이블 워터 커튼(CTWC).
- **대향(facing) 듀얼 스핀들**: Z1과 Z2가 마주 보며, 각 스핀들 끝에 원형 **블레이드**와 **휠 커버**가 있다. Y1/Y2 절삭 범위는 310 mm.
- **위쪽 암**: 척 테이블 → **스피너 테이블**(세정·건조). 옵션으로 분무 노즐.
- **현미경 카메라 화면과 조작 버튼이 같은 화면에 있는 GUI**
  - DFD6362: "operation buttons on the same screen as the microscope picture"
  - 터치패널 여부는 페이지에 없음 → [출처 미확인]
- 옵션: **자동 블레이드 교환기**(2D 바코드로 블레이드 식별)

### 운영 흐름과 용어
1. 마운트된 웨이퍼(링 프레임 + 다이싱 테이프)가 든 카세트를 로드 → 디바이스 데이터(**레시피**) 선택
   - "디바이스 데이터 변경으로 다른 패키지 처리": DISCO QFN 페이지 [읽음]
2. **얼라인먼트(alignment)**: 프리얼라인 후 현미경 패턴 인식. DAD3351에는 멀티 얼라인먼트 옵션이 있다 [읽음].
   - 국내 현장 용어 **티칭**: 허용 출처 근거는 **확인 못 함**
3. **블레이드 높이 셋업**: DAD3351의 NCS 비접촉 셋업 [읽음], AD3000T의 OPC [읽음]
4. 절삭 조건
   - **스핀들 회전수**(DAD3351 6,000~60,000 min⁻¹ [읽음])
   - **이송 속도(feed speed)**
   - **블레이드 그릿(#2000, #4800 등)**(DISCO thin dicing [읽음])
   - **컷 깊이**(DFD6370 height control [읽음])
5. **싱글 컷 / 스텝 컷(Z1 → Z2 2단 절삭)** (DISCO thin dicing [읽음])
6. **인덱스(index)**: 스트리트 간격만큼 이동하며 반복 절삭. 용어 자체는 DISCO QFN 페이지에 "varying indexes"로 나온다 [읽음].
7. **커프 체크(kerf check)**: 절삭 폭과 칩핑을 현미경으로 확인한다. DISCO는 Short Kerf Check를 쓴다 (DISCO thin dicing [읽음], DAD3351 [읽음]).
8. 스피너 세정·건조 → 카세트로 언로드
- **블레이드 드레싱(dressing)**: DISCO 공식 페이지에서는 **확인 못 함**. 대학 랩 게시물(MIT labnetwork)에 "automatic blade dressing" 언급이 있으나 허용 출처가 아니다 [검색요약].
- **블레이드 자생(self-sharpening)**: 일정한 가공 부하를 유지해야 블레이드 자생 작용이 유지된다 (DISCO thin dicing [읽음]).

### 산출물과 결함/검사
- 산출물: 테이프 위에서 개별 다이로 분리된 웨이퍼(프레임 상태 유지)
- 결함
  - **이면 칩핑(backside chipping)**: 얇을수록 증가하며 미세 그릿 블레이드로 줄인다 (DISCO [읽음])
  - DISCO 원문: "chipping inevitably occurs in blade dicing … keep chipping inside the street width" [검색요약]
  - 앞면 막이나 TEG에 의한 **블레이드 막힘(clogging)** (DISCO [읽음])
  - 얇은 웨이퍼 파손 (SK hynix [읽음])
  - 레이저 그루빙은 Low-k 칩핑 대책이다 (EO Technics [읽음])
- 검사: **커프 체크**(커프 폭, 칩핑)

### 이 섹션에서 읽은 출처
- [읽음] https://www.disco.co.jp/eg/products/dicer/dfd6362.html
- [읽음] https://disco.co.jp/eg/products/dicer/dad3351.html
- [읽음] https://disco.co.jp/eg/solution/library/dicing/dicing_thin.html
- [읽음] https://disco.co.jp/eg/solution/library/laser/stealth.html
- [읽음] https://www.accretech.com/en/product/semicon/semi/dicer_semi/ad3000t-plus.html
- [읽음] https://www.eotechnics.com/page/products/equipment_catno3.php (curl로 HTML 받아 텍스트 추출)
- [읽음] https://news.skhynix.com/semiconductor-back-end-process-episode-6-conventional-packages/
- [읽음] 삼성반도체 뉴스룸 8대 공정 9탄(위 URL): "다이아몬드 톱이나 레이저 광선"
- [검색요약] DISCO SDBG 페이지, DFL7362 보도자료, TR16-01

---

## 3. 다이 본더 / 다이 어태치 (Die Bonder, DAF 포함)

### 벤더와 제품
- **ASMPT**
  - Epoxy Die Attach 라인: AD832i(소형 패키지 QFN/SOIC/SOP, 듀얼 디스펜싱, 6 mil 다이) [읽음] https://semi.asmpt.com/en/products/icd/da/epoxy-da/ad832i
  - AD8312Plus, INFINITE(12인치) [검색요약]
  - ASMPT 기술 기사 "Innovative die attach solutions for advanced BLT control" [읽음] https://semi.asmpt.com/en/news-center/market-insights/innovative-die-attach-solutions-for-advanced-blt-control/
- **Besi**
  - Esec 2100 hS iXplus (에폭시 다이 본더) [읽음] https://www.besi.com/products-technology/product-details/product/esec-2100-hs-ixplus/
    - 웨이퍼 4~12", 다이 0.5~20 mm, 본드 포스 0.2~20 N, 본드 가열 최대 200°C, 최대 20,000 UPH
    - 4MP 비전, AI 에폭시 형상 검사, 업루킹 비전, 듀얼 스테이지 다이 이젝터, 매거진 핸들러 입력(MHIN) 옵션
  - 제품군 목록(Die Bonding, Soft Solder, Flip Chip, TCB, Hybrid) [읽음] https://www.besi.com/products-technology/product-details/productgroup/soft-solder-die-bonding/
  - Esec 2100 hS ix: "simple DAF only" [검색요약]. 해당 페이지는 404였다 [실패].
- **DAF 관련**
  - SK hynix Ep.6 [읽음]: 필름형 접착제는 DAF 또는 WBL이라 하며 적층 칩에 선호된다. 다이싱 중에는 강하게 붙어 있다가 UV를 받으면 점착이 약해져 픽업된다.
  - DISCO DFM2800 [읽음]: DAF 일체형 다이싱 테이프 부착
- **Hanmi Semiconductor**: TC 본더(HBM용 TC BONDER 4.5 GRIFFIN 등)가 제품 목록에 있다 [읽음, 목록만]. 상세 설명은 이미지라 텍스트 **확인 못 함**.

### 외형과 레이아웃
- 출처로 확인한 구성요소
  - **웨이퍼(프레임) 공급부**: 다이싱 테이프 위의 다이 (ASMPT [읽음])
  - **다이 이젝터**: Besi 옵션 "Dual Stage Die Ejector" [읽음]
  - **픽앤플레이스 / 본드 암 / 본드 헤드** (Besi P&P, ASMPT bond arm [읽음])
  - **에폭시 디스펜서(싱글/듀얼)** (Besi, ASMPT [읽음])
  - **기판(리드프레임/스트립) 핸들링, 매거진 입력** (Besi MHIN, ASMPT "high-density leadframe handling" [읽음])
  - **비전 카메라(다운/업 루킹)** (Besi [읽음])
- 배치 형태(웨이퍼 테이블이 앞쪽 원형 스테이지이고 인덱서 레일이 좌→우 등): [출처 미확인]

### 운영 흐름과 용어
1. 기판 매거진과 웨이퍼 프레임 로드 → 레시피 선택: [출처 미확인] 일반 흐름
2. (DAF가 아닐 때) **에폭시 디스펜싱 / 패턴 라이팅** (ASMPT [읽음], Besi "continuous epoxy pattern writing" [읽음])
3. 다이 테이프에서 **픽업**: 공압 픽업 제어 (ASMPT [읽음]), 이젝터 (Besi [읽음]), UV 후 점착 약화 (SK hynix [읽음])
4. 비전으로 위치를 보정한 뒤 **본딩(본드 포스)** (Besi 0.2~20 N [읽음], ASMPT "bonding force control" [읽음])
5. **BLT(Bond Line Thickness)** 비접촉 측정과 실시간 보정 (ASMPT INFINITE [읽음]), 에폭시 형상 검사 (Besi [읽음])
6. **경화(cure)**: 고온에서 에폭시를 경화한다 (ASMPT [읽음])
7. 매거진으로 언로드: [출처 미확인]
- SPC 데이터: ASMPT AD832i "Graphical SPC data" [읽음]
- 스트립 매핑(E142): Besi 제품 목록 [읽음, 이름만]

### 산출물과 결함/검사
- 산출물: 다이가 접착된 리드프레임 또는 기판 스트립
- 결함 (ASMPT 기사 [읽음])
  - **BLT 불균일**
  - **다이 틸트(tilt)**
  - **에폭시 오버플로/스필**
  - **보이드(void)**
  - **필렛 높이(fillet height)**
  - **다이 휨, 위치 오차, 다이 크랙, 배치 실패**
- 검사: 비전과 에폭시 형상 검사, 높이 측정 (Besi [읽음])

### 이 섹션에서 읽은 출처
- [읽음] https://semi.asmpt.com/en/news-center/market-insights/innovative-die-attach-solutions-for-advanced-blt-control/
- [읽음] https://semi.asmpt.com/en/products/icd/da/epoxy-da/ad832i
- [읽음] https://www.besi.com/products-technology/product-details/product/esec-2100-hs-ixplus/
- [읽음] https://www.besi.com/products-technology/product-details/productgroup/soft-solder-die-bonding/
- [읽음] https://news.skhynix.com/semiconductor-back-end-process-episode-6-conventional-packages/
- [실패] https://besi.com/products-technology/product-details/product/esec-2100-hs-ix (404)

---

## 4. 와이어 본더 (Wire Bonder)

### 벤더와 제품
- **Kulicke & Soffa (K&S)**
  - Ball Bonder 페이지 [읽음] https://www.kns.com/products-services/ball-bonder
    - 원문: "K&S is the market leader in ball bonder technologies." 회사 자체 주장이다.
    - 개별 모델 설명은 페이지에 없었다.
  - Ball Bonding 기술 페이지 [읽음] https://www.kns.com/products-services/ball-bonding
    - 공정 설명: 금이나 구리 와이어 끝에 미세한 구형 볼을 만들고, 열·압력·초음파로 **세라믹 캐필러리**를 써서 다이 패드에 먼저 본딩한 뒤 와이어를 **루프**시켜 기판이나 리드프레임에 연결한다.
    - 공정 소프트웨어: ProCu, ProStitch Plus, ProOverhang, ProCu Loop, AutoOLP
  - Capillaries 페이지 [읽음]: 개요만 있다.
  - RAPID / RAPID Pro 모델명: K&S 공식 페이지에서는 **확인 못 함** (DirectIndustry 등 제3자 출처 [검색요약])
- **ASMPT**
  - Ball bonding 페이지 [읽음] https://semi.asmpt.com/en/products/icd/wb/ball-bonding
    - AERO PRO, AERO 시리즈
    - X-POWER(AEROducer 트랜스듀서, 테이블 스크러빙 없는 본딩)
    - AEROEYE(공정 모니터링)
    - Al, Pd, Cu 와이어 대응
  - XPOWER 2.0 보도자료 [읽음] https://semi.asmpt.com/en/news-center/press-releases/introducing-xpower-2.0-revolutionizing-wire-bonding-in-semiconductor-manufacturing
  - Eagle AERO 제품 페이지는 404 [실패]
- **Amkor** interconnect 페이지 [검색요약]: 금 대체 와이어로 Cu, PdCu, 은 합금을 쓴다. https://amkor.com/technology/interconnect/
- 논문 예시(장비): KAIJO FB-988 (PMC 논문 [읽음])

### 외형과 레이아웃
- 출처로 확인한 구성요소
  - **본드 헤드와 트랜스듀서(초음파)** (ASMPT [읽음])
  - **캐필러리**: 와이어를 안내하고 본딩하는 세라믹 툴 (K&S [읽음], SK hynix Ep.6 [읽음])
  - **EFO(Electronic Flame-Off)**: 스파크로 와이어 끝을 녹여 FAB(Free Air Ball)를 만든다 (SK hynix Ep.6 [읽음], PMC 논문 [읽음])
  - **가열**: 논문 조건은 220°C (PMC [읽음])
- 히트 블록, 윈도 클램프, 입출력 **매거진 핸들러**, 인덱서 레일, 현미경 겸 카메라, 와이어 스풀: 일반적인 묘사지만 허용 출처로는 **확인 못 함** [출처 미확인]. 검색에서는 특허 문서만 나왔다.

### 운영 흐름과 용어
1. 다이 어태치를 마친 스트립 매거진 로드 → 레시피(본딩 프로그램) 선택 → 얼라인/티칭: [출처 미확인] 일반 흐름
2. **EFO → FAB 형성** (EFO 전류와 시간이 FAB 형상을 결정한다. 논문 최적값 0.030 A, 0.8 ms) (PMC [읽음])
3. **1st bond(볼 본드)**: 패드 위에 열·압력·초음파 (K&S [읽음], SK hynix [읽음])
4. **루프(loop)** 형성 (K&S [읽음])
   - **루프 하이트**: Amkor 은 합금 와이어의 "ultra-low loop height" [검색요약]
5. **2nd bond(스티치/웨지 본드)**: 리드나 기판 위 (PMC [읽음], SK hynix "ball and stitch bonds" [읽음])
6. **테일(tail)** 길이: 논문은 0.15 mm (PMC [읽음])
- 주요 파라미터: **USG(초음파) 파워**, **본드 포스**, 본딩 시간, 온도
  - 논문 볼 본드 최적값: 70 mW, 0.60 N
  - 웨지 본드: 95 mW, 0.85 N
  - (PMC [읽음]) 특정 와이어 기준값이므로 일반화하면 안 된다.

### 산출물과 결함/검사
- 산출물: 와이어로 연결된 스트립
- 결함과 평가 (PMC [읽음])
  - 파워와 포스가 과하면 **넥 크랙(neck crack)**, **볼 오버플로**, 패드 변형
  - 부족하면 접합 강도가 낮아진다
- 평가 방법: **볼 시어 테스트**, **와이어 풀 테스트**, 웨지 풀, SEM 관찰
- **와이어 스윕(wire sweep)**: 와이어 본더가 아니라 몰딩 결함이다. 허용 출처로는 **확인 못 함**(4·5절 참고).
- NSOP(Non-Stick On Pad) 같은 장비 알람 용어: **확인 못 함**

### 이 섹션에서 읽은 출처
- [읽음] https://www.kns.com/products-services/ball-bonder
- [읽음] https://www.kns.com/products-services/ball-bonding
- [읽음] https://www.kns.com/products-services/capillaries
- [읽음] https://semi.asmpt.com/en/products/icd/wb/ball-bonding
- [읽음] https://semi.asmpt.com/en/news-center/press-releases/introducing-xpower-2.0-revolutionizing-wire-bonding-in-semiconductor-manufacturing
- [읽음] https://pmc.ncbi.nlm.nih.gov/articles/PMC7465270/ (Cao et al., Micromachines 2020, 11(8):777, CC BY 오픈액세스)
- [읽음] https://news.skhynix.com/semiconductor-back-end-process-episode-6-conventional-packages/
- [실패] https://semi.asmpt.com/en/products/icd/wb/ball-bonding/eagle-aero (404)
- [실패] https://www.mdpi.com/2072-666X/14/8/1587 (403)
- [실패] https://nrf.aux.eng.ufl.edu/_files/documents/144.pdf (K&S 4124 매뉴얼 PDF, 텍스트 추출 실패)

---

## 5. 트랜스퍼 몰딩 프레스 (컴프레션 몰딩 포함)

### 벤더와 제품
- **TOWA** 몰딩 장비 개요 [읽음] https://www.towajapan.co.jp/en/products/molding/
  - 트랜스퍼 방식: 유동성 수지를 **게이트(supply port)**를 통해 칩 주변에 공급한 뒤 경화한다.
  - 컴프레션 방식: 미리 공급한 유동성 수지에 칩을 담근 뒤 경화한다.
  - 시리즈: YPM, CPM, PMC, LCM, FFT, EZS, Y1R, Y1E와 이형 필름(T-series)
  - 초정밀 금형 페이지에는 "transfer mold in the multi-plunger design" 문구가 있다 [검색요약].
- **TOWA YPM 시리즈(트랜스퍼)** [읽음] https://www.towajapan.co.jp/en/products/molding/ypm/
  - YPM1180: 리드프레임 최대 100×300 mm, 사이드/탑 게이트, 이형 필름 대응
  - YPM1200: 200톤 프레스, 듀얼 플런저와 롱 태블릿 옵션, 플런저 분진 수집
  - YPM1080-SP: MUF
  - YPM1250-EPQ: 2.5D/3D/칩렛
- **TOWA CPM 시리즈(컴프레션)** [읽음] https://www.towajapan.co.jp/en/products/molding/cpm/
  - 자동 수지 계량 디스펜서(과립/액상)
  - 이형 필름 프리컷
  - WLP/PLP, HBM, 2.5D/3D 대응
  - CPM1180은 cavity-down 구조이며 최대 625×620 mm 패널
- SK hynix Ep.6 [읽음]
  - 트랜스퍼 몰딩: EMC 태블릿을 녹여 금형으로 밀어 넣는다. 패키지가 얇아지고 기판이 커지면서 한계가 있다.
  - 컴프레션 몰딩: 금형에 EMC 분말을 미리 채운다.
  - EMC: 열경화성 수지와 무기 필러로 이루어진다.
- ASMPT, Besi의 몰딩 장비: 이번 조사에서 공식 페이지를 열지 않음 → **확인 못 함**

### 외형과 레이아웃
- 출처로 확인한 구성요소
  - **프레스**(톤수 표기, 상/하 구동원): YPM1120은 상·하 독립 AC 서보 [읽음]
  - **플런저와 태블릿 공급**: YPM1200 [읽음]
  - **이형 필름**: YPM1180, CPM [읽음]
  - **핸들러 로봇**: CPM1080 Full Auto [읽음]
  - **수지 디스펜서**: CPM [읽음]
  - **보트 캐리어**: YPM1250-EPQ [읽음]
- 모듈형 프레스를 여러 대 나란히 둔 구성: 원문 표현은 "modular press"와 "modular for different production volumes" [읽음]
- 로더/언로더, 디게이팅, 금형 클리너, 매거진 스테이션의 배치: [출처 미확인]

### 운영 흐름과 용어
1. 와이어 본딩된 스트립(매거진) 로드 → 레시피(금형 온도, 트랜스퍼 압력 등) 선택: [출처 미확인] 일반 흐름
2. 프리히트된 스트립을 하형 **캐비티**에 세팅하고 클램프한다: 캐비티 용어는 CPM "cavity-down" [읽음]
3. **EMC 태블릿**을 **포트**에 투입하고 **플런저**로 밀어 넣는다 → **런너/게이트** → 캐비티 충전
   - 태블릿과 플런저: TOWA YPM, SK hynix [읽음]
   - 게이트: TOWA [읽음]
   - 포트, 런너, 컬(cull): TOWA 페이지에 없음 → [출처 미확인]
4. 금형 안에서 경화(cure) → 형 개방 → 이젝트 → 디게이트: [출처 미확인]
5. (별도 공정) PMC(Post Mold Cure): **확인 못 함**
- 컴프레션: 캐비티에 수지를 계량해 디스펜스(과립/액상) → 기판을 담금 → 압축 경화 (TOWA CPM, SK hynix [읽음])

### 산출물과 결함/검사
- 산출물: EMC로 봉지된 몰드 스트립
- 결함
  - TOWA PMC 시리즈: 두께 정확도 요구 [읽음]
  - YPM: 에지 게이트로 수지 누출(flash) 방지 [읽음]
  - **와이어 스윕, 보이드, 미충전(incomplete fill), 박리(delamination)**: 검색에서 나온 출처가 대부분 특허나 학회 자료라 허용 출처로는 **확인 못 함**
  - Fraunhofer 소장 오픈액세스 논문(J. Microelectron. Electron. Packag., DOI 10.4071/IMAPS.954402)은 EMC 보관과 습도가 보이드와 와이어 스윕에 미치는 영향을 다룬다 [검색요약, 원문 미열람].
- 검사: X-ray, SAT(초음파) 등 → **확인 못 함**

### 이 섹션에서 읽은 출처
- [읽음] https://www.towajapan.co.jp/en/products/ (제품 목록)
- [읽음] https://www.towajapan.co.jp/en/products/molding/
- [읽음] https://www.towajapan.co.jp/en/products/molding/ypm/
- [읽음] https://www.towajapan.co.jp/en/products/molding/cpm/
- [읽음] https://news.skhynix.com/semiconductor-back-end-process-episode-6-conventional-packages/
- [읽음] 삼성반도체 뉴스룸 9탄: 성형은 화학 수지로 밀봉한다
- [실패] https://astesj.com/v03/i06/p57 (몰딩 결함 사례 연구, 타임아웃)

---

## 6. 레이저 마커 (Laser Marker)

### 벤더와 제품
- **EO Technics(이오테크닉스)** 반도체 장비 페이지 [읽음] https://www.eotechnics.com/page/products/equipment_catno3.php
  - **Strip marker (2 beam/4 beam)**: "slot 과 stack magazine을 사용하여 loading/unloading"
    - Strip 핸들링 방식에 따라 **shuttle 타입**(스트립을 셔틀에 올려 이동)과 **rail 타입**(indexing motor로 레일을 따라 이송)이 있다.
    - 1 in 1 out, 2 in 2 out 구성
  - **Tray marker**: compact **U type**과 conventional **I type**
  - 레이저별 시리즈
    - SC: CO₂
    - SVL: End-pumped Nd:YVO₄
    - SFL: Fiber
    - SLD: Diode-pumped Nd:YAG
    - 모두 "align vision module을 통한 개별 align"을 제공하며 EMC mold, plastic, PCB, metal, ceramic 마킹용이다.
    - 1 head–1 beam, 2 head–2 beam, 4 beam 구성
  - **Wafer back side marker CSM3200/3300**: chip scale wafer level marker. 스캐너 정확도를 자동 보정(calibration)하고 **자동 마킹 검사**를 한다.
  - **Wafer top side marker WTM200/300**: reference die, bad die, wafer ID를 마킹한다.
  - **Wafer ID marker WM080/012**: OCR edit 기능
- **Hanmi Semiconductor LASER MARK 3000S**: 제품 목록에 있음 [읽음]. 상세는 이미지라 **확인 못 함**.
- SK hynix Ep.6 [읽음]
  - EMC 같은 재료를 레이저로 태워 제품 정보, 고객 패턴, 코드를 각인한다. 불량 추적에 도움이 된다.
  - 검정 EMC가 가독성을 높인다. 대안으로 잉크 마킹이 있다.
- SK hynix Ep.1 [읽음]: 테스트 후 레이저 마킹 장비를 쓴다.

### 외형과 레이아웃 (EO Technics 문구 기반)
- 양쪽 끝에 **매거진(slot/stack) 로더와 언로더**가 있다.
- 가운데 **셔틀 또는 레일 인덱서**
- 위쪽에 **레이저 헤드(1~2개, 스캐너)**와 **얼라인 비전 카메라**
- Tray marker는 트레이를 투입하며 U자형(컴팩트) 또는 I자형(직선) 배치다.
- 흄 집진기와 안전 커버: [출처 미확인]

### 운영 흐름과 용어
1. 몰드 스트립 매거진 로드 → 마킹 내용(텍스트, 로고, 코드, 로트 정보)과 레시피 선택: [출처 미확인] 일반 흐름
2. 스트립 인덱싱(셔틀/레일) → **align vision으로 유닛별 개별 얼라인** (EO [읽음])
3. 레이저 마킹(멀티 빔 동시 마킹) (EO [읽음])
4. **마킹 검사**: CSM의 자동 마킹 검사, FPD 마커의 marking inspection (EO [읽음])
5. 언로드 매거진

### 산출물과 결함/검사
- 산출물: 표면에 식별 정보가 각인된 스트립, 트레이 유닛 또는 웨이퍼
- 결함과 검사: 마킹 품질 검사(자동 마킹 검사)가 있다는 사실만 확인했다. 구체적인 불량 유형(희미함, 위치 오프셋, 깊이 과다 등)은 **확인 못 함**.
- SK hynix Ep.1 [읽음]: 최종 외관 검사 항목에 "markings"가 포함된다.

### 이 섹션에서 읽은 출처
- [읽음] https://www.eotechnics.com/page/products/equipment_catno3.php
- [읽음] https://www.hanmisemi.com/?module=Html&action=SiteProduct&sSubNo=8&sNo=2 (텍스트 없음)
- [읽음] https://news.skhynix.com/semiconductor-back-end-process-episode-6-conventional-packages/
- [읽음] https://news.skhynix.com/semiconductor-back-end-process-episode-1-understanding-semiconductor-testing/

---

## 7. 패키지 소 / 싱귤레이션 (QFN, Hanmi MSVP 포함)

### 벤더와 제품
- **DISCO**
  - QFN 싱귤레이션 라이브러리 [읽음] https://disco.co.jp/eg/solution/library/dicing/qfn.html
    - 기존 표준은 **일렉트로폼 블레이드**다. 측면 마모가 반경 방향보다 빨라 수명 말기에 패키지 치수 불량이 생긴다.
    - 신형 **레지노이드 블레이드**는 반경 방향으로 고르게 마모되고 구리를 버(burr) 없이 절단한다고 DISCO가 설명한다.
    - **지그 방식**(진공 흡착, 테이프 없음, 대량·소품종, 커스텀 핸들러 통합)과 **테이프 방식**(모든 DISCO 다이싱 소에서 가능)이 있다.
    - 열팽창한 기판의 인덱스 편차를 보정하는 얼라인 소프트웨어를 쓴다.
  - DFD6370 (패키지 싱귤레이션용, 최대 330×330 mm, 다수 스트립 1프레임 처리, 옵션 높이 측정으로 웨터블 플랭크 QFN 하프컷 깊이 제어) [읽음] https://disco.co.jp/eg/news/corp/20241206_3.html
  - DFD6080 (최대 400×400 mm) [검색요약] https://www.disco.co.jp/eg/news/corp/20251215_1.html
- **Hanmi Semiconductor(한미반도체)** 공식 제품 목록 [읽음] https://www.hanmisemi.com/
  - **micro SAW**: W1121α, T2101, T1121, P2101, PL1121, PL1201, PL1241, GL2101
  - **VISION PLACEMENT**: 6.0 GRIFFIN, 6.0D, 6.0L, 6.0T FAST, 8.0UD, 8.0UL, 8.0PS
  - 개별 제품 페이지는 이미지 위주라 기능 설명 텍스트가 없다. 3개 페이지를 열어 확인했다 [읽음].
  - **"Micro SAW & Vision Placement(MSVP)"의 공정 설명은 공식 페이지 텍스트로 확인 못 함.**
  - 언론 보도(규칙상 허용 출처 아님, 참고만) [검색요약]
    - micro SAW가 패키지를 절단하고 Vision Placement가 세척 → 건조 → 비전 검사 → 선별 → 적재를 한다.
    - 1998년 Vision Placement 1세대를 출시했다. 초기에는 DISCO 소를 탑재했고 2021년 자체 micro SAW를 국산화했다.
    - 보도처: 헤럴드경제 https://biz.heraldcorp.com/article/10888524, 아시아경제 https://www.asiae.co.kr/en/article/2021072311101278639, 아이뉴스24 https://www.inews24.com/view/1949332
- **EO Technics PKG cutting BMC254** (레이저로 스트립 절단, align vision, 자동 스캐너 보정, flying 가공) [읽음] https://www.eotechnics.com/page/products/equipment_catno3.php
- **Amkor MicroLeadFrame(QFN)** [읽음] https://amkor.com/packaging/leadframe/microleadframe/
  - "Saw and punch versions available"
  - 구리 리드프레임에 플라스틱 봉지, "Standard leadframe process flow and equipment"
- SK hynix Ep.6 [읽음]: 싱귤레이션은 "using a blade to cut the finished substrate strips into individual packages"이며, 이후 트레이에 담아 테스트한다. 리드프레임 패키지는 트림(댐바 제거)과 폼(리드 성형) 공정이다.

### 외형과 레이아웃
- DISCO 기반 [읽음]
  - 지그 또는 테이프 프레임 위의 스트립
  - 척(진공 지그)
  - 스핀들과 블레이드
  - 높이 센서(옵션)
  - 얼라인 카메라
- MSVP형 일체 장비: 앞쪽 절단부(소) → 세정 → 건조 → 비전 검사 → 픽앤플레이스로 트레이 적재(good/reject 분류)
  - 이 구성 순서는 **언론 보도 기반**이다 [검색요약]. 한미 공식 텍스트로는 확인하지 못했다.
- 스트립 매거진 입력과 트레이 출력 스택의 배치: [출처 미확인]

### 운영 흐름과 용어
1. 몰드·마킹을 마친 스트립 로드(지그 또는 테이프) → 디바이스 데이터(레시피) 선택 (DISCO [읽음])
2. **얼라인먼트**: 인덱스 편차 보정 (DISCO [읽음])
3. **컷 깊이 / 높이 제어** (DFD6370 [읽음]) → 풀컷 또는 웨터블 플랭크 하프컷
4. 세정, 건조, 비전 검사, 선별, 트레이 적재: MSVP 보도 기반 [검색요약]
5. 블레이드 마모 관리: 일렉트로폼 블레이드는 측면 마모 → 치수 관리 (DISCO [읽음])

### 산출물과 결함/검사
- 산출물: 개별 패키지(트레이)
- 결함 (DISCO QFN [읽음])
  - **구리 버(copper burr)**
  - **블레이드 마모로 인한 패키지 치수 불량**
- 웨터블 플랭크 QFN은 AOI가 어렵다 [검색요약, DISCO height control 페이지]
- 비전 검사 항목: **확인 못 함**(한미 공식 텍스트 없음)

### 이 섹션에서 읽은 출처
- [읽음] https://disco.co.jp/eg/solution/library/dicing/qfn.html
- [읽음] https://disco.co.jp/eg/news/corp/20241206_3.html
- [읽음] https://www.hanmisemi.com/ (제품 목록)
- [읽음] https://www.hanmisemi.com/?module=Html&action=SiteProduct&sSubNo=4 (텍스트 없음)
- [읽음] https://www.hanmisemi.com/?module=Html&action=SiteProduct&sSubNo=5 (텍스트 없음)
- [읽음] https://www.hanmisemi.com/?module=Html&action=SiteProduct&sSubNo=5&sNo=2 (텍스트 없음)
- [읽음] https://amkor.com/packaging/leadframe/microleadframe/
- [읽음] https://www.eotechnics.com/page/products/equipment_catno3.php
- [읽음] https://news.skhynix.com/semiconductor-back-end-process-episode-6-conventional-packages/
- [검색요약] 위 언론 보도 3건 (허용 출처 아님)

---

## 8. 파이널 테스트 (Test Handler + ATE Tester + Burn-in)

### 벤더와 제품
- **Advantest**
  - **M6242/M6243** (메모리 양산용 핸들러) [읽음] https://www.advantest.com/en/products/component-test-system/test-handler/m6242/
    - BGA, CSP, TSOP1 대상, **최대 512개 동시 테스트**, 42,200 개/시간
    - -40~+125°C(옵션 -55°C), -10~100°C 설정 시 ±1.5°C
    - **온도 안정화 챔버(temperature stabilization chamber)**
    - 테스트 후 양품과 불량품을 분류하는 **복합 암 기구**
    - 큰 화면 메뉴
  - Change Kit [읽음] https://www.advantest.com/en/products/component-test-system/test-handler/change-kit/
    - 한 핸들러가 여러 패키지를 처리하도록 교체하는 키트다. M6242에는 "Test tray"가 나열되어 있다.
  - 2023 보도자료 [읽음] https://www.advantest.com/news/2023/20231211.html
    - M487x(M4171, M4871ES, M4872)용 ATC 2kW(Tj 센싱 기반 온도 제어)
    - HA1200 다이 레벨 핸들러
  - **V93000 EXA Scale** (SoC ATE) [읽음] https://www.advantest.com/en/products/semiconductor-test-system/soc/v93000-exa-scale/
    - CX~LX 클래스, "All card types fit in all test heads"
    - 웨이퍼 소트와 파이널 테스트 모두 대응
    - DUT 보드는 프로버와 핸들러에 맞춘다
  - 메모리 테스터 T5833 [검색요약]
- **Teradyne** 제품 목록 [읽음] https://www.teradyne.com/products/
  - SoC/디지털: UltraFLEX, UltraFLEXplus, J750
  - 메모리: Magnum 7, 7H, V, EPIC 등
  - SLT: Titan
  - **Magnum 7H** [읽음] https://www.teradyne.com/products/magnum-7h/
    - HBM 테스트(베이스 다이 웨이퍼, 싱귤레이션 전후)
    - P52 웨이퍼 소트 인터페이스, 최대 9,216 디지털 핀
- **Cohu** 핸들러 [읽음] https://www.cohu.com/test-handlers
  - Pick-and-Place: Eclipse, MATRiX(Tri-Temp 고병렬), MT9510(Tri-Temp, QFP/BGA/QFN)
  - Gravity: MT9928, Rasco SO1000/SO2000
  - Turret: Ismeca NY20/NY32
  - Strip: Rasco Jaguar, MCT SH-5300, InCarrier
  - T-Core 능동 열 제어, 컨택터 내장 온도 센서
- **Amkor** 테스트 서비스 [읽음] https://amkor.com/test-services/
  - 핸들러 유형: Pick & Place, Gravity Feed, Turret("final test, scan and tape & reel packing is done sequentially")
  - 번인: TDBI, 100% burn-in, BIB(Burn-in Board) 로더/언로더 [검색요약]
  - 필름 프레임과 스트립 테스트
  - 온도: 파이널 테스트 -55~+175°C, tri-temperature
  - FVI 체크, 테스트 후 Tape & Reel 핸들러
  - 사진 캡션의 장비명: V93000, Ultraflex, Cohu Tester 등. 캡션에 장비명이 있을 뿐 "표준"이라는 뜻이 아니다.
- SK hynix Ep.1 [읽음]
  - TDBI(번인), Hot/Cold/Room/Speed 테스트, 패키지 테스트 보드와 소켓
  - 이후 레이저 마킹, 트레이, 외관 검사(크랙, 마킹, 솔더볼 누락)
  - 장비 벤더 언급은 없다.
- 삼성반도체 뉴스룸 9탄 [읽음]: 패키지 테스트는 검사장비(Tester)로 전압, 전기신호, 온도, 습도 조건에서 전기적·기능적 특성과 동작 속도를 측정한다. 결과는 제조와 조립 공정에 피드백한다.

### 외형과 레이아웃
- 출처로 확인한 구성요소
  - **ATE 테스터(메인프레임 + 테스트 헤드)** (V93000 "test heads" [읽음])
  - **핸들러**: 로더 스토커, 온도 안정화(소크) 챔버, 테스트부(소켓/컨택터, DUT 보드), 분류 언로더 (Advantest M6242 [읽음], M4872 재시험 기능 "loader stocker" [검색요약], Cohu [읽음])
  - **변경 키트(테스트 트레이 등)** (Advantest [읽음])
- 테스트 헤드가 핸들러에 도킹하는 형태와 정확한 배치: 페이지에 없음 → [출처 미확인]
- 번인
  - 번인 보드(BIB)와 BIB 로더/언로더, 번인 챔버(오븐): Amkor [검색요약]
  - 형태 묘사: [출처 미확인]

### 운영 흐름과 용어
1. **로트(lot)** 투입: 트레이나 튜브(Gravity: Rasco "Tube to Tube" [읽음])
2. 테스트 프로그램과 레시피 선택, 변경 키트 장착 (Advantest Change Kit [읽음])
3. (메모리) **번인/TDBI** → 패키지 테스트 (SK hynix Ep.1 [읽음], Amkor [읽음])
4. 핸들러가 디바이스를 **소켓**에 넣고 **온도(Hot/Cold/Room, Tri-Temp)**를 맞춘 뒤 ATE로 테스트 (SK hynix [읽음], Cohu [읽음], Amkor [읽음])
5. 결과에 따라 **양품/불량 분류(bin 분류)**
   - Advantest 원문 "sort good and bad devices" [읽음]
   - M4171 "binning" [검색요약]
   - **"bin" 용어는 Advantest M4171 설명(검색요약)에만 있고, 읽은 공식 페이지에서는 직접 확인 못 함**
6. 불량을 자동으로 재시험(retest)한다: M4872 [검색요약]
7. 후공정: 레이저 마킹 → 트레이 → 외관 검사(FVI), 또는 턴렛 핸들러로 테스트 → 스캔 → Tape & Reel (SK hynix [읽음], Amkor [읽음])
- **프로브(probe)**: 웨이퍼 테스트(EDS/웨이퍼 소트)의 프로브 카드와 프로버 용어다 (SK hynix Ep.1 [읽음], Magnum 7H [읽음]). 파이널 테스트는 소켓을 쓴다.

### 산출물과 결함/검사
- 산출물: 양품 패키지(트레이 또는 Tape & Reel)와 등급별로 분류된 디바이스
- 불량
  - 전기적·기능적 불량, 속도 불량 (삼성 [읽음], SK hynix [읽음])
  - 번인으로 초기 불량을 걸러낸다 (SK hynix [읽음])
  - 외관 불량: 크랙, 마킹, 트레이 적재, 솔더볼 눌림이나 누락 (SK hynix Ep.1 [읽음])
- JEDEC 번인/HTOL 규격(JESD22-A108 등): 이번 조사에서 열람하지 않음 → **확인 못 함**
- SK hynix Ep.11(신뢰성 시험과 표준) [검색요약]: https://news.skhynix.com/semiconductor-back-end-process-episode-11-reliability-tests-and-standards-for-semiconductor-packages

### 이 섹션에서 읽은 출처
- [읽음] https://www.advantest.com/en/products/component-test-system/test-handler/m6242/
- [읽음] https://www.advantest.com/en/products/component-test-system/test-handler/change-kit/
- [읽음] https://www.advantest.com/news/2023/20231211.html
- [읽음] https://www.advantest.com/en/products/semiconductor-test-system/soc/v93000-exa-scale/
- [읽음] https://www.teradyne.com/products/
- [읽음] https://www.teradyne.com/products/magnum-7h/
- [읽음] https://www.cohu.com/test-handlers
- [읽음] https://amkor.com/test-services/
- [읽음] https://news.skhynix.com/semiconductor-back-end-process-episode-1-understanding-semiconductor-testing/
- [읽음] 삼성반도체 뉴스룸 9탄(위 URL)
- [실패] https://www3.advantest.com/ko/products/ic-test-systems/product-catalog-ic-test-systems (404)
- [실패] https://www.cohu.com/mt9510-xp-x16 (404)
- [실패] https://amkor.com/wp-content/uploads/2018/02/Test_Services_Brochure.pdf (바이너리)
- [실패] https://news.skhynix.co.kr/post/dram-and-nand-test-manager (403)

---

## 미해결 / 추가 확인 필요
- 국내 현장 용어 중 허용 출처로 뒷받침하지 못한 것:
  - **티칭**, **블레이드 드레싱**(DISCO 공식 텍스트), **캐비티/포트/런너/컬**(TOWA 원문에는 게이트만 있음), **와이어 스윕**, **bin**(공식 페이지 원문)
  - KOCW 강의나 공공 연구기관 보고서는 이번에 검색하지 못했다. 다음 단계 후보다.
- 와이어 본더와 다이 본더의 물리 배치(매거진 핸들러, 히트 블록, 윈도 클램프, 인덱서): 벤더 공식 텍스트로 확인 못 함. 벤더 브로셔 PDF를 텍스트로 추출할 수 있는 환경(pdftotext 등)이 필요하다.
- 한미반도체 MSVP 공정 설명: 공식 사이트는 이미지 위주다. 공식 보도자료나 IR 자료 확인이 필요하다.
- 삼성전자/SK하이닉스 공식 페이지에서 특정 장비 벤더를 사용한다는 기술은 **확인 못 함**.
