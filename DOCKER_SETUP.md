# Docker Setup Guide for NHS Waitlist

This guide explains how to run the NHS Waitlist application using Docker containers.

## Prerequisites

- Docker and Docker Compose installed on your system
- Git (to clone the repository)

## Quick Start

### 1. Clone and Setup

```bash
# Clone the repository
git clone <your-repo-url>
cd NHSWaitlist

# Copy environment template
cp env.docker.template .env

# Edit .env file with your actual values
nano .env
```

### 2. Production Setup (Recommended)

```bash
# Build and start all services
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f
```

### 3. Development Setup

```bash
# Build and start development environment
docker-compose -f docker-compose.dev.yml up -d

# View logs
docker-compose -f docker-compose.dev.yml logs -f
```

## Environment Configuration

Update the `.env` file with your actual values:

```env
# Database Configuration
DATABASE_URL=postgresql://nhs_user:nhs_password@postgres:5432/nhs_waitlist

# Session Configuration (CHANGE THIS!)
SESSION_SECRET=your-super-secret-session-key-change-this-in-production

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here

# Application Configuration
NODE_ENV=production
PORT=5000
```

## Services

### Production (`docker-compose.yml`)

- **postgres**: PostgreSQL 15 database
- **app**: NHS Waitlist application (production build)

### Development (`docker-compose.dev.yml`)

- **postgres**: PostgreSQL 15 database
- **app-dev**: NHS Waitlist application with hot reload

## Useful Commands

### Basic Operations

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# Rebuild and restart
docker-compose up -d --build

# View logs
docker-compose logs -f

# Check service status
docker-compose ps
```

### Database Operations

```bash
# Access database shell
docker-compose exec postgres psql -U nhs_user -d nhs_waitlist

# Run SQL scripts
docker-compose exec postgres psql -U nhs_user -d nhs_waitlist -f /path/to/script.sql

# Backup database
docker-compose exec postgres pg_dump -U nhs_user nhs_waitlist > backup.sql

# Restore database
docker-compose exec -T postgres psql -U nhs_user -d nhs_waitlist < backup.sql
```

### Application Operations

```bash
# Access application container
docker-compose exec app sh

# View application logs
docker-compose logs app

# Restart application
docker-compose restart app
```

### Development Operations

```bash
# Start development environment
docker-compose -f docker-compose.dev.yml up -d

# View development logs
docker-compose -f docker-compose.dev.yml logs -f app-dev

# Stop development environment
docker-compose -f docker-compose.dev.yml down
```

## Health Checks

Both services include health checks:

- **Database**: Checks PostgreSQL connectivity
- **Application**: Checks HTTP endpoint at `/api/health`

## Ports

- **5000**: Application (both production and development)
- **5432**: PostgreSQL database
- **24678**: Vite HMR (development only)

## Volumes

- **postgres_data**: Persistent database storage
- **app_logs**: Application logs
- **Development volumes**: Live code reloading

## Network

All services run on the `nhs-network` bridge network for internal communication.

## Troubleshooting

### Common Issues

1. **Port already in use**:
   ```bash
   # Check what's using the port
   netstat -tulpn | grep :5000
   # Kill the process or change ports in docker-compose.yml
   ```

2. **Database connection issues**:
   ```bash
   # Check database logs
   docker-compose logs postgres
   # Ensure database is healthy
   docker-compose ps
   ```

3. **Application won't start**:
   ```bash
   # Check application logs
   docker-compose logs app
   # Rebuild the image
   docker-compose up -d --build
   ```

4. **Permission issues**:
   ```bash
   # Fix ownership
   sudo chown -R $USER:$USER .
   ```

### Reset Everything

```bash
# Stop and remove everything
docker-compose down -v

# Remove all images
docker-compose down --rmi all

# Start fresh
docker-compose up -d --build
```

## Production Deployment

For production deployment on a VPS:

1. **Secure the environment**:
   - Change default passwords
   - Use strong SESSION_SECRET
   - Configure proper Stripe keys
   - Set up SSL/TLS

2. **Configure reverse proxy** (nginx example):
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
       location / {
           proxy_pass http://localhost:5000;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }
   }
   ```

3. **Set up monitoring**:
   - Use Docker health checks
   - Monitor logs
   - Set up backups

## Security Notes

- Change default database passwords
- Use strong session secrets
- Keep Docker images updated
- Use secrets management for sensitive data
- Configure proper firewall rules

## Support

For issues or questions:
1. Check the logs: `docker-compose logs -f`
2. Verify environment configuration
3. Ensure all prerequisites are installed
4. Check Docker and Docker Compose versions
