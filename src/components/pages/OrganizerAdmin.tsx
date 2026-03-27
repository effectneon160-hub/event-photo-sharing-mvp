import React, { useState } from 'react';
import { Layout } from '../ui/Layout';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { ProgressBar } from '../ui/ProgressBar';
import { useToast } from '../ui/Toast';
import { QRCode } from '../ui/QRCode';
import { useApp } from '../../AppContext';
import { PageType } from '../../types';
import {
  Trash2Icon,
  UsersIcon,
  Image as ImageIcon,
  SettingsIcon,
  ExternalLinkIcon,
  DownloadIcon,
  HardDriveIcon,
  EyeIcon,
  CheckSquareIcon,
  SquareIcon,
  CopyIcon } from
'lucide-react';
interface OrganizerAdminProps {
  navigate: (page: PageType) => void;
  eventId: string | null;
}
export function OrganizerAdmin({ navigate, eventId }: OrganizerAdminProps) {
  const { getEvent, getEventPhotos, deletePhoto, getEventStats, updateEvent } =
  useApp();
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState<
    'overview' | 'photos' | 'settings'>(
    'overview');
  const [selectedPhotos, setSelectedPhotos] = useState<Set<string>>(new Set());
  const [isDownloading, setIsDownloading] = useState(false);
  const event = eventId ? getEvent(eventId) : null;
  const photos = eventId ? getEventPhotos(eventId) : [];
  const stats = eventId ?
  getEventStats(eventId) :
  {
    photoCount: 0,
    contributorCount: 0,
    storageUsed: 0
  };
  if (!event) {
    return (
      <Layout navigate={navigate} currentPage="organizer-admin">
        <div className="p-8 text-center flex flex-col items-center justify-center min-h-[60vh]">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <SettingsIcon className="w-8 h-8 text-gray-400" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            No Event Selected
          </h2>
          <p className="text-gray-500 mb-6 max-w-xs">
            Please select an event from the platform admin or create a new one.
          </p>
          <Button onClick={() => navigate('landing')}>Go to Home</Button>
        </div>
      </Layout>);

  }
  const eventUrl = `https://snapshare.app/e/${event.id}`;
  const handleCopyLink = () => {
    navigator.clipboard.writeText(eventUrl);
    addToast('Event link copied!', 'success');
  };
  const handleDownloadAll = () => {
    setIsDownloading(true);
    addToast('Preparing ZIP file...', 'info');
    setTimeout(() => {
      setIsDownloading(false);
      addToast('Download complete!', 'success');
    }, 2000);
  };
  const togglePhotoSelection = (id: string) => {
    const newSelection = new Set(selectedPhotos);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedPhotos(newSelection);
  };
  const selectAllPhotos = () => {
    if (selectedPhotos.size === photos.length) {
      setSelectedPhotos(new Set());
    } else {
      setSelectedPhotos(new Set(photos.map((p) => p.id)));
    }
  };
  const deleteSelectedPhotos = () => {
    if (selectedPhotos.size === 0) return;
    // In a real app we'd use a custom modal, using confirm for prototype speed
    if (window.confirm(`Delete ${selectedPhotos.size} photos permanently?`)) {
      selectedPhotos.forEach((id) => deletePhoto(id));
      setSelectedPhotos(new Set());
      addToast(`Deleted ${selectedPhotos.size} photos`, 'success');
    }
  };
  const toggleSetting = (setting: 'moderationEnabled' | 'status') => {
    if (setting === 'status') {
      updateEvent(event.id, {
        status: event.status === 'active' ? 'ended' : 'active'
      });
      addToast(
        `Event ${event.status === 'active' ? 'ended' : 'reactivated'}`,
        'success'
      );
    } else {
      updateEvent(event.id, {
        [setting]: !event[setting]
      });
      addToast('Settings updated', 'success');
    }
  };
  // Calculate storage limit based on package
  const storageLimit =
  event.packageType === 'basic' ?
  250 :
  event.packageType === 'standard' ?
  2500 :
  10000; // MB
  const storagePercent = Math.min(stats.storageUsed / storageLimit * 100, 100);
  return (
    <Layout navigate={navigate} title="Dashboard" currentPage="organizer-admin">
      {/* Event Header Card */}
      <div className="bg-white border-b border-gray-200 px-4 py-6 shadow-sm">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900 mb-1">
              {event.title}
            </h1>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-500">
                {new Date(event.date).toLocaleDateString()}
              </span>
              <span className="text-gray-300">•</span>
              <span
                className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${event.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                
                {event.status || 'Active'}
              </span>
              <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider">
                {event.packageType}
              </span>
            </div>
          </div>
          <div
            className="w-12 h-12 bg-gray-100 rounded-lg p-1 border border-gray-200 shadow-sm cursor-pointer hover:scale-105 transition-transform"
            onClick={() => navigate('confirmation')}>
            
            <QRCode value={eventUrl} size={40} />
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => navigate('event')}>
            
            <ExternalLinkIcon className="w-4 h-4 mr-2" /> View Gallery
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={handleCopyLink}>
            
            <CopyIcon className="w-4 h-4 mr-2" /> Copy Link
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 bg-white sticky top-[64px] z-20">
        {[
        {
          id: 'overview',
          label: 'Overview'
        },
        {
          id: 'photos',
          label: `Photos (${photos.length})`
        },
        {
          id: 'settings',
          label: 'Settings'
        }].
        map((tab) =>
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id as any)}
          className={`flex-1 py-3 text-sm font-bold text-center border-b-2 transition-colors ${activeTab === tab.id ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}>
          
            {tab.label}
          </button>
        )}
      </div>

      <div className="p-4 pb-24">
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' &&
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
              <Card
              padding="sm"
              className="flex flex-col items-center justify-center text-center py-5 bg-white shadow-sm border-gray-200">
              
                <ImageIcon className="w-6 h-6 text-indigo-500 mb-2" />
                <span className="text-2xl font-extrabold text-gray-900">
                  {stats.photoCount}
                </span>
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mt-1">
                  Photos
                </span>
              </Card>
              <Card
              padding="sm"
              className="flex flex-col items-center justify-center text-center py-5 bg-white shadow-sm border-gray-200">
              
                <UsersIcon className="w-6 h-6 text-green-500 mb-2" />
                <span className="text-2xl font-extrabold text-gray-900">
                  {stats.contributorCount}
                </span>
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mt-1">
                  Contributors
                </span>
              </Card>
              <Card
              padding="sm"
              className="flex flex-col items-center justify-center text-center py-5 bg-white shadow-sm border-gray-200">
              
                <EyeIcon className="w-6 h-6 text-blue-500 mb-2" />
                <span className="text-2xl font-extrabold text-gray-900">
                  {Math.floor(stats.photoCount * 3.5)}
                </span>
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mt-1">
                  Gallery Views
                </span>
              </Card>
              <Card
              padding="sm"
              className="flex flex-col items-center justify-center text-center py-5 bg-white shadow-sm border-gray-200">
              
                <HardDriveIcon className="w-6 h-6 text-purple-500 mb-2" />
                <span className="text-2xl font-extrabold text-gray-900">
                  {stats.storageUsed.toFixed(1)}
                  <span className="text-sm">MB</span>
                </span>
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mt-1">
                  Storage Used
                </span>
              </Card>
            </div>

            {/* Storage Bar */}
            <Card className="shadow-sm border-gray-200">
              <div className="flex justify-between items-end mb-2">
                <h3 className="text-sm font-bold text-gray-900">
                  Storage Usage
                </h3>
                <span className="text-xs font-medium text-gray-500">
                  {stats.storageUsed.toFixed(1)} MB /{' '}
                  {storageLimit >= 1000 ?
                `${storageLimit / 1000} GB` :
                `${storageLimit} MB`}
                </span>
              </div>
              <ProgressBar
              progress={storagePercent}
              variant={storagePercent > 90 ? 'indigo' : 'green'} />
            
              {storagePercent > 80 &&
            <p className="text-xs text-red-500 mt-2 font-medium">
                  Approaching storage limit. Consider upgrading your package.
                </p>
            }
            </Card>

            {/* Recent Activity */}
            <Card className="shadow-sm border-gray-200 p-0 overflow-hidden">
              <div className="p-4 border-b border-gray-100">
                <h3 className="text-sm font-bold text-gray-900">
                  Recent Uploads
                </h3>
              </div>
              <div className="divide-y divide-gray-100">
                {photos.slice(0, 5).map((photo) =>
              <div
                key={photo.id}
                className="p-4 flex items-center gap-3 hover:bg-gray-50 transition-colors">
                
                    <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm shrink-0">
                      {(photo.uploaderName || 'A').charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {photo.uploaderName || 'Anonymous'}
                      </p>
                      <p className="text-xs text-gray-500">
                        Uploaded{' '}
                        {Math.floor((Date.now() - photo.uploadedAt) / 60000)}{' '}
                        mins ago
                      </p>
                    </div>
                    <img
                  src={photo.url}
                  alt="Thumbnail"
                  className="w-12 h-12 rounded-md object-cover border border-gray-200 shrink-0" />
                
                  </div>
              )}
                {photos.length === 0 &&
              <div className="p-8 text-center text-gray-500 text-sm">
                    No activity yet.
                  </div>
              }
              </div>
            </Card>
          </div>
        }

        {/* PHOTOS TAB */}
        {activeTab === 'photos' &&
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
            {/* Action Bar */}
            <div className="flex justify-between items-center bg-white p-3 rounded-xl border border-gray-200 shadow-sm sticky top-[116px] z-10">
              <button
              onClick={selectAllPhotos}
              className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors">
              
                {selectedPhotos.size === photos.length && photos.length > 0 ?
              <CheckSquareIcon className="w-5 h-5 text-indigo-600" /> :

              <SquareIcon className="w-5 h-5" />
              }
                Select All
              </button>

              <div className="flex gap-2">
                {selectedPhotos.size > 0 &&
              <Button
                variant="danger"
                size="sm"
                onClick={deleteSelectedPhotos}>
                
                    <Trash2Icon className="w-4 h-4 mr-1" /> Delete (
                    {selectedPhotos.size})
                  </Button>
              }
                <Button
                variant="outline"
                size="sm"
                onClick={handleDownloadAll}
                disabled={isDownloading || photos.length === 0}>
                
                  <DownloadIcon className="w-4 h-4 mr-1" /> ZIP
                </Button>
              </div>
            </div>

            {/* Photo Grid */}
            {photos.length === 0 ?
          <div className="text-center py-12 text-gray-500 bg-white rounded-xl border border-dashed border-gray-300">
                <ImageIcon className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                <p className="font-medium text-gray-900">
                  No photos uploaded yet
                </p>
                <p className="text-sm mt-1">
                  Share your event link to get started.
                </p>
              </div> :

          <div className="grid grid-cols-3 gap-2">
                {photos.map((photo) => {
              const isSelected = selectedPhotos.has(photo.id);
              return (
                <div
                  key={photo.id}
                  className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${isSelected ? 'border-indigo-600 scale-95 opacity-80' : 'border-transparent hover:opacity-90'}`}
                  onClick={() => togglePhotoSelection(photo.id)}>
                  
                      <img
                    src={photo.url}
                    alt="Uploaded"
                    className="w-full h-full object-cover" />
                  

                      {/* Selection Indicator */}
                      <div className="absolute top-2 left-2">
                        {isSelected ?
                    <div className="bg-white rounded-md shadow-sm">
                            <CheckSquareIcon className="w-5 h-5 text-indigo-600" />
                          </div> :

                    <div className="bg-black/20 rounded-md backdrop-blur-sm">
                            <SquareIcon className="w-5 h-5 text-white/80" />
                          </div>
                    }
                      </div>

                      {/* Info Overlay */}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                        <p className="text-white text-[10px] font-medium truncate">
                          {photo.uploaderName || 'Anonymous'}
                        </p>
                      </div>
                    </div>);

            })}
              </div>
          }
          </div>
        }

        {/* SETTINGS TAB */}
        {activeTab === 'settings' &&
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <Card className="shadow-sm border-gray-200 p-0 overflow-hidden">
              <div className="p-4 border-b border-gray-100 bg-gray-50">
                <h3 className="text-sm font-bold text-gray-900">
                  Event Controls
                </h3>
              </div>
              <div className="divide-y divide-gray-100">
                {/* Status Toggle */}
                <div className="p-4 flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">
                      Accept New Photos
                    </h4>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Allow guests to continue uploading
                    </p>
                  </div>
                  <button
                  onClick={() => toggleSetting('status')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${event.status === 'active' ? 'bg-green-500' : 'bg-gray-200'}`}>
                  
                    <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${event.status === 'active' ? 'translate-x-6' : 'translate-x-1'}`} />
                  
                  </button>
                </div>

                {/* Moderation Toggle */}
                <div className="p-4 flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">
                      Require Approval
                    </h4>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Review photos before they appear in gallery
                    </p>
                  </div>
                  <button
                  onClick={() => toggleSetting('moderationEnabled')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${event.moderationEnabled ? 'bg-indigo-600' : 'bg-gray-200'}`}>
                  
                    <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${event.moderationEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
                  
                  </button>
                </div>
              </div>
            </Card>

            <Card className="shadow-sm border-gray-200 p-0 overflow-hidden">
              <div className="p-4 border-b border-gray-100 bg-gray-50">
                <h3 className="text-sm font-bold text-gray-900">Danger Zone</h3>
              </div>
              <div className="p-4">
                <p className="text-sm text-gray-600 mb-4">
                  Permanently delete this event, including all photos and data.
                  This action cannot be undone.
                </p>
                <Button
                variant="danger"
                fullWidth
                onClick={() => {
                  if (
                  window.confirm(
                    'Are you absolutely sure you want to delete this event?'
                  ))
                  {
                    // Mock deletion
                    addToast('Event deleted', 'success');
                    navigate('landing');
                  }
                }}>
                
                  Delete Event
                </Button>
              </div>
            </Card>
          </div>
        }
      </div>
    </Layout>);

}