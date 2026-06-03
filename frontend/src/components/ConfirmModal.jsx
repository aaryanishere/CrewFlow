import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

const ConfirmModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = 'Are you sure about that?', 
  message = 'Do you want to delete this?', 
  confirmText = 'Delete', 
  cancelText = 'Cancel' 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm select-none">
      {/* Backdrop overlay */}
      <div className="absolute inset-0 bg-transparent" onClick={onClose}></div>
      
      {/* Modal Card */}
      <div className="relative w-full max-w-sm bg-white border border-[#e2e2e2] rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 z-10">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="p-6">
          <div className="flex items-start gap-4">
            {/* Alert Icon Outer Circle */}
            <div className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full bg-rose-50 border border-rose-100 text-rose-600">
              <AlertTriangle className="h-5 w-5" />
            </div>

            {/* Modal Text Content */}
            <div className="flex-1">
              <h3 className="text-sm font-bold text-gray-900 tracking-tight leading-6">
                {title}
              </h3>
              <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
                {message}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-[#fcfcfc] border-t border-[#eeeeee] px-6 py-4 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="text-xs font-bold text-gray-700 bg-white hover:bg-gray-50 border border-[#e2e2e2] py-2 px-4 rounded-xl transition-all"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 active:bg-rose-800 py-2 px-4 rounded-xl shadow-sm hover:shadow transition-all"
          >
            {confirmText}
          </button>
        </div>

      </div>
    </div>
  );
};

export default ConfirmModal;
