// pages/MyAnalyticsPage.jsx - Cache Bypass Version
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../../../Auth/Store/AuthStore';
import BasicAnalyticsReports from '../Ui/BasicAnalyticsReports';
import axiosInstance from '../../../../axios.config';

const MyAnalyticsPage = () => {
  const navigate = useNavigate();
  const { user, subscription, hasActiveSubscription } = useAuthStore();
  const location = useLocation();

  
  // ✅ Extract profileProps passed from DashboardPage
  const profileProps = location.state?.profileProps || null;
  

  // State management
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Fetch analytics data from backend
  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Force cache bypass with timestamp and headers
      const timestamp = Date.now();
      console.log(`🔍 Fetching analytics data from: /analytics/basic?t=${timestamp}`);
      
      const response = await axiosInstance.get(`/analytics/basic?t=${timestamp}`, {
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });

      console.log('📡 Analytics API Response:', response.data);

      if (response.data.success) {
        // Check if we're getting subscription placeholder data
        const responseData = response.data.data;
        
        if (typeof responseData.totalMembers === 'string' && 
            responseData.totalMembers.includes('Available with subscription')) {
          console.log('❌ Received subscription placeholder data');
          setError('Subscription required to access analytics data');
          setAnalyticsData(null);
          return;
        }

        // Check if we have the nested analytics structure
        if (responseData.analytics) {
          console.log('✅ Analytics data received successfully (nested structure)');
          console.log('📊 Analytics object:', responseData.analytics);
          
          setAnalyticsData({
            analytics: responseData.analytics,
            userPlan: responseData.userPlan || subscription?.plan || 'BASIC',
            lastUpdated: responseData.lastUpdated || new Date().toISOString(),
            memberCount: responseData.memberCount || responseData.analytics.totalMembers || 0
          });
        } else {
          // Handle flat structure - convert to expected format
          console.log('✅ Analytics data received (flat structure) - converting...');
          
          setAnalyticsData({
            analytics: responseData,
            userPlan: subscription?.plan || 'BASIC',
            lastUpdated: new Date().toISOString(),
            memberCount: responseData.totalMembers || 0
          });
        }
        
        setLastUpdated(new Date().toISOString());
      } else {
        console.error('❌ Analytics API returned error:', response.data.message);
        setError(response.data.message || 'Failed to fetch analytics data');
      }
    } catch (err) {
      console.error('❌ Analytics fetch error:', err);
      console.error('📍 Error details:', {
        status: err.response?.status,
        statusText: err.response?.statusText,
        data: err.response?.data,
        message: err.message
      });
      
      // Handle different error types
      if (err.response?.status === 403) {
        if (err.response.data?.subscriptionRequired) {
          setError('Active subscription required to access analytics');
        } else if (err.response.data?.limitReached) {
          setError('Analytics view limit reached. Upgrade your plan for more views.');
        } else {
          setError('Access denied. Please check your subscription status.');
        }
      } else if (err.response?.status === 401) {
        setError('Authentication required. Please log in again.');
        navigate('/login');
      } else if (err.response?.status === 404) {
        setError('Analytics endpoint not found. Please check your server configuration.');
      } else {
        setError(err.response?.data?.message || 'Network error. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Load analytics data on component mount
  useEffect(() => {
    console.log('🚀 MyAnalyticsPage mounted');
    console.log('👤 User:', user?.email);
    console.log('📋 Subscription:', subscription);
    console.log('✅ Has active subscription:', hasActiveSubscription());

    if (user && hasActiveSubscription()) {
      console.log('✅ User authenticated and subscribed, fetching analytics...');
      fetchAnalyticsData();
    } else if (user) {
      // User exists but no subscription
      console.log('❌ User has no active subscription');
      setLoading(false);
      setError('Active subscription required to access analytics');
    } else {
      console.log('❌ No user found');
      setLoading(false);
      setError('Please log in to access analytics');
    }
  }, [user, subscription]);

  // Handle refresh
  const handleRefresh = () => {
    console.log('🔄 Manual refresh triggered');
    fetchAnalyticsData();
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 border-b-2 border-blue-600 rounded-full animate-spin"></div>
          <div className="p-6 bg-white border border-blue-100 rounded-lg shadow-md">
            <h2 className="mb-2 text-lg font-semibold text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">
              FitTrack Pro Analytics
            </h2>
            <p className="text-gray-600">Loading your analytics dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state - subscription required
  if (!hasActiveSubscription() || error) {
    return (
      <div className="flex items-center justify-center min-h-screen p-6 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-md mx-auto text-center">
          <div className="p-8 bg-white border border-blue-200 rounded-lg shadow-md">
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-600">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            
            <h2 className="mb-2 text-xl font-semibold text-gray-900">Analytics Dashboard</h2>
            <p className="mb-6 text-gray-600">
              {error || "Active subscription required to access your analytics dashboard"}
            </p>
            
            {!hasActiveSubscription() && (
              <div className="mb-6">
                <h3 className="mb-3 text-sm font-semibold text-gray-800">What you'll get with analytics:</h3>
                <ul className="space-y-1 text-sm text-left text-gray-600">
                  <li>• Real-time member growth tracking</li>
                  <li>• Revenue analytics and trends</li>
                  <li>• Member retention insights</li>
                  <li>• Plan performance analysis</li>
                  <li>• Age group demographics</li>
                  <li>• Payment method preferences</li>
                </ul>
              </div>
            )}
            
            <div className="flex gap-3">
              {!hasActiveSubscription() ? (
                <button
                  onClick={() => navigate('/payment?plan=BASIC&billing=monthly')}
                  className="flex-1 px-4 py-2 font-medium text-white transition-all duration-200 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  Upgrade Now
                </button>
              ) : (
                <button
                  onClick={handleRefresh}
                  className="flex-1 px-4 py-2 font-medium text-white transition-all duration-200 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  Retry
                </button>
              )}
              
              <button
                onClick={() => navigate('/dashboard')}
                className="flex-1 px-4 py-2 font-medium text-gray-700 transition-all duration-200 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Success state - render analytics dashboard
  if (analyticsData?.analytics) {
    console.log('🎨 Rendering analytics dashboard with data:', analyticsData);
    return (
      <BasicAnalyticsReports 
        membersData={analyticsData.analytics} 
        userPlan={analyticsData.userPlan}
        onRefresh={handleRefresh}
        lastUpdated={analyticsData.lastUpdated}
        profileProps={profileProps}  // From DashboardPage structure
        user={user} 
      />
    );
  }

  // Fallback state
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="text-center">
        <h2 className="mb-2 text-xl font-semibold text-gray-900">No Analytics Data</h2>
        <p className="mb-4 text-gray-600">Unable to load analytics data</p>
        <button
          onClick={handleRefresh}
          className="px-4 py-2 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    </div>
  );
};

export default MyAnalyticsPage;