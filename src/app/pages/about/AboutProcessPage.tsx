import React from 'react';
import { motion } from 'motion/react';
import {
  Search,
  Layers,
  Code2,
  Rocket,
  Settings,
  Users,
  MessageCircle,
  Shield,
  CheckCircle2,
  Clock,
  ChevronRight,
  GitBranch,
  MonitorDot,
  Zap,
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { getAboutSections } from '../../data/aboutSectionsContent';
import { AboutCtaBand } from '../../components/about/AboutPageUi';

/* ─── Phase visual config ────────────────────────────────────────────── */
const PHASE_ICONS = [Search, Layers, Code2, Rocket, Settings] as const;

const PHASE_COLORS = [
  { dot: 'bg-blue-500',   badge: 'bg-blue-50 text-blue-600',   line: 'from-blue-200'   },
  { dot: 'bg-violet-500', badge: 'bg-violet-50 text-violet-600', line: 'from-violet-200' },
  { dot: 'bg-emerald-500',badge: 'bg-emerald-50 text-emerald-600',line:'from-emerald-200'},
  { dot: 'bg-orange-500', badge: 'bg-orange-50 text-orange-600', line: 'from-orange-200' },
  { dot: 'bg-rose-500',   badge: 'bg-rose-50 text-rose-600',    line: 'from-rose-200'   },
] as const;

const DURATIONS_KO = ['1–2 주', '1–2 주', '4–12 주', '2–4 주', '상시'];
const DURATIONS_EN = ['1–2 wks', '1–2 wks', '4–12 wks', '2–4 wks', 'Ongoing'];

const DELIVERABLES_KO = [
  ['요구사항 명세서', '현장 진단 보고', '범위 · KPI 정의'],
  ['아키텍처 설계서', '일정 · 마일스톤', '리스크 관리계획'],
  ['소스코드 · CI/CD', '통합 테스트 결과', 'API 문서'],
  ['운영 교육 자료', '모니터링 대시보드', '인수인계 문서'],
  ['패치 · 업데이트 이력', 'SLA 리포트', '기능 고도화 로드맵'],
];

const DELIVERABLES_EN = [
  ['Requirements spec', 'Diagnostics report', 'Scope & KPIs'],
  ['Architecture design', 'Schedule & milestones', 'Risk plan'],
  ['Source & CI/CD', 'Integration tests', 'API docs'],
  ['Training materials', 'Monitoring dashboard', 'Handover docs'],
  ['Patch history', 'SLA reports', 'Feature roadmap'],
];

/* ─── Animation variants ─────────────────────────────────────────────── */
const fadeUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay, ease: 'easeOut' as const },
  },
});

/* ─── Component ──────────────────────────────────────────────────────── */
export function AboutProcessPage() {
  const { language } = useLanguage();
  const s = getAboutSections(language);
  const p = s.process;
  const isKo = language === 'ko';
  const openContact = () => window.dispatchEvent(new CustomEvent('openContactModal'));

  const durations    = isKo ? DURATIONS_KO    : DURATIONS_EN;
  const deliverables = isKo ? DELIVERABLES_KO : DELIVERABLES_EN;

  const COLLAB_CARDS = [
    {
      icon: Users,
      iconBg: 'bg-blue-500',
      chevronColor: 'text-blue-400',
      title: p.collabTitle,
      bullets: p.collabBullets,
    },
    {
      icon: MessageCircle,
      iconBg: 'bg-violet-500',
      chevronColor: 'text-violet-400',
      title: p.commTitle,
      bullets: p.commBullets,
    },
    {
      icon: Shield,
      iconBg: 'bg-emerald-500',
      chevronColor: 'text-emerald-400',
      title: p.qaTitle,
      bullets: p.qaBullets,
    },
  ] as const;

  const HIGHLIGHT_CARDS = [
    {
      icon: GitBranch,
      title: isKo ? '애자일 기반 개발' : 'Agile-first delivery',
      body: isKo
        ? '스프린트 단위 개발과 지속적 통합으로 변경에 빠르게 대응합니다.'
        : 'Sprint-based development with CI/CD for fast, reliable change delivery.',
    },
    {
      icon: MonitorDot,
      title: isKo ? '실시간 진행 공유' : 'Real-time transparency',
      body: isKo
        ? '대시보드와 이슈 트래커로 진행 상황을 언제든 확인할 수 있습니다.'
        : 'Dashboards and issue trackers keep every stakeholder in the loop.',
    },
    {
      icon: Zap,
      title: isKo ? 'SLA 기반 운영' : 'SLA-backed operations',
      body: isKo
        ? '명확한 응답·해결 기준으로 장애를 빠르게 처리하고 안정성을 유지합니다.'
        : 'Clear response and resolution SLAs ensure uptime and quick incident closure.',
    },
  ] as const;

  return (
    <>
      {/* ════════════════════════════════════════════════════════════
          SECTION 1 · HERO  (dark + aurora gradients)
      ════════════════════════════════════════════════════════════ */}
      <section className="apple-section-dark relative overflow-hidden">
        {/* Aurora blobs */}
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <div className="absolute -top-32 right-0 h-[28rem] w-[28rem] rounded-full bg-blue-600/20 blur-[120px]" />
          <div className="absolute bottom-0 -left-24 h-72 w-72 rounded-full bg-violet-600/15 blur-[100px]" />
          <div className="absolute top-1/2 left-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/10 blur-[80px]" />
        </div>

        <div className="wiz-section relative py-20 md:py-28 lg:py-32">
          {/* Eyebrow */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-3 text-[11px] font-bold uppercase tracking-[0.16em] text-blue-400"
          >
            {p.eyebrow}
          </motion.p>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.08 }}
            className="max-w-2xl whitespace-pre-line text-[length:var(--text-display-md)] font-bold leading-[var(--leading-tight)] tracking-[var(--tracking-tight)] text-white md:text-[length:var(--text-display-lg)]"
          >
            {p.title}
          </motion.h1>

          {/* Lead */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.16 }}
            className="mt-5 max-w-xl text-[length:var(--text-body-lg)] leading-[var(--leading-relaxed)] text-white/60"
          >
            {p.lead}
          </motion.p>

          {/* Stats strip */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.28 }}
            className="mt-12 flex flex-wrap gap-x-10 gap-y-4 border-t border-white/10 pt-8"
          >
            {(isKo
              ? [
                  { value: '5',     label: '단계 프로세스' },
                  { value: 'Agile', label: '개발 방식' },
                  { value: 'SLA',   label: '기반 운영' },
                  { value: 'ISO',   label: '9001 · 14001' },
                ]
              : [
                  { value: '5',     label: 'Phase process' },
                  { value: 'Agile', label: 'Development' },
                  { value: 'SLA',   label: 'Based ops' },
                  { value: 'ISO',   label: '9001 · 14001' },
                ]
            ).map((stat) => (
              <div key={stat.value + stat.label}>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="mt-0.5 text-xs text-white/45">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          SECTION 2 · 5-STEP TIMELINE  (white)
      ════════════════════════════════════════════════════════════ */}
      <section className="apple-section-white">
        <div className="wiz-section py-16 md:py-24">
          {/* Section header */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            variants={fadeUp(0)}
            className="mb-14"
          >
            <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--apple-text-secondary)]">
              {isKo ? 'HOW IT WORKS' : 'HOW IT WORKS'}
            </p>
            <h2 className="text-[length:var(--text-display-sm)] font-bold tracking-[var(--tracking-tight)] text-[var(--apple-text-primary)]">
              {isKo ? '단계별 진행 로드맵' : 'Step-by-step roadmap'}
            </h2>
          </motion.div>

          {/* Timeline */}
          <div className="relative">
            {/* Vertical line (desktop) */}
            <div
              className="pointer-events-none absolute left-6 top-0 hidden h-full w-px bg-gradient-to-b from-slate-200 via-slate-200/50 to-transparent md:block"
              aria-hidden
            />

            <div className="space-y-6 md:space-y-8">
              {p.phases.map((phase, i) => {
                const Icon = PHASE_ICONS[i];
                const color = PHASE_COLORS[i];
                return (
                  <motion.div
                    key={i}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    variants={fadeUp(i * 0.08)}
                    className="relative md:pl-20"
                  >
                    {/* Timeline dot (desktop) */}
                    <div
                      className={`absolute left-0 top-6 hidden size-12 -translate-y-1/2 items-center justify-center rounded-full shadow-lg md:flex ${color.dot}`}
                    >
                      <Icon className="size-5 text-white" />
                    </div>

                    {/* Card */}
                    <div className="group rounded-2xl border border-black/[0.06] bg-white p-6 shadow-[0_2px_12px_rgba(0,0,0,0.05)] transition-shadow duration-300 hover:shadow-[0_8px_32px_rgba(0,0,0,0.1)] md:p-8">
                      <div className="flex flex-wrap items-start gap-4">
                        {/* Mobile icon */}
                        <div
                          className={`flex shrink-0 md:hidden size-10 items-center justify-center rounded-xl ${color.dot}`}
                        >
                          <Icon className="size-5 text-white" />
                        </div>

                        <div className="flex-1 min-w-0">
                          {/* Step number + duration */}
                          <div className="mb-2 flex flex-wrap items-center gap-2">
                            <span className="text-[11px] font-bold tracking-[0.12em] text-[var(--apple-text-tertiary)]">
                              {String(i + 1).padStart(2, '0')}
                            </span>
                            <span
                              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${color.badge}`}
                            >
                              <Clock className="size-3" />
                              {durations[i]}
                            </span>
                          </div>

                          {/* Title */}
                          <h3 className="text-lg font-bold text-[var(--apple-text-primary)] md:text-xl">
                            {phase.title}
                          </h3>

                          {/* Description */}
                          <p className="mt-2 text-sm leading-relaxed text-[var(--apple-text-secondary)]">
                            {phase.body}
                          </p>

                          {/* Deliverables */}
                          <div className="mt-5">
                            <p className="mb-2.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--apple-text-tertiary)]">
                              {isKo ? '주요 산출물' : 'Key deliverables'}
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {deliverables[i].map((item) => (
                                <span
                                  key={item}
                                  className="inline-flex items-center gap-1.5 rounded-lg border border-black/[0.06] bg-[var(--apple-bg-primary)] px-3 py-1 text-xs text-[var(--apple-text-secondary)]"
                                >
                                  <CheckCircle2 className="size-3 shrink-0 text-emerald-500" />
                                  {item}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Process reference image */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeUp(0.1)}
            className="mt-16 overflow-hidden rounded-2xl border border-black/[0.06] shadow-[0_4px_24px_rgba(0,0,0,0.08)]"
          >
            <img
              src={p.image}
              alt={p.imageAlt}
              className="w-full object-cover"
              loading="lazy"
            />
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          SECTION 3 · HIGHLIGHT CARDS  (dark)
      ════════════════════════════════════════════════════════════ */}
      <section className="apple-section-dark relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <div className="absolute -bottom-24 right-0 h-80 w-80 rounded-full bg-blue-600/10 blur-[100px]" />
        </div>

        <div className="wiz-section relative py-16 md:py-24">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            variants={fadeUp(0)}
            className="mb-12"
          >
            <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.14em] text-blue-400">
              {isKo ? 'PRINCIPLES' : 'PRINCIPLES'}
            </p>
            <h2 className="text-[length:var(--text-display-sm)] font-bold tracking-[var(--tracking-tight)] text-white">
              {isKo ? '위즈팩토리가 일하는 방식' : 'How WIZFACTORY delivers'}
            </h2>
          </motion.div>

          <div className="grid gap-4 md:grid-cols-3">
            {HIGHLIGHT_CARDS.map((card, i) => {
              const CardIcon = card.icon;
              return (
                <motion.div
                  key={card.title}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.3 }}
                  variants={fadeUp(i * 0.1)}
                  className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-6 backdrop-blur-sm"
                >
                  <div className="mb-4 flex size-10 items-center justify-center rounded-xl bg-white/10">
                    <CardIcon className="size-5 text-white" />
                  </div>
                  <h3 className="mb-2 font-semibold text-white">{card.title}</h3>
                  <p className="text-sm leading-relaxed text-white/55">{card.body}</p>
                </motion.div>
              );
            })}
          </div>

          {/* Technology image */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeUp(0.2)}
            className="mt-12 overflow-hidden rounded-2xl border border-white/[0.08]"
          >
            <img
              src="/about/20250901/sections/06-technology/01-page-08.png"
              alt={isKo ? '기술 아키텍처' : 'Technology architecture'}
              className="w-full object-cover"
              loading="lazy"
            />
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          SECTION 4 · COLLABORATION PILLARS  (gray)
      ════════════════════════════════════════════════════════════ */}
      <section className="apple-section-gray">
        <div className="wiz-section py-16 md:py-24">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            variants={fadeUp(0)}
            className="mb-12"
          >
            <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--apple-text-secondary)]">
              {isKo ? 'COLLABORATION' : 'COLLABORATION'}
            </p>
            <h2 className="text-[length:var(--text-display-sm)] font-bold tracking-[var(--tracking-tight)] text-[var(--apple-text-primary)]">
              {isKo ? '함께 일하는 방식' : 'How we work together'}
            </h2>
          </motion.div>

          <div className="grid gap-4 md:grid-cols-3">
            {COLLAB_CARDS.map((card, i) => {
              const CardIcon = card.icon;
              return (
                <motion.div
                  key={card.title}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.3 }}
                  variants={fadeUp(i * 0.1)}
                  className="rounded-2xl border border-black/[0.06] bg-white p-6 shadow-sm"
                >
                  <div className={`mb-4 flex size-10 items-center justify-center rounded-xl ${card.iconBg}`}>
                    <CardIcon className="size-5 text-white" />
                  </div>
                  <h3 className="mb-3 font-semibold text-[var(--apple-text-primary)]">{card.title}</h3>
                  <ul className="space-y-2.5">
                    {card.bullets.map((x) => (
                      <li
                        key={x}
                        className="flex items-start gap-2 text-sm leading-relaxed text-[var(--apple-text-secondary)]"
                      >
                        <ChevronRight
                          className={`mt-0.5 size-4 shrink-0 ${card.chevronColor}`}
                        />
                        {x}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          SECTION 5 · CTA BAND
      ════════════════════════════════════════════════════════════ */}
      <AboutCtaBand
        title={s.cta.title}
        primaryLabel={s.cta.button}
        secondaryLabel={s.cta.secondary}
        onPrimary={openContact}
        secondaryTo="/about/contact"
      />
    </>
  );
}
