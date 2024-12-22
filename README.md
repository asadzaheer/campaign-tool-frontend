# Campaign Tool Frontend

A modern Vue.js-based frontend application for the Campaign Tool project, built with Vue 3, Vite, and TailwindCSS.

## Tech Stack

- Vue.js 3
- Vite
- TailwindCSS
- Pinia (State Management)
- Vue Router
- HeadlessUI
- Docker

## Prerequisites

- Docker and Docker Compose

## Development Setup

The project is fully dockerized for both development and production environments.

### Local Development

Copy the `.env` file to the root directory:
```bash
cp .env.example .env

Start the development environment using Docker Compose:

```bash
docker compose up --build -d
```

This will:
- Build the development container
- Install all dependencies
- Start the development server with hot-reload
- Mount your local files for real-time development

The development server will be available at `http://localhost:5173`

## Project Structure

- `/src` - Source code
- `/public` - Static assets
- `Dockerfile` - Docker configuration
- `docker-compose.yml` - Development Docker configuration

## Environment Variables

Development environment includes:
- `CHOKIDAR_USEPOLLING=true` - Enable file watching
- `WATCHPACK_POLLING=true` - Enable webpack polling
- `VITE_PORT=5173` - Development server port
- `VITE_HOST=0.0.0.0` - Development server host
- `FAST_REFRESH=true` - Enable fast refresh
