# Docker Setup for NHS Waitlist

This guide explains how to run the NHS Waitlist application using Docker with PostgreSQL database.

## Prerequisites

- Docker Desktop installed
- Docker Compose installed

## Quick Start

### 1. Clone and Setup
```bash
git clone <your-repo>
cd NHSWaitlist
```

### 2. Environment Configuration
Copy the example environment file:
```bash
cp env.example .env
```

Edit `.env` file if needed (default values should work for local development).

### 3. Start the Application
```bash
# Start PostgreSQL and the application
docker-compose up -d

# Or start with development profile
docker-compose --profile dev up -d
```

### 4. Initialize Database Schema
```bash
# Run database migrations
docker-compose exec app npm run db:push
```

### 5. Access the Application
- **Production**: http://localhost:5000
- **Development**: http://localhost:5001 (if using dev profile)

## Services

### PostgreSQL Database
- **Port**: 5432
- **Database**: nhs_waitlist
- **Username**: nhs_user
- **Password**: nhs_password
- **Data Persistence**: Stored in Docker volume `postgres_data`

### Application
- **Port**: 5000 (production) or 5001 (development)
- **Environment**: Automatically detects DATABASE_URL and uses PostgreSQL
- **Fallback**: Uses in-memory storage if no database connection

## Development Commands

```bash
# View logs
docker-compose logs -f app

# View database logs
docker-compose logs -f postgres

# Access database directly
docker-compose exec postgres psql -U nhs_user -d nhs_waitlist

# Stop services
docker-compose down

# Stop and remove volumes (WARNING: deletes all data)
docker-compose down -v

# Rebuild application
docker-compose build app
docker-compose up -d app
```

## Database Management

### Connect to PostgreSQL
```bash
docker-compose exec postgres psql -U nhs_user -d nhs_waitlist
```

### Backup Database
```bash
docker-compose exec postgres pg_dump -U nhs_user nhs_waitlist > backup.sql
```

### Restore Database
```bash
docker-compose exec -T postgres psql -U nhs_user -d nhs_waitlist < backup.sql
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://nhs_user:nhs_password@postgres:5432/nhs_waitlist` |
| `SESSION_SECRET` | Session encryption key | `your-super-secret-session-key-change-in-production` |
| `NODE_ENV` | Environment mode | `production` |
| `PORT` | Application port | `5000` |

## Troubleshooting

### Database Connection Issues
1. Check if PostgreSQL is running: `docker-compose ps`
2. Check database logs: `docker-compose logs postgres`
3. Verify DATABASE_URL in environment

### Application Issues
1. Check application logs: `docker-compose logs app`
2. Rebuild container: `docker-compose build app`
3. Check if database is healthy: `docker-compose ps`

### Port Conflicts
If ports 5000 or 5432 are already in use, modify the ports in `docker-compose.yml`:
```yaml
ports:
  - "5001:5000"  # Change 5000 to 5001
  - "5433:5432"  # Change 5432 to 5433
```

## Production Deployment

For production deployment:

1. **Change default passwords** in `.env`
2. **Use strong SESSION_SECRET**
3. **Set NODE_ENV=production**
4. **Use external PostgreSQL** for better performance
5. **Configure proper networking** and security

## Data Persistence

- Database data is stored in Docker volume `postgres_data`
- Data persists between container restarts
- To completely reset: `docker-compose down -v`

## Health Checks

The setup includes health checks:
- PostgreSQL: Checks if database is ready
- Application: Depends on healthy database

Monitor health status:
```bash
docker-compose ps
```
