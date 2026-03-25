import { useState, useMemo, type CSSProperties } from "react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Checkbox } from "../components/ui/checkbox";
import { Switch } from "../components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/tabs";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { Skeleton } from "../components/ui/skeleton";
import { Card } from "../components/ui/card";
import {
  Layers, Palette, Type, Space, Square, ChevronUp, Puzzle,
  Zap, Code2, ChevronRight, Info, CheckCircle2, AlertCircle,
  AlertTriangle, Copy, Check, Search, Mail, Lock, User,
  LayoutGrid, ArrowRight, Star, Heart, Download, Settings,
  Bell, Home, FileText, BarChart2, Globe, Shield, Cpu,
  Database, Cloud, Monitor, Smartphone, Tablet, Combine,
  Sparkles, Accessibility, BookOpen,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

/* ─────────────────────────────────────────────────────────
   Navigation — Wiz_* ID + 그룹(Foundations / UI / XP / Docs)
───────────────────────────────────────────────────────── */
type WizNavItem = {
  /** 섹션 state 키 (kebab) */
  id: string;
  /** 문서·토큰용 식별자 (Wiz_스네이크) */
  wizId: string;
  labelKo: string;
  icon: LucideIcon;
};

type WizNavGroup = { groupWizId: string; groupLabelKo: string; items: WizNavItem[] };

const WIZ_NAV_GROUPS: WizNavGroup[] = [
  {
    groupWizId: "Wiz_Start",
    groupLabelKo: "시작",
    items: [
      { id: "wiz-overview", wizId: "Wiz_Overview", labelKo: "개요", icon: Layers },
    ],
  },
  {
    groupWizId: "Wiz_Foundations",
    groupLabelKo: "파운데이션",
    items: [
      { id: "wiz-color", wizId: "Wiz_Color", labelKo: "색상", icon: Palette },
      { id: "wiz-typography", wizId: "Wiz_Typography", labelKo: "타이포그래피", icon: Type },
      { id: "wiz-spacing", wizId: "Wiz_Spacing", labelKo: "스페이싱", icon: Space },
      { id: "wiz-grid", wizId: "Wiz_Grid", labelKo: "그리드", icon: LayoutGrid },
      { id: "wiz-radius", wizId: "Wiz_Radius", labelKo: "모서리 (Radius)", icon: Square },
      { id: "wiz-shadow", wizId: "Wiz_Shadow", labelKo: "깊이·그림자", icon: ChevronUp },
    ],
  },
  {
    groupWizId: "Wiz_UI",
    groupLabelKo: "UI",
    items: [
      { id: "wiz-components", wizId: "Wiz_Components", labelKo: "컴포넌트", icon: Puzzle },
      { id: "wiz-patterns", wizId: "Wiz_Patterns", labelKo: "패턴 (조합)", icon: Combine },
    ],
  },
  {
    groupWizId: "Wiz_XP",
    groupLabelKo: "경험",
    items: [
      { id: "wiz-motion", wizId: "Wiz_Motion", labelKo: "인터랙션·모션", icon: Sparkles },
      { id: "wiz-a11y", wizId: "Wiz_Accessibility", labelKo: "접근성", icon: Accessibility },
    ],
  },
  {
    groupWizId: "Wiz_Docs",
    groupLabelKo: "리소스",
    items: [
      { id: "wiz-icons", wizId: "Wiz_Icons", labelKo: "아이콘", icon: Zap },
      { id: "wiz-tokens", wizId: "Wiz_Tokens", labelKo: "디자인 토큰", icon: Code2 },
    ],
  },
];

function flattenWizNav(): WizNavItem[] {
  return WIZ_NAV_GROUPS.flatMap((g) => g.items);
}

function findWizNavItem(sectionId: string): WizNavItem | undefined {
  return flattenWizNav().find((i) => i.id === sectionId);
}

/** Wiz_DS 개요·카탈로그용 — 섹션별 요약·포함 내용 */
const WIZ_SECTION_CATALOG: Record<
  string,
  { summary: string; contents: string[]; source?: string }
> = {
  "wiz-overview": {
    summary: "디자인 시스템 진입점. 전체 IA 트리, 항목 설명, 빠른 이동.",
    contents: ["그룹별 구조도", "전체 항목 표", "카드로 섹션 이동"],
    source: "src/app/pages/DesignSystemPage.tsx",
  },
  "wiz-color": {
    summary: "브랜드 컬러·4축 팔레트 스케일·시맨틱·상태·토큰 요약.",
    contents: ["Brand / Palette(Gray·Blue·Red·Green)", "Semantic", "State", "Code 예시"],
    source: "theme.css — --palette-*, --color-*, --semantic-*, --state-*",
  },
  "wiz-typography": {
    summary: "Inter + Pretendard, fluid Display/Body, Label 캡션.",
    contents: ["Font Family", "Scale: Display / Heading / Body / Caption", "Weight·Tracking·Leading", "Usage"],
    source: "theme.css — --text-*, --font-*, --tracking-*, --leading-*",
  },
  "wiz-spacing": {
    summary: "4px 기반 스페이싱 스케일(space-1 …).",
    contents: ["수치 표", "radius 연계", "실사용 예시"],
    source: "Tailwind spacing + theme --radius-*",
  },
  "wiz-grid": {
    summary: "페이지 폭·거터·반응형 그리드 기준.",
    contents: [".wiz-section", "max-w-[1440px]", "브레이크포인트 안내"],
    source: "theme.css / index.css — .wiz-section",
  },
  "wiz-radius": {
    summary: "Border radius 토큰과 Tailwind rounded 유틸.",
    contents: ["--radius-sm ~ xl", "rounded-2xl 등 예시"],
    source: "theme.css — --radius*",
  },
  "wiz-shadow": {
    summary: "Elevation: 그림자 스케일 + z-index 레이어.",
    contents: ["shadow-xs ~ 2xl", "z-0 ~ z-[100] 용도"],
    source: "Tailwind shadow + 문서화된 z 계층",
  },
  "wiz-components": {
    summary: "shadcn/Radix 기반 UI·레이아웃·섹션·모달·유틸.",
    contents: ["기본 UI: Button, Input, Card…", "카테고리별 카드", "Props·코드 예시"],
    source: "src/app/components/ui/*",
  },
  "wiz-patterns": {
    summary: "프리미티브 조합 패턴(향후 확장).",
    contents: ["폼 플로우", "리스트+필터", "플레이스홀더"],
    source: "—",
  },
  "wiz-motion": {
    summary: "Motion for React, 이징·접근성(reduced-motion).",
    contents: ["라이브러리", "정책", "톤 가이드"],
    source: "motion/react",
  },
  "wiz-a11y": {
    summary: "WCAG 2.1 AA 목표, 포커스·대비·시맨틱·모달.",
    contents: ["체크 항목", "키보드", "스크린리더"],
    source: "—",
  },
  "wiz-icons": {
    summary: "Lucide React 아이콘 세트, 크기·색 적용.",
    contents: ["그리드 목록", "복사 스니펫", "크기 시스템"],
    source: "lucide-react",
  },
  "wiz-tokens": {
    summary: "CSS 변수 전체 탭(색·타이포·간격·폰트 패밀리).",
    contents: ["토큰 표 + 복사", "사용 예시 코드"],
    source: "src/styles/theme.css",
  },
};

const WIZ_DS_TREE_ASCII = `Wiz_DS
├── Wiz_Start
│   └── Wiz_Overview … 개요·전체 맵 (이 페이지)
├── Wiz_Foundations
│   ├── Wiz_Color … 색상·팔레트·시맨틱·상태
│   ├── Wiz_Typography … 타이포 스케일·토큰
│   ├── Wiz_Spacing … 4px 스케일
│   ├── Wiz_Grid … 레이아웃·컨테이너
│   ├── Wiz_Radius … 모서리
│   └── Wiz_Shadow … 깊이·그림자·z-index
├── Wiz_UI
│   ├── Wiz_Components … 컴포넌트 라이브러리
│   └── Wiz_Patterns … UI 패턴(조합)
├── Wiz_XP
│   ├── Wiz_Motion … 인터랙션·모션
│   └── Wiz_Accessibility … 접근성
└── Wiz_Docs
    ├── Wiz_Icons … 아이콘
    └── Wiz_Tokens … 디자인 토큰 표`;

/* Component category definitions */
const COMP_CATEGORIES = [
  { id: "ui",      label: "기본 UI" },
  { id: "layout",  label: "레이아웃" },
  { id: "section", label: "섹션 컴포넌트" },
  { id: "modal",   label: "모달" },
  { id: "util",    label: "유틸리티" },
] as const;

/* ─────────────────────────────────────────────────────────
   Small helpers
───────────────────────────────────────────────────────── */
function SectionTitle({ title, desc }: { title: string; desc?: string }) {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold tracking-tight text-[#1D1D1F] mb-2">{title}</h2>
      {desc && <p className="text-[#86868B] text-sm leading-relaxed max-w-prose">{desc}</p>}
    </div>
  );
}

/** 문서 랜딩 — shadcn / Vercel docs 스타일 히어로 */
function DocHero({
  id,
  eyebrow,
  title,
  description,
  badge,
}: {
  id?: string;
  eyebrow?: string;
  title: string;
  description: string;
  badge?: string;
}) {
  return (
    <div
      id={id}
      className="relative mb-10 overflow-hidden rounded-2xl border border-[rgba(0,0,0,0.06)] bg-gradient-to-br from-white via-white to-[#F5F5F7] p-8 shadow-[0_1px_2px_rgba(0,0,0,0.04)] scroll-mt-28"
    >
      <div className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-brand-red/[0.06] blur-3xl" />
      <div className="pointer-events-none absolute -bottom-8 -left-8 h-40 w-40 rounded-full bg-[#0071E3]/[0.04] blur-3xl" />
      <div className="relative">
        {badge && (
          <span className="mb-4 inline-flex items-center rounded-full border border-[rgba(0,0,0,0.06)] bg-white/80 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#86868B]">
            {badge}
          </span>
        )}
        {eyebrow && (
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-brand-red">{eyebrow}</p>
        )}
        <h1 className="mb-3 text-3xl font-bold tracking-tight text-[#1D1D1F] sm:text-[2rem]">{title}</h1>
        <p className="max-w-2xl text-sm leading-relaxed text-[#86868B]">{description}</p>
      </div>
    </div>
  );
}

/** 앵커용 섹션 제목 (우측 TOC 연동) */
function SectionHeading({ id, children, className }: { id: string; children: React.ReactNode; className?: string }) {
  return (
    <h2 id={id} className={`scroll-mt-28 text-lg font-semibold tracking-tight text-[#1D1D1F] ${className ?? ""}`}>
      {children}
    </h2>
  );
}

function SubTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="text-base font-semibold text-[#1D1D1F] mb-4 mt-8">{children}</h3>;
}

/** 개요 페이지 — 우측 “이 페이지” (xl+) */
function OverviewOnThisPage() {
  const links = [
    { href: "#overview-hero", label: "소개" },
    { href: "#overview-principles", label: "원칙" },
    { href: "#overview-structure", label: "정보 구조" },
    { href: "#overview-browse", label: "카탈로그" },
    { href: "#overview-stack", label: "기술 스택" },
    { href: "#overview-meta", label: "메타" },
  ];
  return (
    <nav className="hidden w-[200px] shrink-0 xl:block" aria-label="이 페이지 목차">
      <div className="sticky top-28 pt-1">
        <p className="mb-3 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-[#AEAEB2]">
          <BookOpen size={12} className="opacity-70" aria-hidden />
          이 페이지
        </p>
        <ul className="space-y-0.5 border-l border-[rgba(0,0,0,0.08)]">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="block border-l-2 border-transparent py-1 pl-3 text-xs text-[#86868B] transition-colors hover:border-brand-red/40 hover:text-[#1D1D1F] -ml-px"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

/** Scale 하위 — Display / Heading / Body / Caption */
function SubSubTitle({ children }: { children: React.ReactNode }) {
  return <h4 className="text-sm font-semibold text-[#1D1D1F] mb-3 mt-6 tracking-tight first:mt-0">{children}</h4>;
}

type TypeScaleRow = {
  name: string;
  size: string;
  weight: string;
  token: string;
  sample: string;
};

function TypeScaleTable({ rows }: { rows: TypeScaleRow[] }) {
  return (
    <div className="rounded-2xl border border-[rgba(0,0,0,0.08)] bg-white overflow-hidden mb-2">
      <div className="grid grid-cols-3 text-xs font-medium text-[#86868B] bg-[#F5F5F7] px-5 py-2.5 border-b border-[rgba(0,0,0,0.06)]">
        <span>이름 / 토큰</span>
        <span>크기</span>
        <span>예시</span>
      </div>
      {rows.map(({ name, size, weight, token, sample }) => (
        <div key={token} className="grid grid-cols-3 items-center px-5 py-3 border-b border-[rgba(0,0,0,0.04)] last:border-0 hover:bg-[#F5F5F7]/50 transition-colors">
          <div>
            <p className="text-sm font-medium text-[#1D1D1F]">{name}</p>
            <code className="text-xs font-mono text-brand-red">{token}</code>
          </div>
          <div>
            <p className="text-xs text-[#86868B]">{size}</p>
            <p className="text-xs text-[#AEAEB2]">{weight}</p>
          </div>
          <p className="text-[#1D1D1F] truncate" style={{ fontSize: `clamp(10px, ${parseFloat(size) * 0.55}rem, 28px)`, fontWeight: weight === "Bold" ? 700 : weight === "Semibold" ? 600 : weight === "Medium" ? 500 : 400 }}>
            {sample}
          </p>
        </div>
      ))}
    </div>
  );
}

function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <div className="relative group">
      <pre className="bg-[#1D1D1F] text-[#F5F5F7] rounded-xl px-5 py-4 text-xs font-mono overflow-x-auto leading-relaxed">
        <code>{code}</code>
      </pre>
      <button
        onClick={copy}
        className="absolute top-3 right-3 p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
      >
        {copied ? <Check size={13} className="text-green-400" /> : <Copy size={13} className="text-white/60" />}
      </button>
    </div>
  );
}

function PreviewBox({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-xl border border-[rgba(0,0,0,0.08)] bg-[#F5F5F7] p-6 flex flex-wrap gap-3 items-center ${className}`}>
      {children}
    </div>
  );
}

function TokenRow({ name, value, swatch }: { name: string; value: string; swatch?: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(name);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };
  return (
    <div className="flex items-center gap-3 py-2.5 border-b border-[rgba(0,0,0,0.06)] last:border-0">
      {swatch && (
        <div className="w-6 h-6 rounded-md border border-[rgba(0,0,0,0.1)] shrink-0" style={{ background: swatch }} />
      )}
      <code className="text-xs font-mono text-brand-red flex-1">{name}</code>
      <span className="text-xs text-[#86868B] font-mono">{value}</span>
      <button onClick={copy} className="p-1 rounded hover:bg-black/5 transition-colors">
        {copied ? <Check size={11} className="text-green-500" /> : <Copy size={11} className="text-[#AEAEB2]" />}
      </button>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   Section: Overview — Wiz_DS 전체 맵·카탈로그·빠른 이동
───────────────────────────────────────────────────────── */
function OverviewSection({ onNavigate }: { onNavigate: (sectionId: string) => void }) {
  return (
    <div>
      <DocHero
        id="overview-hero"
        eyebrow="Wiz_DS · Design System"
        badge="v2.0 prototype"
        title="스마트팩토리 제품군을 위한 단일 출처"
        description="Wiz Design System(Wiz_DS)은 색·타이포·간격·컴포넌트를 토큰과 문서로 묶어, 제품 간 UI 일관성과 온보딩 속도를 높입니다. 왼쪽 내비와 같은 구조로, 아래 카탈로그에서 항목을 고른 뒤 바로 해당 문서로 이동할 수 있습니다."
      />

      <div id="overview-principles" className="mb-10 scroll-mt-28">
        <SectionHeading id="overview-principles-h" className="mb-4">
          디자인 원칙
        </SectionHeading>
        <p className="mb-5 text-sm leading-relaxed text-[#86868B]">
          최신 제품 문서(shadcn/ui, Radix, Storybook 중심)에서 공통으로 강조하는 세 가지를 Wiz_DS에도 동일하게 둡니다.
        </p>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {[
            { icon: Palette, title: "일관성", desc: "토큰·팔레트로 색·타이포·간격을 한 언어로 맞춥니다." },
            { icon: Puzzle, title: "재사용성", desc: "프리미티브와 패턴을 조합해 화면을 빠르게 조립합니다." },
            { icon: Shield, title: "접근성", desc: "WCAG 2.1 AA를 목표로 대비·포커스·키보드 흐름을 문서화합니다." },
          ].map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="rounded-2xl border border-[rgba(0,0,0,0.06)] bg-white p-6 shadow-[0_1px_2px_rgba(0,0,0,0.03)] transition-shadow hover:shadow-md"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-brand-red/6">
                <Icon size={20} className="text-brand-red" />
              </div>
              <h3 className="mb-1.5 font-semibold text-[#1D1D1F]">{title}</h3>
              <p className="text-sm leading-relaxed text-[#86868B]">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div id="overview-structure" className="mb-10 scroll-mt-28">
        <SectionHeading id="overview-structure-h" className="mb-4">
          정보 구조 (IA)
        </SectionHeading>
        <p className="mb-4 text-sm leading-relaxed text-[#86868B]">
          루트는 <code className="rounded bg-[#F5F5F7] px-1 font-mono text-xs text-brand-red">Wiz_DS</code>입니다. 그룹은{" "}
          <span className="font-medium text-[#1D1D1F]">Start → Foundations → UI → XP → Docs</span> 순이며, 각 페이지는{" "}
          <code className="rounded font-mono text-xs">Wiz_Color</code> ID와 <code className="rounded font-mono text-xs">wiz-color</code> 라우트 키를 씁니다.
        </p>
        <div className="mb-6 overflow-x-auto rounded-xl border border-[rgba(0,0,0,0.08)] bg-[#1D1D1F] p-4">
          <pre className="whitespace-pre font-mono text-[11px] leading-relaxed text-[#F5F5F7] sm:text-xs">{WIZ_DS_TREE_ASCII}</pre>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {[
            {
              id: "Wiz_Start",
              body: (
                <>
                  <strong className="text-[#1D1D1F]">Wiz_Overview</strong> — 지금 보고 있는 허브. 아래 카탈로그에서 다른 섹션으로 이동합니다.
                </>
              ),
            },
            {
              id: "Wiz_Foundations",
              body: (
                <>
                  색·타이포·스페이싱·그리드·radius·shadow.{" "}
                  <code className="rounded bg-[#F5F5F7] px-1 text-xs">theme.css</code> 변수와 Tailwind <code className="rounded bg-[#F5F5F7] px-1 text-xs">@theme</code>에 연결.
                </>
              ),
            },
            {
              id: "Wiz_UI",
              body: (
                <>
                  <strong className="text-[#1D1D1F]">Components</strong> 프리미티브·<strong className="text-[#1D1D1F]">Patterns</strong> 조합(향후 확장).
                </>
              ),
            },
            {
              id: "Wiz_XP",
              body: <>모션·접근성 — <code className="text-xs">prefers-reduced-motion</code>, WCAG 체크.</>,
            },
            {
              id: "Wiz_Docs",
              body: (
                <>
                  <strong className="text-[#1D1D1F]">Icons</strong> (Lucide), <strong className="text-[#1D1D1F]">Tokens</strong> 복사 가능한 표.
                </>
              ),
            },
          ].map(({ id, body }) => (
            <div key={id} className="rounded-xl border border-[rgba(0,0,0,0.06)] bg-white p-4 text-sm leading-relaxed text-[#3d3d3f] shadow-sm">
              <p className="mb-1.5 font-mono text-xs font-semibold text-brand-red">{id}</p>
              <p>{body}</p>
            </div>
          ))}
        </div>
      </div>

      <div id="overview-browse" className="mb-10 scroll-mt-28">
        <SectionHeading id="overview-browse-h" className="mb-2">
          전체 항목 카탈로그
        </SectionHeading>
        <p className="mb-5 text-sm text-[#86868B]">
          요약·참고 경로를 한 번에 봅니다. 행 끝 <strong className="font-medium text-[#1D1D1F]">자세히</strong>로 해당 문서로 전환하세요.
        </p>
      <div className="hidden overflow-x-auto rounded-2xl border border-[rgba(0,0,0,0.08)] bg-white md:block">
        <div className="min-w-[860px]">
        <div className="grid grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)_minmax(0,2fr)_minmax(0,1.1fr)_auto] gap-2 text-[11px] font-semibold text-[#86868B] bg-[#F5F5F7] px-4 py-2.5 border-b border-[rgba(0,0,0,0.06)]">
          <span>Wiz ID</span>
          <span>그룹</span>
          <span>요약</span>
          <span>참고·소스</span>
          <span className="text-center">이동</span>
        </div>
        {WIZ_NAV_GROUPS.flatMap((g) =>
          g.items.map((item) => {
            const cat = WIZ_SECTION_CATALOG[item.id];
            return (
              <div
                key={item.id}
                className="grid grid-cols-1 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)_minmax(0,2fr)_minmax(0,1.1fr)_auto] gap-2 md:gap-0 items-start px-4 py-3 border-b border-[rgba(0,0,0,0.04)] last:border-0 text-sm hover:bg-[#FAFAFA]/80"
              >
                <div>
                  <code className="text-xs font-mono text-brand-red block">{item.wizId}</code>
                  <span className="text-xs text-[#1D1D1F]">({item.id})</span>
                </div>
                <span className="text-xs text-[#86868B] font-mono">{g.groupWizId}</span>
                <p className="text-[#3d3d3f] text-xs leading-snug">{cat?.summary ?? "—"}</p>
                <p className="text-[10px] text-[#AEAEB2] font-mono break-all leading-snug">{cat?.source ?? "—"}</p>
                <div className="flex justify-end md:justify-center pt-1 md:pt-0">
                  <Button type="button" variant="outline" size="sm" className="h-8 text-xs shrink-0" onClick={() => onNavigate(item.id)}>
                    자세히
                  </Button>
                </div>
              </div>
            );
          }),
        )}
        </div>
      </div>

      {/* 모바일: 카드 리스트 */}
      <div className="mb-10 space-y-3 md:hidden">
        {WIZ_NAV_GROUPS.flatMap((g) =>
          g.items.map((item) => {
            const cat = WIZ_SECTION_CATALOG[item.id];
            const Icon = item.icon;
            return (
              <div key={item.id} className="rounded-xl border border-[rgba(0,0,0,0.08)] bg-white p-4">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-brand-red/6 flex items-center justify-center shrink-0">
                    <Icon size={18} className="text-brand-red" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <code className="text-[10px] font-mono text-brand-red">{item.wizId}</code>
                    <p className="text-sm font-semibold text-[#1D1D1F]">{item.labelKo}</p>
                    <p className="text-[10px] text-[#AEAEB2] font-mono mb-1">{g.groupWizId}</p>
                    <p className="text-xs text-[#86868B] leading-relaxed">{cat?.summary}</p>
                    {cat?.contents && (
                      <ul className="mt-2 text-[11px] text-[#3d3d3f] list-disc pl-4 space-y-0.5">
                        {cat.contents.map((c) => (
                          <li key={c}>{c}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
                <Button type="button" className="w-full mt-3 h-9 text-xs" variant="default" onClick={() => onNavigate(item.id)}>
                  자세히 보기
                </Button>
              </div>
            );
          }),
        )}
      </div>
      </div>

      <div id="overview-stack" className="mb-10 scroll-mt-28">
        <SectionHeading id="overview-stack-h" className="mb-4">
          기술 스택
        </SectionHeading>
        <p className="mb-4 text-sm text-[#86868B]">이 사이트와 동일한 스택으로 문서·컴포넌트를 유지합니다.</p>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          { name: "React 18",     sub: "UI 프레임워크" },
          { name: "TypeScript",   sub: "타입 안전성" },
          { name: "Tailwind v4",  sub: "유틸리티 CSS" },
          { name: "Radix UI",     sub: "Headless 컴포넌트" },
          { name: "Vite 6",       sub: "빌드 툴" },
          { name: "Motion",       sub: "애니메이션" },
          { name: "Lucide React", sub: "아이콘 라이브러리" },
          { name: "Lenis",        sub: "스무스 스크롤" },
        ].map(({ name, sub }) => (
          <div key={name} className="rounded-xl border border-[rgba(0,0,0,0.08)] bg-white px-4 py-3">
            <p className="text-sm font-semibold text-[#1D1D1F]">{name}</p>
            <p className="text-xs text-[#86868B] mt-0.5">{sub}</p>
          </div>
        ))}
      </div>
      </div>

      <div id="overview-meta" className="scroll-mt-28">
        <SectionHeading id="overview-meta-h" className="mb-4">
          메타 · 버전
        </SectionHeading>
      <div className="overflow-hidden rounded-xl border border-[rgba(0,0,0,0.08)] bg-white">
        {[
          { label: "문서 루트",    value: "Wiz_DS" },
          { label: "버전",         value: "2.0.0-prototype" },
          { label: "최종 업데이트", value: "2026.03" },
          { label: "지원 언어",    value: "한국어 / English" },
          { label: "다크모드",     value: "지원 (CSS variables 기반)" },
        ].map(({ label, value }) => (
          <div key={label} className="flex items-center px-5 py-3.5 border-b border-[rgba(0,0,0,0.06)] last:border-0">
            <span className="text-sm text-[#86868B] w-40 shrink-0">{label}</span>
            <span className="text-sm text-[#1D1D1F] font-medium">{value}</span>
          </div>
        ))}
      </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   Section: Colors
   트리: Brand → Palette(Scale) → Semantic → State → Tokens
───────────────────────────────────────────────────────── */

const BRAND_COLORS = [
  { name: "Brand Red", hex: "#B30710", token: "--brand-red", usage: "주요 액션, CTA (메인). palette-red-500과 동일 값" },
  { name: "Brand Red Light", hex: "rgba(179,7,16,0.06)", token: "--brand-red-light", usage: "강조 배경" },
  { name: "Brand Red Muted", hex: "rgba(179,7,16,0.05)", token: "--brand-red-muted", usage: "미세 면" },
  { name: "Apple Blue", hex: "#0071E3", token: "--apple-blue", usage: "링크·정보 (palette-blue-500)" },
  { name: "Apple Red", hex: "#FF3B30", token: "--apple-red", usage: "시스템 경고·삭제 (시맨틱 error와 병용)" },
  { name: "Destructive", hex: "#d4183d", token: "--destructive", usage: "폼·UI 파괴적 액션" },
];

const SEMANTIC_COLORS = [
  { name: "Success", token: "--semantic-success", colorToken: "--color-semantic-success", usage: "성공·완료 아이콘·토스트" },
  { name: "Warning", token: "--semantic-warning", colorToken: "--color-semantic-warning", usage: "주의·대기" },
  { name: "Error",   token: "--semantic-error",   colorToken: "--color-semantic-error",   usage: "오류·실패" },
  { name: "Info",    token: "--semantic-info",    colorToken: "--color-semantic-info",    usage: "안내·정보" },
] as const;

const PALETTE_FAMILIES = ["gray", "blue", "red", "green"] as const;
const PALETTE_STEPS: Record<(typeof PALETTE_FAMILIES)[number], readonly string[]> = {
  gray: ["50", "100", "200", "300", "400", "500", "600", "700", "800", "900", "950"],
  blue: ["50", "100", "200", "300", "400", "500", "600", "700", "800", "900"],
  red:  ["50", "100", "200", "300", "400", "500", "600", "700", "800", "900"],
  green:["50", "100", "200", "300", "400", "500", "600", "700", "800", "900"],
};

function paletteMeta(family: (typeof PALETTE_FAMILIES)[number]) {
  const titles: Record<(typeof PALETTE_FAMILIES)[number], { ko: string; note: string }> = {
    gray:  { ko: "Gray · 그레이", note: "텍스트 계층·보더·배경 (Apple 뉴트럴)" },
    blue:  { ko: "Blue · 블루", note: "링크·정보·포커스" },
    red:   { ko: "Red · 레드", note: "브랜드 레드 스케일 (500 = Brand Red)" },
    green: { ko: "Green · 그린", note: "성공·양호·진행" },
  };
  return titles[family];
}

function ColorSwatch({
  name,
  hex,
  token,
  usage,
  bg,
}: {
  name: string;
  hex: string;
  token: string;
  usage: string;
  /** CSS 변수 등 — 지정 시 배경에 사용 (hex 대신) */
  bg?: string;
}) {
  const [copied, setCopied] = useState(false);
  const copyPayload = bg ?? hex;
  return (
    <div
      className="rounded-2xl border border-[rgba(0,0,0,0.08)] bg-white overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => {
        navigator.clipboard.writeText(copyPayload);
        setCopied(true);
        setTimeout(() => setCopied(false), 1200);
      }}
    >
      <div className="h-20 w-full" style={{ background: bg ?? hex }} />
      <div className="p-3">
        <div className="flex items-center justify-between mb-1">
          <p className="text-xs font-semibold text-[#1D1D1F]">{name}</p>
          {copied ? <Check size={11} className="text-green-500" /> : <Copy size={11} className="text-[#AEAEB2]" />}
        </div>
        <p className="text-xs font-mono text-[#86868B] break-all">{hex}</p>
        <p className="text-xs font-mono text-brand-red mt-0.5">{token}</p>
        <p className="text-xs text-[#AEAEB2] mt-1">{usage}</p>
      </div>
    </div>
  );
}

function PaletteScaleStrip({ family }: { family: (typeof PALETTE_FAMILIES)[number] }) {
  const meta = paletteMeta(family);
  const steps = PALETTE_STEPS[family];
  return (
    <div className="mb-8">
      <SubSubTitle>{meta.ko}</SubSubTitle>
      <p className="text-xs text-[#86868B] mb-3">{meta.note}</p>
      <div className="flex rounded-xl overflow-hidden border border-[rgba(0,0,0,0.08)] min-h-[80px] shadow-sm">
        {steps.map((step) => {
          const paletteVar = `--palette-${family}-${step}`;
          return (
            <div
              key={step}
              className="flex-1 min-w-[28px] flex flex-col justify-end relative group"
              style={{ background: `var(${paletteVar})` }}
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-black/55 flex items-center justify-center">
                <span className="text-[10px] font-mono text-white font-medium px-1">{step}</span>
              </div>
            </div>
          );
        })}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-3 gap-y-2 mt-4 text-[10px] leading-snug">
        {steps.map((step) => {
          const paletteVar = `--palette-${family}-${step}`;
          const colorToken = `--color-${family}-${step}`;
          return (
            <div key={step} className="rounded-lg border border-[rgba(0,0,0,0.06)] bg-white p-2">
              <p className="font-semibold text-[#1D1D1F] mb-1">{family}-{step}</p>
              <p className="font-mono text-brand-red break-all">{paletteVar}</p>
              <p className="font-mono text-[#86868B] mt-0.5 break-all">{colorToken}</p>
              <p className="text-[#AEAEB2] mt-1">Tailwind: {family}-{step}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const STATE_EXAMPLES: {
  label: string;
  icon: typeof CheckCircle2;
  style: CSSProperties;
}[] = [
  { label: "성공", icon: CheckCircle2, style: { background: "var(--state-success-bg)", borderColor: "var(--state-success-border)", color: "var(--state-success-text)" } },
  { label: "정보", icon: Info,         style: { background: "var(--state-info-bg)", borderColor: "var(--state-info-border)", color: "var(--state-info-text)" } },
  { label: "경고", icon: AlertTriangle, style: { background: "var(--state-warning-bg)", borderColor: "var(--state-warning-border)", color: "var(--state-warning-text)" } },
  { label: "오류", icon: AlertCircle,  style: { background: "var(--state-error-bg)", borderColor: "var(--state-error-border)", color: "var(--state-error-text)" } },
];

const COLOR_TOKENS_DOC = [
  { name: "--color-gray-*", value: "palette-gray-* → Tailwind gray-50 … gray-950" },
  { name: "--color-blue-*", value: "palette-blue-* → Tailwind blue-50 … 900" },
  { name: "--color-red-*", value: "palette-red-* → Tailwind red-50 … 900" },
  { name: "--color-green-*", value: "palette-green-* → Tailwind green-50 … 900" },
  { name: "--color-semantic-*", value: "success | warning | error | info" },
  { name: "--color-state-*-bg|border|text", value: "알럿·배너 면/테두리/글자" },
  { name: "브랜드·앱 토큰", value: "--brand-red, --apple-text-*, --primary … (기존과 동일)" },
];

function ColorsSection() {
  return (
    <div>
      <SectionTitle
        title="색상 · Color System"
        desc="브랜드 토큰, 4축 팔레트 스케일, 시맨틱·상태 토큰은 theme.css에 정의되며 @theme에서 --color-*로 Tailwind와 연동됩니다."
      />

      <SubTitle>Brand Colors · 브랜드 색상</SubTitle>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3 mb-4">
        {BRAND_COLORS.map((c) => <ColorSwatch key={c.token} {...c} />)}
      </div>

      <SubTitle>Palette (Scale) · 스케일</SubTitle>
      <p className="text-sm text-[#86868B] mb-4 max-w-3xl">
        원시 스톱은 <code className="text-xs font-mono text-brand-red">--palette-&#123;family&#125;-&#123;step&#125;</code>, Tailwind·디자인 시스템 공용으로는 동일 값이{" "}
        <code className="text-xs font-mono text-brand-red">--color-&#123;family&#125;-&#123;step&#125;</code>에 매핑됩니다.
      </p>
      {PALETTE_FAMILIES.map((f) => (
        <PaletteScaleStrip key={f} family={f} />
      ))}

      <SubTitle>Semantic Colors · 시맨틱</SubTitle>
      <p className="text-xs text-[#86868B] mb-3">아이콘·토스트·배지의 의미 색. 팔레트의 green/blue/red와 조합해 사용합니다.</p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {SEMANTIC_COLORS.map((c) => (
          <ColorSwatch
            key={c.token}
            name={c.name}
            hex={`var(${c.token})`}
            token={`${c.token} / ${c.colorToken}`}
            usage={c.usage}
            bg={`var(${c.token})`}
          />
        ))}
      </div>

      <SubTitle>State Colors · 상태 (면·테두리·글자)</SubTitle>
      <p className="text-xs text-[#86868B] mb-3">
        알럿·인라인 메시지·폼 피드백. <code className="font-mono text-brand-red">var(--state-*-bg)</code> 또는 @theme 등록 시{" "}
        <code className="font-mono text-brand-red">bg-state-success-bg</code> 형태로 사용할 수 있습니다.
      </p>
      <PreviewBox className="flex-col items-stretch gap-2 mb-6">
        {STATE_EXAMPLES.map(({ label, icon: Icon, style }) => (
          <div
            key={label}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-solid text-sm font-medium w-full"
            style={style}
          >
            <Icon size={16} />
            {label} — 상태 토큰 예시입니다.
          </div>
        ))}
      </PreviewBox>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-8 text-xs font-mono text-[#86868B]">
        {[
          ["--state-success-bg / --color-state-success-bg", "성공 배경"],
          ["--state-info-bg / --color-state-info-bg", "정보 배경"],
          ["--state-warning-bg / --color-state-warning-bg", "경고 배경"],
          ["--state-error-bg / --color-state-error-bg", "오류 배경"],
        ].map(([tok, u]) => (
          <div key={tok} className="rounded-lg border border-[rgba(0,0,0,0.06)] bg-[#FAFAFA] px-3 py-2">
            <span className="text-brand-red">{tok}</span>
            <span className="text-[#AEAEB2] ml-2">{u}</span>
          </div>
        ))}
      </div>

      <SubTitle>Tokens · 요약 (전체 목록은 디자인 토큰 메뉴)</SubTitle>
      <div className="rounded-2xl border border-[rgba(0,0,0,0.08)] bg-white overflow-hidden mb-4">
        <div className="grid grid-cols-2 text-xs font-medium text-[#86868B] bg-[#F5F5F7] px-5 py-2.5 border-b border-[rgba(0,0,0,0.06)]">
          <span>토큰 패턴</span>
          <span>설명</span>
        </div>
        {COLOR_TOKENS_DOC.map((row) => (
          <div key={row.name} className="grid grid-cols-2 gap-4 px-5 py-3 border-b border-[rgba(0,0,0,0.04)] last:border-0 text-sm">
            <code className="font-mono text-brand-red break-all">{row.name}</code>
            <span className="text-[#86868B]">{row.value}</span>
          </div>
        ))}
      </div>
      <CodeBlock
        code={`/* CSS */\ncolor: var(--semantic-success);\nbackground: var(--state-success-bg);\nborder-color: var(--state-success-border);\n\n/* Tailwind — palette */\n<p className="text-gray-900 bg-gray-100">뉴트럴</p>\n<p className="text-red-500">레드 500 = 브랜드 스톱</p>\n\n/* 상태 면 (변수 직접) */\n<div style={{ background: 'var(--state-info-bg)', borderColor: 'var(--state-info-border)' }}>…</div>`}
      />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   Section: Typography
   트리: Font Family → Scale(Display|Heading|Body|Caption) → Tokens → Usage
───────────────────────────────────────────────────────── */

const SCALE_DISPLAY: TypeScaleRow[] = [
  { name: "Display 2XL", size: "5.5rem / 88px",  weight: "Bold", token: "--text-display-2xl", sample: "초대형 히어로" },
  { name: "Display XL",  size: "4.5rem / 72px",  weight: "Bold", token: "--text-display-xl",  sample: "대형 히어로" },
  { name: "Display LG",  size: "3.75rem / 60px", weight: "Bold", token: "--text-display-lg",  sample: "섹션 히어로" },
];

/** theme.css @layer base: h1→display-md, h2→display-sm, h3→display-xs, h4→body-xl */
const SCALE_HEADING: TypeScaleRow[] = [
  { name: "Display MD · H1", size: "3rem / 48px",    weight: "Bold",     token: "--text-display-md", sample: "페이지 제목 H1" },
  { name: "Display SM · H2", size: "2.25rem / 36px", weight: "Bold",     token: "--text-display-sm", sample: "섹션 제목 H2" },
  { name: "Display XS · H3", size: "1.75rem / 28px", weight: "Semibold", token: "--text-display-xs", sample: "소제목 H3" },
  { name: "Body XL · H4",    size: "1.25rem / 20px", weight: "Semibold", token: "--text-body-xl",    sample: "카드·블록 제목 H4" },
];

const SCALE_BODY: TypeScaleRow[] = [
  { name: "Body LG", size: "1.125rem / 18px", weight: "Normal", token: "--text-body-lg", sample: "본문 large" },
  { name: "Body MD", size: "1rem / 16px",     weight: "Normal", token: "--text-body-md", sample: "기본 본문" },
  { name: "Body SM", size: "0.9375rem / 15px", weight: "Normal", token: "--text-body-sm", sample: "보조 본문" },
];

const SCALE_CAPTION: TypeScaleRow[] = [
  { name: "Label LG", size: "0.875rem / 14px", weight: "Medium", token: "--text-label-lg", sample: "버튼·폼 레이블" },
  { name: "Label MD", size: "0.8125rem / 13px", weight: "Medium", token: "--text-label-md", sample: "보조 라벨" },
  { name: "Label SM", size: "0.75rem / 12px",  weight: "Medium", token: "--text-label-sm", sample: "캡션·메타" },
];

const FONT_WEIGHTS: { label: string; weight: number; token: string }[] = [
  { label: "Thin",      weight: 100, token: "--font-weight-thin" },
  { label: "Light",     weight: 300, token: "--font-weight-light" },
  { label: "Regular",   weight: 400, token: "--font-weight-normal" },
  { label: "Medium",    weight: 500, token: "--font-weight-medium" },
  { label: "Semibold",  weight: 600, token: "--font-weight-semibold" },
  { label: "Bold",      weight: 700, token: "--font-weight-bold" },
  { label: "Extrabold", weight: 800, token: "--font-weight-extrabold" },
  { label: "Black",     weight: 900, token: "--font-weight-black" },
];

function TypographySection() {
  return (
    <div>
      <SectionTitle
        title="타이포그래피"
        desc="Inter(라틴/숫자) + Pretendard Variable(한글) 스택, fluid Display 스케일과 고정 Label 스케일을 구분합니다."
      />

      {/* ── Font Family ── */}
      <SubTitle>Font Family · 폰트 패밀리</SubTitle>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        {[
          { name: "Sans (기본)", token: "--font-sans",    sample: "Smart Factory\n스마트팩토리 솔루션", mono: false },
          { name: "Display",    token: "--font-display",  sample: "WIZ FACTORY\n위즈팩토리",           mono: false },
          { name: "Mono",       token: "--font-mono",     sample: "const wiz = 'factory'\ntype ID = string", mono: true },
        ].map(({ name, token, sample, mono }) => (
          <div key={name} className="rounded-2xl border border-[rgba(0,0,0,0.08)] bg-white p-5">
            <p className="text-xs font-medium text-[#86868B] mb-1">{name}</p>
            <code className="text-xs font-mono text-brand-red block mb-3">{token}</code>
            <p className={`text-sm leading-relaxed whitespace-pre-line ${mono ? "font-mono" : ""}`}>{sample}</p>
          </div>
        ))}
      </div>

      {/* ── Scale ── */}
      <SubTitle>Scale · 타입 스케일</SubTitle>
      <p className="text-sm text-[#86868B] leading-relaxed mb-4 max-w-3xl">
        뷰포트에 따라 크기가 달라지는 <strong className="text-[#1D1D1F] font-medium">Display·Body</strong>는{" "}
        <code className="text-xs font-mono text-brand-red">clamp()</code> 기반이며,{" "}
        <strong className="text-[#1D1D1F] font-medium">Caption(Label)</strong>은 UI용 고정 rem입니다.
      </p>

      <SubSubTitle>Display · 디스플레이</SubSubTitle>
      <p className="text-xs text-[#86868B] mb-2">히어로·랜딩·최상단 임팩트 타이틀 (fluid)</p>
      <TypeScaleTable rows={SCALE_DISPLAY} />

      <SubSubTitle>Heading · 헤딩</SubSubTitle>
      <p className="text-xs text-[#86868B] mb-2">
        페이지·섹션 구조. <code className="font-mono text-brand-red">theme.css</code> 기본{" "}
        <code className="font-mono text-[#1D1D1F]">h1~h4</code>와 동일한 토큰입니다. Body XL은 H4·리드 문단 겸용입니다.
      </p>
      <TypeScaleTable rows={SCALE_HEADING} />

      <SubSubTitle>Body · 본문</SubSubTitle>
      <p className="text-xs text-[#86868B] mb-2">장문 읽기·설명·리스트. 기본은 Body MD입니다.</p>
      <TypeScaleTable rows={SCALE_BODY} />

      <SubSubTitle>Caption · 캡션</SubSubTitle>
      <p className="text-xs text-[#86868B] mb-2">메타·캡션·배지·폼 보조 텍스트 (Label 스케일)</p>
      <TypeScaleTable rows={SCALE_CAPTION} />

      {/* ── Tokens ── */}
      <SubTitle>Tokens · 관련 토큰</SubTitle>
      <p className="text-sm text-[#86868B] mb-4">
        크기 외에 웨이트·자간·행간은 아래 변수로 맞춥니다. (전체 토큰 목록은 상단 <strong className="text-[#1D1D1F]">디자인 토큰</strong> 메뉴 참고)
      </p>

      <SubSubTitle>Font weight · 폰트 웨이트</SubSubTitle>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {FONT_WEIGHTS.map(({ label, weight, token }) => (
          <div key={label} className="rounded-xl border border-[rgba(0,0,0,0.08)] bg-white px-4 py-3">
            <p className="text-xs text-[#86868B] mb-1">{label} · <code className="font-mono text-brand-red">{token}</code></p>
            <p className="text-base text-[#1D1D1F]" style={{ fontWeight: weight }}>
              WIZ Factory
            </p>
            <p className="text-sm text-[#86868B]" style={{ fontWeight: weight }}>
              위즈팩토리
            </p>
          </div>
        ))}
      </div>

      <SubSubTitle>Letter spacing · 자간</SubSubTitle>
      <div className="rounded-2xl border border-[rgba(0,0,0,0.08)] bg-white overflow-hidden mb-6">
        {[
          { token: "--tracking-tightest", value: "-0.05em",  label: "Tightest", sample: "초대형 디스플레이" },
          { token: "--tracking-tighter",  value: "-0.035em", label: "Tighter",  sample: "대형 헤딩" },
          { token: "--tracking-tight",    value: "-0.02em",  label: "Tight",    sample: "일반 헤딩" },
          { token: "--tracking-snug",     value: "-0.01em",  label: "Snug",     sample: "서브헤딩" },
          { token: "--tracking-normal",   value: "0em",      label: "Normal",   sample: "기본 본문" },
          { token: "--tracking-wide",     value: "0.02em",   label: "Wide",     sample: "UI 레이블" },
          { token: "--tracking-wider",    value: "0.06em",   label: "Wider",    sample: "배지·태그" },
          { token: "--tracking-widest",   value: "0.14em",   label: "Widest",   sample: "올캡스" },
        ].map(({ token, value, label, sample }) => (
          <div key={token} className="flex flex-wrap items-center gap-x-4 gap-y-1 px-5 py-3 border-b border-[rgba(0,0,0,0.06)] last:border-0">
            <code className="text-xs font-mono text-brand-red shrink-0 w-44">{token}</code>
            <span className="text-xs text-[#86868B] w-16">{value}</span>
            <p className="text-sm text-[#1D1D1F] min-w-0" style={{ letterSpacing: value }}>{sample} — {label}</p>
          </div>
        ))}
      </div>

      <SubSubTitle>Line height · 행간</SubSubTitle>
      <div className="rounded-2xl border border-[rgba(0,0,0,0.08)] bg-white overflow-hidden mb-2">
        {[
          { token: "--leading-none", tokenCss: "1", sample: "한 줄 라벨" },
          { token: "--leading-tightest", tokenCss: "1.05", sample: "초대형 디스플레이" },
          { token: "--leading-tight", tokenCss: "1.15", sample: "헤딩" },
          { token: "--leading-snug", tokenCss: "1.3", sample: "서브헤딩" },
          { token: "--leading-normal", tokenCss: "1.5", sample: "본문 기본" },
          { token: "--leading-relaxed", tokenCss: "1.65", sample: "본문 여유" },
          { token: "--leading-loose", tokenCss: "1.8", sample: "긴 본문" },
        ].map(({ token, tokenCss, sample }) => (
          <div key={token} className="flex flex-wrap items-baseline gap-x-4 px-5 py-2.5 border-b border-[rgba(0,0,0,0.06)] last:border-0">
            <code className="text-xs font-mono text-brand-red w-44 shrink-0">{token}</code>
            <span className="text-xs text-[#86868B] w-12">{tokenCss}</span>
            <span className="text-sm text-[#1D1D1F]">{sample}</span>
          </div>
        ))}
      </div>

      {/* ── Usage Guidelines ── */}
      <SubTitle>Usage Guidelines · 사용 가이드</SubTitle>
      <div className="rounded-2xl border border-[rgba(0,0,0,0.08)] bg-white p-6 space-y-4 text-sm text-[#1D1D1F] leading-relaxed">
        <ul className="list-disc pl-5 space-y-2 text-[#3d3d3f]">
          <li><strong className="text-[#1D1D1F]">Display</strong>: 히어로·키 비주얼·마케팅 최상단. 한 화면에 1~2단계만 쓰는 것을 권장합니다.</li>
          <li><strong className="text-[#1D1D1F]">Heading</strong>: 페이지 제목·섹션·카드 제목. 시맨틱 <code className="text-xs font-mono bg-[#F5F5F7] px-1 rounded">h1–h4</code>와 토큰을 함께 맞춥니다.</li>
          <li><strong className="text-[#1D1D1F]">Body</strong>: 설명·리스트·폼 설명 등 읽기 위주 텍스트. 기본은 Body MD입니다.</li>
          <li><strong className="text-[#1D1D1F]">Caption</strong>: 날짜·출처·보조 라벨·테이블 헤더 등 시선이 덜 가는 정보.</li>
          <li><strong className="text-[#1D1D1F]">폰트 스택</strong>: 영문·숫자는 Inter, 한글은 Pretendard Variable이 우선 렌더링됩니다. 코드·토큰은 Mono 패밀리를 사용합니다.</li>
          <li><strong className="text-[#1D1D1F]">중복 토큰</strong>: Display MD와 Body XL은 Heading/본문 용도에 따라 같은 크기를 공유할 수 있습니다. 문맥에 맞게 한 가지만 선택하세요.</li>
        </ul>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   Section: Spacing
───────────────────────────────────────────────────────── */
function SpacingSection() {
  const spacings = [1,2,3,4,5,6,8,10,12,16,20,24,32,40,48,64];
  return (
    <div>
      <SectionTitle title="스페이싱" desc="Tailwind CSS의 4px 기반 스페이싱 시스템을 사용합니다. 1 unit = 4px(0.25rem)입니다." />
      <SubTitle>스페이싱 스케일</SubTitle>
      <div className="rounded-2xl border border-[rgba(0,0,0,0.08)] bg-white overflow-hidden mb-8">
        <div className="grid grid-cols-4 text-xs font-medium text-[#86868B] bg-[#F5F5F7] px-5 py-2.5 border-b border-[rgba(0,0,0,0.06)]">
          <span>토큰</span><span>px</span><span>rem</span><span>시각화</span>
        </div>
        {spacings.map(n => (
          <div key={n} className="grid grid-cols-4 items-center px-5 py-2 border-b border-[rgba(0,0,0,0.04)] last:border-0">
            <code className="text-xs font-mono text-brand-red">space-{n}</code>
            <span className="text-xs text-[#86868B]">{n * 4}px</span>
            <span className="text-xs text-[#86868B]">{(n * 4 / 16).toFixed(2)}rem</span>
            <div className="flex items-center">
              <div className="bg-brand-red/20 rounded" style={{ width: `${Math.min(n * 4, 200)}px`, height: 12 }} />
            </div>
          </div>
        ))}
      </div>

      <SubTitle>패딩 예시</SubTitle>
      <PreviewBox className="flex-col items-start gap-4">
        {[
          { label: "p-2 (8px)",  cls: "p-2" },
          { label: "p-4 (16px)", cls: "p-4" },
          { label: "p-6 (24px)", cls: "p-6" },
          { label: "p-8 (32px)", cls: "p-8" },
        ].map(({ label, cls }) => (
          <div key={label} className="flex items-center gap-3">
            <span className="text-xs text-[#86868B] w-24">{label}</span>
            <div className={`bg-white rounded-lg border border-[rgba(0,0,0,0.1)] ${cls}`}>
              <div className="bg-brand-red/10 rounded w-16 h-4" />
            </div>
          </div>
        ))}
      </PreviewBox>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   Section: Shape
───────────────────────────────────────────────────────── */
function ShapeSection() {
  const radii = [
    { token: "--radius-sm",  value: "calc(0.625rem - 4px)", px: "≈ 6px",  label: "SM" },
    { token: "--radius-md",  value: "calc(0.625rem - 2px)", px: "≈ 8px",  label: "MD" },
    { token: "--radius-lg",  value: "0.625rem",             px: "10px",   label: "LG" },
    { token: "--radius-xl",  value: "calc(0.625rem + 4px)", px: "≈ 14px", label: "XL" },
    { token: "rounded-2xl",  value: "1rem",                 px: "16px",   label: "2XL" },
    { token: "rounded-full", value: "9999px",               px: "원형",   label: "Full" },
  ];
  return (
    <div>
      <SectionTitle title="형태 (Border Radius)" desc="CSS 변수와 Tailwind 유틸리티 클래스를 조합한 모서리 둥글기 시스템입니다." />
      <SubTitle>Border Radius 스케일</SubTitle>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {radii.map(({ token, value, px, label }) => (
          <div key={token} className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 bg-brand-red/10 border-2 border-brand-red/30"
              style={{ borderRadius: value === "9999px" ? "9999px" : value }} />
            <div className="text-center">
              <p className="text-xs font-semibold text-[#1D1D1F]">{label}</p>
              <p className="text-xs text-[#86868B]">{px}</p>
              <code className="text-xs font-mono text-brand-red block mt-0.5">{token}</code>
            </div>
          </div>
        ))}
      </div>

      <SubTitle>실제 사용 예시</SubTitle>
      <PreviewBox className="gap-4">
        {[
          { cls: "rounded",    label: "rounded" },
          { cls: "rounded-lg", label: "rounded-lg" },
          { cls: "rounded-xl", label: "rounded-xl" },
          { cls: "rounded-2xl",label: "rounded-2xl" },
          { cls: "rounded-3xl",label: "rounded-3xl" },
          { cls: "rounded-full",label: "rounded-full" },
        ].map(({ cls, label }) => (
          <div key={cls} className="flex flex-col items-center gap-2">
            <div className={`w-14 h-14 bg-white border-2 border-[#0071E3]/40 ${cls}`} />
            <code className="text-xs font-mono text-[#86868B]">{label}</code>
          </div>
        ))}
      </PreviewBox>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   Section: Elevation
───────────────────────────────────────────────────────── */
function ElevationSection() {
  const shadows = [
    { cls: "shadow-none",  label: "None",  desc: "그림자 없음",           token: "shadow-none" },
    { cls: "shadow-xs",    label: "XS",    desc: "매우 미세한 그림자",    token: "shadow-xs" },
    { cls: "shadow-sm",    label: "SM",    desc: "카드, 입력 필드",       token: "shadow-sm" },
    { cls: "shadow",       label: "Base",  desc: "드롭다운, 팝업",        token: "shadow" },
    { cls: "shadow-md",    label: "MD",    desc: "모달, 다이얼로그",      token: "shadow-md" },
    { cls: "shadow-lg",    label: "LG",    desc: "플로팅 패널",           token: "shadow-lg" },
    { cls: "shadow-xl",    label: "XL",    desc: "사이드 패널",           token: "shadow-xl" },
    { cls: "shadow-2xl",   label: "2XL",   desc: "전체 화면 오버레이",    token: "shadow-2xl" },
  ];
  return (
    <div>
      <SectionTitle title="엘리베이션 (Elevation)" desc="z축 깊이감을 표현하는 그림자 시스템입니다. 레이어 계층에 따라 적절한 그림자를 적용하세요." />
      <SubTitle>Shadow 스케일</SubTitle>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-10">
        {shadows.map(({ cls, label, desc, token }) => (
          <div key={cls} className="flex flex-col items-center gap-3 p-4 bg-[#F5F5F7] rounded-2xl">
            <div className={`w-16 h-16 bg-white rounded-xl ${cls}`} />
            <div className="text-center">
              <p className="text-xs font-semibold text-[#1D1D1F]">{label}</p>
              <p className="text-xs text-[#86868B]">{desc}</p>
              <code className="text-xs font-mono text-brand-red mt-0.5 block">{token}</code>
            </div>
          </div>
        ))}
      </div>

      <SubTitle>z-index 레이어</SubTitle>
      <div className="rounded-2xl border border-[rgba(0,0,0,0.08)] bg-white overflow-hidden">
        {[
          { level: "z-0",   value: 0,    usage: "기본 레이어" },
          { level: "z-10",  value: 10,   usage: "스티키 요소" },
          { level: "z-20",  value: 20,   usage: "드롭다운" },
          { level: "z-30",  value: 30,   usage: "플로팅 버튼" },
          { level: "z-40",  value: 40,   usage: "헤더 / 네비게이션" },
          { level: "z-50",  value: 50,   usage: "모달 / 다이얼로그" },
          { level: "z-[100]", value: 100, usage: "토스트 / 알림" },
        ].map(({ level, value, usage }) => (
          <div key={level} className="flex items-center px-5 py-3 border-b border-[rgba(0,0,0,0.06)] last:border-0">
            <code className="text-xs font-mono text-brand-red w-24">{level}</code>
            <span className="text-xs text-[#86868B] w-16">{value}</span>
            <span className="text-sm text-[#1D1D1F]">{usage}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   Section: Components — UI Primitives (live preview)
───────────────────────────────────────────────────────── */
function ComponentButton() {
  return (
    <div>
      <SubTitle>Button</SubTitle>
      <p className="text-sm text-[#86868B] mb-4 -mt-2">기본 인터랙션 요소입니다. Radix UI Slot 기반으로 다양한 variant와 size를 지원합니다.</p>

      <p className="text-xs font-semibold text-[#1D1D1F] mb-2 mt-5">Variants</p>
      <PreviewBox>
        <Button variant="default">Default</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="destructive">Destructive</Button>
        <Button variant="link">Link</Button>
      </PreviewBox>

      <p className="text-xs font-semibold text-[#1D1D1F] mb-2 mt-5">Sizes</p>
      <PreviewBox>
        <Button size="sm">Small</Button>
        <Button size="default">Default</Button>
        <Button size="lg">Large</Button>
        <Button size="icon"><Star size={16} /></Button>
      </PreviewBox>

      <p className="text-xs font-semibold text-[#1D1D1F] mb-2 mt-5">아이콘 조합</p>
      <PreviewBox>
        <Button><ArrowRight size={16} /> 다음 단계</Button>
        <Button variant="outline"><Download size={16} /> 다운로드</Button>
        <Button variant="secondary"><Star size={16} /> 즐겨찾기</Button>
      </PreviewBox>

      <p className="text-xs font-semibold text-[#1D1D1F] mb-2 mt-5">상태</p>
      <PreviewBox>
        <Button disabled>Disabled</Button>
        <Button disabled variant="outline">Disabled Outline</Button>
      </PreviewBox>

      <div className="mt-5">
        <CodeBlock code={`import { Button } from "@/app/components/ui/button";\n\n<Button variant="default" size="default">클릭</Button>\n<Button variant="outline" size="lg"><ArrowRight /> 다음</Button>`} />
      </div>
    </div>
  );
}

function ComponentBadge() {
  return (
    <div>
      <SubTitle>Badge</SubTitle>
      <p className="text-sm text-[#86868B] mb-4 -mt-2">상태, 카테고리, 수량 등 짧은 정보를 표시할 때 사용합니다.</p>

      <p className="text-xs font-semibold text-[#1D1D1F] mb-2 mt-5">Variants</p>
      <PreviewBox>
        <Badge variant="default">Default</Badge>
        <Badge variant="secondary">Secondary</Badge>
        <Badge variant="outline">Outline</Badge>
        <Badge variant="destructive">Destructive</Badge>
      </PreviewBox>

      <p className="text-xs font-semibold text-[#1D1D1F] mb-2 mt-5">실사용 예시</p>
      <PreviewBox>
        <Badge variant="default">NEW</Badge>
        <Badge variant="secondary">MES</Badge>
        <Badge variant="outline">v2.0</Badge>
        <Badge variant="secondary">스마트팩토리</Badge>
        <Badge variant="destructive">긴급</Badge>
        <Badge variant="outline"><Star size={10} /> 추천</Badge>
      </PreviewBox>

      <div className="mt-5">
        <CodeBlock code={`import { Badge } from "@/app/components/ui/badge";\n\n<Badge variant="default">NEW</Badge>\n<Badge variant="secondary">MES</Badge>`} />
      </div>
    </div>
  );
}

function ComponentInput() {
  return (
    <div>
      <SubTitle>Input</SubTitle>
      <p className="text-sm text-[#86868B] mb-4 -mt-2">텍스트 입력 필드입니다. Tailwind 기반으로 포커스 링, 오류 상태를 지원합니다.</p>

      <p className="text-xs font-semibold text-[#1D1D1F] mb-2 mt-5">기본</p>
      <div className="bg-[#F5F5F7] rounded-xl p-6 flex flex-col gap-3">
        <Input type="text" placeholder="텍스트를 입력하세요" />
        <Input type="email" placeholder="이메일 주소" />
        <Input type="password" placeholder="비밀번호" />
        <Input type="search" placeholder="검색..." />
      </div>

      <p className="text-xs font-semibold text-[#1D1D1F] mb-2 mt-5">레이블 + 입력 조합</p>
      <div className="bg-[#F5F5F7] rounded-xl p-6 flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-[#1D1D1F]">회사명</label>
          <Input placeholder="(주) 위즈팩토리" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-[#1D1D1F]">이메일</label>
          <Input type="email" placeholder="contact@wizfactory.com" />
          <p className="text-xs text-[#86868B]">업무용 이메일을 입력해주세요.</p>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-[#1D1D1F]">비밀번호</label>
          <Input type="password" aria-invalid placeholder="8자 이상 입력" />
          <p className="text-xs text-red-500">비밀번호 형식이 올바르지 않습니다.</p>
        </div>
      </div>

      <div className="mt-5">
        <CodeBlock code={`import { Input } from "@/app/components/ui/input";\n\n<Input type="text" placeholder="텍스트 입력" />\n<Input type="email" aria-invalid placeholder="이메일" />`} />
      </div>
    </div>
  );
}

function ComponentCheckbox() {
  const [checked, setChecked] = useState<boolean | "indeterminate">(false);
  const [checked2, setChecked2] = useState(true);
  return (
    <div>
      <SubTitle>Checkbox</SubTitle>
      <p className="text-sm text-[#86868B] mb-4 -mt-2">단일 또는 다중 항목을 선택할 때 사용합니다.</p>

      <p className="text-xs font-semibold text-[#1D1D1F] mb-2 mt-5">상태</p>
      <PreviewBox className="flex-col items-start gap-3">
        <div className="flex items-center gap-2.5">
          <Checkbox id="c1" checked={checked} onCheckedChange={v => setChecked(v as boolean)} />
          <label htmlFor="c1" className="text-sm text-[#1D1D1F] cursor-pointer">
            {checked ? "선택됨" : "미선택"} (클릭해서 토글)
          </label>
        </div>
        <div className="flex items-center gap-2.5">
          <Checkbox id="c2" checked={checked2} onCheckedChange={v => setChecked2(v as boolean)} />
          <label htmlFor="c2" className="text-sm text-[#1D1D1F] cursor-pointer">이용약관에 동의합니다 (필수)</label>
        </div>
        <div className="flex items-center gap-2.5">
          <Checkbox id="c3" disabled />
          <label htmlFor="c3" className="text-sm text-[#AEAEB2]">비활성화 (Disabled)</label>
        </div>
        <div className="flex items-center gap-2.5">
          <Checkbox id="c4" checked disabled />
          <label htmlFor="c4" className="text-sm text-[#AEAEB2]">비활성화 + 선택됨</label>
        </div>
      </PreviewBox>

      <div className="mt-5">
        <CodeBlock code={`import { Checkbox } from "@/app/components/ui/checkbox";\n\n<Checkbox id="agree" />\n<label htmlFor="agree">이용약관 동의</label>`} />
      </div>
    </div>
  );
}

function ComponentSwitch() {
  const [s1, setS1] = useState(false);
  const [s2, setS2] = useState(true);
  return (
    <div>
      <SubTitle>Switch</SubTitle>
      <p className="text-sm text-[#86868B] mb-4 -mt-2">설정의 켜기/끄기 토글에 사용합니다.</p>

      <p className="text-xs font-semibold text-[#1D1D1F] mb-2 mt-5">상태</p>
      <PreviewBox className="flex-col items-start gap-4">
        <div className="flex items-center justify-between w-full max-w-xs">
          <label className="text-sm text-[#1D1D1F]">알림 수신</label>
          <Switch checked={s1} onCheckedChange={setS1} />
        </div>
        <div className="flex items-center justify-between w-full max-w-xs">
          <label className="text-sm text-[#1D1D1F]">다크 모드</label>
          <Switch checked={s2} onCheckedChange={setS2} />
        </div>
        <div className="flex items-center justify-between w-full max-w-xs">
          <label className="text-sm text-[#AEAEB2]">비활성화</label>
          <Switch disabled />
        </div>
      </PreviewBox>

      <div className="mt-5">
        <CodeBlock code={`import { Switch } from "@/app/components/ui/switch";\n\n<Switch checked={enabled} onCheckedChange={setEnabled} />`} />
      </div>
    </div>
  );
}

function ComponentTabs() {
  return (
    <div>
      <SubTitle>Tabs</SubTitle>
      <p className="text-sm text-[#86868B] mb-4 -mt-2">관련 콘텐츠를 그룹화하여 전환하는 네비게이션 패턴입니다.</p>

      <PreviewBox className="flex-col items-start">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList>
            <TabsTrigger value="overview">개요</TabsTrigger>
            <TabsTrigger value="features">기능</TabsTrigger>
            <TabsTrigger value="specs">사양</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="mt-4">
            <div className="rounded-xl bg-white border border-[rgba(0,0,0,0.08)] p-4">
              <p className="text-sm text-[#1D1D1F]">제품 개요 콘텐츠가 여기에 표시됩니다.</p>
            </div>
          </TabsContent>
          <TabsContent value="features" className="mt-4">
            <div className="rounded-xl bg-white border border-[rgba(0,0,0,0.08)] p-4">
              <p className="text-sm text-[#1D1D1F]">주요 기능 목록이 여기에 표시됩니다.</p>
            </div>
          </TabsContent>
          <TabsContent value="specs" className="mt-4">
            <div className="rounded-xl bg-white border border-[rgba(0,0,0,0.08)] p-4">
              <p className="text-sm text-[#1D1D1F]">기술 사양 정보가 여기에 표시됩니다.</p>
            </div>
          </TabsContent>
        </Tabs>
      </PreviewBox>

      <div className="mt-5">
        <CodeBlock code={`import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/app/components/ui/tabs";\n\n<Tabs defaultValue="tab1">\n  <TabsList>\n    <TabsTrigger value="tab1">탭 1</TabsTrigger>\n    <TabsTrigger value="tab2">탭 2</TabsTrigger>\n  </TabsList>\n  <TabsContent value="tab1">콘텐츠 1</TabsContent>\n</Tabs>`} />
      </div>
    </div>
  );
}

function ComponentAvatar() {
  return (
    <div>
      <SubTitle>Avatar</SubTitle>
      <p className="text-sm text-[#86868B] mb-4 -mt-2">사용자 프로필 이미지 또는 이니셜을 표시합니다.</p>

      <p className="text-xs font-semibold text-[#1D1D1F] mb-2 mt-5">크기 변형</p>
      <PreviewBox>
        {[
          { size: "size-6",  label: "XS" },
          { size: "size-8",  label: "SM" },
          { size: "size-10", label: "MD" },
          { size: "size-12", label: "LG" },
          { size: "size-16", label: "XL" },
        ].map(({ size, label }) => (
          <div key={size} className="flex flex-col items-center gap-1.5">
            <Avatar className={size}>
              <AvatarFallback className="bg-brand-red/10 text-brand-red font-semibold" style={{ fontSize: `${parseInt(size.replace("size-", "")) * 0.3}px` }}>
                WF
              </AvatarFallback>
            </Avatar>
            <span className="text-xs text-[#86868B]">{label}</span>
          </div>
        ))}
      </PreviewBox>

      <p className="text-xs font-semibold text-[#1D1D1F] mb-2 mt-5">조합 예시</p>
      <PreviewBox className="flex-col items-start gap-3">
        {[
          { name: "김위즈", role: "개발팀", initials: "김위", color: "bg-blue-100 text-blue-600" },
          { name: "이팩토리", role: "디자인팀", initials: "이팩", color: "bg-green-100 text-green-600" },
          { name: "박스마트", role: "영업팀", initials: "박스", color: "bg-purple-100 text-purple-600" },
        ].map(({ name, role, initials, color }) => (
          <div key={name} className="flex items-center gap-3">
            <Avatar className="size-9">
              <AvatarFallback className={`text-xs font-semibold ${color}`}>{initials}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium text-[#1D1D1F]">{name}</p>
              <p className="text-xs text-[#86868B]">{role}</p>
            </div>
          </div>
        ))}
      </PreviewBox>

      <div className="mt-5">
        <CodeBlock code={`import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar";\n\n<Avatar>\n  <AvatarImage src="/avatar.jpg" alt="User" />\n  <AvatarFallback>WF</AvatarFallback>\n</Avatar>`} />
      </div>
    </div>
  );
}

function ComponentSkeleton() {
  return (
    <div>
      <SubTitle>Skeleton</SubTitle>
      <p className="text-sm text-[#86868B] mb-4 -mt-2">콘텐츠 로딩 중 플레이스홀더로 사용합니다. 로딩 상태의 UX를 향상시킵니다.</p>

      <p className="text-xs font-semibold text-[#1D1D1F] mb-2 mt-5">기본</p>
      <PreviewBox className="flex-col items-start gap-2">
        <Skeleton className="w-48 h-4 rounded" />
        <Skeleton className="w-64 h-4 rounded" />
        <Skeleton className="w-40 h-4 rounded" />
      </PreviewBox>

      <p className="text-xs font-semibold text-[#1D1D1F] mb-2 mt-5">카드 로딩 패턴</p>
      <PreviewBox>
        <div className="flex items-center gap-3 w-full max-w-xs">
          <Skeleton className="size-10 rounded-full shrink-0" />
          <div className="flex-1 flex flex-col gap-2">
            <Skeleton className="h-3 w-3/4 rounded" />
            <Skeleton className="h-3 w-1/2 rounded" />
          </div>
        </div>
        <div className="flex flex-col gap-2 w-full max-w-xs">
          <Skeleton className="w-full h-32 rounded-xl" />
          <Skeleton className="h-3 w-full rounded" />
          <Skeleton className="h-3 w-2/3 rounded" />
          <div className="flex gap-2 mt-1">
            <Skeleton className="h-7 w-16 rounded-md" />
            <Skeleton className="h-7 w-16 rounded-md" />
          </div>
        </div>
      </PreviewBox>

      <div className="mt-5">
        <CodeBlock code={`import { Skeleton } from "@/app/components/ui/skeleton";\n\n// 텍스트 로딩\n<Skeleton className="w-48 h-4 rounded" />\n\n// 아바타 로딩\n<Skeleton className="size-10 rounded-full" />`} />
      </div>
    </div>
  );
}

function ComponentCard() {
  return (
    <div>
      <SubTitle>Card</SubTitle>
      <p className="text-sm text-[#86868B] mb-4 -mt-2">콘텐츠를 그룹화하는 컨테이너입니다. 정보 계층을 시각적으로 구분합니다.</p>

      <p className="text-xs font-semibold text-[#1D1D1F] mb-2 mt-5">기본 카드</p>
      <PreviewBox className="flex-col items-stretch gap-4">
        <Card className="p-5">
          <h4 className="text-sm font-semibold text-[#1D1D1F] mb-1">기본 카드</h4>
          <p className="text-sm text-[#86868B]">카드 컴포넌트는 관련 정보를 하나의 시각적 단위로 묶습니다.</p>
        </Card>

        <Card className="p-5 border-brand-red/30 bg-[rgba(179,7,16,0.02)]">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-brand-red/10 flex items-center justify-center shrink-0">
              <Cpu size={16} className="text-brand-red" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-[#1D1D1F] mb-1">WIZ-MES</h4>
              <p className="text-sm text-[#86868B]">제조실행시스템 — 생산 현장을 실시간으로 모니터링합니다.</p>
              <div className="flex gap-1.5 mt-3">
                <Badge variant="secondary">MES</Badge>
                <Badge variant="outline">v2.1</Badge>
              </div>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { icon: Database, label: "데이터베이스", value: "PostgreSQL 15", color: "bg-blue-50 text-blue-500" },
            { icon: Cloud,    label: "클라우드",    value: "AWS / Azure",    color: "bg-sky-50 text-sky-500" },
            { icon: Monitor,  label: "디바이스",    value: "Web / Mobile",   color: "bg-green-50 text-green-500" },
          ].map(({ icon: Icon, label, value, color }) => (
            <Card key={label} className="p-4">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-3 ${color}`}>
                <Icon size={16} />
              </div>
              <p className="text-xs text-[#86868B]">{label}</p>
              <p className="text-sm font-semibold text-[#1D1D1F] mt-0.5">{value}</p>
            </Card>
          ))}
        </div>
      </PreviewBox>

      <div className="mt-5">
        <CodeBlock code={`import { Card } from "@/app/components/ui/card";\n\n<Card className="p-5">\n  <h4>카드 제목</h4>\n  <p>카드 내용...</p>\n</Card>`} />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   Section: Components — Project Components (documentation)
───────────────────────────────────────────────────────── */

interface PropDef { name: string; type: string; required: boolean; desc: string; }
interface CompDoc {
  name: string;
  file: string;
  desc: string;
  props?: PropDef[];
  features: string[];
  code: string;
}

const UI_COMPONENTS: CompDoc[] = [
  {
    name: "Button",
    file: "components/ui/button.tsx",
    desc: "기본 인터랙션 요소. Radix UI Slot 기반으로 asChild 패턴을 지원합니다.",
    props: [
      { name: "variant", type: '"default" | "secondary" | "outline" | "ghost" | "destructive" | "link"', required: false, desc: "버튼 스타일 variant" },
      { name: "size",    type: '"default" | "sm" | "lg" | "icon"', required: false, desc: "버튼 크기" },
      { name: "asChild", type: "boolean", required: false, desc: "Slot 패턴으로 자식 요소에 props 위임" },
    ],
    features: ["6가지 variant", "4가지 size", "아이콘 조합", "Disabled 상태", "asChild 패턴"],
    code: `<Button variant="default" size="lg">\n  <ArrowRight size={16} /> 시작하기\n</Button>`,
  },
  {
    name: "Badge",
    file: "components/ui/badge.tsx",
    desc: "상태, 카테고리, 태그 등 짧은 레이블 표시에 사용합니다.",
    props: [
      { name: "variant", type: '"default" | "secondary" | "outline" | "destructive"', required: false, desc: "배지 스타일" },
    ],
    features: ["4가지 variant", "아이콘 포함 가능", "asChild 패턴"],
    code: `<Badge variant="secondary">MES</Badge>\n<Badge variant="outline"><Star size={10} /> 추천</Badge>`,
  },
  {
    name: "Input",
    file: "components/ui/input.tsx",
    desc: "텍스트 입력 필드. 포커스 링과 오류 상태(aria-invalid)를 지원합니다.",
    props: [
      { name: "type",       type: "string",  required: false, desc: "HTML input type" },
      { name: "aria-invalid", type: "boolean", required: false, desc: "오류 상태 스타일 활성화" },
    ],
    features: ["포커스 링 애니메이션", "오류 상태", "Disabled 상태", "파일 업로드 지원"],
    code: `<Input type="email" placeholder="이메일 입력" />\n<Input aria-invalid placeholder="오류 상태" />`,
  },
  {
    name: "Checkbox",
    file: "components/ui/checkbox.tsx",
    desc: "단일 또는 다중 항목 선택. Radix UI CheckboxPrimitive 기반입니다.",
    props: [
      { name: "checked",         type: "boolean | 'indeterminate'", required: false, desc: "선택 상태" },
      { name: "onCheckedChange", type: "(value: boolean) => void",  required: false, desc: "상태 변경 콜백" },
      { name: "disabled",        type: "boolean", required: false, desc: "비활성화" },
    ],
    features: ["Indeterminate 상태", "Disabled 상태", "키보드 접근성"],
    code: `<Checkbox\n  checked={checked}\n  onCheckedChange={setChecked}\n  id="agree"\n/>\n<label htmlFor="agree">동의합니다</label>`,
  },
  {
    name: "Switch",
    file: "components/ui/switch.tsx",
    desc: "설정 켜기/끄기 토글. Radix UI SwitchPrimitive 기반입니다.",
    props: [
      { name: "checked",         type: "boolean", required: false, desc: "활성화 상태" },
      { name: "onCheckedChange", type: "(value: boolean) => void", required: false, desc: "상태 변경 콜백" },
      { name: "disabled",        type: "boolean", required: false, desc: "비활성화" },
    ],
    features: ["슬라이드 애니메이션", "Disabled 상태", "키보드 접근성"],
    code: `<Switch checked={enabled} onCheckedChange={setEnabled} />`,
  },
  {
    name: "Tabs",
    file: "components/ui/tabs.tsx",
    desc: "관련 콘텐츠를 그룹화하는 탭 네비게이션. Radix UI TabsPrimitive 기반입니다.",
    props: [
      { name: "defaultValue", type: "string", required: false, desc: "초기 활성 탭 값" },
      { name: "value",        type: "string", required: false, desc: "제어 컴포넌트 모드 탭 값" },
      { name: "onValueChange",type: "(value: string) => void", required: false, desc: "탭 변경 콜백" },
    ],
    features: ["Tabs / TabsList / TabsTrigger / TabsContent", "제어·비제어 모드", "키보드 화살표 탐색"],
    code: `<Tabs defaultValue="tab1">\n  <TabsList>\n    <TabsTrigger value="tab1">탭 1</TabsTrigger>\n    <TabsTrigger value="tab2">탭 2</TabsTrigger>\n  </TabsList>\n  <TabsContent value="tab1">콘텐츠</TabsContent>\n</Tabs>`,
  },
  {
    name: "Avatar",
    file: "components/ui/avatar.tsx",
    desc: "사용자 프로필 이미지 또는 이니셜 표시. 이미지 로드 실패 시 Fallback으로 자동 전환됩니다.",
    props: [],
    features: ["AvatarImage / AvatarFallback 분리", "이미지 로드 실패 자동 fallback", "자유로운 크기 조절"],
    code: `<Avatar className="size-10">\n  <AvatarImage src="/avatar.jpg" alt="User" />\n  <AvatarFallback>WF</AvatarFallback>\n</Avatar>`,
  },
  {
    name: "Skeleton",
    file: "components/ui/skeleton.tsx",
    desc: "콘텐츠 로딩 중 플레이스홀더. shimmer 애니메이션으로 로딩 상태를 표현합니다.",
    props: [],
    features: ["shimmer 애니메이션", "자유로운 크기/형태 조절", "조합 패턴 지원"],
    code: `<Skeleton className="w-48 h-4 rounded" />\n<Skeleton className="size-10 rounded-full" />`,
  },
  {
    name: "Card",
    file: "components/ui/card.tsx",
    desc: "콘텐츠 그룹화 컨테이너. 그림자와 border로 시각적 계층을 표현합니다.",
    props: [],
    features: ["단순 div wrapper", "border + shadow 기본 스타일", "자유로운 내부 구성"],
    code: `<Card className="p-5">\n  <h4>카드 제목</h4>\n  <p>카드 내용</p>\n</Card>`,
  },
];

const LAYOUT_COMPONENTS: CompDoc[] = [
  {
    name: "Layout",
    file: "components/Layout.tsx",
    desc: "Header, 페이지 콘텐츠(Outlet), Footer, 모달(ContactModal · SolutionModal)을 감싸는 루트 레이아웃 컴포넌트입니다.",
    features: ["React Router Outlet", "ContactModal 상태 관리", "SolutionModal 상태 관리", "ScrollToTop 통합"],
    code: `// routes.tsx\n{\n  path: "/",\n  Component: Layout,\n  children: [\n    { index: true, element: <HomePage /> },\n    { path: "solution/:id", element: <SolutionDetailPage /> },\n  ],\n}`,
  },
  {
    name: "Header",
    file: "components/Header.tsx",
    desc: "스크롤 감지 기반 배경 전환, 데스크톱 드롭다운 메뉴, 모바일 풀스크린 메뉴, 알림 바텀시트를 포함한 고정 네비게이션 헤더입니다.",
    features: [
      "스크롤 기반 배경 투명→불투명 전환",
      "데스크톱 3열 그리드 드롭다운",
      "모바일 풀스크린 메뉴",
      "드래그 가능한 알림 바텀시트",
      "언어 토글 (한국어/English)",
      "Spring 애니메이션 (Motion)",
    ],
    code: `// Layout.tsx 내부에서 자동 렌더링\n<Header />`,
  },
  {
    name: "WizFooter",
    file: "components/WizFooter.tsx",
    desc: "솔루션·플랫폼·리소스·회사·법적고지 5개 열로 구성된 멀티컬럼 푸터입니다.",
    features: [
      "5개 링크 그룹",
      "모바일 2열 / 데스크톱 5열 반응형",
      "#contact 클릭 시 ContactModal 이벤트 디스패치",
      "LanguageContext 기반 다국어",
    ],
    code: `// Layout.tsx 내부에서 자동 렌더링\n<WizFooter />`,
  },
];

const SECTION_COMPONENTS: CompDoc[] = [
  {
    name: "WizHero",
    file: "components/WizHero.tsx",
    desc: "3개의 ambient gradient blob 애니메이션과 Staggered 입장 효과를 가진 메인 히어로 섹션입니다.",
    features: [
      "3개 gradient blob 무한 애니메이션",
      "Staggered 텍스트 입장 효과",
      "그라디언트 텍스트 헤드라인 (blue→purple→violet)",
      "스크롤 인디케이터 (바운싱 chevron)",
      "LanguageContext 다국어",
    ],
    code: `// HomePage.tsx\n<WizHero />`,
  },
  {
    name: "WizArchitecture",
    file: "components/WizArchitecture.tsx",
    desc: "Operations & Insights → Domain Solutions → Platform 3계층 시스템 아키텍처 시각화 컴포넌트입니다.",
    features: [
      "수직 그라디언트 타임라인 (데스크톱)",
      "아코디언 카드 (모바일)",
      "레이어 구분선 particle flow 애니메이션",
      "AnimatedIcons 통합 (13종)",
      "호버 shadow elevation 효과",
    ],
    code: `// HomePage.tsx\n<WizArchitecture />`,
  },
  {
    name: "WizPlatformBento",
    file: "components/WizPlatformBento.tsx",
    desc: "대시보드·워크플로우·알람·리포트·API 5가지 플랫폼 기능을 다크 테마 Bento 그리드로 소개하는 섹션입니다.",
    features: [
      "다크 테마 (#111111) + lime 액센트 (#C8F135)",
      "애니메이션 바 차트 (sine-wave)",
      "실시간 알림 카드 (pulsing dot)",
      "카운트업 통계 숫자",
      "호버 lime glow 효과",
    ],
    code: `// HomePage.tsx\n<WizPlatformBento />`,
  },
  {
    name: "WizNavigation",
    file: "components/WizNavigation.tsx",
    desc: "드래그 가능한 카테고리 필터 탭 컴포넌트입니다. Spring 애니메이션으로 활성 탭 pill이 부드럽게 이동합니다.",
    props: [
      { name: "activeCategory", type: "CategoryKey", required: true, desc: "현재 활성 카테고리 키" },
      { name: "onCategoryChange", type: "(cat: CategoryKey) => void", required: true, desc: "카테고리 변경 콜백" },
    ],
    features: [
      "6개 카테고리 (전체·플랫폼·생산·품질·설비·프로젝트)",
      "드래그로 탭 전환 (velocity 기반 snapping)",
      "Spring pill 위치·너비 애니메이션",
      "모바일 인라인 / 데스크톱 인라인",
    ],
    code: `<WizNavigation\n  activeCategory={activeCategory}\n  onCategoryChange={setActiveCategory}\n/>`,
  },
  {
    name: "WizSolutionCard",
    file: "components/WizSolutionCard.tsx",
    desc: "각 솔루션의 기능·배지·액션 버튼을 포함한 상세 제품 카드 컴포넌트입니다.",
    props: [
      { name: "solution",    type: "Solution", required: true,  desc: "솔루션 데이터 객체 (solutions.ts)" },
      { name: "index",       type: "number",   required: true,  desc: "카드 순서 인덱스 (애니메이션용)" },
      { name: "onOpenModal", type: "(solution: Solution) => void", required: true, desc: "상세 모달 열기 콜백" },
    ],
    features: [
      "카테고리별 색상 배지",
      "이름 길이 기반 동적 폰트 크기",
      "3개 기능 행 (아이콘·제목·태그·부제목)",
      "자세히 보기·브로셔·데모 버튼",
      "호버 shadow 상승 효과",
    ],
    code: `<WizSolutionCard\n  solution={solution}\n  index={idx}\n  onOpenModal={handleOpenModal}\n/>`,
  },
  {
    name: "WizIndustries",
    file: "components/WizIndustries.tsx",
    desc: "전자·배터리·자동차·제조·반도체 5개 산업군을 커스텀 SVG 애니메이션 아이콘과 통계로 소개하는 섹션입니다.",
    features: [
      "5종 커스텀 SVG 애니메이션 아이콘",
      "스크롤 InView 기반 렌더링 (성능 최적화)",
      "배경 gradient blob (pre-blurred)",
      "4개 핵심 지표 통계 카드",
      "LanguageContext 다국어",
    ],
    code: `// HomePage.tsx\n<WizIndustries />`,
  },
  {
    name: "WizCaseStudies",
    file: "components/WizCaseStudies.tsx",
    desc: "고객 성공 사례 3건을 이미지·지표·CTA와 함께 보여주는 케이스 스터디 섹션입니다.",
    features: [
      "스크롤 InView 카운트업 MetricBadge",
      "이미지 호버 zoom 효과",
      "카테고리·기간 배지",
      "하단 문의 CTA 버튼",
      "LanguageContext 다국어",
    ],
    code: `// HomePage.tsx\n<WizCaseStudies />`,
  },
];

const MODAL_COMPONENTS: CompDoc[] = [
  {
    name: "ContactModal",
    file: "components/ContactModal.tsx",
    desc: "2단계 플로우(폼 입력 → 완료 화면)를 가진 문의 폼 모달입니다. 좌측 연락처 패널 + 우측 폼 레이아웃입니다.",
    props: [
      { name: "isOpen",  type: "boolean",    required: true, desc: "모달 표시 여부" },
      { name: "onClose", type: "() => void", required: true, desc: "닫기 콜백" },
    ],
    features: [
      "2단계 플로우 (폼 → 완료 체크마크 애니메이션)",
      "이름·이메일·산업군·메시지 4개 필드",
      "이메일 유효성 검사",
      "Lenis 스크롤 잠금 통합",
      "Spring 진입/퇴장 애니메이션",
    ],
    code: `<ContactModal\n  isOpen={isContactOpen}\n  onClose={() => setIsContactOpen(false)}\n/>`,
  },
  {
    name: "SolutionModal",
    file: "components/SolutionModal.tsx",
    desc: "선택된 솔루션의 상세 정보(기능·모듈·기술스택·도입효과)를 풀스크린 모달로 표시합니다.",
    props: [
      { name: "solution", type: "Solution | null", required: true,  desc: "표시할 솔루션 객체 (null이면 닫힘)" },
      { name: "onClose",  type: "() => void",      required: true,  desc: "닫기 콜백" },
    ],
    features: [
      "솔루션별 동적 콘텐츠 렌더링",
      "기능·모듈·기술스택·도입효과 탭",
      "커스텀 스크롤바 (Apple 스타일)",
      "ESC 키 닫기",
      "배경 클릭 닫기",
    ],
    code: `<SolutionModal\n  solution={selectedSolution}\n  onClose={() => setSelectedSolution(null)}\n/>`,
  },
];

const UTIL_COMPONENTS: CompDoc[] = [
  {
    name: "AnimatedIcons",
    file: "components/AnimatedIcons.tsx",
    desc: "WizArchitecture의 3계층(Operations · Domain · Platform)에서 사용되는 13종 커스텀 SVG 애니메이션 아이콘 모음입니다.",
    props: [
      { name: "color", type: "string", required: false, desc: "아이콘 색상 (CSS color 값)" },
    ],
    features: [
      "Layer 3 Operations: ManufacturingIcon · CollaborationIcon · DataVizIcon · InsightsIcon",
      "Layer 2 Domain: GearIcon · QualityIcon · SlidersIcon · KanbanIcon",
      "Layer 1 Platform: DashboardIcon · WorkflowIcon · BellIcon · ReportIcon · APIIcon",
      "Motion 무한 루프 애니메이션",
    ],
    code: `import { DashboardIcon, GearIcon } from "./AnimatedIcons";\n\n<DashboardIcon color="#B30710" />\n<GearIcon color="#0071E3" />`,
  },
  {
    name: "ScrollToTop",
    file: "components/SmoothScroll.tsx",
    desc: "라우트 변경 시 스크롤을 최상단으로 이동시키는 경량 래퍼 컴포넌트입니다.",
    features: [
      "useLocation 기반 pathname 감지",
      "라우트 전환 시 window.scrollTo(0, 0) 호출",
      "네이티브 브라우저 스크롤 사용 (외부 라이브러리 없음)",
    ],
    code: `// Layout.tsx에서 래핑\n<ScrollToTop>\n  <Header />\n  <Outlet />\n  <WizFooter />\n</ScrollToTop>`,
  },
  {
    name: "shared",
    file: "components/shared.tsx",
    desc: "프로젝트 공통 유틸리티 — LGSymbol SVG 컴포넌트와 디바이스 목업 좌표 상수를 제공합니다.",
    props: [
      { name: "size (LGSymbol)", type: "number", required: false, desc: "LG 심볼 SVG 크기 (px)" },
    ],
    features: [
      "LGSymbol: pink/white LG 로고 SVG",
      "PHONE_SCREEN · TABLET_SCREEN · MONITOR_SCREEN · LAPTOP_SCREEN 좌표 상수",
      "디바이스 목업 SVG 에셋 re-export",
    ],
    code: `import { LGSymbol, PHONE_SCREEN } from "./shared";\n\n<LGSymbol size={48} />`,
  },
  {
    name: "ErrorBoundary",
    file: "components/ErrorBoundary.tsx",
    desc: "하위 컴포넌트 트리의 JavaScript 에러를 캐치하는 React 클래스 컴포넌트입니다.",
    features: [
      "componentDidCatch로 에러 로깅",
      "Fallback UI 렌더링",
      "페이지 전체 크래시 방지",
    ],
    code: `<ErrorBoundary fallback={<ErrorPage />}>\n  <RiskyComponent />\n</ErrorBoundary>`,
  },
];

function PropTable({ props }: { props: PropDef[] }) {
  if (!props.length) return null;
  return (
    <div className="rounded-xl border border-[rgba(0,0,0,0.08)] overflow-hidden mt-3">
      <div className="grid grid-cols-4 text-xs font-medium text-[#86868B] bg-[#F5F5F7] px-4 py-2 border-b border-[rgba(0,0,0,0.06)]">
        <span>Props</span><span>Type</span><span>필수</span><span>설명</span>
      </div>
      {props.map(p => (
        <div key={p.name} className="grid grid-cols-4 items-start px-4 py-2.5 border-b border-[rgba(0,0,0,0.04)] last:border-0 text-xs">
          <code className="font-mono text-brand-red">{p.name}</code>
          <code className="font-mono text-[#86868B] break-all pr-2">{p.type}</code>
          <span className={p.required ? "text-brand-red font-medium" : "text-[#AEAEB2]"}>{p.required ? "필수" : "선택"}</span>
          <span className="text-[#1D1D1F]">{p.desc}</span>
        </div>
      ))}
    </div>
  );
}

function CompCard({ comp }: { comp: CompDoc }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-2xl border border-[rgba(0,0,0,0.08)] bg-white overflow-hidden">
      <button
        className="w-full flex items-start justify-between px-5 py-4 hover:bg-[#F5F5F7]/60 transition-colors"
        onClick={() => setOpen(v => !v)}
      >
        <div className="text-left">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-semibold text-[#1D1D1F]">{comp.name}</span>
            <code className="text-xs font-mono text-[#86868B] bg-[#F5F5F7] px-1.5 py-0.5 rounded">{comp.file}</code>
          </div>
          <p className="text-xs text-[#86868B] leading-relaxed">{comp.desc}</p>
        </div>
        <ChevronRight size={14} className={`text-[#AEAEB2] shrink-0 ml-4 mt-0.5 transition-transform ${open ? "rotate-90" : ""}`} />
      </button>

      {open && (
        <div className="border-t border-[rgba(0,0,0,0.06)] px-5 py-4">
          <p className="text-xs font-semibold text-[#1D1D1F] mb-2">주요 기능</p>
          <div className="flex flex-wrap gap-1.5 mb-4">
            {comp.features.map(f => (
              <span key={f} className="text-xs bg-[#F5F5F7] text-[#86868B] px-2 py-0.5 rounded-md">{f}</span>
            ))}
          </div>
          {comp.props && comp.props.length > 0 && (
            <>
              <p className="text-xs font-semibold text-[#1D1D1F] mb-1">Props</p>
              <PropTable props={comp.props} />
            </>
          )}
          <p className="text-xs font-semibold text-[#1D1D1F] mt-4 mb-2">사용 예시</p>
          <CodeBlock code={comp.code} />
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   Live preview for UI components
───────────────────────────────────────────────────────── */
function UILivePreview({ name }: { name: string }) {
  const [checked, setChecked] = useState(false);
  const [sw, setSw] = useState(true);
  if (name === "Button") return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        <Button variant="default">Default</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="destructive">Destructive</Button>
        <Button variant="link">Link</Button>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button size="sm">Small</Button>
        <Button size="default">Default</Button>
        <Button size="lg">Large</Button>
        <Button size="icon"><Star size={16}/></Button>
        <Button disabled>Disabled</Button>
      </div>
    </div>
  );
  if (name === "Badge") return (
    <div className="flex flex-wrap gap-2">
      <Badge variant="default">Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="secondary">MES</Badge>
      <Badge variant="outline">v2.0</Badge>
    </div>
  );
  if (name === "Input") return (
    <div className="flex flex-col gap-2 max-w-xs">
      <Input placeholder="기본 입력" />
      <Input type="password" placeholder="비밀번호" />
      <Input aria-invalid placeholder="오류 상태" />
      <Input disabled placeholder="비활성화" />
    </div>
  );
  if (name === "Checkbox") return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2"><Checkbox id="lp1" checked={checked} onCheckedChange={v => setChecked(v as boolean)} /><label htmlFor="lp1" className="text-sm">클릭하여 토글</label></div>
      <div className="flex items-center gap-2"><Checkbox id="lp2" checked disabled /><label htmlFor="lp2" className="text-sm text-[#AEAEB2]">비활성화 (선택됨)</label></div>
    </div>
  );
  if (name === "Switch") return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3"><Switch checked={sw} onCheckedChange={setSw} /><span className="text-sm">{sw ? "켜짐" : "꺼짐"}</span></div>
      <div className="flex items-center gap-3"><Switch disabled /><span className="text-sm text-[#AEAEB2]">비활성화</span></div>
    </div>
  );
  if (name === "Tabs") return (
    <Tabs defaultValue="a">
      <TabsList><TabsTrigger value="a">탭 A</TabsTrigger><TabsTrigger value="b">탭 B</TabsTrigger><TabsTrigger value="c">탭 C</TabsTrigger></TabsList>
      <TabsContent value="a"><div className="mt-2 p-3 rounded-lg bg-white border text-sm text-[#86868B]">탭 A 콘텐츠</div></TabsContent>
      <TabsContent value="b"><div className="mt-2 p-3 rounded-lg bg-white border text-sm text-[#86868B]">탭 B 콘텐츠</div></TabsContent>
      <TabsContent value="c"><div className="mt-2 p-3 rounded-lg bg-white border text-sm text-[#86868B]">탭 C 콘텐츠</div></TabsContent>
    </Tabs>
  );
  if (name === "Avatar") return (
    <div className="flex items-center gap-3">
      {["WF","김","이","박"].map((init, i) => (
        <Avatar key={init} className={["size-6","size-8","size-10","size-12"][i]}>
          <AvatarFallback className="bg-brand-red/10 text-brand-red font-semibold text-xs">{init}</AvatarFallback>
        </Avatar>
      ))}
    </div>
  );
  if (name === "Skeleton") return (
    <div className="flex flex-col gap-2">
      <Skeleton className="h-4 w-48 rounded" />
      <Skeleton className="h-4 w-32 rounded" />
      <div className="flex gap-2 mt-1"><Skeleton className="size-8 rounded-full" /><div className="flex flex-col gap-1.5"><Skeleton className="h-3 w-28 rounded" /><Skeleton className="h-3 w-20 rounded" /></div></div>
    </div>
  );
  if (name === "Card") return (
    <div className="flex flex-col gap-2 w-full max-w-xs">
      <Card className="p-4"><p className="text-sm font-medium text-[#1D1D1F] mb-1">기본 카드</p><p className="text-xs text-[#86868B]">관련 정보를 하나의 시각적 단위로 묶습니다.</p></Card>
      <Card className="p-4 border-brand-red/30"><div className="flex gap-2 items-center mb-1"><Cpu size={14} className="text-brand-red"/><p className="text-sm font-medium text-[#1D1D1F]">강조 카드</p></div><p className="text-xs text-[#86868B]">컬러 border로 시각적 강조를 표현합니다.</p></Card>
    </div>
  );
  return null;
}

function ComponentsSection() {
  const [activeCategory, setActiveCategory] = useState<typeof COMP_CATEGORIES[number]["id"]>("ui");
  const [activeUI, setActiveUI] = useState("Button");

  const uiNames = UI_COMPONENTS.map(c => c.name);

  return (
    <div>
      <SectionTitle
        title="컴포넌트"
        desc="WIZFACTORY 홈페이지에서 실제 사용 중인 모든 컴포넌트입니다. 기본 UI 프리미티브부터 페이지 섹션, 모달, 유틸리티까지 카테고리별로 정리했습니다."
      />

      {/* Category tabs */}
      <div className="flex gap-2 flex-wrap mb-8">
        {COMP_CATEGORIES.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setActiveCategory(id)}
            className={`px-3 py-1.5 text-sm rounded-lg font-medium transition-all ${
              activeCategory === id
                ? "bg-[#1D1D1F] text-white"
                : "bg-[#F5F5F7] text-[#86868B] hover:bg-[#ececf0] hover:text-[#1D1D1F]"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* 기본 UI — live preview + docs */}
      {activeCategory === "ui" && (
        <div>
          <div className="flex gap-2 flex-wrap mb-6">
            {uiNames.map(name => (
              <button
                key={name}
                onClick={() => setActiveUI(name)}
                className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-all ${
                  activeUI === name
                    ? "bg-brand-red text-white"
                    : "bg-[#F5F5F7] text-[#86868B] hover:bg-[#ececf0]"
                }`}
              >
                {name}
              </button>
            ))}
          </div>
          {UI_COMPONENTS.filter(c => c.name === activeUI).map(comp => (
            <div key={comp.name}>
              <div className="mb-2">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-base font-semibold text-[#1D1D1F]">{comp.name}</h3>
                  <code className="text-xs font-mono text-[#86868B] bg-[#F5F5F7] px-1.5 py-0.5 rounded">{comp.file}</code>
                </div>
                <p className="text-sm text-[#86868B]">{comp.desc}</p>
              </div>
              <p className="text-xs font-semibold text-[#1D1D1F] mb-2 mt-5">라이브 미리보기</p>
              <PreviewBox><UILivePreview name={comp.name} /></PreviewBox>
              {comp.props && comp.props.length > 0 && (
                <>
                  <p className="text-xs font-semibold text-[#1D1D1F] mb-1 mt-5">Props</p>
                  <PropTable props={comp.props} />
                </>
              )}
              <p className="text-xs font-semibold text-[#1D1D1F] mt-5 mb-2">사용 예시</p>
              <CodeBlock code={comp.code} />
              <p className="text-xs font-semibold text-[#1D1D1F] mt-5 mb-2">주요 기능</p>
              <div className="flex flex-wrap gap-1.5">
                {comp.features.map(f => (
                  <span key={f} className="text-xs bg-[#F5F5F7] text-[#86868B] px-2 py-0.5 rounded-md">{f}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 레이아웃 */}
      {activeCategory === "layout" && (
        <div className="flex flex-col gap-3">
          {LAYOUT_COMPONENTS.map(comp => <CompCard key={comp.name} comp={comp} />)}
        </div>
      )}

      {/* 섹션 컴포넌트 */}
      {activeCategory === "section" && (
        <div className="flex flex-col gap-3">
          {SECTION_COMPONENTS.map(comp => <CompCard key={comp.name} comp={comp} />)}
        </div>
      )}

      {/* 모달 */}
      {activeCategory === "modal" && (
        <div className="flex flex-col gap-3">
          {MODAL_COMPONENTS.map(comp => <CompCard key={comp.name} comp={comp} />)}
        </div>
      )}

      {/* 유틸리티 */}
      {activeCategory === "util" && (
        <div className="flex flex-col gap-3">
          {UTIL_COMPONENTS.map(comp => <CompCard key={comp.name} comp={comp} />)}
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   Section: Icons
───────────────────────────────────────────────────────── */
const ICON_SET = [
  { Icon: Home,      name: "Home" },
  { Icon: Search,    name: "Search" },
  { Icon: Settings,  name: "Settings" },
  { Icon: Bell,      name: "Bell" },
  { Icon: Mail,      name: "Mail" },
  { Icon: User,      name: "User" },
  { Icon: Lock,      name: "Lock" },
  { Icon: FileText,  name: "FileText" },
  { Icon: BarChart2, name: "BarChart2" },
  { Icon: Globe,     name: "Globe" },
  { Icon: Shield,    name: "Shield" },
  { Icon: Cpu,       name: "Cpu" },
  { Icon: Database,  name: "Database" },
  { Icon: Cloud,     name: "Cloud" },
  { Icon: Monitor,   name: "Monitor" },
  { Icon: Smartphone,name: "Smartphone" },
  { Icon: Tablet,    name: "Tablet" },
  { Icon: Star,      name: "Star" },
  { Icon: Heart,     name: "Heart" },
  { Icon: Download,  name: "Download" },
  { Icon: ArrowRight,name: "ArrowRight" },
  { Icon: CheckCircle2, name: "CheckCircle2" },
  { Icon: AlertCircle,  name: "AlertCircle" },
  { Icon: Info,         name: "Info" },
];

function IconsSection() {
  const [size, setSize] = useState(20);
  const [copiedIcon, setCopiedIcon] = useState<string | null>(null);
  const copyIcon = (name: string) => {
    navigator.clipboard.writeText(`<${name} size={${size}} />`);
    setCopiedIcon(name);
    setTimeout(() => setCopiedIcon(null), 1200);
  };
  return (
    <div>
      <SectionTitle title="아이콘" desc="Lucide React 아이콘 라이브러리를 사용합니다. 픽셀 퍼펙트하고 일관된 스트로크 기반 아이콘 세트입니다." />

      <div className="flex items-center gap-4 mb-6">
        <span className="text-sm text-[#86868B]">크기 조절:</span>
        <div className="flex gap-2">
          {[14, 16, 20, 24, 32].map(s => (
            <button
              key={s}
              onClick={() => setSize(s)}
              className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-all ${size === s ? "bg-[#1D1D1F] text-white" : "bg-[#F5F5F7] text-[#86868B] hover:bg-[#ececf0]"}`}
            >
              {s}px
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-8 gap-2 mb-8">
        {ICON_SET.map(({ Icon, name }) => (
          <button
            key={name}
            onClick={() => copyIcon(name)}
            className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-[#F5F5F7] transition-all group"
          >
            {copiedIcon === name
              ? <Check size={size} className="text-green-500" />
              : <Icon size={size} className="text-[#1D1D1F] group-hover:text-brand-red transition-colors" />
            }
            <span className="text-xs text-[#86868B] truncate w-full text-center">{name}</span>
          </button>
        ))}
      </div>

      <SubTitle>크기 시스템</SubTitle>
      <PreviewBox className="gap-6">
        {[12, 14, 16, 20, 24, 32, 40].map(s => (
          <div key={s} className="flex flex-col items-center gap-2">
            <Globe size={s} className="text-[#1D1D1F]" />
            <span className="text-xs text-[#86868B]">{s}px</span>
          </div>
        ))}
      </PreviewBox>

      <div className="mt-6">
        <CodeBlock code={`import { Home, Search, Settings } from "lucide-react";\n\n// 기본 사용\n<Home size={20} />\n\n// 색상 적용\n<Search size={16} className="text-brand-red" />\n\n// 버튼과 조합\n<Button><Settings size={16} /> 설정</Button>`} />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   Section: Design Tokens
───────────────────────────────────────────────────────── */
function TokensSection() {
  const [activeTab, setActiveTab] = useState("color");
  const tokenGroups: Record<string, { name: string; value: string; swatch?: string }[]> = {
    color: [
      { name: "--palette-gray-500 / --color-gray-500", value: "#86868b", swatch: "#86868b" },
      { name: "--palette-blue-500 / --color-blue-500", value: "#0071e3", swatch: "#0071e3" },
      { name: "--palette-red-500 / --color-red-500",   value: "#b30710", swatch: "#b30710" },
      { name: "--palette-green-500 / --color-green-500", value: "#34c759", swatch: "#34c759" },
      { name: "--semantic-success",  value: "var(--palette-green-500)", swatch: "#34c759" },
      { name: "--state-success-bg",  value: "var(--palette-green-50)",  swatch: "#ecfdf5" },
      { name: "--brand-red",           value: "#B30710",              swatch: "#B30710" },
      { name: "--brand-red-light",     value: "rgba(179,7,16,0.06)",  swatch: "rgba(179,7,16,0.06)" },
      { name: "--apple-blue",          value: "#0071E3",              swatch: "#0071E3" },
      { name: "--apple-red",           value: "#FF3B30",              swatch: "#FF3B30" },
      { name: "--apple-text-primary",  value: "#1D1D1F",              swatch: "#1D1D1F" },
      { name: "--apple-text-secondary",value: "#86868B",              swatch: "#86868B" },
      { name: "--apple-text-tertiary", value: "#AEAEB2",              swatch: "#AEAEB2" },
      { name: "--apple-bg-primary",    value: "#F5F5F7",              swatch: "#F5F5F7" },
      { name: "--background",          value: "#ffffff",              swatch: "#ffffff" },
      { name: "--primary",             value: "#B30710",              swatch: "#B30710" },
      { name: "--secondary",           value: "#F5F5F7",              swatch: "#F5F5F7" },
      { name: "--muted",               value: "#F5F5F7",              swatch: "#F5F5F7" },
      { name: "--accent",              value: "#F5F5F7",              swatch: "#F5F5F7" },
      { name: "--destructive",         value: "#d4183d",              swatch: "#d4183d" },
      { name: "--border",              value: "rgba(0,0,0,0.1)",      swatch: "rgba(0,0,0,0.1)" },
    ],
    typography: [
      { name: "--text-display-2xl",  value: "5.5rem (88px)" },
      { name: "--text-display-xl",   value: "4.5rem (72px)" },
      { name: "--text-display-lg",   value: "3.75rem (60px)" },
      { name: "--text-display-md",   value: "3rem (48px)" },
      { name: "--text-display-sm",   value: "2.25rem (36px)" },
      { name: "--text-display-xs",   value: "1.75rem (28px)" },
      { name: "--text-body-xl",      value: "1.25rem (20px)" },
      { name: "--text-body-lg",      value: "1.125rem (18px)" },
      { name: "--text-body-md",      value: "1rem (16px)" },
      { name: "--text-body-sm",      value: "0.9375rem (15px)" },
      { name: "--text-label-lg",     value: "0.875rem (14px)" },
      { name: "--text-label-md",     value: "0.8125rem (13px)" },
      { name: "--text-label-sm",     value: "0.75rem (12px)" },
      { name: "--font-weight-normal",   value: "400" },
      { name: "--font-weight-medium",   value: "500" },
      { name: "--font-weight-semibold", value: "600" },
      { name: "--font-weight-bold",     value: "700" },
      { name: "--tracking-tightest",  value: "-0.05em" },
      { name: "--tracking-tight",     value: "-0.02em" },
      { name: "--tracking-normal",    value: "0em" },
      { name: "--tracking-wide",      value: "0.02em" },
    ],
    spacing: [
      { name: "--radius",    value: "0.625rem (10px)" },
      { name: "--radius-sm", value: "calc(var(--radius) - 4px)" },
      { name: "--radius-md", value: "calc(var(--radius) - 2px)" },
      { name: "--radius-lg", value: "var(--radius)" },
      { name: "--radius-xl", value: "calc(var(--radius) + 4px)" },
      { name: "--font-size", value: "16px (1rem base)" },
    ],
    font: [
      { name: "--font-sans",    value: "'Inter', 'Pretendard Variable', -apple-system, sans-serif" },
      { name: "--font-display", value: "'Inter', 'Pretendard Variable', -apple-system, sans-serif" },
      { name: "--font-mono",    value: "'JetBrains Mono', 'Fira Code', ui-monospace, monospace" },
    ],
  };

  return (
    <div>
      <SectionTitle title="디자인 토큰" desc="CSS Custom Properties(변수)로 정의된 디자인 토큰입니다. theme.css에서 관리되며 다크모드와 Tailwind CSS에서 접근 가능합니다." />

      <div className="flex gap-2 flex-wrap mb-6">
        {[
          { id: "color",      label: "색상 토큰" },
          { id: "typography", label: "타이포그래피 토큰" },
          { id: "spacing",    label: "스페이싱/형태 토큰" },
          { id: "font",       label: "폰트 패밀리 토큰" },
        ].map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`px-3 py-1.5 text-sm rounded-lg font-medium transition-all ${activeTab === id ? "bg-[#1D1D1F] text-white" : "bg-[#F5F5F7] text-[#86868B] hover:bg-[#ececf0]"}`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="rounded-2xl border border-[rgba(0,0,0,0.08)] bg-white overflow-hidden">
        <div className="grid grid-cols-3 text-xs font-medium text-[#86868B] bg-[#F5F5F7] px-5 py-2.5 border-b border-[rgba(0,0,0,0.06)]">
          <span>토큰 이름</span><span>값</span><span className="text-center">복사</span>
        </div>
        <div className="px-5 py-2">
          {tokenGroups[activeTab].map(token => (
            <TokenRow key={token.name} {...token} />
          ))}
        </div>
      </div>

      <div className="mt-6">
        <SubTitle>토큰 사용 방법</SubTitle>
        <CodeBlock code={`/* CSS에서 직접 사용 */\n.element {\n  color: var(--apple-text-primary);\n  background: var(--brand-red-light);\n  border-radius: var(--radius-lg);\n}\n\n/* Tailwind에서 사용 (theme.css @theme inline 블록에 등록) */\n<div className="text-brand-red bg-apple-bg-primary" />\n\n/* React 컴포넌트에서 인라인 스타일 */\n<div style={{ color: 'var(--brand-red)' }} />`} />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   Wiz_* placeholder / 확장 섹션
───────────────────────────────────────────────────────── */
function GridSection() {
  return (
    <div>
      <SectionTitle
        title="Wiz_Grid · 레이아웃 그리드"
        desc="페이지 폭·거터·브레이크포인트 기준을 정의합니다. 홈페이지는 .wiz-section + max-w-[1440px] 컨테이너를 사용합니다."
      />
      <div className="rounded-2xl border border-[rgba(0,0,0,0.08)] bg-white p-6 space-y-3 text-sm text-[#3d3d3f] leading-relaxed">
        <ul className="list-disc pl-5 space-y-2">
          <li><strong className="text-[#1D1D1F]">컨테이너</strong>: <code className="text-xs font-mono bg-[#F5F5F7] px-1 rounded">.wiz-section</code> — <code className="text-xs font-mono">max-w-[1440px] mx-auto px-4 md:px-6 lg:px-8</code></li>
          <li><strong className="text-[#1D1D1F]">그리드</strong>: 콘텐츠는 주로 <code className="text-xs font-mono">grid / flex</code> + Tailwind 브레이크포인트(<code className="text-xs font-mono">sm md lg</code>)로 반응형 구성.</li>
          <li><strong className="text-[#1D1D1F]">토큰</strong>: 스페이싱은 <code className="text-xs font-mono text-brand-red">Wiz_Spacing</code> 섹션의 4px 스케일과 함께 맞춥니다.</li>
        </ul>
        <p className="text-xs text-[#AEAEB2] pt-2 border-t border-[rgba(0,0,0,0.06)]">12컬럼 스펙·Figma 그리드는 제품 팀과 동기화 후 이 문서에 수치를 추가하세요.</p>
      </div>
    </div>
  );
}

function PatternsSection() {
  return (
    <div>
      <SectionTitle
        title="Wiz_Patterns · UI 패턴 (조합)"
        desc="프리미티브 컴포넌트를 조합한 반복 패턴(폼 플로우, 리스트+필터, 대시보드 타일 등)을 정의합니다."
      />
      <div className="rounded-2xl border border-dashed border-[rgba(0,0,0,0.12)] bg-[#FAFAFA] p-8 text-center">
        <p className="text-sm text-[#86868B] mb-2">문서화 예정</p>
        <p className="text-xs text-[#AEAEB2] max-w-md mx-auto">
          예: 문의 폼 + 모달, 솔루션 카드 그리드, 헤더 + 히어로 + 섹션 교차 레이아웃. 우선순위에 따라 스크린샷·코드 스니펫을 추가합니다.
        </p>
      </div>
    </div>
  );
}

function MotionSection() {
  return (
    <div>
      <SectionTitle
        title="Wiz_Motion · 인터랙션·모션"
        desc="모션 라이브러리(Motion for React), 지속시간·이징, reduced-motion 정책을 다룹니다."
      />
      <div className="rounded-2xl border border-[rgba(0,0,0,0.08)] bg-white p-6 space-y-3 text-sm text-[#3d3d3f]">
        <ul className="list-disc pl-5 space-y-2">
          <li><strong className="text-[#1D1D1F]">라이브러리</strong>: <code className="text-xs font-mono">motion/react</code> — 페이지·모달·리스트 진입에 스프링/트윈 사용.</li>
          <li><strong className="text-[#1D1D1F]">접근성</strong>: <code className="text-xs font-mono">prefers-reduced-motion: reduce</code> 일 때 필수 애니메이션만 유지하거나 단순 페이드로 대체 권장.</li>
          <li><strong className="text-[#1D1D1F]">톤</strong>: Apple 스타일에 맞게 과한 바운스·장시간 자동 루프는 지양.</li>
        </ul>
      </div>
    </div>
  );
}

function AccessibilitySection() {
  return (
    <div>
      <SectionTitle
        title="Wiz_Accessibility · 접근성"
        desc="WCAG 2.1 AA를 목표로, 키보드·스크린리더·대비를 설계 기준에 포함합니다."
      />
      <div className="rounded-2xl border border-[rgba(0,0,0,0.08)] bg-white p-6 space-y-3 text-sm text-[#3d3d3f]">
        <ul className="list-disc pl-5 space-y-2">
          <li><strong className="text-[#1D1D1F]">포커스</strong>: 보이는 포커스 링(<code className="text-xs font-mono">focus-visible:ring</code>) 유지.</li>
          <li><strong className="text-[#1D1D1F]">색 대비</strong>: 본문 <code className="text-xs font-mono">#1D1D1F</code> / 보조 <code className="text-xs font-mono">#86868B</code> — 브랜드 레드는 CTA·링크에 집중.</li>
          <li><strong className="text-[#1D1D1F]">시맨틱 HTML</strong>: 헤딩 단계, 버튼/링크 구분, 폼 레이블 연결.</li>
          <li><strong className="text-[#1D1D1F]">모달</strong>: 열릴 때 포커스 트랩, 닫기·ESC, <code className="text-xs font-mono">aria-modal</code>.</li>
        </ul>
        <p className="text-xs text-[#AEAEB2] pt-2 border-t border-[rgba(0,0,0,0.06)]">체크리스트·감사 로그는 릴리스 전에 별도 문서로 확장할 수 있습니다.</p>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   Main Page
───────────────────────────────────────────────────────── */
export function DesignSystemPage() {
  const [activeSection, setActiveSection] = useState("wiz-overview");

  const sectionMap = useMemo<Record<string, React.ReactNode>>(
    () => ({
      "wiz-overview": <OverviewSection onNavigate={setActiveSection} />,
      "wiz-color": <ColorsSection />,
      "wiz-typography": <TypographySection />,
      "wiz-spacing": <SpacingSection />,
      "wiz-grid": <GridSection />,
      "wiz-radius": <ShapeSection />,
      "wiz-shadow": <ElevationSection />,
      "wiz-components": <ComponentsSection />,
      "wiz-patterns": <PatternsSection />,
      "wiz-motion": <MotionSection />,
      "wiz-a11y": <AccessibilitySection />,
      "wiz-icons": <IconsSection />,
      "wiz-tokens": <TokensSection />,
    }),
    [setActiveSection],
  );

  const activeNav = findWizNavItem(activeSection);

  return (
    <div className="flex min-h-screen bg-[#FAFAFA]">
      {/* Sidebar — 문서형 좌측 내비 (스크롤바 숨김) */}
      <aside className="sticky top-0 z-20 h-screen w-[17rem] shrink-0 overflow-y-auto border-r border-[rgba(0,0,0,0.06)] bg-white scrollbar-hide sm:w-[17.5rem]">
        <div className="border-b border-[rgba(0,0,0,0.06)] px-5 pb-4 pt-6">
          <div className="flex items-center gap-2.5">
            <img src="/src/assets/symbol.svg" alt="WIZFACTORY" className="h-[34px] w-auto shrink-0" />
            <div>
              <p className="text-sm font-bold leading-tight tracking-wide text-[#1D1D1F]">Wiz Design System</p>
              <p className="mt-0.5 font-mono text-[10px] text-brand-red">Wiz_DS</p>
              <p className="mt-0.5 text-xs text-[#AEAEB2]">WIZFACTORY v2.0</p>
            </div>
          </div>
        </div>

        <nav className="px-2 py-3" aria-label="디자인 시스템 섹션">
          {WIZ_NAV_GROUPS.map((group) => (
            <div key={group.groupWizId} className="mb-5 last:mb-0">
              <p className="mb-1.5 px-3 text-[10px] font-semibold uppercase tracking-wider text-[#AEAEB2]">
                {group.groupWizId.replace(/_/g, " · ")}
              </p>
              {group.items.map(({ id, wizId, labelKo, icon: Icon }) => {
                const active = activeSection === id;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setActiveSection(id)}
                    className={`mb-0.5 flex w-full items-start gap-2.5 rounded-lg px-2 py-2 text-left transition-colors ${
                      active
                        ? "border-l-2 border-brand-red bg-brand-red/[0.06] text-[#1D1D1F]"
                        : "border-l-2 border-transparent text-[#86868B] hover:bg-black/[0.03] hover:text-[#1D1D1F]"
                    }`}
                  >
                    <Icon size={15} className={`mt-0.5 shrink-0 ${active ? "text-brand-red" : "text-[#AEAEB2]"}`} />
                    <span className="min-w-0 flex-1">
                      <span className={`block font-mono text-[10px] leading-tight ${active ? "text-brand-red" : "text-brand-red/80"}`}>
                        {wizId}
                      </span>
                      <span className="block text-sm font-medium leading-snug text-[#1D1D1F]">{labelKo}</span>
                    </span>
                    {active && <ChevronRight size={12} className="mt-1 shrink-0 text-brand-red/60" />}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>
      </aside>

      <main className="min-h-screen min-w-0 flex-1">
        {/* Sticky 문서 헤더 */}
        <header className="sticky top-0 z-10 border-b border-[rgba(0,0,0,0.06)] bg-white/85 backdrop-blur-md">
          <div className="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-6 lg:px-8">
            <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 text-xs">
              <a href="/" className="flex shrink-0 items-center gap-1 text-[#AEAEB2] transition-colors hover:text-[#1D1D1F]">
                <Home size={11} aria-hidden />
                홈
              </a>
              <ChevronRight size={12} className="shrink-0 text-[#AEAEB2]" aria-hidden />
              <span className="shrink-0 text-[#AEAEB2]">Wiz Design System</span>
              <ChevronRight size={12} className="shrink-0 text-[#AEAEB2]" aria-hidden />
              {activeNav && (
                <>
                  <code className="rounded bg-brand-red/6 px-1.5 py-0.5 font-mono text-[10px] text-brand-red">{activeNav.wizId}</code>
                  <span className="truncate font-medium text-[#1D1D1F]">{activeNav.labelKo}</span>
                </>
              )}
            </div>
            {activeNav && (
              <p className="hidden text-right text-[11px] text-[#AEAEB2] sm:block">
                토큰·컴포넌트·패턴 레퍼런스
              </p>
            )}
          </div>
        </header>

        <div className="px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
          <div
            className={`mx-auto flex w-full max-w-6xl gap-8 xl:gap-12 ${activeSection === "wiz-overview" ? "justify-center" : ""}`}
          >
            <div
              className={`min-w-0 flex-1 ${activeSection === "wiz-overview" ? "max-w-[720px] xl:max-w-[760px]" : "max-w-4xl"}`}
            >
              {activeSection === "wiz-overview" ? (
                sectionMap[activeSection] ?? <OverviewSection onNavigate={setActiveSection} />
              ) : (
                <div className="rounded-2xl border border-[rgba(0,0,0,0.04)] bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)] sm:p-8 lg:p-10">
                  {sectionMap[activeSection] ?? <OverviewSection onNavigate={setActiveSection} />}
                </div>
              )}
            </div>
            {activeSection === "wiz-overview" && <OverviewOnThisPage />}
          </div>
        </div>
      </main>
    </div>
  );
}
