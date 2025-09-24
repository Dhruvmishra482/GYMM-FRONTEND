 import { useState, useEffect, useMemo } from "react";
  import { useNavigate } from "react-router-dom"
  import { useAuthStore } from "../../../../Auth/Store/AuthStore";
  import { getAllMembers } from "../Service/memberService";
  import MemberList from "../Ui/MemberList";
  import SubscriptionRequired from "../../SubscriptionSystem/Logic/SubscriptionRequiredPage";
  import GymOnboardingModal from "../Ui/GymOnBoardingModal";
  import { hasFeatureAccess, subscriptionAPI } from "../../../../utils/planUtils";
  import { checkOnboardingStatusService,completeGymOnboardingService } from "../Service/onboardingService";

  const DashboardPage = () => {
    const navigate = useNavigate();
    const { 
      user, 
      logout, 
      refreshUser, 
      subscription, 
      subscriptionLoading, 
      fetchSubscriptionStatus,
      hasActiveSubscription 
    } = useAuthStore();

    // Modal and UI states
    const [selectedMember, setSelectedMember] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    // Profile dropdown state
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    // Real data states
    const [membersData, setMembersData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Search states
    const [isSearching, setIsSearching] = useState(false);

    // Onboarding states
    const [showOnboardingModal, setShowOnboardingModal] = useState(false);
    const [onboardingLoading, setOnboardingLoading] = useState(true);
    const [needsOnboarding, setNeedsOnboarding] = useState(false);

    // Debounce effect for search term
    useEffect(() => {
      const timer = setTimeout(() => {
        setDebouncedSearchTerm(searchTerm);
        setIsSearching(false);
      }, 300);

      if (searchTerm.trim() !== debouncedSearchTerm) {
        setIsSearching(true);
      }

      return () => clearTimeout(timer);
    }, [searchTerm, debouncedSearchTerm]);

    // Check onboarding status when user is available
    useEffect(() => {
      const checkOnboardingStatus = async () => {
        if (!user) return;

        try {
          setOnboardingLoading(true);
          
          // Use the onboarding service
          const result = await checkOnboardingStatusService();
          
          if (result.success) {
            setNeedsOnboarding(result.data.needsOnboarding);
            
            if (result.data.needsOnboarding) {
              setShowOnboardingModal(true);
            }
          }
        } catch (error) {
          console.error('Onboarding check failed:', error.message);
        } finally {
          setOnboardingLoading(false);
        }
      };

      checkOnboardingStatus();
    }, [user]);

    // Fetch subscription status when user is available
    useEffect(() => {
      if (user && !subscription) {
        fetchSubscriptionStatus();
      }
    }, [user, subscription, fetchSubscriptionStatus]);

    // Fetch members data only if subscription is active and onboarding is complete
    useEffect(() => {
      const fetchMembers = async () => {
        if (!hasActiveSubscription() || needsOnboarding) {
          setIsLoading(false);
          return;
        }

        try {
          setIsLoading(true);
          setError(null);
          const response = await getAllMembers();

          if (response.success) {
            setMembersData(response.data);
          } else {
            if (response.subscriptionRequired || response.needsSubscription) {
              await fetchSubscriptionStatus(true);
            } else {
              setError(response.message || "Failed to fetch members");
              if (
                response.message &&
                response.message.includes("Authentication failed")
              ) {
                navigate("/login");
              }
            }
          }
        } catch (error) {
          console.error("Error fetching members:", error);
          if (error.message && error.message.includes("subscription")) {
            await fetchSubscriptionStatus(true);
          } else {
            setError("An unexpected error occurred while fetching members");
          }
        } finally {
          setIsLoading(false);
        }
      };

      // Only fetch if we have subscription data, it's not loading, and onboarding is not needed
      if (!subscriptionLoading && subscription !== null && !needsOnboarding && !onboardingLoading) {
        fetchMembers();
      }
    }, [navigate, hasActiveSubscription, subscriptionLoading, subscription, fetchSubscriptionStatus, needsOnboarding, onboardingLoading]);

    // Track mouse movement for 3D effects
    useEffect(() => {
      const handleMouseMove = (e) => {
        setMousePosition({
          x: (e.clientX / window.innerWidth - 0.5) * 20,
          y: (e.clientY / window.innerHeight - 0.5) * 20,
        });
      };
      window.addEventListener("mousemove", handleMouseMove);
      return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    // Handle onboarding completion using the service
  // Fixed handleOnboardingComplete function in DashboardPage.js
  const handleOnboardingComplete = async (gymData) => {
    try {
      console.log('🚀 Starting onboarding completion...', gymData);
      
      const result = await completeGymOnboardingService(gymData);
      
      if (result.success) {
        console.log('✅ Onboarding API call successful:', result);
        
        // CRITICAL: Force refresh user data from database
        console.log('🔄 Refreshing user data from database...');
        await refreshUser();
        
        // Double-check that user data was updated
        const currentUser = useAuthStore.getState().user;
        console.log('🔍 User after refresh:', {
          gymName: currentUser?.gymDetails?.gymName,
          isOnboardingComplete: currentUser?.gymDetails?.isOnboardingComplete
        });
        
        // Update local state
        setNeedsOnboarding(false);
        setShowOnboardingModal(false);
        
        // Show success message
        console.log('🎉 Onboarding completed successfully!');
        
        // Optional: Force a page refresh if data still isn't updating
        // setTimeout(() => {
        //   window.location.reload();
        // }, 1000);
        
      } else {
        throw new Error(result.message || 'Failed to complete onboarding');
      }
    } catch (error) {
      console.error('❌ Error completing onboarding:', error);
      alert(error.message || 'Failed to complete setup. Please try again.');
    }
  };

    // Normalize phone numbers to remove spaces, +91, etc.
    const normalizePhone = (phone) => phone?.replace(/\D/g, "") || "";

    // Filter members based on debounced search term with useMemo
    const filteredMembers = useMemo(() => {
      if (!debouncedSearchTerm.trim()) {
        return membersData;
      }

      return membersData.filter((member) => {
        const normalizedPhone = normalizePhone(member.phoneNo || member.phone);
        const normalizedSearch = normalizePhone(debouncedSearchTerm);

        // Search by name (case-insensitive)
        const nameMatch = member.name
          ?.toLowerCase()
          .includes(debouncedSearchTerm.toLowerCase());

        // Search by phone number
        const phoneMatch = normalizedPhone.includes(normalizedSearch);

        return nameMatch || phoneMatch;
      });
    }, [debouncedSearchTerm, membersData]);

    // Handle search input change
    const handleSearchChange = (value) => {
      setSearchTerm(value);
    };

    // Calculate stats from real data
    const stats = {
      totalMembers: membersData.length,
      filteredCount: filteredMembers.length,
      dueToday: membersData.filter((member) => {
        const today = new Date().toISOString().split("T")[0];
        const dueDate = member.nextDueDate
          ? new Date(member.nextDueDate).toISOString().split("T")[0]
          : null;
        return dueDate === today;
      }).length,
      monthlyRevenue: `${membersData
        .reduce((total, member) => {
          const amount = parseFloat(
            member.feesAmount?.toString().replace(/[^\d.]/g, "") || 0
          );
          return total + amount;
        }, 0)
        .toLocaleString("en-IN")}`,
    };

    // Profile functionality
    const getOwnerDisplayName = () => {
      if (!user) return "Owner";
      return (
        `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
        user.email ||
        "Owner"
      );
    };

    const getOwnerInitials = () => {
      const name = getOwnerDisplayName();
      return name
        .split(" ")
        .map((word) => word[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    };

    const handleLogout = async () => {
      try {
        await logout();
        navigate("/login");
      } catch (error) {
        console.error("Logout failed:", error);
      }
      setIsProfileOpen(false);
    };

    const handleProfileClick = () => {
      setIsProfileOpen(false);
      console.log("My Profile clicked - Static view");
    };

    const handleMembersClick = () => {
      setIsProfileOpen(false);
      console.log("My Members clicked - Static view");
    };

    // Modified handleAddMember with subscription limit check
    const handleAddMember = async () => {
      const limitCheck = await subscriptionAPI.checkUsageLimit('members', 1);

      // If backend failed, fallback to local plan limits
      if (!limitCheck.success && subscription?.plan) {
        const planLimits = {
          NONE: 0,
          BASIC: 150,
          ADVANCED: 400,
          ENTERPRISE: Infinity
        };
        const current = membersData.length;
        const limit = planLimits[subscription.plan] || 0;

        if (current + 1 > limit) {
          alert(`Member limit reached for ${subscription.plan} plan.`);
          return;
        }

        return navigate("/add-member");
      }

      if (!limitCheck.data.canPerform) {
        alert(limitCheck.data.message);
        return;
      }

      navigate("/add-member");
    };

    // Handle subscription success (called after payment success)
    const handleSubscriptionUpdate = async () => {
      // Refresh user data and subscription status
      await refreshUser();
      // This will also refresh subscription via the refreshUser method
    };

    // Profile props to pass to MemberList
    const profileProps = {
      user,
      isProfileOpen,
      setIsProfileOpen,
      getOwnerDisplayName,
      getOwnerInitials,
      handleLogout,
      handleProfileClick,
      handleMembersClick,
      subscriptionStatus: subscription,
      handleAddMember,
    };

    // Handle loading states
    if (onboardingLoading || subscriptionLoading || (isLoading && hasActiveSubscription() && !needsOnboarding)) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
          <div className="text-xl text-white">
            {onboardingLoading ? "Checking setup status..." : 
            subscriptionLoading ? "Checking subscription..." : 
            "Loading members..."}
          </div>
        </div>
      );
    }

    // Show onboarding modal if needed
    if (showOnboardingModal && needsOnboarding) {
      return (
        <>
          <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900" />
          <GymOnboardingModal
            isOpen={showOnboardingModal}
            onComplete={handleOnboardingComplete}
            ownerName={getOwnerDisplayName()}
          />
        </>
      );
    }

    // Show subscription required page if no active subscription
    if (!hasActiveSubscription()) {
      return (
        <SubscriptionRequired 
          user={user}
          subscriptionStatus={subscription}
          onSubscriptionUpdate={handleSubscriptionUpdate}
        />
      );
    }

    // Handle error state (only for member fetching errors, not subscription)
    if (error) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
          <div className="text-xl text-center text-red-400">
            <p>Error: {error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 mt-4 text-white bg-purple-600 rounded hover:bg-purple-700"
            >
              Retry
            </button>
          </div>
        </div>
      );
    }

    // Render normal dashboard with subscription info and gym details
    return (
      <MemberList
        members={filteredMembers}
        stats={stats}
        searchTerm={searchTerm}
        setSearchTerm={handleSearchChange}
        mousePosition={mousePosition}
        selectedMember={selectedMember}
        setSelectedMember={setSelectedMember}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        profileProps={profileProps}
        isSearching={isSearching}
        subscriptionStatus={subscription}
      />
    );
  };

  export default DashboardPage;