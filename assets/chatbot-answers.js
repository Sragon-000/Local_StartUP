// Public facts only. Unknown operating policies must stay unconfirmed.
export const faqCategories = [
  { id: 'start', label: '소개·참여 대상' },
  { id: 'learning', label: '수업·창작 과정' },
  { id: 'schedule', label: '일정·장소' },
  { id: 'equipment', label: '준비물·장비' },
  { id: 'cost', label: '비용·결제' },
  { id: 'apply', label: '신청·변경' },
  { id: 'exhibit', label: '전시·결과물' },
  { id: 'support', label: '정보·문의' }
];

// Specific situations outrank broad terms such as "신청", "비용", or "언제".
// A rule can require multiple terms, e.g. [ /신청/, /취소/ ].
export const faqItems = [
  { id: 'course', category: 'start', question: '빛결은 어떤 프로그램인가요?', priority: 10,
    rules: [/빛결|프로그램|소개|서비스|뭐\s*하/],
    answer: '빛결은 미디어아트에 입문하는 비전공 대학생을 위해, AI 도구 체험부터 작품 기획·제작·전시까지 이어지는 경험을 준비하는 프로그램이에요. 대전을 기반으로 기획 중이며 아직 정식 운영 조건은 확정되지 않았습니다.' },
  { id: 'beginner', category: 'start', question: '처음이어도 참여할 수 있나요?', priority: 20,
    rules: [/처음|초보|입문|비전공|경험.*없|못.*해|잘.*못/],
    answer: '미디어아트와 AI 도구를 처음 접하는 비전공 대학생을 주요 대상으로 준비하고 있어요. 경험이 없는 입문자도 시작할 수 있는 과정을 목표로 하며, 세부 참여 조건은 모집 안내에서 확정할 예정이에요.' },
  { id: 'coding', category: 'start', question: '코딩이나 그림 실력이 필요하나요?',
    rules: [/코딩|프로그래밍|그림\s*(실력|못)|미술\s*(실력|못)|디자인\s*실력|개발\s*지식/],
    answer: '전문적인 코딩·미술 경험이 없는 비전공 대학생도 시작할 수 있는 과정을 목표로 합니다. 다만 구체적인 사용 도구와 필요한 기초 역량은 아직 정해지지 않았어요. 코딩이나 드로잉이 필수라고 안내하고 있지는 않습니다.' },
  { id: 'eligibility', category: 'start', question: '대학생이 아니거나 휴학생이어도 되나요?',
    rules: [/휴학|졸업|직장인|일반인|고등학생|중학생|대학원|타\s*전공|예술\s*전공|미술\s*전공|디자인\s*전공|대학생.*(아니|아닌)|전공자|전공(?:인데|이어도|해도)/],
    answer: '현재 주요 대상은 미디어아트에 입문하고 싶은 비전공 대학생이에요. 휴학생·졸업생·대학원생·일반인·예술 전공자의 참여 범위는 아직 확정되지 않았습니다. 관심 신청이 최종 참여 자격을 확인해주는 절차는 아니에요.' },
  { id: 'age', category: 'start', question: '나이 제한이나 학년 제한이 있나요?',
    rules: [/나이\s*제한|연령|학년|미성년|성인|몇\s*살|[0-9]+\s*살/],
    answer: '실제 프로그램의 나이·학년 제한은 아직 정해지지 않았어요. 현재 신청 폼의 나이 입력 가능 범위는 입력값 검증을 위한 것으로, 그 범위의 모든 사람이 참여할 수 있다는 뜻은 아닙니다.' },
  { id: 'residency', category: 'start', question: '대전에 살지 않아도 참여할 수 있나요?',
    rules: [/타\s*지역|다른\s*지역|거주|시민|주민|서울|세종|충남|대전.*(안\s*살|아니|밖|살지)/],
    answer: '대전을 기반으로 프로그램을 준비하고 있지만, 거주지에 따른 참여 제한이나 타 지역 참가 가능 여부는 아직 확정되지 않았어요. 현장 출석이 필요한지와 실제 이동 가능 여부도 일정·장소가 정해진 뒤 확인해주세요.' },
  { id: 'friends', category: 'start', question: '혼자 신청하거나 친구와 함께 신청해도 되나요?',
    rules: [/혼자|친구|동반|같이\s*신청|함께\s*신청|단체\s*신청/],
    answer: '현재 관심 신청은 개인별 정보를 남기는 방식이에요. 함께 관심을 남기고 싶다면 각자 폼을 작성해주세요. 동반 참여 보장이나 같은 팀 배정, 단체 접수는 아직 정해진 내용이 없습니다.' },
  { id: 'portfolio-entry', category: 'start', question: '신청할 때 포트폴리오나 작품을 제출하나요?',
    rules: [[/포트폴리오|작품|과제/, /제출|지원|신청|선발|심사/], /면접|선발\s*기준|선착순|추첨/],
    answer: '현재 관심 신청에는 포트폴리오·작품 제출이나 면접 절차가 없어요. 실제 모집의 선발 기준과 제출 자료는 아직 확정되지 않았으며, 관심 신청 순서가 참여 우선권을 보장하지는 않습니다.' },

  { id: 'curriculum', category: 'learning', question: '교육은 어떤 순서로 진행되나요?', priority: 20,
    rules: [/커리큘럼|교육|진행\s*(순서|과정)|배우|배워|배울|수업\s*내용/],
    answer: 'AI 체험 → 작품 기획 → 작품 제작 → 전시 준비 → 전시의 다섯 단계를 기획하고 있어요. 이미지·영상·사운드 등 다양한 표현 방식을 탐색하는 방향이며, 세부 차시와 실제 교육 내용은 준비 과정에서 구체화할 예정입니다.' },
  { id: 'tools', category: 'learning', question: '어떤 AI 도구를 사용하나요?',
    rules: [/도구|어떤\s*툴|사용.*툴|챗지피티|챗GPT|chatgpt|미드저니|midjourney|런웨이|runway|소라|sora|터치디자이너|touchdesigner/],
    answer: '이미지·영상·사운드 창작 도구를 탐색하는 방향이지만, 실제 사용할 서비스나 소프트웨어는 아직 확정되지 않았어요. 특정 유료 도구를 미리 구독할 필요가 있다고 안내하고 있지는 않습니다.' },
  { id: 'output-format', category: 'learning', question: '영상 말고 이미지나 사운드도 만들 수 있나요?',
    rules: [/이미지|영상|사운드|음악|애니메이션|3d|3D|인터랙티브|작품\s*형식/],
    answer: '이미지·영상·사운드 등 다양한 표현 방법을 검토하고 있어요. 짧은 AI 영상은 결과물 예시 중 하나이며, 각자 어떤 형식의 작품을 만들 수 있는지는 교육 내용과 장비 여건에 따라 추후 결정됩니다.' },
  { id: 'mentoring', category: 'learning', question: '강사 피드백이나 일대일 멘토링이 있나요?',
    rules: [/멘토|피드백|강사|튜터|일대일|1\s*[:대]\s*1|개별\s*지도/],
    answer: '강사·멘토 구성, 개별 피드백 방식, 일대일 지도 여부는 아직 확정되지 않았어요. 현재는 입문자가 작품을 구체화하는 과정을 기획 중이며 특정 전문가의 참여를 약속하고 있지는 않습니다.' },
  { id: 'homework', category: 'learning', question: '과제나 수업 외 작업이 많이 있나요?',
    rules: [/과제|숙제|작업량|난이도|수업\s*외|복습|예습/],
    answer: '과제 유무와 난이도, 수업 외에 필요한 작업 시간은 아직 정해지지 않았어요. 학업과 병행할 수 있는지 판단할 수 있도록 세부 운영 계획이 마련되면 확인할 필요가 있습니다.' },
  { id: 'teams', category: 'learning', question: '개인 작품인가요, 팀 프로젝트인가요?',
    rules: [/팀\s*(활동|작업|프로젝트|배정)|개인\s*(작품|작업)|협업|조별|팀플/],
    answer: '개인 제작과 팀 협업 중 어떤 방식으로 진행할지는 아직 확정되지 않았어요. 팀 구성 방법과 공동 작품의 역할 분담도 운영 계획을 정하면서 구체화할 예정입니다.' },
  { id: 'absence', category: 'learning', question: '결석하면 보강이나 녹화본이 제공되나요?',
    rules: [/결석|지각|보강|녹화|녹화본|다시\s*보기|다시보기|못\s*가|참석.*못|출석|중도\s*(포기|하차)/],
    answer: '출석 기준, 결석 시 보강·녹화본 제공, 중도 중단 기준은 아직 확정되지 않았어요. 빠진 수업을 자동으로 보충해드리거나 녹화본을 제공한다고 약속하고 있지는 않습니다.' },

  { id: 'schedule', category: 'schedule', question: '언제 어디서 진행되나요?', priority: 10,
    rules: [/언제|어디|일정|날짜|장소|지역|위치|대전/],
    answer: '대전을 기반으로 기획 중이며, 구체적인 일정과 장소는 아직 정해지지 않았어요. 관심 신청은 준비 소식을 위한 단계이며 참여 확정을 뜻하지 않습니다.', apply: true },
  { id: 'venue', category: 'schedule', question: '장소 주소와 교통·주차 안내가 있나요?',
    rules: [/주소|교통|주차|지하철|버스|역에서|건물|교육장|강의실/],
    answer: '교육·전시 장소가 확정되지 않아 주소, 대중교통 경로, 주차 가능 여부도 아직 안내할 수 없어요. 특정 학교나 기관의 공간에서 진행된다고 확정한 상태는 아닙니다.' },
  { id: 'online', category: 'schedule', question: '온라인이나 비대면으로도 참여할 수 있나요?',
    rules: [/온라인|오프라인|비대면|대면|원격|줌|zoom/],
    answer: '대전을 기반으로 준비 중이지만 대면·비대면·혼합 수업 여부는 아직 정해지지 않았어요. 온라인으로 전 과정을 참여할 수 있다고 안내하고 있지는 않습니다.' },
  { id: 'duration', category: 'schedule', question: '몇 주 동안, 주 몇 회 진행되나요?',
    rules: [/기간|몇\s*주|몇\s*회|주\s*[0-9몇]|시간|요일|주말|평일|저녁|오전|오후|8\s*주/],
    answer: '전체 운영 기간, 주당 횟수, 요일과 수업 시간은 아직 정해지지 않았어요. 기획 단계의 기간 예시는 실제 모집 일정으로 확정된 내용이 아닙니다.' },
  { id: 'capacity', category: 'schedule', question: '몇 명을 모집하고 대기 신청도 받나요?',
    rules: [/정원|인원|몇\s*명|모집\s*규모|대기|마감.*명|20\s*명/],
    answer: '실제 모집 인원과 대기 신청 운영 여부는 아직 정해지지 않았어요. 기획 단계의 인원 예시는 확정된 정원이 아니며, 현재 관심 신청이 좌석 확보나 대기 순번을 보장하지는 않습니다.' },
  { id: 'deadline', category: 'schedule', question: '신청 마감일과 다음 기수 일정은 언제인가요?',
    rules: [/마감|기한|다음\s*기수|다음\s*모집|추가\s*모집|몇\s*기|모집\s*시작/],
    answer: '정식 모집 시작일·마감일, 추가 모집과 다음 기수 일정은 아직 정해지지 않았어요. 현재는 프로그램에 대한 관심을 남기는 단계이며, 임의의 마감일이나 남은 자리를 안내하지 않습니다.', apply: true },
  { id: 'accessibility', category: 'schedule', question: '휠체어 접근이나 참여 지원을 받을 수 있나요?',
    rules: [/휠체어|접근성|이동\s*지원|장애|자막|수어|보조\s*인력|편의\s*지원/],
    answer: '장소의 접근성, 자막·수어 등 참여 지원 범위는 아직 확인되지 않았어요. 지원이 필요하다면 정식 모집 때 공개되는 공간·지원 안내를 먼저 확인해주세요. 이 챗봇으로 지원 요청이 접수되지는 않습니다.' },

  { id: 'laptop', category: 'equipment', question: '개인 노트북이 필요하고 권장 사양이 있나요?',
    rules: [/노트북|컴퓨터|권장\s*사양|최소\s*사양|맥북|맥\s*(가능|사용)|윈도우|태블릿|아이패드|아이폰|갤럭시/],
    answer: '개인 노트북 필요 여부와 최소·권장 사양, Mac·Windows·태블릿 지원은 사용할 도구에 따라 달라 아직 확정되지 않았어요. 사양 안내 전에 이 프로그램을 위해 새 장비를 구매해야 한다고 안내하고 있지는 않습니다.' },
  { id: 'rental', category: 'equipment', question: '노트북이나 촬영 장비를 빌릴 수 있나요?', priority: 80,
    rules: [/대여|대출|빌릴|빌려|렌탈|장비\s*제공/],
    answer: '노트북·촬영 장비 대여와 공용 장비 제공 여부, 대여 비용은 아직 확정되지 않았어요. 장비가 없어도 반드시 대여받을 수 있다고 약속하고 있지는 않습니다.' },
  { id: 'software', category: 'equipment', question: '미리 설치하거나 구독해야 할 프로그램이 있나요?', priority: 70,
    rules: [/설치|구독|라이선스|유료\s*계정|프로그램\s*구매|소프트웨어|어도비|adobe/],
    answer: '사전 설치 목록과 유료 구독·라이선스 필요 여부는 아직 정해지지 않았어요. 사용 도구와 비용 안내가 나오기 전에 특정 프로그램을 구매하거나 유료 구독할 필요가 있다고 안내하지 않습니다.' },
  { id: 'account', category: 'equipment', question: 'AI 서비스 계정을 미리 만들어야 하나요?',
    rules: [/계정|회원가입|로그인|가입해야|가입\s*필요/],
    answer: '수업용 AI 서비스의 계정 생성·로그인 필요 여부와 계정 준비 방식은 아직 확정되지 않았어요. 현재 빛결 관심 신청 자체에는 별도 회원가입이나 로그인이 필요하지 않습니다.' },
  { id: 'materials', category: 'equipment', question: '준비물이나 미리 구상할 주제가 있나요?',
    rules: [/준비물|준비해야|준비할|사전\s*준비|아이디어|주제|스케치|재료|필기도구/],
    answer: '사전 준비물과 작품 주제의 범위는 아직 정해지지 않았어요. 현재 관심 신청에는 미리 만든 작품이나 기획서를 요구하지 않습니다. 구체적인 준비물은 교육 내용과 도구가 확정된 뒤 확인해주세요.' },
  { id: 'english', category: 'equipment', question: '영어를 못해도 AI 도구를 사용할 수 있나요?',
    rules: [/영어|영문|언어|한국어|프롬프트/],
    answer: '입문자를 위한 과정을 목표로 하고 있지만 사용할 도구의 언어와 프롬프트 작성 지원 범위는 아직 확정되지 않았어요. 영어 능력 기준이 따로 안내된 상태는 아닙니다.' },

  { id: 'price', category: 'cost', question: '참가 비용이 궁금해요', priority: 10,
    rules: [/비용|가격|참가비|수강료|얼마|무료|유료|금액|돈/],
    answer: '참가 비용은 아직 확정되지 않았어요. 무료 여부도 운영 방식이 정해진 뒤 안내할 예정입니다. 현재 관심 신청에는 결제 절차가 없고, 관심 신청이 유료 참여 계약을 뜻하지는 않습니다.', apply: true },
  { id: 'extra-cost', category: 'cost', question: 'AI 구독료나 전시비가 별도로 드나요?', priority: 80,
    rules: [/추가\s*(비|요금)|별도\s*(비|요금)|재료비|전시비|구독료|교통비|식비|숙박비|포함.*비용|비용.*포함/],
    answer: 'AI 서비스 이용료, 재료비, 전시 관련 비용의 포함 범위와 별도 부담 여부는 아직 정해지지 않았어요. 교통·식사·숙박 지원도 확정되지 않았으며 참가비 외 비용이 없다고 보장하지는 않습니다.' },
  { id: 'discount', category: 'cost', question: '학생 할인이나 장학·지원 혜택이 있나요?',
    rules: [/할인|장학|지원금|국비|내일배움|얼리버드|혜택|쿠폰/],
    answer: '학생·동반 할인, 장학금, 국비 지원이나 기타 참여 혜택은 아직 확정되지 않았어요. 관심 신청자에게 특별 할인이나 우선권이 제공된다고 안내하고 있지는 않습니다.' },
  { id: 'payment', category: 'cost', question: '카드·계좌이체·분할 결제가 가능한가요?',
    rules: [/결제|카드|계좌|이체|할부|분할\s*납부|입금/],
    answer: '결제 수단과 납부 시점, 할부·분할 납부 조건은 아직 정해지지 않았어요. 현재 관심 신청 화면은 신청 정보를 받는 단계로, 결제나 송금을 요청하지 않습니다.' },
  { id: 'refund', category: 'cost', question: '참가 취소 시 환불은 어떻게 되나요?', priority: 80,
    rules: [/환불|취소\s*수수료|위약금|청약\s*철회/],
    answer: '유료 참가의 환불 기준과 취소 수수료는 아직 확정되지 않았어요. 현재 관심 신청에는 결제가 없으므로 이 신청을 통해 결제된 금액도 없습니다. 정식 유료 모집이 생기면 결제 전에 공개되는 조건을 확인해주세요.' },
  { id: 'receipt', category: 'cost', question: '영수증이나 증빙 서류를 받을 수 있나요?',
    rules: [/영수증|세금계산서|현금영수증|증빙|거래\s*명세/],
    answer: '영수증·세금계산서 등 결제 증빙의 발급 방식은 아직 정해지지 않았어요. 현재 관심 신청의 신청 번호는 접수 식별 정보이며, 결제 증빙이나 수료 증명서는 아닙니다.' },

  { id: 'apply', category: 'apply', question: '관심 신청은 어떻게 하나요?', priority: 10,
    rules: [/신청|등록|접수/],
    answer: '아래 ‘관심 신청하기’로 이동해 정보를 입력하고 필수 동의 항목을 확인한 뒤 제출해주세요. 서버에 저장되면 신청 완료 화면과 신청 번호가 표시돼요. 관심 신청은 프로그램 참여 확정이 아닙니다.', apply: true },
  { id: 'confirmation', category: 'apply', question: '관심 신청하면 참여가 확정되나요?', priority: 70,
    rules: [/참여\s*확정|확정.*(되|인가)|자동\s*(선발|등록)|선발.*(되|확정)|우선권|좌석\s*확보/],
    answer: '아니요. 관심 신청은 프로그램에 대한 관심을 남기는 단계이며 실제 모집·선발·참여 확정과는 다릅니다. 참여 확정 방식과 선발 기준은 아직 정해지지 않았어요.' },
  { id: 'notifications', category: 'apply', question: '신청했는데 확인 메일이나 문자가 안 와요', priority: 85,
    rules: [/확인\s*(메일|문자)|(메일|문자).*(안\s*와|발송|오나요|오나|와요|왔|언제|받|확인)|자동\s*발송|알림|소식|언제\s*연락/],
    answer: '현재 이메일·문자 자동 발송 기능은 아직 연결되지 않았어요. 따라서 신청 후 확인 메일이나 문자가 바로 오지 않을 수 있습니다. 접수 성공 여부는 제출 직후의 완료 화면과 신청 번호로 확인해주세요. 추후 안내 시점과 방식은 아직 정해지지 않았습니다.' },
  { id: 'status', category: 'apply', question: '내 신청이 접수됐는지 조회할 수 있나요?', priority: 65,
    rules: [/조회|접수\s*확인|신청\s*확인|신청\s*내역|신청\s*번호|접수.*(됐|되었)|완료\s*화면/],
    answer: '제출에 성공하면 신청 완료 화면과 신청 번호가 표시됩니다. 번호는 따로 보관해주세요. 현재 방문자용 신청 조회 기능은 없고, 이 챗봇도 DB에서 접수 여부나 신청 내용을 조회할 수 없습니다.' },
  { id: 'edit', category: 'apply', question: '이메일이나 전화번호를 잘못 적었어요', priority: 90,
    rules: [/오타|잘못\s*(적|입력|썼|남)|수정|정보\s*변경|번호.*바꾸|이메일.*바꾸|연락처.*바꾸/],
    answer: '현재 제출한 신청 정보를 직접 수정하는 기능은 없어요. 챗봇에 정확한 이메일·전화번호를 적어도 기존 신청이 수정되지는 않습니다. 별도 문의 연락처도 아직 준비 중이므로 수정 절차를 여기서 완료할 수는 없어요.' },
  { id: 'cancel', category: 'apply', question: '관심 신청을 취소하거나 정보를 삭제하고 싶어요', priority: 80,
    rules: [/취소|삭제|철회|동의.*취소/],
    answer: '현재 방문자용 신청 취소·삭제 기능은 없으며, 이 챗봇으로 요청이 접수되거나 신청 정보가 삭제되지는 않습니다. 별도 문의 연락처와 처리 절차도 아직 준비 중이에요. 신청은 참여 확정이나 결제를 뜻하지 않습니다.' },
  { id: 'duplicate', category: 'apply', question: '중복 신청했거나 여러 번 눌렀는데 괜찮나요?', priority: 80,
    rules: [/중복|두\s*번|여러\s*번|재신청|다시\s*신청/],
    answer: '현재 같은 이메일로 여러 건의 신청이 저장될 수 있어요. 제출 중 중복 클릭은 화면에서 막지만, 완료 후 다시 작성한 신청은 별도로 저장됩니다. 중복 신청이 참여 우선권을 주지는 않으며 챗봇이 중복 자료를 합치거나 삭제할 수는 없어요.' },
  { id: 'form-error', category: 'apply', question: '신청 버튼이 안 되거나 오류가 나요', priority: 90,
    rules: [/오류|에러|서버|멈췄|제출.*못/, [/신청|폼|제출|버튼|입력|페이지|화면/, /안\s*(돼|되|눌|넘어)|실패|못/], /연결.*(오류|실패|안\s*되|안\s*돼)/],
    answer: '이름·나이·성별·이메일·전화번호·필수 동의를 확인하고, 화면에 표시된 입력 오류를 먼저 수정해주세요. 서버 연결 오류라면 입력값을 유지한 채 연결 상태를 확인한 후 다시 시도해보세요. 완료 화면과 신청 번호를 확인하기 전에는 접수 성공으로 보지 말아주세요. 챗봇이 대신 제출하지는 않습니다.', apply: true },
  { id: 'mobile', category: 'apply', question: '스마트폰으로도 관심 신청할 수 있나요?', priority: 70,
    rules: [/스마트폰.*신청|휴대폰.*신청|핸드폰.*신청|모바일|자바스크립트|javascript|브라우저/],
    answer: '현재 신청 화면은 모바일에서도 입력할 수 있도록 구성되어 있어요. 신청을 제출하려면 JavaScript가 켜져 있어야 합니다. 스마트폰으로 관심 신청할 수 있다는 것이 스마트폰만으로 모든 수업을 수강할 수 있다는 뜻은 아니에요.', apply: true },

  { id: 'exhibit', category: 'exhibit', question: '작품은 실제로 전시되나요?', priority: 10,
    rules: [/전시|상영|결과물|작품|성과/],
    answer: '직접 만든 미디어 작품을 선보이는 전시 경험을 핵심 목표로 기획하고 있어요. 짧은 AI 영상과 소규모 상영회 등을 검토 중이지만 작품 형식·전시 공간·운영 방식은 아직 확정되지 않았습니다.' },
  { id: 'ownership', category: 'exhibit', question: '제작한 작품의 저작권은 누구에게 있나요?', priority: 80,
    rules: [/저작권|소유권|귀속|권리|초상권/],
    answer: '작품의 권리 귀속, 공동 제작물 처리, 사용 자료와 초상 활용 조건은 아직 정해지지 않았어요. 사용 도구와 자료의 이용 조건도 함께 확인해야 하므로, 참가자가 모든 권리를 갖거나 운영자가 양도받는다고 미리 확정하지 않습니다.' },
  { id: 'commercial', category: 'exhibit', question: '만든 작품을 판매하거나 상업적으로 써도 되나요?', priority: 80,
    rules: [/상업|판매|수익|상품|사업.*활용/],
    answer: '작품의 상업적 활용과 판매 가능 여부는 아직 확정되지 않았어요. 실제 사용 도구·자료의 조건과 운영 정책이 정해진 뒤 확인해야 하며 판매 가능이나 수익 발생을 보장하지 않습니다.' },
  { id: 'publication', category: 'exhibit', question: '작품이나 제 사진이 SNS에 공개되나요?', priority: 80,
    rules: [/sns|인스타|유튜브|촬영|사진.*공개|공개.*동의|홍보|게시|공개.*싫|비공개/],
    answer: '작품의 온라인 공개, 현장 촬영과 홍보 활용 범위 및 동의 방식은 아직 정해지지 않았어요. 현재 관심 신청 동의가 작품·얼굴 사진의 홍보 활용 동의를 뜻하지는 않습니다. 챗봇에서 공개 동의를 받거나 철회 처리하지도 않아요.' },
  { id: 'portfolio', category: 'exhibit', question: '결과물을 포트폴리오로 쓰고 파일도 받을 수 있나요?',
    rules: [/포트폴리오|원본|파일|다운로드|소장|저장.*작품/],
    answer: '작품 제작과 전시 경험을 목표로 하지만, 결과물 파일 제공 형식과 보관 기간, 포트폴리오 사용 범위는 아직 확정되지 않았어요. 개인·공동 작업 여부와 이용 조건이 정해진 뒤 확인해주세요.' },
  { id: 'certificate', category: 'exhibit', question: '수료증이나 학점·봉사시간이 제공되나요?',
    rules: [/수료|이수|학점|봉사|인증서|자격증|수료증/],
    answer: '수료증·이수 확인서 발급, 학점·봉사시간 인정, 자격증 연계는 아직 정해진 내용이 없어요. 출석이나 참여만으로 이러한 증명이 자동 발급된다고 안내하지 않습니다.' },
  { id: 'career', category: 'exhibit', question: '취업·인턴이나 공모전 참가로 연결되나요?',
    rules: [/취업|채용|인턴|공모전|진로|취직|입상|수상/],
    answer: '빛결은 AI 창작과 미디어아트 입문 경험을 준비하는 프로그램이에요. 취업·인턴·공모전 연계나 수상, 특정 성과를 보장하는 과정으로 확정된 것은 아닙니다.' },

  { id: 'fields', category: 'support', question: '관심 신청에 어떤 정보를 입력해야 하나요?',
    rules: [/수집\s*항목|입력\s*항목|어떤\s*정보|무슨\s*정보|필수\s*항목|성별|나이.*(입력|필수|왜)/, [/전화번호|이메일/, /필수|왜|꼭|입력해야/]],
    answer: '현재 관심 신청은 이름·나이·성별·이메일·전화번호와 개인정보 수집·이용 동의가 필수예요. 미디어콘텐츠 경험 여부는 경험이 있을 때 체크하며, 체크하지 않으면 경험 없음으로 저장됩니다. 폼의 안내 내용을 확인하고 입력해주세요.', apply: true },
  { id: 'experience', category: 'support', question: '미디어콘텐츠 경험 체크박스는 꼭 체크해야 하나요?', priority: 75,
    rules: [/체크박스|체크.*경험|경험.*체크|미디어콘텐츠\s*경험/],
    answer: '경험이 있는 경우에만 ‘미디어콘텐츠 경험이 있습니다’를 체크해주세요. 체크하지 않으면 경험 없음으로 저장됩니다. 필수 동의 체크박스와는 다른 항목이며, 경험이 없다는 이유만으로 관심 신청이 막히지는 않아요.' },
  { id: 'privacy', category: 'support', question: '신청 정보는 공개되거나 챗봇에서 조회되나요?', priority: 70,
    rules: [/개인정보|정보\s*공개|정보.*(공유|보호)|누가.*(정보|조회)|다른\s*사람.*신청/],
    answer: '현재 신청 정보는 서버에 저장되며 관리자 인증 후 조회하는 구조입니다. 방문자용 공개 신청 목록은 없고, 챗봇은 신청 DB를 조회하지 않아요. 정식 운영에 필요한 상세 개인정보 안내는 아직 보완 중입니다. 챗봇에는 실제 연락처나 민감한 정보를 적지 마세요.' },
  { id: 'retention', category: 'support', question: '개인정보는 얼마나 보관하고 자동 삭제하나요?', priority: 95,
    rules: [/보유|보관\s*기간|얼마나.*(저장|보관)|자동\s*삭제|파기|정보.*(언제.*삭제|남아)/],
    answer: '개인정보 보유 기간과 자동 삭제 정책은 아직 확정되지 않았어요. 현재 신청 내용은 서버에 저장되며, 일정 기간 뒤 자동으로 삭제된다고 안내하고 있지는 않습니다. 챗봇도 신청 정보를 삭제하거나 보유 기간을 변경할 수 없어요.' },
  { id: 'chat-privacy', category: 'support', question: '챗봇 대화는 저장되거나 운영자에게 전달되나요?', priority: 100,
    rules: [[/챗봇|채팅|대화/, /저장|기록|전달|전송|보관|ai|AI|비용|누가|어떻게|인공지능/], /대화\s*내역/],
    answer: '미리 작성한 FAQ를 찾아 안내하는 방식으로 외부 AI를 호출하지 않습니다. 대화는 현재 페이지의 메모리에서만 처리하고, 서버·브라우저 저장소·외부 AI 서비스에 저장하거나 전송하지 않아요. 새로고침하거나 다른 화면으로 이동하면 초기화됩니다. 현재 페이지에서도 최근 메시지만 유지하며 운영자에게 문의가 전달되지는 않습니다.' },
  { id: 'operator', category: 'support', question: '운영자나 상담원에게 직접 문의할 수 있나요?', priority: 20,
    rules: [/운영자|운영팀|담당자|상담원|문의|연락처|전화\s*상담|메일\s*주소|누가\s*운영|주최/],
    answer: '운영자 소개와 별도 문의 연락처는 아직 준비 중이에요. 이 챗봇은 공개된 프로그램 FAQ만 안내하며, 대화를 운영자에게 전달하거나 답변을 요청하는 기능은 없습니다. 신청 수정·취소 같은 요청도 여기서 접수되지 않아요.' }
];

export const suggestedQuestions = ['처음이어도 참여할 수 있나요?', '언제 어디서 진행되나요?', '참가 비용이 궁금해요', '관심 신청은 어떻게 하나요?'];

const normalize = text => text.normalize('NFKC').trim().toLowerCase();
const compact = text => normalize(text).replace(/[\s?!.,。？！~]/gu, '');
const questionIndex = new Map(faqItems.map(item => [compact(item.question), item]));

function response(items) {
  return { text: items.map(item => item.answer).join('\n\n'), topic: items[0].id,
    apply: items.some(item => item.apply === true) };
}

export function getReply(input, previousTopic = null) {
  const text = normalize(input);
  if (!text) return { text: '궁금한 내용을 입력하거나 추천 질문·전체 FAQ를 눌러주세요.', topic: null, apply: false };
  if (text.length > 500) return { text: '질문은 500자 이내로 입력해주세요.', topic: null, apply: false };
  if (/^(안녕(?:하세요)?|반가워(?:요)?|하이|hello|hi)[!.?~\s]*$/u.test(text)) {
    return { text: '안녕하세요! 빛결의 FAQ 안내 도우미예요. 참여 대상·수업·준비물·신청·전시 등 궁금한 점을 물어보세요. ‘전체 FAQ’에서 분야별 질문도 찾아볼 수 있어요.', topic: null, apply: false };
  }
  if (/^(감사(?:합니다|해요)?|고마워(?:요)?|고맙습니다|네|넵|알겠(?:어요|습니다)|응)[!.?~\s]*$/u.test(text)) {
    return { text: '도움이 되었다니 기뻐요. 다른 궁금한 점도 편하게 물어보세요.', topic: previousTopic, apply: false };
  }
  const exact = questionIndex.get(compact(text));
  if (exact) return response([exact]);
  const matches = faqItems.flatMap((item, order) => {
    const matched = item.rules.some(rule => (Array.isArray(rule) ? rule : [rule]).every(pattern => pattern.test(text)));
    return matched ? [{ item, score: item.priority ?? 60, order }] : [];
  }).sort((a, b) => b.score - a.score || a.order - b.order);
  if (matches.length) {
    // Once a precise intent is found, omit generic matches such as "신청".
    const specific = matches.filter(match => match.score >= 50);
    const broad = matches.length > 1 ? matches.filter(match => match.item.id !== 'course') : matches;
    const selected = (specific.length ? specific : broad).slice(0, 2).map(match => match.item);
    return response(selected);
  }
  if (previousTopic && /자세히|더\s*알려|다시\s*설명/.test(text)) {
    const previous = faqItems.find(item => item.id === previousTopic);
    if (previous) return response([previous]);
  }
  return { text: '이 질문에 해당하는 안내는 아직 준비되어 있지 않아요. 저는 정해진 FAQ를 바탕으로 안내하며, 자유로운 AI 상담이나 운영자 연결은 제공하지 않습니다. ‘전체 FAQ’에서 분야별 질문을 찾아보거나 조금 더 구체적으로 물어봐주세요.', topic: null, apply: false };
}
