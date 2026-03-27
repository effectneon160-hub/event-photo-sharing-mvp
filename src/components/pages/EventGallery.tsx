import React, { useEffect, useState, useRef, lazy, memo } from 'react';
import { Layout } from '../ui/Layout';
import { Button } from '../ui/Button';
import { Lightbox } from '../ui/Lightbox';
import { ProgressBar } from '../ui/ProgressBar';
import { useToast } from '../ui/Toast';
import { Input } from '../ui/Input';
import {
  CameraIcon,
  UploadCloudIcon,
  Image as ImageIcon,
  XIcon,
  LockIcon,
  RefreshCwIcon,
  ArrowDownIcon,
  ArrowUpIcon } from
'lucide-react';
import { useApp } from '../../AppContext';
import { PageType } from '../../types';
interface EventGalleryProps {
  navigate: (page: PageType) => void;
  eventId: string | null;
}
export function EventGallery({ navigate, eventId }: EventGalleryProps) {
  const { getEvent, getEventPhotos, addPhoto } = useApp();
  const { addToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [uploaderName, setUploaderName] = useState('');
  const [lightboxIndex, setLightboxIndex] = useState(-1);
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const event = eventId ? getEvent(eventId) : null;
  const photos = eventId ? getEventPhotos(eventId) : [];
  // Handle password protection
  useEffect(() => {
    if (event && !event.password) {
      setIsAuthenticated(true);
    } else if (event && event.password) {
      setIsAuthenticated(false);
    }
  }, [event]);
  if (!event) {
    return (
      <Layout navigate={navigate} currentPage="event">
        <div className="p-8 text-center">Event not found.</div>
      </Layout>);

  }
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === event.password) {
      setIsAuthenticated(true);
      setPasswordError('');
      addToast('Access granted', 'success');
    } else {
      setPasswordError('Incorrect password');
      addToast('Incorrect password', 'error');
    }
  };
  if (!isAuthenticated) {
    return (
      <Layout navigate={navigate} showNav={false} currentPage="event">
        <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-50">
          <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mb-6 shadow-inner">
            <LockIcon className="w-10 h-10 text-indigo-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2 text-center">
            {event.title}
          </h1>
          <p className="text-gray-600 mb-8 text-center">
            This event is password protected.
          </p>

          <form
            onSubmit={handlePasswordSubmit}
            className="w-full max-w-sm space-y-4">
            
            <Input
              type="password"
              placeholder="Enter event password"
              value={passwordInput}
              onChange={(e) => {
                setPasswordInput(e.target.value);
                setPasswordError('');
              }}
              error={passwordError}
              autoFocus />
            
            <Button type="submit" size="lg" fullWidth className="shadow-md">
              Unlock Gallery
            </Button>
          </form>
        </div>
      </Layout>);

  }
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      // Limit to 5 files at a time for the prototype
      const selectedFiles = files.slice(0, 5);
      const urls = selectedFiles.map((f) => URL.createObjectURL(f));
      setPreviewImages(urls);
      if (files.length > 5) {
        addToast('Limited to 5 photos per upload in demo', 'info');
      }
    }
  };
  const handleUpload = () => {
    if (previewImages.length > 0 && eventId) {
      setIsUploading(true);
      setUploadProgress(0);
      // Simulate progress
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 10;
        });
      }, 200);
      // Complete upload
      setTimeout(() => {
        clearInterval(interval);
        previewImages.forEach((url) => {
          addPhoto({
            eventId,
            url,
            uploaderName: uploaderName || 'Anonymous',
            width: 800,
            height: Math.floor(Math.random() * 400) + 600 // Random aspect ratio
          });
        });
        setPreviewImages([]);
        setUploaderName('');
        setIsUploading(false);
        setUploadProgress(0);
        addToast(
          `Successfully uploaded ${previewImages.length} photo(s)!`,
          'success'
        );
        // Scroll to top to see new photos
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      }, 2500);
    }
  };
  const cancelUpload = () => {
    setPreviewImages([]);
    setUploaderName('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      addToast('Gallery updated', 'success');
    }, 1000);
  };
  const sortedPhotos = [...photos].sort((a, b) => {
    if (sortOrder === 'newest') return b.uploadedAt - a.uploadedAt;
    return a.uploadedAt - b.uploadedAt;
  });
  // Format time ago for thumbnails
  const formatTimeAgoShort = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h`;
    return `${Math.floor(hours / 24)}d`;
  };
  return (
    <Layout navigate={navigate} showNav={false} currentPage="event">
      {/* Event Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        {event.coverImage &&
        <div className="w-full h-32 relative">
            <img
            src={event.coverImage}
            alt="Cover"
            className="w-full h-full object-cover" />
          
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          </div>
        }
        <div
          className={`px-4 py-4 ${event.coverImage ? '-mt-12 relative z-10' : ''}`}>
          
          <div className="flex justify-between items-end mb-2">
            <h1
              className={`text-2xl font-extrabold ${event.coverImage ? 'text-white drop-shadow-md' : 'text-gray-900'}`}>
              
              {event.title}
            </h1>
            <div className="flex items-center gap-1.5 bg-green-50 px-2 py-1 rounded-full border border-green-200 shadow-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-[10px] font-bold text-green-700 uppercase tracking-wider">
                Live
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between mt-3">
            <p className="text-sm font-medium text-gray-500">
              {photos.length} {photos.length === 1 ? 'photo' : 'photos'}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() =>
                setSortOrder(sortOrder === 'newest' ? 'oldest' : 'newest')
                }
                className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-md transition-colors flex items-center gap-1 text-xs font-medium">
                
                {sortOrder === 'newest' ?
                <ArrowDownIcon className="w-3 h-3" /> :

                <ArrowUpIcon className="w-3 h-3" />
                }
                {sortOrder === 'newest' ? 'Newest' : 'Oldest'}
              </button>
              <button
                onClick={handleRefresh}
                className={`p-1.5 text-gray-500 hover:bg-gray-100 rounded-md transition-colors ${isRefreshing ? 'animate-spin text-indigo-600' : ''}`}>
                
                <RefreshCwIcon className="w-4 h-4" />
              </button>
            </div>
          </div>

          {event.description && !event.coverImage &&
          <p className="text-gray-600 mt-3 text-sm leading-relaxed bg-gray-50 p-3 rounded-xl border border-gray-100">
              {event.description}
            </p>
          }
        </div>
      </div>

      {/* Photo Grid (Masonry using CSS columns) */}
      <div className="p-2 pb-32 min-h-[50vh] bg-gray-100">
        {photos.length === 0 ?
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center text-gray-500">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm border border-gray-200">
              <ImageIcon className="w-12 h-12 text-gray-300" />
            </div>
            <p className="text-xl font-bold text-gray-900">Gallery is empty</p>
            <p className="text-sm mt-2 max-w-xs">
              Be the first to share a memory! Tap the button below to start.
            </p>
          </div> :

        <div className="columns-2 sm:columns-3 gap-2 space-y-2">
            {sortedPhotos.map((photo, index) =>
          <div
            key={photo.id}
            className="relative group bg-gray-200 rounded-xl overflow-hidden break-inside-avoid cursor-zoom-in shadow-sm hover:shadow-md transition-all duration-300"
            onClick={() =>
            setLightboxIndex(photos.findIndex((p) => p.id === photo.id))
            }>
            
                <img
              src={photo.url}
              alt="Event moment"
              className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy" />
            
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                {/* Always show uploader info on mobile, hover on desktop */}
                <div className="absolute bottom-0 left-0 right-0 p-2.5 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-t from-black/80 to-transparent">
                  <p className="text-white text-xs font-medium truncate drop-shadow-md">
                    {photo.uploaderName || 'Anonymous'}
                  </p>
                  <p className="text-white/70 text-[10px] drop-shadow-md">
                    {formatTimeAgoShort(photo.uploadedAt)}
                  </p>
                </div>
              </div>
          )}
          </div>
        }
      </div>

      {/* Upload FAB - Prominent and impossible to miss */}
      {!previewImages.length &&
      <div className="fixed bottom-6 left-0 right-0 flex justify-center z-20 pointer-events-none px-4">
          <div className="pointer-events-auto w-full max-w-sm">
            <Button
            size="lg"
            fullWidth
            className="rounded-full shadow-2xl py-4 flex items-center justify-center gap-3 text-lg font-extrabold bg-indigo-600 hover:bg-indigo-700 hover:scale-105 transition-all duration-300 border-4 border-white"
            onClick={() => fileInputRef.current?.click()}>
            
              <CameraIcon className="w-7 h-7" />
              Add Photos
            </Button>
          </div>
        </div>
      }

      {/* Hidden File Input (Multiple) */}
      <input
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileSelect} />
      

      {/* Upload Preview Modal */}
      {previewImages.length > 0 &&
      <div className="fixed inset-0 bg-black/95 z-50 flex flex-col animate-in slide-in-from-bottom-full duration-300">
          <div className="flex justify-between items-center p-4 text-white">
            <button
            onClick={cancelUpload}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
            disabled={isUploading}>
            
              <XIcon className="w-6 h-6" />
            </button>
            <span className="font-bold text-lg">
              Upload {previewImages.length}{' '}
              {previewImages.length === 1 ? 'Photo' : 'Photos'}
            </span>
            <div className="w-10"></div> {/* Spacer */}
          </div>

          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
            {previewImages.map((url, idx) =>
          <div
            key={idx}
            className="relative rounded-xl overflow-hidden bg-gray-900 border border-gray-800 shadow-lg">
            
                <img
              src={url}
              alt={`Preview ${idx + 1}`}
              className="w-full h-48 object-cover" />
            
                <div className="absolute top-2 right-2 bg-black/60 text-white text-xs font-bold px-2 py-1 rounded-md backdrop-blur-sm">
                  {idx + 1} / {previewImages.length}
                </div>
              </div>
          )}
          </div>

          <div className="bg-white rounded-t-3xl p-6 space-y-5 shadow-[0_-10px_40px_rgba(0,0,0,0.3)]">
            {!isUploading ?
          <>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Who is uploading?
                  </label>
                  <input
                type="text"
                placeholder="Your Name (Optional)"
                className="w-full px-4 py-3.5 bg-gray-100 border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-lg"
                value={uploaderName}
                onChange={(e) => setUploaderName(e.target.value)} />
              
                </div>
                <Button
              size="lg"
              fullWidth
              onClick={handleUpload}
              className="py-4 text-lg shadow-xl">
              
                  <UploadCloudIcon className="w-6 h-6 mr-2" /> Share to Gallery
                </Button>
              </> :

          <div className="py-4 space-y-4">
                <h3 className="text-center font-bold text-gray-900 text-lg">
                  Uploading Photos...
                </h3>
                <ProgressBar progress={uploadProgress} showLabel size="md" />
                <p className="text-center text-sm text-gray-500">
                  Please keep this screen open
                </p>
              </div>
          }
          </div>
        </div>
      }

      {/* Lightbox */}
      <Lightbox
        photos={photos}
        currentIndex={lightboxIndex}
        isOpen={lightboxIndex !== -1}
        onClose={() => setLightboxIndex(-1)}
        onNext={() => setLightboxIndex((prev) => (prev + 1) % photos.length)}
        onPrev={() =>
        setLightboxIndex((prev) => (prev - 1 + photos.length) % photos.length)
        } />
      
    </Layout>);

}