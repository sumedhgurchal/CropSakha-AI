'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { isAuthenticated, removeToken } from '@/lib/auth';
import { useRouter, usePathname } from 'next/navigation';
import { useI18n, LANGUAGE_NAMES, Language } from '@/lib/i18n';
import { Globe } from 'lucide-react';

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
        <Link href="/" className="brand-logo">
          <Image src="/logo.jpg" alt="CropSakha Logo" width={30} height={30} style={{ borderRadius: '8px' }} />
          <span>CropSakha</span>
          <span style={{
            fontSize: '0.6rem',
            fontWeight: 700,
            textTransform: 'uppercase' as const,
            letterSpacing: '0.06em',
            background: 'var(--accent-light)',
            color: 'var(--accent)',
            padding: '0.15rem 0.45rem',
            borderRadius: 'var(--radius-full)',
            border: '1px solid var(--accent-border)',
          }}>AI</span>
        </Link>

        <nav className="nav-links">
          <Link
            href="/scan"
            style={{
              color: isActive('/scan') ? 'var(--accent)' : undefined,
              fontWeight: isActive('/scan') ? 600 : undefined,
            }}
          >
            {t('nav.scan')}
          </Link>
          <Link
            href="/diseases"
            style={{
              color: isActive('/diseases') ? 'var(--accent)' : undefined,
              fontWeight: isActive('/diseases') ? 600 : undefined,
            }}
          >
            {t('nav.library')}
          </Link>
          <Link
            href="/map"
            style={{
              color: isActive('/map') ? 'var(--accent)' : undefined,
              fontWeight: isActive('/map') ? 600 : undefined,
            }}
          >
            {t('nav.map')}
          </Link>

          {isLoggedIn ? (
            <>
              <Link
                href="/dashboard"
                style={{
                  color: isActive('/dashboard') ? 'var(--accent)' : undefined,
                  fontWeight: isActive('/dashboard') ? 600 : undefined,
                }}
              >
                {t('nav.dashboard')}
              </Link>
              <Link
                href="/history"
                style={{
                  color: isActive('/history') ? 'var(--accent)' : undefined,
                  fontWeight: isActive('/history') ? 600 : undefined,
                }}
              >
                {t('nav.history')}
              </Link>
              <button
                onClick={handleLogout}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  fontWeight: 500,
                  cursor: 'pointer',
                  padding: '0.45rem 0.85rem',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.9rem',
                  transition: 'all 0.2s ease',
                }}
              >
                {t('nav.logout')}
              </button>
            </>
          ) : (
            <Link href="/login" className="btn-dark" style={{ padding: '0.5rem 1.25rem', fontSize: '0.88rem' }}>
              {t('nav.signin')}
            </Link>
          )}

          {/* Language Selector */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            marginLeft: '0.35rem',
            background: 'var(--bg-white)',
            padding: '0.25rem 0.55rem',
            borderRadius: 'var(--radius-full)',
            border: '1px solid var(--border)',
          }}>
            <Globe size={13} color="var(--text-muted)" style={{ marginRight: '0.3rem', flexShrink: 0 }} />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              style={{
                fontSize: '0.82rem',
                fontWeight: 600,
                border: 'none',
                backgroundColor: 'transparent',
                color: 'var(--text-primary)',
                cursor: 'pointer',
                outline: 'none',
                maxWidth: '90px',
              }}
              aria-label="Select Language"
            >
              {Object.entries(LANGUAGE_NAMES).map(([code, name]) => (
                <option key={code} value={code}>{name}</option>
              ))}
            </select>
          </div>
        </nav>
      </div>
    </header>
  );
}
