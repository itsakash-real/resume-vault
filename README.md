# 📁 Resume Vault - Resume Versioning & Job Application Tracker

A full-stack web application that helps job seekers manage multiple resume versions and track their job applications efficiently. Built with the MERN stack (MongoDB, Express.js, React, Node.js).

## 🎯 Problem Statement

Job seekers often struggle with:
- Managing multiple tailored resume versions
- Remembering which resume was sent to which company
- Tracking application statuses across different job portals
- Organizing job search data in one place

**Resume Vault** solves these problems by providing a centralized platform to store resumes and track applications.

---

## ✨ Features

### 🔐 Authentication
- Secure user registration and login
- JWT-based authentication
- Password encryption using bcrypt

### 📄 Resume Management
- Upload multiple resume versions (PDF format)
- Add custom names and notes to each resume
- View/download resumes anytime
- Delete outdated versions

### 📊 Application Tracker
- Add job applications with company, role, and status
- Link each application to a specific resume version
- Update application status (Applied → Interview → Offer/Rejected)
- Filter applications by status
- Add notes for each application

### 📈 Dashboard Analytics
- Total applications count
- Breakdown by status (Applied, Interview, Offer, Rejected)
- Total resumes stored
- Recent applications overview

---

## 🛠️ Tech Stack

### Frontend
- **React.js** - UI library
- **Vite** - Fast build tool
- **React Router** - Client-side routing
- **Tailwind CSS** - Styling
- **Axios** - HTTP client

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **bcrypt** - Password hashing
- **Multer** - File upload handling

---

## 📂 Project Structure
```
resume-vault/
│
├── backend/                 # Backend API
│   ├── config/             
│   │   └── db.js           # MongoDB connection
│   ├── middleware/         
│   │   └── auth.js         # JWT authentication middleware
│   ├── models/             
│   │   ├── User.js         # User schema
│   │   ├── Resume.js       # Resume schema
│   │   └── Application.js  # Application schema
│   ├── routes/             
│   │   ├── auth.js         # Auth endpoints
│   │   ├── resumes.js      # Resume CRUD endpoints
│   │   ├── applications.js # Application CRUD endpoints
│   │   └── dashboard.js    # Dashboard stats endpoint
│   ├── uploads/            # Uploaded PDF files
│   ├── server.js           # Express server setup
│   └── package.json        
│
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     
│   │   │   ├── Navbar.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── pages/          
│   │   │   ├── Register.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Resumes.jsx
│   │   │   └── Applications.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas cloud)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/resume-vault.git
cd resume-vault
```

2. **Setup Backend**
```bash
cd backend
npm install

# Create .env file
touch .env
```

Add the following to `backend/.env`:
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
```
```bash
# Start backend server
npm run dev
```

3. **Setup Frontend**
```bash
cd ../frontend
npm install

# Create .env file
touch .env
```

Add the following to `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000/api
```
```bash
# Start frontend
npm run dev
```

4. **Access the application**
```
Frontend: http://localhost:5173
Backend API: http://localhost:5000
```


---

## 🔑 API Endpoints

### Authentication
```
POST   /api/auth/register    # Register new user
POST   /api/auth/login       # Login user
GET    /api/auth/me          # Get current user (protected)
```

### Resumes
```
POST   /api/resumes/upload   # Upload resume (protected)
GET    /api/resumes          # Get all resumes (protected)
GET    /api/resumes/:id      # Get single resume (protected)
PUT    /api/resumes/:id      # Update resume (protected)
DELETE /api/resumes/:id      # Delete resume (protected)
```

### Applications
```
POST   /api/applications     # Create application (protected)
GET    /api/applications     # Get all applications (protected)
GET    /api/applications/:id # Get single application (protected)
PUT    /api/applications/:id # Update application (protected)
DELETE /api/applications/:id # Delete application (protected)
```

### Dashboard
```
GET    /api/dashboard/stats  # Get dashboard statistics (protected)
```

---

## 🔒 Security Features

- **Password Hashing**: User passwords are hashed using bcrypt before storage
- **JWT Authentication**: Secure token-based authentication
- **Protected Routes**: Backend middleware ensures only authenticated users can access resources
- **User-Specific Data**: Users can only access their own resumes and applications
- **File Validation**: Only PDF files under 5MB are accepted

---

## 🎓 Learning Outcomes

Through this project, I gained hands-on experience with:

- Building RESTful APIs with Express.js
- Database modeling and relationships with MongoDB/Mongoose
- User authentication and authorization using JWT
- File upload handling with Multer
- React hooks (useState, useEffect) for state management
- Client-side routing with React Router
- Responsive UI design with Tailwind CSS
- Error handling and form validation
- CORS configuration for full-stack apps

---

## 🚧 Future Enhancements

- [ ] Email notifications for application status updates
- [ ] Resume comparison tool
- [ ] Interview scheduling calendar
- [ ] Company research notes
- [ ] Application deadline reminders
- [ ] Export data to CSV/PDF reports
- [ ] Dark mode toggle
- [ ] Mobile app version

---
