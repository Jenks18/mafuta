/**
 * User Types & Roles Configuration
 * Supports both Fleet (B2B) and Individual (B2C) customers
 */

// ==========================================
// ACCOUNT TYPES
// ==========================================

export const ACCOUNT_TYPES = {
  FLEET: 'fleet',           // Business/fleet management
  INDIVIDUAL: 'individual', // Personal consumer
};

// ==========================================
// FLEET ROLES (B2B)
// ==========================================

export const FLEET_ROLES = {
  OWNER: {
    value: 'owner',
    label: 'Fleet Owner',
    icon: '👔',
    description: 'Full control over company and billing'
  },
  MANAGER: {
    value: 'manager',
    label: 'Fleet Manager',
    icon: '📊',
    description: 'Manage vehicles, drivers, and transactions'
  },
  DRIVER: {
    value: 'driver',
    label: 'Driver',
    icon: '🚗',
    description: 'Record fuel purchases and view assigned vehicles'
  },
  ACCOUNTANT: {
    value: 'accountant',
    label: 'Accountant',
    icon: '💼',
    description: 'View financial reports and export data'
  },
  DISPATCHER: {
    value: 'dispatcher',
    label: 'Dispatcher',
    icon: '📍',
    description: 'Manage routes and track vehicle locations'
  }
};

// ==========================================
// INDIVIDUAL ROLES (B2C)
// ==========================================

export const INDIVIDUAL_ROLES = {
  CONSUMER: {
    value: 'consumer',
    label: 'Personal User',
    icon: '🚗',
    description: 'Standard account with basic features'
  },
  PREMIUM: {
    value: 'premium',
    label: 'Premium User',
    icon: '⭐',
    description: 'Advanced features and rewards'
  }
};

// ==========================================
// FLEET PERMISSIONS
// ==========================================

export const FLEET_PERMISSIONS = {
  // Vehicle management
  canAddVehicle: ['owner', 'manager'],
  canEditVehicle: ['owner', 'manager'],
  canDeleteVehicle: ['owner'],
  canViewAllVehicles: ['owner', 'manager', 'accountant', 'dispatcher'],
  canViewAssignedVehicle: ['driver'],
  
  // Driver management
  canInviteDriver: ['owner', 'manager'],
  canRemoveDriver: ['owner'],
  canViewAllDrivers: ['owner', 'manager'],
  
  // Transaction management
  canRecordFuelPurchase: ['owner', 'manager', 'driver'],
  canApprovePurchase: ['owner', 'manager'],
  canViewAllTransactions: ['owner', 'manager', 'accountant'],
  canViewOwnTransactions: ['driver'],
  
  // Company management
  canManageCompany: ['owner'],
  canInviteManagers: ['owner'],
  canSetSpendingLimits: ['owner', 'manager'],
  
  // Reports & analytics
  canViewFinancialReports: ['owner', 'manager', 'accountant'],
  canExportData: ['owner', 'accountant'],
  canViewDriverPerformance: ['owner', 'manager', 'dispatcher'],
  
  // Maintenance
  canScheduleMaintenance: ['owner', 'manager'],
  canViewMaintenance: ['owner', 'manager', 'driver'],
};

// ==========================================
// INDIVIDUAL PERMISSIONS
// ==========================================

export const INDIVIDUAL_PERMISSIONS = {
  // Transaction management
  canCreateTransaction: ['consumer', 'premium'],
  canViewOwnTransactions: ['consumer', 'premium'],
  canExportTransactions: ['premium'],
  
  // Cards
  canManageCards: ['consumer', 'premium'],
  canHaveMultipleCards: ['premium'],
  
  // Rewards
  canEarnRewards: ['consumer', 'premium'],
  canRedeemRewards: ['consumer', 'premium'],
  canViewPremiumRewards: ['premium'],
  
  // Analytics
  canViewBasicAnalytics: ['consumer', 'premium'],
  canViewAdvancedAnalytics: ['premium'],
  
  // Features
  canAccessPriceAlerts: ['premium'],
  canAccessRouteOptimization: ['premium'],
  canAccessConcierge: ['premium'],
};

// ==========================================
// PERMISSION HELPERS
// ==========================================

/**
 * Check if a fleet user has a specific permission
 */
export function hasFleetPermission(userRole, permission) {
  if (!userRole || !permission) return false;
  return FLEET_PERMISSIONS[permission]?.includes(userRole) || false;
}

/**
 * Check if an individual user has a specific permission
 */
export function hasIndividualPermission(userRole, permission) {
  if (!userRole || !permission) return false;
  return INDIVIDUAL_PERMISSIONS[permission]?.includes(userRole) || false;
}

/**
 * Check if user has permission regardless of account type
 */
export function hasPermission(accountType, userRole, permission) {
  if (accountType === ACCOUNT_TYPES.FLEET) {
    return hasFleetPermission(userRole, permission);
  } else if (accountType === ACCOUNT_TYPES.INDIVIDUAL) {
    return hasIndividualPermission(userRole, permission);
  }
  return false;
}

/**
 * Get all roles for an account type
 */
export function getRolesForAccountType(accountType) {
  if (accountType === ACCOUNT_TYPES.FLEET) {
    return Object.values(FLEET_ROLES);
  } else if (accountType === ACCOUNT_TYPES.INDIVIDUAL) {
    return Object.values(INDIVIDUAL_ROLES);
  }
  return [];
}

/**
 * Get default role for an account type
 */
export function getDefaultRole(accountType) {
  if (accountType === ACCOUNT_TYPES.FLEET) {
    return FLEET_ROLES.OWNER.value; // First user is typically the owner
  } else if (accountType === ACCOUNT_TYPES.INDIVIDUAL) {
    return INDIVIDUAL_ROLES.CONSUMER.value;
  }
  return null;
}

/**
 * Check if user is a fleet admin (can manage company)
 */
export function isFleetAdmin(accountType, userRole) {
  return accountType === ACCOUNT_TYPES.FLEET && 
         (userRole === FLEET_ROLES.OWNER.value || userRole === FLEET_ROLES.MANAGER.value);
}

/**
 * Check if user is platform admin
 */
export function isPlatformAdmin(userRole) {
  return userRole === FLEET_ROLES.OWNER.value;
}

// ==========================================
// ROUTE ACCESS
// ==========================================

export const ROUTE_ACCESS = {
  // Fleet routes
  '/fleet/dashboard': [ACCOUNT_TYPES.FLEET],
  '/fleet/vehicles': [ACCOUNT_TYPES.FLEET],
  '/fleet/drivers': [ACCOUNT_TYPES.FLEET],
  '/fleet/transactions': [ACCOUNT_TYPES.FLEET],
  '/fleet/reports': [ACCOUNT_TYPES.FLEET],
  '/fleet/settings': [ACCOUNT_TYPES.FLEET],
  
  // Individual routes
  '/dashboard': [ACCOUNT_TYPES.INDIVIDUAL],
  '/find-fuel': [ACCOUNT_TYPES.INDIVIDUAL],
  '/cards': [ACCOUNT_TYPES.INDIVIDUAL],
  '/activity': [ACCOUNT_TYPES.INDIVIDUAL],
  '/rewards': [ACCOUNT_TYPES.INDIVIDUAL],
  
  // Shared routes
  '/profile': [ACCOUNT_TYPES.FLEET, ACCOUNT_TYPES.INDIVIDUAL],
  '/support': [ACCOUNT_TYPES.FLEET, ACCOUNT_TYPES.INDIVIDUAL],
};

/**
 * Check if user can access a route
 */
export function canAccessRoute(route, accountType) {
  const allowedTypes = ROUTE_ACCESS[route];
  if (!allowedTypes) return true; // Public route
  return allowedTypes.includes(accountType);
}
