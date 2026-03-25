import { Link } from 'react-router';
import { ArrowRight } from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '../ui/utils';

export function AboutPageHero({
  eyebrow,
  title,
  lead,
  className,
}: {
  eyebrow: string;
  title: string;
  lead?: string;
  className?: string;
}) {
  return (
    <div className={cn('mb-12 md:mb-16', className)}>
      <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--apple-text-secondary)]">
        {eyebrow}
      </p>
      <h1 className="text-[length:var(--text-display-md)] font-bold tracking-[var(--tracking-tight)] text-[var(--apple-text-primary)] md:text-[length:var(--text-display-lg)]">
        {title}
      </h1>
      {lead ? (
        <p className="mt-5 max-w-3xl text-[length:var(--text-body-lg)] leading-[var(--leading-relaxed)] text-[var(--apple-text-secondary)]">
          {lead}
        </p>
      ) : null}
    </div>
  );
}

export function AboutSectionImage({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'overflow-hidden rounded-2xl border border-black/[0.06] bg-[var(--apple-surface-white)] shadow-[0_4px_24px_rgba(0,0,0,0.06)]',
        className,
      )}
    >
      <img src={src} alt={alt} className="h-full w-full object-contain object-center" loading="lazy" />
    </div>
  );
}

export function AboutCtaBand({
  title,
  primaryLabel,
  secondaryLabel,
  onPrimary,
  secondaryTo,
}: {
  title: string;
  primaryLabel: string;
  secondaryLabel: string;
  onPrimary: () => void;
  secondaryTo: string;
}) {
  return (
    <section className="apple-section-dark py-14 md:py-16">
      <div className="wiz-section text-center">
        <h2 className="mb-6 text-xl font-bold text-white md:text-2xl">{title}</h2>
        <div className="flex flex-wrap justify-center gap-3">
          <Button
            size="lg"
            className="rounded-full bg-white px-8 text-[var(--apple-text-primary)] hover:bg-white/90"
            onClick={onPrimary}
          >
            {primaryLabel}
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="rounded-full border-white/30 bg-transparent px-8 text-white hover:bg-white/10"
            asChild
          >
            <Link to={secondaryTo}>
              {secondaryLabel}
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
