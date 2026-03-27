import React from 'react';
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}
export function Input({ label, error, className = '', ...props }: InputProps) {
  return (
    <div className="w-full flex flex-col gap-1.5">
      {label &&
      <label className="text-sm font-medium text-gray-700">{label}</label>
      }
      <input
        className={`
          w-full px-4 py-2.5 rounded-xl border bg-white
          focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
          transition-shadow
          ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'}
          ${className}
        `}
        {...props} />
      
      {error && <span className="text-sm text-red-500">{error}</span>}
    </div>);

}
interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}
export function Textarea({
  label,
  error,
  className = '',
  ...props
}: TextareaProps) {
  return (
    <div className="w-full flex flex-col gap-1.5">
      {label &&
      <label className="text-sm font-medium text-gray-700">{label}</label>
      }
      <textarea
        className={`
          w-full px-4 py-2.5 rounded-xl border bg-white
          focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
          transition-shadow resize-y min-h-[100px]
          ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'}
          ${className}
        `}
        {...props} />
      
      {error && <span className="text-sm text-red-500">{error}</span>}
    </div>);

}