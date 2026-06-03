import React, { useState } from 'react';
import { 
  Home, 
  Inbox, 
  CheckSquare, 
  Folder, 
  ChevronDown, 
  ChevronRight, 
  LogOut, 
  User, 
  Plus, 
  FolderKanban,
  Menu,
  CheckCircle2,
  Triangle,
  GitMerge,
  Users,
  Calendar,
  Settings,
  UserPlus,
  Sliders,
  ClipboardList,
  Target,
  Activity,
  Play,
  Layers,
  Copy,
  FileText,
  Zap
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ isOpen, activeModule, setActiveModule, activeView, setActiveView, projects = [], activeProjectId, setActiveProjectId, onLogout, onOpenInviteModal, onNewProject, activeTeamId, setActiveTeamId }) => {
  const { user, logout } = useAuth();
  const [projectsExpanded, setProjectsExpanded] = useState(true);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const effectiveUser = user || { email: 'guest@crewflow.com', role: 'Admin' };

  const mainNavItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'inbox', label: 'Inbox', icon: Inbox },
    { id: 'my-tasks', label: 'My tasks', icon: CheckSquare },
    { id: 'projects', label: 'Projects', icon: ClipboardList },
    { id: 'portfolios', label: 'Portfolios', icon: Folder },
  ];

  const modules = [
    { id: 'work', label: 'Work', icon: CheckCircle2 },
    { id: 'strategy', label: 'Strategy', icon: Triangle },
    { id: 'workflow', label: 'Workflow', icon: GitMerge },
    { id: 'people', label: 'People', icon: Users },
  ];

  return (
    <div 
      className={`flex h-full flex-shrink-0 select-none transition-all duration-300 ease-in-out ${
        isOpen 
          ? (isSidebarExpanded ? 'w-[296px] opacity-100 visible' : 'w-[72px] opacity-100 visible') 
          : 'w-0 opacity-0 invisible overflow-hidden'
      }`}
    >
      
      {/* 1. Primary Slim Sidebar */}
      <aside className="w-[72px] h-full bg-[#222325] border-r border-[#2d2e30] flex flex-col items-center py-4 gap-6">

        {/* Modules List */}
        <div className="flex flex-col gap-4 w-full px-2">
          {modules.map((mod) => {
            const Icon = mod.icon;
            const isActive = activeModule === mod.id;
            return (
              <button
                key={mod.id}
                onClick={() => {
                  if (activeModule === mod.id && isSidebarExpanded) {
                    setIsSidebarExpanded(false); // Collapse sub-sidebar if clicking the active module
                  } else {
                    setActiveModule(mod.id);
                    setIsSidebarExpanded(true); // Switch active module and expand sub-sidebar
                    if (mod.id === 'strategy') {
                      setActiveView('goals');
                      setActiveProjectId(null);
                    } else if (mod.id === 'work') {
                      setActiveView('home');
                      setActiveProjectId(null);
                    } else if (mod.id === 'people') {
                      setActiveView('people-directory');
                      setActiveProjectId(null);
                      if (setActiveTeamId) setActiveTeamId(null);
                    } else if (mod.id === 'workflow') {
                      setActiveView('custom-fields');
                      setActiveProjectId(null);
                    }
                  }
                }}
                className="flex flex-col items-center gap-1.5 w-full group"
              >
                <div className={`h-10 w-10 flex items-center justify-center rounded-xl transition-all ${
                  isActive 
                    ? 'bg-[#3b3c3e] text-white shadow-sm' 
                    : 'text-[#8a8b8c] group-hover:bg-[#2d2e30] group-hover:text-white'
                }`}>
                  <Icon className="h-5 w-5" />
                </div>
                <span className={`text-[10px] font-medium transition-colors ${
                  isActive ? 'text-white' : 'text-[#8a8b8c] group-hover:text-[#a5a6a7]'
                }`}>
                  {mod.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* User Session bottom panel */}
        <div className="mt-auto flex flex-col items-center gap-3 w-full px-2 pb-2 relative">
          {/* User Card (Slim) */}
          <button 
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            className={`flex items-center justify-center h-10 w-10 rounded-full text-white border transition-all text-sm font-bold tracking-wider ${
              isProfileMenuOpen 
                ? 'bg-[#3b3c3e] border-[#5e5e5e] shadow-md' 
                : 'bg-neutral-800 border-neutral-700 hover:border-[#5e5e5e]'
            }`}
            title="Profile & Settings"
          >
            {effectiveUser.email.split('@')[0].slice(0, 2).toUpperCase()}
          </button>

          {/* Profile Popover Menu */}
          {isProfileMenuOpen && (
            <>
              {/* Invisible overlay to close on click outside */}
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setIsProfileMenuOpen(false)}
              />
              
              <div className="absolute bottom-2 left-[76px] w-[270px] bg-white border border-[#e2e2e2] rounded-lg shadow-xl z-50 overflow-hidden flex flex-col animate-scale-in text-[#1a1c1c] font-sans">
                
                {/* Header Info */}
                <div className="px-4 pt-3.5 pb-2 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-[#fca5a5] flex items-center justify-center text-[#991b1b] text-base font-bold flex-shrink-0">
                    {effectiveUser.email.split('@')[0].slice(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] font-bold truncate leading-tight flex items-center gap-1.5">
                      <span>{effectiveUser.email === 'guest@crewflow.com' ? 'Guest User' : (effectiveUser.email === 'admin@crewflow.com' ? 'Admin User' : (effectiveUser.email === 'member@crewflow.com' ? 'Member User' : effectiveUser.email.split('@')[0].charAt(0).toUpperCase() + effectiveUser.email.split('@')[0].slice(1)))}</span>
                      <span className="h-2 w-2 rounded-full bg-[#d97706] inline-block flex-shrink-0" />
                    </p>
                    <p className="text-[11px] text-[#777777] truncate mt-0.5">{effectiveUser.email}</p>
                  </div>
                </div>

                {/* Status Block */}
                <div className="px-4 pb-3.5 border-b border-[#e2e2e2]">
                  <button 
                    onClick={() => { setActiveView('my-profile'); setIsProfileMenuOpen(false); }}
                    className="w-full flex items-center justify-center gap-2 px-3 py-1.5 text-xs text-[#1a1c1c] border border-[#c6c6c6] hover:border-black rounded hover:bg-[#f9f9f9] transition-all font-semibold"
                  >
                    <Calendar className="h-4 w-4 text-[#777777]" />
                    <span>Set out of office</span>
                  </button>
                </div>

                {/* Workspace Block */}
                <div className="py-1 border-b border-[#e2e2e2] flex flex-col">
                  {effectiveUser.role === 'Admin' && (
                    <button 
                      onClick={() => { alert('Opening Admin Console...'); setIsProfileMenuOpen(false); }}
                      className="w-full flex items-center gap-3 px-4 py-2 text-xs font-semibold hover:bg-[#f9f9f9] text-[#1a1c1c] transition-colors text-left"
                    >
                      <Sliders className="h-4 w-4 text-[#777777]" />
                      <span>Admin console</span>
                    </button>
                  )}
                  <button 
                    onClick={() => { if(onNewProject) onNewProject(); setIsProfileMenuOpen(false); }}
                    className="w-full flex items-center gap-3 px-4 py-2 text-xs font-semibold hover:bg-[#f9f9f9] text-[#1a1c1c] transition-colors text-left"
                  >
                    <Plus className="h-4 w-4 text-[#777777]" />
                    <span>New workspace</span>
                  </button>
                  {effectiveUser.role === 'Admin' && (
                    <button 
                      onClick={() => { if(onOpenInviteModal) onOpenInviteModal(); setIsProfileMenuOpen(false); }}
                      className="w-full flex items-center gap-3 px-4 py-2 text-xs font-semibold hover:bg-[#f9f9f9] text-[#1a1c1c] transition-colors text-left"
                    >
                      <UserPlus className="h-4 w-4 text-[#777777]" />
                      <span>Invite to CrewFlow</span>
                    </button>
                  )}
                </div>

                {/* Personal Block */}
                <div className="py-1 border-b border-[#e2e2e2] flex flex-col">
                  <button 
                    onClick={() => { setActiveView('my-profile'); setIsProfileMenuOpen(false); }}
                    className="w-full flex items-center gap-3 px-4 py-2 text-xs font-semibold hover:bg-[#f9f9f9] text-[#1a1c1c] transition-colors text-left"
                  >
                    <User className="h-4 w-4 text-[#777777]" />
                    <span>Profile</span>
                  </button>
                  <button 
                    onClick={() => { setActiveView('my-profile'); setIsProfileMenuOpen(false); }}
                    className="w-full flex items-center gap-3 px-4 py-2 text-xs font-semibold hover:bg-[#f9f9f9] text-[#1a1c1c] transition-colors text-left"
                  >
                    <Settings className="h-4 w-4 text-[#777777]" />
                    <span>Settings</span>
                  </button>
                  <button 
                    onClick={() => { alert('Add another account option clicked.'); setIsProfileMenuOpen(false); }}
                    className="w-full flex items-center gap-3 px-4 py-2 text-xs font-semibold hover:bg-[#f9f9f9] text-[#1a1c1c] transition-colors text-left"
                  >
                    <Plus className="h-4 w-4 text-[#777777]" />
                    <span>Add another account</span>
                  </button>
                </div>

                {/* Action Block */}
                <div className="py-1 flex flex-col">
                  <button 
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      logout();
                      if (onLogout) onLogout();
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2 text-xs font-semibold hover:bg-[#f9f9f9] transition-colors text-left text-[#1a1c1c]"
                  >
                    <LogOut className="h-4 w-4 text-[#777777]" />
                    <span>Log out</span>
                  </button>
                </div>

              </div>
            </>
          )}
        </div>

      </aside>

      {/* 2. Secondary Sidebar (Slide-in sub-sidebar) */}
      <aside 
        className={`bg-[#1e1f21] text-[#c5c6c7] flex flex-col border-r border-[#2d2e30] transition-all duration-300 ease-in-out ${
          isSidebarExpanded 
            ? 'w-56 opacity-100 visible' 
            : 'w-0 opacity-0 invisible overflow-hidden border-r-0'
        }`}
      >
        <div className="w-56 h-full flex flex-col">
        


        {/* Navigation Pane */}
        <div className="flex-1 overflow-y-auto py-4 space-y-6">
          
          {/* Work Section */}
          <div className="px-2 space-y-1">
            <h3 className="px-3 mb-2 text-xs font-bold text-[#8a8b8c] capitalize">
              {activeModule}
            </h3>

            {activeModule === 'work' ? (
              <>
                <nav className="space-y-0.5">
                  {mainNavItems.map((item) => {
                    const Icon = item.icon;
                    const isViewActive = activeView === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveView(item.id);
                          setActiveProjectId(null);
                        }}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded text-sm font-medium transition-colors ${
                          isViewActive 
                            ? 'bg-[#3b3c3e] text-white' 
                            : 'hover:bg-[#2d2e30] text-[#a5a6a7] hover:text-white'
                        }`}
                      >
                        <Icon className={`h-4 w-4 ${isViewActive ? 'text-white' : 'text-[#8a8b8c]'}`} />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </nav>

                <div className="mt-4 pt-4 border-t border-[#2d2e30]/50 space-y-1">
                  <div className="flex items-center justify-between px-3 py-1.5">
                    <button 
                      onClick={() => setProjectsExpanded(!projectsExpanded)}
                      className="flex items-center gap-1 text-xs font-semibold text-[#8a8b8c] hover:text-white transition-colors uppercase tracking-wider"
                    >
                      {projectsExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                      <span>Work</span>
                    </button>
                    <button className="text-[#8a8b8c] hover:text-white transition-colors">
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  {projectsExpanded && (
                    <div className="space-y-0.5 pl-1.5">
                      {projects.length === 0 ? (
                        <div className="px-6 py-2 text-xs text-[#6a6b6c] italic">
                          No projects active
                        </div>
                      ) : (
                        projects.map((proj) => {
                          const isProjectActive = activeView === 'project-details' && activeProjectId === proj._id;
                          return (
                            <button
                              key={proj._id}
                              onClick={() => {
                                setActiveProjectId(proj._id);
                                setActiveView('project-details');
                              }}
                              className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                                isProjectActive 
                                  ? 'bg-[#3b3c3e] text-white' 
                                  : 'hover:bg-[#2d2e30] text-[#a5a6a7] hover:text-white'
                              }`}
                            >
                              <FolderKanban className="h-3.5 w-3.5 text-[#8a8b8c]" />
                              <span className="truncate">{proj.name}</span>
                            </button>
                          );
                        })
                      )}
                    </div>
                  )}
                </div>
              </>
            ) : activeModule === 'strategy' ? (
              <>
                <nav className="space-y-0.5">
                  {/* Goals */}
                  <button
                    onClick={() => {
                      setActiveView('goals');
                      setActiveProjectId(null);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded text-sm font-medium transition-colors ${
                      activeView === 'goals' 
                        ? 'bg-[#3b3c3e] text-white' 
                        : 'hover:bg-[#2d2e30] text-[#a5a6a7] hover:text-white'
                    }`}
                  >
                    <Target className={`h-4 w-4 ${activeView === 'goals' ? 'text-white' : 'text-[#8a8b8c]'}`} />
                    <span>Goals</span>
                  </button>

                  {/* Reporting */}
                  <button
                    onClick={() => {
                      setActiveView('reporting');
                      setActiveProjectId(null);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded text-sm font-medium transition-colors ${
                      activeView === 'reporting' 
                        ? 'bg-[#3b3c3e] text-white' 
                        : 'hover:bg-[#2d2e30] text-[#a5a6a7] hover:text-white'
                    }`}
                  >
                    <Activity className={`h-4 w-4 ${activeView === 'reporting' ? 'text-white' : 'text-[#8a8b8c]'}`} />
                    <span>Reporting</span>
                  </button>

                  {/* Resourcing */}
                  <button
                    onClick={() => {
                      setActiveView('resourcing');
                      setActiveProjectId(null);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded text-sm font-medium transition-colors ${
                      activeView === 'resourcing' 
                        ? 'bg-[#3b3c3e] text-white' 
                        : 'hover:bg-[#2d2e30] text-[#a5a6a7] hover:text-white'
                    }`}
                  >
                    <Users className={`h-4 w-4 ${activeView === 'resourcing' ? 'text-white' : 'text-[#8a8b8c]'}`} />
                    <span>Resourcing</span>
                  </button>
                </nav>

                {/* Recent Section */}
                <div className="mt-4 pt-4 border-t border-[#2d2e30]/50 space-y-1">
                  <div className="flex items-center justify-between px-3 py-1.5">
                    <span className="text-[10px] font-semibold text-[#8a8b8c] uppercase tracking-wider">
                      Recent
                    </span>
                    <button 
                      onClick={() => {
                        setActiveView('new-dashboard');
                        setActiveProjectId(null);
                      }}
                      className="text-[#8a8b8c] hover:text-white transition-colors"
                      title="New Dashboard"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <div className="space-y-0.5">
                    {/* My organization */}
                    <button
                      onClick={() => {
                        setActiveView('my-organization');
                        setActiveProjectId(null);
                      }}
                      className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                        activeView === 'my-organization' 
                          ? 'bg-[#3b3c3e] text-white' 
                          : 'hover:bg-[#2d2e30] text-[#a5a6a7] hover:text-white'
                      }`}
                    >
                      <div className="h-2 w-2 rounded-full bg-pink-500" />
                      <span className="truncate">My organization</span>
                    </button>

                    {/* New dashboard */}
                    <button
                      onClick={() => {
                        setActiveView('new-dashboard');
                        setActiveProjectId(null);
                      }}
                      className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                        activeView === 'new-dashboard' 
                          ? 'bg-[#3b3c3e] text-white' 
                          : 'hover:bg-[#2d2e30] text-[#a5a6a7] hover:text-white'
                      }`}
                    >
                      <div className="h-2 w-2 rounded-full bg-purple-500" />
                      <span className="truncate">New dashboard</span>
                    </button>

                    {/* My impact */}
                    <button
                      onClick={() => {
                        setActiveView('my-impact');
                        setActiveProjectId(null);
                      }}
                      className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                        activeView === 'my-impact' 
                          ? 'bg-[#3b3c3e] text-white' 
                          : 'hover:bg-[#2d2e30] text-[#a5a6a7] hover:text-white'
                      }`}
                    >
                      <div className="h-2 w-2 rounded-full bg-blue-500" />
                      <span className="truncate">My impact</span>
                    </button>
                  </div>
                </div>
              </>
            ) : activeModule === 'people' ? (
              <>
                <nav className="space-y-0.5">
                  <button
                    onClick={() => {
                      setActiveView('people-directory');
                      setActiveProjectId(null);
                      if (setActiveTeamId) setActiveTeamId(null);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded text-sm font-medium transition-colors ${
                      activeView === 'people-directory' 
                        ? 'bg-[#3b3c3e] text-white' 
                        : 'hover:bg-[#2d2e30] text-[#a5a6a7] hover:text-white'
                    }`}
                  >
                    <Users className={`h-4 w-4 ${activeView === 'people-directory' ? 'text-white' : 'text-[#8a8b8c]'}`} />
                    <span>Directory</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveView('my-profile');
                      setActiveProjectId(null);
                      if (setActiveTeamId) setActiveTeamId(null);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded text-sm font-medium transition-colors ${
                      activeView === 'my-profile' 
                        ? 'bg-[#3b3c3e] text-white' 
                        : 'hover:bg-[#2d2e30] text-[#a5a6a7] hover:text-white'
                    }`}
                  >
                    <User className={`h-4 w-4 ${activeView === 'my-profile' ? 'text-white' : 'text-[#8a8b8c]'}`} />
                    <span>My Profile</span>
                  </button>
                </nav>

                <div className="mt-4 pt-4 border-t border-[#2d2e30]/50 space-y-1">
                  <div className="flex items-center justify-between px-3 py-1.5">
                    <span className="text-[10px] font-semibold text-[#8a8b8c] uppercase tracking-wider">
                      Teams
                    </span>
                  </div>

                  <div className="space-y-0.5">
                    <button
                      onClick={() => {
                        setActiveView('team-details');
                        setActiveProjectId(null);
                        if (setActiveTeamId) setActiveTeamId('prod-design');
                      }}
                      className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                        activeView === 'team-details' && activeTeamId === 'prod-design'
                          ? 'bg-[#3b3c3e] text-white' 
                          : 'hover:bg-[#2d2e30] text-[#a5a6a7] hover:text-white'
                      }`}
                    >
                      <div className="h-2 w-2 rounded-full bg-emerald-500" />
                      <span className="truncate">Product & Design Team</span>
                    </button>

                    <button
                      onClick={() => {
                        setActiveView('team-details');
                        setActiveProjectId(null);
                        if (setActiveTeamId) setActiveTeamId('engineering');
                      }}
                      className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                        activeView === 'team-details' && activeTeamId === 'engineering'
                          ? 'bg-[#3b3c3e] text-white' 
                          : 'hover:bg-[#2d2e30] text-[#a5a6a7] hover:text-white'
                      }`}
                    >
                      <div className="h-2 w-2 rounded-full bg-indigo-500" />
                      <span className="truncate">Engineering Team</span>
                    </button>
                  </div>
                </div>
              </>
            ) : activeModule === 'workflow' ? (
              <>
                <nav className="space-y-0.5">
                  <button
                    onClick={() => {
                      setActiveView('workflow-templates');
                      setActiveProjectId(null);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded text-sm font-medium transition-colors ${
                      activeView === 'workflow-templates' 
                        ? 'bg-[#3b3c3e] text-white' 
                        : 'hover:bg-[#2d2e30] text-[#a5a6a7] hover:text-white'
                    }`}
                  >
                    <Copy className={`h-4 w-4 ${activeView === 'workflow-templates' ? 'text-white' : 'text-[#8a8b8c]'}`} />
                    <span>Project templates</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveView('workflow-status-templates');
                      setActiveProjectId(null);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded text-sm font-medium transition-colors ${
                      activeView === 'workflow-status-templates' 
                        ? 'bg-[#3b3c3e] text-white' 
                        : 'hover:bg-[#2d2e30] text-[#a5a6a7] hover:text-white'
                    }`}
                  >
                    <Activity className={`h-4 w-4 ${activeView === 'workflow-status-templates' ? 'text-white' : 'text-[#8a8b8c]'}`} />
                    <span>Status templates</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveView('custom-fields');
                      setActiveProjectId(null);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded text-sm font-medium transition-colors ${
                      activeView === 'custom-fields' 
                        ? 'bg-[#3b3c3e] text-white' 
                        : 'hover:bg-[#2d2e30] text-[#a5a6a7] hover:text-white'
                    }`}
                  >
                    <Sliders className={`h-4 w-4 ${activeView === 'custom-fields' ? 'text-white' : 'text-[#8a8b8c]'}`} />
                    <span>Custom fields</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveView('workflow-rules');
                      setActiveProjectId(null);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded text-sm font-medium transition-colors ${
                      activeView === 'workflow-rules' 
                        ? 'bg-[#3b3c3e] text-white' 
                        : 'hover:bg-[#2d2e30] text-[#a5a6a7] hover:text-white'
                    }`}
                  >
                    <Zap className={`h-4 w-4 ${activeView === 'workflow-rules' ? 'text-white' : 'text-[#8a8b8c]'}`} />
                    <span>Rules</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveView('workflow-forms');
                      setActiveProjectId(null);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded text-sm font-medium transition-colors ${
                      activeView === 'workflow-forms' 
                        ? 'bg-[#3b3c3e] text-white' 
                        : 'hover:bg-[#2d2e30] text-[#a5a6a7] hover:text-white'
                    }`}
                  >
                    <ClipboardList className={`h-4 w-4 ${activeView === 'workflow-forms' ? 'text-white' : 'text-[#8a8b8c]'}`} />
                    <span>Forms</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveView('workflow-task-types');
                      setActiveProjectId(null);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded text-sm font-medium transition-colors ${
                      activeView === 'workflow-task-types' 
                        ? 'bg-[#3b3c3e] text-white' 
                        : 'hover:bg-[#2d2e30] text-[#a5a6a7] hover:text-white'
                    }`}
                  >
                    <Layers className={`h-4 w-4 ${activeView === 'workflow-task-types' ? 'text-white' : 'text-[#8a8b8c]'}`} />
                    <span>Task types</span>
                  </button>
                </nav>
              </>
            ) : (
              <div className="px-3 py-4 text-xs text-[#8a8b8c] italic text-center">
                Sub-navigation items for {activeModule} will appear here.
              </div>
            )}
          </div>

        </div>


        </div>
      </aside>

    </div>
  );
};

export default Sidebar;
