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
  PLATFORM_ADMIN: 'platform_admin',   // Platform owner (you)
  FLEET_ADMIN: 'fleet_admin',         // Company owner
  FLEET_MANAGER: 'fleet_manager',     // Operations manager
  DRIVER: 'driver',                    // Vehicle driver
  ACCOUNTANT: 'accountant',            // Finance staff
  DISPATCHER: 'dispatcher',            // Route planner
};

// ==========================================
// INDIVIDUAL ROLES (B2C)
// ==========================================

export const INDIVIDUAL_ROLES = {
  CONSUMER: 'consumer',         // Standard user
  PREMIUM: 'premium',           // Premium subscriber
  BUSINESS: 'business',         // Small business owner (personal account)
};

// ==========================================
// FLEET PERMISSIONS
// ==========================================

export const FLEET_PERMISSIONS = {
  // Vehicle management
  canAddVehicle: ['platform_admin', 'fleet_admin', 'fleet_manager'],
  canEditVehicle: ['platform_admin', 'fleet_admin', 'fleet_manager'],
  canDeleteVehicle: ['platform_admin', 'fleet_admin'],
  canViewAllVehicles: ['platform_admin', 'fleet_admin', 'fleet_manager', 'accountant', 'dispatcher'],
  canViewAssignedVehicle: ['driver'],
  
  // Driver management
  canInviteDriver: ['platform_admin', 'fleet_admin', 'fleet_manager'],
  canRemoveDriver: ['platform_admin', 'fleet_admin'],
  canViewAllDrivers: ['platform_admin', 'fleet_admin', 'fleet_manager'],
  
  // Transaction management
  canRecordFuelPurchase: ['platform_admin', 'fleet_admin', 'fleet_manager', 'driver'],
  canApprovePurchase: ['platform_admin', 'fleet_admin', 'fleet_manager'],
  canViewAllTransactions: ['platform_admin', 'fleet_admin', 'fleet_manager', 'accountant'],
  canViewOwnTransactions: ['driver'],
  
  // Company management
  canManageCompany: ['platform_admin', 'fleet_admin'],
  canInviteManagers: ['platform_admin', 'fleet_admin'],
  canSetSpendingLimits: ['platform_admin', 'fleet_admin', 'fleet_manager'],
  
  // Reports & analytics
  canViewFinancialReports: ['platform_admin', 'fleet_admin', 'fleet_manager', 'accountant'],
  canExportData: ['platform_admin', 'fleet_admin', 'accountant'],
  canViewDriverPerformance: ['platform_admin', 'fleet_admin', 'fleet_manager', 'dispatcher'],
  
  // Maintenance
  canScheduleMaintenance: ['platform_admin', 'fleet_admin', 'fleet_manager'],
  canViewMaintenance: ['platform_admin', 'fleet_admin', 'fleet_manager', 'driver'],
};

// ==========================================
// INDIVIDUAL PERMISSIONS
// ==========================================

export const INDIVIDUAL_PERMISSIONS = {
  // Transaction management
  canCreateTransaction: ['consumer', 'premium', 'business'],
  canViewOwnTransactions: ['consumer', 'premium', 'business'],
  canExportTransactions: ['premium', 'business'],
  
  // Cards
  canManageCards: ['consumer', 'premium', 'business'],
  canHaveMultipleCards: ['premium', 'business'],
  
  // Rewards
  canEarnRewards: ['consumer', 'premium', 'business'],
  canRedeemRewards: ['consumer', 'premium', 'business'],
  canViewPremiumRewards: ['premium', 'business'],
  
  // Analytics
  canViewBasicAnalytics: ['consumer', 'premium', 'business'],
  canViewAdvancedAnalytics: ['premium', 'business'],
  
  // Features
  canAccessPriceAlerts: ['premium', 'business'],
  canAccessRouteOptimization: ['premium', 'business'],
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
    return FLEET_ROLES.DRIVER; // Most fleet users start as drivers
  } else if (accountType === ACCOUNT_TYPES.INDIVIDUAL) {
    return INDIVIDUAL_ROLES.CONSUMER;
  }
  return null;
}

/**
 * Check if user is a fleet admin (can manage company)
 */
export function isFleetAdmin(accountType, userRole) {
  return accountType === ACCOUNT_TYPES.FLEET && 
         (userRole === FLEET_ROLES.FLEET_ADMIN || userRole === FLEET_ROLES.PLATFORM_ADMIN);
}

/**
 * Check if user is platform admin
 */
export function isPlatformAdmin(userRole) {
  return userRole === FLEET_ROLES.PLATFORM_ADMIN;
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
