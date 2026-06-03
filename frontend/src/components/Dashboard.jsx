import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  ClipboardList, 
  CheckCircle2, 
  Clock, 
  AlertOctagon, 
  FolderPlus, 
  PlusSquare,
  RefreshCw
} from 'lucide-react';
import ProjectList from './ProjectList';
import ProjectModal from './ProjectModal';
import TaskModal from './TaskModal';

const Dashboard = () => {
  const { user, token } = useAuth();
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [metrics, setMetrics] = useState({ total: 0, completed: 0, pending: 0, overdue: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError('');
    try {
      const projectsRes = await fetch('/api/projects', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      let projectsData = [];
      if (projectsRes.ok) {
        projectsData = await projectsRes.json();
        setProjects(projectsData);
      } else {
        throw new Error('Failed to retrieve projects');
      }

      const tasksRes = await fetch('/api/tasks', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (tasksRes.ok) {
        const tasksData = await tasksRes.json();
        setTasks(tasksData);
      } else {
        throw new Error('Failed to retrieve tasks');
      }

      const metricsRes = await fetch('/api/dashboard/metrics', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (metricsRes.ok) {
        const metricsData = await metricsRes.json();
        setMetrics(metricsData);
      } else {
        throw new Error('Failed to retrieve dashboard metrics');
      }

    } catch (err) {
      console.error(err);
      setError(err.message || 'Error occurred loading data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [token]);

  const handleTaskStatusUpdated = (updatedTask) => {
    setTasks(tasks.map(t => t._id === updatedTask._id ? updatedTask : t));
    refreshMetricsOnly();
  };

  const handleTaskDeleted = (taskId) => {
    setTasks(tasks.filter(t => t._id !== taskId));
    refreshMetricsOnly();
  };

  const handleProjectDeleted = (projectId) => {
    setProjects(projects.filter(p => p._id !== projectId));
    setTasks(tasks.filter(t => (t.projectId?._id || t.projectId) !== projectId));
    refreshMetricsOnly();
  };

  const handleProjectCreated = (newProject) => {
    setProjects([newProject, ...projects]);
    setShowProjectModal(false);
    refreshMetricsOnly();
  };

  const handleTaskCreated = (newTask) => {
    setTasks([newTask, ...tasks]);
    setShowTaskModal(false);
    refreshMetricsOnly();
  };

  const refreshMetricsOnly = async () => {
    try {
      const res = await fetch('/api/dashboard/metrics', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const metricsData = await res.json();
        setMetrics(metricsData);
      }
    } catch (err) {
      console.error('Error refreshing metrics:', err);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8 relative">
      
      <div className="absolute top-0 right-10 -z-10 h-96 w-96 rounded-full bg-indigo-500/5 blur-3xl"></div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl font-sans">
            Workspace Dashboard
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time delivery progress metrics and workflow tracking
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={fetchDashboardData}
            className="flex items-center justify-center p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-all duration-200"
            title="Refresh Dashboard"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          {user?.role === 'Admin' && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowProjectModal(true)}
                className="flex items-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 px-4 py-2 text-xs font-semibold text-white transition-all shadow-lg shadow-indigo-600/15"
              >
                <FolderPlus className="h-4 w-4" />
                <span>New Project</span>
              </button>
              
              <button
                onClick={() => setShowTaskModal(true)}
                disabled={projects.length === 0}
                className="flex items-center gap-1.5 rounded-xl bg-slate-900 hover:bg-slate-800/80 border border-slate-800 px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <PlusSquare className="h-4 w-4 text-indigo-400" />
                <span>New Task</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-4 text-sm text-red-400 flex items-center gap-2">
          <AlertOctagon className="h-5 w-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        
        <div className="rounded-2xl border border-slate-800 bg-slate-900/30 p-5 shadow-lg glass glow-border flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shadow-inner">
            <ClipboardList className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Total Tasks</p>
            <h3 className="text-2xl font-extrabold tracking-tight text-white mt-1 font-sans">{metrics.total}</h3>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/30 p-5 shadow-lg glass glow-border flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-inner">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Completed</p>
            <h3 className="text-2xl font-extrabold tracking-tight text-white mt-1 font-sans">{metrics.completed}</h3>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/30 p-5 shadow-lg glass glow-border flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 shadow-inner">
            <Clock className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Pending</p>
            <h3 className="text-2xl font-extrabold tracking-tight text-white mt-1 font-sans">{metrics.pending}</h3>
          </div>
        </div>

        <div className="rounded-2xl border p-5 shadow-lg glass transition-all flex items-center gap-4 border-slate-800 bg-slate-900/30">
          <div className={`flex h-12 w-12 items-center justify-center rounded-xl border shadow-inner ${
            metrics.overdue > 0 
              ? 'bg-rose-500/20 text-rose-400 border-rose-500/30 animate-pulse' 
              : 'bg-slate-800 text-slate-500 border-slate-700'
          }`}>
            <AlertOctagon className="h-6 w-6" />
          </div>
          <div>
            <p className={`text-[10px] font-bold uppercase tracking-wider ${metrics.overdue > 0 ? 'text-rose-400' : 'text-slate-500'}`}>
              Overdue Tasks
            </p>
            <h3 className={`text-2xl font-extrabold tracking-tight mt-1 font-sans ${metrics.overdue > 0 ? 'text-rose-400 font-black' : 'text-white'}`}>
              {metrics.overdue}
            </h3>
          </div>
        </div>

      </div>

      {loading && projects.length === 0 ? (
        <div className="flex h-64 flex-col items-center justify-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
          <p className="text-sm text-slate-500">Loading delivery boards...</p>
        </div>
      ) : (
        <ProjectList 
          user={user}
          token={token}
          projects={projects}
          tasks={tasks}
          onStatusUpdated={handleTaskStatusUpdated}
          onTaskDeleted={handleTaskDeleted}
          onDeleteProject={handleProjectDeleted}
        />
      )}

      {showProjectModal && (
        <ProjectModal 
          token={token}
          onClose={() => setShowProjectModal(false)}
          onProjectCreated={handleProjectCreated}
        />
      )}

      {showTaskModal && (
        <TaskModal 
          token={token}
          projects={projects}
          selectedProjectId={projects[0]?._id}
          onClose={() => setShowTaskModal(false)}
          onTaskCreated={handleTaskCreated}
        />
      )}

    </div>
  );
};

export default Dashboard;
