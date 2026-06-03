import React from 'react';
import { X, Check } from 'lucide-react';

const COLORS = [
  'bg-[#4B1E38]', // Dark maroon/purple
  'bg-[#D49833]', // Orange
  'bg-[#8CB04B]', // Light green
  'bg-[#2B6358]', // Dark teal
  'bg-[#37A7A6]', // Cyan
  'bg-[#A4DEE0]', // Light cyan
  'bg-[#3B66C5]', // Blue
  'bg-[#7885D5]', // Periwinkle
  'bg-[#9969C9]', // Purple
  'bg-[#E78686]', // Light red
  'bg-[#f9f9f9]', // Default grey
  'bg-[#ffffff]', // White
];

export const AVAILABLE_WIDGETS = [
  { id: 'goals', label: 'Goals', category: 'Widgets' },
  { id: 'portfolios', label: 'Portfolios', category: 'Widgets' },
  { id: 'status_updates', label: 'Status updates', category: 'Widgets' },
  { id: 'private_notepad', label: 'Private notepad', category: 'Widgets' },
  { id: 'draft_comments', label: 'Draft comments', category: 'Widgets' },
  { id: 'forms', label: 'Forms', category: 'Widgets' },
  { id: 'comments_mentioning_me', label: 'Comments mentioning me', category: 'Widgets' },
  // Existing ones:
  { id: 'my_tasks', label: 'My tasks', category: 'Widgets' },
  { id: 'tasks_assigned', label: "Tasks I've assigned", category: 'Widgets' },
  { id: 'projects', label: 'Projects', category: 'Widgets' },
  { id: 'people', label: 'People', category: 'Widgets' }
];

const CustomizePanel = ({ 
  isOpen, 
  onClose, 
  activeBgColor, 
  onBgColorChange,
  activeWidgets,
  onToggleWidget
}) => {
  if (!isOpen) return null;

  return (
    <>
      <div 
        className="absolute inset-0 z-30 bg-black/10 transition-opacity" 
        onClick={onClose}
      />
      <div className="absolute inset-y-0 right-0 w-80 bg-white shadow-2xl z-40 flex flex-col border-l border-[#e2e2e2] animate-slide-in-right select-none">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#e2e2e2]">
          <h2 className="text-xl font-semibold text-[#1a1c1c]">Customize home</h2>
          <button onClick={onClose} className="p-1 text-[#777777] hover:text-[#1a1c1c] rounded hover:bg-[#f3f3f4] transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          
          {/* Background Selector */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-[#1a1c1c]">Background</h3>
            <div className="grid grid-cols-6 gap-2">
              {COLORS.map((colorClass) => (
                <button
                  key={colorClass}
                  onClick={() => onBgColorChange(colorClass)}
                  className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all ${
                    colorClass === 'bg-[#f9f9f9]' || colorClass === 'bg-[#ffffff]' 
                      ? 'border-[#c6c6c6]' 
                      : 'border-transparent'
                  } ${colorClass} ${activeBgColor === colorClass ? 'ring-2 ring-offset-2 ring-black' : 'hover:scale-110'}`}
                >
                  {activeBgColor === colorClass && (
                    <Check className={`w-4 h-4 ${colorClass === 'bg-[#ffffff]' || colorClass === 'bg-[#f9f9f9]' ? 'text-black' : 'text-white'}`} />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Widgets Selector */}
          <div className="space-y-4">
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-[#1a1c1c]">Widgets</h3>
              <p className="text-xs text-[#777777] leading-relaxed">Click add or drag widgets below to your home screen. You can also reorder and remove them.</p>
            </div>

            <div className="space-y-3">
              {AVAILABLE_WIDGETS.map((widget) => {
                const isActive = activeWidgets.includes(widget.id);
                return (
                  <div key={widget.id} className={`border ${isActive ? 'border-[#1a1c1c]' : 'border-[#e2e2e2]'} rounded p-3 flex flex-col gap-2 bg-white transition-colors`}>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-[#1a1c1c]">{widget.label}</span>
                      <button 
                        onClick={() => onToggleWidget(widget.id)}
                        className={`text-[10px] font-bold px-2 py-0.5 rounded transition-colors uppercase tracking-wide ${
                          isActive 
                          ? 'text-[#777777] hover:text-red-600 hover:bg-red-50' 
                          : 'text-[#1a1c1c] hover:bg-[#f3f3f4]'
                        }`}
                      >
                        {isActive ? '× Remove' : '+ Add'}
                      </button>
                    </div>
                    {/* Placeholder visualization inside the panel like the Asana screenshot */}
                    <div className="flex flex-col gap-1.5 opacity-30 pointer-events-none px-1">
                       <div className="flex items-center gap-2">
                          <div className="w-3 h-3 border-2 border-gray-400 rounded-sm"></div>
                          <div className="w-20 h-1.5 bg-gray-400 rounded-full"></div>
                       </div>
                       <div className="flex items-center gap-2">
                          <div className="w-3 h-3 border-2 border-gray-400 rounded-sm"></div>
                          <div className="w-32 h-1.5 bg-gray-400 rounded-full"></div>
                       </div>
                       <div className="flex items-center gap-2">
                          <div className="w-3 h-3 border-2 border-gray-400 rounded-sm"></div>
                          <div className="w-24 h-1.5 bg-gray-400 rounded-full"></div>
                       </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default CustomizePanel;
