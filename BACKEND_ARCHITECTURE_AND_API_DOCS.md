# 🚀 Jodhpur Voyage - Complete Backend Architecture & API Flow Specification
**Tech Stack:** Node.js, Express.js, MongoDB (Mongoose), JWT, Cloudinary/S3, Redis (Optional/Scalability)

---

## 📑 Table of Contents
1. [System Architecture & Directory Structure](#1-system-architecture--directory-structure)
2. [Environment Configuration (.env.example)](#2-environment-configuration-envexample)
3. [Database Design & Mongoose Schemas](#3-database-design--mongoose-schemas)
4. [Authentication, Authorization & Security Flow](#4-authentication-authorization--security-flow)
5. [Complete API Endpoints & Payload Specifications](#5-complete-api-endpoints--payload-specifications)
   - [Module 1: Auth & User Profile APIs](#module-1-auth--user-profile-apis)
   - [Module 2: Destination Categories (Regions) APIs](#module-2-destination-categories-regions-apis)
   - [Module 3: Cities & Destinations APIs](#module-3-cities--destinations-apis)
   - [Module 4: Tour Packages APIs](#module-4-tour-packages-apis)
   - [Module 5: Bookings & Orders APIs](#module-5-bookings--orders-apis)
   - [Module 6: Enquiries & Lead Management APIs](#module-6-enquiries--lead-management-apis)
   - [Module 7: Reviews & Ratings APIs](#module-7-reviews--ratings-apis)
   - [Module 8: Blogs & Travel Articles APIs](#module-8-blogs--travel-articles-apis)
   - [Module 9: Customer & User Management APIs](#module-9-customer--user-management-apis)
   - [Module 10: Team Members APIs](#module-10-team-members-apis)
   - [Module 11: System Settings & Site Config APIs](#module-11-system-settings--site-config-apis)
   - [Module 12: Admin Analytics & Reports APIs](#module-12-admin-analytics--reports-apis)
   - [Module 13: Media & File Upload APIs](#module-13-media--file-upload-apis)
6. [Standardized Error Handling & Response Wrapper](#6-standardized-error-handling--response-wrapper)
7. [Validation, Security & Scalability Blueprint](#7-validation-security--scalability-blueprint)
8. [Step-by-Step Implementation Guide](#8-step-by-step-implementation-guide)

---

## 1. System Architecture & Directory Structure

To ensure enterprise-grade modularity, clean code principles, and horizontal scalability, follow this Production Directory Structure:

```plaintext
backend/
├── src/
│   ├── config/                  # DB connection, Cloudinary, Redis, Mailer configs
│   │   ├── db.js
│   │   ├── cloudinary.js
│   │   ├── redis.js
│   │   └── mailer.js
│   │
│   ├── constants/               # Enums, roles, status codes
│   │   ├── roles.js
│   │   └── statusCodes.js
│   │
│   ├── controllers/             # Business logic handlers
│   │   ├── auth.controller.js
│   │   ├── category.controller.js
│   │   ├── city.controller.js
│   │   ├── tour.controller.js
│   │   ├── booking.controller.js
│   │   ├── enquiry.controller.js
│   │   ├── review.controller.js
│   │   ├── blog.controller.js
│   │   ├── customer.controller.js
│   │   ├── team.controller.js
│   │   ├── setting.controller.js
│   │   ├── analytics.controller.js
│   │   └── upload.controller.js
│   │
│   ├── middlewares/             # Auth, validation, error handler, rate limiters
│   │   ├── auth.middleware.js       # JWT verify & RBAC
│   │   ├── error.middleware.js      # Global error catch
│   │   ├── validate.middleware.js   # Zod/Joi schema validator
│   │   ├── upload.middleware.js     # Multer config
│   │   └── rateLimiter.middleware.js
│   │
│   ├── models/                  # Mongoose data models
│   │   ├── User.js
│   │   ├── DestinationCategory.js
│   │   ├── City.js
│   │   ├── Tour.js
│   │   ├── Booking.js
│   │   ├── Enquiry.js
│   │   ├── Review.js
│   │   ├── Blog.js
│   │   ├── Team.js
│   │   └── Setting.js
│   │
│   ├── routes/                  # Express API route declarations
│   │   ├── index.js             # Main router aggregating all routes
│   │   ├── auth.routes.js
│   │   ├── category.routes.js
│   │   ├── city.routes.js
│   │   ├── tour.routes.js
│   │   ├── booking.routes.js
│   │   ├── enquiry.routes.js
│   │   ├── review.routes.js
│   │   ├── blog.routes.js
│   │   ├── customer.routes.js
│   │   ├── team.routes.js
│   │   ├── setting.routes.js
│   │   ├── analytics.routes.js
│   │   └── upload.routes.js
│   │
│   ├── services/                # Reusable business services (Email, Payment, Cache)
│   │   ├── email.service.js
│   │   ├── payment.service.js
│   │   └── cache.service.js
│   │
│   ├── utils/                   # Helpers, ApiError, ApiResponse, AsyncHandler
│   │   ├── ApiError.js
│   │   ├── ApiResponse.js
│   │   ├── asyncHandler.js
│   │   └── slugify.js
│   │
│   ├── validations/             # Zod or Joi schemas for request bodies
│   │   ├── auth.validation.js
│   │   ├── tour.validation.js
│   │   ├── city.validation.js
│   │   └── booking.validation.js
│   │
│   ├── app.js                   # Express app configuration & middlewares
│   └── server.js                # Server entry point & DB connection
│
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

---

## 2. Environment Configuration (.env.example)

```env
# Server
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000
ADMIN_URL=http://localhost:3000

# MongoDB
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/jodhpur_voyage?retryWrites=true&w=majority

# JWT Secrets
JWT_ACCESS_SECRET=supersecretaccesskey_9481948172381293
JWT_ACCESS_EXPIRES_IN=1d
JWT_REFRESH_SECRET=supersecretrefreshkey_9481948172381293_refresh
JWT_REFRESH_EXPIRES_IN=7d

# Cloudinary (Image Storage)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Razorpay / Payment Gateway
RAZORPAY_KEY_ID=rzp_test_xxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxx
RAZORPAY_WEBHOOK_SECRET=xxxxxxx

# SMTP / Email Service
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
EMAIL_FROM="Jodhpur Voyage" <no-reply@jodhpurvoyage.com>
ADMIN_NOTIFICATION_EMAIL=admin@jodhpurvoyage.com

# Redis Cache (Optional for high performance)
REDIS_URL=redis://127.0.0.1:6379
```

---

## 3. Database Design & Mongoose Schemas

### 3.1. User Schema (`models/User.js`)
```javascript
const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
  password: { type: String, required: true, select: false },
  role: { 
    type: String, 
    enum: ['Super Admin', 'Admin', 'Editor', 'Customer'], 
    default: 'Customer' 
  },
  phone: { type: String, trim: true },
  avatar: { type: String, default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150' },
  status: { type: String, enum: ['Active', 'Blocked', 'Pending'], default: 'Active' },
  permissions: [{ type: String }], // e.g. ['tours', 'destinations', 'blogs', 'enquiries', 'all']
  refreshToken: { type: String, select: false },
  passwordResetToken: { type: String },
  passwordResetExpires: { type: Date },
  lastLogin: { type: Date }
}, { timestamps: true });

// Indexes & methods for password hashing & JWT generation
```

### 3.2. Destination Category Schema (`models/DestinationCategory.js`)
```javascript
const destinationCategorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true, index: true },
  tagline: { type: String, default: '' },
  description: { type: String, default: '' },
  coverImage: { type: String, required: true },
  order: { type: Number, default: 0 },
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' }
}, { timestamps: true });
```

### 3.3. City / Destination Schema (`models/City.js`)
```javascript
const citySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true, index: true },
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'DestinationCategory', required: true, index: true },
  categoryName: { type: String, required: true },
  state: { type: String, required: true },
  tagline: { type: String, default: '' },
  heroTitle: { type: String, default: '' },
  metaTitle: { type: String, default: '' },
  metaDescription: { type: String, default: '' },
  keywords: { type: String, default: '' },
  bannerImage: { type: String, required: true },
  gallery: [{ type: String }],
  highlights: [{ type: String }],
  faqs: [{
    question: { type: String, required: true },
    answer: { type: String, required: true }
  }],
  packagesCount: { type: Number, default: 0 },
  featured: { type: Boolean, default: false },
  status: { type: String, enum: ['Published', 'Draft'], default: 'Published' }
}, { timestamps: true });

// Compound text index for powerful search
citySchema.index({ name: 'text', state: 'text', tagline: 'text', keywords: 'text' });
```

### 3.4. Tour Package Schema (`models/Tour.js`)
```javascript
const tourSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true, index: true },
  cityId: { type: mongoose.Schema.Types.ObjectId, ref: 'City', required: true, index: true },
  cityName: { type: String, required: true },
  category: { type: String, required: true }, // e.g., 'Royal Heritage', 'Desert Safari', 'Culture & Food'
  price: { type: Number, required: true, min: 0 },
  originalPrice: { type: Number, min: 0 },
  duration: { type: String, required: true }, // e.g. "3 Days / 2 Nights"
  groupSize: { type: String, default: "Max 12 People" },
  location: { type: String, required: true },
  image: { type: String, required: true },
  gallery: [{ type: String }],
  overview: { type: String, required: true },
  highlights: [{ type: String }],
  itinerary: [{
    day: { type: Number, required: true },
    title: { type: String, required: true },
    desc: { type: String, required: true },
    meals: { type: String },
    stay: { type: String }
  }],
  inclusions: [{ type: String }],
  exclusions: [{ type: String }],
  faqs: [{
    question: { type: String },
    answer: { type: String }
  }],
  rating: { type: Number, default: 5.0, min: 1, max: 5 },
  reviewsCount: { type: Number, default: 0 },
  badge: { type: String, default: '' }, // e.g. "Bestseller", "Featured", "Trending"
  featured: { type: Boolean, default: false },
  status: { type: String, enum: ['Active', 'Draft', 'Inactive'], default: 'Active' },
  totalBookings: { type: Number, default: 0 }
}, { timestamps: true });

tourSchema.index({ title: 'text', location: 'text', overview: 'text' });
tourSchema.index({ price: 1, rating: -1 });
```

### 3.5. Booking / Order Schema (`models/Booking.js`)
```javascript
const bookingSchema = new mongoose.Schema({
  bookingNumber: { type: String, required: true, unique: true, index: true }, // e.g. "BK-2026-9041"
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  tourId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tour', required: true, index: true },
  tourTitle: { type: String, required: true },
  customerName: { type: String, required: true, trim: true },
  customerEmail: { type: String, required: true, lowercase: true, trim: true, index: true },
  customerPhone: { type: String, required: true, trim: true },
  travelDate: { type: Date, required: true },
  guests: {
    adults: { type: Number, default: 1, min: 1 },
    children: { type: Number, default: 0, min: 0 }
  },
  totalAmount: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled'], 
    default: 'Confirmed',
    index: true 
  },
  paymentStatus: { 
    type: String, 
    enum: ['Pending', 'Paid', 'Refunded', 'Failed'], 
    default: 'Pending',
    index: true 
  },
  paymentMethod: { type: String, default: 'Razorpay' },
  paymentDetails: {
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
    razorpaySignature: { type: String }
  },
  specialRequests: { type: String, default: '' },
  cancellationReason: { type: String, default: '' }
}, { timestamps: true });
```

### 3.6. Enquiry / Lead Schema (`models/Enquiry.js`)
```javascript
const enquirySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  phone: { type: String, required: true, trim: true },
  tourId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tour' },
  tourTitle: { type: String },
  cityId: { type: mongoose.Schema.Types.ObjectId, ref: 'City' },
  travelDate: { type: Date },
  guestsCount: { type: Number, default: 1 },
  message: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['General Contact', 'Custom Tour', 'Package Booking Enquiry'], 
    default: 'General Contact' 
  },
  status: { 
    type: String, 
    enum: ['New', 'In Progress', 'Contacted', 'Converted', 'Closed'], 
    default: 'New',
    index: true 
  },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  notes: [{
    note: String,
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });
```

### 3.7. Review Schema (`models/Review.js`)
```javascript
const reviewSchema = new mongoose.Schema({
  tourId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tour', index: true },
  tourTitle: { type: String },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  authorName: { type: String, required: true, trim: true },
  authorAvatar: { type: String, default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150' },
  authorLocation: { type: String, default: 'India' },
  rating: { type: Number, required: true, min: 1, max: 5 },
  title: { type: String, required: true },
  comment: { type: String, required: true },
  photos: [{ type: String }],
  status: { 
    type: String, 
    enum: ['Approved', 'Pending', 'Rejected'], 
    default: 'Approved',
    index: true 
  },
  featured: { type: Boolean, default: false }
}, { timestamps: true });
```

### 3.8. Blog / Article Schema (`models/Blog.js`)
```javascript
const blogSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true, index: true },
  excerpt: { type: String, required: true },
  content: { type: String, required: true }, // HTML or Markdown
  coverImage: { type: String, required: true },
  category: { type: String, required: true }, // e.g. "Travel Guide", "Food & Culture", "Heritage"
  tags: [{ type: String }],
  author: {
    name: { type: String, required: true },
    avatar: { type: String, default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150' },
    role: { type: String, default: 'Travel Specialist' }
  },
  readTime: { type: String, default: '4 min read' },
  views: { type: Number, default: 0 },
  featured: { type: Boolean, default: false },
  status: { type: String, enum: ['Published', 'Draft'], default: 'Published', index: true },
  publishedAt: { type: Date, default: Date.now }
}, { timestamps: true });

blogSchema.index({ title: 'text', excerpt: 'text', tags: 'text' });
```

### 3.9. Team Member Schema (`models/Team.js`)
```javascript
const teamSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true }, // e.g., "Founder & Chief Explorer", "Lead Jodhpur Guide"
  bio: { type: String, required: true },
  image: { type: String, required: true },
  order: { type: Number, default: 0 },
  experienceYears: { type: Number, default: 5 },
  socials: {
    instagram: { type: String, default: '' },
    twitter: { type: String, default: '' },
    linkedin: { type: String, default: '' }
  },
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' }
}, { timestamps: true });
```

### 3.10. Settings Schema (`models/Setting.js`)
```javascript
const settingSchema = new mongoose.Schema({
  siteName: { type: String, default: 'Jodhpur Voyage' },
  siteTagline: { type: String, default: 'Curated Heritage & Experiential Tours' },
  supportEmail: { type: String, default: 'contact@jodhpurvoyage.com' },
  supportPhone: { type: String, default: '+91 98290 12345' },
  address: { type: String, default: 'Clock Tower Square, Old City, Jodhpur, Rajasthan 342001' },
  socialLinks: {
    instagram: { type: String, default: 'https://instagram.com' },
    facebook: { type: String, default: 'https://facebook.com' },
    youtube: { type: String, default: 'https://youtube.com' }
  },
  currency: { type: String, default: 'INR' },
  currencySymbol: { type: String, default: '₹' },
  bookingConfirmationEmail: { type: Boolean, default: true },
  maintenanceMode: { type: Boolean, default: false }
}, { timestamps: true });
```

---

## 4. Authentication, Authorization & Security Flow

### 4.1. Auth Flow Diagram
```
Client (Next.js)                  Backend (Express + Mongo)
  |                                   |
  |--- 1. POST /api/v1/auth/login --->|
  |    { email, password }            | Validate user credentials & bcrypt hash
  |                                   | Generate Access Token (15m-1d) + Refresh Token (7d)
  |<-- 2. HTTP 200 OK ----------------| Set Refresh Token in HttpOnly Cookie
  |    { accessToken, user }          |
  |                                   |
  |--- 3. GET /api/v1/admin/... ----->| Bearer <accessToken> in Header
  |                                   | Verify JWT -> Check Role in ['Super Admin', 'Admin']
  |<-- 4. HTTP 200 (Protected Data) --|
  |                                   |
  |--- 5. (If Access Token Expired) ->|
  |    POST /api/v1/auth/refresh ---->| Verify HttpOnly Cookie Refresh Token -> Issue new Access Token
  |<-- 6. HTTP 200 { accessToken } ---|
```

### 4.2. Role-Based Access Control (RBAC) Middleware Logic
- **Public**: No token required. (View tours, cities, categories, blogs, submit enquiries, create bookings).
- **Customer**: `role: 'Customer' | 'Admin' | 'Super Admin'`. (View own bookings, profile).
- **Editor**: `role: 'Editor' | 'Admin' | 'Super Admin'`. (Manage blogs, view reviews).
- **Admin**: `role: 'Admin' | 'Super Admin'`. (Manage tours, cities, categories, bookings, enquiries, view analytics).
- **Super Admin**: `role: 'Super Admin'`. (Full access + manage staff users + system settings + delete critical entities).

---

## 5. Complete API Endpoints & Payload Specifications

### Global Base URL:
`/api/v1`

---

### Module 1: Auth & User Profile APIs

#### 1.1 `POST /auth/login`
- **Access**: Public
- **Description**: Authenticate Admin, Staff, or Customer with email/password.
- **Request Body**:
```json
{
  "email": "admin@jodhpurvoyage.com",
  "password": "jodhpur@2025"
}
```
- **Success Response (200 OK)**:
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "65b8fae90432f9001234abcd",
      "name": "Harshit Sharma",
      "email": "admin@jodhpurvoyage.com",
      "role": "Super Admin",
      "phone": "+91 98290 12345",
      "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
      "permissions": ["all"]
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```
- **Error Response (401 Unauthorized)**:
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

#### 1.2 `POST /auth/register`
- **Access**: Public
- **Request Body**:
```json
{
  "name": "Rahul Verma",
  "email": "rahul@example.com",
  "password": "StrongPassword123!",
  "phone": "+91 98765 43210"
}
```
- **Success Response (201 Created)**:
```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "user": {
      "id": "65b8fae90432f9001234abce",
      "name": "Rahul Verma",
      "email": "rahul@example.com",
      "role": "Customer"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### 1.3 `GET /auth/me`
- **Access**: Private (Bearer Token)
- **Success Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "id": "65b8fae90432f9001234abcd",
    "name": "Harshit Sharma",
    "email": "admin@jodhpurvoyage.com",
    "role": "Super Admin",
    "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"
  }
}
```

#### 1.4 `POST /auth/refresh`
- **Access**: Public (HttpOnly Cookie with Refresh Token)
- **Success Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### 1.5 `POST /auth/logout`
- **Access**: Private (Bearer Token)
- **Success Response (200 OK)**:
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

### Module 2: Destination Categories (Regions) APIs

#### 2.1 `GET /destination-categories`
- **Access**: Public
- **Query Params**: `status=Active`
- **Success Response (200 OK)**:
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "id": "65b8f9e00000000000000001",
      "name": "North India",
      "slug": "north-india",
      "tagline": "Royal Forts, Desert Dunes & Himalayan Valleys",
      "description": "Explore Rajasthan palaces, Delhi heritage, and Golden Triangle circuits.",
      "coverImage": "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800",
      "order": 1,
      "status": "Active"
    }
  ]
}
```

#### 2.2 `POST /destination-categories`
- **Access**: Admin / Super Admin
- **Request Body**:
```json
{
  "name": "Central India",
  "slug": "central-india",
  "tagline": "Tiger Sanctuaries & Khajuraho Temples",
  "description": "Heart of India wildlife and ancient stone carvings.",
  "coverImage": "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800",
  "order": 6,
  "status": "Active"
}
```
- **Success Response (201 Created)**:
```json
{
  "success": true,
  "message": "Category created successfully",
  "data": { "id": "65b8f9e00000000000000006", "name": "Central India", "slug": "central-india" }
}
```

#### 2.3 `PUT /destination-categories/:id`
- **Access**: Admin / Super Admin
- **Request Body**: Partial or full fields to update.
- **Success Response (200 OK)**: Returns updated category object.

#### 2.4 `DELETE /destination-categories/:id`
- **Access**: Super Admin
- **Success Response (200 OK)**:
```json
{
  "success": true,
  "message": "Category removed successfully",
  "deletedId": "65b8f9e00000000000000006"
}
```

---

### Module 3: Cities & Destinations APIs

#### 3.1 `GET /cities`
- **Access**: Public
- **Query Params**:
  - `categoryId`: Filter by category ID
  - `search`: Full text search on name, state, tagline
  - `status`: `Published` | `Draft` | `All`
  - `featured`: `true` | `false`
  - `page`: `1` (default)
  - `limit`: `20` (default)
- **Success Response (200 OK)**:
```json
{
  "success": true,
  "count": 1,
  "total": 12,
  "page": 1,
  "totalPages": 1,
  "data": [
    {
      "id": "65b8f9e10000000000000001",
      "name": "Jodhpur",
      "slug": "jodhpur",
      "categoryId": "65b8f9e00000000000000001",
      "categoryName": "North India",
      "state": "Rajasthan",
      "tagline": "The Legendary Sun City & Blue Heritage Capital",
      "heroTitle": "Discover Royal Jodhpur: Forts, Palaces & Desert Safaris",
      "metaTitle": "Jodhpur Tour Packages & Blue City Sightseeing | Jodhpur Voyage",
      "metaDescription": "Explore the majestic Mehrangarh Fort, blue city walking trails, Umaid Bhawan palace...",
      "keywords": "jodhpur tours, blue city walk, mehrangarh fort tour",
      "bannerImage": "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=1200",
      "gallery": ["https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=800"],
      "highlights": ["Mehrangarh Fort", "Toorji Ka Jhalra Stepwell", "Osian Desert Dunes"],
      "faqs": [
        { "question": "What is the best time to visit Jodhpur?", "answer": "October to March" }
      ],
      "packagesCount": 6,
      "status": "Published",
      "featured": true
    }
  ]
}
```

#### 3.2 `GET /cities/:idOrSlug`
- **Access**: Public
- **Description**: Fetch city by MongoDB `_id` OR human-readable `slug`.
- **Success Response (200 OK)**: Returns full city object.

#### 3.3 `POST /cities`
- **Access**: Admin / Super Admin
- **Request Body**:
```json
{
  "name": "Udaipur",
  "categoryId": "65b8f9e00000000000000001",
  "state": "Rajasthan",
  "tagline": "The City of Lakes & Royal Venetian Palaces",
  "heroTitle": "Romantic Udaipur: Lake Pichola, City Palace & Jag Mandir",
  "metaTitle": "Udaipur Tour Packages | Lake Pichola Sightseeing",
  "metaDescription": "Experience royal Lake Pichola boat cruises and grand palaces in Udaipur.",
  "bannerImage": "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=1200",
  "gallery": [
    "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800"
  ],
  "highlights": ["City Palace", "Lake Pichola Sunset Boat", "Saheliyon Ki Bari"],
  "faqs": [
    { "question": "Is Udaipur safe for solo travelers?", "answer": "Yes, highly hospitable." }
  ],
  "featured": true,
  "status": "Published"
}
```
- **Success Response (201 Created)**: Returns created city.

#### 3.4 `PUT /cities/:id`
- **Access**: Admin / Super Admin
- **Success Response (200 OK)**: Returns updated city object.

#### 3.5 `DELETE /cities/:id`
- **Access**: Super Admin
- **Success Response (200 OK)**:
```json
{
  "success": true,
  "message": "City removed successfully",
  "deletedId": "65b8f9e10000000000000001"
}
```

---

### Module 4: Tour Packages APIs

#### 4.1 `GET /tours`
- **Access**: Public
- **Query Params**:
  - `category`: Filter by category (e.g. `Desert Safari`, `Royal Heritage`)
  - `cityId`: Filter by destination city
  - `search`: Query title or location
  - `minPrice` / `maxPrice`: Price range filtering
  - `duration`: Filter by days
  - `status`: `Active` | `Draft`
  - `featured`: `true` | `false`
  - `sort`: `price_asc` | `price_desc` | `rating` | `newest` (default)
  - `page`: `1`
  - `limit`: `12`
- **Success Response (200 OK)**:
```json
{
  "success": true,
  "count": 1,
  "total": 18,
  "page": 1,
  "totalPages": 2,
  "data": [
    {
      "id": "65b8fa110000000000000001",
      "title": "Royal Jodhpur & Thar Desert Safari",
      "slug": "royal-jodhpur-thar-desert-safari",
      "cityId": "65b8f9e10000000000000001",
      "cityName": "Jodhpur",
      "category": "Royal Heritage",
      "price": 14999,
      "originalPrice": 19999,
      "duration": "3 Days / 2 Nights",
      "groupSize": "Max 10 People",
      "location": "Jodhpur & Osian Desert",
      "image": "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800",
      "gallery": ["https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=800"],
      "overview": "Immerse in the timeless opulence of Marwar with private guided access...",
      "highlights": ["Exclusive guided tour of Mehrangarh Fort", "Overnight Swiss tent in Thar Desert"],
      "itinerary": [
        {
          "day": 1,
          "title": "Arrival in Blue City & Heritage Walk",
          "desc": "Check-in at heritage Haveli followed by sunset blue walking trail.",
          "meals": "Dinner Included",
          "stay": "Pal Haveli Jodhpur"
        }
      ],
      "inclusions": ["AC Luxury SUV Transport", "All Heritage Entry Tickets", "Daily Buffet Breakfast"],
      "exclusions": ["Airfare / Train Tickets", "Personal Tips & Beverages"],
      "faqs": [{ "question": "Are vegetarian meals provided?", "answer": "Yes, authentic Rajasthani vegetarian cuisine." }],
      "rating": 4.9,
      "reviewsCount": 38,
      "badge": "Bestseller",
      "featured": true,
      "status": "Active"
    }
  ]
}
```

#### 4.2 `GET /tours/:idOrSlug`
- **Access**: Public
- **Description**: Fetch tour details by ID or Slug.
- **Success Response (200 OK)**: Returns full tour package details with embedded itinerary.

#### 4.3 `POST /tours`
- **Access**: Admin / Super Admin
- **Request Body**: Full tour object conforming to Tour Schema.
- **Success Response (201 Created)**: Returns created tour object.

#### 4.4 `PUT /tours/:id`
- **Access**: Admin / Super Admin
- **Success Response (200 OK)**: Returns updated tour object.

#### 4.5 `DELETE /tours/:id`
- **Access**: Super Admin
- **Success Response (200 OK)**:
```json
{
  "success": true,
  "message": "Tour deleted successfully",
  "deletedId": "65b8fa110000000000000001"
}
```

---

### Module 5: Bookings & Orders APIs

#### 5.1 `POST /bookings` (Create Booking / Checkout)
- **Access**: Public / Authenticated
- **Request Body**:
```json
{
  "tourId": "65b8fa110000000000000001",
  "tourTitle": "Royal Jodhpur & Thar Desert Safari",
  "customerName": "Amit Sharma",
  "customerEmail": "amit.sharma@gmail.com",
  "customerPhone": "+91 98112 33445",
  "travelDate": "2026-10-15",
  "guests": {
    "adults": 2,
    "children": 1
  },
  "totalAmount": 34998,
  "paymentMethod": "Razorpay",
  "specialRequests": "Pickup needed from Jodhpur Airport."
}
```
- **Success Response (201 Created)**:
```json
{
  "success": true,
  "message": "Booking created successfully",
  "data": {
    "id": "65b8fb010000000000000001",
    "bookingNumber": "BK-2026-8812",
    "status": "Confirmed",
    "paymentStatus": "Paid",
    "customerName": "Amit Sharma",
    "customerEmail": "amit.sharma@gmail.com",
    "totalAmount": 34998,
    "travelDate": "2026-10-15T00:00:00.000Z",
    "createdAt": "2026-09-11T05:14:00.000Z"
  }
}
```

#### 5.2 `GET /bookings`
- **Access**: Admin / Super Admin (Customers can only view their own via `/bookings/my-bookings`)
- **Query Params**:
  - `status`: `All` | `Confirmed` | `Pending` | `Completed` | `Cancelled`
  - `paymentStatus`: `Paid` | `Pending` | `Refunded`
  - `search`: Query name, email, bookingNumber, or tourTitle
  - `page`: `1`
  - `limit`: `20`
- **Success Response (200 OK)**:
```json
{
  "success": true,
  "count": 10,
  "total": 54,
  "page": 1,
  "data": [
    {
      "id": "65b8fb010000000000000001",
      "bookingNumber": "BK-2026-8812",
      "customerName": "Amit Sharma",
      "customerEmail": "amit.sharma@gmail.com",
      "customerPhone": "+91 98112 33445",
      "tourTitle": "Royal Jodhpur & Thar Desert Safari",
      "travelDate": "2026-10-15T00:00:00.000Z",
      "totalAmount": 34998,
      "status": "Confirmed",
      "paymentStatus": "Paid",
      "createdAt": "2026-09-11T05:14:00.000Z"
    }
  ]
}
```

#### 5.3 `GET /bookings/:id`
- **Access**: Admin or Booking Owner
- **Success Response (200 OK)**: Returns full booking details.

#### 5.4 `PATCH /bookings/:id/status`
- **Access**: Admin / Super Admin
- **Request Body**:
```json
{
  "status": "Completed"
}
```
- **Success Response (200 OK)**:
```json
{
  "success": true,
  "message": "Booking marked as Completed",
  "data": { "id": "65b8fb010000000000000001", "status": "Completed" }
}
```

#### 5.5 `POST /bookings/:id/cancel`
- **Access**: Admin or Booking Owner
- **Request Body**:
```json
{
  "reason": "Customer requested date rescheduling cancellation"
}
```
- **Success Response (200 OK)**:
```json
{
  "success": true,
  "message": "Booking cancelled successfully",
  "data": { "id": "65b8fb010000000000000001", "status": "Cancelled", "paymentStatus": "Refunded" }
}
```

---

### Module 6: Enquiries & Lead Management APIs

#### 6.1 `POST /enquiries` (Submit Lead Form)
- **Access**: Public
- **Request Body**:
```json
{
  "name": "Dr. Ananya Sen",
  "email": "ananya.sen@gmail.com",
  "phone": "+91 99887 66554",
  "tourId": "65b8fa110000000000000001",
  "tourTitle": "Royal Jodhpur & Thar Desert Safari",
  "travelDate": "2026-11-20",
  "guestsCount": 4,
  "type": "Custom Tour",
  "message": "We require a private royal dinner at Mehrangarh Fort terrace and luxury tempo traveler."
}
```
- **Success Response (201 Created)**:
```json
{
  "success": true,
  "message": "Enquiry submitted successfully. Our travel concierge will reach out within 2 hours.",
  "data": { "id": "65b8fc010000000000000001", "status": "New" }
}
```

#### 6.2 `GET /enquiries`
- **Access**: Admin / Staff
- **Query Params**: `status=New` | `search=Ananya` | `page=1`
- **Success Response (200 OK)**: Returns paginated list of leads.

#### 6.3 `PATCH /enquiries/:id/status`
- **Access**: Admin / Staff
- **Request Body**:
```json
{
  "status": "In Progress",
  "assignedTo": "65b8fae90432f9001234abcd",
  "note": "Called customer. Shared custom PDF itinerary via WhatsApp."
}
```
- **Success Response (200 OK)**: Returns updated enquiry object.

#### 6.4 `DELETE /enquiries/:id`
- **Access**: Super Admin
- **Success Response (200 OK)**: Deletes lead record.

---

### Module 7: Reviews & Ratings APIs

#### 7.1 `GET /reviews`
- **Access**: Public
- **Query Params**: `tourId`, `featured=true`, `status=Approved`, `page=1`
- **Success Response (200 OK)**:
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "id": "65b8fd010000000000000001",
      "authorName": "Sunita & Rajesh Nair",
      "authorLocation": "Bangalore, India",
      "rating": 5,
      "tourTitle": "Royal Jodhpur & Thar Desert Safari",
      "title": "Unforgettable Blue City Hospitality!",
      "comment": "The private sunset walk and dinner in Osian dunes under the starlit sky was pure magic.",
      "status": "Approved",
      "createdAt": "2026-09-05T10:00:00.000Z"
    }
  ]
}
```

#### 7.2 `POST /reviews`
- **Access**: Public / Customer
- **Request Body**:
```json
{
  "tourId": "65b8fa110000000000000001",
  "authorName": "Sunita Nair",
  "rating": 5,
  "title": "Unforgettable Hospitality",
  "comment": "Brilliant service from guide Vikram!"
}
```
- **Success Response (201 Created)**: Automatically triggers re-calculation of `Tour.rating` and `Tour.reviewsCount`.

#### 7.3 `PATCH /reviews/:id/status`
- **Access**: Admin / Editor
- **Request Body**: `{ "status": "Approved" | "Rejected" }`

---

### Module 8: Blogs & Travel Articles APIs

#### 8.1 `GET /blogs`
- **Access**: Public
- **Query Params**: `category`, `tag`, `search`, `status=Published`, `page=1`, `limit=10`
- **Success Response (200 OK)**:
```json
{
  "success": true,
  "count": 6,
  "data": [
    {
      "id": "65b8fe010000000000000001",
      "title": "Top 10 Hidden Photography Spots in Jodhpur's Blue City",
      "slug": "top-10-hidden-photography-spots-jodhpur-blue-city",
      "excerpt": "Venture beyond the tourist hotspots into the narrow, indigo-drenched alleys...",
      "coverImage": "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800",
      "category": "Travel Guide",
      "tags": ["Photography", "Heritage", "Jodhpur"],
      "readTime": "5 min read",
      "views": 1420,
      "status": "Published",
      "publishedAt": "2026-09-01T08:00:00.000Z"
    }
  ]
}
```

#### 8.2 `GET /blogs/:idOrSlug`
- **Access**: Public (Increments `views` count by +1 atomically)
- **Success Response (200 OK)**: Returns full blog article content.

#### 8.3 `POST /blogs`
- **Access**: Admin / Editor
- **Request Body**: Full blog payload.
- **Success Response (201 Created)**: Returns created blog.

#### 8.4 `PUT /blogs/:id`
- **Access**: Admin / Editor

#### 8.5 `DELETE /blogs/:id`
- **Access**: Admin / Super Admin

---

### Module 9: Customer & User Management APIs

#### 9.1 `GET /customers`
- **Access**: Admin / Super Admin
- **Query Params**: `search`, `status`, `page`, `limit`
- **Success Response (200 OK)**:
```json
{
  "success": true,
  "count": 10,
  "total": 128,
  "data": [
    {
      "id": "65b8ff010000000000000001",
      "name": "Amit Sharma",
      "email": "amit.sharma@gmail.com",
      "phone": "+91 98112 33445",
      "totalBookings": 2,
      "totalSpent": 64998,
      "status": "Active",
      "lastBookingDate": "2026-09-11"
    }
  ]
}
```

#### 9.2 `GET /users/staff` (Staff & Admin Users)
- **Access**: Super Admin
- **Success Response (200 OK)**: Returns list of team members with roles and permissions.

#### 9.3 `POST /users/staff` (Create Staff Member)
- **Access**: Super Admin
- **Request Body**: `{ "name": "...", "email": "...", "password": "...", "role": "Admin", "permissions": ["tours", "blogs"] }`

#### 9.4 `PATCH /users/:id/status` (Block/Unblock)
- **Access**: Super Admin

---

### Module 10: Team Members APIs

#### 10.1 `GET /team`
- **Access**: Public
- **Success Response (200 OK)**: Returns active tour guides and executive team.

#### 10.2 `POST /team`
- **Access**: Admin / Super Admin
- **Request Body**: `{ "name": "...", "role": "Lead Guide", "bio": "...", "image": "...", "experienceYears": 8 }`

#### 10.3 `PUT /team/:id` & `DELETE /team/:id`
- **Access**: Admin / Super Admin

---

### Module 11: System Settings & Site Config APIs

#### 11.1 `GET /settings`
- **Access**: Public (Sanitized public contact info) / Private (Full config for Admin)
- **Success Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "siteName": "Jodhpur Voyage",
    "siteTagline": "Curated Heritage & Experiential Tours",
    "supportEmail": "contact@jodhpurvoyage.com",
    "supportPhone": "+91 98290 12345",
    "address": "Clock Tower Square, Old City, Jodhpur, Rajasthan 342001",
    "socialLinks": {
      "instagram": "https://instagram.com/jodhpurvoyage",
      "facebook": "https://facebook.com/jodhpurvoyage"
    }
  }
}
```

#### 11.2 `PUT /settings`
- **Access**: Super Admin
- **Request Body**: Updated settings object.

---

### Module 12: Admin Analytics & Reports APIs

#### 12.1 `GET /analytics/dashboard`
- **Access**: Admin / Super Admin
- **Success Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "totalRevenue": 2450000,
    "revenueGrowth": "+18.4%",
    "totalBookings": 142,
    "bookingsGrowth": "+12.1%",
    "totalCustomers": 380,
    "activePackages": 24,
    "totalCities": 12,
    "pendingEnquiries": 5,
    "averageRating": 4.92,
    "recentBookings": [ /* Last 5 bookings */ ],
    "recentEnquiries": [ /* Last 5 leads */ ]
  }
}
```

#### 12.2 `GET /analytics/revenue?timeframe=6months`
- **Access**: Admin / Super Admin
- **Success Response (200 OK)**:
```json
{
  "success": true,
  "data": [
    { "month": "Apr", "revenue": 320000, "bookings": 18 },
    { "month": "May", "revenue": 280000, "bookings": 14 },
    { "month": "Jun", "revenue": 190000, "bookings": 10 },
    { "month": "Jul", "revenue": 220000, "bookings": 12 },
    { "month": "Aug", "revenue": 450000, "bookings": 26 },
    { "month": "Sep", "revenue": 580000, "bookings": 32 }
  ]
}
```

#### 12.3 `GET /analytics/popularity`
- **Access**: Admin / Super Admin
- **Success Response (200 OK)**:
```json
{
  "success": true,
  "data": [
    { "category": "Royal Heritage", "percentage": 42, "revenue": 1029000 },
    { "category": "Desert Safari", "percentage": 30, "revenue": 735000 },
    { "category": "Culture & Food", "percentage": 18, "revenue": 441000 },
    { "category": "Photography & Walks", "percentage": 10, "revenue": 245000 }
  ]
}
```

---

### Module 13: Media & File Upload APIs

#### 13.1 `POST /upload/single` (Multipart/form-data)
- **Access**: Admin / Editor
- **Field Name**: `image`
- **Success Response (200 OK)**:
```json
{
  "success": true,
  "message": "Image uploaded successfully",
  "data": {
    "url": "https://res.cloudinary.com/jodhpurvoyage/image/upload/v1726051234/tours/mehrangarh.webp",
    "public_id": "tours/mehrangarh",
    "format": "webp",
    "bytes": 245120
  }
}
```

#### 13.2 `POST /upload/multiple` (Multipart/form-data)
- **Access**: Admin / Editor
- **Field Name**: `images` (Max 10 files)
- **Success Response (200 OK)**: Returns array of uploaded Cloudinary image URLs.

---

## 6. Standardized Error Handling & Response Wrapper

### 6.1 `ApiError` Class (`src/utils/ApiError.js`)
```javascript
class ApiError extends Error {
  constructor(statusCode, message = 'Something went wrong', errors = [], stack = '') {
    super(message);
    this.statusCode = statusCode;
    this.data = null;
    this.message = message;
    this.success = false;
    this.errors = errors;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default ApiError;
```

### 6.2 `ApiResponse` Class (`src/utils/ApiResponse.js`)
```javascript
class ApiResponse {
  constructor(statusCode, data, message = 'Success') {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400;
  }
}

export default ApiResponse;
```

### 6.3 Global Error Handler Middleware (`src/middlewares/error.middleware.js`)
```javascript
import ApiError from '../utils/ApiError.js';

export const errorHandler = (err, req, res, next) => {
  let error = err;

  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || (error.name === 'ValidationError' ? 400 : 500);
    const message = error.message || 'Internal Server Error';
    error = new ApiError(statusCode, message, error?.errors || [], err.stack);
  }

  const response = {
    success: false,
    statusCode: error.statusCode,
    message: error.message,
    ...(process.env.NODE_ENV === 'development' ? { stack: error.stack, errors: error.errors } : {})
  };

  return res.status(error.statusCode).json(response);
};
```

---

## 7. Validation, Security & Scalability Blueprint

### 7.1 Security Implementations
1. **Helmet**: Sets HTTP security headers against XSS, clickjacking, and MIME sniffing.
2. **CORS Configuration**: Restricts origin access strictly to `CLIENT_URL` and `ADMIN_URL` with credentials support.
3. **Rate Limiting**:
   - General API: `100 requests / 15 mins`.
   - Sensitive Routes (`/auth/login`, `/enquiries`, `/bookings`): `10 requests / 15 mins`.
4. **Mongo Sanitize**: Prevents NoSQL Query Injections (e.g. `{"$gt": ""}`).
5. **HPP (HTTP Parameter Pollution)**: Prevents query parameter manipulation.
6. **Bcryptjs**: Minimum `12 salt rounds` for passwords.

### 7.2 Scalability & Database Performance Optimizations
1. **Indexes**:
   - Compound indices on frequently filtered pairs: `{ price: 1, rating: -1 }`, `{ status: 1, categoryId: 1 }`.
   - Text indexes on `title`, `name`, `keywords`, `description` for high-speed search queries.
2. **Lean Queries**: Always use `.lean()` on read operations (`find`, `findById`) to bypass Mongoose hydration overhead for 3-5x faster response times.
3. **Pagination**: Enforce cursor-based or offset limit/skip pagination across all listings to prevent memory leaks with large datasets.
4. **Redis In-Memory Caching (Optional)**:
   - Cache `GET /cities`, `GET /tours`, `GET /destination-categories`, and `GET /settings` with a TTL of 30-60 minutes.
   - Invalidate cache automatically on `POST`, `PUT`, `DELETE` operations.

---

## 8. Step-by-Step Implementation Guide

When you are ready to build the backend codebase:

1. **Initialize Project**:
   ```bash
   mkdir backend && cd backend
   npm init -y
   ```
2. **Install Core Dependencies**:
   ```bash
   npm install express mongoose dotenv cors helmet express-rate-limit express-mongo-sanitize hpp jsonwebtoken bcryptjs multer cloudinary nodemailer zod
   npm install --save-dev nodemon morgan
   ```
3. **Configure `package.json`**:
   Add `"type": "module"` and scripts:
   ```json
   "scripts": {
     "dev": "nodemon src/server.js",
     "start": "node src/server.js"
   }
   ```
4. **Implement Layers in Order**:
   - `src/config/db.js` (MongoDB connection with retry logic)
   - `src/utils/` (`ApiError.js`, `ApiResponse.js`, `asyncHandler.js`)
   - `src/models/` (All 10 schemas created above)
   - `src/middlewares/` (Auth, error handling, multer)
   - `src/controllers/` (Business logic for all routes)
   - `src/routes/` (Route declarations with router mounting in `src/routes/index.js`)
   - `src/app.js` (Express middleware chain)
   - `src/server.js` (Listen on `PORT`)
5. **Connect Frontend**:
   Set `NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1` in the Next.js `.env.local` to immediately switch the frontend from mock mode to your live backend!

---

*Documentation prepared for Jodhpur Voyage Enterprise Backend Platform.*
