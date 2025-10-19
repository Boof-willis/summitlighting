import { useState, useEffect } from 'react';

export default function HeaderRepair() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setMobileMenuOpen(false);
    }
  };

  return (
    <header className={`fixed md:absolute top-0 left-0 right-0 z-[1000] py-4 transition-colors duration-300 ${scrolled ? 'bg-white shadow-md' : 'bg-transparent'} md:bg-transparent md:shadow-none`}
    >
      <nav className="flex justify-between items-center w-full px-8 max-w-[1200px] mx-auto relative z-[1001]">
        <div className="flex items-center gap-4">
          <div className="flex items-center">
            <img
              src="/images/logo/rrlogo.png"
              alt="R&R Solar"
              className={`h-12 w-auto ${scrolled ? '' : 'invert'}`}
            />
          </div>
          <div className="w-[3px] h-6 bg-white/30 hidden md:block"></div>
          <ul className="hidden md:flex list-none gap-8">
            <li>
              <a
                href="#programs"
                onClick={(e) => handleNavClick(e, '#programs')}
                className="text-white font-medium hover:text-[#498dcb] transition-colors"
              >
                How It Works
              </a>
            </li>
            <li>
              <a
                href="#why-us"
                onClick={(e) => handleNavClick(e, '#why-us')}
                className="text-white font-medium hover:text-[#498dcb] transition-colors"
              >
                Why Us
              </a>
            </li>
            <li>
              <a
                href="#faq"
                onClick={(e) => handleNavClick(e, '#faq')}
                className="text-white font-medium hover:text-[#498dcb] transition-colors"
              >
                FAQs
              </a>
            </li>
          </ul>
        </div>
        <div className="flex items-center gap-4">
          <a href="tel:+1-XXX-XXX-XXXX" className="secondary-button !hidden md:!flex">
            Call Now
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
                href="#programs"
                onClick={(e) => handleNavClick(e, '#programs')}
                className="text-gray-900 font-heading font-light text-base hover:text-[#498dcb] transition-colors"
              >
                How It Works
              </a>
            </li>
            <li>
              <a
                href="#why-us"
                onClick={(e) => handleNavClick(e, '#why-us')}
                className="text-gray-900 font-heading font-light text-base hover:text-[#498dcb] transition-colors"
              >
                Why Us
              </a>
            </li>
            <li>
              <a
                href="#faq"
                onClick={(e) => handleNavClick(e, '#faq')}
                className="text-gray-900 font-heading font-light text-base hover:text-[#498dcb] transition-colors"
              >
                FAQs
              </a>
            </li>
            <li>
              <a
                href="tel:+1-XXX-XXX-XXXX"
                className="inline-flex items-center justify-center bg-[#498dcb] text-white py-4 px-12 rounded-full font-heading font-normal text-base hover:bg-[#3a7ab5] transition-colors"
                onClick={() => window.dispatchEvent(new Event('PhoneCallClick'))}
              >
                Call Now
              </a>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
}
