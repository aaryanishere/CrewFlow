import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Inbox, 
  Archive, 
  MessageSquare, 
  Sparkles, 
  CheckCircle2, 
  Activity,
  ArrowRight,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';

const InboxView = ({ tasks = [], projects = [] }) => {
  const { user } = useAuth();
  const [activeFilter, setActiveFilter] = useState('activity'); // 'activity' | 'archive' | 'mentions'
  const [summarizing, setSummarizing] = useState(false);
  const [aiSummaryText, setAiSummaryText] = useState('');

  // Extract completed tasks
  const completedTasks = tasks.filter(t => t.status === 'Done');
  // Extract high-priority overdue tasks
  const highPriorityAlerts = tasks.filter(t => t.priority === 'High' && t.status !== 'Done');

  // Triggering the dynamic AI summary generator
  const generateWorkspaceAiSummary = () => {
    setSummarizing(true);
    setTimeout(() => {
      const activeProjectsCount = projects.length;
      const completedCount = completedTasks.length;
      const totalPendingCount = tasks.filter(t => t.status !== 'Done').length;
      const highPriorityCount = highPriorityAlerts.length;

      const summaryText = `
### 🤖 CrewFlow AI Workspace Audit

**Workspace Health Index: ${totalPendingCount > 5 ? 'High Alert / Active' : 'Stable & On Track'}**

1. **Active Projects**: We are actively tracking **${activeProjectsCount} projects**.
2. **Delivery Progress**: A total of **${completedCount} tasks** have been successfully resolved and delivered.
3. **Workload Analysis**: There are **${totalPendingCount} pending tasks** outstanding across the team workspace.
4. **Immediate Risks & Blockers**:
   ${highPriorityCount > 0 
     ? `⚠️ **${highPriorityCount} HIGH PRIORITY task(s)** are currently outstanding. Action is recommended immediately to prevent pipeline bottlenecks.` 
     : '✅ Zero critical high-priority bottlenecks detected. Workflow is moving smoothly.'
   }

*Recommendation: Focus on resolving items in "${projects[0]?.name || 'active projects'}" to clear the immediate backlog.*
      `;
      setAiSummaryText(summaryText);
      setSummarizing(false);
    }, 850);
  };

  // Mock list of logs/activities mapped to actual tasks
  const activities = [];
  tasks.forEach((t, index) => {
    const project = projects.find(p => p._id === (t.projectId?._id || t.projectId));
    const projectName = project ? project.name : 'Workspace';
    const assigneeEmail = t.assignedTo?.email || 'someone';
    const assigneeName = assigneeEmail.split('@')[0];

    if (t.status === 'Done') {
      activities.push({
        id: `done-${t._id}`,
        type: 'completion',
        text: `resolved and completed task "${t.title}"`,
        project: projectName,
        user: assigneeName,
        time: '2 hours ago'
      });
    } else if (t.status === 'In Progress') {
      activities.push({
        id: `progress-${t._id}`,
        type: 'progress',
        text: `started working on task "${t.title}"`,
        project: projectName,
        user: assigneeName,
        time: 'Yesterday'
      });
    } else {
      activities.push({
        id: `assign-${t._id}`,
        type: 'assignment',
        text: `assigned task "${t.title}" to ${assigneeName}`,
        project: projectName,
        user: 'Admin',
        time: '3 days ago'
      });
    }
  });

  // Fallback activity if empty
  if (activities.length === 0) {
    activities.push({
      id: 'welcome',
      type: 'system',
      text: 'welcome to the newly designed monochrome workspace!',
      project: 'CrewFlow Core',
      user: 'System',
      time: 'Just now'
    });
  }

  return (
    <div className="flex-1 overflow-y-auto bg-[#f9f9f9] p-6 space-y-6 select-none flex flex-col lg:flex-row gap-6">
      
      {/* Left Columns - Activities Feed */}
      <div className="flex-1 space-y-4">
        
        {/* Navigation Filters */}
        <div className="flex items-center gap-1 bg-white border border-[#e2e2e2] p-1 rounded max-w-sm">
          <button
            onClick={() => setActiveFilter('activity')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded text-xs font-bold transition-all ${
              activeFilter === 'activity' ? 'bg-[#000000] text-white' : 'text-[#5e5e5e] hover:bg-[#f3f3f4]'
            }`}
          >
            <Activity className="h-3.5 w-3.5" />
            <span>Activity</span>
          </button>
          
          <button
            onClick={() => setActiveFilter('mentions')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded text-xs font-bold transition-all ${
              activeFilter === 'mentions' ? 'bg-[#000000] text-white' : 'text-[#5e5e5e] hover:bg-[#f3f3f4]'
            }`}
          >
            <MessageSquare className="h-3.5 w-3.5" />
            <span>Mentions</span>
          </button>

          <button
            onClick={() => setActiveFilter('archive')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded text-xs font-bold transition-all ${
              activeFilter === 'archive' ? 'bg-[#000000] text-white' : 'text-[#5e5e5e] hover:bg-[#f3f3f4]'
            }`}
          >
            <Archive className="h-3.5 w-3.5" />
            <span>Archive</span>
          </button>
        </div>

        {/* Activity Feed Container */}
        {activeFilter === 'activity' ? (
          <div className="glass rounded divide-y divide-[#eeeeee] bg-white overflow-hidden">
            {activities.map(act => (
              <div key={act.id} className="p-4 hover:bg-[#fdfdfd] transition-colors flex gap-3.5">
                <div className="h-8 w-8 rounded-full bg-[#f3f3f4] border border-[#e2e2e2] flex items-center justify-center text-[10px] font-bold text-[#1a1c1c] flex-shrink-0">
                  {act.user.slice(0, 2).toUpperCase()}
                </div>
                
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-[#1a1c1c] leading-relaxed">
                    <span className="font-bold">{act.user}</span>{' '}
                    {act.text}{' '}
                    in project <span className="font-semibold underline cursor-pointer">{act.project}</span>
                  </p>
                  <span className="text-[10px] text-[#8a8b8c] mt-1 block">
                    {act.time}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : activeFilter === 'mentions' ? (
          <div className="glass rounded p-8 text-center bg-white">
            <MessageSquare className="mx-auto h-8 w-8 text-[#c6c6c6] mb-2" />
            <p className="text-xs text-[#777777] italic">No active mentions found.</p>
          </div>
        ) : (
          <div className="glass rounded p-8 text-center bg-white">
            <Archive className="mx-auto h-8 w-8 text-[#c6c6c6] mb-2" />
            <p className="text-xs text-[#777777] italic">Archive folder is empty.</p>
          </div>
        )}

      </div>

      {/* Right Column - Premium AI Summary Widget */}
      <div className="w-full lg:w-96 flex-shrink-0">
        <div className="glass rounded p-6 bg-white border border-[#e2e2e2] space-y-6 flex flex-col">
          
          <div className="flex items-center justify-between pb-3 border-b border-[#eeeeee]">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4.5 w-4.5 text-[#000000]" />
              <h3 className="text-xs font-bold text-[#1a1c1c] uppercase tracking-wider">AI Workspace Intelligence</h3>
            </div>
            <span className="text-[9px] font-semibold text-[#5e5e5e] bg-[#f3f3f4] px-2 py-0.5 rounded">
              GPT-4
            </span>
          </div>

          <div className="space-y-4">
            <p className="text-xs text-[#5e5e5e] leading-relaxed">
              Instantly scan and audit your workspace's entire backlog of projects, due-dates, blockers, and assignee loads.
            </p>

            {aiSummaryText ? (
              <div className="bg-[#fdfdfd] border border-[#e2e2e2] p-4 rounded text-xs text-[#1a1c1c] space-y-3 leading-relaxed max-h-[350px] overflow-y-auto">
                <div className="prose prose-sm prose-neutral">
                  {aiSummaryText.split('\n').map((line, idx) => {
                    if (line.startsWith('###')) {
                      return <h4 key={idx} className="font-bold text-[#000000] border-b pb-1 mb-2">{line.replace('###', '')}</h4>;
                    }
                    if (line.startsWith('**') && line.endsWith('**')) {
                      return <p key={idx} className="font-bold text-center py-1 bg-[#f3f3f4] rounded text-[11px]">{line.replace(/\*\*/g, '')}</p>;
                    }
                    if (line.trim().startsWith('1.') || line.trim().startsWith('2.') || line.trim().startsWith('3.') || line.trim().startsWith('4.')) {
                      return <div key={idx} className="pl-2 border-l border-[#c6c6c6] my-1">{line}</div>;
                    }
                    return <p key={idx} className="text-[#5e5e5e]">{line}</p>;
                  })}
                </div>
                
                <button
                  onClick={() => setAiSummaryText('')}
                  className="w-full text-center text-[10px] font-bold text-[#777777] hover:text-[#000000] transition-colors pt-2 uppercase tracking-wider"
                >
                  Reset Analysis
                </button>
              </div>
            ) : (
              <button
                onClick={generateWorkspaceAiSummary}
                disabled={summarizing}
                className="w-full flex items-center justify-center gap-2 btn-black py-2.5 text-xs font-bold"
              >
                {summarizing ? (
                  <>
                    <div className="h-3 w-3 animate-spin rounded-full border border-white border-t-transparent"></div>
                    <span>Auditing Database...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-3.5 w-3.5 text-white" />
                    <span>Generate AI Workspace Audit</span>
                  </>
                )}
              </button>
            )}
          </div>

          <div className="bg-[#fafafa] border border-[#eeeeee] p-3 rounded space-y-2">
            <h4 className="text-[10px] font-bold text-[#1a1c1c] uppercase tracking-wider flex items-center gap-1.5">
              <TrendingUp className="h-3.5 w-3.5" /> Core Workspace Stats
            </h4>
            <div className="grid grid-cols-3 gap-2 text-center pt-1">
              <div className="bg-white p-2 rounded border border-[#e2e2e2]">
                <span className="block text-xs font-bold text-[#1a1c1c]">{tasks.length}</span>
                <span className="text-[8px] text-[#777777] uppercase tracking-wider">Total</span>
              </div>
              <div className="bg-white p-2 rounded border border-[#e2e2e2]">
                <span className="block text-xs font-bold text-emerald-600">{completedTasks.length}</span>
                <span className="text-[8px] text-[#777777] uppercase tracking-wider">Done</span>
              </div>
              <div className="bg-white p-2 rounded border border-[#e2e2e2]">
                <span className="block text-xs font-bold text-amber-600">{tasks.filter(t => t.status !== 'Done').length}</span>
                <span className="text-[8px] text-[#777777] uppercase tracking-wider">Pending</span>
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};

export default InboxView;
