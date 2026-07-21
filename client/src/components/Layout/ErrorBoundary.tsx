import { Component, ErrorInfo, ReactNode } from 'react';
import ErrorPage from '../../pages/ErrorPage/ErrorPage';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: ReactNode;
}

export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Unhandled error caught by ErrorBoundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorPage
          statusCode={500}
          title="Something went wrong"
          message="An unexpected error occurred while loading this page. Try refreshing or return home."
          actionLabel="Back to home"
          actionLink="/home"
        />
      );
    }

    return this.props.children;
  }
}
