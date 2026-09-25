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
