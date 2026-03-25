import { motion } from 'motion/react';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export function WizHero() {
  const { t, language } = useLanguage();

  const scrollToSolutions = () => {
    const el = document.getElementById('solution-cards');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const scrollToArchitecture = () => {
    const el = document.querySelector('[data-bg-theme]') as HTMLElement | null;
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section
      className="relative apple-section-white pt-36 pb-44 overflow-hidden"
      data-bg-theme="light"
    >
      {/* ── Ambient gradient blobs ── */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: 0 }}
      >
        {/* top-left blue blob */}
        <motion.div
          className="absolute rounded-full"
          style={{
            width: 700,
            height: 700,
            top: -200,
            left: -200,
            background:
              'radial-gradient(circle, rgba(0,113,227,0.09) 0%, transparent 70%)',
            filter: 'blur(40px)',
          }}
          animate={{ scale: [1, 1.08, 1], opacity: [0.7, 1, 0.7] }}
          transition={{ repeat: Infinity, duration: 8, ease: 'easeInOut' }}
        />
        {/* top-right purple blob */}
        <motion.div
          className="absolute rounded-full"
          style={{
            width: 600,
            height: 600,
            top: -120,
            right: -150,
            background:
              'radial-gradient(circle, rgba(155,81,224,0.08) 0%, transparent 70%)',
            filter: 'blur(40px)',
          }}
          animate={{ scale: [1, 1.06, 1], opacity: [0.6, 0.9, 0.6] }}
          transition={{ repeat: Infinity, duration: 9, ease: 'easeInOut', delay: 1.5 }}
        />
        {/* center-bottom teal blob */}
        <motion.div
          className="absolute rounded-full"
          style={{
            width: 500,
            height: 500,
            bottom: -100,
            left: '35%',
            background:
              'radial-gradient(circle, rgba(94,92,230,0.07) 0%, transparent 70%)',
            filter: 'blur(50px)',
          }}
          animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ repeat: Infinity, duration: 11, ease: 'easeInOut', delay: 2.5 }}
        />
      </div>

      {/* 다음 그레이 섹션(아키텍처)으로 이어지는 Apple 스타일 하단 페이드 */}
      <div
        aria-hidden
        className="apple-hero-bottom-fade pointer-events-none absolute bottom-0 left-0 right-0 z-[5] h-28 sm:h-36"
      />

      {/* ── Content ── */}
      <div className="relative z-10 wiz-section">
        <div className="text-center">

          {/* Eyebrow */}
          <motion.div
            className="inline-block mb-5"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <span
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold tracking-wide"
              style={{
                color: 'var(--brand-red)',
                backgroundColor: 'rgba(179, 7, 16, 0.08)',
                border: '1px solid rgba(179, 7, 16, 0.2)',
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full animate-pulse"
                style={{ backgroundColor: 'var(--brand-red)' }}
              />
              {language === 'ko' ? '위즈팩토리 스마트팩토리' : 'WIZFACTORY Smart Factory'}
            </span>
          </motion.div>

          {/* Main headline */}
          <motion.h1
            className="text-4xl md:text-6xl lg:text-[80px] font-bold mb-6 leading-[1.04] tracking-tight px-2"
            style={{ color: 'var(--apple-text-primary)' }}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.28, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            {t('hero.title1')}
            <br />
            <span className="bg-gradient-to-r from-[#B30710] via-[#CC1D2A] to-[#E81D24] bg-clip-text text-transparent">
              {t('hero.title2')}
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="text-base md:text-xl lg:text-2xl leading-relaxed max-w-2xl mx-auto mb-10 font-normal px-2"
            style={{ color: 'var(--apple-text-secondary)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.48, duration: 0.8 }}
          >
            {t('hero.subtitle')}
          </motion.p>

          {/* CTA row */}
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Primary CTA */}
            <motion.button
              onClick={scrollToSolutions}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 text-white px-7 py-3.5 rounded-full font-semibold text-sm transition-all"
              style={{
                backgroundColor: 'var(--brand-red)',
                boxShadow: '0 4px 20px rgba(179, 7, 16, 0.35)',
              }}
            >
              {t('hero.cta')}
              <ArrowRight className="size-4" strokeWidth={2.5} />
            </motion.button>

            {/* Secondary CTA -- removed */}
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            className="mt-16 flex flex-col items-center gap-1 cursor-pointer opacity-40 hover:opacity-70 transition-opacity"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            onClick={scrollToArchitecture}
          >
            <span className="text-xs font-medium tracking-widest uppercase" style={{ color: 'var(--apple-text-secondary)' }}>
              {language === 'ko' ? '스크롤' : 'Scroll'}
            </span>
            <motion.div
              animate={{ y: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
            >
              <ChevronDown size={18} style={{ color: 'var(--apple-text-secondary)' }} />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}