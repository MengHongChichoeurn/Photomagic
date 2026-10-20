import React from 'react';

export interface ToastMessage {
  id: string;
  message: string;
}

interface ToastContainerProps {
  toasts: ToastMessage[];
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts }) => {
  return (
    <div className="fixed bottom-8 right-8 z-50 flex flex-col space-y-2 pointer-events-none select-none">
      {toasts.map(t => (
        <div
          key={t.id}
          className="px-4 py-2 bg-[#252526] border border-[#007acc] text-gray-200 text-xs rounded-lg shadow-2xl flex items-center space-x-2 transition transform animate-fade-in"
        >
          <i className="fa-solid fa-wand-magic-sparkles text-[#007acc]"></i>
          <span>{t.message}</span>
        </div>
      ))}
    </div>
  );
};
