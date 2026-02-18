# LectureMind

LectureMind is a full-stack app for managing semesters, units, and lecture uploads, then generating transcripts from lecture videos using a Python Whisper service.

## Tech Stack

- **Frontend:** React 19, TypeScript, Vite, Redux Toolkit, TailwindCSS
- **Backend:** Spring Boot 4, Spring Security (JWT), MongoDB
- **AI Service:** FastAPI + OpenAI Whisper
- **Media Processing:** FFmpeg (audio extraction, thumbnail generation, split handling)

## Project Structure

- `frontend/` — React web app
- `backend/` — Spring Boot API and processing pipeline
- `python_services/` — FastAPI transcription service

---

## Prerequisites

Install these before running:

- **Node.js** 20+
- **Java JDK** 25 (as configured in `backend/pom.xml`)
- **Maven** (or use `mvnw` / `mvnw.cmd`)
- **Python** 3.10+
- **FFmpeg** available in system `PATH`
- **MongoDB** (local or Atlas)

---

## Environment Setup

### 1) Backend config

Update `backend/src/main/resources/application.yaml` with your own values:

- MongoDB URI
- JWT secret
- JWT expiration

> ⚠️ If this file contains real credentials, rotate them and move values to environment variables before sharing/deploying.

### 2) Frontend config (optional)

Frontend uses:
- `VITE_API_BASE_URL` (default: `http://localhost:8080`)

Create `frontend/.env` if needed:

```env
VITE_API_BASE_URL=http://localhost:8080
