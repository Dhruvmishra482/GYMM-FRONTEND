import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, Loader2, ArrowLeft } from "lucide-react";
import WorkoutPlanCard from "./WorkoutPlanCard";
import CreateWorkoutPlanModal from "./CreateWorkoutPlanModal";
import BroadcastWorkoutModal from "./BroadcastWorkoutModal";
import EditWorkoutPlanModal from "./EditWorkoutPlanModal";
import PreviewWorkoutPlanModal from "./PreviewWorkoutPlanModal";

const WorkoutPlanPageUI = ({
  workoutPlans,
  loading,
  pagination,
  filters,
  searchTerm,
  selectedPlan,
  showCreateModal,
  showBroadcastModal,
  showEditModal,
  showPreviewModal,
  onFilterChange,
  onSearch,
  onBroadcast,
  onEdit,
  onPreview,
  onDelete,
  onPageChange,
  onCreateClick,
  onCloseCreateModal,
  onCloseBroadcastModal,
  onCloseEditModal,
  onClosePreviewModal,
  onCreateSuccess,
  onEditSuccess,
  onBroadcastSuccess,
}) => {
  const navigate = useNavigate();
  const filterOptions = ["All", "Draft", "Active", "Archived"];
  const handleBack = useCallback(() => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }
    navigate("/dashboard");
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 sm:p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-4">
          <button
            onClick={handleBack}
            className="inline-flex items-center gap-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-50 hover:text-blue-600"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
        </div>

        <div className="mb-6 text-center sm:mb-8">
          <h1 className="mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-3xl font-bold text-transparent sm:text-4xl">
            AI Workout Plans
          </h1>
          <p className="mx-auto max-w-2xl text-sm text-gray-600 sm:text-base">
            Build and manage workout routines with a clean and consistent
            experience.
          </p>
        </div>

        <div className="mb-6 rounded-2xl border border-blue-100 bg-gradient-to-r from-white via-blue-50 to-white p-4 shadow-md sm:mb-8 sm:p-6">
          <div className="flex flex-col items-stretch gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full lg:max-w-md">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-blue-500" />
              <input
                type="text"
                placeholder="Search workout plans..."
                value={searchTerm}
                onChange={(e) => onSearch(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-3 text-sm text-gray-900 placeholder-gray-400 shadow-sm transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {filterOptions.map((status) => (
                <button
                  key={status}
                  onClick={() => onFilterChange(status)}
                  className={`rounded-full border px-4 py-2 text-sm font-medium transition-all ${
                    filters.status === status
                      ? "border-blue-300 bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-sm"
                      : "border-blue-100 bg-white text-gray-700 hover:border-blue-200 hover:bg-blue-50"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>

            <button
              onClick={onCreateClick}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-5 py-2.5 text-sm font-medium text-white shadow-md transition-all hover:from-blue-700 hover:to-purple-700 hover:shadow-lg"
            >
              <Plus className="h-4 w-4" />
              Create Plan
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-blue-100 bg-white py-16 shadow-md">
            <Loader2 className="mb-3 h-10 w-10 animate-spin text-blue-500" />
            <p className="text-base font-medium text-gray-700">
              Loading workout plans...
            </p>
          </div>
        ) : workoutPlans.length === 0 ? (
          <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-white to-blue-50 p-10 text-center shadow-md">
            <h3 className="mb-3 text-2xl font-semibold text-gray-900">
              No workout plans found
            </h3>
            <p className="mb-6 text-sm text-gray-600 sm:text-base">
              {searchTerm
                ? "Try changing your search or filters."
                : "Create your first workout plan to get started."}
            </p>
            {!searchTerm && (
              <button
                onClick={onCreateClick}
                className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-5 py-2.5 text-sm font-medium text-white shadow-md transition-all hover:from-blue-700 hover:to-purple-700"
              >
                <Plus className="h-4 w-4" />
                Create First Plan
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
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

            {pagination.totalPages > 1 && (
              <div className="flex flex-col items-center justify-between gap-3 rounded-xl border border-blue-100 bg-gradient-to-r from-white via-blue-50 to-white p-4 shadow-sm sm:flex-row">
                <span className="text-sm text-gray-600">
                  Page{" "}
                  <span className="font-semibold text-blue-600">
                    {pagination.page}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-blue-600">
                    {pagination.totalPages}
                  </span>
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onPageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-all hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => onPageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.totalPages}
                    className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-all hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

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

      {showEditModal && selectedPlan && (
        <EditWorkoutPlanModal
          isOpen={showEditModal}
          onClose={onCloseEditModal}
          plan={selectedPlan}
          onSuccess={onEditSuccess}
        />
      )}

      {showPreviewModal && selectedPlan && (
        <PreviewWorkoutPlanModal
          isOpen={showPreviewModal}
          onClose={onClosePreviewModal}
          plan={selectedPlan}
        />
      )}
    </div>
  );
};

export default WorkoutPlanPageUI;
