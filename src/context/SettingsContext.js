'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { settingsApi } from '@/services/api/settingsApi';

const SettingsContext = createContext();

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState({
    siteName: 'Jodhpur Voyage',
    siteTagline: 'Luxury Heritage Travel & Royal Experiences in Blue City',
    supportEmail: 'concierge@jodhpurvoyage.com',
    supportPhone: '+91 291 254 8900',
    address: 'Haveli Tower, Clock Tower Road, Old City, Jodhpur, Rajasthan 342001',
    currency: 'INR',
    currencySymbol: '₹',
    maintenanceMode: false,
  });
  const [isSavedRecently, setIsSavedRecently] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchSettings = useCallback(async () => {
    setLoading(true);
    try {
      const res = await settingsApi.getSettings();
      if (res?.data) {
        setSettings(res.data.data || res.data);
      }
    } catch (e) {
      console.warn('Failed to load settings from API:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const saveSettings = async (newSettings) => {
    try {
      const res = await settingsApi.updateSettings(newSettings);
      if (res?.data) {
        setSettings(res.data.data || res.data);
      } else {
        setSettings(newSettings);
      }
      setIsSavedRecently(true);
      setTimeout(() => setIsSavedRecently(false), 3000);
    } catch (e) {
      console.error('Failed to save settings:', e);
      throw e;
    }
  };

  const resetToDefaults = async () => {
    await fetchSettings();
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
        loading,
        isSavedRecently,
        fetchSettings,
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
