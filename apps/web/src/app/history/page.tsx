'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/layout/Header';
import { fetchApi } from '@/lib/auth';
import Link from 'next/link';

export default function HistoryPage() {
  const [scans, setScans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetchApi('/scans/history');
        if (res.ok) {
          const data = await res.json();
          setScans(data);
        }
      } catch (err) {
        console.error('Failed to fetch history:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  return (
    <div className="app-container">
      <Header />
      <div className="container" style={{ padding: '2.5rem 1.5rem' }}>
        <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span className="text-small" style={{ textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 700, color: 'var(--accent)' }}>
              Audit & Tracking
            </span>
            <h1 style={{ marginTop: '0.2rem' }}>Field Scan History</h1>
            <p>Complete historical log of all crop health assessments, detections, and confidence ratings.</p>
          </div>
          <Link href="/scan" className="btn-primary">
            📸 New Scan
          </Link>
        </div>

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '40vh' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem', animation: 'spin 2s linear infinite' }}>🌱</div>
            <p>Loading your scan records...</p>
          </div>
        ) : scans.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '4rem 1.5rem' }}>
            <span style={{ fontSize: '3rem', display: 'block', marginBottom: '1rem' }}>📋</span>
            <h3 style={{ marginBottom: '0.5rem' }}>No Scan Records Yet</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              Upload your first leaf image to begin logging diagnoses.
            </p>
            <Link href="/scan" className="btn-primary">
              Run First Scan
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {scans.map((scan) => (
              <div 
                key={scan.id} 
                className="card" 
                style={{ 
                  display: 'flex', 
                  gap: '1.5rem', 
                  alignItems: 'center', 
                  padding: '1.25rem 1.5rem',
                  borderLeft: `5px solid ${scan.is_healthy ? 'var(--confidence-high)' : '#DC2626'}`,
                  flexWrap: 'wrap'
                }}
              >
                <div style={{ 
                  width: '64px', 
                  height: '64px', 
                  backgroundColor: scan.is_healthy ? 'var(--accent-light)' : '#FEE2E2', 
                  borderRadius: 'var(--radius-md)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  fontSize: '2rem' 
                }}>
                  {scan.is_healthy ? '🌿' : '🍂'}
                </div>

                <div style={{ flex: 1, minWidth: '220px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <h3 style={{ fontSize: '1.15rem', color: scan.is_healthy ? 'var(--confidence-high)' : 'var(--text-primary)' }}>
                        {scan.is_healthy ? 'Healthy Plant' : scan.primary_disease.replace(/_/g, ' ')}
                      </h3>
                      <span className={`badge ${scan.is_healthy ? 'badge-success' : 'badge-danger'}`}>
                        {scan.is_healthy ? 'Healthy' : 'Action Required'}
                      </span>
                    </div>
                    <span className="text-small" style={{ color: 'var(--text-muted)' }}>
                      {new Date(scan.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>

                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
                    Crop Variety: <strong>{scan.primary_crop}</strong>
                  </p>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem' }}>
                    <div style={{ width: '120px', height: '6px', backgroundColor: '#E2E8F0', borderRadius: '99px', overflow: 'hidden' }}>
                      <div style={{ 
                        height: '100%', 
                        width: `${scan.confidence * 100}%`,
                        backgroundColor: scan.is_healthy ? 'var(--confidence-high)' : '#D97706'
                      }} />
                    </div>
                    <span className="text-xs" style={{ fontWeight: 700, color: 'var(--text-secondary)' }}>
                      Confidence: {(scan.confidence * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>

                <Link href="/scan" className="btn-secondary" style={{ padding: '0.45rem 1rem', fontSize: '0.85rem' }}>
                  Analyze New Leaf
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
