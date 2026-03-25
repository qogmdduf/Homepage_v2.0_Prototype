/**
 * WIZ-Flow 영업용 시스템 소개서 (16:9 슬라이드).
 * `pnpm generate:wiz-flow-sales-pdf` → Playwright가 `[data-sales-slide]` 단위로 캡처합니다.
 */
import type { ReactNode } from 'react';
import { solutions, type Solution } from '../data/solutions';
import wizSymbol from '../../assets/symbol.svg';
import wizFlowDashboardImg from '../../assets/pfos-dashboard.png';
import wizFlowTabletImg from '../../assets/pfos-tablet.png';
import wizFlowMobileImg from '../../assets/pfos-mobile.png';

const BRAND = '#B30710';
const MUTED = '#6e6e73';
const PAGE_W = 1920;
const PAGE_H = 1080;
const PAD = 56;

function Slide({ n, children }: { n: number; children: ReactNode }) {
  return (
    <div
      data-sales-slide={n}
      style={{
        width: PAGE_W,
        height: PAGE_H,
        boxSizing: 'border-box',
        padding: PAD,
        background: n % 2 === 1 ? '#ffffff' : '#f5f6f8',
        position: 'relative',
        fontFamily: "'Noto Sans KR', 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif",
        color: '#1d1d1f',
        WebkitFontSmoothing: 'antialiased',
      }}
    >
      {children}
    </div>
  );
}

function SectionHead({ n, title, subtitle }: { n: number; title: string; subtitle?: string }) {
  return (
    <header style={{ marginBottom: 36 }}>
      <p
        style={{
          margin: 0,
          fontSize: 13,
          fontWeight: 700,
          letterSpacing: '0.12em',
          color: BRAND,
          marginBottom: 8,
        }}
      >
        SECTION {n}
      </p>
      <h1 style={{ margin: 0, fontSize: 44, fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.15 }}>
        {title}
      </h1>
      {subtitle ? (
        <p style={{ margin: '14px 0 0', fontSize: 20, fontWeight: 500, color: MUTED, maxWidth: 920, lineHeight: 1.5 }}>
          {subtitle}
        </p>
      ) : null}
      <div style={{ width: 72, height: 4, background: BRAND, marginTop: 20, borderRadius: 2 }} />
    </header>
  );
}

function parseFeature(line: string): { title: string; sub: string } {
  const [t, s] = line.split('||');
  return { title: t?.trim() ?? line, sub: s?.trim() ?? '' };
}

export function WizFlowSalesBrochurePage() {
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
  const stories = s.useCaseStories ?? [];

  const changeItems = [
    {
      t: '종이·분산 채널에서 통합 디지털 흐름으로',
      d: '작업지시·전표·승인이 한 화면에서 이어져 인쇄·배포·회수 비용과 표준 반영 지연이 사라집니다.',
    },
    {
      t: '사후 집계에서 실시간 가시성으로',
      d: '라인·설비·품질 데이터가 즉시 수집·검증되어 현장 의사결정과 본사 모니터링이 동시에 가능해집니다.',
    },
    {
      t: '개인 전화·메신저에서 자동 워크플로로',
      d: '이상·불량 발생 시 알림·담당 배정·조치·이력이 끊기지 않아 대응 시간과 누락 리스크가 줄어듭니다.',
    },
    {
      t: '버전 혼선에서 단일 최신 기준으로',
      d: 'SOP·작업 기준이 개정 즉시 전 라인에 동일하게 적용되어 준수율과 품질 일관성을 동시에 확보합니다.',
    },
  ];

  const processBefore = ['종이·출력 작업지시', '분산 채널 입력·승인', '엑셀·수기 집계', '지연된 현장 대응'];
  const processAfter = ['디지털 작업지시·전자 서명', '통합 화면 워크플로', 'PLC·MES 실시간 반영', '알림·자동 배정·이력'];

  return (
    <div
      className="wizflow-sales-brochure"
      style={{
        minWidth: PAGE_W,
        background: '#e8eaed',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 0,
        paddingBottom: 24,
      }}
    >
      {/* ── 1. 시스템 소개 ── */}
      <Slide n={1}>
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <SectionHead
            n={1}
            title="시스템 소개"
            subtitle="글로벌 제조 현장의 디지털 전환을 위한 스마트팩토리 운영 플랫폼"
          />
          <div style={{ display: 'flex', gap: 48, flex: 1, minHeight: 0, alignItems: 'flex-start' }}>
            <div style={{ flex: '1 1 52%', minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28 }}>
                <img src={wizSymbol} alt="" width={56} height={56} style={{ flexShrink: 0 }} />
                <div>
                  <p style={{ margin: 0, fontSize: 36, fontWeight: 900, letterSpacing: '-0.03em' }}>WIZ-Flow</p>
                  <p style={{ margin: '6px 0 0', fontSize: 18, color: MUTED, fontWeight: 600 }}>{s.subtitle}</p>
                </div>
              </div>
              <p style={{ fontSize: 19, lineHeight: 1.65, margin: '0 0 20px', fontWeight: 500 }}>{s.description}</p>
              <p style={{ fontSize: 17, lineHeight: 1.65, margin: 0, color: '#3d3d3f' }}>{s.detailedDescription}</p>
              <div
                style={{
                  marginTop: 28,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '10px 18px',
                  borderRadius: 999,
                  background: `${BRAND}10`,
                  border: `1px solid ${BRAND}33`,
                  fontSize: 14,
                  fontWeight: 700,
                  color: BRAND,
                }}
              >
                적용 사례 · LG전자 생산현장 운영
              </div>
            </div>
            <div
              style={{
                flex: '1 1 48%',
                borderRadius: 20,
                overflow: 'hidden',
                border: '1px solid rgba(0,0,0,0.08)',
                boxShadow: '0 20px 50px rgba(0,0,0,0.12)',
                alignSelf: 'stretch',
                maxHeight: 720,
              }}
            >
              <img
                src={wizFlowDashboardImg}
                alt=""
                style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center', display: 'block' }}
              />
            </div>
          </div>
        </div>
      </Slide>

      {/* ── 2. 도입 전·후 ── */}
      <Slide n={2}>
        <SectionHead n={2} title="시스템 도입 전·후" subtitle="핵심 영역별 AS-IS와 TO-BE를 한눈에 비교합니다." />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28, height: 780 }}>
          {kpi.map((card, i) => (
            <div
              key={i}
              style={{
                background: '#fff',
                borderRadius: 16,
                border: '1px solid rgba(0,0,0,0.07)',
                padding: '24px 28px',
                boxShadow: '0 8px 28px rgba(0,0,0,0.06)',
                display: 'flex',
                flexDirection: 'column',
                gap: 14,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <span style={{ fontSize: 11, fontWeight: 800, color: BRAND, letterSpacing: '0.08em' }}>{card.category}</span>
                <span style={{ fontSize: 22, fontWeight: 900, color: BRAND }}>{card.badgePct}</span>
              </div>
              <h3 style={{ margin: 0, fontSize: 20, fontWeight: 800 }}>{card.title}</h3>
              <div style={{ flex: 1, display: 'grid', gridTemplateRows: '1fr 1fr', gap: 12, minHeight: 0 }}>
                <div style={{ background: '#fafafa', borderRadius: 12, padding: 16, border: '1px solid rgba(0,0,0,0.05)' }}>
                  <p style={{ margin: '0 0 8px', fontSize: 11, fontWeight: 800, color: '#86868b' }}>도입 전 (AS-IS)</p>
                  <p style={{ margin: 0, fontSize: 14, lineHeight: 1.5, whiteSpace: 'pre-line' }}>{card.asIs}</p>
                </div>
                <div
                  style={{
                    background: `${BRAND}08`,
                    borderRadius: 12,
                    padding: 16,
                    border: `1px solid ${BRAND}22`,
                  }}
                >
                  <p style={{ margin: '0 0 8px', fontSize: 11, fontWeight: 800, color: BRAND }}>도입 후 (TO-BE)</p>
                  <p style={{ margin: 0, fontSize: 14, lineHeight: 1.5, whiteSpace: 'pre-line', fontWeight: 600 }}>{card.toBe}</p>
                </div>
              </div>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: BRAND }}>성과: {card.resultLine}</p>
            </div>
          ))}
        </div>
      </Slide>

      {/* ── 3. 도입 후 달라지는 점 & 이유 ── */}
      <Slide n={3}>
        <SectionHead
          n={3}
          title="도입 후 무엇이 달라지는가"
          subtitle="현장·품질·운영 관점에서의 변화와, 그렇게 설계된 이유입니다."
        />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, rowGap: 22 }}>
          {changeItems.map((item, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                gap: 18,
                padding: '22px 26px',
                background: '#fff',
                borderRadius: 16,
                border: '1px solid rgba(0,0,0,0.06)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
              }}
            >
              <div
                style={{
                  flexShrink: 0,
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  background: BRAND,
                  color: '#fff',
                  fontSize: 18,
                  fontWeight: 900,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {i + 1}
              </div>
              <div>
                <h3 style={{ margin: '0 0 10px', fontSize: 18, fontWeight: 800, lineHeight: 1.35 }}>{item.t}</h3>
                <p style={{ margin: 0, fontSize: 15, lineHeight: 1.55, color: '#3d3d3f' }}>{item.d}</p>
              </div>
            </div>
          ))}
        </div>
      </Slide>

      {/* ── 4. 프로세스 맵 & 핵심 지표 ── */}
      <Slide n={4}>
        <SectionHead
          n={4}
          title="프로세스 맵 · 핵심 지표"
          subtitle="도입 전후 업무 흐름의 방향성과, 계량화된 개선 지표입니다."
        />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'stretch',
              gap: 20,
              background: '#fff',
              borderRadius: 20,
              padding: '28px 32px',
              border: '1px solid rgba(0,0,0,0.07)',
            }}
          >
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <p style={{ margin: 0, fontSize: 12, fontWeight: 800, color: '#86868b', letterSpacing: '0.06em' }}>도입 전</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
                {processBefore.map((step, i) => (
                  <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span
                      style={{
                        padding: '10px 16px',
                        background: '#f1f5f9',
                        borderRadius: 10,
                        fontSize: 14,
                        fontWeight: 700,
                        border: '1px solid rgba(0,0,0,0.06)',
                      }}
                    >
                      {step}
                    </span>
                    {i < processBefore.length - 1 ? (
                      <span style={{ color: '#c7c7cc', fontSize: 18, fontWeight: 700 }}>→</span>
                    ) : null}
                  </span>
                ))}
              </div>
            </div>
            <div
              style={{
                width: 100,
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 15,
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
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <p style={{ margin: 0, fontSize: 12, fontWeight: 800, color: BRAND, letterSpacing: '0.06em' }}>도입 후</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
                {processAfter.map((step, i) => (
                  <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span
                      style={{
                        padding: '10px 16px',
                        background: `${BRAND}12`,
                        borderRadius: 10,
                        fontSize: 14,
                        fontWeight: 700,
                        border: `1px solid ${BRAND}30`,
                      }}
                    >
                      {step}
                    </span>
                    {i < processAfter.length - 1 ? (
                      <span style={{ color: BRAND, fontSize: 18, fontWeight: 700 }}>→</span>
                    ) : null}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
            {(s.metrics ?? []).map((m, i) => (
              <div
                key={i}
                style={{
                  background: '#fff',
                  borderRadius: 16,
                  padding: '24px 22px',
                  border: '1px solid rgba(0,0,0,0.06)',
                  textAlign: 'center',
                }}
              >
                <p style={{ margin: '0 0 12px', fontSize: 38, fontWeight: 900, color: BRAND, lineHeight: 1 }}>
                  {m.value}
                  {m.suffix}
                </p>
                <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#3d3d3f', lineHeight: 1.4 }}>{m.label}</p>
              </div>
            ))}
          </div>
        </div>
      </Slide>

      {/* ── 5. 실제 핵심 화면 ── */}
      <Slide n={5}>
        <SectionHead n={5} title="실제 핵심 화면" subtitle="현장·관제·모바일까지 동일 데이터로 연결된 대표 화면입니다." />
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 0.75fr', gap: 20, alignItems: 'end', height: 780 }}>
          <div style={{ borderRadius: 16, overflow: 'hidden', border: '1px solid rgba(0,0,0,0.08)', boxShadow: '0 16px 40px rgba(0,0,0,0.1)' }}>
            <img src={wizFlowDashboardImg} alt="" style={{ width: '100%', display: 'block', objectFit: 'cover', maxHeight: 700 }} />
            <p style={{ margin: 0, padding: '12px 16px', fontSize: 14, fontWeight: 700, background: '#fff' }}>
              통합 운영 대시보드
            </p>
          </div>
          <div style={{ borderRadius: 16, overflow: 'hidden', border: '1px solid rgba(0,0,0,0.08)', boxShadow: '0 16px 40px rgba(0,0,0,0.1)' }}>
            <img src={wizFlowTabletImg} alt="" style={{ width: '100%', display: 'block', objectFit: 'cover', maxHeight: 620 }} />
            <p style={{ margin: 0, padding: '12px 16px', fontSize: 14, fontWeight: 700, background: '#fff' }}>태블릿 현장 UI</p>
          </div>
          <div style={{ borderRadius: 16, overflow: 'hidden', border: '1px solid rgba(0,0,0,0.08)', boxShadow: '0 16px 40px rgba(0,0,0,0.1)' }}>
            <img src={wizFlowMobileImg} alt="" style={{ width: '100%', display: 'block', objectFit: 'cover', maxHeight: 560 }} />
            <p style={{ margin: 0, padding: '12px 16px', fontSize: 14, fontWeight: 700, background: '#fff' }}>모바일 / PDA</p>
          </div>
        </div>
      </Slide>

      {/* ── 6. 핵심 모듈 · 핵심 기능 ── */}
      <Slide n={6}>
        <SectionHead n={6} title="시스템 핵심 모듈 · 핵심 기능" subtitle="현장 운영을 한 축으로 묶는 구성 요소와 대표 기능입니다." />
        <div style={{ display: 'grid', gridTemplateColumns: '1.05fr 0.95fr', gap: 36, height: 800 }}>
          <div>
            <p style={{ margin: '0 0 16px', fontSize: 13, fontWeight: 800, color: BRAND, letterSpacing: '0.06em' }}>핵심 모듈</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              {modules.slice(0, 6).map((mod, i) => (
                <div
                  key={i}
                  style={{
                    background: '#fff',
                    borderRadius: 14,
                    padding: '16px 18px',
                    border: '1px solid rgba(0,0,0,0.07)',
                    minHeight: 100,
                  }}
                >
                  <p style={{ margin: '0 0 6px', fontSize: 11, color: '#86868b', fontWeight: 700 }}>
                    {String(i + 1).padStart(2, '0')}
                  </p>
                  <h4 style={{ margin: '0 0 8px', fontSize: 16, fontWeight: 800 }}>{mod.name}</h4>
                  <p style={{ margin: 0, fontSize: 13, lineHeight: 1.45, color: '#3d3d3f' }}>{mod.desc}</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <p style={{ margin: '0 0 16px', fontSize: 13, fontWeight: 800, color: BRAND, letterSpacing: '0.06em' }}>핵심 기능</p>
            <div style={{ background: '#fff', borderRadius: 16, padding: '20px 22px', border: '1px solid rgba(0,0,0,0.07)', maxHeight: 720, overflow: 'hidden' }}>
              <ul style={{ margin: 0, padding: '0 0 0 18px', display: 'flex', flexDirection: 'column', gap: 14 }}>
                {s.features.map((line, i) => {
                  const { title, sub } = parseFeature(line);
                  return (
                    <li key={i} style={{ fontSize: 14, lineHeight: 1.45 }}>
                      <strong style={{ fontWeight: 800 }}>{title}</strong>
                      {sub ? <span style={{ color: '#3d3d3f' }}> — {sub}</span> : null}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </Slide>

      {/* ── 7. 고객사 증명 가치 ── */}
      <Slide n={7}>
        <SectionHead
          n={7}
          title="고객사에서 증명된 가치"
          subtitle="대규모 전자·제조 생산현장에서 검증된 운영 성과와 확장 가능성입니다."
        />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, height: 780 }}>
          <div
            style={{
              background: `linear-gradient(165deg, ${BRAND} 0%, #7a0610 100%)`,
              borderRadius: 20,
              padding: 40,
              color: '#fff',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <p style={{ margin: '0 0 12px', fontSize: 13, fontWeight: 700, opacity: 0.9, letterSpacing: '0.08em' }}>REFERENCE</p>
            <h2 style={{ margin: '0 0 20px', fontSize: 36, fontWeight: 900, lineHeight: 1.2 }}>LG전자 생산현장</h2>
            <p style={{ margin: 0, fontSize: 17, lineHeight: 1.65, opacity: 0.95 }}>
              종이 기반 작업지시와 분산된 현장 데이터를 디지털 워크플로로 전환하고, 실시간 가시성과 표준 준수를 동시에
              끌어올린 스마트팩토리 운영 사례입니다. 복수 라인·사업장 확장에 맞춘 아키텍처로 설계되어 있습니다.
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <p style={{ margin: '0 0 6px', fontSize: 13, fontWeight: 800, color: BRAND, letterSpacing: '0.06em' }}>
              대표 성과 요약
            </p>
            {stories.slice(0, 4).map((st, i) => (
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
                <p style={{ margin: '0 0 4px', fontSize: 12, fontWeight: 800, color: '#1d1d1f', lineHeight: 1.35 }}>
                  {st.title}
                </p>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: BRAND, lineHeight: 1.4 }}>{st.outcome}</p>
              </div>
            ))}
            <div
              style={{
                marginTop: 8,
                padding: '18px 22px',
                background: '#fff',
                borderRadius: 14,
                border: `1px dashed ${BRAND}44`,
                fontSize: 14,
                lineHeight: 1.55,
                color: '#3d3d3f',
              }}
            >
              <strong style={{ color: '#1d1d1f' }}>WIZ FACTORY</strong>는 현장 UX·ERP/MES 연동·온프레미스·클라우드 선택 등
              도입 환경에 맞춘 구축·운영을 지원합니다.
            </div>
          </div>
        </div>
        <p style={{ position: 'absolute', bottom: 36, right: PAD, margin: 0, fontSize: 12, color: '#aeaeb2' }}>
          WIZ-Flow · 영업용 시스템 소개서 (16:9) · wiz-factory.com
        </p>
      </Slide>
    </div>
  );
}
