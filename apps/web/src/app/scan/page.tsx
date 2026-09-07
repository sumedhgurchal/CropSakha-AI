import Header from '@/components/layout/Header';
import ScanClient from '@/components/scan/ScanClient';

export const metadata = {
  title: 'Scan Crop | CropSakha AI',
  description: 'Upload a crop leaf image for AI disease detection with Grad-CAM explainability.',
};

export default function ScanPage() {
  return (
    <>
      <Header />
      <div className="container" style={{ padding: '2.5rem 1.5rem 4rem' }}>
        <div style={{ marginBottom: '2.5rem' }}>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            fontSize: '0.75rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: 'var(--accent)',
            background: 'var(--accent-light)',
            padding: '0.25rem 0.75rem',
            borderRadius: 'var(--radius-full)',
            border: '1px solid var(--accent-border)',
            marginBottom: '0.75rem',
          }}>
            ● Live Diagnostic Engine
          </span>
          <h1 style={{ marginBottom: '0.5rem' }}>Leaf Diagnosis</h1>
          <p style={{ maxWidth: '560px' }}>Upload a clear photo of the affected crop leaf. Our AI runs quality assessment, lesion segmentation, and foundation model inference in under 200ms.</p>
        </div>
        <ScanClient />
      </div>
    </>
  );
}
