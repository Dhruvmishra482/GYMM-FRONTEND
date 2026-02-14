// WorkoutPlanDisplay.jsx
import React from 'react';
import { Award, CalendarDays, Clock, Dumbbell, Target, Zap, Info, List, TrendingUp, HeartHandshake } from 'lucide-react'; // Icons for display

const DetailItem = ({ icon: Icon, label, value }) => (
  <div className="flex items-start space-x-3 p-3 bg-gray-800/60 rounded-lg border border-indigo-700/50 shadow-md">
    <Icon className="h-5 w-5 text-purple-400 flex-shrink-0 mt-0.5" />
    <div>
      <dt className="text-sm font-medium text-indigo-200">{label}</dt>
      <dd className="mt-1 text-base text-white font-semibold">{value}</dd>
    </div>
  </div>
);

const SectionContainer = ({ title, children, icon: Icon }) => (
  <div className="bg-gray-800/60 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-indigo-700/50">
    <h3 className="flex items-center gap-3 text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-300 mb-4 pb-3 border-b border-indigo-700/50">
      {Icon && <Icon className="h-6 w-6 text-purple-400" />}
      {title}
    </h3>
    {children}
  </div>
);

const WorkoutPlanDisplay = ({ workoutPlan }) => {
  if (!workoutPlan) {
    return <div className="p-6 text-center text-indigo-300">No workout plan data available.</div>;
  }

  const formatSchedule = (schedule) => {
    if (typeof schedule !== 'object' || Object.keys(schedule).length === 0) {
      return "No detailed weekly schedule provided.";
    }
  
    return (
      <div className="space-y-3">
        {Object.entries(schedule).map(([day, details]) => (
          <div key={day} className="p-3 bg-gray-700/50 rounded-lg border border-indigo-600/50">
            <h4 className="text-md font-bold text-white capitalize mb-1">{day}</h4>
            {details.restDay ? (
              <p className="text-indigo-300">Rest Day {details.focus && `- ${details.focus}`}</p>
            ) : (
              <>
                {details.focus && <p className="text-indigo-300">Focus: <span className="text-white">{details.focus}</span></p>}
                {details.warmup && <p className="text-indigo-300">Warmup: <span className="text-white">{details.warmup}</span></p>}
                {details.exercises && details.exercises.length > 0 && (
                  <div className="mt-2">
                    <p className="text-indigo-300 font-medium mb-1">Exercises:</p>
                    <ul className="list-disc list-inside text-indigo-300 pl-2">
                      {details.exercises.map((ex, idx) => (
                        <li key={idx}>
                          <span className="text-white">{ex.name}</span>: {ex.sets} sets, {ex.reps} reps ({ex.rest})
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {details.cardio && <p className="text-indigo-300">Cardio: <span className="text-white">{details.cardio}</span></p>}
                {details.cooldown && <p className="text-indigo-300">Cooldown: <span className="text-white">{details.cooldown}</span></p>}
              </>
            )}
          </div>
        ))}
      </div>
    );
  };
  

  return (
    <div className="relative z-10 p-1 bg-gradient-to-br from-indigo-800 to-purple-900 rounded-2xl shadow-2xl border border-indigo-700/50">
      <div className="relative bg-gray-900/90 backdrop-blur-md rounded-xl p-6 space-y-8 text-white">
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-300 mb-6 pb-3 border-b border-indigo-700/50">
          {workoutPlan.planTitle}
        </h2>

        <SectionContainer title="Plan Overview" icon={Info}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <DetailItem icon={Zap} label="Plan Type" value={workoutPlan.planType || 'N/A'} />
            <DetailItem icon={Target} label="Target Audience" value={workoutPlan.targetAudience || 'N/A'} />
            <DetailItem icon={Award} label="Difficulty Level" value={workoutPlan.difficultyLevel || 'N/A'} />
            <DetailItem icon={Clock} label="Plan Duration" value={workoutPlan.planDuration || 'N/A'} />
            <DetailItem icon={Dumbbell} label="Workouts Per Week" value={workoutPlan.workoutsPerWeek || 'N/A'} />
            <DetailItem icon={CalendarDays} label="Created On" value={workoutPlan.createdAt ? new Date(workoutPlan.createdAt).toLocaleDateString() : 'N/A'} />
          </div>
        </SectionContainer>

        <SectionContainer title="Weekly Schedule" icon={List}>
          <div className="text-indigo-300 text-sm whitespace-pre-wrap">
            {formatSchedule(workoutPlan.weeklySchedule)}
          </div>
        </SectionContainer>

        {workoutPlan.generalInstructions && (
          <SectionContainer title="General Instructions" icon={Info}>
            <p className="text-indigo-300 whitespace-pre-wrap">{workoutPlan.generalInstructions}</p>
          </SectionContainer>
        )}

        {workoutPlan.progressionNotes && (
          <SectionContainer title="Progression Notes" icon={TrendingUp}>
            <p className="text-indigo-300 whitespace-pre-wrap">{workoutPlan.progressionNotes}</p>
          </SectionContainer>
        )}
        
        {workoutPlan.importantTips && workoutPlan.importantTips.length > 0 && (
          <SectionContainer title="Important Tips" icon={HeartHandshake}>
            <ul className="list-disc list-inside text-indigo-300 pl-2 space-y-1">
              {workoutPlan.importantTips.map((tip, index) => <li key={index}><span className="text-white">{tip}</span></li>)}
            </ul>
          </SectionContainer>
        )}

        {workoutPlan.safetyGuidelines && workoutPlan.safetyGuidelines.length > 0 && (
          <SectionContainer title="Safety Guidelines" icon={HeartHandshake}>
            <ul className="list-disc list-inside text-indigo-300 pl-2 space-y-1">
              {workoutPlan.safetyGuidelines.map((guideline, index) => <li key={index}><span className="text-white">{guideline}</span></li>)}
            </ul>
          </SectionContainer>
        )}

        {workoutPlan.recoveryTips && workoutPlan.recoveryTips.length > 0 && (
          <SectionContainer title="Recovery Tips" icon={HeartHandshake}>
            <ul className="list-disc list-inside text-indigo-300 pl-2 space-y-1">
              {workoutPlan.recoveryTips.map((tip, index) => <li key={index}><span className="text-white">{tip}</span></li>)}
            </ul>
          </SectionContainer>
        )}
      </div>
    </div>
  );
};

export default WorkoutPlanDisplay;
