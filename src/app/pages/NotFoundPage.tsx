import { Link } from 'react-router';
import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export function NotFoundPage() {
  const { language } = useLanguage();
  const ko = language === 'ko';

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="text-center max-w-md"
      >
        <p
          className="text-8xl font-black mb-4 tracking-tighter"
          style={{ color: 'var(--apple-text-primary)' }}
        >
          404
        </p>
        <h1
          className="text-2xl md:text-3xl font-bold mb-3 tracking-tight"
          style={{ color: 'var(--apple-text-primary)' }}
        >
          {ko ? '페이지를 찾을 수 없습니다' : 'Page Not Found'}
        </h1>
        <p
          className="text-base mb-8 leading-relaxed"
          style={{ color: 'var(--apple-text-secondary)' }}
        >
          {ko
            ? '요청하신 페이지가 존재하지 않거나 이동되었습니다.'
            : 'The page you are looking for does not exist or has been moved.'}
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm text-white transition-all hover:opacity-90 active:scale-95"
          style={{ backgroundColor: 'var(--brand-red)' }}
        >
          <ArrowLeft size={16} strokeWidth={2.5} />
          {ko ? '홈으로 돌아가기' : 'Back to Home'}
        </Link>
      </motion.div>
    </div>
  );
}
