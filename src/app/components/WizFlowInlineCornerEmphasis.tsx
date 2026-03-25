import type { ReactNode } from 'react';

import { WIZ_FLOW_BEFORE } from './wizFlowOutcomeColors';

/**
 * 02. 핵심 지표 ImpactAdCopy와 동일 — 좌상·우하 L자 코너 + 브랜드 레드 볼드
 * (WIZ_FLOW_BEFORE = #B30710)
 */
export function WizFlowInlineCornerEmphasis({ children }: { children: ReactNode }) {
  const c = WIZ_FLOW_BEFORE;
  const arm = 'h-[10px] w-[10px] sm:h-2.5 sm:w-2.5';
  return (
    <span className="relative mx-0.5 inline-block max-w-full px-1 py-0.5 text-balance sm:px-1.5">
      <span
        className={`pointer-events-none absolute left-0 top-0 ${arm} border-l-[1.5px] border-t-[1.5px] sm:border-l-2 sm:border-t-2`}
        style={{ borderLeftColor: c, borderTopColor: c }}
        aria-hidden
      />
      <span
        className={`pointer-events-none absolute bottom-0 right-0 ${arm} border-b-[1.5px] border-r-[1.5px] sm:border-b-2 sm:border-r-2`}
        style={{ borderBottomColor: c, borderRightColor: c }}
        aria-hidden
      />
      <span
        className="relative z-10 block text-[16px] font-bold leading-snug tracking-[-0.03em] sm:text-[17px]"
        style={{ color: c, fontFamily: "ui-sans-serif, system-ui, 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif" }}
      >
        {children}
      </span>
    </span>
  );
}
