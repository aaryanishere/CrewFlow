import React, { useState, useEffect } from 'react';
import { X, Plus, Calendar, AlertTriangle } from 'lucide-react';

const TaskModal = ({ token, projects, selectedProjectId, onClose, onTaskCreated }) => {
  const [projectId, setProjectId] = useState(selectedProjectId || '');
  const [assignedTo, setAssignedTo] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [projectMembers, setProjectMembers] = useState([]);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (projectId) {
      const selectedProject = projects.find(p => p._id === projectId);
      if (selectedProject) {
        setProjectMembers(selectedProject.members || []);
        setAssignedTo('');
      }
    } else {
      setProjectMembers([]);
      setAssignedTo('');
    }
  }, [projectId, projects]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!projectId) {
      setError('Please select a project');
      return;
    }

    if (!assignedTo) {
      setError('Please select an assignee');
      return;
    }

    if (!title || title.trim() === '') {
      setError('Task title is required');
      return;
    }

    if (!dueDate) {
      setError('Please select a due date');
      return;
    }

    setSubmitting(true);
    try {
      if (!token) {
        // Guest mode / token-less simulation
        const selectedProject = projects.find(p => p._id === projectId);
        const assignedMember = projectMembers.find(m => m._id === assignedTo) || { _id: assignedTo, email: 'guest@crewflow.com' };
        
        const newTask = {
          _id: 'task_' + Math.random().toString(36).substring(2, 9),
          projectId,
          projectName: selectedProject ? selectedProject.name : 'Simulated Project',
          assignedTo: {
            _id: assignedMember._id || assignedMember,
            email: assignedMember.email || 'guest@crewflow.com'
          },
          title,
          description,
          dueDate,
          priority,
          status: 'To Do',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        setTimeout(() => {
          onTaskCreated(newTask);
          setSubmitting(false);
        }, 300);
        return;
      }

      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          projectId,
          assignedTo,
          title,
          description,
          dueDate,
          priority
        })
      });

      if (res.ok) {
        const newTask = await res.json();
        onTaskCreated(newTask);
      } else {
        const errData = await res.json();
        throw new Error(errData.message || 'Failed to assign task');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      if (token) {
        setSubmitting(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs select-none">
      <div className="w-full max-w-lg rounded glass p-6 shadow-xl relative bg-white border border-[#e2e2e2]">
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-[#777777] hover:text-[#000000] rounded p-1 hover:bg-[#f3f3f4] transition-all"
        >
          <X className="h-4.5 w-4.5" />
        </button>

        <h3 className="text-base font-bold text-[#1a1c1c] mb-1 font-sans">Create Task</h3>
        <p className="text-[11px] text-[#5e5e5e] mb-6">Assign a specific workflow milestone to a workspace team member.</p>

        {error && (
          <div className="mb-4 rounded border border-red-200 bg-red-50 p-3 text-xs font-semibold text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-[#5e5e5e] mb-1.5">Target Project *</label>
            <select
              required
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              className="glass-input block w-full rounded py-2 px-3 text-xs focus:border-black bg-white"
            >
              <option value="" disabled>-- Choose a Project --</option>
              {projects.map(p => (
                <option key={p._id} value={p._id}>{p.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-[#5e5e5e] mb-1.5">Assignee *</label>
            <select
              required
              disabled={!projectId}
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              className="glass-input block w-full rounded py-2 px-3 text-xs focus:border-black bg-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="" disabled>
                {projectId ? '-- Select a Team Member --' : '-- Choose Project First --'}
              </option>
              {projectMembers.map(m => (
                <option key={m._id} value={m._id}>{m.email}</option>
              ))}
            </select>
            {projectId && projectMembers.length === 0 && (
              <p className="text-[9px] text-amber-700 mt-1 flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" /> Warning: No members are assigned to this project yet.
              </p>
            )}
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-[#5e5e5e] mb-1.5">Task Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Design relational data schemas"
              className="glass-input block w-full rounded py-2 px-3 text-xs placeholder-[#a0a0a0]"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-[#5e5e5e] mb-1.5">Description</label>
            <textarea
              rows="2"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Explicit sub-tasks and acceptance criteria..."
              className="glass-input block w-full rounded py-2 px-3 text-xs placeholder-[#a0a0a0]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#5e5e5e] mb-1.5 flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-[#5e5e5e]" /> Due Date *
              </label>
              <input
                type="date"
                required
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="glass-input block w-full rounded py-2 px-3 text-xs focus:border-black bg-white"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#5e5e5e] mb-1.5">Priority Tier</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="glass-input block w-full rounded py-2 px-3 text-xs focus:border-black bg-white"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-[#eeeeee]">
            <button
              type="button"
              onClick={onClose}
              className="rounded border border-[#c6c6c6] px-4 py-2 text-xs font-semibold text-[#5e5e5e] hover:text-[#000000] hover:bg-[#f3f3f4] transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="btn-black text-xs font-bold py-2.5 px-4 flex items-center gap-1.5"
            >
              {submitting ? (
                <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              ) : (
                <>
                  <Plus className="h-3.5 w-3.5 text-white" /> Assign Task
                </>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default TaskModal;
