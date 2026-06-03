import React, { useState, useEffect } from 'react';
import { 
  X, 
  Plus, 
  Users, 
  Check, 
  Trophy, 
  Layers, 
  TrendingUp, 
  Briefcase, 
  Palette, 
  Cpu, 
  GitMerge, 
  Sparkles, 
  CheckCircle, 
  BookOpen, 
  ArrowRight,
  ClipboardList
} from 'lucide-react';

const templateCategories = [
  { id: 'recommended', label: 'Recommended', icon: Trophy },
  { id: 'shared', label: 'Shared with CrewFlow', icon: Layers },
  { id: 'marketing', label: 'Marketing', icon: TrendingUp },
  { id: 'operations', label: 'Operations & PMO', icon: Briefcase },
  { id: 'design', label: 'Design', icon: Palette },
  { id: 'it', label: 'IT & Security', icon: Cpu },
  { id: 'product', label: 'Product & Engineering', icon: GitMerge },
  { id: 'hr', label: 'HR & People Operations', icon: Users },
  { id: 'sales', label: 'Sales & Account Management', icon: Sparkles },
  { id: 'general', label: 'General & Personal', icon: CheckCircle }
];

const templatesData = {
  recommended: [
    { title: "Cross-functional project plan", desc: "A blueprint to track, review, and align multi-department plans, deadlines, and milestones.", color: "bg-[#9969c9]/10 text-[#9969c9]", icon: ClipboardList },
    { title: "1:1 Meeting agenda", desc: "Organize career path reviews, status updates, open issues, and collaborative feedback.", color: "bg-pink-100 text-pink-600", icon: Users },
    { title: "Meeting agenda", desc: "Outline goals, track discussion points, assign key takeaways during team kickoffs.", color: "bg-[#3b66c5]/10 text-[#3b66c5]", icon: BookOpen }
  ],
  shared: [
    { title: "Company Objectives Ledger", desc: "Track organizational milestones, high-level roadmaps, and alignment benchmarks.", color: "bg-emerald-100 text-emerald-600", icon: Trophy },
    { title: "Grayscale Design Guidelines", desc: "Coordinate visual UI audits, asset reviews, and branding guidelines.", color: "bg-[#222325]/10 text-neutral-800", icon: Palette }
  ],
  marketing: [
    { title: "Social Media Calendar", desc: "Plan, schedule, and draft content across social media channels.", color: "bg-pink-100 text-pink-600", icon: Sparkles },
    { title: "Marketing Campaign Plan", desc: "Track creative briefs, channel checklists, and key marketing results.", color: "bg-[#3b66c5]/10 text-[#3b66c5]", icon: ClipboardList },
    { title: "Event Planning Blueprint", desc: "Organize event logistics, speaker tracks, venues, and registrations.", color: "bg-amber-100 text-amber-600", icon: BookOpen }
  ],
  operations: [
    { title: "Company OKRs Tracker", desc: "Establish objective key results, monitor progress, and align goals.", color: "bg-emerald-100 text-emerald-600", icon: Trophy },
    { title: "Weekly Team Sync Notes", desc: "Track weekly milestones, raise status blockers, and assign action items.", color: "bg-[#9969c9]/10 text-[#9969c9]", icon: Users }
  ],
  design: [
    { title: "Creative Production Workflow", desc: "Intake asset requests, brief copywriters, and track approvals.", color: "bg-[#9969c9]/10 text-[#9969c9]", icon: Palette },
    { title: "Website Design Process", desc: "Coordinate wireframing, mockup iterations, client reviews, and launch.", color: "bg-pink-100 text-pink-600", icon: ClipboardList }
  ],
  it: [
    { title: "IT Helpdesk Ticketing", desc: "Intake hardware/software requests, prioritize tickets, and log resolutions.", color: "bg-rose-100 text-rose-600", icon: Cpu },
    { title: "Software Audit Checklist", desc: "Standardize systems audits, compliance reviews, and security sweeps.", color: "bg-[#3b66c5]/10 text-[#3b66c5]", icon: CheckCircle }
  ],
  product: [
    { title: "Sprint Backlog Planning", desc: "Plan product releases, catalog backlog tickets, and assign story points.", color: "bg-indigo-100 text-indigo-600", icon: GitMerge },
    { title: "Product Launch Roadmap", desc: "Track product definitions, core QA checkpoints, and release plans.", color: "bg-emerald-100 text-emerald-600", icon: ClipboardList },
    { title: "Bug Tracking System", desc: "File reports, prioritize critical bugs, assign developers, and audit fixes.", color: "bg-rose-100 text-rose-600", icon: Cpu }
  ],
  hr: [
    { title: "New Hire Onboarding", desc: "Guide new hires through document signings, hardware setups, and team syncs.", color: "bg-teal-100 text-teal-600", icon: Users },
    { title: "Recruitment Pipeline", desc: "Manage interview pipelines, candidate profiles, and salary offer stages.", color: "bg-[#9969c9]/10 text-[#9969c9]", icon: ClipboardList }
  ],
  sales: [
    { title: "Sales Pipeline Tracker", desc: "Track deals through lead, qualification, proposal, and closed-won stages.", color: "bg-amber-100 text-amber-600", icon: Sparkles },
    { title: "Client Account Plan", desc: "Organize client objectives, renewal timelines, and account sync notes.", color: "bg-indigo-100 text-indigo-600", icon: BookOpen }
  ],
  general: [
    { title: "Personal Task Board", desc: "Organize daily tasks, categorize personal milestones, and track execution.", color: "bg-slate-100 text-slate-600", icon: CheckCircle }
  ]
};

const ProjectModal = ({ token, onClose, onProjectCreated, initialMode = 'scratch' }) => {
  const [createMode, setCreateMode] = useState(initialMode); // 'scratch' | 'templates'
  const [activeCategory, setActiveCategory] = useState('recommended');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [availableUsers, setAvailableUsers] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const mockUsers = [
    { _id: 'guest_id', email: 'guest@crewflow.com', role: 'Admin' },
    { _id: 'member_id_1', email: 'member@crewflow.com', role: 'Member' },
    { _id: 'admin_id_1', email: 'admin@crewflow.com', role: 'Admin' }
  ];

  useEffect(() => {
    if (!token) {
      setAvailableUsers(mockUsers);
      return;
    }
    const fetchUsers = async () => {
      try {
        const res = await fetch('/api/users', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          setAvailableUsers(data.length > 0 ? data : mockUsers);
        } else {
          setAvailableUsers(mockUsers);
        }
      } catch (err) {
        console.error('Error fetching users for project modal:', err);
        setAvailableUsers(mockUsers);
      }
    };
    fetchUsers();
  }, [token]);

  const handleToggleMember = (userId) => {
    if (selectedMembers.includes(userId)) {
      setSelectedMembers(selectedMembers.filter(id => id !== userId));
    } else {
      setSelectedMembers([...selectedMembers, userId]);
    }
  };

  const handleSelectTemplateBlueprint = (title, desc) => {
    setName(`${title} Template`);
    setDescription(desc);
    setCreateMode('scratch');
  };

  const handleSubmit = async (e, directName, directDesc) => {
    if (e) e.preventDefault();
    setError('');

    const finalName = directName !== undefined ? directName : name;
    const finalDesc = directDesc !== undefined ? directDesc : description;

    if (!finalName || finalName.trim() === '') {
      setError('Project name is required');
      return;
    }

    setSubmitting(true);

    if (!token) {
      // Simulate client-side project creation!
      setTimeout(() => {
        const newProject = {
          _id: `mock_project_${Date.now()}`,
          name: finalName.trim(),
          description: finalDesc,
          createdBy: 'guest_id',
          members: selectedMembers.map(memberId => {
            const matched = mockUsers.find(u => u._id === memberId);
            return matched ? { _id: matched._id, email: matched.email, role: matched.role } : { _id: memberId, email: 'collaborator@crewflow.com', role: 'Member' };
          })
        };
        onProjectCreated(newProject);
        setSubmitting(false);
      }, 300);
      return;
    }

    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: finalName,
          description: finalDesc,
          members: selectedMembers
        })
      });

      if (res.ok) {
        const newProject = await res.json();
        onProjectCreated(newProject);
      } else {
        const errData = await res.json();
        throw new Error(errData.message || 'Failed to create project');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs select-none">
      <div className={`w-full rounded-xl p-6 shadow-2xl relative bg-white border border-[#e2e2e2] transition-all duration-300 ${
        createMode === 'templates' ? 'max-w-5xl h-[85vh] flex flex-col' : 'max-w-lg'
      }`}>
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-[#777777] hover:text-[#000000] rounded p-1 hover:bg-[#f3f3f4] transition-all z-10"
        >
          <X className="h-4.5 w-4.5" />
        </button>

        {/* Modal Title & Sub-bar */}
        <div className="mb-4">
          <h3 className="text-base font-bold text-[#1a1c1c] font-sans">Create Project Workspace</h3>
          <p className="text-[11px] text-[#5e5e5e]">Set up a new project. Customize from scratch or start from ready-made functional blueprints.</p>
        </div>

        {/* Start Scratch / Template Gallery Toggles */}
        <div className="flex items-center gap-4 border-b border-[#eeeeee] pb-3 mb-5">
          <button 
            type="button" 
            onClick={() => setCreateMode('scratch')}
            className={`text-xs font-bold pb-1.5 border-b-2 transition-all ${
              createMode === 'scratch' ? 'border-black text-black' : 'border-transparent text-gray-400 hover:text-black'
            }`}
          >
            Start from scratch
          </button>
          <button 
            type="button" 
            onClick={() => setCreateMode('templates')}
            className={`text-xs font-bold pb-1.5 border-b-2 transition-all ${
              createMode === 'templates' ? 'border-black text-black' : 'border-transparent text-gray-400 hover:text-black'
            }`}
          >
            Use a template
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded border border-red-200 bg-red-50 p-3 text-xs font-semibold text-red-700 text-left">
            {error}
          </div>
        )}

        {/* Scratch Form View */}
        {createMode === 'scratch' && (
          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#5e5e5e] mb-1.5">Project Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Q3 Roadmap Planning"
                className="w-full text-xs p-2.5 border border-gray-300 rounded outline-none focus:border-[#3b66c5] text-black bg-white"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#5e5e5e] mb-1.5">Description</label>
              <textarea
                rows="3"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Detailed objectives and project boundaries..."
                className="w-full text-xs p-2.5 border border-gray-300 rounded outline-none focus:border-[#3b66c5] text-black bg-white"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#5e5e5e] mb-1.5 flex items-center gap-1">
                <Users className="h-3.5 w-3.5 text-[#5e5e5e]" /> Assign Team Members
              </label>
              <div className="mt-1 max-h-36 overflow-y-auto rounded border border-[#e2e2e2] bg-[#f9f9f9] p-2 space-y-1">
                {availableUsers.length === 0 ? (
                  <p className="text-xs text-[#777777] text-center py-4 italic">No members registered yet.</p>
                ) : (
                  availableUsers.map((u) => {
                    const isSelected = selectedMembers.includes(u._id);
                    return (
                      <button
                        key={u._id}
                        type="button"
                        onClick={() => handleToggleMember(u._id)}
                        className={`w-full flex items-center justify-between px-3 py-1.5 rounded text-xs font-semibold border transition-all ${
                          isSelected 
                            ? 'bg-black text-white border-black shadow-sm' 
                            : 'border-transparent text-[#5e5e5e] hover:bg-[#eeeeee]'
                        }`}
                      >
                        <div className="flex flex-col items-start">
                          <span>{u.email}</span>
                          <span className={`text-[9px] ${isSelected ? 'text-[#c6c6c6]' : 'text-[#8a8b8c]'}`}>Role: {u.role}</span>
                        </div>
                        {isSelected && <Check className="h-3.5 w-3.5 text-white" />}
                      </button>
                    );
                  })
                )}
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
                className="px-4 py-2.5 bg-black hover:bg-neutral-800 text-white rounded text-xs font-bold flex items-center gap-1.5 shadow-xs"
              >
                {submitting ? (
                  <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                ) : (
                  <>
                    <Plus className="h-3.5 w-3.5 text-white" />
                    <span>Initialize Project</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* Asana Templates Gallery View (Except AI Teammates) */}
        {createMode === 'templates' && (
          <div className="flex flex-1 min-h-0 border border-[#e2e2e2] rounded-xl overflow-hidden bg-[#fafafb]">
            
            {/* Left Sidebar categories menu */}
            <aside className="w-64 bg-white border-r border-[#e2e2e2] py-3 flex flex-col overflow-y-auto">
              <div className="px-4 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider text-left">Asana Template Categories</div>
              <nav className="flex-1 px-2 space-y-0.5">
                {templateCategories.map((cat) => {
                  const Icon = cat.icon;
                  const isActive = activeCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id)}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-left transition-colors ${
                        isActive 
                          ? 'bg-[#3b66c5]/10 text-[#3b66c5]' 
                          : 'text-gray-600 hover:bg-[#f5f5f6] hover:text-black'
                      }`}
                    >
                      <Icon className={`h-4 w-4 ${isActive ? 'text-[#3b66c5]' : 'text-gray-400'}`} />
                      <span>{cat.label}</span>
                    </button>
                  );
                })}
              </nav>
            </aside>

            {/* Right templates display grid */}
            <main className="flex-1 bg-[#fafafb] p-6 overflow-y-auto flex flex-col text-left">
              <div className="mb-4">
                <h4 className="text-sm font-bold text-black capitalize flex items-center gap-1.5">
                  <span>{templateCategories.find(c => c.id === activeCategory)?.label} Blueprints</span>
                </h4>
                <p className="text-[11px] text-gray-500 mt-0.5">Browse pre-structured layouts containing standard phases, cards, and default setups.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                {(templatesData[activeCategory] || []).map((tpl, idx) => {
                  const TplIcon = tpl.icon || ClipboardList;
                  return (
                    <div 
                      key={idx}
                      className="border border-[#e2e2e2] bg-white rounded-xl p-5 flex flex-col justify-between hover:shadow-md hover:border-[#a5a5a5] transition-all group"
                    >
                      <div className="space-y-3">
                        <div className={`h-9 w-9 rounded-lg flex items-center justify-center flex-shrink-0 ${tpl.color}`}>
                          <TplIcon className="h-4.5 w-4.5" />
                        </div>
                        <div>
                          <h5 className="text-xs font-bold text-[#1a1c1c] group-hover:underline">{tpl.title}</h5>
                          <p className="text-[11px] text-gray-500 leading-relaxed mt-1">{tpl.desc}</p>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-[#eeeeee] flex items-center justify-between">
                        <button
                          onClick={() => handleSelectTemplateBlueprint(tpl.title, tpl.desc)}
                          className="text-[10px] font-bold text-[#3b66c5] hover:underline flex items-center gap-1"
                        >
                          <span>Use blueprint</span>
                          <ArrowRight className="h-3 w-3" />
                        </button>
                        
                        <button
                          onClick={() => {
                            handleSubmit(null, `${tpl.title} Template`, tpl.desc);
                          }}
                          className="text-[10px] font-bold text-white bg-black hover:bg-neutral-800 px-3 py-1.5 rounded transition-colors"
                        >
                          One-click instantiate
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </main>

          </div>
        )}

      </div>
    </div>
  );
};

export default ProjectModal;
