import { motion } from 'motion/react';
import { useLanguage } from '../contexts/LanguageContext';
import {
  IconManufacturing,
  IconCollaboration,
  IconDataViz,
  IconInsights,
  IconGear,
  IconQuality,
  IconSliders,
  IconKanban,
  IconDashboard,
  IconWorkflow,
  IconBell,
  IconReport,
  IconAPI,
} from './AnimatedIcons';

// ── Shared sub-components ─────────────────────────────────────────────────────

const IconBox = ({
  icon: Icon,
  color,
  bg,
  size = 44,
}: {
  icon: React.ElementType;
  color: string;
  bg: string;
  size?: number;
}) => (
  <div
    className="rounded-2xl flex items-center justify-center flex-shrink-0"
    style={{ width: size, height: size, background: bg }}
  >
    <Icon color={color} />
  </div>
);

const Badge = ({ label, color }: { label: string; color: string }) => (
  <span
    className="text-[11px] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap"
    style={{
      background: `${color}18`,
      color,
      border: `1px solid ${color}30`,
    }}
  >
    {label}
  </span>
);

const ModulePill = ({ label, color }: { label: string; color: string }) => (
  <span
    className="text-[10px] font-bold px-2.5 py-1 rounded-md"
    style={{ background: `${color}18`, color }}
  >
    {label}
  </span>
);

const LayerDivider = ({ up, down, colorTop, colorBottom }: { up: string; down: string; colorTop: string; colorBottom: string }) => (
  <div className="flex items-center gap-5 py-2 my-1">
    {/* left dashed line */}
    <div className="flex-1 border-t border-dashed" style={{ borderColor: '#D1D1D6' }} />

    {/* sync animation block */}
    <div className="flex items-center gap-3">
      {/* upward flow */}
      <div className="flex flex-col items-center gap-1">
        <span className="text-[10px] font-semibold tracking-wide" style={{ color: colorTop }}>{up}</span>
        <div className="flex flex-col items-center gap-[3px]" style={{ height: 28 }}>
          {[0, 1, 2].map(i => (
            <motion.div
              key={i}
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: colorTop,
              }}
              animate={{ opacity: [0, 1, 0], y: [8, 0, -8] }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                delay: i * 0.2,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>
      </div>

      {/* center sync icon */}
      <div className="flex flex-col items-center gap-1">
        <motion.svg
          width="28" height="28" viewBox="0 0 24 24" fill="none"
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        >
          {/* top arc — clockwise arrow */}
          <path
            d="M4.5 9A7.5 7.5 0 0 1 19 7.5"
            stroke="var(--apple-text-secondary)" strokeWidth="2" strokeLinecap="round"
          />
          {/* top arrowhead */}
          <path
            d="M19 4.5V8h-3.5"
            stroke="var(--apple-text-secondary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          />
          {/* bottom arc — clockwise arrow */}
          <path
            d="M19.5 15A7.5 7.5 0 0 1 5 16.5"
            stroke="var(--apple-text-secondary)" strokeWidth="2" strokeLinecap="round"
          />
          {/* bottom arrowhead */}
          <path
            d="M5 19.5V16H8.5"
            stroke="var(--apple-text-secondary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          />
        </motion.svg>
        <span className="text-[9px] font-bold tracking-widest uppercase" style={{ color: '#AEAEB2' }}>SYNC</span>
      </div>

      {/* downward flow */}
      <div className="flex flex-col items-center gap-1">
        <div className="flex flex-col items-center gap-[3px]" style={{ height: 28 }}>
          {[0, 1, 2].map(i => (
            <motion.div
              key={i}
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: colorBottom,
              }}
              animate={{ opacity: [0, 1, 0], y: [-8, 0, 8] }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                delay: i * 0.2,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>
        <span className="text-[10px] font-semibold tracking-wide" style={{ color: colorBottom }}>{down}</span>
      </div>
    </div>

    {/* right dashed line */}
    <div className="flex-1 border-t border-dashed" style={{ borderColor: '#D1D1D6' }} />
  </div>
);

// ── Main Component ────────────────────────────────────────────────────────────

export function WizArchitecture() {
  const { language } = useLanguage();
  const ko = language === 'ko';

  // ── Layer accent colours ──────────────────────────────────────────────────
  const L3 = '#5B8DEF';   // blue   — 운영 및 인사이트
  const L2 = '#34C759';   // green  — 도메인 솔루션
  const L1 = '#0071E3';   // apple blue — 위즈팩토리 플랫폼
  const SEC_BG = 'var(--apple-surface-gray)';

  // ── Data ─────────────────────────────────────────────────────────────────
  const layer3 = [
    {
      name: ko ? '제조 운영 실행' : 'Manufacturing Ops',
      sub:  ko ? 'Manufacturing Ops' : 'Real-time Control',
      icon: IconManufacturing,
      color: '#4A90E2',
      bg:    '#EEF3FF',
      tag:   ko ? '실시간' : 'Real-time',
    },
    {
      name: ko ? '업무 협업' : 'Work Collaboration',
      sub:  ko ? 'Work Collaboration' : 'Team Synergy',
      icon: IconCollaboration,
      color: '#9B59B6',
      bg:    '#F5EEFF',
      tag:   ko ? '협업' : 'Collaboration',
    },
    {
      name: ko ? '데이터 시각화' : 'Data Visualization',
      sub:  ko ? 'Data Visualization' : 'Live Dashboard',
      icon: IconDataViz,
      color: '#2BACC4',
      bg:    '#E5F8FB',
      tag:   ko ? '대시보드' : 'Dashboard',
    },
    {
      name: ko ? '분석 인사이트' : 'Analysis Insights',
      sub:  ko ? 'Analysis Insights' : 'KPI Intelligence',
      icon: IconInsights,
      color: '#2BA896',
      bg:    '#E5F5F2',
      tag:   ko ? '지표 기반' : 'KPI-based',
    },
  ];

  const layer2 = [
    {
      name:    ko ? '생산 실행 관리' : 'Execution Mgmt',
      icon:    IconGear,
      color:   '#7B61FF',
      bg:      '#F0EBFF',
      tag:     ko ? '생산' : 'Production',
      modules: ['WIZ-MES', 'WIZ-POP'],
      desc:    ko
        ? '생산 추적·작업 지시·설비 통합'
        : 'Production Tracking · Work Order · Equipment',
    },
    {
      name:    ko ? '품질 보증 시스템' : 'Quality Assurance',
      icon:    IconQuality,
      color:   '#27AE60',
      bg:      '#E8FAF0',
      tag:     ko ? '품질' : 'Quality',
      modules: ['WIZ-QMS', 'WIZ-FACT'],
      desc:    ko
        ? '품질 검사·불량 관리·감독자 순찰'
        : 'Quality Inspection · Defect Mgmt · Patrol',
    },
    {
      name:    ko ? '설비 자산 관리' : 'Asset Management',
      icon:    IconSliders,
      color:   '#F2994A',
      bg:      '#FEF4E8',
      tag:     ko ? '설비' : 'Facility',
      modules: ['WIZ-EAM'],
      desc:    ko
        ? '설비 관리·예지 보전·에너지 관리'
        : 'Equipment · Predictive Maintenance · Energy',
    },
    {
      name:    ko ? '운영 관리' : 'Operations Mgmt',
      icon:    IconKanban,
      color:   '#2D9CDB',
      bg:      '#E5F4FD',
      tag:     ko ? '운영' : 'Operations',
      modules: ['WIZ-PMS', 'WIZ-FLOW'],
      desc:    ko
        ? '프로젝트·일정 관리·자원 배분'
        : 'Project · Schedule · Resource Allocation',
    },
  ];

  const layer1 = [
    { name: ko ? '대시보드' : 'Dashboard', icon: IconDashboard,  color: '#7B61FF', bg: '#F0EBFF', tag: ko ? '커스터마이징' : 'Customizable' },
    { name: ko ? '워크플로우' : 'Workflow', icon: IconWorkflow,   color: '#7B61FF', bg: '#F0EBFF', tag: ko ? '자동화' : 'Automation' },
    { name: ko ? '알람' : 'Alarm',          icon: IconBell,       color: '#F97316', bg: '#FFF0E6', tag: ko ? '멀티 디바이스' : 'Multi Device' },
    { name: ko ? '리포트' : 'Report',       icon: IconReport,     color: '#10B981', bg: '#E8FAF4', tag: ko ? '자동 메일링' : 'Auto Email' },
    { name: 'API',                           icon: IconAPI,        color: '#6366F1', bg: '#EDEDFF', tag: ko ? '모듈화' : 'Modular' },
  ];

  // ── Helpers ───────────────────────────────────────────────────────────────
  const CARD_SHADOW = '0 2px 12px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.05)';
  const LEFT_W = 220; // px — left column width (wider to fit h3 title)

  const Dot = ({ color }: { color: string }) => (
    <div
      className="absolute z-10"
      style={{
        right: -9,
        top: '50%',
        transform: 'translateY(-50%)',
        width: 18,
        height: 18,
        borderRadius: '50%',
        background: color,
        boxShadow: `0 0 0 3px ${SEC_BG}, 0 0 0 5.5px ${color}55`,
      }}
    />
  );

  const cardAnim = (i: number) => ({
    initial: { opacity: 0, y: 16 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.42, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] as any },
    whileHover: { y: -5, transition: { duration: 0.2 } },
  });

  return (
    <section
      id="architecture"
      className="relative py-32 apple-section-gray"
      data-bg-theme="light"
    >
      <div className="wiz-section">

        {/* ── Section header ──────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2
            className="text-3xl md:text-5xl lg:text-6xl font-bold mb-5 tracking-tight px-2"
            style={{ color: 'var(--apple-text-primary)' }}
          >
            {ko ? '핵심 아키텍처' : 'Core Architecture'}
          </h2>
          <p
            className="text-base md:text-xl lg:text-2xl font-normal"
            style={{ color: 'var(--apple-text-secondary)' }}
          >
            {ko
              ? '3개의 계층으로 구성된 스마트팩토리 통합 플랫폼'
              : 'A three-layer integrated platform for smart manufacturing.'}
          </p>
        </motion.div>

        {/* ── Desktop: layered architecture diagram ───────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7 }}
          className="hidden md:block"
        >
          {/* ── Wrapper that spans exactly LAYER 3 header → LAYER 1 header ── */}
          {/* The line lives here so it starts/ends precisely at each dot center */}
          <div className="relative">
            {/* Vertical gradient timeline line */}
            <div
              className="absolute z-0 rounded-full"
              style={{
                left: LEFT_W - 1,
                top: 28,      /* half of 56px header height = dot center */
                bottom: 28,   /* half of 56px header height = dot center */
                width: 2,
                background: `linear-gradient(to bottom, ${L3} 0%, ${L2} 50%, ${L1} 100%)`,
                opacity: 0.35,
              }}
            />

            {/* ════════════════ LAYER 3 ════════════════ */}
            <div className="mb-2">
              {/* Header row — fixed minHeight so dot is always at 28px = 50% */}
              <div className="flex items-center mb-5" style={{ minHeight: 56 }}>
                <div
                  className="flex-shrink-0 relative flex flex-col justify-center text-right pr-8"
                  style={{ width: LEFT_W, minHeight: 56 }}
                >
                  <div
                    className="text-[11px] font-bold tracking-[0.15em] uppercase"
                    style={{ color: L3 }}
                  >
                    LAYER 3
                  </div>
                  <div className="text-base font-bold mt-0.5" style={{ color: 'var(--apple-text-primary)' }}>
                    {ko ? '운영 및 인사이트 레이어' : 'Operations & Insight Layer'}
                  </div>
                  <div
                    className="text-[11px] mt-1 leading-snug"
                    style={{ color: 'var(--apple-text-secondary)' }}
                  >
                    {ko ? '운영 및 인사이트' : 'Operations & Insights'}
                  </div>
                  <Dot color={L3} />
                </div>
              <div className="flex-1 pl-10 pr-10" />
            </div>
            {/* Cards row */}
            <div className="flex">
              <div className="flex-shrink-0" style={{ width: LEFT_W }} />
              <div className="flex-1 pl-10 pr-10 pb-10">
                <div className="grid grid-cols-4 gap-3">
                  {layer3.map((item, i) => (
                      <motion.div
                        key={item.name}
                        {...cardAnim(i)}
                        className="bg-white rounded-2xl p-5 cursor-default"
                        style={{ boxShadow: CARD_SHADOW }}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <IconBox icon={item.icon} color={item.color} bg={item.bg} />
                          <Badge label={item.tag} color={item.color} />
                        </div>
                        <div className="text-sm font-bold mb-1" style={{ color: 'var(--apple-text-primary)' }}>
                          {item.name}
                        </div>
                        <div className="text-xs" style={{ color: 'var(--apple-text-secondary)' }}>
                          {item.sub}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Divider: L3 → L2 */}
            <div className="flex">
              <div className="flex-shrink-0" style={{ width: LEFT_W }} />
              <div className="flex-1 pl-10 pr-10">
                <LayerDivider
                  up={ko ? '인사이트 제공' : 'Insights Provided'}
                  down={ko ? '데이터 수집' : 'Data Collection'}
                  colorTop={L3}
                  colorBottom={L2}
                />
              </div>
            </div>

            {/* ════════════════ LAYER 2 ════════════════ */}
            <div className="mb-2">
              <div className="flex items-center mb-5" style={{ minHeight: 56 }}>
                <div
                  className="flex-shrink-0 relative flex flex-col justify-center text-right pr-8"
                  style={{ width: LEFT_W, minHeight: 56 }}
                >
                  <div
                    className="text-[11px] font-bold tracking-[0.15em] uppercase"
                    style={{ color: L2 }}
                  >
                    LAYER 2
                  </div>
                  <div className="text-base font-bold mt-0.5" style={{ color: 'var(--apple-text-primary)' }}>
                    {ko ? '도메인 솔루션 레이어' : 'Domain Solution Layer'}
                  </div>
                  <div
                    className="text-[11px] mt-1 leading-snug"
                    style={{ color: 'var(--apple-text-secondary)' }}
                  >
                    {ko ? '도메인 솔루션' : 'Domain Solution'}
                  </div>
                  <Dot color={L2} />
                </div>
                <div className="flex-1 pl-10 pr-10" />
              </div>
              {/* Cards row */}
              <div className="flex">
                <div className="flex-shrink-0" style={{ width: LEFT_W }} />
                <div className="flex-1 pl-10 pr-10 pb-10">
                  <div className="grid grid-cols-4 gap-3">
                    {layer2.map((item, i) => (
                      <motion.div
                        key={item.name}
                        {...cardAnim(i)}
                        className="bg-white rounded-2xl p-5 cursor-default"
                        style={{ boxShadow: CARD_SHADOW }}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <IconBox icon={item.icon} color={item.color} bg={item.bg} />
                          <Badge label={item.tag} color={item.color} />
                        </div>
                        <div className="text-sm font-bold mb-3" style={{ color: 'var(--apple-text-primary)' }}>
                          {item.name}
                        </div>
                        <div className="flex flex-wrap gap-1.5 mb-3">
                          {item.modules.map(m => (
                            <ModulePill key={m} label={m} color={item.color} />
                          ))}
                        </div>
                        <div className="text-[11px] leading-snug flex gap-1.5" style={{ color: '#6E6E73' }}>
                          <span className="flex-shrink-0 mt-[1px]">•</span>
                          <span>{item.desc}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Divider: L2 → L1 */}
            <div className="flex">
              <div className="flex-shrink-0" style={{ width: LEFT_W }} />
              <div className="flex-1 pl-10 pr-10">
                <LayerDivider
                  up={ko ? '기능 활용' : 'Feature Usage'}
                  down={ko ? '플랫폼 지원' : 'Platform Support'}
                  colorTop={L2}
                  colorBottom={L1}
                />
              </div>
            </div>

            {/* ════════════════ LAYER 1 — header only (line ends here) ════════════════ */}
            <div className="flex items-center" style={{ minHeight: 56 }}>
              <div
                className="flex-shrink-0 relative flex flex-col justify-center text-right pr-8"
                style={{ width: LEFT_W, minHeight: 56 }}
              >
                <div
                  className="text-[11px] font-bold tracking-[0.15em] uppercase"
                  style={{ color: L1 }}
                >
                  LAYER 1
                </div>
<div className="text-base font-bold mt-0.5" style={{ color: 'var(--apple-text-primary)' }}>
                {ko ? '위즈팩토리 플랫폼' : 'WizFactory Platform'}
              </div>
              <div
                className="text-[11px] mt-1 leading-snug"
                style={{ color: 'var(--apple-text-secondary)' }}
              >
                  {ko ? '위즈팩토리 플랫폼' : 'WizFactory Platform'}
                </div>
                <Dot color={L1} />
              </div>
              <div className="flex-1 pl-10 pr-10" />
            </div>
          </div>
          {/* ── Line wrapper ends here — LAYER 1 cards are outside ── */}

          {/* LAYER 1 cards */}
          <div className="flex mt-5 mb-2">
            <div className="flex-shrink-0" style={{ width: LEFT_W }} />
            <div className="flex-1 pl-10 pr-10 pb-6">
              <div className="grid grid-cols-5 gap-3">
                {layer1.map((item, i) => (
                  <motion.div
                    key={item.name}
                    {...cardAnim(i)}
                    className="bg-white rounded-2xl p-5 flex flex-col items-center text-center cursor-default"
                    style={{ boxShadow: CARD_SHADOW }}
                  >
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center mb-3"
                      style={{ background: item.bg }}
                    >
                      <item.icon color={item.color} />
                    </div>
<div className="text-sm font-bold mb-3" style={{ color: 'var(--apple-text-primary)' }}>
                    {item.name}
                  </div>
                  <Badge label={item.tag} color={item.color} />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Mobile: stacked cards ──────────────────────────────────── */}
        <div className="md:hidden space-y-8">

          {/* Layer 3 — mobile */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 rounded-full" style={{ background: L3 }} />
              <span
                className="text-[10px] font-bold tracking-widest uppercase"
                style={{ color: L3 }}
              >
                LAYER 3
              </span>
              <span className="text-sm font-bold" style={{ color: 'var(--apple-text-primary)' }}>
                {ko ? '운영 및 인사이트 레이어' : 'Operations & Insight Layer'}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {layer3.map(item => (
                <div
                  key={item.name}
                  className="bg-white rounded-2xl p-4"
                  style={{ boxShadow: CARD_SHADOW }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <IconBox icon={item.icon} color={item.color} bg={item.bg} size={40} />
                    <Badge label={item.tag} color={item.color} />
                  </div>
                  <div className="text-sm font-bold" style={{ color: 'var(--apple-text-primary)' }}>
                    {item.name}
                  </div>
                  <div className="text-xs mt-0.5" style={{ color: 'var(--apple-text-secondary)' }}>
                    {item.sub}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <LayerDivider
            up={ko ? '인사이트 제공' : 'Insights'}
            down={ko ? '데이터 수집' : 'Data'}
            colorTop={L3}
            colorBottom={L2}
          />

          {/* Layer 2 — mobile */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 rounded-full" style={{ background: L2 }} />
              <span
                className="text-[10px] font-bold tracking-widest uppercase"
                style={{ color: L2 }}
              >
                LAYER 2
              </span>
              <span className="text-sm font-bold" style={{ color: 'var(--apple-text-primary)' }}>
                {ko ? '도메인 솔루션 레이어' : 'Domain Solution Layer'}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {layer2.map(item => (
                <div
                  key={item.name}
                  className="bg-white rounded-2xl p-4"
                  style={{ boxShadow: CARD_SHADOW }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <IconBox icon={item.icon} color={item.color} bg={item.bg} size={40} />
                    <Badge label={item.tag} color={item.color} />
                  </div>
                  <div className="text-sm font-bold mb-2" style={{ color: 'var(--apple-text-primary)' }}>
                    {item.name}
                  </div>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {item.modules.map(m => (
                      <ModulePill key={m} label={m} color={item.color} />
                    ))}
                  </div>
                  <div className="text-[11px]" style={{ color: '#6E6E73' }}>
                    • {item.desc}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <LayerDivider
            up={ko ? '기능 활용' : 'Feature Usage'}
            down={ko ? '플랫폼 지원' : 'Support'}
            colorTop={L2}
            colorBottom={L1}
          />

          {/* Layer 1 — mobile */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 rounded-full" style={{ background: L1 }} />
              <span
                className="text-[10px] font-bold tracking-widest uppercase"
                style={{ color: L1 }}
              >
                LAYER 1
              </span>
              <span className="text-sm font-bold" style={{ color: 'var(--apple-text-primary)' }}>
                {ko ? '위즈팩토리 플랫폼' : 'WizFactory Platform'}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {layer1.map(item => (
                <div
                  key={item.name}
                  className="bg-white rounded-2xl p-4 flex flex-col items-center text-center"
                  style={{ boxShadow: CARD_SHADOW }}
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-2"
                    style={{ background: item.bg }}
                  >
                    <item.icon color={item.color} />
                  </div>
                  <div className="text-xs font-bold mb-2" style={{ color: 'var(--apple-text-primary)' }}>
                    {item.name}
                  </div>
                  <Badge label={item.tag} color={item.color} />
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}