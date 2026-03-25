import type { LucideIcon } from 'lucide-react';
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  BarChart3,
  BookOpen,
  Check,
  Cog,
  Cpu,
  Database,
  FileText,
  LayoutDashboard,
  TabletSmartphone,
} from 'lucide-react';
import { useId, type ReactNode } from 'react';
import { motion } from 'motion/react';

import { WIZ_FLOW_IMPACT_INNER_CARD_CLASS } from './WizFlowImpactMetricsCard';

/** WIZ-Flow 기능 카드 문자열 `제목||부제` 파싱 (접근성용 전체 문구 등) */
export function splitWizFlowFeatureLine(raw: string): { head: string; sub: string } {
  const i = raw.indexOf('||');
  if (i === -1) return { head: raw.trim(), sub: '' };
  return { head: raw.slice(0, i).trim(), sub: raw.slice(i + 2).trim() };
}

/** 카드 타이틀 — 한글 최대 10자(부제는 하단 애니메이션으로만 전달) */
const TITLE_SHORT_KO = [
  '완전 디지털 작업지시',
  '실시간 공정 가시성',
  '태블릿·스마트폰 즉시입력',
  '불량·4M 즉시 연동',
  'SOP 표준 준수 강화',
  'PLC·설비 자동수집',
  '실적·KPI 자동 집계',
  '단일 대시보드 통합관제',
] as const;

/** 영문 타이틀 — 짧은 구(한글 10자 분량에 맞춤, 카드 폭 고려) */
const TITLE_SHORT_EN = [
  'Paperless digital work orders',
  'Real-time process visibility',
  'Tablet & smartphone instant input',
  'Defects & 4M linked live',
  'SOP standard adherence',
  'PLC · equipment capture',
  'Auto KPI & reporting',
  'Unified dashboard control',
] as const;

const WELL = '#F2F2F7';
const INK = '#3A3A3C';
const MUTED = '#8E8E93';
const ACCENT = '#007AFF';

const ICONS: LucideIcon[] = [
  FileText,
  Activity,
  TabletSmartphone,
  AlertTriangle,
  BookOpen,
  Cpu,
  BarChart3,
  LayoutDashboard,
];

/** 웰 내부 — 스케일·그림자·SVG가 위아래로 잘리지 않도록 기본 overflow-visible */
function WellCanvas({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`relative flex h-full min-h-0 w-full min-w-0 items-center justify-center overflow-visible px-1 py-0.5 sm:px-1.5 sm:py-1 ${className ?? ''}`}
      aria-hidden
    >
      <div className="flex h-full min-h-0 w-full min-w-0 max-h-full items-center justify-center overflow-visible">
        {children}
      </div>
    </div>
  );
}

/** WIZ-Flow 브랜드 포인트 — 카드 '핵심 기능' 라벨과 동일 계열 */
const STORY_BRAND = '#B30710';
/** SOP 준수 체크 — Apple 시스템 그린 */
const SOP_OK = '#34C759';

/** WIZ-Flow 카드 공통 스토리 타임라인 (~4.8s) — 디지털 작업지시·공정 가시성 등 동일 루프 */
const WIZ_FLOW_STORY_T = [0, 0.12, 0.24, 0.38, 0.48, 0.56, 0.64, 0.76, 1] as number[];
const WIZ_FLOW_STORY_LOOP = { duration: 4.8, repeat: Infinity as const, ease: 'easeInOut' as const, times: WIZ_FLOW_STORY_T };

/** ① 완전 디지털 작업지시 — 미니멀 페이퍼리스 루프: 종이 1장 ↔ 디지털 WO 카드 + 순차 체크 + 동기화 */

function VisualDigitalWorkOrder({ ko }: { ko: boolean }) {
  const gid = useId();
  const sheenId = `wizFlowWoSheen-${gid.replace(/:/g, '')}`;
  /** t=0·1에서 맞물리게: 종이 보임 → 전환 → 디지털 체크 → 페이드아웃 → 다시 종이 */
  const paperOpacity = [1, 1, 1, 0, 0, 0, 0, 0, 1];
  const paperY = [0, -1, 0, 2, 2, 2, 2, 2, 0];
  const digOpacity = [0, 0, 0, 0, 1, 1, 1, 1, 0];
  const digScale = [0.94, 0.94, 0.94, 0.96, 0.98, 1, 1, 1, 0.94];
  /** 작업지시 → 체크시트 → 순찰 순으로 완료 */
  const chk = [
    [0, 0, 0, 0, 0, 1, 1, 1, 0],
    [0, 0, 0, 0, 0, 0, 1, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 1, 0],
  ] as const;
  const syncOpacity = [0, 0, 0, 0, 0, 0, 0, 0.85, 0];

  const rows = ko
    ? (['작업지시', '체크시트', '순찰'] as const)
    : (['Work order', 'Check sheet', 'Patrol'] as const);
  const syncLabel = ko ? '동기화됨' : 'Synced';

  return (
    <WellCanvas>
      <div className="relative mx-auto flex h-full w-full max-w-[200px] flex-col items-center justify-center">
        <div className="relative flex h-[min(96px,100%)] w-full items-center justify-center">
          {/* 종이 — 단일 시트만 */}
          <motion.div
            className="absolute flex items-center justify-center"
            style={{ transformOrigin: '50% 55%' }}
            animate={{ opacity: paperOpacity, y: paperY, rotate: [-3, -2, -2, 0, 0, 0, 0, 0, -3] }}
            transition={WIZ_FLOW_STORY_LOOP}
          >
            <svg className="h-[50px] w-[40px] drop-shadow-md sm:h-[56px] sm:w-[44px]" viewBox="0 0 44 52" fill="none" aria-hidden>
              <rect x="6" y="4" width="32" height="44" rx="3" fill="#FAFAFA" stroke="#D8D8DD" strokeWidth="1.2" />
              <path d="M12 14h20M12 20h20M12 26h14" stroke={MUTED} strokeWidth="1.2" strokeLinecap="round" />
              <path d="M12 34h20M12 39h12" stroke="#D1D1D6" strokeWidth="1" strokeLinecap="round" />
            </svg>
          </motion.div>

          {/* 디지털 WO — 한 화면에 입력·체크·순찰 통합 */}
          <motion.div
            className="absolute flex flex-col items-center justify-center"
            animate={{ opacity: digOpacity, scale: digScale }}
            transition={WIZ_FLOW_STORY_LOOP}
          >
            <div
              className="relative w-[78px] overflow-hidden rounded-xl border bg-white shadow-lg sm:w-[84px]"
              style={{
                borderColor: ACCENT,
                boxShadow: '0 8px 24px rgba(0,122,255,0.14)',
              }}
            >
              <motion.div
                className="pointer-events-none absolute inset-y-0 left-0 z-10 w-1/2 opacity-30"
                style={{
                  background: `linear-gradient(100deg, transparent 0%, rgba(255,255,255,0.85) 45%, transparent 90%)`,
                }}
                animate={{ x: ['-20%', '220%'] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut', repeatDelay: 2 }}
              />
              <div className="relative px-2 pb-1.5 pt-2">
                <div className="mb-1 flex items-center justify-between gap-1">
                  <span className="text-[8px] font-black tracking-tight text-[#1d1d1f] sm:text-[9px]">WO</span>
                  <span
                    className="rounded px-1 py-px text-[6px] font-bold uppercase sm:text-[7px]"
                    style={{ background: `${STORY_BRAND}16`, color: STORY_BRAND }}
                  >
                    {ko ? '디지털' : 'Live'}
                  </span>
                </div>
                <div className="mb-1 h-px w-full bg-[#E8E8ED]" />
                {rows.map((row, i) => (
                  <div key={row} className="mb-1 flex items-center gap-1.5 last:mb-0">
                    <motion.div
                      className="flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded border sm:h-4 sm:w-4"
                      animate={{
                        borderColor: chk[i].map((v) => (v ? STORY_BRAND : '#D1D1D6')) as string[],
                        backgroundColor: chk[i].map((v) => (v ? `${STORY_BRAND}14` : '#ffffff')) as string[],
                        scale: chk[i],
                      }}
                      transition={WIZ_FLOW_STORY_LOOP}
                    >
                      <motion.span
                        className="flex"
                        initial={false}
                        animate={{ scale: chk[i], opacity: chk[i] }}
                        transition={WIZ_FLOW_STORY_LOOP}
                      >
                        <Check className="h-2 w-2 sm:h-2.5 sm:w-2.5" strokeWidth={3} style={{ color: STORY_BRAND }} />
                      </motion.span>
                    </motion.div>
                    <div className="relative h-[3px] min-w-0 flex-1 overflow-hidden rounded-full bg-[#ECECEC]">
                      <motion.div
                        className="absolute inset-y-0 left-0 w-full origin-left rounded-full"
                        style={{ background: ACCENT }}
                        animate={{ scaleX: chk[i] }}
                        transition={WIZ_FLOW_STORY_LOOP}
                      />
                    </div>
                    <span className="max-w-[38px] truncate text-[5.5px] font-semibold text-[#8e8e93] sm:max-w-[42px] sm:text-[6px]">
                      {row}
                    </span>
                  </div>
                ))}
                <motion.div
                  className="mt-1 flex items-center justify-center gap-0.5 text-[6px] font-black sm:text-[7px]"
                  style={{ color: STORY_BRAND }}
                  animate={{ opacity: syncOpacity }}
                  transition={WIZ_FLOW_STORY_LOOP}
                >
                  <motion.span
                    className="inline-block h-1 w-1 rounded-full bg-current"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                  />
                  {syncLabel}
                </motion.div>
              </div>
              <svg className="pointer-events-none absolute bottom-0 left-0 right-0 h-5 w-full opacity-[0.06]" aria-hidden>
                <defs>
                  <linearGradient id={sheenId} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={ACCENT} />
                    <stop offset="100%" stopColor="transparent" />
                  </linearGradient>
                </defs>
                <rect width="100%" height="100%" fill={`url(#${sheenId})`} />
              </svg>
            </div>
          </motion.div>
        </div>
      </div>
    </WellCanvas>
  );
}

/** ② 실시간 공정 가시성 — 추천: 정적 보고서(지표 안 보임) ↔ 라인별 라이브 스파크라인·상태(가시성) — WO 체크리스트와 구분 */
const VIS_GREEN = '#34C759';

function VisualProcessVisibility({ ko }: { ko: boolean }) {
  const gid = useId();
  const sheenId = `wizFlowVisSheen-${gid.replace(/:/g, '')}`;
  const sparkGrad = `wizFlowVisSpark-${gid.replace(/:/g, '')}`;
  const paperOpacity = [1, 1, 1, 0, 0, 0, 0, 0, 1];
  const paperY = [0, -1, 0, 2, 2, 2, 2, 2, 0];
  const digOpacity = [0, 0, 0, 0, 1, 1, 1, 1, 0];
  const digScale = [0.94, 0.94, 0.94, 0.96, 0.98, 1, 1, 1, 0.94];
  const footerOpacity = [0, 0, 0, 0, 0, 0, 0, 0.9, 0];

  const lines = ko ? (['L1', 'L2', 'L3'] as const) : (['L1', 'L2', 'L3'] as const);
  /** 라인별 미니 스파크 — 실시간 추세(가시성 핵심) */
  const sparks = [
    'M0 9 L7 5 L14 8 L21 3 L28 6 L35 4 L42 7',
    'M0 5 L7 8 L14 4 L21 7 L28 2 L35 6 L42 4',
    'M0 7 L7 4 L14 9 L21 5 L28 8 L35 3 L42 6',
  ] as const;
  const title = ko ? '모니터' : 'Monitor';
  const badge = ko ? '실시간' : 'LIVE';
  const footer = ko ? '지표 갱신' : 'Live metrics';

  return (
    <WellCanvas>
      <div className="relative mx-auto flex h-full w-full max-w-[200px] flex-col items-center justify-center">
        <div className="relative flex h-[min(96px,100%)] w-full items-center justify-center">
          {/* 정적 보고서: 평평한 추세선 + 동일 막대 = 공정 상태가 ‘안 보임’ */}
          <motion.div
            className="absolute flex items-center justify-center"
            style={{ transformOrigin: '50% 55%' }}
            animate={{ opacity: paperOpacity, y: paperY, rotate: [-3, -2, -2, 0, 0, 0, 0, 0, -3] }}
            transition={WIZ_FLOW_STORY_LOOP}
          >
            <svg className="h-[50px] w-[40px] drop-shadow-md sm:h-[56px] sm:w-[44px]" viewBox="0 0 44 52" fill="none" aria-hidden>
              <rect x="6" y="4" width="32" height="44" rx="3" fill="#FAFAFA" stroke="#D8D8DD" strokeWidth="1.2" />
              <path d="M10 11h24" stroke="#C7C7CC" strokeWidth="1" strokeLinecap="round" />
              <path d="M10 20 L34 20" stroke="#D8D8DD" strokeWidth="1.4" strokeLinecap="round" />
              <path d="M10 26 L34 26" stroke="#E5E5EA" strokeWidth="1" strokeLinecap="round" />
              <rect x="10" y="32" width="6" height="10" rx="1" fill="#E0E0E0" />
              <rect x="18" y="32" width="6" height="10" rx="1" fill="#E0E0E0" />
              <rect x="26" y="32" width="6" height="10" rx="1" fill="#E0E0E0" />
            </svg>
          </motion.div>

          {/* 라이브 공정 모니터: 라인별 스파크 + 상태점 + 스캔 */}
          <motion.div
            className="absolute flex flex-col items-center justify-center"
            animate={{ opacity: digOpacity, scale: digScale }}
            transition={WIZ_FLOW_STORY_LOOP}
          >
            <div
              className="relative w-[80px] overflow-hidden rounded-xl border bg-white shadow-lg sm:w-[88px]"
              style={{
                borderColor: ACCENT,
                boxShadow: '0 8px 24px rgba(0,122,255,0.14)',
              }}
            >
              <motion.div
                className="pointer-events-none absolute inset-y-1 bottom-0 left-0 z-[5] w-[28%] opacity-[0.18]"
                style={{
                  background: `linear-gradient(90deg, transparent, ${ACCENT}, transparent)`,
                }}
                animate={{ x: ['-30%', '130%'] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: 'linear' }}
              />
              <div className="relative z-[1] px-2 pb-1.5 pt-2">
                <div className="mb-1 flex items-center justify-between gap-0.5">
                  <span className="text-[7px] font-black tracking-tight text-[#1d1d1f] sm:text-[8px]">{title}</span>
                  <span
                    className="rounded px-1 py-px text-[5.5px] font-black tracking-wide sm:text-[6px]"
                    style={{ background: `${STORY_BRAND}18`, color: STORY_BRAND }}
                  >
                    {badge}
                  </span>
                </div>
                <div className="mb-1 h-px w-full bg-[#E8E8ED]" />
                <div className="flex flex-col gap-1">
                  {lines.map((lb, i) => (
                    <div key={lb} className="flex items-center gap-1">
                      <span className="w-[14px] shrink-0 text-[5.5px] font-bold tabular-nums text-[#8e8e93] sm:text-[6px]">
                        {lb}
                      </span>
                      <svg className="h-[11px] min-w-0 flex-1 overflow-visible" viewBox="0 0 42 12" preserveAspectRatio="none" aria-hidden>
                        <defs>
                          <linearGradient id={`${sparkGrad}-${i}`} x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor={ACCENT} stopOpacity="0.25" />
                            <stop offset="100%" stopColor={ACCENT} stopOpacity="1" />
                          </linearGradient>
                        </defs>
                        <motion.path
                          d={sparks[i]}
                          fill="none"
                          stroke={`url(#${sparkGrad}-${i})`}
                          strokeWidth="1.35"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: [0, 1] }}
                          transition={{
                            duration: 2.2,
                            repeat: Infinity,
                            repeatType: 'reverse',
                            ease: 'easeInOut',
                            delay: i * 0.2,
                          }}
                        />
                      </svg>
                      <motion.span
                        className="h-1.5 w-1.5 shrink-0 rounded-full"
                        style={{ background: VIS_GREEN, boxShadow: `0 0 0 1px ${VIS_GREEN}55` }}
                        animate={{ opacity: [0.45, 1, 0.45], scale: [0.85, 1.05, 0.85] }}
                        transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.18 }}
                      />
                    </div>
                  ))}
                </div>
                <motion.div
                  className="mt-1 flex items-center justify-center gap-0.5 text-[5.5px] font-black sm:text-[6px]"
                  style={{ color: STORY_BRAND }}
                  animate={{ opacity: footerOpacity }}
                  transition={WIZ_FLOW_STORY_LOOP}
                >
                  <motion.span
                    className="inline-block h-1 w-1 rounded-full bg-current"
                    animate={{ scale: [1, 1.25, 1] }}
                    transition={{ duration: 0.7, repeat: Infinity }}
                  />
                  {footer}
                </motion.div>
              </div>
              <svg className="pointer-events-none absolute bottom-0 left-0 right-0 h-5 w-full opacity-[0.06]" aria-hidden>
                <defs>
                  <linearGradient id={sheenId} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={ACCENT} />
                    <stop offset="100%" stopColor="transparent" />
                  </linearGradient>
                </defs>
                <rect width="100%" height="100%" fill={`url(#${sheenId})`} />
              </svg>
            </div>
          </motion.div>
        </div>
      </div>
    </WellCanvas>
  );
}

/** ③ 태블릿·스마트폰 즉시입력 — 추천: 현장 어디서나 탭 → 필드 즉시 채움 → 기기 간 동기(한 루프로 ‘즉시’ 전달) */
function VisualTabletPhoneInput({ ko }: { ko: boolean }) {
  const gid = useId();
  const beamGrad = `wizFlowTapBeam-${gid.replace(/:/g, '')}`;
  /** WIZ_FLOW_STORY_T와 동기: 태블릿 입력 → 빔 강조 → 스마트폰에 동일 반영 */
  const tabScale = [1, 1, 1, 1, 1.04, 1.05, 1.02, 1, 1];
  const phoneScale = [1, 1, 1, 1, 1, 1, 1.05, 1.06, 1];
  const tabField1 = [0, 0, 0, 0, 0.12, 0.92, 1, 1, 0];
  const tabField2 = [0, 0, 0, 0, 0, 0.08, 0.75, 1, 0];
  const phoneField1 = [0, 0, 0, 0, 0, 0, 0.15, 0.98, 0];
  const rippleTab = [0, 0, 0, 0, 0.55, 0.85, 0.25, 0, 0];
  const ripplePhone = [0, 0, 0, 0, 0, 0, 0.45, 0.9, 0.35];
  const beamOpacity = [0.35, 0.35, 0.35, 0.45, 0.75, 1, 1, 0.95, 0.4];
  const syncHint = [0, 0, 0, 0, 0.4, 0.9, 1, 1, 0];

  const labTab = ko ? '태블릿' : 'Tablet';
  const labPhone = ko ? '스마트폰' : 'Phone';
  const mid = ko ? '즉시' : 'Now';

  return (
    <WellCanvas>
      <div className="flex w-full max-w-[220px] items-end justify-center gap-0.5 px-0.5 sm:gap-1">
        {/* 태블릿 — 넓은 화면에 필드 순차 입력 */}
        <div className="flex flex-col items-center">
          <motion.div
            className="relative overflow-hidden rounded-xl border-2 bg-white shadow-md"
            style={{
              width: 58,
              height: 74,
              borderColor: ACCENT,
              borderRadius: 10,
              boxShadow: '0 6px 18px rgba(0,122,255,0.12)',
            }}
            animate={{ scale: tabScale }}
            transition={WIZ_FLOW_STORY_LOOP}
          >
            <div className="mx-auto mt-2 h-1 w-[40%] rounded-full bg-[#E5E5EA]" />
            <div className="mt-2 space-y-1.5 px-2">
              <div className="h-1.5 overflow-hidden rounded-md bg-[#EFEFF4]">
                <motion.div
                  className="h-full w-full origin-left rounded-md"
                  style={{ background: `linear-gradient(90deg, ${ACCENT} 0%, #5AC8FA 100%)` }}
                  animate={{ scaleX: tabField1 }}
                  transition={WIZ_FLOW_STORY_LOOP}
                />
              </div>
              <div className="h-1.5 overflow-hidden rounded-md bg-[#EFEFF4]">
                <motion.div
                  className="h-full w-full origin-left rounded-md"
                  style={{ background: ACCENT, opacity: 0.85 }}
                  animate={{ scaleX: tabField2 }}
                  transition={WIZ_FLOW_STORY_LOOP}
                />
              </div>
            </div>
            <motion.div
              className="pointer-events-none absolute bottom-2.5 left-1/2 h-10 w-10 -translate-x-1/2 rounded-full"
              style={{
                background: `radial-gradient(circle, rgba(0,122,255,0.45) 0%, transparent 65%)`,
              }}
              animate={{ opacity: rippleTab }}
              transition={WIZ_FLOW_STORY_LOOP}
            />
          </motion.div>
          <span className="mt-0.5 text-[6px] font-bold text-[#8e8e93] sm:text-[7px]">{labTab}</span>
        </div>

        {/* 동기화 빔 + ‘즉시’ 힌트 */}
        <div className="flex min-w-0 flex-col items-center justify-end pb-5 sm:pb-6">
          <motion.svg
            className="w-[34px] shrink-0 overflow-visible sm:w-[38px]"
            viewBox="0 0 38 22"
            fill="none"
            aria-hidden
          >
            <defs>
              <linearGradient id={beamGrad} x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor={ACCENT} stopOpacity="0.2" />
                <stop offset="50%" stopColor={ACCENT} stopOpacity="1" />
                <stop offset="100%" stopColor={ACCENT} stopOpacity="0.2" />
              </linearGradient>
            </defs>
            <motion.path
              d="M2 11h34"
              stroke={`url(#${beamGrad})`}
              strokeWidth="1.35"
              strokeLinecap="round"
              strokeDasharray="4 4"
              animate={{ opacity: beamOpacity }}
              transition={WIZ_FLOW_STORY_LOOP}
            />
            <motion.circle
              cx={19}
              cy={11}
              r={2.5}
              fill={ACCENT}
              animate={{ opacity: beamOpacity }}
              transition={WIZ_FLOW_STORY_LOOP}
            />
          </motion.svg>
          <motion.span
            className="mt-0.5 text-[5.5px] font-black sm:text-[6px]"
            style={{ color: STORY_BRAND }}
            animate={{ opacity: syncHint }}
            transition={WIZ_FLOW_STORY_LOOP}
          >
            {mid}
          </motion.span>
        </div>

        {/* 스마트폰 — 동일 데이터 즉시 반영 */}
        <div className="flex flex-col items-center">
          <motion.div
            className="relative overflow-hidden rounded-[14px] border-2 bg-white shadow-md"
            style={{
              width: 34,
              height: 62,
              borderColor: ACCENT,
              boxShadow: '0 6px 16px rgba(0,122,255,0.1)',
            }}
            animate={{ scale: phoneScale }}
            transition={WIZ_FLOW_STORY_LOOP}
          >
            <div className="mx-auto mt-2 h-0.5 w-8 rounded-full bg-[#E5E5EA]" />
            <div className="mt-2 px-2">
              <div className="h-1.5 overflow-hidden rounded-md bg-[#EFEFF4]">
                <motion.div
                  className="h-full w-full origin-left rounded-md"
                  style={{ background: `linear-gradient(90deg, ${ACCENT} 0%, #5AC8FA 100%)` }}
                  animate={{ scaleX: phoneField1 }}
                  transition={WIZ_FLOW_STORY_LOOP}
                />
              </div>
              <div className="mt-1 space-y-0.5">
                <div className="h-0.5 w-full rounded bg-[#E8E8ED]" />
                <div className="h-0.5 w-4/5 rounded bg-[#E8E8ED]" />
              </div>
            </div>
            <motion.div
              className="pointer-events-none absolute bottom-2 left-1/2 h-8 w-8 -translate-x-1/2 rounded-full"
              style={{
                background: `radial-gradient(circle, rgba(0,122,255,0.42) 0%, transparent 68%)`,
              }}
              animate={{ opacity: ripplePhone }}
              transition={WIZ_FLOW_STORY_LOOP}
            />
          </motion.div>
          <span className="mt-0.5 text-[6px] font-bold text-[#8e8e93] sm:text-[7px]">{labPhone}</span>
        </div>
      </div>
    </WellCanvas>
  );
}

/** ④ 불량·4M 즉시 연동 — 추천: NG 불량 펄스 → 4M(인·기·재·법)으로 순차 연결(path) → 노드 점등 = 즉시 연동 */
function VisualDefect4MLink({ ko }: { ko: boolean }) {
  const gid = useId();
  const lineGrad = `wizFlow4mLine-${gid.replace(/:/g, '')}`;
  const nodes = ko
    ? [
        { x: 78, y: 22, t: '인' },
        { x: 78, y: 78, t: '기' },
        { x: 22, y: 78, t: '재' },
        { x: 22, y: 22, t: '법' },
      ]
    : [
        { x: 78, y: 22, t: 'M1' },
        { x: 78, y: 78, t: 'M2' },
        { x: 22, y: 78, t: 'M3' },
        { x: 22, y: 22, t: 'M4' },
      ];
  /** 링크 순차 도달(4M 즉시 반영) */
  const link0 = [0, 0, 0, 0, 0.15, 0.95, 1, 1, 0];
  const link1 = [0, 0, 0, 0, 0, 0.2, 0.95, 1, 0];
  const link2 = [0, 0, 0, 0, 0, 0, 0.2, 1, 0];
  const link3 = [0, 0, 0, 0, 0, 0, 0, 0.25, 1];
  const links = [link0, link1, link2, link3];
  const nodeGlow = [
    [0.35, 0.35, 0.35, 0.4, 0.55, 1, 1, 1, 0.85],
    [0.35, 0.35, 0.35, 0.4, 0.45, 0.6, 1, 1, 0.85],
    [0.35, 0.35, 0.35, 0.4, 0.45, 0.5, 0.65, 1, 0.85],
    [0.35, 0.35, 0.35, 0.4, 0.45, 0.5, 0.55, 0.75, 1],
  ];
  const defPulse = [1, 1, 1, 1.05, 1.12, 1.08, 1, 1, 1];
  const footOp = [0, 0, 0, 0, 0.35, 0.75, 1, 1, 0];
  const footer = ko ? '4M 즉시 연동' : '4M linked live';

  return (
    <WellCanvas>
      <div className="flex w-full max-w-[200px] flex-col items-center gap-0.5">
        <svg className="h-auto max-h-[min(92px,100%)] w-full max-w-[180px]" viewBox="0 0 100 100" fill="none" preserveAspectRatio="xMidYMid meet" aria-hidden>
          <defs>
            <linearGradient id={lineGrad} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor={STORY_BRAND} stopOpacity="0.35" />
              <stop offset="100%" stopColor={STORY_BRAND} stopOpacity="1" />
            </linearGradient>
          </defs>
          {nodes.map((n, i) => (
            <motion.path
              key={`path-${n.t}`}
              d={`M 50 50 L ${n.x} ${n.y}`}
              stroke={`url(#${lineGrad})`}
              strokeWidth={1.35}
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: links[i] }}
              transition={WIZ_FLOW_STORY_LOOP}
            />
          ))}
          <motion.circle
            cx={50}
            cy={50}
            r={14}
            fill={STORY_BRAND}
            style={{ transformOrigin: '50px 50px' }}
            animate={{ scale: defPulse }}
            transition={WIZ_FLOW_STORY_LOOP}
          />
          <text x={50} y={53} textAnchor="middle" fill="#fff" style={{ fontSize: '11px', fontWeight: 900 }}>
            !
          </text>
          {!ko && (
            <text x={50} y={61} textAnchor="middle" fill="#fff" opacity="0.85" style={{ fontSize: '5px', fontWeight: 800 }}>
              4M
            </text>
          )}
          {ko && (
            <text x={50} y={61} textAnchor="middle" fill="#fff" opacity="0.9" style={{ fontSize: '5px', fontWeight: 800 }}>
              불량
            </text>
          )}
          {nodes.map((n, i) => (
            <g key={`n-${n.t}`}>
              <motion.circle
                cx={n.x}
                cy={n.y}
                r={10.5}
                fill="#fff"
                stroke={STORY_BRAND}
                strokeWidth={1.2}
                animate={{ opacity: nodeGlow[i] }}
                transition={WIZ_FLOW_STORY_LOOP}
              />
              <motion.circle
                cx={n.x}
                cy={n.y}
                r={7}
                fill={STORY_BRAND}
                animate={{ opacity: nodeGlow[i].map((v) => v * 0.12) }}
                transition={WIZ_FLOW_STORY_LOOP}
              />
              <text
                x={n.x}
                y={n.y + (ko ? 3.5 : 3)}
                textAnchor="middle"
                fill="#1d1d1f"
                style={{ fontSize: ko ? '8px' : '6px', fontWeight: 800 }}
              >
                {n.t}
              </text>
            </g>
          ))}
        </svg>
        <motion.p
          className="m-0 text-[6px] font-black sm:text-[7px]"
          style={{ color: STORY_BRAND }}
          animate={{ opacity: footOp }}
          transition={WIZ_FLOW_STORY_LOOP}
        >
          {footer}
        </motion.p>
      </div>
    </WellCanvas>
  );
}

/** ⑤ SOP 표준 준수 강화 — 추천: 개정 SOP(Rev) + 단계별 준수 체크(준비·작업·확인) + 표준 준수 시그널 — WO와 구분되는 문서·규범 톤 */
function VisualSopAdherence({ ko }: { ko: boolean }) {
  const gid = useId();
  const sheenId = `wizFlowSopSheen-${gid.replace(/:/g, '')}`;
  const chk = [
    [0, 0, 0, 0, 0, 1, 1, 1, 0],
    [0, 0, 0, 0, 0, 0, 1, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 1, 0],
  ] as const;
  const footOp = [0, 0, 0, 0, 0, 0, 0, 0.9, 0];
  const revPulse = [1, 1, 1, 1, 1.06, 1.08, 1.02, 1, 1];

  const rows = ko ? (['준비', '작업', '확인'] as const) : (['Prep', 'Work', 'Verify'] as const);
  const footer = ko ? '표준 준수' : 'Compliant';
  const rev = ko ? '개정' : 'Rev.3';

  return (
    <WellCanvas>
      <div className="relative mx-auto flex w-full max-w-[200px] flex-col items-center justify-center">
        <motion.div
          className="relative w-[84px] overflow-hidden rounded-xl border-2 bg-white shadow-md sm:w-[90px]"
          style={{
            borderColor: STORY_BRAND,
            boxShadow: '0 6px 18px rgba(179,7,16,0.12)',
          }}
          animate={{ scale: [0.98, 1, 1, 1, 1, 1, 1, 1, 0.98] }}
          transition={WIZ_FLOW_STORY_LOOP}
        >
          <motion.div
            className="pointer-events-none absolute inset-y-0 left-0 z-[1] w-2/5 opacity-25"
            style={{
              background: `linear-gradient(100deg, transparent 0%, rgba(255,255,255,0.9) 50%, transparent 100%)`,
            }}
            animate={{ x: ['-40%', '220%'] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut', repeatDelay: 2 }}
          />
          <div className="relative z-[2] px-2 pb-1.5 pt-2">
            <div className="mb-1 flex items-center justify-between gap-1">
              <div className="flex min-w-0 items-center gap-0.5">
                <BookOpen className="h-3 w-3 shrink-0 sm:h-3.5 sm:w-3.5" strokeWidth={2} style={{ color: STORY_BRAND }} aria-hidden />
                <span className="truncate text-[8px] font-black tracking-tight text-[#1d1d1f] sm:text-[9px]">SOP</span>
              </div>
              <motion.span
                className="shrink-0 rounded px-1 py-px text-[5.5px] font-black sm:text-[6px]"
                style={{ background: `${STORY_BRAND}18`, color: STORY_BRAND }}
                animate={{ scale: revPulse }}
                transition={WIZ_FLOW_STORY_LOOP}
              >
                {rev}
              </motion.span>
            </div>
            <div className="mb-1 h-px w-full bg-[#E8E8ED]" />
            {rows.map((row, i) => (
              <div key={row} className="mb-1 flex items-center gap-1 last:mb-0">
                <motion.div
                  className="flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded border sm:h-4 sm:w-4"
                  animate={{
                    borderColor: chk[i].map((v) => (v ? SOP_OK : '#D1D1D6')) as string[],
                    backgroundColor: chk[i].map((v) => (v ? `${SOP_OK}18` : '#ffffff')) as string[],
                    scale: chk[i],
                  }}
                  transition={WIZ_FLOW_STORY_LOOP}
                >
                  <motion.span className="flex" initial={false} animate={{ scale: chk[i], opacity: chk[i] }} transition={WIZ_FLOW_STORY_LOOP}>
                    <Check className="h-2 w-2 sm:h-2.5 sm:w-2.5" strokeWidth={3} style={{ color: SOP_OK }} />
                  </motion.span>
                </motion.div>
                <div className="relative h-[3px] min-w-0 flex-1 overflow-hidden rounded-full bg-[#ECECEC]">
                  <motion.div
                    className="absolute inset-y-0 left-0 w-full origin-left rounded-full"
                    style={{ background: SOP_OK }}
                    animate={{ scaleX: chk[i] }}
                    transition={WIZ_FLOW_STORY_LOOP}
                  />
                </div>
                <span className="max-w-[32px] truncate text-[5.5px] font-semibold text-[#8e8e93] sm:max-w-[36px] sm:text-[6px]">{row}</span>
              </div>
            ))}
            <motion.div
              className="mt-1 flex items-center justify-center gap-0.5 text-[6px] font-black sm:text-[7px]"
              style={{ color: STORY_BRAND }}
              animate={{ opacity: footOp }}
              transition={WIZ_FLOW_STORY_LOOP}
            >
              <motion.span
                className="inline-block h-1 w-1 rounded-full bg-current"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.85, repeat: Infinity }}
              />
              {footer}
            </motion.div>
          </div>
          <svg className="pointer-events-none absolute bottom-0 left-0 right-0 h-5 w-full opacity-[0.06]" aria-hidden>
            <defs>
              <linearGradient id={sheenId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={STORY_BRAND} />
                <stop offset="100%" stopColor="transparent" />
              </linearGradient>
            </defs>
            <rect width="100%" height="100%" fill={`url(#${sheenId})`} />
          </svg>
        </motion.div>
      </div>
    </WellCanvas>
  );
}

/** ⑥ PLC·설비 자동수집 — 스토리: PLC 스캔 → 버스 패킷 → 설비 아날로그 파형 → WIZ-Flow TAG 적재(브랜드) */
function VisualPlcCapture({ ko }: { ko: boolean }) {
  const gid = useId();
  const busGrad = `wizFlowPlcBus-${gid.replace(/:/g, '')}`;
  /** 버스·파형: 연결 수립 후 패킷이 지나갈 때 함께 진행 */
  const busPath = [0, 0, 0, 0.08, 0.35, 0.72, 1, 1, 0.88];
  const wavePath = [0, 0, 0, 0, 0, 0.18, 0.62, 1, 0.95];
  /** PLC: 스캔 구간에서만 글로우 */
  const plcGlow = [
    'inset 0 0 0 0 rgba(0,122,255,0)',
    'inset 0 0 0 0 rgba(0,122,255,0)',
    'inset 0 0 8px rgba(0,122,255,0.18)',
    'inset 0 0 14px rgba(0,122,255,0.32)',
    'inset 0 0 12px rgba(0,122,255,0.26)',
    'inset 0 0 10px rgba(0,122,255,0.2)',
    'inset 0 0 6px rgba(0,122,255,0.12)',
    'inset 0 0 0 0 rgba(0,122,255,0)',
    'inset 0 0 0 0 rgba(0,122,255,0)',
  ];
  /** 데이터 패킷 3개 — 순차적으로 밝아짐(PLC→설비 방향) */
  const pkt1 = [0.2, 0.2, 0.25, 0.35, 0.85, 1, 0.45, 0.25, 0.2];
  const pkt2 = [0.2, 0.2, 0.22, 0.28, 0.35, 0.9, 1, 0.55, 0.22];
  const pkt3 = [0.2, 0.2, 0.2, 0.22, 0.28, 0.4, 0.75, 1, 0.65];
  const eqScale = [1, 1, 1, 1, 1.02, 1.05, 1.08, 1.03, 1];
  const cogRot = [0, 0, 0, 0, 0, 4, 8, -5, 0];
  const led0 = [0.35, 0.35, 1, 0.5, 1, 1, 1, 0.55, 0.35];
  const led1 = [0.35, 0.35, 0.35, 1, 0.45, 1, 1, 1, 0.5];
  const led2 = [0.35, 0.35, 0.35, 0.35, 0.5, 0.55, 1, 1, 1];
  /** WIZ-Flow 적재 바·체크 — 후반부에만 */
  const sinkBar = [0, 0, 0, 0, 0, 0.12, 0.45, 0.92, 1];
  const chk1 = [0, 0, 0, 0, 0, 0, 0.45, 1, 1];
  const chk2 = [0, 0, 0, 0, 0, 0, 0, 0.85, 1];
  const sinkPulse = [1, 1, 1, 1, 1, 1, 1, 1.04, 1];
  const footOp = [0.35, 0.35, 0.4, 0.45, 0.55, 0.75, 0.92, 1, 1];

  const labPlc = 'PLC';
  const labEq = ko ? '설비' : 'EQ';
  const mid = ko ? '스캔' : 'SCAN';
  const sinkTags = ko
    ? (['RPM', '상태'] as const)
    : (['RPM', 'ST'] as const);
  const sinkLabel = ko ? 'TAG 적재' : 'TAG sync';
  const footer = ko ? '실시간 자동 수집' : 'Live auto-capture';

  return (
    <WellCanvas>
      <div className="flex w-full max-w-[220px] flex-col items-center gap-1">
        <div className="flex w-full items-center justify-center gap-0.5 px-0.5 sm:gap-1">
          {/* PLC 제어기 — 스캔 시 내부 시어 */}
          <div className="flex flex-col items-center">
            <motion.div
              className="relative overflow-hidden rounded-lg border-2 border-[#2c2c2e] bg-[#1c1c1e] px-1.5 py-1 shadow-inner"
              animate={{ boxShadow: plcGlow }}
              transition={WIZ_FLOW_STORY_LOOP}
            >
              <motion.div
                className="pointer-events-none absolute inset-0 opacity-30"
                style={{
                  background: `linear-gradient(105deg, transparent 0%, rgba(0,122,255,0.35) 45%, transparent 90%)`,
                }}
                animate={{ x: ['-100%', '120%'] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: 'linear', repeatDelay: 0.4 }}
              />
              <Cpu className="relative z-[1] h-[24px] w-[24px] text-[#e5e5ea] sm:h-[26px] sm:w-[26px]" strokeWidth={1.75} aria-hidden />
            </motion.div>
            <span className="mt-0.5 text-[6px] font-bold text-[#8e8e93] sm:text-[7px]">{labPlc}</span>
            <div className="mt-0.5 flex gap-0.5">
              <motion.span className="h-1 w-1 rounded-full bg-[#34C759]" animate={{ opacity: led0 }} transition={WIZ_FLOW_STORY_LOOP} />
              <motion.span className="h-1 w-1 rounded-full bg-[#FF9500]" animate={{ opacity: led1 }} transition={WIZ_FLOW_STORY_LOOP} />
              <motion.span className="h-1 w-1 rounded-full bg-[#34C759]" animate={{ opacity: led2 }} transition={WIZ_FLOW_STORY_LOOP} />
            </div>
          </div>

          {/* 신호 버스 + 패킷 + 설비 파형 */}
          <div className="flex min-w-0 flex-1 flex-col items-stretch justify-center gap-0.5">
            <svg className="h-[34px] w-full min-w-0 max-w-[108px]" viewBox="0 0 100 36" fill="none" aria-hidden>
              <defs>
                <linearGradient id={busGrad} x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor={ACCENT} stopOpacity="0.25" />
                  <stop offset="100%" stopColor={ACCENT} stopOpacity="1" />
                </linearGradient>
              </defs>
              <motion.path
                d="M0 14 L100 14"
                stroke={`url(#${busGrad})`}
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray="3 3"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: busPath }}
                transition={WIZ_FLOW_STORY_LOOP}
              />
              {/* 패킷(데이터 덩어리) — 버스 위에 순차 점등 */}
              <motion.circle cx="22" cy="14" r="2.2" fill={ACCENT} animate={{ opacity: pkt1 }} transition={WIZ_FLOW_STORY_LOOP} />
              <motion.circle cx="50" cy="14" r="2.2" fill={ACCENT} animate={{ opacity: pkt2 }} transition={WIZ_FLOW_STORY_LOOP} />
              <motion.circle cx="78" cy="14" r="2.2" fill={ACCENT} animate={{ opacity: pkt3 }} transition={WIZ_FLOW_STORY_LOOP} />
              <motion.path
                d="M0 28 L8 22 L16 26 L24 18 L32 24 L40 20 L48 26 L56 16 L64 22 L72 18 L80 24 L88 20 L96 26 L100 24"
                stroke={STORY_BRAND}
                strokeWidth="1.25"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                opacity={0.88}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: wavePath }}
                transition={WIZ_FLOW_STORY_LOOP}
              />
            </svg>
            <motion.div
              className="self-center rounded px-1 py-px text-[5.5px] font-black sm:text-[6px]"
              style={{ background: `${ACCENT}18`, color: ACCENT }}
              animate={{ opacity: [0.45, 0.45, 0.55, 0.75, 1, 1, 1, 0.85, 0.5] }}
              transition={WIZ_FLOW_STORY_LOOP}
            >
              {mid}
            </motion.div>
          </div>

          {/* 설비 — 샘플링 시 톱니 미세 회전 */}
          <div className="flex flex-col items-center">
            <motion.div
              className="rounded-xl border-2 bg-white px-1.5 py-1 shadow-md"
              style={{ borderColor: STORY_BRAND, boxShadow: '0 4px 12px rgba(179,7,16,0.1)' }}
              animate={{ scale: eqScale }}
              transition={WIZ_FLOW_STORY_LOOP}
            >
              <motion.div animate={{ rotate: cogRot }} transition={WIZ_FLOW_STORY_LOOP}>
                <Cog className="h-[24px] w-[24px] sm:h-[26px] sm:w-[26px]" strokeWidth={1.75} style={{ color: STORY_BRAND }} aria-hidden />
              </motion.div>
            </motion.div>
            <span className="mt-0.5 text-[6px] font-bold text-[#8e8e93] sm:text-[7px]">{labEq}</span>
          </div>
        </div>

        {/* WIZ-Flow — TAG가 메시에 적재되는 순간 */}
        <motion.div
          className="relative w-full max-w-[200px] overflow-hidden rounded-lg border bg-white px-1.5 py-1 shadow-sm"
          style={{ borderColor: `${STORY_BRAND}35` }}
          animate={{ scale: sinkPulse, borderColor: [`${STORY_BRAND}22`, `${STORY_BRAND}22`, `${STORY_BRAND}35`, `${STORY_BRAND}45`, `${STORY_BRAND}55`, `${STORY_BRAND}45`, `${STORY_BRAND}40`, `${STORY_BRAND}50`, `${STORY_BRAND}30`] }}
          transition={WIZ_FLOW_STORY_LOOP}
        >
          <div className="mb-0.5 flex items-center justify-between gap-1">
            <div className="flex min-w-0 items-center gap-0.5">
              <Database className="h-2.5 w-2.5 shrink-0 sm:h-3 sm:w-3" strokeWidth={2.2} style={{ color: STORY_BRAND }} aria-hidden />
              <span className="max-w-[4.5rem] truncate text-[5px] font-black tracking-tighter text-[#1d1d1f] sm:max-w-none sm:text-[6px] sm:tracking-tight">
                WIZ-Flow
              </span>
            </div>
            <span className="shrink-0 text-[5px] font-bold uppercase tracking-wide text-[#8e8e93] sm:text-[6px]">{sinkLabel}</span>
          </div>
          <div className="relative h-[3px] w-full overflow-hidden rounded-full bg-[#E8E8ED]">
            <motion.div
              className="absolute inset-y-0 left-0 h-full origin-left rounded-full"
              style={{ background: `linear-gradient(90deg, ${STORY_BRAND}, #d63a4a)` }}
              animate={{ scaleX: sinkBar }}
              transition={WIZ_FLOW_STORY_LOOP}
            />
          </div>
          <div className="mt-0.5 flex items-center justify-between gap-1">
            {sinkTags.map((tag, i) => {
              const chk = i === 0 ? chk1 : chk2;
              return (
                <div key={tag} className="flex min-w-0 flex-1 items-center gap-0.5">
                  <motion.span
                    className="flex h-3 w-3 shrink-0 items-center justify-center rounded border border-[#D1D1D6] bg-[#FAFAFA] sm:h-3.5 sm:w-3.5"
                    animate={{
                      borderColor: chk.map((v) => (v > 0.5 ? STORY_BRAND : '#D1D1D6')) as string[],
                      backgroundColor: chk.map((v) => (v > 0.5 ? `${STORY_BRAND}12` : '#FAFAFA')) as string[],
                    }}
                    transition={WIZ_FLOW_STORY_LOOP}
                  >
                    <motion.span className="flex" initial={false} animate={{ scale: chk, opacity: chk }} transition={WIZ_FLOW_STORY_LOOP}>
                      <Check className="h-2 w-2 sm:h-2.5 sm:w-2.5" strokeWidth={3} style={{ color: STORY_BRAND }} />
                    </motion.span>
                  </motion.span>
                  <span className="truncate text-[5.5px] font-semibold tabular-nums text-[#636366] sm:text-[6px]">{tag}</span>
                </div>
              );
            })}
          </div>
        </motion.div>

        <motion.p
          className="m-0 text-[6px] font-black sm:text-[7px]"
          style={{ color: STORY_BRAND }}
          animate={{ opacity: footOp }}
          transition={WIZ_FLOW_STORY_LOOP}
        >
          {footer}
        </motion.p>
      </div>
    </WellCanvas>
  );
}

/** ⑦ 실적·KPI 자동 집계 — 스토리: 현장 추세(스파크) → 막대 집계 → KPI 수치·리포트 완료 — WIZ-Flow 루프 동기 */
function VisualKpiAuto({ ko }: { ko: boolean }) {
  const gid = useId();
  const sparkGrad = `wizFlowKpiSpark-${gid.replace(/:/g, '')}`;
  /** 스파크라인: 실적 데이터가 쌓이며 그려짐 */
  const sparkPath = [0, 0, 0, 0.1, 0.28, 0.52, 0.78, 1, 0.92];
  /** 4개 막대 — 집계 구간에서 함께 성장 */
  const b1 = [0.22, 0.24, 0.26, 0.32, 0.48, 0.72, 0.88, 0.95, 0.55];
  const b2 = [0.2, 0.22, 0.35, 0.45, 0.58, 0.82, 1, 0.98, 0.58];
  const b3 = [0.18, 0.2, 0.22, 0.4, 0.55, 0.75, 0.92, 1, 0.62];
  const b4 = [0.16, 0.18, 0.2, 0.38, 0.52, 0.65, 0.82, 0.94, 0.5];
  /** KPI % — 후반에 이전 값에서 최종 값으로 전환 */
  const pctEarly = [1, 1, 1, 1, 0.85, 0.45, 0.2, 0, 0.35];
  const pctLate = [0, 0, 0, 0, 0.35, 0.75, 1, 1, 0.88];
  const kpiCardScale = [0.92, 0.92, 0.94, 0.94, 0.96, 0.98, 1, 1, 0.97];
  const reportOp = [0, 0, 0, 0, 0.15, 0.45, 0.78, 1, 1];
  const footOp = [0.35, 0.35, 0.42, 0.55, 0.72, 0.88, 0.95, 1, 0.88];

  const topL = ko ? '실적 추세' : 'Trend';
  const midL = ko ? '집계' : 'Roll-up';
  const kpiL = ko ? '종합 KPI' : 'KPI';
  const footer = ko ? '자동 집계·리포트' : 'Auto roll-up';

  return (
    <WellCanvas>
      <div className="flex w-full max-w-[210px] flex-col items-stretch gap-1 px-0.5">
        {/* ① 스파크 + 라벨 */}
        <div className="flex items-end justify-between gap-1">
          <span className="shrink-0 text-[5px] font-bold uppercase tracking-wide text-[#8e8e93] sm:text-[6px]">{topL}</span>
          <svg className="h-[26px] w-[72px] min-w-0 flex-1" viewBox="0 0 100 28" fill="none" aria-hidden>
            <defs>
              <linearGradient id={sparkGrad} x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor={ACCENT} stopOpacity="0.35" />
                <stop offset="100%" stopColor={ACCENT} stopOpacity="1" />
              </linearGradient>
            </defs>
            <motion.path
              d="M0 22 L14 16 L28 20 L42 10 L56 14 L70 8 L84 12 L100 6"
              stroke={`url(#${sparkGrad})`}
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: sparkPath }}
              transition={WIZ_FLOW_STORY_LOOP}
            />
            <motion.circle
              cx="100"
              cy="6"
              r="2.2"
              fill={ACCENT}
              animate={{ opacity: sparkPath }}
              transition={WIZ_FLOW_STORY_LOOP}
            />
          </svg>
        </div>

        {/* ② 막대 집계 + Σ 허브 */}
        <div className="flex items-end justify-center gap-0.5 sm:gap-1">
          {[b1, b2, b3, b4].map((scaleArr, i) => (
            <motion.div
              key={i}
              className="w-[7px] origin-bottom rounded-t-[2px] sm:w-2"
              style={{
                height: 26 + i * 4,
                background:
                  i === 2
                    ? `linear-gradient(180deg, ${STORY_BRAND}, #d63a4a)`
                    : i === 3
                      ? `linear-gradient(180deg, ${ACCENT}, #5AC8FA)`
                      : '#C7C7CC',
              }}
              animate={{ scaleY: scaleArr }}
              transition={WIZ_FLOW_STORY_LOOP}
            />
          ))}
          <motion.div
            className="ml-0.5 flex h-8 w-8 shrink-0 flex-col items-center justify-center rounded-lg border bg-white shadow-sm sm:h-9 sm:w-9"
            animate={{
              scale: kpiCardScale,
              borderColor: [
                'rgba(179,7,16,0.18)',
                'rgba(179,7,16,0.2)',
                'rgba(179,7,16,0.22)',
                'rgba(179,7,16,0.28)',
                'rgba(179,7,16,0.38)',
                'rgba(179,7,16,0.48)',
                'rgba(179,7,16,0.52)',
                'rgba(179,7,16,0.5)',
                'rgba(179,7,16,0.35)',
              ],
            }}
            transition={WIZ_FLOW_STORY_LOOP}
          >
            <span className="text-[9px] font-black leading-none text-[#1d1d1f] sm:text-[10px]" aria-hidden>
              Σ
            </span>
            <span className="mt-px text-[4.5px] font-bold uppercase tracking-tighter text-[#8e8e93] sm:text-[5px]">{midL}</span>
          </motion.div>
        </div>

        {/* ③ KPI 카드: % + 리포트 체크 */}
        <motion.div
          className="relative flex items-center justify-between gap-1 overflow-hidden rounded-lg border bg-white px-1.5 py-1 shadow-sm"
          style={{ borderColor: `${STORY_BRAND}28` }}
          animate={{ scale: [0.98, 0.98, 0.99, 0.99, 1, 1, 1, 1, 0.99] }}
          transition={WIZ_FLOW_STORY_LOOP}
        >
          <div className="flex min-w-0 items-center gap-0.5">
            <BarChart3 className="h-3 w-3 shrink-0 sm:h-3.5 sm:w-3.5" strokeWidth={2} style={{ color: STORY_BRAND }} aria-hidden />
            <span className="truncate text-[5.5px] font-black text-[#1d1d1f] sm:text-[6px]">{kpiL}</span>
          </div>
          <div className="relative flex shrink-0 items-baseline font-black tabular-nums leading-none">
            <span className="relative inline-block min-h-[16px] min-w-[34px] text-right">
              <motion.span
                className="absolute right-0 top-0 text-[13px] sm:text-[14px]"
                style={{ color: MUTED }}
                animate={{ opacity: pctEarly }}
                transition={WIZ_FLOW_STORY_LOOP}
              >
                94
              </motion.span>
              <motion.span
                className="absolute right-0 top-0 text-[13px] sm:text-[14px]"
                style={{ color: STORY_BRAND }}
                animate={{ opacity: pctLate }}
                transition={WIZ_FLOW_STORY_LOOP}
              >
                98
              </motion.span>
            </span>
            <span className="text-[8px] font-black sm:text-[9px]" style={{ color: STORY_BRAND }}>
              %
            </span>
          </div>
          <motion.div className="flex shrink-0 items-center gap-px" animate={{ opacity: reportOp }} transition={WIZ_FLOW_STORY_LOOP}>
            <ArrowRight className="h-2.5 w-2.5 text-[#8e8e93]" strokeWidth={2.5} aria-hidden />
            <div className="flex h-4 w-4 items-center justify-center rounded border border-[#34C759]/40 bg-[#34C759]/10">
              <Check className="h-2.5 w-2.5" strokeWidth={3} style={{ color: '#34C759' }} aria-hidden />
            </div>
          </motion.div>
        </motion.div>

        <motion.p className="m-0 text-center text-[6px] font-black sm:text-[7px]" style={{ color: STORY_BRAND }} animate={{ opacity: footOp }} transition={WIZ_FLOW_STORY_LOOP}>
          {footer}
        </motion.p>
      </div>
    </WellCanvas>
  );
}

/** ⑧ 단일 대시보드 통합관제 — 스토리: 라인별 타일 순차 포커스 → 허브로 수렴 → 전체 동기 하이라이트 — WIZ-Flow 루프 동기 */
function VisualUnifiedDashboard({ ko }: { ko: boolean }) {
  const gid = useId();
  const convGrad = `wizFlowDashConv-${gid.replace(/:/g, '')}`;
  /** 4분면 — 순차로 밝아졌다가 후반에 함께 강조(통합 뷰) */
  const q0 = [0.42, 0.45, 0.5, 0.92, 0.55, 0.48, 0.48, 0.88, 0.72];
  const q1 = [0.42, 0.45, 0.48, 0.55, 0.94, 0.52, 0.48, 0.88, 0.72];
  const q2 = [0.45, 0.88, 0.55, 0.5, 0.48, 0.52, 0.48, 0.88, 0.72];
  const q3 = [0.42, 0.45, 0.48, 0.48, 0.52, 0.94, 0.55, 0.88, 0.72];
  const quadOp = [q0, q1, q2, q3];
  /** 중앙 허브 — 수렴 구간에서 확대 */
  const hubScale = [0.88, 0.9, 0.92, 0.94, 0.96, 0.98, 1, 1.04, 0.96];
  const hubRing = [0.35, 0.38, 0.42, 0.5, 0.62, 0.78, 0.88, 1, 0.75];
  /** 모서리→허브 연결선 */
  const convPath = [0, 0, 0, 0.15, 0.35, 0.55, 0.78, 1, 0.92];
  const syncFlash = [0, 0, 0, 0, 0, 0.2, 0.45, 1, 0.65];
  const footOp = [0.38, 0.4, 0.45, 0.55, 0.68, 0.82, 0.92, 1, 0.88];

  const labels = ko ? (['라인 A', '라인 B', '라인 C', '라인 D'] as const) : (['Line A', 'Line B', 'Line C', 'Line D'] as const);
  const hubL = ko ? '통합' : 'HUB';
  const footer = ko ? '전 라인 · 한 화면' : 'All lines · One view';

  return (
    <WellCanvas>
      <div className="flex w-full max-w-[210px] flex-col items-stretch gap-1 px-0.5">
        <div className="relative mx-auto aspect-square w-full max-w-[148px] sm:max-w-[158px]">
          {/* 연결선 — 사분면이 허브로 모이는 느낌 */}
          <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 100 100" fill="none" aria-hidden>
            <defs>
              <linearGradient id={convGrad} x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor={ACCENT} stopOpacity="0.15" />
                <stop offset="100%" stopColor={STORY_BRAND} stopOpacity="0.85" />
              </linearGradient>
            </defs>
            <motion.path
              d="M12 12 Q50 42 50 50 M88 12 Q58 42 50 50 M12 88 Q42 58 50 50 M88 88 Q58 58 50 50"
              stroke={`url(#${convGrad})`}
              strokeWidth="1.25"
              strokeLinecap="round"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: convPath }}
              transition={WIZ_FLOW_STORY_LOOP}
            />
          </svg>

          <div className="absolute inset-[10px] grid grid-cols-2 grid-rows-2 gap-0.5">
            {labels.map((lab, i) => (
              <motion.div
                key={lab}
                className="flex flex-col justify-between rounded-md border bg-white px-0.5 py-px sm:px-1 sm:py-0.5"
                style={{ borderColor: 'rgba(0,0,0,0.08)' }}
                animate={{
                  boxShadow: quadOp[i].map((o) =>
                    o > 0.75
                      ? `0 0 0 1.5px rgba(0,122,255,${0.15 + o * 0.35}), 0 2px 8px rgba(179,7,16,${0.06 + o * 0.08})`
                      : '0 1px 2px rgba(0,0,0,0.04)',
                  ) as string[],
                  opacity: quadOp[i].map((o) => 0.55 + o * 0.45) as number[],
                }}
                transition={WIZ_FLOW_STORY_LOOP}
              >
                <span className="truncate text-[4.5px] font-bold leading-none text-[#8e8e93] sm:text-[5px]">{lab}</span>
                <div className="mt-px flex gap-px">
                  <motion.span
                    className="h-[3px] flex-1 rounded-sm bg-[#C7C7CC]"
                    animate={{ backgroundColor: quadOp[i].map((o) => (o > 0.7 ? ACCENT : '#C7C7CC')) as string[] }}
                    transition={WIZ_FLOW_STORY_LOOP}
                  />
                  <span className="h-[3px] w-1 rounded-sm bg-[#E8E8ED]" />
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="absolute left-1/2 top-1/2 z-10 flex h-[34px] w-[34px] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border-2 bg-white shadow-md sm:h-[38px] sm:w-[38px]"
            style={{ borderColor: `${ACCENT}55` }}
            animate={{
              scale: hubScale,
              boxShadow: hubRing.map(
                (o) => `0 0 0 ${1 + o * 2}px rgba(0,122,255,${0.12 + o * 0.2}), 0 4px 14px rgba(0,0,0,${0.06 + o * 0.08})`,
              ),
            }}
            transition={WIZ_FLOW_STORY_LOOP}
          >
            <LayoutDashboard className="h-[14px] w-[14px] sm:h-4 sm:w-4" strokeWidth={2.2} style={{ color: STORY_BRAND }} aria-hidden />
            <span className="mt-px text-[4px] font-black uppercase leading-none text-[#8e8e93] sm:text-[4.5px]">{hubL}</span>
          </motion.div>

          <motion.div
            className="pointer-events-none absolute inset-0 rounded-xl"
            style={{ background: `radial-gradient(circle at 50% 50%, ${ACCENT}00 0%, ${ACCENT}08 100%)` }}
            animate={{ opacity: syncFlash }}
            transition={WIZ_FLOW_STORY_LOOP}
          />
        </div>

        <motion.p className="m-0 text-center text-[6px] font-black sm:text-[7px]" style={{ color: STORY_BRAND }} animate={{ opacity: footOp }} transition={WIZ_FLOW_STORY_LOOP}>
          {footer}
        </motion.p>
      </div>
    </WellCanvas>
  );
}

const VISUALS = [
  VisualDigitalWorkOrder,
  VisualProcessVisibility,
  VisualTabletPhoneInput,
  VisualDefect4MLink,
  VisualSopAdherence,
  VisualPlcCapture,
  VisualKpiAuto,
  VisualUnifiedDashboard,
];

function FeatureWellVisual({ index, ko }: { index: number; ko: boolean }) {
  const vIndex = index % VISUALS.length;
  if (vIndex === 0) return <VisualDigitalWorkOrder ko={ko} />;
  if (vIndex === 1) return <VisualProcessVisibility ko={ko} />;
  if (vIndex === 2) return <VisualTabletPhoneInput ko={ko} />;
  if (vIndex === 3) return <VisualDefect4MLink ko={ko} />;
  if (vIndex === 4) return <VisualSopAdherence ko={ko} />;
  if (vIndex === 5) return <VisualPlcCapture ko={ko} />;
  if (vIndex === 6) return <VisualKpiAuto ko={ko} />;
  if (vIndex === 7) return <VisualUnifiedDashboard ko={ko} />;
  const V = VISUALS[vIndex];
  return <V />;
}

function wizFlowShortTitle(index: number, ko: boolean): string {
  const list = ko ? TITLE_SHORT_KO : TITLE_SHORT_EN;
  return list[Math.min(index, list.length - 1)] ?? '';
}

export function WizFlowFeatureCapabilityCard({
  rawLine,
  index,
  ko,
}: {
  rawLine: string;
  index: number;
  ko: boolean;
}) {
  const { head, sub } = splitWizFlowFeatureLine(rawLine);
  const Icon = ICONS[index % ICONS.length];
  const titleShort = wizFlowShortTitle(index, ko);
  const ariaLabel = sub ? `${head}. ${sub}` : head;

  return (
    <motion.article
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-24px' }}
      transition={{ duration: 0.45, delay: Math.min(index * 0.05, 0.35), ease: [0.22, 1, 0.36, 1] }}
      className={`${WIZ_FLOW_IMPACT_INNER_CARD_CLASS} aspect-square min-h-0 w-full overflow-visible !p-0`}
      style={{ WebkitFontSmoothing: 'antialiased' }}
      aria-label={ariaLabel}
    >
      {/* 상단: 아이콘(세로 = 오른쪽 두 줄과 동일) + 핵심 기능 + 짧은 타이틀 */}
      <div className="flex shrink-0 items-stretch gap-2 px-2.5 pt-2.5 pb-1.5">
        <div
          className="flex w-7 shrink-0 items-center justify-center self-stretch rounded-lg"
          style={{ background: WELL }}
        >
          <Icon className="h-[14px] w-[14px]" strokeWidth={1.85} style={{ color: INK }} aria-hidden />
        </div>
        <div className="flex min-h-0 min-w-0 flex-1 flex-col justify-center gap-0.5">
          <p
            className="m-0 text-[9px] font-semibold uppercase leading-none tracking-[0.07em] sm:text-[10px]"
            style={{ color: '#B30710' }}
          >
            {ko ? '핵심 기능' : 'KEY FEATURE'}
          </p>
          <p
            className="m-0 min-h-0 min-w-0 line-clamp-2 break-words text-left text-[10px] font-semibold leading-snug tracking-[-0.02em] sm:text-[11px]"
            style={{ color: '#1d1d1f', fontFeatureSettings: '"tnum"' }}
          >
            {titleShort}
          </p>
        </div>
      </div>

      {/* 하단: 애니메이션 웰 (overflow-visible — 터치 리플·scale·SVG가 잘리지 않게) */}
      <div className="flex min-h-0 flex-1 flex-col px-2.5 pb-2.5 pt-0">
        <div
          className="relative min-h-0 flex-1 w-full overflow-visible rounded-xl"
          style={{ background: WELL }}
        >
          <FeatureWellVisual index={index} ko={ko} />
        </div>
      </div>
    </motion.article>
  );
}

/** 핵심 기능 8장 — 4×2(4열·2행), 좁은 화면에서는 2열로 폴백 */
export function WizFlowFeatureCapabilityCardsGrid({ lines, ko }: { lines: string[]; ko: boolean }) {
  return (
    <div className="grid min-h-0 w-full grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3 md:gap-3.5">
      {lines.map((line, i) => (
        <WizFlowFeatureCapabilityCard key={`${i}-${line.slice(0, 12)}`} rawLine={line} index={i} ko={ko} />
      ))}
    </div>
  );
}
