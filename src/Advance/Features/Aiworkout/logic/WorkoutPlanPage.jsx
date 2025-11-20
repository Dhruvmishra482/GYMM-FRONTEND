// src/Advance/Features/AiWorkoutPlan/Logic/WorkoutPlanPage.jsx
import React, { useEffect, useState } from 'react';
import useWorkoutPlanStore from '../store/useWorkoutPlanStore';
import WorkoutPlanPageUI from '../ui/WorkoutPlanPageUI';

const WorkoutPlanPage = () => {
  // State from Zustand store
  const {
    workoutPlans,
    loading,
    pagination,
    filters,
    fetchWorkoutPlans,
    setFilters,
    changePage,
    deleteWorkoutPlan,
  } = useWorkoutPlanStore();

  // Local state for UI
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch workout plans on mount
  useEffect(() => {
    fetchWorkoutPlans();
  }, []);

  // Handle filter change
  const handleFilterChange = (status) => {
    setFilters({ status });
    fetchWorkoutPlans({ status, page: 1 });
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
    if (window.confirm('Are you sure you want to delete this workout plan?')) {
      try {
        await deleteWorkoutPlan(planId);
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
    fetchWorkoutPlans();
  };

  // Handle edit success
  const handleEditSuccess = () => {
    setShowEditModal(false);
    setSelectedPlan(null);
    fetchWorkoutPlans();
  };

  // Handle broadcast success
  const handleBroadcastSuccess = () => {
    setShowBroadcastModal(false);
    setSelectedPlan(null);
    fetchWorkoutPlans();
  };

  // Filter plans based on search
  const filteredPlans = workoutPlans.filter((plan) =>
    plan.planTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    plan.planType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    plan.difficultyLevel.toLowerCase().includes(searchTerm.toLowerCase()) ||
    plan.targetAudience.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pass all data and handlers to UI component
  return (
    <WorkoutPlanPageUI
      // Data
      workoutPlans={filteredPlans}
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

export default WorkoutPlanPage;