import { useMemo, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import type { CompanyTimelineCategory, CompanyTimelineEntry } from '../../data/aboutSectionsContent';
import { cn } from '../ui/utils';

/** 연혁 섹션 배경과 통일 · 최신 연도 우선 · 카드 없이 구분선 위주 */

const CATEGORY_STYLE: Record<CompanyTimelineCategory, { pill: string }> = {
  establishment: { pill: 'bg-[#E8F3FF] text-[#1B64DA]' },
  contract: { pill: 'bg-[#E8F3FF] text-[#1B64DA]' },
  patent: { pill: 'bg-violet-50 text-violet-700' },
  award: { pill: 'bg-amber-50 text-amber-900' },
  cert: { pill: 'bg-emerald-50 text-emerald-800' },
  global: { pill: 'bg-sky-50 text-sky-900' },
  product: { pill: 'bg-slate-100 text-slate-800' },
  maintenance: { pill: 'bg-orange-50 text-orange-900' },
  outlook: { pill: 'bg-purple-50 text-purple-900' },
  partner: { pill: 'bg-[var(--brand-red)]/10 text-[var(--brand-red)]' },
};

const LABELS_KO: Record<CompanyTimelineCategory, string> = {
  establishment: '설립',
  contract: '계약',
  patent: '특허·IP',
  award: '수상',
  cert: '인증',
  global: '글로벌',
  product: '제품·구축',
  maintenance: '유지보수',
  outlook: '전망',
  partner: '파트너',
};

const LABELS_EN: Record<CompanyTimelineCategory, string> = {
  establishment: 'Founded',
  contract: 'Contract',
  patent: 'Patent & IP',
  award: 'Award',
  cert: 'Certification',
  global: 'Global',
  product: 'Product',
  maintenance: 'Maintenance',
  outlook: 'Outlook',
  partner: 'Partner',
};

const LATEST_STRIP_COUNT = 5;

/** 플랫 달력: 정사각형(1:1) 비율 고정 — 행 높이와 무관하게 늘어나지 않음 */
function CalendarMonthMark({ monthLabel, className }: { monthLabel: string; className?: string }) {
  return (
    <span className={cn('relative inline-flex aspect-square w-9 shrink-0 overflow-visible', className)} aria-hidden>
      <span className="flex h-full min-h-0 w-full flex-col overflow-hidden rounded-[9px] border border-black/[0.08] bg-white">
        <span className="min-h-[8px] shrink-0 basis-[28%] rounded-t-[8px] bg-[var(--brand-red)]" />
        <span className="flex min-h-0 flex-1 items-center justify-center px-0.5 pb-px pt-px">
          <span className="max-w-full break-words text-center text-[8px] font-bold leading-tight text-[#424242]">
            {monthLabel}
          </span>
        </span>
      </span>
      <span className="pointer-events-none absolute left-0 right-0 top-px z-10 flex justify-center gap-1 -translate-y-1/2">
        {[0, 1, 2].map((i) => (
          <span key={i} className="h-2 w-[2px] shrink-0 rounded-full bg-[#424242]" />
        ))}
      </span>
    </span>
  );
}

/** 한국어 리드에서 첫 콤마만 Jua(둥근 ‘콩나물’ 느낌)로 렌더 */
function LeadWithRoundComma({ text, lang }: { text: string; lang: 'ko' | 'en' }) {
  if (lang !== 'ko') return <>{text}</>;
  const i = text.indexOf(',');
  if (i === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, i)}
      <span
        className="inline align-baseline text-[1.12em] leading-none"
        style={{ fontFamily: "'Jua', system-ui, sans-serif", fontWeight: 400 }}
      >
        ,
      </span>
      {text.slice(i + 1)}
    </>
  );
}

export function CompanyHistoryTimeline({
  entries,
  lang,
  lead,
}: {
  entries: CompanyTimelineEntry[];
  lang: 'ko' | 'en';
  /** 토스 팀 페이지식 한 줄 서술 (히어로 카피) */
  lead?: string;
}) {
  const t = useMemo(
    () => ({
      latestStrip: lang === 'ko' ? '최신 이벤트' : 'Latest events',
      noEvents: lang === 'ko' ? '이 연도에 등록된 이벤트가 없습니다.' : 'No events for this year.',
      pickYear: lang === 'ko' ? '연도를 선택하세요' : 'Choose a year',
    }),
    [lang],
  );

  /** 최신 연도부터 (2026 → …) */
  const years = useMemo(
    () => [...new Set(entries.map((e) => e.year))].sort((a, b) => b - a),
    [entries],
  );

  const byYear = useMemo(() => {
    const m = new Map<number, CompanyTimelineEntry[]>();
    for (const e of entries) {
      const arr = m.get(e.year) ?? [];
      arr.push(e);
      m.set(e.year, arr);
    }
    return m;
  }, [entries]);

  const latestYear = years[0] ?? new Date().getFullYear();

  const [openYear, setOpenYear] = useState<number>(latestYear);
  /** 최신 이벤트 리스트 아코디언 — 한 번에 하나만 펼침 */
  const [expandedStripId, setExpandedStripId] = useState<string | null>(null);
  const list = byYear.get(openYear) ?? [];

  useEffect(() => {
    setExpandedStripId(null);
  }, [openYear]);

  /** 같은 연도 내 데이터는 시간순(오래된 → 최신) → 최신 5개만, 화면에는 최신이 위로 */
  const latestStripEntries = useMemo(() => {
    if (list.length === 0) return [];
    return list.slice(-LATEST_STRIP_COUNT).reverse();
  }, [list]);

  const toggleStripAccordion = useCallback((id: string) => {
    setExpandedStripId((prev) => (prev === id ? null : id));
  }, []);

  return (
    <div className="relative bg-transparent">
      {lead?.trim() && (
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="mb-10 max-w-3xl whitespace-pre-line text-[clamp(1.35rem,3.8vw,1.85rem)] font-semibold leading-[1.55] tracking-[-0.03em] text-[var(--apple-text-primary)] md:mb-12 md:leading-[1.5]"
        >
          <LeadWithRoundComma text={lead.trim()} lang={lang} />
        </motion.p>
      )}
      <div className="relative flex flex-col lg:flex-row lg:gap-0">
        {/* ── 세로 챕터 내비 (데스크톱) ── */}
        <aside className="relative shrink-0 border-b border-black/[0.06] lg:w-[min(28%,200px)] lg:border-b-0 lg:border-r lg:border-black/[0.08]">
          <div className="sticky top-[calc(var(--app-header-offset)+12px)] flex flex-col gap-0 px-4 py-6 md:px-6 lg:min-h-[420px] lg:py-10">
            {/* 모바일: 가로 스냅 칩 */}
            <div
              className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] lg:hidden [&::-webkit-scrollbar]:hidden"
              role="tablist"
            >
              {years.map((y) => (
                <YearTab
                  key={y}
                  year={y}
                  count={(byYear.get(y) ?? []).length}
                  active={openYear === y}
                  onSelect={() => setOpenYear(y)}
                  compact
                />
              ))}
            </div>
            {/* 데스크톱: 세로 타임라인 + 연도 */}
            <nav
              className="relative hidden lg:flex lg:flex-col lg:gap-0"
              role="tablist"
              aria-label={t.pickYear}
            >
              {/* 맨 위 포인트 원 중앙에서 시작 → 아래로 연장 (py-3 + size-10 트랙 세로중앙) */}
              <div
                aria-hidden
                className="pointer-events-none absolute left-7 top-[calc(0.75rem+1.25rem)] -bottom-8 z-0 w-[2px] -translate-x-1/2 bg-black/[0.12]"
              />
              {years.map((y) => (
                <YearTab
                  key={y}
                  year={y}
                  count={(byYear.get(y) ?? []).length}
                  active={openYear === y}
                  onSelect={() => setOpenYear(y)}
                />
              ))}
            </nav>
          </div>
        </aside>

        {/* ── 본문: 에디토리얼 블록 ── */}
        <div className="min-w-0 flex-1 px-4 pb-10 pt-6 md:px-8 md:pb-12 md:pt-10 lg:pl-6 lg:pr-12 lg:pb-14 lg:pt-[calc(2.5rem+0.75rem+1.25rem-0.375rem)]">
          <AnimatePresence mode="wait">
            <motion.div
              key={openYear}
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              {list.length === 0 ? (
                <p className="py-16 text-center text-[15px] leading-relaxed text-[var(--apple-text-secondary)]">{t.noEvents}</p>
              ) : (
                <>
                  <section className="mb-8 overflow-visible md:mb-10">
                    <p className="mb-0 pb-2 text-[12px] font-bold uppercase leading-none tracking-[0.12em] text-[var(--apple-text-tertiary)]">
                      {t.latestStrip}
                    </p>
                    <ul className="divide-y divide-black/[0.06] overflow-visible border-y border-black/[0.06] pt-1">
                      {latestStripEntries.map((entry) => {
                        const st = CATEGORY_STYLE[entry.category];
                        const catLabel = lang === 'ko' ? LABELS_KO[entry.category] : LABELS_EN[entry.category];
                        const hasDetail = Boolean(entry.detail?.trim());
                        const expanded = expandedStripId === entry.id;
                        return (
                          <li key={entry.id} className="overflow-visible">
                            <div className="flex flex-col">
                              <button
                                type="button"
                                disabled={!hasDetail}
                                aria-expanded={hasDetail ? expanded : undefined}
                                aria-label={
                                  hasDetail
                                    ? expanded
                                      ? lang === 'ko'
                                        ? '상세 접기'
                                        : 'Collapse details'
                                      : lang === 'ko'
                                        ? '상세 펼치기'
                                        : 'Expand details'
                                    : undefined
                                }
                                onClick={() => hasDetail && toggleStripAccordion(entry.id)}
                                className={cn(
                                  'grid w-full grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-x-1.5 overflow-visible px-2.5 py-1.5 text-left transition-colors md:gap-x-3 md:px-3 md:py-2',
                                  expanded ? 'bg-black/[0.03]' : 'hover:bg-black/[0.02]',
                                  !hasDetail && 'cursor-default hover:bg-transparent',
                                )}
                              >
                                <span className="flex shrink-0 items-center justify-center self-center">
                                  <CalendarMonthMark monthLabel={entry.month} />
                                </span>
                                <div className="flex min-h-[2.25rem] min-w-0 flex-col justify-center gap-0.5">
                                  <span
                                    className={cn(
                                      'inline-flex w-fit rounded px-1.5 py-px text-[9px] font-bold leading-none tracking-tight md:text-[10px]',
                                      st.pill,
                                    )}
                                  >
                                    {catLabel}
                                  </span>
                                  <p className="line-clamp-3 text-[13px] font-semibold leading-snug tracking-[-0.02em] text-[var(--apple-text-primary)] md:text-[14px]">
                                    {entry.headline}
                                  </p>
                                </div>
                                {hasDetail ? (
                                  <span className="flex shrink-0 items-center justify-center self-center text-[var(--apple-text-tertiary)]">
                                    <ChevronDown
                                      className={cn('size-4 transition-transform duration-200 md:size-[1.125rem]', expanded && 'rotate-180')}
                                    />
                                  </span>
                                ) : (
                                  <span className="w-7 shrink-0 self-center md:w-8" aria-hidden />
                                )}
                              </button>
                              <AnimatePresence initial={false}>
                                {hasDetail && expanded && (
                                  <motion.div
                                    key="detail"
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                                    className="overflow-hidden border-t border-black/[0.06] bg-black/[0.02]"
                                  >
                                    <p className="px-2.5 pb-2.5 pl-[calc(0.625rem+2.25rem+0.375rem)] pt-2 text-[13px] leading-relaxed text-[var(--apple-text-secondary)] md:px-3 md:pb-2.5 md:pl-[calc(0.75rem+2.25rem+0.75rem)] md:pt-2 md:text-[14px] md:leading-[1.7]">
                                      {entry.detail}
                                    </p>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </section>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function YearTab({
  year,
  count,
  active,
  onSelect,
  compact,
}: {
  year: number;
  count: number;
  active: boolean;
  onSelect: () => void;
  compact?: boolean;
}) {
  if (compact) {
    return (
      <button
        type="button"
        role="tab"
        aria-selected={active}
        onClick={onSelect}
        className={cn(
          'shrink-0 snap-start rounded-full px-4 py-2.5 text-[14px] font-semibold tabular-nums transition-all',
          active
            ? 'bg-[var(--apple-text-primary)] text-white'
            : 'text-[var(--apple-text-secondary)] ring-1 ring-black/[0.08] hover:bg-black/[0.03]',
        )}
      >
        {year}
        <span className={cn('ml-1.5 text-[11px] font-medium tabular-nums', active ? 'text-white/75' : 'text-[var(--apple-text-tertiary)]')}>
          {count}
        </span>
      </button>
    );
  }

  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onSelect}
      className={cn(
        'group relative z-10 flex w-full flex-col gap-1 rounded-xl px-2 py-3 text-left',
        'transition-[transform,background-color] duration-200 ease-out',
        'hover:bg-black/[0.04] active:scale-[0.985] active:bg-black/[0.07]',
      )}
    >
      {/* 1행: 포인트 + 연도 — 같은 줄에서 수직 중앙 정렬 */}
      <div className="flex items-center gap-3">
        <span className="relative flex size-10 shrink-0 items-center justify-center">
          <span
            aria-hidden
            className={cn(
              'absolute z-[1] inline-flex size-7 rounded-full bg-[var(--brand-red)]/35',
              active
                ? 'animate-[history-year-ping_2.2s_ease-out_infinite]'
                : 'opacity-0 animate-none group-hover:animate-[history-year-ping_2.2s_ease-out_infinite] group-hover:opacity-100',
            )}
          />
          <span
            className={cn(
              'relative z-[2] size-[14px] shrink-0 rounded-full transition-transform duration-200',
              'group-hover:scale-110 group-active:scale-95',
              active ? 'bg-[var(--brand-red)]' : 'bg-[#C7C7CC] group-hover:bg-[var(--brand-red)]',
            )}
          />
        </span>
        <span
          className={cn(
            'min-w-0 text-[22px] font-bold leading-none tabular-nums tracking-tight transition-transform duration-200',
            'group-hover:translate-x-0.5',
            active ? 'text-[var(--apple-text-primary)]' : 'text-[var(--apple-text-tertiary)] group-hover:text-[var(--apple-text-primary)]',
          )}
        >
          {year}
        </span>
      </div>
      {/* 2행: 개수 — 포인트 열만큼 띄우고 연도와 같은 텍스트 열에 정렬 */}
      <div className="flex items-center gap-3">
        <span className="w-10 shrink-0" aria-hidden />
        <span className="text-[12px] font-medium leading-none tabular-nums text-[var(--apple-text-tertiary)]">
          {count}
        </span>
      </div>
    </button>
  );
}

