import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-100 flex items-center justify-center p-5">
          <div className="bg-white rounded-3xl p-8 max-w-2xl shadow-2xl">
            <div className="text-6xl mb-4 text-center">❌</div>
            <h1 className="text-2xl font-bold text-red-600 mb-4 text-center">Something went wrong</h1>
            <div className="bg-red-50 p-4 rounded-lg text-left text-sm mb-4 overflow-auto max-h-96">
              <p className="font-bold text-red-800 mb-2">Error:</p>
              <pre className="text-red-700 whitespace-pre-wrap">{this.state.error?.toString()}</pre>
              {this.state.errorInfo && (
                <>
                  <p className="font-bold text-red-800 mt-4 mb-2">Stack Trace:</p>
                  <pre className="text-red-600 text-xs whitespace-pre-wrap">{this.state.errorInfo.componentStack}</pre>
                </>
              )}
            </div>
            <button 
              onClick={() => window.location.reload()} 
              className="w-full px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
