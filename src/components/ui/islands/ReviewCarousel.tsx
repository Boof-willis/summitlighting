import { useState, useEffect, useRef } from 'react';

interface Review {
  text: string;
  author: string;
  image: string;
}

const reviews: Review[] = [
  {
    text: "Holiday lights were installed and look awesome! I liked that they had color options to choose from and were really easy to work with. If you are looking for Christmas light installers these guys nailed it.",
    author: 'Brandon Anderson',
    image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
  },
  {
    text: "Love the lights and the pricing! They work quick and do a great job. Our home has never looked more festive!!",
    author: 'Aaron Ludwig',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
  },
  {
    text: "Great company!! Did a excellent job on my home.",
    author: 'Corey Higgins',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
  },
  {
    text: "These guys are awesome! Very affordable and professional. HIGHLY RECOMMEND!",
    author: 'Taylor Jones',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
  },
];

export default function ReviewCarousel() {
  const [currentReview, setCurrentReview] = useState(0);
  const [isInView, setIsInView] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const manualClickRef = useRef(false);
  const restartTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const isScrollingProgrammatically = useRef(false);
  const minSwipeDistance = 50;

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsInView(entry.isIntersecting);
        });
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isInView && !manualClickRef.current) {
      startCarousel();
    } else {
      stopCarousel();
    }

    return () => stopCarousel();
  }, [isInView]);

  // Sync scroll position on mobile when review changes programmatically
  useEffect(() => {
    if (scrollContainerRef.current && !manualClickRef.current) {
      const container = scrollContainerRef.current;
      const containerWidth = container.clientWidth;
      isScrollingProgrammatically.current = true;
      container.scrollTo({
        left: currentReview * containerWidth,
        behavior: 'smooth',
      });
      setTimeout(() => {
        isScrollingProgrammatically.current = false;
      }, 500);
    }
  }, [currentReview]);

  const startCarousel = () => {
    stopCarousel();
    
    if (manualClickRef.current) {
      return;
    }

    intervalRef.current = setInterval(() => {
      setCurrentReview((prev) => (prev + 1) % reviews.length);
    }, 4000);
  };

  const stopCarousel = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (restartTimeoutRef.current) {
      clearTimeout(restartTimeoutRef.current);
      restartTimeoutRef.current = null;
    }
  };

  const handleProfileClick = (index: number) => {
    if (index === currentReview) {
      return;
    }

    stopCarousel();
    manualClickRef.current = true;
    navigateToReview(index);
    
    if (isInView) {
      restartTimeoutRef.current = setTimeout(() => {
        manualClickRef.current = false;
        if (isInView) {
          startCarousel();
        }
      }, 4000);
    }
  };

  const navigateToReview = (index: number) => {
    setCurrentReview(index);
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const containerWidth = container.clientWidth;
      isScrollingProgrammatically.current = true;
      container.scrollTo({
        left: index * containerWidth,
        behavior: 'smooth',
      });
      setTimeout(() => {
        isScrollingProgrammatically.current = false;
      }, 500);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    stopCarousel();
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;

    const distance = touchStartX.current - touchEndX.current;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && currentReview < reviews.length - 1) {
      manualClickRef.current = true;
      navigateToReview(currentReview + 1);
      if (isInView) {
        restartTimeoutRef.current = setTimeout(() => {
          manualClickRef.current = false;
          if (isInView) {
            startCarousel();
          }
        }, 4000);
      }
    } else if (isRightSwipe && currentReview > 0) {
      manualClickRef.current = true;
      navigateToReview(currentReview - 1);
      if (isInView) {
        restartTimeoutRef.current = setTimeout(() => {
          manualClickRef.current = false;
          if (isInView) {
            startCarousel();
          }
        }, 4000);
      }
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  const handleScroll = () => {
    if (!scrollContainerRef.current || isScrollingProgrammatically.current) return;
    
    const container = scrollContainerRef.current;
    const scrollLeft = container.scrollLeft;
    const containerWidth = container.clientWidth;
    const reviewIndex = Math.round(scrollLeft / containerWidth);
    
    if (reviewIndex !== currentReview && reviewIndex >= 0 && reviewIndex < reviews.length) {
      setCurrentReview(reviewIndex);
      manualClickRef.current = true;
      stopCarousel();
      
      if (isInView) {
        restartTimeoutRef.current = setTimeout(() => {
          manualClickRef.current = false;
          if (isInView) {
            startCarousel();
          }
        }, 4000);
      }
    }
  };

  return (
    <div
      ref={sectionRef}
      className="max-w-[800px] mx-auto text-center relative"
      onMouseEnter={stopCarousel}
      onMouseLeave={() => {
        if (isInView && !manualClickRef.current) {
          startCarousel();
        }
      }}
    >
      {/* Desktop View - Single Review */}
      <div className="hidden md:block">
        {/* Stars */}
        <div className="mb-8">
          {[...Array(5)].map((_, i) => (
            <span key={i} className="text-yellow-400 text-2xl mx-0.5">
              ★
            </span>
          ))}
        </div>

        {/* Review Text */}
        <div className="mb-8">
          <p className="text-2xl leading-relaxed text-gray-800 font-normal transition-opacity duration-500 min-h-[80px]">
            "{reviews[currentReview].text}"
          </p>
        </div>

        {/* Author */}
        <div className="mb-8">
          <span className="text-base text-gray-800 font-medium">{reviews[currentReview].author}</span>
        </div>
      </div>

      {/* Mobile View - Scrollable Reviews */}
      <div
        ref={scrollContainerRef}
        className="md:hidden overflow-x-auto snap-x snap-mandatory scrollbar-hide"
        style={{
          scrollSnapType: 'x mandatory',
          WebkitOverflowScrolling: 'touch',
        }}
        onScroll={handleScroll}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="flex">
          {reviews.map((review, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-full px-4 snap-center"
              style={{ minWidth: '100%' }}
            >
              {/* Stars */}
              <div className="mb-8">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400 text-2xl mx-0.5">
                    ★
                  </span>
                ))}
              </div>

              {/* Review Text */}
              <div className="mb-8">
                <p className="text-2xl leading-relaxed text-gray-800 font-normal min-h-[80px]">
                  "{review.text}"
                </p>
              </div>

              {/* Author */}
              <div className="mb-8">
                <span className="text-base text-gray-800 font-medium">{review.author}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dots Indicator */}
      <div className="flex justify-center gap-2 items-center">
        {reviews.map((review, index) => (
          <button
            key={index}
            type="button"
            className={`rounded-full transition-all duration-300 cursor-pointer ${
              currentReview === index 
                ? 'w-3 h-3 bg-gray-800' 
                : 'w-2.5 h-2.5 bg-gray-400 hover:bg-gray-500'
            }`}
            onClick={() => handleProfileClick(index)}
            aria-label={`Go to review ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

