import apiClient from './client';
import { API_ENDPOINTS } from './endpoints';

/**
 * Hero Slider content API.
 *
 * Drives the homepage hero slider: an ordered list of slides (each with a
 * background image, eyebrow badge, title, highlighted title fragment,
 * description and popular search tags) plus a "shared mode" that lets the admin
 * use one description + tag set across all slides, or unique ones per slide.
 *
 * The dedicated backend endpoint (/content/hero-slider) may not exist yet, so
 * every call transparently falls back to browser localStorage. Once the backend
 * route is live, it takes over automatically with no UI changes required.
 */

const STORAGE_KEY = 'jv_hero_slider';

const readLocal = () => {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
};

const writeLocal = (data) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    // ignore quota / serialization errors
  }
};

export const heroSliderApi = {
  /**
   * Get hero slider content.
   * GET /content/hero-slider  (falls back to localStorage)
   */
  getSlider: async () => {
    try {
      const res = await apiClient.get(API_ENDPOINTS.HERO_SLIDER.GET);
      const data = res?.data?.data || res?.data;
      if (data) {
        writeLocal(data);
        return { data, source: 'api' };
      }
    } catch (e) {
      // endpoint not ready or offline -> fall through to local
    }
    return { data: readLocal(), source: 'local' };
  },

  /**
   * Update hero slider content.
   * PUT /content/hero-slider  (falls back to localStorage)
   */
  updateSlider: async (slider) => {
    // Always persist locally so the admin never loses edits.
    writeLocal(slider);
    try {
      const res = await apiClient.put(API_ENDPOINTS.HERO_SLIDER.UPDATE, slider);
      const data = res?.data?.data || res?.data || slider;
      writeLocal(data);
      return { data, source: 'api' };
    } catch (e) {
      return { data: slider, source: 'local' };
    }
  },
};

export default heroSliderApi;
