import React from 'react'

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    // Log to console — Vercel deployment logs will capture server logs; you can
    // also forward this to an error-tracking service if desired.
    console.error('ErrorBoundary caught an error:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0b2545',
          color: '#fff',
          padding: '1rem',
          textAlign: 'center'
        }}>
          <div>
            <h2 style={{ marginBottom: '0.5rem' }}>Something went wrong</h2>
            <pre style={{ whiteSpace: 'pre-wrap', textAlign: 'left', color: '#ffdcdc' }}>
              {String(this.state.error && this.state.error.toString())}
            </pre>
            <p style={{ opacity: 0.85 }}>Open the browser console for details.</p>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
