#!/bin/bash

echo "🚀 Starting ReserveIT Hotel Management System"
echo "=============================================="

# Check if MySQL is running
echo ""
echo "📊 Checking prerequisites..."
if ! command -v mysql &> /dev/null; then
    echo "⚠️  MySQL not found in PATH. Please ensure MySQL is installed and running."
else
    echo "✅ MySQL found"
fi

# Start Backend
echo ""
echo "🔧 Starting Spring Boot Backend..."
cd backend
if [ ! -f "mvnw" ]; then
    echo "❌ Maven wrapper not found. Please run: cd backend && mvn wrapper:wrapper"
    exit 1
fi

chmod +x mvnw
echo "   Backend will start on http://localhost:8080"
echo "   Starting in background..."
./mvnw spring-boot:run > ../backend.log 2>&1 &
BACKEND_PID=$!
echo "   Backend PID: $BACKEND_PID"
cd ..

# Wait for backend to initialize
echo ""
echo "⏳ Waiting for backend to start (this may take 30-60 seconds)..."
sleep 15

# Check if backend started
if lsof -ti:8080 > /dev/null 2>&1; then
    echo "✅ Backend is running on http://localhost:8080"
else
    echo "⚠️  Backend may still be starting. Check backend.log for details."
fi

# Start Frontend
echo ""
echo "🎨 Starting React Frontend..."
cd frontend

# Create .env if it doesn't exist
if [ ! -f ".env" ]; then
    echo "VITE_API_BASE_URL=/api" > .env
    echo "   Created .env file"
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "   Installing dependencies (this may take a few minutes)..."
    npm install
fi

echo "   Frontend will start on http://localhost:5173"
echo "   Starting in background..."
npm run dev > ../frontend.log 2>&1 &
FRONTEND_PID=$!
echo "   Frontend PID: $FRONTEND_PID"
cd ..

# Wait a bit for frontend
sleep 5

# Final status
echo ""
echo "=============================================="
echo "📋 Server Status:"
if lsof -ti:8080 > /dev/null 2>&1; then
    echo "   ✅ Backend:  http://localhost:8080"
else
    echo "   ⏳ Backend:  Still starting... (check backend.log)"
fi

if lsof -ti:5173 > /dev/null 2>&1; then
    echo "   ✅ Frontend: http://localhost:5173"
else
    echo "   ⏳ Frontend: Still starting... (check frontend.log)"
fi

echo ""
echo "📝 Logs:"
echo "   Backend:  tail -f backend.log"
echo "   Frontend: tail -f frontend.log"
echo ""
echo "🛑 To stop servers:"
echo "   kill $BACKEND_PID $FRONTEND_PID"
echo "   OR: pkill -f 'spring-boot:run' && pkill -f 'vite'"
echo ""
echo "✨ Open http://localhost:5173 in your browser"
echo ""

