# ReserveIT - Complete Hotel & Restaurant Booking System

A production-ready, full-featured hotel and restaurant reservation platform built with React, Vite, and Tailwind CSS. Features authentication, payment processing, and separate booking flows for hotels and restaurants.

## ✨ Features

### Core Features
- 🏨 **10 Unique Hotels** - Diverse collection from luxury resorts to eco lodges
- 🍽️ **Restaurant Table Booking** - 25-30 tables per restaurant across 5 types (Standard, Romantic, Family, VIP, Party)
- 🔐 **Authentication System** - Login/Signup with token-based auth
- 💳 **Payment Processing** - Mock payment system with Card, UPI, and PayPal options
- 📱 **Fully Responsive** - Mobile-first design that works on all devices
- ♿ **Accessible** - WCAG AA compliant with keyboard navigation
- 🎨 **Premium UI** - Cinematic hero sections, smooth animations, elegant design

### Booking Flows
- **Hotel Only** - Book accommodation independently
- **Restaurant Only** - Book table reservation independently  
- **Combined** - Book both hotel and restaurant (separate flows)

### Authentication
- Visitors can browse freely
- Booking requires login/signup
- Automatic redirect to login when attempting to book
- Token stored in localStorage for persistence

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm (or yarn/pnpm)

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   Navigate to `http://localhost:3000`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## 📁 Project Structure

```
frontend/
├── src/
│   ├── api/
│   │   └── mockServer.js          # Complete mock API with auth, hotels, restaurants, payments
│   ├── components/
│   │   ├── Header.jsx              # Navigation with auth
│   │   ├── Hero.jsx                # Hero section with search
│   │   ├── SearchBar.jsx           # Reusable search component
│   │   ├── HotelCard.jsx           # Hotel listing card
│   │   ├── RoomCard.jsx            # Room selection card
│   │   ├── BookingSidebar.jsx      # Hotel booking form with auth & payment
│   │   ├── RestaurantHero.jsx      # Restaurant hero section
│   │   ├── RestaurantTableCard.jsx # Table selection card
│   │   ├── OffersCard.jsx          # Special offers card
│   │   ├── TestimonialCard.jsx     # Customer testimonials
│   │   ├── Footer.jsx               # Site footer
│   │   ├── SkeletonLoader.jsx      # Loading skeletons
│   │   ├── PaymentModal.jsx        # Payment processing modal
│   │   └── LoginModal.jsx          # Login/Signup modal
│   ├── context/
│   │   └── AuthContext.jsx         # Authentication context provider
│   ├── config/
│   │   └── images.js               # Image configuration (10 hotels)
│   ├── pages/
│   │   ├── Home.jsx                # Homepage with hero, featured hotels, offers
│   │   ├── Hotels.jsx               # Hotels listing with filters
│   │   ├── HotelDetail.jsx         # Hotel details + room selection + booking
│   │   ├── RestaurantBooking.jsx   # Restaurant table booking
│   │   └── Confirmation.jsx        # Booking confirmation (hotel/restaurant/both)
│   ├── tests/
│   │   ├── setup.js                # Test setup
│   │   └── HotelCard.test.jsx      # HotelCard unit test
│   ├── App.jsx                      # Main app with routes
│   ├── main.jsx                     # Entry point with AuthProvider
│   └── index.css                    # Global styles and design tokens
├── public/                          # Static assets
├── DESIGN_NOTES.md                  # Design system documentation
├── README.md                        # This file
└── package.json                     # Dependencies
```

## 🏨 Hotels Data

The system includes **10 unique hotels**:

1. **Grand Luxury Resort** - Paris, France (Top Pick)
2. **Oceanview Beach Hotel** - Barcelona, Spain
3. **Mountain Retreat Lodge** - Switzerland (Top Pick)
4. **Tropical Paradise Resort** - Bali, Indonesia (Best Seller)
5. **Urban Boutique Hotel** - New York, USA
6. **Desert Oasis Resort** - Dubai, UAE (Top Pick)
7. **Coastal Villa Collection** - Santorini, Greece (Best Seller)
8. **Historic Grand Hotel** - Vienna, Austria
9. **Jungle Eco Lodge** - Costa Rica
10. **Island Resort & Spa** - Maldives (Top Pick)

Each hotel includes:
- Multiple room types (Standard, Deluxe, Suite, VIP Suite, Presidential)
- 4-6 rooms per type
- Unique amenities
- Pricing based on room type
- Location and description

## 🍽️ Restaurant Tables

Each restaurant has **25-30 tables** distributed as:
- **VIP Tables**: 4 tables (capacity 6, +$75 extra)
- **Standard Tables**: 6 tables (capacity 4, no extra)
- **Romantic Tables**: 6 tables (capacity 2, +$25 extra)
- **Family Tables**: 6 tables (capacity 6, no extra)
- **Party Tables**: 4 tables (capacity 8, +$50 extra)

## 🔐 Authentication

### Demo Credentials
- **Email**: `demo@example.com`
- **Password**: `demo123`

### Features
- Sign up with name, email, and password
- Login with email and password
- Token-based authentication
- Automatic session persistence
- Protected booking endpoints

### Usage
1. Click "Login" in the header
2. Use demo credentials or create a new account
3. Bookings require authentication
4. Logout from the header menu

## 💳 Payment System

### Payment Methods
- **Credit/Debit Card** - Full card details (number, expiry, CVV, name)
- **UPI** - UPI ID format (e.g., name@paytm)
- **PayPal** - Simulated redirect

### Payment Flow
1. Complete booking form
2. Payment modal appears automatically
3. Select payment method
4. Enter payment details
5. Processing animation
6. Redirect to confirmation page

**Note**: All payments are mocked and always succeed for demonstration.

## 📋 Booking Flows

### Hotel Booking Flow
1. Browse hotels → Select hotel → View rooms
2. Select room → Fill booking form
3. **Auth check** → Login if needed
4. Submit booking → Payment modal
5. Complete payment → Confirmation page

### Restaurant Booking Flow
1. Navigate to Restaurant page
2. Select table → Fill reservation form
3. **Auth check** → Login if needed
4. Submit reservation → Payment modal
5. Complete payment → Confirmation page

### Combined Booking
- Book hotel first → Confirmation
- Then book restaurant separately → Combined confirmation
- Both bookings are independent

## 🖼️ Images Configuration

### Current Setup
All images use Unsplash placeholder URLs that work immediately.

### To Use Your Own Images

1. **Place images in `public/` directory:**
   ```
   public/
   ├── PHOTO_1.jpg  (Hero image)
   ├── PHOTO_2.jpg  (Hotel 1)
   ├── PHOTO_3.jpg  (Hotel 2)
   ...
   ├── PHOTO_10.jpg (Hotel 10)
   ├── PHOTO_11.jpg (Restaurant)
   └── PHOTO_12.jpg (Table)
   ```

2. **Update `src/config/images.js`:**
   ```javascript
   export const IMAGES = {
     HERO_IMAGE: "/PHOTO_1.jpg",
     HOTEL1_IMAGE: "/PHOTO_2.jpg",
     HOTEL2_IMAGE: "/PHOTO_3.jpg",
     // ... etc
   };
   ```

3. **Rebuild:**
   ```bash
   npm run build
   ```

## 🧪 Testing

```bash
# Run tests once
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with UI
npm run test:ui
```

## 🎨 Design System

See `DESIGN_NOTES.md` for complete design specifications:
- Typography (Inter + Playfair Display)
- Color palette (hex codes)
- Spacing scale
- Component specifications
- Breakpoints
- Accessibility guidelines

## 🔌 Mock API Endpoints

### Authentication
- `POST /api/auth/signup` - Create account
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user

### Hotels
- `GET /api/hotels` - List all hotels
- `GET /api/hotels/:id` - Get hotel details
- `GET /api/hotels/:id/rooms` - Get hotel rooms

### Restaurants
- `GET /api/restaurants?hotelId=...` - List restaurants
- `GET /api/restaurants/:id/tables` - Get restaurant tables

### Bookings
- `POST /api/bookings` - Create hotel booking (requires auth)
- `POST /api/restaurant-bookings` - Create restaurant reservation (requires auth)
- `POST /api/payments` - Process payment (requires auth)

### Confirmations
- `GET /api/bookings/:id/confirmation` - Get booking confirmation
- `GET /api/reservations/:id/confirmation` - Get reservation confirmation

## 🚦 Routes

- `/` - Homepage
- `/hotels` - Hotels listing with filters
- `/hotels/:id` - Hotel details and booking
- `/restaurant` - Restaurant table booking
- `/confirmation` - Booking confirmation

## 🎯 Key Features Explained

### Authentication Required for Booking
- Visitors can browse all content freely
- Clicking "Book Now" or "Book Table" checks authentication
- If not logged in, login modal appears
- After login, booking continues automatically

### Separate Booking Flows
- Hotel and restaurant bookings are completely independent
- Users can book hotel only, restaurant only, or both
- Each booking has its own confirmation
- Combined bookings show both on confirmation page

### Payment Integration
- Payment modal appears after booking submission
- Multiple payment methods supported
- Realistic payment forms with validation
- Mock processing with success animation

### Table Conflict Checking
- Prevents double-booking same table at same time
- Checks date and time overlap
- Returns meaningful error messages
- Updates table availability

## 🐛 Troubleshooting

### Images not loading
- Ensure images are in `public/` directory
- Check image paths in `src/config/images.js`
- Verify file names match exactly

### Authentication not working
- Check browser console for errors
- Verify token is stored in localStorage
- Try logging out and back in

### Payment modal not appearing
- Ensure you're logged in
- Check browser console for errors
- Verify booking was created successfully

### Tests failing
- Run `npm install` to ensure dependencies are installed
- Check that test setup file exists

### Build errors
- Clear `node_modules`: `rm -rf node_modules && npm install`
- Check Node.js version (18+ required)

## 📝 Extending the System

### Adding More Hotels
Edit `src/api/mockServer.js`:
```javascript
let hotels = [
  // Add new hotel object here
  {
    id: 11,
    name: "New Hotel",
    city: "City",
    country: "Country",
    // ... other fields
  }
];
```

### Adding More Tables
Edit `src/api/mockServer.js` in the tables generation section:
```javascript
// Add more tables to any restaurant
tables[restaurantId].push({
  id: tableId++,
  label: "New Table",
  capacity: 4,
  priceExtra: 0,
  tags: ["Standard"],
  status: "available"
});
```

### Customizing Payment Methods
Edit `src/components/PaymentModal.jsx` to add new payment options.

## 🎓 Learning Resources

- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com)
- [React Router Documentation](https://reactrouter.com)

## 📄 License

This project is part of the ReserveIT Hotel Management System.

## 🤝 Support

For issues or questions:
1. Check the troubleshooting section
2. Review the code comments
3. Check browser console for errors
4. Refer to the design notes for UI questions

---

**Built with ❤️ using React, Vite, and Tailwind CSS**
