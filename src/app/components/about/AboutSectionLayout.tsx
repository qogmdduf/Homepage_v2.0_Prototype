import { useEffect, useRef, useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router';
import { useLanguage } from '../../contexts/LanguageContext';
import { getAboutSections } from '../../data/aboutSectionsContent';
import { cn } from '../ui/utils';

export function AboutSectionLayout() {
  const { language } = useLanguage();
  const s = getAboutSections(language);
  const location = useLocation();
  const [visible, setVisible] = useState(true);
  const lastY = useRef(0);
  const navRef = useRef<HTMLDivElement>(null);
  const [navHeight, setNavHeight] = useState(0);

  /* 스크롤 방향 감지 */
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      if (y < 10) {
        setVisible(true);
      } else {
        setVisible(y < lastY.current);
      }
      lastY.current = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* 서브 nav 높이 측정 → 콘텐츠 패딩 계산 */
  useEffect(() => {
    if (!navRef.current) return;
    const ro = new ResizeObserver(() => {
      setNavHeight(navRef.current?.offsetHeight ?? 0);
    });
    ro.observe(navRef.current);
    setNavHeight(navRef.current.offsetHeight);
    return () => ro.disconnect();
  }, []);

  /* 페이지 타이틀 */
  useEffect(() => {
    const sections = getAboutSections(language);
    const base = language === 'ko' ? '회사소개' : 'About';
    const path = location.pathname;
    const tail = path.replace('/about', '') || '/';
    const storyHomeTitle = language === 'ko' ? '회사 스토리' : 'Our story';
    const titleMap: Record<string, string> = {
      '/': storyHomeTitle,
      '/company': `${sections.company.metaTitle}`,
      '/vision': `${sections.vision.metaTitle}`,
      '/services': `${sections.services.metaTitle}`,
      '/cases': `${sections.cases.metaTitle}`,
      '/team': `${sections.team.metaTitle}`,
      '/process': `${sections.process.metaTitle}`,
      '/insights': `${sections.insights.metaTitle}`,
      '/careers': `${sections.careers.metaTitle}`,
      '/contact': `${sections.contact.metaTitle}`,
    };
    const sub = titleMap[tail] ?? base;
    document.title = `${sub}${sections.metaTitleSuffix}`;
    return () => {
      document.title = 'WIZFACTORY';
    };
  }, [language, location.pathname]);

  return (
    <div
      className="min-h-dvh bg-[var(--apple-surface-gray)]"
      style={{ paddingTop: `calc(var(--app-header-offset) + ${navHeight}px)` }}
    >
      {/* fixed sub-nav — 글로벌 메가메뉴(z-[45])·메인 헤더(z-50) 아래 (동일 z면 DOM 뒤쪽이 위에 그려져 메뉴가 가려짐) */}
      <div
        ref={navRef}
        className={cn(
          'fixed left-0 right-0 z-30 border-b border-black/[0.06] bg-[var(--apple-surface-white)]/92 backdrop-blur-md',
          'transition-transform duration-300 ease-in-out',
          visible ? 'translate-y-0' : '-translate-y-full',
        )}
        style={{ top: 'var(--app-header-offset)' }}
      >
        <div className="wiz-section py-3">
          <nav
            className="-mx-1 flex gap-1 overflow-x-auto pb-1 text-[13px] scrollbar-thin"
            aria-label={language === 'ko' ? '회사소개 하위 메뉴' : 'About sub navigation'}
          >
            {s.nav.map(item => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/about'}
                className={({ isActive }) =>
                  cn(
                    'shrink-0 rounded-full px-3 py-1.5 font-medium transition-colors',
                    isActive
                      ? 'bg-[var(--apple-text-primary)] text-white'
                      : 'text-[var(--apple-text-secondary)] hover:bg-black/[0.04] hover:text-[var(--apple-text-primary)]',
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>

      <Outlet />
    </div>
  );
}
