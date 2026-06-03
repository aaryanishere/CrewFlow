import React from 'react';
import { 
  FolderKanban, 
  Users, 
  CheckCircle2, 
  AlertTriangle,
  Clock,
  ArrowRight,
  ShieldAlert,
  ArrowUpRight
} from 'lucide-react';

const PortfoliosView = ({ 
  projects = [], 
  tasks = [], 
  setActiveView, 
  setActiveProjectId 
}) => {

  const getProjectStatus = (projectTasks) => {
    if (projectTasks.length === 0) return { label: 'Not Started', color: 'bg-gray-100 text-gray-700 border-gray-200' };
    
    const overdueTasks = projectTasks.filter(t => {
      return new Date(t.dueDate) < new Date() && t.status !== 'Done';
    });

    const pendingCount = projectTasks.filter(t => t.status !== 'Done').length;

    if (overdueTasks.length > 0) {
      return { label: 'At Risk', color: 'bg-red-50 text-red-700 border-red-200 animate-pulse' };
    }
    if (pendingCount > 4) {
      return { label: 'Needs Focus', color: 'bg-amber-50 text-amber-700 border-amber-200' };
    }
    return { label: 'On Track', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#f9f9f9] p-6 space-y-6 select-none">
      
      {/* Overview stats panel */}
      <div className="glass rounded p-6 bg-white flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-sm font-bold text-[#1a1c1c] uppercase tracking-wider">Workspace Portfolios</h2>
          <p className="text-xs text-[#5e5e5e] mt-1 max-w-xl leading-relaxed">
            Monitor the status, progress percentage, and timeline delivery across all active projects.
          </p>
        </div>

        <div className="flex items-center gap-6 flex-shrink-0">
          <div className="text-center">
            <span className="text-2xl font-black text-[#1a1c1c] leading-none">{projects.length}</span>
            <span className="block text-[9px] text-[#777777] uppercase tracking-wider mt-1">Projects</span>
          </div>
          <div className="h-8 w-px bg-[#e2e2e2]" />
          <div className="text-center">
            <span className="text-2xl font-black text-[#1a1c1c] leading-none">{tasks.length}</span>
            <span className="block text-[9px] text-[#777777] uppercase tracking-wider mt-1">Total Tasks</span>
          </div>
          <div className="h-8 w-px bg-[#e2e2e2]" />
          <div className="text-center">
            <span className="text-2xl font-black text-[#1a1c1c] leading-none">
              {tasks.length > 0 ? Math.round((tasks.filter(t => t.status === 'Done').length / tasks.length) * 100) : 0}%
            </span>
            <span className="block text-[9px] text-[#777777] uppercase tracking-wider mt-1">Completion</span>
          </div>
        </div>
      </div>

      {projects.length === 0 ? (
        <div className="rounded border border-dashed border-[#e2e2e2] bg-white p-12 text-center">
          <FolderKanban className="mx-auto h-8 w-8 text-[#c6c6c6] mb-3" />
          <h3 className="text-sm font-bold text-[#1a1c1c] uppercase tracking-wider">No portfolios active</h3>
          <p className="text-xs text-[#5e5e5e] mt-1">Create projects from the top header to begin dashboard monitoring.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map(proj => {
            const projTasks = tasks.filter(t => (t.projectId?._id || t.projectId) === proj._id);
            const totalTasks = projTasks.length;
            const completedCount = projTasks.filter(t => t.status === 'Done').length;
            const pendingCount = totalTasks - completedCount;
            const progressPercent = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;
            const status = getProjectStatus(projTasks);

            return (
              <div 
                key={proj._id}
                className="glass rounded bg-white hover:border-[#000000] transition-all flex flex-col p-6 space-y-4 group"
              >
                {/* 1. Header project title and tag */}
                <div className="flex items-start justify-between">
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-[#1a1c1c] group-hover:underline block truncate leading-tight">
                      {proj.name}
                    </span>
                    <p className="text-[10px] text-[#777777] mt-0.5 max-w-[200px] truncate leading-tight">
                      {proj.description || 'No description provided.'}
                    </p>
                  </div>

                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded border flex-shrink-0 ${status.color}`}>
                    {status.label}
                  </span>
                </div>

                {/* 2. Progress percentage bar */}
                <div className="space-y-1.5 pt-2">
                  <div className="flex items-center justify-between text-[10px] text-[#777777] font-semibold">
                    <span>Progress Tracker</span>
                    <span className="font-mono text-[#1a1c1c]">{progressPercent}%</span>
                  </div>
                  
                  {/* Monochrome loading bar */}
                  <div className="h-1.5 w-full bg-[#f3f3f4] rounded-full overflow-hidden border border-[#eeeeee]">
                    <div 
                      className="h-full bg-[#000000] rounded-full transition-all duration-500"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

                {/* 3. Task breakdown metric badges */}
                <div className="grid grid-cols-3 gap-2 pt-2 text-center text-[10px]">
                  <div className="bg-[#f9f9f9] border border-[#eeeeee] rounded p-1.5">
                    <span className="block font-bold text-[#1a1c1c]">{totalTasks}</span>
                    <span className="text-[8px] text-[#777777] uppercase tracking-wider font-semibold">Total</span>
                  </div>
                  <div className="bg-[#f9f9f9] border border-[#eeeeee] rounded p-1.5">
                    <span className="block font-bold text-[#1a1c1c]">{completedCount}</span>
                    <span className="text-[8px] text-[#777777] uppercase tracking-wider font-semibold">Done</span>
                  </div>
                  <div className="bg-[#f9f9f9] border border-[#eeeeee] rounded p-1.5">
                    <span className="block font-bold text-[#1a1c1c]">{pendingCount}</span>
                    <span className="text-[8px] text-[#777777] uppercase tracking-wider font-semibold">Pending</span>
                  </div>
                </div>

                {/* 4. Collaborator card and entry button */}
                <div className="flex items-center justify-between pt-4 border-t border-[#eeeeee]">
                  <div className="flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5 text-[#8a8b8c]" />
                    <span className="text-[10px] font-semibold text-[#5e5e5e]">
                      {proj.members?.length || 0} collaborators
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      setActiveProjectId(proj._id);
                      setActiveView('project-details');
                    }}
                    className="flex items-center gap-1 text-[10px] font-bold text-[#1a1c1c] hover:underline hover:text-[#000000]"
                  >
                    <span>Open View</span>
                    <ArrowUpRight className="h-3 w-3" />
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};

export default PortfoliosView;
