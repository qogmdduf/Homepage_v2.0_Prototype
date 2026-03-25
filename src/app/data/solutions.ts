/** WIZ-Flow 모달 — BEFORE vs AFTER 대시보드 토글 KPI 카드 */
export interface WizFlowKpiCard {
  badgePct: string;
  category: string;
  categoryEn: string;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  asIs: string;
  asIsEn: string;
  processStep: string;
  processStepEn: string;
  toBe: string;
  toBeEn: string;
  resultLine: string;
  resultLineEn: string;
  /** 0–100 */
  progress: number;
  /** 대시보드 토글 뷰 */
  dashLabel: string;
  dashLabelEn: string;
  dashBeforeValue: string;
  dashBeforeValueEn: string;
  dashBeforeCaption: string;
  dashBeforeCaptionEn: string;
  dashAfterValue: string;
  dashAfterValueEn: string;
  dashAfterCaption: string;
  dashAfterCaptionEn: string;
  /** AFTER 모드에서 프로그레스 바 표시 여부 */
  dashShowBar?: boolean;
}

/** WIZ-Flow 등 — 모달 전용 활용 사례 스토리(제목·본문·성과 한 줄) */
export interface SolutionUseCaseStory {
  title: string;
  titleEn: string;
  /** 줄바꿈은 `\n` */
  narrative: string;
  narrativeEn: string;
  /** 성과 한 줄 (` + ` 구분 시 2단 타이포). `↓` `↑` `◯` 는 UI에서 그려지는 심볼로 치환 */
  outcome: string;
  outcomeEn: string;
}

export interface Solution {
  id: string;
  name: string;
  nameKo: string;
  nameEn: string;
  subtitle: string;
  subtitleEn: string;
  description: string;
  descriptionEn: string;
  category: 'platform' | 'production' | 'quality' | 'facility' | 'project';
  client: 'lg' | 'wizfactory';
  features: string[];
  featuresEn: string[];
  industry: string;
  industryEn: string;
  isDemoAvailable: boolean;
  demoUrl?: string;
  /** `public` 기준 경로 — 있으면 솔루션 카드에서 소개서 PDF 다운로드 */
  brochurePdf?: string;
  detailedDescription: string;
  detailedDescriptionEn: string;
  useCases: string[];
  useCasesEn: string[];
  /** 있으면 WIZ-Flow 모달에서 전용 스토리 레이아웃으로 표시 */
  useCaseStories?: SolutionUseCaseStory[];
  techStack: string[];
  metrics?: { label: string; labelEn: string; value: string; suffix: string }[];
  /** WIZ-Flow — 핵심 지표 전용 비교 카드(있으면 모달에서 우선 사용) */
  wizFlowKpiCards?: WizFlowKpiCard[];
  /** WIZ-Flow 등 — tagline·bullets 있으면 모달에서 결과 중심 카드 레이아웃 사용 */
  modules?: {
    name: string;
    desc: string;
    descEn: string;
    icon: string;
    tagline?: string;
    taglineEn?: string;
    bullets?: string[];
    bulletsEn?: string[];
    effectTags?: string[];
    effectTagsEn?: string[];
    metricLine?: string;
    metricLineEn?: string;
    /** 하단 지표 우측 트렌드 아이콘(감소·절감 등 ↓ / 향상·단축(개선) 등 ↑) */
    metricLineTrend?: 'down' | 'up';
    point?: string;
    pointEn?: string;
    /** 핵심 기능 각 줄에 대응하는 Lucide 아이콘 키(bullets/bulletsEn 순서와 동일) */
    bulletIconIds?: string[];
  }[];
  highlights?: string[];
  highlightsEn?: string[];
}

export const solutions: Solution[] = [
  {
    id: 'wiz-mes',
    name: 'WIZ-MES',
    nameKo: 'WIZ-MES',
    nameEn: 'WIZ-MES',
    subtitle: 'Manufacturing Execution System',
    subtitleEn: 'Manufacturing Execution System',
    description: '생산 실행 관리 시스템으로 생산 현장의 모든 데이터를 실시간으로 수집하고 관리합니다.',
    descriptionEn: 'Real-time production data collection and management system for manufacturing operations.',
    category: 'production',
    client: 'wizfactory',
    features: [
      '생산 실적 관리',
      '설비 데이터 수집',
      '공정 추적 관리',
      '실시간 모니터링'
    ],
    featuresEn: [
      'Production Performance Management',
      'Equipment Data Collection',
      'Process Traceability',
      'Real-time Monitoring'
    ],
    industry: 'Electronics / Manufacturing',
    industryEn: 'Electronics / Manufacturing',
    isDemoAvailable: true,
    detailedDescription: 'WIZ-MES는 제조 현장의 생산성 향상과 품질 개선을 위한 통합 생산 관리 시스템입니다. 실시간 데이터 수집 및 분석을 통해 생산 프로세스를 최적화하고, 불량률을 감소시킵니다.',
    detailedDescriptionEn: 'WIZ-MES is an integrated manufacturing management system designed to improve productivity and quality. It optimizes production processes and reduces defect rates through real-time data collection and analysis.',
    useCases: [
      '전자제품 조립 라인의 생산 현황 실시간 모니터링',
      '설비 가동률 분석 및 예방 정비 스케줄링',
      '작업 지시서 자동 생성 및 배포'
    ],
    useCasesEn: [
      'Real-time monitoring of electronics assembly line production',
      'Equipment utilization analysis and preventive maintenance scheduling',
      'Automated work order generation and distribution'
    ],
    metrics: [
      { label: '데이터 수집률', labelEn: 'Data Capture', value: '98', suffix: '%' },
      { label: '공정 추적 정확도', labelEn: 'Trace Accuracy', value: '99', suffix: '%' },
      { label: '계획 대비 편차', labelEn: 'Schedule Variance', value: '12', suffix: '%↓' },
      { label: '알람 대응 시간', labelEn: 'Alarm Response', value: '35', suffix: '%↓' },
    ],
    highlights: [
      '실시간 생산 데이터로 의사결정 속도 향상',
      '설비·공정 이력을 한 곳에서 추적',
      '전 라인 생산 지표를 단일 화면에 통합',
      'MES·ERP 연동으로 이중 입력 최소화',
    ],
    highlightsEn: [
      'Faster decisions with live production data',
      'Trace equipment and process history in one place',
      'Unify line KPIs on a single view',
      'Fewer double entries via MES & ERP integration',
    ],
    modules: [
      { name: '생산 실적 관리', desc: '라인·작업지시별 실적을 실시간 집계하고 리포트까지 연결합니다.', descEn: 'Aggregate results by line and work order in real time through to reports.', icon: '📊' },
      { name: '설비 데이터 수집', desc: 'PLC·SCADA 등에서 설비 상태를 자동 수집·이상 징후를 조기에 포착합니다.', descEn: 'Auto-capture equipment state from PLC/SCADA and catch anomalies early.', icon: '⚙️' },
      { name: '공정 추적 관리', desc: '로트·시리얼 단위로 공정 이력을 추적해 품질·규제 대응을 지원합니다.', descEn: 'Lot/serial-level process history for quality and compliance.', icon: '🔍' },
      { name: '실시간 모니터링', desc: '대시보드로 가동·불량·계획 대비 편차를 한눈에 확인합니다.', descEn: 'Dashboards for utilization, defects, and plan variance at a glance.', icon: '📈' },
    ],
    techStack: ['React', 'Node.js', 'PostgreSQL', 'Redis']
  },
  {
    id: 'wiz-flow',
    name: 'WIZ-Flow',
    nameKo: 'WIZ-Flow',
    nameEn: 'WIZ-Flow',
    subtitle: '제조 생산 업무 협업 시스템',
    subtitleEn: 'Manufacturing Production Collaboration System',
    description: 'LG전자 생산현장의 종이 기반 업무를 100% 디지털로 전환하는 스마트 공장 운영 플랫폼입니다.',
    descriptionEn: 'A smart factory operating platform that converts all paper-based operations at LG Electronics production sites to 100% digital.',
    category: 'project',
    client: 'lg',
    isDemoAvailable: true,
    demoUrl: 'https://wiz-factory.net/project/lg-pfos/auth/signin/?demo=pfos',
    brochurePdf: '/brochures/wiz-flow-intro-16x9.pdf',
    industry: 'Electronics / Manufacturing',
    industryEn: 'Electronics / Manufacturing',
    detailedDescription: 'LG전자 생산현장의 종이 문서를 완전 디지털화하여 실시간 작업지시·공정 추적·통합 모니터링으로 스마트팩토리 운영 효율을 극대화하는 핵심 솔루션입니다.',
    detailedDescriptionEn: 'A smart factory solution that fully digitizes paper-based shop-floor documents at LG Electronics — enabling real-time work instructions, complete process traceability, and unified production monitoring.',
    features: [
      '종이 작업지시 제로||인쇄·분실 없는 완전 디지털화',
      '공정 실시간 가시성||라인별 작업 현황 즉시 확인',
      '태블릿·PDA 현장 UI||라인에서 바로 입력·확인',
      '불량·4M 즉시 연동||보고부터 변경 이력까지 추적',
      'SOP 준수율 향상||표준 작업 준수 및 품질 일관성 확보',
      '설비 데이터 자동 수집||PLC·SCADA 연동 연속 수집',
      '실적·리포트 자동 집계||KPI 산출 시간 단축',
      '멀티라인 통합 관제||단일 대시보드 전 라인 가시화',
    ],
    featuresEn: [
      'Zero paper work orders||Full digitization—no print or loss',
      'Real-time process visibility||Line work status at a glance',
      'Tablet & PDA shop UI||Enter and confirm on the line',
      'Defects & 4M in one flow||From report to change history',
      'Higher SOP adherence||Consistent quality & standard work',
      'Auto equipment data||PLC & SCADA integrated capture',
      'Auto results & reports||Faster KPI preparation',
      'Multi-line command view||One dashboard, every line',
    ],
    useCases: [
      '생산라인 페이퍼리스 전환 사례',
      '공정 이상 대응 자동화 사례',
      'SOP 개정·준수 사례',
      '불량 데이터 기반 품질 개선 사례',
      '글로벌 생산 통합 모니터링 사례',
    ],
    useCasesEn: [
      'Paperless production line adoption',
      'Automated anomaly response on the shop floor',
      'SOP revision & compliance',
      'Quality improvement driven by defect data',
      'Global integrated production monitoring',
    ],
    useCaseStories: [
      {
        title: '생산라인 페이퍼리스 전환 사례',
        titleEn: 'Production line — paperless adoption',
        narrative:
          '기준은 종이가 아니라, "현장에서 실행"돼요\n작업 기준이 종이가 아니라, 현장에서 바로 실행돼요. 디지털 작업지도로 전환하면 종이는 자연스럽게 줄어들고, 전 라인이 동시에 최신 기준으로 맞춰 작업을 시작해요.',
        narrativeEn:
          'The standard isn\'t paper—it "runs on the floor" in practice.\nWork standards run on the floor, not on paper. Moving to digital work guides trims paper naturally, and every line starts together—aligned to the latest standard at once.',
        outcome: '연간 용지 95% 절감 ↓ + 작업 데이터 실시간 확보',
        outcomeEn: '95% less paper per year ↓ + real-time work data capture',
      },
      {
        title: '공정 이상 대응 자동화 사례',
        titleEn: 'Automated response to process anomalies',
        narrative:
          '신호가 뜨면, "고민할 필요" 없습니다.\n신호가 뜨는 순간 알림이 전달되고, 담당자도 자동으로 배정돼서 조치하고 기록하는 흐름까지 자연스럽게 이어져요.',
        narrativeEn:
          'When a signal fires, "no need to second-guess".\nThe instant it appears, alerts go out—assignees are auto-assigned, and acting plus logging flow together naturally.',
        outcome: '현장 대응 시간 40% 단축 ↓ + 누락 없는 이력 관리 구현',
        outcomeEn: '40% faster floor response + complete, gap-free history',
      },
      {
        title: 'SOP 개정·준수 사례',
        titleEn: 'SOP revision & compliance',
        narrative:
          '바뀌는 순간, "전부 동일"해져요\n바뀌면 바로 다 같이 바뀌고, 옛날 기준은 아예 못 쓰게 막고, 어느 라인이든 같은 방식으로 작업하고 표준은 자연스럽게 지켜져요.',
        narrativeEn:
          'The moment it changes, "all the same" from that instant.\nWhen it updates, every line moves together—old standards are blocked, every line works the same way, and compliance happens naturally.',
        outcome: '표준 작업 준수율 98% 유지 ◯ + 버전 충돌 없이',
        outcomeEn: '98% standard-work adherence ◯ + zero version conflicts',
      },
      {
        title: '불량 데이터 기반 품질 개선 사례',
        titleEn: 'Quality improvement from defect data',
        narrative:
          '라인별 불량 데이터를 실시간 수집·분석하여\n품질 개선 과제의 우선순위를 자동 도출하고 대응하여',
        narrativeEn:
          'Collecting and analyzing line-level defect data in real time\nto auto-prioritize quality actions—and act on them.',
        outcome: '불량률 감소 ↓ + 개선 리드타임 단축',
        outcomeEn: 'Lower defect rates ↓ + shorter improvement lead time',
      },
      {
        title: '글로벌 생산 통합 모니터링 사례',
        titleEn: 'Global integrated production monitoring',
        narrative:
          '다수 사업장과 라인의 생산 데이터를 통합 대시보드로 연결하여\n본사에서 단일 화면으로 전체 생산 현황을 실시간 확인하고',
        narrativeEn:
          'Unifying multi-site, multi-line data in one dashboard\nso HQ sees the full production picture on a single screen—in real time.',
        outcome: '의사결정 속도 향상 ↑ + 운영 가시성 확보',
        outcomeEn: 'Faster decisions ↑ + full operational visibility',
      },
    ],
    metrics: [
      { label: '용지 절감율', labelEn: 'Paper Reduction', value: '95', suffix: '%' },
      { label: '작업 효율 향상', labelEn: 'Work Efficiency', value: '32', suffix: '%↑' },
      { label: '데이터 수집 시간 단축', labelEn: 'Data Collection Time', value: '70', suffix: '%↓' },
      { label: '불량 대응 시간 단축', labelEn: 'Defect Response Time', value: '50', suffix: '%↓' },
    ],
    wizFlowKpiCards: [
      {
        badgePct: '95%',
        category: 'PAPERLESS',
        categoryEn: 'PAPERLESS',
        title: '용지 절감율',
        titleEn: 'Paper Reduction Rate',
        description: '종이 작업지시·전표에 의존하던 현장을\n디지털 작업 흐름으로 전환합니다.',
        descriptionEn: 'Move from paper work orders & forms\nto a digital shop-floor workflow.',
        asIs: '인쇄·배포·회수·보관 반복으로\n표준 반영 지연 & 용지 비용 누적',
        asIsEn: 'Print → distribute → collect → file\nSlow rollout & rising paper cost',
        processStep: '디지털 작업지시 시스템 도입\n전자 문서 자동 배포·서명·이력 관리',
        processStepEn: 'Deploy digital work order system\nAuto-distribute, e-sign & track history',
        toBe: '즉시 배포·현장 확인·버전 관리\n용지 비용 제로에 수렴',
        toBeEn: 'Instant publish, floor confirm, version control\nPaper cost converges to zero',
        resultLine: '용지 사용 95% 절감',
        resultLineEn: '95% reduction in paper use',
        progress: 95,
        dashLabel: '용지 사용량',
        dashLabelEn: 'Paper Usage',
        dashBeforeValue: '100%',
        dashBeforeValueEn: '100%',
        dashBeforeCaption: '기준치 대비',
        dashBeforeCaptionEn: 'vs. Baseline',
        dashAfterValue: '5%',
        dashAfterValueEn: '5%',
        dashAfterCaption: '95% 절감 달성',
        dashAfterCaptionEn: '95% reduction achieved',
      },
      {
        badgePct: '32%',
        category: 'PRODUCTIVITY',
        categoryEn: 'PRODUCTIVITY',
        title: '작업 효율 향상',
        titleEn: 'Work Efficiency Gain',
        description: '현장 입력·승인·실적 집계를\n한 화면 흐름으로 줄입니다.',
        descriptionEn: 'Unify floor entry, approvals & result roll-up\nin one streamlined flow.',
        asIs: '여러 채널 분산 입력·승인\n대기·재작업 반복 발생',
        asIsEn: 'Split channels for entry & approvals\nWaits & rework cycles',
        processStep: '통합 화면 워크플로 자동화\n입력→승인→집계 원스텝 처리',
        processStepEn: 'Unified screen workflow automation\nEntry → approval → rollup in one step',
        toBe: '표준 화면·자동 집계로 동선 최소화\n처리 시간 대폭 단축',
        toBeEn: 'Standard screens & auto roll-up\nMinimize travel, cut cycle time',
        resultLine: '현장 행정·집계 업무 효율 32% 향상',
        resultLineEn: '32% gain in admin & aggregation efficiency',
        progress: 32,
        dashLabel: '현장 행정 효율',
        dashLabelEn: 'Admin Efficiency',
        dashBeforeValue: '기준',
        dashBeforeValueEn: 'Baseline',
        dashBeforeCaption: '개선 전 기준점',
        dashBeforeCaptionEn: 'Pre-improvement baseline',
        dashAfterValue: '+32%',
        dashAfterValueEn: '+32%',
        dashAfterCaption: '행정 업무 향상',
        dashAfterCaptionEn: 'Admin task efficiency gain',
        dashShowBar: true,
      },
      {
        badgePct: '70%',
        category: 'REAL-TIME DATA',
        categoryEn: 'REAL-TIME DATA',
        title: '데이터 수집 시간 단축',
        titleEn: 'Data Collection Time Reduction',
        description: '수기·이중 입력을 줄이고\n설비·현장 데이터를 바로 반영합니다.',
        descriptionEn: 'Cut manual & double entry—reflect equipment\nand floor data immediately.',
        asIs: '엑셀·전표 이중 입력\n반영 지연 & 오류 검증 시간 소요',
        asIsEn: 'Spreadsheets & double entry\nDelayed reflection & error checks',
        processStep: 'PLC·MES 실시간 데이터 연동\n현장 입력 즉시 수집·자동 검증',
        processStepEn: 'PLC / MES real-time data integration\nInstant floor capture & auto-validation',
        toBe: '실시간 수집·검증 완료\n데이터 신뢰도 및 속도 동시 확보',
        toBeEn: 'Real-time collection & validation\nData reliability + speed secured',
        resultLine: '데이터 수집 시간 70% 단축',
        resultLineEn: '70% shorter data collection time',
        progress: 70,
        dashLabel: '데이터 수집 시간',
        dashLabelEn: 'Data Collection Time',
        dashBeforeValue: '100%',
        dashBeforeValueEn: '100%',
        dashBeforeCaption: '수기 입력 기준',
        dashBeforeCaptionEn: 'Manual entry baseline',
        dashAfterValue: '30%',
        dashAfterValueEn: '30%',
        dashAfterCaption: '70% 단축',
        dashAfterCaptionEn: '70% reduction',
      },
      {
        badgePct: '50%',
        category: 'FAST RESPONSE',
        categoryEn: 'FAST RESPONSE',
        title: '불량 대응 시간 단축',
        titleEn: 'Defect Response Time Reduction',
        description: '발생부터 조치·이력까지\n끊기지 않는 워크플로로 연결합니다.',
        descriptionEn: 'Connect detection to action & history\nwithout hand-offs falling through.',
        asIs: '전화·메신저 의존\n담당자 확인·조치 기록 지연',
        asIsEn: 'Phone & chat hand-offs\nSlow owner acknowledgment & logging',
        processStep: '알림·배정·조치 자동 워크플로\n발생→담당→조치→이력 원스텝 연결',
        processStepEn: 'Alert → assign → action automation\nOne-step detect-to-history workflow',
        toBe: '실시간 알림·자동 배정·즉시 조치\n대응 이력 자동 축적',
        toBeEn: 'Real-time alerts, auto-assign, instant action\nResponse history auto-accumulated',
        resultLine: '불량 대응 시간 50% 단축',
        resultLineEn: '50% faster defect response time',
        progress: 50,
        dashLabel: '불량 대응 시간',
        dashLabelEn: 'Defect Response Time',
        dashBeforeValue: '기준',
        dashBeforeValueEn: 'Baseline',
        dashBeforeCaption: '전화·메신저 의존',
        dashBeforeCaptionEn: 'Phone & messenger dependent',
        dashAfterValue: '50%',
        dashAfterValueEn: '50%',
        dashAfterCaption: '워크플로 자동화',
        dashAfterCaptionEn: 'Workflow automation',
      },
    ],
    modules: [
      {
        name: '실적•공정 데이터 수집',
        desc: '디지털 작업지시서 생성·배포·확인·서명',
        descEn: 'Digital work order creation, distribution, confirmation & sign-off',
        icon: '📋',
        tagline: '현장 작업 표준화 및 실수 방지',
        taglineEn: 'Standardize shop-floor work & prevent mistakes',
        bullets: ['불량 및 작업 이벤트 기록', '작업 시작•종료•수량 실시간 입력', '설비•공정별 생산 데이터 자동 수집'],
        bulletsEn: ['Defect & work event logging', 'Real-time start / end / quantity entry', 'Auto production data capture by equipment & process'],
        bulletIconIds: ['alert-triangle', 'timer', 'factory'],
        effectTags: ['효율 ↑', '실수 ↓', '표준화'],
        effectTagsEn: ['Efficiency ↑', 'Errors ↓', 'Standard'],
        metricLine: '업무시간 50% 절감',
        metricLineEn: '50% less admin time',
        metricLineTrend: 'down',
        point: '데이터는 만드는 게 아니라, "현장에서 바로"',
        pointEn: 'You don\'t build data—"on the shop floor"',
      },
      {
        name: '설비•보전 관리',
        desc: '라인별 생산·설비·품질 실시간 현황판',
        descEn: 'Real-time line-by-line production, equipment & quality dashboard',
        icon: '📊',
        tagline: '라인 상태를 한눈에 실시간 파악',
        taglineEn: 'Real-time line status at a glance',
        bullets: ['예방정비(PM) 일정 자동 관리', '설비 점검 체크리스트 디지털화', '고장 이력 및 MTBF•MTTR 분석'],
        bulletsEn: ['Automated preventive maintenance (PM) scheduling', 'Digital equipment inspection checklists', 'Failure history & MTBF / MTTR analysis'],
        bulletIconIds: ['calendar-clock', 'clipboard-check', 'activity'],
        effectTags: ['의사결정', '실시간', '통합'],
        effectTagsEn: ['Decisions', 'Real-time', 'Unified'],
        metricLine: '이상 대응 시간 50% 단축',
        metricLineEn: '50% faster anomaly response',
        metricLineTrend: 'up',
        point: '고장은 사고가 아니라 "관리의 문제"',
        pointEn: 'A breakdown isn\'t an accident—"management"',
      },
      {
        name: '품질관리',
        desc: '불량 즉시 등록, 4M 변경, 원인 분석',
        descEn: 'Instant defect registration, 4M change management & root cause analysis',
        icon: '🔍',
        tagline: '불량 원인 추적 및 재발 방지',
        taglineEn: 'Trace causes & prevent recurrence',
        bullets: ['검사 체크리스트 디지털화', '품질 이력 및 LOT 추적 관리', '품질 이력 및 LOT 추적 관리'],
        bulletsEn: ['Digital inspection checklists', 'Quality history & LOT traceability', 'Quality history & LOT traceability'],
        bulletIconIds: ['clipboard-list', 'tags', 'tags'],
        effectTags: ['불량 ↓', '재발 방지', '추적'],
        effectTagsEn: ['Defects ↓', 'No repeat', 'Traceability'],
        metricLine: '불량률 30% 감소',
        metricLineEn: '30% defect rate reduction',
        metricLineTrend: 'down',
        point: '불량은 데이터가 아니라 "비용 문제"',
        pointEn: 'Defects aren\'t data—"cost problem"',
      },
      {
        name: 'SOP 관리',
        desc: '표준 작업 절차 디지털화·버전관리·배포',
        descEn: 'SOP digitization, version control & distribution',
        icon: '📄',
        tagline: '표준 작업 준수 및 품질 일관성 확보',
        taglineEn: 'Compliance & consistent quality',
        bullets: ['표준 작업 절차 디지털 관리', '버전 및 승인 이력 관리', '작업자 교육 연계'],
        bulletsEn: ['Digital standard work procedures', 'Version & approval history', 'Linked to worker training'],
        bulletIconIds: ['book-open', 'git-branch', 'graduation-cap'],
        effectTags: ['품질', '일관성', '준수'],
        effectTagsEn: ['Quality', 'Consistency', 'Compliance'],
        metricLine: 'SOP 준수율 향상',
        metricLineEn: 'Higher SOP adherence',
        metricLineTrend: 'up',
        point: '품질은 사람이 아니라 "시스템"',
        pointEn: 'Quality isn\'t people—"systems"',
      },
      {
        name: '이슈관리',
        desc: 'PLC·SCADA 연동 자동 데이터 수집',
        descEn: 'Automatic data collection via PLC & SCADA integration',
        icon: '⚙️',
        tagline: '설비 데이터 자동 수집 및 실시간 활용',
        taglineEn: 'Auto-capture equipment data & use it live',
        bullets: ['조치 이력 및 개선 관리', '현장 이슈•이상 발생 즉시 등록', '담당자 자동 알림 및 대응 프로세스'],
        bulletsEn: ['Action history & improvement management', 'Instant shop-floor issue & anomaly logging', 'Auto alerts to owners & response workflow'],
        bulletIconIds: ['list-todo', 'circle-alert', 'bell-ring'],
        effectTags: ['자동화', '데이터', '실시간'],
        effectTagsEn: ['Automation', 'Data', 'Real-time'],
        metricLine: '수기 입력 70% 감소',
        metricLineEn: '70% reduction in manual entry',
        metricLineTrend: 'down',
        point: '빠른 공유, "빠른 해결"',
        pointEn: 'Fast share, "Fast resolution"',
      },
      {
        name: '실적집계',
        desc: '생산 실적 자동 집계·리포트·KPI 분석',
        descEn: 'Automated production result aggregation, reporting & KPI analysis',
        icon: '📈',
        tagline: '생산 데이터 자동 집계 및 KPI 분석',
        taglineEn: 'Auto-aggregate production data & KPI insights',
        bullets: ['생산 실적 자동 수집', 'KPI 리포트 자동 생성', '성과 분석 및 개선 지원'],
        bulletsEn: ['Auto production result capture', 'Auto KPI reports', 'Performance analysis & improvement'],
        bulletIconIds: ['database', 'file-bar-chart', 'trending-up'],
        effectTags: ['KPI', '분석', '리포트'],
        effectTagsEn: ['KPI', 'Analysis', 'Reports'],
        metricLine: '리포트 작성 시간 50% 감소',
        metricLineEn: '50% less report prep time',
        metricLineTrend: 'down',
        point: '실적은 모으지 않고 "자동 누적"',
        pointEn: 'No gathering—results "stack automatically"',
      },
    ],
    highlights: [
      '복수 사업장 실전 검증||LG전자 생산현장 운영 기준',
      '작업자 UX 최우선||현장 사용성 중심 설계',
      'ERP·MES 연동||기존 시스템 연동',
      '클라우드·온프레미스||배포 환경 선택 가능',
    ],
    highlightsEn: [
      'Proven at many sites||LG Electronics shop-floor standard',
      'Worker UX first||Designed for daily field use',
      'ERP & MES ready||Extends your existing stack',
      'Cloud or on-prem||Choose your deployment',
    ],
    techStack: ['React', 'Spring Boot', 'Oracle', 'Kafka', 'Redis', 'WebSocket', 'MQTT', 'Docker'],
  },
  {
    id: 'wiz-fact',
    name: 'WIZ-FACT',
    nameKo: 'WIZ-FACT',
    nameEn: 'WIZ-FACT',
    subtitle: '품질 점검 관리 시스템',
    subtitleEn: 'Quality Inspection Management System',
    description: '생산 라인의 품질 감사를 글로벌 표준으로 관리하는 시스템입니다.',
    descriptionEn: 'Global standard quality audit system for production lines.',
    category: 'quality',
    client: 'lg',
    isDemoAvailable: true,
    demoUrl: 'https://wiz-factory.com/project/lg-glas/#/signin/?demo=glas',
    features: [
      '4단계 디지털 감사 워크플로우 (점검→지적→조치→보고)',
      '스마트 체크리스트 기반 현장 점검',
      '불량 현장 즉시 촬영 및 GPS 기록',
      '지적 발생 즉시 Push·이메일 자동 발송',
      '감사 완료 즉시 PDF 보고서 자동 생성',
      '8개 언어 실시간 전환 지원',
      '앱 설치 없이 모바일 브라우저 즉시 실행',
      '에스컬레이션 자동 리마인드',
    ],
    featuresEn: [
      '4-Step Digital Audit Workflow (Inspect → Flag → Action → Report)',
      'Smart checklist-based on-site inspection',
      'Instant field photo capture with GPS logging',
      'Instant Push & email notification on NG detection',
      'Automatic PDF report generation upon audit completion',
      '8-language real-time switching',
      'Mobile browser access without app installation',
      'Automatic escalation reminder for overdue actions',
    ],
    industry: 'Electronics / Manufacturing',
    industryEn: 'Electronics / Manufacturing',
    detailedDescription: 'LG전자 생산현장의 품질 점검을 4단계 디지털 워크플로우로 일원화하여 자동 알림·보고서 생성·다국어 지원으로 글로벌 스마트 품질 관리를 실현합니다.',
    detailedDescriptionEn: 'A smart quality management platform that unifies LG Electronics shop-floor inspections into a 4-step digital workflow — with auto alerts, auto-generated reports, and multilingual support for global operations.',
    useCases: [
      '체크리스트 기반 일일 라인 감사 — 항목별 기준값·허용범위 사전 정의로 일관된 점검',
      'NG 발생 즉시 증거 사진 첨부 후 담당자 자동 배정 → 조치 완료까지 End-to-End 추적',
      '감사 완료 후 자동 생성된 PDF 리포트를 수신 그룹에 자동 메일 발송',
      '한국·중국·베트남 등 8개 언어 지원으로 글로벌 사업장 품질 기준 통일',
      'MES·ERP API 연동으로 이중 입력 없는 완전 자동화 품질 데이터 흐름',
    ],
    useCasesEn: [
      'Checklist-based daily line audit — consistent inspection with pre-defined criteria and tolerances',
      'NG detected → photo evidence attached → auto-assign → End-to-End action tracking',
      'Auto-generated PDF report emailed to recipient groups upon audit completion',
      'Unified global quality standards via 8-language support (KR, EN, CN, VN, ES, HI, ID, PL)',
      'Zero double-entry: fully automated quality data flow via MES & ERP API integration',
    ],
    metrics: [
      { label: '감사 프로세스', labelEn: 'Audit Process', value: '4', suffix: ' Step' },
      { label: '지원 언어', labelEn: 'Languages', value: '8', suffix: '+' },
      { label: '보고서 자동화', labelEn: 'Auto Report', value: '100', suffix: '%' },
      { label: '수동 작업', labelEn: 'Manual Work', value: '0', suffix: ' Zero' },
    ],
    modules: [
      { name: '점검', desc: '체크리스트 점검\n사진·메모 즉시 첨부\n측정값 자동 판정', descEn: 'Checklist inspection\nPhoto & memo attach\nAuto pass/fail verdict', icon: '🔍' },
      { name: '지적', desc: 'NG 즉시 등록\n심각도·귀책 부서 분류\n증거 이미지 첨부', descEn: 'Instant NG registration\nSeverity & dept. classify\nEvidence image attach', icon: '⚠️' },
      { name: '조치', desc: '담당자 자동 알림\n대책 내용 입력·확인\n재발 방지 등록', descEn: 'Auto-notify assignees\nRecord & confirm fix\nRecurrence prevention', icon: '🔧' },
      { name: '보고', desc: 'PDF 자동 생성\nKPI·차트 자동 삽입\n자동 이메일 발송', descEn: 'PDF auto-generated\nKPI & charts inserted\nAuto email dispatch', icon: '📊' },
      { name: '스마트 체크리스트', desc: '라인·공정별 맞춤 체크리스트. 기준값·허용범위 사전 정의로 일관된 품질 점검', descEn: 'Custom checklists per line & process. Pre-defined criteria & tolerances for consistent quality checks', icon: '📋' },
      { name: '자동 보고서', desc: '감사 완료 즉시 LG 표준 양식 PDF 자동 생성. KPI·차트·증거 사진 자동 삽입', descEn: 'Auto-generate LG-standard PDF upon audit completion. KPI, charts & evidence photos inserted automatically', icon: '📄' },
    ],
    highlights: [
      'LG전자 복수 글로벌 사업장 실전 배포',
      '앱 설치 없이 모바일 브라우저 즉시 실행',
      '8개 언어 실시간 전환 — 글로벌 기준 통일',
      'MES·ERP API 연동으로 이중 입력 제로',
    ],
    highlightsEn: [
      'Deployed across multiple global LG Electronics sites',
      'Instant mobile access via browser — no app install',
      '8-language real-time switching for global standards',
      'Zero double-entry via MES & ERP API integration',
    ],
    techStack: ['Vue.js', 'Java', 'MySQL', 'Elasticsearch'],
  },
  {
    id: 'esd-eos-monitoring',
    name: 'ESD/EOS 통합 모니터링',
    nameKo: 'ESD/EOS 통합 모니터링',
    nameEn: 'ESD/EOS Integrated Monitoring',
    subtitle: 'ESD/EOS Map 모니터링 시스템',
    subtitleEn: 'ESD/EOS Map Monitoring System',
    description: 'ESD/EOS Map 모니터링 시스템을 가동현황 및 디지털 시각화',
    descriptionEn: 'ESD/EOS map monitoring system with operation status and digital visualization.',
    category: 'facility',
    client: 'lg',
    features: [
      '실시간 ESD/EOS 맵 모니터링',
      '설비 가동률 분석',
      '알람 및 알림 시스템',
      '데이터 시각화 대시보드'
    ],
    featuresEn: [
      'Real-time ESD/EOS Map Monitoring',
      'Equipment Utilization Analysis',
      'Alarm and Notification System',
      'Data Visualization Dashboard'
    ],
    industry: 'Electronics / Semiconductor',
    industryEn: 'Electronics / Semiconductor',
    isDemoAvailable: true,
    detailedDescription: 'ESD/EOS 통합 모니터링 시스템은 정전기 방전 및 과전압 방지 시스템을 실시간으로 모니터링하고 관리합니다.',
    detailedDescriptionEn: 'Integrated ESD/EOS monitoring system for real-time monitoring and management of electrostatic discharge and overvoltage protection systems.',
    useCases: [
      '반도체 생산 라인의 ESD 모니터링',
      '이상 징후 사전 감지 및 알람',
      '설비 점검 스케줄 관리'
    ],
    useCasesEn: [
      'ESD monitoring for semiconductor production lines',
      'Early detection and alarming of anomalies',
      'Equipment inspection schedule management'
    ],
    metrics: [
      { label: '맵 가동률', labelEn: 'Map Uptime', value: '99', suffix: '%' },
      { label: '알람 대응 시간', labelEn: 'Alarm Response', value: '42', suffix: '%↓' },
      { label: '이상 감지율', labelEn: 'Anomaly Catch', value: '96', suffix: '%' },
      { label: '점검 준수율', labelEn: 'Inspection SLA', value: '94', suffix: '%' },
    ],
    highlights: [
      'ESD/EOS 맵을 한 화면에서 실시간 가시화',
      '설비 가동률·알람을 통합 관제',
      '데이터 시각화로 이상 징후 조기 대응',
      '점검·알람 이력으로 운영 근거 확보',
    ],
    highlightsEn: [
      'Real-time ESD/EOS map visualization on one screen',
      'Unified monitoring of utilization and alarms',
      'Data visualization for faster anomaly response',
      'Inspection and alarm history as an operational record',
    ],
    modules: [
      { name: '실시간 맵 모니터링', desc: 'ESD/EOS 맵 상태를 실시간으로 표시하고 구역별 이상을 즉시 표시합니다.', descEn: 'Live ESD/EOS map status with zone-level alerts.', icon: '🗺️' },
      { name: '설비 가동률 분석', desc: '설비별 가동·대기·알람 비율을 분석해 운영 효율을 파악합니다.', descEn: 'Analyze run, idle, and alarm ratios per asset.', icon: '📊' },
      { name: '알람·알림', desc: '임계값 초과·통신 이상 시 담당자에게 단계별 알림을 보냅니다.', descEn: 'Tiered notifications on threshold or comms faults.', icon: '🔔' },
      { name: '데이터 시각화', desc: '대시보드·트렌드로 현장 지표를 직관적으로 공유합니다.', descEn: 'Dashboards and trends for intuitive KPI sharing.', icon: '📈' },
    ],
    techStack: ['React', 'Python', 'InfluxDB', 'Grafana']
  },
  {
    id: 'vacuum-system',
    name: '전공 사이클론 시스템',
    nameKo: '전공 사이클론 시스템',
    nameEn: 'Vacuum Cyclone System',
    subtitle: '진공 사이클론 모니터링 시스템',
    subtitleEn: 'Vacuum Cyclone Monitoring System',
    description: '내에 주입한 전압의 제어를 제외한 사이클 데타를 통해 흡입력 등 관리하는 스마트 공정 관리 시스템',
    descriptionEn: 'Smart process management system for controlling suction power through cycle data.',
    category: 'facility',
    client: 'lg',
    features: [
      '진공 압력 실시간 모니터링',
      '사이클 데이터 분석',
      '흡입력 자동 제어',
      '설비 성능 최적화'
    ],
    featuresEn: [
      'Real-time Vacuum Pressure Monitoring',
      'Cycle Data Analysis',
      'Automatic Suction Control',
      'Equipment Performance Optimization'
    ],
    industry: 'Electronics / Manufacturing',
    industryEn: 'Electronics / Manufacturing',
    isDemoAvailable: true,
    detailedDescription: '전공 사이클론 시스템은 진공 설비의 성능을 최적화하고 에너지 효율을 높이는 스마트 관리 시스템입니다.',
    detailedDescriptionEn: 'Vacuum Cyclone System is a smart management system that optimizes vacuum equipment performance and increases energy efficiency.',
    useCases: [
      '진공 펌프 성능 모니터링',
      '에너지 소비 최적화',
      '예방 정비 스케줄링'
    ],
    useCasesEn: [
      'Vacuum pump performance monitoring',
      'Energy consumption optimization',
      'Preventive maintenance scheduling'
    ],
    metrics: [
      { label: '압력 안정성', labelEn: 'Pressure Stability', value: '98', suffix: '%' },
      { label: '에너지 효율', labelEn: 'Energy Efficiency', value: '24', suffix: '%↑' },
      { label: '사이클 편차', labelEn: 'Cycle Variance', value: '15', suffix: '%↓' },
      { label: '설비 가용성', labelEn: 'Availability', value: '97', suffix: '%' },
    ],
    highlights: [
      '진공 압력·사이클 데이터를 실시간으로 수집',
      '흡입력 자동 제어로 공정 조건 유지',
      '에너지 소비와 설비 성능을 동시에 최적화',
      '예방 정비 시점을 데이터로 선제 제안',
    ],
    highlightsEn: [
      'Real-time vacuum pressure and cycle data',
      'Automatic suction control to hold process conditions',
      'Optimize energy use and equipment performance together',
      'Data-driven preventive maintenance timing',
    ],
    modules: [
      { name: '진공 압력 모니터링', desc: '라인별 압력·유량을 실시간으로 추적하고 임계 알람을 냅니다.', descEn: 'Track pressure and flow per line with threshold alarms.', icon: '📉' },
      { name: '사이클 데이터 분석', desc: '사이클 데타 기반으로 편차·트렌드를 분석합니다.', descEn: 'Analyze variance and trends from cycle data.', icon: '📈' },
      { name: '흡입력 자동 제어', desc: '목표 조건에 맞춰 흡입력을 자동 조정합니다.', descEn: 'Auto-adjust suction to meet target conditions.', icon: '⚙️' },
      { name: '설비 성능 최적화', desc: '펌프·밸브 상태를 종합해 성능 저하를 조기에 감지합니다.', descEn: 'Holistic pump and valve signals to catch degradation early.', icon: '✨' },
    ],
    techStack: ['Angular', 'C#', 'SQL Server', 'MQTT']
  },
  {
    id: 'patrol-system',
    name: '감독자 Patrol 시스템',
    nameKo: '감독자 Patrol 시스템',
    nameEn: 'Supervisor Patrol System',
    subtitle: '현장 순찰 관리 시스템',
    subtitleEn: 'Field Patrol Management System',
    description: '현장 감독자의 순찰 활동을 디지털화하고 체계적으로 관리합니다.',
    descriptionEn: 'Digitizes and systematically manages field supervisor patrol activities.',
    category: 'production',
    client: 'lg',
    features: [
      '순찰 경로 관리',
      '체크리스트 자동화',
      '이슈 즉시 보고',
      'GPS 위치 추적'
    ],
    featuresEn: [
      'Patrol Route Management',
      'Checklist Automation',
      'Instant Issue Reporting',
      'GPS Location Tracking'
    ],
    industry: 'Electronics / Manufacturing',
    industryEn: 'Electronics / Manufacturing',
    isDemoAvailable: false,
    detailedDescription: '감독자 Patrol 시스템은 현장 감독자의 순찰을 효율적으로 관리하고, 발견된 이슈를 즉시 보고 및 해결할 수 있는 모바일 기반 시스템입니다.',
    detailedDescriptionEn: 'Supervisor Patrol System is a mobile-based system that efficiently manages field supervisor patrols and enables instant reporting and resolution of identified issues.',
    useCases: [
      '일일 현장 순찰 체크리스트 관리',
      '안전 이슈 즉시 보고 및 조치',
      '순찰 이력 데이터 분석'
    ],
    useCasesEn: [
      'Daily field patrol checklist management',
      'Immediate safety issue reporting and action',
      'Patrol history data analysis'
    ],
    metrics: [
      { label: '순찰 완료율', labelEn: 'Patrol Completion', value: '97', suffix: '%' },
      { label: '이슈 대응 시간', labelEn: 'Issue Response', value: '45', suffix: '%↓' },
      { label: '경로 준수율', labelEn: 'Route Compliance', value: '95', suffix: '%' },
      { label: '체크리스트 통과', labelEn: 'Checklist Pass', value: '98', suffix: '%' },
    ],
    highlights: [
      '순찰 경로·체크리스트를 모바일로 표준화',
      '이슈 발견 시 즉시 보고·조치 흐름 연결',
      'GPS·이력으로 순찰 증빙과 분석 강화',
      '감독자 현장 활동을 데이터로 가시화',
    ],
    highlightsEn: [
      'Standardize routes and checklists on mobile',
      'From issue find to report and action in one flow',
      'GPS and history for proof and analytics',
      'Supervisor field activity made visible in data',
    ],
    modules: [
      { name: '순찰 경로 관리', desc: '구역·시간대별 순찰 경로를 등록하고 이탈을 감지합니다.', descEn: 'Register routes by zone and time window; detect deviations.', icon: '🗺️' },
      { name: '체크리스트 자동화', desc: '항목별 완료·NG를 즉시 기록하고 누락을 방지합니다.', descEn: 'Per-item pass/NG with fewer missed steps.', icon: '✅' },
      { name: '이슈 즉시 보고', desc: '사진·메모와 함께 담당자에게 자동 배정됩니다.', descEn: 'Photos and notes with auto-assignment.', icon: '🚨' },
      { name: 'GPS 위치 추적', desc: '순찰 동선과 체류를 기록해 감사에 활용합니다.', descEn: 'Track path and dwell for audits.', icon: '📍' },
    ],
    techStack: ['React Native', 'Node.js', 'MongoDB']
  },
  {
    id: 'work-instruction',
    name: '작업지도서',
    nameKo: '작업지도서',
    nameEn: 'Work Instructions',
    subtitle: '디지털 작업 표준서 시스템',
    subtitleEn: 'Digital Work Standard System',
    description: '작업 표준서를 디지털화하여 작업자에게 실시간으로 제공합니다.',
    descriptionEn: 'Digitizes work standards and provides them to workers in real-time.',
    category: 'production',
    client: 'lg',
    features: [
      '작업 표준서 디지털화',
      '버전 관리',
      '멀티미디어 콘텐츠 지원',
      '작업자 교육 이력 관리'
    ],
    featuresEn: [
      'Digital Work Standards',
      'Version Control',
      'Multimedia Content Support',
      'Worker Training History Management'
    ],
    industry: 'Electronics / Manufacturing',
    industryEn: 'Electronics / Manufacturing',
    isDemoAvailable: false,
    detailedDescription: '디지털 작업지도서는 작업 표준서를 체계적으로 관리하고, 작업자가 언제든지 최신 작업 지시를 확인할 수 있는 시스템입니다.',
    detailedDescriptionEn: 'Digital Work Instructions is a system that systematically manages work standards and allows workers to access the latest work instructions anytime.',
    useCases: [
      '신규 작업자 온보딩 교육',
      '작업 표준 변경 사항 즉시 반영',
      '작업 절차 준수율 모니터링'
    ],
    useCasesEn: [
      'New worker onboarding training',
      'Immediate reflection of work standard changes',
      'Work procedure compliance monitoring'
    ],
    techStack: ['Vue.js', 'Python', 'PostgreSQL']
  },
  {
    id: 'wiz-pms',
    name: 'WIZ-PMS',
    nameKo: 'WIZ-PMS',
    nameEn: 'WIZ-PMS',
    subtitle: 'Project Management System',
    subtitleEn: 'Project Management System',
    description: '제조 프로젝트를 체계적으로 관리하는 통합 프로젝트 관리 시스템입니다.',
    descriptionEn: 'Integrated project management system for systematic manufacturing project management.',
    category: 'project',
    client: 'wizfactory',
    features: [
      '프로젝트 일정 관리',
      '리소스 할당 최적화',
      '진행률 실시간 추적',
      '협업 도구 통합'
    ],
    featuresEn: [
      'Project Schedule Management',
      'Resource Allocation Optimization',
      'Real-time Progress Tracking',
      'Collaboration Tool Integration'
    ],
    industry: 'Manufacturing / IT',
    industryEn: 'Manufacturing / IT',
    isDemoAvailable: true,
    detailedDescription: 'WIZ-PMS는 제조 현장의 다양한 프로젝트를 효율적으로 관리하고, 팀 간 협업을 촉진하는 통합 관리 시스템입니다.',
    detailedDescriptionEn: 'WIZ-PMS is an integrated management system that efficiently manages various manufacturing projects and facilitates team collaboration.',
    useCases: [
      '신규 설비 도입 프로젝트 관리',
      '공정 개선 프로젝트 추적',
      '다부서 협업 프로젝트 조율'
    ],
    useCasesEn: [
      'New equipment introduction project management',
      'Process improvement project tracking',
      'Multi-department collaboration project coordination'
    ],
    techStack: ['React', 'Node.js', 'PostgreSQL', 'WebSocket']
  }
];

export const getCategoryLabel = (key: CategoryKey, language: 'ko' | 'en'): string => {
  const labels = {
    ko: {
      all: '전체',
      platform: '플랫폼',
      production: '생산관리',
      quality: '품질관리',
      facility: '설비관리',
      project: '운영 관리'
    },
    en: {
      all: 'All',
      platform: 'Platform',
      production: 'Production',
      quality: 'Quality',
      facility: 'Facility',
      project: 'Operations'
    }
  };
  return labels[language][key];
};

export const categories = {
  all: { label: '전체', color: '#86868B' },
  platform: { label: '플랫폼', color: '#0071E3' },
  production: { label: '생산관리', color: '#9B51E0' },
  quality: { label: '품질관리', color: '#2ECC71' },
  facility: { label: '설비관리', color: '#F2994A' },
  project: { label: '운영 관리', color: '#86868B' }
};

export type CategoryKey = keyof typeof categories;