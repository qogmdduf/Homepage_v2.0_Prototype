import { useState } from 'react';
import { Link } from 'react-router';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { getAboutSections } from '../../data/aboutSectionsContent';
import { Button } from '../../components/ui/button';

/* ── 사업 영역 카드 데이터 (Toss 사업부 확장 카드 구조) ─────────────────────── */
const bizAreas = {
  ko: [
    {
      id: 'mes',
      tag: 'WizMES',
      title: '제조 실행 시스템',
      summary: '생산 실적·공정 추적·실시간 모니터링을 하나로.',
      body: '현장 생산 데이터를 실시간으로 수집해 계획 대비 실적을 가시화하고, 병목과 이상을 즉시 감지합니다. 대기업 전사 MES 프로젝트 경험을 바탕으로 설계했습니다.',
      href: '/about/services',
    },
    {
      id: 'flow',
      tag: 'WizFlow',
      title: '생산 흐름 최적화',
      summary: 'UPH·물동량·인원 배분을 데이터로 설계합니다.',
      body: '시뮬레이션 기반 생산 흐름 분석으로 교차 생산, 자원 배분, 병목 제거까지 지원합니다. 경험 의존적이던 계획 수립을 데이터 중심으로 전환합니다.',
      href: '/about/services',
    },
    {
      id: 'quality',
      tag: 'WizFact',
      title: '품질 · 데이터 관리',
      summary: '불량 추적, KPI, 문서 관리를 단일 흐름으로.',
      body: '품질 결산·대시보드·규정 준수를 하나의 시스템에서 관리합니다. 특허 등록 품질 결산 솔루션으로 KPI 가시화와 반복 개선 사이클을 구현합니다.',
      href: '/about/services',
    },
    {
      id: 'facility',
      tag: 'ESD · EOS',
      title: '설비 · 환경 모니터링',
      summary: '설비 상태와 환경 데이터를 실시간으로 파악합니다.',
      body: 'ESD·EOS 모니터링, 진공 시스템, 순찰 시스템을 포함한 설비·환경 영역을 커버합니다. 가동률·에너지 분석으로 예측 유지보수를 지원합니다.',
      href: '/about/services',
    },
    {
      id: 'vision',
      tag: 'AI Vision',
      title: 'AI · 머신비전 검사',
      summary: '학습 기반 자동화 검사로 클레임 리스크를 줄입니다.',
      body: '냉장고 도어 부품 누락, 고무 소재 정위치 등 고객사 맞춤 비전 파이프라인을 구축합니다. 수작업·샘플링 검사를 데이터 기반 자동화로 전환합니다.',
      href: '/about/cases',
    },
    {
      id: 'platform',
      tag: 'Platform',
      title: 'IoT 플랫폼 · 협업',
      summary: '현장 데이터를 클라우드와 연결하는 게이트웨이.',
      body: '산업용 IoT 게이트웨이와 클라우드 플랫폼으로 생산·품질·설비·인력 데이터를 통합합니다. 부서 간 협업 속도를 높이고 데이터 기반 의사결정을 지원합니다.',
      href: '/about/services',
    },
    {
      id: 'custom',
      tag: 'Custom',
      title: '프로젝트 · 커스텀 개발',
      summary: '고객 현장에 맞춘 맞춤 시스템 구축·운영.',
      body: '레거시 유지보수부터 전사 신규 시스템까지, 고객 환경에 맞는 맞춤 개발을 제공합니다. LG CNS 1차 파트너로서 대기업 전사 프로젝트 수행 경험을 바탕으로 합니다.',
      href: '/about/cases',
    },
  ],
  en: [
    {
      id: 'mes',
      tag: 'WizMES',
      title: 'Manufacturing Execution',
      summary: 'Production results, tracking, and real-time monitoring — unified.',
      body: 'Capture plant data in real time to visualize plan vs. actual, and detect anomalies instantly. Designed from enterprise-wide MES project experience.',
      href: '/about/services',
    },
    {
      id: 'flow',
      tag: 'WizFlow',
      title: 'Production Flow Optimization',
      summary: 'UPH, logistics, and staffing — planned with data.',
      body: 'Simulation-driven flow analysis covering cross-production, resource allocation, and bottleneck removal. Shift tacit planning to data-driven decisions.',
      href: '/about/services',
    },
    {
      id: 'quality',
      tag: 'WizFact',
      title: 'Quality & Data Management',
      summary: 'Defect tracking, KPIs, and documents in one flow.',
      body: 'Quality settlement, dashboards, and compliance — managed in a single system. Our patented quality settlement solution delivers KPI visibility and repeatable improvement cycles.',
      href: '/about/services',
    },
    {
      id: 'facility',
      tag: 'ESD · EOS',
      title: 'Facility & Environment Monitoring',
      summary: 'Real-time visibility into equipment health and environment.',
      body: 'Covers ESD/EOS monitoring, vacuum systems, and patrol systems. Uptime and energy analytics to support predictive maintenance.',
      href: '/about/services',
    },
    {
      id: 'vision',
      tag: 'AI Vision',
      title: 'AI & Machine Vision Inspection',
      summary: 'Learning-based automated inspection to reduce claim risk.',
      body: 'Custom vision pipelines for door-part omission and rubber positioning. Convert manual sampling to data-driven automated inspection.',
      href: '/about/cases',
    },
    {
      id: 'platform',
      tag: 'Platform',
      title: 'IoT Platform & Collaboration',
      summary: 'Gateway connecting plant data to the cloud.',
      body: 'Industrial IoT gateways and cloud platforms integrate production, quality, asset, and HR data. Accelerate cross-team collaboration and data-backed decisions.',
      href: '/about/services',
    },
    {
      id: 'custom',
      tag: 'Custom',
      title: 'Project & Custom Development',
      summary: 'Tailored systems built and operated for your plant.',
      body: 'From legacy maintenance to enterprise greenfield systems. Backed by LG CNS tier-1 partnership and large-scale project experience.',
      href: '/about/cases',
    },
  ],
};

const statItems = {
  ko: [
    { value: '2022', label: '설립' },
    { value: '20+', label: '대기업 현장 경험(년)' },
    { value: '3+', label: '보유 특허' },
    { value: '6+', label: '인증 · 수상' },
  ],
  en: [
    { value: '2022', label: 'Founded' },
    { value: '20+', label: 'Years enterprise experience' },
    { value: '3+', label: 'Patents held' },
    { value: '6+', label: 'Certifications & awards' },
  ],
};

/* ── 확장형 카드 (Toss 사업부 카드) ─────────────────────────────────────────── */
function BizCard({
  area,
  isOpen,
  onToggle,
  lang,
}: {
  area: (typeof bizAreas.ko)[number];
  isOpen: boolean;
  onToggle: () => void;
  lang: 'ko' | 'en';
}) {
  return (
    <div
      className={`cursor-pointer overflow-hidden rounded-2xl border transition-all duration-300 ${
        isOpen
          ? 'border-white/15 bg-white/[0.08]'
          : 'border-white/[0.07] bg-white/[0.04] hover:bg-white/[0.06]'
      }`}
      onClick={onToggle}
      role="button"
      tabIndex={0}
      onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && onToggle()}
      aria-expanded={isOpen}
    >
      <div className="flex items-center justify-between px-6 py-5">
        <div className="flex min-w-0 items-center gap-4">
          <span className="shrink-0 rounded-full border border-[var(--brand-red)]/40 bg-[var(--brand-red)]/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-[var(--brand-red)]">
            {area.tag}
          </span>
          <div className="min-w-0">
            <p className="truncate text-base font-semibold text-white">{area.title}</p>
            {!isOpen && (
              <p className="mt-0.5 truncate text-sm text-white/45">{area.summary}</p>
            )}
          </div>
        </div>
        <ChevronDown
          className={`ml-4 size-5 shrink-0 text-white/35 transition-transform duration-300 ${isOpen ? 'rotate-180 text-white/60' : ''}`}
        />
      </div>
      <div
        className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-[220px] opacity-100' : 'max-h-0 opacity-0'}`}
        aria-hidden={!isOpen}
      >
        <div className="border-t border-white/[0.07] px-6 pb-6 pt-5">
          <p className="mb-5 text-[15px] leading-[1.75] text-white/65">{area.body}</p>
          <Link
            to={area.href}
            onClick={e => e.stopPropagation()}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--brand-red)] hover:underline"
          >
            {lang === 'ko' ? '자세히 보기' : 'Learn more'}
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ── 메인 컴포넌트 ────────────────────────────────────────────────────────── */
export function AboutHubPage() {
  const { language } = useLanguage();
  const ko = language === 'ko';
  const s = getAboutSections(language);
  const areas = bizAreas[language];
  const stats = statItems[language];
  const [openId, setOpenId] = useState<string | null>(null);
  const openContact = () => window.dispatchEvent(new CustomEvent('openContactModal'));

  const toggle = (id: string) => setOpenId(prev => (prev === id ? null : id));

  return (
    <>
      {/* ══ 1. 풀스크린 히어로 (다크) ══════════════════════════════════════ */}
      <section className="relative flex min-h-[100svh] flex-col overflow-hidden bg-[#0a0a0c]">
        {/* 배경 그라디언트 레이어 */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background: [
              'radial-gradient(ellipse 100% 70% at 15% -5%, rgba(179,7,16,0.20) 0%, transparent 52%)',
              'radial-gradient(ellipse 65% 55% at 85% 105%, rgba(0,113,227,0.10) 0%, transparent 48%)',
            ].join(','),
          }}
        />

        {/* 히어로 콘텐츠 */}
        <div className="relative flex flex-1 flex-col justify-center px-4 md:px-6 lg:px-8 py-24 md:py-32 max-w-[1440px] mx-auto w-full">
          <p className="mb-5 text-[10px] font-bold uppercase tracking-[0.24em] text-[var(--brand-red)]">
            {ko ? '주식회사 위즈팩토리' : 'WIZFACTORY Co., Ltd.'}
          </p>
          <h1 className="mb-8 max-w-3xl text-[clamp(2.2rem,6vw,4.25rem)] font-bold leading-[1.12] tracking-[-0.03em] text-white">
            {s.storyLanding.heroLines[0]}
            <br />
            <span className="text-white/80">{s.storyLanding.heroLines[1]}</span>
          </h1>
          <p className="mb-12 max-w-lg text-[clamp(1rem,1.8vw,1.15rem)] leading-[1.75] text-white/55">
            {s.storyLanding.heroSub}
          </p>
          <div className="flex flex-wrap gap-3">
            <Button
              size="lg"
              className="rounded-full bg-white px-8 text-[var(--apple-text-primary)] hover:bg-white/90"
              onClick={openContact}
            >
              {ko ? '문의하기' : 'Contact us'}
              <ArrowRight className="size-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-full border-white/20 bg-transparent px-8 text-white hover:bg-white/10"
              asChild
            >
              <Link to="/about/company">{ko ? '회사 개요' : 'Company overview'}</Link>
            </Button>
          </div>
        </div>

        {/* 미션 글래스모픽 카드 */}
        <div className="relative px-4 md:px-6 lg:px-8 max-w-[1440px] mx-auto w-full pb-16 md:pb-20">
          <div
            className="rounded-2xl border border-white/[0.09] px-8 py-8 backdrop-blur-md md:px-12 md:py-10"
            style={{
              background:
                'linear-gradient(135deg, rgba(255,255,255,0.065) 0%, rgba(255,255,255,0.02) 100%)',
              boxShadow:
                '0 0 0 1px rgba(255,255,255,0.055), 0 20px 64px rgba(0,0,0,0.35)',
            }}
          >
            <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--brand-red)]">
              {s.storyLanding.missionLabel}
            </p>
            <p className="text-[clamp(1rem,2.4vw,1.4rem)] font-semibold leading-[1.65] text-white/88 md:max-w-3xl">
              {s.storyLanding.missionBody}
            </p>
          </div>
        </div>

        {/* 스크롤 힌트 */}
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-5 left-1/2 flex -translate-x-1/2 flex-col items-center gap-1.5 opacity-30"
        >
          <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white">scroll</span>
          <div className="h-7 w-px bg-gradient-to-b from-white/70 to-transparent" />
        </div>
      </section>

      {/* ══ 2. 핵심 통계 띠 ═══════════════════════════════════════════════ */}
      <section className="bg-[#111114]">
        <div className="wiz-section">
          <div className="grid grid-cols-2 divide-x divide-y divide-white/[0.06] overflow-hidden rounded-none md:grid-cols-4 md:divide-y-0">
            {stats.map((item, i) => (
              <div
                key={i}
                className="flex flex-col items-center justify-center px-6 py-10 text-center"
              >
                <p className="text-[clamp(1.9rem,4.5vw,2.75rem)] font-bold tracking-tight text-white">
                  {item.value}
                </p>
                <p className="mt-2 text-[11px] font-medium text-white/40">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ 3. WizFactory가 바꾸는 제조 (Toss 사업부 확장 카드) ══════════ */}
      <section className="bg-[#0d0d0f] py-20 md:py-28">
        <div className="wiz-section">
          <div className="mb-12 max-w-xl">
            <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--brand-red)]">
              SOLUTIONS
            </p>
            <h2 className="text-[clamp(1.7rem,4vw,2.6rem)] font-bold leading-[1.18] tracking-tight text-white">
              {ko ? 'WizFactory가\n바꾸는 제조' : 'Manufacturing\nWizFactory will change'}
            </h2>
            <p className="mt-4 text-[14px] leading-[1.75] text-white/45">
              {ko
                ? '현장 데이터 수집부터 전사 협업까지, 제조 디지털 전환의 각 영역을 담당합니다.'
                : 'From plant data capture to enterprise-wide collaboration — every domain of manufacturing digital transformation.'}
            </p>
          </div>

          <div className="space-y-2">
            {areas.map(area => (
              <BizCard
                key={area.id}
                area={area}
                isOpen={openId === area.id}
                onToggle={() => toggle(area.id)}
                lang={language}
              />
            ))}
          </div>

          <div className="mt-8">
            <Link
              to="/about/services"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-white/40 hover:text-white/70 transition-colors"
            >
              {ko ? '서비스 전체 보기' : 'View all services'}
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ══ 4. 핵심 가치 ═══════════════════════════════════════════════════ */}
      <section className="border-t border-white/[0.04] bg-[#111114] py-20 md:py-28">
        <div className="wiz-section">
          <div className="mb-12">
            <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--brand-red)]">
              VALUES
            </p>
            <h2 className="text-[clamp(1.7rem,4vw,2.4rem)] font-bold leading-[1.2] tracking-tight text-white">
              {ko ? '어떻게 일하는가' : 'How we work'}
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {s.vision.values.map((v, i) => (
              <div
                key={i}
                className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-8 transition-colors hover:bg-white/[0.055]"
              >
                <div
                  className="mb-5 flex size-10 items-center justify-center rounded-xl text-sm font-bold text-white"
                  style={{ background: 'var(--brand-red)' }}
                >
                  {String(i + 1).padStart(2, '0')}
                </div>
                <h3 className="mb-3 text-base font-bold text-white">{v.title}</h3>
                <p className="text-[13px] leading-[1.8] text-white/50">{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ 5. 파트너 · 인증 띠 ═════════════════════════════════════════════ */}
      <section className="border-y border-white/[0.05] bg-[#0d0d0f] py-12">
        <div className="wiz-section">
          <p className="mb-6 text-[9px] font-bold uppercase tracking-[0.22em] text-white/25">
            {ko ? '주요 고객 · 파트너 · 인증' : 'Key clients · Partners · Certifications'}
          </p>
          <div className="flex flex-wrap gap-2">
            {['LG전자', 'LG CNS (1차 파트너)', 'LG이노텍', '자화전자', ...s.company.certifications].map(
              (name, i) => (
                <span
                  key={i}
                  className="rounded-full border border-white/[0.09] bg-white/[0.04] px-4 py-2 text-[13px] text-white/55"
                >
                  {name}
                </span>
              ),
            )}
          </div>
        </div>
      </section>

      {/* ══ 6. 상세 페이지 그리드 ════════════════════════════════════════════ */}
      <section className="bg-[#111114] py-20 md:py-24">
        <div className="wiz-section">
          <h2 className="mb-2 text-xl font-bold text-white md:text-2xl">
            {s.storyLanding.exploreTitle}
          </h2>
          <p className="mb-10 text-sm text-white/40">{s.storyLanding.exploreLead}</p>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {s.hub.cards.map(card => (
              <li key={card.path}>
                <Link
                  to={card.path}
                  className="group flex h-full flex-col rounded-2xl border border-white/[0.07] bg-white/[0.03] p-6 transition-all hover:border-white/[0.13] hover:bg-white/[0.06]"
                >
                  <span className="text-[15px] font-semibold text-white">{card.title}</span>
                  <span className="mt-2 flex-1 text-[13px] leading-relaxed text-white/40">
                    {card.desc}
                  </span>
                  <span className="mt-5 inline-flex items-center gap-1 text-[13px] font-medium text-[var(--brand-red)] opacity-70 group-hover:opacity-100 transition-opacity">
                    {ko ? '보기' : 'Open'}
                    <ArrowRight className="size-3.5" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ══ 7. CTA 밴드 ══════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-[#0a0a0c] py-20 md:py-28">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 80% 60% at 50% 115%, rgba(179,7,16,0.16) 0%, transparent 55%)',
          }}
        />
        <div className="relative wiz-section text-center">
          <h2 className="mb-4 text-[clamp(1.6rem,4vw,2.5rem)] font-bold tracking-tight text-white">
            {s.cta.title}
          </h2>
          <p className="mb-10 text-[15px] text-white/45">
            {ko
              ? '도입 상담부터 파트너십 제안까지, 먼저 연락해 주세요.'
              : 'From adoption consulting to partnership proposals — reach out first.'}
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button
              size="lg"
              className="rounded-full bg-white px-10 text-[var(--apple-text-primary)] hover:bg-white/90"
              onClick={openContact}
            >
              {s.cta.button}
              <ArrowRight className="size-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-full border-white/20 bg-transparent px-10 text-white hover:bg-white/10"
              asChild
            >
              <Link to="/#solutions">{s.cta.secondary}</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
