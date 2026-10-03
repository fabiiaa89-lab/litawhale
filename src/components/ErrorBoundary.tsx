import { Component, ErrorInfo, ReactNode } from 'react';

interface Props { children: ReactNode }
interface State { hasError: boolean }

export default class ErrorBoundary extends Component<Props, State> {
  declare props: Props;
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Error de la app:', error, info.componentStack);
  }

  render() {
    if (!this.state.hasError) return this.props.children;
    const es = (navigator.language || 'es').startsWith('es');
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, padding: 24, background: '#0a0c14', color: '#e2e8f0', textAlign: 'center', fontFamily: 'Inter, sans-serif' }}>
        <h1 style={{ fontSize: 20 }}>{es ? 'Algo salió mal' : 'Something went wrong'}</h1>
        <p style={{ maxWidth: 320, fontSize: 14 }}>
          {es
            ? 'Tus datos siguen guardados en este dispositivo. Si estás en crisis, llama a tu contacto de emergencia o a tu línea de ayuda local.'
            : 'Your data is still saved on this device. If you are in crisis, call your emergency contact or your local helpline.'}
        </p>
        <button onClick={() => window.location.reload()} style={{ padding: '12px 24px', borderRadius: 12, border: 'none', background: '#38bdf8', color: '#0a0c14', fontWeight: 700, fontSize: 16 }}>
          {es ? 'Recargar' : 'Reload'}
        </button>
      </div>
    );
  }
}
