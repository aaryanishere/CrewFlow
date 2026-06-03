import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  Users, 
  Calendar, 
  Clock, 
  AlertTriangle, 
  Check, 
  Sparkles, 
  Briefcase, 
  ShieldCheck,
  ChevronDown,
  ChevronRight,
  Activity,
  Sliders,
  X,
  Link2,
  Trash2,
  Plus
} from 'lucide-react';

const StrategyResourcingView = ({ projects = [], tasks = [] }) => {
  const [activeGroup, setActiveGroup] = useState('All'); // 'All' | 'Engineering' | 'Design' | 'Marketing'
  const [toastMessage, setToastMessage] = useState('');

  // Dashboard Header actions state (favorite star and chevron dropdown)
  const [isFavorite, setIsFavorite] = useState(false);
  const [isResourcingMenuOpen, setIsResourcingMenuOpen] = useState(false);
  const [isEditingDetails, setIsEditingDetails] = useState(false);
  const [resourcingName, setResourcingName] = useState("Capacity Resourcing");
  const [resourcingDesc, setResourcingDesc] = useState("Audit team availability rates, schedule project workloads, and balance work allocations.");
  const [resourcingColor, setResourcingColor] = useState('blue'); // 'blue' | 'pink' | 'emerald' | 'amber' | 'purple'
  const [isSetColorOpen, setIsSetColorOpen] = useState(false);

  const resourcingMenuRef = useRef(null);

  // Click outside to close resourcing menu
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (resourcingMenuRef.current && !resourcingMenuRef.current.contains(e.target)) {
        setIsResourcingMenuOpen(false);
        setIsSetColorOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    triggerToast("Resourcing view link copied to clipboard!");
    setIsResourcingMenuOpen(false);
  };

  const handleDuplicate = () => {
    // Add copies of all allocations
    setAllocations(prev => [
      ...prev,
      ...prev.map(a => ({
        ...a,
        _id: `alloc_dup_${Date.now()}_${Math.random()}`,
        member: `${a.member} (Copy)`
      }))
    ]);
    triggerToast("Resourcing duplicated!");
    setIsResourcingMenuOpen(false);
  };

  const handleDeleteAll = () => {
    if (confirm("Are you sure you want to clear all capacity allocations?")) {
      setAllocations([]);
      triggerToast("All allocations cleared.");
    }
    setIsResourcingMenuOpen(false);
  };

  // Capacity allocations seed data
  const [allocations, setAllocations] = useState([
    {
      _id: 'alloc_1',
      member: 'Aaryan Ranjan',
      email: 'guest@crewflow.com',
      role: 'Product Lead',
      team: 'Engineering',
      maxHours: 40,
      allocatedHours: {
        'Product Launch': 25,
        'Monochrome Overhaul': 10
      }
    },
    {
      _id: 'alloc_2',
      member: 'Sneha Sharma',
      email: 'member@crewflow.com',
      role: 'UI Designer',
      team: 'Design',
      maxHours: 35,
      allocatedHours: {
        'Product Launch': 15,
        'Monochrome Overhaul': 24 // Over-allocated!
      }
    },
    {
      _id: 'alloc_3',
      member: 'Kabir Dev',
      email: 'admin@crewflow.com',
      role: 'Marketing Manager',
      team: 'Marketing',
      maxHours: 40,
      allocatedHours: {
        'Product Launch': 18,
        'Monochrome Overhaul': 5
      }
    }
  ]);



  // Update allocation hours
  const handleUpdateHours = (allocId, project, hours) => {
    const numericHours = Math.max(0, Number(hours));
    setAllocations(prev => prev.map(a => {
      if (a._id === allocId) {
        return {
          ...a,
          allocatedHours: {
            ...a.allocatedHours,
            [project]: numericHours
          }
        };
      }
      return a;
    }));
  };

  // Grouped allocations
  const filteredAllocations = useMemo(() => {
    if (activeGroup === 'All') return allocations;
    return allocations.filter(a => a.team === activeGroup);
  }, [allocations, activeGroup]);

  // Workload indicator helpers
  const getWorkloadRatio = (alloc) => {
    const total = Object.values(alloc.allocatedHours).reduce((acc, curr) => acc + curr, 0);
    return {
      total,
      ratio: total / alloc.maxHours
    };
  };

  const getWorkloadStyle = (ratio) => {
    if (ratio > 1.0) {
      // Over-allocated! (Red)
      return {
        bar: 'bg-rose-500',
        text: 'text-rose-700',
        bg: 'bg-rose-50 border-rose-200',
        label: 'Overloaded!'
      };
    }
    if (ratio >= 0.7) {
      // Optimal (Green)
      return {
        bar: 'bg-emerald-500',
        text: 'text-emerald-700',
        bg: 'bg-emerald-50 border-emerald-200',
        label: 'Optimal'
      };
    }
    // Underloaded (Light blue/grey)
    return {
      bar: 'bg-[#3b66c5]',
      text: 'text-[#3b66c5]',
      bg: 'bg-blue-50/50 border-blue-200',
      label: 'Under-capacity'
    };
  };

  return (
    <div className="flex-1 overflow-y-auto bg-white px-8 py-8 space-y-8 select-none font-sans relative">
      
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-[#e2e2e2] gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#1a1c1c] tracking-tight flex items-center gap-2.5">
            <Calendar className="h-6 w-6 text-[#3b66c5]" />
            <span>Capacity Resourcing</span>
          </h2>
          <p className="text-xs text-[#777777] mt-0.5">Audit team availability rates, schedule project workloads, and balance work allocations.</p>
        </div>

        {/* Group select filters */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold uppercase text-[#777777]">Accountable Team:</span>
          <select 
            value={activeGroup}
            onChange={(e) => setActiveGroup(e.target.value)}
            className="text-xs border border-[#c6c6c6] bg-white rounded px-3 py-1.5 outline-none hover:border-[#1a1c1c] text-black font-semibold cursor-pointer"
          >
            <option value="All">All Teams</option>
            <option value="Engineering">Engineering</option>
            <option value="Design">Design</option>
            <option value="Marketing">Marketing</option>
          </select>
        </div>
      </div>

      {/* 2. Visual Balance Indicator */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Under Card */}
        <div className="border border-blue-100 bg-blue-50/20 rounded-xl p-4 flex items-center gap-3">
          <div className="h-9 w-9 rounded bg-[#3b66c5]/10 text-[#3b66c5] flex items-center justify-center">
            <Clock className="h-4.5 w-4.5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-black">Underloaded Hours (&lt;70%)</h4>
            <p className="text-[11px] text-[#777777]">Tasks are well within safety margin. Available for additional roadmap targets.</p>
          </div>
        </div>

        {/* Optimal Card */}
        <div className="border border-emerald-100 bg-emerald-50/20 rounded-xl p-4 flex items-center gap-3">
          <div className="h-9 w-9 rounded bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
            <ShieldCheck className="h-4.5 w-4.5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-black">Optimal Hour Load (70% - 100%)</h4>
            <p className="text-[11px] text-[#777777]">High performance velocity achieved without active exhaustion risks.</p>
          </div>
        </div>

        {/* Overload Card */}
        <div className="border border-rose-100 bg-rose-50/20 rounded-xl p-4 flex items-center gap-3">
          <div className="h-9 w-9 rounded bg-rose-500/10 text-rose-600 flex items-center justify-center animate-pulse">
            <AlertTriangle className="h-4.5 w-4.5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-black">Exhaustion Risk (&gt;100%)</h4>
            <p className="text-[11px] text-[#777777]">Total task allocation exceeds capacity limits. Re-assignment recommended.</p>
          </div>
        </div>

      </div>

      {/* 3. Capacity Grid Worksheets */}
      <div className="border border-[#e2e2e2] rounded-xl bg-white overflow-hidden shadow-xs">
        
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs select-none">
            <thead>
              <tr className="border-b border-[#e2e2e2] bg-[#fafafb] text-[#5e5e5e] font-semibold h-11">
                <th className="py-2 px-4 w-60">Team Member</th>
                <th className="py-2 px-4 w-44">Allocated Projects & Hours</th>
                <th className="py-2 px-4">Workload Balance Index (Weekly)</th>
                <th className="py-2 px-4 w-32 text-right">Max Limit</th>
              </tr>
            </thead>

            <tbody>
              {filteredAllocations.map((alloc) => {
                const { total, ratio } = getWorkloadRatio(alloc);
                const style = getWorkloadStyle(ratio);
                
                return (
                  <tr key={alloc._id} className="border-b border-[#e2e2e2] last:border-b-0 hover:bg-[#fafafb]/40 transition-colors">
                    
                    {/* User profile */}
                    <td className="py-4 px-4 font-medium text-[#1a1c1c]">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-pink-100 border border-[#e2e2e2] text-pink-700 font-bold flex items-center justify-center text-[10px] shadow-xs">
                          {alloc.member.split(' ').map(n => n.charAt(0)).join('')}
                        </div>
                        <div>
                          <span className="font-bold text-black block leading-tight">{alloc.member}</span>
                          <span className="text-[10px] text-[#777777] font-semibold mt-0.5 block">{alloc.role} • {alloc.team}</span>
                        </div>
                      </div>
                    </td>

                    {/* Allocated Project hours */}
                    <td className="py-4 px-4">
                      <div className="flex flex-col gap-2">
                        {Object.entries(alloc.allocatedHours).map(([project, hours]) => (
                          <div key={project} className="flex items-center justify-between border border-[#eeeeee] bg-white rounded p-1.5 w-44 gap-1.5 shadow-xs">
                            <span className="text-[10px] font-bold text-[#5e5e5e] truncate w-24" title={project}>{project}</span>
                            <div className="flex items-center gap-1">
                              <input 
                                type="number"
                                min="0"
                                max="100"
                                value={hours}
                                onChange={(e) => handleUpdateHours(alloc._id, project, e.target.value)}
                                className="w-10 text-[10px] text-right font-mono border-none outline-none hover:bg-gray-50 focus:bg-gray-100 p-0.5 rounded text-black font-semibold"
                              />
                              <span className="text-[9px] text-[#777777] font-mono">hrs</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </td>

                    {/* Workload Progress Bar */}
                    <td className="py-4 px-4">
                      <div className="space-y-2 max-w-md">
                        
                        <div className="flex justify-between items-center text-[10px] font-bold">
                          <span className={`border rounded-full px-2 py-0.5 text-[9px] uppercase tracking-wide ${style.bg} ${style.text}`}>
                            {style.label}
                          </span>
                          <span className={`${style.text} font-mono`}>
                            {total} hrs / {alloc.maxHours} max ({Math.round(ratio * 100)}%)
                          </span>
                        </div>

                        {/* Progress slider bar wrapper */}
                        <div className="w-full bg-[#f3f3f4] h-2.5 rounded-full overflow-hidden border border-[#eeeeee]">
                          <div 
                            className={`h-full transition-all duration-500 ${style.bar}`} 
                            style={{ width: `${Math.min(100, ratio * 100)}%` }}
                          ></div>
                        </div>

                      </div>
                    </td>

                    {/* Limit Column */}
                    <td className="py-4 px-4 text-right text-gray-700 font-bold font-mono">
                      {alloc.maxHours} hrs
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

      </div>



      {/* Floating Info Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-black text-white px-4 py-2.5 rounded shadow-lg text-xs font-semibold z-50 animate-fade-in flex items-center gap-2">
          <Check className="w-3.5 h-3.5 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

    </div>
  );
};

export default StrategyResourcingView;
