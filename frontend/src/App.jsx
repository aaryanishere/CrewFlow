import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/Login';
import Signup from './components/Signup';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import HomeView from './components/HomeView';
import InboxView from './components/InboxView';
import MyTasksView from './components/MyTasksView';
import PortfoliosView from './components/PortfoliosView';
import ProjectDetailsView from './components/ProjectDetailsView';
import ProjectModal from './components/ProjectModal';
import TaskModal from './components/TaskModal';
import InviteModal from './components/InviteModal';
import BrowseProjectsView from './components/BrowseProjectsView';
import StrategyGoalsView from './components/StrategyGoalsView';
import StrategyReportingView from './components/StrategyReportingView';
import StrategyResourcingView from './components/StrategyResourcingView';
import StrategyDashboardView from './components/StrategyDashboardView';
import PeopleView from './components/PeopleView';
import TeamView from './components/TeamView';
import WorkflowView from './components/WorkflowView';
import { CheckCircle } from 'lucide-react';

function AppContent() {
  const { user, token, loading: authLoading } = useAuth();
  const [authView, setAuthView] = useState('login');
  const [skippedAuth, setSkippedAuth] = useState(false);
  
  // Workspace Views State
  const [activeModule, setActiveModule] = useState('work'); // 'work' | 'strategy' | 'workflow' | 'people'
  const [activeView, setActiveView] = useState('home'); // 'home' | 'inbox' | 'my-tasks' | 'portfolios' | 'project-details'
  const [activeProjectId, setActiveProjectId] = useState(null);
  const [activeTeamId, setActiveTeamId] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Core Data States
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [error, setError] = useState('');

  // Modals Visibility
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteSuccessToast, setInviteSuccessToast] = useState(false);

  // Seed mock data when auth is skipped (guest/offline mode)
  useEffect(() => {
    if (skippedAuth) {
      const mockProjects = [
        {
          _id: 'mock_project_1',
          name: 'CrewFlow Product Launch',
          description: 'Go-to-market plan, social media outreach, and system monitoring checks.',
          createdBy: 'guest_id',
          members: [
            { _id: 'guest_id', email: 'guest@crewflow.com', role: 'Admin' },
            { _id: 'member_id_1', email: 'member@crewflow.com', role: 'Member' },
            { _id: 'admin_id_1', email: 'admin@crewflow.com', role: 'Admin' }
          ]
        },
        {
          _id: 'mock_project_2',
          name: 'Monochrome Overhaul',
          description: 'Transitioning visual assets and dashboard panels to high-contrast grayscale.',
          createdBy: 'guest_id',
          members: [
            { _id: 'guest_id', email: 'guest@crewflow.com', role: 'Admin' },
            { _id: 'member_id_1', email: 'member@crewflow.com', role: 'Member' }
          ]
        },
        {
          _id: 'mock_project_3',
          name: 'Marketing Blitz Q3',
          description: 'Multi-channel acquisition campaigns and visual copy asset generation pipelines.',
          createdBy: 'guest_id',
          members: [
            { _id: 'guest_id', email: 'guest@crewflow.com', role: 'Admin' },
            { _id: 'admin_id_1', email: 'admin@crewflow.com', role: 'Admin' }
          ]
        },
        {
          _id: 'mock_project_4',
          name: 'Security Infrastructure Audit',
          description: 'Compliance audits, database credential rotations, and JWT signature verification updates.',
          createdBy: 'guest_id',
          members: [
            { _id: 'guest_id', email: 'guest@crewflow.com', role: 'Admin' },
            { _id: 'member_id_1', email: 'member@crewflow.com', role: 'Member' }
          ]
        }
      ];

      const mockTasks = [
        {
          _id: 'mock_task_1',
          projectId: 'mock_project_1',
          projectName: 'CrewFlow Product Launch',
          assignedTo: { _id: 'guest_id', email: 'guest@crewflow.com' },
          title: 'Review landing page accessibility parameters',
          description: 'Audit accessibility colors and check form accessibility guidelines.',
          dueDate: new Date().toISOString().split('T')[0],
          priority: 'High',
          status: 'To Do',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          _id: 'mock_task_2',
          projectId: 'mock_project_1',
          projectName: 'CrewFlow Product Launch',
          assignedTo: { _id: 'guest_id', email: 'guest@crewflow.com' },
          title: 'Draft press release for beta release',
          description: 'Mention the new gorgeous monochrome styling scheme.',
          dueDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
          priority: 'Medium',
          status: 'To Do',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          _id: 'mock_task_4',
          projectId: 'mock_project_3',
          projectName: 'Marketing Blitz Q3',
          assignedTo: { _id: 'guest_id', email: 'guest@crewflow.com' },
          title: 'Finalize social media copy specifications',
          description: 'Approve HSL branding guides for post assets.',
          dueDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
          priority: 'High',
          status: 'In Progress',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          _id: 'mock_task_5',
          projectId: 'mock_project_4',
          projectName: 'Security Infrastructure Audit',
          assignedTo: { _id: 'guest_id', email: 'guest@crewflow.com' },
          title: 'Rotate local development signing secrets',
          description: 'Ensure local keys match production configurations.',
          dueDate: new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0],
          priority: 'Low',
          status: 'To Do',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          _id: 'mock_task_6',
          projectId: 'mock_project_2',
          projectName: 'Monochrome Overhaul',
          assignedTo: { _id: 'guest_id', email: 'guest@crewflow.com' },
          title: 'Audit dashboard list container rendering',
          description: 'Confirm scrolling remains smooth on small displays.',
          dueDate: new Date(Date.now() - 86400000).toISOString().split('T')[0],
          priority: 'Medium',
          status: 'Done',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];
      setProjects(mockProjects);
      setTasks(mockTasks);
    }
  }, [skippedAuth]);

  // Initial Data Fetching from backend APIs
  const fetchWorkspaceData = async () => {
    if (!token) return;
    setLoadingData(true);
    setError('');
    try {
      // 1. Retrieve Projects
      const projectsRes = await fetch('/api/projects', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      let projectsData = [];
      if (projectsRes.ok) {
        projectsData = await projectsRes.json();
        setProjects(projectsData);
      } else {
        throw new Error('Failed to retrieve projects from database');
      }

      // 2. Retrieve Tasks
      const tasksRes = await fetch('/api/tasks', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (tasksRes.ok) {
        const tasksData = await tasksRes.json();
        setTasks(tasksData);
      } else {
        throw new Error('Failed to retrieve tasks from database');
      }

    } catch (err) {
      console.error(err);
      setError(err.message || 'Error occurred updating workspace data');
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    if (user && token) {
      fetchWorkspaceData();
    }
  }, [user, token]);

  // Synchronizers & Handlers for dynamic tasks/projects updates
  const handleTaskStatusUpdated = (updatedTask) => {
    setTasks(prev => prev.map(t => t._id === updatedTask._id ? updatedTask : t));
  };

  const handleTaskDeleted = (taskId) => {
    setTasks(prev => prev.filter(t => t._id !== taskId));
  };

  const handleProjectDeleted = (projectId) => {
    setProjects(prev => prev.filter(p => p._id !== projectId));
    setTasks(prev => prev.filter(t => (t.projectId?._id || t.projectId) !== projectId));
    if (activeProjectId === projectId) {
      setActiveProjectId(null);
      setActiveView('home');
    }
  };

  const handleProjectCreated = (newProject) => {
    setProjects(prev => [newProject, ...prev]);
    setShowProjectModal(false);
    // Open the new project view automatically
    setActiveProjectId(newProject._id);
    setActiveView('project-details');
  };

  const handleTaskCreated = (newTask) => {
    setTasks(prev => [newTask, ...prev]);
    setShowTaskModal(false);
  };

  // Switch workspace view layout
  const renderActiveView = () => {
    if (loadingData && projects.length === 0) {
      return (
        <div className="flex-1 flex flex-col items-center justify-center bg-[#f9f9f9] gap-3">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-black border-t-transparent"></div>
          <p className="text-xs text-[#777777] font-semibold uppercase tracking-wider">Syncing Workspace Ledger...</p>
        </div>
      );
    }

    if (activeModule !== 'work' && activeModule !== 'strategy' && activeModule !== 'people' && activeModule !== 'workflow') {
      return (
        <div className="flex-1 flex flex-col items-center justify-center bg-[#f9f9f9] select-none">
          <div className="h-12 w-12 rounded bg-[#e2e2e2] flex items-center justify-center mb-4 text-[#777777]">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-[#1a1c1c] uppercase tracking-wider font-sans">Under Construction</h2>
          <p className="text-[10px] text-[#777777] mt-2 font-semibold uppercase tracking-wider text-center">
            The {activeModule} module is currently being built.
          </p>
        </div>
      );
    }

    switch (activeView) {
      case 'home':
        return (
          <HomeView 
            projects={projects}
            tasks={tasks}
            onStatusUpdated={handleTaskStatusUpdated}
            onNewTask={() => setShowTaskModal(true)}
            onNewProject={(mode) => setShowProjectModal(mode || true)}
            onOpenInviteModal={() => setShowInviteModal(true)}
            setActiveView={setActiveView}
            setActiveProjectId={setActiveProjectId}
          />
        );
      case 'inbox':
        return (
          <InboxView 
            tasks={tasks}
            projects={projects}
          />
        );
      case 'my-tasks':
        return (
          <MyTasksView 
            projects={projects}
            tasks={tasks}
            onStatusUpdated={handleTaskStatusUpdated}
            onTaskCreated={handleTaskCreated}
            token={token}
          />
        );
      case 'projects':
        return (
          <BrowseProjectsView 
            projects={projects}
            tasks={tasks}
            onNewProject={(mode) => setShowProjectModal(mode || true)}
            setActiveView={setActiveView}
            setActiveProjectId={setActiveProjectId}
            onProjectCreated={handleProjectCreated}
            token={token}
          />
        );
      case 'portfolios':
        return (
          <PortfoliosView 
            projects={projects}
            tasks={tasks}
            setActiveView={setActiveView}
            setActiveProjectId={setActiveProjectId}
          />
        );
      case 'project-details':
        return (
          <ProjectDetailsView 
            projectId={activeProjectId}
            projects={projects}
            tasks={tasks}
            onStatusUpdated={handleTaskStatusUpdated}
            onTaskDeleted={handleTaskDeleted}
            onDeleteProject={handleProjectDeleted}
            onNewTask={() => setShowTaskModal(true)}
            token={token}
          />
        );
      // Strategy Module Routes
      case 'goals':
        return (
          <StrategyGoalsView 
            projects={projects}
            setActiveView={setActiveView}
            setActiveProjectId={setActiveProjectId}
          />
        );
      case 'reporting':
        return (
          <StrategyReportingView 
            projects={projects}
            tasks={tasks}
          />
        );
      case 'resourcing':
        return (
          <StrategyResourcingView 
            projects={projects}
            tasks={tasks}
          />
        );
      case 'my-organization':
      case 'new-dashboard':
      case 'my-impact':
        return (
          <StrategyDashboardView 
            dashboardType={activeView}
            projects={projects}
            tasks={tasks}
          />
        );
      case 'people-directory':
      case 'my-profile':
        return (
          <PeopleView 
            view={activeView}
            setActiveView={setActiveView}
            projects={projects}
            tasks={tasks}
            token={token}
          />
        );
      case 'team-details':
        return (
          <TeamView 
            activeTeamId={activeTeamId}
            setActiveView={setActiveView}
            projects={projects}
            tasks={tasks}
            token={token}
          />
        );
      case 'custom-fields':
      case 'workflow-rules':
      case 'workflow-forms':
      case 'workflow-task-types':
      case 'workflow-templates':
      case 'workflow-status-templates':
        return (
          <WorkflowView 
            view={activeView}
            setActiveView={setActiveView}
            projects={projects}
            tasks={tasks}
            onTaskCreated={handleTaskCreated}
            token={token}
          />
        );
      default:
        return (
          <div className="flex-1 flex items-center justify-center text-xs text-[#777777] italic">
            Select a view from the sidebar to continue.
          </div>
        );
    }
  };

  // Auth synchronization state loader
  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f9f9f9] select-none">
        <div className="flex flex-col items-center gap-3">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-black border-t-transparent"></div>
          <p className="text-[10px] text-[#777777] tracking-widest font-bold uppercase animate-pulse">Syncing CrewFlow Security...</p>
        </div>
      </div>
    );
  }

  // Not logged in -> Show monochrome Auth screens
  if (!user && !skippedAuth) {
    return authView === 'login' ? (
      <Login onSwitchToSignup={() => setAuthView('signup')} onSkip={() => setSkippedAuth(true)} />
    ) : (
      <Signup onSwitchToLogin={() => setAuthView('login')} />
    );
  }

  // Logged in -> Master Split-Pane Layout
  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#f9f9f9]">
      
      {/* Sticky Top Grayscale Navbar (Spans full-width, stationary) */}
      <Header 
        activeModule={activeModule}
        activeView={activeView}
        activeProjectId={activeProjectId}
        projects={projects}
        tasks={tasks}
        setActiveView={setActiveView}
        setActiveProjectId={setActiveProjectId}
        onRefresh={fetchWorkspaceData}
        onNewProject={(mode) => setShowProjectModal(mode || true)}
        onNewTask={() => setShowTaskModal(true)}
        onOpenInviteModal={() => setShowInviteModal(true)}
        loading={loadingData}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      {/* Bottom Container (Row: Sidebar + Main Content Area under navbar) */}
      <div className="flex flex-1 min-h-0 w-full overflow-hidden relative">
        
        {/* Left Charcoal Sidebar Container (Slides under the navbar) */}
        <Sidebar 
          isOpen={isSidebarOpen}
          activeModule={activeModule}
          setActiveModule={setActiveModule}
          activeView={activeView} 
          setActiveView={setActiveView} 
          projects={projects}
          activeProjectId={activeProjectId}
          setActiveProjectId={setActiveProjectId}
          onLogout={() => setSkippedAuth(false)}
          onOpenInviteModal={() => setShowInviteModal(true)}
          onNewProject={(mode) => setShowProjectModal(mode || true)}
          activeTeamId={activeTeamId}
          setActiveTeamId={setActiveTeamId}
        />

        {/* Right Canvas Workspace Column */}
        <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden relative bg-[#f9f9f9]">
          
          {error && (
            <div className="mx-6 mt-4 p-3 rounded border border-red-200 bg-red-50 text-xs font-semibold text-red-700 flex items-center justify-between">
              <span>{error}</span>
              <button onClick={() => setError('')} className="underline uppercase tracking-wider text-[10px]">dismiss</button>
            </div>
          )}

          {renderActiveView()}

        </div>

      </div>

      {/* 3. Global Project Creator Modal overlay */}
      {showProjectModal && (
        <ProjectModal 
          token={token}
          onClose={() => setShowProjectModal(false)}
          onProjectCreated={handleProjectCreated}
          initialMode={typeof showProjectModal === 'string' ? showProjectModal : 'scratch'}
        />
      )}

      {/* 4. Global Task Assigner Modal overlay */}
      {showTaskModal && (
        <TaskModal 
          token={token}
          projects={projects}
          selectedProjectId={activeProjectId || projects[0]?._id}
          onClose={() => setShowTaskModal(false)}
          onTaskCreated={handleTaskCreated}
        />
      )}

      {/* Toast Notification */}
      {inviteSuccessToast && (
        <div className="fixed bottom-6 right-6 bg-black text-white px-4 py-3 rounded shadow-lg flex items-center gap-2 animate-fade-in z-50">
          <CheckCircle className="h-4 w-4 text-green-400" />
          <span className="text-xs font-semibold">Invitation sent to {inviteSuccessToast}</span>
        </div>
      )}

      {/* 5. Global Invite Modal overlay */}
      {showInviteModal && (
        <InviteModal 
          onClose={() => setShowInviteModal(false)}
          onSuccess={(email) => {
            setInviteSuccessToast(email);
            setTimeout(() => setInviteSuccessToast(false), 3000);
          }}
        />
      )}

    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
