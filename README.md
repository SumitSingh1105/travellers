# 🌍 TravelGuide — "Explore. Discover. Experience."

> A complete, production-grade **MERN Stack** travel discovery and local tour guide booking platform with Google OAuth 2.0 & JWT authentication.

---

## 📖 Table of Contents

- [Project Overview](#-project-overview)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Folder Structure](#-folder-structure)
- [Google OAuth 2.0 Setup Guide](#-google-oauth-20-setup-guide)
- [Database Schema & Models](#-database-schema--models)
- [Environment Variables](#-environment-variables)
- [Installation & Quick Start](#-installation--quick-start)
- [Authentication & Role System](#-authentication--role-system)
- [API Endpoints Reference](#-api-endpoints-reference)
- [Security & Architecture](#-security--architecture)
- [Troubleshooting](#-troubleshooting)

---

## 🌟 Project Overview

**TravelGuide** is a modern travel platform connecting passionate travelers with verified local guides. It allows travelers to explore authentic destinations across India, search by category and budget, discover cultural attractions, book customized private tours with certified local guides, save favorite places, write verified reviews, and manage complete trip lifecycles.

### User Roles

1. **Traveler**: Explore destinations, search & filter, bookmark places, book tour guides with transparent daily pricing (₹ INR), track trip requests, cancel bookings, and leave verified ratings/reviews after trip completion.
2. **Guide**: Receive incoming tour booking requests, accept/decline bookings, mark trips completed, update daily rates (₹ INR), customize tour specialties/languages, toggle live availability status, and manage profile reviews.

---

## ⚡ Key Features

- 🔐 **Dual Authentication System**:
  - **Normal Auth**: Secure email/password login and registration with bcryptjs hashing and strict database validation.
  - **Google OAuth 2.0**: Official Google Identity Services integration with cryptographic server-side ID token verification using `google-auth-library`.
- 🧭 **Verified Local Guides Directory**: Live database of real registered guides. Filter by destination, languages, daily rate, and live availability.
- 📍 **Destination Explorer**: Dynamic search & category filters (Beach, Mountain, Historical, Religious, Adventure, City, Nature).
- 📅 **Dynamic Booking Engine**: Live total calculation (`Guide Daily Rate × Days`), date selection, traveler count, and lifecycle statuses (`Pending` ➔ `Confirmed` ➔ `Completed` / `Cancelled`).
- ⭐ **Verified Review System**: Only travelers who completed a booking with a guide can write reviews. Guide average ratings are dynamically recalculated.
- 💖 **Wishlist / Saved Places**: One-click bookmarking of favorite destinations.
- 📊 **Role-Specific Dashboards**: Customized controls and statistical cards for Travelers and Guides.
- 🔔 **Interactive Toast Notifications**: Instant feedback for logins, registrations, bookings, and profile updates.
- 🎨 **Responsive Tailwind CSS Design**: Glassmorphism, smooth animations, mobile drawer navigation, and skeleton loaders.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 + Vite
- **Styling**: Tailwind CSS + PostCSS + Autoprefixer
- **Routing**: React Router DOM (v6)
- **OAuth SDK**: `@react-oauth/google` + Google Identity Services (GIS)
- **Icons**: Lucide React
- **HTTP Client**: Axios (with Bearer token request interceptor)
- **State Management**: React Context API (`AuthContext`, `ToastContext`)

### Backend
- **Runtime**: Node.js
- **Server Framework**: Express.js
- **Database & ODM**: MongoDB + Mongoose (v8)
- **Authentication**: JSON Web Tokens (`jsonwebtoken`) + `bcryptjs`
- **Google Token Verification**: `google-auth-library` (OAuth2Client)
- **Security & Utilities**: CORS, `dotenv`

---

## 📁 Folder Structure

```
travel-guide/
├── client/                     # React + Vite Frontend
│   ├── public/
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── BookingModal.jsx
│   │   │   ├── DestinationCard.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── GoogleAuthButton.jsx
│   │   │   ├── GuideCard.jsx
│   │   │   ├── GuideProfileSetupModal.jsx
│   │   │   ├── Loading.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── ReviewCard.jsx
│   │   │   ├── SearchBar.jsx
│   │   │   └── Toast.jsx
│   │   ├── context/            # Global React Contexts
│   │   │   ├── AuthContext.jsx
│   │   │   └── ToastContext.jsx
│   │   ├── dashboard/          # Role-based dashboard views
│   │   │   ├── Bookings.jsx
│   │   │   ├── GuideDashboard.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── SavedPlaces.jsx
│   │   │   └── TravelerDashboard.jsx
│   │   ├── pages/              # Public & Auth pages
│   │   │   ├── About.jsx
│   │   │   ├── Contact.jsx
│   │   │   ├── DestinationDetails.jsx
│   │   │   ├── Destinations.jsx
│   │   │   ├── GuideDetails.jsx
│   │   │   ├── Guides.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── NotFound.jsx
│   │   │   └── Register.jsx
│   │   ├── services/           # Axios API services
│   │   │   ├── api.js
│   │   │   ├── authService.js
│   │   │   ├── bookingService.js
│   │   │   ├── destinationService.js
│   │   │   ├── guideService.js
│   │   │   └── reviewService.js
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
├── server/                     # Express + Mongoose Backend
│   ├── config/
│   │   └── db.js               # MongoDB connection
│   ├── controllers/            # Controller business logic
│   │   ├── authController.js
│   │   ├── bookingController.js
│   │   ├── destinationController.js
│   │   ├── guideController.js
│   │   ├── reviewController.js
│   │   └── userController.js
│   ├── middleware/             # Auth & error handling middlewares
│   │   ├── authMiddleware.js
│   │   └── errorMiddleware.js
│   ├── models/                 # Mongoose schemas
│   │   ├── Booking.js
│   │   ├── Destination.js
│   │   ├── Review.js
│   │   └── User.js
│   ├── routes/                 # Express API routes
│   │   ├── authRoutes.js
│   │   ├── bookingRoutes.js
│   │   ├── destinationRoutes.js
│   │   ├── guideRoutes.js
│   │   ├── reviewRoutes.js
│   │   └── userRoutes.js
│   ├── seed/
│   │   └── seedData.js         # Destinations seeder
│   ├── .env
│   ├── package.json
│   └── server.js
├── package.json
└── README.md
```

---

## 🔑 Google OAuth 2.0 Setup Guide

To enable **Continue with Google** on both Login and Register pages:

### Step 1: Create a Project in Google Cloud Console
1. Go to [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project named **TravelGuide**.

### Step 2: Configure OAuth Consent Screen
1. Navigate to **APIs & Services** > **OAuth consent screen**.
2. Select **External** and click **Create**.
3. Enter:
   - **App name**: `TravelGuide`
   - **User support email**: Your email
   - **Developer contact information**: Your email
4. Save and proceed to **Scopes** (default email, profile, openid are sufficient).

### Step 3: Create OAuth 2.0 Client ID
1. Navigate to **APIs & Services** > **Credentials**.
2. Click **Create Credentials** > **OAuth client ID**.
3. Application Type: **Web application**.
4. Set **Authorized JavaScript origins**:
   - `http://localhost:5173`
   - `http://127.0.0.1:5173`
5. Set **Authorized redirect URIs**:
   - `http://localhost:5173`
   - `http://localhost:5000/api/auth/google`
6. Click **Create** and copy your **Client ID**.

### Step 4: Add to Environment Variables
1. In `client/.env`:
   ```env
   VITE_GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com
   ```
2. In `server/.env`:
   ```env
   GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com
   ```

---

## 🗄️ Database Schema & Models

### 1. User (`models/User.js`)
- `name`: String (Required)
- `email`: String (Unique, Lowercase)
- `password`: String (Required only if `!googleId`, hashed with bcryptjs)
- `googleId`: String (Nullable, Google user sub ID)
- `role`: Enum (`'traveler'`, `'guide'`)
- `isProfileComplete`: Boolean (Default: `true` for travelers; `false` for Google guides until tour info is provided)
- `profileImage`: String URL
- `location`: String (Base city for tour guides)
- `bio`: String
- `languages`: Array of Strings
- `experience`: String
- `price`: Number (Daily rate in INR)
- `isAvailable`: Boolean (Default: `true`)
- `isApproved`: Boolean (Default: `true`)
- `rating`: Number (Average rating from verified reviews)
- `numReviews`: Number
- `savedDestinations`: Array of ObjectIds ref `Destination`

### 2. Destination (`models/Destination.js`)
- `name`: String (Unique)
- `location`: String
- `country`: String (Default: `'India'`)
- `category`: Enum (`'Beach'`, `'Mountain'`, `'Historical'`, `'Religious'`, `'Adventure'`, `'City'`, `'Nature'`)
- `image`: String URL
- `gallery`: Array of String URLs
- `description`: String
- `bestTime`: String
- `budget`: String
- `attractions`: Array of Strings
- `food`: Array of Strings
- `travelTips`: Array of Strings
- `rating`: Number
- `isPopular`: Boolean

### 3. Booking (`models/Booking.js`)
- `traveler`: ObjectId ref `User`
- `guide`: ObjectId ref `User`
- `destination`: ObjectId ref `Destination`
- `travelDate`: Date
- `travelers`: Number
- `days`: Number
- `message`: String
- `totalAmount`: Number (`guide.price * days`)
- `status`: Enum (`'pending'`, `'confirmed'`, `'completed'`, `'cancelled'`)

### 4. Review (`models/Review.js`)
- `user`: ObjectId ref `User`
- `guide`: ObjectId ref `User`
- `booking`: ObjectId ref `Booking`
- `rating`: Number (1–5)
- `comment`: String
- Recalculates guide's `rating` and `numReviews` on create and delete.

---

## ⚙️ Environment Variables

### Backend (`server/.env`)
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/travelguide?directConnection=true
JWT_SECRET=travelguide_super_secret_jwt_key_2026_modern_travel_platform
NODE_ENV=development
GOOGLE_CLIENT_ID=your_google_client_id_here.apps.googleusercontent.com
```

### Frontend (`client/.env`)
```env
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here.apps.googleusercontent.com
```

---

## 🚀 Installation & Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [MongoDB](https://www.mongodb.com/) running locally or MongoDB Atlas

### 1. Install Backend Dependencies
```bash
cd server
npm install
```

### 2. Install Frontend Dependencies
```bash
cd ../client
npm install
```

### 3. Seed Destinations Data
Populate the destination database:
```bash
cd ../server
npm run seed
```

### 4. Start the Backend Server
```bash
npm run dev
# Server runs on: http://localhost:5000
# Health Check: http://localhost:5000/api/health
```

### 5. Start the Frontend Client
In a separate terminal window:
```bash
cd ../client
npm run dev
# Frontend runs on: http://localhost:5173
```

---

## 🔑 Authentication & Role System

TravelGuide uses strict database-driven authentication. There are two roles:
- **Traveler**: Can browse destinations, save wishlists, and book guides.
- **Guide**: Can register their local profile, set daily rates, and manage incoming tour booking requests.

### Authentication Flows:

1. **Email / Password Login**:
   - If email is not in database ➔ Returns `404` with message `"Account not found. Please register first."`
   - If password is incorrect ➔ Returns `401` with message `"Incorrect email or password."`
2. **Continue with Google**:
   - Verifies Google ID token securely on the server via `google-auth-library`.
   - Links existing email accounts or creates new users with `role: 'traveler'` or `role: 'guide'`.
   - Google Guides are prompted to complete their tour location, daily rate, bio, and languages before appearing in public listings.

---

## 📡 API Endpoints Reference

### Authentication (`/api/auth`)
- `POST /api/auth/register` — Register a new traveler or guide
- `POST /api/auth/login` — Sign in with email and password
- `POST /api/auth/google` — Sign in / register with verified Google ID token
- `GET /api/auth/me` — Retrieve currently logged-in user profile

### Destinations (`/api/destinations`)
- `GET /api/destinations` — Get all destinations (`?search=`, `?category=`, `?popular=`)
- `GET /api/destinations/:id` — Get single destination details

### Local Guides (`/api/guides`)
- `GET /api/guides` — Get registered, completed guides (`?location=`, `?language=`, `?available=`, `?search=`)
- `GET /api/guides/:id` — Get guide profile + verified reviews
- `PUT /api/guides/:id` — Update guide profile (Self guide)

### Bookings (`/api/bookings`)
- `POST /api/bookings` — Create a new tour booking (Travelers only)
- `GET /api/bookings/my` — Get logged-in traveler's bookings
- `GET /api/bookings/guide` — Get logged-in guide's incoming requests
- `GET /api/bookings/:id` — Get single booking details
- `PUT /api/bookings/:id` — Update booking status (`pending`, `confirmed`, `completed`, `cancelled`)

### User Management & Stats (`/api/users`)
- `GET /api/users/:id` — Get user profile
- `PUT /api/users/:id` — Update user profile
- `POST /api/users/saved-destinations/:id` — Toggle bookmark on destination
- `GET /api/users/saved-destinations` — Get saved destination list
- `GET /api/users/stats/traveler` — Get traveler dashboard stats
- `GET /api/users/stats/guide` — Get guide dashboard stats

### Reviews (`/api/reviews`)
- `POST /api/reviews` — Write a verified review for a guide (Requires completed booking)
- `GET /api/reviews/guide/:guideId` — Get all reviews for a guide
- `DELETE /api/reviews/:id` — Delete review (Author only)

---

## 🔒 Security & Architecture

- **Server-Side Token Verification**: Uses Google's official `OAuth2Client.verifyIdToken` to cryptographically validate tokens before trusting credentials.
- **JWT Authentication**: TravelGuide signs its own JWT token (`HS256`, 30d expiry) so all existing protected routes and middlewares remain unified.
- **Passwords**: Hashed with bcryptjs (10 salt rounds), excluded from database queries (`select: false`).
- **Protected Routes**: React Router wrapper (`ProtectedRoute`) redirects unauthorized visits.

---

## ❓ Troubleshooting

1. **Google Client ID not configured**:
   - Ensure `VITE_GOOGLE_CLIENT_ID` is defined in `client/.env` and `GOOGLE_CLIENT_ID` in `server/.env`.
   - Ensure authorized origins in Google Cloud Console include `http://localhost:5173`.
2. **MongoDB Connection Failed**:
   - Ensure MongoDB service is running locally on port 27017.
   - Connection URI: `mongodb://127.0.0.1:27017/travelguide?directConnection=true`.
3. **CORS Errors**:
   - Express backend has `cors({ origin: '*' })` configured.

---

## 📄 License

MIT © 2026 TravelGuide. Built with precision and care.


