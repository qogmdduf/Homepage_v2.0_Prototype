import { motion } from 'motion/react';
import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const LIME = '#C8F135';
const CARD_BG = '#1C1C1E';

// ── Dashboard animated bar chart ─────────────────────────────────────────────
const BAR_COUNT = 10;

const DashboardBars = () => {
  const barsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    // 각 막대마다 고유한 사인파 파라미터 — 서로 다른 주파수·위상·진폭으로 유기적 움직임
    const params = Array.from({ length: BAR_COUNT }, (_, i) => ({
      phase:     (i / BAR_COUNT) * Math.PI * 2 + Math.random() * 0.8,
      freq:      0.65 + Math.random() * 0.60,   // 빠른 주파수
      amplitude: 22 + Math.random() * 26,        // 진폭 범위
      center:    42 + Math.random() * 20,        // 기준 높이 (42~62px)
    }));

    const startTime = performance.now();
    let rafId: number;

    const tick = (now: number) => {
      const t = (now - startTime) / 1000;
      barsRef.current.forEach((bar, i) => {
        if (!bar) return;
        const { phase, freq, amplitude, center } = params[i];
        const h = Math.max(8, center + Math.sin(t * freq + phase) * amplitude);
        bar.style.height = `${h}px`;
      });
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <div className="flex items-end gap-1.5 mt-6" style={{ height: 96 }}>
      {Array.from({ length: BAR_COUNT }, (_, i) => (
        <div
          key={i}
          ref={el => { barsRef.current[i] = el; }}
          className="flex-1 rounded-md"
          style={{
            height: 50,
            background: 'linear-gradient(to top, rgba(0,0,0,0.52), rgba(0,0,0,0.16))',
          }}
        />
      ))}
    </div>
  );
};

// ── Infinity SVG ──────────────────────────────────────────────────────────────
const InfinityIcon = () => (
  <svg
    width="80"
    height="40"
    viewBox="0 0 80 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M40 20 C40 20 34 8 24 8 C14 8 8 14 8 20 C8 26 14 32 24 32 C34 32 40 20 40 20 C40 20 46 8 56 8 C66 8 72 14 72 20 C72 26 66 32 56 32 C46 32 40 20 40 20 Z"
      stroke="#000000"
      strokeWidth="3.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </svg>
);

// ── Workflow node icon ────────────────────────────────────────────────────────
const WorkflowIcon = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none">
    <circle cx="5"  cy="12" r="2.5" stroke={LIME} strokeWidth="1.5"/>
    <circle cx="19" cy="5"  r="2.5" stroke={LIME} strokeWidth="1.5"/>
    <circle cx="19" cy="19" r="2.5" stroke={LIME} strokeWidth="1.5"/>
    <line x1="7.4"  y1="10.8" x2="16.8" y2="6.2"  stroke={LIME} strokeWidth="1.2" opacity="0.45" strokeLinecap="round"/>
    <line x1="7.4"  y1="13.2" x2="16.8" y2="17.8" stroke={LIME} strokeWidth="1.2" opacity="0.45" strokeLinecap="round"/>
    <motion.circle cx="5" cy="12" r="4.5" stroke={LIME} strokeWidth="1" fill="none"
      animate={{ r: [3.5, 6, 3.5], opacity: [0.6, 0, 0.6] }}
      transition={{ repeat: Infinity, duration: 2, ease: 'easeOut' }}
    />
  </svg>
);

// ── Bell icon ─────────────────────────────────────────────────────────────────
const BellIcon = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none">
    <motion.path
      d="M12 2C9.24 2 7 4.24 7 7v5l-2 2v1h14v-1l-2-2V7c0-2.76-2.24-5-5-5z"
      stroke={LIME} strokeWidth="1.5" fill="none"
      animate={{ rotate: [-10, 10, -10, 0] }}
      transition={{ repeat: Infinity, duration: 2.4, ease: 'easeInOut', repeatDelay: 1.5 }}
      style={{ transformOrigin: '12px 3px' }}
    />
    <path d="M10 17c0 1.1.9 2 2 2s2-.9 2-2" stroke={LIME} strokeWidth="1.5" fill="none"/>
  </svg>
);

// ── Report (file) icon ────────────────────────────────────────────────────────
const ReportIcon = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none">
    <path d="M4 2H15L20 7V22H4Z" stroke={LIME} strokeWidth="1.5" fill="none"/>
    <line x1="8" y1="11" x2="16" y2="11" stroke={LIME} strokeWidth="1" strokeLinecap="round" opacity="0.35"/>
    <motion.line x1="8" y1="11" x2="8" y2="11" stroke={LIME} strokeWidth="1" strokeLinecap="round"
      animate={{ x2: [8, 16, 8] }}
      transition={{ repeat: Infinity, duration: 2.6, ease: 'easeInOut', delay: 0.6 }}
    />
    <line x1="8" y1="14" x2="14" y2="14" stroke={LIME} strokeWidth="1" strokeLinecap="round" opacity="0.35"/>
    <line x1="8" y1="17" x2="11" y2="17" stroke={LIME} strokeWidth="1" strokeLinecap="round" opacity="0.35"/>
  </svg>
);

// ── Code / API icon ───────────────────────────────────────────────────────────
const APIIcon = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none">
    <polyline points="7,8 3,12 7,16"  stroke={LIME} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    <polyline points="17,8 21,12 17,16" stroke={LIME} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    <motion.line x1="14" y1="4" x2="10" y2="20" stroke={LIME} strokeWidth="1.6" strokeLinecap="round"
      animate={{ opacity: [1, 0.3, 1] }}
      transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
    />
  </svg>
);

// ── Icon wrapper ──────────────────────────────────────────────────────────────
const IconBox = ({ children }: { children: React.ReactNode }) => (
  <div
    className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
    style={{
      background: 'rgba(255,255,255,0.07)',
      border: '1px solid rgba(255,255,255,0.10)',
      boxShadow: `0 0 20px ${LIME}18`,
    }}
  >
    {children}
  </div>
);

// ── Badge ─────────────────────────────────────────────────────────────────────
const Badge = ({ label, lime = false, dark = false, outline = false }: { label: string; lime?: boolean; dark?: boolean; outline?: boolean }) => (
  <span
    className="text-[11px] font-bold px-3 py-1.5 rounded-lg"
    style={
      outline
        ? {
            background: 'rgba(200, 241, 53, 0.15)',
            color: LIME,
            border: `1.5px solid rgba(200, 241, 53, 0.35)`,
            letterSpacing: '0.04em',
          }
        : lime
        ? { background: LIME, color: '#000' }
        : dark
        ? { background: 'rgba(0,0,0,0.18)', color: '#000', border: '1px solid rgba(0,0,0,0.10)' }
        : {
            background: 'rgba(255,255,255,0.08)',
            color: '#aaa',
            border: '1px solid rgba(255,255,255,0.10)',
          }
    }
  >
    {label}
  </span>
);

// ── Section label ─────────────────────────────────────────────────────────────
const SectionLabel = ({ text, dark: darkLabel = false }: { text: string; dark?: boolean }) => (
  <p className="text-[11px] font-bold tracking-[0.14em] mb-3" style={{ color: darkLabel ? '#000' : '#555' }}>
    {text}
  </p>
);

// ─────────────────────────────────────────────────────────────────────────────

export function WizPlatformBento() {
  const { language } = useLanguage();
  const ko = language === 'ko';

  const alarmItems = ko
    ? [
        { dot: '#FF453A', text: '설비 이상 감지',  time: '방금' },
        { dot: '#FF9F0A', text: '리포트 생성 완료', time: '2m' },
        { dot: LIME,      text: 'API 연동 정상',   time: '5m' },
      ]
    : [
        { dot: '#FF453A', text: 'Equipment anomaly',  time: 'Now' },
        { dot: '#FF9F0A', text: 'Report generated',   time: '2m'  },
        { dot: LIME,      text: 'API connection OK',  time: '5m'  },
      ];

  const flowSteps = ko
    ? ['트리거', '조건', '승인', '완료']
    : ['Trigger', 'Condition', 'Approve', 'Done'];

  const stats = [
    {
      label:  ko ? '실시간 데이터 처리' : 'Real-time Processing',
      value:  '24',
      unit:   '/7',
      trend:  ko ? '↑ 가동 중' : '↑ Active',
    },
    {
      label:  ko ? '워크플로우 자동화율' : 'Workflow Automation',
      value:  '94',
      unit:   '%',
      trend:  ko ? '↑ +6% 이번 달' : '↑ +6% this month',
    },
    {
      label:  ko ? 'API 업타임' : 'API Uptime',
      value:  '99',
      unit:   '.9%',
      trend:  ko ? '↑ 정상 운영' : '↑ Operational',
    },
  ];

  const cardVariants = (delay = 0) => ({
    hidden: { opacity: 0, y: 22 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] as any },
    },
  });

  return (
    <section
      id="news"
      className="apple-section-dark relative scroll-mt-32 overflow-hidden py-28 md:py-36"
      data-bg-theme="dark"
    >
      <div className="relative z-10 wiz-section">

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '0px 0px -60px 0px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          <h2
            className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 tracking-tight text-white"
          >
            {ko ? '플랫폼 구성' : 'Platform Features'}
          </h2>
          <p className="text-base md:text-xl" style={{ color: '#666' }}>
            {ko
              ? '대시보드부터 API까지 — 하나의 플랫폼으로 연결'
              : 'From Dashboard to API — unified in one platform'}
          </p>
        </motion.div>

        {/* ── Bento grid ──────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4">

          {/* ① Dashboard — lime hero card */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '0px 0px -40px 0px' }}
            variants={cardVariants(0)}
            whileHover={{ y: -8, transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] } }}
            className="md:col-span-5 rounded-3xl p-7 flex flex-col justify-between relative overflow-hidden group"
            style={{ background: LIME, minHeight: 340 }}
          >
            {/* dark glow blob top-right on hover */}
            <div
              className="absolute -top-16 -right-16 w-48 h-48 rounded-full pointer-events-none transition-opacity duration-500 opacity-0 group-hover:opacity-40"
              style={{
                background: 'radial-gradient(ellipse, rgba(0,0,0,0.35) 0%, transparent 70%)',
                filter: 'blur(30px)',
              }}
            />

            {/* top badge */}
            <div className="flex justify-end">
              <Badge label={ko ? '위젯 기반' : 'Widget Based'} dark />
            </div>

            {/* content */}
            <div className="mt-4">
              <SectionLabel text={ko ? '대시보드' : 'DASHBOARD'} dark />
              <InfinityIcon />
              <h3
                className="text-2xl md:text-3xl font-bold mt-3 mb-2 tracking-tight"
                style={{ color: '#000' }}
              >
                {ko ? '자유도 높은 커스터마이징' : 'Highly Customizable'}
              </h3>
              <p className="text-sm" style={{ color: 'rgba(0,0,0,0.60)' }}>
                {ko
                  ? 'DB 직접 연결 · 위젯 자유 배치 · 사용자별 레이아웃'
                  : 'Direct DB · Free widget layout · Per-user config'}
              </p>
              <DashboardBars />
            </div>

            {/* Bottom accent line */}
            <div
              className="absolute bottom-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-b-3xl"
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(0,0,0,0.45), transparent)',
                boxShadow: '0 0 8px rgba(0,0,0,0.30)',
              }}
            />
          </motion.div>

          {/* ② Workflow — dark card */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '0px 0px -40px 0px' }}
            variants={cardVariants(0.07)}
            whileHover={{ y: -8, transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] } }}
            className="md:col-span-7 rounded-3xl p-7 flex flex-col justify-between relative overflow-hidden group"
            style={{ background: CARD_BG, minHeight: 340 }}
          >
            {/* subtle lime glow top-right — brightens on hover */}
            <div
              className="absolute -top-16 -right-16 w-48 h-48 rounded-full pointer-events-none transition-opacity duration-500 opacity-40 group-hover:opacity-80"
              style={{
                background: `radial-gradient(ellipse, ${LIME}55 0%, transparent 70%)`,
                filter: 'blur(30px)',
              }}
            />

            {/* top row */}
            <div className="flex items-start justify-between">
              <IconBox><WorkflowIcon /></IconBox>
              {/* live dot */}
              <motion.div
                className="w-2.5 h-2.5 rounded-full mt-1"
                style={{ background: LIME }}
                animate={{ opacity: [1, 0.3, 1], scale: [1, 1.3, 1] }}
                transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
              />
            </div>

            {/* text */}
            <div className="mt-5">
              <SectionLabel text={ko ? '워크플로우' : 'WORKFLOW'} />
              <h3 className="text-2xl md:text-3xl font-bold mb-2 text-white tracking-tight whitespace-pre-line">
                {ko ? '업무 프로세스\n자동화' : 'Business Process\nAutomation'}
              </h3>
              <p className="text-sm mb-8" style={{ color: '#777' }}>
                {ko
                  ? '조건 분기 · 승인 흐름 · 부서 간 협업 표준화'
                  : 'Conditional branching · Approval flows · Cross-dept standardization'}
              </p>

              {/* flow steps */}
              <div className="flex items-center gap-2 flex-wrap">
                {flowSteps.map((step, i) => (
                  <div key={step} className="flex items-center gap-2">
                    {i === 1 ? (
                      // 조건 — 입장 래퍼 + 깜빡임 분리
                      <motion.div
                        initial={{ opacity: 0, scale: 0.85 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.25 + i * 0.1, duration: 0.35 }}
                      >
                        <motion.span
                          animate={{ opacity: [1, 0.25, 1] }}
                          transition={{ repeat: Infinity, duration: 1.0, ease: 'easeInOut' }}
                          className="text-xs font-bold px-3.5 py-1.5 rounded-full inline-block"
                          style={{ background: LIME, color: '#000' }}
                        >
                          {step}
                        </motion.span>
                      </motion.div>
                    ) : (
                      <motion.span
                        initial={{ opacity: 0, scale: 0.85 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.25 + i * 0.1, duration: 0.35 }}
                        className="text-xs font-bold px-3.5 py-1.5 rounded-full"
                        style={
                          i === 0
                            ? { background: LIME, color: '#000' }
                            : {
                                background: 'rgba(255,255,255,0.07)',
                                color: '#ccc',
                                border: '1px solid rgba(255,255,255,0.10)',
                              }
                        }
                      >
                        {step}
                      </motion.span>
                    )}
                    {i < flowSteps.length - 1 && (
                      <span className="text-xs" style={{ color: '#444' }}>→</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom accent line */}
            <div
              className="absolute bottom-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-b-3xl"
              style={{
                background: `linear-gradient(90deg, transparent, ${LIME}90, transparent)`,
                boxShadow: `0 0 8px ${LIME}60`,
              }}
            />
          </motion.div>

          {/* ③ Alarm */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '0px 0px -40px 0px' }}
            variants={cardVariants(0.10)}
            whileHover={{ y: -8, transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] } }}
            className="md:col-span-4 rounded-3xl p-7 flex flex-col relative overflow-hidden group"
            style={{ background: CARD_BG, minHeight: 280 }}
          >
            {/* lime glow top-right */}
            <div
              className="absolute -top-10 -right-10 w-36 h-36 rounded-full pointer-events-none transition-opacity duration-500 opacity-30 group-hover:opacity-70"
              style={{
                background: `radial-gradient(ellipse, ${LIME}55 0%, transparent 70%)`,
                filter: 'blur(24px)',
              }}
            />
            <div className="flex items-start justify-between mb-5">
              <IconBox><BellIcon /></IconBox>
              <Badge label={ko ? '멀티 디바이스' : 'Multi Device'} outline />
            </div>
            <SectionLabel text={ko ? '알람' : 'ALARM'} />
            <h3 className="text-xl font-bold mb-5 text-white tracking-tight">
              {ko ? '실시간 알림' : 'Real-time Alerts'}
            </h3>
            <div className="flex flex-col gap-3 mt-auto">
              {alarmItems.map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <motion.div
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ background: item.dot }}
                      animate={{ boxShadow: [`0 0 0px ${item.dot}`, `0 0 7px ${item.dot}`, `0 0 0px ${item.dot}`] }}
                      transition={{ repeat: Infinity, duration: 2, delay: i * 0.4 }}
                    />
                    <span className="text-sm" style={{ color: '#ccc' }}>{item.text}</span>
                  </div>
                  <span className="text-xs" style={{ color: '#555' }}>{item.time}</span>
                </div>
              ))}
            </div>
            {/* Bottom accent line */}
            <div
              className="absolute bottom-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-b-3xl"
              style={{
                background: `linear-gradient(90deg, transparent, ${LIME}90, transparent)`,
                boxShadow: `0 0 8px ${LIME}60`,
              }}
            />
          </motion.div>

          {/* ④ Report */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '0px 0px -40px 0px' }}
            variants={cardVariants(0.15)}
            whileHover={{ y: -8, transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] } }}
            className="md:col-span-4 rounded-3xl p-7 flex flex-col relative overflow-hidden group"
            style={{ background: CARD_BG, minHeight: 280 }}
          >
            {/* lime glow top-right */}
            <div
              className="absolute -top-10 -right-10 w-36 h-36 rounded-full pointer-events-none transition-opacity duration-500 opacity-30 group-hover:opacity-70"
              style={{
                background: `radial-gradient(ellipse, ${LIME}55 0%, transparent 70%)`,
                filter: 'blur(24px)',
              }}
            />
            <div className="flex items-start justify-between mb-5">
              <IconBox><ReportIcon /></IconBox>
              <Badge label={ko ? '자동 메일링' : 'Auto Email'} outline />
            </div>
            <SectionLabel text={ko ? '리포트' : 'REPORT'} />
            <h3 className="text-xl font-bold text-white tracking-tight whitespace-pre-line">
              {ko ? '템플릿 기반\n자동 보고서' : 'Template-based\nAuto Reports'}
            </h3>

            <div className="mt-auto pt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs" style={{ color: '#666' }}>
                  {ko ? '이번 주 발송' : 'Sent this week'}
                </span>
                <span className="text-xs font-bold" style={{ color: LIME }}>78%</span>
              </div>
              <div
                className="w-full h-1.5 rounded-full overflow-hidden"
                style={{ background: 'rgba(255,255,255,0.07)' }}
              >
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: LIME }}
                  initial={{ width: 0 }}
                  whileInView={{ width: '78%' }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.1, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
            </div>
            {/* Bottom accent line */}
            <div
              className="absolute bottom-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-b-3xl"
              style={{
                background: `linear-gradient(90deg, transparent, ${LIME}90, transparent)`,
                boxShadow: `0 0 8px ${LIME}60`,
              }}
            />
          </motion.div>

          {/* ⑤ API */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '0px 0px -40px 0px' }}
            variants={cardVariants(0.20)}
            whileHover={{ y: -8, transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] } }}
            className="md:col-span-4 rounded-3xl p-7 flex flex-col relative overflow-hidden group"
            style={{ background: CARD_BG, minHeight: 280 }}
          >
            {/* lime glow top-right */}
            <div
              className="absolute -top-10 -right-10 w-36 h-36 rounded-full pointer-events-none transition-opacity duration-500 opacity-30 group-hover:opacity-70"
              style={{
                background: `radial-gradient(ellipse, ${LIME}55 0%, transparent 70%)`,
                filter: 'blur(24px)',
              }}
            />
            <div className="flex items-start justify-between mb-5">
              <IconBox><APIIcon /></IconBox>
              <Badge label={ko ? '모듈화' : 'Modular'} outline />
            </div>
            <SectionLabel text={ko ? 'API 연동' : 'API'} />
            <h3 className="text-xl font-bold mb-5 text-white tracking-tight whitespace-pre-line">
              {ko ? '어디서든\n연동 가능' : 'Connect\nAnywhere'}
            </h3>
            <div className="flex flex-col gap-2 mt-auto">
              {['ERP', 'MES'].map((sys, i) => (
                <div
                  key={sys}
                  className="flex items-center justify-between px-4 py-3 rounded-xl"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.08)',
                  }}
                >
                  <span className="text-sm font-medium" style={{ color: '#ccc' }}>
                    {sys} {ko ? '연동' : 'Integration'}
                  </span>
                  <motion.div
                    className="w-2 h-2 rounded-full"
                    style={{ background: LIME }}
                    animate={{ opacity: [1, 0.25, 1] }}
                    transition={{ repeat: Infinity, duration: 1.8, delay: i * 0.5 }}
                  />
                </div>
              ))}
            </div>
            {/* Bottom accent line */}
            <div
              className="absolute bottom-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-b-3xl"
              style={{
                background: `linear-gradient(90deg, transparent, ${LIME}90, transparent)`,
                boxShadow: `0 0 8px ${LIME}60`,
              }}
            />
          </motion.div>

          {/* ⑥ Stat cards */}
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '0px 0px -40px 0px' }}
              variants={cardVariants(0.22 + i * 0.06)}
              whileHover={{ y: -8, transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] } }}
              className="md:col-span-4 rounded-3xl p-7 flex flex-col justify-between relative overflow-hidden group"
              style={{
                background: CARD_BG,
                minHeight: 148,
                border: '1px solid rgba(255,255,255,0.05)',
              }}
            >
              {/* lime glow */}
              <div
                className="absolute -top-6 -right-6 w-28 h-28 rounded-full pointer-events-none transition-opacity duration-500 opacity-0 group-hover:opacity-60"
                style={{
                  background: `radial-gradient(ellipse, ${LIME}40 0%, transparent 70%)`,
                  filter: 'blur(20px)',
                }}
              />
              <p className="text-xs" style={{ color: '#555' }}>{stat.label}</p>
              <div className="flex items-baseline gap-0.5 mt-2">
                <span
                  className="text-5xl font-bold tracking-tight"
                  style={{ color: '#fff', letterSpacing: '-0.04em' }}
                >
                  {stat.value}
                </span>
                <span className="text-2xl font-bold" style={{ color: LIME }}>
                  {stat.unit}
                </span>
              </div>
              <p className="text-sm mt-1 font-medium" style={{ color: LIME }}>
                {stat.trend}
              </p>
              {/* Bottom accent line */}
              <div
                className="absolute bottom-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-b-3xl"
                style={{
                  background: `linear-gradient(90deg, transparent, ${LIME}90, transparent)`,
                  boxShadow: `0 0 8px ${LIME}60`,
                }}
              />
            </motion.div>
          ))}

        </div>
      </div>
    </section>
  );
}