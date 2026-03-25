import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  BookOpen,
  BarChart2,
  Newspaper,
  Building2,
  ArrowRight,
  Clock,
  Bell,
  Cpu,
  Factory,
  Network,
  TrendingUp,
  Award,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { getAboutSections } from '../../data/aboutSectionsContent';
import { AboutCtaBand } from '../../components/about/AboutPageUi';
import { Button } from '../../components/ui/button';

/* ─── Types ─────────────────────────────────────────────────────────── */
type CategoryKey = 'all' | 'tech' | 'industry' | 'press' | 'company';

interface PlannedArticle {
  id: string;
  categoryKey: CategoryKey;
  titleKo: string;
  titleEn: string;
  descKo: string;
  descEn: string;
  tagsKo: string[];
  tagsEn: string[];
  gradient: string;
  Icon: React.ElementType;
  featured?: boolean;
}

/* ─── Static data ────────────────────────────────────────────────────── */
const PLANNED_ARTICLES: PlannedArticle[] = [
  {
    id: '1',
    categoryKey: 'tech',
    featured: true,
    titleKo: '스마트팩토리 데이터 파이프라인 설계하기',
    titleEn: 'Designing a Smart Factory Data Pipeline',
    descKo:
      '현장 설비에서 발생하는 실시간 데이터를 수집·저장·분석·가시화까지 연결하는 아키텍처 설계 방법론을 소개합니다.',
    descEn:
      'A walkthrough of the architecture behind real-time data collection, storage, analysis, and visualization for the shop floor.',
    tagsKo: ['데이터 파이프라인', 'IoT', '스마트팩토리'],
    tagsEn: ['Data Pipeline', 'IoT', 'Smart Factory'],
    gradient: 'from-blue-600 to-indigo-700',
    Icon: Network,
  },
  {
    id: '2',
    categoryKey: 'tech',
    titleKo: 'MES 현장 도입 체크리스트',
    titleEn: 'MES Deployment Checklist for the Plant',
    descKo:
      'MES를 처음 도입하거나 레거시를 교체할 때 놓치기 쉬운 10가지 포인트를 정리했습니다.',
    descEn:
      '10 easy-to-miss points when deploying MES for the first time or replacing a legacy system.',
    tagsKo: ['MES', '현장', '프로젝트 관리'],
    tagsEn: ['MES', 'Plant Ops', 'Project Management'],
    gradient: 'from-blue-500 to-cyan-600',
    Icon: Cpu,
  },
  {
    id: '3',
    categoryKey: 'tech',
    titleKo: '설비 IoT 데이터로 예지보전 구현하기',
    titleEn: 'Predictive Maintenance with Equipment IoT Data',
    descKo:
      '설비 센서 데이터를 AI 모델과 연결해 고장을 사전에 감지하는 파이프라인 구성 사례를 다룹니다.',
    descEn:
      'How we connect sensor data to an AI model to detect failures before they happen.',
    tagsKo: ['예지보전', 'AI', '설비 모니터링'],
    tagsEn: ['Predictive Maintenance', 'AI', 'Monitoring'],
    gradient: 'from-indigo-500 to-violet-600',
    Icon: Layers,
  },
  {
    id: '4',
    categoryKey: 'industry',
    titleKo: '2025 제조업 디지털 전환 트렌드',
    titleEn: '2025 Manufacturing Digital Transformation Trends',
    descKo:
      '국내외 제조업의 스마트팩토리 전환 현황과 2025년 주목할 기술·운영 트렌드를 분석합니다.',
    descEn:
      'An analysis of global smart factory adoption and the key tech and ops trends to watch in 2025.',
    tagsKo: ['트렌드', '디지털 전환', '제조업'],
    tagsEn: ['Trends', 'Digital Transformation', 'Manufacturing'],
    gradient: 'from-violet-600 to-purple-700',
    Icon: TrendingUp,
  },
  {
    id: '5',
    categoryKey: 'industry',
    titleKo: '제조 AI 비전 검사 — 현장 도입의 현실',
    titleEn: 'AI Vision Inspection in Manufacturing — The Reality',
    descKo:
      '외관 검사 자동화에 AI 비전을 적용할 때 마주치는 데이터 품질, 환경 변수, 운영 이슈를 솔직하게 정리합니다.',
    descEn:
      'A candid look at data quality, environmental variables, and ops issues when deploying AI vision for surface inspection.',
    tagsKo: ['AI 비전', '품질 검사', '자동화'],
    tagsEn: ['AI Vision', 'Quality Inspection', 'Automation'],
    gradient: 'from-purple-600 to-pink-700',
    Icon: Factory,
  },
  {
    id: '6',
    categoryKey: 'press',
    titleKo: '위즈팩토리, ISO 9001 · 14001 동시 인증 취득',
    titleEn: 'WIZFACTORY Receives ISO 9001 & 14001 Certification',
    descKo:
      '품질경영 및 환경경영 국제표준 인증을 동시 취득하여 제품 신뢰성과 지속가능경영 기반을 강화했습니다.',
    descEn:
      'We obtained dual ISO certification in quality and environmental management, reinforcing product reliability and sustainable operations.',
    tagsKo: ['인증', 'ISO', '품질경영'],
    tagsEn: ['Certification', 'ISO', 'Quality Management'],
    gradient: 'from-emerald-500 to-teal-600',
    Icon: Award,
  },
];

const CATEGORIES_KO = [
  { key: 'all' as CategoryKey,      label: '전체',        Icon: BookOpen  },
  { key: 'tech' as CategoryKey,     label: '기술 블로그',  Icon: Cpu       },
  { key: 'industry' as CategoryKey, label: '산업 인사이트', Icon: BarChart2 },
  { key: 'press' as CategoryKey,    label: '보도자료',     Icon: Newspaper },
  { key: 'company' as CategoryKey,  label: '회사 소식',    Icon: Building2 },
];

const CATEGORIES_EN = [
  { key: 'all' as CategoryKey,      label: 'All',           Icon: BookOpen  },
  { key: 'tech' as CategoryKey,     label: 'Tech Blog',     Icon: Cpu       },
  { key: 'industry' as CategoryKey, label: 'Industry',      Icon: BarChart2 },
  { key: 'press' as CategoryKey,    label: 'Press',         Icon: Newspaper },
  { key: 'company' as CategoryKey,  label: 'Company News',  Icon: Building2 },
];

const CATEGORY_COUNT: Record<CategoryKey, number> = {
  all:      PLANNED_ARTICLES.length,
  tech:     PLANNED_ARTICLES.filter((a) => a.categoryKey === 'tech').length,
  industry: PLANNED_ARTICLES.filter((a) => a.categoryKey === 'industry').length,
  press:    PLANNED_ARTICLES.filter((a) => a.categoryKey === 'press').length,
  company:  0,
};

/* ─── Sub-components ─────────────────────────────────────────────────── */

function ArticleThumbnail({
  gradient,
  Icon,
  featured = false,
}: {
  gradient: string;
  Icon: React.ElementType;
  featured?: boolean;
}) {
  return (
    <div
      className={`relative overflow-hidden bg-gradient-to-br ${gradient} ${
        featured ? 'h-56 md:h-full md:min-h-[260px]' : 'h-40'
      } w-full`}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <Icon className={`text-white/25 ${featured ? 'size-24' : 'size-12'}`} />
      </div>
      <div className="absolute left-3 top-3">
        <span className="inline-flex items-center gap-1 rounded-full bg-black/20 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-sm">
          <Clock className="size-2.5" />
          Coming Soon
        </span>
      </div>
    </div>
  );
}

function CategoryBadge({
  categoryKey,
  isKo,
}: {
  categoryKey: CategoryKey;
  isKo: boolean;
}) {
  const styles: Record<CategoryKey, string> = {
    all:      'bg-slate-100 text-slate-600',
    tech:     'bg-blue-50 text-blue-600',
    industry: 'bg-violet-50 text-violet-600',
    press:    'bg-emerald-50 text-emerald-700',
    company:  'bg-orange-50 text-orange-600',
  };
  const labelsKo: Record<CategoryKey, string> = {
    all: '전체', tech: '기술 블로그', industry: '산업 인사이트', press: '보도자료', company: '회사 소식',
  };
  const labelsEn: Record<CategoryKey, string> = {
    all: 'All', tech: 'Tech Blog', industry: 'Industry', press: 'Press', company: 'Company',
  };
  return (
    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${styles[categoryKey]}`}>
      {isKo ? labelsKo[categoryKey] : labelsEn[categoryKey]}
    </span>
  );
}

function ArticleCard({ article, isKo }: { article: PlannedArticle; isKo: boolean }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.3 }}
      className="group flex flex-col overflow-hidden rounded-2xl border border-black/[0.06] bg-white shadow-sm transition-shadow duration-300 hover:shadow-[0_8px_28px_rgba(0,0,0,0.1)]"
    >
      <ArticleThumbnail gradient={article.gradient} Icon={article.Icon} />
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3">
          <CategoryBadge categoryKey={article.categoryKey} isKo={isKo} />
        </div>
        <h3 className="mb-2 flex-1 text-base font-bold leading-snug text-[var(--apple-text-primary)] transition-colors duration-200 group-hover:text-blue-600">
          {isKo ? article.titleKo : article.titleEn}
        </h3>
        <p className="mb-4 line-clamp-3 text-xs leading-relaxed text-[var(--apple-text-secondary)]">
          {isKo ? article.descKo : article.descEn}
        </p>
        <div className="flex flex-wrap gap-1.5">
          {(isKo ? article.tagsKo : article.tagsEn).map((tag) => (
            <span
              key={tag}
              className="rounded-lg border border-black/[0.06] bg-[var(--apple-bg-primary)] px-2 py-0.5 text-[10px] text-[var(--apple-text-tertiary)]"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function FeaturedArticleCard({ article, isKo }: { article: PlannedArticle; isKo: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.55 }}
      className="group overflow-hidden rounded-2xl border border-black/[0.06] bg-white shadow-[0_4px_24px_rgba(0,0,0,0.07)] md:grid md:grid-cols-2"
    >
      <ArticleThumbnail gradient={article.gradient} Icon={article.Icon} featured />
      <div className="flex flex-col justify-center p-8 md:p-10">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-blue-600 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
            {isKo ? '추천 아티클' : 'Featured'}
          </span>
          <CategoryBadge categoryKey={article.categoryKey} isKo={isKo} />
        </div>
        <h2 className="mb-3 text-xl font-bold leading-snug text-[var(--apple-text-primary)] transition-colors duration-200 group-hover:text-blue-600 md:text-2xl">
          {isKo ? article.titleKo : article.titleEn}
        </h2>
        <p className="mb-6 text-sm leading-relaxed text-[var(--apple-text-secondary)]">
          {isKo ? article.descKo : article.descEn}
        </p>
        <div className="mb-6 flex flex-wrap gap-1.5">
          {(isKo ? article.tagsKo : article.tagsEn).map((tag) => (
            <span
              key={tag}
              className="rounded-lg border border-black/[0.06] bg-[var(--apple-bg-primary)] px-2.5 py-1 text-xs text-[var(--apple-text-secondary)]"
            >
              {tag}
            </span>
          ))}
        </div>
        <Button
          variant="outline"
          size="sm"
          className="w-fit rounded-full border-blue-200 text-blue-600 hover:bg-blue-50"
          disabled
        >
          {isKo ? '곧 공개됩니다' : 'Coming soon'}
          <ChevronRight className="size-3.5" />
        </Button>
      </div>
    </motion.div>
  );
}

/* ─── Main component ─────────────────────────────────────────────────── */
export function AboutInsightsPage() {
  const { language } = useLanguage();
  const s = getAboutSections(language);
  const n = s.insights;
  const isKo = language === 'ko';
  const openContact = () => window.dispatchEvent(new CustomEvent('openContactModal'));

  const [activeCategory, setActiveCategory] = useState<CategoryKey>('all');

  const categories = isKo ? CATEGORIES_KO : CATEGORIES_EN;
  const filtered =
    activeCategory === 'all'
      ? PLANNED_ARTICLES
      : PLANNED_ARTICLES.filter((a) => a.categoryKey === activeCategory);
  const featured = PLANNED_ARTICLES.find((a) => a.featured)!;
  const showFeatured = activeCategory === 'all';

  return (
    <>
      {/* ════════════════════════════════════════════════════════════
          SECTION 1 · HERO
      ════════════════════════════════════════════════════════════ */}
      <section className="apple-section-white border-b border-black/[0.06]">
        <div className="wiz-section py-14 md:py-20">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45 }}
                className="mb-2 text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--apple-text-secondary)]"
              >
                {n.eyebrow}
              </motion.p>
              <motion.h1
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.06 }}
                className="text-[length:var(--text-display-md)] font-bold tracking-[var(--tracking-tight)] text-[var(--apple-text-primary)] md:text-[length:var(--text-display-lg)]"
              >
                {n.title}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.12 }}
                className="mt-4 max-w-xl text-[length:var(--text-body-lg)] leading-[var(--leading-relaxed)] text-[var(--apple-text-secondary)]"
              >
                {n.lead}
              </motion.p>
            </div>

            {/* Notify button */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.2 }}
              className="shrink-0"
            >
              <button
                onClick={openContact}
                className="inline-flex items-center gap-2 rounded-full border border-black/[0.1] bg-[var(--apple-bg-primary)] px-5 py-2.5 text-sm font-medium text-[var(--apple-text-primary)] transition hover:bg-black/[0.06]"
              >
                <Bell className="size-4" />
                {isKo ? '새 글 알림 받기' : 'Get notified'}
              </button>
            </motion.div>
          </div>

          {/* Preparation notice */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.28 }}
            className="mt-8 flex items-start gap-3 rounded-xl border border-dashed border-blue-200 bg-blue-50/60 p-4"
          >
            <Clock className="mt-0.5 size-4 shrink-0 text-blue-500" />
            <p className="text-sm text-blue-700">{n.placeholderNote}</p>
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          SECTION 2 · STICKY CATEGORY FILTER BAR
      ════════════════════════════════════════════════════════════ */}
      <div className="sticky top-0 z-10 border-b border-black/[0.06] bg-white/85 backdrop-blur-lg">
        <div className="wiz-section">
          <div className="flex items-center gap-2 overflow-x-auto py-3 scrollbar-hide">
            {categories.map((cat) => {
              const CatIcon = cat.Icon;
              const count = CATEGORY_COUNT[cat.key];
              const isActive = activeCategory === cat.key;
              return (
                <button
                  key={cat.key}
                  onClick={() => setActiveCategory(cat.key)}
                  className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-4 py-1.5 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'border-[var(--apple-text-primary)] bg-[var(--apple-text-primary)] text-white'
                      : 'border-black/[0.1] bg-transparent text-[var(--apple-text-secondary)] hover:border-black/20 hover:text-[var(--apple-text-primary)]'
                  }`}
                >
                  <CatIcon className="size-3.5" />
                  {cat.label}
                  {count > 0 && (
                    <span
                      className={`ml-0.5 rounded-full px-1.5 py-px text-[10px] font-bold ${
                        isActive
                          ? 'bg-white/25 text-white'
                          : 'bg-black/[0.06] text-[var(--apple-text-tertiary)]'
                      }`}
                    >
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════
          SECTION 3 · ARTICLE CONTENT
      ════════════════════════════════════════════════════════════ */}
      <section className="apple-section-white min-h-[60vh]">
        <div className="wiz-section py-12 md:py-16">

          {/* Featured card — visible on 'all' tab only */}
          <AnimatePresence>
            {showFeatured && (
              <motion.div
                key="featured"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="mb-10"
              >
                <FeaturedArticleCard article={featured} isKo={isKo} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Grid header */}
          <div className="mb-6 flex items-center justify-between">
            <p className="text-sm font-semibold text-[var(--apple-text-secondary)]">
              {isKo ? '준비 중인 아티클' : 'Upcoming articles'} · {filtered.length}
            </p>
          </div>

          {/* Article grid */}
          <motion.div layout className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {filtered.length === 0 ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="col-span-full flex flex-col items-center gap-4 py-24 text-center"
                >
                  <div className="flex size-16 items-center justify-center rounded-2xl bg-[var(--apple-bg-primary)]">
                    <Building2 className="size-8 text-[var(--apple-text-tertiary)]" />
                  </div>
                  <p className="text-base font-semibold text-[var(--apple-text-primary)]">
                    {isKo ? '준비 중입니다' : 'Coming soon'}
                  </p>
                  <p className="max-w-xs text-sm text-[var(--apple-text-secondary)]">
                    {isKo
                      ? '이 채널의 콘텐츠를 준비하고 있습니다. 문의하기를 통해 관심을 알려주세요.'
                      : 'Content for this channel is in preparation. Let us know you are interested.'}
                  </p>
                  <button
                    onClick={openContact}
                    className="inline-flex items-center gap-1.5 rounded-full bg-[var(--apple-text-primary)] px-5 py-2 text-sm font-medium text-white transition hover:opacity-80"
                  >
                    {isKo ? '알림 신청' : 'Notify me'}
                    <ArrowRight className="size-3.5" />
                  </button>
                </motion.div>
              ) : (
                filtered.map((article) => (
                  <ArticleCard key={article.id} article={article} isKo={isKo} />
                ))
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          SECTION 4 · PLANNED TOPICS (gray)
      ════════════════════════════════════════════════════════════ */}
      <section className="apple-section-gray">
        <div className="wiz-section py-14 md:py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="mb-10"
          >
            <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--apple-text-secondary)]">
              UPCOMING TOPICS
            </p>
            <h2 className="text-[length:var(--text-display-sm)] font-bold tracking-[var(--tracking-tight)] text-[var(--apple-text-primary)]">
              {isKo ? '앞으로 다룰 주제들' : 'Topics on the roadmap'}
            </h2>
          </motion.div>

          <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                icon: Cpu,
                color: 'text-blue-500',
                bg: 'bg-blue-50',
                title: isKo ? '기술 블로그' : 'Tech Blog',
                items: isKo
                  ? ['데이터 파이프라인 아키텍처', 'MES 도입 가이드', '예지보전 구현 사례', 'IoT 게이트웨이 설계']
                  : ['Data pipeline architecture', 'MES deployment guide', 'Predictive maintenance', 'IoT gateway design'],
              },
              {
                icon: BarChart2,
                color: 'text-violet-500',
                bg: 'bg-violet-50',
                title: isKo ? '산업 인사이트' : 'Industry Insights',
                items: isKo
                  ? ['스마트팩토리 도입 트렌드', 'AI 비전 검사 현장 적용', '제조 DX 성공 조건', '공장 데이터 거버넌스']
                  : ['Smart factory trends', 'AI vision deployment', 'Keys to manufacturing DX', 'Factory data governance'],
              },
              {
                icon: Newspaper,
                color: 'text-emerald-500',
                bg: 'bg-emerald-50',
                title: isKo ? '보도자료 · 소식' : 'Press & News',
                items: isKo
                  ? ['인증 · 수상 소식', '파트너십 · 협력 체결', '제품 출시 · 업데이트', '행사 · 전시회 참가']
                  : ['Certifications & awards', 'Partnerships & collaborations', 'Product releases', 'Events & exhibitions'],
              },
            ].map((group, i) => {
              const GroupIcon = group.icon;
              return (
                <motion.div
                  key={group.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: i * 0.1 }}
                  className="rounded-2xl border border-black/[0.06] bg-white p-6 shadow-sm"
                >
                  <div className={`mb-4 flex size-10 items-center justify-center rounded-xl ${group.bg}`}>
                    <GroupIcon className={`size-5 ${group.color}`} />
                  </div>
                  <h3 className="mb-3 font-semibold text-[var(--apple-text-primary)]">{group.title}</h3>
                  <ul className="space-y-2">
                    {group.items.map((item) => (
                      <li key={item} className="flex items-center gap-2 text-sm text-[var(--apple-text-secondary)]">
                        <ChevronRight className="size-3.5 shrink-0 text-[var(--apple-text-tertiary)]" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          SECTION 5 · NOTIFY BAND (dark)
      ════════════════════════════════════════════════════════════ */}
      <section className="apple-section-dark py-14 md:py-16">
        <div className="wiz-section text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
          >
            <Bell className="mx-auto mb-4 size-8 text-white/40" />
            <h2 className="mb-2 text-xl font-bold text-white md:text-2xl">
              {isKo ? '새 글이 올라오면 바로 알려드립니다' : 'Be the first to read new articles'}
            </h2>
            <p className="mb-8 text-sm text-white/55">
              {isKo
                ? '기술 아티클과 회사 소식을 가장 먼저 받아보세요.'
                : "Don't miss our technical articles and company updates."}
            </p>
            <Button
              size="lg"
              className="rounded-full bg-white px-8 text-[var(--apple-text-primary)] hover:bg-white/90"
              onClick={openContact}
            >
              {isKo ? '알림 신청하기' : 'Get notified'}
              <ArrowRight className="size-4" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          CTA BAND
      ════════════════════════════════════════════════════════════ */}
      <AboutCtaBand
        title={s.cta.title}
        primaryLabel={s.cta.button}
        secondaryLabel={s.cta.secondary}
        onPrimary={openContact}
        secondaryTo="/about/careers"
      />
    </>
  );
}
