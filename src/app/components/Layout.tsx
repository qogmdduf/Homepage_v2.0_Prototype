import { Outlet } from 'react-router';
import { useState, useEffect } from 'react';
import { LanguageProvider } from '../contexts/LanguageContext';
import { Header } from './Header';
import { WizFooter } from './WizFooter';
import { ContactModal } from './ContactModal';
import { ErrorBoundary } from './ErrorBoundary';
import { ScrollToTop } from './SmoothScroll';

export function Layout() {
  const [isContactOpen, setIsContactOpen] = useState(false);

  useEffect(() => {
    const handler = () => setIsContactOpen(true);
    window.addEventListener('openContactModal', handler);
    return () => window.removeEventListener('openContactModal', handler);
  }, []);

  return (
    <LanguageProvider>
      <ErrorBoundary>
        <ScrollToTop>
          <Header />
          <Outlet />
          <WizFooter />
        </ScrollToTop>
        <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
      </ErrorBoundary>
    </LanguageProvider>
  );
}