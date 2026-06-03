import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Search, 
  RefreshCw, 
  Plus, 
  FolderPlus, 
  X,
  Check,
  CheckCircle2,
  FolderKanban,
  Users,
  UserPlus,
  Layers,
  Target,
  MoreHorizontal,
  Trash2,
  ArrowRight,
  Clock,
  ArrowUpDown,
  Home,
  Inbox,
  CheckSquare,
  MessageSquare,
  Tag,
  LayoutTemplate,
  Menu
} from 'lucide-react';

const Header = ({ 
  activeModule,
  activeView, 
  activeProjectId, 
  projects = [], 
  tasks = [],
  setActiveView,
  setActiveProjectId,
  onRefresh, 
  onNewProject, 
  onNewTask,
  onOpenInviteModal,
  loading,
  onToggleSidebar
}) => {
  const { user } = useAuth();
  const effectiveUser = user || { email: 'guest@crewflow.com', role: 'Admin', _id: 'guest_id' };

  // Determine active section name label
  const getSectionLabel = () => {
    if (!activeModule) return 'Work';
    const labels = {
      work: 'Work',
      strategy: 'Strategy',
      workflow: 'Workflow',
      people: 'People'
    };
    return labels[activeModule.toLowerCase()] || 'Work';
  };

  // Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [searchCategory, setSearchCategory] = useState(null); // 'tasks' | 'projects' | 'people' | 'portfolios' | 'goals' | null
  const [isFocused, setIsFocused] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  // + Create Dropdown State
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const dropdownRef = useRef(null);
  const createDropdownRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsFocused(false);
        setIsMoreOpen(false);
      }
      if (createDropdownRef.current && !createDropdownRef.current.contains(event.target)) {
        setIsCreateOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Display Toast helper
  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Determine active view label
  const getViewLabel = () => {
    if (activeView === 'project-details' && activeProjectId) {
      const activeProj = projects.find(p => p._id === activeProjectId);
      return activeProj ? `Projects / ${activeProj.name}` : 'Project Details';
    }
    switch (activeView) {
      case 'home':
        return 'Home';
      case 'inbox':
        return 'Inbox';
      case 'my-tasks':
        return 'My tasks';
      case 'projects':
        return 'Browse projects';
      case 'portfolios':
        return 'Portfolios';
      case 'goals':
        return 'Goals';
      case 'reporting':
        return 'Reporting';
      case 'resourcing':
        return 'Resourcing';
      case 'new-dashboard':
        return 'New Dashboard';
      case 'my-organization':
        return 'My Organization';
      case 'my-impact':
        return 'My Impact';
      default:
        return 'CrewFlow';
    }
  };

  // List of Navigation Pages for search matching
  const navigationItems = [
    { label: 'Home', view: 'home', icon: Home },
    { label: 'Inbox', view: 'inbox', icon: Inbox },
    { label: 'My Tasks', view: 'my-tasks', icon: CheckSquare },
    { label: 'Browse Projects', view: 'projects', icon: FolderKanban },
    { label: 'Portfolios', view: 'portfolios', icon: Layers }
  ];

  // Dynamic Search Filtering Logic
  const searchResults = useMemo(() => {
    if (!searchQuery.trim() && !searchCategory) return null;

    const q = searchQuery.toLowerCase().trim();
    const results = {
      navigation: [],
      projects: [],
      tasks: [],
      people: [],
      messages: [],
      tags: [],
      templates: []
    };

    // 1. Navigation Matcher (only if category is null or matches navigation context)
    if (!searchCategory) {
      results.navigation = navigationItems.filter(item => 
        item.label.toLowerCase().includes(q)
      );
    }

    // 2. Projects Matcher
    if (!searchCategory || searchCategory === 'projects') {
      results.projects = projects.filter(p => 
        p.name.toLowerCase().includes(q) || 
        (p.description && p.description.toLowerCase().includes(q))
      );
    }

    // 3. Tasks Matcher
    if (!searchCategory || searchCategory === 'tasks') {
      results.tasks = tasks.filter(t => 
        t.title.toLowerCase().includes(q) || 
        (t.description && t.description.toLowerCase().includes(q))
      );
    }

    // 4. People Matcher
    if (!searchCategory || searchCategory === 'people') {
      const uniqueEmails = new Set();
      projects.forEach(p => {
        if (p.members) {
          p.members.forEach(m => {
            const email = typeof m === 'object' ? m.email : m;
            if (email && email.toLowerCase().includes(q)) {
              uniqueEmails.add(email);
            }
          });
        }
      });
      results.people = Array.from(uniqueEmails).map(email => ({
        email,
        initials: email.split('@')[0].slice(0, 2).toUpperCase()
      }));
    }

    // 5. Messages Matcher
    if (!searchCategory || searchCategory === 'messages') {
      results.messages = [
        { id: 'msg_1', title: 'Scope alignment checklist updated', snippet: 'Aaryan added a new milestone definition to your roadmap layout.', sender: 'aaryan@crewflow.com' },
        { id: 'msg_2', title: 'Security audit review schedule', snippet: 'Rotated local signing secrets and verified API endpoints protect middleware configurations.', sender: 'security@crewflow.com' },
        { id: 'msg_3', title: 'Design specifications feedback', snippet: 'Grayscale layout components finalized for workspace custom fields.', sender: 'design@crewflow.com' }
      ].filter(m => m.title.toLowerCase().includes(q) || m.snippet.toLowerCase().includes(q));
    }

    // 6. Tags Matcher
    if (!searchCategory || searchCategory === 'tags') {
      results.tags = [
        { name: 'Launch', color: 'bg-purple-100 text-purple-700 shadow-sm border border-purple-200' },
        { name: 'Monochrome', color: 'bg-gray-100 text-gray-700 shadow-sm border border-gray-200' },
        { name: 'High Priority', color: 'bg-red-100 text-red-700 shadow-sm border border-red-200' },
        { name: 'UI / UX Design', color: 'bg-blue-100 text-blue-700 shadow-sm border border-blue-200' }
      ].filter(t => t.name.toLowerCase().includes(q));
    }

    // 7. Templates Matcher
    if (!searchCategory || searchCategory === 'templates') {
      results.templates = [
        { name: 'Cross-functional project plan', desc: 'Jumpstart multi-department alignment plans.' },
        { name: '1:1 Meeting agenda', desc: 'Conduct structured 1:1 check-ins.' },
        { name: 'Meeting agenda', desc: 'Draft meeting minutes and action items.' }
      ].filter(t => t.name.toLowerCase().includes(q) || t.desc.toLowerCase().includes(q));
    }

    return results;
  }, [searchQuery, searchCategory, projects, tasks]);

  // Click handler for navigation result
  const handleNavClick = (view, projectId = null) => {
    if (setActiveView) setActiveView(view);
    if (setActiveProjectId) setActiveProjectId(projectId);
    setIsFocused(false);
    setSearchQuery('');
    setSearchCategory(null);
  };

  // Pill configurations
  const filterPills = [
    { id: 'tasks', label: 'Tasks', icon: CheckCircle2, borderClass: 'border-[#8cb04b] text-[#8cb04b] hover:bg-[#8cb04b]/5' },
    { id: 'projects', label: 'Projects', icon: FolderKanban, borderClass: 'border-[#3b66c5] text-[#3b66c5] hover:bg-[#3b66c5]/5' },
    { id: 'people', label: 'People', icon: Users, borderClass: 'border-[#9969c9] text-[#9969c9] hover:bg-[#9969c9]/5' },
    { id: 'portfolios', label: 'Portfolios', icon: Layers, borderClass: 'border-[#e78686] text-[#e78686] hover:bg-[#e78686]/5' },
    { id: 'goals', label: 'Goals', icon: Target, borderClass: 'border-[#d49833] text-[#d49833] hover:bg-[#d49833]/5' },
  ];

  const createOptions = [
    { 
      id: 'task', 
      label: 'Task', 
      icon: CheckCircle2, 
      action: () => {
        if (onNewTask) onNewTask();
      }
    },
    { 
      id: 'project', 
      label: 'Project', 
      icon: FolderKanban, 
      action: () => {
        if (onNewProject) onNewProject();
      }
    },
    { 
      id: 'message', 
      label: 'Message', 
      icon: MessageSquare, 
      action: () => {
        if (setActiveView) setActiveView('inbox');
      }
    },
    { 
      id: 'portfolio', 
      label: 'Portfolio', 
      icon: Layers, 
      action: () => {
        if (setActiveView) setActiveView('portfolios');
      }
    },
    { 
      id: 'goal', 
      label: 'Goal', 
      icon: Target, 
      action: () => {
        if (setActiveView) setActiveView('goals');
      }
    },
    { 
      id: 'invite', 
      label: 'Invite', 
      icon: UserPlus, 
      action: () => {
        if (onOpenInviteModal) onOpenInviteModal();
      }
    }
  ];

  return (
    <header className="h-14 border-b border-[#2d2e30] bg-[#1e1f21] text-white flex items-center justify-between pl-0 pr-6 select-none flex-shrink-0 relative z-30">
      
      {/* Left aligned brand & controls */}
      <div className="flex items-center h-full">
        {/* 1. Sidebar Toggle Hamburger Button slot (aligned with slim sidebar width of 72px) */}
        <div className="w-[72px] h-full flex items-center justify-center border-r border-[#2d2e30] flex-shrink-0">
          <button
            onClick={onToggleSidebar}
            className="text-gray-300 hover:text-white hover:bg-white/10 p-1.5 rounded transition-colors"
            title="Minimize/Expand Sidebar"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>

        {/* 2. Brand Group & Active Section (aligned with sub-sidebar content starting at 72px) */}
        <div className="flex items-center gap-3 pl-5 h-full">
          {/* Brand Group: Logo + Brand Name */}
          <div className="flex items-center gap-2 flex-shrink-0 pr-3.5 border-r border-[#2d2e30] h-8">
            {/* Brand Logo (Inverted to White with Screen Blending for perfect dark-mode integration) */}
            <img 
              src="/logo.png" 
              alt="CrewFlow Logo" 
              className="h-6 w-auto object-contain invert mix-blend-screen opacity-95 hover:opacity-100 transition-opacity"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
            {/* CrewFlow Brand Name Text */}
            <span className="text-sm font-extrabold tracking-tight text-white select-none">
              Crew<span className="text-[#3b66c5]">Flow</span>
            </span>
          </div>

          {/* Active Section Name */}
          <h1 className="text-xs font-bold text-gray-300 tracking-wide uppercase px-2 py-0.5 bg-white/5 border border-white/10 rounded flex-shrink-0">
            {getSectionLabel()}
          </h1>
        </div>
      </div>

      {/* Global Advanced Interactive Search Bar */}
      <div className="hidden md:block relative" ref={dropdownRef}>
        
        {/* Search Input Container Box */}
        <div className={`flex items-center border rounded-full transition-all duration-300 px-3.5 py-1.5 w-80 ${
          isFocused 
            ? 'w-[520px] bg-white border-[#3b66c5] ring-1 ring-[#3b66c5]' 
            : 'bg-white/10 border-transparent hover:bg-white/15'
        }`}>
          <Search className={`h-4 w-4 flex-shrink-0 mr-2 ${isFocused ? 'text-gray-500' : 'text-gray-300'}`} />
          
          {/* Active Search Category Tag */}
          {searchCategory && (
            <span className="flex items-center gap-1 bg-[#3b66c5]/10 text-[#3b66c5] text-[10px] font-bold px-2.5 py-0.5 rounded-full mr-2 select-none border border-[#3b66c5]/25">
              <span>{searchCategory.charAt(0).toUpperCase() + searchCategory.slice(1)}</span>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setSearchCategory(null);
                }} 
                className="hover:text-black rounded-full"
              >
                <X className="w-2.5 h-2.5" />
              </button>
            </span>
          )}

          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            placeholder={searchCategory ? `Search in ${searchCategory}...` : "Search..."}
            className={`w-full text-xs bg-transparent border-none focus:ring-0 outline-none p-0 ${
              isFocused ? 'text-[#1a1c1c] placeholder-gray-400' : 'text-white placeholder-gray-300'
            }`}
          />
          
          {/* Input control actions (Clear / Focus Out) */}
          {(searchQuery || searchCategory) && (
            <button 
              onClick={() => {
                setSearchQuery('');
                setSearchCategory(null);
              }} 
              className="text-[#777777] hover:text-black p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Floating Search Popover Dropdown (Matches Screenshot) */}
        {isFocused && (
          <div className="absolute left-0 mt-2 w-[520px] bg-white border border-[#e2e2e2] rounded-xl shadow-2xl z-50 py-4 px-5 flex flex-col gap-5 animate-scale-in text-[#1a1c1c] max-h-[460px] overflow-y-auto">
            
            {/* 1. Category Pills Row */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between text-[10px] uppercase font-bold text-[#8a8b8c] tracking-wider">
                <span>Filter search by</span>
              </div>
              <div className="flex items-center flex-wrap gap-2">
                {filterPills.map((pill) => {
                  const IconComponent = pill.icon;
                  const isActive = searchCategory === pill.id;
                  return (
                    <button
                      key={pill.id}
                      onClick={() => setSearchCategory(isActive ? null : pill.id)}
                      className={`flex items-center gap-1.5 px-3 py-1 border rounded-full text-xs font-semibold transition-all ${
                        isActive 
                          ? 'bg-black border-black text-white' 
                          : pill.borderClass
                      }`}
                    >
                      <IconComponent className="h-3.5 w-3.5" />
                      <span>{pill.label}</span>
                    </button>
                  );
                })}

                {/* More Action with Dropdown Popover */}
                <div className="relative">
                  <button
                    onClick={() => setIsMoreOpen(!isMoreOpen)}
                    className={`flex items-center gap-1.5 px-3 py-1 border rounded-full text-xs font-semibold transition-all ${
                      isMoreOpen || ['messages', 'tags', 'templates'].includes(searchCategory)
                        ? 'bg-black border-black text-white font-bold'
                        : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <MoreHorizontal className="h-3.5 w-3.5" />
                    <span>More</span>
                  </button>

                  {isMoreOpen && (
                    <div className="absolute left-0 mt-1.5 w-40 bg-white border border-[#e2e2e2] rounded-lg shadow-xl z-50 py-1.5 flex flex-col animate-scale-in text-[#1a1c1c] font-sans">
                      
                      {/* Messages Option */}
                      <button
                        onClick={() => {
                          setSearchCategory('messages');
                          setIsMoreOpen(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs hover:bg-[#f5f5f6] text-left transition-colors font-semibold text-[#1a1c1c]"
                      >
                        <MessageSquare className="h-4 w-4 text-[#777777]" />
                        <span>Messages</span>
                      </button>

                      {/* Tags Option */}
                      <button
                        onClick={() => {
                          setSearchCategory('tags');
                          setIsMoreOpen(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs hover:bg-[#f5f5f6] text-left transition-colors font-semibold text-[#1a1c1c]"
                      >
                        <Tag className="h-4 w-4 text-[#777777]" />
                        <span>Tags</span>
                      </button>

                      {/* Templates Option */}
                      <button
                        onClick={() => {
                          setSearchCategory('templates');
                          setIsMoreOpen(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs hover:bg-[#f5f5f6] text-left transition-colors font-semibold text-[#1a1c1c]"
                      >
                        <LayoutTemplate className="h-4 w-4 text-[#777777]" />
                        <span>Templates</span>
                      </button>

                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 2. Search Results List (If Query/Category is active) OR Default State (Screenshot recents/saved) */}
            {searchResults ? (
              <div className="space-y-4">
                
                {/* Navigation matches */}
                {searchResults.navigation.length > 0 && (
                  <div className="space-y-1.5">
                    <h3 className="text-[10px] uppercase font-bold text-[#8a8b8c] tracking-wider">Navigation</h3>
                    <div className="space-y-0.5">
                      {searchResults.navigation.map((item, idx) => {
                        const Icon = item.icon;
                        return (
                          <button
                            key={idx}
                            onClick={() => handleNavClick(item.view)}
                            className="w-full flex items-center gap-3 px-3 py-2 text-xs rounded hover:bg-[#f5f5f6] text-left transition-colors font-semibold"
                          >
                            <Icon className="h-4 w-4 text-[#777777]" />
                            <span>Go to {item.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Project matches */}
                {searchResults.projects.length > 0 && (
                  <div className="space-y-1.5">
                    <h3 className="text-[10px] uppercase font-bold text-[#8a8b8c] tracking-wider">Projects</h3>
                    <div className="space-y-0.5">
                      {searchResults.projects.map((proj) => (
                        <button
                          key={proj._id}
                          onClick={() => handleNavClick('project-details', proj._id)}
                          className="w-full flex items-center justify-between px-3 py-2 text-xs rounded hover:bg-[#f5f5f6] text-left transition-colors font-semibold"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <FolderKanban className="h-4 w-4 text-[#3b66c5] flex-shrink-0" />
                            <span className="truncate">{proj.name}</span>
                          </div>
                          <span className="text-[9px] text-[#777777] bg-gray-100 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">Project</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Task matches */}
                {searchResults.tasks.length > 0 && (
                  <div className="space-y-1.5">
                    <h3 className="text-[10px] uppercase font-bold text-[#8a8b8c] tracking-wider">Tasks</h3>
                    <div className="space-y-0.5">
                      {searchResults.tasks.map((task) => (
                        <button
                          key={task._id}
                          onClick={() => handleNavClick('my-tasks')}
                          className="w-full flex items-center justify-between px-3 py-2 text-xs rounded hover:bg-[#f5f5f6] text-left transition-colors font-semibold"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <CheckCircle2 className="h-4 w-4 text-[#8cb04b] flex-shrink-0" />
                            <span className="truncate">{task.title}</span>
                          </div>
                          <span className="text-[9px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-100 font-bold uppercase tracking-wider">{task.priority}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* People matches */}
                {searchResults.people.length > 0 && (
                  <div className="space-y-1.5">
                    <h3 className="text-[10px] uppercase font-bold text-[#8a8b8c] tracking-wider">People</h3>
                    <div className="space-y-0.5">
                      {searchResults.people.map((p, idx) => (
                        <div
                          key={idx}
                          className="w-full flex items-center gap-3 px-3 py-2 text-xs rounded hover:bg-[#f5f5f6] transition-colors font-semibold select-none cursor-default"
                        >
                          <div className="h-6 w-6 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-[9px] font-bold">
                            {p.initials}
                          </div>
                          <span>{p.email}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Message matches */}
                {searchResults.messages && searchResults.messages.length > 0 && (
                  <div className="space-y-1.5">
                    <h3 className="text-[10px] uppercase font-bold text-[#8a8b8c] tracking-wider">Messages</h3>
                    <div className="space-y-0.5">
                      {searchResults.messages.map((msg) => (
                        <button
                          key={msg.id}
                          onClick={() => handleNavClick('inbox')}
                          className="w-full flex items-center justify-between px-3 py-2 text-xs rounded hover:bg-[#f5f5f6] text-left transition-colors font-semibold"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <MessageSquare className="h-4.5 w-4.5 text-[#777777] flex-shrink-0" />
                            <div className="truncate">
                              <p className="truncate font-bold leading-tight">{msg.title}</p>
                              <p className="text-[10px] text-[#777777] truncate font-normal mt-0.5">{msg.snippet}</p>
                            </div>
                          </div>
                          <span className="text-[9px] text-[#777777] italic flex-shrink-0 ml-2">{msg.sender.split('@')[0]}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tag matches */}
                {searchResults.tags && searchResults.tags.length > 0 && (
                  <div className="space-y-1.5">
                    <h3 className="text-[10px] uppercase font-bold text-[#8a8b8c] tracking-wider">Tags</h3>
                    <div className="flex flex-wrap gap-2 px-3 py-1 bg-white">
                      {searchResults.tags.map((tag, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            setSearchQuery(tag.name);
                            setSearchCategory('tasks');
                          }}
                          className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-transparent shadow-xs transition-transform hover:scale-105 ${tag.color}`}
                        >
                          # {tag.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Template matches */}
                {searchResults.templates && searchResults.templates.length > 0 && (
                  <div className="space-y-1.5">
                    <h3 className="text-[10px] uppercase font-bold text-[#8a8b8c] tracking-wider">Templates</h3>
                    <div className="space-y-0.5">
                      {searchResults.templates.map((tpl, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleNavClick('projects')}
                          className="w-full flex items-center justify-between px-3 py-2 text-xs rounded hover:bg-[#f5f5f6] text-left transition-colors font-semibold"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <LayoutTemplate className="h-4.5 w-4.5 text-[#9969c9] flex-shrink-0" />
                            <div className="truncate">
                              <p className="truncate font-bold leading-tight">{tpl.name}</p>
                              <p className="text-[10px] text-[#777777] truncate font-normal mt-0.5">{tpl.desc}</p>
                            </div>
                          </div>
                          <span className="text-[9px] text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded border border-purple-100 font-bold uppercase tracking-wider">Template</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Empty State */}
                {searchResults.navigation.length === 0 && 
                 searchResults.projects.length === 0 && 
                 searchResults.tasks.length === 0 && 
                 searchResults.people.length === 0 &&
                 (!searchResults.messages || searchResults.messages.length === 0) &&
                 (!searchResults.tags || searchResults.tags.length === 0) &&
                 (!searchResults.templates || searchResults.templates.length === 0) && (
                  <div className="py-8 text-center text-xs text-[#777777] italic">
                    No results found matching "{searchQuery}"
                  </div>
                )}

              </div>
            ) : (
              <>
                {/* Default View: Recents & Saved searches */}
                
                {/* 3. Recents Section */}
                <div className="space-y-2">
                  <h3 className="text-[10px] uppercase font-bold text-[#8a8b8c] tracking-wider">Recents</h3>
                  <div className="space-y-0.5">
                    {projects.length === 0 ? (
                      <div className="text-xs text-[#777777] italic px-3 py-1">No recent items available</div>
                    ) : (
                      projects.slice(0, 3).map((proj) => {
                        // Generate avatar initials
                        const firstEmail = proj.members?.[0]?.email || 'guest@crewflow.com';
                        const firstInit = firstEmail.split('@')[0].slice(0, 2).toUpperCase();
                        
                        return (
                          <button
                            key={proj._id}
                            onClick={() => handleNavClick('project-details', proj._id)}
                            className="w-full flex items-center justify-between px-3 py-2 rounded hover:bg-[#f5f5f6] text-left transition-colors group"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="h-6 w-6 bg-[#f3f3f4] group-hover:bg-white rounded flex items-center justify-center text-[#777777]">
                                <FolderKanban className="h-4 w-4" />
                              </div>
                              <span className="text-xs font-bold text-[#1a1c1c] truncate">{proj.name}</span>
                            </div>
                            
                            <div className="flex items-center gap-1 flex-shrink-0">
                              <div className="h-5 w-5 rounded-full bg-pink-100 text-pink-700 flex items-center justify-center text-[8px] font-bold">
                                {firstInit}
                              </div>
                              <span className="text-[#c6c6c6] text-[10px]">...</span>
                            </div>
                          </button>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* 4. Saved Searches Section */}
                <div className="space-y-2 pt-2 border-t border-[#eeeeee]">
                  <h3 className="text-[10px] uppercase font-bold text-[#8a8b8c] tracking-wider">Saved searches</h3>
                  <div className="flex flex-wrap gap-2">
                    
                    {/* Saved 1 */}
                    <button
                      onClick={() => {
                        setSearchCategory('tasks');
                        setSearchQuery("Tasks I've created");
                      }}
                      className="flex items-center gap-1.5 px-3 py-1 bg-gray-100 hover:bg-gray-200 border border-transparent rounded text-xs font-bold text-[#5e5e5e] transition-colors"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>Tasks I've created</span>
                    </button>

                    {/* Saved 2 */}
                    <button
                      onClick={() => {
                        setSearchCategory('tasks');
                        setSearchQuery("Tasks I've assigned to others");
                      }}
                      className="flex items-center gap-1.5 px-3 py-1 bg-gray-100 hover:bg-gray-200 border border-transparent rounded text-xs font-bold text-[#5e5e5e] transition-colors"
                    >
                      <ArrowRight className="h-3.5 w-3.5" />
                      <span>Tasks I've assigned to others</span>
                    </button>

                    {/* Saved 3 */}
                    <button
                      onClick={() => {
                        setSearchCategory('tasks');
                        setSearchQuery("Recently completed tasks");
                      }}
                      className="flex items-center gap-1.5 px-3 py-1 bg-gray-100 hover:bg-gray-200 border border-transparent rounded text-xs font-bold text-[#5e5e5e] transition-colors"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                      <span>Recently completed tasks</span>
                    </button>

                    {/* Saved 4 */}
                    <button
                      onClick={() => triggerToast("Trash is currently empty. No deleted items found.")}
                      className="flex items-center gap-1.5 px-3 py-1 bg-gray-100 hover:bg-gray-200 border border-transparent rounded text-xs font-bold text-[#5e5e5e] transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5 text-red-600" />
                      <span>Deleted</span>
                    </button>

                  </div>
                </div>
              </>
            )}

          </div>
        )}

      </div>

      {/* Primary Actions & Controls */}
      <div className="flex items-center gap-3">
        
        {/* + Create Button Container (Ref'd for click-away) */}
        <div className="relative" ref={createDropdownRef}>
          {/* Pill Button */}
          <button
            onClick={() => setIsCreateOpen(!isCreateOpen)}
            className="flex items-center gap-2 px-3 py-1.5 bg-[#f06a6a] hover:bg-[#e25c5c] active:scale-95 text-white rounded-full font-bold text-xs shadow-md shadow-red-500/10 transition-all duration-200"
            title="Create a new task, project, message, portfolio, goal or invite teammate"
          >
            {/* White Circle with Red Plus Icon */}
            <div className="h-4 w-4 rounded-full bg-white flex items-center justify-center text-[#f06a6a] shadow-xs flex-shrink-0">
              <Plus className="h-2.5 w-2.5 stroke-[3]" />
            </div>
            <span className="pr-0.5">Create</span>
          </button>

          {/* Floating Dropdown Popover */}
          {isCreateOpen && (
            <div className="absolute right-0 mt-2 w-44 bg-white border border-[#e2e2e2] rounded-lg shadow-xl z-50 py-1.5 flex flex-col animate-scale-in text-[#1a1c1c] font-sans">
              {createOptions.map((opt) => {
                const IconComponent = opt.icon;
                return (
                  <button
                    key={opt.id}
                    onClick={() => {
                      opt.action();
                      setIsCreateOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-3.5 py-2.5 text-xs hover:bg-[#f5f5f6] text-left transition-colors font-semibold text-[#1c1d1f]"
                  >
                    <IconComponent className="h-4 w-4 text-[#5e5e5e] flex-shrink-0" />
                    <span>{opt.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Refresh Trigger */}
        <button
          onClick={onRefresh}
          disabled={loading}
          className="p-2 rounded border border-[#2d2e30] text-gray-400 hover:text-white hover:bg-white/5 active:bg-white/10 transition-colors"
          title="Refresh Workspace"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
        </button>

      </div>

      {/* Floating Info Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-black text-white px-4 py-2.5 rounded shadow-lg text-xs font-semibold z-50 animate-fade-in flex items-center gap-2">
          <Clock className="w-3.5 h-3.5 text-yellow-400" />
          <span>{toastMessage}</span>
        </div>
      )}

    </header>
  );
};

export default Header;

