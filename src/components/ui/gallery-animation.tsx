import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ExpandableGalleryProps {
  images: string[];
  className?: string;
}

const ExpandableGallery: React.FC<ExpandableGalleryProps> = ({ images, className = '' }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [autoExpandedIndex, setAutoExpandedIndex] = useState<number>(0);
  const [currentMobileIndex, setCurrentMobileIndex] = useState<number>(0);
  const [isInView, setIsInView] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const galleryRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const thumbnailContainerRef = useRef<HTMLDivElement>(null);

  // Detect mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Intersection Observer to detect when gallery is in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsInView(entry.isIntersecting);
        });
      },
      { threshold: 0.3 }
    );

    if (galleryRef.current) {
      observer.observe(galleryRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Auto-rotate every 3 seconds when in view and not paused
  useEffect(() => {
    if (isInView && !isPaused && selectedIndex === null) {
      intervalRef.current = setInterval(() => {
        if (isMobile) {
          setCurrentMobileIndex((prev) => (prev + 1) % images.length);
        } else {
          setAutoExpandedIndex((prev) => (prev + 1) % images.length);
        }
      }, 3000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isInView, isPaused, selectedIndex, images.length, isMobile]);

  // Cleanup: restore body scroll when component unmounts
  useEffect(() => {
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedIndex !== null) {
        closeImage();
      }
    };

    if (selectedIndex !== null) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [selectedIndex]);

  // Scroll to center the selected thumbnail on mobile
  useEffect(() => {
    if (isMobile && thumbnailContainerRef.current) {
      const container = thumbnailContainerRef.current;
      const thumbnail = container.children[currentMobileIndex] as HTMLElement;
      if (thumbnail) {
        const containerWidth = container.offsetWidth;
        const thumbnailLeft = thumbnail.offsetLeft;
        const thumbnailWidth = thumbnail.offsetWidth;
        const scrollPosition = thumbnailLeft - (containerWidth / 2) + (thumbnailWidth / 2);
        
        container.scrollTo({
          left: scrollPosition,
          behavior: 'smooth'
        });
      }
    }
  }, [currentMobileIndex, isMobile]);

  const openImage = (index: number) => {
    setSelectedIndex(index);
    setIsPaused(true);
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
  };

  const closeImage = () => {
    setSelectedIndex(null);
    setIsPaused(false);
    // Restore body scroll when modal is closed
    document.body.style.overflow = '';
  };

  const goToNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex + 1) % images.length);
    }
  };

  const goToPrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex - 1 + images.length) % images.length);
    }
  };

  const getFlexValue = (index: number) => {
    // If user is hovering, use hover state
    if (hoveredIndex !== null) {
      return hoveredIndex === index ? 2 : 0.5;
    }
    // If lightbox is open, all images equal
    if (selectedIndex !== null) {
      return 1;
    }
    // Auto-expand the current index
    return autoExpandedIndex === index ? 2 : 0.5;
  };

  const handleMouseEnter = (index: number) => {
    setHoveredIndex(index);
    setIsPaused(true);
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
    setIsPaused(false);
  };

  const handleThumbnailClick = (index: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentMobileIndex(index);
    setIsPaused(true);
    // Resume auto-rotation after 3 seconds
    setTimeout(() => setIsPaused(false), 3000);
  };

  return (
    <div ref={galleryRef} className={className}>
      {/* Mobile Gallery - Main Image + Thumbnails */}
      {isMobile ? (
        <div className="flex flex-col gap-4">
          {/* Main Image */}
          <motion.div
            className="relative w-full aspect-[4/3] rounded-lg overflow-visible cursor-pointer"
            onClick={() => openImage(currentMobileIndex)}
          >
            {/* RGB Glow Layer */}
            <div 
              className="absolute inset-0 rounded-lg -z-10"
              style={{
                background: 'radial-gradient(circle, rgba(255, 0, 150, 0.5) 0%, rgba(0, 255, 200, 0.4) 50%, rgba(150, 0, 255, 0.4) 100%)',
                filter: 'blur(40px)',
                transform: 'scale(1.3)'
              }}
            />
            <div className="relative w-full h-full rounded-lg overflow-hidden z-30">
              <motion.img
                key={currentMobileIndex}
                src={images[currentMobileIndex]}
                alt={`Gallery image ${currentMobileIndex + 1}`}
                className="w-full h-full object-cover relative"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </motion.div>

          {/* Thumbnail Strip */}
          <div
            ref={thumbnailContainerRef}
            className="flex gap-2 overflow-x-auto scrollbar-hide py-2 px-1"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch'
            }}
          >
            {images.map((image, index) => (
              <motion.div
                key={index}
                className={`gallery-thumbnail relative flex-shrink-0 w-20 h-20 rounded-md overflow-hidden cursor-pointer transition-all ${
                  currentMobileIndex === index ? 'ring-2 ring-blue-500 ring-offset-2' : 'opacity-60'
                }`}
                onClick={(e) => handleThumbnailClick(index, e)}
              >
                <img
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </motion.div>
            ))}
          </div>
        </div>
      ) : (
        /* Desktop Gallery - Horizontal Expandable */
        <div className="flex gap-2 h-96 w-full">
          {images.map((image, index) => (
            <motion.div
              key={index}
              className="relative cursor-pointer overflow-visible rounded-md"
              style={{ flex: 1 }}
              animate={{ flex: getFlexValue(index) }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={handleMouseLeave}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                openImage(index);
              }}
            >
              {/* RGB Glow Layer */}
              <div 
                className="absolute inset-0 rounded-md -z-10"
                style={{
                  background: 'radial-gradient(circle, rgba(255, 0, 150, 0.5) 0%, rgba(0, 255, 200, 0.4) 50%, rgba(150, 0, 255, 0.4) 100%)',
                  filter: 'blur(40px)',
                  transform: 'scale(1.3)'
                }}
              />
              <div className="relative w-full h-full rounded-md overflow-hidden z-30">
                <img
                  src={image}
                  alt={`Gallery image ${index + 1}`}
                  className="w-full h-full object-cover relative"
                />
              </div>
              <motion.div
                className="absolute inset-0 bg-black z-20"
                initial={{ opacity: 0 }}
                animate={{ 
                  opacity: (hoveredIndex === index || autoExpandedIndex === index) && selectedIndex === null ? 0 : 0.3 
                }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>
          ))}
        </div>
      )}

      {/* Expanded View Modal - Full Screen Popup (Both Mobile & Desktop) */}
      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black"
            style={{ 
              position: 'fixed', 
              top: 0, 
              left: 0, 
              right: 0, 
              bottom: 0,
              width: '100vw',
              height: '100vh'
            }}
            onClick={closeImage}
          >
            {/* Close Button (X) - Top Right */}
            <button
              className="absolute top-6 right-6 z-20 text-white hover:text-gray-300 transition-colors bg-black bg-opacity-50 rounded-full p-3 hover:bg-opacity-75"
              onClick={(e) => {
                e.stopPropagation();
                closeImage();
              }}
              aria-label="Close gallery"
            >
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Previous Button */}
            {images.length > 1 && (
              <button
                className="absolute left-6 z-20 text-white hover:text-gray-300 transition-colors bg-black bg-opacity-50 rounded-full p-4 hover:bg-opacity-75"
                onClick={(e) => {
                  e.stopPropagation();
                  goToPrev(e);
                }}
                aria-label="Previous image"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
            )}

            {/* Image Container - Clicking here won't close the modal */}
            <motion.div
              className="relative w-full h-full flex items-center justify-center p-8"
              onClick={(e) => e.stopPropagation()}
            >
              {/* RGB Glow Layer */}
              <div 
                className="absolute inset-0 -z-10"
                style={{
                  background: 'radial-gradient(circle, rgba(255, 0, 150, 0.6) 0%, rgba(0, 255, 200, 0.5) 50%, rgba(150, 0, 255, 0.5) 100%)',
                  filter: 'blur(50px)',
                  transform: 'scale(1.4)'
                }}
              />
              <motion.img
                key={selectedIndex}
                src={images[selectedIndex]}
                alt={`Gallery image ${selectedIndex + 1}`}
                className="max-w-full max-h-full object-contain relative z-30"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>

            {/* Next Button */}
            {images.length > 1 && (
              <button
                className="absolute right-6 z-20 text-white hover:text-gray-300 transition-colors bg-black bg-opacity-50 rounded-full p-4 hover:bg-opacity-75"
                onClick={(e) => {
                  e.stopPropagation();
                  goToNext(e);
                }}
                aria-label="Next image"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            )}

            {/* Image Counter */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20 text-white text-sm bg-black bg-opacity-70 px-4 py-2 rounded-full">
              {selectedIndex + 1} / {images.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style dangerouslySetInnerHTML={{
        __html: `
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          /* Prevent any overlay or backdrop on thumbnail clicks */
          .gallery-thumbnail {
            -webkit-tap-highlight-color: transparent;
            -webkit-touch-callout: none;
            -webkit-user-select: none;
            user-select: none;
            outline: none !important;
            box-shadow: none !important;
          }
          .gallery-thumbnail:active,
          .gallery-thumbnail:focus,
          .gallery-thumbnail:focus-visible,
          .gallery-thumbnail:focus-within {
            outline: none !important;
            box-shadow: none !important;
            background: none !important;
            border: none !important;
          }
          .gallery-thumbnail * {
            -webkit-tap-highlight-color: transparent;
          }
        `
      }} />
    </div>
  );
};

export default ExpandableGallery;
