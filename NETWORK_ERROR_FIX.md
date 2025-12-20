# Network Error Fix - Verification Guide

## 🔍 Root Causes Identified & Fixed

### Issue 1: Hardcoded Absolute URL Bypassing Vite Proxy
**Problem:** Frontend was using `http://localhost:8080/api` directly, bypassing Vite's proxy configuration.

**Fix:** Changed to relative URL `/api` to use Vite proxy, with fallback support.

### Issue 2: Missing Timeout Configuration
**Problem:** No timeout on axios requests, causing indefinite hangs.

**Fix:** Added 10-second timeout.

### Issue 3: Insufficient Error Handling
**Problem:** Network errors weren't being caught and displayed properly.

**Fix:** Enhanced error handling with specific messages for different error types.

### Issue 4: CORS Configuration
**Problem:** CORS might not include all Vite development ports.

**Fix:** Expanded CORS to include all common Vite ports (5173-5176).

## ✅ Verification Steps

### Step 1: Verify Backend is Running

```bash
# Check if backend is running
curl http://localhost:8080/api/hotels
```

**Expected:** JSON array of hotels (or empty array `[]`)

**If fails:** Start backend:
```bash
cd backend
./mvnw spring-boot:run
```

### Step 2: Test Backend Auth Endpoint Directly

```bash
curl -X POST http://localhost:8080/api/auth/signup \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "fullName": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "phoneNumber": "+1234567890"
  }' \
  -v
```

**Expected Response (201 Created):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "userId": 1,
  "email": "test@example.com",
  "fullName": "Test User"
}
```

**Check for:**
- Status: `HTTP/1.1 201 Created`
- Headers include: `Access-Control-Allow-Origin: http://localhost:5173`
- Content-Type: `application/json`

### Step 3: Check Browser Console

1. Open browser DevTools (F12)
2. Go to **Console** tab
3. Go to **Network** tab
4. Try to signup
5. Look for:
   - Request to `/api/auth/signup`
   - Request method: `POST`
   - Status code (should be 201 or error code)
   - Response headers (check for CORS headers)
   - Response body

### Step 4: Check Vite Proxy

1. Start frontend:
   ```bash
   cd frontend
   npm run dev
   ```

2. Check console output for:
   ```
   VITE v5.x.x  ready in xxx ms
   ➜  Local:   http://localhost:5173/
   ```

3. Look for proxy logs when making requests:
   ```
   Proxying request: POST /api/auth/signup → /api/auth/signup
   Proxy response: POST /api/auth/signup ← 201
   ```

### Step 5: Test Signup in Browser

1. Open `http://localhost:5173`
2. Open DevTools → Console tab
3. Click "Login" → "Sign Up"
4. Fill form:
   - Full Name: `Test User`
   - Email: `test@example.com`
   - Password: `password123`
   - Phone: `+1234567890`
5. Click "Sign Up"

**Expected Console Output:**
```
API Client initialized with baseURL: /api
[API Request] POST /api/auth/signup { data: {...}, headers: {...} }
[API Response] POST /api/auth/signup { status: 201, data: {...} }
AuthContext: Signup successful, user data saved
```

**If Network Error:**
- Check console for detailed error logs
- Check Network tab for failed request
- Verify backend is running
- Check CORS headers in response

## 🐛 Troubleshooting

### Error: "Cannot connect to server"

**Causes:**
1. Backend not running
2. Wrong port
3. Firewall blocking

**Fix:**
```bash
# Check if backend is running
netstat -an | findstr :8080  # Windows
lsof -i :8080                # Mac/Linux

# Start backend if not running
cd backend
./mvnw spring-boot:run
```

### Error: CORS policy error

**Symptoms:**
- Console shows: `Access to XMLHttpRequest at 'http://localhost:8080/api/auth/signup' from origin 'http://localhost:5173' has been blocked by CORS policy`

**Fix:**
1. Verify `CorsConfig.java` includes your frontend port
2. Restart backend after CORS changes
3. Check response headers include `Access-Control-Allow-Origin`

### Error: 404 Not Found

**Symptoms:**
- Request returns 404
- Backend logs show no request received

**Fix:**
1. Verify endpoint path: `/api/auth/signup`
2. Check `AuthController` is properly annotated
3. Verify Spring Boot context loaded correctly

### Error: 500 Internal Server Error

**Symptoms:**
- Request returns 500
- Backend logs show exception

**Fix:**
1. Check backend console for stack trace
2. Verify database connection
3. Check `users` table exists
4. Verify JWT secret is configured

### Error: Proxy error

**Symptoms:**
- Vite proxy logs show error
- Request never reaches backend

**Fix:**
1. Verify `vite.config.js` proxy target is correct
2. Check backend is on port 8080
3. Try using direct URL (set `VITE_API_BASE_URL=http://localhost:8080/api`)

## 🔧 Alternative: Use Direct Connection (Bypass Proxy)

If proxy doesn't work, you can use direct connection:

1. Create `.env` file in `frontend/`:
   ```
   VITE_API_BASE_URL=http://localhost:8080/api
   ```

2. Restart frontend dev server

3. This will bypass Vite proxy and connect directly

## 📝 Key Files Modified

1. **frontend/src/api/apiClient.js**
   - Changed to relative URL `/api` (uses Vite proxy)
   - Added timeout (10 seconds)
   - Enhanced error logging
   - Better error messages

2. **frontend/vite.config.js**
   - Updated port to 5173 (Vite default)
   - Added proxy logging
   - Improved proxy configuration

3. **backend/src/main/java/com/hotelreservation/backend/config/CorsConfig.java**
   - Added more allowed origins
   - Added more allowed methods
   - Improved CORS headers

4. **frontend/src/context/AuthContext.jsx**
   - Enhanced network error detection
   - Better error messages for different error types

## ✅ Success Criteria

- [ ] Backend responds to direct curl request
- [ ] Browser Network tab shows successful POST to `/api/auth/signup`
- [ ] Response status is 201 Created
- [ ] Response includes JWT token
- [ ] No CORS errors in console
- [ ] Signup modal closes and user is logged in
- [ ] Console shows success logs

## 🧪 Quick Test Commands

```bash
# Test backend directly
curl -X POST http://localhost:8080/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"fullName":"Test","email":"test@test.com","password":"pass123","phoneNumber":"+123"}'

# Check if port is open
telnet localhost 8080  # Windows
nc -zv localhost 8080  # Mac/Linux

# Check backend logs
# Look for: "POST /api/auth/signup - Request received"
```

