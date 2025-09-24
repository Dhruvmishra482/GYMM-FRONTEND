import React, { useState, useEffect } from "react";
import {
  User,
  Calendar,
  DollarSign,
  Clock,
  CreditCard,
  CheckCircle,
  Search,
  Zap,
  UserCheck,
  Crown,
  Shield,
  Sword,
  AlertCircle,
  ArrowLeft,
  X,
} from "lucide-react";
import { searchMember,editMember } from "../Service/memberService";
import { useNavigate } from "react-router-dom";

const EditMemberBySearch = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    age: "",
    planDuration: "",
    feesAmount: "",
    nextDueDate: "",
    lastPaidOn: "",
    paymentStatus: "",
    address: "",
    paymentMethod: "",
    paymentNotes: "",
  });

  const [particles, setParticles] = useState([]);
  const [flames, setFlames] = useState([]);

  useEffect(() => {
    // Generate random particles for background animation
    const newParticles = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 4,
      duration: 4 + Math.random() * 3,
    }));
    setParticles(newParticles);

    // Generate flame particles
    const newFlames = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      left: 10 + Math.random() * 80,
      delay: Math.random() * 2,
      duration: 2 + Math.random() * 2,
    }));
    setFlames(newFlames);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setError(null);

    try {
      const result = await searchMember(searchQuery);

      if (result.success) {
        setSearchResults(result.data);
        setFormData({
          age: result.data.age || "",
          planDuration: result.data.planDuration || "",
          feesAmount: result.data.feesAmount || "",
          nextDueDate: result.data.nextDueDate
            ? new Date(result.data.nextDueDate).toISOString().split("T")[0]
            : "",
          lastPaidOn: result.data.lastPaidOn
            ? new Date(result.data.lastPaidOn).toISOString().split("T")[0]
            : "",
          paymentStatus: result.data.paymentStatus || "",
          address: result.data.address || "",
          paymentMethod: result.data.paymentMethod || "",
          paymentNotes: result.data.paymentNotes || "",
        });
        setShowForm(false);
      } else {
        setSearchResults(null);
        setShowForm(false);
        setError(result.message);
      }
    } catch (error) {
      console.error("Search error:", error);
      setError("An unexpected error occurred while searching");
      setSearchResults(null);
      setShowForm(false);
    }

    setIsSearching(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const resetSearch = () => {
    setSearchQuery("");
    setSearchResults(null);
    setShowForm(false);
    setError(null);
    setSuccessMessage(null);
    setFormData({
      age: "",
      planDuration: "",
      feesAmount: "",
      nextDueDate: "",
      lastPaidOn: "",
      paymentStatus: "",
      address: "",
      paymentMethod: "",
      paymentNotes: "",
    });
  };

  const handleSubmit = async () => {
    if (!searchResults) return;

    setIsUpdating(true);
    setError(null);
    setSuccessMessage(null);

    try {
      // Prepare update data - only include fields that have values
      const updateData = {};

      if (formData.age) updateData.age = parseInt(formData.age);
      if (formData.planDuration)
        updateData.planDuration = formData.planDuration;
      if (formData.feesAmount)
        updateData.feesAmount = parseFloat(formData.feesAmount);
      if (formData.nextDueDate) updateData.nextDueDate = formData.nextDueDate;
      if (formData.lastPaidOn) updateData.lastPaidOn = formData.lastPaidOn;
      if (formData.paymentStatus)
        updateData.paymentStatus = formData.paymentStatus;
      if (formData.address) updateData.address = formData.address;
      if (formData.paymentMethod)
        updateData.paymentMethod = formData.paymentMethod;
      if (formData.paymentNotes)
        updateData.paymentNotes = formData.paymentNotes;

      const result = await editMember(searchResults.phoneNo, updateData);

      if (result.success) {
        setSuccessMessage("Warrior profile updated successfully!");
        setShowForm(false);
        // Update the search results with new data
        setSearchResults((prev) => ({
          ...prev,
          ...updateData,
        }));
      } else {
        setError(result.message || "Failed to update warrior profile");
      }
    } catch (error) {
      console.error("Update error:", error);
      setError("An unexpected error occurred while updating the profile");
    }

    setIsUpdating(false);
  };

  const FloatingParticles = () => (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute w-3 h-3 bg-gradient-to-r from-amber-400 to-orange-600 rounded-full opacity-40"
          style={{
            left: `${particle.left}%`,
            top: `${particle.top}%`,
            animation: `float ${particle.duration}s ease-in-out infinite ${particle.delay}s`,
          }}
        />
      ))}
      {flames.map((flame) => (
        <div
          key={`flame-${flame.id}`}
          className="absolute w-4 h-8 bg-gradient-to-t from-red-600 via-orange-500 to-yellow-400 rounded-full opacity-30"
          style={{
            left: `${flame.left}%`,
            bottom: "0%",
            animation: `flame ${flame.duration}s ease-in-out infinite ${flame.delay}s`,
          }}
        />
      ))}
    </div>
  );

  return (
    <div className="min-h-screen pt-14 bg-gradient-to-b from-gray-900 via-gray-800 to-black relative overflow-hidden">
      <FloatingParticles />

      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="fixed top-6 left-6 z-20 p-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full text-white hover:bg-white/20 transition-all"
      >
        <ArrowLeft className="w-6 h-6" />
      </button>

      {/* Iron throne inspired geometric shapes */}
      <div className="absolute top-16 left-16 w-24 h-24 bg-gradient-to-br from-amber-600 to-yellow-700 opacity-20 transform rotate-45 animate-pulse"></div>
      <div className="absolute bottom-32 right-16 w-32 h-8 bg-gradient-to-r from-gray-600 to-gray-700 opacity-30 transform rotate-12 animate-bounce-slow"></div>
      <div className="absolute top-1/3 right-10 w-16 h-32 bg-gradient-to-t from-amber-500 to-yellow-600 opacity-25 transform -rotate-12 animate-sway"></div>
      <div className="absolute bottom-40 left-20 w-20 h-4 bg-gradient-to-r from-gray-500 to-gray-600 opacity-40 transform rotate-45"></div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-6">
        <div className="w-full max-w-4xl">
          {/* Header - Iron Throne Style */}
          <div className="text-center mb-16 transform hover:scale-105 transition-transform duration-500">
            <div className="relative">
              <Crown className="mx-auto w-20 h-20 text-amber-500 mb-6 animate-pulse" />
              <h1 className="text-7xl font-bold bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 bg-clip-text text-transparent mb-4 tracking-wider font-serif">
                IRON THRONE
              </h1>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-300 to-gray-500 bg-clip-text text-transparent font-serif">
                WARRIOR REGISTRY
              </h2>
              <p className="text-amber-300 mt-4 text-lg italic">
                Honor • Strength • Glory
              </p>
              <div className="flex justify-center gap-4 mt-6">
                <Shield className="w-8 h-8 text-gray-400 animate-pulse" />
                <Sword className="w-8 h-8 text-amber-500 animate-bounce" />
                <Shield className="w-8 h-8 text-gray-400 animate-pulse" />
              </div>
            </div>
          </div>

          {/* Error/Success Messages */}
          {error && (
            <div className="mb-8 max-w-3xl mx-auto">
              <div className="bg-gradient-to-r from-red-900/30 to-red-800/30 backdrop-blur-xl border-2 border-red-500/40 rounded-3xl p-6 flex items-center gap-4">
                <AlertCircle className="w-8 h-8 text-red-400 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-bold text-red-400 mb-2 font-serif">
                    Battle Failed
                  </h3>
                  <p className="text-gray-300">{error}</p>
                </div>
                <button onClick={() => setError(null)} className="ml-auto">
                  <X className="w-6 h-6 text-red-400 hover:text-red-300" />
                </button>
              </div>
            </div>
          )}

          {successMessage && (
            <div className="mb-8 max-w-3xl mx-auto">
              <div className="bg-gradient-to-r from-green-900/30 to-emerald-800/30 backdrop-blur-xl border-2 border-green-500/40 rounded-3xl p-6 flex items-center gap-4">
                <CheckCircle className="w-8 h-8 text-green-400 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-bold text-green-400 mb-2 font-serif">
                    Victory Achieved
                  </h3>
                  <p className="text-gray-300">{successMessage}</p>
                </div>
                <button
                  onClick={() => setSuccessMessage(null)}
                  className="ml-auto"
                >
                  <X className="w-6 h-6 text-green-400 hover:text-green-300" />
                </button>
              </div>
            </div>
          )}

          {/* Search Bar - Throne Design */}
          <div className="mb-16">
            <div className="relative max-w-3xl mx-auto">
              <div className="relative group">
                {/* Glowing border effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 rounded-full opacity-30 blur-xl animate-pulse"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-gray-600 to-gray-700 rounded-full opacity-20 blur-lg"></div>

                <div className="relative bg-black/40 backdrop-blur-xl border-2 border-amber-500/30 rounded-full p-3 shadow-2xl">
                  <div className="flex items-center">
                    <Search className="ml-6 text-amber-400 w-7 h-7 animate-pulse" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Search by name or phone number..."
                      className="flex-1 px-6 py-5 bg-transparent text-white placeholder-gray-300 focus:outline-none text-xl font-serif"
                      disabled={isSearching}
                    />
                    <button
                      onClick={handleSearch}
                      disabled={isSearching || !searchQuery.trim()}
                      className="mr-3 px-10 py-4 bg-gradient-to-r from-amber-600 to-yellow-600 text-black font-bold rounded-full transform hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 font-serif text-lg"
                    >
                      {isSearching ? (
                        <>
                          <div className="w-6 h-6 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                          SEARCHING
                        </>
                      ) : (
                        <>
                          <Zap className="w-6 h-6" />
                          LOCATE
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Warrior Profile Card */}
            {searchResults && (
              <div className="mt-10 max-w-4xl mx-auto">
                <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/80 backdrop-blur-2xl border-2 border-amber-500/30 rounded-3xl p-8 transform animate-fade-in shadow-2xl relative">
                  {/* Close Button */}
                  <button
                    onClick={resetSearch}
                    className="absolute top-6 right-6 w-10 h-10 bg-red-600/80 hover:bg-red-500 rounded-full flex items-center justify-center transition-all duration-300 group"
                  >
                    <span className="text-white text-xl font-bold group-hover:scale-110 transition-transform">
                      ×
                    </span>
                  </button>

                  {/* Profile Header */}
                  <div className="flex items-start gap-8 mb-8">
                    {/* Avatar */}
                    <div className="relative">
                      <div className="w-32 h-32 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center text-6xl border-4 border-amber-400/50 shadow-lg">
                        {searchResults.gender === "Male"
                          ? "🗡️"
                          : searchResults.gender === "Female"
                          ? "⚔️"
                          : "🛡️"}
                      </div>
                      <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full border-4 border-gray-800"></div>
                    </div>

                    {/* Basic Info */}
                    <div className="flex-1">
                      <h2 className="text-4xl font-bold text-white mb-3 font-serif">
                        {searchResults.name}
                      </h2>
                      <div className="space-y-2 text-lg">
                        <div className="flex items-center gap-3 text-amber-300">
                          <span className="text-amber-400">📧</span>
                          <span>{searchResults.email || "Not provided"}</span>
                        </div>
                        <div className="flex items-center gap-3 text-amber-300">
                          <span className="text-amber-400">📱</span>
                          <span>{searchResults.phoneNo}</span>
                        </div>
                        <div className="flex items-center gap-3 text-amber-300">
                          <span className="text-amber-400">👤</span>
                          <span>
                            {searchResults.gender || "Not specified"},{" "}
                            {searchResults.age || "N/A"} years
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Detailed Information Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Joined Date */}
                    <div className="bg-black/20 rounded-2xl p-6 border border-amber-500/20">
                      <div className="text-gray-400 text-sm font-serif mb-2 uppercase tracking-wider">
                        Joined Date
                      </div>
                      <div className="text-white text-2xl font-bold">
                        {searchResults.joiningDate
                          ? new Date(
                              searchResults.joiningDate
                            ).toLocaleDateString("en-GB", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })
                          : "Not recorded"}
                      </div>
                    </div>

                    {/* Payment Status */}
                    <div className="bg-black/20 rounded-2xl p-6 border border-amber-500/20">
                      <div className="text-gray-400 text-sm font-serif mb-2 uppercase tracking-wider">
                        Payment Status
                      </div>
                      <div
                        className={`text-2xl font-bold ${
                          searchResults.paymentStatus === "Paid"
                            ? "text-green-400"
                            : "text-red-400"
                        }`}
                      >
                        {searchResults.paymentStatus === "Paid"
                          ? "✅ Paid"
                          : "❌ Pending"}
                      </div>
                    </div>

                    {/* Plan Duration */}
                    <div className="bg-black/20 rounded-2xl p-6 border border-amber-500/20">
                      <div className="text-gray-400 text-sm font-serif mb-2 uppercase tracking-wider">
                        Plan Duration
                      </div>
                      <div className="text-white text-2xl font-bold">
                        {searchResults.planDuration || "Not set"}
                      </div>
                    </div>

                    {/* Next Due Date */}
                    <div className="bg-black/20 rounded-2xl p-6 border border-amber-500/20">
                      <div className="text-gray-400 text-sm font-serif mb-2 uppercase tracking-wider">
                        Next Due Date
                      </div>
                      <div className="text-white text-2xl font-bold">
                        {searchResults.nextDueDate
                          ? new Date(
                              searchResults.nextDueDate
                            ).toLocaleDateString("en-GB", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })
                          : "Not set"}
                      </div>
                    </div>

                    {/* Fees Amount */}
                    <div className="bg-black/20 rounded-2xl p-6 border border-amber-500/20">
                      <div className="text-gray-400 text-sm font-serif mb-2 uppercase tracking-wider">
                        Fees Amount
                      </div>
                      <div className="text-green-400 text-2xl font-bold">
                        ₹{searchResults.feesAmount || "0"}
                      </div>
                    </div>

                    {/* Address */}
                    <div className="bg-black/20 rounded-2xl p-6 border border-amber-500/20">
                      <div className="text-gray-400 text-sm font-serif mb-2 uppercase tracking-wider">
                        Address
                      </div>
                      <div className="text-amber-300 text-xl font-medium flex items-center gap-2">
                        <span className="text-amber-400">📍</span>
                        {searchResults.address || "Not provided"}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-center gap-6 mt-10">
                    <button
                      onClick={() => setShowForm(true)}
                      className="px-8 py-4 bg-gradient-to-r from-amber-600 to-yellow-600 text-black font-bold rounded-2xl hover:scale-105 transition-all duration-300 font-serif text-lg flex items-center gap-3 shadow-lg"
                    >
                      <span>✏️</span>
                      Edit Warrior Profile
                    </button>
                    <button
                      onClick={resetSearch}
                      className="px-8 py-4 bg-gradient-to-r from-gray-700 to-gray-600 text-white font-bold rounded-2xl hover:scale-105 transition-all duration-300 font-serif text-lg"
                    >
                      Search Another
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 3D Form Container - Iron Throne Style */}
          {showForm && (
            <div className="relative animate-fade-in">
              <div
                className="bg-gradient-to-br from-black/40 to-gray-900/60 backdrop-blur-2xl border-2 border-amber-500/20 rounded-[2rem] p-10 shadow-2xl transform-gpu hover:rotateY-3 transition-all duration-1000 hover:shadow-amber-500/30"
                style={{
                  transformStyle: "preserve-3d",
                  boxShadow:
                    "0 30px 80px -12px rgba(0, 0, 0, 0.9), inset 0 2px 0 rgba(255, 200, 0, 0.1), 0 0 50px rgba(255, 193, 7, 0.1)",
                }}
              >
                {/* Throne-like border effects */}
                <div className="absolute -top-2 -left-2 w-8 h-8 border-l-4 border-t-4 border-amber-500 rounded-tl-lg"></div>
                <div className="absolute -top-2 -right-2 w-8 h-8 border-r-4 border-t-4 border-amber-500 rounded-tr-lg"></div>
                <div className="absolute -bottom-2 -left-2 w-8 h-8 border-l-4 border-b-4 border-amber-500 rounded-bl-lg"></div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 border-r-4 border-b-4 border-amber-500 rounded-br-lg"></div>

                {/* Glowing throne effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-amber-600/10 via-yellow-500/10 to-amber-600/10 rounded-[2rem] opacity-50 blur-2xl animate-pulse-slow"></div>

                <div className="relative z-10 space-y-10">
                  <div className="text-center mb-8">
                    <h3 className="text-3xl font-bold bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent font-serif mb-2">
                      Edit Warrior's Profile
                    </h3>
                    <div className="w-24 h-1 bg-gradient-to-r from-amber-500 to-yellow-500 mx-auto rounded-full"></div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    {/* Age Field */}
                    <div className="group transform hover:scale-105 transition-all duration-500 hover:rotate-1">
                      <label className="block text-amber-300 font-bold mb-3 text-lg font-serif">
                        ⚔️ Warrior's Age
                      </label>
                      <div className="relative">
                        <User className="absolute left-5 top-5 text-amber-400 w-7 h-7 group-hover:animate-bounce" />
                        <input
                          type="number"
                          name="age"
                          value={formData.age}
                          onChange={handleInputChange}
                          placeholder="Years of Experience"
                          className="w-full pl-16 pr-6 py-5 bg-black/20 border-2 border-amber-500/30 rounded-2xl text-white placeholder-amber-200/60 focus:outline-none focus:border-amber-400 focus:shadow-lg focus:shadow-amber-400/25 transition-all duration-300 backdrop-blur-sm hover:bg-black/30 text-lg font-serif"
                        />
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-amber-400/10 to-yellow-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                      </div>
                    </div>

                    {/* Plan Duration Field */}
                    <div className="group transform hover:scale-105 transition-all duration-500 hover:-rotate-1">
                      <label className="block text-amber-300 font-bold mb-3 text-lg font-serif">
                        👑 Training Period
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-5 top-5 text-amber-400 w-7 h-7 group-hover:animate-bounce" />
                        <select
                          name="planDuration"
                          value={formData.planDuration}
                          onChange={handleInputChange}
                          className="w-full pl-16 pr-6 py-5 bg-black/20 border-2 border-amber-500/30 rounded-2xl text-white focus:outline-none focus:border-amber-400 focus:shadow-lg focus:shadow-amber-400/25 transition-all duration-300 backdrop-blur-sm hover:bg-black/30 appearance-none text-lg font-serif"
                        >
                          <option value="" className="bg-gray-900">
                            Choose Your Path
                          </option>
                          <option value="1 month" className="bg-gray-900">
                            1 Month - Squire
                          </option>
                          <option value="3 month" className="bg-gray-900">
                            3 Months - Knight
                          </option>
                          <option value="6 month" className="bg-gray-900">
                            6 Months - Lord Commander
                          </option>
                          <option value="1 year" className="bg-gray-900">
                            1 Year - Hand of the King
                          </option>
                        </select>
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-amber-400/10 to-yellow-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                      </div>
                    </div>

                    {/* Fees Amount Field */}
                    <div className="group transform hover:scale-105 transition-all duration-500 hover:rotate-1">
                      <label className="block text-amber-300 font-bold mb-3 text-lg font-serif">
                        💰 Royal Treasury
                      </label>
                      <div className="relative">
                        <DollarSign className="absolute left-5 top-5 text-amber-400 w-7 h-7 group-hover:animate-bounce" />
                        <input
                          type="number"
                          name="feesAmount"
                          value={formData.feesAmount}
                          onChange={handleInputChange}
                          placeholder="Gold Dragons"
                          className="w-full pl-16 pr-6 py-5 bg-black/20 border-2 border-amber-500/30 rounded-2xl text-white placeholder-amber-200/60 focus:outline-none focus:border-amber-400 focus:shadow-lg focus:shadow-amber-400/25 transition-all duration-300 backdrop-blur-sm hover:bg-black/30 text-lg font-serif"
                        />
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-amber-400/10 to-yellow-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                      </div>
                    </div>

                    {/* Next Due Date Field */}
                    <div className="group transform hover:scale-105 transition-all duration-500 hover:-rotate-1">
                      <label className="block text-amber-300 font-bold mb-3 text-lg font-serif">
                        ⏰ Next Tribute Due
                      </label>
                      <div className="relative">
                        <Clock className="absolute left-5 top-5 text-amber-400 w-7 h-7 group-hover:animate-bounce" />
                        <input
                          type="date"
                          name="nextDueDate"
                          value={formData.nextDueDate}
                          onChange={handleInputChange}
                          className="w-full pl-16 pr-6 py-5 bg-black/20 border-2 border-amber-500/30 rounded-2xl text-white focus:outline-none focus:border-amber-400 focus:shadow-lg focus:shadow-amber-400/25 transition-all duration-300 backdrop-blur-sm hover:bg-black/30 text-lg font-serif"
                        />
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-amber-400/10 to-yellow-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                      </div>
                    </div>

                    {/* Last Paid On Field */}
                    <div className="group transform hover:scale-105 transition-all duration-500 hover:rotate-1">
                      <label className="block text-amber-300 font-bold mb-3 text-lg font-serif">
                        🗡️ Last Tribute Paid
                      </label>
                      <div className="relative">
                        <CreditCard className="absolute left-5 top-5 text-amber-400 w-7 h-7 group-hover:animate-bounce" />
                        <input
                          type="date"
                          name="lastPaidOn"
                          value={formData.lastPaidOn}
                          onChange={handleInputChange}
                          className="w-full pl-16 pr-6 py-5 bg-black/20 border-2 border-amber-500/30 rounded-2xl text-white focus:outline-none focus:border-amber-400 focus:shadow-lg focus:shadow-amber-400/25 transition-all duration-300 backdrop-blur-sm hover:bg-black/30 text-lg font-serif"
                        />
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-amber-400/10 to-yellow-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                      </div>
                    </div>

                    {/* Payment Status Field */}
                    <div className="group transform hover:scale-105 transition-all duration-500 hover:-rotate-1">
                      <label className="block text-amber-300 font-bold mb-3 text-lg font-serif">
                        🛡️ Honor Status
                      </label>
                      <div className="relative">
                        <CheckCircle className="absolute left-5 top-5 text-amber-400 w-7 h-7 group-hover:animate-bounce" />
                        <select
                          name="paymentStatus"
                          value={formData.paymentStatus}
                          onChange={handleInputChange}
                          className="w-full pl-16 pr-6 py-5 bg-black/20 border-2 border-amber-500/30 rounded-2xl text-white focus:outline-none focus:border-amber-400 focus:shadow-lg focus:shadow-amber-400/25 transition-all duration-300 backdrop-blur-sm hover:bg-black/30 appearance-none text-lg font-serif"
                        >
                          <option value="" className="bg-gray-900">
                            Choose Status
                          </option>
                          <option value="Paid" className="bg-gray-900">
                            👑 Honored - Tribute Paid
                          </option>
                          <option value="Pending" className="bg-gray-900">
                            ⏳ Awaiting - Tribute Pending
                          </option>
                        </select>
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-amber-400/10 to-yellow-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                      </div>
                    </div>

                    {/* Payment Method Field */}
                    <div className="group transform hover:scale-105 transition-all duration-500 hover:rotate-1">
                      <label className="block text-amber-300 font-bold mb-3 text-lg font-serif">
                        💳 Payment Method
                      </label>
                      <div className="relative">
                        <CreditCard className="absolute left-5 top-5 text-amber-400 w-7 h-7 group-hover:animate-bounce" />
                        <select
                          name="paymentMethod"
                          value={formData.paymentMethod}
                          onChange={handleInputChange}
                          className="w-full pl-16 pr-6 py-5 bg-black/20 border-2 border-amber-500/30 rounded-2xl text-white focus:outline-none focus:border-amber-400 focus:shadow-lg focus:shadow-amber-400/25 transition-all duration-300 backdrop-blur-sm hover:bg-black/30 appearance-none text-lg font-serif"
                        >
                          <option value="" className="bg-gray-900">
                            Choose Method
                          </option>
                          <option value="Cash" className="bg-gray-900">
                            💵 Cash
                          </option>
                          <option value="Card" className="bg-gray-900">
                            💳 Card
                          </option>
                          <option value="UPI" className="bg-gray-900">
                            📱 UPI
                          </option>
                          <option value="Bank Transfer" className="bg-gray-900">
                            🏦 Bank Transfer
                          </option>
                          <option value="Other" className="bg-gray-900">
                            🔄 Other
                          </option>
                        </select>
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-amber-400/10 to-yellow-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                      </div>
                    </div>

                    {/* Address Field - Spans full width */}
                    <div className="lg:col-span-2 group transform hover:scale-105 transition-all duration-500">
                      <label className="block text-amber-300 font-bold mb-3 text-lg font-serif">
                        📍 Stronghold Address
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          placeholder="Enter warrior's fortress location..."
                          className="w-full px-6 py-5 bg-black/20 border-2 border-amber-500/30 rounded-2xl text-white placeholder-amber-200/60 focus:outline-none focus:border-amber-400 focus:shadow-lg focus:shadow-amber-400/25 transition-all duration-300 backdrop-blur-sm hover:bg-black/30 text-lg font-serif"
                        />
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-amber-400/10 to-yellow-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                      </div>
                    </div>

                    {/* Payment Notes Field - Spans full width */}
                    <div className="lg:col-span-2 group transform hover:scale-105 transition-all duration-500">
                      <label className="block text-amber-300 font-bold mb-3 text-lg font-serif">
                        📝 Payment Notes
                      </label>
                      <div className="relative">
                        <textarea
                          name="paymentNotes"
                          value={formData.paymentNotes}
                          onChange={handleInputChange}
                          placeholder="Additional payment information or notes..."
                          rows="4"
                          className="w-full px-6 py-5 bg-black/20 border-2 border-amber-500/30 rounded-2xl text-white placeholder-amber-200/60 focus:outline-none focus:border-amber-400 focus:shadow-lg focus:shadow-amber-400/25 transition-all duration-300 backdrop-blur-sm hover:bg-black/30 text-lg font-serif resize-none"
                        />
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-amber-400/10 to-yellow-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button - Iron Throne Style */}
                  <div className="flex justify-center mt-16">
                    <button
                      onClick={handleSubmit}
                      disabled={isUpdating}
                      className="group relative px-16 py-6 bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 text-black font-bold text-2xl rounded-2xl transform hover:scale-110 transition-all duration-700 hover:shadow-2xl hover:shadow-amber-500/60 active:scale-95 font-serif disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{
                        textShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
                        boxShadow:
                          "0 15px 40px rgba(0, 0, 0, 0.4), inset 0 2px 0 rgba(255, 255, 255, 0.3), 0 0 30px rgba(255, 193, 7, 0.3)",
                      }}
                    >
                      {isUpdating ? (
                        <>
                          <div className="inline-block w-8 h-8 mr-4 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                          <span className="relative z-10 tracking-wider">
                            UPDATING THRONE...
                          </span>
                        </>
                      ) : (
                        <>
                          <Crown className="inline w-8 h-8 mr-4" />
                          <span className="relative z-10 tracking-wider">
                            CLAIM THE THRONE
                          </span>
                          <Sword className="inline w-8 h-8 ml-4" />
                        </>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-400 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-pulse-slow"></div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Custom CSS for Iron Throne animations */}
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-25px) rotate(180deg);
          }
        }

        @keyframes flame {
          0%,
          100% {
            transform: translateY(0px) scaleY(1);
            opacity: 0.3;
          }
          50% {
            transform: translateY(-40px) scaleY(1.5);
            opacity: 0.6;
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(30px) rotateX(10deg);
          }
          to {
            opacity: 1;
            transform: translateY(0) rotateX(0deg);
          }
        }

        @keyframes bounce-slow {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes sway {
          0%,
          100% {
            transform: rotate(-12deg);
          }
          50% {
            transform: rotate(12deg);
          }
        }

        @keyframes pulse-slow {
          0%,
          100% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.8;
          }
        }

        .animate-fade-in {
          animation: fade-in 1.2s ease-out;
        }

        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }

        .animate-sway {
          animation: sway 4s ease-in-out infinite;
        }

        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }

        .transform-gpu {
          transform: translateZ(0);
        }

        .hover\\:rotatey-3:hover {
          transform: perspective(1200px) rotateY(3deg) translateZ(30px)
            rotateX(2deg);
        }

        input[type="date"]::-webkit-calendar-picker-indicator {
          filter: invert(1) sepia(1) saturate(5) hue-rotate(15deg);
          cursor: pointer;
        }

        select {
          background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23fbbf24' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e");
          background-repeat: no-repeat;
          background-position: right 1.5rem center;
          background-size: 1.2em;
        }

        .font-serif {
          font-family: "Times New Roman", serif;
        }
      `}</style>
    </div>
  );
};

export default EditMemberBySearch;
