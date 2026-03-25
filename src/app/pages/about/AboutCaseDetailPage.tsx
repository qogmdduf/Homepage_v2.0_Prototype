import { useEffect } from 'react';
import { Link, useParams } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { getAboutSections, getCaseStudy } from '../../data/aboutSectionsContent';
import { AboutCtaBand, AboutSectionImage } from '../../components/about/AboutPageUi';
import { Button } from '../../components/ui/button';
import { NotFoundPage } from '../NotFoundPage';

export function AboutCaseDetailPage() {
  const { caseId } = useParams<{ caseId: string }>();
  const { language } = useLanguage();
  const s = getAboutSections(language);
  const pack = caseId ? getCaseStudy(caseId, language) : null;
  const openContact = () => window.dispatchEvent(new CustomEvent('openContactModal'));

  useEffect(() => {
    if (!pack) return;
    document.title = `${pack.copy.title}${s.metaTitleSuffix}`;
    return () => {
      document.title = 'WIZFACTORY';
    };
  }, [pack, s.metaTitleSuffix]);

  if (!caseId || !pack) {
    return <NotFoundPage />;
  }

  const { def, copy } = pack;

  return (
    <>
      <section className="apple-section-white">
        <div className="wiz-section py-14 md:py-20">
          <Button variant="ghost" size="sm" className="mb-8 -ml-2 gap-1 text-[var(--apple-text-secondary)]" asChild>
            <Link to="/about/cases">
              <ArrowLeft className="size-4" />
              {language === 'ko' ? '사례 목록' : 'All cases'}
            </Link>
          </Button>
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--apple-text-secondary)]">
            {s.cases.detailEyebrow} · {s.cases.filterLabels[def.industry]}
          </p>
          <h1 className="text-[length:var(--text-display-sm)] font-bold tracking-[var(--tracking-tight)] text-[var(--apple-text-primary)] md:text-[length:var(--text-display-md)]">
            {copy.title}
          </h1>
          <p className="mt-4 max-w-3xl text-[length:var(--text-body-lg)] text-[var(--apple-text-secondary)]">
            {copy.summary}
          </p>
          {def.image ? (
            <div className="mt-10 max-w-3xl">
              <AboutSectionImage src={def.image} alt={copy.title} />
            </div>
          ) : null}
        </div>
      </section>

      <section className="apple-section-gray">
        <div className="wiz-section py-14 md:py-20">
          <div className="mx-auto max-w-3xl space-y-10">
            <div>
              <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-[var(--brand-red)]">
                {language === 'ko' ? '문제' : 'Problem'}
              </h2>
              <p className="text-[length:var(--text-body-md)] leading-[var(--leading-relaxed)] text-[var(--apple-text-primary)]">
                {copy.problem}
              </p>
            </div>
            <div>
              <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-[var(--apple-blue)]">
                {language === 'ko' ? '해결' : 'Solution'}
              </h2>
              <p className="text-[length:var(--text-body-md)] leading-[var(--leading-relaxed)] text-[var(--apple-text-primary)]">
                {copy.solution}
              </p>
            </div>
            <div>
              <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-[var(--apple-text-primary)]">
                {language === 'ko' ? '결과' : 'Outcome'}
              </h2>
              <p className="text-[length:var(--text-body-md)] leading-[var(--leading-relaxed)] text-[var(--apple-text-primary)]">
                {copy.result}
              </p>
            </div>
            {copy.metrics?.length ? (
              <div className="flex flex-wrap gap-3">
                {copy.metrics.map((m, i) => (
                  <div
                    key={i}
                    className="rounded-xl border border-black/[0.08] bg-[var(--apple-surface-white)] px-4 py-3"
                  >
                    <p className="text-[10px] font-semibold uppercase text-[var(--apple-text-secondary)]">{m.label}</p>
                    <p className="text-lg font-bold text-[var(--apple-text-primary)]">{m.value}</p>
                  </div>
                ))}
              </div>
            ) : null}
            {copy.testimonial ? (
              <blockquote className="border-l-4 border-[var(--apple-blue)] pl-4 text-sm italic text-[var(--apple-text-secondary)]">
                {copy.testimonial}
              </blockquote>
            ) : null}
          </div>
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
