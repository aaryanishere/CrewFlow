# CrewFlow — Team Task Manager

CrewFlow is a modern, full-stack collaborative project and task management dashboard designed for high-performance teams. It features strict Role-Based Access Control (RBAC), database referential integrity, real-time metrics aggregation, and automatic alerts for overdue milestones.

---

## CrewFlow Architecture Stack

- **Frontend**: React.js (Vite) + Tailwind CSS + Lucide Icons.
- **Backend**: Node.js + Express.js handling a clean REST API layer.
- **Database**: NoSQL (MongoDB with Mongoose ODM to handle strict validations & relationships).
- **Authentication**: Firebase Auth (Client-side signup/login generating JWTs verified on the Node.js backend using `firebase-admin`).
- **Resilient Offline Fallback**: Features a **Dual-Auth Mode** allowing local testing with a simulated JSON Web Token (JWT) system if Firebase variables are not set.

---

## Database Schemas (Mongoose)

### User Entity
- `firebaseUid`: String (Required, Unique, matches Firebase credentials).
- `email`: String (Required, strictly validated via regex `/.+\@.+\..+/`).
- `role`: String (Enum: `['Admin', 'Member']`, Defaults to `Member`).

### Project Entity
- `name`: String (Required, Trimmed).
- `description`: String (Optional).
- `createdBy`: ObjectId (Ref: `User`, Creator admin).
- `members`: Array of ObjectIds (Ref: `User`, Explicit workspace members).

### Task Entity
- `projectId`: ObjectId (Ref: `Project`, Target workspace).
- `assignedTo`: ObjectId (Ref: `User`, Assignee member).
- `title`: String (Required).
- `description`: String (Optional).
- `status`: String (Enum: `['To Do', 'In Progress', 'Done']`, Defaults to `To Do`).
- `dueDate`: Date (Required, evaluated dynamically for overdue status).
- `priority`: String (Enum: `['Low', 'Medium', 'High']`, Defaults to `Medium`).

---

## Step-by-Step Local Replication

Follow these instructions to clone and run the application locally on your Windows machine:

### Prerequisites
- [Node.js](https://nodejs.org/) (v16+ recommended)
- [MongoDB](https://www.mongodb.com/try/download/community) installed and running locally, OR a [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) free tier cluster.

### Setup Instructions

1. **Install Dependencies**:
   Navigate to the project root directory and install dependencies for both components:
   ```bash
   # Install Backend Dependencies
   cd backend
   npm install

   # Install Frontend Dependencies
   cd ../frontend
   npm install
   ```

2. **Configure Environment Variables**:
   
   - **Backend Configuration**:
     Create `backend/.env` (pre-created for you with local fallbacks) and configure your MongoDB connection:
     ```ini
     PORT=5000
     MONGO_URI=mongodb://127.0.0.1:27017/crewflow   # Your local MongoDB or Atlas link
     JWT_SECRET=crewflow_mock_secret_key_12345     # Used in local mock JWT auth
     USE_FIREBASE_ADMIN=false                      # Toggle true if using real Firebase SDK
     ```

   - **Frontend Configuration**:
     To use real Firebase, create `frontend/.env` and set:
     ```ini
     VITE_USE_FIREBASE=true
     VITE_FIREBASE_API_KEY=your_api_key
     VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
     VITE_FIREBASE_PROJECT_ID=your_project_id
     VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
     VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
     VITE_FIREBASE_APP_ID=your_app_id
     ```
     *Note: If `VITE_USE_FIREBASE` is set to `false` (default), the system launches in **Local Mock Auth Mode**, which generates simulated JWTs locally. This allows you to test the entire application instantly without configuring a Firebase project!*

3. **Running the Application**:
   Open two separate terminal windows:

   - **Terminal 1: Start Backend**
     ```bash
     cd backend
     npm run dev
     ```

   - **Terminal 2: Start Frontend**
     ```bash
     cd frontend
     npm run dev
     ```
---
