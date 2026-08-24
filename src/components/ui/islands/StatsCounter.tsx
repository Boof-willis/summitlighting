import { useEffect, useRef, useState } from 'react';

interface StatItemProps {
  number: string;
  label: string;
}

function StatItem({ number, label }: StatItemProps) {
  // Server-render the final value so crawlers and no-JS visitors see real
  // numbers; the count-up animation replaces it once the island hydrates.
  const [displayNumber, setDisplayNumber] = useState(number);
  const [hasAnimated, setHasAnimated] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true);
            animateCounter();
          }
        });
      },
      { threshold: 0.5 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [hasAnimated]);

  const animateCounter = () => {
    const target = parseInt(number.replace(/[^\d]/g, ''));
    const duration = 1200;
    const increment = target / (duration / 16);
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }

      let displayValue = Math.floor(current).toLocaleString();
      if (number.includes('+')) {
        displayValue += '+';
      } else if (number.includes('%')) {
        displayValue += '%';
      }

      setDisplayNumber(displayValue);
    }, 16);
  };

  return (
    <div ref={elementRef} className="text-left pt-8 md:pt-12 relative border-t-2 border-gray-300">
      <div
        className={`font-heading text-[40px] md:text-5xl font-medium text-gray-800 leading-none mb-3 transition-all duration-600 ${
          hasAnimated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
        }`}
      >
        {displayNumber}
      </div>
      <div className="text-[14px] md:text-[16px] text-gray-800 font-normal leading-snug">{label}</div>
    </div>
  );
}

export default function StatsCounter() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12 md:gap-12">
      <StatItem number="5" label="Stars on every Google review" />
      <StatItem number="4+" label="Years lighting Utah County homes" />
      <StatItem number="100%" label="Lights provided, stored & maintained by us" />
      <StatItem number="0" label="Ladders, cords, or storage bins for you" />
    </div>
  );
}

