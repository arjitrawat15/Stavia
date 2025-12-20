# Quick Diagnostic Steps for Network Error

## Step 1: Check Backend is Running

Open terminal and run:
```bash
curl http://localhost:8080/api/hotels
```

**Expected:** JSON response (even if empty array `[]`)

**If fails:** Backend is not running. Start it:
```bash
cd backend
./mvnw spring-boot:run
```

## Step 2: Test Signup Endpoint Directly

```bash
curl -X POST http://localhost:8080/api/auth/signup \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d "{\"fullName\":\"Test User\",\"email\":\"test@example.com\",\"password\":\"password123\",\"phoneNumber\":\"+1234567890\"}" \
  -v
```

**Expected:** 
- Status: `HTTP/1.1 201 Created`
- Response body contains `token`, `userId`, `email`, `fullName`

## Step 3: Check Browser Console

1. Open browser DevTools (F12)
2. Go to **Console** tab
3. Look for: `API Client initialized with baseURL: /api`
4. Try signup
5. Check for detailed error logs

## Step 4: Check Network Tab

1. Open DevTools → **Network** tab
2. Try signup
3. Find request to `/api/auth/signup`
4. Check:
   - **Status Code** (should be 201)
   - **Request URL** (should be `/api/auth/signup` or `http://localhost:5173/api/auth/signup`)
   - **Request Headers** (should include `Content-Type: application/json`)
   - **Response Headers** (should include CORS headers)
   - **Response** tab (should show JSON with token)

## Common Issues & Fixes

### Issue: "Network Error" with no details
**Check:**
- Backend console for errors
- Browser console for detailed logs (now added)
- Network tab for request details

### Issue: CORS error
**Fix:** Restart backend after CORS config changes

### Issue: 404 Not Found
**Fix:** Verify endpoint path matches exactly: `/api/auth/signup`

### Issue: Connection refused
**Fix:** Backend not running or wrong port

