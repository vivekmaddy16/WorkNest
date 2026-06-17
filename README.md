# WorkNest – MERN Stack Job Portal

WorkNest is a premium, full-featured MERN (MongoDB, Express, React, Node) job portal designed to connect talented professionals with top hiring companies. It features an interactive job board, applicant/employer dashboard flow, role-based JWT authentication, and a smart AI Recruiter assistant.

## Features

- **Dynamic Job Board**: Browse, search, and category-sort job listings in real-time.
- **Detailed Openings**: Full descriptions, salary information, and single-click application portal.
- **Employer Control Panel**: Publish new job listings and manage applicant pipelines (Applied, Shortlisted, Interviewing, Hired, Rejected).
- **Candidate Control Panel**: Track submitted applications and status updates in real-time.
- **AI Recruiter Assistant**: Floating smart recruiter chatbot matching user query criteria with database jobs and explaining platform guides.
- **Seeded DB Environment**: Automatically seeds mock jobs (Google, Amazon, Flipkart, BharatPe) and an employer user on first run if the database is empty.

---

## Directory Structure

```text
WorkNest/
├── backend/                  # Node/Express API Server
│   ├── config/               # Database connection
│   ├── controllers/          # Request handlers
│   ├── middleware/           # JWT & authorization middlewares
│   ├── models/               # MongoDB Mongoose schemas
│   ├── routes/               # API endpoint routing
│   └── server.js             # Main server entrypoint
│
└── frontend/                 # Vite React Client SPA
    ├── src/
    │   ├── components/       # Global Layout & AIRecruiter chat drawer
    │   ├── pages/            # Home, Listings, Details, Auth, & Dashboards
    │   ├── utils/            # Axios API client wrapper
    │   ├── App.jsx           # React Router and authentication state
    │   └── index.css         # Premium CSS stylesheet
    └── index.html            # Vite HTML template entrypoint
```

---

## Getting Started

### Prerequisites
- Node.js (v16+)
- MongoDB running locally (or MongoDB Atlas URI)

### 1. Setup Backend
1. Go to the `backend/` directory.
2. The environment variables are set in `.env` (pre-configured to run on port `5000` with local MongoDB `mongodb://localhost:27017/worknest`).
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the backend server in development mode:
   ```bash
   npm run dev
   ```
   *Note: On startup, the database will be seeded with default job postings if it is empty.*

### 2. Setup Frontend
1. Go to the `frontend/` directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Open the displayed URL (typically `http://localhost:5173`) in your browser.

---

## Seed Accounts (For Testing)
- **Employer Account (Automatic Seed)**:
  - **Email**: `admin@worknest.com`
  - **Password**: `adminpassword123`
- **Candidate Account**:
  - Simply register a new account on the register page with "Job Candidate" selected.
