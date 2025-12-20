# Backend Setup & Verification Guide

## Quick Fix for "No hotels available" Issue

### Step 1: Verify Backend is Running

1. Open a browser and go to: `http://localhost:8080/api/hotels`
2. You should see either:
   - **JSON array with hotels** → Backend is working, hotels are seeded ✅
   - **Empty array `[]`** → Backend is working but database needs seeding
   - **Error/Cannot connect** → Backend is not running ❌

### Step 2: Start/Restart Backend

If backend is not running or database is empty:

```bash
cd backend
./mvnw spring-boot:run
```

**OR on Windows:**
```bash
cd backend
.\mvnw.cmd spring-boot:run
```

### Step 3: Check Backend Logs

When the backend starts, you should see in the console:

```
Seeding hotels data...
Successfully seeded 10 hotels!
```

**OR if hotels already exist:**
```
Hotels already exist in database. Skipping seed. Count: 10
```

### Step 4: Verify Database

1. Check MySQL database `hotel_db`
2. Verify `hotels` table has 10 rows:
   ```sql
   SELECT COUNT(*) FROM hotels;
   ```

### Step 5: Test API Endpoint

After backend starts, test in browser:
- `http://localhost:8080/api/hotels` should return JSON array with 10 hotels

### Common Issues:

1. **Database not created:**
   ```sql
   CREATE DATABASE IF NOT EXISTS hotel_db;
   ```

2. **Wrong database credentials:**
   - Check `backend/src/main/resources/application.properties`
   - Update username/password if needed

3. **Port 8080 already in use:**
   - Change port in `application.properties`: `server.port=8081`
   - Update frontend `apiClient.js` base URL accordingly

4. **CORS issues:**
   - Backend already has `@CrossOrigin(origins = "*")` configured
   - Should work out of the box

