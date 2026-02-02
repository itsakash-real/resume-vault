# 📁 Resume Vault - Resume Versioning & Job Application Tracker

A full-stack web application that helps job seekers manage multiple resume versions and track their job applications efficiently. Built with the MERN stack (MongoDB, Express.js, React, Node.js).

![Resume Vault Banner](https://via.placeholder.com/1200x300/4F46E5/FFFFFF?text=Resume+Vault)

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

## 📸 Screenshots

### Dashboard
![Dashboard](https://via.placeholder.com/800x400/4F46E5/FFFFFF?text=Dashboard+Screenshot)

### Resume Management
![Resumes](https://via.placeholder.com/800x400/10B981/FFFFFF?text=Resume+Management+Screenshot)

### Application Tracker
![Applications](https://via.placeholder.com/800x400/F59E0B/FFFFFF?text=Application+Tracker+Screenshot)

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

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👤 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your Name](https://linkedin.com/in/yourprofile)
- Email: your.email@example.com

---

## 🙏 Acknowledgments

- Inspired by the challenges faced during my own job search
- Built as a portfolio project to demonstrate full-stack development skills
- Thanks to the open-source community for amazing tools and libraries

---

## 📞 Contact

Have questions or feedback? Feel free to reach out!

**Project Link**: [https://github.com/yourusername/resume-vault](https://github.com/yourusername/resume-vault)

---

⭐ If you found this project helpful, please consider giving it a star!

Additional Tips for Recruiters
You can also create a separate DEMO.md file with:
markdown# 🎬 Demo Guide

## Quick Demo Access

**Live Demo**: [https://your-deployed-app.com](https://your-deployed-app.com)

**Test Credentials**:
- Email: `demo@example.com`
- Password: `demo123`

## Demo Flow (5 minutes)

1. **Login** with test credentials
2. **Dashboard** - View application statistics
3. **Upload Resume** - Sample resume provided in `/demo-assets`
4. **Add Application** - Add a sample job application
5. **Filter Applications** - Test status filtering
6. **Edit/Delete** - Modify application data

## Video Walkthrough

[Link to 2-minute demo video on YouTube/Loom]

## Key Features to Notice

✅ Clean, professional UI
✅ Fast loading times
✅ Responsive design (works on mobile)
✅ Intuitive navigation
✅ Real-time updates
✅ Secure authentication
