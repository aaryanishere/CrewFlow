import React from 'react';
import { Calendar, Trash2, User, AlertCircle, Briefcase } from 'lucide-react';

const ProjectList = ({ user, token, projects, tasks, onStatusUpdated, onTaskDeleted, onDeleteProject }) => {

  const isOverdue = (task) => {
    return new Date(task.dueDate) < new Date() && task.status !== 'Done';
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      case 'Medium': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'Low': return 'bg-sky-500/10 text-sky-400 border-sky-500/20';
      default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Done': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'In Progress': return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
      case 'To Do': return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
      default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
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

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
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

  const handleDeleteProject = async (projectId) => {
    if (!window.confirm('Are you sure you want to delete this project? This will also cascade delete all its tasks.')) return;
    try {
      const res = await fetch(`/api/projects/${projectId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        onDeleteProject(projectId);
      } else {
        const err = await res.json();
        alert(err.message || 'Failed to delete project');
      }
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  return (
    <div className="space-y-8">
      {projects.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-900/10 p-12 text-center">
          <Briefcase className="mx-auto h-8 w-8 text-slate-500 mb-3" />
          <h3 className="text-sm font-semibold text-slate-300">No projects found</h3>
          <p className="text-xs text-slate-500 mt-1">
            {user.role === 'Admin' ? 'Click "Create Project" to get started!' : 'You have not been assigned to any project workspaces yet.'}
          </p>
        </div>
      ) : (
        projects.map((project) => {
          const projectTasks = tasks.filter(t => t.projectId?._id === project._id || t.projectId === project._id);

          return (
            <div key={project._id} className="rounded-2xl border border-slate-800/80 bg-slate-900/20 p-6 shadow-xl glass glow-border">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4 mb-6">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-indigo-500"></span>
                    <h3 className="text-lg font-bold text-white font-sans tracking-tight">{project.name}</h3>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 pl-4 max-w-2xl">{project.description || 'No description provided.'}</p>
                </div>
                
                <div className="flex items-center gap-3 self-start sm:self-center pl-4 sm:pl-0">
                  <div className="flex items-center gap-1.5 rounded-lg bg-slate-950 px-2.5 py-1 border border-slate-800/80 text-[10px] font-semibold text-slate-400">
                    <User className="h-3 w-3 text-indigo-400" /> {project.members?.length || 0} Members
                  </div>
                  {user.role === 'Admin' && (
                    <button
                      onClick={() => handleDeleteProject(project._id)}
                      className="rounded-lg p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all"
                      title="Delete Project (Cascade)"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-indigo-400 mb-2 pl-1">Tasks Workflow ({projectTasks.length})</h4>
                {projectTasks.length === 0 ? (
                  <p className="text-xs text-slate-500 italic py-4 pl-1">No tasks assigned to this project workspace.</p>
                ) : (
                  <div className="grid gap-3">
                    {projectTasks.map((task) => {
                      const overdue = isOverdue(task);
                      const isAssignedToMe = task.assignedTo?._id === user._id || task.assignedTo === user._id;
                      const canEditStatus = user.role === 'Admin' || isAssignedToMe;

                      return (
                        <div key={task._id} className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl border border-slate-800 bg-slate-950/40 hover:bg-slate-950/60 hover:border-slate-800/60 transition-all duration-150">
                          
                          <div className="flex-1 space-y-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-semibold text-sm text-slate-200">{task.title}</span>
                              
                              {overdue && (
                                <span className="inline-flex items-center gap-1 rounded-full bg-red-500/10 px-2 py-0.5 text-[10px] font-bold text-red-400 border border-red-500/25 animate-pulse">
                                  <AlertCircle className="h-3 w-3" /> Overdue
                                </span>
                              )}

                              <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold tracking-wide ${getPriorityColor(task.priority)}`}>
                                {task.priority}
                              </span>
                            </div>

                            <p className="text-xs text-slate-400 max-w-xl">{task.description || 'No description.'}</p>
                            
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-1.5 text-[11px] text-slate-500">
                              <span className="flex items-center gap-1">
                                <User className="h-3.5 w-3.5 text-slate-600" /> 
                                Assignee: <span className="text-slate-400">{task.assignedTo?.email || 'Unassigned'}</span>
                                {isAssignedToMe && <span className="text-indigo-400 font-semibold ml-1">(You)</span>}
                              </span>
                              <span className={`flex items-center gap-1 ${overdue ? 'text-red-400/80 font-medium' : ''}`}>
                                <Calendar className="h-3.5 w-3.5 text-slate-600" />
                                Deadline: {new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 self-end md:self-center">
                            
                            {!canEditStatus && (
                              <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${getStatusColor(task.status)}`}>
                                {task.status}
                              </span>
                            )}

                            {canEditStatus && (
                              <select
                                value={task.status}
                                onChange={(e) => handleStatusChange(task._id, e.target.value)}
                                className={`rounded-xl border bg-slate-950 px-3 py-1.5 text-xs font-semibold text-slate-300 focus:text-slate-100 focus:outline-none transition-all duration-150 ${
                                  task.status === 'Done' ? 'border-emerald-500/30 hover:border-emerald-500/50 text-emerald-300' :
                                  task.status === 'In Progress' ? 'border-indigo-500/30 hover:border-indigo-500/50 text-indigo-300' :
                                  'border-slate-800 hover:border-slate-700 text-slate-400'
                                }`}
                              >
                                <option value="To Do">To Do</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Done">Done</option>
                              </select>
                            )}

                            {user.role === 'Admin' && (
                              <button
                                onClick={() => handleDeleteTask(task._id)}
                                className="rounded-xl p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 border border-slate-900 hover:border-rose-500/25 transition-all"
                                title="Delete Task"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            )}

                          </div>

                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default ProjectList;
