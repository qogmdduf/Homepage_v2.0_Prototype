import logoSvg from '../../assets/symbol.svg';
import { useLanguage } from '../contexts/LanguageContext';

export function WizFooter() {
  const { t, language } = useLanguage();

  const columns = [
    {
      heading: language === 'ko' ? '솔루션' : 'Solutions',
      links: [
        { label: 'WIZ-MES', href: '/solution/wiz-mes' },
        { label: 'WIZ-QMS', href: '/solution/wiz-qms' },
        { label: 'WIZ-EAM', href: '/solution/wiz-eam' },
        { label: 'WIZ-PMS', href: '/solution/wiz-pms' },
        { label: 'WIZ-FLOW', href: '/solution/wiz-flow' },
      ],
    },
    {
      heading: language === 'ko' ? '플랫폼' : 'Platform',
      links: [
        { label: language === 'ko' ? '주요 기능' : 'Features', href: '/#solutions' },
        { label: language === 'ko' ? '시스템 통합' : 'Integration', href: '/#architecture' },
        { label: language === 'ko' ? '산업 분야' : 'Industries', href: '/#industries' },
        { label: language === 'ko' ? '기술 지원' : 'Support', href: '#contact' },
      ],
    },
    {
      heading: language === 'ko' ? '리소스' : 'Resources',
      links: [
        { label: language === 'ko' ? '아키텍처' : 'Architecture', href: '/#architecture' },
        { label: language === 'ko' ? '고객 사례' : 'Case Studies', href: '/about/cases' },
        { label: language === 'ko' ? '문의하기' : 'Contact', href: '#contact' },
      ],
    },
    {
      heading: language === 'ko' ? '회사' : 'Company',
      links: [
        { label: language === 'ko' ? '회사 소개' : 'About', href: '/about' },
        { label: language === 'ko' ? '회사 개요' : 'Company', href: '/about/company' },
        { label: language === 'ko' ? '서비스' : 'Services', href: '/about/services' },
        { label: language === 'ko' ? '문의' : 'Contact', href: '/about/contact' },
        { label: language === 'ko' ? '문의하기' : 'Quick inquiry', href: '#contact' },
      ],
    },
    {
      heading: language === 'ko' ? '법적 고지' : 'Legal',
      links: [
        { label: language === 'ko' ? '개인정보처리방침' : 'Privacy Policy', href: '#' },
        { label: language === 'ko' ? '이용약관' : 'Terms of Use', href: '#' },
      ],
    },
  ];

  return (
    <footer
      style={{
        backgroundColor: 'var(--apple-bg-primary)',
        borderTop: '1px solid rgba(0, 0, 0, 0.07)',
      }}
    >
      <div className="wiz-section py-14">
        {/* Column grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {columns.map((col) => (
            <div key={col.heading}>
              <h4
                className="text-xs font-semibold mb-4 uppercase tracking-widest"
                style={{ color: 'var(--apple-text-primary)' }}
              >
                {col.heading}
              </h4>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm transition-colors duration-150 hover:text-[var(--apple-text-primary)]"
                      style={{ color: 'var(--apple-text-secondary)' }}
                      onClick={link.href === '#contact' ? (e) => { e.preventDefault(); window.dispatchEvent(new CustomEvent('openContactModal')); } : undefined}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div style={{ height: '1px', backgroundColor: 'rgba(0,0,0,0.07)' }} className="mb-8" />

        {/* Bottom row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo + copyright */}
          <div className="flex items-center gap-3">
            <img src={logoSvg} alt="WIZFACTORY" className="h-5 md:h-6 w-auto opacity-80" />
            <span className="text-xs" style={{ color: 'var(--apple-text-secondary)' }}>
              Copyright © 2026 WIZFACTORY Co., Ltd.{' '}
              {language === 'ko' ? '모든 권리 보유.' : 'All rights reserved.'}
            </span>
          </div>

          {/* Country / region */}
          <span className="text-xs" style={{ color: 'var(--apple-text-secondary)' }}>
            {language === 'ko' ? '대한민국' : 'South Korea'}
          </span>
        </div>
      </div>
    </footer>
  );
}