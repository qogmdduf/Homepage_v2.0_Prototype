import {
  X, CheckCircle2, ExternalLink, MessageCircle, Sparkles,
  AlertTriangle, Timer, Factory, CalendarClock, ClipboardCheck, Activity,
  ClipboardList, Tags, BookOpen, GitBranch, GraduationCap, ListTodo, CircleAlert, BellRing,
  Database, FileBarChart, TrendingUp, TrendingDown, ChevronRight, Sun, Moon,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { motion, animate, useMotionValue, useTransform, AnimatePresence } from 'motion/react';
import { Solution, categories, getCategoryLabel, type SolutionUseCaseStory, type WizFlowKpiCard } from '../data/solutions';
import { useLanguage } from '../contexts/LanguageContext';
import {
  Fragment, useEffect, useLayoutEffect, useRef, useState, useCallback, memo, RefObject, forwardRef,
  createContext, useContext, useMemo, type ReactNode, type CSSProperties,
} from 'react';
import { createPortal } from 'react-dom';
import { WizFlowKeyOutcomeFlow } from './WizFlowKeyOutcomeFlow';
import { WizFlowImpactMetricsCard, WIZ_FLOW_IMPACT_INNER_CARD_CLASS } from './WizFlowImpactMetricsCard';
import { WizFlowFeatureCapabilityCardsGrid } from './WizFlowFeatureCapabilityCards';
import { SmartQuoteMarksOnly } from './SmartQuoteMarks';
import { WizFactBento } from './WizFactBento';
import { WizFlowQuoteClose, WizFlowQuoteOpen } from './WizFlowInsightQuoteMarks';
import { ErrorBoundary } from './ErrorBoundary';
import wizSymbol from '../../assets/symbol.svg';
import wizFlowDashboardImg from '../../assets/pfos-dashboard.png';
import wizFlowMobileImg from '../../assets/pfos-mobile.png';
import wizFlowTabletImg from '../../assets/pfos-tablet.png';
import {
  LGSymbol,
  PHONE_SCREEN, TABLET_SCREEN, MONITOR_SCREEN, LAPTOP_SCREEN,
  mockupPhone, mockupTablet, mockupLaptop, mockupMonitor,
} from './shared';

// ── WIZ-Flow 팔레트 — ContactModal과 동일한 스타일 ────────────────────────────────
const LG_RED   = '#B30710';
/** 메인 페이지와 동일 — Apple 스타일 그레이 베이스 */
const WIZ_FLOW_BG  = 'var(--apple-surface-gray)';

/** WIZ-Flow와 동일 벤토 UI(헤더·KPI·TV·모듈·기능·활용 사례) */
export const WIZ_FLOW_LAYOUT_SOLUTION_IDS = new Set<string>([
  'wiz-flow',
  'wiz-mes',
  'esd-eos-monitoring',
  'vacuum-system',
  'patrol-system',
]);

// 카드 토큰
const G_BASE   = '#FFFFFF';
const G_MID    = '#F2F3F6';
const G_STRONG = '#FFFFFF';
const G_BD     = 'rgba(0,0,0,0.06)';
const G_BD_HI  = 'rgba(255,255,255,0.90)';
const G_RED    = 'rgba(179,7,16,0.05)';
const G_RED_BD = 'rgba(179,7,16,0.15)';

// 텍스트 토큰
const T_PRI  = '#1D1D1F'; /* Apple primary text */
const T_SEC  = '#86868B'; /* Apple secondary text */
const T_TER  = '#94A3B8';
const T_QUAT = 'rgba(15,23,42,0.25)';

/**
 * WIZ-Flow 플랫 카드 — 핵심 모듈(기존)·핵심 지표·월별 성과 타일 공통 스타일
 * (뉴모 인셋/듀얼 섀도 없음)
 */
const WIZ_FLOW_TILE = {
  bg: G_BASE,
  border: `1px solid ${G_BD}`,
  shadow: '0 8px 28px rgba(15,23,42,0.08), 0 2px 8px rgba(15,23,42,0.04)',
  shadowHoverLift: '0 12px 32px rgba(15,23,42,0.11), 0 4px 10px rgba(15,23,42,0.05)',
  /** 좌우 큰 패널 = rounded-3xl */
  radiusPanel: 24,
  /** MetricCard·차트 웰 등 */
  radiusTile: 20,
  /** 내부 웰·게이지 트랙 배경 */
  wellBg: '#F1F5F9',
  wellBorder: `1px solid rgba(15,23,42,0.08)`,
} as const;

const _HTML_CARD: React.CSSProperties = {
  background: '#fff',
  borderRadius: 20,
  border: '1px solid rgba(0,0,0,0.07)',
  boxShadow: '0 2px 10px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.04)',
};

/** WIZ-Flow 「핵심 모듈」 그리드 — _HTML_CARD 기반 */
const WIZ_FLOW_MODULE_CARD = {
  radius: 20,
  padX: 20,
  padTop: 24,
  padBottom: 20,
  minHeightRich: 300,
  minHeightSimple: 200,
  bg: _HTML_CARD.background as string,
  border: _HTML_CARD.border as string,
  shadow: _HTML_CARD.boxShadow as string,
  shadowHover: '0 8px 28px rgba(0,0,0,0.09)',
  hoverGlow: `radial-gradient(ellipse, ${LG_RED}16 0%, transparent 70%)`,
  hoverBlurPx: 20,
  divider: 'rgba(0,0,0,0.05)',
  indexMuted: '#c7c7cc',
  title: '#1d1d1f',
  accent: '#B30710',
  caption: '#86868B',
  tagBg: 'rgba(179,7,16,0.08)',
  tagBorder: '1px solid rgba(179,7,16,0.18)',
  insightBase: '#1d1d1f',
  bulletText: '#3d3d3f',
  bodyMuted: '#86868B',
  iconFallback: {
    size: 40,
    radius: 12,
    bg: '#f5f5f7',
    border: '1px solid rgba(0,0,0,0.07)',
  },
  footer: { padTop: 12, marginTop: 16 },
  metricTrendIcon: { sizeRem: 1.05, strokeWidth: 2.4 },
} as const;

/** WIZ-Flow 핵심 기능 — `bulletIconIds` 키 → Lucide (solutions.ts와 동기화) */
const WIZ_FLOW_BULLET_ICONS: Record<string, LucideIcon> = {
  'alert-triangle': AlertTriangle,
  timer: Timer,
  factory: Factory,
  'calendar-clock': CalendarClock,
  'clipboard-check': ClipboardCheck,
  activity: Activity,
  'clipboard-list': ClipboardList,
  tags: Tags,
  'book-open': BookOpen,
  'git-branch': GitBranch,
  'graduation-cap': GraduationCap,
  'list-todo': ListTodo,
  'circle-alert': CircleAlert,
  'bell-ring': BellRing,
  database: Database,
  'file-bar-chart': FileBarChart,
  'trending-up': TrendingUp,
};

/** 핵심 모듈 하단 지표 — 데이터의 ↓↑ 접미사 제거 후 표시 */
function wizFlowMetricLinePlainText(raw: string): string {
  return raw.replace(/[↓↑]\s*$/u, '').trimEnd();
}

function wizFlowMetricLineTrend(
  mod: { metricLineTrend?: 'down' | 'up' },
  raw: string,
): 'down' | 'up' | null {
  if (mod.metricLineTrend) return mod.metricLineTrend;
  const t = raw.trimEnd();
  if (t.endsWith('↓')) return 'down';
  if (t.endsWith('↑')) return 'up';
  return null;
}

// ── LG 심볼 인라인 SVG ────────────────────────────────────────────────────────
interface SolutionModalProps {
  solution: Solution | null;
  isOpen: boolean;
  onClose: () => void;
}

// ── Bento card wrapper (WIZ-FACT용, WIZ-Flow는 직접 스타일링) ──────────────────────────
function BentoCard({
  children,
  className = '',
  delay = 0,
  style = {},
  lime = false,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  style?: React.CSSProperties;
  lime?: boolean;
}) {
  const LIME = '#C8F135';
  const CARD_BG = '#1C1C1E';
  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6, transition: { duration: 0.22, ease: [0.22, 1, 0.36, 1] } }}
      className={`rounded-3xl relative overflow-hidden group ${className}`}
      style={{ background: lime ? LIME : CARD_BG, ...style }}
    >
      <div
        className="absolute -top-12 -right-12 w-40 h-40 rounded-full pointer-events-none transition-opacity duration-500 opacity-0 group-hover:opacity-70"
        style={{
          background: lime
            ? 'radial-gradient(ellipse, rgba(0,0,0,0.25) 0%, transparent 70%)'
            : `radial-gradient(ellipse, ${LIME}44 0%, transparent 70%)`,
          filter: 'blur(28px)',
        }}
      />
      <div
        className="absolute bottom-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-b-3xl"
        style={{
          background: lime
            ? 'linear-gradient(90deg, transparent, rgba(0,0,0,0.35), transparent)'
            : `linear-gradient(90deg, transparent, ${LIME}99, transparent)`,
          boxShadow: lime ? undefined : `0 0 8px ${LIME}66`,
        }}
      />
      {children}
    </motion.div>
  );
}

// ── Section label — Light Tinted Glass 버전 ──────────────────────────────────
/** 카드 섹션 라벨↔타이틀·타이틀↔본문·WIZ-Flow MetricCard 상하·차트 웰 상단 등 동일 스택 간격(px) */
const SECTION_LABEL_GAP_BELOW = 8;

const SectionLabel = ({ text, onRed = false, color }: { text: string; dark?: boolean; onRed?: boolean; color?: string }) => (
  <p
    className="text-[11px] font-bold tracking-[0.14em] leading-none"
    style={{ color: color ?? LG_RED, marginBottom: SECTION_LABEL_GAP_BELOW }}
  >
    {text.toUpperCase()}
  </p>
);

// ── WIZ-Flow 디바이스 목업 ────────────────────────────────────────────────────────
const MiniDashboard = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden">

    {/* ── 데스크톱: 모니터·노트북·폰·태블릿 4개 ── */}
    <div className="hidden md:block absolute inset-0">
      <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: '100%', maxWidth: 921, transform: 'translateX(-50%)' }}>

        <div style={{ position: 'absolute', bottom: 20, left: '0%', width: '55.16%', zIndex: 11 }}>
          <img src={mockupMonitor} alt="" loading="lazy" style={{ width: '100%', display: 'block' }} />
          <img src={wizFlowDashboardImg} alt="Monitor" loading="lazy" style={{
            position: 'absolute',
            left: MONITOR_SCREEN.left, top: MONITOR_SCREEN.top,
            width: MONITOR_SCREEN.width, height: MONITOR_SCREEN.height,
            objectFit: 'fill',
          }} />
        </div>

        <div style={{ position: 'absolute', bottom: 20, left: '36.59%', width: '37.13%', zIndex: 12 }}>
          <img src={mockupLaptop} alt="" loading="lazy" style={{ width: '100%', display: 'block' }} />
          <img src={wizFlowDashboardImg} alt="Laptop" loading="lazy" style={{
            position: 'absolute',
            left: LAPTOP_SCREEN.left, top: LAPTOP_SCREEN.top,
            width: LAPTOP_SCREEN.width, height: LAPTOP_SCREEN.height,
            objectFit: 'fill',
          }} />
        </div>

        <div style={{ position: 'absolute', bottom: 20, left: '75.35%', width: '6.19%', zIndex: 14 }}>
          <img src={mockupPhone} alt="" loading="lazy" style={{ width: '100%', display: 'block' }} />
          <img src={wizFlowMobileImg} alt="Phone" loading="lazy" style={{
            position: 'absolute',
            left: PHONE_SCREEN.left, top: PHONE_SCREEN.top,
            width: PHONE_SCREEN.width, height: PHONE_SCREEN.height,
            objectFit: 'fill',
          }} />
        </div>

        <div style={{ position: 'absolute', bottom: 20, left: '83.17%', width: '16.83%', zIndex: 13 }}>
          <img src={mockupTablet} alt="" loading="lazy" style={{ width: '100%', display: 'block' }} />
          <img src={wizFlowTabletImg} alt="Tablet" loading="lazy" style={{
            position: 'absolute',
            left: TABLET_SCREEN.left, top: TABLET_SCREEN.top,
            width: TABLET_SCREEN.width, height: TABLET_SCREEN.height,
            objectFit: 'fill',
          }} />
        </div>

      </div>
    </div>

    {/* ── 모바일: 폰 + 태블릿 2개, 하단 중앙 정렬 ── */}
    <div className="flex md:hidden absolute inset-0 items-end justify-center pb-3 gap-3">

      {/* 스마트폰 */}
      <div style={{ position: 'relative', width: '20%', flexShrink: 0 }}>
        <img src={mockupPhone} alt="" loading="lazy" style={{ width: '100%', display: 'block' }} />
        <img src={wizFlowMobileImg} alt="Phone" loading="lazy" style={{
          position: 'absolute',
          left: PHONE_SCREEN.left, top: PHONE_SCREEN.top,
          width: PHONE_SCREEN.width, height: PHONE_SCREEN.height,
          objectFit: 'fill',
        }} />
      </div>

      {/* 태블릿 */}
      <div style={{ position: 'relative', width: '52%', flexShrink: 0 }}>
        <img src={mockupTablet} alt="" loading="lazy" style={{ width: '100%', display: 'block' }} />
        <img src={wizFlowTabletImg} alt="Tablet" loading="lazy" style={{
          position: 'absolute',
          left: TABLET_SCREEN.left, top: TABLET_SCREEN.top,
          width: TABLET_SCREEN.width, height: TABLET_SCREEN.height,
          objectFit: 'fill',
        }} />
      </div>

    </div>

  </div>
);

// ── WIZ-Flow 지표 색상 & 월별 바 차트 ─────────────────────────────────────────────
const METRIC_COLORS = ['#B30710', '#34C759', '#5E8AF7', '#9B86FF'];

/** MetricCard 좌우 */
const WIZ_FLOW_METRIC_CARD_PAD_X = 14;
/**
 * KPI 이중 그리드: 바깥 래퍼(p-3)·좌우 큰 카드 안쪽·2×2 gap-3 모두 12px로 통일
 * (p-5 20px + gap-3 12px이면 바깥이 더 넓어 보임)
 */
const WIZ_FLOW_KPI_GUTTER_PX = 12;
/** inset 블록 상·하만 조금 더 (좌우는 WIZ_FLOW_KPI_GUTTER_PX 유지) */
const WIZ_FLOW_KPI_OUTER_PAD_Y = 18;
/** KPI 헤더(타이틀)와 그리드/차트 사이 — SECTION_LABEL_GAP_BELOW 보다 살짝 넓게 */
const WIZ_FLOW_KPI_HEADER_MARGIN_BOTTOM = 12;
/** 월별 차트 웰 좌우 — KPI 안쪽 inset과 동일 */
const WIZ_FLOW_CHART_WELL_PAD_X = WIZ_FLOW_KPI_GUTTER_PX;
/** 트렌드 아이콘 박스 높이 — 범례 행 minHeight와 맞춤 */
const WIZ_FLOW_TREND_ICON_ROW_H = 22;
/** 실시간 대시보드 리모컨: 재생·간격 피커·테마(라이트/다크)·전체화면 공통 높이(px) — 이전/다음 버튼은 제외 */
const WIZ_FLOW_DASH_REMOTE_ROW_H = 36;
/** 임베드 리모컨 바(Apple TV 스타일) — 클릭패드·피커·해상도 토글 정렬 */
const ATV_EMBEDDED_REMOTE_H = 44;
/** apple.com 제품 영역 — 밝은 그레이 밴드(디바이스 스테이징) */
const APPLE_DEVICE_STAGING_BG = '#f5f5f7';
/** Siri Remote / Apple TV 본체 — 다크 테마: 매트 다크 메탈 */
const APPLE_ATV_PRODUCT: CSSProperties = {
  background: 'linear-gradient(180deg, #3d3d40 0%, #2c2c2e 42%, #1c1c1e 100%)',
  borderRadius: 18,
  boxShadow: `
    inset 0 1px 0 rgba(255,255,255,0.14),
    0 22px 50px -10px rgba(0,0,0,0.13),
    0 8px 20px rgba(0,0,0,0.07)
  `,
  border: '1px solid rgba(255,255,255,0.14)',
};
/** 라이트 테마 리모컨 — 밝은 글래스/알루미늄 느낌 */
const APPLE_ATV_PRODUCT_LIGHT: CSSProperties = {
  background: 'linear-gradient(180deg, #ffffff 0%, #f5f5f7 55%, #ebebed 100%)',
  borderRadius: 18,
  boxShadow: `
    inset 0 1px 0 rgba(255,255,255,0.95),
    0 2px 6px rgba(0,0,0,0.04),
    0 14px 36px rgba(0,0,0,0.07)
  `,
  border: '1px solid rgba(0,0,0,0.08)',
};
/** 풀스크린 상단 바(라이트) — 다크 바와 동일 깊이감(그라데이션·그림자) 구조, 색만 밝게 */
const WIZ_FLOW_FS_REMOTE_BAR_LIGHT: CSSProperties = {
  background: 'linear-gradient(180deg, #ffffff 0%, #f5f5f7 42%, #ebebed 100%)',
  borderBottom: '1px solid rgba(0,0,0,0.1)',
  boxShadow: '0 12px 40px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.98)',
};
/** TV 패널 바깥 — 흰 제품 카드(애플 제품 컷 스타일) */
const APPLE_TV_DISPLAY_CARD: CSSProperties = {
  background: '#ffffff',
  borderRadius: 20,
  border: '1px solid rgba(0,0,0,0.06)',
  boxShadow: '0 2px 8px rgba(0,0,0,0.04), 0 14px 40px rgba(0,0,0,0.07)',
};
/** 01·02 WIZ-Flow 스토리 카드 공통 셸 — 라이트 리모컨/제품 카드와 동일: 화이트→#f5f5f7→#ebebed + 인셋 하이라이트 */
const WIZ_FLOW_SECTION_CARD_APPLE_SHELL: CSSProperties = {
  background: 'linear-gradient(180deg, #ffffff 0%, #f5f5f7 52%, #ebebed 100%)',
  border: '1px solid rgba(0,0,0,0.08)',
  borderRadius: 22,
  boxShadow: `
    inset 0 1px 0 rgba(255,255,255,0.95),
    0 2px 6px rgba(0,0,0,0.04),
    0 14px 36px rgba(0,0,0,0.07)
  `,
};
/** 이전 · 재생 · 다음 버튼 사이 간격 — 그리드 도입 전과 동일 */
const WIZ_FLOW_DASH_TRANSPORT_GAP = 12;

/** 풀스크린 전용 리모컨 — 카드 내 리모컨과 별도 레이아웃·크기 */
const WIZ_FLOW_FS_REMOTE_ROW_H = 52;
const WIZ_FLOW_FS_REMOTE_PAD_Y = 18;
const WIZ_FLOW_FS_REMOTE_PAD_X = 36;
const WIZ_FLOW_FS_REMOTE_CLIP_H = 120;
const WIZ_FLOW_FS_TRANSPORT_GAP = 16;
const WIZ_FLOW_FS_HOT_STRIP_H = 28;

/* ── BEFORE vs AFTER 대시보드 — 애플 스타일 색상 팔레트 ──────────── */
const _DASH_BEFORE_COLOR = '#4B5563';
const _DASH_BEFORE_ACCENT = '#6B7280';
const _DASH_AFTER_COLOR = '#1a6b2f';
const _DASH_AFTER_ACCENT = '#34a853';

/** KPI bar 값 (BEFORE/AFTER) — 막대 진행률 */
const _KPI_BARS: Record<string, { b: number; a: number }> = {
  용지: { b: 100, a: 5 },
  행정: { b: 40, a: 72 },
  데이터: { b: 90, a: 30 },
  불량: { b: 75, a: 50 },
};
function _kpiBar(card: WizFlowKpiCard, isAfter: boolean) {
  const k = card.dashLabel;
  if (k.includes('용지')) return isAfter ? _KPI_BARS['용지'].a : _KPI_BARS['용지'].b;
  if (k.includes('행정')) return isAfter ? _KPI_BARS['행정'].a : _KPI_BARS['행정'].b;
  if (k.includes('데이터')) return isAfter ? _KPI_BARS['데이터'].a : _KPI_BARS['데이터'].b;
  return isAfter ? _KPI_BARS['불량'].a : _KPI_BARS['불량'].b;
}

/** BEFORE vs AFTER 대시보드 — 개별 KPI 카드 */
function _DashMetricTile({
  card, isAfter, ko, idx,
}: {
  card: WizFlowKpiCard; isAfter: boolean; ko: boolean; idx: number;
}) {
  const val = isAfter
    ? (ko ? card.dashAfterValue : card.dashAfterValueEn)
    : (ko ? card.dashBeforeValue : card.dashBeforeValueEn);
  const sub = isAfter
    ? (ko ? card.dashAfterCaption : card.dashAfterCaptionEn)
    : (ko ? card.dashBeforeCaption : card.dashBeforeCaptionEn);
  const barW = _kpiBar(card, isAfter);

  const barGrad = isAfter
    ? 'linear-gradient(90deg, #34C759, #66D97A)'
    : 'linear-gradient(90deg, #FF3B30, #FF6B6B)';
  const barGlow = isAfter
    ? '0 2px 8px rgba(52,199,89,0.28)'
    : '0 2px 8px rgba(255,59,48,0.28)';

  return (
    <motion.div
      className="relative"
      style={{
        borderRadius: 26,
        background: 'linear-gradient(160deg, #FFFFFF 0%, #F5F5F7 100%)',
        border: '1px solid rgba(0,0,0,0.05)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04)',
        padding: '24px 24px 22px',
        boxSizing: 'border-box',
      }}
      whileHover={{ y: -3, boxShadow: '0 10px 32px rgba(0,0,0,0.09), 0 2px 6px rgba(0,0,0,0.05)' }}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: idx * 0.07, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* 라벨 */}
      <p style={{
        color: '#8E8E93',
        margin: 0,
        marginBottom: 10,
        fontSize: 11,
        fontWeight: 500,
        letterSpacing: '0.05em',
        textTransform: 'uppercase',
      }}>
        {ko ? card.dashLabel : card.dashLabelEn}
      </p>

      {/* 값 */}
      <AnimatePresence mode="wait">
        <motion.p
          key={`v-${isAfter}-${card.title}`}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          style={{
            color: '#1C1C1E',
            margin: 0,
            marginBottom: 8,
            fontSize: 28,
            fontWeight: 700,
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
            fontFamily: "'Inter', sans-serif",
          }}
        >
          {val}
        </motion.p>
      </AnimatePresence>

      {/* 서브 텍스트 */}
      <AnimatePresence mode="wait">
        <motion.p
          key={`s-${isAfter}-${card.title}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          style={{
            color: '#AEAEB2',
            margin: 0,
            marginBottom: 22,
            fontSize: 11,
            fontWeight: 400,
            lineHeight: 1.45,
          }}
        >
          {sub}
        </motion.p>
      </AnimatePresence>

      {/* 프로그레스 바 */}
      <div style={{
        position: 'relative',
        height: 7,
        width: '100%',
        borderRadius: 999,
        background: '#E5E5EA',
        overflow: 'hidden',
        boxShadow: barGlow,
      }}>
        <motion.div
          style={{
            height: '100%',
            borderRadius: 999,
            background: barGrad,
          }}
          initial={{ width: '0%' }}
          animate={{ width: `${barW}%` }}
          transition={{ duration: 0.75, delay: 0.12, ease: [0.4, 0, 0.2, 1] }}
        />
      </div>
    </motion.div>
  );
}

/** WIZ-Flow — BEFORE vs AFTER 현장 대시보드 (Apple 스타일 토글) */
function WizFlowKpiDashboard({ cards, ko }: { cards: WizFlowKpiCard[]; ko: boolean }) {
  const [isAfter, setIsAfter] = useState(false);

  const trackRef = useRef<HTMLDivElement>(null);
  const btnRefs  = useRef<(HTMLButtonElement | null)[]>([]);
  const pillX    = useMotionValue(0);
  const pillW    = useMotionValue(0);
  const pillR    = useTransform(pillW, (w) => w / 2);

  const measureBtn = useCallback((idx: number) => {
    const btn   = btnRefs.current[idx];
    const track = trackRef.current;
    if (!btn || !track) return { x: 0, w: 0 };
    const tr = track.getBoundingClientRect();
    const br = btn.getBoundingClientRect();
    return { x: br.left - tr.left, w: br.width };
  }, []);

  useEffect(() => {
    const { x, w } = measureBtn(isAfter ? 1 : 0);
    animate(pillX, x, { type: 'spring', stiffness: 400, damping: 35 });
    animate(pillW, w, { type: 'spring', stiffness: 400, damping: 35 });
  }, [isAfter, measureBtn, pillX, pillW]);

  return (
    <div
      className="flex w-full flex-col"
      style={{
        padding: '0',
        boxSizing: 'border-box',
      }}
    >
      {/* sec-head */}
      <div className="text-center" style={{ marginBottom: 40 }}>
        <h2
          className="text-[32px] font-bold"
          style={{ color: '#1d1d1f', margin: 0, marginBottom: 10, lineHeight: 1.15, letterSpacing: '-0.025em' }}
        >
          {ko ? '도입 전·후 현장 대시보드' : 'BEFORE vs AFTER Shop-floor Dashboard'}
        </h2>
        <p
          className="mx-auto m-0 max-w-[34rem] text-[13px] font-normal leading-relaxed tracking-[-0.01em] text-[#86868b] sm:text-[14px]"
          style={{ wordBreak: 'keep-all' }}
        >
          {ko ? (
            <>
              <span className="font-semibold text-[#1d1d1f]">한 번의 전환</span>,{' '}
              <span className="font-semibold text-[#1d1d1f]">도입 전과 이후</span>의 차이를 바로 확인하세요.
            </>
          ) : (
            <>
              <span className="font-semibold text-[#1d1d1f]">One toggle</span>—see the difference between{' '}
              <span className="font-semibold text-[#1d1d1f]">before and after</span> adoption at a glance.
            </>
          )}
        </p>
      </div>

      {/* toggle-center — WizNavigation과 동일한 pill sliding */}
      <div className="flex justify-center" style={{ marginBottom: 36 }}>
        <div
          ref={trackRef}
          className="relative inline-flex p-1"
          style={{ background: '#E8E8ED', borderRadius: 999 }}
        >
          <motion.div
            className="absolute top-1 bottom-1 shadow-sm"
            style={{
              x: pillX,
              width: pillW,
              borderRadius: pillR,
              backgroundColor: '#1D1D1F',
              zIndex: 0,
            }}
          />
          {[false, true].map((after, idx) => {
            const active = isAfter === after;
            return (
              <button
                key={String(after)}
                ref={(el) => { btnRefs.current[idx] = el; }}
                onClick={() => setIsAfter(after)}
                className="relative z-10 cursor-pointer select-none border-none text-[13px] font-semibold whitespace-nowrap"
                style={{
                  padding: '9px 28px',
                  borderRadius: 999,
                  background: 'transparent',
                  color: active ? '#FFFFFF' : '#1D1D1F',
                  fontFamily: 'inherit',
                  letterSpacing: '-0.01em',
                  transition: 'color 0.15s ease',
                }}
              >
                {after
                  ? (ko ? '도입 후' : 'AFTER  WIZ-Flow')
                  : (ko ? '도입 전' : 'BEFORE  Current')}
              </button>
            );
          })}
        </div>
      </div>

      {/* kpi-grid */}
      <div className="grid w-full grid-cols-2 sm:grid-cols-4" style={{ gap: 12 }}>
        {cards.map((card, i) => (
          <_DashMetricTile key={card.title} card={card} isAfter={isAfter} ko={ko} idx={i} />
        ))}
      </div>

      {/* 푸터 노트 */}
      <AnimatePresence mode="wait">
        <motion.p
          key={`note-${isAfter}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="text-center text-[11px] font-medium"
          style={{ color: '#6e6e73', margin: 0, marginTop: 14 }}
        >
          {isAfter
            ? (ko ? '* WIZ-Flow 도입 후 LG전자 생산현장 실측 결과' : '* Measured results after WIZ-Flow deployment at LG Electronics production sites')
            : (ko ? '* WIZ-Flow 도입 전 LG전자 생산현장 기준값' : '* Baseline values before WIZ-Flow deployment at LG Electronics production sites')}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}

/* ── 수치 시각화 — 수평 바 차트 + 도넛 차트 ──────────── */
const _BAR_DATA: { label: string; labelEn: string; before: number; after: number; upIsGood: boolean }[] = [
  { label: '용지 사용',   labelEn: 'Paper Usage',       before: 100, after: 5,  upIsGood: false },
  { label: '행정 효율',   labelEn: 'Admin Efficiency',  before: 38,  after: 70, upIsGood: true  },
  { label: '데이터 수집', labelEn: 'Data Collection',   before: 100, after: 30, upIsGood: false },
  { label: '불량 대응',   labelEn: 'Defect Response',   before: 75,  after: 50, upIsGood: false },
];

const _VIZ_CARD: React.CSSProperties = {
  borderRadius: 26,
  background: 'linear-gradient(160deg, #FFFFFF 0%, #F5F5F7 100%)',
  border: '1px solid rgba(0,0,0,0.05)',
  boxShadow: '0 4px 20px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04)',
  padding: 28,
  boxSizing: 'border-box',
};

/** 위쪽 `_DashMetricTile` 막대와 동일 (그라데이션·트랙 글로우) */
const _VIZ_DASH_BAR_BEFORE = 'linear-gradient(90deg, #FF3B30, #FF6B6B)';
const _VIZ_DASH_BAR_AFTER = 'linear-gradient(90deg, #34C759, #66D97A)';
const _VIZ_DASH_TRACK_GLOW_BEFORE = '0 2px 8px rgba(255,59,48,0.28)';
const _VIZ_DASH_TRACK_GLOW_AFTER = '0 2px 8px rgba(52,199,89,0.28)';

/** 데이터 카드 제목: 카드 패딩(28)과 동일 간격으로 본문과 분리 */
const _VIZ_CARD_TITLE_GAP = 28;

function WizFlowDataViz({ ko }: { ko: boolean }) {
  const savePct   = 95;
  const donutR    = 68;
  const donutStroke = 16;
  const circ      = 2 * Math.PI * donutR;

  return (
    <div className="flex w-full flex-col" style={{ boxSizing: 'border-box' }}>
      {/* sec-head */}
      <div className="text-center" style={{ marginBottom: 40 }}>
        <h2 className="text-[32px] font-bold"
          style={{ color: '#1d1d1f', margin: 0, marginBottom: 10, lineHeight: 1.15, letterSpacing: '-0.025em' }}>
          {ko ? '데이터로 보는 변화' : 'Changes Seen Through Data'}
        </h2>
        <p
          className="mx-auto m-0 max-w-[34rem] text-[13px] font-normal leading-relaxed tracking-[-0.01em] text-[#86868b] sm:text-[14px]"
          style={{ wordBreak: 'keep-all' }}
        >
          {ko ? (
            <>
              <span className="font-semibold text-[#1d1d1f]">위즈팩토리 스마트팩토리</span>{' '}
              <span className="font-semibold text-[#1d1d1f]">실제 적용 데이터</span>를 기반으로 합니다.
            </>
          ) : (
            <>
              Based on <span className="font-semibold text-[#1d1d1f]">real deployment data</span> from{' '}
              <span className="font-semibold text-[#1d1d1f]">WizFactory Smart Factory</span>.
            </>
          )}
        </p>
      </div>

      <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-[1.55fr_1fr] sm:items-stretch">

        {/* ── 수평 막대: 전·후 각각 0–100% (표시 수치와 길이 일치) ── */}
        <div style={{ ..._VIZ_CARD, display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>
          {/* 헤더: 제목 + 부제 (아래 간격 = 카드 상단 패딩과 동일) */}
          <div style={{ marginBottom: _VIZ_CARD_TITLE_GAP }}>
            <div style={{ minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                <h3 style={{
                  color: '#1C1C1E', margin: 0, fontSize: 17, fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.25,
                }}>
                  {ko ? '4대 핵심 지표 도입 전·후' : '4 Key Metrics: Before & After'}
                </h3>
                <span style={{ color: '#C7C7CC', fontSize: 16, fontWeight: 700, letterSpacing: 2, lineHeight: 1 }} aria-hidden>···</span>
              </div>
              <p style={{ color: '#8E8E93', margin: '6px 0 0', fontSize: 12, fontWeight: 500, lineHeight: 1.4 }}>
                {ko ? '막대 길이 = 표시된 %(0–100 동일 스케일)' : 'Bar length = shown % (same 0–100 scale)'}
              </p>
            </div>
          </div>

          {/* 차트: Y라벨 + 전·후 각각 0–100% 스케일 막대 (수치와 길이 일치) — flex-1로 하단 범례 구분선 높이를 우측 카드와 맞춤 */}
          <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', gap: 20 }}>
              {_BAR_DATA.map((d, i) => {
                const bPct = Math.min(100, Math.max(0, d.before));
                const aPct = Math.min(100, Math.max(0, d.after));
                const delta   = d.upIsGood ? d.after - d.before : d.before - d.after;
                const deltaSign = delta >= 0 ? '+' : '';
                return (
                  <div key={d.label} className="flex flex-col gap-2 sm:flex-row sm:items-start sm:gap-2.5">
                    {/* Y축 라벨 */}
                    <div className="w-full shrink-0 text-left sm:w-[78px]">
                      <span style={{ fontSize: 12, fontWeight: 600, color: '#8E8E93', display: 'block', lineHeight: 1.25 }}>
                        {ko ? d.label : d.labelEn}
                      </span>
                      <span
                        style={{
                          display: 'inline-block',
                          marginTop: 4,
                          fontSize: 10,
                          fontWeight: 700,
                          color: delta >= 0 ? '#34C759' : '#FF3B30',
                          background: delta >= 0 ? 'rgba(52,199,89,0.1)' : 'rgba(255,59,48,0.08)',
                          padding: '2px 6px',
                          borderRadius: 999,
                        }}
                      >
                        {deltaSign}{delta}%
                      </span>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      {/* 도입 전 — 트랙 전체 = 100%, 채움 = before% */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                        <span style={{ fontSize: 10, fontWeight: 600, color: _DASH_BEFORE_ACCENT, width: 18, flexShrink: 0 }}>{ko ? '전' : 'B'}</span>
                        <div
                          style={{
                            height: 7,
                            flex: 1,
                            borderRadius: 999,
                            background: '#E5E5EA',
                            overflow: 'hidden',
                            boxShadow: _VIZ_DASH_TRACK_GLOW_BEFORE,
                            position: 'relative',
                          }}
                        >
                          <motion.div
                            style={{
                              position: 'relative',
                              zIndex: 1,
                              height: '100%',
                              borderRadius: 999,
                              background: _VIZ_DASH_BAR_BEFORE,
                              boxSizing: 'border-box',
                            }}
                            initial={{ width: '0%' }}
                            animate={{ width: `${bPct}%` }}
                            transition={{ duration: 0.9, delay: 0.08 + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                          />
                        </div>
                        <span
                          style={{
                            display: 'inline-block',
                            fontSize: 11,
                            fontWeight: 600,
                            color: _DASH_BEFORE_COLOR,
                            width: 38,
                            textAlign: 'left',
                            flexShrink: 0,
                            fontVariantNumeric: 'tabular-nums',
                          }}
                        >
                          {d.before}%
                        </span>
                      </div>
                      {/* 도입 후 — 트랙 전체 = 100%, 채움 = after% */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ fontSize: 10, fontWeight: 600, color: _DASH_AFTER_ACCENT, width: 18, flexShrink: 0 }}>{ko ? '후' : 'A'}</span>
                        <div
                          style={{
                            height: 7,
                            flex: 1,
                            borderRadius: 999,
                            background: '#E5E5EA',
                            overflow: 'hidden',
                            boxShadow: _VIZ_DASH_TRACK_GLOW_AFTER,
                            position: 'relative',
                          }}
                        >
                          <motion.div
                            style={{
                              position: 'relative',
                              zIndex: 1,
                              height: '100%',
                              borderRadius: 999,
                              background: _VIZ_DASH_BAR_AFTER,
                              boxSizing: 'border-box',
                            }}
                            initial={{ width: '0%' }}
                            animate={{ width: `${aPct}%` }}
                            transition={{ duration: 0.9, delay: 0.18 + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                          />
                        </div>
                        <span
                          style={{
                            display: 'inline-block',
                            fontSize: 11,
                            fontWeight: 700,
                            color: _DASH_AFTER_COLOR,
                            width: 38,
                            textAlign: 'left',
                            flexShrink: 0,
                            fontVariantNumeric: 'tabular-nums',
                          }}
                        >
                          {d.after}%
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>

          {/* 범례 (이미지 스타일: 둥근 스와치) */}
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 18, marginTop: 20, paddingTop: 20, borderTop: '1px solid rgba(0,0,0,0.06)' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <span
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: 4,
                  background: _VIZ_DASH_BAR_BEFORE,
                  flexShrink: 0,
                  boxShadow: _VIZ_DASH_TRACK_GLOW_BEFORE,
                }}
              />
              <span style={{ fontSize: 12, fontWeight: 500, color: '#1C1C1E' }}>{ko ? '도입 전' : 'Before'}</span>
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <span
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: 4,
                  background: _VIZ_DASH_BAR_AFTER,
                  flexShrink: 0,
                  boxShadow: _VIZ_DASH_TRACK_GLOW_AFTER,
                }}
              />
              <span style={{ fontSize: 12, fontWeight: 500, color: '#1C1C1E' }}>{ko ? '도입 후 (WIZ-Flow)' : 'After (WIZ-Flow)'}</span>
            </span>
          </div>
        </div>

        {/* ── 도넛 차트 (구분선·범례는 좌측 카드와 동일 패턴: 본문 flex-1 → border → 범례) ── */}
        <div style={{ ..._VIZ_CARD, display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>
          <p
            style={{
              color: '#1C1C1E',
              margin: 0,
              marginBottom: _VIZ_CARD_TITLE_GAP,
              fontSize: 17,
              fontWeight: 700,
              letterSpacing: '-0.02em',
            }}
          >
            {ko ? '용지 사용 절감 비율' : 'Paper Usage Reduction'}
          </p>

          {/* donut + 하단 KPI (구분선 위까지) */}
          <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingTop: 0, paddingBottom: 0 }}>
            <div style={{ position: 'relative', width: 186, height: 186 }}>
              <svg width="186" height="186" viewBox="0 0 186 186">
                <defs>
                  <linearGradient id="vizGreenGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#34C759" />
                    <stop offset="100%" stopColor="#30D158" />
                  </linearGradient>
                  <filter id="vizGlow">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
                  </filter>
                </defs>
                {/* track */}
                <circle cx="93" cy="93" r={donutR} fill="none" stroke="#E5E5EA" strokeWidth={donutStroke} />
                {/* fill with glow */}
                <motion.circle
                  cx="93" cy="93" r={donutR}
                  fill="none"
                  stroke="url(#vizGreenGrad)"
                  strokeWidth={donutStroke}
                  strokeLinecap="round"
                  strokeDasharray={circ}
                  strokeDashoffset={circ}
                  filter="url(#vizGlow)"
                  animate={{ strokeDashoffset: circ * (1 - savePct / 100) }}
                  transition={{ duration: 1.5, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  style={{ transform: 'rotate(-90deg)', transformOrigin: '93px 93px' }}
                />
              </svg>
              {/* center text */}
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  style={{ fontSize: 36, fontWeight: 800, color: '#1C1C1E', lineHeight: 1,
                           letterSpacing: '-0.03em', fontFamily: "'Inter', sans-serif" }}
                >
                  95%
                </motion.span>
                <span style={{ fontSize: 11, fontWeight: 500, color: '#8E8E93', marginTop: 5 }}>
                  {ko ? '절감' : 'Saved'}
                </span>
              </div>
            </div>

            {/* 하단 서브 KPI (구분선 위 영역) */}
            <div style={{ marginTop: 22, width: '100%', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[
                { num: '↓95%', desc: ko ? '용지 사용' : 'Paper Use' },
                { num: '↑84%', desc: ko ? '행정 효율' : 'Admin Eff.' },
              ].map(({ num, desc }) => (
                <div key={desc} style={{ textAlign: 'center' }}>
                  <p style={{ fontSize: 16, fontWeight: 800, color: '#1C1C1E', margin: 0, letterSpacing: '-0.02em',
                               fontFamily: "'Inter', sans-serif" }}>
                    {num}
                  </p>
                  <p style={{ fontSize: 10, color: '#AEAEB2', margin: '3px 0 0', fontWeight: 500 }}>{desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 범례: 좌측 카드와 동일 margin/padding/border로 구분선 높이 정렬 */}
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 18, marginTop: 20, paddingTop: 20, borderTop: '1px solid rgba(0,0,0,0.06)' }}>
            {[
              { color: '#34C759', label: ko ? `절감 ${savePct}%` : `Saved ${savePct}%` },
              { color: '#E5E5EA', stroke: '#C7C7CC', label: ko ? `잔여 ${100 - savePct}%` : `Remaining ${100 - savePct}%` },
            ].map(({ color, stroke, label }) => (
              <span key={label} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <span
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: 999,
                    background: color,
                    border: stroke ? `1px solid ${stroke}` : 'none',
                    flexShrink: 0,
                  }}
                />
                <span style={{ fontSize: 11, fontWeight: 500, color: '#6E6E73' }}>{label}</span>
              </span>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

/* ── 현장 Q&A — 도입 전(고민·질문) → 도입 후(답·변화) 대화형 카피 ──────────── */
type CompareQaRow = {
  title: string;
  titleEn: string;
  qHook: string;
  qHookEn: string;
  qBody: string;
  qBodyEn: string;
  aHook: string;
  aHookEn: string;
  aBody: string;
  aBodyEn: string;
  /** 있으면 aBody 본문에서 인용만 분리 — 따옴표는 Noto Serif KR(SmartQuoteMarksOnly) */
  aBodyQuote?: {
    prefixKo: string;
    innerKo: string;
    suffixKo: string;
    prefixEn: string;
    innerEn: string;
    suffixEn: string;
  };
};

const _COMPARE_QA: CompareQaRow[] = [
  {
    title: '작업지시 · 디지털 배포',
    titleEn: 'Work orders · Digital rollout',
    qHook: '작업지시를 또 인쇄해서 나눠줘야 하나요?',
    qHookEn: 'Do we have to print and hand out work orders again?',
    qBody: '인쇄·배포·수거만 해도 비용이 크고, 시간도 자꾸 새는데… 더 나은 방법이 없을까요?',
    qBodyEn: 'Print, distribute, collect—it costs a lot and eats time. Isn’t there a better way?',
    aHook: '디지털 작업지시가 즉시 현장으로 갑니다.',
    aHookEn: 'Digital work orders go to the floor instantly.',
    aBody: '태블릿·스마트폰 화면에 뜨니, 인쇄물 없이도 같은 시점에 같은 내용을 봅니다.',
    aBodyEn: 'They appear on tablet & smartphone screens—same content, same time, no print run.',
  },
  {
    title: '현장 입력 · 이중 작업',
    titleEn: 'Floor entry · Duplicate work',
    qHook: '현장에서 적은 걸 전산에 또 넣어야 하나요?',
    qHookEn: 'Do we have to re-type what we wrote on the floor?',
    qBody: '이중 작업이라 오타·누락이 나기 쉬운데, 누가 책임지는지도 애매해요.',
    qBodyEn: 'Double entry means errors and gaps—and it’s unclear who owns the fix.',
    aHook: '현장에서 바로 입력하면 자동 집계됩니다.',
    aHookEn: 'Enter on the floor—it aggregates automatically.',
    aBody: '한 번 입력으로 끝나고, 실시간으로 반영돼 이중 입력과 불일치를 줄입니다.',
    aBodyEn: 'One entry, real-time sync—less duplicate work and fewer mismatches.',
  },
  {
    title: '표준 개정 · 현장 반영',
    titleEn: 'Standards · Floor rollout',
    qHook: '표준을 바꿨는데, 현장까지 언제 반영되나요?',
    qHookEn: 'We revised the standard—when does the floor actually get it?',
    qBody: '며칠 걸리면 구버전과 섞여 쓰이는 위험이 있어서 항상 불안해요.',
    qBodyEn: 'If it takes days, old and new versions mix on the floor—that’s risky.',
    aHook: '개정 즉시 현장에 적용·이력이 남습니다.',
    aHookEn: 'Revisions apply to the floor immediately—with history.',
    aBody: '버전·승인 흐름이 자동으로 묶여, “어떤 기준으로 작업 중인지”가 명확해집니다.',
    aBodyEn: 'Version & approval stay tied so everyone knows which standard is in effect.',
    aBodyQuote: {
      prefixKo: '버전·승인 흐름이 자동으로 묶여, ',
      innerKo: '어떤 기준으로 작업 중인지',
      suffixKo: '가 명확해집니다.',
      prefixEn: 'Version & approval stay tied so everyone knows ',
      innerEn: 'which standard is in effect',
      suffixEn: '.',
    },
  },
  {
    title: '실적 · 실시간 가시성',
    titleEn: 'Performance · Real-time visibility',
    qHook: '실적은 내일이나 되어야 볼 수 있나요?',
    qHookEn: 'Can we only see performance numbers tomorrow?',
    qBody: '지금 결정해야 하는데 D+1이라면, 이미 늦은 느낌이에요.',
    qBodyEn: 'We need to decide now—D+1 feels too late.',
    aHook: '실시간으로 보이는 대시보드·KPI입니다.',
    aHookEn: 'Dashboards and KPIs update in real time.',
    aBody: '집계·리포트가 자동으로 돌아가서, 회의 전에 엑셀부터 돌리지 않아도 됩니다.',
    aBodyEn: 'Aggregation and reports run automatically—less pre-meeting spreadsheet work.',
  },
  {
    title: '불량 대응 · 이력·워크플로',
    titleEn: 'Defects · History & workflow',
    qHook: '불량은 전화·메신저로 알리면 되나요?',
    qHookEn: 'Is phone or chat enough for defect reports?',
    qBody: '이력이 남지 않거나 누가 조치 중인지 모를 때가 많아요.',
    qBodyEn: 'History goes missing and it’s unclear who’s acting on what.',
    aHook: '알림 → 배정 → 조치까지 한 흐름으로 갑니다.',
    aHookEn: 'Alert → assign → action in one flow.',
    aBody: '담당자 통보와 이력이 자동으로 쌓여, 대응이 늦어지는 구간을 줄입니다.',
    aBodyEn: 'Owners get notified and history builds automatically—fewer slow handoffs.',
  },
  {
    title: '설비 데이터 · PLC·MES 연동',
    titleEn: 'Equipment data · PLC / MES',
    qHook: 'PLC·MES가 따로 노는데, 기준을 어디로 맞춰야 할까요?',
    qHookEn: 'PLC and MES don’t align—which baseline should we use?',
    qBody: '연동이 끊기면 현장과 보고 숫자가 자꾸 어긋나요.',
    qBodyEn: 'When the link breaks, floor and report numbers drift apart.',
    aHook: 'PLC·MES 데이터가 실시간으로 한 흐름으로 붙습니다.',
    aHookEn: 'PLC / MES data connects in one real-time flow.',
    aBody: '가동·이상·실적을 같은 기준으로 보고, 옮겨 적는 수고를 줄입니다.',
    aBodyEn: 'Runtime, alarms, and results share one view—less manual bridging.',
  },
];

/** WIZ-Flow — 도입 전/후 Q&A (메시지 말풍선형 · Apple 라이트 톤) */
function WizFlowDetailCompare({ ko }: { ko: boolean }) {
  return (
    <div className="flex w-full flex-col" style={{ boxSizing: 'border-box' }}>
      <div className="text-center" style={{ marginBottom: 28 }}>
        <h2
          className="text-[32px] font-bold"
          style={{ color: '#1d1d1f', margin: 0, marginBottom: 10, lineHeight: 1.15, letterSpacing: '-0.025em' }}
        >
          {ko ? '현장에서 무엇이 달라지나요' : 'What Changes on the Shop Floor?'}
        </h2>
        <p
          className="mx-auto m-0 max-w-[34rem] text-[13px] font-normal leading-relaxed tracking-[-0.01em] text-[#86868b] sm:text-[14px]"
          style={{ wordBreak: 'keep-all' }}
        >
          {ko ? (
            <>
              현장의 질문에 <span className="font-semibold text-[#1d1d1f]">WIZ-Flow</span>가 어떻게 답하는지,{' '}
              <span className="font-semibold text-[#1d1d1f]">6가지 대화</span>로 살펴보세요.
            </>
          ) : (
            <>
              <span className="font-semibold text-[#1d1d1f]">Six short Q&As</span>: from floor questions to how{' '}
              <span className="font-semibold text-[#1d1d1f]">WIZ-Flow</span> responds.
            </>
          )}
        </p>
      </div>

      <div
        className="mb-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 sm:gap-x-12"
        style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#86868B' }}
      >
        <span className="inline-flex items-center gap-2">
          <MessageCircle className="h-3.5 w-3.5 shrink-0 opacity-80" strokeWidth={2} aria-hidden />
          {ko ? '도입 전 · 현장의 고민' : 'Before · On-floor concerns'}
        </span>
        <span className="inline-flex items-center gap-2">
          <Sparkles className="h-3.5 w-3.5 shrink-0 opacity-90" strokeWidth={2} style={{ color: _DASH_AFTER_COLOR }} aria-hidden />
          {ko ? '도입 후 · WIZ-Flow의 답' : 'After · How WIZ-Flow answers'}
        </span>
      </div>

      <div className="flex flex-col gap-6">
        {_COMPARE_QA.map((row, i) => (
          <motion.article
            key={i}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-36px' }}
            transition={{ duration: 0.5, delay: 0.06 * i, ease: [0.22, 1, 0.36, 1] }}
            className="relative overflow-hidden rounded-[22px] border border-black/[0.06] bg-white"
            style={{
              boxShadow: '0 1px 2px rgba(0,0,0,0.04), 0 16px 48px rgba(0,0,0,0.06)',
            }}
          >
            <div
              className="flex items-start justify-between gap-3 border-b px-4 py-3.5 sm:items-center sm:px-6"
              style={{ borderColor: 'rgba(0,0,0,0.05)', background: 'linear-gradient(180deg, #FAFAFA 0%, #FFFFFF 100%)' }}
            >
              <h3
                className="m-0 flex min-w-0 flex-1 flex-wrap items-baseline gap-0 text-left text-[17px] font-semibold leading-[1.25] tracking-[-0.025em]"
                style={{ color: '#1d1d1f' }}
              >
                {/* 인덱스 색은 프로세스 맵(01.) 카드와 동일 · 굵기는 기존 semibold 유지 */}
                <span className="shrink-0 tabular-nums font-semibold" style={{ color: '#c7c7cc' }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="shrink-0 font-semibold" style={{ color: '#c7c7cc' }}>.&nbsp; </span>
                <span className="min-w-0 font-semibold" style={{ color: '#1d1d1f' }}>{ko ? row.title : row.titleEn}</span>
              </h3>
              <span
                className={
                  'mt-0.5 shrink-0 text-right text-[9px] font-bold leading-tight sm:mt-0 sm:text-[10px] ' +
                  (ko ? 'tracking-[0.06em]' : 'uppercase tracking-[0.12em] sm:tracking-[0.16em]')
                }
                style={{ color: '#AEAEB2' }}
              >
                {ko ? '대화' : 'Conversation'}
              </span>
            </div>

            <div className="space-y-0 px-4 pb-5 pt-4 sm:px-6 sm:pb-6 sm:pt-5">
              <div className="flex justify-start">
                <div className="flex max-w-[100%] gap-3 sm:max-w-[92%]">
                  <div
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full sm:h-10 sm:w-10"
                    style={{
                      background: '#F2F2F7',
                      boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.04)',
                    }}
                    aria-hidden
                  >
                    <MessageCircle className="h-[18px] w-[18px] text-[#636366]" strokeWidth={2} />
                  </div>
                  <div
                    className="min-w-0 flex-1 rounded-[18px] rounded-tl-[6px] px-4 py-3.5 sm:px-5 sm:py-4"
                    style={{
                      background: '#E9E9EB',
                      boxShadow: '0 1px 0 rgba(255,255,255,0.6) inset',
                    }}
                  >
                    <p className="text-[11px] font-semibold uppercase tracking-[0.1em]" style={{ color: '#8E8E93', margin: '0 0 8px' }}>
                      {ko ? '현장의 질문' : 'The question'}
                    </p>
                    <p className="text-[16px] font-semibold leading-snug tracking-[-0.02em]" style={{ color: '#1d1d1f', margin: 0 }}>
                      {ko ? row.qHook : row.qHookEn}
                    </p>
                    <p className="mt-2.5 text-[14px] font-normal leading-relaxed" style={{ color: '#3a3a3c', margin: 0 }}>
                      {ko ? row.qBody : row.qBodyEn}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center gap-3 py-3 sm:py-4" aria-hidden>
                <div className="h-px flex-1 max-w-[72px] bg-gradient-to-r from-transparent via-black/8 to-transparent sm:max-w-[120px]" />
                <div
                  className="flex items-center gap-1.5 rounded-full px-3 py-1.5"
                  style={{
                    background: 'rgba(0,0,0,0.04)',
                    border: '1px solid rgba(0,0,0,0.06)',
                  }}
                >
                  <Sparkles className="h-3 w-3" strokeWidth={2} style={{ color: _DASH_AFTER_COLOR }} />
                  <span className="text-[10px] font-bold uppercase tracking-[0.14em]" style={{ color: '#86868B' }}>
                    WIZ-Flow
                  </span>
                </div>
                <div className="h-px flex-1 max-w-[72px] bg-gradient-to-r from-transparent via-black/8 to-transparent sm:max-w-[120px]" />
              </div>

              <div className="flex justify-end">
                <div className="flex max-w-[100%] flex-row-reverse gap-3 sm:max-w-[92%]">
                  <div
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full sm:h-10 sm:w-10"
                    style={{
                      background: 'rgba(52,199,89,0.12)',
                      boxShadow: 'inset 0 0 0 1px rgba(52,199,89,0.2)',
                    }}
                    aria-hidden
                  >
                    <Sparkles className="h-[18px] w-[18px]" strokeWidth={2} style={{ color: _DASH_AFTER_COLOR }} />
                  </div>
                  <div
                    className="min-w-0 flex-1 rounded-[18px] rounded-tr-[6px] px-4 py-3.5 sm:px-5 sm:py-4"
                    style={{
                      background: 'linear-gradient(180deg, rgba(52,199,89,0.11) 0%, rgba(52,199,89,0.06) 100%)',
                      border: '1px solid rgba(52,199,89,0.22)',
                      boxShadow: '0 1px 0 rgba(255,255,255,0.65) inset',
                    }}
                  >
                    <p className="text-[11px] font-semibold uppercase tracking-[0.1em]" style={{ color: '#248A3D', margin: '0 0 8px' }}>
                      {ko ? '이렇게 달라집니다' : 'What changes'}
                    </p>
                    <p className="text-[16px] font-semibold leading-snug tracking-[-0.02em]" style={{ color: '#1d1d1f', margin: 0 }}>
                      {ko ? row.aHook : row.aHookEn}
                    </p>
                    <p className="mt-2.5 text-[14px] font-normal leading-relaxed" style={{ color: '#3a3a3c', margin: 0 }}>
                      {row.aBodyQuote
                        ? ko
                          ? (
                              <>
                                {row.aBodyQuote.prefixKo}
                                <SmartQuoteMarksOnly inner={row.aBodyQuote.innerKo} />
                                {row.aBodyQuote.suffixKo}
                              </>
                            )
                          : (
                              <>
                                {row.aBodyQuote.prefixEn}
                                <SmartQuoteMarksOnly inner={row.aBodyQuote.innerEn} />
                                {row.aBodyQuote.suffixEn}
                              </>
                            )
                        : (ko ? row.aBody : row.aBodyEn)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  );
}

/** WIZ-Flow 작업지시 흐름 — 배경과 맞닿이고, 구분이 필요한 블록만 단일 카드 */
function WizFlowProcessFlow({ ko }: { ko: boolean }) {
  return (
    <div className="flex w-full flex-col" style={{ boxSizing: 'border-box' }}>
      <div className="mb-9 text-center">
        <h2
          className="text-[30px] font-bold tracking-[-0.03em] sm:text-[32px]"
          style={{ color: '#0f172a', margin: '0 0 10px', lineHeight: 1.12 }}
        >
          {ko ? '작업지시 흐름이 이렇게 달라집니다' : 'How Work Order Flow Changes'}
        </h2>
        <p
          className="mx-auto m-0 max-w-[34rem] text-[13px] font-normal leading-relaxed tracking-[-0.01em] text-[#86868b] sm:text-[14px]"
          style={{ wordBreak: 'keep-all' }}
        >
          {ko ? (
            <>
              <span className="font-semibold text-[#1d1d1f]">종이</span>는 줄이고,{' '}
              <span className="font-semibold text-[#1d1d1f]">시간</span>은 단축하고,{' '}
              <span className="font-semibold text-[#1d1d1f]">데이터</span>는 더 빠르고 정확하게 활용합니다.
            </>
          ) : (
            <>
              Use less <span className="font-semibold text-[#1d1d1f]">paper</span>, shorten{' '}
              <span className="font-semibold text-[#1d1d1f]">time</span>, and put{' '}
              <span className="font-semibold text-[#1d1d1f]">data</span> to work faster and more accurately.
            </>
          )}
        </p>
      </div>

      <div className="space-y-10 sm:space-y-12">
        {/* 8→4 프로세스 맵 — 02와 동일 apple.com 제품 카드형 셸 */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-32px' }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="min-w-0 overflow-hidden"
          style={WIZ_FLOW_SECTION_CARD_APPLE_SHELL}
        >
          <WizFlowKeyOutcomeFlow ko={ko} />
        </motion.div>

        {/* 02. 핵심 지표 — 01과 동일 셸 */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="min-w-0 overflow-hidden"
          style={WIZ_FLOW_SECTION_CARD_APPLE_SHELL}
        >
          <WizFlowImpactMetricsCard ko={ko} />
        </motion.div>
      </div>
    </div>
  );
}

// 선이 그려지는 드로잉 애니메이션 아이콘
function AnimatedTrendUp({ color, size = 14 }: { color: string; size?: number }) {
  const DUR = 2.4;
  const loop = { repeat: Infinity, repeatType: 'loop' as const, ease: 'easeInOut' as const };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      {/* 트렌드 선: 좌하→우상 */}
      <motion.path d="M2,17 L8.5,10.5 L13.5,15.5 L22,7"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: [0, 1, 1] }}
        transition={{ ...loop, duration: DUR, times: [0, 0.55, 1] }} />
      {/* 화살표 */}
      <motion.path d="M16,7 L22,7 L22,13"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: [0, 0, 1, 1] }}
        transition={{ ...loop, duration: DUR, times: [0, 0.44, 0.75, 1] }} />
    </svg>
  );
}

function AnimatedTrendDown({ color, size = 14 }: { color: string; size?: number }) {
  const DUR = 2.4;
  const loop = { repeat: Infinity, repeatType: 'loop' as const, ease: 'easeInOut' as const };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      {/* 트렌드 선: 좌상→우하 */}
      <motion.path d="M2,7 L8.5,13.5 L13.5,8.5 L22,17"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: [0, 1, 1] }}
        transition={{ ...loop, duration: DUR, times: [0, 0.55, 1] }} />
      {/* 화살표 */}
      <motion.path d="M16,17 L22,17 L22,11"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: [0, 0, 1, 1] }}
        transition={{ ...loop, duration: DUR, times: [0, 0.44, 0.75, 1] }} />
    </svg>
  );
}

// 게이지와 숫자를 단일 MotionValue로 완전 동기화
function MetricCard({ m, i, ko }: {
  m: { label: string; labelEn?: string; value: string };
  i: number;
  ko: boolean;
}) {
  const isDecrease = i >= 2;
  const fromPct = isDecrease ? 100 : 0;
  const toPct = parseInt(m.value);
  const color = METRIC_COLORS[i];
  const sublabel = isDecrease
    ? (ko ? '시간 단축' : 'Reduced')
    : i === 0 ? (ko ? '용지 절감' : 'Saved') : (ko ? '효율 향상' : 'Improved');

  // 단일 MotionValue — 게이지 width와 숫자/색상 모두 이 값을 구독
  // React 상태 업데이트 없이 ref로 DOM 직접 조작 → 매 프레임 리렌더링 방지
  const progress = useMotionValue(fromPct);
  const gaugeWidth = useTransform(progress, v => `${v}%`);
  const numRef = useRef<HTMLSpanElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const controls = animate(progress, toPct, {
      duration: 3.5,
      delay: 0.3 + i * 0.15,
      ease: 'easeInOut',
      repeat: Infinity,
      repeatType: 'loop',
      repeatDelay: 2.5,
    });
    const unsubscribe = progress.on('change', v => {
      const rounded = Math.round(v);
      if (numRef.current) numRef.current.textContent = String(rounded);
      const atTarget = isDecrease ? rounded <= toPct : rounded >= toPct;
      const c = atTarget ? (isDecrease ? LG_RED : '#34C759') : '#1D1D1F';
      if (wrapRef.current) wrapRef.current.style.color = c;
    });
    return () => { controls.stop(); unsubscribe(); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{
      /* 그리드 셀 높이에 맞춤 — aspect-ratio 제거로 상위 섹션 밖으로 밀려 나오지 않음 */
      height: '100%',
      width: '100%',
      minHeight: 0,
      background: WIZ_FLOW_TILE.bg,
      border: WIZ_FLOW_TILE.border,
      borderRadius: WIZ_FLOW_TILE.radiusTile,
      boxShadow: WIZ_FLOW_TILE.shadow,
      padding: `${SECTION_LABEL_GAP_BELOW}px ${WIZ_FLOW_METRIC_CARD_PAD_X}px`,
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      overflow: 'hidden',
      boxSizing: 'border-box',
    }}>

      {/* 상단: 4개 지표 문구 — font-size 14px (월별 성과 '2025년 1분기' 배지와 동일) */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', minHeight: WIZ_FLOW_TREND_ICON_ROW_H }}>
        <p style={{ fontSize: '14px', fontWeight: 700, color: T_TER, lineHeight: 1.3, maxWidth: '70%', margin: 0 }}>
          {ko ? m.label : m.labelEn}
        </p>
        <div style={{
          width: WIZ_FLOW_TREND_ICON_ROW_H, height: WIZ_FLOW_TREND_ICON_ROW_H, borderRadius: 10,
          background: G_MID,
          border: WIZ_FLOW_TILE.border,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          {isDecrease
            ? <AnimatedTrendDown color={color} size={12} />
            : <AnimatedTrendUp color={color} size={12} />
          }
        </div>
      </div>

      {/* 중앙: 숫자 */}
      <div style={{ textAlign: 'center', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div ref={wrapRef} style={{
          fontWeight: 900, fontVariantNumeric: 'tabular-nums', lineHeight: 1,
          fontSize: 'clamp(22px, 3.2vw, 38px)',
          color: '#1D1D1F',
          transition: 'color 0.3s ease',
        }}>
          <span ref={numRef}>{fromPct}</span>
          <span style={{ fontSize: '0.5em', fontWeight: 800 }}>%</span>
        </div>
      </div>

      {/* 하단: 게이지↔서브라벨 간격을 상단 gap과 동일(8px) — 게이지 단독 marginBottom 제거로 상·하 밸런스 */}
      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{
          height: 16, borderRadius: 12,
          background: WIZ_FLOW_TILE.wellBg,
          border: WIZ_FLOW_TILE.wellBorder,
          overflow: 'hidden', position: 'relative',
        }}>
          <motion.div style={{
            position: 'absolute', top: 0, bottom: 0, left: 0,
            width: gaugeWidth,
            background: `linear-gradient(to right, ${color}DD, ${color}88)`,
            borderRadius: 12,
          }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 18, fontWeight: 600, color, lineHeight: 1 }}>{sublabel}</span>
          <div style={{ width: 14, height: 14, borderRadius: '50%', background: color, boxShadow: `0 0 7px ${color}99`, flexShrink: 0 }} />
        </div>
      </div>

    </div>
  );
}

const WIZ_FLOW_MONTHLY = [
  { month: '1월', monthEn: 'Jan', paperless: 38, efficiency: 12 },
  { month: '2월', monthEn: 'Feb', paperless: 52, efficiency: 17 },
  { month: '3월', monthEn: 'Mar', paperless: 65, efficiency: 21 },
  { month: '4월', monthEn: 'Apr', paperless: 76, efficiency: 26 },
  { month: '5월', monthEn: 'May', paperless: 86, efficiency: 29 },
  { month: '6월', monthEn: 'Jun', paperless: 95, efficiency: 32 },
];

function WizFlowBarChart({ ko }: { ko: boolean }) {
  const t = useDashPalette();
  const VW = 320;
  /** 플롯 아래 X축 월 라벨용 여백 — viewBox 확장 + padBottom 증가로 플롯 높이(212) 유지 */
  const VH = 248;
  const padX = 18;
  const padTop = 6;
  const padBottomPlot = 30;
  const monthLabelY = VH - 10;
  const paperlessPts = WIZ_FLOW_MONTHLY.map((d) => d.paperless);
  const efficiencyPts = WIZ_FLOW_MONTHLY.map((d) => d.efficiency);
  const linePl = mkLinePath0to100(paperlessPts, VW, VH, padX, padTop, padBottomPlot);
  const lineEf = mkLinePath0to100(efficiencyPts, VW, VH, padX, padTop, padBottomPlot);

  const plotH = VH - padTop - padBottomPlot;
  const gridYs = [100, 50, 0].map((pct) => VH - padBottomPlot - (pct / 100) * plotH);

  const legendItem = (dotBg: string, dotShadow: string, label: string, color: string) => (
    <div
                style={{
        display: 'inline-flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: 8,
        height: WIZ_FLOW_TREND_ICON_ROW_H,
        flexShrink: 0,
      }}
    >
      <span
                style={{
          width: 12,
          height: 12,
          borderRadius: '50%',
          background: dotBg,
          boxShadow: dotShadow,
          flexShrink: 0,
          alignSelf: 'center',
        }}
      />
      <span
                style={{
          fontSize: 14,
          fontWeight: 600,
          color,
          lineHeight: 1,
          display: 'flex',
          alignItems: 'center',
          height: '100%',
        }}
      >
        {label}
      </span>
                </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, height: '100%' }}>
      {/* 범례 — 점·문구 수직 중앙 정렬(inline-flex + 고정 행 높이) */}
      <div
                style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 16,
          marginBottom: 4,
          flexShrink: 0,
          minHeight: WIZ_FLOW_TREND_ICON_ROW_H,
        }}
      >
        {legendItem(LG_RED, `0 0 7px ${LG_RED}99`, ko ? '페이퍼리스 전환률' : 'Paperless Rate', LG_RED)}
        {legendItem('#34C759', '0 0 7px #34C75999', ko ? '효율 향상률' : 'Efficiency Gain', '#34C759')}
            </div>

      {/* 듀얼 라인 — flex-1 + min-h-0으로 좌측 지표 그리드와 높이 공유 시 넘침 방지 */}
      <div style={{ flex: 1, minHeight: 0, width: '100%', position: 'relative' }}>
        <svg
          width="100%"
          height="100%"
          viewBox={`0 0 ${VW} ${VH}`}
          preserveAspectRatio="xMidYMid meet"
          style={{ display: 'block' }}
        >
          <defs>
            <filter id="wiz-flow-line-glow-red" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="0.8" result="b" />
              <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <filter id="wiz-flow-line-glow-grn" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="0.8" result="b" />
              <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>

          {gridYs.map((gy, gi) => (
            <line
              key={gi}
              x1={padX}
              y1={gy}
              x2={VW - padX}
              y2={gy}
              stroke={t.gridStroke}
              strokeWidth={1}
              strokeDasharray="4 4"
            />
          ))}

          <text x={2} y={gridYs[0] + 4} fontSize={10} fill={t.axisText} fontWeight={600}>100</text>
          <text x={2} y={gridYs[1] + 4} fontSize={10} fill={t.axisText} fontWeight={600}>50</text>
          <text x={2} y={gridYs[2] + 4} fontSize={10} fill={t.axisText} fontWeight={600}>0</text>

          {linePl.d && (
            <motion.path
              d={linePl.d}
              fill="none"
              stroke={LG_RED}
              strokeWidth={3.2}
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#wiz-flow-line-glow-red)"
              initial={{ pathLength: 0, opacity: 0.4 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1.15, ease: [0.22, 1, 0.36, 1] }}
            />
          )}
          {lineEf.d && (
            <motion.path
              d={lineEf.d}
              fill="none"
              stroke="#34C759"
              strokeWidth={3.2}
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#wiz-flow-line-glow-grn)"
              initial={{ pathLength: 0, opacity: 0.4 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1.15, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
            />
          )}

          {linePl.xs.map((cx, i) => (
            <motion.g key={`pl-${i}`} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.45 + i * 0.06, type: 'spring', stiffness: 380, damping: 22 }}>
              <circle cx={cx} cy={linePl.ys[i]} r={3.8} fill={LG_RED} stroke={t.dataLabelStroke} strokeWidth={1.3} />
            </motion.g>
          ))}
          {lineEf.xs.map((cx, i) => (
            <motion.g key={`ef-${i}`} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.55 + i * 0.06, type: 'spring', stiffness: 380, damping: 22 }}>
              <circle cx={cx} cy={lineEf.ys[i]} r={3.8} fill="#34C759" stroke={t.dataLabelStroke} strokeWidth={1.3} />
            </motion.g>
          ))}
          {/* 도트 수치 — 페이퍼리스는 도트 위, 효율은 도트 아래로 겹침 최소화 */}
          {linePl.xs.map((cx, i) => (
            <motion.g key={`pl-lbl-${i}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 + i * 0.06, duration: 0.35 }}>
              <text
                x={cx}
                y={linePl.ys[i] - 9}
                textAnchor="middle"
                dominantBaseline="auto"
                fill={LG_RED}
                fontSize={9}
                fontWeight={700}
                stroke={t.dataLabelStroke}
                strokeWidth={0.45}
                paintOrder="stroke fill"
                style={{ fontVariantNumeric: 'tabular-nums' }}
              >
                {`${paperlessPts[i]}%`}
              </text>
            </motion.g>
          ))}
          {lineEf.xs.map((cx, i) => (
            <motion.g key={`ef-lbl-${i}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.65 + i * 0.06, duration: 0.35 }}>
              <text
                x={cx}
                y={lineEf.ys[i] + 12}
                textAnchor="middle"
                dominantBaseline="auto"
                fill="#34C759"
                fontSize={9}
                fontWeight={700}
                stroke={t.dataLabelStroke}
                strokeWidth={0.45}
                paintOrder="stroke fill"
                style={{ fontVariantNumeric: 'tabular-nums' }}
              >
                {`${efficiencyPts[i]}%`}
              </text>
            </motion.g>
          ))}
          {/* X축 월 — linePl.xs와 동일 x → 도트·수치와 수직(세로축) 정렬, meet 스케일과 무관 */}
          {linePl.xs.map((cx, i) => (
            <text
              key={`mo-${i}`}
              x={cx}
              y={monthLabelY}
              textAnchor="middle"
              dominantBaseline="middle"
              fill={t.monthLabel}
              fontSize={14}
              fontWeight={600}
            >
              {ko ? WIZ_FLOW_MONTHLY[i].month : WIZ_FLOW_MONTHLY[i].monthEn}
            </text>
          ))}
        </svg>
      </div>
    </div>
  );
}

// ── WIZ-Flow 현장 현황판 (가상 데이터 기반) ──────────────────────────────────────
const DR  = '#B30710';           // 메인 레드 — 평균 이하
const DG  = '#1a6e38';           // 포레스트 그린 — 목표 달성
const DA  = '#C49A00';           // 골든 앰버 — 목표 이하·평균 이상 (레드 계열과 어울리는 따뜻한 황금색)
const DGR = '#6b7280';
const DBD = '#e5e7eb';

/** 막대 그래프 3단계 색상: ≥93% 초록 / 76~92% 노랑 / ≤75% 레드 */
const cBar = (pct: number) => pct >= 93 ? DG : pct >= 76 ? DA : DR;

// ── 대시보드 카드 디자인 토큰 (FHD 1920×1080 기준) ──────────────────────
const DC_BG     = '#FFFFFF';
const DC_SHADOW = '0 0 0 1px rgba(0,0,0,0.03), 0 0 10px rgba(0,0,0,0.06), 0 0 22px rgba(0,0,0,0.05)';
const DC_R      = 18;
const DC_SUB    = '#EDEDF0';
const DC_SUB_R  = 12;
const DC_LINE   = '#E5E5EA';
const DC_TRACK  = '#D1D1D6';

/** 대시보드 라이트/다크 — 스크린·차트·카드 공통 토큰 */
const DashThemeContext = createContext(false);

function useDashPalette() {
  const isDark = useContext(DashThemeContext);
  return useMemo(() => getDashPalette(isDark), [isDark]);
}

function getDashPalette(isDark: boolean) {
  if (!isDark) {
    return {
      pageBg: '#F5F5F7',
      cardBg: DC_BG,
      cardShadow: DC_SHADOW,
      subBg: DC_SUB,
      line: DC_LINE,
      track: DC_TRACK,
      labelHeading: '#374151',
      sectionTitle: '#374151',
      body: '#1f2937',
      bodyMuted: '#374151',
      textMuted: DGR,
      tableHead: '#374151',
      tableCell: '#111827',
      tableEmpty: '#aaa',
      tableLight: '#bbb',
      borderSoft: '#D1D5DB',
      badgeBg: '#EDEDF0',
      gridStroke: 'rgba(136,144,160,0.25)',
      axisText: '#8890A0',
      monthLabel: '#8890A0',
      dataLabelStroke: 'rgba(255,255,255,0.92)',
      subNote: '#b0b0b0',
      chartTargetInk: '#1f2937',
      /** bulletChart2 목표 풍선 — 배경·글자 (라이트: 어두운 칩 + 흰 글자) */
      chartTargetTooltipBg: '#1f2937',
      chartTargetTooltipFg: '#ffffff',
      chartAvgBand: '#D1D5DB',
      tickLabel: '#9CA3AF',
    };
  }
  return {
    pageBg: '#000000',
    cardBg: '#1c1c1e',
    cardShadow: '0 0 0 1px rgba(255,255,255,0.08), 0 8px 36px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.06)',
    subBg: '#2c2c2e',
    line: '#3a3a3c',
    track: '#3f3f42',
    labelHeading: '#e5e5ea',
    sectionTitle: '#f5f5f7',
    body: '#e5e5ea',
    bodyMuted: '#d1d1d6',
    textMuted: '#a1a1a6',
    tableHead: '#f5f5f7',
    tableCell: '#e5e5ea',
    tableEmpty: '#636366',
    tableLight: '#8e8e93',
    borderSoft: '#48484a',
    badgeBg: '#2c2c2e',
    gridStroke: 'rgba(255,255,255,0.14)',
    axisText: '#a1a1a6',
    monthLabel: '#d1d1d6',
    dataLabelStroke: 'rgba(0,0,0,0.75)',
    subNote: '#8e8e93',
    chartTargetInk: '#e5e5ea',
    /** 다크: 밝은 칩 + 어두운 글자 (흰 글자+밝은 배경 대비 붕괴 방지) */
    chartTargetTooltipBg: '#f5f5f7',
    chartTargetTooltipFg: '#1c1c1e',
    chartAvgBand: '#48484a',
    tickLabel: '#8e8e93',
  };
}

// 섹션 레이블 — 레드 액센트 바 + 다크 텍스트 (FHD)
function DSLabel({ label }: { label: string }) {
  const t = useDashPalette();
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, flexShrink: 0 }}>
      <span style={{ width: 5, height: 22, borderRadius: 4, background: DR, flexShrink: 0 }} />
      <span style={{ fontSize: 22, fontWeight: 800, color: t.labelHeading, letterSpacing: '0.03em' }}>{label}</span>
    </div>
  );
}

function DashVertBar({ label, sub, pct, color }: { label: string; sub?: string; pct: number; color?: string }) {
  const t = useDashPalette();
  const c = color ?? cBar(pct);
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
      <div style={{ fontSize: 22, fontWeight: 600, color: t.textMuted, textAlign: 'center', lineHeight: 1.2, whiteSpace: 'pre-line' }}>{label}</div>
      {sub && <div style={{ fontSize: 18, color: t.subNote, lineHeight: 1 }}>{sub}</div>}
      <div style={{ flex: 1, width: 64, background: t.track, borderRadius: 14, overflow: 'hidden', display: 'flex', alignItems: 'flex-end' }}>
        <motion.div initial={{ height: 0 }} animate={{ height: `${Math.min(pct, 100)}%` }}
          transition={{ duration: 1.1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          style={{ width: '100%', background: c, borderRadius: 14 }} />
      </div>
      <div style={{ height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 900, color: c }}>{pct}%</div>
    </div>
  );
}

function DashArc({ label, sub, pct, color }: { label: string; sub?: string; pct: number; color?: string }) {
  const t = useDashPalette();
  const c = color ?? cBar(pct);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: "8px 4px" }}>
      {sub && <div style={{ fontSize: 18, color: t.textMuted, marginBottom: 8, textAlign: 'center' }}>{sub}</div>}
      <div style={{ position: 'relative', width: 110, height: 62 }}>
        <svg width="110" height="62" viewBox="0 0 110 62">
          <path d="M 8 56 A 47 47 0 0 1 102 56" fill="none" stroke={t.track} strokeWidth="8" strokeLinecap="round" />
          <motion.path d="M 8 56 A 47 47 0 0 1 102 56" fill="none" stroke={c} strokeWidth="8" strokeLinecap="round"
            initial={{ pathLength: 0 }} animate={{ pathLength: pct / 100 }}
            transition={{ duration: 1.3, delay: 0.3, ease: [0.22, 1, 0.36, 1] }} />
        </svg>
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, textAlign: 'center', fontSize: 22, fontWeight: 900, color: c }}>{pct}%</div>
      </div>
      <div style={{ fontSize: 18, fontWeight: 700, color: t.sectionTitle, textAlign: 'center', maxWidth: 110, lineHeight: 1.2, marginTop: 4 }}>{label}</div>
    </div>
  );
}

function DashBigScore({ label, pct, frac, color }: { label: string; pct: number; frac: string; color: string }) {
  return (
    <div style={{ background: color, borderRadius: 18, padding: "18px 24px", flex: 1, minWidth: 0 }}>
      <div style={{ fontSize: 22, fontWeight: 600, color: 'rgba(255,255,255,0.85)' }}>{label}</div>
      <div style={{ fontSize: 48, fontWeight: 900, color: '#fff', lineHeight: 1, letterSpacing: '-0.02em' }}>{pct}%</div>
      <div style={{ fontSize: 18, color: 'rgba(255,255,255,0.65)', marginTop: 4 }}>{frac}</div>
    </div>
  );
}

function DashMiniKPI({ label, target, val, color }: { label: string; target: string; val: string; color: string }) {
  const t = useDashPalette();
  return (
    <div style={{ background: t.subBg, borderRadius: DC_SUB_R, padding: "14px 18px", marginBottom: 10 }}>
      <div style={{ fontSize: 26, fontWeight: 700, color: t.sectionTitle }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
        <span style={{ fontSize: 20, color: t.textMuted, flex: 1 }}>{target}</span>
        <span style={{ fontSize: 38, fontWeight: 900, color }}>{val}</span>
      </div>
    </div>
  );
}

function DashDot({ pct }: { pct: number | null }) {
  const c = pct === null ? '#d1d5db' : cBar(pct);
  return <span style={{ display: 'inline-block', width: 28, height: 28, borderRadius: '50%', background: c, flexShrink: 0 }} />;
}

/** 스파크라인 SVG 경로 계산 — 부드러운 cubic bezier 곡선 + 도트 좌표 반환 */
function mkSpark(pts: number[], vw = 110, vh = 56, padTop = 14, padBot = 5, padX = 10) {
  const min = Math.min(...pts), max = Math.max(...pts);
  const r = max - min || 1;
  const n = pts.length;
  const xs = pts.map((_, i) => padX + (i / (n - 1)) * (vw - padX * 2));
  const ys = pts.map(p => vh - padBot - ((p - min) / r) * (vh - padTop - padBot));
  let l = `M${xs[0].toFixed(1)} ${ys[0].toFixed(1)}`;
  for (let i = 1; i < n; i++) {
    const mx = ((xs[i - 1] + xs[i]) / 2).toFixed(1);
    l += ` C${mx} ${ys[i-1].toFixed(1)},${mx} ${ys[i].toFixed(1)},${xs[i].toFixed(1)} ${ys[i].toFixed(1)}`;
  }
  return { line: l, area: `${l} L${xs[n-1]} ${vh} L${xs[0]} ${vh}Z`, xs, ys };
}

/** 월별 듀얼 라인 차트 — Y축 0~100% 고정 (두 지표 증가 추세 동시 비교) */
function mkLinePath0to100(
  values: number[],
  vw: number,
  vh: number,
  padX = 24,
  padTop = 18,
  padBottom = 18,
) {
  const minY = 0;
  const maxY = 100;
  const n = values.length;
  const plotH = vh - padTop - padBottom;
  if (n < 2 || plotH <= 0) return { d: '', xs: [] as number[], ys: [] as number[] };
  const xs = values.map((_, i) => padX + (i / (n - 1)) * (vw - 2 * padX));
  const ys = values.map((v) => {
    const clamped = Math.min(100, Math.max(0, v));
    return vh - padBottom - ((clamped - minY) / (maxY - minY)) * plotH;
  });
  let l = `M${xs[0].toFixed(2)} ${ys[0].toFixed(2)}`;
  for (let i = 1; i < n; i++) {
    const mx = ((xs[i - 1] + xs[i]) / 2).toFixed(2);
    l += ` C${mx} ${ys[i - 1].toFixed(2)},${mx} ${ys[i].toFixed(2)},${xs[i].toFixed(2)} ${ys[i].toFixed(2)}`;
  }
  return { d: l, xs, ys };
}

// Screen 1 — 시스템 현황 A (4×2 그리드, FHD 1920×1080 기준)
function DashScreen1({ ko }: { ko: boolean }) {
  const [ready, setReady] = useState(false);
  useEffect(() => { const t = setTimeout(() => setReady(true), 250); return () => clearTimeout(t); }, []);
  const pal = useDashPalette();
  // ── 데이터 ──────────────────────────────────────────────────────────────────
  const esdKpi = [
    { label: '1종접지', pct: 96, change: '+2%', period: '전월' },
    { label: 'ESD',    pct: 85, change: '-1%', period: '전월' },
    { label: '정전기', pct: 93, change: '±0%', period: '전일' },
    { label: 'Tester', pct: 72, change: '-5%', period: '전일' },
  ];
  const orgItems = [
    { title: '조직 문화', goal: '면담 100%',     pct: 100 },
    { title: '역량 향상', goal: '교육 90%',      pct: 85  },
    { title: '현장 점검', goal: '낭비발굴 75%',  pct: 75  },
  ];
  const propRows = [
    { l: '총합',   v: '24', u: '건', sub: '(월)', c: DG,        pts: [5,7,6,6] },
    { l: '채택',   v: '10', u: '건', sub: '(월)', c: DA,        pts: [2,3,2,3] },
    { l: '우수',   v: '3',  u: '건', sub: '(월)', c: DR,        pts: [0,1,1,1] },
    { l: '진행중', v: '11', u: '건', sub: '(월)', c: '#3b82f6', pts: [2,4,3,2] },
  ];
  const eduTracks = [
    { label: '인재 육성',   sub: '(전분기)', val: 35, target: '참여 20%', prev: '28%' },
    { label: '성과 창출',   sub: '(전월)',   val: 71, target: '과제 100%', prev: '65%' },
    { label: '교육 이수율', sub: '',         val: 94, target: '목표 100%', prev: '91%' },
  ];
  const eduStat = [
    { l: '이수인원', v: '47명', pct: 94, c: DG },
    { l: '이수율',   v: '94%',  pct: 94, c: cBar(94) },
    { l: '자격취득', v: '12명', pct: 80, c: DA },
    { l: '미이수',   v: '3명',  pct: 30, c: DR },
  ];
  const summaryItems = [
    { l: '생산 달성', n: 87 }, { l: '현장 5S',  n: 94 },
    { l: 'ESD 점검',  n: 86 }, { l: '교육 이수', n: 94 },
    { l: '개선 참여', n: 68 }, { l: '설비 가동', n: 91 },
  ];

  // ── 카드 공통 스타일 ─────────────────────────────────────────────────────────
  const card: React.CSSProperties = {
    background: pal.cardBg, boxShadow: pal.cardShadow, borderRadius: DC_R,
    padding: '14px 18px', display: 'flex', flexDirection: 'column',
    overflow: 'hidden', minHeight: 0,
  };
  const sub18: React.CSSProperties = { background: pal.subBg, borderRadius: 14 };

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr 1fr 1fr 1fr',
      gridTemplateRows: 'minmax(0,1fr) minmax(0,1fr)',
      gap: 16,
      height: '100%', minHeight: 0, overflow: 'hidden',
    }}>

      {/* ── R1C1 : 생산 현황 ─────────────────────────────────────────────── */}
      <div style={card}>
        {/* 헤더: 라벨 + 전월 기준 뱃지 한 줄 */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8, flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 5, height: 22, borderRadius: 4, background: DR, flexShrink: 0 }} />
            <span style={{ fontSize: 22, fontWeight: 800, color: pal.labelHeading, letterSpacing: '0.03em' }}>
              {ko ? '생산 현황' : 'Production'}
            </span>
        </div>
          <span style={{
            display: 'inline-flex',
            background: `${DR}12`,
            border: `1px solid ${DR}40`,
            borderRadius: 999,
            padding: '4px 11px',
            fontSize: 13, fontWeight: 700,
            color: DR,
            lineHeight: 1,
          }}>
            전월 기준
          </span>
        </div>
        {/* 수직 막대 차트 */}
        <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
          {/* 바 영역 + 퍼센트 레이블 */}
          <div style={{ flex: 1, minHeight: 0, display: 'flex', gap: 8, alignItems: 'flex-end' }}>
            {([
              { pct: 87 },
              { pct: 93 },
              { pct: 75 },
            ] as const).map((item, idx) => {
              const c = cBar(item.pct);
              return (
                <div key={idx} style={{ flex: 1, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 0 }}>
                  {/* 배경 트랙(100%) + 오버레이 실적 바 */}
                  <div style={{ flex: 1, width: '78%', position: 'relative', display: 'flex', alignItems: 'flex-end' }}>
                    {/* 연한 배경 바 — 100% 높이 */}
                    <div style={{
                      position: 'absolute', bottom: 0, left: 0, right: 0, top: 0,
                      background: `${c}28`,
                      borderRadius: 10,
                    }} />
                    {/* 실적 바 + 퍼센트 수치 내부 표시 */}
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${item.pct}%` }}
                      transition={{ duration: 1.1, delay: idx * 0.12 + 0.2, ease: [0.22, 1, 0.36, 1] }}
                      style={{
                        width: '100%',
                        background: c,
                        borderRadius: 10,
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden',
                      }}
                    >
                      <span style={{ fontSize: 20, fontWeight: 900, color: '#fff', letterSpacing: '-0.01em', lineHeight: 1 }}>
                        {item.pct}%
                      </span>
                    </motion.div>
                  </div>
                </div>
              );
            })}
          </div>
          {/* X축 라벨 */}
          <div style={{ display: 'flex', gap: 10, flexShrink: 0, marginTop: 6 }}>
            {([
              ['생산계획', '달성율'],
              ['W/O', '완료율'],
              ['UPH', ''],
            ] as const).map((lines, idx) => (
              <div key={idx} style={{ flex: 1, textAlign: 'center', lineHeight: 1.25 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: pal.labelHeading }}>{lines[0]}</div>
                {lines[1] && <div style={{ fontSize: 14, fontWeight: 700, color: pal.labelHeading }}>{lines[1]}</div>}
            </div>
          ))}
        </div>
      </div>
        {/* 2×2 KPI 그리드 */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 8, flexShrink: 0 }}>
          {([
            { t1:'금일', t2:'목표', v:'1,240',  u:'대', c: pal.labelHeading },
            { t1:'금일', t2:'실적', v:'1,152',  u:'대', c:DG },
            { t1:'누적', t2:'목표', v:'24,800', u:'대', c: pal.labelHeading },
            { t1:'누적', t2:'실적', v:'23,104', u:'대', c:DG },
          ] as const).map(item => (
            <div key={`${item.t1}${item.t2}`} style={{ background: `${item.c}12`, border: `1.5px solid ${item.c}35`, borderRadius: 12, padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2, flexShrink: 0 }}>
                <span style={{ fontSize: 17, fontWeight: 700, color: pal.body }}>{item.t1}</span>
                <span style={{ fontSize: 17, fontWeight: 700, color: pal.body }}>{item.t2}</span>
              </div>
              <div style={{ flex: 1, textAlign: 'right' }}>
                <span style={{ fontSize: 32, fontWeight: 900, color: item.c }}>{item.v}</span>
                <span style={{ fontSize: 15, fontWeight: 700, color: item.c, marginLeft: 3 }}>{item.u}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── R1C2 : ESD / 5S 점검 ────────────────────────────────────────── */}
      <div style={card}>
        {/* 헤더: 라벨 + 목표 90% */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8, flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 5, height: 22, borderRadius: 4, background: DR, flexShrink: 0 }} />
            <span style={{ fontSize: 22, fontWeight: 800, color: pal.labelHeading, letterSpacing: '0.03em' }}>ESD / 5S 점검</span>
        </div>
            </div>
        {/* 2×2 KPI 그리드 */}
        <div style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', gap: 8 }}>
          {esdKpi.map((item, idx) => {
            const c = cBar(item.pct);
            const grade = item.pct >= 90 ? '달성' : item.pct >= 80 ? '주의' : '미달';
            const cc = item.change.startsWith('+') ? DG : item.change.startsWith('-') ? DR : pal.textMuted;
            return (
              <div key={item.label} style={{
                background: `${c}12`, border: `1.5px solid ${c}35`, borderRadius: 14,
                padding: '12px 14px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                overflow: 'hidden', minHeight: 0,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexShrink: 0 }}>
                  <span style={{ fontSize: 15, fontWeight: 800, color: pal.body, lineHeight: 1.25 }}>{item.label}</span>
                  <span style={{ display: 'inline-block', padding: '4px 12px', borderRadius: 999, fontSize: 14, fontWeight: 800, background: `${c}22`, color: c, lineHeight: 1.2, flexShrink: 0 }}>{grade}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 3, flexShrink: 0 }}>
                  <span style={{ fontSize: 44, fontWeight: 900, color: c, lineHeight: 1 }}>{item.pct}</span>
                  <span style={{ fontSize: 20, fontWeight: 700, color: c }}>%</span>
                </div>
                <div style={{ height: 20, background: `${c}20`, borderRadius: 999, overflow: 'hidden', flexShrink: 0 }}>
                  <div style={{ width: ready ? `${item.pct}%` : '0%', transition: `width 1s cubic-bezier(0.22,1,0.36,1) ${idx * 0.14}s`, height: '100%', background: `linear-gradient(90deg, ${c}99 0%, ${c} 100%)`, borderRadius: 999, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: 7 }}>
                    {item.pct >= 20 && <span style={{ fontSize: 11, fontWeight: 900, color: '#fff', lineHeight: 1 }}>{item.pct}%</span>}
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
                  <span style={{ display: 'inline-flex', alignItems: 'baseline', gap: 5, fontSize: 16, fontWeight: 700, color: pal.labelHeading, lineHeight: 1 }}>{item.period} <span style={{ fontSize: 20, fontWeight: 900, color: cc }}>{item.change}</span></span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── R1C3 : 현장 조직 활동 ───────────────────────────────────────── */}
      <div style={card}>
        <DSLabel label={ko ? '현장 조직 활동' : 'Field Activities'} />
        <div style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateRows: 'repeat(3, 1fr)', gap: 8 }}>
          {orgItems.map(item => {
            const c = cBar(item.pct);
            const filled = Math.round(item.pct / 10);
            return (
              <div key={item.title} style={{ background: `${c}12`, border: `1.5px solid ${c}35`, borderRadius: 12, padding: '8px 12px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 18, fontWeight: 700, color: pal.body }}>{item.title}</span>
                  <span style={{ fontSize: 36, fontWeight: 900, color: c, lineHeight: 1 }}>
                    {item.pct}<span style={{ fontSize: 20 }}>%</span>
                  </span>
                </div>
                <div style={{ display: 'flex', gap: 4 }}>
                  {Array.from({ length: 10 }, (_, i) => (
                    <motion.div key={i}
                      initial={{ opacity: 0, scaleY: 0.4 }}
                      animate={{ opacity: i < filled ? 0.35 + (i / 9) * 0.65 : 1, scaleY: 1 }}
                      transition={{ duration: 0.55, delay: i * 0.045, ease: [0.22,1,0.36,1] }}
                      style={{ flex: 1, height: 14, borderRadius: 4, background: i < filled ? c : pal.track, transformOrigin: 'bottom' }}
                    />
                  ))}
                </div>
                <div style={{ fontSize: 16, fontWeight: 700, color: DGR }}>{item.goal}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── R1C4 : 개선 제안 ─────────────────────────────────────────────── */}
      <div style={card}>
        <DSLabel label={ko ? '개선 제안' : 'Improvements'} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, flexShrink: 0 }}>
          {([
            { label: '참여율',  v: '68', c: cBar(68) },
            { label: '활성화율', v: '42', c: cBar(42) },
          ] as const).map(item => (
            <div key={item.label} style={{ background: `${item.c}12`, border: `1.5px solid ${item.c}35`, borderRadius: 12, padding: '8px 12px', textAlign: 'center' }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: pal.body }}>{item.label}</div>
              <div style={{ fontSize: 36, fontWeight: 900, color: item.c, lineHeight: 1.1 }}>
                {item.v}<span style={{ fontSize: 20 }}>%</span>
              </div>
            </div>
          ))}
        </div>
        <div style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', gap: 8, marginTop: 8 }}>
          {propRows.map(item => {
            const { line, area, xs, ys } = mkSpark(item.pts);
            return (
              <div key={item.l} style={{ ...sub18, padding: '0 12px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <div style={{ height: 58, flexShrink: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 18, fontWeight: 700, color: DGR, lineHeight: 1 }}>
                    {item.l} <span style={{ fontSize: 15 }}>{item.sub}</span>
                  </span>
                  <span style={{ fontSize: 36, fontWeight: 900, color: item.c, lineHeight: 1 }}>
                    {item.v}<span style={{ fontSize: 16, fontWeight: 600, marginLeft: 3 }}>{item.u}</span>
                  </span>
      </div>
                <div style={{ flex: 1, minHeight: 0 }}>
                  <svg width="100%" height="100%" viewBox="0 0 110 56" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id={`ds1spk-${item.l}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={item.c} stopOpacity="0.42" />
                        <stop offset="100%" stopColor={item.c} stopOpacity="0.02" />
                      </linearGradient>
                    </defs>
                    <path d={area} fill={`url(#ds1spk-${item.l})`} />
                    <path d={line} fill="none" stroke={item.c} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    {xs.map((x, i) => (
                      <g key={i}>
                        <text x={x} y={ys[i] - 5} textAnchor="middle" fontSize="9" fill={item.c} fontWeight="800">{item.pts[i]}</text>
                        <circle cx={x} cy={ys[i]} r="3" fill={item.c} />
                      </g>
                    ))}
                  </svg>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── R2C1 : 현장 관리 ─────────────────────────────────────────────── */}
      <div style={card}>
        {/* 헤더: 라벨 + 전월 기준 뱃지 — 생산 현황 카드와 동일 구조 */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8, flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 5, height: 22, borderRadius: 4, background: DR, flexShrink: 0 }} />
            <span style={{ fontSize: 22, fontWeight: 800, color: pal.labelHeading, letterSpacing: '0.03em' }}>
              {ko ? '현장 관리' : 'Floor Mgmt'}
            </span>
          </div>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: pal.badgeBg, border: `1px solid ${pal.borderSoft}`, borderRadius: 999, padding: '3px 10px', fontSize: 13, fontWeight: 600, color: pal.textMuted, letterSpacing: '0.02em' }}>
            <svg width="11" height="11" viewBox="0 0 12 12" fill="none" style={{ flexShrink: 0 }}>
              <circle cx="6" cy="6" r="5" stroke="#9CA3AF" strokeWidth="1.5" />
              <path d="M6 3.5V6.2L7.8 7.5" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            전월 기준
          </span>
        </div>
        {/* 수직 막대 차트 — 생산 현황과 동일한 구조 */}
        <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
          {/* 바 영역 */}
          <div style={{ flex: 1, minHeight: 0, display: 'flex', gap: 8, alignItems: 'flex-end' }}>
            {([
              { pct: 94 },
              { pct: 88 },
              { pct: 76 },
            ] as const).map((item, idx) => {
              const c = cBar(item.pct);
              return (
                <div key={idx} style={{ flex: 1, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 0 }}>
                  <div style={{ flex: 1, width: '78%', position: 'relative', display: 'flex', alignItems: 'flex-end' }}>
                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, top: 0, background: `${c}28`, borderRadius: 10 }} />
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${item.pct}%` }}
                      transition={{ duration: 1.1, delay: idx * 0.12 + 0.2, ease: [0.22, 1, 0.36, 1] }}
                      style={{ width: '100%', background: c, borderRadius: 10, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}
                    >
                      <span style={{ fontSize: 20, fontWeight: 900, color: '#fff', letterSpacing: '-0.01em', lineHeight: 1 }}>{item.pct}%</span>
                    </motion.div>
                  </div>
                </div>
              );
            })}
          </div>
          {/* X축 라벨 */}
          <div style={{ display: 'flex', gap: 10, flexShrink: 0, marginTop: 6 }}>
            {([
              ['5S', ''],
              ['3정', ''],
              [ko ? '눈으로' : 'Visual', ko ? '보는관리' : 'Mgmt'],
            ] as const).map((lines, idx) => (
              <div key={idx} style={{ flex: 1, textAlign: 'center', lineHeight: 1.25 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: pal.labelHeading }}>{lines[0]}</div>
                {lines[1] && <div style={{ fontSize: 14, fontWeight: 700, color: pal.labelHeading }}>{lines[1]}</div>}
              </div>
            ))}
          </div>
        </div>
        {/* 2×2 KPI 그리드 */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 8, flexShrink: 0 }}>
          {([
            { t1:'지적', t2:'사항', v:'3',  u:'건', c:DA },
            { t1:'시정', t2:'완료', v:'2',  u:'건', c:DG },
            { t1:'반복', t2:'지적', v:'1',  u:'건', c:DR },
            { t1:'개선율', t2:'',   v:'67', u:'%',  c:cBar(67) },
          ] as const).map(item => (
            <div key={`${item.t1}${item.t2}`} style={{ background: `${item.c}12`, border: `1.5px solid ${item.c}35`, borderRadius: 12, padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2, flexShrink: 0 }}>
                <span style={{ fontSize: 17, fontWeight: 700, color: pal.body }}>{item.t1}</span>
                {item.t2 ? <span style={{ fontSize: 17, fontWeight: 700, color: pal.body }}>{item.t2}</span> : null}
              </div>
              <div style={{ flex: 1, textAlign: 'right' }}>
                <span style={{ fontSize: 36, fontWeight: 900, color: item.c }}>{item.v}</span>
                <span style={{ fontSize: 15, fontWeight: 700, color: item.c, marginLeft: 3 }}>{item.u}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── R2C2~3 (colspan 2) : 교육 훈련 ─────────────────────────────── */}
      <div style={{ ...card, gridColumn: 'span 2' }}>
        <DSLabel label={ko ? '교육 훈련' : 'Training'} />
        <div style={{ flex: 1, minHeight: 0, display: 'flex', gap: 14 }}>
          {/* 좌: 진행률 바 3행 */}
          <div style={{ flex: 1, display: 'grid', gridTemplateRows: 'repeat(3, 1fr)', gap: 8 }}>
            {eduTracks.map(item => {
              const c = cBar(item.val);
              const filled = Math.round(item.val / 10);
              return (
                <div key={item.label} style={{ background: `${c}12`, border: `1.5px solid ${c}35`, borderRadius: 12, padding: '8px 12px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <span style={{ fontSize: 18, fontWeight: 700, color: pal.body }}>{item.label}</span>
                      {item.sub && <span style={{ fontSize: 16, fontWeight: 700, color: pal.labelHeading, marginLeft: 6 }}>{item.sub}</span>}
                    </div>
                    <span style={{ fontSize: 36, fontWeight: 900, color: c, lineHeight: 1 }}>
                      {item.val}<span style={{ fontSize: 20 }}>%</span>
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: 4 }}>
                    {Array.from({ length: 10 }, (_, i) => (
                      <motion.div key={i}
                        initial={{ opacity: 0, scaleY: 0.3 }}
                        animate={{ opacity: i < filled ? 0.35 + (i / 9) * 0.65 : 1, scaleY: 1 }}
                        transition={{ duration: 0.5, delay: i * 0.04, ease: [0.22,1,0.36,1] }}
                        style={{ flex: 1, height: 14, borderRadius: 4, background: i < filled ? c : pal.track, transformOrigin: 'bottom' }}
                      />
                    ))}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 15, fontWeight: 700, color: DGR }}>목표 {item.target}</span>
                    <span style={{ fontSize: 15, fontWeight: 700, color: DGR }}>전기 {item.prev}</span>
                  </div>
                </div>
              );
            })}
          </div>
          {/* 우: 수료 현황 4개 박스 */}
          <div style={{ flex: '0 0 220px', display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', gap: 8 }}>
            {eduStat.map(item => {
              const filled = Math.round(item.pct / 10);
              return (
                <div key={item.l} style={{ ...sub18, padding: '8px 10px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, overflow: 'hidden' }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: DGR, flexShrink: 0, lineHeight: 1 }}>{item.l}</div>
                  <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column-reverse', gap: 5, width: '55%' }}>
                    {Array.from({ length: 10 }, (_, i) => (
                      <motion.div key={i}
                        initial={{ opacity: 0, scaleX: 0.3 }}
                        animate={{ opacity: i < filled ? 0.35 + (i / 9) * 0.65 : 1, scaleX: 1 }}
                        transition={{ duration: 0.5, delay: i * 0.04, ease: [0.22,1,0.36,1] }}
                        style={{ flex: 1, borderRadius: 4, background: i < filled ? item.c : pal.track, transformOrigin: 'left' }}
                      />
                    ))}
                  </div>
                  <div style={{ fontSize: 22, fontWeight: 900, color: item.c, lineHeight: 1, flexShrink: 0 }}>{item.v}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── R2C4 : 종합 요약 ─────────────────────────────────────────────── */}
      <div style={card}>
        <DSLabel label={ko ? '종합 요약' : 'Summary'} />
        <div style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: 'repeat(3, minmax(0, 1fr))', gap: 8 }}>
          {summaryItems.map((item, idx) => {
            const c = cBar(item.n);
            const grade = item.n >= 90 ? '달성' : item.n >= 80 ? '주의' : '미달';
            return (
              <div key={item.l} style={{
                background: `${c}12`, border: `1.5px solid ${c}35`, borderRadius: 14,
                padding: '12px 14px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                overflow: 'hidden', minHeight: 0,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexShrink: 0 }}>
                  <span style={{ fontSize: 15, fontWeight: 800, color: pal.body, lineHeight: 1.25 }}>{item.l}</span>
                  <span style={{ display: 'inline-block', padding: '4px 12px', borderRadius: 999, fontSize: 14, fontWeight: 800, background: `${c}22`, color: c, lineHeight: 1.2, flexShrink: 0 }}>{grade}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 3, flexShrink: 0 }}>
                  <span style={{ fontSize: 44, fontWeight: 900, color: c, lineHeight: 1 }}>{item.n}</span>
                  <span style={{ fontSize: 20, fontWeight: 700, color: c }}>%</span>
                </div>
                <div style={{ height: 20, background: `${c}20`, borderRadius: 999, overflow: 'hidden', flexShrink: 0 }}>
                  <div style={{ width: ready ? `${item.n}%` : '0%', transition: `width 1s cubic-bezier(0.22,1,0.36,1) ${idx * 0.14}s`, height: '100%', background: `linear-gradient(90deg, ${c}99 0%, ${c} 100%)`, borderRadius: 999, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: 7 }}>
                    {item.n >= 20 && <span style={{ fontSize: 11, fontWeight: 900, color: '#fff', lineHeight: 1 }}>{item.n}%</span>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}

/** ESD 스타일 KPI 카드 — 모듈 레벨 정의로 재마운트 방지 */
function EsdCard({ label, pct, change, idx, ready }: { label: string; pct: number; change: string; idx: number; ready?: boolean }) {
  const pal = useDashPalette();
  const c = cBar(pct);
  const grade = pct >= 90 ? '달성' : pct >= 80 ? '주의' : '미달';
  const cc = change.startsWith('+') ? DG : change.startsWith('-') ? DR : pal.tickLabel;
  const isReady = ready !== false;
  return (
    <div style={{ background: `${c}12`, border: `1.5px solid ${c}35`, borderRadius: 14, padding: '12px 14px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minWidth: 0, minHeight: 0, overflow: 'hidden' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexShrink: 0 }}>
        <span style={{ fontSize: 15, fontWeight: 800, color: pal.body, lineHeight: 1.25 }}>{label}</span>
        <span style={{ display: 'inline-block', padding: '4px 12px', borderRadius: 999, fontSize: 14, fontWeight: 800, background: `${c}22`, color: c, lineHeight: 1.2, flexShrink: 0 }}>{grade}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 2, flexShrink: 0 }}>
        <span style={{ fontSize: 32, fontWeight: 900, color: c, lineHeight: 1 }}>{pct}</span>
        <span style={{ fontSize: 16, fontWeight: 700, color: c }}>%</span>
      </div>
      <div style={{ height: 20, background: `${c}20`, borderRadius: 999, overflow: 'hidden', flexShrink: 0 }}>
        <div style={{
          width: isReady ? `${pct}%` : '0%',
          transition: `width 1s cubic-bezier(0.22,1,0.36,1) ${idx * 0.12}s`,
          height: '100%', background: `linear-gradient(90deg, ${c}99 0%, ${c} 100%)`, borderRadius: 999, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: 7,
        }}>
          {pct >= 20 && <span style={{ fontSize: 11, fontWeight: 900, color: '#fff', lineHeight: 1 }}>{pct}%</span>}
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
        <span style={{ display: 'inline-flex', alignItems: 'baseline', gap: 4, fontSize: 13, fontWeight: 700, color: pal.labelHeading, lineHeight: 1 }}>전월 <span style={{ fontSize: 15, fontWeight: 900, color: cc }}>{change}</span></span>
      </div>
    </div>
  );
}

// Screen 2 — 시스템 현황 B
function DashScreen2({ ko }: { ko: boolean }) {
  const [ready, setReady] = useState(false);
  useEffect(() => { const t = setTimeout(() => setReady(true), 250); return () => clearTimeout(t); }, []);
  const pal = useDashPalette();
  const card: React.CSSProperties = {
    background: pal.cardBg, boxShadow: pal.cardShadow, borderRadius: DC_R,
    padding: '14px 18px', display: 'flex', flexDirection: 'column',
    overflow: 'hidden', minHeight: 0,
  };
  const sub14: React.CSSProperties = { background: pal.subBg, borderRadius: 14 };

  /** 반원 게이지 헬퍼 — 함수 호출로 사용해 재마운트 방지 */
  const bulletChart2 = (pct: number, value: string, label: string, period: string, idx: number, avg?: number, target?: number, est?: number, compact?: boolean) => {
    const tgtV = target ?? Math.min(pct + 18, 100);
    const grade = pct >= tgtV ? '초과달성' : pct >= tgtV * 0.8 ? '주의' : '미달';
    const gc = pct >= tgtV ? DG : pct >= tgtV * 0.8 ? DA : DR;
    const c = gc;
    const tgt = tgtV;
    const avgV = avg ?? Math.round(pct * 0.85);
    const estV = est ?? Math.min(pct + 25, 100);
    const maxV = Math.max(tgt, estV, pct, 100);
    const ticks = [0, Math.round(maxV * 0.25), Math.round(maxV * 0.5), Math.round(maxV * 0.75), maxV];
    return (
      <div style={{ ...(compact ? { flexShrink:0, marginBottom:6 } : { flex:1, minHeight:0 }), background:`${gc}12`, border:`1.5px solid ${gc}35`, borderRadius:14, padding: compact ? '8px 14px' : '12px 16px', display:'flex', flexDirection:'column', gap: compact ? 4 : 6, justifyContent:'center' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexShrink:0 }}>
          <span style={{ fontSize: compact ? 14 : 18, fontWeight:800, color: pal.body, whiteSpace:'pre-line', lineHeight:1.3 }}>{label}</span>
          <span style={{ display:'inline-block', padding: compact ? '3px 8px' : '4px 10px', borderRadius:999, fontSize: compact ? 12 : 13, fontWeight:800, background:`${gc}22`, color:gc, lineHeight:1 }}>{grade}</span>
        </div>
        <div style={{ display:'flex', alignItems:'baseline', gap:4, flexShrink:0 }}>
          <span style={{ fontSize: compact ? 28 : 36, fontWeight:900, color:c, lineHeight:1 }}>{value}</span>
        </div>
        <div style={{ position:'relative', height: compact ? 38 : 48, flexShrink:0 }}>
          {/* Target balloon */}
          <div style={{ position:'absolute', top:0, left:`${(tgt / maxV) * 100}%`, transform:'translateX(-50%)', display:'flex', flexDirection:'column', alignItems:'center' }}>
            <span style={{ fontSize: compact ? 9 : 11, fontWeight:800, color: pal.chartTargetTooltipFg, background: pal.chartTargetTooltipBg, padding: compact ? '2px 5px' : '2px 7px', borderRadius:4, lineHeight:1.2, whiteSpace:'nowrap' }}>{tgt}%</span>
            <span style={{ width:0, height:0, borderLeft: '4px solid transparent', borderRight: '4px solid transparent', borderTop: `4px solid ${pal.chartTargetTooltipBg}` }} />
          </div>
          {/* Full range background track */}
          <div style={{ position:'absolute', bottom: compact ? 0 : 0, left:0, width:'100%', height: compact ? 18 : 24, background:`${c}15`, borderRadius: compact ? 5 : 6 }} />
          {/* Average range */}
          <div style={{ position:'absolute', bottom:0, left:0, width:`${(avgV / maxV) * 100}%`, height: compact ? 18 : 24, background: pal.chartAvgBand, borderRadius: compact ? 5 : 6 }} />
          {/* Estimated / prognosis */}
          <div style={{ position:'absolute', bottom: compact ? 2 : 2, left:`${(pct / maxV) * 100}%`, width:`${((estV - pct) / maxV) * 100}%`, height: compact ? 14 : 20, background:`${c}30`, borderRadius: compact ? '0 5px 5px 0' : '0 6px 6px 0' }} />
          {/* Current value bar */}
          <div style={{
            position:'absolute', bottom: compact ? 3 : 4, left:0, height: compact ? 12 : 16, borderRadius: compact ? 4 : 5,
            width: ready ? `${(pct / maxV) * 100}%` : '0%',
            transition: `width 1s cubic-bezier(0.22,1,0.36,1) ${idx * 0.15}s`,
            background:`linear-gradient(90deg, ${c}cc 0%, ${c} 100%)`,
          }} />
          {/* Target marker line */}
          <div style={{ position:'absolute', bottom:0, left:`${(tgt / maxV) * 100}%`, width: compact ? 3 : 4, height: compact ? 18 : 24, background: pal.chartTargetInk, borderRadius:2, transform:'translateX(-50%)' }} />
        </div>
        {/* Scale ticks */}
        <div style={{ display:'flex', justifyContent:'space-between', flexShrink:0, padding:'0 1px' }}>
          {ticks.map((t, i) => (
            <span key={i} style={{ fontSize:10, fontWeight:600, color: pal.tickLabel, lineHeight:1 }}>{t}</span>
          ))}
        </div>
        {/* Legend */}
        <div style={{ display:'flex', gap: compact ? 8 : 12, flexWrap:'wrap', flexShrink:0 }}>
          {[
            { color:c, lbl: ko ? '당월' : 'This' },
            { color:`${c}30`, lbl: ko ? '예상' : 'Est' },
            { color: pal.chartAvgBand, lbl: ko ? '평균' : 'Avg' },
            { color: pal.chartTargetInk, lbl: ko ? '목표' : 'Tgt' },
          ].map((it, i) => (
            <div key={i} style={{ display:'flex', alignItems:'center', gap: compact ? 3 : 5 }}>
              <span style={{ width: compact ? 7 : 10, height: compact ? 7 : 10, borderRadius:'50%', background:it.color, flexShrink:0, border: '1px solid rgba(0,0,0,0.08)' }} />
              <span style={{ fontSize: compact ? 10 : 12, fontWeight:700, color: pal.labelHeading }}>{it.lbl}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  /* 물류 서브 KPI — 스파크라인 */
  const logSpark2 = [
    { l:'Feeder\n업무 효율', id:'ds2fa', v:'85', u:'%', c:cBar(85), pts:[72, 76, 80, 85] },
    { l:'제조\n리드타임',    id:'ds2lt', v:'91', u:'%', c:cBar(91), pts:[86, 88, 90, 91] },
    { l:'물류\n달성율',      id:'ds2la', v:'88', u:'%', c:cBar(88), pts:[83, 85, 87, 88] },
    { l:'차량\n체류율',      id:'ds2cv', v:'3.2', u:'%', c:DG,      pts:[5.1, 4.3, 4.0, 3.2] },
  ];

  return (
    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr 1fr', gridTemplateRows:'minmax(0,1fr) minmax(0,1fr)', gap:16, height:'100%', minHeight:0, overflow:'hidden' }}>

      {/* ── R1C1 : 품질 종합 KPI ── */}
      <div style={card}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:8, flexShrink:0 }}>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <span style={{ width:5, height:22, borderRadius:4, background:DR, flexShrink:0 }} />
            <span style={{ fontSize:22, fontWeight:800, color: pal.labelHeading, letterSpacing:'0.03em' }}>품질 종합 KPI</span>
          </div>
          <span style={{ display:'inline-flex', background:`${DR}12`, border:`1px solid ${DR}40`, borderRadius:999, padding:'4px 11px', fontSize:13, fontWeight:700, color:DR, lineHeight:1 }}>
            전월 기준
          </span>
        </div>
        <div style={{ flex:1, minHeight:0, display:'flex', flexDirection:'column' }}>
          <div style={{ flex:1, minHeight:0, display:'flex', gap:8, alignItems:'flex-end' }}>
            {([
              { pct:100, label:'115%', c:DG           },
              { pct:8,   label:'8%',   c:'#9CA3AF'    },
              { pct:93,  label:'93.2%', c:cBar(93)     },
            ] as const).map((item, idx) => (
              <div key={idx} style={{ flex:1, height:'100%', display:'flex', flexDirection:'column', alignItems:'center', minWidth:0 }}>
                <div style={{ flex:1, width:'78%', position:'relative', display:'flex', alignItems:'flex-end' }}>
                  <div style={{ position:'absolute', bottom:0, left:0, right:0, top:0, background:`${item.c}28`, borderRadius:10 }} />
                  <div style={{ position:'absolute', bottom:0, left:0, right:0, top:0, display:'flex', alignItems:'center', justifyContent:'center', zIndex:1, pointerEvents:'none' }}>
                    <span style={{ fontSize:18, fontWeight:900, color: item.pct >= 50 ? '#fff' : item.c, lineHeight:1 }}>{item.label}</span>
                  </div>
                  <motion.div
                    initial={{ height:0 }} animate={{ height:`${Math.max(item.pct, 6)}%` }}
                    transition={{ duration:1.1, delay:idx*0.12+0.2, ease:[0.22,1,0.36,1] }}
                    style={{ width:'100%', background:item.c, borderRadius:10, position:'relative', minHeight:4 }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div style={{ display:'flex', gap:8, flexShrink:0, marginTop:6 }}>
            {(['총합공정\n달성률', '자주/순차\n검출률', 'Line\nAudit'] as const).map((l, idx) => (
              <div key={idx} style={{ flex:1, textAlign:'center', lineHeight:1.25 }}>
                {l.split('\n').map((t, i) => (
                  <div key={i} style={{ fontSize:13, fontWeight:700, color: pal.labelHeading }}>{t}</div>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginTop:8, flexShrink:0 }}>
          {([
            { name:'총합공정\n달성률',  goalText:'목표 ≥100%',    actual:'115%',   grade:'초과달성', c:DG       },
            { name:'자주/순차\n검출률', goalText:'라인당 ≥1건/월', actual:'8%',     grade:'주의',     c:DA       },
            { name:'Part\nReturn',     goalText:'반품률 ≤0%',      actual:'0건',    grade:'무반품',   c:DG       },
            { name:'Line\nAudit',      goalText:'목표 ≥90점',      actual:'93.2점', grade:'달성',     c:cBar(93) },
          ] as const).map(item => (
            <div key={item.name} style={{
              background:`${item.c}12`,
              border:`1.5px solid ${item.c}35`,
              borderRadius:12,
              padding:'8px 12px',
              display:'flex', flexDirection:'column', gap:4,
            }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
                <span style={{ fontSize:13, fontWeight:800, color: pal.body, whiteSpace:'pre-line', lineHeight:1.25 }}>{item.name}</span>
                <span style={{ fontSize:22, fontWeight:900, color:item.c, lineHeight:1, flexShrink:0 }}>{item.actual}</span>
              </div>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <span style={{ fontSize:11, fontWeight:700, color: pal.labelHeading }}>{item.goalText}</span>
                <span style={{ display:'inline-block', padding:'2px 8px', borderRadius:999, fontSize:11, fontWeight:900, background:`${item.c}30`, color:item.c, lineHeight:1, flexShrink:0 }}>
                  {item.grade}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── R1C2 : 검사/공정 관리 ── */}
      <div style={card}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10, flexShrink:0 }}>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <span style={{ width:5, height:22, borderRadius:4, background:DR, flexShrink:0 }} />
            <span style={{ fontSize:22, fontWeight:800, color: pal.labelHeading, letterSpacing:'0.03em' }}>검사/공정 관리</span>
          </div>
          <span style={{ display:'inline-flex', background:`${DR}12`, border:`1px solid ${DR}40`, borderRadius:999, padding:'4px 11px', fontSize:13, fontWeight:700, color:DR, lineHeight:1 }}>
            전월 기준
          </span>
        </div>
        <div style={{ flex:1, minHeight:0, display:'grid', gridTemplateColumns:'1fr 1fr', gridTemplateRows:'1fr 1fr', gap:8 }}>
          {([
            { name:'Time/Spec\nCheck', goalText:'분기 ≥1건/라인', actual:'2건',    barPct:100, rate:100, grade:'달성',  c:DG        },
            { name:'주요공정\n관리',    goalText:'Worst 월 ≥1건',  actual:'43건',   barPct:86,  rate:86,  grade:'주의',  c:DA        },
            { name:'Part\nReturn',     goalText:'반품률 ≤0%',      actual:'0건',    barPct:100, rate:100, grade:'무반품', c:DG        },
            { name:'Line\nAudit',      goalText:'목표 ≥90점',      actual:'93.2점', barPct:93,  rate:93,  grade:'달성',  c:cBar(93)  },
          ] as const).map((item, idx) => (
            <div key={item.name} style={{
              background:`${item.c}12`,
              border:`1.5px solid ${item.c}35`,
              borderRadius:14,
              padding:'12px 14px',
              display:'flex', flexDirection:'column', justifyContent:'space-between',
              overflow:'hidden', minHeight:0,
            }}>
              {/* ① 상단: KPI명 + 상태 배지 */}
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexShrink:0 }}>
                <div style={{ display:'flex', flexDirection:'column', gap:2 }}>
                  <span style={{ fontSize:15, fontWeight:800, color: pal.body, whiteSpace:'pre-line', lineHeight:1.25 }}>{item.name}</span>
                  <span style={{ fontSize:12, fontWeight:700, color: pal.labelHeading }}>{item.goalText}</span>
                </div>
                <span style={{ display:'inline-block', padding:'3px 9px', borderRadius:999, fontSize:12, fontWeight:800, background:`${item.c}25`, color:item.c, lineHeight:1, flexShrink:0 }}>
                  {item.grade}
                </span>
              </div>
              {/* ② 중앙: 달성률 대형 숫자 */}
              <div style={{ display:'flex', alignItems:'baseline', gap:3, flexShrink:0 }}>
                <span style={{ fontSize:44, fontWeight:900, color:item.c, lineHeight:1 }}>{item.rate}</span>
                <span style={{ fontSize:20, fontWeight:700, color:item.c }}>%</span>
              </div>
              {/* ③ 하단: 바 + 실적 */}
              <div style={{ display:'flex', flexDirection:'column', gap:5, flexShrink:0 }}>
                <div style={{ height:14, background:`${item.c}20`, borderRadius:999, overflow:'hidden' }}>
                  <motion.div
                    initial={{ width:0 }}
                    animate={{ width:`${item.barPct}%` }}
                    transition={{ duration:1.25, delay:idx * 0.14, ease:[0.22,1,0.36,1] }}
                    style={{
                      height:'100%',
                      background:`linear-gradient(90deg, ${item.c}99 0%, ${item.c} 100%)`,
                      borderRadius:999,
                      display:'flex', alignItems:'center', justifyContent:'flex-end', paddingRight:6,
                    }}
                  >
                    {item.barPct >= 25 && (
                      <span style={{ fontSize:10, fontWeight:900, color:'#fff', lineHeight:1 }}>{item.barPct}%</span>
                    )}
                  </motion.div>
                </div>
                <div style={{ display:'flex', alignItems:'baseline', gap:4 }}>
                  <span style={{ fontSize:13, fontWeight:700, color: pal.labelHeading }}>실적</span>
                  <span style={{ fontSize:17, fontWeight:900, color:item.c, lineHeight:1 }}>{item.actual}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── R1C3 : 생산/라인 KPI ── */}
      <div style={card}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10, flexShrink:0 }}>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <span style={{ width:5, height:22, borderRadius:4, background:DR, flexShrink:0 }} />
            <span style={{ fontSize:22, fontWeight:800, color: pal.labelHeading, letterSpacing:'0.03em' }}>{ko ? '생산/라인 KPI' : 'Production KPI'}</span>
          </div>
          <span style={{ display:'inline-flex', background:`${DR}12`, border:`1px solid ${DR}40`, borderRadius:999, padding:'4px 11px', fontSize:13, fontWeight:700, color:DR, lineHeight:1 }}>
            누적 기준
          </span>
        </div>
        <div style={{ flex:1, minHeight:0, display:'flex', flexDirection:'column', gap:8 }}>
          {([
            { name:'CAC01',    unit:'건', goal:'142건', actual:'125건', goalN:142, actualN:125, rate:88,  isLower:false },
            { name:'UPPH',     unit:'',   goal:'118',   actual:'112',   goalN:118, actualN:112, rate:95,  isLower:false },
            { name:'ST 반납률', unit:'%',  goal:'≤5.0%', actual:'3.2%',  goalN:5,   actualN:3.2, rate:100, isLower:true  },
          ] as const).map((item, idx) => {
            const barPct = item.isLower
              ? (item.actualN <= item.goalN ? 100 : Math.round((item.goalN / item.actualN) * 100))
              : Math.min(Math.round((item.actualN / item.goalN) * 100), 100);
            const c     = item.rate >= 90 ? DG : item.rate >= 80 ? DA : DR;
            const grade = item.isLower ? '달성' : (item.rate >= 90 ? '달성' : item.rate >= 80 ? '주의' : '미달');
            return (
              <div key={item.name} style={{
                flex:1, minHeight:0,
                background:`${c}12`,
                border:`1.5px solid ${c}35`,
                borderRadius:14,
                padding:'10px 16px',
                display:'flex', flexDirection:'column', justifyContent:'space-between',
                overflow:'hidden',
              }}>
                {/* ① 상단: KPI명 + 목표 (2줄) / 달성률 대형 숫자 */}
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexShrink:0 }}>
                  <div style={{ display:'flex', alignItems:'baseline', gap:6 }}>
                    <span style={{ fontSize:20, fontWeight:800, color: pal.body }}>{item.name}</span>
                    <span style={{ fontSize:14, fontWeight:700, color: pal.labelHeading }}>목표 {item.goal}</span>
                  </div>
                  <div style={{ display:'flex', alignItems:'baseline', gap:3, flexShrink:0 }}>
                    <span style={{ fontSize:42, fontWeight:900, color:c, lineHeight:1 }}>
                      {item.rate}
                    </span>
                    <span style={{ fontSize:20, fontWeight:700, color:c }}>%</span>
                  </div>
                </div>
                {/* ② 중단: 두꺼운 그라디언트 바 */}
                <div style={{ height:22, background:`${c}20`, borderRadius:999, overflow:'hidden', position:'relative', flexShrink:0 }}>
                  <motion.div
                    initial={{ width:0 }}
                    animate={{ width:`${barPct}%` }}
                    transition={{ duration:1.25, delay:idx * 0.16, ease:[0.22,1,0.36,1] }}
                    style={{
                      height:'100%',
                      background:`linear-gradient(90deg, ${c}99 0%, ${c} 100%)`,
                      borderRadius:999,
                      display:'flex', alignItems:'center', justifyContent:'flex-end', paddingRight:10,
                    }}
                  >
                    {barPct >= 18 && (
                      <span style={{ fontSize:12, fontWeight:900, color:'#fff', lineHeight:1 }}>{barPct}%</span>
                    )}
                  </motion.div>
                </div>
                {/* ③ 하단: 실적값 + 상태 배지 */}
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', flexShrink:0 }}>
                  <div style={{ display:'flex', alignItems:'baseline', gap:5 }}>
                    <span style={{ fontSize:15, fontWeight:700, color: pal.labelHeading }}>실적</span>
                    <span style={{ fontSize:22, fontWeight:900, color:c, lineHeight:1 }}>{item.actual}</span>
                  </div>
                  <span style={{ display:'inline-block', padding:'4px 12px', borderRadius:999, fontSize:13, fontWeight:800, background:`${c}25`, color:c, lineHeight:1 }}>
                    {grade}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── R1C4 : 공정 운영 KPI ── */}
      <div style={card}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10, flexShrink:0 }}>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <span style={{ width:5, height:22, borderRadius:4, background:DR, flexShrink:0 }} />
            <span style={{ fontSize:22, fontWeight:800, color: pal.labelHeading, letterSpacing:'0.03em' }}>공정 운영 KPI</span>
          </div>
          <span style={{ display:'inline-flex', background:`${DR}12`, border:`1px solid ${DR}40`, borderRadius:999, padding:'4px 11px', fontSize:13, fontWeight:700, color:DR, lineHeight:1 }}>
            전분기 기준
          </span>
        </div>
        <div style={{ flex:1, minHeight:0, display:'flex', flexDirection:'column', gap:8 }}>
          {bulletChart2(67, '67%', 'Foolproof\n달성률',   '전분기', 0, 55, 85, 82)}
          {bulletChart2(38, '38%', 'Line 당 Lv3↑\n비중', '전분기', 1, 30, 50, 55)}
        </div>
      </div>

      {/* ── R2C1 : 설비 유지보수 KPI ── */}
      <div style={card}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10, flexShrink:0 }}>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <span style={{ width:5, height:22, borderRadius:4, background:DR, flexShrink:0 }} />
            <span style={{ fontSize:22, fontWeight:800, color: pal.labelHeading, letterSpacing:'0.03em' }}>설비 유지보수 KPI</span>
          </div>
          <span style={{ display:'inline-flex', background:`${DR}12`, border:`1px solid ${DR}40`, borderRadius:999, padding:'4px 11px', fontSize:13, fontWeight:700, color:DR, lineHeight:1 }}>
            전월 기준
          </span>
        </div>
        <div style={{ flex:1, minHeight:0, display:'grid', gridTemplateColumns:'1fr 1fr', gridTemplateRows:'repeat(3, minmax(0,1fr))', gap:8 }}>
          {([
            { label:'일일 설비\n점검 달성율', v:'87',  u:'%',  pct:87,  c:DA, tag:'주의'    },
            { label:'설비\n무작업률',         v:'2.3', u:'%',  pct:100, c:DG, tag:'정상'    },
            { label:'MTTR',                   v:'1.8', u:'h',  pct:90,  c:DG, tag:'목표이내' },
            { label:'MTBF',                   v:'312', u:'h',  pct:100, c:DG, tag:'정상'    },
            { label:'Spare part\n달성율',     v:'74',  u:'%',  pct:74,  c:DA, tag:'주의'    },
            { label:'TPM 활동\n건수',          v:'12',  u:'건', pct:100, c:DG, tag:'정상'    },
          ] as const).map((item, idx) => (
            <div key={item.label} style={{ background:`${item.c}12`, border:`1.5px solid ${item.c}35`, borderRadius:14, padding:'10px 12px', display:'flex', flexDirection:'column', justifyContent:'space-between', minHeight:0, overflow:'hidden' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexShrink:0 }}>
                <span style={{ fontSize:13, fontWeight:800, color: pal.body, lineHeight:1.4, whiteSpace:'pre-line' }}>{item.label}</span>
                <span style={{ display:'inline-block', padding:'3px 8px', borderRadius:999, fontSize:12, fontWeight:800, background:`${item.c}25`, color:item.c, lineHeight:1, flexShrink:0 }}>{item.tag}</span>
              </div>
              <span style={{ fontSize:26, fontWeight:900, color:item.c, lineHeight:1, flexShrink:0 }}>
                {item.v}<span style={{ fontSize:12, fontWeight:700 }}>{item.u}</span>
              </span>
              <div style={{ height:16, background:`${item.c}20`, borderRadius:999, overflow:'hidden', flexShrink:0 }}>
                <div style={{ width: ready ? `${item.pct}%` : '0%', transition: `width 1s cubic-bezier(0.22,1,0.36,1) ${idx*0.06}s`, height:'100%', background:`linear-gradient(90deg, ${item.c}99 0%, ${item.c} 100%)`, borderRadius:999, display:'flex', alignItems:'center', justifyContent:'flex-end', paddingRight:6 }}>
                  {item.pct >= 20 && <span style={{ fontSize:10, fontWeight:900, color:'#fff', lineHeight:1 }}>{item.pct}%</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── R2C2~3 (colspan 2) : 물류 KPI ── */}
      <div style={{ ...card, gridColumn:'span 2' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10, flexShrink:0 }}>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <span style={{ width:5, height:22, borderRadius:4, background:DR, flexShrink:0 }} />
            <span style={{ fontSize:22, fontWeight:800, color: pal.labelHeading, letterSpacing:'0.03em' }}>물류 KPI</span>
          </div>
          <span style={{ display:'inline-flex', background:`${DR}12`, border:`1px solid ${DR}40`, borderRadius:999, padding:'4px 11px', fontSize:13, fontWeight:700, color:DR, lineHeight:1 }}>
            전월 기준
          </span>
        </div>
        <div style={{ flex:1, minHeight:0, display:'flex', gap:14 }}>
          {/* 좌: 세그먼트 바 3행 */}
          <div style={{ flex:1, display:'grid', gridTemplateRows:'repeat(3, 1fr)', gap:8 }}>
            {([
              { label:'차량 체류율',        sub:'30분↑ 기준', val:3.2, goalVal:5,   target:'목표 5%↓',  prev:'4.8%', c:DG,       okBadge:'✓ 달성', isLower:true  },
              { label:'Depot 관리',         sub:'전월',        val:92,  goalVal:100, target:'목표 100%',  prev:'86%',  c:DA,       okBadge:'주의',    isLower:false },
              { label:'Re-handling\n개선율', sub:'전월',       val:28,  goalVal:30,  target:'목표 30%↑',  prev:'18%',  c:cBar(28), okBadge:'미달',    isLower:false },
            ] as const).map((item) => {
              const filled = item.isLower
                ? Math.round(Math.min(item.goalVal / item.val, 1) * 10)
                : Math.round(Math.min(item.val, 100) / 10);
              return (
                <div key={item.label} style={{ background:`${item.c}12`, border:`1.5px solid ${item.c}35`, borderRadius:14, padding:'8px 12px', display:'flex', flexDirection:'column', justifyContent:'space-between' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
                    <div>
                      <span style={{ fontSize:17, fontWeight:800, color: pal.body, whiteSpace:'pre-line', lineHeight:1.2 }}>{item.label}</span>
                      <span style={{ fontSize:13, fontWeight:700, color: pal.labelHeading, marginLeft:6 }}>{item.sub}</span>
                    </div>
                    <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:3 }}>
                      <span style={{ fontSize:32, fontWeight:900, color:item.c, lineHeight:1 }}>{item.val}<span style={{ fontSize:16 }}>%</span></span>
                      {item.okBadge && <span style={{ display:'inline-block', padding:'3px 9px', borderRadius:999, fontSize:13, fontWeight:800, background:`${item.c}25`, color:item.c, lineHeight:1 }}>{item.okBadge}</span>}
                    </div>
                  </div>
                  <div style={{ display:'flex', gap:4 }}>
                    {Array.from({ length:10 }, (_, i) => (
                      <motion.div key={i}
                        initial={{ opacity:0, scaleY:0.3 }}
                        animate={{ opacity: i<filled ? 0.35+(i/9)*0.65 : 1, scaleY:1 }}
                        transition={{ duration:0.5, delay:i*0.04, ease:[0.22,1,0.36,1] }}
                        style={{ flex:1, height:14, borderRadius:4, background: i<filled ? item.c : pal.track, transformOrigin:'bottom' }}
                      />
                    ))}
                  </div>
                  <div style={{ display:'flex', justifyContent:'space-between' }}>
                    <span style={{ fontSize:13, fontWeight:700, color: pal.labelHeading }}>{item.target}</span>
                    <span style={{ fontSize:13, fontWeight:700, color: pal.labelHeading }}>전기 {item.prev}</span>
                  </div>
                </div>
              );
            })}
          </div>
          {/* 우: 스파크라인 2×2 */}
          <div style={{ flex:1, display:'grid', gridTemplateColumns:'1fr 1fr', gridTemplateRows:'1fr 1fr', gap:8 }}>
            {logSpark2.map(item => {
              const { line, area, xs, ys } = mkSpark(item.pts, 110, 56, 16, 8, 15);
              return (
                <div key={item.l} style={{ background:`${item.c}12`, border:`1.5px solid ${item.c}35`, borderRadius:14, padding:'0 10px', display:'flex', flexDirection:'column', overflow:'hidden' }}>
                  <div style={{ flexShrink:0, display:'flex', justifyContent:'space-between', alignItems:'center', paddingTop:8, paddingBottom:2 }}>
                    <span style={{ fontSize:13, fontWeight:800, color: pal.body, lineHeight:1.25, whiteSpace:'pre-line' }}>{item.l}</span>
                    <span style={{ fontSize:24, fontWeight:900, color:item.c, lineHeight:1 }}>
                      {item.v}<span style={{ fontSize:12, fontWeight:700, marginLeft:2 }}>{item.u}</span>
                    </span>
                  </div>
                  <div style={{ flex:'1 1 0', minHeight:0 }}>
                    <svg width="100%" height="100%" viewBox="0 0 110 56" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id={`ds2lg-${item.id}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={item.c} stopOpacity="0.38"/>
                          <stop offset="100%" stopColor={item.c} stopOpacity="0.02"/>
                        </linearGradient>
                      </defs>
                      <path d={area} fill={`url(#ds2lg-${item.id})`}/>
                      <path d={line} fill="none" stroke={item.c} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                      {xs.map((x, i) => (
                        <g key={i}>
                          <text x={x} y={ys[i] - 5} textAnchor="middle" fontSize="9" fill={item.c} fontWeight="800">{item.pts[i]}</text>
                          <circle cx={x} cy={ys[i]} r="3" fill={item.c}/>
                        </g>
                      ))}
                    </svg>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── R2C4 : 설비 종합 KPI ── */}
      <div style={card}>
        {/* 헤더 */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10, flexShrink:0 }}>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <span style={{ width:5, height:22, borderRadius:4, background:DR, flexShrink:0 }} />
            <span style={{ fontSize:22, fontWeight:800, color: pal.labelHeading, letterSpacing:'0.03em' }}>설비 종합 KPI</span>
          </div>
          <span style={{ display:'inline-flex', background:`${DR}12`, border:`1px solid ${DR}40`, borderRadius:999, padding:'4px 11px', fontSize:13, fontWeight:700, color:DR, lineHeight:1 }}>
            전월 기준
          </span>
        </div>
        {/* 종합 달성률 Bullet Chart */}
        {bulletChart2(91, '91%', '종합 달성률', '전분기', 0, 75, 90, 95, true)}
        {/* 개별 KPI 2×2 */}
        <div style={{ flex:1, minHeight:0, display:'grid', gridTemplateColumns:'1fr 1fr', gridTemplateRows:'1fr 1fr', gap:8 }}>
          {([
            { l:'설비종합효율\n(OEE)',  n:78  },
            { l:'재고일수\n달성률',     n:94  },
            { l:'Overhaul\n준수율',    n:100 },
            { l:'시간가동율\n달성율',   n:91  },
          ] as const).map((item, idx) => {
            const c = cBar(item.n);
            const grade = item.n >= 93 ? '달성' : item.n >= 76 ? '주의' : '미달';
            return (
              <div key={item.l} style={{ background:`${c}12`, border:`1.5px solid ${c}35`, borderRadius:14, padding:'8px 12px', display:'flex', flexDirection:'column', justifyContent:'space-between', minWidth:0, minHeight:0, overflow:'hidden' }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexShrink:0 }}>
                  <span style={{ fontSize:13, fontWeight:800, color: pal.body, whiteSpace:'pre-line', lineHeight:1.3 }}>{item.l}</span>
                  <span style={{ display:'inline-block', padding:'3px 8px', borderRadius:999, fontSize:12, fontWeight:800, background:`${c}25`, color:c, lineHeight:1, flexShrink:0 }}>{grade}</span>
                </div>
                <div style={{ fontSize:32, fontWeight:900, color:c, lineHeight:1, flexShrink:0 }}>
                  {item.n}<span style={{ fontSize:15, fontWeight:700 }}>%</span>
                </div>
                <div style={{ height:12, background:`${c}20`, borderRadius:999, overflow:'hidden', flexShrink:0 }}>
                  <div style={{ width: ready ? `${item.n}%` : '0%', transition: `width 1s cubic-bezier(0.22,1,0.36,1) ${idx*0.1}s`, height:'100%', background:`linear-gradient(90deg, ${c}99 0%, ${c} 100%)`, borderRadius:999, display:'flex', alignItems:'center', justifyContent:'flex-end', paddingRight:5 }}>
                    {item.n >= 20 && <span style={{ fontSize:9, fontWeight:900, color:'#fff', lineHeight:1 }}>{item.n}%</span>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}

// Screen 3 & 4 — 점검표 현황 공통
type InspRow = { line: string; equip: string | null; sop: string | null; esd: string | null; s5: string | null; rate: number | null };
function DashInspTable({ scores, rows }: {
  scores: { label: string; pct: number; frac: string }[];
  rows: InspRow[];
}) {
  const pal = useDashPalette();
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 36 }}>
      <div style={{ display: 'flex', gap: 36, flexShrink: 0 }}>
        {scores.map(({ label, pct, frac }) => (
          <DashBigScore key={label} label={label} pct={pct} frac={frac} color={cBar(pct)} />
        ))}
      </div>
      <div style={{ flex: 1, minHeight: 0, overflow: 'auto', background: pal.cardBg, boxShadow: pal.cardShadow, borderRadius: DC_R }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 38 }}>
          <thead style={{ position: 'sticky', top: 0 }}>
            <tr style={{ background: pal.subBg }}>
              {['라인', '설비 점검표', 'SOP 점검표', 'ESD 점검표', '5S 체크시트', '라인별 현황'].map(h => (
                <th key={h} style={{ padding: "20px 32px", textAlign: 'center', fontWeight: 800, color: pal.tableHead, borderBottom: `1px solid ${pal.line}`, fontSize: 34 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.line} style={{ background: r.rate === null ? pal.subBg : pal.cardBg }}>
                <td style={{ padding: "16px 32px", fontWeight: 700, color: r.rate === null ? pal.tableEmpty : pal.tableCell, borderBottom: `1px solid ${pal.line}` }}>{r.line}</td>
                {[r.equip, r.sop, r.esd, r.s5].map((v, idx) => (
                  <td key={idx} style={{ padding: "16px 32px", textAlign: 'center', color: r.rate === null ? pal.tableLight : pal.tableCell, borderBottom: `1px solid ${pal.line}` }}>{v || '-'}</td>
                ))}
                <td style={{ padding: "16px 32px", textAlign: 'center', borderBottom: `1px solid ${pal.line}` }}>
                  {r.rate !== null
                    ? <span style={{ display: 'inline-flex', alignItems: 'center', gap: 40, fontWeight: 700, fontSize: 38, color: cBar(r.rate) }}>{r.rate}% <DashDot pct={r.rate} /></span>
                    : <span style={{ color: pal.tableEmpty }}>-</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function DashScreen3({ ko }: { ko: boolean }) {
  const [ready, setReady] = useState(false);
  useEffect(() => { const t = setTimeout(() => setReady(true), 250); return () => clearTimeout(t); }, []);
  const pal = useDashPalette();
  /** 상단 KPI 카드 — 사업부/라인 집계 등 별도 정의(아래 `lines` raw와 1:1 합산은 아님). pct·frac는 서로 일치해야 함. */
  const kpiSummary = [
    { label:'설비 점검', pct:67,  frac:'4/6',  grade:'주의', c:DR },
    { label:'SOP 점검',  pct:100, frac:'6/6',  grade:'완료', c:DG },
    { label:'ESD 점검',  pct:100, frac:'3/3',  grade:'완료', c:DG },
    { label:'5S 점검',   pct:67,  frac:'4/6',  grade:'주의', c:DR },
  ] as const;

  type SubItem = { done: number; total: number } | null;
  type LineRowBase = { id:string; equip:SubItem; sop:SubItem; esd:SubItem; s5:SubItem; problem?:string };
  /** 라인 종합 달성률 = (설비+SOP+ESD+5S 체크 항목 합) done / total × 100 (반올림). 카드 헤더·리스트·막대와 상세 행이 동일 기준. */
  const lineWeightedRate = (line: LineRowBase): number => {
    const parts = [line.equip, line.sop, line.esd, line.s5].filter((x): x is NonNullable<typeof x> => x != null);
    const done = parts.reduce((s, p) => s + p.done, 0);
    const tot = parts.reduce((s, p) => s + p.total, 0);
    return tot === 0 ? 0 : Math.round((done / tot) * 100);
  };
  const linesRaw: LineRowBase[] = [
    { id:'RAC01', equip:{done:7, total:8},    sop:{done:8, total:8},    esd:{done:3,total:3}, s5:{done:6,total:6}  },
    { id:'RAC05', equip:{done:17,total:17},   sop:{done:12,total:12},   esd:{done:4,total:4}, s5:{done:5,total:6}  },
    { id:'RAC07', equip:{done:10,total:11},   sop:{done:9,total:9},     esd:{done:2,total:2}, s5:{done:6,total:6}  },
    { id:'E5',    equip:{done:16,total:18},   sop:{done:14,total:14},   esd:{done:4,total:6},  s5:{done:8,total:10} },
    { id:'E6',    equip:{done:19,total:19},   sop:{done:11,total:14},   esd:{done:5,total:5},  s5:{done:0,total:24},  problem:'5S 미점검 (24건)' },
    { id:'E7',    equip:{done:9,total:11},    sop:{done:11,total:13},   esd:{done:3,total:4},  s5:{done:6,total:8}  },
  ];
  const lines = linesRaw.map(l => ({ ...l, rate: lineWeightedRate(l) }));


  const card: React.CSSProperties = {
    background: pal.cardBg, boxShadow: pal.cardShadow, borderRadius: DC_R,
    padding: '14px 18px', display: 'flex', flexDirection: 'column',
    overflow: 'hidden', minHeight: 0,
  };

  const hdr = (title: string, badge: string) => (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10, flexShrink:0 }}>
      <div style={{ display:'flex', alignItems:'center', gap:8 }}>
        <span style={{ width:5, height:22, borderRadius:4, background:DR, flexShrink:0 }} />
        <span style={{ fontSize:22, fontWeight:800, color: pal.labelHeading, letterSpacing:'0.03em' }}>{title}</span>
      </div>
      <span style={{ display:'inline-flex', background:`${DR}12`, border:`1px solid ${DR}40`, borderRadius:999, padding:'4px 11px', fontSize:13, fontWeight:700, color:DR, lineHeight:1 }}>{badge}</span>
    </div>
  );

  const lineDetailCard = (line: typeof lines[0], delayBase: number) => {
    const c = cBar(line.rate);
    const isProblem = line.rate < 90;
    const subRows: { name: string; data: SubItem }[] = [
      { name:'설비', data:line.equip },
      { name:'SOP',  data:line.sop  },
      { name:'ESD',  data:line.esd  },
      { name:'5S',   data:line.s5   },
    ];
    return (
      <div key={line.id} style={{ ...card }}>
        {/* 카드 헤더 */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10, flexShrink:0 }}>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <span style={{ width:5, height:22, borderRadius:4, background:DR, flexShrink:0 }} />
            <span style={{ fontSize:22, fontWeight:800, color: pal.labelHeading, letterSpacing:'0.03em' }}>{line.id}</span>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:2 }}>
            <span style={{ fontSize:36, fontWeight:900, color:c, lineHeight:1 }}>{line.rate}</span>
            <span style={{ fontSize:18, fontWeight:700, color:c }}>%</span>
          </div>
        </div>
        {/* 서브 항목 바 */}
        <div style={{ flex:1, minHeight:0, display:'flex', flexDirection:'column', gap:8 }}>
          {subRows.map((sub, si) => {
            if (!sub.data) return (
              <div key={sub.name} style={{ flex:1, minHeight:0, background:'#f3f4f6', border:'1.5px solid #e5e7eb', borderRadius:14, padding:'8px 14px', display:'flex', alignItems:'center', gap:10, opacity:0.45 }}>
                <span style={{ fontSize:16, fontWeight:800, color:'#111', flex:'0 0 44px', opacity:0.5 }}>{sub.name}</span>
                <span style={{ fontSize:15, color:'#111', opacity:0.45 }}>—</span>
              </div>
            );
            const pct = sub.data.total === 0 ? 0 : Math.round((sub.data.done / sub.data.total) * 100);
            const sc = pct === 100 ? DG : pct > 0 ? DA : DR;
            return (
              <div key={sub.name} style={{ flex:1, minHeight:0, background:`${sc}12`, border:`1.5px solid ${sc}35`, borderRadius:14, padding:'8px 14px', display:'flex', alignItems:'center', gap:10 }}>
                <span style={{ fontSize:16, fontWeight:800, color:'#111', flex:'0 0 44px' }}>{sub.name}</span>
                <div style={{ flex:1, height:18, background:`${sc}20`, borderRadius:999, overflow:'hidden' }}>
                  <div style={{
                    width: ready ? `${pct}%` : '0%',
                    transition: `width 1s cubic-bezier(0.22,1,0.36,1) ${delayBase + si*0.08}s`,
                    height:'100%', minWidth:0,
                    background:`linear-gradient(90deg, ${sc}99, ${sc})`,
                    borderRadius:999,
                    display:'flex', alignItems:'center', justifyContent:'flex-end', paddingRight:5,
                    overflow:'hidden',
                  }}>
                    {pct >= 18 && (
                      <span style={{ fontSize:10, fontWeight:900, color:'#fff', lineHeight:1, whiteSpace:'nowrap' }}>{pct}%</span>
                    )}
                  </div>
                </div>
                <span style={{ fontSize:14, fontWeight:700, color:sc, flex:'0 0 46px', textAlign:'right', display:'block' }}>
                  {sub.data.done}/{sub.data.total}
                </span>
              </div>
            );
          })}
        </div>
        {/* 항목별 진행율 태그 */}
        <div style={{ flexShrink:0, marginTop:8, display:'flex', gap:6, flexWrap:'wrap' }}>
          {subRows.map(sub => {
            if (!sub.data) return null;
            const p = sub.data.total === 0 ? 0 : Math.round((sub.data.done / sub.data.total) * 100);
            const tc = p === 100 ? DG : p > 0 ? DA : DR;
            return (
              <span key={sub.name} style={{ display:'inline-flex', alignItems:'center', gap:4, padding:'4px 11px', borderRadius:999, fontSize:13, fontWeight:800, background:`${tc}15`, border:`1.5px solid ${tc}40`, color:'#111', lineHeight:1 }}>
                {sub.name} <span style={{ fontSize:12, fontWeight:700, color:'#111' }}>({p}%)</span>
              </span>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr 1fr', gridTemplateRows:'minmax(0,1fr) minmax(0,1fr)', gap:16, height:'100%', minHeight:0, overflow:'hidden' }}>

      {/* ── R1C1 : KPI 종합 요약 ── */}
      <div style={card}>
        {hdr('점검 KPI 요약', '금일 기준')}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gridTemplateRows:'1fr 1fr', gap:8, flex:1, minHeight:0 }}>
          {kpiSummary.map((item, idx) => (
            <div key={item.label} style={{ background:`${item.c}12`, border:`1.5px solid ${item.c}35`, borderRadius:14, padding:'10px 12px', display:'flex', flexDirection:'column', justifyContent:'space-between', minHeight:0, overflow:'hidden' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexShrink:0 }}>
                <span style={{ fontSize:14, fontWeight:800, color:'#111' }}>{item.label}</span>
                <span style={{ display:'inline-block', padding:'4px 11px', borderRadius:999, fontSize:13, fontWeight:800, background:`${item.c}25`, color:item.c, lineHeight:1 }}>{item.grade}</span>
              </div>
              <div style={{ display:'flex', alignItems:'baseline', gap:2, flexShrink:0 }}>
                <span style={{ fontSize:34, fontWeight:900, color:item.c, lineHeight:1 }}>{item.pct}</span>
                <span style={{ fontSize:16, fontWeight:700, color:item.c }}>%</span>
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:5, flexShrink:0 }}>
                <div style={{ height:14, background:`${item.c}20`, borderRadius:999, overflow:'hidden' }}>
                  <div style={{
                    width: ready ? `${item.pct}%` : '0%',
                    transition: `width 1s cubic-bezier(0.22,1,0.36,1) ${idx*0.1}s`,
                    height:'100%', minWidth: 0,
                    background:`linear-gradient(90deg, ${item.c}99, ${item.c})`,
                    borderRadius:999,
                    display:'flex', alignItems:'center', justifyContent:'flex-end', paddingRight:5,
                    overflow:'hidden',
                  }}>
                    {item.pct >= 18 && (
                      <span style={{ fontSize:10, fontWeight:900, color:'#fff', lineHeight:1, whiteSpace:'nowrap' }}>{item.pct}%</span>
                    )}
                  </div>
                </div>
                <span style={{ fontSize:13, fontWeight:700, color:'#111' }}>{item.frac} 완료</span>
              </div>
            </div>
          ))}
        </div>
        {/* 문제 항목 배너 */}
        <div style={{ flexShrink:0, marginTop:8, background:`${DR}12`, border:`1.5px solid ${DR}40`, borderRadius:12, padding:'8px 12px', display:'flex', gap:6 }}>
          {kpiSummary.filter(k => k.pct < 90).map(k => (
            <span key={k.label} style={{ display:'inline-block', padding:'4px 11px', borderRadius:999, fontSize:13, fontWeight:800, background:`${DR}20`, color:DR, lineHeight:1 }}>
              {k.label} ({k.pct}%)
            </span>
          ))}
        </div>
      </div>

      {/* ── R1C2~C4 : 라인 상태 요약 ── */}
      <div style={{ ...card, gridColumn:'span 3' }}>
        {hdr('라인 상태 요약', '금일 기준')}
        <div style={{ flex:1, minHeight:0, display:'grid', gridTemplateRows:`repeat(${lines.length}, minmax(0,1fr))`, gap:8 }}>
          {lines.map((l, idx) => {
            const c = cBar(l.rate);
            const grade = l.rate >= 93 ? '정상' : l.rate >= 76 ? '점검중' : '미완료';
            const isProblem = l.rate < 90;
            return (
              <div key={l.id} style={{ background: isProblem ? `${DR}12` : `${c}12`, border:`1.5px solid ${isProblem ? DR : c}35`, borderRadius:14, padding:'0 16px', display:'flex', alignItems:'center', gap:14 }}>
                <span style={{ fontSize:18, fontWeight:900, color: isProblem ? DR : '#111', flex:'0 0 62px' }}>{l.id}</span>
                <div style={{ flex:1, height:16, background:`${c}20`, borderRadius:999, overflow:'hidden' }}>
                  <div style={{ width: ready ? `${l.rate}%` : '0%', transition: `width 1s cubic-bezier(0.22,1,0.36,1) ${idx*0.1}s`, height:'100%', background:`linear-gradient(90deg, ${c}99, ${c})`, borderRadius:999, display:'flex', alignItems:'center', justifyContent:'flex-end', paddingRight:8 }}>
                    {l.rate >= 20 && <span style={{ fontSize:11, fontWeight:900, color:'#fff' }}>{l.rate}%</span>}
                  </div>
                </div>
                <span style={{ fontSize:22, fontWeight:900, color:c, flex:'0 0 54px', textAlign:'right', display:'block' }}>{l.rate}%</span>
                <span style={{ display:'inline-block', padding:'4px 12px', borderRadius:999, fontSize:13, fontWeight:800, background:`${c}25`, color:c, flexShrink:0, lineHeight:1 }}>{grade}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── R2C1 : E6 문제 라인 상세 ── */}
      {lineDetailCard(lines.find(l => l.id === 'E6')!, 0)}

      {/* ── R2C2 : E5 ── */}
      {lineDetailCard(lines.find(l => l.id === 'E5')!, 0.1)}

      {/* ── R2C3 : E7 ── */}
      {lineDetailCard(lines.find(l => l.id === 'E7')!, 0.2)}

      {/* ── R2C4 : RAC 그룹 ── */}
      <div style={card}>
        {hdr('RAC 라인 현황', '금일')}
        <div style={{ flex:1, minHeight:0, display:'flex', flexDirection:'column', gap:8 }}>
          {lines.filter(l => l.id.startsWith('RAC')).map((l, idx) => {
            const c = cBar(l.rate);
            return (
              <div key={l.id} style={{ flex:1, minHeight:0, background:`${c}12`, border:`1.5px solid ${c}35`, borderRadius:14, padding:'8px 14px', display:'flex', flexDirection:'column', justifyContent:'space-between' }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', flexShrink:0 }}>
                  <span style={{ fontSize:17, fontWeight:900, color:'#111' }}>{l.id}</span>
                  <div style={{ display:'flex', alignItems:'baseline', gap:2 }}>
                    <span style={{ fontSize:26, fontWeight:900, color:c, lineHeight:1 }}>{l.rate}</span>
                    <span style={{ fontSize:14, fontWeight:700, color:c }}>%</span>
                  </div>
                </div>
                <div style={{ height:14, background:`${c}20`, borderRadius:999, overflow:'hidden', flexShrink:0 }}>
                  <div style={{ width: ready ? `${l.rate}%` : '0%', transition: `width 1s cubic-bezier(0.22,1,0.36,1) ${idx*0.12}s`, height:'100%', background:`linear-gradient(90deg, ${c}99, ${c})`, borderRadius:999, display:'flex', alignItems:'center', justifyContent:'flex-end', paddingRight:6 }}>
                    {l.rate >= 20 && <span style={{ fontSize:10, fontWeight:900, color:'#fff' }}>{l.rate}%</span>}
                  </div>
                </div>
                <div style={{ display:'flex', gap:6, flexShrink:0 }}>
                  {[{k:'설비', d:l.equip},{k:'SOP',d:l.sop},{k:'ESD',d:l.esd},{k:'5S',d:l.s5}].map(s => {
                    if (!s.d) return null;
                    const ok = s.d.done === s.d.total;
                    const bc = ok ? DG : DA;
                    return (
                      <span key={s.k} style={{ display:'inline-flex', alignItems:'center', gap:3, padding:'2px 7px', borderRadius:999, fontSize:11, fontWeight:800, background:`${bc}25`, color:bc, border:`1px solid ${bc}40`, lineHeight:1 }}>
                        {s.k} {ok ? '✓' : `${s.d.done}/${s.d.total}`}
                      </span>
                    );
                  })}
                </div>
              </div>
            );
          })}
          {/* 미점검 알림 */}
          <div style={{ flexShrink:0, background:`${DR}12`, border:`1.5px solid ${DR}40`, borderRadius:12, padding:'8px 12px' }}>
            <div style={{ fontSize:12, fontWeight:800, color:DR }}>⚠ 오늘 미점검 항목</div>
            <div style={{ fontSize:16, fontWeight:900, color:DR, marginTop:3 }}>24건 <span style={{ fontSize:12, fontWeight:700 }}>(E6 - 5S)</span></div>
          </div>
        </div>
      </div>

    </div>
  );
}

function DashScreen4({ ko }: { ko: boolean }) {
  const [ready, setReady] = useState(false);
  useEffect(() => { const t = setTimeout(() => setReady(true), 250); return () => clearTimeout(t); }, []);
  const pal = useDashPalette();
  const kpi4 = [
    { label:'설비 점검표', pct:80,  frac:'8/10'  },
    { label:'SOP 점검표',  pct:100, frac:'9/9'   },
    { label:'ESD 점검표',  pct:100, frac:'10/10' },
    { label:'5S 점검표',   pct:100, frac:'7/7'   },
  ];
  const biz03 = [
    { l:'라인01', equip:'8/8',   rate:100 },
    { l:'라인02', equip:'9/9',   rate:100 },
    { l:'라인03', equip:'11/11', rate:100 },
    { l:'라인04', equip:'9/10',  rate:95  },
    { l:'라인05', equip:'7/7',   rate:100 },
  ];
  const biz04 = [
    { l:'라인06', equip:'12/13', rate:98  },
    { l:'라인07', equip:'8/8',   rate:100 },
    { l:'라인08', equip:'10/10', rate:100 },
    { l:'라인09', equip:'9/9',   rate:100 },
    { l:'라인10', equip:'14/15', rate:94  },
    { l:'라인11', equip:'6/6',   rate:100 },
    { l:'라인12', equip:'7/7',   rate:100 },
    { l:'라인13', equip:'11/11', rate:100 },
  ];
  const esd4Kpi = [
    { label:'1종접지', pct:100, change:'+0%' },
    { label:'ESD',     pct:93,  change:'-1%' },
    { label:'정전기',  pct:100, change:'+2%' },
    { label:'Tester',  pct:100, change:'+3%' },
  ];
  const inspItems4 = [
    { title:'설비 점검', sub:'사업부03', val:80,  prev:'85%'  },
    { title:'SOP 점검',  sub:'사업부03', val:100, prev:'100%' },
    { title:'5S 체크',   sub:'사업부04', val:100, prev:'97%'  },
  ];
  const summ4 = [
    { l:'완료 라인', v:'12',   n:100 }, { l:'미완료',    v:'1',    n:0   },
    { l:'설비 달성', v:'80%',  n:80  }, { l:'SOP 달성',  v:'100%', n:100 },
    { l:'ESD 달성',  v:'100%', n:100 }, { l:'5S 달성',   v:'100%', n:100 },
  ];
  const sparkItems4 = [
    { l:'설비 미완료', id:'s4a', v:'2', u:'건', sub:'금일', c:DA, pts:[3,3,2,2,2] },
    { l:'SOP 미완료',  id:'s4b', v:'0', u:'건', sub:'금일', c:DG, pts:[1,0,0,0,0] },
    { l:'ESD 미완료',  id:'s4c', v:'0', u:'건', sub:'금일', c:DG, pts:[0,0,0,0,0] },
    { l:'5S 미완료',   id:'s4d', v:'0', u:'건', sub:'금일', c:DG, pts:[1,1,0,0,0] },
  ] as const;

  const card: React.CSSProperties = {
    background: pal.cardBg, boxShadow: pal.cardShadow, borderRadius: DC_R,
    padding: '14px 18px', display: 'flex', flexDirection: 'column',
    overflow: 'hidden', minHeight: 0,
  };
  const sub14: React.CSSProperties = { background: pal.subBg, borderRadius: 14 };

  /** DashScreen3 「라인 상태 요약」과 동일 행 패턴 — 설비 건수( equip )는 좌측 보조 라인으로 유지 */
  const bizLineRowLikeDs3 = (r: { l: string; equip: string; rate: number }, idx: number) => {
    const c = cBar(r.rate);
    const grade = r.rate >= 93 ? '정상' : r.rate >= 76 ? '점검중' : '미완료';
    const isProblem = r.rate < 90;
    return (
      <div
        key={r.l}
        style={{
          background: isProblem ? `${DR}12` : `${c}12`,
          border: `1.5px solid ${isProblem ? DR : c}35`,
          borderRadius: 14,
          padding: '0 16px',
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          minHeight: 0,
        }}
      >
        <div style={{ flex: '0 0 72px', minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 2, padding: '6px 0' }}>
          <span style={{ fontSize: 17, fontWeight: 900, color: isProblem ? DR : pal.body, lineHeight: 1.1 }}>{r.l}</span>
          <span style={{ fontSize: 11, fontWeight: 600, color: DGR, lineHeight: 1 }}>설비 {r.equip}</span>
        </div>
        <div style={{ flex: 1, height: 16, background: `${c}20`, borderRadius: 999, overflow: 'hidden', minWidth: 0 }}>
          <div
            style={{
              width: ready ? `${r.rate}%` : '0%',
              transition: `width 1s cubic-bezier(0.22,1,0.36,1) ${idx * 0.1}s`,
              height: '100%',
              background: `linear-gradient(90deg, ${c}99, ${c})`,
              borderRadius: 999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              paddingRight: 8,
            }}
          >
            {r.rate >= 20 && <span style={{ fontSize: 11, fontWeight: 900, color: '#fff' }}>{r.rate}%</span>}
          </div>
        </div>
        <span style={{ fontSize: 22, fontWeight: 900, color: c, flex: '0 0 54px', textAlign: 'right', display: 'block' }}>{r.rate}%</span>
        <span style={{ display: 'inline-block', padding: '4px 12px', borderRadius: 999, fontSize: 13, fontWeight: 800, background: `${c}25`, color: c, flexShrink: 0, lineHeight: 1 }}>{grade}</span>
      </div>
    );
  };

  return (
    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr 1fr', gridTemplateRows:'minmax(0,1fr) minmax(0,1fr)', gap:16, height:'100%', minHeight:0, overflow:'hidden' }}>

      {/* ── R1C1 : 점검 종합 KPI ── */}
      <div style={card}>
        <DSLabel label="점검 종합 KPI" />
        <div style={{ flex:1, minHeight:0, display:'grid', gridTemplateColumns:'1fr 1fr', gridTemplateRows:'1fr 1fr', gap:8 }}>
          {kpi4.map((item, idx) => {
            const c = cBar(item.pct);
            const grade = item.pct >= 90 ? '완료' : item.pct >= 70 ? '진행중' : '미완료';
            const gc = item.pct >= 90 ? DG : item.pct >= 70 ? DA : DR;
            return (
              <div key={item.label} style={{ background:`${c}15`, border:`1px solid ${c}40`, borderRadius:14, padding:'12px 12px 10px', display:'flex', flexDirection:'column', justifyContent:'space-between', minHeight:0, overflow:'hidden' }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <span style={{ fontSize:15, fontWeight:700, color: pal.labelHeading, lineHeight:1.2 }}>{item.label}</span>
                  <span style={{ width:9, height:9, borderRadius:'50%', background:c, flexShrink:0 }} />
                </div>
                <div style={{ fontSize:34, fontWeight:900, color:c, lineHeight:1 }}>
                  {item.pct}<span style={{ fontSize:18, fontWeight:700 }}>%</span>
                </div>
                <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                  <div style={{ height:12, background:`${c}25`, borderRadius:999, overflow:'hidden' }}>
                    <motion.div
                      initial={{ width:0 }} animate={{ width:`${item.pct}%` }}
                      transition={{ duration:1.0, delay:idx*0.08, ease:[0.22,1,0.36,1] }}
                      style={{
                        height:'100%', minWidth:0, background:c, borderRadius:999,
                        display:'flex', alignItems:'center', justifyContent:'flex-end', paddingRight:4,
                        overflow:'hidden',
                      }}
                    >
                      {item.pct >= 22 && (
                        <span style={{ fontSize:9, fontWeight:900, color:'#fff', lineHeight:1, whiteSpace:'nowrap' }}>{item.pct}%</span>
                      )}
                    </motion.div>
                  </div>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                    <span style={{ display:'inline-block', padding:'3px 10px', borderRadius:999, fontSize:12, fontWeight:800, background:`${gc}22`, color:gc }}>{grade}</span>
                    <span style={{ display:'inline-block', padding:'3px 10px', borderRadius:999, fontSize:11, fontWeight:700, background:`${c}15`, color:c }}>{item.frac}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── R1C2 : 사업부3 라인 현황 ── */}
      <div style={card}>
        <DSLabel label="사업부3 라인 현황" />
        <div style={{ flex:1, minHeight:0, display:'grid', gridTemplateRows:'repeat(5, minmax(0,1fr))', gap:8 }}>
          {biz03.map((r, idx) => bizLineRowLikeDs3(r, idx))}
        </div>
      </div>

      {/* ── R1C3 : 사업부4 라인 현황 ── */}
      <div style={card}>
        <DSLabel label="사업부4 라인 현황" />
        <div style={{ flex:1, minHeight:0, display:'grid', gridTemplateRows:'repeat(8, minmax(0,1fr))', gap:8 }}>
          {biz04.map((r, idx) => bizLineRowLikeDs3(r, idx))}
        </div>
      </div>

      {/* ── R1C4 : 점검 활동 현황 ── */}
      <div style={card}>
        <DSLabel label="점검 활동 현황" />
        <div style={{ flex:1, minHeight:0, display:'grid', gridTemplateRows:'repeat(3, 1fr)', gap:8 }}>
          {inspItems4.map(item => {
            const c = cBar(item.val);
            const filled = Math.round(Math.min(item.val, 100) / 10);
            return (
              <div key={item.title} style={{ ...sub14, padding:'8px 14px', display:'flex', flexDirection:'column', justifyContent:'space-between' }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <div>
                    <span style={{ fontSize:18, fontWeight:700, color: pal.body }}>{item.title}</span>
                    <span style={{ fontSize:13, fontWeight:600, color:DGR, marginLeft:6 }}>{item.sub}</span>
                  </div>
                  <span style={{ fontSize:34, fontWeight:900, color:c, lineHeight:1 }}>{item.val}<span style={{ fontSize:18 }}>%</span></span>
                </div>
                <div style={{ display:'flex', gap:4 }}>
                  {Array.from({ length:10 }, (_, i) => (
                    <motion.div key={i}
                      initial={{ opacity:0, scaleY:0.4 }}
                      animate={{ opacity: i < filled ? 0.35+(i/9)*0.65 : 1, scaleY:1 }}
                      transition={{ duration:0.55, delay:i*0.045, ease:[0.22,1,0.36,1] }}
                      style={{ flex:1, height:14, borderRadius:4, background: i < filled ? c : pal.track, transformOrigin:'bottom' }}
                    />
                  ))}
                </div>
                <div style={{ display:'flex', justifyContent:'space-between' }}>
                  <span style={{ fontSize:14, fontWeight:700, color:DGR }}>달성율 {item.val}%</span>
                  <span style={{ fontSize:14, fontWeight:700, color:DGR }}>전기 {item.prev}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── R2C1 : ESD / 5S 점검 ── */}
      <div style={card}>
        <DSLabel label="ESD / 5S 점검" />
        <div style={{ flex:1, minHeight:0, display:'grid', gridTemplateRows:'5fr 2fr', gap:8 }}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gridTemplateRows:'1fr 1fr', gap:8, minHeight:0, overflow:'hidden' }}>
            {esd4Kpi.map((item, idx) => <EsdCard key={item.label} label={item.label} pct={item.pct} change={item.change} idx={idx} />)}
          </div>
          <div style={{ display:'grid', gridTemplateRows:'repeat(4, minmax(0,1fr))', gap:4, minHeight:0 }}>
            {biz03.slice(0,4).map(r => {
              const sc = cBar(r.rate);
              return (
                <div key={r.l} style={{ ...sub14, padding:'3px 10px', display:'flex', alignItems:'center', gap:8, minHeight:0 }}>
                  <span style={{ width:7, height:7, borderRadius:'50%', background:sc, flexShrink:0 }} />
                  <span style={{ fontSize:13, fontWeight:700, color: pal.body, flex:'0 0 48px' }}>{r.l}</span>
                  <span style={{ fontSize:12, fontWeight:600, color:DGR, flex:1 }}>설비 {r.equip}</span>
                  <span style={{ fontSize:14, fontWeight:900, color:sc }}>{r.rate}%</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── R2C2~3 (colspan 2) : 설비 / SOP 점검 세부 ── */}
      <div style={{ ...card, gridColumn:'span 2' }}>
        <DSLabel label="설비 / SOP 점검 세부" />
        <div style={{ flex:1, minHeight:0, display:'flex', gap:14 }}>
          <div style={{ flex:1, display:'grid', gridTemplateRows:'repeat(3, 1fr)', gap:8 }}>
            {inspItems4.map(item => {
              const c = cBar(item.val);
              const filled = Math.round(Math.min(item.val, 100) / 10);
              return (
                <div key={item.title+'-d'} style={{ ...sub14, padding:'8px 14px', display:'flex', flexDirection:'column', justifyContent:'space-between' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                    <div>
                      <span style={{ fontSize:18, fontWeight:700, color: pal.body }}>{item.title}</span>
                      <span style={{ fontSize:14, fontWeight:600, color:DGR, marginLeft:6 }}>{item.sub} 전체</span>
                    </div>
                    <span style={{ fontSize:34, fontWeight:900, color:c, lineHeight:1 }}>{item.val}<span style={{ fontSize:16 }}>%</span></span>
                  </div>
                  <div style={{ display:'flex', gap:4 }}>
                    {Array.from({ length:10 }, (_, i) => (
                      <motion.div key={i}
                        initial={{ opacity:0, scaleY:0.3 }}
                        animate={{ opacity: i < filled ? 0.3+(i/9)*0.7 : 1, scaleY:1 }}
                        transition={{ duration:0.5, delay:i*0.04, ease:[0.22,1,0.36,1] }}
                        style={{ flex:1, height:14, borderRadius:4, background: i < filled ? c : pal.track, transformOrigin:'bottom' }}
                      />
                    ))}
                  </div>
                  <div style={{ display:'flex', justifyContent:'space-between' }}>
                    <span style={{ fontSize:14, fontWeight:700, color:DGR }}>달성율 {item.val}%</span>
                    <span style={{ fontSize:14, fontWeight:700, color:DGR }}>전기 {item.prev}</span>
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{ flex:1, display:'grid', gridTemplateColumns:'1fr 1fr', gridTemplateRows:'repeat(2, minmax(0,1fr))', gap:8 }}>
            {sparkItems4.map(item => {
              const { line, area, xs, ys } = mkSpark(item.pts);
              return (
                <div key={item.id} style={{ ...sub14, padding:'0 14px', display:'flex', flexDirection:'column', overflow:'hidden' }}>
                  <div style={{ flexShrink:0, display:'flex', justifyContent:'space-between', alignItems:'center', paddingTop:8, paddingBottom:4 }}>
                    <span style={{ fontSize:16, fontWeight:700, color:DGR, lineHeight:1 }}>
                      {item.l} <span style={{ fontSize:13 }}>({item.sub})</span>
                    </span>
                    <span style={{ fontSize:26, fontWeight:900, color:item.c, lineHeight:1 }}>
                      {item.v}<span style={{ fontSize:14, fontWeight:600, marginLeft:2 }}>{item.u}</span>
                    </span>
                  </div>
                  <div style={{ flex:'1 1 0', minHeight:0 }}>
                    <svg width="100%" height="100%" viewBox="0 0 110 56" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id={item.id} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={item.c} stopOpacity="0.42" />
                          <stop offset="100%" stopColor={item.c} stopOpacity="0.02" />
                        </linearGradient>
                      </defs>
                      <path d={area} fill={`url(#${item.id})`} />
                      <path d={line} fill="none" stroke={item.c} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                      {xs.map((x, i) => (
                        <g key={i}>
                          <text x={x} y={ys[i]-5} textAnchor="middle" fontSize="9" fill={item.c} fontWeight="800">{item.pts[i]}</text>
                          <circle cx={x} cy={ys[i]} r="3" fill={item.c} />
                        </g>
                      ))}
                    </svg>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── R2C4 : 종합 현황 ── */}
      <div style={card}>
        <DSLabel label="종합 현황" />
        <div style={{ flex:1, minHeight:0, display:'grid', gridTemplateColumns:'1fr 1fr', gridTemplateRows:'repeat(3, minmax(0,1fr))', gap:8 }}>
          {summ4.map((item, idx) => {
            const c = item.n === 0 ? DR : cBar(item.n);
            const grade = item.n === 0 ? '미달' : item.n >= 90 ? '달성' : '주의';
            return (
              <div key={item.l} style={{ background:`${c}12`, border:`1.5px solid ${c}35`, borderRadius:14, padding:'12px 14px', display:'flex', flexDirection:'column', justifyContent:'space-between', minHeight:0, overflow:'hidden' }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexShrink:0 }}>
                  <span style={{ fontSize:15, fontWeight:800, color: pal.body, lineHeight:1.25 }}>{item.l}</span>
                  <span style={{ display:'inline-block', padding:'4px 12px', borderRadius:999, fontSize:14, fontWeight:800, background:`${c}22`, color:c, lineHeight:1.2, flexShrink:0 }}>{grade}</span>
                </div>
                <div style={{ display:'flex', alignItems:'baseline', gap:3, flexShrink:0 }}>
                  <span style={{ fontSize:44, fontWeight:900, color:c, lineHeight:1 }}>{item.v}</span>
                </div>
                <div style={{ height:20, background:`${c}20`, borderRadius:999, overflow:'hidden', flexShrink:0 }}>
                  <div style={{ width: ready ? `${item.n}%` : '0%', transition: `width 1s cubic-bezier(0.22,1,0.36,1) ${idx*0.14}s`, height:'100%', background:`linear-gradient(90deg, ${c}99 0%, ${c} 100%)`, borderRadius:999, display:'flex', alignItems:'center', justifyContent:'flex-end', paddingRight:7 }}>
                    {item.n >= 20 && <span style={{ fontSize:11, fontWeight:900, color:'#fff', lineHeight:1 }}>{item.n}%</span>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}

// Screen 5 — 라인 점검표 CAC01
function DashScreen5({ ko }: { ko: boolean }) {
  const [ready, setReady] = useState(false);
  useEffect(() => { const t = setTimeout(() => setReady(true), 250); return () => clearTimeout(t); }, []);
  const pal = useDashPalette();
  const kpi5 = [
    { label:'설비 점검표', pct:100, frac:'28/28', change:'+3%p' },
    { label:'SOP 점검표',  pct:100, frac:'15/15', change:'+2%p' },
    { label:'ESD 점검표',  pct:75,  frac:'6/8',   change:'-2%p' },
    { label:'5S 점검표',   pct:100, frac:'34/34', change:'+2%p' },
  ];
  const actItems5 = [
    { title:'설비 점검', goal:'28/28건 완료', pct:100 },
    { title:'SOP 점검',  goal:'15/15건 완료', pct:100 },
    { title:'5S 체크',   goal:'34/34건 완료', pct:100 },
  ];
  const spark5 = [
    { l:'설비 점검', id:'s5a', v:'100', u:'%', c:DG, pts:[95,97,100,100,100] },
    { l:'SOP 점검',  id:'s5b', v:'100', u:'%', c:DG, pts:[90,95,98,100,100] },
    { l:'ESD 점검',  id:'s5c', v:'75',  u:'%', c:DR, pts:[88,82,80,77,75]   },
    { l:'5S 체크',   id:'s5d', v:'100', u:'%', c:DG, pts:[92,95,98,100,100] },
  ] as const;
  const eduTracks5 = [
    { label:'설비 점검', sub:'사업부01', val:100, target:'28/28건', prev:'97%' },
    { label:'SOP 점검',  sub:'사업부01', val:100, target:'15/15건', prev:'98%' },
    { label:'5S 체크',   sub:'사업부01', val:100, target:'34/34건', prev:'98%' },
  ];
  const eduStat5 = [
    { l:'설비 완료', v:'28건',  pct:100, c:DG },
    { l:'SOP 완료',  v:'15건',  pct:100, c:DG },
    { l:'ESD 미완료', v:'2건',  pct:25,  c:DR },
    { l:'5S 완료',   v:'34건',  pct:100, c:DG },
  ];

  const card: React.CSSProperties = {
    background: pal.cardBg, boxShadow: pal.cardShadow, borderRadius: DC_R,
    padding: '14px 18px', display: 'flex', flexDirection: 'column',
    overflow: 'hidden', minHeight: 0,
  };
  const sub14: React.CSSProperties = { background: pal.subBg, borderRadius: 14 };

  const badgeHdr5 = (title: string, badge: string) => (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:8, flexShrink:0 }}>
      <div style={{ display:'flex', alignItems:'center', gap:8 }}>
        <span style={{ width:5, height:22, borderRadius:4, background:DR, flexShrink:0 }} />
        <span style={{ fontSize:22, fontWeight:800, color: pal.labelHeading, letterSpacing:'0.03em' }}>{title}</span>
      </div>
      <span style={{ display:'inline-flex', background:`${DR}12`, border:`1px solid ${DR}40`, borderRadius:999, padding:'4px 11px', fontSize:13, fontWeight:700, color:DR, lineHeight:1 }}>
        {badge}
      </span>
    </div>
  );

  const barChart5 = (bars: readonly {pct:number}[], xLabels: readonly [string,string][]) => (
    <div style={{ flex:1, minHeight:0, display:'flex', flexDirection:'column' }}>
      <div style={{ flex:1, minHeight:0, display:'flex', gap:8, alignItems:'flex-end' }}>
        {bars.map((item, idx) => {
          const c = cBar(item.pct);
          return (
            <div key={idx} style={{ flex:1, height:'100%', display:'flex', flexDirection:'column', alignItems:'center', minWidth:0 }}>
              <div style={{ flex:1, width:'78%', position:'relative', display:'flex', alignItems:'flex-end' }}>
                <div style={{ position:'absolute', bottom:0, left:0, right:0, top:0, background:`${c}28`, borderRadius:10 }} />
                <motion.div initial={{ height:0 }} animate={{ height:`${item.pct}%` }}
                  transition={{ duration:1.1, delay:idx*0.12+0.2, ease:[0.22,1,0.36,1] }}
                  style={{ width:'100%', background:c, borderRadius:10, position:'relative', display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden' }}>
                  <span style={{ fontSize:20, fontWeight:900, color:'#fff', letterSpacing:'-0.01em', lineHeight:1 }}>{item.pct}%</span>
                </motion.div>
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ display:'flex', gap:10, flexShrink:0, marginTop:6 }}>
        {xLabels.map((l, idx) => (
          <div key={idx} style={{ flex:1, textAlign:'center', lineHeight:1.25 }}>
            <div style={{ fontSize:14, fontWeight:700, color: pal.labelHeading }}>{l[0]}</div>
            {l[1] && <div style={{ fontSize:14, fontWeight:700, color: pal.labelHeading }}>{l[1]}</div>}
          </div>
        ))}
      </div>
    </div>
  );

  const kpiGrid5 = (items: readonly {t1:string; t2:string; v:string; u:string; c:string}[]) => (
    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginTop:8, flexShrink:0 }}>
      {items.map(item => (
        <div key={`${item.t1}${item.t2}`} style={{ background:`${item.c}12`, border:`1.5px solid ${item.c}35`, borderRadius:12, padding:'8px 12px', display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ display:'flex', flexDirection:'column', lineHeight:1.2, flexShrink:0 }}>
            <span style={{ fontSize:17, fontWeight:700, color: pal.body }}>{item.t1}</span>
            {item.t2 && <span style={{ fontSize:17, fontWeight:700, color: pal.body }}>{item.t2}</span>}
          </div>
          <div style={{ flex:1, textAlign:'right' }}>
            <span style={{ fontSize:32, fontWeight:900, color:item.c }}>{item.v}</span>
            <span style={{ fontSize:15, fontWeight:700, color:item.c, marginLeft:3 }}>{item.u}</span>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr 1fr', gridTemplateRows:'minmax(0,1fr) minmax(0,1fr)', gap:16, height:'100%', minHeight:0, overflow:'hidden' }}>

      {/* ── R1C1 : 점검 종합 ── */}
      <div style={card}>
        {badgeHdr5('점검 종합', '금일 기준')}
        {barChart5([{pct:100},{pct:100},{pct:75}] as const, [['설비','점검'],['SOP','점검'],['ESD','점검']] as const)}
        {kpiGrid5([
          { t1:'설비', t2:'완료',   v:'28', u:'건', c:DG },
          { t1:'SOP',  t2:'완료',   v:'15', u:'건', c:DG },
          { t1:'ESD',  t2:'미완료', v:'2',  u:'건', c:DR },
          { t1:'5S',   t2:'완료',   v:'34', u:'건', c:DG },
        ] as const)}
      </div>

      {/* ── R1C2 : ESD / 5S 점검 ── */}
      <div style={card}>
        <DSLabel label="ESD / 5S 점검" />
        <div style={{ flex:1, minHeight:0, display:'grid', gridTemplateColumns:'1fr 1fr', gridTemplateRows:'1fr 1fr', gap:8 }}>
          {kpi5.map((item, idx) => {
            const c = cBar(item.pct);
            const grade = item.pct >= 90 ? '달성' : item.pct >= 80 ? '주의' : '미달';
            return (
              <div key={item.label} style={{ background:`${c}15`, border:`1px solid ${c}40`, borderRadius:14, padding:'12px 12px 10px', display:'flex', flexDirection:'column', minWidth:0, justifyContent:'space-between' }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <span style={{ fontSize:15, fontWeight:700, color: pal.labelHeading, lineHeight:1.2 }}>{item.label}</span>
                  <span style={{ width:9, height:9, borderRadius:'50%', background:c, flexShrink:0 }} />
                </div>
                <div style={{ fontSize:34, fontWeight:900, color:c, lineHeight:1 }}>
                  {item.pct}<span style={{ fontSize:18, fontWeight:700 }}>%</span>
                </div>
                <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                  <div style={{ height:12, background:`${c}25`, borderRadius:999, overflow:'hidden' }}>
                    <div style={{
                      width: ready ? `${item.pct}%` : '0%',
                      transition: `width 1s cubic-bezier(0.22,1,0.36,1) ${idx*0.08}s`,
                      height:'100%', minWidth:0, background:c, borderRadius:999,
                      display:'flex', alignItems:'center', justifyContent:'flex-end', paddingRight:4,
                      overflow:'hidden',
                    }}>
                      {item.pct >= 22 && (
                        <span style={{ fontSize:9, fontWeight:900, color:'#fff', lineHeight:1, whiteSpace:'nowrap' }}>{item.pct}%</span>
                      )}
                    </div>
                  </div>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                    <span style={{ display:'inline-block', padding:'3px 10px', borderRadius:999, fontSize:12, fontWeight:800, background:`${c}22`, color:c }}>{grade}</span>
                    <span style={{ display:'inline-block', padding:'3px 10px', borderRadius:999, fontSize:11, fontWeight:700, background:`${c}15`, color:c }}>{item.frac}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── R1C3 : 점검 활동 현황 ── */}
      <div style={card}>
        <DSLabel label="점검 활동 현황" />
        <div style={{ flex:1, minHeight:0, display:'grid', gridTemplateRows:'repeat(3, 1fr)', gap:8 }}>
          {actItems5.map(item => {
            const c = cBar(item.pct);
            const filled = Math.round(item.pct / 10);
            return (
              <div key={item.title} style={{ ...sub14, padding:'8px 12px', display:'flex', flexDirection:'column', justifyContent:'space-between' }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <span style={{ fontSize:18, fontWeight:700, color: pal.body }}>{item.title}</span>
                  <span style={{ fontSize:36, fontWeight:900, color:c, lineHeight:1 }}>{item.pct}<span style={{ fontSize:20 }}>%</span></span>
                </div>
                <div style={{ display:'flex', gap:4 }}>
                  {Array.from({ length:10 }, (_, i) => (
                    <motion.div key={i} initial={{ opacity:0, scaleY:0.4 }}
                      animate={{ opacity: i<filled ? 0.35+(i/9)*0.65 : 1, scaleY:1 }}
                      transition={{ duration:0.55, delay:i*0.045, ease:[0.22,1,0.36,1] }}
                      style={{ flex:1, height:14, borderRadius:4, background: i<filled ? c : pal.track, transformOrigin:'bottom' }}
                    />
                  ))}
                </div>
                <div style={{ fontSize:16, fontWeight:700, color:DGR }}>{item.goal}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── R1C4 : 달성 추이 ── */}
      <div style={card}>
        <DSLabel label="달성 추이" />
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, flexShrink:0 }}>
          {([
            { label:'미완료', v:'2',  u:'건', c:DR },
            { label:'달성율', v:'93', u:'%',  c:cBar(93) },
          ] as const).map(item => (
            <div key={item.label} style={{ background:`${item.c}12`, border:`1.5px solid ${item.c}35`, borderRadius:12, padding:'8px 12px', textAlign:'center' }}>
              <div style={{ fontSize:18, fontWeight:700, color: pal.body }}>{item.label}</div>
              <div style={{ fontSize:36, fontWeight:900, color:item.c, lineHeight:1.1 }}>
                {item.v}<span style={{ fontSize:20 }}>{item.u}</span>
              </div>
            </div>
          ))}
        </div>
        <div style={{ flex:1, minHeight:0, display:'grid', gridTemplateColumns:'1fr 1fr', gridTemplateRows:'1fr 1fr', gap:8, marginTop:8 }}>
          {spark5.map(item => {
            const { line, area, xs, ys } = mkSpark(item.pts);
            return (
              <div key={item.id} style={{ ...sub14, padding:'0 12px', display:'flex', flexDirection:'column', overflow:'hidden' }}>
                <div style={{ flexShrink:0, display:'flex', justifyContent:'space-between', alignItems:'center', paddingTop:8, paddingBottom:4 }}>
                  <span style={{ fontSize:15, fontWeight:700, color:DGR, lineHeight:1 }}>{item.l}</span>
                  <span style={{ fontSize:22, fontWeight:900, color:item.c, lineHeight:1 }}>
                    {item.v}<span style={{ fontSize:13, fontWeight:600, marginLeft:2 }}>{item.u}</span>
                  </span>
                </div>
                <div style={{ flex:'1 1 0', minHeight:0 }}>
                  <svg width="100%" height="100%" viewBox="0 0 110 56" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id={item.id} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={item.c} stopOpacity="0.42" />
                        <stop offset="100%" stopColor={item.c} stopOpacity="0.02" />
                      </linearGradient>
                    </defs>
                    <path d={area} fill={`url(#${item.id})`} />
                    <path d={line} fill="none" stroke={item.c} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    {xs.map((x, i) => (
                      <g key={i}>
                        <text x={x} y={ys[i]-5} textAnchor="middle" fontSize="9" fill={item.c} fontWeight="800">{item.pts[i]}</text>
                        <circle cx={x} cy={ys[i]} r="3" fill={item.c} />
                      </g>
                    ))}
                  </svg>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── R2C1 : ESD 세부 현황 ── */}
      <div style={card}>
        {badgeHdr5('ESD 세부', '금일 기준')}
        {barChart5([{pct:100},{pct:0},{pct:100}] as const, [['1종','접지'],['정전기','CS'],['Tester','']] as const)}
        {kpiGrid5([
          { t1:'ESD',  t2:'점검OK', v:'6',  u:'건', c:DG },
          { t1:'ESD',  t2:'미완료', v:'2',  u:'건', c:DR },
          { t1:'ESD',  t2:'달성율', v:'75', u:'%',  c:cBar(75) },
          { t1:'점검', t2:'항목수', v:'8',  u:'건', c:DGR },
        ] as const)}
      </div>

      {/* ── R2C2~3 (colspan 2) : 점검 세부 현황 ── */}
      <div style={{ ...card, gridColumn:'span 2' }}>
        <DSLabel label="점검 세부 현황" />
        <div style={{ flex:1, minHeight:0, display:'flex', gap:14 }}>
          <div style={{ flex:1, display:'grid', gridTemplateRows:'repeat(3, 1fr)', gap:8 }}>
            {eduTracks5.map(item => {
              const c = cBar(item.val);
              const filled = Math.round(item.val / 10);
              return (
                <div key={item.label} style={{ ...sub14, padding:'8px 12px', display:'flex', flexDirection:'column', justifyContent:'space-between' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                    <div>
                      <span style={{ fontSize:18, fontWeight:700, color: pal.body }}>{item.label}</span>
                      {item.sub && <span style={{ fontSize:16, fontWeight:700, color:DGR, marginLeft:6 }}>{item.sub}</span>}
                    </div>
                    <span style={{ fontSize:36, fontWeight:900, color:c, lineHeight:1 }}>{item.val}<span style={{ fontSize:20 }}>%</span></span>
                  </div>
                  <div style={{ display:'flex', gap:4 }}>
                    {Array.from({ length:10 }, (_, i) => (
                      <motion.div key={i} initial={{ opacity:0, scaleY:0.3 }}
                        animate={{ opacity: i<filled ? 0.35+(i/9)*0.65 : 1, scaleY:1 }}
                        transition={{ duration:0.5, delay:i*0.04, ease:[0.22,1,0.36,1] }}
                        style={{ flex:1, height:14, borderRadius:4, background: i<filled ? c : pal.track, transformOrigin:'bottom' }}
                      />
                    ))}
                  </div>
                  <div style={{ display:'flex', justifyContent:'space-between' }}>
                    <span style={{ fontSize:15, fontWeight:700, color:DGR }}>목표 {item.target}</span>
                    <span style={{ fontSize:15, fontWeight:700, color:DGR }}>전일 {item.prev}</span>
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{ flex:'0 0 220px', display:'grid', gridTemplateColumns:'1fr 1fr', gridTemplateRows:'1fr 1fr', gap:8 }}>
            {eduStat5.map(item => {
              const filled = Math.round(item.pct / 10);
              return (
                <div key={item.l} style={{ ...sub14, padding:'8px 10px', display:'flex', flexDirection:'column', alignItems:'center', gap:6, overflow:'hidden' }}>
                  <div style={{ fontSize:16, fontWeight:700, color:DGR, flexShrink:0, lineHeight:1 }}>{item.l}</div>
                  <div style={{ flex:1, minHeight:0, display:'flex', flexDirection:'column-reverse', gap:5, width:'55%' }}>
                    {Array.from({ length:10 }, (_, i) => (
                      <motion.div key={i} initial={{ opacity:0, scaleX:0.3 }}
                        animate={{ opacity: i<filled ? 0.35+(i/9)*0.65 : 1, scaleX:1 }}
                        transition={{ duration:0.5, delay:i*0.04, ease:[0.22,1,0.36,1] }}
                        style={{ flex:1, borderRadius:4, background: i<filled ? item.c : pal.track, transformOrigin:'left' }}
                      />
                    ))}
                  </div>
                  <div style={{ fontSize:22, fontWeight:900, color:item.c, lineHeight:1, flexShrink:0 }}>{item.v}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── R2C4 : 종합 요약 ── */}
      <div style={card}>
        <DSLabel label="종합 요약" />
        <div style={{ flex:1, minHeight:0, display:'grid', gridTemplateColumns:'1fr 1fr', gridTemplateRows:'repeat(3, minmax(0,1fr))', gap:8 }}>
          {([
            { l:'설비 점검', n:100 }, { l:'SOP 점검', n:100 },
            { l:'ESD 점검',  n:75  }, { l:'5S 체크',  n:100 },
            { l:'전체 달성', n:93  }, { l:'금일 완료', n:83  },
          ] as const).map((item, idx) => {
            const c = cBar(item.n);
            const grade = item.n >= 90 ? '달성' : item.n >= 80 ? '주의' : '미달';
            return (
              <div key={item.l} style={{ background:`${c}12`, border:`1.5px solid ${c}35`, borderRadius:14, padding:'12px 14px', display:'flex', flexDirection:'column', justifyContent:'space-between', overflow:'hidden', minHeight:0 }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexShrink:0 }}>
                  <span style={{ fontSize:15, fontWeight:800, color: pal.body, lineHeight:1.25 }}>{item.l}</span>
                  <span style={{ display:'inline-block', padding:'4px 12px', borderRadius:999, fontSize:14, fontWeight:800, background:`${c}22`, color:c, lineHeight:1.2, flexShrink:0 }}>{grade}</span>
                </div>
                <div style={{ display:'flex', alignItems:'baseline', gap:3, flexShrink:0 }}>
                  <span style={{ fontSize:44, fontWeight:900, color:c, lineHeight:1 }}>{item.n}</span>
                  <span style={{ fontSize:20, fontWeight:700, color:c }}>%</span>
                </div>
                <div style={{ height:20, background:`${c}20`, borderRadius:999, overflow:'hidden', flexShrink:0 }}>
                  <div style={{ width: ready ? `${item.n}%` : '0%', transition: `width 1s cubic-bezier(0.22,1,0.36,1) ${idx*0.14}s`, height:'100%', background:`linear-gradient(90deg, ${c}99 0%, ${c} 100%)`, borderRadius:999, display:'flex', alignItems:'center', justifyContent:'flex-end', paddingRight:7 }}>
                    {item.n >= 20 && <span style={{ fontSize:11, fontWeight:900, color:'#fff', lineHeight:1 }}>{item.n}%</span>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}

// Screen 6 — 다기능 이력 카드 (Skills Matrix)
const DASH_WORKERS = (() => {
  let s = 42;
  const rng = () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
  const rr = (min: number, max: number) => Math.round(min + rng() * (max - min));
  const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
  const pick = <T,>(a: T[]) => a[Math.floor(rng() * a.length)];
  const surnames = ['김','이','박','최','정','강','조','윤','장','임','한','오','서','신','권','황','안','송','류','전','홍','고','문','양','손','배','백','허','유','남'];
  const chars = ['민','수','지','현','우','준','영','호','진','서','은','연','혁','석','철','도','원','태','경','성'];
  const lines = Array.from({ length: 10 }, (_, i) => `라인${String(i + 1).padStart(2, '0')}`);
  const allBadges = ['조립','점검','용접','도장','QC','물류','설비','검사'];
  const lvPool = [
    ...Array(20).fill(1), ...Array(40).fill(2), ...Array(60).fill(3),
    ...Array(50).fill(4), ...Array(30).fill(5),
  ] as number[];
  for (let i = lvPool.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); [lvPool[i], lvPool[j]] = [lvPool[j], lvPool[i]]; }

  return lvPool.map((curLv, i) => {
    const tgtLv = Math.min(curLv + (rng() < 0.25 ? 0 : rng() < 0.6 ? 1 : 2), 5);
    const base = curLv * 16 + rr(-8, 8);
    const tBase = clamp(base + rr(8, 22), 50, 100);
    const skills = [
      { l: '일반 공정', cur: clamp(base + rr(-3, 12), 12, 100), tgt: clamp(tBase + rr(0, 8), 50, 100), c: '#3B82F6' },
      { l: '주요 공정', cur: clamp(base + rr(-12, 5), 10, 100), tgt: clamp(tBase + rr(-4, 5), 50, 100), c: DG },
      { l: '설비 점검', cur: clamp(base + rr(-8, 8), 10, 100), tgt: clamp(tBase + rr(-3, 7), 50, 100), c: '#1E3A5F' },
      { l: '품질 관리', cur: clamp(base + rr(-10, 6), 10, 100), tgt: clamp(tBase + rr(-4, 4), 50, 100), c: '#E97730' },
    ];
    const nB = curLv <= 1 ? 1 : rr(1, Math.min(curLv, 4));
    const badges: string[] = curLv <= 1 ? ['신입'] : [];
    while (badges.length < nB) { const b = pick(allBadges); if (!badges.includes(b)) badges.push(b); }
    const cr = skills.reduce((a, sk) => a + sk.cur, 0);
    const tr = skills.reduce((a, sk) => a + sk.tgt, 0);
    const ov = tr > 0 ? Math.round((cr / tr) * 100) : 0;
    const comment = ov >= 90 ? '목표 달성 우수' : ov >= 80 ? '목표까지 소폭 남음' : ov >= 65 ? '주요공정 추가 교육 필요' : '집중 육성 대상';
    return {
      name: `${pick(surnames)}*${pick(chars)}`, id: String(i + 1).padStart(5, '0'),
      line: lines[i % 10], date: `${rr(1990, 2024)}.${String(rr(1, 12)).padStart(2, '0')}.${String(rr(1, 28)).padStart(2, '0')}`,
      curLv, tgtLv, badges, skills, comment,
    };
  });
})();
const lvColor = (lv: number) => lv >= 4 ? DG : lv >= 2 ? DA : DR;

type Ds6Status = 'ok' | 'growth' | 'train';
function ds6WorkerStatus(w: (typeof DASH_WORKERS)[0]): Ds6Status {
  if (w.curLv >= w.tgtLv) return 'ok';
  const gap = w.tgtLv - w.curLv;
  const minRatio = Math.min(...w.skills.map(s => (s.tgt > 0 ? s.cur / s.tgt : 1)));
  if (gap >= 2 || minRatio < 0.5) return 'train';
  return 'growth';
}

/**
 * DashScreen6 — 다기능 숙련도 관리 (DashScreen5 스타일 4×2 그리드)
 */
function DashScreen6({ ko }: { ko: boolean }) {
  const [ready, setReady] = useState(false);
  useEffect(() => { const t = setTimeout(() => setReady(true), 250); return () => clearTimeout(t); }, []);
  const pal = useDashPalette();
  const N = DASH_WORKERS.length;
  const workers = DASH_WORKERS.map(w => {
    const cr = w.skills.reduce((a, s) => a + s.cur, 0);
    const tr = w.skills.reduce((a, s) => a + s.tgt, 0);
    const overall = tr > 0 ? Math.round((cr / tr) * 100) : 0;
    const dept = w.line.replace('라인', 'CAC');
    return { w, overall, dept };
  });
  /** 공정별 달성률: (Σ cur)/(Σ tgt)×100. 평균 cur/at 표시용 ac·at는 인원 평균(반올림)과 별개로 pct는 합산 비율과 일치 */
  const skillAvg = [0, 1, 2, 3].map(si => {
    const sumC = DASH_WORKERS.reduce((a, w) => a + w.skills[si].cur, 0);
    const sumT = DASH_WORKERS.reduce((a, w) => a + w.skills[si].tgt, 0);
    const pct = sumT > 0 ? Math.round((sumC / sumT) * 100) : 0;
    const ac = Math.round(sumC / N);
    const at = Math.round(sumT / N);
    return { ac, at, pct };
  });
  const avgOv = Math.round(workers.reduce((a, x) => a + x.overall, 0) / N);
  const nExcel = workers.filter(x => x.overall >= 90).length;
  const nGood = workers.filter(x => x.overall >= 80 && x.overall < 90).length;
  const nWarn = workers.filter(x => x.overall >= 65 && x.overall < 80).length;
  const nDanger = workers.filter(x => x.overall < 65).length;
  const goalR = Math.round((nExcel + nGood) / N * 100);
  const lvCounts = [1, 2, 3, 4, 5].map(lv => DASH_WORKERS.filter(w => w.curLv === lv).length);
  const avgLv = (DASH_WORKERS.reduce((a, w) => a + w.curLv, 0) / N).toFixed(1);
  const skillNames = ko ? ['일반 공정', '주요 공정', '설비 점검', '품질 관리'] : ['General', 'Key Process', 'Equipment', 'Quality'];
  const skillShort = ko ? ['일반', '주요', '설비', '품질'] : ['Gen', 'Key', 'Eq', 'QC'];
  const sparkTrends = [
    { l: skillShort[0], id: 'ds6sa', v: String(skillAvg[0].pct), u: '%', c: cBar(skillAvg[0].pct), pts: [78, 80, 82, 84, skillAvg[0].pct] },
    { l: skillShort[1], id: 'ds6sb', v: String(skillAvg[1].pct), u: '%', c: cBar(skillAvg[1].pct), pts: [70, 73, 75, 78, skillAvg[1].pct] },
    { l: skillShort[2], id: 'ds6sc', v: String(skillAvg[2].pct), u: '%', c: cBar(skillAvg[2].pct), pts: [72, 74, 76, 78, skillAvg[2].pct] },
    { l: skillShort[3], id: 'ds6sd', v: String(skillAvg[3].pct), u: '%', c: cBar(skillAvg[3].pct), pts: [68, 71, 73, 76, skillAvg[3].pct] },
  ] as const;
  const sorted = [...workers].sort((a, b) => a.overall - b.overall);

  const card: React.CSSProperties = {
    background: pal.cardBg, boxShadow: pal.cardShadow, borderRadius: DC_R,
    padding: '14px 18px', display: 'flex', flexDirection: 'column', overflow: 'hidden', minHeight: 0,
  };
  const sub14: React.CSSProperties = { background: pal.subBg, borderRadius: 14 };

  const badgeHdr6 = (title: string, badge: string) => (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:8, flexShrink:0 }}>
      <div style={{ display:'flex', alignItems:'center', gap:8 }}>
        <span style={{ width:5, height:22, borderRadius:4, background:DR, flexShrink:0 }} />
        <span style={{ fontSize:22, fontWeight:800, color: pal.labelHeading, letterSpacing:'0.03em' }}>{title}</span>
      </div>
      <span style={{ display:'inline-flex', background:`${DR}12`, border:`1px solid ${DR}40`, borderRadius:999, padding:'4px 11px', fontSize:13, fontWeight:700, color:DR, lineHeight:1 }}>
        {badge}
      </span>
    </div>
  );

  const barChart6 = (bars: readonly {pct:number; label?:string; c?:string}[], xLabels: readonly [string,string][]) => (
    <div style={{ flex:1, minHeight:0, display:'flex', flexDirection:'column' }}>
      <div style={{ flex:1, minHeight:0, display:'flex', gap:8, alignItems:'flex-end' }}>
        {bars.map((item, idx) => {
          const c = item.c ?? cBar(item.pct);
          return (
            <div key={idx} style={{ flex:1, height:'100%', display:'flex', flexDirection:'column', alignItems:'center', minWidth:0 }}>
              <div style={{ flex:1, width:'78%', position:'relative', display:'flex', alignItems:'flex-end' }}>
                <div style={{ position:'absolute', bottom:0, left:0, right:0, top:0, background:`${c}28`, borderRadius:10 }} />
                <motion.div initial={{ height:0 }} animate={{ height:`${item.pct}%` }}
                  transition={{ duration:1.1, delay:idx*0.12+0.2, ease:[0.22,1,0.36,1] }}
                  style={{ width:'100%', background:c, borderRadius:10, position:'relative', display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden' }}>
                  <span style={{ fontSize:20, fontWeight:900, color:'#fff', letterSpacing:'-0.01em', lineHeight:1 }}>{item.label ?? `${item.pct}%`}</span>
                </motion.div>
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ display:'flex', gap:10, flexShrink:0, marginTop:6 }}>
        {xLabels.map((l, idx) => (
          <div key={idx} style={{ flex:1, textAlign:'center', lineHeight:1.25 }}>
            <div style={{ fontSize:14, fontWeight:700, color: pal.labelHeading }}>{l[0]}</div>
            {l[1] && <div style={{ fontSize:14, fontWeight:700, color: pal.labelHeading }}>{l[1]}</div>}
          </div>
        ))}
      </div>
    </div>
  );

  const kpiGrid6 = (items: readonly {t1:string; t2:string; v:string; u:string; c:string}[]) => (
    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginTop:8, flexShrink:0 }}>
      {items.map(item => (
        <div key={`${item.t1}${item.t2}`} style={{ background:`${item.c}12`, border:`1.5px solid ${item.c}35`, borderRadius:12, padding:'8px 12px', display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ display:'flex', flexDirection:'column', lineHeight:1.2, flexShrink:0 }}>
            <span style={{ fontSize:17, fontWeight:700, color: pal.body }}>{item.t1}</span>
            {item.t2 && <span style={{ fontSize:17, fontWeight:700, color: pal.body }}>{item.t2}</span>}
          </div>
          <div style={{ flex:1, textAlign:'right' }}>
            <span style={{ fontSize:32, fontWeight:900, color:item.c }}>{item.v}</span>
            <span style={{ fontSize:15, fontWeight:700, color:item.c, marginLeft:3 }}>{item.u}</span>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr 1fr', gridTemplateRows:'minmax(0,1fr) minmax(0,1fr)', gap:16, height:'100%', minHeight:0, overflow:'hidden' }}>

      {/* ── R1C1 : 숙련도 종합 ── */}
      <div style={card}>
        {badgeHdr6(ko ? '숙련도 종합' : 'Skill overview', ko ? '금일 기준' : 'Today')}
        {barChart6(
          skillAvg.map(s => ({ pct: s.pct })),
          skillShort.map(l => [l, ''] as [string, string]),
        )}
        {kpiGrid6([
          { t1: ko ? '총' : 'Tot', t2: ko ? '인원' : 'Head', v: String(N), u: ko ? '명' : '', c: pal.labelHeading },
          { t1: ko ? '평균' : 'Avg', t2: ko ? '달성률' : 'Rate', v: String(avgOv), u: '%', c: cBar(avgOv) },
          { t1: ko ? '우수' : 'Top', t2: ko ? '인원' : '', v: String(nExcel), u: ko ? '명' : '', c: DG },
          { t1: ko ? '위험' : 'Risk', t2: ko ? '인원' : '', v: String(nDanger), u: ko ? '명' : '', c: DR },
        ])}
      </div>

      {/* ── R1C2 : 인원 상태 현황 ── */}
      <div style={card}>
        <DSLabel label={ko ? '인원 상태 현황' : 'Status overview'} />
        <div style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', gap: 8 }}>
          {([
            { label: ko ? '우수 (90%↑)' : 'Excel', cnt: nExcel, pct: Math.round(nExcel / N * 100), frac: `${nExcel}/${N}`, c: '#3B82F6', grade: ko ? '우수' : 'Top' },
            { label: ko ? '양호 (80%↑)' : 'Good', cnt: nGood, pct: Math.round(nGood / N * 100), frac: `${nGood}/${N}`, c: DG, grade: ko ? '양호' : 'Good' },
            { label: ko ? '주의 (65%↑)' : 'Warn', cnt: nWarn, pct: Math.round(nWarn / N * 100), frac: `${nWarn}/${N}`, c: DA, grade: ko ? '주의' : 'Warn' },
            { label: ko ? '위험 (65%↓)' : 'Risk', cnt: nDanger, pct: Math.round(nDanger / N * 100), frac: `${nDanger}/${N}`, c: DR, grade: ko ? '위험' : 'Risk' },
          ] as const).map((item, idx) => (
            <div key={item.label} style={{
              background: `${item.c}12`, border: `1.5px solid ${item.c}35`, borderRadius: 14,
              padding: '12px 14px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
              overflow: 'hidden', minHeight: 0,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexShrink: 0 }}>
                <span style={{ fontSize: 15, fontWeight: 800, color: pal.body, lineHeight: 1.25 }}>{item.label}</span>
                <span style={{ display: 'inline-block', padding: '4px 12px', borderRadius: 999, fontSize: 14, fontWeight: 800, background: `${item.c}22`, color: item.c, lineHeight: 1.2, flexShrink: 0 }}>
                  {item.grade}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 3, flexShrink: 0 }}>
                <span style={{ fontSize: 44, fontWeight: 900, color: item.c, lineHeight: 1 }}>{item.pct}</span>
                <span style={{ fontSize: 20, fontWeight: 700, color: item.c }}>%</span>
              </div>
              <div style={{ height: 20, background: `${item.c}20`, borderRadius: 999, overflow: 'hidden', flexShrink: 0 }}>
                <div style={{
                    width: ready ? `${item.pct}%` : '0%', transition: `width 1s cubic-bezier(0.22,1,0.36,1) ${idx * 0.14}s`,
                    height: '100%', background: `linear-gradient(90deg, ${item.c}99 0%, ${item.c} 100%)`,
                    borderRadius: 999, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: 7,
                  }}>
                  {item.pct >= 20 && (
                    <span style={{ fontSize: 11, fontWeight: 900, color: '#fff', lineHeight: 1 }}>{item.pct}%</span>
                  )}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
                <span style={{ display: 'inline-flex', alignItems: 'baseline', gap: 5, fontSize: 16, fontWeight: 700, color: pal.labelHeading, lineHeight: 1 }}>{ko ? '인원' : 'Count'} <span style={{ fontSize: 24, fontWeight: 900, color: item.c }}>{item.cnt}</span>{ko ? '명' : ''}</span>
                <span style={{ display: 'inline-block', padding: '4px 12px', borderRadius: 999, fontSize: 14, fontWeight: 800, background: `${item.c}18`, border: `1px solid ${item.c}30`, color: item.c, lineHeight: 1.2 }}>{item.frac}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── R1C3 : 공정별 달성 현황 ── */}
      <div style={card}>
        <DSLabel label={ko ? '공정별 달성 현황' : 'Skill achievement'} />
        <div style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateRows: 'repeat(4, 1fr)', gap: 8 }}>
          {skillNames.map((name, si) => {
            const c = cBar(skillAvg[si].pct);
            const filled = Math.round(skillAvg[si].pct / 10);
            return (
              <div key={name} style={{ ...sub14, padding: '8px 12px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 18, fontWeight: 700, color: pal.body }}>{name}</span>
                  <span style={{ fontSize: 36, fontWeight: 900, color: c, lineHeight: 1 }}>{skillAvg[si].pct}<span style={{ fontSize: 20 }}>%</span></span>
                </div>
                <div style={{ display: 'flex', gap: 4 }}>
                  {Array.from({ length: 10 }, (_, i) => (
                    <motion.div key={i} initial={{ opacity: 0, scaleY: 0.4 }}
                      animate={{ opacity: i < filled ? 0.35 + (i / 9) * 0.65 : 1, scaleY: 1 }}
                      transition={{ duration: 0.55, delay: i * 0.045, ease: [0.22, 1, 0.36, 1] }}
                      style={{ flex: 1, height: 14, borderRadius: 4, background: i < filled ? c : pal.track, transformOrigin: 'bottom' }}
                    />
                  ))}
                </div>
                <div style={{ fontSize: 16, fontWeight: 700, color: DGR }}>{ko ? '평균' : 'Avg'} {skillAvg[si].ac}/{skillAvg[si].at}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── R1C4 : 성장 추이 ── */}
      <div style={card}>
        <DSLabel label={ko ? '성장 추이' : 'Growth trend'} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, flexShrink: 0 }}>
          {([
            { label: ko ? '전체평균' : 'Avg', v: String(avgOv), u: '%', c: cBar(avgOv) },
            { label: ko ? '달성률' : 'Goal', v: String(goalR), u: '%', c: cBar(goalR) },
          ] as const).map(item => (
            <div key={item.label} style={{ ...sub14, padding: '8px 12px', textAlign: 'center' }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: DGR }}>{item.label}</div>
              <div style={{ fontSize: 36, fontWeight: 900, color: item.c, lineHeight: 1.1 }}>
                {item.v}<span style={{ fontSize: 20 }}>{item.u}</span>
              </div>
            </div>
          ))}
        </div>
        <div style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', gap: 8, marginTop: 8 }}>
          {sparkTrends.map(item => {
            const { line, area, xs, ys } = mkSpark(item.pts as unknown as number[]);
            return (
              <div key={item.id} style={{ ...sub14, padding: '0 12px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <div style={{ flexShrink: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 8, paddingBottom: 4 }}>
                  <span style={{ fontSize: 15, fontWeight: 700, color: DGR, lineHeight: 1 }}>{item.l}</span>
                  <span style={{ fontSize: 22, fontWeight: 900, color: item.c, lineHeight: 1 }}>
                    {item.v}<span style={{ fontSize: 13, fontWeight: 600, marginLeft: 2 }}>{item.u}</span>
                  </span>
                </div>
                <div style={{ flex: '1 1 0', minHeight: 0 }}>
                  <svg width="100%" height="100%" viewBox="0 0 110 56" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id={item.id} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={item.c} stopOpacity="0.42" />
                        <stop offset="100%" stopColor={item.c} stopOpacity="0.02" />
                      </linearGradient>
                    </defs>
                    <path d={area} fill={`url(#${item.id})`} />
                    <path d={line} fill="none" stroke={item.c} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    {xs.map((x, i) => (
                      <g key={i}>
                        <text x={x} y={ys[i] - 5} textAnchor="middle" fontSize="9" fill={item.c} fontWeight="800">{item.pts[i]}</text>
                        <circle cx={x} cy={ys[i]} r="3" fill={item.c} />
                      </g>
                    ))}
                  </svg>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── R2C1 : 레벨 분포 ── */}
      <div style={card}>
        {badgeHdr6(ko ? '레벨 분포' : 'Level dist.', ko ? '현재 기준' : 'Current')}
        {barChart6(
          lvCounts.map((cnt, i) => ({ pct: Math.round((cnt / N) * 100), label: String(cnt), c: lvColor(i + 1) })),
          [1, 2, 3, 4, 5].map(lv => [`Lv.${lv}`, ''] as [string, string]),
        )}
        {kpiGrid6([
          { t1: ko ? '평균' : 'Avg', t2: ko ? '레벨' : 'Lv', v: avgLv, u: '', c: cBar(Number(avgLv) / 5 * 100) },
          { t1: ko ? '신규' : 'New', t2: 'Lv.1', v: String(lvCounts[0]), u: ko ? '명' : '', c: DR },
          { t1: ko ? '중급' : 'Mid', t2: 'Lv.3', v: String(lvCounts[2]), u: ko ? '명' : '', c: DA },
          { t1: ko ? '고급' : 'Top', t2: 'Lv.5', v: String(lvCounts[4]), u: ko ? '명' : '', c: DG },
        ])}
      </div>

      {/* ── R2C2~3 (colspan 2) : 관리자 인사이트 ── */}
      <div style={{ ...card, gridColumn: 'span 2' }}>
        <DSLabel label={ko ? '관리자 인사이트' : 'Manager insights'} />
        {(() => {
          const critW = workers.filter(x => x.overall < 65);
          const lowSkW = DASH_WORKERS.filter(w => w.skills.some(s => s.tgt > 0 && Math.round((s.cur / s.tgt) * 100) < 50));
          const wIdx = skillAvg.reduce((mi, s, i, a) => s.pct < a[mi].pct ? i : mi, 0);
          const lvGapW = DASH_WORKERS.filter(w => w.tgtLv - w.curLv >= 2);
          const newW = DASH_WORKERS.filter(w => w.curLv <= 1);
          const topW = workers.filter(x => x.overall >= 90);
          const promoW = DASH_WORKERS.filter(w => {
            const cr = w.skills.reduce((a, s) => a + s.cur, 0);
            const tr = w.skills.reduce((a, s) => a + s.tgt, 0);
            return tr > 0 && Math.round((cr / tr) * 100) >= 85 && w.curLv < w.tgtLv;
          });

          const tiles: { title: string; val: string; sub: string; c: string }[] = [
            { title: ko ? '위험 인원' : 'At risk', val: String(critW.length), sub: ko ? '65% 미만' : '<65%', c: DR },
            { title: ko ? '교육 필요' : 'Train need', val: String(lowSkW.length), sub: ko ? '공정 50%↓' : 'Skill<50%', c: DR },
            { title: ko ? '레벨 갭' : 'Lv gap', val: String(lvGapW.length), sub: ko ? '2단계↑ 차이' : '2+ behind', c: DA },
            { title: ko ? '취약 공정' : 'Weak', val: `${skillAvg[wIdx].pct}%`, sub: skillNames[wIdx], c: DA },
            { title: ko ? '신규 멘토' : 'New', val: String(newW.length), sub: ko ? 'Lv.1 인원' : 'Lv.1', c: '#3B82F6' },
            { title: ko ? '승급 후보' : 'Promo', val: String(promoW.length), sub: ko ? '85%↑ 달성' : '≥85%', c: '#6366F1' },
            { title: ko ? '안정 구간' : 'Stable', val: String(topW.length), sub: ko ? `전체 ${Math.round(topW.length / N * 100)}%` : `${Math.round(topW.length / N * 100)}%`, c: DG },
            { title: ko ? '추천 액션' : 'Action', val: '3', sub: ko ? '교육·멘토·확장' : 'Train·Mentor', c: DGR },
          ];

          return (
            <div style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gridTemplateRows: '1fr 1fr', gap: 8 }}>
              {tiles.map((t, idx) => {
                const barPct = (() => {
                  if (t.val.includes('%')) {
                    const m = t.val.match(/(\d+)/);
                    return m ? Math.min(100, parseInt(m[1], 10)) : 0;
                  }
                  const n = parseInt(t.val.replace(/[^\d]/g, ''), 10) || 0;
                  return Math.min(100, Math.round((n / N) * 100));
                })();
                return (
                  <motion.div key={idx}
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, delay: idx * 0.05, ease: [0.22, 1, 0.36, 1] }}
                    style={{
                      background: `${t.c}12`, border: `1.5px solid ${t.c}35`, borderRadius: 14,
                      padding: '12px 14px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                      overflow: 'hidden', minHeight: 0,
                    }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexShrink: 0 }}>
                      <span style={{ fontSize: 15, fontWeight: 800, color: pal.body, lineHeight: 1.25 }}>{t.title}</span>
                      <span style={{ display: 'inline-block', padding: '4px 12px', borderRadius: 999, fontSize: 14, fontWeight: 800, background: `${t.c}22`, color: t.c, lineHeight: 1.2, flexShrink: 0 }}>
                        {t.sub}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 3, flexShrink: 0 }}>
                      <span style={{ fontSize: 44, fontWeight: 900, color: t.c, lineHeight: 1 }}>{t.val}</span>
                      {!t.val.includes('%') && <span style={{ fontSize: 20, fontWeight: 700, color: t.c }}>{ko ? '명' : ''}</span>}
                    </div>
                    <div style={{ height: 20, background: `${t.c}20`, borderRadius: 999, overflow: 'hidden', flexShrink: 0 }}>
                      <div style={{
                          width: ready ? `${barPct}%` : '0%', transition: `width 1s cubic-bezier(0.22,1,0.36,1) ${idx * 0.14}s`,
                          height: '100%', background: `linear-gradient(90deg, ${t.c}99 0%, ${t.c} 100%)`,
                          borderRadius: 999, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: 7,
                        }}>
                        {barPct >= 20 && (
                          <span style={{ fontSize: 11, fontWeight: 900, color: '#fff', lineHeight: 1 }}>{barPct}%</span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          );
        })()}
      </div>

      {/* ── R2C4 : 종합 요약 ── */}
      <div style={card}>
        <DSLabel label={ko ? '종합 요약' : 'Summary'} />
        <div style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: 'repeat(3, minmax(0,1fr))', gap: 8 }}>
          {([
            { l: skillNames[0], n: skillAvg[0].pct },
            { l: skillNames[1], n: skillAvg[1].pct },
            { l: skillNames[2], n: skillAvg[2].pct },
            { l: skillNames[3], n: skillAvg[3].pct },
            { l: ko ? '전체 달성' : 'Overall', n: avgOv },
            { l: ko ? '목표 달성률' : 'Goal rate', n: goalR },
          ] as const).map((item, idx) => {
            const c = cBar(item.n);
            const grade = item.n >= 90 ? (ko ? '달성' : 'OK') : item.n >= 80 ? (ko ? '양호' : 'Good') : item.n >= 65 ? (ko ? '주의' : 'Warn') : (ko ? '미달' : 'Low');
            return (
              <div key={item.l} style={{
                background: `${c}12`, border: `1.5px solid ${c}35`, borderRadius: 14,
                padding: '12px 14px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                overflow: 'hidden', minHeight: 0,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexShrink: 0 }}>
                  <span style={{ fontSize: 15, fontWeight: 800, color: pal.body, lineHeight: 1.25 }}>{item.l}</span>
                  <span style={{ display: 'inline-block', padding: '4px 12px', borderRadius: 999, fontSize: 14, fontWeight: 800, background: `${c}22`, color: c, lineHeight: 1.2, flexShrink: 0 }}>
                    {grade}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 3, flexShrink: 0 }}>
                  <span style={{ fontSize: 44, fontWeight: 900, color: c, lineHeight: 1 }}>{item.n}</span>
                  <span style={{ fontSize: 20, fontWeight: 700, color: c }}>%</span>
                </div>
                <div style={{ height: 20, background: `${c}20`, borderRadius: 999, overflow: 'hidden', flexShrink: 0 }}>
                  <div style={{
                      width: ready ? `${item.n}%` : '0%', transition: `width 1s cubic-bezier(0.22,1,0.36,1) ${idx * 0.14}s`,
                      height: '100%', background: `linear-gradient(90deg, ${c}99 0%, ${c} 100%)`,
                      borderRadius: 999, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: 7,
                    }}>
                    {item.n >= 20 && (
                      <span style={{ fontSize: 11, fontWeight: 900, color: '#fff', lineHeight: 1 }}>{item.n}%</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}

/**
 * DashScreen6_1 — 다기능 숙련도 관리 (DashScreen6 복사본)
 */
const DS61_STATUS = (ov: number) => {
  if (ov >= 90) return { lKo: '우수', lEn: 'Top', c: '#3B82F6' };
  if (ov >= 80) return { lKo: '양호', lEn: 'Good', c: DG };
  if (ov >= 65) return { lKo: '주의', lEn: 'Warn', c: DA };
  return { lKo: '위험', lEn: 'Risk', c: DR };
};
const DS61_BSKNAME: Record<string, string> = { '일반 공정': '프레스', '주요 공정': '조립', '설비 점검': '설비', '품질 관리': '품질' };

/** 전체 인원 평균 달성률 — 개인 카드의 평균대비 편차 계산용 */
const DS61_COHORT_AVG_OVERALL = Math.round(
  DASH_WORKERS.reduce((acc, w) => {
    const cr = w.skills.reduce((a, s) => a + s.cur, 0);
    const tr = w.skills.reduce((a, s) => a + s.tgt, 0);
    return acc + (tr > 0 ? (cr / tr) * 100 : 0);
  }, 0) / DASH_WORKERS.length,
);
/** 대시보드 기준 목표선(%) — 목표 대비 편차 표시용 */
const DS61_POLICY_GOAL_PCT = 60;

const DS61_CARDS = (() => {
  const ws = DASH_WORKERS.map(w => {
    const cr = w.skills.reduce((a, s) => a + s.cur, 0);
    const tr = w.skills.reduce((a, s) => a + s.tgt, 0);
    const overall = tr > 0 ? Math.round((cr / tr) * 100) : 0;
    const dept = w.line.replace('라인', 'CAC');
    const bestSk = w.skills.reduce((best, s) => s.cur > best.cur ? s : best, w.skills[0]);
    const diff = overall - DS61_COHORT_AVG_OVERALL;
    const st = DS61_STATUS(overall);
    const goalDiff = overall - DS61_POLICY_GOAL_PCT;
    const bPct = bestSk.tgt > 0 ? Math.min(Math.round((bestSk.cur / bestSk.tgt) * 100), 100) : 0;
    const skPcts = w.skills.map(sk => ({ ...sk, pct: sk.tgt > 0 ? Math.min(Math.round((sk.cur / sk.tgt) * 100), 100) : 0 }));
    return { w, overall, dept, bestSk, diff, st, goalDiff, bPct, skPcts };
  });
  const used = new Set<string>();
  const add = (arr: typeof ws, n: number) => {
    const out: typeof ws = [];
    for (const w of arr) { if (!used.has(w.w.id) && out.length < n) { used.add(w.w.id); out.push(w); } }
    return out;
  };
  const result = [
    ...add(ws.filter(x => x.overall < 65), 2),
    ...add(ws.filter(x => x.w.skills.some(s => s.tgt > 0 && Math.round((s.cur / s.tgt) * 100) < 50)), 2),
    ...add(ws.filter(x => x.w.tgtLv - x.w.curLv >= 2), 1),
    ...add(ws.filter(x => x.w.curLv <= 1), 1),
    ...add(ws.filter(x => { const c = x.w.skills.reduce((a, s) => a + s.cur, 0); const t = x.w.skills.reduce((a, s) => a + s.tgt, 0); return t > 0 && Math.round((c / t) * 100) >= 85 && x.w.curLv < x.w.tgtLv; }), 2),
    ...add(ws.filter(x => x.overall >= 90), 2),
    ...add(ws.filter(x => x.overall >= 65 && x.overall < 90), 2),
  ];
  if (result.length < 12) {
    const rest = ws.filter(x => !used.has(x.w.id)).sort((a, b) => b.overall - a.overall);
    result.push(...rest.slice(0, 12 - result.length));
  }
  return result.slice(0, 12);
})();

const DS61_GAUGE_CACHE = DS61_CARDS.map(x => {
  const N = 20, r1 = 30, r2 = 24, cx = 35, cy = 35;
  const filledN = Math.round(x.overall / 100 * N);
  return Array.from({ length: N }, (_, i) => {
    const a = (i / N) * Math.PI * 2 - Math.PI / 2;
    const cos = Math.cos(a), sin = Math.sin(a);
    return { x1: cx + cos * r1, y1: cy + sin * r1, x2: cx + cos * r2, y2: cy + sin * r2, filled: i < filledN, op: i < filledN ? 0.5 + ((i + 1) / N) * 0.5 : 1 };
  });
});

function DashScreen6_1({ ko }: { ko: boolean }) {
  const [ready, setReady] = useState(false);
  useEffect(() => { const t = setTimeout(() => setReady(true), 350); return () => clearTimeout(t); }, []);
  const pal = useDashPalette();

  return (
    <div style={{
      height: '100%', overflow: 'hidden',
      display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gridTemplateRows: 'repeat(3, 1fr)', gap: 14,
    }}>
      {DS61_CARDS.map((x, idx) => {
          const st = { label: ko ? x.st.lKo : x.st.lEn, c: x.st.c };
          const { goalDiff } = x;
          const diffC = goalDiff >= 0 ? DG : DR;
          const gauge = DS61_GAUGE_CACHE[idx];
          return (
            <div key={x.w.id}
              style={{
                background: pal.cardBg, boxShadow: pal.cardShadow, borderRadius: DC_R,
                padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: 8, overflow: 'hidden', minHeight: 0,
                opacity: ready ? 1 : 0, transform: ready ? 'translateY(0)' : 'translateY(12px)',
                transition: `opacity 0.4s cubic-bezier(0.22,1,0.36,1) ${idx * 0.03}s, transform 0.4s cubic-bezier(0.22,1,0.36,1) ${idx * 0.03}s`,
              }}>
              {/* Header: Avatar + Info + Score */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, flexShrink: 0 }}>
                <div style={{
                  width: 62, height: 62, borderRadius: 12, flexShrink: 0,
                  background: `${st.c}12`, border: `1.5px solid ${st.c}35`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 22, fontWeight: 800, color: st.c,
                }}>{x.w.name.charAt(0)}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 17, fontWeight: 800, color: pal.body }}>{x.w.name}</span>
                    <span style={{ padding: '4px 12px', borderRadius: 999, fontSize: 14, fontWeight: 800, background: `${st.c}22`, color: st.c, lineHeight: 1.2 }}>{st.label}</span>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: pal.labelHeading, marginTop: 2, lineHeight: 1.3 }}>
                    {x.dept} · {ko ? '사번' : 'ID'} {x.w.id}
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: DGR, lineHeight: 1.3 }}>
                    {ko ? '입사일' : 'Hired'} {x.w.date}
                  </div>
                </div>
                <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                  <div style={{ position: 'relative', width: 70, height: 70 }}>
                    <svg width="70" height="70" viewBox="0 0 70 70">
                      {gauge.map((g, i) => (
                        <line key={i} x1={g.x1} y1={g.y1} x2={g.x2} y2={g.y2}
                          stroke={g.filled ? st.c : `${st.c}20`}
                          strokeWidth={2.2} strokeLinecap="round" opacity={g.op}
                        />
                      ))}
                      <circle cx="35" cy="35" r="22" fill="none" stroke={`${st.c}15`} strokeWidth="0.5" />
                    </svg>
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontSize: 8, fontWeight: 700, color: pal.labelHeading, lineHeight: 1 }}>{ko ? '숙련도' : 'Score'}</span>
                      <span style={{ fontSize: 18, fontWeight: 900, color: st.c, lineHeight: 1, marginTop: 1 }}>{x.overall}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Lv + Best Skill */}
              <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                <div style={{ flex: 1, background: `${st.c}12`, border: `1.5px solid ${st.c}35`, borderRadius: 10, padding: '6px 10px', display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: pal.labelHeading }}>{ko ? '현재 레벨' : 'Current Lv'}</span>
                    <span style={{ fontSize: 16, fontWeight: 900, color: st.c, lineHeight: 1 }}>Lv.{x.w.curLv}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 3, background: `${st.c}18`, borderRadius: 5, padding: 3, border: `1.5px solid ${st.c}30` }}>
                    {Array.from({ length: 10 }, (_, i) => {
                      const filled = i < x.w.curLv * 2;
                      return (
                        <div key={i} style={{
                          flex: 1, height: 10, borderRadius: 3,
                          background: filled ? st.c : `${st.c}30`,
                          opacity: filled ? 0.55 + ((i + 1) / 10) * 0.45 : 1,
                        }} />
                      );
                    })}
                  </div>
                  <div style={{ fontSize: 10, fontWeight: 700, color: pal.body }}>{ko ? '목표' : 'Tgt'} Lv.{x.w.tgtLv}</div>
                </div>
                <div style={{ flex: 1, background: `${st.c}12`, border: `1.5px solid ${st.c}35`, borderRadius: 10, padding: '6px 10px', display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: pal.labelHeading }}>{ko ? '주력 공정' : 'Best Skill'}</span>
                    <span style={{ fontSize: 14, fontWeight: 900, color: st.c, lineHeight: 1 }}>{ko ? (DS61_BSKNAME[x.bestSk.l] ?? x.bestSk.l) : x.bestSk.l}</span>
                  </div>
                  {(() => {
                    const bPct = x.bPct;
                    const filled = Math.round(bPct / 10);
                    return (
                      <>
                        <div style={{ display: 'flex', gap: 3, background: `${st.c}18`, borderRadius: 5, padding: 3, border: `1.5px solid ${st.c}30` }}>
                          {Array.from({ length: 10 }, (_, i) => (
                            <div key={i} style={{
                              flex: 1, height: 10, borderRadius: 3,
                              background: i < filled ? st.c : `${st.c}30`,
                              opacity: i < filled ? 0.55 + ((i + 1) / 10) * 0.45 : 1,
                            }} />
                          ))}
                        </div>
                        <div style={{ fontSize: 10, fontWeight: 700, color: pal.body }}>{x.bestSk.cur} / {x.bestSk.tgt} ({bPct}%)</div>
                      </>
                    );
                  })()}
                </div>
              </div>

              {/* Skill Bars (4 skills: 2 columns) */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 10px', flex: 1, minHeight: 0, alignContent: 'center' }}>
                {x.skPcts.map((sk, si) => {
                  const { pct } = sk;
                  const c = cBar(pct);
                  return (
                    <div key={si}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                        <span style={{ fontSize: 12, fontWeight: 700, color: pal.body }}>{sk.l}</span>
                        <span style={{ fontSize: 12, fontWeight: 800, color: c }}>{sk.cur}/{sk.tgt}</span>
                      </div>
                      <div style={{ height: 12, background: `${c}20`, borderRadius: 999, overflow: 'hidden' }}>
                        <div style={{
                            width: ready ? `${pct}%` : '0%',
                            transition: `width 1s cubic-bezier(0.22,1,0.36,1) ${idx * 0.03 + 0.15}s`,
                            height: '100%', background: `linear-gradient(90deg, ${c}99 0%, ${c} 100%)`,
                            borderRadius: 999, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: 4,
                          }}>
                          {pct >= 35 && <span style={{ fontSize: 9, fontWeight: 900, color: '#fff', lineHeight: 1 }}>{pct}%</span>}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Footer */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
                <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                  {(() => {
                    const rc = x.diff >= 0 ? DG : DR;
                    return (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, padding: '4px 10px', borderRadius: 999, fontSize: 11, fontWeight: 800, background: `${rc}12`, border: `1px solid ${rc}30`, color: rc, lineHeight: 1.3 }}>
                        {x.diff >= 0 ? '↗' : '↘'} {ko ? '평균대비' : 'vs avg'} {x.diff >= 0 ? '+' : ''}{x.diff}
                      </span>
                    );
                  })()}
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, padding: '4px 10px', borderRadius: 999, fontSize: 11, fontWeight: 800, background: `${diffC}12`, border: `1px solid ${diffC}30`, color: diffC, lineHeight: 1.3 }}>
                    {goalDiff >= 0 ? '▲' : '▼'} {ko ? '목표' : 'Goal'} {goalDiff >= 0 ? '+' : ''}{goalDiff}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
    </div>
  );
}

// Screen 7 — 우수 개선 제안 현황
const DASH_PROPOSALS = [
  { month: '1월', name: '김*수', dept: 'CAC01', title: '용접 불량 감소 방안', status: '완료', effect: '월 15건 감소' },
  { month: '2월', name: '이*진', dept: 'CAC07', title: 'Conveyer 속도 최적화', status: '완료', effect: '생산성 3% 향상' },
  { month: '3월', name: '박*호', dept: 'RAC01', title: 'ESD 점검 주기 단축', status: '진행중', effect: '점검 시간 20% 단축' },
  { month: '4월', name: '최*아', dept: 'E5', title: '작업 동선 개선', status: '완료', effect: '이동거리 30% 단축' },
  { month: '5월', name: '정*민', dept: 'CAC08', title: 'Box 공급 자동화', status: '검토중', effect: '인력 1명 절감 예상' },
  { month: '6월', name: '강*철', dept: 'CAC10', title: '5S 구역 재설계', status: '완료', effect: '청결도 지표 향상' },
  { month: '7월', name: '윤*준', dept: 'E6', title: 'Tester 배치 최적화', status: '완료', effect: '불량 검출율 5% 향상' },
  { month: '8월', name: '조*서', dept: 'RAC05', title: '냉매 충전 표준화', status: '진행중', effect: '누출 불량 50% 감소' },
  { month: '9월', name: '한*준', dept: 'E5', title: '도장 공정 VOC 저감', status: '완료', effect: '환경지표 개선' },
  { month: '10월', name: '오*희', dept: 'CAC08', title: '불량 이미지 AI 검사', status: '검토중', effect: '검사 정확도 15% 향상' },
  { month: '11월', name: '서*민', dept: 'CAC10', title: '작업 표준서 디지털화', status: '완료', effect: '교육시간 40% 단축' },
  { month: '12월', name: '임*석', dept: 'CAC01', title: 'Spare Part 재고 최적화', status: '진행중', effect: '재고비용 12% 절감' },
];
function DashScreen7({ ko }: { ko: boolean }) {
  const [ready, setReady] = useState(false);
  useEffect(() => { const t = setTimeout(() => setReady(true), 250); return () => clearTimeout(t); }, []);
  const pal = useDashPalette();
  const propTotal = 12;
  const propDone = 7;
  const propProg = 3;
  const propReview = 2;
  const pctDone = Math.round((propDone / propTotal) * 100);
  const pctProg = Math.round((propProg / propTotal) * 100);
  const propKpi7 = [
    { label:'완료율',   pct:pctDone,  change:'+8%' },
    { label:'진행율',   pct:pctProg,  change:'+0%' },
    { label:'채택율',   pct:100, change:'+0%' },
    { label:'효과달성', pct:75,  change:'+5%' },
  ] as const;
  const eduStat7 = [
    { l:'생산 개선', v:'4건', c:DG },
    { l:'안전 환경', v:'1건', c:DA },
    { l:'품질 향상', v:'2건', c:DG },
    { l:'기타',      v:'5건', c:DGR },
  ] as const;
  const actItems7 = [
    { title:'생산 개선', goal:`${eduStat7[0].v} / ${propTotal}건`, pct: Math.round((4 / propTotal) * 100) },
    { title:'안전 환경', goal:`${eduStat7[1].v} / ${propTotal}건`, pct: Math.round((1 / propTotal) * 100) },
    { title:'품질 향상', goal:`${eduStat7[2].v} / ${propTotal}건`, pct: Math.round((2 / propTotal) * 100) },
  ];
  const spark7 = [
    { l:'월별 제안', id:'s7a', v:'12', u:'건', c:DG, pts:[1,2,1,1,2] },
    { l:'월별 완료', id:'s7b', v:'7',  u:'건', c:DG, pts:[0,1,1,1,1] },
    { l:'진행중',    id:'s7c', v:'3',  u:'건', c:DA, pts:[2,3,3,3,3] },
    { l:'효과달성',  id:'s7d', v:'75', u:'%',  c:DG, pts:[60,65,70,72,75] },
  ] as const;
  const eduTracks7 = [
    { label:'완료 제안', sub:'(연간)', val:pctDone, target:'목표 70%', prev:'50%' },
    { label:'진행 중',   sub:'(현재)', val:pctProg, target:'목표 20%', prev:'30%' },
    { label:'효과 달성', sub:'(연간)', val:75, target:'목표 80%', prev:'70%' },
  ];
  const eduStat7WithPct = eduStat7.map((row, i) => {
    const n = [4, 1, 2, 5][i];
    return { ...row, pct: Math.round((n / propTotal) * 100), c: row.c };
  });

  const card: React.CSSProperties = {
    background: pal.cardBg, boxShadow: pal.cardShadow, borderRadius: DC_R,
    padding: '14px 18px', display: 'flex', flexDirection: 'column',
    overflow: 'hidden', minHeight: 0,
  };
  const sub14: React.CSSProperties = { background: pal.subBg, borderRadius: 14 };

  const badgeHdr7 = (title: string, badge: string) => (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:8, flexShrink:0 }}>
      <div style={{ display:'flex', alignItems:'center', gap:8 }}>
        <span style={{ width:5, height:22, borderRadius:4, background:DR, flexShrink:0 }} />
        <span style={{ fontSize:22, fontWeight:800, color: pal.labelHeading, letterSpacing:'0.03em' }}>{title}</span>
      </div>
      <span style={{ display:'inline-flex', background:`${DR}12`, border:`1px solid ${DR}40`, borderRadius:999, padding:'4px 11px', fontSize:13, fontWeight:700, color:DR, lineHeight:1 }}>
        {badge}
      </span>
    </div>
  );

  const barChart7 = (bars: readonly {pct:number}[], xLabels: readonly [string,string][]) => (
    <div style={{ flex:1, minHeight:0, display:'flex', flexDirection:'column' }}>
      <div style={{ flex:1, minHeight:0, display:'flex', gap:8, alignItems:'flex-end' }}>
        {bars.map((item, idx) => {
          const c = cBar(item.pct);
          return (
            <div key={idx} style={{ flex:1, height:'100%', display:'flex', flexDirection:'column', alignItems:'center', minWidth:0 }}>
              <div style={{ flex:1, width:'78%', position:'relative', display:'flex', alignItems:'flex-end' }}>
                <div style={{ position:'absolute', bottom:0, left:0, right:0, top:0, background:`${c}28`, borderRadius:10 }} />
                <motion.div initial={{ height:0 }} animate={{ height:`${item.pct}%` }}
                  transition={{ duration:1.1, delay:idx*0.12+0.2, ease:[0.22,1,0.36,1] }}
                  style={{ width:'100%', background:c, borderRadius:10, position:'relative', display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden' }}>
                  <span style={{ fontSize:20, fontWeight:900, color:'#fff', letterSpacing:'-0.01em', lineHeight:1 }}>{item.pct}%</span>
                </motion.div>
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ display:'flex', gap:10, flexShrink:0, marginTop:6 }}>
        {xLabels.map((l, idx) => (
          <div key={idx} style={{ flex:1, textAlign:'center', lineHeight:1.25 }}>
            <div style={{ fontSize:14, fontWeight:700, color: pal.labelHeading }}>{l[0]}</div>
            {l[1] && <div style={{ fontSize:14, fontWeight:700, color: pal.labelHeading }}>{l[1]}</div>}
          </div>
        ))}
      </div>
    </div>
  );

  const kpiGrid7 = (items: readonly {t1:string; t2:string; v:string; u:string; c:string}[]) => (
    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginTop:8, flexShrink:0 }}>
      {items.map(item => (
        <div key={`${item.t1}${item.t2}`} style={{ background:`${item.c}12`, border:`1.5px solid ${item.c}35`, borderRadius:12, padding:'8px 12px', display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ display:'flex', flexDirection:'column', lineHeight:1.2, flexShrink:0 }}>
            <span style={{ fontSize:17, fontWeight:700, color: pal.body }}>{item.t1}</span>
            {item.t2 && <span style={{ fontSize:17, fontWeight:700, color: pal.body }}>{item.t2}</span>}
          </div>
          <div style={{ flex:1, textAlign:'right' }}>
            <span style={{ fontSize:32, fontWeight:900, color:item.c }}>{item.v}</span>
            <span style={{ fontSize:15, fontWeight:700, color:item.c, marginLeft:3 }}>{item.u}</span>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr 1fr', gridTemplateRows:'minmax(0,1fr) minmax(0,1fr)', gap:16, height:'100%', minHeight:0, overflow:'hidden' }}>

      {/* ── R1C1 : 제안 현황 ── */}
      <div style={card}>
        {badgeHdr7('제안 현황', '연간 기준')}
        {barChart7([{pct:pctDone},{pct:pctProg},{pct:75}] as const, [['완료','율'],['진행','율'],['효과','달성']] as const)}
        {kpiGrid7([
          { t1:'총',  t2:'제안',  v:'12', u:'건', c:DGR },
          { t1:'완',  t2:'료',    v:'7',  u:'건', c:DG  },
          { t1:'진행', t2:'중',   v:'3',  u:'건', c:DA  },
          { t1:'검',  t2:'토중',  v:'2',  u:'건', c:DGR },
        ] as const)}
      </div>

      {/* ── R1C2 : 제안 KPI ── */}
      <div style={card}>
        <DSLabel label="제안 KPI" />
        <div style={{ flex:1, minHeight:0, display:'grid', gridTemplateColumns:'1fr 1fr', gridTemplateRows:'1fr 1fr', gap:8 }}>
          {propKpi7.map((item, idx) => <EsdCard key={item.label} label={item.label} pct={item.pct} change={item.change} idx={idx} />)}
        </div>
      </div>

      {/* ── R1C3 : 분류별 현황 ── */}
      <div style={card}>
        <DSLabel label="분류별 현황" />
        <div style={{ flex:1, minHeight:0, display:'grid', gridTemplateRows:'repeat(3, 1fr)', gap:8 }}>
          {actItems7.map(item => {
            const c = cBar(item.pct);
            const filled = Math.round(item.pct / 10);
            return (
              <div key={item.title} style={{ ...sub14, padding:'8px 12px', display:'flex', flexDirection:'column', justifyContent:'space-between' }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <span style={{ fontSize:18, fontWeight:700, color: pal.body }}>{item.title}</span>
                  <span style={{ fontSize:36, fontWeight:900, color:c, lineHeight:1 }}>{item.pct}<span style={{ fontSize:20 }}>%</span></span>
                </div>
                <div style={{ display:'flex', gap:4 }}>
                  {Array.from({ length:10 }, (_, i) => (
                    <motion.div key={i} initial={{ opacity:0, scaleY:0.4 }}
                      animate={{ opacity: i<filled ? 0.35+(i/9)*0.65 : 1, scaleY:1 }}
                      transition={{ duration:0.55, delay:i*0.045, ease:[0.22,1,0.36,1] }}
                      style={{ flex:1, height:14, borderRadius:4, background: i<filled ? c : pal.track, transformOrigin:'bottom' }}
                    />
                  ))}
                </div>
                <div style={{ fontSize:16, fontWeight:700, color:DGR }}>{item.goal}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── R1C4 : 제안 추이 ── */}
      <div style={card}>
        <DSLabel label="제안 추이" />
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, flexShrink:0 }}>
          {([
            { label:'우수 제안', v:'3',  u:'건', c:DG },
            { label:'연간 완료', v:String(pctDone), u:'%',  c:cBar(pctDone) },
          ] as const).map(item => (
            <div key={item.label} style={{ background:`${item.c}12`, border:`1.5px solid ${item.c}35`, borderRadius:12, padding:'8px 12px', textAlign:'center' }}>
              <div style={{ fontSize:18, fontWeight:700, color: pal.body }}>{item.label}</div>
              <div style={{ fontSize:36, fontWeight:900, color:item.c, lineHeight:1.1 }}>
                {item.v}<span style={{ fontSize:20 }}>{item.u}</span>
              </div>
            </div>
          ))}
        </div>
        <div style={{ flex:1, minHeight:0, display:'grid', gridTemplateColumns:'1fr 1fr', gridTemplateRows:'1fr 1fr', gap:8, marginTop:8 }}>
          {spark7.map(item => {
            const { line, area, xs, ys } = mkSpark(item.pts);
            return (
              <div key={item.id} style={{ ...sub14, padding:'0 12px', display:'flex', flexDirection:'column', overflow:'hidden' }}>
                <div style={{ flexShrink:0, display:'flex', justifyContent:'space-between', alignItems:'center', paddingTop:8, paddingBottom:4 }}>
                  <span style={{ fontSize:15, fontWeight:700, color:DGR, lineHeight:1 }}>{item.l}</span>
                  <span style={{ fontSize:22, fontWeight:900, color:item.c, lineHeight:1 }}>
                    {item.v}<span style={{ fontSize:13, fontWeight:600, marginLeft:2 }}>{item.u}</span>
                  </span>
                </div>
                <div style={{ flex:'1 1 0', minHeight:0 }}>
                  <svg width="100%" height="100%" viewBox="0 0 110 56" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id={item.id} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={item.c} stopOpacity="0.42" />
                        <stop offset="100%" stopColor={item.c} stopOpacity="0.02" />
                      </linearGradient>
                    </defs>
                    <path d={area} fill={`url(#${item.id})`} />
                    <path d={line} fill="none" stroke={item.c} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    {xs.map((x, i) => (
                      <g key={i}>
                        <text x={x} y={ys[i]-5} textAnchor="middle" fontSize="9" fill={item.c} fontWeight="800">{item.pts[i]}</text>
                        <circle cx={x} cy={ys[i]} r="3" fill={item.c} />
                      </g>
                    ))}
                  </svg>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── R2C1 : 성과 현황 ── */}
      <div style={card}>
        {badgeHdr7('성과 현황', '연간 기준')}
        {barChart7(
          [{ pct: actItems7[0].pct }, { pct: actItems7[1].pct }, { pct: actItems7[2].pct }] as const,
          [['생산','개선'],['안전','환경'],['품질','향상']] as const,
        )}
        {kpiGrid7([
          { t1:'생산', t2:'개선', v:'4', u:'건', c:DG  },
          { t1:'안전', t2:'환경', v:'1', u:'건', c:DA  },
          { t1:'품질', t2:'향상', v:'2', u:'건', c:DG  },
          { t1:'기타', t2:'',    v:'5', u:'건', c:DGR },
        ] as const)}
      </div>

      {/* ── R2C2~3 (colspan 2) : 제안 세부 현황 ── */}
      <div style={{ ...card, gridColumn:'span 2' }}>
        <DSLabel label="제안 세부 현황" />
        <div style={{ flex:1, minHeight:0, display:'flex', gap:14 }}>
          <div style={{ flex:1, display:'grid', gridTemplateRows:'repeat(3, 1fr)', gap:8 }}>
            {eduTracks7.map(item => {
              const c = cBar(item.val);
              const filled = Math.round(item.val / 10);
              return (
                <div key={item.label} style={{ ...sub14, padding:'8px 12px', display:'flex', flexDirection:'column', justifyContent:'space-between' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                    <div>
                      <span style={{ fontSize:18, fontWeight:700, color: pal.body }}>{item.label}</span>
                      {item.sub && <span style={{ fontSize:16, fontWeight:700, color:DGR, marginLeft:6 }}>{item.sub}</span>}
                    </div>
                    <span style={{ fontSize:36, fontWeight:900, color:c, lineHeight:1 }}>{item.val}<span style={{ fontSize:20 }}>%</span></span>
                  </div>
                  <div style={{ display:'flex', gap:4 }}>
                    {Array.from({ length:10 }, (_, i) => (
                      <motion.div key={i} initial={{ opacity:0, scaleY:0.3 }}
                        animate={{ opacity: i<filled ? 0.35+(i/9)*0.65 : 1, scaleY:1 }}
                        transition={{ duration:0.5, delay:i*0.04, ease:[0.22,1,0.36,1] }}
                        style={{ flex:1, height:14, borderRadius:4, background: i<filled ? c : pal.track, transformOrigin:'bottom' }}
                      />
                    ))}
                  </div>
                  <div style={{ display:'flex', justifyContent:'space-between' }}>
                    <span style={{ fontSize:15, fontWeight:700, color:DGR }}>{item.target}</span>
                    <span style={{ fontSize:15, fontWeight:700, color:DGR }}>전기 {item.prev}</span>
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{ flex:'0 0 220px', display:'grid', gridTemplateColumns:'1fr 1fr', gridTemplateRows:'1fr 1fr', gap:8 }}>
            {eduStat7WithPct.map(item => {
              const filled = Math.round(item.pct / 10);
              return (
                <div key={item.l} style={{ ...sub14, padding:'8px 10px', display:'flex', flexDirection:'column', alignItems:'center', gap:6, overflow:'hidden' }}>
                  <div style={{ fontSize:16, fontWeight:700, color:DGR, flexShrink:0, lineHeight:1 }}>{item.l}</div>
                  <div style={{ flex:1, minHeight:0, display:'flex', flexDirection:'column-reverse', gap:5, width:'55%' }}>
                    {Array.from({ length:10 }, (_, i) => (
                      <motion.div key={i} initial={{ opacity:0, scaleX:0.3 }}
                        animate={{ opacity: i<filled ? 0.35+(i/9)*0.65 : 1, scaleX:1 }}
                        transition={{ duration:0.5, delay:i*0.04, ease:[0.22,1,0.36,1] }}
                        style={{ flex:1, borderRadius:4, background: i<filled ? item.c : pal.track, transformOrigin:'left' }}
                      />
                    ))}
                  </div>
                  <div style={{ fontSize:22, fontWeight:900, color:item.c, lineHeight:1, flexShrink:0 }}>{item.v}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── R2C4 : 종합 요약 ── */}
      <div style={card}>
        <DSLabel label="종합 요약" />
        <div style={{ flex:1, minHeight:0, display:'grid', gridTemplateColumns:'1fr 1fr', gridTemplateRows:'repeat(3, minmax(0,1fr))', gap:8 }}>
          {([
            { l: ko ? '상태 분류율' : 'Triaged', n: Math.round(((propDone + propProg + propReview) / propTotal) * 100) }, // 7+3+2=12건 모두 상태 부여
            { l:'완료율',  n: pctDone },
            { l:'진행율',  n: pctProg },
            { l:'채택율',  n: 100 },
            { l:'효과달성', n: 75 },
            { l:'우수제안', n: Math.round((3 / propTotal) * 100) },
          ] as const).map((item, idx) => {
            const c = cBar(item.n);
            const grade = item.n >= 90 ? '달성' : item.n >= 80 ? '주의' : '미달';
            return (
              <div key={item.l} style={{ background:`${c}12`, border:`1.5px solid ${c}35`, borderRadius:14, padding:'12px 14px', display:'flex', flexDirection:'column', justifyContent:'space-between', overflow:'hidden', minHeight:0 }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexShrink:0 }}>
                  <span style={{ fontSize:15, fontWeight:800, color: pal.body, lineHeight:1.25 }}>{item.l}</span>
                  <span style={{ display:'inline-block', padding:'4px 12px', borderRadius:999, fontSize:14, fontWeight:800, background:`${c}22`, color:c, lineHeight:1.2, flexShrink:0 }}>{grade}</span>
                </div>
                <div style={{ display:'flex', alignItems:'baseline', gap:3, flexShrink:0 }}>
                  <span style={{ fontSize:44, fontWeight:900, color:c, lineHeight:1 }}>{item.n}</span>
                  <span style={{ fontSize:20, fontWeight:700, color:c }}>%</span>
                </div>
                <div style={{ height:20, background:`${c}20`, borderRadius:999, overflow:'hidden', flexShrink:0 }}>
                  <div style={{ width: ready ? `${item.n}%` : '0%', transition: `width 1s cubic-bezier(0.22,1,0.36,1) ${idx*0.14}s`, height:'100%', background:`linear-gradient(90deg, ${c}99 0%, ${c} 100%)`, borderRadius:999, display:'flex', alignItems:'center', justifyContent:'flex-end', paddingRight:7 }}>
                    {item.n >= 20 && <span style={{ fontSize:11, fontWeight:900, color:'#fff', lineHeight:1 }}>{item.n}%</span>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}

// Screen 8 — 5S 현황
const DASH_5S = [
  { zone: 'A구역', line: 'CAC01', resp: '김*수', score: 94, s: [100, 95, 90, 88, 95] },
  { zone: 'B구역', line: 'CAC07', resp: '이*진', score: 88, s: [90, 88, 86, 88, 90] },
  { zone: 'C구역', line: 'RAC01', resp: '박*호', score: 97, s: [98, 96, 97, 98, 96] },
  { zone: 'D구역', line: 'E5', resp: '최*아', score: 82, s: [85, 80, 82, 80, 84] },
  { zone: 'E구역', line: 'E6', resp: '정*민', score: 100, s: [100, 100, 100, 100, 100] },
  { zone: 'F구역', line: 'E7', resp: '강*철', score: 75, s: [78, 74, 72, 76, 78] },
  { zone: 'G구역', line: 'CAC08', resp: '윤*준', score: 91, s: [92, 90, 91, 90, 92] },
  { zone: 'H구역', line: 'CAC10', resp: '조*서', score: 68, s: [70, 66, 68, 68, 70] },
  { zone: 'I구역', line: 'RAC05', resp: '한*준', score: 95, s: [96, 94, 95, 95, 97] },
  { zone: 'J구역', line: 'CAC03', resp: '오*희', score: 79, s: [82, 78, 76, 80, 79] },
  { zone: 'K구역', line: 'E3', resp: '서*민', score: 62, s: [65, 60, 58, 64, 63] },
  { zone: 'L구역', line: 'CAC12', resp: '임*석', score: 98, s: [98, 98, 99, 97, 98] },
];
function DashScreen8({ ko }: { ko: boolean }) {
  const [ready, setReady] = useState(false);
  useEffect(() => { const t = setTimeout(() => setReady(true), 250); return () => clearTimeout(t); }, []);
  const pal = useDashPalette();
  const n5 = DASH_5S.length;
  const avgScoreAll = Math.round(DASH_5S.reduce((a, z) => a + z.score, 0) / n5);
  /** 우수 ≥95점, 미흡 ≤75점, 그 외 보통 — 4+5+3=12구역과 일치 */
  const n5Excellent = DASH_5S.filter(z => z.score >= 95).length;
  const n5Poor = DASH_5S.filter(z => z.score <= 75).length;
  const n5Mid = n5 - n5Excellent - n5Poor;
  /** 데모 데이터 z.s[0..3]은 구역별 동일 차원 점수(4항목). s[4]는 추이용으로 항목 달성 카드에서 미사용 */
  const s5Avg = ['정리','정돈','청소','청결'].map((name, si) => ({
    label: name,
    pct: Math.round(DASH_5S.reduce((a, z) => a + z.s[si], 0) / n5),
    change: ['+2%','+1%','-1%','+0%'][si],
  }));
  const actItems8 = DASH_5S.slice(3, 6).map(z => ({ title:z.zone, goal:`${z.line} ${z.resp}`, pct:z.score }));
  const spark8 = [
    { l:'A구역', id:'s8a', v:'94', u:'점', c:DG, pts:[90,92,92,94,94] },
    { l:'B구역', id:'s8b', v:'88', u:'점', c:DA, pts:[86,86,88,88,88] },
    { l:'C구역', id:'s8c', v:'97', u:'점', c:DG, pts:[94,96,97,97,97] },
    { l:'평균',  id:'s8d', v:String(avgScoreAll), u:'점', c:cBar(avgScoreAll), pts:[82,83,84,85,avgScoreAll] },
  ] as const;
  const eduTracks8 = DASH_5S.slice(6, 9).map(z => ({
    label:`${z.zone} ${z.line}`, sub:'', val:z.score, target:'목표 90점', prev:'90%',
  }));
  const eduStat8 = [
    { l:'우수 구역', v:`${n5Excellent}개`, pct: Math.round((n5Excellent / n5) * 100), c:DG },
    { l:'보통 구역', v:`${n5Mid}개`, pct: Math.round((n5Mid / n5) * 100), c:DA },
    { l:'미흡 구역', v:`${n5Poor}개`, pct: Math.round((n5Poor / n5) * 100), c:DR },
    { l:'평균 점수', v:`${avgScoreAll}점`, pct: Math.min(100, avgScoreAll), c:cBar(avgScoreAll) },
  ];

  const card: React.CSSProperties = {
    background: pal.cardBg, boxShadow: pal.cardShadow, borderRadius: DC_R,
    padding: '14px 18px', display: 'flex', flexDirection: 'column',
    overflow: 'hidden', minHeight: 0,
  };
  const sub14: React.CSSProperties = { background: pal.subBg, borderRadius: 14 };

  const badgeHdr8 = (title: string, badge: string) => (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:8, flexShrink:0 }}>
      <div style={{ display:'flex', alignItems:'center', gap:8 }}>
        <span style={{ width:5, height:22, borderRadius:4, background:DR, flexShrink:0 }} />
        <span style={{ fontSize:22, fontWeight:800, color: pal.labelHeading, letterSpacing:'0.03em' }}>{title}</span>
      </div>
      <span style={{ display:'inline-flex', background:`${DR}12`, border:`1px solid ${DR}40`, borderRadius:999, padding:'4px 11px', fontSize:13, fontWeight:700, color:DR, lineHeight:1 }}>
        {badge}
      </span>
    </div>
  );

  const barChart8 = (bars: readonly {pct:number}[], xLabels: readonly [string,string][]) => (
    <div style={{ flex:1, minHeight:0, display:'flex', flexDirection:'column' }}>
      <div style={{ flex:1, minHeight:0, display:'flex', gap:8, alignItems:'flex-end' }}>
        {bars.map((item, idx) => {
          const c = cBar(item.pct);
          return (
            <div key={idx} style={{ flex:1, height:'100%', display:'flex', flexDirection:'column', alignItems:'center', minWidth:0 }}>
              <div style={{ flex:1, width:'78%', position:'relative', display:'flex', alignItems:'flex-end' }}>
                <div style={{ position:'absolute', bottom:0, left:0, right:0, top:0, background:`${c}28`, borderRadius:10 }} />
                <motion.div initial={{ height:0 }} animate={{ height:`${item.pct}%` }}
                  transition={{ duration:1.1, delay:idx*0.12+0.2, ease:[0.22,1,0.36,1] }}
                  style={{ width:'100%', background:c, borderRadius:10, position:'relative', display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden' }}>
                  <span style={{ fontSize:20, fontWeight:900, color:'#fff', letterSpacing:'-0.01em', lineHeight:1 }}>{item.pct}%</span>
                </motion.div>
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ display:'flex', gap:10, flexShrink:0, marginTop:6 }}>
        {xLabels.map((l, idx) => (
          <div key={idx} style={{ flex:1, textAlign:'center', lineHeight:1.25 }}>
            <div style={{ fontSize:14, fontWeight:700, color: pal.labelHeading }}>{l[0]}</div>
            {l[1] && <div style={{ fontSize:14, fontWeight:700, color: pal.labelHeading }}>{l[1]}</div>}
          </div>
        ))}
      </div>
    </div>
  );

  const kpiGrid8 = (items: readonly {t1:string; t2:string; v:string; u:string; c:string}[]) => (
    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginTop:8, flexShrink:0 }}>
      {items.map(item => (
        <div key={`${item.t1}${item.t2}`} style={{ background:`${item.c}12`, border:`1.5px solid ${item.c}35`, borderRadius:12, padding:'8px 12px', display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ display:'flex', flexDirection:'column', lineHeight:1.2, flexShrink:0 }}>
            <span style={{ fontSize:17, fontWeight:700, color: pal.body }}>{item.t1}</span>
            {item.t2 && <span style={{ fontSize:17, fontWeight:700, color: pal.body }}>{item.t2}</span>}
          </div>
          <div style={{ flex:1, textAlign:'right' }}>
            <span style={{ fontSize:32, fontWeight:900, color:item.c }}>{item.v}</span>
            <span style={{ fontSize:15, fontWeight:700, color:item.c, marginLeft:3 }}>{item.u}</span>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr 1fr', gridTemplateRows:'minmax(0,1fr) minmax(0,1fr)', gap:16, height:'100%', minHeight:0, overflow:'hidden' }}>

      {/* ── R1C1 : 5S 종합 A·B·C ── */}
      <div style={card}>
        {badgeHdr8('5S 종합', '금월 기준')}
        {barChart8(
          DASH_5S.slice(0,3).map(z => ({ pct:z.score })) as readonly {pct:number}[],
          DASH_5S.slice(0,3).map(z => [z.zone,''] as [string,string]) as readonly [string,string][],
        )}
        {kpiGrid8([
          { t1:'우수', t2:'구역', v:String(n5Excellent), u:'개', c:DG },
          { t1:'보통', t2:'구역', v:String(n5Mid),      u:'개', c:DA },
          { t1:'미흡', t2:'구역', v:String(n5Poor),     u:'개', c:DR },
          { t1:'평균', t2:'점수', v:String(avgScoreAll), u:'점', c:cBar(avgScoreAll) },
        ] as const)}
      </div>

      {/* ── R1C2 : 5S 항목 달성 ── */}
      <div style={card}>
        <DSLabel label="5S 항목 달성" />
        <div style={{ flex:1, minHeight:0, display:'grid', gridTemplateColumns:'1fr 1fr', gridTemplateRows:'1fr 1fr', gap:8 }}>
          {s5Avg.map((item, idx) => <EsdCard key={item.label} label={item.label} pct={item.pct} change={item.change} idx={idx} />)}
        </div>
      </div>

      {/* ── R1C3 : D·E·F 구역 현황 ── */}
      <div style={card}>
        <DSLabel label="구역별 현황" />
        <div style={{ flex:1, minHeight:0, display:'grid', gridTemplateRows:'repeat(3, 1fr)', gap:8 }}>
          {actItems8.map(item => {
            const c = cBar(item.pct);
            const filled = Math.round(item.pct / 10);
            return (
              <div key={item.title} style={{ ...sub14, padding:'8px 12px', display:'flex', flexDirection:'column', justifyContent:'space-between' }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <span style={{ fontSize:18, fontWeight:700, color: pal.body }}>{item.title}</span>
                  <span style={{ fontSize:36, fontWeight:900, color:c, lineHeight:1 }}>{item.pct}<span style={{ fontSize:20 }}>점</span></span>
                </div>
                <div style={{ display:'flex', gap:4 }}>
                  {Array.from({ length:10 }, (_, i) => (
                    <motion.div key={i} initial={{ opacity:0, scaleY:0.4 }}
                      animate={{ opacity: i<filled ? 0.35+(i/9)*0.65 : 1, scaleY:1 }}
                      transition={{ duration:0.55, delay:i*0.045, ease:[0.22,1,0.36,1] }}
                      style={{ flex:1, height:14, borderRadius:4, background: i<filled ? c : pal.track, transformOrigin:'bottom' }}
                    />
                  ))}
                </div>
                <div style={{ fontSize:16, fontWeight:700, color:DGR }}>{item.goal}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── R1C4 : 5S 추이 ── */}
      <div style={card}>
        <DSLabel label="5S 추이" />
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, flexShrink:0 }}>
          {([
            { label:'우수 구역', v:String(n5Excellent), u:'개', c:DG },
            { label:'전체 평균', v:String(avgScoreAll), u:'점', c:cBar(avgScoreAll) },
          ] as const).map(item => (
            <div key={item.label} style={{ background:`${item.c}12`, border:`1.5px solid ${item.c}35`, borderRadius:12, padding:'8px 12px', textAlign:'center' }}>
              <div style={{ fontSize:18, fontWeight:700, color: pal.body }}>{item.label}</div>
              <div style={{ fontSize:36, fontWeight:900, color:item.c, lineHeight:1.1 }}>
                {item.v}<span style={{ fontSize:20 }}>{item.u}</span>
              </div>
            </div>
          ))}
        </div>
        <div style={{ flex:1, minHeight:0, display:'grid', gridTemplateColumns:'1fr 1fr', gridTemplateRows:'1fr 1fr', gap:8, marginTop:8 }}>
          {spark8.map(item => {
            const { line, area, xs, ys } = mkSpark(item.pts);
            return (
              <div key={item.id} style={{ ...sub14, padding:'0 12px', display:'flex', flexDirection:'column', overflow:'hidden' }}>
                <div style={{ flexShrink:0, display:'flex', justifyContent:'space-between', alignItems:'center', paddingTop:8, paddingBottom:4 }}>
                  <span style={{ fontSize:15, fontWeight:700, color:DGR, lineHeight:1 }}>{item.l}</span>
                  <span style={{ fontSize:22, fontWeight:900, color:item.c, lineHeight:1 }}>
                    {item.v}<span style={{ fontSize:13, fontWeight:600, marginLeft:2 }}>{item.u}</span>
                  </span>
                </div>
                <div style={{ flex:'1 1 0', minHeight:0 }}>
                  <svg width="100%" height="100%" viewBox="0 0 110 56" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id={item.id} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={item.c} stopOpacity="0.42" />
                        <stop offset="100%" stopColor={item.c} stopOpacity="0.02" />
                      </linearGradient>
                    </defs>
                    <path d={area} fill={`url(#${item.id})`} />
                    <path d={line} fill="none" stroke={item.c} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    {xs.map((x, i) => (
                      <g key={i}>
                        <text x={x} y={ys[i]-5} textAnchor="middle" fontSize="9" fill={item.c} fontWeight="800">{item.pts[i]}</text>
                        <circle cx={x} cy={ys[i]} r="3" fill={item.c} />
                      </g>
                    ))}
                  </svg>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── R2C1 : G·H·I 구역 ── */}
      <div style={card}>
        {badgeHdr8('하위 구역', '금월 기준')}
        {barChart8(
          DASH_5S.slice(6,9).map(z => ({ pct:z.score })) as readonly {pct:number}[],
          DASH_5S.slice(6,9).map(z => [z.zone,''] as [string,string]) as readonly [string,string][],
        )}
        {kpiGrid8([
          { t1:'G구역', t2:DASH_5S[6].line, v:String(DASH_5S[6].score), u:'점', c:cBar(DASH_5S[6].score) },
          { t1:'H구역', t2:DASH_5S[7].line, v:String(DASH_5S[7].score), u:'점', c:cBar(DASH_5S[7].score) },
          { t1:'I구역', t2:DASH_5S[8].line, v:String(DASH_5S[8].score), u:'점', c:cBar(DASH_5S[8].score) },
          { t1:'개선',  t2:'필요',           v:'1',                       u:'개', c:DR },
        ] as const)}
      </div>

      {/* ── R2C2~3 (colspan 2) : 구역 세부 현황 ── */}
      <div style={{ ...card, gridColumn:'span 2' }}>
        <DSLabel label="구역 세부 현황" />
        <div style={{ flex:1, minHeight:0, display:'flex', gap:14 }}>
          <div style={{ flex:1, display:'grid', gridTemplateRows:'repeat(3, 1fr)', gap:8 }}>
            {eduTracks8.map(item => {
              const c = cBar(item.val);
              const filled = Math.round(item.val / 10);
              return (
                <div key={item.label} style={{ ...sub14, padding:'8px 12px', display:'flex', flexDirection:'column', justifyContent:'space-between' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                    <span style={{ fontSize:18, fontWeight:700, color: pal.body }}>{item.label}</span>
                    <span style={{ fontSize:36, fontWeight:900, color:c, lineHeight:1 }}>{item.val}<span style={{ fontSize:20 }}>점</span></span>
                  </div>
                  <div style={{ display:'flex', gap:4 }}>
                    {Array.from({ length:10 }, (_, i) => (
                      <motion.div key={i} initial={{ opacity:0, scaleY:0.3 }}
                        animate={{ opacity: i<filled ? 0.35+(i/9)*0.65 : 1, scaleY:1 }}
                        transition={{ duration:0.5, delay:i*0.04, ease:[0.22,1,0.36,1] }}
                        style={{ flex:1, height:14, borderRadius:4, background: i<filled ? c : pal.track, transformOrigin:'bottom' }}
                      />
                    ))}
                  </div>
                  <div style={{ display:'flex', justifyContent:'space-between' }}>
                    <span style={{ fontSize:15, fontWeight:700, color:DGR }}>{item.target}</span>
                    <span style={{ fontSize:15, fontWeight:700, color:DGR }}>전월 {item.prev}</span>
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{ flex:'0 0 220px', display:'grid', gridTemplateColumns:'1fr 1fr', gridTemplateRows:'1fr 1fr', gap:8 }}>
            {eduStat8.map(item => {
              const filled = Math.round(item.pct / 10);
              return (
                <div key={item.l} style={{ ...sub14, padding:'8px 10px', display:'flex', flexDirection:'column', alignItems:'center', gap:6, overflow:'hidden' }}>
                  <div style={{ fontSize:16, fontWeight:700, color:DGR, flexShrink:0, lineHeight:1 }}>{item.l}</div>
                  <div style={{ flex:1, minHeight:0, display:'flex', flexDirection:'column-reverse', gap:5, width:'55%' }}>
                    {Array.from({ length:10 }, (_, i) => (
                      <motion.div key={i} initial={{ opacity:0, scaleX:0.3 }}
                        animate={{ opacity: i<filled ? 0.35+(i/9)*0.65 : 1, scaleX:1 }}
                        transition={{ duration:0.5, delay:i*0.04, ease:[0.22,1,0.36,1] }}
                        style={{ flex:1, borderRadius:4, background: i<filled ? item.c : pal.track, transformOrigin:'left' }}
                      />
                    ))}
                  </div>
                  <div style={{ fontSize:22, fontWeight:900, color:item.c, lineHeight:1, flexShrink:0 }}>{item.v}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── R2C4 : 종합 요약 ── */}
      <div style={card}>
        <DSLabel label="종합 요약" />
        <div style={{ flex:1, minHeight:0, display:'grid', gridTemplateColumns:'1fr 1fr', gridTemplateRows:'repeat(3, minmax(0,1fr))', gap:8 }}>
          {DASH_5S.slice(0,6).map((z, idx) => {
            const c = cBar(z.score);
            const grade = z.score >= 90 ? '달성' : z.score >= 80 ? '주의' : '미달';
            return (
              <div key={z.zone} style={{ background:`${c}12`, border:`1.5px solid ${c}35`, borderRadius:14, padding:'12px 14px', display:'flex', flexDirection:'column', justifyContent:'space-between', overflow:'hidden', minHeight:0 }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexShrink:0 }}>
                  <span style={{ fontSize:15, fontWeight:800, color: pal.body, lineHeight:1.25 }}>{z.zone}</span>
                  <span style={{ display:'inline-block', padding:'4px 12px', borderRadius:999, fontSize:14, fontWeight:800, background:`${c}22`, color:c, lineHeight:1.2, flexShrink:0 }}>{grade}</span>
                </div>
                <div style={{ display:'flex', alignItems:'baseline', gap:3, flexShrink:0 }}>
                  <span style={{ fontSize:44, fontWeight:900, color:c, lineHeight:1 }}>{z.score}</span>
                  <span style={{ fontSize:20, fontWeight:700, color:c }}>점</span>
                </div>
                <div style={{ height:20, background:`${c}20`, borderRadius:999, overflow:'hidden', flexShrink:0 }}>
                  <div style={{ width: ready ? `${z.score}%` : '0%', transition: `width 1s cubic-bezier(0.22,1,0.36,1) ${idx*0.14}s`, height:'100%', background:`linear-gradient(90deg, ${c}99 0%, ${c} 100%)`, borderRadius:999, display:'flex', alignItems:'center', justifyContent:'flex-end', paddingRight:7 }}>
                    {z.score >= 20 && <span style={{ fontSize:11, fontWeight:900, color:'#fff', lineHeight:1 }}>{z.score}{ko ? '점' : 'pt'}</span>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}

// Screen 9 — 라인 레이아웃
const DASH_LAYOUT = [
  { no: 1, loc: 'C-03-01-BTM-01', code: 'BTM', name: 'Base 이동기', r1: '김*유', r2: '안*수', r3: '사*희', date: '2024-10-08', chk: 'Y' },
  { no: 2, loc: 'C-03-01-CAP-02', code: 'CAP', name: 'Comp 자동 안치', r1: '김*유', r2: '조*재', r3: '사*희', date: '2025-06-04', chk: 'Y' },
  { no: 3, loc: 'C-03-01-EVB-03', code: 'EVB', name: '엘교환기 Bending', r1: '배*형', r2: '김*성', r3: '사*희', date: '2025-07-15', chk: 'Y' },
  { no: 4, loc: 'C-03-01-EAP-04', code: 'EAP', name: '엘교환기 자동 안치', r1: '안*현', r2: '백*인', r3: '사*희', date: '2025-08-19', chk: 'Y' },
  { no: 5, loc: 'C-03-01-SVF-05', code: 'SVF', name: 'S/Valve 자동 제개기', r1: '안*수', r2: '김*정', r3: '사*희', date: '2024-08-16', chk: 'Y' },
  { no: 6, loc: 'C-03-01-HEC-06', code: 'HEC', name: '펠롤 저장기', r1: '김*길', r2: '안*합', r3: '사*희', date: '2025-09-19', chk: 'Y' },
  { no: 7, loc: 'C-03-01-VCP-07', code: 'VCP', name: '진공함로', r1: '배*진', r2: '박*규', r3: '사*희', date: '2025-01-24', chk: 'Y' },
  { no: 8, loc: 'C-03-01-RCM-08', code: 'RCM', name: '냉매 저장', r1: '김*철', r2: '손*재', r3: '사*희', date: '2025-06-05', chk: 'Y' },
  { no: 9, loc: 'C-03-01-USW-09', code: 'USW', name: '초음파 용착기', r1: '김*정', r2: '손*재', r3: '사*희', date: '2022-07-15', chk: 'N' },
  { no: 10, loc: 'C-03-01-SAP-10', code: 'SAP', name: 'Shroud 자동 안치', r1: '주*현', r2: '김*수', r3: '사*희', date: '2025-02-07', chk: 'Y' },
  { no: 11, loc: 'C-03-01-TCC-11', code: 'TCC', name: 'Top Cover 이동기', r1: '이*호', r2: '박*영', r3: '사*희', date: '2025-03-12', chk: 'Y' },
  { no: 12, loc: 'C-03-01-PKG-12', code: 'PKG', name: '포장 자동화', r1: '최*준', r2: '정*기', r3: '사*희', date: '2024-11-20', chk: 'Y' },
  { no: 13, loc: 'C-03-01-LBL-13', code: 'LBL', name: '라벨 자동 부착기', r1: '강*서', r2: '윤*현', r3: '사*희', date: '2025-05-08', chk: 'Y' },
  { no: 14, loc: 'C-03-01-AGV-14', code: 'AGV', name: 'AGV 무인운반차', r1: '조*민', r2: '한*우', r3: '사*희', date: '2024-09-14', chk: 'N' },
  { no: 15, loc: 'C-03-01-CHK-15', code: 'CHK', name: '기밀 검사기', r1: '오*진', r2: '서*율', r3: '사*희', date: '2025-04-22', chk: 'Y' },
];
function DashScreen9({ ko }: { ko: boolean }) {
  const [ready, setReady] = useState(false);
  useEffect(() => { const t = setTimeout(() => setReady(true), 250); return () => clearTimeout(t); }, []);
  const pal = useDashPalette();
  const totalEquip = DASH_LAYOUT.length;
  const checkedOk  = DASH_LAYOUT.filter(r => r.chk === 'Y').length;
  const notOk      = totalEquip - checkedOk;
  const checkRate  = Math.round((checkedOk / totalEquip) * 100);
  const pendingRate = totalEquip > 0 ? Math.round((notOk / totalEquip) * 100) : 0;

  const actItems9 = [
    { title:'정기 점검',  goal:'목표 100%', pct:checkRate },
    { title:'예방 정비',  goal:'목표 90%',  pct:80        },
    { title:'안전 점검',  goal:'목표 95%',  pct:93        },
  ];
  const spark9 = [
    { l:'점검완료율', id:'s9a', v:String(checkRate), u:'%', c:cBar(checkRate), pts:[75,80,83,85,checkRate] },
    { l:'가동률',     id:'s9b', v:'93',               u:'%', c:DG,              pts:[88,90,91,92,93]        },
    { l:'미완료',     id:'s9c', v:String(notOk),      u:'건', c:notOk>0?DA:DG,  pts:[5,4,3,3,notOk]        },
    { l:'예방정비',   id:'s9d', v:'80',               u:'%', c:DA,              pts:[70,72,75,78,80]        },
  ] as const;
  const eduTracks9 = [
    { label:'설비 점검', sub:'',  val:checkRate, target:`${checkedOk}/${totalEquip}건`, prev:'80%' },
    { label:'예방 정비', sub:'',  val:80,        target:'목표 90%',                      prev:'75%' },
    { label:'안전 점검', sub:'',  val:93,        target:'목표 95%',                      prev:'90%' },
  ];
  const eduStat9 = [
    { l:'점검 완료', v:`${checkedOk}건`,  pct:checkRate, c:cBar(checkRate) },
    { l:'미완료',    v:`${notOk}건`,      pct: pendingRate, c:notOk>0?DR:DG },
    { l:'가동률',    v:'93%',             pct:93,        c:DG             },
    { l:'예방정비',  v:'80%',             pct:80,        c:DA             },
  ];

  const card: React.CSSProperties = {
    background: pal.cardBg, boxShadow: pal.cardShadow, borderRadius: DC_R,
    padding: '14px 18px', display: 'flex', flexDirection: 'column',
    overflow: 'hidden', minHeight: 0,
  };
  const sub14: React.CSSProperties = { background: pal.subBg, borderRadius: 14 };

  const badgeHdr9 = (title: string, badge: string) => (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:8, flexShrink:0 }}>
      <div style={{ display:'flex', alignItems:'center', gap:8 }}>
        <span style={{ width:5, height:22, borderRadius:4, background:DR, flexShrink:0 }} />
        <span style={{ fontSize:22, fontWeight:800, color: pal.labelHeading, letterSpacing:'0.03em' }}>{title}</span>
      </div>
      <span style={{ display:'inline-flex', background:`${DR}12`, border:`1px solid ${DR}40`, borderRadius:999, padding:'4px 11px', fontSize:13, fontWeight:700, color:DR, lineHeight:1 }}>
        {badge}
      </span>
    </div>
  );

  const barChart9 = (bars: readonly {pct:number}[], xLabels: readonly [string,string][]) => (
    <div style={{ flex:1, minHeight:0, display:'flex', flexDirection:'column' }}>
      <div style={{ flex:1, minHeight:0, display:'flex', gap:8, alignItems:'flex-end' }}>
        {bars.map((item, idx) => {
          const c = cBar(item.pct);
          return (
            <div key={idx} style={{ flex:1, height:'100%', display:'flex', flexDirection:'column', alignItems:'center', minWidth:0 }}>
              <div style={{ flex:1, width:'78%', position:'relative', display:'flex', alignItems:'flex-end' }}>
                <div style={{ position:'absolute', bottom:0, left:0, right:0, top:0, background:`${c}28`, borderRadius:10 }} />
                <motion.div initial={{ height:0 }} animate={{ height:`${item.pct}%` }}
                  transition={{ duration:1.1, delay:idx*0.12+0.2, ease:[0.22,1,0.36,1] }}
                  style={{ width:'100%', background:c, borderRadius:10, position:'relative', display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden' }}>
                  <span style={{ fontSize:20, fontWeight:900, color:'#fff', letterSpacing:'-0.01em', lineHeight:1 }}>{item.pct}%</span>
                </motion.div>
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ display:'flex', gap:10, flexShrink:0, marginTop:6 }}>
        {xLabels.map((l, idx) => (
          <div key={idx} style={{ flex:1, textAlign:'center', lineHeight:1.25 }}>
            <div style={{ fontSize:14, fontWeight:700, color: pal.labelHeading }}>{l[0]}</div>
            {l[1] && <div style={{ fontSize:14, fontWeight:700, color: pal.labelHeading }}>{l[1]}</div>}
          </div>
        ))}
      </div>
    </div>
  );

  const kpiGrid9 = (items: readonly {t1:string; t2:string; v:string; u:string; c:string}[]) => (
    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginTop:8, flexShrink:0 }}>
      {items.map(item => (
        <div key={`${item.t1}${item.t2}`} style={{ background:`${item.c}12`, border:`1.5px solid ${item.c}35`, borderRadius:12, padding:'8px 12px', display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ display:'flex', flexDirection:'column', lineHeight:1.2, flexShrink:0 }}>
            <span style={{ fontSize:17, fontWeight:700, color: pal.body }}>{item.t1}</span>
            {item.t2 && <span style={{ fontSize:17, fontWeight:700, color: pal.body }}>{item.t2}</span>}
          </div>
          <div style={{ flex:1, textAlign:'right' }}>
            <span style={{ fontSize:32, fontWeight:900, color:item.c }}>{item.v}</span>
            <span style={{ fontSize:15, fontWeight:700, color:item.c, marginLeft:3 }}>{item.u}</span>
          </div>
        </div>
      ))}
    </div>
  );

  const equipKpi9 = [
    { label:'점검완료율', pct:checkRate,  change:'+7%' },
    { label:'가동률',     pct:93,          change:'+3%' },
    { label:'예방정비율', pct:80,          change:'+5%' },
    { label:'안전점검율', pct:93,          change:'+3%' },
  ];

  return (
    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr 1fr', gridTemplateRows:'minmax(0,1fr) minmax(0,1fr)', gap:16, height:'100%', minHeight:0, overflow:'hidden' }}>

      {/* ── R1C1 : 설비 점검 현황 ── */}
      <div style={card}>
        {badgeHdr9('설비 점검', '금일 기준')}
        {barChart9([{pct:checkRate},{pct:93},{pct:80}] as const, [['점검','완료율'],['가동','률'],['예방','정비']] as const)}
        {kpiGrid9([
          { t1:'총',  t2:'설비',  v:String(totalEquip), u:'대', c:DGR          },
          { t1:'점검', t2:'완료', v:String(checkedOk),  u:'대', c:DG           },
          { t1:'미',  t2:'완료',  v:String(notOk),      u:'대', c:notOk>0?DR:DG },
          { t1:'완료', t2:'율',   v:String(checkRate),  u:'%',  c:cBar(checkRate) },
        ] as const)}
      </div>

      {/* ── R1C2 : 설비 KPI ── */}
      <div style={card}>
        <DSLabel label="설비 KPI" />
        <div style={{ flex:1, minHeight:0, display:'grid', gridTemplateColumns:'1fr 1fr', gridTemplateRows:'1fr 1fr', gap:8 }}>
          {equipKpi9.map((item, idx) => <EsdCard key={item.label} label={item.label} pct={item.pct} change={item.change} idx={idx} />)}
        </div>
      </div>

      {/* ── R1C3 : 점검 활동 현황 ── */}
      <div style={card}>
        <DSLabel label="점검 활동 현황" />
        <div style={{ flex:1, minHeight:0, display:'grid', gridTemplateRows:'repeat(3, 1fr)', gap:8 }}>
          {actItems9.map(item => {
            const c = cBar(item.pct);
            const filled = Math.round(item.pct / 10);
            return (
              <div key={item.title} style={{ ...sub14, padding:'8px 12px', display:'flex', flexDirection:'column', justifyContent:'space-between' }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <span style={{ fontSize:18, fontWeight:700, color: pal.body }}>{item.title}</span>
                  <span style={{ fontSize:36, fontWeight:900, color:c, lineHeight:1 }}>{item.pct}<span style={{ fontSize:20 }}>%</span></span>
                </div>
                <div style={{ display:'flex', gap:4 }}>
                  {Array.from({ length:10 }, (_, i) => (
                    <motion.div key={i} initial={{ opacity:0, scaleY:0.4 }}
                      animate={{ opacity: i<filled ? 0.35+(i/9)*0.65 : 1, scaleY:1 }}
                      transition={{ duration:0.55, delay:i*0.045, ease:[0.22,1,0.36,1] }}
                      style={{ flex:1, height:14, borderRadius:4, background: i<filled ? c : pal.track, transformOrigin:'bottom' }}
                    />
                  ))}
                </div>
                <div style={{ fontSize:16, fontWeight:700, color:DGR }}>{item.goal}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── R1C4 : 설비 추이 ── */}
      <div style={card}>
        <DSLabel label="설비 추이" />
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, flexShrink:0 }}>
          {([
            { label:'미완료', v:String(notOk), u:'대', c:notOk>0?DR:DG },
            { label:'완료율', v:String(checkRate), u:'%', c:cBar(checkRate) },
          ] as const).map(item => (
            <div key={item.label} style={{ background:`${item.c}12`, border:`1.5px solid ${item.c}35`, borderRadius:12, padding:'8px 12px', textAlign:'center' }}>
              <div style={{ fontSize:18, fontWeight:700, color: pal.body }}>{item.label}</div>
              <div style={{ fontSize:36, fontWeight:900, color:item.c, lineHeight:1.1 }}>
                {item.v}<span style={{ fontSize:20 }}>{item.u}</span>
              </div>
            </div>
          ))}
        </div>
        <div style={{ flex:1, minHeight:0, display:'grid', gridTemplateColumns:'1fr 1fr', gridTemplateRows:'1fr 1fr', gap:8, marginTop:8 }}>
          {spark9.map(item => {
            const { line, area, xs, ys } = mkSpark(item.pts);
            return (
              <div key={item.id} style={{ ...sub14, padding:'0 12px', display:'flex', flexDirection:'column', overflow:'hidden' }}>
                <div style={{ flexShrink:0, display:'flex', justifyContent:'space-between', alignItems:'center', paddingTop:8, paddingBottom:4 }}>
                  <span style={{ fontSize:15, fontWeight:700, color:DGR, lineHeight:1 }}>{item.l}</span>
                  <span style={{ fontSize:22, fontWeight:900, color:item.c, lineHeight:1 }}>
                    {item.v}<span style={{ fontSize:13, fontWeight:600, marginLeft:2 }}>{item.u}</span>
                  </span>
                </div>
                <div style={{ flex:'1 1 0', minHeight:0 }}>
                  <svg width="100%" height="100%" viewBox="0 0 110 56" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id={item.id} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={item.c} stopOpacity="0.42" />
                        <stop offset="100%" stopColor={item.c} stopOpacity="0.02" />
                      </linearGradient>
                    </defs>
                    <path d={area} fill={`url(#${item.id})`} />
                    <path d={line} fill="none" stroke={item.c} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    {xs.map((x, i) => (
                      <g key={i}>
                        <text x={x} y={ys[i]-5} textAnchor="middle" fontSize="9" fill={item.c} fontWeight="800">{item.pts[i]}</text>
                        <circle cx={x} cy={ys[i]} r="3" fill={item.c} />
                      </g>
                    ))}
                  </svg>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── R2C1 : 설비 분류 현황 ── */}
      <div style={card}>
        {badgeHdr9('분류 현황', '금일 기준')}
        {barChart9([{pct:checkRate},{pct:80},{pct:93}] as const, [['점검','완료'],['예방','정비'],['안전','점검']] as const)}
        {kpiGrid9([
          { t1:'정기', t2:'점검', v:String(checkRate), u:'%', c:cBar(checkRate) },
          { t1:'예방', t2:'정비', v:'80',               u:'%', c:DA             },
          { t1:'안전', t2:'점검', v:'93',               u:'%', c:DG             },
          { t1:'긴급', t2:'조치', v:'0',                u:'건', c:DG             },
        ] as const)}
      </div>

      {/* ── R2C2~3 (colspan 2) : 설비 세부 목록 ── */}
      <div style={{ ...card, gridColumn:'span 2' }}>
        <DSLabel label="설비 세부 목록" />
        <div style={{ flex:1, minHeight:0, display:'flex', gap:14 }}>
          <div style={{ flex:1, display:'grid', gridTemplateRows:'repeat(3, 1fr)', gap:8 }}>
            {eduTracks9.map(item => {
              const c = cBar(item.val);
              const filled = Math.round(item.val / 10);
              return (
                <div key={item.label} style={{ ...sub14, padding:'8px 12px', display:'flex', flexDirection:'column', justifyContent:'space-between' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                    <span style={{ fontSize:18, fontWeight:700, color: pal.body }}>{item.label}</span>
                    <span style={{ fontSize:36, fontWeight:900, color:c, lineHeight:1 }}>{item.val}<span style={{ fontSize:20 }}>%</span></span>
                  </div>
                  <div style={{ display:'flex', gap:4 }}>
                    {Array.from({ length:10 }, (_, i) => (
                      <motion.div key={i} initial={{ opacity:0, scaleY:0.3 }}
                        animate={{ opacity: i<filled ? 0.35+(i/9)*0.65 : 1, scaleY:1 }}
                        transition={{ duration:0.5, delay:i*0.04, ease:[0.22,1,0.36,1] }}
                        style={{ flex:1, height:14, borderRadius:4, background: i<filled ? c : pal.track, transformOrigin:'bottom' }}
                      />
                    ))}
                  </div>
                  <div style={{ display:'flex', justifyContent:'space-between' }}>
                    <span style={{ fontSize:15, fontWeight:700, color:DGR }}>{item.target}</span>
                    <span style={{ fontSize:15, fontWeight:700, color:DGR }}>전일 {item.prev}</span>
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{ flex:'0 0 220px', display:'grid', gridTemplateColumns:'1fr 1fr', gridTemplateRows:'1fr 1fr', gap:8 }}>
            {eduStat9.map(item => {
              const filled = Math.round(Math.min(item.pct, 100) / 10);
              return (
                <div key={item.l} style={{ ...sub14, padding:'8px 10px', display:'flex', flexDirection:'column', alignItems:'center', gap:6, overflow:'hidden' }}>
                  <div style={{ fontSize:16, fontWeight:700, color:DGR, flexShrink:0, lineHeight:1 }}>{item.l}</div>
                  <div style={{ flex:1, minHeight:0, display:'flex', flexDirection:'column-reverse', gap:5, width:'55%' }}>
                    {Array.from({ length:10 }, (_, i) => (
                      <motion.div key={i} initial={{ opacity:0, scaleX:0.3 }}
                        animate={{ opacity: i<filled ? 0.35+(i/9)*0.65 : 1, scaleX:1 }}
                        transition={{ duration:0.5, delay:i*0.04, ease:[0.22,1,0.36,1] }}
                        style={{ flex:1, borderRadius:4, background: i<filled ? item.c : pal.track, transformOrigin:'left' }}
                      />
                    ))}
                  </div>
                  <div style={{ fontSize:22, fontWeight:900, color:item.c, lineHeight:1, flexShrink:0 }}>{item.v}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── R2C4 : 종합 요약 ── */}
      <div style={card}>
        <DSLabel label="종합 요약" />
        <div style={{ flex:1, minHeight:0, display:'grid', gridTemplateColumns:'1fr 1fr', gridTemplateRows:'repeat(3, minmax(0,1fr))', gap:8 }}>
          {([
            { l:'점검완료율', n:checkRate },  { l:'가동률',    n:93 },
            { l:'예방정비율', n:80        },  { l:'안전점검율', n:93 },
            { l: ko ? '미완료율' : 'Pending %', n: pendingRate },
            { l:'종합달성',   n:Math.round((checkRate+93+80+93)/4) },
          ] as const).map((item, idx) => {
            const isPendingPct = item.l === (ko ? '미완료율' : 'Pending %');
            const c = cBar(isPendingPct ? 100 - item.n : item.n);
            const grade = isPendingPct
              ? (item.n === 0 ? '달성' : item.n <= 10 ? '주의' : '미달')
              : item.n >= 90 ? '달성' : item.n >= 80 ? '주의' : '미달';
            return (
              <div key={item.l} style={{ background:`${c}12`, border:`1.5px solid ${c}35`, borderRadius:14, padding:'12px 14px', display:'flex', flexDirection:'column', justifyContent:'space-between', overflow:'hidden', minHeight:0 }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexShrink:0 }}>
                  <span style={{ fontSize:15, fontWeight:800, color: pal.body, lineHeight:1.25 }}>{item.l}</span>
                  <span style={{ display:'inline-block', padding:'4px 12px', borderRadius:999, fontSize:14, fontWeight:800, background:`${c}22`, color:c, lineHeight:1.2, flexShrink:0 }}>{grade}</span>
                </div>
                <div style={{ display:'flex', alignItems:'baseline', gap:3, flexShrink:0 }}>
                  <span style={{ fontSize:44, fontWeight:900, color:c, lineHeight:1 }}>{item.n}</span>
                  <span style={{ fontSize:20, fontWeight:700, color:c }}>%</span>
                </div>
                <div style={{ height:20, background:`${c}20`, borderRadius:999, overflow:'hidden', flexShrink:0 }}>
                  <div style={{ width: ready ? `${item.n}%` : '0%', transition: `width 1s cubic-bezier(0.22,1,0.36,1) ${idx*0.14}s`, height:'100%', background:`linear-gradient(90deg, ${c}99 0%, ${c} 100%)`, borderRadius:999, display:'flex', alignItems:'center', justifyContent:'flex-end', paddingRight:7 }}>
                    {item.n >= 20 && <span style={{ fontSize:11, fontWeight:900, color:'#fff', lineHeight:1 }}>{item.n}%</span>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}

// ── 메인 대시보드 컴포넌트 ─────────────────────────────────────────────────
const DASH_INTERVALS = [1, 3, 5, 10, 15, 20, 30, 45, 60, 90] as const;

// ── 모듈 상수 ────────────────────────────────────────────────────────────
const _SHOW    = 5;
const _L       = 1;   // 좌측 트리거 슬롯 (0-indexed)
const _R       = 3;   // 우측 트리거 슬롯 (0-indexed)
const _MAX_OFF = DASH_INTERVALS.length - _SHOW;  // 5
const _cl      = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

const _calcOff = (fi: number, curOff: number, round = false): number => {
  const slot = fi - curOff;
  let no = curOff;
  if      (slot < _L) no = fi - _L;
  else if (slot > _R) no = fi - _R;
  return _cl(round ? Math.round(no) : no, 0, _MAX_OFF);
};

// ── DashIntervalPicker ────────────────────────────────────────────────────────
//  · 전체 10개 항목, 윈도우 5개 표시, 기본값 10초(윈도우 3번째)
//  · 드래그: pill이 포인터를 부드럽게 추적 (float offset, duration:0)
//            슬롯 L(2번째)/R(4번째) 도달 시 스트립이 연속적으로 함께 스크롤
//            선택값은 가장 가까운 항목 기준 자동 갱신
//            드래그 종료 시 가장 가까운 항목에 spring 정착
//  · 클릭:  클릭 항목으로 pill spring 이동
//            슬롯 L/R 클릭 시 숨겨진 항목 있으면 스트립 1칸 스크롤
//  · 높이:  H(= fontSize+14) 단일 기준으로 컨테이너·pill·아이템 공유
function DashIntervalPicker({ value, onChange, ko, itemW = 46, fontSize = 11, trackH, dark = false }: {
  value: number; onChange: (v: number) => void; ko: boolean;
  itemW?: number; fontSize?: number; trackH?: number; dark?: boolean;
}) {
  const ALL = DASH_INTERVALS;
  const N   = ALL.length;  // 10

  const selIdx = _cl(ALL.indexOf(value as (typeof ALL)[number]), 0, N - 1);
  const selRef = useRef(selIdx);
  selRef.current = selIdx;

  // ─ 높이 상수 (모든 요소 공통) ──────────────────────────────────────────
  const H  = trackH ?? (fontSize + 14);
  const PH = H - 4;

  // ─ 스트립 오프셋 ── offRef를 즉시 갱신해 stale 클로저 방지 ─────────────
  const [off, setOff_] = useState(() => _cl(selIdx - 2, 0, _MAX_OFF));
  const offRef = useRef(off);
  const setOff = useCallback((v: number, round = true) => {
    const nv = round ? _cl(Math.round(v), 0, _MAX_OFF) : _cl(v, 0, _MAX_OFF);
    offRef.current = nv; setOff_(nv);
  }, []);

  // ─ pill X 위치 (윈도우 기준 px) ────────────────────────────────────────
  const [pillX, setPillX] = useState(() => (selIdx - offRef.current) * itemW);

  // ─ 애니메이션 모드 ─────────────────────────────────────────────────────
  // dragging=true → 드래그 중 전체 duration:0, false → spring
  const [dragging, setDragging] = useState(false);

  // ─ 드래그 상태 ─────────────────────────────────────────────────────────
  const drag = useRef({ on: false, x0: 0, si0: 0, didMove: false, lastFi: 0 });

  useEffect(() => {
    if (drag.current.on) return;
    const o = _cl(selIdx - 2, 0, _MAX_OFF);
    setOff(o);
    setPillX((selIdx - o) * itemW);
    setDragging(false);
  }, [selIdx, itemW]);

  // ─ 이벤트 핸들러 ───────────────────────────────────────────────────────

  const onDown = useCallback((e: React.PointerEvent) => {
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    const si = selRef.current;
    drag.current = { on: true, x0: e.clientX, si0: si, didMove: false, lastFi: si };
    setDragging(true);
  }, []);

  const onMove = useCallback((e: React.PointerEvent) => {
    if (!drag.current.on) return;
    const dx = e.clientX - drag.current.x0;
    if (Math.abs(dx) > 4) drag.current.didMove = true;

    const fi = _cl(drag.current.si0 + dx / itemW, 0, N - 1);
    drag.current.lastFi = fi;

    // 드래그 중: float 오프셋으로 스트립이 부드럽게 따라옴
    const no       = _calcOff(fi, offRef.current, false);
    const pillSlot = fi - no;

    setOff(no, false);
    setPillX(_cl(pillSlot, 0, _SHOW - 1) * itemW);

    // 선택값은 가장 가까운 항목 기준으로 갱신
    const nearIdx = _cl(Math.round(fi), 0, N - 1);
    if (nearIdx !== selRef.current) onChange(ALL[nearIdx]);
  }, [itemW, N, onChange]);

  const onUp = useCallback((e: React.PointerEvent) => {
    if (!drag.current.on) return;
    drag.current.on = false;
    setDragging(false);  // spring 모드로 전환

    if (!drag.current.didMove) {
      const curOff = Math.round(offRef.current);
      const rect   = (e.currentTarget as HTMLElement).getBoundingClientRect();
      const cs     = _cl(Math.floor((e.clientX - rect.left) / itemW), 0, _SHOW - 1);
      const ci     = _cl(cs + curOff, 0, N - 1);

      let no = curOff;
      if      (cs === _L && no > 0)        no -= 1;
      else if (cs === _R && no < _MAX_OFF) no += 1;
      no = _cl(no, 0, _MAX_OFF);

      setOff(no);
      setPillX((ci - no) * itemW);
      onChange(ALL[ci]);
    } else {
      const fi      = drag.current.lastFi;
      const nearIdx = _cl(Math.round(fi), 0, N - 1);
      const no      = _calcOff(nearIdx, offRef.current, true);
      setOff(no);
      setPillX(_cl(nearIdx - no, 0, _SHOW - 1) * itemW);
      if (nearIdx !== selRef.current) onChange(ALL[nearIdx]);
    }
  }, [itemW, N, onChange]);

  // ─ 색상 ────────────────────────────────────────────────────────────────
  const bg     = dark ? 'rgba(255,255,255,0.10)' : '#E8E8ED';
  const pillBg = dark ? 'rgba(255,255,255,0.22)' : '#1D1D1F';
  const pillSh = dark ? '0 1px 6px rgba(0,0,0,0.4)' : '0 1px 4px rgba(0,0,0,0.18)';
  const onC    = '#fff';
  const offC   = dark ? 'rgba(255,255,255,0.45)' : '#6E6E73';

  return (
    <div
      onPointerDown={onDown} onPointerMove={onMove}
      onPointerUp={onUp}     onPointerCancel={onUp}
                style={{
        position: 'relative',
        width: _SHOW * itemW,
        height: H,              // 단일 기준 높이
        overflow: 'hidden',
        borderRadius: 999,
        background: bg,
        flexShrink: 0,
        cursor: 'grab',
        userSelect: 'none',
        touchAction: 'none',
      }}
    >
      {/* pill — 원형, 슬롯 중앙 정렬 */}
      <motion.div
        animate={{ x: pillX + (itemW - PH) / 2 }}
        transition={dragging
          ? { duration: 0 }
          : { type: 'spring', stiffness: 520, damping: 34 }
        }
        style={{
          position: 'absolute',
          left: 0, top: 2,
          width: PH, height: PH,
          borderRadius: '50%',
          background: pillBg,
          boxShadow: pillSh,
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      {/* 항목 스트립 — pill이 L/R 트리거 도달 시 함께 슬라이딩 */}
      <motion.div
        animate={{ x: -off * itemW }}
        transition={dragging
          ? { duration: 0 }
          : { type: 'spring', stiffness: 420, damping: 36 }
        }
        style={{
          display: 'flex',
          height: H,           // 스트립도 동일 기준 높이
          position: 'relative',
          zIndex: 2,
        }}
      >
        {ALL.map((sec, i) => (
          <div key={sec} style={{
            flex: `0 0 ${itemW}px`,  // flexShrink 방지 — 이게 없으면 10개가 모두 축소되어 보임
            width: itemW, height: H,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize, fontWeight: 600, lineHeight: 1,
            color: i === selIdx ? onC : offC,
            whiteSpace: 'nowrap',
            transition: 'color .15s',
          }}>
            {sec}{ko ? '초' : 's'}
          </div>
        ))}
      </motion.div>
          </div>
  );
}

// 실시간 시계 훅
const DashClock = memo(function DashClock({ ko, isDark }: { ko: boolean; isDark?: boolean }) {
  const [time, setTime] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  const dateC = isDark ? '#a1a1a6' : '#6B7280';
  const timeC = isDark ? '#f5f5f7' : '#1D1D1F';
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'flex-end', gap: 18 }}>
      <span style={{ fontSize: 24, fontWeight: 600, color: dateC, letterSpacing: '0.03em', fontVariantNumeric: 'tabular-nums' }}>
        {time.toLocaleDateString(ko ? 'ko-KR' : 'en-US', { year: 'numeric', month: '2-digit', day: '2-digit' })}
      </span>
      <span style={{ fontSize: 38, fontWeight: 800, letterSpacing: '0.05em', color: timeC, fontVariantNumeric: 'tabular-nums', lineHeight: 1, fontFamily: '"SF Mono", "Roboto Mono", monospace' }}>
        {time.toLocaleTimeString(ko ? 'ko-KR' : 'en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
      </span>
    </div>
  );
});

// WIZ-Flow 대시보드: FHD(1920×1080) 네이티브 해상도 (모든 px 값이 직접 FHD 기준)
const DASH_FHD_W = 1920;
const DASH_FHD_H = 1080;

function WizFlowDashboard({
  ko,
  si,
  direction,
  onGoTo,
  theme = 'light',
}: {
  ko: boolean;
  si: number;
  direction: 1 | -1;
  onGoTo: (i: number) => void;
  theme?: 'light' | 'dark';
}) {
  const isDark = theme === 'dark';
  const t = useMemo(() => getDashPalette(isDark), [isDark]);
  const TOTAL = 10;
  const TITLES = ko
    ? ['시스템 현황', '시스템 현황', '사업부1 점검표', '사업부2 점검표', '라인 점검표', '다기능 이력 카드 #1', '다기능 이력 카드 #2', '개선 제안 현황', '5S 현황', '라인 레이아웃']
    : ['System Overview', 'System Overview', 'BU1 Checklist', 'BU2 Checklist', 'Line Checklist', 'Multi-Function #1', 'Multi-Function (2)', 'Improvement', '5S Status', 'Line Layout'];

  const ScreenComponent = [DashScreen1, DashScreen2, DashScreen3, DashScreen4, DashScreen5, DashScreen6, DashScreen6_1, DashScreen7, DashScreen8, DashScreen9][si];

  /** 다크: pageBg와 동일한 좌우 여백이 패널 바깥 ‘검은 띠’로 보여 라이트보다 좁게 느껴짐 → 라이트는 기존 유지 */
  const dashPadHeaderX = isDark ? 22 : 48;
  const dashPadBodyX = isDark ? 8 : 20;

  return (
    <DashThemeContext.Provider value={isDark}>
      <div
        style={{
          width: DASH_FHD_W,
          height: DASH_FHD_H,
          overflow: 'hidden',
          position: 'relative',
          background: t.pageBg,
          flexShrink: 0,
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
          fontSize: 22,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* ── 상단 제목 라벨 + 시계 ── */}
        <div
          style={{
            padding: `12px ${dashPadHeaderX}px`,
            flexShrink: 0,
            display: 'grid',
            gridTemplateColumns: '1fr auto 1fr',
            alignItems: 'center',
          }}
        >
          <div />

          <AnimatePresence mode="wait">
            <motion.span
              key={si}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
              style={{
                display: 'inline-block',
                padding: '8px 24px',
                borderRadius: 12,
                background: LG_RED,
                color: '#fff',
                fontSize: 26,
                fontWeight: 700,
                letterSpacing: '0.02em',
                whiteSpace: 'nowrap',
                boxShadow: isDark ? '0 4px 20px rgba(179,7,16,0.35)' : undefined,
              }}
            >
              {TITLES[si]}
            </motion.span>
          </AnimatePresence>

          <DashClock ko={ko} isDark={isDark} />
        </div>

        <div style={{ flex: '1 1 0px', minHeight: 0, minWidth: 0, overflow: 'hidden', position: 'relative' }}>
          <AnimatePresence initial={false} mode="popLayout">
            <motion.div
              key={si}
              initial={{ opacity: 0, x: direction > 0 ? 24 : -24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction > 0 ? -24 : 24 }}
              transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }}
              style={{
                inset: 0,
                overflow: 'hidden',
                position: 'absolute',
                willChange: 'opacity, transform',
                padding: `14px ${dashPadBodyX}px`,
                boxSizing: 'border-box',
              }}
            >
              <ScreenComponent ko={ko} />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── 하단 도트 인디케이터 ── */}
        <div
          style={{
            padding: '14px 0 12px',
            flexShrink: 0,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 14,
            background: 'transparent',
          }}
        >
          {Array.from({ length: TOTAL }, (_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => onGoTo(i)}
              style={{
                width: i === si ? 28 : 8,
                height: 8,
                borderRadius: 999,
                border: 'none',
                padding: 0,
                cursor: 'pointer',
                background: i === si ? LG_RED : isDark ? '#48484a' : '#C9CBD0',
                transition: 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
              }}
            />
          ))}
        </div>
      </div>
    </DashThemeContext.Provider>
  );
}

/**
 * 풀스크린·TV 공통: 1920×1080 논리 캔버스를 컨테이너에 맞게 축소.
 * - 예전 `zoom`만 쓰면 flex 가운데 정렬 시 **레이아웃 박스가 1920×1080으로 남는** 브라우저가 있어
 *   TV 베젤 안에서 화면이 잘리거나 어긋남.
 * - 바깥에 **실제 표시 크기(1920×scale × 1080×scale)** 박스를 두고, 안쪽은 transform scale + origin 0 0으로 맞춤.
 */
function WizFlowFhdScaledCanvas({ scale, children }: { scale: number; children: React.ReactNode }) {
  const s = Number.isFinite(scale) && scale > 0 ? scale : 1;
  const viewW = DASH_FHD_W * s;
  const viewH = DASH_FHD_H * s;
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'relative',
          width: viewW,
          height: viewH,
          flexShrink: 0,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: DASH_FHD_W,
            height: DASH_FHD_H,
            transform: `scale(${s})`,
            transformOrigin: '0 0',
            transformStyle: 'flat' as const,
            backfaceVisibility: 'hidden',
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

function FhdCanvasChrome({ ko, variant = 'light' }: { ko: boolean; variant?: 'light' | 'atv' }) {
  const atv = variant === 'atv';
  return (
    <>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          boxShadow: atv
            ? `
            inset 0 0 0 1px rgba(255,255,255,0.14),
            inset 0 0 0 2px rgba(0,0,0,0.55),
            0 2px 16px rgba(0,0,0,0.45)
          `
            : `
            inset 0 0 0 1px rgba(0,0,0,0.06),
            inset 0 0 0 2px rgba(255,255,255,0.95),
            0 2px 12px rgba(0,0,0,0.06)
          `,
          borderRadius: 2,
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 10,
          pointerEvents: 'none',
          border: atv ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.05)',
          borderRadius: 1,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 18,
          bottom: 16,
          pointerEvents: 'none',
          padding: '5px 10px',
          borderRadius: 4,
          fontSize: 20,
          fontWeight: 700,
          letterSpacing: '0.04em',
          color: atv ? 'rgba(255,255,255,0.88)' : '#424245',
          background: atv ? 'rgba(0,0,0,0.45)' : 'rgba(255,255,255,0.92)',
          border: atv ? '1px solid rgba(255,255,255,0.14)' : '1px solid rgba(0,0,0,0.08)',
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
          boxShadow: atv ? '0 2px 8px rgba(0,0,0,0.4)' : '0 1px 2px rgba(0,0,0,0.04)',
        }}
      >
        {ko ? '1920 × 1080 · FHD 캔버스' : '1920 × 1080 · FHD canvas'}
      </div>
    </>
  );
}

/**
 * LG TV 목업 **패널 영역(16:9 내부)** = 1920×1080 FHD 논리 캔버스의 축소판.
 * 풀스크린과 별도: `min(패널w/1920, 패널h/1080)` 로 contain 맞춤 (추가 inset 없음).
 * UHD/FHD는 배경·FHD 크롬 오버레이만 다르고, 스케일은 동일.
 */
function WizFlowFhdTvFit({
  children,
  canvasMode,
  ko,
  atvSurface = false,
  /** 다크 대시+UHD일 때 밝은 회색 레터박스 대신 TV 내부(#0a0a0c)와 맞춤 */
  uhdLetterboxDark = false,
}: {
  children: React.ReactNode;
  canvasMode: 'UHD' | 'FHD';
  ko?: boolean;
  /** Apple TV 패널: 어두운 레터박스 + FHD 크롬 */
  atvSurface?: boolean;
  uhdLetterboxDark?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  /** 측정 전·실패 시 1이면 1920×1080이 그대로 그려져 패널이 '확대'·잘림처럼 보임 → 보수적 작은 값만 사용 */
  const lastGoodScale = useRef(0.22);
  const [scale, setScale] = useState(() => lastGoodScale.current);
  const isFhdCanvas = canvasMode === 'FHD';

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => {
      const r = el.getBoundingClientRect();
      const w = r.width;
      const h = r.height;
      if (w < 2 || h < 2) return;
      const s = Math.min(w / DASH_FHD_W, h / DASH_FHD_H);
      if (!Number.isFinite(s) || s <= 0) return;
      lastGoodScale.current = s;
      setScale(s);
    };
    update();
    const ro = new ResizeObserver((entries) => {
      const e = entries[0];
      if (!e) return;
      const box = e.contentBoxSize?.[0];
      const w = box?.inlineSize ?? e.contentRect.width;
      const h = box?.blockSize ?? e.contentRect.height;
      if (w < 2 || h < 2) return;
      const s = Math.min(w / DASH_FHD_W, h / DASH_FHD_H);
      if (!Number.isFinite(s) || s <= 0) return;
      lastGoodScale.current = s;
      setScale(s);
    });
    ro.observe(el, { box: 'content-box' });
    return () => ro.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        boxSizing: 'border-box',
        overflow: 'hidden',
        ...(isFhdCanvas
          ? atvSurface
            ? {
                background: `
                  radial-gradient(ellipse 120% 80% at 50% 45%, rgba(52,52,56,0.92) 0%, rgba(16,16,18,1) 55%),
                  repeating-linear-gradient(0deg, transparent, transparent 11px, rgba(255,255,255,0.03) 11px, rgba(255,255,255,0.03) 12px),
                  repeating-linear-gradient(90deg, transparent, transparent 11px, rgba(255,255,255,0.03) 11px, rgba(255,255,255,0.03) 12px)
                `,
                backgroundColor: '#121214',
              }
            : {
                background: `
                  radial-gradient(ellipse 120% 80% at 50% 45%, rgba(255,255,255,0.98) 0%, rgba(245,245,247,1) 55%),
                  repeating-linear-gradient(0deg, transparent, transparent 11px, rgba(0,0,0,0.03) 11px, rgba(0,0,0,0.03) 12px),
                  repeating-linear-gradient(90deg, transparent, transparent 11px, rgba(0,0,0,0.03) 11px, rgba(0,0,0,0.03) 12px)
                `,
                backgroundColor: '#e8e8ed',
              }
          : { background: atvSurface ? '#141416' : (uhdLetterboxDark ? '#0a0a0c' : '#f5f5f7') }),
      }}
    >
      <WizFlowFhdScaledCanvas scale={scale}>
        {children}
        {isFhdCanvas && <FhdCanvasChrome ko={!!ko} variant={atvSurface ? 'atv' : 'light'} />}
      </WizFlowFhdScaledCanvas>
    </div>
  );
}

// ── 전체화면 오버레이 — 뷰포트 기준 FHD 논리 캔버스 (TV 목업 스케일과 독립) ────
const FS_REF_W = DASH_FHD_W;
const FS_REF_H = DASH_FHD_H;

const DashFullscreenOverlay = forwardRef<
  HTMLDivElement,
  {
    onMouseMove: (e: React.MouseEvent) => void;
    ko: boolean;
    dashSi: number;
    dashTotal: number;
    dashDirection: 1 | -1;
    dashGoTo: (i: number) => void;
    onPrev: () => void;
    onNext: () => void;
    resolution: 'UHD' | 'FHD';
    dashTheme?: 'light' | 'dark';
    children?: React.ReactNode;
  }
>(({ onMouseMove, ko, dashSi, dashTotal, dashDirection, dashGoTo, onPrev, onNext, resolution, dashTheme = 'light', children }, ref) => {
  const [baseScale, setBaseScale] = useState(1);

  useEffect(() => {
    const calc = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      setBaseScale(Math.min(vw / FS_REF_W, vh / FS_REF_H));
    };
    calc();
    window.addEventListener('resize', calc);
    return () => window.removeEventListener('resize', calc);
  }, []);

  /** 전체화면: 라이트(FHD 배경)·다크(UHD 배경) 모두 뷰포트에 1920×1080이 꽉 차도록 동일 스케일 (예전 FHD만 0.84 inset 적용은 라이트가 작아 보여 제거) */
  const effectiveScale = baseScale;
  const fhdFsBg =
    'radial-gradient(ellipse 120% 80% at 50% 45%, rgba(255,255,255,0.98) 0%, rgba(245,245,247,1) 55%), repeating-linear-gradient(0deg, transparent, transparent 11px, rgba(0,0,0,0.03) 11px, rgba(0,0,0,0.03) 12px), repeating-linear-gradient(90deg, transparent, transparent 11px, rgba(0,0,0,0.03) 11px, rgba(0,0,0,0.03) 12px)';

  return (
    <div
      ref={ref}
      onMouseMove={onMouseMove}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        ...(resolution === 'FHD'
          ? { backgroundColor: '#e8e8ed', backgroundImage: fhdFsBg }
          : { background: dashTheme === 'dark' ? '#0a0a0c' : '#f5f5f7' }),
      }}
    >
      {/* 대시보드 레이어 — TV와 동일 스케일 계수(WizFlowFhdScaledCanvas) */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', zIndex: 1 }}>
        <WizFlowFhdScaledCanvas scale={effectiveScale}>
          <WizFlowDashboard ko={ko} si={dashSi} direction={dashDirection} onGoTo={dashGoTo} theme={dashTheme} />
        </WizFlowFhdScaledCanvas>
      </div>
      {/* 좌/우 클릭 슬라이드 영역 (아이콘 없이 투명 클릭 영역) */}
      <div onClick={onPrev} style={{ position: 'absolute', left: 0, top: 0, width: '8%', height: '100%', zIndex: 2, cursor: 'pointer' }} />
      <div onClick={onNext} style={{ position: 'absolute', right: 0, top: 0, width: '8%', height: '100%', zIndex: 2, cursor: 'pointer' }} />
      {/* UI 오버레이 레이어 — 리모트바 등 (별도 z-index) */}
      {children}
    </div>
  );
});

// ── TV 목업 프레임 — apple: 흰 카드+다크 베젤(apple.com 제품 컷) / atv: 무광 베젤만 / light: 밝은 베젤
function LGTVFrame({ children, variant = 'light' }: { children: React.ReactNode; variant?: 'light' | 'atv' | 'apple' }) {
  if (variant === 'apple') {
    return (
      <div
        style={{
          width: '100%',
          ...APPLE_TV_DISPLAY_CARD,
          padding: '12px 14px 14px',
        }}
      >
        <div
          style={{
            borderRadius: 12,
            padding: 5,
            background: 'linear-gradient(165deg, #2e2e31 0%, #1a1a1c 100%)',
            boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.32), inset 0 0 0 1px rgba(255,255,255,0.08)',
          }}
        >
          <div
            style={{
              width: '100%',
              aspectRatio: '16 / 9',
              borderRadius: 8,
              overflow: 'hidden',
              background: '#0a0a0c',
              border: '1px solid rgba(0,0,0,0.4)',
              position: 'relative',
              boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.07)',
            }}
          >
            <div style={{ position: 'absolute', inset: 0 }}>{children}</div>
          </div>
        </div>
      </div>
    );
  }
  if (variant === 'atv') {
    return (
      <div
        style={{
          width: '100%',
          borderRadius: 12,
          padding: 6,
          background: 'linear-gradient(165deg, #2a2a2d 0%, #1a1a1c 100%)',
          boxShadow: 'inset 0 2px 12px rgba(0,0,0,0.45), inset 0 0 0 1px rgba(255,255,255,0.1)',
        }}
      >
        <div
          style={{
            width: '100%',
            aspectRatio: '16 / 9',
            borderRadius: 8,
            overflow: 'hidden',
            background: '#070708',
            border: '1px solid rgba(255,255,255,0.12)',
            position: 'relative',
            boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.55)',
          }}
        >
          <div style={{ position: 'absolute', inset: 0 }}>{children}</div>
        </div>
      </div>
    );
  }
  return (
    <div
      style={{
        width: '100%',
        background: 'linear-gradient(180deg, #ffffff 0%, #fafafa 100%)',
        borderRadius: 12,
        padding: 8,
        boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.06), 0 4px 20px rgba(0,0,0,0.06)',
      }}
    >
      <div
        style={{
          width: '100%',
          aspectRatio: '16 / 9',
          borderRadius: 10,
          overflow: 'hidden',
          background: '#e8e8ed',
          border: '1px solid rgba(0,0,0,0.08)',
          position: 'relative',
        }}
      >
        <div style={{ position: 'absolute', inset: 0 }}>{children}</div>
      </div>
    </div>
  );
}

const WIZ_FLOW_Q_OPEN = '\u201C'; // “
const WIZ_FLOW_Q_CLOSE = '\u201D'; // ”

function renderWizFlowInsightBoldSegment(segment: string, keyPrefix: string, baseColor: string, accentColor: string): ReactNode[] {
  return segment.split(/(\*\*[^*]+\*\*)/g).map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      const inner = part.slice(2, -2);
      return (
        <span key={`${keyPrefix}-${i}`} style={{ color: accentColor, fontWeight: 800 }}>
          {inner}
        </span>
      );
    }
    return (
      <span key={`${keyPrefix}-${i}`} style={{ color: baseColor, fontWeight: 600 }}>
        {part}
      </span>
    );
  });
}

/** WIZ-Flow 모듈 인사이트 말풍선: `“…”` → 시작 WizFlowQuoteClose·끝 WizFlowQuoteOpen, `**강조**`, `\n` 줄바꿈 */
function renderWizFlowInsightRichText(text: string, baseColor: string, accentColor: string): ReactNode {
  const lines = text.split('\n');
  return lines.map((line, lineIdx) => {
    const nodes: ReactNode[] = [];
    let rest = line;
    let k = 0;
    const qo = `q-${lineIdx}`;
    while (rest.length) {
      const oi = rest.indexOf(WIZ_FLOW_Q_OPEN);
      if (oi === -1) {
        nodes.push(...renderWizFlowInsightBoldSegment(rest, `${qo}-t${k++}`, baseColor, accentColor));
        break;
      }
      if (oi > 0) {
        nodes.push(...renderWizFlowInsightBoldSegment(rest.slice(0, oi), `${qo}-t${k++}`, baseColor, accentColor));
      }
      const ci = rest.indexOf(WIZ_FLOW_Q_CLOSE, oi + 1);
      if (ci === -1) {
        nodes.push(...renderWizFlowInsightBoldSegment(rest.slice(oi), `${qo}-t${k++}`, baseColor, accentColor));
        break;
      }
      nodes.push(
        <WizFlowQuoteClose
          key={`${qo}-open${k}`}
          className="inline-block align-[-0.12em] w-[0.92em] h-[0.92em] shrink-0 mx-px relative top-[0.06em]"
          color="#0f172a"
        />,
      );
      k += 1;
      nodes.push(...renderWizFlowInsightBoldSegment(rest.slice(oi + 1, ci), `${qo}-in${k++}`, baseColor, accentColor));
      nodes.push(
        <WizFlowQuoteOpen
          key={`${qo}-close${k}`}
          className="inline-block align-[-0.12em] w-[0.92em] h-[0.92em] shrink-0 mx-px relative top-[0.06em]"
          color="#0f172a"
        />,
      );
      k += 1;
      rest = rest.slice(ci + 1);
    }
    return (
      <span key={lineIdx} className="block">
        {nodes}
      </span>
    );
  });
}

/** 인사이트 카피 끝·강조구 끝의 마침표(., 。) 제거 */
function stripInsightTrailingPeriods(s: string): string {
  return s.replace(/[\.\u3002]+\s*$/u, '').trimEnd();
}

/**
 * WIZ-Flow 인사이트: `"핵심"` 구간은 큰 글씨·메인컬러 + WizFlowQuoteClose → WizFlowQuoteOpen (기존 장식 순서 유지).
 * 강조 앞(오픈 쪽)은 살짝 위, 강조 뒤(닫힘 쪽)는 살짝 아래.
 * (선택) 과거 `\n> …` 형식이 있으면 `>` 뒤만 사용.
 */
function WizFlowInsightBubbleBody({
  text,
  baseColor,
  accentColor,
}: {
  text: string;
  baseColor: string;
  accentColor: string;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const trimmed = text.trim();
  const parts = trimmed.split(/\r?\n\s*>\s*/);
  const subRaw =
    parts.length >= 2 ? parts.slice(1).join('\n').trim() : parts[0].replace(/^\s*>\s*/, '').trim();

  let subForQuotes = subRaw.replace(/\u201C/g, '"').replace(/\u201D/g, '"');
  subForQuotes = stripInsightTrailingPeriods(subForQuotes);

  const quoteIconBase =
    'inline-block shrink-0 mx-0.5 w-[1em] h-[1em] align-[-0.12em] relative';
  /** 강조 앞 장식(오픈 위치) — 위로 살짝 */
  const quoteLeadingCls = `${quoteIconBase} -top-[3px]`;
  /** 강조 뒤 장식(닫힘 위치) — 아래로 살짝 */
  const quoteTrailingCls = `${quoteIconBase} top-[3px]`;

  const qm = subForQuotes.match(/^([\s\S]*?)"([^"]+)"([\s\S]*)$/);
  /** 이 두 강조구 뒤 꼬리(생깁니다 등)는 표시하지 않음 */
  const tailAfterQuote =
    qm && (qm[2] === '현장에서 바로' || qm[2] === 'on the shop floor') ? '' : (qm?.[3] ?? '');
  const tailShown = stripInsightTrailingPeriods(tailAfterQuote);

  useLayoutEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const centerIfOverflow = () => {
      const excess = el.scrollWidth - el.clientWidth;
      if (excess > 0) el.scrollLeft = excess / 2;
      else el.scrollLeft = 0;
    };
    centerIfOverflow();
    if (typeof ResizeObserver === 'undefined') return undefined;
    const ro = new ResizeObserver(centerIfOverflow);
    ro.observe(el);
    return () => ro.disconnect();
  }, [text, subForQuotes]);

  return (
    <div
      ref={scrollRef}
      className="max-w-full overflow-x-auto text-center text-[11px] leading-snug sm:text-[12px] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
    >
      {qm ? (
        <span className="inline-flex flex-nowrap items-center justify-center gap-0 whitespace-nowrap px-3 font-semibold">
          <span style={{ color: baseColor }}>{stripInsightTrailingPeriods(qm[1])}</span>
          <WizFlowQuoteClose className={quoteLeadingCls} color={accentColor} />
          <span
            className="shrink-0 px-0.5 text-[clamp(12px,3.1vw,14px)] font-black tracking-tight"
            style={{ color: accentColor }}
          >
            {stripInsightTrailingPeriods(qm[2])}
          </span>
          <WizFlowQuoteOpen className={quoteTrailingCls} color={accentColor} />
          <span style={{ color: baseColor }}>{tailShown}</span>
        </span>
      ) : (
        <span className="inline-block whitespace-nowrap font-semibold" style={{ color: baseColor }}>
          {renderWizFlowInsightRichText(subRaw, baseColor, accentColor)}
        </span>
      )}
    </div>
  );
}

/** WIZ-Flow 카드 리스트 `제목||부제` — 첨부 시안(중앙 2줄 타이포) */
function splitWizFlowStackedLine(raw: string): { head: string; sub: string } {
  const i = raw.indexOf('||');
  if (i === -1) return { head: raw.trim(), sub: '' };
  return { head: raw.slice(0, i).trim(), sub: raw.slice(i + 2).trim() };
}

/**
 * WIZ-Flow 모달 — 하단 KEY FEATURES / WHY WIZ-Flow 등 공통 타일
 * - `stacked`: `WizFlowFeatureCapabilityCard`와 동일 솔리드 셸(rounded-[22px]·흰 배경·동일 섀도)
 * - `row`: 글라스 체크 타일(레거리 스타일)
 */
function WizFlowDashCheckTile({
  children,
  icon: Icon,
  className,
  variant = 'row',
}: {
  children: React.ReactNode;
  icon?: LucideIcon;
  /** 그리드 행 높이 맞출 때: `h-full min-h-0 flex flex-col` */
  className?: string;
  /** stacked: 체크 아이콘 없이 중앙 정렬 2줄, 문자열에 `||` 구분 — 타이포는 핵심 기능 카드 짧은 타이틀과 동일 계열 */
  variant?: 'row' | 'stacked';
}) {
  const CheckOrIcon = Icon ?? CheckCircle2;
  const isLucideDefault = !Icon;
  const SLATE_DARK = '#475569';
  /** stacked 부제(`||` 뒤) — 보조 문구 */
  const STACK_SUB = '#8e8e93';

  if (variant === 'stacked' && typeof children === 'string') {
    const { head, sub } = splitWizFlowStackedLine(children);
    return (
      <div
        className={`flex min-h-0 flex-col overflow-hidden rounded-[22px] bg-white p-4 shadow-[0_2px_16px_rgba(0,0,0,0.06)] sm:p-5 ${className ?? ''}`}
        style={{ WebkitFontSmoothing: 'antialiased', boxSizing: 'border-box' }}
      >
        <div className="flex min-h-0 flex-1 flex-col items-center justify-center text-center">
          <p
            className="m-0 line-clamp-4 min-h-0 max-w-full break-words text-[10px] font-semibold leading-snug tracking-[-0.02em] sm:text-[11px]"
            style={{ color: '#1d1d1f', fontFeatureSettings: '"tnum"' }}
          >
            {head}
          </p>
          {sub ? (
            <p
              className="mt-1 max-w-[16rem] text-[10px] font-semibold leading-snug sm:max-w-none sm:text-[11px]"
              style={{ color: STACK_SUB }}
            >
              {sub}
            </p>
          ) : null}
        </div>
      </div>
    );
  }

  const glassTile: CSSProperties = {
    background: [
      'linear-gradient(155deg, rgba(255,255,255,0.78) 0%, rgba(255,255,255,0.42) 42%, rgba(226,232,240,0.52) 100%)',
      'linear-gradient(200deg, rgba(148,163,184,0.14) 0%, transparent 52%)',
    ].join(', '),
    backdropFilter: 'blur(14px) saturate(1.45)',
    WebkitBackdropFilter: 'blur(14px) saturate(1.45)',
    border: '1px solid rgba(255,255,255,0.58)',
    boxShadow: [
      'inset 0 1px 0 rgba(255,255,255,0.92)',
      'inset 0 -1px 0 rgba(15,23,42,0.04)',
      '0 4px 22px rgba(15,23,42,0.07)',
      '0 1px 3px rgba(15,23,42,0.05)',
    ].join(', '),
  };
  const glassIcon: CSSProperties = {
    background: 'linear-gradient(145deg, rgba(255,255,255,0.62) 0%, rgba(226,232,240,0.38) 100%)',
    backdropFilter: 'blur(10px) saturate(1.2)',
    WebkitBackdropFilter: 'blur(10px) saturate(1.2)',
    border: '1px solid rgba(255,255,255,0.55)',
    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.85), 0 2px 8px rgba(15,23,42,0.06)',
  };
  return (
    <div
      className={`group/tile relative overflow-hidden rounded-2xl transition-all duration-200 hover:-translate-y-0.5 ${className ?? ''}`}
      style={glassTile}
    >
      {/* 글라스 틴트 워시 */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'linear-gradient(125deg, rgba(241,245,249,0.5) 0%, transparent 48%, rgba(203,213,225,0.12) 100%)',
        }}
      />
      {/* 상단 스펙큘러 */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[2px] opacity-90"
        style={{
          background:
            'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.85) 38%, rgba(255,255,255,0.95) 50%, rgba(255,255,255,0.85) 62%, transparent 100%)',
        }}
      />
      {variant === 'row' ? (
        <div className="relative z-10 flex min-h-0 flex-1 items-start gap-3 p-3 sm:gap-3.5 sm:p-3.5">
          <div
            className="flex size-9 shrink-0 items-center justify-center rounded-xl sm:size-10"
            style={glassIcon}
          >
            <CheckOrIcon
              className={isLucideDefault ? 'size-[18px] sm:size-5' : 'size-[17px] sm:size-[18px]'}
              strokeWidth={isLucideDefault ? 2.6 : 2.2}
              style={{ color: SLATE_DARK }}
            />
          </div>
          <div className="min-w-0 flex-1 pt-0.5">
            <p className="text-[12px] font-semibold leading-snug sm:text-[13px]" style={{ color: '#334155' }}>
              {children}
            </p>
          </div>
        </div>
      ) : (
        <div className="relative z-10 flex min-h-0 flex-1 items-center justify-center p-3 text-center text-[12px] font-semibold sm:p-3.5" style={{ color: '#334155' }}>
          {children}
        </div>
      )}
    </div>
  );
}

/** WIZ-Flow 인사이트 카피 — `plain`: 타이포만(배경·테두리 없음), 기본은 틴트 카드 */
function WizFlowInsightBubbleFrame({ children, plain }: { children: React.ReactNode; plain?: boolean }) {
  if (plain) {
    return <div className="mb-3 w-full text-center">{children}</div>;
  }
  return (
    <div
      className="mb-3 w-full rounded-[20px] px-4 py-3.5 text-center"
      style={{
        background: `
          linear-gradient(180deg, rgba(179,7,16,0.04) 0%, rgba(179,7,16,0.015) 100%),
          linear-gradient(180deg, #F7F8FA 0%, #EFF1F4 100%)`,
        border: '1px solid rgba(15,23,42,0.07)',
        boxShadow: '0 4px 22px rgba(15,23,42,0.06), 0 1px 4px rgba(15,23,42,0.04)',
      }}
    >
      {children}
    </div>
  );
}

/** 첫 줄에 `"강조"` 한 쌍이 있으면 핵심 모듈 인사이트 버블로 표시 */
function wizFlowUseCaseNarrativeHeadIsInsightBubble(firstLine: string): boolean {
  const n = firstLine.replace(/\u201C/g, '"').replace(/\u201D/g, '"');
  return /^[\s\S]*?"[^"]+"[\s\S]*$/.test(n);
}

const WIZ_FLOW_OUTCOME_GLYPH_RE = /(↓|↑|◯)/;

/** 성과 문구 `↓` — 감소(아래 화살표) 스트로크 그리기 */
function WizFlowOutcomeDownGlyph({ className = '' }: { className?: string }) {
  const stroke = {
    stroke: 'currentColor',
    strokeWidth: 2.35,
    strokeLinecap: 'round' as const,
    fill: 'none',
  };
  const loop = {
    duration: 0.55,
    repeat: Infinity,
    repeatDelay: 1.25,
    ease: 'easeInOut' as const,
  };

  return (
    <span
      className={`mx-0.5 inline-flex align-[-0.18em] text-current ${className}`}
      aria-hidden
    >
      <svg className="size-[1em] min-h-[1em] min-w-[1em] shrink-0 overflow-visible" viewBox="0 0 24 24">
        <motion.path
          d="M12 5v11"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={loop}
          {...stroke}
        />
        <motion.path
          d="M8 14l4 4 4-4"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ ...loop, delay: 0.32 }}
          strokeLinejoin="round"
          {...stroke}
        />
      </svg>
    </span>
  );
}

/** 성과 문구 `↑` — 향상(위 화살표) 스트로크 그리기 */
function WizFlowOutcomeUpGlyph({ className = '' }: { className?: string }) {
  const stroke = {
    stroke: 'currentColor',
    strokeWidth: 2.35,
    strokeLinecap: 'round' as const,
    fill: 'none',
  };
  const loop = {
    duration: 0.55,
    repeat: Infinity,
    repeatDelay: 1.25,
    ease: 'easeInOut' as const,
  };

  return (
    <span
      className={`mx-0.5 inline-flex align-[-0.18em] text-current ${className}`}
      aria-hidden
    >
      <svg className="size-[1em] min-h-[1em] min-w-[1em] shrink-0 overflow-visible" viewBox="0 0 24 24">
        <motion.path
          d="M12 19V8"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={loop}
          {...stroke}
        />
        <motion.path
          d="M8 10l4-4 4 4"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ ...loop, delay: 0.32 }}
          strokeLinejoin="round"
          {...stroke}
        />
      </svg>
    </span>
  );
}

/** 성과 문구 `◯`(U+25CB) — 유지·안정(원형) 스트로크 그리기 */
function WizFlowOutcomeHoldGlyph({ className = '' }: { className?: string }) {
  const r = 5.25;
  const circumference = 2 * Math.PI * r;
  const loop = {
    duration: 0.72,
    repeat: Infinity,
    repeatDelay: 1.15,
    ease: 'easeInOut' as const,
  };

  return (
    <span
      className={`mx-0.5 inline-flex align-[-0.18em] text-current ${className}`}
      aria-hidden
    >
      <svg className="size-[1em] min-h-[1em] min-w-[1em] shrink-0 overflow-visible" viewBox="0 0 24 24">
        <motion.circle
          cx={12}
          cy={12}
          r={r}
          fill="none"
          stroke="currentColor"
          strokeWidth={2.2}
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: 0 }}
          transition={loop}
          style={{ strokeDasharray: circumference }}
        />
      </svg>
    </span>
  );
}

function renderWizFlowOutcomeMetricGlyphs(text: string): ReactNode {
  if (!WIZ_FLOW_OUTCOME_GLYPH_RE.test(text)) return text;
  const parts = text.split(WIZ_FLOW_OUTCOME_GLYPH_RE);
  return (
    <>
      {parts.map((part, i) => {
        if (part === '') return null;
        if (part === '↓') return <WizFlowOutcomeDownGlyph key={`g-${i}`} />;
        if (part === '↑') return <WizFlowOutcomeUpGlyph key={`g-${i}`} />;
        if (part === '◯') return <WizFlowOutcomeHoldGlyph key={`g-${i}`} />;
        return <Fragment key={`t-${i}`}>{part}</Fragment>;
      })}
    </>
  );
}

/** WIZ-Flow — 활용 사례 섹션 헤더: `WizFlowProcessFlow`와 동일 타이포·톤(서술형 + 키워드 강조) */
function WizFlowUseCasesSectionHead({ ko, isWizFlowProduct = true }: { ko: boolean; isWizFlowProduct?: boolean }) {
  return (
    <div className="mb-9 text-center">
      <h2
        className="text-[30px] font-bold tracking-[-0.03em] sm:text-[32px]"
        style={{ color: '#0f172a', margin: '0 0 10px', lineHeight: 1.12 }}
      >
        {ko ? '현장에서 증명된 가치' : 'Proof from the Field'}
      </h2>
      <p
        className="mx-auto m-0 max-w-[34rem] text-[13px] font-normal leading-relaxed tracking-[-0.01em] text-[#86868b] sm:text-[14px]"
        style={{ wordBreak: 'keep-all' }}
      >
        {isWizFlowProduct ? (
          ko ? (
            <>
              <span className="font-semibold text-[#1d1d1f]">LG전자</span>·<span className="font-semibold text-[#1d1d1f]">디케이</span> 등{' '}
              <span className="font-semibold text-[#1d1d1f]">대표 고객사</span>에서 검증하고,{' '}
              <span className="font-semibold text-[#1d1d1f]">운영</span>은 달라지게 하고,{' '}
              <span className="font-semibold text-[#1d1d1f]">성과</span>는 숫자로 남깁니다.
            </>
          ) : (
            <>
              With <span className="font-semibold text-[#1d1d1f]">LG Electronics</span> and{' '}
              <span className="font-semibold text-[#1d1d1f]">D.K.</span> among our anchor accounts, we{' '}
              <span className="font-semibold text-[#1d1d1f]">prove</span> it on the floor,{' '}
              <span className="font-semibold text-[#1d1d1f]">reshape</span> how work runs, and{' '}
              <span className="font-semibold text-[#1d1d1f]">capture</span> outcomes in the numbers.
            </>
          )
        ) : (
          ko ? (
            <>
              <span className="font-semibold text-[#1d1d1f]">실제 운영</span> 환경에서의{' '}
              <span className="font-semibold text-[#1d1d1f]">활용 사례</span>를 정리했습니다.
            </>
          ) : (
            <>
              <span className="font-semibold text-[#1d1d1f]">Real-world</span> use cases from{' '}
              <span className="font-semibold text-[#1d1d1f]">operations</span> on the floor.
            </>
          )
        )}
      </p>
    </div>
  );
}

/** WIZ-Flow — 활용 사례(핵심 모듈 카드와 동일 패턴: 본문·인사이트·성과 푸터) */
function WizFlowUseCasesSalesSection({ stories, ko }: { stories: SolutionUseCaseStory[]; ko: boolean }) {
  return (
    <div className="flex w-full flex-col" style={{ boxSizing: 'border-box' }}>
      <WizFlowUseCasesSectionHead ko={ko} />

      <div className="grid grid-cols-1 gap-[14px] sm:grid-cols-2 lg:grid-cols-3">
        {stories.map((story, i) => {
          const title = ko ? story.title : story.titleEn;
          const narrative = ko ? story.narrative : story.narrativeEn;
          const outcome = ko ? story.outcome : story.outcomeEn;
          const outcomeStacked = outcome
            .split(/\s+\+\s+/)
            .map((s) => s.trim())
            .filter(Boolean);
          const useStackedOutcome = outcomeStacked.length >= 2;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.38 + i * 0.05, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -2, boxShadow: '0 8px 28px rgba(0,0,0,0.09)' }}
              className="group relative flex flex-col overflow-hidden"
              style={{
                ..._HTML_CARD,
                padding: '24px 20px 20px',
                minHeight: 300,
                transition: 'transform .2s, box-shadow .2s',
              }}
            >
              <div
                className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{ background: 'radial-gradient(circle, rgba(179,7,16,0.09) 0%, transparent 70%)' }}
              />
              <div className="relative z-10 flex min-h-0 flex-1 flex-col">
                <div className="mb-3 min-w-0">
                  <p className="text-[10px] font-semibold uppercase" style={{ color: '#B30710', margin: 0, marginBottom: 5, letterSpacing: '0.07em' }}>
                    {ko ? '활용 사례' : 'USE CASE'}
                  </p>
                  <h3 className="text-[14px] font-semibold" style={{ color: '#1d1d1f', margin: 0 }}>
                    <span className="font-semibold tabular-nums" style={{ color: '#c7c7cc' }}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span style={{ color: '#c7c7cc' }}>.&nbsp; </span>
                    {title}
                  </h3>
                </div>

                <div className="mb-3 h-px w-full" style={{ background: 'rgba(0,0,0,0.05)' }} />

                {(() => {
                  const nl = narrative.split('\n');
                  const head = nl[0] ?? '';
                  const tail = nl.slice(1).join('\n');
                  if (wizFlowUseCaseNarrativeHeadIsInsightBubble(head)) {
                    return (
                      <>
                        <div className="mb-3 w-full">
                          <WizFlowInsightBubbleFrame plain>
                            <WizFlowInsightBubbleBody
                              text={head}
                              baseColor="#1d1d1f"
                              accentColor="#B30710"
                            />
                          </WizFlowInsightBubbleFrame>
                        </div>
                        {tail ? (
                          <p className="mb-1 flex-1 whitespace-pre-line text-[12px] font-medium leading-relaxed" style={{ color: '#3d3d3f' }}>
                            {tail}
                          </p>
                        ) : null}
                      </>
                    );
                  }
                  return (
                    <p className="mb-1 flex-1 whitespace-pre-line text-[12px] font-medium leading-relaxed" style={{ color: '#3d3d3f' }}>
                      {narrative}
                    </p>
                  );
                })()}

                <div className="mt-auto pt-3 text-center" style={{ borderTop: '1px solid rgba(0,0,0,0.05)' }}>
                  {useStackedOutcome ? (
                    <div className="flex flex-col items-center gap-1.5 px-0.5">
                      <p className="text-center text-[clamp(16px,4.8vw,22px)] font-bold leading-[1.15] tracking-tight" style={{ color: '#B30710' }}>
                        {renderWizFlowOutcomeMetricGlyphs(outcomeStacked[0])}
                      </p>
                      <p className="max-w-[17.5rem] text-center text-[11px] font-normal leading-[1.25] tracking-tight sm:max-w-none sm:text-[12px]" style={{ color: '#1d1d1f' }}>
                        {renderWizFlowOutcomeMetricGlyphs(outcomeStacked.slice(1).join(' + '))}
                      </p>
                    </div>
                  ) : (
                    <p className="text-[13px] font-normal leading-snug sm:text-sm" style={{ color: '#B30710' }}>
                      {renderWizFlowOutcomeMetricGlyphs(outcome)}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

/** 대시 리모컨 재생/일시정지 아이콘 색 — `currentColor`만으로 안 먹는 환경 대비해 `fill`과 함께 사용 */
function dashRemotePlayIconFill(theme: 'light' | 'dark', playing: boolean): string {
  if (theme === 'dark') {
    return playing ? '#ffffff' : 'rgba(255,255,255,0.92)';
  }
  return playing ? '#ffffff' : '#3a3a3c';
}

/** 다크·재생 중(일시정지 아이콘)일 때만 — 순흰 + 글로우로 멈춤 상태와 확실히 구분 */
function dashRemotePlaySvgProps(theme: 'light' | 'dark', playing: boolean): { style?: CSSProperties } {
  if (theme === 'dark' && playing) {
    return {
      style: {
        filter: 'drop-shadow(0 0 3px rgba(255,255,255,0.95)) drop-shadow(0 0 6px rgba(255,255,255,0.45))',
      },
    };
  }
  return {};
}

// ── WIZ-Flow Bento Grid — Tinted Glass ────────────────────────────────────────────
function WizFlowBento({ s, ko, language, t, scrollRef, pageTaglineBelowHeader, brochureCapture }: {
  s: Solution;
  ko: boolean;
  language: string;
  t: (key: string) => string;
  scrollRef?: RefObject<HTMLDivElement>;
  /** `/solution/:id` 전용: 태그라인(~시작하기)만 Apple식 서브바로 분리 — 모달은 false */
  pageTaglineBelowHeader?: boolean;
  /** PDF 브로슈어용: 섹션별 스크린샷 타겟(`data-brochure-slide`)·세로 스크롤 해제 */
  brochureCapture?: boolean;
}) {
  const displayDescription = ko ? s.detailedDescription : s.detailedDescriptionEn;
  const displayFeatures    = ko ? s.features   : s.featuresEn;
  const displayUseCases    = ko ? s.useCases   : s.useCasesEn;
  const displayHighlights  = ko ? (s.highlights ?? []) : (s.highlightsEn ?? []);
  const moduleIconsFallback = ['📋', '📊', '🔍', '📄', '⚙️', '📈'];

  const isWizFlowProduct = s.id === 'wiz-flow';
  const displayName = ko ? s.nameKo : s.nameEn;
  const displaySubtitle = ko ? s.subtitle : s.subtitleEn;
  const categoryEyebrow = getCategoryLabel(s.category, language);
  const moduleCount = (s.modules ?? []).length;

  // ── 대시보드 리모콘 상태 ───────────────────────────────────────────────────
  const DASH_TOTAL = 9;
  const [dashSi, setDashSi] = useState(0);
  const [dashPlaying, setDashPlaying] = useState(true);
  const [dashInterval, setDashInterval] = useState<number>(10);
  const [dashDirection, setDashDirection] = useState<1 | -1>(1);
  const [dashFullscreen, setDashFullscreen] = useState(false);
  /** 모바일에서 전체화면(확대) 시도 시 안내 팝업 */
  const [mobileFsHintOpen, setMobileFsHintOpen] = useState(false);
  /** 라이트=FHD 캔버스(밝은 프레이밍), 다크=UHD 캔버스(시네마틱 다크) — 예전 UHD 기본과 동일하게 다크 우선 */
  const [dashTheme, setDashTheme] = useState<'light' | 'dark'>('light');
  const dashCanvasMode = dashTheme === 'dark' ? 'UHD' : 'FHD';
  const dashPlayIconFill = dashRemotePlayIconFill(dashTheme, dashPlaying);

  /** 풀스크린 리모컨: 라이트/다크 동일 레이아웃(다크 기준)·라이트는 색만 밝게 */
  const fsRemote = useMemo(
    () => ({
      rowH: WIZ_FLOW_FS_REMOTE_ROW_H,
      padY: WIZ_FLOW_FS_REMOTE_PAD_Y,
      padX: WIZ_FLOW_FS_REMOTE_PAD_X,
      colGap: 24,
      transportGap: WIZ_FLOW_FS_TRANSPORT_GAP,
      leftInnerGap: 20,
      rightColGap: 16,
      pickerFs: 13,
      pickerItemW: 48,
      themeBtnPadX: 16,
      themeBtnGap: 8,
      themeFontSize: 13,
      prevNextPad: 0,
      prevNextSvg: 20,
      playSvgPause: 14,
      playSvgPlay: 15,
      fsBtnRadius: 12 as const,
    }),
    [],
  );

  useEffect(() => {
    if (!dashPlaying) return;
    const id = setInterval(() => {
      setDashDirection(1);
      setDashSi(i => (i + 1) % DASH_TOTAL);
    }, dashInterval * 1000);
    return () => clearInterval(id);
  }, [dashPlaying, dashInterval]);

  const dashPrev = () => { setDashDirection(-1); setDashSi(i => (i - 1 + DASH_TOTAL) % DASH_TOTAL); };
  const dashNext = () => { setDashDirection(1);  setDashSi(i => (i + 1) % DASH_TOTAL); };
  const dashGoTo = (idx: number) => {
    setDashSi(prev => {
      if (idx === prev) return prev;
      setDashDirection(idx > prev ? 1 : -1);
      return idx;
    });
  };

  const [dashFsBarVisible, setDashFsBarVisible] = useState(false);
  const dashFsBarTimer = useRef<ReturnType<typeof setTimeout>>();
  const dashFsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!dashFullscreen) return;
    const el = dashFsRef.current;
    if (el && !document.fullscreenElement) {
      el.requestFullscreen().catch(() => {});
    }
  }, [dashFullscreen]);

  useEffect(() => {
    const onFsChange = () => {
      if (!document.fullscreenElement) setDashFullscreen(false);
    };
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  const enterFullscreen = useCallback(() => { setDashFullscreen(true); }, []);

  const exitFullscreen = useCallback(() => {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    } else {
      setDashFullscreen(false);
    }
  }, []);

  /** 모바일(639px 이하)에서는 전체화면 대신 안내 팝업 — PC는 기존 동작 */
  const toggleDashboardFullscreen = useCallback(() => {
    if (dashFullscreen) {
      exitFullscreen();
      return;
    }
    if (typeof window !== 'undefined' && window.matchMedia('(max-width: 639px)').matches) {
      setMobileFsHintOpen(true);
      return;
    }
    enterFullscreen();
  }, [dashFullscreen, enterFullscreen, exitFullscreen]);

  const handleFsMouseMove = useCallback((e: React.MouseEvent) => {
    if (e.clientY <= 64) {
      setDashFsBarVisible(true);
      clearTimeout(dashFsBarTimer.current);
    } else if (dashFsBarVisible) {
      clearTimeout(dashFsBarTimer.current);
      dashFsBarTimer.current = setTimeout(() => setDashFsBarVisible(false), 600);
    }
  }, [dashFsBarVisible]);

  const handleFsBarEnter = useCallback(() => {
    clearTimeout(dashFsBarTimer.current);
    setDashFsBarVisible(true);
  }, []);

  const handleFsBarLeave = useCallback(() => {
    dashFsBarTimer.current = setTimeout(() => setDashFsBarVisible(false), 400);
  }, []);

  const wizFlowTaglineInner = useMemo(
    () =>
      isWizFlowProduct ? (
        ko ? (
          <>
            <span style={{ fontWeight: 800, color: '#1D1D1F' }}>제조 표준</span>
            <span style={{ fontWeight: 400, color: '#86868B' }}>을 바꾸는 </span>
            <span
              style={{
                position: 'relative',
                display: 'inline-block',
                padding: '2px 6px',
                fontWeight: 800,
                color: LG_RED,
                letterSpacing: '0.03em',
              }}
              className="align-middle sm:px-[7px] sm:py-[3px] sm:tracking-[0.05em]"
            >
              <span
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: 6,
                  height: 6,
                  borderTop: `1.5px solid ${LG_RED}`,
                  borderLeft: `1.5px solid ${LG_RED}`,
                  opacity: 0.85,
                }}
                className="sm:h-[7px] sm:w-[7px]"
              />
              <span
                style={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  width: 6,
                  height: 6,
                  borderBottom: `1.5px solid ${LG_RED}`,
                  borderRight: `1.5px solid ${LG_RED}`,
                  opacity: 0.85,
                }}
                className="sm:h-[7px] sm:w-[7px]"
              />
              스마트 워크플로우
            </span>{' '}
            <span style={{ fontWeight: 400, color: '#86868B' }}>시작하기</span>
          </>
        ) : (
          <>
            <span style={{ fontWeight: 800, color: '#1D1D1F' }}>Manufacturing standards</span>
            <span style={{ fontWeight: 400, color: '#86868B' }}> redefined — </span>
            <span
              style={{
                position: 'relative',
                display: 'inline-block',
                padding: '2px 6px',
                fontWeight: 800,
                color: LG_RED,
                letterSpacing: '0.03em',
              }}
              className="align-middle sm:px-[7px] sm:py-[3px]"
            >
              <span
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: 6,
                  height: 6,
                  borderTop: `1.5px solid ${LG_RED}`,
                  borderLeft: `1.5px solid ${LG_RED}`,
                  opacity: 0.85,
                }}
                className="sm:h-[7px] sm:w-[7px]"
              />
              <span
                style={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  width: 6,
                  height: 6,
                  borderBottom: `1.5px solid ${LG_RED}`,
                  borderRight: `1.5px solid ${LG_RED}`,
                  opacity: 0.85,
                }}
                className="sm:h-[7px] sm:w-[7px]"
              />
              smart workflow
            </span>{' '}
            <span style={{ fontWeight: 400, color: '#86868B' }}>starts here</span>
          </>
        )
      ) : (
        ko ? (
          <>
            <span style={{ fontWeight: 800, color: '#1D1D1F' }}>{categoryEyebrow}</span>
            <span style={{ fontWeight: 400, color: '#86868B' }}> 현장을 위한 </span>
            <span style={{ fontWeight: 800, color: LG_RED }}>{displayName}</span>
            <span style={{ fontWeight: 400, color: '#86868B' }}> — 실시간 가시성과 운영 효율을 함께 높입니다.</span>
          </>
        ) : (
          <>
            <span style={{ fontWeight: 800, color: '#1D1D1F' }}>{categoryEyebrow}</span>
            <span style={{ fontWeight: 400, color: '#86868B' }}> — </span>
            <span style={{ fontWeight: 800, color: LG_RED }}>{displayName}</span>
            <span style={{ fontWeight: 400, color: '#86868B' }}> boosts visibility and operational efficiency on the floor.</span>
          </>
        )
      ),
    [isWizFlowProduct, ko, categoryEyebrow, displayName],
  );

  return (
    <div
      className={`relative flex h-full min-h-0 flex-col ${brochureCapture ? 'overflow-visible' : 'overflow-hidden'}`}
      style={{ background: WIZ_FLOW_BG }}
    >

      {/* ── 모달: 제품 헤더(로고·명칭) + 태그라인 / 상세 페이지: 글로벌 네비 아래 서브 타이틀바만 ── */}
      {!pageTaglineBelowHeader && (
        <div
          className="relative z-10 flex min-h-[60px] flex-shrink-0 flex-col gap-2 px-4 py-2.5 pr-14 transition-colors duration-500 sm:h-[60px] sm:flex-row sm:items-center sm:gap-3 sm:px-6 sm:py-0 sm:pr-14"
          style={{
            backgroundColor: 'var(--apple-globalnav-header-bg)',
            backdropFilter: 'var(--apple-globalnav-header-backdrop)',
            WebkitBackdropFilter: 'var(--apple-globalnav-header-backdrop)',
            borderBottom: 'var(--apple-globalnav-header-border-bottom)',
          }}
        >
          <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
            <img src={wizSymbol} alt={displayName} className="h-9 w-9 shrink-0 sm:h-10 sm:w-10" />
            <div className="min-w-0">
              <p className="text-[14px] font-black leading-none tracking-wide sm:text-[15px]" style={{ color: '#1D1D1F' }}>
                {displayName}
              </p>
              <p
                className="mt-0.5 line-clamp-2 text-[10px] font-normal leading-snug sm:mt-1 sm:line-clamp-none sm:text-[11px]"
                style={{ color: '#86868B' }}
              >
                {displaySubtitle}
              </p>
            </div>
            <div
              className="mx-1 hidden h-9 shrink-0 rounded-full sm:mx-2 sm:block sm:h-10"
              style={{ width: 3, background: LG_RED }}
              aria-hidden
            />
          </div>
          <p
            className="min-w-0 border-t border-black/[0.06] pt-2 text-[11px] leading-snug tracking-tight sm:ml-0 sm:flex-1 sm:border-t-0 sm:pt-0 sm:text-[13px]"
            style={{ letterSpacing: '-0.01em', margin: 0 }}
          >
            {wizFlowTaglineInner}
          </p>
        </div>
      )}

      {pageTaglineBelowHeader && (
        <div
          className="relative z-30 flex shrink-0 flex-col items-center justify-center px-4 py-2.5 text-center sm:py-2.5"
          style={{
            backgroundColor: 'var(--apple-surface-gray)',
            borderBottom: '1px solid rgba(0,0,0,0.06)',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.75)',
          }}
        >
          <p
            className="max-w-[min(100%,52rem)] text-[11px] leading-snug tracking-tight sm:text-[13px]"
            style={{ letterSpacing: '-0.01em', margin: 0 }}
          >
            {wizFlowTaglineInner}
          </p>
        </div>
      )}

      {/* ── Bento grid ── */}
      <div
        ref={scrollRef}
        className={`flex-1 min-h-0 relative z-10 scrollbar-hide ${brochureCapture ? 'overflow-y-visible overflow-x-hidden' : 'overflow-y-auto'}`}
      >
        <div className="pb-8 pt-0 mx-auto w-full px-6">
          <div className="flex flex-col gap-0">

            {/* ① Hero — Apple surface + 하단 페이드(다음 그레이 밴드로 연결) */}
            <div
              className="apple-section-white relative -mx-6 overflow-hidden px-6 pb-12 pt-5"
              {...(brochureCapture ? { 'data-brochure-slide': '1' } : {})}
            >
              <div
                aria-hidden
                className="apple-hero-bottom-fade pointer-events-none absolute bottom-0 left-0 right-0 z-0 h-24 sm:h-28"
              />
              <div className="relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className=""
              style={{ paddingTop: 20, paddingBottom: 10 }}
            >
              <div className="text-center" style={{ marginBottom: 48 }}>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05, duration: 0.5 }}
                  className="text-[13px] font-semibold uppercase tracking-widest"
                  style={{ color: LG_RED, margin: 0, marginBottom: 16 }}
                >
                  {isWizFlowProduct
                    ? (ko ? '위즈팩토리 · 스마트팩토리' : 'WizFactory · Smart Factory')
                    : `${categoryEyebrow} · WizFactory`}
                </motion.p>
                <motion.h2
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.6 }}
                  className="text-[56px] md:text-[72px] font-black"
                  style={{ color: '#1d1d1f', margin: 0, marginBottom: 12, lineHeight: 1.0, letterSpacing: '-0.04em' }}
                >
                  {displayName}
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.18, duration: 0.5 }}
                  className="text-[22px] md:text-[28px] font-bold"
                  style={{ color: '#1d1d1f', margin: 0, marginBottom: 16, lineHeight: 1.2, letterSpacing: '-0.02em' }}
                >
                  {isWizFlowProduct
                    ? (ko ? '종이 없는 공장, 데이터로 움직이는 현장.' : 'Zero Paper. Data-Driven Shop Floor.')
                    : displaySubtitle}
                </motion.p>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.28, duration: 0.5 }}
                  className="text-[17px] font-normal"
                  style={{ color: '#6e6e73', margin: '0 auto', maxWidth: 520, lineHeight: 1.65 }}
                >
                  {isWizFlowProduct
                    ? (ko
                      ? 'WIZ-Flow는 생산 계획부터 작업 지시, 공정 관리, 실적 집계까지 제조 현장의 전 과정을 하나로 통합하고, 실시간 데이터 기반으로 협업과 의사결정을 지원하여 생산 효율 향상과 운영 가시성을 동시에 실현합니다.'
                      : 'WIZ-Flow unifies every stage of manufacturing — from production planning and work orders to process management and performance tracking — into one platform, enabling real-time data-driven collaboration and decision-making to simultaneously improve production efficiency and operational visibility.')
                    : displayDescription}
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.36, duration: 0.5 }}
                  className="flex items-center justify-center gap-5 mt-7"
                >
                  {Boolean(s.demoUrl) && s.isDemoAvailable && (
                    <a href={s.demoUrl} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-semibold text-[15px] transition-all hover:scale-105 active:scale-95"
                      style={{ background: LG_RED, color: '#fff' }}>
                      {ko ? '데모 체험하기' : 'Try Live Demo'}
                      <ExternalLink className="size-4" />
                    </a>
                  )}
                  <a href="#"
                    onClick={(e) => { e.preventDefault(); scrollRef?.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' }); }}
                    className="inline-flex items-center gap-1 text-[15px] font-semibold transition-colors hover:opacity-70"
                    style={{ color: LG_RED }}
                  >
                    {ko ? '더 알아보기' : 'Learn more'}
                    <span style={{ fontSize: 18, lineHeight: 1 }}>›</span>
                  </a>
                </motion.div>
              </div>

              {/* 디바이스 목업 */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="relative overflow-hidden h-[280px] md:h-[460px]"
                style={{ borderRadius: 16 }}
              >
                <MiniDashboard />
              </motion.div>
            </motion.div>
              </div>
            </div>

            {/* ② KPI · 수치 시각화 · 상세 비교 · 작업지시 흐름 — 그레이 밴드 */}
            {s.wizFlowKpiCards?.length ? (
              <div className="apple-section-gray relative -mx-6 px-6 py-14 md:py-20">
                {/* KPI·데이터·Q&A(01~06)·작업지시(01·02) 동일 콘텐츠 폭 — 수평 정렬 */}
                <div className="mx-auto flex w-full max-w-7xl flex-col gap-16 md:gap-24">
                  <div {...(brochureCapture ? { 'data-brochure-slide': '2' } : {})}>
                    <motion.div
                      initial={{ opacity: 0, y: 22 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.55, delay: 0.06, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <WizFlowKpiDashboard cards={s.wizFlowKpiCards} ko={ko} />
                    </motion.div>
                  </div>
                  <div {...(brochureCapture ? { 'data-brochure-slide': '3' } : {})}>
                    <motion.div
                      initial={{ opacity: 0, y: 22 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.55, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <WizFlowDataViz ko={ko} />
                    </motion.div>
                  </div>
                  <div {...(brochureCapture ? { 'data-brochure-slide': '4' } : {})}>
                    <motion.div
                      initial={{ opacity: 0, y: 22 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.55, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <WizFlowDetailCompare ko={ko} />
                    </motion.div>
                  </div>
                  <div {...(brochureCapture ? { 'data-brochure-slide': '5' } : {})}>
                    <motion.div
                      initial={{ opacity: 0, y: 22 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.55, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <WizFlowProcessFlow ko={ko} />
                    </motion.div>
                  </div>
                </div>
              </div>
            ) : s.metrics?.length ? (
              <div className="apple-section-gray relative -mx-6 px-6 py-14 md:py-20">
                <motion.div
                  initial={{ opacity: 0, y: 22 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.55, delay: 0.06, ease: [0.22, 1, 0.36, 1] }}
                  className="grid grid-cols-1 gap-3 sm:grid-cols-2"
                >
                  {s.metrics.map((m, i) => (
                    <MetricCard key={m.label} m={m} i={i} ko={ko} />
                  ))}
                </motion.div>
              </div>
            ) : null}

            {/* ③ Dashboard card — 라이트 밴드(다크는 ④ 핵심 모듈로 이동) */}
            <motion.div
              initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.10, ease: [0.22, 1, 0.36, 1] }}
              className="apple-section-white relative z-10 -mx-6 px-6 py-14 md:py-20"
              {...(brochureCapture ? { 'data-brochure-slide': '6' } : {})}
            >
              {/* sec-head */}
              <div className="text-center" style={{ marginBottom: 40 }}>
                <h2 className="text-[32px] font-bold" style={{ color: '#1d1d1f', margin: 0, marginBottom: 10, lineHeight: 1.15, letterSpacing: '-0.025em' }}>
                  {isWizFlowProduct
                    ? (ko ? '현장 통합 모니터링' : 'Shop-floor Unified Monitoring')
                    : (ko ? '통합 운영 모니터링' : 'Unified Operations Monitoring')}
                </h2>
                <p
                  className="mx-auto m-0 max-w-[34rem] text-[13px] font-normal leading-relaxed tracking-[-0.01em] text-[#86868b] sm:text-[14px]"
                  style={{ wordBreak: 'keep-all' }}
                >
                  {isWizFlowProduct ? (
                    ko ? (
                      <>
                        <span className="font-semibold text-[#1d1d1f]">한 화면에 모인 현장</span>을{' '}
                        <span className="font-semibold text-[#1d1d1f]">실시간</span>으로 보고{' '}
                        <span className="font-semibold text-[#1d1d1f]">바로 결정</span>합니다.
                      </>
                    ) : (
                      <>
                        <span className="font-semibold text-[#1d1d1f]">One screen</span> for the shop floor—see it{' '}
                        <span className="font-semibold text-[#1d1d1f]">live</span> and decide{' '}
                        <span className="font-semibold text-[#1d1d1f]">right away</span>.
                      </>
                    )
                  ) : (
                    ko ? (
                      <>
                        <span className="font-semibold text-[#1d1d1f]">{displayName}</span>의{' '}
                        <span className="font-semibold text-[#1d1d1f]">핵심 지표</span>를{' '}
                        <span className="font-semibold text-[#1d1d1f]">실시간</span>으로 확인하고{' '}
                        <span className="font-semibold text-[#1d1d1f]">운영</span>에 반영합니다.
                      </>
                    ) : (
                      <>
                        <span className="font-semibold text-[#1d1d1f]">{displayName}</span> — track{' '}
                        <span className="font-semibold text-[#1d1d1f]">key KPIs live</span> and{' '}
                        <span className="font-semibold text-[#1d1d1f]">act</span> on what matters.
                      </>
                    )
                  )}
                </p>
              </div>

              {/* 리모컨 · TV — apple.com 스타일: #f5f5f7 스테이징 + 흰 카드(TV) / 플로팅 다크 리모컨 */}
              <div
                className="mx-auto w-full max-w-3xl rounded-[28px] p-5 sm:p-8 md:p-10"
                style={{ marginTop: 12, marginBottom: 12, background: APPLE_DEVICE_STAGING_BG }}
              >
                {/* 모바일: 리모컨+TV를 TV 쇼룸 미리보기처럼 축소 — index.css .wiz-flow-tv-scale-mobile */}
                <div className="w-full overflow-x-hidden max-sm:overflow-x-clip sm:overflow-visible">
                  <div className="wiz-flow-tv-scale-mobile w-full">
                    <div className="flex flex-col gap-5 sm:gap-7">
              {/* Siri Remote — 테마에 따라 다크 메탈 / 라이트 알루미늄 */}
              <div
                className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 sm:grid-cols-[1fr_auto_1fr]"
                style={{
                  ...(dashTheme === 'dark' ? APPLE_ATV_PRODUCT : APPLE_ATV_PRODUCT_LIGHT),
                  padding: '12px 16px',
                }}
              >
                {/* 좌: 간격 피커 — 데스크톱만 (모바일은 숨김) */}
                <div className="hidden min-w-0 flex-wrap items-center justify-start gap-[14px] sm:flex">
                  <DashIntervalPicker
                    value={dashInterval}
                    onChange={setDashInterval}
                    ko={ko}
                    dark={dashTheme === 'dark'}
                    fontSize={12}
                    itemW={42}
                    trackH={ATV_EMBEDDED_REMOTE_H}
                  />
                  <div
                    style={{
                      width: 1,
                      height: ATV_EMBEDDED_REMOTE_H,
                      alignSelf: 'center',
                      background: dashTheme === 'dark' ? 'rgba(255,255,255,0.14)' : 'rgba(0,0,0,0.08)',
                      flexShrink: 0,
                      borderRadius: 1,
                    }}
                  />
                </div>

                {/* 중앙: 이전 · 재생(클릭패드) · 다음 */}
                <div
                  role="group"
                  aria-label={ko ? '재생 제어' : 'Playback controls'}
                  style={{ display: 'flex', alignItems: 'center', gap: 14, justifyContent: 'center' }}
                >
                  <button
                    type="button"
                    onClick={dashPrev}
                    title={ko ? '이전 화면' : 'Previous'}
                    style={{
                      background: 'none',
                      border: 'none',
                      padding: 6,
                      color: dashTheme === 'dark' ? 'rgba(255,255,255,0.55)' : '#86868b',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'color 0.15s',
                      flexShrink: 0,
                      borderRadius: 8,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = dashTheme === 'dark' ? 'rgba(255,255,255,0.95)' : '#1d1d1f';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = dashTheme === 'dark' ? 'rgba(255,255,255,0.55)' : '#86868b';
                    }}
                  >
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                      <polygon points="19 20 9 12 19 4 19 20" />
                      <rect x="5" y="5" width="2" height="14" rx="0.5" />
                    </svg>
                  </button>
                  {/* 재생: 다크=클릭패드 메탈 / 라이트=소프트 그레이 + LG 재생 강조 */}
                  <button
                    type="button"
                    onClick={() => setDashPlaying(p => !p)}
                    title={dashPlaying ? (ko ? '일시 정지' : 'Pause') : (ko ? '재생' : 'Play')}
                    style={{
                      width: ATV_EMBEDDED_REMOTE_H,
                      height: ATV_EMBEDDED_REMOTE_H,
                      borderRadius: '50%',
                      border: 'none',
                      ...(dashTheme === 'dark'
                        ? {
                            background: dashPlaying
                              ? 'radial-gradient(circle at 32% 28%, rgba(255,255,255,0.22) 0%, transparent 42%), linear-gradient(165deg, #1f1f21 0%, #121214 100%)'
                              : 'radial-gradient(circle at 32% 28%, rgba(255,255,255,0.18) 0%, transparent 45%), linear-gradient(165deg, #2a2a2c 0%, #161618 100%)',
                            color: dashPlayIconFill,
                            boxShadow: dashPlaying
                              ? `inset 0 2px 12px rgba(0,0,0,0.65), 0 0 0 1.5px rgba(255,255,255,0.32), 0 1px 0 rgba(255,255,255,0.12), 0 6px 16px rgba(0,0,0,0.45), 0 0 0 1px rgba(0,0,0,0.5), 0 0 0 2px rgba(255,255,255,0.2), 0 0 18px rgba(255,255,255,0.35)`
                              : `inset 0 2px 10px rgba(0,0,0,0.55), 0 0 0 1.5px rgba(255,255,255,0.22), 0 1px 0 rgba(255,255,255,0.1), 0 4px 14px rgba(0,0,0,0.35), 0 0 0 1px rgba(0,0,0,0.45)`,
                          }
                        : {
                            background: dashPlaying
                              ? `linear-gradient(145deg, #D6074E, #A5063D)`
                              : 'linear-gradient(165deg, #ffffff 0%, #f0f0f2 100%)',
                            color: dashPlayIconFill,
                            boxShadow: dashPlaying
                              ? `3px 3px 12px ${LG_RED}38, inset 0 1px 1px rgba(255,255,255,0.25), 0 0 0 2px rgba(255,255,255,0.92), 0 4px 20px rgba(179,7,16,0.42)`
                              : 'inset 0 2px 4px rgba(255,255,255,0.98), 0 1px 0 rgba(255,255,255,1), 0 4px 12px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.05)',
                          }),
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'color 0.2s, transform 0.2s, box-shadow 0.2s',
                      flexShrink: 0,
                    }}
                  >
                    {dashPlaying ? (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill={dashPlayIconFill} aria-hidden {...dashRemotePlaySvgProps(dashTheme, dashPlaying)}>
                        <rect x="6" y="4" width="4" height="16" rx="1" fill={dashPlayIconFill} />
                        <rect x="14" y="4" width="4" height="16" rx="1" fill={dashPlayIconFill} />
                      </svg>
                    ) : (
                      <svg width="13" height="13" viewBox="0 0 24 24" fill={dashPlayIconFill} aria-hidden {...dashRemotePlaySvgProps(dashTheme, dashPlaying)}>
                        <polygon points="6 3 20 12 6 21 6 3" fill={dashPlayIconFill} />
                      </svg>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={dashNext}
                    title={ko ? '다음 화면' : 'Next'}
                    style={{
                      background: 'none',
                      border: 'none',
                      padding: 6,
                      color: dashTheme === 'dark' ? 'rgba(255,255,255,0.55)' : '#86868b',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'color 0.15s',
                      flexShrink: 0,
                      borderRadius: 8,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = dashTheme === 'dark' ? 'rgba(255,255,255,0.95)' : '#1d1d1f';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = dashTheme === 'dark' ? 'rgba(255,255,255,0.55)' : '#86868b';
                    }}
                  >
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                      <polygon points="5 4 15 12 5 20 5 4" />
                      <rect x="17" y="5" width="2" height="14" rx="0.5" />
                    </svg>
                  </button>
                </div>

                {/* 우: 테마(라이트/다크) + 전체화면 */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'flex-end', minWidth: 0, flexWrap: 'wrap' }}>
                  <div
                    style={{
                      width: 1,
                      height: ATV_EMBEDDED_REMOTE_H,
                      alignSelf: 'center',
                      background: dashTheme === 'dark' ? 'rgba(255,255,255,0.14)' : 'rgba(0,0,0,0.08)',
                      flexShrink: 0,
                      borderRadius: 1,
                    }}
                  />
                  <div
                    role="group"
                    aria-label={ko ? '표시 테마' : 'Display theme'}
                    style={{
                      display: 'flex',
                      background: dashTheme === 'dark' ? 'rgba(0,0,0,0.35)' : '#e8e8ed',
                      borderRadius: 999,
                      padding: 3,
                      gap: 0,
                      flexShrink: 0,
                      height: ATV_EMBEDDED_REMOTE_H,
                      alignItems: 'center',
                      boxSizing: 'border-box',
                      boxShadow: dashTheme === 'dark' ? 'inset 0 1px 3px rgba(0,0,0,0.45)' : 'inset 0 1px 2px rgba(255,255,255,0.8)',
                    }}
                  >
                    {(['light', 'dark'] as const).map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setDashTheme(t)}
                        title={t === 'light' ? (ko ? '라이트 테마' : 'Light theme') : (ko ? '다크 테마' : 'Dark theme')}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 5,
                          padding: '0 11px',
                          height: ATV_EMBEDDED_REMOTE_H - 6,
                          borderRadius: 999,
                          border: 'none',
                          cursor: 'pointer',
                          flexShrink: 0,
                          background:
                            dashTheme === t
                              ? (dashTheme === 'dark' ? 'rgba(255,255,255,0.94)' : '#1d1d1f')
                              : 'transparent',
                          color:
                            dashTheme === t
                              ? (dashTheme === 'dark' ? '#1d1d1f' : '#fff')
                              : (dashTheme === 'dark' ? 'rgba(255,255,255,0.42)' : '#8e8e93'),
                          fontSize: 11,
                          fontWeight: 700,
                          lineHeight: 1,
                          letterSpacing: '0.02em',
                          transition: 'all 0.2s',
                          boxShadow: dashTheme === t ? '0 1px 4px rgba(0,0,0,0.18)' : 'none',
                          boxSizing: 'border-box',
                        }}
                      >
                        {t === 'light' ? (
                          <Sun className="size-[14px] shrink-0" strokeWidth={2.25} aria-hidden />
                        ) : (
                          <Moon className="size-[14px] shrink-0" strokeWidth={2.25} aria-hidden />
                        )}
                        {ko ? (t === 'light' ? '라이트' : '다크') : t === 'light' ? 'Light' : 'Dark'}
                      </button>
                    ))}
                  </div>
                  <div
                    style={{
                      width: 1,
                      height: ATV_EMBEDDED_REMOTE_H,
                      alignSelf: 'center',
                      background: dashTheme === 'dark' ? 'rgba(255,255,255,0.14)' : 'rgba(0,0,0,0.08)',
                      flexShrink: 0,
                      borderRadius: 1,
                    }}
                  />
                  <button
                    type="button"
                    onClick={toggleDashboardFullscreen}
                    title={dashFullscreen ? (ko ? '축소' : 'Minimize') : (ko ? '확대' : 'Fullscreen')}
                    style={{
                      flexShrink: 0,
                      width: ATV_EMBEDDED_REMOTE_H,
                      height: ATV_EMBEDDED_REMOTE_H,
                      borderRadius: '50%',
                      border:
                        dashTheme === 'dark'
                          ? '1px solid rgba(255,255,255,0.16)'
                          : '1px solid rgba(0,0,0,0.1)',
                      background:
                        dashTheme === 'dark'
                          ? (dashFullscreen
                              ? 'linear-gradient(165deg, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0.12) 100%)'
                              : 'linear-gradient(165deg, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0.06) 100%)')
                          : (dashFullscreen
                              ? `linear-gradient(165deg, ${LG_RED}, #A5063D)`
                              : 'linear-gradient(165deg, #f5f5f7 0%, #e8e8ed 100%)'),
                      color: dashTheme === 'dark' ? 'rgba(255,255,255,0.92)' : dashFullscreen ? '#fff' : '#3a3a3c',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.2s',
                      boxShadow:
                        dashTheme === 'dark'
                          ? 'inset 0 1px 3px rgba(255,255,255,0.12), 0 2px 8px rgba(0,0,0,0.35)'
                          : dashFullscreen
                            ? `0 4px 14px ${LG_RED}40`
                            : 'inset 0 1px 2px rgba(255,255,255,0.95), 0 2px 6px rgba(0,0,0,0.06)',
                    }}
                  >
                    {dashFullscreen ? (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                        <polyline points="4 14 10 14 10 20" />
                        <polyline points="20 10 14 10 14 4" />
                        <line x1="14" y1="10" x2="21" y2="3" />
                        <line x1="3" y1="21" x2="10" y2="14" />
                      </svg>
                    ) : (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                        <polyline points="15 3 21 3 21 9" />
                        <polyline points="9 21 3 21 3 15" />
                        <line x1="21" y1="3" x2="14" y2="10" />
                        <line x1="3" y1="21" x2="10" y2="14" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* TV — 흰 제품 카드 + 스크린 베젤 (애플 제품 페이지의 디스플레이 컷) */}
              <LGTVFrame variant="apple">
                <WizFlowFhdTvFit canvasMode={dashCanvasMode} ko={ko} uhdLetterboxDark={dashTheme === 'dark'}>
                  <WizFlowDashboard ko={ko} si={dashSi} direction={dashDirection} onGoTo={dashGoTo} theme={dashTheme} />
                </WizFlowFhdTvFit>
              </LGTVFrame>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── 전체화면 포탈 ── */}
              {dashFullscreen && createPortal(
                <DashFullscreenOverlay
                  ref={dashFsRef}
                  onMouseMove={handleFsMouseMove}
                  ko={ko}
                  dashSi={dashSi}
                  dashTotal={DASH_TOTAL}
                  dashDirection={dashDirection}
                  dashGoTo={dashGoTo}
                  onPrev={dashPrev}
                  onNext={dashNext}
                  resolution={dashCanvasMode}
                  dashTheme={dashTheme}
                >

                  {/* 풀스크린 전용 리모컨 — 뷰포트 상단 전체 너비, 카드 리모컨과 별도 구성 (translateY만 사용) */}
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: WIZ_FLOW_FS_REMOTE_CLIP_H,
                      overflow: 'hidden',
                      zIndex: 20,
                      pointerEvents: 'none',
                    }}
                  >
                    <motion.div
                      initial={false}
                      animate={{ y: dashFsBarVisible ? 0 : '-100%' }}
                      transition={{ duration: 0.28, ease: [0.25, 0.1, 0.25, 1] }}
                      onMouseEnter={handleFsBarEnter}
                      onMouseLeave={handleFsBarLeave}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        pointerEvents: dashFsBarVisible ? 'auto' : 'none',
                        boxSizing: 'border-box',
                        padding: `${fsRemote.padY}px ${fsRemote.padX}px`,
                        ...(dashTheme === 'dark'
                          ? {
                              background: 'linear-gradient(180deg, #3a3a3c 0%, #1e1e20 100%)',
                              borderBottom: '1px solid rgba(255,255,255,0.1)',
                              boxShadow: '0 12px 40px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.1)',
                            }
                          : WIZ_FLOW_FS_REMOTE_BAR_LIGHT),
                        display: 'grid',
                        gridTemplateColumns: '1fr auto 1fr',
                        alignItems: 'center',
                        columnGap: fsRemote.colGap,
                        minHeight: fsRemote.rowH + fsRemote.padY * 2,
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: fsRemote.leftInnerGap, justifyContent: 'flex-start', minWidth: 0, flexWrap: 'wrap' }}>
                        <DashIntervalPicker
                          value={dashInterval}
                          onChange={setDashInterval}
                          ko={ko}
                          dark={dashTheme === 'dark'}
                          fontSize={fsRemote.pickerFs}
                          itemW={fsRemote.pickerItemW}
                          trackH={fsRemote.rowH}
                        />
                        <div
                          style={{
                            width: 1,
                            height: fsRemote.rowH,
                            alignSelf: 'center',
                            background: dashTheme === 'dark' ? 'rgba(255,255,255,0.14)' : 'rgba(0,0,0,0.1)',
                            flexShrink: 0,
                            borderRadius: 1,
                          }}
                        />
                      </div>

                      <div
                        role="group"
                        aria-label={ko ? '재생 제어' : 'Playback controls'}
                        style={{ display: 'flex', alignItems: 'center', gap: fsRemote.transportGap, justifyContent: 'center' }}
                      >
                        <button
                          type="button"
                          onClick={dashPrev}
                          title={ko ? '이전 화면' : 'Previous'}
                          style={{
                            background: 'none',
                            border: 'none',
                            padding: fsRemote.prevNextPad,
                            color: dashTheme === 'dark' ? 'rgba(255,255,255,0.55)' : '#86868b',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'color 0.15s',
                            flexShrink: 0,
                            borderRadius: 8,
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.color = dashTheme === 'dark' ? 'rgba(255,255,255,0.95)' : '#1d1d1f';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.color = dashTheme === 'dark' ? 'rgba(255,255,255,0.55)' : '#86868b';
                          }}
                        >
                          <svg width={fsRemote.prevNextSvg} height={fsRemote.prevNextSvg} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                            <polygon points="19 20 9 12 19 4 19 20" /><rect x="5" y="5" width="2" height="14" rx="0.5" />
                          </svg>
                        </button>
                        <button
                          type="button"
                          onClick={() => setDashPlaying(p => !p)}
                          title={dashPlaying ? (ko ? '일시 정지' : 'Pause') : (ko ? '재생' : 'Play')}
                          style={{
                            width: fsRemote.rowH,
                            height: fsRemote.rowH,
                            borderRadius: '50%',
                            border: 'none',
                            ...(dashTheme === 'dark'
                              ? {
                                  background: dashPlaying
                                    ? 'radial-gradient(circle at 32% 28%, rgba(255,255,255,0.2) 0%, transparent 42%), linear-gradient(165deg, #1f1f21 0%, #121214 100%)'
                                    : 'radial-gradient(circle at 32% 28%, rgba(255,255,255,0.15) 0%, transparent 45%), linear-gradient(165deg, #2a2a2c 0%, #161618 100%)',
                                  color: dashPlayIconFill,
                                  boxShadow: dashPlaying
                                    ? `inset 0 2px 12px rgba(0,0,0,0.55), 0 0 0 1.5px rgba(255,255,255,0.28), 0 4px 14px rgba(0,0,0,0.35), 0 0 0 2px rgba(255,255,255,0.18), 0 0 16px rgba(255,255,255,0.32)`
                                    : `inset 0 2px 10px rgba(0,0,0,0.45), 0 0 0 1.5px rgba(255,255,255,0.18), 0 4px 12px rgba(0,0,0,0.25)`,
                                }
                              : {
                                  background: dashPlaying
                                    ? `linear-gradient(145deg, #D6074E, #A5063D)`
                                    : 'linear-gradient(165deg, #ffffff 0%, #f0f0f2 100%)',
                                  color: dashPlayIconFill,
                                  boxShadow: dashPlaying
                                    ? `inset 0 2px 12px rgba(0,0,0,0.45), 0 0 0 1.5px rgba(255,255,255,0.45), 0 4px 14px rgba(0,0,0,0.22), 0 0 0 2px rgba(255,255,255,0.88), 0 4px 22px rgba(179,7,16,0.4)`
                                    : `inset 0 2px 10px rgba(255,255,255,0.98), 0 0 0 1.5px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.05)`,
                                }),
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'color 0.2s, transform 0.2s, box-shadow 0.2s',
                            flexShrink: 0,
                          }}
                        >
                          {dashPlaying ? (
                            <svg width={fsRemote.playSvgPause} height={fsRemote.playSvgPause} viewBox="0 0 24 24" fill={dashPlayIconFill} aria-hidden {...dashRemotePlaySvgProps(dashTheme, dashPlaying)}>
                              <rect x="6" y="4" width="4" height="16" rx="1" fill={dashPlayIconFill} />
                              <rect x="14" y="4" width="4" height="16" rx="1" fill={dashPlayIconFill} />
                            </svg>
                          ) : (
                            <svg width={fsRemote.playSvgPlay} height={fsRemote.playSvgPlay} viewBox="0 0 24 24" fill={dashPlayIconFill} aria-hidden {...dashRemotePlaySvgProps(dashTheme, dashPlaying)}>
                              <polygon points="6 3 20 12 6 21 6 3" fill={dashPlayIconFill} />
                            </svg>
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={dashNext}
                          title={ko ? '다음 화면' : 'Next'}
                          style={{
                            background: 'none',
                            border: 'none',
                            padding: fsRemote.prevNextPad,
                            color: dashTheme === 'dark' ? 'rgba(255,255,255,0.55)' : '#86868b',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'color 0.15s',
                            flexShrink: 0,
                            borderRadius: 8,
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.color = dashTheme === 'dark' ? 'rgba(255,255,255,0.95)' : '#1d1d1f';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.color = dashTheme === 'dark' ? 'rgba(255,255,255,0.55)' : '#86868b';
                          }}
                        >
                          <svg width={fsRemote.prevNextSvg} height={fsRemote.prevNextSvg} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                            <polygon points="5 4 15 12 5 20 5 4" /><rect x="17" y="5" width="2" height="14" rx="0.5" />
                          </svg>
                        </button>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: fsRemote.rightColGap, justifyContent: 'flex-end', minWidth: 0, flexWrap: 'wrap' }}>
                        <div
                          style={{
                            width: 1,
                            height: fsRemote.rowH,
                            alignSelf: 'center',
                            background: dashTheme === 'dark' ? 'rgba(255,255,255,0.14)' : 'rgba(0,0,0,0.1)',
                            flexShrink: 0,
                            borderRadius: 1,
                          }}
                        />
                        <div
                          style={{
                            display: 'flex',
                            background: dashTheme === 'dark' ? 'rgba(0,0,0,0.35)' : 'rgba(0,0,0,0.08)',
                            borderRadius: 999,
                            padding: 3,
                            gap: 0,
                            flexShrink: 0,
                            height: fsRemote.rowH,
                            alignItems: 'center',
                            boxSizing: 'border-box',
                            boxShadow: dashTheme === 'dark' ? 'inset 0 1px 3px rgba(0,0,0,0.45)' : 'inset 0 1px 3px rgba(0,0,0,0.12)',
                          }}
                        >
                          {(['light', 'dark'] as const).map((t) => (
                            <button
                              type="button"
                              key={t}
                              onClick={() => setDashTheme(t)}
                              title={t === 'light' ? (ko ? '라이트 테마' : 'Light theme') : (ko ? '다크 테마' : 'Dark theme')}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: fsRemote.themeBtnGap,
                                padding: `0 ${fsRemote.themeBtnPadX}px`,
                                height: fsRemote.rowH - 6,
                                borderRadius: 999,
                                border: 'none',
                                cursor: 'pointer',
                                flexShrink: 0,
                                background:
                                  dashTheme === t
                                    ? (dashTheme === 'dark'
                                        ? 'rgba(255,255,255,0.94)'
                                        : t === 'light'
                                          ? '#ffffff'
                                          : '#1d1d1f')
                                    : 'transparent',
                                color:
                                  dashTheme === t
                                    ? (dashTheme === 'dark'
                                        ? '#1d1d1f'
                                        : t === 'light'
                                          ? '#1d1d1f'
                                          : '#fff')
                                    : (dashTheme === 'dark' ? 'rgba(255,255,255,0.42)' : '#8e8e93'),
                                fontSize: fsRemote.themeFontSize,
                                fontWeight: 700,
                                lineHeight: 1,
                                letterSpacing: '0.02em',
                                transition: 'all 0.2s',
                                boxShadow: dashTheme === t ? '0 2px 8px rgba(0,0,0,0.15)' : 'none',
                                boxSizing: 'border-box',
                              }}
                            >
                              {t === 'light' ? (
                                <Sun className="size-[15px] shrink-0" strokeWidth={2.25} aria-hidden />
                              ) : (
                                <Moon className="size-[15px] shrink-0" strokeWidth={2.25} aria-hidden />
                              )}
                              {ko ? (t === 'light' ? '라이트' : '다크') : t === 'light' ? 'Light' : 'Dark'}
                            </button>
                          ))}
                        </div>
                        <div
                          style={{
                            width: 1,
                            height: fsRemote.rowH,
                            alignSelf: 'center',
                            background: dashTheme === 'dark' ? 'rgba(255,255,255,0.14)' : 'rgba(0,0,0,0.1)',
                            flexShrink: 0,
                            borderRadius: 1,
                          }}
                        />
                        <button
                          type="button"
                          onClick={exitFullscreen}
                          title={ko ? '축소' : 'Minimize'}
                          style={{
                            flexShrink: 0,
                            width: fsRemote.rowH,
                            height: fsRemote.rowH,
                            borderRadius: fsRemote.fsBtnRadius,
                            border:
                              dashTheme === 'dark'
                                ? '1px solid rgba(255,255,255,0.14)'
                                : '1px solid rgba(0,0,0,0.12)',
                            background:
                              dashTheme === 'dark'
                                ? 'linear-gradient(165deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.08) 100%)'
                                : 'linear-gradient(165deg, rgba(255,255,255,0.98) 0%, rgba(245,245,247,0.9) 100%)',
                            color: dashTheme === 'dark' ? 'rgba(255,255,255,0.95)' : '#3a3a3c',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.2s',
                            boxShadow:
                              dashTheme === 'dark'
                                ? 'inset 0 1px 2px rgba(255,255,255,0.15), 0 2px 10px rgba(0,0,0,0.3)'
                                : 'inset 0 1px 2px rgba(255,255,255,0.95), 0 2px 10px rgba(0,0,0,0.12)',
                          }}
                        >
                          <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                            <polyline points="4 14 10 14 10 20" /><polyline points="20 10 14 10 14 4" />
                            <line x1="14" y1="10" x2="21" y2="3" /><line x1="3" y1="21" x2="10" y2="14" />
                          </svg>
                        </button>
              </div>
                    </motion.div>
                  </div>

                  {!dashFsBarVisible && (
                    <div
                      onMouseEnter={() => setDashFsBarVisible(true)}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: WIZ_FLOW_FS_HOT_STRIP_H,
                        zIndex: 21,
                        cursor: 'default',
                        pointerEvents: 'auto',
                      }}
                    />
                  )}
                </DashFullscreenOverlay>,
                document.body,
              )}
            </motion.div>

            {/* ④ Module cards — 다크 스트립(핵심 강조) */}
            {(s.modules ?? []).length > 0 && (
              <div
                className="apple-section-dark relative z-10 -mx-6 px-6 py-14 md:py-20"
                {...(brochureCapture ? { 'data-brochure-slide': '7' } : {})}
              >
              <motion.div
                initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.14, ease: [0.22, 1, 0.36, 1] }}
                className=""
              >
                  {/* sec-head — 작업지시 흐름 섹션(WizFlowProcessFlow)과 동일 타이포·리듬, 다크용 색만 조정 */}
                  <div className="mb-9 text-center">
                    <h2
                      className="text-[30px] font-bold tracking-[-0.03em] sm:text-[32px]"
                      style={{ color: '#f5f5f7', margin: '0 0 10px', lineHeight: 1.12 }}
                    >
                      {ko
                        ? `현장을 움직이는 ${moduleCount}대 핵심 모듈`
                        : `${moduleCount} Core Modules That Drive the Floor`}
                    </h2>
                    <p
                      className="mx-auto m-0 max-w-[34rem] text-[13px] font-normal leading-relaxed tracking-[-0.01em] text-[#86868b] sm:text-[14px]"
                      style={{ wordBreak: 'keep-all' }}
                    >
                      {isWizFlowProduct ? (
                        ko ? (
                          <>
                            <span className="font-semibold text-[#e5e5ea]">작업지시</span>는 끊김 없이,{' '}
                            <span className="font-semibold text-[#e5e5ea]">품질·설비·실적</span>은 한 화면에 모이고,{' '}
                            <span className="font-semibold text-[#e5e5ea]">공정 전체</span>는 데이터로 이어집니다.
                          </>
                        ) : (
                          <>
                            <span className="font-semibold text-[#e5e5ea]">Work orders</span> flow without gaps,{' '}
                            <span className="font-semibold text-[#e5e5ea]">quality, equipment & results</span> meet on one
                            screen, and the <span className="font-semibold text-[#e5e5ea]">entire process</span> stays wired
                            on data.
                          </>
                        )
                      ) : (
                        ko ? (
                          <>
                            <span className="font-semibold text-[#e5e5ea]">{displayName}</span>의{' '}
                            <span className="font-semibold text-[#e5e5ea]">핵심 구성</span>을 모듈로 정리해 현장에서 바로 확인합니다.
                          </>
                        ) : (
                          <>
                            <span className="font-semibold text-[#e5e5ea]">{displayName}</span> — core building blocks,{' '}
                            <span className="font-semibold text-[#e5e5ea]">organized as modules</span> you can scan at a glance.
                          </>
                        )
                      )}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-[14px] sm:grid-cols-2 lg:grid-cols-3">
            {(s.modules ?? []).map((mod, i) => {
              const rich = Boolean(mod.tagline && mod.bullets?.length);
              const iconChar = (mod.icon || moduleIconsFallback[i]) || '📦';
              const tags = ko ? mod.effectTags : mod.effectTagsEn;
              const metric = ko ? mod.metricLine : mod.metricLineEn;
              const tagline = ko ? mod.tagline : mod.taglineEn;
              const metricTrend = metric ? wizFlowMetricLineTrend(mod, metric) : null;
              const metricDisplay = metric ? wizFlowMetricLinePlainText(metric) : '';
              const MetricTrendIcon = metricTrend === 'down' ? TrendingDown : metricTrend === 'up' ? TrendingUp : null;
              /** 지표·태그라인은 헤더가 아니라 핵심 기능 목록 아래에 표시 */
              const metricBelowBullets = rich;
              return (
                <motion.div
                  key={mod.name}
                  initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.55, delay: 0.14 + i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={{
                    y: -2,
                    boxShadow: WIZ_FLOW_MODULE_CARD.shadowHover,
                    transition: { duration: 0.22 },
                  }}
                  className="group flex flex-col relative overflow-hidden"
                  style={{
                    borderRadius: WIZ_FLOW_MODULE_CARD.radius,
                    paddingLeft: WIZ_FLOW_MODULE_CARD.padX,
                    paddingRight: WIZ_FLOW_MODULE_CARD.padX,
                    paddingTop: WIZ_FLOW_MODULE_CARD.padTop,
                    paddingBottom: WIZ_FLOW_MODULE_CARD.padBottom,
                    minHeight: rich ? WIZ_FLOW_MODULE_CARD.minHeightRich : WIZ_FLOW_MODULE_CARD.minHeightSimple,
                    background: WIZ_FLOW_MODULE_CARD.bg,
                    border: WIZ_FLOW_MODULE_CARD.border,
                    boxShadow: WIZ_FLOW_MODULE_CARD.shadow,
                    boxSizing: 'border-box',
                  }}
                >
                  <div
                    className="pointer-events-none absolute -top-10 -right-10 h-32 w-32 rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                    style={{ background: WIZ_FLOW_MODULE_CARD.hoverGlow, filter: `blur(${WIZ_FLOW_MODULE_CARD.hoverBlurPx}px)` }}
                  />

                  <div className="relative z-10 flex-1 flex flex-col min-h-0">
                    {/* 헤더: 좌측 모듈명 + 우측 핵심 수치·보조 한 줄(요금제 카드 패턴) */}
                    <div className="flex justify-between items-start gap-3 mb-3">
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] font-bold tracking-wide mb-1" style={{ color: WIZ_FLOW_MODULE_CARD.accent }}>{ko ? '핵심 모듈' : 'Core module'}</p>
                        <h3 className="text-[17px] font-black leading-[1.25] tracking-tight" style={{ color: WIZ_FLOW_MODULE_CARD.title }}>
                          <span className="tabular-nums font-black" style={{ color: WIZ_FLOW_MODULE_CARD.indexMuted }}>{String(i + 1).padStart(2, '0')}</span>
                          <span style={{ color: WIZ_FLOW_MODULE_CARD.indexMuted }}>.&nbsp; </span>
                          {mod.name}
                        </h3>
                      </div>
                      <div className="text-right flex-shrink-0 max-w-[52%] pt-0.5">
                        {rich ? (
                          metricBelowBullets ? null : (
                            <>
                              {metric ? (
                                <p className="text-[15px] font-black leading-tight tracking-tight flex items-start justify-end gap-1" style={{ color: WIZ_FLOW_MODULE_CARD.accent }}>
                                  <span>{metricDisplay}</span>
                                  {MetricTrendIcon ? (
                                    <MetricTrendIcon
                                      className="shrink-0 mt-0.5"
                                      style={{
                                        width: `${WIZ_FLOW_MODULE_CARD.metricTrendIcon.sizeRem}rem`,
                                        height: `${WIZ_FLOW_MODULE_CARD.metricTrendIcon.sizeRem}rem`,
                                      }}
                                      strokeWidth={WIZ_FLOW_MODULE_CARD.metricTrendIcon.strokeWidth}
                                      aria-hidden
                                    />
                                  ) : null}
                                </p>
                              ) : (
                                <p className="text-[13px] font-bold leading-snug" style={{ color: WIZ_FLOW_MODULE_CARD.accent }}>{tagline}</p>
                              )}
                              {metric ? (
                                <p className="text-[11px] leading-snug mt-1 font-medium" style={{ color: WIZ_FLOW_MODULE_CARD.caption }}>{tagline}</p>
                              ) : null}
                            </>
                          )
                        ) : (
                          <div
                            className="flex items-center justify-center text-lg flex-shrink-0 ml-auto"
                            style={{
                              width: WIZ_FLOW_MODULE_CARD.iconFallback.size,
                              height: WIZ_FLOW_MODULE_CARD.iconFallback.size,
                              borderRadius: WIZ_FLOW_MODULE_CARD.iconFallback.radius,
                              background: WIZ_FLOW_MODULE_CARD.iconFallback.bg,
                              border: WIZ_FLOW_MODULE_CARD.iconFallback.border,
                            }}
                          >{iconChar}</div>
                        )}
                      </div>
                    </div>

                    <div className="mb-3 h-px w-full shrink-0" style={{ background: WIZ_FLOW_MODULE_CARD.divider }} />

                    {rich ? (
                      <>
                        {/* 상태·가치 태그 — 텍스트만 칩(태그) 형식 */}
                        {tags?.length ? (
                          <div className="flex flex-wrap items-center gap-2 mb-4">
                            {tags.map((tg, ti) => (
                              <span
                                key={ti}
                                className="inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold leading-none"
                                style={{
                                  background: WIZ_FLOW_MODULE_CARD.tagBg,
                                  color: WIZ_FLOW_MODULE_CARD.accent,
                                  border: WIZ_FLOW_MODULE_CARD.tagBorder,
                                }}
                              >
                                {tg}
                              </span>
                            ))}
                          </div>
                        ) : null}

                        {(mod.point || mod.pointEn) ? (
                          <WizFlowInsightBubbleFrame>
                            <WizFlowInsightBubbleBody
                              text={ko ? (mod.point ?? '') : (mod.pointEn ?? '')}
                              baseColor={WIZ_FLOW_MODULE_CARD.insightBase}
                              accentColor={WIZ_FLOW_MODULE_CARD.accent}
                            />
                          </WizFlowInsightBubbleFrame>
                        ) : null}

                        <p className="text-[12px] font-black mb-2.5" style={{ color: WIZ_FLOW_MODULE_CARD.accent }}>{ko ? '핵심 기능' : 'Key capabilities'}</p>
                        <ul className="space-y-3 mb-1 flex-1">
                          {(ko ? mod.bullets : mod.bulletsEn)?.map((line, li) => {
                            const iconKey = mod.bulletIconIds?.[li];
                            const BulletIcon = iconKey ? WIZ_FLOW_BULLET_ICONS[iconKey] : undefined;
                            return (
                              <li key={li} className="flex items-start gap-2.5">
                                <div
                                  className="size-6 rounded-lg flex items-center justify-center flex-shrink-0 text-white shadow-sm"
                                  style={{ background: WIZ_FLOW_MODULE_CARD.accent }}
                                  aria-hidden
                                >
                                  {BulletIcon ? (
                                    <BulletIcon className="size-2.5" strokeWidth={2} />
                                  ) : (
                                    <span className="text-[10px] font-black tabular-nums leading-none">{li + 1}</span>
                                  )}
                                </div>
                                <span className="text-[12px] leading-snug font-semibold pt-0.5" style={{ color: WIZ_FLOW_MODULE_CARD.bulletText }}>{line}</span>
                              </li>
                            );
                          })}
                        </ul>
                        {metricBelowBullets && (metric || tagline) ? (
                          <div
                            className="text-center"
                            style={{
                              borderTop: `1px solid ${WIZ_FLOW_MODULE_CARD.divider}`,
                              paddingTop: WIZ_FLOW_MODULE_CARD.footer.padTop,
                              marginTop: WIZ_FLOW_MODULE_CARD.footer.marginTop,
                            }}
                          >
                            {metric ? (
                              <p className="text-[15px] font-black leading-tight tracking-tight flex items-start justify-center gap-1" style={{ color: WIZ_FLOW_MODULE_CARD.accent }}>
                                <span>{metricDisplay}</span>
                                {MetricTrendIcon ? (
                                  <MetricTrendIcon
                                    className="shrink-0 mt-0.5"
                                    style={{
                                      width: `${WIZ_FLOW_MODULE_CARD.metricTrendIcon.sizeRem}rem`,
                                      height: `${WIZ_FLOW_MODULE_CARD.metricTrendIcon.sizeRem}rem`,
                                    }}
                                    strokeWidth={WIZ_FLOW_MODULE_CARD.metricTrendIcon.strokeWidth}
                                    aria-hidden
                                  />
                                ) : null}
                              </p>
                            ) : (
                              <p className="text-[13px] font-bold leading-snug" style={{ color: WIZ_FLOW_MODULE_CARD.accent }}>{tagline}</p>
                            )}
                            {metric && tagline ? (
                              <p className="text-[11px] leading-snug mt-1 font-medium" style={{ color: WIZ_FLOW_MODULE_CARD.caption }}>{tagline}</p>
                            ) : null}
                          </div>
                        ) : null}
                      </>
                    ) : (
                      <p className="text-[12px] leading-relaxed whitespace-pre-line font-medium" style={{ color: WIZ_FLOW_MODULE_CARD.bodyMuted }}>
                        {ko ? mod.desc : mod.descEn}
                      </p>
                    )}
                  </div>
                </motion.div>
              );
            })}
                  </div>
              </motion.div>
              </div>
            )}

            {/* ⑤⑥ Features + Why WIZ-Flow */}
            <div
              className="apple-section-gray relative -mx-6 px-6 py-14 md:py-20"
              {...(brochureCapture && isWizFlowProduct ? { 'data-brochure-slide': '8' } : {})}
            >
            <motion.div
              initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.30, ease: [0.22, 1, 0.36, 1] }}
              className=""
            >
                {/* sec-head — 작업지시 흐름(WizFlowProcessFlow)과 동일 타이포·3절 서술 톤 */}
                <div className="mb-9 text-center">
                  <h2
                    className="text-[30px] font-bold tracking-[-0.03em] sm:text-[32px]"
                    style={{ color: '#0f172a', margin: '0 0 10px', lineHeight: 1.12 }}
                  >
                    {isWizFlowProduct
                      ? (ko ? '현장이 원하는 모든 기능' : 'Everything the Shop-floor Needs')
                      : (ko ? '핵심 기능' : 'Key capabilities')}
                  </h2>
                  <p
                    className="mx-auto m-0 max-w-[34rem] text-[13px] font-normal leading-relaxed tracking-[-0.01em] text-[#86868b] sm:text-[14px]"
                    style={{ wordBreak: 'keep-all' }}
                  >
                    {isWizFlowProduct ? (
                      ko ? (
                        <>
                          <span className="font-semibold text-[#1d1d1f]">기능</span>은 검증하고,{' '}
                          <span className="font-semibold text-[#1d1d1f]">강점</span>은 살리고,{' '}
                          <span className="font-semibold text-[#1d1d1f]">현장</span>은 매일 더 빠르게 달라집니다.
                        </>
                      ) : (
                        <>
                          <span className="font-semibold text-[#1d1d1f]">Capabilities</span> are proven,{' '}
                          <span className="font-semibold text-[#1d1d1f]">strengths</span> compound, and the{' '}
                          <span className="font-semibold text-[#1d1d1f]">shop floor</span> moves faster every day.
                        </>
                      )
                    ) : (
                      ko ? (
                        <>
                          <span className="font-semibold text-[#1d1d1f]">{displayName}</span>가 제공하는{' '}
                          <span className="font-semibold text-[#1d1d1f]">기능</span>을{' '}
                          <span className="font-semibold text-[#1d1d1f]">카드</span>로 확인하세요.
                        </>
                      ) : (
                        <>
                          <span className="font-semibold text-[#1d1d1f]">{displayName}</span> — explore each{' '}
                          <span className="font-semibold text-[#1d1d1f]">capability</span> as a card.
                        </>
                      )
                    )}
                  </p>
                </div>

                <div className="flex flex-col gap-[14px]">

                  {/* ⑤ Features — 패널 카드 없이 그리드만 */}
                  <WizFlowFeatureCapabilityCardsGrid lines={displayFeatures} ko={ko} />

                  {/* ⑥ Why WIZ-Flow — 별도 행 전체 폭 */}
                  <div
                    className={`${WIZ_FLOW_IMPACT_INNER_CARD_CLASS} relative min-h-0 w-full overflow-hidden`}
                    style={{ minHeight: 280, WebkitFontSmoothing: 'antialiased' }}
                  >
                    <div className="mb-3 flex shrink-0 items-center justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <p
                          className="m-0 mb-1 text-[9px] font-semibold uppercase leading-none tracking-[0.07em] sm:text-[10px]"
                          style={{ color: '#B30710' }}
                        >
                          {ko ? '도입 강점' : (isWizFlowProduct ? 'WHY WIZ-Flow' : `WHY ${displayName}`)}
                        </p>
                        <h3
                          className="m-0 min-h-0 line-clamp-2 text-[12px] font-semibold leading-snug tracking-[-0.02em] sm:text-[13px]"
                          style={{ color: '#1d1d1f', fontFeatureSettings: '"tnum"' }}
                        >
                          {ko
                            ? `${displayName}를 선택하는 이유`
                            : `Reasons to Choose ${displayName}`}
                        </h3>
                      </div>
                      <span className="shrink-0 text-[10px] font-semibold tabular-nums sm:text-[11px]" style={{ color: '#8e8e93' }}>
                        {displayHighlights.length}{ko ? '가지 강점' : ' strengths'}
                      </span>
                    </div>
                    <div className="mb-4 h-px w-full shrink-0 bg-black/[0.06]" />
                    <div className="grid min-h-0 flex-1 grid-cols-1 gap-2 sm:auto-rows-[minmax(0,1fr)] sm:grid-cols-2 sm:gap-3 md:gap-3.5">
                      {displayHighlights.map((h, i) => (
                        <motion.div
                          key={i}
                          className="flex h-full min-h-0 flex-col"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.36 + i * 0.06, duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
                        >
                          <WizFlowDashCheckTile className="h-full min-h-0 flex flex-col" variant="stacked">
                            {h}
                          </WizFlowDashCheckTile>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                </div>
            </motion.div>
            </div>

            {/* ⑦ 활용 사례 */}
            <div
              className="apple-section-white relative -mx-6 px-6 py-14 md:py-20"
              {...(brochureCapture && isWizFlowProduct ? { 'data-brochure-slide': '9' } : {})}
            >
            <motion.div
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.38, ease: [0.22, 1, 0.36, 1] }}
              className=""
            >
                {s.useCaseStories?.length ? (
                  <WizFlowUseCasesSalesSection stories={s.useCaseStories} ko={ko} />
                ) : (
                  <>
                    <WizFlowUseCasesSectionHead ko={ko} isWizFlowProduct={isWizFlowProduct} />
                    <div className="grid grid-cols-1 gap-[14px] sm:grid-cols-2">
                      {displayUseCases.map((uc, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 22 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.55, delay: 0.38 + i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                          whileHover={{ y: -2, boxShadow: '0 8px 28px rgba(0,0,0,0.09)' }}
                          className="flex items-start gap-4"
                          style={{
                            ..._HTML_CARD,
                            padding: '20px',
                            minHeight: 100,
                            transition: 'transform .2s, box-shadow .2s',
                          }}
                        >
                          <div
                            className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center text-xs font-bold"
                            style={{ background: '#B30710', color: '#fff', borderRadius: 8 }}
                          >
                            {String(i + 1).padStart(2, '0')}
                          </div>
                          <div>
                            <p className="text-[10px] font-semibold uppercase" style={{ color: '#B30710', margin: 0, marginBottom: 4, letterSpacing: '0.07em' }}>
                              {ko ? '활용 사례' : 'USE CASE'}
                            </p>
                            <p className="text-[12px] font-medium leading-relaxed" style={{ color: '#3d3d3f' }}>{uc}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </>
                )}
            </motion.div>
            </div>

          </div>
        </div>
      </div>

      {mobileFsHintOpen &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="wiz-flow-fs-mobile-hint-title"
            className="fixed inset-0 z-[240] flex items-center justify-center p-5"
            style={{ backgroundColor: 'rgba(0,0,0,0.52)' }}
            onClick={() => setMobileFsHintOpen(false)}
          >
            <div
              className="w-full max-w-[min(100%,20rem)] rounded-2xl bg-white p-6 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <p
                id="wiz-flow-fs-mobile-hint-title"
                className="text-center text-[15px] font-semibold leading-snug text-[#1d1d1f]"
              >
                {ko ? 'PC에서 접속하여 보시길 바랍니다.' : 'Please open on a desktop or larger screen.'}
              </p>
              <p className="mt-2 text-center text-[13px] leading-relaxed text-[#86868b]">
                {ko
                  ? '전체 화면 보기는 PC 환경에 맞춰 제공됩니다.'
                  : 'Fullscreen view is intended for desktop-sized displays.'}
              </p>
              <button
                type="button"
                className="mt-5 w-full rounded-xl py-3 text-[15px] font-semibold text-white transition-opacity hover:opacity-90 active:opacity-95"
                style={{ background: LG_RED }}
                onClick={() => setMobileFsHintOpen(false)}
              >
                {ko ? '확인' : 'OK'}
              </button>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}

/** 모달 시트와 `/solution/:id` 페이지가 동일한 본문(WIZ-Flow 벤토·WIZ-FACT·기본 상세)을 쓰도록 공유 */
export function SolutionDetailContent({
  s,
  ko,
  language,
  t,
  variant,
  contentRef,
  wizFlowScrollRef,
  glassScrollRef,
  onContentTouchStart,
  brochureCapture,
}: {
  s: Solution;
  ko: boolean;
  language: string;
  t: (key: string) => string;
  variant: 'modal' | 'page';
  contentRef: RefObject<HTMLDivElement | null>;
  wizFlowScrollRef: RefObject<HTMLDivElement | null>;
  glassScrollRef: RefObject<HTMLDivElement | null>;
  onContentTouchStart?: (e: React.TouchEvent) => void;
  /** PDF 브로슈어 전용 페이지에서 WIZ-Flow 섹션 스크린샷 타겟 활성화 */
  brochureCapture?: boolean;
}) {
  const categoryColor = categories[s.category].color;
  const isWizFlowLayout = WIZ_FLOW_LAYOUT_SOLUTION_IDS.has(s.id);
  const isWizFact = s.id === 'wiz-fact';
  const isDarkBento = isWizFlowLayout || isWizFact;
  const displayName = ko ? s.nameKo : s.nameEn;
  const displaySubtitle = ko ? s.subtitle : s.subtitleEn;
  const displayDescription = ko ? s.detailedDescription : s.detailedDescriptionEn;
  const displayFeatures = ko ? s.features : s.featuresEn;
  const displayUseCases = ko ? s.useCases : s.useCasesEn;
  const displayIndustry = ko ? s.industry : s.industryEn;
  const sheetBg = isWizFlowLayout ? WIZ_FLOW_BG : isWizFact ? '#110608' : '#fff';

  const scrollClass =
    brochureCapture && isWizFlowLayout
      ? 'w-full min-h-0 scrollbar-hide flex flex-1 flex-col overflow-visible'
      : variant === 'modal'
        ? `h-full min-h-0 scrollbar-hide ${isDarkBento ? 'flex flex-col overflow-hidden' : 'overflow-y-auto max-h-dvh-95 md:max-h-[90vh]'}`
        : `w-full min-h-0 scrollbar-hide ${isDarkBento ? 'flex flex-1 flex-col overflow-hidden' : 'overflow-y-auto flex-1'}`;

  return (
    <div ref={contentRef} className={scrollClass} onTouchStart={onContentTouchStart}>
      {variant === 'modal' && (
        <div className="md:hidden h-7 shrink-0" style={{ background: sheetBg }} />
      )}

      {isWizFlowLayout ? (
        <div
          className={`flex min-h-0 flex-1 flex-col ${brochureCapture ? 'overflow-visible' : 'overflow-hidden'}`}
        >
          <ErrorBoundary
            fallback={
              <div
                className="flex min-h-[240px] flex-col items-center justify-center gap-3 rounded-2xl border border-red-200 bg-white p-8"
              >
                <p className="text-center text-sm font-semibold text-slate-800">
                  {ko
                    ? `${displayName} 화면을 불러오지 못했습니다. 새로고침 후 다시 시도해 주세요.`
                    : `Could not load ${displayName}. Please refresh and try again.`}
                </p>
              </div>
            }
          >
            <WizFlowBento
              s={s}
              ko={ko}
              language={language}
              t={t}
              scrollRef={wizFlowScrollRef}
              pageTaglineBelowHeader={variant === 'page'}
              brochureCapture={brochureCapture}
            />
          </ErrorBoundary>
        </div>
      ) : isWizFact ? (
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <ErrorBoundary>
            <WizFactBento s={s} scrollRef={glassScrollRef} pageTaglineBelowHeader={variant === 'page'} />
          </ErrorBoundary>
        </div>
      ) : (
        <>
          {variant === 'page' && (
            <div
              className="relative z-30 shrink-0 border-b border-black/[0.06]"
              style={{
                backgroundColor: 'var(--apple-surface-gray)',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.75)',
              }}
            >
              <p
                className="wiz-section py-2.5 text-center text-[12px] leading-snug tracking-tight text-[#424245] sm:py-2.5 sm:text-[13px]"
                style={{ margin: 0 }}
              >
                {displaySubtitle}
              </p>
            </div>
          )}
          <div className="px-8 md:px-16 pt-8 md:pt-16 pb-8 bg-white">
            <div className="mb-6">
              <span
                className="inline-block px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider"
                style={{ backgroundColor: `${categoryColor}15`, color: categoryColor }}
              >
                {getCategoryLabel(s.category, language)}
              </span>
            </div>
            <h2
              className={`text-4xl md:text-5xl font-bold leading-tight ${variant === 'page' ? 'mb-6' : 'mb-4'}`}
              style={{ color: 'var(--apple-text-primary)' }}
            >
              {displayName}
            </h2>
            {variant === 'modal' && (
              <p className="text-xl md:text-2xl mb-6 font-medium" style={{ color: 'var(--apple-text-secondary)' }}>
                {displaySubtitle}
              </p>
            )}
            <p className="text-lg leading-relaxed" style={{ color: 'var(--apple-text-secondary)' }}>
              {displayDescription}
            </p>
          </div>

          <div className="px-8 md:px-16 pb-14 bg-white">
            <div className="mb-12 mt-12">
              <h3 className="text-2xl md:text-3xl font-bold mb-6" style={{ color: 'var(--apple-text-primary)' }}>
                {t('detail.keyFeatures')}
              </h3>
              <div className="grid md:grid-cols-2 gap-3">
                {displayFeatures.map((feature, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 rounded-xl p-4"
                    style={{ background: 'var(--apple-bg-primary)' }}
                  >
                    <CheckCircle2 className="size-5 mt-0.5 flex-shrink-0" style={{ color: categoryColor }} />
                    <span className="text-sm leading-relaxed" style={{ color: '#3D3D3F' }}>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-12">
              <h3 className="text-2xl md:text-3xl font-bold mb-6" style={{ color: 'var(--apple-text-primary)' }}>
                {t('detail.useCases')}
              </h3>
              <div className="space-y-3">
                {displayUseCases.map((useCase, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-4 rounded-2xl p-5"
                    style={{ background: 'var(--apple-bg-primary)', border: '1px solid rgba(0,0,0,0.04)' }}
                  >
                    <div
                      className="w-8 h-8 rounded-xl flex-shrink-0 flex items-center justify-center text-xs font-bold"
                      style={{ background: `${categoryColor}18`, color: categoryColor }}
                    >
                      {String(idx + 1).padStart(2, '0')}
                    </div>
                    <p className="text-sm leading-relaxed pt-1" style={{ color: '#3D3D3F' }}>{useCase}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-12">
              <h3 className="text-2xl md:text-3xl font-bold mb-6" style={{ color: 'var(--apple-text-primary)' }}>
                {t('detail.technology')}
              </h3>
              <div className="flex flex-wrap gap-2">
                {s.techStack.map((tech, idx) => (
                  <span
                    key={idx}
                    className="px-4 py-2 rounded-full font-semibold text-sm"
                    style={{ background: 'var(--apple-bg-primary)', color: '#3D3D3F', border: '1px solid rgba(0,0,0,0.07)' }}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-2xl p-8" style={{ background: 'var(--apple-bg-primary)', border: '1px solid rgba(0,0,0,0.05)' }}>
              <div className="grid md:grid-cols-3 gap-8">
                <div>
                  <p className="text-xs font-semibold mb-2 uppercase tracking-wide" style={{ color: 'var(--apple-text-secondary)' }}>
                    {t('detail.category')}
                  </p>
                  <p className="text-lg font-bold" style={{ color: 'var(--apple-text-primary)' }}>
                    {getCategoryLabel(s.category, language)}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold mb-2 uppercase tracking-wide" style={{ color: 'var(--apple-text-secondary)' }}>
                    {t('detail.client')}
                  </p>
                  <p className="text-lg font-bold" style={{ color: 'var(--apple-text-primary)' }}>
                    {s.client === 'lg' ? (ko ? '엘지전자' : 'LG Electronics') : 'WIZ FACTORY'}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold mb-2 uppercase tracking-wide" style={{ color: 'var(--apple-text-secondary)' }}>
                    {t('detail.industry')}
                  </p>
                  <p className="text-lg font-bold" style={{ color: 'var(--apple-text-primary)' }}>{displayIndustry}</p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ── Main Modal ────────────────────────────────────────────────────────────────
export function SolutionModal({ solution, isOpen, onClose }: SolutionModalProps) {
  const { t, language } = useLanguage();
  const ko = language === 'ko';

  const y = useMotionValue(0);
  const [isMounted, setIsMounted] = useState(false);

  const lastSolution = useRef<Solution | null>(null);
  if (solution) lastSolution.current = solution;

  const isDragging = useRef(false);
  const dragStartY = useRef(0);
  const dragStartTime = useRef(0);
  const contentRef = useRef<HTMLDivElement>(null);
  const glassScrollRef = useRef<HTMLDivElement>(null);
  const wizFlowScrollRef = useRef<HTMLDivElement>(null);

  const backdropOpacity = useTransform(y, [0, 350], [1, 0]);

  const closeTimerRef = useRef<ReturnType<typeof setTimeout>>();

  const closeWithAnimation = useCallback(() => {
    const ctrl = animate(y, typeof window !== 'undefined' ? window.innerHeight : 900, {
      duration: 0.38, ease: [0.32, 0, 0.67, 0],
    });
    closeTimerRef.current = setTimeout(onClose, 350);
    return ctrl;
  }, [y, onClose]);

  useEffect(() => {
    let rafId: number;
    if (isOpen) {
      y.set(typeof window !== 'undefined' ? window.innerHeight : 900);
      setIsMounted(true);
      rafId = requestAnimationFrame(() => {
        animate(y, 0, { duration: 0.52, ease: [0.32, 0.72, 0, 1] });
      });
    } else if (isMounted) {
      const ctrl = animate(y, typeof window !== 'undefined' ? window.innerHeight : 900, {
        duration: 0.38, ease: [0.32, 0, 0.67, 0],
      });
      const timer = setTimeout(() => setIsMounted(false), 420);
      return () => { ctrl.stop(); clearTimeout(timer); };
    }
    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(closeTimerRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.documentElement.style.overflow = '';
    };
  }, [isOpen]);

  

  const startDrag = useCallback((clientY: number) => {
    isDragging.current = true;
    dragStartY.current = clientY;
    dragStartTime.current = Date.now();
  }, []);

  const handleHandleTouchStart = useCallback((e: React.TouchEvent) => {
    if (window.innerWidth >= 768) return;
    startDrag(e.touches[0].clientY);
  }, [startDrag]);

  const handleContentTouchStart = useCallback((e: React.TouchEvent) => {
    if (window.innerWidth >= 768) return;
    const scrollEl = glassScrollRef.current ?? wizFlowScrollRef.current ?? contentRef.current;
    if (scrollEl && scrollEl.scrollTop === 0) {
      startDrag(e.touches[0].clientY);
    }
  }, [startDrag]);

  useEffect(() => {
    if (!isMounted) return;
    const onMove = (e: TouchEvent) => {
      if (!isDragging.current) return;
      const delta = e.touches[0].clientY - dragStartY.current;
      if (delta > 0) y.set(delta);
    };
    const onEnd = () => {
      if (!isDragging.current) return;
      isDragging.current = false;
      const curY = y.get();
      const elapsed = Date.now() - dragStartTime.current;
      const velocity = elapsed > 0 ? (curY / elapsed) * 1000 : 0;
      if (curY > 140 || velocity > 600) {
        closeWithAnimation();
      } else {
        animate(y, 0, { duration: 0.35, ease: [0.32, 0.72, 0, 1] });
      }
    };
    window.addEventListener('touchmove', onMove, { passive: true });
    window.addEventListener('touchend', onEnd);
    return () => {
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onEnd);
    };
  }, [isMounted, y, closeWithAnimation]);

  if (!isMounted || !lastSolution.current) return null;

  const s = lastSolution.current;
  const isWizFlowLayout = WIZ_FLOW_LAYOUT_SOLUTION_IDS.has(s.id);
  const isWizFact = s.id === 'wiz-fact';
  /** WIZ-FACT만 다크 시트·닫기 버튼. WIZ-Flow 벤토 레이아웃은 라이트 헤더·시트 */
  const isDark = isWizFact;
  const isDarkBento = isWizFlowLayout || isWizFact;

  const displayName = ko ? s.nameKo : s.nameEn;

  // 모달 시트 배경색
  const sheetBg = isWizFlowLayout ? WIZ_FLOW_BG : isWizFact ? '#110608' : '#fff';

  return (
    <>
      {/* Backdrop */}
      <motion.div
        style={{ opacity: backdropOpacity, backgroundColor: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' } as React.CSSProperties}
        className="fixed inset-0 z-50"
        onClick={closeWithAnimation}
        aria-hidden="true"
      />

      {/* Sheet */}
      <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-8 pointer-events-none" role="dialog" aria-modal="true" aria-label={displayName}>
        <motion.div
          style={{ y, background: sheetBg }}
          className={`rounded-t-3xl md:rounded-3xl shadow-2xl w-full md:max-w-5xl overflow-hidden pointer-events-auto relative ${isDarkBento ? 'h-dvh-95 md:h-[88vh]' : 'h-dvh-95 md:h-auto md:max-h-[90vh]'}`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Mobile drag handle */}
          <div
            className="md:hidden flex flex-col items-center pt-3 pb-1 select-none touch-none cursor-grab active:cursor-grabbing absolute top-0 left-0 right-0 z-20"
            onTouchStart={handleHandleTouchStart}
            aria-hidden
            style={{ background: sheetBg }}
          >
            <div
              className="w-10 h-1 rounded-full mt-2 mb-1"
              style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.18)' : '#D1D1D6' }}
            />
          </div>

          {/* Close button — 다크 벤토: 모바일 h-7 스페이서 + 60px 헤더 세로중앙에 맞춤 (28+30−18=40px / 데스크 30−18=12px) */}
          <button
            onClick={closeWithAnimation}
            className={`absolute right-4 z-20 flex h-9 w-9 items-center justify-center rounded-full transition-all hover:scale-110 ${
              isDarkBento ? 'top-10 md:top-3' : 'top-4'
            }`}
            aria-label={ko ? '닫기' : 'Close'}
            style={{
              backgroundColor: isDark ? 'rgba(255,255,255,0.10)' : 'rgba(8,8,8,0.06)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = isDark ? 'rgba(255,255,255,0.18)' : 'rgba(8,8,8,0.12)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = isDark ? 'rgba(255,255,255,0.10)' : 'rgba(8,8,8,0.06)';
            }}
          >
            <X className="size-4" style={{ color: isDark ? '#fff' : '#1D1D1F', strokeWidth: 2.5 }} />
          </button>

          {/* Scrollable content — 다크 벤토(WIZ-Flow/WIZ-FACT)는 flex 컬럼으로 스페이서 아래 영역만 쓰게 해 h-full+스페이서 중복 높이 버그 방지 */}
          <SolutionDetailContent
            s={s}
            ko={ko}
            language={language}
            t={t}
            variant="modal"
            contentRef={contentRef}
            wizFlowScrollRef={wizFlowScrollRef}
            glassScrollRef={glassScrollRef}
            onContentTouchStart={handleContentTouchStart}
          />
        </motion.div>
      </div>
    </>
  );
}
