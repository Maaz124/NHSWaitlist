# Windows Setup Instructions

## Quick Start (Windows)

### 1. Prerequisites
- **Docker Desktop** installed and running
- **Node.js** (v18 or higher)
- **Git** (to clone repository)

### 2. Clone and Setup
```powershell
git clone <your-repo>
cd NHSWaitlist
npm install
```

### 3. Environment Setup
```powershell
copy env.example .env
```

### 4. Start Database
```powershell
docker-compose up -d postgres
```

### 5. Create Database Tables
```powershell
Get-Content create-all-tables.sql | docker exec -i nhs-waitlist-db psql -U nhs_user -d nhs_waitlist
```

### 6. Start Application
```powershell
npm run dev
```

### 7. Access Application
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:5000

## Alternative Commands (if above doesn't work)

### Alternative 1: Copy file method
```powershell
docker cp create-all-tables.sql nhs-waitlist-db:/tmp/create-all-tables.sql
docker exec nhs-waitlist-db psql -U nhs_user -d nhs_waitlist -f /tmp/create-all-tables.sql
```

### Alternative 2: Command Prompt
```cmd
type create-all-tables.sql | docker exec -i nhs-waitlist-db psql -U nhs_user -d nhs_waitlist
```

## Troubleshooting

**Database not starting?**
```powershell
docker-compose ps
docker-compose logs postgres
```

**Port conflicts?**
- Stop any services using ports 5000, 5173, or 5432
- Or modify ports in `docker-compose.yml`

**Tables not created?**
- Check if PostgreSQL is running: `docker-compose ps`
- Try alternative commands above

## That's it! 🎉
Your NHS Waitlist application should now be running.
