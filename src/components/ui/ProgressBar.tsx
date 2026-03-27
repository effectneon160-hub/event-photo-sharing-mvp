import React from 'react';
import { CheckCircleIcon } from 'lucide-react';
interface ProgressBarProps {
  progress: number;
  variant?: 'indigo' | 'green';
  showLabel?: boolean;
  size?: 'sm' | 'md';
}
export function ProgressBar({
  progress,
  variant = 'indigo',
  showLabel = false,
  size = 'md'
}: ProgressBarProps) {
  const isComplete = progress >= 100;
  const activeVariant = isComplete ? 'green' : variant;
  const colors = {
    indigo: 'bg-indigo-600',
    green: 'bg-green-500'
  };
  const heights = {
    sm: 'h-1.5',
    md: 'h-3'
  };
  return (
    <div className="w-full flex flex-col gap-2">
      <div
        className={`w-full bg-gray-100 rounded-full overflow-hidden ${heights[size]}`}>
        
        <div
          className={`h-full transition-all duration-300 ease-out ${colors[activeVariant]} ${!isComplete ? 'animate-pulse' : ''}`}
          style={{
            width: `${Math.min(Math.max(progress, 0), 100)}%`
          }} />
        
      </div>
      {showLabel &&
      <div className="flex justify-between items-center text-xs font-medium">
          <span className={isComplete ? 'text-green-600' : 'text-gray-500'}>
            {isComplete ? 'Complete' : 'Uploading...'}
          </span>
          <span className={isComplete ? 'text-green-600' : 'text-gray-700'}>
            {isComplete ?
          <CheckCircleIcon className="w-4 h-4" /> :

          `${Math.round(progress)}%`
          }
          </span>
        </div>
      }
    </div>);

}