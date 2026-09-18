import apiClient from './client';
import { API_ENDPOINTS } from './endpoints';

/**
 * "Who We Are" page content API.
 *
 * This drives the CMS-style content for the public "Who We Are" area:
 *  - the landing hub (heading + 5 image cards)
 *  - the "Who Are We" page (identity rich text + image, founder block, commitment pillars)
 *  - the "Our Team" page header (hero heading/subtitle + intro block)
 *
 * The dedicated backend endpoint (/content/who-we-are) may not exist yet, so
 * every call transparently falls back to browser localStorage. Once the backend
 * route is live, it takes over automatically with no UI changes required.
 */

const STORAGE_KEY = 'jv_who_we_are_content';

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

export const whoWeAreContentApi = {
  /**
   * Get "Who We Are" page content.
   * GET /content/who-we-are  (falls back to localStorage)
   */
  getContent: async () => {
    try {
      const res = await apiClient.get(API_ENDPOINTS.WHO_WE_ARE_CONTENT.GET);
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
   * Update "Who We Are" page content.
   * PUT /content/who-we-are  (falls back to localStorage)
   */
  updateContent: async (content) => {
    // Always persist locally so the admin never loses edits.
    writeLocal(content);
    try {
      const res = await apiClient.put(API_ENDPOINTS.WHO_WE_ARE_CONTENT.UPDATE, content);
      const data = res?.data?.data || res?.data || content;
      writeLocal(data);
      return { data, source: 'api' };
    } catch (e) {
      return { data: content, source: 'local' };
    }
  },
};

export default whoWeAreContentApi;
