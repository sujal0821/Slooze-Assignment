# 🍔 Slooze - Role-Based Food Ordering Platform

![Slooze Logo](./frontend/public/FFFFFF-1.png)

A full-stack, role-based food ordering web application built for the Slooze Fullstack Challenge.

---

## ✨ Features

| Feature | Admin | Manager | Member |
|---------|-------|---------|--------|
| View restaurants & menu items | ✅ | ✅ | ✅ |
| Create an order | ✅ | ✅ | ✅ |
| Checkout & pay | ✅ | ✅ | ❌ |
| Cancel an order | ✅ | ✅ | ❌ |
| Add/Modify payment methods | ✅ | ❌ | ❌ |
| **View all countries** | ✅ | ❌ | ❌ |

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Backend** | NestJS, GraphQL, Prisma, SQLite |
| **Frontend** | Next.js 16, React 19, TypeScript, Tailwind CSS 4 |
| **Auth** | JWT-based RBAC with country restrictions |
| **UI Components** | Lucide Icons, Sonner (Toast notifications) |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd Slooze

# Install backend dependencies
cd backend
npm install

# Setup database
npx prisma generate
npx prisma db push
npx prisma db seed

# Start backend (runs on http://localhost:3001)
npm run start:dev
```

```bash
# In a new terminal - Install frontend dependencies
cd frontend
npm install

# Start frontend (runs on http://localhost:3000)
npm run dev
```

### Demo Credentials

| User | Email | Role | Country |
|------|-------|------|---------|
| Nick Fury | nick.fury@slooze.com | Admin | Global |
| Captain Marvel | captain.marvel@slooze.com | Manager | India |
| Captain America | captain.america@slooze.com | Manager | USA |
| Thanos | thanos@slooze.com | Member | India |
| Thor | thor@slooze.com | Member | India |
| Travis | travis@slooze.com | Member | USA |

**Password for all users:** `password123`

---

## 📁 Project Structure

```
Slooze/
├── backend/               # NestJS GraphQL API
│   ├── src/
│   │   ├── auth/         # JWT Auth, Guards, RBAC
│   │   ├── restaurant/   # Restaurant & Menu CRUD
│   │   ├── order/        # Order management
│   │   └── prisma/       # Database service
│   └── prisma/
│       ├── schema.prisma # Database schema
│       └── seed.ts       # Demo data seeding
│
└── frontend/              # Next.js Application
    ├── src/
    │   ├── app/          # Pages (login, dashboard)
    │   ├── context/      # Auth & Cart providers
    │   ├── lib/          # GraphQL queries/mutations
    │   └── components/   # Shared components
    └── public/           # Static assets
```

---

## 🔐 Role-Based Access Control

### Country Restrictions
- **Admin**: Can view restaurants from **all countries** (India & USA)
- **Manager/Member**: Restricted to restaurants in their assigned country

### Permission Matrix
- **Members** can browse and add to cart but cannot checkout
- **Managers** can process orders and cancel them
- **Admins** have full access including payment method management

---

## 🎨 UI Highlights

- **Glassmorphism Design** - Modern, frosted-glass aesthetic
- **Toast Notifications** - Elegant feedback using Sonner
- **Responsive Layout** - Works on desktop and mobile
- **Quick Login** - One-click demo user selection

---

## 📝 API Endpoints

The GraphQL API is available at `http://localhost:3001/graphql`

### Key Queries
- `me` - Get current user
- `restaurants` - Get restaurants (filtered by country/role)
- `orders` - Get user's orders

### Key Mutations
- `login(email, password)` - Authenticate user
- `placeOrder(items)` - Create a new order
- `cancelOrder(orderId)` - Cancel an order

---

## 👨‍💻 Developer

**Made with ❤️ by Sujal Singh**

📧 Contact: [sujal0821@gmail.com](mailto:sujal0821@gmail.com)

---

## © Copyright Notice

**© Slooze. All Rights Reserved.**

This project was created as part of the Slooze Fullstack Challenge evaluation process.
