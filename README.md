# CSAT Multi-Step Form Application

A full-stack customer satisfaction survey application built with React, TypeScript, and Fastify. The application features a multi-step form interface with session persistence, real-time progress tracking, and a robust API backend.

## 🏗️ Architecture Overview

### Tech Stack

**Frontend:**

- React 19 with TypeScript
- Vite for build tooling
- TailwindCSS for styling
- Zustand for state management
- React Hook Form for form handling
- Tanstack Query for API state management
- Radix UI components
- React Router for navigation

**Backend:**

- Fastify web framework
- PostgreSQL database with Drizzle ORM
- Direct route definitions with TypeScript
- TypeScript with ESM modules
- Pino for logging
- UUID for session ID generation

**Infrastructure:**

- Docker containerization
- Vercel deployment support
- E2B sandbox environment
- PNPM workspace monorepo

## 📁 Project Structure

```
csat_multistep_form/
├── frontend/          # React application
│   ├── src/
│   │   ├── apis/     # API client and adapters
│   │   ├── components/  # UI components
│   │   ├── hooks/    # Custom React hooks
│   │   ├── pages/    # Page components
│   │   ├── store/    # Zustand state management
│   │   ├── styles/   # CSS and theme files
│   │   └── types/    # TypeScript definitions
│   └── dist/         # Production build output
│
├── backend/          # Fastify API server
│   ├── src/
│   │   ├── config/   # Configuration schemas
│   │   ├── db/       # Database schema and migrations
│   │   ├── plugins/  # Fastify plugins
│   │   ├── repositories/ # Data access layer
│   │   ├── routes/   # API route definitions
│   │   └── services/ # Business logic layer
│   └── dist/         # Compiled JavaScript output
│
├── openapi/          # API specifications
│   ├── openapi_spec.yaml  # OpenAPI 3.1 specification
│   └── generated-types.d.ts # Auto-generated TypeScript types
│
├── api/              # Vercel serverless function
├── docker/           # Docker configuration
├── e2b/              # E2B sandbox configuration
└── scripts/          # Build and utility scripts
```

## 🚀 Features

### Survey Management

- **Multi-step form navigation** with progress tracking
- **Session persistence** across browser refreshes
- **Auto-save functionality** with debounced updates
- **Dynamic question types**: text, textarea, select, radio, checkbox, rating
- **Form validation** with real-time error feedback
- **Step-by-step progress bar** with visual indicators

### API Capabilities

- RESTful API following OpenAPI 3.1 specification
- Session-based survey state management
- CRUD operations for survey sessions
- Step navigation with validation
- Progress tracking endpoints

### 🔑 Route Architecture

**This application uses direct Fastify routes for all API endpoints.**

The backend follows a traditional layered architecture:

1. **Routes** (`/backend/src/routes/`): Define API endpoints and handle HTTP requests
2. **Services** (`/backend/src/services/`): Contain business logic and orchestrate data operations
3. **Repositories** (`/backend/src/repositories/`): Handle data access and database operations
4. **Direct route definitions** provide clear, explicit control over API behavior

#### How It Works:

- **Route Files** (`/backend/src/routes/*.route.ts`): Each route file defines endpoints for a specific resource
- **Service Layer** (`/backend/src/services/*.service.ts`): Business logic is separated from HTTP handling
- **Type Safety**: Full TypeScript support with explicit request/response types
- **Modular Structure**: Each resource has its own route file for better organization

#### To Add New API Endpoints:

1. Create a new route file in `/backend/src/routes/`
2. Define the route handlers with proper TypeScript types
3. Create corresponding service methods in `/backend/src/services/`
4. Export the route from `/backend/src/routes/index.ts`
5. Register the route in `/backend/src/app.ts`

#### Route Organization:

- **Health Routes** (`health.route.ts`): Infrastructure and monitoring endpoints
- **Survey Session Routes** (`survey-sessions.route.ts`): All survey-related endpoints including session management, navigation, and progress tracking

### Database Schema

- **Survey Sessions**: Tracks active survey instances
- **Survey Steps**: Stores step metadata and question mappings
- **Survey Answers**: Persists user responses with JSON flexibility

## 🛠️ Installation

### Prerequisites

- Node.js >= 22.17.1
- PNPM ~10.14.0
- PostgreSQL database

### Available Scripts

**Root level:**

- `pnpm build` - Build all packages
- `pnpm test` - Run all tests
- `pnpm lint` - Lint all packages
- `pnpm typecheck` - Type check all packages
- `pnpm validate` - Run preflight checks

**Frontend:**

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm test` - Run tests
- `pnpm lint:fix` - Fix linting issues

**Backend:**

- `pnpm dev` - Start development server with hot reload
- `pnpm build` - Compile TypeScript
- `pnpm test` - Run tests
- `pnpm db:generate` - Generate database migrations
- `pnpm db:migrate` - Run database migrations

## 🔧 Configuration

### API Routes

API routes are defined directly in the `/backend/src/routes/` directory. Each route file contains the endpoint definitions and request handlers for a specific resource.

### Database Configuration

Database connection is configured via the `APP_DATABASE_URL` environment variable. The schema uses Drizzle ORM for type-safe database operations.

### Frontend Themes

Multiple themes are available in `frontend/src/styles/`:

- Default theme
- Modern minimal
- Bold tech
- Neo-brutalism
- Art deco
- Gruvbox
- Sepia

## 📚 API Documentation

### Key Endpoints

- `POST /api/v1/survey-sessions` - Create new survey session
- `GET /api/v1/survey-sessions/{sessionId}` - Retrieve session state
- `PUT /api/v1/survey-sessions/{sessionId}/steps/{stepIndex}` - Save step answers
- `POST /api/v1/survey-sessions/{sessionId}/navigate` - Navigate between steps
- `GET /api/v1/survey-sessions/{sessionId}/progress` - Get progress information

### Response Formats

All API responses follow a consistent JSON structure with appropriate HTTP status codes and error handling.
