'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/layout/Header';
import { fetchApi, isAuthenticated } from '@/lib/auth';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n';

const API_URL = 'http://localhost:8000';

export default function DashboardPage() {
  const { t } = useI18n();
  const [summary, setSummary] = useState<any>(null);
  const [weatherRisk, setWeatherRisk] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    setIsAuth(isAuthenticated());

    const loadDashboardData = async () => {
      try {
        setLoading(true);

        // Fetch dashboard summary
        const summaryRes = await fetchApi('/dashboard/summary');
        if (summaryRes.ok) {
          const sData = await summaryRes.json();
          setSummary(sData);
        }

        // Fetch weather risk
        const weatherRes = await fetch(`${API_URL}/weather/risk`);
        if (weatherRes.ok) {
          const wData = await weatherRes.json();
          setWeatherRisk(wData);
        }
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="app-container">
        <Header />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem', animation: 'spin 2s linear infinite' }}>🌱</div>
          <p style={{ fontWeight: 600 }}>Loading Farm Intelligence Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <Header />
      <div className="container" style={{ padding: '2.5rem 1.5rem' }}>
        
        {/* Guest Banner if not explicitly authenticated */}
        {!isAuth && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#ECFDF5', border: '1px solid #A7F3D0', padding: '0.75rem 1.25rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>⚡</span>
              <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--accent)' }}>
                Demo Farmer Profile Active: Viewing live farm telemetry & scan history for Ramesh Patil.
              </span>
            </div>
            <Link href="/login" className="btn-secondary" style={{ padding: '0.35rem 0.85rem', fontSize: '0.8rem' }}>
              Sign In to Personal Account
            </Link>
          </div>
        )}

        {/* Header Strip */}
        <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span className="text-small" style={{ textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 700, color: 'var(--accent)' }}>
              Crop Health Overview
            </span>
            <h1 style={{ marginTop: '0.2rem' }}>
              {summary?.user_name ? `${summary.user_name}'s Farm Dashboard` : 'Farm Intelligence Dashboard'}
            </h1>
            <p>Real-time clinical crop scan records, pathogen alarms, and microclimate risk telemetry.</p>
          </div>
          <Link href="/scan" className="btn-primary" style={{ padding: '0.75rem 1.75rem' }}>
            📸 New Crop Scan
          </Link>
        </div>

        {/* Environmental Weather Risk Advisory Card */}
        {weatherRisk && (
          <div className="card" style={{ 
            marginBottom: '2rem', 
            backgroundColor: '#FFFFFF', 
            borderLeft: `5px solid ${weatherRisk.risk_level === 'HIGH' ? '#DC2626' : '#059669'}`,
            boxShadow: 'var(--shadow-md)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
              <div style={{ flex: 1, minWidth: '280px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                  <span style={{ fontSize: '1.25rem' }}>☁️</span>
                  <h3 style={{ fontSize: '1.15rem' }}>
                    Microclimate Pathogen Alert: <span style={{ color: weatherRisk.risk_level === 'HIGH' ? '#DC2626' : '#059669' }}>{weatherRisk.risk_level} RISK</span>
                  </h3>
                </div>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem', fontWeight: 600 }}>
                  {weatherRisk.condition} · Rain Probability: {weatherRisk.rainfall_probability}%
                </p>
                <p style={{ fontSize: '0.92rem', color: 'var(--text-primary)', marginBottom: '0.6rem' }}>
                  {weatherRisk.message}
                </p>
                <div style={{ background: '#F8FAFC', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)' }}>Agronomic Action: </span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{weatherRisk.advisory}</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', background: '#F8FAFC', padding: '0.85rem 1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>{weatherRisk.temperature}°C</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>TEMPERATURE</div>
                </div>
                <div style={{ width: '1px', backgroundColor: 'var(--border)' }}></div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0284C7' }}>{weatherRisk.humidity}%</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>HUMIDITY</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 4 KPI Metrics Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
          <div className="card">
            <span className="text-small" style={{ textTransform: 'uppercase', fontWeight: 700, color: 'var(--text-muted)' }}>Total Leaf Scans</span>
            <div style={{ fontSize: '2.3rem', fontWeight: 800, marginTop: '0.25rem', color: 'var(--text-primary)' }}>
              {summary?.total_scans ?? 0}
            </div>
            <span className="text-xs" style={{ color: 'var(--accent)', fontWeight: 600 }}>All monitored fields</span>
          </div>

          <div className="card" style={{ borderBottom: '3px solid var(--confidence-high)' }}>
            <span className="text-small" style={{ textTransform: 'uppercase', fontWeight: 700, color: 'var(--text-muted)' }}>Healthy Plants</span>
            <div style={{ fontSize: '2.3rem', fontWeight: 800, marginTop: '0.25rem', color: 'var(--confidence-high)' }}>
              {summary?.healthy_crops ?? 0}
            </div>
            <span className="text-xs" style={{ color: 'var(--text-muted)', fontWeight: 600 }}>
              {summary?.healthy_rate_pct ?? 0}% Vigorous foliage
            </span>
          </div>

          <div className="card" style={{ borderBottom: '3px solid #DC2626' }}>
            <span className="text-small" style={{ textTransform: 'uppercase', fontWeight: 700, color: 'var(--text-muted)' }}>Action Required</span>
            <div style={{ fontSize: '2.3rem', fontWeight: 800, marginTop: '0.25rem', color: '#DC2626' }}>
              {summary?.action_needed ?? 0}
            </div>
            <span className="text-xs" style={{ color: '#DC2626', fontWeight: 600 }}>Pathogen detected</span>
          </div>

          <div className="card">
            <span className="text-small" style={{ textTransform: 'uppercase', fontWeight: 700, color: 'var(--text-muted)' }}>Primary Crop</span>
            <div style={{ fontSize: '2.3rem', fontWeight: 800, marginTop: '0.25rem', color: 'var(--accent)' }}>
              {summary?.top_crop || 'Tomato'}
            </div>
            <span className="text-xs" style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Active growing cycle</span>
          </div>
        </div>

        {/* Recent Scans Section */}
        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h2>Recent Diagnostic Scans</h2>
            <Link href="/history" style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--accent)' }}>
              View All History →
            </Link>
          </div>

          {summary?.recent_scans && summary.recent_scans.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {summary.recent_scans.map((scan: any) => (
                <div 
                  key={scan.id} 
                  className="card" 
                  style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    padding: '1.1rem 1.5rem',
                    flexWrap: 'wrap',
                    gap: '1rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                    <div style={{ 
                      width: '48px', 
                      height: '48px', 
                      borderRadius: 'var(--radius-md)', 
                      backgroundColor: scan.is_healthy ? 'var(--accent-light)' : '#FEE2E2',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.5rem'
                    }}>
                      {scan.is_healthy ? '🌿' : '🍂'}
                    </div>

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <h4 style={{ color: scan.is_healthy ? 'var(--confidence-high)' : 'var(--text-primary)' }}>
                          {scan.disease}
                        </h4>
                        <span className={`badge ${scan.is_healthy ? 'badge-success' : 'badge-danger'}`}>
                          {scan.is_healthy ? 'Healthy' : scan.severity_label}
                        </span>
                      </div>
                      <p className="text-small" style={{ marginTop: '0.15rem' }}>
                        Crop: <strong>{scan.crop}</strong> · Confidence: <strong>{scan.confidence}%</strong>
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{scan.created_at}</span>
                    <Link href="/scan" className="btn-secondary" style={{ padding: '0.4rem 0.9rem', fontSize: '0.82rem' }}>
                      Re-scan Crop
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="card" style={{ textAlign: 'center', padding: '3.5rem 1.5rem' }}>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>No leaf scans recorded yet.</p>
              <Link href="/scan" className="btn-primary">
                Run Your First Scan
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
