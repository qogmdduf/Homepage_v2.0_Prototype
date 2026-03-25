import { motion, useInView } from 'motion/react';
import { useRef, useEffect, useState } from 'react';
import { ArrowRight, TrendingUp, Award, Users, Clock } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

// ─── Count-up hook ────────────────────────────────────────────────────────────
function useCountUp(target: number, duration: number = 1.6, triggered: boolean = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!triggered) return;
    let startTime: number | null = null;
    let rafId: number;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) rafId = requestAnimationFrame(step);
    };
    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [target, duration, triggered]);
  return count;
}

// ─── Animated metric card ─────────────────────────────────────────────────────
function MetricBadge({
  icon: Icon,
  label,
  value,
  numericValue,
  suffix,
  color,
  triggered,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  numericValue: number;
  suffix: string;
  color: string;
  triggered: boolean;
}) {
  const counted = useCountUp(numericValue, 1.8, triggered);
  return (
    <div
      className="flex-1 flex flex-col gap-1 p-3 rounded-2xl"
      style={{ backgroundColor: `${color}08`, border: `1px solid ${color}18` }}
    >
      <div className="flex items-center gap-1.5 mb-0.5">
        <Icon size={13} style={{ color }} strokeWidth={2.5} />
        <span className="text-[10px] font-medium" style={{ color: 'var(--apple-text-secondary)' }}>{label}</span>
      </div>
      <div className="text-xl font-bold tracking-tight" style={{ color: 'var(--apple-text-primary)' }}>
        {triggered ? `${value.startsWith('+') ? '+' : ''}${counted}${suffix}` : value}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export function WizCaseStudies() {
  const { t, language } = useLanguage();
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });

  const caseStudies = [
    {
      id: 'lg-electronics',
      client: language === 'ko' ? 'LG 전자' : 'LG Electronics',
      category: language === 'ko' ? '전자제품' : 'Electronics',
      categoryColor: '#0071E3',
      title: language === 'ko' ? '대규모 디지털 혁신' : 'Digital Transformation at Scale',
      description: language === 'ko'
        ? '스마트팩토리 전환으로 생산성 40% 향상, 불량률 60% 감소를 달성했습니다.'
        : 'Smart factory transformation achieved +40% productivity and -60% defect rate.',
      image: 'https://images.unsplash.com/photo-1770364557597-ae4e33e8d17e?w=800',
      metrics: [
        {
          icon: TrendingUp,
          label: language === 'ko' ? '생산성' : 'Productivity',
          value: '+40%',
          numericValue: 40,
          suffix: '%',
          color: '#34C759',
        },
        {
          icon: Award,
          label: language === 'ko' ? '불량률 감소' : 'Defect Reduction',
          value: '+60%',
          numericValue: 60,
          suffix: '%',
          color: '#0071E3',
        },
      ],
      duration: language === 'ko' ? '구축 6개월' : '6 mo. Deploy',
    },
    {
      id: 'battery-plant',
      client: language === 'ko' ? '배터리 제조사' : 'Battery Manufacturer',
      category: language === 'ko' ? '2차 전지' : 'Battery',
      categoryColor: '#34C759',
      title: language === 'ko' ? '스마트 품질관리 시스템' : 'Smart Quality Control System',
      description: language === 'ko'
        ? '전 공정 트레이서빌리티 구축으로 품질 검사 시간 50% 단축, 인력 효율 30% 개선.'
        : 'Full-process traceability halved inspection time and improved workforce efficiency by 30%.',
      image: 'https://images.unsplash.com/photo-1768796370672-3931e5d1ded7?w=800',
      metrics: [
        {
          icon: Clock,
          label: language === 'ko' ? '검사 시간 단축' : 'Inspection Time',
          value: '+50%',
          numericValue: 50,
          suffix: '%',
          color: '#FF9500',
        },
        {
          icon: Users,
          label: language === 'ko' ? '인력 효율' : 'Workforce',
          value: '30%',
          numericValue: 30,
          suffix: '%',
          color: '#5E5CE6',
        },
      ],
      duration: language === 'ko' ? '구축 4개월' : '4 mo. Deploy',
    },
    {
      id: 'semiconductor',
      client: language === 'ko' ? '반도체 FAB' : 'Semiconductor Fab',
      category: language === 'ko' ? '반도체' : 'Semiconductor',
      categoryColor: '#5E5CE6',
      title: language === 'ko' ? '실시간 모니터링 솔루션' : 'Real-time Monitoring Solution',
      description: language === 'ko'
        ? '설비 통합 및 SPC 기반 공정 이상 감지로 가동률 95% 이상, 수율 25% 향상.'
        : 'Equipment integration & SPC anomaly detection: 95%+ uptime and +25% yield.',
      image: 'https://images.unsplash.com/photo-1672307613484-3254a04651fd?w=800',
      metrics: [
        {
          icon: TrendingUp,
          label: language === 'ko' ? '설비 가동률' : 'Uptime',
          value: '95%',
          numericValue: 95,
          suffix: '%',
          color: '#FF3B30',
        },
        {
          icon: Award,
          label: language === 'ko' ? '수율 향상' : 'Yield Gain',
          value: '+25%',
          numericValue: 25,
          suffix: '%',
          color: '#34C759',
        },
      ],
      duration: language === 'ko' ? '구축 8개월' : '8 mo. Deploy',
    },
  ];

  return (
    <section
      id="case-studies"
      ref={sectionRef}
      className="apple-section-white relative py-32"
      data-bg-theme="light"
    >
      <div className="wiz-section">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2
            className="text-3xl md:text-5xl lg:text-6xl font-bold mb-5 tracking-tight"
            style={{ color: 'var(--apple-text-primary)' }}
          >
            {language === 'ko' ? '고객 성과 사례' : 'Customer Success Stories'}
          </h2>
          <p
            className="text-base md:text-xl lg:text-2xl font-normal max-w-2xl mx-auto"
            style={{ color: 'var(--apple-text-secondary)' }}
          >
            {language === 'ko'
              ? '데이터로 증명된 스마트팩토리 전환 성과'
              : 'Measurable outcomes from real smart factory deployments.'}
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-5 md:gap-6">
          {caseStudies.map((study, index) => (
            <motion.div
              key={study.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{
                y: -8,
                transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] },
              }}
              className="group bg-white rounded-3xl overflow-hidden flex flex-col"
              style={{
                boxShadow: '0 4px 24px rgba(0, 0, 0, 0.06), 0 2px 8px rgba(0, 0, 0, 0.03)',
              }}
            >
              {/* Image */}
              <div className="relative aspect-[16/9] overflow-hidden">
                <img
                  src={study.image}
                  alt={study.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {/* Category badge over image */}
                <div className="absolute top-4 left-4">
                  <span
                    className="text-xs font-semibold px-3 py-1.5 rounded-full"
                    style={{
                      backgroundColor: `${study.categoryColor}EE`,
                      color: '#FFFFFF',
                      backdropFilter: 'blur(8px)',
                      WebkitBackdropFilter: 'blur(8px)',
                    }}
                  >
                    {study.category}
                  </span>
                </div>
                {/* Duration badge */}
                <div className="absolute top-4 right-4">
                  <span
                    className="text-xs font-medium px-3 py-1.5 rounded-full"
                    style={{
                      backgroundColor: 'rgba(0,0,0,0.55)',
                      color: '#FFFFFF',
                      backdropFilter: 'blur(8px)',
                      WebkitBackdropFilter: 'blur(8px)',
                    }}
                  >
                    {study.duration}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="flex flex-col flex-1 p-6 md:p-7">
                {/* Client name */}
                <h3
                  className="text-lg md:text-xl font-bold mb-1.5 tracking-tight"
                  style={{ color: 'var(--apple-text-primary)' }}
                >
                  {study.client}
                </h3>

                {/* Title */}
                <p className="text-sm font-semibold mb-3" style={{ color: study.categoryColor }}>
                  {study.title}
                </p>

                {/* Description */}
                <p className="text-sm leading-relaxed mb-5 flex-1" style={{ color: '#6E6E73' }}>
                  {study.description}
                </p>

                {/* Metrics */}
                <div className="flex gap-3 mb-5">
                  {study.metrics.map((metric, idx) => (
                    <MetricBadge key={idx} {...metric} triggered={isInView} />
                  ))}
                </div>

                {/* CTA */}
                <motion.button
                  whileHover={{ gap: '10px' }}
                  className="inline-flex items-center gap-2 font-semibold text-sm transition-all"
                  style={{ color: study.categoryColor }}
                  onClick={() => window.dispatchEvent(new CustomEvent('openContactModal'))}
                >
                  {language === 'ko' ? '사례 자세히 보기' : 'Read full case study'}
                  <ArrowRight size={15} strokeWidth={2.5} />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center mt-14"
        >
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-semibold text-sm text-white transition-all"
            style={{
              backgroundColor: 'var(--apple-text-primary)',
              boxShadow: '0 4px 16px rgba(0,0,0,0.18)',
            }}
            onClick={() => window.dispatchEvent(new CustomEvent('openContactModal'))}
          >
            {language === 'ko' ? '도입 문의하기' : 'Contact Us'}
            <ArrowRight size={16} strokeWidth={2.5} />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
