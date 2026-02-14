// src/Advance/Features/AiDietPlan/Ui/DietPlanPageUI.jsx
import React from 'react';
import { Plus, Search, Loader2 } from 'lucide-react';
import DietPlanCard from './DietPlanCard';
import CreateDietPlanModal from './CreateDietPlanModal';
import BroadcastModal from './BroadcastModal';
import EditDietPlanModal from './EditDietPlanModal'; // Import the Edit modal
import PreviewDietPlanModal from './PreviewDietPlanModal'; // Import the Preview modal

const DietPlanPageUI = ({
  // Data
  dietPlans,
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
    <div className="relative min-h-screen bg-gradient-to-br from-green-900 via-teal-800 to-lime-900 text-white p-6 overflow-hidden">
      {/* Animated Background Element (Subtle 3D feel, diet-themed) */}
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="absolute top-0 left-0 w-64 h-64 bg-lime-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-emerald-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-6000"></div>
      </div>
      
      {/* Header */}
      <div className="relative z-10 mb-8 text-center">
        <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-lime-400 mb-4 animate-fade-in-down">
          🥗 AI Diet Plans
        </h1>
        <p className="text-teal-200 text-lg max-w-2xl mx-auto animate-fade-in">
          Nourish your body with expertly crafted and personalized diet programs.
        </p>
      </div>

      {/* Action Bar */}
      <div className="relative z-10 bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-xl p-4 md:p-6 mb-8 border border-emerald-700/50 transform transition-all duration-300 hover:scale-[1.005] hover:shadow-2xl">
        <div className="flex flex-col md:flex-row gap-4 md:gap-6 justify-between items-center">
          {/* Search */}
          <div className="relative flex-1 w-full md:max-w-xs lg:max-w-md group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-300 group-hover:text-emerald-100 transition-colors w-5 h-5" />
            <input
              type="text"
              placeholder="Search diet plans..."
              value={searchTerm}
              onChange={(e) => onSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-700/50 border border-emerald-600 rounded-xl text-white placeholder-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 shadow-inner hover:border-emerald-400"
            />
          </div>

          {/* Filters */}
          <div className="flex gap-2 md:gap-3 flex-wrap">
            {filterOptions.map((status) => (
              <button
                key={status}
                onClick={() => onFilterChange(status)}
                className={`px-5 py-2.5 rounded-full font-medium transition-all duration-300 text-sm md:text-base transform hover:-translate-y-1 hover:shadow-lg ${
                  filters.status === status
                    ? 'bg-gradient-to-r from-emerald-500 to-lime-600 text-white shadow-emerald-500/30 border border-emerald-400'
                    : 'bg-gray-700 text-teal-200 hover:bg-gray-600 hover:text-white border border-gray-600'
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          {/* Create Button */}
          <button
            onClick={onCreateClick}
            className="flex items-center gap-2 px-7 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 transform active:scale-95 border border-blue-400"
          >
            <Plus className="w-5 h-5" />
            Create Plan
          </button>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="relative z-10 flex flex-col justify-center items-center py-20 bg-gray-800/70 backdrop-blur-lg rounded-2xl shadow-xl border border-emerald-700/50">
          <Loader2 className="w-12 h-12 animate-spin text-emerald-400 mb-4" />
          <p className="text-xl font-semibold text-teal-200">Loading Diet Plans...</p>
        </div>
      ) : dietPlans.length === 0 ? (
        <div className="relative z-10 bg-gray-800/70 backdrop-blur-lg rounded-2xl shadow-xl p-12 text-center border border-emerald-700/50">
          <div className="text-6xl mb-6 animate-bounce-slow">🍽️</div>
          <h3 className="text-3xl font-bold text-emerald-100 mb-4">
            No diet plans found
          </h3>
          <p className="text-teal-300 text-lg mb-8">
            {searchTerm
              ? 'Refine your search or try a different filter.'
              : 'It looks like you haven\'t created any diet plans yet!'}
          </p>
          {!searchTerm && (
            <button
              onClick={onCreateClick}
              className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-lime-600 text-white rounded-xl hover:from-emerald-600 hover:to-lime-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 transform active:scale-95 border border-emerald-400"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create First Plan
            </button>
          )}
        </div>
      ) : (
        <>
          {/* Diet Plans Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dietPlans.map((plan) => (
              <DietPlanCard
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
        <CreateDietPlanModal
          isOpen={showCreateModal}
          onClose={onCloseCreateModal}
          onSuccess={onCreateSuccess}
        />
      )}

      {showBroadcastModal && selectedPlan && (
        <BroadcastModal
          isOpen={showBroadcastModal}
          onClose={onCloseBroadcastModal}
          plan={selectedPlan}
          onSuccess={onBroadcastSuccess}
        />
      )}

      {/* Render Edit Diet Plan Modal */}
      {showEditModal && selectedPlan && (
        <EditDietPlanModal
          isOpen={showEditModal}
          onClose={onCloseEditModal}
          plan={selectedPlan}
          onSuccess={onEditSuccess}
        />
      )}

      {/* Render Preview Diet Plan Modal */}
      {showPreviewModal && selectedPlan && (
        <PreviewDietPlanModal
          isOpen={showPreviewModal}
          onClose={onClosePreviewModal}
          plan={selectedPlan}
        />
      )}
    </div>
  );
};

export default DietPlanPageUI;