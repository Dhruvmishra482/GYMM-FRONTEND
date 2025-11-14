// src/Advance/Features/AiDietPlan/Logic/DietPlanPage.jsx
import React, { useEffect, useState } from 'react';
import useDietPlanStore from '../Store/useDietPlanStore';
import DietPlanPageUI from '../ui/DietPlanPageUI';

const DietPlanPage = () => {
  // State from Zustand store
  const {
    dietPlans,
    loading,
    pagination,
    filters,
    fetchDietPlans,
    setFilters,
    changePage,
    deleteDietPlan,
  } = useDietPlanStore();

  // Local state for UI
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch diet plans on mount
  useEffect(() => {
    fetchDietPlans();
  }, []);

  // Handle filter change
  const handleFilterChange = (status) => {
    setFilters({ status });
    fetchDietPlans({ status, page: 1 });
  };

  // Handle search
  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  // Handle broadcast
  const handleBroadcast = (plan) => {
    setSelectedPlan(plan);
    setShowBroadcastModal(true);
  };

  // Handle edit
  const handleEdit = (plan) => {
    setSelectedPlan(plan);
    setShowEditModal(true);
  };

  // Handle preview
  const handlePreview = (plan) => {
    setSelectedPlan(plan);
    setShowPreviewModal(true);
  };

  // Handle delete
  const handleDelete = async (planId) => {
    if (window.confirm('Are you sure you want to delete this diet plan?')) {
      try {
        await deleteDietPlan(planId);
      } catch (error) {
        console.error('Delete failed:', error);
      }
    }
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    changePage(newPage);
  };

  // Handle create success
  const handleCreateSuccess = () => {
    setShowCreateModal(false);
    fetchDietPlans();
  };

  // Handle edit success
  const handleEditSuccess = () => {
    setShowEditModal(false);
    setSelectedPlan(null);
    fetchDietPlans();
  };

  // Handle broadcast success
  const handleBroadcastSuccess = () => {
    setShowBroadcastModal(false);
    setSelectedPlan(null);
    fetchDietPlans();
  };

  // Filter plans based on search
  const filteredPlans = dietPlans.filter((plan) =>
    plan.planTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    plan.planType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    plan.targetAudience.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pass all data and handlers to UI component
  return (
    <DietPlanPageUI
      // Data
      dietPlans={filteredPlans}
      loading={loading}
      pagination={pagination}
      filters={filters}
      searchTerm={searchTerm}
      selectedPlan={selectedPlan}
      
      // Modal states
      showCreateModal={showCreateModal}
      showBroadcastModal={showBroadcastModal}
      showEditModal={showEditModal}
      showPreviewModal={showPreviewModal}
      
      // Handlers
      onFilterChange={handleFilterChange}
      onSearch={handleSearch}
      onBroadcast={handleBroadcast}
      onEdit={handleEdit}
      onPreview={handlePreview}
      onDelete={handleDelete}
      onPageChange={handlePageChange}
      
      // Modal handlers
      onCreateClick={() => setShowCreateModal(true)}
      onCloseCreateModal={() => setShowCreateModal(false)}
      onCloseBroadcastModal={() => {
        setShowBroadcastModal(false);
        setSelectedPlan(null);
      }}
      onCloseEditModal={() => {
        setShowEditModal(false);
        setSelectedPlan(null);
      }}
      onClosePreviewModal={() => {
        setShowPreviewModal(false);
        setSelectedPlan(null);
      }}
      
      // Success handlers
      onCreateSuccess={handleCreateSuccess}
      onEditSuccess={handleEditSuccess}
      onBroadcastSuccess={handleBroadcastSuccess}
    />
  );
};

export default DietPlanPage;