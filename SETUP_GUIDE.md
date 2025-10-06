# NHS Waitlist Application - Complete Setup Guide

This guide provides everything needed to run the NHS Waitlist application on a new machine.

## 📋 Prerequisites

- **Node.js** (v18 or higher)
- **Docker** and **Docker Compose** (for database)
- **Git** (to clone the repository)

## 🚀 Quick Setup (Recommended)

### 1. Clone the Repository
```bash
git clone <your-repository-url>
cd NHSWaitlist
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
```bash
# Copy the example environment file
cp env.example .env

# Edit .env if needed (default values work for local development)
```

### 4. Start Database with Docker
```bash
# Start PostgreSQL database
docker-compose up -d postgres

# Wait for database to be ready (about 30 seconds)
docker-compose logs postgres
```

### 5. Create Database Tables
You have **3 options** to create the database tables:

#### Option A: Using SQL Script (Recommended)
```bash
# Run the complete table creation script
docker exec nhs-waitlist-db psql -U nhs_user -d nhs_waitlist -f /docker-entrypoint-initdb.d/create-tables.sql
```

#### Option B: Using Drizzle (Alternative)
```bash
# Push schema using Drizzle
npm run db:push
```

#### Option C: Manual SQL Execution
```bash
# Connect to database
docker exec -it nhs-waitlist-db psql -U nhs_user -d nhs_waitlist

# Copy and paste the contents of create-tables.sql
# (Available in the root directory)
```

### 6. Start the Application
```bash
# Start in development mode
npm run dev
```

### 7. Access the Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000

## 📁 Key Files for Setup

### Essential Files
- **`package.json`** - Dependencies and scripts
- **`create-tables.sql`** - Complete database schema
- **`shared/schema.ts`** - TypeScript schema definitions
- **`docker-compose.yml`** - Database configuration
- **`.env`** - Environment variables (copy from `env.example`)

### Database Files
- **`create-tables.sql`** - Creates all tables including:
  - `users` - User accounts
  - `mood_entries` - Mood tracking data
  - `anxiety_guides` - Understanding Anxiety module data
  - `sleep_assessments` - Sleep and Anxiety module data
  - `lifestyle_assessments` - Lifestyle module data
  - `thought_records` - Thought recording data
  - `weekly_assessments` - Weekly check-ins
  - And more...

### Configuration Files
- **`drizzle.config.ts`** - Database ORM configuration
- **`vite.config.ts`** - Frontend build configuration
- **`tailwind.config.ts`** - CSS framework configuration

## 🐳 Docker Commands

### Database Management
```bash
# Start database only
docker-compose up -d postgres

# View database logs
docker-compose logs postgres

# Connect to database
docker-compose exec postgres psql -U nhs_user -d nhs_waitlist

# Stop database
docker-compose down
```

### Full Application with Docker
```bash
# Start everything (database + app)
docker-compose up -d

# View all logs
docker-compose logs -f

# Stop everything
docker-compose down
```

## 🔧 Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Type checking
npm run check

# Database schema push
npm run db:push
```

## 📊 Database Schema

The application uses **PostgreSQL** with the following key tables:

### Core Tables
- **`users`** - User authentication and profiles
- **`onboarding_responses`** - Initial user assessment
- **`weekly_assessments`** - Weekly progress tracking

### Module-Specific Tables
- **`mood_entries`** - Daily mood tracking with calendar integration
- **`anxiety_guides`** - Understanding Anxiety educational content
- **`sleep_assessments`** - Sleep and Anxiety assessment data
- **`lifestyle_assessments`** - Lifestyle factors assessment
- **`thought_records`** - Cognitive behavioral therapy tools

### Supporting Tables
- **`progress_reports`** - Generated progress reports
- **`module_activities`** - Activity tracking
- **`health_check`** - System health monitoring

## 🌐 Environment Variables

Create a `.env` file with these variables:

```env
# Database
DATABASE_URL=postgresql://nhs_user:nhs_password@localhost:5432/nhs_waitlist

# Session
SESSION_SECRET=your-super-secret-session-key-change-in-production

# Environment
NODE_ENV=development
PORT=5000
```

## 🚨 Troubleshooting

### Database Connection Issues
1. **Check if PostgreSQL is running:**
   ```bash
   docker-compose ps
   ```

2. **Check database logs:**
   ```bash
   docker-compose logs postgres
   ```

3. **Verify DATABASE_URL in .env file**

### Missing Tables
If tables are missing, run:
```bash
# Option 1: Use SQL script
docker exec nhs-waitlist-db psql -U nhs_user -d nhs_waitlist -f /docker-entrypoint-initdb.d/create-tables.sql

# Option 2: Use Drizzle
npm run db:push
```

### Port Conflicts
If ports 5000 or 5432 are in use:
1. Stop conflicting services
2. Or modify ports in `docker-compose.yml`

### Module Data Not Saving
1. **Restart the server** after schema changes
2. **Check database tables exist** (especially new columns)
3. **Verify API routes** are working

## 📝 Data Persistence

- **Database data** is stored in Docker volume `postgres_data`
- **Data persists** between container restarts
- **To reset everything**: `docker-compose down -v`

## 🔒 Security Notes

For production deployment:
1. **Change default passwords** in `.env`
2. **Use strong SESSION_SECRET**
3. **Set NODE_ENV=production**
4. **Use external PostgreSQL** for better performance
5. **Configure proper networking** and security

## 📚 Additional Resources

- **`DOCKER_README.md`** - Docker-specific setup
- **`PRODUCTION_DEPLOYMENT.md`** - Production deployment guide
- **`VPS_SETUP.md`** - VPS deployment instructions

## ✅ Verification Checklist

After setup, verify:
- [ ] Database is running (`docker-compose ps`)
- [ ] All tables exist (check with `\dt` in psql)
- [ ] Application starts without errors (`npm run dev`)
- [ ] Frontend loads at http://localhost:5173
- [ ] Can create user account
- [ ] Can access all modules (Mood Tracker, Anxiety Guide, etc.)
- [ ] Data persists after page reload

## 🆘 Getting Help

If you encounter issues:
1. Check the **troubleshooting section** above
2. Verify all **prerequisites** are installed
3. Check **logs** for specific error messages
4. Ensure **database tables** are created properly
5. Try **restarting** the database and application

---

**The application is now ready to use!** 🎉
