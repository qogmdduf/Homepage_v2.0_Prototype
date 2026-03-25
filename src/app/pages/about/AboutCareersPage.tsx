import type { ReactNode } from 'react';
import { Link } from 'react-router';
import { motion, useReducedMotion } from 'motion/react';
import type { LucideIcon } from 'lucide-react';
import {
  ArrowRight,
  BarChart3,
  Database,
  Factory,
  MessageSquareText,
  Users2,
  Workflow,
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

const BUILD_ICONS = {
  factory: Factory,
  workflow: Workflow,
  database: Database,
} as const;

const FIT_ICONS = {
  users: Users2,
  message: MessageSquareText,
  chart: BarChart3,
} as const;

function SectionCard({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-black/[0.06] bg-white shadow-[0_12px_40px_rgba(0,0,0,0.05)]',
        className,
      )}
    >
      {children}
    </div>
  );
}

function BuildCard({
  label,
  title,
  body,
  Icon,
}: {
  label: string;
  title: string;
  body: string;
  Icon: LucideIcon;
}) {
  return (
    <SectionCard className="flex h-full flex-col p-7 md:p-8">
      <div className="flex items-center justify-between gap-4">
        <p className="text-[length:var(--text-label-xs)] font-semibold uppercase tracking-[var(--tracking-widest)] text-[var(--apple-text-tertiary)]">
          {label}
        </p>
        <div className="flex size-11 items-center justify-center rounded-2xl bg-[var(--apple-bg-primary)] text-[var(--brand-red)]">
          <Icon className="size-5" />
        </div>
      </div>
      <h3 className="mt-6 font-[family-name:var(--font-display)] text-[length:var(--text-body-xl)] font-bold tracking-[var(--tracking-snug)] text-[var(--apple-text-primary)]">
        {title}
      </h3>
      <p className="mt-3 flex-1 text-[length:var(--text-body-md)] leading-[var(--leading-relaxed)] text-[var(--apple-text-secondary)]">
        {body}
      </p>
    </SectionCard>
  );
}

export function AboutCareersPage() {
  const { language } = useLanguage();
  const reduceMotion = useReducedMotion();
  const s = getAboutSections(language);
  const c = s.careers;
  const ko = language === 'ko';
  const openContact = () => window.dispatchEvent(new CustomEvent('openContactModal'));
  const m = reduceMotion ? fadeUpStatic : fadeUp;

  const heroTags = ko
    ? ['Smart Factory', 'MES · 품질 · 설비', '실시간 데이터']
    : ['Smart factory', 'MES · quality · assets', 'Real-time data'];

  return (
    <>
      {/* ── Hero + 수치 스트립 (EVP · 신뢰) ── */}
      <section
        className="relative overflow-hidden scroll-mt-[calc(var(--app-header-offset)+3rem)] border-b border-black/[0.06] bg-[var(--apple-surface-white)]"
        aria-labelledby="careers-page-title"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 80% 55% at 0% 0%, rgba(179,7,16,0.07), transparent 50%), radial-gradient(ellipse 70% 50% at 100% 0%, rgba(0,113,227,0.08), transparent 48%)',
          }}
        />
        <div className="relative wiz-section py-14 md:py-20">
          <motion.div {...m}>
            <p className="text-[length:var(--text-label-xs)] font-semibold uppercase tracking-[var(--tracking-widest)] text-[var(--apple-text-tertiary)]">
              {c.eyebrow}
            </p>
            <h1
              id="careers-page-title"
              className="mt-4 whitespace-pre-line font-[family-name:var(--font-display)] text-[length:var(--text-display-lg)] font-bold leading-[var(--leading-tight)] tracking-[var(--tracking-tighter)] text-[var(--apple-text-primary)] md:text-[length:var(--text-display-xl)]"
            >
              {c.title}
            </h1>
            <p className="mt-6 max-w-2xl text-[length:var(--text-body-xl)] font-medium leading-[var(--leading-relaxed)] text-[var(--apple-text-secondary)]">
              {c.lead}
            </p>
            <div className="mt-8 flex flex-wrap gap-2">
              {heroTags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-black/[0.08] bg-white/90 px-3.5 py-1.5 text-[length:var(--text-label-md)] font-semibold text-[var(--apple-text-primary)] backdrop-blur-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {c.stats.map((st) => (
                <div
                  key={st.label}
                  className="rounded-xl border border-black/[0.06] bg-white/90 px-3 py-3 text-center backdrop-blur-sm md:px-4 md:py-3.5"
                >
                  <p className="text-[length:var(--text-display-xs)] font-bold tabular-nums text-[var(--apple-text-primary)]">
                    {st.value}
                  </p>
                  <p className="mt-1 text-[length:var(--text-label-xs)] font-medium text-[var(--apple-text-tertiary)]">
                    {st.label}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-10 flex flex-wrap gap-3">
              <Button size="lg" className="rounded-full px-7" onClick={openContact}>
                {ko ? '지원 · 문의하기' : 'Apply · contact'}
                <ArrowRight className="size-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-full border-black/[0.1] bg-white px-7 hover:bg-[var(--apple-surface-gray)]"
                asChild
              >
                <Link to="/about/team">{ko ? '팀 · 문화' : 'Team & culture'}</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── EVP (다크 밴드) ── */}
      <section className="apple-section-dark relative overflow-hidden" aria-labelledby="careers-evp-title">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-90"
          style={{
            background:
              'radial-gradient(ellipse 80% 50% at 20% 30%, rgba(255,255,255,0.08), transparent 45%), radial-gradient(ellipse 60% 45% at 90% 80%, rgba(179,7,16,0.2), transparent 50%)',
          }}
        />
        <div className="relative wiz-section py-16 md:py-20 lg:py-24">
          <motion.div className="max-w-4xl" {...m}>
            <p
              id="careers-evp-title"
              className="text-[length:var(--text-label-xs)] font-semibold uppercase tracking-[var(--tracking-widest)] text-white/50"
            >
              {c.evpEyebrow}
            </p>
            <p className="mt-6 font-[family-name:var(--font-display)] text-[clamp(1.5rem,3.5vw,2.35rem)] font-semibold leading-[var(--leading-snug)] tracking-[var(--tracking-tight)] text-white">
              {c.evpLine}
            </p>
            <p className="mt-6 max-w-3xl text-[length:var(--text-body-lg)] leading-[var(--leading-loose)] text-white/75">
              {c.evpBody}
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Why join ── */}
      <section className="apple-section-gray" aria-labelledby="careers-why-title">
        <div className="wiz-section py-16 md:py-24">
          <motion.div className="mx-auto max-w-2xl text-center" {...m}>
            <h2
              id="careers-why-title"
              className="font-[family-name:var(--font-display)] text-[length:var(--text-display-sm)] font-bold tracking-[var(--tracking-tight)] text-[var(--apple-text-primary)]"
            >
              {c.whyTitle}
            </h2>
          </motion.div>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {c.whyPoints.map((pt, index) => (
              <motion.div
                key={pt.title}
                {...m}
                transition={
                  reduceMotion ? { duration: 0 } : { ...fadeUp.transition, delay: 0.05 + index * 0.06 }
                }
              >
                <SectionCard className="h-full p-7 md:p-8">
                  <p className="text-[length:var(--text-label-xs)] font-bold uppercase tracking-[var(--tracking-widest)] text-[var(--brand-red)]">
                    {String(index + 1).padStart(2, '0')}
                  </p>
                  <h3 className="mt-4 font-[family-name:var(--font-display)] text-[length:var(--text-body-xl)] font-bold text-[var(--apple-text-primary)]">
                    {pt.title}
                  </h3>
                  <p className="mt-3 text-[length:var(--text-body-md)] leading-[var(--leading-relaxed)] text-[var(--apple-text-secondary)]">
                    {pt.body}
                  </p>
                </SectionCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Build with us ── */}
      <section className="apple-section-white" aria-labelledby="careers-build-title">
        <div className="wiz-section py-16 md:py-24">
          <motion.div className="mx-auto max-w-3xl text-center" {...m}>
            <p className="text-[length:var(--text-label-xs)] font-semibold uppercase tracking-[var(--tracking-widest)] text-[var(--brand-red)]">
              {c.buildEyebrow}
            </p>
            <h2
              id="careers-build-title"
              className="mt-3 font-[family-name:var(--font-display)] text-[length:var(--text-display-sm)] font-bold tracking-[var(--tracking-tight)] text-[var(--apple-text-primary)]"
            >
              {c.buildTitle}
            </h2>
            <p className="mt-4 text-[length:var(--text-body-lg)] leading-[var(--leading-relaxed)] text-[var(--apple-text-secondary)]">
              {c.buildLead}
            </p>
          </motion.div>
          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {c.buildAreas.map((item, index) => (
              <motion.div
                key={item.label}
                {...m}
                transition={
                  reduceMotion ? { duration: 0 } : { ...fadeUp.transition, delay: 0.06 + index * 0.06 }
                }
              >
                <BuildCard
                  label={item.label}
                  title={item.title}
                  body={item.body}
                  Icon={BUILD_ICONS[item.key]}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Role tracks ── */}
      <section className="border-y border-black/[0.06] bg-[var(--apple-surface-gray)]" aria-labelledby="careers-tracks-title">
        <div className="wiz-section py-16 md:py-24">
          <motion.div className="mx-auto max-w-3xl text-center" {...m}>
            <p className="text-[length:var(--text-label-xs)] font-semibold uppercase tracking-[var(--tracking-widest)] text-[var(--apple-text-tertiary)]">
              Tracks
            </p>
            <h2
              id="careers-tracks-title"
              className="mt-3 font-[family-name:var(--font-display)] text-[length:var(--text-display-sm)] font-bold tracking-[var(--tracking-tight)] text-[var(--apple-text-primary)]"
            >
              {c.tracksTitle}
            </h2>
            <p className="mt-4 text-[length:var(--text-body-lg)] leading-[var(--leading-relaxed)] text-[var(--apple-text-secondary)]">
              {c.tracksLead}
            </p>
          </motion.div>
          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {c.tracks.map((tr, index) => (
              <motion.div
                key={tr.title}
                {...m}
                transition={
                  reduceMotion ? { duration: 0 } : { ...fadeUp.transition, delay: 0.05 + index * 0.06 }
                }
              >
                <SectionCard className="flex h-full flex-col p-7 md:p-8">
                  <h3 className="font-[family-name:var(--font-display)] text-[length:var(--text-body-xl)] font-bold text-[var(--apple-text-primary)]">
                    {tr.title}
                  </h3>
                  <p className="mt-3 flex-1 text-[length:var(--text-body-md)] leading-[var(--leading-relaxed)] text-[var(--apple-text-secondary)]">
                    {tr.body}
                  </p>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {tr.tags.map((t) => (
                      <span
                        key={t}
                        className="rounded-md border border-black/[0.08] bg-[var(--apple-bg-primary)] px-2.5 py-1 text-[length:var(--text-label-sm)] font-medium text-[var(--apple-text-primary)]"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </SectionCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Perks ── */}
      <section className="apple-section-white" aria-labelledby="careers-perks-title">
        <div className="wiz-section py-16 md:py-24">
          <motion.div {...m}>
            <h2
              id="careers-perks-title"
              className="font-[family-name:var(--font-display)] text-[length:var(--text-display-sm)] font-bold tracking-[var(--tracking-tight)] text-[var(--apple-text-primary)]"
            >
              {c.perksTitle}
            </h2>
            <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {c.perks.map((line) => (
                <li
                  key={line}
                  className="flex gap-3 rounded-xl border border-black/[0.06] bg-[var(--apple-surface-gray)] px-4 py-3.5 text-[length:var(--text-body-md)] leading-snug text-[var(--apple-text-primary)]"
                >
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-[var(--brand-red)]" aria-hidden />
                  {line}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>

      {/* ── Culture fit ── */}
      <section className="apple-section-gray" aria-labelledby="careers-fit-title">
        <div className="wiz-section py-16 md:py-24">
          <motion.div className="grid gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16" {...m}>
            <div>
              <p className="text-[length:var(--text-label-xs)] font-semibold uppercase tracking-[var(--tracking-widest)] text-[var(--apple-text-tertiary)]">
                {c.fitEyebrow}
              </p>
              <h2
                id="careers-fit-title"
                className="mt-4 max-w-[18ch] font-[family-name:var(--font-display)] text-[length:var(--text-display-sm)] font-bold tracking-[var(--tracking-tight)] text-[var(--apple-text-primary)]"
              >
                {c.fitTitle}
              </h2>
              <p className="mt-6 max-w-xl text-[length:var(--text-body-lg)] leading-[var(--leading-loose)] text-[var(--apple-text-secondary)]">
                {c.cultureTeaser}
              </p>
              <Button variant="outline" size="lg" className="mt-8 rounded-full border-black/[0.1] bg-white px-7" asChild>
                <Link to="/about/team">
                  {ko ? '팀 · 문화 보기' : 'Team & culture'}
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
            <div className="grid gap-4">
              {c.fitTraits.map((item, index) => {
                const Icon = FIT_ICONS[item.key];
                return (
                  <motion.div
                    key={item.title}
                    {...m}
                    transition={
                      reduceMotion ? { duration: 0 } : { ...fadeUp.transition, delay: 0.05 + index * 0.05 }
                    }
                  >
                    <SectionCard className="flex gap-5 p-6 md:items-start md:p-7">
                      <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--apple-bg-primary)] text-[var(--brand-red)]">
                        <Icon className="size-5" />
                      </div>
                      <div>
                        <p className="text-[length:var(--text-label-xs)] font-semibold uppercase tracking-[var(--tracking-widest)] text-[var(--apple-text-tertiary)]">
                          {item.label}
                        </p>
                        <h3 className="mt-2 font-[family-name:var(--font-display)] text-[length:var(--text-body-xl)] font-bold text-[var(--apple-text-primary)]">
                          {item.title}
                        </h3>
                        <p className="mt-2 text-[length:var(--text-body-md)] leading-[var(--leading-relaxed)] text-[var(--apple-text-secondary)]">
                          {item.body}
                        </p>
                      </div>
                    </SectionCard>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Process timeline ── */}
      <section className="apple-section-white" aria-labelledby="careers-process-title">
        <div className="wiz-section py-16 md:py-24">
          <motion.div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between" {...m}>
            <div className="max-w-2xl">
              <p className="text-[length:var(--text-label-xs)] font-semibold uppercase tracking-[var(--tracking-widest)] text-[var(--apple-text-tertiary)]">
                {c.processTitle}
              </p>
              <h2
                id="careers-process-title"
                className="mt-3 font-[family-name:var(--font-display)] text-[length:var(--text-display-sm)] font-bold tracking-[var(--tracking-tight)] text-[var(--apple-text-primary)]"
              >
                {c.processHeading}
              </h2>
              <p className="mt-3 text-[length:var(--text-body-md)] text-[var(--apple-text-secondary)]">
                {c.processSubtitle}
              </p>
            </div>
            <Button size="lg" className="rounded-full px-7" onClick={openContact}>
              {ko ? '문의하기' : 'Contact'}
              <ArrowRight className="size-4" />
            </Button>
          </motion.div>

          <div className="relative mt-12 md:mt-14">
            <div
              className="absolute left-[1.15rem] top-3 bottom-3 hidden w-px bg-gradient-to-b from-[var(--brand-red)]/40 via-black/10 to-transparent md:left-1/2 md:block md:-translate-x-1/2"
              aria-hidden
            />
            <div className="grid gap-6 md:grid-cols-4 md:gap-4">
              {c.processSteps.map((step, index) => (
                <motion.div
                  key={step}
                  {...m}
                  transition={
                    reduceMotion ? { duration: 0 } : { ...fadeUp.transition, delay: 0.05 + index * 0.05 }
                  }
                >
                  <div className="relative flex gap-4 md:flex-col md:items-center md:text-center">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-full border-2 border-[var(--brand-red)]/30 bg-white text-[length:var(--text-label-sm)] font-bold text-[var(--brand-red)] md:mx-auto">
                      {index + 1}
                    </div>
                    <SectionCard className="flex-1 p-6 md:min-h-[120px]">
                      <p className="text-[length:var(--text-body-md)] font-semibold leading-snug text-[var(--apple-text-primary)]">
                        {step}
                      </p>
                    </SectionCard>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div
            className="mt-10 rounded-2xl border border-black/[0.06] bg-[var(--apple-surface-gray)] px-6 py-7 md:px-9 md:py-8"
            {...m}
            transition={reduceMotion ? { duration: 0 } : { ...fadeUp.transition, delay: 0.15 }}
          >
            <p className="text-[length:var(--text-label-xs)] font-semibold uppercase tracking-[var(--tracking-widest)] text-[var(--apple-text-tertiary)]">
              {c.openRolesEyebrow}
            </p>
            <p className="mt-4 max-w-4xl text-[length:var(--text-body-lg)] leading-[var(--leading-loose)] text-[var(--apple-text-secondary)]">
              {c.positionsNote}
            </p>
          </motion.div>
        </div>
      </section>

      <AboutCtaBand
        title={s.cta.title}
        primaryLabel={s.cta.button}
        secondaryLabel={ko ? '팀 · 문화 보기' : 'Team & culture'}
        onPrimary={openContact}
        secondaryTo="/about/team"
      />
    </>
  );
}
