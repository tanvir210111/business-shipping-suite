import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { BusinessProvider } from './context/BusinessContext';
import { DateRangeProvider } from './context/DateRangeContext';
import { ThemeProvider } from './context/ThemeContext';

import AuthLayout from './layouts/AuthLayout';
import AppLayout from './layouts/AppLayout';
import ProtectedRoute from './routes/ProtectedRoute';

import Login from './pages/auth/Login';
import Home from './pages/home/Home';

// Insights Sub-routes
import InsightsLayout from './pages/insights/InsightsLayout';
import Overview from './pages/insights/Overview';
import Plan from './pages/insights/Plan';
import Results from './pages/insights/Results';
import AudienceInsights from './pages/insights/AudienceInsights';
import MessagesInsights from './pages/insights/MessagesInsights';
import Benchmarking from './pages/insights/Benchmarking';
import ContentOverview from './pages/insights/ContentOverview';
import ContentInsights from './pages/insights/ContentInsights';
import ContentAds from './pages/insights/ContentAds';
import Earnings from './pages/insights/Earnings';
import Reach from './pages/insights/Reach';
import Engagement from './pages/insights/Engagement';
import Followers from './pages/insights/Followers';
import VideoInsights from './pages/insights/VideoInsights';

// Standalone Feature Pages
import ContentHub from './pages/content/ContentHub';
import Audience from './pages/audience/Audience';
import Messages from './pages/messages/Messages';
import Reports from './pages/reports/Reports';
import Notifications from './pages/notifications/Notifications';
import Settings from './pages/settings/Settings';
import Planner from './pages/planner/Planner';
import AdsManager from './pages/ads/AdsManager';
import Ads from './pages/ads/Ads';
import CreatorMarketing from './pages/creator/CreatorMarketing';
import AllTools from './pages/all-tools/AllTools';
import Billing from './pages/billing/Billing';
import EventsManager from './pages/events/EventsManager';
import GetStarted from './pages/onboarding/GetStarted';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BusinessProvider>
          <DateRangeProvider>
            <BrowserRouter>
              <Routes>
                {/* 1. Public Authentication Route */}
                <Route element={<AuthLayout />}>
                  <Route path="/login" element={<Login />} />
                </Route>

                {/* 2. Protected Application Routes */}
                <Route element={<ProtectedRoute />}>
                  <Route element={<AppLayout />}>
                    {/* Default redirect to /home */}
                    <Route path="/" element={<Navigate to="/home" replace />} />
                    
                    {/* Meta Business Suite Style Home Landing */}
                    <Route path="/home" element={<Home />} />
                    <Route path="/dashboard" element={<Navigate to="/home" replace />} />

                    {/* Insights Hub (Matching Meta Business Suite Reference) */}
                    <Route path="/insights" element={<InsightsLayout />}>
                      <Route index element={<Navigate to="overview" replace />} />
                      <Route path="overview" element={<Overview />} />
                      <Route path="plan" element={<Plan />} />
                      <Route path="results" element={<Results />} />
                      <Route path="audience" element={<AudienceInsights />} />
                      <Route path="messages" element={<MessagesInsights />} />
                      <Route path="benchmarking" element={<Benchmarking />} />
                      <Route path="content-overview" element={<ContentOverview />} />
                      <Route path="content" element={<ContentInsights />} />
                      <Route path="content-ads" element={<ContentAds />} />
                      <Route path="earnings" element={<Earnings />} />
                      <Route path="reach" element={<Reach />} />
                      <Route path="engagement" element={<Engagement />} />
                      <Route path="followers" element={<Followers />} />
                      <Route path="video" element={<VideoInsights />} />
                    </Route>

                    {/* Core Sidebar Routes */}
                    <Route path="/planner" element={<Planner />} />
                    <Route path="/ads" element={<Ads />} />
                    <Route path="/ads-manager" element={<AdsManager />} />
                    <Route path="/creator-marketing" element={<CreatorMarketing />} />
                    <Route path="/all-tools" element={<AllTools />} />
                    <Route path="/billing" element={<Billing />} />
                    <Route path="/events-manager" element={<EventsManager />} />

                    {/* Content Hub Routes */}
                    <Route path="/content" element={<ContentHub defaultType="all" />} />
                    <Route path="/content/posts" element={<ContentHub defaultType="post" />} />
                    <Route path="/content/reels" element={<ContentHub defaultType="reel" />} />
                    <Route path="/content/stories" element={<ContentHub defaultType="story" />} />
                    <Route path="/content/videos" element={<ContentHub defaultType="video" />} />

                    {/* Standalone Nav Sections */}
                    <Route path="/audience" element={<Audience />} />
                    <Route path="/audiences" element={<Navigate to="/audience" replace />} />
                    <Route path="/messages" element={<Messages />} />
                    <Route path="/inbox" element={<Navigate to="/messages" replace />} />
                    <Route path="/reports" element={<Reports />} />
                    <Route path="/notifications" element={<Notifications />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/get-started" element={<GetStarted />} />
                    <Route path="/billing-and-payments" element={<Navigate to="/billing" replace />} />

                    {/* 404 Catch-All */}
                    <Route path="*" element={<NotFound />} />
                  </Route>
                </Route>
              </Routes>
            </BrowserRouter>
          </DateRangeProvider>
        </BusinessProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
