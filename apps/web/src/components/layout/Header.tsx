'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { isAuthenticated, removeToken } from '@/lib/auth';
import { useRouter, usePathname } from 'next/navigation';
import { useI18n } from '@/lib/i18n';

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { t, language, setLanguage } = useI18n();

  useEffect(() => {
    setIsLoggedIn(isAuthenticated());
  }, [pathname]);

  const handleLogout = () => {
    removeToken();
    setIsLoggedIn(false);
    router.push('/');
  };

  const isActive = (path: string) => pathname === path;

  return (
    <header className="site-header">
      <div className="container header-content">
        <Link href="/" className="brand-logo" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Image src="/logo.jpg" alt="CropSakha Logo" width={32} height={32} style={{ borderRadius: '6px' }} />
          <span>CropSakha AI</span>
        </Link>
        <nav className="nav-links">
          <Link 
            href="/scan" 
            style={{ 
              color: isActive('/scan') ? 'var(--accent)' : undefined, 
              backgroundColor: isActive('/scan') ? 'var(--accent-light)' : undefined 
            }}
          >
            📸 {t('nav.scan')}
          </Link>
          <Link 
            href="/diseases"
            style={{ 
              color: isActive('/diseases') ? 'var(--accent)' : undefined, 
              backgroundColor: isActive('/diseases') ? 'var(--accent-light)' : undefined 
            }}
          >
            📚 {t('nav.library')}
          </Link>
          <Link 
            href="/map"
            style={{ 
              color: isActive('/map') ? 'var(--accent)' : undefined, 
              backgroundColor: isActive('/map') ? 'var(--accent-light)' : undefined 
            }}
          >
            🗺️ {t('nav.map')}
          </Link>
          
          {isLoggedIn ? (
            <>
              <Link 
                href="/dashboard" 
                style={{ 
                  fontWeight: 700, 
                  color: isActive('/dashboard') ? 'var(--accent)' : 'var(--text-primary)',
                  backgroundColor: isActive('/dashboard') ? 'var(--accent-light)' : undefined
                }}
              >
                📊 {t('nav.dashboard')}
              </Link>
              <Link 
                href="/history"
                style={{ 
                  color: isActive('/history') ? 'var(--accent)' : undefined, 
                  backgroundColor: isActive('/history') ? 'var(--accent-light)' : undefined 
                }}
              >
                🕒 {t('nav.history')}
              </Link>
              <button 
                onClick={handleLogout} 
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  color: 'var(--text-secondary)', 
                  fontWeight: 600, 
                  cursor: 'pointer',
                  padding: '0.4rem 0.6rem'
                }}
              >
                {t('nav.logout')}
              </button>
            </>
          ) : (
            <Link href="/login" className="btn-secondary" style={{ padding: '0.45rem 1.1rem', fontSize: '0.88rem' }}>
              {t('nav.signin')}
            </Link>
          )}

          <div style={{ display: 'flex', alignItems: 'center', marginLeft: '0.5rem', background: '#F1F5F9', padding: '0.2rem 0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, marginRight: '0.3rem', color: 'var(--text-muted)' }}>🌐</span>
            <select 
              value={language} 
              onChange={(e) => setLanguage(e.target.value as any)}
              style={{ fontSize: '0.85rem', fontWeight: 600, border: 'none', backgroundColor: 'transparent', color: 'var(--text-primary)', cursor: 'pointer', outline: 'none' }}
              aria-label="Select Language"
            >
              <option value="en">English</option>
              <option value="hi">हिन्दी (Hindi)</option>
              <option value="mr">मराठी (Marathi)</option>
            </select>
          </div>
        </nav>
      </div>
    </header>
  );
}
