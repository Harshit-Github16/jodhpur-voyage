'use client';

import React from 'react';
import { AuthProvider } from './AuthContext';
import { AdminProvider } from './AdminContext';
import { TourProvider } from './TourContext';
import { BookingProvider } from './BookingContext';
import { CityProvider } from './CityContext';
import { CustomerProvider } from './CustomerContext';
import { BlogProvider } from './BlogContext';
import { PostProvider } from './PostContext';
import { CommentaireProvider } from './CommentaireContext';
import { EnquiryProvider } from './EnquiryContext';
import { ReviewProvider } from './ReviewContext';
import { TeamProvider } from './TeamContext';
import { SettingsProvider } from './SettingsContext';

export function AppProviders({ children }) {
  return (
    <AuthProvider>
      <AdminProvider>
        <SettingsProvider>
          <CityProvider>
            <TourProvider>
              <BookingProvider>
                <CustomerProvider>
                  <BlogProvider>
                    <PostProvider>
                      <CommentaireProvider>
                        <EnquiryProvider>
                          <ReviewProvider>
                            <TeamProvider>
                              {children}
                            </TeamProvider>
                          </ReviewProvider>
                        </EnquiryProvider>
                      </CommentaireProvider>
                    </PostProvider>
                  </BlogProvider>
                </CustomerProvider>
              </BookingProvider>
            </TourProvider>
          </CityProvider>
        </SettingsProvider>
      </AdminProvider>
    </AuthProvider>
  );
}

export default AppProviders;
