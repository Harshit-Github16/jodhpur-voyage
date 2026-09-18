'use client';

import React from 'react';
import { AuthProvider } from './AuthContext';
import { AdminProvider } from './AdminContext';
import { TourProvider } from './TourContext';
import { BookingProvider } from './BookingContext';
import { CityProvider } from './CityContext';
import { BlogProvider } from './BlogContext';
import { PostProvider } from './PostContext';
import { CommentaireProvider } from './CommentaireContext';
import { EnquiryProvider } from './EnquiryContext';
import { WhoWeAreProvider } from './WhoWeAreContext';
import { WhoWeAreContentProvider } from './WhoWeAreContentContext';
import { HeroSliderProvider } from './HeroSliderContext';
import { SettingsProvider } from './SettingsContext';

export function AppProviders({ children }) {
  return (
    <AuthProvider>
      <AdminProvider>
        <SettingsProvider>
          <CityProvider>
            <TourProvider>
              <BookingProvider>
                <BlogProvider>
                  <PostProvider>
                    <CommentaireProvider>
                      <EnquiryProvider>
                        <WhoWeAreProvider>
                          <WhoWeAreContentProvider>
                            <HeroSliderProvider>
                              {children}
                            </HeroSliderProvider>
                          </WhoWeAreContentProvider>
                        </WhoWeAreProvider>
                      </EnquiryProvider>
                    </CommentaireProvider>
                  </PostProvider>
                </BlogProvider>
              </BookingProvider>
            </TourProvider>
          </CityProvider>
        </SettingsProvider>
      </AdminProvider>
    </AuthProvider>
  );
}

export default AppProviders;
