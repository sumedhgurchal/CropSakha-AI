'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n';
import { getToken } from '@/lib/auth';
import GeminiAssistant from '@/components/ai/GeminiAssistant';
import { UploadCloud, CheckCircle2, Zap, BrainCircuit, VolumeX, Volume2, Scale, Sprout, Leaf, ShieldAlert, List, BarChart3, Map, Microscope, Loader2, FlaskConical } from 'lucide-react';

const API_URL = '/api';

export default function ScanClient() {
  const { language } = useI18n();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [showXAI, setShowXAI] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState('Auto-detect');
  const [activeTab, setActiveTab] = useState<'organic' | 'chemical' | 'prevention' | 'symptoms' | 'biomass'>('organic');
  const [isSpeaking, setIsSpeaking] = useState(false);


  const fileInputRef = useRef<HTMLInputElement>(null);

  // Clean up speech on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image file (JPG, PNG, WebP)');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('File too large. Max size is 10MB.');
      return;
    }

    setSelectedFile(file);
    setError(null);
    setResult(null);
    setShowXAI(false);
    stopSpeech();

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  // Removed loadDemoSample function

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const clearImage = () => {
    setSelectedFile(null);
    if (previewUrl && !previewUrl.startsWith('/demo/')) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    setResult(null);
    setError(null);
    setShowXAI(false);
    stopSpeech();
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const analyzeImage = async () => {
    if (!selectedFile) return;

    setLoading(true);
    setError(null);
    stopSpeech();

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      if (selectedCrop && selectedCrop !== 'Auto-detect') {
        formData.append('crop', selectedCrop);
      }
      formData.append('lang', language);


      const headers: Record<string, string> = {};
      const token = getToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch(`${API_URL}/scans/analyze`, {
        method: 'POST',
        headers,
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(errorData?.detail || `Server error: ${res.status}`);
      }

      const data = await res.json();
      setResult(data);
      setShowXAI(true); // Default to showing the explainable AI heatmap!
    } catch (err: any) {
      setError(err.message || 'Failed to connect to the analysis server.');
    } finally {
      setLoading(false);
    }
  };

  // Text-To-Speech functionality
  const speakDiagnosis = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window) || !result) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    let textToSpeak = result.audio_text || `${result.prediction.crop} ${result.prediction.disease}`;
    
    // Check if we have Gemini translations for the current language
    if (result.gemini_prescriptions && result.gemini_prescriptions.biological) {
         textToSpeak = `${result.display_name}. ${result.gemini_prescriptions.biological}. ${result.gemini_prescriptions.chemical}`;
    }

    const utterance = new SpeechSynthesisUtterance(textToSpeak);

    // Pick voice language
    const voiceLangMap: Record<string, string> = {
      'en': 'en-IN', 'hi': 'hi-IN', 'mr': 'mr-IN', 'bn': 'bn-IN',
      'te': 'te-IN', 'ta': 'ta-IN', 'gu': 'gu-IN', 'ur': 'ur-IN',
      'kn': 'kn-IN', 'ml': 'ml-IN', 'pa': 'pa-IN'
    };
    utterance.lang = voiceLangMap[language] || 'hi-IN';
    utterance.rate = 0.95;

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeech = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  return (
    <div className="scan-client">

      <div className="upload-container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', alignItems: 'start' }}>
        
        {/* Left Column: Upload / Leaf Preview & Grad-CAM */}
        <div className="card">
          {/* Crop Type Filter Selector */}
          <div style={{ marginBottom: '1.25rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                🌱 Monitored Crop Species:
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--accent)', fontWeight: 600 }}>
                {selectedCrop === 'Auto-detect' ? '🌐 All 38 Classes' : `Target: ${selectedCrop}`}
              </span>
            </div>
            <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
              {['Auto-detect', 'Tomato', 'Potato', 'Corn', 'Apple', 'Grape', 'Pepper', 'Orange', 'Squash'].map((crop) => (
                <button
                  key={crop}
                  type="button"
                  onClick={() => setSelectedCrop(crop)}
                  style={{
                    padding: '0.3rem 0.65rem',
                    borderRadius: 'var(--radius-full)',
                    border: '1px solid',
                    borderColor: selectedCrop === crop ? 'var(--accent)' : 'var(--border)',
                    backgroundColor: selectedCrop === crop ? 'var(--accent)' : '#F8FAFC',
                    color: selectedCrop === crop ? '#FFFFFF' : 'var(--text-secondary)',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {crop}
                </button>
              ))}
            </div>
          </div>

          {!previewUrl ? (

            <div 
              className={`dropzone ${isDragging ? 'drag-over' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <span className="dropzone-icon" style={{ display: 'inline-block', marginBottom: '0.5rem', color: 'var(--accent)' }}><UploadCloud size={48} /></span>
              <h3 style={{ marginBottom: '0.5rem', fontSize: '1.15rem' }}>
                Drag and drop your crop leaf image here
              </h3>
              <p className="text-small" style={{ marginBottom: '1.25rem' }}>
                Supports JPG, PNG, WebP up to 10MB (Clear single-leaf photo recommended)
              </p>
              <button 
                type="button" 
                className="btn-secondary" 
                style={{ padding: '0.5rem 1.2rem', fontSize: '0.88rem' }}
                onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
              >
                Browse Local Files
              </button>
              <input 
                type="file" 
                ref={fileInputRef}
                style={{ display: 'none' }}
                accept="image/jpeg, image/png, image/webp"
                onChange={(e) => {
                  if (e.target.files?.[0]) handleFile(e.target.files[0]);
                }}
              />
            </div>
          ) : (
            <div className="preview-container">
              {/* Image View Box */}
              <div style={{ position: 'relative', width: '100%', aspectRatio: '4/3', borderRadius: 'var(--radius-md)', overflow: 'hidden', marginBottom: '1.25rem', border: '1px solid var(--border)', background: '#F1F5F9' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={showXAI && result?.heatmap_base64 ? result.heatmap_base64 : previewUrl} 
                  alt="Crop Leaf Preview" 
                  style={{ objectFit: 'cover', width: '100%', height: '100%', transition: 'all 0.3s ease' }} 
                />

                {/* XAI Badge */}
                {result && showXAI && result.heatmap_base64 && (
                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    background: 'rgba(15, 23, 42, 0.85)',
                    backdropFilter: 'blur(8px)',
                    color: '#FFF',
                    padding: '0.35rem 0.75rem',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.25)'
                  }}>
                    <span style={{ color: '#EF4444' }}>●</span> Grad-CAM Attention Heatmap
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button 
                    className="btn-primary" 
                    style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }} 
                    onClick={analyzeImage}
                    disabled={loading || result !== null}
                  >
                    {loading ? <><Loader2 size={18} className="animate-spin" /> Running Vision Analysis...</> : result ? <><CheckCircle2 size={18} /> Analysis Complete</> : <><Zap size={18} /> Run Diagnosis</>}
                  </button>
                  <button 
                    className="btn-secondary" 
                    onClick={clearImage}
                    disabled={loading}
                  >
                    Clear
                  </button>
                </div>

                {/* Grad-CAM Toggle */}
                {result && result.heatmap_base64 && (
                  <div style={{ display: 'flex', gap: '0.5rem', background: '#F8FAFC', padding: '0.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                    <button
                      className="tab-btn"
                      style={{ flex: 1, textAlign: 'center', borderRadius: 'var(--radius-sm)', backgroundColor: !showXAI ? '#FFFFFF' : 'transparent', fontWeight: !showXAI ? 700 : 500, boxShadow: !showXAI ? 'var(--shadow-sm)' : 'none' }}
                      onClick={() => setShowXAI(false)}
                    >
                      Original Photo
                    </button>
                    <button
                      className="tab-btn"
                      style={{ flex: 1, textAlign: 'center', borderRadius: 'var(--radius-sm)', backgroundColor: showXAI ? 'var(--accent-light)' : 'transparent', color: showXAI ? 'var(--accent)' : 'inherit', fontWeight: showXAI ? 700 : 500, boxShadow: showXAI ? 'var(--shadow-sm)' : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}
                      onClick={() => setShowXAI(true)}
                    >
                      <BrainCircuit size={16} /> Explainable AI Heatmap
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {error && (
            <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 'var(--radius-md)', color: 'var(--confidence-low)', fontSize: '0.88rem' }}>
              <strong>Error:</strong> {error}
            </div>
          )}
        </div>

        {/* Right Column: Diagnosis & Prescriptions */}
        <div className="card" style={{ minHeight: '440px' }}>
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', minHeight: '380px', textAlign: 'center' }}>
              <div style={{ marginBottom: '1.25rem', color: 'var(--accent)' }}><Loader2 size={48} className="animate-spin" /></div>
              <h3 style={{ marginBottom: '0.5rem' }}>Analyzing Crop Health...</h3>
              <p className="text-small" style={{ maxWidth: '320px' }}>
                Executing quality assessment, lesion segmentation, and foundation model inference...
              </p>
            </div>
          ) : result ? (
            <div className="result-container">
              {/* Header with Title & Audio Button */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border)', paddingBottom: '1rem', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                  <span className="badge" style={{ backgroundColor: 'var(--accent-light)', color: 'var(--accent)', marginBottom: '0.25rem' }}>
                    {result.prediction.crop}
                  </span>
                  <h2 style={{ fontSize: '1.6rem', color: result.prediction.is_healthy ? 'var(--confidence-high)' : 'var(--text-primary)' }}>
                    {result.prediction.is_healthy ? 'Healthy Foliage' : (result.display_name || result.prediction.disease.replace(/_/g, ' '))}
                  </h2>
                  {result.regional_names?.[language] && (
                    <p style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--accent)' }}>
                      {result.regional_names[language]}
                    </p>
                  )}
                </div>

                <button 
                  onClick={speakDiagnosis} 
                  className="btn-audio"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                  title="Listen to diagnosis in selected language"
                >
                  {isSpeaking ? <VolumeX size={18} /> : <Volume2 size={18} />}
                  <span>{isSpeaking ? 'Stop Audio' : 'Listen Advice'}</span>
                </button>
              </div>

              {/* Confidence & Severity Meter */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem', background: '#F8FAFC', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                    <span className="text-small" style={{ fontWeight: 600 }}>Confidence</span>
                    <span className="text-small" style={{ fontWeight: 700, color: 'var(--accent)' }}>
                      {(result.prediction.confidence * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div style={{ height: '8px', width: '100%', backgroundColor: '#E2E8F0', borderRadius: '99px', overflow: 'hidden' }}>
                    <div style={{ 
                      height: '100%', 
                      width: `${result.prediction.confidence * 100}%`,
                      backgroundColor: result.prediction.confidence > 0.8 ? 'var(--confidence-high)' : 'var(--confidence-medium)',
                      transition: 'width 0.8s ease'
                    }} />
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                    <span className="text-small" style={{ fontWeight: 600 }}>Severity Level</span>
                    <span className="text-small" style={{ fontWeight: 700, color: result.prediction.is_healthy ? 'var(--confidence-high)' : '#DC2626' }}>
                      {result.severity_label || 'Normal'}
                    </span>
                  </div>
                  <div style={{ height: '8px', width: '100%', backgroundColor: '#E2E8F0', borderRadius: '99px', overflow: 'hidden' }}>
                    <div style={{ 
                      height: '100%', 
                      width: `${(result.severity_estimate || 0.1) * 100}%`,
                      backgroundColor: (result.severity_estimate || 0) > 0.38 ? '#DC2626' : (result.severity_estimate || 0) > 0.15 ? '#D97706' : '#10B981',
                      transition: 'width 0.8s ease'
                    }} />
                  </div>
                </div>
              </div>

              {/* CSIRO Crop Weight & Yield Quick Banner */}
              {result.biomass && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginBottom: '1.25rem', padding: '0.75rem 1rem', background: '#F0FDF4', borderRadius: 'var(--radius-md)', border: '1px solid #BBF7D0' }}>
                  <div>
                    <span style={{ fontSize: '0.72rem', color: '#166534', display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 600 }}><Scale size={12} /> Est. Fresh Biomass</span>
                    <span style={{ fontSize: '1.05rem', fontWeight: 800, color: '#15803D' }}>{result.biomass.fresh_biomass_grams} g</span>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.72rem', color: '#166534', display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 600 }}><Sprout size={12} /> Projected Yield</span>
                    <span style={{ fontSize: '1.05rem', fontWeight: 800, color: '#15803D' }}>{result.biomass.projected_yield_tonnes_per_hectare} T/Ha</span>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.72rem', color: '#166534', display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 600 }}><Leaf size={12} /> Canopy Cover</span>
                    <span style={{ fontSize: '1.05rem', fontWeight: 800, color: '#15803D' }}>{result.biomass.canopy_cover_percentage}%</span>
                  </div>
                </div>
              )}

              {/* Treatment & Prescription Tabs */}
              <div className="tab-nav">
                <button 
                  className={`tab-btn ${activeTab === 'organic' ? 'active' : ''}`}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                  onClick={() => setActiveTab('organic')}
                >
                  <Leaf size={16} /> Organic Cure
                </button>
                <button 
                  className={`tab-btn ${activeTab === 'chemical' ? 'active' : ''}`}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                  onClick={() => setActiveTab('chemical')}
                >
                  <FlaskConical size={16} /> Chemical Control
                </button>
                <button 
                  className={`tab-btn ${activeTab === 'biomass' ? 'active' : ''}`}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                  onClick={() => setActiveTab('biomass')}
                >
                  <Scale size={16} /> Weight & Yield
                </button>
                <button 
                  className={`tab-btn ${activeTab === 'prevention' ? 'active' : ''}`}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                  onClick={() => setActiveTab('prevention')}
                >
                  <ShieldAlert size={16} /> Prevention
                </button>
                <button 
                  className={`tab-btn ${activeTab === 'symptoms' ? 'active' : ''}`}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                  onClick={() => setActiveTab('symptoms')}
                >
                  <List size={16} /> Symptoms
                </button>
              </div>


              {/* Tab Content */}
              <div className="tab-content" style={{ minHeight: '120px', marginBottom: '1.5rem' }}>
                {activeTab === 'organic' && (
                  <div className="tab-pane active fade-in">
                    <h4 style={{ color: 'var(--accent)', marginBottom: '0.5rem' }}>Recommended Biological & Organic Treatments:</h4>
                    <ul className="info-list" style={{ color: 'var(--text-secondary)' }}>
                      {result.gemini_prescriptions && result.gemini_prescriptions.biological ? (
                          <li>{result.gemini_prescriptions.biological}</li>
                      ) : result.treatment_organic?.length > 0 ? (
                        result.treatment_organic.map((item: string, i: number) => <li key={i}>{item}</li>)
                      ) : <li>Apply standard botanical extracts or consult local agronomist.</li>}
                    </ul>
                  </div>
                )}

                {activeTab === 'chemical' && (
                  <div className="tab-pane active fade-in">
                    <h4 style={{ color: '#D97706', marginBottom: '0.5rem' }}>Chemical Fungicide & Pesticide Protocols:</h4>
                    <ul className="info-list" style={{ color: 'var(--text-secondary)' }}>
                      {result.gemini_prescriptions && result.gemini_prescriptions.chemical ? (
                          <li>{result.gemini_prescriptions.chemical}</li>
                      ) : result.treatment_chemical?.length > 0 ? (
                        result.treatment_chemical.map((item: string, i: number) => <li key={i}>{item}</li>)
                      ) : <li>Apply standard protective fungicide or consult local agronomist.</li>}
                    </ul>
                  </div>
                )}

                {activeTab === 'biomass' && (
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <h4 style={{ color: '#059669', margin: 0 }}>CSIRO Image2Biomass & Weight Analytics</h4>
                      <span style={{ fontSize: '0.72rem', background: '#D1FAE5', color: '#065F46', padding: '0.2rem 0.6rem', borderRadius: '4px', fontWeight: 600 }}>
                        {result.biomass?.biomass_model_benchmark || 'CSIRO Allometric Vision Engine'}
                      </span>
                    </div>

                    {result.biomass ? (
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
                        <div style={{ background: '#F8FAFC', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid #E2E8F0' }}>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Fresh Vegetative Weight</span>
                          <strong style={{ fontSize: '1.25rem', color: '#047857' }}>{result.biomass.fresh_biomass_grams} g</strong>
                          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block' }}>per plant / hill sampling</span>
                        </div>

                        <div style={{ background: '#F8FAFC', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid #E2E8F0' }}>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Green Dry Matter (GDM)</span>
                          <strong style={{ fontSize: '1.25rem', color: '#1E293B' }}>{result.biomass.green_dry_matter_grams} g</strong>
                          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block' }}>Dead Matter: {result.biomass.dry_dead_matter_grams}g ({result.biomass.moisture_content_percentage}% water)</span>
                        </div>

                        <div style={{ background: '#F8FAFC', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid #E2E8F0' }}>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Projected Harvest Yield</span>
                          <strong style={{ fontSize: '1.1rem', color: '#B45309' }}>{result.biomass.projected_yield_per_plant_kg} kg/plant</strong>
                          <span style={{ fontSize: '0.72rem', color: '#B45309', display: 'block' }}>{result.biomass.projected_yield_tonnes_per_hectare} T/Ha ({result.biomass.projected_yield_quintals_per_acre} Q/Acre)</span>
                        </div>

                        <div style={{ background: '#F8FAFC', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid #E2E8F0' }}>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Estimated Plant Canopy Height</span>
                          <strong style={{ fontSize: '1.1rem', color: '#2563EB' }}>{result.biomass.estimated_plant_height_cm} cm</strong>
                          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block' }}>Canopy Cover: {result.biomass.canopy_cover_percentage}%</span>
                        </div>

                        <div style={{ gridColumn: 'span 2', background: '#F0FDF4', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid #BBF7D0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <span style={{ fontSize: '0.75rem', color: '#166534', fontWeight: 600 }}>Chlorophyll / Nitrogen Vigor: </span>
                            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#15803D' }}>{result.biomass.nitrogen_chlorophyll_status}</span>
                          </div>
                          <span style={{ fontSize: '0.75rem', color: '#166534' }}>GLI: {result.biomass.vegetation_index_gli}</span>
                        </div>
                      </div>
                    ) : (
                      <p className="text-small">Biomass metrics calculation in progress...</p>
                    )}
                  </div>
                )}


                {activeTab === 'prevention' && (
                  <div>
                    <h4 style={{ color: '#0284C7', marginBottom: '0.5rem' }}>Preventative Agronomic Strategies:</h4>
                    {result.prevention && result.prevention.length > 0 ? (
                      <ul style={{ paddingLeft: '1.25rem', fontSize: '0.9rem', lineHeight: 1.6, color: 'var(--text-secondary)' }}>
                        {result.prevention.map((item: string, idx: number) => (
                          <li key={idx} style={{ marginBottom: '0.35rem' }}>{item}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-small">Maintain proper crop spacing, drip irrigation, and annual crop rotation.</p>
                    )}
                  </div>
                )}

                {activeTab === 'symptoms' && (
                  <div>
                    <h4 style={{ marginBottom: '0.5rem' }}>Diagnostic Cues & Field Symptoms:</h4>
                    {result.symptoms && result.symptoms.length > 0 ? (
                      <ul style={{ paddingLeft: '1.25rem', fontSize: '0.9rem', lineHeight: 1.6, color: 'var(--text-secondary)' }}>
                        {result.symptoms.map((item: string, idx: number) => (
                          <li key={idx} style={{ marginBottom: '0.35rem' }}>{item}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-small">Foliage demonstrates unblemished chlorophyll structure without chlorosis or necrosis.</p>
                    )}
                  </div>
                )}
              </div>

              {/* Differential Candidates (Top-3) */}
              {result.top_predictions && result.top_predictions.length > 1 && (
                <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem', marginTop: '1rem' }}>
                  <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                    Alternative Differential Diagnoses
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    {result.top_predictions.slice(1).map((pred: any, idx: number) => (
                      <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.45rem 0.75rem', backgroundColor: '#F8FAFC', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem' }}>
                        <span>{pred.crop} — {pred.disease.replace(/_/g, ' ')}</span>
                        <span style={{ fontWeight: 600, color: 'var(--text-muted)' }}>{(pred.confidence * 100).toFixed(1)}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick links to Dashboard and Map */}
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border)', flexWrap: 'wrap' }}>
                <Link href="/dashboard" className="btn-secondary" style={{ flex: 1, padding: '0.5rem 1rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                  <BarChart3 size={16} /> View in Dashboard
                </Link>
                <Link href="/map" className="btn-secondary" style={{ flex: 1, padding: '0.5rem 1rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                  <Map size={16} /> Check Outbreak Map
                </Link>
              </div>

              {/* Gemini Chat Assistant */}
              <GeminiAssistant context={`The user just scanned a ${result.prediction.crop} leaf. The AI detected ${result.prediction.disease} with ${Math.round(result.prediction.confidence * 100)}% confidence.`} />
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', minHeight: '380px', textAlign: 'center', color: 'var(--text-muted)' }}>
              <div style={{ marginBottom: '1rem', color: 'var(--text-muted)', opacity: 0.5 }}><Microscope size={64} /></div>
              <h3 style={{ marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Awaiting Crop Leaf</h3>
              <p className="text-small" style={{ maxWidth: '300px' }}>
                Upload or select a demo sample leaf above to view disease classification, explainable Grad-CAM heatmaps, and agronomic cures.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
