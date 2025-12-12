import React from "react";

interface State {
  hasError: boolean;
  error?: Error | null;
  info?: React.ErrorInfo | null;
}

export default class ErrorBoundary extends React.Component<{}, State> {
  constructor(props: {}) {
    super(props);
    this.state = { hasError: false, error: null, info: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // You can log to a remote monitoring service here
    console.error("ErrorBoundary caught error:", error, info);
    this.setState({ hasError: true, error, info });
  }

  reset = () => {
    this.setState({ hasError: false, error: null, info: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
          <p className="mb-4 text-sm text-muted-foreground">
            The page had an unexpected error. You can try reloading the page or
            returning to the dashboard.
          </p>

          <div className="flex gap-3">
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 rounded-md bg-red-500 text-white"
            >
              Hard reload
            </button>

            <button
              onClick={this.reset}
              className="px-4 py-2 rounded-md border"
            >
              Try again
            </button>
          </div>

          <details className="mt-4 text-xs text-muted-foreground">
            <summary>Error details</summary>
            <pre className="whitespace-pre-wrap">
              {String(this.state.error && this.state.error.stack)}
            </pre>
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}
