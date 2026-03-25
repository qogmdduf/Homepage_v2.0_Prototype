import { createContext, useContext, useState, useCallback, useMemo, ReactNode } from 'react';

export type Language = 'ko' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

function applyLangToDocument(lang: Language) {
  const html = document.documentElement;
  if (lang === 'ko') {
    html.setAttribute('lang', 'ko');
    html.setAttribute('translate', 'no');
  } else {
    html.setAttribute('lang', 'en');
    html.removeAttribute('translate');
  }
}

function getInitialLanguage(): Language {
  if (typeof window === 'undefined') return 'ko';
  const saved = localStorage.getItem('wiz-lang');
  if (saved === 'ko' || saved === 'en') return saved;
  return 'ko';
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(getInitialLanguage);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    applyLangToDocument(lang);
    localStorage.setItem('wiz-lang', lang);
  }, []);

  const t = useCallback((key: string): string => {
    const keys = key.split('.');
    let value: any = translations[language];
    
    for (const k of keys) {
      value = value?.[k];
    }
    
    return value || key;
  }, [language]);

  const contextValue = useMemo(() => ({ language, setLanguage, t }), [language, setLanguage, t]);

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}

const translations = {
  ko: {
    header: {
      solutions: '솔루션 소개',
      about: '회사소개',
      news: 'NEWS',
      contact: '문의하기'
    },
    hero: {
      title1: '스마트 팩토리',
      title2: '새로운 시작',
      subtitle: '생산, 품질, 설비 운영을 위한 통합 플랫폼',
      cta: '솔루션 살펴보기'
    },
    architecture: {
      title: '솔루션 아키텍처',
      subtitle: '위즈팩토리 플랫폼 기반으로 구축',
      production: '생산관리',
      quality: '품질관리',
      facility: '설비관리'
    },
    navigation: {
      all: '전체',
      platform: '플랫폼',
      production: '생산관리',
      quality: '품질관리',
      facility: '설비관리',
      project: '운영 관리'
    },
    solutions: {
      title: '솔루션',
      subtitle: '스마트 제조를 위한 완벽한 솔루션 패키지',
      keyFeatures: '주요 기능',
      learnMore: '더 알아보기',
      downloadBrochure: '소개서 다운로드',
      viewDemo: '데모 보기',
      downloadStarted: '브로슈어 다운로드가 시작되었습니다'
    },
    industries: {
      title: '산업군',
      subtitle: '다양한 산업 분야에서 제조 혁신을 주도합니다',
      electronics: '전자제품',
      electronicsDesc: '전자제품 제조',
      battery: '배터리',
      batteryDesc: '배터리 생산',
      automotive: '자동차',
      automotiveDesc: '자동차 제조',
      manufacturing: '일반 제조',
      manufacturingDesc: '일반 제조업',
      semiconductor: '반도체',
      semiconductorDesc: '반도체 생산'
    },
    caseStudies: {
      title: '성공 사례',
      subtitle: '산업 리더들의 성공 스토리',
      readMore: '사례 보기',
      productivity: '생산성',
      quality: '품질',
      efficiency: '효율성',
      workforce: '인력 절감',
      uptime: '가동률',
      yield: '수율'
    },
    footer: {
      solutions: '솔루션',
      platform: '플랫폼',
      features: '기능',
      integration: '연동',
      security: '보안',
      support: '지원',
      resources: '자료',
      documentation: '문서',
      caseStudies: '성공 사례',
      blog: '블로그',
      events: '이벤트',
      company: '회사',
      about: '회사소개',
      careers: '채용',
      press: '보도자료',
      contact: '문의',
      legal: '법적 고지',
      privacy: '개인정보처리방침',
      terms: '이용약관',
      cookies: '쿠키정책',
      licenses: '라이선스',
      rights: 'All rights reserved.',
      country: '대한민국'
    },
    detail: {
      back: '뒤로 가기',
      breadcrumbHome: '홈',
      breadcrumbNavLabel: '경로',
      keyFeatures: '주요 기능',
      useCases: '활용 사례',
      technology: '기술 스택',
      category: '카테고리',
      client: '고객사',
      industry: '산업군',
      notFound: '솔루션을 찾을 수 없습니다',
      returnHome: '홈으로 돌아가기'
    }
  },
  en: {
    header: {
      solutions: 'Solution Introduction',
      about: 'About',
      news: 'NEWS',
      contact: 'Contact'
    },
    hero: {
      title1: 'Smart Factory',
      title2: 'Reimagined.',
      subtitle: 'Unified Platform for Production, Quality and Facility Operations.',
      cta: 'Explore Solutions'
    },
    architecture: {
      title: 'Solution Architecture',
      subtitle: 'Built on the WIZFACTORY Platform',
      production: 'Production',
      quality: 'Quality',
      facility: 'Facility'
    },
    navigation: {
      all: 'All',
      platform: 'Platform',
      production: 'Production',
      quality: 'Quality',
      facility: 'Facility',
      project: 'Operations'
    },
    solutions: {
      title: 'Solutions',
      subtitle: 'Complete suite for smart manufacturing',
      keyFeatures: 'Key Features',
      learnMore: 'Learn More',
      downloadBrochure: 'Download',
      viewDemo: 'View Demo',
      downloadStarted: 'Brochure download started'
    },
    industries: {
      title: 'Industries',
      subtitle: 'Powering manufacturing across multiple sectors',
      electronics: 'Electronics',
      electronicsDesc: 'Electronics Manufacturing',
      battery: 'Battery',
      batteryDesc: 'Battery Production',
      automotive: 'Automotive',
      automotiveDesc: 'Automotive Manufacturing',
      manufacturing: 'Manufacturing',
      manufacturingDesc: 'General Manufacturing',
      semiconductor: 'Semiconductor',
      semiconductorDesc: 'Semiconductor Production'
    },
    caseStudies: {
      title: 'Case Studies',
      subtitle: 'Success stories from industry leaders',
      readMore: 'Read case study',
      productivity: 'Productivity',
      quality: 'Quality',
      efficiency: 'Efficiency',
      workforce: 'Workforce Reduction',
      uptime: 'Uptime',
      yield: 'Yield'
    },
    footer: {
      solutions: 'Solutions',
      platform: 'Platform',
      features: 'Features',
      integration: 'Integration',
      security: 'Security',
      support: 'Support',
      resources: 'Resources',
      documentation: 'Documentation',
      caseStudies: 'Case Studies',
      blog: 'Blog',
      events: 'Events',
      company: 'Company',
      about: 'About',
      careers: 'Careers',
      press: 'Press',
      contact: 'Contact',
      legal: 'Legal',
      privacy: 'Privacy',
      terms: 'Terms',
      cookies: 'Cookies',
      licenses: 'Licenses',
      rights: 'All rights reserved.',
      country: 'South Korea'
    },
    detail: {
      back: 'Back',
      breadcrumbHome: 'Home',
      breadcrumbNavLabel: 'Breadcrumb',
      keyFeatures: 'Key Features',
      useCases: 'Use Cases',
      technology: 'Technology',
      category: 'Category',
      client: 'Client',
      industry: 'Industry',
      notFound: 'Solution not found',
      returnHome: 'Return to home'
    }
  }
};