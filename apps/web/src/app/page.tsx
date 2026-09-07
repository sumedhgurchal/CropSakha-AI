'use client';

import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/layout/Header';
import { useI18n } from '@/lib/i18n';
import {
  ArrowRight, ExternalLink, Microscope, BrainCircuit, Pill,
  AudioLines, Leaf, ShieldCheck, Zap, BarChart3, Eye,
  Languages, Timer, Target, FlaskConical, Sprout,
  ChevronRight, TrendingUp, Database, Cpu
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

/* ── Animated Counter Hook ─────────────────────────────────────────────── */
function useCountUp(end: number, duration = 2000, suffix = '', decimals = 0) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const start = 0;
          const startTime = performance.now();
          const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(parseFloat((start + (end - start) * eased).toFixed(decimals)));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, duration, decimals]);

  return { ref, display: `${count}${suffix}` };
}

/* ── Stat Card ──────────────────────────────────────────────────────────── */
function StatCard({ value, suffix, label, decimals = 0 }: { value: number; suffix: string; label: string; decimals?: number }) {
  const { ref, display } = useCountUp(value, 2000, suffix, decimals);
  return (
    <div ref={ref} style={{ textAlign: 'center' }}>
      <div style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.1, letterSpacing: '-0.03em' }}>
        {display}
      </div>
      <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 500, marginTop: '0.25rem' }}>{label}</div>
    </div>
  );
}

/* ── Demo Tab Content ───────────────────────────────────────────────────── */
const DEMO_TABS = [
  {
    id: 'detect',
    label: 'Disease Detection',
    icon: <Target size={16} />,
    content: (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', alignItems: 'center' }}>
        <div style={{ background: 'var(--bg-muted)', borderRadius: 'var(--radius-lg)', padding: '2rem', display: 'flex', flexDirection: 'column' as const, alignItems: 'center', justifyContent: 'center', minHeight: '240px' }}>
          <Leaf size={48} color="var(--accent)" strokeWidth={1.5} />
          <p style={{ fontSize: '0.88rem', marginTop: '1rem', textAlign: 'center' as const, color: 'var(--text-muted)' }}>Upload a leaf image to start analysis</p>
        </div>
        <div>
          <div style={{ background: '#ECFDF5', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem', border: '1px solid var(--accent-border)' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase' as const, letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Detection Result</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>Early Blight</div>
            <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>Tomato · <em>Alternaria solani</em></div>
          </div>
          <div style={{ marginBottom: '0.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Confidence</span>
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--accent)' }}>96.7%</span>
            </div>
            <div style={{ height: '6px', background: '#E2E8F0', borderRadius: '99px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: '96.7%', background: 'var(--accent)', borderRadius: '99px', transition: 'width 1.5s ease' }} />
            </div>
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.75rem' }}>38-class PlantVillage classification covering 14 crop species and 26 diseases</p>
        </div>
      </div>
    ),
  },
  {
    id: 'xai',
    label: 'Grad-CAM XAI',
    icon: <BrainCircuit size={16} />,
    content: (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', alignItems: 'center' }}>
        <div style={{ background: 'var(--bg-muted)', borderRadius: 'var(--radius-lg)', padding: '2rem', display: 'flex', flexDirection: 'column' as const, alignItems: 'center', justifyContent: 'center', minHeight: '240px', position: 'relative' as const }}>
          <Eye size={48} color="var(--text-muted)" strokeWidth={1.5} />
          <p style={{ fontSize: '0.88rem', marginTop: '1rem', textAlign: 'center' as const, color: 'var(--text-muted)' }}>Original leaf image</p>
        </div>
        <div style={{ background: 'linear-gradient(135deg, rgba(239,68,68,0.05), rgba(251,191,36,0.05), rgba(5,150,105,0.05))', borderRadius: 'var(--radius-lg)', padding: '2rem', display: 'flex', flexDirection: 'column' as const, alignItems: 'center', justifyContent: 'center', minHeight: '240px', border: '1px solid rgba(239,68,68,0.15)' }}>
          <BrainCircuit size={48} color="#EF4444" strokeWidth={1.5} />
          <p style={{ fontSize: '0.88rem', marginTop: '1rem', textAlign: 'center' as const, color: 'var(--text-secondary)' }}>Grad-CAM attention heatmap overlay</p>
          <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem' }}>
            <span style={{ width: '12px', height: '12px', borderRadius: '2px', background: '#EF4444' }} />
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>High attention</span>
            <span style={{ width: '12px', height: '12px', borderRadius: '2px', background: '#FBB724' }} />
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Medium</span>
            <span style={{ width: '12px', height: '12px', borderRadius: '2px', background: '#10B981' }} />
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Low</span>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'rx',
    label: 'Treatment Rx',
    icon: <Pill size={16} />,
    content: (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <div style={{ background: '#ECFDF5', border: '1px solid var(--accent-border)', borderRadius: 'var(--radius-lg)', padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <Leaf size={18} color="var(--accent)" />
            <span style={{ fontWeight: 700, color: 'var(--accent)', fontSize: '0.9rem' }}>Organic Remedies</span>
          </div>
          <ul style={{ paddingLeft: '1.2rem', fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.7, listStyle: 'disc' }}>
            <li>Apply neem oil spray (2-3ml/L) every 7 days</li>
            <li>Use Trichoderma viride (5g/L) as soil drench</li>
            <li>Remove and destroy infected foliage promptly</li>
          </ul>
        </div>
        <div style={{ background: '#FEF3C7', border: '1px solid #FDE68A', borderRadius: 'var(--radius-lg)', padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <FlaskConical size={18} color="#B45309" />
            <span style={{ fontWeight: 700, color: '#B45309', fontSize: '0.9rem' }}>Chemical Protocols</span>
          </div>
          <ul style={{ paddingLeft: '1.2rem', fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.7, listStyle: 'disc' }}>
            <li>Mancozeb 75% WP @ 2.5g/L foliar spray</li>
            <li>Chlorothalonil 720 SC @ 2ml/L at 10-day intervals</li>
            <li>Copper oxychloride 50% WP @ 3g/L preventive</li>
          </ul>
        </div>
      </div>
    ),
  },
  {
    id: 'voice',
    label: 'Voice Guidance',
    icon: <AudioLines size={16} />,
    content: (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', alignItems: 'center' }}>
        <div style={{ background: 'linear-gradient(135deg, #EDE9FE, #F3E8FF)', borderRadius: 'var(--radius-lg)', padding: '2rem', display: 'flex', flexDirection: 'column' as const, alignItems: 'center', justifyContent: 'center', minHeight: '240px' }}>
          <AudioLines size={48} color="#7C3AED" strokeWidth={1.5} />
          <p style={{ fontSize: '1.1rem', fontWeight: 700, color: '#5B21B6', marginTop: '1rem' }}>24 Languages</p>
          <p style={{ fontSize: '0.82rem', color: '#7C3AED', marginTop: '0.25rem', textAlign: 'center' as const }}>Hindi · Marathi · Bengali · Tamil · Telugu · Gujarati · + 18 more</p>
        </div>
        <div>
          <div style={{ background: 'var(--bg-white)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '0.75rem', border: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981' }} />
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>VOICE TRANSCRIPT</span>
            </div>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-primary)', fontStyle: 'italic' }}>&quot;आपकी टमाटर की फसल में अर्ली ब्लाइट रोग पाया गया है। नीम तेल 2ml/L पानी में मिलाकर छिड़काव करें...&quot;</p>
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Web Speech API enables text-to-speech and speech-to-text in all 24 scheduled Indian languages, making diagnosis accessible to every farmer.</p>
        </div>
      </div>
    ),
  },
];

/* ── Benchmark Table Data ───────────────────────────────────────────────── */
const BENCHMARK_ROWS = [
  { label: '5 images/class', dino: '94.82%', imagenet: '84.51%', diff: '+10.31%' },
  { label: '30 images/class', dino: '98.53%', imagenet: '94.64%', diff: '+3.89%' },
  { label: 'Full dataset', dino: '99.56%', imagenet: '97.34%', diff: '+2.22%' },
];

/* ══════════════════════════════════════════════════════════════════════════
   MAIN PAGE COMPONENT
   ══════════════════════════════════════════════════════════════════════════ */
export default function Home() {
  const { t } = useI18n();
  const [activeDemo, setActiveDemo] = useState('detect');

  return (
    <>
      <Header />

      {/* ── Section 1: Hero ──────────────────────────────────────────── */}
      <section style={{
        position: 'relative',
        overflow: 'hidden',
        padding: 'clamp(4rem, 10vw, 7rem) 0 clamp(3rem, 6vw, 5rem)',
      }}>
        {/* Gradient Blob Background */}
        <div style={{
          position: 'absolute',
          top: '-30%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '140%',
          height: '120%',
          background: 'radial-gradient(ellipse at 50% 30%, rgba(5,150,105,0.08) 0%, rgba(16,185,129,0.04) 35%, rgba(212,168,67,0.03) 60%, transparent 80%)',
          pointerEvents: 'none',
          zIndex: 0,
        }} />
        {/* Decorative SVG */}
        <div style={{
          position: 'absolute',
          top: '10%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '800px',
          opacity: 0.06,
          pointerEvents: 'none',
          zIndex: 0,
        }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/leaf-pattern.svg" alt="" aria-hidden="true" style={{ width: '100%' }} />
        </div>

        <div className="container" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          {/* Badge */}
          <div className="animate-on-scroll" style={{ marginBottom: '1.5rem' }}>
            <span className="section-label" style={{ fontSize: '0.72rem' }}>
              <Sprout size={14} /> LeafVision DINO ResNet-50 · Self-Supervised Foundation Model
            </span>
          </div>

          {/* Heading */}
          <h1 className="animate-on-scroll" style={{ maxWidth: '800px', margin: '0 auto 1.25rem' }}>
            AI-Powered Crop Health Intelligence
          </h1>

          {/* Subtitle */}
          <p className="animate-on-scroll" style={{ maxWidth: '640px', margin: '0 auto 2.5rem', fontSize: '1.1rem', lineHeight: 1.7 }}>
            Trained on 540K+ leaf images. 99.7% validation accuracy across 38 crop-disease classes. Real Grad-CAM explainability. 24 Indian languages.
          </p>

          {/* CTAs */}
          <div className="animate-on-scroll" style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '3.5rem' }}>
            <Link href="/scan" className="btn-primary" style={{ padding: '0.85rem 2rem' }}>
              Start Leaf Diagnosis <ArrowRight size={18} />
            </Link>
            <a href="https://doi.org/10.1016/j.engappai.2026.114660" target="_blank" rel="noopener noreferrer" className="btn-secondary">
              View Research Paper <ExternalLink size={16} />
            </a>
          </div>

          {/* Quick Stats Bar */}
          <div className="animate-on-scroll" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '1.5rem',
            maxWidth: '680px',
            margin: '0 auto',
            padding: '1.5rem 2rem',
            background: 'rgba(255,255,255,0.7)',
            backdropFilter: 'blur(12px)',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid rgba(255,255,255,0.6)',
            boxShadow: 'var(--shadow-md)',
          }}>
            <StatCard value={99.7} suffix="%" label="Val Accuracy" decimals={1} />
            <StatCard value={200} suffix="ms" label="Inference" decimals={0} />
            <StatCard value={38} suffix="" label="Classes" />
            <StatCard value={24} suffix="" label="Languages" />
          </div>
        </div>
      </section>

      {/* ── Section 2: Trust Bar (Dataset Marquee) ───────────────────── */}
      <section style={{
        borderTop: '1px solid var(--border)',
        borderBottom: '1px solid var(--border)',
        padding: '1.5rem 0',
        overflow: 'hidden',
        background: 'rgba(255,255,255,0.4)',
      }}>
        <div className="container" style={{ textAlign: 'center', marginBottom: '0.75rem' }}>
          <span style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--text-muted)' }}>
            Trained & Validated on Open Research Datasets
          </span>
        </div>
        <div style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}>
          <div style={{
            display: 'inline-flex',
            gap: '3rem',
            animation: 'marquee 40s linear infinite',
            paddingLeft: '100%',
          }}>
            {['PlantVillage', 'PlantDoc', 'Cassava Leaf Disease', 'Rice Leaf Diseases', 'DeepWeeds', 'PlantifyDR', 'FGVC7 Plant Pathology', 'PlantVillage', 'PlantDoc', 'Cassava Leaf Disease', 'Rice Leaf Diseases', 'DeepWeeds', 'PlantifyDR', 'FGVC7 Plant Pathology'].map((name, i) => (
              <span key={i} style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 3: Interactive Product Demo ──────────────────────── */}
      <section className="section">
        <div className="container">
          <div className="section-heading animate-on-scroll">
            <span className="section-label"><Zap size={14} /> Live Engine Demo</span>
            <h2>The CropSakha Engine</h2>
            <p>From leaf scan to prescriptive treatment in under 200ms. Explore each stage of the diagnostic pipeline.</p>
          </div>

          <div className="animate-on-scroll" style={{
            background: 'var(--bg-white)',
            borderRadius: 'var(--radius-2xl)',
            border: '1px solid var(--border)',
            padding: '2rem',
            boxShadow: 'var(--shadow-lg)',
          }}>
            {/* Tab Navigation */}
            <div className="tab-nav" style={{ marginBottom: '2rem' }}>
              {DEMO_TABS.map((tab) => (
                <button
                  key={tab.id}
                  className={`tab-btn ${activeDemo === tab.id ? 'active' : ''}`}
                  onClick={() => setActiveDemo(tab.id)}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                >
                  {tab.icon} {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div key={activeDemo} className="animate-fade-in">
              {DEMO_TABS.find((t) => t.id === activeDemo)?.content}
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 4: Benchmark Performance (Bento Grid) ────────────── */}
      <section className="section" style={{ background: 'rgba(255,255,255,0.5)' }}>
        <div className="container">
          <div className="section-heading animate-on-scroll">
            <span className="section-label"><BarChart3 size={14} /> Model Performance</span>
            <h2>State-of-the-Art Accuracy</h2>
            <p>LeafVision DINO achieves significant accuracy gains over standard ImageNet pre-training, especially in low-data regimes.</p>
          </div>

          {/* Bento Grid */}
          <div className="animate-on-scroll" style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr',
            gap: '1.5rem',
            marginBottom: '1.5rem',
          }}>
            {/* Large Card: Benchmark Table */}
            <div className="card" style={{ padding: '2rem' }}>
              <h3 style={{ marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <TrendingUp size={20} color="var(--accent)" /> LeafVision DINO vs ImageNet Baseline
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                Top-1 accuracy (%) on PlantVillage 38-class with varying labeled data
              </p>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border)' }}>
                    <th style={{ textAlign: 'left', padding: '0.65rem 0.75rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Data Regime</th>
                    <th style={{ textAlign: 'center', padding: '0.65rem 0.75rem', color: 'var(--accent)', fontWeight: 700, fontSize: '0.82rem' }}>DINO</th>
                    <th style={{ textAlign: 'center', padding: '0.65rem 0.75rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.82rem' }}>ImageNet</th>
                    <th style={{ textAlign: 'center', padding: '0.65rem 0.75rem', color: 'var(--confidence-high)', fontWeight: 700, fontSize: '0.82rem' }}>Δ Gain</th>
                  </tr>
                </thead>
                <tbody>
                  {BENCHMARK_ROWS.map((row, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '0.75rem', fontWeight: 600 }}>{row.label}</td>
                      <td style={{ padding: '0.75rem', textAlign: 'center', fontWeight: 800, color: 'var(--accent)', fontSize: '1rem' }}>{row.dino}</td>
                      <td style={{ padding: '0.75rem', textAlign: 'center', color: 'var(--text-muted)' }}>{row.imagenet}</td>
                      <td style={{ padding: '0.75rem', textAlign: 'center', fontWeight: 700, color: 'var(--confidence-high)' }}>{row.diff}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Small Card: Training Stats */}
            <div className="card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '1.5rem' }}>
              <div>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>Training Accuracy</div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>99.98%</div>
              </div>
              <div>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>Validation Accuracy</div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent)', letterSpacing: '-0.02em' }}>99.69%</div>
              </div>
              <div>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>Weighted F1 Score</div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--gold)', letterSpacing: '-0.02em' }}>0.9944</div>
              </div>
              <div style={{ padding: '0.65rem 1rem', background: 'var(--bg-muted)', borderRadius: 'var(--radius-md)', fontSize: '0.82rem' }}>
                <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>200 epochs</span>
                <span style={{ color: 'var(--text-muted)' }}> in </span>
                <span style={{ fontWeight: 700, color: 'var(--accent)' }}>2.3 min</span>
              </div>
            </div>
          </div>

          {/* Dataset Stats Row */}
          <div className="animate-on-scroll" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
            {[
              { icon: <Database size={20} color="var(--accent)" />, value: '540K+', label: 'Pre-training Images' },
              { icon: <Cpu size={20} color="#7C3AED" />, value: '38,013', label: 'Training Samples' },
              { icon: <ShieldCheck size={20} color="var(--gold)" />, value: '8,145', label: 'Validation Samples' },
            ].map((stat, i) => (
              <div key={i} className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem 1.5rem' }}>
                <div style={{ flexShrink: 0, width: '44px', height: '44px', borderRadius: 'var(--radius-md)', background: 'var(--bg-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {stat.icon}
                </div>
                <div>
                  <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>{stat.value}</div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 500 }}>{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 5: Architecture Pipeline ──────────────────────────── */}
      <section className="section">
        <div className="container">
          <div className="section-heading animate-on-scroll">
            <span className="section-label"><Cpu size={14} /> Architecture</span>
            <h2>From Pixel to Prescription</h2>
            <p>A four-stage pipeline that detects, explains, prescribes, and guides — entirely on-device with cloud Gemini fallback.</p>
          </div>

          <div className="animate-on-scroll" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1.5rem',
          }}>
            {[
              {
                icon: <Microscope size={28} />,
                color: 'var(--accent)',
                borderColor: 'var(--accent)',
                title: 'LeafVision DINO',
                desc: 'Self-supervised foundation model pretrained on 540K+ leaf images using DINOv2 architecture with ResNet-50 backbone.',
              },
              {
                icon: <BrainCircuit size={28} />,
                color: '#3B82F6',
                borderColor: '#3B82F6',
                title: 'Grad-CAM Explainability',
                desc: 'PyTorch attention heatmaps showing exactly where the AI detects pathogen damage, visible lesions, and necrotic tissue.',
              },
              {
                icon: <Pill size={28} />,
                color: '#D97706',
                borderColor: '#D97706',
                title: 'Gemini Treatment Rx',
                desc: 'Organic & chemical remedies with exact dosages and schedules, generated by Gemini 1.5 Pro in the farmer\'s native language.',
              },
              {
                icon: <AudioLines size={28} />,
                color: '#7C3AED',
                borderColor: '#7C3AED',
                title: 'Multilingual Voice',
                desc: '24 Indian languages with Web Speech TTS & STT for inclusive access. Voice-first UX designed for field use.',
              },
            ].map((feature, i) => (
              <div key={i} className="card" style={{
                borderTop: `3px solid ${feature.borderColor}`,
                padding: '1.75rem',
                display: 'flex',
                flexDirection: 'column',
              }}>
                <div style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: 'var(--radius-md)',
                  background: `${feature.color}10`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.25rem',
                  color: feature.color,
                }}>
                  {feature.icon}
                </div>
                <h3 style={{ marginBottom: '0.5rem' }}>{feature.title}</h3>
                <p style={{ fontSize: '0.92rem', lineHeight: 1.6, flex: 1 }}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 6: CSIRO Biomass ──────────────────────────────────── */}
      <section className="section" style={{ background: 'rgba(255,255,255,0.5)' }}>
        <div className="container">
          <div className="animate-on-scroll" style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '3rem',
            alignItems: 'center',
          }}>
            <div>
              <span className="section-label"><Sprout size={14} /> Biomass Analytics</span>
              <h2 style={{ marginTop: '0.75rem', marginBottom: '1rem' }}>CSIRO Image2Biomass Engine</h2>
              <p style={{ marginBottom: '1.5rem' }}>
                Allometric vision engine estimates canopy cover, vegetation density, and projected yield from a single overhead photo. Powered by CSIRO research methodologies adapted for smallholder farm assessment.
              </p>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <Link href="/scan" className="btn-primary" style={{ padding: '0.7rem 1.5rem' }}>
                  Try Biomass Scan <ArrowRight size={16} />
                </Link>
              </div>
            </div>
            <div className="card" style={{ padding: '1.75rem' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: '1rem' }}>Sample Biomass Output</div>
              {[
                { label: 'Canopy Cover', value: '67.4%', bar: 67.4, color: 'var(--accent)' },
                { label: 'Vegetation Index (NDVI)', value: '0.72', bar: 72, color: '#3B82F6' },
                { label: 'Leaf Area Index', value: '3.8', bar: 76, color: '#7C3AED' },
                { label: 'Estimated Yield', value: '2.4 t/ha', bar: 60, color: 'var(--gold)' },
              ].map((metric, i) => (
                <div key={i} style={{ marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{metric.label}</span>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: metric.color }}>{metric.value}</span>
                  </div>
                  <div style={{ height: '6px', background: '#E2E8F0', borderRadius: '99px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${metric.bar}%`, background: metric.color, borderRadius: '99px', transition: 'width 1.5s ease' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 7: CTA Banner ─────────────────────────────────────── */}
      <section className="section">
        <div className="container">
          <div className="animate-on-scroll" style={{
            background: 'linear-gradient(135deg, #1A1F2E 0%, #0F172A 60%, #1E293B 100%)',
            borderRadius: 'var(--radius-2xl)',
            padding: 'clamp(2.5rem, 5vw, 4rem)',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}>
            {/* Decorative glow */}
            <div style={{
              position: 'absolute',
              top: '-50%',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '600px',
              height: '600px',
              background: 'radial-gradient(circle, rgba(5,150,105,0.15) 0%, transparent 70%)',
              pointerEvents: 'none',
            }} />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <h2 style={{ color: 'var(--text-on-dark)', marginBottom: '0.75rem' }}>Ready to Protect Your Crops?</h2>
              <p style={{ color: 'var(--text-on-dark-muted)', maxWidth: '480px', margin: '0 auto 2rem', fontSize: '1.05rem' }}>
                Upload a leaf photo and get instant disease detection, explainable AI heatmaps, and expert treatment plans — completely free.
              </p>
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link href="/scan" className="btn-primary" style={{ padding: '0.85rem 2rem' }}>
                  Start Diagnosis <ArrowRight size={18} />
                </Link>
                <Link href="/diseases" className="btn-outline-light">
                  Browse Disease Library <ChevronRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 8: Footer ─────────────────────────────────────────── */}
      <footer style={{
        borderTop: '1px solid var(--border)',
        background: 'var(--bg-white)',
        padding: '3.5rem 0 2rem',
      }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr 1fr 1fr',
            gap: '2.5rem',
            marginBottom: '2.5rem',
          }}>
            {/* Brand Column */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <Image src="/logo.jpg" alt="CropSakha" width={28} height={28} style={{ borderRadius: '6px' }} />
                <span style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>CropSakha AI</span>
              </div>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', maxWidth: '280px', lineHeight: 1.6 }}>
                State-of-the-art crop disease detection for Indian agriculture. Built with LeafVision DINO, Grad-CAM XAI, and Gemini 1.5 Pro.
              </p>
            </div>

            {/* Products Column */}
            <div>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: '1rem' }}>Products</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                <Link href="/scan" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Leaf Diagnosis</Link>
                <Link href="/diseases" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Disease Library</Link>
                <Link href="/map" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Outbreak Map</Link>
                <Link href="/dashboard" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Dashboard</Link>
              </div>
            </div>

            {/* Resources Column */}
            <div>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: '1rem' }}>Resources</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                <a href="https://doi.org/10.1016/j.engappai.2026.114660" target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Research Paper</a>
                <a href="https://github.com/sumedhgurchal/CropSakha-AI" target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>GitHub</a>
                <a href="https://www.kaggle.com/datasets/abdallahalidev/plantvillage-dataset" target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>PlantVillage Dataset</a>
              </div>
            </div>

            {/* Technology Column */}
            <div>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: '1rem' }}>Technology</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>PyTorch</span>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Next.js</span>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>FastAPI</span>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Gemini 1.5 Pro</span>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div style={{
            borderTop: '1px solid var(--border)',
            paddingTop: '1.5rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
          }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              © 2026 CropSakha AI. Smart India Hackathon. All rights reserved.
            </span>
            <a href="https://github.com/sumedhgurchal/CropSakha-AI" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                <path d="M9 18c-4.51 2-5-2-7-2" />
              </svg>
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}
