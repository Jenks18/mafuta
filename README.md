# Mafuta Fleet Management 🚗

A modern fleet management application built with React, Vite, and Supabase.

## Features

- **Fleet Management** - Track vehicles, drivers, and operations
- **Payroll System** - Quick pay functionality with instant payouts
- **Wallet & Transactions** - Digital wallet with transaction history
- **Find Fuel** - Locate Shell stations with interactive map
- **Mobile & Desktop** - Responsive design for all devices
- **Multi-Tenant** - Support for multiple organizations

## Quick Start

```bash
# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your Supabase credentials

# Start development server
npm run dev
```

## Supabase Integration 🚀

This app uses Supabase for backend services. **New to the Supabase integration?**

### Start Here
1. **[SUPABASE_INDEX.md](./SUPABASE_INDEX.md)** - Complete documentation index
2. **[SUPABASE_CHECKLIST.md](./SUPABASE_CHECKLIST.md)** - Setup checklist
3. **[SUPABASE_SETUP_GUIDE.md](./SUPABASE_SETUP_GUIDE.md)** - Step-by-step guide

### Quick Setup
```bash
# Install Supabase CLI
npm install -g supabase

# Login and link your project
supabase login
supabase link --project-ref YOUR_PROJECT_REF

# Apply database migrations
supabase db push

# Start the app
npm run dev
```

See **[SUPABASE_INDEX.md](./SUPABASE_INDEX.md)** for complete documentation.

## Tech Stack

- **React** - UI library
- **Vite** - Build tool & dev server
- **Supabase** - Backend & database
- **Tailwind CSS** - Styling
- **Mapbox GL** - Interactive maps
- **Zustand** - State management
- **Clerk** - Authentication

## Project Structure

```
mafuta/
├── src/
│   ├── components/     # React components
│   ├── pages/         # Page components
│   ├── lib/           # Utilities & clients
│   ├── hooks/         # Custom hooks
│   └── store/         # State management
├── supabase/
│   └── migrations/    # Database migrations
└── public/            # Static assets
```

## Environment Variables

Required in `.env`:

```env
# Supabase
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Add other credentials as needed
```

## Documentation

### Supabase Integration
- **[SUPABASE_INDEX.md](./SUPABASE_INDEX.md)** - Documentation index
- **[SUPABASE_SETUP_GUIDE.md](./SUPABASE_SETUP_GUIDE.md)** - Complete setup guide
- **[SUPABASE_QUICK_REF.md](./SUPABASE_QUICK_REF.md)** - Quick reference
- **[SUPABASE_ARCHITECTURE.md](./SUPABASE_ARCHITECTURE.md)** - System architecture
- **[SUPABASE_CHECKLIST.md](./SUPABASE_CHECKLIST.md)** - Setup checklist

### Project Documentation
- **[MULTI_TENANT_IMPLEMENTATION.md](./MULTI_TENANT_IMPLEMENTATION.md)** - Multi-tenant guide
- **[AUTH_SETUP.md](./AUTH_SETUP.md)** - Authentication setup
- **[FEATURES_ROADMAP.md](./FEATURES_ROADMAP.md)** - Feature roadmap
- **[QUICK_START_GUIDE.md](./QUICK_START_GUIDE.md)** - Quick start guide

## Available Scripts

```bash
# Development
npm run dev          # Start dev server

# Build
npm run build        # Build for production
npm run preview      # Preview production build

# Linting
npm run lint         # Run ESLint
```

## Database Tables

### `payroll_payouts`
Stores payroll payout attempts and status.

### `wallet_transactions`
Stores wallet transaction history.

See **[supabase/migrations/README.md](./supabase/migrations/README.md)** for schema details.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

[Your License Here]

## Support

- 📖 [Documentation](./SUPABASE_INDEX.md)
- 🐛 [Report Issues](https://github.com/Jenks18/mafuta/issues)
- 💬 [Discussions](https://github.com/Jenks18/mafuta/discussions)

---

**Built with ❤️ using React + Vite + Supabase**
