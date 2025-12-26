# Receipt App Design System
**Mobile-First Expense & Receipt Tracking**

## 🎨 Brand Identity

### App Concept
Modern, clean receipt and expense tracking app focused on:
- Quick receipt capture with OCR
- Simple expense categorization
- Beautiful, intuitive mobile interface
- Trust and financial clarity

### Design Principles
1. **Speed First** - Capture receipt in <5 seconds
2. **Visual Clarity** - Numbers and data stand out
3. **Mobile Native** - Thumb-friendly, gesture-driven
4. **Trustworthy** - Professional financial app aesthetic
5. **Delightful** - Smooth animations, satisfying interactions

---

## 🎨 Color System

### Primary Palette (Financial Trust)
```css
--primary-50:  #f0f9ff;   /* Light blue tint backgrounds */
--primary-100: #e0f2fe;   /* Subtle highlights */
--primary-200: #bae6fd;   /* Disabled states */
--primary-300: #7dd3fc;   /* Hover states */
--primary-400: #38bdf8;   /* Active elements */
--primary-500: #0ea5e9;   /* Primary brand - Main CTA */
--primary-600: #0284c7;   /* Primary hover */
--primary-700: #0369a1;   /* Primary pressed */
--primary-800: #075985;   /* Dark mode primary */
--primary-900: #0c4a6e;   /* Deep accents */
```

**Usage:**
- Primary buttons, links, active states
- Key metrics, important numbers
- Navigation highlights

### Success (Approved/Income)
```css
--success-50:  #f0fdf4;
--success-500: #10b981;   /* Income, approved expenses */
--success-600: #059669;   /* Success hover */
--success-700: #047857;   /* Success pressed */
```

### Warning (Pending/Review)
```css
--warning-50:  #fffbeb;
--warning-500: #f59e0b;   /* Pending approval, low confidence OCR */
--warning-600: #d97706;   /* Warning hover */
```

### Danger (Rejected/Error)
```css
--danger-50:  #fef2f2;
--danger-500: #ef4444;    /* Rejected, errors, overspending */
--danger-600: #dc2626;    /* Danger hover */
```

### Neutral (UI Structure)
```css
--gray-50:  #f9fafb;     /* App background */
--gray-100: #f3f4f6;     /* Card backgrounds */
--gray-200: #e5e7eb;     /* Borders, dividers */
--gray-300: #d1d5db;     /* Placeholder text */
--gray-400: #9ca3af;     /* Disabled text */
--gray-500: #6b7280;     /* Secondary text */
--gray-600: #4b5563;     /* Body text */
--gray-700: #374151;     /* Headings */
--gray-800: #1f2937;     /* Primary text */
--gray-900: #111827;     /* High emphasis */
```

### Accent Colors (Categories)
```css
--purple-500: #a855f7;   /* Travel */
--pink-500:   #ec4899;   /* Entertainment */
--orange-500: #f97316;   /* Food & Dining */
--teal-500:   #14b8a6;   /* Transport */
--indigo-500: #6366f1;   /* Office */
--lime-500:   #84cc16;   /* Health */
```

---

## 📝 Typography

### Font Stack
```css
/* Primary - Clean & Modern */
font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 
             'Segoe UI', 'Roboto', 'Helvetica Neue', sans-serif;

/* Monospace - Numbers & Currency */
font-family-mono: 'SF Mono', 'Monaco', 'Consolas', 
                  'Liberation Mono', monospace;
```

### Type Scale (Mobile-First)

```css
/* Display - Hero numbers, totals */
.text-display {
  font-size: 2.5rem;      /* 40px */
  line-height: 1.1;
  font-weight: 700;
  letter-spacing: -0.02em;
}

/* Heading 1 - Screen titles */
.text-h1 {
  font-size: 1.75rem;     /* 28px */
  line-height: 1.2;
  font-weight: 700;
}

/* Heading 2 - Section titles */
.text-h2 {
  font-size: 1.5rem;      /* 24px */
  line-height: 1.3;
  font-weight: 600;
}

/* Heading 3 - Card titles */
.text-h3 {
  font-size: 1.25rem;     /* 20px */
  line-height: 1.4;
  font-weight: 600;
}

/* Body Large - Primary content */
.text-body-lg {
  font-size: 1.125rem;    /* 18px */
  line-height: 1.6;
  font-weight: 400;
}

/* Body - Default text */
.text-body {
  font-size: 1rem;        /* 16px */
  line-height: 1.5;
  font-weight: 400;
}

/* Body Small - Secondary info */
.text-body-sm {
  font-size: 0.875rem;    /* 14px */
  line-height: 1.4;
  font-weight: 400;
}

/* Caption - Metadata, timestamps */
.text-caption {
  font-size: 0.75rem;     /* 12px */
  line-height: 1.3;
  font-weight: 500;
  letter-spacing: 0.02em;
  text-transform: uppercase;
}

/* Currency - Amounts */
.text-currency {
  font-family: var(--font-mono);
  font-size: 1.5rem;      /* 24px */
  line-height: 1.2;
  font-weight: 600;
  letter-spacing: -0.01em;
}
```

---

## 📐 Spacing System

Based on 4px grid for consistency:

```css
--space-1:  0.25rem;  /* 4px  - Tight spacing */
--space-2:  0.5rem;   /* 8px  - Element padding */
--space-3:  0.75rem;  /* 12px - Compact spacing */
--space-4:  1rem;     /* 16px - Default spacing */
--space-5:  1.25rem;  /* 20px - Section padding */
--space-6:  1.5rem;   /* 24px - Card padding */
--space-8:  2rem;     /* 32px - Large gaps */
--space-10: 2.5rem;   /* 40px - Screen padding */
--space-12: 3rem;     /* 48px - Section separation */
--space-16: 4rem;     /* 64px - Hero spacing */
```

**Common Patterns:**
- Mobile screen padding: `px-4` (16px)
- Card padding: `p-6` (24px)
- Between cards: `gap-4` (16px)
- Button padding: `px-6 py-3` (24px × 12px)

---

## 🎯 Components

### 1. Buttons

```jsx
/* Primary Action Button */
<button className="
  w-full px-6 py-4 
  bg-primary-500 hover:bg-primary-600 active:bg-primary-700
  text-white font-semibold text-lg
  rounded-xl
  shadow-lg shadow-primary-500/20
  transition-all duration-200
  active:scale-[0.98]
">
  Scan Receipt
</button>

/* Secondary Button */
<button className="
  px-6 py-3
  bg-gray-100 hover:bg-gray-200
  text-gray-700 font-medium
  rounded-lg
  transition-colors duration-200
">
  View All
</button>

/* Icon Button */
<button className="
  w-12 h-12
  flex items-center justify-center
  bg-white hover:bg-gray-50
  text-gray-600
  rounded-full
  shadow-md
  transition-all duration-200
  active:scale-95
">
  <Icon size={24} />
</button>

/* Danger Button */
<button className="
  px-5 py-2.5
  bg-danger-500 hover:bg-danger-600
  text-white font-medium text-sm
  rounded-lg
  transition-colors duration-200
">
  Delete
</button>
```

### 2. Cards

```jsx
/* Expense Card */
<div className="
  bg-white rounded-2xl p-5
  shadow-sm border border-gray-100
  transition-all duration-200
  active:scale-[0.98]
">
  <div className="flex items-start justify-between">
    <div className="flex gap-3">
      {/* Category Icon */}
      <div className="
        w-12 h-12 rounded-xl
        bg-orange-50 flex items-center justify-center
      ">
        <Icon className="text-orange-500" size={24} />
      </div>
      
      {/* Details */}
      <div>
        <h3 className="font-semibold text-gray-900">
          Starbucks Coffee
        </h3>
        <p className="text-sm text-gray-500 mt-0.5">
          Food & Dining • Today
        </p>
      </div>
    </div>
    
    {/* Amount */}
    <span className="font-mono font-semibold text-lg text-gray-900">
      $12.50
    </span>
  </div>
  
  {/* Receipt Thumbnail (if exists) */}
  {hasReceipt && (
    <div className="mt-3 pt-3 border-t border-gray-100">
      <img 
        src={receiptUrl} 
        className="w-full h-32 object-cover rounded-lg"
        alt="Receipt"
      />
    </div>
  )}
</div>

/* Stat Card */
<div className="
  bg-gradient-to-br from-primary-500 to-primary-600
  rounded-2xl p-6
  text-white
  shadow-lg
">
  <p className="text-sm opacity-90 font-medium">
    This Month
  </p>
  <p className="text-4xl font-bold mt-2 font-mono">
    $2,847.60
  </p>
  <div className="flex items-center gap-2 mt-3">
    <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
      +12% from last month
    </span>
  </div>
</div>
```

### 3. Lists

```jsx
/* Transaction List */
<div className="space-y-3">
  {transactions.map(tx => (
    <div 
      key={tx.id}
      className="
        flex items-center justify-between p-4
        bg-white rounded-xl
        border border-gray-100
        active:bg-gray-50
      "
    >
      <div className="flex items-center gap-3">
        {/* Icon */}
        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
          <Icon size={20} className="text-gray-600" />
        </div>
        
        {/* Info */}
        <div>
          <p className="font-medium text-gray-900">{tx.merchant}</p>
          <p className="text-sm text-gray-500">{tx.category}</p>
        </div>
      </div>
      
      {/* Amount */}
      <div className="text-right">
        <p className="font-mono font-semibold text-gray-900">
          ${tx.amount}
        </p>
        <p className="text-xs text-gray-500">{tx.date}</p>
      </div>
    </div>
  ))}
</div>
```

### 4. Bottom Navigation

```jsx
<nav className="
  fixed bottom-0 left-0 right-0
  bg-white border-t border-gray-200
  px-6 py-3
  safe-area-inset-bottom
">
  <div className="flex items-center justify-around">
    {navItems.map(item => (
      <button
        key={item.id}
        className={`
          flex flex-col items-center gap-1 px-4 py-2
          transition-colors duration-200
          ${item.active ? 'text-primary-500' : 'text-gray-400'}
        `}
      >
        <Icon size={24} />
        <span className="text-xs font-medium">{item.label}</span>
      </button>
    ))}
  </div>
</nav>
```

### 5. Receipt Capture Button (FAB)

```jsx
<button className="
  fixed bottom-24 right-6
  w-16 h-16
  bg-primary-500 hover:bg-primary-600
  text-white
  rounded-full
  shadow-2xl shadow-primary-500/40
  flex items-center justify-center
  transition-all duration-300
  active:scale-90
  z-50
">
  <CameraIcon size={28} />
</button>
```

### 6. Category Pills

```jsx
<div className="flex gap-2 flex-wrap">
  {categories.map(cat => (
    <span
      key={cat.id}
      className={`
        px-3 py-1.5
        rounded-full
        text-xs font-medium
        ${cat.selected 
          ? 'bg-primary-500 text-white' 
          : 'bg-gray-100 text-gray-600'
        }
      `}
    >
      {cat.name}
    </span>
  ))}
</div>
```

### 7. Status Badges

```jsx
/* OCR Confidence Badge */
<span className={`
  inline-flex items-center gap-1
  px-2 py-1 rounded-md
  text-xs font-medium
  ${confidence >= 80 
    ? 'bg-success-50 text-success-700' 
    : confidence >= 60
    ? 'bg-warning-50 text-warning-700'
    : 'bg-danger-50 text-danger-700'
  }
`}>
  <span className="w-1.5 h-1.5 rounded-full bg-current" />
  {confidence}% Confidence
</span>

/* Approval Status */
<span className="
  px-2.5 py-1 rounded-full
  text-xs font-semibold
  bg-success-100 text-success-700
">
  Approved
</span>
```

---

## 🎬 Animations

### Transitions
```css
/* Default transition */
.transition-base {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Smooth entrance */
.fade-in {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Button press */
.active\:scale-\[0\.98\]:active {
  transform: scale(0.98);
}

/* Loading shimmer */
.skeleton {
  background: linear-gradient(
    90deg, 
    #f3f4f6 0%, 
    #e5e7eb 50%, 
    #f3f4f6 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
```

### Gestures
- **Swipe**: Cards swipe left to delete
- **Pull to refresh**: Drag down list to reload
- **Long press**: Hold card to see quick actions
- **Pinch zoom**: Receipt image viewer

---

## 📱 Mobile Layout Patterns

### Screen Structure
```
┌─────────────────────────┐
│   Header (56px)         │  Sticky
│   [Title]  [Actions]    │
├─────────────────────────┤
│                         │
│   Content Area          │  Scrollable
│   (Padding: 16px)       │
│                         │
│   - Stats Cards         │
│   - Transaction List    │
│   - Empty States        │
│                         │
│                         │
├─────────────────────────┤
│   Bottom Nav (72px)     │  Fixed
│   [Home][Scan][Profile] │
└─────────────────────────┘
```

### Safe Area Insets
```css
/* Top safe area (notch) */
.safe-area-top {
  padding-top: env(safe-area-inset-top);
}

/* Bottom safe area (gesture bar) */
.safe-area-bottom {
  padding-bottom: env(safe-area-inset-bottom);
}
```

### Thumb Zones (Mobile Ergonomics)
```
┌─────────────────────────┐
│   🔴 Hard to reach      │  < Avoid primary actions
│                         │
│   🟡 Comfortable        │  < Secondary actions OK
│                         │
│   🟢 Easy to reach      │  < Primary actions here
│   [Main CTA Button]     │
│   [Bottom Navigation]   │
└─────────────────────────┘
```

---

## 🎨 Implementation Guide

### Tailwind Config

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
        },
        success: {
          50: '#f0fdf4',
          500: '#10b981',
        },
        // ... rest of colors
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['SF Mono', 'Monaco', 'monospace'],
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgb(0 0 0 / 0.05)',
        'float': '0 10px 25px -5px rgb(0 0 0 / 0.1)',
      },
    },
  },
}
```

### CSS Variables

```css
:root {
  /* Colors */
  --color-primary: 14 165 233;    /* RGB for opacity variants */
  --color-success: 16 185 129;
  --color-warning: 245 158 11;
  --color-danger: 239 68 68;
  
  /* Spacing */
  --screen-padding: 1rem;         /* 16px */
  --card-padding: 1.5rem;         /* 24px */
  
  /* Shadows */
  --shadow-card: 0 1px 3px rgba(0, 0, 0, 0.05);
  --shadow-float: 0 10px 25px rgba(0, 0, 0, 0.1);
  
  /* Transitions */
  --transition-fast: 150ms ease;
  --transition-base: 200ms ease;
  --transition-slow: 300ms ease;
}
```

### Component Library Structure

```
src/
  components/
    ui/
      Button.jsx          - All button variants
      Card.jsx            - Card component
      Badge.jsx           - Status badges
      CategoryPill.jsx    - Category chips
      FAB.jsx             - Floating action button
    
    expense/
      ExpenseCard.jsx     - Transaction card
      ExpenseList.jsx     - List with filters
      ExpenseStats.jsx    - Summary cards
    
    receipt/
      ReceiptCapture.jsx  - Camera/upload modal
      ReceiptViewer.jsx   - Full-screen image view
      OCRReview.jsx       - Edit extracted data
    
    navigation/
      BottomNav.jsx       - Main navigation
      Header.jsx          - Screen headers
```

---

## 🎯 Key Screens

### 1. Home / Dashboard
```
┌─────────────────────────┐
│ Good morning, Ian 👋    │
├─────────────────────────┤
│ ┌─────────────────────┐ │
│ │  This Month         │ │  Stats Card
│ │  $2,847.60          │ │
│ │  +12% from last mo. │ │
│ └─────────────────────┘ │
│                         │
│ Recent Expenses         │  Section
│ ┌─────────────────────┐ │
│ │🍔 Lunch - $18.50    │ │  Expense Card
│ └─────────────────────┘ │
│ ┌─────────────────────┐ │
│ │☕ Coffee - $5.00    │ │
│ └─────────────────────┘ │
│                         │
│            [+]          │  FAB
└─────────────────────────┘
```

### 2. Receipt Scan
```
┌─────────────────────────┐
│        Camera View      │
│                         │
│    ┌───────────────┐    │  Viewfinder
│    │               │    │
│    │   Position    │    │
│    │   Receipt     │    │
│    │               │    │
│    └───────────────┘    │
│                         │
│  [ Gallery ] [Capture]  │
└─────────────────────────┘
```

### 3. OCR Review
```
┌─────────────────────────┐
│ ← Review Receipt        │
├─────────────────────────┤
│ ┌─────────────────────┐ │
│ │   Receipt Image     │ │  Thumbnail
│ └─────────────────────┘ │
│                         │
│ Confidence: 92% ✓       │  Badge
│                         │
│ Amount:  $18.50         │  Editable
│ Date:    Dec 26, 2025   │  Fields
│ Merchant: Starbucks     │
│ Category: Food & Dining │
│                         │
│ [ Reject ] [ Confirm ]  │
└─────────────────────────┘
```

### 4. Expense Details
```
┌─────────────────────────┐
│ ← Expense Details  [⋮]  │
├─────────────────────────┤
│                         │
│       $18.50            │  Large amount
│                         │
│ Starbucks Coffee        │  Merchant
│ Food & Dining           │  Category
│ Dec 26, 2025 • 2:30 PM  │  Timestamp
│                         │
│ ┌─────────────────────┐ │
│ │                     │ │  Receipt
│ │   Receipt Image     │ │  (Zoomable)
│ │                     │ │
│ └─────────────────────┘ │
│                         │
│ [ Edit ]  [ Delete ]    │
└─────────────────────────┘
```

---

## 🎨 Dark Mode (Optional)

```css
/* Dark mode colors */
@media (prefers-color-scheme: dark) {
  :root {
    --bg-primary: #111827;
    --bg-secondary: #1f2937;
    --bg-tertiary: #374151;
    
    --text-primary: #f9fafb;
    --text-secondary: #d1d5db;
    --text-tertiary: #9ca3af;
    
    --border: #374151;
    
    /* Adjust primary for dark bg */
    --primary-500: #38bdf8;
  }
}
```

---

## ✨ Micro-interactions

### Success Feedback
```jsx
// After successful OCR
<div className="animate-bounce-in">
  <CheckCircle className="text-success-500" size={64} />
  <p>Receipt Captured!</p>
</div>
```

### Loading States
```jsx
// Scanning receipt
<div className="space-y-3">
  <div className="w-full h-4 bg-gray-200 rounded animate-pulse" />
  <div className="w-3/4 h-4 bg-gray-200 rounded animate-pulse" />
</div>
```

### Empty States
```jsx
<div className="text-center py-12">
  <ReceiptIcon className="text-gray-300 mx-auto" size={64} />
  <p className="text-gray-500 mt-4">No receipts yet</p>
  <p className="text-sm text-gray-400 mt-1">
    Tap the + button to add your first receipt
  </p>
</div>
```

---

## 📐 Responsive Breakpoints (Future Web)

```css
/* Mobile first approach */
sm:  640px   /* Large phones */
md:  768px   /* Tablets */
lg:  1024px  /* Desktop */
xl:  1280px  /* Large desktop */
```

For now, optimize for: **375px - 428px** (iPhone SE to iPhone 14 Pro Max)

---

## 🎯 Accessibility

```jsx
/* Touch targets minimum 44x44px */
<button className="min-w-[44px] min-h-[44px]">

/* Color contrast WCAG AA */
text-gray-600 on white ✓
text-white on primary-500 ✓

/* Screen reader labels */
<button aria-label="Scan receipt">
  <CameraIcon />
</button>

/* Focus indicators */
<input className="
  focus:ring-2 focus:ring-primary-500 focus:border-primary-500
">
```

---

## 🚀 Implementation Checklist

- [ ] Install color palette in tailwind.config.js
- [ ] Create base UI components (Button, Card, Badge)
- [ ] Build bottom navigation
- [ ] Implement receipt capture flow
- [ ] Add animations and transitions
- [ ] Test on real devices (iPhone, Android)
- [ ] Optimize for one-handed use
- [ ] Add haptic feedback (Capacitor)
- [ ] Implement gesture controls
- [ ] Polish micro-interactions

---

**Design Goals:**
- ⚡ **Fast**: Receipt captured in <5 seconds
- 👍 **Thumb-friendly**: All primary actions within reach
- 🎨 **Beautiful**: Delightful animations, clean aesthetics
- 💡 **Clear**: Financial data is immediately scannable
- 📱 **Native feel**: Smooth as a native app

**Inspiration:**
- Expensify (expense flow)
- Notion (clean cards)
- Stripe (professional financial UI)
- Instagram (smooth interactions)
