# Architecture Decisions - Mafuta

## Current State (Dec 2, 2025)

### Account Type Routing

**Problem:** Two separate app experiences (Fleet vs Individual) without proper routing separation.

**Current Flow:**
```
Sign Up → AccountTypeSelector → Fleet Onboarding → /fleet/dashboard ✅
Sign Up → AccountTypeSelector → Individual (disabled) → ??? ❌
```

**Decision:** 
For Phase 1 launch, focus on **Fleet-only** with receipt capture. Individual accounts stay disabled.

### Receipt Capture Strategy

**Decision:** Photo-first workflow
- User pays at station (any method)
- Takes photo of receipt
- App uses Google Vision OCR to extract:
  - Amount
  - Date/time
  - Station name
  - Fuel type (if visible)
- Transaction auto-created with receipt attached

**Why:**
1. Zero payment integration complexity
2. Works with ANY payment method (cash, card, M-Pesa)
3. Builds habit loop before we own payment stack
4. Collects valuable receipt image data for future ML

**Technical Approach:**
- Store receipt images in Supabase Storage
- `transactions.receipt_url` → public URL
- `transactions.ocr_data` → JSONB with extracted fields
- `transactions.ocr_status` → pending/completed/failed
- Google Vision API for OCR (async processing)

### Data Architecture

**Primary Source of Truth:** Clerk metadata
**Backup/Analytics:** Supabase

**Why:** Clerk has better uptime, auth is critical path. Supabase failure shouldn't break auth.

## Next Steps for Production

1. ✅ Keep Fleet-only for launch
2. ⚠️ Add receipt capture to existing transaction flow
3. ⚠️ Implement Google Vision API integration
4. ⚠️ Add receipt thumbnail to transaction list
5. 🔮 Future: Enable Individual accounts when ready to support 2 UX paths
