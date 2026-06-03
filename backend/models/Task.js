const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true, trim: true },
  description: { type: String },
  status: { type: String, enum: ['To Do', 'In Progress', 'Done'], default: 'To Do', required: true },
  dueDate: { type: Date, required: true }, // Crucial for Overdue calculations
  priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium', required: true }
}, {
  timestamps: true
});

module.exports = mongoose.model('Task', TaskSchema);
