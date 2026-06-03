# Implementation Plan - CrewFlow Team Task Manager

This document details the architecture, design, and step-by-step implementation plan for **CrewFlow**, a collaborative team task manager featuring strict Role-Based Access Control (RBAC), a real-time tracking dashboard, and an automated overdue task warning system.

---

## Technical Stack & Architecture

- **Frontend**: React.js (Vite for fast scaffolding) + Tailwind CSS
- **Backend**: Node.js + Express.js handling a clean REST API
- **Database**: NoSQL (MongoDB with Mongoose ODM to handle validations & relationships)
- **Authentication**: Firebase Auth (Client-side signup/login generating JWTs, verified by the Node.js backend using `firebase-admin` or a robust local mock JWT fallback for offline development)

---

## Database Schemas (Mongoose)

### User Schema
```javascript
{
  firebaseUid: { type: String, required: true, unique: true },
  email: { type: String, required: true, match: /.+\@.+\..+/ },
  role: { type: String, enum: ['Admin', 'Member'], default: 'Member', required: true }
}
```

### Project Schema
```javascript
{
  name: { type: String, required: true, trim: true },
  description: { type: String },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  members: [{ type: Schema.Types.ObjectId, ref: 'User' }]
}
```

### Task Schema
```javascript
{
  projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
  assignedTo: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String },
  status: { type: String, enum: ['To Do', 'In Progress', 'Done'], default: 'To Do' },
  dueDate: { type: Date, required: true },
  priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' }
}
```

---

## REST API Endpoint Specifications

| Method | Route | Access | Purpose |
|---|---|---|---|
| **POST** | `/api/auth/signup` | Public | Registers a verified/mock authenticated Firebase user in the MongoDB database |
| **POST** | `/api/auth/mock-login` | Public | Generates a valid local JWT token for testing when Firebase mode is offline |
| **GET** | `/api/auth/me` | Authenticated | Retrieves current user profile, role, and database ID |
| **GET** | `/api/users` | Authenticated | Lists users (enables Admin to select members for assignment) |
| **GET** | `/api/projects` | Authenticated | Returns filtered projects based on scope (Admins see all; Members only see assigned projects) |
| **POST** | `/api/projects` | Admin Only | Creates a new project with title validations |
| **POST** | `/api/tasks` | Admin Only | Creates a task inside a project and assigns it to a User ID |
| **PUT** | `/api/tasks/:id` | Admin or Assignee | Admin can edit all fields; Members can only update status (verifying status enum) |
| **GET** | `/api/dashboard/metrics` | Authenticated | Aggregates Total Tasks, Completed, Pending, and filters Overdue tasks |

---

## Execution Checklist

### Phase 1: Backend Setup
- Initialize Node.js environment & install dependencies (`express`, `mongoose`, `dotenv`, `cors`, `jsonwebtoken`, `firebase-admin`).
- Set up MongoDB Atlas configuration and server entry points.
- Create strict Mongoose Schemas with validations.
- Build authentication middleware (with Dual-Auth Firebase vs. local JWT fallback).
- Build and test REST API endpoints (signup, projects, tasks, dashboard metrics).

### Phase 2: Frontend Setup
- Scaffold React project with Vite + Tailwind CSS.
- Configure Tailwind CSS styles with premium color palette and dark modes.
- Implement AuthContext linking Firebase / Mock JWT client auth.
- Design responsive, glassmorphism login & signup screens.
- Build main dashboard screen:
  - Aggregate metrics panel with styled Red Overdue tasks count.
  - Project navigation and interactive task status controllers.
  - Modals for Project and Task creation (Admin only).

### Phase 3: Deployment & Handover
- Package monorepo structure.
- Add configuration instructions and a detailed README.md.
