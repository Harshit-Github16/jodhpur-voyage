'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_SETTINGS } from '@/data/mockData';

const SettingsContext = createContext();

const STORAGE_KEY = 'jodhpur_voyage_settings_v1';

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(INITIAL_SETTINGS);
  const [isSavedRecently, setIsSavedRecently] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setSettings(JSON.parse(saved));
      } else {
        setSettings(INITIAL_SETTINGS);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SETTINGS));
      }
    } catch (e) {
      console.error('Failed to load settings from localStorage:', e);
      setSettings(INITIAL_SETTINGS);
    }
  }, []);

  const saveSettings = (newSettings) => {
    setSettings(newSettings);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newSettings));
      setIsSavedRecently(true);
      setTimeout(() => setIsSavedRecently(false), 3000);
    } catch (e) {
      console.error('Failed to save settings to localStorage:', e);
    }
  };

  const resetToDefaults = () => {
    setSettings(INITIAL_SETTINGS);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SETTINGS));
    } catch (e) {
      console.error('Failed to reset settings:', e);
    }
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
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
