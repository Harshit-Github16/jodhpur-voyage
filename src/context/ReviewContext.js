'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_REVIEWS } from '@/data/mockData';

const ReviewContext = createContext();

const STORAGE_KEY = 'jodhpur_voyage_reviews_v1';

export function ReviewProvider({ children }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setReviews(JSON.parse(saved));
      } else {
        setReviews(INITIAL_REVIEWS);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_REVIEWS));
      }
    } catch (e) {
      console.error('Failed to load reviews from localStorage:', e);
      setReviews(INITIAL_REVIEWS);
    } finally {
      setLoading(false);
    }
  }, []);

  const saveToStorage = (updated) => {
    setReviews(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save reviews to localStorage:', e);
    }
  };

  const addReview = (reviewData) => {
    const newRev = {
      ...reviewData,
      id: `rev-${Date.now().toString().slice(-4)}`,
      rating: Number(reviewData.rating) || 5,
      status: reviewData.status || 'Approved',
      featured: Boolean(reviewData.featured),
      createdAt: new Date().toISOString(),
    };
    const updated = [newRev, ...reviews];
    saveToStorage(updated);
    return newRev;
  };

  const updateReview = (id, patchData) => {
    const updated = reviews.map((item) =>
      item.id === id ? { ...item, ...patchData } : item
    );
    saveToStorage(updated);
  };

  const approveReview = (id) => {
    updateReview(id, { status: 'Approved' });
  };

  const rejectReview = (id) => {
    updateReview(id, { status: 'Rejected' });
  };

  const toggleFeatured = (id) => {
    const rev = reviews.find((r) => r.id === id);
    if (rev) {
      updateReview(id, { featured: !rev.featured });
    }
  };

  const deleteReview = (id) => {
    const updated = reviews.filter((item) => item.id !== id);
    saveToStorage(updated);
  };

  const pendingCount = reviews.filter((r) => r.status === 'Pending').length;
  const approvedCount = reviews.filter((r) => r.status === 'Approved').length;

  return (
    <ReviewContext.Provider
      value={{
        reviews,
        loading,
        pendingCount,
        approvedCount,
        addReview,
        updateReview,
        approveReview,
        rejectReview,
        toggleFeatured,
        deleteReview,
      }}
    >
      {children}
    </ReviewContext.Provider>
  );
}

export const useReviews = () => useContext(ReviewContext);
export default ReviewContext;
