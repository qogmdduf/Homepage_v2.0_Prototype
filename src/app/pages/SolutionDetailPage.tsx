import { useParams, Link } from 'react-router';
import { useEffect, useRef } from 'react';
import { solutions } from '../data/solutions';
import { useLanguage } from '../contexts/LanguageContext';
import { SolutionDetailContent } from '../components/SolutionModal';

export function SolutionDetailPage() {
  const { t, language } = useLanguage();
  const { id } = useParams();
  const ko = language === 'ko';
  const solution = solutions.find(s => s.id === id);

  const contentRef = useRef<HTMLDivElement>(null);
  const glassScrollRef = useRef<HTMLDivElement>(null);
  const wizFlowScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!solution) {
    return (
      <div className="min-h-screen bg-white" style={{ paddingTop: 'var(--app-header-offset)' }}>
        <div className="wiz-section py-16 text-center">
          <h2 className="text-3xl font-bold mb-4" style={{ color: 'var(--apple-text-primary)' }}>{t('detail.notFound')}</h2>
          <Link to="/" className="font-semibold" style={{ color: 'var(--apple-blue)' }}>
            {t('detail.returnHome')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex min-h-dvh flex-col bg-[var(--apple-surface-gray)]"
      style={{ paddingTop: 'var(--app-header-offset)' }}
    >
      <div className="flex min-h-0 flex-1 flex-col">
        <SolutionDetailContent
          s={solution}
          ko={ko}
          language={language}
          t={t}
          variant="page"
          contentRef={contentRef}
          wizFlowScrollRef={wizFlowScrollRef}
          glassScrollRef={glassScrollRef}
        />
      </div>
    </div>
  );
}
