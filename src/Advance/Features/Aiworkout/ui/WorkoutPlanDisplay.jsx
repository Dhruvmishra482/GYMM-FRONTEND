import React from "react";
import {
  Award,
  CalendarDays,
  Clock,
  Dumbbell,
  Target,
  Zap,
  List,
  TrendingUp,
  HeartHandshake,
  Info,
} from "lucide-react";

const Section = ({ title, icon: Icon, children }) => (
  <section className="border-b border-slate-300 pb-5">
    <div className="mb-3 flex items-center gap-2">
      <Icon className="h-4 w-4 text-slate-700" />
      <h3 className="text-base font-semibold text-slate-900">{title}</h3>
    </div>
    {children}
  </section>
);

const toSentence = (value) => {
  if (!value) return "N/A";
  if (Array.isArray(value)) return value.join(", ");
  return String(value);
};

const renderSchedule = (weeklySchedule) => {
  if (!weeklySchedule) {
    return <p className="text-sm text-slate-600">No detailed weekly schedule provided.</p>;
  }

  if (typeof weeklySchedule === "string") {
    return <p className="whitespace-pre-wrap text-sm text-slate-700">{weeklySchedule}</p>;
  }

  const entries = Object.entries(weeklySchedule);
  if (entries.length === 0) {
    return <p className="text-sm text-slate-600">No detailed weekly schedule provided.</p>;
  }

  return (
    <div className="space-y-3">
      {entries.map(([day, details]) => (
        <div key={day} className="grid gap-2 border-b border-slate-300 pb-3 sm:grid-cols-[120px_1fr]">
          <div className="text-sm font-semibold capitalize text-slate-800">{day}</div>
          <div className="space-y-1 text-sm text-slate-700">
            {details?.restDay ? (
              <p>
                Rest Day{details?.focus ? ` - ${details.focus}` : ""}
              </p>
            ) : (
              <>
                {details?.focus && <p>Focus: <span className="font-medium text-slate-900">{details.focus}</span></p>}
                {details?.warmup && <p>Warmup: <span className="font-medium text-slate-900">{details.warmup}</span></p>}
                {details?.exercises?.length > 0 && (
                  <ul className="list-disc space-y-1 pl-5">
                    {details.exercises.map((ex, idx) => (
                      <li key={`${day}-${idx}`}>
                        <span className="font-medium text-slate-900">{ex.name}</span>
                        {` - ${ex.sets} sets, ${ex.reps} reps`}
                        {ex.rest ? ` (${ex.rest})` : ""}
                      </li>
                    ))}
                  </ul>
                )}
                {details?.cardio && <p>Cardio: <span className="font-medium text-slate-900">{details.cardio}</span></p>}
                {details?.cooldown && <p>Cooldown: <span className="font-medium text-slate-900">{details.cooldown}</span></p>}
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

const ChipList = ({ items }) => (
  <div className="flex flex-wrap gap-2">
    {items.map((item, index) => (
      <span
        key={`${item}-${index}`}
        className="rounded-full border border-slate-300 bg-[#e8eeff] px-3 py-1 text-xs font-medium text-slate-800"
      >
        {item}
      </span>
    ))}
  </div>
);

const WorkoutPlanDisplay = ({ workoutPlan }) => {
  if (!workoutPlan) {
    return <p className="text-sm text-slate-600">No workout plan data available.</p>;
  }

  return (
    <div className="space-y-6 rounded-xl bg-[#e7ebf2] p-5 text-slate-900">
      <section className="border-b border-slate-300 pb-4">
        <h2 className="text-xl font-semibold">{workoutPlan.planTitle || "Untitled Plan"}</h2>
        <p className="mt-1 text-sm text-slate-600">Structured workout details and quick overview.</p>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
      <div className="space-y-5">
        <Section title="Weekly Schedule" icon={List}>
          {renderSchedule(workoutPlan.weeklySchedule)}
        </Section>

        {workoutPlan.generalInstructions && (
          <Section title="General Instructions" icon={Info}>
            <p className="whitespace-pre-wrap text-sm text-slate-700">
              {workoutPlan.generalInstructions}
            </p>
          </Section>
        )}

        {workoutPlan.progressionNotes && (
          <Section title="Progression Notes" icon={TrendingUp}>
            <p className="whitespace-pre-wrap text-sm text-slate-700">
              {workoutPlan.progressionNotes}
            </p>
          </Section>
        )}

        {workoutPlan.importantTips?.length > 0 && (
          <Section title="Important Tips" icon={HeartHandshake}>
            <ChipList items={workoutPlan.importantTips} />
          </Section>
        )}

        {workoutPlan.safetyGuidelines?.length > 0 && (
          <Section title="Safety Guidelines" icon={HeartHandshake}>
            <ChipList items={workoutPlan.safetyGuidelines} />
          </Section>
        )}

        {workoutPlan.recoveryTips?.length > 0 && (
          <Section title="Recovery Tips" icon={HeartHandshake}>
            <ChipList items={workoutPlan.recoveryTips} />
          </Section>
        )}
      </div>

      <aside className="space-y-3 border-l border-slate-300 pl-4">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-600">Overview</h3>
        <div className="space-y-3 text-sm">
          <div className="flex items-start gap-2">
            <Zap className="mt-0.5 h-4 w-4 text-slate-700" />
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500">Plan Type</p>
              <p className="font-medium">{toSentence(workoutPlan.planType)}</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Target className="mt-0.5 h-4 w-4 text-slate-700" />
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500">Target Audience</p>
              <p className="font-medium">{toSentence(workoutPlan.targetAudience)}</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Award className="mt-0.5 h-4 w-4 text-slate-700" />
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500">Difficulty</p>
              <p className="font-medium">{toSentence(workoutPlan.difficultyLevel)}</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Clock className="mt-0.5 h-4 w-4 text-slate-700" />
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500">Duration</p>
              <p className="font-medium">{toSentence(workoutPlan.planDuration)}</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Dumbbell className="mt-0.5 h-4 w-4 text-slate-700" />
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500">Workouts / Week</p>
              <p className="font-medium">{toSentence(workoutPlan.workoutsPerWeek)}</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <CalendarDays className="mt-0.5 h-4 w-4 text-slate-700" />
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500">Created</p>
              <p className="font-medium">
                {workoutPlan.createdAt ? new Date(workoutPlan.createdAt).toLocaleDateString() : "N/A"}
              </p>
            </div>
          </div>
        </div>
      </aside>
      </div>
    </div>
  );
};

export default WorkoutPlanDisplay;
