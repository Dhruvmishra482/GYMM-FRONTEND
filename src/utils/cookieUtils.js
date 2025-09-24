// Utility functions for handling cookies
export const cookieUtils = {
  // Get cookie value by name
  get: (name) => {
    if (typeof document === 'undefined') return null; // SSR safety
    
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return decodeURIComponent(parts.pop().split(';').shift());
    }
    return null;
  },

  // Set cookie with options
  set: (name, value, options = {}) => {
    if (typeof document === 'undefined') return; // SSR safety
    
    const {
      days = 7,
      path = '/',
      domain = '',
      secure = window.location.protocol === 'https:',
      sameSite = 'Lax'
    } = options;

    let cookieString = `${name}=${encodeURIComponent(value)};path=${path};SameSite=${sameSite}`;
    
    if (days) {
      const expires = new Date();
      expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
      cookieString += `;expires=${expires.toUTCString()}`;
    }
    
    if (domain) {
      cookieString += `;domain=${domain}`;
    }
    
    if (secure) {
      cookieString += ';secure';
    }
    
    document.cookie = cookieString;
  },

  // Remove cookie
  remove: (name, path = '/') => {
    if (typeof document === 'undefined') return; // SSR safety
    
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=${path};SameSite=Lax`;
  },

  // Check if cookie exists
  exists: (name) => {
    return cookieUtils.get(name) !== null;
  },

  // Get parsed JSON from cookie
  getJSON: (name) => {
    const value = cookieUtils.get(name);
    if (!value) return null;
    
    try {
      return JSON.parse(value);
    } catch (error) {
      console.warn(`Failed to parse JSON from cookie ${name}:`, error);
      return null;
    }
  },

  // Set JSON data to cookie
  setJSON: (name, data, options = {}) => {
    try {
      const jsonString = JSON.stringify(data);
      cookieUtils.set(name, jsonString, options);
      return true;
    } catch (error) {
      console.warn(`Failed to stringify JSON for cookie ${name}:`, error);
      return false;
    }
  }
};