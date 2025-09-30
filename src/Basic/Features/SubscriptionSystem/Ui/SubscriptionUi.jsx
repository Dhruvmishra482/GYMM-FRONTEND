// import React, { useState, useEffect } from 'react';

// const SubscriptionUI = ({
//   subscription, currentPlan, usage, billing, plans, upgradeCalculation,
//   loading, error, refreshing, selectedPlan, selectedBilling, calculatingPrice, processingUpgrade,
//   currentPlanFeatures, usageWarnings, daysUntilBilling, hasActiveSubscription,
//   onRefresh, onPlanSelect, onUpgrade, onBillingChange, onClearError, onCancelUpgrade
// }) => {

//   const [animateCards, setAnimateCards] = useState(false);
//   const [hoveredCard, setHoveredCard] = useState(null);

//   useEffect(() => {
//     setAnimateCards(true);
//   }, []);

//   const formatCurrency = (amount) => new Intl.NumberFormat('en-IN', { 
//     style: 'currency', 
//     currency: 'INR', 
//     maximumFractionDigits: 0 
//   }).format(amount);
  
//   const getProgressBarColor = (percentage) => {
//     if (percentage >= 90) return 'from-red-400 to-red-600';
//     if (percentage >= 75) return 'from-amber-400 to-orange-500';
//     return 'from-emerald-400 to-green-500';
//   };

//   const getPlanGradient = (planId) => {
//     const gradients = {
//       'BASIC': 'from-blue-500 via-blue-600 to-indigo-700',
//       'ADVANCED': 'from-purple-500 via-purple-600 to-pink-700',
//       'ENTERPRISE': 'from-emerald-500 via-teal-600 to-cyan-700'
//     };
//     return gradients[planId] || 'from-gray-500 to-gray-600';
//   };

//   const getPlanBorderGradient = (planId) => {
//     const gradients = {
//       'BASIC': 'from-blue-200 to-indigo-300',
//       'ADVANCED': 'from-purple-200 to-pink-300',
//       'ENTERPRISE': 'from-emerald-200 to-teal-300'
//     };
//     return gradients[planId] || 'from-gray-200 to-gray-300';
//   };

//   // Loading State
//   if (loading) return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
//       <div className="text-center transform scale-100 animate-pulse">
//         <div className="relative">
//           <div className="w-16 h-16 mx-auto mb-4">
//             <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 animate-spin"></div>
//             <div className="absolute inset-2 bg-white rounded-full"></div>
//             <div className="absolute inset-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-pulse"></div>
//           </div>
//         </div>
//         <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
//           <p className="text-lg font-medium bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
//             Loading subscription details...
//           </p>
//           <div className="flex justify-center mt-4 space-x-2">
//             <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
//             <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
//             <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
//       {/* Animated Background Elements */}
//       <div className="absolute inset-0 overflow-hidden pointer-events-none">
//         <div className="absolute top-10 left-10 w-20 h-20 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-xl animate-bounce"></div>
//         <div className="absolute top-32 right-20 w-32 h-32 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-xl animate-pulse"></div>
//         <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-gradient-to-r from-teal-400/20 to-blue-400/20 rounded-full blur-xl animate-bounce"></div>
//       </div>

//       <div className="relative max-w-7xl mx-auto px-4 py-8">
        
//         {/* Enhanced Header */}
//         <div className={`mb-8 transform transition-all duration-1000 ${animateCards ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
//           <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/20">
//             <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 rounded-3xl"></div>
//             <div className="relative flex items-center justify-between">
//               <div className="flex items-center space-x-4">
//                 <div className="relative">
//                   <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
//                     <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
//                     </svg>
//                   </div>
//                   <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
//                     <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
//                   </div>
//                 </div>
//                 <div>
//                   <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent">
//                     My Subscription
//                   </h1>
//                   <p className="text-gray-600 mt-2 text-lg">Manage your gym management plan and usage</p>
//                 </div>
//               </div>
              
//               <button 
//                 onClick={onRefresh} 
//                 disabled={refreshing} 
//                 className="group relative px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50"
//               >
//                 <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-700 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
//                 <div className="relative flex items-center gap-3">
//                   <svg className={`w-5 h-5 transition-transform duration-500 ${refreshing ? 'animate-spin' : 'group-hover:rotate-180'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
//                   </svg>
//                   <span className="font-medium">{refreshing ? 'Refreshing...' : 'Refresh'}</span>
//                 </div>
//               </button>
//             </div>
//           </div>

//           {/* Enhanced Error & Warnings */}
//           {error && (
//             <div className="mt-6 transform animate-pulse">
//               <div className="bg-gradient-to-r from-red-500 to-pink-600 rounded-2xl p-6 text-white shadow-xl">
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center space-x-3">
//                     <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
//                       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.349 16.5c-.77.833.192 2.5 1.732 2.5z" />
//                       </svg>
//                     </div>
//                     <p className="font-medium text-lg">{error}</p>
//                   </div>
//                   <button 
//                     onClick={onClearError} 
//                     className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
//                   >
//                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                     </svg>
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}
          
//           {usageWarnings.length > 0 && (
//             <div className="mt-6 space-y-4">
//               {usageWarnings.map((warning, index) => (
//                 <div 
//                   key={index} 
//                   className="transform animate-pulse bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl p-6 text-white shadow-xl"
//                   style={{animationDelay: `${index * 100}ms`}}
//                 >
//                   <div className="flex items-start space-x-3">
//                     <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
//                       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01" />
//                       </svg>
//                     </div>
//                     <div>
//                       <p className="font-semibold text-lg capitalize">{warning.type} Warning</p>
//                       <p className="text-amber-100 mt-1">{warning.message}</p>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>

//         {/* Enhanced Current Plan Overview */}
//         <div className={`mb-8 transform transition-all duration-1000 delay-200 ${animateCards ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
//           <div className="relative group">
//             <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
//             <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
//               <div className={`absolute inset-0 bg-gradient-to-br ${getPlanGradient(subscription?.plan)} opacity-5`}></div>
              
//               <div className="relative p-8">
//                 <div className="flex items-start justify-between mb-8">
//                   <div className="flex items-center gap-6">
//                     <div className="relative">
//                       <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${getPlanGradient(subscription?.plan)} flex items-center justify-center shadow-xl transform hover:scale-110 transition-transform duration-300`}>
//                         <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
//                         </svg>
//                       </div>
//                       <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full border-2 border-white shadow-lg"></div>
//                     </div>
//                     <div>
//                       <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
//                         {currentPlan?.name || 'No Plan'} Plan
//                       </h2>
//                       <div className="flex items-center gap-4 mt-3">
//                         <span className={`px-4 py-2 rounded-full text-sm font-medium shadow-lg ${
//                           hasActiveSubscription 
//                             ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white' 
//                             : 'bg-gradient-to-r from-red-500 to-pink-600 text-white'
//                         }`}>
//                           {hasActiveSubscription ? '✓ Active' : '✗ Inactive'}
//                         </span>
//                         {daysUntilBilling > 0 && (
//                           <span className="px-4 py-2 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 rounded-full text-sm font-medium shadow-sm">
//                             {daysUntilBilling} days left
//                           </span>
//                         )}
//                       </div>
//                     </div>
//                   </div>

//                   {hasActiveSubscription && (
//                     <div className="text-right bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-6 shadow-inner">
//                       <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
//                         {formatCurrency(billing?.amount || 0)}
//                       </p>
//                       <p className="text-gray-600 font-medium mt-1">
//                         {billing?.cycleInfo?.cycleType === 'yearly' ? 'per year' : 'per month'}
//                       </p>
//                       {billing?.nextPayment && (
//                         <p className="text-gray-500 text-sm mt-2 flex items-center justify-end gap-2">
//                           <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
//                           </svg>
//                           Next: {new Date(billing.nextPayment).toLocaleDateString()}
//                         </p>
//                       )}
//                     </div>
//                   )}
//                 </div>

//              {/* Enhanced Features */}
// {currentPlanFeatures.length > 0 && (
//   <div className="bg-gradient-to-br from-gray-50/80 to-blue-50/80 rounded-2xl p-6 backdrop-blur-sm">
//     <h3 className="font-bold text-xl text-gray-900 mb-6 flex items-center gap-3">
//       <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
//         <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//         </svg>
//       </div>
//       Current Plan Features
//     </h3>
//     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//       {currentPlanFeatures.slice(0, 6).map((feature, index) => (
//         <div 
//           key={index} 
//           className="group flex items-center gap-3 p-4 bg-white/80 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105"
//         >
//           <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
//             typeof feature === 'object' && feature.included === false 
//               ? 'bg-gradient-to-r from-red-400 to-red-500' 
//               : 'bg-gradient-to-r from-green-400 to-emerald-500'
//           }`}>
//             <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d={
//                 typeof feature === 'object' && feature.included === false 
//                   ? "M6 18L18 6M6 6l12 12" 
//                   : "M5 13l4 4L19 7"
//               } />
//             </svg>
//           </div>
//           <div className="flex-1">
//             <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors duration-200">
//               {/* ✅ This is the critical fix - handle both object and string formats */}
//               {typeof feature === 'object' && feature.name ? feature.name : feature}
//             </span>
//             {/* Show highlight badge for popular features */}
//             {typeof feature === 'object' && feature.highlight && (
//               <span className="ml-2 px-2 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs rounded-full">
//                 Popular
//               </span>
//             )}
//           </div>
//         </div>
//       ))}
//     </div>
//   </div>
// )}
//               </div>
//             </div>
//           </div>
//         </div>
// {/* Enhanced Usage Analytics */}
//         {usage && (
//           <div className={`mb-8 transform transition-all duration-1000 delay-400 ${animateCards ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
//             <div className="mb-6">
//               <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent flex items-center gap-3">
//                 <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
//                   <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2z" />
//                   </svg>
//                 </div>
//                 Usage Analytics
//               </h2>
//               <p className="text-gray-600 mt-2 ml-11">Monitor your current usage across all features</p>
//             </div>
            
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
//               {/* Enhanced Members Usage */}
//               <div 
//                 className="group relative bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 overflow-hidden hover:shadow-2xl transition-all duration-500 hover:scale-105"
//                 onMouseEnter={() => setHoveredCard('members')}
//                 onMouseLeave={() => setHoveredCard(null)}
//               >
//                 <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5"></div>
//                 <div className={`absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 transition-opacity duration-500 ${hoveredCard === 'members' ? 'opacity-100' : 'opacity-0'}`}></div>
                
//                 <div className="relative p-6">
//                   <div className="flex items-center justify-between mb-6">
//                     <h3 className="font-bold text-lg text-gray-900">Members</h3>
//                     <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
//                       <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857" />
//                       </svg>
//                     </div>
//                   </div>
                  
//                   <div className="space-y-4">
//                     <div className="flex justify-between items-end">
//                       <span className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
//                         {usage.members?.current || 0}
//                       </span>
//                       <span className="text-xl font-medium text-gray-400">
//                         / {usage.members?.limit === -1 ? '∞' : (usage.members?.limit || 0)}
//                       </span>
//                     </div>
                    
//                     <div className="relative">
//                       <div className="w-full bg-gray-200 rounded-full h-3 shadow-inner">
//                         <div 
//                           className={`h-3 rounded-full bg-gradient-to-r ${getProgressBarColor(usage.members?.percentage || 0)} shadow-lg transition-all duration-1000 ease-out`}
//                           style={{ 
//                             width: `${Math.min(usage.members?.percentage || 0, 100)}%`,
//                             boxShadow: '0 0 10px rgba(59, 130, 246, 0.5)'
//                           }}
//                         ></div>
//                       </div>
//                       <div className="absolute -top-8 left-0 text-xs font-medium text-gray-500">
//                         {Math.round(usage.members?.percentage || 0)}% used
//                       </div>
//                     </div>
                    
//                     <div className="flex justify-between text-sm">
//                       <span className="text-gray-600 font-medium">Usage</span>
//                       <span className="font-bold text-blue-600">
//                         {usage.members?.remaining === 'Unlimited' ? '∞' : (usage.members?.remaining || 0)} remaining
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Enhanced WhatsApp Usage */}
//               <div 
//                 className="group relative bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 overflow-hidden hover:shadow-2xl transition-all duration-500 hover:scale-105"
//                 onMouseEnter={() => setHoveredCard('whatsapp')}
//                 onMouseLeave={() => setHoveredCard(null)}
//               >
//                 <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-emerald-500/5 to-teal-500/5"></div>
//                 <div className={`absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10 transition-opacity duration-500 ${hoveredCard === 'whatsapp' ? 'opacity-100' : 'opacity-0'}`}></div>
                
//                 <div className="relative p-6">
//                   <div className="flex items-center justify-between mb-6">
//                     <h3 className="font-bold text-lg text-gray-900">WhatsApp</h3>
//                     <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
//                       <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12V9a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-1a2 2 0 00-2-2H6a2 2 0 00-2 2v1a2 2 0 002 2z" />
//                       </svg>
//                     </div>
//                   </div>
                  
//                   <div className="space-y-4">
//                     <div className="flex justify-between items-end">
//                       <span className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
//                         {usage.whatsappReminders?.current || 0}
//                       </span>
//                       <span className="text-xl font-medium text-gray-400">
//                         / {usage.whatsappReminders?.limit === -1 ? '∞' : (usage.whatsappReminders?.limit || 0)}
//                       </span>
//                     </div>
                    
//                     <div className="relative">
//                       <div className="w-full bg-gray-200 rounded-full h-3 shadow-inner">
//                         <div 
//                           className={`h-3 rounded-full bg-gradient-to-r ${getProgressBarColor(usage.whatsappReminders?.percentage || 0)} shadow-lg transition-all duration-1000 ease-out`}
//                           style={{ 
//                             width: `${Math.min(usage.whatsappReminders?.percentage || 0, 100)}%`,
//                             boxShadow: '0 0 10px rgba(34, 197, 94, 0.5)'
//                           }}
//                         ></div>
//                       </div>
//                       <div className="absolute -top-8 left-0 text-xs font-medium text-gray-500">
//                         {Math.round(usage.whatsappReminders?.percentage || 0)}% used
//                       </div>
//                     </div>
                    
//                     <div className="flex justify-between text-sm">
//                       <span className="text-gray-600 font-medium">Reminders</span>
//                       <span className="font-bold text-green-600">
//                         {usage.whatsappReminders?.remaining === 'Unlimited' ? '∞' : (usage.whatsappReminders?.remaining || 0)} remaining
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Enhanced Analytics Usage */}
//               <div 
//                 className="group relative bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 overflow-hidden hover:shadow-2xl transition-all duration-500 hover:scale-105"
//                 onMouseEnter={() => setHoveredCard('analytics')}
//                 onMouseLeave={() => setHoveredCard(null)}
//               >
//                 <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-pink-500/5 to-rose-500/5"></div>
//                 <div className={`absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 transition-opacity duration-500 ${hoveredCard === 'analytics' ? 'opacity-100' : 'opacity-0'}`}></div>
                
//                 <div className="relative p-6">
//                   <div className="flex items-center justify-between mb-6">
//                     <h3 className="font-bold text-lg text-gray-900">Analytics</h3>
//                     <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
//                       <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2z" />
//                       </svg>
//                     </div>
//                   </div>
                  
//                   <div className="space-y-4">
//                     <div className="flex justify-between items-end">
//                       <span className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
//                         {usage.analyticsViews?.current || 0}
//                       </span>
//                       <span className="text-xl font-medium text-gray-400">
//                         / {usage.analyticsViews?.limit === -1 ? '∞' : (usage.analyticsViews?.limit || 0)}
//                       </span>
//                     </div>
                    
//                     <div className="relative">
//                       <div className="w-full bg-gray-200 rounded-full h-3 shadow-inner">
//                         <div 
//                           className={`h-3 rounded-full bg-gradient-to-r ${getProgressBarColor(usage.analyticsViews?.percentage || 0)} shadow-lg transition-all duration-1000 ease-out`}
//                           style={{ 
//                             width: `${Math.min(usage.analyticsViews?.percentage || 0, 100)}%`,
//                             boxShadow: '0 0 10px rgba(168, 85, 247, 0.5)'
//                           }}
//                         ></div>
//                       </div>
//                       <div className="absolute -top-8 left-0 text-xs font-medium text-gray-500">
//                         {Math.round(usage.analyticsViews?.percentage || 0)}% used
//                       </div>
//                     </div>
                    
//                     <div className="flex justify-between text-sm">
//                       <span className="text-gray-600 font-medium">Views</span>
//                       <span className="font-bold text-purple-600">
//                         {usage.analyticsViews?.remaining === 'Unlimited' ? '∞' : (usage.analyticsViews?.remaining || 0)} remaining
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//             </div>
//           </div>
//         )}

//         {/* Continue to Part 3 - Plans Comparison... */}
//         {/* Enhanced Plan Comparison */}
//         {plans && plans.length > 0 && (
//           <div className={`mb-8 transform transition-all duration-1000 delay-600 ${animateCards ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
//             <div className="flex items-center justify-between mb-6">
//               <div>
//                 <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-purple-900 bg-clip-text text-transparent flex items-center gap-3">
//                   <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
//                     <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4" />
//                     </svg>
//                   </div>
//                   Available Plans
//                 </h2>
//                 <p className="text-gray-600 text-lg mt-2 ml-11">Compare plans and upgrade your subscription</p>
//               </div>
              
//               {/* Enhanced Billing Toggle */}
//               <div className="relative bg-gradient-to-r from-gray-100 to-gray-200 rounded-2xl p-1 shadow-inner">
//                 <div className="flex">
//                   <button 
//                     onClick={() => onBillingChange('monthly')} 
//                     className={`relative px-6 py-3 text-sm font-medium rounded-xl transition-all duration-300 ${
//                       selectedBilling === 'monthly' 
//                         ? 'bg-white text-gray-900 shadow-lg transform scale-105' 
//                         : 'text-gray-600 hover:text-gray-900'
//                     }`}
//                   >
//                     Monthly
//                   </button>
//                   <button 
//                     onClick={() => onBillingChange('yearly')} 
//                     className={`relative px-6 py-3 text-sm font-medium rounded-xl transition-all duration-300 ${
//                       selectedBilling === 'yearly' 
//                         ? 'bg-white text-gray-900 shadow-lg transform scale-105' 
//                         : 'text-gray-600 hover:text-gray-900'
//                     }`}
//                   >
//                     Yearly
//                     <span className="ml-2 px-2 py-1 bg-gradient-to-r from-green-400 to-emerald-500 text-white text-xs rounded-full shadow-sm">
//                       Save 20%
//                     </span>
//                   </button>
//                 </div>
//               </div>
//             </div>

//             {/* Enhanced Plans Grid */}
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//               {plans.map((plan, index) => (
//                 <div 
//                   key={plan.id} 
//                   className={`group relative transform transition-all duration-500 hover:scale-105 ${
//                     plan.current ? 'scale-105' : ''
//                   }`}
//                   style={{animationDelay: `${index * 200}ms`}}
//                 >
//                   {/* Plan Card Background Glow */}
//                   <div className={`absolute inset-0 bg-gradient-to-r ${getPlanBorderGradient(plan.id)} rounded-3xl blur-xl opacity-30 group-hover:opacity-60 transition-opacity duration-500`}></div>
                  
//                   <div className={`relative bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border-2 overflow-hidden ${
//                     plan.current 
//                       ? 'border-blue-500 ring-4 ring-blue-100' 
//                       : selectedPlan === plan.id 
//                       ? 'border-purple-500 ring-4 ring-purple-100' 
//                       : 'border-gray-200 hover:border-gray-300'
//                   }`}>
                    
//                     {/* Current Plan Badge */}
//                     {plan.current && (
//                       <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
//                         <span className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
//                           Current Plan
//                         </span>
//                       </div>
//                     )}

//                     {/* Plan Header with Gradient */}
//                     <div className={`bg-gradient-to-br ${getPlanGradient(plan.id)} p-8 text-white relative overflow-hidden`}>
//                       <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full transform translate-x-16 -translate-y-16"></div>
//                       <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/10 rounded-full transform -translate-x-10 translate-y-10"></div>
                      
//                       <div className="relative text-center">
//                         <div className={`w-16 h-16 bg-white/20 rounded-2xl mx-auto mb-4 flex items-center justify-center backdrop-blur-sm`}>
//                           <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4" />
//                           </svg>
//                         </div>
//                         <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
//                         <div className="mb-3">
//                           <span className="text-4xl font-bold">
//                             {formatCurrency(selectedBilling === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice)}
//                           </span>
//                           <span className="text-lg opacity-90">
//                             /{selectedBilling === 'yearly' ? 'year' : 'month'}
//                           </span>
//                         </div>
//                         {selectedBilling === 'yearly' && plan.savings && (
//                           <p className="text-white/90 text-sm bg-white/20 rounded-full px-3 py-1 inline-block">
//                             {plan.savings}
//                           </p>
//                         )}
//                       </div>
//                     </div>

//                     <div className="p-8">
//                       {/* Plan Limits */}
//                       <div className="space-y-4 mb-8">
//                         <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
//                           <div className="w-5 h-5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
//                             <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
//                             </svg>
//                           </div>
//                           Plan Limits
//                         </h4>
                        
//                         <div className="grid grid-cols-1 gap-3">
//                           <div className="flex justify-between items-center p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
//                             <span className="text-gray-700 font-medium">Members</span>
//                             <span className="font-bold text-blue-600">
//                               {plan.limits.members === -1 ? 'Unlimited' : plan.limits.members.toLocaleString()}
//                             </span>
//                           </div>
//                           <div className="flex justify-between items-center p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
//                             <span className="text-gray-700 font-medium">WhatsApp Reminders</span>
//                             <span className="font-bold text-green-600">
//                               {plan.limits.whatsappReminders === -1 ? 'Unlimited' : plan.limits.whatsappReminders.toLocaleString()}
//                             </span>
//                           </div>
//                           <div className="flex justify-between items-center p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
//                             <span className="text-gray-700 font-medium">Analytics Views</span>
//                             <span className="font-bold text-purple-600">
//                               {plan.limits.analyticsViews === -1 ? 'Unlimited' : plan.limits.analyticsViews.toLocaleString()}
//                             </span>
//                           </div>
//                         </div>
//                       </div>

//                       {/* Key Features */}
//                       <div className="mb-8">
//                         <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
//                           <div className="w-5 h-5 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
//                             <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
//                             </svg>
//                           </div>
//                           Key Features
//                         </h4>
//                         <ul className="space-y-3">
//                           {plan.features.slice(0, 4).map((feature, idx) => (
//                             <li key={idx} className="flex items-start gap-3 group/feature">
//                               <div className="w-5 h-5 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 group-hover/feature:scale-110 transition-transform duration-200">
//                                 <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
//                                 </svg>
//                               </div>
//                               <span className="text-gray-700 font-medium group-hover/feature:text-gray-900 transition-colors duration-200">
//                                 {feature}
//                               </span>
//                             </li>
//                           ))}
//                           {plan.features.length > 4 && (
//                             <li className="text-gray-500 pl-8 text-sm font-medium">
//                               +{plan.features.length - 4} more features
//                             </li>
//                           )}
//                         </ul>
//                       </div>

//                       {/* Enhanced Action Button */}
//                       <div className="space-y-3">
//                         {plan.current ? (
//                           <div className="text-center py-4 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-600 rounded-xl text-lg font-bold">
//                             Current Plan
//                           </div>
//                         ) : !plan.canFitUsage ? (
//                           <div className="text-center py-4 bg-gradient-to-r from-red-100 to-pink-100 text-red-600 rounded-xl text-sm font-medium">
//                             Cannot fit current usage
//                           </div>
//                         ) : (
//                           <button 
//                             onClick={() => onPlanSelect(plan.id, selectedBilling)} 
//                             disabled={calculatingPrice && selectedPlan === plan.id} 
//                             className={`group w-full py-4 rounded-xl text-lg font-bold transition-all duration-300 transform hover:scale-105 disabled:opacity-50 ${
//                               selectedPlan === plan.id 
//                                 ? 'bg-gradient-to-r from-purple-500 to-purple-700 text-white shadow-xl' 
//                                 : 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 shadow-lg hover:shadow-xl'
//                             }`}
//                           >
//                             <div className="flex items-center justify-center gap-3">
//                               {calculatingPrice && selectedPlan === plan.id ? (
//                                 <>
//                                   <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                                   Calculating...
//                                 </>
//                               ) : selectedPlan === plan.id ? (
//                                 <>
//                                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//                                   </svg>
//                                   Selected
//                                 </>
//                               ) : (
//                                 <>
//                                   <svg className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
//                                   </svg>
//                                   Select Plan
//                                 </>
//                               )}
//                             </div>
//                           </button>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}
// {/* Continue to Part 4... */}
// {/* Enhanced Upgrade Calculator */}
//         {selectedPlan && upgradeCalculation && (
//           <div className={`mb-8 transform transition-all duration-1000 delay-800 ${animateCards ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
//             <div className="relative group">
//               <div className="absolute inset-0 bg-gradient-to-r from-purple-400 via-pink-500 to-orange-500 rounded-3xl blur-xl opacity-40 group-hover:opacity-60 transition-opacity duration-500"></div>
//               <div className="relative bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 overflow-hidden">
//                 <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 p-6 text-white">
//                   <div className="flex items-center justify-between">
//                     <div className="flex items-center gap-4">
//                       <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
//                         <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
//                         </svg>
//                       </div>
//                       <div>
//                         <h3 className="text-2xl font-bold">Upgrade to {plans?.find(p => p.id === selectedPlan)?.name} Plan</h3>
//                         <p className="text-white/90">Review your upgrade details and pricing</p>
//                       </div>
//                     </div>
//                     <button 
//                       onClick={onCancelUpgrade} 
//                       className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-110"
//                     >
//                       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                       </svg>
//                     </button>
//                   </div>
//                 </div>

//                 {/* Pricing Breakdown */}
//                 <div className="p-8">
//                   <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-6 mb-6">
//                     <h4 className="font-bold text-xl text-gray-900 mb-6 flex items-center gap-3">
//                       <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
//                         <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
//                         </svg>
//                       </div>
//                       Pricing Breakdown
//                     </h4>
                    
//                     <div className="space-y-4">
//                       <div className="flex justify-between items-center p-4 bg-white rounded-xl shadow-sm">
//                         <div>
//                           <span className="text-gray-700 font-medium">{plans?.find(p => p.id === selectedPlan)?.name} Plan</span>
//                           <span className="text-gray-500 text-sm ml-2">({selectedBilling})</span>
//                         </div>
//                         <span className="font-bold text-lg text-gray-900">
//                           {formatCurrency(upgradeCalculation.pricing.originalPrice)}
//                         </span>
//                       </div>
                      
//                       {upgradeCalculation.pricing.proratedDiscount > 0 && (
//                         <div className="flex justify-between items-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
//                           <div>
//                             <span className="text-green-700 font-medium">Credit for remaining days</span>
//                             <span className="text-green-600 text-sm ml-2">
//                               ({upgradeCalculation.pricing.daysLeft} days)
//                             </span>
//                           </div>
//                           <span className="font-bold text-lg text-green-600">
//                             -{formatCurrency(upgradeCalculation.pricing.proratedDiscount)}
//                           </span>
//                         </div>
//                       )}
                      
//                       <div className="border-t-2 border-dashed border-gray-300 pt-4">
//                         <div className="flex justify-between items-center p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
//                           <span className="text-xl font-bold text-gray-900">Total Amount</span>
//                           <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
//                             {formatCurrency(upgradeCalculation.pricing.finalPrice)}
//                           </span>
//                         </div>
//                       </div>
                      
//                       {upgradeCalculation.pricing.savings > 0 && (
//                         <div className="text-center">
//                           <p className="text-green-600 font-medium bg-green-50 rounded-full px-4 py-2 inline-block">
//                             🎉 You save {formatCurrency(upgradeCalculation.pricing.savings)}!
//                           </p>
//                         </div>
//                       )}
//                     </div>
//                   </div>

//                   <button 
//                     onClick={onUpgrade} 
//                     disabled={processingUpgrade} 
//                     className="w-full bg-gradient-to-r from-purple-500 to-pink-600 text-white py-4 px-6 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50"
//                   >
//                     {processingUpgrade ? (
//                       <div className="flex items-center justify-center gap-3">
//                         <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                         <span>Processing Payment...</span>
//                       </div>
//                     ) : (
//                       <div className="flex items-center justify-center gap-3">
//                         <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
//                         </svg>
//                         <span>Upgrade Now - Pay {formatCurrency(upgradeCalculation.pricing.finalPrice)}</span>
//                       </div>
//                     )}
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Enhanced Help Section */}
//         <div className={`mb-8 transform transition-all duration-1000 delay-1000 ${animateCards ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
//           <div className="relative group">
//             <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
//             <div className="relative bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl p-8 text-white overflow-hidden">
//               <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full transform translate-x-20 -translate-y-20"></div>
//               <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full transform -translate-x-16 translate-y-16"></div>
              
//               <div className="relative flex items-center justify-between">
//                 <div className="flex items-center gap-6">
//                   <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
//                     <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                     </svg>
//                   </div>
//                   <div>
//                     <h2 className="text-3xl font-bold mb-2">Need Help?</h2>
//                     <p className="text-blue-100 text-lg mb-4">Contact our support team for assistance with your subscription.</p>
//                     <div className="flex gap-4">
//                       <button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105">
//                         💬 Chat Support
//                       </button>
//                       <button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105">
//                         📧 Email Support
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Enhanced Footer */}
//         <div className={`bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-8 transform transition-all duration-1000 delay-1200 ${animateCards ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//             <div className="text-center md:text-left">
//               <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto md:mx-0 mb-4">
//                 <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
//                 </svg>
//               </div>
//               <h3 className="font-bold text-xl text-gray-900 mb-3">Billing Information</h3>
//               <div className="space-y-2 text-gray-600">
//                 <p className="flex items-center justify-center md:justify-start gap-2">
//                   <span className="w-2 h-2 bg-green-500 rounded-full"></span>
//                   Payments processed securely
//                 </p>
//                 <p className="flex items-center justify-center md:justify-start gap-2">
//                   <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
//                   Auto-renewal enabled
//                 </p>
//                 <p className="flex items-center justify-center md:justify-start gap-2">
//                   <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
//                   Cancel anytime
//                 </p>
//               </div>
//             </div>
            
//             <div className="text-center">
//               <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
//                 <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
//                 </svg>
//               </div>
//               <h3 className="font-bold text-xl text-gray-900 mb-3">Plan Benefits</h3>
//               <div className="space-y-2 text-gray-600">
//                 <p className="flex items-center justify-center gap-2">
//                   <span className="w-2 h-2 bg-green-500 rounded-full"></span>
//                   24/7 customer support
//                 </p>
//                 <p className="flex items-center justify-center gap-2">
//                   <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
//                   Regular feature updates
//                 </p>
//                 <p className="flex items-center justify-center gap-2">
//                   <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
//                   Data backup included
//                 </p>
//               </div>
//             </div>
            
//             <div className="text-center md:text-right">
//               <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto md:ml-auto md:mr-0 mb-4">
//                 <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
//                 </svg>
//               </div>
//               <h3 className="font-bold text-xl text-gray-900 mb-3">Security</h3>
//               <div className="space-y-2 text-gray-600">
//                 <p className="flex items-center justify-center md:justify-end gap-2">
//                   <span className="w-2 h-2 bg-green-500 rounded-full"></span>
//                   SSL encrypted
//                 </p>
//                 <p className="flex items-center justify-center md:justify-end gap-2">
//                   <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
//                   PCI DSS compliant
//                 </p>
//                 <p className="flex items-center justify-center md:justify-end gap-2">
//                   <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
//                   Regular audits
//                 </p>
//               </div>
//             </div>
//           </div>
          
//           <div className="border-t border-gray-200 mt-8 pt-6">
//             <p className="text-center text-gray-500 flex items-center justify-center gap-2">
//               <span className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-pulse"></span>
//               Last updated: {new Date().toLocaleDateString()} • Need help? Contact support@gymmanager.com
//               <span className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full animate-pulse"></span>
//             </p>
//           </div>
//         </div>

//       </div>

//       {/* Custom CSS Animations */}
//       <style jsx>{`
//         @keyframes float {
//           0%, 100% { transform: translateY(0px); }
//           50% { transform: translateY(-20px); }
//         }
//         @keyframes float-delayed {
//           0%, 100% { transform: translateY(0px); }
//           50% { transform: translateY(-15px); }
//         }
//         .animate-float {
//           animation: float 6s ease-in-out infinite;
//         }
//         .animate-float-delayed {
//           animation: float-delayed 8s ease-in-out infinite;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default SubscriptionUI;

import React, { useState, useEffect, useMemo, useCallback } from 'react';

// Custom animation hook
const useFadeIn = (delay = 0) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return isVisible;
};

// Custom animation state hook
const useAnimationState = () => {
  const [animateCards, setAnimateCards] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);

  useEffect(() => {
    setAnimateCards(true);
  }, []);

  const handleSetHoveredCard = useCallback((cardId) => {
    setHoveredCard(cardId);
  }, []);

  return { animateCards, hoveredCard, setHoveredCard: handleSetHoveredCard };
};

// Memoized utility functions hook
const useUtilities = () => {
  const formatCurrency = useCallback((amount) => {
    if (amount === null || amount === undefined || isNaN(amount)) {
      return '₹0';
    }
    return new Intl.NumberFormat('en-IN', { 
      style: 'currency', 
      currency: 'INR', 
      maximumFractionDigits: 0 
    }).format(amount);
  }, []);
  
  const getProgressBarColor = useCallback((percentage) => {
    if (!percentage || isNaN(percentage)) return 'from-gray-300 to-gray-400';
    if (percentage >= 90) return 'from-red-400 to-red-600';
    if (percentage >= 75) return 'from-amber-400 to-orange-500';
    return 'from-emerald-400 to-green-500';
  }, []);

  const getPlanGradient = useCallback((planId) => {
    if (!planId) return 'from-gray-500 to-gray-600';
    const gradients = {
      'BASIC': 'from-blue-500 via-blue-600 to-indigo-700',
      'ADVANCED': 'from-purple-500 via-purple-600 to-pink-700',
      'ENTERPRISE': 'from-emerald-500 via-teal-600 to-cyan-700'
    };
    return gradients[planId] || 'from-gray-500 to-gray-600';
  }, []);

  const getPlanBorderGradient = useCallback((planId) => {
    if (!planId) return 'from-gray-200 to-gray-300';
    const gradients = {
      'BASIC': 'from-blue-200 to-indigo-300',
      'ADVANCED': 'from-purple-200 to-pink-300',
      'ENTERPRISE': 'from-emerald-200 to-teal-300'
    };
    return gradients[planId] || 'from-gray-200 to-gray-300';
  }, []);

  return { formatCurrency, getProgressBarColor, getPlanGradient, getPlanBorderGradient };
};

// Memoized Loading State Component
const LoadingState = React.memo(() => (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
    <div className="text-center transform scale-100 animate-pulse">
      <div className="relative">
        <div className="w-16 h-16 mx-auto mb-4">
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 animate-spin"></div>
          <div className="absolute inset-2 bg-white rounded-full"></div>
          <div className="absolute inset-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-pulse"></div>
        </div>
      </div>
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
        <p className="text-lg font-medium bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Loading subscription details...
        </p>
        <div className="flex justify-center mt-4 space-x-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
          <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
        </div>
      </div>
    </div>
  </div>
));

LoadingState.displayName = 'LoadingState';

// Memoized Background Elements
const BackgroundElements = React.memo(() => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div className="absolute top-10 left-10 w-20 h-20 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-xl animate-bounce"></div>
    <div className="absolute top-32 right-20 w-32 h-32 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-xl animate-pulse"></div>
    <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-gradient-to-r from-teal-400/20 to-blue-400/20 rounded-full blur-xl animate-bounce"></div>
  </div>
));

BackgroundElements.displayName = 'BackgroundElements';

// Memoized Header Component
const SubscriptionHeader = React.memo(({ refreshing, onRefresh, animateCards }) => {
  const handleRefresh = useCallback(() => {
    onRefresh();
  }, [onRefresh]);

  return (
    <div className={`mb-8 transform transition-all duration-1000 ${animateCards ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
      <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/20">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 rounded-3xl"></div>
        <div className="relative flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              </div>
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent">
                My Subscription
              </h1>
              <p className="text-gray-600 mt-2 text-lg">Manage your gym management plan and usage</p>
            </div>
          </div>
          
          <button 
            onClick={handleRefresh} 
            disabled={refreshing} 
            className="group relative px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-700 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative flex items-center gap-3">
              <svg className={`w-5 h-5 transition-transform duration-500 ${refreshing ? 'animate-spin' : 'group-hover:rotate-180'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span className="font-medium">{refreshing ? 'Refreshing...' : 'Refresh'}</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
});

SubscriptionHeader.displayName = 'SubscriptionHeader';

// Memoized Error Banner
const ErrorBanner = React.memo(({ error, onClearError }) => {
  const handleClear = useCallback(() => {
    onClearError();
  }, [onClearError]);

  if (!error) return null;

  return (
    <div className="mt-6 transform animate-pulse">
      <div className="bg-gradient-to-r from-red-500 to-pink-600 rounded-2xl p-6 text-white shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.349 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <p className="font-medium text-lg">{error}</p>
          </div>
          <button 
            onClick={handleClear} 
            className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
});

ErrorBanner.displayName = 'ErrorBanner';

// Memoized Warning Item
const WarningItem = React.memo(({ warning, index }) => (
  <div 
    className="transform animate-pulse bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl p-6 text-white shadow-xl"
    style={{animationDelay: `${index * 100}ms`}}
  >
    <div className="flex items-start space-x-3">
      <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01" />
        </svg>
      </div>
      <div>
        <p className="font-semibold text-lg capitalize">
          {typeof warning === 'object' && warning.type ? warning.type + ' Warning' : 'Warning'}
        </p>
        <p className="text-amber-100 mt-1">
          {typeof warning === 'object' && warning.message ? warning.message : 
           typeof warning === 'string' ? warning : 'Usage limit warning'}
        </p>
      </div>
    </div>
  </div>
));

WarningItem.displayName = 'WarningItem';

// Memoized Warnings List
const WarningsList = React.memo(({ warnings }) => {
  if (!warnings || warnings.length === 0) return null;

  return (
    <div className="mt-6 space-y-4">
      {warnings.map((warning, index) => (
        <WarningItem key={index} warning={warning} index={index} />
      ))}
    </div>
  );
});

WarningsList.displayName = 'WarningsList';
// Memoized Current Plan Badge
const CurrentPlanBadge = React.memo(({ hasActiveSubscription, daysUntilBilling }) => (
  <div className="flex items-center gap-4 mt-3">
    <span className={`px-4 py-2 rounded-full text-sm font-medium shadow-lg ${
      hasActiveSubscription 
        ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white' 
        : 'bg-gradient-to-r from-red-500 to-pink-600 text-white'
    }`}>
      {hasActiveSubscription ? '✓ Active' : '✗ Inactive'}
    </span>
    {daysUntilBilling > 0 && (
      <span className="px-4 py-2 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 rounded-full text-sm font-medium shadow-sm">
        {daysUntilBilling} days left
      </span>
    )}
  </div>
));

CurrentPlanBadge.displayName = 'CurrentPlanBadge';

// Memoized Billing Info
const BillingInfo = React.memo(({ billing, formatCurrency }) => {
  if (!billing) return null;

  return (
    <div className="text-right bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-6 shadow-inner">
      <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        {formatCurrency(billing.amount || 0)}
      </p>
      <p className="text-gray-600 font-medium mt-1">
        {billing.cycleInfo?.cycleType === 'yearly' ? 'per year' : 'per month'}
      </p>
      {billing.nextPayment && (
        <p className="text-gray-500 text-sm mt-2 flex items-center justify-end gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Next: {new Date(billing.nextPayment).toLocaleDateString()}
        </p>
      )}
    </div>
  );
});

BillingInfo.displayName = 'BillingInfo';

// Memoized Feature Item
const FeatureItem = React.memo(({ feature, index }) => {
  const isVisible = useFadeIn(index * 50);

  return (
    <div 
      className={`group flex items-center gap-3 p-4 bg-white/80 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 ${
        isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
      }`}
    >
      <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
        typeof feature === 'object' && feature.included === false 
          ? 'bg-gradient-to-r from-red-400 to-red-500' 
          : 'bg-gradient-to-r from-green-400 to-emerald-500'
      }`}>
        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d={
            typeof feature === 'object' && feature.included === false 
              ? "M6 18L18 6M6 6l12 12" 
              : "M5 13l4 4L19 7"
          } />
        </svg>
      </div>
      <div className="flex-1">
        <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors duration-200">
          {typeof feature === 'object' && feature.name ? feature.name : 
           typeof feature === 'string' ? feature : 'Feature'}
        </span>
        {typeof feature === 'object' && feature.highlight && (
          <span className="ml-2 px-2 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs rounded-full">
            Popular
          </span>
        )}
      </div>
    </div>
  );
});

FeatureItem.displayName = 'FeatureItem';

// Memoized Features List
const CurrentPlanFeatures = React.memo(({ features }) => {
  if (!features || features.length === 0) return null;

  return (
    <div className="bg-gradient-to-br from-gray-50/80 to-blue-50/80 rounded-2xl p-6 backdrop-blur-sm">
      <h3 className="font-bold text-xl text-gray-900 mb-6 flex items-center gap-3">
        <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        Current Plan Features
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {features.slice(0, 6).map((feature, index) => (
          <FeatureItem key={index} feature={feature} index={index} />
        ))}
      </div>
    </div>
  );
});

CurrentPlanFeatures.displayName = 'CurrentPlanFeatures';

// Memoized Current Plan Overview
const CurrentPlanOverview = React.memo(({ 
  subscription, 
  currentPlan, 
  billing, 
  currentPlanFeatures,
  hasActiveSubscription,
  daysUntilBilling,
  animateCards,
  getPlanGradient,
  formatCurrency
}) => {
  if (!subscription && !currentPlan) return null;

  return (
    <div className={`mb-8 transform transition-all duration-1000 delay-200 ${animateCards ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
        <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
          <div className={`absolute inset-0 bg-gradient-to-br ${getPlanGradient(subscription?.plan || currentPlan?.id)} opacity-5`}></div>
          
          <div className="relative p-8">
            <div className="flex items-start justify-between mb-8">
              <div className="flex items-center gap-6">
                <div className="relative">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${getPlanGradient(subscription?.plan || currentPlan?.id)} flex items-center justify-center shadow-xl transform hover:scale-110 transition-transform duration-300`}>
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full border-2 border-white shadow-lg"></div>
                </div>
                <div>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    {currentPlan?.name || subscription?.planName || 'No Plan'} Plan
                  </h2>
                  <CurrentPlanBadge 
                    hasActiveSubscription={hasActiveSubscription} 
                    daysUntilBilling={daysUntilBilling} 
                  />
                </div>
              </div>

              {hasActiveSubscription && (
                <BillingInfo billing={billing} formatCurrency={formatCurrency} />
              )}
            </div>

            <CurrentPlanFeatures features={currentPlanFeatures} />
          </div>
        </div>
      </div>
    </div>
  );
});

CurrentPlanOverview.displayName = 'CurrentPlanOverview';

// Memoized Usage Card
const UsageCard = React.memo(({ 
  title, 
  icon, 
  usage, 
  gradient, 
  color,
  hoveredCard,
  cardId,
  onHover,
  getProgressBarColor
}) => {
  const handleMouseEnter = useCallback(() => {
    onHover(cardId);
  }, [cardId, onHover]);

  const handleMouseLeave = useCallback(() => {
    onHover(null);
  }, [onHover]);

  return (
    <div 
      className="group relative bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 overflow-hidden hover:shadow-2xl transition-all duration-500 hover:scale-105"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient}/5`}></div>
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient}/10 transition-opacity duration-500 ${hoveredCard === cardId ? 'opacity-100' : 'opacity-0'}`}></div>
      
      <div className="relative p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-lg text-gray-900">{title}</h3>
          <div className={`w-10 h-10 bg-gradient-to-r ${gradient} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
            {icon}
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="flex justify-between items-end">
            <span className={`text-4xl font-bold bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>
              {usage.current || 0}
            </span>
            <span className="text-xl font-medium text-gray-400">
              / {usage.limit === -1 ? '∞' : (usage.limit || 0)}
            </span>
          </div>
          
          <div className="relative">
            <div className="w-full bg-gray-200 rounded-full h-3 shadow-inner">
              <div 
                className={`h-3 rounded-full bg-gradient-to-r ${getProgressBarColor(usage?.percentage || 0)} shadow-lg transition-all duration-1000 ease-out`}
                style={{ 
                  width: `${Math.min(usage?.percentage || 0, 100)}%`,
                  boxShadow: `0 0 10px ${color}`
                }}
              ></div>
            </div>
            <div className="absolute -top-8 left-0 text-xs font-medium text-gray-500">
              {Math.round(usage?.percentage || 0)}% used
            </div>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 font-medium">Usage</span>
            <span className={`font-bold ${color}`}>
              {usage?.remaining === 'Unlimited' || usage?.limit === -1 ? '∞' : (usage?.remaining || 0)} remaining
            </span>
          </div>
        </div>
      </div>
    </div>
  );
});

UsageCard.displayName = 'UsageCard';

// Memoized Usage Analytics Section
const UsageAnalytics = React.memo(({ 
  usage, 
  animateCards, 
  hoveredCard, 
  setHoveredCard, 
  getProgressBarColor 
}) => {
  if (!usage) return null;

  return (
    <div className={`mb-8 transform transition-all duration-1000 delay-400 ${animateCards ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
      <div className="mb-6">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2z" />
            </svg>
          </div>
          Usage Analytics
        </h2>
        <p className="text-gray-600 mt-2 ml-11">Monitor your current usage across all features</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {usage.members && (
          <UsageCard
            title="Members"
            icon={
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857" />
              </svg>
            }
            usage={usage.members}
            gradient="from-blue-500 to-indigo-600"
            color="text-blue-600"
            hoveredCard={hoveredCard}
            cardId="members"
            onHover={setHoveredCard}
            getProgressBarColor={getProgressBarColor}
          />
        )}

        {usage.whatsappReminders && (
          <UsageCard
            title="WhatsApp"
            icon={
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12V9a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-1a2 2 0 00-2-2H6a2 2 0 00-2 2v1a2 2 0 002 2z" />
              </svg>
            }
            usage={usage.whatsappReminders}
            gradient="from-green-500 to-emerald-600"
            color="text-green-600"
            hoveredCard={hoveredCard}
            cardId="whatsapp"
            onHover={setHoveredCard}
            getProgressBarColor={getProgressBarColor}
          />
        )}

        {usage.analyticsViews && (
          <UsageCard
            title="Analytics"
            icon={
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2z" />
              </svg>
            }
            usage={usage.analyticsViews}
            gradient="from-purple-500 to-pink-600"
            color="text-purple-600"
            hoveredCard={hoveredCard}
            cardId="analytics"
            onHover={setHoveredCard}
            getProgressBarColor={getProgressBarColor}
          />
        )}
      </div>
    </div>
  );
});

UsageAnalytics.displayName = 'UsageAnalytics';
// Memoized Billing Toggle Component
const BillingToggle = React.memo(({ selectedBilling, onBillingChange }) => {
  const handleMonthly = useCallback(() => {
    onBillingChange('monthly');
  }, [onBillingChange]);

  const handleYearly = useCallback(() => {
    onBillingChange('yearly');
  }, [onBillingChange]);

  return (
    <div className="relative bg-gradient-to-r from-gray-100 to-gray-200 rounded-2xl p-1 shadow-inner">
      <div className="flex">
        <button 
          onClick={handleMonthly} 
          className={`relative px-6 py-3 text-sm font-medium rounded-xl transition-all duration-300 ${
            selectedBilling === 'monthly' 
              ? 'bg-white text-gray-900 shadow-lg transform scale-105' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Monthly
        </button>
        <button 
          onClick={handleYearly} 
          className={`relative px-6 py-3 text-sm font-medium rounded-xl transition-all duration-300 ${
            selectedBilling === 'yearly' 
              ? 'bg-white text-gray-900 shadow-lg transform scale-105' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Yearly
          <span className="ml-2 px-2 py-1 bg-gradient-to-r from-green-400 to-emerald-500 text-white text-xs rounded-full shadow-sm">
            Save 20%
          </span>
        </button>
      </div>
    </div>
  );
});

BillingToggle.displayName = 'BillingToggle';

// Memoized Plan Limit Item Component
const PlanLimitItem = React.memo(({ label, value, gradient }) => (
  <div className={`flex justify-between items-center p-3 bg-gradient-to-r ${gradient} rounded-xl`}>
    <span className="text-gray-700 font-medium">{label}</span>
    <span className="font-bold text-blue-600">
      {value === -1 ? 'Unlimited' : value.toLocaleString()}
    </span>
  </div>
));

PlanLimitItem.displayName = 'PlanLimitItem';

// Memoized Plan Limits Section
const PlanLimits = React.memo(({ limits }) => {
  if (!limits) return null;

  return (
    <div className="space-y-4 mb-8">
      <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
        <div className="w-5 h-5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        Plan Limits
      </h4>
      
      <div className="grid grid-cols-1 gap-3">
        {limits.members !== undefined && (
          <PlanLimitItem 
            label="Members" 
            value={limits.members} 
            gradient="from-blue-50 to-indigo-50" 
          />
        )}
        {limits.whatsappReminders !== undefined && (
          <PlanLimitItem 
            label="WhatsApp Reminders" 
            value={limits.whatsappReminders} 
            gradient="from-green-50 to-emerald-50" 
          />
        )}
        {limits.analyticsViews !== undefined && (
          <PlanLimitItem 
            label="Analytics Views" 
            value={limits.analyticsViews} 
            gradient="from-purple-50 to-pink-50" 
          />
        )}
      </div>
    </div>
  );
});

PlanLimits.displayName = 'PlanLimits';

// Memoized Plan Feature Item
const PlanFeatureItem = React.memo(({ feature, index }) => (
  <li className="flex items-start gap-3 group/feature">
    <div className="w-5 h-5 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 group-hover/feature:scale-110 transition-transform duration-200">
      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
      </svg>
    </div>
    <span className="text-gray-700 font-medium group-hover/feature:text-gray-900 transition-colors duration-200">
      {typeof feature === 'object' && feature.name ? feature.name : feature}
    </span>
  </li>
));

PlanFeatureItem.displayName = 'PlanFeatureItem';

// Memoized Plan Features Section
const PlanFeatures = React.memo(({ features }) => {
  if (!features || !Array.isArray(features)) return null;

  return (
    <div className="mb-8">
      <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
        <div className="w-5 h-5 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        Key Features
      </h4>
      <ul className="space-y-3">
        {features.slice(0, 4).map((feature, idx) => (
          <PlanFeatureItem key={idx} feature={feature} index={idx} />
        ))}
        {features.length > 4 && (
          <li className="text-gray-500 pl-8 text-sm font-medium">
            +{features.length - 4} more features
          </li>
        )}
      </ul>
    </div>
  );
});

PlanFeatures.displayName = 'PlanFeatures';

// Memoized Plan Action Button
const PlanActionButton = React.memo(({ 
  plan, 
  selectedPlan, 
  calculatingPrice, 
  onPlanSelect, 
  selectedBilling 
}) => {
  const handleClick = useCallback(() => {
    onPlanSelect(plan.id, selectedBilling);
  }, [plan.id, selectedBilling, onPlanSelect]);

  if (plan.current) {
    return (
      <div className="text-center py-4 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-600 rounded-xl text-lg font-bold">
        Current Plan
      </div>
    );
  }

  if (plan.canFitUsage === false) {
    return (
      <div className="text-center py-4 bg-gradient-to-r from-red-100 to-pink-100 text-red-600 rounded-xl text-sm font-medium">
        Cannot fit current usage
      </div>
    );
  }

  const isSelected = selectedPlan === plan.id;
  const isCalculating = calculatingPrice && isSelected;

  return (
    <button 
      onClick={handleClick} 
      disabled={isCalculating} 
      className={`group w-full py-4 rounded-xl text-lg font-bold transition-all duration-300 transform hover:scale-105 disabled:opacity-50 ${
        isSelected 
          ? 'bg-gradient-to-r from-purple-500 to-purple-700 text-white shadow-xl' 
          : 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 shadow-lg hover:shadow-xl'
      }`}
    >
      <div className="flex items-center justify-center gap-3">
        {isCalculating ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Calculating...
          </>
        ) : isSelected ? (
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Selected
          </>
        ) : (
          <>
            <svg className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
            Select Plan
          </>
        )}
      </div>
    </button>
  );
});

PlanActionButton.displayName = 'PlanActionButton';

// Memoized Plan Card Component
const PlanCard = React.memo(({ 
  plan, 
  index, 
  selectedPlan, 
  selectedBilling, 
  calculatingPrice,
  getPlanGradient,
  getPlanBorderGradient,
  formatCurrency,
  onPlanSelect
}) => {
  const isVisible = useFadeIn(index * 100);

  return (
    <div 
      className={`group relative transform transition-all duration-500 hover:scale-105 ${
        plan.current ? 'scale-105' : ''
      } ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
    >
      <div className={`absolute inset-0 bg-gradient-to-r ${getPlanBorderGradient(plan.id)} rounded-3xl blur-xl opacity-30 group-hover:opacity-60 transition-opacity duration-500`}></div>
      
      <div className={`relative bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border-2 overflow-hidden ${
        plan.current 
          ? 'border-blue-500 ring-4 ring-blue-100' 
          : selectedPlan === plan.id 
          ? 'border-purple-500 ring-4 ring-purple-100' 
          : 'border-gray-200 hover:border-gray-300'
      }`}>
        
        {plan.current && (
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
            <span className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
              Current Plan
            </span>
          </div>
        )}

        <div className={`bg-gradient-to-br ${getPlanGradient(plan.id)} p-8 text-white relative overflow-hidden`}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full transform translate-x-16 -translate-y-16"></div>
          <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/10 rounded-full transform -translate-x-10 translate-y-10"></div>
          
          <div className="relative text-center">
            <div className="w-16 h-16 bg-white/20 rounded-2xl mx-auto mb-4 flex items-center justify-center backdrop-blur-sm">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-2">{plan.name || 'Plan'}</h3>
            <div className="mb-3">
              <span className="text-4xl font-bold">
                {formatCurrency(selectedBilling === 'yearly' ? (plan.yearlyPrice || 0) : (plan.monthlyPrice || 0))}
              </span>
              <span className="text-lg opacity-90">
                /{selectedBilling === 'yearly' ? 'year' : 'month'}
              </span>
            </div>
            {selectedBilling === 'yearly' && plan.savings && (
              <p className="text-white/90 text-sm bg-white/20 rounded-full px-3 py-1 inline-block">
                {plan.savings}
              </p>
            )}
          </div>
        </div>

        <div className="p-8">
          <PlanLimits limits={plan.limits} />
          <PlanFeatures features={plan.features} />
          <div className="space-y-3">
            <PlanActionButton
              plan={plan}
              selectedPlan={selectedPlan}
              calculatingPrice={calculatingPrice}
              onPlanSelect={onPlanSelect}
              selectedBilling={selectedBilling}
            />
          </div>
        </div>
      </div>
    </div>
  );
});

PlanCard.displayName = 'PlanCard';

// Memoized Plans Comparison Section
const PlansComparison = React.memo(({ 
  plans, 
  animateCards, 
  selectedBilling, 
  selectedPlan,
  calculatingPrice,
  onBillingChange, 
  onPlanSelect,
  getPlanGradient,
  getPlanBorderGradient,
  formatCurrency
}) => {
  if (!plans || plans.length === 0) return null;

  return (
    <div className={`mb-8 transform transition-all duration-1000 delay-600 ${animateCards ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-purple-900 bg-clip-text text-transparent flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4" />
              </svg>
            </div>
            Available Plans
          </h2>
          <p className="text-gray-600 text-lg mt-2 ml-11">Compare plans and upgrade your subscription</p>
        </div>
        
        <BillingToggle 
          selectedBilling={selectedBilling} 
          onBillingChange={onBillingChange} 
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan, index) => (
          <PlanCard
            key={plan.id || index}
            plan={plan}
            index={index}
            selectedPlan={selectedPlan}
            selectedBilling={selectedBilling}
            calculatingPrice={calculatingPrice}
            getPlanGradient={getPlanGradient}
            getPlanBorderGradient={getPlanBorderGradient}
            formatCurrency={formatCurrency}
            onPlanSelect={onPlanSelect}
          />
        ))}
      </div>
    </div>
  );
});

PlansComparison.displayName = 'PlansComparison';
// Memoized Pricing Breakdown Item
const PricingBreakdownItem = React.memo(({ label, value, type = 'default', sublabel }) => {
  const bgClass = type === 'credit' ? 'from-green-50 to-emerald-50' : 'bg-white';
  const textClass = type === 'credit' ? 'text-green-700' : 'text-gray-700';
  const valueClass = type === 'credit' ? 'text-green-600' : type === 'total' ? 'bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent' : 'text-gray-900';

  return (
    <div className={`flex justify-between items-center p-4 bg-gradient-to-r ${bgClass} rounded-xl shadow-sm`}>
      <div>
        <span className={`${textClass} font-medium`}>{label}</span>
        {sublabel && <span className={`${textClass.replace('700', '600')} text-sm ml-2`}>{sublabel}</span>}
      </div>
      <span className={`font-bold ${type === 'total' ? 'text-2xl' : 'text-lg'} ${valueClass}`}>
        {value}
      </span>
    </div>
  );
});

PricingBreakdownItem.displayName = 'PricingBreakdownItem';

// Memoized Upgrade Calculator Component
const UpgradeCalculator = React.memo(({ 
  selectedPlan, 
  upgradeCalculation, 
  plans,
  animateCards, 
  processingUpgrade,
  formatCurrency,
  onUpgrade, 
  onCancelUpgrade 
}) => {
  const handleUpgrade = useCallback(() => {
    onUpgrade();
  }, [onUpgrade]);

  const handleCancel = useCallback(() => {
    onCancelUpgrade();
  }, [onCancelUpgrade]);

  if (!selectedPlan || !upgradeCalculation) return null;

  const selectedPlanName = plans.find(p => p.id === selectedPlan)?.name || 'Selected';

  return (
    <div className={`mb-8 transform transition-all duration-1000 delay-800 ${animateCards ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-400 via-pink-500 to-orange-500 rounded-3xl blur-xl opacity-40 group-hover:opacity-60 transition-opacity duration-500"></div>
        <div className="relative bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 p-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold">Upgrade to {selectedPlanName} Plan</h3>
                  <p className="text-white/90">Review your upgrade details and pricing</p>
                </div>
              </div>
              <button 
                onClick={handleCancel} 
                className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-110"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <div className="p-8">
            <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-6 mb-6">
              <h4 className="font-bold text-xl text-gray-900 mb-6 flex items-center gap-3">
                <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                Pricing Breakdown
              </h4>
              
              <div className="space-y-4">
                <PricingBreakdownItem
                  label={`${selectedPlanName} Plan`}
                  value={formatCurrency(upgradeCalculation.pricing?.originalPrice || 0)}
                  sublabel={`(${upgradeCalculation.billingType || 'monthly'})`}
                />
                
                {upgradeCalculation.pricing?.proratedDiscount > 0 && (
                  <PricingBreakdownItem
                    label="Credit for remaining days"
                    value={`-${formatCurrency(upgradeCalculation.pricing.proratedDiscount)}`}
                    sublabel={`(${upgradeCalculation.pricing?.daysLeft || 0} days)`}
                    type="credit"
                  />
                )}
                
                <div className="border-t-2 border-dashed border-gray-300 pt-4">
                  <PricingBreakdownItem
                    label="Total Amount"
                    value={formatCurrency(upgradeCalculation.pricing?.finalPrice || 0)}
                    type="total"
                  />
                </div>
                
                {upgradeCalculation.pricing?.savings > 0 && (
                  <div className="text-center">
                    <p className="text-green-600 font-medium bg-green-50 rounded-full px-4 py-2 inline-block">
                      You save {formatCurrency(upgradeCalculation.pricing.savings)}!
                    </p>
                  </div>
                )}
              </div>
            </div>

            <button 
              onClick={handleUpgrade} 
              disabled={processingUpgrade} 
              className="w-full bg-gradient-to-r from-purple-500 to-pink-600 text-white py-4 px-6 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50"
            >
              {processingUpgrade ? (
                <div className="flex items-center justify-center gap-3">
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Processing Payment...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-3">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span>Upgrade Now - Pay {formatCurrency(upgradeCalculation.pricing?.finalPrice || 0)}</span>
                </div>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

UpgradeCalculator.displayName = 'UpgradeCalculator';

// Memoized Help Section
const HelpSection = React.memo(({ animateCards }) => (
  <div className={`mb-8 transform transition-all duration-1000 delay-1000 ${animateCards ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
    <div className="relative group">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
      <div className="relative bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl p-8 text-white overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full transform translate-x-20 -translate-y-20"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full transform -translate-x-16 translate-y-16"></div>
        
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-2">Need Help?</h2>
              <p className="text-blue-100 text-lg mb-4">Contact our support team for assistance with your subscription.</p>
              <div className="flex gap-4">
                <button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105">
                  Chat Support
                </button>
                <button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105">
                  Email Support
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
));

HelpSection.displayName = 'HelpSection';

// Memoized Footer Info Item
const FooterInfoItem = React.memo(({ icon, title, items, align = 'left' }) => (
  <div className={`text-center ${align === 'left' ? 'md:text-left' : align === 'right' ? 'md:text-right' : ''}`}>
    <div className={`w-12 h-12 ${icon.gradient} rounded-2xl flex items-center justify-center ${align === 'left' ? 'mx-auto md:mx-0' : align === 'right' ? 'mx-auto md:ml-auto md:mr-0' : 'mx-auto'} mb-4`}>
      {icon.component}
    </div>
    <h3 className="font-bold text-xl text-gray-900 mb-3">{title}</h3>
    <div className="space-y-2 text-gray-600">
      {items.map((item, idx) => (
        <p key={idx} className={`flex items-center ${align === 'left' ? 'justify-center md:justify-start' : align === 'right' ? 'justify-center md:justify-end' : 'justify-center'} gap-2`}>
          <span className={`w-2 h-2 ${item.color} rounded-full`}></span>
          {item.text}
        </p>
      ))}
    </div>
  </div>
));

FooterInfoItem.displayName = 'FooterInfoItem';

// Memoized Footer Component
const Footer = React.memo(({ animateCards }) => {
  const footerSections = useMemo(() => [
    {
      icon: {
        gradient: 'bg-gradient-to-r from-blue-500 to-purple-600',
        component: (
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
        )
      },
      title: 'Billing Information',
      align: 'left',
      items: [
        { text: 'Payments processed securely', color: 'bg-green-500' },
        { text: 'Auto-renewal enabled', color: 'bg-blue-500' },
        { text: 'Cancel anytime', color: 'bg-purple-500' }
      ]
    },
    {
      icon: {
        gradient: 'bg-gradient-to-r from-green-500 to-emerald-600',
        component: (
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      },
      title: 'Plan Benefits',
      align: 'center',
      items: [
        { text: '24/7 customer support', color: 'bg-green-500' },
        { text: 'Regular feature updates', color: 'bg-blue-500' },
        { text: 'Data backup included', color: 'bg-purple-500' }
      ]
    },
    {
      icon: {
        gradient: 'bg-gradient-to-r from-purple-500 to-pink-600',
        component: (
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        )
      },
      title: 'Security',
      align: 'right',
      items: [
        { text: 'SSL encrypted', color: 'bg-green-500' },
        { text: 'PCI DSS compliant', color: 'bg-blue-500' },
        { text: 'Regular audits', color: 'bg-purple-500' }
      ]
    }
  ], []);

  return (
    <div className={`bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-8 transform transition-all duration-1000 delay-1200 ${animateCards ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {footerSections.map((section, idx) => (
          <FooterInfoItem key={idx} {...section} />
        ))}
      </div>
      
      <div className="border-t border-gray-200 mt-8 pt-6">
        <p className="text-center text-gray-500 flex items-center justify-center gap-2">
          <span className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-pulse"></span>
          Last updated: {new Date().toLocaleDateString()} • Need help? Contact support@gymmanager.com
          <span className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full animate-pulse"></span>
        </p>
      </div>
    </div>
  );
});

Footer.displayName = 'Footer';

// Main Component with ALL optimizations
const SubscriptionUI = ({
  subscription, currentPlan, usage, billing, plans, upgradeCalculation,
  loading, error, refreshing, selectedPlan, selectedBilling, calculatingPrice, processingUpgrade,
  currentPlanFeatures, usageWarnings, daysUntilBilling, hasActiveSubscription,
  onRefresh, onPlanSelect, onUpgrade, onBillingChange, onClearError, onCancelUpgrade
}) => {
  const { animateCards, hoveredCard, setHoveredCard } = useAnimationState();
  const { formatCurrency, getProgressBarColor, getPlanGradient, getPlanBorderGradient } = useUtilities();

  // Memoize safe data extractors
  const safeCurrentPlanFeatures = useMemo(() => 
    Array.isArray(currentPlanFeatures) ? currentPlanFeatures : [], 
    [currentPlanFeatures]
  );
  
  const safeUsageWarnings = useMemo(() => 
    Array.isArray(usageWarnings) ? usageWarnings : [], 
    [usageWarnings]
  );
  
  const safePlans = useMemo(() => 
    Array.isArray(plans) ? plans : [], 
    [plans]
  );

  // Memoize all event handlers
  const handleRefresh = useCallback(() => onRefresh(), [onRefresh]);
  const handlePlanSelect = useCallback((planId, billing) => onPlanSelect(planId, billing), [onPlanSelect]);
  const handleUpgrade = useCallback(() => onUpgrade(), [onUpgrade]);
  const handleBillingChange = useCallback((billing) => onBillingChange(billing), [onBillingChange]);
  const handleClearError = useCallback(() => onClearError(), [onClearError]);
  const handleCancelUpgrade = useCallback(() => onCancelUpgrade(), [onCancelUpgrade]);

  if (loading) return <LoadingState />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      <BackgroundElements />

      <div className="relative max-w-7xl mx-auto px-4 py-8">
        <SubscriptionHeader refreshing={refreshing} onRefresh={handleRefresh} animateCards={animateCards} />
        <ErrorBanner error={error} onClearError={handleClearError} />
        <WarningsList warnings={safeUsageWarnings} />
        
        <CurrentPlanOverview
          subscription={subscription}
          currentPlan={currentPlan}
          billing={billing}
          currentPlanFeatures={safeCurrentPlanFeatures}
          hasActiveSubscription={hasActiveSubscription}
          daysUntilBilling={daysUntilBilling}
          animateCards={animateCards}
          getPlanGradient={getPlanGradient}
          formatCurrency={formatCurrency}
        />

        <UsageAnalytics
          usage={usage}
          animateCards={animateCards}
          hoveredCard={hoveredCard}
          setHoveredCard={setHoveredCard}
          getProgressBarColor={getProgressBarColor}
        />

        <PlansComparison
          plans={safePlans}
          animateCards={animateCards}
          selectedBilling={selectedBilling}
          selectedPlan={selectedPlan}
          calculatingPrice={calculatingPrice}
          onBillingChange={handleBillingChange}
          onPlanSelect={handlePlanSelect}
          getPlanGradient={getPlanGradient}
          getPlanBorderGradient={getPlanBorderGradient}
          formatCurrency={formatCurrency}
        />

        <UpgradeCalculator
          selectedPlan={selectedPlan}
          upgradeCalculation={upgradeCalculation}
          plans={safePlans}
          animateCards={animateCards}
          processingUpgrade={processingUpgrade}
          formatCurrency={formatCurrency}
          onUpgrade={handleUpgrade}
          onCancelUpgrade={handleCancelUpgrade}
        />

        <HelpSection animateCards={animateCards} />
        <Footer animateCards={animateCards} />
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default React.memo(SubscriptionUI);