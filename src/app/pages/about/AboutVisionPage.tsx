import { motion, useReducedMotion } from 'motion/react';
import { useLanguage } from '../../contexts/LanguageContext';
import { getAboutSections } from '../../data/aboutSectionsContent';
import { AboutCtaBand } from '../../components/about/AboutPageUi';

const fadeUp = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
};

const fadeUpStatic = {
  initial: { opacity: 1, y: 0 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0 },
};

export function AboutVisionPage() {
  const { language } = useLanguage();
  const reduceMotion = useReducedMotion();
  const s = getAboutSections(language);
  const v = s.vision;
  const openContact = () => window.dispatchEvent(new CustomEvent('openContactModal'));
  const m = reduceMotion ? fadeUpStatic : fadeUp;

  return (
    <>
      {/* ── Hero: 애플 제품 페이지식 — 넓은 여백·디스플레이 타이포·은은한 광원 ── */}
      <section
        className="relative overflow-hidden bg-[var(--apple-surface-white)] scroll-mt-[calc(var(--app-header-offset)+3rem)]"
        aria-labelledby="vision-page-title"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 120% 80% at 50% -40%, rgba(0,113,227,0.11), transparent 50%), radial-gradient(ellipse 70% 50% at 100% 20%, rgba(179,7,16,0.06), transparent 45%)',
          }}
        />
        <div className="relative wiz-section pb-16 pt-12 md:pb-24 md:pt-16">
          <motion.div {...m}>
            <p className="text-[11px] font-semibold uppercase tracking-[var(--tracking-widest)] text-[var(--apple-text-tertiary)]">
              {v.eyebrow}
            </p>
            <h1
              id="vision-page-title"
              className="mt-4 max-w-[18ch] text-[length:var(--text-display-xl)] font-bold leading-[var(--leading-tightest)] tracking-[var(--tracking-tighter)] text-[var(--apple-text-primary)] md:max-w-[22ch]"
            >
              {v.title}
            </h1>
            <p className="mt-8 max-w-2xl text-[length:var(--text-body-xl)] font-medium leading-[var(--leading-relaxed)] text-[var(--apple-text-secondary)]">
              {v.pageLead}
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Mission: 다크 풀블리드 스트립 (apple.com 환경·가치 페이지 리듬) ── */}
      <section className="relative bg-[var(--apple-surface-dark)] text-white" aria-labelledby="vision-mission-heading">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
        <div className="wiz-section py-20 md:py-28 lg:py-32">
          <motion.div {...m}>
            <p
              id="vision-mission-heading"
              className="text-[11px] font-semibold uppercase tracking-[var(--tracking-widest)] text-white/45"
            >
              {v.missionTitle}
            </p>
            <p className="mt-8 max-w-3xl text-[length:clamp(1.125rem,2.5vw,1.5rem)] font-medium leading-[var(--leading-loose)] text-white/[0.92]">
              {v.missionBody}
            </p>
          </motion.div>
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </section>

      {/* ── Vision + 이미지: 라이트 그레이 · 비대칭 그리드 · 둥근 “프레임” ── */}
      <section
        className="bg-[var(--apple-surface-gray)]"
        aria-labelledby="vision-vision-heading"
      >
        <div className="wiz-section grid items-center gap-12 py-20 md:gap-16 md:py-28 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-20">
          <motion.div className="order-2 lg:order-1" {...m}>
            <p
              id="vision-vision-heading"
              className="text-[11px] font-semibold uppercase tracking-[var(--tracking-widest)] text-[var(--apple-blue)]"
            >
              {v.visionTitle}
            </p>
            <p className="mt-6 max-w-xl text-[length:var(--text-body-xl)] font-medium leading-[var(--leading-loose)] text-[var(--apple-text-secondary)]">
              {v.visionBody}
            </p>
          </motion.div>
          <motion.div
            className="order-1 lg:order-2"
            {...m}
            transition={
              reduceMotion
                ? { duration: 0 }
                : { ...fadeUp.transition, delay: 0.08 }
            }
          >
            <div
              className="relative overflow-hidden rounded-[2rem] bg-[var(--apple-surface-white)] shadow-[0_24px_80px_rgba(0,0,0,0.12)] ring-1 ring-black/[0.06] md:rounded-[2.25rem]"
              style={{
                boxShadow:
                  '0 24px 80px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.85)',
              }}
            >
              <div className="aspect-[4/3] w-full sm:aspect-[16/11]">
                <img
                  src={v.image}
                  alt={v.imageAlt}
                  className="h-full w-full object-cover object-center"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── 핵심 가치: Liquid Glass 느낌의 얇은 재질 + 번호 (최신 애플 UI 트렌드 참고) ── */}
      <section className="bg-[var(--apple-surface-white)]" aria-labelledby="vision-values-heading">
        <div className="wiz-section py-20 md:py-28">
          <motion.div className="mx-auto max-w-2xl text-center" {...m}>
            <h2
              id="vision-values-heading"
              className="text-[length:var(--text-display-sm)] font-bold tracking-[var(--tracking-tight)] text-[var(--apple-text-primary)]"
            >
              {v.valuesTitle}
            </h2>
          </motion.div>
          <ul className="mt-14 grid gap-5 md:grid-cols-3 md:gap-6">
            {v.values.map((item, i) => (
              <motion.li
                key={item.title}
                {...m}
                transition={
                  reduceMotion
                    ? { duration: 0 }
                    : { ...fadeUp.transition, delay: 0.06 + i * 0.07 }
                }
              >
                <div
                  className="relative flex h-full flex-col rounded-[1.75rem] border border-black/[0.07] bg-white/75 p-8 shadow-[0_4px_24px_rgba(0,0,0,0.04)] backdrop-blur-xl md:p-9"
                  style={{
                    boxShadow:
                      '0 4px 24px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.9)',
                  }}
                >
                  <span
                    className="mb-6 font-mono text-[2.75rem] font-bold leading-none tabular-nums text-[var(--apple-text-primary)]/[0.08]"
                    aria-hidden
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="text-lg font-semibold tracking-[var(--tracking-snug)] text-[var(--apple-text-primary)]">
                    {item.title}
                  </h3>
                  <p className="mt-3 flex-1 text-[length:var(--text-body-md)] leading-[var(--leading-relaxed)] text-[var(--apple-text-secondary)]">
                    {item.body}
                  </p>
                </div>
              </motion.li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── 대표 메시지: 인용·서명 분리 (에디토리얼 타이포) ── */}
      <section
        className="border-t border-black/[0.06] bg-[var(--apple-surface-gray)]"
        aria-labelledby="vision-ceo-heading"
      >
        <div className="wiz-section py-20 md:py-28">
          <motion.div className="mx-auto max-w-3xl" {...m}>
            <p
              id="vision-ceo-heading"
              className="text-[11px] font-semibold uppercase tracking-[var(--tracking-widest)] text-[var(--apple-text-tertiary)]"
            >
              {v.ceoTitle}
            </p>
            <figure className="mt-8">
              <blockquote
                className="relative border-l-[3px] pl-8 text-[length:var(--text-body-xl)] font-medium leading-[var(--leading-loose)] text-[var(--apple-text-primary)] md:pl-10"
                style={{ borderColor: 'var(--brand-red)' }}
              >
                <span
                  className="absolute -left-1 -top-2 font-serif text-5xl leading-none text-[var(--brand-red)]/15 md:text-6xl"
                  aria-hidden
                  style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
                >
                  “
                </span>
                <span className="relative">{v.ceoBody}</span>
              </blockquote>
            </figure>
          </motion.div>
        </div>
      </section>

      <AboutCtaBand
        title={s.cta.title}
        primaryLabel={s.cta.button}
        secondaryLabel={s.cta.secondary}
        onPrimary={openContact}
        secondaryTo="/about/company"
      />
    </>
  );
}
