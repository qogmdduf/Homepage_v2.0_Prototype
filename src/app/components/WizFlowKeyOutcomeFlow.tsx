import { useMemo, useRef, useEffect, useCallback, type RefObject } from 'react';
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  MarkerType,
  Position,
  useReactFlow,
  type Edge,
  type Node,
  type NodeProps,
  Handle,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { WIZ_FLOW_METRIC_AFTER, WIZ_FLOW_METRIC_BEFORE, WIZ_FLOW_METRIC_MERGE_EDGE } from './wizFlowOutcomeColors';
import { WizFlowInlineCornerEmphasis } from './WizFlowInlineCornerEmphasis';

/** 작업지시 흐름 — 도입 전 8단계 / 도입 후 4단계 (SolutionModal _BEFORE_STEPS / _AFTER_STEPS 와 동일 의미) */
const BEFORE_KO = [
  '작업지시 작성',
  '인쇄',
  '현장 배포',
  '수령 확인',
  '수기 기록',
  '회수·보관',
  '전산 재입력',
  '보고서 생성',
] as const;
const BEFORE_EN = [
  'Create WO',
  'Print',
  'Floor dist.',
  'Receipt',
  'Manual log',
  'Collect',
  'Re-enter',
  'Report',
] as const;

const AFTER_KO = [
  '디지털 작업지시\n생성',
  '태블릿·스마트폰\n자동 배포',
  '현장 실시간 입력',
  '자동 집계·보고',
] as const;
const AFTER_EN = [
  'Digital work\norder',
  'Tablet / smartphone\nauto deploy',
  'Live entry',
  'Auto report',
] as const;

/** 8→4 매핑: 업무 묶음 기준 (종이·인쇄·배포 → 디지털 배포 / 수기·재입력 → 실시간 입력 등) */
const MERGE_TO_AFTER: readonly number[] = [0, 1, 1, 1, 2, 2, 2, 3];

/**
 * 노드 **간격**은 기존과 동일(다이어그램 전체가 넓어지지 않음).
 * 노드 **박스(카드)**만 넓히고 패딩·타이포를 키워 가독성 확보 (STEP_X=122 유지 시 w≤122).
 */
const NODE_W_BEFORE = 102;
const NODE_W_AFTER = 118;
/** 좌우 핸들 세로 위치가 노드마다 같아야 순차 엣지가 수평으로 보임 (가변 높이 금지) */
const NODE_BEFORE_H = 66;
const NODE_AFTER_H = 78;
const STEP_X = 122;
const ROW_BEFORE_Y = 0;
const ROW_AFTER_Y = 210;

/** 도입 후 4노드 x: 위 레인(b0·b7) 및 병합 그룹과 **중심**이 맞도록 */
function buildAfterNodeX(): number[] {
  const centerX = (i: number) => i * STEP_X + NODE_W_BEFORE / 2;
  return [
    centerX(0) - NODE_W_AFTER / 2,
    (centerX(1) + centerX(2) + centerX(3)) / 3 - NODE_W_AFTER / 2,
    (centerX(4) + centerX(5) + centerX(6)) / 3 - NODE_W_AFTER / 2,
    centerX(7) - NODE_W_AFTER / 2,
  ];
}

type WizFlowNodeData = { label: string; n: string };

/** 핸들은 position:absolute + top:50% — 반드시 이 루트에 relative + 고정 크기(=핸들 기준 박스) */
function BeforeNode({ data, width, height }: NodeProps<{ data: WizFlowNodeData }>) {
  const w = width ?? NODE_W_BEFORE;
  const h = height ?? NODE_BEFORE_H;
  return (
    <div
      className="relative flex h-full w-full flex-col items-center justify-start gap-1 rounded-md border border-slate-200/90 bg-gradient-to-b from-slate-50/95 to-white px-2.5 pb-2.5 pt-2.5 text-center shadow-sm ring-1 ring-inset ring-slate-100/70 sm:rounded-lg sm:px-3 sm:pb-2.5 sm:pt-2.5"
      style={{
        width: w,
        height: h,
        minWidth: NODE_W_BEFORE,
        minHeight: NODE_BEFORE_H,
        boxSizing: 'border-box',
        boxShadow: '0 1px 0 rgba(255,255,255,0.9) inset',
      }}
    >
      <Handle
        id="left"
        type="target"
        position={Position.Left}
        className="!h-2 !w-2 !border-0"
        style={{ backgroundColor: WIZ_FLOW_METRIC_BEFORE }}
      />
      <Handle
        id="right"
        type="source"
        position={Position.Right}
        className="!h-2 !w-2 !border-0"
        style={{ backgroundColor: WIZ_FLOW_METRIC_BEFORE }}
      />
      <Handle
        id="merge"
        type="source"
        position={Position.Bottom}
        className="!h-2 !w-2 !border-0"
        style={{ backgroundColor: WIZ_FLOW_METRIC_BEFORE }}
      />
      <p className="m-0 shrink-0 font-mono text-[11px] font-bold tabular-nums text-zinc-500 sm:text-[12px]">{data.n}</p>
      <p className="m-0 line-clamp-2 w-full whitespace-pre-line text-[11px] font-semibold leading-snug text-slate-800 sm:text-[12px]">
        {data.label}
      </p>
    </div>
  );
}

function AfterNode({ data, width, height }: NodeProps<{ data: WizFlowNodeData }>) {
  const w = width ?? NODE_W_AFTER;
  const h = height ?? NODE_AFTER_H;
  return (
    <div
      className="relative flex h-full w-full flex-col items-center justify-start gap-1 rounded-md border border-blue-200/85 bg-gradient-to-b from-blue-50/95 to-white px-2.5 pb-2.5 pt-2.5 text-center shadow-sm ring-1 ring-inset ring-blue-100/65 sm:rounded-lg sm:px-3 sm:pb-2.5 sm:pt-2.5"
      style={{
        width: w,
        height: h,
        minWidth: NODE_W_AFTER,
        minHeight: NODE_AFTER_H,
        boxSizing: 'border-box',
        boxShadow: '0 1px 0 rgba(255,255,255,0.9) inset',
      }}
    >
      <Handle
        id="merge"
        type="target"
        position={Position.Top}
        className="!h-2 !w-2 !border-0"
        style={{ backgroundColor: WIZ_FLOW_METRIC_AFTER }}
      />
      <Handle
        id="left"
        type="target"
        position={Position.Left}
        className="!h-2 !w-2 !border-0"
        style={{ backgroundColor: WIZ_FLOW_METRIC_AFTER }}
      />
      <Handle
        id="right"
        type="source"
        position={Position.Right}
        className="!h-2 !w-2 !border-0"
        style={{ backgroundColor: WIZ_FLOW_METRIC_AFTER }}
      />
      <p className="m-0 shrink-0 font-mono text-[11px] font-bold tabular-nums sm:text-[12px]" style={{ color: WIZ_FLOW_METRIC_AFTER }}>
        {data.n}
      </p>
      <p className="m-0 line-clamp-2 w-full whitespace-pre-line text-[11px] font-semibold leading-snug text-slate-800 sm:text-[12px]">
        {data.label}
      </p>
    </div>
  );
}

const nodeTypes = { wizFlowBefore: BeforeNode, wizFlowAfter: AfterNode };

function buildNodes(ko: boolean): Node[] {
  const bLabels = ko ? BEFORE_KO : BEFORE_EN;
  const aLabels = ko ? AFTER_KO : AFTER_EN;

  const beforeNodes: Node[] = bLabels.map((label, i) => ({
    id: `b${i}`,
    type: 'wizFlowBefore',
    position: { x: i * STEP_X, y: ROW_BEFORE_Y },
    data: { label, n: String(i + 1).padStart(2, '0') },
    draggable: false,
    selectable: false,
    width: NODE_W_BEFORE,
    height: NODE_BEFORE_H,
  }));

  const afterX = buildAfterNodeX();
  const afterNodes: Node[] = aLabels.map((label, i) => ({
    id: `a${i}`,
    type: 'wizFlowAfter',
    position: { x: afterX[i] ?? 0, y: ROW_AFTER_Y },
    data: { label, n: String(i + 1).padStart(2, '0') },
    draggable: false,
    selectable: false,
    width: NODE_W_AFTER,
    height: NODE_AFTER_H,
  }));

  return [...beforeNodes, ...afterNodes];
}

function buildEdges(): Edge[] {
  const seqBefore: Edge[] = [];
  for (let i = 0; i < 7; i++) {
    seqBefore.push({
      id: `seq-b${i}-b${i + 1}`,
      source: `b${i}`,
      target: `b${i + 1}`,
      sourceHandle: 'right',
      targetHandle: 'left',
      type: 'smoothstep',
      animated: true,
      style: { stroke: WIZ_FLOW_METRIC_BEFORE, strokeWidth: 1.5 },
      markerEnd: { type: MarkerType.ArrowClosed, color: WIZ_FLOW_METRIC_BEFORE, width: 12, height: 12 },
    });
  }

  const seqAfter: Edge[] = [];
  for (let i = 0; i < 3; i++) {
    seqAfter.push({
      id: `seq-a${i}-a${i + 1}`,
      source: `a${i}`,
      target: `a${i + 1}`,
      sourceHandle: 'right',
      targetHandle: 'left',
      type: 'smoothstep',
      animated: true,
      style: { stroke: WIZ_FLOW_METRIC_AFTER, strokeWidth: 2 },
      markerEnd: { type: MarkerType.ArrowClosed, color: WIZ_FLOW_METRIC_AFTER, width: 14, height: 14 },
    });
  }

  const merge: Edge[] = MERGE_TO_AFTER.map((afterIdx, fromIdx) => ({
    id: `map-b${fromIdx}-a${afterIdx}`,
    source: `b${fromIdx}`,
    sourceHandle: 'merge',
    target: `a${afterIdx}`,
    targetHandle: 'merge',
    type: 'smoothstep',
    style: { stroke: WIZ_FLOW_METRIC_MERGE_EDGE, strokeWidth: 1.6, strokeDasharray: '5 4' },
    zIndex: 2,
    markerEnd: { type: MarkerType.ArrowClosed, color: WIZ_FLOW_METRIC_MERGE_EDGE, width: 12, height: 12 },
  }));

  return [...seqBefore, ...seqAfter, ...merge];
}

type WizFlowKeyOutcomeFlowProps = { ko: boolean };

const FIT_OPTS = {
  padding: 0.12,
  minZoom: 0.02,
  maxZoom: 1.5,
  duration: 0,
} as const;

/** 컨테이너 너비·언어 전환 시 전체 그래프가 잘리지 않도록 fitView 재실행 */
function FitViewOnContainerResize({
  containerRef,
  fitKey,
}: {
  containerRef: RefObject<HTMLDivElement | null>;
  fitKey: string;
}) {
  const { fitView } = useReactFlow();

  const runFit = useCallback(() => {
    requestAnimationFrame(() => {
      fitView(FIT_OPTS);
    });
  }, [fitView]);

  useEffect(() => {
    runFit();
  }, [runFit, fitKey]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => runFit());
    ro.observe(el);
    const t = window.setTimeout(runFit, 50);
    const onWin = () => runFit();
    window.addEventListener('resize', onWin);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', onWin);
      window.clearTimeout(t);
    };
  }, [containerRef, runFit]);

  return null;
}

/**
 * React Flow 스타일: 도입 전 레인(순차 8) · 도입 후 레인(순차 4) · 병합 엣지(8→4 매핑)
 * @see https://reactflow.dev/
 */
export function WizFlowKeyOutcomeFlow({ ko }: WizFlowKeyOutcomeFlowProps) {
  const flowWrapRef = useRef<HTMLDivElement>(null);
  const nodes = useMemo(() => buildNodes(ko), [ko]);
  const edges = useMemo(() => buildEdges(), []);

  return (
    <div
      className="flex flex-col"
      role="img"
      aria-label={
        ko
          ? '도입 전 8단계 순차 흐름과 도입 후 4단계 순차 흐름, 그리고 단계 병합 관계'
          : 'Before 8-step chain, after 4-step chain, and merge mapping'
      }
    >
      <div className="flex items-center justify-between gap-3 border-b border-black/[0.06] px-4 py-2.5 sm:px-6">
        {/* WIZ-Flow 핵심 모듈 카드 제목과 동일: 01. + 본문 · flex + baseline으로 인덱스/타이틀 정렬 */}
        <h3 className="m-0 flex min-w-0 flex-1 flex-wrap items-baseline gap-0 text-[17px] font-semibold leading-[1.25] tracking-tight">
          <span className="shrink-0 tabular-nums font-semibold" style={{ color: '#c7c7cc' }}>
            01
          </span>
          <span className="shrink-0 font-semibold" style={{ color: '#c7c7cc' }}>.&nbsp; </span>
          <span className="min-w-0 font-semibold" style={{ color: '#1d1d1f' }}>
            {ko ? '프로세스 맵' : 'Process map'}
          </span>
        </h3>
        <div className="flex flex-wrap items-center gap-3 text-[9px] text-slate-500">
          <span className="inline-flex items-center gap-1">
            <span className="h-2 w-4 rounded-sm" style={{ background: WIZ_FLOW_METRIC_BEFORE }} />
            {ko ? '도입 전 · 순차' : 'Before · chain'}
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="h-2 w-4 rounded-sm" style={{ background: WIZ_FLOW_METRIC_AFTER }} />
            {ko ? '도입 후 · 순차' : 'After · chain'}
          </span>
          <span className="inline-flex items-center gap-1">
            <span
              className="h-2 w-4 rounded-sm ring-1 ring-inset ring-[#B30710]/35"
              style={{
                background: WIZ_FLOW_METRIC_MERGE_EDGE,
                boxShadow: '0 1px 0 rgba(255,255,255,0.85) inset',
              }}
              aria-hidden
            />
            {ko ? '병합' : 'Merge'}
          </span>
        </div>
      </div>

      {/* 02. 핵심 지표 ImpactAdCopy와 동일: 중앙 정렬 + L자 코너 강조(WizFlowInlineCornerEmphasis) */}
      <div className="border-b border-black/[0.06] bg-gradient-to-b from-white/70 to-transparent px-4 py-4 sm:px-6 sm:py-5">
        <div className="mx-auto flex max-w-[40rem] flex-col items-center text-center">
          <p
            className="m-0 text-balance text-[16px] font-semibold leading-[1.35] tracking-[-0.03em] text-[#1d1d1f] sm:text-[17px]"
            style={{ wordBreak: 'keep-all' }}
          >
            {ko ? (
              <>
                8단계로 돌던 업무, 이제는 <WizFlowInlineCornerEmphasis>4단계면 충분</WizFlowInlineCornerEmphasis>
                합니다.
              </>
            ) : (
              <>
                What ran as eight steps—now{' '}
                <WizFlowInlineCornerEmphasis>four steps are enough</WizFlowInlineCornerEmphasis>.
              </>
            )}
          </p>
          {/* 문구는 유지 — 02 ImpactAdCopy 부제와 동일 타이포(#86868b + 키워드 semibold) */}
          <p className="m-0 mt-2 max-w-[34rem] text-[13px] font-normal leading-relaxed tracking-[-0.01em] text-[#86868b] sm:text-[14px]">
            {ko ? (
              <>
                복잡함은 <span className="font-semibold text-[#1d1d1f]">줄이고</span>, 속도는{' '}
                <span className="font-semibold text-[#1d1d1f]">올렸습니다</span>.
              </>
            ) : (
              <>
                Less <span className="font-semibold text-[#1d1d1f]">complexity</span>, more{' '}
                <span className="font-semibold text-[#1d1d1f]">speed</span>.
              </>
            )}
          </p>
        </div>
      </div>

      <div
        ref={flowWrapRef}
        className="wiz-flow-key-outcome-flow h-[min(360px,55vh)] min-h-[260px] w-full min-w-0 bg-black/[0.02] sm:h-[min(380px,50vh)]"
      >
        <ReactFlow
          proOptions={{ hideAttribution: true }}
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={false}
          panOnDrag={false}
          zoomOnScroll={false}
          zoomOnPinch={false}
          zoomOnDoubleClick={false}
          /* 휠을 캡처하지 않음 — 모달/페이지 스크롤이 React Flow 위에서도 동작 */
          preventScrolling={false}
          minZoom={0.02}
          maxZoom={1.5}
          fitView
          fitViewOptions={FIT_OPTS}
          onInit={(instance) => {
            requestAnimationFrame(() => instance.fitView(FIT_OPTS));
          }}
          defaultEdgeOptions={{ zIndex: 0 }}
          className="h-full w-full"
          style={{ width: '100%', height: '100%' }}
        >
          <FitViewOnContainerResize containerRef={flowWrapRef} fitKey={`${ko}-${nodes.length}`} />
          <Background variant={BackgroundVariant.Dots} gap={16} size={1} color="#cbd5e1" className="opacity-50" />
        </ReactFlow>
      </div>
    </div>
  );
}
