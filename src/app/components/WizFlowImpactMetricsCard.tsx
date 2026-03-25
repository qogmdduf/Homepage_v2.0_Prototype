import type { ReactNode } from 'react';

import { WizFlowInlineCornerEmphasis } from './WizFlowInlineCornerEmphasis';
import { WIZ_FLOW_METRIC_AFTER, WIZ_FLOW_METRIC_BEFORE } from './wizFlowOutcomeColors';
import { SmartQuoteMarksOnly } from './SmartQuoteMarks';

/** WIZ-Flow 02. 핵심 지표 — GraphCard·HighlightsCard 공통 셸 (SolutionModal Features/도입 강점 등 재사용) */
export const WIZ_FLOW_IMPACT_INNER_CARD_CLASS =
  'flex flex-col rounded-[22px] bg-white p-5 shadow-[0_2px_16px_rgba(0,0,0,0.06)] sm:p-6';

/** WIZ-Flow 02. 핵심 지표 — 2×2 카드(좌: 전·후 막대 / 우: 핵심 포인트 VOC 스타일) */

/** 애플 스타일 — 도입 전 트랙·막대(01 프로세스 맵 범례와 동일 토큰) */
const BAR_TRACK = '#e5e5ea';
const BAR_BEFORE_FILL = WIZ_FLOW_METRIC_BEFORE;
const BAR_AFTER = WIZ_FLOW_METRIC_AFTER;

type BarMetric = {
  topicKo: string;
  topicEn: string;
  /** 막대 길이 0–100 (시각적 비교용) */
  beforePct: number;
  afterPct: number;
  /** 막대 끝 표시 값 */
  beforeValKo: string;
  beforeValEn: string;
  afterValKo: string;
  afterValEn: string;
};

/** 왼쪽 카드 2개 — 각 3개 항목 (6개 전체) */
const BAR_GROUP_A: BarMetric[] = [
  {
    topicKo: '용지·자료 의존',
    topicEn: 'Paper & materials',
    beforePct: 100,
    afterPct: 8,
    beforeValKo: '100%',
    beforeValEn: '100%',
    afterValKo: '5%',
    afterValEn: '5%',
  },
  {
    topicKo: '데이터 반영 속도',
    topicEn: 'Data latency',
    beforePct: 32,
    afterPct: 100,
    beforeValKo: '2~3일',
    beforeValEn: '2–3d',
    afterValKo: '실시간',
    afterValEn: 'Live',
  },
  {
    topicKo: '운영 가시성',
    topicEn: 'Visibility',
    beforePct: 38,
    afterPct: 100,
    beforeValKo: '분산',
    beforeValEn: 'Siloed',
    afterValKo: '통합',
    afterValEn: 'Unified',
  },
];

const BAR_GROUP_B: BarMetric[] = [
  {
    topicKo: '작업지시 전달',
    topicEn: 'Work orders',
    beforePct: 42,
    afterPct: 100,
    beforeValKo: '출력·반복',
    beforeValEn: 'Print loop',
    afterValKo: '동기',
    afterValEn: 'Synced',
  },
  {
    topicKo: '품질·이력 추적',
    topicEn: 'Traceability',
    beforePct: 35,
    afterPct: 100,
    beforeValKo: '단절',
    beforeValEn: 'Gaps',
    afterValKo: '자동',
    afterValEn: 'Auto',
  },
  {
    topicKo: 'KPI·보고',
    topicEn: 'KPI & reports',
    beforePct: 36,
    afterPct: 100,
    beforeValKo: '지연',
    beforeValEn: 'Lag',
    afterValKo: '즉시',
    afterValEn: 'Instant',
  },
];

/** 인용부: 따옴표만 Noto Serif KR, 안쪽 문구는 Pretendard(상속) */
type VocQuote = {
  prefixKo: string;
  innerKo: string;
  suffixKo: string;
  prefixEn: string;
  innerEn: string;
  suffixEn: string;
};

type VocItem = {
  bodyKo: string;
  bodyEn: string;
  sourceKo: string;
  sourceEn: string;
  /** 표시용 날짜 */
  date: string;
  /** 있으면 bodyKo/En 대신 스마트 따옴표로 인용 구간만 감쌈 */
  quote?: VocQuote;
};

function VocBody({ item, ko }: { item: VocItem; ko: boolean }) {
  if (item.quote) {
    const q = item.quote;
    return (
      <span className="text-[12px] font-normal leading-relaxed tracking-[-0.01em] text-[#1d1d1f] sm:text-[13px]">
        {ko ? q.prefixKo : q.prefixEn}
        <SmartQuoteMarksOnly inner={ko ? q.innerKo : q.innerEn} />
        {ko ? q.suffixKo : q.suffixEn}
      </span>
    );
  }
  return <>{ko ? item.bodyKo : item.bodyEn}</>;
}

const VOC_TOP: VocItem[] = [
  {
    bodyKo: '',
    bodyEn: '',
    quote: {
      prefixKo: '종이 작업지시 없이도 라인이 바로 열리니, ',
      innerKo: '지금 기준이 뭐지?',
      suffixKo: '가 사라졌어요.',
      prefixEn: 'Lines start without paper WOs—no more ',
      innerEn: 'which revision is live?',
      suffixEn: ' on the floor.',
    },
    sourceKo: '현장 리드',
    sourceEn: 'Floor lead',
    date: '24.03.12',
  },
  {
    bodyKo: '전날 엑셀 붙이던 숫자가 이제는 대시에 그대로 올라와요.',
    bodyEn: 'Numbers we used to paste from Excel now land on the dashboard as-is.',
    sourceKo: '생산 관제',
    sourceEn: 'Prod. control',
    date: '24.03.14',
  },
  {
    bodyKo: '라인별 실적이 바로 올라와서 조립 병목이 어디인지 바로 보여요. 반복 확인하던 시간이 줄었습니다.',
    bodyEn: 'Per-station output shows live—we spot assembly bottlenecks fast, with less back-and-forth.',
    sourceKo: '조립 라인',
    sourceEn: 'Assembly',
    date: '24.03.18',
  },
];

const VOC_BOTTOM: VocItem[] = [
  {
    bodyKo: '출력·전달 한 번 줄이니 재작업 호출이 눈에 띄게 줄었습니다.',
    bodyEn: 'Fewer print-and-handoff rounds—rework calls dropped noticeably.',
    sourceKo: '라인 관리',
    sourceEn: 'Line mgr.',
    date: '24.03.15',
  },
  {
    bodyKo: 'LOT만 넣으면 공정 이력이 이어져서 감사 대응이 훨씬 수월해요.',
    bodyEn: 'Enter a LOT and the process trail follows—audits got easier.',
    sourceKo: '품질',
    sourceEn: 'Quality',
    date: '24.03.19',
  },
  {
    bodyKo: '출하 대기랑 재고 수량이 한 화면에 보이니 전화로 물어보던 게 확 줄었어요.',
    bodyEn: "Dock queue and stock on one screen—far fewer calls to check what's ready to ship.",
    sourceKo: '출하·물류',
    sourceEn: 'Ship & logistics',
    date: '24.03.21',
  },
];

type WizFlowImpactMetricsCardProps = { ko: boolean };

function ImpactAdCopy({ ko }: { ko: boolean }) {
  if (ko) {
    return (
      <div className="mx-auto flex max-w-[40rem] flex-col items-center text-center">
        <p
          className="m-0 text-balance text-[16px] font-semibold leading-[1.35] tracking-[-0.03em] text-[#1d1d1f] sm:text-[17px]"
          style={{ wordBreak: 'keep-all' }}
        >
          <WizFlowInlineCornerEmphasis>종이는 줄이고, 시간은 단축하고, 데이터는 더 빠르고 정확하게</WizFlowInlineCornerEmphasis> 활용할 수 있습니다.
        </p>
        <p className="m-0 mt-2 max-w-[34rem] text-[13px] font-normal leading-relaxed tracking-[-0.01em] text-[#86868b] sm:text-[14px]">
          왼쪽은 항목별 <span className="font-semibold text-[#1d1d1f]">도입 전·후</span> 비교, 오른쪽은{' '}
          <span className="font-semibold text-[#1d1d1f]">핵심 지표 포인트</span>입니다.
        </p>
      </div>
    );
  }
  return (
    <div className="mx-auto flex max-w-[40rem] flex-col items-center text-center">
      <p className="m-0 text-balance text-[16px] font-semibold leading-[1.35] tracking-[-0.03em] text-[#1d1d1f] sm:text-[17px]">
        <WizFlowInlineCornerEmphasis>
          Less paper, shorter cycles, and data that&apos;s faster and more accurate
        </WizFlowInlineCornerEmphasis>{' '}
        to use.
      </p>
      <p className="m-0 mt-2 max-w-[34rem] text-[13px] font-normal leading-relaxed tracking-[-0.01em] text-[#86868b] sm:text-[14px]">
        Left: <span className="font-semibold text-[#1d1d1f]">before & after</span> by metric. Right:{' '}
        <span className="font-semibold text-[#1d1d1f]">key highlights</span>.
      </p>
    </div>
  );
}

/** 세로 기준선 + 가로 막대 (참고 이미지 레이아웃) */
function MetricBarBlock({ metric, ko }: { metric: BarMetric; ko: boolean }) {
  const title = ko ? metric.topicKo : metric.topicEn;
  const bVal = ko ? metric.beforeValKo : metric.beforeValEn;
  const aVal = ko ? metric.afterValKo : metric.afterValEn;
  const beforeLbl = ko ? '도입 전' : 'Before';
  const afterLbl = ko ? '도입 후' : 'After';

  return (
    <div className="flex gap-3">
      <div className="mt-0.5 w-px shrink-0 self-stretch rounded-full bg-black/[0.08]" aria-hidden />
      <div className="min-w-0 flex-1 space-y-2.5">
        <p className="m-0 text-center text-[13px] font-semibold leading-tight tracking-[-0.02em] text-[#1d1d1f] sm:text-[14px]">{title}</p>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="w-[3.25rem] shrink-0 text-[10px] font-medium leading-tight text-[#86868b] sm:w-[3.5rem] sm:text-[11px]">{beforeLbl}</span>
            <div className="min-w-0 flex-1">
              <div className="h-2 overflow-hidden rounded-full sm:h-2.5" style={{ background: BAR_TRACK }}>
                <div
                  className="h-full rounded-full transition-[width] duration-500 ease-out"
                  style={{ width: `${metric.beforePct}%`, background: BAR_BEFORE_FILL }}
                />
              </div>
            </div>
            <span className="w-10 shrink-0 text-right text-[10px] font-medium tabular-nums text-[#8e8e93] sm:w-11 sm:text-[11px]">{bVal}</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="w-[3.25rem] shrink-0 text-[10px] font-medium leading-tight text-[#86868b] sm:w-[3.5rem] sm:text-[11px]">{afterLbl}</span>
            <div className="min-w-0 flex-1">
              <div className="h-2 overflow-hidden rounded-full sm:h-2.5" style={{ background: BAR_TRACK }}>
                <div
                  className="h-full rounded-full transition-[width] duration-500 ease-out"
                  style={{ width: `${metric.afterPct}%`, background: BAR_AFTER }}
                />
              </div>
            </div>
            <span className="w-10 shrink-0 text-right text-[10px] font-semibold tabular-nums sm:w-11 sm:text-[11px]" style={{ color: BAR_AFTER }}>
              {aVal}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function GraphCard({ metrics, ko }: { metrics: BarMetric[]; ko: boolean }) {
  return (
    <div
      className={WIZ_FLOW_IMPACT_INNER_CARD_CLASS}
      style={{ WebkitFontSmoothing: 'antialiased' }}
    >
      <div className="flex flex-col gap-8">
        {metrics.map((m) => (
          <MetricBarBlock key={m.topicKo} metric={m} ko={ko} />
        ))}
      </div>
    </div>
  );
}

function VocBubble({ item, ko }: { item: VocItem; ko: boolean }) {
  return (
    <div className="rounded-2xl bg-[#f2f2f7] px-4 py-3.5 sm:px-[18px] sm:py-4">
      <p className="m-0 text-[12px] font-normal leading-relaxed tracking-[-0.01em] text-[#1d1d1f] sm:text-[13px]">
        <VocBody item={item} ko={ko} />
      </p>
      <p className="m-0 mt-2.5 text-[10px] font-medium text-[#aeaeb2] sm:text-[11px]">
        {ko ? item.sourceKo : item.sourceEn} · {item.date}
      </p>
    </div>
  );
}

function HighlightsCard({ items, footerKo, footerEn, titleKo, titleEn, ko }: {
  items: VocItem[];
  footerKo: string;
  footerEn: string;
  titleKo: string;
  titleEn: string;
  ko: boolean;
}) {
  return (
    <div
      className={WIZ_FLOW_IMPACT_INNER_CARD_CLASS}
      style={{ WebkitFontSmoothing: 'antialiased' }}
    >
      <h4 className="m-0 mb-4 text-center text-[13px] font-semibold tracking-[-0.02em] text-[#1d1d1f] sm:mb-5 sm:text-[14px]">
        {ko ? titleKo : titleEn}
      </h4>
      <div className="flex flex-col gap-3">
        {items.map((item, i) => (
          <VocBubble key={i} item={item} ko={ko} />
        ))}
      </div>
      <p className="m-0 mt-5 border-t border-black/[0.06] pt-4 text-[12px] font-semibold leading-snug tracking-[-0.01em] text-[#1d1d1f] sm:text-[13px]">
        <span className="mr-1.5 font-bold text-[#007aff]">&gt;</span>
        {ko ? footerKo : footerEn}
      </p>
    </div>
  );
}

/** 02. 핵심 지표 */
export function WizFlowImpactMetricsCard({ ko }: WizFlowImpactMetricsCardProps) {
  return (
    <div className="flex flex-col">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-black/[0.06] px-4 py-2.5 sm:px-6">
        <h3 className="m-0 flex min-w-0 flex-1 flex-wrap items-baseline gap-0 text-[17px] font-semibold leading-[1.25] tracking-tight">
          <span className="shrink-0 tabular-nums font-semibold" style={{ color: '#c7c7cc' }}>
            02
          </span>
          <span className="shrink-0 font-semibold" style={{ color: '#c7c7cc' }}>.&nbsp; </span>
          <span className="min-w-0 font-semibold" style={{ color: '#1d1d1f' }}>
            {ko ? '핵심 지표' : 'Impact metrics'}
          </span>
        </h3>
        <div className="flex flex-wrap items-center gap-3 text-[9px] text-[#86868b]">
          <span className="inline-flex items-center gap-1">
            <span className="h-2 w-4 rounded-sm bg-[#aeaeb2]" />
            {ko ? '도입 전' : 'Before'}
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="h-2 w-4 rounded-sm" style={{ background: BAR_AFTER }} />
            {ko ? '도입 후' : 'After'}
          </span>
        </div>
      </div>

      {/* 01. 프로세스 맵(WizFlowKeyOutcomeFlow) 상단 카피 스트립과 동일 톤 */}
      <div className="border-b border-slate-200/50 bg-gradient-to-b from-slate-50/40 to-white px-4 py-4 sm:px-6 sm:py-5">
        <ImpactAdCopy ko={ko} />
      </div>

      {/* 본문: 01의 플로우 영역처럼 카드(부모 bg-white/80) 배경이 그대로 보이도록 */}
      <div className="px-4 py-5 sm:px-6 sm:py-6">
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
          <GraphCard metrics={BAR_GROUP_A} ko={ko} />
          <HighlightsCard
            ko={ko}
            titleKo="핵심 지표 포인트"
            titleEn="Key highlights"
            items={VOC_TOP}
            footerKo="도입 이후 용지·데이터·가시성에서 체감 변화가 동시에 나타납니다."
            footerEn="After rollout, teams feel shifts in paper use, data speed, and visibility together."
          />
          <GraphCard metrics={BAR_GROUP_B} ko={ko} />
          <HighlightsCard
            ko={ko}
            titleKo="핵심 지표 포인트"
            titleEn="Key highlights"
            items={VOC_BOTTOM}
            footerKo="작업 흐름·이력·보고까지 한 번에 묶이면서 운영 리듬이 빨라집니다."
            footerEn="Work flow, traceability, and reporting align—ops rhythm gets faster."
          />
        </div>
      </div>

      <p className="border-t border-black/[0.08] bg-white/35 px-4 py-4 text-center text-[13px] font-medium leading-relaxed text-[#6e6e73] sm:px-6 sm:text-[14px]">
        {ko
          ? '지표·막대 길이는 설명을 위한 상대 비교이며, 도입 범위에 따라 달라질 수 있습니다.'
          : 'Bar lengths are relative for illustration; actuals vary by rollout scope.'}
      </p>
    </div>
  );
}
