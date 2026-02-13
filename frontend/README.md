# Frontend Documentation

## Overview
React frontend for the University Thesis Repository System with TailwindCSS styling.

## Directory Structure

```
src/
├── pages/
│   ├── LoginPage.js             # User login
│   ├── RegisterPage.js          # User registration
│   ├── DashboardPage.js         # Role-specific dashboard
│   ├── SubmissionPage.js        # Thesis submission form
│   ├── SearchPage.js            # Search & filter interface
│   └── ReviewPage.js            # Thesis review interface
├── components/
│   └── Navigation.js            # Top navigation bar
├── services/
│   └── apiService.js            # API client & service methods
├── contexts/
│   └── AuthContext.js           # Authentication state management
├── App.js                       # Main app component
├── index.js                     # React DOM render
└── index.css                    # Global styles + Tailwind
```

## Getting Started

### Install Dependencies
```bash
npm install
```

### Environment Setup
```bash
# Optional: Set API URL (defaults to http://localhost:5000/api)
echo "REACT_APP_API_URL=http://localhost:5000/api" > .env.local
```

### Start Development Server
```bash
npm start
```
App opens at `http://localhost:3000`

## Routing

### Protected Routes
All routes except `/login` and `/register` require authentication.

```javascript
/                    → Redirect to /dashboard
/login               → User login
/register            → User registration
/dashboard           → Role-specific dashboard
/submit              → Thesis submission (students only)
/search              → Search theses
/review/:id          → Review thesis
```

## Components

### Navigation
- Shows different options based on user role
- Displays user name and logout button
- Links to appropriate dashboard

## Pages

### LoginPage
- Email and password login
- Error messages for failed attempts
- Link to register

### RegisterPage
- First name, last name, email, password
- Role selection (Student, Reviewer, Admin)
- Department assignment (optional)

### DashboardPage
- **Admin**: System statistics, approvals/rejections, top topics
- **Student**: Submission history, status overview
- **Reviewer**: Theses to review, review statistics

### SubmissionPage
- Thesis form with title, abstract, topic, advisor
- File upload (PDF/DOCX only)
- Department selection
- Validation before submission

### SearchPage
- Keyword search across title, abstract, topic
- Filter by department, topic, advisor, year, status
- Pagination support
- Results displayed as cards

### ReviewPage
- Display thesis details
- Review form: status, score (1-5), feedback
- Comments section for collaboration
- Real-time comment updates

## Services (apiService.js)

### Available Services

```javascript
// Auth
authService.register(data)
authService.login(email, password)
authService.getProfile()

// Submission
submissionService.submitThesis(formData)
submissionService.getMyTheses()
submissionService.getThesisById(id)
submissionService.downloadThesis(id)

// Review
reviewService.submitReview(data)
reviewService.getReviewsForThesis(thesisId)
reviewService.getReviewerDashboard()
reviewService.addComment(data)

// Search
searchService.searchTheses(params)
searchService.getFilters()

// Dashboard
dashboardService.getAdminDashboard()
dashboardService.getStudentDashboard()
dashboardService.getReviewerDashboard()
```

### API Client Configuration
```javascript
const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api'
});

// Auto-inject JWT token in headers
```

## Authentication Context

### useAuth Hook
```javascript
const { user, token, login, logout, loading } = useAuth();

// user: { id, email, firstName, lastName, role }
// token: JWT token string
// login(userData, token): Set authentication
// logout(): Clear authentication
// loading: Boolean for initial auth check
```

### Protected Route
```javascript
<ProtectedRoute>
  <Dashboard />
</ProtectedRoute>
```

## Styling with TailwindCSS

Global styles in `index.css`:
- Reset and base styles
- Custom fonts
- Smooth rendering

Utility classes used throughout:
- `bg-blue-600` - Colors
- `px-4 py-2` - Padding
- `rounded-lg` - Borders
- `hover:bg-blue-700` - Interactions
- `grid grid-cols-2 gap-4` - Layouts

### Tailwind Configuration
- Located in `tailwind.config.js`
- Custom theme colors
- Responsive breakpoints

## Forms & Validation

Client-side validation:
- Email format checking
- Required field validation
- File type validation (PDF/DOCX only)
- Password strength suggestions

## State Management

Uses React Context API for:
- **AuthContext**: User authentication state
- **Local State**: Component-specific data

## Error Handling

All API calls include:
- Try/catch blocks
- Error messages displayed in UI
- Loading states for async operations

## Performance Optimizations

- Lazy loading of pages via React Router
- Memoization of components where needed
- Efficient API calls
- Local storage for auth token

## Development

### Hot Reload
Changes to files automatically refresh the browser

### Browser DevTools
React Developer Tools extension recommended for debugging

### Testing
```bash
npm test
```

## Build for Production

```bash
npm run build
# Creates optimized build in 'build/' directory
```

Deploy the `build/` folder to any static hosting:
- Vercel
- Netlify
- AWS S3 + CloudFront
- GitHub Pages

## Environment Variables

```
REACT_APP_API_URL    API backend URL (default: http://localhost:5000/api)
```

## Common Issues

### CORS Errors
- Ensure backend has CORS enabled
- Check API_URL matches backend domain
- Verify backend is running

### Authentication Loop
- Check token is being saved to localStorage
- Verify JWT_SECRET on backend
- Check token expiration time

### Form Not Submitting
- Verify backend API is accessible
- Check network tab in DevTools
- Ensure required fields are filled

### Styling Not Applied
- Run `npm install` to ensure all CSS packages are present
- Check `tailwind.config.js` content paths
- Clear browser cache (Ctrl+Shift+Delete)

## Next Steps

1. Add Toast notifications for actions
2. Implement input validation library (React Hook Form)
3. Add pagination component
4. Create reusable form components
5. Add loading skeletons
6. Implement search debouncing
7. Add CSV export for dashboards
