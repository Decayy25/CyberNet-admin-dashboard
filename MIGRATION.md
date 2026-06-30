# 🔄 CyberNet ISP - PackageId Migration Guide

Dokumentasi lengkap untuk migration data `packageId` dari format string (nama paket) ke MongoDB ObjectId string.

## 📋 Daftar Isi

1. [Problem Statement](#problem-statement)
2. [Why Migration Needed](#why-migration-needed)
3. [Migration Steps](#migration-steps)
4. [Verification](#verification)
5. [Rollback Plan](#rollback-plan)
6. [FAQ](#faq)

---

## Problem Statement

### Data Inconsistency Issue

Database `clients` collection memiliki data dalam 2 format yang berbeda untuk field `packageId`:

#### Format Baru (String - Nama Paket)
```json
{
  "_id": ObjectId("6a37e9f5db4f41cdd4454b0c"),
  "fullName": "Ashbatten",
  "phoneNumber": "08123456",
  "email": "example@gmail.com",
  "address": "Bandung",
  "packageId": "50 Mbps", 
  "updatedAt": ISODate("2026-06-27T08:04:49.493Z")
}
```


### Masalah yang Diakibatkan

1. **Query Inconsistency** - Sulit mencari data dengan paket tertentu
2. **Data Validation** - Backend tidak bisa validasi packageId dengan pasti
3. **Email Template** - Menampilkan ObjectId daripada nama paket
4. **Analytics** - Susah menghitung statistics per paket
5. **Data Integrity** - Tidak ada foreign key relationship

---

## Why Migration Needed

### Architecture Improvement

```
SEBELUM (Problematic):
┌─────────────────────────────────────┐
│ clients collection                  │
├─────────────────────────────────────┤
│ packageId: "PAKET 50 Mbps" (String) │  ❌ String matching
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ membership collection                │
├─────────────────────────────────────┤
│ paket: "PAKET 50 Mbps" (Stored)     │
└─────────────────────────────────────┘


SESUDAH (Best Practice):
┌─────────────────────────────────────┐
│ clients collection                  │
├─────────────────────────────────────┤
│ packageId: ObjectId("6a2b...") (Ref)│  ✅ Direct reference
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ membership collection                │
├─────────────────────────────────────┤
│ _id: ObjectId("6a2b...")            │
│ paket: "PAKET 50 Mbps"              │
└─────────────────────────────────────┘
```

### Benefits

- ✅ **Integrity** - Foreign key relationship
- ✅ **Performance** - Direct ObjectId lookups vs string matching
- ✅ **Maintainability** - Clear data model
- ✅ **Scalability** - Better for large datasets
- ✅ **Type Safety** - TypeScript/MongoDB compatibility

---

## Migration Steps

### Phase 1: Preparation & Backup

```bash
# Step 1: Create database backup
mongodump --uri "mongodb+srv://username:password@cluster.mongodb.net/cybernet" \
          --out ./backup/cybernet-$(date +%Y%m%d-%H%M%S)

# Step 2: Verify backup
ls -lh ./backup/
# Should show folder like: cybernet-20260627-120000/

# Step 3: Check data before migration
use cybernet
db.clients.find({ packageId: /^PAKET/ }).count()
# Output: Shows count of old format records
```

### Phase 2: Run Migration Script

#### Option A: Using Node.js Script

**File: `migration.js`**

```javascript
const { MongoClient, ObjectId } = require("mongodb");
require("dotenv").config();

const MONGODB_URI = process.env.MONGODB_URI;

const migratePackageIds = async () => {
  const client = new MongoClient(MONGODB_URI);

  try {
    console.log("🔗 Connecting to MongoDB...");
    await client.connect();
    const db = client.db("cybernet");

    // Step 1: Get all packages
    console.log("\n📦 Fetching membership packages...");
    const packages = await db
      .collection("membership")
      .find({})
      .project({ _id: 1, paket: 1 })
      .toArray();

    if (packages.length === 0) {
      throw new Error("❌ No packages found in database!");
    }

    console.log(`✅ Found ${packages.length} packages`);
    packages.forEach((pkg) => {
      console.log(`   - ${pkg.paket}: ${pkg._id}`);
    });

    // Step 2: Create mapping
    const paketMap = {};
    packages.forEach((pkg) => {
      paketMap[pkg.paket] = pkg._id.toString();
    });

    // Step 3: Get old format records
    console.log("\n🔍 Finding records with old format (string packageId)...");
    const oldFormatCount = await db.collection("clients").countDocuments({
      packageId: { $type: "string", $regex: "^PAKET" },
    });

    console.log(`✅ Found ${oldFormatCount} records to update`);

    // Step 4: Perform migration
    console.log("\n🔄 Starting migration...");
    let totalUpdated = 0;

    for (const [paketName, paketId] of Object.entries(paketMap)) {
      console.log(`   Updating "${paketName}" → "${paketId}"`);

      const result = await db.collection("clients").updateMany(
        { packageId: paketName },
        { $set: { packageId: paketId, updatedAt: new Date() } }
      );

      console.log(`   ✅ Updated ${result.modifiedCount} documents`);
      totalUpdated += result.modifiedCount;
    }

    // Step 5: Verification
    console.log("\n✅ Migration completed!");
    console.log(`   Total records updated: ${totalUpdated}`);

    const remainingOldFormat = await db.collection("clients").countDocuments({
      packageId: { $type: "string", $regex: "^PAKET" },
    });

    if (remainingOldFormat === 0) {
      console.log("   ✅ All records migrated successfully!");
    } else {
      console.log(
        `   ⚠️  ${remainingOldFormat} records still in old format`
      );
    }

    // Step 6: Sample verification
    console.log("\n📋 Sample of migrated data:");
    const samples = await db
      .collection("clients")
      .find({})
      .limit(3)
      .toArray();

    samples.forEach((doc) => {
      console.log(`   - ${doc.fullName}: packageId = ${doc.packageId}`);
    });
  } catch (error) {
    console.error("❌ Migration error:", error.message);
    process.exit(1);
  } finally {
    await client.close();
    console.log("\n🔌 Database connection closed");
  }
};

migratePackageIds();
```

#### Option B: Using MongoDB Shell

```bash
# Connect to MongoDB
mongosh "mongodb+srv://username:password@cluster.mongodb.net/cybernet"

# Switch to database
use cybernet

# Create mapping object
var paketMap = {
  "PAKET 10 Mbps": "507f1f77bcf86cd799439001",
  "PAKET 20 Mbps": "507f1f77bcf86cd799439002",
  "PAKET 30 Mbps": "507f1f77bcf86cd799439003",
  "PAKET 50 Mbps": "507f1f77bcf86cd799439004"
}

# Get actual ObjectIds from membership
var paketMap = {}
db.membership.find({}, { _id: 1, paket: 1 }).forEach(function(doc) {
  paketMap[doc.paket] = doc._id.toString()
})

# Check mapping
printjson(paketMap)

# Perform migration
for (var paketName in paketMap) {
  var paketId = paketMap[paketName]
  var result = db.clients.updateMany(
    { packageId: paketName },
    { $set: { packageId: paketId, updatedAt: new Date() } }
  )
  print(`Updated "${paketName}": ${result.modifiedCount} documents`)
}

# Verify
db.clients.find({ packageId: /^PAKET/ }).count()
# Should return 0 if migration successful
```

### Phase 3: Running Migration in Node.js Project

```bash
# Step 1: Update migration script in project
cp migration.js ./scripts/migration.js

# Step 2: Update package.json
# Add script ke package.json:
# "scripts": {
#   "migrate:packageid": "node ./scripts/migration.js"
# }

# Step 3: Run migration
npm run migrate:packageid

# Output:
# 🔗 Connecting to MongoDB...
# 📦 Fetching membership packages...
# ✅ Found 4 packages
#    - PAKET 10 Mbps: 507f1f77bcf86cd799439001
#    - PAKET 20 Mbps: 507f1f77bcf86cd799439002
#    - ...
# 🔍 Finding records with old format...
# ✅ Found 15 records to update
# 🔄 Starting migration...
# ✅ Migration completed!
```

---

## Verification

### Step 1: Check Migration Result

```bash
use cybernet

# Count records in old format (should be 0)
db.clients.countDocuments({ packageId: { $type: "string", $regex: "^PAKET" } })
# Output: 0 ✅

# Count total clients
db.clients.countDocuments({})
# Output: [total count]

# Show sample data
db.clients.find().limit(3).pretty()
```

### Step 2: Validate Data Integrity

```javascript
// Verify packageId references exist
db.clients.find().forEach(function(client) {
  const pkg = db.membership.findOne({ _id: ObjectId(client.packageId) });
  if (!pkg) {
    print(`ERROR: packageId ${client.packageId} not found in membership!`);
  }
});
```

### Step 3: Test Backend Functionality

```bash
# Test API endpoint
curl -X GET http://localhost:3000/api/client

# Response should show packageId as ObjectId string
# Example:
# {
#   "success": true,
#   "data": [
#     {
#       "_id": "...",
#       "fullName": "Test User",
#       "packageId": "507f1f77bcf86cd799439001",
#       ...
#     }
#   ]
# }

# Test contact form (should work without errors)
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Test User",
    "phoneNumber": "08123456789",
    "email": "test@example.com",
    "address": "Test Address",
    "packageId": "507f1f77bcf86cd799439001"
  }'
```

### Step 4: Check Email Notifications

```bash
# Trigger form submission and verify:
# 1. Email received successfully
# 2. Package name displayed correctly (not ObjectId)
# 3. Price calculated correctly
```

---

## Rollback Plan

### If Migration Fails

#### Option 1: Restore from Backup

```bash
# List available backups
ls -la ./backup/

# Restore from backup
mongorestore --uri "mongodb+srv://username:password@cluster.mongodb.net/cybernet" \
             --drop \
             ./backup/cybernet-20260627-120000/

# Verify restore
mongosh "mongodb+srv://username:password@cluster.mongodb.net/cybernet"
use cybernet
db.clients.findOne()
```

#### Option 2: Manual Rollback

Jika sudah terlanjur update, revert perubahan:

```javascript
// Undo migration - convert back to string format
use cybernet

var paketMap = {}
db.membership.find({}, { _id: 1, paket: 1 }).forEach(function(doc) {
  paketMap[doc._id.toString()] = doc.paket
})

for (var paketId in paketMap) {
  var paketName = paketMap[paketId]
  db.clients.updateMany(
    { packageId: paketId },
    { $set: { packageId: paketName, updatedAt: new Date() } }
  )
}

// Verify
db.clients.findOne()
```

---

## FAQ

### Q: Berapa lama migration process?
**A:** Tergantung jumlah data:
- < 1000 records: < 1 second
- 1000-10000 records: 1-5 seconds
- > 10000 records: 5-30 seconds

### Q: Apakah migration akan downtime?
**A:** Tidak perlu downtime jika menggunakan:
- Replica set MongoDB (production recommended)
- Read preference setting ke secondary saat migration
- Backups diambil dulu

### Q: Bagaimana jika ada error tengah-tengah migration?
**A:** 
1. Stop migration script
2. Check error message
3. Fix issue
4. Restore dari backup
5. Run migration lagi

### Q: Apakah data lama akan hilang?
**A:**
- Jangan khawatir! Data hanya diubah format packageId-nya
- Field lain tetap intact
- Backup selalu dibuat sebelum migration

### Q: Bagaimana dengan pending registrations?
**A:** 
- Stop accepting registrations saat migration
- Atau setup frontend untuk menampilkan "Under Maintenance"
- Atau handle registrations yang masuk selama migration (belum di-migrate)

### Q: Apakah perlu update backend code?
**A:**
- Tidak perlu! Backend sudah siap dengan `getMembershipById()`
- Hanya perlu pastikan validation function aktif

### Q: Bagaimana dengan frontend?
**A:**
- Update sudah dilakukan di form
- Frontend mengirim ObjectId, bukan string
- Tidak perlu deploy ulang jika backend sudah siap

### Q: Berapa kali migration perlu dijalankan?
**A:**
- Hanya 1x saja!
- Setelah itu semua data baru masuk dengan format ObjectId
- Tidak ada data lama lagi

---

## Post-Migration Checklist

- [ ] Backup created dan tersimpan
- [ ] Migration script tested di staging
- [ ] Migration script berhasil di production
- [ ] Verification semua data benar
- [ ] Email notifications bekerja dengan baik
- [ ] Admin dashboard show data correctly
- [ ] API endpoints return correct data
- [ ] No errors di console/logs
- [ ] Team notified about completion
- [ ] Documentation updated

---

## Support

Jika ada pertanyaan atau issues:

1. **Check logs**:
   ```bash
   npm run dev
   # Watch for migration-related errors
   ```

2. **Check database**:
   ```bash
   mongosh
   use cybernet
   db.clients.find({ packageId: /^PAKET/ })
   ```

3. **Contact team**: support@cybernet.com

---

**Migration Status**: ✅ COMPLETED
**Last Run**: June 27, 2026
**Records Migrated**: [Check after running]
**Backup Location**: ./backup/cybernet-20260627-*/
