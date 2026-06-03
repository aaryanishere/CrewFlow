import React, { useState, useEffect } from 'react';
import { 
  Users, User, Calendar as CalIcon, ClipboardList, CheckCircle2, 
  X, Plus, Mail, Shield, Clock, Check, Edit2, ChevronDown, 
  ChevronRight, Search, FileText, ArrowUpDown, Info, InfoIcon, 
  FolderKanban, MessageSquare, AlertCircle, PlusCircle, Bookmark, ExternalLink
} from 'lucide-react';

const TeamView = ({ activeTeamId, setActiveView, projects = [], tasks = [], token }) => {
  // Team Data Mocks
  const teamInfo = activeTeamId === 'prod-design' ? {
    name: 'Product & Design Team',
    desc: 'Focuses on designing intuitive monochrome visual workspaces, user research, wireframing premium interactions, and defining design guidelines.',
    email: 'product-design@email.com'
  } : {
    name: 'Engineering Team',
    desc: 'Responsible for building robust server APIs, integrating Firebase Auth networks, and optimizing high-performance frontend compilation layers.',
    email: 'engineering@email.com'
  };

  // Local Component States
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'all-work' | 'calendar' | 'messages' | 'members' | 'knowledge' | 'note'
  const [customTabs, setCustomTabs] = useState([]); // Array of added custom tabs (e.g. 'note')
  
  // Overview Tab States
  const [isEditingDesc, setIsEditingDesc] = useState(false);
  const [teamDesc, setTeamDesc] = useState(teamInfo.desc);
  const [showCreateProjDropdown, setShowCreateProjDropdown] = useState(false);
  
  // All Work Tab States
  const [workFilter, setWorkFilter] = useState('All'); // 'All' | 'To Do' | 'In Progress' | 'Done'

  // Messages Tab States
  const [showEmailChangePopover, setShowEmailChangePopover] = useState(false);
  const [emailAlias, setEmailAlias] = useState(teamInfo.email);
  const [messagesList, setMessagesList] = useState([
    { id: 1, author: 'guest@crewflow.com', initial: 'GU', bg: 'bg-[#fca5a5] text-[#991b1b]', content: 'Welcome everyone! I have posted our new Grayscale design assets in the Knowledge tab. Please review them for our upcoming sprint kickoff.', date: '3 days ago', comments: 2 },
    { id: 2, author: 'guest@crewflow.com', initial: 'GU', bg: 'bg-[#fca5a5] text-[#991b1b]', content: 'I have updated the Q3 roadmap scope definitions. Let me know if anyone has questions about the milestones.', date: 'Yesterday', comments: 1 }
  ]);
  const [newMessage, setNewMessage] = useState('');

  // Members Tab States
  const [showSortPopover, setShowSortPopover] = useState(false);
  const [memberSortField, setMemberSortField] = useState('name'); // 'name' | 'role'
  const [showAddFieldPopover, setShowAddFieldPopover] = useState(false);
  const [newFieldName, setNewFieldName] = useState('');
  const [dynamicColumns, setDynamicColumns] = useState([]); // Custom columns added dynamically
  const [showAddMemberPopover, setShowAddMemberPopover] = useState(false);
  const [selectedMemberToInvite, setSelectedMemberToInvite] = useState('');

  const [teamMembers, setTeamMembers] = useState([
    { _id: 'guest_id', name: 'Guest User', email: 'guest@crewflow.com', role: 'Leader', dept: 'Product & Design', customData: {} },
    { _id: 'member_id_1', name: 'Member User', email: 'member@crewflow.com', role: 'Contributor', dept: 'Engineering', customData: {} },
    { _id: 'admin_id_1', name: 'Admin User', email: 'admin@crewflow.com', role: 'Contributor', dept: 'Operations & Engineering', customData: {} }
  ]);

  // Knowledge Tab States
  const [knowledgeState, setKnowledgeState] = useState('with-entry'); // 'no-entry' | 'with-entry'
  const [wikis, setWikis] = useState([
    { id: 1, title: 'Grayscale Branding Specifications', desc: 'Outlines standard HSL grayscale colors, fonts (Inter & Outfit), and opacity tokens.', author: 'Guest User', date: 'May 28, 2026' },
    { id: 2, title: 'Security Protocol Checklist', desc: 'Outlines API route protect middleware requirements and environment validation.', author: 'Guest User', date: 'June 01, 2026' }
  ]);
  const [newWikiTitle, setNewWikiTitle] = useState('');
  const [newWikiDesc, setNewWikiDesc] = useState('');

  // Custom Note Tab States
  const [noteContent, setNoteContent] = useState('');
  const [selectedNoteTemplate, setSelectedNoteTemplate] = useState(null); // 'blank' | 'resources' | 'meeting' | 'weekly'

  // Load template contents for note
  const applyNoteTemplate = (tpl) => {
    setSelectedNoteTemplate(tpl);
    if (tpl === 'blank') {
      setNoteContent('## Custom Team Note\n\nClick here to start drafting your thoughts...');
    } else if (tpl === 'resources') {
      setNoteContent(`## 📌 Team Key Resources

### Useful Repository Links
- [Figma Design Canvas](https://figma.com)
- [CrewFlow Development Backlog](file:///c:/Users/aasth/Desktop/Projects)
- [API REST Endpoint Specs](file:///c:/Users/aasth/Desktop/Projects/CrewFlow%20Team%20Task%20Manager/implementation_plan.md)

### Tech Guidelines
1. Keep visual layouts minimal and grayscaled.
2. Verify frontend compilation runs build cleanly.`);
    } else if (tpl === 'meeting') {
      setNoteContent(`## 📅 Kickoff Meeting Notes
**Date:** ${new Date().toLocaleDateString()}
**Attendees:** Guest User, Member User, Admin User

### 1. Agenda Items
- Review overdue task warning indicators.
- Finalize Asana project templates sections integration.

### 2. Key Discussion Points
- Monochrome palette matches original strategy layouts cleanly.
- Added custom display settings and Hacks tabs.

### 3. Action Items
- [ ] Implement team downbars (Due: Next sprint)
- [ ] Push build to staging verification`);
    } else if (tpl === 'weekly') {
      setNoteContent(`## 🚀 Weekly Planning Ledger

### Core Objectives
1. **Frontend Optimization:** Keep chunks compilation under Rolldown alerts.
2. **Settings Expansion:** Enable DND quiet hour scheduling.

### Team Deliverables
- **Engineering:** Integrate email-to-task aliases.
- **Product:** Verify out-of-office away banners.`);
    }
  };

  const handleTaskComplete = () => {
    alert("Task completed successfully!");
  };

  // Render top header and tabs navigation
  const renderHeader = () => {
    return (
      <div className="space-y-4">
        {/* Title details */}
        <div className="flex items-start justify-between text-left">
          <div className="space-y-1">
            <h2 className="text-2xl font-black text-[#1a1c1c] tracking-tight">{teamInfo.name}</h2>
            <p className="text-xs text-[#5e5e5e] max-w-2xl font-medium">
              {isEditingDesc ? (
                <div className="flex items-start gap-2.5 mt-2">
                  <textarea 
                    value={teamDesc}
                    onChange={(e) => setTeamDesc(e.target.value)}
                    className="w-full text-xs p-2 border border-gray-300 rounded outline-none focus:border-black text-black bg-white"
                    rows="2"
                  />
                  <button 
                    onClick={() => setIsEditingDesc(false)}
                    className="px-3 py-1.5 bg-black hover:bg-neutral-800 text-white rounded text-[10px] font-bold transition-all uppercase tracking-wider"
                  >
                    Save
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span>{teamDesc}</span>
                  <button onClick={() => setIsEditingDesc(true)} className="text-gray-400 hover:text-black">
                    <Edit2 className="h-3 w-3" />
                  </button>
                </div>
              )}
            </p>
          </div>
          
          <div className="flex items-center -space-x-1.5 overflow-hidden">
            {teamMembers.map((m, idx) => (
              <div 
                key={idx}
                className="h-8 w-8 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-xs font-bold shadow-2xs select-none"
                title={m.email}
              >
                {m.name.slice(0, 2).toUpperCase()}
              </div>
            ))}
            <button 
              onClick={() => {
                setActiveTab('members');
                setShowAddMemberPopover(true);
              }}
              className="h-8 w-8 rounded-full bg-stone-50 border-2 border-dashed border-stone-300 hover:border-black flex items-center justify-center text-[#5e5e5e] hover:text-black shadow-2xs transition-colors"
              title="Add member"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Tab row navigation */}
        <div className="flex items-center border-b border-[#e2e2e2] pt-3 relative">
          <nav className="flex space-x-1 overflow-x-auto flex-1 min-w-0 pr-8">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'all-work', label: 'All work' },
              { id: 'calendar', label: 'Calendar' },
              { id: 'messages', label: 'Messages' },
              { id: 'members', label: 'Members' },
              { id: 'knowledge', label: 'Knowledge' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-3 px-4 text-xs font-bold border-b-2 transition-all shrink-0 ${
                  activeTab === tab.id 
                    ? 'border-black text-black' 
                    : 'border-transparent text-gray-400 hover:text-black'
                }`}
              >
                {tab.label}
              </button>
            ))}

            {/* Render dynamically added custom tabs */}
            {customTabs.map(tabId => (
              <div key={tabId} className="relative group shrink-0">
                <button
                  onClick={() => setActiveTab(tabId)}
                  className={`py-3 px-4 text-xs font-bold border-b-2 transition-all capitalize ${
                    activeTab === tabId 
                      ? 'border-black text-black' 
                      : 'border-transparent text-gray-400 hover:text-black'
                  }`}
                >
                  {tabId}
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setCustomTabs(customTabs.filter(t => t !== tabId));
                    if (activeTab === tabId) setActiveTab('overview');
                  }}
                  className="absolute -top-1 right-1 h-3 w-3 bg-[#eeeeef] rounded-full flex items-center justify-center text-[8px] hover:bg-black hover:text-white transition-all opacity-0 group-hover:opacity-100"
                >
                  ×
                </button>
              </div>
            ))}
          </nav>

          {/* Plus Add Tab (+) button */}
          <div className="relative shrink-0">
            <button 
              onClick={() => {
                if (!customTabs.includes('note')) {
                  setCustomTabs([...customTabs, 'note']);
                  setActiveTab('note');
                  applyNoteTemplate('blank');
                } else {
                  setActiveTab('note');
                }
              }}
              className="py-3 px-3.5 text-xs font-black text-gray-400 hover:text-black border-b-2 border-transparent hover:border-black transition-all"
              title="Add Tab (+)"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>

      </div>
    );
  };

  // 1. Overview View
  const renderOverview = () => {
    // Filter projects belonging to the team (simulated)
    const teamProjects = projects;

    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
        
        {/* Projects and Mission description column */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Mission */}
          <div className="bg-white border border-[#e2e2e2] rounded-xl p-6 space-y-3 shadow-2xs">
            <h3 className="text-sm font-bold text-black uppercase tracking-wider">Team Mission</h3>
            <p className="text-xs text-[#5e5e5e] leading-relaxed font-medium bg-[#fafafb] p-4 rounded-lg italic">
              "{teamDesc}"
            </p>
          </div>

          {/* Active Projects Grid */}
          <div className="bg-white border border-[#e2e2e2] rounded-xl p-6 space-y-4 shadow-2xs">
            <div className="flex items-center justify-between border-b border-[#eeeeee] pb-3 relative">
              <h3 className="text-sm font-bold text-black uppercase tracking-wider">Active Team Projects</h3>
              
              <div className="relative">
                <button 
                  onClick={() => setShowCreateProjDropdown(!showCreateProjDropdown)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-black hover:bg-neutral-800 text-white rounded text-[10px] font-bold transition-all shadow-xs"
                >
                  <span>Create Project</span>
                  <ChevronDown className="h-3 w-3" />
                </button>

                {showCreateProjDropdown && (
                  <>
                    <div className="fixed inset-0 z-30" onClick={() => setShowCreateProjDropdown(false)} />
                    <div className="absolute right-0 mt-1 w-48 bg-white border border-[#e2e2e2] rounded shadow-lg z-40 py-1 flex flex-col text-xs text-black">
                      <button 
                        onClick={() => { alert('Opening modal...'); setShowCreateProjDropdown(false); }}
                        className="px-4 py-2 hover:bg-[#f9f9f9] text-left font-semibold"
                      >
                        Start from scratch
                      </button>
                      <button 
                        onClick={() => { alert('Opening template catalog...'); setShowCreateProjDropdown(false); }}
                        className="px-4 py-2 hover:bg-[#f9f9f9] text-left font-semibold text-[#3b66c5]"
                      >
                        Use a template
                      </button>
                    </div>
                  </>
                )}
              </div>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {teamProjects.map((proj) => (
                <div key={proj._id} className="border border-[#e2e2e2] hover:border-black rounded-lg p-4 bg-white transition-all flex flex-col justify-between group cursor-pointer">
                  <div className="space-y-3">
                    <div className="h-8 w-8 bg-[#fafafb] border border-[#e2e2e2] rounded flex items-center justify-center text-slate-700">
                      <ClipboardList className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-black group-hover:underline">{proj.name}</h4>
                      <p className="text-[10px] text-[#777777] leading-relaxed mt-1 truncate">{proj.description}</p>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-[#eeeeee] flex items-center justify-between text-[9px] text-[#777777]">
                    <span>{proj.members?.length || 0} collaborators</span>
                    <span className="text-emerald-600 font-bold uppercase tracking-wider">Active</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Sidebar team members widgets */}
        <div className="bg-white border border-[#e2e2e2] rounded-xl p-6 space-y-5 h-fit shadow-2xs">
          <div className="flex items-center justify-between border-b border-[#eeeeee] pb-3">
            <h3 className="text-sm font-bold text-black uppercase tracking-wider">Team Members</h3>
            <span className="text-[11px] font-bold text-white bg-black px-2 py-0.5 rounded">{teamMembers.length}</span>
          </div>

          <div className="space-y-3.5">
            {teamMembers.map((member) => (
              <div key={member._id} className="flex items-center justify-between border-b border-[#fafafa] pb-3 last:border-b-0 last:pb-0">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-xs font-bold shadow-2xs">
                    {member.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-black">{member.name}</p>
                    <p className="text-[10px] text-gray-400 font-semibold">{member.role}</p>
                  </div>
                </div>
                <button 
                  onClick={() => alert(`Colleague: ${member.email}`)}
                  className="text-[10px] font-bold text-gray-400 hover:text-black border border-gray-200 hover:border-black rounded px-2.5 py-1 transition-colors"
                >
                  Contact
                </button>
              </div>
            ))}
          </div>

          <button 
            onClick={() => {
              setActiveTab('members');
              setShowAddMemberPopover(true);
            }}
            className="w-full text-center py-2 border border-[#c6c6c6] hover:border-black text-[#5e5e5e] hover:text-black rounded text-[11px] font-bold transition-all uppercase tracking-wider mt-2"
          >
            Invite Colleague
          </button>
        </div>

      </div>
    );
  };

  // 2. All Work View
  const renderAllWork = () => {
    // Filter active tasks across the projects
    const allTasks = tasks.filter(t => workFilter === 'All' ? true : t.status === workFilter);

    return (
      <div className="bg-white border border-[#e2e2e2] rounded-xl overflow-hidden text-left shadow-2xs">
        <div className="p-5 border-b border-[#eeeeee] flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-black uppercase tracking-wider">All Work Ledger</h3>
            <p className="text-[11px] text-[#777777] mt-0.5">Aggregated task list across all active team project workspaces.</p>
          </div>
          
          <div className="flex items-center gap-2">
            {['All', 'To Do', 'In Progress', 'Done'].map(filter => (
              <button
                key={filter}
                onClick={() => setWorkFilter(filter)}
                className={`px-3 py-1 border rounded text-[10px] font-bold transition-all uppercase tracking-wider ${
                  workFilter === filter 
                    ? 'bg-black border-black text-white' 
                    : 'border-[#c6c6c6] text-[#5e5e5e] hover:bg-[#f9f9f9]'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#fafafb] border-b border-[#e2e2e2] text-[#5e5e5e] font-semibold">
                <th className="py-3 px-4">Task Name</th>
                <th className="py-3 px-4">Project</th>
                <th className="py-3 px-4">Due Date</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {allTasks.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-[#777777] italic bg-white">
                    No tasks currently mapped to this workload scope.
                  </td>
                </tr>
              ) : (
                allTasks.map((task) => {
                  const projName = typeof task.projectId === 'object' ? task.projectId.name : (projects.find(p => p._id === task.projectId)?.name || 'CrewFlow Workspace');
                  const formattedDate = new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
                  
                  const prioColor = task.priority === 'High' 
                    ? 'text-rose-600 bg-rose-50 border-rose-200' 
                    : task.priority === 'Medium'
                      ? 'text-amber-600 bg-amber-50 border-amber-200'
                      : 'text-slate-600 bg-slate-50 border-slate-200';

                  return (
                    <tr key={task._id} className="border-b border-[#eeeeee] last:border-0 hover:bg-[#fafafb]/50 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-black flex items-center gap-2">
                        <button 
                          onClick={handleTaskComplete}
                          className="text-gray-300 hover:text-emerald-500 transition-colors shrink-0"
                        >
                          <CheckCircle2 className="h-4.5 w-4.5" />
                        </button>
                        <span className="truncate">{task.title}</span>
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
                          onClick={handleTaskComplete}
                          className="text-[10px] font-bold text-white bg-neutral-800 hover:bg-black px-3 py-1 rounded transition-colors uppercase tracking-wider"
                        >
                          Mark Done
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
    );
  };

  // 3. Calendar View
  const renderCalendar = () => {
    // Generate a simple 35-day grid for calendar simulation (June 2026)
    const daysArray = Array.from({ length: 35 }, (_, i) => i - 4); // Start preceding days
    
    return (
      <div className="bg-white border border-[#e2e2e2] rounded-xl p-6 text-left shadow-2xs">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#eeeeee]">
          <div>
            <h3 className="text-sm font-bold text-black uppercase tracking-wider">Team Calendar</h3>
            <p className="text-[11px] text-[#777777] mt-0.5">Visualize project checkpoints and deadlines in active calendar views.</p>
          </div>
          <span className="text-xs font-black text-black uppercase tracking-wider bg-stone-50 border border-stone-200 px-4 py-1.5 rounded">
            June 2026
          </span>
        </div>

        {/* Days of week */}
        <div className="grid grid-cols-7 gap-2 text-center text-[10px] font-bold text-[#8a8b8c] uppercase tracking-wider mb-2">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
            <div key={day} className="py-1">{day}</div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2">
          {daysArray.map((day, idx) => {
            const isCurrentMonth = day >= 1 && day <= 30;
            const dayString = isCurrentMonth ? day : '';
            
            // Map tasks falling on simulated dates
            const taskOnDay = tasks.find(t => {
              const taskDate = new Date(t.dueDate).getDate();
              return taskDate === day && isCurrentMonth;
            });

            return (
              <div 
                key={idx} 
                className={`min-h-[72px] p-2 border border-gray-200 rounded-lg flex flex-col justify-between text-left transition-colors hover:bg-stone-50/50 ${
                  isCurrentMonth ? 'bg-white text-black' : 'bg-[#fafafb] text-gray-300'
                }`}
              >
                <span className="text-[10px] font-extrabold">{dayString}</span>
                {taskOnDay && (
                  <div 
                    onClick={() => alert(`Task: ${taskOnDay.title}`)}
                    className="mt-1 text-[8px] font-bold text-white bg-black hover:bg-neutral-800 p-1 rounded truncate cursor-pointer shadow-3xs"
                    title={taskOnDay.title}
                  >
                    {taskOnDay.title}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // 4. Messages View
  const renderMessages = () => {
    return (
      <div className="space-y-6 text-left">
        
        {/* Messages Header Card */}
        <div className="bg-white border border-[#e2e2e2] rounded-xl p-6 shadow-2xs space-y-4">
          <div className="flex items-start justify-between border-b border-[#eeeeee] pb-4 relative">
            <div>
              <h3 className="text-sm font-bold text-black uppercase tracking-wider">Teammate Messages & Announcements</h3>
              <p className="text-[11px] text-[#777777] mt-0.5">Post project updates, coordinate sprint scopes, and converse with colleagues.</p>
            </div>
            
            {/* Change Email alias popover */}
            <div className="relative">
              <button 
                onClick={() => setShowEmailChangePopover(!showEmailChangePopover)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-50 border border-stone-200 hover:border-black rounded text-[10px] font-bold text-stone-700 hover:text-black transition-all"
              >
                <Mail className="h-3.5 w-3.5 text-gray-500" />
                <span>Alias: {emailAlias}</span>
                <ChevronDown className="h-3 w-3" />
              </button>

              {showEmailChangePopover && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setShowEmailChangePopover(false)} />
                  <form 
                    onSubmit={(e) => {
                      e.preventDefault();
                      setShowEmailChangePopover(false);
                      alert("Team discussion email alias updated!");
                    }} 
                    className="absolute right-0 mt-2 w-72 bg-white border border-[#e2e2e2] rounded-xl shadow-xl z-40 p-4 space-y-3.5 text-xs text-slate-700 font-medium animate-scale-in"
                  >
                    <div>
                      <span className="font-extrabold text-black block mb-1">Update Message Alias</span>
                      <span className="text-[9px] text-[#777777] leading-relaxed block">
                        Emails forwarded to this alias will post updates directly inside this Messages discussion tab!
                      </span>
                    </div>
                    <div>
                      <input 
                        type="email"
                        required
                        value={emailAlias}
                        onChange={(e) => setEmailAlias(e.target.value)}
                        className="w-full text-xs p-2 border border-gray-300 rounded outline-none focus:border-black text-black bg-white"
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <button 
                        type="button" 
                        onClick={() => setShowEmailChangePopover(false)}
                        className="rounded border border-[#c6c6c6] px-2.5 py-1 text-[10px] font-bold text-[#5e5e5e]"
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit"
                        className="rounded bg-black hover:bg-neutral-800 text-white px-3 py-1 text-[10px] font-bold"
                      >
                        Save
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>

          </div>

          {/* New message input */}
          <div className="flex gap-4">
            <div className="h-9 w-9 rounded-full bg-[#fca5a5] text-[#991b1b] flex items-center justify-center font-bold text-xs shrink-0 select-none">
              GU
            </div>
            <div className="flex-1 flex gap-2">
              <input 
                type="text"
                placeholder="Post a new discussion topic or question to the team..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-1 text-xs py-2 px-3 border border-[#e2e2e2] rounded outline-none focus:border-black text-black bg-white"
              />
              <button 
                onClick={() => {
                  if (newMessage.trim() === '') return;
                  setMessagesList([
                    {
                      id: Date.now(),
                      author: 'guest@crewflow.com',
                      initial: 'GU',
                      bg: 'bg-[#fca5a5] text-[#991b1b]',
                      content: newMessage.trim(),
                      date: 'Just now',
                      comments: 0
                    },
                    ...messagesList
                  ]);
                  setNewMessage('');
                  alert("Message posted to discussion board!");
                }}
                className="bg-black hover:bg-neutral-800 text-white px-4 py-2 text-xs font-bold rounded transition-colors uppercase tracking-wider"
              >
                Send
              </button>
            </div>
          </div>
        </div>

        {/* Messages Feed */}
        <div className="space-y-4">
          {messagesList.map((msg) => (
            <div key={msg.id} className="bg-white border border-[#e2e2e2] rounded-xl p-5 space-y-3 shadow-2xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs ${msg.bg} shadow-2xs select-none`}>
                    {msg.initial}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-black">{msg.author}</span>
                    <span className="text-[10px] text-gray-400 font-semibold ml-2.5">{msg.date}</span>
                  </div>
                </div>
              </div>
              <p className="text-xs text-[#5e5e5e] leading-relaxed font-semibold pl-11">
                "{msg.content}"
              </p>
              <div className="pl-11 pt-2 border-t border-[#fafafa] flex items-center gap-4 text-[10px] text-gray-400 font-semibold">
                <span className="cursor-pointer hover:text-black flex items-center gap-1">
                  <MessageSquare className="h-3 w-3" />
                  <span>{msg.comments} comments</span>
                </span>
                <span className="cursor-pointer hover:text-black">☆ Like</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    );
  };

  // 5. Members View
  const renderMembers = () => {
    return (
      <div className="bg-white border border-[#e2e2e2] rounded-xl overflow-hidden text-left shadow-2xs">
        
        {/* Controls Toolbar */}
        <div className="p-5 border-b border-[#eeeeee] flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-black uppercase tracking-wider">Teammate Roster</h3>
            <p className="text-[11px] text-[#777777] mt-0.5">Manage permissions, sort list rosters, and define custom metadata columns.</p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 relative">
            
            {/* Sort Popover */}
            <div className="relative">
              <button 
                onClick={() => setShowSortPopover(!showSortPopover)}
                className="flex items-center gap-1.5 px-3 py-1.5 border border-[#c6c6c6] hover:border-black rounded-full text-xs font-semibold text-[#5e5e5e] hover:text-black transition-colors"
              >
                <ArrowUpDown className="h-3.5 w-3.5 opacity-80" />
                <span>Sort: {memberSortField === 'name' ? 'Name' : 'Role'}</span>
              </button>

              {showSortPopover && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setShowSortPopover(false)} />
                  <div className="absolute right-0 mt-1.5 w-40 bg-white border border-[#e2e2e2] rounded shadow-lg z-40 py-1 flex flex-col text-xs text-black">
                    <button 
                      onClick={() => { setMemberSortField('name'); setShowSortPopover(false); }}
                      className="px-4 py-2 hover:bg-[#f9f9f9] text-left font-semibold"
                    >
                      Sort by Name
                    </button>
                    <button 
                      onClick={() => { setMemberSortField('role'); setShowSortPopover(false); }}
                      className="px-4 py-2 hover:bg-[#f9f9f9] text-left font-semibold"
                    >
                      Sort by Role
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Add field popover */}
            <div className="relative">
              <button 
                onClick={() => setShowAddFieldPopover(!showAddFieldPopover)}
                className="flex items-center gap-1.5 px-3 py-1.5 border border-[#c6c6c6] hover:border-black rounded-full text-xs font-semibold text-[#5e5e5e] hover:text-black transition-colors"
              >
                <PlusCircle className="h-3.5 w-3.5 opacity-80" />
                <span>Add Column Field</span>
              </button>

              {showAddFieldPopover && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setShowAddFieldPopover(false)} />
                  <form 
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (newFieldName.trim() === '') return;
                      setDynamicColumns([...dynamicColumns, newFieldName.trim()]);
                      setNewFieldName('');
                      setShowAddFieldPopover(false);
                      alert("Dynamic custom metadata column added to roster!");
                    }} 
                    className="absolute right-0 mt-1.5 w-64 bg-white border border-[#e2e2e2] rounded-xl shadow-xl z-40 p-4 space-y-3 text-xs text-slate-700 animate-scale-in"
                  >
                    <div>
                      <span className="font-extrabold text-black block mb-0.5">Add Dynamic Roster Column</span>
                      <span className="text-[9px] text-[#777777]">Creates a custom attribute column (e.g. Pronouns, Start Date) for all team members.</span>
                    </div>
                    <input 
                      type="text"
                      required
                      placeholder="e.g. Pronouns"
                      value={newFieldName}
                      onChange={(e) => setNewFieldName(e.target.value)}
                      className="w-full text-xs p-2 border border-gray-300 rounded outline-none focus:border-black text-black bg-white"
                    />
                    <div className="flex justify-end gap-2">
                      <button 
                        type="button" 
                        onClick={() => setShowAddFieldPopover(false)}
                        className="rounded border border-[#c6c6c6] px-2.5 py-1 text-[10px]"
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit"
                        className="rounded bg-black hover:bg-neutral-800 text-white px-3 py-1 text-[10px] font-bold"
                      >
                        Create Column
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>

            {/* Add member dropdown picker */}
            <div className="relative">
              <button 
                onClick={() => setShowAddMemberPopover(!showAddMemberPopover)}
                className="flex items-center gap-1.5 px-4 py-1.5 bg-[#3b66c5] hover:bg-[#2e55aa] text-white rounded text-xs font-bold transition-all shadow-xs"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Member</span>
              </button>

              {showAddMemberPopover && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setShowAddMemberPopover(false)} />
                  <div className="absolute right-0 mt-1.5 w-64 bg-white border border-[#e2e2e2] rounded-xl shadow-xl z-40 p-4 space-y-3.5 text-xs text-slate-700 animate-scale-in">
                    <div>
                      <span className="font-extrabold text-black block mb-0.5">Add Member to Team</span>
                      <span className="text-[9px] text-[#777777]">Select and invite an existing workspace colleague to join this team segment.</span>
                    </div>
                    <select
                      value={selectedMemberToInvite}
                      onChange={(e) => setSelectedMemberToInvite(e.target.value)}
                      className="w-full text-xs p-2 border border-gray-300 rounded outline-none focus:border-black text-black bg-white"
                    >
                      <option value="">Select teammate...</option>
                      <option value="lead@email.com">team-lead@crewflow.com</option>
                      <option value="qa@email.com">qa-support@crewflow.com</option>
                      <option value="design@email.com">designer-pro@crewflow.com</option>
                    </select>
                    <button 
                      onClick={() => {
                        if (selectedMemberToInvite === '') return;
                        const namePart = selectedMemberToInvite.split('@')[0];
                        const display = namePart.charAt(0).toUpperCase() + namePart.slice(1);
                        setTeamMembers([
                          ...teamMembers,
                          {
                            _id: `mock_new_${Date.now()}`,
                            name: `${display} User`,
                            email: selectedMemberToInvite,
                            role: 'Contributor',
                            dept: 'Product & Engineering',
                            customData: {}
                          }
                        ]);
                        setSelectedMemberToInvite('');
                        setShowAddMemberPopover(false);
                        alert("Colleague invited to team segment!");
                      }}
                      className="w-full rounded bg-black hover:bg-neutral-800 text-white py-2 font-bold transition-colors uppercase tracking-wider"
                    >
                      Invite Now
                    </button>
                  </div>
                </>
              )}
            </div>

          </div>
        </div>

        {/* Table data sheet */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#fafafb] border-b border-[#e2e2e2] text-[#5e5e5e] font-semibold">
                <th className="py-3 px-4">Teammate Identity</th>
                <th className="py-3 px-4">Team Role</th>
                <th className="py-3 px-4">Workspace Department</th>
                
                {/* Dynamically render columns */}
                {dynamicColumns.map(col => (
                  <th key={col} className="py-3 px-4 capitalize">{col}</th>
                ))}

                <th className="py-3 px-4 text-right">Settings</th>
              </tr>
            </thead>
            <tbody>
              {[...teamMembers]
                .sort((a, b) => {
                  if (memberSortField === 'name') return a.name.localeCompare(b.name);
                  return a.role.localeCompare(b.role);
                })
                .map((member) => (
                  <tr key={member._id} className="border-b border-[#eeeeee] last:border-0 hover:bg-[#fafafb]/50 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-black flex items-center gap-2.5">
                      <div className="h-7 w-7 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-xs font-bold shadow-3xs">
                        {member.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <span>{member.name}</span>
                        <span className="text-[10px] text-gray-400 font-semibold block leading-tight">{member.email}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-neutral-800">
                      <span className={`px-2.5 py-0.5 border rounded text-[10px] uppercase font-bold ${
                        member.role === 'Leader' ? 'bg-black text-white border-black' : 'bg-stone-50 border-[#c6c6c6] text-stone-700'
                      }`}>
                        {member.role}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-[#777777]">{member.dept}</td>
                    
                    {/* Render dyn data cells */}
                    {dynamicColumns.map(col => (
                      <td key={col} className="py-3.5 px-4 font-bold text-black">
                        {member.customData[col] || (
                          <input 
                            type="text"
                            placeholder="Add value..."
                            className="bg-transparent border-b border-transparent hover:border-gray-300 focus:border-black outline-none py-0.5 text-xs text-black w-24"
                            onBlur={(e) => {
                              if (e.target.value === '') return;
                              member.customData[col] = e.target.value;
                              alert("Custom column field updated!");
                            }}
                          />
                        )}
                      </td>
                    ))}

                    <td className="py-3.5 px-4 text-right">
                      <button 
                        onClick={() => {
                          if (member._id === 'guest_id') {
                            alert("Cannot remove leader!");
                            return;
                          }
                          setTeamMembers(teamMembers.filter(m => m._id !== member._id));
                          alert("Teammate removed from team!");
                        }}
                        className="text-[10px] font-bold text-red-600 hover:underline uppercase tracking-wider"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

      </div>
    );
  };

  // 6. Knowledge View
  const renderKnowledge = () => {
    return (
      <div className="bg-white border border-[#e2e2e2] rounded-xl p-6 text-left shadow-2xs space-y-6">
        
        {/* Toolbar switches */}
        <div className="flex items-center justify-between border-b border-[#eeeeee] pb-4">
          <div>
            <h3 className="text-sm font-bold text-black uppercase tracking-wider">Team Knowledge Base</h3>
            <p className="text-[11px] text-[#777777] mt-0.5">Explore guides, coding standards, and shared workspace documents.</p>
          </div>

          <div className="flex items-center border border-gray-300 rounded p-1 text-[10px] font-bold uppercase tracking-wider bg-stone-50 select-none">
            <button 
              onClick={() => setKnowledgeState('no-entry')}
              className={`px-3 py-1 rounded transition-all ${
                knowledgeState === 'no-entry' ? 'bg-black text-white' : 'text-gray-400 hover:text-black'
              }`}
            >
              Empty state
            </button>
            <button 
              onClick={() => setKnowledgeState('with-entry')}
              className={`px-3 py-1 rounded transition-all ${
                knowledgeState === 'with-entry' ? 'bg-black text-white' : 'text-gray-400 hover:text-black'
              }`}
            >
              With Entry
            </button>
          </div>
        </div>

        {/* Content canvas */}
        {knowledgeState === 'no-entry' ? (
          <div className="py-12 border-2 border-dashed border-[#e2e2e2] rounded-xl text-center flex flex-col items-center justify-center bg-[#fafafb] select-none gap-3">
            <div className="h-10 w-10 bg-gray-200 text-gray-500 rounded-full flex items-center justify-center">
              <Bookmark className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-[#1a1c1c]">No Knowledge resources posted yet</h4>
              <p className="text-[10px] text-gray-400 max-w-sm">Share guidelines, design specs, or tech credentials to jumpstart colleague onboarding.</p>
            </div>
            <button 
              onClick={() => setKnowledgeState('with-entry')}
              className="mt-2 bg-black hover:bg-neutral-800 text-white text-[10px] font-bold px-4 py-2 rounded uppercase tracking-wider transition-colors shadow-xs"
            >
              Seed Demo Guides
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            
            {/* Seed Creator form */}
            <form onSubmit={(e) => {
              e.preventDefault();
              if (newWikiTitle.trim() === '' || newWikiDesc.trim() === '') return;
              setWikis([
                ...wikis,
                {
                  id: Date.now(),
                  title: newWikiTitle.trim(),
                  desc: newWikiDesc.trim(),
                  author: 'Guest User',
                  date: new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
                }
              ]);
              setNewWikiTitle('');
              setNewWikiDesc('');
              alert("New shared guide posted successfully!");
            }} className="border border-gray-200 rounded-xl p-4 bg-[#fafafb] space-y-3 text-xs font-semibold text-slate-700">
              <h4 className="font-extrabold text-black uppercase tracking-wider mb-2">Publish New Resource Guide</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input 
                  type="text"
                  required
                  placeholder="Document Title (e.g. Git Branching Rules)"
                  value={newWikiTitle}
                  onChange={(e) => setNewWikiTitle(e.target.value)}
                  className="w-full text-xs p-2 border border-gray-300 rounded outline-none focus:border-black text-black bg-white"
                />
                <input 
                  type="text"
                  required
                  placeholder="Short Description Summary..."
                  value={newWikiDesc}
                  onChange={(e) => setNewWikiDesc(e.target.value)}
                  className="w-full text-xs p-2 border border-gray-300 rounded outline-none focus:border-black text-black bg-white"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button 
                  type="submit"
                  className="bg-black hover:bg-neutral-800 text-white px-4 py-2 font-bold rounded uppercase tracking-wider text-[10px] transition-colors shadow-xs"
                >
                  Publish Wiki
                </button>
              </div>
            </form>

            {/* List of articles */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {wikis.map((wiki) => (
                <div key={wiki.id} className="border border-gray-200 hover:border-black rounded-xl p-5 bg-white transition-all shadow-2xs flex flex-col justify-between h-40">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-bold text-gray-400 bg-gray-50 border border-gray-200 px-2 py-0.5 rounded uppercase tracking-wider">
                        Document
                      </span>
                      <span className="text-[9px] text-[#777777] font-semibold">{wiki.date}</span>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-black">{wiki.title}</h4>
                      <p className="text-[10px] text-gray-500 leading-normal mt-1 block">{wiki.desc}</p>
                    </div>
                  </div>
                  <div className="pt-3 border-t border-[#eeeeee] flex items-center justify-between text-[9px] font-bold">
                    <span className="text-[#5e5e5e]">Author: {wiki.author}</span>
                    <button 
                      onClick={() => alert(`Opening resource: ${wiki.title}`)}
                      className="text-[#3b66c5] hover:underline flex items-center gap-1"
                    >
                      <span>Read Guide</span>
                      <ExternalLink className="h-2.5 w-2.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

      </div>
    );
  };

  // 7. Add Custom Note View Tab (Note Template engine)
  const renderNoteTab = () => {
    return (
      <div className="bg-white border border-[#e2e2e2] rounded-xl p-6 text-left shadow-2xs space-y-6">
        
        {/* Note Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#eeeeee] pb-4">
          <div>
            <h3 className="text-sm font-bold text-black uppercase tracking-wider">Dynamic Note Editor</h3>
            <p className="text-[11px] text-[#777777] mt-0.5">Scaffold custom templates (meeting minutes, retro resources) in dynamic document tabs.</p>
          </div>
          
          <div className="flex flex-wrap gap-2.5 select-none">
            {[
              { id: 'blank', label: 'Blank Note' },
              { id: 'resources', label: 'Key Resources' },
              { id: 'meeting', label: 'Meeting Note' },
              { id: 'weekly', label: 'Weekly Planning' }
            ].map(tpl => (
              <button
                key={tpl.id}
                onClick={() => applyNoteTemplate(tpl.id)}
                className={`px-3 py-1 border rounded text-[10px] font-bold transition-all uppercase tracking-wider ${
                  selectedNoteTemplate === tpl.id 
                    ? 'bg-[#3b66c5] border-[#3b66c5] text-white shadow-3xs' 
                    : 'border-[#c6c6c6] text-[#5e5e5e] hover:bg-[#f9f9f9]'
                }`}
              >
                {tpl.label}
              </button>
            ))}
          </div>
        </div>

        {/* Rich note editor canvas */}
        <div className="space-y-4">
          <textarea
            rows="12"
            value={noteContent}
            onChange={(e) => setNoteContent(e.target.value)}
            className="w-full text-xs font-mono p-4 border border-gray-300 rounded-lg outline-none focus:border-black text-black bg-stone-50 leading-relaxed shadow-inner"
            placeholder="Choose a template above or draft custom wiki details directly..."
          />

          <div className="flex items-center justify-between pt-2">
            <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">
              Autosaved to tab
            </span>
            <button 
              onClick={() => {
                alert("Note content published and exported to the public project feed!");
              }}
              className="bg-black hover:bg-neutral-800 text-white px-5 py-2 text-xs font-bold rounded uppercase tracking-wider transition-colors shadow-xs"
            >
              Export Note
            </button>
          </div>
        </div>

      </div>
    );
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#fafafb] px-8 py-8 space-y-6 select-none font-sans border-l border-[#e2e2e2]">
      
      {/* Header and navigation tabs */}
      {renderHeader()}

      {/* Render sub-view */}
      <div className="mt-6">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'all-work' && renderAllWork()}
        {activeTab === 'calendar' && renderCalendar()}
        {activeTab === 'messages' && renderMessages()}
        {activeTab === 'members' && renderMembers()}
        {activeTab === 'knowledge' && renderKnowledge()}
        {activeTab === 'note' && renderNoteTab()}
      </div>

    </div>
  );
};

export default TeamView;
