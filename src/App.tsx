import React, { useState } from 'react';
import { AppProvider } from './AppContext';
import { PageType } from './types';
// Import Pages
import { Landing } from './components/pages/Landing';
import { CreateEvent } from './components/pages/CreateEvent';
import { Payment } from './components/pages/Payment';
import { Confirmation } from './components/pages/Confirmation';
import { EventGallery } from './components/pages/EventGallery';
import { OrganizerAdmin } from './components/pages/OrganizerAdmin';
import { OwnerAdmin } from './components/pages/OwnerAdmin';
function AppContent() {
  const [currentPage, setCurrentPage] = useState<PageType>('landing');
  const [activeEventId, setActiveEventId] = useState<string | null>(null);
  const [pendingEventData, setPendingEventData] = useState<any>(null);
  const navigate = (page: PageType) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };
  // Router switch
  switch (currentPage) {
    case 'landing':
      return <Landing navigate={navigate} setEventId={setActiveEventId} />;
    case 'create':
      return (
        <CreateEvent
          navigate={navigate}
          setPendingEvent={setPendingEventData} />);


    case 'payment':
      return (
        <Payment
          navigate={navigate}
          pendingEvent={pendingEventData}
          setEventId={setActiveEventId} />);


    case 'confirmation':
      return <Confirmation navigate={navigate} eventId={activeEventId} />;
    case 'event':
      return <EventGallery navigate={navigate} eventId={activeEventId} />;
    case 'organizer-admin':
      return <OrganizerAdmin navigate={navigate} eventId={activeEventId} />;
    case 'owner-admin':
      return <OwnerAdmin navigate={navigate} setEventId={setActiveEventId} />;
    default:
      return <Landing navigate={navigate} setEventId={setActiveEventId} />;
  }
}
export function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>);

}