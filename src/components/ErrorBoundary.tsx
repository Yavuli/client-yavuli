import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
        };
    }

    static getDerivedStateFromError(error: Error): State {
        return {
            hasError: true,
            error,
            errorInfo: null,
        };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('[ErrorBoundary] Caught error:', error, errorInfo);
        this.setState({
            error,
            errorInfo,
        });

        // Log to any external error tracking service here if needed
        // Example: Sentry.captureException(error);
    }

    handleReload = () => {
        window.location.reload();
    };

    handleClearStorage = () => {
        try {
            localStorage.clear();
            sessionStorage.clear();
            window.location.reload();
        } catch (e) {
            console.error('[ErrorBoundary] Failed to clear storage:', e);
            window.location.reload();
        }
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-background flex items-center justify-center p-4">
                    <Card className="max-w-lg w-full p-8 space-y-6">
                        <div className="flex items-center gap-3 text-destructive">
                            <AlertTriangle className="h-8 w-8" />
                            <h1 className="text-2xl font-bold">Something went wrong</h1>
                        </div>

                        <div className="space-y-3">
                            <p className="text-muted-foreground">
                                We encountered an unexpected error. This could be due to a temporary issue.
                            </p>

                            {import.meta.env.DEV && this.state.error && (
                                <details className="text-xs bg-muted p-3 rounded-lg">
                                    <summary className="cursor-pointer font-medium mb-2">Error Details (Development Only)</summary>
                                    <pre className="whitespace-pre-wrap overflow-auto">
                                        {this.state.error.toString()}
                                        {this.state.errorInfo?.componentStack}
                                    </pre>
                                </details>
                            )}
                        </div>

                        <div className="flex flex-col gap-3">
                            <Button
                                onClick={this.handleReload}
                                className="w-full"
                            >
                                Reload Page
                            </Button>

                            <Button
                                onClick={this.handleClearStorage}
                                variant="outline"
                                className="w-full"
                            >
                                Clear Cache & Reload
                            </Button>
                        </div>

                        <p className="text-xs text-muted-foreground text-center">
                            If this problem persists, please try clearing your browser cookies or contact support.
                        </p>
                    </Card>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
