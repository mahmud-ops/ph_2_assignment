# DevPulse

A RESTful API application for issue tracking built with Express.js and PostgreSQL.

**Live URL:** https://ph-2-assignment-o5tbzrrnt-abdullah-al-mahmuds-projects.vercel.app

## Features

- **User Management**: Create, read, update, and delete users
- **Authentication**: User signup and login with JWT-based authentication
- **Issue Tracking**: Create, read, update, and delete issues with status management
- **Role-based Access**: Support for `contributor` and `maintainer` roles

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL (NeonDB)
- **Authentication**: JWT (jsonwebtoken), bcrypt
- **Language**: TypeScript

## Setup Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/mahmud-ops/ph_2_assignment
   cd ph_2_assignment
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file with the following:
   ```env
   DATABASE_URL=<your-postgres-connection-string>
   JWT_SECRET=<your-jwt-secret>
   PORT=3000
   ```

4. **Build the project**
   ```bash
   npm run build
   ```

5. **Start the server**
   ```bash
   npm start
   ```

   For development:
   ```bash
   npm run dev
   ```

## API Endpoints

### Auth Routes (`/api/auth`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/signup` | Register a new user | No |
| POST | `/login` | Authenticate user and get JWT | No |

### User Routes (`/api/users`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/` | Create a new user | No |
| GET | `/` | Get all users | Yes |
| GET | `/:id` | Get user by ID | No |
| PUT | `/:id` | Update user by ID | No |
| DELETE | `/:id` | Delete user by ID | No |

### Issue Routes (`/api/issues`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/` | Create a new issue | Yes |
| GET | `/` | Get all issues | No |
| GET | `/:id` | Get issue by ID | No |
| PATCH | `/:id` | Update issue by ID | Yes |
| DELETE | `/:id` | Delete issue by ID | Yes |

## Database Schema

### Users Table

| Column | Type | Constraints |
|--------|------|-------------|
| id | SERIAL | PRIMARY KEY |
| name | VARCHAR(30) | NOT NULL |
| email | TEXT | NOT NULL, UNIQUE |
| password | TEXT | NOT NULL |
| role | VARCHAR(20) | DEFAULT 'contributor', NOT NULL, CHECK (IN: 'contributor', 'maintainer') |
| created_at | TIMESTAMP | DEFAULT NOW() |
| updated_at | TIMESTAMP | DEFAULT NOW() |

### Issues Table

| Column | Type | Constraints |
|--------|------|-------------|
| id | SERIAL | PRIMARY KEY |
| title | VARCHAR(150) | NOT NULL |
| description | TEXT | NOT NULL, CHECK (>= 20 chars) |
| type | TEXT | NOT NULL, CHECK (IN: 'bug', 'feature_request') |
| status | TEXT | NOT NULL, DEFAULT 'open', CHECK (IN: 'open', 'in_progress', 'resolved') |
| reporter_id | INTEGER | NOT NULL (references users.id) |
| created_at | TIMESTAMP | DEFAULT NOW() |
| updated_at | TIMESTAMP | DEFAULT NOW() |