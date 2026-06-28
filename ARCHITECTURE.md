# 🏗️ CyberNet ISP - Architecture & Technical Overview

Dokumentasi arsitektur sistem, data flow, dan design patterns yang digunakan.

---

## 📐 System Architecture

### High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                             │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Web Browser (Chrome, Firefox, Safari, Edge)             │   │
│  │  Mobile Browser (iOS Safari, Android Chrome)             │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                             ↑↓
                    HTTPS/TLS Encrypted
                             ↑↓
┌─────────────────────────────────────────────────────────────────┐
│                      PRESENTATION LAYER                          │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Next.js Pages (React Components)                        │   │
│  │  ├── Public Pages                                        │   │
│  │  │   ├── Homepage                                        │   │
│  │  │   ├── Registration Form                               │   │
│  │  │   └── Coverage Check                                  │   │
│  │  └── Admin Pages (Protected)                             │   │
│  │      ├── Dashboard                                       │   │
│  │      ├── Client Management                               │   │
│  │      ├── Package Management                              │   │
│  │      └── Area Management                                 │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                             ↑↓
                        REST API Call
                        JSON Request/Response
                             ↑↓
┌─────────────────────────────────────────────────────────────────┐
│                      APPLICATION LAYER                           │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Next.js API Routes                                      │   │
│  │  ├── Authentication Routes                               │   │
│  │  │   ├── /api/auth/login                                 │   │
│  │  │   ├── /api/auth/register                              │   │
│  │  │   └── /api/auth/[...nextauth]                         │   │
│  │  ├── Business Logic Routes                               │   │
│  │  │   ├── /api/client/*                                   │   │
│  │  │   ├── /api/membership/*                               │   │
│  │  │   ├── /api/location/*                                 │   │
│  │  │   └── /api/contact/*                                  │   │
│  │  ├── Controllers (Request Handling)                      │   │
│  │  │   ├── admin-client.controller.ts                      │   │
│  │  │   ├── admin-membership.controller.ts                  │   │
│  │  │   └── contact-email.controller.ts                     │   │
│  │  └── Services (Business Logic)                           │   │
│  │      ├── auth.service.ts                                 │   │
│  │      ├── client.service.ts                               │   │
│  │      ├── contact.service.ts                              │   │
│  │      └── membership.service.ts                           │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                             ↑↓
                        Database Query
                    (CRUD Operations)
                             ↑↓
┌─────────────────────────────────────────────────────────────────┐
│                       DATA LAYER                                 │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  MongoDB Database                                        │   │
│  │  ├── Collections                                         │   │
│  │  │   ├── clients                                         │   │
│  │  │   ├── membership                                      │   │
│  │  │   ├── locations                                       │   │
│  │  │   └── admins                                          │   │
│  │  └── Indexes (Performance Optimization)                 │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                             ↑↓
               Additional Services (External)
                             ↑↓
    ┌──────────────────────────┬──────────────────────────┐
    ↓                          ↓                          ↓
┌─────────────┐         ┌─────────────┐        ┌──────────────┐
│ Gmail SMTP  │         │ NextAuth.js │        │  Analytics   │
│ Email       │         │ JWT Token   │        │  (Optional)  │
│ Notification│         │ Session Mgmt│        │ (Future)     │
└─────────────┘         └─────────────┘        └──────────────┘
```

---

## 🔄 Data Flow

### 1. User Registration Flow

```
┌─────────────────────────────────────────────────────────────────┐
│ 1. User Access Homepage                                         │
│    Browser → GET /                                              │
└─────────────────────────────────────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────────┐
│ 2. Load Registration Form                                       │
│    - Fetch available packages                                   │
│    - Display form fields                                        │
│    Browser → GET /api/membership                               │
└─────────────────────────────────────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────────┐
│ 3. User Fills & Submits Form                                    │
│    - fullName, phoneNumber, email, address, packageId           │
│    Browser → POST /api/contact (with JSON payload)             │
└─────────────────────────────────────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────────┐
│ 4. Backend Processing                                           │
│    a. Validate input data                                       │
│       - Email format, phone format, non-empty fields           │
│    b. Validate package exists                                   │
│       - Query membership by packageId                           │
│    c. Check duplicates                                          │
│       - Search clients by email/phone/name                      │
│    d. Escape HTML (Security)                                    │
│    e. Get package details                                       │
│       - Fetch package name, price, features                    │
└─────────────────────────────────────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────────┐
│ 5. Send Notifications                                           │
│    a. Email to ADMIN                                            │
│       - New registration notification with all details         │
│    b. Email to CUSTOMER                                         │
│       - Confirmation & next steps                               │
│    Both via Gmail SMTP (Nodemailer)                             │
└─────────────────────────────────────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────────┐
│ 6. Save to Database                                             │
│    - Insert into clients collection                             │
│    - With timestamps (createdAt, updatedAt)                    │
└─────────────────────────────────────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────────┐
│ 7. Return Response to Frontend                                  │
│    Browser ← {                                                  │
│      "success": true,                                           │
│      "message": "Pendaftaran berhasil!"                        │
│    }                                                            │
└─────────────────────────────────────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────────┐
│ 8. Frontend UI Update                                           │
│    - Show success message                                       │
│    - Clear form fields                                          │
│    - Auto-hide message after 3 seconds                         │
└─────────────────────────────────────────────────────────────────┘
```

### 2. Admin Login & Dashboard Flow

```
Browser → GET /admin/dashboard
          ↓
       [Protected Route - NextAuth Middleware]
          ↓
   No session? → Redirect to /admin/login
          ↓
   Valid session? → Render Dashboard
                    ├── Fetch stats
                    │   GET /api/client
                    │   GET /api/membership
                    │   GET /api/location
                    ├── Display analytics
                    └── Show management tables
```

### 3. Admin CRUD Operation (Example: Update Package)

```
1. Admin opens package management
   → GET /api/membership (fetch all packages)

2. Admin clicks edit button on package
   → Show modal with current data pre-filled

3. Admin changes price and clicks save
   → PUT /api/membership/[id] (with updated data)

4. Backend processes:
   a. Validate packageId exists
   b. Validate new data format
   c. Update MongoDB document
   d. Return updated data

5. Frontend receives response
   → Update table view
   → Show success notification
   → Close modal
```

---

## 🗄️ Database Design

### Collections & Relationships

```
┌──────────────────────────────┐
│      clients                 │
├──────────────────────────────┤
│ _id: ObjectId (Primary Key)  │
│ fullName: String             │
│ phoneNumber: String (Unique) │
│ email: String (Unique)       │
│ address: String              │
│ packageId: String (FK) ──────┼──┐
│ createdAt: Date              │  │
│ updatedAt: Date              │  │
└──────────────────────────────┘  │
                                  │
          Foreign Key Reference   │
                                  │
┌──────────────────────────────┐  │
│      membership              │  │
├──────────────────────────────┤  │
│ _id: ObjectId (PK) ◄─────────┼──┘
│ paket: String (Unique)       │
│ speed: Number                │
│ price: Number                │
│ period: String               │
│ features: Array<String>      │
│ isPopular: Boolean           │
│ createdAt: Date              │
│ updatedAt: Date              │
└──────────────────────────────┘

┌──────────────────────────────┐
│      locations               │
├──────────────────────────────┤
│ _id: ObjectId                │
│ area: String (Unique)        │
│ subArea: String              │
│ coverage: String             │
│ status: Enum (active/inactive)
│ createdAt: Date              │
│ updatedAt: Date              │
└──────────────────────────────┘

┌──────────────────────────────┐
│      admins                  │
├──────────────────────────────┤
│ _id: ObjectId                │
│ email: String (Unique)       │
│ password: String (Hashed)    │
│ role: Enum (admin/superadmin)│
│ lastLogin: Date              │
│ createdAt: Date              │
│ updatedAt: Date              │
└──────────────────────────────┘
```

### Indexes untuk Performance

```javascript
// clients collection
db.clients.createIndex({ email: 1 }, { unique: true });
db.clients.createIndex({ phoneNumber: 1 }, { unique: true });
db.clients.createIndex({ packageId: 1 });
db.clients.createIndex({ createdAt: -1 });

// membership collection
db.membership.createIndex({ paket: 1 }, { unique: true });
db.membership.createIndex({ price: 1 });

// locations collection
db.locations.createIndex({ area: 1 }, { unique: true });
db.locations.createIndex({ status: 1 });

// admins collection
db.admins.createIndex({ email: 1 }, { unique: true });
```

---

## 🔐 Security Architecture

### Authentication & Authorization Flow

```
┌─────────────────────────────────────────────────────┐
│              LOGIN ENDPOINT                         │
│  POST /api/auth/login                              │
│  { email, password }                               │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│         1. VALIDATION                               │
│  - Email format valid?                             │
│  - Password not empty?                             │
│  - Field count correct?                            │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│         2. DATABASE LOOKUP                          │
│  - Query admins collection by email                │
│  - Email found?                                    │
└─────────────────────────────────────────────────────┘
                        ↓ YES
┌─────────────────────────────────────────────────────┐
│         3. PASSWORD VERIFICATION                    │
│  - Compare input password with hashed password     │
│  - Using bcrypt algorithm                          │
│  - Match?                                          │
└─────────────────────────────────────────────────────┘
                        ↓ YES
┌─────────────────────────────────────────────────────┐
│         4. SESSION CREATION (NextAuth)              │
│  - Generate JWT token                              │
│  - Set session cookie (HTTP-only)                  │
│  - Store in database                               │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│         5. RESPONSE TO CLIENT                       │
│  { success: true, redirect: "/admin/dashboard" }   │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│         PROTECTED ROUTE ACCESS                      │
│  GET /admin/dashboard                              │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│  Middleware: verifyAuth()                           │
│  - Read JWT from cookie                            │
│  - Verify signature                                │
│  - Check expiration                                │
│  - Valid?                                          │
└─────────────────────────────────────────────────────┘
                    ↓ YES          ↓ NO
              [Allow Access]   [Redirect to /admin/login]
```

### Input Validation & Sanitization

```
User Input (Untrusted)
        ↓
┌──────────────────────────────────────────────────────┐
│ 1. SCHEMA VALIDATION (Yup)                          │
│    - Type checking (string, number, etc)            │
│    - Format validation (email, phone)               │
│    - Length validation (min/max)                    │
│    - Required field checking                       │
└──────────────────────────────────────────────────────┘
        ↓ PASS
┌──────────────────────────────────────────────────────┐
│ 2. BUSINESS LOGIC VALIDATION                        │
│    - Check package exists in database               │
│    - Check for duplicates                           │
│    - Verify area coverage                           │
└──────────────────────────────────────────────────────┘
        ↓ PASS
┌──────────────────────────────────────────────────────┐
│ 3. SANITIZATION (HTML Escaping)                     │
│    - Convert < > " ' &  → HTML entities            │
│    - Prevent XSS attacks                            │
│    - Safe for email rendering                      │
└──────────────────────────────────────────────────────┘
        ↓
   Safe Data → Database
   Safe Data → Email Template
   Safe Data → Response to Client
```

---

## 🏭 Design Patterns

### 1. MVC (Model-View-Controller)

```
Views (React Components)
  ↓
Controllers (API Route Handlers)
  ↓
Services (Business Logic)
  ↓
Models (Data Validation)
  ↓
Database
```

### 2. Layered Architecture

```
┌─────────────────────────────────┐
│  Presentation Layer             │ ← React Components
│  (UI & User Interaction)        │
└─────────────────────────────────┘
           ↓↑
┌─────────────────────────────────┐
│  Application Layer              │ ← Next.js API Routes
│  (Request Handling)             │
└─────────────────────────────────┘
           ↓↑
┌─────────────────────────────────┐
│  Business Logic Layer           │ ← Services & Controllers
│  (Rules & Processing)          │
└─────────────────────────────────┘
           ↓↑
┌─────────────────────────────────┐
│  Data Access Layer              │ ← MongoDB Utilities
│  (Database Operations)          │
└─────────────────────────────────┘
           ↓↑
┌─────────────────────────────────┐
│  Data Layer                     │ ← MongoDB Database
│  (Persistence)                  │
└─────────────────────────────────┘
```

### 3. Middleware Pattern

```
Request → Auth Middleware
          ↓ Check session
          ↓ Valid?
          ↓ YES
       → Logger Middleware
          ↓ Log request
          ↓
       → Validation Middleware
          ↓ Validate body/params
          ↓ Valid?
          ↓ YES
       → Controller
          ↓ Process business logic
          ↓
         Response
```

### 4. Repository Pattern (Implicit)

```
Services call MongoDB utilities
  ↓
Utilities abstract database operations
  ↓
Use MongoDB driver methods
  ↓
Database

Benefits:
- Single source of database queries
- Easy to test
- Easy to switch databases (future)
```

---

## 🔄 Component Hierarchy

### Public Pages

```
index.tsx (Homepage)
├── Header
│   └── Navigation
├── Hero Section
├── Membership Section (Cards)
│   └── Package Cards (Reusable)
├── Coverage Form
│   └── Input Fields
└── Registration Form
    ├── Input Fields
    ├── Select (Package)
    ├── Textarea (Address)
    └── Alert (Error/Success)
```

### Admin Pages

```
admin/dashboard.tsx
├── AdminLayout
│   ├── Sidebar (Navigation)
│   └── Main Content
│       ├── PageHead
│       └── Dashboard Content
│           ├── Stats Cards
│           └── Charts (Future)

admin/client.tsx
├── AdminLayout
│   ├── ClientTable
│   │   ├── Table Headers
│   │   ├── Table Rows
│   │   └── Action Buttons (Edit/Delete)
│   └── Modals
│       ├── ClientModal (View)
│       └── FormModal (Edit)

admin/membership.tsx
├── AdminLayout
│   ├── MembershipTable
│   │   ├── Package List
│   │   └── Action Buttons
│   └── FormModal (CRUD)
```

---

## 📦 Dependencies Overview

### Frontend Dependencies

```json
{
  "next": "^13.x",              // Framework
  "react": "^18.x",             // UI Library
  "axios": "^1.x",              // HTTP Client
  "next-auth": "^4.x",          // Authentication
  "tailwindcss": "^3.x",        // Styling
  "lucide-react": "^0.x",       // Icons
  "@hookform/resolvers": "^3.x", // Form Validation
  "react-hot-toast": "^2.x"     // Notifications
}
```

### Backend Dependencies

```json
{
  "mongodb": "^5.x",            // Database Driver
  "nodemailer": "^6.x",         // Email Service
  "bcryptjs": "^2.x",           // Password Hashing
  "yup": "^1.x",                // Schema Validation
  "dotenv": "^16.x"             // Environment Variables
}
```

---

## 📊 Performance Considerations

### Database Query Optimization

```typescript
// ❌ INEFFICIENT
const clients = await db.collection('clients').find({}).toArray();
// Returns all fields for all documents

// ✅ OPTIMIZED
const clients = await db.collection('clients')
  .find({})
  .project({ email: 1, fullName: 1, packageId: 1 })
  .toArray();
// Returns only needed fields

// ✅ WITH INDEXING
db.clients.createIndex({ email: 1 }, { unique: true });
// Fast lookups by email
```

### Caching Strategy

```
Frequently Accessed Data:
  ├── Membership packages (Cache 1 hour)
  ├── Location areas (Cache 1 hour)
  └── Admin user sessions (Cache per session)

Cache Invalidation:
  ├── On POST/PUT/DELETE operations
  ├── Manual refresh via admin UI
  └── Scheduled refresh (hourly)
```

### Image & Asset Optimization

```typescript
// Use Next.js Image component
import Image from 'next/image';

// Automatic optimization:
// - Responsive images
// - Lazy loading
// - Format conversion (webp)
// - Size optimization
```

---

## 🚀 Scalability Roadmap

### Phase 1 (Current)
- ✅ Monolithic Next.js app
- ✅ Single MongoDB database
- ✅ File-based sessions

### Phase 2 (Future)
- Separate API server (Express/Node)
- Redis for caching
- Database replication

### Phase 3 (Enterprise)
- Microservices architecture
- Message queue (RabbitMQ/Kafka)
- Search engine (Elasticsearch)
- Real-time updates (WebSocket)

---

## 🔧 Technology Decisions & Tradeoffs

### Why Next.js?
- ✅ Full-stack solution (Frontend + Backend)
- ✅ Built-in API routes
- ✅ SSR & SSG capabilities
- ✅ Great developer experience

### Why MongoDB?
- ✅ Flexible schema (good for iterations)
- ✅ JSON-like documents
- ✅ Scalable
- ✅ Good driver support

### Why NextAuth.js?
- ✅ Built for Next.js
- ✅ Multiple provider support
- ✅ Secure by default
- ✅ Good documentation

### Why Tailwind CSS?
- ✅ Utility-first approach
- ✅ Responsive design
- ✅ Smaller bundle size
- ✅ Highly customizable

---

## 📝 Development Guidelines

### Before Writing Code
1. Create issue/feature request
2. Design data flow on paper
3. Plan database schema changes
4. Review with team

### Code Review Checklist
- [ ] Follows naming conventions
- [ ] Includes error handling
- [ ] Type-safe (no `any`)
- [ ] Has comments for complex logic
- [ ] Tested manually
- [ ] No security vulnerabilities
- [ ] Performance acceptable

### Deployment Checklist
- [ ] All tests passing
- [ ] No console errors/warnings
- [ ] Environment variables set
- [ ] Database migrations done
- [ ] Backup created
- [ ] Monitoring setup

---

**Last Updated**: June 2026
**Status**: Production Ready
