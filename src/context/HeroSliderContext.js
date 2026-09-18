'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { heroSliderApi } from '@/services/api/heroSliderApi';
import { useAdmin } from './AdminContext';
import { useAuth } from './AuthContext';

const HeroSliderContext = createContext(null);

const genId = () => `slide-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

/**
 * Default hero slider content, modelled on the live homepage slides.
 *
 * `sharedMode` controls whether the description + popular tags are the same for
 * every slide (`true`, driven by `shared`) or unique per slide (`false`, each
 * slide's own `description` / `tags`). The title/eyebrow/image are always
 * per-slide. The search bar is rendered by the website itself.
 */
export const DEFAULT_SLIDER = {
  // When true, every slide uses `shared.description` and `shared.tags`.
  sharedMode: true,
  shared: {
    description:
      'Sp\u00e9cialiste des voyages authentiques et sur mesure au Rajasthan, en Inde du Nord, Inde du Sud et au N\u00e9pal. D\u00e9couvrez la beaut\u00e9 s\u00e9culaire de la cit\u00e9 dor\u00e9e.',
    tags: ['Rajasthan', 'Taj Mahal', 'N\u00e9pal', 'Sur Mesure'],
  },
  slides: [
    {
      id: 'slide-tigers',
      eyebrow: 'TOUR OP\u00c9RATEUR SP\u00c9CIALIS\u00c9',
      title: 'Jodhpur Voyage',
      titleHighlight: 'Inde & N\u00e9pal',
      image: '',
      description:
        'Sp\u00e9cialiste des voyages authentiques et sur mesure au Rajasthan, en Inde du Nord, Inde du Sud et au N\u00e9pal.',
      tags: ['Rajasthan', 'Taj Mahal', 'N\u00e9pal', 'Sur Mesure'],
      status: 'Active',
      order: 1,
    },
    {
      id: 'slide-fort',
      eyebrow: 'MERVEILLES D\u2019INDE',
      title: 'Voyages \u00c9motion &',
      titleHighlight: 'Patrimoine',
      image: '',
      description:
        'Explorez les palais des Maharajas, le mythique Taj Mahal et les lieux d\u2019exception avec un chauffeur priv\u00e9 et des guides francophones passionn\u00e9s.',
      tags: ['Rajasthan', 'Taj Mahal', 'N\u00e9pal', 'Sur Mesure'],
      status: 'Active',
      order: 2,
    },
    {
      id: 'slide-nepal',
      eyebrow: 'AVENTURE & SPIRITUALIT\u00c9',
      title: 'Des Sommets',
      titleHighlight: 'du N\u00e9pal',
      image: '',
      description:
        'Des vall\u00e9es sacr\u00e9es de Katmandou aux sommets mythiques de l\u2019Himalaya, vivez une immersion culturelle et humaine inoubliable.',
      tags: ['Rajasthan', 'Taj Mahal', 'N\u00e9pal', 'Sur Mesure'],
      status: 'Active',
      order: 3,
    },
  ],
};

export function HeroSliderProvider({ children }) {
  const { isAuthenticated } = useAuth() || {};
  const [slider, setSlider] = useState(DEFAULT_SLIDER);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [source, setSource] = useState('default'); // 'api' | 'local' | 'default'

  let adminContext;
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    adminContext = useAdmin();
  } catch (e) {
    adminContext = null;
  }

  const mergeWithDefaults = (loaded) => {
    if (!loaded) return DEFAULT_SLIDER;
    const slides = Array.isArray(loaded.slides) ? loaded.slides : DEFAULT_SLIDER.slides;
    return {
      sharedMode: typeof loaded.sharedMode === 'boolean' ? loaded.sharedMode : DEFAULT_SLIDER.sharedMode,
      shared: { ...DEFAULT_SLIDER.shared, ...(loaded.shared || {}) },
      slides: slides.map((s, i) => ({
        id: s.id || s._id || genId(),
        eyebrow: s.eyebrow || '',
        title: s.title || '',
        titleHighlight: s.titleHighlight || '',
        image: s.image || '',
        description: s.description || '',
        tags: Array.isArray(s.tags) ? s.tags : [],
        status: s.status || 'Active',
        order: s.order ?? i + 1,
      })),
    };
  };

  const fetchSlider = useCallback(async () => {
    setLoading(true);
    try {
      const res = await heroSliderApi.getSlider();
      if (res?.data) {
        setSlider(mergeWithDefaults(res.data));
        setSource(res.source || 'local');
      } else {
        setSlider(DEFAULT_SLIDER);
        setSource('default');
      }
    } catch (e) {
      setSlider(DEFAULT_SLIDER);
      setSource('default');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchSlider();
    }
  }, [isAuthenticated, fetchSlider]);

  const saveSlider = useCallback(
    async (nextSlider) => {
      setSaving(true);
      try {
        const res = await heroSliderApi.updateSlider(nextSlider);
        setSlider(mergeWithDefaults(res?.data || nextSlider));
        setSource(res?.source || 'local');
        adminContext?.addToast(
          res?.source === 'api'
            ? 'Hero slider saved successfully!'
            : 'Hero slider saved locally (backend endpoint not connected yet).',
          res?.source === 'api' ? 'success' : 'info'
        );
        return { success: true, source: res?.source };
      } catch (err) {
        adminContext?.addToast(err?.message || 'Failed to save hero slider', 'error');
        return { success: false, message: err?.message };
      } finally {
        setSaving(false);
      }
    },
    [adminContext]
  );

  return (
    <HeroSliderContext.Provider
      value={{
        slider,
        setSlider,
        loading,
        saving,
        source,
        fetchSlider,
        saveSlider,
        genId,
      }}
    >
      {children}
    </HeroSliderContext.Provider>
  );
}

export function useHeroSlider() {
  const context = useContext(HeroSliderContext);
  if (!context) {
    throw new Error('useHeroSlider must be used within a HeroSliderProvider');
  }
  return context;
}

export default HeroSliderContext;
