'use client';

import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/layout/Header';
import { useI18n } from '@/lib/i18n';

export default function Home() {
  const { t } = useI18n();
  
  return (
    <div className="app-container">
      <Header />
      
      {/* Hero Section */}
      <section style={{ 
        padding: '5rem 1.5rem 4rem', 
        background: 'linear-gradient(180deg, #ECFDF5 0%, #F8FAFC 100%)', 
        borderBottom: '1px solid var(--border)',
        textAlign: 'center'
      }}>
        <div className="container" style={{ maxWidth: '900px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#FFFFFF', padding: '0.35rem 1rem', borderRadius: 'var(--radius-full)', border: '1px solid var(--accent-border)', marginBottom: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>
            <Image src="/logo.jpg" alt="CropSakha Logo" width={24} height={24} style={{ borderRadius: '4px' }} />
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent)' }}>Advanced AI Disease Detection Engine</span>
          </div>

          <h1 style={{ marginBottom: '1.25rem' }}>
            {t('hero.title') || 'Clinical Precision for Crop Health & Disease Surveillance'}
          </h1>
          
          <p style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', lineHeight: 1.6, maxWidth: '760px', margin: '0 auto 2.5rem' }}>
            Empowering Indian farmers with uncertainty-aware AI disease classification across 38 crop classes, real Grad-CAM visual explainability, localized organic and chemical treatments, and multilingual voice guidance.
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/scan" className="btn-primary" style={{ padding: '0.85rem 2rem', fontSize: '1.05rem' }}>
              📸 Start Leaf Diagnosis
            </Link>
            <Link href="/map" className="btn-secondary" style={{ padding: '0.85rem 2rem', fontSize: '1.05rem' }}>
              🗺️ View Outbreak Radar
            </Link>
          </div>

          {/* Quick Metrics Bar */}
          <div style={{ 
            marginTop: '3.5rem', 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', 
            gap: '1.25rem',
            background: '#FFFFFF',
            padding: '1.5rem',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--border)',
            boxShadow: 'var(--shadow-md)'
          }}>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent)' }}>38</div>
              <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Crop-Disease Classes</div>
            </div>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)' }}>&lt; 1 sec</div>
              <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Diagnosis Latency</div>
            </div>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent)' }}>Grad-CAM</div>
              <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Explainable Attention</div>
            </div>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)' }}>3 Languages</div>
              <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>EN · हिन्दी · मराठी + Audio</div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Workflow Pillars */}
      <section className="container" style={{ padding: '4.5rem 1.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ marginBottom: '0.5rem' }}>The CropSakha Architecture</h2>
          <p>Detect → Explain → Qualify Uncertainty → Inform → Track</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.75rem' }}>
          <div className="card" style={{ borderTop: '4px solid var(--accent)' }}>
            <div style={{ marginBottom: '1rem' }}><Image src="/icon_cv.jpg" alt="Computer Vision" width={52} height={52} style={{ borderRadius: '8px', mixBlendMode: 'multiply' }} /></div>
            <h3 style={{ marginBottom: '0.75rem' }}>1. Computer Vision Detection</h3>
            <p>Trained across 38 PlantVillage classes covering Tomato, Potato, Corn, Apple, Grape, Pepper, and more with image quality verification.</p>
          </div>

          <div className="card" style={{ borderTop: '4px solid #3B82F6' }}>
            <div style={{ marginBottom: '1rem' }}><Image src="/icon_xai.jpg" alt="Explainable AI" width={52} height={52} style={{ borderRadius: '8px', mixBlendMode: 'multiply' }} /></div>
            <h3 style={{ marginBottom: '0.75rem' }}>2. Explainable AI (Grad-CAM)</h3>
            <p>Visual attention heatmaps highlight the specific necrotic lesions and infected regions on the leaf so farmers understand why a diagnosis was made.</p>
          </div>

          <div className="card" style={{ borderTop: '4px solid #F59E0B' }}>
            <div style={{ marginBottom: '1rem' }}><Image src="/icon_rx.jpg" alt="Prescriptions" width={52} height={52} style={{ borderRadius: '8px', mixBlendMode: 'multiply' }} /></div>
            <h3 style={{ marginBottom: '0.75rem' }}>3. Dual-Action Prescriptions</h3>
            <p>Curated remedies with biological/organic solutions (Neem, Trichoderma) and exact chemical fungicide dosages vetted by ICAR agricultural protocols.</p>
          </div>

          <div className="card" style={{ borderTop: '4px solid #8B5CF6' }}>
            <div style={{ marginBottom: '1rem' }}><Image src="/icon_audio.jpg" alt="Audio Guidance" width={52} height={52} style={{ borderRadius: '8px', mixBlendMode: 'multiply' }} /></div>
            <h3 style={{ marginBottom: '0.75rem' }}>4. Audio Voice Guidance</h3>
            <p>Inclusive accessibility for rural farmers: click to listen to diagnosis and remedies read aloud in English, Hindi, or Marathi via Web Speech API.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ marginTop: 'auto', borderTop: '1px solid var(--border)', background: '#FFFFFF', padding: '2rem 1.5rem', textAlign: 'center' }}>
        <div className="container">
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
            🌱 CropSakha AI — Dedicated to Indian Farmers.
          </p>
        </div>
      </footer>
    </div>
  );
}
