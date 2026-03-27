import React, { useState, createContext, useContext } from 'react';
import { Event, Photo } from './types';
import { ToastProvider } from './components/ui/Toast';
interface AppContextType {
  events: Event[];
  photos: Photo[];
  addEvent: (event: Omit<Event, 'id' | 'createdAt'>) => string;
  updateEvent: (id: string, updates: Partial<Event>) => void;
  deleteEvent: (id: string) => void;
  addPhoto: (photo: Omit<Photo, 'id' | 'uploadedAt'>) => void;
  deletePhoto: (id: string) => void;
  getEventPhotos: (eventId: string) => Photo[];
  getEvent: (eventId: string) => Event | undefined;
  getEventStats: (eventId: string) => {
    photoCount: number;
    contributorCount: number;
    storageUsed: number;
  };
}
const AppContext = createContext<AppContextType | undefined>(undefined);
const now = Date.now();
// Richer mock data
const INITIAL_EVENTS: Event[] = [
{
  id: 'evt_123',
  title: 'Sarah & John Wedding',
  date: '2026-06-15',
  description:
  'Welcome to our special day! Please share your favorite moments.',
  packageType: 'premium',
  createdAt: now - 86400000 * 5,
  organizerId: 'org_1',
  status: 'active'
},
{
  id: 'evt_456',
  title: 'TechCon 2026 Conference',
  date: '2026-09-20',
  description:
  'Share your favorite moments from the keynote and networking sessions.',
  packageType: 'standard',
  createdAt: now - 86400000 * 10,
  organizerId: 'org_2',
  status: 'active'
},
{
  id: 'evt_789',
  title: "Emma's 5th Birthday",
  date: '2026-04-10',
  description: 'Fun times at the park!',
  packageType: 'basic',
  createdAt: now - 86400000 * 2,
  organizerId: 'org_3',
  status: 'ended'
},
{
  id: 'evt_abc',
  title: 'Company Summer Retreat',
  date: '2026-07-01',
  description: 'Upload your team building photos here.',
  packageType: 'standard',
  createdAt: now - 86400000 * 1,
  organizerId: 'org_4',
  status: 'active',
  password: 'demo'
}];

const generateMockPhotos = (): Photo[] => {
  const photos: Photo[] = [];
  // evt_123 (12 photos)
  const uploaders1 = [
  'Sarah M.',
  'Uncle Bob',
  'Jessica K.',
  'Mike T.',
  'Anonymous'];

  for (let i = 0; i < 12; i++) {
    photos.push({
      id: `p_123_${i}`,
      eventId: 'evt_123',
      url: `https://picsum.photos/seed/wedding${i}/600/${400 + i % 3 * 100}`,
      uploadedAt: now - Math.random() * 86400000,
      uploaderName: uploaders1[i % uploaders1.length]
    });
  }
  // evt_456 (6 photos)
  const uploaders2 = ['Alex Dev', 'Sam Designer', 'Anonymous'];
  for (let i = 0; i < 6; i++) {
    photos.push({
      id: `p_456_${i}`,
      eventId: 'evt_456',
      url: `https://picsum.photos/seed/techcon${i}/600/${400 + i % 2 * 200}`,
      uploadedAt: now - Math.random() * 86400000 * 2,
      uploaderName: uploaders2[i % uploaders2.length]
    });
  }
  // evt_789 (3 photos)
  for (let i = 0; i < 3; i++) {
    photos.push({
      id: `p_789_${i}`,
      eventId: 'evt_789',
      url: `https://picsum.photos/seed/bday${i}/500/500`,
      uploadedAt: now - Math.random() * 3600000,
      uploaderName: 'Mom'
    });
  }
  // evt_abc (8 photos)
  const uploaders4 = ['HR Team', 'Dave', 'Anonymous', 'Lisa'];
  for (let i = 0; i < 8; i++) {
    photos.push({
      id: `p_abc_${i}`,
      eventId: 'evt_abc',
      url: `https://picsum.photos/seed/retreat${i}/800/600`,
      uploadedAt: now - Math.random() * 86400000 * 0.5,
      uploaderName: uploaders4[i % uploaders4.length]
    });
  }
  return photos;
};
const INITIAL_PHOTOS: Photo[] = generateMockPhotos();
export function AppProvider({ children }: {children: ReactNode;}) {
  const [events, setEvents] = useState<Event[]>(INITIAL_EVENTS);
  const [photos, setPhotos] = useState<Photo[]>(INITIAL_PHOTOS);
  const addEvent = (eventData: Omit<Event, 'id' | 'createdAt'>) => {
    const newEvent: Event = {
      ...eventData,
      id: `evt_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: Date.now(),
      status: 'active'
    };
    setEvents((prev) => [newEvent, ...prev]);
    return newEvent.id;
  };
  const updateEvent = (id: string, updates: Partial<Event>) => {
    setEvents((prev) =>
    prev.map((e) =>
    e.id === id ?
    {
      ...e,
      ...updates
    } :
    e
    )
    );
  };
  const deleteEvent = (id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
    setPhotos((prev) => prev.filter((p) => p.eventId !== id));
  };
  const addPhoto = (photoData: Omit<Photo, 'id' | 'uploadedAt'>) => {
    const newPhoto: Photo = {
      ...photoData,
      id: `p_${Math.random().toString(36).substr(2, 9)}`,
      uploadedAt: Date.now()
    };
    setPhotos((prev) => [newPhoto, ...prev]);
  };
  const deletePhoto = (id: string) => {
    setPhotos((prev) => prev.filter((p) => p.id !== id));
  };
  const getEventPhotos = (eventId: string) => {
    return photos.
    filter((p) => p.eventId === eventId).
    sort((a, b) => b.uploadedAt - a.uploadedAt);
  };
  const getEvent = (eventId: string) => {
    return events.find((e) => e.id === eventId);
  };
  const getEventStats = (eventId: string) => {
    const eventPhotos = photos.filter((p) => p.eventId === eventId);
    const contributors = new Set(
      eventPhotos.map((p) => p.uploaderName).filter(Boolean)
    );
    // Mock storage calculation: ~2.5MB per photo
    const storageUsed = eventPhotos.length * 2.5;
    return {
      photoCount: eventPhotos.length,
      contributorCount: contributors.size,
      storageUsed
    };
  };
  return (
    <ToastProvider>
      <AppContext.Provider
        value={{
          events,
          photos,
          addEvent,
          updateEvent,
          deleteEvent,
          addPhoto,
          deletePhoto,
          getEventPhotos,
          getEvent,
          getEventStats
        }}>
        
        {children}
      </AppContext.Provider>
    </ToastProvider>);

}
export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}