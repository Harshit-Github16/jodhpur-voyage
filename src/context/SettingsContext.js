'use client';

import React, { createContext, useContext, useState } from 'react';

const DEFAULT_SETTINGS = {
  siteName: 'Jodhpur Voyage',
  siteTagline: 'Luxury Heritage Travel & Royal Experiences in Blue City',
  supportEmail: 'concierge@jodhpurvoyage.com',
  supportPhone: '+91 291 254 8900',
  address: 'Haveli Tower, Clock Tower Road, Old City, Jodhpur, Rajasthan 342001',
  currency: 'INR',
  currencySymbol: '₹',
  maintenanceMode: false,
};

const SettingsContext = createContext();

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('jv_settings');
        if (saved) return JSON.parse(saved);
      } catch (e) {
        // ignore
      }
    }
    return DEFAULT_SETTINGS;
  });
  const [isSavedRecently, setIsSavedRecently] = useState(false);
  const [loading] = useState(false);

  const saveSettings = async (newSettings) => {
    try {
      setSettings(newSettings);
      if (typeof window !== 'undefined') {
        localStorage.setItem('jv_settings', JSON.stringify(newSettings));
      }
      setIsSavedRecently(true);
      setTimeout(() => setIsSavedRecently(false), 3000);
    } catch (e) {
      console.error('Failed to save settings:', e);
    }
  };

  const resetToDefaults = async () => {
    setSettings(DEFAULT_SETTINGS);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('jv_settings');
    }
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
        loading,
        isSavedRecently,
        saveSettings,
        resetToDefaults,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export const useSettings = () => useContext(SettingsContext);
export default SettingsContext;
