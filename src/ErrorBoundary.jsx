import { Component } from 'react'

export default class ErrorBoundary extends Component {
  state = { error: null }

  static getDerivedStateFromError(error) {
    return { error }
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{ background: '#050505', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', fontFamily: 'JetBrains Mono, monospace' }}>
          <div style={{ maxWidth: '700px', width: '100%' }}>
            <div style={{ background: 'rgba(255,107,107,0.08)', border: '1px solid rgba(255,107,107,0.3)', borderRadius: '12px', padding: '2rem' }}>
              <div style={{ color: '#FF6B6B', fontSize: '0.75rem', letterSpacing: '0.2em', marginBottom: '1rem' }}>⚠ RUNTIME ERROR</div>
              <div style={{ color: '#FF6B6B', fontSize: '1rem', fontWeight: 'bold', marginBottom: '1rem' }}>{this.state.error.message}</div>
              <pre style={{ color: 'rgba(240,244,255,0.5)', fontSize: '0.7rem', overflow: 'auto', maxHeight: '300px', background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '8px', whiteSpace: 'pre-wrap' }}>
                {this.state.error.stack}
              </pre>
              <button onClick={() => window.location.reload()} style={{ marginTop: '1.5rem', padding: '0.75rem 2rem', background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.4)', borderRadius: '8px', color: '#00D4FF', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.75rem', letterSpacing: '0.15em' }}>
                RELOAD PAGE
              </button>
            </div>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
