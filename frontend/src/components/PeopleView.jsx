import React, { useState, useEffect } from 'react';
import { 
  Users, User, Settings, Calendar, ClipboardList, CheckCircle2, 
  X, Plus, Mail, Shield, Monitor, Info, Link2, 
  Clock, Check, Key, Moon, Sun, Lock, ArrowRight, 
  HelpCircle, Bell, Sparkles, Zap, Award, Edit2, CheckCircle
} from 'lucide-react';

const COVER_GRADIENTS = [
  { id: 'slate', label: 'Monochrome Slate', css: 'bg-gradient-to-r from-slate-800 to-slate-900' },
  { id: 'charcoal', label: 'Charcoal Frost', css: 'bg-gradient-to-r from-[#1e1f21] via-[#2d2e30] to-[#1e1f21]' },
  { id: 'glass', label: 'Frosted Aurora', css: 'bg-gradient-to-r from-zinc-700 via-neutral-800 to-zinc-900' },
  { id: 'steel', label: 'Steel Grayscale', css: 'bg-gradient-to-r from-zinc-400 via-neutral-500 to-zinc-600' },
  { id: 'silver', label: 'Silver Lining', css: 'bg-gradient-to-r from-stone-200 to-stone-400 text-black' },
  { id: 'dark-core', label: 'Midnight Deep', css: 'bg-gradient-to-r from-black via-neutral-900 to-black' }
];

const MOCK_AVATARS = [
  { id: 'red', label: 'Soft Coral', bg: 'bg-[#fca5a5] text-[#991b1b]' },
  { id: 'blue', label: 'Royal Ice', bg: 'bg-[#93c5fd] text-[#1e3a8a]' },
  { id: 'emerald', label: 'Mint Leaf', bg: 'bg-[#a7f3d0] text-[#065f46]' },
  { id: 'purple', label: 'Lavender Dusk', bg: 'bg-[#c084fc] text-[#581c87]' },
  { id: 'amber', label: 'Sunset Amber', bg: 'bg-[#fcd34d] text-[#78350f]' },
  { id: 'slate', label: 'Industrial Steel', bg: 'bg-[#94a3b8] text-[#1e293b]' }
];

const MOCK_DIRECT_MEMBERS = [
  { _id: 'guest_id', name: 'Guest User', email: 'guest@crewflow.com', role: 'Admin', title: 'Principal Product Manager', dept: 'Product & Design', ooo: false },
  { _id: 'member_id_1', name: 'Member User', email: 'member@crewflow.com', role: 'Member', title: 'Senior Software Engineer', dept: 'Engineering', ooo: false, oooStart: '', oooEnd: '', oooMsg: '' },
  { _id: 'admin_id_1', name: 'Admin User', email: 'admin@crewflow.com', role: 'Admin', title: 'VP of Technology', dept: 'Operations & Engineering', ooo: false }
];

const PeopleView = ({ view, setActiveView, projects = [], tasks = [], token }) => {
  // 1. Current Active States (Saved persistently in localStorage)
  const [profileSettings, setProfileSettings] = useState(() => {
    const saved = localStorage.getItem('crewflow_user_profile');
    return saved ? JSON.parse(saved) : {
      fullName: 'Guest User',
      pronouns: 'He/Him',
      jobTitle: 'Principal Product Manager',
      department: 'Product & Design',
      manager: 'Tech Lead Org',
      about: 'A passionate manager optimizing processes and building premium grayscale task workspaces for collaboration.',
      coverId: 'slate',
      avatarId: 'red'
    };
  });

  const [oooSettings, setOooSettings] = useState(() => {
    const saved = localStorage.getItem('crewflow_ooo_settings');
    return saved ? JSON.parse(saved) : {
      active: false,
      startDate: '2026-06-15',
      endDate: '2026-06-20',
      awayMessage: 'I am currently away with limited access to email. For urgent production items, please contact tech-support@crewflow.com.',
      autoReply: true
    };
  });

  const [notificationSettings, setNotificationSettings] = useState(() => {
    const saved = localStorage.getItem('crewflow_notification_settings');
    return saved ? JSON.parse(saved) : {
      emailUpdates: true,
      browserAlerts: true,
      pushAlerts: false,
      activityFeed: true,
      dndActive: false,
      dndSchedule: '5-pm-9-am' // 'none' | '5-pm-9-am' | 'weekend'
    };
  });

  const [displaySettings, setDisplaySettings] = useState(() => {
    const saved = localStorage.getItem('crewflow_display_settings');
    return saved ? JSON.parse(saved) : {
      theme: 'light', // 'light' | 'dark' | 'frost'
      rowNumbers: true,
      compactMode: false,
      highContrast: false
    };
  });

  const [appsSettings, setAppsSettings] = useState(() => {
    const saved = localStorage.getItem('crewflow_apps_settings');
    return saved ? JSON.parse(saved) : {
      slack: true,
      gdrive: true,
      figma: false,
      zoom: false,
      outlook: false
    };
  });

  const [hacksSettings, setHacksSettings] = useState(() => {
    const saved = localStorage.getItem('crewflow_hacks_settings');
    return saved ? JSON.parse(saved) : {
      confetti: true,
      shortcuts: false,
      analogClock: false,
      bionic: false
    };
  });

  // Local interactive views states
  const [profileTab, setProfileTab] = useState('about'); // 'about' | 'tasks' | 'collaborators'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState(null); // When viewing directory member profile
  
  // Modals Visibility
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [settingsTab, setSettingsTab] = useState('profile'); // 'profile' | 'notification' | 'email' | 'account' | 'display' | 'apps' | 'hacks'
  const [showOooModal, setShowOooModal] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);

  // Time calculations
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Sync to localstorage
  useEffect(() => {
    localStorage.setItem('crewflow_user_profile', JSON.stringify(profileSettings));
  }, [profileSettings]);

  useEffect(() => {
    localStorage.setItem('crewflow_ooo_settings', JSON.stringify(oooSettings));
  }, [oooSettings]);

  useEffect(() => {
    localStorage.setItem('crewflow_notification_settings', JSON.stringify(notificationSettings));
  }, [notificationSettings]);

  useEffect(() => {
    localStorage.setItem('crewflow_display_settings', JSON.stringify(displaySettings));
  }, [displaySettings]);

  useEffect(() => {
    localStorage.setItem('crewflow_apps_settings', JSON.stringify(appsSettings));
  }, [appsSettings]);

  useEffect(() => {
    localStorage.setItem('crewflow_hacks_settings', JSON.stringify(hacksSettings));
  }, [hacksSettings]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleTaskCheck = (taskId) => {
    if (hacksSettings.confetti) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2500);
    }
    showToast("Task updated successfully!");
  };

  // Helper for Bionic Reading Mode (Experimental Hack!)
  const renderText = (str) => {
    if (!hacksSettings.bionic || !str) return str;
    return str.split(' ').map((word, idx) => {
      if (word.length === 0) return null;
      const mid = Math.max(1, Math.ceil(word.length * 0.4));
      const boldPart = word.substring(0, mid);
      const regularPart = word.substring(mid);
      return (
        <span key={idx} className="mr-1 inline-block">
          <strong className="font-extrabold text-black">{boldPart}</strong>
          <span>{regularPart}</span>
        </span>
      );
    });
  };

  // Get active directory lists combining state users & mocks
  const usersList = MOCK_DIRECT_MEMBERS;

  // Render Directory View
  const renderDirectory = () => {
    const filteredUsers = usersList.filter(u => 
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.title && u.title.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-6 border-b border-[#e2e2e2]">
          <div>
            <h2 className="text-2xl font-bold text-[#1a1c1c] tracking-tight">{renderText("Workspace Directory")}</h2>
            <p className="text-xs text-[#777777] mt-0.5">{renderText("View active colleagues, their job assignments, and real-time availability states.")}</p>
          </div>
          <button 
            onClick={() => {
              setSelectedUser(null);
              setSettingsTab('profile');
              setShowSettingsModal(true);
            }}
            className="flex items-center gap-1.5 px-4 py-2 bg-black hover:bg-neutral-800 text-white rounded text-xs font-bold shadow-xs transition-colors"
          >
            <Settings className="h-3.5 w-3.5" />
            <span>{renderText("Edit My Profile Settings")}</span>
          </button>
        </div>

        {/* Directory Search & Statistics bar */}
        <div className="flex flex-wrap gap-4 items-center justify-between bg-white border border-[#e2e2e2] rounded-lg p-4 shadow-2xs">
          <div className="relative flex-1 min-w-[280px]">
            <input 
              type="text"
              placeholder="Search by name, email, or job title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs py-2 px-3 bg-[#f9f9f9] border border-[#e2e2e2] rounded focus:border-black outline-none transition-all placeholder-[#a5a6a7] text-black"
            />
          </div>
          <div className="flex items-center gap-6 text-[11px] text-[#5e5e5e] font-semibold uppercase tracking-wider">
            <span>Total Members: {usersList.length}</span>
            <span>Away: {usersList.filter(u => u.ooo).length}</span>
            <span>Active Roles: Admin & Members</span>
          </div>
        </div>

        {/* Members Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredUsers.map((member) => {
            // Find matched settings if the user is Me
            const isMe = member._id === 'guest_id';
            const nameToDisplay = isMe ? profileSettings.fullName : member.name;
            const titleToDisplay = isMe ? profileSettings.jobTitle : member.title;
            const deptToDisplay = isMe ? profileSettings.department : member.dept;
            const avatarSetting = isMe ? MOCK_AVATARS.find(a => a.id === profileSettings.avatarId) : MOCK_AVATARS[member._id === 'member_id_1' ? 3 : 4];
            
            // Check Out-of-office status
            const isAway = isMe ? oooSettings.active : member.ooo;
            const initials = nameToDisplay.slice(0, 2).toUpperCase();

            // Count their active tasks
            const assignedTasks = tasks.filter(t => {
              const taskAssigneeId = typeof t.assignedTo === 'object' ? t.assignedTo._id : t.assignedTo;
              return taskAssigneeId === member._id && t.status !== 'Done';
            });

            return (
              <div 
                key={member._id}
                className="border border-[#e2e2e2] bg-white rounded-xl overflow-hidden hover:shadow-md transition-all group flex flex-col justify-between"
              >
                <div>
                  {/* Small colored Cover Banner */}
                  <div className={`h-16 w-full ${isMe ? COVER_GRADIENTS.find(g => g.id === profileSettings.coverId)?.css || 'bg-slate-800' : 'bg-gradient-to-r from-zinc-700 to-zinc-900'}`} />
                  
                  {/* Photo & Identity section */}
                  <div className="px-5 pb-2 -mt-8 relative flex items-end justify-between">
                    <div className={`h-16 w-16 rounded-full border-4 border-white flex items-center justify-center text-lg font-bold shadow-md select-none ${avatarSetting?.bg || 'bg-neutral-800 text-white'}`}>
                      {initials}
                      {isAway && (
                        <div className="absolute bottom-0 right-0 h-4.5 w-4.5 rounded-full bg-amber-500 border-2 border-white flex items-center justify-center" title="Away">
                          <Clock className="h-2.5 w-2.5 text-white" />
                        </div>
                      )}
                    </div>
                    {isAway && (
                      <span className="text-[9px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 uppercase tracking-wider">
                        Away
                      </span>
                    )}
                  </div>

                  <div className="px-5 pt-3 space-y-1.5 text-left">
                    <h3 className="font-bold text-[#1a1c1c] text-sm group-hover:underline">{nameToDisplay}</h3>
                    <p className="text-[11px] text-[#5e5e5e] font-semibold">{titleToDisplay}</p>
                    <p className="text-[10px] text-gray-400 font-medium">{deptToDisplay}</p>
                    <div className="text-[10px] text-gray-500 pt-1 flex items-center gap-1.5">
                      <Mail className="h-3 w-3" />
                      <span>{member.email}</span>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0 mt-5 border-t border-[#eeeeee]">
                  <div className="flex items-center justify-between text-[11px] text-[#777777] mb-4">
                    <span>Active Workloads</span>
                    <span className="font-bold text-[#1a1c1c]">{assignedTasks.length} open tasks</span>
                  </div>
                  <button 
                    onClick={() => {
                      setSelectedUser(member);
                      setProfileTab('about');
                      setActiveView('my-profile');
                    }}
                    className="w-full text-center py-2 border border-[#c6c6c6] hover:border-black text-[#5e5e5e] hover:text-black rounded text-[11px] font-bold transition-colors uppercase tracking-wider"
                  >
                    View Full Profile
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Render User Profile View
  const renderUserProfile = () => {
    // Determine user subject
    const activeTarget = selectedUser || { _id: 'guest_id', name: 'Guest User', email: 'guest@crewflow.com', role: 'Admin' };
    const isMe = activeTarget._id === 'guest_id';
    
    // Load local settings if me, else static mocks
    const uName = isMe ? profileSettings.fullName : activeTarget.name;
    const uTitle = isMe ? profileSettings.jobTitle : activeTarget.title;
    const uDept = isMe ? profileSettings.department : activeTarget.dept;
    const uPronouns = isMe ? profileSettings.pronouns : 'He/Him';
    const uManager = isMe ? profileSettings.manager : 'VP Administration';
    const uAbout = isMe ? profileSettings.about : 'Dedicated workspace teammate specializing in structural systems engineering and visual Grayscale themes.';
    const uAvatar = isMe ? MOCK_AVATARS.find(a => a.id === profileSettings.avatarId) : MOCK_AVATARS[activeTarget._id === 'member_id_1' ? 3 : 4];
    const uCover = isMe ? COVER_GRADIENTS.find(g => g.id === profileSettings.coverId)?.css || 'bg-slate-800' : 'bg-gradient-to-r from-zinc-700 to-zinc-900';

    // Out of Office variables
    const isAway = isMe ? oooSettings.active : activeTarget.ooo;
    const sDate = isMe ? oooSettings.startDate : activeTarget.oooStart;
    const eDate = isMe ? oooSettings.endDate : activeTarget.oooEnd;
    const awayMsg = isMe ? oooSettings.awayMessage : activeTarget.oooMsg;

    const initials = uName.slice(0, 2).toUpperCase();

    // Filters for tasks
    const activeTasks = tasks.filter(t => {
      const taskAssigneeId = typeof t.assignedTo === 'object' ? t.assignedTo._id : t.assignedTo;
      return taskAssigneeId === activeTarget._id;
    });

    return (
      <div className="space-y-6">
        
        {/* Giant Cover header & Identity Banner */}
        <div className="bg-white border border-[#e2e2e2] rounded-xl overflow-hidden shadow-2xs relative">
          
          {/* Cover gradient */}
          <div className={`h-56 w-full relative transition-all ${uCover}`} />

          {/* Profile Details header */}
          <div className="p-6 relative flex flex-col md:flex-row md:items-start justify-between gap-6 text-left">
            <div className="flex flex-col md:flex-row md:items-start gap-5">
              {/* Avatar shifted up to overlap cover photo */}
              <div className="-mt-20 relative flex-shrink-0">
                <div className={`h-28 w-28 rounded-full border-4 border-white flex items-center justify-center text-3xl font-extrabold shadow-xl select-none ${uAvatar?.bg || 'bg-neutral-800 text-white'}`}>
                  {initials}
                  {isAway && (
                    <div className="absolute bottom-1.5 right-1.5 h-6 w-6 rounded-full bg-amber-500 border-2 border-white flex items-center justify-center" title="Away Out-Of-Office">
                      <Clock className="h-3.5 w-3.5 text-white" />
                    </div>
                  )}
                </div>
              </div>
              
              {/* User details information (not shifted upward) */}
              <div className="space-y-1 pb-2">
                <div className="flex items-center gap-2.5">
                  <h2 className="text-2xl font-black text-[#1a1c1c] tracking-tight">{renderText(uName)}</h2>
                  <span className="text-[10px] text-gray-400 font-semibold px-2 py-0.5 border border-[#e2e2e2] rounded">{renderText(uPronouns)}</span>
                </div>
                <p className="text-xs text-black font-bold uppercase tracking-wider">{renderText(uTitle)}</p>
                <p className="text-[11px] text-[#777777] font-semibold">{renderText(uDept)}</p>
                
                {/* Small Edit Profile / Set Out of Office directly under details */}
                {isMe && (
                  <div className="pt-2 flex flex-wrap items-center gap-2">
                    <button 
                      onClick={() => {
                        setSettingsTab('profile');
                        setShowSettingsModal(true);
                      }}
                      className="flex items-center gap-1 px-2.5 py-1 bg-white border border-[#c6c6c6] hover:border-black text-[#5e5e5e] hover:text-black rounded text-[10px] font-bold transition-all shadow-3xs"
                    >
                      <Edit2 className="h-3 w-3" />
                      <span>Edit Profile</span>
                    </button>
                    
                    <button 
                      onClick={() => setShowOooModal(true)}
                      className="flex items-center gap-1 px-2.5 py-1 bg-white border border-[#c6c6c6] hover:border-black text-[#5e5e5e] hover:text-black rounded text-[10px] font-bold transition-all shadow-3xs"
                    >
                      <Calendar className="h-3 w-3" />
                      <span>Set Out of Office</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions Panel for other users */}
            {!isMe && (
              <div className="flex flex-wrap gap-2.5 pb-2">
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    showToast("Profile link copied!");
                  }}
                  className="flex items-center gap-1 px-2.5 py-1 bg-white border border-[#c6c6c6] hover:border-black text-[#5e5e5e] hover:text-black rounded text-[10px] font-bold transition-all"
                >
                  <Link2 className="h-3.5 w-3.5" />
                  <span>{renderText("Copy Link")}</span>
                </button>
              </div>
            )}
          </div>

          {/* Out of Office active notification banner */}
          {isAway && (
            <div className="mx-6 mb-6 p-4 rounded-xl border border-amber-200 bg-amber-50 text-left flex items-start gap-3">
              <div className="h-8 w-8 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0 text-amber-700">
                <Clock className="h-4.5 w-4.5" />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-amber-800">
                  {renderText("Teammate Status: Currently Away")} (Scheduled: {sDate} to {eDate})
                </p>
                <p className="text-[11px] text-amber-700 font-semibold leading-relaxed">
                  "{awayMsg}"
                </p>
              </div>
            </div>
          )}

          {/* Profile Navigation Tabs */}
          <div className="flex border-t border-[#eeeeee] px-6">
            {['about', 'tasks', 'collaborators'].map((tab) => (
              <button
                key={tab}
                onClick={() => setProfileTab(tab)}
                className={`py-3.5 px-4 text-xs font-bold border-b-2 capitalize transition-all ${
                  profileTab === tab 
                    ? 'border-black text-black' 
                    : 'border-transparent text-gray-400 hover:text-black'
                }`}
              >
                {tab === 'collaborators' ? 'Collaborators & Projects' : tab}
              </button>
            ))}
          </div>

        </div>

        {/* Tab contents */}
        {profileTab === 'about' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            {/* About Bio Left Section */}
            <div className="md:col-span-2 bg-white border border-[#e2e2e2] rounded-xl p-6 space-y-4">
              <h3 className="text-sm font-bold text-black uppercase tracking-wider">{renderText("About me")}</h3>
              <p className="text-xs text-[#5e5e5e] leading-relaxed font-medium bg-[#fafafb] border border-[#e2e2e2] p-4 rounded-lg italic">
                "{renderText(uAbout)}"
              </p>
              <div className="pt-4 border-t border-[#eeeeee] space-y-3">
                <h4 className="text-[11px] font-bold text-[#777777] uppercase tracking-wider">{renderText("Key Core Skills")}</h4>
                <div className="flex flex-wrap gap-2">
                  {['Product Architecture', 'Systems Engineering', 'Visual Design', 'Agile Operations'].map((skill, index) => (
                    <span key={index} className="text-[10px] font-bold text-slate-800 bg-slate-100 border border-slate-200 px-3 py-1 rounded-full">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Profile Sidebar Right Info Card */}
            <div className="bg-white border border-[#e2e2e2] rounded-xl p-6 space-y-5">
              <h3 className="text-sm font-bold text-black uppercase tracking-wider border-b border-[#eeeeee] pb-3">{renderText("About")}</h3>
              
              <div className="space-y-4 text-xs">
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-0.5">{renderText("Job Title")}</label>
                  <p className="font-bold text-[#1a1c1c]">{renderText(uTitle)}</p>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-0.5">{renderText("Department / Team")}</label>
                  <p className="font-bold text-[#1a1c1c]">{renderText(uDept)}</p>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-0.5">{renderText("Manager / Mentor")}</label>
                  <p className="font-bold text-[#1a1c1c]">{renderText(uManager)}</p>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-0.5">{renderText("Out of office status")}</label>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <div className={`h-2 w-2 rounded-full ${isAway ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                    <span className="font-bold text-[#1a1c1c]">{isAway ? 'Away' : 'Active and available'}</span>
                  </div>
                </div>
                <div className="pt-2 border-t border-[#eeeeee]">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">{renderText("Local Teammate Clock")}</label>
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-stone-700 bg-stone-50 border border-stone-200 p-2.5 rounded">
                    <Clock className="h-4 w-4 text-[#777777]" />
                    <span>{currentTime.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit' })} (UTC +05:30)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {profileTab === 'tasks' && (
          <div className="bg-white border border-[#e2e2e2] rounded-xl overflow-hidden text-left shadow-2xs">
            <div className="p-5 border-b border-[#eeeeee] flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-black uppercase tracking-wider">{renderText("Assigned Tasks Panel")}</h3>
                <p className="text-[11px] text-[#777777] mt-0.5">{renderText("Review and update tasks currently assigned to this colleague.")}</p>
              </div>
              <span className="text-[11px] font-bold text-white bg-black px-2.5 py-1 rounded">
                {activeTasks.length} Active Tasks
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#fafafb] border-b border-[#e2e2e2] text-[#5e5e5e] font-semibold">
                    <th className="py-3 px-4">Task Name</th>
                    <th className="py-3 px-4">Workspace Project</th>
                    <th className="py-3 px-4">Due Date</th>
                    <th className="py-3 px-4">Priority</th>
                    <th className="py-3 px-4 text-right">Interactive Action</th>
                  </tr>
                </thead>
                <tbody>
                  {activeTasks.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="py-8 text-center text-[#777777] italic bg-white">
                        No active tasks currently assigned.
                      </td>
                    </tr>
                  ) : (
                    activeTasks.map((task) => {
                      const projName = typeof task.projectId === 'object' ? task.projectId.name : (projects.find(p => p._id === task.projectId)?.name || 'CrewFlow Workspace');
                      const formattedDate = new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
                      
                      // Priority color maps
                      const prioColor = task.priority === 'High' 
                        ? 'text-rose-600 bg-rose-50 border-rose-200' 
                        : task.priority === 'Medium'
                          ? 'text-amber-600 bg-amber-50 border-amber-200'
                          : 'text-slate-600 bg-slate-50 border-slate-200';

                      return (
                        <tr key={task._id} className="border-b border-[#eeeeee] last:border-0 hover:bg-[#fafafb]/50 transition-colors">
                          <td className="py-3.5 px-4 font-bold text-black flex items-center gap-2">
                            <button 
                              onClick={() => handleTaskCheck(task._id)}
                              className="text-gray-300 hover:text-emerald-500 transition-colors"
                              title="Mark Done"
                            >
                              <CheckCircle className="h-4.5 w-4.5" />
                            </button>
                            <span>{renderText(task.title)}</span>
                          </td>
                          <td className="py-3.5 px-4 font-semibold text-[#5e5e5e]">{projName}</td>
                          <td className="py-3.5 px-4 font-semibold text-gray-500">{formattedDate}</td>
                          <td className="py-3.5 px-4">
                            <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold border ${prioColor}`}>
                              {task.priority}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <button 
                              onClick={() => handleTaskCheck(task._id)}
                              className="text-[10px] font-bold text-white bg-neutral-800 hover:bg-black px-3 py-1.5 rounded transition-colors uppercase tracking-wider"
                            >
                              Complete Task
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {profileTab === 'collaborators' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
            {/* Collaborators list */}
            <div className="bg-white border border-[#e2e2e2] rounded-xl p-6 space-y-4 shadow-2xs">
              <h3 className="text-sm font-bold text-black uppercase tracking-wider border-b border-[#eeeeee] pb-3">{renderText("Frequent Collaborators")}</h3>
              <div className="space-y-3.5">
                {usersList.filter(u => u._id !== activeTarget._id).map(user => {
                  const targetInitials = user.name.slice(0, 2).toUpperCase();
                  return (
                    <div key={user._id} className="flex items-center justify-between border-b border-[#fafafa] pb-3 last:border-b-0 last:pb-0">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-xs font-bold">
                          {targetInitials}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-black">{user.name}</p>
                          <p className="text-[10px] text-gray-400 font-semibold">{user.title || 'Technical Specialist'}</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => {
                          setSelectedUser(user);
                          setProfileTab('about');
                        }}
                        className="text-[10px] font-bold text-[#3b66c5] hover:underline"
                      >
                        Profile
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Active Projects Member of */}
            <div className="bg-white border border-[#e2e2e2] rounded-xl p-6 space-y-4 shadow-2xs">
              <h3 className="text-sm font-bold text-black uppercase tracking-wider border-b border-[#eeeeee] pb-3">{renderText("Joined Workspace Projects")}</h3>
              {projects.length === 0 ? (
                <p className="text-xs text-[#777777] italic py-6 text-center">No active projects joined yet.</p>
              ) : (
                <div className="space-y-3">
                  {projects.map(proj => (
                    <div key={proj._id} className="flex items-center justify-between bg-[#fafafb] border border-[#e2e2e2] rounded-lg p-3">
                      <div className="flex items-center gap-2.5">
                        <div className="h-7 w-7 rounded bg-white border border-gray-300 flex items-center justify-center text-slate-800">
                          <ClipboardList className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-black">{proj.name}</p>
                          <p className="text-[9px] text-[#777777] font-semibold">{proj.members?.length || 0} Members active</p>
                        </div>
                      </div>
                      <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-wider bg-emerald-50 px-2 py-0.5 border border-emerald-200 rounded">
                        Active
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    );
  };

  // Render Out-Of-Office Modal popup
  const renderOooModal = () => {
    if (!showOooModal) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs select-none">
        <div className="bg-white border border-[#e2e2e2] rounded-xl p-6 shadow-2xl max-w-md w-full text-left relative animate-scale-in">
          
          <button 
            onClick={() => setShowOooModal(false)}
            className="absolute top-4 right-4 text-[#777777] hover:text-black rounded p-1 hover:bg-[#f3f3f4] transition-all"
          >
            <X className="h-4.5 w-4.5" />
          </button>

          <div className="mb-4">
            <h3 className="text-base font-bold text-[#1a1c1c] capitalize flex items-center gap-1.5">
              <Calendar className="h-5 w-5 text-amber-500" />
              <span>Configure Out of Office Status</span>
            </h3>
            <p className="text-[10px] text-[#777777]">Set your away schedule and custom response status alert cards.</p>
          </div>

          <form onSubmit={(e) => {
            e.preventDefault();
            setShowOooModal(false);
            showToast("Out of office schedule updated successfully!");
          }} className="space-y-4 text-xs font-medium text-slate-700">
            
            {/* Toggle active state */}
            <div className="flex items-center justify-between bg-stone-50 border border-stone-200 rounded-lg p-3">
              <div>
                <label className="font-bold text-black block">Enable Out of Office Status</label>
                <span className="text-[9px] text-[#777777]">Toggles your visual status indicator across modules.</span>
              </div>
              <input 
                type="checkbox"
                checked={oooSettings.active}
                onChange={(e) => setOooSettings({...oooSettings, active: e.target.checked})}
                className="h-4 w-4 accent-black rounded cursor-pointer"
              />
            </div>

            {/* Date ranges */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#5e5e5e] mb-1.5">Start Date</label>
                <input 
                  type="date"
                  required
                  value={oooSettings.startDate}
                  onChange={(e) => setOooSettings({...oooSettings, startDate: e.target.value})}
                  className="w-full text-xs p-2 border border-gray-300 rounded outline-none focus:border-black text-black bg-white"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#5e5e5e] mb-1.5">End Date (Inclusive)</label>
                <input 
                  type="date"
                  required
                  value={oooSettings.endDate}
                  onChange={(e) => setOooSettings({...oooSettings, endDate: e.target.value})}
                  className="w-full text-xs p-2 border border-gray-300 rounded outline-none focus:border-black text-black bg-white"
                />
              </div>
            </div>

            {/* Away status message */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#5e5e5e] mb-1.5">Away Status message</label>
              <textarea 
                rows="3"
                value={oooSettings.awayMessage}
                onChange={(e) => setOooSettings({...oooSettings, awayMessage: e.target.value})}
                placeholder="Describe your availability guidelines..."
                className="w-full text-xs p-2.5 border border-gray-300 rounded outline-none focus:border-black text-black bg-white"
              />
            </div>

            {/* Auto response settings */}
            <div className="flex items-center gap-2">
              <input 
                type="checkbox"
                id="autoReplyToggle"
                checked={oooSettings.autoReply}
                onChange={(e) => setOooSettings({...oooSettings, autoReply: e.target.checked})}
                className="h-3.5 w-3.5 accent-black rounded"
              />
              <label htmlFor="autoReplyToggle" className="text-[10px] text-gray-500 font-bold cursor-pointer">
                Send automatic updates to collaborators on assigned tasks
              </label>
            </div>

            {/* Submissions */}
            <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-[#eeeeee]">
              <button 
                type="button" 
                onClick={() => setShowOooModal(false)}
                className="rounded border border-[#c6c6c6] px-3.5 py-1.5 font-bold text-[#5e5e5e] hover:bg-[#f3f3f4] transition-all"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="rounded bg-black hover:bg-neutral-800 text-white px-4 py-2 font-bold transition-all shadow-xs"
              >
                Save Schedule
              </button>
            </div>

          </form>

        </div>
      </div>
    );
  };

  // Render My Settings Modal (upscrolled & downscrolled tabs)
  const renderSettingsModal = () => {
    if (!showSettingsModal) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs select-none">
        <div className="bg-white border border-[#e2e2e2] rounded-xl shadow-2xl max-w-4xl w-full h-[80vh] flex overflow-hidden animate-scale-in text-left">
          
          {/* Sidebar tabs */}
          <aside className="w-56 bg-[#fafafb] border-r border-[#e2e2e2] py-4 flex flex-col justify-between">
            <div>
              <div className="px-5 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">My Settings</div>
              <nav className="px-2 space-y-0.5">
                {[
                  { id: 'profile', label: 'Profile settings' },
                  { id: 'notification', label: 'Notifications' },
                  { id: 'email', label: 'Email Forwarding' },
                  { id: 'account', label: 'Account info' },
                  { id: 'display', label: 'Display & theme' },
                  { id: 'apps', label: 'Apps integrated' },
                  { id: 'hacks', label: 'Developer Hacks' }
                ].map((tab) => {
                  const isActive = settingsTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setSettingsTab(tab.id)}
                      className={`w-full flex items-center px-4 py-2 rounded text-xs font-bold text-left transition-colors ${
                        isActive 
                          ? 'bg-black text-white' 
                          : 'text-[#5e5e5e] hover:bg-[#eeeeef] hover:text-black'
                      }`}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </nav>
            </div>
            
            <div className="px-5 text-[10px] text-gray-400 font-semibold uppercase tracking-wider">
              CrewFlow v1.8.2
            </div>
          </aside>

          {/* Settings Canvas main */}
          <main className="flex-1 flex flex-col min-h-0 bg-white">
            
            {/* Header toolbar */}
            <div className="p-5 border-b border-[#eeeeee] flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-[#1a1c1c] capitalize">{settingsTab} settings</h3>
                <p className="text-[10px] text-[#777777]">Customize parameters to tailor your workspace environment.</p>
              </div>
              <button 
                onClick={() => setShowSettingsModal(false)}
                className="text-[#777777] hover:text-black rounded p-1 hover:bg-[#f3f3f4] transition-all"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            {/* Scrollable inputs wrapper */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* Tab 1: Profile */}
              {settingsTab === 'profile' && (
                <form onSubmit={(e) => { e.preventDefault(); setShowSettingsModal(false); showToast("Profile settings saved!"); }} className="space-y-4 text-xs font-medium text-slate-700">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-[#5e5e5e] mb-1.5">Full Name</label>
                      <input 
                        type="text"
                        required
                        value={profileSettings.fullName}
                        onChange={(e) => setProfileSettings({...profileSettings, fullName: e.target.value})}
                        className="w-full text-xs p-2 border border-gray-300 rounded outline-none focus:border-black text-black bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-[#5e5e5e] mb-1.5">Pronouns</label>
                      <input 
                        type="text"
                        value={profileSettings.pronouns}
                        onChange={(e) => setProfileSettings({...profileSettings, pronouns: e.target.value})}
                        className="w-full text-xs p-2 border border-gray-300 rounded outline-none focus:border-black text-black bg-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-[#5e5e5e] mb-1.5">Job Title</label>
                      <input 
                        type="text"
                        value={profileSettings.jobTitle}
                        onChange={(e) => setProfileSettings({...profileSettings, jobTitle: e.target.value})}
                        className="w-full text-xs p-2 border border-gray-300 rounded outline-none focus:border-black text-black bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-[#5e5e5e] mb-1.5">Department</label>
                      <input 
                        type="text"
                        value={profileSettings.department}
                        onChange={(e) => setProfileSettings({...profileSettings, department: e.target.value})}
                        className="w-full text-xs p-2 border border-gray-300 rounded outline-none focus:border-black text-black bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#5e5e5e] mb-1.5">Manager / Report Lead</label>
                    <input 
                      type="text"
                      value={profileSettings.manager}
                      onChange={(e) => setProfileSettings({...profileSettings, manager: e.target.value})}
                      className="w-full text-xs p-2 border border-gray-300 rounded outline-none focus:border-black text-black bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#5e5e5e] mb-1.5">About Me Biography</label>
                    <textarea 
                      rows="3"
                      value={profileSettings.about}
                      onChange={(e) => setProfileSettings({...profileSettings, about: e.target.value})}
                      className="w-full text-xs p-2.5 border border-gray-300 rounded outline-none focus:border-black text-black bg-white"
                    />
                  </div>

                  {/* Gradient select */}
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#5e5e5e] mb-2">My Profile Cover Gradient</label>
                    <div className="grid grid-cols-3 gap-2">
                      {COVER_GRADIENTS.map((grad) => (
                        <button
                          key={grad.id}
                          type="button"
                          onClick={() => setProfileSettings({...profileSettings, coverId: grad.id})}
                          className={`p-2 rounded text-left border text-[10px] font-bold transition-all relative flex flex-col justify-between ${
                            profileSettings.coverId === grad.id ? 'border-black bg-neutral-50 shadow-sm' : 'border-gray-200 bg-white hover:border-black'
                          }`}
                        >
                          <span className="block mb-2">{grad.label}</span>
                          <div className={`h-4 w-full rounded ${grad.css}`} />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Avatar selection */}
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#5e5e5e] mb-2">Workspace Avatar Theme</label>
                    <div className="grid grid-cols-6 gap-2">
                      {MOCK_AVATARS.map((av) => (
                        <button
                          key={av.id}
                          type="button"
                          onClick={() => setProfileSettings({...profileSettings, avatarId: av.id})}
                          className={`h-12 w-full flex items-center justify-center rounded-lg border text-xs font-black transition-all ${
                            profileSettings.avatarId === av.id ? 'border-black ring-2 ring-black bg-neutral-50' : 'border-gray-200 hover:border-black'
                          } ${av.bg}`}
                        >
                          {profileSettings.fullName.slice(0,2).toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end pt-4 border-t border-[#eeeeee]">
                    <button 
                      type="submit"
                      className="rounded bg-black hover:bg-neutral-800 text-white px-5 py-2 font-bold transition-all shadow-xs"
                    >
                      Save Profile Modifications
                    </button>
                  </div>
                </form>
              )}

              {/* Tab 2: Notifications */}
              {settingsTab === 'notification' && (
                <div className="space-y-6 text-xs text-left font-medium text-slate-700">
                  <div className="space-y-3.5">
                    <h4 className="text-[11px] font-bold text-black uppercase tracking-wider">Alert Channels</h4>
                    
                    {[
                      { id: 'emailUpdates', label: 'Email status notifications', desc: 'Receive weekly task summaries and system digests directly in inbox.' },
                      { id: 'browserAlerts', label: 'Browser popup warnings', desc: 'Enable native push updates when tasks are marked overdue.' },
                      { id: 'pushAlerts', label: 'Mobile alerts forwarding', desc: 'Push task updates to integrated mobile devices.' },
                      { id: 'activityFeed', label: 'Include in main feed', desc: 'Show changes I make in the public workspace activity ledger.' }
                    ].map((item) => (
                      <div key={item.id} className="flex items-center justify-between border-b border-[#fafafa] pb-3">
                        <div>
                          <span className="font-bold text-black block">{item.label}</span>
                          <span className="text-[9px] text-[#777777]">{item.desc}</span>
                        </div>
                        <input 
                          type="checkbox"
                          checked={notificationSettings[item.id]}
                          onChange={(e) => {
                            setNotificationSettings({...notificationSettings, [item.id]: e.target.checked});
                            showToast("Alert preferences updated!");
                          }}
                          className="h-4 w-4 accent-black cursor-pointer"
                        />
                      </div>
                    ))}
                  </div>

                  {/* Do not disturb (DND) scheduling */}
                  <div className="pt-4 border-t border-[#eeeeee] space-y-4">
                    <div className="flex items-center justify-between bg-stone-50 border border-stone-200 rounded-lg p-3">
                      <div>
                        <h4 className="font-bold text-black flex items-center gap-1.5">
                          <Bell className="h-4 w-4 text-[#777777]" />
                          <span>Do Not Disturb (DND) status</span>
                        </h4>
                        <p className="text-[9px] text-[#777777]">Pause all browser and email updates to focus on engineering.</p>
                      </div>
                      <input 
                        type="checkbox"
                        checked={notificationSettings.dndActive}
                        onChange={(e) => {
                          setNotificationSettings({...notificationSettings, dndActive: e.target.checked});
                          showToast(e.target.checked ? "DND activated!" : "DND turned off!");
                        }}
                        className="h-4.5 w-4.5 accent-black cursor-pointer"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-[#5e5e5e] mb-1.5">DND Scheduled Hours</label>
                      <select
                        value={notificationSettings.dndSchedule}
                        onChange={(e) => {
                          setNotificationSettings({...notificationSettings, dndSchedule: e.target.value});
                          showToast("DND quiet hours updated!");
                        }}
                        className="w-full text-xs p-2 border border-gray-300 rounded outline-none focus:border-black text-black bg-white"
                      >
                        <option value="none">None (Always available)</option>
                        <option value="5-pm-9-am">Quiet Hours (5:00 PM to 9:00 AM daily)</option>
                        <option value="weekend">Weekends (All day Saturday & Sunday)</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 3: Email Forwarding */}
              {settingsTab === 'email' && (
                <div className="space-y-6 text-xs text-left font-medium text-slate-700">
                  <div className="bg-[#fafafb] border border-[#e2e2e2] rounded-xl p-4 space-y-2">
                    <h4 className="font-extrabold text-black flex items-center gap-1.5">
                      <Mail className="h-4 w-4 text-[#3b66c5]" />
                      <span>Email-to-Task Integration</span>
                    </h4>
                    <p className="text-[10px] text-gray-500 leading-relaxed">
                      You can instantly initialize and assign tasks inside your CrewFlow workspace by forwarding email messages to specific workspace aliases! 
                      Emails sent to these addresses will be parsed to construct a corresponding task card with outline descriptions, targets, and dates automatically mapped.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h5 className="text-[10px] font-bold text-black uppercase tracking-wider border-b border-[#eeeeee] pb-2">Your Workspace Task Aliases</h5>
                    
                    {/* Personal tasks email */}
                    <div className="flex items-center justify-between p-3 border border-gray-200 bg-white rounded-lg">
                      <div>
                        <span className="font-bold text-black block">Forward to Personal Task Board</span>
                        <span className="text-[10px] font-mono text-[#3b66c5]">my-tasks@email.com</span>
                      </div>
                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText("my-tasks@email.com");
                          showToast("Personal alias copied!");
                        }}
                        className="text-[10px] font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded transition-colors uppercase tracking-wider"
                      >
                        Copy Address
                      </button>
                    </div>

                    {/* Active projects email list */}
                    {projects.map(proj => {
                      const projAlias = `${proj.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}@email.com`;
                      return (
                        <div key={proj._id} className="flex items-center justify-between p-3 border border-gray-200 bg-white rounded-lg">
                          <div>
                            <span className="font-bold text-black block">Forward to project: {proj.name}</span>
                            <span className="text-[10px] font-mono text-[#3b66c5]">{projAlias}</span>
                          </div>
                          <button 
                            onClick={() => {
                              navigator.clipboard.writeText(projAlias);
                              showToast(`Alias for ${proj.name} copied!`);
                            }}
                            className="text-[10px] font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded transition-colors uppercase tracking-wider"
                          >
                            Copy Address
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Tab 4: Account Info */}
              {settingsTab === 'account' && (
                <div className="space-y-6 text-xs text-left font-medium text-slate-700">
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-bold text-black uppercase tracking-wider border-b border-[#eeeeee] pb-2">Security Details</h4>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-0.5">Primary Email</label>
                        <p className="font-bold text-[#1a1c1c]">{activeTarget.email}</p>
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-0.5">Account Role</label>
                        <p className="font-bold text-[#1a1c1c]">{activeTarget.role}</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#eeeeee] space-y-4">
                    <h4 className="text-[10px] font-bold text-black uppercase tracking-wider">Account Actions</h4>
                    
                    <div className="flex flex-wrap gap-3">
                      <button 
                        type="button" 
                        onClick={() => alert("Password reset link sent to your workspace email!")}
                        className="rounded border border-[#c6c6c6] hover:border-black px-4 py-2 font-bold text-slate-800 transition-colors uppercase tracking-wider"
                      >
                        Reset Password
                      </button>
                      <button 
                        type="button" 
                        onClick={() => alert("Are you sure? In production this will permanently deactivate your organization access.")}
                        className="rounded border border-red-200 bg-red-50 hover:bg-red-100 hover:border-red-600 px-4 py-2 font-bold text-red-600 transition-colors uppercase tracking-wider"
                      >
                        Deactivate Account
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 5: Display Settings */}
              {settingsTab === 'display' && (
                <div className="space-y-6 text-xs text-left font-medium text-slate-700">
                  {/* Theme selections */}
                  <div className="space-y-3">
                    <h4 className="text-[10px] font-bold text-black uppercase tracking-wider border-b border-[#eeeeee] pb-2">Workspace Theme Styling</h4>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { id: 'light', label: 'CrewFlow Monochrome Light', desc: 'Sleek high-contrast layout matching standard grids.' },
                        { id: 'dark', label: 'Charcoal Deep Dark', desc: 'Minimal background styling designed to reduce eye strain.' },
                        { id: 'frost', label: 'Frosted Glassmorphic', desc: 'Dynamic visual design utilizing translucent panels.' }
                      ].map(thm => (
                        <button
                          key={thm.id}
                          type="button"
                          onClick={() => {
                            setDisplaySettings({...displaySettings, theme: thm.id});
                            showToast(`Workspace theme switched to ${thm.id}!`);
                          }}
                          className={`p-3.5 border rounded-xl text-left flex flex-col justify-between h-28 transition-all ${
                            displaySettings.theme === thm.id ? 'border-black bg-stone-50 shadow-sm' : 'border-gray-200 bg-white hover:border-black'
                          }`}
                        >
                          <span className="font-extrabold text-black block">{thm.label}</span>
                          <span className="text-[9px] text-gray-400 mt-1 block">{thm.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Visual Accessibility toggles */}
                  <div className="pt-4 border-t border-[#eeeeee] space-y-4">
                    <h4 className="text-[10px] font-bold text-black uppercase tracking-wider">Visual & Layout Parameters</h4>
                    
                    {[
                      { id: 'rowNumbers', label: 'Show task grid row numbers', desc: 'Adds line references on project detail worksheets.' },
                      { id: 'compactMode', label: 'Enable compact density layouts', desc: 'Reduces padding and font sizing for high information density.' },
                      { id: 'highContrast', label: 'Contrast enhancement', desc: 'Overtakes grayscale templates to provide absolute whites and blacks.' }
                    ].map(acc => (
                      <div key={acc.id} className="flex items-center justify-between border-b border-[#fafafa] pb-3">
                        <div>
                          <span className="font-bold text-black block">{acc.label}</span>
                          <span className="text-[9px] text-[#777777]">{acc.desc}</span>
                        </div>
                        <input 
                          type="checkbox"
                          checked={displaySettings[acc.id]}
                          onChange={(e) => {
                            setDisplaySettings({...displaySettings, [acc.id]: e.target.checked});
                            showToast("Display preferences applied!");
                          }}
                          className="h-4 w-4 accent-black cursor-pointer"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 6: Integrated Apps */}
              {settingsTab === 'apps' && (
                <div className="space-y-6 text-xs text-left font-medium text-slate-700">
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { id: 'slack', label: 'Slack Connector', desc: 'Post automated notifications when milestones are updated.', category: 'Communication' },
                      { id: 'gdrive', label: 'Google Drive Storage', desc: 'Attach project documents directly from cloud storage.', category: 'Storage' },
                      { id: 'figma', label: 'Figma Design Embeds', desc: 'Embed design assets directly inside strategy boards.', category: 'Design' },
                      { id: 'zoom', label: 'Zoom Video Scheduler', desc: 'Launch team 1:1 meeting rooms directly from calendar tasks.', category: 'Meetings' },
                      { id: 'outlook', label: 'Outlook Calendar sync', desc: 'Export milestone due dates to enterprise calendars.', category: 'Meetings' }
                    ].map(app => {
                      const isConnected = appsSettings[app.id];
                      return (
                        <div key={app.id} className="border border-gray-200 rounded-xl p-4 bg-white hover:border-black transition-all flex flex-col justify-between h-36">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-[9px] font-bold text-emerald-600 uppercase bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                {app.category}
                              </span>
                              <span className={`text-[10px] font-bold ${isConnected ? 'text-emerald-500' : 'text-gray-400'}`}>
                                {isConnected ? '● Connected' : '○ Disconnected'}
                              </span>
                            </div>
                            <div>
                              <span className="font-extrabold text-black block">{app.label}</span>
                              <span className="text-[9px] text-gray-400 leading-normal mt-0.5 block">{app.desc}</span>
                            </div>
                          </div>

                          <button 
                            type="button"
                            onClick={() => {
                              setAppsSettings({...appsSettings, [app.id]: !isConnected});
                              showToast(isConnected ? `${app.label} disconnected!` : `${app.label} connected!`);
                            }}
                            className={`w-full py-1.5 rounded text-[10px] font-bold text-center border transition-colors ${
                              isConnected 
                                ? 'border-red-200 bg-red-50 text-red-600 hover:bg-red-100 hover:border-red-500' 
                                : 'border-gray-200 hover:border-black text-slate-800'
                            }`}
                          >
                            {isConnected ? 'Disconnect' : 'Connect Account'}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Tab 7: Developer Hacks */}
              {settingsTab === 'hacks' && (
                <div className="space-y-6 text-xs text-left font-medium text-slate-700">
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-1">
                    <h4 className="font-extrabold text-amber-900 flex items-center gap-1.5">
                      <Zap className="h-4 w-4 text-amber-500" />
                      <span>Experimental Laboratory Features</span>
                    </h4>
                    <p className="text-[10px] text-amber-700 leading-relaxed">
                      These experimental options add unique interactive visual mechanisms to your CrewFlow workspace. Toggle them on to enhance productivity and feedback!
                    </p>
                  </div>

                  <div className="space-y-4">
                    {[
                      { id: 'confetti', label: 'Confetti Explosions', desc: 'Triggers colorful celebratory confetti particles when completing tasks.', icon: Sparkles },
                      { id: 'shortcuts', label: 'Sidebar keyboard shortcuts drawer', desc: 'Displays handy cheatsheet hotkeys at the bottom of the navigation pane.', icon: HelpCircle },
                      { id: 'analogClock', label: 'Header Analog Clock widget', desc: 'Displays an elegant floating retro analog clock inside the navbar.', icon: Clock },
                      { id: 'bionic', label: 'Bionic Reading Text Mode', desc: 'Bolds initial syllables of word arrays to guide visual focus hyper-optimally.', icon: Award }
                    ].map(hack => {
                      const Icon = hack.icon;
                      return (
                        <div key={hack.id} className="flex items-center justify-between border-b border-[#fafafa] pb-3.5">
                          <div className="flex gap-2.5 items-start">
                            <div className="h-7 w-7 rounded bg-[#fafafb] border border-gray-200 flex items-center justify-center text-slate-700 mt-0.5">
                              <Icon className="h-4 w-4" />
                            </div>
                            <div>
                              <span className="font-bold text-black block">{hack.label}</span>
                              <span className="text-[9px] text-[#777777]">{hack.desc}</span>
                            </div>
                          </div>
                          <input 
                            type="checkbox"
                            checked={hacksSettings[hack.id]}
                            onChange={(e) => {
                              setHacksSettings({...hacksSettings, [hack.id]: e.target.checked});
                              showToast(e.target.checked ? `${hack.label} Enabled!` : `${hack.label} Disabled!`);
                            }}
                            className="h-4 w-4 accent-black cursor-pointer"
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

            </div>
          </main>

        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 overflow-y-auto bg-white px-8 py-8 space-y-8 relative select-none font-sans">
      
      {/* Toast Notification helper */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-black text-white px-4 py-3 rounded-lg shadow-xl flex items-center gap-2 animate-fade-in z-50 text-xs font-bold">
          <CheckCircle className="h-4 w-4 text-green-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Confetti Explosion Animation Panel */}
      {showConfetti && (
        <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center overflow-hidden">
          <div className="absolute animate-ping text-5xl">🥳</div>
          <div className="absolute text-3xl animate-bounce translate-x-20">🎉</div>
          <div className="absolute text-3xl animate-bounce -translate-x-20">✨</div>
          <div className="absolute text-4xl animate-bounce -translate-y-24">🎉</div>
          <div className="absolute text-4xl animate-bounce translate-y-24">✨</div>
        </div>
      )}

      {/* Router views inside people module */}
      {view === 'people-directory' ? renderDirectory() : renderUserProfile()}

      {/* Auxiliary Modals */}
      {renderOooModal()}
      {renderSettingsModal()}

    </div>
  );
};

export default PeopleView;
