# WordWise Dictionary Application

## Overview

WordWise is a modern dictionary application built with React and Express that allows users to search for word definitions using the Free Dictionary API. The application features a clean, responsive UI with search functionality, pronunciation audio, and search history tracking.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack React Query for server state management
- **UI Framework**: Radix UI components with shadcn/ui styling system
- **Styling**: Tailwind CSS with CSS variables for theming
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js REST API
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Storage**: Database-backed storage using DatabaseStorage implementation

### Key Design Decisions

**Full-Stack TypeScript**: Chosen for type safety across the entire application, with shared schema definitions between client and server to ensure consistency.

**Drizzle ORM**: Selected over alternatives like Prisma for its lightweight nature and excellent TypeScript integration, particularly suitable for serverless environments.

**TanStack React Query**: Implemented for efficient server state management, caching, and background updates, reducing the need for complex client-side state management.

**Radix UI + shadcn/ui**: Chosen for accessible, unstyled components that can be easily customized with Tailwind CSS, providing a professional design system.

## Key Components

### Frontend Components
- **WordSearch**: Search input with debounced suggestions
- **WordDefinition**: Displays word meanings, pronunciations, examples, synonyms, and antonyms
- **RecentSearches**: Shows user's search history
- **Left Sidebar Navigation**: Swipeable navigation with Search, Favorites, and History sections
- **Mobile Navigation**: Bottom navigation bar for smaller screens
- **UI Components**: Complete shadcn/ui component library for consistent design

### Backend Services
- **Dictionary Routes**: `/api/dictionary/:word` for fetching definitions
- **Suggestions API**: `/api/suggestions/:query` for search autocomplete
- **Search History**: `/api/recent-searches` for user's search history
- **Storage Layer**: Abstracted storage interface with in-memory and database implementations

### Database Schema
- **Users Table**: Basic user management (username, password)
- **Search History Table**: Tracks searched words with timestamps and parts of speech

## Data Flow

1. **Search Flow**: User types → debounced input → suggestions API → word selection → dictionary API → definition display
2. **History Tracking**: Successful searches are automatically saved to search history
3. **Audio Playback**: Pronunciation audio URLs are extracted from API responses and played using Web Audio API
4. **Caching**: React Query caches API responses for improved performance

## External Dependencies

### APIs
- **Free Dictionary API**: Primary data source for word definitions, pronunciations, and examples
- **No API keys required**: Uses the free tier of dictionaryapi.dev

### Database
- **Neon Database**: Serverless PostgreSQL for production
- **Environment Variables**: `DATABASE_URL` required for database connection

### UI Libraries
- **Radix UI**: Accessible component primitives
- **Lucide React**: Icon library
- **Tailwind CSS**: Utility-first CSS framework
- **class-variance-authority**: For component variant management

## Deployment Strategy

### Development
- **Vite Dev Server**: Hot module replacement for frontend development
- **tsx**: TypeScript execution for backend development
- **Concurrent Development**: Backend and frontend run simultaneously in development

### Production Build
- **Frontend**: Vite builds React app to `dist/public`
- **Backend**: esbuild bundles Express server to `dist/index.js`
- **Static Serving**: Express serves built frontend files in production
- **Database Migrations**: Drizzle Kit handles schema migrations

### Environment Setup
- **Node.js**: ESM modules throughout
- **TypeScript**: Strict mode enabled with path mapping
- **Database**: PostgreSQL connection required via `DATABASE_URL`
- **Build Process**: Single command builds both frontend and backend

The application is designed to be easily deployable to platforms like Replit, Vercel, or any Node.js hosting service with PostgreSQL support.