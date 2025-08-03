/**
 * Application configuration
 */

// Environment variables with defaults
export const config = {
  // API Configuration
  api: {
    baseUrl: process.env.REACT_APP_API_BASE_URL || 'http://localhost:5280',
    timeout: parseInt(process.env.REACT_APP_API_TIMEOUT) || 30000,
    retryAttempts: parseInt(process.env.REACT_APP_API_RETRY_ATTEMPTS) || 3,
  },

  // Application Settings
  app: {
    name: process.env.REACT_APP_NAME || 'Hệ thống Quản lý Thư viện',
    version: process.env.REACT_APP_VERSION || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    debugMode: process.env.REACT_APP_DEBUG === 'true',
  },

  // Feature Flags
  features: {
    enableDarkMode: process.env.REACT_APP_ENABLE_DARK_MODE !== 'false',
    enableNotifications: process.env.REACT_APP_ENABLE_NOTIFICATIONS !== 'false',
    enableAnalytics: process.env.REACT_APP_ENABLE_ANALYTICS === 'true',
    enableOfflineMode: process.env.REACT_APP_ENABLE_OFFLINE === 'true',
  },

  // UI Configuration
  ui: {
    defaultLanguage: process.env.REACT_APP_DEFAULT_LANGUAGE || 'vi',
    defaultTheme: process.env.REACT_APP_DEFAULT_THEME || 'light',
    sidebarCollapsed: process.env.REACT_APP_SIDEBAR_COLLAPSED === 'true',
    showBreadcrumbs: process.env.REACT_APP_SHOW_BREADCRUMBS !== 'false',
  },

  // Pagination
  pagination: {
    defaultPageSize: parseInt(process.env.REACT_APP_DEFAULT_PAGE_SIZE) || 10,
    pageSizeOptions: [5, 10, 20, 50, 100],
  },

  // File Upload
  upload: {
    maxFileSize: parseInt(process.env.REACT_APP_MAX_FILE_SIZE) || 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    uploadUrl: process.env.REACT_APP_UPLOAD_URL || '/api/upload',
  },

  // Cache Configuration
  cache: {
    ttl: parseInt(process.env.REACT_APP_CACHE_TTL) || 5 * 60 * 1000, // 5 minutes
    maxSize: parseInt(process.env.REACT_APP_CACHE_MAX_SIZE) || 100,
  },

  // Security
  security: {
    tokenKey: 'auth_token',
    tokenExpiry: parseInt(process.env.REACT_APP_TOKEN_EXPIRY) || 24 * 60 * 60 * 1000, // 24 hours
    refreshTokenKey: 'refresh_token',
    sessionTimeout: parseInt(process.env.REACT_APP_SESSION_TIMEOUT) || 30 * 60 * 1000, // 30 minutes
  },

  // External Services
  services: {
    googleAnalyticsId: process.env.REACT_APP_GA_ID,
    sentryDsn: process.env.REACT_APP_SENTRY_DSN,
    firebaseConfig: {
      apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
      authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
      storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.REACT_APP_FIREBASE_APP_ID,
    },
  },
};

// Validate required configuration
export const validateConfig = () => {
  const requiredFields = [
    'api.baseUrl',
    'app.name',
  ];

  const missingFields = requiredFields.filter(field => {
    const keys = field.split('.');
    let value = config;
    
    for (const key of keys) {
      value = value?.[key];
    }
    
    return !value;
  });

  if (missingFields.length > 0) {
    console.error('Missing required configuration fields:', missingFields);
    throw new Error(`Missing required configuration: ${missingFields.join(', ')}`);
  }
};

// Get configuration value by path
export const getConfig = (path, defaultValue = null) => {
  const keys = path.split('.');
  let value = config;
  
  for (const key of keys) {
    value = value?.[key];
    if (value === undefined) {
      return defaultValue;
    }
  }
  
  return value;
};

// Check if feature is enabled
export const isFeatureEnabled = (feature) => {
  return getConfig(`features.${feature}`, false);
};

export default config;