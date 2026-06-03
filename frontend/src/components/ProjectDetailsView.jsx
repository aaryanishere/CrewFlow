import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Users, 
  Trash2, 
  Plus, 
  Calendar, 
  AlertCircle,
  FolderKanban,
  CheckCircle,
  Circle,
  FileText
} from 'lucide-react';

const ProjectDetailsView = ({ 
  projectId, 
  projects = [], 
  tasks = [], 
  onStatusUpdated, 
  onTaskDeleted, 
  onDeleteProject,
  onNewTask,
  token 
}) => {
  const { user } = useAuth();
  const effectiveUser = user || { email: 'guest@crewflow.com', role: 'Admin', _id: 'guest_id' };
  const activeProject = projects.find(p => p._id === projectId);

  if (!activeProject) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-[#f9f9f9]">
        <FolderKanban className="h-10 w-10 text-[#c6c6c6] mb-3" />
        <h3 className="text-sm font-bold text-[#1a1c1c] uppercase tracking-wider">Project Not Found</h3>
        <p className="text-xs text-[#5e5e5e] mt-1">This project workspace may have been deleted or archived.</p>
      </div>
    );
  }

  // Filter tasks belonging to the active project
  const projectTasks = tasks.filter(t => {
    const projId = t.projectId?._id || t.projectId;
    return projId === activeProject._id;
  });

  const isOverdue = (task) => {
    return new Date(task.dueDate) < new Date() && task.status !== 'Done';
  };

  const handleStatusChange = async (taskId, newStatus) => {
    if (!token) {
      const task = tasks.find(t => t._id === taskId);
      if (task) {
        const updatedTask = { ...task, status: newStatus };
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
        body: JSON.stringify({ status: newStatus })
      });

      if (res.ok) {
        const updatedTask = await res.json();
        onStatusUpdated(updatedTask);
      } else {
        const err = await res.json();
        alert(err.message || 'Failed to update task status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleToggleTaskStatus = async (taskId, currentStatus) => {
    const nextStatus = currentStatus === 'Done' ? 'To Do' : 'Done';
    await handleStatusChange(taskId, nextStatus);
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    if (!token) {
      onTaskDeleted(taskId);
      return;
    }
    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        onTaskDeleted(taskId);
      } else {
        const err = await res.json();
        alert(err.message || 'Failed to delete task');
      }
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleDeleteProject = async () => {
    if (!window.confirm('Are you sure you want to delete this project? This will permanently delete all associated tasks.')) return;
    if (!token) {
      onDeleteProject(activeProject._id);
      return;
    }
    try {
      const res = await fetch(`/api/projects/${activeProject._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        onDeleteProject(activeProject._id);
      } else {
        const err = await res.json();
        alert(err.message || 'Failed to delete project');
      }
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#f9f9f9] p-6 space-y-6 select-none flex flex-col h-full">
      
      {/* 1. Project Summary Header */}
      <div className="glass rounded p-6 bg-white border border-[#e2e2e2] flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-black"></span>
            <h2 className="text-base font-bold text-[#1a1c1c] tracking-tight">{activeProject.name}</h2>
          </div>
          <p className="text-xs text-[#5e5e5e] mt-1 max-w-xl leading-relaxed">
            {activeProject.description || 'No description provided for this project.'}
          </p>

          <div className="flex items-center gap-3 mt-4 text-[10px] text-[#777777] font-semibold">
            <span className="flex items-center gap-1 bg-[#f3f3f4] py-1 px-2.5 rounded border border-[#eeeeee]">
              <Users className="h-3.5 w-3.5 text-[#5e5e5e]" />
              <span>{activeProject.members?.length || 0} Members Collaborating</span>
            </span>
          </div>
        </div>

        {effectiveUser.role === 'Admin' && (
          <button 
            onClick={handleDeleteProject}
            className="flex items-center justify-center gap-1.5 py-1.5 px-3 rounded border border-red-200 text-red-700 bg-red-50 hover:bg-red-100 transition-colors text-xs font-bold self-start md:self-center"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Delete Project</span>
          </button>
        )}
      </div>

      {/* 2. Tasks Table Card */}
      <div className="glass rounded bg-white overflow-hidden flex flex-col flex-1">
        
        {/* Table Actions Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#e2e2e2] bg-[#fdfdfd]">
          <span className="text-xs font-bold text-[#1a1c1c] uppercase tracking-wider">
            Tasks Ledger ({projectTasks.length})
          </span>

          {effectiveUser.role === 'Admin' && (
            <button 
              onClick={onNewTask}
              className="flex items-center gap-1 btn-black py-1 px-3 text-xs font-bold"
            >
              <Plus className="h-3.5 w-3.5 text-white" />
              <span>Add Task</span>
            </button>
          )}
        </div>

        {projectTasks.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center py-16 text-center">
            <FileText className="h-8 w-8 text-[#c6c6c6] mb-2" />
            <p className="text-xs text-[#777777] italic">No active tasks in this project.</p>
            {effectiveUser.role === 'Admin' && (
              <button 
                onClick={onNewTask}
                className="mt-3 text-[11px] font-bold text-black underline uppercase tracking-wider"
              >
                Add the first task
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto flex-1">
            <table className="min-w-full divide-y divide-[#eeeeee]">
              
              <thead>
                <tr className="bg-[#f9f9f9]">
                  <th className="mono-table-header w-12"></th>
                  <th className="mono-table-header">Task Title & Details</th>
                  <th className="mono-table-header">Assignee</th>
                  <th className="mono-table-header">Due Date</th>
                  <th className="mono-table-header">Priority</th>
                  <th className="mono-table-header">Status</th>
                  {effectiveUser.role === 'Admin' && <th className="mono-table-header w-12"></th>}
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-[#eeeeee]">
                {projectTasks.map(task => {
                  const overdue = isOverdue(task);
                  const completed = task.status === 'Done';
                  const assigneeEmail = task.assignedTo?.email || 'Unassigned';
                  const assigneeName = assigneeEmail.split('@')[0];

                  return (
                    <tr key={task._id} className="hover:bg-[#fcfcfc] transition-colors group">
                      
                      {/* Checkbox Trigger */}
                      <td className="mono-table-cell text-center">
                        <button 
                          onClick={() => handleToggleTaskStatus(task._id, task.status)}
                          className="text-[#777777] hover:text-[#000000] transition-colors"
                        >
                          {completed ? (
                            <CheckCircle className="h-4.5 w-4.5 text-[#000000]" />
                          ) : (
                            <Circle className="h-4.5 w-4.5 text-[#c6c6c6]" />
                          )}
                        </button>
                      </td>

                      {/* Title & Description */}
                      <td className="mono-table-cell min-w-[200px]">
                        <div className="flex items-center gap-2">
                          <span className={`font-semibold ${completed ? 'line-through text-[#8a8b8c]' : 'text-[#1a1c1c]'}`}>
                            {task.title}
                          </span>
                          {overdue && (
                            <span className="text-[8px] font-bold text-red-700 bg-red-50 border border-red-200 px-1.5 py-0.5 rounded flex items-center gap-0.5 animate-pulse flex-shrink-0">
                              <AlertCircle className="h-2.5 w-2.5" /> Overdue
                            </span>
                          )}
                        </div>
                        {task.description && (
                          <p className="text-[10px] text-[#777777] mt-0.5 max-w-sm truncate leading-tight">
                            {task.description}
                          </p>
                        )}
                      </td>

                      {/* Assignee Card */}
                      <td className="mono-table-cell whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <div className="h-5 w-5 rounded-full bg-[#f3f3f4] border border-[#e2e2e2] flex items-center justify-center text-[9px] font-bold text-[#1a1c1c]">
                            {assigneeName.slice(0, 2).toUpperCase()}
                          </div>
                          <span className="text-xs text-[#5e5e5e] font-medium">{assigneeEmail}</span>
                        </div>
                      </td>

                      {/* Due Date */}
                      <td className="mono-table-cell whitespace-nowrap">
                        <div className="flex items-center gap-1 text-[11px] text-[#5e5e5e] font-semibold font-mono">
                          <Calendar className="h-3.5 w-3.5 text-[#8a8b8c]" />
                          <span>
                            {new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                        </div>
                      </td>

                      {/* Priority Tag */}
                      <td className="mono-table-cell">
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${
                          task.priority === 'High' ? 'bg-red-50 text-red-700 border-red-200' :
                          task.priority === 'Medium' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                          'bg-gray-50 text-gray-700 border-gray-200'
                        }`}>
                          {task.priority}
                        </span>
                      </td>

                      {/* Status Dropdown / Label */}
                      <td className="mono-table-cell">
                        <select
                          value={task.status}
                          onChange={(e) => handleStatusChange(task._id, e.target.value)}
                          className={`text-xs font-bold border rounded bg-white py-1 px-2 outline-none focus:border-black cursor-pointer transition-colors ${
                            task.status === 'Done' ? 'border-emerald-200 text-emerald-700 bg-emerald-50' :
                            task.status === 'In Progress' ? 'border-indigo-200 text-indigo-700 bg-indigo-50' :
                            'border-[#c6c6c6] text-[#5e5e5e]'
                          }`}
                        >
                          <option value="To Do">To Do</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Done">Done</option>
                        </select>
                      </td>

                      {/* Admin Delete Action */}
                      {effectiveUser.role === 'Admin' && (
                        <td className="mono-table-cell text-center">
                          <button
                            onClick={() => handleDeleteTask(task._id)}
                            className="p-1 hover:bg-red-50 border border-transparent hover:border-red-200 rounded text-[#8a8b8c] hover:text-red-700 transition-colors opacity-0 group-hover:opacity-100"
                            title="Delete Task"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </td>
                      )}

                    </tr>
                  );
                })}
              </tbody>

            </table>
          </div>
        )}

      </div>

    </div>
  );
};

export default ProjectDetailsView;
