# React + TypeScript + Axios Setup Guide for Laravel Gym Management API

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env
```

Edit `.env`:
```
VITE_API_URL=http://localhost:8000/api
```

### 3. Start Development Server
```bash
npm run dev
```

Visit `http://localhost:3000`

---

## 📁 Project Structure Overview

```
src/
├── components/
│   ├── dashboards/           # Role-specific dashboard components
│   │   ├── AdminDashboard.tsx
│   │   ├── MemberDashboard.tsx
│   │   └── TrainerDashboard.tsx
│   └── ProtectedRoute.tsx    # Authentication guard
│
├── contexts/
│   └── AuthContext.tsx       # Global auth state management
│
├── hooks/
│   └── useApi.ts            # Custom hooks for API calls
│
├── lib/
│   └── axios.ts             # Axios instance with interceptors
│
├── pages/
│   ├── Dashboard.tsx        # Main dashboard router
│   ├── Login.tsx           # Login page
│   ├── Register.tsx        # Registration page
│   └── MembersManagement.tsx # Example CRUD page
│
├── services/              # API service layers
│   ├── authApi.ts        # Authentication endpoints
│   ├── attendanceApi.ts  # Attendance endpoints
│   ├── membersApi.ts     # Members endpoints
│   ├── membershipsApi.ts # Memberships endpoints
│   ├── paymentsApi.ts    # Payments endpoints
│   └── workoutPlansApi.ts # Workout plans endpoints
│
├── types/
│   └── index.ts          # TypeScript type definitions
│
├── App.tsx              # Main app with routing
├── main.tsx            # Entry point
└── index.css          # Tailwind CSS imports
```

---

## 🔌 API Integration

### Authentication Flow

```typescript
// Login
import { useAuth } from '../contexts/AuthContext';

const { login } = useAuth();
await login(email, password);
// Token automatically stored in localStorage
// Axios interceptor adds to all requests
```

### Making API Calls

#### Option 1: Direct Service Call
```typescript
import { membersApi } from '../services/membersApi';

// Get all members
const members = await membersApi.getAll();

// Create member
const newMember = await membersApi.create({
  username: 'john_doe',
  email: 'john@example.com',
  password: 'password123',
  name: 'John Doe',
  age: 25,
  gender: 'male',
  phone: '1234567890'
});
```

#### Option 2: Using Custom Hooks
```typescript
import { useApi, useMutation } from '../hooks/useApi';
import { membersApi } from '../services/membersApi';

function MyComponent() {
  // Fetch data
  const { data, isLoading, error, refetch } = useApi(() => 
    membersApi.getAll()
  );
  
  // Mutations
  const { mutate: createMember } = useMutation(membersApi.create);
  
  const handleCreate = async (formData) => {
    await createMember(formData);
    refetch(); // Reload list
  };
  
  return (
    // Your JSX
  );
}
```

---

## 📋 API Endpoints Mapped

### Auth Endpoints
| Method | Endpoint | Service Method | Description |
|--------|----------|----------------|-------------|
| POST | `/register` | `authApi.register()` | Register new user |
| POST | `/login` | `authApi.login()` | Login user |
| POST | `/logout` | `authApi.logout()` | Logout user |
| GET | `/me` | `authApi.me()` | Get current user |

### Members Endpoints
| Method | Endpoint | Service Method | Auth Required | Role |
|--------|----------|----------------|---------------|------|
| GET | `/members` | `membersApi.getAll()` | ✅ | Admin |
| POST | `/members` | `membersApi.create()` | ✅ | Admin |
| GET | `/members/profile` | `membersApi.getProfile()` | ✅ | Member |
| GET | `/members/{id}` | `membersApi.getById(id)` | ✅ | Admin |
| PUT | `/members/{id}` | `membersApi.update(id, data)` | ✅ | Admin |
| DELETE | `/members/{id}` | `membersApi.delete(id)` | ✅ | Admin |

### Memberships Endpoints
| Method | Endpoint | Service Method | Auth Required |
|--------|----------|----------------|---------------|
| GET | `/memberships` | `membershipsApi.getAll()` | ✅ |
| POST | `/memberships` | `membershipsApi.create()` | ✅ |
| GET | `/memberships/status` | `membershipsApi.getStatus()` | ✅ |
| GET | `/memberships/{id}` | `membershipsApi.getById(id)` | ✅ |
| PUT | `/memberships/{id}` | `membershipsApi.update(id, data)` | ✅ |
| DELETE | `/memberships/{id}` | `membershipsApi.delete(id)` | ✅ |

### Payments Endpoints
| Method | Endpoint | Service Method | Auth Required |
|--------|----------|----------------|---------------|
| GET | `/payments` | `paymentsApi.getAll()` | ✅ |
| POST | `/payments` | `paymentsApi.create()` | ✅ |
| GET | `/payments/my-payments` | `paymentsApi.myPayments()` | ✅ |
| GET | `/payments/{id}` | `paymentsApi.getById(id)` | ✅ |
| GET | `/payments/{id}/receipt` | `paymentsApi.generateReceipt(id)` | ✅ |

### Attendance Endpoints
| Method | Endpoint | Service Method | Auth Required | Role |
|--------|----------|----------------|---------------|------|
| GET | `/attendance` | `attendanceApi.getAll()` | ✅ | Admin/Trainer |
| POST | `/attendance` | `attendanceApi.create()` | ✅ | Admin |
| POST | `/attendance/mark` | `attendanceApi.markAttendance()` | ✅ | Member |
| GET | `/attendance/my-attendance` | `attendanceApi.myAttendance()` | ✅ | Member |
| PUT | `/attendance/{id}` | `attendanceApi.update(id, data)` | ✅ | - |

### Workout Plans Endpoints
| Method | Endpoint | Service Method | Auth Required | Role |
|--------|----------|----------------|---------------|------|
| GET | `/workout-plans` | `workoutPlansApi.getAll()` | ✅ | Trainer |
| POST | `/workout-plans` | `workoutPlansApi.create()` | ✅ | Trainer |
| GET | `/workout-plans/my-plans` | `workoutPlansApi.myPlans()` | ✅ | Member |
| GET | `/workout-plans/{id}` | `workoutPlansApi.getById(id)` | ✅ | - |
| PUT | `/workout-plans/{id}` | `workoutPlansApi.update(id, data)` | ✅ | Trainer |
| DELETE | `/workout-plans/{id}` | `workoutPlansApi.delete(id)` | ✅ | - |

---

## 🎨 Tailwind CSS Usage

### Utility Classes Used
- **Layout**: `flex`, `grid`, `max-w-7xl`, `mx-auto`, `px-4`, `py-8`
- **Spacing**: `space-y-4`, `gap-6`, `mb-8`
- **Colors**: `bg-blue-600`, `text-white`, `border-gray-300`
- **Sizing**: `w-full`, `h-12`, `min-h-screen`
- **Typography**: `text-3xl`, `font-bold`, `text-center`
- **Effects**: `rounded-lg`, `shadow-md`, `hover:bg-blue-700`, `transition-colors`
- **Responsive**: `md:grid-cols-2`, `lg:grid-cols-3`, `sm:px-6`

### Custom Styling Example
```tsx
<button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50">
  Click Me
</button>
```

---

## 🔐 Authentication & Authorization

### Protecting Routes
```typescript
import { ProtectedRoute } from './components/ProtectedRoute';

<Route
  path="/admin"
  element={
    <ProtectedRoute allowedRoles={['admin']}>
      <AdminPage />
    </ProtectedRoute>
  }
/>
```

### Using Auth Context
```typescript
import { useAuth } from '../contexts/AuthContext';

function MyComponent() {
  const { user, isAuthenticated, logout } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return (
    <div>
      <p>Welcome, {user?.username}!</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

---

## 🛠️ TypeScript Types

All API responses are fully typed:

```typescript
import { Member, User, Attendance } from '../types';

const member: Member = {
  id: 1,
  user_id: 1,
  name: 'John Doe',
  age: 25,
  gender: 'male',
  phone: '1234567890',
  created_at: '2024-01-01',
  updated_at: '2024-01-01',
  user?: {
    id: 1,
    username: 'john_doe',
    email: 'john@example.com',
    role: 'member'
  }
};
```

---

## ⚙️ Environment Configuration

### Development
```env
VITE_API_URL=http://localhost:8000/api
```

### Production
```env
VITE_API_URL=https://api.yourdomain.com/api
```

---

## 🐛 Error Handling

### Global Error Handling (Axios Interceptor)
```typescript
// lib/axios.ts
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to login
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

### Component-Level Error Handling
```typescript
try {
  await membersApi.create(formData);
} catch (error: any) {
  const message = error.response?.data?.message || 'An error occurred';
  console.error(message);
  // Show error to user
}
```

---

## 📦 Build & Deployment

### Development Build
```bash
npm run dev
```

### Production Build
```bash
npm run build
# Output: dist/
```

### Preview Production Build
```bash
npm run preview
```

---

## 🔧 Common Tasks

### Add New API Endpoint

1. **Update types** (`src/types/index.ts`):
```typescript
export interface NewModel {
  id: number;
  name: string;
}
```

2. **Create service** (`src/services/newApi.ts`):
```typescript
import api from '../lib/axios';
import { NewModel } from '../types';

export const newApi = {
  getAll: async (): Promise<NewModel[]> => {
    const response = await api.get<NewModel[]>('/new-endpoint');
    return response.data;
  },
};
```

3. **Use in component**:
```typescript
import { useApi } from '../hooks/useApi';
import { newApi } from '../services/newApi';

const { data } = useApi(() => newApi.getAll());
```

### Add New Dashboard Feature

1. Create component in `src/components/`
2. Import in dashboard file
3. Add to appropriate role dashboard

---

## 🚨 Troubleshooting

### CORS Issues
- Verify Laravel `config/cors.php`
- Check `SANCTUM_STATEFUL_DOMAINS` in Laravel `.env`
- Ensure `withCredentials: true` in axios config

### 401 Errors
- Check token in localStorage
- Verify API URL is correct
- Ensure Laravel backend is running

### Build Errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
rm -rf node_modules/.vite
```

---

## 📚 Additional Resources

- [React Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [Axios Documentation](https://axios-http.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [Vite Documentation](https://vitejs.dev/)
- [React Router Documentation](https://reactrouter.com/)

---

## 📝 Notes

- All components use TypeScript for type safety
- Axios interceptors handle authentication automatically
- Protected routes guard against unauthorized access
- Role-based dashboards provide different views
- Tailwind CSS ensures consistent styling
- Custom hooks simplify data fetching
- Error handling is built-in at multiple levels

---

## ✅ Checklist

- [ ] Install dependencies
- [ ] Configure `.env` file
- [ ] Verify Laravel backend is running
- [ ] Start development server
- [ ] Test login/register
- [ ] Test API calls
- [ ] Check role-based access
- [ ] Verify attendance marking
- [ ] Test CRUD operations
- [ ] Build for production

---

**Happy Coding! 🎉**
