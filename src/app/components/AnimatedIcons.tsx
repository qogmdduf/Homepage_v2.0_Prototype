import { motion } from 'motion/react';

// ── Layer 3: Operations & Insights ───────────────────────────────────────────

/** 제조 운영 실행 — 회전 조준경 + 스캔 라인 */
export const IconManufacturing = ({ color }: { color: string }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    {/* outer ring rotating */}
    <motion.circle
      cx="12" cy="12" r="9"
      stroke={color} strokeWidth="1.5" strokeDasharray="6 3"
      animate={{ rotate: 360 }}
      transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
      style={{ originX: '12px', originY: '12px', transformOrigin: '12px 12px' }}
    />
    {/* middle ring pulsing */}
    <motion.circle
      cx="12" cy="12" r="5"
      stroke={color} strokeWidth="1.5" opacity="0.5"
      animate={{ r: [5, 6, 5] }}
      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
    />
    {/* center dot */}
    <motion.circle
      cx="12" cy="12" r="2"
      fill={color}
      animate={{ scale: [1, 1.4, 1] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
      style={{ originX: '12px', originY: '12px', transformOrigin: '12px 12px' }}
    />
    {/* scan line */}
    <motion.line
      x1="3" y1="12" x2="9" y2="12"
      stroke={color} strokeWidth="1.5" strokeLinecap="round"
      animate={{ opacity: [1, 0.3, 1] }}
      transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
    />
    <motion.line
      x1="15" y1="12" x2="21" y2="12"
      stroke={color} strokeWidth="1.5" strokeLinecap="round"
      animate={{ opacity: [1, 0.3, 1] }}
      transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
    />
  </svg>
);

/** 업무 협업 — 채팅 버블 + 타이핑 도트 */
export const IconCollaboration = ({ color }: { color: string }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    {/* main bubble */}
    <motion.rect
      x="2" y="3" width="14" height="10" rx="3"
      fill={`${color}20`} stroke={color} strokeWidth="1.5"
      animate={{ y: [0, -1, 0] }}
      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
    />
    {/* secondary bubble */}
    <motion.rect
      x="8" y="11" width="14" height="10" rx="3"
      fill={`${color}15`} stroke={color} strokeWidth="1.5"
      animate={{ y: [0, 1, 0] }}
      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
    />
    {/* typing dots inside main bubble */}
    {[6, 9, 12].map((x, i) => (
      <motion.circle
        key={x} cx={x} cy="8" r="1.2"
        fill={color}
        animate={{ opacity: [0.2, 1, 0.2], y: [0, -1.5, 0] }}
        transition={{ duration: 1, repeat: Infinity, delay: i * 0.2, ease: 'easeInOut' }}
      />
    ))}
  </svg>
);

/** 데이터 시각화 — 바 차트 성장 애니메이션 */
export const IconDataViz = ({ color }: { color: string }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    {/* base line */}
    <line x1="2" y1="20" x2="22" y2="20" stroke={color} strokeWidth="1.2" strokeOpacity="0.3" />
    {/* bars — different heights, staggered */}
    {[
      { x: 3,  heights: [14, 10, 14], delay: 0 },
      { x: 8,  heights: [8,  16, 8],  delay: 0.15 },
      { x: 13, heights: [18, 12, 18], delay: 0.3 },
      { x: 18, heights: [10, 18, 10], delay: 0.45 },
    ].map(({ x, heights, delay }) => (
      <motion.rect
        key={x}
        x={x} rx="1.5" width="3"
        fill={color}
        animate={{
          height: heights,
          y: heights.map(h => 20 - h),
        }}
        transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut', delay }}
      />
    ))}
  </svg>
);

/** 분석 인사이트 — 빛나는 전구 */
export const IconInsights = ({ color }: { color: string }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    {/* rays */}
    {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
      <motion.line
        key={angle}
        x1={12 + 8 * Math.cos((angle * Math.PI) / 180)}
        y1={10 + 8 * Math.sin((angle * Math.PI) / 180)}
        x2={12 + 10.5 * Math.cos((angle * Math.PI) / 180)}
        y2={10 + 10.5 * Math.sin((angle * Math.PI) / 180)}
        stroke={color} strokeWidth="1.5" strokeLinecap="round"
        animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1.2, 0.8] }}
        transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.12, ease: 'easeInOut' }}
        style={{ transformOrigin: '12px 10px' }}
      />
    ))}
    {/* bulb body */}
    <motion.path
      d="M9 16c0-3-3-5-3-8a6 6 0 0 1 12 0c0 3-3 5-3 8H9z"
      fill={`${color}25`} stroke={color} strokeWidth="1.5"
      animate={{ opacity: [0.7, 1, 0.7] }}
      transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
    />
    {/* base */}
    <line x1="9" y1="18" x2="15" y2="18" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    <line x1="10" y1="20" x2="14" y2="20" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

// ── Layer 2: Domain Solution ──────────────────────────────────────────────────

/** 생산 실행 관리 — 이중 반전 회전 기어 */
export const IconGear = ({ color }: { color: string }) => {
  const gearPath = (cx: number, cy: number, r: number, teeth: number, toothH: number) => {
    const pts: string[] = [];
    for (let i = 0; i < teeth * 2; i++) {
      const angle = (i * Math.PI) / teeth;
      const rad = i % 2 === 0 ? r + toothH : r;
      pts.push(`${cx + rad * Math.cos(angle)},${cy + rad * Math.sin(angle)}`);
    }
    return `M${pts.join('L')}Z`;
  };
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      {/* large gear */}
      <motion.path
        d={gearPath(10, 12, 5.5, 8, 1.8)}
        fill={`${color}20`} stroke={color} strokeWidth="1.2" strokeLinejoin="round"
        animate={{ rotate: 360 }}
        transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
        style={{ transformOrigin: '10px 12px' }}
      />
      <circle cx="10" cy="12" r="1.8" fill={color} />
      {/* small gear counter-rotating */}
      <motion.path
        d={gearPath(19, 7, 3, 6, 1.3)}
        fill={`${color}15`} stroke={color} strokeWidth="1.2" strokeLinejoin="round"
        animate={{ rotate: -360 }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'linear' }}
        style={{ transformOrigin: '19px 7px' }}
      />
      <circle cx="19" cy="7" r="1.2" fill={color} />
    </svg>
  );
};

/** 품질 보증 — 체크마크 드로잉 */
export const IconQuality = ({ color }: { color: string }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    {/* circle */}
    <motion.circle
      cx="12" cy="12" r="9"
      stroke={color} strokeWidth="1.5" fill={`${color}15`}
      animate={{ scale: [1, 1.05, 1] }}
      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      style={{ transformOrigin: '12px 12px' }}
    />
    {/* checkmark path animated */}
    <motion.path
      d="M7 12l3.5 3.5L17 8.5"
      stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      fill="none"
      strokeDasharray="14"
      animate={{ strokeDashoffset: [14, 0, 14] }}
      transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut', repeatDelay: 0.4 }}
    />
  </svg>
);

/** 설비 자산 관리 — 슬라이더 이동 */
export const IconSliders = ({ color }: { color: string }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    {/* track lines */}
    <line x1="2" y1="7" x2="22" y2="7" stroke={color} strokeWidth="1.2" strokeOpacity="0.3" strokeLinecap="round" />
    <line x1="2" y1="12" x2="22" y2="12" stroke={color} strokeWidth="1.2" strokeOpacity="0.3" strokeLinecap="round" />
    <line x1="2" y1="17" x2="22" y2="17" stroke={color} strokeWidth="1.2" strokeOpacity="0.3" strokeLinecap="round" />
    {/* slider handles */}
    <motion.circle
      cx="12" cy="7" r="3"
      fill={`${color}30`} stroke={color} strokeWidth="1.5"
      animate={{ cx: [6, 16, 6] }}
      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
    />
    <motion.circle
      cx="8" cy="12" r="3"
      fill={`${color}30`} stroke={color} strokeWidth="1.5"
      animate={{ cx: [14, 6, 14] }}
      transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
    />
    <motion.circle
      cx="16" cy="17" r="3"
      fill={`${color}30`} stroke={color} strokeWidth="1.5"
      animate={{ cx: [10, 18, 10] }}
      transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
    />
  </svg>
);

/** 운영 관리 — 칸반 카드 이동 */
export const IconKanban = ({ color }: { color: string }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    {/* columns */}
    {[2, 9.5, 17].map((x) => (
      <rect key={x} x={x} y="2" width="5" height="20" rx="1.5"
        fill={`${color}10`} stroke={color} strokeWidth="1" strokeOpacity="0.4" />
    ))}
    {/* static cards */}
    <rect x="3" y="4" width="3" height="4" rx="1" fill={color} opacity="0.6" />
    <rect x="10.5" y="4" width="3" height="4" rx="1" fill={color} opacity="0.4" />
    {/* moving card */}
    <motion.rect
      x="3" y="10" width="3" height="4" rx="1" fill={color}
      animate={{ x: [0, 7.5, 15, 7.5, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', repeatDelay: 0.5 }}
    />
  </svg>
);

// ── Layer 1: Platform ─────────────────────────────────────────────────────────

/** 대시보드 — 타일 순차 등장 */
export const IconDashboard = ({ color }: { color: string }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    {[
      { x: 2, y: 2, w: 10, h: 10, delay: 0 },
      { x: 14, y: 2, w: 8, h: 4, delay: 0.2 },
      { x: 14, y: 8, w: 8, h: 4, delay: 0.4 },
      { x: 2, y: 14, w: 5, h: 8, delay: 0.6 },
      { x: 9, y: 14, w: 6, h: 8, delay: 0.8 },
      { x: 17, y: 14, w: 5, h: 8, delay: 1.0 },
    ].map(({ x, y, w, h, delay }, i) => (
      <motion.rect
        key={i} x={x} y={y} width={w} height={h} rx="2"
        fill={`${color}20`} stroke={color} strokeWidth="1.2"
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ duration: 2.4, repeat: Infinity, delay, ease: 'easeInOut' }}
      />
    ))}
  </svg>
);

/** 워크플로우 — 점 흐름 */
export const IconWorkflow = ({ color }: { color: string }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    {/* fork shape */}
    <path d="M6 4v4M6 8c0 2 2 4 6 4m0 0v4M12 12c0 2-2 4-6 4M18 4v4M18 8c-1 1-3 2-6 4"
      stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.35" fill="none" />
    {/* circles at endpoints */}
    <circle cx="6" cy="3.5" r="1.8" fill={color} opacity="0.5" />
    <circle cx="18" cy="3.5" r="1.8" fill={color} opacity="0.5" />
    <circle cx="6" cy="20.5" r="1.8" fill={color} opacity="0.5" />
    <circle cx="12" cy="20.5" r="1.8" fill={color} opacity="0.5" />
    {/* flowing dot - top to fork */}
    <motion.circle
      cx="6" cy="4" r="2.2" fill={color}
      animate={{
        cx: [6, 6, 12, 12],
        cy: [4, 8, 12, 20],
        opacity: [1, 1, 1, 0],
      }}
      transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut', repeatDelay: 0.3 }}
    />
    {/* second flowing dot - right branch */}
    <motion.circle
      cx="18" cy="4" r="2.2" fill={color}
      animate={{
        cx: [18, 18, 12],
        cy: [4, 8, 12],
        opacity: [0, 1, 0],
      }}
      transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut', delay: 0.8, repeatDelay: 0.3 }}
    />
  </svg>
);

/** 알람 — 흔들리는 벨 */
export const IconBell = ({ color }: { color: string }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    {/* ripple rings */}
    <motion.circle
      cx="12" cy="11" r="9"
      stroke={color} strokeWidth="1"
      animate={{ r: [7, 11], opacity: [0.5, 0] }}
      transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut', repeatDelay: 0.5 }}
    />
    {/* bell body, swinging */}
    <motion.g
      animate={{ rotate: [-12, 12, -12] }}
      transition={{ duration: 0.6, repeat: Infinity, ease: 'easeInOut', repeatDelay: 1.5 }}
      style={{ transformOrigin: '12px 5px' }}
    >
      <path
        d="M12 3c-4 0-6 3-6 6v5l-1.5 2h15L18 14V9c0-3-2-6-6-6z"
        fill={`${color}20`} stroke={color} strokeWidth="1.5" strokeLinejoin="round"
      />
      <line x1="10" y1="20" x2="14" y2="20" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </motion.g>
    {/* clapper dot */}
    <motion.circle
      cx="12" cy="20" r="1.5" fill={color}
      animate={{ scale: [1, 1.3, 1] }}
      transition={{ duration: 0.6, repeat: Infinity, ease: 'easeInOut', repeatDelay: 1.5 }}
      style={{ transformOrigin: '12px 20px' }}
    />
  </svg>
);

/** 리포트 — 줄이 순서대로 나타남 */
export const IconReport = ({ color }: { color: string }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    {/* document bg */}
    <rect x="3" y="2" width="18" height="20" rx="3" fill={`${color}12`} stroke={color} strokeWidth="1.5" />
    {/* lines appearing */}
    {[6, 9, 12, 15, 18].map((y, i) => (
      <motion.line
        key={y}
        x1="7" y1={y} x2={i === 4 ? '14' : '17'} y2={y}
        stroke={color} strokeWidth="1.5" strokeLinecap="round"
        strokeDasharray="12"
        animate={{ strokeDashoffset: [12, 0] }}
        transition={{
          duration: 0.6,
          repeat: Infinity,
          delay: i * 0.25,
          repeatDelay: 1.2,
          ease: 'easeOut',
        }}
      />
    ))}
  </svg>
);

/** API — 코드 브래킷 + 커서 깜빡임 */
export const IconAPI = ({ color }: { color: string }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    {/* < bracket */}
    <motion.path
      d="M10 6L4 12l6 6"
      stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"
      animate={{ x: [-1, 1, -1] }}
      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
    />
    {/* > bracket */}
    <motion.path
      d="M14 6l6 6-6 6"
      stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"
      animate={{ x: [1, -1, 1] }}
      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
    />
    {/* blinking cursor */}
    <motion.line
      x1="12" y1="8" x2="12" y2="16"
      stroke={color} strokeWidth="2" strokeLinecap="round"
      animate={{ opacity: [1, 0, 1] }}
      transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
    />
  </svg>
);