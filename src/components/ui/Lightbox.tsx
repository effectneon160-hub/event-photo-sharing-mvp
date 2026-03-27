import React, { useEffect } from 'react';
import { XIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { Photo } from '../../types';
interface LightboxProps {
  photos: Photo[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}
export function Lightbox({
  photos,
  currentIndex,
  isOpen,
  onClose,
  onNext,
  onPrev
}: LightboxProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNext();
      if (e.key === 'ArrowLeft') onPrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, onNext, onPrev]);
  if (!isOpen || photos.length === 0) return null;
  const currentPhoto = photos[currentIndex];
  const formatTimeAgo = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const minutes = Math.floor(diff / 60000);
    if (minutes < 60) return `${minutes} min ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    return `${Math.floor(hours / 24)} day${Math.floor(hours / 24) > 1 ? 's' : ''} ago`;
  };
  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex flex-col animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex justify-between items-center p-4 text-white/80">
        <span className="text-sm font-medium">
          {currentIndex + 1} of {photos.length}
        </span>
        <button
          onClick={onClose}
          className="p-2 hover:bg-white/10 rounded-full transition-colors"
          aria-label="Close">
          
          <XIcon className="w-6 h-6" />
        </button>
      </div>

      {/* Main Image Area */}
      <div className="flex-1 relative flex items-center justify-center overflow-hidden px-12">
        <button
          onClick={onPrev}
          className="absolute left-4 p-3 text-white/50 hover:text-white hover:bg-white/10 rounded-full transition-all"
          aria-label="Previous photo">
          
          <ChevronLeftIcon className="w-8 h-8" />
        </button>

        <img
          src={currentPhoto.url}
          alt={`Photo by ${currentPhoto.uploaderName || 'Anonymous'}`}
          className="max-h-full max-w-full object-contain cursor-zoom-in active:scale-150 transition-transform duration-300" />
        

        <button
          onClick={onNext}
          className="absolute right-4 p-3 text-white/50 hover:text-white hover:bg-white/10 rounded-full transition-all"
          aria-label="Next photo">
          
          <ChevronRightIcon className="w-8 h-8" />
        </button>
      </div>

      {/* Footer */}
      <div className="p-6 bg-gradient-to-t from-black/80 to-transparent">
        <p className="text-white font-medium text-lg">
          {currentPhoto.uploaderName || 'Anonymous'}
        </p>
        <p className="text-white/60 text-sm mt-1">
          {formatTimeAgo(currentPhoto.uploadedAt)}
        </p>
      </div>
    </div>);

}