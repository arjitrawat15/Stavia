# How to Run ReserveIT Hotel Management System

## Prerequisites

1. **Java 17+** - Required for Spring Boot backend
2. **Maven** - For building the Spring Boot project
3. **Node.js 18+** - For React frontend
4. **MySQL 8.0+** - Database server
5. **npm or yarn** - Package manager for frontend

## Step-by-Step Setup

### 1. Database Setup

The backend requires MySQL database. Create the database:

```sql
CREATE DATABASE hotel_db;
```

**Note:** The application.properties uses:
- Database: `hotel_db`
- Username: `root`
- Password: `Aiml@2027`
- Port: `3306`

If your MySQL credentials are different, update `backend/src/main/resources/application.properties`.

### 2. Start Backend (Spring Boot)

Open a terminal and navigate to the backend directory:

```bash
cd backend
```

**Option A: Using Maven Wrapper (Recommended)**
```bash
# On macOS/Linux
./mvnw spring-boot:run

# On Windows
mvnw.cmd spring-boot:run
```

**Option B: Using Maven (if installed)**
```bash
mvn spring-boot:run
```

**Option C: Build and Run JAR**
```bash
# Build
./mvnw clean package

# Run
java -jar target/backend-0.0.1-SNAPSHOT.jar
```

The backend will start on **http://localhost:8080**

### 3. Start Frontend (React/Vite)

Open a **new terminal** and navigate to the frontend directory:

```bash
cd frontend
```

**Install dependencies (first time only):**
```bash
npm install
```

**Create .env file (if not exists):**
```bash
echo "VITE_API_BASE_URL=/api" > .env
```

**Start development server:**
```bash
npm run dev
```

The frontend will start on **http://localhost:5173**

### 4. Access the Application

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:8080/api

## Quick Start Scripts

### macOS/Linux

Create a `start.sh` file in the project root:

```bash
#!/bin/bash

# Start Backend
echo "Starting Spring Boot backend..."
cd backend
./mvnw spring-boot:run &
BACKEND_PID=$!
cd ..

# Wait for backend to start
sleep 10

# Start Frontend
echo "Starting React frontend..."
cd frontend
npm install
npm run dev &
FRONTEND_PID=$!

echo "Backend running on http://localhost:8080 (PID: $BACKEND_PID)"
echo "Frontend running on http://localhost:5173 (PID: $FRONTEND_PID)"
echo "Press Ctrl+C to stop both servers"

# Wait for user interrupt
wait
```

Make it executable:
```bash
chmod +x start.sh
./start.sh
```

### Windows

Create a `start.bat` file:

```batch
@echo off
echo Starting Spring Boot backend...
start cmd /k "cd backend && mvnw.cmd spring-boot:run"

timeout /t 10

echo Starting React frontend...
start cmd /k "cd frontend && npm install && npm run dev"

echo Backend: http://localhost:8080
echo Frontend: http://localhost:5173
pause
```

## Troubleshooting

### Backend Issues

1. **Port 8080 already in use:**
   - Change `server.port` in `application.properties`
   - Or kill the process using port 8080

2. **Database connection error:**
   - Ensure MySQL is running
   - Verify database credentials in `application.properties`
   - Create the database: `CREATE DATABASE hotel_db;`

3. **Maven build fails:**
   - Check Java version: `java -version` (should be 17+)
   - Try: `./mvnw clean install`

### Frontend Issues

1. **Port 5173 already in use:**
   - Vite will automatically use the next available port
   - Or specify port: `npm run dev -- --port 3000`

2. **Module not found errors:**
   - Run: `npm install` again
   - Delete `node_modules` and `package-lock.json`, then `npm install`

3. **API connection errors:**
   - Ensure backend is running on port 8080
   - Check `.env` file has `VITE_API_BASE_URL=/api`

## Development Commands

### Backend
```bash
cd backend
./mvnw clean package    # Build
./mvnw test            # Run tests
./mvnw spring-boot:run # Run application
```

### Frontend
```bash
cd frontend
npm install            # Install dependencies
npm run dev            # Start dev server
npm run build          # Build for production
npm run preview        # Preview production build
npm test               # Run tests
```

## Production Build

### Backend
```bash
cd backend
./mvnw clean package
java -jar target/backend-0.0.1-SNAPSHOT.jar
```

### Frontend
```bash
cd frontend
npm run build
# Output in frontend/dist/
```

## Environment Variables

### Frontend (.env)
```
VITE_API_BASE_URL=/api
```

### Backend (application.properties)
```
spring.datasource.url=jdbc:mysql://localhost:3306/hotel_db
spring.datasource.username=root
spring.datasource.password=Aiml@2027
server.port=8080
```

## API Endpoints

Once running, the backend provides:
- `GET /api/hotels` - List all hotels
- `GET /api/hotels/{id}` - Get hotel by ID
- `POST /api/auth/signup` - User signup
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- And more...

## Notes

- The backend uses JWT authentication
- Database schema is auto-created on first run (Hibernate DDL auto-update)
- Frontend proxies API requests through Vite dev server
- Both servers must be running for full functionality

