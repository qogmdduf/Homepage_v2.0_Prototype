import { motion, AnimatePresence, useMotionValue, useSpring } from 'motion/react';
import {
  ExternalLink, ArrowRight,
  Globe, Smartphone, FileText, Mail, Zap,
  Search, AlertTriangle, Wrench, BarChart2,
  ClipboardList, Camera, Bell,
  Clock, Check, CheckCircle2,
  WifiOff, Monitor, Download, Ban,
  Cpu, Bot, Layers, TrendingUp, Network,
} from 'lucide-react';
import { Solution, getCategoryLabel } from '../data/solutions';
import { useLanguage } from '../contexts/LanguageContext';
import { useState, useRef, useEffect, useMemo, type RefObject, type ReactNode } from 'react';
import React from 'react';

import wizFactWebImg from '../../assets/wiz-fact-web-screenshot.png';
import wizFactMobileImg from '../../assets/wiz-fact-mobile-screenshot.png';
import wizSymbol from '../../assets/symbol.svg';
import {
  PHONE_SCREEN, TABLET_SCREEN, MONITOR_SCREEN, LAPTOP_SCREEN,
  mockupPhone, mockupTablet, mockupLaptop, mockupMonitor,
} from './shared';

// ── 컬러 팔레트 (4색 제한) ───────────────────────────────────────────────────
const RED     = '#B30710';
const RED_DIM = 'rgba(187,8,65,0.14)';
const RED_BDR = 'rgba(187,8,65,0.28)';
const CARD_BG = '#1A0C10';
const PAGE_BG = '#110608';
const OK   = '#16a34a';
const WARN = '#f59e0b';
const NG   = '#e34911';

// ── WIZ-FACT 디바이스 목업 (WIZ-Flow MiniDashboard와 동일 구조, 다크 페이드) ──────────
const WizFactMiniDashboard = () => (
  <div className="absolute inset-0 pointer-events-none hidden md:block overflow-hidden">
    <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '62%' }}>

      {/* ① 노트북 16" */}
      <div style={{ position: 'absolute', bottom: 28, left: '0%', width: 342, zIndex: 12 }}>
        <img src={mockupLaptop} alt="" loading="lazy" style={{ width: '100%', display: 'block' }} />
        <img src={wizFactWebImg} alt="Laptop" loading="lazy" style={{
          position: 'absolute',
          left: LAPTOP_SCREEN.left, top: LAPTOP_SCREEN.top,
          width: LAPTOP_SCREEN.width, height: LAPTOP_SCREEN.height,
          objectFit: 'fill',
        }} />
      </div>

      {/* ② 모니터 27" */}
      <div style={{ position: 'absolute', bottom: 28, left: '2%', width: 508, zIndex: 11 }}>
        <img src={mockupMonitor} alt="" loading="lazy" style={{ width: '100%', display: 'block' }} />
        <img src={wizFactWebImg} alt="Monitor" loading="lazy" style={{
          position: 'absolute',
          left: MONITOR_SCREEN.left, top: MONITOR_SCREEN.top,
          width: MONITOR_SCREEN.width, height: MONITOR_SCREEN.height,
          objectFit: 'fill',
        }} />
      </div>

      {/* ③ 스마트폰 6" */}
      <div style={{ position: 'absolute', bottom: 28, left: '58%', width: 57, zIndex: 14 }}>
        <img src={mockupPhone} alt="" loading="lazy" style={{ width: '100%', display: 'block' }} />
        <img src={wizFactMobileImg} alt="Phone" loading="lazy" style={{
          position: 'absolute',
          left: PHONE_SCREEN.left, top: PHONE_SCREEN.top,
          width: PHONE_SCREEN.width, height: PHONE_SCREEN.height,
          objectFit: 'fill',
        }} />
      </div>

      {/* ④ 태블릿 12" */}
      <div style={{ position: 'absolute', bottom: 28, right: '4%', width: 155, zIndex: 13 }}>
        <img src={mockupTablet} alt="" loading="lazy" style={{ width: '100%', display: 'block' }} />
        <img src={wizFactMobileImg} alt="Tablet" loading="lazy" style={{
          position: 'absolute',
          left: TABLET_SCREEN.left, top: TABLET_SCREEN.top,
          width: TABLET_SCREEN.width, height: TABLET_SCREEN.height,
          objectFit: 'fill',
        }} />
      </div>

    </div>

    {/* 좌→우 페이드 (다크 배경) */}
    <div className="absolute inset-0" style={{
      background: `linear-gradient(90deg, ${CARD_BG} 0%, rgba(26,12,16,0.98) 38%, rgba(26,12,16,0.55) 52%, transparent 66%)`,
    }} />
    {/* 상단 페이드 */}
    <div className="absolute top-0 left-0 right-0 h-14" style={{
      background: `linear-gradient(to bottom, rgba(26,12,16,0.95) 0%, transparent 100%)`,
    }} />
  </div>
);

// ── Spring-animated number (continuous smooth updates) ────────────────────────
function SmoothNum({ value, suffix = '', prefix = '' }: { value: number; suffix?: string; prefix?: string }) {
  const mv = useMotionValue(value);
  const spring = useSpring(mv, { stiffness: 55, damping: 18, mass: 0.8 });
  const [display, setDisplay] = useState(value);
  useEffect(() => { mv.set(value); }, [value, mv]);
  useEffect(() => {
    const unsubscribe = spring.on('change', v => setDisplay(Math.round(v)));
    return unsubscribe;
  }, [spring]);
  return <>{prefix}{display}{suffix}</>;
}

// ── Spring-animated float (1 decimal) ────────────────────────────────────────
function SmoothFloat({ value, suffix = '' }: { value: number; suffix?: string }) {
  const mv = useMotionValue(value);
  const spring = useSpring(mv, { stiffness: 45, damping: 16 });
  const [display, setDisplay] = useState(value);
  useEffect(() => { mv.set(value); }, [value, mv]);
  useEffect(() => {
    const unsubscribe = spring.on('change', v => setDisplay(Math.round(v * 10) / 10));
    return unsubscribe;
  }, [spring]);
  return <>{display.toFixed(1)}{suffix}</>;
}

// ── 순차 녹색 체크 애니메이션 리스트 ────────────────────────────────────────────
function AnimatedCheckList({ items }: { items: string[] }) {
  const [checkedIdx, setCheckedIdx] = useState(-1);

  useEffect(() => {
    let alive = true;
    const STEP = 480;    // 항목 간 간격 ms
    const START = 900;   // 첫 체크 시작 딜레이
    const HOLD = 1200;   // 전체 완료 후 유지 ms

    const run = () => {
      if (!alive) return;
      setCheckedIdx(-1);
      const timers: ReturnType<typeof setTimeout>[] = [];

      items.forEach((_, i) => {
        timers.push(setTimeout(() => { if (alive) setCheckedIdx(i); }, START + i * STEP));
      });

      // 모두 체크된 뒤 HOLD ms 유지 후 처음부터 반복
      const loopAt = START + (items.length - 1) * STEP + HOLD;
      timers.push(setTimeout(() => { if (alive) run(); }, loopAt));

      return timers;
    };

    const timers = run();
    return () => {
      alive = false;
      timers?.forEach(clearTimeout);
    };
  }, [items.length]);

  return (
    <div className="flex flex-col gap-1.5 mt-1">
      {items.map((pt, pi) => {
        const isChecked = pi <= checkedIdx;
        return (
          <motion.div
            key={pi}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.62 + pi * 0.06, duration: 0.3 }}
            className="flex items-start gap-2 rounded-xl px-2.5 py-2 transition-colors duration-300"
            style={{
              background: isChecked ? 'rgba(34,197,94,0.10)' : 'rgba(255,255,255,0.08)',
              border: isChecked ? '1px solid rgba(34,197,94,0.32)' : '1px solid rgba(255,255,255,0.15)',
            }}>
            {/* 아이콘: 미체크(빈 원) → 체크(녹색) */}
            <motion.div
              className="flex-shrink-0 mt-0.5"
              animate={isChecked ? { scale: [1.4, 1] } : { scale: 1 }}
              transition={{ type: 'spring', stiffness: 320, damping: 18 }}>
              {isChecked ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.4 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}>
                  <CheckCircle2 size={13} style={{ color: '#22c55e' }} />
                </motion.div>
              ) : (
                <div
                  className="w-[13px] h-[13px] rounded-full"
                  style={{ border: '1.5px solid rgba(255,255,255,0.32)' }}
                />
              )}
            </motion.div>
            <p
              className="text-[10px] leading-snug transition-colors duration-300"
              style={{ color: isChecked ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.65)' }}>
              {pt}
            </p>
          </motion.div>
        );
      })}
    </div>
  );
}

// ── Bento card wrapper ────────────────────────────────────────────────────────
function GCard({
  children, className = '', delay = 0, style = {}, red = false,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  style?: React.CSSProperties;
  red?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.52, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4, transition: { duration: 0.2, ease: [0.22, 1, 0.36, 1] } }}
      className={`rounded-3xl relative overflow-hidden group ${className}`}
      style={{
        background: red ? RED : CARD_BG,
        border: `1px solid ${red ? 'rgba(187,8,65,0.5)' : 'rgba(255,255,255,0.05)'}`,
        ...style,
      }}
    >
      <div
        className="absolute -top-10 -right-10 w-36 h-36 rounded-full pointer-events-none transition-opacity duration-500 opacity-0 group-hover:opacity-50"
        style={{
          background: red
            ? 'radial-gradient(ellipse, rgba(255,255,255,0.18) 0%, transparent 70%)'
            : `radial-gradient(ellipse, ${RED}44 0%, transparent 70%)`,
          filter: 'blur(24px)',
        }}
      />
      <div
        className="absolute bottom-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-b-3xl"
        style={{
          background: red
            ? 'linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent)'
            : `linear-gradient(90deg, transparent, ${RED}99, transparent)`,
        }}
      />
      {children}
    </motion.div>
  );
}

// ── Icon box ──────────────────────────────────────────────────────────────────
function IBox({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0"
      style={{ background: RED_DIM, border: `1px solid ${RED_BDR}` }}
    >
      {children}
    </div>
  );
}

// ── Section eyebrow label ─────────────────────────────────────────────────────
const EL = ({ text, light = false }: { text: string; light?: boolean }) => (
  <p className="text-[10px] font-bold tracking-[0.16em] mb-2"
    style={{ color: light ? 'rgba(255,255,255,0.45)' : `${RED}cc` }}>
    {text.toUpperCase()}
  </p>
);

// ── Donut ring SVG ────────────────────────────────────────────────────────────
function DonutRing({ pct, size = 72, stroke = 7, color }: { pct: number; size?: number; stroke?: number; color: string }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke="rgba(255,255,255,0.07)" strokeWidth={stroke} />
      <motion.circle cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke={color} strokeWidth={stroke} strokeLinecap="round"
        strokeDasharray={circ}
        initial={{ strokeDashoffset: circ }}
        animate={{ strokeDashoffset: circ - dash }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
      />
    </svg>
  );
}

// ── Sparkline SVG ─────────────────────────────────────────────────────────────
function Sparkline({ values, color, w = 80, h = 28 }: { values: number[]; color: string; w?: number; h?: number }) {
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;
  const pts = values.map((v, i) => {
    const x = (i / (values.length - 1)) * w;
    const y = h - ((v - min) / range) * h * 0.85 - h * 0.075;
    return `${x},${y}`;
  }).join(' ');
  const last = pts.split(' ').at(-1)?.split(',') ?? ['0', '0'];
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" opacity={0.7} />
      <circle cx={last[0]} cy={last[1]} r="2.5" fill={color} />
    </svg>
  );
}

// ── Line row sub-component (stable identity → no remount on data change) ───────
const LineRow = ({
  name, dept, ng, total, rate, status, isChanged, ko,
}: {
  name: string; dept: string; ng: number; total: number;
  rate: number; status: 'OK' | 'WARN' | 'NG'; isChanged: boolean; ko: boolean;
}) => {
  const col = status === 'OK' ? OK : status === 'WARN' ? WARN : NG;
  const label = status === 'OK' ? (ko ? '완료' : 'Done') : status === 'WARN' ? (ko ? '검토중' : 'Review') : (ko ? '미조치' : 'Pending');
  return (
    <motion.div
      animate={{ backgroundColor: isChanged ? `${col}12` : 'rgba(0,0,0,0)' }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className="flex-1 grid items-center px-4 relative"
      style={{ gridTemplateColumns: '1fr 1fr 2fr 52px' }}>
      {/* 좌측 액센트 바 */}
      <motion.div
        className="absolute left-0 top-2 bottom-2 w-0.5 rounded-full"
        animate={{ opacity: isChanged ? 0.9 : 0, scaleY: isChanged ? 1 : 0.2 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        style={{ background: col, transformOrigin: 'center' }}
      />
      {/* 라인명 + 펄스 도트 */}
      <div className="flex items-center gap-1.5">
        <motion.div
          className="w-1.5 h-1.5 rounded-full flex-shrink-0"
          animate={{
            backgroundColor: col,
            opacity: status === 'NG' ? [1, 0.12, 1] : 1,
          }}
          transition={{ repeat: status === 'NG' ? Infinity : 0, duration: 1.4, ease: 'easeInOut' }}
        />
        <span className="text-xs font-bold text-white">{name}</span>
      </div>
      {/* 공정 */}
      <span className="text-[10px]" style={{ color: 'rgba(255,255,255,0.38)' }}>{dept}</span>
      {/* 진행률 바 */}
      <div className="pr-3">
        <div className="flex justify-between mb-0.5">
          <span className="text-[8px]" style={{ color: 'rgba(255,255,255,0.25)' }}>
            NG <SmoothNum value={ng} /> / {total}
          </span>
          <motion.span
            animate={{ color: col }}
            transition={{ duration: 0.6 }}
            className="text-[8px] font-bold">
            <SmoothNum value={rate} suffix="%" />
          </motion.span>
        </div>
        <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.07)' }}>
          <motion.div
            className="h-full rounded-full"
            animate={{ width: `${rate}%`, backgroundColor: col }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
      </div>
      {/* 상태 배지 */}
      <motion.span
        animate={{
          backgroundColor: `${col}20`,
          color: col,
          borderColor: `${col}50`,
        }}
        transition={{ duration: 0.6 }}
        className="text-[9px] font-bold px-2 py-0.5 rounded-md flex-shrink-0 inline-flex items-center justify-center border">
        {label}
      </motion.span>
    </motion.div>
  );
};

// ── Live Audit Dashboard (실시간 동적 업데이트) ────────────────────────────────
const LiveAudit = ({ ko }: { ko: boolean }) => {
  type LineStatus = 'NG' | 'WARN' | 'OK';

  const TOTALS = [8, 9, 6] as const;
  const TOTAL_ITEMS = 23;

  const koRef = useRef(ko);
  koRef.current = ko;

  const [data, setData] = useState({
    ngs:      [3, 1, 0] as number[],
    trend:    [58, 72, 65, 80, 75, 88, 92] as number[],
    resolved: 19,
  });
  const dataRef = useRef(data);
  dataRef.current = data;

  const [changedIdx, setChangedIdx]   = useState<number | null>(null);
  const [events, setEvents]           = useState<{ id: number; text: string; isNG: boolean }[]>([]);
  const eventIdRef = useRef(0);

  useEffect(() => {
    const id = setInterval(() => {
      const { ngs, trend, resolved } = dataRef.current;
      const k   = koRef.current;
      const idx = Math.floor(Math.random() * 3);
      const cur = ngs[idx];

      const delta  = Math.random() > 0.38 ? -1 : 1;
      const newNg  = Math.max(0, Math.min(TOTALS[idx], cur + delta));
      const newNgs = [...ngs];
      newNgs[idx]  = newNg;

      const lastVal      = trend[trend.length - 1];
      const newTrendVal  = Math.min(98, Math.max(48, lastVal + (Math.random() * 10 - 4)));
      const newTrend     = [...trend.slice(1), Math.round(newTrendVal)];

      const newResolved  = Math.min(TOTAL_ITEMS - 1, resolved + (Math.random() > 0.55 ? 1 : 0));

      setData({ ngs: newNgs, trend: newTrend, resolved: newResolved });
      setChangedIdx(idx);
      setTimeout(() => setChangedIdx(null), 1100);

      const lineNames = k ? ['A라인', 'B라인', 'C라인'] : ['A-Line', 'B-Line', 'C-Line'];
      const isNewNG   = delta > 0 && newNg > cur;
      const eText     = lineNames[idx] + (isNewNG
        ? (k ? ' — NG 발생' : ' — NG detected')
        : (k ? ' — 조치 완료' : ' — Resolved'));
      setEvents(prev => {
        const eid = ++eventIdRef.current;
        return [{ id: eid, text: eText, isNG: isNewNG }, ...prev].slice(0, 4);
      });
    }, 2800);
    return () => clearInterval(id);
  }, []);

  // ── 파생 값 ──
  const rates    = data.ngs.map((ng, i) => Math.round(((TOTALS[i] - ng) / TOTALS[i]) * 100));
  const calcSt   = (r: number): LineStatus => r >= 85 ? 'OK' : r >= 70 ? 'WARN' : 'NG';
  const statuses = rates.map(calcSt);
  const totalNg  = data.ngs.reduce((s, n) => s + n, 0);
  const avgRate  = Math.round(rates.reduce((s, r) => s + r, 0) / rates.length);
  const avgFix   = Math.max(0.5, 2.1 - (data.resolved - 19) * 0.04);
  const trendDiff = data.trend[data.trend.length - 1] - data.trend[data.trend.length - 2];
  const donutCol  = calcSt(avgRate) === 'OK' ? OK : calcSt(avgRate) === 'WARN' ? WARN : NG;

  const linesMeta = ko
    ? [{ name: 'A라인', dept: '용접/조립' }, { name: 'B라인', dept: '포장/출하' }, { name: 'C라인', dept: '외관/도장' }]
    : [{ name: 'A-Line', dept: 'Welding' }, { name: 'B-Line', dept: 'Packing' }, { name: 'C-Line', dept: 'Painting' }];

  return (
    <div className="flex-1 flex flex-col gap-2.5 mt-2 min-h-0">

      {/* ── KPI 상단 4칸 — SmoothNum으로 자연스럽게 카운팅 ── */}
      <div className="grid grid-cols-4 gap-2 flex-shrink-0">
        {[
          { node: <SmoothNum value={TOTAL_ITEMS} />,  l: ko ? '점검 항목' : 'Items',    c: 'rgba(255,255,255,0.85)' },
          { node: <SmoothNum value={totalNg} />,       l: ko ? '지적 건수' : 'Issues',   c: NG },
          { node: <SmoothNum value={avgRate} suffix="%" />, l: ko ? '달성률' : 'Rate',   c: OK },
          { node: <SmoothFloat value={avgFix} suffix="h" />, l: ko ? '평균 조치' : 'Avg Fix', c: WARN },
        ].map((k) => (
          <div key={k.l} className="rounded-xl p-2.5 text-center flex flex-col items-center gap-1"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <span className="text-base font-black leading-none" style={{ color: k.c }}>{k.node}</span>
            <span className="text-[9px]" style={{ color: 'rgba(255,255,255,0.35)' }}>{k.l}</span>
          </div>
        ))}
      </div>

      {/* ── 달성률 도넛 + 트렌드 스파크라인 ── */}
      <div className="rounded-2xl p-4 flex items-center gap-4 flex-shrink-0"
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="relative flex-shrink-0">
          <DonutRing pct={avgRate} size={72} stroke={7} color={donutCol} />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {/* key 없이 — SmoothNum이 내부에서 spring으로 보간 */}
            <span className="text-sm font-black text-white leading-none">
              <SmoothNum value={avgRate} suffix="%" />
            </span>
            <span className="text-[8px]" style={{ color: 'rgba(255,255,255,0.38)' }}>{ko ? '달성' : 'Rate'}</span>
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-semibold" style={{ color: 'rgba(255,255,255,0.5)' }}>
              {ko ? '주간 달성률 추이' : 'Weekly Rate Trend'}
            </span>
            <motion.span
              animate={{ color: trendDiff >= 0 ? OK : NG }}
              transition={{ duration: 0.8 }}
              className="text-[9px] font-bold">
              {trendDiff >= 0 ? '▲' : '▼'} {Math.abs(trendDiff)}%
            </motion.span>
          </div>
          {/* 스파크라인: SVG 포인트가 바뀌어도 <polyline>이 부드럽게 리렌더 */}
          <Sparkline values={data.trend} color={OK} w={110} h={28} />
          <div className="mt-2">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[9px]" style={{ color: 'rgba(255,255,255,0.35)' }}>
                {ko ? '조치 완료' : 'Resolved'} <SmoothNum value={data.resolved} /> / {TOTAL_ITEMS}
              </span>
              <span className="text-[9px]" style={{ color: 'rgba(255,255,255,0.35)' }}>
                {ko ? '미완료' : 'Pending'} <SmoothNum value={TOTAL_ITEMS - data.resolved} />
              </span>
            </div>
            <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
              <motion.div className="h-full rounded-full"
                style={{ background: `linear-gradient(90deg, ${OK}, ${OK}99)` }}
                animate={{ width: `${Math.round((data.resolved / TOTAL_ITEMS) * 100)}%` }}
                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }} />
            </div>
          </div>
        </div>
      </div>

      {/* ── 라인별 현황 테이블 ── */}
      <div className="flex-1 flex flex-col rounded-2xl overflow-hidden min-h-0"
        style={{ border: '1px solid rgba(255,255,255,0.07)' }}>
        {/* 헤더 */}
        <div className="grid px-4 py-2 flex-shrink-0"
          style={{ gridTemplateColumns: '1fr 1fr 2fr 52px', background: 'rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          {[ko ? '라인' : 'Line', ko ? '공정' : 'Dept', ko ? '진행률' : 'Progress', ko ? '상태' : 'Status'].map((h) => (
            <span key={h} className="text-[9px] font-bold" style={{ color: 'rgba(255,255,255,0.3)' }}>{h}</span>
          ))}
        </div>
        {/* 행: stable key → remount 없음 */}
        <div className="flex-1 flex flex-col min-h-0 divide-y" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
          {linesMeta.map((ln, i) => (
            <LineRow
              key={ln.name}
              name={ln.name}
              dept={ln.dept}
              ng={data.ngs[i]}
              total={TOTALS[i]}
              rate={rates[i]}
              status={statuses[i]}
              isChanged={changedIdx === i}
              ko={ko}
            />
          ))}
        </div>
      </div>

      {/* ── 실시간 이벤트 로그 ── */}
      <div className="flex-shrink-0 rounded-xl px-3 py-2 flex items-center gap-2 overflow-hidden"
        style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.055)' }}>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <motion.div
            animate={{ opacity: [1, 0.15, 1] }}
            transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: OK }} />
          <span className="text-[9px] font-bold tracking-[0.14em]" style={{ color: 'rgba(255,255,255,0.28)' }}>LIVE</span>
        </div>
        <div className="w-px h-3 flex-shrink-0" style={{ background: 'rgba(255,255,255,0.1)' }} />
        <div className="flex-1 overflow-hidden relative h-4">
          <AnimatePresence mode="popLayout">
            {events[0] ? (
              <motion.span
                key={events[0].id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="text-[9px] font-semibold absolute inset-0 flex items-center truncate"
                style={{ color: events[0].isNG ? NG : OK }}>
                {events[0].text}
              </motion.span>
            ) : (
              <motion.span
                key="waiting"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-[9px] absolute inset-0 flex items-center"
                style={{ color: 'rgba(255,255,255,0.18)' }}>
                {ko ? '이벤트 대기 중...' : 'Waiting for events...'}
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>

    </div>
  );
};

// ── Audit bar chart ───────────────────────────────────────────────────────────
const AuditChart = ({ ko }: { ko: boolean }) => {
  const bars = [
    { h: 60, o: 0.55, l: ko ? '1월' : 'Jan' },
    { h: 85, o: 0.70, l: ko ? '2월' : 'Feb' },
    { h: 40, o: 0.45, l: ko ? '3월' : 'Mar' },
    { h: 70, o: 0.65, l: ko ? '4월' : 'Apr' },
    { h: 28, o: 0.38, l: ko ? '5월' : 'May' },
    { h: 55, o: 0.58, l: ko ? '6월' : 'Jun' },
    { h: 90, o: 0.80, l: ko ? '7월' : 'Jul' },
  ];
  return (
    <div className="rounded-2xl p-4 mt-4"
      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] font-semibold" style={{ color: 'rgba(255,255,255,0.45)' }}>
          {ko ? '월별 점검 현황' : 'Monthly Audit Status'}
        </span>
        <span className="text-[9px] font-bold px-2 py-0.5 rounded"
          style={{ background: RED_DIM, color: RED, border: `1px solid ${RED_BDR}` }}>
          {ko ? '자동' : 'AUTO'}
        </span>
      </div>
      <div className="flex items-end gap-1.5" style={{ height: 52 }}>
        {bars.map((b, i) => (
          <div key={i} className="flex flex-col items-center flex-1 gap-1">
            <motion.div className="w-full rounded-sm"
              initial={{ height: 0 }}
              animate={{ height: `${b.h}%` }}
              transition={{ delay: 0.3 + i * 0.07, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              style={{ background: RED, opacity: b.o, maxHeight: 44 }} />
            <span className="text-[8px]" style={{ color: 'rgba(255,255,255,0.28)' }}>{b.l}</span>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-2 mt-3">
        {[
          { v: ko ? '23건' : '23', l: ko ? '지적' : 'Issues', c: NG },
          { v: '92%',              l: ko ? '달성률' : 'Rate',   c: OK },
          { v: '2.1h',             l: ko ? '평균 조치' : 'Avg. Action', c: 'rgba(255,255,255,0.6)' },
        ].map((k) => (
          <div key={k.l} className="rounded-xl p-2 text-center" style={{ background: 'rgba(255,255,255,0.04)' }}>
            <div className="text-sm font-bold" style={{ color: k.c }}>{k.v}</div>
            <div className="text-[8px]" style={{ color: 'rgba(255,255,255,0.32)' }}>{k.l}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── Workflow step icons ───────────────────────────────────────────────────────
const STEP_ICONS = [
  <Search        key="s" className="size-5" />,
  <AlertTriangle key="a" className="size-5" />,
  <Wrench        key="w" className="size-5" />,
  <BarChart2     key="b" className="size-5" />,
];

// ── Live Language Switch Dashboard ────────────────────────────────────────────
const LANG_DATA = [
  { flag: '🇰🇷', code: 'KR', nameKo: '한국어', nameEn: 'Korean',  sample: '라인 점검 완료',        sub: 'NG 0건 · 달성률 100%',  statusKo: '합격', statusEn: 'PASS', pct: 62 },
  { flag: '🇺🇸', code: 'EN', nameKo: '영어',   nameEn: 'English', sample: 'Inspection Complete', sub: 'NG 0 · Rate 100%',      statusKo: 'PASS', statusEn: 'PASS', pct: 21 },
  { flag: '🇨🇳', code: 'CN', nameKo: '중국어', nameEn: 'Chinese', sample: '检查完成',              sub: '无不良 · 达成率 100%',  statusKo: '通过', statusEn: '通过', pct: 12 },
  { flag: '🇹🇭', code: 'TH', nameKo: '태국어', nameEn: 'Thai',    sample: 'ตรวจสอบเสร็จสิ้น',    sub: 'NG 0 · อัตรา 100%',    statusKo: 'ผ่าน', statusEn: 'ผ่าน',  pct: 5  },
];

const LiveLangSwitch = ({ ko }: { ko: boolean }) => {
  const [active, setActive] = useState(0);
  const lang = LANG_DATA[active];

  const kpis = [
    { v: '4',  l: ko ? '지원 언어' : 'Languages', c: 'rgba(255,255,255,0.85)' },
    { v: '8',  l: ko ? '적용 국가' : 'Countries',  c: OK },
    { v: ko ? '즉시' : '0ms', l: ko ? '전환 속도' : 'Switch', c: RED },
    { v: '100%', l: ko ? 'UI 현지화' : 'Localized', c: OK },
  ];
  return (
    <div className="flex-1 flex flex-col gap-2.5 mt-2 min-h-0">

      {/* ── KPI 4칸 ── */}
      <div className="grid grid-cols-4 gap-2 flex-shrink-0">
        {kpis.map((k) => (
          <div key={k.l}
            className="rounded-xl p-2.5 text-center flex flex-col items-center gap-1"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <span className="text-base font-black leading-none" style={{ color: k.c }}>{k.v}</span>
            <span className="text-[9px]" style={{ color: 'rgba(255,255,255,0.35)' }}>{k.l}</span>
          </div>
        ))}
      </div>

      {/* ── 중간 패널: 도넛 + 우측 4줄 정보 ── */}
      <div className="rounded-2xl p-4 flex items-center gap-4 flex-shrink-0"
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
        {/* 좌: 도넛 + 플래그 */}
        <div className="relative flex-shrink-0" style={{ width: 72, height: 72 }}>
          <DonutRing pct={lang.pct} size={72} stroke={7} color={RED} />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.span key={`flag-${active}`}
                initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.6 }}
                transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                className="text-xl leading-none">{lang.flag}
              </motion.span>
            </AnimatePresence>
            <span className="text-[8px] font-bold mt-0.5" style={{ color: 'rgba(255,255,255,0.38)' }}>{lang.pct}%</span>
          </div>
        </div>
        {/* 우: 언어명·LIVE / 굵은 빨간 바 / 얇은 회색 바 / 샘플·합격 */}
        <div className="flex-1 min-w-0 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <AnimatePresence mode="wait">
              <motion.span key={`name-${active}`}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
                className="text-[10px] font-semibold"
                style={{ color: 'rgba(255,255,255,0.5)' }}>
                {ko ? lang.nameKo : lang.nameEn} · {lang.code}
              </motion.span>
            </AnimatePresence>
            <motion.div className="flex items-center gap-1"
              animate={{ opacity: [1, 0.35, 1] }}
              transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}>
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: OK }} />
              <span className="text-[9px] font-bold" style={{ color: OK }}>LIVE</span>
            </motion.div>
          </div>
          <div className="flex items-center justify-between">
            <AnimatePresence mode="wait">
              <motion.span key={`sample-${active}`}
                initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 6 }}
                transition={{ duration: 0.22 }}
                className="text-[9px] truncate"
                style={{ color: 'rgba(255,255,255,0.4)', maxWidth: 130 }}>
                {lang.sample}
              </motion.span>
            </AnimatePresence>
            <AnimatePresence mode="wait">
              <motion.span key={`status-${active}`}
                initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.18 }}
                className="text-[9px] font-bold px-2 py-0.5 rounded-md ml-2 flex-shrink-0"
                style={{ background: `${OK}20`, color: OK, border: `1px solid ${OK}40` }}>
                {ko ? lang.statusKo : lang.statusEn}
              </motion.span>
            </AnimatePresence>
          </div>
          <div className="w-full h-3 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.07)' }}>
            <motion.div className="h-full rounded-full" style={{ background: RED }}
              initial={{ width: 0 }} animate={{ width: `${lang.pct}%` }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.3 }} />
          </div>
          <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.07)' }}>
            <motion.div className="h-full rounded-full" style={{ background: 'rgba(255,255,255,0.18)' }}
              initial={{ width: 0 }} animate={{ width: `${Math.min(lang.pct * 1.4, 100)}%` }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.45 }} />
          </div>
        </div>
      </div>

      {/* ── 언어 테이블: flex-1로 남은 공간 채움 ── */}
      <div className="flex-1 flex flex-col rounded-2xl overflow-hidden min-h-0"
        style={{ border: '1px solid rgba(255,255,255,0.07)' }}>
        {/* 헤더 */}
        <div className="grid px-4 py-2 flex-shrink-0"
          style={{ gridTemplateColumns: '12px 1fr 2fr 32px', background: 'rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          {(['·', ko ? '언어' : 'Language', ko ? '사용 비율' : 'Usage Share', ko ? '선택' : 'Sel']).map((h, idx) => (
            <span key={idx} className={`text-[9px] font-bold ${idx === 3 ? 'text-center' : ''}`} style={{ color: 'rgba(255,255,255,0.3)' }}>{h}</span>
          ))}
        </div>
        {/* 행: flex-1로 4행이 테이블 높이를 균등 분할 */}
        <div className="flex-1 flex flex-col min-h-0">
          {LANG_DATA.map((lng, i) => {
            const isActive = active === i;
            return (
              <motion.button key={lng.code}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.07, duration: 0.35 }}
                onClick={() => setActive(i)}
                className="w-full flex-1 grid items-center px-4 cursor-pointer text-left"
                style={{
                  gridTemplateColumns: '12px 1fr 2fr 32px',
                  borderBottom: i < LANG_DATA.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                  background: isActive ? `${RED}1a` : 'transparent',
                }}>
                <motion.div className="w-1.5 h-1.5 rounded-full"
                  style={{ background: isActive ? RED : 'rgba(255,255,255,0.2)' }}
                  animate={{ opacity: isActive ? [1, 0.2, 1] : 1 }}
                  transition={{ repeat: isActive ? Infinity : 0, duration: 1.2 }} />
                <div className="flex items-center gap-1.5">
                  <span className="text-sm leading-none">{lng.flag}</span>
                  <span className="text-xs font-bold"
                    style={{ color: isActive ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.45)' }}>
                    {ko ? lng.nameKo : lng.nameEn}
                  </span>
                </div>
                <div className="pr-3">
                  <div className="flex justify-between mb-0.5">
                    <span className="text-[8px]" style={{ color: 'rgba(255,255,255,0.25)' }}>{lng.code}</span>
                    <span className="text-[8px] font-bold" style={{ color: isActive ? RED : 'rgba(255,255,255,0.28)' }}>{lng.pct}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.07)' }}>
                    <motion.div className="h-full rounded-full"
                      style={{ background: isActive ? RED : 'rgba(255,255,255,0.22)' }}
                      initial={{ width: 0 }}
                      animate={{ width: `${lng.pct}%` }}
                      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.3 + i * 0.07 }} />
                  </div>
                </div>
                {/* 라디오 버튼 */}
                <div className="flex items-center justify-center">
                  <div className="relative flex items-center justify-center"
                    style={{ width: 13, height: 13 }}>
                    <motion.div
                      className="absolute inset-0 rounded-full"
                      style={{
                        border: `${isActive ? 1.5 : 1}px solid ${isActive ? RED : 'rgba(255,255,255,0.18)'}`,
                        background: isActive ? `${RED}12` : 'transparent',
                      }}
                      animate={{
                        borderColor: isActive ? RED : 'rgba(255,255,255,0.18)',
                      }}
                      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                    />
                    <motion.div
                      className="rounded-full"
                      initial={false}
                      animate={{ scale: isActive ? 1 : 0, opacity: isActive ? 1 : 0 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 28 }}
                      style={{
                        width: 5, height: 5,
                        background: RED,
                        boxShadow: isActive ? `0 0 4px ${RED}88` : 'none',
                      }}
                    />
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

    </div>
  );
};

// ── Main WizFactBento ────────────────────────────────────────────────────────────
export function WizFactBento({ s, scrollRef, pageTaglineBelowHeader }: {
  s: Solution;
  scrollRef?: RefObject<HTMLDivElement>;
  /** `/solution/:id` 전용: 태그라인(~시작하기)만 Apple식 서브바로 분리 — 모달은 false */
  pageTaglineBelowHeader?: boolean;
}) {
  const { language } = useLanguage();
  const ko = language === 'ko';

  // 모바일 감지
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);


  // 이벤트 기반 자동 발송 — 단계별 순환 애니메이션
  const [activeStep,   setActiveStep]   = useState(0);
  const [stepProgress, setStepProgress] = useState(0);
  const [allComplete,  setAllComplete]  = useState(false);

  useEffect(() => {
    const STEP_HOLD     = 1800;
    const FILL_DURATION = 1400;
    const COMPLETE_HOLD = 2800; // 마지막 단계 완료 후 전체 초록 유지

    if (allComplete) {
      const timer = setTimeout(() => {
        setAllComplete(false);
        setActiveStep(0);
        setStepProgress(0);
      }, COMPLETE_HOLD);
      return () => clearTimeout(timer);
    }

    let startTime = 0;
    let rafId: number;
    const tick = (ts: number) => {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / FILL_DURATION, 1);
      setStepProgress(progress);
      if (progress < 1) rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    const timer = setTimeout(() => {
      if (activeStep === 3) {
        setAllComplete(true);
      } else {
        setActiveStep(prev => prev + 1);
        setStepProgress(0);
      }
    }, STEP_HOLD);

    return () => { cancelAnimationFrame(rafId); clearTimeout(timer); };
  }, [activeStep, allComplete]);

  const displayDesc       = ko ? s.detailedDescription  : s.detailedDescriptionEn;
  const displayFeatures   = ko ? s.features             : s.featuresEn;
  const displayUseCases   = ko ? s.useCases             : s.useCasesEn;
  const displayHighlights = ko ? (s.highlights ?? [])   : (s.highlightsEn ?? []);
  const displayIndustry   = ko ? s.industry             : s.industryEn;
  const lgLabel           = ko ? '엘지전자'              : 'LG Electronics';

  // i18n 헬퍼
  const t = {
    solution:       ko ? '솔루션'           : 'SOLUTION',
    subtitle:       ko ? '품질 점검 관리 시스템' : 'Quality Inspection Management System',
    liveDemoBadge:  ko ? '라이브 데모'       : 'LIVE DEMO',
    tryDemo:        ko ? '데모 체험하기'     : 'Try Live Demo',
    keyMetrics:     ko ? '핵심 지표'         : 'KEY METRICS',
    workflow:       ko ? '워크플로우'        : 'WORKFLOW',
    workflowTitle:  ko ? '디지털 점검 단계' : '4-Step Digital Inspection Workflow',
    coreProcess:    ko ? '핵심 프로세스'     : 'Core Process',
    todayAudit:     ko ? '오늘의 점검'       : "TODAY'S INSPECTION",
    liveStatus:     ko ? '실시간 점검 현황'  : 'Real-time Inspection Status',
    global:         ko ? '글로벌'            : 'GLOBAL',
    multiLang:      ko ? '다국어 지원'       : 'Multi-language',
    langSwitch:     ko ? '화면 전환 없이 실시간 언어 변경' : 'Real-time language switch without reload',
    manualWork:     ko ? '수동 작업'         : 'MANUAL WORK',
    zero:           ko ? '제로'              : 'Zero',
    zeroDesc:       ko ? '수동 보고서 작성 없이\n점검 완료 즉시 자동 생성' : 'No manual report writing\nAuto-generated on completion',
    zeroSub:        ko ? '데이터 누락 없는 완전 자동화' : 'Complete automation, zero data loss',
    feature:        ko ? '핵심 기능'         : 'FEATURE',
    core02:         ko ? '핵심 코어 01' : 'CORE 01',
    autoReport:     ko ? '자동 보고서 생성'  : 'Auto Report Generation',
    autoReportDesc: ko ? '점검 완료 즉시 LG 표준 양식 PDF 자동 생성. 통계·차트·증거 사진까지 자동 삽입.' : 'LG-standard PDF auto-generated on inspection completion. Stats, charts & evidence photos inserted automatically.',
    core03:         ko ? '핵심 코어 02' : 'CORE 02',
    autoDispatch:   ko ? '이벤트 기반 자동 발송' : 'Event-based Auto Dispatch',
    escalation:     ko ? '기한 초과 시 에스컬레이션 자동 리마인드' : 'Auto escalation reminder when deadline exceeded',
    mobilePrimary:  ko ? '모바일 우선'       : 'MOBILE FIRST',
    mobileTitle:    ko ? '앱 설치 없이 바로 사용' : 'No App Install Required',
    mobileDesc:     ko ? 'iOS·Android 모두 브라우저에서 즉시 실행. 오프라인 지원 및 반응형 UI.' : 'Instant launch on iOS & Android via browser. Offline support and responsive UI.',
    useCases:       ko ? '활용 사례'         : 'USE CASES',
    useCasesTitle:  ko ? '현장에서 증명된 가치' : 'Proven Value in the Field',
    keyFeatures:    ko ? '핵심 기능'         : 'KEY FEATURES',
    keyFeatTitle:   ko ? '완전 자동화 품질 관리' : 'Fully Automated Quality Management',
    whyWizFact:        ko ? '도입 강점'         : 'WHY WIZ-FACT',
    whyWizFactTitle:   ko ? 'WIZ-FACT를 선택하는 이유' : 'Reasons to Choose',
    techStack:      ko ? '기술 스택'         : 'TECH STACK',
    techTitle:      ko ? '검증된 기술 기반'  : 'Battle-tested Technology',
    projectInfo:    ko ? '프로젝트 정보'     : 'PROJECT INFO',
    client:         ko ? '고객사'            : 'Client',
    industry:       ko ? '산업군'            : 'Industry',
    category:       ko ? '카테고리'          : 'Category',
  };

  // ── 핵심 지표 3섹션 데이터 ────────────────────────────────────────────────
  const kpiSections = [
    {
      label:  ko ? '점검 프로세스' : 'Inspection Process',
      icon:   <ClipboardList className="size-4" />,
      items: [
        { name: ko ? '지적 건수'    : 'NG Count',          desc: ko ? '라인·Audit Type별 NG 발생 총 건수'     : 'Total NGs by line & audit type' },
        { name: ko ? '개선완료 건수' : 'Resolved Count',    desc: ko ? '조치 완료 처리된 지적 수'            : 'Number of NGs marked complete' },
        { name: ko ? '달성률 (%)'   : 'Achievement Rate (%)', desc: ko ? '개선완료 ÷ 지적건수 × 100'         : 'Resolved ÷ NG Count × 100' },
        { name: ko ? '재발 횟수'    : 'Recurrence Count',  desc: ko ? '동일 항목 반복 지적 발생 건수'        : 'Repeated NGs on the same item' },
      ],
    },
    {
      label:  ko ? '점검 판정' : 'Inspection Judgment',
      icon:   <CheckCircle2 className="size-4" />,
      items: [
        { name: ko ? '판정 (OK / NG)' : 'Verdict (OK / NG)', desc: ko ? 'LSL·USL 기준 측정값 자동 합불 판정' : 'Auto pass/fail by LSL·USL measurement' },
        { name: ko ? '샘플 개수'      : 'Sample Count',      desc: ko ? '항목별 점검 샘플 수량'              : 'Number of samples inspected per item' },
      ],
    },
    {
      label:  ko ? '분석 · 보고' : 'Analysis & Reporting',
      icon:   <BarChart2 className="size-4" />,
      items: [
        { name: ko ? 'Worst 10 순위'  : 'Worst 10 Ranking',       desc: ko ? '불량 빈도 상위 Level 4 항목 순위'          : 'Top Level 4 defect items by frequency' },
        { name: 'Data Trend',                                      desc: ko ? '월별·분기·연간 지적/달성률 추이'           : 'Monthly/quarterly/annual NG & achievement trends' },
        { name: ko ? '부서별 점검현황' : 'Dept. Inspection Status', desc: ko ? '귀책 부서 기준 지적 집계·비교'            : 'NG aggregation & comparison by responsible dept.' },
        { name: ko ? '자동 메일링'    : 'Auto Mailing',            desc: ko ? 'PPT·엑셀 보고서 자동 생성·발송'           : 'Auto-generate & send PPT/Excel reports' },
      ],
    },
  ];

  const mailingSteps = [
    { Icon: AlertTriangle, t: ko ? '지적 등록'     : 'NG Registered',      p: ko ? '현장에서 NG 발생'                 : 'Defect detected on-site' },
    { Icon: Mail,          t: ko ? '자동 알림 발송' : 'Auto Alert Sent',    p: ko ? '담당자·관리자 알림 + 이메일 즉시' : 'Instant alert + email to assignees' },
    { Icon: CheckCircle2,  t: ko ? '조치 완료'     : 'Action Complete',    p: ko ? '완료 결과 메일 자동 발송'          : 'Completion result auto-emailed' },
    { Icon: FileText,      t: ko ? '보고서 배포'   : 'Report Distributed', p: ko ? '보고서 첨부, 수신 그룹 자동 발송'  : 'Report attached, auto-sent to recipients' },
  ];

  const featureCards = [
    {
      Icon: ClipboardList,
      title: ko ? '스마트 체크리스트' : 'Smart Checklist',
      desc:  ko ? '라인·공정별 맞춤 항목, 기준값 자동 적용.' : 'Custom items per line, criteria auto-applied.',
      tags:  ko ? ['동적 양식', '기준값 설정', '이력 관리'] : ['Dynamic Form', 'Criteria Setting', 'History'],
    },
    {
      Icon: Camera,
      title: ko ? '현장 증거 수집' : 'Field Evidence',
      desc:  ko ? '모바일로 즉시 촬영, GPS·클라우드 자동 저장.' : 'Instant mobile capture, auto GPS & cloud save.',
      tags:  ko ? ['사진 첨부', 'GPS 기록', '클라우드'] : ['Photo Attach', 'GPS Log', 'Cloud'],
    },
    {
      Icon: Bell,
      title: ko ? '실시간 알림' : 'Real-time Alerts',
      desc:  ko ? 'NG시 즉시 알림·메일, 기한 초과 시 자동 에스컬레이션.' : 'Instant alert & email on NG, auto-escalation on overdue.',
      tags:  ko ? ['Push 알림', '이메일', '에스컬레이션'] : ['Push Alert', 'Email', 'Escalation'],
    },
  ];

  const reportItems = [
    { Icon: BarChart2,    t: ko ? '완전 자동 생성' : 'Fully Auto Generated', p: ko ? 'KPI·차트·사진 삽입 자동'  : 'KPI, charts & photos auto-inserted' },
    { Icon: FileText,     t: ko ? 'LG 표준 양식'   : 'LG Standard Format',   p: ko ? '사업부별 맞춤 양식'        : 'Custom format per business unit' },
    { Icon: ClipboardList,t: ko ? '이력 아카이브'   : 'History Archive',      p: ko ? '라인·담당자 필터 조회'     : 'Filter by line & assignee' },
    { Icon: Globe,        t: ko ? 'MES·ERP 연동'   : 'MES & ERP Integration', p: ko ? '이중 입력 제로'            : 'Zero double-entry' },
  ];

  const wizFactTaglineModalInner = useMemo(
    () =>
      ko ? (
        <>
          <span style={{ fontWeight: 800, color: 'var(--solution-modal-header-tagline-strong)' }}>글로벌 기준 </span>
          <span style={{ fontWeight: 400, color: 'var(--solution-modal-header-tagline-soft)' }}>에 맞춘 </span>
          <span
            style={{
              position: 'relative',
              display: 'inline-block',
              padding: '2px 6px',
              fontWeight: 800,
              color: 'var(--brand-red)',
              letterSpacing: '0.04em',
            }}
            className="align-middle sm:px-[7px] sm:py-[3px] sm:tracking-[0.06em]"
          >
            <span
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: 6,
                height: 6,
                borderTop: '1.5px solid var(--brand-red)',
                borderLeft: '1.5px solid var(--brand-red)',
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
                borderBottom: '1.5px solid var(--brand-red)',
                borderRight: '1.5px solid var(--brand-red)',
                opacity: 0.85,
              }}
              className="sm:h-[7px] sm:w-[7px]"
            />
            스마트 품질 점검
          </span>{' '}
          <span style={{ fontWeight: 400, color: 'var(--solution-modal-header-tagline-soft)' }}>시작하기</span>
        </>
      ) : (
        <>
          <span style={{ fontWeight: 800, color: 'var(--solution-modal-header-tagline-strong)' }}>Global standards</span>
          <span style={{ fontWeight: 400, color: 'var(--solution-modal-header-tagline-soft)' }}> — </span>
          <span
            style={{
              position: 'relative',
              display: 'inline-block',
              padding: '2px 6px',
              fontWeight: 800,
              color: 'var(--brand-red)',
              letterSpacing: '0.04em',
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
                borderTop: '1.5px solid var(--brand-red)',
                borderLeft: '1.5px solid var(--brand-red)',
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
                borderBottom: '1.5px solid var(--brand-red)',
                borderRight: '1.5px solid var(--brand-red)',
                opacity: 0.85,
              }}
              className="sm:h-[7px] sm:w-[7px]"
            />
            smart inspections
          </span>{' '}
          <span style={{ fontWeight: 800, color: 'var(--solution-modal-header-tagline-strong)' }}>start </span>
          <span style={{ fontWeight: 400, color: 'var(--solution-modal-header-tagline-soft)' }}>here</span>
        </>
      ),
    [ko],
  );

  const wizFactTaglinePageInner = useMemo(
    () =>
      ko ? (
        <>
          <span style={{ fontWeight: 800, color: '#1D1D1F' }}>글로벌 기준 </span>
          <span style={{ fontWeight: 400, color: '#86868B' }}>에 맞춘 </span>
          <span
            style={{
              position: 'relative',
              display: 'inline-block',
              padding: '2px 6px',
              fontWeight: 800,
              color: RED,
              letterSpacing: '0.04em',
            }}
            className="align-middle sm:px-[7px] sm:py-[3px] sm:tracking-[0.06em]"
          >
            <span
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: 6,
                height: 6,
                borderTop: `1.5px solid ${RED}`,
                borderLeft: `1.5px solid ${RED}`,
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
                borderBottom: `1.5px solid ${RED}`,
                borderRight: `1.5px solid ${RED}`,
                opacity: 0.85,
              }}
              className="sm:h-[7px] sm:w-[7px]"
            />
            스마트 품질 점검
          </span>{' '}
          <span style={{ fontWeight: 400, color: '#86868B' }}>시작하기</span>
        </>
      ) : (
        <>
          <span style={{ fontWeight: 800, color: '#1D1D1F' }}>Global standards</span>
          <span style={{ fontWeight: 400, color: '#86868B' }}> — </span>
          <span
            style={{
              position: 'relative',
              display: 'inline-block',
              padding: '2px 6px',
              fontWeight: 800,
              color: RED,
              letterSpacing: '0.04em',
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
                borderTop: `1.5px solid ${RED}`,
                borderLeft: `1.5px solid ${RED}`,
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
                borderBottom: `1.5px solid ${RED}`,
                borderRight: `1.5px solid ${RED}`,
                opacity: 0.85,
              }}
              className="sm:h-[7px] sm:w-[7px]"
            />
            smart inspections
          </span>{' '}
          <span style={{ fontWeight: 800, color: '#1D1D1F' }}>start </span>
          <span style={{ fontWeight: 400, color: '#86868B' }}>here</span>
        </>
      ),
    [ko],
  );

  return (
    <div style={{ background: PAGE_BG }} className="flex h-full min-h-0 flex-col">

      {/* ── 모달: 다크 제품 헤더 + 태그라인 / 상세 페이지: 서브 타이틀바만 ── */}
      {!pageTaglineBelowHeader && (
        <div
          className="relative z-10 flex min-h-[60px] flex-shrink-0 flex-col gap-2 px-4 py-2.5 pr-14 transition-colors duration-500 sm:h-[60px] sm:flex-row sm:items-center sm:gap-3 sm:px-6 sm:py-0 sm:pr-14"
          style={{
            backgroundColor: 'var(--solution-modal-header-bg-dark)',
            backdropFilter: 'var(--apple-globalnav-header-backdrop)',
            WebkitBackdropFilter: 'var(--apple-globalnav-header-backdrop)',
            borderBottom: 'var(--solution-modal-header-border-dark)',
          }}
        >
          <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
            <img src={wizSymbol} alt="WIZ-FACT" className="h-9 w-9 shrink-0 sm:h-10 sm:w-10" />
            <div className="min-w-0">
              <p className="text-[14px] font-black leading-none tracking-wide sm:text-[15px]" style={{ color: 'var(--solution-modal-header-title)' }}>
                WIZ-FACT
              </p>
              <p
                className="mt-0.5 line-clamp-2 text-[10px] font-normal leading-snug sm:mt-1 sm:line-clamp-none sm:text-[11px]"
                style={{ color: 'var(--solution-modal-header-subtitle)' }}
              >
                {t.subtitle}
              </p>
            </div>
            <div
              className="mx-1 hidden h-9 shrink-0 rounded-full sm:mx-2 sm:block sm:h-10"
              style={{ width: 3, background: 'var(--brand-red)' }}
              aria-hidden
            />
          </div>
          <p
            className="min-w-0 border-t border-white/10 pt-2 text-[11px] leading-snug tracking-tight sm:ml-0 sm:flex-1 sm:border-t-0 sm:pt-0 sm:text-[13px]"
            style={{ letterSpacing: '-0.01em', margin: 0 }}
          >
            {wizFactTaglineModalInner}
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
            {wizFactTaglinePageInner}
          </p>
        </div>
      )}

      {/* ── Bento grid: flex-1 + 자체 스크롤 ── */}
      <div ref={scrollRef} className="flex-1 min-h-0 overflow-y-auto scrollbar-hide">
      <div className="px-4 md:px-6 pb-5 pt-5">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4">

          {/* ① Hero */}
          <GCard delay={0} className="md:col-span-12 overflow-hidden" style={{ minHeight: 480 }}>

            {/* ── 배경: 4종 디바이스 목업 (WIZ-Flow와 동일 구조) ── */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0 z-0"
            >
              <WizFactMiniDashboard />
            </motion.div>

            {/* ── 텍스트 콘텐츠 (z-20 위) ── */}
            <div className="relative z-20 p-8 md:w-1/2 flex flex-col justify-between" style={{ minHeight: 480 }}>
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-6">
                  <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-[11px] font-bold"
                    style={{ background: RED_DIM, color: RED, border: `1px solid ${RED_BDR}` }}>
                    {getCategoryLabel(s.category, language)}
                  </span>
                  <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-[11px] font-bold"
                    style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.65)', border: '1px solid rgba(255,255,255,0.12)' }}>
                    {lgLabel}
                  </span>
                </div>
                <EL text={t.solution} />
                <h2 className="text-5xl md:text-6xl font-black tracking-tight text-white mb-3"
                  style={{ letterSpacing: '-0.03em' }}>WIZ-FACT</h2>
                <p className="text-base font-semibold mb-5" style={{ color: RED }}>{t.subtitle}</p>
                <p className="text-sm leading-relaxed max-w-[260px]" style={{ color: 'rgba(255,255,255,0.55)' }}>
                  {displayDesc}
                </p>
              </div>
              {s.demoUrl && (
                <div className="mt-8">
                  <a href={s.demoUrl} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm transition-all hover:scale-105 active:scale-95"
                    style={{ background: RED, color: '#fff', boxShadow: `0 4px 20px ${RED}44` }}>
                    {t.tryDemo}
                    <ExternalLink className="size-4" />
                  </a>
                </div>
              )}
            </div>
          </GCard>

          {/* ② KPI — 3섹션 풀 와이드 */}
          <GCard delay={0.06} className="md:col-span-12 p-7">
            <div className="flex items-center justify-between mb-6">
              <div>
                <EL text={t.keyMetrics} />
                <h3 className="text-2xl font-bold text-white">
                  {ko ? 'WIZ-FACT 측정 지표 체계' : 'WIZ-FACT Measurement Index'}
                </h3>
              </div>
              <span className="text-[11px] font-bold px-3 py-1.5 rounded-xl hidden md:inline-block"
                style={{ background: RED_DIM, color: RED, border: `1px solid ${RED_BDR}` }}>
                {ko ? '10가지 핵심 지표' : '10 Key Metrics'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {kpiSections.map((section, si) => (
                <motion.div
                  key={section.label}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 + si * 0.08, duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
                  className="rounded-2xl p-5 flex flex-col"
                  style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${RED_BDR}` }}
                >
                  {/* 섹션 헤더 */}
                  <div className="flex items-center gap-3 mb-4 pb-4 px-3"
                    style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                    <div className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0"
                      style={{ background: RED, color: '#fff' }}>
                      {section.icon}
                    </div>
                    <p className="text-sm font-bold text-white leading-none">{section.label}</p>
                  </div>

                  {/* 지표 아이템 리스트 */}
                  <div className="flex flex-col gap-3 flex-1">
                    {section.items.map((item, ii) => (
                      <motion.div
                        key={item.name}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.12 + si * 0.08 + ii * 0.05, duration: 0.35 }}
                        className="flex items-start gap-3 rounded-xl px-3 py-2.5"
                        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}
                      >
                        {/* 번호 뱃지 */}
                        <div className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5 text-[9px] font-black"
                          style={{ background: RED_DIM, color: RED, border: `1px solid ${RED_BDR}` }}>
                          {ii + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-white mb-0.5 leading-snug">{item.name}</p>
                          <p className="text-[10px] leading-snug" style={{ color: 'rgba(255,255,255,0.42)' }}>{item.desc}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </GCard>

          {/* ③ Workflow */}
          <GCard delay={0.10} className="md:col-span-12 p-7">
            {/* 헤더 */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <EL text={t.workflow} />
                <h3 className="text-2xl font-bold text-white">{t.workflowTitle}</h3>
              </div>
              <span className="text-[11px] font-bold px-3 py-1.5 rounded-xl hidden md:inline-block"
                style={{ background: RED_DIM, color: RED, border: `1px solid ${RED_BDR}` }}>
                {t.coreProcess}
              </span>
            </div>

            {/* Flow steps */}
            <div className="flex flex-col md:flex-row md:items-stretch gap-0">
              {(s.modules ?? []).slice(0, 4).map((mod, i) => (
                <React.Fragment key={mod.name}>
                  {/* ── 스텝 카드 ── */}
                  <motion.div
                    key={mod.name}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.14 + i * 0.09, duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
                    className="flex-1 flex flex-col rounded-2xl p-5"
                    style={{
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      minHeight: 220,
                    }}
                  >
                    {/* 상단: STEP 레이블(좌) + 아이콘(우) */}
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[11px] font-bold tracking-widest"
                        style={{ color: RED }}>
                        STEP {String(i + 1).padStart(2, '0')}
                      </span>
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.55)' }}>
                        {STEP_ICONS[i]}
                      </div>
                    </div>

                    {/* 큰 타이틀 */}
                    <p className="text-2xl font-black text-white mb-3 leading-tight">
                      {mod.name}
                    </p>

                    {/* 설명 */}
                    <p className="text-xs leading-relaxed flex-1 whitespace-pre-line" style={{ color: 'rgba(255,255,255,0.48)' }}>
                      {ko ? mod.desc : mod.descEn}
                    </p>

                    {/* 하단 도트 인디케이터 */}
                    <div className="flex items-center gap-1.5 mt-5 pt-4"
                      style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                      {[0, 1, 2, 3].map((dot) => (
                        <div key={dot} className="h-1.5 rounded-full"
                          style={{
                            width: dot === i ? 18 : 6,
                            background: dot === i ? RED : 'rgba(255,255,255,0.18)',
                          }} />
                      ))}
                    </div>
                  </motion.div>

                  {/* ── 화살표 커넥터 (마지막 제외) ── */}
                  {i < 3 && (
                    <motion.div
                      key={`arrow-${i}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.24 + i * 0.09, duration: 0.3 }}
                      className="hidden md:flex flex-shrink-0 items-center justify-center self-center"
                      style={{ width: 32 }}
                    >
                      <span className="text-lg font-light"
                        style={{ color: 'rgba(255,255,255,0.22)' }}>→</span>
                    </motion.div>
                  )}

                  {/* 모바일용 수직 화살표 */}
                  {i < 3 && (
                    <div key={`arrow-m-${i}`} className="flex md:hidden justify-center py-1">
                      <span className="text-lg font-light"
                        style={{ color: 'rgba(255,255,255,0.22)' }}>↓</span>
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </GCard>

          {/* ④ Live Audit */}
          <GCard delay={0.16} className="md:col-span-6 p-6 flex flex-col">
            <div className="flex-shrink-0">
              <EL text={t.todayAudit} />
              <h3 className="text-lg font-bold text-white">{t.liveStatus}</h3>
              <p className="text-[10px] mt-0.5" style={{ color: 'rgba(255,255,255,0.38)' }}>
                {ko ? '라인별 자동화 점검 현황 실시간 확인' : 'Automated line inspection tracked in real-time'}
              </p>
            </div>
            <LiveAudit ko={ko} />
          </GCard>

          {/* ⑤ Multi-lang Dashboard */}
          <GCard delay={0.19} className="md:col-span-6 p-6 flex flex-col">
            <div className="flex-shrink-0">
              <EL text={t.global} />
              <h3 className="text-lg font-bold text-white leading-tight">{t.multiLang}</h3>
              <p className="text-[10px] mt-0.5" style={{ color: 'rgba(255,255,255,0.38)' }}>
                {t.langSwitch}
              </p>
            </div>
            <LiveLangSwitch ko={ko} />
          </GCard>

          {/* ⑥ Zero — 플랜카드 레이아웃 */}
          <GCard delay={0.22} red className="md:col-span-12 p-7">
            {/* 상단: 레이블 + 헤드라인 + 설명 */}
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-6">
              <div>
                <EL text={t.manualWork} light />
                <div className="flex items-baseline gap-4 mt-1">
                  <span className="text-7xl font-black text-white leading-none">{t.zero}</span>
                  <p className="text-sm leading-relaxed max-w-xs hidden md:block" style={{ color: 'rgba(255,255,255,0.65)' }}>
                    {t.zeroDesc}
                  </p>
                </div>
                <p className="text-sm leading-relaxed mt-2 md:hidden" style={{ color: 'rgba(255,255,255,0.65)' }}>
                  {t.zeroDesc}
                </p>
              </div>
              {/* 우측 뱃지 */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <motion.div
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ background: 'rgba(255,255,255,0.85)' }}
                />
                <span className="text-xs font-bold" style={{ color: 'rgba(255,255,255,0.7)' }}>
                  {ko ? '완전 자동화 운영 중' : 'Full Automation Active'}
                </span>
              </div>
            </div>

            {/* 하단: 3개 핵심 수치 카드 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                {
                  Icon: FileText,
                  num: ko ? '0분' : '0 min',
                  title: ko ? '보고서 수동 작성' : 'Manual Report Writing',
                  desc: ko ? '점검 완료 즉시 표준 보고서 양식 자동 생성. 별도 작업 없음.' : 'Standard report auto-generated on inspection completion. No extra steps.',
                  tag: ko ? '자동 생성' : 'Auto-Generated',
                },
                {
                  Icon: Zap,
                  num: ko ? '즉시' : 'Instant',
                  title: ko ? 'PDF 자동 생성 속도' : 'PDF Generation Speed',
                  desc: ko ? '통계·차트·증거 사진까지 자동 삽입. 검토 즉시 공유 가능.' : 'Stats, charts & evidence photos auto-inserted. Share-ready immediately.',
                  tag: ko ? '실시간' : 'Real-time',
                },
                {
                  Icon: Globe,
                  num: '100%',
                  title: ko ? '이중 입력 제거율' : 'Duplicate Entry Eliminated',
                  desc: ko ? 'MES·ERP 자동 연동으로 이중 입력 완전 제거. 데이터 정합성 보장.' : 'Auto-sync with MES & ERP. Zero duplicate entry, full data integrity.',
                  tag: ko ? 'MES·ERP 연동' : 'MES·ERP Sync',
                },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 + i * 0.08, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  className="rounded-2xl p-4 flex flex-col gap-3"
                  style={{ background: 'rgba(0,0,0,0.22)', border: '1px solid rgba(255,255,255,0.13)' }}
                >
                  {/* 아이콘 + 수치 */}
                  <div className="flex items-center justify-between">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)' }}>
                      <item.Icon className="size-4" style={{ color: 'rgba(255,255,255,0.8)' }} />
                    </div>
                    <span className="text-2xl font-black text-white leading-none">{item.num}</span>
                  </div>
                  {/* 제목 */}
                  <div>
                    <p className="text-xs font-bold text-white mb-1">{item.title}</p>
                    <p className="text-[10px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>{item.desc}</p>
                  </div>
                  {/* 태그 */}
                  <div className="mt-auto pt-1">
                    <span className="text-[9px] font-bold px-2.5 py-1 rounded-lg"
                      style={{ background: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.75)', border: '1px solid rgba(255,255,255,0.18)' }}>
                      {item.tag}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </GCard>

          {/* ⑦ Feature cards */}
          {featureCards.map((feat, i) => (
            <GCard key={i} delay={0.26 + i * 0.05} className="md:col-span-4 p-6 flex flex-col">
              <IBox><feat.Icon className="size-5" style={{ color: RED }} /></IBox>
              <div className="mt-4">
                <EL text={t.feature} />
                <p className="text-base font-bold text-white mb-2">{feat.title}</p>
                <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>{feat.desc}</p>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-4">
                {feat.tags.map((tag) => (
                  <span key={tag} className="text-[9px] font-semibold px-2.5 py-1 rounded-lg"
                    style={{ background: RED_DIM, color: RED, border: `1px solid ${RED_BDR}` }}>
                    {tag}
                  </span>
                ))}
              </div>
            </GCard>
          ))}

          {/* ⑧ Auto Report — Dashboard Diagram */}
          <GCard delay={0.38} className="md:col-span-7 p-7">
            {/* 헤더 */}
            <div className="flex items-center gap-3 mb-5">
              <IBox><FileText className="size-5" style={{ color: RED }} /></IBox>
              <div>
                <EL text={t.core02} />
                <h3 className="text-xl font-bold text-white">{t.autoReport}</h3>
              </div>
            </div>

            {/* ── 대시보드 다이어그램 ── */}
            <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.10)', background: 'rgba(255,255,255,0.03)' }}>

              {/* 대시보드 탑바 */}
              <div className="flex items-center justify-between px-4 py-2.5"
                style={{ background: 'rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full" style={{ background: RED }} />
                  <span className="text-[10px] font-bold text-white">
                    {ko ? '점검 보고서 — 자동 생성됨' : 'Inspection Report — Auto Generated'}
                  </span>
                </div>
                <motion.span
                  animate={{ opacity: [1, 0.4, 1] }}
                  transition={{ repeat: Infinity, duration: 1.8 }}
                  className="text-[9px] font-bold px-2 py-0.5 rounded-md"
                  style={{ background: `${OK}22`, color: OK, border: `1px solid ${OK}40` }}>
                  {ko ? '자동 생성 완료' : 'Auto-Generated'}
                </motion.span>
              </div>

              <div className="p-4 flex flex-col gap-3">
                {/* KPI 4칸 */}
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { v: '142', l: ko ? '점검 항목' : 'Items', c: 'rgba(255,255,255,0.85)' },
                    { v: '7', l: ko ? 'NG 건수' : 'NGs', c: NG },
                    { v: '95%', l: ko ? '달성률' : 'Rate', c: OK },
                    { v: '100%', l: ko ? '자동화율' : 'Automation', c: RED },
                  ].map((k) => (
                    <div key={k.l} className="rounded-xl p-2.5 text-center flex flex-col items-center gap-0.5"
                      style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.07)' }}>
                      <span className="text-sm font-black leading-none" style={{ color: k.c }}>{k.v}</span>
                      <span className="text-[8px]" style={{ color: 'rgba(255,255,255,0.35)' }}>{k.l}</span>
                    </div>
                  ))}
                </div>

                {/* 중단: 막대 차트 + 우측 자동 삽입 요소 */}
                <div className="flex gap-3">
                  {/* 막대 차트 */}
                  <div className="flex-1 rounded-xl p-3"
                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[9px] font-semibold" style={{ color: 'rgba(255,255,255,0.4)' }}>
                        {ko ? '월별 NG 추이' : 'Monthly NG Trend'}
                      </span>
                      <span className="text-[8px] font-bold" style={{ color: OK }}>▼ {ko ? '개선중' : 'Improving'}</span>
                    </div>
                    {/* 그리드 라인 */}
                    <div className="relative" style={{ height: 76 }}>
                      {/* 수평 기준선 */}
                      {[0, 1, 2].map((g) => (
                        <div key={g} className="absolute w-full pointer-events-none"
                          style={{ bottom: `${16 + g * 28}%`, borderTop: '1px dashed rgba(255,255,255,0.07)' }} />
                      ))}
                      {/* 막대 + 레이블 */}
                      <div className="absolute inset-0 flex items-end gap-1">
                        {[
                          { h: 72, v: 72, m: ko ? '1월' : 'Jan' },
                          { h: 58, v: 58, m: ko ? '2월' : 'Feb' },
                          { h: 85, v: 85, m: ko ? '3월' : 'Mar' },
                          { h: 43, v: 43, m: ko ? '4월' : 'Apr' },
                          { h: 67, v: 67, m: ko ? '5월' : 'May' },
                          { h: 32, v: 32, m: ko ? '6월' : 'Jun' },
                          { h: 22, v: 22, m: ko ? '7월' : 'Jul' },
                        ].map((bar, i) => {
                          const isLast = i === 6;
                          return (
                            <div key={i} className="flex-1 flex flex-col items-center justify-end gap-0.5" style={{ height: '100%' }}>
                              <motion.span
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                transition={{ delay: 0.52 + i * 0.06, duration: 0.28 }}
                                className="text-[7px] font-bold leading-none"
                                style={{ color: isLast ? OK : 'rgba(255,255,255,0.3)' }}>
                                {bar.v}
                              </motion.span>
                              <motion.div
                                className="w-full rounded-t-sm"
                                initial={{ scaleY: 0 }}
                                animate={{ scaleY: 1 }}
                                transition={{ delay: 0.38 + i * 0.06, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                                style={{
                                  height: `${bar.h * 0.42}px`,
                                  background: isLast
                                    ? `linear-gradient(to top, ${OK}bb, ${OK})`
                                    : `linear-gradient(to top, ${RED}88, ${RED}cc)`,
                                  transformOrigin: 'bottom',
                                  boxShadow: isLast ? `0 0 8px ${OK}55` : 'none',
                                  minHeight: 2,
                                }} />
                              <span className="text-[7px]" style={{ color: 'rgba(255,255,255,0.28)' }}>{bar.m}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* 우측: 자동 삽입 요소 */}
                  <div className="flex flex-col gap-1.5" style={{ width: 120 }}>
                    {[
                      { Icon: BarChart2,     l: ko ? 'KPI 차트' : 'KPI Charts',       c: RED },
                      { Icon: Camera,        l: ko ? '증거 사진' : 'Evidence Photos',  c: WARN },
                      { Icon: ClipboardList, l: ko ? '점검 이력' : 'Audit History',    c: OK },
                      { Icon: Globe,         l: ko ? 'MES 연동' : 'MES Sync',          c: 'rgba(255,255,255,0.55)' },
                    ].map((item, i) => (
                      <motion.div key={i}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.45 + i * 0.07, duration: 0.35 }}
                        className="flex items-center gap-2 rounded-lg px-2.5 py-1.5"
                        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                        <item.Icon className="size-3 flex-shrink-0" style={{ color: item.c }} />
                        <span className="text-[9px] font-medium" style={{ color: 'rgba(255,255,255,0.6)' }}>{item.l}</span>
                        <Check className="size-3 ml-auto flex-shrink-0" style={{ color: OK }} />
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* 하단: 생성 진행 바 */}
                <div className="rounded-xl px-3 py-2.5"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[9px] font-semibold" style={{ color: 'rgba(255,255,255,0.45)' }}>
                      {ko ? '보고서 자동 생성 완료' : 'Report Auto-Generated'}
                    </span>
                    <span className="text-[9px] font-black" style={{ color: OK }}>100%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                    <motion.div className="h-full rounded-full"
                      style={{ background: `linear-gradient(90deg, ${RED}, ${OK})` }}
                      initial={{ width: 0 }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1], delay: 0.5 }} />
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-[8px]" style={{ color: 'rgba(255,255,255,0.25)' }}>
                      {ko ? '점검 완료 즉시' : 'On inspection complete'}
                    </span>
                    <span className="text-[8px] font-bold" style={{ color: OK }}>
                      {ko ? '보고서 생성 및 자동 메일링' : 'Report Generated & Auto-Mailed'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </GCard>

          {/* ⑨ Auto Mailing — 단계별 다이어그램 */}
          <GCard delay={0.42} className="md:col-span-5 p-7 flex flex-col">
            {/* 헤더 */}
            <div className="flex items-center gap-3 mb-5">
              <IBox><Mail className="size-5" style={{ color: RED }} /></IBox>
              <div>
                <EL text={t.core03} />
                <h3 className="text-xl font-bold text-white">{t.autoDispatch}</h3>
              </div>
            </div>

            {/* ── 단계별 파이프라인 다이어그램 ── */}
            {/* gap-2 = 8px 고정 → 연결선 height: calc(100% + 8px) 로 정확히 이어짐 */}
            <div className="flex-1 flex flex-col gap-2">
              {mailingSteps.map((step, i) => {
                const isLast     = i === mailingSteps.length - 1;
                const isActive   = !allComplete && i === activeStep;
                const isPast     = allComplete || i < activeStep;
                const isLineFill = !allComplete && i === activeStep && !isLast;
                const isPastLine = allComplete || i < activeStep;
                return (
                  <div key={i} className="relative flex items-center gap-3">

                    {/*
                      연결선 — 항상 DOM에 존재 (구조 일관성 유지 → React static-flag 경고 방지).
                      isLast 일 때 opacity:0 으로 숨김.
                      left:15 = 아이콘(32px) 수평 중심,  top:'50%' = 이 행 수직 중심(= 아이콘 중심)
                      height: calc(100%+8px) → gap-2(8px)까지 포함해 다음 아이콘 중심에 정확히 닿음
                    */}
                    <div
                      className="absolute overflow-hidden"
                      style={{
                        left: 15, top: '50%', width: 2,
                        height: 'calc(100% + 8px)',
                        background: isPastLine ? `${OK}88` : 'rgba(255,255,255,0.08)',
                        borderRadius: 1,
                        opacity: isLast ? 0 : 1,
                        pointerEvents: 'none',
                      }}
                    >
                      {/* 진행 중 라인: animate 로 높이 채움 — key 변경 없이 안정적으로 렌더 */}
                      <motion.div
                        className="absolute top-0 left-0 w-full"
                        animate={{ height: isLineFill ? `${stepProgress * 100}%` : '0%' }}
                        transition={{ duration: 0.05, ease: 'linear' }}
                        style={{ background: RED }}
                      />
                    </div>

                    {/*
                      아이콘 원 — 불투명 솔리드 컬러 사용.
                      반투명(rgba)이면 뒤에 깔린 연결선이 비쳐 겹쳐 보이므로
                      비활성은 CARD_BG, 완료는 짙은 초록 솔리드로 처리.
                    */}
                    <motion.div
                      animate={{
                        background: isActive ? RED : isPast ? '#0d1f10' : CARD_BG,
                        borderColor: isActive ? RED : isPast ? 'rgba(22,163,74,0.5)' : 'rgba(255,255,255,0.15)',
                        boxShadow: isActive ? `0 0 18px ${RED}66` : 'none',
                        scale: isActive ? 1.08 : 1,
                      }}
                      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                      className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 relative z-10"
                      style={{ border: '1.5px solid' }}>
                      <motion.div
                        animate={{ color: isActive ? '#fff' : isPast ? OK : 'rgba(255,255,255,0.4)' }}
                        transition={{ duration: 0.3 }}>
                        {isPast && !isActive
                          ? <Check className="size-3.5" style={{ color: OK }} />
                          : <step.Icon className="size-3.5" />}
                      </motion.div>
                    </motion.div>

                    {/* 카드 */}
                    <motion.div
                      animate={{
                        background: isActive ? `${RED}1A` : isPast ? 'rgba(22,163,74,0.06)' : 'rgba(255,255,255,0.025)',
                        borderColor: isActive ? `${RED}55` : isPast ? 'rgba(22,163,74,0.25)' : 'rgba(255,255,255,0.07)',
                      }}
                      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                      className="flex-1 rounded-xl px-4"
                      style={{ border: '1px solid', paddingTop: 10, paddingBottom: 10 }}>
                      <div className="flex items-center justify-between mb-0.5">
                        <motion.p
                          animate={{ color: isActive ? 'rgba(255,255,255,0.96)' : isPast ? 'rgba(255,255,255,0.55)' : 'rgba(255,255,255,0.65)' }}
                          transition={{ duration: 0.35 }}
                          className="text-xs font-bold">
                          {step.t}
                        </motion.p>
                        <motion.span
                          animate={{
                            background: isActive ? `${RED}30` : isPast ? 'rgba(22,163,74,0.15)' : 'rgba(255,255,255,0.06)',
                            color: isActive ? RED : isPast ? OK : 'rgba(255,255,255,0.28)',
                            borderColor: isActive ? `${RED}50` : isPast ? 'rgba(22,163,74,0.35)' : 'rgba(255,255,255,0.08)',
                          }}
                          transition={{ duration: 0.35 }}
                          className="text-[8px] font-bold px-1.5 py-0.5 rounded"
                          style={{ border: '1px solid' }}>
                          {`0${i + 1}`}
                        </motion.span>
                      </div>
                      <motion.p
                        animate={{ color: isActive ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.28)' }}
                        transition={{ duration: 0.35 }}
                        className="text-[10px]">
                        {step.p}
                      </motion.p>
                    </motion.div>
                  </div>
                );
              })}
            </div>

            {/* 에스컬레이션 */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.38 }}
              className="flex items-center gap-2.5 rounded-xl px-4 py-3 mt-3"
              style={{ background: 'rgba(245,158,11,0.10)', border: '1px solid rgba(245,158,11,0.25)' }}>
              <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(245,158,11,0.18)' }}>
                <Clock className="size-3.5" style={{ color: WARN }} />
              </div>
              <span className="text-[10px] font-semibold" style={{ color: WARN }}>{t.escalation}</span>
            </motion.div>
          </GCard>

          {/* ⑩ Mobile first */}
          <GCard delay={0.46} className="md:col-span-5 p-7 flex flex-col">
            {/* 헤더 */}
            <div className="flex items-center gap-3 mb-5">
              <IBox><Smartphone className="size-5" style={{ color: RED }} /></IBox>
              <div>
                <EL text={t.mobilePrimary} />
                <h3 className="text-xl font-bold text-white leading-tight">{t.mobileTitle}</h3>
              </div>
            </div>

            {/* ── 브라우저 URL 바 목업 + OS 뱃지 ── */}
            <div className="rounded-xl px-3 py-2.5 mb-4 flex items-center gap-2.5"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)' }}>
              {/* 신호등 닷 */}
              <div className="flex gap-1 flex-shrink-0">
                {['rgba(255,95,87,0.7)','rgba(255,189,46,0.7)','rgba(39,201,63,0.7)'].map((c,i) => (
                  <div key={i} className="w-2 h-2 rounded-full" style={{ background: c }} />
                ))}
              </div>
              {/* URL 바 */}
              <div className="flex-1 flex items-center gap-1.5 rounded-md px-2.5 py-1"
                style={{ background: 'rgba(255,255,255,0.06)' }}>
                {/* lock */}
                <svg width="8" height="10" viewBox="0 0 8 10" fill="none">
                  <rect x="1" y="4" width="6" height="6" rx="1.2" stroke="rgba(255,255,255,0.35)" strokeWidth="1"/>
                  <path d="M2.5 4V2.8C2.5 1.8 5.5 1.8 5.5 2.8V4" stroke="rgba(255,255,255,0.35)" strokeWidth="1" strokeLinecap="round"/>
                </svg>
                <span className="text-[9px] font-mono" style={{ color: 'rgba(255,255,255,0.45)' }}>
                  wiz-fact.wizfactory.kr
                </span>
              </div>
              {/* OS 뱃지 */}
              <div className="flex gap-1.5 flex-shrink-0">
                {/* iOS 뱃지 */}
                <div className="flex items-center gap-1 px-2 py-0.5 rounded-md"
                  style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}>
                  {/* Apple logo SVG */}
                  <svg width="8" height="9" viewBox="0 0 14 17" fill="rgba(255,255,255,0.7)">
                    <path d="M13.3 13.1c-.3.7-.6 1.3-1.1 1.9-.5.7-1 1.1-1.5 1.1-.4 0-.9-.1-1.5-.4-.6-.3-1.1-.4-1.6-.4-.5 0-1.1.1-1.6.4-.6.3-1 .4-1.4.4-.6 0-1.1-.4-1.6-1.1-.5-.7-.9-1.4-1.2-2.1-.4-.8-.6-1.7-.6-2.5 0-.9.2-1.8.6-2.5.3-.6.8-1.1 1.3-1.4.5-.3 1.1-.5 1.7-.5.5 0 1.1.2 1.7.5.6.3 1 .4 1.2.4.2 0 .6-.2 1.3-.5.7-.3 1.2-.4 1.7-.4 1.4.1 2.5.8 3.1 2-.6.4-1 1.1-1 1.9 0 .9.4 1.6 1.1 2.1-.2.5-.4.9-.6 1.1zm-3.7-13c0 .7-.2 1.4-.7 2-.6.7-1.2 1.1-1.9 1-.1-.6.1-1.3.6-2 .2-.3.6-.6 1-.8.4-.2.8-.3 1-.2z"/>
                  </svg>
                  <span className="text-[8px] font-bold" style={{ color: 'rgba(255,255,255,0.7)' }}>iOS</span>
                </div>
                {/* Android 뱃지 */}
                <div className="flex items-center gap-1 px-2 py-0.5 rounded-md"
                  style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}>
                  {/* Android robot SVG */}
                  <svg width="8" height="9" viewBox="0 0 16 16" fill="rgba(61,220,132,0.85)">
                    <path d="M3 10.5A4.5 4.5 0 0 1 7.5 6h1A4.5 4.5 0 0 1 13 10.5V13H3v-2.5z"/>
                    <circle cx="5.5" cy="8.5" r=".75"/>
                    <circle cx="10.5" cy="8.5" r=".75"/>
                    <path d="M5.5 5.5L4 3.5M10.5 5.5L12 3.5" stroke="rgba(61,220,132,0.85)" strokeWidth="1.2" strokeLinecap="round"/>
                  </svg>
                  <span className="text-[8px] font-bold" style={{ color: 'rgba(61,220,132,0.85)' }}>Android</span>
                </div>
              </div>
            </div>

            {/* ── 2×2 기능 타일 그리드 ── */}
            <div className="grid grid-cols-2 gap-2.5 flex-1">
              {[
                {
                  Icon: Ban,
                  Sub: Download,
                  label: ko ? '앱 불필요' : 'No App Install',
                  hint:  ko ? '스토어 다운로드 없이 즉시 실행' : 'Launch instantly without store',
                  accent: 'rgba(239,68,68,0.9)',
                  bg:    'rgba(239,68,68,0.07)',
                  bd:    'rgba(239,68,68,0.18)',
                },
                {
                  Icon: Camera,
                  Sub: null,
                  label: ko ? '카메라 연동' : 'Camera Access',
                  hint:  ko ? '현장 사진 즉시 업로드' : 'On-site photo upload',
                  accent: 'rgba(99,179,237,0.9)',
                  bg:    'rgba(99,179,237,0.07)',
                  bd:    'rgba(99,179,237,0.18)',
                },
                {
                  Icon: WifiOff,
                  Sub: null,
                  label: ko ? '오프라인 지원' : 'Offline Support',
                  hint:  ko ? '네트워크 없이도 점검 가능' : 'Works without network',
                  accent: 'rgba(245,158,11,0.9)',
                  bg:    'rgba(245,158,11,0.07)',
                  bd:    'rgba(245,158,11,0.18)',
                },
                {
                  Icon: Monitor,
                  Sub: Smartphone,
                  label: ko ? '반응형 UI' : 'Responsive UI',
                  hint:  ko ? '모든 화면 크기 최적화' : 'Optimized for any screen',
                  accent: 'rgba(167,139,250,0.9)',
                  bg:    'rgba(167,139,250,0.07)',
                  bd:    'rgba(167,139,250,0.18)',
                },
              ].map(({ Icon, Sub, label, hint, accent, bg, bd }) => (
                <motion.div
                  key={label}
                  whileHover={{ scale: 1.03, transition: { duration: 0.18 } }}
                  className="rounded-2xl p-4 flex flex-col items-center justify-center gap-2.5 text-center"
                  style={{ background: bg, border: `1px solid ${bd}` }}>
                  {/* 아이콘 스택 */}
                  <div className="relative flex items-center justify-center">
                    {/* 글로우 */}
                    <div className="absolute rounded-full blur-md"
                      style={{ width: 48, height: 48, background: accent, opacity: 0.22 }} />
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center relative"
                      style={{ background: `${accent}18`, border: `1px solid ${accent}35` }}>
                      <Icon style={{ color: accent, width: 22, height: 22 }} />
                      {/* 서브 아이콘 (반응형·앱불필요 등 2중 표현) */}
                      {Sub && (
                        <div className="absolute -bottom-1.5 -right-1.5 w-5 h-5 rounded-lg flex items-center justify-center"
                          style={{ background: 'rgba(20,20,25,1)', border: `1px solid ${accent}50` }}>
                          <Sub style={{ color: accent, width: 10, height: 10 }} />
                        </div>
                      )}
                    </div>
                  </div>
                  {/* 라벨 */}
                  <div>
                    <p className="text-[11px] font-bold mb-0.5" style={{ color: accent }}>{label}</p>
                    <p className="text-[9px] leading-snug" style={{ color: 'rgba(255,255,255,0.35)' }}>{hint}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </GCard>

          {/* ⑪ Use cases — 2×2 icon tile grid */}
          <GCard delay={0.50} className="md:col-span-7 p-7 flex flex-col">
            <EL text={t.useCases} />
            <h3 className="text-xl font-bold text-white mb-5">{t.useCasesTitle}</h3>

            <div className="grid grid-cols-2 gap-3 flex-1">
              {([
                {
                  icon: (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="9" y="3" width="6" height="4" rx="1"/>
                      <path d="M9 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2h-3"/>
                      <path d="M9 12h.01M9 16h.01"/><path d="M13 12h2M13 16h2"/>
                    </svg>
                  ),
                  label: ko ? '일일 라인 점검' : 'Daily Line Check',
                  hint:  ko ? '기준값·허용범위 사전 정의\n일관된 체크리스트 점검' : 'Pre-defined thresholds\nConsistent checklist audit',
                  accent: 'rgba(251,113,133,0.95)',
                  bg:    'rgba(251,113,133,0.07)',
                  bd:    'rgba(251,113,133,0.2)',
                  badge: ko ? '매일' : 'Daily',
                },
                {
                  icon: (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                      <circle cx="12" cy="13" r="4"/>
                      <path d="m9 10 6 6M15 10l-6 6" strokeWidth="1.4"/>
                    </svg>
                  ),
                  label: ko ? 'NG End-to-End 추적' : 'NG End-to-End Track',
                  hint:  ko ? '증거 사진 즉시 첨부\n담당자 자동 배정·완료 추적' : 'Instant photo evidence\nAuto-assign & track to close',
                  accent: 'rgba(239,68,68,0.95)',
                  bg:    'rgba(239,68,68,0.07)',
                  bd:    'rgba(239,68,68,0.2)',
                  badge: ko ? '즉시' : 'Instant',
                },
                {
                  icon: (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                      <polyline points="14 2 14 8 20 8"/>
                      <path d="m8 13 2 2 4-4"/>
                      <path d="M16 20h2a2 2 0 0 0 2-2v-1" strokeDasharray="2 2"/>
                    </svg>
                  ),
                  label: ko ? '보고서 자동 발송' : 'Auto Report Dispatch',
                  hint:  ko ? '점검 완료 즉시 보고서 생성\n수신 그룹 자동 메일 발송' : 'Report on audit complete\nAuto-emailed to groups',
                  accent: 'rgba(99,179,237,0.95)',
                  bg:    'rgba(99,179,237,0.07)',
                  bd:    'rgba(99,179,237,0.2)',
                  badge: ko ? '자동' : 'Auto',
                },
                {
                  icon: (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"/>
                      <line x1="2" y1="12" x2="22" y2="12"/>
                      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                    </svg>
                  ),
                  label: ko ? '글로벌 4개 언어' : '4 Languages',
                  hint:  ko ? '한·중·영·태국 등\n글로벌 품질 기준 통일' : 'KO·CN·EN·TH & more\nUnified global QC standard',
                  accent: 'rgba(52,211,153,0.95)',
                  bg:    'rgba(52,211,153,0.07)',
                  bd:    'rgba(52,211,153,0.2)',
                  badge: ko ? '4개국' : '4 langs',
                },
              ] as { icon: React.ReactNode; label: string; hint: string; accent: string; bg: string; bd: string; badge: string }[]).map(({ icon, label, hint, accent, bg, bd, badge }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.52 + i * 0.07, duration: 0.38 }}
                  whileHover={{ scale: 1.03, transition: { duration: 0.16 } }}
                  className="rounded-2xl p-4 flex flex-col gap-3 relative overflow-hidden"
                  style={{ background: bg, border: `1px solid ${bd}` }}>

                  {/* 배지 */}
                  <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-[8px] font-black"
                    style={{ background: `${accent}22`, color: accent, border: `1px solid ${accent}44` }}>
                    {badge}
                  </div>

                  {/* 아이콘 */}
                  <div className="relative w-11 h-11 flex items-center justify-center rounded-xl flex-shrink-0"
                    style={{ background: `${accent}14`, border: `1px solid ${accent}30` }}>
                    <div className="absolute inset-0 rounded-xl blur-md"
                      style={{ background: accent, opacity: 0.18 }} />
                    <div style={{ position: 'relative', color: accent }}>{icon}</div>
                  </div>

                  {/* 텍스트 */}
                  <div>
                    <p className="text-xs font-bold mb-1" style={{ color: accent }}>{label}</p>
                    <p className="text-[10px] leading-[1.5]" style={{ color: 'rgba(255,255,255,0.38)', whiteSpace: 'pre-line' }}>{hint}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </GCard>

          {/* ⑬ Why WIZ-FACT — 6가지 이유 */}
          {(() => {
            const KEYWORDS = ko
              ? ['디지털 전환 (DX)', '스마트 공장', '데이터 드리븐 경영', '모바일 퍼스트', '글로벌 제조 거점', '업무 자동화 (RPA)', '실시간 데이터 분석']
              : ['Digital Transformation', 'Smart Factory', 'Data-Driven Mgmt', 'Mobile First', 'Global Manufacturing', 'Work Automation (RPA)', 'Real-time Analytics'];

            const PAIN_POINTS = ko ? [
              '종이 기반 감사 → 디지털 전환 필수',
              '글로벌 생산 거점 확대, 언어 장벽',
              '실시간 품질 이슈 대응 지연',
              '데이터 없는 품질 의사결정 한계',
              '현장 작업자 모바일 환경 보편화',
            ] : [
              'Paper-based audits → Digital transformation required',
              'Expanding global sites, language barriers',
              'Delayed real-time quality issue response',
              'Quality decisions made without data',
              'Mobile devices now universal among field workers',
            ];

            // ── 트렌드 심볼 아이콘 (언어 공통) ──
            const TREND_ICON_NODES: React.ReactNode[] = [
              <Cpu size={16} />,
              <TrendingUp size={16} />,
              <Smartphone size={16} />,
              <Bot size={16} />,
              <Globe size={16} />,
              <Network size={16} />,
            ];

            const TRENDS = ko ? [
              { icon: TREND_ICON_NODES[0], title: '스마트공장 전환',       desc: 'IoT 기반 현장 품질 점검 디지털화',        badge: '4단계 감사 워크플로우', accent: '#22d3ee' },
              { icon: TREND_ICON_NODES[1], title: '데이터 드리븐 경영',    desc: '수치 기반 의사결정, 감(感) 의존 탈피',     badge: 'Data Trend · Worst 10', accent: '#60a5fa' },
              { icon: TREND_ICON_NODES[2], title: '모바일 퍼스트',         desc: '앱 설치 없이 스마트폰으로 즉시 사용',      badge: 'PWA 모바일 웹',        accent: '#c8c8ff' },
              { icon: TREND_ICON_NODES[3], title: '업무 자동화 (RPA)',     desc: '보고서·메일 자동화로 수작업 제로',         badge: '자동 보고서·메일링',   accent: '#fb923c' },
              { icon: TREND_ICON_NODES[4], title: '글로벌 운영 일원화',    desc: '다국적 공장 동일 기준·시스템 통합 관리',   badge: '8개국 실시간 다국어',  accent: '#4ade80' },
              { icon: TREND_ICON_NODES[5], title: '시스템 통합 (MES/ERP)', desc: 'API 연동으로 이중 입력 없는 통합',         badge: 'API 연동 지원',        accent: '#a78bfa' },
            ] : [
              { icon: TREND_ICON_NODES[0], title: 'Smart Factory',               desc: 'Digitize shop-floor quality checks via IoT',      badge: '4-Step Audit Workflow', accent: '#22d3ee' },
              { icon: TREND_ICON_NODES[1], title: 'Data-Driven Mgmt',            desc: 'Metric-based decisions, no more gut-feel QC',      badge: 'Data Trend · Worst 10', accent: '#60a5fa' },
              { icon: TREND_ICON_NODES[2], title: 'Mobile First',                desc: 'Instant smartphone use, no app install needed',    badge: 'PWA Mobile Web',        accent: '#c8c8ff' },
              { icon: TREND_ICON_NODES[3], title: 'Work Automation (RPA)',       desc: 'Zero manual work with auto reports & emails',      badge: 'Auto Report · Mailing', accent: '#fb923c' },
              { icon: TREND_ICON_NODES[4], title: 'Global Operations',           desc: 'Unified standards across multinational factories', badge: '8-Country Multilingual',accent: '#4ade80' },
              { icon: TREND_ICON_NODES[5], title: 'System Integration (MES/ERP)',desc: 'API integration, zero double data entry',          badge: 'API Integration',       accent: '#a78bfa' },
            ];

            return (
              <GCard delay={0.56} className="md:col-span-12 p-6">

                {/* ── 헤더: IBox + EL + h3 + 서브텍스트 ── */}
                <div className="flex items-center gap-3 mb-3">
                  <IBox><Zap className="size-5" style={{ color: RED }} /></IBox>
                  <div>
                    <EL text={t.whyWizFact} />
                    <h3 className="text-xl font-bold text-white leading-tight">
                      {ko ? 'WIZ-FACT를 선택하는 이유' : 'Why Choose WIZ-FACT'}
                    </h3>
                  </div>
                </div>
                <p className="text-[11px] mb-4" style={{ color: 'rgba(255,255,255,0.42)' }}>
                  {ko
                    ? 'DX · 스마트공장 · 모바일 퍼스트 시대, WIZ-FACT로 현장 품질 관리의 패러다임을 바꾸세요.'
                    : 'In the era of DX, smart factories & mobile-first — transform quality management with WIZ-FACT.'}
                </p>

                {/* ── 하단: WHY NOW + 트렌드 (모바일 1열 → 데스크탑 [1fr_2fr]) ── */}
                <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-4">

                  {/* 왼쪽: WHY NOW? 빨간 카드 */}
                  <div className="rounded-2xl p-4 flex flex-col gap-2.5"
                    style={{ background: `linear-gradient(145deg, ${RED} 0%, #7b0226 100%)`, border: `1px solid ${RED}80` }}>
                    <p className="text-[9px] font-bold tracking-[0.14em]" style={{ color: 'rgba(255,255,255,0.55)' }}>
                      {ko ? '지금 도입해야 하는 이유' : 'WHY NOW?'}
                    </p>
                    <p className="text-xl font-black text-white leading-tight" style={{ whiteSpace: 'pre-line' }}>
                      {ko ? '지금이\n도입 적기' : 'Now Is\nthe Time'}
                    </p>
                    <AnimatedCheckList items={PAIN_POINTS} />
                  </div>

                  {/* 오른쪽: 트렌드 매핑 (모바일 2열 → 데스크탑 3열) */}
                  <div className="rounded-2xl p-4"
                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                    <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                      <div>
                        <p className="text-[9px] font-bold tracking-[0.13em]" style={{ color: 'rgba(255,255,255,0.35)' }}>
                          {ko ? '산업 트렌드 → WIZ-FACT' : 'INDUSTRY TREND → WIZ-FACT'}
                        </p>
                        <p className="text-sm font-black text-white mt-0.5">
                          {ko ? '트렌드와 WIZ-FACT 기능 매핑' : 'Trend & WIZ-FACT Feature Mapping'}
                        </p>
                      </div>
                      <span className="text-[9px] px-2 py-1 rounded-full flex-shrink-0"
                        style={{ background: `${RED}20`, border: `1px solid ${RED}40`, color: RED }}>
                        {ko ? '2025 제조 트렌드' : '2025 Manufacturing Trends'}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {TRENDS.map((tr, ti) => (
                        <motion.div
                          key={ti}
                          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.64 + ti * 0.07, duration: 0.32 }}
                          whileHover={{ scale: 1.03, transition: { duration: 0.15 } }}
                          className="rounded-xl p-3 flex flex-col gap-1.5 relative overflow-hidden cursor-default"
                          style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${tr.accent}28` }}>
                          <div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-xl"
                            style={{ background: `linear-gradient(90deg, ${tr.accent}99, transparent)` }} />
                          {/* 심볼 아이콘 박스 */}
                          <div className="w-8 h-8 rounded-xl flex items-center justify-center relative flex-shrink-0"
                            style={{ background: `${tr.accent}16`, border: `1px solid ${tr.accent}30` }}>
                            <div className="absolute inset-0 rounded-xl blur-sm pointer-events-none"
                              style={{ background: tr.accent, opacity: 0.12 }} />
                            <div style={{ color: tr.accent, position: 'relative' }}>{tr.icon}</div>
                          </div>
                          <p className="text-[11px] font-bold text-white leading-tight">{tr.title}</p>
                          <p className="text-[9px] leading-snug truncate" style={{ color: 'rgba(255,255,255,0.4)' }}>{tr.desc}</p>
                          <span className="text-[8px] px-1.5 py-0.5 rounded-md mt-0.5 self-start"
                            style={{ background: `${tr.accent}18`, border: `1px solid ${tr.accent}38`, color: tr.accent }}>
                            {tr.badge}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </GCard>
            );
          })()}




        </div>
      </div>
      </div>
    </div>
  );
}