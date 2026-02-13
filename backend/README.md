# Backend Documentation

## Overview
Express.js backend for the University Thesis Repository System with PostgreSQL database and Prisma ORM.

## Directory Structure

```
src/
├── controllers/
│   ├── authController.js        # Authentication logic
│   ├── submissionController.js  # Thesis submission handling
│   ├── reviewController.js      # Review and comment logic
│   ├── searchController.js      # Search & filter logic
│   └── dashboardController.js   # Dashboard statistics
├── routes/
│   ├── auth.js                  # Auth endpoints
│   ├── submission.js            # Submission endpoints
│   ├── review.js                # Review endpoints
│   ├── search.js                # Search endpoints
│   └── dashboard.js             # Dashboard endpoints
├── middleware/
│   └── auth.js                  # JWT verification & role authorization
└── index.js                     # Express server setup
```

## Getting Started

### Install Dependencies
```bash
npm install
```

### Environment Setup
```bash
cp .env.example .env
```

Required environment variables:
- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Secret key for JWT tokens
- `PORT`: Server port (default: 5000)
- `NODE_ENV`: Environment (development/production)

### Database Setup
```bash
# Run migrations
npm run prisma:migrate

# Generate Prisma client
npm run prisma:generate

# View database
npm run prisma:studio
```

### Start Development Server
```bash
npm run dev
```

## API Endpoints

### Auth Routes (`/api/auth`)
- `POST /register` - Register new user
- `POST /login` - Login user
- `GET /profile` - Get authenticated user profile (requires token)

### Submission Routes (`/api/submission`)
- `POST /submit` - Submit thesis (students only)
- `GET /my-theses` - Get user's submissions (students only)
- `GET /:id` - Get thesis details
- `GET /:id/download` - Download thesis file

### Review Routes (`/api/review`)
- `POST /submit-review` - Submit a review (reviewers/admin)
- `GET /thesis/:thesisId` - Get all reviews for a thesis
- `GET /reviewer/dashboard` - Get reviewer dashboard
- `POST /add-comment` - Add comment to thesis

### Search Routes (`/api/search`)
- `GET /theses` - Search theses with filters
- `GET /filters` - Get available search filters

### Dashboard Routes (`/api/dashboard`)
- `GET /admin` - Admin dashboard stats (admin only)
- `GET /student` - Student dashboard (students only)
- `GET /reviewer` - Reviewer dashboard (reviewers only)

## Authentication

Uses JWT (JSON Web Tokens) for authentication:

1. **Registration/Login**: Returns JWT token
2. **Protected Routes**: Include token in Authorization header
   ```
   Authorization: Bearer <token>
   ```
3. **Role-Based Access**: Middleware checks user role before allowing access

## File Upload

Thesis files are uploaded to `uploads/` directory with:
- Allowed formats: PDF, DOCX
- File naming: `{timestamp}_{originalname}`
- Metadata stored in database

## Middleware

### Authentication Middleware
```javascript
authenticateToken(req, res, next)
// Validates JWT token and adds user to req.user
```

### Role Authorization Middleware
```javascript
authorizeRole(...roles)(req, res, next)
// Checks if user has required role
// Usage: authorizeRole('ADMIN', 'REVIEWER')
```

## Error Handling

All endpoints return consistent error responses:
```json
{
  "error": "Error message describing the issue"
}
```

## Database Schema

### Relationships
- User → Thesis (1:many, studentId)
- User → Department (many:1)
- Thesis → Review (1:many)
- Thesis → Comment (1:many)
- Review → User (many:1, reviewerId)

## Development

### Debugging
```bash
# Enable detailed logging
DEBUG=* npm run dev
```

### Testing Endpoints
Use Postman or similar tool:
1. Register a user
2. Login to get JWT token
3. Add token to Authorization header for protected routes

## Production Build

```bash
# Set environment
NODE_ENV=production

# Start production server
npm start
```

## Common Issues

### File Upload Not Working
- Check `uploads/` directory permissions
- Verify file size limits
- Ensure file type validation

### Database Connection Error
- Verify `DATABASE_URL` format
- Check PostgreSQL is running
- Test connection: `psql <DATABASE_URL>`

### Authentication Failing
- Verify JWT_SECRET is set
- Check token expiration
- Ensure proper header format

## Next Steps

1. Add input validation with express-validator
2. Implement rate limiting
3. Add logging (Winston/Morgan)
4. Setup automated testing with Jest
5. Add API documentation with Swagger
