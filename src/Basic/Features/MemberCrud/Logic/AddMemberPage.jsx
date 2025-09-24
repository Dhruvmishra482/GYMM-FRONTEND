import { useState } from "react";
import {
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { addMember,validateMemberData } from "../Service/memberService";
import AddMemberForm from "../Ui/AddMemberForm";

const AddMemberPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    phoneNo: "",
    age: "",
    gender: "",
    email: "",
    joiningDate: new Date().toISOString().split("T")[0],
    planDuration: "",
    feesAmount: "",
    nextDueDate: "",
    paymentStatus: "Pending",
    lastPaidOn: "",
    address: "",
    photoUrl: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState({
    show: false,
    type: "",
    message: "",
  });
  const [validationErrors, setValidationErrors] = useState([]);

  const showNotification = (type, message) => {
    setNotification({ show: true, type, message });
    setTimeout(() => {
      setNotification({ show: false, type: "", message: "" });
    }, 5000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear validation errors when user starts typing
    if (validationErrors.length > 0) {
      setValidationErrors([]);
    }
  };

  const handleSubmit = async () => {
    // Validate data before submission
    const validation = validateMemberData(formData);

    if (!validation.isValid) {
      setValidationErrors(validation.errors);
      showNotification("error", "Please fix the validation errors below");
      return;
    }

    setIsSubmitting(true);
    setValidationErrors([]);

    try {
      // Prepare data for API (remove empty fields)
      const memberData = Object.fromEntries(
        Object.entries(formData).filter(([_, value]) => value !== "")
      );

      // Call the API
      const result = await addMember(memberData);

      if (result.success) {
        showNotification(
          "success",
          result.message ||
            "Welcome to the Beast Mode! Member registered successfully!"
        );

        // Reset form after successful submission
        setFormData({
          name: "",
          phoneNo: "",
          age: "",
          gender: "",
          email: "",
          joiningDate: new Date().toISOString().split("T")[0],
          planDuration: "",
          feesAmount: "",
          nextDueDate: "",
          paymentStatus: "Pending",
          lastPaidOn: "",
          address: "",
          photoUrl: "",
        });
      } else {
        showNotification(
          "error",
          result.message || "Failed to register member. Please try again."
        );
      }
    } catch (error) {
      console.error("Submission error:", error);
      showNotification(
        "error",
        "An unexpected error occurred. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative">
      {/* Notification */}
      {notification.show && (
        <div
          className={`fixed top-4 right-4 z-50 p-4 rounded-xl shadow-2xl transform transition-all duration-500 ${
            notification.type === "success"
              ? "bg-green-600 text-white"
              : "bg-red-600 text-white"
          }`}
        >
          <div className="flex items-center">
            {notification.type === "success" ? (
              <CheckCircle className="w-5 h-5 mr-2" />
            ) : (
              <AlertCircle className="w-5 h-5 mr-2" />
            )}
            <span className="font-medium">{notification.message}</span>
          </div>
        </div>
      )}

      {/* Validation Errors */}
      {validationErrors.length > 0 && (
        <div className="fixed top-4 left-4 z-50 bg-red-600 text-white p-4 rounded-xl shadow-2xl max-w-md">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
            <div>
              <div className="font-semibold mb-1">Validation Errors:</div>
              <ul className="text-sm space-y-1">
                {validationErrors.map((error, index) => (
                  <li key={index}>• {error}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Add Member Form */}
      <AddMemberForm
        formData={formData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default AddMemberPage;