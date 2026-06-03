import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  CheckCircle, 
  Circle, 
  Calendar, 
  Users, 
  Briefcase, 
  BookOpen, 
  Plus, 
  FolderPlus,
  Clock, 
  Sparkles,
  ArrowRight,
  UserPlus,
  SlidersHorizontal,
  Target,
  FolderGit2,
  Activity,
  MessageSquareDashed,
  FileText,
  AtSign
} from 'lucide-react';
import CustomizePanel from './CustomizePanel';

const HomeView = ({ 
  projects = [], 
  tasks = [], 
  onStatusUpdated, 
  onNewTask, 
  onNewProject,
  onOpenInviteModal,
  setActiveView,
  setActiveProjectId 
}) => {
  const { user, token } = useAuth();
  const effectiveUser = user || { email: 'guest@crewflow.com', role: 'Admin', _id: 'guest_id' };
  const [notepadText, setNotepadText] = useState(() => {
    return localStorage.getItem('crewflow_home_notepad') || '';
  });
  const [currentTime, setCurrentTime] = useState(new Date());

  const [isCustomizeOpen, setIsCustomizeOpen] = useState(false);
  const [homeBgColor, setHomeBgColor] = useState(() => {
    return localStorage.getItem('crewflow_home_bg') || 'bg-[#f9f9f9]';
  });
  const [activeWidgets, setActiveWidgets] = useState(() => {
    const saved = localStorage.getItem('crewflow_home_widgets');
    return saved ? JSON.parse(saved) : ['my_tasks', 'tasks_assigned', 'private_notepad', 'projects', 'people'];
  });

  // Update clock every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem('crewflow_home_notepad', notepadText);
  }, [notepadText]);

  useEffect(() => {
    localStorage.setItem('crewflow_home_bg', homeBgColor);
  }, [homeBgColor]);

  useEffect(() => {
    localStorage.setItem('crewflow_home_widgets', JSON.stringify(activeWidgets));
  }, [activeWidgets]);

  const toggleWidget = (widgetId) => {
    setActiveWidgets(prev => {
      if (prev.includes(widgetId)) {
        return prev.filter(id => id !== widgetId);
      } else {
        return [...prev, widgetId];
      }
    });
  };

  // Derive time-of-day greeting
  const getGreeting = () => {
    const hrs = currentTime.getHours();
    if (hrs < 12) return 'Good morning';
    if (hrs < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const formattedDate = currentTime.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'short',
    day: 'numeric'
  });

  const formattedTime = currentTime.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit'
  });

  // Extract tasks assigned to CURRENT USER that are not complete
  const myTasks = tasks.filter(t => {
    const assigneeId = t.assignedTo?._id || t.assignedTo;
    return assigneeId === effectiveUser?._id && t.status !== 'Done';
  });

  // Extract tasks this user assigned to others (assignedTo !== current user)
  // Let's filter task.assignedTo !== user._id
  const tasksIAssigned = tasks.filter(t => {
    const assigneeId = t.assignedTo?._id || t.assignedTo;
    // For local mock / mongo, we can assume if the user is Admin or if they created it, or simply tasks not assigned to them
    return assigneeId !== effectiveUser?._id;
  }).slice(0, 5);

  // Extract unique team members from active projects or tasks
  const teamMembers = [];
  const memberEmails = new Set();
  
  projects.forEach(p => {
    if (p.members) {
      p.members.forEach(m => {
        const email = typeof m === 'object' ? m.email : m;
        if (email && !memberEmails.has(email)) {
          memberEmails.add(email);
          teamMembers.push({
            email,
            role: typeof m === 'object' ? m.role : 'Member',
            initials: email.split('@')[0].slice(0, 2).toUpperCase()
          });
        }
      });
    }
  });

  // Fallback if no members found in projects
  if (teamMembers.length === 0 && effectiveUser) {
    teamMembers.push({
      email: effectiveUser.email,
      role: effectiveUser.role,
      initials: effectiveUser.email.split('@')[0].slice(0, 2).toUpperCase()
    });
  }

  const handleToggleTask = async (taskId) => {
    if (!token) {
      // Guest mode offline toggle simulation
      const task = tasks.find(t => t._id === taskId);
      if (task) {
        const updatedTask = { ...task, status: 'Done' };
        onStatusUpdated(updatedTask);
      }
      return;
    }
    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: 'Done' })
      });

      if (res.ok) {
        const updatedTask = await res.json();
        onStatusUpdated(updatedTask);
      } else {
        const err = await res.json();
        console.error('Failed to complete task:', err.message);
      }
    } catch (error) {
      console.error('Error toggling task:', error);
    }
  };



  // Determine background text color based on lightness (rough estimate)
  const isDarkBg = ['bg-[#4B1E38]', 'bg-[#2B6358]', 'bg-[#3B66C5]', 'bg-[#7885D5]', 'bg-[#9969C9]'].includes(homeBgColor);
  const textColorClass = isDarkBg ? 'text-white' : 'text-[#1a1c1c]';
  const subtextColorClass = isDarkBg ? 'text-gray-200' : 'text-[#5e5e5e]';
  const dateTextColorClass = isDarkBg ? 'text-gray-300' : 'text-[#777777]';

  // Helper to render placeholders
  const renderPlaceholder = (title, IconComponent, message) => (
    <div className="glass rounded p-6 space-y-4 bg-white shadow-sm border border-transparent hover:border-[#e2e2e2] transition-colors">
      <div className="flex items-center gap-2">
        <IconComponent className="h-4.5 w-4.5 text-[#1a1c1c]" />
        <h3 className="text-sm font-bold text-[#1a1c1c] uppercase tracking-wider">{title}</h3>
      </div>
      <div className="py-8 text-center border border-dashed border-[#e2e2e2] bg-[#fafafa] rounded">
        <p className="text-xs text-[#777777] italic">{message}</p>
      </div>
    </div>
  );

  return (
    <div className={`flex-1 ${isCustomizeOpen ? 'overflow-hidden' : 'overflow-y-auto'} ${homeBgColor} transition-colors duration-500 px-8 py-8 space-y-8 select-none relative`}>
      
      {/* 1. Header Greeting Banner */}
      <div className={`flex flex-col md:flex-row md:items-center justify-between pb-6 border-b ${isDarkBg ? 'border-white/20' : 'border-[#e2e2e2]'}`}>
        <div>
          <span className={`text-xs font-semibold ${dateTextColorClass} uppercase tracking-wider`}>
            {formattedDate}
          </span>
          <h2 className={`text-2xl font-bold ${textColorClass} tracking-tight mt-1 font-sans flex items-center gap-3`}>
            {getGreeting()}, {effectiveUser?.email?.split('@')[0]}
          </h2>
          <p className={`text-xs ${subtextColorClass} mt-0.5`}>
            Welcome to your workspace. Here is a summary of your team's updates.
          </p>
        </div>

        <div className="flex items-center gap-4 mt-4 md:mt-0 flex-wrap">
          {effectiveUser?.role === 'Admin' && (
            <>
              {/* New Project Action */}
              <button 
                onClick={onNewProject}
                className={`flex items-center gap-2 px-4 py-2 border rounded shadow-sm font-bold text-sm transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 ${
                  isDarkBg 
                  ? 'bg-white/10 hover:bg-white/15 text-white border-white/20 hover:border-white/30' 
                  : 'bg-white text-[#1a1c1c] hover:bg-gray-50 border-[#e2e2e2] hover:border-gray-300'
                }`}
                title="Create a new workspace project"
              >
                <FolderPlus className="h-4 w-4 text-[#3b66c5]" />
                <span>New Project</span>
              </button>

              {/* New Task Action */}
              <button 
                onClick={onNewTask}
                className={`flex items-center gap-2 px-4 py-2 rounded shadow-sm font-bold text-sm transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 ${
                  isDarkBg 
                  ? 'bg-white text-black hover:bg-gray-100 border border-white' 
                  : 'bg-neutral-900 text-white hover:bg-neutral-800 border border-transparent'
                }`}
                title="Create a new workspace task"
              >
                <Plus className="h-4 w-4" />
                <span>New Task</span>
              </button>
            </>
          )}

          <div className={`flex items-center gap-2 px-3.5 py-2 ${isDarkBg ? 'bg-white/10 border-white/20 text-white' : 'bg-white border-[#e2e2e2] text-[#1a1c1c]'} border rounded shadow-sm`}>
            <Clock className={`h-4 w-4 ${isDarkBg ? 'text-gray-300' : 'text-[#777777]'}`} />
            <span className="text-sm font-semibold font-mono">{formattedTime}</span>
          </div>

          <button 
            onClick={() => setIsCustomizeOpen(true)}
            className={`flex items-center gap-2 px-3.5 py-2 border rounded shadow-sm font-semibold text-sm transition-colors ${
              isDarkBg 
              ? 'bg-white text-black hover:bg-gray-100 border-white' 
              : 'bg-white text-[#1a1c1c] hover:bg-gray-50 border-[#e2e2e2]'
            }`}
          >
            <SlidersHorizontal className="h-4 w-4" />
            Customize
          </button>
        </div>
      </div>

      {/* 2. Primary Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Double-Column Side (Wide Widgets) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* My Tasks Panel */}
          {activeWidgets.includes('my_tasks') && (
            <div className="glass rounded p-6 space-y-4 bg-white shadow-sm border border-transparent hover:border-[#e2e2e2] transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4.5 w-4.5 text-[#1a1c1c]" />
                  <h3 className="text-sm font-bold text-[#1a1c1c] uppercase tracking-wider">My Tasks ({myTasks.length})</h3>
                </div>
                {effectiveUser?.role === 'Admin' && (
                  <button 
                    onClick={onNewTask}
                    className="flex items-center gap-1 text-[11px] font-semibold text-[#5e5e5e] hover:text-[#000000] border border-[#c6c6c6] hover:border-[#000000] px-2.5 py-1 rounded transition-colors"
                  >
                    <Plus className="h-3 w-3" />
                    <span>Quick Add</span>
                  </button>
                )}
              </div>

              {myTasks.length === 0 ? (
                <div className="py-8 text-center border border-dashed border-[#e2e2e2] bg-[#fafafa] rounded">
                  <p className="text-xs text-[#777777] italic">You have no pending tasks. Enjoy your day!</p>
                </div>
              ) : (
                <div className="divide-y divide-[#eeeeee] border border-[#e2e2e2] rounded overflow-hidden bg-white">
                  {myTasks.map(task => (
                    <div key={task._id} className="flex items-center justify-between p-3.5 hover:bg-[#fcfcfc] transition-colors group">
                      <div className="flex items-center gap-3 min-w-0">
                        <button 
                          onClick={() => handleToggleTask(task._id)}
                          className="text-[#777777] hover:text-[#000000] transition-colors flex-shrink-0"
                        >
                          <Circle className="h-4 w-4" />
                        </button>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-[#1a1c1c] truncate">{task.title}</p>
                          <p className="text-[10px] text-[#777777] mt-0.5 truncate">
                            Due: {new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${
                          task.priority === 'High' ? 'bg-red-50 text-red-700 border-red-200' :
                          task.priority === 'Medium' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                          'bg-gray-50 text-gray-700 border-gray-200'
                        }`}>
                          {task.priority}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tasks I've Assigned Panel */}
          {activeWidgets.includes('tasks_assigned') && (
            <div className="glass rounded p-6 space-y-4 bg-white shadow-sm border border-transparent hover:border-[#e2e2e2] transition-colors">
              <div className="flex items-center gap-2">
                <Users className="h-4.5 w-4.5 text-[#1a1c1c]" />
                <h3 className="text-sm font-bold text-[#1a1c1c] uppercase tracking-wider">Tasks Assigned to Others</h3>
              </div>

              {tasksIAssigned.length === 0 ? (
                <div className="py-8 text-center border border-dashed border-[#e2e2e2] bg-[#fafafa] rounded">
                  <p className="text-xs text-[#777777] italic">No active tasks assigned to other team members.</p>
                </div>
              ) : (
                <div className="divide-y divide-[#eeeeee] border border-[#e2e2e2] rounded overflow-hidden bg-white">
                  {tasksIAssigned.map(task => (
                    <div key={task._id} className="flex items-center justify-between p-3.5 hover:bg-[#fcfcfc] transition-colors">
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-[#1a1c1c] truncate">{task.title}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[9px] text-[#5e5e5e]">
                            Assignee: {task.assignedTo?.email || 'Unassigned'}
                          </span>
                          <span className="text-[9px] text-[#777777] font-mono">
                            ({task.status})
                          </span>
                        </div>
                      </div>

                      <div className="text-[10px] text-[#777777] font-mono whitespace-nowrap">
                        {new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Placeholders for Wide Widgets */}
          {activeWidgets.includes('goals') && renderPlaceholder('Goals', Target, 'Track organizational and team goals here. (Coming soon)')}
          {activeWidgets.includes('portfolios') && renderPlaceholder('Portfolios', FolderGit2, 'Monitor high-level progress across multiple projects. (Coming soon)')}
          {activeWidgets.includes('status_updates') && renderPlaceholder('Status Updates', Activity, 'View recent project status updates. (Coming soon)')}

        </div>

        {/* Right Single-Column Sidebar (Narrow Widgets) */}
        <div className="space-y-6">
          
          {/* Auto-Saving Notepad Widget */}
          {activeWidgets.includes('private_notepad') && (
            <div className="glass rounded p-6 flex flex-col h-[280px] space-y-3 bg-white shadow-sm border border-transparent hover:border-[#e2e2e2] transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4.5 w-4.5 text-[#1a1c1c]" />
                  <h3 className="text-sm font-bold text-[#1a1c1c] uppercase tracking-wider">My Private Notepad</h3>
                </div>
                <span className="text-[9px] font-semibold text-[#777777] bg-[#f3f3f4] px-1.5 py-0.5 rounded uppercase tracking-wider">
                  Auto-saved
                </span>
              </div>

              <textarea
                value={notepadText}
                onChange={(e) => setNotepadText(e.target.value)}
                placeholder="Jot down quick reminders, drafts, or ideas here... (Strictly private to this browser session)"
                className="w-full flex-1 text-xs p-3 bg-[#fdfdfd] border border-[#e2e2e2] rounded focus:border-[#000000] focus:ring-0 resize-none transition-all placeholder-[#a0a0a0] leading-relaxed text-[#1a1c1c] outline-none"
              />

              <div className="flex items-center justify-between text-[10px] text-[#777777] pt-1">
                <span>{notepadText.trim() ? `${notepadText.trim().split(/\s+/).length} words` : 'Empty'}</span>
                <button 
                  onClick={() => setNotepadText('')}
                  className="hover:text-red-600 transition-colors uppercase font-bold tracking-wider"
                >
                  Clear
                </button>
              </div>
            </div>
          )}

          {/* Dynamic Minimalist Projects Grid */}
          {activeWidgets.includes('projects') && (
            <div className="glass rounded p-6 space-y-4 bg-white shadow-sm border border-transparent hover:border-[#e2e2e2] transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4.5 w-4.5 text-[#1a1c1c]" />
                  <h3 className="text-sm font-bold text-[#1a1c1c] uppercase tracking-wider">Workspace Projects</h3>
                </div>
                {effectiveUser?.role === 'Admin' && (
                  <button 
                    onClick={onNewProject}
                    className="p-1 hover:bg-[#f3f3f4] border border-[#c6c6c6] rounded transition-colors"
                    title="New Project"
                  >
                    <Plus className="h-3.5 w-3.5 text-[#5e5e5e] hover:text-[#000000]" />
                  </button>
                )}
              </div>

              {projects.length === 0 ? (
                <p className="text-xs text-[#777777] italic py-2">No active projects available.</p>
              ) : (
                <div className="space-y-2.5">
                  {projects.slice(0, 4).map(proj => (
                    <button
                      key={proj._id}
                      onClick={() => {
                        setActiveProjectId(proj._id);
                        setActiveView('project-details');
                      }}
                      className="w-full flex items-center justify-between p-2.5 rounded border border-[#e2e2e2] hover:border-[#000000] bg-white hover:bg-[#fafafa] transition-all text-left group"
                    >
                      <div className="min-w-0">
                        <span className="text-xs font-bold text-[#1a1c1c] truncate block group-hover:underline">
                          {proj.name}
                        </span>
                        <span className="text-[10px] text-[#5e5e5e]">
                          {proj.members?.length || 0} collaborators
                        </span>
                      </div>
                      <ArrowRight className="h-3.5 w-3.5 text-[#777777] opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Team Collaborators List */}
          {activeWidgets.includes('people') && (
            <div className="glass rounded p-6 space-y-4 bg-white shadow-sm border border-transparent hover:border-[#e2e2e2] transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="h-4.5 w-4.5 text-[#1a1c1c]" />
                  <h3 className="text-sm font-bold text-[#1a1c1c] uppercase tracking-wider">Team Members</h3>
                </div>
                {effectiveUser?.role === 'Admin' && (
                  <button 
                    onClick={onOpenInviteModal}
                    className="flex items-center gap-1 text-[11px] font-semibold text-white bg-black hover:bg-neutral-800 px-2.5 py-1 rounded shadow-sm transition-colors"
                  >
                    <UserPlus className="h-3 w-3" />
                    <span>Invite</span>
                  </button>
                )}
              </div>

              <div className="space-y-3">
                {teamMembers.slice(0, 5).map((member, index) => (
                  <div key={index} className="flex items-center gap-2.5">
                    <div className="h-7 w-7 rounded-full bg-[#f3f3f4] border border-[#e2e2e2] flex items-center justify-center text-[10px] font-bold text-[#1a1c1c] shadow-sm">
                      {member.initials}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-[#1a1c1c] truncate leading-tight">
                        {member.email.split('@')[0]}
                      </p>
                      <p className="text-[9px] text-[#777777] leading-none mt-0.5 font-medium tracking-wide uppercase">
                        {member.role}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Placeholders for Narrow Widgets */}
          {activeWidgets.includes('draft_comments') && renderPlaceholder('Draft Comments', MessageSquareDashed, 'Your unfinished comments will appear here. (Coming soon)')}
          {activeWidgets.includes('forms') && renderPlaceholder('Forms', FileText, 'Manage and review submitted forms. (Coming soon)')}
          {activeWidgets.includes('comments_mentioning_me') && renderPlaceholder('Mentions', AtSign, 'Comments where you were mentioned. (Coming soon)')}

        </div>

      </div>

      <CustomizePanel 
        isOpen={isCustomizeOpen} 
        onClose={() => setIsCustomizeOpen(false)}
        activeBgColor={homeBgColor}
        onBgColorChange={setHomeBgColor}
        activeWidgets={activeWidgets}
        onToggleWidget={toggleWidget}
      />

    </div>
  );
};

export default HomeView;
