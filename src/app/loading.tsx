'use client';

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-50/60 backdrop-blur-sm">
      <div className="w-10 h-10 rounded-full border-2 border-slate-200 border-t-[var(--royal-blue,#1556B2)] animate-spin"></div>
    </div>
  );
}
