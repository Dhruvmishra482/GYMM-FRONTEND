// import React, { useState, useEffect } from 'react';
// import { Lock, Eye, EyeOff, Shield, Crown, CheckCircle, Loader2, AlertCircle, Dumbbell } from 'lucide-react';

// const ResetPasswordUI = ({ 
//   formData,
//   setFormData,
//   showPassword,
//   setShowPassword,
//   showConfirmPassword,
//   setShowConfirmPassword,
//   onSubmit,
//   onGoToLogin,
//   isLoading,
//   error,
//   success,
//   message,
//   validationErrors
// }) => {
//   const [mounted, setMounted] = useState(false);

//   useEffect(() => {
//     setMounted(true);
//   }, []);

//   const handleInputChange = (field, value) => {
//     setFormData(prev => ({
//       ...prev,
//       [field]: value
//     }));
//   };

//   const getPasswordStrength = (password) => {
//     if (!password) return { strength: 0, text: '', color: '' };
    
//     let strength = 0;
//     if (password.length >= 6) strength += 1;
//     if (password.length >= 8) strength += 1;
//     if (/[A-Z]/.test(password)) strength += 1;
//     if (/[a-z]/.test(password)) strength += 1;
//     if (/[0-9]/.test(password)) strength += 1;
//     if (/[^A-Za-z0-9]/.test(password)) strength += 1;

//     if (strength <= 2) return { strength, text: 'Weak', color: 'text-red-600' };
//     if (strength <= 4) return { strength, text: 'Medium', color: 'text-yellow-600' };
//     return { strength, text: 'Strong', color: 'text-green-600' };
//   };

//   const passwordStrength = getPasswordStrength(formData.newPassword);
//   const passwordsMatch = formData.newPassword === formData.confirmPassword && formData.confirmPassword;

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
//           <p className="text-gray-600 text-sm">Create a new password</p>
//         </div>

//         {/* Main Form Card */}
//         <div className="bg-white rounded-xl shadow-lg border border-blue-100 overflow-hidden hover:shadow-xl transition-all duration-300">
//           <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 text-white">
//             <div className="flex items-center gap-3">
//               <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
//                 <Shield className="h-4 w-4 text-white" />
//               </div>
//               <div>
//                 <h2 className="font-semibold">Reset Password</h2>
//                 <p className="text-green-100 text-sm">Create a secure new password</p>
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
//                 <h3 className="text-lg font-semibold text-gray-900 mb-2">Password Reset Successful!</h3>
//                 <p className="text-gray-600 mb-6">{message}</p>
//                 <button
//                   onClick={onGoToLogin}
//                   className="w-full bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 hover:scale-105 flex items-center justify-center gap-2"
//                 >
//                   <Lock className="w-5 h-5" />
//                   Go to Login
//                 </button>
//               </div>
//             ) : (
//               <div className="space-y-6">
//                 <div className="text-center mb-6">
//                   <h3 className="text-lg font-semibold text-gray-900 mb-2">Create New Password</h3>
//                   <p className="text-gray-600 text-sm">
//                     Choose a strong password to secure your account
//                   </p>
//                 </div>

//                 {/* Error Messages */}
//                 {(error || (validationErrors && validationErrors.length > 0)) && (
//                   <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-lg p-4 animate-in slide-in-from-top-2 duration-300">
//                     <div className="flex items-start gap-3">
//                       <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
//                       <div>
//                         {error && <p className="text-sm text-red-700">{error}</p>}
//                         {validationErrors && validationErrors.length > 0 && (
//                           <ul className="mt-2 list-disc list-inside text-sm text-red-700">
//                             {validationErrors.map((err, index) => (
//                               <li key={index}>{err.msg}</li>
//                             ))}
//                           </ul>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 )}

//                 <form onSubmit={onSubmit} className="space-y-6">
//                   {/* New Password Input */}
//                   <div>
//                     <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
//                       <Lock className="w-4 h-4 text-green-500" />
//                       New Password
//                     </label>
//                     <div className="relative">
//                       <input
//                         type={showPassword ? "text" : "password"}
//                         value={formData.newPassword}
//                         onChange={(e) => handleInputChange('newPassword', e.target.value)}
//                         className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 hover:border-green-400 hover:shadow-sm"
//                         placeholder="Enter new password"
//                         required
//                         disabled={isLoading}
//                         minLength="6"
//                       />
//                       <button
//                         type="button"
//                         onClick={() => setShowPassword(!showPassword)}
//                         className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-green-500 transition-colors"
//                       >
//                         {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
//                       </button>
//                       {formData.newPassword && passwordStrength.strength > 2 && (
//                         <div className="absolute -top-2 right-10 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center animate-in zoom-in-50 duration-300">
//                           <CheckCircle className="w-3 h-3 text-white" />
//                         </div>
//                       )}
//                     </div>
                    
//                     {/* Password Strength */}
//                     {formData.newPassword && (
//                       <div className="mt-2 animate-in slide-in-from-top-1 duration-300">
//                         <div className="flex items-center justify-between mb-1">
//                           <span className="text-xs text-gray-500">Password strength:</span>
//                           <span className={`text-xs font-medium ${passwordStrength.color}`}>
//                             {passwordStrength.text}
//                           </span>
//                         </div>
//                         <div className="w-full bg-gray-200 rounded-full h-2">
//                           <div 
//                             className={`h-2 rounded-full transition-all duration-500 ${
//                               passwordStrength.strength <= 2 ? 'bg-red-500' : 
//                               passwordStrength.strength <= 4 ? 'bg-yellow-500' : 'bg-green-500'
//                             }`}
//                             style={{ width: `${(passwordStrength.strength / 6) * 100}%` }}
//                           ></div>
//                         </div>
//                       </div>
//                     )}
//                   </div>

//                   {/* Confirm Password Input */}
//                   <div>
//                     <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
//                       <CheckCircle className="w-4 h-4 text-emerald-500" />
//                       Confirm New Password
//                     </label>
//                     <div className="relative">
//                       <input
//                         type={showConfirmPassword ? "text" : "password"}
//                         value={formData.confirmPassword}
//                         onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
//                         className={`
//                           w-full px-4 py-3 pr-12 border rounded-lg transition-all duration-200 hover:shadow-sm
//                           ${passwordsMatch 
//                             ? 'border-green-500 ring-2 ring-green-500 ring-opacity-20' 
//                             : formData.confirmPassword && formData.newPassword !== formData.confirmPassword
//                             ? 'border-red-500 ring-2 ring-red-500 ring-opacity-20'
//                             : 'border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500'
//                           }
//                         `}
//                         placeholder="Confirm new password"
//                         required
//                         disabled={isLoading}
//                       />
//                       <button
//                         type="button"
//                         onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                         className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-emerald-500 transition-colors"
//                       >
//                         {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
//                       </button>
//                       {passwordsMatch && (
//                         <div className="absolute -top-2 right-10 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center animate-in zoom-in-50 duration-300">
//                           <CheckCircle className="w-3 h-3 text-white" />
//                         </div>
//                       )}
//                     </div>
                    
//                     {formData.confirmPassword && (
//                       <div className="mt-2 animate-in slide-in-from-top-1 duration-300">
//                         {passwordsMatch ? (
//                           <div className="flex items-center text-green-600 text-sm">
//                             <CheckCircle className="h-4 w-4 mr-2" />
//                             Passwords match
//                           </div>
//                         ) : (
//                           <div className="flex items-center text-red-600 text-sm">
//                             <AlertCircle className="h-4 w-4 mr-2" />
//                             Passwords don't match
//                           </div>
//                         )}
//                       </div>
//                     )}
//                   </div>

//                   {/* Submit Button */}
//                   <button
//                     type="submit"
//                     disabled={isLoading || !passwordsMatch}
//                     className={`
//                       w-full py-4 px-6 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-3
//                       ${isLoading || !passwordsMatch
//                         ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
//                         : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white hover:shadow-lg hover:scale-105 active:scale-95'
//                       }
//                     `}
//                   >
//                     {isLoading ? (
//                       <>
//                         <Loader2 className="w-5 h-5 animate-spin" />
//                         Resetting Password...
//                       </>
//                     ) : (
//                       <>
//                         <Shield className="w-5 h-5" />
//                         Reset Password
//                       </>
//                     )}
//                   </button>
//                 </form>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Password Requirements Card */}
//         {!success && (
//           <div className="mt-6 bg-gradient-to-r from-white to-blue-50 rounded-lg p-4 border border-blue-100">
//             <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
//               <Dumbbell className="w-4 h-4 text-blue-600" />
//               Password Requirements
//             </h4>
//             <div className="text-sm text-gray-600 space-y-1">
//               <p>• At least 6 characters long</p>
//               <p>• Mix of uppercase and lowercase letters</p>
//               <p>• Include numbers and special characters</p>
//             </div>
//           </div>
//         )}
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

// export default ResetPasswordUI;
import React, { useState, useEffect } from 'react';
import { Lock, Eye, EyeOff, Shield, CheckCircle, Loader2, AlertCircle } from 'lucide-react';

const ResetPasswordUI = () => {
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, text: '', color: '' };
    
    let strength = 0;
    if (password.length >= 6) strength += 1;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;

    if (strength <= 2) return { strength, text: 'Weak', color: 'text-red-400' };
    if (strength <= 4) return { strength, text: 'Medium', color: 'text-yellow-400' };
    return { strength, text: 'Strong', color: 'text-green-400' };
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      if (formData.newPassword.length < 6) {
        setError('Password must be at least 6 characters long');
        setIsLoading(false);
      } else if (formData.newPassword !== formData.confirmPassword) {
        setError('Passwords do not match');
        setIsLoading(false);
      } else {
        setSuccess(true);
        setIsLoading(false);
      }
    }, 1500);
  };

  const handleGoToLogin = () => {
    setFormData({ newPassword: '', confirmPassword: '' });
    setError('');
    setSuccess(false);
  };

  const passwordStrength = getPasswordStrength(formData.newPassword);
  const passwordsMatch = formData.newPassword === formData.confirmPassword && formData.confirmPassword;

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
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-8 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-500/20 animate-pulse"></div>
            
            <div className="relative z-10 text-center">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold tracking-wide uppercase mb-2">Reset Password</h2>
              <p className="text-green-100 text-sm">Create a secure new password</p>
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
                  Password Reset Successful!
                </h3>
                <p className="text-slate-300 mb-6 leading-relaxed">
                  Your password has been successfully reset. You can now login with your new password.
                </p>
                
                <button
                  onClick={handleGoToLogin}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-green-500/50 hover:scale-105 active:scale-95 flex items-center justify-center gap-2 uppercase tracking-wider"
                >
                  <Lock className="w-5 h-5" />
                  Go to Login
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

                {/* New Password Input */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-3 uppercase tracking-wide">
                    <Lock className="w-4 h-4 text-green-400" />
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={formData.newPassword}
                      onChange={(e) => handleInputChange('newPassword', e.target.value)}
                      className="w-full px-4 py-3 pr-12 bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 hover:border-green-400/50 hover:shadow-lg hover:shadow-green-500/10"
                      placeholder="Enter new password"
                      required
                      disabled={isLoading}
                      minLength="6"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-green-400 transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                    {formData.newPassword && passwordStrength.strength > 2 && (
                      <div className="absolute -top-2 right-10 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center animate-in zoom-in-50 duration-300 shadow-lg shadow-green-500/50">
                        <CheckCircle className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>
                  
                  {/* Password Strength */}
                  {formData.newPassword && (
                    <div className="mt-3 animate-in slide-in-from-top-1 duration-300">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-slate-400 uppercase tracking-wide">Password strength:</span>
                        <span className={`text-xs font-medium ${passwordStrength.color}`}>
                          {passwordStrength.text}
                        </span>
                      </div>
                      <div className="w-full bg-slate-900/50 rounded-full h-2 border border-white/10">
                        <div 
                          className={`h-full rounded-full transition-all duration-500 ${
                            passwordStrength.strength <= 2 ? 'bg-red-500' : 
                            passwordStrength.strength <= 4 ? 'bg-yellow-500' : 'bg-green-500'
                          }`}
                          style={{ width: `${(passwordStrength.strength / 6) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Confirm Password Input */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-3 uppercase tracking-wide">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      className={`
                        w-full px-4 py-3 pr-12 bg-slate-900/50 backdrop-blur-sm rounded-lg text-white placeholder-slate-500 transition-all duration-200 hover:shadow-lg
                        ${passwordsMatch 
                          ? 'border-2 border-green-500 ring-2 ring-green-500/20 shadow-green-500/10' 
                          : formData.confirmPassword && formData.newPassword !== formData.confirmPassword
                          ? 'border-2 border-red-500 ring-2 ring-red-500/20 shadow-red-500/10'
                          : 'border border-white/10 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 hover:border-emerald-400/50'
                        }
                      `}
                      placeholder="Confirm new password"
                      required
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-emerald-400 transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                    {passwordsMatch && (
                      <div className="absolute -top-2 right-10 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center animate-in zoom-in-50 duration-300 shadow-lg shadow-green-500/50">
                        <CheckCircle className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>
                  
                  {formData.confirmPassword && (
                    <div className="mt-3 animate-in slide-in-from-top-1 duration-300">
                      {passwordsMatch ? (
                        <div className="flex items-center text-green-400 text-sm">
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Passwords match
                        </div>
                      ) : (
                        <div className="flex items-center text-red-400 text-sm">
                          <AlertCircle className="h-4 w-4 mr-2" />
                          Passwords don't match
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  onClick={handleSubmit}
                  disabled={isLoading || !passwordsMatch}
                  className={`
                    w-full py-4 px-6 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-3 uppercase tracking-wider
                    ${isLoading || !passwordsMatch
                      ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white hover:shadow-lg hover:shadow-green-500/50 hover:scale-105 active:scale-95'
                    }
                  `}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Resetting Password...
                    </>
                  ) : (
                    <>
                      <Shield className="w-5 h-5" />
                      Reset Password
                    </>
                  )}
                </button>

                {/* Password Requirements */}
                <div className="mt-6 bg-slate-900/50 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                  <h4 className="font-semibold text-cyan-100 mb-3 flex items-center gap-2 uppercase tracking-wide text-sm">
                    <Shield className="w-4 h-4 text-cyan-400" />
                    Password Requirements
                  </h4>
                  <div className="text-sm text-slate-400 space-y-1.5">
                    <p>• At least 6 characters long</p>
                    <p>• Mix of uppercase and lowercase letters</p>
                    <p>• Include numbers and special characters</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordUI;