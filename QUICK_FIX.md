# 🚨 Quick Fix - Project Not Working

## Main Problem: Java 17 Not Installed

Your system doesn't have Java 17 installed, which is required for the Spring Boot backend.

---

## ✅ IMMEDIATE FIX (3 Steps)

### Step 1: Install Java 17

**Run this command:**
```bash
cd /Users/harshitsrikoti/Downloads/ReserveIT-Hotel-Management-System
./install-java.sh
```

**OR manually:**
```bash
# Install Homebrew (if not installed)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Java 17
brew install openjdk@17

# Link Java
sudo ln -sfn /opt/homebrew/opt/openjdk@17/libexec/openjdk.jdk /Library/Java/JavaVirtualMachines/openjdk-17.jdk

# Add to PATH
echo 'export PATH="/opt/homebrew/opt/openjdk@17/bin:$PATH"' >> ~/.zshrc
echo 'export JAVA_HOME="/opt/homebrew/opt/openjdk@17"' >> ~/.zshrc
source ~/.zshrc
```

### Step 2: Verify Java Installation
```bash
java -version
# Should show: openjdk version "17.x.x"
```

### Step 3: Start the Project

**Terminal 1 - Backend:**
```bash
cd /Users/harshitsrikoti/Downloads/ReserveIT-Hotel-Management-System/backend
chmod +x mvnw
./mvnw spring-boot:run
```

**Terminal 2 - Frontend:**
```bash
cd /Users/harshitsrikoti/Downloads/ReserveIT-Hotel-Management-System/frontend
npm run dev
```

---

## ✅ What I've Already Fixed

1. ✅ Created `.env` file for frontend
2. ✅ Started frontend server (should be running on http://localhost:5173)
3. ✅ Fixed all code errors (see ERROR_REPORT.md)
4. ✅ Created Java installation script (`install-java.sh`)
5. ✅ Created comprehensive fix guide (`FIX_ISSUES.md`)

---

## 🎯 Current Status

- ✅ **Frontend:** Should be running (Node.js is installed)
- ❌ **Backend:** Cannot start (Java 17 missing)

---

## 📋 After Installing Java

Once Java 17 is installed:

1. **Verify MySQL is running:**
   ```bash
   mysql -u root -p'Aiml@2027' -e "SHOW DATABASES;"
   ```

2. **Start backend:**
   ```bash
   cd backend
   ./mvnw spring-boot:run
   ```

3. **Access application:**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8080/api

---

## 🆘 Still Having Issues?

See `FIX_ISSUES.md` for detailed troubleshooting guide.

**Common Issues:**
- MySQL not running → `brew services start mysql`
- Port 8080 in use → `kill $(lsof -ti:8080)`
- Database missing → `CREATE DATABASE hotel_db;`

---

**Next Action:** Run `./install-java.sh` to install Java 17, then restart the backend.

