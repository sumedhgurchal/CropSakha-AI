'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/layout/Header';
import { useI18n } from '@/lib/i18n';
import { Search, BookOpen, Microscope, CloudRain, Leaf, Pill, ShieldCheck, Sprout } from 'lucide-react';

const CROPS = ['All', 'Tomato', 'Potato', 'Corn', 'Apple', 'Grape', 'Pepper', 'Orange', 'Squash'];

export default function DiseasesPage() {
  const { language } = useI18n();
  const [diseases, setDiseases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCrop, setSelectedCrop] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDisease, setSelectedDisease] = useState<any | null>(null);

  useEffect(() => {
    const fetchDiseases = async () => {
      try {
        setLoading(true);
        let url = '/api/diseases';
        const params = new URLSearchParams();
        if (selectedCrop !== 'All') params.append('crop', selectedCrop);
        if (searchQuery.trim()) params.append('search', searchQuery.trim());
        if (params.toString()) url += `?${params.toString()}`;

        const res = await fetch(url);
        if (!res.ok) throw new Error('Failed to fetch diseases');
        const data = await res.json();
        setDiseases(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(() => {
      fetchDiseases();
    }, 200);

    return () => clearTimeout(debounce);
  }, [selectedCrop, searchQuery]);

  return (
    <div className="app-container">
      <Header />
      <div className="container" style={{ padding: '2.5rem 1.5rem' }}>
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'var(--accent-light)', color: 'var(--accent)', padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-full)', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            <BookOpen size={14} /> Curated Knowledge Base
          </div>
          <h1>Disease Encyclopedia</h1>
          <p>Scientific agricultural knowledge base with verified symptoms, organic biological cures, and chemical dosages.</p>
        </div>

        {/* Search Bar & Crop Filter Tabs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2.5rem' }}>
          {/* Search Input */}
          <div style={{ position: 'relative', width: '100%', maxWidth: '600px' }}>
            <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', display: 'flex' }}>
              <Search size={18} />
            </span>
            <input 
              type="text"
              placeholder="Search diseases, crops, pathogens, or symptoms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 1rem 0.75rem 2.75rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border)',
                backgroundColor: '#FFFFFF',
                fontSize: '0.95rem',
                boxShadow: 'var(--shadow-sm)',
                outline: 'none'
              }}
            />
          </div>

          {/* Crop Filter Pills */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {CROPS.map((crop) => (
              <button
                key={crop}
                onClick={() => setSelectedCrop(crop)}
                style={{
                  padding: '0.45rem 1rem',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid',
                  borderColor: selectedCrop === crop ? 'var(--accent)' : 'var(--border)',
                  backgroundColor: selectedCrop === crop ? 'var(--accent)' : '#FFFFFF',
                  color: selectedCrop === crop ? '#FFFFFF' : 'var(--text-secondary)',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: selectedCrop === crop ? '0 2px 8px rgba(5, 150, 105, 0.3)' : 'var(--shadow-sm)'
                }}
              >
                {crop === 'All' ? '🌐 All Crops' : crop}
              </button>
            ))}
          </div>
        </div>

        {/* Cards Grid */}
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '5rem 0' }}>
            <div style={{ marginBottom: '1rem' }}><Sprout size={48} color="var(--accent)" /></div>
            <p>Loading curated disease profiles...</p>
          </div>
        ) : error ? (
          <div className="card" style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--confidence-low)' }}>
            <p>{error}</p>
          </div>
        ) : diseases.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '4rem 1rem' }}>
            <p style={{ color: 'var(--text-muted)' }}>No disease profiles match your filter criteria.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.75rem' }}>
            {diseases.map((disease) => {
              const isHealthy = disease.name.toLowerCase().includes('healthy');
              return (
                <div 
                  key={disease.id} 
                  className="card" 
                  style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    borderTop: `4px solid ${isHealthy ? 'var(--confidence-high)' : '#F59E0B'}`,
                    cursor: 'pointer'
                  }}
                  onClick={() => setSelectedDisease(disease)}
                >
                  <div style={{ marginBottom: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.85rem' }}>
                    <span className="badge" style={{ backgroundColor: 'var(--accent-light)', color: 'var(--accent)', marginBottom: '0.35rem' }}>
                      {disease.crop}
                    </span>
                    <h3 style={{ fontSize: '1.25rem', marginTop: '0.35rem' }}>{disease.display_name}</h3>
                    {disease.regional_names?.[language] && (
                      <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--accent)', marginTop: '0.2rem' }}>
                        {disease.regional_names[language]}
                      </p>
                    )}
                  </div>

                  <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '1.25rem', flex: 1, lineHeight: 1.5 }}>
                    {disease.description}
                  </p>

                  {disease.symptoms && disease.symptoms.length > 0 && (
                    <div style={{ marginBottom: '1.25rem', background: '#F8FAFC', padding: '0.75rem', borderRadius: 'var(--radius-sm)' }}>
                      <strong style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.04em' }}>
                        Key Symptoms:
                      </strong>
                      <ul style={{ paddingLeft: '1.2rem', fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '0.35rem' }}>
                        {disease.symptoms.slice(0, 2).map((s: string, i: number) => (
                          <li key={i}>{s}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <button 
                    className="btn-secondary" 
                    style={{ width: '100%', marginTop: 'auto', padding: '0.55rem', fontSize: '0.88rem' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedDisease(disease);
                    }}
                  >
                    View Full Clinical Advisory →
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* Full Disease Modal */}
        {selectedDisease && (
          <div style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
            zIndex: 200
          }} onClick={() => setSelectedDisease(null)}>
            <div style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-xl)',
              maxWidth: '680px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '2rem',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              position: 'relative'
            }} onClick={(e) => e.stopPropagation()}>
              <button 
                onClick={() => setSelectedDisease(null)}
                style={{
                  position: 'absolute',
                  top: '1.25rem',
                  right: '1.25rem',
                  background: '#F1F5F9',
                  border: 'none',
                  borderRadius: '50%',
                  width: '36px',
                  height: '36px',
                  fontSize: '1.2rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                ✕
              </button>

              <span className="badge" style={{ backgroundColor: 'var(--accent-light)', color: 'var(--accent)', marginBottom: '0.5rem' }}>
                {selectedDisease.crop}
              </span>
              <h2 style={{ fontSize: '1.8rem', marginBottom: '0.25rem' }}>{selectedDisease.display_name}</h2>
              {selectedDisease.regional_names?.[language] && (
                <p style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--accent)', marginBottom: '1rem' }}>
                  {selectedDisease.regional_names[language]}
                </p>
              )}

              <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                {selectedDisease.description}
              </p>

              {/* Causes & Conditions */}
              {selectedDisease.causes && (
                <div style={{ marginBottom: '1.25rem', padding: '1rem', background: '#F8FAFC', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                  <h4 style={{ fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Microscope size={16} /> Pathogen & Causal Agent</h4>
                  <p style={{ fontSize: '0.88rem' }}>{selectedDisease.causes}</p>
                </div>
              )}

              {selectedDisease.favorable_conditions && (
                <div style={{ marginBottom: '1.25rem', padding: '1rem', background: '#F8FAFC', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                  <h4 style={{ fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}><CloudRain size={16} /> Favorable Environmental Conditions</h4>
                  <p style={{ fontSize: '0.88rem' }}>{selectedDisease.favorable_conditions}</p>
                </div>
              )}

              {/* Symptoms */}
              {selectedDisease.symptoms && selectedDisease.symptoms.length > 0 && (
                <div style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Diagnostic Symptoms:</h4>
                  <ul style={{ paddingLeft: '1.25rem', fontSize: '0.9rem', lineHeight: 1.6, color: 'var(--text-secondary)' }}>
                    {selectedDisease.symptoms.map((s: string, idx: number) => (
                      <li key={idx}>{s}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Organic Treatments */}
              {selectedDisease.treatment_organic && selectedDisease.treatment_organic.length > 0 && (
                <div style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{ color: 'var(--accent)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Leaf size={16} /> Biological & Organic Solutions:</h4>
                  <ul style={{ paddingLeft: '1.25rem', fontSize: '0.9rem', lineHeight: 1.6, color: 'var(--text-secondary)' }}>
                    {selectedDisease.treatment_organic.map((s: string, idx: number) => (
                      <li key={idx}>{s}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Chemical Treatments */}
              {selectedDisease.treatment_chemical && selectedDisease.treatment_chemical.length > 0 && (
                <div style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{ color: '#D97706', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Pill size={16} /> Chemical Fungicide Protocols:</h4>
                  <ul style={{ paddingLeft: '1.25rem', fontSize: '0.9rem', lineHeight: 1.6, color: 'var(--text-secondary)' }}>
                    {selectedDisease.treatment_chemical.map((s: string, idx: number) => (
                      <li key={idx}>{s}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Prevention */}
              {selectedDisease.prevention && selectedDisease.prevention.length > 0 && (
                <div style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{ color: '#0284C7', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}><ShieldCheck size={16} /> Agronomic Prevention & Cultural Practices:</h4>
                  <ul style={{ paddingLeft: '1.25rem', fontSize: '0.9rem', lineHeight: 1.6, color: 'var(--text-secondary)' }}>
                    {selectedDisease.prevention.map((s: string, idx: number) => (
                      <li key={idx}>{s}</li>
                    ))}
                  </ul>
                </div>
              )}

              <button 
                className="btn-primary" 
                style={{ width: '100%', marginTop: '1rem' }}
                onClick={() => setSelectedDisease(null)}
              >
                Close Profile
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
