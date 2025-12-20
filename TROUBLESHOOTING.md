# Troubleshooting Guide

## Common Issues and Solutions

### 1. Backend Won't Start

**Error: "Cannot connect to database"**
- Solution: Make sure MySQL is running
- Check: Open MySQL Workbench or command line and verify connection
- Verify credentials in `backend/src/main/resources/application.properties`:
  ```
  spring.datasource.username=root
  spring.datasource.password=2005
  ```

**Error: "Port 8080 already in use"**
- Solution: Stop other applications using port 8080
- Or change port in `application.properties`: `server.port=8081`

**Error: "Database hotel_db does not exist"**
- Solution: Create the database:
  ```sql
  CREATE DATABASE hotel_db;
  ```

### 2. Frontend Won't Start

**Error: "Port 5173 already in use"**
- Solution: Vite will automatically use next available port (5174, 5175, etc.)
- Check console for actual port number

**Error: "Cannot connect to backend API"**
- Solution: Make sure backend is running on port 8080
- Check `frontend/src/api/apiClient.js` - should point to `http://localhost:8080/api`

### 3. Database Connection Issues

**Check MySQL is running:**
```bash
# Windows
net start MySQL80

# Or check services
services.msc
```

**Create database manually:**
```sql
CREATE DATABASE IF NOT EXISTS hotel_db;
USE hotel_db;
```

**Update credentials if needed:**
Edit `backend/src/main/resources/application.properties`

### 4. Build Errors

**Backend compilation errors:**
```bash
cd backend
.\mvnw.cmd clean install
```

**Frontend dependency issues:**
```bash
cd frontend
rm -rf node_modules
npm install
```

### 5. CORS Errors

If you see CORS errors in browser console:
- Check `backend/src/main/java/com/hotelreservation/backend/config/SecurityConfig.java`
- Make sure frontend URL is in allowed origins list

### 6. JWT Token Issues

**Token expired or invalid:**
- Clear browser localStorage
- Re-login to get new token

### 7. Check Server Status

**Backend:**
- Open: http://localhost:8080/api/hotels
- Should return JSON array of hotels

**Frontend:**
- Open: http://localhost:5173 (or port shown in console)
- Should show the ReserveIT homepage

## Step-by-Step Startup

1. **Start MySQL:**
   - Make sure MySQL service is running
   - Verify database `hotel_db` exists

2. **Start Backend:**
   ```bash
   cd backend
   .\mvnw.cmd spring-boot:run
   ```
   - Wait for "Started HotelReservationSystemApplication"
   - Should see database tables being created
   - Should see "Data seeded successfully"

3. **Start Frontend:**
   ```bash
   cd frontend
   npm run dev
   ```
   - Wait for "Local: http://localhost:5173"
   - Open that URL in browser

## Quick Health Checks

**Backend Health:**
```bash
curl http://localhost:8080/api/hotels
```

**Frontend Health:**
- Open browser to http://localhost:5173
- Check browser console (F12) for errors

## Still Not Working?

1. Check console output for specific error messages
2. Verify MySQL credentials match your setup
3. Ensure both servers are running simultaneously
4. Check firewall isn't blocking ports 8080 or 5173

