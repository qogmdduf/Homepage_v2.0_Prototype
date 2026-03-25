import { motion, useInView } from 'motion/react';
import { useRef } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

// ─── Animated Industry Icons ─────────────────────────────────────────────────

/** Electronics / Semiconductor — chip scan line sweeping over circuit board */
const ElectronicsIcon = () => (
  <svg viewBox="0 0 48 48" fill="none" className="w-8 h-8">
    {/* PCB base */}
    <rect x="8" y="8" width="32" height="32" rx="3" stroke="#0071E3" strokeWidth="1.8" fill="none" opacity="0.25"/>
    {/* Center chip */}
    <rect x="18" y="18" width="12" height="12" rx="1.5" stroke="#0071E3" strokeWidth="1.8" fill="none"/>
    <rect x="21" y="21" width="6" height="6" rx="0.8" fill="#0071E3" opacity="0.35"/>
    {/* Pins left */}
    <line x1="8" y1="22" x2="18" y2="22" stroke="#0071E3" strokeWidth="1.4" strokeLinecap="round" opacity="0.5"/>
    <line x1="8" y1="26" x2="18" y2="26" stroke="#0071E3" strokeWidth="1.4" strokeLinecap="round" opacity="0.5"/>
    {/* Pins right */}
    <line x1="30" y1="22" x2="40" y2="22" stroke="#0071E3" strokeWidth="1.4" strokeLinecap="round" opacity="0.5"/>
    <line x1="30" y1="26" x2="40" y2="26" stroke="#0071E3" strokeWidth="1.4" strokeLinecap="round" opacity="0.5"/>
    {/* Pins top */}
    <line x1="22" y1="8" x2="22" y2="18" stroke="#0071E3" strokeWidth="1.4" strokeLinecap="round" opacity="0.5"/>
    <line x1="26" y1="8" x2="26" y2="18" stroke="#0071E3" strokeWidth="1.4" strokeLinecap="round" opacity="0.5"/>
    {/* Pins bottom */}
    <line x1="22" y1="30" x2="22" y2="40" stroke="#0071E3" strokeWidth="1.4" strokeLinecap="round" opacity="0.5"/>
    <line x1="26" y1="30" x2="26" y2="40" stroke="#0071E3" strokeWidth="1.4" strokeLinecap="round" opacity="0.5"/>
    {/* Scan line */}
    <motion.rect
      x="8" y="0" width="32" height="2" rx="1"
      fill="#0071E3" opacity="0.55"
      animate={{ y: [8, 38, 8] }}
      transition={{ repeat: Infinity, duration: 2.4, ease: 'linear' }}
    />
  </svg>
);

/** Battery — charge level bar rising with spark */
const BatteryIcon = () => (
  <svg viewBox="0 0 48 48" fill="none" className="w-8 h-8">
    {/* Battery body */}
    <rect x="6" y="14" width="34" height="20" rx="3" stroke="#34C759" strokeWidth="1.8" fill="none"/>
    {/* Battery terminal */}
    <rect x="40" y="20" width="4" height="8" rx="1.5" fill="#34C759" opacity="0.5"/>
    {/* Animated fill */}
    <motion.rect
      x="9" y="17" height="14" rx="1.5" fill="#34C759" opacity="0.85"
      animate={{ width: [4, 28, 4] }}
      transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
    />
    {/* Bolt */}
    <motion.path
      d="M26 18 L21 25 H25 L22 30 L29 22 H25 Z"
      fill="white"
      animate={{ opacity: [0, 1, 0] }}
      transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut', delay: 0.8 }}
    />
  </svg>
);

/** Automotive — wheel spinning + chassis outline */
const AutomotiveIcon = () => (
  <svg viewBox="0 0 48 48" fill="none" className="w-8 h-8">
    {/* Car body silhouette */}
    <path
      d="M6 30 L6 26 Q6 24 8 24 L14 24 L18 17 Q19 16 21 16 L28 16 Q30 16 31 17 L35 24 L40 24 Q42 24 42 26 L42 30 Q42 32 40 32 L8 32 Q6 32 6 30 Z"
      stroke="#FF9500" strokeWidth="1.8" fill="none"
    />
    {/* Windshield */}
    <path d="M20 24 L18.5 18.5 Q19 17.5 20.5 17.5 L27.5 17.5 Q29 17.5 29.5 18.5 L28 24 Z"
      fill="#FF9500" opacity="0.15"/>
    {/* Left wheel */}
    <circle cx="14" cy="33" r="4.5" stroke="#FF9500" strokeWidth="1.8" fill="none"/>
    <motion.circle cx="14" cy="33" r="2"
      stroke="#FF9500" strokeWidth="1.2" fill="none"
      animate={{ rotate: [0, 360] }}
      transition={{ repeat: Infinity, duration: 1.6, ease: 'linear' }}
      style={{ transformOrigin: '14px 33px' }}
    />
    {/* Right wheel */}
    <circle cx="34" cy="33" r="4.5" stroke="#FF9500" strokeWidth="1.8" fill="none"/>
    <motion.circle cx="34" cy="33" r="2"
      stroke="#FF9500" strokeWidth="1.2" fill="none"
      animate={{ rotate: [0, 360] }}
      transition={{ repeat: Infinity, duration: 1.6, ease: 'linear' }}
      style={{ transformOrigin: '34px 33px' }}
    />
    {/* Speed lines */}
    <motion.g
      animate={{ opacity: [0, 0.7, 0], x: [-4, 0, -4] }}
      transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
    >
      <line x1="2" y1="25" x2="7" y2="25" stroke="#FF9500" strokeWidth="1.2" strokeLinecap="round"/>
      <line x1="1" y1="28" x2="5" y2="28" stroke="#FF9500" strokeWidth="1" strokeLinecap="round"/>
      <line x1="2" y1="31" x2="6" y2="31" stroke="#FF9500" strokeWidth="1.2" strokeLinecap="round"/>
    </motion.g>
  </svg>
);

/** Manufacturing — robotic arm arc motion */
const ManufacturingIcon = () => {
  return (
    <svg viewBox="0 0 48 48" fill="none" className="w-8 h-8">
      {/* Base platform */}
      <rect x="18" y="40" width="12" height="3" rx="1.5" fill="#7B61FF" opacity="0.5"/>
      <rect x="21" y="37" width="6" height="4" rx="1" fill="#7B61FF" opacity="0.35"/>
      {/* Arm segments */}
      <motion.g
        animate={{ rotate: [-25, 25, -25] }}
        transition={{ repeat: Infinity, duration: 2.4, ease: 'easeInOut' }}
        style={{ transformOrigin: '24px 37px' }}
      >
        {/* Lower arm */}
        <rect x="22.5" y="23" width="3" height="15" rx="1.5" fill="#7B61FF" opacity="0.7"/>
        {/* Elbow joint */}
        <circle cx="24" cy="23" r="2.5" fill="#7B61FF"/>
        <motion.g
          animate={{ rotate: [20, -20, 20] }}
          transition={{ repeat: Infinity, duration: 2.4, ease: 'easeInOut' }}
          style={{ transformOrigin: '24px 23px' }}
        >
          {/* Upper arm */}
          <rect x="22.5" y="11" width="3" height="13" rx="1.5" fill="#7B61FF" opacity="0.85"/>
          {/* Wrist joint */}
          <circle cx="24" cy="11" r="2.5" fill="#7B61FF"/>
          {/* Tool / claw */}
          <path d="M20 8 L24 11 L28 8" stroke="#7B61FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        </motion.g>
      </motion.g>
      {/* Work surface */}
      <line x1="6" y1="42" x2="42" y2="42" stroke="#7B61FF" strokeWidth="1.5" strokeLinecap="round" opacity="0.3"/>
      {/* Spark effect */}
      <motion.circle cx="24" cy="8" r="1.5"
        fill="#7B61FF"
        animate={{ opacity: [0, 1, 0], scale: [0.5, 1.5, 0.5] }}
        transition={{ repeat: Infinity, duration: 2.4, ease: 'easeInOut', delay: 0.4 }}
        style={{ transformOrigin: '24px 8px' }}
      />
    </svg>
  );
};

/** Semiconductor — wafer diffraction rings pulse */
const SemiconductorIcon = () => (
  <svg viewBox="0 0 48 48" fill="none" className="w-8 h-8">
    {/* Wafer outer */}
    <circle cx="24" cy="24" r="17" stroke="#5E5CE6" strokeWidth="1.8" fill="none" opacity="0.3"/>
    {/* Wafer inner rings */}
    <circle cx="24" cy="24" r="12" stroke="#5E5CE6" strokeWidth="1.2" fill="none" opacity="0.4"/>
    <circle cx="24" cy="24" r="7"  stroke="#5E5CE6" strokeWidth="1.2" fill="none" opacity="0.55"/>
    {/* Die grid lines */}
    <line x1="7" y1="24" x2="41" y2="24" stroke="#5E5CE6" strokeWidth="0.8" opacity="0.3"/>
    <line x1="24" y1="7" x2="24" y2="41" stroke="#5E5CE6" strokeWidth="0.8" opacity="0.3"/>
    <line x1="12" y1="12" x2="36" y2="36" stroke="#5E5CE6" strokeWidth="0.8" opacity="0.2"/>
    <line x1="36" y1="12" x2="12" y2="36" stroke="#5E5CE6" strokeWidth="0.8" opacity="0.2"/>
    {/* Center die */}
    <circle cx="24" cy="24" r="3.5" fill="#5E5CE6" opacity="0.7"/>
    {/* Scanning ring */}
    <motion.circle
      cx="24" cy="24"
      stroke="#5E5CE6" strokeWidth="1.8" fill="none"
      strokeDasharray="8 4"
      animate={{ r: [4, 16, 4], opacity: [1, 0, 1] }}
      transition={{ repeat: Infinity, duration: 2.8, ease: 'easeOut' }}
    />
  </svg>
);

// ─────────────────────────────────────────────────────────────────────────────

export function WizIndustries() {
  const { t, language } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { margin: '200px', once: false });
  
  const industries = [
    {
      id: 'electronics',
      name: language === 'ko' ? '전자·반도체' : 'Electronics',
      tag: language === 'ko' ? '핵심 산업' : 'Core Industry',
      description: language === 'ko'
        ? 'SMT 라인부터 반도체 FAB까지 품질·수율 통합 관리'
        : 'Unified quality & yield management from SMT to FAB.',
      color: '#0071E3',
      bg: 'rgba(0, 113, 227, 0.06)',
      border: 'rgba(0, 113, 227, 0.15)',
      IconComponent: ElectronicsIcon,
    },
    {
      id: 'battery',
      name: language === 'ko' ? '2차 전지' : 'Battery',
      tag: language === 'ko' ? '급성장 산업' : 'High Growth',
      description: language === 'ko'
        ? '전극·조립·화성 전 공정 실시간 트레이서빌리티'
        : 'Real-time traceability across electrode, assembly & formation.',
      color: '#34C759',
      bg: 'rgba(52, 199, 89, 0.06)',
      border: 'rgba(52, 199, 89, 0.15)',
      IconComponent: BatteryIcon,
    },
    {
      id: 'automotive',
      name: language === 'ko' ? '자동차' : 'Automotive',
      tag: language === 'ko' ? '전통 강세' : 'Established',
      description: language === 'ko'
        ? 'OEM·1차 협력사 품질 표준 및 IATF 16949 대응'
        : 'OEM & Tier-1 quality standards with IATF 16949 compliance.',
      color: '#FF9500',
      bg: 'rgba(255, 149, 0, 0.06)',
      border: 'rgba(255, 149, 0, 0.15)',
      IconComponent: AutomotiveIcon,
    },
    {
      id: 'manufacturing',
      name: language === 'ko' ? '일반 제조' : 'Manufacturing',
      tag: language === 'ko' ? '광범위 적용' : 'Wide Application',
      description: language === 'ko'
        ? '다품종 소량부터 대량 양산까지 유연한 MES 구성'
        : 'Flexible MES for high-mix low-volume to mass production.',
      color: '#7B61FF',
      bg: 'rgba(123, 97, 255, 0.06)',
      border: 'rgba(123, 97, 255, 0.15)',
      IconComponent: ManufacturingIcon,
    },
    {
      id: 'semiconductor',
      name: language === 'ko' ? '반도체 FAB' : 'Semiconductor',
      tag: language === 'ko' ? '고정밀 공정' : 'High Precision',
      description: language === 'ko'
        ? 'LOT 추적·설비 연동·SPC 기반 공정 이상 조기 감지'
        : 'LOT tracking, equipment integration & SPC-based anomaly detection.',
      color: '#5E5CE6',
      bg: 'rgba(94, 92, 230, 0.06)',
      border: 'rgba(94, 92, 230, 0.15)',
      IconComponent: SemiconductorIcon,
    },
  ];

  return (
    <section
      ref={sectionRef}
      id="industries"
      className="apple-section-gray relative overflow-clip py-32"
      data-bg-theme="light"
    >
      {/* Apple 스타일: 그레이 밴드 위에 아주 옅은 앰비언트(제품 페이지 톤) */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true" style={{ willChange: 'auto' }}>
        <div
          className="absolute left-0 top-0 h-[420px] w-[min(100%,720px)] rounded-full"
          style={{
            background: 'radial-gradient(ellipse 80% 60% at 0% 0%, rgba(0,113,227,0.045) 0%, transparent 72%)',
            transform: 'translate(-12%, -18%)',
          }}
        />
        <div
          className="absolute bottom-0 right-0 h-[380px] w-[min(100%,640px)] rounded-full"
          style={{
            background: 'radial-gradient(ellipse 75% 55% at 100% 100%, rgba(94,92,230,0.04) 0%, transparent 70%)',
            transform: 'translate(10%, 12%)',
          }}
        />
      </div>

      <div className="relative z-10 wiz-section">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2
            className="text-3xl md:text-5xl lg:text-6xl font-bold mb-5 tracking-tight"
            style={{ color: 'var(--apple-text-primary)' }}
          >
            {language === 'ko' ? '적용 산업' : 'Industries We Serve'}
          </h2>
          <p
            className="text-base md:text-xl lg:text-2xl font-normal max-w-2xl mx-auto"
            style={{ color: 'var(--apple-text-secondary)' }}
          >
            {language === 'ko'
              ? '대한민국 제조 핵심 산업 전반에 걸친 검증된 스마트팩토리 경험'
              : 'Proven smart factory expertise across Korea\'s key manufacturing sectors.'}
          </p>
        </motion.div>

        {/* Industry Cards — CSS hover instead of Framer whileHover for scroll perf */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-5">
          {industries.map((industry, index) => {
            const { IconComponent } = industry;
            return (
              <motion.div
                key={industry.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.07,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="group relative flex flex-col rounded-3xl p-6 md:p-7 cursor-default overflow-hidden transition-transform duration-300 ease-out hover:-translate-y-2"
                style={{
                  background: 'rgba(255,255,255,0.82)',
                  border: '1px solid rgba(255,255,255,0.90)',
                  boxShadow: '0 4px 24px rgba(0,0,0,0.06), 0 1px 0 rgba(255,255,255,0.9) inset',
                  willChange: 'transform, opacity',
                  contain: 'layout style paint',
                }}
              >
                {/* Tag */}
                <div className="mb-5">
                  <span
                    className="inline-flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded-full"
                    style={{
                      background: `linear-gradient(135deg, ${industry.color}22 0%, ${industry.color}12 100%)`,
                      border: `1.5px solid ${industry.color}50`,
                      color: industry.color,
                      letterSpacing: '0.05em',
                    }}
                  >
                    <span
                      className="inline-block w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{ background: industry.color }}
                    />
                    {industry.tag}
                  </span>
                </div>

                {/* Icon */}
                <div
                  className="mb-5 w-14 h-14 rounded-2xl flex items-center justify-center"
                  style={{
                    background: `linear-gradient(145deg, ${industry.color}28 0%, ${industry.color}14 100%)`,
                    border: `1.5px solid ${industry.color}55`,
                  }}
                >
                  {isInView && <IconComponent />}
                </div>

                {/* Name */}
                <h3
                  className="text-base md:text-lg font-bold mb-2 tracking-tight"
                  style={{ color: 'var(--apple-text-primary)' }}
                >
                  {industry.name}
                </h3>

                {/* Description */}
                <p className="text-xs md:text-sm leading-relaxed" style={{ color: '#6E6E73' }}>
                  {industry.description}
                </p>

                {/* Bottom accent line */}
                <div
                  className="absolute bottom-0 left-0 right-0 h-[2.5px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-b-3xl"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${industry.color}90, transparent)`,
                  }}
                />
              </motion.div>
            );
          })}
        </div>

        {/* Stats bar */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "0px 0px -60px 0px", amount: 0.1 }}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
            },
          }}
          className="mt-16 relative"
        >
          {/* Decorative gradient blobs behind the stats card — no filter:blur */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl" aria-hidden="true">
            <div
              className="absolute -top-12 -left-10 w-96 h-64 rounded-full"
              style={{ background: 'radial-gradient(ellipse, rgba(0,113,227,0.15) 0%, transparent 60%)' }}
            />
            <div
              className="absolute -bottom-8 left-1/3 w-80 h-56 rounded-full"
              style={{ background: 'radial-gradient(ellipse, rgba(94,92,230,0.12) 0%, transparent 60%)' }}
            />
            <div
              className="absolute -top-6 right-12 w-72 h-56 rounded-full"
              style={{ background: 'radial-gradient(ellipse, rgba(48,209,88,0.10) 0%, transparent 60%)' }}
            />
            <div
              className="absolute bottom-0 -right-6 w-64 h-48 rounded-full"
              style={{ background: 'radial-gradient(ellipse, rgba(255,159,10,0.12) 0%, transparent 60%)' }}
            />
          </div>

          {/* Stats card */}
          <motion.div
            variants={{
              hidden: {},
              visible: {
                transition: { staggerChildren: 0.07, delayChildren: 0.05 },
              },
            }}
            className="relative grid grid-cols-2 md:grid-cols-4 rounded-3xl overflow-hidden"
            style={{
              background: 'rgba(255,255,255,0.80)',
              border: '1px solid rgba(255,255,255,0.85)',
              boxShadow:
                '0 8px 40px rgba(0,0,0,0.08), 0 1.5px 0px rgba(255,255,255,0.9) inset, 0 -1px 0px rgba(0,0,0,0.04) inset',
            }}
          >
            {[
              {
                value: '200+',
                label: language === 'ko' ? '고객사' : 'Clients',
                sub: language === 'ko' ? '국내외 제조기업' : 'Manufacturers Worldwide',
                color: '#0071E3',
                glow: 'rgba(0,113,227,0.12)',
              },
              {
                value: '15+',
                label: language === 'ko' ? '업력' : 'Years',
                sub: language === 'ko' ? '스마트팩토리 전문' : 'Smart Factory Experience',
                color: '#5E5CE6',
                glow: 'rgba(94,92,230,0.12)',
              },
              {
                value: '98%',
                label: language === 'ko' ? '고객 만족도' : 'Satisfaction',
                sub: language === 'ko' ? '연간 유지 갱신율' : 'Annual Renewal Rate',
                color: '#30D158',
                glow: 'rgba(48,209,88,0.10)',
              },
              {
                value: '40%',
                label: language === 'ko' ? '평균 생산성 향상' : 'Avg. Productivity Gain',
                sub: language === 'ko' ? '도입 후 12개월 기준' : 'Within 12 months post-launch',
                color: '#FF9F0A',
                glow: 'rgba(255,159,10,0.10)',
              },
            ].map((stat, i) => (
              <motion.div
                key={i}
                variants={{
                  hidden: { opacity: 0, y: 10 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
                }}
                className="relative text-center py-10 px-6 group"
                style={{
                  borderRight: i < 3 ? '1px solid rgba(255,255,255,0.6)' : 'none',
                }}
              >
                {/* Accent dot */}
                <div
                  className="inline-block w-1.5 h-1.5 rounded-full mb-4"
                  style={{ background: stat.color }}
                />

                {/* Value */}
                <div
                  className="text-4xl md:text-5xl font-bold tracking-tight mb-2"
                  style={{
                    color: 'var(--apple-text-primary)',
                    letterSpacing: '-0.035em',
                  }}
                >
                  {stat.value}
                </div>

                {/* Label */}
                <div
                  className="text-sm font-semibold mb-1"
                  style={{ color: 'var(--apple-text-primary)' }}
                >
                  {stat.label}
                </div>

                {/* Sub */}
                <div
                  className="text-xs"
                  style={{ color: 'var(--apple-text-secondary)' }}
                >
                  {stat.sub}
                </div>

                {/* Bottom color accent line */}
                <div
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    width: 40,
                    height: 2,
                    background: stat.color,
                  }}
                />
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}