import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}
interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: { componentStack: string }) {
    console.error('[ErrorBoundary]', error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div
            className="flex flex-col items-center justify-center min-h-[200px] gap-3 p-8 rounded-2xl"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,0,0,0.15)' }}
          >
            <p className="text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.6)' }}>
              렌더링 오류가 발생했습니다. 페이지를 새로고침해 주세요.
            </p>
            <button
              onClick={() => this.setState({ hasError: false })}
              className="text-xs px-4 py-2 rounded-xl"
              style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.7)' }}
            >
              다시 시도
            </button>
          </div>
        )
      );
    }
    return this.props.children;
  }
}
