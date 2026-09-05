import Header from '@/components/layout/Header';
import ScanClient from '@/components/scan/ScanClient';

export const metadata = {
  title: 'Scan Crop | CropSakha AI',
  description: 'Upload a crop leaf image for AI disease detection.',
};

export default function ScanPage() {
  return (
    <>
      <Header />
      <div className="container" style={{ padding: '2rem 1.5rem' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1>Diagnosis</h1>
          <p>Upload a clear photo of the affected crop leaf for analysis.</p>
        </div>
        <ScanClient />
      </div>
    </>
  );
}
