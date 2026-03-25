import { useState, useCallback, useMemo, useRef } from 'react';
import { WizHero } from '../components/WizHero';
import { WizArchitecture } from '../components/WizArchitecture';
import { WizNavigation } from '../components/WizNavigation';
import { WizSolutionCard } from '../components/WizSolutionCard';
import { WizIndustries } from '../components/WizIndustries';
import { WizCaseStudies } from '../components/WizCaseStudies';
import { WizPlatformBento } from '../components/WizPlatformBento';
import { SolutionModal } from '../components/SolutionModal';
import { solutions, CategoryKey, Solution } from '../data/solutions';
import { useLanguage } from '../contexts/LanguageContext';

export function HomePage() {
  const { t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<CategoryKey>('all');
  const [selectedSolution, setSelectedSolution] = useState<Solution | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout>>();

  const filteredSolutions = useMemo(() =>
    activeCategory === 'all' 
      ? solutions 
      : solutions.filter(s => s.category === activeCategory),
    [activeCategory]
  );

  const handleOpenModal = useCallback((solution: Solution) => {
    setSelectedSolution(solution);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    clearTimeout(closeTimerRef.current);
    closeTimerRef.current = setTimeout(() => setSelectedSolution(null), 300);
  }, []);

  return (
    <div className="min-h-screen bg-[var(--apple-surface-gray)]">
      <WizHero />
      <WizArchitecture />
      <WizPlatformBento />
      
      <section id="solutions" className="apple-section-white py-32" data-bg-theme="light">
        <div className="wiz-section">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold mb-5 tracking-tight" style={{ color: 'var(--apple-text-primary)' }}>
              {t('solutions.title')}
            </h2>
            <p className="text-xl md:text-2xl font-normal" style={{ color: 'var(--apple-text-secondary)' }}>
              {t('solutions.subtitle')}
            </p>
          </div>
        </div>

        <WizNavigation 
          activeCategory={activeCategory} 
          onCategoryChange={setActiveCategory} 
        />
        
        <div id="solution-cards" className="wiz-section pt-16 scroll-mt-32">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSolutions.map((solution, index) => (
              <WizSolutionCard 
                key={solution.id} 
                solution={solution} 
                index={index}
                onOpenModal={handleOpenModal}
              />
            ))}
          </div>
        </div>
      </section>

      <div className="section-lazy">
        <WizIndustries />
      </div>
      <div className="section-lazy">
        <WizCaseStudies />
      </div>

      {selectedSolution && (
        <SolutionModal 
          solution={selectedSolution} 
          isOpen={isModalOpen} 
          onClose={handleCloseModal} 
        />
      )}
    </div>
  );
}