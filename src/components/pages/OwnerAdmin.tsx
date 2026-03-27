import React, { useState } from 'react';
import { Layout } from '../ui/Layout';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useToast } from '../ui/Toast';
import { useApp } from '../../AppContext';
import { PageType } from '../../types';
import {
  Trash2Icon,
  ActivityIcon,
  DatabaseIcon,
  DollarSignIcon,
  SearchIcon,
  DownloadIcon,
  MailIcon,
  SettingsIcon,
  TrendingUpIcon,
  UsersIcon } from
'lucide-react';
interface OwnerAdminProps {
  navigate: (page: PageType) => void;
  setEventId: (id: string) => void;
}
export function OwnerAdmin({ navigate, setEventId }: OwnerAdminProps) {
  const { events, photos, deleteEvent } = useApp();
  const { addToast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const totalRevenue = events.reduce((acc, event) => {
    if (event.packageType === 'premium') return acc + 79;
    if (event.packageType === 'standard') return acc + 29;
    return acc;
  }, 0);
  const filteredEvents = events.
  filter(
    (e) =>
    e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.id.toLowerCase().includes(searchQuery.toLowerCase())
  ).
  sort((a, b) => b.createdAt - a.createdAt);
  // Mock chart data
  const chartData = [
  {
    day: 'Mon',
    value: 45
  },
  {
    day: 'Tue',
    value: 30
  },
  {
    day: 'Wed',
    value: 60
  },
  {
    day: 'Thu',
    value: 25
  },
  {
    day: 'Fri',
    value: 80
  },
  {
    day: 'Sat',
    value: 120
  },
  {
    day: 'Sun',
    value: 95
  }];

  const maxChartValue = Math.max(...chartData.map((d) => d.value));
  const handleExport = () => {
    addToast('Exporting CSV data...', 'info');
    setTimeout(() => addToast('Export complete', 'success'), 1500);
  };
  return (
    <Layout
      navigate={navigate}
      title="Platform Admin"
      currentPage="owner-admin">
      
      <div className="p-4 space-y-6 pb-24">
        {/* Header Branding */}
        <div className="bg-gray-900 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl"></div>
          <h1 className="text-2xl font-extrabold mb-1 relative z-10">
            SnapShare Admin
          </h1>
          <p className="text-gray-400 text-sm relative z-10">
            Platform Overview & Management
          </p>
        </div>

        {/* Platform Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <Card
            padding="sm"
            className="flex flex-col py-4 bg-white shadow-sm border-gray-200">
            
            <div className="flex justify-between items-start mb-2">
              <ActivityIcon className="w-5 h-5 text-blue-500" />
              <span className="text-[10px] font-bold text-green-600 flex items-center">
                <TrendingUpIcon className="w-3 h-3 mr-0.5" /> 12%
              </span>
            </div>
            <span className="text-2xl font-extrabold text-gray-900">
              {events.length}
            </span>
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mt-1">
              Active Events
            </span>
          </Card>

          <Card
            padding="sm"
            className="flex flex-col py-4 bg-white shadow-sm border-gray-200">
            
            <div className="flex justify-between items-start mb-2">
              <DatabaseIcon className="w-5 h-5 text-purple-500" />
              <span className="text-[10px] font-bold text-green-600 flex items-center">
                <TrendingUpIcon className="w-3 h-3 mr-0.5" /> 24%
              </span>
            </div>
            <span className="text-2xl font-extrabold text-gray-900">
              {photos.length}
            </span>
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mt-1">
              Total Photos
            </span>
          </Card>

          <Card
            padding="sm"
            className="col-span-2 flex flex-col py-5 bg-gradient-to-br from-green-50 to-emerald-100 border-green-200 shadow-sm relative overflow-hidden">
            
            <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-10">
              <DollarSignIcon className="w-24 h-24" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-1">
                <DollarSignIcon className="w-5 h-5 text-green-600" />
                <span className="text-[10px] font-bold text-green-800 uppercase tracking-wider">
                  Estimated Revenue
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-extrabold text-green-700">
                  ${totalRevenue}
                </span>
                <span className="text-sm font-medium text-green-600">.00</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Revenue Chart */}
        <Card className="shadow-sm border-gray-200">
          <h3 className="text-sm font-bold text-gray-900 mb-6">
            Revenue (Last 7 Days)
          </h3>
          <div className="flex items-end justify-between h-32 gap-2">
            {chartData.map((data, i) =>
            <div
              key={i}
              className="flex flex-col items-center flex-1 gap-2 group">
              
                <div className="w-full relative flex justify-center">
                  <div
                  className="w-full max-w-[24px] bg-indigo-100 group-hover:bg-indigo-200 rounded-t-md transition-colors relative"
                  style={{
                    height: `${data.value / maxChartValue * 100}%`,
                    minHeight: '4px'
                  }}>
                  
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] font-bold py-0.5 px-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      ${data.value}
                    </div>
                  </div>
                </div>
                <span className="text-[10px] font-medium text-gray-500">
                  {data.day}
                </span>
              </div>
            )}
          </div>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-3 gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex flex-col items-center py-3 h-auto gap-1"
            onClick={handleExport}>
            
            <DownloadIcon className="w-5 h-5 text-gray-600" />
            <span className="text-[10px]">Export CSV</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex flex-col items-center py-3 h-auto gap-1"
            onClick={() => addToast('Newsletter feature coming soon', 'info')}>
            
            <MailIcon className="w-5 h-5 text-gray-600" />
            <span className="text-[10px]">Newsletter</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex flex-col items-center py-3 h-auto gap-1"
            onClick={() => addToast('Settings opened', 'info')}>
            
            <SettingsIcon className="w-5 h-5 text-gray-600" />
            <span className="text-[10px]">Settings</span>
          </Button>
        </div>

        {/* Event List */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-900">Event Directory</h2>
          </div>

          <div className="relative mb-4">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search events by name or ID..."
              className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)} />
            
          </div>

          <div className="space-y-3">
            {filteredEvents.length === 0 ?
            <div className="text-center py-10 bg-white rounded-xl border border-dashed border-gray-300">
                <p className="text-gray-500 font-medium">No events found.</p>
              </div> :

            filteredEvents.map((event) => {
              const eventPhotos = photos.filter((p) => p.eventId === event.id);
              const rev =
              event.packageType === 'premium' ?
              79 :
              event.packageType === 'standard' ?
              29 :
              0;
              return (
                <Card
                  key={event.id}
                  padding="sm"
                  className="flex flex-col shadow-sm border-gray-200 hover:border-indigo-200 transition-colors">
                  
                    <div className="flex justify-between items-start mb-3">
                      <div className="min-w-0 pr-2">
                        <h3 className="font-bold text-gray-900 truncate">
                          {event.title}
                        </h3>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] text-gray-500 font-mono bg-gray-100 px-1.5 py-0.5 rounded">
                            {event.id}
                          </span>
                          <span className="text-[10px] text-gray-500">
                            {new Date(event.date).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <span
                      className={`shrink-0 text-[10px] uppercase font-bold px-2 py-1 rounded-md border ${event.packageType === 'premium' ? 'bg-purple-50 text-purple-700 border-purple-200' : event.packageType === 'standard' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-gray-50 text-gray-700 border-gray-200'}`}>
                      
                        {event.packageType}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 mb-3 bg-gray-50 p-2 rounded-lg border border-gray-100">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-gray-500 uppercase">
                          Photos
                        </span>
                        <span className="font-semibold text-gray-900 text-sm">
                          {eventPhotos.length}
                        </span>
                      </div>
                      <div className="flex flex-col border-l border-gray-200 pl-2">
                        <span className="text-[10px] font-bold text-gray-500 uppercase">
                          Status
                        </span>
                        <span
                        className={`font-semibold text-sm ${event.status === 'active' ? 'text-green-600' : 'text-gray-600'}`}>
                        
                          {event.status === 'active' ? 'Active' : 'Ended'}
                        </span>
                      </div>
                      <div className="flex flex-col border-l border-gray-200 pl-2">
                        <span className="text-[10px] font-bold text-gray-500 uppercase">
                          Revenue
                        </span>
                        <span className="font-semibold text-gray-900 text-sm">
                          ${rev}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                      variant="secondary"
                      size="sm"
                      className="flex-1"
                      onClick={() => {
                        setEventId(event.id);
                        navigate('organizer-admin');
                      }}>
                      
                        Manage Event
                      </Button>
                      <Button
                      variant="danger"
                      size="sm"
                      className="px-3"
                      onClick={() => {
                        if (
                        window.confirm(
                          `Delete "${event.title}" permanently?`
                        ))
                        {
                          deleteEvent(event.id);
                          addToast('Event deleted', 'success');
                        }
                      }}
                      aria-label="Delete event">
                      
                        <Trash2Icon className="w-4 h-4" />
                      </Button>
                    </div>
                  </Card>);

            })
            }
          </div>
        </div>
      </div>
    </Layout>);

}