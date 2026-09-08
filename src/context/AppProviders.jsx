'use client';

import React from 'react';
import { AuthProvider } from './AuthContext';
import { AdminProvider } from './AdminContext';
import { TourProvider } from './TourContext';
import { BookingProvider } from './BookingContext';
import { CityProvider } from './CityContext';
import { CustomerProvider } from './CustomerContext';
import { BlogProvider } from './BlogContext';

export function AppProviders({ children }) {
  return (
    <AuthProvider>
      <AdminProvider>
        <CityProvider>
          <TourProvider>
            <BookingProvider>
              <CustomerProvider>
                <BlogProvider>
                  {children}
                </BlogProvider>
              </CustomerProvider>
            </BookingProvider>
          </TourProvider>
        </CityProvider>
      </AdminProvider>
    </AuthProvider>
  );
}

export default AppProviders;
