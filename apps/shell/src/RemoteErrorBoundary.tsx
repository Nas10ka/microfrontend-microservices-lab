import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';

export default class RemoteErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Microfrontend failed to load', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div role="alert">
          <p>Application unavailable. Check that its remote server is running.</p>
          <button type="button" onClick={() => window.location.reload()}>Reload</button>
        </div>
      );
    }

    return this.props.children;
  }
}
