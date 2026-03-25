/**
 * 장식용 큰따옴표 — Lucide Icons `quote` 경로 기반 (ISC License)
 * @see https://lucide.dev/icons/quote
 * Solid fill로 첨부 디자인에 가깝게 표시합니다.
 */
type QuoteMarkProps = {
  className?: string;
  color?: string;
  'aria-hidden'?: boolean;
};

const OPEN_PATHS = [
  'M16 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z',
  'M5 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z',
] as const;

function DoubleQuoteSvg({
  className,
  color = '#0f172a',
  rotate,
  'aria-hidden': ariaHidden = true,
}: QuoteMarkProps & { rotate?: number }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden={ariaHidden}
      style={
        rotate
          ? { transform: `rotate(${rotate}deg)`, transformOrigin: 'center' }
          : undefined
      }
    >
      {OPEN_PATHS.map((d, i) => (
        <path key={i} d={d} fill={color} />
      ))}
    </svg>
  );
}

/** 본문의 시작 큰따옴표 “(U+201C) 대체 — 인라인 `className`으로 크기 조절 */
export function WizFlowQuoteOpen(props: QuoteMarkProps) {
  return <DoubleQuoteSvg {...props} />;
}

/** 본문의 닫는 큰따옴표 ”(U+201D) 대체 — 180° 회전 */
export function WizFlowQuoteClose(props: QuoteMarkProps) {
  return <DoubleQuoteSvg {...props} rotate={180} />;
}
