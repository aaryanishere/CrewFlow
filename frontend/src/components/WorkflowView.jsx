import React, { useState, useEffect } from 'react';
import { 
  Search, Plus, AlignLeft, Hash, Calendar, Users, 
  ChevronDown, ArrowRight, X, Trash2, Edit3, Settings, 
  Check, Play, ArrowUpDown, HelpCircle, CheckSquare, 
  GitMerge, Sliders, ToggleLeft, ToggleRight, Sparkles,
  Layers, Copy, Kanban, ClipboardList, ChevronLeft,
  Layout, Eye, User, Lock, Globe, CheckCircle2, MessageSquare,
  FileText, ArrowUp, ArrowDown, BarChart2, ListTodo, FileSpreadsheet, PieChart,
  Zap, Bell, Upload, Link2, CheckCircle, Inbox, Bug
} from 'lucide-react';

// elegant pastel colors mapping for dropdown/multi-select option pills
const COLOR_SWATCHES = [
  { id: 'red', name: 'Soft Coral', bg: 'bg-[#fee2e2]', text: 'text-[#991b1b]', border: 'border-[#fca5a5]', hex: '#fee2e2' },
  { id: 'amber', name: 'Sunset Amber', bg: 'bg-[#fef3c7]', text: 'text-[#92400e]', border: 'border-[#fcd34d]', hex: '#fef3c7' },
  { id: 'emerald', name: 'Mint Leaf', bg: 'bg-[#d1fae5]', text: 'text-[#065f46]', border: 'border-[#6ee7b7]', hex: '#d1fae5' },
  { id: 'blue', name: 'Royal Ice', bg: 'bg-[#dbeafe]', text: 'text-[#1e40af]', border: 'border-[#93c5fd]', hex: '#dbeafe' },
  { id: 'violet', name: 'Lavender Dusk', bg: 'bg-[#ede9fe]', text: 'text-[#5b21b6]', border: 'border-[#c084fc]', hex: '#ede9fe' },
  { id: 'indigo', name: 'Indigo Deep', bg: 'bg-[#e0e7ff]', text: 'text-[#3730a3]', border: 'border-[#a5b4fc]', hex: '#e0e7ff' },
  { id: 'pink', name: 'Soft Rose', bg: 'bg-[#fce7f3]', text: 'text-[#9d174d]', border: 'border-[#f9a8d4]', hex: '#fce7f3' },
  { id: 'gray', name: 'Industrial Steel', bg: 'bg-[#f3f4f6]', text: 'text-[#374151]', border: 'border-[#d1d5db]', hex: '#f3f4f6' },
];

const DEFAULT_FIELDS = [
  {
    id: 'cf-priority',
    name: 'Priority',
    type: 'single-select',
    description: 'Urgency level assigned to guide sprint execution priority.',
    projectsCount: 2,
    scope: 'organization',
    options: [
      { id: 'opt-high', label: 'High', colorId: 'red' },
      { id: 'opt-medium', label: 'Medium', colorId: 'amber' },
      { id: 'opt-low', label: 'Low', colorId: 'emerald' },
    ]
  },
  {
    id: 'cf-stage',
    name: 'Stage',
    type: 'single-select',
    description: 'Board workflow stage indicating developmental progress.',
    projectsCount: 1,
    scope: 'organization',
    options: [
      { id: 'opt-todo', label: 'To Do', colorId: 'gray' },
      { id: 'opt-inprogress', label: 'In Progress', colorId: 'blue' },
      { id: 'opt-review', label: 'Review', colorId: 'violet' },
      { id: 'opt-complete', label: 'Complete', colorId: 'emerald' },
    ]
  },
  {
    id: 'cf-estimate',
    name: 'Estimate (hrs)',
    type: 'number',
    description: 'Time workload projection effort measured in hours.',
    projectsCount: 2,
    scope: 'organization',
    numberFormat: 'decimal',
    decimalPlaces: 1
  },
  {
    id: 'cf-due-date',
    name: 'Deliverable Target',
    type: 'date',
    description: 'Hard deadline calendar date for external milestone deliveries.',
    projectsCount: 1,
    scope: 'project-only'
  },
  {
    id: 'cf-dept',
    name: 'Assigned Department',
    type: 'multi-select',
    description: 'Target organizational squads associated with the task card.',
    projectsCount: 0,
    scope: 'organization',
    options: [
      { id: 'opt-prod', label: 'Product', colorId: 'indigo' },
      { id: 'opt-design', label: 'Design', colorId: 'pink' },
      { id: 'opt-eng', label: 'Engineering', colorId: 'blue' },
      { id: 'opt-mktg', label: 'Marketing', colorId: 'amber' },
    ]
  },
  {
    id: 'cf-reviewer',
    name: 'Stakeholder Reviewer',
    type: 'people',
    description: 'Designated user auditor assigned to verify quality of completed work.',
    projectsCount: 1,
    scope: 'organization'
  }
];

const DEFAULT_TEMPLATES = [
  {
    id: 'tmpl-sprint',
    name: 'Sprint Scrum Plan',
    description: 'Pre-configured columns for sprint backlog, active development sprint, review checks and automated milestones.',
    createdBy: { name: 'Tech Lead Org', email: 'tech-lead@crewflow.com', avatarBg: 'bg-[#93c5fd] text-[#1e3a8a]' },
    scope: 'organization',
    usedCount: 14,
    activeTabs: ['List', 'Board', 'Timeline', 'Gantt', 'Messages'],
    columns: ['Sprint Backlog', 'Ready for Dev', 'In Progress', 'QA / Review', 'Done'],
    whoCanUse: 'Anyone in organization',
    whoCanEdit: 'Only template owners'
  },
  {
    id: 'tmpl-gtm',
    name: 'Marketing GTM Roadmap',
    description: 'GTM campaign launch board with specific phases for content drafting, channels outreach and performance auditing.',
    createdBy: { name: 'Guest User', email: 'guest@crewflow.com', avatarBg: 'bg-[#fca5a5] text-[#991b1b]' },
    scope: 'organization',
    usedCount: 8,
    activeTabs: ['Board', 'Calendar', 'Dashboard', 'Files'],
    columns: ['Planning', 'In Progress', 'Approval Phase', 'Campaign Live', 'Archived / Complete'],
    whoCanUse: 'Anyone in organization',
    whoCanEdit: 'Anyone with access'
  },
  {
    id: 'tmpl-sla',
    name: 'Support Ticket Queue',
    description: 'SLA ticket tracking pipeline with custom ticket priority status tags and automatic support squad notification loops.',
    createdBy: { name: 'Admin User', email: 'admin@crewflow.com', avatarBg: 'bg-[#a7f3d0] text-[#065f46]' },
    scope: 'project-only',
    usedCount: 5,
    activeTabs: ['List', 'Dashboard', 'Messages'],
    columns: ['New Tickets', 'Assigned', 'In Investigation', 'Pending Customer', 'SLA Resolved'],
    whoCanUse: 'Invite-only workspace members',
    whoCanEdit: 'Only template owners'
  },
  {
    id: 'tmpl-intake',
    name: 'Creative Design Intake',
    description: 'Figma design request board integrated with custom intake forms and assets draft templates.',
    createdBy: { name: 'Product & Design Lead', email: 'design-lead@crewflow.com', avatarBg: 'bg-[#c084fc] text-[#581c87]' },
    scope: 'private',
    usedCount: 2,
    activeTabs: ['Board', 'Files'],
    columns: ['Incoming Requests', 'Brief Verification', 'Figma Ideation', 'Review & Signoff', 'Released'],
    whoCanUse: 'Admins & owners only',
    whoCanEdit: 'Only template owners'
  }
];

const DEFAULT_STATUS_TEMPLATES = [
  {
    id: 'st-exec',
    name: 'Executive Project Brief',
    type: 'Project',
    description: 'Consolidates weekly project status, milestone approvals, incomplete task ratios by section and key squad blockers.',
    createdBy: { name: 'Tech Lead Org', email: 'tech-lead@crewflow.com', avatarBg: 'bg-[#93c5fd] text-[#1e3a8a]' },
    usedCount: 12,
    blocks: ['status-indicator', 'milestones', 'tasks-section', 'narrative'],
    sharing: 'Public in organization'
  },
  {
    id: 'st-portfolio',
    name: 'Portfolio Health Report',
    type: 'Portfolio',
    description: 'Provides executive oversight on department project lists, grouping on/off track project counts and project owners.',
    createdBy: { name: 'Guest User', email: 'guest@crewflow.com', avatarBg: 'bg-[#fca5a5] text-[#991b1b]' },
    usedCount: 7,
    blocks: ['projects-grid', 'ontrack-counts', 'project-owners'],
    sharing: 'Shared with Managers'
  },
  {
    id: 'st-sprint',
    name: 'Sprint Completion Digest',
    type: 'Project',
    description: 'Detailed audit template illustrating completed vs outstanding task velocities grouped by assignee.',
    createdBy: { name: 'Admin User', email: 'admin@crewflow.com', avatarBg: 'bg-[#a7f3d0] text-[#065f46]' },
    usedCount: 9,
    blocks: ['tasks-assignee', 'status-indicator', 'narrative'],
    sharing: 'Public in organization'
  }
];

const DEFAULT_RULES = [
  {
    id: 'rule-bugs',
    name: 'Escalate Critical Tasks',
    triggerType: 'priority-change',
    triggerValue: 'High',
    actionType: 'assign-member',
    actionValue: 'tech-lead@crewflow.com',
    triggerText: 'Priority changes to "High"',
    actionText: 'assign to tech-lead@crewflow.com & alert lead via email',
    owner: { name: 'Tech Lead Org', email: 'tech-lead@crewflow.com', avatarBg: 'bg-[#93c5fd] text-[#1e3a8a]' },
    triggersCount: 48,
    active: true
  },
  {
    id: 'rule-sync',
    name: 'Sync Board Completion Notification',
    triggerType: 'stage-change',
    triggerValue: 'Complete',
    actionType: 'send-email',
    actionValue: 'Squad Milestone Achieved!',
    triggerText: 'Stage changes to "Complete"',
    actionText: 'send alert email: "Squad Milestone Achieved!" to project-admins@crewflow.com',
    owner: { name: 'Guest User', email: 'guest@crewflow.com', avatarBg: 'bg-[#fca5a5] text-[#991b1b]' },
    triggersCount: 142,
    active: true
  },
  {
    id: 'rule-due',
    name: 'Due Date Alert High Priority Flag',
    triggerType: 'due-approaching',
    triggerValue: '1 day before',
    actionType: 'set-priority',
    actionValue: 'High',
    triggerText: 'Due Date is approaching in 1 day',
    actionText: 'set priority level to High',
    owner: { name: 'Admin User', email: 'admin@crewflow.com', avatarBg: 'bg-[#a7f3d0] text-[#065f46]' },
    triggersCount: 91,
    active: false
  },
  {
    id: 'rule-creative',
    name: 'Creative Review Auto-Assignment',
    triggerType: 'stage-change',
    triggerValue: 'Review',
    actionType: 'assign-member',
    actionValue: 'design-lead@crewflow.com',
    triggerText: 'Stage changes to "Review"',
    actionText: 'assign to design-lead@crewflow.com',
    owner: { name: 'Product & Design Lead', email: 'design-lead@crewflow.com', avatarBg: 'bg-[#c084fc] text-[#581c87]' },
    triggersCount: 18,
    active: true
  }
];

const DEFAULT_FORMS = [
  {
    id: 'form-creative',
    name: 'Creative Project Brief Intake',
    targetProject: 'CrewFlow Product Launch',
    submissionsCount: 3,
    scope: 'Public via share link',
    active: true,
    description: 'Collect creative asset briefs, Figma request specifications, and due dates from cross-functional squads.',
    fields: ['title', 'description', 'attachment', 'due-date', 'priority'],
    defaultAssignee: 'design-lead@crewflow.com',
    confirmText: 'Thank you for your creative submission! We will verify details within 24 hours.',
    submissions: [
      {
        id: 'sub-creative-1',
        submittedAt: '2026-05-30T14:22:00Z',
        submitter: 'marketing-lead@crewflow.com',
        title: 'Summer Campaign Hero Banners',
        description: 'Need responsive hero illustrations for the main promotional campaign page. Style must align with our monochrome design system.',
        answers: {
          'priority': 'High',
          'due-date': '2026-06-10',
          'attachment': 'summer_promo_guide.pdf (4.2 MB)'
        }
      },
      {
        id: 'sub-creative-2',
        submittedAt: '2026-05-29T09:15:00Z',
        submitter: 'sales-ops@crewflow.com',
        title: 'Grayscale Pitch Deck Template',
        description: 'Clean monochrome template for external investor relations presentations.',
        answers: {
          'priority': 'Medium',
          'due-date': '2026-06-05',
          'attachment': 'investor_deck_outline.docx (1.1 MB)'
        }
      },
      {
        id: 'sub-creative-3',
        submittedAt: '2026-05-28T11:04:00Z',
        submitter: 'hr-training@crewflow.com',
        title: 'New Hire Welcome Kit Infographics',
        description: 'Visual grid graphic summarizing the new employee checklist and benefits program layout.',
        answers: {
          'priority': 'Low',
          'due-date': '2026-06-15',
          'attachment': 'onboarding_checkpoints.png (820 KB)'
        }
      }
    ]
  },
  {
    id: 'form-bug',
    name: 'Engineering Bug Intake Form',
    targetProject: 'Monochrome Overhaul',
    submissionsCount: 2,
    scope: 'Internal Organization Only',
    active: true,
    description: 'Structured ticketing intake for developers and customers to submit repro logs, stack traces, and browser specs.',
    fields: ['title', 'description', 'priority', 'custom-repro-steps'],
    defaultAssignee: 'tech-lead@crewflow.com',
    confirmText: 'Bug report logged in development backlog pipeline.',
    submissions: [
      {
        id: 'sub-bug-1',
        submittedAt: '2026-05-31T08:12:00Z',
        submitter: 'qa-tester@crewflow.com',
        title: 'Console error thrown on invite button click',
        description: 'Getting a 400 Bad Request error when trying to invite users with empty email fields. Needs validation check.',
        answers: {
          'priority': 'High',
          'custom-repro-steps': '1. Click invite member in header navbar.\n2. Submit blank form field.\n3. Observe console error.'
        }
      },
      {
        id: 'sub-bug-2',
        submittedAt: '2026-05-30T16:45:00Z',
        submitter: 'beta-support@crewflow.com',
        title: 'Responsive grid columns breaking on tablet layout',
        description: 'On iPad screens, the 4-column custom fields grid squishes and causes text overlapping.',
        answers: {
          'priority': 'Medium',
          'custom-repro-steps': '1. Load dashboard on viewport width 768px.\n2. Scroll down to custom task cards types section.\n3. Notice visual overlap.'
        }
      }
    ]
  },
  {
    id: 'form-it',
    name: 'IT Support request form',
    targetProject: 'CrewFlow Product Launch',
    submissionsCount: 0,
    scope: 'Internal Organization Only',
    active: false,
    description: 'Standard IT support intake form for hardware upgrades and permission provisioning requests.',
    fields: ['title', 'description', 'attachment'],
    defaultAssignee: 'admin@crewflow.com',
    confirmText: 'IT Support card generated.',
    submissions: []
  }
];

const DEFAULT_TASK_TYPES = [
  {
    id: 'tt-milestone',
    name: 'Milestone Task',
    iconName: 'Sparkles',
    colorHex: 'hsl(37, 90%, 93%)',
    textColorHex: 'hsl(37, 90%, 38%)',
    borderHex: 'hsl(37, 90%, 80%)',
    desc: 'High-level planning cards containing deadlines and strategic outputs.',
    fields: ['title', 'description', 'due-date', 'priority'],
    active: true,
    associatedProjectsCount: 14
  },
  {
    id: 'tt-bug',
    name: 'Engineering Bug',
    iconName: 'Bug',
    colorHex: 'hsl(350, 80%, 93%)',
    textColorHex: 'hsl(350, 84%, 40%)',
    borderHex: 'hsl(350, 80%, 80%)',
    desc: 'Specialized tracking boards featuring repro logs, git commits, and hotfixes.',
    fields: ['title', 'description', 'priority', 'custom-repro-steps', 'attachment'],
    active: true,
    associatedProjectsCount: 8
  },
  {
    id: 'tt-design',
    name: 'Design Deliverable',
    iconName: 'Layers',
    colorHex: 'hsl(240, 80%, 93%)',
    textColorHex: 'hsl(240, 80%, 40%)',
    borderHex: 'hsl(240, 80%, 80%)',
    desc: 'Asset review boards featuring Figma link placeholders and image previews.',
    fields: ['title', 'description', 'attachment', 'due-date', 'priority', 'custom-text'],
    active: true,
    associatedProjectsCount: 22
  },
  {
    id: 'tt-ops',
    name: 'Operational Checklist',
    iconName: 'AlignLeft',
    colorHex: 'hsl(142, 70%, 93%)',
    textColorHex: 'hsl(142, 76%, 36%)',
    borderHex: 'hsl(142, 70%, 80%)',
    desc: 'Standard administrative procedural task logs.',
    fields: ['title', 'description'],
    active: false,
    associatedProjectsCount: 5
  }
];

export default function WorkflowView({ view, setActiveView, projects = [], tasks = [], onTaskCreated, token }) {
  // --- STATE: CUSTOM FIELDS ---
  const [fields, setFields] = useState(() => {
    try {
      const saved = localStorage.getItem('crewflow_custom_fields');
      const parsed = saved ? JSON.parse(saved) : null;
      return Array.isArray(parsed) ? parsed : DEFAULT_FIELDS;
    } catch (e) {
      return DEFAULT_FIELDS;
    }
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  
  // Custom owner filter and project picker states to match Asana inspiration screenshots
  const [fieldOwnerFilter, setFieldOwnerFilter] = useState('all'); // 'all' | 'owner'
  const [ruleOwnerFilter, setRuleOwnerFilter] = useState('all'); // 'all' | 'owner'
  const [formOwnerFilter, setFormOwnerFilter] = useState('all'); // 'all' | 'owner'
  const [templateOwnerFilter, setTemplateOwnerFilter] = useState('all'); // 'all' | 'owner'
  const [taskTypeCreatedByFilter, setTaskTypeCreatedByFilter] = useState('all'); // 'all' | 'me'
  const [projectPickerType, setProjectPickerType] = useState(null); // 'fields' | 'rules' | 'forms' | 'status-templates'
  const [projectPickerSearch, setProjectPickerSearch] = useState('');
  const [projectPickerPermission, setProjectPickerPermission] = useState('Organization only'); // for forms

  // Custom Fields Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create'); 
  const [editingFieldId, setEditingFieldId] = useState(null);

  // Form State inside Custom Fields Modal
  const [fieldName, setFieldName] = useState('');
  const [fieldType, setFieldType] = useState('single-select');
  const [fieldDescription, setFieldDescription] = useState('');
  const [fieldScope, setFieldScope] = useState('organization'); 
  
  const [fieldOptions, setFieldOptions] = useState([
    { id: 'opt-1', label: 'Option 1', colorId: 'gray' },
    { id: 'opt-2', label: 'Option 2', colorId: 'blue' }
  ]);

  const [numberFormat, setNumberFormat] = useState('decimal'); 
  const [decimalPlaces, setDecimalPlaces] = useState(1);
  const [currencySymbol, setCurrencySymbol] = useState('$');

  // --- STATE: PROJECT TEMPLATES ---
  const [templates, setTemplates] = useState(() => {
    try {
      const saved = localStorage.getItem('crewflow_project_templates');
      const parsed = saved ? JSON.parse(saved) : null;
      return Array.isArray(parsed) ? parsed : DEFAULT_TEMPLATES;
    } catch (e) {
      return DEFAULT_TEMPLATES;
    }
  });

  const [templateSearchQuery, setTemplateSearchQuery] = useState('');
  const [templateFilter, setTemplateFilter] = useState('all');

  // Create Template Modal
  const [isCreateTemplateModalOpen, setIsCreateTemplateModalOpen] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState('');
  const [newTemplateDesc, setNewTemplateDesc] = useState('');
  const [newTemplateScope, setNewTemplateScope] = useState('organization');
  const [newTemplateSource, setNewTemplateSource] = useState('scratch'); 

  // Active Template Builder Workspace State
  const [activeBuilderTemplateId, setActiveBuilderTemplateId] = useState(null);
  const [tempBuilderTemplate, setTempBuilderTemplate] = useState(null);
  const [builderActivePreviewTab, setBuilderActivePreviewTab] = useState('Board');
  const [newColumnInput, setNewColumnInput] = useState('');
  const [showAddTabOptions, setShowAddTabOptions] = useState(false);

  // --- STATE: STATUS TEMPLATES ---
  const [statusTemplates, setStatusTemplates] = useState(() => {
    try {
      const saved = localStorage.getItem('crewflow_status_templates');
      const parsed = saved ? JSON.parse(saved) : null;
      return Array.isArray(parsed) ? parsed : DEFAULT_STATUS_TEMPLATES;
    } catch (e) {
      return DEFAULT_STATUS_TEMPLATES;
    }
  });

  const [statusSearchQuery, setStatusSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); 

  // Create Status Template Modal
  const [isCreateStatusModalOpen, setIsCreateStatusModalOpen] = useState(false);

  // Create Status Modal state
  const [isCreateStatusOpen, setIsCreateStatusOpen] = useState(false);
  const [newStatusName, setNewStatusName] = useState('');
  const [newStatusDesc, setNewStatusDesc] = useState('');
  const [newStatusType, setNewStatusType] = useState('Project'); // 'Project' | 'Portfolio'
  const [newStatusSharing, setNewStatusSharing] = useState('Owner-restricted');

  // Active Status Worksheet state
  const [activeStatusBuilderId, setActiveStatusBuilderId] = useState(null);
  const [tempStatusBuilder, setTempStatusBuilder] = useState(null);

  // --- STATE: AUTOMATED RULES ---
  const [rules, setRules] = useState(() => {
    try {
      const saved = localStorage.getItem('crewflow_rules');
      const parsed = saved ? JSON.parse(saved) : null;
      return Array.isArray(parsed) ? parsed : DEFAULT_RULES;
    } catch (e) {
      return DEFAULT_RULES;
    }
  });

  const [ruleSearchQuery, setRuleSearchQuery] = useState('');
  const [ruleFilter, setRuleFilter] = useState('all'); // 'all' | 'active' | 'inactive'
  const [ruleSort, setRuleSort] = useState('triggers'); // 'triggers' | 'alphabetical' | 'newest'

  // Create Automated Rule Modal state
  const [isCreateRuleOpen, setIsCreateRuleOpen] = useState(false);
  const [newRuleName, setNewRuleName] = useState('');
  const [newRuleTriggerType, setNewRuleTriggerType] = useState('priority-change');
  const [newRuleTriggerVal, setNewRuleTriggerVal] = useState('High');
  const [newRuleActionType, setNewRuleActionType] = useState('assign-member');
  const [newRuleActionVal, setNewRuleActionVal] = useState('tech-lead@crewflow.com');
  const [rulesToast, setRulesToast] = useState('');

  // --- ADDITIONAL INTERACTIVE ENG COMPONENT STATES ---
  // Forms: Added to form modal state
  const [isAddedToFormModalOpen, setIsAddedToFormModalOpen] = useState(false);

  // Project Templates: Wizard and Builder
  const [isProjectTemplateWizardOpen, setIsProjectTemplateWizardOpen] = useState(false);
  const [wizardTitle, setWizardTitle] = useState('Sprint Scrum Plan');
  const [wizardScope, setWizardScope] = useState('organization');
  const [wizardActiveTab, setWizardActiveTab] = useState('List');
  const [projectRoles, setProjectRoles] = useState(['Project Lead', 'Editor', 'Reviewer']);
  const [showRolesPopover, setShowRolesPopover] = useState(false);
  const [newRoleInput, setNewRoleInput] = useState('');
  const [shiftDependencies, setShiftDependencies] = useState(true);
  const [columnsConfig, setColumnsConfig] = useState({
    assignee: true,
    dueDate: true,
    projects: false,
    tags: true,
    blockedBy: false,
    blocking: false,
    attachments: true
  });

  // Status Templates horizontal selector & builder narrative rich text simulator
  const [activeStatusTab, setActiveStatusTab] = useState('Projects'); // 'Projects' | 'Portfolios'
  const [statusTemplateSelection, setStatusTemplateSelection] = useState('On Track');
  const [simulatedRichTextFormat, setSimulatedRichTextFormat] = useState({ bold: false, italic: false, underline: false, code: false });
  const [focusedNarrativeField, setFocusedNarrativeField] = useState(null);

  // Task Types status mapper state lists
  const [activeStatuses, setActiveStatuses] = useState([
    { id: '1', label: 'New Request', code: 'N', color: 'red' },
    { id: '2', label: 'In Investigation', code: 'I', color: 'amber' }
  ]);
  const [doneStatuses, setDoneStatuses] = useState([
    { id: '3', label: 'Completed', code: 'C', color: 'emerald' }
  ]);
  const [newStatusInputName, setNewStatusInputName] = useState('');
  const [newStatusInputGroup, setNewStatusInputGroup] = useState('active'); // 'active' | 'done'

  // --- STATE: INTAKE FORMS ---
  const [forms, setForms] = useState(() => {
    try {
      const saved = localStorage.getItem('crewflow_forms');
      const parsed = saved ? JSON.parse(saved) : null;
      return Array.isArray(parsed) ? parsed : DEFAULT_FORMS;
    } catch (e) {
      return DEFAULT_FORMS;
    }
  });

  const [formSearchQuery, setFormSearchQuery] = useState('');
  const [formFilter, setFormFilter] = useState('all'); // 'all' | 'active' | 'inactive'
  const [formSort, setFormSort] = useState('submissions'); // 'submissions' | 'alphabetical' | 'newest'

  // Custom Downbars / Dropdowns popover toggle states
  const [isSharingFilterOpen, setIsSharingFilterOpen] = useState(false);
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const [isCreateDropdownOpen, setIsCreateDropdownOpen] = useState(false);

  // Submissions database viewer states
  const [selectedFormSubmissions, setSelectedFormSubmissions] = useState(null);
  const [activeFormSubmissionDetail, setActiveFormSubmissionDetail] = useState(null);

  // Simulated forms intake uploader states
  const [designerSuccessState, setDesignerSuccessState] = useState(false);
  const [simulatedInputs, setSimulatedInputs] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    'due-date': '',
    'attachment': null,
    'custom-repro-steps': '',
    'custom-text': '',
    'custom-number': ''
  });

  // Create Form Modal state
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
  const [newFormName, setNewFormName] = useState('');
  const [newFormDesc, setNewFormDesc] = useState('');
  const [newFormProject, setNewFormProject] = useState('CrewFlow Product Launch');
  const [newFormScope, setNewFormScope] = useState('Public via share link');

  // Active Form Designer Builder state
  const [activeFormDesignerId, setActiveFormDesignerId] = useState(null);
  const [tempFormDesigner, setTempFormDesigner] = useState(null);
  const [designerRightTab, setDesignerRightTab] = useState('toolkit'); // 'toolkit' | 'settings'

  // --- STATE: TASK TYPES ---
  const [taskTypes, setTaskTypes] = useState(() => {
    try {
      const saved = localStorage.getItem('crewflow_task_types');
      const parsed = saved ? JSON.parse(saved) : null;
      return Array.isArray(parsed) ? parsed : DEFAULT_TASK_TYPES;
    } catch (e) {
      return DEFAULT_TASK_TYPES;
    }
  });

  const [taskTypeSearchQuery, setTaskTypeSearchQuery] = useState('');
  const [taskTypeFilter, setTaskTypeFilter] = useState('all'); // 'all' | 'active' | 'inactive'
  const [taskTypeSort, setTaskTypeSort] = useState('alphabetical'); // 'alphabetical' | 'usage' | 'color'

  // Custom Downbars / Dropdowns popover toggle states for Task Types
  const [isTaskTypeSharingOpen, setIsTaskTypeSharingOpen] = useState(false);
  const [isTaskTypeSortOpen, setIsTaskTypeSortOpen] = useState(false);

  // Create / Edit Task Type Modal state
  const [isCreateTaskTypeOpen, setIsCreateTaskTypeOpen] = useState(false);
  const [editingTaskTypeId, setEditingTaskTypeId] = useState(null);
  const [newTaskTypeName, setNewTaskTypeName] = useState('');
  const [newTaskTypeDesc, setNewTaskTypeDesc] = useState('');
  const [newTaskTypeIcon, setNewTaskTypeIcon] = useState('Sparkles');
  const [newTaskTypeColor, setNewTaskTypeColor] = useState('hsl(37, 90%, 93%)');
  const [newTaskTypeTextColor, setNewTaskTypeTextColor] = useState('hsl(37, 90%, 38%)');
  const [newTaskTypeFields, setNewTaskTypeFields] = useState(['title', 'description']);
  const [newTaskTypeActive, setNewTaskTypeActive] = useState(true);

  // Sync states to localStorage
  useEffect(() => {
    localStorage.setItem('crewflow_custom_fields', JSON.stringify(fields));
  }, [fields]);

  useEffect(() => {
    localStorage.setItem('crewflow_project_templates', JSON.stringify(templates));
  }, [templates]);

  useEffect(() => {
    localStorage.setItem('crewflow_status_templates', JSON.stringify(statusTemplates));
  }, [statusTemplates]);

  useEffect(() => {
    localStorage.setItem('crewflow_rules', JSON.stringify(rules));
  }, [rules]);

  useEffect(() => {
    localStorage.setItem('crewflow_forms', JSON.stringify(forms));
  }, [forms]);

  useEffect(() => {
    localStorage.setItem('crewflow_task_types', JSON.stringify(taskTypes));
  }, [taskTypes]);

  // Pre-fill rule name dynamically as triggers/actions shift
  useEffect(() => {
    let tText = '';
    if (newRuleTriggerType === 'stage-change') tText = `Stage changes to "${newRuleTriggerVal}"`;
    else if (newRuleTriggerType === 'priority-change') tText = `Priority changes to "${newRuleTriggerVal}"`;
    else if (newRuleTriggerType === 'assignee-change') tText = `Task Assignee changes`;
    else if (newRuleTriggerType === 'due-approaching') tText = `Due Date is approaching in ${newRuleTriggerVal}`;

    let aText = '';
    if (newRuleActionType === 'move-stage') aText = `move task to Stage "${newRuleActionVal}"`;
    else if (newRuleActionType === 'assign-member') aText = `assign to ${newRuleActionVal}`;
    else if (newRuleActionType === 'set-priority') aText = `set priority level to ${newRuleActionVal}`;
    else if (newRuleActionType === 'send-email') aText = `send alert email: "${newRuleActionVal}"`;

    setNewRuleName(`When ${tText} -> Then ${aText}`);
  }, [newRuleTriggerType, newRuleTriggerVal, newRuleActionType, newRuleActionVal]);

  // Default values mapping when trigger type changes
  useEffect(() => {
    if (newRuleTriggerType === 'stage-change') setNewRuleTriggerVal('Complete');
    else if (newRuleTriggerType === 'priority-change') setNewRuleTriggerVal('High');
    else if (newRuleTriggerType === 'due-approaching') setNewRuleTriggerVal('1 day before');
    else setNewRuleTriggerVal('');
  }, [newRuleTriggerType]);

  // Default values mapping when action type changes
  useEffect(() => {
    if (newRuleActionType === 'move-stage') setNewRuleActionVal('QA / Review');
    else if (newRuleActionType === 'assign-member') setNewRuleActionVal('tech-lead@crewflow.com');
    else if (newRuleActionType === 'set-priority') setNewRuleActionVal('High');
    else if (newRuleActionType === 'send-email') setNewRuleActionVal('Hotfix Required!');
  }, [newRuleActionType]);

  // --- HELPERS: CUSTOM FIELDS ---
  const getTypeIcon = (type) => {
    switch (type) {
      case 'single-select': return <ChevronDown className="h-3.5 w-3.5 text-zinc-500" />;
      case 'multi-select': return <ChevronDown className="h-3.5 w-3.5 text-purple-500 stroke-[2.5px]" />;
      case 'text': return <AlignLeft className="h-3.5 w-3.5 text-zinc-400" />;
      case 'number': return <Hash className="h-3.5 w-3.5 text-zinc-500" />;
      case 'date': return <Calendar className="h-3.5 w-3.5 text-zinc-400" />;
      case 'people': return <Users className="h-3.5 w-3.5 text-zinc-500" />;
      default: return <Sliders className="h-3.5 w-3.5 text-zinc-500" />;
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case 'single-select': return 'Single-select';
      case 'multi-select': return 'Multi-select';
      case 'text': return 'Text (Freeform)';
      case 'number': return 'Number';
      case 'date': return 'Date';
      case 'people': return 'People';
      default: return type;
    }
  };

  const getSwatch = (colorId) => {
    return COLOR_SWATCHES.find(sw => sw.id === colorId) || COLOR_SWATCHES[7];
  };

  const renderProjectPicker = (type, onAdd) => {
    if (projectPickerType !== type) return null;
    return (
      <>
        <div className="fixed inset-0 z-30" onClick={() => setProjectPickerType(null)} />
        <div className="absolute right-0 mt-2 w-[300px] bg-white border border-[#e2e2e2] rounded-xl shadow-xl z-50 p-4 animate-scale-in text-left text-xs font-sans font-medium text-[#1a1c1c]">
          {/* Tabs bar */}
          <div className="flex border-b border-[#e2e2e2] mb-3 text-center">
            <button type="button" className="flex-1 pb-2 font-bold border-b-2 border-black text-[#1a1c1c]">Select a project</button>
            <button type="button" className="flex-1 pb-2 font-semibold text-zinc-400 hover:text-black">New project</button>
          </div>
          {/* Body */}
          <div className="flex flex-col gap-3">
            <div>
              <span className="block font-bold text-zinc-500 mb-1 text-[10px] uppercase tracking-wider">Choose project</span>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-zinc-400" />
                <input 
                  type="text" 
                  value={projectPickerSearch} 
                  onChange={(e) => setProjectPickerSearch(e.target.value)} 
                  placeholder="Add a project by name" 
                  className="w-full pl-8 pr-3 py-2 border border-[#e2e2e2] rounded-lg bg-[#f9f9f9] text-xs font-medium focus:outline-none"
                />
              </div>
            </div>
            
            {/* List matching projects */}
            <div className="max-h-24 overflow-y-auto divide-y divide-[#e2e2e2]/60 select-none">
              {(projects.length > 0 ? projects : [{ id: 'mock-1', name: 'CrewFlow Product Launch' }, { id: 'mock-2', name: 'Monochrome Overhaul' }])
                .filter(p => p.name.toLowerCase().includes(projectPickerSearch.toLowerCase()))
                .map(p => (
                  <button 
                    key={p.id || p._id} 
                    type="button" 
                    onClick={() => {
                      setProjectPickerSearch(p.name);
                    }}
                    className="w-full text-left py-2 px-2 hover:bg-[#f3f4f6] rounded font-semibold text-[#1a1c1c] transition-colors"
                  >
                    {p.name}
                  </button>
                ))
              }
            </div>

            {type === 'forms' && (
              <div>
                <span className="block font-bold text-zinc-500 mb-1 text-[10px] uppercase tracking-wider">Form access permissions</span>
                <select 
                  value={projectPickerPermission} 
                  onChange={(e) => setProjectPickerPermission(e.target.value)} 
                  className="w-full border border-[#e2e2e2] rounded-lg px-2.5 py-1.5 bg-[#f9f9f9] text-xs font-bold cursor-pointer"
                >
                  <option value="Organization only">Organization only</option>
                  <option value="Public via share link">Public via share link</option>
                </select>
              </div>
            )}

            <button 
              type="button" 
              onClick={() => {
                setProjectPickerType(null);
                onAdd(projectPickerSearch || 'General Board');
              }}
              className="mt-1 w-full bg-black hover:bg-neutral-800 text-white font-bold py-2 rounded-lg text-center transition-colors shadow"
            >
              Add to project
            </button>
          </div>
        </div>
      </>
    );
  };

  // --- OPERATIONS: CUSTOM FIELDS ---
  const handleOpenCreateModal = () => {
    setModalMode('create');
    setEditingFieldId(null);
    setFieldName('');
    setFieldType('single-select');
    setFieldDescription('');
    setFieldScope('organization');
    setFieldOptions([
      { id: 'opt-1', label: 'Option 1', colorId: 'gray' },
      { id: 'opt-2', label: 'Option 2', colorId: 'blue' }
    ]);
    setNumberFormat('decimal');
    setDecimalPlaces(1);
    setCurrencySymbol('$');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (field) => {
    setModalMode('edit');
    setEditingFieldId(field.id);
    setFieldName(field.name);
    setFieldType(field.type);
    setFieldDescription(field.description || '');
    setFieldScope(field.scope || 'organization');
    
    if (field.options) setFieldOptions([...field.options]);
    else setFieldOptions([]);

    if (field.numberFormat) setNumberFormat(field.numberFormat);
    if (field.decimalPlaces !== undefined) setDecimalPlaces(field.decimalPlaces);
    if (field.currencySymbol) setCurrencySymbol(field.currencySymbol);

    setIsModalOpen(true);
  };

  const handleDeleteField = (id) => {
    if (window.confirm('Are you sure you want to permanently remove this custom field from the organization library?')) {
      setFields(prev => prev.filter(f => f.id !== id));
    }
  };

  const handleAddOptionRow = () => {
    const nextNum = fieldOptions.length + 1;
    const randomColors = COLOR_SWATCHES.map(c => c.id);
    const randomColor = randomColors[Math.floor(Math.random() * randomColors.length)];
    setFieldOptions(prev => [
      ...prev,
      { id: `opt-row-${Date.now()}-${nextNum}`, label: `Option ${nextNum}`, colorId: randomColor }
    ]);
  };

  const handleRemoveOptionRow = (rowId) => {
    setFieldOptions(prev => prev.filter(row => row.id !== rowId));
  };

  const handleOptionRowChange = (rowId, label) => {
    setFieldOptions(prev => prev.map(row => row.id === rowId ? { ...row, label } : row));
  };

  const handleOptionRowColorChange = (rowId, colorId) => {
    setFieldOptions(prev => prev.map(row => row.id === rowId ? { ...row, colorId } : row));
  };

  const handleSaveField = (e) => {
    e.preventDefault();
    if (!fieldName.trim()) return;

    const fieldData = {
      id: modalMode === 'edit' ? editingFieldId : `cf-custom-${Date.now()}`,
      name: fieldName.trim(),
      type: fieldType,
      description: fieldDescription.trim(),
      scope: fieldScope,
      projectsCount: modalMode === 'edit' 
        ? (fields.find(f => f.id === editingFieldId)?.projectsCount || 0)
        : Math.floor(Math.random() * 2) 
    };

    if (fieldType === 'single-select' || fieldType === 'multi-select') {
      fieldData.options = fieldOptions
        .filter(opt => opt.label.trim() !== '')
        .map(opt => ({
          id: opt.id,
          label: opt.label.trim(),
          colorId: opt.colorId
        }));
    } else if (fieldType === 'number') {
      fieldData.numberFormat = numberFormat;
      if (numberFormat === 'decimal') {
        fieldData.decimalPlaces = decimalPlaces;
      } else if (numberFormat === 'currency') {
        fieldData.currencySymbol = currencySymbol;
      }
    }

    if (modalMode === 'edit') {
      setFields(prev => prev.map(f => f.id === editingFieldId ? fieldData : f));
    } else {
      setFields(prev => [...prev, fieldData]);
    }

    setIsModalOpen(false);
  };

  // --- OPERATIONS: PROJECT TEMPLATES ---
  const handleOpenCreateTemplateModal = () => {
    setNewTemplateName('');
    setNewTemplateDesc('');
    setNewTemplateScope('organization');
    setNewTemplateSource('scratch');
    setIsCreateTemplateModalOpen(true);
  };

  const handleCreateTemplate = (e) => {
    e.preventDefault();
    if (!newTemplateName.trim()) return;

    let defaultCols = ['To Do', 'In Progress', 'QA', 'Done'];
    if (newTemplateSource === 'scrum') {
      defaultCols = ['Sprint Backlog', 'Ready for Dev', 'In Progress', 'QA / Review', 'Done'];
    } else if (newTemplateSource === 'marketing') {
      defaultCols = ['Planning', 'In Progress', 'Approval Phase', 'Campaign Live', 'Complete'];
    }

    const defaultTabs = ['List', 'Board', 'Timeline', 'Calendar', 'Dashboard'];

    const newTmpl = {
      id: `tmpl-${Date.now()}`,
      name: newTemplateName.trim(),
      description: newTemplateDesc.trim(),
      createdBy: { name: 'Guest User', email: 'guest@crewflow.com', avatarBg: 'bg-[#fca5a5] text-[#991b1b]' },
      scope: newTemplateScope,
      usedCount: 0,
      activeTabs: defaultTabs,
      columns: defaultCols,
      whoCanUse: newTemplateScope === 'organization' ? 'Anyone in organization' : 'Admins & owners only',
      whoCanEdit: 'Only template owners'
    };

    setTemplates(prev => [newTmpl, ...prev]);
    setIsCreateTemplateModalOpen(false);
    handleOpenTemplateBuilder(newTmpl);
  };

  const handleWizardSubmit = (e) => {
    e.preventDefault();
    if (!wizardTitle.trim()) return;

    let defaultCols = ['To Do', 'In Progress', 'QA', 'Done'];
    if (newTemplateSource === 'scrum') {
      defaultCols = ['Sprint Backlog', 'Ready for Dev', 'In Progress', 'QA / Review', 'Done'];
    } else if (newTemplateSource === 'marketing') {
      defaultCols = ['Planning', 'In Progress', 'Approval Phase', 'Campaign Live', 'Complete'];
    }

    const defaultTabs = ['List', 'Board', 'Timeline', 'Calendar', 'Dashboard'];

    const newTmpl = {
      id: `tmpl-${Date.now()}`,
      name: wizardTitle.trim(),
      description: newTemplateDesc.trim() || 'Custom template created via fine-touch creation wizard.',
      createdBy: { name: 'Guest User', email: 'guest@crewflow.com', avatarBg: 'bg-[#fca5a5] text-[#991b1b]' },
      scope: wizardScope,
      usedCount: 0,
      activeTabs: defaultTabs,
      columns: defaultCols,
      whoCanUse: wizardScope === 'organization' ? 'Anyone in organization' : 'Admins & owners only',
      whoCanEdit: 'Only template owners'
    };

    setTemplates(prev => [newTmpl, ...prev]);
    setIsProjectTemplateWizardOpen(false);
    handleOpenTemplateBuilder(newTmpl);
  };

  const handleOpenTemplateBuilder = (tmpl) => {
    setActiveBuilderTemplateId(tmpl.id);
    setTempBuilderTemplate(JSON.parse(JSON.stringify(tmpl))); 
    setBuilderActivePreviewTab('Board');
    setShowAddTabOptions(false);
  };

  const handleDeleteTemplate = (id, name) => {
    if (window.confirm(`Are you sure you want to delete the project template "${name}" from the library?`)) {
      setTemplates(prev => prev.filter(t => t.id !== id));
    }
  };

  // --- OPERATIONS: TEMPLATE BUILDER ---
  const handleBuilderSave = () => {
    setTemplates(prev => prev.map(t => t.id === tempBuilderTemplate.id ? tempBuilderTemplate : t));
    setActiveBuilderTemplateId(null);
    setTempBuilderTemplate(null);
  };

  const handleBuilderCancel = () => {
    if (window.confirm('Discard all unsaved edits to this project template structure?')) {
      setActiveBuilderTemplateId(null);
      setTempBuilderTemplate(null);
    }
  };

  const handleBuilderAddColumn = (e) => {
    e.preventDefault();
    if (!newColumnInput.trim()) return;
    if (tempBuilderTemplate.columns.includes(newColumnInput.trim())) return;

    setTempBuilderTemplate(prev => ({
      ...prev,
      columns: [...prev.columns, newColumnInput.trim()]
    }));
    setNewColumnInput('');
  };

  const handleBuilderRemoveColumn = (colName) => {
    setTempBuilderTemplate(prev => ({
      ...prev,
      columns: prev.columns.filter(c => c !== colName)
    }));
  };

  const handleBuilderToggleTab = (tabName) => {
    const alreadyActive = tempBuilderTemplate.activeTabs.includes(tabName);
    let nextTabs = [];
    if (alreadyActive) {
      nextTabs = tempBuilderTemplate.activeTabs.filter(t => t !== tabName);
    } else {
      nextTabs = [...tempBuilderTemplate.activeTabs, tabName];
    }
    if (nextTabs.length === 0) return;

    setTempBuilderTemplate(prev => ({ ...prev, activeTabs: nextTabs }));
  };

  // --- OPERATIONS: STATUS TEMPLATES ---
  const handleOpenCreateStatusModal = () => {
    setNewStatusName('');
    setNewStatusDesc('');
    setNewStatusType('Project');
    setNewStatusSharing('Public in organization');
    setIsCreateStatusModalOpen(true);
  };

  const handleCreateStatusTemplate = (e) => {
    e.preventDefault();
    if (!newStatusName.trim()) return;

    const defaultBlocks = newStatusType === 'Project' 
      ? ['status-indicator', 'milestones', 'narrative']
      : ['projects-grid', 'ontrack-counts'];

    const newST = {
      id: `st-${Date.now()}`,
      name: newStatusName.trim(),
      type: newStatusType,
      description: newStatusDesc.trim(),
      createdBy: { name: 'Guest User', email: 'guest@crewflow.com', avatarBg: 'bg-[#fca5a5] text-[#991b1b]' },
      usedCount: 0,
      blocks: defaultBlocks,
      sharing: newStatusSharing
    };

    setStatusTemplates(prev => [newST, ...prev]);
    setIsCreateStatusModalOpen(false);
    handleOpenStatusBuilder(newST);
  };

  const handleOpenStatusBuilder = (st) => {
    setActiveStatusBuilderId(st.id);
    setTempStatusBuilder(JSON.parse(JSON.stringify(st)));
    setSimulatedReportStatus('On Track');
  };

  const handleDeleteStatusTemplate = (id, name) => {
    if (window.confirm(`Are you sure you want to delete the status template "${name}"?`)) {
      setStatusTemplates(prev => prev.filter(t => t.id !== id));
    }
  };

  // --- OPERATIONS: STATUS TEMPLATE BUILDER CANVAS ---
  const handleStatusBuilderSave = () => {
    setStatusTemplates(prev => prev.map(t => t.id === tempStatusBuilder.id ? tempStatusBuilder : t));
    setActiveStatusBuilderId(null);
    setTempStatusBuilder(null);
  };

  const handleStatusBuilderCancel = () => {
    if (window.confirm('Discard all unsaved edits to this status template report structure?')) {
      setActiveStatusBuilderId(null);
      setTempStatusBuilder(null);
    }
  };

  const handleStatusBuilderAddBlock = (blockId) => {
    if (tempStatusBuilder.blocks.includes(blockId)) return;
    setTempStatusBuilder(prev => ({
      ...prev,
      blocks: [...prev.blocks, blockId]
    }));
  };

  const handleStatusBuilderRemoveBlock = (blockId) => {
    setTempStatusBuilder(prev => ({
      ...prev,
      blocks: prev.blocks.filter(b => b !== blockId)
    }));
  };

  const handleStatusBuilderMoveBlock = (index, direction) => {
    const nextBlocks = [...tempStatusBuilder.blocks];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= nextBlocks.length) return;

    const temp = nextBlocks[index];
    nextBlocks[index] = nextBlocks[targetIndex];
    nextBlocks[targetIndex] = temp;

    setTempStatusBuilder(prev => ({ ...prev, blocks: nextBlocks }));
  };

  // --- OPERATIONS: AUTOMATED RULES ---
  const handleToggleRuleStatus = (ruleId, currentStatus) => {
    setRules(prev => prev.map(r => r.id === ruleId ? { ...r, active: !r.active } : r));
    const label = !currentStatus ? 'activated' : 'paused';
    setRulesToast(`Automation rule successfully ${label}!`);
    setTimeout(() => setRulesToast(''), 3000);
  };

  const handleDeleteRule = (id, name) => {
    if (window.confirm(`Are you sure you want to permanently delete the automation rule "${name}"?`)) {
      setRules(prev => prev.filter(r => r.id !== id));
    }
  };

  const handleCreateRule = (e) => {
    e.preventDefault();
    if (!newRuleName.trim()) return;

    let triggerTxt = '';
    if (newRuleTriggerType === 'stage-change') triggerTxt = `Stage changes to "${newRuleTriggerVal}"`;
    else if (newRuleTriggerType === 'priority-change') triggerTxt = `Priority changes to "${newRuleTriggerVal}"`;
    else if (newRuleTriggerType === 'assignee-change') triggerTxt = `Task Assignee changes`;
    else if (newRuleTriggerType === 'due-approaching') triggerTxt = `Due Date is approaching in ${newRuleTriggerVal}`;

    let actionTxt = '';
    if (newRuleActionType === 'move-stage') actionTxt = `move task to Stage "${newRuleActionVal}"`;
    else if (newRuleActionType === 'assign-member') actionTxt = `assign to ${newRuleActionVal}`;
    else if (newRuleActionType === 'set-priority') actionTxt = `set priority level to ${newRuleActionVal}`;
    else if (newRuleActionType === 'send-email') actionTxt = `send alert email: "${newRuleActionVal}"`;

    const newRule = {
      id: `rule-${Date.now()}`,
      name: newRuleName.trim(),
      triggerType: newRuleTriggerType,
      triggerValue: newRuleTriggerVal,
      actionType: newRuleActionType,
      actionValue: newRuleActionVal,
      triggerText: triggerTxt,
      actionText: actionTxt,
      owner: { name: 'Guest User', email: 'guest@crewflow.com', avatarBg: 'bg-[#fca5a5] text-[#991b1b]' },
      triggersCount: 0,
      active: true
    };

    setRules(prev => [newRule, ...prev]);
    setIsCreateRuleOpen(false);
    
    setRulesToast('New automation rule successfully created & active!');
    setTimeout(() => setRulesToast(''), 3000);
  };

  // --- OPERATIONS: INTAKE FORMS ---
  const handleToggleFormStatus = (formId, currentStatus) => {
    setForms(prev => prev.map(f => f.id === formId ? { ...f, active: !f.active } : f));
    const label = !currentStatus ? 'activated & public' : 'paused';
    setRulesToast(`Intake form successfully ${label}!`);
    setTimeout(() => setRulesToast(''), 3000);
  };

  const handleDeleteForm = (id, name) => {
    if (window.confirm(`Are you sure you want to permanently delete the intake form "${name}"?`)) {
      setForms(prev => prev.filter(f => f.id !== id));
    }
  };

  const handleOpenCreateFormModal = () => {
    setNewFormName('');
    setNewFormDesc('');
    setNewFormProject(projects[0]?.name || 'CrewFlow Product Launch');
    setNewFormScope('Public via share link');
    setIsCreateDropdownOpen(false);
    setIsCreateFormOpen(true);
  };

  const handleCreateFormFromTemplate = (templateType) => {
    let name = '';
    let desc = '';
    let fields = ['title', 'description'];
    let defaultAssignee = 'tech-lead@crewflow.com';
    let confirmText = 'Form brief logged in project backlog pipeline.';

    if (templateType === 'creative') {
      name = 'Marketing Creative Assets Form';
      desc = 'Submit asset requests, Figma specs, target timelines, and creative parameters.';
      fields = ['title', 'description', 'attachment', 'due-date', 'priority'];
      defaultAssignee = 'design-lead@crewflow.com';
      confirmText = 'Thank you for your creative submission! We will verify details within 24 hours.';
    } else if (templateType === 'bug') {
      name = 'IT Hardware & Bug Request';
      desc = 'Structured uploader to report systems software bugs, repro steps, and specs.';
      fields = ['title', 'description', 'priority', 'custom-repro-steps'];
      defaultAssignee = 'tech-lead@crewflow.com';
      confirmText = 'Bug report registered. The engineering squad has been notified.';
    } else if (templateType === 'ux') {
      name = 'UX Design Intake Form';
      desc = 'Design feedback portal, UI reviews, and custom asset specs uploader.';
      fields = ['title', 'description', 'attachment', 'due-date', 'priority', 'custom-text'];
      defaultAssignee = 'design-lead@crewflow.com';
      confirmText = 'UX design review logged. Design squad will audit details shortly.';
    }

    const newForm = {
      id: `form-${Date.now()}`,
      name,
      targetProject: projects[0]?.name || 'CrewFlow Product Launch',
      submissionsCount: 0,
      scope: 'Public via share link',
      active: true,
      description: desc,
      fields,
      defaultAssignee,
      confirmText,
      submissions: []
    };

    setForms(prev => [newForm, ...prev]);
    setIsCreateDropdownOpen(false);
    handleOpenFormDesigner(newForm);
  };

  const handleCreateForm = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!newFormName.trim()) return;

    const newForm = {
      id: `form-${Date.now()}`,
      name: newFormName.trim(),
      targetProject: newFormProject,
      submissionsCount: 0,
      scope: newFormScope,
      active: true,
      description: newFormDesc.trim(),
      fields: ['title', 'description', 'attachment'],
      defaultAssignee: 'tech-lead@crewflow.com',
      confirmText: 'Intake card logged in project backlog pipeline.',
      submissions: []
    };

    setForms(prev => [newForm, ...prev]);
    setIsCreateFormOpen(false);
    handleOpenFormDesigner(newForm);
  };

  const handleOpenFormDesigner = (form) => {
    setActiveFormDesignerId(form.id);
    setTempFormDesigner(JSON.parse(JSON.stringify(form)));
    setDesignerRightTab('toolkit');
    setDesignerSuccessState(false);
    setSimulatedInputs({
      title: '',
      description: '',
      priority: 'Medium',
      'due-date': '',
      'attachment': null,
      'custom-repro-steps': '',
      'custom-text': '',
      'custom-number': ''
    });
  };

  const handleSimulatedFormSubmit = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!simulatedInputs.title.trim()) {
      alert('Task Title is required to submit a simulated brief!');
      return;
    }

    const newSubmission = {
      id: `sub-${Date.now()}`,
      submittedAt: new Date().toISOString(),
      submitter: 'external-client@crewflow.com',
      title: simulatedInputs.title.trim(),
      description: simulatedInputs.description.trim(),
      answers: { ...simulatedInputs }
    };

    const updatedSubmissions = tempFormDesigner.submissions ? [newSubmission, ...tempFormDesigner.submissions] : [newSubmission];
    const newSubmissionsCount = (tempFormDesigner.submissionsCount || 0) + 1;

    setTempFormDesigner(prev => ({
      ...prev,
      submissionsCount: newSubmissionsCount,
      submissions: updatedSubmissions
    }));

    if (onTaskCreated) {
      const targetProjId = projects.find(p => p.name === tempFormDesigner.targetProject)?._id || projects[0]?._id;
      const simulatedTask = {
        _id: `task-sim-${Date.now()}`,
        projectId: targetProjId,
        projectName: tempFormDesigner.targetProject,
        assignedTo: { _id: 'member_id_1', email: tempFormDesigner.defaultAssignee, name: tempFormDesigner.defaultAssignee.split('@')[0] },
        title: `[Intake] ${simulatedInputs.title.trim()}`,
        description: simulatedInputs.description.trim() + 
          (simulatedInputs['custom-repro-steps'] ? `\n\nRepro Steps:\n${simulatedInputs['custom-repro-steps']}` : '') + 
          (simulatedInputs['custom-text'] ? `\n\nCustom Answer:\n${simulatedInputs['custom-text']}` : '') +
          (simulatedInputs['due-date'] ? `\n\nTarget Delivery: ${simulatedInputs['due-date']}` : ''),
        dueDate: simulatedInputs['due-date'] || new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
        priority: simulatedInputs.priority || 'Medium',
        status: 'To Do',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      onTaskCreated(simulatedTask);
    }

    setRulesToast('Form entry simulated successfully! Task injected in project board.');
    setTimeout(() => setRulesToast(''), 3000);
    setDesignerSuccessState(true);
  };

  // --- OPERATIONS: FORM DESIGNER CANVAS ---
  const handleFormDesignerSave = () => {
    setForms(prev => prev.map(f => f.id === tempFormDesigner.id ? tempFormDesigner : f));
    setActiveFormDesignerId(null);
    setTempFormDesigner(null);
    setDesignerSuccessState(false);
  };

  const handleFormDesignerCancel = () => {
    if (window.confirm('Discard all unsaved edits to this intake form layout?')) {
      setActiveFormDesignerId(null);
      setTempFormDesigner(null);
      setDesignerSuccessState(false);
    }
  };

  const handleFormDesignerAddField = (fieldId) => {
    if (tempFormDesigner.fields.includes(fieldId)) return;
    setTempFormDesigner(prev => ({
      ...prev,
      fields: [...prev.fields, fieldId]
    }));
  };

  const handleFormDesignerRemoveField = (fieldId) => {
    if (fieldId === 'title' || fieldId === 'description') return;
    setTempFormDesigner(prev => ({
      ...prev,
      fields: prev.fields.filter(f => f !== fieldId)
    }));
  };

  // --- OPERATIONS: TASK TYPES ---
  const handleToggleTaskTypeStatus = (id) => {
    setTaskTypes(prev => prev.map(tt => tt.id === id ? { ...tt, active: !tt.active } : tt));
    setRulesToast('Task Type active status successfully toggled!');
    setTimeout(() => setRulesToast(''), 3000);
  };

  const handleDeleteTaskType = (id, name) => {
    if (window.confirm(`Are you sure you want to permanently delete the custom task type "${name}"?`)) {
      setTaskTypes(prev => prev.filter(tt => tt.id !== id));
      setRulesToast(`Task type "${name}" permanently deleted.`);
      setTimeout(() => setRulesToast(''), 3000);
    }
  };

  const handleOpenCreateTaskType = () => {
    setEditingTaskTypeId(null);
    setNewTaskTypeName('');
    setNewTaskTypeDesc('');
    setNewTaskTypeIcon('Sparkles');
    setNewTaskTypeColor('hsl(37, 90%, 93%)');
    setNewTaskTypeTextColor('hsl(37, 90%, 38%)');
    setNewTaskTypeFields(['title', 'description']);
    setNewTaskTypeActive(true);
    setIsTaskTypeSharingOpen(false);
    setIsTaskTypeSortOpen(false);
    setIsCreateTaskTypeOpen(true);
  };

  const handleOpenEditTaskType = (tt) => {
    setEditingTaskTypeId(tt.id);
    setNewTaskTypeName(tt.name);
    setNewTaskTypeDesc(tt.desc || '');
    setNewTaskTypeIcon(tt.iconName || 'Sparkles');
    setNewTaskTypeColor(tt.colorHex || 'hsl(37, 90%, 93%)');
    setNewTaskTypeTextColor(tt.textColorHex || 'hsl(37, 90%, 38%)');
    setNewTaskTypeFields(tt.fields || ['title', 'description']);
    setNewTaskTypeActive(tt.active !== undefined ? tt.active : true);
    setIsTaskTypeSharingOpen(false);
    setIsTaskTypeSortOpen(false);
    setIsCreateTaskTypeOpen(true);
  };

  const handleSaveTaskType = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!newTaskTypeName.trim()) return;

    if (editingTaskTypeId) {
      setTaskTypes(prev => prev.map(tt => tt.id === editingTaskTypeId ? {
        ...tt,
        name: newTaskTypeName.trim(),
        desc: newTaskTypeDesc.trim(),
        iconName: newTaskTypeIcon,
        colorHex: newTaskTypeColor,
        textColorHex: newTaskTypeTextColor,
        borderHex: newTaskTypeColor.replace('93%', '80%'),
        fields: newTaskTypeFields,
        active: newTaskTypeActive
      } : tt));
      setRulesToast('Task Type configurations successfully updated!');
    } else {
      const newType = {
        id: `tt-${Date.now()}`,
        name: newTaskTypeName.trim(),
        desc: newTaskTypeDesc.trim(),
        iconName: newTaskTypeIcon,
        colorHex: newTaskTypeColor,
        textColorHex: newTaskTypeTextColor,
        borderHex: newTaskTypeColor.replace('93%', '80%'),
        fields: newTaskTypeFields,
        active: newTaskTypeActive,
        associatedProjectsCount: 0
      };
      setTaskTypes(prev => [newType, ...prev]);
      setRulesToast('New custom Task Type successfully created!');
    }
    
    setTimeout(() => setRulesToast(''), 3000);
    setIsCreateTaskTypeOpen(false);
    setEditingTaskTypeId(null);
  };

  // --- FILTERING LOGIC ---
  const filteredTaskTypes = taskTypes.filter(tt => {
    const matchesSearch = tt.name.toLowerCase().includes(taskTypeSearchQuery.toLowerCase()) ||
                          (tt.desc && tt.desc.toLowerCase().includes(taskTypeSearchQuery.toLowerCase()));
    
    let matchesStatus = true;
    if (taskTypeFilter === 'active') matchesStatus = tt.active;
    else if (taskTypeFilter === 'inactive') matchesStatus = !tt.active;

    return matchesSearch && matchesStatus;
  }).sort((a, b) => {
    if (taskTypeSort === 'usage') return b.associatedProjectsCount - a.associatedProjectsCount;
    if (taskTypeSort === 'color') return a.colorHex.localeCompare(b.colorHex);
    return a.name.localeCompare(b.name);
  });
  const filteredFields = fields.filter(field => {
    const matchesSearch = field.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (field.description && field.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesType = typeFilter === 'all' || field.type === typeFilter;
    const matchesOwner = fieldOwnerFilter === 'all' || field.scope === 'project-only'; // simulated owner filter matches project-only scope
    return matchesSearch && matchesType && matchesOwner;
  });

  const filteredTemplates = templates.filter(tmpl => {
    const matchesSearch = tmpl.name.toLowerCase().includes(templateSearchQuery.toLowerCase()) ||
                          (tmpl.description && tmpl.description.toLowerCase().includes(templateSearchQuery.toLowerCase()));
    const matchesFilter = templateFilter === 'all' || tmpl.scope === templateFilter;
    const matchesOwner = templateOwnerFilter === 'all' || tmpl.scope === 'project-only'; // simulated
    return matchesSearch && matchesFilter && matchesOwner;
  });

  const filteredStatusTemplates = statusTemplates.filter(st => {
    const matchesSearch = st.name.toLowerCase().includes(statusSearchQuery.toLowerCase()) ||
                          (st.description && st.description.toLowerCase().includes(statusSearchQuery.toLowerCase()));
    const matchesFilter = statusFilter === 'all' || st.type === statusFilter;
    const matchesTab = (activeStatusTab === 'Projects' ? st.type === 'Project' : st.type === 'Portfolio');
    return matchesSearch && matchesFilter && matchesTab;
  });

  const filteredRules = rules.filter(rule => {
    const matchesSearch = rule.name.toLowerCase().includes(ruleSearchQuery.toLowerCase()) ||
                          rule.triggerText.toLowerCase().includes(ruleSearchQuery.toLowerCase()) ||
                          rule.actionText.toLowerCase().includes(ruleSearchQuery.toLowerCase());
    
    let matchesStatus = true;
    if (ruleFilter === 'active') matchesStatus = rule.active;
    else if (ruleFilter === 'inactive') matchesStatus = !rule.active;

    const matchesOwner = ruleOwnerFilter === 'all' || rule.scope === 'project-only'; // simulated
    return matchesSearch && matchesStatus && matchesOwner;
  }).sort((a, b) => {
    if (ruleSort === 'triggers') return b.triggersCount - a.triggersCount;
    if (ruleSort === 'alphabetical') return a.name.localeCompare(b.name);
    return b.id.localeCompare(a.id); 
  });

  const filteredForms = forms.filter(form => {
    const matchesSearch = form.name.toLowerCase().includes(formSearchQuery.toLowerCase()) ||
                          (form.description && form.description.toLowerCase().includes(formSearchQuery.toLowerCase())) ||
                          form.targetProject.toLowerCase().includes(formSearchQuery.toLowerCase());
    
    let matchesStatus = true;
    if (formFilter === 'active') matchesStatus = form.active;
    else if (formFilter === 'inactive') matchesStatus = !form.active;

    const matchesOwner = formOwnerFilter === 'all' || form.scope === 'Public via share link'; // simulated
    return matchesSearch && matchesStatus && matchesOwner;
  }).sort((a, b) => {
    if (formSort === 'submissions') return b.submissionsCount - a.submissionsCount;
    if (formSort === 'alphabetical') return a.name.localeCompare(b.name);
    return b.id.localeCompare(a.id);
  });

  return (
    <div className="flex-1 flex flex-col h-full bg-[#f9f9f9] text-[#1a1c1c] font-sans select-none overflow-y-auto">
      
      {/* GLOBAL AUTOMATED RULES FLOATING TOAST */}
      {rulesToast && (
        <div className="fixed bottom-6 right-6 bg-black text-white px-4 py-3 rounded-lg shadow-2xl flex items-center gap-2.5 animate-fade-in z-50 text-xs font-semibold">
          <Zap className="h-4 w-4 text-amber-400 fill-amber-400" />
          <span>{rulesToast}</span>
        </div>
      )}

      {/* 1. MASTER VIEW SWITCH FOR BUILDERS */}
      {activeBuilderTemplateId && tempBuilderTemplate ? (
        /* PROJECT TEMPLATE BUILDER CANVAS */
        <div className="flex-1 flex flex-col h-full bg-[#f9f9f9] overflow-hidden">
          
          <div className="px-6 py-4 border-b border-[#e2e2e2] bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 flex-shrink-0">
            <div className="flex items-center gap-3">
              <button onClick={handleBuilderCancel} className="p-1.5 hover:bg-[#f3f4f6] border border-[#e2e2e2] rounded-lg text-zinc-500 hover:text-black transition-colors">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-purple-600 font-bold uppercase tracking-widest flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-purple-500 animate-pulse" />
                    Template Builder Canvas
                  </span>
                  <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider ${
                    tempBuilderTemplate.scope === 'organization' ? 'bg-zinc-100 text-zinc-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {tempBuilderTemplate.scope} scope
                  </span>
                </div>
                <h1 className="text-base font-bold text-[#1a1c1c] mt-0.5">Customize: {tempBuilderTemplate.name}</h1>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button type="button" onClick={handleBuilderCancel} className="px-4 py-2 border border-[#e2e2e2] hover:bg-[#f9f9f9] rounded-lg text-xs font-semibold text-[#777777] hover:text-black">
                Discard edits
              </button>
              <button type="button" onClick={handleBuilderSave} className="px-4 py-2 bg-black hover:bg-neutral-800 text-white text-xs font-bold tracking-wider uppercase rounded-lg shadow flex items-center gap-1.5">
                <Check className="h-4 w-4" />
                <span>Save & Publish template</span>
              </button>
            </div>
          </div>

          <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden relative">
            {/* LEFT SIDEBAR: Steps, Roles & Dependencies */}
            <aside className="w-64 bg-white border-r border-[#e2e2e2] flex flex-col flex-shrink-0 h-full overflow-y-auto font-sans text-xs">
              <div className="p-5 space-y-6 text-left">
                {/* Steps 1, 2, 3 */}
                <div className="space-y-4">
                  <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest block">Deployment Steps</span>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="h-6 w-6 rounded-full bg-black text-white flex items-center justify-center font-bold text-[10px]">1</span>
                      <div className="flex flex-col">
                        <span className="font-bold text-[#1a1c1c]">Core Architecture</span>
                        <span className="text-[9px] text-[#777777]">Set views & columns</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="h-6 w-6 rounded-full bg-neutral-200 text-zinc-600 flex items-center justify-center font-bold text-[10px]">2</span>
                      <div className="flex flex-col">
                        <span className="font-bold text-neutral-500">Automation Trigger</span>
                        <span className="text-[9px] text-[#777777]">Set rules & hooks</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="h-6 w-6 rounded-full bg-neutral-200 text-zinc-600 flex items-center justify-center font-bold text-[10px]">3</span>
                      <div className="flex flex-col">
                        <span className="font-bold text-neutral-500">Forms Integration</span>
                        <span className="text-[9px] text-[#777777]">Set client intake</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Roles Pills Manager */}
                <div className="space-y-3 pt-5 border-t border-[#e2e2e2] relative">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest">Project Roles</span>
                    <button 
                      type="button" 
                      onClick={() => setShowRolesPopover(!showRolesPopover)}
                      className="text-[#777777] hover:text-black font-bold uppercase text-[9px] flex items-center gap-0.5"
                    >
                      <Plus className="h-3 w-3" /> Add
                    </button>
                  </div>

                  {showRolesPopover && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setShowRolesPopover(false)} />
                      <div className="absolute left-0 mt-1 w-full bg-white border border-[#e2e2e2] rounded-xl shadow-xl z-20 p-3 flex flex-col gap-2">
                        <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Add Role Pill</span>
                        <div className="flex gap-1.5">
                          <input 
                            type="text" 
                            value={newRoleInput} 
                            onChange={(e) => setNewRoleInput(e.target.value)} 
                            placeholder="e.g. Lead Designer" 
                            className="flex-1 bg-[#f9f9f9] border border-[#e2e2e2] rounded px-2 py-1 text-xs focus:outline-none focus:bg-white" 
                          />
                          <button 
                            type="button" 
                            onClick={() => {
                              if (newRoleInput.trim() && !projectRoles.includes(newRoleInput.trim())) {
                                setProjectRoles(prev => [...prev, newRoleInput.trim()]);
                                setNewRoleInput('');
                              }
                              setShowRolesPopover(false);
                            }}
                            className="bg-black hover:bg-neutral-800 text-white px-2.5 py-1 rounded text-[10px] font-bold"
                          >
                            Add
                          </button>
                        </div>
                      </div>
                    </>
                  )}

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {projectRoles.map(role => (
                      <span key={role} className="flex items-center gap-1 bg-zinc-50 border border-zinc-200 text-[#555] font-bold px-2 py-0.5 rounded-full text-[9px] uppercase tracking-wider group/role">
                        <span>{role}</span>
                        <button 
                          type="button"
                          onClick={() => setProjectRoles(prev => prev.filter(r => r !== role))}
                          className="text-neutral-400 hover:text-red-700 ml-0.5 opacity-0 group-hover/role:opacity-100 transition-opacity"
                        >
                          <X className="h-2.5 w-2.5" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Shift Dependencies */}
                <div className="space-y-3 pt-5 border-t border-[#e2e2e2]">
                  <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest block">Dependency Settings</span>
                  <div className="flex items-start gap-2.5">
                    <input 
                      type="checkbox" 
                      id="shift-dep" 
                      checked={shiftDependencies} 
                      onChange={(e) => setShiftDependencies(e.target.checked)} 
                      className="mt-0.5 accent-black h-3.5 w-3.5" 
                    />
                    <div className="flex flex-col text-left">
                      <label htmlFor="shift-dep" className="font-bold text-[#1a1c1c] text-xs">Shift Dependencies</label>
                      <span className="text-[9px] text-[#777777] leading-normal mt-0.5">Automatically align dependent task due dates when predecessor schedules change.</span>
                    </div>
                  </div>
                </div>
              </div>
            </aside>

            {/* CENTER PREVIEW: Live board / list preview canvas */}
            <div className="flex-1 flex flex-col min-w-0 bg-[#f9f9f9] overflow-hidden relative">
              <div className="px-8 py-3 border-b border-[#e2e2e2] bg-white flex items-center justify-between flex-shrink-0 z-10">
                <div className="flex items-center gap-1.5 overflow-x-auto relative">
                  {tempBuilderTemplate.activeTabs.map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setBuilderActivePreviewTab(tab)}
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all ${
                        builderActivePreviewTab === tab
                          ? 'bg-[#2d2e30] border-black text-white'
                          : 'bg-[#f9f9f9] border-[#e2e2e2] text-[#777777] hover:text-black'
                      }`}
                    >
                      {tab} view
                    </button>
                  ))}
                  
                  <div className="relative">
                    <button onClick={() => setShowAddTabOptions(!showAddTabOptions)} className="p-1.5 border border-dashed border-[#c5c6c7] hover:border-black rounded-lg text-[#777777] hover:text-black flex items-center justify-center">
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                    {showAddTabOptions && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setShowAddTabOptions(false)} />
                        <div className="absolute left-0 mt-1.5 w-52 bg-white border border-[#e2e2e2] rounded-xl shadow-xl z-20 p-1.5 animate-scale-in text-left">
                          <span className="text-[9px] text-[#777777] font-bold uppercase tracking-widest px-2.5 py-1.5 block">Popular Tabs</span>
                          {['List', 'Board', 'Timeline', 'Calendar', 'Gantt', 'Dashboard', 'Messages', 'Files'].map(tab => {
                            const isActive = tempBuilderTemplate.activeTabs.includes(tab);
                            return (
                              <button
                                key={tab}
                                type="button"
                                onClick={() => {
                                  handleBuilderToggleTab(tab);
                                  setShowAddTabOptions(false);
                                }}
                                className="w-full text-left p-2 hover:bg-[#f3f4f6] rounded-lg flex items-center justify-between text-xs font-semibold text-[#1a1c1c] transition-colors"
                              >
                                <span>{tab} view</span>
                                {isActive ? <Check className="h-3.5 w-3.5 text-black stroke-[2.5px]" /> : <Plus className="h-3.5 w-3.5 text-zinc-400" />}
                              </button>
                            );
                          })}
                        </div>
                      </>
                    )}
                  </div>
                </div>
                <div className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider hidden sm:block">Live View Layout Simulator</div>
              </div>

              <div className="flex-1 p-6 overflow-x-auto overflow-y-auto">
                {builderActivePreviewTab === 'Board' && (
                  <div className="flex items-start gap-4 min-h-full">
                    {tempBuilderTemplate.columns.map((col, idx) => (
                      <div key={idx} className="w-72 bg-[#f3f4f6]/60 rounded-xl border border-[#e2e2e2] flex flex-col p-4 flex-shrink-0">
                        <div className="flex items-center justify-between pb-3 border-b border-[#e2e2e2] mb-3">
                          <span className="font-bold text-xs text-[#1a1c1c] tracking-tight">{col}</span>
                          <button onClick={() => handleBuilderRemoveColumn(col)} className="p-1 hover:bg-[#e2e2e2] rounded text-zinc-400 hover:text-red-700">
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        
                        {/* Interactive Board Column Preview Card sensitive to show/hide columns */}
                        <div className="space-y-3">
                          <div className="bg-white rounded-lg border border-[#e2e2e2] p-3 shadow-xs space-y-2 text-left">
                            <h4 className="text-xs font-bold text-[#1a1c1c] leading-snug">Sprint kickoff review deliverable</h4>
                            <div className="flex flex-wrap gap-1 items-center">
                              {columnsConfig.assignee && (
                                <div className="h-5 w-5 rounded-full bg-zinc-800 text-white flex items-center justify-center font-bold text-[8px]" title="Assignee">TL</div>
                              )}
                              {columnsConfig.dueDate && (
                                <span className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-100 text-[8px] font-bold">June 10</span>
                              )}
                              {columnsConfig.projects && (
                                <span className="px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-800 border border-zinc-200 text-[8px] font-bold">Core Sprint</span>
                              )}
                              {columnsConfig.tags && (
                                <span className="px-1.5 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200 text-[8px] font-bold">kickoff</span>
                              )}
                            </div>
                            {columnsConfig.attachments && (
                              <div className="text-[9px] text-zinc-400 font-bold border-t border-[#e2e2e2]/60 pt-1.5 flex items-center gap-1">
                                <Upload className="h-2.5 w-2.5" /> brief_visuals.pdf
                              </div>
                            )}
                          </div>
                        </div>

                      </div>
                    ))}
                    <form onSubmit={handleBuilderAddColumn} className="w-72 bg-white rounded-xl border border-[#e2e2e2] p-4 flex flex-col gap-2 flex-shrink-0 shadow-sm text-left">
                      <label className="text-[9px] font-bold text-[#777777] uppercase tracking-wider">New Status Column</label>
                      <div className="flex gap-2">
                        <input type="text" value={newColumnInput} onChange={(e) => setNewColumnInput(e.target.value)} placeholder="e.g. Ready for QA" className="flex-1 bg-[#f9f9f9] border border-[#e2e2e2] rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:bg-white focus:ring-1 focus:ring-black" />
                        <button type="submit" className="bg-black hover:bg-neutral-800 text-white p-2 rounded-lg"><Plus className="h-3.5 w-3.5" /></button>
                      </div>
                    </form>
                  </div>
                )}

                {builderActivePreviewTab === 'List' && (
                  <div className="bg-white rounded-xl border border-[#e2e2e2] shadow-sm max-w-4xl mx-auto overflow-hidden font-sans text-xs">
                    <table className="w-full border-collapse text-left font-medium text-[#1a1c1c]">
                      <thead>
                        <tr className="bg-[#f9f9f9] border-b border-[#e2e2e2] text-[#777777] uppercase tracking-widest text-[9px] font-bold">
                          <th className="py-3 px-4 font-semibold">Task Name</th>
                          {columnsConfig.assignee && <th className="py-3 px-3 font-semibold">Assignee</th>}
                          {columnsConfig.dueDate && <th className="py-3 px-3 font-semibold">Due Date</th>}
                          {columnsConfig.projects && <th className="py-3 px-3 font-semibold">Projects</th>}
                          {columnsConfig.tags && <th className="py-3 px-3 font-semibold">Tags</th>}
                          {columnsConfig.blockedBy && <th className="py-3 px-3 font-semibold">Blocked by</th>}
                          {columnsConfig.blocking && <th className="py-3 px-3 font-semibold">Blocking</th>}
                          {columnsConfig.attachments && <th className="py-3 px-4 font-semibold text-right">Attachments</th>}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#e2e2e2]/60">
                        <tr className="hover:bg-[#f9f9f9]/40 transition-colors">
                          <td className="py-3 px-4 font-bold">Draft visual campaign styles</td>
                          {columnsConfig.assignee && (
                            <td className="py-3 px-3">
                              <div className="flex items-center gap-1.5">
                                <div className="h-5 w-5 rounded-full bg-zinc-800 text-white flex items-center justify-center font-bold text-[8px]">GU</div>
                                <span className="font-semibold text-[11px]">Guest User</span>
                              </div>
                            </td>
                          )}
                          {columnsConfig.dueDate && <td className="py-3 px-3 font-semibold text-zinc-500">June 10</td>}
                          {columnsConfig.projects && <td className="py-3 px-3 font-semibold text-zinc-500">Creative Brief</td>}
                          {columnsConfig.tags && (
                            <td className="py-3 px-3">
                              <span className="px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200 text-[8px] font-bold uppercase tracking-wider">marketing</span>
                            </td>
                          )}
                          {columnsConfig.blockedBy && <td className="py-3 px-3 text-zinc-400 font-normal">-</td>}
                          {columnsConfig.blocking && <td className="py-3 px-3 font-semibold text-zinc-700">Review assets</td>}
                          {columnsConfig.attachments && (
                            <td className="py-3 px-4 text-right">
                              <span className="inline-flex items-center gap-1 text-[9px] text-[#777777] font-semibold bg-neutral-50 px-2 py-0.5 rounded border border-neutral-200"><Upload className="h-2.5 w-2.5" /> brief_styles.pdf</span>
                            </td>
                          )}
                        </tr>
                        <tr className="hover:bg-[#f9f9f9]/40 transition-colors">
                          <td className="py-3 px-4 font-bold">Establish QA pipeline framework</td>
                          {columnsConfig.assignee && (
                            <td className="py-3 px-3">
                              <div className="flex items-center gap-1.5">
                                <div className="h-5 w-5 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-[8px]">TL</div>
                                <span className="font-semibold text-[11px]">Tech Lead</span>
                              </div>
                            </td>
                          )}
                          {columnsConfig.dueDate && <td className="py-3 px-3 font-semibold text-zinc-500">June 15</td>}
                          {columnsConfig.projects && <td className="py-3 px-3 font-semibold text-zinc-500">Sprint Plan</td>}
                          {columnsConfig.tags && (
                            <td className="py-3 px-3">
                              <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 text-[8px] font-bold uppercase tracking-wider">engineering</span>
                            </td>
                          )}
                          {columnsConfig.blockedBy && <td className="py-3 px-3 font-semibold text-zinc-700">Alpha deploy</td>}
                          {columnsConfig.blocking && <td className="py-3 px-3 text-zinc-400 font-normal">-</td>}
                          {columnsConfig.attachments && (
                            <td className="py-3 px-4 text-right">
                              <span className="inline-flex items-center gap-1 text-[9px] text-[#777777] font-semibold bg-neutral-50 px-2 py-0.5 rounded border border-neutral-200"><Upload className="h-2.5 w-2.5" /> logs_trace.txt</span>
                            </td>
                          )}
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}

                {builderActivePreviewTab !== 'Board' && builderActivePreviewTab !== 'List' && (
                  <div className="bg-white rounded-xl border border-[#e2e2e2] p-12 text-center shadow-sm max-w-2xl mx-auto flex flex-col items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-[#f3f4f6] flex items-center justify-center text-[#777777]"><Layout className="h-5 w-5" /></div>
                    <h4 className="text-sm font-bold text-[#1a1c1c]">{builderActivePreviewTab} layout simulated</h4>
                    <p className="text-xs text-[#777777] mt-1 max-w-md leading-relaxed">This view layout will compile with default board datasets instantly upon creating new work channels from this template.</p>
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT SIDEBAR: Customize Columns & Info */}
            <aside className="w-full md:w-80 bg-white border-t md:border-t-0 md:border-l border-[#e2e2e2] flex flex-col flex-shrink-0 h-full overflow-y-auto">
              <div className="p-6 space-y-6">
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-[#777777] uppercase tracking-widest text-left">Template Details</h3>
                  <div className="flex flex-col gap-1 text-left">
                    <label className="text-[10px] font-bold text-[#555] uppercase">Template Name</label>
                    <input type="text" required value={tempBuilderTemplate.name} onChange={(e) => setTempBuilderTemplate({ ...tempBuilderTemplate, name: e.target.value })} className="w-full bg-[#f9f9f9] border border-[#e2e2e2] rounded-lg px-3 py-2 text-xs font-semibold focus:outline-none text-[#1a1c1c]" />
                  </div>
                  <div className="flex flex-col gap-1 text-left">
                    <label className="text-[10px] font-bold text-[#555] uppercase">Template Description</label>
                    <textarea value={tempBuilderTemplate.description} onChange={(e) => setTempBuilderTemplate({ ...tempBuilderTemplate, description: e.target.value })} rows="2" className="w-full bg-[#f9f9f9] border border-[#e2e2e2] rounded-lg px-3 py-2 text-xs font-normal resize-none text-[#1a1c1c]" />
                  </div>
                </div>

                {/* Show/Hide Columns Panel */}
                <div className="space-y-3 pt-4 border-t border-[#e2e2e2] text-left">
                  <h3 className="text-xs font-bold text-[#777777] uppercase tracking-widest">Customize list columns</h3>
                  <p className="text-[10px] text-[#777777] leading-normal font-normal">Check default columns to render on sprint cards list previews</p>
                  <div className="space-y-2 bg-[#f9f9f9] border border-[#e2e2e2] p-3 rounded-xl">
                    {[
                      { id: 'assignee', label: 'Assignee' },
                      { id: 'dueDate', label: 'Due date' },
                      { id: 'projects', label: 'Projects' },
                      { id: 'tags', label: 'Tags' },
                      { id: 'blockedBy', label: 'Blocked by' },
                      { id: 'blocking', label: 'Blocking' },
                      { id: 'attachments', label: 'Attachments' }
                    ].map(col => {
                      const isChecked = columnsConfig[col.id];
                      return (
                        <div 
                          key={col.id} 
                          onClick={() => setColumnsConfig(prev => ({ ...prev, [col.id]: !prev[col.id] }))}
                          className="flex items-center gap-2 cursor-pointer select-none py-0.5 hover:text-black transition-colors"
                        >
                          <input 
                            type="checkbox" 
                            checked={isChecked} 
                            onChange={() => {}} 
                            className="accent-black h-3.5 w-3.5 pointer-events-none rounded" 
                          />
                          <span className="text-xs font-semibold text-zinc-700">{col.label}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-[#e2e2e2] text-left">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-[#777777] uppercase tracking-widest">Active views (Tabs)</h3>
                    <span className="text-[10px] text-zinc-400 font-bold uppercase">{tempBuilderTemplate.activeTabs.length} active</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {['List', 'Board', 'Timeline', 'Calendar', 'Gantt', 'Dashboard', 'Messages', 'Files'].map((tab) => {
                      const isActive = tempBuilderTemplate.activeTabs.includes(tab);
                      return (
                        <button key={tab} type="button" onClick={() => handleBuilderToggleTab(tab)} className={`p-2 rounded-lg border text-left flex items-center justify-between transition-all ${
                          isActive ? 'bg-zinc-100 border-[#2d2e30] text-[#1a1c1c] font-bold' : 'bg-white border-[#e2e2e2] text-[#777777] hover:border-black'
                        }`}>
                          <span className="text-xs">{tab}</span>
                          <span className={`h-2 w-2 rounded-full ${isActive ? 'bg-[#2d2e30]' : 'bg-transparent border border-zinc-300'}`} />
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-[#e2e2e2] text-left">
                  <h3 className="text-xs font-bold text-[#777777] uppercase tracking-widest">Template Permissions</h3>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-[#555] uppercase tracking-wider flex items-center gap-1"><Lock className="h-3 w-3" /> Who can use this template</label>
                    <select value={tempBuilderTemplate.whoCanUse} onChange={(e) => setTempBuilderTemplate({ ...tempBuilderTemplate, whoCanUse: e.target.value })} className="w-full bg-[#f9f9f9] border border-[#e2e2e2] rounded-lg px-2.5 py-2 text-xs font-bold focus:bg-white text-[#1a1c1c] outline-none">
                      <option value="Anyone in organization">Anyone in organization</option>
                      <option value="Invite-only workspace members">Invite-only workspace members</option>
                      <option value="Admins & owners only">Admins & owners only</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-[#555] uppercase tracking-wider flex items-center gap-1"><Edit3 className="h-3 w-3" /> Editor Permissions</label>
                    <select value={tempBuilderTemplate.whoCanEdit} onChange={(e) => setTempBuilderTemplate({ ...tempBuilderTemplate, whoCanEdit: e.target.value })} className="w-full bg-[#f9f9f9] border border-[#e2e2e2] rounded-lg px-2.5 py-2 text-xs font-bold focus:bg-white text-[#1a1c1c] outline-none">
                      <option value="Anyone with access">Anyone with access can edit</option>
                      <option value="Only template owners">Only template owners can edit</option>
                    </select>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      ) : activeStatusBuilderId && tempStatusBuilder ? (
        /* --- STATUS TEMPLATE WORKSHEET BUILDER --- */
        <div className="flex-1 flex flex-col h-full bg-[#f9f9f9] overflow-hidden">
          
          <div className="px-6 py-4 border-b border-[#e2e2e2] bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 flex-shrink-0">
            <div className="flex items-center gap-3">
              <button onClick={handleStatusBuilderCancel} className="p-1.5 hover:bg-[#f3f4f6] border border-[#e2e2e2] rounded-lg text-zinc-500 transition-colors">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest flex items-center gap-1 animate-pulse">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    Status Template Worksheet Editor
                  </span>
                  <span className="bg-zinc-100 text-zinc-800 px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider">
                    {tempStatusBuilder.type} template
                  </span>
                </div>
                <h1 className="text-base font-bold text-[#1a1c1c] mt-0.5">Customize: {tempStatusBuilder.name}</h1>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button type="button" onClick={handleStatusBuilderCancel} className="px-4 py-2 border border-[#e2e2e2] hover:bg-[#f9f9f9] rounded-lg text-xs font-semibold text-[#777777] hover:text-black">
                Discard
              </button>
              <button type="button" onClick={handleStatusBuilderSave} className="px-4 py-2 bg-black hover:bg-neutral-800 text-white text-xs font-bold tracking-wider uppercase rounded-lg shadow flex items-center gap-1.5">
                <Check className="h-4 w-4" />
                <span>Save report template</span>
              </button>
            </div>
          </div>

          <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden relative">
            <div className="flex-1 p-8 bg-[#f5f6f8] overflow-y-auto">
              <div className="max-w-3xl mx-auto bg-white rounded-2xl border border-[#e2e2e2] shadow-lg overflow-hidden flex flex-col">
                
                <div className="bg-[#1e1f21] text-white p-6 flex items-center justify-between">
                  <div>
                    <span className="text-[9px] font-bold uppercase tracking-widest text-[#a5a6a7]">Draft Status Report Preview</span>
                    <h2 className="text-base font-bold tracking-tight mt-0.5">{tempStatusBuilder.name}</h2>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-zinc-400 font-semibold block">Owner: guest@crewflow.com</span>
                    <span className="text-[9px] text-zinc-500 italic block mt-0.5">Generated via Status Engine</span>
                  </div>
                </div>

                <div className="p-8 space-y-6">
                  {tempStatusBuilder.blocks.length === 0 ? (
                    <div className="py-12 border-2 border-dashed border-[#c5c6c7] rounded-xl text-center text-zinc-400 italic">
                      <FileText className="h-8 w-8 mx-auto mb-2 text-zinc-300 stroke-[1.5px]" />
                      <span>This report has no content blocks yet. Add blocks from the toolkit sidebar!</span>
                    </div>
                  ) : (
                    tempStatusBuilder.blocks.map((blockId, index) => (
                      <div key={blockId} className="bg-[#f9f9f9] border border-[#e2e2e2] rounded-xl p-5 shadow-xs relative group flex flex-col gap-3">
                        <div className="absolute right-3 top-3 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 bg-white border border-[#e2e2e2] rounded-lg shadow-sm p-0.5">
                          <button type="button" disabled={index === 0} onClick={() => handleStatusBuilderMoveBlock(index, -1)} className="p-1 hover:bg-[#f3f4f6] rounded disabled:opacity-30"><ArrowUp className="h-3 w-3 text-zinc-600" /></button>
                          <button type="button" disabled={index === tempStatusBuilder.blocks.length - 1} onClick={() => handleStatusBuilderMoveBlock(index, 1)} className="p-1 hover:bg-[#f3f4f6] rounded disabled:opacity-30"><ArrowDown className="h-3 w-3 text-zinc-600" /></button>
                          <button type="button" onClick={() => handleStatusBuilderRemoveBlock(blockId)} className="p-1 hover:bg-red-50 hover:text-red-700 rounded text-zinc-400"><X className="h-3 w-3" /></button>
                        </div>

                        {blockId === 'status-indicator' && (
                          <div>
                            <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">Set Overall Project Status</span>
                            <div className="flex items-center gap-2 mt-1">
                              {[
                                { name: 'On Track', color: 'bg-emerald-500 text-white', border: 'border-emerald-500' },
                                { name: 'At Risk', color: 'bg-amber-500 text-white', border: 'border-amber-500' },
                                { name: 'Off Track', color: 'bg-red-500 text-white', border: 'border-red-500' },
                                { name: 'On Hold', color: 'bg-zinc-400 text-white', border: 'border-zinc-400' }
                              ].map(st => (
                                <button type="button" key={st.name} onClick={() => setSimulatedReportStatus(st.name)} className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-all ${simulatedReportStatus === st.name ? st.color : 'bg-white border-[#e2e2e2] text-zinc-500'}`}>{st.name}</button>
                              ))}
                            </div>
                          </div>
                        )}

                        {blockId === 'tasks-section' && (
                          <div>
                            <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider block mb-2">Tasks stage breakdown</span>
                            <div className="space-y-2 mt-1">
                              {[
                                { label: 'Sprint Backlog', count: 12, pct: '50%', bg: 'bg-zinc-400' },
                                { label: 'Ready for Dev', count: 6, pct: '25%', bg: 'bg-blue-400' },
                                { label: 'In Progress', count: 4, pct: '16%', bg: 'bg-purple-400' },
                                { label: 'QA / Review', count: 2, pct: '8%', bg: 'bg-amber-400' }
                              ].map(sec => (
                                <div key={sec.label} className="text-xs">
                                  <div className="flex justify-between font-semibold mb-0.5 text-zinc-700"><span>{sec.label}</span><span>{sec.count} tasks ({sec.pct})</span></div>
                                  <div className="w-full h-2 bg-neutral-200 rounded-full overflow-hidden"><div className={`h-full rounded-full ${sec.bg}`} style={{ width: sec.pct }} /></div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {blockId === 'tasks-assignee' && (
                          <div>
                            <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider block mb-2">Member Completed vs Incomplete Velocity</span>
                            <div className="space-y-3 mt-1 text-xs">
                              {[
                                { name: 'tech-lead@crewflow.com', comp: 14, inc: 4 },
                                { name: 'member@crewflow.com', comp: 9, inc: 8 },
                                { name: 'admin@crewflow.com', comp: 12, inc: 1 }
                              ].map(m => (
                                <div key={m.name} className="flex flex-col gap-1 border-b border-[#e2e2e2]/60 pb-2 last:border-b-0">
                                  <span className="font-bold text-[#1a1c1c]">{m.name}</span>
                                  <div className="flex items-center gap-2">
                                    <div className="flex-1 h-3 bg-neutral-200 rounded overflow-hidden flex">
                                      <div className="h-full bg-emerald-500" style={{ width: `${(m.comp / (m.comp + m.inc)) * 100}%` }} />
                                      <div className="h-full bg-red-400" style={{ width: `${(m.inc / (m.comp + m.inc)) * 100}%` }} />
                                    </div>
                                    <span className="text-[10px] font-semibold text-zinc-500 whitespace-nowrap">{m.comp} compl / {m.inc} remaining</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {blockId === 'milestones' && (
                          <div>
                            <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider block mb-2">Milestone Tasks Approval Tracker</span>
                            <div className="space-y-1.5 mt-1 text-xs font-semibold text-[#1a1c1c]">
                              {[
                                { name: 'Design Specs Signoff', status: 'Approved', date: '2026-05-10', approved: true },
                                { name: 'Alpha Beta Deployment', status: 'Approved', date: '2026-05-25', approved: true },
                                { name: 'Public Marketing Campaign Release', status: 'Pending Review', date: '2026-06-15', approved: false }
                              ].map((ms, idx) => (
                                <div key={idx} className="flex items-center justify-between p-2 bg-white rounded-lg border border-[#e2e2e2]">
                                  <div className="flex items-center gap-2">
                                    {ms.approved ? <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0" /> : <div className="h-4 w-4 rounded-full border border-neutral-300 flex items-center justify-center text-[8px] text-[#777777] font-bold">!</div>}
                                    <span className={ms.approved ? 'line-through text-[#777777]' : ''}>{ms.name}</span>
                                  </div>
                                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${ms.approved ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>{ms.status}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {blockId === 'narrative' && (
                          <div className="relative text-left">
                            {focusedNarrativeField === 'narrative' && (
                              <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black/90 backdrop-blur-md text-white rounded-lg shadow-xl px-2 py-1 flex items-center gap-1.5 animate-bounce-in z-30 font-sans select-none">
                                {[
                                  { id: 'bold', label: 'B', title: 'Bold' },
                                  { id: 'italic', label: 'I', title: 'Italic' },
                                  { id: 'underline', label: 'U', title: 'Underline' },
                                  { id: 'strike', label: 'S', title: 'Strikethrough' },
                                  { id: 'list-bullet', label: '• List', title: 'Bullet list' },
                                  { id: 'list-number', label: '1. List', title: 'Numbered list' },
                                  { id: 'code', label: '<>', title: 'Code block' },
                                  { id: 'link', label: 'Link', title: 'Insert link' }
                                ].map(btn => {
                                  const isActive = simulatedRichTextFormat[btn.id];
                                  return (
                                    <button
                                      key={btn.id}
                                      type="button"
                                      onMouseDown={(e) => {
                                        e.preventDefault(); // prevents textarea from losing focus!
                                        setSimulatedRichTextFormat(prev => ({ ...prev, [btn.id]: !prev[btn.id] }));
                                      }}
                                      className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${
                                        isActive ? 'bg-white/30 text-white' : 'hover:bg-white/10 text-neutral-300'
                                      }`}
                                      title={btn.title}
                                    >
                                      {btn.label}
                                    </button>
                                  );
                                })}
                              </div>
                            )}

                            <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">Narrative Summary Report</span>
                            <textarea 
                              onFocus={() => setFocusedNarrativeField('narrative')}
                              onBlur={() => setFocusedNarrativeField(null)}
                              className={`w-full bg-white border border-[#e2e2e2] p-3 rounded-lg text-xs leading-relaxed resize-none h-24 focus:outline-none focus:border-black transition-all ${
                                simulatedRichTextFormat.bold ? 'font-bold' : ''
                              } ${
                                simulatedRichTextFormat.italic ? 'italic' : ''
                              } ${
                                simulatedRichTextFormat.underline ? 'underline' : ''
                              } ${
                                simulatedRichTextFormat.strike ? 'line-through' : ''
                              } ${
                                simulatedRichTextFormat.code ? 'font-mono bg-neutral-50 border-neutral-300' : ''
                              }`} 
                              defaultValue="[Draft Narrative Outline]&#10;• Key achievements this reporting cycle:&#10;• Core roadblocks & sprint blockers:&#10;• Focus items for subsequent sprint execution:" 
                            />
                          </div>
                        )}

                        {blockId === 'projects-grid' && (
                          <div>
                            <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider block mb-2">Portfolio Project Health matrix</span>
                            <div className="bg-white rounded-lg border border-[#e2e2e2] overflow-hidden text-xs">
                              <table className="w-full text-left">
                                <thead className="bg-[#f3f4f6]">
                                  <tr className="text-[9px] font-bold text-neutral-400 uppercase">
                                    <th className="py-2 px-3">Project</th>
                                    <th className="py-2 px-2">Health</th>
                                    <th className="py-2 px-2">Owner</th>
                                    <th className="py-2 px-3 text-right">Tasks Done</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {[
                                    { name: 'CrewFlow Product Launch', status: 'On Track', color: 'bg-emerald-500', owner: 'tech-lead@', pct: '85%' },
                                    { name: 'Monochrome Overhaul', status: 'At Risk', color: 'bg-amber-500', owner: 'guest@', pct: '40%' },
                                    { name: 'Strategy Board 2.0', status: 'On Hold', color: 'bg-zinc-400', owner: 'admin@', pct: '12%' }
                                  ].map((p, idx) => (
                                    <tr key={idx}>
                                      <td className="py-2.5 px-3 font-bold">{p.name}</td>
                                      <td className="py-2.5 px-2"><div className="flex items-center gap-1.5"><div className={`h-2 w-2 rounded-full ${p.color}`} /><span className="font-semibold text-[10px]">{p.status}</span></div></td>
                                      <td className="py-2.5 px-2 font-semibold text-zinc-500">{p.owner}</td>
                                      <td className="py-2.5 px-3 text-right font-bold">{p.pct}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        )}

                        {blockId === 'ontrack-counts' && (
                          <div>
                            <span className="text-[9px] font-bold text-neutral-400 uppercase block mb-2">Projects Status Breakdown Metrics</span>
                            <div className="grid grid-cols-3 gap-2">
                              {[
                                { label: 'On Track', val: '4 Projects', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
                                { label: 'At Risk', val: '2 Projects', color: 'text-amber-700 bg-amber-50 border-amber-200' },
                                { label: 'Off Track / Hold', val: '1 Project', color: 'text-zinc-700 bg-zinc-50 border-zinc-200' }
                              ].map((m, idx) => (
                                <div key={idx} className={`p-3 rounded-lg border text-center ${m.color}`}>
                                  <span className="text-[10px] font-semibold block">{m.label}</span>
                                  <span className="text-xs font-bold block mt-0.5">{m.val}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {blockId === 'project-owners' && (
                          <div>
                            <span className="text-[9px] font-bold text-neutral-400 uppercase block mb-1">Project Owners Table</span>
                            <div className="space-y-1.5 mt-1 text-xs">
                              {[
                                { name: 'Tech Lead Org', email: 'tech-lead@crewflow.com', count: 3 },
                                { name: 'Guest User', email: 'guest@crewflow.com', count: 2 }
                              ].map((o, idx) => (
                                <div key={idx} className="flex items-center justify-between p-2 bg-white rounded-lg border border-[#e2e2e2]">
                                  <div className="flex items-center gap-2">
                                    <div className="h-6 w-6 rounded-full bg-zinc-200 flex items-center justify-center font-bold text-[9px]">{o.name.split(' ').map(n => n[0]).join('')}</div>
                                    <span className="font-semibold">{o.name}</span>
                                  </div>
                                  <span className="text-[10px] text-zinc-500 font-bold bg-[#f3f4f6] px-2 py-0.5 rounded">{o.count} Projects linked</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                      </div>
                    ))
                  )}
                </div>

              </div>
            </div>

            <aside className="w-full md:w-80 bg-white border-l border-[#e2e2e2] flex flex-col h-full overflow-y-auto">
              <div className="p-6 space-y-6">
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-[#777777] uppercase tracking-widest">Template Details</h3>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-[#555] uppercase">Report Name</label>
                    <input type="text" required value={tempStatusBuilder.name} onChange={(e) => setTempStatusBuilder({ ...tempStatusBuilder, name: e.target.value })} className="w-full bg-[#f9f9f9] border border-[#e2e2e2] rounded-lg px-3 py-2 text-xs font-semibold focus:outline-none focus:bg-white" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-[#555] uppercase">Template Description</label>
                    <textarea value={tempStatusBuilder.description} onChange={(e) => setTempStatusBuilder({ ...tempStatusBuilder, description: e.target.value })} rows="2" className="w-full bg-[#f9f9f9] border border-[#e2e2e2] rounded-lg px-3 py-2 text-xs resize-none" />
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-[#e2e2e2]">
                  <h3 className="text-xs font-bold text-[#777777] uppercase tracking-widest">Content Blocks Library</h3>
                  {tempStatusBuilder.type === 'Project' ? (
                    <div className="flex flex-col gap-2">
                      {[
                        { id: 'status-indicator', label: 'Overall Status Pill Trigger', desc: 'Sets On/Off track indicator buttons', icon: Sliders },
                        { id: 'tasks-section', label: 'Tasks by Section Chart', desc: 'Stage column task counts progress bars', icon: BarChart2 },
                        { id: 'tasks-assignee', label: 'Tasks by Assignee Chart', desc: 'Assignees task velocity charts', icon: Users },
                        { id: 'milestones', label: 'Milestones checklist table', desc: 'Table for project approval milestones', icon: ListTodo },
                        { id: 'narrative', label: 'Narrative summary rich text', desc: 'Narrative outline textbox area', icon: AlignLeft }
                      ].map(bl => {
                        const Icon = bl.icon;
                        const alreadyIn = tempStatusBuilder.blocks.includes(bl.id);
                        return (
                          <button key={bl.id} type="button" onClick={() => handleStatusBuilderAddBlock(bl.id)} disabled={alreadyIn} className={`p-2.5 rounded-lg border text-left flex items-start gap-3 transition-all ${alreadyIn ? 'bg-zinc-50 text-zinc-300 cursor-not-allowed border-neutral-200' : 'bg-white border-[#e2e2e2] hover:border-black'}`}>
                            <div className="p-1 rounded bg-[#f3f4f6] text-[#777777]"><Icon className="h-4 w-4" /></div>
                            <div className="min-w-0">
                              <span className="text-xs font-bold block truncate">{bl.label}</span>
                              <span className="text-[10px] text-zinc-400 block font-normal mt-0.5 leading-tight">{bl.desc}</span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2">
                      {[
                        { id: 'projects-grid', label: 'Projects status health grid', desc: 'Full projects table with owners', icon: FileSpreadsheet },
                        { id: 'ontrack-counts', label: 'On/Off Track metrics cards', desc: 'Cards listing project status sums', icon: PieChart },
                        { id: 'project-owners', label: 'Project Owners directory list', desc: 'Users row directory grouping', icon: Users }
                      ].map(bl => {
                        const Icon = bl.icon;
                        const alreadyIn = tempStatusBuilder.blocks.includes(bl.id);
                        return (
                          <button key={bl.id} type="button" onClick={() => handleStatusBuilderAddBlock(bl.id)} disabled={alreadyIn} className={`p-2.5 rounded-lg border text-left flex items-start gap-3 transition-all ${alreadyIn ? 'bg-zinc-50 text-zinc-300 cursor-not-allowed border-neutral-200' : 'bg-white border-[#e2e2e2] hover:border-black'}`}>
                            <div className="p-1 rounded bg-[#f3f4f6] text-[#777777]"><Icon className="h-4 w-4" /></div>
                            <div className="min-w-0">
                              <span className="text-xs font-bold block truncate">{bl.label}</span>
                              <span className="text-[10px] text-zinc-400 block font-normal mt-0.5 leading-tight">{bl.desc}</span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div className="space-y-1.5 pt-4 border-t border-[#e2e2e2]">
                  <label className="text-[10px] font-bold text-[#555] uppercase">Sharing Settings</label>
                  <select value={tempStatusBuilder.sharing} onChange={(e) => setTempStatusBuilder({ ...tempStatusBuilder, sharing: e.target.value })} className="w-full bg-[#f9f9f9] border border-[#e2e2e2] rounded-lg px-2.5 py-2 text-xs font-bold focus:bg-white text-[#1a1c1c] outline-none">
                    <option value="Public in organization">Public in organization</option>
                    <option value="Shared with Managers">Shared with Managers</option>
                    <option value="Private report channel">Private report channel</option>
</select>
                </div>
              </div>
            </aside>
          </div>
        </div>
      ) : activeFormDesignerId && tempFormDesigner ? (
        /* --- INTAKE FORM VISUAL DESIGNER CANVAS --- */
        <div className="flex-1 flex flex-col h-full bg-[#f9f9f9] overflow-hidden">
          
          {/* Header Banner */}
          <div className="px-6 py-4 border-b border-[#e2e2e2] bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 flex-shrink-0">
            <div className="flex items-center gap-3">
              <button onClick={handleFormDesignerCancel} className="p-1.5 hover:bg-[#f3f4f6] border border-[#e2e2e2] rounded-lg text-zinc-500 transition-colors">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <div>
                <span className="text-[10px] text-indigo-600 font-bold uppercase tracking-widest flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse" />
                  Intake Form Designer Canvas
                </span>
                <h1 className="text-base font-bold text-[#1a1c1c] mt-0.5">Customize Form: {tempFormDesigner.name}</h1>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button type="button" onClick={handleFormDesignerCancel} className="px-4 py-2 border border-[#e2e2e2] hover:bg-[#f9f9f9] rounded-lg text-xs font-semibold text-[#777777] hover:text-black">
                Discard
              </button>
              <button type="button" onClick={handleFormDesignerSave} className="px-4 py-2 bg-black hover:bg-neutral-800 text-white text-xs font-bold tracking-wider uppercase rounded-lg shadow flex items-center gap-1.5">
                <Check className="h-4 w-4" />
                <span>Save & Publish Intake Form</span>
              </button>
            </div>
          </div>

          <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden relative">
            
            {/* LEFT CANVAS: Interactive Mock form view simulator */}
            <div className="flex-1 p-8 bg-[#f5f6f8] overflow-y-auto">
              
              {/* Alert Warning Banner */}
              <div className="max-w-2xl mx-auto bg-amber-50 border border-amber-200 text-amber-800 p-4 text-left rounded-xl mb-4 font-semibold text-[11px] flex items-start gap-2.5 select-none leading-relaxed">
                <span className="p-0.5 bg-amber-200 text-amber-800 rounded-full font-bold h-4.5 w-4.5 flex items-center justify-center text-[10px] flex-shrink-0">!</span>
                <div>
                  <span className="font-bold">Trial Workspace Warning:</span> Only other users in your Asana instance will be able to see your Form during your free trial. You can configure sharing settings in the right tab.
                </div>
              </div>

              <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-[#e2e2e2] shadow-lg overflow-hidden flex flex-col">
                
                {/* Form header branding Cover Image placeholder */}
                <div className="bg-neutral-50 border-b border-[#e2e2e2] p-4 flex items-center justify-center gap-3">
                  <div className="w-full h-32 rounded-xl bg-zinc-100 border border-dashed border-zinc-300 flex flex-col items-center justify-center gap-2 group hover:bg-zinc-200/50 hover:border-zinc-400 transition-all cursor-pointer">
                    <Upload className="h-5 w-5 text-zinc-400" />
                    <span className="text-[10px] font-bold text-zinc-500 uppercase">Add Cover Image</span>
                    <span className="text-[9px] text-zinc-400 font-normal">Recommending 1200 x 300 grayscale banner</span>
                  </div>
                </div>

                {/* Form Configuration row */}
                <div className="p-4 bg-[#fafafa] border-b border-[#e2e2e2] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Configure Form Questions</span>
                  </div>
                  <button 
                    type="button"
                    onClick={() => setIsAddedToFormModalOpen(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#e2e2e2] hover:border-black bg-white text-xs font-bold transition-all text-[#1a1c1c] cursor-pointer"
                  >
                    <span>Fields {tempFormDesigner.fields.length} &gt;</span>
                  </button>
                </div>

                {/* Editable Title & description header card */}
                <div className="p-6 border-b border-[#e2e2e2] space-y-3 bg-[#fafafa]">
                  <input
                    type="text"
                    value={tempFormDesigner.name}
                    onChange={(e) => setTempFormDesigner({ ...tempFormDesigner, name: e.target.value })}
                    className="w-full bg-white border border-[#e2e2e2] rounded-lg px-3 py-2 text-sm font-bold text-[#1a1c1c] focus:bg-white focus:border-black outline-none transition-all"
                    placeholder="Form Title"
                  />
                  <textarea
                    value={tempFormDesigner.description || ''}
                    onChange={(e) => setTempFormDesigner({ ...tempFormDesigner, description: e.target.value })}
                    rows="2"
                    className="w-full bg-white border border-[#e2e2e2] rounded-lg px-3 py-2 text-xs text-[#777777] font-normal leading-relaxed focus:bg-white focus:border-black outline-none resize-none transition-all"
                    placeholder="Add form description or instruction guidelines for request submitters..."
                  />
                </div>

                {/* Form Fields display or success state */}
                {designerSuccessState ? (
                  /* GORGEOUS SUCCESS CONFIRMATION MOCKUP VIEW */
                  <div className="p-12 text-center flex flex-col items-center gap-4 animate-fade-in">
                    <div className="h-16 w-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center border border-emerald-200 shadow-sm mb-2">
                      <Check className="h-8 w-8 stroke-[2.5px]" />
                    </div>
                    <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest bg-emerald-50 border border-emerald-200/50 px-2 py-0.5 rounded-full">Intake Brief Logged</span>
                    <h3 className="text-lg font-bold tracking-tight text-[#1a1c1c]">{tempFormDesigner.name}</h3>
                    <p className="text-xs text-[#777777] max-w-sm leading-relaxed mt-1">{tempFormDesigner.confirmText || 'Thank you for your creative submission! We will verify details within 24 hours.'}</p>
                    
                    {/* Simulated details preview */}
                    <div className="w-full max-w-md bg-neutral-50 rounded-xl border border-[#e2e2e2] p-4 text-left mt-4 text-[11px] text-zinc-600 space-y-2">
                      <div className="font-bold text-xs border-b border-[#e2e2e2] pb-1.5 mb-2 text-[#1a1c1c] uppercase tracking-wider">Test Submission Ledger</div>
                      <div><span className="font-bold text-[#777777]">Brief Name:</span> {simulatedInputs.title}</div>
                      {simulatedInputs.description && <div><span className="font-bold text-[#777777]">Description:</span> {simulatedInputs.description}</div>}
                      {simulatedInputs.priority && <div><span className="font-bold text-[#777777]">Priority:</span> <span className="font-bold text-[#1a1c1c]">{simulatedInputs.priority}</span></div>}
                      {simulatedInputs['due-date'] && <div><span className="font-bold text-[#777777]">Due Date:</span> {simulatedInputs['due-date']}</div>}
                      {simulatedInputs.attachment && <div><span className="font-bold text-[#777777]">Attached file:</span> {simulatedInputs.attachment}</div>}
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setDesignerSuccessState(false);
                        setSimulatedInputs({
                          title: '',
                          description: '',
                          priority: 'Medium',
                          'due-date': '',
                          'attachment': null,
                          'custom-repro-steps': '',
                          'custom-text': '',
                          'custom-number': ''
                        });
                      }}
                      className="mt-6 px-4 py-2 border border-black hover:bg-[#fafafa] rounded-lg text-xs font-bold uppercase tracking-wider text-black transition-colors"
                    >
                      Submit Another Test Brief
                    </button>
                  </div>
                ) : (
                  /* INTERACTIVE WRITABLE SIMULATOR FORM */
                  <form onSubmit={handleSimulatedFormSubmit} className="p-8 space-y-5 text-left">
                    
                    {/* Task title (Static/Required) */}
                    <div className="flex flex-col gap-1.5 bg-[#f9f9f9]/80 p-4 rounded-xl border border-[#e2e2e2]/60 relative">
                      <label className="text-[10px] font-bold text-[#1a1c1c] uppercase flex items-center gap-1">
                        Task / Brief Name <span className="text-red-500 font-bold">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={simulatedInputs.title}
                        onChange={(e) => setSimulatedInputs({ ...simulatedInputs, title: e.target.value })}
                        placeholder="e.g. Design beta splash page"
                        className="w-full bg-white border border-[#e2e2e2] rounded-lg px-3 py-2 text-xs font-semibold outline-none focus:border-black transition-all text-[#1a1c1c]"
                      />
                      <span className="text-[8px] text-zinc-400 font-bold uppercase absolute right-4 top-4">System Required</span>
                    </div>

                    {/* Task description (Static/Required) */}
                    <div className="flex flex-col gap-1.5 bg-[#f9f9f9]/80 p-4 rounded-xl border border-[#e2e2e2]/60 relative">
                      <label className="text-[10px] font-bold text-[#1a1c1c] uppercase">Detailed brief request description</label>
                      <textarea
                        rows="3"
                        value={simulatedInputs.description}
                        onChange={(e) => setSimulatedInputs({ ...simulatedInputs, description: e.target.value })}
                        placeholder="Provide operational scope details, guidelines or copy text..."
                        className="w-full bg-white border border-[#e2e2e2] rounded-lg px-3 py-2 text-xs font-normal outline-none focus:border-black resize-none transition-all text-[#1a1c1c] leading-relaxed"
                      />
                      <span className="text-[8px] text-zinc-400 font-bold uppercase absolute right-4 top-4">System Required</span>
                    </div>

                    {/* Optional/Dynamic fields configured */}
                    {tempFormDesigner.fields.map(fieldId => {
                      if (fieldId === 'title' || fieldId === 'description') return null;

                      return (
                        <div key={fieldId} className="flex flex-col gap-1.5 p-4 rounded-xl border border-[#e2e2e2] bg-white relative group animate-fade-in">
                          
                          {/* Remove block button */}
                          <button
                            type="button"
                            onClick={() => handleFormDesignerRemoveField(fieldId)}
                            className="absolute right-3.5 top-3.5 opacity-0 group-hover:opacity-100 p-1 hover:bg-red-50 text-zinc-400 hover:text-red-700 rounded transition-all"
                            title="Remove field widget"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>

                          {fieldId === 'attachment' && (
                            <>
                              <label className="text-[10px] font-bold text-[#555] uppercase tracking-wider">Supporting Attachments & Files</label>
                              {simulatedInputs.attachment ? (
                                <div className="border border-[#e2e2e2] p-3 rounded-lg bg-[#fafafa] flex items-center justify-between text-xs">
                                  <div className="flex items-center gap-2 text-[#1a1c1c] font-semibold">
                                    <Upload className="h-4 w-4 text-indigo-500" />
                                    <span>{simulatedInputs.attachment}</span>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => setSimulatedInputs({ ...simulatedInputs, attachment: null })}
                                    className="p-1 text-zinc-400 hover:text-red-700 hover:bg-red-50 rounded transition-all"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </button>
                                </div>
                              ) : (
                                <div 
                                  onClick={() => setSimulatedInputs({ ...simulatedInputs, attachment: 'Creative_Spec_Brief_V2.png (2.4 MB)' })}
                                  className="border border-dashed border-[#c5c6c7] p-5 rounded-lg text-center bg-[#fafafa] hover:bg-[#f3f4f6] hover:border-black transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5"
                                >
                                  <Upload className="h-5 w-5 text-zinc-400 animate-bounce" />
                                  <span className="text-[10px] font-bold text-[#777777] uppercase">Click to upload mock files</span>
                                  <span className="text-[9px] text-zinc-400 font-normal">Supports PDF, PNG, JPG, or DOC (Max 25MB)</span>
                                </div>
                              )}
                            </>
                          )}

                          {fieldId === 'due-date' && (
                            <>
                              <label className="text-[10px] font-bold text-[#555] uppercase tracking-wider">Target Delivery due date</label>
                              <div className="relative">
                                <input
                                  type="date"
                                  value={simulatedInputs['due-date']}
                                  onChange={(e) => setSimulatedInputs({ ...simulatedInputs, 'due-date': e.target.value })}
                                  className="w-full bg-white border border-[#e2e2e2] rounded-lg px-3 py-2 text-xs font-semibold outline-none focus:border-black transition-all text-[#1a1c1c]"
                                />
                              </div>
                            </>
                          )}

                          {fieldId === 'priority' && (
                            <>
                              <label className="text-[10px] font-bold text-[#555] uppercase tracking-wider">Indicate Priority Level</label>
                              <div className="relative">
                                <select 
                                  value={simulatedInputs.priority}
                                  onChange={(e) => setSimulatedInputs({ ...simulatedInputs, priority: e.target.value })}
                                  className="w-full bg-white border border-[#e2e2e2] rounded-lg px-3 py-2 text-xs outline-none focus:border-black font-bold text-[#1a1c1c]"
                                >
                                  <option value="Low">Low Priority</option>
                                  <option value="Medium">Medium Priority</option>
                                  <option value="High">High Priority</option>
                                </select>
                              </div>
                            </>
                          )}

                          {fieldId === 'custom-repro-steps' && (
                            <>
                              <label className="text-[10px] font-bold text-[#555] uppercase tracking-wider">Steps to reproduce the bug</label>
                              <textarea
                                rows="3"
                                value={simulatedInputs['custom-repro-steps']}
                                onChange={(e) => setSimulatedInputs({ ...simulatedInputs, 'custom-repro-steps': e.target.value })}
                                placeholder="e.g. 1. Visit landing tab... 2. Click invite member..."
                                className="w-full bg-white border border-[#e2e2e2] rounded-lg px-3 py-2 text-xs font-medium outline-none focus:border-black resize-none text-[#1a1c1c]"
                              />
                            </>
                          )}

                          {fieldId === 'custom-text' && (
                            <>
                              <label className="text-[10px] font-bold text-[#555] uppercase tracking-wider">Custom question text field</label>
                              <input
                                type="text"
                                value={simulatedInputs['custom-text']}
                                onChange={(e) => setSimulatedInputs({ ...simulatedInputs, 'custom-text': e.target.value })}
                                placeholder="Freeform answer input"
                                className="w-full bg-white border border-[#e2e2e2] rounded-lg px-3 py-2 text-xs font-semibold outline-none focus:border-black text-[#1a1c1c]"
                              />
                            </>
                          )}

                          {fieldId === 'custom-number' && (
                            <>
                              <label className="text-[10px] font-bold text-[#555] uppercase tracking-wider">Custom numeric question field</label>
                              <input
                                type="number"
                                value={simulatedInputs['custom-number']}
                                onChange={(e) => setSimulatedInputs({ ...simulatedInputs, 'custom-number': e.target.value })}
                                placeholder="Numeric input"
                                className="w-full bg-white border border-[#e2e2e2] rounded-lg px-3 py-2 text-xs font-semibold outline-none focus:border-black text-[#1a1c1c]"
                              />
                            </>
                          )}

                        </div>
                      );
                    })}

                    <div className="pt-4 flex items-center justify-end">
                      <button
                        type="submit"
                        disabled={!simulatedInputs.title.trim()}
                        className="bg-[#2d2e30] hover:bg-black disabled:opacity-50 text-white px-5 py-2.5 rounded-lg text-xs font-bold tracking-wider uppercase transition-colors shadow-md flex items-center gap-1.5"
                      >
                        <Zap className="h-4 w-4" />
                        <span>Submit Intake Request</span>
                      </button>
                    </div>

                  </form>
                )}

              </div>
            </div>

            {/* RIGHT SIDEBAR: Toolkit & settings */}
            <aside className="w-full md:w-80 bg-white border-l border-[#e2e2e2] flex flex-col h-full overflow-hidden">
              
              {/* Tab toggles */}
              <div className="grid grid-cols-2 border-b border-[#e2e2e2] flex-shrink-0">
                <button
                  type="button"
                  onClick={() => setDesignerRightTab('toolkit')}
                  className={`py-3 text-xs font-bold uppercase tracking-wider text-center border-b-2 transition-all ${
                    designerRightTab === 'toolkit' ? 'border-black text-black' : 'border-transparent text-zinc-400 hover:text-black'
                  }`}
                >
                  Form Toolkit
                </button>
                <button
                  type="button"
                  onClick={() => setDesignerRightTab('settings')}
                  className={`py-3 text-xs font-semibold uppercase tracking-wider text-center border-b-2 transition-all ${
                    designerRightTab === 'settings' ? 'border-black text-black' : 'border-transparent text-zinc-400 hover:text-black'
                  }`}
                >
                  Settings
                </button>
              </div>

              {/* Designer controls panel */}
              <div className="flex-1 overflow-y-auto p-6 text-left">
                
                {/* TOOLKIT TAB */}
                {designerRightTab === 'toolkit' && (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-xs font-bold text-[#777777] uppercase tracking-widest">Optional Form Fields</h3>
                      <p className="text-[10px] text-zinc-400 mt-1 font-normal leading-normal">Click buttons below to inject custom layout questions into the questionnaire sheets.</p>
                    </div>

                    <div className="flex flex-col gap-2">
                      {[
                        { id: 'attachment', label: '+ File Attachment Widget', desc: 'dashed box for drag/drop files', icon: Upload },
                        { id: 'due-date', label: '+ Due Date Picker', desc: 'date selection for task due-date', icon: Calendar },
                        { id: 'priority', label: '+ Priority Dropdown', desc: 'P0/P1/P2 priority tags selector', icon: Sliders },
                        { id: 'custom-repro-steps', label: '+ Repro steps brief', desc: 'detailed text area bug tracking', icon: AlignLeft },
                        { id: 'custom-text', label: '+ Custom Text field', desc: 'empty freeform single-line input', icon: AlignLeft },
                        { id: 'custom-number', label: '+ Custom Number field', desc: 'empty numeric validation input', icon: Hash }
                      ].map(tk => {
                        const Icon = tk.icon;
                        const alreadyAdded = tempFormDesigner.fields.includes(tk.id);
                        return (
                          <button
                            key={tk.id}
                            type="button"
                            onClick={() => handleFormDesignerAddField(tk.id)}
                            disabled={alreadyAdded}
                            className={`p-2.5 rounded-lg border text-left flex items-start gap-3 transition-all ${
                              alreadyAdded
                                ? 'bg-zinc-50 border-neutral-200 text-zinc-300 cursor-not-allowed'
                                : 'bg-white border-[#e2e2e2] hover:border-black text-[#1a1c1c]'
                            }`}
                          >
                            <div className="p-1 rounded bg-[#f3f4f6] text-[#777777]"><Icon className="h-4 w-4" /></div>
                            <div className="min-w-0">
                              <span className="text-xs font-bold block truncate">{tk.label}</span>
                              <span className="text-[10px] text-zinc-400 block font-normal mt-0.5 leading-tight">{tk.desc}</span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* SETTINGS TAB */}
                {designerRightTab === 'settings' && (
                  <div className="space-y-5">
                    <h3 className="text-xs font-bold text-[#777777] uppercase tracking-widest">Submission Actions</h3>
                    
                    {/* Destination project board selection */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-[#555] uppercase tracking-wider">Inject Submissions into</label>
                      <select
                        value={tempFormDesigner.targetProject}
                        onChange={(e) => setTempFormDesigner({ ...tempFormDesigner, targetProject: e.target.value })}
                        className="w-full bg-[#f9f9f9] border border-[#e2e2e2] rounded-lg px-2.5 py-2 text-xs font-bold text-[#1a1c1c] focus:bg-white"
                      >
                        {projects.map(p => (
                          <option key={p._id} value={p.name}>{p.name}</option>
                        ))}
                      </select>
                    </div>

                    {/* Destination Section */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-[#555] uppercase tracking-wider">Destination Task Section</label>
                      <select
                        value={tempFormDesigner.targetSection || 'Backlog'}
                        onChange={(e) => setTempFormDesigner({ ...tempFormDesigner, targetSection: e.target.value })}
                        className="w-full bg-[#f9f9f9] border border-[#e2e2e2] rounded-lg px-2.5 py-2 text-xs font-bold text-[#1a1c1c] focus:bg-white"
                      >
                        <option value="Backlog">Backlog / Incoming Queue</option>
                        <option value="Sprint Board">Active Development Column</option>
                        <option value="Verification">QA / Audit Section</option>
                        <option value="Complete">Completed Actions Archive</option>
                      </select>
                    </div>

                    {/* Task Title Field Option */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-[#555] uppercase tracking-wider">Map Task Title From</label>
                      <select
                        value={tempFormDesigner.titleFieldSource || 'default'}
                        onChange={(e) => setTempFormDesigner({ ...tempFormDesigner, titleFieldSource: e.target.value })}
                        className="w-full bg-[#f9f9f9] border border-[#e2e2e2] rounded-lg px-2.5 py-2 text-xs font-bold text-[#1a1c1c] focus:bg-white"
                      >
                        <option value="default">Submission Subject Name (Default)</option>
                        <option value="custom">Autogenerate "[Request] + Subject"</option>
                      </select>
                    </div>

                    {/* Default Assignee */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-[#555] uppercase tracking-wider flex items-center gap-1">
                        <User className="h-3 w-3" /> Default Assignee
                      </label>
                      <select
                        value={tempFormDesigner.defaultAssignee}
                        onChange={(e) => setTempFormDesigner({ ...tempFormDesigner, defaultAssignee: e.target.value })}
                        className="w-full bg-[#f9f9f9] border border-[#e2e2e2] rounded-lg px-2.5 py-2 text-xs font-bold text-[#1a1c1c] focus:bg-white"
                      >
                        <option value="tech-lead@crewflow.com">Tech Lead (tech-lead@)</option>
                        <option value="design-lead@crewflow.com">Design Lead (design-lead@)</option>
                        <option value="member@crewflow.com">Squad Member (member@)</option>
                        <option value="admin@crewflow.com">Workspace Admin (admin@)</option>
                      </select>
                    </div>

                    {/* Copy all responses to description toggle */}
                    <div className="flex items-center justify-between p-3 bg-[#f9f9f9] border border-[#e2e2e2] rounded-lg">
                      <div className="flex flex-col text-left pr-2">
                        <span className="font-bold text-[#1a1c1c] text-[11px]">Copy responses to description</span>
                        <span className="text-[9px] text-zinc-400">Append all question answers in task description</span>
                      </div>
                      <button 
                        type="button"
                        onClick={() => setTempFormDesigner(prev => ({ ...prev, copyToDescription: !prev.copyToDescription }))}
                        className="focus:outline-none"
                      >
                        {tempFormDesigner.copyToDescription ? <ToggleRight className="h-8 w-8 text-black" /> : <ToggleLeft className="h-8 w-8 text-zinc-300" />}
                      </button>
                    </div>

                    {/* Shareable Link Input */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-[#555] uppercase tracking-wider">Shareable Form Link</label>
                      <div className="flex gap-2">
                        <input 
                          type="text" 
                          readOnly 
                          value={`https://crewflow.com/forms/share/${tempFormDesigner.id}`} 
                          className="flex-1 bg-[#f3f4f6] border border-[#e2e2e2] rounded-lg px-2 py-1.5 text-[10px] font-mono text-zinc-500"
                        />
                        <button 
                          type="button" 
                          onClick={() => {
                            navigator.clipboard.writeText(`https://crewflow.com/forms/share/${tempFormDesigner.id}`);
                            setRulesToast('Form share link copied to clipboard!');
                            setTimeout(() => setRulesToast(''), 3000);
                          }}
                          className="bg-black hover:bg-neutral-800 text-white text-[10px] font-bold px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                        >
                          <Copy className="h-3 w-3" />
                          <span>Copy</span>
                        </button>
                      </div>
                    </div>

                    {/* Copy Embed Code iFrame */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-[#555] uppercase tracking-wider">Embed in webpage (iFrame)</label>
                      <div className="flex gap-2">
                        <input 
                          type="text" 
                          readOnly 
                          value={`<iframe src="https://crewflow.com/forms/embed/${tempFormDesigner.id}" width="100%" height="600" frameborder="0"></iframe>`} 
                          className="flex-1 bg-[#f3f4f6] border border-[#e2e2e2] rounded-lg px-2 py-1.5 text-[10px] font-mono text-zinc-500"
                        />
                        <button 
                          type="button" 
                          onClick={() => {
                            navigator.clipboard.writeText(`<iframe src="https://crewflow.com/forms/embed/${tempFormDesigner.id}" width="100%" height="600" frameborder="0"></iframe>`);
                            setRulesToast('Form iframe embed code copied!');
                            setTimeout(() => setRulesToast(''), 3000);
                          }}
                          className="bg-black hover:bg-neutral-800 text-white text-[10px] font-bold px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                        >
                          <Copy className="h-3 w-3" />
                          <span>Copy</span>
                        </button>
                      </div>
                    </div>

                    {/* Custom confirmation text */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-[#555] uppercase tracking-wider">Submission Confirmation screen message</label>
                      <textarea
                        value={tempFormDesigner.confirmText || ''}
                        onChange={(e) => setTempFormDesigner({ ...tempFormDesigner, confirmText: e.target.value })}
                        rows="3"
                        placeholder="Confirmation message..."
                        className="w-full bg-[#f9f9f9] border border-[#e2e2e2] rounded-lg px-2.5 py-2 text-xs leading-relaxed"
                      />
                    </div>

                    {/* Show a button to Add New Request toggle */}
                    <div className="flex items-center justify-between p-3 bg-[#f9f9f9] border border-[#e2e2e2] rounded-lg">
                      <div className="flex flex-col text-left pr-2">
                        <span className="font-bold text-[#1a1c1c] text-[11px]">Show 'Add new request'</span>
                        <span className="text-[9px] text-zinc-400">Display button to submit another brief</span>
                      </div>
                      <button 
                        type="button"
                        onClick={() => setTempFormDesigner(prev => ({ ...prev, showAddRequestBtn: !prev.showAddRequestBtn }))}
                        className="focus:outline-none"
                      >
                        {tempFormDesigner.showAddRequestBtn ? <ToggleRight className="h-8 w-8 text-black" /> : <ToggleLeft className="h-8 w-8 text-zinc-300" />}
                      </button>
                    </div>

                    {/* Add submitters as task collaborators toggle */}
                    <div className="flex items-center justify-between p-3 bg-[#f9f9f9] border border-[#e2e2e2] rounded-lg">
                      <div className="flex flex-col text-left pr-2">
                        <span className="font-bold text-[#1a1c1c] text-[11px]">Add submitter as collaborator</span>
                        <span className="text-[9px] text-zinc-400">Add applicant to followers list automatically</span>
                      </div>
                      <button 
                        type="button"
                        onClick={() => setTempFormDesigner(prev => ({ ...prev, addCollaborator: !prev.addCollaborator }))}
                        className="focus:outline-none"
                      >
                        {tempFormDesigner.addCollaborator ? <ToggleRight className="h-8 w-8 text-black" /> : <ToggleLeft className="h-8 w-8 text-zinc-300" />}
                      </button>
                    </div>

                  </div>
                )}

              </div>
            </aside>

          </div>

        </div>
      ) : (
        /* --- MAIN DIRECTORY DASHBOARD ROUTING --- */
        <>
          {/* Header Banner Panel */}
          <div className="px-8 py-5 border-b border-[#e2e2e2] bg-white flex flex-col gap-1 flex-shrink-0">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded bg-[#2d2e30] flex items-center justify-center text-white">
                <GitMerge className="h-3.5 w-3.5" />
              </div>
              <span className="text-[10px] text-[#777777] font-bold uppercase tracking-widest">Workflow Engine</span>
            </div>
            <div className="flex items-center justify-between mt-1">
              <div>
                <h1 className="text-xl font-bold tracking-tight text-[#1a1c1c]">Organization Workflow Management</h1>
                <p className="text-xs text-[#777777] mt-0.5">Scaffold standardization across all organizational team tasks, automation triggers, custom metadata and status checklists.</p>
              </div>
            </div>
          </div>

          {/* Main Content Views Router */}
          <div className="flex-1 p-8 min-h-0 overflow-y-auto">
            
            {/* --- A. CUSTOM FIELDS VIEW --- */}
            {view === 'custom-fields' && (
              <div className="flex flex-col gap-6 max-w-7xl mx-auto font-sans">
                {/* Visual Owner Filter active badge */}
                {fieldOwnerFilter === 'owner' && (
                  <div className="flex items-center gap-2 bg-[#dbeafe] border border-[#93c5fd] rounded-full px-3 py-1 text-xs font-bold text-[#1e40af] select-none animate-fade-in w-max">
                    <span>Filter: Owner</span>
                    <button type="button" onClick={() => setFieldOwnerFilter('all')} className="hover:bg-[#93c5fd]/50 rounded-full p-0.5"><X className="h-3 w-3" /></button>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-[#e2e2e2] shadow-sm flex-shrink-0 relative">
                  <div className="flex flex-1 flex-wrap items-center gap-3">
                    <div className="relative flex-1 min-w-[200px] max-w-md">
                      <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#8a8b8c]" />
                      <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search custom fields..." className="w-full pl-9 pr-4 py-2 border border-[#e2e2e2] rounded-lg text-xs font-medium placeholder-[#8a8b8c] bg-[#f9f9f9] focus:outline-none focus:bg-white transition-all" />
                      {searchQuery && <button onClick={() => setSearchQuery('')} className="absolute right-2.5 top-2.5 hover:bg-[#e2e2e2] rounded p-0.5"><X className="h-3 w-3" /></button>}
                    </div>
                    
                    {/* Filter Toggle Trigger */}
                    <button 
                      type="button" 
                      onClick={() => setFieldOwnerFilter(prev => prev === 'all' ? 'owner' : 'all')} 
                      className={`flex items-center gap-2 border rounded-lg px-3 py-2 text-xs font-semibold transition-colors hover:bg-[#f0f0f0] ${
                        fieldOwnerFilter === 'owner' ? 'bg-[#dbeafe] border-[#93c5fd] text-[#1e40af]' : 'border-[#e2e2e2] bg-[#f9f9f9] text-[#777777]'
                      }`}
                    >
                      <Sliders className="h-3.5 w-3.5" />
                      <span>Filter</span>
                    </button>

                    <div className="flex items-center gap-2 border border-[#e2e2e2] rounded-lg px-3 py-2 bg-[#f9f9f9] text-xs font-semibold hover:bg-[#f0f0f0] transition-colors relative">
                      <span className="text-[#777777]">Type:</span>
                      <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="bg-transparent font-bold outline-none text-[#1a1c1c] cursor-pointer">
                        <option value="all">All types</option>
                        <option value="single-select">Single-select</option>
                        <option value="multi-select">Multi-select</option>
                        <option value="text">Text (Freeform)</option>
                        <option value="number">Number</option>
                        <option value="date">Date</option>
                        <option value="people">People</option>
                      </select>
                    </div>
                  </div>

                  <div className="relative">
                    <button 
                      onClick={() => {
                        setProjectPickerType(prev => prev === 'fields' ? null : 'fields');
                        setProjectPickerSearch('');
                      }} 
                      className="bg-[#2d2e30] hover:bg-black text-white text-xs font-bold tracking-wider uppercase px-4 py-2.5 rounded-lg shadow flex items-center justify-center gap-2 transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Create field</span>
                    </button>
                    {renderProjectPicker('fields', (projName) => {
                      handleOpenCreateModal();
                    })}
                  </div>
                </div>

                {/* Main Content Area: Show high fidelity empty/filtered states or lists */}
                {filteredFields.length === 0 ? (
                  <div className="bg-white rounded-xl border border-[#e2e2e2] shadow-sm p-12 text-center flex flex-col items-center justify-center gap-4 min-h-[380px]">
                    {/* Gorgeous Custom SVG Illustration representing dials/sliders empty state */}
                    <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="animate-pulse">
                      <rect x="20" y="20" width="80" height="80" rx="12" stroke="#fca5a5" strokeWidth="2.5" fill="#fff5f5" />
                      <line x1="20" y1="60" x2="100" y2="60" stroke="#fca5a5" strokeWidth="1.5" strokeDasharray="4 4" />
                      <circle cx="50" cy="40" r="12" stroke="#ef4444" strokeWidth="2.5" fill="#fecaca" />
                      <path d="M50 34V46M44 40H56" stroke="#ef4444" strokeWidth="2" />
                      <rect x="35" y="70" width="10" height="20" rx="3" fill="#ef4444" />
                      <rect x="55" y="75" width="10" height="15" rx="3" fill="#fca5a5" />
                      <rect x="75" y="65" width="10" height="25" rx="3" fill="#fecaca" />
                    </svg>

                    <h3 className="font-bold text-[#1a1c1c] text-lg">
                      {fieldOwnerFilter === 'owner' ? "You don't have any custom fields yet" : "No custom fields to show"}
                    </h3>
                    <p className="text-[#777777] text-xs max-w-sm leading-relaxed">
                      Track priority, cost, or anything your team needs to organize work
                    </p>

                    <div className="flex items-center gap-3 mt-2">
                      {fieldOwnerFilter === 'owner' && (
                        <button 
                          type="button" 
                          onClick={() => {
                            setFieldOwnerFilter('all');
                            setSearchQuery('');
                            setTypeFilter('all');
                          }} 
                          className="px-4 py-2 border border-[#e2e2e2] rounded-lg text-xs font-bold text-[#777777] hover:bg-[#f9f9f9] transition-colors shadow-sm"
                        >
                          Clear filters
                        </button>
                      )}
                      
                      <div className="relative">
                        <button 
                          onClick={() => {
                            setProjectPickerType(prev => prev === 'fields' ? null : 'fields');
                            setProjectPickerSearch('');
                          }} 
                          className="bg-black hover:bg-neutral-800 text-white text-xs font-bold px-4 py-2 rounded-lg shadow-sm transition-colors"
                        >
                          Create field
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white rounded-xl border border-[#e2e2e2] overflow-hidden shadow-sm">
                  <table className="w-full border-collapse text-left text-xs font-medium text-[#1a1c1c]">
                    <thead>
                      <tr className="bg-[#f9f9f9] border-b border-[#e2e2e2] text-[#777777] uppercase tracking-widest text-[9px] font-bold">
                        <th className="py-4 px-6 font-semibold w-1/4">Field name</th>
                        <th className="py-4 px-4 font-semibold w-1/6">Type</th>
                        <th className="py-4 px-4 font-semibold w-5/12">Configuration / Options preview</th>
                        <th className="py-4 px-4 font-semibold w-1/12 text-center">Associated Projects</th>
                        <th className="py-4 px-6 font-semibold w-1/12 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#e2e2e2]/60">
                      {filteredFields.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="py-12 text-center text-[#777777] italic bg-[#fafafa]">
                            <div className="flex flex-col items-center gap-2">
                              <Sliders className="h-8 w-8 text-[#c5c6c7]" />
                              <span>No custom fields matching your query.</span>
                              <button onClick={() => { setSearchQuery(''); setTypeFilter('all'); }} className="text-xs font-bold underline text-black mt-1">Reset filters</button>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        filteredFields.map((field) => (
                          <tr key={field.id} className="hover:bg-[#f9f9f9]/40 transition-colors">
                            <td className="py-4 px-6 align-top">
                              <div className="font-bold text-sm text-[#1a1c1c]">{field.name}</div>
                              {field.description && <p className="text-[11px] text-[#777777] leading-relaxed mt-1 font-normal line-clamp-2" title={field.description}>{field.description}</p>}
                              <div className="flex items-center gap-1.5 mt-2">
                                <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider ${
                                  field.scope === 'project-only' ? 'bg-amber-50 text-amber-800 border border-amber-200' : 'bg-zinc-100 text-zinc-800 border border-zinc-200'
                                }`}>
                                  {field.scope === 'project-only' ? 'Project scoped' : 'Global Library'}
                                </span>
                              </div>
                            </td>
                            <td className="py-4 px-4 align-top">
                              <div className="flex items-center gap-2 mt-0.5">
                                <div className="p-1 rounded bg-[#f3f4f6] border border-[#e2e2e2]">{getTypeIcon(field.type)}</div>
                                <span className="font-semibold text-xs text-[#555]">{getTypeLabel(field.type)}</span>
                              </div>
                            </td>
                            <td className="py-4 px-4 align-top">
                              {(field.type === 'single-select' || field.type === 'multi-select') && field.options && (
                                <div className="flex flex-wrap gap-1.5 max-w-xl">
                                  {field.options.map(opt => {
                                    const sw = getSwatch(opt.colorId);
                                    return <span key={opt.id} className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${sw.bg} ${sw.text} ${sw.border}`}>{opt.label}</span>;
                                  })}
                                </div>
                              )}
                              {field.type === 'text' && <span className="text-[11px] text-[#8a8b8c] italic">Freeform text input area for notes, URLs, or descriptive text cards.</span>}
                              {field.type === 'number' && (
                                <div className="flex flex-col gap-1">
                                  <span className="text-[11px] text-[#555] font-semibold">Numeric formatting rule: <span className="text-black font-bold uppercase bg-neutral-100 px-1.5 py-0.5 rounded ml-1 text-[10px]">{field.numberFormat || 'decimal'}</span></span>
                                  {field.numberFormat === 'decimal' && <span className="text-[10px] text-[#777777]">Decimal precision set to {field.decimalPlaces || 0} position(s)</span>}
                                  {field.numberFormat === 'currency' && <span className="text-[10px] text-[#777777]">Currency output formatted with {field.currencySymbol || '$'} notation rules</span>}
                                  {field.numberFormat === 'percentage' && <span className="text-[10px] text-[#777777]">Values rendered with percentage sign suffix</span>}
                                </div>
                              )}
                              {field.type === 'date' && <span className="text-[11px] text-[#8a8b8c] italic">Standard Gregorian date picker selector</span>}
                              {field.type === 'people' && <span className="text-[11px] text-[#8a8b8c] italic">Organization directory users and stakeholders checklist dropdown</span>}
                            </td>
                            <td className="py-4 px-4 text-center align-top"><span className="inline-block px-2.5 py-1 rounded bg-[#f3f4f6] text-[#1a1c1c] font-bold text-xs border border-[#e2e2e2]">{field.projectsCount} {field.projectsCount === 1 ? 'project' : 'projects'}</span></td>
                            <td className="py-4 px-6 text-right align-top">
                              <div className="flex items-center justify-end gap-1">
                                <button onClick={() => handleOpenEditModal(field)} className="p-1.5 hover:bg-[#e2e2e2] rounded text-[#777777] hover:text-black transition-colors" title="Edit Field Configuration"><Edit3 className="h-4 w-4" /></button>
                                <button onClick={() => handleDeleteField(field.id)} className="p-1.5 hover:bg-[#fee2e2] rounded text-[#777777] hover:text-[#991b1b]" title="Delete Field"><Trash2 className="h-4 w-4" /></button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                  <div className="px-6 py-4 bg-[#f9f9f9] border-t border-[#e2e2e2] flex items-center justify-between text-[#777777] text-[10px] font-bold uppercase tracking-wider">
                    <span>Showing {filteredFields.length} of {fields.length} available fields</span>
                    <span>Active integrations: {fields.reduce((acc, curr) => acc + curr.projectsCount, 0)} project links</span>
                  </div>
                </div>
                )}
              </div>
            )}

            {/* --- B. AUTOMATED RULES VIEW --- */}
            {view === 'workflow-rules' && (
              <div className="flex flex-col gap-6 max-w-7xl mx-auto font-sans">
                {/* Visual Owner Filter active badge */}
                {ruleOwnerFilter === 'owner' && (
                  <div className="flex items-center gap-2 bg-[#dbeafe] border border-[#93c5fd] rounded-full px-3 py-1 text-xs font-bold text-[#1e40af] select-none animate-fade-in w-max">
                    <span>Filter: Owner</span>
                    <button type="button" onClick={() => setRuleOwnerFilter('all')} className="hover:bg-[#93c5fd]/50 rounded-full p-0.5"><X className="h-3 w-3" /></button>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-[#e2e2e2] shadow-sm flex-shrink-0 relative">
                  <div className="flex flex-1 flex-wrap items-center gap-3 text-xs">
                    <div className="relative flex-1 min-w-[200px] max-w-md">
                      <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#8a8b8c]" />
                      <input type="text" value={ruleSearchQuery} onChange={(e) => setRuleSearchQuery(e.target.value)} placeholder="Search automated rules..." className="w-full pl-9 pr-4 py-2 border border-[#e2e2e2] rounded-lg font-medium bg-[#f9f9f9] focus:outline-none transition-all text-[#1a1c1c]" />
                      {ruleSearchQuery && <button onClick={() => setRuleSearchQuery('')} className="absolute right-2.5 top-2.5 hover:bg-[#e2e2e2] p-0.5 rounded"><X className="h-3 w-3" /></button>}
                    </div>

                    {/* Filter Toggle Trigger */}
                    <button 
                      type="button" 
                      onClick={() => setRuleOwnerFilter(prev => prev === 'all' ? 'owner' : 'all')} 
                      className={`flex items-center gap-2 border rounded-lg px-3 py-2 text-xs font-semibold transition-colors hover:bg-[#f0f0f0] ${
                        ruleOwnerFilter === 'owner' ? 'bg-[#dbeafe] border-[#93c5fd] text-[#1e40af]' : 'border-[#e2e2e2] bg-[#f9f9f9] text-[#777777]'
                      }`}
                    >
                      <Sliders className="h-3.5 w-3.5" />
                      <span>Filter</span>
                    </button>

                    <div className="flex items-center gap-2 border border-[#e2e2e2] rounded-lg px-3 py-2 bg-[#f9f9f9] font-semibold cursor-pointer hover:bg-[#f0f0f0]">
                      <span className="text-[#777777]">Status:</span>
                      <select value={ruleFilter} onChange={(e) => setRuleFilter(e.target.value)} className="bg-transparent font-bold outline-none cursor-pointer">
                        <option value="all">All statuses</option>
                        <option value="active">Active rules</option>
                        <option value="inactive">Paused rules</option>
                      </select>
                    </div>

                    {/* Highly interactive 8 Asana Sort options */}
                    <div className="flex items-center gap-2 border border-[#e2e2e2] rounded-lg px-3 py-2 bg-[#f9f9f9] font-semibold cursor-pointer hover:bg-[#f0f0f0]">
                      <ArrowUpDown className="h-3.5 w-3.5 text-[#777777]" />
                      <span className="text-[#777777]">Sort:</span>
                      <select value={ruleSort} onChange={(e) => setRuleSort(e.target.value)} className="bg-transparent font-bold outline-none cursor-pointer">
                        <option value="triggers">Most triggered</option>
                        <option value="alphabetical">Alphabetical</option>
                        <option value="newest">Creation time (Newest)</option>
                        <option value="oldest">Creation time (Oldest)</option>
                        <option value="modified-newest">Last modified (Newest)</option>
                        <option value="modified-oldest">Last modified (Oldest)</option>
                        <option value="active-newest">Last active (Newest)</option>
                        <option value="active-oldest">Last active (Oldest)</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="relative">
                    <button 
                      onClick={() => {
                        setProjectPickerType(prev => prev === 'rules' ? null : 'rules');
                        setProjectPickerSearch('');
                      }} 
                      className="bg-black hover:bg-neutral-800 text-white text-xs font-bold tracking-wider uppercase px-4 py-2.5 rounded-lg shadow transition-colors flex items-center justify-center gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Create rule</span>
                    </button>
                    {renderProjectPicker('rules', (projName) => {
                      setIsCreateRuleOpen(true);
                    })}
                  </div>
                </div>

                {filteredRules.length === 0 ? (
                  <div className="bg-white rounded-xl border border-[#e2e2e2] shadow-sm p-12 text-center flex flex-col items-center justify-center gap-4 min-h-[380px]">
                    {/* SVG loop and lightning bolts for rules empty state */}
                    <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="animate-pulse">
                      <rect x="25" y="25" width="70" height="70" rx="10" stroke="#fca5a5" strokeWidth="2.5" fill="#fff5f5" />
                      <path d="M45 60C45 51.7157 51.7157 45 60 45C68.2843 45 75 51.7157 75 60C75 68.2843 68.2843 75 60 75" stroke="#ef4444" strokeWidth="2" strokeDasharray="3 3" />
                      <circle cx="60" cy="60" r="14" fill="#fee2e2" stroke="#ef4444" strokeWidth="2" />
                      <path d="M60 52L54 61H60L59 68L66 59H60L60 52Z" fill="#ef4444" />
                      <rect x="20" y="45" width="10" height="10" rx="2" fill="#ef4444" />
                      <rect x="90" y="45" width="10" height="10" rx="2" fill="#ef4444" />
                    </svg>

                    <h3 className="font-bold text-[#1a1c1c] text-lg">
                      {ruleOwnerFilter === 'owner' ? "You don't have any rules yet" : "No rules to show"}
                    </h3>
                    <p className="text-[#777777] text-xs max-w-sm leading-relaxed">
                      Automate routine work to keep work moving faster
                    </p>

                    <div className="flex items-center gap-3 mt-2">
                      {ruleOwnerFilter === 'owner' && (
                        <button 
                          type="button" 
                          onClick={() => {
                            setRuleOwnerFilter('all');
                            setRuleSearchQuery('');
                            setRuleFilter('all');
                          }} 
                          className="px-4 py-2 border border-[#e2e2e2] rounded-lg text-xs font-bold text-[#777777] hover:bg-[#f9f9f9] transition-colors shadow-sm"
                        >
                          Clear filters
                        </button>
                      )}
                      
                      <div className="relative">
                        <button 
                          onClick={() => {
                            setProjectPickerType(prev => prev === 'rules' ? null : 'rules');
                            setProjectPickerSearch('');
                          }} 
                          className="bg-black hover:bg-neutral-800 text-white text-xs font-bold px-4 py-2 rounded-lg shadow-sm transition-colors"
                        >
                          Create rule
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white rounded-xl border border-[#e2e2e2] overflow-hidden shadow-sm font-sans text-xs">
                  <table className="w-full border-collapse text-left text-xs font-medium text-[#1a1c1c]">
                    <thead>
                      <tr className="bg-[#f9f9f9] border-b border-[#e2e2e2] text-[#777777] uppercase tracking-widest text-[9px] font-bold">
                        <th className="py-4 px-6 font-semibold w-5/12">Rule name / logic details</th>
                        <th className="py-4 px-4 font-semibold w-2/12">Rule Owner</th>
                        <th className="py-4 px-4 font-semibold w-2/12 text-center">Triggers fired</th>
                        <th className="py-4 px-4 font-semibold w-2/12 text-center">Automation status</th>
                        <th className="py-4 px-6 font-semibold w-1/12 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#e2e2e2]/60">
                      {filteredRules.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="py-12 text-center text-[#777777] italic bg-[#fafafa]">
                            <div className="flex flex-col items-center gap-2 py-4">
                              <Zap className="h-8 w-8 text-[#c5c6c7]" />
                              <span>No automated rules found matching your filters.</span>
                              <button onClick={() => { setRuleSearchQuery(''); setRuleFilter('all'); setRuleSort('triggers'); }} className="text-xs font-bold underline text-black mt-1">Reset dashboard</button>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        filteredRules.map(rule => (
                          <tr key={rule.id} className="hover:bg-[#f9f9f9]/40 transition-colors">
                            <td className="py-4 px-6 align-top">
                              <div className="font-bold text-sm text-[#1a1c1c] flex items-center gap-2">
                                <Zap className={`h-4.5 w-4.5 stroke-[2px] ${rule.active ? 'text-amber-500 fill-amber-300' : 'text-zinc-300'}`} />
                                <span>{rule.name}</span>
                              </div>
                              <div className="mt-3 flex items-center gap-2.5 flex-wrap">
                                <div className="flex items-center gap-1.5 bg-[#f3f4f6] px-2.5 py-1 rounded-lg border border-[#e2e2e2] text-[10px] font-semibold text-zinc-700"><span className="text-[9px] font-bold uppercase text-purple-600">WHEN</span><span>{rule.triggerText}</span></div>
                                <ArrowRight className="h-3 w-3 text-zinc-400" />
                                <div className="flex items-center gap-1.5 bg-neutral-100 px-2.5 py-1 rounded-lg border border-neutral-200 text-[10px] font-semibold text-zinc-800"><span className="text-[9px] font-bold uppercase text-emerald-600">THEN</span><span>{rule.actionText}</span></div>
                              </div>
                            </td>
                            <td className="py-4 px-4 align-top">
                              <div className="flex items-center gap-2 mt-1">
                                <div className={`h-6 w-6 rounded-full flex items-center justify-center font-bold text-[9px] ${rule.owner.avatarBg}`}>{rule.owner.name.split(' ').map(n => n[0]).join('')}</div>
                                <div className="min-w-0"><span className="font-semibold block truncate leading-tight">{rule.owner.name}</span><span className="text-[9px] text-zinc-400 block truncate">{rule.owner.email}</span></div>
                              </div>
                            </td>
                            <td className="py-4 px-4 text-center align-top"><span className="inline-block mt-1.5 px-2.5 py-1 rounded bg-[#f3f4f6] text-[#1a1c1c] font-bold text-xs border border-[#e2e2e2]">{rule.triggersCount} {rule.triggersCount === 1 ? 'trigger' : 'triggers'}</span></td>
                            <td className="py-4 px-4 align-top">
                              <div className="flex items-center justify-center mt-1">
                                <button type="button" onClick={() => handleToggleRuleStatus(rule.id, rule.active)} className="focus:outline-none hover:scale-105 transition-transform">
                                  {rule.active ? <div className="flex items-center gap-1 text-emerald-600 font-bold"><ToggleRight className="h-8 w-8" /><span className="text-[10px]">Active</span></div> : <div className="flex items-center gap-1 text-zinc-400 font-bold"><ToggleLeft className="h-8 w-8" /><span className="text-[10px]">Paused</span></div>}
                                </button>
                              </div>
                            </td>
                            <td className="py-4 px-6 text-right align-top">
                              <div className="flex items-center justify-end gap-1 mt-1">
                                <button onClick={() => alert(`Editing rule "${rule.name}" trigger-actions is currently under development. Use create rule to configure fresh automations!`)} className="p-1.5 hover:bg-[#f3f4f6] rounded border border-[#e2e2e2] text-zinc-400 hover:text-black" title="Edit Rule"><Edit3 className="h-3.5 w-3.5" /></button>
                                <button onClick={() => handleDeleteRule(rule.id, rule.name)} className="p-1.5 hover:bg-[#fee2e2] rounded border border-[#e2e2e2] text-[#777777] hover:text-red-700" title="Delete Rule"><Trash2 className="h-3.5 w-3.5" /></button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                  <div className="px-6 py-4 bg-[#f9f9f9] border-t border-[#e2e2e2] flex items-center justify-between text-[#777777] text-[10px] font-bold uppercase tracking-wider">
                    <span>Showing {filteredRules.length} of {rules.length} custom automations</span>
                    <span>Total triggered events: {rules.reduce((acc, curr) => acc + curr.triggersCount, 0)} fires</span>
                  </div>
                </div>
                )}
              </div>
            )}

            {/* --- C. INTAKE FORMS VIEW (FULLY IMPLEMENTED IN HIGH FIDELITY) --- */}
            {view === 'workflow-forms' && (
              <div className="flex flex-col gap-6 max-w-7xl mx-auto animate-fade-in font-sans">
                
                {/* Visual Owner Filter active badge */}
                {formOwnerFilter === 'owner' && (
                  <div className="flex items-center gap-2 bg-[#dbeafe] border border-[#93c5fd] rounded-full px-3 py-1 text-xs font-bold text-[#1e40af] select-none animate-fade-in w-max">
                    <span>Filter: Owner</span>
                    <button type="button" onClick={() => setFormOwnerFilter('all')} className="hover:bg-[#93c5fd]/50 rounded-full p-0.5"><X className="h-3 w-3" /></button>
                  </div>
                )}

                {/* Action bar */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-[#e2e2e2] shadow-sm flex-shrink-0 text-xs">
                  
                  {/* Left filters search */}
                  <div className="flex flex-1 flex-wrap items-center gap-3">
                    {/* Search */}
                    <div className="relative flex-1 min-w-[200px] max-w-md">
                      <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#8a8b8c]" />
                      <input
                        type="text"
                        value={formSearchQuery}
                        onChange={(e) => setFormSearchQuery(e.target.value)}
                        placeholder="Search intake forms..."
                        className="w-full pl-9 pr-4 py-2 border border-[#e2e2e2] rounded-lg font-medium placeholder-[#8a8b8c] bg-[#f9f9f9] focus:outline-none transition-all text-[#1a1c1c]"
                      />
                      {formSearchQuery && <button onClick={() => setFormSearchQuery('')} className="absolute right-2.5 top-2.5 hover:bg-[#e2e2e2] p-0.5 rounded"><X className="h-3 w-3" /></button>}
                    </div>

                    {/* Filter Toggle Trigger */}
                    <button 
                      type="button" 
                      onClick={() => setFormOwnerFilter(prev => prev === 'all' ? 'owner' : 'all')} 
                      className={`flex items-center gap-2 border rounded-lg px-3 py-2 text-xs font-semibold transition-colors hover:bg-[#f0f0f0] ${
                        formOwnerFilter === 'owner' ? 'bg-[#dbeafe] border-[#93c5fd] text-[#1e40af]' : 'border-[#e2e2e2] bg-[#f9f9f9] text-[#777777]'
                      }`}
                    >
                      <Sliders className="h-3.5 w-3.5" />
                      <span>Filter</span>
                    </button>

                    {/* Filter Status */}
                    <div className="relative">
                      <div 
                        onClick={() => {
                          setIsSharingFilterOpen(!isSharingFilterOpen);
                          setIsSortDropdownOpen(false);
                          setIsCreateDropdownOpen(false);
                        }}
                        className="flex items-center gap-2 border border-[#e2e2e2] rounded-lg px-3 py-2 bg-[#f9f9f9] font-bold text-[#1a1c1c] hover:bg-[#f0f0f0] transition-colors cursor-pointer select-none"
                      >
                        <span className="text-[#777777] font-semibold">Sharing:</span>
                        <span className="capitalize">{formFilter === 'all' ? 'All forms' : formFilter === 'active' ? 'Active public' : 'Paused'}</span>
                        <ChevronDown className={`h-3.5 w-3.5 text-[#777777] transition-transform ${isSharingFilterOpen ? 'rotate-180' : ''}`} />
                      </div>

                      {isSharingFilterOpen && (
                        <>
                          <div className="fixed inset-0 z-10" onClick={() => setIsSharingFilterOpen(false)} />
                          <div className="absolute left-0 mt-1.5 w-56 bg-white border border-[#e2e2e2] rounded-xl shadow-xl z-20 p-1.5 animate-scale-in text-left">
                            {[
                              { value: 'all', label: 'All forms', desc: 'View all forms in the system' },
                              { value: 'active', label: 'Active public sharing', desc: 'Forms open for submission' },
                              { value: 'inactive', label: 'Paused forms', desc: 'Submissions currently deactivated' }
                            ].map(opt => (
                              <button
                                key={opt.value}
                                type="button"
                                onClick={() => {
                                  setFormFilter(opt.value);
                                  setIsSharingFilterOpen(false);
                                }}
                                className="w-full flex items-center justify-between p-2 hover:bg-[#f3f4f6] rounded-lg text-xs font-semibold transition-colors text-[#1a1c1c]"
                              >
                                <div className="flex flex-col">
                                  <span className="font-bold flex items-center gap-1.5">
                                    {opt.value === 'active' && <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />}
                                    {opt.value === 'inactive' && <span className="h-1.5 w-1.5 rounded-full bg-zinc-400" />}
                                    {opt.label}
                                  </span>
                                  <span className="text-[10px] text-[#777777] font-normal mt-0.5">{opt.desc}</span>
                                </div>
                                {formFilter === opt.value && <Check className="h-4 w-4 text-black stroke-[2.5px]" />}
                              </button>
                            ))}
                          </div>
                        </>
                      )}
                    </div>

                    {/* Sort */}
                    <div className="relative">
                      <div 
                        onClick={() => {
                          setIsSortDropdownOpen(!isSortDropdownOpen);
                          setIsSharingFilterOpen(false);
                          setIsCreateDropdownOpen(false);
                        }}
                        className="flex items-center gap-2 border border-[#e2e2e2] rounded-lg px-3 py-2 bg-[#f9f9f9] font-bold text-[#1a1c1c] hover:bg-[#f0f0f0] transition-colors cursor-pointer select-none"
                      >
                        <ArrowUpDown className="h-3.5 w-3.5 text-[#777777]" />
                        <span className="text-[#777777] font-semibold">Sort:</span>
                        <span className="capitalize">{formSort === 'submissions' ? 'Most submissions' : formSort === 'alphabetical' ? 'Alphabetical' : 'Newest first'}</span>
                        <ChevronDown className={`h-3.5 w-3.5 text-[#777777] transition-transform ${isSortDropdownOpen ? 'rotate-180' : ''}`} />
                      </div>

                      {isSortDropdownOpen && (
                        <>
                          <div className="fixed inset-0 z-10" onClick={() => setIsSortDropdownOpen(false)} />
                          <div className="absolute left-0 mt-1.5 w-48 bg-white border border-[#e2e2e2] rounded-xl shadow-xl z-20 p-1.5 animate-scale-in text-left">
                            {[
                              { value: 'submissions', label: 'Most submissions' },
                              { value: 'alphabetical', label: 'Alphabetical' },
                              { value: 'newest', label: 'Newest first' }
                            ].map(opt => (
                              <button
                                key={opt.value}
                                type="button"
                                onClick={() => {
                                  setFormSort(opt.value);
                                  setIsSortDropdownOpen(false);
                                }}
                                className="w-full flex items-center justify-between px-3 py-2 hover:bg-[#f3f4f6] rounded-lg text-xs font-semibold transition-colors text-[#1a1c1c]"
                              >
                                <span>{opt.label}</span>
                                {formSort === opt.value && <Check className="h-4 w-4 text-black stroke-[2.5px]" />}
                              </button>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Right Action */}
                  <div className="relative flex items-center">
                    <button
                      onClick={() => {
                        setProjectPickerType(prev => prev === 'forms' ? null : 'forms');
                        setProjectPickerSearch('');
                      }}
                      className="bg-[#2d2e30] hover:bg-black text-white text-xs font-bold tracking-wider uppercase pl-4 pr-3 py-2.5 rounded-l-lg shadow transition-colors flex items-center gap-1.5 border-r border-neutral-700 animate-fade-in animate-duration-300"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Create intake form</span>
                    </button>
                    <button
                      onClick={() => {
                        setIsCreateDropdownOpen(!isCreateDropdownOpen);
                        setIsSharingFilterOpen(false);
                        setIsSortDropdownOpen(false);
                      }}
                      className="bg-[#2d2e30] hover:bg-black text-white px-2.5 py-2.5 rounded-r-lg shadow transition-colors flex items-center justify-center cursor-pointer border-l border-neutral-700/30"
                      title="Select form template"
                    >
                      <ChevronDown className={`h-4 w-4 transition-transform ${isCreateDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {isCreateDropdownOpen && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setIsCreateDropdownOpen(false)} />
                        <div className="absolute right-0 top-full mt-1.5 w-64 bg-white border border-[#e2e2e2] rounded-xl shadow-2xl z-20 p-2 animate-scale-in text-left">
                          <span className="text-[9px] text-[#777777] font-bold uppercase tracking-widest px-2.5 py-1.5 block">Standard intake systems</span>
                          
                          <button
                            type="button"
                            onClick={() => {
                              setProjectPickerType(prev => prev === 'forms' ? null : 'forms');
                              setProjectPickerSearch('');
                            }}
                            className="w-full text-left p-2 hover:bg-[#f3f4f6] rounded-lg flex items-start gap-2.5 transition-colors text-xs font-semibold text-[#1a1c1c]"
                          >
                            <div className="p-1 rounded bg-[#fafafa] border border-[#e2e2e2] text-zinc-600"><Plus className="h-4 w-4" /></div>
                            <div>
                              <span className="font-bold block">Start from Scratch</span>
                              <span className="text-[10px] text-[#777777] font-normal leading-tight mt-0.5 block">Design questions uploader step by step</span>
                            </div>
                          </button>

                          <div className="h-px bg-[#e2e2e2]/60 my-1.5" />
                          <span className="text-[9px] text-[#777777] font-bold uppercase tracking-widest px-2.5 py-1.5 block">Quick-start templates</span>

                          {[
                            { type: 'creative', label: 'Marketing Assets Brief', desc: 'Prefilled attachment & due dates for designers', icon: Sparkles },
                            { type: 'bug', label: 'IT Support & Bug Request', desc: 'Structured bug tracking repro questions', icon: CheckSquare },
                            { type: 'ux', label: 'UX Design Feedback', desc: 'Design comments and files specification uploader', icon: Layers }
                          ].map(tmpl => {
                            const Icon = tmpl.icon;
                            return (
                              <button
                                key={tmpl.type}
                                type="button"
                                onClick={() => handleCreateFormFromTemplate(tmpl.type)}
                                className="w-full text-left p-2 hover:bg-[#f3f4f6] rounded-lg flex items-start gap-2.5 transition-colors text-xs font-semibold text-[#1a1c1c]"
                              >
                                <div className="p-1 rounded bg-neutral-50 text-indigo-600"><Icon className="h-4 w-4" /></div>
                                <div>
                                  <span className="font-bold block">{tmpl.label}</span>
                                  <span className="text-[10px] text-[#777777] font-normal leading-tight mt-0.5 block">{tmpl.desc}</span>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </>
                    )}

                    {renderProjectPicker('forms', (projName) => {
                      setNewFormProject(projName);
                      setNewFormScope(projectPickerPermission);
                      handleOpenCreateFormModal();
                    })}
                  </div>

                </div>

                {/* Forms grid tables / Empty State */}
                {filteredForms.length === 0 ? (
                  <div className="bg-white rounded-xl border border-[#e2e2e2] shadow-sm p-12 text-center flex flex-col items-center justify-center gap-4 min-h-[380px] font-sans">
                    {/* Gorgeous Custom SVG Illustration representing clipboard/magnifying glass empty state */}
                    <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="animate-pulse">
                      <rect x="25" y="20" width="70" height="80" rx="8" stroke="#fca5a5" strokeWidth="2.5" fill="#fff5f5" />
                      <rect x="45" y="12" width="30" height="10" rx="3" stroke="#fca5a5" strokeWidth="2" fill="white" />
                      <line x1="40" y1="40" x2="80" y2="40" stroke="#fca5a5" strokeWidth="2" strokeLinecap="round" />
                      <line x1="40" y1="55" x2="70" y2="55" stroke="#fca5a5" strokeWidth="2" strokeLinecap="round" />
                      <line x1="40" y1="70" x2="60" y2="70" stroke="#fca5a5" strokeWidth="2" strokeLinecap="round" />
                      <circle cx="75" cy="75" r="15" fill="white" stroke="#ef4444" strokeWidth="2.5" />
                      <line x1="85" y1="85" x2="98" y2="98" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" />
                    </svg>

                    <h3 className="font-bold text-[#1a1c1c] text-lg">
                      {formOwnerFilter === 'owner' ? "You don't have any forms yet" : "No forms to show"}
                    </h3>
                    <p className="text-[#777777] text-xs max-w-sm leading-relaxed">
                      Collect requests and automatically turn submissions into tasks
                    </p>

                    <div className="flex items-center gap-3 mt-2">
                      {formOwnerFilter === 'owner' && (
                        <button 
                          type="button" 
                          onClick={() => {
                            setFormOwnerFilter('all');
                            setFormSearchQuery('');
                            setFormFilter('all');
                          }} 
                          className="px-4 py-2 border border-[#e2e2e2] rounded-lg text-xs font-bold text-[#777777] hover:bg-[#f9f9f9] transition-colors shadow-sm"
                        >
                          Clear filters
                        </button>
                      )}
                      
                      <div className="relative">
                        <button 
                          onClick={() => {
                            setProjectPickerType(prev => prev === 'forms' ? null : 'forms');
                            setProjectPickerSearch('');
                          }} 
                          className="bg-black hover:bg-neutral-800 text-white text-xs font-bold px-4 py-2 rounded-lg shadow-sm transition-colors"
                        >
                          Create form
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white rounded-xl border border-[#e2e2e2] overflow-hidden shadow-sm text-xs text-left">
                    <table className="w-full border-collapse text-left text-xs font-medium text-[#1a1c1c]">
                      <thead>
                        <tr className="bg-[#f9f9f9] border-b border-[#e2e2e2] text-[#777777] uppercase tracking-widest text-[9px] font-bold">
                          <th className="py-4 px-6 font-semibold w-4/12">Intake Form Details</th>
                          <th className="py-4 px-4 font-semibold w-3/12">Feeds Project Board</th>
                          <th className="py-4 px-4 font-semibold w-2/12 text-center">Submissions</th>
                          <th className="py-4 px-4 font-semibold w-2/12 text-center">Public Link status</th>
                          <th className="py-4 px-6 font-semibold w-1/12 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#e2e2e2]/60">
                        {filteredForms.map(form => (
                          <tr key={form.id} className="hover:bg-[#f9f9f9]/40 transition-colors">
                            
                            {/* Form Details */}
                            <td className="py-4 px-6 align-top">
                              <div className="font-bold text-sm text-[#1a1c1c] flex items-center gap-2">
                                <ClipboardList className="h-4.5 w-4.5 text-zinc-500" />
                                <span>{form.name}</span>
                              </div>
                              {form.description && (
                                <p className="text-[11px] text-[#777777] mt-1 normal-case leading-relaxed font-normal line-clamp-2" title={form.description}>
                                  {form.description}
                                </p>
                              )}
                              
                              <div className="mt-3 flex items-center gap-1.5 flex-wrap">
                                <span className="bg-[#f3f4f6] text-[9px] font-bold text-zinc-500 px-2 py-0.5 rounded uppercase border border-[#e2e2e2]">
                                  {form.scope}
                                </span>
                                <span className="bg-indigo-50 border border-indigo-200 text-[9px] font-bold text-indigo-700 px-2 py-0.5 rounded uppercase">
                                  {form.fields.length} questions
                                </span>
                              </div>
                            </td>

                            {/* Feeds Project */}
                            <td className="py-4 px-4 align-top">
                              <div className="flex items-center gap-2 mt-1 font-bold text-zinc-700">
                                <Kanban className="h-4 w-4 text-[#8a8b8c]" />
                                <span>{form.targetProject}</span>
                              </div>
                              <span className="text-[10px] text-zinc-400 font-normal leading-normal mt-1 block">
                                Assignee: {form.defaultAssignee}
                              </span>
                            </td>

                            {/* Submissions count */}
                            <td className="py-4 px-4 text-center align-top">
                              <button
                                type="button"
                                onClick={() => setSelectedFormSubmissions(form)}
                                className="inline-block mt-1 px-2.5 py-1 rounded bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-100 hover:scale-105 active:scale-95 transition-all text-xs font-bold"
                                title="Open submissions database ledger"
                              >
                                {form.submissionsCount} submissions
                              </button>
                            </td>

                            {/* Public status toggle */}
                            <td className="py-4 px-4 align-top">
                              <div className="flex items-center justify-center mt-1">
                                <button
                                  type="button"
                                  onClick={() => handleToggleFormStatus(form.id, form.active)}
                                  className="focus:outline-none hover:scale-105 transition-transform"
                                  title={form.active ? "Pause Intake Link" : "Activate Intake Link"}
                                >
                                  {form.active ? (
                                    <div className="flex items-center gap-1 text-emerald-600 font-bold">
                                      <ToggleRight className="h-8 w-8 stroke-[1.5px]" />
                                      <span className="text-[10px] uppercase">Active</span>
                                    </div>
                                  ) : (
                                    <div className="flex items-center gap-1 text-zinc-400 font-bold">
                                      <ToggleLeft className="h-8 w-8 stroke-[1.5px]" />
                                      <span className="text-[10px] uppercase">Paused</span>
                                    </div>
                                  )}
                                </button>
                              </div>
                            </td>

                            {/* Actions delete/edit */}
                            <td className="py-4 px-6 text-right align-top">
                              <div className="flex items-center justify-end gap-1 mt-1">
                                <button
                                  onClick={() => handleOpenFormDesigner(form)}
                                  className="p-1.5 hover:bg-[#f3f4f6] rounded border border-[#e2e2e2] text-zinc-400 hover:text-black transition-colors"
                                  title="Edit intake form sheets"
                                >
                                  <Edit3 className="h-3.5 w-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteForm(form.id, form.name)}
                                  className="p-1.5 hover:bg-[#fee2e2] rounded border border-[#e2e2e2] text-[#777777] hover:text-red-700 transition-colors"
                                  title="Delete Form"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </td>

                          </tr>
                        ))}
                      </tbody>
                    </table>
                    
                    {/* Footer stats */}
                    <div className="px-6 py-4 bg-[#f9f9f9] border-t border-[#e2e2e2] flex items-center justify-between text-[#777777] text-[10px] font-bold uppercase tracking-wider">
                      <span>Showing {filteredForms.length} of {forms.length} available forms</span>
                      <span>Total dynamic records: {forms.reduce((acc, curr) => acc + curr.submissionsCount, 0)} entries</span>
                    </div>
                  </div>
                )}

              </div>
            )}

            {/* --- D. TASK TYPES VIEW (FULLY IMPLEMENTED IN HIGH FIDELITY) --- */}
            {view === 'workflow-task-types' && (
              <div className="flex flex-col gap-6 max-w-7xl mx-auto animate-fade-in font-sans">
                
                {/* Action bar */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-[#e2e2e2] shadow-sm flex-shrink-0 text-xs">
                  
                  {/* Left filters search */}
                  <div className="flex flex-1 flex-wrap items-center gap-3">
                    {/* Search */}
                    <div className="relative flex-1 min-w-[200px] max-w-md">
                      <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#8a8b8c]" />
                      <input
                        type="text"
                        value={taskTypeSearchQuery}
                        onChange={(e) => setTaskTypeSearchQuery(e.target.value)}
                        placeholder="Search custom task types..."
                        className="w-full pl-9 pr-4 py-2 border border-[#e2e2e2] rounded-lg font-medium placeholder-[#8a8b8c] bg-[#f9f9f9] focus:outline-none transition-all text-[#1a1c1c]"
                      />
                      {taskTypeSearchQuery && <button onClick={() => setTaskTypeSearchQuery('')} className="absolute right-2.5 top-2.5 hover:bg-[#e2e2e2] p-0.5 rounded"><X className="h-3 w-3" /></button>}
                    </div>

                    {/* Filter Status */}
                    <div className="relative">
                      <div 
                        onClick={() => {
                          setIsTaskTypeSharingOpen(!isTaskTypeSharingOpen);
                          setIsTaskTypeSortOpen(false);
                        }}
                        className="flex items-center gap-2 border border-[#e2e2e2] rounded-lg px-3 py-2 bg-[#f9f9f9] font-bold text-[#1a1c1c] hover:bg-[#f0f0f0] transition-colors cursor-pointer select-none"
                      >
                        <span className="text-[#777777] font-semibold">Status:</span>
                        <span className="capitalize">{taskTypeFilter === 'all' ? 'All types' : taskTypeFilter === 'active' ? 'Active standard' : 'Paused'}</span>
                        <ChevronDown className={`h-3.5 w-3.5 text-[#777777] transition-transform ${isTaskTypeSharingOpen ? 'rotate-180' : ''}`} />
                      </div>

                      {isTaskTypeSharingOpen && (
                        <>
                          <div className="fixed inset-0 z-10" onClick={() => setIsTaskTypeSharingOpen(false)} />
                          <div className="absolute left-0 mt-1.5 w-56 bg-white border border-[#e2e2e2] rounded-xl shadow-xl z-20 p-1.5 animate-scale-in text-left">
                            {[
                              { value: 'all', label: 'All types', desc: 'View all task card classifications' },
                              { value: 'active', label: 'Active standard', desc: 'Active organizational structures' },
                              { value: 'inactive', label: 'Paused types', desc: 'Temporarily disabled frameworks' }
                            ].map(opt => (
                              <button
                                key={opt.value}
                                type="button"
                                onClick={() => {
                                  setTaskTypeFilter(opt.value);
                                  setIsTaskTypeSharingOpen(false);
                                }}
                                className="w-full flex items-center justify-between p-2 hover:bg-[#f3f4f6] rounded-lg text-xs font-semibold transition-colors text-[#1a1c1c]"
                              >
                                <div className="flex flex-col">
                                  <span className="font-bold flex items-center gap-1.5">
                                    {opt.value === 'active' && <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />}
                                    {opt.value === 'inactive' && <span className="h-1.5 w-1.5 rounded-full bg-zinc-400" />}
                                    {opt.label}
                                  </span>
                                  <span className="text-[10px] text-[#777777] font-normal mt-0.5">{opt.desc}</span>
                                </div>
                                {taskTypeFilter === opt.value && <Check className="h-4 w-4 text-black stroke-[2.5px]" />}
                              </button>
                            ))}
                          </div>
                        </>
                      )}
                    </div>

                    {/* Sort */}
                    <div className="relative">
                      <div 
                        onClick={() => {
                          setIsTaskTypeSortOpen(!isTaskTypeSortOpen);
                          setIsTaskTypeSharingOpen(false);
                        }}
                        className="flex items-center gap-2 border border-[#e2e2e2] rounded-lg px-3 py-2 bg-[#f9f9f9] font-bold text-[#1a1c1c] hover:bg-[#f0f0f0] transition-colors cursor-pointer select-none"
                      >
                        <ArrowUpDown className="h-3.5 w-3.5 text-[#777777]" />
                        <span className="text-[#777777] font-semibold">Sort:</span>
                        <span className="capitalize">{taskTypeSort === 'alphabetical' ? 'Alphabetical' : taskTypeSort === 'usage' ? 'Usage index' : 'Color swatch'}</span>
                        <ChevronDown className={`h-3.5 w-3.5 text-[#777777] transition-transform ${isTaskTypeSortOpen ? 'rotate-180' : ''}`} />
                      </div>

                      {isTaskTypeSortOpen && (
                        <>
                          <div className="fixed inset-0 z-10" onClick={() => setIsTaskTypeSortOpen(false)} />
                          <div className="absolute left-0 mt-1.5 w-48 bg-white border border-[#e2e2e2] rounded-xl shadow-xl z-20 p-1.5 animate-scale-in text-left">
                            {[
                              { value: 'alphabetical', label: 'Alphabetical' },
                              { value: 'usage', label: 'Usage / linked count' },
                              { value: 'color', label: 'Color swatch theme' }
                            ].map(opt => (
                              <button
                                key={opt.value}
                                type="button"
                                onClick={() => {
                                  setTaskTypeSort(opt.value);
                                  setIsTaskTypeSortOpen(false);
                                }}
                                className="w-full flex items-center justify-between px-3 py-2 hover:bg-[#f3f4f6] rounded-lg text-xs font-semibold transition-colors text-[#1a1c1c]"
                              >
                                <span>{opt.label}</span>
                                {taskTypeSort === opt.value && <Check className="h-4 w-4 text-black stroke-[2.5px]" />}
                              </button>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Right Action */}
                  <button
                    onClick={handleOpenCreateTaskType}
                    className="bg-[#2d2e30] hover:bg-black text-white text-xs font-bold tracking-wider uppercase px-4 py-2.5 rounded-lg shadow transition-colors flex items-center justify-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Define Task Type</span>
                  </button>

                </div>

                {/* Grid Container */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
                  {filteredTaskTypes.length === 0 ? (
                    <div className="col-span-full py-12 text-center text-[#777777] bg-white rounded-xl border border-[#e2e2e2] italic">
                      <div className="flex flex-col items-center gap-2 py-4">
                        <Layers className="h-8 w-8 text-[#c5c6c7] stroke-[1.5px]" />
                        <span>No task classifications matching your search parameters.</span>
                        <button onClick={() => { setTaskTypeSearchQuery(''); setTaskTypeFilter('all'); }} className="text-xs font-bold underline text-black mt-1">Reset Filters</button>
                      </div>
                    </div>
                  ) : (
                    filteredTaskTypes.map(tt => {
                      const ICON_MAP = {
                        Sparkles, CheckSquare, Layers, Sliders, Calendar, AlignLeft, Hash, Bug, MessageSquare, ClipboardList, GitMerge, FileText
                      };
                      const IconComponent = ICON_MAP[tt.iconName] || HelpCircle;
                      
                      return (
                        <div 
                          key={tt.id} 
                          className="bg-white rounded-xl border border-[#e2e2e2] p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                        >
                          <div>
                            {/* Card Header: Icon Accent Color + Status Toggle */}
                            <div className="flex items-center justify-between gap-3 border-b border-[#e2e2e2]/60 pb-3">
                              <div 
                                style={{ backgroundColor: tt.colorHex, border: `1px solid ${tt.borderHex}` }}
                                className="h-8 w-8 rounded-lg flex items-center justify-center"
                              >
                                <IconComponent style={{ color: tt.textColorHex }} className="h-4.5 w-4.5" />
                              </div>

                              <button
                                type="button"
                                onClick={() => handleToggleTaskTypeStatus(tt.id)}
                                className="focus:outline-none"
                                title={tt.active ? "Pause Task Type" : "Activate Task Type"}
                              >
                                {tt.active ? (
                                  <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[8px] font-bold uppercase tracking-wider">Active</span>
                                ) : (
                                  <span className="px-2 py-0.5 rounded-full bg-zinc-50 text-zinc-400 border border-zinc-200 text-[8px] font-bold uppercase tracking-wider">Paused</span>
                                )}
                              </button>
                            </div>

                            {/* Details: Name & Desc */}
                            <div className="mt-4">
                              <h3 className="text-sm font-bold text-[#1a1c1c] tracking-tight">{tt.name}</h3>
                              <p className="text-[11px] text-[#777777] mt-1.5 leading-relaxed font-normal min-h-[50px] line-clamp-3">
                                {tt.desc || 'No procedural description established.'}
                              </p>
                            </div>

                            {/* Default Fields checklist */}
                            <div className="mt-4 pt-3 border-t border-[#e2e2e2]/60">
                              <span className="text-[8px] font-bold text-neutral-400 uppercase tracking-widest block mb-2">Preset task parameters:</span>
                              <div className="flex flex-wrap gap-1">
                                {tt.fields.map(f => (
                                  <span key={f} className="text-[9px] font-bold text-zinc-600 bg-neutral-50 border border-neutral-200/80 px-2 py-0.5 rounded-full capitalize">
                                    {f.replace('-', ' ')}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Footer Action buttons */}
                          <div className="mt-6 pt-4 border-t border-[#e2e2e2]/60 flex items-center justify-between">
                            <span className="text-[10px] text-zinc-400 font-semibold leading-normal">
                              Linked in {tt.associatedProjectsCount} templates
                            </span>
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleOpenEditTaskType(tt)}
                                className="p-1.5 hover:bg-[#f3f4f6] rounded border border-[#e2e2e2] text-zinc-400 hover:text-black transition-colors"
                                title="Edit task type parameters"
                              >
                                <Edit3 className="h-3.5 w-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteTaskType(tt.id, tt.name)}
                                className="p-1.5 hover:bg-[#fee2e2] rounded border border-[#e2e2e2] text-[#777777] hover:text-red-700 transition-colors"
                                title="Delete task type classification"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>

                        </div>
                      );
                    })
                  )}
                </div>

              </div>
            )}
            {/* --- E. PROJECT TEMPLATES VIEW --- */}
            {view === 'workflow-templates' && (
              <div className="flex flex-col gap-6 max-w-7xl mx-auto font-sans text-xs">
                
                {/* Visual Owner Filter active badge */}
                {templateOwnerFilter === 'owner' && (
                  <div className="flex items-center gap-2 bg-[#dbeafe] border border-[#93c5fd] rounded-full px-3 py-1 text-xs font-bold text-[#1e40af] select-none animate-fade-in w-max">
                    <span>Filter: Owner</span>
                    <button type="button" onClick={() => setTemplateOwnerFilter('all')} className="hover:bg-[#93c5fd]/50 rounded-full p-0.5"><X className="h-3 w-3" /></button>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-[#e2e2e2] shadow-sm flex-shrink-0 relative">
                  <div className="flex flex-1 flex-wrap items-center gap-3">
                    <div className="relative flex-1 min-w-[200px] max-w-md">
                      <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#8a8b8c]" />
                      <input type="text" value={templateSearchQuery} onChange={(e) => setTemplateSearchQuery(e.target.value)} placeholder="Search project templates..." className="w-full pl-9 pr-4 py-2 border border-[#e2e2e2] rounded-lg text-xs font-medium placeholder-[#8a8b8c] bg-[#f9f9f9] focus:outline-none transition-all" />
                      {templateSearchQuery && <button onClick={() => setTemplateSearchQuery('')} className="absolute right-2.5 top-2.5 hover:bg-[#e2e2e2] rounded p-0.5"><X className="h-3 w-3" /></button>}
                    </div>

                    {/* Filter Toggle Trigger */}
                    <button 
                      type="button" 
                      onClick={() => setTemplateOwnerFilter(prev => prev === 'all' ? 'owner' : 'all')} 
                      className={`flex items-center gap-2 border rounded-lg px-3 py-2 text-xs font-semibold transition-colors hover:bg-[#f0f0f0] ${
                        templateOwnerFilter === 'owner' ? 'bg-[#dbeafe] border-[#93c5fd] text-[#1e40af]' : 'border-[#e2e2e2] bg-[#f9f9f9] text-[#777777]'
                      }`}
                    >
                      <Sliders className="h-3.5 w-3.5" />
                      <span>Filter</span>
                    </button>

                    <div className="flex items-center gap-2 border border-[#e2e2e2] rounded-lg px-3 py-2 bg-[#f9f9f9] text-xs font-semibold cursor-pointer hover:bg-[#f0f0f0] transition-colors relative">
                      <span className="text-[#777777]">Scope:</span>
                      <select value={templateFilter} onChange={(e) => setTemplateFilter(e.target.value)} className="bg-transparent font-bold outline-none text-[#1a1c1c]">
                        <option value="all">All scopes</option>
                        <option value="organization">Organization wide</option>
                        <option value="project-only">Project scoped</option>
                        <option value="private">Private to invitees</option>
                      </select>
                    </div>
                  </div>

                  {/* Create Template Button */}
                  <button 
                    onClick={() => {
                      setWizardTitle('Sprint Scrum Plan');
                      setWizardScope('organization');
                      setIsProjectTemplateWizardOpen(true);
                    }} 
                    className="bg-black hover:bg-neutral-800 text-white text-xs font-bold tracking-wider uppercase px-4 py-2.5 rounded-lg shadow flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Create template</span>
                  </button>
                </div>

                {filteredTemplates.length === 0 ? (
                  <div className="bg-white rounded-xl border border-[#e2e2e2] shadow-sm p-12 text-center flex flex-col items-center justify-center gap-4 min-h-[380px]">
                    {/* SVG jigsaw puzzle empty state illustration */}
                    <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="animate-pulse">
                      <path d="M45 25C40 25 35 30 35 35C35 40 40 40 40 45C40 50 35 50 35 55C35 60 40 65 45 65" stroke="#fca5a5" strokeWidth="2.5" fill="#fff5f5" />
                      <path d="M65 25C70 25 75 30 75 35C75 40 70 40 70 45C70 50 75 50 75 55C75 60 70 65 65 65" stroke="#fca5a5" strokeWidth="2.5" fill="#fff5f5" />
                      <path d="M45 25L65 25" stroke="#fca5a5" strokeWidth="2.5" />
                      <path d="M45 65L65 65" stroke="#fca5a5" strokeWidth="2.5" />
                      <path d="M65 45C60 45 55 50 55 55C55 60 60 60 60 65C60 70 55 70 55 75C55 80 60 85 65 85L85 85C90 85 95 80 95 75C95 70 90 70 90 65C90 60 95 60 95 55C95 50 90 45 85 45L65 45Z" stroke="#ef4444" strokeWidth="2.5" fill="#fee2e2" />
                    </svg>

                    <h3 className="font-bold text-[#1a1c1c] text-lg">
                      {templateOwnerFilter === 'owner' ? "You don't have any project templates yet" : "No project templates to show"}
                    </h3>
                    <p className="text-[#777777] text-xs max-w-sm leading-relaxed">
                      Help your team start projects faster and stay consistent
                    </p>

                    <div className="flex items-center gap-3 mt-2">
                      {templateOwnerFilter === 'owner' && (
                        <button 
                          type="button" 
                          onClick={() => {
                            setTemplateOwnerFilter('all');
                            setTemplateSearchQuery('');
                            setTemplateFilter('all');
                          }} 
                          className="px-4 py-2 border border-[#e2e2e2] rounded-lg text-xs font-bold text-[#777777] hover:bg-[#f9f9f9] transition-colors shadow-sm"
                        >
                          Clear filters
                        </button>
                      )}
                      
                      <button 
                        onClick={() => {
                          setWizardTitle('Sprint Scrum Plan');
                          setWizardScope('organization');
                          setIsProjectTemplateWizardOpen(true);
                        }} 
                        className="bg-black hover:bg-neutral-800 text-white text-xs font-bold px-4 py-2 rounded-lg shadow-sm transition-colors"
                      >
                        Create template
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                    {filteredTemplates.map((tmpl) => (
                      <div key={tmpl.id} className="bg-white rounded-xl border border-[#e2e2e2] p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
                        <div>
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <h3 className="text-sm font-bold text-[#1a1c1c] tracking-tight">{tmpl.name}</h3>
                              <div className="flex items-center gap-2 mt-1.5">
                                <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider ${
                                  tmpl.scope === 'organization' ? 'bg-zinc-100 text-zinc-800 border border-zinc-200' : tmpl.scope === 'project-only' ? 'bg-amber-50 text-amber-800 border border-amber-200' : 'bg-red-50 text-red-800 border border-red-200'
                                }`}>
                                  {tmpl.scope}
                                </span>
                                <span className="text-[10px] text-[#777777] font-semibold">Used {tmpl.usedCount} times</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className={`h-7 w-7 rounded-full flex items-center justify-center font-bold text-[10px] shadow-xs ${tmpl.createdBy.avatarBg || 'bg-zinc-200 text-black'}`} title={`Owner: ${tmpl.createdBy.name}`}>
                                {tmpl.createdBy.name.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase()}
                              </div>
                            </div>
                          </div>
                          <p className="text-[11px] text-[#777777] mt-3 font-normal leading-relaxed line-clamp-3">{tmpl.description || 'No description provided for this template workspace.'}</p>
                          <div className="mt-4 space-y-2 pt-3 border-t border-[#e2e2e2]/60">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-[9px] font-bold text-neutral-400 uppercase mr-1">Steps:</span>
                              {tmpl.columns.slice(0, 3).map((col, cIdx) => (
                                <span key={cIdx} className="text-[10px] font-semibold text-[#555] bg-[#f3f4f6] px-2 py-0.5 rounded border border-[#e2e2e2]">{col}</span>
                              ))}
                              {tmpl.columns.length > 3 && <span className="text-[9px] font-bold text-neutral-400">+{tmpl.columns.length - 3} more</span>}
                            </div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-[9px] font-bold text-neutral-400 uppercase mr-1">Views:</span>
                              <div className="flex items-center gap-1 overflow-hidden">
                                {tmpl.activeTabs.slice(0,4).map((t, tIdx) => <span key={tIdx} className="text-[9px] font-bold text-zinc-400 uppercase">[{t}]</span>)}
                                {tmpl.activeTabs.length > 4 && <span className="text-[9px] text-[#777777] font-semibold">+{tmpl.activeTabs.length - 4}</span>}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="mt-6 pt-4 border-t border-[#e2e2e2]/60 flex items-center justify-between">
                          <button onClick={() => alert(`Deploying standard project instance using the "${tmpl.name}" metadata configurations!`)} className="bg-black hover:bg-neutral-800 text-white text-[10px] font-bold tracking-wider uppercase px-3 py-1.5 rounded shadow">Use Template</button>
                          <div className="flex items-center gap-1">
                            <button onClick={() => handleOpenTemplateBuilder(tmpl)} className="p-1.5 hover:bg-[#f3f4f6] rounded border border-[#e2e2e2] text-[#777777] hover:text-black" title="Edit Template Canvas"><Edit3 className="h-3.5 w-3.5" /></button>
                            <button onClick={() => handleDeleteTemplate(tmpl.id, tmpl.name)} className="p-1.5 hover:bg-[#fee2e2] rounded border border-[#e2e2e2] text-[#777777] hover:text-red-700" title="Delete Template"><Trash2 className="h-3.5 w-3.5" /></button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* --- F. STATUS TEMPLATES VIEW --- */}
            {view === 'workflow-status-templates' && (
              <div className="flex flex-col gap-6 max-w-7xl mx-auto animate-fade-in font-sans text-xs">
                
                {/* Asana Horizontal sub-navigation tabs */}
                <div className="flex border-b border-[#e2e2e2] flex-shrink-0 text-left">
                  <button 
                    type="button" 
                    onClick={() => setActiveStatusTab('Projects')}
                    className={`px-5 py-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
                      activeStatusTab === 'Projects' ? 'border-black text-black' : 'border-transparent text-[#777777] hover:text-black'
                    }`}
                  >
                    <Kanban className="h-3.5 w-3.5" />
                    <span>Projects Templates</span>
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setActiveStatusTab('Portfolios')}
                    className={`px-5 py-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
                      activeStatusTab === 'Portfolios' ? 'border-black text-black' : 'border-transparent text-[#777777] hover:text-black'
                    }`}
                  >
                    <FileSpreadsheet className="h-3.5 w-3.5" />
                    <span>Portfolios Templates</span>
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-[#e2e2e2] shadow-sm flex-shrink-0">
                  <div className="flex flex-1 flex-wrap items-center gap-3">
                    <div className="relative flex-1 min-w-[200px] max-w-md">
                      <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#8a8b8c]" />
                      <input type="text" value={statusSearchQuery} onChange={(e) => setStatusSearchQuery(e.target.value)} placeholder="Search status templates..." className="w-full pl-9 pr-4 py-2 border border-[#e2e2e2] rounded-lg text-xs font-medium placeholder-[#8a8b8c] bg-[#f9f9f9] focus:outline-none transition-all text-[#1a1c1c]" />
                      {statusSearchQuery && <button onClick={() => setStatusSearchQuery('')} className="absolute right-2.5 top-2.5 hover:bg-[#e2e2e2] rounded p-0.5"><X className="h-3 w-3" /></button>}
                    </div>

                    {/* Pre-filled status markers filter dropdown selector */}
                    <div className="flex items-center gap-2 border border-[#e2e2e2] rounded-lg px-3 py-2 bg-[#f9f9f9] text-xs font-semibold cursor-pointer hover:bg-[#f0f0f0] transition-colors relative">
                      <span className="text-[#777777]">Prefilled Status:</span>
                      <select value={statusTemplateSelection} onChange={(e) => setStatusTemplateSelection(e.target.value)} className="bg-transparent font-bold cursor-pointer outline-none text-[#1a1c1c]">
                        <option value="On Track">🟢 On Track</option>
                        <option value="At Risk">🟡 At Risk</option>
                        <option value="Off Track">🔴 Off Track</option>
                        <option value="On Hold">⚪ On Hold</option>
                      </select>
                    </div>
                  </div>
                  <button onClick={handleOpenCreateStatusModal} className="bg-[#2d2e30] hover:bg-black text-white text-xs font-bold tracking-wider uppercase px-4 py-2.5 rounded-lg shadow flex items-center justify-center gap-2">
                    <Plus className="h-4 w-4" />
                    <span>Create status template</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {filteredStatusTemplates.length === 0 ? (
                    <div className="col-span-3 py-12 text-center text-[#777777] bg-white rounded-xl border border-[#e2e2e2] flex flex-col items-center justify-center p-8 gap-4 min-h-[300px]">
                      {/* Gorgeous Custom SVG Jigsaw empty state */}
                      <svg width="100" height="100" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="animate-pulse">
                        <path d="M45 25C40 25 35 30 35 35C35 40 40 40 40 45C40 50 35 50 35 55C35 60 40 65 45 65" stroke="#fca5a5" strokeWidth="2.5" fill="#fff5f5" />
                        <path d="M65 25C70 25 75 30 75 35C75 40 70 40 70 45C70 50 75 50 75 55C75 60 70 65 65 65" stroke="#fca5a5" strokeWidth="2.5" fill="#fff5f5" />
                        <path d="M45 25L65 25" stroke="#fca5a5" strokeWidth="2.5" />
                        <path d="M45 65L65 65" stroke="#fca5a5" strokeWidth="2.5" />
                        <circle cx="60" cy="60" r="14" fill="#fee2e2" stroke="#ef4444" strokeWidth="2" />
                      </svg>
                      <h3 className="font-bold text-[#1a1c1c] text-base">You don't have any status update templates yet</h3>
                      <p className="text-[#777777] text-xs max-w-sm leading-relaxed">
                        Design weekly or monthly report cards to update squad leads on work velocity
                      </p>
                    </div>
                  ) : (
                    filteredStatusTemplates.map(st => (
                      <div key={st.id} className="bg-white rounded-xl border border-[#e2e2e2] p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group text-left">
                        <div>
                          <div className="flex items-start justify-between gap-4 border-b border-[#e2e2e2]/60 pb-3">
                            <div>
                              <h3 className="text-sm font-bold text-[#1a1c1c] tracking-tight">{st.name}</h3>
                              <div className="flex items-center gap-2 mt-1">
                                <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider ${
                                  st.type === 'Project' ? 'bg-blue-50 text-blue-800 border border-blue-200' : 'bg-purple-50 text-purple-800 border border-purple-200'
                                }`}>
                                  For {st.type}
                                </span>
                                <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider">{st.sharing}</span>
                              </div>
                            </div>
                            <div className={`h-6 w-6 rounded-full flex items-center justify-center font-bold text-[9px] ${st.createdBy.avatarBg}`}>{st.createdBy.name.split(' ').map(n => n[0]).join('')}</div>
                          </div>
                          <p className="text-[11px] text-[#777777] mt-3 leading-relaxed font-normal">{st.description || 'No description established for this status summary layout.'}</p>
                          <div className="mt-4">
                            <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest block mb-1.5">Includes report blocks:</span>
                            <div className="flex flex-wrap gap-1">
                              {st.blocks.map(b => <span key={b} className="text-[9px] font-bold text-[#555] bg-neutral-100 border border-neutral-200 px-2 py-0.5 rounded-full capitalize">{b.replace('-', ' ')}</span>)}
                            </div>
                          </div>
                        </div>
                        <div className="mt-6 pt-4 border-t border-[#e2e2e2]/60 flex items-center justify-between">
                          <button onClick={() => alert(`Drafting report workbook using the "${st.name}" layout rules!`)} className="bg-black hover:bg-neutral-800 text-white text-[10px] font-bold tracking-wider uppercase px-3 py-1.5 rounded shadow">Draft report</button>
                          <div className="flex items-center gap-1">
                            <button onClick={() => handleOpenStatusBuilder(st)} className="p-1.5 hover:bg-[#f3f4f6] rounded border border-[#e2e2e2] text-[#777777] hover:text-black" title="Edit Worksheet Outline"><Edit3 className="h-3.5 w-3.5" /></button>
                            <button onClick={() => handleDeleteStatusTemplate(st.id, st.name)} className="p-1.5 hover:bg-[#fee2e2] rounded border border-[#e2e2e2] text-[#777777] hover:text-red-700" title="Delete template"><Trash2 className="h-3.5 w-3.5" /></button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

          </div>
        </>
      )}

      {/* Forms: Added to form checklist modal */}
      {isAddedToFormModalOpen && tempFormDesigner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in font-sans">
          <div className="bg-white w-full max-w-md rounded-xl border border-[#e2e2e2] shadow-2xl flex flex-col overflow-hidden max-h-[85vh] animate-scale-in text-xs">
            
            {/* Header */}
            <div className="px-6 py-4 border-b border-[#e2e2e2] bg-[#f9f9f9] flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-[#1a1c1c] uppercase tracking-wider">Added to form</h3>
                <p className="text-[10px] text-[#777777] font-semibold uppercase mt-0.5">Toggle questions visible on request form</p>
              </div>
              <button 
                type="button" 
                onClick={() => setIsAddedToFormModalOpen(false)} 
                className="p-1 hover:bg-[#e2e2e2] rounded-lg text-[#777777]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Content List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 text-left">
              <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest block mb-2">Available Intake Parameters</span>
              
              <div className="space-y-2">
                {/* Standard Required parameters */}
                <div className="flex items-center justify-between p-3 bg-[#f9f9f9] border border-[#e2e2e2] rounded-lg opacity-60 cursor-not-allowed">
                  <div className="flex items-center gap-2">
                    <input type="checkbox" checked disabled className="accent-black h-3.5 w-3.5" />
                    <div>
                      <span className="font-bold text-[#1a1c1c] text-xs">Task Name / Subject</span>
                      <span className="text-[9px] text-zinc-400 block mt-0.5">System Required Parameter</span>
                    </div>
                  </div>
                  <span className="bg-[#e2e2e2] text-zinc-600 px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider">Static</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-[#f9f9f9] border border-[#e2e2e2] rounded-lg opacity-60 cursor-not-allowed">
                  <div className="flex items-center gap-2">
                    <input type="checkbox" checked disabled className="accent-black h-3.5 w-3.5" />
                    <div>
                      <span className="font-bold text-[#1a1c1c] text-xs">Operational Description</span>
                      <span className="text-[9px] text-zinc-400 block mt-0.5">System Required Parameter</span>
                    </div>
                  </div>
                  <span className="bg-[#e2e2e2] text-zinc-600 px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider">Static</span>
                </div>

                {/* Optional parameters checklist */}
                {[
                  { id: 'attachment', label: 'Supporting Attachments & Files', desc: 'File uploads specs', color: 'bg-indigo-50 border-indigo-200 text-indigo-700' },
                  { id: 'due-date', label: 'Target Delivery Due Date', desc: 'Date picker input', color: 'bg-blue-50 border-blue-200 text-blue-700' },
                  { id: 'priority', label: 'Priority Urgency Flags', desc: 'Dropdown priority labels', color: 'bg-red-50 border-red-200 text-red-700' },
                  { id: 'custom-repro-steps', label: 'Reproduction Logs steps', desc: 'Drilldown repro spec textarea', color: 'bg-amber-50 border-amber-200 text-amber-700' },
                  { id: 'custom-text', label: 'Custom Text field', desc: 'Freeform single-line input', color: 'bg-purple-50 border-purple-200 text-purple-700' },
                  { id: 'custom-number', label: 'Custom Numeric field', desc: 'Numeric validation input', color: 'bg-emerald-50 border-emerald-200 text-emerald-700' }
                ].map(opt => {
                  const isChecked = tempFormDesigner.fields.includes(opt.id);
                  return (
                    <div 
                      key={opt.id}
                      onClick={() => {
                        if (isChecked) {
                          handleFormDesignerRemoveField(opt.id);
                        } else {
                          handleFormDesignerAddField(opt.id);
                        }
                      }}
                      className={`flex items-center justify-between p-3 bg-white border rounded-lg cursor-pointer hover:border-black/50 transition-all select-none ${
                        isChecked ? 'border-zinc-400 bg-zinc-50/50 shadow-2xs' : 'border-[#e2e2e2]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <input 
                          type="checkbox" 
                          checked={isChecked} 
                          onChange={() => {}} 
                          className="accent-black h-3.5 w-3.5 pointer-events-none" 
                        />
                        <div>
                          <span className="font-bold text-[#1a1c1c] text-xs">{opt.label}</span>
                          <span className="text-[9px] text-zinc-400 block mt-0.5">{opt.desc}</span>
                        </div>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider border ${opt.color}`}>
                        {isChecked ? 'Added' : 'Optional'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-[#e2e2e2] bg-[#f9f9f9] flex items-center justify-end flex-shrink-0">
              <button 
                type="button" 
                onClick={() => setIsAddedToFormModalOpen(false)} 
                className="px-5 py-2 bg-black hover:bg-neutral-800 text-white font-bold uppercase tracking-wider rounded-lg shadow"
              >
                Done
              </button>
            </div>

          </div>
        </div>
      )}

      {/* --- MODALS & OVERLAYS --- */}

      {/* 3. Global Create / Edit Custom Field Overlay Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in font-sans">
          <div className="bg-white w-full max-w-lg rounded-xl border border-[#e2e2e2] shadow-2xl flex flex-col overflow-hidden max-h-[90vh] animate-scale-in">
            <div className="px-6 py-4 border-b border-[#e2e2e2] flex items-center justify-between bg-[#f9f9f9]">
              <div>
                <h3 className="text-sm font-bold text-[#1a1c1c] uppercase tracking-wider">{modalMode === 'edit' ? 'Edit Custom Field' : 'Create Custom Field'}</h3>
                <p className="text-[10px] text-[#777777] font-semibold uppercase mt-0.5">Configure organizational task metadata</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-1 hover:bg-[#e2e2e2] rounded-lg text-[#777777]"><X className="h-4 w-4" /></button>
            </div>

            <form onSubmit={handleSaveField} className="flex-1 overflow-y-auto p-6 space-y-5 text-xs text-left">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-[#555] uppercase tracking-wider flex items-center gap-1">Field Type <HelpCircle className="h-3 w-3" /></label>
                <div className="relative">
                  <select value={fieldType} onChange={(e) => setFieldType(e.target.value)} disabled={modalMode === 'edit'} className="w-full bg-[#f9f9f9] border border-[#e2e2e2] rounded-lg px-3 py-2.5 text-xs font-bold text-[#1a1c1c] appearance-none focus:outline-none focus:bg-white disabled:opacity-60">
                    <option value="single-select">Single-select Dropdown (Pill options)</option>
                    <option value="multi-select">Multi-select (Multiple Pill options)</option>
                    <option value="text">Text (Freeform input)</option>
                    <option value="number">Number (Decimal, Percent, Currency)</option>
                    <option value="date">Date (Gregorian calendar)</option>
                    <option value="people">People (Organization Squad Members)</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-[#777777] pointer-events-none" />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-[#555] uppercase tracking-wider">Field Name</label>
                <input type="text" required value={fieldName} onChange={(e) => setFieldName(e.target.value)} placeholder="e.g. Workload Cost" className="w-full bg-[#f9f9f9] border border-[#e2e2e2] rounded-lg px-3 py-2.5 text-xs font-medium placeholder-[#8a8b8c] focus:outline-none focus:bg-white text-[#1a1c1c]" />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-[#555] uppercase tracking-wider">Description (Optional)</label>
                <textarea value={fieldDescription} onChange={(e) => setFieldDescription(e.target.value)} placeholder="Describe the usage protocol..." rows="2" className="w-full bg-[#f9f9f9] border border-[#e2e2e2] rounded-lg px-3 py-2 text-xs font-medium focus:outline-none focus:bg-white resize-none text-[#1a1c1c]" />
              </div>

              {/* DYNAMIC SELECT OPTION BUILDER */}
              {(fieldType === 'single-select' || fieldType === 'multi-select') && (
                <div className="bg-[#f9f9f9] p-4 rounded-xl border border-[#e2e2e2] space-y-3.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-bold text-[#555] uppercase tracking-wider">Dropdown Option Pills</label>
                    <button type="button" onClick={handleAddOptionRow} className="text-[#777777] hover:text-black text-[10px] font-bold uppercase tracking-wider flex items-center gap-1"><Plus className="h-3.5 w-3.5" /> Add option</button>
                  </div>
                  <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                    {fieldOptions.length === 0 ? (
                      <p className="text-[11px] text-[#777777] italic text-center py-4 bg-white rounded border border-dashed border-[#e2e2e2]">No options added yet.</p>
                    ) : (
                      fieldOptions.map((opt, idx) => {
                        const activeSwatch = getSwatch(opt.colorId);
                        return (
                          <div key={opt.id} className="flex items-center gap-2 bg-white p-2 rounded-lg border border-[#e2e2e2] shadow-xs group">
                            <div className="relative group/swatch">
                              <button type="button" className={`h-5 w-5 rounded-full border ${activeSwatch.bg} ${activeSwatch.border} flex items-center justify-center cursor-pointer`}><span className="h-1.5 w-1.5 rounded-full bg-black/40" /></button>
                              <div className="absolute left-0 top-6 hidden group-hover/swatch:flex items-center gap-1 p-1 bg-white border border-[#e2e2e2] rounded shadow-lg z-50">
                                {COLOR_SWATCHES.map(sw => <button key={sw.id} type="button" onClick={() => handleOptionRowColorChange(opt.id, sw.id)} className={`h-4.5 w-4.5 rounded-full border ${sw.bg} ${sw.border} hover:scale-110`} title={sw.name} />)}
                              </div>
                            </div>
                            <input type="text" required value={opt.label} onChange={(e) => handleOptionRowChange(opt.id, e.target.value)} placeholder={`Option label ${idx + 1}`} className="flex-1 bg-transparent text-xs font-semibold focus:outline-none text-[#1a1c1c]" />
                            <button type="button" onClick={() => handleRemoveOptionRow(opt.id)} className="text-neutral-300 hover:text-red-700 p-0.5"><X className="h-3.5 w-3.5" /></button>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}

              {/* DYNAMIC NUMBER CONFIG */}
              {fieldType === 'number' && (
                <div className="bg-[#f9f9f9] p-4 rounded-xl border border-[#e2e2e2] space-y-4">
                  <label className="text-[10px] font-bold text-[#555] uppercase tracking-wider block">Number Formatting Rules</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[{ id: 'decimal', label: 'Decimal' }, { id: 'percentage', label: 'Percentage (%)' }, { id: 'currency', label: 'Currency' }].map(fmt => (
                      <button key={fmt.id} type="button" onClick={() => setNumberFormat(fmt.id)} className={`py-2 px-3 rounded-lg border text-xs font-bold transition-all text-center ${numberFormat === fmt.id ? 'bg-[#2d2e30] border-black text-white' : 'bg-white border-[#e2e2e2] text-[#777777]'}`}>{fmt.label}</button>
                    ))}
                  </div>
                  {numberFormat === 'decimal' && (
                    <div className="flex items-center justify-between pt-1">
                      <label className="text-xs text-[#555] font-semibold">Decimal places</label>
                      <select value={decimalPlaces} onChange={(e) => setDecimalPlaces(Number(e.target.value))} className="bg-white border border-[#e2e2e2] rounded px-2.5 py-1 text-xs font-bold">
                        <option value="0">0 (e.g. 42)</option>
                        <option value="1">1 (e.g. 42.0)</option>
                        <option value="2">2 (e.g. 42.00)</option>
                      </select>
                    </div>
                  )}
                  {numberFormat === 'currency' && (
                    <div className="flex items-center justify-between pt-1">
                      <label className="text-xs text-[#555] font-semibold">Currency symbol</label>
                      <select value={currencySymbol} onChange={(e) => setCurrencySymbol(e.target.value)} className="bg-white border border-[#e2e2e2] rounded px-2.5 py-1 text-xs font-bold">
                        <option value="$">USD ($)</option>
                        <option value="€">EUR (€)</option>
                        <option value="£">GBP (£)</option>
                      </select>
                    </div>
                  )}
                </div>
              )}

              {/* Scope Toggles */}
              <div className="space-y-3 pt-2 font-sans">
                <div className="flex items-start gap-3">
                  <input type="checkbox" id="scope-org" checked={fieldScope === 'organization'} onChange={(e) => setFieldScope(e.target.checked ? 'organization' : 'project-only')} className="mt-1 h-3.5 w-3.5 accent-black rounded" />
                  <div className="flex flex-col">
                    <label htmlFor="scope-org" className="text-xs font-bold text-[#1a1c1c]">Add to organization's metadata library</label>
                    <span className="text-[10px] text-[#777777] leading-normal mt-0.5 font-normal">Checked enables other workspace teams and sprint project boards to incorporate this field.</span>
                  </div>
                </div>
              </div>

            </form>

            {/* Bottom Actions */}
            <div className="px-6 py-4 border-t border-[#e2e2e2] bg-[#f9f9f9] flex items-center justify-end gap-3 flex-shrink-0">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border border-[#e2e2e2] rounded-lg text-xs font-semibold text-[#777777] hover:bg-[#eaeaea]">Cancel</button>
              <button type="button" onClick={handleSaveField} disabled={!fieldName.trim()} className="px-4 py-2 bg-black hover:bg-neutral-800 text-white text-xs font-bold uppercase rounded-lg shadow">
                {modalMode === 'edit' ? 'Save updates' : 'Create field'}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 4. Create Project Template Modal */}
      {isCreateTemplateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in font-sans">
          <div className="bg-white w-full max-w-lg rounded-xl border border-[#e2e2e2] shadow-2xl flex flex-col overflow-hidden max-h-[90vh] animate-scale-in">
            <div className="px-6 py-4 border-b border-[#e2e2e2] bg-[#f9f9f9] flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-[#1a1c1c] uppercase tracking-wider">Create Project Template</h3>
                <p className="text-[10px] text-[#777777] font-semibold uppercase mt-0.5">Establish a standard board framework recipe</p>
              </div>
              <button onClick={() => setIsCreateTemplateModalOpen(false)} className="p-1 hover:bg-[#e2e2e2] rounded-lg text-[#777777]"><X className="h-4 w-4" /></button>
            </div>

            <form onSubmit={handleCreateTemplate} className="flex-1 overflow-y-auto p-6 space-y-5 text-xs text-left">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-[#555] uppercase tracking-wider">Template Name</label>
                <input type="text" required value={newTemplateName} onChange={(e) => setNewTemplateName(e.target.value)} placeholder="e.g. Sprint Backlog & Agile Board" className="w-full bg-[#f9f9f9] border border-[#e2e2e2] rounded-lg px-3 py-2.5 text-xs font-medium focus:outline-none text-[#1a1c1c]" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-[#555] uppercase tracking-wider">Description (Optional)</label>
                <textarea value={newTemplateDesc} onChange={(e) => setNewTemplateDesc(e.target.value)} placeholder="Describe target usage, pipeline phases, or operational guidelines..." rows="3" className="w-full bg-[#f9f9f9] border border-[#e2e2e2] rounded-lg px-3 py-2 text-xs font-normal focus:outline-none text-[#1a1c1c]" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-[#555] uppercase tracking-wider">Template Access Scope</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'organization', label: 'Organization wide', icon: Globe },
                    { id: 'project-only', label: 'Project scoped', icon: Kanban },
                    { id: 'private', label: 'Private (Invite)', icon: Lock }
                  ].map(sc => {
                    const Icon = sc.icon;
                    return (
                      <button key={sc.id} type="button" onClick={() => setNewTemplateScope(sc.id)} className={`p-3 rounded-lg border flex flex-col items-center gap-1.5 text-center transition-all ${
                        newTemplateScope === sc.id ? 'bg-zinc-100 border-black text-[#1a1c1c] font-bold' : 'bg-[#f9f9f9] border-[#e2e2e2] text-[#777777] font-semibold'
                      }`}>
                        <Icon className="h-4.5 w-4.5" />
                        <span className="text-[10px]">{sc.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="flex flex-col gap-1.5 pt-2">
                <label className="text-[10px] font-bold text-[#555] uppercase tracking-wider">Starting framework</label>
                <select value={newTemplateSource} onChange={(e) => setNewTemplateSource(e.target.value)} className="w-full bg-[#f9f9f9] border border-[#e2e2e2] rounded-lg px-3 py-2.5 text-xs font-bold text-[#1a1c1c] outline-none">
                  <option value="scratch">Start from scratch (To Do to Done pipeline)</option>
                  <option value="scrum">Clone Sprint Scrum standard columns (Backlog, Dev, QA, Done)</option>
                  <option value="marketing">Clone Marketing launch standard columns (Planning, Design, Approved, Live)</option>
                </select>
              </div>
            </form>

            <div className="px-6 py-4 border-t border-[#e2e2e2] bg-[#f9f9f9] flex items-center justify-end gap-3 flex-shrink-0">
              <button type="button" onClick={() => setIsCreateTemplateModalOpen(false)} className="px-4 py-2 border border-[#e2e2e2] rounded-lg text-xs font-semibold text-[#777777] hover:bg-[#eaeaea]">Cancel</button>
              <button type="submit" onClick={handleCreateTemplate} disabled={!newTemplateName.trim()} className="px-4 py-2 bg-black hover:bg-neutral-800 text-white text-xs font-bold uppercase rounded-lg shadow flex items-center gap-1">
                <span>Create & Configure</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Project Template Wizard Modal */}
      {isProjectTemplateWizardOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in font-sans">
          <div className="bg-white w-full max-w-6xl rounded-2xl border border-[#e2e2e2] shadow-2xl flex flex-col overflow-hidden h-[85vh] animate-scale-in">
            {/* Header */}
            <div className="px-6 py-4 border-b border-[#e2e2e2] bg-[#f9f9f9] flex items-center justify-between flex-shrink-0">
              <div>
                <h3 className="text-sm font-bold text-[#1a1c1c] uppercase tracking-wider">Project Template Creation Wizard</h3>
                <p className="text-[10px] text-[#777777] font-semibold uppercase mt-0.5">Establish and preview your organizational template live before deployment</p>
              </div>
              <button onClick={() => setIsProjectTemplateWizardOpen(false)} className="p-1 hover:bg-[#e2e2e2] rounded-lg text-[#777777]"><X className="h-4 w-4" /></button>
            </div>

            {/* Content: Left Form / Right Board Preview */}
            <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
              {/* Left Configuration Panel */}
              <form onSubmit={handleWizardSubmit} className="w-full md:w-96 bg-[#fcfcfc] border-r border-[#e2e2e2] p-6 overflow-y-auto space-y-5 text-left text-xs flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-[#555] uppercase tracking-wider">Template Title</label>
                    <input 
                      type="text" 
                      required 
                      value={wizardTitle} 
                      onChange={(e) => setWizardTitle(e.target.value)} 
                      placeholder="e.g. Sprint Backlog & Agile Board" 
                      className="w-full bg-white border border-[#e2e2e2] rounded-lg px-3 py-2 text-xs font-semibold focus:outline-none focus:border-black text-[#1a1c1c]" 
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-[#555] uppercase tracking-wider">Template Description</label>
                    <textarea 
                      value={newTemplateDesc} 
                      onChange={(e) => setNewTemplateDesc(e.target.value)} 
                      placeholder="Describe target usage, pipeline phases, or operational guidelines..." 
                      rows="3" 
                      className="w-full bg-white border border-[#e2e2e2] rounded-lg px-3 py-2 text-xs font-normal focus:outline-none focus:border-black text-[#1a1c1c] resize-none" 
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-[#555] uppercase tracking-wider">Template Access Scope</label>
                    <select 
                      value={wizardScope} 
                      onChange={(e) => setWizardScope(e.target.value)} 
                      className="w-full bg-white border border-[#e2e2e2] rounded-lg px-3 py-2.5 text-xs font-bold text-[#1a1c1c] outline-none"
                    >
                      <option value="organization">Anyone in organization (Public)</option>
                      <option value="project-only">Project-scoped (Admins only)</option>
                      <option value="private">Private (Invite only)</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5 pt-1">
                    <label className="text-[10px] font-bold text-[#555] uppercase tracking-wider">Starting Pipeline Preset</label>
                    <select 
                      value={newTemplateSource} 
                      onChange={(e) => setNewTemplateSource(e.target.value)} 
                      className="w-full bg-white border border-[#e2e2e2] rounded-lg px-3 py-2.5 text-xs font-bold text-[#1a1c1c] outline-none"
                    >
                      <option value="scratch">Standard Board (To Do, In Progress, QA, Done)</option>
                      <option value="scrum">Agile Scrum (Sprint Backlog, Ready, Dev, Review, Done)</option>
                      <option value="marketing">Campaign Launch (Planning, Design, Approved, Live)</option>
                    </select>
                  </div>
                </div>

                <div className="pt-6 border-t border-[#e2e2e2] flex items-center justify-end gap-3 flex-shrink-0">
                  <button type="button" onClick={() => setIsProjectTemplateWizardOpen(false)} className="px-4 py-2 border border-[#e2e2e2] rounded-lg text-xs font-semibold text-[#777777] hover:bg-[#eaeaea]">Cancel</button>
                  <button type="submit" disabled={!wizardTitle.trim()} className="px-4 py-2 bg-black hover:bg-neutral-800 disabled:opacity-50 text-white text-xs font-bold uppercase rounded-lg shadow flex items-center gap-1">
                    <span>Create Template</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </form>

              {/* Right Interactive Preview Panel */}
              <div className="flex-1 bg-[#f5f6f8] flex flex-col min-w-0 overflow-hidden font-sans text-xs">
                {/* Horizontal Tab Headers */}
                <div className="bg-white border-b border-[#e2e2e2] px-6 py-2.5 flex items-center justify-between flex-shrink-0">
                  <div className="flex items-center gap-1.5 overflow-x-auto">
                    {['Overview', 'List', 'Board', 'Timeline', 'Calendar', 'Workflow'].map(tab => (
                      <button
                        key={tab}
                        type="button"
                        onClick={() => setWizardActiveTab(tab)}
                        className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all ${
                          wizardActiveTab === tab
                            ? 'bg-[#2d2e30] border-black text-white shadow-xs'
                            : 'bg-[#f9f9f9] border-[#e2e2e2] text-[#777777] hover:text-black'
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                  <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider text-right pr-2">Live Preview Worksheet</span>
                </div>

                {/* Simulated Content Area */}
                <div className="flex-1 p-6 overflow-y-auto">
                  {wizardActiveTab === 'Overview' && (
                    <div className="bg-white rounded-xl border border-[#e2e2e2] p-6 shadow-sm max-w-2xl mx-auto space-y-5 text-left">
                      <div className="border-b border-[#e2e2e2]/60 pb-3">
                        <span className="text-[9px] font-bold text-purple-600 uppercase tracking-widest block">Project Brief</span>
                        <h4 className="text-base font-bold text-[#1a1c1c] mt-0.5">{wizardTitle || 'Untitled Project Template'}</h4>
                        <p className="text-xs text-[#777777] font-normal leading-relaxed mt-1">{newTemplateDesc || 'Configure basic descriptive instructions in the left configuration panel.'}</p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-3.5 bg-zinc-50 rounded-lg border border-zinc-200">
                          <span className="text-[8px] font-bold text-neutral-400 uppercase tracking-widest block">Access Scope</span>
                          <span className="font-semibold text-zinc-700 capitalize text-xs mt-1 block">{wizardScope} Team Scope</span>
                        </div>
                        <div className="p-3.5 bg-zinc-50 rounded-lg border border-zinc-200">
                          <span className="text-[8px] font-bold text-neutral-400 uppercase tracking-widest block">Preset Roles</span>
                          <div className="flex flex-wrap gap-1 mt-1.5">
                            {projectRoles.map(r => (
                              <span key={r} className="px-2 py-0.5 rounded bg-white border border-[#e2e2e2] text-[8px] font-bold text-zinc-500 uppercase tracking-wider">{r}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {wizardActiveTab === 'List' && (
                    <div className="bg-white rounded-xl border border-[#e2e2e2] shadow-sm max-w-3xl mx-auto overflow-hidden text-left">
                      <table className="w-full border-collapse font-medium text-[#1a1c1c]">
                        <thead>
                          <tr className="bg-[#f9f9f9] border-b border-[#e2e2e2] text-[#777777] uppercase tracking-widest text-[8px] font-bold">
                            <th className="py-2.5 px-4">Task Name</th>
                            <th className="py-2.5 px-3">Assignee</th>
                            <th className="py-2.5 px-3">Due Date</th>
                            <th className="py-2.5 px-3 text-right">Priority</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#e2e2e2]/60 text-xs">
                          <tr>
                            <td className="py-2.5 px-4 font-bold">Draft visual styles layout checklist</td>
                            <td className="py-2.5 px-3 text-zinc-500 font-semibold">Guest User</td>
                            <td className="py-2.5 px-3 text-zinc-400">June 10</td>
                            <td className="py-2.5 px-3 text-right"><span className="px-1.5 py-0.5 rounded bg-red-50 text-red-800 border border-red-200 text-[8px] font-bold uppercase tracking-wider">High</span></td>
                          </tr>
                          <tr>
                            <td className="py-2.5 px-4 font-bold">Establish QA pipeline workspace</td>
                            <td className="py-2.5 px-3 text-zinc-500 font-semibold">Tech Lead</td>
                            <td className="py-2.5 px-3 text-zinc-400">June 15</td>
                            <td className="py-2.5 px-3 text-right"><span className="px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 text-[8px] font-bold uppercase tracking-wider">Medium</span></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  )}

                  {wizardActiveTab === 'Board' && (
                    <div className="flex gap-4 min-h-full items-start">
                      {(newTemplateSource === 'scrum' 
                        ? ['Sprint Backlog', 'Dev Pipeline', 'QA Phase', 'Done'] 
                        : newTemplateSource === 'marketing' 
                        ? ['Planning', 'Design Room', 'Live Stream', 'Complete'] 
                        : ['To Do', 'In Progress', 'Done']
                      ).map(col => (
                        <div key={col} className="w-60 bg-white/80 rounded-xl border border-[#e2e2e2] p-3 text-left space-y-2 flex-shrink-0 shadow-sm">
                          <span className="font-bold text-xs text-[#1a1c1c] block border-b border-[#e2e2e2] pb-1.5">{col}</span>
                          <div className="py-8 text-center text-zinc-400 italic text-[10px]">
                            Cards appear here
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {wizardActiveTab === 'Timeline' && (
                    <div className="bg-white rounded-xl border border-[#e2e2e2] p-8 text-center shadow-sm max-w-xl mx-auto flex flex-col items-center gap-3">
                      <Layout className="h-6 w-6 text-zinc-300" />
                      <h4 className="font-bold text-[#1a1c1c]">Gantt Timeline Chart</h4>
                      <p className="text-[10px] text-[#777777] max-w-sm">Simulated timeline bar plots will update dynamically based on dates defined in list entries.</p>
                    </div>
                  )}

                  {wizardActiveTab === 'Calendar' && (
                    <div className="bg-white rounded-xl border border-[#e2e2e2] p-8 text-center shadow-sm max-w-xl mx-auto flex flex-col items-center gap-3">
                      <Calendar className="h-6 w-6 text-zinc-300" />
                      <h4 className="font-bold text-[#1a1c1c]">Calendar Grid Planner</h4>
                      <p className="text-[10px] text-[#777777] max-w-sm">A 30-day monthly grid that renders project cards based on due dates.</p>
                    </div>
                  )}

                  {wizardActiveTab === 'Workflow' && (
                    <div className="bg-white rounded-xl border border-[#e2e2e2] p-8 text-center shadow-sm max-w-xl mx-auto flex flex-col items-center gap-3">
                      <GitMerge className="h-6 w-6 text-zinc-300" />
                      <h4 className="font-bold text-[#1a1c1c]">Workflow Pipelines Diagram</h4>
                      <p className="text-[10px] text-[#777777] max-w-sm">Auto-generate rules nodes, intake form submissions arrows, and status updates checklists.</p>
                    </div>
                  )}
                </div>

              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. Create Status Template Modal */}
      {isCreateStatusModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in font-sans">
          <div className="bg-white w-full max-w-lg rounded-xl border border-[#e2e2e2] shadow-2xl flex flex-col overflow-hidden max-h-[90vh] animate-scale-in">
            <div className="px-6 py-4 border-b border-[#e2e2e2] bg-[#f9f9f9] flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-[#1a1c1c] uppercase tracking-wider">Create Status Report Template</h3>
                <p className="text-[10px] text-[#777777] font-semibold uppercase mt-0.5">Define weekly / monthly reporting layouts</p>
              </div>
              <button onClick={() => setIsCreateStatusModalOpen(false)} className="p-1 hover:bg-[#e2e2e2] rounded-lg text-[#777777]"><X className="h-4 w-4" /></button>
            </div>

            <form onSubmit={handleCreateStatusTemplate} className="flex-1 overflow-y-auto p-6 space-y-5 text-xs text-left font-sans">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-[#555] uppercase tracking-wider">Report Template Name</label>
                <input type="text" required value={newStatusName} onChange={(e) => setNewStatusName(e.target.value)} placeholder="e.g. Monthly Executive Briefing" className="w-full bg-[#f9f9f9] border border-[#e2e2e2] rounded-lg px-3 py-2.5 text-xs font-medium focus:outline-none text-[#1a1c1c]" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-[#555] uppercase tracking-wider">Description (Optional)</label>
                <textarea value={newStatusDesc} onChange={(e) => setNewStatusDesc(e.target.value)} placeholder="Summarize targets, frequency or auditee squad channels..." rows="3" className="w-full bg-[#f9f9f9] border border-[#e2e2e2] rounded-lg px-3 py-2 text-xs font-normal focus:outline-none text-[#1a1c1c] resize-none" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-[#555] uppercase tracking-wider">Report scope target</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: 'Project', label: 'Individual Project', desc: 'Summarizes single boards', icon: Kanban },
                    { id: 'Portfolio', label: 'Department Portfolio', desc: 'Summarizes multiple projects', icon: FileSpreadsheet }
                  ].map(tgt => {
                    const Icon = tgt.icon;
                    return (
                      <button key={tgt.id} type="button" onClick={() => setNewStatusType(tgt.id)} className={`p-3 rounded-lg border text-left flex flex-col gap-1 transition-all ${
                        newStatusType === tgt.id ? 'bg-zinc-100 border-black text-[#1a1c1c] font-bold' : 'bg-[#f9f9f9] border-[#e2e2e2] text-[#777777]'
                      }`}>
                        <Icon className="h-4 w-4" />
                        <span className="text-xs mt-1 block">{tgt.label}</span>
                        <span className="text-[9px] text-zinc-400 font-normal block leading-normal">{tgt.desc}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="flex flex-col gap-1.5 pt-2">
                <label className="text-[10px] font-bold text-[#555] uppercase tracking-wider">Default Sharing Settings</label>
                <select value={newStatusSharing} onChange={(e) => setNewStatusSharing(e.target.value)} className="w-full bg-[#f9f9f9] border border-[#e2e2e2] rounded-lg px-3 py-2 text-xs font-bold text-[#1a1c1c] outline-none">
                  <option value="Public in organization">Public in organization (Anyone can read & write)</option>
                  <option value="Shared with Managers">Shared with Managers (Only admins & squad leads)</option>
                  <option value="Private report channel">Private report channel (Only creators)</option>
                </select>
              </div>
            </form>

            <div className="px-6 py-4 border-t border-[#e2e2e2] bg-[#f9f9f9] flex items-center justify-end gap-3 flex-shrink-0">
              <button type="button" onClick={() => setIsCreateStatusModalOpen(false)} className="px-4 py-2 border border-[#e2e2e2] rounded-lg text-xs font-semibold text-[#777777] hover:bg-[#eaeaea]">Cancel</button>
              <button type="submit" onClick={handleCreateStatusTemplate} disabled={!newStatusName.trim()} className="px-4 py-2 bg-black hover:bg-neutral-800 text-white text-xs font-bold uppercase rounded-lg shadow flex items-center gap-1">
                <span>Create & Configure</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. Global Create Automation Rule Pop-up Modal */}
      {isCreateRuleOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in font-sans">
          <div className="bg-white w-full max-w-2xl rounded-xl border border-[#e2e2e2] shadow-2xl flex flex-col overflow-hidden max-h-[90vh] animate-scale-in text-xs">
            <div className="px-6 py-4 border-b border-[#e2e2e2] bg-[#f9f9f9] flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-[#1a1c1c] uppercase tracking-wider">Create Custom Automation Rule</h3>
                <p className="text-[10px] text-[#777777] font-semibold uppercase mt-0.5">Automate workspace processes to reduce squad manual labor</p>
              </div>
              <button onClick={() => setIsCreateRuleOpen(false)} className="p-1 hover:bg-[#e2e2e2] rounded-lg text-[#777777]"><X className="h-4 w-4" /></button>
            </div>

            <form onSubmit={handleCreateRule} className="flex-1 overflow-y-auto p-6 space-y-6 flex flex-col md:flex-row gap-6 items-stretch">
              <div className="flex-1 space-y-5 text-left">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="h-5 w-5 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold text-[10px]">1</span>
                    <span className="text-[11px] font-bold text-[#1a1c1c] uppercase tracking-wider">When this event happens (Trigger)</span>
                  </div>
                  <div className="space-y-3 pl-7">
                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] font-bold text-[#777777] uppercase">Event Trigger Type</label>
                      <select value={newRuleTriggerType} onChange={(e) => setNewRuleTriggerType(e.target.value)} className="w-full bg-[#f9f9f9] border border-[#e2e2e2] rounded-lg px-2.5 py-2 font-bold text-[#1a1c1c] outline-none">
                        <option value="stage-change">Task Stage column changes</option>
                        <option value="priority-change">Task Priority field changes</option>
                        <option value="assignee-change">Task Assignee changes</option>
                        <option value="due-approaching">Due date calendar approaching</option>
                      </select>
                    </div>
                    {newRuleTriggerType === 'stage-change' && (
                      <div className="flex flex-col gap-1">
                        <label className="text-[9px] font-bold text-[#777777] uppercase">Monitor Stage Value</label>
                        <select value={newRuleTriggerVal} onChange={(e) => setNewRuleTriggerVal(e.target.value)} className="w-full bg-white border border-[#e2e2e2] rounded-lg px-2.5 py-1.5 font-semibold outline-none">
                          <option value="To Do">To Do</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Review">Review</option>
                          <option value="Complete">Complete</option>
                        </select>
                      </div>
                    )}
                    {newRuleTriggerType === 'priority-change' && (
                      <div className="flex flex-col gap-1">
                        <label className="text-[9px] font-bold text-[#777777] uppercase">Monitor Priority Value</label>
                        <select value={newRuleTriggerVal} onChange={(e) => setNewRuleTriggerVal(e.target.value)} className="w-full bg-white border border-[#e2e2e2] rounded-lg px-2.5 py-1.5 font-semibold outline-none">
                          <option value="Low">Low</option>
                          <option value="Medium">Medium</option>
                          <option value="High">High</option>
                        </select>
                      </div>
                    )}
                    {newRuleTriggerType === 'due-approaching' && (
                      <div className="flex flex-col gap-1">
                        <label className="text-[9px] font-bold text-[#777777] uppercase">Timeframe Warning</label>
                        <select value={newRuleTriggerVal} onChange={(e) => setNewRuleTriggerVal(e.target.value)} className="w-full bg-white border border-[#e2e2e2] rounded-lg px-2.5 py-1.5 font-semibold outline-none">
                          <option value="1 day before">1 day before deadline</option>
                          <option value="3 days before">3 days before deadline</option>
                          <option value="1 week before">1 week before deadline</option>
                        </select>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-3 border-t border-[#e2e2e2] pt-4">
                  <div className="flex items-center gap-2">
                    <span className="h-5 w-5 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-[10px]">2</span>
                    <span className="text-[11px] font-bold text-[#1a1c1c] uppercase tracking-wider">Execute this action (Then)</span>
                  </div>
                  <div className="space-y-3 pl-7">
                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] font-bold text-[#777777] uppercase">Automated Action Type</label>
                      <select value={newRuleActionType} onChange={(e) => setNewRuleActionType(e.target.value)} className="w-full bg-[#f9f9f9] border border-[#e2e2e2] rounded-lg px-2.5 py-2 font-bold text-[#1a1c1c] outline-none">
                        <option value="move-stage">Move Task stage column</option>
                        <option value="assign-member">Assign task card to member</option>
                        <option value="set-priority">Set priority level tag</option>
                        <option value="send-email">Send notification alert email</option>
                      </select>
                    </div>
                    {newRuleActionType === 'move-stage' && (
                      <div className="flex flex-col gap-1">
                        <label className="text-[9px] font-bold text-[#777777] uppercase">Target Stage Column</label>
                        <select value={newRuleActionVal} onChange={(e) => setNewRuleActionVal(e.target.value)} className="w-full bg-white border border-[#e2e2e2] rounded-lg px-2.5 py-1.5 font-semibold outline-none">
                          <option value="To Do">To Do</option>
                          <option value="In Progress">In Progress</option>
                          <option value="QA / Review">QA / Review</option>
                          <option value="Complete">Complete</option>
                        </select>
                      </div>
                    )}
                    {newRuleActionType === 'assign-member' && (
                      <div className="flex flex-col gap-1">
                        <label className="text-[9px] font-bold text-[#777777] uppercase">Designated squad assignee</label>
                        <select value={newRuleActionVal} onChange={(e) => setNewRuleActionVal(e.target.value)} className="w-full bg-white border border-[#e2e2e2] rounded-lg px-2.5 py-1.5 font-semibold outline-none">
                          <option value="tech-lead@crewflow.com">Tech Lead (tech-lead@crewflow.com)</option>
                          <option value="design-lead@crewflow.com">Design Lead (design-lead@crewflow.com)</option>
                          <option value="member@crewflow.com">Member squad (member@crewflow.com)</option>
                          <option value="admin@crewflow.com">Workspace Admin (admin@crewflow.com)</option>
                        </select>
                      </div>
                    )}
                    {newRuleActionType === 'set-priority' && (
                      <div className="flex flex-col gap-1">
                        <label className="text-[9px] font-bold text-[#777777] uppercase">Target Priority Tag</label>
                        <select value={newRuleActionVal} onChange={(e) => setNewRuleActionVal(e.target.value)} className="w-full bg-white border border-[#e2e2e2] rounded-lg px-2.5 py-1.5 font-semibold outline-none">
                          <option value="Low">Low</option>
                          <option value="Medium">Medium</option>
                          <option value="High">High</option>
                        </select>
                      </div>
                    )}
                    {newRuleActionType === 'send-email' && (
                      <div className="flex flex-col gap-1">
                        <label className="text-[9px] font-bold text-[#777777] uppercase">Email alert subject</label>
                        <input type="text" required value={newRuleActionVal} onChange={(e) => setNewRuleActionVal(e.target.value)} placeholder="e.g. Critical Bug Warning Notice" className="w-full bg-white border border-[#e2e2e2] rounded-lg px-2.5 py-1.5 font-semibold focus:outline-none" />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="w-full md:w-72 bg-[#f9f9f9] border border-[#e2e2e2] rounded-xl p-5 flex flex-col justify-between flex-shrink-0">
                <div className="space-y-4">
                  <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest block border-b border-[#e2e2e2] pb-2">Automation Preview</span>
                  <div className="p-3 bg-white rounded-lg border border-[#e2e2e2] space-y-1">
                    <span className="text-[9px] font-bold text-purple-600 uppercase tracking-wider block">WHEN (Trigger event)</span>
                    <span className="font-bold text-[#1a1c1c] block leading-tight text-xs">
                      {newRuleTriggerType === 'stage-change' && `Stage changes to "${newRuleTriggerVal}"`}
                      {newRuleTriggerType === 'priority-change' && `Priority changes to "${newRuleTriggerVal}"`}
                      {newRuleTriggerType === 'assignee-change' && `Assignee updates`}
                      {newRuleTriggerType === 'due-approaching' && `Due date is in ${newRuleTriggerVal}`}
                    </span>
                  </div>
                  <div className="flex justify-center"><ArrowDown className="h-4 w-4 text-[#8a8b8c]" /></div>
                  <div className="p-3 bg-white rounded-lg border border-[#e2e2e2] space-y-1">
                    <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-wider block">THEN (Automated Action)</span>
                    <span className="font-bold text-[#1a1c1c] block leading-tight text-xs">
                      {newRuleActionType === 'move-stage' && `Move card to Stage "${newRuleActionVal}"`}
                      {newRuleActionType === 'assign-member' && `Assign member to ${newRuleActionVal}`}
                      {newRuleActionType === 'set-priority' && `Set card priority to ${newRuleActionVal}`}
                      {newRuleActionType === 'send-email' && `Send email alert: "${newRuleActionVal}"`}
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#e2e2e2] space-y-2 mt-4 md:mt-0 text-left">
                  <label className="text-[9px] font-bold text-[#777777] uppercase">Custom Rule Label</label>
                  <textarea value={newRuleName} onChange={(e) => setNewRuleName(e.target.value)} rows="3" className="w-full bg-white border border-[#e2e2e2] p-2.5 rounded-lg text-[10px] leading-relaxed font-bold text-[#1a1c1c] resize-none focus:outline-none" />
                </div>
              </div>
            </form>

            <div className="px-6 py-4 border-t border-[#e2e2e2] bg-[#f9f9f9] flex items-center justify-end gap-3 flex-shrink-0">
              <button type="button" onClick={() => setIsCreateRuleOpen(false)} className="px-4 py-2 border border-[#e2e2e2] rounded-lg text-xs font-semibold text-[#777777] hover:bg-[#eaeaea]">Cancel</button>
              <button type="button" onClick={handleCreateRule} disabled={!newRuleName.trim()} className="px-4 py-2 bg-black hover:bg-neutral-800 text-white text-xs font-bold tracking-wider uppercase rounded-lg shadow flex items-center gap-1.5"><Zap className="h-4 w-4" /><span>Establish rule</span></button>
            </div>
          </div>
        </div>
      )}

      {/* 7. Global Create Intake Form Pop-up Modal */}
      {isCreateFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in font-sans">
          <div className="bg-white w-full max-w-lg rounded-xl border border-[#e2e2e2] shadow-2xl flex flex-col overflow-hidden max-h-[90vh] animate-scale-in">
            <div className="px-6 py-4 border-b border-[#e2e2e2] bg-[#f9f9f9] flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-[#1a1c1c] uppercase tracking-wider">Create Task Intake Form</h3>
                <p className="text-[10px] text-[#777777] font-semibold uppercase mt-0.5">Collect structured client/internal task details</p>
              </div>
              <button onClick={() => setIsCreateFormOpen(false)} className="p-1 hover:bg-[#e2e2e2] rounded-lg text-[#777777]"><X className="h-4 w-4" /></button>
            </div>

            <form onSubmit={handleCreateForm} className="flex-1 overflow-y-auto p-6 space-y-5 text-xs text-left">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-[#555] uppercase tracking-wider">Intake Form Name</label>
                <input
                  type="text"
                  required
                  value={newFormName}
                  onChange={(e) => setNewFormName(e.target.value)}
                  placeholder="e.g. Graphics Request Brief"
                  className="w-full bg-[#f9f9f9] border border-[#e2e2e2] rounded-lg px-3 py-2.5 text-xs font-medium placeholder-[#8a8b8c] focus:outline-none focus:bg-white text-[#1a1c1c]"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-[#555] uppercase tracking-wider">Description (Optional)</label>
                <textarea
                  value={newFormDesc}
                  onChange={(e) => setNewFormDesc(e.target.value)}
                  placeholder="Tell clients what specifications or drafts are required..."
                  rows="3"
                  className="w-full bg-[#f9f9f9] border border-[#e2e2e2] rounded-lg px-3 py-2 text-xs font-normal focus:outline-none text-[#1a1c1c] resize-none leading-relaxed"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-[#555] uppercase tracking-wider">Map submissions to Project Board</label>
                <select
                  value={newFormProject}
                  onChange={(e) => setNewFormProject(e.target.value)}
                  className="w-full bg-[#f9f9f9] border border-[#e2e2e2] rounded-lg px-3 py-2.5 text-xs font-bold text-[#1a1c1c] outline-none"
                >
                  {projects.map(p => (
                    <option key={p._id} value={p.name}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-[#555] uppercase tracking-wider">Link Access Scope</label>
                <select
                  value={newFormScope}
                  onChange={(e) => setNewFormScope(e.target.value)}
                  className="w-full bg-[#f9f9f9] border border-[#e2e2e2] rounded-lg px-3 py-2.5 text-xs font-bold text-[#1a1c1c] outline-none"
                >
                  <option value="Public via share link">Public via share link (Anyone with URL)</option>
                  <option value="Internal Organization Only">Internal Organization Only (Signed-in members)</option>
                </select>
              </div>

            </form>

            <div className="px-6 py-4 border-t border-[#e2e2e2] bg-[#f9f9f9] flex items-center justify-end gap-3 flex-shrink-0">
              <button
                type="button"
                onClick={() => setIsCreateFormOpen(false)}
                className="px-4 py-2 border border-[#e2e2e2] rounded-lg text-xs font-semibold text-[#777777] hover:bg-[#eaeaea]"
              >
                Cancel
              </button>
              <button
                type="submit"
                onClick={handleCreateForm}
                disabled={!newFormName.trim()}
                className="px-4 py-2 bg-black hover:bg-neutral-800 disabled:opacity-50 text-white text-xs font-bold uppercase rounded-lg shadow flex items-center gap-1"
              >
                <span>Create & Designer</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 8. Submissions Database Ledger Modal */}
      {selectedFormSubmissions && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/40 backdrop-blur-xs animate-fade-in font-sans">
          <div className="bg-white w-full max-w-5xl rounded-xl border border-[#e2e2e2] shadow-2xl flex flex-row overflow-hidden h-[85vh] animate-scale-in text-xs">
            
            {/* LEFT SIDE: Ledger Grid */}
            <div className="flex-1 flex flex-col min-w-0 bg-[#fafafa]">
              {/* Header */}
              <div className="px-6 py-4 border-b border-[#e2e2e2] bg-white flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-[#1a1c1c] uppercase tracking-wider flex items-center gap-2">
                    <ClipboardList className="h-4.5 w-4.5 text-zinc-500" />
                    <span>Intake Database: {selectedFormSubmissions.name}</span>
                  </h3>
                  <p className="text-[10px] text-[#777777] font-semibold uppercase mt-0.5">
                    Feeds Board: <span className="text-[#1a1c1c] font-bold">{selectedFormSubmissions.targetProject}</span>
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => {
                      if (window.confirm("Permanently wipe all simulated database records for this form?")) {
                        const updatedForms = forms.map(f => f.id === selectedFormSubmissions.id ? { ...f, submissionsCount: 0, submissions: [] } : f);
                        setForms(updatedForms);
                        setSelectedFormSubmissions(updatedForms.find(f => f.id === selectedFormSubmissions.id));
                        setRulesToast("Form submissions ledger wiped successfully.");
                        setTimeout(() => setRulesToast(""), 3000);
                      }
                    }}
                    className="px-2.5 py-1.5 border border-[#e2e2e2] hover:bg-red-50 text-zinc-500 hover:text-red-700 font-semibold rounded-lg transition-colors flex items-center gap-1"
                    title="Clear entries database"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Clear database</span>
                  </button>
                  <button onClick={() => { setSelectedFormSubmissions(null); setActiveFormSubmissionDetail(null); }} className="p-1 hover:bg-[#e2e2e2] rounded-lg text-[#777777]"><X className="h-4 w-4" /></button>
                </div>
              </div>

              {/* Entries list table */}
              <div className="flex-1 overflow-y-auto p-6">
                {!selectedFormSubmissions.submissions || selectedFormSubmissions.submissions.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center gap-2 text-zinc-400 py-12">
                    <Inbox className="h-8 w-8 text-[#c5c6c7]" />
                    <span className="font-bold uppercase tracking-wider text-[10px]">Database ledger is empty</span>
                    <span className="text-[10px] text-zinc-400">Submit a simulated intake entry inside the visual designer canvas.</span>
                  </div>
                ) : (
                  <div className="bg-white rounded-xl border border-[#e2e2e2] overflow-hidden shadow-sm">
                    <table className="w-full border-collapse text-left text-xs font-semibold">
                      <thead>
                        <tr className="bg-[#f9f9f9] border-b border-[#e2e2e2] text-[#777777] uppercase tracking-wider text-[9px] font-bold">
                          <th className="py-3 px-4 w-4/12">Intake brief title</th>
                          <th className="py-3 px-4 w-3/12">Submitter</th>
                          <th className="py-3 px-4 w-2/12 text-center">Priority</th>
                          <th className="py-3 px-4 w-2/12 text-center">Submission Date</th>
                          <th className="py-3 px-4 w-1/12 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#e2e2e2]/60 text-zinc-700">
                        {selectedFormSubmissions.submissions.map(sub => (
                          <tr 
                            key={sub.id} 
                            onClick={() => setActiveFormSubmissionDetail(sub)}
                            className={`hover:bg-[#f3f4f6]/50 cursor-pointer transition-colors ${activeFormSubmissionDetail?.id === sub.id ? 'bg-indigo-50/40' : ''}`}
                          >
                            <td className="py-3 px-4 font-bold text-[#1a1c1c] max-w-[200px] truncate">{sub.title}</td>
                            <td className="py-3 px-4 text-[#777777] font-medium max-w-[120px] truncate">{sub.submitter}</td>
                            <td className="py-3 px-4 text-center">
                              <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                                sub.answers.priority === 'High' ? 'bg-red-50 border border-red-200 text-red-700' : sub.answers.priority === 'Medium' ? 'bg-amber-50 border border-amber-200 text-amber-700' : 'bg-green-50 border border-green-200 text-green-700'
                              }`}>
                                {sub.answers.priority || 'Medium'}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-center font-medium text-zinc-400">
                              {new Date(sub.submittedAt).toLocaleDateString()}
                            </td>
                            <td className="py-3 px-4 text-right">
                              <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); setActiveFormSubmissionDetail(sub); }}
                                className="px-2 py-1 bg-white border border-[#e2e2e2] text-zinc-700 hover:text-black hover:bg-neutral-50 rounded font-bold text-[10px] tracking-wide uppercase transition-colors"
                              >
                                View brief
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT SIDEBAR: Brief Detail Inspector */}
            <aside className="w-80 bg-white border-l border-[#e2e2e2] flex flex-col h-full overflow-hidden text-left">
              {activeFormSubmissionDetail ? (
                <div className="flex-1 flex flex-col min-h-0">
                  <div className="px-5 py-4 border-b border-[#e2e2e2] bg-[#f9f9f9] flex items-center justify-between">
                    <span className="text-[10px] text-indigo-600 font-bold uppercase tracking-widest flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse" />
                      Client Request Brief
                    </span>
                    <button 
                      onClick={() => setActiveFormSubmissionDetail(null)} 
                      className="p-0.5 hover:bg-[#e2e2e2] rounded text-zinc-400 hover:text-black"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <div className="flex-1 overflow-y-auto p-5 space-y-4">
                    {/* Title & Desc */}
                    <div>
                      <h4 className="text-sm font-bold text-[#1a1c1c] tracking-tight">{activeFormSubmissionDetail.title}</h4>
                      <p className="text-[10px] text-[#777777] font-medium mt-0.5">Submitted: {new Date(activeFormSubmissionDetail.submittedAt).toLocaleString()}</p>
                    </div>

                    <div className="h-px bg-[#e2e2e2]/60" />

                    <div>
                      <span className="text-[9px] font-bold text-[#777777] uppercase tracking-wider block mb-1">Brief Description:</span>
                      <p className="p-3 bg-[#fafafa] border border-[#e2e2e2] rounded-lg text-zinc-600 leading-relaxed font-normal whitespace-pre-wrap">
                        {activeFormSubmissionDetail.description || 'No additional description provided in the intake sheet.'}
                      </p>
                    </div>

                    {/* Widgets Answers summary */}
                    <div className="space-y-3">
                      <span className="text-[9px] font-bold text-[#777777] uppercase tracking-wider block">Questionnaire fields answers:</span>
                      
                      {activeFormSubmissionDetail.answers['due-date'] && (
                        <div className="flex items-center justify-between p-2 border border-[#e2e2e2] rounded-lg bg-zinc-50">
                          <span className="font-semibold text-zinc-500 flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> Due Date</span>
                          <span className="font-bold text-[#1a1c1c]">{activeFormSubmissionDetail.answers['due-date']}</span>
                        </div>
                      )}

                      {activeFormSubmissionDetail.answers.priority && (
                        <div className="flex items-center justify-between p-2 border border-[#e2e2e2] rounded-lg bg-zinc-50">
                          <span className="font-semibold text-zinc-500 flex items-center gap-1"><Sliders className="h-3.5 w-3.5" /> Priority</span>
                          <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider ${
                            activeFormSubmissionDetail.answers.priority === 'High' ? 'bg-red-50 text-red-700' : activeFormSubmissionDetail.answers.priority === 'Medium' ? 'bg-amber-50 text-amber-700' : 'bg-green-50 text-green-700'
                          }`}>
                            {activeFormSubmissionDetail.answers.priority}
                          </span>
                        </div>
                      )}

                      {activeFormSubmissionDetail.answers.attachment && (
                        <div className="flex flex-col gap-1.5 p-2 border border-[#e2e2e2] rounded-lg bg-zinc-50">
                          <span className="font-semibold text-zinc-500 flex items-center gap-1"><Upload className="h-3.5 w-3.5" /> Attached Specs file</span>
                          <span className="font-bold text-indigo-700 text-[10px] break-all truncate">{activeFormSubmissionDetail.answers.attachment}</span>
                        </div>
                      )}

                      {activeFormSubmissionDetail.answers['custom-repro-steps'] && (
                        <div className="flex flex-col gap-1.5 p-3 border border-[#e2e2e2] rounded-lg bg-zinc-50">
                          <span className="font-semibold text-zinc-500 block">Steps to Reproduce:</span>
                          <span className="text-zinc-600 block leading-relaxed font-normal whitespace-pre-wrap">{activeFormSubmissionDetail.answers['custom-repro-steps']}</span>
                        </div>
                      )}

                      {activeFormSubmissionDetail.answers['custom-text'] && (
                        <div className="flex flex-col gap-1.5 p-3 border border-[#e2e2e2] rounded-lg bg-zinc-50">
                          <span className="font-semibold text-zinc-500 block">Custom question text answer:</span>
                          <span className="font-bold text-[#1a1c1c] block">{activeFormSubmissionDetail.answers['custom-text']}</span>
                        </div>
                      )}

                      {activeFormSubmissionDetail.answers['custom-number'] && (
                        <div className="flex flex-col gap-1.5 p-3 border border-[#e2e2e2] rounded-lg bg-zinc-50">
                          <span className="font-semibold text-zinc-500 block">Custom numeric answer:</span>
                          <span className="font-bold text-[#1a1c1c] block">{activeFormSubmissionDetail.answers['custom-number']}</span>
                        </div>
                      )}
                    </div>

                    <div className="h-px bg-[#e2e2e2]/60 mt-4" />
                    
                    <div className="text-[10px] text-zinc-400 italic">
                      This brief was simulated through external public uploader and mapped automatically to squad leaders.
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center p-8 text-center text-zinc-400 gap-2">
                  <Eye className="h-8 w-8 text-[#c5c6c7] stroke-[1.5px]" />
                  <span className="font-bold uppercase tracking-wider text-[9px]">Select an intake entry row</span>
                  <span className="text-[10px] text-zinc-400 font-normal leading-normal">Click any row in the database ledger to inspect full file briefs and question outputs.</span>
                </div>
              )}
            </aside>

          </div>
        </div>
      )}

      {/* 9. Create / Edit Task Type Modal */}
      {isCreateTaskTypeOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in font-sans">
          <div className="bg-white w-full max-w-4xl rounded-xl border border-[#e2e2e2] shadow-2xl flex flex-col overflow-hidden max-h-[90vh] animate-scale-in text-xs">
            
            {/* Header */}
            <div className="px-6 py-4 border-b border-[#e2e2e2] bg-[#f9f9f9] flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-[#1a1c1c] uppercase tracking-wider">
                  {editingTaskTypeId ? 'Edit Task Type Classification' : 'Define Custom Task Type'}
                </h3>
                <p className="text-[10px] text-[#777777] font-semibold uppercase mt-0.5">
                  Establish a standard procedural framework for cards
                </p>
              </div>
              <button 
                type="button" 
                onClick={() => { setIsCreateTaskTypeOpen(false); setEditingTaskTypeId(null); }} 
                className="p-1 hover:bg-[#e2e2e2] rounded-lg text-[#777777]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Form & Preview Panel */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col md:flex-row gap-6 items-stretch">
              
              {/* Left Form controls */}
              <form onSubmit={handleSaveTaskType} className="flex-1 space-y-5 text-left">
                
                {/* Task Type Name */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-[#555] uppercase tracking-wider">Task Type Name</label>
                  <input
                    type="text"
                    required
                    value={newTaskTypeName}
                    onChange={(e) => setNewTaskTypeName(e.target.value)}
                    placeholder="e.g. Graphic Deliverable, QA Hotfix..."
                    className="w-full bg-[#f9f9f9] border border-[#e2e2e2] rounded-lg px-3 py-2.5 text-xs font-semibold focus:outline-none focus:bg-white text-[#1a1c1c]"
                  />
                </div>

                {/* Description */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-[#555] uppercase tracking-wider">Procedural Description</label>
                  <textarea
                    value={newTaskTypeDesc}
                    onChange={(e) => setNewTaskTypeDesc(e.target.value)}
                    placeholder="Provide usage rules, criteria for cards using this type, or operational standards..."
                    rows="3"
                    className="w-full bg-[#f9f9f9] border border-[#e2e2e2] rounded-lg px-3 py-2 text-xs font-normal focus:outline-none focus:bg-white text-[#1a1c1c] resize-none leading-relaxed"
                  />
                </div>

                {/* Color Swatch Picker */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-[#555] uppercase tracking-wider">Accent Swatch Color</label>
                  <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                    {[
                      { name: 'Sunset Amber', bg: 'hsl(37, 90%, 93%)', text: 'hsl(37, 90%, 38%)', display: 'bg-[#fef3c7] border-[#fcd34d]' },
                      { name: 'Soft Coral', bg: 'hsl(350, 80%, 93%)', text: 'hsl(350, 84%, 40%)', display: 'bg-[#fee2e2] border-[#fca5a5]' },
                      { name: 'Lavender Dusk', bg: 'hsl(262, 80%, 93%)', text: 'hsl(262, 80%, 40%)', display: 'bg-[#ede9fe] border-[#c084fc]' },
                      { name: 'Mint Leaf', bg: 'hsl(142, 70%, 93%)', text: 'hsl(142, 76%, 36%)', display: 'bg-[#d1fae5] border-[#6ee7b7]' },
                      { name: 'Royal Ice', bg: 'hsl(200, 80%, 93%)', text: 'hsl(200, 80%, 40%)', display: 'bg-[#dbeafe] border-[#93c5fd]' },
                      { name: 'Indigo Deep', bg: 'hsl(240, 80%, 93%)', text: 'hsl(240, 80%, 40%)', display: 'bg-[#e0e7ff] border-[#a5b4fc]' },
                      { name: 'Soft Rose', bg: 'hsl(320, 80%, 93%)', text: 'hsl(320, 80%, 40%)', display: 'bg-[#fce7f3] border-[#f9a8d4]' },
                      { name: 'Industrial Steel', bg: 'hsl(210, 20%, 90%)', text: 'hsl(210, 20%, 35%)', display: 'bg-[#f3f4f6] border-[#d1d5db]' }
                    ].map(sw => {
                      const isSelected = newTaskTypeColor === sw.bg;
                      return (
                        <button
                          key={sw.name}
                          type="button"
                          onClick={() => {
                            setNewTaskTypeColor(sw.bg);
                            setNewTaskTypeTextColor(sw.text);
                          }}
                          className={`h-7 rounded-lg border ${sw.display} flex items-center justify-center transition-all ${
                            isSelected ? 'ring-2 ring-black scale-105 shadow-sm' : 'hover:scale-105 opacity-80 hover:opacity-100'
                          }`}
                          title={sw.name}
                        >
                          {isSelected && <span className="h-1.5 w-1.5 rounded-full bg-black/50" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Icon Grid Picker */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-[#555] uppercase tracking-wider">Designated Card Icon</label>
                  <div className="grid grid-cols-6 gap-2">
                    {(() => {
                      const ICON_MAP = {
                        Sparkles, CheckSquare, Layers, Sliders, Calendar, AlignLeft, Hash, Bug, MessageSquare, ClipboardList, GitMerge, FileText
                      };
                      return Object.keys(ICON_MAP).map(key => {
                        const Icon = ICON_MAP[key];
                        const isSelected = newTaskTypeIcon === key;
                        return (
                          <button
                            key={key}
                            type="button"
                            onClick={() => setNewTaskTypeIcon(key)}
                            className={`p-2.5 rounded-lg border flex items-center justify-center transition-all ${
                              isSelected 
                                ? 'bg-black border-black text-white scale-105 shadow-xs' 
                                : 'bg-[#f9f9f9] border-[#e2e2e2] text-[#777777] hover:bg-neutral-100 hover:text-black'
                            }`}
                            title={key.replace(/([A-Z])/g, ' $1').trim()}
                          >
                            <Icon className="h-4 w-4 stroke-[2px]" />
                          </button>
                        );
                      });
                    })()}
                  </div>
                </div>

                {/* Preset fields checklist */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-[#555] uppercase tracking-wider">Preset Task Parameters (Fields)</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-[#f9f9f9] p-4 rounded-xl border border-[#e2e2e2]">
                    
                    {/* Default Required Fields */}
                    <div className="flex items-center gap-2 p-2 bg-white rounded-lg border border-[#e2e2e2]/60 opacity-60 cursor-not-allowed">
                      <input type="checkbox" checked disabled className="accent-black h-3.5 w-3.5" />
                      <div className="flex flex-col text-left">
                        <span className="font-bold text-black text-[11px]">Task Title</span>
                        <span className="text-[9px] text-[#777777]">Base structural requirement</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 p-2 bg-white rounded-lg border border-[#e2e2e2]/60 opacity-60 cursor-not-allowed">
                      <input type="checkbox" checked disabled className="accent-black h-3.5 w-3.5" />
                      <div className="flex flex-col text-left">
                        <span className="font-bold text-black text-[11px]">Description</span>
                        <span className="text-[9px] text-[#777777]">Procedural task briefs</span>
                      </div>
                    </div>

                    {/* Interactive Optional Fields */}
                    {[
                      { id: 'due-date', label: 'Due Date Calendar', desc: 'Deadlines & timelines', icon: Calendar },
                      { id: 'priority', label: 'Urgency Priority Flags', desc: 'High/Med/Low labels', icon: Sliders },
                      { id: 'attachment', label: 'Spec Attachments', desc: 'File uploads & mockups', icon: Upload },
                      { id: 'custom-repro-steps', label: 'Reproduction Logs', desc: 'Bug step-by-step fields', icon: Bug },
                      { id: 'custom-text', label: 'Additional Comments', desc: 'Freeform text inputs', icon: MessageSquare }
                    ].map(fld => {
                      const isChecked = newTaskTypeFields.includes(fld.id);
                      const Icon = fld.icon;
                      return (
                        <div 
                          key={fld.id} 
                          onClick={() => {
                            if (newTaskTypeFields.includes(fld.id)) {
                              setNewTaskTypeFields(prev => prev.filter(f => f !== fld.id));
                            } else {
                              setNewTaskTypeFields(prev => [...prev, fld.id]);
                            }
                          }}
                          className={`flex items-center gap-2.5 p-2 bg-white rounded-lg border cursor-pointer hover:border-black/50 transition-all select-none ${
                            isChecked ? 'border-zinc-400 bg-zinc-50/50 shadow-2xs' : 'border-[#e2e2e2]'
                          }`}
                        >
                          <input 
                            type="checkbox" 
                            checked={isChecked} 
                            onChange={() => {}} 
                            className="accent-black h-3.5 w-3.5 pointer-events-none" 
                          />
                          <div className="flex-1 flex flex-col text-left">
                            <span className="font-bold text-black text-[11px] flex items-center gap-1">
                              <Icon className="h-3 w-3 text-zinc-400" />
                              {fld.label}
                            </span>
                            <span className="text-[9px] text-[#777777]">{fld.desc}</span>
                          </div>
                        </div>
                      );
                    })}

                  </div>
                </div>

                {/* Status Mapper Component */}
                <div className="flex flex-col gap-2 pt-2 border-t border-[#e2e2e2] text-left">
                  <label className="text-[10px] font-bold text-[#555] uppercase tracking-wider block">Status Mapper</label>
                  <span className="text-[9px] text-[#777777] font-semibold block leading-normal">
                    Create statuses - Define different states or stages for this work using the Active and Done categories
                  </span>
                  
                  <div className="space-y-4 mt-2">
                    {/* Active Statuses Container */}
                    <div className="p-3 bg-red-50/40 rounded-xl border border-red-100 space-y-2 text-left">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-bold text-red-800 uppercase tracking-widest">Active Stages</span>
                        <button 
                          type="button" 
                          onClick={() => {
                            const newId = `active-${Date.now()}`;
                            setActiveStatuses(prev => [...prev, { id: newId, label: 'New Active Stage', code: 'A', color: 'amber' }]);
                          }}
                          className="text-red-700 hover:text-red-900 font-bold uppercase text-[9px] flex items-center gap-0.5"
                        >
                          <Plus className="h-3 w-3" /> Add status option
                        </button>
                      </div>
                      
                      <div className="space-y-1.5 max-h-[140px] overflow-y-auto pr-1">
                        {activeStatuses.map((st, idx) => (
                          <div key={st.id} className="flex items-center gap-2 bg-white border border-red-200/80 p-2 rounded-lg shadow-2xs">
                            <div className="h-5 w-5 rounded-full bg-red-500 text-white flex items-center justify-center font-bold text-[8px] select-none" title="Active Swatch">
                              {st.code}
                            </div>
                            <input 
                              type="text" 
                              required 
                              value={st.label} 
                              onChange={(e) => {
                                const newLabel = e.target.value;
                                setActiveStatuses(prev => prev.map(item => item.id === st.id ? { ...item, label: newLabel, code: newLabel ? newLabel[0].toUpperCase() : '?' } : item));
                              }}
                              placeholder="Status label" 
                              className="flex-1 bg-transparent text-xs font-semibold text-[#1a1c1c] outline-none border-b border-transparent focus:border-neutral-300" 
                            />
                            {activeStatuses.length > 1 && (
                              <button 
                                type="button" 
                                onClick={() => setActiveStatuses(prev => prev.filter(item => item.id !== st.id))}
                                className="text-red-300 hover:text-red-700 p-0.5"
                              >
                                <X className="h-3.5 w-3.5" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Done Statuses Container */}
                    <div className="p-3 bg-emerald-50/40 rounded-xl border border-emerald-100 space-y-2 text-left">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-bold text-emerald-800 uppercase tracking-widest">Done Stages</span>
                        <button 
                          type="button" 
                          onClick={() => {
                            const newId = `done-${Date.now()}`;
                            setDoneStatuses(prev => [...prev, { id: newId, label: 'New Completed Stage', code: 'C', color: 'emerald' }]);
                          }}
                          className="text-emerald-700 hover:text-emerald-900 font-bold uppercase text-[9px] flex items-center gap-0.5"
                        >
                          <Plus className="h-3 w-3" /> Add status option
                        </button>
                      </div>

                      <div className="space-y-1.5 max-h-[140px] overflow-y-auto pr-1">
                        {doneStatuses.map((st, idx) => (
                          <div key={st.id} className="flex items-center gap-2 bg-white border border-emerald-200/80 p-2 rounded-lg shadow-2xs">
                            <div className="h-5 w-5 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-[8px] select-none" title="Completed Swatch">
                              {st.code}
                            </div>
                            <input 
                              type="text" 
                              required 
                              value={st.label} 
                              onChange={(e) => {
                                const newLabel = e.target.value;
                                setDoneStatuses(prev => prev.map(item => item.id === st.id ? { ...item, label: newLabel, code: newLabel ? newLabel[0].toUpperCase() : '?' } : item));
                              }}
                              placeholder="Status label" 
                              className="flex-1 bg-transparent text-xs font-semibold text-[#1a1c1c] outline-none border-b border-transparent focus:border-neutral-300" 
                            />
                            {doneStatuses.length > 1 && (
                              <button 
                                type="button" 
                                onClick={() => setDoneStatuses(prev => prev.filter(item => item.id !== st.id))}
                                className="text-emerald-300 hover:text-emerald-700 p-0.5"
                              >
                                <X className="h-3.5 w-3.5" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Active / Paused Status Toggle */}
                <div className="flex items-center justify-between p-3.5 bg-white border border-[#e2e2e2] rounded-xl shadow-xs">
                  <div className="flex flex-col text-left">
                    <span className="font-bold text-black text-xs">Task Type Active Status</span>
                    <span className="text-[10px] text-[#777777] mt-0.5 font-normal leading-normal">Checked displays this classification style as an option for card updates</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setNewTaskTypeActive(!newTaskTypeActive)}
                    className="focus:outline-none hover:scale-105 transition-transform"
                  >
                    {newTaskTypeActive ? (
                      <div className="flex items-center gap-1.5 text-emerald-600 font-bold">
                        <ToggleRight className="h-9 w-9 stroke-[1.5px]" />
                        <span className="text-[10px] uppercase">Active</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-zinc-400 font-bold">
                        <ToggleLeft className="h-9 w-9 stroke-[1.5px]" />
                        <span className="text-[10px] uppercase">Paused</span>
                      </div>
                    )}
                  </button>
                </div>

              </form>

              {/* Right Preview Panel */}
              <div className="w-full md:w-80 bg-[#f9f9f9] border border-[#e2e2e2] rounded-xl p-5 flex flex-col justify-between flex-shrink-0 font-sans">
                
                {/* Top preview details */}
                <div className="space-y-4 text-left">
                  <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest block border-b border-[#e2e2e2] pb-2">Live Board Preview</span>
                  
                  {/* Card mockup */}
                  <div className="bg-white rounded-xl border border-[#e2e2e2] p-4 shadow-sm space-y-3.5 relative overflow-hidden">
                    
                    {/* Top colored accent bar */}
                    <div 
                      style={{ backgroundColor: newTaskTypeColor, borderBottom: `1px solid ${newTaskTypeColor.replace('93%', '80%')}` }}
                      className="absolute top-0 left-0 right-0 h-1.5" 
                    />

                    {/* Card Header: Icon Accent Color + Status */}
                    <div className="flex items-center justify-between gap-3 pt-1">
                      <div 
                        style={{ backgroundColor: newTaskTypeColor, border: `1px solid ${newTaskTypeColor.replace('93%', '80%')}` }}
                        className="h-8 w-8 rounded-lg flex items-center justify-center"
                      >
                        {(() => {
                          const ICON_MAP = {
                            Sparkles, CheckSquare, Layers, Sliders, Calendar, AlignLeft, Hash, Bug, MessageSquare, ClipboardList, GitMerge, FileText
                          };
                          const SelectedIcon = ICON_MAP[newTaskTypeIcon] || HelpCircle;
                          return <SelectedIcon style={{ color: newTaskTypeTextColor }} className="h-4.5 w-4.5" />;
                        })()}
                      </div>

                      <div>
                        {newTaskTypeActive ? (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[8px] font-bold uppercase tracking-wider">Active</span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-zinc-50 text-zinc-400 border border-zinc-200 text-[8px] font-bold uppercase tracking-wider">Paused</span>
                        )}
                      </div>
                    </div>

                    {/* Name & Desc */}
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-[#1a1c1c] tracking-tight truncate">
                        {newTaskTypeName.trim() || 'Untitled Task Type'}
                      </h4>
                      <p className="text-[10px] text-[#777777] leading-relaxed font-normal min-h-[40px] line-clamp-3">
                        {newTaskTypeDesc.trim() || 'Provide procedural instructions in the left description box...'}
                      </p>
                    </div>

                    {/* Preset parameters badges checklist */}
                    <div className="space-y-1.5 pt-2.5 border-t border-[#e2e2e2]/60">
                      <span className="text-[8px] font-bold text-neutral-400 uppercase tracking-widest block">Linked Parameters:</span>
                      <div className="flex flex-wrap gap-1">
                        {newTaskTypeFields.map(f => (
                          <span key={f} className="text-[8px] font-bold text-zinc-600 bg-neutral-50 border border-neutral-200/80 px-1.5 py-0.5 rounded capitalize">
                            {f.replace('-', ' ')}
                          </span>
                        ))}
                      </div>
                    </div>

                  </div>

                  <div className="p-3 bg-zinc-50 rounded-lg border border-[#e2e2e2] text-[10px] leading-relaxed text-[#777777] font-medium">
                    This live preview shows exactly how card labels, custom styling accents, default icon metrics, and linked parameters are visually packaged on the interactive sprint boards.
                  </div>
                </div>

                {/* Bottom preview info */}
                <div className="mt-4 pt-3 border-t border-[#e2e2e2] text-left">
                  <span className="text-[8px] font-bold text-neutral-400 uppercase tracking-widest block mb-1">Preview Metadata:</span>
                  <div className="flex items-center justify-between text-[10px] text-zinc-500 font-bold">
                    <span>Target border accent:</span>
                    <span className="font-mono text-[9px]">{newTaskTypeColor.replace('93%', '80%')}</span>
                  </div>
                </div>

              </div>

            </div>

            {/* Bottom Actions */}
            <div className="px-6 py-4 border-t border-[#e2e2e2] bg-[#f9f9f9] flex items-center justify-end gap-3 flex-shrink-0">
              <button 
                type="button" 
                onClick={() => { setIsCreateTaskTypeOpen(false); setEditingTaskTypeId(null); }} 
                className="px-4 py-2 border border-[#e2e2e2] rounded-lg text-xs font-semibold text-[#777777] hover:bg-[#eaeaea]"
              >
                Cancel
              </button>
              <button 
                type="button" 
                onClick={handleSaveTaskType} 
                disabled={!newTaskTypeName.trim()} 
                className="px-4 py-2 bg-black hover:bg-neutral-800 disabled:opacity-50 text-white text-xs font-bold uppercase rounded-lg shadow flex items-center gap-1.5"
              >
                <Layers className="h-3.5 w-3.5" />
                <span>{editingTaskTypeId ? 'Save Task Type' : 'Create Task Type'}</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
