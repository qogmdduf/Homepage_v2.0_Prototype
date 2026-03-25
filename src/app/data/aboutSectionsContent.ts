/**
 * 회사소개 상세 트리 — PDF(20250901)·PPT(2024.08 연구전담) 기반
 * 이미지: public/about/ppt-2024-08/media/
 */

import type { AboutPageLang } from './aboutPageContent';
import { aboutPptAssetBase } from './aboutPageContent';

export type CaseIndustry = 'manufacturing' | 'ai-vision' | 'platform';

/** 회사 개요 연혁 — 카테고리별 뱃지·아이콘 매핑용 */
export type CompanyTimelineCategory =
  | 'establishment'
  | 'contract'
  | 'patent'
  | 'award'
  | 'cert'
  | 'global'
  | 'product'
  | 'maintenance'
  | 'outlook'
  | 'partner';

export interface CompanyTimelineEntry {
  id: string;
  year: number;
  month: string;
  headline: string;
  category: CompanyTimelineCategory;
  detail?: string;
}

export interface AboutNavItem {
  path: string;
  label: string;
}

export interface CaseStudyDef {
  id: string;
  industry: CaseIndustry;
  image?: string;
  ko: {
    title: string;
    summary: string;
    problem: string;
    solution: string;
    result: string;
    testimonial?: string;
    metrics?: { label: string; value: string }[];
  };
  en: {
    title: string;
    summary: string;
    problem: string;
    solution: string;
    result: string;
    testimonial?: string;
    metrics?: { label: string; value: string }[];
  };
}

export interface AboutSectionsBundle {
  metaTitleSuffix: string;
  nav: AboutNavItem[];
  hub: {
    title: string;
    lead: string;
    story: string;
    cards: { path: string; title: string; desc: string }[];
  };
  /** /about 스토리 랜딩 (토스 팀 페이지식 한 페이지 내러티브) */
  storyLanding: {
    heroLines: [string, string];
    heroSub: string;
    missionLabel: string;
    missionTitle: string;
    missionBody: string;
    pillars: { title: string; line: string; body: string }[];
    proofEyebrow: string;
    proofTitle: string;
    exploreTitle: string;
    exploreLead: string;
  };
  company: {
    metaTitle: string;
    eyebrow: string;
    title: string;
    tagline: string;
    snapshotTitle: string;
    snapshotFacts: { label: string; value: string }[];
    ceoGreetingTitle: string;
    ceoGreetingHeadline: string;
    ceoGreetingBody: string;
    ceoGreetingName: string;
    ceoGreetingRole: string;
    ceoGreetingImage: string;
    ceoGreetingImageAlt: string;
    businessTitle: string;
    businessLead: string;
    businessKeywords: string[];
    orgChartTitle: string;
    orgLevels: { title: string; description: string; units: string[] }[];
    timeline: CompanyTimelineEntry[];
    historyTitle: string;
    historyLead: string;
    locationTitle: string;
    locations: { name: string; detail: string }[];
    globalNote: string;
    partnersTitle: string;
    partnersLead: string;
    partnersCta: string;
    partnersHref: string;
    certTitle: string;
    certifications: string[];
    patentsTitle: string;
    patentsLead: string;
    patents: string[];
    heroImage: string;
    heroImageAlt: string;
  };
  vision: {
    metaTitle: string;
    eyebrow: string;
    title: string;
    /** 히어로 하단 리드 (애플 HIG 키워드 등) */
    pageLead: string;
    missionTitle: string;
    missionBody: string;
    visionTitle: string;
    visionBody: string;
    valuesTitle: string;
    values: { title: string; body: string }[];
    ceoTitle: string;
    ceoBody: string;
    image: string;
    imageAlt: string;
  };
  services: {
    metaTitle: string;
    eyebrow: string;
    title: string;
    lead: string;
    categories: { key: string; title: string; desc: string; solutionIds: string[] }[];
    effectsTitle: string;
    effects: string[];
  };
  cases: {
    metaTitle: string;
    eyebrow: string;
    title: string;
    lead: string;
    filterAll: string;
    filterLabels: Record<CaseIndustry, string>;
    detailEyebrow: string;
  };
  team: {
    metaTitle: string;
    eyebrow: string;
    title: string;
    lead: string;
    leadershipTitle: string;
    ceoName: string;
    ceoRole: string;
    ceoBio: string;
    cultureTitle: string;
    cultureBullets: string[];
    waysTitle: string;
    waysBullets: string[];
    welfareTitle: string;
    welfareBullets: string[];
    hireNote: string;
    image: string;
    imageAlt: string;
  };
  process: {
    metaTitle: string;
    eyebrow: string;
    title: string;
    lead: string;
    phases: { title: string; body: string }[];
    collabTitle: string;
    collabBullets: string[];
    commTitle: string;
    commBullets: string[];
    qaTitle: string;
    qaBullets: string[];
    image: string;
    imageAlt: string;
  };
  insights: {
    metaTitle: string;
    eyebrow: string;
    title: string;
    lead: string;
    placeholderNote: string;
    topics: { title: string; desc: string }[];
  };
  careers: {
    metaTitle: string;
    eyebrow: string;
    title: string;
    lead: string;
    processTitle: string;
    processSteps: string[];
    cultureTeaser: string;
    positionsNote: string;
    /** 히어로 하단 수치 스트립 (EVP·신뢰) */
    stats: { value: string; label: string }[];
    /** 다크 밴드 한 줄 메시지 */
    evpLine: string;
    evpBody: string;
    /** 왜 합류하는가 — 3포인트 */
    whyTitle: string;
    whyPoints: { title: string; body: string }[];
    /** Build with us */
    buildEyebrow: string;
    buildTitle: string;
    buildLead: string;
    buildAreas: { key: 'factory' | 'workflow' | 'database'; label: string; title: string; body: string }[];
    /** 역할 트랙 (IT 채용 페이지 트렌드) */
    tracksTitle: string;
    tracksLead: string;
    tracks: { title: string; body: string; tags: string[] }[];
    /** 일하는 방식·제안 */
    perksTitle: string;
    perks: string[];
    /** 맞는 사람 */
    fitEyebrow: string;
    fitTitle: string;
    fitTraits: { key: 'users' | 'message' | 'chart'; label: string; title: string; body: string }[];
    processSubtitle: string;
    processHeading: string;
    openRolesEyebrow: string;
    evpEyebrow: string;
  };
  contact: {
    metaTitle: string;
    eyebrow: string;
    title: string;
    lead: string;
    formCta: string;
    rows: { label: string; value: string }[];
    tabTech: string;
    tabAdopt: string;
    step01Label: string;
    step01Title: string;
    step01Note: string;
    companyLabel: string;
    nameLabel: string;
    emailLabel: string;
    phoneLabel: string;
    phCompany: string;
    phName: string;
    phEmail: string;
    phPhone: string;
    step02Label: string;
    step02Title: string;
    step02Hint: string;
    products: { id: string; label: string }[];
    step03TechLabel: string;
    step03TechTitle: string;
    issueTypes: { id: string; label: string }[];
    step03AdoptLabel: string;
    step03AdoptTitle: string;
    adoptTopics: { id: string; label: string }[];
    step04Label: string;
    step04Title: string;
    fileHint: string;
    fileButton: string;
    privacyLabel: string;
    privacyDetail: string;
    submit: string;
    directTitle: string;
    emailLine: string;
    phoneLine: string;
    mailCta: string;
    phoneCta: string;
    successTitle: string;
    successBody: string;
  };
  cta: { title: string; button: string; secondary: string };
}

export const caseStudies: CaseStudyDef[] = [
  {
    id: 'lg-enterprise-digital',
    industry: 'manufacturing',
    image: `${aboutPptAssetBase}/image11.jpeg`,
    ko: {
      title: '대기업 전사·현장 시스템 파트너십',
      summary: 'LG전자 창원 2공장 시스템 개발·유지보수부터 GMES 2.0·전사 협업까지.',
      problem:
        '레거시와 신규 시스템이 공존하고, 생산·품질·협업 데이터가 분절되어 전사 가시성과 대응 속도가 떨어지는 환경이었습니다.',
      solution:
        '생산 시뮬레이션·품질 결산·협업 시스템 등 모듈형 개발과 LG CNS 1차 파트너 체계로 단계적 고도화를 수행했습니다.',
      result:
        '전사 프로젝트 참여, GMES Palletizing·PDA·OQC 마이그레이션 등 핵심 과제 수행으로 운영 안정성과 협업 체계를 강화했습니다.',
      metrics: [
        { label: '파트너 등록', value: 'LG CNS 1차' },
        { label: '특허', value: '공정·품질 다수' },
      ],
    },
    en: {
      title: 'Enterprise & plant systems with LG',
      summary: 'From Changwon Plant 2 build and maintenance to GMES 2.0 and collaboration programs.',
      problem:
        'Legacy and new systems coexisted; production, quality, and collaboration data were fragmented, slowing visibility and response.',
      solution:
        'Modular delivery—simulation, quality settlement, collaboration—and tier-1 LG CNS partnership for phased modernization.',
      result:
        'Delivered enterprise programs including GMES palletizing, PDA, and OQC migration—stronger operations and collaboration.',
      metrics: [
        { label: 'Partnership', value: 'LG CNS tier-1' },
        { label: 'IP', value: 'Process & quality patents' },
      ],
    },
  },
  {
    id: 'production-simulation',
    industry: 'platform',
    image: `${aboutPptAssetBase}/image43.png`,
    ko: {
      title: '생산 시뮬레이션·물동량·자원 최적화',
      summary: 'UPH·물동량·인원·교차 생산 관점에서 생산성과 자원 배분을 데이터로 설계.',
      problem:
        '시간당 생산 단위(UPH)와 물동량·인력 배치가 경험 의존적이어서 과잉 재고·병목·유휴 자원이 반복되었습니다.',
      solution:
        '실시간·시뮬레이션 데이터를 연계해 생산 가능 단위 예측, 창고·라인 물동 최적화, 교차 생산 시나리오를 구현했습니다.',
      result:
        '계획·실적 가시화와 시나리오 비교로 병목 완화와 자원 효율 개선에 기여했습니다.',
      metrics: [
        { label: '범위', value: 'UPH·물동·인원' },
        { label: '접근', value: '시뮬레이션' },
      ],
    },
    en: {
      title: 'Production simulation & flow optimization',
      summary: 'UPH, logistics, staffing, and cross-production scenarios driven by data.',
      problem:
        'UPH and logistics relied on tacit knowledge, causing inventory imbalance, bottlenecks, and idle resources.',
      solution:
        'Linked real-time and simulation data for UPH forecasting, warehouse/line flow, and cross-production scenarios.',
      result:
        'Improved plan vs. actual visibility and scenario comparison to ease bottlenecks and resource use.',
      metrics: [
        { label: 'Scope', value: 'UPH, flow, labor' },
        { label: 'Approach', value: 'Simulation' },
      ],
    },
  },
  {
    id: 'quality-settlement',
    industry: 'manufacturing',
    image: `${aboutPptAssetBase}/image40.png`,
    ko: {
      title: '품질 결산·대시보드·규정 준수',
      summary: '불량 원인 추적과 KPI·문서 관리를 통합한 품질 운영.',
      problem:
        '품질 데이터가 부서별로 흩어져 불량 원인 분석과 개선 추적, 규정 문서 관리가 일관되지 않았습니다.',
      solution:
        '실시간 수집·대시보드·불량 분석·개선 조치 추적·문서 관리를 하나의 품질 결산 흐름으로 설계했습니다.',
      result:
        'KPI 가시화와 데이터 기반 개선 사이클로 품질 운영의 재현성을 높였습니다.',
      metrics: [
        { label: '특허', value: '품질 결산 등' },
        { label: '기능', value: 'KPI·추적' },
      ],
    },
    en: {
      title: 'Quality settlement, dashboards, compliance',
      summary: 'Integrated root-cause, KPIs, and controlled documentation.',
      problem:
        'Quality data was siloed; root-cause analysis, improvement tracking, and document control were inconsistent.',
      solution:
        'Designed a quality settlement flow: real-time capture, dashboards, defect analytics, action tracking, and docs.',
      result:
        'Better KPI visibility and a repeatable, data-driven improvement loop.',
      metrics: [
        { label: 'IP', value: 'Quality patents' },
        { label: 'Features', value: 'KPI & trace' },
      ],
    },
  },
  {
    id: 'collaboration-platform',
    industry: 'platform',
    image: `${aboutPptAssetBase}/image41.jpeg`,
    ko: {
      title: '제조 생산 업무 협업 시스템',
      summary: '설비·품질·근태·인재 육성까지 연결한 협업·의사결정 허브.',
      problem:
        '생산·품질·설비·인력 정보가 분리되어 현장·관리자 간 의사결정이 느리고 데이터 근거가 부족했습니다.',
      solution:
        '실시간 모니터링, 설비 상태, 품질, 근태, 교육/성장 데이터를 통합한 협업 플랫폼을 구축했습니다.',
      result:
        '부서 간 가시성과 협업 속도를 높이고 데이터 기반 의사결정을 지원했습니다.',
      testimonial:
        '파트너십은 단순 공급이 아니라 혁신과 시장 변화를 함께 만드는 관계를 지향합니다. (회사소개서)',
    },
    en: {
      title: 'Manufacturing collaboration platform',
      summary: 'Unified equipment, quality, attendance, and talent signals for decisions.',
      problem:
        'Production, quality, assets, and HR data were siloed—slow decisions with weak evidence.',
      solution:
        'Built a collaboration hub: real-time monitoring, asset health, quality, attendance, and learning data.',
      result:
        'Improved cross-team visibility, faster collaboration, and data-backed decisions.',
      testimonial:
        'We go beyond supply—we co-create innovation and market change with partners. (Company deck)',
    },
  },
  {
    id: 'machine-vision-inspection',
    industry: 'ai-vision',
    image: `${aboutPptAssetBase}/image42.jpeg`,
    ko: {
      title: '머신 비전 & 러닝 검사',
      summary: '냉장고 도어 부품 누락·고무 소재 정위치 등 고객사 맞춤 비전 검사.',
      problem:
        '수작업·샘플링 검사로 클레임 리스크가 있고, 부품·소재별 미세한 위치·누락 판정을 일관되게 자동화하기 어려웠습니다.',
      solution:
        '부품별 색상·위치 학습, 소재별 OK/NG 학습을 적용한 머신 비전·러닝 파이프라인을 구축했습니다.',
      result:
        '누락·정위치 판정을 자동화해 검사 재현성과 처리량을 개선했습니다.',
      metrics: [
        { label: '적용', value: '도어·고무 소재' },
        { label: '방식', value: '학습 기반' },
      ],
    },
    en: {
      title: 'Machine vision & learning inspection',
      summary: 'Door-part omission and rubber positioning with customer-specific models.',
      problem:
        'Manual and sampling inspection left claim risk; consistent auto judgment per part/material was hard.',
      solution:
        'Vision + learning pipelines with color/position training and per-material OK/NG models.',
      result:
        'Automated omission and positioning checks—better repeatability and throughput.',
      metrics: [
        { label: 'Use cases', value: 'Door, rubber' },
        { label: 'Method', value: 'Learned models' },
      ],
    },
  },
];

export function getCaseStudy(id: string, lang: AboutPageLang) {
  const c = caseStudies.find(x => x.id === id);
  if (!c) return null;
  return { def: c, copy: lang === 'ko' ? c.ko : c.en };
}

export const aboutSections: Record<AboutPageLang, AboutSectionsBundle> = {
  ko: {
    metaTitleSuffix: ' | WIZFACTORY',
    nav: [
      { path: '/about', label: '스토리' },
      { path: '/about/company', label: '회사 개요' },
      { path: '/about/vision', label: '비전 · 미션 · 가치' },
      { path: '/about/services', label: '서비스 · 솔루션' },
      { path: '/about/cases', label: '사례' },
      { path: '/about/team', label: '팀 · 문화' },
      { path: '/about/process', label: '프로세스' },
      { path: '/about/insights', label: '인사이트' },
      { path: '/about/careers', label: '채용' },
      { path: '/about/contact', label: '문의' },
    ],
    hub: {
      title: '고객과 함께 성장하는 디지털 성장 파트너',
      lead: '클라우드·데이터·AI로 제조 현장을 연결합니다. 아래에서 근거와 신뢰를 페이지별로 확인하세요.',
      story:
        '위즈팩토리는 스마트팩토리 솔루션 전문 기업으로, IoT·빅데이터·AI·CPS·클라우드를 통합해 생산·품질·설비·에너지까지 현장 데이터를 하나의 흐름으로 만듭니다. 대기업 전사·현장 프로젝트와 특허·파트너십으로 실행력을 증명하고, 투자자·파트너·고객이 각각 필요한 깊이의 정보를 찾을 수 있도록 상세 페이지를 분리했습니다.',
      cards: [
        { path: '/about/company', title: '회사 개요', desc: '한 줄 소개, 연혁, 조직, 위치, 인증·특허' },
        { path: '/about/vision', title: '비전 · 미션 · 가치', desc: '존재 이유, 방향, 일하는 방식, 대표 메시지' },
        { path: '/about/services', title: '서비스 · 솔루션', desc: '카테고리별 상세로 연결, 기대 효과' },
        { path: '/about/cases', title: '사례', desc: '문제 → 해결 → 결과, 수치·스토리' },
        { path: '/about/team', title: '팀 · 문화', desc: '리더십, 문화, 복지, 채용 연결' },
        { path: '/about/process', title: '프로세스', desc: '진행 단계, 협업·커뮤니케이션·유지보수' },
        { path: '/about/insights', title: '인사이트', desc: '기술·산업 콘텐츠(준비 중)' },
        { path: '/about/careers', title: '채용', desc: '프로세스와 지원 안내' },
        { path: '/about/contact', title: '문의', desc: '연락처, 상담 요청' },
      ],
    },
    storyLanding: {
      heroLines: ['제조 현장의 데이터로,', '지속 가능한 경쟁력을 만듭니다'],
      heroSub:
        '변화를 원하는 사람들이 모여, 현장과 경영이 같은 데이터로 숨 쉬는 스마트팩토리를 만듭니다.',
      missionLabel: 'Company Mission',
      missionTitle: '위즈팩토리는 제조 실행의 디지털 기준을 세우는 팀입니다.',
      missionBody:
        '산업용 장비·공장·공정 자동화로 생산 효율을 높이고, AI·IoT로 데이터를 연결합니다. 대기업 현장과 전사 프로젝트에서 검증된 실행력으로, 도입이 끝나는 순간이 아니라 운영·성장까지 함께합니다.',
      pillars: [
        {
          title: '데이터로 말한다',
          line: '현장의 결정은 숫자와 흐름으로',
          body:
            '생산·품질·설비 데이터를 수집·분석하는 애플리케이션과, 이를 잇는 플랫폼·IoT 게이트웨이까지. 보이지 않던 병목을 데이터로 드러내고, 개선의 근거를 제시합니다.',
        },
        {
          title: '고객과 함께 성장',
          line: '요구를 과제로, 과제를 제품으로',
          body:
            'LG전자·LG CNS 등 생산 현장과 장기 협업을 이어가며, 불만이 아니라 다음 스프린트의 입력으로 받습니다. 파트너의 성장이 곧 우리의 성장이라고 믿습니다.',
        },
        {
          title: '실행력',
          line: '기획을 넘어, 운영까지',
          body:
            '시뮬레이션·품질 결산·협업 시스템 등 모듈형 개발과 유지보수로 현장을 비우지 않습니다. 특허·인증과 파트너 등록으로 신뢰를 쌓습니다.',
        },
        {
          title: '사람이 경쟁력',
          line: '최고의 인재로 최첨단 역량을',
          body:
            'SW·연구·디자인·지원이 한 조직 안에서 맞물립니다. 창의적·비전적인 인재에게 성장할 환경을 제공하는 것이 우리의 비전입니다.',
        },
      ],
      proofEyebrow: 'Proof',
      proofTitle: '숫자와 연혁으로 보는 위즈팩토리',
      exploreTitle: '더 깊이 보기',
      exploreLead: '필요한 정보만 골라 이어서 읽을 수 있습니다.',
    },
    company: {
      metaTitle: '회사 개요',
      eyebrow: 'COMPANY',
      title: '회사 개요',
      tagline:
        '주식회사 위즈팩토리 — 스마트팩토리 솔루션 개발·운영 전문 기업. MES, 설비 모니터링, 공정 데이터, IoT 게이트웨이로 제조 디지털 전환을 지원합니다.',
      snapshotTitle: '핵심 정보',
      snapshotFacts: [
        { label: '설립', value: '2022년 5월 11일' },
        { label: '대표이사', value: '배흥열' },
        { label: '본사', value: '경남 창원 (과기진흥원)' },
        { label: '사업', value: '스마트팩토리 SW·운영' },
        { label: '특허·출원', value: '공정·품질·협업 다수' },
        { label: '파트너', value: 'LG CNS 1차 등' },
      ],
      ceoGreetingTitle: '대표이사 인사말',
      ceoGreetingHeadline: '경영과 현장의 간격을 좁히는\n파트너가 되겠습니다.',
      ceoGreetingBody:
        '위즈팩토리는 제조 현장의 데이터를 연결하고, 실행 가능한 소프트웨어로 경영과 현장의 간격을 좁히는 일에 집중합니다.\n\nLG전자에서 대기업 전사 시스템을 오랜 기간 총괄하며 체득한 운영·품질·일정 관리의 기준을 바탕으로, 고객과 파트너와의 신뢰를 최우선으로 합니다.\n\n스마트팩토리 도입이 단순한 시스템 구축이 아니라 지속 가능한 경쟁력이 되도록, 끝까지 책임지는 파트너가 되겠습니다.',
      ceoGreetingName: '배흥열',
      ceoGreetingRole: '대표이사',
      ceoGreetingImage: '/about/ceo-portrait1.png',
      ceoGreetingImageAlt: '주식회사 위즈팩토리 대표이사 배흥열',
      businessTitle: '사업 개요',
      businessLead:
        '제조 실행(MES)·공정·품질·설비 데이터를 수집·분석하는 애플리케이션과, 이를 연결하는 플랫폼·IoT 게이트웨이·산업용 디바이스 영역까지 아우릅니다. 대기업 현장과 전사 프로젝트 경험을 바탕으로 도입·운영·유지보수까지 함께합니다.',
      businessKeywords: [
        '스마트팩토리',
        'MES',
        '제조 데이터',
        'IoT 게이트웨이',
        '품질·공정 분석',
        '전사 시스템 연동',
        '클라우드·데이터 플랫폼',
        '머신비전·검사',
      ],
      orgChartTitle: '조직도',
      orgLevels: [
        {
          title: '경영',
          description: '전략·대외·경영지원',
          units: ['대표이사', '경영지원 · 사업관리(전략·자원·일정·리스크·커뮤니케이션)'],
        },
        {
          title: '연구·개발',
          description: '제품 개발 및 연구전담',
          units: ['SW1팀', 'SW2팀', 'SW3팀', '연구전담부서', '디자인'],
        },
        {
          title: '지원',
          description: '재무·회계 등',
          units: ['재무회계'],
        },
      ],
      historyTitle: '연혁',
      historyLead: '위즈팩토리는 오늘도 제조 현장과 함께\n제조의 미래를 하나씩 현실로 만들어가고 있어요',
      timeline: [
        {
          id: 'ko-22-05',
          year: 2022,
          month: '5월',
          category: 'establishment',
          headline: '경남 창원 본사 설립 (주식회사 위즈팩토리)',
          detail: '스마트팩토리 솔루션 개발·운영을 위한 법인 설립.',
        },
        {
          id: 'ko-22-07',
          year: 2022,
          month: '7월',
          category: 'contract',
          headline: 'LG에너지솔루션 TOSS 시스템 개발 계약',
        },
        {
          id: 'ko-22-09',
          year: 2022,
          month: '9월',
          category: 'patent',
          headline: '스마트팩토리 플랫폼 공정관리 시스템 특허 출원',
        },
        {
          id: 'ko-22-pp',
          year: 2022,
          month: '연중',
          category: 'partner',
          headline: '시트론·LG CNS(비즈텍) 파트너사 등록',
        },
        {
          id: 'ko-23-01',
          year: 2023,
          month: '1월',
          category: 'cert',
          headline: 'ISO 9001·14001 인증 (소프트웨어 개발·공급)',
        },
        {
          id: 'ko-23-04',
          year: 2023,
          month: '4월',
          category: 'cert',
          headline: '벤처기업 확인',
        },
        {
          id: 'ko-23-06',
          year: 2023,
          month: '6~8월',
          category: 'patent',
          headline: '품질 결산·검사 시스템 관련 특허 등록·출원',
        },
        {
          id: 'ko-23-m',
          year: 2023,
          month: '연중',
          category: 'maintenance',
          headline: 'LG전자·LG이노텍·자화전자 유지보수 계약',
        },
        {
          id: 'ko-24-01',
          year: 2024,
          month: '1월',
          category: 'award',
          headline: '제11회 대한민국 지식경영대상 시스템 SW 부문 대상',
        },
        {
          id: 'ko-24-dev',
          year: 2024,
          month: '1~6월',
          category: 'product',
          headline: 'LG전자 온보딩·PFOS·라벨링 등 다수 개발 과제 수행',
        },
        {
          id: 'ko-24-08',
          year: 2024,
          month: '8월',
          category: 'award',
          headline: '대한민국 굿컴퍼니 스타트업 대상',
        },
        {
          id: 'ko-24-09',
          year: 2024,
          month: '9월',
          category: 'product',
          headline: 'LG전자 GLAS(Global Line Audit System) 구축',
        },
        {
          id: 'ko-24-gl',
          year: 2024,
          month: '연중',
          category: 'global',
          headline: '인도·사우디아라비아·미국·태국 등 해외 사업 확대',
        },
        {
          id: 'ko-25-lg',
          year: 2025,
          month: '연중',
          category: 'product',
          headline: 'LG전자 글로벌 공장 안전점검·모니터링·PFOS 등 시스템 확장 다수 수행',
          detail: '사이클 진공·GLAS 안정화·현장 운영 고도화 등 현장 맞춤 과제 병행.',
        },
        {
          id: 'ko-25-jh',
          year: 2025,
          month: '연중',
          category: 'maintenance',
          headline: '자화전자 유지보수 및 시스템 고도화',
        },
        {
          id: 'ko-25-cert',
          year: 2025,
          month: '연중',
          category: 'cert',
          headline: 'MAIN-BIZ·INNO-BIZ·가족친화기업 인증',
        },
        {
          id: 'ko-25-gl',
          year: 2025,
          month: '연중',
          category: 'global',
          headline: '중국·브라질·폴란드·인도네시아 등 글로벌 거점 확장',
        },
        {
          id: 'ko-26-03',
          year: 2026,
          month: '3월',
          category: 'patent',
          headline: '제조업 협동 시스템 특허 등록 (예정)',
          detail: '사업 계획에 따른 일정이며 변경될 수 있습니다.',
        },
        {
          id: 'ko-26-04',
          year: 2026,
          month: '4월',
          category: 'contract',
          headline: '대한항공 영종도 신규 엔진정비고 S/F 인프라 구축',
          detail: '항공 MRO 현장 인프라·시스템 구축 프로젝트.',
        },
      ],
      locationTitle: '위치 · 거점',
      locations: [
        {
          name: '본사',
          detail: '경상남도 창원시 의창구 창원대로 18번길 46, 경남창원과학기술진흥원 1114호',
        },
      ],
      globalNote:
        '국내 본사를 거점으로 제조 대기업·파트너와 현장 중심 프로젝트를 수행합니다. 해외 현장은 파트너 협업과 원격 지원을 병행합니다.',
      partnersTitle: '주요 고객 · 파트너',
      partnersLead:
        'LG전자·LG CNS·LG이노텍 등 국내 제조·IT 생태계와 장기 협력을 이어가고 있습니다. 상세 프로젝트는 사례 페이지에서 확인할 수 있습니다.',
      partnersCta: '사례 보러 가기',
      partnersHref: '/about/cases',
      certTitle: '인증 · 수상',
      certifications: [
        '벤처기업 확인',
        'ISO 9001 / ISO 14001',
        '환경경영평가 엔트리',
        '대한민국 지식경영대상(시스템 SW) 대상',
        '대한민국 굿컴퍼니 스타트업 대상',
        '경남지방중소벤처기업청장 표창',
      ],
      patentsTitle: '보유 특허 · 지식재산',
      patentsLead:
        '제조 현장 공정·품질·협업 영역에서 지식재산을 확보하며 제품 경쟁력의 기반으로 삼고 있습니다.',
      patents: [
        '스마트팩토리 플랫폼 공정관리 시스템 (등록)',
        '통합(품질) 결산 관리 시스템 (등록)',
        '제조 생산 업무 협업 시스템 (출원 등)',
      ],
      heroImage: `${aboutPptAssetBase}/image8.png`,
      heroImageAlt: 'WIZFACTORY',
    },
    vision: {
      metaTitle: '비전 · 미션 · 핵심 가치',
      eyebrow: 'PHILOSOPHY',
      title: '비전 · 미션 · 핵심 가치',
      pageLead:
        '명확함(Clarity) · 겸손한 UI(Deference) · 콘텐츠 중심의 깊이(Depth). 제조 현장의 소프트웨어에도 같은 원칙을 적용합니다.',
      missionTitle: '미션 — 왜 존재하는가',
      missionBody:
        '산업용 장비·공장·공정 자동화로 생산 효율을 높이고 비용을 절감하며 공정 안정성을 향상합니다. AI·로봇·IoT로 생산 자동화의 난제를 풀고 산업 자동화를 선도합니다.',
      visionTitle: '비전 — 어디로 가는가',
      visionBody:
        '소프트웨어 회사의 경쟁력은 사람입니다. 최고의 인재를 채용하고 기술·전문성·팀워크·인력개발로 최첨단 역량을 갖춘 인재를 양성합니다. 창의적·비전적인 인재로 미래를 열고, 최상의 환경·복지·성장 기회를 제공합니다.',
      valuesTitle: '핵심 가치 — 어떻게 일하는가',
      values: [
        {
          title: '데이터로 말한다',
          body: '현장 데이터 수집·분석을 기본으로 의사결정과 개선의 근거를 제시합니다.',
        },
        {
          title: '고객과 함께 성장',
          body: '불만과 요구를 과제로 전환하고, 장기 파트너십으로 함께 성장합니다.',
        },
        {
          title: '실행력',
          body: '대기업 전사·현장 프로젝트와 특허·인증으로 결과를 증명합니다.',
        },
      ],
      ceoTitle: '대표 메시지',
      ceoBody:
        'LG전자에서 대기업 전사 시스템을 총괄하며 쌓은 20년 경험을 바탕으로, 전략적 비전과 디지털 전환 실행에 힘쓰겠습니다. 현장과 경영을 잇는 솔루션으로 고객의 경쟁력을 돕겠습니다. — 배흥열 대표이사',
      image: `${aboutPptAssetBase}/image18.jpeg`,
      imageAlt: '비전',
    },
    services: {
      metaTitle: '서비스 · 솔루션',
      eyebrow: 'SERVICES',
      title: '서비스 · 솔루션',
      lead:
        '메인 페이지의 솔루션을 기준으로, 위즈팩토리는 생산 실행, 협업 자동화, 품질 데이터, 설비 모니터링, 현장 운영 플랫폼을 하나의 서비스 체계로 제공합니다.',
      categories: [
        {
          key: 'production',
          title: '생산 · 실행',
          desc: 'MES, 작업지시, 공정 추적, 실시간 실행 운영',
          solutionIds: ['wiz-mes', 'wiz-flow'],
        },
        {
          key: 'quality',
          title: '품질 · 데이터',
          desc: '불량, 감사, 점검, KPI를 하나의 데이터 흐름으로',
          solutionIds: ['wiz-fact'],
        },
        {
          key: 'facility',
          title: '설비 · 환경',
          desc: 'ESD/EOS, 진공, 순찰까지 설비 상태의 실시간 가시화',
          solutionIds: ['esd-eos-monitoring', 'vacuum-system', 'patrol-system'],
        },
        {
          key: 'platform',
          title: '플랫폼 · 현장 운영',
          desc: '표준서, 프로젝트, 운영 데이터를 연결하는 현장 플랫폼',
          solutionIds: ['work-instruction', 'wiz-pms'],
        },
        {
          key: 'project',
          title: '프로젝트 · 커스텀',
          desc: '고객 환경에 맞춘 구축, 고도화, 전사 확장',
          solutionIds: [],
        },
      ],
      effectsTitle: '서비스 도입 효과',
      effects: [
        '운영 가시성 — 계획 대비 실적, 라인 상태, 설비 가동을 한 화면에서',
        '워크플로우 전환 — 종이, 승인, 알람, 보고를 디지털 플로우로',
        '품질 신뢰 — 불량, 점검, 증적 데이터를 연결한 추적성',
        '설비 최적화 — 상태, 알람, 에너지 데이터를 바탕으로 빠른 대응',
        '확장성 — 공장, 라인, 조직을 가로지르는 통합 운영',
      ],
    },
    cases: {
      metaTitle: '사례',
      eyebrow: 'CASE STUDIES',
      title: '사례 · 포트폴리오',
      lead: '산업별로 대표 프로젝트를 스토리(문제 → 해결 → 결과)로 정리했습니다.',
      filterAll: '전체',
      filterLabels: {
        manufacturing: '제조 · 대기업',
        'ai-vision': 'AI · 비전',
        platform: '데이터 · 플랫폼',
      },
      detailEyebrow: 'CASE',
    },
    team: {
      metaTitle: '팀 · 문화',
      eyebrow: 'TEAM',
      title: '팀 · 문화',
      lead: '사람보다 일하는 방식과 실행 구조를 먼저 공유합니다.',
      leadershipTitle: '리더십',
      ceoName: '배흥열',
      ceoRole: '대표이사',
      ceoBio:
        'LG전자 전사 시스템 프로젝트 총괄 20년 경력. 전략적 비전과 디지털 전환의 실행을 이끕니다.',
      cultureTitle: '조직 문화',
      cultureBullets: [
        '사업관리팀이 일정·자원·리스크를 조율하고 개발 조직과 밀착합니다.',
        'SW·연구전담·디자인이 한 팀으로 제품을 완성합니다.',
      ],
      waysTitle: '근무 · 협업 방식',
      waysBullets: [
        '현장 중심 커뮤니케이션과 데이터 기반 회의',
        '파트너·고객과의 단계별 마일스톤 합의',
      ],
      welfareTitle: '복지 · 성장',
      welfareBullets: [
        '비전에 맞춘 성장 기회와 역량 강화',
        '채용 시 별도 공고 및 문의 채널 안내',
      ],
      hireNote: '채용 상세는 채용 페이지에서 확인하고, 문의는 연락처로 주세요.',
      image: `${aboutPptAssetBase}/image51.png`,
      imageAlt: '팀',
    },
    process: {
      metaTitle: '프로세스',
      eyebrow: 'PROCESS',
      title: '프로젝트 · 협업 프로세스',
      lead: 'B2B에서 “함께 일하면 어떻게 진행되는지”를 투명하게 안내합니다.',
      phases: [
        { title: '발굴 · 정의', body: '요구·현장 진단, 범위·우선순위·성공 지표 정의' },
        { title: '설계 · 합의', body: '아키텍처·일정·리스크, 마일스톤 및 산출물 합의' },
        { title: '구축 · 연동', body: '개발·연동·테스트, 단계적 오픈' },
        { title: '안정화 · 전환', body: '현장 교육, 모니터링, 이슈 대응' },
        { title: '운영 · 개선', body: '유지보수, 버전·기능 고도화' },
      ],
      collabTitle: '협업 방식',
      collabBullets: [
        '고객 담당자·현장·개발이 주기적으로 동기화',
        '문서·이슈 추적으로 투명한 의사결정',
      ],
      commTitle: '커뮤니케이션',
      commBullets: [
        '주간·마일스톤 리뷰, 긴급 채널 분리',
        '데이터·대시보드로 진행 상황 공유',
      ],
      qaTitle: 'QA · 유지보수',
      qaBullets: [
        '단계별 검수 기준과 테스트 시나리오 합의',
        'SLA에 따른 장애 대응·패치·모니터링',
      ],
      image: `${aboutPptAssetBase}/image45.jpeg`,
      imageAlt: '프로세스',
    },
    insights: {
      metaTitle: '인사이트',
      eyebrow: 'INSIGHTS',
      title: '인사이트 · 블로그 · 소식',
      lead: '기술 블로그, 산업 인사이트, 보도자료 등 검색·전문성 채널을 준비 중입니다.',
      placeholderNote:
        '콘텐츠가 준비되면 이 영역에 기술 아티클과 회사 소식이 게시됩니다. 지금은 주요 토픽만 미리 안내합니다.',
      topics: [
        { title: '스마트팩토리 데이터 파이프라인', desc: '수집·저장·분석·가시화 흐름' },
        { title: '제조 AI·비전 검사', desc: '현장 도입 시 고려사항' },
        { title: 'MES·협업 시스템', desc: '전사 연계와 현장 실행' },
      ],
    },
    careers: {
      metaTitle: '채용',
      eyebrow: 'CAREERS',
      title: '현장을 바꾸는 제품을\n함께 만듭니다',
      lead:
        'MES·품질·설비 데이터를 실행 가능한 소프트웨어로 연결합니다. 스마트팩토리 현장에 바로 쓰이는 제품과 플랫폼을 설계·구축·운영하는 동료를 찾습니다.',
      processTitle: '채용 프로세스',
      processSteps: ['서류 · 포트폴리오 검토', '기술 · 협업 인터뷰', '역할 · 조건 합의', '온보딩 · 현장 이해'],
      cultureTeaser:
        '팀 · 문화 페이지에서 협업 원칙과 일하는 리듬을 먼저 확인해 주세요. 채용은 같은 기준으로 설계되어 있습니다.',
      positionsNote:
        '공개 포지션은 별도 공지 예정입니다. 프론트엔드, 백엔드, 플랫폼, 제조 도메인 SW, 프로젝트·운영 등 관련 경험이 있다면 문의로 이력과 관심 영역을 남겨 주세요.',
      stats: [
        { value: '2022', label: '설립' },
        { value: '50+', label: '특허·지식재산' },
        { value: 'ISO', label: '9001 · 14001' },
        { value: '전국', label: '도입·운영 현장' },
      ],
      evpLine: '종이에서 데이터로, 데이터에서 실행으로 이어지는 제품을 함께 만듭니다.',
      evpBody:
        '홈페이지가 말하는 방향 그대로입니다. 스마트팩토리 운영, 협업 자동화, 실시간 가시성, 현장 중심 의사결정. 채용도 이 문제를 함께 풀 사람을 찾는 관점으로 열려 있습니다.',
      whyTitle: '왜 위즈팩토리인가',
      whyPoints: [
        {
          title: '임팩트가 보이는 B2B 제품',
          body: '대기업 현장·전사 프로그램에서 검증된 도메인 위에서, 실제 가동·품질·설비 데이터를 다룹니다.',
        },
        {
          title: '작은 팀, 넓은 오너십',
          body: '역할이 나뉘어 있어도 고객·현장 맥락까지 이어지게 만드는 End-to-End 사고를 중요하게 봅니다.',
        },
        {
          title: '학습과 개선',
          body: '실시간 데이터와 운영 피드백을 근거로 기능과 프로세스를 반복 개선하는 문화를 지향합니다.',
        },
      ],
      buildEyebrow: 'BUILD',
      buildTitle: '함께 다루는 문제 영역',
      buildLead: '솔루션 구조와 맞춰, 채용 메시지도 실제 제품·플랫폼 영역과 연결했습니다.',
      buildAreas: [
        {
          key: 'factory',
          label: 'WIZ-MES',
          title: '생산 실행 소프트웨어',
          body: 'MES, 작업지시, 공정 추적, 대시보드처럼 제조 현장 운영에 직접 닿는 화면과 로직을 함께 만듭니다.',
        },
        {
          key: 'workflow',
          label: 'WIZ-Flow',
          title: '협업 · 워크플로우 전환',
          body: '종이 기반 업무를 디지털 플로우로 바꾸고, 승인·보고·알람이 끊기지 않도록 제품과 운영 흐름을 설계합니다.',
        },
        {
          key: 'database',
          label: 'Platform',
          title: '실시간 데이터 · 통합 플랫폼',
          body: '설비, 품질, 공정 데이터를 수집하고 API, 리포트, 모니터링으로 연결해 현장과 경영이 같은 지표를 보게 합니다.',
        },
      ],
      tracksTitle: '함께할 역할 트랙',
      tracksLead: '직무명보다 문제 영역을 먼저 맞추고, 세부 포지션은 합류 후 역할에 맞게 정리합니다.',
      tracks: [
        {
          title: '제품 · 엔지니어링',
          body: 'MES·WIZ-Flow 등 화면, API, 도메인 로직, 품질·운영 요구를 제품으로 녹입니다.',
          tags: ['Frontend', 'Backend', 'Manufacturing SW'],
        },
        {
          title: '플랫폼 · 데이터',
          body: '연동, 실시간 수집, 모니터링, 리포트로 현장 데이터를 안정적으로 이어줍니다.',
          tags: ['Integration', 'Data', 'IoT'],
        },
        {
          title: '도입 · 프로젝트',
          body: '고객 협업, 요구 정리, 현장 맞춤, 안정적인 롤아웃과 운영까지 책임집니다.',
          tags: ['PM', 'Delivery', 'CS'],
        },
      ],
      perksTitle: '일하는 방식에 담긴 것들',
      perks: [
        '실제 공장·전사 프로젝트와의 직접 연결',
        '작은 조직에서의 영향력과 책임 범위',
        '도메인·기술 학습을 중시하는 피드백 문화',
        '창원 본사 기반, 현장·고객사와의 협업',
        '명확한 채용 단계와 역할·조건 합의',
      ],
      fitEyebrow: 'CULTURE FIT',
      fitTitle: '이런 방식으로 일하는 분과 잘 맞습니다',
      fitTraits: [
        {
          key: 'users',
          label: 'Floor context',
          title: '현장 맥락을 이해하는 사람',
          body: '문제 정의를 코드나 화면에서만 시작하지 않고, 실제 운영 흐름과 사용자의 제약에서 출발합니다.',
        },
        {
          key: 'message',
          label: 'Collaboration',
          title: '협업을 구조화하는 사람',
          body: '디자인, 개발, PM, 고객 커뮤니케이션 사이를 연결하고, 팀이 같은 방향으로 움직이게 만듭니다.',
        },
        {
          key: 'chart',
          label: 'Improvement',
          title: '측정하고 개선하는 사람',
          body: '실시간 데이터, 사용성, 운영 결과를 보고 판단하며 작은 개선을 반복해 실행력을 키웁니다.',
        },
      ],
      processSubtitle: '서류부터 온보딩까지 한눈에 보이는 흐름입니다.',
      processHeading: '채용까지의 여정',
      openRolesEyebrow: 'OPEN ROLES',
      evpEyebrow: '고용 가치 제안',
    },
    contact: {
      metaTitle: '문의',
      eyebrow: 'CUSTOMER SUPPORT',
      title: '무엇을 도와드릴까요?',
      lead:
        '제품 도입부터 기술 지원까지, 필요한 도움을 받으실 수 있습니다. 문서를 참고하시거나 아래로 직접 문의해 주세요.',
      formCta: '문의 폼 열기',
      rows: [
        { label: '회사명', value: '주식회사 위즈팩토리' },
        { label: '대표이사', value: '배흥열' },
        { label: '전화', value: '055-715-7737' },
        { label: '팩스', value: '055-715-7738' },
        { label: 'E-mail', value: 'wiz_biz@wiz-factory.com' },
        { label: '웹', value: 'www.wiz-factory.com' },
        {
          label: '주소',
          value: '경상남도 창원시 의창구 창원대로 18번길 46, 경남창원과학기술진흥원 1114호',
        },
      ],
      tabTech: '기술지원',
      tabAdopt: '도입문의',
      step01Label: '01 CLIENT*',
      step01Title: '우리와 함께 할 당신을 소개해주세요.',
      step01Note: '※ 기재하신 연락처로 담당자가 연락 또는 이메일을 드립니다.',
      companyLabel: '회사명',
      nameLabel: '담당자명',
      emailLabel: '이메일',
      phoneLabel: '연락처',
      phCompany: '회사명을 입력해 주세요',
      phName: '담당자명',
      phEmail: 'name@company.com',
      phPhone: '010-0000-0000',
      step02Label: '02 PRODUCT (중복선택가능)*',
      step02Title: '지원이 필요한 제품·영역을 선택해 주세요.',
      step02Hint: '복수 선택 가능',
      products: [
        { id: 'mes', label: '스마트팩토리 플랫폼 · MES' },
        { id: 'quality', label: '품질 · 공정 분석' },
        { id: 'facility', label: '설비 · IoT 게이트웨이' },
        { id: 'vision', label: '머신비전 · 검사' },
        { id: 'data', label: '데이터 플랫폼 · 연동' },
        { id: 'other', label: '기타' },
      ],
      step03TechLabel: '03 ISSUE TYPE*',
      step03TechTitle: '이슈 유형을 선택해 주세요.',
      issueTypes: [
        { id: 'login', label: '로그인/인증 문제' },
        { id: 'bug', label: '기능 오류' },
        { id: 'integration', label: '데이터 연동' },
        { id: 'perf', label: '성능 문제' },
        { id: 'other', label: '기타' },
      ],
      step03AdoptLabel: '03 INQUIRY TYPE*',
      step03AdoptTitle: '문의 유형을 선택해 주세요.',
      adoptTopics: [
        { id: 'review', label: '도입 검토' },
        { id: 'quote', label: '견적 · 제안' },
        { id: 'poc', label: 'PoC · 데모' },
        { id: 'partner', label: '유지보수 · 협력' },
        { id: 'other', label: '기타' },
      ],
      step04Label: '04 MESSAGE*',
      step04Title: '문의사항을 자유롭게 작성해 주세요.',
      fileHint: '파일첨부: 스크린샷, 로그 등 최대 2개 · pdf, jpg, png, zip',
      fileButton: '파일첨부 +',
      privacyLabel: '개인정보 수집·이용 동의(필수)',
      privacyDetail:
        '수집항목: 회사명, 성명, 이메일, 연락처, 문의 내용. 목적: 문의 응대 및 상담. 보유: 상담 종료 후 3년 이내 파기(관계법령에 따름). 동의를 거부할 수 있으나, 미동의 시 문의 접수가 제한될 수 있습니다.',
      submit: 'SUBMIT',
      directTitle: 'Direct Contact',
      emailLine: 'wiz_biz@wiz-factory.com',
      phoneLine: '055-715-7737',
      mailCta: '메일로 문의하기',
      phoneCta: '전화로 문의하기',
      successTitle: '문의가 접수되었습니다',
      successBody: '담당자가 영업일 기준 1~2일 이내에 연락드리겠습니다.',
    },
    cta: {
      title: '다음 단계가 필요하신가요?',
      button: '문의하기',
      secondary: '솔루션 보기',
    },
  },
  en: {
    metaTitleSuffix: ' | WIZFACTORY',
    nav: [
      { path: '/about', label: 'Story' },
      { path: '/about/company', label: 'Company' },
      { path: '/about/vision', label: 'Vision · Mission · Values' },
      { path: '/about/services', label: 'Services' },
      { path: '/about/cases', label: 'Case studies' },
      { path: '/about/team', label: 'Team · Culture' },
      { path: '/about/process', label: 'Process' },
      { path: '/about/insights', label: 'Insights' },
      { path: '/about/careers', label: 'Careers' },
      { path: '/about/contact', label: 'Contact' },
    ],
    hub: {
      title: 'Your digital growth partner in manufacturing',
      lead: 'We connect plants with cloud, data, and AI. Use the pages below for depth, proof, and SEO-friendly detail.',
      story:
        'WIZFACTORY builds smart factory solutions—integrating IoT, data, AI, CPS, and cloud across production, quality, assets, and energy. Enterprise programs, patents, and partnerships demonstrate execution. We split detail pages so investors, partners, and customers can go as deep as they need.',
      cards: [
        { path: '/about/company', title: 'Company', desc: 'Tagline, timeline, org, locations, certs & patents' },
        { path: '/about/vision', title: 'Vision · Mission · Values', desc: 'Why we exist, where we go, how we work, CEO note' },
        { path: '/about/services', title: 'Services', desc: 'Categories with links to product pages' },
        { path: '/about/cases', title: 'Case studies', desc: 'Problem → solution → outcome' },
        { path: '/about/team', title: 'Team · Culture', desc: 'Leadership, culture, hiring' },
        { path: '/about/process', title: 'Process', desc: 'Delivery, collaboration, QA & support' },
        { path: '/about/insights', title: 'Insights', desc: 'Blog & news (coming soon)' },
        { path: '/about/careers', title: 'Careers', desc: 'How to apply' },
        { path: '/about/contact', title: 'Contact', desc: 'Phones, email, inquiry' },
      ],
    },
    storyLanding: {
      heroLines: ['We build lasting competitiveness', 'from manufacturing data'],
      heroSub:
        'People who want change come together to build smart factories where the shop floor and management breathe the same data.',
      missionLabel: 'Company Mission',
      missionTitle: 'WIZFACTORY sets the digital standard for manufacturing execution.',
      missionBody:
        'We raise production efficiency through equipment, plant, and process automation—and connect data with AI and IoT. Proven in enterprise plants and corporate programs, we stay with you through operations and growth, not just go-live.',
      pillars: [
        {
          title: 'Speak with data',
          line: 'Decisions grounded in numbers and flow',
          body:
            'From apps that collect and analyze production, quality, and equipment data to platforms and IoT gateways—we surface bottlenecks and give you evidence for change.',
        },
        {
          title: 'Grow with customers',
          line: 'From asks to backlog to product',
          body:
            'Long-term collaboration with LG Electronics, LG CNS, and plant teams—we treat feedback as fuel for the next sprint. Your growth is ours.',
        },
        {
          title: 'Execution',
          line: 'Beyond plans—to steady operations',
          body:
            'Modular delivery—simulation, quality settlement, collaboration—and maintenance that keeps the line running. Patents, certifications, and partner programs back our promise.',
        },
        {
          title: 'People are the edge',
          line: 'Top talent, sharp capability',
          body:
            'Engineering, research, design, and support in one organization. We invest in creative, forward-looking people and the environment they need to grow.',
        },
      ],
      proofEyebrow: 'Proof',
      proofTitle: 'WIZFACTORY in numbers & milestones',
      exploreTitle: 'Go deeper',
      exploreLead: 'Pick the page that matches what you need next.',
    },
    company: {
      metaTitle: 'Company',
      eyebrow: 'COMPANY',
      title: 'Company overview',
      tagline:
        'WIZFACTORY Co., Ltd. — smart factory software and operations. MES, equipment monitoring, process data, and IoT gateways for digital manufacturing.',
      snapshotTitle: 'At a glance',
      snapshotFacts: [
        { label: 'Founded', value: 'May 11, 2022' },
        { label: 'CEO', value: 'Bae Heung-yeol' },
        { label: 'HQ', value: 'Changwon, Gyeongnam' },
        { label: 'Focus', value: 'Smart factory SW & ops' },
        { label: 'IP', value: 'Process, quality, collaboration' },
        { label: 'Partners', value: 'LG CNS tier-1, etc.' },
      ],
      ceoGreetingTitle: 'Message from the CEO',
      ceoGreetingHeadline: 'A partner that bridges\nmanagement and the shop floor.',
      ceoGreetingBody:
        'We focus on connecting manufacturing data and closing the gap between management and the shop floor with software you can run.\n\nDrawing on years leading large enterprise programs at LG Electronics, we put trust with customers and partners first.\n\nSmart factory adoption should build lasting competitiveness—not just install systems—and we commit as a partner who stays accountable.',
      ceoGreetingName: 'Bae Heung-yeol',
      ceoGreetingRole: 'Chief Executive Officer',
      ceoGreetingImage: '/about/ceo-portrait1.png',
      ceoGreetingImageAlt: 'Bae Heung-yeol, CEO of WIZFACTORY Co., Ltd.',
      businessTitle: 'What we do',
      businessLead:
        'We cover applications that collect and analyze production, process, quality, and equipment data—plus platforms, IoT gateways, and industrial devices that connect them. We support adoption, operations, and maintenance with experience from enterprise plant and corporate programs.',
      businessKeywords: [
        'Smart factory',
        'MES',
        'Manufacturing data',
        'IoT gateway',
        'Quality & process analytics',
        'Enterprise integration',
        'Cloud & data platform',
        'Machine vision',
      ],
      orgChartTitle: 'Organization',
      orgLevels: [
        {
          title: 'Executive',
          description: 'Strategy and corporate support',
          units: ['CEO', 'Business management (strategy, resources, schedule, risk, communications)'],
        },
        {
          title: 'R&D',
          description: 'Product and research',
          units: ['SW1', 'SW2', 'SW3', 'Dedicated research', 'Design'],
        },
        {
          title: 'Support',
          description: 'Finance and administration',
          units: ['Finance & accounting'],
        },
      ],
      historyTitle: 'History',
      historyLead: 'WIZFACTORY is still on the shop floor with you—\nbringing the future of manufacturing to life, one step at a time.',
      timeline: [
        {
          id: 'en-22-05',
          year: 2022,
          month: 'May',
          category: 'establishment',
          headline: 'Founded in Changwon, Gyeongnam (WIZFACTORY Co., Ltd.)',
          detail: 'Corporate launch focused on smart factory software and operations.',
        },
        {
          id: 'en-22-07',
          year: 2022,
          month: 'Jul',
          category: 'contract',
          headline: 'LG Energy Solution TOSS system development contract',
        },
        {
          id: 'en-22-09',
          year: 2022,
          month: 'Sep',
          category: 'patent',
          headline: 'Patent application: smart factory platform process management',
        },
        {
          id: 'en-22-pp',
          year: 2022,
          month: 'FY',
          category: 'partner',
          headline: 'Registered partner: Citron, LG CNS (Biztech)',
        },
        {
          id: 'en-23-01',
          year: 2023,
          month: 'Jan',
          category: 'cert',
          headline: 'ISO 9001 & ISO 14001 (software development & supply)',
        },
        {
          id: 'en-23-04',
          year: 2023,
          month: 'Apr',
          category: 'cert',
          headline: 'Venture company certification',
        },
        {
          id: 'en-23-06',
          year: 2023,
          month: 'Jun–Aug',
          category: 'patent',
          headline: 'Patent registrations & filings for quality settlement & inspection systems',
        },
        {
          id: 'en-23-m',
          year: 2023,
          month: 'FY',
          category: 'maintenance',
          headline: 'Maintenance contracts: LG Electronics, LG Innotek, Jahwa Electronics',
        },
        {
          id: 'en-24-01',
          year: 2024,
          month: 'Jan',
          category: 'award',
          headline: '11th Korea Knowledge Management Award — System Software (Grand Prize)',
        },
        {
          id: 'en-24-dev',
          year: 2024,
          month: 'Jan–Jun',
          category: 'product',
          headline: 'LG Electronics: onboarding, PFOS, labeling, and related programs',
        },
        {
          id: 'en-24-08',
          year: 2024,
          month: 'Aug',
          category: 'award',
          headline: 'Korea Good Company — Good Startup Award',
        },
        {
          id: 'en-24-09',
          year: 2024,
          month: 'Sep',
          category: 'product',
          headline: 'LG Electronics GLAS (Global Line Audit System) delivery',
        },
        {
          id: 'en-24-gl',
          year: 2024,
          month: 'FY',
          category: 'global',
          headline: 'International expansion: India, Saudi Arabia, USA, Thailand',
        },
        {
          id: 'en-25-lg',
          year: 2025,
          month: 'FY',
          category: 'product',
          headline: 'LG Electronics: global plant safety, monitoring, PFOS expansion, and more',
          detail: 'Including cycle vacuum, GLAS stabilization, and field operations.',
        },
        {
          id: 'en-25-jh',
          year: 2025,
          month: 'FY',
          category: 'maintenance',
          headline: 'Jahwa Electronics maintenance and system upgrades',
        },
        {
          id: 'en-25-cert',
          year: 2025,
          month: 'FY',
          category: 'cert',
          headline: 'MAIN-BIZ, INNO-BIZ, and family-friendly company certifications',
        },
        {
          id: 'en-25-gl',
          year: 2025,
          month: 'FY',
          category: 'global',
          headline: 'Further expansion: China, Brazil, Poland, Indonesia',
        },
        {
          id: 'en-26-03',
          year: 2026,
          month: 'Mar',
          category: 'patent',
          headline: 'Patent registration: manufacturing collaboration system (planned)',
          detail: 'Schedule subject to change.',
        },
        {
          id: 'en-26-04',
          year: 2026,
          month: 'Apr',
          category: 'contract',
          headline: 'Korean Air Yeongjongdo new engine MRO plant S/F infrastructure',
          detail: 'Aviation MRO infrastructure and systems project.',
        },
      ],
      locationTitle: 'Locations & presence',
      locations: [
        {
          name: 'Headquarters',
          detail: '1114, Changwon Institute of Science & Technology Promotion, 46 Changwon-daero 18beon-gil, Uichang-gu, Changwon, Gyeongnam, Korea',
        },
      ],
      globalNote:
        'We run projects from our Korea HQ with manufacturing enterprises and partners. International sites are supported through partnerships and remote collaboration.',
      partnersTitle: 'Customers & partners',
      partnersLead:
        'We maintain long-term collaboration with Korea’s manufacturing and IT ecosystem—including LG Electronics, LG CNS, and LG Innotek. See case studies for project detail.',
      partnersCta: 'View case studies',
      partnersHref: '/about/cases',
      certTitle: 'Certifications & awards',
      certifications: [
        'Venture company',
        'ISO 9001 / ISO 14001',
        'Environmental management (Entry)',
        'Korea Knowledge Management Award (Software)',
        'Korea Good Company — Good Startup',
        'Gyeongnam SME certificate of recognition',
      ],
      patentsTitle: 'Patents & IP',
      patentsLead:
        'We secure IP in process, quality, and collaboration for manufacturing—foundational to our product edge.',
      patents: [
        'Smart factory platform process management (registered)',
        'Integrated quality settlement (registered)',
        'Manufacturing collaboration system (applications filed)',
      ],
      heroImage: `${aboutPptAssetBase}/image8.png`,
      heroImageAlt: 'WIZFACTORY',
    },
    vision: {
      metaTitle: 'Vision · Mission · Values',
      eyebrow: 'PHILOSOPHY',
      title: 'Vision · Mission · Values',
      pageLead:
        "Clarity, deference, and depth—the human interface principles behind Apple's design language—inform how we build for the shop floor.",
      missionTitle: 'Mission — why we exist',
      missionBody:
        'We automate industrial equipment, plants, and processes to improve productivity, reduce cost, and stabilize operations—using AI, robotics, and IoT to lead industrial automation.',
      visionTitle: 'Vision — where we go',
      visionBody:
        'Our competitiveness is our people. We hire top talent and grow skills, teamwork, and expertise. We nurture creative leaders and provide environment, benefits, and growth.',
      valuesTitle: 'Core values — how we work',
      values: [
        {
          title: 'Evidence-led',
          body: 'We ground decisions in field data collection and analysis.',
        },
        {
          title: 'Grow with customers',
          body: 'We turn feedback into roadmaps and long-term partnerships.',
        },
        {
          title: 'Ship outcomes',
          body: 'Enterprise programs, patents, and certifications prove execution.',
        },
      ],
      ceoTitle: 'From the CEO',
      ceoBody:
        'With two decades leading large-scale programs at LG Electronics, I focus on vision and delivery for digital manufacturing. We connect shop floors and management with solutions that strengthen your competitiveness. — Bae Heung-yeol, CEO',
      image: `${aboutPptAssetBase}/image18.jpeg`,
      imageAlt: 'Vision',
    },
    services: {
      metaTitle: 'Services',
      eyebrow: 'SERVICES',
      title: 'Services & solutions',
      lead:
        'Based on the solutions shown on the main page, WIZFACTORY organizes production execution, workflow automation, quality data, equipment monitoring, and plant operations into one service system.',
      categories: [
        {
          key: 'production',
          title: 'Production & execution',
          desc: 'MES, work instructions, traceability, and real-time execution',
          solutionIds: ['wiz-mes', 'wiz-flow'],
        },
        {
          key: 'quality',
          title: 'Quality & analytics',
          desc: 'Defects, audits, inspections, and KPIs in one data flow',
          solutionIds: ['wiz-fact'],
        },
        {
          key: 'facility',
          title: 'Equipment & environment',
          desc: 'Real-time visibility from ESD/EOS to vacuum and patrol systems',
          solutionIds: ['esd-eos-monitoring', 'vacuum-system', 'patrol-system'],
        },
        {
          key: 'platform',
          title: 'Platform & operations',
          desc: 'Plant platforms connecting standards, projects, and operations data',
          solutionIds: ['work-instruction', 'wiz-pms'],
        },
        {
          key: 'project',
          title: 'Projects & custom',
          desc: 'Tailored builds, modernization, and enterprise expansion',
          solutionIds: [],
        },
      ],
      effectsTitle: 'Service outcomes',
      effects: [
        'Operational visibility — plan vs. actual, line status, and uptime in one view',
        'Workflow transformation — paper, approvals, alerts, and reporting into one digital flow',
        'Quality confidence — connected traceability across defects, inspections, and evidence',
        'Equipment optimization — faster response through status, alerts, and energy data',
        'Scalability — integrated operations across plants, lines, and teams',
      ],
    },
    cases: {
      metaTitle: 'Case studies',
      eyebrow: 'CASE STUDIES',
      title: 'Case studies & portfolio',
      lead: 'Story-led cases: problem, solution, and outcome by industry.',
      filterAll: 'All',
      filterLabels: {
        manufacturing: 'Manufacturing',
        'ai-vision': 'AI & vision',
        platform: 'Data & platform',
      },
      detailEyebrow: 'CASE',
    },
    team: {
      metaTitle: 'Team & culture',
      eyebrow: 'TEAM',
      title: 'Team & culture',
      lead: 'We emphasize how we work before individual bios.',
      leadershipTitle: 'Leadership',
      ceoName: 'Bae Heung-yeol',
      ceoRole: 'CEO',
      ceoBio:
        'Two decades leading enterprise programs at LG Electronics—strategy and digital transformation execution.',
      cultureTitle: 'Culture',
      cultureBullets: [
        'Business management aligns schedule, resources, and risk with engineering.',
        'SW, research, and design ship as one product team.',
      ],
      waysTitle: 'How we work',
      waysBullets: [
        'Field-first communication and data-driven reviews',
        'Milestone alignment with partners and customers',
      ],
      welfareTitle: 'Growth & benefits',
      welfareBullets: [
        'Development aligned with our vision and values',
        'Open roles announced on the site; inquiries welcome',
      ],
      hireNote: 'See Careers for process; contact us for expressions of interest.',
      image: `${aboutPptAssetBase}/image51.png`,
      imageAlt: 'Team',
    },
    process: {
      metaTitle: 'Process',
      eyebrow: 'PROCESS',
      title: 'Delivery & collaboration',
      lead: 'Clear stages for B2B buyers: how we work together.',
      phases: [
        { title: 'Discover & define', body: 'Requirements, diagnostics, scope, KPIs' },
        { title: 'Design & align', body: 'Architecture, schedule, risk, milestones' },
        { title: 'Build & integrate', body: 'Development, integration, phased rollout' },
        { title: 'Stabilize & handover', body: 'Training, monitoring, issue response' },
        { title: 'Operate & improve', body: 'Support, patches, enhancements' },
      ],
      collabTitle: 'Collaboration',
      collabBullets: [
        'Regular sync among customer, field, and engineering',
        'Transparent decisions via docs and issue tracking',
      ],
      commTitle: 'Communication',
      commBullets: [
        'Weekly and milestone reviews; separate urgent channel',
        'Dashboards for shared progress',
      ],
      qaTitle: 'QA & maintenance',
      qaBullets: [
        'Agreed test scenarios per phase',
        'SLA-based incident handling and monitoring',
      ],
      image: `${aboutPptAssetBase}/image45.jpeg`,
      imageAlt: 'Process',
    },
    insights: {
      metaTitle: 'Insights',
      eyebrow: 'INSIGHTS',
      title: 'Insights · Blog · News',
      lead: 'Technical articles and news—for SEO and credibility (in preparation).',
      placeholderNote:
        'Articles and press will appear here. Below are planned themes.',
      topics: [
        { title: 'Smart factory data pipelines', desc: 'Ingest, store, analyze, visualize' },
        { title: 'AI & vision in plants', desc: 'Deployment considerations' },
        { title: 'MES & collaboration', desc: 'Enterprise integration and execution' },
      ],
    },
    careers: {
      metaTitle: 'Careers',
      eyebrow: 'CAREERS',
      title: 'Build products that\nchange the floor',
      lead:
        'We connect MES, quality, and equipment data into software teams can run. We’re hiring people who design, ship, and operate products and platforms for the smart factory floor.',
      processTitle: 'Hiring process',
      processSteps: ['Resume & portfolio review', 'Technical & collaboration interviews', 'Role & offer alignment', 'Onboarding & floor context'],
      cultureTeaser:
        'Read Team & culture first for how we collaborate. Hiring is designed around the same principles.',
      positionsNote:
        'Open roles will be announced separately. If your experience spans frontend, backend, platform, manufacturing software, or project operations, reach out via Contact with your background and interests.',
      stats: [
        { value: '2022', label: 'Founded' },
        { value: '50+', label: 'Patents & IP' },
        { value: 'ISO', label: '9001 · 14001' },
        { value: 'Nationwide', label: 'Rollout & ops' },
      ],
      evpLine: 'We build products that move work from paper to data—and from data to execution.',
      evpBody:
        'Same story as the rest of the site: smart factory operations, workflow automation, real-time visibility, floor-first decisions. Hiring looks for people who want to solve those problems with us.',
      whyTitle: 'Why WIZFACTORY',
      whyPoints: [
        {
          title: 'B2B product impact',
          body: 'Enterprise plant and corporate programs give you real production, quality, and equipment data to work with.',
        },
        {
          title: 'Small team, broad ownership',
          body: 'Roles are defined, but we value end-to-end thinking from customer context to the shop floor.',
        },
        {
          title: 'Learn and improve',
          body: 'We iterate on product and process using live data and operational feedback.',
        },
      ],
      buildEyebrow: 'BUILD',
      buildTitle: 'Problem spaces you’ll touch',
      buildLead: 'Aligned with our solution map—hiring maps to real product and platform areas.',
      buildAreas: [
        {
          key: 'factory',
          label: 'WIZ-MES',
          title: 'Production execution software',
          body: 'Interfaces and logic for MES, work instructions, traceability, and dashboards that run the line.',
        },
        {
          key: 'workflow',
          label: 'WIZ-Flow',
          title: 'Collaboration & workflow',
          body: 'Digital flows for paper-based work—approvals, reporting, and alerts connected end to end.',
        },
        {
          key: 'database',
          label: 'Platform',
          title: 'Real-time data & integration',
          body: 'Equipment, quality, and process data through APIs, reporting, and monitoring—one set of metrics for floor and management.',
        },
      ],
      tracksTitle: 'Role tracks',
      tracksLead: 'We align on problem areas first; titles flex to match the role after you join.',
      tracks: [
        {
          title: 'Product & engineering',
          body: 'MES, WIZ-Flow—UI, APIs, and domain logic that reflect quality and operations reality.',
          tags: ['Frontend', 'Backend', 'Manufacturing SW'],
        },
        {
          title: 'Platform & data',
          body: 'Integration, streaming, monitoring, and reporting so plant data stays reliable.',
          tags: ['Integration', 'Data', 'IoT'],
        },
        {
          title: 'Delivery & projects',
          body: 'Customer collaboration, requirements, tailoring, rollout, and steady operations.',
          tags: ['PM', 'Delivery', 'CS'],
        },
      ],
      perksTitle: 'How we work',
      perks: [
        'Direct line to real plants and enterprise programs',
        'High leverage in a small team',
        'Culture that values domain and technical learning',
        'Changwon HQ with customer and floor collaboration',
        'Clear stages and transparent role alignment',
      ],
      fitEyebrow: 'CULTURE FIT',
      fitTitle: 'People who tend to thrive here',
      fitTraits: [
        {
          key: 'users',
          label: 'Floor context',
          title: 'You learn the floor context',
          body: 'You don’t start from code or UI alone—you start from real workflows, operators, and constraints.',
        },
        {
          key: 'message',
          label: 'Collaboration',
          title: 'You structure collaboration',
          body: 'You connect design, engineering, PM, and customers so the team moves in one direction.',
        },
        {
          key: 'chart',
          label: 'Improvement',
          title: 'You measure and improve',
          body: 'You use live data, usability, and outcomes to compound small improvements.',
        },
      ],
      processSubtitle: 'From application to onboarding—one clear path.',
      processHeading: 'Your hiring journey',
      openRolesEyebrow: 'OPEN ROLES',
      evpEyebrow: 'EMPLOYER VALUE',
    },
    contact: {
      metaTitle: 'Contact',
      eyebrow: 'CUSTOMER SUPPORT',
      title: 'How can we help?',
      lead:
        'From product adoption to technical support—find answers in our docs or reach out directly below.',
      formCta: 'Open inquiry form',
      rows: [
        { label: 'Company', value: 'WIZFACTORY Co., Ltd.' },
        { label: 'CEO', value: 'Bae Heung-yeol' },
        { label: 'Phone', value: '+82-55-715-7737' },
        { label: 'Fax', value: '+82-55-715-7738' },
        { label: 'E-mail', value: 'wiz_biz@wiz-factory.com' },
        { label: 'Web', value: 'www.wiz-factory.com' },
        {
          label: 'Address',
          value:
            '1114, Changwon Institute of Science & Technology Promotion, 46 Changwon-daero 18beon-gil, Uichang-gu, Changwon, Gyeongnam, Korea',
        },
      ],
      tabTech: 'Technical support',
      tabAdopt: 'Adoption inquiry',
      step01Label: '01 CLIENT*',
      step01Title: 'Tell us who you are.',
      step01Note: 'We will reach you at the contact you provide.',
      companyLabel: 'Company',
      nameLabel: 'Contact name',
      emailLabel: 'Email',
      phoneLabel: 'Phone',
      phCompany: 'Company name',
      phName: 'Full name',
      phEmail: 'name@company.com',
      phPhone: '+82-10-0000-0000',
      step02Label: '02 PRODUCT (multi-select)*',
      step02Title: 'Which areas need support?',
      step02Hint: 'Select all that apply',
      products: [
        { id: 'mes', label: 'Smart factory platform · MES' },
        { id: 'quality', label: 'Quality & process analytics' },
        { id: 'facility', label: 'Equipment · IoT gateway' },
        { id: 'vision', label: 'Machine vision · inspection' },
        { id: 'data', label: 'Data platform · integration' },
        { id: 'other', label: 'Other' },
      ],
      step03TechLabel: '03 ISSUE TYPE*',
      step03TechTitle: 'What type of issue is it?',
      issueTypes: [
        { id: 'login', label: 'Login / authentication' },
        { id: 'bug', label: 'Functional defect' },
        { id: 'integration', label: 'Data integration' },
        { id: 'perf', label: 'Performance' },
        { id: 'other', label: 'Other' },
      ],
      step03AdoptLabel: '03 INQUIRY TYPE*',
      step03AdoptTitle: 'What would you like to discuss?',
      adoptTopics: [
        { id: 'review', label: 'Adoption review' },
        { id: 'quote', label: 'Quote / proposal' },
        { id: 'poc', label: 'PoC · demo' },
        { id: 'partner', label: 'Maintenance · partnership' },
        { id: 'other', label: 'Other' },
      ],
      step04Label: '04 MESSAGE*',
      step04Title: 'Describe your request.',
      fileHint: 'Attachments: up to 2 files (screenshots, logs) · pdf, jpg, png, zip',
      fileButton: 'Add files +',
      privacyLabel: 'Consent to personal data processing (required)',
      privacyDetail:
        'We collect company, name, email, phone, and message to respond to your inquiry. Data is retained up to 3 years after closure as required by law. You may refuse, but we may not be able to process the request.',
      submit: 'SUBMIT',
      directTitle: 'Direct Contact',
      emailLine: 'wiz_biz@wiz-factory.com',
      phoneLine: '+82-55-715-7737',
      mailCta: 'Email us',
      phoneCta: 'Call us',
      successTitle: 'Thank you',
      successBody: 'Our team will respond within 1–2 business days.',
    },
    cta: {
      title: 'Ready for the next step?',
      button: 'Contact us',
      secondary: 'View solutions',
    },
  },
};

export function getAboutSections(lang: AboutPageLang): AboutSectionsBundle {
  return aboutSections[lang];
}
