/**
 * WIZ-Flow 모달 페이지 콘텐츠를 16:9(1920×1080) 슬라이드로 재구성한 시스템 소개 PDF.
 * Playwright가 `[data-brochure-slide]` 단위로 캡처 → pdf-lib로 합칩니다.
 *
 *   pnpm generate:wiz-flow-pdf
 */
import type { ReactNode } from 'react';
import { solutions, type Solution } from '../data/solutions';
import wizSymbol from '../../assets/symbol.svg';
import dashboardImg from '../../assets/pfos-dashboard.png';
import tabletImg from '../../assets/pfos-tablet.png';
import mobileImg from '../../assets/pfos-mobile.png';

/* ─── design tokens ─── */
const BRAND = '#B30710';
const TEXT = '#1d1d1f';
const MUTED = '#86868b';
const SUBTLE = '#3d3d3f';
const W = 1920;
const H = 1080;
const PAD = 56;

const FONT =
  "'Noto Sans KR', 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif";

/* ─── reusable layout ─── */
function Slide({
  n,
  bg,
  children,
}: {
  n: number;
  bg?: string;
  children: ReactNode;
}) {
  return (
    <div
      data-brochure-slide={n}
      style={{
        width: W,
        height: H,
        boxSizing: 'border-box',
        padding: PAD,
        background: bg ?? (n % 2 === 1 ? '#ffffff' : '#f5f6f8'),
        position: 'relative',
        fontFamily: FONT,
        color: TEXT,
        WebkitFontSmoothing: 'antialiased',
        overflow: 'hidden',
      }}
    >
      {children}
      <span
        style={{
          position: 'absolute',
          bottom: 20,
          right: PAD,
          fontSize: 11,
          color: '#c7c7cc',
        }}
      >
        {n} / 9
      </span>
    </div>
  );
}

function SectionHead({
  n,
  title,
  subtitle,
}: {
  n: number;
  title: string;
  subtitle?: string;
}) {
  return (
    <header style={{ marginBottom: 32 }}>
      <p
        style={{
          margin: 0,
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: '0.12em',
          color: BRAND,
          marginBottom: 6,
        }}
      >
        SECTION {String(n).padStart(2, '0')}
      </p>
      <h1
        style={{
          margin: 0,
          fontSize: 40,
          fontWeight: 800,
          letterSpacing: '-0.03em',
          lineHeight: 1.15,
        }}
      >
        {title}
      </h1>
      {subtitle && (
        <p
          style={{
            margin: '10px 0 0',
            fontSize: 18,
            fontWeight: 500,
            color: MUTED,
            maxWidth: 920,
            lineHeight: 1.45,
          }}
        >
          {subtitle}
        </p>
      )}
      <div
        style={{
          width: 64,
          height: 4,
          background: BRAND,
          marginTop: 16,
          borderRadius: 2,
        }}
      />
    </header>
  );
}

/* ─── static data mirroring SolutionModal internals ─── */
const BAR_DATA = [
  { label: '용지 사용', before: 100, after: 5, upIsGood: false },
  { label: '행정 효율', before: 38, after: 70, upIsGood: true },
  { label: '데이터 수집', before: 100, after: 30, upIsGood: false },
  { label: '불량 대응', before: 75, after: 50, upIsGood: false },
];

const COMPARE_QA = [
  {
    title: '작업지시 · 디지털 배포',
    q: '작업지시를 또 인쇄해서 나눠줘야 하나요?',
    a: '디지털 작업지시가 즉시 현장으로 갑니다.',
  },
  {
    title: '현장 입력 · 이중 작업',
    q: '현장에서 적은 걸 전산에 또 넣어야 하나요?',
    a: '현장에서 바로 입력하면 자동 집계됩니다.',
  },
  {
    title: '표준 개정 · 현장 반영',
    q: '표준을 바꿨는데, 현장까지 언제 반영되나요?',
    a: '개정 즉시 현장에 적용·이력이 남습니다.',
  },
  {
    title: '실적 · 실시간 가시성',
    q: '실적은 내일이나 되어야 볼 수 있나요?',
    a: '입력 순간 실시간 집계·시각화됩니다.',
  },
  {
    title: '이상 대응 · 워크플로',
    q: '이상이 발생하면 누가 언제 어떻게 대응하나요?',
    a: '알림·배정·조치·이력이 자동으로 이어집니다.',
  },
  {
    title: 'SOP · 품질 일관성',
    q: '라인마다 기준이 달라 품질이 들쑥날쑥합니다.',
    a: 'SOP 단일 관리로 전 라인 동일 기준을 유지합니다.',
  },
];

function parseFeature(line: string) {
  const [t, s] = line.split('||');
  return { title: t?.trim() ?? line, sub: s?.trim() ?? '' };
}

/* ─── page component ─── */
export function WizFlowBrochureCapturePage() {
  const s = solutions.find((x) => x.id === 'wiz-flow') as Solution | undefined;
  if (!s?.wizFlowKpiCards) {
    return (
      <div style={{ padding: 48, fontFamily: 'sans-serif' }}>
        WIZ-Flow 데이터를 불러올 수 없습니다.
      </div>
    );
  }

  const kpi = s.wizFlowKpiCards.slice(0, 4);
  const modules = s.modules ?? [];
  const features = s.features ?? [];
  const highlights = s.highlights ?? [];
  const stories = s.useCaseStories ?? [];
  const metrics = s.metrics ?? [];

  return (
    <div
      className="wizflow-brochure-capture"
      style={{
        minWidth: W,
        background: '#e8eaed',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 0,
        paddingBottom: 24,
      }}
    >
      {/* ══════════════════════════════════════════════
          SLIDE 1 — 시스템 소개 (Hero)
         ══════════════════════════════════════════════ */}
      <Slide n={1}>
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <SectionHead
            n={1}
            title="시스템 소개"
            subtitle="글로벌 제조 현장의 디지털 전환을 위한 스마트팩토리 운영 플랫폼"
          />
          <div
            style={{
              display: 'flex',
              gap: 48,
              flex: 1,
              minHeight: 0,
              alignItems: 'flex-start',
            }}
          >
            {/* left: text */}
            <div style={{ flex: '1 1 50%', minWidth: 0 }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  marginBottom: 24,
                }}
              >
                <img
                  src={wizSymbol}
                  alt=""
                  width={52}
                  height={52}
                  style={{ flexShrink: 0 }}
                />
                <div>
                  <p
                    style={{
                      margin: 0,
                      fontSize: 34,
                      fontWeight: 900,
                      letterSpacing: '-0.03em',
                    }}
                  >
                    WIZ-Flow
                  </p>
                  <p
                    style={{
                      margin: '4px 0 0',
                      fontSize: 16,
                      color: MUTED,
                      fontWeight: 600,
                    }}
                  >
                    {s.subtitle}
                  </p>
                </div>
              </div>
              <p
                style={{
                  fontSize: 17,
                  lineHeight: 1.65,
                  margin: '0 0 16px',
                  fontWeight: 500,
                }}
              >
                {s.description}
              </p>
              <p
                style={{
                  fontSize: 15,
                  lineHeight: 1.65,
                  margin: 0,
                  color: SUBTLE,
                }}
              >
                {s.detailedDescription}
              </p>
              <div
                style={{
                  marginTop: 24,
                  display: 'inline-flex',
                  gap: 10,
                  padding: '8px 16px',
                  borderRadius: 999,
                  background: `${BRAND}10`,
                  border: `1px solid ${BRAND}33`,
                  fontSize: 13,
                  fontWeight: 700,
                  color: BRAND,
                }}
              >
                적용 사례 · LG전자 생산현장 운영
              </div>
            </div>
            {/* right: screenshot */}
            <div
              style={{
                flex: '1 1 50%',
                borderRadius: 18,
                overflow: 'hidden',
                border: '1px solid rgba(0,0,0,0.08)',
                boxShadow: '0 20px 50px rgba(0,0,0,0.12)',
                alignSelf: 'stretch',
                maxHeight: 700,
              }}
            >
              <img
                src={dashboardImg}
                alt=""
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'top center',
                  display: 'block',
                }}
              />
            </div>
          </div>
        </div>
      </Slide>

      {/* ══════════════════════════════════════════════
          SLIDE 2 — 핵심 KPI 대시보드 (도입 전·후)
         ══════════════════════════════════════════════ */}
      <Slide n={2}>
        <SectionHead
          n={2}
          title="핵심 KPI 대시보드"
          subtitle="4대 핵심 영역별 도입 전·후(AS-IS → TO-BE)를 한눈에 비교합니다."
        />
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 22,
          }}
        >
          {kpi.map((card, i) => (
            <div
              key={i}
              style={{
                background: '#fff',
                borderRadius: 16,
                border: '1px solid rgba(0,0,0,0.07)',
                padding: '20px 24px',
                boxShadow: '0 6px 24px rgba(0,0,0,0.05)',
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                }}
              >
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 800,
                    color: BRAND,
                    letterSpacing: '0.08em',
                  }}
                >
                  {card.category}
                </span>
                <span
                  style={{ fontSize: 20, fontWeight: 900, color: BRAND }}
                >
                  {card.badgePct}
                </span>
              </div>
              <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800 }}>
                {card.title}
              </h3>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 10,
                  flex: 1,
                }}
              >
                <div
                  style={{
                    background: '#fafafa',
                    borderRadius: 10,
                    padding: '12px 14px',
                    border: '1px solid rgba(0,0,0,0.04)',
                  }}
                >
                  <p
                    style={{
                      margin: '0 0 4px',
                      fontSize: 10,
                      fontWeight: 800,
                      color: MUTED,
                    }}
                  >
                    AS-IS
                  </p>
                  <p
                    style={{
                      margin: 0,
                      fontSize: 13,
                      lineHeight: 1.45,
                      whiteSpace: 'pre-line',
                    }}
                  >
                    {card.asIs}
                  </p>
                </div>
                <div
                  style={{
                    background: `${BRAND}08`,
                    borderRadius: 10,
                    padding: '12px 14px',
                    border: `1px solid ${BRAND}22`,
                  }}
                >
                  <p
                    style={{
                      margin: '0 0 4px',
                      fontSize: 10,
                      fontWeight: 800,
                      color: BRAND,
                    }}
                  >
                    TO-BE
                  </p>
                  <p
                    style={{
                      margin: 0,
                      fontSize: 13,
                      lineHeight: 1.45,
                      whiteSpace: 'pre-line',
                      fontWeight: 600,
                    }}
                  >
                    {card.toBe}
                  </p>
                </div>
              </div>
              <p
                style={{
                  margin: 0,
                  fontSize: 12,
                  fontWeight: 700,
                  color: BRAND,
                }}
              >
                성과: {card.resultLine}
              </p>
            </div>
          ))}
        </div>
      </Slide>

      {/* ══════════════════════════════════════════════
          SLIDE 3 — 데이터로 보는 변화
         ══════════════════════════════════════════════ */}
      <Slide n={3}>
        <SectionHead
          n={3}
          title="데이터로 보는 변화"
          subtitle="위즈팩토리 스마트팩토리 실제 적용 데이터를 기반으로 합니다."
        />
        <div style={{ display: 'flex', gap: 36, height: 760 }}>
          {/* left: bar chart */}
          <div
            style={{
              flex: '1 1 55%',
              background: '#fff',
              borderRadius: 20,
              padding: '28px 32px',
              border: '1px solid rgba(0,0,0,0.06)',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <h3
              style={{
                margin: '0 0 8px',
                fontSize: 18,
                fontWeight: 700,
              }}
            >
              4대 핵심 지표 도입 전·후
            </h3>
            <p
              style={{
                margin: '0 0 28px',
                fontSize: 13,
                color: MUTED,
              }}
            >
              막대 길이 = 표시된 % (0–100 동일 스케일)
            </p>
            <div
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                gap: 32,
                justifyContent: 'center',
              }}
            >
              {BAR_DATA.map((d) => {
                const delta = d.upIsGood
                  ? d.after - d.before
                  : d.before - d.after;
                const sign = delta >= 0 ? '+' : '';
                return (
                  <div key={d.label}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 14,
                        marginBottom: 10,
                      }}
                    >
                      <span
                        style={{
                          width: 90,
                          fontSize: 14,
                          fontWeight: 600,
                          color: MUTED,
                        }}
                      >
                        {d.label}
                      </span>
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          color: delta >= 0 ? '#34C759' : '#FF3B30',
                          background:
                            delta >= 0
                              ? 'rgba(52,199,89,0.1)'
                              : 'rgba(255,59,48,0.08)',
                          padding: '2px 8px',
                          borderRadius: 999,
                        }}
                      >
                        {sign}
                        {delta}%
                      </span>
                    </div>
                    {/* before bar */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        marginBottom: 6,
                      }}
                    >
                      <span
                        style={{
                          width: 20,
                          fontSize: 11,
                          fontWeight: 600,
                          color: '#FF6B6B',
                        }}
                      >
                        전
                      </span>
                      <div
                        style={{
                          flex: 1,
                          height: 10,
                          borderRadius: 999,
                          background: '#E5E5EA',
                          overflow: 'hidden',
                        }}
                      >
                        <div
                          style={{
                            width: `${d.before}%`,
                            height: '100%',
                            borderRadius: 999,
                            background:
                              'linear-gradient(90deg, #FF3B30, #FF6B6B)',
                          }}
                        />
                      </div>
                      <span
                        style={{
                          width: 40,
                          fontSize: 12,
                          fontWeight: 600,
                          color: '#FF3B30',
                        }}
                      >
                        {d.before}%
                      </span>
                    </div>
                    {/* after bar */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                      }}
                    >
                      <span
                        style={{
                          width: 20,
                          fontSize: 11,
                          fontWeight: 600,
                          color: '#34C759',
                        }}
                      >
                        후
                      </span>
                      <div
                        style={{
                          flex: 1,
                          height: 10,
                          borderRadius: 999,
                          background: '#E5E5EA',
                          overflow: 'hidden',
                        }}
                      >
                        <div
                          style={{
                            width: `${d.after}%`,
                            height: '100%',
                            borderRadius: 999,
                            background:
                              'linear-gradient(90deg, #34C759, #66D97A)',
                          }}
                        />
                      </div>
                      <span
                        style={{
                          width: 40,
                          fontSize: 12,
                          fontWeight: 700,
                          color: '#34C759',
                        }}
                      >
                        {d.after}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
            {/* legend */}
            <div
              style={{
                display: 'flex',
                gap: 24,
                borderTop: '1px solid rgba(0,0,0,0.06)',
                paddingTop: 16,
                marginTop: 16,
              }}
            >
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  fontSize: 12,
                  fontWeight: 500,
                }}
              >
                <span
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: 3,
                    background: 'linear-gradient(90deg, #FF3B30, #FF6B6B)',
                  }}
                />
                도입 전
              </span>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  fontSize: 12,
                  fontWeight: 500,
                }}
              >
                <span
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: 3,
                    background: 'linear-gradient(90deg, #34C759, #66D97A)',
                  }}
                />
                도입 후
              </span>
            </div>
          </div>

          {/* right: donut + key metrics */}
          <div
            style={{
              flex: '1 1 45%',
              display: 'flex',
              flexDirection: 'column',
              gap: 20,
            }}
          >
            {/* donut */}
            <div
              style={{
                background: '#fff',
                borderRadius: 20,
                padding: 32,
                border: '1px solid rgba(0,0,0,0.06)',
                flex: '1 1 55%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg width={200} height={200} viewBox="0 0 200 200">
                <circle
                  cx={100}
                  cy={100}
                  r={80}
                  fill="none"
                  stroke="#E5E5EA"
                  strokeWidth={20}
                />
                <circle
                  cx={100}
                  cy={100}
                  r={80}
                  fill="none"
                  stroke={BRAND}
                  strokeWidth={20}
                  strokeDasharray={`${2 * Math.PI * 80 * 0.95} ${2 * Math.PI * 80}`}
                  strokeLinecap="round"
                  transform="rotate(-90 100 100)"
                />
                <text
                  x={100}
                  y={92}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  style={{
                    fontSize: 48,
                    fontWeight: 900,
                    fill: BRAND,
                    fontFamily: FONT,
                  }}
                >
                  95%
                </text>
                <text
                  x={100}
                  y={126}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    fill: MUTED,
                    fontFamily: FONT,
                  }}
                >
                  용지 절감율
                </text>
              </svg>
            </div>
            {/* metrics grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 14,
                flex: '1 1 45%',
              }}
            >
              {metrics.map((m, i) => (
                <div
                  key={i}
                  style={{
                    background: '#fff',
                    borderRadius: 14,
                    padding: '18px 16px',
                    border: '1px solid rgba(0,0,0,0.06)',
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <p
                    style={{
                      margin: '0 0 6px',
                      fontSize: 32,
                      fontWeight: 900,
                      color: BRAND,
                      lineHeight: 1,
                    }}
                  >
                    {m.value}
                    {m.suffix}
                  </p>
                  <p
                    style={{
                      margin: 0,
                      fontSize: 13,
                      fontWeight: 600,
                      color: SUBTLE,
                    }}
                  >
                    {m.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Slide>

      {/* ══════════════════════════════════════════════
          SLIDE 4 — 현장에서 무엇이 달라지나요 (Q&A)
         ══════════════════════════════════════════════ */}
      <Slide n={4}>
        <SectionHead
          n={4}
          title="현장에서 무엇이 달라지나요"
          subtitle="현장의 질문에 WIZ-Flow가 어떻게 답하는지, 6가지 대화로 살펴보세요."
        />
        <div
          style={{
            display: 'flex',
            gap: 12,
            marginBottom: 24,
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: '0.1em',
            color: MUTED,
          }}
        >
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <span
              style={{
                width: 12,
                height: 12,
                borderRadius: 999,
                background: '#E9E9EB',
              }}
            />
            도입 전 · 현장의 고민
          </span>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <span
              style={{
                width: 12,
                height: 12,
                borderRadius: 999,
                background: `${BRAND}18`,
                border: `1px solid ${BRAND}44`,
              }}
            />
            도입 후 · WIZ-Flow의 답
          </span>
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 18,
          }}
        >
          {COMPARE_QA.map((row, i) => (
            <div
              key={i}
              style={{
                background: '#fff',
                borderRadius: 16,
                overflow: 'hidden',
                border: '1px solid rgba(0,0,0,0.06)',
                boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
              }}
            >
              {/* header */}
              <div
                style={{
                  padding: '12px 18px',
                  borderBottom: '1px solid rgba(0,0,0,0.05)',
                  background: '#FAFAFA',
                }}
              >
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: '#c7c7cc',
                    marginRight: 8,
                  }}
                >
                  {String(i + 1).padStart(2, '0')}.
                </span>
                <span style={{ fontSize: 15, fontWeight: 700 }}>
                  {row.title}
                </span>
              </div>
              <div
                style={{
                  padding: '14px 18px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10,
                }}
              >
                {/* question */}
                <div
                  style={{
                    background: '#E9E9EB',
                    borderRadius: 14,
                    borderTopLeft: '4px',
                    padding: '10px 14px',
                    fontSize: 13,
                    lineHeight: 1.45,
                    color: TEXT,
                    fontWeight: 500,
                  }}
                >
                  {row.q}
                </div>
                {/* answer */}
                <div
                  style={{
                    background: `${BRAND}0C`,
                    border: `1px solid ${BRAND}28`,
                    borderRadius: 14,
                    padding: '10px 14px',
                    fontSize: 13,
                    lineHeight: 1.45,
                    color: TEXT,
                    fontWeight: 600,
                  }}
                >
                  {row.a}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Slide>

      {/* ══════════════════════════════════════════════
          SLIDE 5 — 프로세스 흐름 & 핵심 지표
         ══════════════════════════════════════════════ */}
      <Slide n={5}>
        <SectionHead
          n={5}
          title="프로세스 맵 · 핵심 지표"
          subtitle="도입 전후 업무 흐름과 계량화된 개선 지표입니다."
        />
        {(() => {
          const before = [
            '종이·출력 작업지시',
            '분산 채널 입력·승인',
            '엑셀·수기 집계',
            '지연된 현장 대응',
          ];
          const after = [
            '디지털 작업지시·전자 서명',
            '통합 화면 워크플로',
            'PLC·MES 실시간 반영',
            '알림·자동 배정·이력',
          ];
          return (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 28,
              }}
            >
              {/* process map */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'stretch',
                  gap: 20,
                  background: '#fff',
                  borderRadius: 18,
                  padding: '24px 28px',
                  border: '1px solid rgba(0,0,0,0.07)',
                }}
              >
                <div
                  style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 10,
                  }}
                >
                  <p
                    style={{
                      margin: 0,
                      fontSize: 12,
                      fontWeight: 800,
                      color: MUTED,
                      letterSpacing: '0.06em',
                    }}
                  >
                    도입 전
                  </p>
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: 10,
                      alignItems: 'center',
                    }}
                  >
                    {before.map((step, i) => (
                      <span
                        key={i}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 10,
                        }}
                      >
                        <span
                          style={{
                            padding: '8px 14px',
                            background: '#f1f5f9',
                            borderRadius: 10,
                            fontSize: 13,
                            fontWeight: 700,
                            border: '1px solid rgba(0,0,0,0.06)',
                          }}
                        >
                          {step}
                        </span>
                        {i < before.length - 1 && (
                          <span
                            style={{
                              color: '#c7c7cc',
                              fontSize: 16,
                              fontWeight: 700,
                            }}
                          >
                            →
                          </span>
                        )}
                      </span>
                    ))}
                  </div>
                </div>
                <div
                  style={{
                    width: 80,
                    flexShrink: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 14,
                    fontWeight: 900,
                    color: '#fff',
                    background: `linear-gradient(160deg, ${BRAND}, #8b0510)`,
                    borderRadius: 14,
                    writingMode: 'vertical-rl',
                    textOrientation: 'mixed',
                    letterSpacing: '0.15em',
                  }}
                >
                  WIZ-Flow
                </div>
                <div
                  style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 10,
                  }}
                >
                  <p
                    style={{
                      margin: 0,
                      fontSize: 12,
                      fontWeight: 800,
                      color: BRAND,
                      letterSpacing: '0.06em',
                    }}
                  >
                    도입 후
                  </p>
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: 10,
                      alignItems: 'center',
                    }}
                  >
                    {after.map((step, i) => (
                      <span
                        key={i}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 10,
                        }}
                      >
                        <span
                          style={{
                            padding: '8px 14px',
                            background: `${BRAND}12`,
                            borderRadius: 10,
                            fontSize: 13,
                            fontWeight: 700,
                            border: `1px solid ${BRAND}30`,
                          }}
                        >
                          {step}
                        </span>
                        {i < after.length - 1 && (
                          <span
                            style={{
                              color: BRAND,
                              fontSize: 16,
                              fontWeight: 700,
                            }}
                          >
                            →
                          </span>
                        )}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              {/* KPI grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: 18,
                }}
              >
                {metrics.map((m, i) => (
                  <div
                    key={i}
                    style={{
                      background: '#fff',
                      borderRadius: 16,
                      padding: '28px 20px',
                      border: '1px solid rgba(0,0,0,0.06)',
                      textAlign: 'center',
                    }}
                  >
                    <p
                      style={{
                        margin: '0 0 10px',
                        fontSize: 38,
                        fontWeight: 900,
                        color: BRAND,
                        lineHeight: 1,
                      }}
                    >
                      {m.value}
                      {m.suffix}
                    </p>
                    <p
                      style={{
                        margin: 0,
                        fontSize: 14,
                        fontWeight: 700,
                        color: SUBTLE,
                      }}
                    >
                      {m.label}
                    </p>
                  </div>
                ))}
              </div>
              {/* KPI detail cards */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: 16,
                }}
              >
                {kpi.map((card, i) => (
                  <div
                    key={i}
                    style={{
                      background: '#fff',
                      borderRadius: 14,
                      padding: '16px 18px',
                      border: '1px solid rgba(0,0,0,0.06)',
                      borderTop: `3px solid ${BRAND}`,
                    }}
                  >
                    <p
                      style={{
                        margin: '0 0 4px',
                        fontSize: 10,
                        fontWeight: 800,
                        color: BRAND,
                        letterSpacing: '0.08em',
                      }}
                    >
                      {card.category}
                    </p>
                    <p
                      style={{
                        margin: '0 0 8px',
                        fontSize: 14,
                        fontWeight: 800,
                      }}
                    >
                      {card.title}
                    </p>
                    <p
                      style={{
                        margin: 0,
                        fontSize: 12,
                        lineHeight: 1.4,
                        whiteSpace: 'pre-line',
                        color: SUBTLE,
                      }}
                    >
                      {card.processStep}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          );
        })()}
      </Slide>

      {/* ══════════════════════════════════════════════
          SLIDE 6 — 현장 통합 모니터링
         ══════════════════════════════════════════════ */}
      <Slide n={6}>
        <SectionHead
          n={6}
          title="현장 통합 모니터링"
          subtitle="관제·현장·모바일까지 동일 데이터로 연결된 대표 화면입니다."
        />
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.4fr 1fr 0.7fr',
            gap: 20,
            alignItems: 'end',
            height: 760,
          }}
        >
          <div
            style={{
              borderRadius: 16,
              overflow: 'hidden',
              border: '1px solid rgba(0,0,0,0.08)',
              boxShadow: '0 16px 40px rgba(0,0,0,0.1)',
            }}
          >
            <img
              src={dashboardImg}
              alt=""
              style={{
                width: '100%',
                display: 'block',
                objectFit: 'cover',
                maxHeight: 680,
              }}
            />
            <p
              style={{
                margin: 0,
                padding: '10px 16px',
                fontSize: 13,
                fontWeight: 700,
                background: '#fff',
              }}
            >
              통합 운영 대시보드
            </p>
          </div>
          <div
            style={{
              borderRadius: 16,
              overflow: 'hidden',
              border: '1px solid rgba(0,0,0,0.08)',
              boxShadow: '0 16px 40px rgba(0,0,0,0.1)',
            }}
          >
            <img
              src={tabletImg}
              alt=""
              style={{
                width: '100%',
                display: 'block',
                objectFit: 'cover',
                maxHeight: 600,
              }}
            />
            <p
              style={{
                margin: 0,
                padding: '10px 16px',
                fontSize: 13,
                fontWeight: 700,
                background: '#fff',
              }}
            >
              태블릿 현장 UI
            </p>
          </div>
          <div
            style={{
              borderRadius: 16,
              overflow: 'hidden',
              border: '1px solid rgba(0,0,0,0.08)',
              boxShadow: '0 16px 40px rgba(0,0,0,0.1)',
            }}
          >
            <img
              src={mobileImg}
              alt=""
              style={{
                width: '100%',
                display: 'block',
                objectFit: 'cover',
                maxHeight: 540,
              }}
            />
            <p
              style={{
                margin: 0,
                padding: '10px 16px',
                fontSize: 13,
                fontWeight: 700,
                background: '#fff',
              }}
            >
              모바일 / PDA
            </p>
          </div>
        </div>
      </Slide>

      {/* ══════════════════════════════════════════════
          SLIDE 7 — 핵심 모듈 (Dark)
         ══════════════════════════════════════════════ */}
      <Slide n={7} bg="#1d1d1f">
        <header style={{ marginBottom: 32 }}>
          <p
            style={{
              margin: 0,
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: '0.12em',
              color: `${BRAND}`,
              marginBottom: 6,
            }}
          >
            SECTION 07
          </p>
          <h1
            style={{
              margin: 0,
              fontSize: 40,
              fontWeight: 800,
              letterSpacing: '-0.03em',
              lineHeight: 1.15,
              color: '#fff',
            }}
          >
            {modules.length} Core Modules
          </h1>
          <p
            style={{
              margin: '10px 0 0',
              fontSize: 18,
              fontWeight: 500,
              color: 'rgba(255,255,255,0.5)',
              maxWidth: 920,
              lineHeight: 1.45,
            }}
          >
            현장 운영을 한 축으로 묶는 핵심 구성 요소
          </p>
          <div
            style={{
              width: 64,
              height: 4,
              background: BRAND,
              marginTop: 16,
              borderRadius: 2,
            }}
          />
        </header>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 18,
          }}
        >
          {modules.slice(0, 6).map((mod, i) => (
            <div
              key={i}
              style={{
                background: 'rgba(255,255,255,0.06)',
                borderRadius: 16,
                padding: '22px 24px',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  marginBottom: 12,
                }}
              >
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', fontWeight: 700 }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h4
                  style={{
                    margin: 0,
                    fontSize: 17,
                    fontWeight: 800,
                    color: '#fff',
                  }}
                >
                  {mod.name}
                </h4>
              </div>
              {mod.tagline && (
                <p
                  style={{
                    margin: '0 0 10px',
                    fontSize: 12,
                    fontWeight: 600,
                    color: BRAND,
                  }}
                >
                  {mod.tagline}
                </p>
              )}
              <p
                style={{
                  margin: '0 0 12px',
                  fontSize: 13,
                  lineHeight: 1.45,
                  color: 'rgba(255,255,255,0.65)',
                }}
              >
                {mod.desc}
              </p>
              {mod.bullets && (
                <ul
                  style={{
                    margin: '0 0 10px',
                    padding: '0 0 0 16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 4,
                  }}
                >
                  {mod.bullets.map((b, bi) => (
                    <li
                      key={bi}
                      style={{
                        fontSize: 12,
                        color: 'rgba(255,255,255,0.55)',
                        lineHeight: 1.35,
                      }}
                    >
                      {b}
                    </li>
                  ))}
                </ul>
              )}
              {mod.metricLine && (
                <p
                  style={{
                    margin: 0,
                    fontSize: 12,
                    fontWeight: 700,
                    color: BRAND,
                  }}
                >
                  {mod.metricLine}
                </p>
              )}
            </div>
          ))}
        </div>
      </Slide>

      {/* ══════════════════════════════════════════════
          SLIDE 8 — 핵심 기능 & 도입 강점
         ══════════════════════════════════════════════ */}
      <Slide n={8}>
        <SectionHead
          n={8}
          title="핵심 기능 & 도입 강점"
          subtitle="현장이 원하는 모든 기능과, WIZ-Flow만의 차별화 요소입니다."
        />
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.1fr 0.9fr',
            gap: 32,
          }}
        >
          {/* features */}
          <div>
            <p
              style={{
                margin: '0 0 14px',
                fontSize: 13,
                fontWeight: 800,
                color: BRAND,
                letterSpacing: '0.06em',
              }}
            >
              핵심 기능
            </p>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 12,
              }}
            >
              {features.map((line, i) => {
                const { title, sub } = parseFeature(line);
                return (
                  <div
                    key={i}
                    style={{
                      background: '#fff',
                      borderRadius: 12,
                      padding: '14px 16px',
                      border: '1px solid rgba(0,0,0,0.06)',
                    }}
                  >
                    <p
                      style={{
                        margin: '0 0 4px',
                        fontSize: 14,
                        fontWeight: 800,
                      }}
                    >
                      {title}
                    </p>
                    {sub && (
                      <p
                        style={{
                          margin: 0,
                          fontSize: 12,
                          lineHeight: 1.4,
                          color: SUBTLE,
                        }}
                      >
                        {sub}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          {/* highlights (WHY) */}
          <div>
            <p
              style={{
                margin: '0 0 14px',
                fontSize: 13,
                fontWeight: 800,
                color: BRAND,
                letterSpacing: '0.06em',
              }}
            >
              WHY WIZ-Flow
            </p>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 14,
              }}
            >
              {highlights.map((line, i) => {
                const { title, sub } = parseFeature(line);
                return (
                  <div
                    key={i}
                    style={{
                      background: '#fff',
                      borderRadius: 14,
                      padding: '18px 22px',
                      border: '1px solid rgba(0,0,0,0.06)',
                      borderLeft: `4px solid ${BRAND}`,
                    }}
                  >
                    <p
                      style={{
                        margin: '0 0 4px',
                        fontSize: 16,
                        fontWeight: 800,
                      }}
                    >
                      {title}
                    </p>
                    {sub && (
                      <p
                        style={{
                          margin: 0,
                          fontSize: 14,
                          lineHeight: 1.45,
                          color: SUBTLE,
                        }}
                      >
                        {sub}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </Slide>

      {/* ══════════════════════════════════════════════
          SLIDE 9 — 적용 사례
         ══════════════════════════════════════════════ */}
      <Slide n={9}>
        <SectionHead
          n={9}
          title="적용 사례"
          subtitle="대규모 전자·제조 생산현장에서 검증된 운영 성과와 확장 가능성입니다."
        />
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 28,
          }}
        >
          {/* left: reference card */}
          <div
            style={{
              background: `linear-gradient(165deg, ${BRAND} 0%, #7a0610 100%)`,
              borderRadius: 20,
              padding: 36,
              color: '#fff',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <p
              style={{
                margin: '0 0 10px',
                fontSize: 12,
                fontWeight: 700,
                opacity: 0.85,
                letterSpacing: '0.08em',
              }}
            >
              REFERENCE
            </p>
            <h2
              style={{
                margin: '0 0 18px',
                fontSize: 32,
                fontWeight: 900,
                lineHeight: 1.2,
              }}
            >
              LG전자 생산현장
            </h2>
            <p
              style={{
                margin: 0,
                fontSize: 15,
                lineHeight: 1.65,
                opacity: 0.92,
              }}
            >
              종이 기반 작업지시와 분산된 현장 데이터를 디지털 워크플로로
              전환하고, 실시간 가시성과 표준 준수를 동시에 끌어올린
              스마트팩토리 운영 사례입니다.
            </p>
            <div
              style={{
                marginTop: 20,
                display: 'flex',
                flexWrap: 'wrap',
                gap: 8,
              }}
            >
              {['React', 'Spring Boot', 'Oracle', 'Kafka', 'Docker'].map(
                (t) => (
                  <span
                    key={t}
                    style={{
                      padding: '4px 10px',
                      borderRadius: 999,
                      fontSize: 11,
                      fontWeight: 600,
                      background: 'rgba(255,255,255,0.12)',
                      color: 'rgba(255,255,255,0.85)',
                    }}
                  >
                    {t}
                  </span>
                ),
              )}
            </div>
          </div>

          {/* right: story cards */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
            }}
          >
            <p
              style={{
                margin: '0 0 4px',
                fontSize: 13,
                fontWeight: 800,
                color: BRAND,
                letterSpacing: '0.06em',
              }}
            >
              대표 성과 요약
            </p>
            {stories.slice(0, 5).map((st, i) => (
              <div
                key={i}
                style={{
                  background: '#fff',
                  borderRadius: 14,
                  padding: '12px 18px',
                  border: '1px solid rgba(0,0,0,0.06)',
                  borderLeft: `4px solid ${BRAND}`,
                }}
              >
                <p
                  style={{
                    margin: '0 0 3px',
                    fontSize: 13,
                    fontWeight: 800,
                    lineHeight: 1.3,
                  }}
                >
                  {st.title}
                </p>
                <p
                  style={{
                    margin: 0,
                    fontSize: 13,
                    fontWeight: 700,
                    color: BRAND,
                    lineHeight: 1.35,
                  }}
                >
                  {st.outcome}
                </p>
              </div>
            ))}
            <div
              style={{
                marginTop: 4,
                padding: '14px 18px',
                background: '#fff',
                borderRadius: 14,
                border: `1px dashed ${BRAND}44`,
                fontSize: 13,
                lineHeight: 1.5,
                color: SUBTLE,
              }}
            >
              <strong style={{ color: TEXT }}>WIZ FACTORY</strong>는 현장
              UX·ERP/MES 연동·온프레미스·클라우드 선택 등 도입 환경에 맞춘
              구축·운영을 지원합니다.
            </div>
          </div>
        </div>
        <p
          style={{
            position: 'absolute',
            bottom: 28,
            right: PAD,
            margin: 0,
            fontSize: 12,
            color: '#aeaeb2',
          }}
        >
          WIZ-Flow · 시스템 소개서 (16:9) · wiz-factory.com
        </p>
      </Slide>
    </div>
  );
}
