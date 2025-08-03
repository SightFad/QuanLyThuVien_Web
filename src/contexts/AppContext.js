/**
 * Global App Context for shared state management
 */
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useLocalStorage } from '../hooks';
import { config } from '../config';

// Initial state
const initialState = {
  // User & Auth
  user: null,
  isAuthenticated: false,
  loading: true,

  // UI State
  theme: 'light',
  language: 'vi',
  sidebarCollapsed: false,

  // App State
  notifications: [],
  errors: [],
  
  // Cache
  cache: new Map(),
};

// Action types
export const APP_ACTIONS = {
  // Auth
  SET_USER: 'SET_USER',
  SET_AUTHENTICATED: 'SET_AUTHENTICATED',
  LOGOUT: 'LOGOUT',
  SET_LOADING: 'SET_LOADING',

  // UI
  SET_THEME: 'SET_THEME',
  SET_LANGUAGE: 'SET_LANGUAGE',
  TOGGLE_SIDEBAR: 'TOGGLE_SIDEBAR',
  SET_SIDEBAR_COLLAPSED: 'SET_SIDEBAR_COLLAPSED',

  // Notifications
  ADD_NOTIFICATION: 'ADD_NOTIFICATION',
  REMOVE_NOTIFICATION: 'REMOVE_NOTIFICATION',
  CLEAR_NOTIFICATIONS: 'CLEAR_NOTIFICATIONS',

  // Errors
  ADD_ERROR: 'ADD_ERROR',
  REMOVE_ERROR: 'REMOVE_ERROR',
  CLEAR_ERRORS: 'CLEAR_ERRORS',

  // Cache
  SET_CACHE: 'SET_CACHE',
  CLEAR_CACHE: 'CLEAR_CACHE',
};

// Reducer
const appReducer = (state, action) => {
  switch (action.type) {
    case APP_ACTIONS.SET_USER:
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
      };

    case APP_ACTIONS.SET_AUTHENTICATED:
      return {
        ...state,
        isAuthenticated: action.payload,
      };

    case APP_ACTIONS.LOGOUT:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        cache: new Map(),
      };

    case APP_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      };

    case APP_ACTIONS.SET_THEME:
      return {
        ...state,
        theme: action.payload,
      };

    case APP_ACTIONS.SET_LANGUAGE:
      return {
        ...state,
        language: action.payload,
      };

    case APP_ACTIONS.TOGGLE_SIDEBAR:
      return {
        ...state,
        sidebarCollapsed: !state.sidebarCollapsed,
      };

    case APP_ACTIONS.SET_SIDEBAR_COLLAPSED:
      return {
        ...state,
        sidebarCollapsed: action.payload,
      };

    case APP_ACTIONS.ADD_NOTIFICATION:
      return {
        ...state,
        notifications: [...state.notifications, action.payload],
      };

    case APP_ACTIONS.REMOVE_NOTIFICATION:
      return {
        ...state,
        notifications: state.notifications.filter(n => n.id !== action.payload),
      };

    case APP_ACTIONS.CLEAR_NOTIFICATIONS:
      return {
        ...state,
        notifications: [],
      };

    case APP_ACTIONS.ADD_ERROR:
      return {
        ...state,
        errors: [...state.errors, action.payload],
      };

    case APP_ACTIONS.REMOVE_ERROR:
      return {
        ...state,
        errors: state.errors.filter(e => e.id !== action.payload),
      };

    case APP_ACTIONS.CLEAR_ERRORS:
      return {
        ...state,
        errors: [],
      };

    case APP_ACTIONS.SET_CACHE:
      const newCache = new Map(state.cache);
      newCache.set(action.payload.key, {
        data: action.payload.data,
        timestamp: Date.now(),
      });
      return {
        ...state,
        cache: newCache,
      };

    case APP_ACTIONS.CLEAR_CACHE:
      return {
        ...state,
        cache: new Map(),
      };

    default:
      return state;
  }
};

// Create context
const AppContext = createContext();

// Context provider
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  
  // Persist settings
  const [storedTheme, setStoredTheme] = useLocalStorage('theme', config.ui.defaultTheme);
  const [storedLanguage, setStoredLanguage] = useLocalStorage('language', config.ui.defaultLanguage);
  const [storedSidebarCollapsed, setStoredSidebarCollapsed] = useLocalStorage('sidebarCollapsed', config.ui.sidebarCollapsed);

  // Initialize from localStorage
  useEffect(() => {
    dispatch({ type: APP_ACTIONS.SET_THEME, payload: storedTheme });
    dispatch({ type: APP_ACTIONS.SET_LANGUAGE, payload: storedLanguage });
    dispatch({ type: APP_ACTIONS.SET_SIDEBAR_COLLAPSED, payload: storedSidebarCollapsed });
  }, [storedTheme, storedLanguage, storedSidebarCollapsed]);

  // Actions
  const actions = {
    // Auth actions
    setUser: (user) => {
      dispatch({ type: APP_ACTIONS.SET_USER, payload: user });
    },

    setAuthenticated: (isAuthenticated) => {
      dispatch({ type: APP_ACTIONS.SET_AUTHENTICATED, payload: isAuthenticated });
    },

    logout: () => {
      dispatch({ type: APP_ACTIONS.LOGOUT });
      localStorage.removeItem(config.security.tokenKey);
      localStorage.removeItem(config.security.refreshTokenKey);
    },

    setLoading: (loading) => {
      dispatch({ type: APP_ACTIONS.SET_LOADING, payload: loading });
    },

    // UI actions
    setTheme: (theme) => {
      dispatch({ type: APP_ACTIONS.SET_THEME, payload: theme });
      setStoredTheme(theme);
    },

    setLanguage: (language) => {
      dispatch({ type: APP_ACTIONS.SET_LANGUAGE, payload: language });
      setStoredLanguage(language);
    },

    toggleSidebar: () => {
      const newValue = !state.sidebarCollapsed;
      dispatch({ type: APP_ACTIONS.TOGGLE_SIDEBAR });
      setStoredSidebarCollapsed(newValue);
    },

    setSidebarCollapsed: (collapsed) => {
      dispatch({ type: APP_ACTIONS.SET_SIDEBAR_COLLAPSED, payload: collapsed });
      setStoredSidebarCollapsed(collapsed);
    },

    // Notification actions
    addNotification: (notification) => {
      const id = Date.now().toString();
      dispatch({
        type: APP_ACTIONS.ADD_NOTIFICATION,
        payload: {
          id,
          type: 'info',
          autoClose: true,
          duration: 5000,
          ...notification,
        },
      });

      // Auto remove if enabled
      if (notification.autoClose !== false) {
        setTimeout(() => {
          actions.removeNotification(id);
        }, notification.duration || 5000);
      }

      return id;
    },

    removeNotification: (id) => {
      dispatch({ type: APP_ACTIONS.REMOVE_NOTIFICATION, payload: id });
    },

    clearNotifications: () => {
      dispatch({ type: APP_ACTIONS.CLEAR_NOTIFICATIONS });
    },

    // Error actions
    addError: (error) => {
      const id = Date.now().toString();
      dispatch({
        type: APP_ACTIONS.ADD_ERROR,
        payload: {
          id,
          ...error,
        },
      });
      return id;
    },

    removeError: (id) => {
      dispatch({ type: APP_ACTIONS.REMOVE_ERROR, payload: id });
    },

    clearErrors: () => {
      dispatch({ type: APP_ACTIONS.CLEAR_ERRORS });
    },

    // Cache actions
    setCache: (key, data) => {
      dispatch({
        type: APP_ACTIONS.SET_CACHE,
        payload: { key, data },
      });
    },

    getCache: (key) => {
      const cached = state.cache.get(key);
      if (!cached) return null;

      // Check if cache is expired
      const now = Date.now();
      const cacheAge = now - cached.timestamp;
      if (cacheAge > config.cache.ttl) {
        state.cache.delete(key);
        return null;
      }

      return cached.data;
    },

    clearCache: () => {
      dispatch({ type: APP_ACTIONS.CLEAR_CACHE });
    },
  };

  const value = {
    ...state,
    ...actions,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use context
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

export default AppContext;