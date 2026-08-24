import { Fragment, useEffect, useRef } from 'react';

function GoogleStars({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <svg width="20" height="20" viewBox="0 0 48 48" aria-label="Google" role="img">
        <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
        <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
        <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
        <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
      </svg>
      <div className="flex items-center gap-[3px]">
        {[0, 1, 2, 3, 4].map((i) => (
          <svg key={i} width="18" height="18" viewBox="0 0 24 24" fill="#FBBC04" aria-hidden="true">
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
          </svg>
        ))}
      </div>
    </div>
  );
}

export default function HeroRepair() {
  const parallaxRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  // Fix Safari viewport height issue on mobile - use 100vh which includes browser UI
  useEffect(() => {
    const setViewportHeight = () => {
      if (window.innerWidth < 768 && sectionRef.current) {
        // Detect Chrome specifically (not Safari)
        const isChrome = /Chrome/i.test(navigator.userAgent) && !/Safari/i.test(navigator.userAgent) || /CriOS/i.test(navigator.userAgent);
        const isSafari = /Safari/i.test(navigator.userAgent) && !/Chrome/i.test(navigator.userAgent) && !/CriOS/i.test(navigator.userAgent);
        
        if (isChrome) {
          // For Chrome, use 95vh
          sectionRef.current.style.setProperty('height', '95vh', 'important');
        } else if (isSafari) {
          // Use 105vh on Safari to get the full viewport including browser UI
          sectionRef.current.style.setProperty('height', '105vh', 'important');
        } else {
          // Default fallback
          const vh = window.innerHeight * 0.80;
          sectionRef.current.style.setProperty('height', `${vh}px`, 'important');
        }
      }
    };

    setViewportHeight();
    window.addEventListener('resize', setViewportHeight);
    window.addEventListener('orientationchange', setViewportHeight);
    
    return () => {
      window.removeEventListener('resize', setViewportHeight);
      window.removeEventListener('orientationchange', setViewportHeight);
    };
  }, []);

  useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrolled = window.pageYOffset;
          // 50% scroll speed parallax effect on desktop, 30% on mobile for smoother performance
          const isMobile = window.innerWidth < 768;
          const parallaxSpeed = isMobile ? 0.3 : 0.5;
          const offset = scrolled * parallaxSpeed;
          
          // Directly update transform without state to avoid re-renders
          if (parallaxRef.current) {
            parallaxRef.current.style.transform = `translate3d(0, ${offset}px, 0)`;
          }
          if (contentRef.current) {
            contentRef.current.style.transform = `translate3d(0, ${offset}px, 0)`;
          }
          
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Split text into characters for animation - shared charIndex for wave effect
  let globalCharIndex = 0;
  
  const wrapCharacters = (text: string) => {
    const baseDelay = 0.25;
    const charDelay = 0.02;

    // Real whitespace between word spans keeps the DOM text extractable
    // ("Utah County's Most..." rather than a mangled run-on for crawlers).
    // The spaces live directly in the h1, outside any span, so the global
    // `.hero-title span { display: inline-block }` rule can't collapse them.
    return text.split(' ').map((word, wordIndex) => (
      <Fragment key={wordIndex}>
        <span className="inline-block whitespace-nowrap">
          {word.split('').map((char) => {
            const delay = baseDelay + globalCharIndex * charDelay;
            globalCharIndex++;
            return (
              <span key={`char-${globalCharIndex}`} style={{ animationDelay: `${delay}s` }}>
                {char}
              </span>
            );
          })}
        </span>
        {wordIndex < text.split(' ').length - 1 ? ' ' : null}
      </Fragment>
    ));
  };

  return (
    <section ref={sectionRef} className="relative h-[95vh] md:h-[100vh] md:min-h-[700px] flex items-start md:items-center justify-center overflow-hidden">
      {/* Parallax Container - moves background and content together */}
      <div ref={parallaxRef} className="absolute inset-0 w-full h-full" style={{ willChange: 'transform' }}>
        {/* Mobile Background Image */}
        <div
          className="md:hidden absolute top-0 left-0 right-0 bottom-0 w-full h-full z-[1] opacity-0 scale-110"
          style={{
            backgroundImage:
              "url('/images/hero/hero-mobile.avif')",
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            backgroundPositionY: '75%',
            animation: 'heroBackgroundZoomOut 3s cubic-bezier(0.12, 0.23, 0.5, 1) forwards',
            willChange: 'transform',
          }}
          role="img"
          aria-label="Professional Christmas light installation on Utah County home against Wasatch Mountains"
        />

        {/* Desktop Background Image */}
        <div
          className="hidden md:block absolute top-0 left-0 right-0 bottom-0 w-full h-full z-[1] opacity-0 scale-110"
          style={{
            backgroundImage:
              "url('/images/hero/hero-desktop.avif')",
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center 20%',
            animation: 'heroBackgroundZoomOut 3s cubic-bezier(0.12, 0.23, 0.5, 1) forwards',
            willChange: 'transform',
          }}
          role="img"
          aria-label="Professional Christmas light installation on Utah County home against Wasatch Mountains"
        />

        {/* Uniform Dark Overlay - for text legibility */}
        <div className="absolute top-0 left-0 right-0 bottom-0 w-full h-full z-[1]"
          style={{
            background: 'rgba(0, 0, 0, 0.35)',
          }}
        />

        {/* Soft Text Scrim - Desktop: radial glow of darkness behind the text column */}
        <div className="hidden md:block absolute top-0 left-0 right-0 bottom-0 w-full h-full z-[1] pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 72% 115% at 26% 48%, rgba(0, 0, 0, 0.68) 0%, rgba(0, 0, 0, 0.45) 40%, rgba(0, 0, 0, 0.18) 60%, transparent 78%)',
          }}
        />

        {/* Soft Text Scrim - Mobile: protects headline at top and reviews at bottom */}
        <div className="md:hidden absolute top-0 left-0 right-0 bottom-0 w-full h-full z-[1] pointer-events-none"
          style={{
            background:
              'linear-gradient(to bottom, rgba(0, 0, 0, 0.78) 0%, rgba(0, 0, 0, 0.55) 40%, rgba(0, 0, 0, 0.25) 60%, transparent 72%), linear-gradient(to top, rgba(0, 0, 0, 0.75) 0%, rgba(0, 0, 0, 0.35) 25%, transparent 45%)',
          }}
        />

        {/* Film Grain Overlay */}
        <div
          className="absolute top-0 left-0 right-0 bottom-0 w-full h-full z-[1] pointer-events-none opacity-[0.14]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
            backgroundRepeat: 'repeat',
            mixBlendMode: 'overlay',
          }}
        />
      </div>

      {/* Hero Content */}
      <div ref={contentRef} className="relative z-[2] max-w-[1200px] w-full px-8 hero-content-mobile" style={{ willChange: 'transform' }}>
        <div className="relative w-full max-w-[800px] text-left">
          {/* Preheading Badge */}
          <div className="hero-eyebrow inline-flex items-center gap-2.5 mb-6 pt-8 md:pt-0 font-heading text-base font-normal leading-6 tracking-[0.1em] text-white/95 opacity-0 translate-y-5 animate-[fadeInUp_0.8s_ease_0.15s_forwards]">
            <span className="w-14 h-0.5 bg-white/80 rounded-sm"></span>
            Wasatch Front Christmas Lights
          </div>

          {/* H1 with Character Reveal */}
          <h1 className="hero-title font-heading text-5xl md:text-6xl font-medium leading-[1.2] mb-7 text-white tracking-tight max-w-[1050px]" style={{ textWrap: 'balance' }}>
            {(() => {
              globalCharIndex = 0; // Reset for each render
              return (
                <>
                  {wrapCharacters('Professional Christmas Light Installation in Utah County')}
                </>
              );
            })()}
          </h1>

          {/* Subheading */}
          <p className="hero-subheading font-heading text-base leading-6 text-white/90 mb-7 max-w-[620px] font-normal opacity-0 translate-y-5 animate-[fadeInUp_0.8s_ease_0.5s_forwards]">
            Commercial-grade lights included. We design, install, maintain, take down, and store them free.
          </p>

          {/* Seasonal Urgency */}
          <div className="flex items-center gap-2.5 mb-6 opacity-0 translate-y-5 animate-[fadeInUp_0.8s_ease_0.6s_forwards]">
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400"></span>
            </span>
            <span className="font-heading text-sm text-white/95">Now booking: Provo &amp; Orem routes fill fast</span>
          </div>

          {/* Buttons */}
          <div className="mb-12 md:mb-8 opacity-0 translate-y-5 animate-[fadeInUp_0.8s_ease_0.7s_forwards]">
            <div className="flex gap-4 flex-wrap">
              <a
                href="#value-proposition"
                className="cta-button hero-cta-button"
              >
                Get Free Quote
              </a>
              <a href="#gallery" className="secondary-button hero-cta-button !hidden md:!inline-flex">
                View Our Work
              </a>
            </div>
          </div>

          {/* Trust Indicators - Desktop: Under CTA buttons */}
          <div className="hidden md:block mt-4 opacity-0 translate-y-5 animate-[fadeInUp_0.8s_ease_0.9s_forwards]">
            <div className="flex flex-col gap-1 pl-4 py-2 border-l-[3px] border-white/80">
              <GoogleStars className="pb-5" />
              <div className="text-sm text-white/95 font-normal leading-none">5-Star Google Reviews • Fully Insured • Free Year-Round Storage</div>
            </div>
          </div>
        </div>

        {/* Reviews - Mobile Bottom Position */}
        <div className="hero-bottom-mobile md:hidden w-full max-w-[800px]">
          {/* Trust Indicators */}
          <div className="mt-6 opacity-0 translate-y-5 animate-[fadeInUp_0.8s_ease_0.9s_forwards]">
            <div className="flex flex-col gap-1 pl-4 py-2 border-l-[3px] border-white/80">
              <GoogleStars className="hero-reviews-stars pb-5" />
              <div className="hero-reviews-text font-heading">5-Star Google Reviews • Fully Insured • Free Year-Round Storage</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

