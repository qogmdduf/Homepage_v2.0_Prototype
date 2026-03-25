import { Link } from 'react-router';
import logoSvg from '../../assets/symbol.svg';
import { useLanguage } from '../contexts/LanguageContext';
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from 'motion/react';
import { useState, useEffect, useRef, useCallback } from 'react';
import { solutions } from '../data/solutions';
import { Bell, Check, X, AlertCircle, Info, Zap, Globe } from 'lucide-react';

const C_TEXT      = 'var(--apple-text-primary)';
const C_TEXT_SUB  = 'var(--apple-text-secondary)';
const C_BLUE      = 'var(--apple-blue)';
const C_BG        = 'var(--apple-bg-primary)';
/** 알림 배지 등 브랜드 강조 — 메인 레드 #B30710 */
const C_RED       = 'var(--brand-red)';

export function Header() {
  const { language, setLanguage, t } = useLanguage();
  const [isDarkBg, setIsDarkBg] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  // Bottom sheet spring animation state
  const notifY = useMotionValue(0);
  const notifBackdropOpacity = useTransform(notifY, [0, 350], [1, 0]);
  const [notifMounted, setNotifMounted] = useState(false);
  const notifIsDragging = useRef(false);
  const notifDragStartY = useRef(0);
  const notifDragStartTime = useRef(0);

  const openNotification = useCallback(() => {
    notifY.set(typeof window !== 'undefined' ? window.innerHeight : 900);
    setNotifMounted(true);
    setIsNotificationOpen(true);
    requestAnimationFrame(() => {
      animate(notifY, 0, { type: 'spring', stiffness: 320, damping: 38 });
    });
  }, [notifY]);

  const notifCloseTimerRef = useRef<ReturnType<typeof setTimeout>>();

  const closeNotification = useCallback(() => {
    animate(notifY, typeof window !== 'undefined' ? window.innerHeight : 900, {
      type: 'spring',
      stiffness: 350,
      damping: 40,
    });
    clearTimeout(notifCloseTimerRef.current);
    notifCloseTimerRef.current = setTimeout(() => {
      setIsNotificationOpen(false);
      setNotifMounted(false);
    }, 40);
  }, [notifY]);

  useEffect(() => {
    return () => clearTimeout(notifCloseTimerRef.current);
  }, []);

  // Touch drag handlers for notification sheet handle
  const handleNotifTouchStart = useCallback((e: React.TouchEvent) => {
    notifIsDragging.current = true;
    notifDragStartY.current = e.touches[0].clientY;
    notifDragStartTime.current = Date.now();
  }, []);

  // Global touchmove/touchend for notification drag
  useEffect(() => {
    if (!notifMounted) return;

    const onMove = (e: TouchEvent) => {
      if (!notifIsDragging.current) return;
      const delta = e.touches[0].clientY - notifDragStartY.current;
      if (delta > 0) notifY.set(delta);
    };

    const onEnd = () => {
      if (!notifIsDragging.current) return;
      notifIsDragging.current = false;
      const curY = notifY.get();
      const elapsed = Date.now() - notifDragStartTime.current;
      const velocity = elapsed > 0 ? (curY / elapsed) * 1000 : 0;

      if (curY > 140 || velocity > 600) {
        closeNotification();
      } else {
        animate(notifY, 0, { type: 'spring', stiffness: 500, damping: 48 });
      }
    };

    window.addEventListener('touchmove', onMove, { passive: true });
    window.addEventListener('touchend', onEnd);
    return () => {
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onEnd);
    };
  }, [notifMounted, notifY, closeNotification]);

  // Mock notification data
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: language === 'ko' ? 'WIZ-MES 업데이트 완료' : 'WIZ-MES Update Complete',
      message: language === 'ko' ? '새로운 대시보드 기능이 추가되었습니다.' : 'New dashboard features have been added.',
      time: '5m',
      isRead: false,
      type: 'update'
    },
    {
      id: 2,
      title: language === 'ko' ? '시스템 점검 안내' : 'System Maintenance Notice',
      message: language === 'ko' ? '12월 25일 02:00-04:00 정기 점검이 예정되어 있습니다.' : 'Scheduled maintenance on Dec 25, 02:00-04:00.',
      time: '2h',
      isRead: false,
      type: 'alert'
    },
    {
      id: 3,
      title: language === 'ko' ? '새로운 고객사 추가' : 'New Client Added',
      message: language === 'ko' ? 'ABC전자가 WIZ-QMS를 도입했습니다.' : 'ABC Electronics adopted WIZ-QMS.',
      time: '1d',
      isRead: true,
      type: 'info'
    }
  ]);

  const unreadCount = notifications.filter(n => !n.isRead).length;
  
  const markAsRead = (id: number) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, isRead: true } : n)
    );
  };
  
  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };
  
  const deleteNotification = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };
  
  const getNotificationIcon = (type: string) => {
    switch(type) {
      case 'update': return Zap;
      case 'alert': return AlertCircle;
      case 'info': return Info;
      default: return Bell;
    }
  };
  
  const getNotificationColor = (type: string) => {
    switch(type) {
      case 'update': return C_BLUE;
      case 'alert': return '#FF9500';
      case 'info': return '#34C759';
      default: return '#86868B';
    }
  };

  useEffect(() => {
    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
          const bgTheme = entry.target.getAttribute('data-bg-theme');
          setIsDarkBg(bgTheme === 'dark');
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, {
      rootMargin: '-52px 0px 0px 0px', // Header height offset
      threshold: [0, 0.5, 1]
    });

    // Observe all sections with data-bg-theme attribute
    const sections = document.querySelectorAll('[data-bg-theme]');
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  // Prevent scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  // Prevent body scroll when mobile notification sheet is open
  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    if (!isMobile) return;
    if (isNotificationOpen) {
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.documentElement.style.overflow = '';
    }
    return () => {
      document.documentElement.style.overflow = '';
    };
  }, [isNotificationOpen]);

  const toggleLanguage = () => {
    setLanguage(language === 'ko' ? 'en' : 'ko');
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  /** 메인 솔루션 그리드(WizNavigation)와 동일 — 카테고리별 `/solution/:id` 링크 */
  const submenuData = {
    solutions: {
      title: language === 'ko' ? '솔루션' : 'Solutions',
      categories: [
        {
          title: t('navigation.platform'),
          items: solutions.filter(s => s.category === 'platform').map(s => ({
            name: language === 'ko' ? s.nameKo : s.nameEn,
            description: language === 'ko' ? s.subtitle : s.subtitleEn,
            link: `/solution/${s.id}`
          }))
        },
        {
          title: t('navigation.production'),
          items: solutions.filter(s => s.category === 'production').map(s => ({
            name: language === 'ko' ? s.nameKo : s.nameEn,
            description: language === 'ko' ? s.subtitle : s.subtitleEn,
            link: `/solution/${s.id}`
          }))
        },
        {
          title: t('navigation.quality'),
          items: solutions.filter(s => s.category === 'quality').map(s => ({
            name: language === 'ko' ? s.nameKo : s.nameEn,
            description: language === 'ko' ? s.subtitle : s.subtitleEn,
            link: `/solution/${s.id}`
          }))
        },
        {
          title: t('navigation.facility'),
          items: solutions.filter(s => s.category === 'facility').map(s => ({
            name: language === 'ko' ? s.nameKo : s.nameEn,
            description: language === 'ko' ? s.subtitle : s.subtitleEn,
            link: `/solution/${s.id}`
          }))
        },
        {
          title: t('navigation.project'),
          items: solutions.filter(s => s.category === 'project').map(s => ({
            name: language === 'ko' ? s.nameKo : s.nameEn,
            description: language === 'ko' ? s.subtitle : s.subtitleEn,
            link: `/solution/${s.id}`
          }))
        }
      ]
    },
    about: {
      title: language === 'ko' ? '회사소개' : 'About',
      categories: [
        {
          title: language === 'ko' ? '개요 · 철학' : 'Company & philosophy',
          items: [
            { name: language === 'ko' ? '스토리' : 'Story', link: '/about' },
            { name: language === 'ko' ? '회사 개요' : 'Company', link: '/about/company' },
            { name: language === 'ko' ? '비전 · 미션 · 가치' : 'Vision & values', link: '/about/vision' },
          ],
        },
        {
          title: language === 'ko' ? '사업 · 신뢰' : 'Services & proof',
          items: [
            { name: language === 'ko' ? '서비스 · 솔루션' : 'Services', link: '/about/services' },
            { name: language === 'ko' ? '사례' : 'Case studies', link: '/about/cases' },
          ],
        },
        {
          title: language === 'ko' ? '함께 일하기' : 'Work with us',
          items: [
            { name: language === 'ko' ? '팀 · 문화' : 'Team & culture', link: '/about/team' },
            { name: language === 'ko' ? '프로세스' : 'Process', link: '/about/process' },
            { name: language === 'ko' ? '인사이트' : 'Insights', link: '/about/insights' },
            { name: language === 'ko' ? '채용' : 'Careers', link: '/about/careers' },
            { name: language === 'ko' ? '문의' : 'Contact', link: '/about/contact' },
          ],
        },
      ],
    },
  };

  return (
    <>
      <header 
        className="fixed top-0 left-0 right-0 z-50 transition-colors duration-500"
        style={{ 
          backgroundColor: isDarkBg ? 'rgba(255, 255, 255, 0.8)' : 'rgba(245, 245, 247, 0.8)',
          backdropFilter: 'saturate(180%) blur(20px)',
          WebkitBackdropFilter: 'saturate(180%) blur(20px)',
          borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
          paddingTop: 'env(safe-area-inset-top)'
        }}
        onClick={(e) => {
          // 알림 시트가 열려있을 때 헤더 클릭 시 닫기 (벨 버튼 클릭은 자체 토글로 처리)
          if (isNotificationOpen && !(e.target as HTMLElement).closest('[data-notif-bell]')) {
            if (window.innerWidth < 768) closeNotification();
            else setIsNotificationOpen(false);
          }
        }}
      >
        <div className="w-full">
          <div className="wiz-section h-[52px]">
            <div className="flex items-center justify-between h-full">
              {/* Logo - Left */}
              <Link to="/" className="flex items-center gap-2.5 group flex-shrink-0 py-2 pr-2" aria-label="WIZFACTORY 홈으로">
                <img src={logoSvg} alt="WIZFACTORY" className="h-7 md:h-8 w-auto transition-transform group-hover:scale-105" />
              </Link>
              
              {/* Navigation Menu - Center (Desktop only) */}
              <nav className="hidden md:flex items-center gap-5 absolute left-1/2 transform -translate-x-1/2" aria-label="Main navigation">
                <div 
                  className="relative"
                  onMouseEnter={() => setActiveSubmenu('about')}
                  onMouseLeave={() => setActiveSubmenu(null)}
                >
                  <Link 
                    to="/about" 
                    className="text-xs font-medium tracking-wide transition-colors whitespace-nowrap block py-3" 
                    style={{ color: activeSubmenu === 'about' ? C_BLUE : '#1D1D1F' }}
                  >
                    {t('header.about')}
                  </Link>
                </div>

                <div 
                  className="relative"
                  onMouseEnter={() => setActiveSubmenu('solutions')}
                  onMouseLeave={() => setActiveSubmenu(null)}
                >
                  <Link 
                    to="/#solutions" 
                    className="text-xs font-medium tracking-wide transition-colors whitespace-nowrap block py-3" 
                    style={{ color: activeSubmenu === 'solutions' ? C_BLUE : '#1D1D1F' }}
                  >
                    {t('header.solutions')}
                  </Link>
                </div>

                <a href="#contact" className="text-xs font-medium tracking-wide transition-colors whitespace-nowrap" style={{ color: C_TEXT }} onMouseEnter={(e) => e.currentTarget.style.color = C_BLUE} onMouseLeave={(e) => e.currentTarget.style.color = C_TEXT}
                  onClick={(e) => { e.preventDefault(); window.dispatchEvent(new CustomEvent('openContactModal')); }}
                >
                  {t('header.contact')}
                </a>

                <Link
                  to="/#news"
                  className="text-xs font-medium tracking-wide transition-colors whitespace-nowrap py-3"
                  style={{ color: C_TEXT }}
                  onMouseEnter={e => { e.currentTarget.style.color = C_BLUE; }}
                  onMouseLeave={e => { e.currentTarget.style.color = C_TEXT; }}
                >
                  {t('header.news')}
                </Link>
              </nav>

              {/* Utility Buttons - Right */}
              <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
                {/* Language Toggle Button - Clean Icon Style (Mobile & Desktop) */}
                <button
                  onClick={toggleLanguage}
                  className="flex relative items-center gap-2 px-3 py-2 rounded-lg transition-all hover:bg-gray-100"
                  style={{ color: C_TEXT }}
                  title={language === 'ko' ? 'Switch to English' : '한국어로 변경'}
                >
                  <Globe size={18} strokeWidth={2} />
                  <span className="text-xs font-medium">{language === 'ko' ? 'KR' : 'EN'}</span>
                </button>

                {/* Notification Bell - Desktop & Mobile */}
                <button
                  className="relative p-2 rounded-lg transition-all hover:bg-gray-100"
                  style={{ color: C_TEXT }}
                  title={language === 'ko' ? '알림' : 'Notifications'}
                  aria-label={language === 'ko' ? '알림' : 'Notifications'}
                  aria-expanded={isNotificationOpen}
                  aria-haspopup="true"
                  onClick={() => {
                    if (window.innerWidth < 768) {
                      if (isNotificationOpen) closeNotification();
                      else openNotification();
                    } else {
                      setIsNotificationOpen(!isNotificationOpen);
                    }
                  }}
                  data-notif-bell
                >
                  <Bell size={18} strokeWidth={2} />
                  {unreadCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
                      style={{ backgroundColor: C_RED }}
                    >
                      <span 
                        className="absolute inset-0 rounded-full animate-ping"
                        style={{ backgroundColor: C_RED, opacity: 0.75 }}
                      />
                    </motion.span>
                  )}
                </button>

                {/* Mobile: Hamburger Menu Button */}
                <button 
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="md:hidden flex flex-col items-center justify-center gap-1 p-2.5 rounded-lg hover:bg-gray-100 transition-colors"
                  aria-label={language === 'ko' ? '메뉴 열기' : 'Open menu'}
                  aria-expanded={isMenuOpen}
                >
                  <span className="w-4 h-0.5 bg-current" style={{ color: C_TEXT }}></span>
                  <span className="w-4 h-0.5 bg-current" style={{ color: C_TEXT }}></span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Desktop Submenu — Apple-style frosted panel (global nav mega-menu) */}
      <AnimatePresence>
        {activeSubmenu && activeSubmenu in submenuData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18, ease: [0.25, 0.1, 0.25, 1] }}
            className="fixed left-0 right-0 z-[45] hidden md:block"
            style={{
              top: 'var(--app-header-offset)',
              backgroundColor: 'rgba(255, 255, 255, 0.76)',
              backdropFilter: 'saturate(180%) blur(24px)',
              WebkitBackdropFilter: 'saturate(180%) blur(24px)',
              borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
              boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.65), 0 12px 40px rgba(0, 0, 0, 0.06), 0 1px 0 rgba(0, 0, 0, 0.04)',
            }}
            onMouseEnter={() => setActiveSubmenu(activeSubmenu)}
            onMouseLeave={() => setActiveSubmenu(null)}
          >
            <motion.div
              initial={{ y: -6, opacity: 0.98 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -4, opacity: 0 }}
              transition={{ duration: 0.28, ease: [0.23, 1, 0.32, 1] }}
              className="wiz-section py-10 md:py-11"
            >
              <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 sm:gap-x-10 lg:grid-cols-3 lg:gap-x-12 xl:grid-cols-5 xl:gap-x-10">
                {submenuData[activeSubmenu as keyof typeof submenuData].categories.map((category, catIdx) => (
                  <div key={catIdx}>
                    <h3
                      className="mb-3 text-[11px] font-semibold uppercase tracking-[0.08em]"
                      style={{ color: '#86868B' }}
                    >
                      {category.title}
                    </h3>
                    <div className="space-y-2.5">
                      {category.items.map((item, itemIdx) => (
                        <Link
                          key={itemIdx}
                          to={item.link}
                          className="group block rounded-md py-0.5 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-[var(--apple-blue)] focus-visible:ring-offset-2"
                          onClick={() => setActiveSubmenu(null)}
                        >
                          <div className="text-[14px] font-semibold leading-snug tracking-tight text-[#1d1d1f] transition-colors group-hover:text-[#06c]">
                            {item.name}
                          </div>
                          {'description' in item && item.description && (
                            <div
                              className="mt-0.5 text-[11px] leading-relaxed tracking-tight"
                              style={{ color: '#86868B' }}
                            >
                              {item.description}
                            </div>
                          )}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Full-Screen Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[60] md:hidden"
            style={{ backgroundColor: C_BG }}
          >
            {/* Menu Header */}
            <div className="fixed top-0 left-0 right-0 z-[70]" style={{ 
              backgroundColor: 'rgba(245, 245, 247, 0.8)',
              backdropFilter: 'saturate(180%) blur(20px)',
              WebkitBackdropFilter: 'saturate(180%) blur(20px)',
              borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
              paddingTop: 'env(safe-area-inset-top)'
            }}>
              <div className="px-4 h-[52px] flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2.5" onClick={closeMenu} aria-label="WIZFACTORY 홈으로">
                  <img src={logoSvg} alt="WIZFACTORY" className="h-7 w-auto" />
                </Link>
                <button 
                  onClick={closeMenu}
                  type="button"
                  className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg p-0 hover:bg-gray-100 transition-colors"
                  aria-label="닫기"
                >
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="shrink-0" aria-hidden>
                    <path d="M1 1L17 17M17 1L1 17" stroke="#1D1D1F" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>
            </div>

            {/* Menu Content */}
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="pt-[80px] px-6 pb-8 overflow-y-auto h-full"
            >
              <nav className="space-y-1" aria-label="Mobile navigation">
                <Link 
                  to="/about" 
                  onClick={closeMenu}
                  className="block py-3 text-2xl font-semibold transition-colors"
                  style={{ color: C_TEXT }}
                >
                  {t('header.about')}
                </Link>
                <div className="py-3">
                  <Link 
                    to="/#solutions" 
                    onClick={closeMenu}
                    className="block text-2xl font-semibold transition-colors"
                    style={{ color: C_TEXT }}
                  >
                    {t('header.solutions')}
                  </Link>
                  <div className="mt-4 space-y-5 pl-1">
                    {submenuData.solutions.categories.map((category, catIdx) => (
                      <div key={catIdx}>
                        <p className="text-[11px] font-semibold uppercase tracking-wider mb-2" style={{ color: C_TEXT_SUB }}>
                          {category.title}
                        </p>
                        <div className="space-y-1.5">
                          {category.items.map((item, itemIdx) => (
                            <Link
                              key={itemIdx}
                              to={item.link}
                              className="block py-1 text-[15px] font-medium leading-snug transition-colors"
                              style={{ color: C_TEXT }}
                              onClick={closeMenu}
                            >
                              {item.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <a 
                  href="#contact" 
                  onClick={(e) => { e.preventDefault(); closeMenu(); window.dispatchEvent(new CustomEvent('openContactModal')); }}
                  className="block py-3 text-2xl font-semibold transition-colors"
                  style={{ color: C_TEXT }}
                >
                  {t('header.contact')}
                </a>
                <Link 
                  to="/#news" 
                  onClick={closeMenu}
                  className="block py-3 text-2xl font-semibold transition-colors"
                  style={{ color: C_TEXT }}
                >
                  {t('header.news')}
                </Link>
              </nav>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notification Dropdown */}
      <AnimatePresence>
        {isNotificationOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[45]"
              style={{ backgroundColor: 'rgba(0, 0, 0, 0.1)' }}
              onClick={() => setIsNotificationOpen(false)}
            />
            
            {/* Notification Panel - Desktop: dropdown / Mobile: full-screen bottom sheet */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
              className="fixed top-16 right-4 md:right-8 z-50 hidden md:block w-[420px] rounded-2xl shadow-2xl overflow-hidden"
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid rgba(0, 0, 0, 0.08)',
                maxHeight: '80vh'
              }}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid #E5E5EA' }}>
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-semibold" style={{ color: C_TEXT }}>
                    {language === 'ko' ? '알림' : 'Notifications'}
                  </h3>
                  {unreadCount > 0 && (
                    <span 
                      className="px-2 py-0.5 rounded-full text-xs font-semibold"
                      style={{ backgroundColor: C_RED, color: '#FFFFFF' }}
                    >
                      {unreadCount}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <button
                      className="text-xs font-medium transition-colors px-3 py-1.5 rounded-lg hover:bg-gray-100"
                      style={{ color: C_BLUE }}
                      onClick={markAllAsRead}
                    >
                      {language === 'ko' ? '모두 읽음' : 'Mark all read'}
                    </button>
                  )}
                  <button
                    className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                    onClick={() => setIsNotificationOpen(false)}
                  >
                    <X size={16} style={{ color: C_TEXT_SUB }} />
                  </button>
                </div>
              </div>

              {/* Notifications List */}
              <div className="overflow-y-auto" style={{ maxHeight: 'calc(80vh - 72px)' }}>
                {notifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 px-6">
                    <div 
                      className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
                      style={{ backgroundColor: C_BG }}
                    >
                      <Bell size={28} style={{ color: C_TEXT_SUB }} />
                    </div>
                    <p className="text-sm font-medium" style={{ color: C_TEXT_SUB }}>
                      {language === 'ko' ? '새로운 알림이 없습니다' : 'No new notifications'}
                    </p>
                  </div>
                ) : (
                  <div>
                    {notifications.map((notification, idx) => {
                      const IconComponent = getNotificationIcon(notification.type);
                      const iconColor = getNotificationColor(notification.type);
                      
                      return (
                        <motion.div
                          key={notification.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: idx * 0.05 }}
                          className="relative group"
                          style={{
                            backgroundColor: notification.isRead ? 'transparent' : 'rgba(0, 113, 227, 0.03)',
                            borderBottom: idx < notifications.length - 1 ? '1px solid #E5E5EA' : 'none'
                          }}
                        >
                          <div className="flex items-start gap-3 px-5 py-4 hover:bg-gray-50 transition-colors cursor-pointer">
                            <div 
                              className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                              style={{ 
                                backgroundColor: `${iconColor}15`,
                                border: `1px solid ${iconColor}30`
                              }}
                            >
                              <IconComponent size={18} style={{ color: iconColor }} strokeWidth={2} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2 mb-1">
                                <h4 className="text-sm font-semibold line-clamp-1" style={{ color: C_TEXT }}>
                                  {notification.title}
                                </h4>
                                {!notification.isRead && (
                                  <div 
                                    className="w-2 h-2 rounded-full flex-shrink-0 mt-1.5"
                                    style={{ backgroundColor: C_BLUE }}
                                  />
                                )}
                              </div>
                              <p className="text-xs mb-2 line-clamp-2" style={{ color: C_TEXT_SUB }}>
                                {notification.message}
                              </p>
                              <span className="text-xs font-medium" style={{ color: C_TEXT_SUB }}>
                                {notification.time}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              {!notification.isRead && (
                                <button
                                  className="p-1.5 rounded-lg hover:bg-blue-50 transition-colors"
                                  onClick={(e) => { e.stopPropagation(); markAsRead(notification.id); }}
                                  title={language === 'ko' ? '읽음 표시' : 'Mark as read'}
                                >
                                  <Check size={14} style={{ color: C_BLUE }} strokeWidth={2.5} />
                                </button>
                              )}
                              <button
                                className="p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                                onClick={(e) => { e.stopPropagation(); deleteNotification(notification.id); }}
                                title={language === 'ko' ? '삭제' : 'Delete'}
                              >
                                <X size={14} style={{ color: '#FF3B30' }} strokeWidth={2.5} />
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Footer */}
              {notifications.length > 0 && (
                <div 
                  className="px-5 py-3 text-center"
                  style={{ borderTop: '1px solid #E5E5EA', backgroundColor: '#FAFAFA' }}
                >
                  <button 
                    className="text-xs font-medium transition-colors hover:underline"
                    style={{ color: C_BLUE }}
                  >
                    {language === 'ko' ? '모든 알림 보기' : 'View all notifications'}
                  </button>
                </div>
              )}
            </motion.div>

            {/* Mobile: Full-screen bottom sheet — spring entry + drag to dismiss */}
            {notifMounted && (
              <>
                {/* Backdrop */}
                <motion.div
                  style={{ opacity: notifBackdropOpacity, backgroundColor: 'rgba(0,0,0,0.3)' } as React.CSSProperties}
                  className="fixed inset-0 z-[44] md:hidden"
                  onClick={closeNotification}
                />

                <motion.div
                  style={{
                    y: notifY,
                    backgroundColor: '#FFFFFF',
                    borderRadius: '24px 24px 0 0',
                  } as React.CSSProperties}
                  className="fixed inset-x-0 bottom-0 z-50 md:hidden overflow-hidden h-dvh-95"
                >
                  {/* Drag handle */}
                  <div
                    className="flex justify-center pt-3 pb-1 select-none touch-none cursor-grab active:cursor-grabbing"
                    onTouchStart={handleNotifTouchStart}
                    aria-hidden
                  >
                    <div className="w-10 h-1 rounded-full" style={{ backgroundColor: '#D1D1D6' }} />
                  </div>

                  {/* Header */}
                  <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid #E5E5EA' }}>
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold" style={{ color: C_TEXT }}>
                        {language === 'ko' ? '알림' : 'Notifications'}
                      </h3>
                      {unreadCount > 0 && (
                        <span 
                          className="px-2 py-0.5 rounded-full text-xs font-semibold"
                          style={{ backgroundColor: C_RED, color: '#FFFFFF' }}
                        >
                          {unreadCount}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {unreadCount > 0 && (
                        <button
                          className="text-xs font-medium transition-colors px-3 py-1.5 rounded-lg hover:bg-gray-100"
                          style={{ color: C_BLUE }}
                          onClick={markAllAsRead}
                        >
                          {language === 'ko' ? '모두 읽음' : 'Mark all read'}
                        </button>
                      )}
                      <button
                        className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                        onClick={closeNotification}
                      >
                        <X size={16} style={{ color: C_TEXT_SUB }} />
                      </button>
                    </div>
                  </div>

                  {/* Notifications List */}
                  <div className="overflow-y-auto scrollbar-hide h-dvh-95-minus-130">
                    {notifications.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-20 px-6">
                        <div 
                          className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
                          style={{ backgroundColor: C_BG }}
                        >
                          <Bell size={28} style={{ color: C_TEXT_SUB }} />
                        </div>
                        <p className="text-sm font-medium" style={{ color: C_TEXT_SUB }}>
                          {language === 'ko' ? '새로운 알림이 없습니다' : 'No new notifications'}
                        </p>
                      </div>
                    ) : (
                      <div>
                        {notifications.map((notification, idx) => {
                          const IconComponent = getNotificationIcon(notification.type);
                          const iconColor = getNotificationColor(notification.type);
                          
                          return (
                            <motion.div
                              key={notification.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.3, delay: idx * 0.05 }}
                              className="relative group"
                              style={{
                                backgroundColor: notification.isRead ? 'transparent' : 'rgba(0, 113, 227, 0.03)',
                                borderBottom: idx < notifications.length - 1 ? '1px solid #E5E5EA' : 'none'
                              }}
                            >
                              <div className="flex items-start gap-3 px-5 py-4 active:bg-gray-50 transition-colors cursor-pointer">
                                <div 
                                  className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                                  style={{ 
                                    backgroundColor: `${iconColor}15`,
                                    border: `1px solid ${iconColor}30`
                                  }}
                                >
                                  <IconComponent size={18} style={{ color: iconColor }} strokeWidth={2} />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-start justify-between gap-2 mb-1">
                                    <h4 className="text-sm font-semibold" style={{ color: C_TEXT }}>
                                      {notification.title}
                                    </h4>
                                    {!notification.isRead && (
                                      <div 
                                        className="w-2 h-2 rounded-full flex-shrink-0 mt-1.5"
                                        style={{ backgroundColor: C_BLUE }}
                                      />
                                    )}
                                  </div>
                                  <p className="text-xs mb-2" style={{ color: C_TEXT_SUB }}>
                                    {notification.message}
                                  </p>
                                  <span className="text-xs font-medium" style={{ color: C_TEXT_SUB }}>
                                    {notification.time}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1">
                                  {!notification.isRead && (
                                    <button
                                      className="p-2 rounded-lg bg-blue-50 transition-colors"
                                      onClick={(e) => { e.stopPropagation(); markAsRead(notification.id); }}
                                    >
                                      <Check size={14} style={{ color: C_BLUE }} strokeWidth={2.5} />
                                    </button>
                                  )}
                                  <button
                                    className="p-2 rounded-lg bg-red-50 transition-colors"
                                    onClick={(e) => { e.stopPropagation(); deleteNotification(notification.id); }}
                                  >
                                    <X size={14} style={{ color: '#FF3B30' }} strokeWidth={2.5} />
                                  </button>
                                </div>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  {notifications.length > 0 && (
                    <div 
                      className="px-5 py-3 text-center"
                      style={{ borderTop: '1px solid #E5E5EA', backgroundColor: '#FAFAFA' }}
                    >
                      <button 
                        className="text-xs font-medium transition-colors hover:underline"
                        style={{ color: C_BLUE }}
                      >
                        {language === 'ko' ? '모든 알림 보기' : 'View all notifications'}
                      </button>
                    </div>
                  )}
                </motion.div>
              </>
            )}
          </>
        )}
      </AnimatePresence>
    </>
  );
}