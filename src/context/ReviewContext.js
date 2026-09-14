'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { reviewsApi } from '@/services/api/reviewsApi';

const ReviewContext = createContext();

export function ReviewProvider({ children }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    try {
      const res = await reviewsApi.getReviews();
      if (res?.data) {
        setReviews(Array.isArray(res.data) ? res.data : res.data.data || []);
      } else {
        setReviews([]);
      }
    } catch (e) {
      console.warn('Failed to load reviews from API:', e);
      setReviews([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const addReview = async (reviewData) => {
    try {
      const res = await reviewsApi.createReview(reviewData);
      if (res?.data) {
        const created = res.data.data || res.data;
        setReviews((prev) => [created, ...prev]);
        return created;
      }
    } catch (err) {
      console.error('Failed to create review via API:', err);
      throw err;
    }
  };

  const updateReview = async (id, patchData) => {
    try {
      await reviewsApi.updateReviewStatus(id, patchData);
      setReviews((prev) =>
        prev.map((item) => (item.id === id ? { ...item, ...patchData } : item))
      );
    } catch (err) {
      console.error('Failed to update review status via API:', err);
      throw err;
    }
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

  const deleteReview = async (id) => {
    try {
      await reviewsApi.deleteReview(id);
      setReviews((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error('Failed to delete review via API:', err);
      throw err;
    }
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
        fetchReviews,
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
