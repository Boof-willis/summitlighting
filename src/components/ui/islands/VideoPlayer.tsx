import { useState, useRef } from 'react';

interface VideoPlayerProps {
  videoSrc: string;
  thumbnailSrc: string;
  alt: string;
}

export default function VideoPlayer({ videoSrc, thumbnailSrc, alt }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePlay = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleEnded = () => {
    setIsPlaying(false);
  };

  return (
    <div className="relative rounded-[16px] overflow-hidden w-full md:w-[408px] h-[245px] flex-shrink-0 group">
      {/* Video Element */}
      <video
        ref={videoRef}
        src={videoSrc}
        className="w-full h-full object-cover"
        onPause={handlePause}
        onEnded={handleEnded}
        controls={isPlaying}
        poster={thumbnailSrc}
      />

      {/* Play Button Overlay */}
      {!isPlaying && (
        <div
          className="absolute inset-0 flex items-center justify-center bg-black/20 cursor-pointer transition-all hover:bg-black/30"
          onClick={handlePlay}
        >
          <div className="w-20 h-20 bg-white/90 rounded-full flex items-center justify-center shadow-2xl transition-transform hover:scale-110">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-10 h-10 text-gray-900 ml-1"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
}

