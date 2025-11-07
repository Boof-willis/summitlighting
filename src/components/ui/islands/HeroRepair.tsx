import { useEffect, useRef } from 'react';

export default function HeroRepair() {
  const parallaxRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

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

  // Split text into characters for animation
  const wrapCharacters = (text: string) => {
    let charIndex = 0;
    const baseDelay = 0.5;
    const charDelay = 0.04;

    return text.split(' ').map((word, wordIndex) => (
      <span key={wordIndex} className="inline-block whitespace-nowrap mr-[18px]">
        {word.split('').map((char) => {
          const delay = baseDelay + charIndex * charDelay;
          charIndex++;
          return (
            <span key={charIndex} style={{ animationDelay: `${delay}s` }}>
              {char}
            </span>
          );
        })}
      </span>
    ));
  };

  return (
    <section className="relative h-[95vh] md:h-screen min-h-[700px] flex items-center justify-center overflow-hidden">
      {/* Parallax Container - moves background and content together */}
      <div ref={parallaxRef} className="absolute inset-0 w-full h-full" style={{ willChange: 'transform' }}>
        {/* Mobile Background Image */}
        <div
          className="md:hidden absolute top-0 left-0 right-0 bottom-0 w-full h-full z-[1] opacity-0 scale-110"
          style={{
            backgroundImage:
              "url('https://pub-b90babce61544d61a1c7d67d49d512e4.r2.dev/images/Christmas%20Lights%20Hero.avif')",
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'left 30%',
            animation: 'heroBackgroundZoomOut 3s cubic-bezier(0.12, 0.23, 0.5, 1) forwards',
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
        
        {/* Gradient Overlay - Desktop - Dark to transparent left to right for text legibility */}
        <div className="hidden md:block absolute top-0 left-0 right-0 bottom-0 w-full h-full z-[1]"
          style={{
            background: 'linear-gradient(to right, rgba(0, 0, 0, 0.65) 0%, rgba(0, 0, 0, 0.5) 30%, rgba(0, 0, 0, 0.3) 50%, transparent 70%)',
          }}
        />
      </div>

      {/* Hero Content */}
      <div ref={contentRef} className="relative z-[2] max-w-[1200px] w-full px-8" style={{ willChange: 'transform' }}>
        <div className="relative w-full max-w-[800px] text-left">
          {/* Preheading Badge */}
          <div className="inline-flex items-center gap-2.5 mb-8 font-heading text-base font-normal leading-6 tracking-[0.1em] text-white/95 opacity-0 translate-y-5 animate-[fadeInUp_0.8s_ease_0.3s_forwards]">
            <span className="w-14 h-0.5 bg-white/80 rounded-sm"></span>
            Utah County Christmas Lights
          </div>

          {/* H1 with Character Reveal */}
          <h1 className="hero-title font-heading text-5xl md:text-7xl font-medium leading-[1.2] text-white tracking-tight mb-7">
            {wrapCharacters('Professional Christmas')}
            <br />
            {wrapCharacters('Light Installation')}
            <br />
            {wrapCharacters('in Utah County')}
          </h1>

          {/* Subheading */}
          <h2 className="font-heading text-base leading-6 text-white/90 font-normal mb-10 max-w-[620px] opacity-0 translate-y-5 animate-[fadeInUp_0.8s_ease_0.9s_forwards]">
            We Install, Maintain, Store & Return Your Lights Every Year
          </h2>

          {/* Buttons */}
          <div className="flex gap-4 flex-wrap mb-16 opacity-0 translate-y-5 animate-[fadeInUp_0.8s_ease_1.1s_forwards]">
            <a 
              href="#value-proposition" 
              className="cta-button hero-cta-button"
            >
              Get Your Free Quote
            </a>
            <a href="#gallery" className="secondary-button hero-cta-button">
              View Our Work
            </a>
          </div>

          {/* Trust Indicators */}
          <div className="mt-8 opacity-0 translate-y-5 animate-[fadeInUp_0.8s_ease_1.3s_forwards]">
            <div className="flex flex-col gap-1 pl-4 py-2 border-l-[3px] border-white/80">
              <div className="hero-reviews-stars pb-5">★★★★★</div>
              <div className="hero-reviews-text font-heading">5-Star Google Reviews • Professional Team • Free Year-Round Storage</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

