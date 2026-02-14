// DietPlanDisplay.jsx
import React from 'react';
import { Award, CalendarDays, Soup, Target, Droplet, Info, List, TrendingUp, HeartHandshake } from 'lucide-react'; // Icons for display

const DetailItem = ({ icon: Icon, label, value }) => (
  <div className="flex items-start space-x-3 p-3 bg-gray-800/60 rounded-lg border border-emerald-700/50 shadow-md">
    <Icon className="h-5 w-5 text-lime-400 flex-shrink-0 mt-0.5" />
    <div>
      <dt className="text-sm font-medium text-teal-200">{label}</dt>
      <dd className="mt-1 text-base text-white font-semibold">{value}</dd>
    </div>
  </div>
);

const SectionContainer = ({ title, children, icon: Icon }) => (
  <div className="bg-gray-800/60 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-emerald-700/50">
    <h3 className="flex items-center gap-3 text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-lime-300 mb-4 pb-3 border-b border-emerald-700/50">
      {Icon && <Icon className="h-6 w-6 text-lime-400" />}
      {title}
    </h3>
    {children}
  </div>
);

const DietPlanDisplay = ({ dietPlan }) => {
  if (!dietPlan) {
    return <div className="p-6 text-center text-teal-300">No diet plan data available.</div>;
  }

  const formatMealPlan = (mealPlan) => {
    if (typeof mealPlan !== 'object' || Object.keys(mealPlan).length === 0) {
      return "No detailed meal plan provided.";
    }
  
    return (
      <div className="space-y-3">
        {Object.entries(mealPlan).map(([mealType, items]) => (
          <div key={mealType} className="p-3 bg-gray-700/50 rounded-lg border border-emerald-600/50">
            <h4 className="text-md font-bold text-white capitalize mb-1">{mealType}</h4>
            {Array.isArray(items) ? (
              <ul className="list-disc list-inside text-teal-300 pl-2">
                {items.map((item, idx) => <li key={idx}><span className="text-white">{item}</span></li>)}
              </ul>
            ) : (
              <p className="text-teal-300"><span className="text-white">{String(items)}</span></p>
            )}
          </div>
        ))}
      </div>
    );
  };
  

  return (
    <div className="relative z-10 p-1 bg-gradient-to-br from-teal-800 to-lime-900 rounded-2xl shadow-2xl border border-emerald-700/50">
      <div className="relative bg-gray-900/90 backdrop-blur-md rounded-xl p-6 space-y-8 text-white">
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-lime-300 mb-6 pb-3 border-b border-emerald-700/50">
          {dietPlan.planTitle}
        </h2>

        <SectionContainer title="Plan Overview" icon={Info}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <DetailItem icon={Soup} label="Plan Type" value={dietPlan.planType || 'N/A'} />
            <DetailItem icon={Target} label="Target Audience" value={dietPlan.targetAudience || 'N/A'} />
            <DetailItem icon={CalendarDays} label="Plan Duration" value={dietPlan.planDuration || 'N/A'} />
            <DetailItem icon={Droplet} label="Water Intake" value={dietPlan.waterIntake || 'N/A'} />
            <DetailItem icon={CalendarDays} label="Created On" value={dietPlan.createdAt ? new Date(dietPlan.createdAt).toLocaleDateString() : 'N/A'} />
          </div>
        </SectionContainer>

        <SectionContainer title="Meal Plan Details" icon={List}>
          <div className="text-teal-300 text-sm whitespace-pre-wrap">
            {formatMealPlan(dietPlan.mealPlan)}
          </div>
        </SectionContainer>

        {dietPlan.generalInstructions && (
          <SectionContainer title="General Instructions" icon={Info}>
            <p className="text-teal-300 whitespace-pre-wrap">{dietPlan.generalInstructions}</p>
          </SectionContainer>
        )}

        {dietPlan.dosList && dietPlan.dosList.length > 0 && (
          <SectionContainer title="Dos" icon={CheckCircle}>
            <ul className="list-disc list-inside text-teal-300 pl-2 space-y-1">
              {dietPlan.dosList.map((item, index) => <li key={index}><span className="text-white">{item}</span></li>)}
            </ul>
          </SectionContainer>
        )}

        {dietPlan.dontsList && dietPlan.dontsList.length > 0 && (
          <SectionContainer title="Don'ts" icon={AlertCircle}>
            <ul className="list-disc list-inside text-teal-300 pl-2 space-y-1">
              {dietPlan.dontsList.map((item, index) => <li key={index}><span className="text-white">{item}</span></li>)}
            </ul>
          </SectionContainer>
        )}
        
        {dietPlan.supplements && dietPlan.supplements.length > 0 && (
          <SectionContainer title="Supplements" icon={Zap}>
            <ul className="list-disc list-inside text-teal-300 pl-2 space-y-1">
              {dietPlan.supplements.map((item, index) => <li key={index}><span className="text-white">{item}</span></li>)}
            </ul>
          </SectionContainer>
        )}
      </div>
    </div>
  );
};

export default DietPlanDisplay;
