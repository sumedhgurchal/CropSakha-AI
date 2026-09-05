'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { setToken } from '@/lib/auth';
import Header from '@/components/layout/Header';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const executeLogin = async (loginEmail: string, loginPass: string) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('http://localhost:8000/auth/login/json', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: loginEmail, password: loginPass }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.detail || 'Failed to login');
      }

      const data = await res.json();
      setToken(data.access_token);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await executeLogin(email, password);
  };

  const handleQuickDemoLogin = async () => {
    setEmail('demo@cropsakha.ai');
    setPassword('cropsakha123');
    await executeLogin('demo@cropsakha.ai', 'cropsakha123');
  };

  return (
    <div className="app-container">
      <Header />
      <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '4rem 1.5rem', minHeight: '80vh' }}>
        <div className="card" style={{ width: '100%', maxWidth: '420px', padding: '2.25rem' }}>
          
          {/* Top Title */}
          <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
            <span style={{ fontSize: '2rem' }}>🌱</span>
            <h1 style={{ fontSize: '1.6rem', marginTop: '0.25rem' }}>Welcome to CropSakha</h1>
            <p className="text-small" style={{ marginTop: '0.25rem' }}>Sign in to manage your crops and access clinical scans.</p>
          </div>

          {/* 1-Click Demo Login */}
          <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', textAlign: 'center' }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.35rem' }}>
              ⚡ Demo Access
            </div>
            <p className="text-xs" style={{ color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
              One-click access with pre-seeded farm telemetry, health charts, and scan logs.
            </p>
            <button 
              type="button" 
              onClick={handleQuickDemoLogin}
              disabled={loading}
              className="btn-primary"
              style={{ width: '100%', padding: '0.6rem 1rem', fontSize: '0.88rem' }}
            >
              {loading ? 'Authenticating...' : '⚡ 1-Click Demo Login'}
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border)' }}></div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>or with credentials</span>
            <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border)' }}></div>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            {error && (
              <div style={{ padding: '0.75rem', backgroundColor: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 'var(--radius-sm)', color: 'var(--confidence-low)', fontSize: '0.85rem' }}>
                {error}
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <label htmlFor="email" style={{ fontSize: '0.88rem', fontWeight: 600 }}>Email Address</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@domain.com"
                required
                style={{ padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', fontSize: '0.95rem', outline: 'none' }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <label htmlFor="password" style={{ fontSize: '0.88rem', fontWeight: 600 }}>Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                style={{ padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', fontSize: '0.95rem', outline: 'none' }}
              />
            </div>

            <button type="submit" className="btn-secondary" disabled={loading} style={{ marginTop: '0.5rem', padding: '0.75rem' }}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.85rem' }}>
            <span style={{ color: 'var(--text-secondary)' }}>New to CropSakha AI? </span>
            <Link href="/register" style={{ fontWeight: 600 }}>Create account</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
