import { motion } from 'motion/react';
import {
  Download, Play,
  Check, ClipboardList, Camera,
  ChevronRight,
  Activity, BarChart2, Cpu,
  Map, MapPin, Bell,
  BookOpen, GitBranch, GraduationCap,
  Users, Calendar, TrendingUp,
  Gauge, SlidersHorizontal, Wrench,
  FileText, Settings, Layers,
  type LucideIcon,
} from 'lucide-react';
import { Solution, categories, getCategoryLabel } from '../data/solutions';
import { useLanguage } from '../contexts/LanguageContext';

interface WizSolutionCardProps {
  solution: Solution;
  index: number;
  onOpenModal: (solution: Solution) => void;
}

// ── 아이콘 맵 ─────────────────────────────────────────────────────────────────
const ICON_MAP: Record<string, LucideIcon> = {
  check: Check,
  clipboard: ClipboardList,
  camera: Camera,
  activity: Activity,
  barchart: BarChart2,
  cpu: Cpu,
  map: Map,
  mappin: MapPin,
  bell: Bell,
  book: BookOpen,
  git: GitBranch,
  grad: GraduationCap,
  users: Users,
  calendar: Calendar,
  trending: TrendingUp,
  gauge: Gauge,
  sliders: SlidersHorizontal,
  wrench: Wrench,
  file: FileText,
  settings: Settings,
  layers: Layers,
};

// ── 피처 행 타입 ───────────────────────────────────────────────────────────────
interface FeatureRow {
  icon: string;
  title: string;
  tags?: string[];
  subtitle?: string;
}

// ── 솔루션별 피처 데이터 ──────────────────────────────────────────────────────
const CARD_DATA: Record<string, { ko: FeatureRow[]; en: FeatureRow[] }> = {
  'wiz-mes': {
    ko: [
      { icon: 'activity',  title: '실시간 생산 실적 관리',       tags: ['계획', '실적', '분석'] },
      { icon: 'cpu',       title: '설비 데이터 자동 수집',        subtitle: 'PLC·SCADA 연동 · 이상 감지 · 실시간 동기화' },
      { icon: 'barchart',  title: '통합 모니터링 대시보드',       subtitle: '멀티 라인 · KPI 자동 집계 · 리포트 자동화' },
    ],
    en: [
      { icon: 'activity',  title: 'Real-time Production Mgmt',   tags: ['Plan', 'Actual', 'Analysis'] },
      { icon: 'cpu',       title: 'Automatic Equipment Data Collection', subtitle: 'PLC·SCADA link · Anomaly detection · Real-time sync' },
      { icon: 'barchart',  title: 'Unified Monitoring Dashboard', subtitle: 'Multi-line · Auto KPI · Auto reporting' },
    ],
  },
  'wiz-flow': {
    ko: [
      { icon: 'file',      title: '작업지시서 완전 디지털화',     tags: ['작업지시', '체크시트', '순찰일지'] },
      { icon: 'activity',  title: '공정별 실시간 현황 모니터링',  subtitle: '라인별 생산·불량·설비 상태 통합 조회' },
      { icon: 'settings',  title: '설비 연동 & 데이터 자동 수집', subtitle: 'PLC·SCADA 연동 · 4M 변경 관리 · SOP 자동 배포' },
    ],
    en: [
      { icon: 'file',      title: 'Full Paperless Work Orders',   tags: ['Work Order', 'Check Sheet', 'Patrol Log'] },
      { icon: 'activity',  title: 'Real-time Process Monitoring', subtitle: 'Line-by-line production, defect & equipment dashboard' },
      { icon: 'settings',  title: 'Equipment Integration & Auto Data', subtitle: 'PLC·SCADA · 4M change mgmt · SOP auto-distribution' },
    ],
  },
  'wiz-fact': {
    ko: [
      { icon: 'check',     title: '4단계 디지털 감사 워크플로우', tags: ['점검', '지적', '조치', '보고'] },
      { icon: 'clipboard', title: '스마트 체크리스트 기반 현장 점검', subtitle: '모바일 최적화 · 실시간 동기화 · 오프라인 지원' },
      { icon: 'camera',    title: '불량 현장 즉시 촬영 및 GPS 기록', subtitle: '위치 자동 태깅 · 증거 사진 첨부 · 이력 추적' },
    ],
    en: [
      { icon: 'check',     title: '4-Step Digital Audit Workflow', tags: ['Inspect', 'Flag', 'Action', 'Report'] },
      { icon: 'clipboard', title: 'Smart Checklist-Based Inspection', subtitle: 'Mobile-first · Real-time sync · Offline support' },
      { icon: 'camera',    title: 'Instant Photo Capture & GPS Logging', subtitle: 'Auto location tag · Evidence photo · History track' },
    ],
  },
  'esd-eos-monitoring': {
    ko: [
      { icon: 'map',       title: '실시간 ESD/EOS 맵 모니터링',  tags: ['ESD', 'EOS', 'MAP'] },
      { icon: 'gauge',     title: '설비 가동률 분석',             subtitle: '가동·비가동 구분 · 추이 분석 · 이상 예측' },
      { icon: 'bell',      title: '알람 및 알림 시스템',          subtitle: '임계값 초과 즉시 알림 · Push · 이메일 자동 발송' },
    ],
    en: [
      { icon: 'map',       title: 'Real-time ESD/EOS Map Monitoring', tags: ['ESD', 'EOS', 'MAP'] },
      { icon: 'gauge',     title: 'Equipment Utilization Analysis',    subtitle: 'On/Off classification · Trend analysis · Prediction' },
      { icon: 'bell',      title: 'Alarm & Notification System',       subtitle: 'Threshold alerts · Push · Auto email dispatch' },
    ],
  },
  'vacuum-system': {
    ko: [
      { icon: 'gauge',     title: '진공 압력 실시간 모니터링',    tags: ['측정', '분석', '제어'] },
      { icon: 'sliders',   title: '흡입력 자동 제어',             subtitle: '목표값 자동 추적 · 편차 최소화 · 인터록 보호' },
      { icon: 'wrench',    title: '설비 성능 최적화',             subtitle: '에너지 효율 향상 · 사이클 데이터 분석 · 예방 정비' },
    ],
    en: [
      { icon: 'gauge',     title: 'Real-time Vacuum Pressure Monitoring', tags: ['Measure', 'Analyze', 'Control'] },
      { icon: 'sliders',   title: 'Automatic Suction Control',            subtitle: 'Auto target tracking · Deviation min · Interlock' },
      { icon: 'wrench',    title: 'Equipment Performance Optimization',   subtitle: 'Energy efficiency · Cycle data analysis · PM' },
    ],
  },
  'patrol-system': {
    ko: [
      { icon: 'map',       title: '순찰 경로 디지털 관리',        tags: ['계획', '실행', '완료'] },
      { icon: 'clipboard', title: '체크리스트 자동화',            subtitle: '항목별 기준값 · 사진 첨부 · 이상 즉시 등록' },
      { icon: 'mappin',    title: '이슈 즉시 보고 & GPS 위치 추적', subtitle: '위치 자동 기록 · 담당자 알림 · 처리 결과 추적' },
    ],
    en: [
      { icon: 'map',       title: 'Digital Patrol Route Management', tags: ['Plan', 'Execute', 'Done'] },
      { icon: 'clipboard', title: 'Checklist Automation',            subtitle: 'Criteria per item · Photo attach · Instant NG log' },
      { icon: 'mappin',    title: 'Instant Issue Report & GPS Track', subtitle: 'Auto location · Assignee alert · Resolution track' },
    ],
  },
  'work-instruction': {
    ko: [
      { icon: 'book',      title: '작업 표준서 완전 디지털화',    tags: ['문서', '영상', '이미지'] },
      { icon: 'git',       title: '버전 관리 & 자동 배포',        subtitle: '변경 이력 추적 · 승인 워크플로우 · 전 라인 동시 배포' },
      { icon: 'grad',      title: '작업자 교육 이력 관리',        subtitle: '이수율 추적 · 자격 관리 · 신규 온보딩 지원' },
    ],
    en: [
      { icon: 'book',      title: 'Full Digital Work Standards',  tags: ['Doc', 'Video', 'Image'] },
      { icon: 'git',       title: 'Version Control & Auto Deploy', subtitle: 'Change history · Approval flow · Simultaneous deploy' },
      { icon: 'grad',      title: 'Worker Training History Mgmt', subtitle: 'Completion rate · Qualification · Onboarding support' },
    ],
  },
  'wiz-pms': {
    ko: [
      { icon: 'calendar',  title: '프로젝트 일정 관리',           tags: ['기획', '실행', '완료'] },
      { icon: 'users',     title: '리소스 할당 최적화',           subtitle: '부서·인원 배정 · 과부하 감지 · 최적 배분' },
      { icon: 'trending',  title: '진행률 실시간 추적',           subtitle: '마일스톤 · 이슈 트래킹 · 리포트 자동화' },
    ],
    en: [
      { icon: 'calendar',  title: 'Project Schedule Management',  tags: ['Plan', 'Execute', 'Done'] },
      { icon: 'users',     title: 'Resource Allocation Optimization', subtitle: 'Dept & headcount · Overload detection · Optimal assign' },
      { icon: 'trending',  title: 'Real-time Progress Tracking',  subtitle: 'Milestones · Issue tracking · Auto reporting' },
    ],
  },
};

// ── 피처 아이콘 렌더러 ────────────────────────────────────────────────────────
function FeatureIcon({ type, color }: { type: string; color: string }) {
  const Icon = ICON_MAP[type] ?? Layers;
  return (
    <div
      className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0"
      style={{ background: `${color}14` }}
    >
      <Icon className="w-5 h-5" style={{ color }} strokeWidth={2} />
    </div>
  );
}

// ── 피처 행 ───────────────────────────────────────────────────────────────────
function FeatureItem({ feat, color }: { feat: FeatureRow; color: string }) {
  return (
    <div
      className="flex items-start gap-3.5 rounded-2xl px-4 py-3.5"
      style={{
        background: '#FFFFFF',
        boxShadow: '0 2px 12px rgba(0,0,0,0.05), 0 1px 3px rgba(0,0,0,0.04)',
      }}
    >
      <FeatureIcon type={feat.icon} color={color} />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold mb-1.5 leading-snug" style={{ color: '#1D1D1F' }}>
          {feat.title}
        </p>
        {feat.tags && feat.tags.length > 0 && (
          <div className="flex items-center gap-1 flex-wrap">
            {feat.tags.map((tag, ti) => (
              <span key={ti} className="flex items-center gap-1">
                <span
                  className="px-2 py-0.5 rounded-full text-[11px] font-semibold"
                  style={{ background: `${color}18`, color }}
                >
                  {tag}
                </span>
                {ti < feat.tags!.length - 1 && (
                  <ChevronRight className="w-3 h-3 flex-shrink-0" style={{ color: '#C7C7CC' }} />
                )}
              </span>
            ))}
          </div>
        )}
        {feat.subtitle && (
          <p className="text-[12px] leading-relaxed" style={{ color: '#AEAEB2' }}>
            {feat.subtitle}
          </p>
        )}
      </div>
    </div>
  );
}

// ── 통합 솔루션 카드 ──────────────────────────────────────────────────────────
function SolutionCard({
  solution,
  index,
  onOpenModal,
  t,
  language,
}: {
  solution: Solution;
  index: number;
  onOpenModal: (s: Solution) => void;
  t: (key: string) => string;
  language: string;
}) {
  const ko = language === 'ko';
  const color = categories[solution.category].color;
  const categoryLabel = getCategoryLabel(solution.category, language);
  const cardData = CARD_DATA[solution.id];
  const features = cardData ? (ko ? cardData.ko : cardData.en) : [];

  const displayName = ko ? solution.nameKo : solution.nameEn;
  const displaySubtitle = ko ? solution.subtitle : solution.subtitleEn;

  const handleDownload = (e: React.MouseEvent) => {
    e.preventDefault();
    if (solution.brochurePdf) {
      const a = document.createElement('a');
      a.href = solution.brochurePdf;
      a.download = ko ? 'WIZ-Flow-시스템소개서-16x9.pdf' : 'WIZ-Flow-system-intro-16x9.pdf';
      a.rel = 'noopener';
      document.body.appendChild(a);
      a.click();
      a.remove();
      return;
    }
    alert(t('solutions.downloadStarted') || '브로슈어 다운로드가 시작되었습니다.');
  };

  const handleDemo = (e: React.MouseEvent) => {
    e.preventDefault();
    if (solution.demoUrl) {
      window.open(solution.demoUrl, '_blank', 'noopener,noreferrer');
    } else {
      window.open(`/demo/${solution.id}`, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div
        whileHover={{ y: -4, boxShadow: '0 24px 64px rgba(0,0,0,0.10), 0 4px 16px rgba(0,0,0,0.05)' }}
        transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
        className="rounded-[28px] flex flex-col h-full"
        style={{
          background: 'linear-gradient(160deg, #FFFFFF 0%, #F7F8FA 100%)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.07), 0 2px 8px rgba(0,0,0,0.04)',
          padding: '28px 24px 24px',
        }}
      >
        {/* ① 카테고리 배지 */}
        <div className="mb-5">
          <span
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[13px] font-semibold"
            style={{ background: `${color}18`, color }}
          >
            <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: color }} />
            {categoryLabel}
          </span>
        </div>

        {/* ② 솔루션 이름 */}
        <h3
          className="font-black leading-none mb-2"
          style={{
            fontSize: displayName.length > 8 ? 40 : 64,
            letterSpacing: displayName.length > 8 ? '-0.02em' : '-0.04em',
            color: '#1D1D1F',
            lineHeight: 1.05,
          }}
        >
          {displayName}
        </h3>

        {/* ③ 서브타이틀 */}
        <p className="text-base font-normal mb-7" style={{ color: '#86868B' }}>
          {displaySubtitle}
        </p>

        {/* ④ 주요 기능 */}
        <div className="flex-1 flex flex-col gap-2.5 mb-7">
          <p
            className="text-xs font-semibold mb-1"
            style={{ color: '#AEAEB2', letterSpacing: '0.08em' }}
          >
            {ko ? '주요 기능' : 'KEY FEATURES'}
          </p>
          {features.map((feat, i) => (
            <FeatureItem key={i} feat={feat} color={color} />
          ))}
        </div>

        {/* ⑤ 버튼 영역 */}
        <div className="flex flex-col gap-2.5">
          <motion.button
            whileHover={{ scale: 1.015 }}
            whileTap={{ scale: 0.985 }}
            onClick={() => onOpenModal(solution)}
            className="w-full flex items-center justify-center font-bold text-base rounded-2xl"
            style={{
              background: '#B30710',
              color: '#FFFFFF',
              height: 56,
              letterSpacing: '-0.01em',
            }}
          >
            {ko ? '더 알아보기' : 'Learn More'}
          </motion.button>

          <div className="flex gap-2.5">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleDownload}
              className="flex-1 flex items-center justify-center gap-2 font-semibold text-sm rounded-2xl"
              style={{ background: '#F2F2F7', color: '#3C3C43', height: 48 }}
            >
              <Download className="w-4 h-4" strokeWidth={2} />
              {ko ? '소개서' : 'Brochure'}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleDemo}
              className="flex-1 flex items-center justify-center gap-2 font-semibold text-sm rounded-2xl"
              style={{ background: '#F5F5F7', color: '#1D1D1F', height: 48 }}
            >
              <Play className="w-4 h-4" strokeWidth={2} />
              {ko ? '데모 보기' : 'View Demo'}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── 외부 노출 컴포넌트 ─────────────────────────────────────────────────────────
export function WizSolutionCard({ solution, index, onOpenModal }: WizSolutionCardProps) {
  const { t, language } = useLanguage();

  return (
    <SolutionCard
      solution={solution}
      index={index}
      onOpenModal={onOpenModal}
      t={t}
      language={language}
    />
  );
}
