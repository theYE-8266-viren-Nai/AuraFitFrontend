# Gym Management System - React Frontend

A modern React + TypeScript frontend application for the Gym Management System, styled with Tailwind CSS and using Axios for API communication.

## Features

- 🔐 **Authentication**: Login/Register with JWT tokens
- 👥 **Role-Based Access**: Admin, Trainer, and Member dashboards
- 📊 **Real-time Data**: Attendance tracking, payment management
- 💪 **Workout Plans**: Trainer-member workout plan management
- 💳 **Payment Processing**: Track membership payments
- 📱 **Responsive Design**: Mobile-first design with Tailwind CSS

## Tech Stack

- **React 18** with TypeScript
- **React Router** for navigation
- **Axios** for API calls
- **Tailwind CSS** for styling
- **Vite** for build tooling
- **Context API** for state management

## Prerequisites

- Node.js 18+ and npm/yarn
- Laravel backend running on `http://localhost:8000`

## Installation

1. **Clone the repository** (if not already done)

2. **Install dependencies**:
```bash
npm install
```

3. **Configure environment variables**:
```bash
cp .env.example .env
```

Edit `.env` and set your API URL:
```
VITE_API_URL=http://localhost:8000/api
```

4. **Start the development server**:
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## Project Structure

```
src/
├── components/
│   ├── dashboards/
│   │   ├── AdminDashboard.tsx      # Admin dashboard view
│   │   ├── MemberDashboard.tsx     # Member dashboard view
│   │   └── TrainerDashboard.tsx    # Trainer dashboard view
│   └── ProtectedRoute.tsx          # Route protection component
├── contexts/
│   └── AuthContext.tsx             # Authentication context
├── lib/
│   └── axios.ts                    # Axios configuration
├── pages/
│   ├── Dashboard.tsx               # Main dashboard router
│   ├── Login.tsx                   # Login page
│   └── Register.tsx                # Registration page
├── services/
│   ├── authApi.ts                  # Auth API service
│   ├── attendanceApi.ts            # Attendance API service
│   ├── membersApi.ts               # Members API service
│   ├── membershipsApi.ts           # Memberships API service
│   ├── paymentsApi.ts              # Payments API service
│   └── workoutPlansApi.ts          # Workout plans API service
├── types/
│   └── index.ts                    # TypeScript type definitions
├── App.tsx                         # Main app component
├── main.tsx                        # Entry point
└── index.css                       # Global styles
```

## API Services

Each API service corresponds to a Laravel controller:

### Auth API (`authApi.ts`)
- `register(data)` - Register new user
- `login(data)` - Login user
- `logout()` - Logout user
- `me()` - Get current user

### Members API (`membersApi.ts`)
- `getAll()` - Get all members (Admin)
- `create(data)` - Create member (Admin)
- `getById(id)` - Get member details (Admin)
- `update(id, data)` - Update member (Admin)
- `delete(id)` - Delete member (Admin)
- `getProfile()` - Get own profile (Member)

### Memberships API (`membershipsApi.ts`)
- `getAll()` - Get all memberships
- `create(data)` - Create membership
- `getById(id)` - Get membership details
- `update(id, data)` - Update membership
- `delete(id)` - Delete membership
- `getStatus()` - Get membership status (Member)

### Payments API (`paymentsApi.ts`)
- `getAll()` - Get all payments
- `create(data)` - Create payment
- `getById(id)` - Get payment details
- `generateReceipt(id)` - Generate receipt
- `myPayments()` - Get own payments (Member)

### Attendance API (`attendanceApi.ts`)
- `getAll()` - Get all attendance (Admin/Trainer)
- `create(data)` - Create attendance (Admin)
- `update(id, data)` - Update attendance
- `markAttendance()` - Check in/out (Member)
- `myAttendance()` - Get own attendance (Member)

### Workout Plans API (`workoutPlansApi.ts`)
- `getAll()` - Get all plans (Trainer filtered)
- `create(data)` - Create plan (Trainer)
- `getById(id)` - Get plan details
- `update(id, data)` - Update plan (Trainer)
- `delete(id)` - Delete plan
- `myPlans()` - Get own plans (Member)

## Authentication Flow

1. User logs in via `/login`
2. JWT token stored in `localStorage`
3. Axios interceptor adds token to all requests
4. `AuthContext` manages user state
5. `ProtectedRoute` guards authenticated routes
6. Role-based dashboard rendering

## Key Features

### Member Dashboard
- View membership status
- Mark attendance (check in/out)
- View workout plans
- View payment history

### Trainer Dashboard
- View assigned clients
- Create/edit workout plans
- Track client progress

### Admin Dashboard
- View all members
- Track attendance
- Monitor payments
- Manage memberships

## Build for Production

```bash
npm run build
```

This creates an optimized production build in the `dist/` folder.

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `http://localhost:8000/api` |

## CORS Configuration

Make sure your Laravel backend has CORS properly configured. Add to `config/cors.php`:

```php
'paths' => ['api/*', 'sanctum/csrf-cookie'],
'allowed_origins' => ['http://localhost:3000'],
'supports_credentials' => true,
```

## Laravel Sanctum Setup

Ensure your `.env` has:
```
SANCTUM_STATEFUL_DOMAINS=localhost:3000,127.0.0.1:3000
SESSION_DOMAIN=localhost
```

## Troubleshooting

### CORS Errors
- Check Laravel CORS configuration
- Verify `SANCTUM_STATEFUL_DOMAINS` in `.env`
- Ensure `withCredentials: true` in axios config

### 401 Unauthorized
- Check if token is stored in localStorage
- Verify API URL is correct
- Check Laravel backend is running

### Network Errors
- Verify backend is running on port 8000
- Check API URL in `.env`
- Ensure proxy is configured in `vite.config.ts`

## License

MIT
