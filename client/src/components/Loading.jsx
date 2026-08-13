import React from 'react';
import { Compass } from 'lucide-react';

export const Loading = ({ text = 'Loading...', fullScreen = false }) => {
  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center gap-4">
        <div className="relative flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin"></div>
          <Compass className="w-7 h-7 text-teal-600 absolute animate-pulse" />
        </div>
        <p className="text-sm font-semibold text-slate-700 tracking-wide">{text}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-12 gap-3">
      <div className="w-10 h-10 border-3 border-teal-200 border-t-teal-600 rounded-full animate-spin"></div>
      <p className="text-xs font-medium text-slate-500">{text}</p>
    </div>
  );
};

export const SkeletonCard = () => {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm animate-pulse">
      <div className="w-full h-52 bg-slate-200"></div>
      <div className="p-5 space-y-3">
        <div className="h-5 bg-slate-200 rounded w-3/4"></div>
        <div className="h-4 bg-slate-200 rounded w-1/2"></div>
        <div className="space-y-2 pt-2">
          <div className="h-3 bg-slate-200 rounded w-full"></div>
          <div className="h-3 bg-slate-200 rounded w-4/5"></div>
        </div>
        <div className="pt-4 flex justify-between items-center">
          <div className="h-5 bg-slate-200 rounded w-1/3"></div>
          <div className="h-8 bg-slate-200 rounded w-1/4"></div>
        </div>
      </div>
    </div>
  );
};

export default Loading;
