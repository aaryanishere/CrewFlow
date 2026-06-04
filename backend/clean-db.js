const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');

// Load env variables
dotenv.config({ path: path.join(__dirname, '.env') });

const User = require('./models/User');
const Project = require('./models/Project');
const Task = require('./models/Task');

const cleanDatabase = async () => {
  const uri = process.env.MONGO_URI || process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/crewflow';
  console.log(`Connecting to database for cleanup at: ${uri}`);
  
  try {
    await mongoose.connect(uri);
    console.log('MongoDB connection established successfully.');

    // 1. Find Guest User
    const guestUser = await User.findOne({ email: 'guest@crewflow.com' });
    let guestId = null;
    
    if (guestUser) {
      guestId = guestUser._id;
      console.log(`Found Guest user with ID: ${guestId}. Protecting this account.`);
    } else {
      console.log('Guest user (guest@crewflow.com) not found in database. All accounts will be processed.');
    }

    // 2. Delete non-guest users
    const userDeleteQuery = guestId ? { _id: { $ne: guestId } } : {};
    const deletedUsers = await User.deleteMany(userDeleteQuery);
    console.log(`Purged ${deletedUsers.deletedCount} non-guest user account(s) from database.`);

    // 3. Delete non-guest projects
    // Keep projects created by or containing guest user as a member
    const projectDeleteQuery = guestId ? { 
      $and: [
        { createdBy: { $ne: guestId } },
        { members: { $ne: guestId } }
      ]
    } : {};
    const deletedProjects = await Project.deleteMany(projectDeleteQuery);
    console.log(`Purged ${deletedProjects.deletedCount} sample project(s) from database.`);

    // 4. Delete tasks that are not assigned to guest or belong to deleted projects
    // Get list of remaining valid project IDs
    const activeProjects = await Project.find({}, '_id');
    const activeProjectIds = activeProjects.map(p => p._id);
    
    const taskDeleteQuery = guestId ? {
      $or: [
        { assignedTo: { $ne: guestId } },
        { projectId: { $nin: activeProjectIds } }
      ]
    } : {};
    const deletedTasks = await Task.deleteMany(taskDeleteQuery);
    console.log(`Purged ${deletedTasks.deletedCount} sample task(s) from database.`);

    console.log('Database cleanup completed successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Error during database cleanup:', error.message);
    process.exit(1);
  }
};

cleanDatabase();
