# 🚀 CyberNet ISP - Setup Guide untuk Developer

Panduan lengkap untuk setup, development, dan deployment CyberNet ISP Platform.

## 📋 Daftar Isi

1. [Prerequisites](#prerequisites)
2. [Initial Setup](#initial-setup)
3. [Environment Configuration](#environment-configuration)
4. [Database Setup](#database-setup)
5. [Development Workflow](#development-workflow)
6. [Testing](#testing)
7. [Deployment](#deployment)
8. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### System Requirements

```bash
# Check Node.js version (minimum 16.x)
node --version
# v16.x.x atau lebih tinggi

# Check npm version
npm --version
# 8.x.x atau lebih tinggi
```

### Required Tools

- ✅ **Node.js 16+** - Runtime environment
- ✅ **npm atau yarn** - Package manager
- ✅ **MongoDB 4.4+** - Database
  - Local: `mongodb://localhost:27017`
  - Cloud: MongoDB Atlas (https://www.mongodb.com/cloud/atlas)
- ✅ **Git** - Version control
- ✅ **VS Code** - Recommended editor
- ✅ **Postman** - API testing (optional)

### Browser Requirements

- Chrome/Firefox/Safari/Edge (latest)
- Mobile browser untuk testing responsive

---

## Initial Setup

### Step 1: Clone Repository

```bash
# Clone dengan HTTPS
git clone https://github.com/cybernet/isp-platform.git
cd isp-platform

# Atau dengan SSH
git clone git@github.com:cybernet/isp-platform.git
cd isp-platform
```

### Step 2: Install Dependencies

```bash
# Menggunakan npm
npm install

# Atau menggunakan yarn
yarn install

# Verify installation
npm list | head -20
```

### Step 3: Verify Node Modules

```bash
# Check critical packages
npm list next react react-dom mongodb nodemailer

# Should output:
# ├── next@13.x.x
# ├── react@18.x.x
# ├── react-dom@18.x.x
# ├── mongodb@5.x.x
# └── nodemailer@6.x.x
```

---

## Environment Configuration

### Step 1: Create .env.local File

```bash
# Di root project directory
touch .env.local
```

### Step 2: Fill Environment Variables

```env
# ============================================
# DATABASE CONFIGURATION
# ============================================
# Local MongoDB
# MONGODB_URI=mongodb://localhost:27017/cybernet

# MongoDB Atlas (Cloud)
MONGODB_URI=mongodb+srv://username:password@cluster-name.mongodb.net/cybernet?retryWrites=true&w=majority

# ============================================
# EMAIL CONFIGURATION (Gmail SMTP)
# ============================================
USER_EMAIL=your-email@gmail.com
USER_PASS=your-app-specific-password

# ============================================
# NEXTAUTH CONFIGURATION
# ============================================
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-super-secret-key-minimum-32-characters

# Generate secure secret:
# node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# ============================================
# ADMIN CREDENTIALS (First Time Setup)
# ============================================
ADMIN_EMAIL=admin@cybernet.com
ADMIN_PASSWORD=securePassword123!

# ============================================
# NODE ENVIRONMENT
# ============================================
NODE_ENV=development
# Atau: production

# ============================================
# API CONFIGURATION
# ============================================
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=CyberNet ISP
```

### Step 3: Verify Environment Variables

```bash
# Check if .env.local file created
cat .env.local

# Verify variables loaded correctly
npm run dev
# Check console untuk konfirmasi
```

---

## Database Setup

### Option 1: Local MongoDB

#### Install MongoDB Community

**macOS:**
```bash
# Using Homebrew
brew tap mongodb/brew
brew install mongodb-community@5.0

# Start MongoDB service
brew services start mongodb-community
```

**Windows:**
- Download: https://www.mongodb.com/try/download/community
- Run installer
- MongoDB akan auto-start di background

**Linux (Ubuntu/Debian):**
```bash
# Add MongoDB repository
wget -qO - https://www.mongodb.org/static/pgp/server-5.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/5.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-5.0.list

# Install MongoDB
sudo apt-get update
sudo apt-get install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod
```

#### Verify MongoDB Connection

```bash
# Connect ke MongoDB
mongosh
# Atau
mongo

# Test di mongo shell
show dbs
# Should output list of databases
```

### Option 2: MongoDB Atlas (Cloud) - Recommended

1. **Create Account**
   - Go to https://www.mongodb.com/cloud/atlas
   - Sign up dengan email

2. **Create Cluster**
   - Click "Create" button
   - Choose free tier (M0 Sandbox)
   - Select region (Asia: Singapore or Tokyo recommended)
   - Click "Create Cluster"

3. **Setup Security**
   - Go to "Database Access"
   - Create database user:
     - Username: `cybernet_user`
     - Password: Generate strong password
     - Role: `readWriteAnyDatabase`

4. **Setup Network Access**
   - Go to "Network Access"
   - Add IP Address: `0.0.0.0/0` (allow all - untuk development)
   - Untuk production: add specific IPs only

5. **Get Connection String**
   - Click "Connect" button
   - Choose "Connect your application"
   - Copy connection string
   - Replace `<username>` dan `<password>`
   - Set di `.env.local` sebagai `MONGODB_URI`

### Initialize Database Collections

```bash
# Run initialization script
npm run setup-db
```

Atau manual di MongoDB:

```javascript
// Connect ke MongoDB Shell
use cybernet

// Create collections
db.createCollection("clients")
db.createCollection("membership")
db.createCollection("locations")
db.createCollection("admins")

// Create indexes untuk better performance
db.clients.createIndex({ email: 1 }, { unique: true })
db.clients.createIndex({ phoneNumber: 1 })
db.clients.createIndex({ createdAt: -1 })

db.membership.createIndex({ paket: 1 }, { unique: true })

db.locations.createIndex({ area: 1 })

db.admins.createIndex({ email: 1 }, { unique: true })

// Verify indexes
db.clients.getIndexes()
```

### Seed Initial Data

```bash
# Insert default packages
use cybernet

db.membership.insertMany([
  {
    paket: "PAKET 10 Mbps",
    speed: 10,
    price: 170052,
    period: "bulan",
    features: ["Internet 10Mbps", "24/7 Support"],
    isPopular: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    paket: "PAKET 20 Mbps",
    speed: 20,
    price: 199000,
    period: "bulan",
    features: ["Internet 20Mbps", "24/7 Support", "Free Router"],
    isPopular: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    paket: "PAKET 30 Mbps",
    speed: 30,
    price: 299000,
    period: "bulan",
    features: ["Internet 30Mbps", "24/7 Support", "Free Router", "Free Installation"],
    isPopular: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    paket: "PAKET 50 Mbps",
    speed: 50,
    price: 399000,
    period: "bulan",
    features: ["Internet 50Mbps", "Priority Support", "Free Router", "Free Installation", "SLA Guarantee"],
    isPopular: false,
    createdAt: new Date(),
    updatedAt: new Date()
  }
])

// Verify
db.membership.find()
```

---

## Development Workflow

### Start Development Server

```bash
# Start Next.js dev server
npm run dev

# Server akan berjalan di:
# http://localhost:3000
```

### File Structure Convention

```
src/
├── components/   # React components - naming: PascalCase
├── pages/        # Next.js pages - naming: lowercase
├── api/          # API routes
├── hooks/        # Custom React hooks - naming: useXxx
├── services/     # API services - naming: xxx.service.ts
├── controllers/  # Business logic - naming: xxx.controller.ts
├── models/       # Data schemas - naming: xxx.models.ts
├── types/        # TypeScript types - naming: xxx.ts atau xxx.d.ts
└── utils/        # Helper functions - naming: xxx.ts
```

### Naming Conventions

**Components:**
```typescript
// ✅ CORRECT
export default function RegistrationForm() { }
export const ClientTable = () => { }

// ❌ WRONG
export default function registrationForm() { }
export const client_table = () => { }
```

**Types:**
```typescript
// ✅ CORRECT
interface TypeContactForm { }
type ClientData = { }
enum PackageType { }

// ❌ WRONG
interface contactForm { }
type client_data = { }
```

**Hooks:**
```typescript
// ✅ CORRECT
export const useMembership = () => { }
export const useClient = () => { }

// ❌ WRONG
export const membership = () => { }
export const getClient = () => { }
```

### Coding Standards

1. **Use TypeScript** - Hindari `any` type
   ```typescript
   // ❌ AVOID
   const data: any = response.data;
   
   // ✅ PREFER
   const data: TypeContactForm = response.data;
   ```

2. **Error Handling** - Always handle errors
   ```typescript
   // ✅ GOOD
   try {
     const result = await api.get('/data');
     return result.data;
   } catch (error) {
     console.error('Fetch error:', error);
     throw error;
   }
   ```

3. **Async/Await** - Lebih readable dari Promise chains
   ```typescript
   // ✅ PREFER
   const data = await fetchData();
   
   // ❌ AVOID
   fetchData().then(data => console.log(data));
   ```

### Development Tips

```bash
# Check code formatting
npm run lint

# Auto-fix formatting issues
npm run lint:fix

# TypeScript type checking
npm run type-check

# Monitor for changes
npm run dev -- --poll
```

---

## Testing

### Unit Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run specific test file
npm test -- components/RegistrationForm.test.tsx

# Generate coverage report
npm test -- --coverage
```

### Testing Example

```typescript
// RegistrationForm.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import RegistrationForm from '@/components/RegistrationForm';

describe('RegistrationForm', () => {
  test('renders form fields', () => {
    render(<RegistrationForm />);
    expect(screen.getByLabelText(/Nama Lengkap/i)).toBeInTheDocument();
  });

  test('submits form with valid data', async () => {
    render(<RegistrationForm />);
    // ... test logic
  });
});
```

### Integration Tests (API Testing)

```bash
# Install test tools
npm install --save-dev jest @testing-library/react @testing-library/jest-dom

# Run API tests
npm run test:api
```

### Manual Testing with Postman

1. Import API collection
2. Set environment variables
3. Test each endpoint:

```
POST http://localhost:3000/api/contact
Content-Type: application/json

{
  "fullName": "Test User",
  "phoneNumber": "08123456789",
  "email": "test@example.com",
  "address": "Jl. Test No. 123",
  "packageId": "507f1f77bcf86cd799439001"
}
```

---

## Deployment

### Pre-Deployment Checklist

- [ ] All tests passing
- [ ] Environment variables set correctly
- [ ] Database backups created
- [ ] Error handling complete
- [ ] Security audit done
- [ ] Performance optimized

### Deploy to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Login ke Vercel
vercel login

# Deploy ke production
vercel --prod

# Set environment variables via Vercel dashboard
```

### Deploy to Custom Server (VPS)

```bash
# 1. Build production bundle
npm run build

# 2. Upload to server
scp -r .next node_modules package.json your-server:/app/

# 3. SSH ke server
ssh user@your-server

# 4. Install PM2 (process manager)
npm install -g pm2

# 5. Start application
cd /app
npm install --production
pm2 start npm --name "cybernet" -- start

# 6. Monitor logs
pm2 logs cybernet
```

### Enable HTTPS

```bash
# Using Let's Encrypt dengan Nginx
sudo certbot certonly --standalone -d your-domain.com

# Update Nginx config untuk SSL
server {
  listen 443 ssl;
  server_name your-domain.com;
  
  ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
  ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;
  
  proxy_pass http://localhost:3000;
}
```

---

## Troubleshooting

### Problem: MongoDB Connection Failed

**Error:**
```
MongoError: connect ECONNREFUSED 127.0.0.1:27017
```

**Solutions:**
```bash
# 1. Check MongoDB service running
# macOS
brew services list | grep mongodb

# 2. Start MongoDB service
brew services start mongodb-community

# 3. Verify connection string di .env.local
MONGODB_URI=mongodb://localhost:27017/cybernet

# 4. Test connection
mongosh "mongodb://localhost:27017/cybernet"
```

### Problem: Email Not Sending

**Error:**
```
Error: Invalid login: 535-5.7.8 Username and password not accepted
```

**Solutions:**
```bash
# 1. Check Gmail App Password
# - Not regular Gmail password
# - Must be 16-character app-specific password
# - Enable 2-factor authentication first

# 2. Update .env.local
USER_EMAIL=your-email@gmail.com
USER_PASS=xxxx xxxx xxxx xxxx  # 16 chars with spaces

# 3. Test email sending
npm run test:email
```

### Problem: Port 3000 Already in Use

**Solution:**
```bash
# Kill process using port 3000
# macOS/Linux
lsof -ti:3000 | xargs kill -9

# Windows
netstat -ano | findstr :3000
taskkill /PID [PID] /F

# Or use different port
PORT=3001 npm run dev
```

### Problem: TypeScript Errors

**Solution:**
```bash
# Rebuild TypeScript
npm run type-check

# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Restart dev server
npm run dev
```

### Problem: Package Installation Issues

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Delete lock files
rm -rf node_modules package-lock.json

# Reinstall
npm install

# Use specific Node version if issues persist
nvm use 16.19.0
npm install
```

---

## Performance Optimization

### Image Optimization

```typescript
// ✅ Use Next.js Image component
import Image from 'next/image';

<Image
  src="/logo.png"
  alt="Logo"
  width={200}
  height={100}
  priority
/>
```

### Database Query Optimization

```typescript
// ✅ Use indexes
db.clients.createIndex({ email: 1 }, { unique: true })

// ✅ Limit returned fields
db.clients.find({}, { _id: 1, email: 1, fullName: 1 })

// ❌ AVOID N+1 queries
for (let client of clients) {
  let membership = await Membership.findById(client.packageId);
}
```

### API Response Caching

```typescript
// ✅ Cache GET requests
export const getMembership = async () => {
  const cached = cache.get('membership');
  if (cached) return cached;
  
  const data = await db.membership.find();
  cache.set('membership', data, 3600); // 1 hour
  return data;
};
```

---

## Debugging Tips

### Enable Debug Logging

```bash
# Run with debug mode
DEBUG=cybernet:* npm run dev
```

### Browser DevTools

```typescript
// React DevTools
// - Install React Developer Tools extension
// - Inspect component state and props

// Next.js DevTools
// - Check Network tab untuk API calls
// - Check Storage tab untuk localStorage
```

### MongoDB Debugging

```bash
# Enable MongoDB logging
mongosh
> db.setProfilingLevel(1, { slowms: 100 })

# View slow queries
> db.system.profile.find().pretty()
```

---

## Version Control

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes and commit
git add .
git commit -m "feat: add new feature"

# Push to remote
git push origin feature/new-feature

# Create Pull Request on GitHub
# After review and approval
git merge
```

### Commit Message Convention

```
feat: add new feature description
fix: fix bug description
docs: documentation changes
style: code style changes
refactor: code refactoring
perf: performance improvements
test: add tests
chore: dependency updates
```

---

**Happy Coding! 🚀**

Need help? Create an issue on GitHub or email support@cybernet.com
