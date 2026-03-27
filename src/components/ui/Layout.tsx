import React from 'react';
import {
  CameraIcon,
  ChevronLeftIcon,
  HomeIcon,
  PlusCircleIcon,
  LayoutDashboardIcon } from
'lucide-react';
import { PageType } from '../../types';
interface LayoutProps {
  children: ReactNode;
  navigate: (page: PageType) => void;
  showNav?: boolean;
  title?: string;
  currentPage?: PageType;
}
export function Layout({
  children,
  navigate,
  showNav = true,
  title,
  currentPage
}: LayoutProps) {
  const isLanding = currentPage === 'landing';
  const showBottomNav =
  currentPage === 'landing' ||
  currentPage === 'organizer-admin' ||
  currentPage === 'owner-admin';
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900">
      {showNav &&
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
          <div className="max-w-lg mx-auto w-full px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {!isLanding && currentPage &&
            <button
              onClick={() => navigate('landing')}
              className="p-2 -ml-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Go back">
              
                  <ChevronLeftIcon className="w-6 h-6" />
                </button>
            }
              <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => navigate('landing')}>
              
                <div className="bg-indigo-600 p-1.5 rounded-lg shadow-sm">
                  <CameraIcon className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-lg tracking-tight hidden sm:inline-block">
                  SnapShare
                </span>
              </div>
            </div>
            {title &&
          <h1 className="font-semibold text-gray-800 truncate max-w-[150px] sm:max-w-[200px]">
                {title}
              </h1>
          }
            <div className="w-10"></div> {/* Spacer for centering title */}
          </div>
        </header>
      }

      <main className="flex-1 w-full max-w-lg mx-auto relative animate-in fade-in duration-300 pb-20">
        {children}
      </main>

      {/* Bottom Tab Bar */}
      {showBottomNav &&
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-30 pb-safe">
          <div className="max-w-lg mx-auto flex justify-around items-center h-16 px-4">
            <button
            onClick={() => navigate('landing')}
            className={`flex flex-col items-center justify-center w-full h-full gap-1 ${currentPage === 'landing' ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-900'}`}>
            
              <HomeIcon className="w-5 h-5" />
              <span className="text-[10px] font-medium">Home</span>
            </button>
            <button
            onClick={() => navigate('create')}
            className={`flex flex-col items-center justify-center w-full h-full gap-1 ${currentPage === 'create' ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-900'}`}>
            
              <PlusCircleIcon className="w-5 h-5" />
              <span className="text-[10px] font-medium">Create</span>
            </button>
            <button
            onClick={() => navigate('organizer-admin')}
            className={`flex flex-col items-center justify-center w-full h-full gap-1 ${currentPage === 'organizer-admin' ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-900'}`}>
            
              <LayoutDashboardIcon className="w-5 h-5" />
              <span className="text-[10px] font-medium">My Events</span>
            </button>
          </div>
        </nav>
      }
    </div>);

}