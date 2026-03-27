import React, { useState } from 'react';
import { Layout } from '../ui/Layout';
import { Input, Textarea } from '../ui/Input';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { PackageType } from '../../types';
import {
  CheckIcon,
  Image as ImageIcon,
  LockIcon,
  UnlockIcon,
  InfoIcon } from
'lucide-react';
import { PageType } from '../../types';
interface CreateEventProps {
  navigate: (page: PageType) => void;
  setPendingEvent: (data: any) => void;
}
export function CreateEvent({ navigate, setPendingEvent }: CreateEventProps) {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [passwordEnabled, setPasswordEnabled] = useState(false);
  const [password, setPassword] = useState('');
  const [selectedPackage, setSelectedPackage] =
  useState<PackageType>('standard');
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [errors, setErrors] = useState<{
    title?: string;
    date?: string;
    password?: string;
  }>({});
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverImage(URL.createObjectURL(file));
    }
  };
  const validate = () => {
    const newErrors: any = {};
    if (!title.trim()) newErrors.title = 'Event name is required';
    if (!date) newErrors.date = 'Date is required';
    if (passwordEnabled && !password.trim())
    newErrors.password = 'Password is required if enabled';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setPendingEvent({
      title,
      date,
      description,
      password: passwordEnabled ? password : undefined,
      packageType: selectedPackage,
      organizerId: 'org_new',
      coverImage
    });
    navigate('payment');
  };
  const getPrice = (pkg: PackageType) => {
    if (pkg === 'basic') return '$0';
    if (pkg === 'standard') return '$29';
    return '$79';
  };
  return (
    <Layout navigate={navigate} title="Create Event" currentPage="create">
      <div className="p-4 pb-32">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Cover Image Upload */}
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Event Cover Image (Optional)
            </label>
            <div
              className={`relative h-40 w-full rounded-2xl border-2 border-dashed flex flex-col items-center justify-center overflow-hidden transition-colors ${coverImage ? 'border-indigo-500' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'}`}>
              
              {coverImage ?
              <>
                  <img
                  src={coverImage}
                  alt="Cover"
                  className="w-full h-full object-cover" />
                
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <span className="text-white font-medium bg-black/50 px-3 py-1 rounded-lg backdrop-blur-sm">
                      Change Image
                    </span>
                  </div>
                </> :

              <>
                  <ImageIcon className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="text-sm font-medium text-gray-600">
                    Tap to upload cover photo
                  </span>
                  <span className="text-xs text-gray-400 mt-1">
                    16:9 ratio recommended
                  </span>
                </>
              }
              <input
                type="file"
                accept="image/*"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={handleImageUpload} />
              
            </div>
          </div>

          <Card>
            <div className="space-y-5">
              <h2 className="text-lg font-semibold border-b pb-2">
                Event Details
              </h2>
              <Input
                label="Event Name *"
                placeholder="e.g., Sarah & John's Wedding"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (errors.title)
                  setErrors({
                    ...errors,
                    title: undefined
                  });
                }}
                error={errors.title} />
              
              <Input
                label="Date *"
                type="date"
                value={date}
                onChange={(e) => {
                  setDate(e.target.value);
                  if (errors.date)
                  setErrors({
                    ...errors,
                    date: undefined
                  });
                }}
                error={errors.date} />
              

              <div className="relative">
                <Textarea
                  label="Welcome Message (Optional)"
                  placeholder="A short message for your guests..."
                  value={description}
                  onChange={(e) => {
                    if (e.target.value.length <= 200) {
                      setDescription(e.target.value);
                    }
                  }}
                  className="pb-6" />
                
                <span
                  className={`absolute bottom-2 right-3 text-xs ${description.length >= 200 ? 'text-red-500 font-medium' : 'text-gray-400'}`}>
                  
                  {description.length}/200
                </span>
              </div>

              {/* Password Toggle */}
              <div className="pt-2 border-t border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 flex items-center gap-2">
                      {passwordEnabled ?
                      <LockIcon className="w-4 h-4 text-indigo-600" /> :

                      <UnlockIcon className="w-4 h-4 text-gray-400" />
                      }
                      Password Protection
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Require a password to view or upload photos
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPasswordEnabled(!passwordEnabled)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${passwordEnabled ? 'bg-indigo-600' : 'bg-gray-200'}`}>
                    
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${passwordEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
                    
                  </button>
                </div>

                {passwordEnabled &&
                <div className="animate-in slide-in-from-top-2 fade-in duration-200">
                    <Input
                    type="text"
                    placeholder="Enter event password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password)
                      setErrors({
                        ...errors,
                        password: undefined
                      });
                    }}
                    error={errors.password} />
                  
                  </div>
                }
              </div>
            </div>
          </Card>

          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-lg font-semibold">Select Package</h2>
              <button
                type="button"
                className="text-indigo-600 hover:text-indigo-700">
                
                <InfoIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Package Cards */}
            {[
            {
              id: 'basic' as PackageType,
              name: 'Basic',
              price: 'Free',
              features: [
              'Up to 100 photos',
              '7 days hosting',
              'Standard gallery']

            },
            {
              id: 'standard' as PackageType,
              name: 'Standard',
              price: '$29',
              badge: 'Popular',
              features: [
              'Up to 1,000 photos',
              '3 months hosting',
              'High-res downloads',
              'Password protection']

            },
            {
              id: 'premium' as PackageType,
              name: 'Premium',
              price: '$79',
              features: [
              'Unlimited photos',
              '1 year hosting',
              'Original quality',
              'Priority support']

            }].
            map((pkg) =>
            <div
              key={pkg.id}
              className={`relative p-4 rounded-2xl border-2 cursor-pointer transition-all ${selectedPackage === pkg.id ? 'border-indigo-600 bg-indigo-50/50 shadow-md' : 'border-gray-200 bg-white hover:border-indigo-200 hover:bg-gray-50'}`}
              onClick={() => setSelectedPackage(pkg.id)}>
              
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    {/* Radio indicator */}
                    <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center ${selectedPackage === pkg.id ? 'border-indigo-600' : 'border-gray-300'}`}>
                    
                      {selectedPackage === pkg.id &&
                    <div className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
                    }
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-gray-900">{pkg.name}</h3>
                        {pkg.badge &&
                      <span className="bg-indigo-100 text-indigo-700 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                            {pkg.badge}
                          </span>
                      }
                      </div>
                    </div>
                  </div>
                  <span
                  className={`font-bold text-lg ${selectedPackage === pkg.id ? 'text-indigo-600' : 'text-gray-900'}`}>
                  
                    {pkg.price}
                  </span>
                </div>
                <ul className="text-sm text-gray-600 space-y-2 pl-8">
                  {pkg.features.map((feature, idx) =>
                <li key={idx} className="flex items-start gap-2">
                      <CheckIcon
                    className={`w-4 h-4 mt-0.5 shrink-0 ${selectedPackage === pkg.id ? 'text-indigo-500' : 'text-green-500'}`} />
                  
                      <span>{feature}</span>
                    </li>
                )}
                </ul>
              </div>
            )}
          </div>

          {/* Sticky Bottom Bar */}
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-40 pb-safe">
            <div className="max-w-lg mx-auto p-4 flex items-center justify-between gap-4">
              <div className="flex flex-col">
                <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                  Total Due
                </span>
                <span className="text-xl font-bold text-gray-900">
                  {getPrice(selectedPackage)}
                </span>
              </div>
              <Button type="submit" size="lg" className="flex-1 shadow-lg">
                Continue to Payment
              </Button>
            </div>
          </div>
        </form>
      </div>
    </Layout>);

}