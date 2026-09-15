import React, { ReactNode } from 'react';

interface AdminCardProps {
  children: ReactNode;
  title?: string;
  className?: string;
}

export function AdminCard({ children, title, className = '' }: AdminCardProps) {
  return (
    <div className={`bg-white border border-zinc-200 shadow-sm rounded-xl overflow-hidden ${className}`}>
      {title && (
        <div className="px-6 py-4 border-b border-zinc-100 bg-zinc-50/50">
          <h2 className="font-semibold text-zinc-800">{title}</h2>
        </div>
      )}
      <div className="p-6">
        {children}
      </div>
    </div>
  );
}
