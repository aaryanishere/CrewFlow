import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  CheckSquare, 
  ChevronDown, 
  ChevronRight, 
  Circle, 
  CheckCircle,
  Plus, 
  Calendar, 
  AlertCircle,
  Clock,
  List,
  Calendar as CalendarIcon
} from 'lucide-react';

const MyTasksView = ({ 
  projects = [], 
  tasks = [], 
  onStatusUpdated, 
  onTaskCreated,
  token 
}) => {
  const { user } = useAuth();
  const effectiveUser = user || { email: 'guest@crewflow.com', role: 'Admin', _id: 'guest_id' };
  const [activeSubTab, setActiveSubTab] = useState('list'); // 'list' | 'calendar'
  
  // Collapse states for each category
  const [expanded, setExpanded] = useState({
    recent: true,
    today: true,
    nextWeek: true,
    later: true,
  });

  // Rapid task entry fields for each section
  const [rapidTitles, setRapidTitles] = useState({
    recent: '',
    today: '',
    nextWeek: '',
    later: ''
  });

  const [rapidProjects, setRapidProjects] = useState(() => {
    return projects[0]?._id || '';
  });

  const toggleSection = (section) => {
    setExpanded(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // Filter tasks assigned to current user
  const myAllTasks = tasks.filter(t => {
    const assigneeId = t.assignedTo?._id || t.assignedTo;
    return assigneeId === effectiveUser?._id;
  });

  const isOverdue = (task) => {
    return new Date(task.dueDate) < new Date() && task.status !== 'Done';
  };

  // Categorize tasks dynamically based on due dates
  const today = new Date();
  today.setHours(0,0,0,0);

  const endOfWeek = new Date();
  endOfWeek.setDate(today.getDate() + 7);
  endOfWeek.setHours(23,59,59,999);

  const categorizedTasks = {
    recent: myAllTasks.filter(t => t.status === 'To Do' && !isOverdue(t) && new Date(t.dueDate) > endOfWeek),
    today: myAllTasks.filter(t => {
      const d = new Date(t.dueDate);
      return d <= today && t.status !== 'Done';
    }),
    nextWeek: myAllTasks.filter(t => {
      const d = new Date(t.dueDate);
      return d > today && d <= endOfWeek && t.status !== 'Done';
    }),
    later: myAllTasks.filter(t => {
      const d = new Date(t.dueDate);
      return d > endOfWeek || t.status === 'Done';
    })
  };

  // Handle checking/toggling status
  const handleToggleTask = async (taskId, currentStatus) => {
    const nextStatus = currentStatus === 'Done' ? 'To Do' : 'Done';
    if (!token) {
      // Guest mode offline toggle simulation
      const task = tasks.find(t => t._id === taskId);
      if (task) {
        const updatedTask = { ...task, status: nextStatus };
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
        body: JSON.stringify({ status: nextStatus })
      });

      if (res.ok) {
        const updatedTask = await res.json();
        onStatusUpdated(updatedTask);
      } else {
        console.error('Failed to toggle status');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Rapid inline task addition
  const handleRapidAdd = async (section, e) => {
    if (e) e.preventDefault();
    const title = rapidTitles[section].trim();
    if (!title) return;

    if (projects.length === 0) {
      alert('Please create a project first before creating tasks.');
      return;
    }

    const targetProjId = rapidProjects || projects[0]?._id;
    if (!targetProjId) return;

    // Calculate due date based on section
    const date = new Date();
    if (section === 'today') {
      // due today
    } else if (section === 'nextWeek') {
      date.setDate(date.getDate() + 5);
    } else if (section === 'later') {
      date.setDate(date.getDate() + 14);
    } else {
      date.setDate(date.getDate() + 2);
    }

    if (!token) {
      // Guest mode rapid addition simulation
      const targetProj = projects.find(p => p._id === targetProjId);
      const newTask = {
        _id: 'task_' + Math.random().toString(36).substring(2, 9),
        projectId: targetProjId,
        projectName: targetProj ? targetProj.name : 'Simulated Project',
        assignedTo: {
          _id: effectiveUser._id,
          email: effectiveUser.email
        },
        title,
        description: `Rapidly assigned inline under ${section}.`,
        dueDate: date.toISOString().split('T')[0],
        priority: 'Medium',
        status: 'To Do',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      onTaskCreated(newTask);
      setRapidTitles(prev => ({ ...prev, [section]: '' }));
      return;
    }

    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          projectId: targetProjId,
          assignedTo: effectiveUser._id,
          title,
          description: `Rapidly assigned inline under ${section}.`,
          dueDate: date.toISOString().split('T')[0],
          priority: 'Medium'
        })
      });

      if (res.ok) {
        const newTask = await res.json();
        onTaskCreated(newTask);
        setRapidTitles(prev => ({ ...prev, [section]: '' }));
      } else {
        const err = await res.json();
        alert(err.message || 'Failed to add task inline');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const renderTaskRow = (task) => {
    const overdue = isOverdue(task);
    const completed = task.status === 'Done';

    return (
      <div 
        key={task._id} 
        className="flex items-center justify-between p-3.5 hover:bg-[#fafafa] border-b border-[#eeeeee] transition-colors group"
      >
        <div className="flex items-center gap-3.5 min-w-0">
          <button 
            onClick={() => handleToggleTask(task._id, task.status)}
            className="text-[#777777] hover:text-[#000000] transition-all flex-shrink-0"
          >
            {completed ? (
              <CheckCircle className="h-4.5 w-4.5 text-[#000000]" />
            ) : (
              <Circle className="h-4.5 w-4.5 text-[#c6c6c6] group-hover:text-[#000000]" />
            )}
          </button>
          
          <div className="min-w-0">
            <span className={`text-xs font-semibold ${completed ? 'line-through text-[#8a8b8c]' : 'text-[#1a1c1c]'}`}>
              {task.title}
            </span>
            <p className="text-[10px] text-[#777777] mt-0.5 max-w-xl truncate">
              {task.description || 'No description provided.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 flex-shrink-0">
          {overdue && (
            <span className="text-[9px] font-bold text-red-600 uppercase tracking-wider flex items-center gap-1">
              <AlertCircle className="h-3 w-3" /> Overdue
            </span>
          )}

          <div className="flex items-center gap-1.5 text-[10px] text-[#5e5e5e]">
            <Calendar className="h-3 w-3 text-[#8a8b8c]" />
            <span className="font-mono">
              {new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
            </span>
          </div>

          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${
            task.priority === 'High' ? 'bg-red-50 text-red-700 border-red-200' :
            task.priority === 'Medium' ? 'bg-amber-50 text-amber-700 border-amber-200' :
            'bg-gray-50 text-gray-700 border-gray-200'
          }`}>
            {task.priority}
          </span>
        </div>
      </div>
    );
  };

  const renderSectionHeader = (id, title, count) => {
    const isExpanded = expanded[id];
    return (
      <button 
        onClick={() => toggleSection(id)}
        className="w-full flex items-center justify-between py-2 px-3 bg-[#f3f3f4] hover:bg-[#e8e8e9] border-t border-b border-[#e2e2e2] transition-colors text-left"
      >
        <div className="flex items-center gap-2">
          {isExpanded ? <ChevronDown className="h-4 w-4 text-[#5e5e5e]" /> : <ChevronRight className="h-4 w-4 text-[#5e5e5e]" />}
          <span className="text-xs font-bold text-[#1a1c1c] tracking-tight">{title}</span>
          <span className="text-[10px] text-[#777777] font-semibold bg-[#e2e2e2] px-1.5 py-0.5 rounded-full">
            {count}
          </span>
        </div>
      </button>
    );
  };

  const renderRapidInput = (section) => {
    return (
      <form 
        onSubmit={(e) => handleRapidAdd(section, e)} 
        className="flex items-center gap-3 p-3 bg-white border-b border-[#eeeeee]"
      >
        <Plus className="h-4 w-4 text-[#8a8b8c] flex-shrink-0" />
        <input
          type="text"
          value={rapidTitles[section]}
          onChange={(e) => setRapidTitles(prev => ({ ...prev, [section]: e.target.value }))}
          placeholder="Type a task title and press Enter to quickly add to this section..."
          className="flex-1 text-xs outline-none bg-transparent placeholder-[#a0a0a0] text-[#1a1c1c] py-0.5"
        />

        {projects.length > 1 && (
          <select
            value={rapidProjects}
            onChange={(e) => setRapidProjects(e.target.value)}
            className="text-[10px] font-semibold text-[#5e5e5e] border border-[#c6c6c6] bg-white rounded py-1 px-2 outline-none focus:border-[#000000]"
          >
            {projects.map(p => (
              <option key={p._id} value={p._id}>{p.name}</option>
            ))}
          </select>
        )}
      </form>
    );
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#f9f9f9] select-none flex flex-col h-full">
      
      {/* 1. Header Toolbar Subtabs */}
      <div className="border-b border-[#e2e2e2] bg-white flex items-center justify-between px-6 py-2">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setActiveSubTab('list')}
            className={`flex items-center gap-1.5 text-xs font-bold py-1.5 px-3 rounded border ${
              activeSubTab === 'list' 
                ? 'bg-[#000000] text-white border-black' 
                : 'text-[#5e5e5e] border-transparent hover:bg-[#f3f3f4]'
            } transition-all`}
          >
            <List className="h-3.5 w-3.5" />
            <span>List View</span>
          </button>

          <button 
            onClick={() => setActiveSubTab('calendar')}
            className={`flex items-center gap-1.5 text-xs font-bold py-1.5 px-3 rounded border ${
              activeSubTab === 'calendar' 
                ? 'bg-[#000000] text-white border-black' 
                : 'text-[#5e5e5e] border-transparent hover:bg-[#f3f3f4]'
            } transition-all`}
          >
            <CalendarIcon className="h-3.5 w-3.5" />
            <span>Calendar View</span>
          </button>
        </div>

        <span className="text-[10px] font-semibold text-[#8a8b8c]">
          Private to you
        </span>
      </div>

      {activeSubTab === 'list' ? (
        <div className="flex-1 p-6 space-y-6">
          
          <div className="glass rounded overflow-hidden">
            
            {/* a. Recently Assigned */}
            {renderSectionHeader('recent', 'Recently assigned', categorizedTasks.recent.length)}
            {expanded.recent && (
              <div>
                {renderRapidInput('recent')}
                {categorizedTasks.recent.length === 0 ? (
                  <p className="text-[11px] text-[#777777] italic p-4 text-center bg-white border-b border-[#eeeeee]">No recently assigned tasks.</p>
                ) : (
                  categorizedTasks.recent.map(renderTaskRow)
                )}
              </div>
            )}

            {/* b. Do Today */}
            {renderSectionHeader('today', 'Do today', categorizedTasks.today.length)}
            {expanded.today && (
              <div>
                {renderRapidInput('today')}
                {categorizedTasks.today.length === 0 ? (
                  <p className="text-[11px] text-[#777777] italic p-4 text-center bg-white border-b border-[#eeeeee]">No tasks due today.</p>
                ) : (
                  categorizedTasks.today.map(renderTaskRow)
                )}
              </div>
            )}

            {/* c. Do Next Week */}
            {renderSectionHeader('nextWeek', 'Do next week', categorizedTasks.nextWeek.length)}
            {expanded.nextWeek && (
              <div>
                {renderRapidInput('nextWeek')}
                {categorizedTasks.nextWeek.length === 0 ? (
                  <p className="text-[11px] text-[#777777] italic p-4 text-center bg-white border-b border-[#eeeeee]">No tasks due next week.</p>
                ) : (
                  categorizedTasks.nextWeek.map(renderTaskRow)
                )}
              </div>
            )}

            {/* d. Do Later */}
            {renderSectionHeader('later', 'Do later & Completed', categorizedTasks.later.length)}
            {expanded.later && (
              <div>
                {renderRapidInput('later')}
                {categorizedTasks.later.length === 0 ? (
                  <p className="text-[11px] text-[#777777] italic p-4 text-center bg-white">No future or completed tasks.</p>
                ) : (
                  categorizedTasks.later.map(renderTaskRow)
                )}
              </div>
            )}

          </div>

        </div>
      ) : (
        <div className="flex-1 p-6 flex flex-col items-center justify-center bg-white m-6 rounded border border-[#e2e2e2]">
          <CalendarIcon className="h-10 w-10 text-[#c6c6c6] mb-3" />
          <h3 className="text-sm font-bold text-[#1a1c1c] uppercase tracking-wider">Monochrome Calendar Agenda</h3>
          <p className="text-xs text-[#5e5e5e] text-center max-w-sm mt-1">
            Displaying your agenda for this month. In active design view, this calendar connects seamlessly to backend schedulers.
          </p>

          <div className="w-full max-w-xl border border-[#e2e2e2] rounded mt-6 overflow-hidden">
            <div className="grid grid-cols-7 text-center bg-[#f3f3f4] border-b border-[#e2e2e2] py-2 text-[10px] font-bold text-[#5e5e5e]">
              <span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
            </div>
            <div className="grid grid-cols-7 text-center divide-x divide-y divide-[#eeeeee] bg-white h-48">
              {Array.from({ length: 28 }).map((_, idx) => {
                const dayTasks = myAllTasks.filter(t => {
                  const taskDay = new Date(t.dueDate).getDate();
                  // simple mock match days
                  return (taskDay % 28) === idx;
                });

                return (
                  <div key={idx} className="p-1 text-left relative flex flex-col justify-between">
                    <span className="text-[9px] font-bold text-[#8a8b8c]">{idx + 1}</span>
                    {dayTasks.length > 0 && (
                      <div className="bg-[#1a1c1c] text-white text-[8px] font-bold px-1 py-0.5 rounded truncate leading-none">
                        {dayTasks.length} Task(s)
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default MyTasksView;
