# 전공정(Front-end) 장비 6종 조사 노트 — 교육용 시뮬레이터용

조사일: 2026-11-13
작성 원칙
- 벤더·뉴스룸 자료는 **설명 출처**일 뿐이며, 시뮬레이션 규칙의 근거가 아님.
- 상태 표기
  - **[읽음]**: WebFetch로 페이지 본문을 직접 열람
  - **[PDF 추출]**: PDF를 받아 텍스트를 추출해 읽음
  - **[스니펫]**: 검색엔진 결과 요약만 보고 페이지 본문은 열지 않음 (참고용, 확정 근거로 쓰지 말 것)
  - **[실패]**: 403 또는 타임아웃으로 열지 못함
- 미국 특허(USPTO)는 정부 공개 문서지만 특정 벤더 제품을 설명하지 않음. 모두 [스니펫]이므로 **일반 구조의 보조 설명**으로만 표기.
- 원문에서 확인하지 못한 내용은 "확인 못 함"으로 적음. 추정은 "(추정)"으로 따로 표시.

---

## 0. 공통: 팹 물류·운영 용어 (모든 장비 공통)

| 용어 (영/한) | 확인 내용 | 출처 / 상태 |
|---|---|---|
| FOUP | "웨이퍼를 보관하거나 안전하게 이동할 수 있게 고안된 용기… 웨이퍼 배송 전용 상자" | 삼성반도체 뉴스룸 '우리 반모 할래 7탄'(2021.04.22) [읽음] |
| OHT (Overhead Hoist Transport) | "Fab 천장에 도로처럼 설치된 레일을 따라 웨이퍼가 담긴 FOUP을 필요한 설비로 빠르게, 자동으로 운송" | 위와 같음 [읽음] |
| 클린룸 / 클래스 / 방진복 | 클린룸 정의, 청정도 단위 '클래스', 방진복의 먼지·정전기 방지 | 위와 같음 [읽음] |
| 레시피 (Recipe) | 공정 엔지니어가 데이터를 모니터링하다 "특이점이 있다면 빠르게 판단하여 설비를 중단하거나 레시피를 바꿔줍니다" | 삼성반도체 뉴스룸 '나는 신입사원입니다 시즌2 Ep.2'(2024.01.18) [읽음] |
| 레시피 / APC | 식각 엔지니어가 "modifying the process recipe and APC algorithms" | SK hynix Newsroom 'Details, Defined: A Look at Etch Technology'(2021.10.07) [읽음] |
| 설비 엔지니어 업무 (PM 관련) | 장비 직무는 "the maintenance, repair, set-up, and removal of equipment". 'PM'이라는 약어 자체는 이 글에 없음 | SK hynix Newsroom 같은 글 [읽음] |
| 설비 가동 / 웨이퍼 출하량 | "설비를 통해 나오는 웨이퍼 출하량을 목표로 세우고 이를 달성하기 위해 설비를 관리" | 삼성반도체 뉴스룸 '파운드리 직무인터뷰 3탄 공정설비편'(2017.09.07) [읽음] |
| 더미 웨이퍼 (Dummy wafer) | 산화 장비에서 구조상 양 끝의 반응 속도 차이를 보정하려고 제품 웨이퍼와 함께 넣음 (아래 1장 참고) | SK hynix Newsroom Front-End Process Ep.2 [읽음] |
| EFEM / Load port / Load lock / Transfer chamber | 일반 클러스터 툴 구성으로 "load port → EFEM → load lock → transfer chamber → processing module" | USPTO 특허 문서(US 8562271 등) [스니펫] |
| 시즌닝 (Seasoning) | 세정 후 "blank silicon wafers"를 연속 식각해 생산 가능한 챔버 상태를 복원하는 절차. PM 뒤 "post-PM recovery" | USPTO 특허(US 6350697, US 12135529 등) [스니펫]. 벤더나 뉴스룸 원문은 **확인 못 함** |
| 인터락 (Interlock) | 허용된 출처에서는 **확인 못 함** (커뮤니티 글에만 있어 제외) | — |
| MES | 허용된 출처에서는 **확인 못 함** (삼성 FAB 용어 글에도 없음) | — |
| Lot / 로트 | Lot-to-lot 반복성 언급만 있음 ("Wafer-to-wafer and lot-to-lot repeatability is equally crucial") | Axcelis 저자 논문(Rubin & Poate, 2003) [PDF 추출] |
| 자동 물류 연동 | 이온주입기 처리량에 "placing the wafers into and removing them from sealed cassettes used by automated material-handling systems" 포함 | 위와 같음 [PDF 추출] |

삼성전자 반도체 8대 공정 분류(웨이퍼 제조→산화→포토→식각→증착·이온주입→금속배선→EDS→패키징)는 2~7탄 글에서 확인함(아래 각 장 참고). SK hynix Front-End Process 시리즈는 6편 구성이며(Ep.1 기준) 1 컴퓨터·트랜지스터, 2 산화, 3 포토, 4 식각, 5 증착, 6 금속배선이다. **이온주입 전용 편은 없음.**

---

## 1. 산화 퍼니스 (Thermal oxidation / Diffusion furnace)

### 1.1 벤더·제품군

| 벤더 | 제품 | 원문 내용 | URL / 상태 |
|---|---|---|---|
| Tokyo Electron (TEL) | TELINDY PLUS, EVAROS, TELFORMULA, TELINDY PLUS IRad, ALPHA-8SE i | "バッチ式熱処理装置"(배치식 열처리 장치). 최대 장입량: TELINDY PLUS 125매(카세트 스토커 18, RT–1100°C), EVAROS 200매(스토커 22), TELFORMULA 50매. 공정: 산화·어닐, CVD(Poly/a-Si, SiN, SiO2, TEOS/HTO), 열 ALD. TELINDY PLUS는 "2ボート運用"(2보트 운용). 옵션으로 "N2/LL", "Gas cleaning" | https://www.tel.co.jp/product/telindy.html [읽음] |
| KOKUSAI ELECTRIC | AdvancedAce-II, AdvancedAce-300, QUIXACE-II/-LV/ULTIMATE, VERTRON Revolution(200mm, 표준 175매), TSURUGI-C² 등(미니 배치) | Treatment 항목에 "Large batch; oxidation, diffusion, annealing". QUIXACE-LV는 "vacuum load-lock structure of the wafer loading area"로 자연산화막과 오염을 줄임 | https://www.kokusai-electric.com/en/products/ [읽음] |
| KOKUSAI ELECTRIC | (회사 강점 페이지) | 배치 처리를 "the deposition of several dozen wafers at once"로 설명. 배치 성막 장비 점유율이 "among the highest share in the world"라고 자사가 주장 | https://www.kokusai-electric.com/en/company/strength [읽음] |
| KOKUSAI ELECTRIC | 역사 | VERTRON(1980년대 수직 CVD), 1996년 300mm ZESTONE-III, 2015년 AdvancedAce-300 | https://www.kokusai-electric.com/en/company/history [스니펫] |
| ASM International | SONORA(300mm), A400 DUO(200mm 이하) | "Vertical furnaces use a batch configuration, which means a large number of wafers are processed at the same time." "designed with dual-batch reactors". 공정: LPCVD, diffusion, oxidation | https://www.asm.com/our-technology-products/vertical-furnace [읽음] |
| (교육 사례) MIT 6.152J 실습 | Thermco Atmospheric Furnace | 게이트 산화를 "Dry Oxidation, 1000°C 60 minutes"로 진행. 필드 산화는 "800-1100C for 1 hour in O2 or steam" | MIT OCW 6.152J Lecture 2 (M. A. Schmidt, 2005) https://ocw.mit.edu/courses/6-152j-micro-nano-processing-technology-fall-2005/lecture2.pdf [PDF 추출] |

삼성전자·SK hynix가 어떤 산화 장비를 쓰는지는 공식 페이지에서 **확인 못 함**.

### 1.2 외형·레이아웃 (SVG 작도용 설명)
- **수직 배치(vertical batch) 구조**: 웨이퍼 수십~200매를 수평으로 쌓은 **보트(boat)**를 반응관(tube) **아래쪽에서 올려 넣는** 방식이다. 출처는 USPTO 특허 [스니펫]이며, 벤더 페이지는 보트를 직접 설명하지 않는다.
  - 보트는 "a substrate supporter (also referred to as 'boat') that is loaded to and unloaded from the furnace while supporting wafers at set pitches vertically"
  - 웨이퍼 이송 장치는 "a transfer mechanism that moves wafers between the boat and a FOUP"
  - 언로드 직후 보트가 뜨거워 "cooldown position"에서 식힌 뒤 웨이퍼를 꺼낸다는 특허 서술이 있음 [스니펫]
- 히터는 반응관을 둘러싼 동심형 저항 히터이고 석영 또는 SiC 반응관을 쓴다. 출처는 USPTO US 7972979 [스니펫]이며 KOKUSAI 제품인지는 확인 못 함.
- **TEL 사양에서 레이아웃 요소로 확인한 것** [읽음]: **카세트(FOUP) 스토커**(18~22개), **보트 2개 운용**, 옵션 **N2/LL(로드락)**, 멀티존 히터(EVAROS)
- KOKUSAI QUIXACE-LV: 웨이퍼 로딩 영역에 **진공 로드락 구조** [읽음]
- SVG 구성 제안(위 출처들을 종합한 작도용 해석): 키 큰 캐비닛 상부에 **수직 반응관과 히터 재킷**, 하부에 **보트 엘리베이터와 로딩 영역**(N2 퍼지 또는 로드락), 전면에 **FOUP 로드포트와 스토커 선반**, 그 사이에 **웨이퍼 이송 로봇**(FOUP↔보트). 측면에 가스 박스와 배기.

### 1.3 운전 흐름 (오퍼레이터/엔지니어 관점)
1. OHT가 FOUP을 로드포트에 내려놓음. FOUP·OHT 용어는 삼성 뉴스룸 [읽음]
2. FOUP을 스토커에 보관한 뒤 이송 로봇이 웨이퍼를 보트에 장입함. "between the boat and a FOUP"는 특허 [스니펫], 스토커는 TEL [읽음]
3. **더미 웨이퍼 배치**: "Dummy wafers are placed alongside production wafers to offset reaction-speed differences caused by the equipment's structure, particularly at the ends." (SK hynix Ep.2 [읽음])
4. 보트를 반응관에 로드하고 가스를 주입·가열함. "Gas is injected into the inlet of the equipment and heated inside to react with the wafer." (SK hynix Ep.2 [읽음])
5. 레시피 조건 예시: 건식 산화는 O2만, 습식 산화는 O2+H2O(수증기), 라디칼 산화는 O2+H2. 삼성 원문은 "고온(800~1,200℃)에서 산소나 수증기를 웨이퍼 표면에 뿌려 얇고 균일한 실리콘 산화막(SiO₂)을 형성" (삼성 8대 공정 2탄 [읽음]). 습식은 같은 조건에서 건식보다 "약 5~10배 정도 더 두껍습니다" (삼성 [읽음])
6. 언로드와 쿨다운을 거쳐 FOUP에 복귀함. 쿨다운은 특허 [스니펫]
7. 계측: 산화막 두께 측정. MIT 실습 예시 "Measure oxide and polysilicon thickness (UV1280)" [PDF 추출]
- "Dozens of wafers are processed at once" (SK hynix Ep.2 [읽음])
- 자동 세정 옵션은 TEL의 "Gas cleaning" [읽음]. 점검 기능은 KOKUSAI의 "optional health check" [읽음]

### 1.4 출력·결함·계측
- 출력: SiO2 산화막(보호막, 절연막, 이온주입 차단막, 게이트 산화막). 출처는 삼성 2탄, SK hynix Ep.2 [읽음]
- 품질: 습식은 빠르지만 균일도와 밀도가 낮음. 건식은 느리지만 조밀하고 균일하며 게이트 산화막에 사용. 라디칼은 3D 구조나 모서리에서 균일도가 높음 (SK hynix Ep.2 [읽음])
- 오염: "미세한 불순물이 실리콘 표면에 침투하면 비저항이나 전도율이 바뀌어" 전기 특성에 영향 (삼성 2탄 [읽음])
- 계측 항목: 두께, 웨이퍼 내·웨이퍼 간 균일도(배치 위치별 차이를 더미로 보정). 수치 사양은 **확인 못 함**

### 1.5 읽은 출처
- [읽음] https://www.tel.co.jp/product/telindy.html
- [읽음] https://www.kokusai-electric.com/en/products/
- [읽음] https://www.kokusai-electric.com/en/company/strength
- [읽음] https://www.asm.com/our-technology-products/vertical-furnace
- [읽음] https://news.skhynix.com/semiconductor-front-end-process-episode-2/ (2022.12.21)
- [읽음] 삼성 8대 공정 2탄 산화공정(2012.08.23) https://news.samsungsemiconductor.com/kr/%eb%b0%98%eb%8f%84%ec%b2%b4-8%eb%8c%80-%ea%b3%b5%ec%a0%95-2%ed%83%84-%ec%9b%a8%ec%9d%b4%ed%8d%bc-%ed%91%9c%eb%a9%b4%ec%9d%84-%eb%b3%b4%ed%98%b8%ed%95%98%eb%8a%94-%ec%82%b0%ed%99%94%ea%b3%b5%ec%a0%95/
- [PDF 추출] MIT OCW 6.152J Lecture 2 https://ocw.mit.edu/courses/6-152j-micro-nano-processing-technology-fall-2005/lecture2.pdf
- [스니펫] KOKUSAI history, USPTO 특허(수직로 보트, US 7972979, US 11515188)
- [PDF 추출 실패] Semiconductor History Museum of Japan https://www.shmj.or.jp/english/pdf/process/exhibi402E.pdf. 추출된 문장은 "VERTEX is a trade mark of Hitachi Kokusai Electric Inc." 한 줄뿐
- [확인 못 함] MIT 6.152J Lecture 3(Oxidation)은 PDF가 공개되어 있지 않음

---

## 2. 포토리소그래피 (Track + Scanner/Stepper)

### 2.1 벤더·제품군

| 벤더 | 제품 | 원문 내용 | URL / 상태 |
|---|---|---|---|
| ASML | TWINSCAN NXT (ArF 이머전: NXT:2150i/2100i/2050i/2000i/1980Fi, 드라이: NXT:1470/870B/870), TWINSCAN XT (ArF/KrF/i-line) | 이머전 장비는 "the workhorses of the industry". NXT:2150i는 "dual-stage ArF immersion lithography system". 성능 지표는 overlay, throughput(NXT:870B "400 wafers per hour"), focus control | https://www.asml.com/en/products/duv-lithography-systems [읽음] |
| ASML | EUV NXE(NA 0.33, 13nm: NXE:3800E/3600D/3400C), High-NA EXE(NA 0.55, 8nm: EXE:5000/5200B) | 광원은 CO2 레이저 펄스 2회로 주석 액적을 때려 EUV를 만듦. 광학계는 미러이며 4배 축소. 반사형 레티클. 경로 전체가 진공("EUV light is absorbed by everything, even air"). 웨이퍼 핸들러가 에어락을 통과시킴. 웨이퍼 스테이지 위치 정밀도는 "within a quarter of a nanometer" | https://www.asml.com/en/products/euv-lithography-systems [읽음] |
| ASML | YieldStar 380G / 375F / 1375F (계측) | 380G는 현상 후(after-develop) overlay·focus 측정, 1375F는 식각 후(post-etch) overlay·CD 측정 | https://www.asml.com/en/products/metrology-and-inspection-systems/yieldstar-380g 외 [스니펫] |
| Tokyo Electron | CLEAN TRACK LITHIUS Pro DICE / Pro Z / Pro V / Pro, ACT 12 / ACT 8Z | 300mm 塗布現像装置(코터/디벨로퍼). 처리량은 Inline 기준 Pro Z 300wph, Pro DICE 440wph. Pro Z는 EUV 대응, "Low particle wafer transfer system", 베벨 비접촉 반송으로 이면·엣지 결함 억제. Pro는 "複数の検査・測定モジュール" 탑재 가능 | https://www.tel.co.jp/product/lithius.html [읽음] |
| Tokyo Electron | ACT 12 | "When used in-line with the exposure tool… small in footprint… high throughput due to its faster wafer transfer speed". "high precision oven" | https://www.tel.com/product/act.html [읽음] |
| Tokyo Electron | (2021 뉴스) | 코터/디벨로퍼를 "integrated inline with EXE:5000". inline 정의는 "integration of a lithography system and a Coater/Developer" | https://www.tel.com/news/topics/2021/20210608_001.html [읽음] |
| SCREEN | DT-3000 (Coat/Develop Track, SOKUDO 계보) | SPIE 초록·SEMI 발표에서 EUV 트랙, 이면 세정(BSC) 모듈 등을 언급 | 검색 결과만 확인 [스니펫]. SPIE 페이지는 내용이 비어 있어 [실패] |
| KLA | Archer(이미지 기반 overlay), ATL(scatterometry overlay), SpectraShape(CD), SpectraFilm/Aleris(막 두께·굴절률·응력) | KLA 10-K와 보도자료 | https://ir.kla.com/... [스니펫]. kla.com 제품 페이지는 본문이 비어 있어 [실패] |

**삼성전자 (공식 확인)**
- 삼성반도체 뉴스룸 "삼성전자, ASML과 차세대 반도체 제조 협력 확대"(2026.09.08) [읽음]
  - 원문: "2028년까지 첨단 D램 제조에 차세대 노광 설비 High NA EUV 도입을 위한 협력도 강화할 계획이다", "2028년 업계 최초로 메모리 제조에 High NA EUV 도입 추진", "오랜 EUV 사용 경험과 기술 리더십을 바탕으로"
  - 구체적 모델명과 팹은 기사에 없음. 2028년 도입은 **계획**임
  - URL: https://news.samsungsemiconductor.com/kr/%ec%82%bc%ec%84%b1%ec%a0%84%ec%9e%90-asml%ea%b3%bc-%ec%b0%a8%ec%84%b8%eb%8c%80-%eb%b0%98%eb%8f%84%ec%b2%b4-%ec%a0%9c%ec%a1%b0-%ed%98%91%eb%a0%a5-%ed%99%95%eb%8c%80/
- 같은 내용의 ASML 보도자료 https://www.asml.com/en/news/press-releases/2026/samsung-electronics-and-asml-expand-collaboration-on-next-generation-semiconductor-manufacturing [스니펫]
- 화성 V1 라인(EUV 전용 라인, 2020.02 양산) 보도자료 https://news.samsung.com/global/samsung-electronics-begins-mass-production-at-new-euv-manufacturing-line 는 [실패(타임아웃 2회)]. 내용은 검색 스니펫에서만 봄
- 삼성 8대 공정 4탄(포토, 2012.09.26) [읽음]: 노광을 "스테퍼 노광(Stepper Exposure)"으로 지칭. 트랙·스캐너·베이크 용어와 업체명은 없음

**SK hynix (공식 확인)**
- SK hynix Newsroom "SK hynix Introduces Industry's First Commercial High NA EUV"(2025.09.03) [읽음]
  - ASML **TWINSCAN EXE:5200B**를 이천 **M16** 팹에 반입. 차세대 DRAM 생산용이며 기존 EUV 공정을 단순화할 계획
  - URL: https://news.skhynix.com/sk-hynix-introduces-industrys-first-commercial-high-na-euv/
  - 한국어 뉴스룸(news.skhynix.co.kr/?p=52830)은 [실패(403)]
- SK hynix Newsroom 'Details, Defined: A Look at Etch Technology'(2021.10.07) [읽음]: 2021년 7월 1anm 8Gb LPDDR4 DRAM을 "using EUV equipment"로 양산 시작

### 2.2 외형·레이아웃
- **트랙(코터/디벨로퍼)과 스캐너가 인라인으로 연결된 한 덩어리**: TEL ACT/LITHIUS의 "Inline" 처리량 표기와 2021년 EXE:5000 인라인 연결 기사 [읽음]
- 트랙 내부 블록 구성(일반형): **carrier block**(FOUP/캐리어 거치) → **process block**(유닛 블록 여러 층: 도포층, 현상층) → **interface block**(인터페이스 암) → **노광 장치**. 프리베이크(PAB)는 도포 후·노광 전, 포스트베이크(POST/PEB)는 노광 후·현상 전. 출처는 USPTO 특허 US 8372480·8015940 [스니펫]이며 특정 TEL 기종이라고 확인하지는 못함
- 스캐너 내부(ASML EUV 페이지 [읽음]): 광원(CO2 레이저+주석 액적) → 조명·투영 **미러 광학계** → **레티클 스테이지**(반사형 마스크) → **웨이퍼 스테이지** → **웨이퍼 핸들러**(에어락, 로봇 암). EUV는 경로 전체가 진공 챔버
- DUV NXT의 "dual-stage" [읽음]. 스테이지가 2개라는 사실만 원문에 있고, 측정 스테이지와 노광 스테이지의 역할 분담 설명은 **확인 못 함**
- SVG 구성 제안: 왼쪽에 **트랙**(로드포트 4개, 적층형 코터/디벨로퍼 컵, 핫플레이트·쿨플레이트 타워), 가운데 **인터페이스 블록**, 오른쪽에 **대형 스캐너 본체**(EUV는 아래층 또는 옆에 광원 모듈). 계측기(overlay/CD)는 별도 장비이거나 트랙 내장 모듈로 그림. TEL LITHIUS Pro는 "複数の検査・測定モジュール" 탑재 가능 [읽음]

### 2.3 운전 흐름
SK hynix Front-End Ep.3(2023.01.05) [읽음]를 주 근거로 함.
1. FOUP을 트랙 로드포트에 올림. 레시피(공정 조건 묶음)는 삼성 Ep.2 글의 일반 정의를 적용
2. (선택) BARC 도포로 반사를 줄임. ArF 이머전에서는 TARC 사용 (SK hynix Ep.3)
3. **감광액(PR) 도포**: "a device called a 'coater' is used". 회전 도포 후 이면·엣지의 잉여 PR을 제거 (SK hynix Ep.3). MIT 실습은 "HMDS, Photoresist Application, Pre-bake (SSI coater track)" [PDF 추출]
4. 오븐 가열로 용제 제거(소프트 베이크 단계. 기사에서 이 명칭을 쓰지는 않음)
5. **정렬(Alignment)**: 이전 층의 정렬 마크 사용 (SK hynix Ep.3)
6. **노광(Exposure)**: 칩 크기 영역씩 노광한 뒤 스테퍼가 이동해 반복 (SK hynix Ep.3, 삼성 4탄 "스테퍼 노광")
7. **PEB**: 노광 후 다시 가열 (SK hynix Ep.3)
8. **현상(Develop)과 린스**: "the choice of equipment often has a trade-off relationship between the processing speed and the rate of defects" (SK hynix Ep.3)
9. **검사·계측**: overlay 측정은 "not performed on all wafers"이므로 샘플링 (SK hynix Ep.3). 삼성 4탄은 "측정 장비, 광학 현미경, 육안으로 패턴을 검사하고, 통과한 웨이퍼만 다음 공정으로" [읽음]
10. 불합격 웨이퍼의 재작업(rework, PR 제거 후 재도포) 절차는 허용된 출처에서 **확인 못 함**

### 2.4 출력·결함·계측
- 출력: 레지스트 패턴(이후 식각 마스크)
- 계측
  - **Overlay**: ASML 성능 지표 [읽음], SK hynix Ep.3 [읽음], KLA Archer [스니펫], ASML YieldStar 380G after-develop overlay·focus [스니펫]
  - **Focus**: ASML NXT:2000i "focus control" [읽음]
  - **CD 균일도**: TEL Pro Z "微細線幅均一性コントロール" [읽음]. YieldStar 1375F post-etch CD [스니펫]
- 결함: 이면·엣지 결함, 파티클(TEL Pro Z [읽음]), 현상 결함률(SK hynix Ep.3 [읽음])

### 2.5 읽은 출처
- [읽음] https://www.asml.com/en/products/duv-lithography-systems
- [읽음] https://www.asml.com/en/products/euv-lithography-systems
- [읽음] https://www.asml.com/en/technology/lithography-principles (노광 개념만 있고 세부 정보 없음)
- [읽음] https://www.tel.co.jp/product/lithius.html
- [읽음] https://www.tel.com/product/act.html
- [읽음] https://www.tel.com/news/topics/2021/20210608_001.html
- [읽음] https://news.skhynix.com/semiconductor-front-end-process-episode-3/
- [읽음] https://news.skhynix.com/sk-hynix-introduces-industrys-first-commercial-high-na-euv/
- [읽음] 삼성 8대 공정 4탄 https://news.samsungsemiconductor.com/kr/%EB%B0%98%EB%8F%84%EC%B2%B4-8%EB%8C%80-%EA%B3%B5%EC%A0%95-4%ED%83%84-%EC%9B%A8%EC%9D%B4%ED%8D%BC%EC%97%90-%ED%95%9C-%ED%8F%AD%EC%9D%98-%EC%84%B8%EB%B0%80%ED%99%94%EB%A5%BC-%EA%B7%B8%EB%A0%A4/
- [읽음] 삼성 'ASML과 차세대 반도체 제조 협력 확대' (위 URL)
- [PDF 추출] MIT OCW 6.152J Lecture 2 (실습 장비명: SSI coater track, I-Stepper)
- [스니펫] ASML YieldStar 페이지, KLA 10-K와 보도자료, SCREEN DT-3000(SPIE·SEMI), USPTO 트랙 특허
- [실패] news.samsung.com V1 라인 보도자료(타임아웃), news.skhynix.co.kr(403), SPIE 초록 페이지(빈 본문), kla.com 제품 페이지(빈 본문)

---

## 3. 건식 식각 (Plasma RIE / ICP)

### 3.1 벤더·제품군

| 벤더 | 제품 | 원문 내용 | URL / 상태 |
|---|---|---|---|
| Lam Research | Kiyo(도체 RIE), Flex(유전체: ALE, cryogenic, RIE), Akara(도체), Sense.i(플랫폼), Vantex(HAR, Sense.i용), Syndion(DRIE), Versys Metal, Selective Etch, Coronus(베벨), Reliant(리퍼비시) | Kiyo는 "symmetrical chamber design", "electrostatic chuck technology", "waferless auto-clean", "Improved critical dimension uniformity". Sense.i는 "compact, high density architecture", "autonomous calibration and maintenance". Akara는 "angstrom-level critical dimension uniformity" | https://www.lamresearch.com/products/our-processes/etch/ , https://www.lamresearch.com/product/kiyo-product-family/ , https://www.lamresearch.com/product/sense-i/ [읽음] |
| Lam Research (10-K FY2026) | 같은 제품군 | "Flex® offers in situ multi-step etch and continuous plasma capability". "Vantex® is part of our Sense.i® platform". 주요 고객으로 Micron, Samsung Electronics, SK hynix, TSMC를 명시 | https://www.sec.gov/Archives/edgar/data/707549/000070754926000037/lrcx-20260628.htm [읽음, 앞 100k자] |
| Tokyo Electron | Tactras, Episode UL, UNITY Me+, Certas LEAGA(가스 케미컬 식각) | Tactras는 300mm. "最大6つのエッチングチャンバーの搭載が可能"(챔버 1~6개). "チャンバーの水平対向設計". tool-to-tool·chamber-to-chamber 매칭을 고려한 설계 | https://www.tel.co.jp/product/tactras.html [읽음] |
| Applied Materials | Centura(멀티 챔버 플랫폼), Sym3(식각) | 10-K: "single-wafer systems with multiple process chambers attached to a base platform". "the multi-chamber Centura platform offers exceptional process flexibility" | AMAT 10-K FY2012 https://www.sec.gov/Archives/edgar/data/0000006951/000000695112000018/amat10282012-10kdoc.htm [읽음]. appliedmaterials.com은 [실패(403)] |

**SK hynix (공식)**
- 식각 글에 "Lam Spectral Reflectometer (LSR)"가 용어로 등장함. 광 반사로 식각 깊이를 추정하는 방법이다 (Details, Defined [읽음])
- 이 문장은 "LSR이라는 Lam 명칭의 측정 기법을 도입했다"는 의미로 기록함. 장비 전체 구성은 공개되지 않음
- 교육센터 글 캡션에 "oxide etching equipment", "poly etching equipment", "scrubber", "thin film CVD equipment"가 나옴. 장비 **종류만** 확인되고 벤더는 없음. https://news.skhynix.com/en/the-importance-of-semiconductor-equipment-competency-and-the-introduction-of-a-sk-hynix-training-center/ [읽음]

**삼성전자**: 식각 장비 벤더나 모델 언급은 **확인 못 함**.

### 3.2 외형·레이아웃
- **클러스터 툴**: 로드포트(FOUP) → **EFEM**(대기압 로봇) → **로드락**(대기↔진공 전환, 문 2개) → **진공 이송 챔버(VTM)와 중앙 로봇** → **공정 챔버 여러 개**. 출처는 USPTO 특허 [스니펫]. 챔버 개수의 실제 예는 TEL Tactras 최대 6개 [읽음]
- AMAT 10-K는 이 구조를 "multiple process chambers attached to a base platform"으로 설명 [읽음]
- 챔버 내부(MIT Lecture 17 [PDF 추출])
  - 평행판 RIE: 웨이퍼 쪽 전극이 작을수록 이온 에너지가 커지고 이방성이 커짐. "Lower gas pressure (10-100 mT) increases mean-free path, increases anisotropy"
  - ICP(고밀도 플라즈마): "Induction coils… Dielectric window, not metallic", 1–10 mT. 플라즈마 밀도와 웨이퍼 바이어스를 따로 제어
  - 정전척(ESC)은 Lam Kiyo [읽음]
- 부대 설비: 배기 라인 **스크러버(scrubber)** "to neutralize the exhaust gas" (SK hynix 2021 식각 글 [읽음])
- SVG 구성 제안: 앞쪽 로드포트 3~4개와 EFEM 박스, 그 뒤 로드락 2개, 중앙 다각형 이송 챔버, 둘레에 공정 챔버 4~6개(각 챔버 위에 RF 매처·코일 박스, 아래에 터보펌프). 바닥 밑이나 옆에 가스 박스, 스크러버, 칠러.

### 3.3 운전 흐름
1. FOUP 로드 → 레시피 선택 → 로트 시작. 레시피·APC 조정은 SK hynix 식각 글 [읽음]과 삼성 Ep.2 [읽음]
2. EFEM → 로드락 → 이송 챔버 → 공정 챔버. 출처는 특허 [스니펫]
3. 가스 주입과 RF 인가로 플라즈마를 형성해 식각함. "대기압보다 낮은 압력의 진공 챔버에 가스를 주입하고 전기 에너지를 공급해 플라즈마" (삼성 5탄 [읽음])
4. **종말점 검출(EOP/EPD)**: "it is crucial to find a precise end of point (EOP) in dry etching" (SK hynix 2021 [읽음])
5. 웨이퍼 반출 → 애싱(PR 제거, MIT 실습 "Matrix System One Stripper (Asher)" [PDF 추출]) → 세정(잔여 폴리머 제거, SK hynix 2021 [읽음])
6. 챔버 관리
   - 챔버 자동 세정은 Lam Kiyo "waferless auto-clean" [읽음]
   - 세정이나 PM 후 블랭크 웨이퍼로 **시즌닝**한 다음 "post-PM recovery". 출처는 USPTO 특허 [스니펫]
   - Sense.i는 "autonomous calibration and maintenance… reducing downtime" [읽음]
7. 계측: CD, 식각 깊이(LSR) → 다음 공정. 이상이 있으면 설비 중단 또는 레시피 변경 (삼성 Ep.2 [읽음])
- 엔지니어 조직: SK hynix 식각은 Front(ISO, BG, BLC), Middle(GBL, SNC, M0), End(SN, MLM) 8단계로 나뉘고 공정(manufacturing) 직무와 장비(equipment) 직무가 분리됨 [읽음]

### 3.4 출력·결함·계측
- 지표
  - 식각률: 삼성 5탄, SK hynix Ep.4 [읽음]
  - 균일도: "웨이퍼의 부위에 따라 식각 속도가 다를 경우… 불량" (삼성 5탄 [읽음])
  - 선택비·형상(profile): 삼성 5탄 [읽음], MIT L17 [PDF 추출]
  - 이방성: MIT L17 [PDF 추출]
- 균일도 문제 유형(MIT L17 [PDF 추출]): "bull's eye"(가장자리가 빠름), "Macro-loading", "Micro-loading"
- 결함: 폴리머 잔류(SK hynix [읽음]), 베벨 잔류물이 "flake off… create defects"(Lam Coronus [읽음]), 이온 밀링 시 "charging gives trenching, redeposition"(MIT [PDF 추출]), 다층 막 결함("low defectivity", Lam Kiyo [읽음])
- 식각이 덜 되면 이후 이온주입을 막음 (SK hynix 검색 요약 [스니펫])

### 3.5 읽은 출처
- [읽음] https://www.lamresearch.com/products/our-processes/etch/
- [읽음] https://www.lamresearch.com/product/kiyo-product-family/
- [읽음] https://www.lamresearch.com/product/sense-i/
- [읽음] Lam 10-K FY2026 (sec.gov, 위 URL)
- [읽음] https://www.tel.co.jp/product/tactras.html
- [읽음] AMAT 10-K FY2012 (sec.gov, 위 URL)
- [읽음] https://news.skhynix.com/en/details-defined-a-look-at-etch-technology/
- [읽음] https://news.skhynix.com/en/?p=2844 (Front-End Ep.4, 2023.02.21)
- [읽음] https://news.skhynix.com/en/etching-process-to-complete-semiconductor-patterning-1/ (2021.05.11)
- [읽음] SK hynix 교육센터 글 (위 URL)
- [읽음] 삼성 8대 공정 5탄 식각(2012.10.19) https://news.samsungsemiconductor.com/kr/%EB%B0%98%EB%8F%84%EC%B2%B4-8%EB%8C%80-%EA%B3%B5%EC%A0%95-5%ED%83%84-%ED%8A%B9%EC%A0%95-%ED%9A%8C%EB%A1%9C%ED%8C%A8%ED%84%B4%EC%9D%84-%EA%B5%AC%ED%98%84%ED%95%98%EB%8A%94-%EC%8B%9D%EA%B0%81%EA%B3%B5/
- [읽음] 삼성 '나는 신입사원입니다 시즌2 Ep.2'(2024.01.18)
- [PDF 추출] MIT OCW 6.152J Lecture 17 Dry Etching https://ocw.mit.edu/courses/6-152j-micro-nano-processing-technology-fall-2005/lecture17.pdf
- [스니펫] USPTO 시즌닝·EFEM 특허
- [실패] appliedmaterials.com(403), news.skhynix.co.kr(403)

---

## 4. CVD 증착 (PECVD / LPCVD / ALD)

### 4.1 벤더·제품군

| 벤더 | 제품 | 원문 내용 | URL / 상태 |
|---|---|---|---|
| Lam Research | VECTOR(PECVD), Striker(ALD), ALTUS(W용 CVD+ALD), SPEED(HDP-CVD 갭필), SOLA(UV 처리) | VECTOR는 "quad station module (QSM) architecture", "exceptional within-wafer and wafer-to-wafer uniformity", 3D NAND 적층에서 "closely control stress and defectivity". 10-K: "Multi-Station Sequential Deposition architecture", "Striker® single-wafer ALD" | https://www.lamresearch.com/products/our-processes/deposition/ , https://www.lamresearch.com/product/vector-product-family/ [읽음]. Lam 10-K FY2026 [읽음] |
| Applied Materials | Producer(PECVD/CVD) | 10-K: "Twin-Chamber® modules that have two single-wafer process chambers per unit". 제품 페이지 스니펫: 1998년 출시, 최대 6매 동시 처리 | AMAT 10-K FY2012 [읽음]. https://www.appliedmaterials.com/eu/en/product-library/producer-cvd.html [스니펫] |
| Tokyo Electron | TELINDY PLUS / IRad / EVAROS / TELFORMULA(배치 CVD·ALD), NT333(ALD), Triase+(Ti/TiN, W 등 매엽 CVD) | 배치 열 ALD(SiO2, SiN, high-k), 플라즈마 ALD(IRad, "プラズマダメージフリーな低温成膜") | https://www.tel.co.jp/product/telindy.html [읽음]. 제품 목록 https://www.tel.com/product/ [읽음] |
| KOKUSAI ELECTRIC | AdvancedAce-II/300, QUIXACE, TSURUGI-C²(미니 배치) | "Large batch; thin film, CVD/oxide". AdvancedAce-300은 "LP CVD, oxidation, diffusion, annealing". 배치 ALD 강점("several dozen wafers at once") | https://www.kokusai-electric.com/en/products/ , /en/company/strength [읽음] |
| ASM International | ALD, PECVD, Epitaxy, Vertical furnace(LPCVD) | ALD는 "angstrom-level control at scale". 개별 제품명(Pulsar, EmerALD, XP8, Synergis 등)은 상표 목록에만 있음 | https://www.asm.com/our-technology-products [읽음] |

삼성전자·SK hynix가 쓰는 CVD 장비 벤더는 **확인 못 함**. SK hynix 교육센터에 "thin film CVD equipment" 실습 장비가 있다는 사실만 확인함 [읽음].

### 4.2 외형·레이아웃
- **매엽 PECVD(클러스터형)**: EFEM → 로드락 → 이송 챔버 → 공정 모듈
  - AMAT Producer: 트윈 챔버 모듈 3개(=6매 동시) [10-K 읽음, 6매는 스니펫]
  - Lam VECTOR: 한 모듈 안에 4개 스테이션(QSM)이 있고 웨이퍼가 스테이션을 순차 이동하며 나눠 증착. "Multi-Station Sequential" [읽음]
- **배치 LPCVD/ALD**: 산화 퍼니스와 같은 수직로 구조(1장 참고). MIT CVD 강의 "Four reaction chambers (similar to those for Si oxidation)" [PDF 추출]
- PECVD 챔버 구조(MIT PVD 강의 [PDF 추출]): 평행판 플라즈마. 식각과 비슷하지만 증착 가스를 씀. 서셉터(가열 받침대)는 MIT CVD 강의의 "Susceptor"
- SVG 구성 제안: 클러스터형은 식각기와 같은 골격으로 그리되 챔버 상부를 샤워헤드·RF 박스로 표현함. Lam QSM은 원형 챔버 안에 웨이퍼 4개를 그리는 것으로 차별화. 배치형은 퍼니스 그림을 재사용하고 가스 캐비닛을 강조.

### 4.3 운전 흐름
1. FOUP 로드 → 레시피 선택(온도, 가스 유량, 압력, RF 전력). 제어 변수는 MIT CVD "Control T, gas mixture, pressure, flow rate" [PDF 추출]
2. 웨이퍼 반입 → 예열. Lam VECTOR "proprietary wafer heat-up independent of film deposition" [읽음]
3. 증착: 플라즈마 CVD는 "저온에서 형성이 가능하고 두께 균일도를 조절할 수 있으며 대량 처리가 가능" (삼성 6탄 [읽음]). ALD는 "Repeating this process can control the thickness of the film at the atomic level" (SK hynix Ep.5 [읽음])
4. 반출 → 챔버 세정. TEL 배치로의 "Gas cleaning" 옵션 [읽음]
5. 계측: 두께, 균일도, 스텝 커버리지 → 다음 공정
- MIT 실습 예: "Doped Polysilicon Deposition, Thermco LPCVD (6A-Poly)" → "Anneal" → 두께 측정(UV1280) [PDF 추출]

### 4.4 출력·결함·계측
- 출력: 절연막(SiO2, SiN, 하드마스크, ARC, 패시베이션 등. Lam VECTOR [읽음]), 도전막(W: Lam ALTUS [읽음]; poly-Si: MIT [PDF 추출])
- 지표
  - **Uniformity**: "how evenly the materials are formed" (SK hynix Ep.5 [읽음])
  - **Step coverage**: "the difference in thickness between the top and bottom films" (SK hynix Ep.5 [읽음])
  - **응력(stress)**: Lam VECTOR [읽음]
  - **두께**: 삼성 6탄 "박막의 얇기와 균일성이 반도체 품질을 좌우" [읽음]
- 결함: CVD 부산물 가스로 인한 불순물 오염(SK hynix Ep.5 [읽음]), 열팽창 차이로 인한 패턴 손상(SK hynix Ep.5 [읽음]), 보이드(Lam VECTOR "void-free" [읽음]), 기상 핵생성 회피를 위해 저압 사용(MIT CVD "use low partial pressure (LPCVD)" [PDF 추출])
- 막 계측 장비: KLA SpectraFilm/Aleris(두께, 굴절률, 응력, 조성) [스니펫]

### 4.5 읽은 출처
- [읽음] https://www.lamresearch.com/products/our-processes/deposition/
- [읽음] https://www.lamresearch.com/product/vector-product-family/
- [읽음] Lam 10-K FY2026, AMAT 10-K FY2012 (sec.gov)
- [읽음] https://www.tel.co.jp/product/telindy.html , https://www.tel.com/product/
- [읽음] https://www.kokusai-electric.com/en/products/ , /en/company/strength
- [읽음] https://www.asm.com/our-technology-products
- [읽음] https://news.skhynix.com/semiconductor-front-end-process-episode-5/ (2023.03.02)
- [읽음] 삼성 8대 공정 6탄 증착&이온주입(2018.02.22) https://news.samsungsemiconductor.com/kr/%EB%B0%98%EB%8F%84%EC%B2%B4-8%EB%8C%80-%EA%B3%B5%EC%A0%95-6%ED%83%84-%EB%B0%98%EB%8F%84%EC%B2%B4%EC%97%90-%EC%A0%84%EA%B8%B0%EC%A0%81-%ED%8A%B9%EC%84%B1%EC%9D%84-%EC%9E%85%ED%9E%88%EB%8B%A4/
- [PDF 추출] MIT OCW 6.152J CVD https://ocw.mit.edu/courses/6-152j-micro-nano-processing-technology-fall-2005/cvd.pdf
- [스니펫] AMAT Producer 제품 페이지, KLA 막 계측

---

## 5. 이온주입기 (Ion implanter)

### 5.1 벤더·제품군

| 벤더 | 제품 | 원문 내용 | URL / 상태 |
|---|---|---|---|
| Axcelis | Purion H(고전류), Purion M(중전류), Purion XE(고에너지), Medium Energy, GSD Ovation | "a common, high-performance platform with three innovative beamline technologies". "As a true single-wafer platform". 처리량 "up to 500 WPH" | https://www.axcelis.com/products/ , https://www.axcelis.com/products/purion-ion-implantation-equipment/ [읽음] |
| Axcelis | Purion H6 | "scanned spot-beam architecture", "five-filter", "Magnetic and electrostatic filtration", "Purion Vector™ angle control system", "independent control of implant angles and dose", "Purion 500 wph end station" | https://www.axcelis.com/products/purion-h-high-current-ion-implantation/ [읽음] |
| Applied Materials | VIISta 계열(Varian Semiconductor 인수) | 10-K: "a comprehensive line of single-wafer ion implantation equipment that covers the entire energy and current range". 블로그 스니펫: VIISta Trident XP2(고전류) | AMAT 10-K FY2012 [읽음]. appliedmaterials.com 블로그·제품 페이지 [스니펫/403] |
| (업계 개관, 2003) | — | "Varian and Axcelis, manufacture roughly 70% of all ion implanters". 표 1에는 Axcelis, Varian(VSEA), AMAT Implant Division, Sumitomo Eaton Nova(Axcelis JV), Nissin Electric, Ibis 순 | Rubin & Poate (Axcelis), "Ion Implantation in Silicon Technology", The Industrial Physicist, 2003 https://www.axcelis.com/wp-content/uploads/2019/02/Ion_Implantation_in_Silicon_Technology.pdf [PDF 추출]. 2003년 자료이므로 현재 점유율 근거로 쓰지 말 것 |

삼성전자·SK hynix의 이온주입 장비는 **확인 못 함**. SK hynix Front-End 시리즈에는 이온주입 편이 없음 [읽음, Ep.1 목차].

### 5.2 외형·레이아웃
Rubin & Poate 2003 [PDF 추출]의 그림 3·4 설명을 따름.
- 빔라인 순서(고전류 빔라인 예): **이온 소스**(dual-slit extraction electrode) → **분석 자석(analyzer magnet)** → resolving housing → **감속부**(deceleration) → **Plasma electron flood (xenon)** → **웨이퍼**. 빔 측정용 **Flag Faraday**가 있음
- 고에너지형: "Ten radio-frequency resonators (80 kV @ 13.56 MHz)", "Twelve quadrupole lenses", "Mass-analyzing magnet (70°)"로 이루어진 RF 선형가속기
- **엔드 스테이션**(웨이퍼 처리 챔버): "implant either one wafer at a time or a small batch of wafers—typically 13 or 17—mounted on a rapidly rotating disk" (2003년 기준). 현재 Axcelis와 AMAT는 매엽(single-wafer)을 강조 [읽음]
- 크기: "an implanter occupies an area of 16 to 28 m2" (2003)
- 빔라인 길이는 에너지에 따라 다름: "Accelerating ions to higher energies requires a longer beam line"
- SVG 구성 제안: 길쭉한 L자 또는 U자 장비. 한쪽 끝에 **소스 하우징**(고전압 캐비닛, 가스 박스), 중간에 **큰 분석 자석**(부채꼴), 이어서 빔관(고에너지형은 긴 가속관), 다른 끝에 **엔드 스테이션**(매엽 플래튼과 로드락, 앞쪽 FOUP 로드포트).

### 5.3 운전 흐름
1. FOUP 로드(자동물류 카세트 투입·반출을 처리량 계산에 포함, Rubin & Poate [PDF 추출]) → 레시피 선택
2. 레시피 = **이온종, 에너지, 도즈, 각도(tilt/twist)**: "process parameters, such as concentration and depth of the desired dopant, are specified directly in the equipment settings for implant dose and energy" (Rubin & Poate [PDF 추출]). 각도와 도즈의 독립 제어는 Purion H6 [읽음]
3. 빔 셋업(빔 전류와 균일도 확보) → 웨이퍼 스캔 주입. 스캔 방식은 Purion H6 "Enhanced Uniformity Scan" [읽음]
4. 반출 → PR 마스크 제거 → **어닐(열처리)**로 결정 손상 회복과 도펀트 활성화: "high-temperature postimplant annealing could repair implantation-induced crystal damage… optimum… 900 to 1,100°C" (Rubin & Poate [PDF 추출]). MIT 실습은 "Ion Implantation of Boron" → "Drive-In (950C in O2)" [PDF 추출]
5. 계측: 면저항(sheet resistance). MIT 실습 "Sheet resistance measurement: Van der Pauw structure" [PDF 추출]
- 도펀트: 15족(P, As)은 n형, 13족(B)은 p형 (삼성 6탄 [읽음]). 산화막이 이온주입 차단막 역할 (삼성 2탄 [읽음])
- 한 웨이퍼에 필요한 주입 횟수: "a modern CMOS IC with embedded memory may contain up to 35 implants" (2003 [PDF 추출])

### 5.4 출력·결함·계측
- 출력: 도핑 영역(웰, 소스/드레인, Vt 조정 등. 그림 2 목록 [PDF 추출])
- 사양 예(2003): 도즈 균일도 3σ 1.5%, 에너지 3σ 3.0%, 각도 3σ 약 1.0° [PDF 추출]
- 장비 분류: 고전류(최대 25 mA, <1 keV–100~200 keV), 중전류(1 µA–5 mA, 5–600 keV, 최대 60° 틸트), 고에너지(MeV급) [PDF 추출]
- 결함·오염
  - 교차오염(cross-contamination), 에너지 오염
  - "Even particles as small as 120 nm may cause yield losses"
  - 빔라인 스퍼터링에 의한 금속 오염 [PDF 추출]
  - Purion은 필터로 "minimize particle generation" [읽음]
  - 차징(charging): 플라즈마 전자 플러드가 전하 중화 장치로 그림에만 나옴 [PDF 추출]. 설명 문장은 **확인 못 함**

### 5.5 읽은 출처
- [읽음] https://www.axcelis.com/products/
- [읽음] https://www.axcelis.com/products/purion-ion-implantation-equipment/
- [읽음] https://www.axcelis.com/products/purion-h-high-current-ion-implantation/
- [PDF 추출] https://www.axcelis.com/wp-content/uploads/2019/02/Ion_Implantation_in_Silicon_Technology.pdf (Rubin & Poate, AIP The Industrial Physicist, 2003)
- [읽음] AMAT 10-K FY2012 (sec.gov)
- [읽음] 삼성 8대 공정 6탄
- [PDF 추출] MIT OCW 6.152J Lecture 2
- [스니펫] AMAT implant 페이지와 블로그(VIISta Trident XP2)
- [확인 못 함] MIT 6.152J Lecture 6(Diffusion/Implantation) PDF는 받지 않음

---

## 6. 금속배선 (PVD 스퍼터, CMP)

### 6.1 벤더·제품군

| 벤더 | 제품 | 원문 내용 | URL / 상태 |
|---|---|---|---|
| Applied Materials | Endura(PVD) | 10-K: "The Applied Endura PVD system offers a broad range of advanced metal deposition processes". 제품 스니펫(Endura CuBS RF XT): Ta(N)/Ta 배리어 후 Cu 시드를 "under high-vacuum conditions"에서 연속 증착, "Aktiv Preclean" | AMAT 10-K FY2012 [읽음]. https://www.appliedmaterials.com/us/en/product-library/endura-cubs-rf-xt-pvd.html [스니펫] |
| Applied Materials | Reflexion LK(CMP) | 10-K: "300mm Applied Reflexion® LK system", Reflexion GT "dual-wafer design". 스니펫: "three-platen sequential polishing", 일체형 세정기 Desica, in-situ 종말점 FullVision XE / RTPC XE | AMAT 10-K FY2012 [읽음]. https://www.appliedmaterials.com/us/en/product-library/reflexion-lk-cmp.html [스니펫] |
| Tokyo Electron | EXIM, LEXIA-EX(PVD) | EXIM은 "プロセスモジュールをアプリケーションに応じて自由に配置できる", "マルチカソード技術". LEXIA-EX는 "超高真空チャンバー", 100 wph, "4ターゲットチャンバー(mPVD)"와 대형 타깃 2개 dPVD 챔버(DRAM 커패시터 하드마스크) | https://www.tel.co.jp/product/exim.html [읽음] |
| Lam Research | SABRE(Cu 전해도금 ECD), ALTUS(W CVD/ALD) | "precision metal plating for copper damascene manufacturing". 10-K: "SABRE® ECD product family, which helped pioneer the copper interconnect transition" | https://www.lamresearch.com/products/our-processes/deposition/ [읽음]. Lam 10-K [읽음] |
| Ebara | CMP | 확인 못 함 (ebara.co.jp → ebara.com 리다이렉트 후 403) | [실패] |

삼성전자·SK hynix의 PVD·CMP 장비 벤더는 **확인 못 함**. 삼성 신입사원 글에는 CMP 공정 엔지니어 업무("슬러리와 패드로 웨이퍼 표면을 평탄화")만 나옴 [읽음].

### 6.2 외형·레이아웃
- **PVD 클러스터**: 로드포트 → EFEM → 로드락 → (디개스, 프리클린) → 이송 챔버 → 스퍼터 챔버 여러 개
  - 배리어와 시드를 진공을 깨지 않고 연속 증착함 (AMAT 스니펫)
  - 프리클린은 AMAT "Aktiv Preclean"(스니펫)
  - 디개스 챔버는 허용 출처에서 **확인 못 함**
  - TEL EXIM은 모듈 배치가 자유롭고, LEXIA-EX는 초고진공 챔버 [읽음]
- 스퍼터 챔버 원리(MIT PVD [PDF 추출]): Ar 플라즈마(10–100 mTorr), 음극 = **타깃**(소스 재료), 양극 쪽 = 기판. "Ar+ accelerated to cathode", 중성 타깃 원자가 튀어나와 기판에 증착. 타깃이 부도체이면 RF 스퍼터링
- **CMP**: 연마 플래튼 3개(AMAT 스니펫 "three-platen") + 일체형 세정·건조(Desica) + in-situ 종말점 센서. 삼성 Ep.2에서 "슬러리와 패드" [읽음]
- SVG 구성 제안
  - PVD: 식각 클러스터와 같은 골격. 챔버 상부를 원판형 **타깃·마그넷 하우징**으로 표현
  - CMP: 직사각형 장비 안에 회전하는 원형 패드(플래튼) 3개, 위에 캐리어 헤드 암과 슬러리 노즐. 뒤쪽에 세정 모듈(브러시·건조), 앞쪽에 FOUP 로드포트("dry-in/dry-out"이라는 표현은 원문에서 **확인 못 함**)

### 6.3 운전 흐름
(금속배선 전체 흐름. SK hynix Ep.6(2023.03.14) [읽음])
- **장비 측면**: "there is no 'metallization equipment' like there is etching equipment". 다른 공정 장비(증착, 식각, 포토, 도금)를 다시 씀
- **Al 배선**: 금속막 증착 → 포토 → 식각 → 절연막 매립
- **Cu 배선(다마신)**: 절연막 증착·식각 → 배리어(Ta) → Cu 시드 → Cu 전해도금 → 잉여 Cu 연마(=CMP) ("excess copper is ground away")
- **콘택**: 깊은 홀은 W로 먼저 채움. Al은 "not able to fill in deep holes even with deposition". Ti/Co 실리사이드로 접촉 저항을 낮춤
- 삼성 7탄(2018.03.19) [읽음]: Al, Ti, W를 대표 금속으로 들고, Al과 Si 사이에 **배리어 메탈**을 넣음. 진공 챔버에서 금속을 증기화하는 방식에서 CVD로 전환 중. 스퍼터링과 CMP는 이 글에 없음
- PVD 장비 단위 흐름: FOUP 로드 → 레시피 → 로드락 → 프리클린 → 배리어 챔버 → 시드 챔버 → 로드락 → 반출 → 두께·면저항 계측. 단계 순서는 AMAT 스니펫, 계측 항목은 일반적인 해석(추정)
- CMP 흐름: 로드 → 플래튼 1~3 순차 연마(종말점 검출) → 세정·건조 → 반출 → 두께 계측("in-line metrology", AMAT 스니펫)

### 6.4 출력·결함·계측
- 출력: 금속 배선, 콘택, 비아, 평탄화된 표면
- 결함
  - 보이드·갭, 가운데가 빈 배선 (SK hynix Ep.6 [읽음])
  - Cu 확산으로 인한 누설 전류: "the oxide film… will contain copper atoms and cause current leakage" (SK hynix Ep.6 [읽음])
  - 금속–실리콘 경계의 고저항 (SK hynix Ep.6 [읽음])
  - 일렉트로마이그레이션(EM) (SK hynix Ep.5 [읽음])
  - Al–Si 상호 확산으로 인한 접합 손상 (삼성 7탄 [읽음])
  - CMP 워터마크와 파티클 (AMAT Desica 스니펫)
- PVD 품질: 면내 균일도, 재현성, 파티클 (TEL EXIM [읽음]), 스텝 커버리지(MIT PVD "Poor step coverage", "Higher pressure… better step coverage" [PDF 추출])

### 6.5 읽은 출처
- [읽음] https://www.tel.co.jp/product/exim.html
- [읽음] https://www.lamresearch.com/products/our-processes/deposition/
- [읽음] AMAT 10-K FY2012, Lam 10-K FY2026 (sec.gov)
- [읽음] https://news.skhynix.com/semiconductor-front-end-process-episode-6/
- [읽음] 삼성 8대 공정 7탄 금속배선 https://news.samsungsemiconductor.com/kr/%eb%b0%98%eb%8f%84%ec%b2%b4-8%eb%8c%80-%ea%b3%b5%ec%a0%95-7%ed%83%84-%ec%a0%84%ea%b8%b0%ea%b0%80-%ed%86%b5%ed%95%98%eb%8a%94-%ea%b8%b8%ec%9d%84-%eb%a7%8c%eb%93%9c%eb%8a%94-%ea%b8%88/
- [읽음] 삼성 '나는 신입사원입니다 시즌2 Ep.2' (CMP 업무)
- [PDF 추출] MIT OCW 6.152J PVD(Sputtering) https://ocw.mit.edu/courses/6-152j-micro-nano-processing-technology-fall-2005/pvd_1.pdf
- [스니펫] AMAT Endura CuBS RF XT, Reflexion LK 제품 페이지
- [실패] appliedmaterials.com(403), ebara(403)

---

## 7. 삼성전자 / SK hynix 공식 확인 사항 요약

| 회사 | 확인 내용 | 출처 | 상태 |
|---|---|---|---|
| SK hynix | ASML TWINSCAN EXE:5200B(High-NA EUV)를 이천 M16에 반입(2025.09.03). 차세대 DRAM용 | https://news.skhynix.com/sk-hynix-introduces-industrys-first-commercial-high-na-euv/ | [읽음] |
| SK hynix | 2021년 7월 1anm LPDDR4를 "using EUV equipment"로 양산. 식각 깊이 측정 기법 "Lam Spectral Reflectometer (LSR)" 언급 | https://news.skhynix.com/en/details-defined-a-look-at-etch-technology/ | [읽음] |
| SK hynix | 산화 장비에 더미 웨이퍼를 넣어 양 끝 반응 차이를 보정, 수십 매 동시 처리 | Front-End Ep.2 | [읽음] |
| SK hynix | 교육센터에 산화막·폴리 식각 장비, 스크러버, 박막 CVD 장비 실습 (벤더 없음) | 교육센터 글 | [읽음] |
| SK hynix (SEC F-1/424B4, 2026) | 핵심 장비를 "a limited number of manufacturers in the Netherlands, the United States and Japan"에 의존 (회사명 없음). 팹은 이천·청주·우시·대련, M15X(청주), 용인 | https://www.sec.gov/Archives/edgar/data/0002120882/000119312526299963/d32785d424b4.htm | [읽음, 앞 100k자] |
| 삼성전자 | ASML과 협력해 2028년까지 첨단 D램에 High-NA EUV 도입 **계획**. "오랜 EUV 사용 경험" | 삼성반도체 뉴스룸 2026.09.08 | [읽음] |
| 삼성전자 | 화성 V1 = EUV 전용 라인(2020.02 양산 발표) | news.samsung.com | [실패(타임아웃)]. 스니펫으로만 확인 |
| Lam 10-K FY2026 | 주요 고객으로 Micron, Samsung Electronics, SK hynix, TSMC를 명시 (어떤 장비인지는 미기재) | sec.gov | [읽음] |

**주의**: 위 표 외에 삼성·SK hynix가 어떤 산화로, 트랙, 식각기, CVD, 이온주입기, PVD, CMP를 쓰는지는 공식 출처로 **확인 못 함**. 시뮬레이터에서 "삼성 표준 장비" 같은 표현은 쓰지 말 것. Lam 고객 명시는 회사 단위 거래 관계일 뿐, 특정 공정 장비 채택의 근거가 아님.

## 8. 실패·미확인 목록
- appliedmaterials.com 전체 403 → 10-K(sec.gov)와 검색 스니펫으로 대체
- news.skhynix.co.kr(한국어) 403 → news.skhynix.com(영문)으로 대체
- news.samsung.com 타임아웃 2회
- ebara.com 403 (CMP 벤더 자료 없음)
- kla.com 제품 페이지와 SPIE 초록 페이지는 본문이 비어 있음
- MIT 6.152J Oxidation(L3), Lithography(L14–15)는 PDF가 공개되어 있지 않음
- 인터락, MES, EFEM의 공식 설명은 허용 출처에서 **확인 못 함** (EFEM·로드락·시즌닝은 USPTO 특허 스니펫만 있음)
- NCS 학습모듈(ncs.go.kr) 원문은 검색되지 않음 (커뮤니티 요약만 있어 제외)
