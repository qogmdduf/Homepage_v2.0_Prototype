import { motion } from 'motion/react';
import { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import { CategoryKey } from '../data/solutions';
import { useLanguage } from '../contexts/LanguageContext';

const _cl2 = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

// ────────────────────────────────────────────────────────────────────────────
// _NavPicker: 슬라이딩 윈도우 탭 피커
//  · 드래그로 pill 추적, L/R 트리거 도달 시 strip 스크롤
//  · 드래그 종료 시 가장 가까운 항목에 spring 정착
//  · pill 너비: 각 라벨 텍스트 너비를 측정해 가변 적용
// ────────────────────────────────────────────────────────────────────────────
interface NavPickerProps {
  categories: { key: CategoryKey; label: string }[];
  activeKey: CategoryKey;
  onChange: (key: CategoryKey) => void;
  itemW: number;
  SHOW: number;
  MAX_OFF: number;
}

function _NavPicker({ categories, activeKey, onChange, itemW, SHOW, MAX_OFF }: NavPickerProps) {
  const N = categories.length;

  const L = 1;
  const R = SHOW - 2;
  const calcOff = useCallback((fi: number, cur: number, round = false) => {
    const slot = fi - cur;
    let no = cur;
    if      (slot < L) no = fi - L;
    else if (slot > R) no = fi - R;
    return _cl2(round ? Math.round(no) : no, 0, MAX_OFF);
  }, [L, R, MAX_OFF]);

  const selIdx = _cl2(categories.findIndex(c => c.key === activeKey), 0, N - 1);
  const selRef = useRef(selIdx);
  selRef.current = selIdx;

  const H = 44;

  const [off, setOff_] = useState(() => _cl2(selIdx - 2, 0, MAX_OFF));
  const offRef = useRef(off);
  const setOff = useCallback((v: number, round = true) => {
    const nv = round ? _cl2(Math.round(v), 0, MAX_OFF) : _cl2(v, 0, MAX_OFF);
    offRef.current = nv; setOff_(nv);
  }, [MAX_OFF]);

  const [pillX, setPillX] = useState(() => (selIdx - offRef.current) * itemW);
  const [pillW, setPillW] = useState(itemW - 8);          // 초기값: 슬롯 - 여백
  const [dragging, setDragging] = useState(false);

  const labelRefs   = useRef<(HTMLSpanElement | null)[]>([]);
  const labelWidths = useRef<number[]>(new Array(N).fill(0));

  const getPillW = useCallback((idx: number) => {
    const tw = labelWidths.current[idx] ?? 0;
    const raw = tw > 0 ? tw + 24 : itemW - 8;   // 측정 전이면 슬롯 기반 폴백
    return Math.min(raw, itemW - 6);
  }, [itemW]);

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      const ws = labelRefs.current.map(el => el?.getBoundingClientRect().width ?? 0);
      if (ws.some(w => w > 0)) {
        labelWidths.current = ws;
        setPillW(Math.min((ws[selRef.current] ?? 0) + 24, itemW - 6));
      }
    });
    return () => cancelAnimationFrame(raf);
  }, [itemW]);

  const drag = useRef({ on: false, x0: 0, si0: 0, didMove: false, lastFi: 0 });

  useEffect(() => {
    if (drag.current.on) return;
    const o = _cl2(selIdx - 2, 0, MAX_OFF);
    setOff(o);
    setPillX((selIdx - o) * itemW);
    setPillW(getPillW(selIdx));
    setDragging(false);
  }, [selIdx, itemW, MAX_OFF, setOff, getPillW]);

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

    const fi = _cl2(drag.current.si0 + dx / itemW, 0, N - 1);
    drag.current.lastFi = fi;

    const no       = calcOff(fi, offRef.current, false);
    const pillSlot = fi - no;
    setOff(no, false);
    setPillX(_cl2(pillSlot, 0, SHOW - 1) * itemW);

    const nearIdx = _cl2(Math.round(fi), 0, N - 1);
    const tw = labelWidths.current[nearIdx] ?? 0;
    setPillW(Math.min(tw > 0 ? tw + 24 : itemW - 8, itemW - 6));

    if (nearIdx !== selRef.current) onChange(categories[nearIdx].key);
  }, [itemW, N, SHOW, calcOff, setOff, categories, onChange]);

  const onUp = useCallback((e: React.PointerEvent) => {
    if (!drag.current.on) return;
    drag.current.on = false;
    setDragging(false);

    if (!drag.current.didMove) {
      const curOff = Math.round(offRef.current);
      const rect   = (e.currentTarget as HTMLElement).getBoundingClientRect();
      const cs     = _cl2(Math.floor((e.clientX - rect.left) / itemW), 0, SHOW - 1);
      const ci     = _cl2(cs + curOff, 0, N - 1);

      let no = curOff;
      if      (cs === L && no > 0)       no -= 1;
      else if (cs === R && no < MAX_OFF) no += 1;
      no = _cl2(no, 0, MAX_OFF);

      setOff(no);
      setPillX((ci - no) * itemW);
      const tw = labelWidths.current[ci] ?? 0;
      setPillW(Math.min(tw > 0 ? tw + 24 : itemW - 8, itemW - 6));
      onChange(categories[ci].key);
    } else {
      const fi      = drag.current.lastFi;
      const nearIdx = _cl2(Math.round(fi), 0, N - 1);
      const no      = calcOff(nearIdx, offRef.current, true);
      setOff(no);
      setPillX(_cl2(nearIdx - no, 0, SHOW - 1) * itemW);
      const tw = labelWidths.current[nearIdx] ?? 0;
      setPillW(Math.min(tw > 0 ? tw + 24 : itemW - 8, itemW - 6));
      if (nearIdx !== selRef.current) onChange(categories[nearIdx].key);
    }
  }, [itemW, N, SHOW, L, R, MAX_OFF, calcOff, setOff, categories, onChange]);

  const pillAnim = { x: pillX + (itemW - pillW) / 2, width: pillW };
  const pillTr   = dragging ? { duration: 0 } : { type: 'spring' as const, stiffness: 520, damping: 34 };
  const stripTr  = dragging ? { duration: 0 } : { type: 'spring' as const, stiffness: 420, damping: 36 };

  return (
    <div
      onPointerDown={onDown} onPointerMove={onMove}
      onPointerUp={onUp}     onPointerCancel={onUp}
      style={{
        position: 'relative',
        width: SHOW * itemW,
        height: H,
        overflow: 'hidden',
        borderRadius: 999,
        background: '#E8E8ED',
        flexShrink: 0,
        cursor: 'grab',
        userSelect: 'none',
        touchAction: 'none',
        margin: '0 auto',
      }}
    >
      {/* pill */}
      <motion.div
        animate={pillAnim}
        transition={pillTr}
        style={{
          position: 'absolute',
          left: 0, top: 4,
          height: H - 8,
          borderRadius: 999,
          background: '#1D1D1F',
          boxShadow: '0 1px 4px rgba(0,0,0,0.18)',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      {/* strip */}
      <motion.div
        animate={{ x: -off * itemW }}
        transition={stripTr}
        style={{ display: 'flex', height: H, position: 'relative', zIndex: 2 }}
      >
        {categories.map((cat, i) => (
          <div key={cat.key} style={{
            flex: `0 0 ${itemW}px`,
            width: itemW, height: H,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
          }}>
            <span
              ref={el => { labelRefs.current[i] = el; }}
              style={{
                fontSize: 14, fontWeight: 600, lineHeight: 1,
                color: i === selIdx ? '#fff' : '#86868B',
                whiteSpace: 'nowrap',
                transition: 'color .15s',
              }}
            >
              {cat.label}
            </span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// WizNavigation: 컨테이너 너비 측정 → itemW 계산 → _NavPicker에 전달
// ────────────────────────────────────────────────────────────────────────────
interface WizNavigationProps {
  activeCategory: CategoryKey;
  onCategoryChange: (category: CategoryKey) => void;
}

const MOBILE_SHOW  = 4;
const DESKTOP_SHOW = 6;

export function WizNavigation({ activeCategory, onCategoryChange }: WizNavigationProps) {
  const { t } = useLanguage();

  // 모바일 감지
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia('(max-width: 767px)').matches : false
  );
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const h = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener('change', h);
    return () => mq.removeEventListener('change', h);
  }, []);

  const categories = useMemo(() => [
    { key: 'all'        as CategoryKey, label: t('navigation.all') },
    { key: 'platform'   as CategoryKey, label: t('navigation.platform') },
    { key: 'production' as CategoryKey, label: t('navigation.production') },
    { key: 'quality'    as CategoryKey, label: t('navigation.quality') },
    { key: 'facility'   as CategoryKey, label: t('navigation.facility') },
    { key: 'project'    as CategoryKey, label: t('navigation.project') },
  ], [t]);

  const SHOW    = isMobile ? MOBILE_SHOW : DESKTOP_SHOW;
  const MAX_OFF = Math.max(0, categories.length - SHOW);

  const wrapRef = useRef<HTMLDivElement>(null);
  const [itemW, setItemW] = useState(80);

  useEffect(() => {
    const measure = () => {
      const w = wrapRef.current?.getBoundingClientRect().width ?? 0;
      if (w > 8) setItemW(Math.floor(w / SHOW));
    };
    const raf = requestAnimationFrame(measure);
    const ro = new ResizeObserver(measure);
    if (wrapRef.current) ro.observe(wrapRef.current);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, [SHOW]);

  return (
    <div style={{ backgroundColor: '#F5F5F7' }}>
      <div className="wiz-section py-4 md:py-6" style={{ backgroundColor: '#F5F5F7' }}>
        <div className="flex justify-center">
          <div
            ref={wrapRef}
            className="w-full md:w-auto"
            style={{ maxWidth: DESKTOP_SHOW * 110 }}
          >
            <_NavPicker
              categories={categories}
              activeKey={activeCategory}
              onChange={onCategoryChange}
              itemW={itemW}
              SHOW={SHOW}
              MAX_OFF={MAX_OFF}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
