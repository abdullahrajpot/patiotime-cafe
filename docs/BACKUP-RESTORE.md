# Database Backup & Restore Strategy

## Overview

This document outlines the backup and restore procedures for the PatioTime Cafe MongoDB database hosted on MongoDB Atlas.

---

## MongoDB Atlas Automatic Backups

### What's Included

MongoDB Atlas provides automatic cloud backups for all clusters:

- **Continuous Backups**: Point-in-time recovery
- **Snapshot Frequency**: Every 6-24 hours (depending on tier)
- **Retention Period**: 2-35 days (depending on tier)
- **Geographic Redundancy**: Backups stored across multiple regions

### Accessing Backups in Atlas

1. Log in to [MongoDB Atlas](https://cloud.mongodb.com)
2. Navigate to your cluster: `Cluster0`
3. Click on "Backup" tab
4. View available snapshots and restore points

---

## Manual Backup Procedures

### Method 1: Using `mongodump` (Recommended)

**Prerequisites:**
- MongoDB Database Tools installed
- Install: `npm install -g mongodb-database-tools` or download from https://www.mongodb.com/try/download/database-tools

**Backup Command:**

```bash
# Full database backup
mongodump --uri="mongodb+srv://username:password@cluster0.xzvykuv.mongodb.net/patiotime" --out=./backups/$(date +%Y%m%d_%H%M%S)

# Windows PowerShell
mongodump --uri="mongodb+srv://username:password@cluster0.xzvykuv.mongodb.net/patiotime" --out="./backups/$(Get-Date -Format 'yyyyMMdd_HHmmss')"
```

**Backup Specific Collections:**

```bash
# Backup only orders
mongodump --uri="mongodb+srv://username:password@cluster0.xzvykuv.mongodb.net/patiotime" --collection=orders --out=./backups/orders_backup

# Backup critical collections
mongodump --uri="mongodb+srv://username:password@cluster0.xzvykuv.mongodb.net/patiotime" --collection=users --out=./backups/users_backup
mongodump --uri="mongodb+srv://username:password@cluster0.xzvykuv.mongodb.net/patiotime" --collection=orders --out=./backups/orders_backup
mongodump --uri="mongodb+srv://username:password@cluster0.xzvykuv.mongodb.net/patiotime" --collection=menuitems --out=./backups/menu_backup
```

### Method 2: Using MongoDB Compass (GUI)

1. Open MongoDB Compass
2. Connect to your Atlas cluster
3. Select database: `patiotime`
4. Right-click on collection → Export Collection
5. Choose format: JSON or CSV
6. Save to local folder

### Method 3: Using Node.js Script

```javascript
// server/scripts/backup.js
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

async function backupDatabase() {
  const MONGO_URI = process.env.MONGO_URI;
  const backupDir = path.join(__dirname, '../backups', new Date().toISOString().split('T')[0]);

  // Create backup directory
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  await mongoose.connect(MONGO_URI);

  const collections = ['users', 'orders', 'menuitems', 'categories', 'reservations', 'contacts'];

  for (const collectionName of collections) {
    const collection = mongoose.connection.collection(collectionName);
    const data = await collection.find({}).toArray();
    
    const filename = path.join(backupDir, `${collectionName}.json`);
    fs.writeFileSync(filename, JSON.stringify(data, null, 2));
    console.log(`✅ Backed up ${collectionName}: ${data.length} documents`);
  }

  await mongoose.disconnect();
  console.log(`\n🎉 Backup completed! Files saved to: ${backupDir}`);
}

backupDatabase().catch(console.error);
```

**Run the backup script:**
```bash
cd server
node scripts/backup.js
```

---

## Restore Procedures

### Method 1: Using `mongorestore` (Recommended)

**Restore Full Database:**

```bash
# Restore from backup directory
mongorestore --uri="mongodb+srv://username:password@cluster0.xzvykuv.mongodb.net/patiotime" --dir=./backups/20260202_143000
```

**Restore Specific Collection:**

```bash
# Restore only orders collection
mongorestore --uri="mongodb+srv://username:password@cluster0.xzvykuv.mongodb.net/patiotime" --collection=orders --dir=./backups/20260202_143000/patiotime/orders.bson
```

**Important Options:**

- `--drop`: Drop existing collection before restore (destructive!)
- `--nsInclude="patiotime.*"`: Only restore specific database
- `--nsExclude="patiotime.sessions"`: Exclude specific collections

### Method 2: Using MongoDB Atlas UI

1. Go to Atlas Dashboard → Cluster0 → Backup tab
2. Click "Restore" on desired snapshot
3. Choose restore method:
   - **Download**: Download backup files
   - **Point-in-time**: Restore to specific timestamp
   - **Snapshot**: Create new cluster from snapshot

### Method 3: Using Node.js Script

```javascript
// server/scripts/restore.js
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

async function restoreDatabase(backupDir) {
  const MONGO_URI = process.env.MONGO_URI;

  await mongoose.connect(MONGO_URI);

  const collections = ['users', 'orders', 'menuitems', 'categories', 'reservations', 'contacts'];

  for (const collectionName of collections) {
    const filename = path.join(backupDir, `${collectionName}.json`);
    
    if (!fs.existsSync(filename)) {
      console.log(`⚠️  Skipping ${collectionName}: backup file not found`);
      continue;
    }

    const data = JSON.parse(fs.readFileSync(filename, 'utf8'));
    const collection = mongoose.connection.collection(collectionName);
    
    // WARNING: This will delete existing data!
    await collection.deleteMany({});
    
    if (data.length > 0) {
      await collection.insertMany(data);
    }
    
    console.log(`✅ Restored ${collectionName}: ${data.length} documents`);
  }

  await mongoose.disconnect();
  console.log(`\n🎉 Restore completed!`);
}

const backupDir = process.argv[2] || './backups/latest';
restoreDatabase(backupDir).catch(console.error);
```

**Run the restore script:**
```bash
cd server
node scripts/restore.js ./backups/2026-02-02
```

---

## Backup Schedule Recommendations

### Development Environment
- **Frequency**: Before major changes or deployments
- **Method**: Manual `mongodump`
- **Retention**: Keep last 3 backups

### Staging Environment
- **Frequency**: Daily at 2 AM
- **Method**: Automated script with cron job
- **Retention**: Keep 7 days

### Production Environment
- **Frequency**: 
  - Automatic snapshots every 6 hours (MongoDB Atlas)
  - Manual backup before deployments
  - Weekly full backup download
- **Method**: MongoDB Atlas + manual verification
- **Retention**: 
  - Atlas snapshots: 30 days
  - Downloaded backups: 90 days

---

## Automated Backup Script

### Create Backup Cron Job (Linux/Mac)

```bash
# Edit crontab
crontab -e

# Add daily backup at 2 AM
0 2 * * * cd /path/to/patiotime-cafe/server && node scripts/backup.js >> logs/backup.log 2>&1
```

### Windows Task Scheduler

1. Open Task Scheduler
2. Create New Task
3. Trigger: Daily at 2:00 AM
4. Action: Run program
   - Program: `node`
   - Arguments: `scripts/backup.js`
   - Start in: `C:\path\to\patiotime-cafe\server`

---

## Backup Verification

### Checklist

After each backup, verify:

- [ ] Backup files exist and are not empty
- [ ] File sizes are reasonable (not 0 bytes)
- [ ] Can list backup contents
- [ ] Test restore on staging environment
- [ ] Document backup location and timestamp

### Verification Script

```javascript
// server/scripts/verify-backup.js
const fs = require('fs');
const path = require('path');

function verifyBackup(backupDir) {
  console.log(`\n🔍 Verifying backup: ${backupDir}\n`);

  const collections = ['users', 'orders', 'menuitems', 'categories', 'reservations', 'contacts'];
  let allValid = true;

  for (const collection of collections) {
    const filename = path.join(backupDir, `${collection}.json`);
    
    if (!fs.existsSync(filename)) {
      console.log(`❌ ${collection}: FILE NOT FOUND`);
      allValid = false;
      continue;
    }

    const stats = fs.statSync(filename);
    const sizeKB = (stats.size / 1024).toFixed(2);

    if (stats.size === 0) {
      console.log(`❌ ${collection}: EMPTY FILE`);
      allValid = false;
      continue;
    }

    try {
      const data = JSON.parse(fs.readFileSync(filename, 'utf8'));
      console.log(`✅ ${collection}: ${data.length} documents (${sizeKB} KB)`);
    } catch (error) {
      console.log(`❌ ${collection}: INVALID JSON`);
      allValid = false;
    }
  }

  console.log(`\n${allValid ? '✅ Backup is valid!' : '❌ Backup has issues!'}\n`);
  process.exit(allValid ? 0 : 1);
}

const backupDir = process.argv[2] || './backups/latest';
verifyBackup(backupDir);
```

**Run verification:**
```bash
node scripts/verify-backup.js ./backups/2026-02-02
```

---

## Disaster Recovery Plan

### Scenario 1: Accidental Data Deletion

1. Stop all write operations immediately
2. Identify last good backup
3. Restore from most recent snapshot
4. Verify data integrity
5. Resume operations

### Scenario 2: Database Corruption

1. Contact MongoDB Atlas support
2. Use Point-in-Time Recovery to restore to before corruption
3. Verify data integrity
4. Update applications if needed

### Scenario 3: Complete Atlas Failure

1. Use most recent `mongodump` backup
2. Provision new MongoDB Atlas cluster
3. Restore data using `mongorestore`
4. Update `MONGO_URI` in environment variables
5. Test all application functionality

---

## Best Practices

### DO:
✅ Test restore procedures regularly
✅ Store backups in multiple locations
✅ Encrypt backup files
✅ Document backup/restore procedures
✅ Verify backups after creation
✅ Keep backup scripts in version control
✅ Monitor backup job success/failure

### DON'T:
❌ Store backups only in one location
❌ Commit backup files to git
❌ Share backup files with credentials
❌ Skip testing restore procedures
❌ Ignore backup failure notifications

---

## Backup Storage Locations

### Local Development
- Path: `./server/backups/`
- Retention: 3 most recent backups
- `.gitignore` entry: `/server/backups/*`

### Cloud Storage (Recommended for Production)
- **AWS S3**: Versioned bucket with lifecycle policies
- **Google Cloud Storage**: Nearline or Coldline storage
- **Azure Blob Storage**: Cool or Archive tier

### Example: Upload to AWS S3

```javascript
const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

async function uploadBackupToS3(localPath, s3Key) {
  const fileContent = fs.readFileSync(localPath);

  const params = {
    Bucket: 'patiotime-backups',
    Key: s3Key,
    Body: fileContent,
    ServerSideEncryption: 'AES256',
  };

  await s3.upload(params).promise();
  console.log(`✅ Uploaded to S3: ${s3Key}`);
}
```

---

## Recovery Time Objective (RTO) and Recovery Point Objective (RPO)

### Development
- **RTO**: 4 hours (acceptable downtime)
- **RPO**: 24 hours (max data loss acceptable)

### Production
- **RTO**: 1 hour (maximum downtime)
- **RPO**: 6 hours (max data loss acceptable)

---

## Contact & Support

### MongoDB Atlas Support
- Dashboard: https://cloud.mongodb.com
- Support: https://support.mongodb.com
- Documentation: https://docs.atlas.mongodb.com/backup/

### Emergency Contacts
- Database Administrator: [Your Email]
- DevOps Lead: [Your Email]
- MongoDB Atlas Account: [Account Email]

---

## Revision History

| Date | Version | Changes |
|------|---------|---------|
| 2026-02-09 | 1.0 | Initial documentation |

---

*Last Updated: February 9, 2026*
