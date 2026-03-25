import type { ReactNode } from 'react';
import { Link } from 'react-router';
import { motion, useReducedMotion } from 'motion/react';
import type { LucideIcon } from 'lucide-react';
import {
  ArrowRight,
  Check,
  Database,
  Download,
  Factory,
  Layers,
  Play,
  Sparkles,
  Users2,
  Wrench,
} from 'lucide-react';
import {
  IconAPI,
  IconBell,
  IconDashboard,
  IconManufacturing,
  IconQuality,
  IconReport,
  IconSliders,
  IconWorkflow,
} from '../../components/AnimatedIcons';
import { useLanguage } from '../../contexts/LanguageContext';
import { getAboutSections } from '../../data/aboutSectionsContent';
import { AboutCtaBand } from '../../components/about/AboutPageUi';
import { Button } from '../../components/ui/button';
import { cn } from '../../components/ui/utils';
import { categories, getCategoryLabel, solutions, type CategoryKey, type Solution } from '../../data/solutions';

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-70px' },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
};

const fadeUpStatic = {
  initial: { opacity: 1, y: 0 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-70px' },
  transition: { duration: 0 },
};

type AccentMotionIcon = ({ color }: { color: string }) => ReactNode;

const categoryVisualIcons: Record<string, AccentMotionIcon> = {
  production: IconManufacturing,
  quality: IconQuality,
  facility: IconSliders,
  platform: IconDashboard,
  project: IconWorkflow,
};

function SurfaceCard({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        'rounded-[2rem] border border-black/[0.06] bg-white',
        'shadow-[0_16px_44px_rgba(0,0,0,0.06)]',
        className,
      )}
      style={{ boxShadow: '0 16px 44px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.75)' }}
    >
      {children}
    </div>
  );
}

function getMetricProgress(value: string, suffix: string) {
  const numeric = Number.parseFloat(value);

  if (!Number.isFinite(numeric)) {
    return 72;
  }

  if (suffix.includes('↓')) {
    return Math.max(28, Math.min(96, 100 - numeric));
  }

  if (suffix.includes('↑')) {
    return Math.max(28, Math.min(96, 50 + numeric));
  }

  return Math.max(28, Math.min(96, numeric));
}

function MetricCard({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <SurfaceCard className="px-5 py-5">
      <p className="text-[1.7rem] font-bold leading-none tracking-[var(--tracking-tight)] text-[var(--apple-text-primary)]">
        {value}
      </p>
      <p className="mt-2 text-[11px] font-semibold uppercase tracking-[var(--tracking-widest)] text-[var(--apple-text-tertiary)]">
        {label}
      </p>
    </SurfaceCard>
  );
}

function FlowSignalChip({
  label,
  accent,
  Icon,
}: {
  label: string;
  accent: string;
  Icon: AccentMotionIcon;
}) {
  return (
    <div className="rounded-[1.25rem] border border-black/[0.05] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(245,245,247,0.9))] px-4 py-4">
      <div className="flex items-center gap-3">
        <div
          className="flex size-10 items-center justify-center rounded-2xl"
          style={{ background: `${accent}14` }}
        >
          <Icon color={accent} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[12px] font-semibold leading-relaxed text-[var(--apple-text-primary)]">{label}</p>
        </div>
        <span className="size-2 rounded-full" style={{ background: accent }} />
      </div>
    </div>
  );
}

function StructureCard({
  title,
  body,
  accent,
  Icon,
}: {
  title: string;
  body: string;
  accent: string;
  Icon: LucideIcon;
}) {
  return (
    <SurfaceCard className="h-full p-6 md:p-7">
      <div
        className="flex size-12 items-center justify-center rounded-2xl"
        style={{ background: `${accent}14`, color: accent }}
      >
        <Icon className="size-5" />
      </div>
      <h3 className="mt-7 text-[1.2rem] font-bold tracking-[var(--tracking-snug)] text-[var(--apple-text-primary)]">
        {title}
      </h3>
      <p className="mt-3 text-sm leading-[var(--leading-relaxed)] text-[var(--apple-text-secondary)]">
        {body}
      </p>
    </SurfaceCard>
  );
}

function ServiceTopologyPanel({
  cards,
  language,
  reduceMotion,
}: {
  cards: Array<{
    title: string;
    body: string;
    accent: string;
    visualIcon: AccentMotionIcon;
  }>;
  language: 'ko' | 'en';
  reduceMotion: boolean;
}) {
  const ko = language === 'ko';
  const signalCards = ko
    ? [
        { value: '24/7', label: '운영 대시보드' },
        { value: 'Auto', label: '승인 · 알람 흐름' },
        { value: 'API', label: '리포트 · 연동 레이어' },
      ]
    : [
        { value: '24/7', label: 'Operations dashboards' },
        { value: 'Auto', label: 'Approval and alert flows' },
        { value: 'API', label: 'Reports and integrations' },
      ];

  return (
    <div className="relative mt-8 overflow-hidden rounded-[1.8rem] border border-black/[0.06] bg-[#08111f] p-5 text-white md:p-6">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 14% 18%, rgba(0,113,227,0.28), transparent 28%), radial-gradient(circle at 85% 80%, rgba(179,7,16,0.18), transparent 30%), linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
          backgroundSize: 'auto, auto, 26px 26px, 26px 26px',
        }}
      />
      <div className="relative">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[var(--tracking-widest)] text-white/45">
              {ko ? 'Visual system' : 'Visual system'}
            </p>
            <h3 className="mt-2 text-lg font-semibold tracking-[var(--tracking-snug)] text-white">
              {ko ? '현장 데이터가 구조적으로 연결되는 흐름' : 'A structural flow of connected operational data'}
            </h3>
          </div>
          <span className="rounded-full border border-white/10 bg-white/[0.08] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/70">
            {ko ? 'Live layers' : 'Live layers'}
          </span>
        </div>

        <div className="mt-6 space-y-3">
          {cards.map((card, index) => {
            const VisualIcon = card.visualIcon;
            const progress = [90, 76, 84][index] ?? 78;

            return (
              <div
                key={card.title}
                className="rounded-[1.35rem] border border-white/8 bg-white/[0.05] px-4 py-4 backdrop-blur-xl"
              >
                <div className="grid items-start gap-4 md:grid-cols-[auto_minmax(0,1fr)]">
                  <div
                    className="flex size-11 items-center justify-center rounded-2xl"
                    style={{ background: `${card.accent}18` }}
                  >
                    <VisualIcon color={card.accent} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold text-white">{card.title}</p>
                      <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/48">
                        {ko ? 'connected' : 'connected'}
                      </span>
                    </div>
                    <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: `linear-gradient(90deg, ${card.accent}, rgba(255,255,255,0.92))` }}
                        initial={{ width: reduceMotion ? `${progress}%` : '16%' }}
                        whileInView={{ width: `${progress}%` }}
                        viewport={{ once: true, margin: '-100px' }}
                        transition={
                          reduceMotion
                            ? { duration: 0 }
                            : { duration: 0.8, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }
                        }
                      />
                    </div>
                    <p className="mt-3 text-xs leading-relaxed text-white/62">{card.body}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {signalCards.map(signal => (
            <div
              key={signal.label}
              className="rounded-[1.2rem] border border-white/8 bg-white/[0.06] px-4 py-3 backdrop-blur-xl"
            >
              <p className="text-[1.15rem] font-semibold tracking-[var(--tracking-tight)] text-white">{signal.value}</p>
              <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/42">
                {signal.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DomainRow({
  href,
  title,
  desc,
  count,
  accent,
  Icon,
}: {
  href: string;
  title: string;
  desc: string;
  count: string;
  accent: string;
  Icon: LucideIcon;
}) {
  return (
    <a
      href={href}
      className="group flex items-start gap-4 rounded-[1.4rem] border border-black/[0.05] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(245,245,247,0.9))] px-5 py-5 transition-[transform,background-color,box-shadow] hover:-translate-y-0.5 hover:bg-white"
    >
      <div
        className="mt-0.5 flex size-11 shrink-0 items-center justify-center rounded-2xl"
        style={{ background: `${accent}14`, color: accent }}
      >
        <Icon className="size-5" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-base font-semibold text-[var(--apple-text-primary)]">{title}</p>
            <p className="mt-1 text-sm leading-relaxed text-[var(--apple-text-secondary)]">{desc}</p>
          </div>
          <span className="shrink-0 text-sm font-semibold" style={{ color: accent }}>
            {count}
          </span>
        </div>
      </div>
      <ArrowRight className="mt-1 size-4 shrink-0 text-[var(--apple-text-tertiary)] transition-transform duration-200 group-hover:translate-x-1" />
    </a>
  );
}

function OperationsShowcaseCard({
  groups,
  language,
  reduceMotion,
}: {
  groups: Array<{
    key: string;
    title: string;
    desc: string;
    accent: string;
    solutions: Solution[];
    visualIcon: AccentMotionIcon;
  }>;
  language: 'ko' | 'en';
  reduceMotion: boolean;
}) {
  const ko = language === 'ko';
  const rows = groups.filter(group => group.solutions.length > 0).slice(0, 3);
  const chips = ko ? ['Live KPI', '라인 상태', '알람 피드'] : ['Live KPI', 'Line state', 'Alert feed'];

  return (
    <SurfaceCard className="relative h-full overflow-hidden p-6 md:p-8">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 10% 15%, rgba(0,113,227,0.12), transparent 28%), radial-gradient(circle at 85% 78%, rgba(179,7,16,0.10), transparent 26%)',
        }}
      />
      <div className="relative flex h-full flex-col">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[var(--tracking-widest)] text-[var(--apple-text-tertiary)]">
              {ko ? 'Operations cockpit' : 'Operations cockpit'}
            </p>
            <h3 className="mt-3 max-w-[14ch] text-[length:var(--text-display-xs)] font-bold leading-[var(--leading-tight)] tracking-[var(--tracking-tight)] text-[var(--apple-text-primary)]">
              {ko ? '운영 장면이 먼저 보이는 서비스 화면' : 'A service view that shows the operational scene first'}
            </h3>
          </div>
          <div className="flex size-12 items-center justify-center rounded-2xl bg-[rgba(0,113,227,0.08)] text-[var(--apple-blue)]">
            <IconDashboard color={categories.platform.color} />
          </div>
        </div>

        <p className="mt-5 max-w-2xl text-sm leading-[var(--leading-relaxed)] text-[var(--apple-text-secondary)]">
          {ko
            ? '요즘 IT 솔루션 페이지는 설명을 길게 늘어놓기보다, 실제 운영 데이터가 어떤 화면과 흐름으로 연결되는지 먼저 보여주는 방식이 강합니다.'
            : 'Current IT solution pages increasingly lead with product-like operational views instead of relying on long descriptive copy.'}
        </p>

        <div className="mt-8 grid gap-3">
          {rows.map((group, index) => {
            const VisualIcon = group.visualIcon;
            const progress = Math.min(94, 66 + group.solutions.length * 10 + index * 4);

            return (
              <div
                key={group.key}
                className="rounded-[1.35rem] border border-black/[0.05] bg-white/80 px-4 py-4 shadow-[0_10px_30px_rgba(0,0,0,0.04)] backdrop-blur-xl"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <div
                      className="flex size-10 items-center justify-center rounded-2xl"
                      style={{ background: `${group.accent}14` }}
                    >
                      <VisualIcon color={group.accent} />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-[var(--apple-text-primary)]">{group.title}</p>
                      <p className="mt-1 truncate text-xs text-[var(--apple-text-secondary)]">{group.desc}</p>
                    </div>
                  </div>
                  <span
                    className="shrink-0 rounded-full px-3 py-1.5 text-[11px] font-semibold"
                    style={{ background: `${group.accent}12`, color: group.accent }}
                  >
                    {ko ? `${group.solutions.length}개` : `${group.solutions.length}`}
                  </span>
                </div>
                <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-black/[0.06]">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: `linear-gradient(90deg, ${group.accent}, ${group.accent}88)` }}
                    initial={{ width: reduceMotion ? `${progress}%` : '24%' }}
                    whileInView={{ width: `${progress}%` }}
                    viewport={{ once: true, margin: '-100px' }}
                    transition={
                      reduceMotion
                        ? { duration: 0 }
                        : { duration: 0.85, delay: 0.06 + index * 0.06, ease: [0.22, 1, 0.36, 1] }
                    }
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-auto flex flex-wrap gap-2 pt-6">
          {chips.map(chip => (
            <span
              key={chip}
              className="rounded-full border border-black/[0.06] bg-white/80 px-3.5 py-1.5 text-[11px] font-semibold text-[var(--apple-text-secondary)]"
            >
              {chip}
            </span>
          ))}
        </div>
      </div>
    </SurfaceCard>
  );
}

function VisualStoryCard({
  eyebrow,
  title,
  body,
  accent,
  Icon,
  tags,
}: {
  eyebrow: string;
  title: string;
  body: string;
  accent: string;
  Icon: AccentMotionIcon;
  tags: string[];
}) {
  return (
    <SurfaceCard className="relative h-full overflow-hidden p-6 md:p-7">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(circle at 100% 0%, ${accent}14, transparent 36%)`,
        }}
      />
      <div className="relative flex h-full flex-col">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[var(--tracking-widest)] text-[var(--apple-text-tertiary)]">
              {eyebrow}
            </p>
            <h3 className="mt-3 text-[1.25rem] font-bold tracking-[var(--tracking-snug)] text-[var(--apple-text-primary)]">
              {title}
            </h3>
          </div>
          <div
            className="flex size-12 items-center justify-center rounded-2xl"
            style={{ background: `${accent}14` }}
          >
            <Icon color={accent} />
          </div>
        </div>
        <p className="mt-4 text-sm leading-[var(--leading-relaxed)] text-[var(--apple-text-secondary)]">
          {body}
        </p>
        <div className="mt-auto flex flex-wrap gap-2 pt-6">
          {tags.map(tag => (
            <span
              key={tag}
              className="rounded-full px-3.5 py-1.5 text-[11px] font-semibold"
              style={{ background: `${accent}12`, color: accent }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </SurfaceCard>
  );
}

function SolutionCard({
  solution,
  language,
  accent,
  reduceMotion,
}: {
  solution: Solution;
  language: 'ko' | 'en';
  accent: string;
  reduceMotion: boolean;
}) {
  const ko = language === 'ko';
  const displayName = ko ? solution.nameKo : solution.nameEn;
  const displaySubtitle = ko ? solution.subtitle : solution.subtitleEn;
  const displayDescription = ko ? solution.description : solution.descriptionEn;
  const featureRows = (ko ? solution.features : solution.featuresEn).slice(0, 3).map(item => item.split('||')[0]);
  const previewTags = ((ko ? solution.highlights : solution.highlightsEn) ?? featureRows).slice(0, 3);
  const previewRows =
    solution.metrics?.slice(0, 3).map(metric => ({
      label: ko ? metric.label : metric.labelEn,
      value: `${metric.value}${metric.suffix}`,
      progress: getMetricProgress(metric.value, metric.suffix),
    })) ??
    featureRows.slice(0, 3).map((row, index) => ({
      label: row,
      value: ko ? ['연결', '자동', '추적'][index] ?? 'Live' : ['Live', 'Auto', 'Trace'][index] ?? 'Live',
      progress: [72, 84, 68][index] ?? 74,
    }));
  const demoHref = solution.demoUrl ?? `/demo/${solution.id}`;
  const VisualIcon = categoryVisualIcons[solution.category] ?? IconDashboard;

  return (
    <SurfaceCard className="flex h-full flex-col p-6 md:p-7">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[clamp(1.5rem,3vw,2rem)] font-bold leading-[1.08] tracking-[var(--tracking-tight)] text-[var(--apple-text-primary)]">
            {displayName}
          </p>
          <p className="mt-2 text-[length:var(--text-body-md)] font-medium text-[var(--apple-text-secondary)]">
            {displaySubtitle}
          </p>
        </div>
        <span
          className="shrink-0 rounded-full px-3 py-1.5 text-[11px] font-semibold"
          style={{ background: `${accent}14`, color: accent }}
        >
          {getCategoryLabel(solution.category, language)}
        </span>
      </div>

      <div className="relative mt-6 overflow-hidden rounded-[1.6rem] border border-black/[0.06] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(245,245,247,0.92))] p-5">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background: `radial-gradient(circle at 100% 0%, ${accent}14, transparent 35%)`,
          }}
        />
        <div className="relative">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div
                className="flex size-11 items-center justify-center rounded-2xl"
                style={{ background: `${accent}16` }}
              >
                <VisualIcon color={accent} />
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[var(--tracking-widest)] text-[var(--apple-text-tertiary)]">
                  {ko ? 'Live preview' : 'Live preview'}
                </p>
                <p className="mt-1 text-sm font-semibold text-[var(--apple-text-primary)]">
                  {ko ? '제품형 운영 프리뷰' : 'Product-like operational preview'}
                </p>
              </div>
            </div>
            <span
              className="rounded-full border px-3 py-1.5 text-[11px] font-semibold"
              style={{ borderColor: `${accent}24`, color: accent }}
            >
              {ko ? '운영 중' : 'Active'}
            </span>
          </div>

          <div className="mt-5 grid gap-3 xl:grid-cols-3">
            {previewRows.map((row, index) => (
              <div
                key={`${solution.id}-${row.label}`}
                className="rounded-[1.2rem] border border-black/[0.05] bg-white/80 px-4 py-3 shadow-[0_8px_24px_rgba(0,0,0,0.03)]"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-[12px] font-semibold leading-relaxed text-[var(--apple-text-primary)]">{row.label}</p>
                  <span className="shrink-0 text-[11px] font-semibold" style={{ color: accent }}>
                    {row.value}
                  </span>
                </div>
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-black/[0.05]">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: `linear-gradient(90deg, ${accent}, ${accent}88)` }}
                    initial={{ width: reduceMotion ? `${row.progress}%` : '20%' }}
                    whileInView={{ width: `${row.progress}%` }}
                    viewport={{ once: true, margin: '-100px' }}
                    transition={
                      reduceMotion
                        ? { duration: 0 }
                        : { duration: 0.8, delay: 0.05 + index * 0.05, ease: [0.22, 1, 0.36, 1] }
                    }
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {previewTags.map(tag => (
              <span
                key={`${solution.id}-${tag}`}
                className="rounded-full px-3 py-1.5 text-[11px] font-semibold"
                style={{ background: `${accent}12`, color: accent }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      <p className="mt-6 text-sm leading-[var(--leading-relaxed)] text-[var(--apple-text-secondary)]">
        {displayDescription}
      </p>

      <div className="mt-7 grid gap-2.5">
        {featureRows.map(row => (
          <div
            key={row}
            className="flex items-start gap-3 rounded-[1.1rem] border border-black/[0.05] bg-[var(--apple-surface-gray)] px-4 py-3 text-sm text-[var(--apple-text-primary)]"
          >
            <span className="mt-1 size-1.5 shrink-0 rounded-full" style={{ background: accent }} />
            <span>{row}</span>
          </div>
        ))}
      </div>

      <div className="mt-auto flex flex-wrap gap-2.5 pt-8">
        <Button size="sm" className="rounded-full px-5" asChild>
          <Link to={`/solution/${solution.id}`}>
            {ko ? '상세 페이지' : 'Detail page'}
            <ArrowRight className="size-4" />
          </Link>
        </Button>

        {solution.isDemoAvailable ? (
          <Button
            size="sm"
            variant="outline"
            className="rounded-full border-black/[0.08] bg-white px-4"
            asChild
          >
            <a href={demoHref} target="_blank" rel="noopener noreferrer">
              <Play className="size-4" />
              {ko ? '데모 보기' : 'Demo'}
            </a>
          </Button>
        ) : null}

        {solution.brochurePdf ? (
          <Button
            size="sm"
            variant="outline"
            className="rounded-full border-black/[0.08] bg-white px-4"
            asChild
          >
            <a href={solution.brochurePdf} download rel="noopener noreferrer">
              <Download className="size-4" />
              {ko ? '소개서' : 'Brochure'}
            </a>
          </Button>
        ) : null}
      </div>
    </SurfaceCard>
  );
}

export function AboutServicesPage() {
  const { language } = useLanguage();
  const reduceMotion = useReducedMotion();
  const s = getAboutSections(language);
  const p = s.services;
  const ko = language === 'ko';
  const openContact = () => window.dispatchEvent(new CustomEvent('openContactModal'));
  const m = reduceMotion ? fadeUpStatic : fadeUp;

  const iconMap: Record<string, LucideIcon> = {
    production: Factory,
    quality: Check,
    facility: Wrench,
    platform: Database,
    project: Users2,
  };

  const groups = p.categories.map((cat, index) => {
    const domainSolutions = cat.solutionIds
      .map(id => solutions.find(solution => solution.id === id))
      .filter((solution): solution is Solution => Boolean(solution));
    const accent = categories[cat.key as CategoryKey]?.color ?? '#86868B';
    return {
      ...cat,
      accent,
      icon: iconMap[cat.key] ?? Layers,
      visualIcon: categoryVisualIcons[cat.key] ?? IconDashboard,
      anchor: `services-${cat.key}`,
      index,
      solutions: domainSolutions,
    };
  });

  const solutionGroups = groups.filter(group => group.solutions.length > 0);
  const projectGroup = groups.find(group => group.key === 'project');

  const heroMetrics = [
    { value: `${solutions.length}`, label: ko ? '제품형 솔루션' : 'Productized solutions' },
    { value: `${groups.length}`, label: ko ? '서비스 도메인' : 'Service domains' },
    { value: 'Custom', label: ko ? '맞춤 구축 지원' : 'Custom delivery' },
  ];

  const structureCards = ko
    ? [
        {
          title: '생산 실행 레이어',
          body: 'MES, 작업지시, 공정 추적처럼 라인 운영에 직접 연결되는 화면과 로직을 중심에 둡니다.',
          accent: categories.production.color,
          Icon: Factory,
          visualIcon: IconManufacturing,
        },
        {
          title: '데이터 · 모니터링 레이어',
          body: '품질, 설비, 환경 데이터를 수집하고 가시화해 의사결정이 한 박자 빨라지도록 만듭니다.',
          accent: categories.platform.color,
          Icon: Database,
          visualIcon: IconDashboard,
        },
        {
          title: '운영 · 확장 레이어',
          body: '프로젝트, 표준서, 커스텀 구축까지 연결해 도입 이후의 안정화와 확장까지 함께 봅니다.',
          accent: categories.project.color,
          Icon: Users2,
          visualIcon: IconWorkflow,
        },
      ]
    : [
        {
          title: 'Production execution layer',
          body: 'We center the interfaces and logic that directly run lines, from MES and work instructions to traceability.',
          accent: categories.production.color,
          Icon: Factory,
          visualIcon: IconManufacturing,
        },
        {
          title: 'Data and monitoring layer',
          body: 'We capture quality, equipment, and environment data so decisions happen faster and with clearer context.',
          accent: categories.platform.color,
          Icon: Database,
          visualIcon: IconDashboard,
        },
        {
          title: 'Operations and expansion layer',
          body: 'Projects, work standards, and custom delivery connect implementation with stabilization and scale.',
          accent: categories.project.color,
          Icon: Users2,
          visualIcon: IconWorkflow,
        },
      ];

  const projectPoints = ko
    ? [
        '레거시 유지보수부터 신규 구축까지 고객 환경에 맞춘 단계별 접근',
        'LG CNS 1차 파트너 경험을 바탕으로 한 대기업형 프로젝트 운영',
        '현장 오픈 이후 안정화와 확장까지 고려한 장기 고도화 구조',
        '표준 제품과 커스텀 요구를 함께 반영하는 하이브리드 방식',
      ]
    : [
        'Phased delivery shaped to each customer environment, from legacy maintenance to greenfield builds',
        'Enterprise-grade project operation backed by LG CNS tier-1 partnership experience',
        'A modernization structure that includes post-launch stabilization and expansion',
        'A hybrid model that blends standard products with custom operational requirements',
      ];

  const domainSignals = ko
    ? [
        { label: '라이브 대시보드', accent: categories.platform.color, Icon: IconDashboard },
        { label: '이상 알람 흐름', accent: categories.quality.color, Icon: IconBell },
        { label: '리포트 · 연동', accent: categories.production.color, Icon: IconReport },
      ]
    : [
        { label: 'Live dashboards', accent: categories.platform.color, Icon: IconDashboard },
        { label: 'Alert flows', accent: categories.quality.color, Icon: IconBell },
        { label: 'Reports and sync', accent: categories.production.color, Icon: IconReport },
      ];

  const visualStories = ko
    ? [
        {
          eyebrow: 'WORKFLOW',
          title: '승인 · 알람 리듬',
          body: '작업지시, 승인, 이상 대응이 한 흐름으로 이어지면서 현장 운영 화면이 더 제품처럼 보이도록 구성합니다.',
          accent: categories.project.color,
          Icon: IconWorkflow,
          tags: ['Paperless', 'Approval', 'Escalation'],
        },
        {
          eyebrow: 'INTEGRATION',
          title: '리포트 · API 연결',
          body: 'ERP, MES, 현장 리포트까지 연결되는 연동 장면을 드러내면 B2B 서비스 페이지의 신뢰감이 더 강해집니다.',
          accent: categories.platform.color,
          Icon: IconAPI,
          tags: ['ERP', 'REST API', 'Reports'],
        },
      ]
    : [
        {
          eyebrow: 'WORKFLOW',
          title: 'Approval and alert rhythm',
          body: 'Work orders, approvals, and anomaly response should feel like one connected operational flow.',
          accent: categories.project.color,
          Icon: IconWorkflow,
          tags: ['Paperless', 'Approval', 'Escalation'],
        },
        {
          eyebrow: 'INTEGRATION',
          title: 'Reports and API connection',
          body: 'Showing how reports and connected systems link together adds trust to an enterprise service page.',
          accent: categories.platform.color,
          Icon: IconAPI,
          tags: ['ERP', 'REST API', 'Reports'],
        },
      ];

  return (
    <>
      <section
        className="relative overflow-hidden bg-[var(--apple-surface-white)] scroll-mt-[calc(var(--app-header-offset)+3rem)]"
        aria-labelledby="services-page-title"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 85% 65% at 10% 0%, rgba(179,7,16,0.09), transparent 45%), radial-gradient(ellipse 70% 55% at 100% 10%, rgba(0,113,227,0.08), transparent 48%)',
          }}
        />
        <div className="relative wiz-section py-16 md:py-22 lg:py-24">
          <motion.div className="mx-auto max-w-4xl text-center" {...m}>
            <p className="text-[11px] font-semibold uppercase tracking-[var(--tracking-widest)] text-[var(--apple-text-tertiary)]">
              {p.eyebrow}
            </p>
            <h1
              id="services-page-title"
              className="mt-4 text-[length:var(--text-display-2xl)] font-bold leading-[var(--leading-tightest)] tracking-[var(--tracking-tighter)] text-[var(--apple-text-primary)]"
            >
              {p.title}
            </h1>
            <p className="mx-auto mt-7 max-w-3xl text-[length:var(--text-body-xl)] font-medium leading-[var(--leading-relaxed)] text-[var(--apple-text-secondary)]">
              {p.lead}
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-3">
              <Button size="lg" className="rounded-full px-7" asChild>
                <Link to="/about/cases">
                  {ko ? '사례 보기' : 'View cases'}
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-full border-black/[0.08] bg-white px-7"
                onClick={openContact}
              >
                {ko ? '문의하기' : 'Talk with us'}
              </Button>
            </div>
          </motion.div>

          <div className="mt-14 grid gap-5 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
            <motion.div {...m} transition={reduceMotion ? { duration: 0 } : { ...fadeUp.transition, delay: 0.06 }}>
              <SurfaceCard className="h-full p-7 md:p-8">
                <p className="text-[11px] font-semibold uppercase tracking-[var(--tracking-widest)] text-[var(--apple-text-tertiary)]">
                  {ko ? '서비스 구조' : 'Service structure'}
                </p>
                <h2 className="mt-4 max-w-[16ch] text-[length:var(--text-display-sm)] font-bold leading-[var(--leading-tight)] tracking-[var(--tracking-tight)] text-[var(--apple-text-primary)]">
                  {ko ? '생산 실행부터 운영 확장까지 같은 구조로 연결합니다' : 'One structure from production execution to operational scale'}
                </h2>
                <ServiceTopologyPanel cards={structureCards} language={language} reduceMotion={reduceMotion} />
                <div className="mt-8 grid gap-3 sm:grid-cols-3">
                  {heroMetrics.map(metric => (
                    <MetricCard key={metric.label} value={metric.value} label={metric.label} />
                  ))}
                </div>
                <div className="mt-8 grid gap-4 md:grid-cols-3">
                  {structureCards.map(card => (
                    <StructureCard
                      key={card.title}
                      title={card.title}
                      body={card.body}
                      accent={card.accent}
                      Icon={card.Icon}
                    />
                  ))}
                </div>
              </SurfaceCard>
            </motion.div>

            <motion.div {...m} transition={reduceMotion ? { duration: 0 } : { ...fadeUp.transition, delay: 0.1 }}>
              <SurfaceCard className="h-full p-7 md:p-8">
                <div className="flex items-center gap-2 text-[var(--brand-red)]">
                  <Sparkles className="size-4" />
                  <p className="text-[11px] font-semibold uppercase tracking-[var(--tracking-widest)]">
                    {ko ? '서비스 도메인' : 'Service domains'}
                  </p>
                </div>
                <div className="mt-6 grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                  {domainSignals.map(signal => (
                    <FlowSignalChip key={signal.label} label={signal.label} accent={signal.accent} Icon={signal.Icon} />
                  ))}
                </div>
                <div className="mt-4 space-y-3">
                  {groups.map(group => (
                    <DomainRow
                      key={group.key}
                      href={`#${group.anchor}`}
                      title={group.title}
                      desc={group.desc}
                      count={
                        group.solutions.length > 0
                          ? ko
                            ? `${group.solutions.length}개`
                            : `${group.solutions.length}`
                          : ko
                            ? 'Custom'
                            : 'Custom'
                      }
                      accent={group.accent}
                      Icon={group.icon}
                    />
                  ))}
                </div>
              </SurfaceCard>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="apple-section-gray border-y border-black/[0.05]">
        <div className="wiz-section py-5">
          <nav className="flex flex-wrap gap-2" aria-label={ko ? '서비스 도메인 바로가기' : 'Service domain quick links'}>
            {groups.map(group => (
              <a
                key={group.key}
                href={`#${group.anchor}`}
                className="rounded-full border border-black/[0.08] bg-white px-4 py-2 text-sm font-semibold text-[var(--apple-text-primary)] transition-colors hover:bg-black/[0.03]"
              >
                {group.title}
              </a>
            ))}
          </nav>
        </div>
      </section>

      <section className="apple-section-white border-b border-black/[0.05]" aria-labelledby="services-visual-title">
        <div className="wiz-section py-20 md:py-24">
          <motion.div className="max-w-3xl" {...m}>
            <p className="text-[11px] font-semibold uppercase tracking-[var(--tracking-widest)] text-[var(--apple-text-tertiary)]">
              {ko ? '시각 경험' : 'Visual experience'}
            </p>
            <h2
              id="services-visual-title"
              className="mt-4 text-[length:var(--text-display-sm)] font-bold leading-[var(--leading-tight)] tracking-[var(--tracking-tight)] text-[var(--apple-text-primary)]"
            >
              {ko ? '설명보다 먼저, 운영 장면이 보이도록 재구성했습니다' : 'We restructured the page so the operational scene appears before the explanation'}
            </h2>
            <p className="mt-5 text-[length:var(--text-body-lg)] leading-[var(--leading-loose)] text-[var(--apple-text-secondary)]">
              {ko
                ? '현재 IT 솔루션 페이지는 단순한 목록보다, 실시간 대시보드·워크플로우·연동 구조를 제품형 화면처럼 보여주는 방식이 더 강한 설득력을 만듭니다.'
                : 'Current IT solution pages persuade more effectively when they show dashboard, workflow, and integration moments as product-like views instead of plain lists.'}
            </p>
          </motion.div>

          <div className="mt-10 grid gap-5 xl:grid-cols-[minmax(0,1.18fr)_minmax(0,0.82fr)]">
            <motion.div {...m} transition={reduceMotion ? { duration: 0 } : { ...fadeUp.transition, delay: 0.04 }}>
              <OperationsShowcaseCard groups={groups} language={language} reduceMotion={reduceMotion} />
            </motion.div>

            <div className="grid gap-5">
              {visualStories.map((story, index) => (
                <motion.div
                  key={story.title}
                  {...m}
                  transition={
                    reduceMotion
                      ? { duration: 0 }
                      : { ...fadeUp.transition, delay: 0.08 + index * 0.05 }
                  }
                >
                  <VisualStoryCard
                    eyebrow={story.eyebrow}
                    title={story.title}
                    body={story.body}
                    accent={story.accent}
                    Icon={story.Icon}
                    tags={story.tags}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {solutionGroups.map((group, sectionIndex) => {
        const gridClass =
          group.solutions.length >= 3
            ? 'md:grid-cols-2 xl:grid-cols-3'
            : 'lg:grid-cols-2';

        return (
          <section
            key={group.key}
            id={group.anchor}
            className={sectionIndex % 2 === 0 ? 'apple-section-white scroll-mt-[calc(var(--app-header-offset)+6rem)]' : 'apple-section-gray scroll-mt-[calc(var(--app-header-offset)+6rem)]'}
            aria-labelledby={`${group.anchor}-title`}
          >
            <div className="wiz-section py-20 md:py-24">
              <motion.div {...m}>
                <p className="text-[11px] font-semibold uppercase tracking-[var(--tracking-widest)] text-[var(--apple-text-tertiary)]">
                  {getCategoryLabel(group.key as CategoryKey, language)}
                </p>
                <div className="mt-4 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                  <div className="max-w-3xl">
                    <h2
                      id={`${group.anchor}-title`}
                      className="text-[length:var(--text-display-sm)] font-bold leading-[var(--leading-tight)] tracking-[var(--tracking-tight)] text-[var(--apple-text-primary)]"
                    >
                      {group.title}
                    </h2>
                    <p className="mt-5 max-w-2xl text-[length:var(--text-body-lg)] leading-[var(--leading-loose)] text-[var(--apple-text-secondary)]">
                      {group.desc}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span
                      className="rounded-full px-3.5 py-1.5 text-[12px] font-semibold"
                      style={{ background: `${group.accent}12`, color: group.accent }}
                    >
                      {ko ? `${group.solutions.length}개 솔루션` : `${group.solutions.length} solutions`}
                    </span>
                    <span className="rounded-full border border-black/[0.06] bg-white px-3.5 py-1.5 text-[12px] font-semibold text-[var(--apple-text-secondary)]">
                      {p.effects[sectionIndex % p.effects.length]}
                    </span>
                  </div>
                </div>
              </motion.div>

              <div className={cn('mt-10 grid gap-5', gridClass)}>
                {group.solutions.map((solution, index) => (
                  <motion.div
                    key={solution.id}
                    {...m}
                    transition={
                      reduceMotion
                        ? { duration: 0 }
                        : { ...fadeUp.transition, delay: 0.05 + index * 0.05 }
                    }
                  >
                    <SolutionCard
                      solution={solution}
                      language={language}
                      accent={group.accent}
                      reduceMotion={reduceMotion}
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        );
      })}

      {projectGroup ? (
        <section
          id={projectGroup.anchor}
          className="apple-section-dark relative overflow-hidden scroll-mt-[calc(var(--app-header-offset)+6rem)]"
          aria-labelledby="services-project-title"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse 80% 60% at 15% 20%, rgba(255,255,255,0.10), transparent 45%), radial-gradient(ellipse 70% 50% at 85% 80%, rgba(179,7,16,0.18), transparent 48%)',
            }}
          />
          <div className="relative wiz-section py-20 md:py-24">
            <motion.div className="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16" {...m}>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[var(--tracking-widest)] text-white/45">
                  {ko ? '프로젝트 · 커스텀' : 'Projects & custom'}
                </p>
                <h2
                  id="services-project-title"
                  className="mt-4 max-w-[14ch] text-[length:var(--text-display-sm)] font-bold leading-[var(--leading-tight)] tracking-[var(--tracking-tight)] text-white"
                >
                  {ko ? '표준 솔루션을 넘어 고객 환경에 맞게 확장합니다' : 'We extend beyond standard products to fit each customer environment'}
                </h2>
                <p className="mt-6 max-w-xl text-[length:var(--text-body-lg)] leading-[var(--leading-loose)] text-white/72">
                  {projectGroup.desc}
                </p>
                <Button size="lg" className="mt-8 rounded-full px-7" onClick={openContact}>
                  {ko ? '맞춤 구축 문의' : 'Ask about custom delivery'}
                  <ArrowRight className="size-4" />
                </Button>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {projectPoints.map(point => (
                  <div
                    key={point}
                    className="rounded-[1.4rem] border border-white/10 bg-white/[0.06] px-5 py-5 text-sm leading-[var(--leading-relaxed)] text-white/78 backdrop-blur-xl"
                    style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08)' }}
                  >
                    {point}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      ) : null}

      <section className="apple-section-gray" aria-labelledby="services-effects-title">
        <div className="wiz-section py-20 md:py-24">
          <motion.div className="mx-auto max-w-3xl text-center" {...m}>
            <p className="text-[11px] font-semibold uppercase tracking-[var(--tracking-widest)] text-[var(--apple-text-tertiary)]">
              {p.effectsTitle}
            </p>
            <h2
              id="services-effects-title"
              className="mt-4 text-[length:var(--text-display-sm)] font-bold tracking-[var(--tracking-tight)] text-[var(--apple-text-primary)]"
            >
              {ko ? '도입 이후 기대할 수 있는 운영 변화' : 'Operational shifts these services can create'}
            </h2>
          </motion.div>

          <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {p.effects.map((effect, index) => (
              <motion.div
                key={effect}
                {...m}
                transition={
                  reduceMotion
                    ? { duration: 0 }
                    : { ...fadeUp.transition, delay: 0.05 + index * 0.04 }
                }
              >
                <SurfaceCard className="h-full p-6 md:p-7">
                  <p className="text-[2.2rem] font-bold leading-none tracking-[var(--tracking-tighter)] text-[var(--apple-text-primary)]/[0.08]">
                    {String(index + 1).padStart(2, '0')}
                  </p>
                  <p className="mt-6 text-sm leading-[var(--leading-relaxed)] text-[var(--apple-text-secondary)]">
                    {effect}
                  </p>
                </SurfaceCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <AboutCtaBand
        title={s.cta.title}
        primaryLabel={s.cta.button}
        secondaryLabel={ko ? '사례 보기' : 'Case studies'}
        onPrimary={openContact}
        secondaryTo="/about/cases"
      />
    </>
  );
}
