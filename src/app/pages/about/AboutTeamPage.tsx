import type { ReactNode } from 'react';
import { Link } from 'react-router';
import { motion, useReducedMotion } from 'motion/react';
import type { LucideIcon } from 'lucide-react';
import {
  ArrowRight,
  BriefcaseBusiness,
  Compass,
  GraduationCap,
  Handshake,
  Sparkles,
  Users2,
  Waypoints,
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { getAboutSections } from '../../data/aboutSectionsContent';
import { AboutCtaBand } from '../../components/about/AboutPageUi';
import { Button } from '../../components/ui/button';
import { cn } from '../../components/ui/utils';

const fadeUp = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-70px' },
  transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
};

const fadeUpStatic = {
  initial: { opacity: 1, y: 0 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-70px' },
  transition: { duration: 0 },
};

function GlassPanel({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        'rounded-[1.75rem] border border-white/70 bg-white/72 backdrop-blur-2xl',
        'shadow-[0_18px_50px_rgba(8,15,52,0.12)]',
        className,
      )}
      style={{
        boxShadow:
          '0 18px 50px rgba(8,15,52,0.12), inset 0 1px 0 rgba(255,255,255,0.9)',
      }}
    >
      {children}
    </div>
  );
}

function SignalBadge({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <GlassPanel className="px-5 py-4">
      <p className="text-[1.5rem] font-bold leading-none tracking-[var(--tracking-tight)] text-[var(--apple-text-primary)]">
        {value}
      </p>
      <p className="mt-2 text-[11px] font-semibold uppercase tracking-[var(--tracking-widest)] text-[var(--apple-text-tertiary)]">
        {label}
      </p>
    </GlassPanel>
  );
}

function PrincipleCard({
  index,
  title,
  body,
  caption,
  Icon,
}: {
  index: number;
  title: string;
  body: string;
  caption: string;
  Icon: LucideIcon;
}) {
  return (
    <GlassPanel className="flex h-full flex-col p-7 md:p-8">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold uppercase tracking-[var(--tracking-widest)] text-[var(--apple-text-tertiary)]">
          {String(index).padStart(2, '0')}
        </span>
        <div className="flex size-11 items-center justify-center rounded-2xl bg-[var(--apple-bg-primary)] text-[var(--brand-red)]">
          <Icon className="size-5" />
        </div>
      </div>
      <h3 className="mt-8 text-[1.3rem] font-bold tracking-[var(--tracking-snug)] text-[var(--apple-text-primary)]">
        {title}
      </h3>
      <p className="mt-3 flex-1 text-[length:var(--text-body-md)] leading-[var(--leading-relaxed)] text-[var(--apple-text-secondary)]">
        {body}
      </p>
      <p className="mt-6 text-sm font-medium text-[var(--brand-red)]">{caption}</p>
    </GlassPanel>
  );
}

export function AboutTeamPage() {
  const { language } = useLanguage();
  const reduceMotion = useReducedMotion();
  const s = getAboutSections(language);
  const t = s.team;
  const company = s.company;
  const ko = language === 'ko';
  const openContact = () => window.dispatchEvent(new CustomEvent('openContactModal'));
  const m = reduceMotion ? fadeUpStatic : fadeUp;

  const heroSignals = [
    {
      value: '20+',
      label: ko ? '엔터프라이즈 실행 경험' : 'Years of enterprise execution',
    },
    {
      value: ko ? 'One Team' : 'One Team',
      label: ko ? 'SW · 연구 · 디자인 협업' : 'SW, research, and design',
    },
    {
      value: ko ? 'Field-first' : 'Field-first',
      label: ko ? '현장 중심 커뮤니케이션' : 'Field-first communication',
    },
  ];

  const operatingPrinciples = [
    {
      title: ko ? '운영 정렬' : 'Operational alignment',
      body: t.cultureBullets[0],
      caption: ko ? '일정 · 자원 · 리스크를 같은 화면에서' : 'Schedule, resources, and risk move together',
      Icon: BriefcaseBusiness,
    },
    {
      title: ko ? '하나의 제품팀' : 'One product team',
      body: t.cultureBullets[1],
      caption: ko ? '기획부터 구현까지 하나의 완성도' : 'One level of quality from concept to ship',
      Icon: Users2,
    },
    {
      title: ko ? '현장 리듬' : 'Field rhythm',
      body: t.waysBullets[0],
      caption: ko ? '문제보다 먼저 맥락을 이해합니다' : 'Context first, then execution',
      Icon: Compass,
    },
    {
      title: ko ? '마일스톤 운영' : 'Milestone cadence',
      body: t.waysBullets[1],
      caption: ko ? '고객과 같은 속도로 의사결정' : 'Decisions move at the customer’s pace',
      Icon: Waypoints,
    },
  ];

  const growthCards = [
    {
      title: ko ? '성장 환경' : 'Growth environment',
      body: t.welfareBullets[0],
      Icon: GraduationCap,
    },
    {
      title: ko ? '열린 기회' : 'Open opportunities',
      body: t.welfareBullets[1],
      Icon: Sparkles,
    },
    {
      title: ko ? '연결되는 채용' : 'Connected hiring',
      body: t.hireNote,
      Icon: Handshake,
    },
  ];

  const cultureHighlights = ko
    ? [
        '개인의 전문성은 팀의 완성도로 연결될 때 더 크게 작동합니다.',
        '위즈팩토리는 사업관리, 엔지니어링, 디자인, 연구전담이 하나의 제품팀처럼 움직이며 고객 현장에 맞는 실행 구조를 만듭니다.',
      ]
    : [
        'Individual expertise matters most when it becomes team-level craft.',
        'WIZFACTORY runs business management, engineering, design, and research as one product team built for the customer floor.',
      ];

  return (
    <>
      <section
        className="relative overflow-hidden bg-[var(--apple-surface-white)] scroll-mt-[calc(var(--app-header-offset)+3rem)]"
        aria-labelledby="team-page-title"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 90% 70% at 10% 10%, rgba(179,7,16,0.09), transparent 45%), radial-gradient(ellipse 85% 60% at 90% 15%, rgba(0,113,227,0.10), transparent 48%), linear-gradient(180deg, rgba(255,255,255,0.98), rgba(245,245,247,0.78))',
          }}
        />
        <div className="relative wiz-section py-14 md:py-20">
          <motion.div {...m}>
            <p className="text-[11px] font-semibold uppercase tracking-[var(--tracking-widest)] text-[var(--apple-text-tertiary)]">
              {t.eyebrow}
            </p>
            <h1
              id="team-page-title"
              className="mt-4 max-w-[12ch] text-[length:var(--text-display-2xl)] font-bold leading-[var(--leading-tightest)] tracking-[var(--tracking-tighter)] text-[var(--apple-text-primary)]"
            >
              {t.title}
            </h1>
            <p className="mt-7 max-w-2xl text-[length:var(--text-body-xl)] font-medium leading-[var(--leading-relaxed)] text-[var(--apple-text-secondary)]">
              {t.lead}
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Button size="lg" className="rounded-full px-7" asChild>
                <Link to="/about/careers">
                  {ko ? '채용 보기' : 'Explore careers'}
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-full border-black/[0.08] bg-white/75 px-7 backdrop-blur-sm hover:bg-white"
                onClick={openContact}
              >
                {ko ? '문의하기' : 'Talk with us'}
              </Button>
            </div>
            <div className="mt-10 grid gap-3 sm:grid-cols-3">
              {heroSignals.map(signal => (
                <SignalBadge key={signal.label} value={signal.value} label={signal.label} />
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="apple-section-dark relative overflow-hidden" aria-labelledby="team-culture-highlight">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 80% 60% at 15% 20%, rgba(255,255,255,0.10), transparent 45%), radial-gradient(ellipse 70% 50% at 85% 80%, rgba(179,7,16,0.18), transparent 48%)',
          }}
        />
        <div className="relative wiz-section py-20 md:py-24 lg:py-28">
          <motion.div className="max-w-4xl" {...m}>
            <p
              id="team-culture-highlight"
              className="text-[11px] font-semibold uppercase tracking-[var(--tracking-widest)] text-white/45"
            >
              {t.cultureTitle}
            </p>
            <p className="mt-8 text-[clamp(1.7rem,4vw,3rem)] font-semibold leading-[1.22] tracking-[var(--tracking-tight)] text-white">
              {cultureHighlights[0]}
            </p>
            <p className="mt-7 max-w-3xl text-[length:var(--text-body-xl)] leading-[var(--leading-loose)] text-white/72">
              {cultureHighlights[1]}
            </p>
          </motion.div>
        </div>
      </section>

      <section className="apple-section-gray" aria-labelledby="team-principles-title">
        <div className="wiz-section py-20 md:py-28">
          <motion.div className="mx-auto max-w-3xl text-center" {...m}>
            <p className="text-[11px] font-semibold uppercase tracking-[var(--tracking-widest)] text-[var(--brand-red)]">
              {ko ? '협업 원칙' : 'Operating principles'}
            </p>
            <h2
              id="team-principles-title"
              className="mt-4 text-[length:var(--text-display-sm)] font-bold tracking-[var(--tracking-tight)] text-[var(--apple-text-primary)]"
            >
              {ko ? '팀이 일하는 네 가지 방식' : 'Four principles behind how we work'}
            </h2>
            <p className="mt-5 text-[length:var(--text-body-lg)] leading-[var(--leading-relaxed)] text-[var(--apple-text-secondary)]">
              {ko
                ? '애플식 팀 페이지처럼 사람 소개보다 협업 구조와 일의 리듬을 먼저 보여주도록 구성했습니다.'
                : 'Like Apple-style team storytelling, we lead with collaboration structure and work rhythm before individual bios.'}
            </p>
          </motion.div>

          <div className="mt-14 grid gap-5 md:grid-cols-2">
            {operatingPrinciples.map((item, index) => (
              <motion.div
                key={item.title}
                {...m}
                transition={
                  reduceMotion
                    ? { duration: 0 }
                    : { ...fadeUp.transition, delay: 0.06 + index * 0.06 }
                }
              >
                <PrincipleCard
                  index={index + 1}
                  title={item.title}
                  body={item.body}
                  caption={item.caption}
                  Icon={item.Icon}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="apple-section-white" aria-labelledby="team-leadership-title">
        <div className="wiz-section grid items-center gap-12 py-20 md:gap-16 md:py-28 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] lg:gap-20">
          <motion.div {...m}>
            <div
              className="relative overflow-hidden rounded-[2rem] border border-black/[0.06] bg-[var(--apple-surface-gray)] shadow-[0_16px_48px_rgba(0,0,0,0.08)]"
              style={{
                boxShadow:
                  '0 16px 48px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.75)',
              }}
            >
              <div className="aspect-[4/5] w-full">
                <img
                  src={company.ceoGreetingImage}
                  alt={company.ceoGreetingImageAlt}
                  className="h-full w-full object-cover object-center"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </div>
          </motion.div>

          <motion.div
            {...m}
            transition={
              reduceMotion
                ? { duration: 0 }
                : { ...fadeUp.transition, delay: 0.08 }
            }
          >
            <p className="text-[11px] font-semibold uppercase tracking-[var(--tracking-widest)] text-[var(--apple-text-tertiary)]">
              {t.leadershipTitle}
            </p>
            <h2
              id="team-leadership-title"
              className="mt-4 max-w-[14ch] text-[length:var(--text-display-sm)] font-bold leading-[var(--leading-tight)] tracking-[var(--tracking-tight)] text-[var(--apple-text-primary)]"
            >
              {ko ? '실행을 설계하는 리더십' : 'Leadership that designs execution'}
            </h2>
            <p className="mt-6 max-w-2xl text-[length:var(--text-body-xl)] leading-[var(--leading-loose)] text-[var(--apple-text-secondary)]">
              {t.ceoBio}
            </p>
            <blockquote
              className="relative mt-10 max-w-2xl border-l-[3px] pl-7 text-[length:var(--text-body-lg)] font-medium leading-[var(--leading-loose)] text-[var(--apple-text-primary)]"
              style={{ borderColor: 'var(--brand-red)' }}
            >
              <span
                aria-hidden
                className="absolute -left-1 top-0 text-5xl leading-none text-[var(--brand-red)]/12"
                style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
              >
                "
              </span>
              {ko
                ? '전략적 시야와 현장 실행이 분리되지 않도록, 팀의 의사결정을 고객의 현실과 연결합니다.'
                : 'Leadership connects strategic perspective to the customer’s reality so execution never drifts away from the floor.'}
            </blockquote>
            <div className="mt-10 flex flex-wrap items-end gap-4 border-t border-black/[0.07] pt-7">
              <div>
                <p className="text-sm font-semibold text-[var(--apple-text-secondary)]">{t.ceoRole}</p>
                <p className="mt-1 text-[1.35rem] font-bold tracking-[var(--tracking-snug)] text-[var(--apple-text-primary)]">
                  {t.ceoName}
                </p>
              </div>
              <p className="text-[11px] font-medium uppercase tracking-[var(--tracking-widest)] text-[var(--apple-text-tertiary)]">
                WIZFACTORY
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="apple-section-gray" aria-labelledby="team-growth-title">
        <div className="wiz-section py-20 md:py-28">
          <motion.div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between" {...m}>
            <div className="max-w-2xl">
              <p className="text-[11px] font-semibold uppercase tracking-[var(--tracking-widest)] text-[var(--apple-text-tertiary)]">
                {t.welfareTitle}
              </p>
              <h2
                id="team-growth-title"
                className="mt-4 text-[length:var(--text-display-sm)] font-bold tracking-[var(--tracking-tight)] text-[var(--apple-text-primary)]"
              >
                {ko ? '성장과 채용도 같은 철학으로 운영합니다' : 'Growth and hiring follow the same operating philosophy'}
              </h2>
            </div>
            <Button variant="outline" size="lg" className="rounded-full border-black/[0.08] bg-white px-7" asChild>
              <Link to="/about/careers">
                {ko ? '채용 페이지로 이동' : 'Go to careers'}
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </motion.div>

          <div className="mt-14 grid gap-5 lg:grid-cols-3">
            {growthCards.map((item, index) => (
              <motion.div
                key={item.title}
                {...m}
                transition={
                  reduceMotion
                    ? { duration: 0 }
                    : { ...fadeUp.transition, delay: 0.06 + index * 0.06 }
                }
              >
                <GlassPanel className="flex h-full flex-col p-7 md:p-8">
                  <div className="flex size-12 items-center justify-center rounded-2xl bg-[var(--apple-bg-primary)] text-[var(--brand-red)]">
                    <item.Icon className="size-5" />
                  </div>
                  <h3 className="mt-8 text-[1.25rem] font-bold tracking-[var(--tracking-snug)] text-[var(--apple-text-primary)]">
                    {item.title}
                  </h3>
                  <p className="mt-3 flex-1 text-[length:var(--text-body-md)] leading-[var(--leading-relaxed)] text-[var(--apple-text-secondary)]">
                    {item.body}
                  </p>
                </GlassPanel>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <AboutCtaBand
        title={s.cta.title}
        primaryLabel={s.cta.button}
        secondaryLabel={ko ? '채용 페이지' : 'Careers'}
        onPrimary={openContact}
        secondaryTo="/about/careers"
      />
    </>
  );
}
