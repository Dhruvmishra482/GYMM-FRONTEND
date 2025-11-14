// src/Advance/Features/AiWorkoutPlan/Ui/WorkoutPlanPageUI.jsx
import React from 'react';
import { Plus, Search, Loader2 } from 'lucide-react';
import WorkoutPlanCard from './WorkoutPlanCard';
import CreateWorkoutPlanModal from './CreateWorkoutPlanModal';
import BroadcastWorkoutModal from './BroadcastWorkoutModal';

const WorkoutPlanPageUI = ({
  // Data
  workoutPlans,
  loading,
  pagination,
  filters,
  searchTerm,
  selectedPlan,
  
  // Modal states
  showCreateModal,
  showBroadcastModal,
  showEditModal,
  showPreviewModal,
  
  // Handlers
  onFilterChange,
  onSearch,
  onBroadcast,
  onEdit,
  onPreview,
  onDelete,
  onPageChange,
  
  // Modal handlers
  onCreateClick,
  onCloseCreateModal,
  onCloseBroadcastModal,
  onCloseEditModal,
  onClosePreviewModal,
  
  // Success handlers
  onCreateSuccess,
  onEditSuccess,
  onBroadcastSuccess,
}) => {
  const filterOptions = ['All', 'Draft', 'Active', 'Archived'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          💪 Workout Plans
        </h1>
        <p className="text-gray-600">
          Create and manage personalized workout plans for your members
        </p>
      </div>

      {/* Action Bar */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
          {/* Search */}
          <div className="relative flex-1 w-full md:max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search workout plans..."
              value={searchTerm}
              onChange={(e) => onSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Filters */}
          <div className="flex gap-2 flex-wrap">
            {filterOptions.map((status) => (
              <button
                key={status}
                onClick={() => onFilterChange(status)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  filters.status === status
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          {/* Create Button */}
          <button
            onClick={onCreateClick}
            className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg"
          >
            <Plus className="w-5 h-5" />
            Create Plan
          </button>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      ) : workoutPlans.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <div className="text-6xl mb-4">🏋️</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            No workout plans found
          </h3>
          <p className="text-gray-600 mb-6">
            {searchTerm
              ? 'Try adjusting your search'
              : 'Create your first workout plan to get started'}
          </p>
          {!searchTerm && (
            <button
              onClick={onCreateClick}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
            >
              Create First Plan
            </button>
          )}
        </div>
      ) : (
        <>
          {/* Workout Plans Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workoutPlans.map((plan) => (
              <WorkoutPlanCard
                key={plan._id}
                plan={plan}
                onBroadcast={() => onBroadcast(plan)}
                onEdit={() => onEdit(plan)}
                onPreview={() => onPreview(plan)}
                onDelete={() => onDelete(plan._id)}
              />
            ))}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              <button
                onClick={() => onPageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="px-4 py-2 bg-white rounded-lg border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-all"
              >
                Previous
              </button>
              <span className="px-4 py-2 bg-white rounded-lg border border-gray-200 font-medium">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <button
                onClick={() => onPageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
                className="px-4 py-2 bg-white rounded-lg border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-all"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {/* Modals */}
      {showCreateModal && (
        <CreateWorkoutPlanModal
          isOpen={showCreateModal}
          onClose={onCloseCreateModal}
          onSuccess={onCreateSuccess}
        />
      )}

      {showBroadcastModal && selectedPlan && (
        <BroadcastWorkoutModal
          isOpen={showBroadcastModal}
          onClose={onCloseBroadcastModal}
          plan={selectedPlan}
          onSuccess={onBroadcastSuccess}
        />
      )}
    </div>
  );
};

export default WorkoutPlanPageUI;