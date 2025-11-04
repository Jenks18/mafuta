# Quick Migration Guide

You need to apply 3 SQL files in this order:

## Step 1: Base Schema
File: `APPLY_1_BASE_SCHEMA.sql`
- Creates all base tables (users, companies, vehicles, etc.)
- **Status**: ✅ Applied

## Step 2: Fuel Cards Table
File: `supabase/migrations/011_fuel_cards.sql`
- Creates fuel_cards table for fleet card management
- **Action**: Copy and run in Supabase SQL Editor

## Step 3: Wallet Transactions
File: `APPLY_WALLET_MIGRATION.sql`
- Creates wallet_transactions table
- **Action**: Copy and run in Supabase SQL Editor

---

### Quick Apply (Step 2 - Fuel Cards):
1. Open: https://supabase.com/dashboard/project/mdezrwxafjgptjzxdmbc/sql/new
2. Copy all SQL from `supabase/migrations/011_fuel_cards.sql`
3. Paste and click RUN

### Quick Apply (Step 3 - Wallet):
1. Open: https://supabase.com/dashboard/project/mdezrwxafjgptjzxdmbc/sql/new
2. Copy all SQL from `APPLY_WALLET_MIGRATION.sql`
3. Paste and click RUN

---

After applying both migrations, your app will have:
✅ Fuel cards management
✅ Wallet transactions
✅ Full CRUD operations
