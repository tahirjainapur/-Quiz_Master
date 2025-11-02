# 🧠 Quiz Master

A simple, interactive Quiz Master web application built with HTML, CSS, JavaScript (frontend) and Node.js, Express, MongoDB (backend).

## ✨ Features

- ✅ **User Authentication** - Sign up and login system with secure sessions
- ✅ **Personal Dashboard** - Track your quiz history and performance metrics
- ✅ **Performance Analytics** - View score trends with interactive charts
- ✅ **Multiple-choice quizzes** - Users can take quizzes with multiple-choice questions
- ✅ **Instant question display** - Questions display immediately with selectable options
- ✅ **Real-time progress** - Visual progress bar and question counter
- ✅ **Instant scoring & feedback** - Get immediate results after quiz submission
- ✅ **Detailed results** - See which questions were correct/incorrect with detailed explanations
- ✅ **Score storage** - Results are automatically saved to MongoDB
- ✅ **Fully Responsive** - Beautiful UI optimized for phones, tablets, and laptops

## 🎯 Quiz Topics

- 📚 **Academic**: Mathematics, World History & Geography, Science & Nature
- ⚽ **Sports**: Sports World (Various sports, athletes, championships)
- 🎵 **Songs**: Music & Songs (Artists, songs, music history)
- 🌍 **General**: General Knowledge (Mixed topics)

## 💻 Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (MongoDB Atlas or local)

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- npm or yarn

## 🚀 Quick Start

### First Time Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Make sure MongoDB is running:**
   ```bash
   # On Windows (usually runs automatically)
   # If not, start it:
   net start MongoDB
   ```

3. **Seed the database (optional):**
   ```bash
   npm run seed
   # or
   node seed.js
   ```

### Running the App

**Simply run:**
```bash
npm start
```

**OR double-click `START.bat` (Windows)**

The server will start on `http://localhost:3000`

**For development with auto-reload:**
```bash
npm run dev
```

## 🌐 Access the App

Once the server is running, open your browser to:
- **Main App**: `http://localhost:3000`
- **Sign Up**: `http://localhost:3000/signup.html`
- **Login**: `http://localhost:3000/login.html`
- **Dashboard**: `http://localhost:3000/dashboard.html`
- **Admin**: `http://localhost:3000/admin.html`

## 📁 Project Structure

```
Quiz_Master/
├── models/
│   ├── Quiz.js          # Quiz and Question schema
│   ├── Result.js         # Quiz result schema
│   └── User.js           # User authentication schema
├── routes/
│   ├── quiz.js           # Quiz API routes
│   ├── result.js         # Result API routes
│   └── auth.js           # Authentication routes
├── middleware/
│   └── auth.js           # Authentication middleware
├── public/
│   ├── index.html        # Main HTML file
│   ├── login.html        # Login page
│   ├── signup.html       # Signup page
│   ├── dashboard.html    # User dashboard
│   ├── admin.html        # Admin dashboard
│   ├── styles.css        # Main stylesheet
│   ├── dashboard-styles.css
│   ├── auth-styles.css
│   ├── script.js         # Frontend JavaScript
│   ├── dashboard.js      # Dashboard JavaScript
│   └── auth.js           # Auth utilities
├── server.js             # Express server setup
├── seed.js               # Database seeding script
├── package.json          # Dependencies
└── README.md            # This file
```

## 📡 API Endpoints

### Quiz Endpoints

- `GET /api/quiz` - Get all quizzes
- `GET /api/quiz/:id` - Get a specific quiz by ID
- `POST /api/quiz/:id/submit` - Submit quiz answers and get results
- `POST /api/quiz` - Create a new quiz (admin)
- `GET /api/quiz/admin` - Get all quizzes with correct answers (admin)

### Result Endpoints

- `POST /api/result` - Save a quiz result (auto-saves for logged-in users)
- `GET /api/result` - Get all results
- `GET /api/result/my-results` - Get current user's quiz results (requires authentication)
- `GET /api/result/quiz/:quizId` - Get results for a specific quiz

### Auth Endpoints

- `POST /api/auth/signup` - Create a new user account
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Check authentication status

## 🎨 Features in Detail

### User Authentication
- **Sign Up**: Create an account with username, email, and password
- **Login**: Secure login with email and password
- **Session Management**: Persistent sessions for logged-in users
- **Auto-save**: Quiz results are automatically saved for logged-in users

### User Dashboard
- **Performance Stats**: View total quizzes taken, average score, best score, and total correct answers
- **Score Trend Chart**: Interactive line chart showing your performance over time
- **Quiz History**: Complete history of all quizzes you've taken with detailed breakdowns
- **Professional Analytics**: Beautiful visualizations of your quiz performance

### Responsive Design
- **Mobile First**: Optimized for phones (375px+)
- **Tablet Support**: Perfect on tablets (768px+)
- **Desktop**: Beautiful on laptops and desktops (1024px+)
- **Touch Optimized**: Large touch targets and smooth interactions

## 🔧 Environment Variables

Create a `.env` file (optional):

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/quiz_master
SESSION_SECRET=your-secret-key-here
```

For MongoDB Atlas:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/quiz_master
```

## 📝 NPM Scripts

- `npm start` - Start the server
- `npm run dev` - Start with auto-reload (requires nodemon)
- `npm run seed` - Seed the database with sample quizzes
- `npm run setup` - Install dependencies

## 🌐 Hosting Guide

### Option 1: Heroku
1. Create a Heroku app
2. Add MongoDB Atlas addon
3. Set environment variables
4. Deploy with git push

### Option 2: Vercel/Netlify (Frontend) + MongoDB Atlas
1. Deploy frontend to Vercel/Netlify
2. Host backend on Railway/Render
3. Use MongoDB Atlas for database

### Option 3: DigitalOcean/Railway/Render
1. Connect your GitHub repo
2. Set environment variables
3. Add MongoDB Atlas connection
4. Deploy!

## ⚠️ Troubleshooting

### MongoDB Connection Issues
- Make sure MongoDB is running (if using local)
- Check your MongoDB URI in the `.env` file
- For MongoDB Atlas, ensure your IP is whitelisted

### Port Already in Use
- Change the PORT in `.env` file
- Or stop the process using port 3000: `netstat -ano | findstr :3000`

### Module Not Found Errors
- Run `npm install` again
- Make sure you're in the project root directory

## 📊 Database Collections

- **users**: User accounts (username, email, password)
- **quizzes**: Quiz definitions with questions and answers
- **results**: Quiz attempt results linked to users

## 🔒 Security Features

- Passwords are hashed with bcryptjs
- Sessions managed securely
- User data isolation (users see only their own results)
- Input validation and sanitization

## 📱 Mobile Responsive

The app is fully optimized for:
- ✅ Mobile phones (iOS & Android)
- ✅ Tablets
- ✅ Laptops
- ✅ Desktop monitors
- ✅ Landscape & Portrait orientations

## 🎯 Future Enhancements

- User authentication
- Quiz categories and tags
- Timer for each quiz
- Leaderboard
- Quiz creation UI
- Admin dashboard

## 📄 License

ISC

## 👨‍💻 Author

Built with ❤️ using Node.js, Express, and MongoDB
