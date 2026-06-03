const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const Project = require('../models/Project');
const User = require('../models/User');
const { protect, checkRole } = require('../middleware/auth');

// @route   POST /api/tasks
// @desc    Create a new task and assign to a user
// @access  Private (Admin only)
router.post('/', protect, checkRole(['Admin']), async (req, res) => {
  const { projectId, assignedTo, title, description, status, dueDate, priority } = req.body;

  if (!projectId || !assignedTo || !title || !dueDate) {
    return res.status(400).json({ message: 'Please provide projectId, assignedTo, title, and dueDate' });
  }

  try {
    // Verify project exists
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Associated project not found' });
    }

    // Verify assigned user exists
    const user = await User.findById(assignedTo);
    if (!user) {
      return res.status(404).json({ message: 'Assigned user not found' });
    }

    const task = await Task.create({
      projectId,
      assignedTo,
      title,
      description,
      status: status || 'To Do',
      dueDate,
      priority: priority || 'Medium'
    });

    const populatedTask = await Task.findById(task._id)
      .populate('assignedTo', 'email role')
      .populate('projectId', 'name');

    res.status(201).json(populatedTask);
  } catch (error) {
    console.error('Create task error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/tasks
// @desc    Get tasks (filtered by user scope and optional projectId query)
// @access  Private
router.get('/', protect, async (req, res) => {
  const { projectId } = req.query;

  try {
    let query = {};

    if (projectId) {
      query.projectId = projectId;
    }

    // Enforce data isolation limits (PRD Section 5) to block horizontal escalation
    if (req.user.role !== 'Admin') {
      const userProjects = await Project.find({ members: req.user._id }).select('_id');
      const projectIds = userProjects.map(p => p._id);

      if (projectId) {
        if (!projectIds.some(id => id.toString() === projectId)) {
          return res.status(403).json({ message: 'Forbidden: You are not a member of this project' });
        }
      } else {
        query.projectId = { $in: projectIds };
      }
    }

    const tasks = await Task.find(query)
      .populate('assignedTo', 'email role')
      .populate('projectId', 'name')
      .sort({ dueDate: 1 });

    res.json(tasks);
  } catch (error) {
    console.error('Get tasks error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/tasks/:id
// @desc    Update a task (Admin full edit, Member status-only edit)
// @access  Private
router.put('/:id', protect, async (req, res) => {
  const { title, description, status, assignedTo, dueDate, priority } = req.body;

  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Horizontal access prevention
    if (req.user.role !== 'Admin') {
      const project = await Project.findById(task.projectId);
      if (!project || !project.members.includes(req.user._id)) {
        return res.status(403).json({ message: 'Forbidden: You do not have access to this task project' });
      }
    }

    // RBAC validation logic
    if (req.user.role === 'Admin') {
      // Admins have full editing rights
      if (title !== undefined) task.title = title;
      if (description !== undefined) task.description = description;
      if (status !== undefined) {
        if (!['To Do', 'In Progress', 'Done'].includes(status)) {
          return res.status(400).json({ message: 'Invalid status value' });
        }
        task.status = status;
      }
      if (assignedTo !== undefined) {
        const user = await User.findById(assignedTo);
        if (!user) return res.status(404).json({ message: 'Assigned user not found' });
        task.assignedTo = assignedTo;
      }
      if (dueDate !== undefined) task.dueDate = dueDate;
      if (priority !== undefined) {
        if (!['Low', 'Medium', 'High'].includes(priority)) {
          return res.status(400).json({ message: 'Invalid priority tier' });
        }
        task.priority = priority;
      }
    } else {
      // Members can only edit status on their assigned tasks
      if (task.assignedTo.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Forbidden: You can only update tasks assigned to you' });
      }

      if (title !== undefined || description !== undefined || assignedTo !== undefined || dueDate !== undefined || priority !== undefined) {
        return res.status(403).json({ message: 'Forbidden: Standard members can only update task status' });
      }

      if (status === undefined) {
        return res.status(400).json({ message: 'Missing status update payload' });
      }

      if (!['To Do', 'In Progress', 'Done'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status value. Status must match enum states exclusively.' });
      }

      task.status = status;
    }

    await task.save();

    const populatedTask = await Task.findById(task._id)
      .populate('assignedTo', 'email role')
      .populate('projectId', 'name');

    res.json(populatedTask);
  } catch (error) {
    console.error('Update task error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/tasks/:id
// @desc    Delete a task
// @access  Private (Admin only)
router.delete('/:id', protect, checkRole(['Admin']), async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    await Task.deleteOne({ _id: req.params.id });
    res.json({ message: 'Task successfully deleted.' });
  } catch (error) {
    console.error('Delete task error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
