# Social Media & Video Calling Web Application

A full-stack social media web application built with the MERN stack (MongoDB, Express.js, React.js, Node.js). The platform features user authentication, role-based access control (Admin & User), post management (CRUD operations), admin moderation capabilities, and video calling.

Live Demo: [Social Media App](https://social-media-frontend-sigma-two.vercel.app)

## Features
- Authentication & Authorization: Secure user registration and login using JWT (JSON Web Tokens) with passwords hashed via bcrypt.
- Role-Based Access Control (RBAC):
-- Standard User: Can register, log in, create posts, view posts, edit their own posts, and delete their own posts.
-- Admin: Has full administrative privileges, including access to an Admin Dashboard and the ability to delete posts created by any user.
- Post Management (CRUD): Complete functionality to create, read, update, and delete posts.
- Video Meeting / Calling: Built-in video meeting feature (VideoMeet) allowing users to connect via live video calls.
- Protected Routes: Frontend route protection ensuring unauthorized users cannot access restricted pages like the feed, profile, or admin dashboard.

## Tech Stack
- Frontend: React.js, React Router DOM, Context API, Axios
- Backend: Node.js, Express.js, MongoDB, Mongoose, JSON Web Token, Bcrypt.js

## Folder Structure
```
Social_Media/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js                
│   │   ├── controllers/
│   │   │   ├── authController.js     
│   │   │   ├── postController.js     
│   │   │   └── adminController.js    
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js     
│   │   │   └── adminMiddleware.js    
│   │   ├── models/
│   │   │   ├── User.js               
│   │   │   └── Post.js               
│   │   ├── routes/
│   │   │   ├── authRoutes.js         
│   │   │   ├── postRoutes.js         
│   │   │   └── adminRoutes.js        
│   │   ├── utils/
│   │   │   └── generateToken.js      
│   │   └── app.js                    
│   ├── .env                          
│   ├── package.json
│   ├── seedAdmin.js
│   ├── server.js  
│   └── vercel.json                   
│
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── assets/                   
    │   ├── components/               
    │   │   ├── Navbar.jsx
    │   │   ├── PostCard.jsx          
    │   │   ├── PostForm.jsx          
    │   │   └── ProtectedRoute.jsx    
    │   ├── context/
    │   │   └── AuthContext.jsx       
    │   ├── pages/
    │   │   ├── AdminDashboard.jsx   
    │   │   ├── Home.jsx              
    │   │   ├── Login.jsx
    │   │   ├── Profile.jsx           
    │   │   ├── Register.jsx
    │   │   └── VideoMeet.jsx     
    │   ├── services/
    │   │   └── api.js                
    │   ├── App.jsx  
    │   ├── environment.js                 
    │   └── main.jsx                  
    ├── .env                          
    └── package.json
```

## Author
Ujjwal Kumar
GitHub: [https://github.com/ujjwalkumar14b](https://github.com/ujjwalkumar14b)
