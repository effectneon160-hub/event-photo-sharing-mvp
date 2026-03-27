export type PackageType = 'basic' | 'standard' | 'premium';

export interface Event {
  id: string;
  title: string;
  date: string;
  description: string;
  packageType: PackageType;
  password?: string;
  createdAt: number;
  organizerId: string;
  coverImage?: string;
  moderationEnabled?: boolean;
  status?: 'active' | 'ended';
}

export interface Photo {
  id: string;
  eventId: string;
  url: string;
  uploadedAt: number;
  uploaderName?: string;
  width?: number;
  height?: number;
}

export type PageType =
'landing' |
'create' |
'payment' |
'confirmation' |
'event' |
'organizer-admin' |
'owner-admin';

export type ToastVariant = 'success' | 'error' | 'info';

export interface Toast {
  id: string;
  message: string;
  variant: ToastVariant;
  duration?: number;
}