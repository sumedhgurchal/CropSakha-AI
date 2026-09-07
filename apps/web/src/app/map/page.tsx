'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import Header from '@/components/layout/Header';
import { useI18n } from '@/lib/i18n';
import { MapPin, AlertTriangle, Activity, BarChart3 } from 'lucide-react';

// Leaflet requires window, dynamically import with ssr: false
const OutbreakMap = dynamic(() => import('@/components/map/OutbreakMap'), {
  ssr: false,
  loading: () => (
    <div style={{ height: '620px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-muted)', borderRadius: 'var(--radius-lg)' }}>
      <MapPin size={48} color="var(--text-muted)" style={{ marginBottom: '1rem', opacity: 0.4 }} />
      <p style={{ fontWeight: 500, color: 'var(--text-muted)' }}>Loading Geospatial Radar...</p>
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
      <div className="container" style={{ padding: '2.5rem 1.5rem 4rem' }}>

        {/* Page Header */}
        <div style={{ marginBottom: '2.5rem' }}>
          <span className="section-label" style={{ background: '#FEE2E2', color: '#B91C1C', borderColor: '#FECACA' }}>
            <Activity size={14} /> Live Epidemic Surveillance
          </span>
          <h1 style={{ marginBottom: '0.5rem' }}>Outbreak Tracking Radar</h1>
          <p style={{ maxWidth: '580px' }}>Real-time regional telemetry of reported fungal, bacterial, and viral crop pathogen vectors across monitored agricultural zones.</p>
        </div>

        {/* Telemetry Stat Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
          <div className="card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
              <MapPin size={16} color="var(--text-muted)" />
              <span className="text-small" style={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Active Clusters</span>
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>10 Zones</div>
          </div>
          <div className="card" style={{ padding: '1.25rem', borderLeft: '3px solid #DC2626' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
              <AlertTriangle size={16} color="#DC2626" />
              <span className="text-small" style={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#DC2626' }}>Red Alerts</span>
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#DC2626', letterSpacing: '-0.02em' }}>5 Critical</div>
          </div>
          <div className="card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
              <Activity size={16} color="var(--accent)" />
              <span className="text-small" style={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Primary Pathogen</span>
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--accent)', letterSpacing: '-0.02em' }}>Late Blight</div>
          </div>
          <div className="card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
              <BarChart3 size={16} color="var(--text-muted)" />
              <span className="text-small" style={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Farms Monitored</span>
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>600+ Ha</div>
          </div>
        </div>

        {/* Filter Controls & Map */}
        <div className="card" style={{ padding: '1.5rem', marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
            {/* Crop Pills */}
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, marginRight: '0.25rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Crop</span>
              {CROPS.map((crop) => (
                <button
                  key={crop}
                  onClick={() => setSelectedCrop(crop)}
                  style={{
                    padding: '0.35rem 0.8rem',
                    borderRadius: 'var(--radius-full)',
                    border: '1px solid',
                    borderColor: selectedCrop === crop ? 'var(--accent)' : 'var(--border)',
                    backgroundColor: selectedCrop === crop ? 'var(--accent-light)' : 'var(--bg-white)',
                    color: selectedCrop === crop ? 'var(--accent)' : 'var(--text-secondary)',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {crop}
                </button>
              ))}
            </div>

            {/* Severity Filters */}
            <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, marginRight: '0.25rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Severity</span>
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
                      backgroundColor: selectedSeverity === sev ? `${color}10` : 'var(--bg-white)',
                      color: color,
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
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
