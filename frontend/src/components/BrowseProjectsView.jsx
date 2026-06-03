import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  Search, 
  ChevronDown, 
  Plus, 
  X, 
  Check, 
  ArrowUpDown, 
  FolderKanban, 
  Users, 
  Layers, 
  BookOpen, 
  ClipboardList,
  CheckCircle,
  FileText,
  Activity
} from 'lucide-react';

const BrowseProjectsView = ({ 
  projects = [], 
  tasks = [],
  onNewProject, 
  setActiveView, 
  setActiveProjectId, 
  onProjectCreated,
  token 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Dropdown Open States
  const [activeDropdown, setActiveDropdown] = useState(null); // 'owner' | 'members' | 'portfolios' | 'status' | null
  
  // Dropdown Search States
  const [ownerSearch, setOwnerSearch] = useState('');
  const [memberSearch, setMemberSearch] = useState('');
  const [portfolioSearch, setPortfolioSearch] = useState('');

  // Selected Filter States
  const [selectedOwner, setSelectedOwner] = useState(null); // String (email or ID)
  const [selectedMembers, setSelectedMembers] = useState([]); // Array of emails/IDs
  const [selectedPortfolio, setSelectedPortfolio] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('Active'); // Default to Active

  // Template Gallery Dismissed State
  const [showTemplates, setShowTemplates] = useState(() => {
    return localStorage.getItem('crewflow_show_templates') !== 'false';
  });

  // Sort State
  const [sortField, setSortField] = useState('name'); // 'name' | 'lastModified'
  const [sortAsc, setSortAsc] = useState(true);

  // Dropdown Refs for clicking outside to close
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle template gallery visibility change
  const handleDismissTemplates = () => {
    setShowTemplates(false);
    localStorage.setItem('crewflow_show_templates', 'false');
  };

  // Reset template gallery
  const handleResetTemplates = () => {
    setShowTemplates(true);
    localStorage.setItem('crewflow_show_templates', 'true');
  };

  // Derive all unique owners (creators) from projects
  const uniqueOwners = useMemo(() => {
    const ownersMap = new Map();
    // Default system seed
    ownersMap.set('guest_id', {
      id: 'guest_id',
      email: 'guest@crewflow.com',
      name: 'Guest User',
      initials: 'GU',
      bgColor: 'bg-pink-100 text-pink-700'
    });

    projects.forEach(p => {
      // If project has createdBy email/object
      const creator = p.createdBy;
      if (creator) {
        const id = typeof creator === 'object' ? creator._id : creator;
        const email = typeof creator === 'object' ? creator.email : (id === 'guest_id' ? 'guest@crewflow.com' : id);
        const name = email.split('@')[0];
        const initials = name.slice(0, 2).toUpperCase();
        ownersMap.set(id, {
          id,
          email,
          name: name.charAt(0).toUpperCase() + name.slice(1),
          initials,
          bgColor: id === 'guest_id' ? 'bg-pink-100 text-pink-700' : 'bg-blue-100 text-blue-700'
        });
      }
    });
    return Array.from(ownersMap.values());
  }, [projects]);

  // Derive all unique members across all projects
  const uniqueMembers = useMemo(() => {
    const membersMap = new Map();
    // Default seed
    membersMap.set('guest@crewflow.com', {
      email: 'guest@crewflow.com',
      name: 'Guest User',
      initials: 'GU',
      bgColor: 'bg-pink-100 text-pink-700'
    });
    membersMap.set('member@crewflow.com', {
      email: 'member@crewflow.com',
      name: 'Member User',
      initials: 'ME',
      bgColor: 'bg-indigo-100 text-indigo-700'
    });
    membersMap.set('admin@crewflow.com', {
      email: 'admin@crewflow.com',
      name: 'Admin User',
      initials: 'AD',
      bgColor: 'bg-purple-100 text-purple-700'
    });

    projects.forEach(p => {
      if (p.members) {
        p.members.forEach(m => {
          const email = typeof m === 'object' ? m.email : m;
          if (email) {
            const name = email.split('@')[0];
            const initials = name.slice(0, 2).toUpperCase();
            membersMap.set(email, {
              email,
              name: name.charAt(0).toUpperCase() + name.slice(1),
              initials,
              bgColor: email === 'guest@crewflow.com' ? 'bg-pink-100 text-pink-700' : 'bg-emerald-100 text-emerald-700'
            });
          }
        });
      }
    });
    return Array.from(membersMap.values());
  }, [projects]);

  // Filter project lists based on selected options
  const filteredProjects = useMemo(() => {
    let result = [...projects];

    // 1. Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(q) || 
        (p.description && p.description.toLowerCase().includes(q))
      );
    }

    // 2. Owner Filter
    if (selectedOwner) {
      result = result.filter(p => {
        const creatorId = typeof p.createdBy === 'object' ? p.createdBy._id : p.createdBy;
        return creatorId === selectedOwner;
      });
    }

    // 3. Members Filter (Project must contain all selected members)
    if (selectedMembers.length > 0) {
      result = result.filter(p => {
        if (!p.members) return false;
        const projectMemberEmails = p.members.map(m => typeof m === 'object' ? m.email : m);
        return selectedMembers.every(mEmail => projectMemberEmails.includes(mEmail));
      });
    }

    // 4. Portfolio Filter
    if (selectedPortfolio) {
      // Simple portfolios filter simulation
      if (selectedPortfolio === 'work') {
        result = result.filter((_, idx) => idx % 2 === 0);
      } else if (selectedPortfolio === 'strategy') {
        result = result.filter((_, idx) => idx % 2 === 1);
      }
    }

    // 5. Status Filter
    // In our simplified project model, status is always 'Active'. If they filter Closed/Archived, we show empty list unless mock data exists
    if (selectedStatus && selectedStatus !== 'Active') {
      result = [];
    }

    // Sort result
    result.sort((a, b) => {
      let valA = a[sortField] || '';
      let valB = b[sortField] || '';
      
      if (sortField === 'name') {
        valA = valA.toLowerCase();
        valB = valB.toLowerCase();
      }

      if (valA < valB) return sortAsc ? -1 : 1;
      if (valA > valB) return sortAsc ? 1 : -1;
      return 0;
    });

    return result;
  }, [projects, searchQuery, selectedOwner, selectedMembers, selectedPortfolio, selectedStatus, sortField, sortAsc]);

  // Dropdown Toggler
  const toggleDropdown = (dropdown) => {
    setActiveDropdown(prev => prev === dropdown ? null : dropdown);
  };

  // Member toggle handler
  const handleToggleMemberFilter = (memberEmail) => {
    setSelectedMembers(prev => {
      if (prev.includes(memberEmail)) {
        return prev.filter(email => email !== memberEmail);
      } else {
        return [...prev, memberEmail];
      }
    });
  };

  // Instant Template Creator Handler
  const handleInstantiateTemplate = async (templateTitle, templateDesc) => {
    const templateName = `${templateTitle} Template`;
    
    if (!token) {
      // Simulate client-side project creation for offline mode
      const newProject = {
        _id: `mock_project_${Date.now()}`,
        name: templateName,
        description: templateDesc,
        createdBy: 'guest_id',
        members: [
          { _id: 'guest_id', email: 'guest@crewflow.com', role: 'Admin' },
          { _id: 'member_id_1', email: 'member@crewflow.com', role: 'Member' }
        ]
      };
      onProjectCreated(newProject);
      return;
    }

    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: templateName,
          description: templateDesc,
          members: ['member_id_1']
        })
      });

      if (res.ok) {
        const newProject = await res.json();
        onProjectCreated(newProject);
      } else {
        const errData = await res.json();
        console.error('Failed to create project from template:', errData.message);
        alert(`Failed to create project: ${errData.message}`);
      }
    } catch (err) {
      console.error('Error instantiating template project:', err);
    }
  };

  // Helpers to render avatars
  const renderAvatarCircles = (membersList = []) => {
    const list = membersList.slice(0, 3);
    const count = membersList.length;

    return (
      <div className="flex items-center -space-x-1.5 overflow-hidden">
        {list.map((m, idx) => {
          const email = typeof m === 'object' ? m.email : m;
          const initial = email.charAt(0).toUpperCase();
          
          // Generate semi-random consistent colors
          const colors = [
            'bg-pink-200 text-pink-800',
            'bg-blue-200 text-blue-800',
            'bg-emerald-200 text-emerald-800',
            'bg-amber-200 text-amber-800',
            'bg-indigo-200 text-indigo-800'
          ];
          const colorClass = colors[email.length % colors.length];

          return (
            <div 
              key={idx}
              className={`h-5 w-5 rounded-full border border-white flex items-center justify-center text-[9px] font-bold shadow-xs select-none ${colorClass}`}
              title={email}
            >
              {initial}
            </div>
          );
        })}
        {count > 3 && (
          <div 
            className="h-5 w-5 rounded-full bg-[#f3f3f4] border border-white flex items-center justify-center text-[8px] font-bold text-[#777777] shadow-xs cursor-default select-none"
            title={`${count - 3} more members`}
          >
            +{count - 3}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex-1 overflow-y-auto bg-white px-8 py-8 space-y-8 select-none relative font-sans">
      
      {/* View Title & Create Action */}
      <div className="flex items-center justify-between pb-6 border-b border-[#e2e2e2]">
        <div>
          <h2 className="text-2xl font-bold text-[#1a1c1c] tracking-tight">Browse projects</h2>
          <p className="text-xs text-[#777777] mt-0.5">View and manage all active projects within your CrewFlow workspace.</p>
        </div>

        <button 
          onClick={onNewProject}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#3b66c5] hover:bg-[#2e55aa] text-white rounded text-xs font-bold shadow-xs transition-all active:scale-98"
        >
          <Plus className="h-4 w-4" />
          <span>Create project</span>
        </button>
      </div>

      {/* Main Filter Section */}
      <div className="space-y-4" ref={dropdownRef}>
        
        {/* Search Bar */}
        <div className="w-full relative">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#777777]">
            <Search className="h-4 w-4" />
          </span>
          <input
            type="text"
            placeholder="Find a project"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-sm py-2 px-10 bg-white border border-[#e2e2e2] rounded-md focus:border-[#3b66c5] focus:ring-0 transition-all placeholder-[#8d8d8d] text-[#1a1c1c] outline-none"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#777777] hover:text-black"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Filters Row */}
        <div className="flex flex-wrap gap-2.5 relative items-center">
          
          {/* Owner Dropdown */}
          <div className="relative">
            <button
              onClick={() => toggleDropdown('owner')}
              className={`flex items-center gap-1.5 px-3 py-1.5 border rounded-full text-xs font-medium transition-colors ${
                selectedOwner 
                  ? 'border-[#3b66c5] bg-[#3b66c5]/5 text-[#3b66c5]' 
                  : 'border-[#c6c6c6] text-[#5e5e5e] hover:bg-[#f9f9f9]'
              }`}
            >
              <span>Owner</span>
              {selectedOwner && (
                <span className="bg-[#3b66c5] text-white rounded-full w-4 h-4 flex items-center justify-center text-[9px] font-bold font-sans">1</span>
              )}
              <ChevronDown className="h-3.5 w-3.5 opacity-80" />
            </button>

            {activeDropdown === 'owner' && (
              <div className="absolute left-0 mt-1.5 w-64 bg-white border border-[#e2e2e2] rounded-md shadow-lg z-50 py-2 flex flex-col animate-scale-in">
                <div className="px-3 py-1.5 border-b border-[#e2e2e2] mb-1 flex items-center gap-2">
                  <Search className="h-3.5 w-3.5 text-[#8a8b8c] flex-shrink-0" />
                  <input 
                    type="text"
                    placeholder="Filter projects by owner"
                    value={ownerSearch}
                    onChange={(e) => setOwnerSearch(e.target.value)}
                    className="w-full text-xs outline-none bg-transparent py-0.5 placeholder-[#a5a6a7] text-[#1a1c1c]"
                  />
                </div>
                <div className="max-h-48 overflow-y-auto px-1">
                  {uniqueOwners
                    .filter(o => o.email.toLowerCase().includes(ownerSearch.toLowerCase()) || o.name.toLowerCase().includes(ownerSearch.toLowerCase()))
                    .map(owner => {
                      const isChosen = selectedOwner === owner.id;
                      return (
                        <button
                          key={owner.id}
                          onClick={() => {
                            setSelectedOwner(isChosen ? null : owner.id);
                            setActiveDropdown(null);
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded hover:bg-[#f5f5f6] transition-colors text-left ${
                            isChosen ? 'bg-[#3b66c5]/5 text-[#3b66c5] font-semibold' : 'text-[#1a1c1c]'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className={`h-6 w-6 rounded-full flex items-center justify-center text-[9px] font-bold flex-shrink-0 ${owner.bgColor}`}>
                              {owner.initials}
                            </div>
                            <div className="min-w-0">
                              <p className="truncate font-semibold">{owner.name}</p>
                              <p className="text-[10px] text-[#777777] truncate">{owner.email}</p>
                            </div>
                          </div>
                          {isChosen && <Check className="h-3.5 w-3.5 text-[#3b66c5] flex-shrink-0" />}
                        </button>
                      );
                    })}
                  {uniqueOwners.filter(o => o.email.toLowerCase().includes(ownerSearch.toLowerCase()) || o.name.toLowerCase().includes(ownerSearch.toLowerCase())).length === 0 && (
                    <div className="px-3 py-4 text-xs text-[#777777] italic text-center">No owners found</div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Members Dropdown */}
          <div className="relative">
            <button
              onClick={() => toggleDropdown('members')}
              className={`flex items-center gap-1.5 px-3 py-1.5 border rounded-full text-xs font-medium transition-colors ${
                selectedMembers.length > 0 
                  ? 'border-[#3b66c5] bg-[#3b66c5]/5 text-[#3b66c5]' 
                  : 'border-[#c6c6c6] text-[#5e5e5e] hover:bg-[#f9f9f9]'
              }`}
            >
              <span>Members</span>
              {selectedMembers.length > 0 && (
                <span className="bg-[#3b66c5] text-white rounded-full w-4 h-4 flex items-center justify-center text-[9px] font-bold font-sans">
                  {selectedMembers.length}
                </span>
              )}
              <ChevronDown className="h-3.5 w-3.5 opacity-80" />
            </button>

            {activeDropdown === 'members' && (
              <div className="absolute left-0 mt-1.5 w-64 bg-white border border-[#e2e2e2] rounded-md shadow-lg z-50 py-2 flex flex-col animate-scale-in">
                <div className="px-3 py-1.5 border-b border-[#e2e2e2] mb-1 flex items-center gap-2">
                  <Search className="h-3.5 w-3.5 text-[#8a8b8c] flex-shrink-0" />
                  <input 
                    type="text"
                    placeholder="Filter projects by members"
                    value={memberSearch}
                    onChange={(e) => setMemberSearch(e.target.value)}
                    className="w-full text-xs outline-none bg-transparent py-0.5 placeholder-[#a5a6a7] text-[#1a1c1c]"
                  />
                </div>
                <div className="max-h-48 overflow-y-auto px-1 space-y-0.5">
                  {uniqueMembers
                    .filter(m => m.email.toLowerCase().includes(memberSearch.toLowerCase()) || m.name.toLowerCase().includes(memberSearch.toLowerCase()))
                    .map(member => {
                      const isChecked = selectedMembers.includes(member.email);
                      return (
                        <label
                          key={member.email}
                          className="flex items-center justify-between px-3 py-2 text-xs rounded hover:bg-[#f5f5f6] transition-colors cursor-pointer text-[#1a1c1c] select-none"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <input 
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => handleToggleMemberFilter(member.email)}
                              className="rounded border-[#c6c6c6] text-black focus:ring-0 h-3.5 w-3.5 cursor-pointer"
                            />
                            <div className={`h-6 w-6 rounded-full flex items-center justify-center text-[9px] font-bold flex-shrink-0 ${member.bgColor}`}>
                              {member.initials}
                            </div>
                            <div className="min-w-0">
                              <p className="truncate font-semibold">{member.name}</p>
                              <p className="text-[10px] text-[#777777] truncate">{member.email}</p>
                            </div>
                          </div>
                        </label>
                      );
                    })}
                  {uniqueMembers.filter(m => m.email.toLowerCase().includes(memberSearch.toLowerCase()) || m.name.toLowerCase().includes(memberSearch.toLowerCase())).length === 0 && (
                    <div className="px-3 py-4 text-xs text-[#777777] italic text-center">No members found</div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Portfolios Dropdown */}
          <div className="relative">
            <button
              onClick={() => toggleDropdown('portfolios')}
              className={`flex items-center gap-1.5 px-3 py-1.5 border rounded-full text-xs font-medium transition-colors ${
                selectedPortfolio 
                  ? 'border-[#3b66c5] bg-[#3b66c5]/5 text-[#3b66c5]' 
                  : 'border-[#c6c6c6] text-[#5e5e5e] hover:bg-[#f9f9f9]'
              }`}
            >
              <span>Portfolios</span>
              {selectedPortfolio && (
                <span className="bg-[#3b66c5] text-white rounded-full w-4 h-4 flex items-center justify-center text-[9px] font-bold font-sans">1</span>
              )}
              <ChevronDown className="h-3.5 w-3.5 opacity-80" />
            </button>

            {activeDropdown === 'portfolios' && (
              <div className="absolute left-0 mt-1.5 w-64 bg-white border border-[#e2e2e2] rounded-md shadow-lg z-50 py-2 flex flex-col animate-scale-in">
                <div className="px-3 py-1.5 border-b border-[#e2e2e2] mb-1 flex items-center gap-2">
                  <Search className="h-3.5 w-3.5 text-[#8a8b8c] flex-shrink-0" />
                  <input 
                    type="text"
                    placeholder="Filter projects by portfolios"
                    value={portfolioSearch}
                    onChange={(e) => setPortfolioSearch(e.target.value)}
                    className="w-full text-xs outline-none bg-transparent py-0.5 placeholder-[#a5a6a7] text-[#1a1c1c]"
                  />
                </div>
                <div className="max-h-48 overflow-y-auto px-1 flex flex-col">
                  {['Work Portfolio', 'Strategy Portfolio']
                    .filter(p => p.toLowerCase().includes(portfolioSearch.toLowerCase()))
                    .map(port => {
                      const id = port.split(' ')[0].toLowerCase();
                      const isChosen = selectedPortfolio === id;
                      return (
                        <button
                          key={port}
                          onClick={() => {
                            setSelectedPortfolio(isChosen ? null : id);
                            setActiveDropdown(null);
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded hover:bg-[#f5f5f6] transition-colors text-left ${
                            isChosen ? 'bg-[#3b66c5]/5 text-[#3b66c5] font-semibold' : 'text-[#1a1c1c]'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <Layers className="h-4 w-4 text-[#777777]" />
                            <span>{port}</span>
                          </div>
                          {isChosen && <Check className="h-3.5 w-3.5 text-[#3b66c5] flex-shrink-0" />}
                        </button>
                      );
                    })}
                  {['Work Portfolio', 'Strategy Portfolio'].filter(p => p.toLowerCase().includes(portfolioSearch.toLowerCase())).length === 0 && (
                    <div className="px-3 py-4 text-xs text-[#777777] italic text-center">No portfolios match</div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Status Dropdown */}
          <div className="relative">
            <button
              onClick={() => toggleDropdown('status')}
              className={`flex items-center gap-1.5 px-3 py-1.5 border rounded-full text-xs font-medium transition-colors ${
                selectedStatus 
                  ? 'border-[#3b66c5] bg-[#3b66c5]/5 text-[#3b66c5]' 
                  : 'border-[#c6c6c6] text-[#5e5e5e] hover:bg-[#f9f9f9]'
              }`}
            >
              <span>Status: {selectedStatus || 'All'}</span>
              <ChevronDown className="h-3.5 w-3.5 opacity-80" />
            </button>

            {activeDropdown === 'status' && (
              <div className="absolute left-0 mt-1.5 w-40 bg-white border border-[#e2e2e2] rounded-md shadow-lg z-50 py-1.5 flex flex-col animate-scale-in text-[#1a1c1c]">
                {['Active', 'Closed', 'Archived'].map(status => {
                  const isChosen = selectedStatus === status;
                  return (
                    <button
                      key={status}
                      onClick={() => {
                        setSelectedStatus(status);
                        setActiveDropdown(null);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded hover:bg-[#f5f5f6] transition-colors text-left ${
                        isChosen ? 'bg-[#3b66c5]/5 text-[#3b66c5] font-semibold' : 'text-[#1a1c1c]'
                      }`}
                    >
                      <span>{status}</span>
                      {isChosen && <Check className="h-3.5 w-3.5 text-[#3b66c5] flex-shrink-0" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Reset Filters Option */}
          {(selectedOwner || selectedMembers.length > 0 || selectedPortfolio || selectedStatus !== 'Active') && (
            <button 
              onClick={() => {
                setSelectedOwner(null);
                setSelectedMembers([]);
                setSelectedPortfolio(null);
                setSelectedStatus('Active');
              }}
              className="text-xs font-semibold text-[#777777] hover:text-black uppercase tracking-wider ml-1"
            >
              Clear filters
            </button>
          )}

        </div>

      </div>

      {/* Main Content Area - Table */}
      <div className="border border-[#e2e2e2] rounded-lg bg-white overflow-hidden shadow-xs">
        
        {/* Table Container */}
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs select-none">
            <thead>
              <tr className="border-b border-[#e2e2e2] bg-[#fafafb] text-[#5e5e5e] font-semibold">
                
                {/* Name Header */}
                <th className="py-3 px-4 min-w-[200px]">
                  <button 
                    onClick={() => {
                      if (sortField === 'name') {
                        setSortAsc(!sortAsc);
                      } else {
                        setSortField('name');
                        setSortAsc(true);
                      }
                    }}
                    className="flex items-center gap-1 hover:text-black transition-colors"
                  >
                    <span>Name</span>
                    <ArrowUpDown className="h-3.5 w-3.5 opacity-80" />
                  </button>
                </th>

                {/* Members Header */}
                <th className="py-3 px-4">Members</th>

                {/* Portfolios Header */}
                <th className="py-3 px-4">Portfolios</th>

                {/* Last Modified Header */}
                <th className="py-3 px-4 text-right">
                  <button 
                    onClick={() => {
                      if (sortField === 'lastModified') {
                        setSortAsc(!sortAsc);
                      } else {
                        setSortField('lastModified');
                        setSortAsc(false); // Default to newest
                      }
                    }}
                    className="flex items-center gap-1 hover:text-black transition-colors ml-auto"
                  >
                    <span>Last modified</span>
                    <ArrowUpDown className="h-3.5 w-3.5 opacity-80" />
                  </button>
                </th>

              </tr>
            </thead>

            <tbody>
              {filteredProjects.length === 0 ? (
                <tr>
                  <td colSpan="4" className="py-12 text-center text-[#777777] italic bg-white">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <FolderKanban className="h-8 w-8 text-[#c6c6c6]" />
                      <p>No projects matched your criteria.</p>
                      {(selectedOwner || selectedMembers.length > 0 || selectedPortfolio || selectedStatus !== 'Active' || searchQuery) && (
                        <button
                          onClick={() => {
                            setSelectedOwner(null);
                            setSelectedMembers([]);
                            setSelectedPortfolio(null);
                            setSelectedStatus('Active');
                            setSearchQuery('');
                          }}
                          className="mt-1 text-xs text-[#3b66c5] hover:underline font-semibold"
                        >
                          Reset all filters and search query
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredProjects.map((proj) => {
                  // Portfolios column simulation
                  let portText = '-';
                  const index = projects.findIndex(p => p._id === proj._id);
                  if (index % 2 === 0) portText = 'Work Portfolio';

                  // Simulated last modified date
                  const mockDateStr = proj.updatedAt 
                    ? new Date(proj.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
                    : new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });

                  return (
                    <tr 
                      key={proj._id} 
                      className="border-b border-[#e2e2e2] last:border-b-0 hover:bg-[#fafafb]/80 transition-colors group cursor-pointer"
                      onClick={() => {
                        setActiveProjectId(proj._id);
                        setActiveView('project-details');
                      }}
                    >
                      
                      {/* Name Column */}
                      <td className="py-3.5 px-4 font-medium text-[#1a1c1c]">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 bg-[#f5f5f6] border border-[#e2e2e2] rounded flex items-center justify-center text-[#5e5e5e] group-hover:bg-white group-hover:border-[#c6c6c6] transition-colors">
                            <ClipboardList className="h-4.5 w-4.5" />
                          </div>
                          <div>
                            <span className="font-bold text-[#1a1c1c] hover:underline block leading-tight">
                              {proj.name}
                            </span>
                            <span className="text-[10px] text-emerald-600 font-semibold mt-0.5 block">Joined</span>
                          </div>
                        </div>
                      </td>

                      {/* Members Column */}
                      <td className="py-3.5 px-4">
                        {renderAvatarCircles(proj.members)}
                      </td>

                      {/* Portfolios Column */}
                      <td className="py-3.5 px-4 text-[#5e5e5e] font-medium">
                        {portText}
                      </td>

                      {/* Last Modified Column */}
                      <td className="py-3.5 px-4 text-right text-[#777777] font-medium">
                        {mockDateStr}
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

      </div>

      {/* Template Gallery Section */}
      {showTemplates ? (
        <div className="border border-[#e2e2e2] rounded-lg bg-[#fafafb] p-6 space-y-6 animate-fade-in select-none relative">
          
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-[15px] font-bold text-[#1a1c1c]">Explore ready-made templates to jumpstart your next project</h3>
              <p className="text-xs text-[#777777] mt-0.5">Instant one-click workspace set-up pre-filled with outline lists, collaboration targets, and guidelines.</p>
            </div>
            <button 
              onClick={handleDismissTemplates}
              className="text-[#777777] hover:text-black p-1 hover:bg-[#eeeeef] rounded transition-colors"
              title="Dismiss suggestions"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            
            {/* Card 1: Cross-functional plan */}
            <div 
              onClick={() => handleInstantiateTemplate(
                "Cross-functional project plan", 
                "A complete blueprint to track, review, and align multi-department plans, deadlines, and project scope milestones."
              )}
              className="border border-[#e2e2e2] hover:border-[#1a1c1c] rounded-lg p-5 bg-white shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div className="space-y-4">
                <div className="h-10 w-10 bg-[#9969c9]/10 rounded-lg flex items-center justify-center text-[#9969c9]">
                  <ClipboardList className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-[#1a1c1c] group-hover:underline">Cross-functional project plan</h4>
                  <p className="text-[11px] text-[#777777] leading-relaxed">
                    Create tasks, add due dates, and organize work by stage to align teams across your organization.
                  </p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-[#eeeeee] flex items-center justify-between text-[10px] font-bold text-[#3b66c5] uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">
                <span>Instantiate Plan</span>
                <span>+</span>
              </div>
            </div>

            {/* Card 2: 1:1 Meeting agenda */}
            <div 
              onClick={() => handleInstantiateTemplate(
                "1:1 Meeting agenda", 
                "Organize career path reviews, status updates, open issues, and collaborative feedback between manager and team member."
              )}
              className="border border-[#e2e2e2] hover:border-[#1a1c1c] rounded-lg p-5 bg-white shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div className="space-y-4">
                <div className="h-10 w-10 bg-pink-100 rounded-lg flex items-center justify-center text-pink-600">
                  <Users className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-[#1a1c1c] group-hover:underline">1:1 Meeting agenda</h4>
                  <p className="text-[11px] text-[#777777] leading-relaxed">
                    Track agenda items, meeting notes, and next steps so you can keep your conversations focused and meaningful.
                  </p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-[#eeeeee] flex items-center justify-between text-[10px] font-bold text-pink-600 uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">
                <span>Instantiate Agenda</span>
                <span>+</span>
              </div>
            </div>

            {/* Card 3: Meeting agenda */}
            <div 
              onClick={() => handleInstantiateTemplate(
                "Meeting agenda", 
                "Outline goals, track discussion points, assign key takeaways, and outline precise next steps during team kickoffs."
              )}
              className="border border-[#e2e2e2] hover:border-[#1a1c1c] rounded-lg p-5 bg-white shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div className="space-y-4">
                <div className="h-10 w-10 bg-[#3b66c5]/10 rounded-lg flex items-center justify-center text-[#3b66c5]">
                  <BookOpen className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-[#1a1c1c] group-hover:underline">Meeting agenda</h4>
                  <p className="text-[11px] text-[#777777] leading-relaxed">
                    Capture agenda items, next steps, and action items to keep meetings focused and productive.
                  </p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-[#eeeeee] flex items-center justify-between text-[10px] font-bold text-[#3b66c5] uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">
                <span>Instantiate Agenda</span>
                <span>+</span>
              </div>
            </div>

          </div>

          {/* Centered Gallery Trigger */}
          <div className="flex justify-center pt-2">
            <button 
              onClick={() => onNewProject('templates')}
              className="text-xs font-bold text-[#1a1c1c] bg-white border border-[#c6c6c6] hover:bg-[#f3f3f4] px-4 py-2 rounded shadow-xs transition-colors"
            >
              View the template gallery
            </button>
          </div>

        </div>
      ) : (
        <div className="flex justify-center">
          <button 
            onClick={handleResetTemplates}
            className="text-xs font-semibold text-[#777777] hover:text-black border border-dashed border-[#e2e2e2] hover:border-black rounded px-4 py-2 bg-[#fafafb] transition-colors"
          >
            Show Template Gallery Suggestions
          </button>
        </div>
      )}

    </div>
  );
};

export default BrowseProjectsView;
