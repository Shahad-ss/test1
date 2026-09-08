export const Star = ({ className = '' }: { className?: string }) => <span className={`mm-sparkle ${className}`} aria-hidden="true">✦</span>;

export const MoonFlower = () => (
  <svg viewBox="0 0 160 160" aria-hidden="true">
    <path d="M103 20c-35 9-48 49-27 76 15 19 38 25 61 15-17 28-58 36-85 11-33-31-17-86 26-102 9-3 18-3 25 0Z" fill="currentColor" opacity=".6" />
    <path d="M61 121c0-31 11-48 29-61M72 118c21-12 35-27 43-50" fill="none" stroke="currentColor" strokeWidth="3" opacity=".65" />
    <circle cx="46" cy="106" r="11" fill="currentColor" opacity=".5" /><circle cx="39" cy="91" r="8" fill="currentColor" opacity=".45" /><circle cx="54" cy="89" r="8" fill="currentColor" opacity=".45" />
  </svg>
);

export const CloudLine = () => (
  <svg viewBox="0 0 200 80" fill="none" aria-hidden="true"><path d="M16 62h164M38 61c-22-28 21-54 45-31 18-40 74-21 62 13 27-3 39 27 18 35" stroke="currentColor" strokeWidth="3" strokeLinecap="round" opacity=".52" /></svg>
);