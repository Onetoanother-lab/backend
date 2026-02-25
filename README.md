# Uzbekneftegaz Admin Panel

A production-grade React + Vite admin interface with Redux state management, Tailwind CSS styling, and full API integration with the Uzbekneftegaz backend.

---

## ✨ Features

- **Secure Login** — JWT Bearer token authentication via Redux + localStorage persistence
- **Post News** — Rich form with image upload, category, language, publish toggle
- **Manage Posts** — Table view with inline Edit and Delete modals
- **API Explorer** — Interactive endpoint tester with live request/response panel
- **Error Handling** — Toast notifications + inline alerts for all API states
- **Protected Routes** — Auto-redirect to login when unauthenticated
- **Responsive Sidebar** — Collapsible navigation with animated transitions

---

## 🚀 Quick Start

```bash
# 1. Clone / unzip the project
cd uzbekneftegaz-admin

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Open in browser
http://localhost:5173
```

---

## 📁 Project Structure

```
src/
├── components/
│   ├── DashboardLayout.jsx   # Persistent layout with sticky header
│   ├── ProtectedRoute.jsx    # Auth guard for private routes
│   ├── Sidebar.jsx           # Collapsible nav with user info
│   └── UI.jsx                # Reusable: Spinner, Badge, Modal, StatCard, etc.
│
├── hooks/
│   └── useApi.js             # useApiCall, useForm, useFetch custom hooks
│
├── pages/
│   ├── LoginPage.jsx         # Admin sign-in form
│   ├── DashboardPage.jsx     # Overview with stats & quick actions
│   ├── PostNewsPage.jsx      # Create news/announcements
│   ├── ManagePostsPage.jsx   # CRUD table for existing posts
│   └── ApiExplorerPage.jsx   # Interactive API tester
│
├── services/
│   └── api.js                # Axios instance + Auth/News/Resource APIs
│
├── store/
│   ├── store.js              # Redux configureStore
│   └── slices/
│       └── authSlice.js      # Login thunk, token persistence, selectors
│
├── App.jsx                   # React Router routes
├── main.jsx                  # Entry point with Provider + Toaster
└── index.css                 # Tailwind directives + custom components
```

---

## 🔐 Authentication Flow

```
User submits login form
        ↓
loginAdmin thunk (Redux) → POST /api/auth/login
        ↓
On success: store token in Redux state + localStorage
        ↓
All subsequent API calls attach: Authorization: Bearer <token>
        ↓
On 401 response: auto-clear token, redirect to /login
        ↓
On logout: clear Redux state + localStorage
```

### Redux Auth Slice — Key Exports

| Export | Type | Description |
|--------|------|-------------|
| `loginAdmin` | AsyncThunk | Dispatches login API call |
| `logoutAdmin` | AsyncThunk | Clears auth state + storage |
| `clearError` | Action | Resets error state |
| `setCredentials` | Action | Manual token injection |
| `selectIsAuthenticated` | Selector | Boolean auth check |
| `selectToken` | Selector | Raw JWT token |
| `selectCurrentUser` | Selector | User object |

---

## 🌐 API Configuration

**Base URL:** `https://uzbekneftegaz-backend.onrender.com`  
**Docs:** `https://uzbekneftegaz-backend.onrender.com/api-docs`

### Configured Endpoints

```js
// Auth
POST /api/auth/login      → { token, user }
POST /api/auth/register

// News / Posts
GET    /api/news          → list with pagination
GET    /api/news/:id      → single post
POST   /api/news          → create (multipart/form-data for images)
PUT    /api/news/:id      → update
DELETE /api/news/:id      → delete
```

### Adding New Resource Endpoints

```js
// src/services/api.js
import { createResourceAPI } from './api'

export const productsAPI = createResourceAPI('/api/products')
// Automatically gets: getAll, getById, create, update, delete
```

---

## 🪝 Custom Hooks

### `useApiCall(apiFn)`
Wraps any API function with loading/error/data state:
```jsx
const { execute, loading, error, data } = useApiCall(newsAPI.create)
const result = await execute(payload)
// result = { success: true, data } | { success: false, error }
```

### `useForm(initialValues)`
Manages form state with change handler and reset:
```jsx
const { values, handleChange, reset } = useForm({ title: '', content: '' })
<input name="title" value={values.title} onChange={handleChange} />
```

---

## 🎨 Design System

### CSS Classes (defined in `index.css`)

| Class | Usage |
|-------|-------|
| `.glass-card` | Frosted glass panel |
| `.input-field` | Dark styled form input |
| `.label` | Uppercase mono label |
| `.btn-primary` | Blue CTA button |
| `.btn-secondary` | Subtle secondary button |
| `.btn-danger` | Red destructive button |
| `.sidebar-link` | Nav link with active state |
| `.status-badge` | Compact status chip |

### Color Tokens
- `petroleum-*` — Primary blue (brand color)
- `amber-*` — Warning / accent
- `slate-850/900/950` — Dark background layers

---

## 🔧 Adapting to the Actual API

If the backend uses different endpoint paths, update `src/services/api.js`:

```js
// Change these paths to match the actual API structure:
export const newsAPI = {
  getAll: () => apiClient.get('/api/articles'),   // or /api/posts
  create: (data) => apiClient.post('/api/articles', data),
  // ...
}
```

If login returns a different response shape:
```js
// authSlice.js - in loginAdmin.fulfilled handler:
state.token = action.payload.accessToken  // adjust field name
state.user = action.payload.admin         // adjust field name
```

---

## 📦 Build for Production

```bash
npm run build
# Output: dist/ folder ready for deployment
```

Deploy to Vercel, Netlify, or any static host.

---

## 🛠 Tech Stack

| Tool | Version | Purpose |
|------|---------|---------|
| React | 18 | UI framework |
| Vite | 5 | Build tool |
| Redux Toolkit | 2 | State management |
| React Router | 6 | Client routing |
| Axios | 1.6 | HTTP client |
| Tailwind CSS | 3.4 | Styling |
| react-hot-toast | 2.4 | Notifications |
