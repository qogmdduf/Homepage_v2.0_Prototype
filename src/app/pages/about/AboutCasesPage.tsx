import { useMemo, useState } from 'react';
import { Link } from 'react-router';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { caseStudies, getAboutSections, type CaseIndustry } from '../../data/aboutSectionsContent';
import { AboutCtaBand, AboutPageHero } from '../../components/about/AboutPageUi';
import { cn } from '../../components/ui/utils';

export function AboutCasesPage() {
  const { language } = useLanguage();
  const s = getAboutSections(language);
  const p = s.cases;
  const [filter, setFilter] = useState<CaseIndustry | 'all'>('all');
  const openContact = () => window.dispatchEvent(new CustomEvent('openContactModal'));

  const filtered = useMemo(() => {
    if (filter === 'all') return caseStudies;
    return caseStudies.filter(c => c.industry === filter);
  }, [filter]);

  return (
    <>
      <section className="apple-section-white">
        <div className="wiz-section py-14 md:py-20">
          <AboutPageHero eyebrow={p.eyebrow} title={p.title} lead={p.lead} />
          <div className="mb-10 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setFilter('all')}
              className={cn(
                'rounded-full px-4 py-2 text-sm font-medium transition-colors',
                filter === 'all'
                  ? 'bg-[var(--apple-text-primary)] text-white'
                  : 'bg-[var(--apple-bg-primary)] text-[var(--apple-text-secondary)] hover:bg-black/[0.06]',
              )}
            >
              {p.filterAll}
            </button>
            {(Object.keys(p.filterLabels) as CaseIndustry[]).map(key => (
              <button
                key={key}
                type="button"
                onClick={() => setFilter(key)}
                className={cn(
                  'rounded-full px-4 py-2 text-sm font-medium transition-colors',
                  filter === key
                    ? 'bg-[var(--apple-text-primary)] text-white'
                    : 'bg-[var(--apple-bg-primary)] text-[var(--apple-text-secondary)] hover:bg-black/[0.06]',
                )}
              >
                {p.filterLabels[key]}
              </button>
            ))}
          </div>
          <ul className="grid gap-4 md:grid-cols-2">
            {filtered.map(c => {
              const copy = language === 'ko' ? c.ko : c.en;
              return (
                <li key={c.id}>
                  <Link
                    to={`/about/cases/${c.id}`}
                    className="flex h-full flex-col rounded-2xl border border-black/[0.06] bg-[var(--apple-surface-white)] p-6 shadow-sm transition-shadow hover:shadow-md"
                  >
                    <span className="text-[10px] font-semibold uppercase tracking-wide text-[var(--apple-blue)]">
                      {p.filterLabels[c.industry]}
                    </span>
                    <span className="mt-2 text-lg font-semibold text-[var(--apple-text-primary)]">
                      {copy.title}
                    </span>
                    <span className="mt-2 flex-1 text-sm leading-relaxed text-[var(--apple-text-secondary)]">
                      {copy.summary}
                    </span>
                    <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-[var(--apple-blue)]">
                      {language === 'ko' ? '사례 상세' : 'Read story'}
                      <ArrowRight className="size-4" />
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

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
