# 🏠 Real Estate CRM

A complete, full-stack Real Estate Customer Relationship Management (CRM) system built with modern technologies. Manage leads, properties, contacts, tasks, and track all your real estate business activities in one place.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)
![React](https://img.shields.io/badge/react-18.2.0-blue.svg)

## ✨ Features

### 👥 Lead Management
- Complete lead lifecycle tracking (New → Contacted → Qualified → Won/Lost)
- Lead assignment to agents
- Priority and source tracking
- Advanced filtering and search
- Activity timeline for each lead

### 🏘️ Property Management
- Property listings with detailed information
- Multiple property types (Apartment, Villa, House, Land, Commercial)
- Image upload support (up to 10 images per property)
- Price and area filters
- Location-based search

### 💼 Contact Management
- Centralized contact database
- Tag-based organization
- Company and position tracking
- Search and filter capabilities

### ✅ Task Management
- Create and assign tasks
- Due date tracking
- Status management (Todo, In Progress, Completed)
- Link tasks to leads
- Overdue task alerts

### 📊 Dashboard & Analytics
- Real-time statistics
- Lead distribution charts
- Task analytics
- Recent activity feed
- Performance metrics

### 🔒 Authentication & Authorization
- JWT-based authentication
- Role-based access control (Admin, Manager, Agent)
- Secure password hashing
- Profile management

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **TailwindCSS** - Styling
- **Radix UI** - Component library
- **React Query** - Data fetching and caching
- **React Router** - Routing
- **React Hook Form** - Form management
- **Axios** - HTTP client

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **PostgreSQL** - Database
- **Prisma** - ORM
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Multer** - File uploads

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- npm or yarn

### Installation

1. **Clone the repository**:
```bash
git clone https://github.com/Gaikwad1208/real-estate-crm.git
cd real-estate-crm
```

2. **Setup Backend**:
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your database credentials
```

3. **Configure Database**:
```sql
CREATE DATABASE real_estate_crm;
```

4. **Run Migrations**:
```bash
npm run prisma:migrate
npm run prisma:generate
```

5. **Seed Database** (Optional):
```bash
npm run seed
```

6. **Start Backend**:
```bash
npm run dev
```
Backend will run on `http://localhost:5000`

7. **Setup Frontend** (in a new terminal):
```bash
cd ..
npm install
cp .env.example .env
# Edit .env with backend API URL
```

8. **Start Frontend**:
```bash
npm run dev
```
Frontend will run on `http://localhost:5173`

## 🐳 Docker Deployment

### Using Docker Compose

1. **Create `.env` file** in root directory:
```env
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_password
POSTGRES_DB=real_estate_crm
JWT_SECRET=your-super-secret-jwt-key
FRONTEND_URL=http://localhost:5173
```

2. **Start all services**:
```bash
docker-compose up -d
```

3. **Run migrations**:
```bash
docker-compose exec backend npx prisma migrate deploy
```

4. **Seed database** (optional):
```bash
docker-compose exec backend npm run seed
```

### Services
- **Backend API**: http://localhost:5000
- **PostgreSQL**: localhost:5432
- **Frontend**: http://localhost:5173 (if enabled)

## 📚 API Documentation

Complete API documentation is available in [backend/README.md](backend/README.md).

### Base URL
```
http://localhost:5000/api
```

### Authentication
All protected endpoints require JWT token:
```
Authorization: Bearer <your-jwt-token>
```

### Main Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/auth/register` | POST | Register new user |
| `/auth/login` | POST | Login user |
| `/leads` | GET/POST | Manage leads |
| `/properties` | GET/POST | Manage properties |
| `/contacts` | GET/POST | Manage contacts |
| `/tasks` | GET/POST | Manage tasks |
| `/dashboard/stats` | GET | Get statistics |

### Default Users (after seeding)

```
Admin:
Email: admin@realestatecrm.com
Password: admin123

Agent:
Email: agent@realestatecrm.com
Password: admin123
```

## 📁 Project Structure

```
real-estate-crm/
├── backend/
│   ├── controllers/      # Business logic
│   ├── routes/           # API routes
│   ├── middleware/       # Auth, validation
│   ├── prisma/           # Database schema
│   ├── utils/            # Helper functions
│   ├── server.js         # Entry point
│   └── package.json
├── src/
│   ├── api/              # API client
│   ├── components/       # React components
│   ├── context/          # State management
│   ├── hooks/            # Custom hooks
│   ├── pages/            # Page components
│   ├── lib/              # Utilities
│   └── App.jsx           # Main app
├── docker-compose.yml    # Docker setup
├── .env.example          # Environment template
└── README.md             # This file
```

## 🛡️ Security Features

- ✅ JWT-based authentication
- ✅ Password hashing with bcrypt
- ✅ Role-based access control (RBAC)
- ✅ Input validation and sanitization
- ✅ SQL injection protection via Prisma ORM
- ✅ XSS protection
- ✅ CORS configuration

## 📊 Database Schema

The application uses PostgreSQL with the following main models:

- **User** - System users with roles
- **Lead** - Potential customers
- **Property** - Real estate listings
- **Contact** - Contact information
- **Task** - Task management
- **Activity** - Activity logs

See [backend/prisma/schema.prisma](backend/prisma/schema.prisma) for complete schema.

## 📝 Environment Variables

### Backend (.env)
```env
DATABASE_URL=postgresql://user:pass@localhost:5432/real_estate_crm
JWT_SECRET=your-super-secret-key
JWT_EXPIRE=7d
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME="Real Estate CRM"
```

## 🧑‍💻 Development

### Backend Scripts
```bash
npm run dev          # Start dev server
npm start            # Start production server
npm run prisma:migrate   # Run migrations
npm run prisma:studio    # Open Prisma Studio
npm run seed         # Seed database
```

### Frontend Scripts
```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

## 📦 Deployment

### Production Checklist

- [ ] Change JWT_SECRET to a strong random string
- [ ] Set NODE_ENV=production
- [ ] Configure production database
- [ ] Set up SSL/TLS certificates
- [ ] Configure CORS for production domain
- [ ] Set up backup strategy for database
- [ ] Configure file upload limits
- [ ] Set up monitoring and logging

### Deployment Options

1. **Docker** - Use provided docker-compose.yml
2. **VPS** - Deploy on DigitalOcean, AWS EC2, etc.
3. **PaaS** - Deploy on Heroku, Railway, Render
4. **Serverless** - Use Vercel (frontend) + Railway (backend)

## 🐛 Troubleshooting

### Common Issues

**Database connection failed**
- Check PostgreSQL is running
- Verify DATABASE_URL format
- Check database exists and user has permissions

**Port already in use**
```bash
# Find and kill process
lsof -ti:5000 | xargs kill -9
```

**Migration errors**
```bash
# Reset database (WARNING: deletes all data)
npx prisma migrate reset
```

**CORS errors**
- Check FRONTEND_URL in backend .env
- Verify frontend is using correct API URL

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Gaikwad1208**
- GitHub: [@Gaikwad1208](https://github.com/Gaikwad1208)

## 🙏 Acknowledgments

- Built with modern React and Node.js best practices
- UI components from Radix UI and shadcn/ui
- Database management with Prisma ORM

## 📞 Support

For support, create an issue on [GitHub Issues](https://github.com/Gaikwad1208/real-estate-crm/issues).

---

**Made with ❤️ for Real Estate Professionals**

Star ⭐ this repository if you find it helpful!