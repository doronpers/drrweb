'use client';

/**
 * ====================================
 * ERROR BOUNDARY
 * ====================================
 * 
 * Graceful error handling following Dieter Rams principles:
 * - Honest about errors
 * - Clear, helpful messaging
 * - Simple recovery options
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-white px-8">
          <div className="max-w-md text-center space-y-6">
            <h1 className="text-2xl font-bold text-black">Something went wrong</h1>
            <p className="text-black/60">
              We encountered an unexpected error. Please try refreshing the page.
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              className="px-6 py-3 bg-black text-white rounded-lg hover:bg-black/80 transition-colors focus:outline-none focus:ring-2 focus:ring-black/20 focus:ring-offset-2"
            >
              Refresh Page
            </button>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-8 text-left">
                <summary className="cursor-pointer text-sm text-black/40 mb-2">
                  Error Details (Development Only)
                </summary>
                <pre className="text-xs bg-black/5 p-4 rounded overflow-auto">
                  {this.state.error.toString()}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
