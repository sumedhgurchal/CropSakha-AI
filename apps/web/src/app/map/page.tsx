'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import Header from '@/components/layout/Header';
import { useI18n } from '@/lib/i18n';

// Leaflet requires window, dynamically import with ssr: false
const OutbreakMap = dynamic(() => import('@/components/map/OutbreakMap'), {
  ssr: false,
  loading: () => (
    <div style={{ height: '620px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-muted)', borderRadius: 'var(--radius-lg)' }}>
      <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🗺️</div>
      <p style={{ fontWeight: 600 }}>Loading Geospatial Radar...</p>
    </div>
  )
});

const CROPS = ['All', 'Tomato', 'Potato', 'Grape', 'Orange', 'Corn', 'Apple', 'Squash'];
const SEVERITIES = ['All', 'HIGH', 'MEDIUM', 'LOW'];

export default function MapPage() {
  const { t } = useI18n();
  const [selectedCrop, setSelectedCrop] = useState('All');
  const [selectedSeverity, setSelectedSeverity] = useState('All');

  return (
    <div className="app-container">
      <Header />
      <div className="container" style={{ padding: '2.5rem 1.5rem' }}>
        
        {/* Title & Headline */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: '#FEE2E2', color: '#B91C1C', padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-full)', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            ● Live Epidemic Surveillance
          </div>
          <h1>Geospatial Outbreak Tracking Radar</h1>
          <p>Real-time regional telemetry of reported fungal, bacterial, and viral crop pathogen vectors across India.</p>
        </div>

        {/* Telemetry Stat Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
          <div className="card" style={{ padding: '1.25rem' }}>
            <span className="text-small" style={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Active Clusters</span>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '0.25rem', color: 'var(--text-primary)' }}>10 Zones</div>
          </div>
          <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid #DC2626' }}>
            <span className="text-small" style={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#DC2626' }}>Red Alerts</span>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '0.25rem', color: '#DC2626' }}>5 Critical</div>
          </div>
          <div className="card" style={{ padding: '1.25rem' }}>
            <span className="text-small" style={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Primary Pathogen</span>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '0.25rem', color: 'var(--accent)' }}>Late Blight</div>
          </div>
          <div className="card" style={{ padding: '1.25rem' }}>
            <span className="text-small" style={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Farms Monitored</span>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '0.25rem', color: 'var(--text-primary)' }}>600+ Ha</div>
          </div>
        </div>

        {/* Filter Controls & Map View */}
        <div className="card" style={{ padding: '1.5rem', marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
            {/* Crop Pills */}
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 700, marginRight: '0.3rem', color: 'var(--text-muted)' }}>Crop:</span>
              {CROPS.map((crop) => (
                <button
                  key={crop}
                  onClick={() => setSelectedCrop(crop)}
                  style={{
                    padding: '0.35rem 0.8rem',
                    borderRadius: 'var(--radius-full)',
                    border: '1px solid',
                    borderColor: selectedCrop === crop ? 'var(--accent)' : 'var(--border)',
                    backgroundColor: selectedCrop === crop ? 'var(--accent-light)' : '#FFFFFF',
                    color: selectedCrop === crop ? 'var(--accent)' : 'var(--text-secondary)',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  {crop}
                </button>
              ))}
            </div>

            {/* Severity Legend / Filters */}
            <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 700, marginRight: '0.3rem', color: 'var(--text-muted)' }}>Severity:</span>
              {SEVERITIES.map((sev) => {
                const color = sev === 'HIGH' ? '#DC2626' : sev === 'MEDIUM' ? '#EA580C' : sev === 'LOW' ? '#EAB308' : 'var(--text-primary)';
                return (
                  <button
                    key={sev}
                    onClick={() => setSelectedSeverity(sev)}
                    style={{
                      padding: '0.35rem 0.75rem',
                      borderRadius: 'var(--radius-full)',
                      border: '1px solid',
                      borderColor: selectedSeverity === sev ? color : 'var(--border)',
                      backgroundColor: selectedSeverity === sev ? '#F8FAFC' : '#FFFFFF',
                      color: color,
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    {sev === 'HIGH' ? '● High' : sev === 'MEDIUM' ? '● Medium' : sev === 'LOW' ? '● Low' : 'All'}
                  </button>
                );
              })}
            </div>
          </div>

          <OutbreakMap cropFilter={selectedCrop} severityFilter={selectedSeverity} />
        </div>
      </div>
    </div>
  );
}
