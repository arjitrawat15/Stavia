# Project Fix Guide - ReserveIT Hotel Management System

## 🔴 Critical Issue Found: Java Not Installed

**Problem:** Java 17 is required for the Spring Boot backend but is not installed on your system.

**Solution:** Install Java 17 (JDK)

---

## ✅ Quick Fix Steps

### Step 1: Install Java 17

**Option A: Using Homebrew (Recommended for macOS)**
```bash
# Install Homebrew if not installed
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Java 17
brew install openjdk@17

# Link Java 17
sudo ln -sfn /opt/homebrew/opt/openjdk@17/libexec/openjdk.jdk /Library/Java/JavaVirtualMachines/openjdk-17.jdk

# Add to PATH (add to ~/.zshrc or ~/.bash_profile)
echo 'export PATH="/opt/homebrew/opt/openjdk@17/bin:$PATH"' >> ~/.zshrc
echo 'export JAVA_HOME="/opt/homebrew/opt/openjdk@17"' >> ~/.zshrc
source ~/.zshrc
```

**Option B: Download from Oracle/Adoptium**
1. Visit: https://adoptium.net/temurin/releases/?version=17
2. Download macOS installer (.pkg)
3. Install the package
4. Verify: `java -version`

**Option C: Using SDKMAN (Alternative)**
```bash
# Install SDKMAN
curl -s "https://get.sdkman.io" | bash
source "$HOME/.sdkman/bin/sdkman-init.sh"

# Install Java 17
sdk install java 17.0.9-tem
```

### Step 2: Verify Java Installation
```bash
java -version
# Should show: openjdk version "17.x.x"
```

### Step 3: Verify MySQL is Running
```bash
mysql -u root -p'Aiml@2027' -e "SHOW DATABASES;"
```

If MySQL is not running:
```bash
# Start MySQL (macOS)
brew services start mysql
# OR
sudo /usr/local/mysql/support-files/mysql.server start
```

### Step 4: Start Backend
```bash
cd /Users/harshitsrikoti/Downloads/ReserveIT-Hotel-Management-System/backend
chmod +x mvnw
./mvnw spring-boot:run
```

### Step 5: Start Frontend (in new terminal)
```bash
cd /Users/harshitsrikoti/Downloads/ReserveIT-Hotel-Management-System/frontend

# Ensure .env exists
echo "VITE_API_BASE_URL=/api" > .env

# Install dependencies if needed
npm install

# Start dev server
npm run dev
```

---

## 🔍 Other Potential Issues & Fixes

### Issue 1: Maven Wrapper Permissions
**Fix:**
```bash
cd backend
chmod +x mvnw
```

### Issue 2: Database Connection Failed
**Symptoms:** Backend starts but fails to connect to MySQL

**Fix:**
1. Check MySQL is running: `mysql -u root -p`
2. Verify database exists:
   ```sql
   CREATE DATABASE IF NOT EXISTS hotel_db;
   ```
3. Update `application.properties` if credentials differ

### Issue 3: Port Already in Use
**Symptoms:** "Port 8080 is already in use"

**Fix:**
```bash
# Find process using port 8080
lsof -ti:8080

# Kill the process
kill -9 $(lsof -ti:8080)

# OR change port in application.properties
# server.port=8081
```

### Issue 4: Frontend Dependencies Missing
**Symptoms:** Module not found errors

**Fix:**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### Issue 5: CORS Errors
**Already Fixed:** CORS is configured in `CorsConfig.java` and `SecurityConfig.java`

### Issue 6: Environment Variables Not Loading
**Fix:**
```bash
cd frontend
echo "VITE_API_BASE_URL=/api" > .env
```

---

## 🚀 Complete Startup Script

After installing Java, use this script:

```bash
#!/bin/bash
# save as: start-project.sh

echo "🚀 Starting ReserveIT Project..."

# Check Java
if ! command -v java &> /dev/null; then
    echo "❌ Java not found. Please install Java 17 first."
    exit 1
fi

JAVA_VERSION=$(java -version 2>&1 | head -1 | cut -d'"' -f2 | cut -d'.' -f1)
if [ "$JAVA_VERSION" -lt 17 ]; then
    echo "❌ Java 17+ required. Found Java $JAVA_VERSION"
    exit 1
fi
echo "✅ Java $JAVA_VERSION found"

# Check MySQL
if ! mysql -u root -p'Aiml@2027' -e "SELECT 1" &>/dev/null; then
    echo "⚠️  MySQL connection failed. Please check MySQL is running."
fi

# Start Backend
echo "🔧 Starting backend..."
cd backend
chmod +x mvnw
./mvnw spring-boot:run > ../backend.log 2>&1 &
BACKEND_PID=$!
cd ..
echo "   Backend PID: $BACKEND_PID"

# Wait for backend
sleep 15

# Start Frontend
echo "🎨 Starting frontend..."
cd frontend
[ ! -f .env ] && echo "VITE_API_BASE_URL=/api" > .env
[ ! -d node_modules ] && npm install
npm run dev > ../frontend.log 2>&1 &
FRONTEND_PID=$!
cd ..
echo "   Frontend PID: $FRONTEND_PID"

echo ""
echo "✅ Servers starting..."
echo "   Backend:  http://localhost:8080"
echo "   Frontend: http://localhost:5173"
echo ""
echo "📝 Logs:"
echo "   tail -f backend.log"
echo "   tail -f frontend.log"
echo ""
echo "🛑 Stop: kill $BACKEND_PID $FRONTEND_PID"
```

---

## 📋 System Requirements Checklist

- [ ] Java 17+ installed and in PATH
- [ ] Maven (or use mvnw wrapper)
- [ ] MySQL 8.0+ installed and running
- [ ] Database `hotel_db` created
- [ ] Node.js 18+ installed (✅ You have v24.5.0)
- [ ] npm installed (✅ You have v11.5.1)

---

## 🆘 Still Not Working?

1. **Check Backend Logs:**
   ```bash
   tail -f backend.log
   ```

2. **Check Frontend Logs:**
   ```bash
   tail -f frontend.log
   ```

3. **Verify Java:**
   ```bash
   java -version
   which java
   echo $JAVA_HOME
   ```

4. **Test Database:**
   ```bash
   mysql -u root -p'Aiml@2027' -e "USE hotel_db; SHOW TABLES;"
   ```

5. **Check Ports:**
   ```bash
   lsof -i:8080  # Backend
   lsof -i:5173  # Frontend
   ```

---

## 📞 Common Error Messages & Solutions

| Error | Solution |
|-------|----------|
| "Unable to locate Java Runtime" | Install Java 17 (see Step 1) |
| "Port 8080 already in use" | Kill process or change port |
| "Access denied for user 'root'" | Check MySQL password in application.properties |
| "Unknown database 'hotel_db'" | Create database: `CREATE DATABASE hotel_db;` |
| "Module not found" | Run `npm install` in frontend directory |
| "CORS policy" | Already configured, check backend is running |

---

**Next Steps:** Install Java 17 using one of the methods above, then restart the project.

