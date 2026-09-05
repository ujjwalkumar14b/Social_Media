Social_Media/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js                 # Database connection setup
│   │   ├── controllers/
│   │   │   ├── authController.js     # User registration, login, logout
│   │   │   ├── postController.js     # Post CRUD operations
│   │   │   └── adminController.js    # Admin management & global post deletion
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js     # Protect routes & verify JWT
│   │   │   └── adminMiddleware.js    # Verify admin role privileges
│   │   ├── models/
│   │   │   ├── User.js               # User schema (roles: ['user', 'admin'])
│   │   │   └── Post.js               # Post schema (title, content, author ref)
│   │   ├── routes/
│   │   │   ├── authRoutes.js         # /api/auth endpoints
│   │   │   ├── postRoutes.js         # /api/posts endpoints
│   │   │   └── adminRoutes.js        # /api/admin endpoints
│   │   ├── utils/
│   │   │   └── generateToken.js      # JWT token generator
│   │   └── app.js                    # Express app initialization
│   ├── .env                          # Mongo URI, JWT Secret, Port
│   ├── package.json
│   └── server.js                     # Entry point to start the backend server
│
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── assets/                   # Images, icons, static files
    │   ├── components/               # Reusable UI components
    │   │   ├── Navbar.jsx
    │   │   ├── PostCard.jsx          # Render post + Edit/Delete buttons conditionally
    │   │   ├── PostForm.jsx          # Form for creating/updating posts
    │   │   └── ProtectedRoute.jsx    # Route wrapper for Auth & Admin checks
    │   ├── context/
    │   │   └── AuthContext.jsx       # Global auth state (user info, token, role)
    │   ├── pages/
    │   │   ├── Home.jsx              # Feed displaying all posts
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── Profile.jsx           # User's own posts management
    │   │   └── AdminDashboard.jsx    # Admin panel for moderating/deleting posts
    │   ├── services/
    │   │   └── api.js                # Axios/Fetch setup for API calls
    │   ├── App.jsx                   # Route configurations
    │   └── main.jsx                  # React entry point
    ├── .env                          # React environment variables
    └── package.json