import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect, useCallback, useRef } from 'react';
import { X, ArrowRight, Mail, Phone, CheckCircle2, Loader2, ChevronDown } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import wizSymbol from '../../assets/symbol.svg';
import { cn } from './ui/utils';
import { Input } from './ui/input';
import { Button } from './ui/button';

/** 네이티브 select/textarea — Input과 동일한 DS 포커스 링 */
const fieldNativeClass = cn(
  'flex w-full min-w-0 rounded-xl border border-input bg-input-background px-3 text-base text-foreground outline-none transition-[color,box-shadow]',
  'placeholder:text-muted-foreground',
  'focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50',
  'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
  'md:text-sm',
);

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function Field({
  label,
  id,
  type = 'text',
  placeholder,
  value,
  onChange,
  required = false,
}: {
  label: string;
  id: string;
  type?: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="text-[length:var(--text-label-md)] font-medium text-foreground"
      >
        {label}
        {required && <span className="text-primary"> *</span>}
      </label>
      <Input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        maxLength={200}
        onChange={e => onChange(e.target.value)}
        className="h-11 rounded-xl"
      />
    </div>
  );
}

function SelectField({
  label,
  id,
  placeholder,
  value,
  onChange,
  options,
}: {
  label: string;
  id: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-[length:var(--text-label-md)] font-medium text-foreground">
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={e => onChange(e.target.value)}
          className={cn(fieldNativeClass, 'h-11 cursor-pointer appearance-none pr-10', !value && 'text-muted-foreground')}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map(o => (
            <option key={o.value} value={o.value} className="text-foreground">
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDown
          className="pointer-events-none absolute right-3 top-1/2 size-[15px] -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
      </div>
    </div>
  );
}

function TextareaField({
  label,
  id,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  id: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-[length:var(--text-label-md)] font-medium text-foreground">
        {label}
      </label>
      <textarea
        id={id}
        placeholder={placeholder}
        value={value}
        maxLength={1000}
        onChange={e => onChange(e.target.value)}
        rows={4}
        className={cn(
          fieldNativeClass,
          'min-h-[120px] resize-none py-2.5 leading-[var(--leading-relaxed)]',
        )}
      />
    </div>
  );
}

function ContactItem({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3.5">
      <div
        className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-apple-blue"
        aria-hidden
      >
        <Icon className="size-[17px] text-white" strokeWidth={2} />
      </div>
      <div>
        <p className="mb-0.5 text-[length:var(--text-label-xs)] text-muted-foreground">{label}</p>
        <p className="text-[length:var(--text-label-lg)] font-semibold text-foreground">{value}</p>
      </div>
    </div>
  );
}

export function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const { language } = useLanguage();
  const ko = language === 'ko';

  const [step, setStep] = useState<'form' | 'done'>('form');
  const [submitting, setSubmitting] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [industry, setIndustry] = useState('');
  const [message, setMessage] = useState('');

  const industryOptions = ko
    ? [
        { value: 'electronics', label: '전자 / 반도체' },
        { value: 'automotive', label: '자동차' },
        { value: 'display', label: '디스플레이' },
        { value: 'battery', label: '2차 전지' },
        { value: 'pharma', label: '제약 / 바이오' },
        { value: 'food', label: '식품 / 음료' },
        { value: 'other', label: '기타' },
      ]
    : [
        { value: 'electronics', label: 'Electronics / Semiconductor' },
        { value: 'automotive', label: 'Automotive' },
        { value: 'display', label: 'Display' },
        { value: 'battery', label: 'Battery / Energy' },
        { value: 'pharma', label: 'Pharma / Bio' },
        { value: 'food', label: 'Food & Beverage' },
        { value: 'other', label: 'Other' },
      ];

  useEffect(() => {
    if (!isOpen) return;
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.documentElement.style.overflow = '';
    };
  }, [isOpen]);

  const closeTimerRef = useRef<ReturnType<typeof setTimeout>>();
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      clearTimeout(closeTimerRef.current);
    };
  }, []);

  const handleClose = useCallback(() => {
    onClose();
    clearTimeout(closeTimerRef.current);
    closeTimerRef.current = setTimeout(() => {
      if (mountedRef.current) {
        setStep('form');
        setName('');
        setEmail('');
        setIndustry('');
        setMessage('');
      }
    }, 350);
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, handleClose]);

  const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !isValidEmail(email)) return;
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 1600));
    if (!mountedRef.current) return;
    setSubmitting(false);
    setStep('done');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={handleClose}
            aria-hidden="true"
          />

          <div
            className="fixed inset-0 z-[51] overflow-y-auto overflow-x-hidden overscroll-y-contain"
            style={{ WebkitOverflowScrolling: 'touch', touchAction: 'pan-y' }}
            onClick={handleClose}
          >
            <div className="flex min-h-dvh w-full items-center justify-center px-4 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-[max(1rem,env(safe-area-inset-top))] md:px-8 md:py-8">
              <motion.div
                key="modal"
                role="dialog"
                aria-modal="true"
                aria-label={ko ? '문의하기' : 'Contact Us'}
                initial={{ opacity: 0, y: 32, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 320, damping: 38 }}
                className="pointer-events-auto relative w-full max-w-[min(100%,64rem)] rounded-[28px] border border-black/[0.06] bg-apple-bg-primary shadow-[0_32px_80px_rgba(0,0,0,0.18)] md:max-w-5xl"
                onClick={e => e.stopPropagation()}
              >
                <div className="flex items-start justify-between gap-3 px-4 pb-4 pt-5 sm:px-7 sm:pb-5 sm:pt-6">
                  <div className="flex items-center gap-3">
                    <img src={wizSymbol} alt="WizFactory" className="h-9 w-auto" />
                    <div>
                      <p className="text-base font-medium leading-snug tracking-[var(--tracking-tight)] text-foreground">
                        {ko ? (
                          <>
                            <span className="font-extrabold">클라우드 서비스 </span>
                            <span className="font-normal text-muted-foreground">기반의</span>
                            <br />
                            <span className="font-extrabold">크로스 플랫폼 </span>
                            <span className="font-normal text-muted-foreground">시작하기</span>
                          </>
                        ) : (
                          <>
                            <span className="font-extrabold">Cloud-Based </span>
                            <span className="font-normal text-muted-foreground">platform</span>
                            <br />
                            <span className="font-extrabold">starts </span>
                            <span className="font-normal text-muted-foreground">here</span>
                          </>
                        )}
                      </p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={handleClose}
                    aria-label={ko ? '닫기' : 'Close'}
                    className="size-9 shrink-0 rounded-full bg-black/[0.08] text-foreground hover:bg-black/[0.14]"
                  >
                    <X className="size-[15px]" strokeWidth={2.5} />
                  </Button>
                </div>

                <div className="px-4 pb-6 sm:px-5">
                  {step === 'done' ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                      <motion.div
                        initial={{ scale: 0.4, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                        className="mb-6 flex size-20 items-center justify-center rounded-full border border-state-success-border bg-state-success-bg"
                      >
                        <CheckCircle2 className="size-10 text-semantic-success" aria-hidden />
                      </motion.div>
                      <motion.h2
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.14 }}
                        className="mb-3 text-[length:var(--text-display-sm)] font-black tracking-[var(--tracking-tight)] text-foreground"
                      >
                        {ko ? '문의가 접수되었습니다' : 'Message Received!'}
                      </motion.h2>
                      <motion.p
                        initial={{ y: 16, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.21 }}
                        className="max-w-sm text-[length:var(--text-body-lg)] leading-[var(--leading-relaxed)] text-muted-foreground"
                      >
                        {ko
                          ? '담당자가 영업일 기준 1일 이내에 연락드리겠습니다. 감사합니다!'
                          : 'Our team will get back to you within 1 business day. Thank you!'}
                      </motion.p>
                      <motion.div
                        initial={{ y: 16, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.28 }}
                        className="mt-8"
                      >
                        <Button
                          type="button"
                          size="lg"
                          className="rounded-2xl px-8 py-3.5 text-sm font-bold"
                          onClick={handleClose}
                        >
                          {ko ? '닫기' : 'Close'}
                        </Button>
                      </motion.div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
                      <motion.div
                        initial={{ opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                        className="relative flex flex-col gap-5 overflow-hidden rounded-2xl border border-white/80 bg-[var(--apple-globalnav-header-bg)] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] backdrop-blur-[20px] sm:gap-7 sm:rounded-3xl sm:p-7 md:col-span-5"
                        style={{ WebkitBackdropFilter: 'var(--apple-globalnav-header-backdrop)' }}
                      >
                        <div
                          className="pointer-events-none absolute -right-16 -top-16 size-56 rounded-full blur-[48px]"
                          style={{
                            background:
                              'radial-gradient(ellipse, rgba(0, 113, 227, 0.1) 0%, transparent 70%)',
                          }}
                        />

                        <p className="relative z-10 text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
                          {ko ? '도움이 필요하신가요?' : "WE'RE HERE TO HELP YOU"}
                        </p>

                        <div className="relative z-10">
                          <h2
                            className="text-[length:var(--text-display-sm)] font-extrabold leading-[var(--leading-tight)] tracking-[var(--tracking-tighter)] text-foreground sm:text-[length:var(--text-display-md)]"
                          >
                            {ko ? (
                              <>
                                <span>솔루션 도입,</span>
                                <br />
                                <span className="font-normal">지금 바로</span>
                                <br />
                                <span className="font-normal">시작해보세요.</span>
                              </>
                            ) : (
                              <>
                                <span>Discuss</span>
                                <span className="font-normal"> Your</span>
                                <br />
                                <span className="font-normal">Smart Factory</span>
                                <br />
                                <span className="font-normal">Solution Needs</span>
                              </>
                            )}
                          </h2>
                          <p className="mt-3 text-[length:var(--text-label-md)] leading-[var(--leading-relaxed)] text-muted-foreground">
                            {ko
                              ? '제조 현장의 디지털 전환을 위한 최적의 파트너, 위즈팩토리에게 문의하세요.'
                              : 'Looking for top-quality smart factory solutions tailored to your needs? Reach out to us.'}
                          </p>
                        </div>

                        <div className="relative z-10 flex flex-col gap-4">
                          <ContactItem icon={Mail} label={ko ? '이메일' : 'E-mail'} value="hy.bae@wiz-factory.com" />
                          <ContactItem icon={Phone} label={ko ? '전화번호' : 'Phone number'} value="055-715-7737" />
                        </div>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.45, delay: 0.06, ease: [0.22, 1, 0.36, 1] }}
                        className="flex flex-col rounded-2xl border border-border bg-card p-5 shadow-[0_4px_24px_rgba(0,0,0,0.07),0_1px_4px_rgba(0,0,0,0.04)] sm:rounded-3xl sm:p-7 md:col-span-7"
                      >
                        <form onSubmit={handleSubmit} className="flex h-full flex-col gap-4">
                          <Field
                            id="name"
                            label={ko ? '이름' : 'Name'}
                            placeholder={ko ? '홍길동' : 'Jane Smith'}
                            value={name}
                            onChange={setName}
                            required
                          />
                          <Field
                            id="email"
                            label={ko ? '이메일' : 'Email'}
                            type="email"
                            placeholder={ko ? 'example@company.com' : 'jane@company.com'}
                            value={email}
                            onChange={setEmail}
                            required
                          />
                          <SelectField
                            id="industry"
                            label={ko ? '산업군' : 'Industry'}
                            placeholder={ko ? '선택하세요...' : 'Select...'}
                            value={industry}
                            onChange={setIndustry}
                            options={industryOptions}
                          />
                          <div className="flex-1">
                            <TextareaField
                              id="message"
                              label={ko ? '메시지' : 'Message'}
                              placeholder={ko ? '문의 내용을 입력해주세요.' : 'Type your message'}
                              value={message}
                              onChange={setMessage}
                            />
                          </div>

                          <p className="text-[length:var(--text-label-xs)] leading-[var(--leading-normal)] text-muted-foreground">
                            {ko
                              ? '제출 시 개인정보 수집 및 이용에 동의하는 것으로 간주됩니다.'
                              : 'By submitting, you agree to our privacy policy and data collection terms.'}
                          </p>

                          <Button
                            type="submit"
                            size="lg"
                            disabled={submitting || !name || !email}
                            className="h-14 w-full gap-2 rounded-2xl text-base font-bold tracking-[var(--tracking-snug)]"
                          >
                            {submitting ? (
                              <>
                                <Loader2 className="size-4 animate-spin" />
                                {ko ? '전송 중...' : 'Sending...'}
                              </>
                            ) : (
                              <>
                                {ko ? '문의하기' : 'Contact Us'}
                                <ArrowRight className="size-4" strokeWidth={2.5} />
                              </>
                            )}
                          </Button>
                        </form>
                      </motion.div>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
