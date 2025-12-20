# ReserveIT - Hotel & Restaurant Booking System

A complete full-stack hotel and restaurant booking application built with React (Vite + Tailwind CSS) frontend and Spring Boot + MySQL backend.

## 🚀 Features

- **10 Unique Hotels** with different styles (beach, luxury, city, tropical, mountain, etc.)
- **Hotel Room Booking** with real-time availability
- **Restaurant Table Booking** (25-30 tables per restaurant)
- **JWT Authentication** (Spring Security)
- **Payment System** (mock but realistic)
- **User Dashboard** with booking history
- **Combined Booking Flow** (hotel + restaurant optional)
- **Fully Responsive** premium UI
- **Real-time Availability** updates

## 📋 Prerequisites

- **Java 17+**
- **Node.js 18+** and npm
- **MySQL 8+**
- **Maven 3.6+**

## 🗄️ Database Setup

1. Create MySQL database:
```sql
CREATE DATABASE hotel_db;
```

2. Update database credentials in `backend/src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/hotel_db
spring.datasource.username=root
spring.datasource.password=your_password
```

## 🔧 Backend Setup (Spring Boot)

1. Navigate to backend directory:
```bash
cd backend
```

2. Build the project:
```bash
./mvnw clean install
```

3. Run the application:
```bash
./mvnw spring-boot:run
```

The backend will:
- Start on `http://localhost:8080`
- Automatically create database tables
- Seed 10 hotels with rooms, restaurants, and tables on first run

## 🎨 Frontend Setup (React + Vite)

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

The frontend will start on `http://localhost:5173` (or another port if 5173 is busy)

## 📁 Project Structure

```
ReserveIT-Hotel-Management-System/
├── backend/                          # Spring Boot Backend
│   ├── src/main/java/com/hotelreservation/backend/
│   │   ├── config/                   # Configuration (Security, Data Seeder)
│   │   ├── controller/               # REST Controllers
│   │   ├── dto/                      # Data Transfer Objects
│   │   ├── entity/                   # JPA Entities
│   │   ├── repository/              # JPA Repositories
│   │   ├── security/                 # JWT Security
│   │   ├── service/                  # Business Logic
│   │   └── util/                     # Utilities (JWT)
│   └── src/main/resources/
│       └── application.properties   # Configuration
│
├── frontend/                         # React Frontend
│   ├── src/
│   │   ├── api/                     # API Clients
│   │   ├── components/              # React Components
│   │   ├── context/                 # Context API (Auth)
│   │   ├── pages/                  # Page Components
│   │   └── config/                 # Configuration (Images)
│   └── package.json
│
└── README.md
```

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Hotels
- `GET /api/hotels` - Get all hotels (with optional filters: city, minRating, maxPrice)
- `GET /api/hotels/{id}` - Get hotel by ID
- `GET /api/hotels/{id}/rooms` - Get rooms for a hotel

### Restaurants
- `GET /api/hotels/{hotelId}/restaurant` - Get restaurant for a hotel
- `GET /api/hotels/{hotelId}/restaurant/tables` - Get tables for a hotel's restaurant

### Bookings
- `POST /api/bookings/hotel` - Create hotel booking (requires auth)
- `POST /api/bookings/restaurant` - Create restaurant booking (requires auth)
- `GET /api/bookings/user/{userId}` - Get user bookings (requires auth)

### Payments
- `POST /api/payments/charge` - Process payment (requires auth)

## 🎯 Booking Flow

### Hotel Booking:
1. Browse hotels → Select hotel → Choose room
2. Fill booking details (dates, guests)
3. **Payment** (mandatory)
4. Confirmation
5. Optional: "Do you want to book a restaurant table?"

### Restaurant Booking:
1. Browse hotels → Select hotel → Go to restaurant
2. Choose table → Fill reservation details (date, time, party size)
3. **Payment** (mandatory)
4. Confirmation
5. Optional: "Do you want to book a hotel room?"

## 🗃️ Database Schema

### Tables:
- `users` - User accounts
- `hotels` - Hotel information
- `rooms` - Hotel rooms
- `restaurants` - Restaurant information
- `tables` - Restaurant tables
- `hotel_bookings` - Hotel reservations
- `restaurant_bookings` - Restaurant reservations
- `payments` - Payment records

### Relationships:
- Hotel 1---* Rooms
- Hotel 1---1 Restaurant
- Restaurant 1---* Tables
- User 1---* HotelBookings
- User 1---* RestaurantBookings

## 🎨 Frontend Features

- **Premium UI** with smooth animations
- **Responsive Design** (mobile, tablet, desktop)
- **Skeleton Loaders** for better UX
- **Real-time Availability** indicators
- **Payment Modal** with card/UPI options
- **Booking History** dashboard
- **Image Configuration** via `src/config/images.js`

## 🔒 Security

- JWT-based authentication
- Password encryption (BCrypt)
- Protected API endpoints
- CORS configuration for frontend

## 📝 Default Data

On first run, the system automatically seeds:
- **10 Hotels** (Paris, Barcelona, Switzerland, Bali, NYC, Dubai, Santorini, Vienna, Costa Rica, Maldives)
- **Rooms** per hotel (Standard, Deluxe, Suite, VIP Suite, Presidential)
- **Restaurant** per hotel
- **25-30 Tables** per restaurant (VIP, Standard, Romantic, Family, Party)

## 🛠️ Development

### Backend:
```bash
cd backend
./mvnw spring-boot:run
```

### Frontend:
```bash
cd frontend
npm run dev
```

### Build for Production:

**Backend:**
```bash
cd backend
./mvnw clean package
java -jar target/backend-0.0.1-SNAPSHOT.jar
```

**Frontend:**
```bash
cd frontend
npm run build
npm run preview
```

## 🐛 Troubleshooting

1. **Database Connection Error:**
   - Check MySQL is running
   - Verify credentials in `application.properties`
   - Ensure database `hotel_db` exists

2. **CORS Errors:**
   - Verify frontend URL in `SecurityConfig.java`
   - Check backend is running on port 8080

3. **JWT Errors:**
   - Clear browser localStorage
   - Re-login to get new token

4. **Port Conflicts:**
   - Backend: Change `server.port` in `application.properties`
   - Frontend: Change port in `vite.config.js`

## 📄 License

This project is for educational purposes.

---

**Note:** Make sure both backend and frontend are running simultaneously for the application to work properly.
# Hotel-restaurant-reserve
