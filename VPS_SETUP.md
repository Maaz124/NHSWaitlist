# VPS Setup Guide for NHS Waitlist

## Quick Setup on Your VPS

### 1. Clone the Repository
```bash
git clone https://github.com/Maaz124/NHSWaitlist.git
cd NHSWaitlist
```

### 2. Install Dependencies
```bash
# Install Node.js (if not already installed)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install project dependencies
npm install
```

### 3. Set Up Environment Variables
```bash
# Create .env file
cp env.example .env

# Edit the .env file with your database details
nano .env
```

### 4. Set Up PostgreSQL Database
```bash
# Install PostgreSQL
sudo apt update
sudo apt install postgresql postgresql-contrib

# Create database and user
sudo -u postgres psql
```

In PostgreSQL console:
```sql
CREATE DATABASE nhs_waitlist;
CREATE USER nhs_user WITH PASSWORD 'nhs_password';
GRANT ALL PRIVILEGES ON DATABASE nhs_waitlist TO nhs_user;
\q
```

### 5. Run Database Migrations
```bash
# Push database schema
npm run db:push
```

### 6. Start the Application
```bash
# Development mode
npm run dev

# Production mode
npm run build
npm start
```

### 7. Set Up PM2 for Production (Optional)
```bash
# Install PM2
npm install -g pm2

# Start with PM2
pm2 start npm --name "nhs-waitlist" -- start

# Save PM2 configuration
pm2 save
pm2 startup
```

## Environment Variables (.env)
```env
DATABASE_URL=postgresql://nhs_user:nhs_password@localhost:5432/nhs_waitlist
SESSION_SECRET=your-super-secret-session-key-change-in-production
NODE_ENV=production
PORT=5000
```

## Access Your Application
- **Local**: http://localhost:5000
- **External**: http://your-vps-ip:5000

## Useful Commands
```bash
# View logs
pm2 logs nhs-waitlist

# Restart application
pm2 restart nhs-waitlist

# Stop application
pm2 stop nhs-waitlist

# Check status
pm2 status
```

## Troubleshooting
- Check if PostgreSQL is running: `sudo systemctl status postgresql`
- Check application logs: `pm2 logs nhs-waitlist`
- Check database connection: `sudo -u postgres psql -d nhs_waitlist`
