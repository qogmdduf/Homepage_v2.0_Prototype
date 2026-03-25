export default function AppleTVMetricCards() {
  const sections = [
    {
      id: 1,
      eyebrow: '용지 · 자료 의존',
      title: '용지 사용량',
      note: '종이·인쇄물에 의존하던 업무를 최소 용지로 줄입니다.',
      before: {
        value: '100%',
        label: '인쇄·배포·수기 중심',
      },
      after: {
        value: '5%',
        label: '디지털·현장 입력 중심',
      },
      glowFrom: 'from-rose-400/20',
      glowTo: 'to-emerald-300/20',
      accent: 'from-rose-500 to-emerald-400',
    },
    {
      id: 2,
      eyebrow: '데이터 반영',
      title: '데이터 반영 속도',
      note: '집계·보고까지 걸리던 시간을 없애 즉시 반영합니다.',
      before: {
        value: '2~3일',
        label: '재입력·엑셀 집계 지연',
      },
      after: {
        value: '실시간',
        label: '현장 입력 → 자동 반영',
      },
      glowFrom: 'from-orange-300/20',
      glowTo: 'to-cyan-300/20',
      accent: 'from-orange-400 to-cyan-400',
    },
    {
      id: 3,
      eyebrow: '운영 가시성',
      title: '운영 정보 일원화',
      note: '현장과 보고가 엇갈리던 정보를 한 기준으로 맞춥니다.',
      before: {
        value: '분산·사후 공유',
        label: '현장·사무 따로 보고',
      },
      after: {
        value: '통합·실시간',
        label: '대시보드·KPI 동시 확인',
      },
      glowFrom: 'from-fuchsia-300/20',
      glowTo: 'to-sky-300/20',
      accent: 'from-fuchsia-400 to-sky-400',
    },
    {
      id: 4,
      eyebrow: '업무 속도',
      title: '현장 처리 효율',
      note: '보고와 공유를 기다리던 시간을 줄여 즉시 대응 가능한 구조로 바뀝니다.',
      before: {
        value: '대기·전달',
        label: '수작업 확인 후 후속 처리',
      },
      after: {
        value: '즉시 실행',
        label: '입력 즉시 공유·판단 가능',
      },
      glowFrom: 'from-violet-300/20',
      glowTo: 'to-teal-300/20',
      accent: 'from-violet-400 to-teal-400',
    },
  ];

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.06),_transparent_35%),linear-gradient(180deg,_#0b1020_0%,_#111827_45%,_#0f172a_100%)] px-6 py-12 text-white md:px-10 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 text-center">
          <div className="mb-3 inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-white/70 backdrop-blur-md">
            Apple TV 스타일 · 세로 비교형 KPI 카드
          </div>
          <h1 className="mx-auto max-w-4xl text-3xl font-semibold tracking-tight text-white md:text-5xl">
            각 항목을 세로로 묶어
            <span className="bg-gradient-to-r from-white via-white to-white/60 bg-clip-text text-transparent"> 도입 전 → 도입 후 흐름이 바로 보이는 카드</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-white/60 md:text-base">
            항목별로 상단에 도입 전 카드, 하단에 도입 후 카드를 배치한 2 x 2 구조입니다.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {sections.map((section) => (
            <VerticalCompareCard key={section.id} {...section} />
          ))}
        </div>
      </div>
    </div>
  );
}

function VerticalCompareCard({
  eyebrow,
  title,
  note,
  before,
  after,
  glowFrom,
  glowTo,
  accent,
}: {
  eyebrow: string;
  title: string;
  note: string;
  before: { value: string; label: string };
  after: { value: string; label: string };
  glowFrom: string;
  glowTo: string;
  accent: string;
}) {
  return (
    <div className="group relative overflow-hidden rounded-[34px] border border-white/10 bg-white/[0.06] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.45)] backdrop-blur-2xl transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-2 hover:scale-[1.02] hover:border-white/20 hover:bg-white/[0.08]">
      <div className={`absolute inset-0 bg-gradient-to-br ${glowFrom} ${glowTo} opacity-70 blur-3xl transition-opacity duration-300 group-hover:opacity-100`} />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.18),rgba(255,255,255,0.03)_26%,rgba(255,255,255,0.02)_100%)] opacity-80" />
      <div className={`absolute inset-x-6 top-0 h-px bg-gradient-to-r ${accent} opacity-80`} />
      <div className="absolute -right-12 top-0 h-36 w-36 rounded-full bg-white/10 blur-3xl transition-all duration-500 group-hover:scale-125 group-hover:bg-white/15" />

      <div className="relative z-10">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-white/45">{eyebrow}</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white">{title}</h2>
          </div>
          <div className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs font-medium text-white/55 backdrop-blur-md">
            Vertical Compare
          </div>
        </div>

        <div className="space-y-4">
          <StageCard
            stage="도입 전"
            value={before.value}
            label={before.label}
            tone="before"
          />

          <div className="flex items-center justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/10 text-lg text-white/75 shadow-[0_10px_30px_rgba(0,0,0,0.25)] backdrop-blur-md transition-transform duration-300 group-hover:translate-y-0.5">
              ↓
            </div>
          </div>

          <StageCard
            stage="도입 후"
            value={after.value}
            label={after.label}
            tone="after"
            accent={accent}
          />
        </div>

        <div className="mt-6 flex items-start gap-3 rounded-2xl border border-white/8 bg-black/15 px-4 py-3 text-sm leading-6 text-white/60 backdrop-blur-md">
          <div className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-gradient-to-r ${accent} shadow-[0_0_16px_rgba(255,255,255,0.25)]`} />
          <p>{note}</p>
        </div>
      </div>
    </div>
  );
}

function StageCard({
  stage,
  value,
  label,
  tone,
  accent,
}: {
  stage: string;
  value: string;
  label: string;
  tone: 'before' | 'after';
  accent?: string;
}) {
  const isBefore = tone === 'before';

  return (
    <div
      className={[
        'relative overflow-hidden rounded-[28px] border p-5 shadow-inner backdrop-blur-xl transition-all duration-300',
        isBefore
          ? 'border-rose-300/15 bg-gradient-to-br from-rose-400/8 via-black/20 to-transparent group-hover:border-rose-300/25'
          : 'border-emerald-300/20 bg-gradient-to-br from-emerald-300/12 via-cyan-300/5 to-black/15 group-hover:border-emerald-200/35',
      ].join(' ')}
    >
      <div
        className={[
          'absolute inset-0 opacity-70',
          isBefore
            ? 'bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.01)_35%,transparent)]'
            : 'bg-[linear-gradient(180deg,rgba(255,255,255,0.12),rgba(255,255,255,0.02)_35%,transparent)]',
        ].join(' ')}
      />

      <div className="relative z-10">
        <div className="mb-3 flex items-center justify-between">
          <div
            className={[
              'rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] backdrop-blur-md',
              isBefore
                ? 'border border-rose-200/10 bg-rose-300/10 text-rose-100/70'
                : 'border border-emerald-200/15 bg-emerald-300/10 text-emerald-50/80',
            ].join(' ')}
          >
            {stage}
          </div>
          {!isBefore && (
            <div className={`h-2.5 w-2.5 rounded-full bg-gradient-to-r ${accent} shadow-[0_0_16px_rgba(52,211,153,0.75)]`} />
          )}
        </div>

        <div className="text-3xl font-semibold leading-tight tracking-tight text-white md:text-4xl">
          {value}
        </div>
        <p className={`mt-3 text-sm leading-6 ${isBefore ? 'text-white/60' : 'text-white/75'}`}>
          {label}
        </p>
      </div>
    </div>
  );
}
