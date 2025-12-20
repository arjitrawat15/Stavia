# Quick Start Guide

## Prerequisites Check

1. **MySQL is running**
   - Check Windows Services (services.msc)
   - Service name: MySQL80 or MySQL

2. **Database exists**
   ```sql
   CREATE DATABASE IF NOT EXISTS hotel_db;
   ```

3. **Update credentials** (if your MySQL password is different)
   - Edit: `backend/src/main/resources/application.properties`
   - Change: `spring.datasource.password=2005` to your password

## Start the Application

### Option 1: Use Batch Files (Easiest)

1. **Double-click `start-backend.bat`** - Wait for "Started HotelReservationSystemApplication"
2. **Double-click `start-frontend.bat`** - Wait for "Local: http://localhost:5173"
3. **Open browser** to the URL shown (usually http://localhost:5173)

### Option 2: Manual Start

**Terminal 1 - Backend:**
```bash
cd backend
.\mvnw.cmd spring-boot:run
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

## Verify It's Working

1. **Backend Test:**
   - Open: http://localhost:8080/api/hotels
   - Should see JSON with 10 hotels

2. **Frontend Test:**
   - Open: http://localhost:5173
   - Should see ReserveIT homepage with hotels

## Common First-Time Issues

### Issue: "Cannot connect to database"
**Fix:** 
- Make sure MySQL is running
- Create database: `CREATE DATABASE hotel_db;`
- Check password in `application.properties`

### Issue: "Port already in use"
**Fix:**
- Backend: Change `server.port=8081` in `application.properties`
- Frontend: Vite will auto-use next port (check console)

### Issue: "Compilation errors"
**Fix:**
```bash
cd backend
.\mvnw.cmd clean install
```

## Need Help?

Check `TROUBLESHOOTING.md` for detailed solutions.

