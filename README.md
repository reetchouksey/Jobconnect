# JobConnect — Modern Job Portal

A production-ready, fully responsive **Job Portal** built with **React 19**, **Redux Toolkit**, **React Router v7**, and **Tailwind CSS**. Browse jobs, apply, save favorites, manage your profile, and post jobs as a recruiter — all with a polished dark-mode UI and persistent local state.

> Demo data is pre-seeded with 20+ realistic jobs from companies like Google, Stripe, Apple and more, so you can explore every feature out of the box.

---

## Features

### Candidate
- Hero search with location filter
- Browse paginated job listings with debounced search & advanced filters (job type, experience, salary range)
- Sort by recency, salary or company
- Job details page with skills, requirements, responsibilities and similar jobs
- One-click **Apply** modal with form validation, resume upload (file metadata) and cover letter
- **Save** jobs and **Apply** with state persisted in Redux + LocalStorage
- **Application Tracker**: see and update status (Submitted, Interviewing, Offered…)
- **Recently Viewed** & **Search History** modules
- Personal **Profile** with skills, experience, education and resume — including a profile completeness meter

### Recruiter
- Recruiter Dashboard with stats (job count, applicants, trending posts)
- **Post / Edit / Delete** jobs with full validation
- **View Applicants** page with status updates and contact info

### UI / UX
- Modern, professional design system (Tailwind + custom theme)
- **Dark / Light mode** with system preference + persistence
- Sidebar navigation, sticky top navbar with global search and user menu
- Reusable components: `Button`, `Input`, `Textarea`, `Modal`, `StatCard`, `Badge`, `EmptyState`, `Pagination`, `JobCard`, `FilterPanel`
- Loading **skeletons**, **toast notifications** (`react-hot-toast`), animated transitions
- Mobile-first responsive layout with off-canvas filter drawer
- Code splitting via `React.lazy` per route
- Global **Error Boundary**

### State Management — Redux Toolkit
- `authSlice` — login, register, logout, profile updates (async thunks)
- `jobsSlice` — fetch / add / update / delete jobs (async thunks)
- `filterSlice` — search, location, company, job types, experience, salary, sort, search history
- `savedJobsSlice` — bookmark / remove
- `appliedJobsSlice` — apply, status updates, withdraw
- `themeSlice` — dark / light mode
- `recentSlice` — recently viewed jobs

All persisted to `localStorage` via a `storage` helper.

---

## Tech Stack

| Layer | Technology |
| --- | --- |
| Build Tool | Vite 6 |
| UI | React 19, Tailwind CSS 3 |
| State | Redux Toolkit 2, react-redux 9 |
| Routing | React Router DOM 7 (lazy-loaded routes) |
| Notifications | react-hot-toast |
| Icons | lucide-react |
| Linting | ESLint 9 (flat config) |
| Persistence | Browser LocalStorage |

---

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Start dev server (http://localhost:5173)
npm run dev

# 3. Production build
npm run build

# 4. Preview build locally
npm run preview

# 5. Lint
npm run lint
```

> **First run:** the app seeds 20+ demo jobs into `localStorage`. Sign up to create a local account (no backend required).

---

## Folder Structure

```
src/
├── App.jsx
├── main.jsx
├── index.css
├── assets/
├── components/
│   ├── ErrorBoundary.jsx
│   ├── ProtectedRoute.jsx
│   ├── jobs/        # JobCard, JobCardSkeleton, FilterPanel, ApplyJobModal, CompanyLogo
│   ├── layout/      # Layout, Navbar, Sidebar, Footer, Logo
│   └── ui/          # Button, Input, Textarea, Modal, StatCard, Badge, EmptyState, Pagination, PageLoader
├── pages/           # Home, Jobs, JobDetails, SavedJobs, AppliedJobs, Profile, Recruiter, PostJob, Applicants, Login, Signup, NotFound
├── redux/
│   ├── store.js
│   ├── authSlice.js
│   ├── jobsSlice.js
│   ├── filterSlice.js
│   ├── savedJobsSlice.js
│   ├── appliedJobsSlice.js
│   ├── themeSlice.js
│   └── recentSlice.js
├── routes/
│   └── AppRoutes.jsx
├── services/
│   ├── api.js          # Mock API backed by LocalStorage
│   └── mockData.js     # 20+ seeded jobs and companies
├── hooks/
│   ├── useDebounce.js
│   ├── useTheme.js
│   └── useFilteredJobs.js
└── utils/
    ├── helpers.js
    ├── storage.js
    └── validators.js
```

---

## Routes

| Path | Description | Auth |
| --- | --- | --- |
| `/` | Dashboard with stats, trending, recommended, top companies | Public |
| `/jobs` | Browse all jobs with filters and pagination | Public |
| `/jobs/:id` | Job detail page | Public |
| `/saved` | Saved jobs | Public (per-browser) |
| `/applied` | Application tracker | Public (per-browser) |
| `/profile` | User profile | **Protected** |
| `/recruiter` | Recruiter dashboard | **Protected** |
| `/recruiter/post` | Post a new job | **Protected** |
| `/recruiter/edit/:id` | Edit a job | **Protected** |
| `/recruiter/applicants/:id` | View applicants for a job | **Protected** |
| `/login`, `/signup` | Auth pages | Public |
| `*` | 404 | Public |

---

## Notes

- **Backend-free**: this build uses LocalStorage as a mock backend. Replace `src/services/api.js` with HTTP calls (e.g. JSON Server or a real API) without touching the rest of the app.
- **Resume uploads**: only the file name is stored (not the binary). Wire to a real upload endpoint when integrating a backend.
- **Error Boundary** catches render errors and offers a recovery button.
- **Code splitting**: every page is lazy-loaded for fast initial loads.

---

## License

MIT — feel free to use this as a starter for your own job board.
