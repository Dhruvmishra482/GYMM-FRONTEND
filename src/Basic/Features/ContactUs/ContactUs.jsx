import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  lazy,
  Suspense,
} from "react";
import {
  Mail,
  Phone,
  Clock,
  Send,
  Users,
  Shield,
  Headphones,
  Sparkles,
  Zap,
  AlertCircle,
  CheckCircle,
  Loader2,
  User,
  Building2,
} from "lucide-react";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuthStore } from "../../../Auth/Store/AuthStore";
import { contactFormService } from "./contactFormService";
import { Link } from "react-router-dom";

// Custom animation hook
const useAnimation = (delay = 0) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return isVisible;
};

// Memoized ContactInfo Card Component
const ContactInfoCard = React.memo(({ info, index }) => {
  const isVisible = useAnimation(index * 100);

  return (
    <div
      className={`relative h-full group transition-all duration-500 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
    >
      <div className="absolute inset-0 transition-all duration-300 bg-gradient-to-r from-orange-500/20 via-pink-500/20 to-purple-500/20 rounded-2xl blur-xl group-hover:blur-2xl"></div>
      <div className="relative flex flex-col h-full p-8 transition-all duration-300 transform border bg-gray-900/50 backdrop-blur-xl rounded-2xl border-gray-700/50 hover:border-orange-400/50 hover:-translate-y-2">
        <div className="mb-6 text-transparent bg-gradient-to-r from-orange-400 to-pink-400 bg-clip-text">
          {info.icon}
        </div>
        <h3 className="mb-4 text-xl font-bold text-transparent bg-gradient-to-r from-orange-400 to-pink-400 bg-clip-text">
          {info.title}
        </h3>
        <div className="flex-grow text-sm text-gray-300">{info.content}</div>
      </div>
    </div>
  );
});

ContactInfoCard.displayName = "ContactInfoCard";

// Memoized Feature Card Component
const FeatureCard = React.memo(({ feature, index }) => {
  const isVisible = useAnimation(index * 150);

  return (
    <div
      className={`relative group transition-all duration-500 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
    >
      <div
        className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-20 rounded-2xl blur-xl group-hover:opacity-30 transition-all duration-300`}
      ></div>
      <div className="relative p-8 transition-all duration-300 transform border bg-gray-900/50 backdrop-blur-xl rounded-2xl border-gray-700/50 hover:border-gray-600/50 hover:-translate-y-2">
        <div
          className={`text-transparent bg-gradient-to-r ${feature.gradient} bg-clip-text mb-6 flex justify-center`}
        >
          {feature.icon}
        </div>
        <h3
          className={`text-xl font-bold mb-4 bg-gradient-to-r ${feature.gradient} bg-clip-text text-transparent`}
        >
          {feature.title}
        </h3>
        <p className="text-sm leading-relaxed text-gray-300">
          {feature.description}
        </p>
      </div>
    </div>
  );
});

FeatureCard.displayName = "FeatureCard";

// Memoized Input Field Component
const InputField = React.memo(
  ({
    label,
    name,
    type = "text",
    value,
    onChange,
    error,
    placeholder,
    disabled,
    icon: Icon,
    required = false,
  }) => {
    return (
      <div className="space-y-3">
        <label className="block text-sm font-bold text-transparent bg-gradient-to-r from-orange-400 to-pink-400 bg-clip-text">
          {Icon && <Icon className="inline w-4 h-4 mr-1" />}
          {label} {required && "*"}
        </label>
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          className={`w-full bg-gray-800/50 backdrop-blur-sm border ${
            error ? "border-red-500" : "border-gray-600/50"
          } rounded-xl px-6 py-4 text-white placeholder-gray-500 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-400/30 transition-all`}
          placeholder={placeholder}
          disabled={disabled}
        />
        {error && (
          <p className="flex items-center space-x-1 text-sm text-red-400">
            <AlertCircle className="w-3 h-3" />
            <span>{error}</span>
          </p>
        )}
      </div>
    );
  }
);

InputField.displayName = "InputField";

// Memoized Status Message Component
const StatusMessage = React.memo(({ type, message, details }) => {
  const isSuccess = type === "success";
  const Icon = isSuccess ? CheckCircle : AlertCircle;
  const colorClass = isSuccess ? "green" : "red";

  return (
    <div
      className={`flex items-center p-4 mb-8 space-x-3 border rounded-lg bg-${colorClass}-900/30 border-${colorClass}-500/30 animate-fadeIn`}
    >
      <Icon className={`flex-shrink-0 w-5 h-5 text-${colorClass}-400`} />
      <div>
        <p className={`font-medium text-${colorClass}-300`}>{message}</p>
        {details && (
          <p className={`text-sm text-${colorClass}-400`}>{details}</p>
        )}
      </div>
    </div>
  );
});

StatusMessage.displayName = "StatusMessage";

const ContactUs = () => {
  // Get user info from auth store
  const { user, isInitialized } = useAuthStore();
  const isLoggedIn = useMemo(() => !!user, [user]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    inquiry: "general",
    message: "",
    gymName: "",
    ownerName: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [errors, setErrors] = useState({});

  // Get current location
  const location = useLocation();
  const showCTA = useMemo(
    () => location.pathname === "/contact",
    [location.pathname]
  );

  // Animation hook for hero section
  const heroVisible = useAnimation(0);

  // Memoized contact info
  const contactInfo = useMemo(
    () => [
      {
        icon: <Mail className="w-8 h-8" />,
        title: "Email Support",
        content: (
          <div>
            <p className="mb-2">
              <strong>General Inquiries:</strong> govind@fittracker.in
            </p>
            <p className="mb-2">
              <strong>Technical Support:</strong> dhruv@fittracker.in
            </p>
            <p>
              <strong>Sales:</strong> sales@fittacker.com
            </p>
          </div>
        ),
      },
      {
        icon: <Phone className="w-8 h-8" />,
        title: "Phone Support",
        content: (
          <div>
            <p className="mb-2">
              <strong>Main Line:</strong> +91 62390-38301
            </p>
            <p className="mb-2">
              <strong>Support:</strong> +91 94657-37989
            </p>
            <p className="text-sm text-purple-300">
              Available 24/7 for emergencies
            </p>
          </div>
        ),
      },
      {
        icon: <Clock className="w-8 h-8" />,
        title: "Business Hours",
        content: (
          <div>
            <p className="mb-2">
              <strong>Monday - Friday:</strong> 10:00 AM - 11:00
            </p>
            <p className="mb-2">
              <strong>Saturday:</strong> 08:00 AM - 11:00 PM
            </p>
            <p className="mb-2">
              <strong>Sunday:</strong> Closed
            </p>
            <p className="text-sm text-cyan-300">
              Emergency support available 24/7
            </p>
          </div>
        ),
      },
    ],
    []
  );

  // Memoized features
  const features = useMemo(
    () => [
      {
        icon: <Users className="w-6 h-6" />,
        title: "Dedicated Success Manager",
        description: "Personalized guidance to ensure your gym's growth",
        gradient: "from-orange-400 to-pink-400",
      },
      {
        icon: <Shield className="w-6 h-6" />,
        title: "Enterprise-Grade Security",
        description: "Bank-level protection to keep your member data safe",
        gradient: "from-cyan-400 to-blue-400",
      },
      {
        icon: <Headphones className="w-6 h-6" />,
        title: "24/7 Priority Support",
        description: "Instant help anytime via chat, call, or WhatsApp",
        gradient: "from-purple-400 to-pink-400",
      },
    ],
    []
  );

  // Auto-fill form if user is logged in
  useEffect(() => {
    if (isLoggedIn && user && isInitialized) {
      setFormData((prevData) => ({
        ...prevData,
        name:
          prevData.name ||
          `${user.firstName || ""} ${user.lastName || ""}`.trim(),
        email: prevData.email || user.email || "",
        phone: prevData.phone || user.mobileNumber || "",
        gymName: prevData.gymName || user.gymName || user.businessName || "",
        ownerName:
          prevData.ownerName ||
          `${user.firstName || ""} ${user.lastName || ""}`.trim(),
      }));
    }
  }, [isLoggedIn, user, isInitialized]);

  // useCallback for event handlers
  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    setErrors((prev) => {
      if (prev[name]) {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      }
      return prev;
    });
  }, []);

  const validateForm = useCallback(() => {
    const validation = contactFormService.validateFormData(formData);
    setErrors(validation.errors);
    return validation.isValid;
  }, [formData]);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      // Reset status
      setSubmitStatus(null);

      // ✅ ADDED: Check rate limit before submission
      const rateLimitCheck = contactFormService.checkRateLimit();
      if (rateLimitCheck.isRateLimited) {
        toast.error(
          `Please wait ${rateLimitCheck.remainingMinutes} more minute(s) before submitting again.`
        );
        return;
      }

      // Validate form
      if (!validateForm()) {
        toast.error("Please fix the errors in the form");
        return;
      }

      setIsSubmitting(true);

      try {
        // Prepare data for submission
        const submissionData = {
          ...formData,
          // Add user context if logged in
          ...(isLoggedIn &&
            user && {
              userContext: {
                isLoggedIn: true,
                userId: user._id || user.id,
                userEmail: user.email,
                userType: user.accountType || "owner",
              },
            }),
        };

        console.log("🔄 Submitting contact form...");

        const result = await contactFormService.submitContactForm(
          submissionData
        );

        console.log("✅ Contact form submitted successfully:", result);

        setSubmitStatus("success");
        toast.success(
          "Message sent successfully! We'll get back to you within 24 hours."
        );

        // Reset form only if user is not logged in
        if (!isLoggedIn) {
          setFormData({
            name: "",
            email: "",
            phone: "",
            subject: "",
            inquiry: "general",
            message: "",
            gymName: "",
            ownerName: "",
          });
        } else {
          // For logged-in users, only clear the message fields
          setFormData((prev) => ({
            ...prev,
            subject: "",
            message: "",
            inquiry: "general",
          }));
        }

        // Scroll to top to show success message
        window.scrollTo({ top: 0, behavior: "smooth" });
      } catch (err) {
        console.error("❌ Contact form submission error:", err);
        setSubmitStatus("error");
        setErrors({ submit: err.message });
        toast.error(err.message || "Failed to send message. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData, isLoggedIn, user, validateForm]
  );

  return (
    <div className="relative min-h-screen py-10 overflow-hidden bg-black">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute rounded-full top-20 left-10 w-72 h-72 bg-gradient-to-br from-orange-500/20 to-pink-500/20 blur-3xl animate-pulse"></div>
        <div className="absolute delay-1000 rounded-full top-40 right-20 w-96 h-96 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 blur-3xl animate-pulse"></div>
        <div className="absolute rounded-full bottom-20 left-1/3 w-80 h-80 bg-gradient-to-br from-purple-500/20 to-pink-500/20 blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 px-6 py-16 mx-auto max-w-7xl">
        {/* Hero Section */}
        <div
          className={`mb-16 text-center transition-all duration-1000 ${
            heroVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-8"
          }`}
        >
          <div className="inline-flex items-center px-6 py-3 mb-8 space-x-2 border rounded-full bg-gradient-to-r from-orange-600/20 to-pink-600/20 backdrop-blur-sm border-orange-500/30">
            <Sparkles className="w-5 h-5 text-orange-400" />
            <span className="font-semibold text-orange-300">
              Revolutionary Support
            </span>
            <Zap className="w-5 h-5 text-pink-400" />
          </div>

          <h1 className="mb-6 text-6xl font-black leading-tight md:text-8xl">
            <span className="text-transparent bg-gradient-to-r from-orange-400 via-yellow-400 to-pink-400 bg-clip-text">
              CONTACT
            </span>
            <br />
            <span className="text-transparent bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text">
              US
            </span>
          </h1>

          <div className="max-w-4xl mx-auto mb-8">
            <p className="mb-4 text-xl text-gray-300">
              Experience the{" "}
              <span className="font-bold text-transparent bg-gradient-to-r from-orange-400 to-pink-400 bg-clip-text">
                next evolution
              </span>{" "}
              of gym management support with
            </p>
            <p className="text-2xl font-bold">
              <span className="text-transparent bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text">
                AI-powered assistance
              </span>{" "}
              <span className="text-gray-300">that seems like magic</span>
            </p>
          </div>

          {/* User Status Indicator */}
          {isInitialized && (
            <div className="mb-8">
              {isLoggedIn ? (
                <div className="inline-flex items-center px-4 py-2 space-x-2 border rounded-full bg-gradient-to-r from-green-600/20 to-emerald-600/20 backdrop-blur-sm border-green-500/30">
                  <User className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-green-300">
                    Logged in as {user.firstName} {user.lastName}
                  </span>
                </div>
              ) : (
                <div className="inline-flex items-center px-4 py-2 space-x-2 border rounded-full bg-gradient-to-r from-blue-600/20 to-cyan-600/20 backdrop-blur-sm border-blue-500/30">
                  <Users className="w-4 h-4 text-blue-400" />
                  <span className="text-sm text-blue-300">
                    Contact us - No account required
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Contact Information Grid */}
        <div className="grid max-w-6xl gap-8 mx-auto mb-16 md:grid-cols-3">
          {contactInfo.map((info, index) => (
            <ContactInfoCard key={index} info={info} index={index} />
          ))}
        </div>

        {/* Contact Form */}
        <div className="relative mb-16">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 via-purple-500/10 to-cyan-500/10 rounded-3xl blur-2xl"></div>
          <div className="relative p-10 border bg-gray-900/40 backdrop-blur-xl rounded-3xl border-gray-700/30">
            <div className="mb-10 text-center">
              <h2 className="mb-4 text-4xl font-black">
                <span className="text-transparent bg-gradient-to-r from-orange-400 via-pink-400 to-purple-400 bg-clip-text">
                  Send Us a Message
                </span>
              </h2>
              <p className="text-gray-400">
                Let's discuss how we can revolutionize your gym management
              </p>
              {isLoggedIn && (
                <div className="inline-flex items-center px-4 py-2 mt-4 space-x-2 border rounded-lg bg-green-900/30 border-green-500/30">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-green-300">
                    Form pre-filled with your account details
                  </span>
                </div>
              )}
            </div>

            {/* Success/Error Messages */}
            {submitStatus === "success" && (
              <StatusMessage
                type="success"
                message="Message sent successfully!"
                details="We'll get back to you within 24 hours."
              />
            )}

            {submitStatus === "error" && (
              <StatusMessage
                type="error"
                message="Failed to send message"
                details={errors.submit || "Please try again later."}
              />
            )}

            <form onSubmit={handleSubmit}>
              <div className="grid gap-8 md:grid-cols-2">
                <InputField
                  label="Full Name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  error={errors.name}
                  placeholder="Enter your full name"
                  disabled={isSubmitting}
                  required
                />

                <InputField
                  label="Email Address"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  error={errors.email}
                  placeholder="Enter your email address"
                  disabled={isSubmitting}
                  required
                />

                <InputField
                  label="Phone Number"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  error={errors.phone}
                  placeholder="Enter your phone number"
                  disabled={isSubmitting}
                />

                <div className="space-y-3">
                  <label className="block text-sm font-bold text-transparent bg-gradient-to-r from-orange-400 to-pink-400 bg-clip-text">
                    Inquiry Type
                  </label>
                  <select
                    name="inquiry"
                    value={formData.inquiry}
                    onChange={handleInputChange}
                    className="w-full px-6 py-4 text-white transition-all border bg-gray-800/50 backdrop-blur-sm border-gray-600/50 rounded-xl focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-400/30"
                    disabled={isSubmitting}
                  >
                    <option value="general" className="bg-gray-800">
                      General Inquiry
                    </option>
                    <option value="sales" className="bg-gray-800">
                      Sales & Pricing
                    </option>
                    <option value="support" className="bg-gray-800">
                      Technical Support
                    </option>
                    <option value="demo" className="bg-gray-800">
                      Request Demo
                    </option>
                    <option value="partnership" className="bg-gray-800">
                      Partnership
                    </option>
                  </select>
                </div>

                {/* Gym Details Section */}
                <InputField
                  label="Gym/Business Name"
                  name="gymName"
                  value={formData.gymName}
                  onChange={handleInputChange}
                  placeholder="Your gym or business name"
                  disabled={isSubmitting}
                  icon={Building2}
                />

                <InputField
                  label="Owner/Manager Name"
                  name="ownerName"
                  value={formData.ownerName}
                  onChange={handleInputChange}
                  placeholder="Owner or manager name"
                  disabled={isSubmitting}
                  icon={User}
                />

                <div className="space-y-3 md:col-span-2">
                  <InputField
                    label="Subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    error={errors.subject}
                    placeholder="Brief subject of your inquiry"
                    disabled={isSubmitting}
                    required
                  />
                </div>

                <div className="space-y-3 md:col-span-2">
                  <label className="block text-sm font-bold text-transparent bg-gradient-to-r from-orange-400 to-pink-400 bg-clip-text">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows="6"
                    className={`w-full bg-gray-800/50 backdrop-blur-sm border ${
                      errors.message ? "border-red-500" : "border-gray-600/50"
                    } rounded-xl px-6 py-4 text-white placeholder-gray-500 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-400/30 transition-all resize-none`}
                    placeholder="Please provide details about your inquiry, gym size, current challenges, or specific requirements..."
                    disabled={isSubmitting}
                  />
                  {errors.message && (
                    <p className="flex items-center space-x-1 text-sm text-red-400">
                      <AlertCircle className="w-3 h-3" />
                      <span>{errors.message}</span>
                    </p>
                  )}
                </div>

                <div className="text-center md:col-span-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="relative px-12 py-4 text-lg font-bold text-white transition-all transform rounded-full group bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    <div className="absolute inset-0 transition-opacity rounded-full opacity-0 bg-gradient-to-r from-orange-600 via-pink-600 to-purple-600 group-hover:opacity-100 blur-xl"></div>
                    <div className="relative flex items-center justify-center space-x-3">
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>Sending...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          <span>Send Message</span>
                        </>
                      )}
                    </div>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Features Section */}
        <div className="mb-16 text-center">
          <h2 className="mb-8 text-4xl font-black">
            <span className="text-gray-300">Why Choose</span>
            <br />
            <span className="text-transparent bg-gradient-to-r from-orange-400 via-pink-400 to-purple-400 bg-clip-text">
              FitForge Support?
            </span>
          </h2>

          <div className="grid gap-8 mt-12 md:grid-cols-3">
            {features.map((feature, index) => (
              <FeatureCard key={index} feature={feature} index={index} />
            ))}
          </div>
        </div>

        {/* Call to Action */}
        {showCTA && (
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 via-purple-500/20 to-cyan-500/20 rounded-3xl blur-2xl"></div>
            <div className="relative p-12 text-center border bg-gray-900/40 backdrop-blur-xl rounded-3xl border-gray-700/30">
              <h3 className="mb-6 text-3xl font-black">
                <span className="text-transparent bg-gradient-to-r from-orange-400 via-pink-400 to-purple-400 bg-clip-text">
                  Ready to Get Started?
                </span>
              </h3>
              <p className="max-w-3xl mx-auto mb-8 text-lg leading-relaxed text-gray-300">
                Join thousands of gyms worldwide who trust FitForge to manage
                their operations efficiently. Schedule a personalized demo today
                and see the difference.
              </p>
              <div className="flex flex-col justify-center gap-6 sm:flex-row">
                <button className="relative px-10 py-4 text-lg font-bold text-white transition-all transform rounded-full group bg-gradient-to-r from-orange-500 to-pink-500 hover:scale-105">
                  <div className="absolute inset-0 transition-opacity rounded-full opacity-0 bg-gradient-to-r from-orange-600 to-pink-600 group-hover:opacity-100 blur-xl"></div>
                  <span className="relative">Schedule Demo</span>
                </button>

                <Link
                  to="/pricing"
                  className="relative px-10 py-4 text-lg font-bold text-gray-300 transition-all bg-transparent border-2 border-gray-600 rounded-full group hover:border-purple-400 hover:text-purple-300"
                >
                  <span className="relative">View Pricing</span>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(ContactUs);
