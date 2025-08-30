# Waitlist Companion™ - Mental Health Support Application

## Overview

Waitlist Companion™ is a comprehensive mental health support application designed to provide interim care for patients waiting for NHS mental health services. The application features an anxiety support program with personalized modules, weekly mental health assessments, crisis intervention capabilities, and progress tracking with clinical handoff reports.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **Styling**: Tailwind CSS with Shadcn/UI component library following the "new-york" design system
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **Form Handling**: React Hook Form with Zod validation for type-safe form schemas

### Backend Architecture
- **Runtime**: Node.js with Express.js REST API
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM for type-safe database interactions
- **Schema Validation**: Zod schemas shared between client and server
- **File Structure**: Monorepo with separate client, server, and shared directories

### Data Storage Solutions
- **Database**: PostgreSQL with Drizzle ORM configuration
- **Schema Design**: Comprehensive mental health data model including:
  - User management with NHS number support
  - Onboarding assessments with risk scoring
  - Weekly PHQ-4 based mental health check-ins
  - Modular anxiety support program tracking
  - Progress reports for clinical handoff
- **Storage Strategy**: In-memory storage implementation for development with interface for easy database integration

### Authentication and Authorization
- **Approach**: Simplified email-based authentication for MVP
- **Session Management**: Basic session handling without complex JWT implementation
- **User Context**: Stored user state managed through React Query

### Risk Assessment System
- **Scoring Algorithm**: PHQ-4 based assessment with additional risk factors
- **Risk Levels**: Four-tier system (low, moderate, high, crisis)
- **Escalation Logic**: Automatic flagging for high-risk and crisis situations
- **Clinical Integration**: Structured data for healthcare provider handoff

### Module System
- **Progressive Unlocking**: Week-based anxiety support modules with completion tracking
- **Content Delivery**: Estimated time tracking and activity completion monitoring
- **Engagement Metrics**: Minutes completed and progress percentage calculations

## External Dependencies

### UI Components and Styling
- **Radix UI**: Comprehensive headless component library for accessibility
- **Tailwind CSS**: Utility-first CSS framework with custom design tokens
- **Lucide React**: Icon library for consistent iconography
- **Class Variance Authority**: Type-safe component variant management

### Database and ORM
- **Neon Database**: PostgreSQL hosting with serverless capabilities
- **Drizzle ORM**: Type-safe database toolkit with migration support
- **Drizzle Kit**: Database schema management and migration tools

### Form and Validation
- **React Hook Form**: Performant form library with minimal re-renders
- **Zod**: TypeScript-first schema validation
- **Hookform Resolvers**: Integration between React Hook Form and Zod

### Development Tools
- **Vite**: Fast build tool with HMR and TypeScript support
- **Replit Integration**: Development environment plugins for runtime error handling
- **PostCSS**: CSS processing with Tailwind integration

### Reporting and Analytics
- **jsPDF**: Client-side PDF generation for progress reports
- **Date-fns**: Date manipulation for temporal data handling

### Session Management
- **Connect PG Simple**: PostgreSQL session store for Express sessions
- **Express Session**: Server-side session management

The architecture prioritizes clinical safety through comprehensive risk assessment, seamless healthcare provider integration via structured reporting, and user engagement through progressive module unlocking and regular check-ins.