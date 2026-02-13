# Quick Start Guide

## 🚀 5-Minute Setup

### Prerequisites
- Node.js v16+ and npm installed
- PostgreSQL running locally or cloud instance

### Step 1: Clone & Install
```bash
cd ThesisURS

# Install all dependencies
npm install --workspace=backend
npm install --workspace=frontend
```

### Step 2: Database Setup
```bash
cd backend

# Copy environment file
cp .env.example .env

# Edit .env with your database URL:
# DATABASE_URL="postgresql://user:password@localhost:5432/thesis_repository"

# Run migrations
npm run prisma:migrate

# Verify database
npm run prisma:studio
```

### Step 3: Start Servers
```bash
# Terminal 1 - Backend
cd backend
npm run dev
# Backend runs on http://localhost:5000

# Terminal 2 - Frontend
cd frontend
npm start
# Frontend runs on http://localhost:3000
```

### Step 4: Test It!
1. Visit http://localhost:3000
2. Click "Register"
3. Create account with role as "STUDENT"
4. Login with your credentials
5. Navigate dashboard to submit thesis

## 🔧 Configuration

### Backend .env
```
DATABASE_URL="postgresql://user:password@localhost:5432/thesis_repository"
JWT_SECRET="your-super-secret-key-here-min-32-chars"
PORT=5000
NODE_ENV="development"
```

### Frontend .env.local (Optional)
```
REACT_APP_API_URL=http://localhost:5000/api
```

## 📊 Database

### PostgreSQL Setup

**Local Installation:**
```bash
# macOS
brew install postgresql
brew services start postgresql

# Linux
sudo apt-get install postgresql postgresql-contrib
sudo service postgresql start

# Windows
# Download from https://www.postgresql.org/download/windows/
```

**Create Database:**
```bash
createdb thesis_repository
```

**Cloud Options:**
- Railway.app (free tier available)
- Supabase (PostgreSQL free tier)
- AWS RDS (free tier)
- Heroku Postgres

## 📝 Sample Accounts

After registration, create these for testing:

**Admin Account:**
- Email: admin@urs.edu
- Password: Admin@123
- Role: ADMIN

**Student Account:**
- Email: student@urs.edu
- Password: Student@123
- Role: STUDENT

**Reviewer Account:**
- Email: reviewer@urs.edu
- Password: Reviewer@123
- Role: REVIEWER

## 🔍 Verify Installation

### Backend Health Check
```bash
curl http://localhost:5000/api/health
# Should return: {"status": "Backend is running"}
```

### Frontend Check
- Open http://localhost:3000 in browser
- Should see login page

## 📚 Next Steps

1. **Submit Thesis**
   - Login as student
   - Go to Submit page
   - Fill form and upload PDF/DOCX

2. **Review Theses**
   - Login as reviewer
   - Go to Review Dashboard
   - Provide feedback and score

3. **View Analytics**
   - Login as admin
   - View system statistics
   - Monitor submissions

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill process using port 5000
lsof -ti:5000 | xargs kill -9

# Kill process using port 3000
lsof -ti:3000 | xargs kill -9
```

### Database Connection Error
```bash
# Test PostgreSQL connection
psql -U your_user -d thesis_repository

# If database doesn't exist
createdb thesis_repository

# Reset Prisma
npm run prisma:migrate
```

### Dependencies Not Installing
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Frontend Styling Issues
```bash
# Clear browser cache
# Ctrl + Shift + Delete (Windows/Linux)
# Cmd + Shift + Delete (Mac)

# Or restart frontend
npm start
```

## 📱 API Testing

Use Postman or curl:

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@urs.edu",
    "password": "Test@123",
    "firstName": "Test",
    "lastName": "User",
    "role": "STUDENT"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@urs.edu",
    "password": "Test@123"
  }'
```

## 🚀 Deployment

### Quick Deploy to Railway.app

1. Create account at railway.app
2. Push code to GitHub
3. Connect GitHub repo in Railway dashboard
4. Set environment variables
5. Deploy! 🎉

### Deploy to Vercel (Frontend)

1. Push frontend to GitHub
2. Import repo in Vercel
3. Set REACT_APP_API_URL
4. Deploy!

## 📖 Documentation

- Backend: See `backend/README.md`
- Frontend: See `frontend/README.md`
- Full API docs in root `README.md`
- Docker setup in `DOCKER_SETUP.md`

## ✅ Checklist

- [ ] Node.js and npm installed
- [ ] PostgreSQL installed and running
- [ ] Backend dependencies installed
- [ ] Frontend dependencies installed
- [ ] Database created
- [ ] Migrations run
- [ ] Backend running on :5000
- [ ] Frontend running on :3000
- [ ] Can access http://localhost:3000
- [ ] Can register and login

## 📞 Support

For issues:
1. Check logs in terminal
2. Verify .env files
3. Ensure database is running
4. Check port availability
5. Review README files in backend/frontend

Happy coding! 🎓
