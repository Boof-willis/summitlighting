import { useEffect, useRef } from 'react';

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
    const baseDelay = 0.5;
    const charDelay = 0.03;

    return text.split(' ').map((word, wordIndex) => (
      <span key={wordIndex} className="inline-block whitespace-nowrap mr-2 md:mr-[18px]">
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
    ));
  };

  return (
    <section ref={sectionRef} className="relative h-[95vh] md:h-screen flex items-center justify-center overflow-hidden">
      {/* Parallax Container - moves background and content together */}
      <div ref={parallaxRef} className="absolute inset-0 w-full h-full" style={{ willChange: 'transform' }}>
        {/* Mobile Background Image */}
        <div
          className="md:hidden absolute top-0 left-0 right-0 bottom-0 w-full h-full z-[1] opacity-0 scale-110"
          style={{
            backgroundImage:
              "url('https://pub-b90babce61544d61a1c7d67d49d512e4.r2.dev/images/mobile%20hero%20-%20house%20with%20white%20christmas%20lights%20against%20alpine%20mountains%201.avif')",
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            backgroundPositionY: '75%',
            animation: 'heroBackgroundZoomOut 3s cubic-bezier(0.12, 0.23, 0.5, 1) forwards',
            transform: 'scaleX(-1)',
            willChange: 'transform',
          }}
        />
        
        {/* Desktop Background Image */}
        <div
          className="hidden md:block absolute top-0 left-0 right-0 bottom-0 w-full h-full z-[1] opacity-0 scale-110"
          style={{
            backgroundImage:
              "url('https://pub-b90babce61544d61a1c7d67d49d512e4.r2.dev/images/images/hybrid%203.png')",
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center 20%',
            animation: 'heroBackgroundZoomOut 3s cubic-bezier(0.12, 0.23, 0.5, 1) forwards',
            transform: 'scaleX(-1)',
            willChange: 'transform',
          }}
        />
        
        {/* Gradient Overlay - Mobile - Dark to transparent bottom to top for text legibility */}
        <div className="md:hidden absolute top-0 left-0 right-0 bottom-0 w-full h-full z-[1]"
          style={{
            background: 'linear-gradient(to top, rgba(0, 0, 0, 0.85) 0%, rgba(0, 0, 0, 0.7) 15%, rgba(0, 0, 0, 0.5) 25%, rgba(0, 0, 0, 0.3) 30%, transparent 35%)',
          }}
        />
        
        {/* Gradient Overlay - Desktop - Dark to transparent left to right for text legibility */}
        <div className="hidden md:block absolute top-0 left-0 right-0 bottom-0 w-full h-full z-[1]"
          style={{
            background: 'linear-gradient(to right, rgba(0, 0, 0, 0.65) 0%, rgba(0, 0, 0, 0.5) 30%, rgba(0, 0, 0, 0.3) 50%, transparent 70%)',
          }}
        />
      </div>

      {/* Hero Content */}
      <div ref={contentRef} className="relative z-[2] max-w-[1200px] w-full px-8 flex flex-col md:flex-row items-start md:items-center hero-content-mobile" style={{ willChange: 'transform', height: '100%' }}>
        <div className="relative w-full max-w-[800px] text-left">
          {/* Preheading Badge */}
          <div className="hero-eyebrow inline-flex items-center gap-2.5 mb-6 font-heading text-base font-normal leading-6 tracking-[0.1em] text-white/95 opacity-0 translate-y-5 animate-[fadeInUp_0.8s_ease_0.3s_forwards]">
            <span className="w-14 h-0.5 bg-white/80 rounded-sm"></span>
            Utah County Christmas Lights
          </div>

          {/* H1 with Character Reveal */}
          <h1 className="hero-title font-heading text-4xl md:text-7xl font-medium leading-[1.2] text-white tracking-tight mb-7">
            {(() => {
              globalCharIndex = 0; // Reset for each render
              return (
                <>
                  {wrapCharacters("Utah County's Most")}
                  <br />
                  {wrapCharacters('Trusted Christmas Light Installer')}
                </>
              );
            })()}
          </h1>

          {/* Subheading */}
          <h2 className="hero-subheading font-heading text-base leading-6 text-white/90 font-normal mb-8 max-w-[620px] opacity-0 translate-y-5 animate-[fadeInUp_0.8s_ease_0.9s_forwards]">
            Commercial-grade lights included. Professional design, installation, and takedown with free year-round storage.
          </h2>

          {/* Buttons */}
          <div className="flex gap-4 flex-wrap mb-10 md:mb-16 opacity-0 translate-y-5 animate-[fadeInUp_0.8s_ease_1.1s_forwards]">
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

        {/* Reviews - Mobile Bottom Position */}
        <div className="hero-bottom-mobile w-full max-w-[800px]">
          {/* Trust Indicators */}
          <div className="mt-6 md:mt-8 opacity-0 translate-y-5 animate-[fadeInUp_0.8s_ease_1.3s_forwards]">
            <div className="flex flex-col gap-1 pl-4 py-2 border-l-[3px] border-white/80">
              <div className="hero-reviews-stars pb-5">★★★★★</div>
              <div className="hero-reviews-text font-heading">5-Star Google Reviews • Fully Insured • Free Year-Round Storage</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

