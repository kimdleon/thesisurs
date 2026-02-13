# University Thesis Repository System

A comprehensive web application for managing university thesis submissions, reviews, and storage.

## 🎯 Features

### Role-Based Access Control
- **Admin**: Full system management and analytics
- **Student**: Submit thesis documents and track submission status
- **Reviewer**: Review submissions and provide feedback

### Core Features
- 📤 **File Upload**: Support for PDF and DOCX thesis documents
- 📝 **Thesis Submission**: Students can submit with title, abstract, topic, and advisor
- 👀 **Review Dashboard**: Reviewers can approve/reject with feedback and scoring
- 🔍 **Advanced Search**: Filter by department, year, topic, and advisor
- 📊 **Analytics Dashboard**: View statistics and popular topics
- 💬 **Comments System**: Collaborative feedback on submissions
- 📥 **Download**: Access approved thesis documents

## 🚀 Tech Stack

### Frontend
- **React 18**: UI framework
- **React Router**: Client-side routing
- **Axios**: HTTP client
- **TailwindCSS**: Styling

### Backend
- **Node.js + Express**: Server framework
- **Prisma ORM**: Database management
- **PostgreSQL**: Relational database
- **JWT**: Authentication
- **bcryptjs**: Password hashing

## 📁 Project Structure

```
ThesisURS/
├── backend/
│   ├── src/
│   │   ├── controllers/       # Business logic
│   │   ├── routes/           # API endpoints
│   │   ├── middleware/       # Auth & validation
│   │   └── index.js          # Express server
│   ├── prisma/
│   │   └── schema.prisma     # Database schema
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── pages/            # React pages
│   │   ├── components/       # Reusable components
│   │   ├── services/         # API calls
│   │   ├── contexts/         # Auth context
│   │   ├── App.js
│   │   └── index.js
│   ├── public/
│   ├── tailwind.config.js
│   ├── package.json
│   └── .env.example
├── package.json              # Root workspace
└── README.md
```

## 🛠 Installation & Setup

### Prerequisites
- Node.js (v16+)
- npm or yarn
- PostgreSQL (local or cloud)

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

4. **Setup database**
   ```bash
   npm run prisma:migrate
   npm run prisma:generate
   ```

5. **Start backend server**
   ```bash
   npm run dev
   # Server runs on http://localhost:5000
   ```

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment** (optional)
   ```bash
   echo "REACT_APP_API_URL=http://localhost:5000/api" > .env.local
   ```

4. **Start development server**
   ```bash
   npm start
   # App runs on http://localhost:3000
   ```

## 🔐 Database Models

### User
- id, email, password, firstName, lastName
- role: ADMIN | STUDENT | REVIEWER
- department relationship
- submissions, reviews, comments

### Thesis
- id, title, abstract, topic, advisor
- file: fileName, filePath, fileSize, fileType
- status: PENDING | APPROVED | REJECTED | REVISIONS_REQUESTED
- relationships: student, department, reviews, comments

### Department
- id, name (unique), code, description
- relationships: users, theses

### Review
- id, status, feedback, score (1-5)
- relationships: thesis, reviewer

### Comment
- id, content
- relationships: thesis, author

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Submission
- `POST /api/submission/submit` - Submit thesis
- `GET /api/submission/my-theses` - Get student's theses
- `GET /api/submission/:id` - Get thesis details
- `GET /api/submission/:id/download` - Download thesis file

### Review
- `POST /api/review/submit-review` - Submit review
- `GET /api/review/thesis/:thesisId` - Get thesis reviews
- `POST /api/review/add-comment` - Add comment

### Search
- `GET /api/search/theses` - Search theses with filters
- `GET /api/search/filters` - Get available filters

### Dashboard
- `GET /api/dashboard/admin` - Admin statistics
- `GET /api/dashboard/student` - Student dashboard
- `GET /api/dashboard/reviewer` - Reviewer dashboard

## 🔧 Configuration

### Backend (.env)
```
DATABASE_URL="postgresql://user:password@localhost:5432/thesis_repository"
JWT_SECRET="your_jwt_secret_key_here"
PORT=5000
NODE_ENV="development"
```

### Frontend (.env.local)
```
REACT_APP_API_URL=http://localhost:5000/api
```

## 📊 Database Setup with Prisma Studio

View and manage database visually:
```bash
cd backend
npm run prisma:studio
```

## 🧪 Testing

### Login Credentials (After seeding)
- **Admin**: admin@university.edu / password123
- **Student**: student@university.edu / password123
- **Reviewer**: reviewer@university.edu / password123

## 🚀 Deployment

### Backend (Heroku/Railway)
1. Set environment variables on hosting platform
2. Push to git repository
3. Platform auto-deploys with `npm start`

### Frontend (Vercel/Netlify)
1. Connect GitHub repository
2. Set `REACT_APP_API_URL` environment variable
3. Auto-deployes on push to main

## 🐛 Troubleshooting

### Database Connection Error
- Verify PostgreSQL is running
- Check DATABASE_URL in .env
- Run `npx prisma db push` to sync schema

### Port Already in Use
- Backend: Change PORT in .env
- Frontend: Use `PORT=3001 npm start`

### CORS Errors
- Verify frontend URL matches backend CORS config
- Check API_URL in frontend .env

## 📝 Next Steps

1. **Seed Database**: Create sample data (departments, users)
2. **Add Email Notifications**: Notify users on submission status
3. **File Storage**: Implement cloud storage (S3/GCS)
4. **Advanced Analytics**: More detailed statistics
5. **User Profiles**: Edit profile information
6. **Pagination**: Improve large dataset handling

## 👥 Contributors

Built for University of Rizal System

## 📄 License

MIT License
