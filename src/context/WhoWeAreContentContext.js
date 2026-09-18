'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { whoWeAreContentApi } from '@/services/api/whoWeAreContentApi';
import { useAdmin } from './AdminContext';
import { useAuth } from './AuthContext';

const WhoWeAreContentContext = createContext(null);

/**
 * Default content mirrors the public website screenshots so the admin has
 * meaningful starting values before anything is saved.
 */
export const DEFAULT_CONTENT = {
  // Company overview — the top "what is the company / what we do" block
  overview: {
    eyebrow: 'ABOUT JODHPUR VOYAGE',
    title: 'Who We Are & What We Do',
    body: '<p><strong>Jodhpur Voyage</strong> is a local, French-speaking travel agency based in Rajasthan, India, crafting tailor-made journeys across India and Nepal for over 20 years.</p><p>We design personalized itineraries, provide certified local guides, and take care of every detail so you can travel with complete peace of mind.</p>',
    image: '',
  },

  // Landing hub (the 5-card strip)
  landing: {
    heading: 'CREATOR OF THE MOST BEAUTIFUL JOURNEYS FOR 20+ YEARS',
    cards: [
      { id: 'card-who', title: 'Who are we', image: '', link: '/who-we-are' },
      { id: 'card-value', title: 'Our added value', image: '', link: '/who-we-are#added-value' },
      { id: 'card-commitment', title: 'Our responsible commitment', image: '', link: '/who-we-are#commitment' },
      { id: 'card-team', title: 'Our Team', image: '', link: '/who-we-are/team' },
      { id: 'card-reviews', title: 'Reviews & Testimonials', image: '', link: '/commentaires' },
    ],
  },

  // "Who Are We" page (identity + founder + commitment pillars)
  whoAreWe: {
    hero: {
      eyebrow: 'OUR HISTORY & OUR COMMITMENTS',
      title: 'Who are we ?',
      subtitle:
        'A local, French-speaking travel agency in India and Nepal. Discover the passionate team and the story behind Jodhpur Voyage.',
      backgroundImage: '',
    },
    identity: {
      eyebrow: 'OUR IDENTITY',
      title: 'A Passionate, French-Speaking Local Agency',
      body: '<p><strong>Jodhpur Voyage</strong> is a local travel agency based in Rajasthan, India. Experts in tourism with in-depth knowledge of the country, we want to help you discover India and Nepal.</p><p>We offer travel packages, but we are also available to create personalized itineraries. Our agency specializes in <strong>tailor-made travel</strong> and has been organizing trips for over 20 years.</p>',
      image: '',
    },
    founder: {
      eyebrow: 'A WORD FROM THE FOUNDER',
      title: 'Our Philosophy',
      name: 'Mr Singh',
      role: 'Founder & Main Contact Person',
      photo: '',
      quote:
        'Passionate about my country and its culture, I obtained my Master\u2019s degree in Tourism from the University of Jodhpur and started out as a French-speaking guide for travel agencies in Delhi.',
      body: '<p>The project was born from a desire to open ourselves to the world and share the culture and landscapes of India.</p>',
    },
    pillars: {
      eyebrow: 'WHY CHOOSE US',
      title: 'The Pillars of Our Commitment',
      subtitle: 'Exceptional service for a worry-free journey.',
      items: [
        { id: 'pillar-1', title: 'Direct & Without Intermediaries', text: 'We offer direct, negotiated prices without intermediaries, guaranteeing you the best value for money.' },
        { id: 'pillar-2', title: 'Charming Accommodations & Havelis', text: 'We recommend the havelis, traditional mansions restored into charming hotels to preserve the authentic soul of yesteryear.' },
        { id: 'pillar-3', title: 'Private Transportation & Drivers', text: 'Modern vehicles and experienced drivers to ensure your peace of mind and safety during your journeys.' },
        { id: 'pillar-4', title: 'Certified French-Speaking Guides', text: 'Official French-speaking guides who provide cultural explanations and protect you from commercial abuses on the sites.' },
        { id: 'pillar-5', title: '100% Customizable Circuits', text: 'Every traveler is unique. We adjust the pace, duration and stages according to your specific desires.' },
        { id: 'pillar-6', title: '24/7 Assistance & Support', text: 'A responsive local team is available at any time on-site in India to respond to your request.' },
      ],
    },
  },

  // "Our Team" page header (the experts themselves come from the /team API)
  teamPage: {
    hero: {
      eyebrow: 'LOCAL FRENCH-SPEAKING EXPERTS',
      title: 'The Jodhpur Travel Team:',
      subtitle: 'A passionate team living and working in India to offer you personalized advice, French-speaking support and exceptional tailor-made tours.',
      backgroundImage: '',
    },
    intro: {
      eyebrow: 'JODHPUR TRAVEL WHVING LIFE LTD',
      title: 'The Jodhpur Travel Team \u2013 Our local team',
      body: '<p>We are proud to have more than 6 travel experts living and working directly in India, close to the destinations we offer. Our experts are an integral part of our on-the-ground teams.</p>',
      highlights: [
        { id: 'hl-1', title: '+6 Experts on site', text: 'Living & working in India' },
        { id: 'hl-2', title: 'Certified Guides', text: 'Approved by the Ministry of Tourism' },
        { id: 'hl-3', title: 'Customized Service', text: 'Advice & "Personal Touch"' },
      ],
    },
  },
};

export function WhoWeAreContentProvider({ children }) {
  const { isAuthenticated } = useAuth() || {};
  const [content, setContent] = useState(DEFAULT_CONTENT);
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

  // Deep-merge loaded content over defaults so new fields always exist.
  const mergeWithDefaults = (loaded) => {
    if (!loaded) return DEFAULT_CONTENT;
    return {
      overview: { ...DEFAULT_CONTENT.overview, ...(loaded.overview || {}) },
      landing: { ...DEFAULT_CONTENT.landing, ...(loaded.landing || {}) },
      whoAreWe: {
        hero: { ...DEFAULT_CONTENT.whoAreWe.hero, ...(loaded.whoAreWe?.hero || {}) },
        identity: { ...DEFAULT_CONTENT.whoAreWe.identity, ...(loaded.whoAreWe?.identity || {}) },
        founder: { ...DEFAULT_CONTENT.whoAreWe.founder, ...(loaded.whoAreWe?.founder || {}) },
        pillars: { ...DEFAULT_CONTENT.whoAreWe.pillars, ...(loaded.whoAreWe?.pillars || {}) },
      },
      teamPage: {
        hero: { ...DEFAULT_CONTENT.teamPage.hero, ...(loaded.teamPage?.hero || {}) },
        intro: { ...DEFAULT_CONTENT.teamPage.intro, ...(loaded.teamPage?.intro || {}) },
      },
    };
  };

  const fetchContent = useCallback(async () => {
    setLoading(true);
    try {
      const res = await whoWeAreContentApi.getContent();
      if (res?.data) {
        setContent(mergeWithDefaults(res.data));
        setSource(res.source || 'local');
      } else {
        setContent(DEFAULT_CONTENT);
        setSource('default');
      }
    } catch (e) {
      setContent(DEFAULT_CONTENT);
      setSource('default');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchContent();
    }
  }, [isAuthenticated, fetchContent]);

  const saveContent = useCallback(
    async (nextContent) => {
      setSaving(true);
      try {
        const res = await whoWeAreContentApi.updateContent(nextContent);
        setContent(mergeWithDefaults(res?.data || nextContent));
        setSource(res?.source || 'local');
        adminContext?.addToast(
          res?.source === 'api' ? 'Content saved successfully!' : 'Content saved locally (backend endpoint not connected yet).',
          res?.source === 'api' ? 'success' : 'info'
        );
        return { success: true, source: res?.source };
      } catch (err) {
        adminContext?.addToast(err?.message || 'Failed to save content', 'error');
        return { success: false, message: err?.message };
      } finally {
        setSaving(false);
      }
    },
    [adminContext]
  );

  return (
    <WhoWeAreContentContext.Provider
      value={{
        content,
        setContent,
        loading,
        saving,
        source,
        fetchContent,
        saveContent,
      }}
    >
      {children}
    </WhoWeAreContentContext.Provider>
  );
}

export function useWhoWeAreContent() {
  const context = useContext(WhoWeAreContentContext);
  if (!context) {
    throw new Error('useWhoWeAreContent must be used within a WhoWeAreContentProvider');
  }
  return context;
}

export default WhoWeAreContentContext;
