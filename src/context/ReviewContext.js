'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { reviewsApi } from '@/services/api/reviewsApi';
import { useAuth } from './AuthContext';

const ReviewContext = createContext();

export function ReviewProvider({ children }) {
  const { isAuthenticated } = useAuth() || {};
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);

  const normalizeReview = (r) => {
    const customerName =
      r.customerName ||
      r.authorName ||
      r.userName ||
      (typeof r.user === 'object' && r.user !== null ? r.user.name : '') ||
      r.name ||
      'Anonymous Guest';
    const customerLocation =
      r.customerLocation ||
      r.authorLocation ||
      r.location ||
      (typeof r.user === 'object' && r.user !== null ? r.user.location : '') ||
      'Verified Guest';
    const customerAvatar =
      r.customerAvatar ||
      r.authorAvatar ||
      r.avatar ||
      (typeof r.user === 'object' && r.user !== null ? r.user.avatar : '') ||
      '';
    const packageTitle =
      r.packageTitle ||
      r.tourTitle ||
      (typeof r.tourId === 'object' && r.tourId !== null ? r.tourId.title : '') ||
      (typeof r.tour === 'object' && r.tour !== null ? r.tour.title : '') ||
      r.tourName ||
      'Heritage Tour';

    return {
      ...r,
      id: r.id || r._id,
      customerName,
      customerLocation,
      customerAvatar,
      packageTitle,
    };
  };

  const fetchReviews = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      const res = await reviewsApi.getReviews();
      if (res?.data) {
        const rawList = Array.isArray(res.data) ? res.data : (res.data.data || res.data.reviews || []);
        setReviews(rawList.map(normalizeReview));
      } else {
        setReviews([]);
      }
    } catch (e) {
      console.warn('Failed to load reviews from API:', e);
      setReviews([]);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchReviews();
    }
  }, [isAuthenticated, fetchReviews]);

  const addReview = async (reviewData) => {
    try {
      const payload = {
        ...reviewData,
        authorName: reviewData.customerName || reviewData.authorName,
        authorLocation: reviewData.customerLocation || reviewData.authorLocation,
        authorAvatar: reviewData.customerAvatar || reviewData.authorAvatar,
      };
      const res = await reviewsApi.createReview(payload);
      if (res?.data) {
        const created = normalizeReview(res.data.data || res.data);
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
        prev.map((item) =>
          item.id === id || item._id === id ? { ...item, ...patchData } : item
        )
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
    const rev = reviews.find((r) => r.id === id || r._id === id);
    if (rev) {
      updateReview(id, { featured: !rev.featured });
    }
  };

  const deleteReview = async (id) => {
    try {
      await reviewsApi.deleteReview(id);
      setReviews((prev) => prev.filter((item) => item.id !== id && item._id !== id));
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
