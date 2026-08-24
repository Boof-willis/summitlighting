import { useState, useEffect, useRef } from 'react';

export default function HeaderRepair() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const lastScrollY = useRef(0);
  const scrollHistory = useRef<Array<{ y: number; time: number }>>([]);
  const minScrollDistance = 80; // minimum pixels to scroll in time window
  const scrollTimeWindow = 150; // milliseconds to measure scroll speed

  // Detect mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Show header when mobile menu opens
  useEffect(() => {
    if (mobileMenuOpen && isMobile) {
      setHeaderVisible(true);
    }
  }, [mobileMenuOpen, isMobile]);

  // Scroll handler with fast scroll detection
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const currentTime = Date.now();
      setScrolled(currentScrollY > 50);

      // Only apply scroll hide/show on mobile
      if (isMobile) {
        // Always show header if mobile menu is open
        if (mobileMenuOpen) {
          setHeaderVisible(true);
          scrollHistory.current = [];
        } else if (currentScrollY < 50) {
          // Always show at top of page
          setHeaderVisible(true);
          scrollHistory.current = [];
        } else if (currentScrollY > lastScrollY.current && currentScrollY > 50) {
          // Scrolling down - hide header
          setHeaderVisible(false);
          scrollHistory.current = [];
        } else if (currentScrollY < lastScrollY.current) {
          // Scrolling up - track scroll history
          scrollHistory.current.push({ y: currentScrollY, time: currentTime });
          
          // Keep only recent scroll history (within time window)
          const cutoffTime = currentTime - scrollTimeWindow;
          scrollHistory.current = scrollHistory.current.filter(
            (entry) => entry.time > cutoffTime
          );
          
          // Calculate total scroll distance in the time window
          if (scrollHistory.current.length >= 2) {
            const oldest = scrollHistory.current[0];
            const newest = scrollHistory.current[scrollHistory.current.length - 1];
            const scrollDistance = oldest.y - newest.y; // positive when scrolling up
            
            // Only show header if user scrolled a significant distance quickly
            if (scrollDistance >= minScrollDistance) {
              setHeaderVisible(true);
            }
          }
        }
      } else {
        // Always visible on desktop
        setHeaderVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMobile, mobileMenuOpen]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    const target = document.querySelector(href);
    // Smooth-scroll when the section is on this page; otherwise let the
    // browser follow the absolute link (e.g. /#services from /contact).
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setMobileMenuOpen(false);
    }
  };

  return (
    <header className={`fixed md:absolute top-0 left-0 right-0 z-[1000] py-4 transition-all duration-300 ${scrolled ? 'bg-white shadow-md' : 'bg-transparent'} md:bg-transparent md:shadow-none ${headerVisible ? 'translate-y-0' : '-translate-y-full'}`}
    >
      <nav className="flex justify-between items-center w-full px-8 max-w-[1200px] mx-auto relative z-[1001]">
        <div className="flex items-center gap-6">
          <a href="/" aria-label="Summit Lighting Co. home" className="flex items-center opacity-0 translate-y-5 animate-[fadeInUp_0.8s_ease_0.2s_forwards]">
            <img
              src={(isMobile && (scrolled || mobileMenuOpen))
                ? "https://pub-b90babce61544d61a1c7d67d49d512e4.r2.dev/images/logos/summit%20logo%20black.avif"
                : "https://pub-b90babce61544d61a1c7d67d49d512e4.r2.dev/images/logos/summit%20logo%20white.avif"
              }
              alt="Summit Lighting Co."
              className="h-8 w-auto transition-all duration-300"
            />
          </a>
          <div className="w-[3px] h-6 bg-white/30 hidden md:block opacity-0 translate-y-5 animate-[fadeInUp_0.8s_ease_0.3s_forwards] ml-2"></div>
          <ul className="hidden md:flex list-none gap-8 ml-2">
            <li className="opacity-0 translate-y-5 animate-[fadeInUp_0.8s_ease_0.4s_forwards]">
              <a
                href="/#services"
                onClick={(e) => handleNavClick(e, '#services')}
                className="text-white !font-normal font-heading relative inline-block group"
              >
                Services
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
              </a>
            </li>
            <li className="opacity-0 translate-y-5 animate-[fadeInUp_0.8s_ease_0.5s_forwards]">
              <a
                href="/#programs"
                onClick={(e) => handleNavClick(e, '#programs')}
                className="text-white !font-normal font-heading relative inline-block group"
              >
                How It Works
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
              </a>
            </li>
            <li className="opacity-0 translate-y-5 animate-[fadeInUp_0.8s_ease_0.6s_forwards]">
              <a
                href="/#gallery"
                onClick={(e) => handleNavClick(e, '#gallery')}
                className="text-white !font-normal font-heading relative inline-block group"
              >
                Gallery
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
              </a>
            </li>
            <li className="opacity-0 translate-y-5 animate-[fadeInUp_0.8s_ease_0.7s_forwards]">
              <a
                href="/#faq"
                onClick={(e) => handleNavClick(e, '#faq')}
                className="text-white !font-normal font-heading relative inline-block group"
              >
                FAQs
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
              </a>
            </li>
            <li className="opacity-0 translate-y-5 animate-[fadeInUp_0.8s_ease_0.75s_forwards]">
              <a
                href="/contact"
                className="text-white !font-normal font-heading relative inline-block group"
              >
                Contact
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
              </a>
            </li>
          </ul>
        </div>
        <div className="flex items-center gap-4">
          <a href="tel:+18015988307" className="secondary-button !hidden md:!flex opacity-0 translate-y-5 animate-[fadeInUp_0.8s_ease_0.8s_forwards]">
            Call (801) 598-8307
          </a>
          <button
            className={`md:hidden bg-none border-none cursor-pointer flex items-center justify-start w-10 h-10 relative`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <div 
              className={`h-0.5 w-6 rounded-full transition-all duration-500 absolute ${
                scrolled || mobileMenuOpen ? 'bg-black' : 'bg-white'
              } ${
                mobileMenuOpen ? 'rotate-90 top-1/2 left-[12px] -translate-x-1/2 -translate-y-1/2' : 'top-[calc(50%-3.3px)] left-0 translate-x-0 translate-y-0'
              }`}
            ></div>
            <div 
              className={`h-0.5 rounded-full transition-all duration-500 absolute ${
                scrolled || mobileMenuOpen ? 'bg-black' : 'bg-white'
              } ${
                mobileMenuOpen ? 'w-6 top-1/2 left-[12px] -translate-x-1/2 -translate-y-1/2' : 'w-4 top-[calc(50%+3.3px)] left-0 translate-x-0 translate-y-0'
              }`}
            ></div>
          </button>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      <div 
        className={`md:hidden fixed top-0 left-0 right-0 bg-white shadow-lg overflow-hidden transition-all duration-500 ease-in-out z-[999] ${
          mobileMenuOpen ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="flex flex-col items-center" style={{ marginTop: '88px', paddingTop: '24px' }}>
          <div className="w-[90%] h-px bg-gray-200 mb-6"></div>
          <ul className="flex flex-col list-none gap-6 pb-4 items-center">
            <li>
              <a
                href="/#services"
                onClick={(e) => handleNavClick(e, '#services')}
                className="text-gray-900 font-heading font-light text-base hover:text-[#B07E22] transition-colors"
              >
                Services
              </a>
            </li>
            <li>
              <a
                href="/#programs"
                onClick={(e) => handleNavClick(e, '#programs')}
                className="text-gray-900 font-heading font-light text-base hover:text-[#B07E22] transition-colors"
              >
                How It Works
              </a>
            </li>
            <li>
              <a
                href="/#gallery"
                onClick={(e) => handleNavClick(e, '#gallery')}
                className="text-gray-900 font-heading font-light text-base hover:text-[#B07E22] transition-colors"
              >
                Gallery
              </a>
            </li>
            <li>
              <a
                href="/#faq"
                onClick={(e) => handleNavClick(e, '#faq')}
                className="text-gray-900 font-heading font-light text-base hover:text-[#B07E22] transition-colors"
              >
                FAQs
              </a>
            </li>
            <li>
              <a
                href="/contact"
                className="text-gray-900 font-heading font-light text-base hover:text-[#B07E22] transition-colors"
              >
                Contact
              </a>
            </li>
            <li>
              <a
                href="tel:+18015988307"
                className="inline-flex items-center justify-center bg-[#0B0C0A] text-white py-4 px-12 rounded-full font-heading font-normal text-base hover:bg-[#23291F] transition-colors"
                onClick={() => window.dispatchEvent(new Event('PhoneCallClick'))}
              >
                Call (801) 598-8307
              </a>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
}
