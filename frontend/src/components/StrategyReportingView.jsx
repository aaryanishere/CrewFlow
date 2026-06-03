import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  BarChart3, 
  PieChart, 
  LineChart, 
  TrendingUp, 
  Plus, 
  X, 
  Check, 
  MoreHorizontal, 
  Maximize2, 
  Sliders, 
  Tag, 
  Palette, 
  FolderIcon, 
  Users, 
  Activity, 
  ShieldAlert,
  Search,
  Sparkles,
  ArrowRight,
  Settings,
  Move,
  ChevronDown,
  Trash2,
  List,
  Grid,
  LayoutDashboard,
  Target,
  Compass,
  AlertCircle,
  ChevronRight,
  Link2
} from 'lucide-react';

const StrategyReportingView = ({ projects = [], tasks = [] }) => {
  const [viewAs, setViewAs] = useState('Dashboard'); // 'Dashboard' | 'Grid' | 'List'
  const [isViewAsOpen, setIsViewAsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals / Overlays Visibility States
  const [isAddDashboardOpen, setIsAddDashboardOpen] = useState(false);
  const [activeTripleDotId, setActiveTripleDotId] = useState(null); // widgetId or null
  const [zoomedWidgetId, setZoomedWidgetId] = useState(null); // widgetId or null
  const [editingWidgetId, setEditingWidgetId] = useState(null); // widgetId or null
  const [colorPickerWidgetId, setColorPickerWidgetId] = useState(null); // widgetId or null
  const [toastMessage, setToastMessage] = useState('');
  
  // Dashboard Header actions state (favorite star and chevron dropdown)
  const [isFavorite, setIsFavorite] = useState(false);
  const [isDashboardMenuOpen, setIsDashboardMenuOpen] = useState(false);
  const [isEditingDetails, setIsEditingDetails] = useState(false);
  const [dashboardName, setDashboardName] = useState("Strategy Reporting & Analytics");
  const [dashboardDesc, setDashboardDesc] = useState("Visualize project health indexes, monitor strategic achievement rates, and generate workload recommendations.");
  const [dashboardColor, setDashboardColor] = useState('blue'); // 'blue' | 'pink' | 'emerald' | 'amber' | 'purple'
  const [isSetColorOpen, setIsSetColorOpen] = useState(false);

  const dashboardMenuRef = useRef(null);

  // Click outside to close dashboard actions menu
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dashboardMenuRef.current && !dashboardMenuRef.current.contains(e.target)) {
        setIsDashboardMenuOpen(false);
        setIsSetColorOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    triggerToast("Dashboard link copied to clipboard!");
    setIsDashboardMenuOpen(false);
  };

  const handleDuplicate = () => {
    setWidgets([...widgets, ...widgets.map(w => ({ ...w, id: `${w.id}_dup_${Date.now()}`, title: `${w.title} (Copy)` }))]);
    triggerToast("Dashboard duplicated successfully!");
    setIsDashboardMenuOpen(false);
  };

  const handleDeleteDashboard = () => {
    if (confirm("Are you sure you want to delete this dashboard? This will clear all widgets.")) {
      setWidgets([]);
      triggerToast("Dashboard widgets cleared.");
    }
    setIsDashboardMenuOpen(false);
  };

  // Styles customized dynamically by Set Color & Icon
  const [widgetStyles, setWidgetStyles] = useState({
    widget_1: { color: 'border-l-[#3b66c5]', bg: 'bg-[#3b66c5]/5', iconColor: 'text-[#3b66c5]', icon: 'Activity' },
    widget_2: { color: 'border-l-pink-500', bg: 'bg-pink-500/5', iconColor: 'text-pink-500', icon: 'Users' },
    widget_3: { color: 'border-l-emerald-500', bg: 'bg-emerald-500/5', iconColor: 'text-emerald-500', icon: 'Compass' },
    widget_4: { color: 'border-l-amber-500', bg: 'bg-amber-500/5', iconColor: 'text-amber-500', icon: 'Target' }
  });

  // Dynamic Dashboard Widgets List
  const [widgets, setWidgets] = useState([
    {
      id: 'widget_1',
      title: 'Monochrome Overhaul Tasks by Project',
      type: 'bar',
      xAxis: 'Project',
      yAxis: 'Tasks Count',
      chartData: [
        { label: 'Product Launch', value: 2 },
        { label: 'Monochrome Overhaul', value: 1 }
      ]
    },
    {
      id: 'widget_2',
      title: 'Incomplete Tasks by Assignee',
      type: 'doughnut',
      xAxis: 'Assignee',
      yAxis: 'Tasks Volume',
      chartData: [
        { label: 'guest@crewflow.com', value: 2, color: 'bg-[#3b66c5]' },
        { label: 'member@crewflow.com', value: 1, color: 'bg-purple-500' }
      ]
    },
    {
      id: 'widget_3',
      title: 'Strategic Goals Achievement Velocity',
      type: 'line',
      xAxis: 'Timeline',
      yAxis: 'Completion Rate (%)',
      chartData: [
        { label: 'Q1', value: 30 },
        { label: 'Q2', value: 55 },
        { label: 'Q3', value: 65 }
      ]
    },
    {
      id: 'widget_4',
      title: 'Key Objectives Status Breakdown',
      type: 'doughnut',
      xAxis: 'Status',
      yAxis: 'Goals Mapped',
      chartData: [
        { label: 'On track', value: 3, color: 'bg-emerald-500' },
        { label: 'At risk', value: 1, color: 'bg-amber-500' },
        { label: 'Off track', value: 1, color: 'bg-rose-500' }
      ]
    }
  ]);

  // Edit Widget Form state
  const [editTitle, setEditTitle] = useState('');
  const [editChartType, setEditChartType] = useState('bar');
  const [editXAxis, setEditXAxis] = useState('Project');

  // Refs for clicking outside to close
  const addDashboardRef = useRef(null);
  const viewAsRef = useRef(null);
  const widgetMenuRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (addDashboardRef.current && !addDashboardRef.current.contains(e.target)) {
        setIsAddDashboardOpen(false);
      }
      if (viewAsRef.current && !viewAsRef.current.contains(e.target)) {
        setIsViewAsOpen(false);
      }
      if (widgetMenuRef.current && !widgetMenuRef.current.contains(e.target)) {
        setActiveTripleDotId(null);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Add Dashboard Widget templates (Based on the filename sections)
  const handleAddTemplateWidget = (templateName, category) => {
    const newId = `widget_${Date.now()}`;
    let newWidget = {
      id: newId,
      title: templateName,
      type: 'bar',
      xAxis: 'Workspace',
      yAxis: 'Metrics',
      chartData: []
    };

    let style = { color: 'border-l-indigo-500', bg: 'bg-indigo-500/5', iconColor: 'text-indigo-500', icon: 'Activity' };

    if (category === 'resourcing') {
      newWidget = {
        ...newWidget,
        title: `Resourcing: ${templateName}`,
        type: 'line',
        xAxis: 'Weekly timeline',
        yAxis: 'Capacity hours',
        chartData: [
          { label: 'Wk 1', value: 40 },
          { label: 'Wk 2', value: 35 },
          { label: 'Wk 3', value: 48 }
        ]
      };
      style = { color: 'border-l-pink-500', bg: 'bg-pink-500/5', iconColor: 'text-pink-500', icon: 'Users' };
    } else if (category === 'workhealth') {
      newWidget = {
        ...newWidget,
        title: `Work Health: ${templateName}`,
        type: 'doughnut',
        xAxis: 'Task Status',
        yAxis: 'Volume count',
        chartData: [
          { label: 'Complete', value: 8, color: 'bg-emerald-500' },
          { label: 'Overdue', value: 2, color: 'bg-rose-500' },
          { label: 'Blocked', value: 1, color: 'bg-amber-500' }
        ]
      };
      style = { color: 'border-l-rose-500', bg: 'bg-rose-500/5', iconColor: 'text-rose-500', icon: 'AlertCircle' };
    } else if (category === 'connection') {
      newWidget = {
        ...newWidget,
        title: `Milestone Connection: ${templateName}`,
        type: 'bar',
        xAxis: 'Missions',
        yAxis: 'Achieved KRs',
        chartData: [
          { label: 'Vision 1', value: 65 },
          { label: 'Vision 2', value: 40 },
          { label: 'Vision 3', value: 85 }
        ]
      };
      style = { color: 'border-l-emerald-500', bg: 'bg-emerald-500/5', iconColor: 'text-emerald-500', icon: 'Compass' };
    } else if (category === 'recommendation') {
      newWidget = {
        ...newWidget,
        title: `Recommendation: ${templateName}`,
        type: 'text',
        chartData: null
      };
      style = { color: 'border-l-amber-500', bg: 'bg-amber-500/5', iconColor: 'text-amber-500', icon: 'Target' };
    }

    setWidgets([...widgets, newWidget]);
    setWidgetStyles(prev => ({ ...prev, [newId]: style }));
    setIsAddDashboardOpen(false);
    triggerToast(`Added reporting card: "${templateName}"`);
  };

  // Delete widget
  const handleDeleteWidget = (widgetId) => {
    setWidgets(prev => prev.filter(w => w.id !== widgetId));
    triggerToast("Widget removed from reporting dashboard.");
  };

  // Edit Widget Spec handlers
  const handleStartEditWidget = (widget) => {
    setEditingWidgetId(widget.id);
    setEditTitle(widget.title);
    setEditChartType(widget.type);
    setEditXAxis(widget.xAxis);
    setActiveTripleDotId(null);
  };

  const handleSaveWidgetEdits = (e) => {
    e.preventDefault();
    setWidgets(prev => prev.map(w => {
      if (w.id === editingWidgetId) {
        return {
          ...w,
          title: editTitle,
          type: editChartType,
          xAxis: editXAxis
        };
      }
      return w;
    }));
    setEditingWidgetId(null);
  };

  // Set Color & Icon (triple dot options dialog)
  const handleSetWidgetStyle = (widgetId, colorName, iconName) => {
    let colorClasses = { color: 'border-l-[#3b66c5]', bg: 'bg-[#3b66c5]/5', iconColor: 'text-[#3b66c5]' };
    if (colorName === 'pink') colorClasses = { color: 'border-l-pink-500', bg: 'bg-pink-500/5', iconColor: 'text-pink-500' };
    else if (colorName === 'emerald') colorClasses = { color: 'border-l-emerald-500', bg: 'bg-emerald-500/5', iconColor: 'text-emerald-500' };
    else if (colorName === 'amber') colorClasses = { color: 'border-l-amber-500', bg: 'bg-amber-500/5', iconColor: 'text-amber-500' };
    else if (colorName === 'purple') colorClasses = { color: 'border-l-purple-500', bg: 'bg-purple-500/5', iconColor: 'text-purple-500' };
    else if (colorName === 'rose') colorClasses = { color: 'border-l-rose-500', bg: 'bg-rose-500/5', iconColor: 'text-rose-500' };

    setWidgetStyles(prev => ({
      ...prev,
      [widgetId]: {
        ...colorClasses,
        icon: iconName
      }
    }));
    setColorPickerWidgetId(null);
    setActiveTripleDotId(null);
  };

  // Swap position of cards
  const handleMoveWidget = (widgetId, direction) => {
    const idx = widgets.findIndex(w => w.id === widgetId);
    if (idx === -1) return;
    const newWidgets = [...widgets];
    if (direction === 'left' && idx > 0) {
      const temp = newWidgets[idx - 1];
      newWidgets[idx - 1] = newWidgets[idx];
      newWidgets[idx] = temp;
    } else if (direction === 'right' && idx < widgets.length - 1) {
      const temp = newWidgets[idx + 1];
      newWidgets[idx + 1] = newWidgets[idx];
      newWidgets[idx] = temp;
    }
    setWidgets(newWidgets);
    setActiveTripleDotId(null);
  };

  const renderWidgetIcon = (iconName, colorClass) => {
    const cl = `h-4 w-4 ${colorClass}`;
    switch (iconName) {
      case 'Activity': return <Activity className={cl} />;
      case 'Users': return <Users className={cl} />;
      case 'Compass': return <Compass className={cl} />;
      case 'Target': return <Target className={cl} />;
      case 'AlertCircle': return <AlertCircle className={cl} />;
      default: return <BarChart3 className={cl} />;
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-white px-8 py-8 space-y-6 select-none font-sans relative text-gray-800">
      
      {/* 1. Header toolbar row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-[#e2e2e2] gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2.5">
            <TrendingUp className="h-6 w-6 text-indigo-500" />
            <span>Strategy Reporting & Analytics</span>
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">Visualize project health indexes, monitor strategic achievement rates, and generate workload recommendations.</p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          
          {/* View As Option active downbar selector */}
          <div className="relative" ref={viewAsRef}>
            <button 
              onClick={() => setIsViewAsOpen(!isViewAsOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 rounded text-xs font-semibold bg-white text-gray-700 hover:border-gray-400"
            >
              {viewAs === 'Dashboard' && <LayoutDashboard className="w-3.5 h-3.5" />}
              {viewAs === 'Grid' && <Grid className="w-3.5 h-3.5" />}
              {viewAs === 'List' && <List className="w-3.5 h-3.5" />}
              <span>View As: {viewAs}</span>
              <ChevronDown className="w-3 h-3 text-gray-400" />
            </button>

            {isViewAsOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-white border border-[#e2e2e2] rounded-xl shadow-xl z-50 p-2 flex flex-col gap-1.5 animate-scale-in text-left">
                <button
                  onClick={() => { setViewAs('Dashboard'); setIsViewAsOpen(false); }}
                  className="w-full text-left px-2.5 py-1.5 text-xs hover:bg-[#f5f5f6] rounded font-semibold text-gray-800 flex items-center gap-2"
                >
                  <LayoutDashboard className="w-4 h-4 text-gray-400" />
                  <span>Dashboard charts</span>
                </button>
                <button
                  onClick={() => { setViewAs('Grid'); setIsViewAsOpen(false); }}
                  className="w-full text-left px-2.5 py-1.5 text-xs hover:bg-[#f5f5f6] rounded font-semibold text-gray-800 flex items-center gap-2"
                >
                  <Grid className="w-4 h-4 text-gray-400" />
                  <span>Grid sheet layout</span>
                </button>
                <button
                  onClick={() => { setViewAs('List'); setIsViewAsOpen(false); }}
                  className="w-full text-left px-2.5 py-1.5 text-xs hover:bg-[#f5f5f6] rounded font-semibold text-gray-800 flex items-center gap-2"
                >
                  <List className="w-4 h-4 text-gray-400" />
                  <span>Collapsible list layout</span>
                </button>
              </div>
            )}
          </div>

          {/* Add Widget template trigger */}
          <div className="relative" ref={addDashboardRef}>
            <button
              onClick={() => setIsAddDashboardOpen(!isAddDashboardOpen)}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-black text-white hover:bg-neutral-800 text-xs font-bold rounded shadow-xs"
            >
              <Plus className="h-4 w-4" />
              <span>Add dashboard widget</span>
            </button>

            {/* Create Dashboard Category popover panels (Matches inspiration names) */}
            {isAddDashboardOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white border border-[#e2e2e2] rounded-xl shadow-2xl z-50 p-4 flex flex-col gap-4 animate-scale-in text-left text-gray-800 max-h-[400px] overflow-y-auto">
                <div className="flex items-center justify-between border-b border-[#eeeeee] pb-2">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Widget catalog categories</span>
                  <button onClick={() => setIsAddDashboardOpen(false)} className="text-gray-400 hover:text-black">
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {/* 1. Resourcing Capacity templates */}
                <div className="space-y-1">
                  <span className="text-[9px] uppercase font-bold text-[#ec4899] tracking-wide block">Resourcing capacity sections</span>
                  <button 
                    onClick={() => handleAddTemplateWidget("Team Hours Availability Index", "resourcing")}
                    className="w-full text-left p-1.5 hover:bg-[#f5f5f6] text-[11px] font-semibold text-gray-700 rounded transition-colors"
                  >
                    + Weekly Hours allocation rate
                  </button>
                </div>

                {/* 2. Work Health templates */}
                <div className="space-y-1">
                  <span className="text-[9px] uppercase font-bold text-rose-500 tracking-wide block">Work health list sections</span>
                  <button 
                    onClick={() => handleAddTemplateWidget("Workspace Overdue Blocker status", "workhealth")}
                    className="w-full text-left p-1.5 hover:bg-[#f5f5f6] text-[11px] font-semibold text-gray-700 rounded transition-colors"
                  >
                    + Overdue Blocker health alerts
                  </button>
                </div>

                {/* 3. Progress and connection templates */}
                <div className="space-y-1">
                  <span className="text-[9px] uppercase font-bold text-emerald-500 tracking-wide block">Progress & connection sections</span>
                  <button 
                    onClick={() => handleAddTemplateWidget("High-level company objective mapping", "connection")}
                    className="w-full text-left p-1.5 hover:bg-[#f5f5f6] text-[11px] font-semibold text-gray-700 rounded transition-colors"
                  >
                    + Objective Map connections
                  </button>
                </div>

                {/* 4. Recommendation templates */}
                <div className="space-y-1">
                  <span className="text-[9px] uppercase font-bold text-amber-500 tracking-wide block">Recommendation analytic sections</span>
                  <button 
                    onClick={() => handleAddTemplateWidget("Resource balance recommendations", "recommendation")}
                    className="w-full text-left p-1.5 hover:bg-[#f5f5f6] text-[11px] font-semibold text-gray-700 rounded transition-colors"
                  >
                    + Load-balancing directives
                  </button>
                </div>

              </div>
            )}
          </div>

        </div>
      </div>

      {/* 2. Main views render based on ViewAs state */}
      {viewAs === 'Dashboard' ? (
        
        /* Render Visual Dashboard widget cards */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {widgets.map((widget, wIdx) => {
            const style = widgetStyles[widget.id] || { color: 'border-l-indigo-500', bg: 'bg-indigo-500/5', iconColor: 'text-indigo-500', icon: 'Activity' };

            return (
              <div 
                key={widget.id} 
                className={`border border-[#e2e2e2] border-l-4 ${style.color} bg-white rounded-xl p-5 shadow-xs flex flex-col justify-between min-h-[300px] hover:shadow-md transition-all group`}
              >
                
                {/* Card header */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <div className={`h-7 w-7 rounded-lg ${style.bg} flex items-center justify-center flex-shrink-0`}>
                      {renderWidgetIcon(style.icon, style.iconColor)}
                    </div>
                    <h3 className="text-xs font-bold text-black group-hover:underline cursor-pointer">{widget.title}</h3>
                  </div>

                  {/* Widget Actions Menu */}
                  <div className="relative">
                    <button 
                      onClick={() => setActiveTripleDotId(activeTripleDotId === widget.id ? null : widget.id)}
                      className="p-1 hover:bg-[#f3f3f4] rounded border border-gray-300 text-gray-500 hover:text-black"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </button>

                    {/* Widgets actions options popover list */}
                    {activeTripleDotId === widget.id && (
                      <div 
                        ref={widgetMenuRef}
                        className="absolute right-0 mt-1.5 w-48 bg-white border border-[#e2e2e2] rounded-lg shadow-xl z-50 py-1.5 flex flex-col text-gray-800 font-normal animate-scale-in"
                      >
                        {widget.type !== 'text' && (
                          <button
                            onClick={() => handleStartEditWidget(widget)}
                            className="w-full text-left px-3.5 py-1.5 text-xs hover:bg-[#f5f5f6] font-semibold text-gray-700 flex items-center gap-2"
                          >
                            <Sliders className="h-3.5 w-3.5 text-gray-400" />
                            <span>Edit chart card</span>
                          </button>
                        )}

                        <button
                          onClick={() => setZoomedWidgetId(widget.id)}
                          className="w-full text-left px-3.5 py-1.5 text-xs hover:bg-[#f5f5f6] font-semibold text-gray-700 flex items-center gap-2"
                        >
                          <Maximize2 className="h-3.5 w-3.5 text-gray-400" />
                          <span>View larger Mode</span>
                        </button>

                        <button
                          onClick={() => setColorPickerWidgetId(widget.id)}
                          className="w-full text-left px-3.5 py-1.5 text-xs hover:bg-[#f5f5f6] font-semibold text-gray-700 flex items-center gap-2"
                        >
                          <Palette className="h-3.5 w-3.5 text-gray-400" />
                          <span>Set Color & Icon</span>
                        </button>

                        <div className="border-t border-[#eeeeee] my-1"></div>

                        {wIdx > 0 && (
                          <button
                            onClick={() => handleMoveWidget(widget.id, 'left')}
                            className="w-full text-left px-3.5 py-1.5 text-xs hover:bg-[#f5f5f6] font-semibold text-gray-700 flex items-center gap-2"
                          >
                            <Move className="h-3.5 w-3.5 text-gray-400" />
                            <span>Move Widget Left</span>
                          </button>
                        )}

                        {wIdx < widgets.length - 1 && (
                          <button
                            onClick={() => handleMoveWidget(widget.id, 'right')}
                            className="w-full text-left px-3.5 py-1.5 text-xs hover:bg-[#f5f5f6] font-semibold text-gray-700 flex items-center gap-2"
                          >
                            <Move className="h-3.5 w-3.5 text-gray-400" />
                            <span>Move Widget Right</span>
                          </button>
                        )}

                        <button
                          onClick={() => handleDeleteWidget(widget.id)}
                          className="w-full text-left px-3.5 py-1.5 text-xs hover:bg-rose-50 font-semibold text-rose-600 flex items-center gap-2"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          <span>Remove widget</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Triple dot color pickers */}
                {colorPickerWidgetId === widget.id && (
                  <div className="mt-4 p-3 bg-[#f8f9fa] border border-gray-200 rounded-lg animate-scale-in flex flex-col gap-2.5">
                    <span className="text-[10px] font-bold text-gray-400 uppercase">Set Color and Icon palette</span>
                    
                    {/* Custom Color rows */}
                    <div className="flex items-center flex-wrap gap-2">
                      {['rose', 'pink', 'emerald', 'amber', 'purple'].map((cName) => {
                        const bgHex = cName === 'emerald' ? 'bg-emerald-500' : cName === 'pink' ? 'bg-pink-500' : cName === 'amber' ? 'bg-amber-500' : cName === 'purple' ? 'bg-purple-500' : 'bg-rose-500';
                        return (
                          <button 
                            key={cName}
                            onClick={() => handleSetWidgetStyle(widget.id, cName, style.icon || 'Activity')} 
                            className={`h-5 w-5 rounded-full border border-white hover:scale-110 transition-transform ${bgHex}`} 
                          />
                        );
                      })}
                    </div>

                    {/* Custom Icon row selection */}
                    <div className="flex items-center gap-2 border-t border-[#eeeeee] pt-2 flex-wrap">
                      {['Activity', 'Users', 'Compass', 'Target', 'AlertCircle'].map((iName) => (
                        <button
                          key={iName}
                          onClick={() => handleSetWidgetStyle(widget.id, colorPickerWidgetId ? style.color.split('-')[2] : 'blue', iName)}
                          className="p-1 border border-gray-300 bg-white hover:bg-gray-50 rounded text-xs text-gray-600 font-semibold"
                        >
                          {iName}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Widget Visual Charts */}
                <div className="flex-1 flex flex-col justify-end py-6 min-h-[140px]">
                  
                  {widget.type === 'bar' && (
                    <div className="flex items-end justify-around h-28 border-b border-[#eeeeee] pb-1.5 px-3">
                      {widget.chartData.map((data, idx) => (
                        <div key={idx} className="flex flex-col items-center gap-1.5 w-16">
                          <div className="w-8 bg-[#3b66c5] rounded-t hover:opacity-85 transition-opacity" style={{ height: `${Math.min(100, data.value * 1.2)}px` }}></div>
                          <span className="text-[9px] text-[#777777] font-semibold text-center truncate w-full">{data.label}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {widget.type === 'doughnut' && (
                    <div className="flex items-center justify-center gap-6 h-28">
                      <div className="relative h-20 w-20 flex items-center justify-center flex-shrink-0">
                        <svg viewBox="0 0 36 36" className="h-full w-full rotate-[-90deg]">
                          <circle cx="18" cy="18" r="15.915" fill="none" stroke="#eee" strokeWidth="4" />
                          <circle cx="18" cy="18" r="15.915" fill="none" stroke="#3b66c5" strokeWidth="4.2" strokeDasharray="50 50" strokeDashoffset="0" />
                          <circle cx="18" cy="18" r="15.915" fill="none" stroke="#ec4899" strokeWidth="4.2" strokeDasharray="30 70" strokeDashoffset="-50" />
                        </svg>
                        <div className="absolute h-10 w-10 bg-white rounded-full flex items-center justify-center text-[10px] font-bold shadow-xs text-gray-800">
                          {widget.chartData.reduce((acc, curr) => acc + curr.value, 0)}
                        </div>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        {widget.chartData.map((data, idx) => (
                          <div key={idx} className="flex items-center gap-1.5 text-[9px] font-bold text-[#5e5e5e]">
                            <div className={`h-2.5 w-2.5 rounded-full ${data.color || 'bg-[#3b66c5]'}`} />
                            <span className="truncate w-24 text-left">{data.label} ({data.value})</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {widget.type === 'line' && (
                    <div className="relative h-28 border-b border-[#eeeeee] pb-1.5 px-3 flex items-end">
                      <svg viewBox="0 0 100 40" className="absolute inset-0 h-full w-full p-2 overflow-visible">
                        <path d="M 10 30 L 50 15 L 90 8" fill="none" stroke="#3b66c5" strokeWidth="2" />
                        <circle cx="10" cy="30" r="2.5" fill="#3b66c5" />
                        <circle cx="50" cy="15" r="2.5" fill="#3b66c5" />
                        <circle cx="90" cy="8" r="2.5" fill="#3b66c5" />
                      </svg>
                      <div className="flex items-center justify-between w-full text-[9px] text-[#777777] font-semibold">
                        {widget.chartData.map((data, idx) => (
                          <span key={idx}>{data.label} ({data.value})</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {widget.type === 'text' && (
                    <div className="p-3 bg-[#fafafb] border border-gray-200 rounded-lg text-xs leading-relaxed text-[#5e5e5e] italic text-left">
                      <p className="font-bold text-gray-800 uppercase tracking-wide text-[9px] mb-1.5 not-italic">Reporting Guidelines:</p>
                      Audit resource capacity balances, resolve bottleneck alerts, and align connected projects with company Objectives.
                    </div>
                  )}

                </div>

                {/* Footer metrics */}
                {widget.type !== 'text' && (
                  <div className="flex items-center justify-between text-[10px] text-gray-400 pt-3 border-t border-[#eeeeee]/60">
                    <span>Group by: {widget.xAxis}</span>
                    <span className="font-bold text-[#5e5e5e] uppercase tracking-wider">{widget.yAxis}</span>
                  </div>
                )}

              </div>
            );
          })}
        </div>
      ) : viewAs === 'Grid' ? (
        
        /* Render Spreadsheet Table grid */
        <div className="border border-[#e2e2e2] rounded-xl bg-white overflow-hidden shadow-xs">
          <table className="w-full text-left border-collapse text-xs select-none">
            <thead>
              <tr className="border-b border-[#e2e2e2] bg-[#fafafb] text-[#5e5e5e] font-semibold h-11">
                <th className="py-2 px-4 w-64">Reporting Card Title</th>
                <th className="py-2 px-4 w-32">Visualization type</th>
                <th className="py-2 px-4 w-40">Group parameter</th>
                <th className="py-2 px-4">Performance index value</th>
              </tr>
            </thead>
            <tbody>
              {widgets.map((widget) => (
                <tr key={widget.id} className="border-b border-[#e2e2e2] last:border-b-0 hover:bg-[#fafafb]/40 h-12">
                  <td className="py-2 px-4 font-bold text-black">{widget.title}</td>
                  <td className="py-2 px-4">
                    <span className="capitalize font-semibold bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-[10px]">{widget.type}</span>
                  </td>
                  <td className="py-2 px-4 text-gray-500 font-semibold">{widget.xAxis || 'Workspace'}</td>
                  <td className="py-2 px-4 text-gray-800 font-medium">
                    {widget.chartData ? `${widget.chartData.length} records aggregated` : "Notes catalog"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        
        /* Render List accordion layout view */
        <div className="space-y-4">
          {widgets.map((widget) => (
            <div key={widget.id} className="border border-[#e2e2e2] rounded-xl bg-white p-4 shadow-xs flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-black">{widget.title}</h4>
                <span className="text-[10px] font-bold text-[#3b66c5] uppercase tracking-wider">{widget.type} card</span>
              </div>
              <p className="text-[11px] text-gray-500">Grouped dynamically by `{widget.xAxis || 'Workspace'}` monitoring `{widget.yAxis || 'Performance'}`.</p>
            </div>
          ))}
        </div>
      )}

      {/* 3. Zoomed Widget Modal */}
      {zoomedWidgetId && (() => {
        const zWidget = widgets.find(w => w.id === zoomedWidgetId);
        if (!zWidget) return null;
        return (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-6 z-50 animate-fade-in select-none">
            <div className="bg-white rounded-xl border border-[#e2e2e2] shadow-2xl w-full max-w-2xl p-6 relative flex flex-col justify-between gap-6 text-gray-800">
              
              <button 
                onClick={() => setZoomedWidgetId(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-black p-1 hover:bg-[#f3f3f4] rounded"
              >
                <X className="h-5 w-5" />
              </button>

              <h3 className="text-base font-bold text-black flex items-center gap-2">
                <Maximize2 className="h-4.5 w-4.5 text-[#3b66c5]" />
                <span>{zWidget.title} (View Larger Mode)</span>
              </h3>

              <div className="h-64 border border-gray-200 bg-[#fafafb] rounded-lg flex items-center justify-center p-6">
                {zWidget.type === 'bar' && (
                  <div className="flex items-end justify-around w-full max-w-md h-48 border-b border-[#eeeeee] pb-2 px-6">
                    {zWidget.chartData.map((data, idx) => (
                      <div key={idx} className="flex flex-col items-center gap-2 w-24">
                        <div className="w-12 bg-[#3b66c5] rounded-t" style={{ height: `${data.value * 1.5}px` }}></div>
                        <span className="text-[10px] font-bold text-[#1a1c1c] text-center truncate w-full">{data.label}</span>
                      </div>
                    ))}
                  </div>
                )}
                {zWidget.type === 'doughnut' && (
                  <div className="flex items-center justify-around w-full max-w-md gap-6">
                    <div className="relative h-32 w-32 flex items-center justify-center">
                      <svg viewBox="0 0 36 36" className="h-full w-full rotate-[-90deg]">
                        <circle cx="18" cy="18" r="15.915" fill="none" stroke="#eee" strokeWidth="3.5" />
                        <circle cx="18" cy="18" r="15.915" fill="none" stroke="#3b66c5" strokeWidth="3.8" strokeDasharray="50 50" strokeDashoffset="0" />
                        <circle cx="18" cy="18" r="15.915" fill="none" stroke="#ec4899" strokeWidth="3.8" strokeDasharray="30 70" strokeDashoffset="-50" />
                      </svg>
                    </div>
                    <div className="flex flex-col gap-2">
                      {zWidget.chartData.map((data, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs font-bold text-[#5e5e5e]">
                          <div className={`h-3 w-3 rounded-full ${data.color || 'bg-[#3b66c5]'}`} />
                          <span>{data.label}: {data.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {zWidget.type === 'line' && (
                  <div className="relative w-full max-w-md h-44 border-b border-[#eeeeee] pb-2 px-6 flex items-end">
                    <svg viewBox="0 0 100 40" className="absolute inset-0 h-full w-full p-6 overflow-visible">
                      <path d="M 10 30 L 50 15 L 90 8" fill="none" stroke="#3b66c5" strokeWidth="3" />
                      <circle cx="10" cy="30" r="3.5" fill="#3b66c5" />
                      <circle cx="50" cy="15" r="3.5" fill="#3b66c5" />
                      <circle cx="90" cy="8" r="3.5" fill="#3b66c5" />
                    </svg>
                  </div>
                )}
                {zWidget.type === 'text' && (
                  <div className="p-4 bg-white border border-[#e2e2e2] rounded-lg text-xs leading-relaxed text-gray-600 w-full">
                    Ensure connected objectives and resourcing loads align completely.
                  </div>
                )}
              </div>

              <div className="flex justify-end pt-2 border-t border-[#eeeeee]">
                <button 
                  onClick={() => setZoomedWidgetId(null)}
                  className="px-4 py-2 bg-black text-white text-xs font-bold rounded shadow-sm hover:bg-neutral-800"
                >
                  Close View
                </button>
              </div>

            </div>
          </div>
        );
      })()}

      {/* 4. Edit Widget popup */}
      {editingWidgetId && (() => {
        const eWidget = widgets.find(w => w.id === editingWidgetId);
        if (!eWidget) return null;

        return (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-6 z-50 animate-fade-in select-none">
            <div className="bg-white rounded-xl border border-[#e2e2e2] shadow-2xl w-full max-w-md p-6 relative flex flex-col gap-5 text-gray-800">
              
              <button 
                onClick={() => setEditingWidgetId(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-black p-1 hover:bg-[#f3f3f4] rounded"
              >
                <X className="h-5 w-5" />
              </button>

              <h3 className="text-base font-bold text-black flex items-center gap-2">
                <Sliders className="h-4.5 w-4.5 text-[#3b66c5]" />
                <span>Edit Reporting chart Widget</span>
              </h3>

              <form onSubmit={handleSaveWidgetEdits} className="space-y-4">
                <div>
                  <label className="block text-[9px] uppercase font-bold text-gray-400 mb-1">Widget Title</label>
                  <input 
                    type="text"
                    required
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full text-xs p-2 border border-gray-300 rounded outline-none focus:border-[#3b66c5] text-black"
                  />
                </div>

                <div>
                  <label className="block text-[9px] uppercase font-bold text-gray-400 mb-1">Visualization type</label>
                  <select
                    value={editChartType}
                    onChange={(e) => setEditChartType(e.target.value)}
                    className="w-full text-xs p-2 border border-gray-300 bg-white rounded outline-none focus:border-[#3b66c5] text-black font-semibold"
                  >
                    <option value="bar">Bar Chart</option>
                    <option value="doughnut">Doughnut Chart</option>
                    <option value="line">Line Chart</option>
                  </select>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-[#eeeeee] mt-6">
                  <button
                    type="button"
                    onClick={() => setEditingWidgetId(null)}
                    className="px-3 py-1.5 border border-gray-300 text-xs font-semibold rounded text-gray-500 hover:bg-[#f3f3f4]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-[#3b66c5] hover:bg-[#2e55aa] text-white text-xs font-bold rounded shadow-xs"
                  >
                    Save Specifications
                  </button>
                </div>
              </form>

            </div>
          </div>
        );
      })()}



      {/* Floating Info Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-black text-white px-4 py-2.5 rounded shadow-lg text-xs font-semibold z-50 animate-fade-in flex items-center gap-2">
          <Activity className="w-3.5 h-3.5 text-yellow-400" />
          <span>{toastMessage}</span>
        </div>
      )}

    </div>
  );
};

export default StrategyReportingView;
