# Workout Tracking API

A REST API for tracking workouts and exercises built with Fastify, Prisma, and MongoDB.

## Features

- Create and manage workout plans
- Add exercises to workouts with sets, reps, weight, and rest periods
- Categorize exercises by muscle groups
- Track workout execution with logs
- Record sets, reps, and weights for exercises
- Support for multiple database types (PostgreSQL and MongoDB)

## Tech Stack

- Node.js 22.14
- Fastify
- Prisma ORM (PostgreSQL)
- MongoDB (for logs)
- Zod (schema validation)
- TypeScript
- Docker

## Prerequisites

- Node.js 22.14+
- Docker and Docker Compose (for local development)
- PostgreSQL
- MongoDB

## Getting Started

### Using Docker (Recommended)

1. Clone the repository
2. Make sure Docker and Docker Compose are installed
3. Run the following commands:

```bash
# Start PostgreSQL and MongoDB
npm run docker:up

# Install dependencies
npm install

# Generate Prisma client
npm run db:gen

# Run database migrations
npm run migrate

# Start the API in development mode
npm run dev
```

### Manual Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Configure your database connection in `.env` file
4. Run Prisma migrations: `npm run migrate`
5. Start the development server: `npm run dev`

## Available Endpoints

### Workouts

- `POST /workouts` - Create a new workout
- `GET /workouts` - List all workouts
- `GET /workouts/:id` - Get details of a workout with its exercises
- `POST /workouts/:id/exercises` - Add an exercise to a workout with sets, reps, weight, and rest period

### Exercises

- `POST /exercises` - Create a new exercise with name, muscle group, and description
- `GET /exercises` - List all exercises with their muscle groups
- `GET /exercises/:id` - Get details of an exercise including muscle group
- `GET /exercises/:id/workouts` - Get an exercise with workouts it belongs to
- `PATCH /exercises/:id` - Update an exercise, including muscle group
- `DELETE /exercises/:id` - Delete an exercise

### Workout Logs

- `POST /workouts/:id/start` - Start a workout (create log)
- `PATCH /workouts/:id/logs/:logId/complete` - Complete a workout
- `POST /workouts/:id/logs/:logId/exercises` - Add exercise log during workout
- `PATCH /workouts/:id/logs/:logId/exercises/:exerciseLogId/complete` - Complete an exercise log
- `GET /logs` - List workout logs with optional pagination
- `GET /workouts/:id/logs/:logId/exercises` - Get exercise logs for a specific workout session

## API Documentation

The API documentation is available at `/documentation` when the server is running.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build the application
- `npm start` - Start production server
- `npm run migrate` - Run Prisma migrations
- `npm run db:studio` - Open Prisma Studio
- `npm run docker:up` - Start Docker containers
- `npm run docker:down` - Stop Docker containers
- `npm test` - Run tests
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## Project Structure

```
/src
  /config        - Configuration files
  /controllers   - Route handlers
  /models        - Database models and schemas
  /plugins       - Fastify plugins
  /repositories  - Data access layer
  /routes        - API route definitions
  /schemas       - Zod validation schemas
  /services      - Business logic
  /utils         - Utility functions
  app.ts         - Fastify app setup
  main.ts        - Entry point
/prisma
  schema.prisma  - Prisma schema
```

## License

MIT
