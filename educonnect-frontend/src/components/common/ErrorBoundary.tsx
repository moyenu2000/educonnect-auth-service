import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card, CardBody } from '../ui/Card';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo
    });

    // Call optional error handler
    this.props.onError?.(error, errorInfo);

    // In production, you might want to send this to an error reporting service
    if (process.env.NODE_ENV === 'production') {
      // Example: Send to error tracking service
      // errorTrackingService.captureException(error, { extra: errorInfo });
    }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-secondary-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-lg">
            <CardBody className="text-center py-8">
              <div className="mb-6">
                <AlertTriangle className="h-16 w-16 text-error-500 mx-auto mb-4" />
                <h1 className="text-2xl font-bold text-secondary-900 mb-2">
                  Oops! Something went wrong
                </h1>
                <p className="text-secondary-600">
                  We encountered an unexpected error. Please try refreshing the page or contact support if the problem persists.
                </p>
              </div>

              {process.env.NODE_ENV === 'development' && this.state.error && (
                <div className="mb-6 p-4 bg-error-50 border border-error-200 rounded-lg text-left">
                  <h3 className="font-medium text-error-800 mb-2">Error Details:</h3>
                  <pre className="text-sm text-error-700 whitespace-pre-wrap overflow-auto max-h-32">
                    {this.state.error.toString()}
                  </pre>
                  {this.state.errorInfo && (
                    <details className="mt-2">
                      <summary className="cursor-pointer text-error-800 font-medium">
                        Component Stack
                      </summary>
                      <pre className="text-xs text-error-600 mt-1 whitespace-pre-wrap">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </details>
                  )}
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  leftIcon={RefreshCw}
                  onClick={this.handleReset}
                  variant="primary"
                >
                  Try Again
                </Button>
                <Button
                  leftIcon={Home}
                  onClick={this.handleGoHome}
                  variant="outline"
                >
                  Go Home
                </Button>
              </div>

              <p className="text-sm text-secondary-500 mt-4">
                Error ID: {Date.now().toString(36)}
              </p>
            </CardBody>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

// HOC for functional components
export const withErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Partial<Props>
) => {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
};