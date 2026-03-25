/**
 * WIZ-Flow 01 프로세스 맵 · 02 핵심 지표 막대 — 도입 전(그레이) / 도입 후(시스템 블루)
 * (막대·범례·플로우 노드/엣지 동일 톤)
 */
export const WIZ_FLOW_METRIC_BEFORE = '#aeaeb2' as const;
export const WIZ_FLOW_METRIC_AFTER = '#007aff' as const;

/**
 * 브랜드 메인 레드·그린 — L자 코너 강조(WizFlowInlineCornerEmphasis) 등
 */
export const WIZ_FLOW_BEFORE = '#B30710' as const;
export const WIZ_FLOW_AFTER = '#34C759' as const;

/** 병합(점선) 엣지 8→4 — 메인 컬러(브랜드 레드), 순차 블루·그레이와 구분 */
export const WIZ_FLOW_METRIC_MERGE_EDGE = WIZ_FLOW_BEFORE;

/** 레거시 병합 표현(브랜드 레드·그린 혼합) — 필요 시 참조 */
export const WIZ_FLOW_MERGE_EDGE = 'color-mix(in srgb, #B30710 42%, #34C759 58%)' as const;
