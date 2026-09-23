# School Grading Management

A Next.js 16 application for managing school grading workflows with login, role-based dashboards, and grade reporting.

## Live Demo

The application is deployed on Vercel and can be accessed here:

[**Student Grading System**](https://studentgradesystem.vercel.app)

### Test Login

Use the following credentials to test the application:

- **Username:** `admin`
- **Password:** `admin123`

### Landing Page(Login)
![Login](https://raw.githubusercontent.com/zkLeonora/Student-Grading-System/main/public/login.png)

## Project Summary

This app is built for school administration with two main roles:

- `admin` — manages teachers, students, and grade reports
- `guru` — manages student grades and views reports

The root `app/page.tsx` redirects directly to the `/login` page.

## Key Features

- Role-based authentication for `admin` and `guru`
- Secure login using `bcrypt` encrypted passwords
- MySQL database connection using `mysql2`
- Next.js API routes under `app/api`
- Modern Tailwind CSS layout with React components
- App Router-based navigation and page structure

## Workspace Structure

- `app/`
  - `login/page.tsx` — user login page
  - `admin/` — admin dashboard and management pages
  - `guru/` — teacher dashboard and grade management pages
  - `api/` — backend endpoints for login, logout, and data operations
- `lib/db.ts` — MySQL connection pool configuration
- `public/` — static assets such as logos or images
- `app/globals.css` — global styling
- `next.config.ts` — Next.js configuration
- `eslint.config.mjs` — linting configuration

## Tech Stack

- Next.js `16.2.7`
- React `19.2.4`
- TypeScript `^5`
- Tailwind CSS `^4`
- MySQL (`mysql2`)
- Bcrypt for password hashing
- Lucide React for icons

## Installation

1. Install dependencies:

```bash
npm install
```

2. Set up your MySQL database.

The current database configuration is in `lib/db.ts`:

- `host`: `localhost`
- `user`: `root`
- `password`: `xxx` Use your MySQL password
- `port`: `3307`
- `database`: `xxx` Use your database name

3. Run the development server:

```bash
npm run dev
```

4. Open the application in the browser:

```text
http://localhost:3000
```

## Usage Flow

- Open `http://localhost:3000`
- Log in using the login page
- After login, the app shows a dashboard based on the user role

### Admin Pages

- `/admin/dashboard`
- `/admin/kelola-guru`
- `/admin/kelola-siswa`
- `/admin/laporan-nilai`

### Teacher Pages

- `/guru/dashboard`
- `/guru/kelola-nilai`
- `/guru/laporan-nilai`

## Important API Endpoints

- `POST /api/login` — authenticate user and set session cookies
- `POST /api/logout` — remove session cookies
- `GET /api/admin/...` — admin data operations
- `GET /api/guru/...` — teacher data operations

## Final Grade Calculation
This system uses a weighted final grade formula as follows:

- Assignment Grade: 30%
- Midterm Exam (UTS): 30%
- Final Exam (UAS): 40%

### Formula:

```text
Final Grade = (Assignment × 0.3) + (UTS × 0.3) + (UAS × 0.4)
```

### Example Calculation:

```text
Assignment = 80
UTS        = 90
UAS        = 100
Final Grade = (80 × 0.3) + (90 × 0.3) + (100 × 0.4)
            = 24 + 27 + 40
            = 91
```

The final value is stored in the `nilai` table in the `nilai_akhir` column and is used to determine the student graduation status.

## Development Commands

- `npm run dev` — start development mode
- `npm run build` — build the app for production
- `npm run start` — run the production server
- `npm run lint` — run ESLint checks

## Notes

- The current database configuration is hard-coded in code. For production, move it to environment variables.
- The `/api/login` endpoint stores `session_user` and `session_role` cookies for authentication.
- Ensure your MySQL database schema includes the `users`, `guru`, `siswa`, and `nilai` tables.

## License

This repository does not currently specify a license.

