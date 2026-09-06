'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Popup, CircleMarker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

interface OutbreakMapProps {
  cropFilter?: string;
  severityFilter?: string;
}

export default function OutbreakMap({ cropFilter = 'All', severityFilter = 'All' }: OutbreakMapProps) {
  const [outbreaks, setOutbreaks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    let url = '/api/maps/outbreaks';
    const params = new URLSearchParams();
    if (cropFilter !== 'All') params.append('crop', cropFilter);
    if (severityFilter !== 'All') params.append('severity', severityFilter);
    if (params.toString()) url += `?${params.toString()}`;

    fetch(url)
      .then(res => res.json())
      .then(data => {
        setOutbreaks(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching outbreaks:", err);
        setLoading(false);
      });
  }, [cropFilter, severityFilter]);

  const getSeverityColor = (severity: string) => {
    switch (severity?.toUpperCase()) {
      case 'HIGH': return '#DC2626'; // Red
      case 'MEDIUM': return '#EA580C'; // Orange
      case 'LOW': return '#EAB308'; // Yellow
      default: return '#059669';
    }
  };

  return (
    <div style={{ position: 'relative', height: '620px', width: '100%', borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--border)' }}>
      {loading && (
        <div style={{
          position: 'absolute',
          top: '1rem',
          right: '1rem',
          background: 'rgba(255, 255, 255, 0.95)',
          padding: '0.4rem 0.85rem',
          borderRadius: 'var(--radius-full)',
          fontSize: '0.8rem',
          fontWeight: 600,
          zIndex: 1000,
          boxShadow: 'var(--shadow-md)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem'
        }}>
          <span>🔄</span> Updating Telemetry...
        </div>
      )}

      <MapContainer center={[20.5937, 76.9629]} zoom={5} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {outbreaks.map((outbreak) => {
          const color = getSeverityColor(outbreak.severity);
          return (
            <CircleMarker
              key={outbreak.id}
              center={[outbreak.lat, outbreak.lng]}
              radius={outbreak.severity === 'HIGH' ? 14 : outbreak.severity === 'MEDIUM' ? 11 : 8}
              pathOptions={{ 
                color: color, 
                fillColor: color, 
                fillOpacity: 0.65,
                weight: 2
              }}
            >
              <Popup>
                <div style={{ padding: '0.4rem 0.2rem', minWidth: '180px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                    <span style={{ 
                      fontSize: '0.72rem', 
                      fontWeight: 800, 
                      textTransform: 'uppercase', 
                      color: color, 
                      backgroundColor: outbreak.severity === 'HIGH' ? '#FEE2E2' : '#FEF3C7',
                      padding: '0.15rem 0.45rem',
                      borderRadius: 'var(--radius-full)'
                    }}>
                      {outbreak.alert_level || `${outbreak.severity} ALERT`}
                    </span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      Radius: {outbreak.affected_radius_km || 10} km
                    </span>
                  </div>

                  <strong style={{ display: 'block', fontSize: '1.05rem', color: 'var(--text-primary)', marginBottom: '0.15rem' }}>
                    {outbreak.disease}
                  </strong>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                    Crop: <strong>{outbreak.crop}</strong>
                  </p>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    📍 {outbreak.location_name}
                  </p>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                    Reported Cases: <strong>{outbreak.reported_cases || 24} farms</strong>
                  </p>
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  );
}
