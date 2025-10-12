# 🚀 Mafuta Multi-Tenant Fuel Platform

> **Enterprise-grade multi-tenant fuel management system supporting both B2B fleet companies and B2C individual consumers**

[![React](https://img.shields.io/badge/React-18.x-blue)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.x-purple)](https://vitejs.dev/)
[![Clerk](https://img.shields.io/badge/Auth-Clerk-5865F2)](https://clerk.com/)
[![Supabase](https://img.shields.io/badge/Database-Supabase-green)](https://supabase.com/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

---

## 🎯 What is Mafuta?

Mafuta is a **dual-mode fuel management platform** that serves:

### 🚛 Fleet Management (B2B)
For companies like **AtoB Fuel**, **Wex Fleet**, **Shell Fleet Solutions**
- Manage 10-500+ vehicles
- Role-based access (admin, manager, driver, accountant)
- Fuel transaction approval workflows
- Real-time spending analytics
- Complete company data isolation

### 🚗 Individual Consumers (B2C)
For personal users like **Upside**, **GasBuddy**
- Digital fuel cards
- Find cheapest gas nearby
- Earn cashback rewards
- Track spending & MPG
- Price drop alerts

**Same codebase. Two customer types. One amazing platform.**

---

## ✨ Key Features

### 🔐 Enterprise Security
- **Clerk Authentication** - Passwordless login, OAuth, magic links
- **Supabase RLS** - Row-level security for complete data isolation
- **Multi-layer Permissions** - Frontend + backend authorization
- **JWT Token Flow** - Secure Clerk → Supabase integration

### 🏢 Multi-Tenant Architecture
- **Complete Data Isolation** - Company A cannot see Company B's data
- **Unified User Management** - Single users table, account type discriminator
- **Shared Resources** - Efficient database design
- **Scalable** - 1 to 10,000+ customers on same infrastructure

### 🎨 Modern UI/UX
- **Smart Onboarding** - Auto-routing based on account type
- **Role-Based Dashboards** - Different views for different users
- **Responsive Design** - Mobile & desktop optimized
- **Beautiful Components** - Tailwind CSS styling

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Clerk account ([dashboard.clerk.com](https://dashboard.clerk.com))
- Supabase account ([app.supabase.com](https://app.supabase.com))

### 1. Clone & Install
```bash
git clone https://github.com/yourusername/mafuta.git
cd mafuta
npm install
```

### 2. Run Setup Script
```bash
chmod +x setup-multi-tenant.sh
./setup-multi-tenant.sh
```

The script will guide you through:
- ✅ Installing dependencies
- ✅ Creating `.env` file
- ✅ Database setup instructions
- ✅ Clerk JWT configuration
- ✅ Activating multi-tenant mode

### 3. Configure Environment
Create `.env` file:
```env
# Clerk
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...

# Supabase
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGci...
```

### 4. Setup Database
Run the migration in Supabase SQL Editor:
```bash
# Copy contents of supabase/migrations/001_multi_tenant_schema.sql
# Paste into Supabase SQL Editor and run
```

### 5. Start Dev Server
```bash
npm run dev
```

Visit `http://localhost:5173` 🎉

---

## 📁 Project Structure

```
mafuta/
├── src/
│   ├── App_MultiTenant.jsx          # Multi-tenant router
│   ├── config/
│   │   └── userTypes.js              # Roles & permissions
│   ├── lib/
│   │   └── supabaseAuth.js           # Auth helpers
│   ├── components/
│   │   ├── auth/
│   │   │   └── ProtectedRoute.jsx    # Route guards
│   │   ├── onboarding/
│   │   │   ├── AccountTypeSelector.jsx
│   │   │   ├── FleetOnboarding.jsx
│   │   │   ├── IndividualOnboarding.jsx
│   │   │   └── OnboardingRouter.jsx
│   │   └── layout/
│   │       ├── Layout.jsx            # Individual layout
│   │       └── FleetLayout.jsx       # Fleet layout
│   └── pages/
│       ├── fleet/                    # B2B pages
│       │   ├── FleetDashboard.jsx
│       │   ├── FleetVehiclesPage.jsx
│       │   └── FleetTransactionsPage.jsx
│       └── ...                       # B2C pages
├── supabase/
│   └── migrations/
│       └── 001_multi_tenant_schema.sql
└── docs/
    ├── QUICK_START_GUIDE.md
    ├── MULTI_TENANT_IMPLEMENTATION.md
    ├── ARCHITECTURE_DIAGRAMS.md
    └── EXECUTIVE_SUMMARY.md
```

---

## 🎭 User Roles & Permissions

### Fleet Roles (B2B)

| Role | Description | Permissions |
|------|-------------|-------------|
| **Fleet Admin** 👑 | Company owner | Full access - manage company, users, vehicles |
| **Fleet Manager** 📊 | Operations | Approve transactions, manage vehicles, view reports |
| **Driver** 🚗 | Vehicle operator | Record fuel purchases, view assigned vehicle |
| **Accountant** 💰 | Finance | View financials, export reports (read-only) |
| **Dispatcher** 📍 | Logistics | Plan routes, assign vehicles |

### Individual Roles (B2C)

| Role | Description | Features |
|------|-------------|----------|
| **Consumer** | Free tier | Basic features, digital cards, rewards |
| **Premium** | Paid tier | Advanced analytics, price alerts, priority support |
| **Business** | Small business | Multiple cards, expense tracking |

---

## 🗄️ Database Schema

### Core Tables

**Multi-Tenant:**
- `users` - All platform users (fleet + individual)
- `fleet_companies` - Business customers
- `fuel_transactions` - All fuel purchases

**Fleet-Specific:**
- `vehicles` - Fleet vehicles
- `trips` - Route/trip records
- `maintenance_records` - Vehicle maintenance

**Individual-Specific:**
- `individual_cards` - Digital fuel cards
- `rewards` - Cashback & rewards

### Data Isolation

**Row-Level Security (RLS) ensures:**
- ✅ Company A sees ONLY Company A's data
- ✅ Drivers see ONLY their assigned vehicle
- ✅ Individual users see ONLY their own data
- ✅ Enforced at database level (cannot be bypassed)

---

## 🔑 Permission System

Simple, declarative permission checks:

```jsx
import { hasFleetPermission } from '../config/userTypes';
import { useUser } from '@clerk/clerk-react';

function MyComponent() {
  const { user } = useUser();
  const userRole = user?.publicMetadata?.role;

  return (
    <>
      {hasFleetPermission(userRole, 'canAddVehicle') && (
        <button>Add Vehicle</button>
      )}
      
      {hasFleetPermission(userRole, 'canApprovePurchase') && (
        <button>Approve Transaction</button>
      )}
    </>
  );
}
```

---

## 🛣️ Routes

### Public
- `/sign-in` - Login
- `/sign-up` - Register

### Onboarding
- `/onboarding` - Smart router
- `/onboarding/account-type` - Choose fleet vs individual
- `/onboarding/fleet` - Fleet setup (3 steps)
- `/onboarding/individual` - Personal setup

### Fleet (B2B) - Protected
- `/fleet/dashboard` - Company overview
- `/fleet/vehicles` - Manage vehicles
- `/fleet/drivers` - Manage drivers
- `/fleet/transactions` - Approve fuel purchases
- `/fleet/reports` - Analytics

### Individual (B2C) - Protected
- `/dashboard` - Personal overview
- `/find-fuel` - Station finder
- `/transactions` - Fuel history
- `/cards` - Digital cards
- `/rewards` - Cashback & points

---

## 📊 Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | React 18 + Vite | Fast, modern UI |
| **Routing** | React Router v6 | Client-side routing |
| **Auth** | Clerk | Authentication, sessions, JWT |
| **Database** | Supabase (PostgreSQL) | Multi-tenant data storage |
| **Authorization** | Supabase RLS | Row-level security policies |
| **Styling** | Tailwind CSS | Utility-first styling |

---

## 🧪 Testing

### Test Fleet Flow
```bash
# 1. Sign up
http://localhost:5173/sign-up

# 2. Select "Fleet Management"
# 3. Fill company info:
#    - Company: Test Logistics Inc.
#    - Type: Logistics
#    - Fleet Size: 11-50 vehicles
#    - Role: Fleet Admin

# 4. Should land on /fleet/dashboard
# 5. Navigate to /fleet/vehicles
# 6. Add a test vehicle
```

### Test Individual Flow
```bash
# 1. Sign up (different email)
http://localhost:5173/sign-up

# 2. Select "Personal Account"
# 3. Complete preferences
# 4. Should land on /dashboard
# 5. Navigate to /cards
# 6. See auto-created digital card
```

### Test Data Isolation
```bash
# 1. Create 2 fleet companies (different users)
# 2. Add vehicles to each
# 3. Log in as company A user
# 4. Verify cannot see company B's vehicles
# ✅ RLS enforces isolation
```

---

## 📚 Documentation

| Document | Purpose | Audience |
|----------|---------|----------|
| **QUICK_START_GUIDE.md** | 10-minute setup | Developers |
| **MULTI_TENANT_IMPLEMENTATION.md** | Step-by-step guide | Technical |
| **ARCHITECTURE_DIAGRAMS.md** | Visual flows | Everyone |
| **EXECUTIVE_SUMMARY.md** | Business overview | Stakeholders |
| **SETUP_COMPLETE.md** | What's done, what's next | Developers |

---

## 🎯 Roadmap

### ✅ Phase 1: MVP (Current)
- [x] Multi-tenant authentication
- [x] Fleet & individual onboarding
- [x] Basic vehicle management
- [x] Transaction tracking
- [x] Permission system
- [x] Data isolation (RLS)

### 🚧 Phase 2: Core Features (Next 4 weeks)
- [ ] Fuel card API integration (WEX, Fleet One)
- [ ] Premium subscriptions (Stripe)
- [ ] Email notifications
- [ ] Advanced reports & analytics
- [ ] Driver invitation system
- [ ] Maintenance scheduling

### 📅 Phase 3: Growth (2-3 months)
- [ ] Mobile apps (React Native)
- [ ] GPS tracking integration
- [ ] Route optimization
- [ ] Receipt OCR scanning
- [ ] Price drop alerts
- [ ] Referral rewards program

### 🚀 Phase 4: Scale (6+ months)
- [ ] White-label for enterprises
- [ ] Public API
- [ ] AI-powered insights
- [ ] Carbon footprint tracking
- [ ] Partner integrations
- [ ] Multi-language support

---

## 💰 Business Model

### Fleet (B2B)
- **Starter:** $99/mo (up to 10 vehicles)
- **Professional:** $299/mo (up to 50 vehicles)
- **Enterprise:** Custom pricing (50+ vehicles)

### Individual (B2C)
- **Free:** Basic features
- **Premium:** $9.99/mo (advanced features)
- **Business:** $29.99/mo (small business tools)

### Revenue Streams
- Monthly subscriptions
- Transaction fees (1-2%)
- Premium add-ons
- White-label licensing
- API access

---

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) first.

### Development Workflow
1. Fork the repo
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

---

## 📄 License

This project is licensed under the MIT License - see [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Clerk** - For amazing authentication
- **Supabase** - For powerful RLS and database
- **React Team** - For the best UI library
- **Vite** - For lightning-fast builds
- **You** - For building with Mafuta!

---

## 📞 Support

- 📧 Email: support@mafuta.app
- 💬 Discord: [Join our community](https://discord.gg/mafuta)
- 🐦 Twitter: [@MafutaApp](https://twitter.com/MafutaApp)
- 📖 Docs: [docs.mafuta.app](https://docs.mafuta.app)

---

## ⭐ Show Your Support

If this project helped you, please give it a ⭐️!

Built with ❤️ by developers, for developers.

**Let's revolutionize fuel management together! 🚀**
