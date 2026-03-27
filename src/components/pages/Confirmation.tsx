import React, { useEffect, useState } from 'react';
import { Layout } from '../ui/Layout';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { QRCode } from '../ui/QRCode';
import { useToast } from '../ui/Toast';
import {
  CheckCircleIcon,
  CopyIcon,
  ShareIcon,
  ExternalLinkIcon,
  PrinterIcon,
  MessageCircleIcon,
  MailIcon } from
'lucide-react';
import { useApp } from '../../AppContext';
import { PageType } from '../../types';
interface ConfirmationProps {
  navigate: (page: PageType) => void;
  eventId: string | null;
}
export function Confirmation({ navigate, eventId }: ConfirmationProps) {
  const { getEvent } = useApp();
  const { addToast } = useToast();
  const [copied, setCopied] = useState(false);
  const [showConfetti, setShowConfetti] = useState(true);
  const event = eventId ? getEvent(eventId) : null;
  useEffect(() => {
    if (showConfetti) {
      const timer = setTimeout(() => setShowConfetti(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showConfetti]);
  if (!event) {
    return (
      <Layout navigate={navigate} currentPage="confirmation">
        <div className="p-8 text-center">Event not found.</div>
      </Layout>);

  }
  const eventUrl = `https://snapshare.app/e/${event.id}`;
  const copyToClipboard = () => {
    navigator.clipboard.writeText(eventUrl);
    setCopied(true);
    addToast('Link copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };
  const handleShare = (method: string) => {
    addToast(`Opening ${method}...`, 'info');
  };
  const handlePrint = () => {
    addToast('Preparing printable PDF...', 'info');
    setTimeout(() => addToast('Print dialog opened', 'success'), 1000);
  };
  return (
    <Layout navigate={navigate} title="Success!" currentPage="confirmation">
      {/* Confetti effect (simple CSS dots) */}
      {showConfetti &&
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {[...Array(30)].map((_, i) =>
        <div
          key={i}
          className="absolute w-3 h-3 rounded-full animate-in fade-in slide-in-from-top-full duration-1000 ease-out"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            backgroundColor: [
            '#4F46E5',
            '#10B981',
            '#F59E0B',
            '#EF4444',
            '#8B5CF6'][
            Math.floor(Math.random() * 5)],
            transform: `scale(${Math.random() * 1.5 + 0.5}) rotate(${Math.random() * 360}deg)`,
            animationDelay: `${Math.random() * 0.5}s`
          }} />

        )}
        </div>
      }

      <div className="p-4 flex flex-col items-center pb-24 animate-in zoom-in-95 duration-500">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 mt-4 shadow-inner">
          <CheckCircleIcon className="w-10 h-10 text-green-600" />
        </div>

        <h1 className="text-3xl font-extrabold text-center mb-2 text-gray-900">
          Event Created!
        </h1>
        <p className="text-gray-600 text-center mb-8 max-w-sm">
          Your event{' '}
          <span className="font-semibold text-gray-900">"{event.title}"</span>{' '}
          is ready. Share the link or QR code with your guests.
        </p>

        <Card className="w-full mb-8 shadow-xl border-indigo-100 overflow-hidden">
          <div className="bg-indigo-50 p-4 border-b border-indigo-100 flex justify-between items-center">
            <div>
              <p className="text-xs font-bold text-indigo-800 uppercase tracking-wider mb-1">
                Event Summary
              </p>
              <p className="font-semibold text-gray-900">
                {new Date(event.date).toLocaleDateString()}
              </p>
            </div>
            <div className="text-right">
              <span className="bg-white text-indigo-700 text-xs font-bold px-2 py-1 rounded-md shadow-sm border border-indigo-100 uppercase">
                {event.packageType}
              </span>
            </div>
          </div>

          <div className="flex flex-col items-center p-6 bg-white">
            <div className="mb-6 transform hover:scale-105 transition-transform duration-300">
              <QRCode value={eventUrl} size={220} />
            </div>
            <p className="text-sm font-bold text-gray-500 mb-4 uppercase tracking-wider">
              Scan to upload photos
            </p>

            <div className="w-full flex items-center gap-2 bg-gray-50 p-2 rounded-xl border border-gray-200 shadow-inner">
              <div className="flex-1 px-3 py-2 bg-white rounded-lg border border-gray-100 truncate text-sm font-medium text-gray-700">
                {eventUrl}
              </div>
              <Button
                onClick={copyToClipboard}
                variant={copied ? 'primary' : 'secondary'}
                className="shrink-0 px-4">
                
                {copied ?
                <CheckCircleIcon className="w-4 h-4 mr-2" /> :

                <CopyIcon className="w-4 h-4 mr-2" />
                }
                {copied ? 'Copied' : 'Copy'}
              </Button>
            </div>
          </div>

          <div className="bg-gray-50 p-4 border-t border-gray-100">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 text-center">
              Share Via
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => handleShare('WhatsApp')}
                className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center hover:bg-green-200 transition-colors shadow-sm">
                
                <MessageCircleIcon className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleShare('Email')}
                className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center hover:bg-blue-200 transition-colors shadow-sm">
                
                <MailIcon className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleShare('Other')}
                className="w-12 h-12 bg-gray-200 text-gray-600 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors shadow-sm">
                
                <ShareIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </Card>

        <div className="w-full space-y-4">
          <Button
            size="lg"
            fullWidth
            onClick={() => navigate('event')}
            className="shadow-lg text-lg">
            
            <ExternalLinkIcon className="w-5 h-5 mr-2" /> View Guest Gallery
          </Button>
          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              fullWidth
              onClick={() => navigate('organizer-admin')}>
              
              Dashboard
            </Button>
            <Button variant="outline" fullWidth onClick={handlePrint}>
              <PrinterIcon className="w-4 h-4 mr-2" /> Print QR
            </Button>
          </div>
        </div>
      </div>
    </Layout>);

}