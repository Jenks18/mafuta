# 🎯 Multi-Tenant Architecture Diagram

## System Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                         MAFUTA PLATFORM                             │
│                    Clerk Authentication Layer                       │
│                  (Single Sign-On for All Users)                     │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                                  │ JWT Token
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      Onboarding Router                              │
│              Detects: New User? Account Type?                       │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                    ┌─────────────┴──────────────┐
                    │                            │
            Account Type Selector                │
                    │                            │
        ┌───────────┴────────────┐               │
        │                        │               │
        ▼                        ▼               │
┌─────────────┐        ┌──────────────────┐     │
│   FLEET     │        │   INDIVIDUAL     │     │
│   (B2B)     │        │     (B2C)        │     │
└─────────────┘        └──────────────────┘     │
        │                        │               │
        ▼                        ▼               │
Fleet Onboarding        Individual Onboarding   │
        │                        │               │
        ▼                        ▼               ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        SUPABASE DATABASE                            │
│                   Row Level Security (RLS)                          │
└─────────────────────────────────────────────────────────────────────┘
        │                        │
        ▼                        ▼
┌───────────────┐        ┌─────────────────┐
│ Fleet Tables  │        │ Individual       │
│               │        │ Tables           │
│ • companies   │        │ • cards          │
│ • vehicles    │        │ • rewards        │
│ • trips       │        │                  │
│ • maintenance │        │                  │
└───────────────┘        └─────────────────┘
        │                        │
        └────────────┬───────────┘
                     ▼
            ┌─────────────────┐
            │ Shared Tables   │
            │ • users         │
            │ • transactions  │
            └─────────────────┘
```

---

## Data Flow: User Signup to Dashboard

```
1. User clicks "Sign Up"
   │
   ▼
2. Clerk creates account
   │
   ▼
3. Redirect to /onboarding
   │
   ▼
4. OnboardingRouter checks metadata
   │
   ├─ No account_type? → Show AccountTypeSelector
   │                      │
   │                      ├─ Selects "Fleet" → /onboarding/fleet
   │                      │                      │
   │                      │                      ├─ Step 1: Company info
   │                      │                      ├─ Step 2: Your role
   │                      │                      ├─ Step 3: Billing
   │                      │                      │
   │                      │                      ▼
   │                      │                   Save to Supabase:
   │                      │                      - fleet_companies table
   │                      │                      - users table (account_type='fleet')
   │                      │                      │
   │                      │                      ▼
   │                      │                   Update Clerk metadata:
   │                      │                      - accountType: 'fleet'
   │                      │                      - role: 'fleet_admin'
   │                      │                      - onboarded: true
   │                      │                      │
   │                      │                      ▼
   │                      │                   Navigate to /fleet/dashboard
   │                      │
   │                      └─ Selects "Individual" → /onboarding/individual
   │                                               │
   │                                               ├─ Preferences
   │                                               ├─ Vehicle info
   │                                               ├─ Subscription tier
   │                                               │
   │                                               ▼
   │                                            Save to Supabase:
   │                                               - users table (account_type='individual')
   │                                               - individual_cards table
   │                                               │
   │                                               ▼
   │                                            Update Clerk metadata:
   │                                               - accountType: 'individual'
   │                                               - subscriptionTier: 'consumer'
   │                                               - onboarded: true
   │                                               │
   │                                               ▼
   │                                            Navigate to /dashboard
   │
   └─ Has account_type + onboarded? → Route to correct dashboard
```

---

## Permission Flow: Fleet Manager Approves Transaction

```
┌──────────────────────────────────────────────────────────────┐
│ Fleet Manager logs in                                        │
└──────────────────────────────────────────────────────────────┘
                    │
                    ▼
┌──────────────────────────────────────────────────────────────┐
│ Clerk provides JWT with claims:                              │
│   - sub: user_2abc123xyz                                     │
│   - role: fleet_manager                                      │
│   - account_type: fleet                                      │
│   - company_id: company_uuid                                 │
└──────────────────────────────────────────────────────────────┘
                    │
                    ▼
┌──────────────────────────────────────────────────────────────┐
│ Navigate to /fleet/transactions                              │
└──────────────────────────────────────────────────────────────┘
                    │
                    ▼
┌──────────────────────────────────────────────────────────────┐
│ ProtectedRoute checks:                                       │
│   ✓ User is signed in                                        │
│   ✓ User is onboarded                                        │
│   ✓ account_type === 'fleet'                                 │
└──────────────────────────────────────────────────────────────┘
                    │
                    ▼
┌──────────────────────────────────────────────────────────────┐
│ Query Supabase:                                              │
│   SELECT * FROM fuel_transactions                            │
│   WHERE approval_status = 'pending'                          │
└──────────────────────────────────────────────────────────────┘
                    │
                    ▼
┌──────────────────────────────────────────────────────────────┐
│ RLS Policy executes:                                         │
│   - Extract clerk_id from JWT                                │
│   - Look up user's company_id                                │
│   - Filter: company_id = user's company_id                   │
│   - Check: role allows 'canViewAllTransactions'              │
└──────────────────────────────────────────────────────────────┘
                    │
                    ▼
┌──────────────────────────────────────────────────────────────┐
│ Return transactions (only from manager's company)            │
└──────────────────────────────────────────────────────────────┘
                    │
                    ▼
┌──────────────────────────────────────────────────────────────┐
│ UI checks permission:                                        │
│   hasFleetPermission('fleet_manager', 'canApprovePurchase')  │
│   → true                                                     │
└──────────────────────────────────────────────────────────────┘
                    │
                    ▼
┌──────────────────────────────────────────────────────────────┐
│ Show "Approve" button for each transaction                   │
└──────────────────────────────────────────────────────────────┘
                    │
                    ▼
┌──────────────────────────────────────────────────────────────┐
│ Manager clicks "Approve"                                     │
└──────────────────────────────────────────────────────────────┘
                    │
                    ▼
┌──────────────────────────────────────────────────────────────┐
│ UPDATE fuel_transactions SET                                 │
│   approval_status = 'approved',                              │
│   approved_by = manager_user_id                              │
│ WHERE id = transaction_id                                    │
└──────────────────────────────────────────────────────────────┘
                    │
                    ▼
┌──────────────────────────────────────────────────────────────┐
│ RLS Policy on UPDATE:                                        │
│   - Verify transaction belongs to manager's company          │
│   - Verify role allows approval                              │
│   - Execute update                                           │
└──────────────────────────────────────────────────────────────┘
                    │
                    ▼
┌──────────────────────────────────────────────────────────────┐
│ ✓ Transaction approved!                                      │
│ ✓ Only company ABC's data touched                            │
│ ✓ Company XYZ's data completely isolated                     │
└──────────────────────────────────────────────────────────────┘
```

---

## Multi-Tenant Isolation Guarantee

### Scenario: Two Companies Using the Platform

```
┌───────────────────────────────────────────────────────────────┐
│ Company A: "ABC Logistics"                                   │
│ ─────────────────────────────────────────────────────────────│
│ 👤 John (Fleet Admin)                                        │
│ 👤 Sarah (Fleet Manager)                                     │
│ 👤 Mike (Driver)                                             │
│ 🚛 Vehicle: TRK-001, TRK-002, TRK-003                        │
│ 💰 Transactions: 150 this month                              │
└───────────────────────────────────────────────────────────────┘
                        ▲
                        │ RLS: company_id = 'abc-uuid'
                        │
┌───────────────────────────────────────────────────────────────┐
│                   SUPABASE DATABASE                           │
│                                                               │
│  All data tagged with company_id                             │
│  RLS enforces: WHERE company_id = current_user_company_id()  │
└───────────────────────────────────────────────────────────────┘
                        │
                        │ RLS: company_id = 'xyz-uuid'
                        ▼
┌───────────────────────────────────────────────────────────────┐
│ Company B: "XYZ Trucking"                                    │
│ ─────────────────────────────────────────────────────────────│
│ 👤 Emily (Fleet Admin)                                       │
│ 👤 Tom (Driver)                                              │
│ 🚛 Vehicle: VAN-101, VAN-102                                 │
│ 💰 Transactions: 89 this month                               │
└───────────────────────────────────────────────────────────────┘

```

**Guarantee:**
- ✅ John (ABC Logistics) **CANNOT** see XYZ Trucking's vehicles
- ✅ Emily (XYZ Trucking) **CANNOT** see ABC Logistics' transactions
- ✅ Database enforces isolation at query level (RLS)
- ✅ Even if attacker modifies frontend code, RLS blocks unauthorized access

---

## Individual User Flow (No Company)

```
┌───────────────────────────────────────────────────────────────┐
│ Alice (Individual Consumer)                                   │
│ ─────────────────────────────────────────────────────────────│
│ Account Type: individual                                     │
│ Subscription: premium                                        │
│                                                              │
│ 💳 Digital Card: CARD-ABC123                                 │
│ 🚗 Vehicle: 2020 Toyota Camry                                │
│ 💰 Transactions: Personal fuel purchases                     │
│ 🎁 Rewards: $45.23 cashback                                  │
└───────────────────────────────────────────────────────────────┘
                        ▲
                        │ RLS: user_id = 'alice-uuid'
                        │ No company_id (NULL)
                        │
┌───────────────────────────────────────────────────────────────┐
│                   SUPABASE DATABASE                           │
│                                                               │
│  Individual users: WHERE user_id = current_user_id()         │
│  Fleet users: WHERE company_id = current_company_id()        │
└───────────────────────────────────────────────────────────────┘
```

**Key Difference:**
- Individual users have `company_id = NULL`
- RLS filters by `user_id` instead of `company_id`
- Each individual sees only their own data

---

## Tech Stack Layers

```
┌─────────────────────────────────────────────────────────────┐
│ Layer 5: UI Components                                      │
│ • React Components (Fleet vs Individual dashboards)         │
│ • Tailwind CSS styling                                      │
│ • Responsive mobile/desktop                                 │
└─────────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ Layer 4: Business Logic                                     │
│ • Permission checks (hasFleetPermission)                    │
│ • Route guards (ProtectedRoute)                             │
│ • Onboarding flow                                           │
└─────────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ Layer 3: Authentication (Clerk)                             │
│ • User signup/signin                                        │
│ • JWT token generation                                      │
│ • Metadata storage (role, account_type)                     │
└─────────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ Layer 2: Authorization (Supabase RLS)                       │
│ • Row-level security policies                               │
│ • Company/user data isolation                               │
│ • Query-level permission enforcement                        │
└─────────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ Layer 1: Database (PostgreSQL)                              │
│ • Tables: users, companies, vehicles, transactions, etc.    │
│ • Indexes for performance                                   │
│ • Relationships & constraints                               │
└─────────────────────────────────────────────────────────────┘
```

---

## Security Model

```
┌─────────────────────────────────────────────────────────────┐
│ Authentication: "Who are you?"                              │
│ ────────────────────────────────────────────────────────────│
│ ✓ Clerk handles login/signup                                │
│ ✓ Issues JWT with user identity                             │
│ ✓ No passwords stored in your database                      │
└─────────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ Authorization: "What can you do?"                           │
│ ────────────────────────────────────────────────────────────│
│ ✓ Role-based permissions (frontend)                         │
│ ✓ RLS policies (database)                                   │
│ ✓ Cannot be bypassed by modifying frontend                  │
└─────────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ Data Isolation: "What can you see?"                         │
│ ────────────────────────────────────────────────────────────│
│ ✓ Fleet companies: Only their company's data                │
│ ✓ Drivers: Only assigned vehicle's data                     │
│ ✓ Individuals: Only their own data                          │
│ ✓ Platform admins: All data (for support)                   │
└─────────────────────────────────────────────────────────────┘
```

---

## Comparison: Traditional vs Multi-Tenant

### ❌ Traditional Single-Tenant Architecture
```
App Instance 1 (ABC Logistics) → Database 1
App Instance 2 (XYZ Trucking) → Database 2
App Instance 3 (Alice) → Database 3

Problems:
- Expensive (separate infrastructure per customer)
- Hard to maintain (deploy updates 3 times)
- Difficult to share data/insights
```

### ✅ Our Multi-Tenant Architecture
```
Single App Instance → Single Database (with RLS)
├─ ABC Logistics data (isolated)
├─ XYZ Trucking data (isolated)
└─ Alice's data (isolated)

Benefits:
- Cost-effective (shared infrastructure)
- Easy updates (deploy once)
- Enables cross-customer analytics (anonymized)
- Scales to 1000s of customers
```

---

This architecture gives you **enterprise-grade multi-tenancy** with complete data isolation, all while maintaining a single codebase! 🚀
