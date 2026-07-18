# 🌐 CyberNet ISP Platform

Aplikasi manajemen layanan Internet Service Provider (ISP) dengan sistem registrasi pelanggan, manajemen paket internet, dan dashboard admin yang komprehensif.

## ✨ Fitur Utama

### 👥 Public Features
- **Registrasi Pelanggan**: Form pendaftaran layanan internet dengan validasi data real-time
- **Cek Coverage Area**: Verifikasi area jangkauan layanan sebelum mendaftar
- **Pilihan Paket**: 4 pilihan paket internet (10 Mbps - 50 Mbps)
- **Notifikasi Email**: Konfirmasi registrasi otomatis via email

### 🔐 Admin Features
- **Dashboard Analytics**: Statistik pelanggan dan data real-time
- **Manajemen Pelanggan**: CRUD operasi untuk data pelanggan
- **Manajemen Paket**: Kelola paket internet dan pricing
- **Manajemen Area Jangkauan**: Define service coverage areas
- **Authentication**: Login admin dengan NextAuth.js

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 13+ (React)
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **Authentication**: NextAuth.js

### Backend
- **Runtime**: Node.js
- **Framework**: Next.js API Routes
- **Database**: MongoDB
- **Email Service**: Nodemailer (Gmail SMTP)
- **Validation**: Yup

### DevOps
- **Package Manager**: npm / yarn
- **Deployment**: Vercel (recommended)

## 📁 Struktur Project

```
src/
├── assets/              # Logo dan image static
├── components/          # Reusable React components
│   ├── Alert/          # Alert notification component
│   ├── ClientTable/    # Tabel data pelanggan
│   ├── CoverageForm/   # Form cek coverage area
│   ├── layouts/        # Layout wrapper (Admin & Public)
│   ├── LocationTable/  # Tabel area jangkauan
│   ├── MembershipSection/  # Showcase paket
│   ├── MembershipTable/    # Manajemen paket admin
│   ├── RegistrationForm/   # Form registrasi pelanggan
│   ├── modals/         # Modal dialog components
│   └── refresh/        # Auto-refresh component
├── config/             # Konfigurasi (Axios setup)
├── controllers/        # Business logic layer
│   ├── admin-auth.controller.ts
│   ├── admin-client.controller.ts
│   ├── admin-membership.controller.ts
│   ├── contact-email.controller.ts
│   └── ...
├── hooks/              # Custom React hooks
│   ├── useClient.ts
│   ├── useMembership.ts
│   ├── useLogin.ts
│   └── ...
├── libs/               # Utilities & middleware
│   └── middleware/     # Auth middleware
├── models/             # Data validation schemas (Yup)
│   ├── client.models.ts
│   ├── membership.models.ts
│   └── ...
├── pages/              # Next.js pages & API routes
│   ├── admin/          # Admin dashboard pages
│   ├── api/            # REST API endpoints
│   │   ├── auth/       # Authentication endpoints
│   │   ├── client/     # Client management
│   │   ├── contact/    # Form submission
│   │   ├── location/   # Area coverage
│   │   └── membership/ # Package management
│   ├── auth/           # Auth pages
│   └── index.tsx       # Homepage
├── services/           # API service layer
│   ├── auth.service.ts
│   ├── client.service.ts
│   ├── contact.service.ts
│   └── ...
├── styles/             # Global CSS
├── types/              # TypeScript type definitions
│   ├── Auth.d.ts
│   ├── package.ts      # Package types & enums
│   └── ...
└── utils/              # Helper functions
    ├── database.ts     # MongoDB connection
    ├── environment.ts  # Env variables loader
    ├── auth.ts         # Auth helpers
    └── duplicate-checker.ts
```

## 🚀 Panduan Instalasi & Setup

### Prerequisites
- Node.js 16+ dan npm/yarn
- MongoDB (local atau Atlas cloud)
- Gmail account (untuk SMTP email)

### 1. Clone Repository & Install Dependencies

```bash
# Clone project
git clone <repository-url>
cd cybernet-isp

# Install dependencies
npm install
# atau
yarn install
```

### 2. Setup Environment Variables

Buat file `.env.local` di root project:

```env
# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/cybernet?retryWrites=true&w=majority

# Email (Gmail)
USER_EMAIL=your-gmail@gmail.com
USER_PASS=your-app-password  # Use Gmail App Password, not regular password

# NextAuth
NEXTAUTH_URL=http://localhost:3000  # Production: your-domain.com
NEXTAUTH_SECRET=your-super-secret-key-min-32-chars

# Admin Credentials (Default)
ADMIN_EMAIL=admin@cybernet.com
ADMIN_PASSWORD=your-secure-password
```

### 3. Setup Database

```bash
# Run database initialization script
npm run setup-db
```

Atau manual di MongoDB:

```javascript
// Create collections
db.createCollection("clients");
db.createCollection("membership");
db.createCollection("locations");
db.createCollection("admins");

// Create indexes
db.clients.createIndex({ email: 1 }, { unique: true });
db.clients.createIndex({ phoneNumber: 1 });
db.membership.createIndex({ paket: 1 }, { unique: true });
```

### 4. Run Development Server

```bash
npm run dev
# atau
yarn dev
```

Server akan berjalan di `http://localhost:3000`

### 5. Access Applications

- **Homepage**: http://localhost:3000
- **Admin Dashboard**: http://localhost:3000/admin (login required)

## 📊 Database Schema

### Collections

#### 1. **clients** - Data Pelanggan
```json
{
  "_id": ObjectId,
  "fullName": "string",
  "phoneNumber": "string (format: 08xx atau +62xx)",
  "email": "string (unique)",
  "address": "string",
  "packageId": "string (MongoDB ObjectId reference)",
  "createdAt": ISODate,
  "updatedAt": ISODate
}
```

#### 2. **membership** - Paket Internet
```json
{
  "_id": ObjectId,
  "paket": "string (unique, e.g., 'PAKET 10 Mbps')",
  "speed": "number (Mbps)",
  "price": "number (Rupiah per bulan)",
  "period": "string",
  "features": [array of strings],
  "isPopular": "boolean",
  "createdAt": ISODate,
  "updatedAt": ISODate
}
```

#### 3. **locations** - Area Jangkauan
```json
{
  "_id": ObjectId,
  "area": "string (e.g., 'Nagreg, Bandung')",
  "subArea": "string (optional)",
  "coverage": "string (neighborhood/RT)",
  "status": "enum (active, inactive)",
  "createdAt": ISODate,
  "updatedAt": ISODate
}
```

#### 4. **admins** - Akun Admin
```json
{
  "_id": ObjectId,
  "email": "string (unique)",
  "password": "string (hashed with bcrypt)",
  "role": "enum (admin, superadmin)",
  "lastLogin": ISODate,
  "createdAt": ISODate,
  "updatedAt": ISODate
}
```

## 🔗 API Endpoints

### Authentication
```
POST   /api/auth/login          - Admin login
POST   /api/auth/register       - Admin registration
POST   /api/auth/logout         - Admin logout
GET    /api/auth/session        - Get current session
```

### Client Management (Admin)
```
GET    /api/client              - Fetch all clients
POST   /api/client              - Create new client
GET    /api/client/[id]         - Get client by ID
PUT    /api/client/[id]         - Update client
DELETE /api/client/[id]         - Delete client
```

### Public Registration
```
POST   /api/contact             - Customer registration form submission
```

### Membership (Packages)
```
GET    /api/membership          - Get all packages
POST   /api/membership          - Create package (admin)
GET    /api/membership/[id]     - Get package by ID
PUT    /api/membership/[id]     - Update package (admin)
DELETE /api/membership/[id]     - Delete package (admin)
```

### Location (Coverage Area)
```
GET    /api/location            - Get all coverage areas
POST   /api/location            - Create area (admin)
GET    /api/location/[id]       - Get area by ID
PUT    /api/location/[id]       - Update area (admin)
DELETE /api/location/[id]       - Delete area (admin)
GET    /api/location/area/[area] - Predict coverage by area
```

## 📋 Validasi Input

### Validasi Registrasi Pelanggan

```typescript
interface TypeContactForm {
  fullName: string;          // Wajib, min 3 chars
  phoneNumber: string;       // Wajib, format: 08xx atau +62xx
  email: string;            // Wajib, format email valid
  address: string;          // Wajib, min 5 chars
  packageId: string;        // Wajib, valid MongoDB ObjectId
}
```

### Validasi Paket

```typescript
interface PackageTypeProps {
  paket: string;            // Wajib, unique
  price: number;            // Wajib, > 0
  period: string;           // "bulan"
  features: string[];       // Array of feature strings
  isPopular: boolean;       // Flag for featured package
}
```

## 🔄 Migration Guide: PackageId Refactor

Jika Anda memiliki data lama dengan `packageId` sebagai string nama paket, ikuti langkah migration ini:

### Masalah
Database memiliki data inconsistent:
- Data lama: `packageId: "PAKET 50 Mbps"` (string name)
- Data baru: `packageId: "6a2bc25bc0f2d4258e6f1f75"` (ObjectId string)

### Solusi: Jalankan Migration Script

```bash
npm run migrate:packageid
```

Atau manual dengan Node.js:

```javascript
// migration.js
const { MongoClient, ObjectId } = require("mongodb");

const migrate = async () => {
  const client = new MongoClient(process.env.MONGODB_URI);
  
  try {
    await client.connect();
    const db = client.db("cybernet");
    
    // Get mapping paket name → ObjectId
    const packages = await db.collection("membership")
      .find({})
      .project({ _id: 1, paket: 1 })
      .toArray();
    
    const paketMap = {};
    packages.forEach(pkg => {
      paketMap[pkg.paket] = pkg._id.toString();
    });
    
    // Update clients collection
    for (const [paketName, paketId] of Object.entries(paketMap)) {
      const result = await db.collection("clients").updateMany(
        { packageId: paketName },
        { $set: { packageId: paketId } }
      );
      console.log(`Updated "${paketName}": ${result.modifiedCount} docs`);
    }
    
    console.log("✅ Migration complete!");
  } finally {
    await client.close();
  }
};

migrate().catch(console.error);
```

Jalankan:
```bash
node migration.js
```

## 📧 Setup Email Notifications

### Gmail Configuration

1. Enable 2-Step Verification di Gmail
2. Generate App Password:
   - Buka https://myaccount.google.com/apppasswords
   - Select "Mail" dan "Windows Computer"
   - Copy generated password
3. Set di `.env.local`:
   ```env
   USER_EMAIL=your-email@gmail.com
   USER_PASS=generated-app-password
   ```

### Email Templates

Sistem mengirimkan 2 email otomatis saat registrasi:

**Email 1 - Ke Admin:**
- Data pelanggan lengkap
- Paket yang dipilih
- Harga paket
- Timestamp registrasi

**Email 2 - Ke Customer:**
- Konfirmasi registrasi diterima
- Informasi paket
- Tim akan menghubungi via WhatsApp/Email

## 🔒 Security Features

- ✅ **Password Hashing**: bcrypt untuk admin password
- ✅ **Input Validation**: Yup schema validation
- ✅ **SQL Injection Prevention**: MongoDB query parameterization
- ✅ **XSS Protection**: HTML escaping untuk email content
- ✅ **Duplicate Prevention**: Unique indexes & application-level validation
- ✅ **CORS Enabled**: Konfigurasi CORS untuk API routes
- ✅ **Authentication Middleware**: NextAuth.js untuk admin routes

## 🧪 Testing

```bash
# Run unit tests
npm run test

# Run with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e
```

## 📱 Responsive Design

- ✅ Mobile-first approach dengan Tailwind CSS
- ✅ Tested on iOS & Android
- ✅ Adaptive tables & forms
- ✅ Touch-friendly UI components

## 🐛 Troubleshooting

### Error: "Gagal memeriksa data di database"
**Solusi**: Cek koneksi MongoDB di `.env.local`

### Error: "Email tidak terkirim"
**Solusi**: 
- Verify Gmail App Password
- Check less secure apps setting
- Ensure SMTP port 587 is open

### Error: "Paket tidak ditemukan"
**Solusi**: Pastikan packageId valid MongoDB ObjectId, bukan string nama

### Duplicate Key Error pada Email/Phone
**Solusi**: Data sudah terdaftar, gunakan email/nomor berbeda

## 📈 Performance Tips

- Cache membership data di client side
- Implement pagination untuk client list (untuk data besar)
- Use MongoDB indexing untuk frequent queries
- Enable compression middleware di production

## 🚀 Deployment

### Deploy ke Vercel (Recommended)

```bash
# Push ke GitHub
git push origin main

# Connect ke Vercel
vercel --prod

# Set environment variables di Vercel dashboard
```

### Deploy ke Custom Server

```bash
# Build production
npm run build

# Start production server
npm start
```

## 📞 Support & Contact

- **Email**: ryudecay0@gmail.com
- **WhatsApp**: +62 896-3083-1650
- **Issues**: GitHub Issues

## 📄 License

MIT License - Bebas digunakan untuk keperluan komersial maupun non-komersial

## 📝 Changelog

### v1.0.0 (Production Release)
- ✅ Public registration form dengan validasi lengkap
- ✅ Admin dashboard dengan analytics
- ✅ Email notification system
- ✅ Coverage area checking
- ✅ Complete CRUD operations
- ✅ Database migration untuk packageId refactor
- ✅ Security enhancements

### v0.9.0 (Beta)
- Initial beta release
- Basic CRUD operations
- Email integration

---

**Last Updated**: July 2026
**Project Status**: ✅ Production Ready
