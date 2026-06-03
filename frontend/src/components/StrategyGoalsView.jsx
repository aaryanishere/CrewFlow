import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  X, 
  Check, 
  ArrowUpDown, 
  ArrowLeft, 
  ArrowRight, 
  Users, 
  Target, 
  Activity, 
  Calendar, 
  Move,
  Trophy,
  SlidersHorizontal,
  ChevronDown,
  ChevronRight,
  Sparkles,
  Link2,
  Trash2,
  Filter,
  Layers,
  Save,
  CheckCircle2,
  UserPlus,
  Sliders
} from 'lucide-react';

const StrategyGoalsView = ({ projects = [], setActiveView, setActiveProjectId }) => {
  const [activeTab, setActiveTab] = useState('my-goals'); // 'my-goals' | 'team-goals' | 'strategy-map'
  
  // Dashboard Header actions state (favorite star and chevron dropdown)
  const [isFavorite, setIsFavorite] = useState(false);
  const [isGoalsMenuOpen, setIsGoalsMenuOpen] = useState(false);
  const [isEditingDetails, setIsEditingDetails] = useState(false);
  const [goalsName, setGoalsName] = useState("Workspace Objectives");
  const [goalsDesc, setGoalsDesc] = useState("Define corporate milestones, track KRs, and align connected projects.");
  const [goalsColor, setGoalsColor] = useState('amber'); // 'amber' | 'blue' | 'pink' | 'emerald' | 'purple'
  const [isSetColorOpen, setIsSetColorOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const goalsMenuRef = useRef(null);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    triggerToast("Goals view link copied to clipboard!");
    setIsGoalsMenuOpen(false);
  };

  const handleDuplicate = () => {
    setGoals(prev => [
      ...prev,
      ...prev.map(g => ({
        ...g,
        _id: `goal_dup_${Date.now()}_${Math.random()}`,
        name: `${g.name} (Copy)`
      }))
    ]);
    triggerToast("Goals duplicated!");
    setIsGoalsMenuOpen(false);
  };

  const handleDeleteGoals = () => {
    if (confirm("Are you sure you want to delete all goals in this view?")) {
      setGoals([]);
      triggerToast("All goals deleted from this view.");
    }
    setIsGoalsMenuOpen(false);
  };

  // Goals Seed Data
  const [goals, setGoals] = useState([
    {
      _id: 'goal_1',
      name: 'Launch CrewFlow v2.0 Platform',
      status: 'On track', // 'On track' | 'At risk' | 'Off track' | 'Completed'
      progress: 65,
      timePeriod: 'Q3 2026',
      owner: 'guest@crewflow.com',
      team: 'Engineering',
      type: 'my',
      parentObjective: 'Become the #1 Collaboration suite'
    },
    {
      _id: 'goal_2',
      name: 'Increase Organic Leads by 25%',
      status: 'On track',
      progress: 40,
      timePeriod: 'FY 2026',
      owner: 'guest@crewflow.com',
      team: 'Marketing',
      type: 'my',
      parentObjective: 'Become the #1 Collaboration suite'
    },
    {
      _id: 'goal_3',
      name: 'Transition UI Design to Premium Grayscale Theme',
      status: 'Completed',
      progress: 100,
      timePeriod: 'Q2 2026',
      owner: 'guest@crewflow.com',
      team: 'Design',
      type: 'team',
      parentObjective: 'Grayscale Interface Overhaul'
    },
    {
      _id: 'goal_4',
      name: 'Reduce System Downtime to <0.01%',
      status: 'At risk',
      progress: 15,
      timePeriod: 'Q3 2026',
      owner: 'guest@crewflow.com',
      team: 'Engineering',
      type: 'team',
      parentObjective: 'Become the #1 Collaboration suite'
    },
    {
      _id: 'goal_5',
      name: 'Establish Corporate Partnerships Program',
      status: 'Off track',
      progress: 8,
      timePeriod: 'Q4 2026',
      owner: 'guest@crewflow.com',
      team: 'Partnerships',
      type: 'my',
      parentObjective: 'B2B Corporate Scaling'
    }
  ]);

  // Inline Goal creation states
  const [isCreatingGoal, setIsCreatingGoal] = useState(false);
  const [newGoalName, setNewGoalName] = useState('');
  const [newGoalStatus, setNewGoalStatus] = useState('On track');
  const [newGoalProgress, setNewGoalProgress] = useState(0);
  const [newGoalTime, setNewGoalTime] = useState('Q3 2026');
  const [newGoalTeam, setNewGoalTeam] = useState('Engineering');
  const [newGoalOwner, setNewGoalOwner] = useState('guest@crewflow.com');
  const [newGoalParent, setNewGoalParent] = useState('Become the #1 Collaboration suite');

  // Custom Inline popups/menus inside cell editing
  const [activeCellEdit, setActiveCellEdit] = useState(null); // { goalId, fieldId } or null
  const [ownerDropdownActive, setOwnerDropdownActive] = useState(false);
  const [teamDropdownActive, setTeamDropdownActive] = useState(false);
  const [mapDropdownActive, setMapDropdownActive] = useState(false);

  // Strategy Map dynamic filter Period
  const [strategyMapPeriod, setStrategyMapPeriod] = useState('All');
  const [isMapPeriodOpen, setIsMapPeriodOpen] = useState(false);
  const [isCreatingFromMap, setIsCreatingFromMap] = useState(false);

  // Interactive Custom Column States
  const [columns, setColumns] = useState([
    { id: 'name', label: 'Name', width: 'flex-2' },
    { id: 'status', label: 'Status', width: 'w-32' },
    { id: 'progress', label: 'Progress', width: 'w-44' },
    { id: 'timePeriod', label: 'Time period', width: 'w-32' },
    { id: 'owner', label: 'Owner', width: 'w-40' },
    { id: 'team', label: 'Accountable team', width: 'w-40' }
  ]);

  // Grid toolbar downbar popovers states
  const [isFilterPopoverOpen, setIsFilterPopoverOpen] = useState(false);
  const [isSortPopoverOpen, setIsSortPopoverOpen] = useState(false);
  const [isGroupPopoverOpen, setIsGroupPopoverOpen] = useState(false);
  const [isSaveViewPopoverOpen, setIsSaveViewPopoverOpen] = useState(false);
  
  // Filtering & Sorting values
  const [statusFilter, setStatusFilter] = useState('All');
  const [ownerFilter, setOwnerFilter] = useState('All');
  const [timeFilter, setTimeFilter] = useState('All');
  const [sortField, setSortField] = useState('name');
  const [sortAsc, setSortAsc] = useState(true);
  const [groupByField, setGroupByField] = useState('none'); // 'none' | 'status' | 'team' | 'timePeriod'

  // Custom Field Form States
  const [isAddFieldOpen, setIsAddFieldOpen] = useState(false);
  const [newFieldName, setNewFieldName] = useState('');
  const [newFieldType, setNewFieldType] = useState('text'); // 'date' | 'people' | 'text' | 'number' | 'select' | 'multiselect'
  const [newFieldOptions, setNewFieldOptions] = useState(''); // comma-separated options
  const [newFieldNumberFormat, setNewFieldNumberFormat] = useState('integer'); // 'integer' | 'decimal' | 'currency' | 'percent'
  const [customOptionsList, setCustomOptionsList] = useState([]);
  const [currentOptionText, setCurrentOptionText] = useState('');
  
  // Refs
  const headerMenuRef = useRef(null);
  const addFieldRef = useRef(null);
  const toolbarRef = useRef(null);
  const inlineEditRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (headerMenuRef.current && !headerMenuRef.current.contains(e.target)) {
        setActiveHeaderDropdown(null);
      }
      if (addFieldRef.current && !addFieldRef.current.contains(e.target)) {
        setIsAddFieldOpen(false);
      }
      if (toolbarRef.current && !toolbarRef.current.contains(e.target)) {
        setIsFilterPopoverOpen(false);
        setIsSortPopoverOpen(false);
        setIsGroupPopoverOpen(false);
        setIsSaveViewPopoverOpen(false);
      }
      if (inlineEditRef.current && !inlineEditRef.current.contains(e.target)) {
        setActiveCellEdit(null);
        setOwnerDropdownActive(false);
        setTeamDropdownActive(false);
        setMapDropdownActive(false);
      }
      if (goalsMenuRef.current && !goalsMenuRef.current.contains(e.target)) {
        setIsGoalsMenuOpen(false);
        setIsSetColorOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const [activeHeaderDropdown, setActiveHeaderDropdown] = useState(null); // columnId or null

  // Sort and filter goals logic
  const displayGoals = useMemo(() => {
    let result = goals.filter(g => {
      if (activeTab === 'my-goals') return g.type === 'my';
      if (activeTab === 'team-goals') return g.type === 'team';
      return true; // Map view handled separately or matches all
    });

    // Apply Filter Downbar selections
    if (statusFilter !== 'All') {
      result = result.filter(g => g.status === statusFilter);
    }
    if (ownerFilter !== 'All') {
      result = result.filter(g => g.owner.includes(ownerFilter));
    }
    if (timeFilter !== 'All') {
      result = result.filter(g => g.timePeriod === timeFilter);
    }

    // Apply Sort Downbar selections
    result.sort((a, b) => {
      let valA = a[sortField] !== undefined ? a[sortField] : '';
      let valB = b[sortField] !== undefined ? b[sortField] : '';

      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();

      if (valA < valB) return sortAsc ? -1 : 1;
      if (valA > valB) return sortAsc ? 1 : -1;
      return 0;
    });

    return result;
  }, [goals, activeTab, statusFilter, ownerFilter, timeFilter, sortField, sortAsc]);

  // Group goals if group is active
  const groupedGoals = useMemo(() => {
    if (groupByField === 'none') {
      return { 'All Objectives': displayGoals };
    }

    const groups = {};
    displayGoals.forEach(g => {
      const key = g[groupByField] || 'Unassigned';
      if (!groups[key]) groups[key] = [];
      groups[key].push(g);
    });

    return groups;
  }, [displayGoals, groupByField]);

  // Columns Move Handlers
  const handleMoveColumn = (colId, direction) => {
    const idx = columns.findIndex(c => c.id === colId);
    if (idx === -1) return;

    const newCols = [...columns];
    if (direction === 'left' && idx > 0) {
      const temp = newCols[idx - 1];
      newCols[idx - 1] = newCols[idx];
      newCols[idx] = temp;
    } else if (direction === 'right' && idx < columns.length - 1) {
      const temp = newCols[idx + 1];
      newCols[idx + 1] = newCols[idx];
      newCols[idx] = temp;
    }
    setColumns(newCols);
    setActiveHeaderDropdown(null);
  };

  // Add custom option to options list during field creation
  const handleAddCustomOption = () => {
    if (!currentOptionText.trim()) return;
    const colors = [
      'bg-indigo-50 text-indigo-700 border-indigo-200',
      'bg-rose-50 text-rose-700 border-rose-200',
      'bg-emerald-50 text-emerald-700 border-emerald-200',
      'bg-amber-50 text-amber-700 border-amber-200',
      'bg-purple-50 text-purple-700 border-purple-200'
    ];
    const optionObj = {
      label: currentOptionText.trim(),
      color: colors[customOptionsList.length % colors.length]
    };
    setCustomOptionsList([...customOptionsList, optionObj]);
    setCurrentOptionText('');
  };

  // Create custom field
  const handleCreateCustomField = (e) => {
    e.preventDefault();
    if (!newFieldName.trim()) return;

    const newColId = `custom_${Date.now()}`;
    const newCol = {
      id: newColId,
      label: newFieldName.trim(),
      width: 'w-36',
      isCustom: true,
      fieldType: newFieldType,
      numberFormat: newFieldType === 'number' ? newFieldNumberFormat : null,
      options: ['select', 'multiselect'].includes(newFieldType) ? customOptionsList : []
    };

    setColumns([...columns, newCol]);

    setGoals(prev => prev.map(g => ({
      ...g,
      [newColId]: newFieldType === 'number' ? 0 : newFieldType === 'multiselect' ? [] : ''
    })));

    setNewFieldName('');
    setNewFieldType('text');
    setCustomOptionsList([]);
    setIsAddFieldOpen(false);
  };

  // Create Goal
  const handleCreateGoal = (e) => {
    if (e) e.preventDefault();
    if (!newGoalName.trim()) return;

    const newGoalObj = {
      _id: `goal_${Date.now()}`,
      name: newGoalName.trim(),
      status: newGoalStatus,
      progress: Number(newGoalProgress),
      timePeriod: newGoalTime,
      owner: newGoalOwner,
      team: newGoalTeam,
      type: activeTab === 'my-goals' ? 'my' : 'team',
      parentObjective: newGoalParent
    };

    setGoals([newGoalObj, ...goals]);
    setNewGoalName('');
    setIsCreatingGoal(false);
    setIsCreatingFromMap(false);
  };

  // Delete Goal
  const handleDeleteGoal = (goalId) => {
    setGoals(prev => prev.filter(g => g._id !== goalId));
  };

  // Update cell field
  const handleUpdateGoalField = (goalId, fieldId, value) => {
    setGoals(prev => prev.map(g => {
      if (g._id === goalId) {
        return { ...g, [fieldId]: value };
      }
      return g;
    }));
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'On track':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'At risk':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Off track':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'Completed':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  // Available Seed Users for selects
  const seedUsers = [
    { email: 'guest@crewflow.com', name: 'Aaryan Ranjan', initials: 'AR', color: 'bg-purple-100 text-purple-700' },
    { email: 'member@crewflow.com', name: 'Sneha Sharma', initials: 'SS', color: 'bg-pink-100 text-pink-700' },
    { email: 'admin@crewflow.com', name: 'Kabir Dev', initials: 'KD', color: 'bg-emerald-100 text-emerald-700' }
  ];

  // Accounts list
  const seedTeams = ['Engineering', 'Design', 'Marketing', 'Product', 'Partnerships'];
  const seedParents = ['Become the #1 Collaboration suite', 'Grayscale Interface Overhaul', 'B2B Corporate Scaling'];

  return (
    <div className="flex-1 overflow-y-auto bg-white px-8 py-8 space-y-6 select-none font-sans relative text-gray-800">
      
      {/* 1. Header with workspace objectives */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-[#e2e2e2] gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2.5">
            <Trophy className="h-6 w-6 text-amber-500" />
            <span>Workspace Objectives</span>
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">Define corporate milestones, track KRs, and align connected projects.</p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center bg-[#f3f3f4] p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('my-goals')}
            className={`text-xs px-3.5 py-1.5 rounded-md font-semibold transition-all ${
              activeTab === 'my-goals' 
                ? 'bg-white text-black shadow-xs' 
                : 'text-gray-500 hover:text-black'
            }`}
          >
            My goals
          </button>
          <button
            onClick={() => setActiveTab('team-goals')}
            className={`text-xs px-3.5 py-1.5 rounded-md font-semibold transition-all ${
              activeTab === 'team-goals' 
                ? 'bg-white text-black shadow-xs' 
                : 'text-gray-500 hover:text-black'
            }`}
          >
            Team goals
          </button>
          <button
            onClick={() => setActiveTab('strategy-map')}
            className={`text-xs px-3.5 py-1.5 rounded-md font-semibold transition-all ${
              activeTab === 'strategy-map' 
                ? 'bg-white text-black shadow-xs' 
                : 'text-gray-500 hover:text-black'
            }`}
          >
            Strategy map
          </button>
        </div>
      </div>

      {/* 2. Grid Sheets Content */}
      {activeTab !== 'strategy-map' ? (
        <div className="space-y-4">
          
          {/* Advanced Toolbar: Filter, Sort, Group, Save view */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-[#fafafb] p-3 rounded-lg border border-[#e2e2e2]" ref={toolbarRef}>
            <div className="flex items-center gap-2 flex-wrap">
              
              {/* Filter Downbar trigger */}
              <div className="relative">
                <button 
                  onClick={() => setIsFilterPopoverOpen(!isFilterPopoverOpen)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 border rounded text-xs font-semibold bg-white text-gray-700 hover:border-gray-400 ${
                    statusFilter !== 'All' || ownerFilter !== 'All' || timeFilter !== 'All' ? 'border-[#3b66c5] text-[#3b66c5]' : 'border-gray-300'
                  }`}
                >
                  <Filter className="w-3.5 h-3.5" />
                  <span>Filter</span>
                  <ChevronDown className="w-3 h-3" />
                </button>

                {/* Filter downbar active */}
                {isFilterPopoverOpen && (
                  <div className="absolute left-0 mt-2 w-64 bg-white border border-[#e2e2e2] rounded-xl shadow-xl z-50 p-4 flex flex-col gap-4 animate-scale-in">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Filters Options</span>
                    
                    {/* Status */}
                    <div className="space-y-1">
                      <label className="text-[9px] uppercase font-bold text-gray-500">Status</label>
                      <select 
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full text-xs border border-gray-300 rounded p-1.5 bg-white outline-none focus:border-[#3b66c5]"
                      >
                        <option value="All">All statuses</option>
                        <option value="On track">On track</option>
                        <option value="At risk">At risk</option>
                        <option value="Off track">Off track</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </div>

                    {/* Owner */}
                    <div className="space-y-1">
                      <label className="text-[9px] uppercase font-bold text-gray-500">Owner</label>
                      <select 
                        value={ownerFilter}
                        onChange={(e) => setOwnerFilter(e.target.value)}
                        className="w-full text-xs border border-gray-300 rounded p-1.5 bg-white outline-none focus:border-[#3b66c5]"
                      >
                        <option value="All">All owners</option>
                        <option value="guest">guest</option>
                        <option value="member">member</option>
                        <option value="admin">admin</option>
                      </select>
                    </div>

                    {/* Time period */}
                    <div className="space-y-1">
                      <label className="text-[9px] uppercase font-bold text-gray-500">Time period</label>
                      <select 
                        value={timeFilter}
                        onChange={(e) => setTimeFilter(e.target.value)}
                        className="w-full text-xs border border-gray-300 rounded p-1.5 bg-white outline-none focus:border-[#3b66c5]"
                      >
                        <option value="All">All periods</option>
                        <option value="Q2 2026">Q2 2026</option>
                        <option value="Q3 2026">Q3 2026</option>
                        <option value="Q4 2026">Q4 2026</option>
                        <option value="FY 2026">FY 2026</option>
                      </select>
                    </div>

                    <button 
                      onClick={() => { setStatusFilter('All'); setOwnerFilter('All'); setTimeFilter('All'); setIsFilterPopoverOpen(false); }}
                      className="w-full text-center text-[10px] font-bold text-rose-600 hover:underline uppercase pt-1 border-t border-[#eeeeee]"
                    >
                      Reset filters
                    </button>
                  </div>
                )}
              </div>

              {/* Sort Downbar trigger */}
              <div className="relative">
                <button 
                  onClick={() => setIsSortPopoverOpen(!isSortPopoverOpen)}
                  className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 rounded text-xs font-semibold bg-white text-gray-700 hover:border-gray-400"
                >
                  <ArrowUpDown className="w-3.5 h-3.5" />
                  <span>Sort: {sortField}</span>
                  <ChevronDown className="w-3 h-3" />
                </button>

                {/* Sort downbar active */}
                {isSortPopoverOpen && (
                  <div className="absolute left-0 mt-2 w-48 bg-white border border-[#e2e2e2] rounded-xl shadow-xl z-50 p-3 flex flex-col gap-2 animate-scale-in">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide px-1.5">Sort Options</span>
                    <button 
                      onClick={() => { setSortField('name'); setSortAsc(true); setIsSortPopoverOpen(false); }}
                      className="w-full text-left px-2 py-1.5 text-xs hover:bg-[#f5f5f6] font-semibold text-gray-700 rounded"
                    >
                      Name A - Z
                    </button>
                    <button 
                      onClick={() => { setSortField('status'); setSortAsc(true); setIsSortPopoverOpen(false); }}
                      className="w-full text-left px-2 py-1.5 text-xs hover:bg-[#f5f5f6] font-semibold text-gray-700 rounded"
                    >
                      Status value
                    </button>
                    <button 
                      onClick={() => { setSortField('progress'); setSortAsc(false); setIsSortPopoverOpen(false); }}
                      className="w-full text-left px-2 py-1.5 text-xs hover:bg-[#f5f5f6] font-semibold text-gray-700 rounded"
                    >
                      Progress % (High-Low)
                    </button>
                    <button 
                      onClick={() => { setSortField('timePeriod'); setSortAsc(true); setIsSortPopoverOpen(false); }}
                      className="w-full text-left px-2 py-1.5 text-xs hover:bg-[#f5f5f6] font-semibold text-gray-700 rounded"
                    >
                      Time period
                    </button>
                  </div>
                )}
              </div>

              {/* Group Downbar trigger */}
              <div className="relative">
                <button 
                  onClick={() => setIsGroupPopoverOpen(!isGroupPopoverOpen)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 border rounded text-xs font-semibold bg-white text-gray-700 hover:border-gray-400 ${
                    groupByField !== 'none' ? 'border-[#9969c9] text-[#9969c9]' : 'border-gray-300'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Group: {groupByField === 'none' ? 'None' : groupByField}</span>
                  <ChevronDown className="w-3 h-3" />
                </button>

                {/* Group downbar active */}
                {isGroupPopoverOpen && (
                  <div className="absolute left-0 mt-2 w-48 bg-white border border-[#e2e2e2] rounded-xl shadow-xl z-50 p-3 flex flex-col gap-2 animate-scale-in">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide px-1.5">Group By Field</span>
                    <button 
                      onClick={() => { setGroupByField('none'); setIsGroupPopoverOpen(false); }}
                      className="w-full text-left px-2 py-1.5 text-xs hover:bg-[#f5f5f6] font-semibold text-gray-700 rounded"
                    >
                      None
                    </button>
                    <button 
                      onClick={() => { setGroupByField('status'); setIsGroupPopoverOpen(false); }}
                      className="w-full text-left px-2 py-1.5 text-xs hover:bg-[#f5f5f6] font-semibold text-gray-700 rounded"
                    >
                      Status
                    </button>
                    <button 
                      onClick={() => { setGroupByField('team'); setIsGroupPopoverOpen(false); }}
                      className="w-full text-left px-2 py-1.5 text-xs hover:bg-[#f5f5f6] font-semibold text-gray-700 rounded"
                    >
                      Accountable team
                    </button>
                    <button 
                      onClick={() => { setGroupByField('timePeriod'); setIsGroupPopoverOpen(false); }}
                      className="w-full text-left px-2 py-1.5 text-xs hover:bg-[#f5f5f6] font-semibold text-gray-700 rounded"
                    >
                      Time period
                    </button>
                  </div>
                )}
              </div>

              {/* Save View Popover */}
              <div className="relative">
                <button 
                  onClick={() => setIsSaveViewPopoverOpen(!isSaveViewPopoverOpen)}
                  className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 rounded text-xs font-semibold bg-white text-gray-700 hover:border-gray-400"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save view</span>
                </button>

                {/* Save view downbar active */}
                {isSaveViewPopoverOpen && (
                  <div className="absolute left-0 mt-2 w-64 bg-white border border-[#e2e2e2] rounded-xl shadow-xl z-50 p-4 flex flex-col gap-3 animate-scale-in text-left text-gray-800">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Save View Settings</span>
                    <p className="text-[11px] text-gray-500">Save current filters, columns sorting and grouping rules for everyone in this team space.</p>
                    <div className="flex gap-2 mt-2">
                      <button 
                        onClick={() => setIsSaveViewPopoverOpen(false)}
                        className="flex-1 px-3 py-1.5 border border-gray-300 rounded text-[11px] font-bold uppercase text-gray-600 text-center hover:bg-[#f3f3f4]"
                      >
                        Discard
                      </button>
                      <button 
                        onClick={() => { alert('View settings saved successfully!'); setIsSaveViewPopoverOpen(false); }}
                        className="flex-1 px-3 py-1.5 bg-black text-white rounded text-[11px] font-bold uppercase text-center hover:bg-neutral-800"
                      >
                        Save for all
                      </button>
                    </div>
                  </div>
                )}
              </div>

            </div>

            {/* Quick Action Button */}
            <div>
              <button
                onClick={() => setIsCreatingGoal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#3b66c5] hover:bg-[#2e55aa] text-white rounded text-xs font-bold transition-all shadow-xs"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Create goal</span>
              </button>
            </div>
          </div>

          {/* Goal form active drawer */}
          {isCreatingGoal && (
            <form onSubmit={handleCreateGoal} className="bg-slate-50 border border-[#e2e2e2] rounded-lg p-5 space-y-4 animate-scale-in text-gray-800">
              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
                <Target className="h-4 w-4 text-[#3b66c5]" />
                <span>Define Workspace Objective Goal</span>
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-[9px] uppercase font-bold text-gray-500 mb-1">Goal Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Build collaborative strategy maps"
                    value={newGoalName}
                    onChange={(e) => setNewGoalName(e.target.value)}
                    className="w-full text-xs p-2 border border-gray-300 bg-white rounded outline-none focus:border-[#3b66c5] text-black"
                  />
                </div>

                <div>
                  <label className="block text-[9px] uppercase font-bold text-gray-500 mb-1">Time Period</label>
                  <input
                    type="text"
                    value={newGoalTime}
                    onChange={(e) => setNewGoalTime(e.target.value)}
                    className="w-full text-xs p-2 border border-gray-300 bg-white rounded outline-none focus:border-[#3b66c5] text-black"
                  />
                </div>

                <div>
                  <label className="block text-[9px] uppercase font-bold text-gray-500 mb-1">Initial Progress %</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={newGoalProgress}
                    onChange={(e) => setNewGoalProgress(e.target.value)}
                    className="w-full text-xs p-2 border border-gray-300 bg-white rounded outline-none focus:border-[#3b66c5] text-black font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[9px] uppercase font-bold text-gray-500 mb-1">Accountable Team</label>
                  <select
                    value={newGoalTeam}
                    onChange={(e) => setNewGoalTeam(e.target.value)}
                    className="w-full text-xs p-2 border border-gray-300 bg-white rounded outline-none focus:border-[#3b66c5] text-black font-semibold"
                  >
                    {seedTeams.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-[9px] uppercase font-bold text-gray-500 mb-1">Goal Owner</label>
                  <select
                    value={newGoalOwner}
                    onChange={(e) => setNewGoalOwner(e.target.value)}
                    className="w-full text-xs p-2 border border-gray-300 bg-white rounded outline-none focus:border-[#3b66c5] text-black font-semibold"
                  >
                    {seedUsers.map(u => <option key={u.email} value={u.email}>{u.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#eeeeee]">
                <button
                  type="button"
                  onClick={() => setIsCreatingGoal(false)}
                  className="px-3 py-1.5 border border-gray-300 text-xs font-semibold rounded hover:bg-[#f3f3f4] text-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#3b66c5] hover:bg-[#2e55aa] text-white text-xs font-bold rounded shadow-xs"
                >
                  Create Goal
                </button>
              </div>
            </form>
          )}

          {/* Table Container Sheet */}
          <div className="border border-[#e2e2e2] rounded-lg bg-white overflow-hidden shadow-xs relative text-gray-800">
            <div className="overflow-x-auto min-h-[300px]">
              
              {/* Loop grouped goals */}
              {Object.entries(groupedGoals).map(([groupName, groupList]) => (
                <div key={groupName} className="border-b border-[#e2e2e2] last:border-b-0">
                  
                  {/* Group collapsible accordion header */}
                  {groupByField !== 'none' && (
                    <div className="bg-slate-50 px-4 py-2 text-xs font-bold text-gray-600 border-b border-[#e2e2e2] uppercase tracking-wider flex items-center gap-2">
                      <ChevronRight className="h-4.5 w-4.5 text-gray-400 rotate-90" />
                      <span>{groupByField}: {groupName} ({groupList.length} objectives)</span>
                    </div>
                  )}

                  <table className="w-full text-left border-collapse text-xs select-none table-fixed">
                    <thead>
                      <tr className="border-b border-[#e2e2e2] bg-[#fafafb] text-[#5e5e5e] font-semibold h-11">
                        
                        {/* Headers loop */}
                        {columns.map((col, cIdx) => (
                          <th key={col.id} className={`py-2 px-4 relative group cursor-pointer ${col.width}`}>
                            <div 
                              onClick={() => {
                                if (sortField === col.id) {
                                  setSortAsc(!sortAsc);
                                } else {
                                  setSortField(col.id);
                                  setSortAsc(true);
                                }
                              }}
                              className="flex items-center gap-1.5 hover:text-black transition-colors select-none text-gray-700"
                            >
                              <span>{col.label}</span>
                              <ArrowUpDown className="h-3 w-3 opacity-60 flex-shrink-0" />
                            </div>

                            {/* Options popup anchor trigger */}
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveHeaderDropdown(activeHeaderDropdown === col.id ? null : col.id);
                              }}
                              className="absolute right-1 top-1/2 -translate-y-1/2 p-1 hover:bg-[#eeeeef] rounded opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <ChevronDown className="h-3.5 w-3.5 text-gray-500" />
                            </button>

                            {/* Dropdown Options popovers (Moves columns showing too) */}
                            {activeHeaderDropdown === col.id && (
                              <div 
                                ref={headerMenuRef}
                                className="absolute left-2 mt-2 w-48 bg-white border border-[#e2e2e2] rounded-lg shadow-xl z-50 py-1.5 flex flex-col text-gray-800 font-normal animate-scale-in"
                              >
                                <div className="px-3.5 py-1 text-[9px] uppercase font-bold text-gray-400 tracking-wider">Column options</div>
                                
                                <button
                                  onClick={() => {
                                    setSortField(col.id);
                                    setSortAsc(true);
                                    setActiveHeaderDropdown(null);
                                  }}
                                  className="w-full text-left px-3.5 py-1.5 text-xs hover:bg-[#f5f5f6] font-semibold text-gray-700"
                                >
                                  Sort A - Z
                                </button>

                                <button
                                  onClick={() => {
                                    setSortField(col.id);
                                    setSortAsc(false);
                                    setActiveHeaderDropdown(null);
                                  }}
                                  className="w-full text-left px-3.5 py-1.5 text-xs hover:bg-[#f5f5f6] font-semibold text-gray-700"
                                >
                                  Sort Z - A
                                </button>

                                <div className="border-t border-[#eeeeee] my-1"></div>

                                {/* Move Left */}
                                {cIdx > 0 && (
                                  <button
                                    onClick={() => handleMoveColumn(col.id, 'left')}
                                    className="w-full text-left px-3.5 py-1.5 text-xs hover:bg-[#f5f5f6] flex items-center gap-2 font-semibold text-gray-700"
                                  >
                                    <ArrowLeft className="h-3 w-3 text-gray-400" />
                                    <span>Move Column Left</span>
                                  </button>
                                )}

                                {/* Move Right */}
                                {cIdx < columns.length - 1 && (
                                  <button
                                    onClick={() => handleMoveColumn(col.id, 'right')}
                                    className="w-full text-left px-3.5 py-1.5 text-xs hover:bg-[#f5f5f6] flex items-center gap-2 font-semibold text-gray-700"
                                  >
                                    <ArrowRight className="h-3 w-3 text-gray-400" />
                                    <span>Move Column Right</span>
                                  </button>
                                )}

                                {col.isCustom && (
                                  <>
                                    <div className="border-t border-[#eeeeee] my-1"></div>
                                    <button
                                      onClick={() => {
                                        setColumns(columns.filter(c => c.id !== col.id));
                                        setActiveHeaderDropdown(null);
                                      }}
                                      className="w-full text-left px-3.5 py-1.5 text-xs hover:bg-rose-50 text-rose-600 flex items-center gap-2 font-semibold"
                                    >
                                      <Trash2 className="h-3 w-3" />
                                      <span>Delete custom column</span>
                                    </button>
                                  </>
                                )}
                              </div>
                            )}
                          </th>
                        ))}

                        {/* Add Field Trigger column header */}
                        <th className="py-2 px-4 w-14 text-center relative" ref={addFieldRef}>
                          <button 
                            onClick={() => setIsAddFieldOpen(!isAddFieldOpen)}
                            className="p-1 hover:bg-[#eeeeef] rounded transition-colors text-black border border-gray-300"
                            title="Add Field option active"
                          >
                            <Plus className="h-4 w-4" />
                          </button>

                          {/* Field Types Downbar active popup (Single/Multi option builder) */}
                          {isAddFieldOpen && (
                            <div className="absolute right-0 mt-2 w-72 bg-white border border-[#e2e2e2] rounded-xl shadow-2xl z-50 p-4 flex flex-col gap-3 font-normal text-left text-gray-800 animate-scale-in">
                              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Field type downbar options</span>
                              
                              <form onSubmit={handleCreateCustomField} className="space-y-3">
                                <div>
                                  <label className="block text-[9px] uppercase font-bold text-gray-500 mb-1">Field name</label>
                                  <input 
                                    type="text"
                                    required
                                    value={newFieldName}
                                    onChange={(e) => setNewFieldName(e.target.value)}
                                    placeholder="e.g. Priority Level"
                                    className="w-full text-xs p-2 border border-gray-300 rounded outline-none focus:border-[#3b66c5] text-black"
                                  />
                                </div>

                                <div>
                                  <label className="block text-[9px] uppercase font-bold text-gray-500 mb-1">Field type</label>
                                  <select
                                    value={newFieldType}
                                    onChange={(e) => setNewFieldType(e.target.value)}
                                    className="w-full text-xs p-2 border border-gray-300 bg-white rounded outline-none focus:border-[#3b66c5] text-black font-semibold"
                                  >
                                    <option value="text">Text select</option>
                                    <option value="number">Number select</option>
                                    <option value="date">Date select</option>
                                    <option value="people">People select</option>
                                    <option value="select">Single select</option>
                                    <option value="multiselect">Multi-select</option>
                                  </select>
                                </div>

                                {/* Custom Options Builder popped after selecting single/multi select */}
                                {['select', 'multiselect'].includes(newFieldType) && (
                                  <div className="space-y-2 p-2.5 bg-[#fafafb] border border-gray-200 rounded-lg">
                                    <label className="block text-[9px] uppercase font-bold text-gray-500">Configure select options</label>
                                    
                                    <div className="flex gap-1.5">
                                      <input 
                                        type="text"
                                        placeholder="Add tag name..."
                                        value={currentOptionText}
                                        onChange={(e) => setCurrentOptionText(e.target.value)}
                                        className="flex-1 text-[11px] p-1.5 border border-gray-300 bg-white rounded outline-none text-black"
                                      />
                                      <button 
                                        type="button"
                                        onClick={handleAddCustomOption}
                                        className="px-2 py-1.5 bg-black hover:bg-neutral-800 text-white rounded text-[10px] font-bold"
                                      >
                                        + Add
                                      </button>
                                    </div>

                                    {customOptionsList.length > 0 && (
                                      <div className="flex flex-wrap gap-1.5 pt-1.5 border-t border-[#eeeeee] mt-1.5">
                                        {customOptionsList.map((opt, idx) => (
                                          <span 
                                            key={idx}
                                            className={`text-[9px] font-bold px-2 py-0.5 border rounded-full ${opt.color}`}
                                          >
                                            {opt.label}
                                          </span>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                )}

                                {/* Number format popup details */}
                                {newFieldType === 'number' && (
                                  <div className="space-y-1">
                                    <label className="block text-[9px] uppercase font-bold text-gray-500 mb-1">Number select formatting</label>
                                    <select
                                      value={newFieldNumberFormat}
                                      onChange={(e) => setNewFieldNumberFormat(e.target.value)}
                                      className="w-full text-xs p-1.5 border border-gray-300 bg-white rounded outline-none focus:border-[#3b66c5] text-black font-semibold"
                                    >
                                      <option value="integer">Integer (e.g. 12)</option>
                                      <option value="decimal">Decimal (e.g. 12.34)</option>
                                      <option value="currency">Currency (e.g. $12.00)</option>
                                      <option value="percent">Percentage (e.g. 12%)</option>
                                    </select>
                                  </div>
                                )}

                                <div className="flex justify-end gap-2 pt-2 border-t border-[#eeeeee]">
                                  <button
                                    type="button"
                                    onClick={() => setIsAddFieldOpen(false)}
                                    className="px-2.5 py-1.5 border border-gray-300 text-[10px] font-bold uppercase rounded text-gray-600 hover:bg-[#f3f3f4]"
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    type="submit"
                                    className="px-3.5 py-1.5 bg-[#3b66c5] hover:bg-[#2e55aa] text-white text-[10px] font-bold uppercase rounded shadow-xs"
                                  >
                                    Enter to sheet
                                  </button>
                                </div>
                              </form>
                            </div>
                          )}
                        </th>
                      </tr>
                    </thead>

                    <tbody ref={inlineEditRef}>
                      {groupList.map((goal) => (
                        <tr 
                          key={goal._id} 
                          className="border-b border-[#e2e2e2] last:border-b-0 hover:bg-[#fafafb]/50 transition-colors h-11"
                        >
                          
                          {/* Loop through active table columns */}
                          {columns.map((col) => {
                            const isCellActive = activeCellEdit?.goalId === goal._id && activeCellEdit?.fieldId === col.id;

                            // 1. Column: Name
                            if (col.id === 'name') {
                              return (
                                <td key={col.id} className="py-2 px-4 font-bold text-gray-900 truncate">
                                  <input 
                                    type="text"
                                    value={goal.name}
                                    onChange={(e) => handleUpdateGoalField(goal._id, 'name', e.target.value)}
                                    className="w-full bg-transparent hover:bg-gray-50 border-none outline-none py-1 px-1.5 focus:bg-white rounded transition-colors text-gray-900 font-bold"
                                  />
                                </td>
                              );
                            }

                            // 2. Column: Status
                            if (col.id === 'status') {
                              return (
                                <td key={col.id} className="py-2 px-4">
                                  <select 
                                    value={goal.status}
                                    onChange={(e) => handleUpdateGoalField(goal._id, 'status', e.target.value)}
                                    className={`border rounded-full px-3 py-1 text-[10px] font-bold outline-none cursor-pointer ${getStatusBadgeClass(goal.status)}`}
                                  >
                                    <option value="On track">On track</option>
                                    <option value="At risk">At risk</option>
                                    <option value="Off track">Off track</option>
                                    <option value="Completed">Completed</option>
                                  </select>
                                </td>
                              );
                            }

                            // 3. Column: Progress
                            if (col.id === 'progress') {
                              return (
                                <td key={col.id} className="py-2 px-4">
                                  <div className="flex items-center gap-2 w-full">
                                    <div className="flex-1 bg-[#f3f3f4] h-2 rounded-full overflow-hidden border border-[#eeeeee]">
                                      <div 
                                        className={`h-full transition-all duration-500 ${
                                          goal.status === 'On track' ? 'bg-emerald-500' :
                                          goal.status === 'At risk' ? 'bg-amber-500' :
                                          goal.status === 'Completed' ? 'bg-blue-500' :
                                          'bg-rose-500'
                                        }`}
                                        style={{ width: `${goal.progress}%` }}
                                      ></div>
                                    </div>
                                    <input 
                                      type="number"
                                      min="0"
                                      max="100"
                                      value={goal.progress}
                                      onChange={(e) => handleUpdateGoalField(goal._id, 'progress', e.target.value)}
                                      className="w-10 bg-transparent hover:bg-gray-50 text-right font-mono font-semibold border-none outline-none focus:bg-white p-0.5 rounded text-gray-800"
                                    />
                                    <span className="text-[10px] font-mono text-gray-400">%</span>
                                  </div>
                                </td>
                              );
                            }

                            // 4. Column: Time Period
                            if (col.id === 'timePeriod') {
                              return (
                                <td 
                                  key={col.id} 
                                  className="py-2 px-4 font-semibold text-gray-600 cursor-pointer relative"
                                  onClick={() => {
                                    setActiveCellEdit({ goalId: goal._id, fieldId: col.id });
                                    setMapDropdownActive(false);
                                  }}
                                >
                                  {isCellActive ? (
                                    <input 
                                      type="text"
                                      autoFocus
                                      value={goal.timePeriod}
                                      onChange={(e) => handleUpdateGoalField(goal._id, 'timePeriod', e.target.value)}
                                      onBlur={() => setActiveCellEdit(null)}
                                      className="w-full text-xs p-1 border border-[#3b66c5] rounded outline-none text-black bg-white"
                                    />
                                  ) : (
                                    <div className="flex items-center gap-1 hover:bg-[#f3f3f4] px-1 py-0.5 rounded">
                                      <Calendar className="w-3.5 h-3.5 text-gray-400" />
                                      <span>{goal.timePeriod}</span>
                                    </div>
                                  )}
                                </td>
                              );
                            }

                            // 5. Column: Owner list selected
                            if (col.id === 'owner') {
                              const currentOwner = seedUsers.find(u => u.email === goal.owner) || seedUsers[0];
                              return (
                                <td 
                                  key={col.id} 
                                  className="py-2 px-4 font-medium text-gray-800 cursor-pointer relative"
                                  onClick={() => {
                                    setActiveCellEdit({ goalId: goal._id, fieldId: col.id });
                                    setOwnerDropdownActive(true);
                                  }}
                                >
                                  <div className="flex items-center gap-2 hover:bg-[#f3f3f4] px-1 py-0.5 rounded">
                                    <div className={`h-5.5 w-5.5 rounded-full flex items-center justify-center text-[9px] font-bold shadow-xs uppercase ${currentOwner.color}`}>
                                      {currentOwner.initials}
                                    </div>
                                    <span className="truncate">{currentOwner.name}</span>
                                  </div>

                                  {/* (+) active - owner list selected dropdown */}
                                  {isCellActive && ownerDropdownActive && (
                                    <div className="absolute left-4 top-10 mt-1 w-48 bg-white border border-[#e2e2e2] rounded-lg shadow-xl z-50 py-1.5 flex flex-col gap-0.5 animate-scale-in text-left">
                                      <div className="px-3.5 py-1 text-[9px] font-bold text-gray-400 uppercase tracking-wider">Select Owner</div>
                                      {seedUsers.map((user) => (
                                        <button
                                          key={user.email}
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleUpdateGoalField(goal._id, 'owner', user.email);
                                            setActiveCellEdit(null);
                                            setOwnerDropdownActive(false);
                                          }}
                                          className="w-full text-left px-3.5 py-2 text-xs hover:bg-[#f5f5f6] flex items-center gap-2 font-semibold text-gray-800"
                                        >
                                          <div className={`h-5 w-5 rounded-full flex items-center justify-center text-[8px] font-bold uppercase ${user.color}`}>
                                            {user.initials}
                                          </div>
                                          <span>{user.name}</span>
                                        </button>
                                      ))}
                                    </div>
                                  )}
                                </td>
                              );
                            }

                            // 6. Column: Accountable Team list selected
                            if (col.id === 'team') {
                              return (
                                <td 
                                  key={col.id} 
                                  className="py-2 px-4 font-semibold text-gray-600 cursor-pointer relative"
                                  onClick={() => {
                                    setActiveCellEdit({ goalId: goal._id, fieldId: col.id });
                                    setTeamDropdownActive(true);
                                  }}
                                >
                                  <div className="flex items-center justify-between hover:bg-[#f3f3f4] px-1 py-0.5 rounded text-gray-600 font-semibold">
                                    <span>{goal.team}</span>
                                    <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                                  </div>

                                  {/* (+) active - team list selected dropdown */}
                                  {isCellActive && teamDropdownActive && (
                                    <div className="absolute left-4 top-10 mt-1 w-40 bg-white border border-[#e2e2e2] rounded-lg shadow-xl z-50 py-1.5 flex flex-col animate-scale-in text-left">
                                      <div className="px-3.5 py-1 text-[9px] font-bold text-gray-400 uppercase tracking-wider">Select Team</div>
                                      {seedTeams.map((t) => (
                                        <button
                                          key={t}
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleUpdateGoalField(goal._id, 'team', t);
                                            setActiveCellEdit(null);
                                            setTeamDropdownActive(false);
                                          }}
                                          className="w-full text-left px-3.5 py-2 text-xs hover:bg-[#f5f5f6] font-semibold text-gray-800"
                                        >
                                          {t}
                                        </button>
                                      ))}
                                    </div>
                                  )}
                                </td>
                              );
                            }

                            // Render Custom Column Cells
                            const cellVal = goal[col.id];
                            
                            // Date custom field type
                            if (col.fieldType === 'date') {
                              return (
                                <td key={col.id} className="py-2 px-4 relative">
                                  <input 
                                    type="date"
                                    value={cellVal || ''}
                                    onChange={(e) => handleUpdateGoalField(goal._id, col.id, e.target.value)}
                                    className="bg-transparent border-none outline-none font-semibold text-gray-700 hover:bg-[#f3f3f4] focus:bg-white rounded p-0.5 cursor-pointer text-xs"
                                  />
                                </td>
                              );
                            }

                            // People custom field type
                            if (col.fieldType === 'people') {
                              const matchUser = seedUsers.find(u => u.email === cellVal) || seedUsers[0];
                              return (
                                <td 
                                  key={col.id} 
                                  className="py-2 px-4 cursor-pointer relative"
                                  onClick={() => {
                                    setActiveCellEdit({ goalId: goal._id, fieldId: col.id });
                                    setOwnerDropdownActive(true);
                                  }}
                                >
                                  {cellVal ? (
                                    <div className="flex items-center gap-1.5 hover:bg-[#f3f3f4] px-1 py-0.5 rounded">
                                      <div className={`h-5 w-5 rounded-full flex items-center justify-center text-[8px] font-bold uppercase ${matchUser.color}`}>
                                        {matchUser.initials}
                                      </div>
                                      <span className="truncate">{matchUser.name}</span>
                                    </div>
                                  ) : (
                                    <div className="flex items-center gap-1 text-gray-400 hover:bg-[#f3f3f4] px-1 py-0.5 rounded">
                                      <UserPlus className="w-3.5 h-3.5" />
                                      <span>Assign...</span>
                                    </div>
                                  )}

                                  {isCellActive && ownerDropdownActive && (
                                    <div className="absolute left-4 top-10 mt-1 w-48 bg-white border border-[#e2e2e2] rounded-lg shadow-xl z-50 py-1.5 flex flex-col gap-0.5 animate-scale-in text-left">
                                      <div className="px-3.5 py-1 text-[9px] font-bold text-gray-400 uppercase tracking-wider">Select Person</div>
                                      {seedUsers.map((user) => (
                                        <button
                                          key={user.email}
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleUpdateGoalField(goal._id, col.id, user.email);
                                            setActiveCellEdit(null);
                                            setOwnerDropdownActive(false);
                                          }}
                                          className="w-full text-left px-3.5 py-2 text-xs hover:bg-[#f5f5f6] flex items-center gap-2 font-semibold text-gray-800"
                                        >
                                          <div className={`h-5 w-5 rounded-full flex items-center justify-center text-[8px] font-bold uppercase ${user.color}`}>
                                            {user.initials}
                                          </div>
                                          <span>{user.name}</span>
                                        </button>
                                      ))}
                                    </div>
                                  )}
                                </td>
                              );
                            }

                            // Single/Multi Select custom field type
                            if (['select', 'multiselect'].includes(col.fieldType)) {
                              const option = col.options?.find(o => o.label === cellVal) || { label: cellVal || 'Select...', color: 'bg-gray-100 text-gray-500' };
                              return (
                                <td 
                                  key={col.id} 
                                  className="py-2 px-4 cursor-pointer relative"
                                  onClick={() => {
                                    setActiveCellEdit({ goalId: goal._id, fieldId: col.id });
                                    setMapDropdownActive(true);
                                  }}
                                >
                                  <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold border transition-colors hover:opacity-85 ${option.color}`}>
                                    {option.label}
                                  </div>

                                  {isCellActive && mapDropdownActive && (
                                    <div className="absolute left-4 top-10 mt-1 w-40 bg-white border border-[#e2e2e2] rounded-lg shadow-xl z-50 py-1.5 flex flex-col animate-scale-in text-left">
                                      <div className="px-3.5 py-1 text-[9px] font-bold text-gray-400 uppercase tracking-wider">Select Option</div>
                                      {col.options?.map((opt) => (
                                        <button
                                          key={opt.label}
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleUpdateGoalField(goal._id, col.id, opt.label);
                                            setActiveCellEdit(null);
                                            setMapDropdownActive(false);
                                          }}
                                          className="w-full text-left px-3.5 py-2 hover:bg-[#f5f5f6] text-[11px] font-semibold text-gray-800 flex items-center gap-1.5"
                                        >
                                          <div className={`h-2.5 w-2.5 rounded-full ${opt.color.split(' ')[0]}`} />
                                          <span>{opt.label}</span>
                                        </button>
                                      ))}
                                    </div>
                                  )}
                                </td>
                              );
                            }

                            // Standard Text / Number cell
                            return (
                              <td key={col.id} className="py-2 px-4">
                                <input 
                                  type={col.fieldType === 'number' ? 'number' : 'text'}
                                  value={cellVal !== undefined ? cellVal : ''}
                                  onChange={(e) => handleUpdateGoalField(goal._id, col.id, e.target.value)}
                                  className="w-full bg-transparent hover:bg-gray-50 border-none outline-none py-1 px-1 focus:bg-white rounded transition-colors text-gray-700 font-semibold"
                                  placeholder="Double click..."
                                />
                              </td>
                            );
                          })}

                          {/* Options trigger/delete goal cell */}
                          <td className="py-2 px-4 w-12 text-center">
                            <button 
                              onClick={() => handleDeleteGoal(goal._id)}
                              className="p-1 text-gray-400 hover:text-rose-600 rounded hover:bg-rose-50"
                              title="Delete Goal"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </td>

                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}

            </div>
          </div>

        </div>
      ) : (
        /* 3. High-Fidelity Strategy Map View (Matches Strategy Map references) */
        <div className="space-y-8 animate-scale-in text-gray-800">
          
          {/* Company Vision / Filter Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl border border-gray-200 bg-slate-50">
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold text-gray-500">Filter Strategy period:</span>
              <div className="relative">
                <button 
                  onClick={() => setIsMapPeriodOpen(!isMapPeriodOpen)}
                  className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 rounded text-xs font-semibold bg-white text-gray-700 hover:border-gray-400"
                >
                  <Calendar className="w-3.5 h-3.5 text-gray-400" />
                  <span>Timeframe: {strategyMapPeriod}</span>
                  <ChevronDown className="w-3 h-3 text-gray-400" />
                </button>

                {isMapPeriodOpen && (
                  <div className="absolute left-0 mt-2 w-40 bg-white border border-[#e2e2e2] rounded-xl shadow-xl z-50 p-2 flex flex-col gap-1.5 animate-scale-in text-left">
                    {['All', 'Q2 2026', 'Q3 2026', 'Q4 2026', 'FY 2026'].map((period) => (
                      <button
                        key={period}
                        onClick={() => {
                          setStrategyMapPeriod(period);
                          setIsMapPeriodOpen(false);
                        }}
                        className={`w-full text-left px-2.5 py-1.5 text-xs hover:bg-[#f5f5f6] rounded font-semibold ${strategyMapPeriod === period ? 'text-[#3b66c5] bg-blue-50/50' : 'text-gray-700'}`}
                      >
                        {period}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <button 
              onClick={() => setIsCreatingFromMap(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-black hover:bg-neutral-800 text-white rounded text-xs font-bold transition-all shadow-xs"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Create goal on map</span>
            </button>
          </div>

          {/* Vision Statement Header */}
          <div className="relative overflow-hidden p-6 rounded-2xl border border-transparent bg-gradient-to-r from-amber-500/10 via-purple-500/10 to-blue-500/10 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-1.5 text-amber-600 font-bold text-xs uppercase tracking-wider">
                <Sparkles className="h-4 w-4" />
                <span>Ultimate corporate vision map</span>
              </div>
              <h3 className="text-base font-bold text-black font-sans leading-tight">Become the #1 Collaboration suite for modern agile teams</h3>
              <p className="text-xs text-gray-500 max-w-xl">Connecting organizational high-level mission goals directly down into actual workspace project blueprints.</p>
            </div>
            
            <div className="h-14 w-14 bg-white shadow-md border border-[#e2e2e2] rounded-xl flex items-center justify-center text-amber-500 flex-shrink-0">
              <Trophy className="h-7 w-7" />
            </div>
          </div>

          {/* Interactive Flowchart flowchart columns */}
          <div className="space-y-6">
            
            {/* Tier 1: Company Objectives */}
            <div className="space-y-3">
              <h4 className="text-[10px] uppercase font-bold text-gray-400 tracking-wider px-2">Tier 1: Parent company objectives</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {goals
                  .filter(g => strategyMapPeriod === 'All' || g.timePeriod === strategyMapPeriod)
                  .slice(0, 2).map((goal) => (
                    <div key={goal._id} className="border border-gray-200 bg-white rounded-xl p-5 shadow-xs flex flex-col gap-4 relative overflow-hidden group">
                      <div className="absolute top-0 left-0 w-1.5 h-full bg-[#3b66c5]" />
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <span className={`text-[9px] font-bold border rounded-full px-2 py-0.5 uppercase tracking-wide ${getStatusBadgeClass(goal.status)}`}>
                            {goal.status}
                          </span>
                          <h5 className="text-xs font-bold text-black mt-2 leading-tight group-hover:underline cursor-pointer">{goal.name}</h5>
                        </div>
                        
                        <div className="h-8 w-8 rounded bg-[#fafafa] border border-gray-200 flex items-center justify-center text-xs font-bold font-mono text-gray-800">
                          {goal.progress}%
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[10px] text-gray-500 pt-2 border-t border-[#eeeeee]">
                        <span className="font-semibold text-gray-500">Target: {goal.timePeriod}</span>
                        <span className="font-semibold bg-gray-100 text-gray-700 px-2 py-0.5 rounded">{goal.team} Team</span>
                      </div>
                    </div>
                ))}
              </div>
            </div>

            {/* Tier 2: Individual supporting Key Results */}
            <div className="space-y-3">
              <h4 className="text-[10px] uppercase font-bold text-gray-400 tracking-wider px-2">Tier 2: Supporting Key Results & Mapped Projects</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {goals
                  .filter(g => strategyMapPeriod === 'All' || g.timePeriod === strategyMapPeriod)
                  .slice(2).map((goal, idx) => {
                    const connectedProj = projects[idx % projects.length] || { name: 'Monochrome Overhaul', _id: 'mock_project_2' };
                    
                    return (
                      <div key={goal._id} className="border border-gray-200 bg-[#fafafb]/50 hover:bg-white rounded-xl p-4 shadow-xs flex flex-col gap-4 transition-all hover:shadow-md relative overflow-hidden group border-dashed hover:border-solid">
                        <div className="absolute top-0 left-0 w-1.5 h-full bg-[#9969c9]" />
                        
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className={`text-[8px] font-bold border rounded-full px-2 py-0.5 uppercase tracking-wider ${getStatusBadgeClass(goal.status)}`}>
                              {goal.status}
                            </span>
                            <span className="text-[10px] font-mono font-bold text-gray-800">{goal.progress}%</span>
                          </div>
                          <h5 className="text-xs font-bold text-black leading-snug">{goal.name}</h5>
                        </div>

                        {/* Mapped workspace project links */}
                        <div className="mt-2 p-2.5 bg-white border border-gray-200 rounded-lg flex flex-col gap-1 hover:border-[#1a1c1c] transition-all">
                          <div className="flex items-center gap-1.5 text-[9px] font-bold text-[#9969c9] uppercase tracking-wider">
                            <Link2 className="h-3 w-3" />
                            <span>Connected workspace project</span>
                          </div>
                          
                          <button 
                            onClick={() => {
                              if (setActiveProjectId) setActiveProjectId(connectedProj._id);
                              if (setActiveView) setActiveView('project-details');
                            }}
                            className="text-[11px] font-bold text-black text-left hover:underline truncate"
                          >
                            {connectedProj.name}
                          </button>
                        </div>

                        <div className="flex items-center justify-between text-[9px] text-gray-500 border-t border-[#eeeeee]/60 pt-2.5">
                          <span className="font-semibold">Target: {goal.timePeriod}</span>
                          <span className="font-semibold uppercase bg-[#f3f3f4] text-gray-700 px-1.5 py-0.5 rounded tracking-wide">{goal.team}</span>
                        </div>
                      </div>
                    );
                })}
              </div>
            </div>

          </div>

          {/* Create Goal from Map Modal Popup */}
          {isCreatingFromMap && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-6 z-50 animate-fade-in select-none">
              <div className="bg-white rounded-xl border border-[#e2e2e2] shadow-2xl w-full max-w-md p-6 relative flex flex-col gap-4 text-gray-800">
                <button 
                  onClick={() => setIsCreatingFromMap(false)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-black p-1 hover:bg-[#f3f3f4] rounded"
                >
                  <X className="h-5 w-5" />
                </button>

                <h3 className="text-base font-bold text-black flex items-center gap-2">
                  <Plus className="h-4.5 w-4.5 text-[#3b66c5]" />
                  <span>Create Strategy Goal objective on Map</span>
                </h3>

                <form onSubmit={handleCreateGoal} className="space-y-4">
                  <div>
                    <label className="block text-[9px] uppercase font-bold text-gray-500 mb-1">Objective Title</label>
                    <input 
                      type="text"
                      required
                      value={newGoalName}
                      onChange={(e) => setNewGoalName(e.target.value)}
                      placeholder="e.g. Scaling B2B Corporate partnerships program"
                      className="w-full text-xs p-2 border border-gray-300 rounded outline-none focus:border-[#3b66c5] text-black"
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] uppercase font-bold text-gray-500 mb-1">Time period timeframe</label>
                    <select
                      value={newGoalTime}
                      onChange={(e) => setNewGoalTime(e.target.value)}
                      className="w-full text-xs p-2 border border-gray-300 bg-white rounded outline-none text-black font-semibold"
                    >
                      <option value="Q2 2026">Q2 2026</option>
                      <option value="Q3 2026">Q3 2026</option>
                      <option value="Q4 2026">Q4 2026</option>
                      <option value="FY 2026">FY 2026</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[9px] uppercase font-bold text-gray-500 mb-1">Accountable Team</label>
                    <select
                      value={newGoalTeam}
                      onChange={(e) => setNewGoalTeam(e.target.value)}
                      className="w-full text-xs p-2 border border-gray-300 bg-white rounded outline-none text-black font-semibold"
                    >
                      {seedTeams.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[9px] uppercase font-bold text-gray-500 mb-1">Align with parent Vision</label>
                    <select
                      value={newGoalParent}
                      onChange={(e) => setNewGoalParent(e.target.value)}
                      className="w-full text-xs p-2 border border-gray-300 bg-white rounded outline-none text-black font-semibold"
                    >
                      {seedParents.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>

                  <div className="flex justify-end gap-2 pt-3 border-t border-[#eeeeee]">
                    <button
                      type="button"
                      onClick={() => setIsCreatingFromMap(false)}
                      className="px-3 py-1.5 border border-gray-300 text-xs font-semibold rounded text-gray-500 hover:bg-[#f3f3f4]"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-[#3b66c5] hover:bg-[#2e55aa] text-white text-xs font-bold rounded shadow-xs"
                    >
                      Define Objective
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

        </div>
      )}


      {/* Floating Info Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-black text-white px-4 py-2.5 rounded shadow-lg text-xs font-semibold z-50 animate-fade-in flex items-center gap-2">
          <Check className="w-3.5 h-3.5 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

    </div>
  );
};

export default StrategyGoalsView;
