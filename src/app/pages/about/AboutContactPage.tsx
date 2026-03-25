import { useState } from 'react';
import { Mail, Phone, CheckCircle2, Loader2 } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { getAboutSections } from '../../data/aboutSectionsContent';
import { AboutCtaBand } from '../../components/about/AboutPageUi';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Checkbox } from '../../components/ui/checkbox';
import { cn } from '../../components/ui/utils';

const fieldClass = cn(
  'flex w-full min-w-0 rounded-xl border border-black/[0.1] bg-white px-3 py-2.5',
  'text-[length:var(--text-body-md)] font-[family-name:var(--font-sans)] leading-[var(--leading-normal)]',
  'text-[var(--apple-text-primary)] outline-none transition-[box-shadow,border-color]',
  'placeholder:text-[length:var(--text-body-md)] placeholder:text-[var(--apple-text-tertiary)]',
  'focus-visible:border-[var(--brand-red)]/40 focus-visible:ring-[3px] focus-visible:ring-[var(--brand-red)]/15',
);

export function AboutContactPage() {
  const { language } = useLanguage();
  const ko = language === 'ko';
  const s = getAboutSections(language);
  const c = s.contact;
  const openContact = () => window.dispatchEvent(new CustomEvent('openContactModal'));

  const [tab, setTab] = useState<'tech' | 'adopt'>('tech');
  const [company, setCompany] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [products, setProducts] = useState<Record<string, boolean>>({});
  const [issueType, setIssueType] = useState('');
  const [adoptTopic, setAdoptTopic] = useState('');
  const [message, setMessage] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [privacy, setPrivacy] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const toggleProduct = (id: string) => {
    setProducts((p) => ({ ...p, [id]: !p[id] }));
  };

  const productSelected = Object.entries(products).some(([, v]) => v);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const list = e.target.files;
    if (!list?.length) return;
    const add = Array.from(list);
    setFiles((prev) => [...prev, ...add].slice(0, 2));
    e.target.value = '';
  };

  const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!company.trim() || !name.trim() || !email.trim() || !isValidEmail(email)) return;
    if (!productSelected) return;
    if (tab === 'tech' && !issueType) return;
    if (tab === 'adopt' && !adoptTopic) return;
    if (!message.trim() || !privacy) return;

    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1400));
    setSubmitting(false);
    setSuccess(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const mailHref = `mailto:${c.emailLine}?subject=${encodeURIComponent(ko ? '[위즈팩토리] 문의' : '[WIZFACTORY] Inquiry')}`;
  const telHref = `tel:${c.phoneLine.replace(/[^+\d]/g, '')}`;

  const aside = (
    <aside className="min-w-0 lg:sticky lg:top-[calc(var(--app-header-offset)+88px)] lg:self-start">
      <p className="text-[length:var(--text-label-xs)] font-bold uppercase tracking-[var(--tracking-widest)] text-[var(--apple-text-tertiary)]">
        {c.directTitle}
      </p>
      <div className="mt-5 space-y-4">
        <div className="rounded-2xl border border-black/[0.06] bg-white p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[var(--apple-surface-gray)]">
              <Mail className="size-[18px] text-[var(--apple-text-primary)]" aria-hidden />
            </div>
            <div className="min-w-0">
              <p className="text-[length:var(--text-label-xxs)] font-bold uppercase tracking-[var(--tracking-wider)] text-[var(--apple-text-tertiary)]">
                E-mail
              </p>
              <a
                href={mailHref}
                className="mt-1 block break-all font-[family-name:var(--font-sans)] text-[length:var(--text-label-lg)] font-semibold leading-[var(--leading-snug)] text-[var(--apple-text-primary)] underline-offset-2 hover:underline"
              >
                {c.emailLine}
              </a>
              <a
                href={mailHref}
                className="mt-3 inline-flex text-[length:var(--text-label-sm)] font-semibold leading-[var(--leading-normal)] text-[var(--brand-red)]"
              >
                {c.mailCta} →
              </a>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-black/[0.06] bg-white p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[var(--apple-surface-gray)]">
              <Phone className="size-[18px] text-[var(--apple-text-primary)]" aria-hidden />
            </div>
            <div>
              <p className="text-[length:var(--text-label-xxs)] font-bold uppercase tracking-[var(--tracking-wider)] text-[var(--apple-text-tertiary)]">
                {ko ? '전화' : 'Phone'}
              </p>
              <a
                href={telHref}
                className="mt-1 block font-[family-name:var(--font-sans)] text-[length:var(--text-label-lg)] font-semibold leading-[var(--leading-snug)] text-[var(--apple-text-primary)] tabular-nums"
              >
                {c.phoneLine}
              </a>
              <a
                href={telHref}
                className="mt-3 inline-flex text-[length:var(--text-label-sm)] font-semibold leading-[var(--leading-normal)] text-[var(--brand-red)]"
              >
                {c.phoneCta} →
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-10">
        <p className="mb-3 text-[length:var(--text-label-xs)] font-bold uppercase tracking-[0.2em] text-[var(--brand-red)]">
          {c.eyebrow}
        </p>
        <h1 className="font-[family-name:var(--font-display)] text-[length:var(--text-display-sm)] font-bold leading-[var(--leading-tight)] tracking-[var(--tracking-tighter)] text-[var(--apple-text-primary)] md:text-[length:var(--text-display-md)]">
          {c.title}
        </h1>
        <p className="mt-4 text-[length:var(--text-body-lg)] font-normal leading-[var(--leading-relaxed)] text-[var(--apple-text-secondary)]">
          {c.lead}
        </p>
      </div>
    </aside>
  );

  return (
    <>
      <section className="border-b border-black/[0.05] bg-[var(--apple-surface-gray)]">
        <div className="wiz-section py-10 md:py-14 lg:py-20">
          {success ? (
            <div className="mx-auto max-w-lg rounded-2xl border border-black/[0.06] bg-white px-8 py-14 text-center shadow-sm">
              <div className="mx-auto mb-5 flex size-16 items-center justify-center rounded-full border border-emerald-200/80 bg-emerald-50">
                <CheckCircle2 className="size-8 text-emerald-600" aria-hidden />
              </div>
              <h2 className="font-[family-name:var(--font-display)] text-[length:var(--text-display-xs)] font-bold leading-[var(--leading-snug)] tracking-[var(--tracking-tight)] text-[var(--apple-text-primary)]">
                {c.successTitle}
              </h2>
              <p className="mt-3 text-[length:var(--text-body-md)] font-normal leading-[var(--leading-relaxed)] text-[var(--apple-text-secondary)]">
                {c.successBody}
              </p>
              <Button
                type="button"
                className="mt-8 rounded-full px-8"
                onClick={() => {
                  setSuccess(false);
                  setMessage('');
                  setFiles([]);
                  setPrivacy(false);
                }}
              >
                {ko ? '추가 문의하기' : 'Send another'}
              </Button>
            </div>
          ) : (
            <div className="mx-auto grid max-w-[1180px] grid-cols-1 gap-10 lg:grid-cols-2 lg:items-start lg:gap-12 xl:gap-16">
              {/* 좌: 직접 연락 · 소개 / 우: 입력 폼 */}
              {aside}
              <div className="min-w-0">
                <div className="mb-8 flex rounded-2xl border border-black/[0.08] bg-white p-1.5 shadow-sm">
                  <button
                    type="button"
                    onClick={() => {
                      setTab('tech');
                      setIssueType('');
                    }}
                    className={cn(
                      'flex-1 rounded-xl py-3 text-[length:var(--text-label-lg)] font-[family-name:var(--font-sans)] font-semibold leading-[var(--leading-normal)] transition-colors',
                      tab === 'tech'
                        ? 'bg-[var(--apple-text-primary)] text-white'
                        : 'text-[var(--apple-text-secondary)] hover:text-[var(--apple-text-primary)]',
                    )}
                  >
                    {c.tabTech}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setTab('adopt');
                      setAdoptTopic('');
                    }}
                    className={cn(
                      'flex-1 rounded-xl py-3 text-[length:var(--text-label-lg)] font-[family-name:var(--font-sans)] font-semibold leading-[var(--leading-normal)] transition-colors',
                      tab === 'adopt'
                        ? 'bg-[var(--apple-text-primary)] text-white'
                        : 'text-[var(--apple-text-secondary)] hover:text-[var(--apple-text-primary)]',
                    )}
                  >
                    {c.tabAdopt}
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-10">
                  <div>
                    <p className="text-[length:var(--text-label-xs)] font-bold uppercase tracking-[var(--tracking-widest)] text-[var(--brand-red)]">
                      {c.step01Label}
                    </p>
                    <h2 className="mt-2 font-[family-name:var(--font-display)] text-[length:var(--text-body-xl)] font-bold leading-[var(--leading-snug)] tracking-[var(--tracking-snug)] text-[var(--apple-text-primary)]">
                      {c.step01Title}
                    </h2>
                    <p className="mt-1 text-[length:var(--text-label-md)] font-normal leading-[var(--leading-normal)] text-[var(--apple-text-tertiary)]">
                      {c.step01Note}
                    </p>
                    <div className="mt-6 grid gap-4 sm:grid-cols-2">
                      <div className="space-y-1.5">
                        <label className="text-[length:var(--text-label-md)] font-semibold leading-[var(--leading-normal)] text-[var(--apple-text-primary)]">
                          {c.companyLabel} <span className="text-[var(--brand-red)]">*</span>
                        </label>
                        <Input
                          value={company}
                          onChange={(e) => setCompany(e.target.value)}
                          placeholder={c.phCompany}
                          className={cn(fieldClass, 'h-11')}
                          autoComplete="organization"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[length:var(--text-label-md)] font-semibold leading-[var(--leading-normal)] text-[var(--apple-text-primary)]">
                          {c.nameLabel} <span className="text-[var(--brand-red)]">*</span>
                        </label>
                        <Input
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder={c.phName}
                          className={cn(fieldClass, 'h-11')}
                          autoComplete="name"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[length:var(--text-label-md)] font-semibold leading-[var(--leading-normal)] text-[var(--apple-text-primary)]">
                          {c.emailLabel} <span className="text-[var(--brand-red)]">*</span>
                        </label>
                        <Input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder={c.phEmail}
                          className={cn(fieldClass, 'h-11')}
                          autoComplete="email"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[length:var(--text-label-md)] font-semibold leading-[var(--leading-normal)] text-[var(--apple-text-primary)]">
                          {c.phoneLabel}
                        </label>
                        <Input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder={c.phPhone}
                          className={cn(fieldClass, 'h-11')}
                          autoComplete="tel"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <p className="text-[length:var(--text-label-xs)] font-bold uppercase tracking-[var(--tracking-widest)] text-[var(--brand-red)]">
                      {c.step02Label}
                    </p>
                    <h2 className="mt-2 font-[family-name:var(--font-display)] text-[length:var(--text-body-xl)] font-bold leading-[var(--leading-snug)] tracking-[var(--tracking-snug)] text-[var(--apple-text-primary)]">
                      {c.step02Title}
                    </h2>
                    <p className="mt-1 text-[length:var(--text-label-md)] font-normal leading-[var(--leading-normal)] text-[var(--apple-text-tertiary)]">
                      {c.step02Hint}
                    </p>
                    <div className="mt-5 flex flex-wrap gap-2.5">
                      {c.products.map((p) => (
                        <label
                          key={p.id}
                          className={cn(
                            'inline-flex cursor-pointer items-center gap-2 rounded-full border px-3.5 py-2 text-[length:var(--text-label-lg)] font-[family-name:var(--font-sans)] font-medium leading-[var(--leading-normal)] transition-colors',
                            products[p.id]
                              ? 'border-[var(--brand-red)] bg-[var(--brand-red)]/[0.06] text-[var(--apple-text-primary)]'
                              : 'border-black/[0.1] bg-white text-[var(--apple-text-secondary)] hover:border-black/[0.18]',
                          )}
                        >
                          <Checkbox
                            checked={!!products[p.id]}
                            onCheckedChange={() => toggleProduct(p.id)}
                            className="border-black/25 data-[state=checked]:bg-[var(--brand-red)] data-[state=checked]:border-[var(--brand-red)]"
                          />
                          <span>{p.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-[length:var(--text-label-xs)] font-bold uppercase tracking-[var(--tracking-widest)] text-[var(--brand-red)]">
                      {tab === 'tech' ? c.step03TechLabel : c.step03AdoptLabel}
                    </p>
                    <h2 className="mt-2 font-[family-name:var(--font-display)] text-[length:var(--text-body-xl)] font-bold leading-[var(--leading-snug)] tracking-[var(--tracking-snug)] text-[var(--apple-text-primary)]">
                      {tab === 'tech' ? c.step03TechTitle : c.step03AdoptTitle}
                    </h2>
                    <div className="mt-5 flex flex-col gap-2.5">
                      {(tab === 'tech' ? c.issueTypes : c.adoptTopics).map((opt) => (
                        <label
                          key={opt.id}
                          className={cn(
                            'flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3.5 text-[length:var(--text-body-sm)] font-[family-name:var(--font-sans)] font-medium leading-[var(--leading-normal)] transition-colors',
                            (tab === 'tech' ? issueType === opt.id : adoptTopic === opt.id)
                              ? 'border-[var(--brand-red)] bg-[var(--brand-red)]/[0.04]'
                              : 'border-black/[0.08] bg-white hover:border-black/[0.14]',
                          )}
                        >
                          <input
                            type="radio"
                            name={tab === 'tech' ? 'issue' : 'adopt'}
                            className="size-4 accent-[var(--brand-red)]"
                            checked={tab === 'tech' ? issueType === opt.id : adoptTopic === opt.id}
                            onChange={() => {
                              if (tab === 'tech') setIssueType(opt.id);
                              else setAdoptTopic(opt.id);
                            }}
                          />
                          {opt.label}
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-[length:var(--text-label-xs)] font-bold uppercase tracking-[var(--tracking-widest)] text-[var(--brand-red)]">
                      {c.step04Label}
                    </p>
                    <h2 className="mt-2 font-[family-name:var(--font-display)] text-[length:var(--text-body-xl)] font-bold leading-[var(--leading-snug)] tracking-[var(--tracking-snug)] text-[var(--apple-text-primary)]">
                      {c.step04Title}
                    </h2>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={6}
                      placeholder={ko ? '문의 내용을 입력해 주세요.' : 'Describe your request…'}
                      className={cn(
                        fieldClass,
                        'mt-5 min-h-[160px] resize-y py-3 leading-[var(--leading-relaxed)]',
                      )}
                      maxLength={4000}
                    />
                    <p className="mt-2 text-[length:var(--text-label-sm)] font-normal leading-[var(--leading-normal)] text-[var(--apple-text-tertiary)]">
                      {c.fileHint}
                    </p>
                    <div className="mt-3 flex flex-wrap items-center gap-3">
                      <label className="inline-flex cursor-pointer items-center justify-center rounded-xl border border-dashed border-black/[0.2] bg-white px-4 py-2.5 text-[length:var(--text-label-lg)] font-[family-name:var(--font-sans)] font-semibold leading-[var(--leading-normal)] text-[var(--apple-text-primary)] transition-colors hover:bg-black/[0.02]">
                        <input type="file" className="sr-only" accept=".pdf,.jpg,.jpeg,.png,.zip" multiple onChange={onFileChange} />
                        {c.fileButton}
                      </label>
                      {files.length > 0 && (
                        <ul className="text-[length:var(--text-label-sm)] font-normal leading-[var(--leading-normal)] text-[var(--apple-text-secondary)]">
                          {files.map((f, i) => (
                            <li key={`${f.name}-${i}`}>{f.name}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4 pt-8">
                    <label className="flex cursor-pointer items-start gap-3">
                      <Checkbox
                        checked={privacy}
                        onCheckedChange={(v) => setPrivacy(!!v)}
                        className="mt-0.5 border-black/25 data-[state=checked]:bg-[var(--brand-red)] data-[state=checked]:border-[var(--brand-red)]"
                      />
                      <span className="text-[length:var(--text-body-sm)] font-normal leading-[var(--leading-snug)] text-[var(--apple-text-primary)]">
                        {c.privacyLabel}{' '}
                        <details className="mt-1 inline">
                          <summary className="cursor-pointer text-[length:var(--text-body-sm)] text-[var(--brand-red)] underline underline-offset-2">
                            {ko ? '전문보기' : 'Full text'}
                          </summary>
                          <span className="mt-2 block text-[length:var(--text-label-sm)] font-normal leading-[var(--leading-relaxed)] text-[var(--apple-text-secondary)]">
                            {c.privacyDetail}
                          </span>
                        </details>
                      </span>
                    </label>
                    <Button
                      type="submit"
                      size="lg"
                      disabled={submitting}
                      className="h-12 w-full rounded-xl bg-[var(--apple-text-primary)] font-[family-name:var(--font-sans)] text-[length:var(--text-label-lg)] font-bold leading-[var(--leading-normal)] tracking-[var(--tracking-wide)] text-white hover:bg-black sm:w-auto sm:min-w-[200px]"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="size-4 animate-spin" />
                          {ko ? '전송 중…' : 'Sending…'}
                        </>
                      ) : (
                        c.submit
                      )}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </section>

      <AboutCtaBand
        title={s.cta.title}
        primaryLabel={s.cta.button}
        secondaryLabel={s.cta.secondary}
        onPrimary={openContact}
        secondaryTo="/about"
      />
    </>
  );
}
