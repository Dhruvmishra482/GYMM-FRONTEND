// import React, { useState, useEffect } from 'react';
// import { Mail, ArrowLeft, Shield, Crown, Loader2, CheckCircle, AlertCircle, Dumbbell } from 'lucide-react';

// const ForgotPasswordUI = ({ 
//   email, 
//   setEmail, 
//   onSubmit, 
//   onBackToLogin,
//   isLoading, 
//   error, 
//   success, 
//   message 
// }) => {
//   const [mounted, setMounted] = useState(false);

//   useEffect(() => {
//     setMounted(true);
//   }, []);

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-6 relative overflow-hidden">
//       {/* Animated Background Elements */}
//       <div className="absolute inset-0 pointer-events-none">
//         <div className="absolute top-20 left-20 w-32 h-32 bg-blue-200/30 rounded-full animate-pulse"></div>
//         <div className="absolute top-40 right-32 w-24 h-24 bg-purple-200/40 rounded-full animate-bounce animation-delay-1000"></div>
//         <div className="absolute bottom-32 left-40 w-40 h-40 bg-indigo-200/20 rounded-full animate-pulse animation-delay-2000"></div>
//         <div className="absolute bottom-20 right-20 w-28 h-28 bg-blue-300/30 rounded-full animate-bounce animation-delay-3000"></div>
//       </div>

//       {/* Main Container */}
//       <div className={`
//         w-full max-w-md transform transition-all duration-1000 
//         ${mounted ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-10 opacity-0 scale-95'}
//       `}>
        
//         {/* Header Card */}
//         <div className="bg-gradient-to-r from-white to-blue-50 rounded-xl shadow-md border border-blue-100 p-6 mb-6 text-center hover:shadow-lg transition-all duration-300">
//           <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg hover:scale-110 transition-transform duration-300">
//             <Crown className="w-8 h-8 text-white" />
//           </div>
//           <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
//             Iron Throne Gym
//           </h1>
//           <p className="text-gray-600 text-sm">Reset your password</p>
//         </div>

//         {/* Main Form Card */}
//         <div className="bg-white rounded-xl shadow-lg border border-blue-100 overflow-hidden hover:shadow-xl transition-all duration-300">
//           <div className="bg-gradient-to-r from-orange-500 to-red-600 p-6 text-white">
//             <div className="flex items-center gap-3">
//               <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
//                 <Shield className="h-4 w-4 text-white" />
//               </div>
//               <div>
//                 <h2 className="font-semibold">Forgot Password</h2>
//                 <p className="text-orange-100 text-sm">We'll help you recover your account</p>
//               </div>
//             </div>
//           </div>

//           <div className="p-6">
//             {/* Success State */}
//             {success ? (
//               <div className="text-center animate-in fade-in duration-500">
//                 <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                   <CheckCircle className="h-8 w-8 text-green-600" />
//                 </div>
//                 <h3 className="text-lg font-semibold text-gray-900 mb-2">
//                   Check Your Email
//                 </h3>
//                 <p className="text-gray-600 mb-6">
//                   {message || "We've sent a password reset link to your email address. Please check your inbox and follow the instructions."}
//                 </p>
//                 <div className="bg-gradient-to-r from-blue-50 to-green-50 p-4 rounded-lg border border-green-200">
//                   <p className="text-sm text-gray-600">
//                     Didn't receive the email? Check your spam folder or try again.
//                   </p>
//                 </div>
//               </div>
//             ) : (
//               <div className="space-y-6">
//                 <div className="text-center mb-6">
//                   <h3 className="text-lg font-semibold text-gray-900 mb-2">Reset Your Password</h3>
//                   <p className="text-gray-600 text-sm">
//                     Enter your email address and we'll send you a link to reset your password
//                   </p>
//                 </div>

//                 {/* Error Message */}
//                 {error && (
//                   <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-lg p-4 animate-in slide-in-from-top-2 duration-300">
//                     <div className="flex items-center gap-3">
//                       <AlertCircle className="h-5 w-5 text-red-600" />
//                       <p className="text-sm text-red-700">{error}</p>
//                     </div>
//                   </div>
//                 )}

//                 <form onSubmit={onSubmit} className="space-y-6">
//                   {/* Email Input */}
//                   <div>
//                     <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
//                       <Mail className="w-4 h-4 text-orange-500" />
//                       Email Address
//                     </label>
//                     <div className="relative">
//                       <input
//                         type="email"
//                         value={email}
//                         onChange={(e) => setEmail(e.target.value)}
//                         className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 hover:border-orange-400 hover:shadow-sm"
//                         placeholder="Enter your email address"
//                         required
//                         disabled={isLoading}
//                       />
//                       {email && (
//                         <div className="absolute -top-2 right-2 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center animate-in zoom-in-50 duration-300">
//                           <Mail className="w-3 h-3 text-white" />
//                         </div>
//                       )}
//                     </div>
//                   </div>

//                   {/* Submit Button */}
//                   <button
//                     type="submit"
//                     disabled={isLoading}
//                     className={`
//                       w-full py-4 px-6 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-3
//                       ${isLoading
//                         ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
//                         : 'bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white hover:shadow-lg hover:scale-105 active:scale-95'
//                       }
//                     `}
//                   >
//                     {isLoading ? (
//                       <>
//                         <Loader2 className="w-5 h-5 animate-spin" />
//                         Sending Reset Link...
//                       </>
//                     ) : (
//                       <>
//                         <Mail className="w-5 h-5" />
//                         Send Reset Link
//                       </>
//                     )}
//                   </button>
//                 </form>
//               </div>
//             )}

//             {/* Back to Login */}
//             <div className="mt-6 pt-6 border-t border-gray-200">
//               <button
//                 onClick={onBackToLogin}
//                 className="w-full flex items-center justify-center gap-2 text-blue-600 hover:text-blue-700 transition-colors group"
//               >
//                 <ArrowLeft className="h-4 w-4 transform group-hover:-translate-x-1 transition-transform duration-200" />
//                 Back to Login
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Help Card */}
//         <div className="mt-6 bg-gradient-to-r from-white to-purple-50 rounded-lg p-4 border border-purple-100">
//           <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
//             <Dumbbell className="w-4 h-4 text-purple-600" />
//             Need Help?
//           </h4>
//           <p className="text-sm text-gray-600">
//             Contact our support team if you continue to have issues accessing your account.
//           </p>
//         </div>
//       </div>

//       <style jsx>{`
//         .animation-delay-1000 {
//           animation-delay: 1s;
//         }
//         .animation-delay-2000 {
//           animation-delay: 2s;
//         }
//         .animation-delay-3000 {
//           animation-delay: 3s;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default ForgotPasswordUI;
import React, { useState, useEffect } from 'react';
import { Mail, ArrowLeft, Shield, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

const ForgotPasswordUI = () => {
  const [mounted, setMounted] = useState(false);
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      if (email.includes('@')) {
        setSuccess(true);
      } else {
        setError('Please enter a valid email address');
      }
      setIsLoading(false);
    }, 1500);
  };

  const handleBackToLogin = () => {
    setEmail('');
    setError('');
    setSuccess(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-32 h-32 bg-cyan-500/10 rounded-full animate-pulse blur-xl"></div>
        <div className="absolute top-40 right-32 w-24 h-24 bg-blue-500/10 rounded-full animate-pulse blur-xl" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-32 left-40 w-40 h-40 bg-indigo-500/10 rounded-full animate-pulse blur-xl" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-20 right-20 w-28 h-28 bg-cyan-400/10 rounded-full animate-pulse blur-xl" style={{animationDelay: '3s'}}></div>
      </div>

      {/* Main Card Container */}
      <div className={`
        w-full max-w-md transform transition-all duration-1000 relative z-10
        ${mounted ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-10 opacity-0 scale-95'}
      `}>
        
        {/* Single Main Card */}
        <div className="bg-slate-800/50 backdrop-blur-lg rounded-xl shadow-2xl border border-white/15 overflow-hidden hover:shadow-cyan-500/30 transition-all duration-300">
          
          {/* Header Section */}
          <div className="bg-gradient-to-r from-cyan-600 to-blue-600 p-8 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 animate-pulse"></div>
            
            <div className="relative z-10 text-center">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold tracking-wide uppercase mb-2">Forgot Password</h2>
              <p className="text-cyan-100 text-sm">Enter your email to reset your password</p>
            </div>
          </div>

          {/* Body Section */}
          <div className="p-8">
            {/* Success State */}
            {success ? (
              <div className="text-center animate-in fade-in duration-500">
                <div className="w-20 h-20 bg-green-500/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-6 border border-green-400/30">
                  <CheckCircle className="h-10 w-10 text-green-400" />
                </div>
                <h3 className="text-xl font-semibold text-cyan-100 mb-3">
                  Check Your Email
                </h3>
                <p className="text-slate-300 mb-6 leading-relaxed">
                  We've sent a password reset link to your email address. Please check your inbox and follow the instructions.
                </p>
                <div className="bg-slate-900/50 backdrop-blur-sm p-4 rounded-lg border border-green-500/20 mb-6">
                  <p className="text-sm text-slate-400">
                    Didn't receive the email? Check your spam folder or try again.
                  </p>
                </div>

                {/* Back to Login Button */}
                <button
                  onClick={handleBackToLogin}
                  className="w-full flex items-center justify-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors group py-3"
                >
                  <ArrowLeft className="h-4 w-4 transform group-hover:-translate-x-1 transition-transform duration-200" />
                  Back to Login
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Error Message */}
                {error && (
                  <div className="bg-red-500/10 backdrop-blur-sm border border-red-500/30 rounded-lg p-4 animate-in slide-in-from-top-2 duration-300">
                    <div className="flex items-center gap-3">
                      <AlertCircle className="h-5 w-5 text-red-400" />
                      <p className="text-sm text-red-300">{error}</p>
                    </div>
                  </div>
                )}

                {/* Email Input */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-3 uppercase tracking-wide">
                    <Mail className="w-4 h-4 text-cyan-400" />
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-200 hover:border-cyan-400/50 hover:shadow-lg hover:shadow-cyan-500/10"
                      placeholder="Enter your email address"
                      required
                      disabled={isLoading}
                    />
                    {email && (
                      <div className="absolute -top-2 right-2 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center animate-in zoom-in-50 duration-300 shadow-lg shadow-green-500/50">
                        <Mail className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className={`
                    w-full py-4 px-6 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-3 uppercase tracking-wider
                    ${isLoading
                      ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white hover:shadow-lg hover:shadow-cyan-500/50 hover:scale-105 active:scale-95'
                    }
                  `}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Sending Reset Link...
                    </>
                  ) : (
                    <>
                      <Mail className="w-5 h-5" />
                      Send Reset Link
                    </>
                  )}
                </button>

                {/* Back to Login Link */}
                <div className="pt-4 border-t border-white/10">
                  <button
                    onClick={handleBackToLogin}
                    className="w-full flex items-center justify-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors group py-2"
                  >
                    <ArrowLeft className="h-4 w-4 transform group-hover:-translate-x-1 transition-transform duration-200" />
                    Back to Login
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Help Text Below */}
        <div className="mt-6 text-center">
          <p className="text-sm text-slate-400">
            Need help? Contact our support team for assistance
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordUI;