// Site configuration for under construction mode
export const SITE_CONFIG = {
  isUnderConstruction: true,
  maintenanceMode: false,
  allowBrowsing: true,
  allowOrders: false,
  allowRegistration: false,
  allowSelling: false,
  underConstructionMessage: "This site is currently under construction and not accepting orders yet. Please check back soon!",
  expectedLaunchDate: "2025-Q1",
} as const;

export function isOrderingDisabled(): boolean {
  return SITE_CONFIG.isUnderConstruction || SITE_CONFIG.maintenanceMode || !SITE_CONFIG.allowOrders;
}

export function isRegistrationDisabled(): boolean {
  return SITE_CONFIG.isUnderConstruction || SITE_CONFIG.maintenanceMode || !SITE_CONFIG.allowRegistration;
}

export function isSellingDisabled(): boolean {
  return SITE_CONFIG.isUnderConstruction || SITE_CONFIG.maintenanceMode || !SITE_CONFIG.allowSelling;
}

export function getUnderConstructionMessage(): string {
  return SITE_CONFIG.underConstructionMessage;
}