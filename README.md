# SevaSetu

## Project overview
SevaSetu is a service marketplace where **customers** can book **providers**, and **providers** manage jobs (quoting, accepting, completing with work notes and before/after uploads). The platform supports role-based authentication and **admin moderation**.

Tech stack:
- **Frontend:** React + TypeScript + Vite
- **UI:** shadcn/ui + Tailwind
- **Data fetching:** TanStack Query v5 + Axios
- **Backend:** Express + Bun + Mongoose (MongoDB)
- **Media uploads:** Cloudinary (via multer)

## Features implemented
- **Authentication & roles**
  - Register / login with JWT
  - Role-based access control for `customer`, `provider`
  - Admin-only routes for moderation and approvals
- **Customer capabilities**
  - Create bookings (supports an attachment upload)
  - View “my bookings”
  - Reschedule, cancel, and confirm quoted bookings
  - View booking details by id
- **Provider capabilities**
  - Browse available providers (public)
  - Provider profile onboarding (upload up to 5 documents to Cloudinary)
  - Update provider profile and toggle availability
  - View incoming jobs
  - Quote or reject jobs
  - Start a job and complete it
  - Upload **before/after** work files (up to 5 each) and submit/update work notes
- **Service categories**
  - Public categories browsing (for discovery)
  - Admin CRUD for categories
- **Reviews**
  - Customers can submit reviews for providers
  - Customers can browse provider reviews
  - Admin review moderation
- **Admin panel**
  - Approve/reject pending providers
  - Deactivate users
  - Moderate reviews

## Setup instructions
### Prerequisites
- **MongoDB** running locally (or provide a remote connection string)
- **Bun** installed
- **Cloudinary** account (for media uploads)

### Backend (API)
1. Go to `backend/`:
   ```bash
   cd backend
   ```
2. Create your environment file:
   ```bash
   cp .env.example .env
   ```
3. Update required variables in `backend/.env`:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
4. Install dependencies and run the server:
   ```bash
   bun install
   bun run dev
   ```
5. Health check:
   - `GET /health`

### Frontend (Web UI)
1. Go to `frontend/`:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   bun install
   ```
3. Create `frontend/.env`:
   ```bash
   cat > .env <<'EOF'
   VITE_API_URL=http://localhost:3000/api/v1
   EOF
   ```
4. Start the frontend:
   ```bash
   bun run dev
   ```
5. Open the app in your browser (typically `http://localhost:5173`).

### Roles to use while testing
- **Register** a `customer` or `provider` account (the UI only supports these roles).
- Create an **admin** user separately (admin routes like provider approval and review moderation require a user with `role: "admin"`).

## Deployment link
Deployment link: https://sevasetu-five.vercel.app/

