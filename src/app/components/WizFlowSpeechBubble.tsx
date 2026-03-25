import { useId, useLayoutEffect, useRef, useState, type ReactNode } from 'react';

const VIEW_W = 400;
/** 본체 시작 y (꼬리 높이와 맞춤) */
const BODY_TOP = 20;
const CORNER_RX = 16;
const PAD_TOP = 10;
const PAD_BOTTOM = 14;
const PAD_X = 22;

export type WizFlowSpeechBubbleKind = 'problem' | 'solution';

/**
 * SVG 삼각 꼬리 + 라운드 본체 + feDropShadow + 그라데이션
 * (정적 에셋 `src/assets/pfos/pfos-speech-bubble-*.svg`와 동일한 구조)
 */
export function WizFlowSpeechBubble({
  kind,
  children,
}: {
  kind: WizFlowSpeechBubbleKind;
  children: ReactNode;
}) {
  const uid = useId().replace(/:/g, '');
  const fid = `wiz-flow-bubble-shadow-${uid}`;
  const gid = `wiz-flow-bubble-grad-${uid}`;
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentH, setContentH] = useState(48);

  useLayoutEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    const measure = () => {
      const h = el.getBoundingClientRect().height;
      setContentH(Math.max(32, Math.ceil(h)));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [children]);

  const svgH = BODY_TOP + PAD_TOP + contentH + PAD_BOTTOM;
  const rectH = svgH - BODY_TOP;

  const isProblem = kind === 'problem';
  const textClass = isProblem ? 'text-slate-800' : 'text-white';
  const stops = isProblem
    ? [
        { off: '0%', c: '#F8FAFC' },
        { off: '45%', c: '#EEF2F6' },
        { off: '100%', c: '#E2E8F0' },
      ]
    : [
        { off: '0%', c: '#93C5FD' },
        { off: '40%', c: '#3B82F6' },
        { off: '100%', c: '#2563EB' },
      ];

  return (
    <div className="relative mt-3 w-full">
      <svg
        className="block h-auto w-full select-none"
        viewBox={`0 0 ${VIEW_W} ${svgH}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <defs>
          <filter id={fid} x="-8%" y="-8%" width="116%" height="116%" colorInterpolationFilters="sRGB">
            <feGaussianBlur in="SourceAlpha" stdDeviation="1.4" result="blur" />
            <feOffset in="blur" dy="2" result="off" />
            <feFlood floodColor="#0f172a" floodOpacity="0.12" result="c" />
            <feComposite in="c" in2="off" operator="in" result="sh" />
            <feGaussianBlur in="SourceAlpha" stdDeviation="3" result="b2" />
            <feOffset in="b2" dy="6" result="off2" />
            <feFlood floodColor="#0f172a" floodOpacity="0.06" result="c2" />
            <feComposite in="c2" in2="off2" operator="in" result="sh2" />
            <feMerge>
              <feMergeNode in="sh2" />
              <feMergeNode in="sh" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id={gid} x1="200" y1="0" x2="200" y2={svgH} gradientUnits="userSpaceOnUse">
            {stops.map((s) => (
              <stop key={s.off} offset={s.off} stopColor={s.c} />
            ))}
          </linearGradient>
        </defs>
        <g filter={`url(#${fid})`}>
          {/* 꼬리 — 본체와 동일 fill */}
          <path
            d="M 56 0 L 40 20 L 72 20 Z"
            fill={`url(#${gid})`}
          />
          <rect
            x="0"
            y={BODY_TOP}
            width={VIEW_W}
            height={rectH}
            rx={CORNER_RX}
            fill={`url(#${gid})`}
          />
        </g>
      </svg>

      <div
        className="absolute left-0 right-0 z-10"
        style={{
          top: BODY_TOP + PAD_TOP,
          paddingLeft: PAD_X,
          paddingRight: PAD_X,
          paddingBottom: PAD_BOTTOM,
        }}
      >
        <div ref={contentRef} className={`text-[13px] font-medium leading-relaxed sm:text-[14px] ${textClass}`}>
          {children}
        </div>
      </div>
    </div>
  );
}
