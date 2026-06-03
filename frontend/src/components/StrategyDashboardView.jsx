import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  BarChart3, 
  PieChart, 
  LineChart, 
  Plus, 
  X, 
  Check, 
  MoreHorizontal, 
  Maximize2, 
  Sliders, 
  Palette, 
  Activity,
  Sparkles,
  Link2,
  Trash2,
  Move,
  FileText,
  AlertTriangle,
  ChevronDown,
  ChevronRight
} from 'lucide-react';

const StrategyDashboardView = ({ dashboardType = 'my-organization', projects = [], tasks = [] }) => {
  // Dashboard Header actions state (favorite star and chevron dropdown)
  const [isFavorite, setIsFavorite] = useState(false);
  const [isDashboardMenuOpen, setIsDashboardMenuOpen] = useState(false);
  const [isEditingDetails, setIsEditingDetails] = useState(false);
  const [dashboardName, setDashboardName] = useState(dashboardType.replace('-', ' '));
  const [dashboardDesc, setDashboardDesc] = useState(
    dashboardType === 'my-organization' ? "Track organizational roadmap achievements, milestones, and high-level team resourcing status." :
    dashboardType === 'my-impact' ? "Audit your personal contributions, task completion velocity, and strategic key results alignment." :
    "Configure a customized workspace reporting dashboard. Add visual metrics, chart cards, or outline notes."
  );
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

  // Add Widget Dropdown Popover Visibility
  const [isAddWidgetOpen, setIsAddWidgetOpen] = useState(false);
  
  // Chart action states
  const [activeTripleDotId, setActiveTripleDotId] = useState(null); // widgetId or null
  const [zoomedWidgetId, setZoomedWidgetId] = useState(null); // widgetId or null
  const [editingWidgetId, setEditingWidgetId] = useState(null); // widgetId or null
  const [colorPickerWidgetId, setColorPickerWidgetId] = useState(null); // widgetId or null
  const [toastMessage, setToastMessage] = useState('');

  // Styles customized dynamically by Set Color & Icon
  const [widgetStyles, setWidgetStyles] = useState({
    dash_1: { color: 'border-l-[#3b66c5]', bg: 'bg-[#3b66c5]/5', iconColor: 'text-[#3b66c5]' },
    dash_2: { color: 'border-l-pink-500', bg: 'bg-pink-500/5', iconColor: 'text-pink-500' },
    dash_3: { color: 'border-l-emerald-500', bg: 'bg-emerald-500/5', iconColor: 'text-emerald-500' }
  });

  // Default Dashboard widgets seeded based on dashboardType
  const [widgets, setWidgets] = useState(() => {
    if (dashboardType === 'my-organization') {
      return [
        {
          id: 'dash_1',
          title: 'Organization Milestone Achievements',
          type: 'bar',
          xAxis: 'Milestone',
          yAxis: 'Completion Rate (%)',
          chartData: [
            { label: 'Core V2 Launch', value: 65 },
            { label: 'Grayscale Theme', value: 100 },
            { label: 'Scale Audits', value: 15 }
          ]
        },
        {
          id: 'dash_2',
          title: 'Resource Allocation by Department',
          type: 'doughnut',
          xAxis: 'Department',
          yAxis: 'Allocated Hours',
          chartData: [
            { label: 'Engineering', value: 35, color: 'bg-[#3b66c5]' },
            { label: 'Design', value: 39, color: 'bg-pink-500' },
            { label: 'Marketing', value: 23, color: 'bg-emerald-500' }
          ]
        }
      ];
    } else if (dashboardType === 'my-impact') {
      return [
        {
          id: 'dash_1',
          title: 'My Strategic Contribution Rate',
          type: 'line',
          xAxis: 'Quarter',
          yAxis: 'Impact Rating',
          chartData: [
            { label: 'Q1', value: 40 },
            { label: 'Q2', value: 75 },
            { label: 'Q3', value: 90 }
          ]
        },
        {
          id: 'dash_3',
          title: 'My Incomplete Workloads by Priority',
          type: 'doughnut',
          xAxis: 'Priority',
          yAxis: 'Task Count',
          chartData: [
            { label: 'High', value: 2, color: 'bg-rose-500' },
            { label: 'Medium', value: 1, color: 'bg-amber-500' }
          ]
        }
      ];
    }
    // New empty dashboard
    return [];
  });

  // Edit Widget spec states
  const [editTitle, setEditTitle] = useState('');
  const [editChartType, setEditChartType] = useState('bar');
  const [editXAxis, setEditXAxis] = useState('Project');

  // Refs for clicking outside to close
  const addWidgetRef = useRef(null);
  const widgetMenuRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (addWidgetRef.current && !addWidgetRef.current.contains(e.target)) {
        setIsAddWidgetOpen(false);
      }
      if (widgetMenuRef.current && !widgetMenuRef.current.contains(e.target)) {
        setActiveTripleDotId(null);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Sync state if dashboardType changes
  useEffect(() => {
    setDashboardName(dashboardType.replace('-', ' '));
    setDashboardDesc(
      dashboardType === 'my-organization' ? "Track organizational roadmap achievements, milestones, and high-level team resourcing status." :
      dashboardType === 'my-impact' ? "Audit your personal contributions, task completion velocity, and strategic key results alignment." :
      "Configure a customized workspace reporting dashboard. Add visual metrics, chart cards, or outline notes."
    );

    if (dashboardType === 'my-organization') {
      setWidgets([
        {
          id: 'dash_1',
          title: 'Organization Milestone Achievements',
          type: 'bar',
          xAxis: 'Milestone',
          yAxis: 'Completion Rate (%)',
          chartData: [
            { label: 'Core V2 Launch', value: 65 },
            { label: 'Grayscale Theme', value: 100 },
            { label: 'Scale Audits', value: 15 }
          ]
        },
        {
          id: 'dash_2',
          title: 'Resource Allocation by Department',
          type: 'doughnut',
          xAxis: 'Department',
          yAxis: 'Allocated Hours',
          chartData: [
            { label: 'Engineering', value: 35, color: 'bg-[#3b66c5]' },
            { label: 'Design', value: 39, color: 'bg-pink-500' },
            { label: 'Marketing', value: 23, color: 'bg-emerald-500' }
          ]
        }
      ]);
    } else if (dashboardType === 'my-impact') {
      setWidgets([
        {
          id: 'dash_1',
          title: 'My Strategic Contribution Rate',
          type: 'line',
          xAxis: 'Quarter',
          yAxis: 'Impact Rating',
          chartData: [
            { label: 'Q1', value: 40 },
            { label: 'Q2', value: 75 },
            { label: 'Q3', value: 90 }
          ]
        },
        {
          id: 'dash_3',
          title: 'My Incomplete Workloads by Priority',
          type: 'doughnut',
          xAxis: 'Priority',
          yAxis: 'Task Count',
          chartData: [
            { label: 'High', value: 2, color: 'bg-rose-500' },
            { label: 'Medium', value: 1, color: 'bg-amber-500' }
          ]
        }
      ]);
    } else {
      setWidgets([]);
    }
  }, [dashboardType]);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Add Widget options handler
  const handleAddWidgetOption = (title, type) => {
    const newId = `dash_${Date.now()}`;
    const newWidget = {
      id: newId,
      title: title,
      type: type, // 'bar' | 'doughnut' | 'line' | 'text'
      xAxis: 'Connected objective',
      yAxis: 'Completion rate',
      chartData: type === 'text' ? null : [
        { label: 'Design Overhaul', value: 80, color: 'bg-pink-500' },
        { label: 'Security sync', value: 45, color: 'bg-blue-500' }
      ]
    };

    setWidgets([...widgets, newWidget]);
    setWidgetStyles(prev => ({
      ...prev,
      [newId]: { color: 'border-l-pink-500', bg: 'bg-pink-500/5', iconColor: 'text-pink-500' }
    }));
    setIsAddWidgetOpen(false);
    triggerToast(`Added new ${type} widget: "${title}"!`);
  };

  // Delete widget
  const handleDeleteWidget = (widgetId) => {
    setWidgets(prev => prev.filter(w => w.id !== widgetId));
    triggerToast("Widget removed from dashboard.");
  };

  // Edit Widget Handler
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

  // Set Color Styles
  const handleSetWidgetStyle = (widgetId, colorName, hexCode) => {
    let styleObj = { color: 'border-l-blue-500', bg: 'bg-blue-500/5', iconColor: 'text-blue-500' };
    if (colorName === 'emerald') styleObj = { color: 'border-l-emerald-500', bg: 'bg-emerald-500/5', iconColor: 'text-emerald-500' };
    else if (colorName === 'pink') styleObj = { color: 'border-l-pink-500', bg: 'bg-pink-500/5', iconColor: 'text-pink-500' };
    else if (colorName === 'amber') styleObj = { color: 'border-l-amber-500', bg: 'bg-amber-500/5', iconColor: 'text-amber-500' };
    else if (colorName === 'purple') styleObj = { color: 'border-l-purple-500', bg: 'bg-purple-500/5', iconColor: 'text-purple-500' };
    
    setWidgetStyles(prev => ({ ...prev, [widgetId]: styleObj }));
    setColorPickerWidgetId(null);
    setActiveTripleDotId(null);
  };

  // Move Swaps
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

  return (
    <div className="flex-1 overflow-y-auto bg-white px-8 py-8 space-y-8 select-none font-sans relative">
      
      {/* 1. Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-[#e2e2e2] gap-4" ref={dashboardMenuRef}>
        <div className="space-y-1 text-left">
          <div className="flex items-center gap-2 relative">
            <h2 className={`text-2xl font-bold tracking-tight capitalize ${
              dashboardColor === 'pink' ? 'text-pink-600' :
              dashboardColor === 'emerald' ? 'text-emerald-600' :
              dashboardColor === 'amber' ? 'text-amber-600' :
              dashboardColor === 'purple' ? 'text-purple-600' :
              'text-[#3b66c5]'
            }`}>
              {dashboardName}
            </h2>

            {/* Chevron down button and favorite star next to it (Matches Asana/screenshot) */}
            <div className="flex items-center gap-1.5">
              <button 
                onClick={() => setIsDashboardMenuOpen(!isDashboardMenuOpen)}
                className="p-1 hover:bg-[#f3f3f4] rounded text-gray-500 hover:text-black transition-colors"
                title="Dashboard Actions Menu"
              >
                <ChevronDown className="h-4.5 w-4.5" />
              </button>
              
              <button 
                onClick={() => {
                  setIsFavorite(!isFavorite);
                  triggerToast(isFavorite ? "Removed from favorites" : "Added to favorites");
                }}
                className="p-1 hover:bg-[#f3f3f4] rounded transition-colors"
                title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
              >
                <span className={`text-sm leading-none ${isFavorite ? 'text-amber-500' : 'text-gray-400'}`}>
                  {isFavorite ? '★' : '☆'}
                </span>
              </button>
            </div>

            {/* Dashboard Actions Menu Dropdown Popover */}
            {isDashboardMenuOpen && (
              <div className="absolute left-0 mt-8 top-0 w-56 bg-white border border-[#e2e2e2] rounded-lg shadow-xl z-50 py-1.5 flex flex-col text-[#1a1c1c] font-normal animate-scale-in text-xs">
                
                {/* Edit dashboard details */}
                <button
                  type="button"
                  onClick={() => {
                    setIsEditingDetails(true);
                    setIsDashboardMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-[#f5f5f6] flex items-center gap-2.5 font-semibold text-[#1a1c1c]"
                >
                  <Sliders className="h-4 w-4 text-gray-500" />
                  <span>Edit dashboard details</span>
                </button>

                {/* Set color */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsSetColorOpen(!isSetColorOpen)}
                    className="w-full text-left px-4 py-2 hover:bg-[#f5f5f6] flex items-center justify-between font-semibold text-[#1a1c1c]"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`h-4.5 w-4.5 rounded ${
                        dashboardColor === 'pink' ? 'bg-pink-500' :
                        dashboardColor === 'emerald' ? 'bg-emerald-500' :
                        dashboardColor === 'amber' ? 'bg-amber-500' :
                        dashboardColor === 'purple' ? 'bg-purple-500' :
                        'bg-[#3b66c5]'
                      }`} />
                      <span>Set color</span>
                    </div>
                    <ChevronRight className="h-3.5 w-3.5 text-gray-400" />
                  </button>

                  {/* Sub-menu color picker */}
                  {isSetColorOpen && (
                    <div className="absolute left-full top-0 ml-1 w-36 bg-white border border-[#e2e2e2] rounded-lg shadow-lg z-50 py-1 flex flex-col animate-scale-in">
                      {['blue', 'pink', 'emerald', 'amber', 'purple'].map((color) => (
                        <button
                          key={color}
                          type="button"
                          onClick={() => {
                            setDashboardColor(color);
                            setIsSetColorOpen(false);
                            setIsDashboardMenuOpen(false);
                            triggerToast(`Theme set to ${color}`);
                          }}
                          className="w-full text-left px-3 py-1.5 hover:bg-[#f5f5f6] text-[11px] capitalize font-semibold flex items-center gap-2"
                        >
                          <div className={`h-3 w-3 rounded-full ${
                            color === 'pink' ? 'bg-pink-500' :
                            color === 'emerald' ? 'bg-emerald-500' :
                            color === 'amber' ? 'bg-amber-500' :
                            color === 'purple' ? 'bg-purple-500' :
                            'bg-[#3b66c5]'
                          }`} />
                          <span>{color}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Copy dashboard link */}
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="w-full text-left px-4 py-2 hover:bg-[#f5f5f6] flex items-center gap-2.5 font-semibold text-[#1a1c1c]"
                >
                  <Link2 className="h-4 w-4 text-gray-500" />
                  <span>Copy dashboard link</span>
                </button>

                {/* Duplicate */}
                <button
                  type="button"
                  onClick={handleDuplicate}
                  className="w-full text-left px-4 py-2 hover:bg-[#f5f5f6] flex items-center gap-2.5 font-semibold text-[#1a1c1c]"
                >
                  <Plus className="h-4 w-4 text-gray-500" />
                  <span>Duplicate</span>
                </button>

                <div className="border-t border-[#eeeeee] my-1"></div>

                {/* Delete dashboard */}
                <button
                  type="button"
                  onClick={handleDeleteDashboard}
                  className="w-full text-left px-4 py-2 hover:bg-rose-50 text-rose-600 flex items-center gap-2.5 font-semibold"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Delete dashboard</span>
                </button>

              </div>
            )}
          </div>

          <p className="text-xs text-[#777777] mt-0.5">
            {dashboardDesc}
          </p>
        </div>

        {/* Add Widget dropdown popover */}
        <div className="relative" ref={addWidgetRef}>
          <button
            onClick={() => setIsAddWidgetOpen(!isAddWidgetOpen)}
            className="flex items-center gap-1.5 px-4 py-2 bg-black text-white hover:bg-neutral-800 text-xs font-bold rounded shadow-xs"
          >
            <Plus className="h-4 w-4" />
            <span>Add Widget</span>
          </button>

          {/* Add Widget options popover list (Matches photo filenames) */}
          {isAddWidgetOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white border border-[#e2e2e2] rounded-xl shadow-2xl z-50 p-4 flex flex-col gap-4 animate-scale-in text-left text-[#1a1c1c]">
              <div className="flex items-center justify-between border-b border-[#eeeeee] pb-2 mb-1">
                <span className="text-[10px] font-bold uppercase text-gray-400">Add Widget Options</span>
                <button onClick={() => setIsAddWidgetOpen(false)} className="text-gray-400 hover:text-black">
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Template chart clicked */}
              <div className="space-y-1">
                <span className="text-[9px] uppercase font-bold text-gray-400">Template Charts</span>
                <button 
                  onClick={() => handleAddWidgetOption("Connected Goals Achievement Status", "doughnut")}
                  className="w-full text-left p-1.5 hover:bg-[#f5f5f6] text-[11px] font-semibold rounded text-black transition-colors"
                >
                  + Connected Goals Status Chart
                </button>
              </div>

              {/* Custom charts */}
              <div className="space-y-1">
                <span className="text-[9px] uppercase font-bold text-gray-400">Custom Charts</span>
                <button 
                  onClick={() => handleAddWidgetOption("Milestone Performance", "bar")}
                  className="w-full text-left p-1.5 hover:bg-[#f5f5f6] text-[11px] font-semibold rounded text-black transition-colors"
                >
                  + Custom Bar Chart
                </button>
                <button 
                  onClick={() => handleAddWidgetOption("Task Completion Growth", "line")}
                  className="w-full text-left p-1.5 hover:bg-[#f5f5f6] text-[11px] font-semibold rounded text-black transition-colors"
                >
                  + Custom Line Chart
                </button>
              </div>

              {/* Rich text card widget */}
              <div className="space-y-1">
                <span className="text-[9px] uppercase font-bold text-gray-400">Text Mappings</span>
                <button 
                  onClick={() => handleAddWidgetOption("Dashboard Outline Guidelines", "text")}
                  className="w-full text-left p-1.5 hover:bg-[#f5f5f6] text-[11px] font-semibold rounded text-black transition-colors"
                >
                  + Outline Notes (Text block)
                </button>
              </div>

            </div>
          )}
        </div>
      </div>

      {/* 2. Main Dashboard Widgets Grid Layout */}
      {widgets.length === 0 ? (
        <div className="py-24 text-center border-2 border-dashed border-[#e2e2e2] bg-[#fafafb] rounded-xl max-w-xl mx-auto flex flex-col items-center justify-center p-6 gap-3">
          <AlertTriangle className="h-8 w-8 text-gray-400" />
          <h3 className="text-sm font-bold text-black uppercase tracking-wider">Configure Dashboard widgets</h3>
          <p className="text-xs text-[#777777] max-w-sm">This dashboard does not contain any visual widgets. Start adding template charts or customizable text cards by clicking "+ Add Widget"!</p>
          <button 
            onClick={() => setIsAddWidgetOpen(true)}
            className="px-4 py-2 bg-black text-white hover:bg-neutral-800 text-xs font-bold rounded shadow-xs mt-2"
          >
            Show Widget Options Downbar
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {widgets.map((widget, wIdx) => {
            const style = widgetStyles[widget.id] || { color: 'border-l-indigo-500', bg: 'bg-indigo-500/5', iconColor: 'text-indigo-500' };

            return (
              <div 
                key={widget.id} 
                className={`border border-[#e2e2e2] border-l-4 ${style.color} bg-white rounded-xl p-5 shadow-xs flex flex-col justify-between min-h-[300px] relative hover:shadow-md transition-all group`}
              >
                
                {/* Header */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <div className={`h-7 w-7 rounded-lg ${style.bg} ${style.iconColor} flex items-center justify-center flex-shrink-0`}>
                      {widget.type === 'bar' && <BarChart3 className="h-4 w-4" />}
                      {widget.type === 'doughnut' && <PieChart className="h-4 w-4" />}
                      {widget.type === 'line' && <LineChart className="h-4 w-4" />}
                      {widget.type === 'text' && <FileText className="h-4 w-4" />}
                    </div>
                    <h3 className="text-xs font-bold text-black group-hover:underline cursor-pointer">{widget.title}</h3>
                  </div>

                  {/* Actions Dropdown triggers */}
                  <div className="relative">
                    <button 
                      onClick={() => setActiveTripleDotId(activeTripleDotId === widget.id ? null : widget.id)}
                      className="p-1 hover:bg-[#f3f3f4] rounded border border-gray-300 text-gray-500 hover:text-black"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </button>

                    {/* Active Triple dot dropdown options list (Matches filenames) */}
                    {activeTripleDotId === widget.id && (
                      <div 
                        ref={widgetMenuRef}
                        className="absolute right-0 mt-1.5 w-48 bg-white border border-[#e2e2e2] rounded-lg shadow-xl z-50 py-1.5 flex flex-col text-[#1a1c1c] font-normal animate-scale-in"
                      >
                        {widget.type !== 'text' && (
                          <button
                            onClick={() => handleStartEditWidget(widget)}
                            className="w-full text-left px-3.5 py-1.5 text-xs hover:bg-[#f5f5f6] font-semibold text-black flex items-center gap-2"
                          >
                            <Sliders className="h-3.5 w-3.5 text-gray-400" />
                            <span>Edit chart</span>
                          </button>
                        )}

                        <button
                          onClick={() => setZoomedWidgetId(widget.id)}
                          className="w-full text-left px-3.5 py-1.5 text-xs hover:bg-[#f5f5f6] font-semibold text-black flex items-center gap-2"
                        >
                          <Maximize2 className="h-3.5 w-3.5 text-gray-400" />
                          <span>View larger</span>
                        </button>

                        <button
                          onClick={() => setColorPickerWidgetId(widget.id)}
                          className="w-full text-left px-3.5 py-1.5 text-xs hover:bg-[#f5f5f6] font-semibold text-black flex items-center gap-2"
                        >
                          <Palette className="h-3.5 w-3.5 text-gray-400" />
                          <span>Set color & icon</span>
                        </button>

                        <div className="border-t border-[#eeeeee] my-1"></div>

                        {/* Move switches */}
                        {wIdx > 0 && (
                          <button
                            onClick={() => handleMoveWidget(widget.id, 'left')}
                            className="w-full text-left px-3.5 py-1.5 text-xs hover:bg-[#f5f5f6] font-semibold text-black flex items-center gap-2"
                          >
                            <Move className="h-3.5 w-3.5 text-gray-400" />
                            <span>Move Left</span>
                          </button>
                        )}

                        {wIdx < widgets.length - 1 && (
                          <button
                            onClick={() => handleMoveWidget(widget.id, 'right')}
                            className="w-full text-left px-3.5 py-1.5 text-xs hover:bg-[#f5f5f6] font-semibold text-black flex items-center gap-2"
                          >
                            <Move className="h-3.5 w-3.5 text-gray-400" />
                            <span>Move Right</span>
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

                {/* Color picker sub-dropdown */}
                {colorPickerWidgetId === widget.id && (
                  <div className="mt-4 p-3 bg-[#f8f9fa] border border-[#e2e2e2] rounded-lg animate-scale-in flex flex-col gap-2">
                    <span className="text-[10px] font-bold text-gray-400 uppercase">Set Color and Icon palette</span>
                    <div className="flex items-center flex-wrap gap-2">
                      <button onClick={() => handleSetWidgetStyle(widget.id, 'blue', '#3b66c5')} className="h-5 w-5 rounded-full bg-[#3b66c5] border border-white hover:scale-110 transition-transform" />
                      <button onClick={() => handleSetWidgetStyle(widget.id, 'pink', '#ec4899')} className="h-5 w-5 rounded-full bg-pink-500 border border-white hover:scale-110 transition-transform" />
                      <button onClick={() => handleSetWidgetStyle(widget.id, 'emerald', '#10b981')} className="h-5 w-5 rounded-full bg-emerald-500 border border-white hover:scale-110 transition-transform" />
                      <button onClick={() => handleSetWidgetStyle(widget.id, 'amber', '#f59e0b')} className="h-5 w-5 rounded-full bg-amber-500 border border-white hover:scale-110 transition-transform" />
                      <button onClick={() => handleSetWidgetStyle(widget.id, 'purple', '#8b5cf6')} className="h-5 w-5 rounded-full bg-purple-500 border border-white hover:scale-110 transition-transform" />
                    </div>
                  </div>
                )}

                {/* Widget Content Visualization */}
                <div className="flex-1 flex flex-col justify-end py-6 min-h-[140px]">
                  
                  {widget.type === 'bar' && (
                    <div className="flex items-end justify-around h-28 border-b border-[#eeeeee] pb-1.5 px-3">
                      {widget.chartData.map((data, idx) => (
                        <div key={idx} className="flex flex-col items-center gap-1.5 w-16">
                          <div className="w-8 bg-[#3b66c5] rounded-t hover:opacity-85 transition-opacity" style={{ height: `${data.value * 1}px` }}></div>
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
                        <div className="absolute h-10 w-10 bg-white rounded-full flex items-center justify-center text-[10px] font-bold shadow-xs">
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
                    <div className="p-3 bg-[#fafafb] border border-[#e2e2e2] rounded-lg text-xs leading-relaxed text-[#5e5e5e] italic">
                      <p className="font-bold text-[#1a1c1c] uppercase tracking-wide text-[9px] mb-1.5 not-italic">Collaborative Guidelines:</p>
                      Jot down strategic directives, connection scopes, and weekly outlines directly here inside your dashboard notes widget. Auto-saves dynamically.
                    </div>
                  )}

                </div>

                {/* Footer */}
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
      )}

      {/* 3. Zoomed Widget Modal overlay (View Larger Option) */}
      {zoomedWidgetId && (() => {
        const zWidget = widgets.find(w => w.id === zoomedWidgetId);
        if (!zWidget) return null;
        return (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-6 z-50 animate-fade-in select-none">
            <div className="bg-white rounded-xl border border-[#e2e2e2] shadow-2xl w-full max-w-2xl p-6 relative flex flex-col justify-between gap-6">
              
              <button 
                onClick={() => setZoomedWidgetId(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-black p-1 hover:bg-[#f3f3f4] rounded"
              >
                <X className="h-5 w-5" />
              </button>

              <div>
                <h3 className="text-base font-bold text-black flex items-center gap-2">
                  <Maximize2 className="h-4.5 w-4.5 text-[#3b66c5]" />
                  <span>{zWidget.title} (View Larger Mode)</span>
                </h3>
              </div>

              {/* Large Chart Area */}
              <div className="h-64 border border-[#e2e2e2] bg-[#fafafb] rounded-lg flex items-center justify-center p-6">
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
                    </svg>
                  </div>
                )}
                {zWidget.type === 'text' && (
                  <div className="p-4 bg-white border border-[#e2e2e2] rounded-lg text-xs leading-relaxed text-[#5e5e5e] italic w-full">
                    <p className="font-bold text-[#1a1c1c] uppercase tracking-wide text-[10px] mb-1.5 not-italic">Dashboard Guideline directives:</p>
                    Ensure your team aligns connected projects with organizational milestones directly.
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

      {/* 4. Edit Chart Modal Popover (Scrolled Up/Down Popup details) */}
      {editingWidgetId && (() => {
        const eWidget = widgets.find(w => w.id === editingWidgetId);
        if (!eWidget) return null;

        return (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-6 z-50 animate-fade-in select-none">
            <div className="bg-white rounded-xl border border-[#e2e2e2] shadow-2xl w-full max-w-md p-6 relative flex flex-col gap-5">
              
              <button 
                onClick={() => setEditingWidgetId(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-black p-1 hover:bg-[#f3f3f4] rounded"
              >
                <X className="h-5 w-5" />
              </button>

              <div>
                <h3 className="text-base font-bold text-black flex items-center gap-2">
                  <Sliders className="h-4.5 w-4.5 text-[#3b66c5]" />
                  <span>Edit Dashboard Widget</span>
                </h3>
              </div>

              <form onSubmit={handleSaveWidgetEdits} className="space-y-4">
                
                {/* Title */}
                <div>
                  <label className="block text-[9px] uppercase font-bold text-gray-400 mb-1">Widget Title</label>
                  <input 
                    type="text"
                    required
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full text-xs p-2 border border-[#c6c6c6] bg-white rounded outline-none focus:border-[#3b66c5]"
                  />
                </div>

                {/* Chart Type */}
                <div>
                  <label className="block text-[9px] uppercase font-bold text-gray-400 mb-1">Visualization Type</label>
                  <select
                    value={editChartType}
                    onChange={(e) => setEditChartType(e.target.value)}
                    className="w-full text-xs p-2 border border-[#c6c6c6] bg-white rounded outline-none focus:border-[#3b66c5]"
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
                    className="px-3 py-1.5 border border-[#c6c6c6] text-xs font-semibold rounded text-[#5e5e5e] hover:bg-[#f3f3f4]"
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

      {/* 5. Edit Dashboard Details Modal */}
      {isEditingDetails && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-6 z-50 animate-fade-in select-none">
          <div className="bg-white rounded-xl border border-[#e2e2e2] shadow-2xl w-full max-w-md p-6 relative flex flex-col gap-4 text-gray-800 text-left">
            <button 
              onClick={() => setIsEditingDetails(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-black p-1 hover:bg-[#f3f3f4] rounded"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-base font-bold text-black flex items-center gap-2">
              <Sliders className="h-4.5 w-4.5 text-[#3b66c5]" />
              <span>Edit Dashboard Details</span>
            </h3>

            <form onSubmit={(e) => { e.preventDefault(); setIsEditingDetails(false); triggerToast("Dashboard details saved!"); }} className="space-y-4">
              <div>
                <label className="block text-[9px] uppercase font-bold text-gray-500 mb-1">Dashboard Name</label>
                <input 
                  type="text"
                  required
                  value={dashboardName}
                  onChange={(e) => setDashboardName(e.target.value)}
                  className="w-full text-xs p-2 border border-gray-300 rounded outline-none focus:border-[#3b66c5] text-black"
                />
              </div>

              <div>
                <label className="block text-[9px] uppercase font-bold text-gray-500 mb-1">Description / Sub-bar</label>
                <textarea 
                  value={dashboardDesc}
                  onChange={(e) => setDashboardDesc(e.target.value)}
                  rows="3"
                  className="w-full text-xs p-2 border border-gray-300 rounded outline-none focus:border-[#3b66c5] text-black"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#eeeeee]">
                <button
                  type="button"
                  onClick={() => setIsEditingDetails(false)}
                  className="px-3 py-1.5 border border-gray-300 text-xs font-semibold rounded text-gray-500 hover:bg-[#f3f3f4]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#3b66c5] hover:bg-[#2e55aa] text-white text-xs font-bold rounded shadow-xs"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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

export default StrategyDashboardView;
