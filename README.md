# IsForecast

Full-stack weather forecasting application built with Angular and Node.js. The application provides current weather conditions, a 7-day forecast, detailed daily statistics, and interactive 24-hour charts.

**Live Demo:** [https://isforecast.onrender.com](https://isforecast.onrender.com) *(Note: Hosted on Render's free tier, may take up to 50 seconds to spin up after a period of inactivity)*.

## Tech Stack

### Frontend
*   **Framework:** Angular 20+ (Standalone components, Signals)
*   **UI/UX:** Angular Material, SCSS (Flexbox, Glassmorphism design)
*   **Charts:** Chart.js
*   **State Management:** Angular Signals (Shared State Service)
*   **Forms:** Reactive Forms

### Backend
*   **Runtime:** Node.js + TypeScript
*   **Framework:** Express.js
*   **Database:** SQLite + TypeORM (Caching layer with migrations)
*   **HTTP Client:** Axios + RxJS
*   **Architecture:** Clean Architecture (Controller -> Service -> Repository)

### Infrastructure & DevOps
*   **Containerization:** Docker (Multi-stage builds, Alpine Linux)
*   **Web Server:** Nginx (serving static files + reverse proxy)
*   **Process Manager:** Supervisor (inside the container)
*   **CI/CD:** GitHub Actions (Linters, Prettier) + Render (Automated Docker Deploy)
*   **External APIs:** Open-Meteo (Weather & Geocoding), BigDataCloud (Reverse Geocoding)

## Infrastructure Details

### Docker & Containerization
The application is packaged into a single Docker image for cost-effective deployment on PaaS (Render Free Tier).
*   **Multi-stage Build:** 
    1.  `frontend-builder`: Compiles the Angular app into static files.
    2.  `backend-builder`: Compiles TypeScript to JavaScript and resolves native dependencies (see below).
    3.  `production`: A lightweight Alpine image combining Nginx, Node.js, and Supervisor.
*   **Native Modules Fix:** The `better-sqlite3` package requires native C++ bindings. During the backend build stage, we install `python3`, `make`, and `g++`, and run `npm rebuild better-sqlite3`. This ensures the module is compiled specifically for the Alpine (musl libc) environment, preventing `ERR_DLOPEN_FAILED` errors.
*   **Process Management:** Supervisor runs both Nginx (port 80) and Node.js (port 3000) concurrently inside the container. Nginx proxies `/api` requests to `http://127.0.0.1:3000`.

### CI/CD Pipeline
*   **GitHub Actions (CI):** 
    *   Separate workflows for Frontend and Backend.
    *   Triggered on pushes to `develop` and `main`.
    *   Uses `npm ci` for deterministic installs and caches dependencies for faster runs.
    *   Runs `prettier --check` and `ng lint` / `eslint` to enforce code quality.
*   **Render (CD):**
    *   Connected to the `main` branch.
    *   Automatically builds the root `Dockerfile` and deploys the container upon every merge.
    *   Environment variables (`NODE_ENV=production`) are injected during runtime.

### Data & Caching Strategy
*   **SQLite Database:** Used as a caching layer to reduce latency and API calls to Open-Meteo. 
*   **Migrations:** TypeORM migrations run automatically on startup (`AppDataSource.runMigrations()`), ensuring the schema is always up-to-date.
*   **Ephemeral Storage:** On Render's free tier, the SQLite file is ephemeral (lost on restart). This is acceptable for a demo, as the cache is repopulated from the external API. In a production environment, a Persistent Disk or an external PostgreSQL database would be used.

## Architecture Highlights

*   **Caching & Resilience:** Weather data is cached in SQLite for 30 minutes. If the external Open-Meteo API fails, the backend gracefully falls back to serving stale cached data (with a `stale: true` flag).
*   **Geolocation:** On first load, the app requests the user's coordinates via the browser API, sends them to the backend, and uses BigDataCloud to resolve the city name.
*   **All-in-One Container:** For cost-efficiency on the free tier, Nginx, Node.js, and SQLite run in a single Docker container managed by Supervisor.
*   **Native Modules:** Fixed Alpine Linux compatibility for `better-sqlite3` using `npm rebuild` during the Docker build process.

---

## Local Development (Without Docker)

### Prerequisites
*   Node.js (v22 or higher)
*   npm (v11 or higher)

### 1. Backend Setup and local docker commands
```bash
cd server
npm install
npm run dev
docker rm isforecast-container
docker stop isforecast-container
docker logs isforecast-container 
docker run -d -p 80:80 --name isforecast-container isforecast-local 
docker build --no-cache -t isforecast-local . 



