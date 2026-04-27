import { Component, type ErrorInfo, type ReactNode } from 'react'
import { AlertCircle } from 'lucide-react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Log to console in dev; swap for a real error reporting service in production
    console.error('[ErrorBoundary]', error, info.componentStack)
  }

  handleReset = () => this.setState({ hasError: false })

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback

      return (
        <div className="min-h-screen flex flex-col items-center justify-center text-center px-6 bg-background">
          <AlertCircle size={60} className="text-white/10 block mb-6" />
          <h1 className="font-headline font-black italic uppercase tracking-tighter text-3xl text-white mb-3">
            Something went wrong
          </h1>
          <p className="font-body text-sm text-on-surface-variant max-w-sm leading-relaxed mb-8">
            An unexpected error occurred. Try refreshing the page or going back.
          </p>
          <div className="flex items-center gap-4">
            <button
              onClick={this.handleReset}
              className="font-label text-xs uppercase tracking-widest text-white border border-white/20 hover:border-white/50 px-6 py-3 transition-colors"
            >
              Try Again
            </button>
            <a
              href="/"
              className="font-label text-xs uppercase tracking-widest text-on-surface-variant hover:text-white transition-colors"
            >
              Go Home
            </a>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
