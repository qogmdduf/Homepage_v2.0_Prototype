/**
 * AboutCompanyPage — Apple-style · 9-section redesign
 * 01 Hero / Bento Metrics  02 CEO Message  03 Business Flow
 * 04 Organization Tabs     05 History      06 Location Map
 * 07 Partners Marquee      08 Certifications  09 Patents
 */

import { Link } from 'react-router';
import { useRef, useEffect, useState } from 'react';
import {
  motion,
  AnimatePresence,
  useInView,
  useMotionValue,
  useTransform,
  animate as motionAnimate,
} from 'motion/react';
import {
  MapPin, Award, FileCode2, Network, ChevronRight, ArrowRight,
  Database, BarChart2, MonitorDot, CheckCircle,
  Globe,
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { getAboutSections } from '../../data/aboutSectionsContent';
import { AboutCtaBand } from '../../components/about/AboutPageUi';
import { CompanyHistoryTimeline } from '../../components/about/CompanyHistoryTimeline';
import { cn } from '../../components/ui/utils';

/* ══════════════════════════════════════════
   CSS — Marquee keyframes (partners scroll)
══════════════════════════════════════════ */
const MARQUEE_CSS = `
  @keyframes wiz-marquee {
    from { transform: translateX(0); }
    to   { transform: translateX(-50%); }
  }
  .wiz-marquee-track { animation: wiz-marquee 28s linear infinite; }
  .wiz-marquee-track:hover { animation-play-state: paused; }
`;

/* ══════════════════════════════════════════
   유틸 컴포넌트
══════════════════════════════════════════ */

/** 스크롤 진입 fade-up 래퍼 */
function FadeUp({
  children, delay = 0, className,
}: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className={className}
    >{children}</motion.div>
  );
}

/** 섹션 헤더 */
function SectionHeader({ eyebrow, title, lead, center }: {
  eyebrow?: string; title: string; lead?: string; center?: boolean;
}) {
  return (
    <FadeUp className={cn('mb-12 md:mb-16', center && 'text-center mx-auto max-w-2xl')}>
      {eyebrow && (
        <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--brand-red)]">
          {eyebrow}
        </p>
      )}
      <h2 className="text-[clamp(1.75rem,4vw,2.75rem)] font-bold leading-[1.15] tracking-[-0.03em] text-[var(--apple-text-primary)]">
        {title}
      </h2>
      {lead && (
        <p className="mt-4 max-w-2xl text-[length:var(--text-body-lg)] leading-[1.75] text-[var(--apple-text-secondary)]">
          {lead}
        </p>
      )}
    </FadeUp>
  );
}

/** 숫자 카운트업 (motion/react useMotionValue) */
function CountUp({ to, suffix = '' }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v));

  useEffect(() => {
    if (inView) {
      motionAnimate(count, to, { duration: 1.8, ease: [0.16, 1, 0.3, 1] });
    }
  }, [inView, count, to]);

  return (
    <span ref={ref}>
      <motion.span>{rounded}</motion.span>{suffix}
    </span>
  );
}

/** CEO 헤드라인 특정 단어 브랜드 컬러 강조 */
function HighlightHeadline({ text, highlights }: { text: string; highlights: string[] }) {
  const regex = new RegExp(`(${highlights.join('|')})`, 'g');
  const parts = text.split(regex);
  return (
    <>
      {parts.map((part, i) =>
        highlights.includes(part)
          ? (
            <span key={i} className="inline bg-gradient-to-r from-[var(--brand-red)] to-[#ff5c5c] bg-clip-text text-transparent">
              {part}
            </span>
          )
          : <span key={i}>{part}</span>,
      )}
    </>
  );
}

/* ══════════════════════════════════════════
   데이터 헬퍼 (컴포넌트 밖 상수)
══════════════════════════════════════════ */

const CERT_META: Record<string, { cat: 'gov' | 'iso' | 'award'; year: string }> = {
  '벤처기업 확인':                    { cat: 'gov',   year: '2022' },
  'Venture company certification':   { cat: 'gov',   year: '2022' },
  'ISO 9001 / ISO 14001':            { cat: 'iso',   year: '2023' },
  '환경경영평가 엔트리':              { cat: 'iso',   year: '2023' },
  'Environmental management entry':  { cat: 'iso',   year: '2023' },
  '대한민국 지식경영대상(시스템 SW) 대상': { cat: 'award', year: '2023' },
  'Korea Knowledge Management Award':{ cat: 'award', year: '2023' },
  '대한민국 굿컴퍼니 스타트업 대상': { cat: 'award', year: '2024' },
  'Korea Good Company Startup Award':{ cat: 'award', year: '2024' },
  '경남지방중소벤처기업청장 표창':    { cat: 'gov',   year: '2024' },
  'KBBA Commissioner Citation':      { cat: 'gov',   year: '2024' },
};

const CERT_COLOR = {
  gov:   { bg: 'bg-[var(--brand-red)]/10',   icon: 'text-[var(--brand-red)]',  badge: 'bg-[var(--brand-red)]/[0.07] text-[var(--brand-red)]' },
  iso:   { bg: 'bg-[var(--apple-blue)]/10',  icon: 'text-[var(--apple-blue)]', badge: 'bg-[var(--apple-blue)]/[0.07] text-[var(--apple-blue)]' },
  award: { bg: 'bg-amber-50',                icon: 'text-amber-500',            badge: 'bg-amber-50 text-amber-600' },
};

/* ══════════════════════════════════════════
   메인 페이지
══════════════════════════════════════════ */
export function AboutCompanyPage() {
  const { language } = useLanguage();
  const ko = language === 'ko';
  const s = getAboutSections(language);
  const c = s.company;
  const openContact = () => window.dispatchEvent(new CustomEvent('openContactModal'));

  /* 조직도 탭 */
  const [orgTab, setOrgTab] = useState(0);

  /* 파트너 목록 */
  const partnerNames = ko
    ? ['LG전자', 'LG CNS', 'LG이노텍', '자화전자']
    : ['LG Electronics', 'LG CNS', 'LG Innotek', 'Jahwa Electronics'];

  /* 사업 흐름 단계 */
  const flowSteps = [
    { Icon: Database,    label: ko ? '데이터 수집' : 'Collect',   sub: ko ? 'MES · 설비 · 공정' : 'MES · equipment · process' },
    { Icon: BarChart2,   label: ko ? '분석 · 처리' : 'Analyze',   sub: ko ? 'AI · 머신비전' : 'AI · machine vision' },
    { Icon: MonitorDot,  label: ko ? '시각화' : 'Visualize',      sub: ko ? '대시보드 · 리포트' : 'Dashboard · report' },
    { Icon: CheckCircle, label: ko ? '의사결정' : 'Decide',       sub: ko ? '현장 · 경영 최적화' : 'Shop floor · management' },
  ];

  return (
    <>
      {/* ── CSS 주입 ── */}
      <style dangerouslySetInnerHTML={{ __html: MARQUEE_CSS }} />

      {/* ══════════════════════════════════════
          01. HERO / 핵심 정보 — Bento Metrics + CountUp
      ══════════════════════════════════════ */}
      <section id="summary" className="scroll-mt-[calc(var(--app-header-offset)+72px)] bg-white">
        <div className="wiz-section py-20 md:py-28">

          {/* 헤드라인 */}
          <FadeUp>
            <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--brand-red)]">{c.eyebrow}</p>
            <h1 className="mb-5 text-[clamp(2.75rem,8vw,5.5rem)] font-bold leading-[1.08] tracking-[-0.04em] text-[var(--apple-text-primary)]">
              {c.title}
            </h1>
            <p className="mb-10 max-w-2xl text-[length:var(--text-body-lg)] leading-[1.75] text-[var(--apple-text-secondary)]">
              {c.tagline}
            </p>
          </FadeUp>

          {/* 스토리 링크 */}
          <FadeUp delay={0.08}>
            <Link to="/about"
              className="mb-16 inline-flex items-center gap-2 rounded-full bg-[var(--brand-red)]/[0.06] px-5 py-2.5 text-sm font-semibold text-[var(--brand-red)] transition-colors hover:bg-[var(--brand-red)]/[0.1]"
            >
              {ko ? '회사 스토리 한눈에 보기' : 'Read the full story'}
              <ChevronRight className="size-3.5" />
            </Link>
          </FadeUp>

          {/* ── 핵심 수치 카운트업 스트립 ── */}
          <FadeUp delay={0.1} className="mb-8">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { value: 2022, suffix: '', label: ko ? '설립년도' : 'Founded' },
                { value: c.patents.length,       suffix: '+', label: ko ? '보유 특허' : 'Patents' },
                { value: c.certifications.length, suffix: '+', label: ko ? '인증·수상' : 'Certs & awards' },
                { value: partnerNames.length,    suffix: ko ? '개' : '', label: ko ? '주요 파트너' : 'Key partners' },
              ].map((m, i) => (
                <div key={i} className="rounded-2xl border border-black/[0.05] bg-[var(--apple-surface-gray)] px-5 py-6 text-center">
                  <p className="text-[clamp(2rem,5vw,3rem)] font-bold leading-none tracking-[-0.04em] text-[var(--apple-text-primary)]">
                    <CountUp to={m.value} suffix={m.suffix} />
                  </p>
                  <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--apple-text-tertiary)]">
                    {m.label}
                  </p>
                </div>
              ))}
            </div>
          </FadeUp>

          {/* ── 핵심 정보 Bento Grid ── */}
          <div className="mb-16 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {c.snapshotFacts.map((row, i) => (
              <FadeUp key={i} delay={0.04 * i}>
                <div className={cn(
                  'group relative overflow-hidden rounded-2xl border border-black/[0.06] bg-[var(--apple-surface-gray)] p-6',
                  'transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md',
                  i === 0 && 'sm:col-span-2 lg:col-span-1', // 설립 카드 강조
                )}>
                  <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--apple-text-tertiary)]">{row.label}</p>
                  <p className={cn('font-bold text-[var(--apple-text-primary)]', i === 0 ? 'text-2xl' : 'text-[1.05rem]')}>
                    {row.value}
                  </p>
                  <div aria-hidden className="pointer-events-none absolute -bottom-4 -right-4 size-16 rounded-full bg-[var(--brand-red)]/[0.04] transition-transform duration-300 group-hover:-translate-x-1 group-hover:-translate-y-1" />
                </div>
              </FadeUp>
            ))}
          </div>

          {/* Hero 이미지 */}
          <FadeUp delay={0.15}>
            <div className="overflow-hidden rounded-3xl border border-black/[0.05] bg-[var(--apple-surface-gray)] shadow-[0_12px_48px_rgba(0,0,0,0.07)]">
              <img src={c.heroImage} alt={c.heroImageAlt}
                className="h-[min(420px,52vw)] w-full object-contain object-center py-8"
                loading="lazy"
              />
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ══════════════════════════════════════
          02. 대표 인사말 — 핵심 단어 그라디언트 강조
      ══════════════════════════════════════ */}
      <section id="ceo-message" className="scroll-mt-[calc(var(--app-header-offset)+72px)] bg-[var(--apple-surface-gray)]">
        <div className="relative mx-auto grid max-w-[1600px] lg:min-h-[min(640px,85svh)] lg:grid-cols-[minmax(0,46%)_minmax(0,54%)] lg:items-stretch">

          {/* Portrait — bottom edge flush with section bottom (lg+) */}
          <div className="relative flex min-h-[260px] flex-col items-center justify-center px-8 pb-10 pt-12 sm:min-h-[300px] md:pt-16 lg:h-full lg:items-stretch lg:justify-end lg:pb-0 lg:pt-20 lg:px-12">
            <figure className="about-ceo-portrait-cutout relative z-10 mx-auto w-full max-w-[min(380px,88vw)] lg:mx-0 lg:max-w-[min(440px,44vw)]">
              <img
                src={c.ceoGreetingImage}
                alt={c.ceoGreetingImageAlt}
                className="about-ceo-portrait-cutout-img"
                loading="lazy"
                decoding="async"
              />
            </figure>
          </div>

          {/* Message */}
          <div className="relative flex flex-col justify-center px-8 py-16 lg:px-14 xl:px-20">
            <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--brand-red)]">{c.ceoGreetingTitle}</p>
            {/* 핵심 단어 그라디언트 강조 */}
            <h2 className="relative z-10 mb-8 max-w-xl whitespace-pre-line text-[clamp(1.4rem,2.8vw,2.1rem)] font-bold leading-[1.35] tracking-[-0.025em] text-[var(--apple-text-primary)]">
              <HighlightHeadline
                text={c.ceoGreetingHeadline}
                highlights={ko ? ['파트너', '현장', '경영'] : ['partner', 'floor', 'management']}
              />
            </h2>
            <div className="relative z-10 mb-10 max-w-[38rem] space-y-5 border-l-[3px] border-[var(--brand-red)]/20 pl-6 text-[length:var(--text-body-md)] leading-[1.85] text-[var(--apple-text-secondary)]">
              {c.ceoGreetingBody.split('\n\n').map((para, i) => <p key={i}>{para}</p>)}
            </div>
            <div className="relative z-10 flex flex-col border-t border-black/[0.07] pt-7 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold text-[var(--apple-text-tertiary)]">{c.ceoGreetingRole}</p>
                <p className="mt-1 text-xl font-bold tracking-tight text-[var(--apple-text-primary)]">{c.ceoGreetingName}</p>
              </div>
              <p className="mt-3 text-[11px] font-medium text-[var(--apple-text-tertiary)] sm:mt-0">
                {ko ? '주식회사 위즈팩토리' : 'WIZFACTORY Co., Ltd.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          03. 사업 개요 — 데이터 흐름 인포그래픽
      ══════════════════════════════════════ */}
      <section id="business" className="scroll-mt-[calc(var(--app-header-offset)+72px)] bg-[var(--apple-surface-gray)]">
        <div className="wiz-section py-20 md:py-28">
          <SectionHeader eyebrow="BUSINESS" title={c.businessTitle} lead={c.businessLead} />

          {/* 데이터 흐름 4단계 */}
          <FadeUp delay={0.08} className="mb-12">
            <div className="relative grid grid-cols-2 gap-3 md:grid-cols-4">
              {flowSteps.map(({ Icon, label, sub }, i) => (
                <div key={i} className="relative">
                  <div className="flex flex-col items-center rounded-2xl border border-black/[0.06] bg-white p-6 text-center shadow-sm transition-shadow hover:shadow-md">
                    <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-[var(--brand-red)]/[0.07]">
                      <Icon className="size-5 text-[var(--brand-red)]" />
                    </div>
                    <p className="mb-1 font-bold text-[var(--apple-text-primary)]">{label}</p>
                    <p className="text-[11px] text-[var(--apple-text-tertiary)]">{sub}</p>
                    {/* 스텝 번호 */}
                    <span className="absolute -top-2 left-3 flex size-5 items-center justify-center rounded-full bg-[var(--brand-red)] text-[10px] font-bold text-white">
                      {i + 1}
                    </span>
                  </div>
                  {/* 화살표 */}
                  {i < flowSteps.length - 1 && (
                    <div className="absolute -right-1.5 top-1/2 z-10 hidden -translate-y-1/2 md:block">
                      <ArrowRight className="size-3 text-[var(--apple-text-tertiary)]" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </FadeUp>

          {/* 키워드 칩 */}
          <FadeUp delay={0.12}>
            <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--apple-text-tertiary)]">
              {ko ? '핵심 기술 키워드' : 'Key technologies'}
            </p>
            <div className="flex flex-wrap gap-2">
              {c.businessKeywords.map((kw, i) => (
                <span key={i}
                  className="rounded-full border border-black/[0.08] bg-white px-4 py-2 text-sm font-medium text-[var(--apple-text-primary)] shadow-sm transition-shadow hover:shadow"
                >{kw}</span>
              ))}
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ══════════════════════════════════════
          04. 조직도 — Tabs + 솔루션 링크
      ══════════════════════════════════════ */}
      <section id="organization" className="scroll-mt-[calc(var(--app-header-offset)+72px)] bg-white">
        <div className="wiz-section py-20 md:py-28">
          <SectionHeader
            eyebrow="ORGANIZATION"
            title={c.orgChartTitle}
            lead={ko
              ? '대표이사 산하에 사업관리·개발·연구·디자인·지원 조직이 유기적으로 협업합니다.'
              : 'Teams collaborate under the CEO across management, engineering, research, design, and support.'}
          />

          {/* 탭 버튼 */}
          <FadeUp delay={0.05}>
            <div className="mb-8 flex flex-wrap gap-2">
              {c.orgLevels.map((level, i) => {
                const colors = [
                  'data-[active=true]:bg-[var(--brand-red)] data-[active=true]:text-white',
                  'data-[active=true]:bg-[var(--apple-blue)] data-[active=true]:text-white',
                  'data-[active=true]:bg-[#30d158] data-[active=true]:text-white',
                ];
                return (
                  <button key={i}
                    data-active={orgTab === i}
                    onClick={() => setOrgTab(i)}
                    className={cn(
                      'rounded-full border border-black/[0.08] px-5 py-2 text-sm font-semibold transition-all duration-200',
                      orgTab === i ? '' : 'bg-[var(--apple-surface-gray)] text-[var(--apple-text-secondary)] hover:bg-black/[0.05]',
                      colors[i % colors.length],
                    )}
                  >{level.title}</button>
                );
              })}
            </div>
          </FadeUp>

          {/* 탭 콘텐츠 (AnimatePresence) */}
          <AnimatePresence mode="wait">
            {c.orgLevels.map((level, i) => {
              if (i !== orgTab) return null;
              const accents = [
                { bg: 'bg-[var(--brand-red)]', ring: 'ring-[var(--brand-red)]/15', dot: 'var(--brand-red)' },
                { bg: 'bg-[var(--apple-blue)]', ring: 'ring-[var(--apple-blue)]/15', dot: 'var(--apple-blue)' },
                { bg: 'bg-[#30d158]',           ring: 'ring-[#30d158]/15',           dot: '#30d158' },
              ];
              const acc = accents[i % accents.length];
              return (
                <motion.div key={i}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                >
                  <div className={cn('rounded-2xl border border-black/[0.05] bg-[var(--apple-surface-gray)] p-8 ring-2', acc.ring)}>
                    <div className="mb-6 flex items-center gap-4">
                      <span className={cn('flex size-11 shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white', acc.bg)}>
                        0{i + 1}
                      </span>
                      <div>
                        <h3 className="text-xl font-bold text-[var(--apple-text-primary)]">{level.title}</h3>
                        <p className="text-[12px] text-[var(--apple-text-tertiary)]">{level.description}</p>
                      </div>
                    </div>
                    <ul className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                      {level.units.map((u, j) => (
                        <li key={j}
                          className="flex items-start gap-3 rounded-xl border border-black/[0.04] bg-white p-4 text-sm leading-snug text-[var(--apple-text-secondary)]"
                        >
                          <span className="mt-[0.35em] size-2 shrink-0 rounded-full" style={{ background: acc.dot }} />
                          {u}
                        </li>
                      ))}
                    </ul>
                    {/* 솔루션 바로가기 */}
                    {i === 1 && (
                      <div className="mt-6 border-t border-black/[0.06] pt-5">
                        <Link to="/about/services"
                          className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--apple-blue)] hover:underline underline-offset-2"
                        >
                          {ko ? '솔루션 상세 보기' : 'View our solutions'}
                          <ArrowRight className="size-3.5" />
                        </Link>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </section>

      {/* ══════════════════════════════════════
          05. 연혁 — 스크롤·연도 필터·카테고리 카드
      ══════════════════════════════════════ */}
      <section id="history" className="scroll-mt-[calc(var(--app-header-offset)+72px)] bg-[var(--apple-surface-gray)]">
        <div className="wiz-section py-20 md:py-28">
          <div className="relative mx-auto max-w-3xl">
            <CompanyHistoryTimeline entries={c.timeline} lang={ko ? 'ko' : 'en'} lead={c.historyLead} />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          06. 위치 — 지도 iframe 임베드
      ══════════════════════════════════════ */}
      <section id="location" className="scroll-mt-[calc(var(--app-header-offset)+72px)] bg-white">
        <div className="wiz-section py-20 md:py-28">
          <SectionHeader eyebrow="LOCATION" title={c.locationTitle} />

          <div className="grid gap-6 lg:grid-cols-2">
            {/* 주소 카드들 */}
            <FadeUp>
              <div className="space-y-4">
                {c.locations.map((loc, i) => (
                  <div key={i} className="rounded-2xl border border-black/[0.06] bg-[var(--apple-surface-gray)] p-7">
                    <div className="mb-4 flex items-center gap-3">
                      <div className="flex size-10 items-center justify-center rounded-xl bg-[var(--brand-red)]/10">
                        <MapPin className="size-5 text-[var(--brand-red)]" />
                      </div>
                      <p className="font-bold text-[var(--apple-text-primary)]">{loc.name}</p>
                    </div>
                    <p className="mb-4 text-sm leading-[1.75] text-[var(--apple-text-secondary)]">{loc.detail}</p>
                    <a
                      href={`https://map.kakao.com/link/search/${encodeURIComponent(loc.detail)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--apple-blue)] hover:underline underline-offset-2"
                    >
                      {ko ? '지도 열기' : 'Open map'}
                      <ArrowRight className="size-3.5" />
                    </a>
                  </div>
                ))}
                {/* 글로벌 지원 카드 */}
                <div className="rounded-2xl border border-[var(--apple-blue)]/20 bg-[var(--apple-blue)]/[0.04] p-7">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-[var(--apple-blue)]/10">
                      <Globe className="size-5 text-[var(--apple-blue)]" />
                    </div>
                    <p className="font-bold text-[var(--apple-text-primary)]">{ko ? '글로벌 지원' : 'Global support'}</p>
                  </div>
                  <p className="text-sm leading-[1.75] text-[var(--apple-text-secondary)]">{c.globalNote}</p>
                </div>
              </div>
            </FadeUp>

            {/* 지도 카드 — 네이버·카카오맵 CTA */}
            <FadeUp delay={0.1}>
              <div className="relative flex min-h-[320px] flex-col items-center justify-center overflow-hidden rounded-2xl border border-black/[0.06] bg-[var(--apple-surface-gray)] p-8 shadow-sm">
                {/* 배경 도트 그리드 */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 opacity-[0.35]"
                  style={{
                    backgroundImage:
                      'radial-gradient(circle, rgba(0,0,0,0.15) 1px, transparent 1px)',
                    backgroundSize: '24px 24px',
                  }}
                />
                {/* 브랜드 글로우 */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute left-1/2 top-1/2 size-48 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--brand-red)]/10 blur-3xl"
                />
                {/* 핀 아이콘 */}
                <div className="relative z-10 mb-5 flex size-14 items-center justify-center rounded-full border-2 border-[var(--brand-red)]/30 bg-white shadow-md">
                  <MapPin className="size-7 text-[var(--brand-red)]" />
                </div>
                {/* 주소 */}
                <p className="relative z-10 mb-1 text-center text-base font-bold text-[var(--apple-text-primary)]">
                  {ko ? '경남창원과학기술진흥원' : 'Gyeongnam Changwon S&T Promotion HQ'}
                </p>
                <p className="relative z-10 mb-8 max-w-xs text-center text-sm text-[var(--apple-text-secondary)]">
                  {c.locations[0]?.detail}
                </p>
                {/* 지도 앱 버튼 2개 */}
                <div className="relative z-10 flex flex-wrap justify-center gap-3">
                  <a
                    href={`https://map.kakao.com/link/search/${encodeURIComponent('경남창원과학기술진흥원')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-[#FEE500] px-5 py-2.5 text-sm font-bold text-[#3C1E1E] shadow-sm transition-opacity hover:opacity-90"
                  >
                    <MapPin className="size-3.5" />
                    {ko ? '카카오맵' : 'Kakao Maps'}
                  </a>
                  <a
                    href={`https://map.naver.com/p/search/${encodeURIComponent('경남창원과학기술진흥원')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-[#03C75A] px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-opacity hover:opacity-90"
                  >
                    <MapPin className="size-3.5" />
                    {ko ? '네이버 지도' : 'Naver Maps'}
                  </a>
                </div>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          07. 고객·파트너 — 로고 Marquee 무한 스크롤
      ══════════════════════════════════════ */}
      <section id="partners" className="scroll-mt-[calc(var(--app-header-offset)+72px)] bg-[var(--apple-surface-gray)]">
        <div className="wiz-section py-20 md:py-28">
          <SectionHeader
            eyebrow="PARTNERS & CLIENTS"
            title={c.partnersTitle}
            lead={c.partnersLead}
          />

          {/* Marquee 무한 스크롤 */}
          <FadeUp delay={0.08} className="mb-10">
            <div className="overflow-hidden rounded-2xl border border-black/[0.06] bg-white py-6 shadow-sm">
              <div className="wiz-marquee-track flex gap-6 whitespace-nowrap">
                {[...partnerNames, ...partnerNames].map((name, i) => (
                  <div key={i}
                    className="inline-flex shrink-0 items-center rounded-xl border border-black/[0.06] bg-[var(--apple-surface-gray)] px-7 py-4 text-base font-bold text-[var(--apple-text-primary)] shadow-sm"
                  >
                    {name}
                  </div>
                ))}
              </div>
            </div>
          </FadeUp>

          <FadeUp delay={0.12}>
            <Link to={c.partnersHref}
              className="inline-flex items-center gap-2 rounded-full bg-[var(--apple-blue)] px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              {c.partnersCta}
              <ArrowRight className="size-4" />
            </Link>
          </FadeUp>
        </div>
      </section>

      {/* ══════════════════════════════════════
          08. 인증·수상 — 카테고리 색상 + 연도 배지
      ══════════════════════════════════════ */}
      <section id="certifications" className="scroll-mt-[calc(var(--app-header-offset)+72px)] bg-white">
        <div className="wiz-section py-20 md:py-28">
          <SectionHeader eyebrow="CERTIFICATIONS & AWARDS" title={c.certTitle} />

          {/* 카테고리 범례 */}
          <FadeUp delay={0.05} className="mb-8 flex flex-wrap gap-3">
            {([
              { cat: 'gov',   label: ko ? '정부 인증' : 'Gov. certified', color: 'bg-[var(--brand-red)]/10 text-[var(--brand-red)]' },
              { cat: 'iso',   label: 'ISO',                               color: 'bg-[var(--apple-blue)]/10 text-[var(--apple-blue)]' },
              { cat: 'award', label: ko ? '수상' : 'Award',              color: 'bg-amber-50 text-amber-600' },
            ] as const).map(({ label, color }) => (
              <span key={label} className={cn('rounded-full px-3 py-1 text-xs font-bold', color)}>
                {label}
              </span>
            ))}
          </FadeUp>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {c.certifications.map((name, i) => {
              const meta = CERT_META[name] ?? { cat: 'gov' as const, year: '' };
              const col  = CERT_COLOR[meta.cat];
              return (
                <FadeUp key={i} delay={0.05 * i}>
                  <div className="flex items-start gap-4 rounded-2xl border border-black/[0.05] bg-[var(--apple-surface-gray)] p-5 transition-shadow hover:shadow-md">
                    <div className={cn('flex size-10 shrink-0 items-center justify-center rounded-xl', col.bg)}>
                      <Award className={cn('size-5', col.icon)} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold leading-snug text-[var(--apple-text-primary)]">{name}</p>
                      {meta.year && (
                        <span className={cn('mt-2 inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold', col.badge)}>
                          {meta.year}
                        </span>
                      )}
                    </div>
                  </div>
                </FadeUp>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          09. 특허·IP — 등록/출원 Badge + 수치 강조
      ══════════════════════════════════════ */}
      <section id="patents" className="scroll-mt-[calc(var(--app-header-offset)+72px)] bg-[var(--apple-surface-gray)]">
        <div className="wiz-section py-20 md:py-28">

          {/* 특허 수 대형 수치 */}
          <FadeUp className="mb-12 flex flex-col gap-2 md:flex-row md:items-end md:gap-10">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--brand-red)]">PATENTS & IP</p>
              <h2 className="text-[clamp(1.75rem,4vw,2.75rem)] font-bold leading-[1.15] tracking-[-0.03em] text-[var(--apple-text-primary)]">
                {c.patentsTitle}
              </h2>
            </div>
            <div className="flex items-baseline gap-1 rounded-2xl border border-[var(--brand-red)]/20 bg-[var(--brand-red)]/[0.04] px-6 py-4 md:ml-auto">
              <span className="text-[clamp(2.5rem,6vw,4rem)] font-bold leading-none tracking-[-0.04em] text-[var(--brand-red)]">
                <CountUp to={c.patents.length} suffix="+" />
              </span>
              <span className="text-sm font-semibold text-[var(--apple-text-secondary)]">
                {ko ? '보유 특허' : 'patents'}
              </span>
            </div>
          </FadeUp>

          <p className="mb-8 max-w-2xl text-sm leading-relaxed text-[var(--apple-text-secondary)]">{c.patentsLead}</p>

          <ol className="max-w-3xl space-y-4">
            {c.patents.map((p, i) => {
              const isRegistered = p.includes('등록');
              return (
                <FadeUp key={i} delay={0.07 * i}>
                  <li className="flex gap-5 rounded-2xl border border-black/[0.05] bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[var(--brand-red)]/10 text-sm font-bold text-[var(--brand-red)]">
                      0{i + 1}
                    </span>
                    <div className="flex flex-1 flex-wrap items-start gap-3">
                      <div className="flex-1">
                        <div className="mb-2 flex flex-wrap items-center gap-2">
                          <FileCode2 className="size-4 shrink-0 text-[var(--apple-text-tertiary)]" />
                          {/* 등록/출원 배지 */}
                          <span className={cn(
                            'rounded-full px-2.5 py-0.5 text-[10px] font-bold',
                            isRegistered
                              ? 'bg-emerald-50 text-emerald-600'
                              : 'bg-amber-50 text-amber-600',
                          )}>
                            {isRegistered ? (ko ? '등록' : 'Registered') : (ko ? '출원' : 'Filed')}
                          </span>
                        </div>
                        <p className="text-[length:var(--text-body-md)] leading-snug text-[var(--apple-text-primary)]">{p}</p>
                      </div>
                    </div>
                  </li>
                </FadeUp>
              );
            })}
          </ol>
        </div>
      </section>

      {/* CTA 밴드 */}
      <AboutCtaBand
        title={s.cta.title}
        primaryLabel={s.cta.button}
        secondaryLabel={s.cta.secondary}
        onPrimary={openContact}
        secondaryTo="/about/services"
      />
    </>
  );
}
