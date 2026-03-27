import React, { useState, memo } from 'react';
import {
  CameraIcon,
  UsersIcon,
  ZapIcon,
  ShieldCheckIcon,
  CalendarIcon,
  QrCodeIcon,
  HeartIcon,
  ArrowRightIcon,
  CheckIcon } from
'lucide-react';
import { Button } from '../ui/Button';
import { Layout } from '../ui/Layout';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { useToast } from '../ui/Toast';
import { PageType } from '../../types';
interface LandingProps {
  navigate: (page: PageType) => void;
  setEventId: (id: string) => void;
}
export function Landing({ navigate, setEventId }: LandingProps) {
  const [eventCode, setEventCode] = useState('');
  const { addToast } = useToast();
  const handleJoinEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventCode.trim()) {
      addToast('Please enter an event code', 'error');
      return;
    }
    // Mock joining an event
    if (eventCode.toLowerCase() === 'demo') {
      setEventId('evt_abc');
      navigate('event');
    } else {
      setEventId('evt_123');
      navigate('event');
    }
  };
  return (
    <Layout navigate={navigate} showNav={false} currentPage="landing">
      <div className="flex flex-col min-h-screen bg-white">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 text-white px-6 py-16 text-center overflow-hidden">
          {/* Decorative background elements */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute -top-24 -left-24 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-10 -right-20 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl"></div>
          </div>

          <div className="relative z-10 flex flex-col items-center">
            <div className="bg-white/20 p-4 rounded-2xl mb-6 backdrop-blur-sm border border-white/10 shadow-xl">
              <CameraIcon className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4 leading-tight">
              Share Event Moments <br className="hidden sm:block" />
              <span className="text-indigo-200">Instantly</span>
            </h1>
            <p className="text-lg text-indigo-100 mb-10 max-w-md mx-auto">
              The easiest way to gather photos from your guests. No app
              downloads, just scan a QR code and share memories.
            </p>

            <div className="w-full space-y-4 max-w-sm mx-auto">
              <Button
                size="lg"
                fullWidth
                className="bg-white text-indigo-600 hover:bg-indigo-50 shadow-xl text-lg font-bold"
                onClick={() => navigate('create')}>
                
                Create Free Event
              </Button>
              <Button
                variant="ghost"
                size="lg"
                fullWidth
                className="text-white hover:bg-white/10 hover:text-white border border-white/20"
                onClick={() => {
                  document.getElementById('how-it-works')?.scrollIntoView({
                    behavior: 'smooth'
                  });
                }}>
                
                See How It Works
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="bg-indigo-900 text-indigo-100 py-4 px-4 text-center text-sm font-medium flex flex-wrap justify-center gap-x-6 gap-y-2">
          <span>12,000+ Events</span>
          <span className="hidden sm:inline">•</span>
          <span>2M+ Photos</span>
          <span className="hidden sm:inline">•</span>
          <span>50K+ Guests</span>
        </div>

        {/* Join Event Section */}
        <div className="px-6 py-10 bg-gray-50 border-b border-gray-100">
          <Card className="max-w-sm mx-auto shadow-md border-indigo-100">
            <h3 className="font-bold text-gray-900 mb-2 text-center">
              Have an event code?
            </h3>
            <form onSubmit={handleJoinEvent} className="flex gap-2">
              <Input
                placeholder="e.g. DEMO"
                value={eventCode}
                onChange={(e) => setEventCode(e.target.value)}
                className="uppercase" />
              
              <Button type="submit" className="shrink-0">
                Join
              </Button>
            </form>
          </Card>
        </div>

        {/* How It Works */}
        <div id="how-it-works" className="px-6 py-16 bg-white">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-gray-600">
              Three simple steps to collect every memory.
            </p>
          </div>

          <div className="space-y-10 max-w-sm mx-auto relative">
            {/* Connecting line */}
            <div className="absolute left-6 top-10 bottom-10 w-0.5 bg-indigo-100 -z-10"></div>

            <div className="flex items-start gap-6">
              <div className="bg-indigo-600 text-white w-12 h-12 rounded-full flex items-center justify-center shrink-0 shadow-md font-bold text-lg border-4 border-white">
                1
              </div>
              <div className="pt-2">
                <div className="flex items-center gap-2 mb-1">
                  <CalendarIcon className="w-5 h-5 text-indigo-600" />
                  <h3 className="font-bold text-gray-900 text-lg">
                    Create Your Event
                  </h3>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  Set up your dedicated gallery in under 30 seconds. No credit
                  card required.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-6">
              <div className="bg-indigo-600 text-white w-12 h-12 rounded-full flex items-center justify-center shrink-0 shadow-md font-bold text-lg border-4 border-white">
                2
              </div>
              <div className="pt-2">
                <div className="flex items-center gap-2 mb-1">
                  <QrCodeIcon className="w-5 h-5 text-indigo-600" />
                  <h3 className="font-bold text-gray-900 text-lg">
                    Share the QR Code
                  </h3>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  Print it for tables or display it on a screen. Guests just
                  scan to join.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-6">
              <div className="bg-indigo-600 text-white w-12 h-12 rounded-full flex items-center justify-center shrink-0 shadow-md font-bold text-lg border-4 border-white">
                3
              </div>
              <div className="pt-2">
                <div className="flex items-center gap-2 mb-1">
                  <HeartIcon className="w-5 h-5 text-indigo-600" />
                  <h3 className="font-bold text-gray-900 text-lg">
                    Collect Memories
                  </h3>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  Photos appear instantly in your live gallery as guests upload
                  them.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonial */}
        <div className="bg-indigo-50 px-6 py-16">
          <Card className="max-w-md mx-auto bg-white shadow-lg border-none relative overflow-hidden">
            <div className="absolute top-0 left-0 w-2 h-full bg-indigo-500"></div>
            <div className="p-6 sm:p-8">
              <div className="flex gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((star) =>
                <svg
                  key={star}
                  className="w-5 h-5 text-yellow-400 fill-current"
                  viewBox="0 0 20 20">
                  
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                )}
              </div>
              <p className="text-gray-700 text-lg italic mb-6 leading-relaxed">
                "We used SnapShare for our wedding and got over 500 photos from
                angles the photographer missed. It was the best decision we
                made!"
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold text-xl">
                  S
                </div>
                <div>
                  <p className="font-bold text-gray-900">Sarah Jenkins</p>
                  <p className="text-sm text-gray-500">Wedding in Austin, TX</p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Pricing Preview */}
        <div className="px-6 py-16 bg-white">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Simple Pricing
            </h2>
            <p className="text-gray-600">
              Choose the perfect plan for your event.
            </p>
          </div>

          <div className="space-y-6 max-w-sm mx-auto">
            <Card className="border-2 border-gray-100 hover:border-indigo-200 transition-colors">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-xl text-gray-900">Basic</h3>
                <span className="font-bold text-xl text-indigo-600">Free</span>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-3 text-gray-600">
                  <CheckIcon className="w-5 h-5 text-green-500 shrink-0" /> Up
                  to 100 photos
                </li>
                <li className="flex items-center gap-3 text-gray-600">
                  <CheckIcon className="w-5 h-5 text-green-500 shrink-0" /> 7
                  days hosting
                </li>
              </ul>
              <Button
                variant="outline"
                fullWidth
                onClick={() => navigate('create')}>
                
                Get Started
              </Button>
            </Card>

            <Card className="border-2 border-indigo-600 shadow-xl relative">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-indigo-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                Most Popular
              </div>
              <div className="flex justify-between items-center mb-4 mt-2">
                <h3 className="font-bold text-xl text-gray-900">Standard</h3>
                <span className="font-bold text-xl text-indigo-600">$29</span>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-3 text-gray-600">
                  <CheckIcon className="w-5 h-5 text-green-500 shrink-0" /> Up
                  to 1,000 photos
                </li>
                <li className="flex items-center gap-3 text-gray-600">
                  <CheckIcon className="w-5 h-5 text-green-500 shrink-0" /> 3
                  months hosting
                </li>
                <li className="flex items-center gap-3 text-gray-600">
                  <CheckIcon className="w-5 h-5 text-green-500 shrink-0" />{' '}
                  High-res downloads
                </li>
              </ul>
              <Button
                variant="primary"
                fullWidth
                onClick={() => navigate('create')}>
                
                Choose Standard
              </Button>
            </Card>
          </div>
        </div>

        {/* Footer Links */}
        <div className="py-10 bg-gray-900 text-center flex flex-col items-center gap-4 text-sm text-gray-400">
          <div className="flex items-center gap-2 mb-2">
            <CameraIcon className="w-5 h-5 text-indigo-400" />
            <span className="font-bold text-lg text-white tracking-tight">
              SnapShare
            </span>
          </div>
          <div className="flex gap-6">
            <button
              onClick={() => navigate('owner-admin')}
              className="hover:text-white transition-colors">
              
              Platform Admin
            </button>
            <button
              onClick={() => {
                setEventId('evt_123');
                navigate('organizer-admin');
              }}
              className="hover:text-white transition-colors">
              
              Organizer Login
            </button>
          </div>
          <p className="mt-4 text-gray-600 text-xs">
            © 2026 SnapShare. All rights reserved.
          </p>
        </div>
      </div>
    </Layout>);

}