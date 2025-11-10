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
        controls
        poster={thumbnailSrc}
      />
    </div>
  );
}

