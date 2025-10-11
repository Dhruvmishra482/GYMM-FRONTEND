import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAllDueMembers,
  markMemberFeePaid,
  sendMemberReminder,
  getMemberDetails,
  sendAllMemberReminders,
} from "../../MemberCrud/Service/memberService";
import DueMembersUI from "../Ui/DueMembersUi";

const DueMembersPage = () => {
  const navigate = useNavigate();
  const [dueMembers, setDueMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [totalCount, setTotalCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all"); // all, comingDue, dueToday, pending
  const [selectedMember, setSelectedMember] = useState(null);
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [actionLoading, setActionLoading] = useState({});

  useEffect(() => {
    fetchDueMembers();
  }, []);

  const fetchDueMembers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getAllDueMembers();

      console.log("=== FETCH DUE MEMBERS RESPONSE ===");
      console.log("Response:", response);
      console.log("Success:", response.success);
      console.log("Data length:", response.data?.length);

      if (response.success) {
        console.log("First 3 members:", response.data?.slice(0, 3));

        // Check member flags
        response.data?.forEach((member, idx) => {
          if (idx < 3) {
            console.log(`Member ${idx + 1} (${member.name}):`, {
              isComingDue: member.isComingDue,
              isDueToday: member.isDueToday,
              isOverdue: member.isOverdue,
              daysUntilDue: member.daysUntilDue,
              overdueDays: member.overdueDays,
              nextDueDate: member.nextDueDate,
              paymentStatus: member.paymentStatus,
            });
          }
        });

        setDueMembers(response.data || []);
        setTotalCount(response.count || 0);
        setError("");
      } else {
        setError(response.message || "Failed to fetch due members");
        setDueMembers([]);
        setTotalCount(0);
      }
    } catch (err) {
      console.error("Error fetching due members:", err);
      setError(err.message || "An unexpected error occurred");
      setDueMembers([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchDueMembers();
  };

  const handleBackToDashboard = () => {
    navigate("/dashboard");
  };

  const handleSearchChange = (term) => {
    setSearchTerm(term);
  };

  const handleFilterChange = (type) => {
    setFilterType(type);
  };

  // Filter members based on search term and filter type
  const filteredMembers = dueMembers.filter((member) => {
    // Search filter
    const matchesSearch =
      searchTerm === "" ||
      member.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.phoneNo?.includes(searchTerm) ||
      member.memberId?.toLowerCase().includes(searchTerm.toLowerCase());

    // Type filter
    let matchesFilter = true;
    switch (filterType) {
      case "comingDue":
        // Members whose due date is within next 4 days (1-4 days from now, not including overdue or due today)
        matchesFilter = member.isComingDue === true;
        break;
      case "dueToday":
        // Members whose due date is exactly today
        matchesFilter = member.isDueToday === true;
        break;
      case "pending":
        // Members who haven't paid (overdue + pending payment status)
        matchesFilter =
          member.isOverdue === true || member.paymentStatus === "Pending";
        break;
      case "all":
      default:
        matchesFilter = true;
        break;
    }

    console.log(`Filter Debug - ${member.name}:`, {
      filterType,
      isComingDue: member.isComingDue,
      isDueToday: member.isDueToday,
      isOverdue: member.isOverdue,
      paymentStatus: member.paymentStatus,
      matchesFilter,
      nextDueDate: member.nextDueDate,
    });

    return matchesSearch && matchesFilter;
  });

  // Calculate statistics
  const statistics = {
    total: dueMembers.length,
    comingDue: dueMembers.filter((member) => member.isComingDue === true)
      .length,
    dueToday: dueMembers.filter((member) => member.isDueToday === true).length,
    pending: dueMembers.filter(
      (member) =>
        member.isOverdue === true || member.paymentStatus === "Pending"
    ).length,
    filtered: filteredMembers.length,
  };

  console.log("=== STATISTICS CALCULATION ===");
  console.log("Total members:", statistics.total);
  console.log("Coming due:", statistics.comingDue);
  console.log("Due today:", statistics.dueToday);
  console.log("Pending/Overdue:", statistics.pending);
  console.log("Filtered:", statistics.filtered);
  console.log("Current filter:", filterType);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatCurrency = (amount) => {
    if (!amount) return "₹0";
    return `₹${parseFloat(amount).toLocaleString("en-IN")}`;
  };

  const getStatusColor = (member) => {
    if (member.isOverdue) return "text-red-600";
    if (member.isDueToday) return "text-yellow-600";
    if (member.isComingDue) return "text-blue-600";
    if (member.paymentStatus === "Pending") return "text-orange-600";
    return "text-gray-600";
  };

  const getStatusText = (member) => {
    if (member.isOverdue) return `Overdue (${member.overdueDays} days)`;
    if (member.isDueToday) return "Due Today";
    if (member.isComingDue) return `Due in ${member.daysUntilDue} days`;
    if (member.paymentStatus === "Pending") return "Payment Pending";
    return "Due";
  };

  const handleMemberAction = async (memberId, action) => {
    try {
      setActionLoading((prev) => ({ ...prev, [memberId]: action }));

      switch (action) {
        case "sendReminder":
          const reminderResponse = await sendMemberReminder(memberId);
          if (reminderResponse.success) {
            alert("Reminder sent successfully via WhatsApp!");
          } else {
            alert(reminderResponse.message || "Failed to send reminder");
          }
          break;

        case "markPaid":
          const paymentResponse = await markMemberFeePaid(memberId);
          if (paymentResponse.success) {
            alert("Member marked as paid successfully!");
            // Remove member from due members list
            setDueMembers((prev) =>
              prev.filter((member) => member._id !== memberId)
            );
            setTotalCount((prev) => prev - 1);
          } else {
            alert(paymentResponse.message || "Failed to mark as paid");
          }
          break;

        case "viewDetails":
          const detailsResponse = await getMemberDetails(memberId);
          if (detailsResponse.success) {
            setSelectedMember(detailsResponse.data);
            setShowMemberModal(true);
          } else {
            alert(detailsResponse.message || "Failed to load member details");
          }
          break;

        default:
          console.log("Unknown action:", action);
          break;
      }
    } catch (error) {
      console.error(`Error executing ${action} for member ${memberId}:`, error);
      alert(`Failed to ${action}: ${error.message}`);
    } finally {
      setActionLoading((prev) => ({ ...prev, [memberId]: false }));
    }
  };

  const handleSendAllReminders = async () => {
    try {
      setLoading(true);
      const response = await sendAllMemberReminders();

      if (response.success) {
        const { successful, failed, totalMembers } = response.data;
        alert(
          `Reminders sent: ${successful} successful, ${failed} failed out of ${totalMembers} members`
        );
      } else {
        alert(response.message || "Failed to send bulk reminders");
      }
    } catch (error) {
      alert(`Failed to send bulk reminders: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleExportData = () => {
    try {
      const csvData = filteredMembers.map((member) => ({
        "Member ID": member.memberId || member._id?.slice(-6) || "N/A",
        Name: member.name || "N/A",
        Email: member.email || "N/A",
        Phone: member.phoneNo || "N/A",
        "Due Date": formatDate(member.nextDueDate),
        Amount: member.feesAmount || member.feeAmount || member.amount || 0,
        Status: getStatusText(member),
        "Last Paid": formatDate(member.lastPaidOn),
        "Plan Duration": member.planDuration || "N/A",
      }));

      const csvHeaders = Object.keys(csvData[0]).join(",");
      const csvRows = csvData
        .map((row) => Object.values(row).join(","))
        .join("\n");
      const csvContent = csvHeaders + "\n" + csvRows;

      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `due-members-${
        new Date().toISOString().split("T")[0]
      }.csv`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert(`Failed to export data: ${error.message}`);
    }
  };

  const closeMemberModal = () => {
    setShowMemberModal(false);
    setSelectedMember(null);
  };

  return (
    <>
      <DueMembersUI
        dueMembers={filteredMembers}
        loading={loading}
        error={error}
        statistics={statistics}
        searchTerm={searchTerm}
        filterType={filterType}
        actionLoading={actionLoading}
        onRefresh={handleRefresh}
        onBackToDashboard={handleBackToDashboard}
        onSearchChange={handleSearchChange}
        onFilterChange={handleFilterChange}
        onMemberAction={handleMemberAction}
        onSendAllReminders={handleSendAllReminders}
        onExportData={handleExportData}
        formatDate={formatDate}
        formatCurrency={formatCurrency}
        getStatusColor={getStatusColor}
        getStatusText={getStatusText}
      />

      {/* Member Details Modal */}
      {showMemberModal && selectedMember && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  Member Details
                </h2>
                <button
                  onClick={closeMemberModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center mb-4">
                  <div className="h-16 w-16 rounded-full bg-blue-500 flex items-center justify-center">
                    <span className="text-xl font-bold text-white">
                      {selectedMember.name?.charAt(0)?.toUpperCase() || "M"}
                    </span>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {selectedMember.name}
                    </h3>
                    <p className="text-gray-600">
                      ID:{" "}
                      {selectedMember.memberId || selectedMember._id?.slice(-6)}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Email
                      </label>
                      <p className="text-gray-900">
                        {selectedMember.email || "N/A"}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Phone Number
                      </label>
                      <p className="text-gray-900">
                        {selectedMember.phoneNo || "N/A"}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Address
                      </label>
                      <p className="text-gray-900">
                        {selectedMember.address || "N/A"}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Age
                      </label>
                      <p className="text-gray-900">
                        {selectedMember.age || "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Plan Type
                      </label>
                      <p className="text-gray-900">
                        {selectedMember.planType || "N/A"}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Plan Duration
                      </label>
                      <p className="text-gray-900">
                        {selectedMember.planDuration || "N/A"}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Fees Amount
                      </label>
                      <p className="text-gray-900 font-semibold">
                        {formatCurrency(
                          selectedMember.feesAmount || selectedMember.feeAmount
                        )}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Status
                      </label>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          selectedMember.isOverdue
                            ? "bg-red-100 text-red-800"
                            : selectedMember.isDueToday
                            ? "bg-yellow-100 text-yellow-800"
                            : selectedMember.isComingDue
                            ? "bg-blue-100 text-blue-800"
                            : selectedMember.paymentStatus === "Pending"
                            ? "bg-orange-100 text-orange-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {getStatusText(selectedMember)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Join Date
                      </label>
                      <p className="text-gray-900">
                        {formatDate(selectedMember.joinDate)}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Last Paid On
                      </label>
                      <p className="text-gray-900">
                        {formatDate(selectedMember.lastPaidOn)}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Next Due Date
                      </label>
                      <p className="text-gray-900">
                        {formatDate(selectedMember.nextDueDate)}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Payment Status
                      </label>
                      <p className="text-gray-900">
                        {selectedMember.paymentStatus || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-3 pt-6 border-t border-gray-200">
                  <button
                    onClick={() =>
                      handleMemberAction(selectedMember._id, "sendReminder")
                    }
                    disabled={
                      actionLoading[selectedMember._id] === "sendReminder"
                    }
                    className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
                  >
                    {actionLoading[selectedMember._id] === "sendReminder" ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <>
                        <svg
                          className="w-4 h-4 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                        Send Reminder
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => {
                      handleMemberAction(selectedMember._id, "markPaid");
                      closeMemberModal();
                    }}
                    disabled={actionLoading[selectedMember._id] === "markPaid"}
                    className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
                  >
                    {actionLoading[selectedMember._id] === "markPaid" ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <>
                        <svg
                          className="w-4 h-4 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        Mark as Paid
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DueMembersPage;
