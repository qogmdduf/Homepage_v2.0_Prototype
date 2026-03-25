/** 스마트 따옴표(U+201C/U+201D) 글리프만 Noto Serif KR — 안쪽 텍스트는 부모 폰트(예: Pretendard) */

export const QUOTE_MARK_FONT_NOTO_SERIF = "'Noto Serif KR', serif";

export function SmartQuoteMarksOnly({ inner }: { inner: string }) {
  return (
    <>
      <span className="text-inherit" style={{ fontFamily: QUOTE_MARK_FONT_NOTO_SERIF }}>
        {'\u201C'}
      </span>
      {inner}
      <span className="text-inherit" style={{ fontFamily: QUOTE_MARK_FONT_NOTO_SERIF }}>
        {'\u201D'}
      </span>
    </>
  );
}
