# Personal Expense Management System Java

Complete React/Vite + Spring Boot 3 + MySQL personal finance app. Includes BCrypt registration, JWT login, protected backend ownership checks, dashboard summaries/charts, transaction CRUD, categories, budgets, reports, profile, settings, validation, responsive UI, and setup scripts.

## Run
1. Run `database.sql` in MySQL Workbench.
2. Backend: `cd backend`, set `DB_URL`, `DB_USERNAME`, `DB_PASSWORD`, `JWT_SECRET`, `CORS_ORIGIN=http://localhost:5173`, then `mvn spring-boot:run`.
3. Frontend: `cd frontend`, copy `.env.example` to `.env`, run `npm install`, then `npm run dev`.
4. Open `http://localhost:5173`, register, and log in. Valid login immediately navigates to `/dashboard`; refresh restores the session.

Java 21, Maven 3.9+, Node 20+, MySQL 8+. Backend is port 8080, frontend 5173. Never commit real secrets. Production should use HTTPS and secure HTTP-only cookies instead of localStorage.

APIs: `/api/auth/register`, `/login`, `/me`; `/api/dashboard/*`; `/api/transactions`; `/api/categories`; `/api/budgets`; `/api/reports/*`; `/api/users/me`. All private records are selected by the authenticated Spring Security principal, never a supplied user id.

Windows PowerShell example:
```powershell
$env:DB_PASSWORD='your-password'; $env:JWT_SECRET='a-long-secret-at-least-32-characters'; cd backend; mvn spring-boot:run
cd ../frontend; Copy-Item .env.example .env; npm install; npm run dev
```
