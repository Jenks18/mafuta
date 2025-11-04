# Mobile Navigation Structure

## Bottom Navigation Bar (Always Visible)
```
┌─────────────────────────────────────────────────────┐
│  [Home]  [Find Fuel]  [Trans]  [Rewards]  [More]   │
└─────────────────────────────────────────────────────┘
```

## More Page Layout
```
╔═══════════════════════════════════════════════════╗
║  👤 User Avatar              Your Name            ║
║                              email@example.com     ║
╠═══════════════════════════════════════════════════╣
║                                                   ║
║  FINANCIAL                                        ║
║  ┌──────────────┐  ┌──────────────┐             ║
║  │ 💳 Wallet    │  │ 💳 Cards     │             ║
║  │ Manage your  │  │ Manage fuel  │             ║
║  │ wallet       │  │ cards        │             ║
║  └──────────────┘  └──────────────┘             ║
║  ┌──────────────┐                                ║
║  │ 📄 Statements│                                ║
║  │ View billing │                                ║
║  └──────────────┘                                ║
║                                                   ║
║  FLEET MANAGEMENT                                 ║
║  ┌──────────────┐  ┌──────────────┐             ║
║  │ 👥 Drivers   │  │ 🚛 Vehicles  │             ║
║  │ Manage       │  │ Manage       │             ║
║  │ drivers      │  │ vehicles     │             ║
║  └──────────────┘  └──────────────┘             ║
║  ┌──────────────┐                                ║
║  │ 🗺️  Fleet Map│                                ║
║  │ Track on map │                                ║
║  └──────────────┘                                ║
║                                                   ║
║  PAYROLL                                          ║
║  ┌──────────────┐  ┌──────────────┐             ║
║  │ 💰 Overview  │  │ 📋 History   │             ║
║  │ Quick pay    │  │ View payment │             ║
║  └──────────────┘  └──────────────┘             ║
║                                                   ║
║  SETTINGS & SUPPORT                               ║
║  ┌──────────────┐  ┌──────────────┐             ║
║  │ ⚙️  Profile   │  │ 🆘 Support   │             ║
║  │ Your account │  │ Get help     │             ║
║  └──────────────┘  └──────────────┘             ║
║                                                   ║
║  ACCOUNT                                          ║
║  ┌──────────────────────────────────────┐        ║
║  │  🚪 Sign Out                         │        ║
║  └──────────────────────────────────────┘        ║
║                                                   ║
║  Mafuta Fleet Management                          ║
║  Version 1.0.0                                    ║
╚═══════════════════════════════════════════════════╝
```

## Page Navigation Flow

### From Bottom Nav
- **Home** → Dashboard Page
- **Find Fuel** → Shell Stations Map
- **Transactions** → Transaction List
- **Rewards** → Refer & Earn Page
- **More** → More Page Grid (see above)

### From More Page Grid
**Financial**
- Wallet → Wallet Page (balance, send money, transactions)
- Cards → Cards Management Page
- Statements → Billing Statements Page

**Fleet Management**
- Drivers → Drivers Management Page
- Vehicles → Vehicles Management Page
- Fleet Map → Live Vehicle Tracking Map

**Payroll**
- Payroll Overview → Quick Pay & Overview
- Payroll History → Payment History Table

**Settings & Support**
- Profile → User Profile Settings
- Support → Help & Support Center

## Color Theme by Section

| Section | Colors |
|---------|--------|
| Wallet | Emerald Gradient |
| Cards | Blue Gradient |
| Statements | Purple Gradient |
| Drivers | Indigo Gradient |
| Vehicles | Orange Gradient |
| Fleet Map | Teal Gradient |
| Payroll Overview | Green Gradient |
| Payroll History | Lime Gradient |
| Profile | Gray Gradient |
| Support | Red Gradient |

## Design Principles

1. **Mobile-First**: Optimized for touch interactions
2. **Visual Clarity**: Colorful icons for quick recognition
3. **Logical Grouping**: Related features in same section
4. **Easy Access**: Maximum 2 taps to any feature
5. **Consistent Design**: Emerald theme throughout
6. **Responsive**: Works on all mobile screen sizes
