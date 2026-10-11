# Fixes Applied & System Status

## Issues Diagnosed & Resolved

1. **Missing JWT & Environment Properties in `application.properties`**:
   - **Root Cause**: Backend threw `java.lang.IllegalArgumentException: Could not resolve placeholder 'app.jwt.secret' in value "${app.jwt.secret}"` because neither `app.jwt.secret` nor `app.jwt.expiration-ms` were configured with default fallbacks in `application.properties`.
   - **Fix**: Added default fallback configurations (`${JWT_SECRET:...}` and `${JWT_EXPIRATION_MS:...}`) in [application.properties](file:///C:/Users/Hemanth%20Naidu/Desktop/Personal-Expense-Management-System-Java/backend/src/main/resources/application.properties).

2. **Database Credentials & Database Name**:
   - **Root Cause**: `application.properties` was pointing to database `expensemanagement` with hardcoded placeholder password `YOUR_MYSQL_PASSWORD`, whereas MySQL schema is `personal_expense_management` with local password `root`.
   - **Fix**: Updated `application.properties` with fallback defaults for URL, username (`root`), and password (`root`), so Spring Boot runs out of the box without manual environment setup. Also updated `START-BACKEND-WINDOWS.ps1`.

3. **Missing Spring Security CORS & Preflight Handling**:
   - **Root Cause**: Vite frontend runs on `http://localhost:5173` while backend runs on `http://localhost:8080`. Spring Security had `.cors(x -> {})` without a `CorsConfigurationSource` bean and blocked preflight `OPTIONS` requests, causing browser CORS failures.
   - **Fix**: Added `CorsConfigurationSource` bean in [SecurityConfig.java](file:///C:/Users/Hemanth%20Naidu/Desktop/Personal-Expense-Management-System-Java/backend/src/main/java/com/faraz/expensemanagement/security/SecurityConfig.java), permitted `OPTIONS` requests in `authorizeHttpRequests`, and bypassed JWT filter on `OPTIONS` calls.

4. **Entity Serialization Security & Stability**:
   - **Root Cause**: Entity models (`Transaction`, `Category`, `Budget`) exposed `user` references, which could leak hashed user passwords or cause infinite loops during Jackson serialization.
   - **Fix**: Marked `user` fields with `@JsonIgnore` and user `password` with `@JsonProperty(access = WRITE_ONLY)`.

5. **Monthly Calculation & Null Safety in AppService**:
   - **Root Cause**: `summary()` only queried from the 1st day of the month up to `LocalDate.now()`, missing future/scheduled transactions within the current month, and risked NPEs if SQL sums returned null.
   - **Fix**: Sums now query the entire current calendar month (`startOfMonth` to `endOfMonth`) with null-safe zero fallbacks.

6. **Frontend Usability & Page Implementation**:
   - **Root Cause**: Profile, Settings, Reports, Categories, and Budgets had placeholder stubs or lacked functional creation interfaces in the UI.
   - **Fix**: Rebuilt [main.jsx](file:///C:/Users/Hemanth%20Naidu/Desktop/Personal-Expense-Management-System-Java/frontend/src/main.jsx) to include fully functional Category and Budget creation forms, a dynamic Financial Reports overview, User Profile details, Settings panel, registration success alerts, and React key optimizations.

---

## Service URLs

- **Frontend (Vite + React)**: [http://localhost:5173](http://localhost:5173)
- **Backend (Spring Boot 3 + Tomcat)**: [http://localhost:8080](http://localhost:8080)
- **Database (MySQL 8.0)**: `localhost:3306/personal_expense_management`
