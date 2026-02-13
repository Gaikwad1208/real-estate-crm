# Real Estate CRM - Backend API

## 🚀 Features

- **Authentication & Authorization**: JWT-based auth with role-based access control (Admin, Manager, Agent)
- **Lead Management**: Complete CRUD operations with assignment, status tracking, and filtering
- **Property Management**: Property listings with image uploads, search, and filtering
- **Contact Management**: Store and manage client contacts
- **Task Management**: Task creation, assignment, and status tracking
- **Dashboard Analytics**: Real-time statistics and activity tracking
- **File Uploads**: Image upload support for properties
- **Activity Logging**: Track all important actions and changes

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT (jsonwebtoken)
- **File Upload**: Multer
- **Validation**: Express Validator
- **Password Hashing**: Bcrypt

## 💻 Installation

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- npm or yarn

### Setup Steps

1. **Navigate to backend directory**:
```bash
cd backend
```

2. **Install dependencies**:
```bash
npm install
```

3. **Configure environment variables**:
```bash
cp .env.example .env
```

Edit `.env` file with your configuration:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/real_estate_crm?schema=public"
JWT_SECRET="your-super-secret-jwt-key"
JWT_EXPIRE="7d"
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

4. **Setup PostgreSQL Database**:

Create a new PostgreSQL database:
```sql
CREATE DATABASE real_estate_crm;
```

5. **Run Prisma migrations**:
```bash
npm run prisma:migrate
```

6. **Generate Prisma Client**:
```bash
npm run prisma:generate
```

7. **Seed the database** (optional - creates sample data):
```bash
npm run seed
```

This creates:
- Admin user: `admin@realestatecrm.com` / `admin123`
- Agent user: `agent@realestatecrm.com` / `admin123`
- Sample leads and properties

8. **Start the development server**:
```bash
npm run dev
```

The API will be available at `http://localhost:5000`

## 📋 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication

All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

### API Endpoints

#### Authentication

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/auth/register` | Register new user | No |
| POST | `/auth/login` | Login user | No |
| GET | `/auth/me` | Get current user | Yes |
| PUT | `/auth/profile` | Update profile | Yes |
| PUT | `/auth/change-password` | Change password | Yes |

#### Leads

| Method | Endpoint | Description | Auth | Role |
|--------|----------|-------------|------|------|
| GET | `/leads` | Get all leads | Yes | All |
| POST | `/leads` | Create lead | Yes | All |
| GET | `/leads/:id` | Get lead by ID | Yes | All |
| PUT | `/leads/:id` | Update lead | Yes | All |
| DELETE | `/leads/:id` | Delete lead | Yes | Admin, Manager |
| PUT | `/leads/:id/assign` | Assign lead | Yes | Admin, Manager |
| PUT | `/leads/:id/status` | Update status | Yes | All |

**Query Parameters for GET /leads**:
- `status`: Filter by status (NEW, CONTACTED, QUALIFIED, etc.)
- `source`: Filter by source (WEBSITE, REFERRAL, etc.)
- `priority`: Filter by priority (LOW, MEDIUM, HIGH, URGENT)
- `assignedToId`: Filter by assigned user
- `search`: Search in name, email, phone
- `page`: Page number (default: 1)
- `limit`: Results per page (default: 10)
- `sortBy`: Sort field (default: createdAt)
- `order`: Sort order (asc/desc, default: desc)

#### Properties

| Method | Endpoint | Description | Auth | Role |
|--------|----------|-------------|------|------|
| GET | `/properties` | Get all properties | Yes | All |
| POST | `/properties` | Create property | Yes | All |
| GET | `/properties/:id` | Get property by ID | Yes | All |
| PUT | `/properties/:id` | Update property | Yes | All |
| DELETE | `/properties/:id` | Delete property | Yes | Admin, Manager |
| POST | `/properties/:id/images` | Upload images | Yes | All |

**Query Parameters for GET /properties**:
- `propertyType`: APARTMENT, VILLA, HOUSE, LAND, COMMERCIAL, OFFICE, WAREHOUSE
- `listingType`: SALE, RENT, LEASE
- `status`: AVAILABLE, SOLD, RENTED, UNDER_CONTRACT, OFF_MARKET
- `city`: Filter by city
- `minPrice`: Minimum price
- `maxPrice`: Maximum price
- `minArea`: Minimum area
- `maxArea`: Maximum area
- `bedrooms`: Number of bedrooms
- `search`: Search in title, description, address
- `page`, `limit`, `sortBy`, `order`

#### Contacts

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/contacts` | Get all contacts | Yes |
| POST | `/contacts` | Create contact | Yes |
| GET | `/contacts/:id` | Get contact by ID | Yes |
| PUT | `/contacts/:id` | Update contact | Yes |
| DELETE | `/contacts/:id` | Delete contact | Yes |

#### Tasks

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/tasks` | Get all tasks | Yes |
| POST | `/tasks` | Create task | Yes |
| GET | `/tasks/:id` | Get task by ID | Yes |
| PUT | `/tasks/:id` | Update task | Yes |
| DELETE | `/tasks/:id` | Delete task | Yes |
| PUT | `/tasks/:id/status` | Update task status | Yes |

#### Users

| Method | Endpoint | Description | Auth | Role |
|--------|----------|-------------|------|------|
| GET | `/users` | Get all users | Yes | Admin, Manager |
| GET | `/users/:id` | Get user by ID | Yes | Admin, Manager |
| PUT | `/users/:id` | Update user | Yes | Admin, Manager |
| DELETE | `/users/:id` | Delete user | Yes | Admin |
| PUT | `/users/:id/toggle-status` | Toggle user status | Yes | Admin, Manager |

#### Dashboard

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/dashboard/stats` | Get dashboard statistics | Yes |
| GET | `/dashboard/activities` | Get recent activities | Yes |

### Example Requests

#### Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+919876543210"
  }'
```

#### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@realestatecrm.com",
    "password": "admin123"
  }'
```

#### Create Lead
```bash
curl -X POST http://localhost:5000/api/leads \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "firstName": "Amit",
    "lastName": "Patel",
    "email": "amit@example.com",
    "phone": "+919876543214",
    "source": "WEBSITE",
    "status": "NEW",
    "priority": "HIGH",
    "budget": 6000000,
    "preferredLocation": "Nashik",
    "propertyType": "APARTMENT"
  }'
```

## 📊 Database Schema

The database includes the following models:

- **User**: System users with role-based access
- **Lead**: Potential customers and their information
- **Property**: Real estate property listings
- **Contact**: Contact information storage
- **Task**: Task management for leads and general activities
- **Activity**: Activity log for tracking changes

### Enums

- **Role**: ADMIN, MANAGER, AGENT
- **LeadSource**: WEBSITE, REFERRAL, SOCIAL_MEDIA, COLD_CALL, WALK_IN, EMAIL, ADVERTISEMENT, OTHER
- **LeadStatus**: NEW, CONTACTED, QUALIFIED, PROPOSAL, NEGOTIATION, WON, LOST
- **Priority**: LOW, MEDIUM, HIGH, URGENT
- **PropertyType**: APARTMENT, VILLA, HOUSE, LAND, COMMERCIAL, OFFICE, WAREHOUSE
- **ListingType**: SALE, RENT, LEASE
- **PropertyStatus**: AVAILABLE, SOLD, RENTED, UNDER_CONTRACT, OFF_MARKET
- **TaskStatus**: TODO, IN_PROGRESS, COMPLETED, CANCELLED
- **ActivityType**: CALL, EMAIL, MEETING, NOTE, PROPERTY_VIEW, FOLLOW_UP, STATUS_CHANGE

## 🛡️ Security

- Passwords are hashed using bcrypt
- JWT tokens for authentication
- Role-based access control (RBAC)
- Input validation on all endpoints
- SQL injection protection via Prisma ORM

## 📦 Scripts

- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm run prisma:generate` - Generate Prisma Client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:studio` - Open Prisma Studio (GUI for database)
- `npm run seed` - Seed database with sample data

## 📝 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| DATABASE_URL | PostgreSQL connection string | Yes |
| JWT_SECRET | Secret key for JWT tokens | Yes |
| JWT_EXPIRE | JWT token expiration time | Yes |
| PORT | Server port | Yes |
| NODE_ENV | Environment (development/production) | Yes |
| FRONTEND_URL | Frontend URL for CORS | Yes |
| EMAIL_HOST | SMTP host for emails | No |
| EMAIL_PORT | SMTP port | No |
| EMAIL_USER | SMTP username | No |
| EMAIL_PASSWORD | SMTP password | No |

## 🐛 Troubleshooting

### Database Connection Issues

If you get connection errors:
1. Ensure PostgreSQL is running
2. Check DATABASE_URL format
3. Verify database exists
4. Check user permissions

### Migration Errors

If migrations fail:
```bash
# Reset database (WARNING: deletes all data)
prisma migrate reset

# Then run migrations again
npm run prisma:migrate
```

### Port Already in Use

Change the PORT in `.env` file or kill the process:
```bash
# Find process using port 5000
lsof -ti:5000

# Kill the process
kill -9 <PID>
```

## 📚 Additional Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [Express.js Documentation](https://expressjs.com/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [JWT Introduction](https://jwt.io/introduction)

## ❤️ Support

For issues and questions, please create an issue on GitHub.

---

**Built with ❤️ for Real Estate Professionals**