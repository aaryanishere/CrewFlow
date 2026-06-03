const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const Task = require('../models/Task');
const { protect, checkRole } = require('../middleware/auth');

// @route   POST /api/projects
// @desc    Create a new project
// @access  Private (Admin only)
router.post('/', protect, checkRole(['Admin']), async (req, res) => {
  const { name, description, members } = req.body;

  if (!name || name.trim() === '') {
    return res.status(400).json({ message: 'Project name is mandatory and cannot be empty' });
  }

  try {
    const project = await Project.create({
      name,
      description,
      createdBy: req.user._id,
      members: members || []
    });

    res.status(201).json(project);
  } catch (error) {
    console.error('Create project error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/projects
// @desc    Get all projects (filtered by user access role)
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    let projects;

    if (req.user.role === 'Admin') {
      // Admins see all projects
      projects = await Project.find()
        .populate('createdBy', 'email role')
        .populate('members', 'email role')
        .sort({ createdAt: -1 });
    } else {
      // Members only see projects where they are explicitly in the members array
      projects = await Project.find({ members: req.user._id })
        .populate('createdBy', 'email role')
        .populate('members', 'email role')
        .sort({ createdAt: -1 });
    }

    res.json(projects);
  } catch (error) {
    console.error('Get projects error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/projects/:id
// @desc    Delete a project and cascade delete all its tasks
// @access  Private (Admin only)
router.delete('/:id', protect, checkRole(['Admin']), async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Cascade delete tasks belonging to this project
    await Task.deleteMany({ projectId: project._id });

    // Delete project
    await Project.deleteOne({ _id: project._id });

    res.json({ message: 'Project and all its associated tasks have been successfully deleted.' });
  } catch (error) {
    console.error('Delete project error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
