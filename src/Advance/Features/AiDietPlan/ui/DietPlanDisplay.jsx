import React from "react";
import {
  CalendarDays,
  Soup,
  Target,
  Droplet,
  Info,
  List,
  CheckCircle,
  AlertCircle,
  Pill,
} from "lucide-react";

const MEAL_ORDER = [
  "earlyMorning",
  "breakfast",
  "midMorning",
  "lunch",
  "eveningSnack",
  "dinner",
  "beforeBed",
];

const toLabel = (value) =>
  value
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (char) => char.toUpperCase())
    .trim();

const toText = (value) => {
  if (value === null || value === undefined) return "Not defined";
  if (typeof value === "string") return value.trim() || "Not defined";
  if (Array.isArray(value)) {
    const normalized = value.map((item) => String(item).trim()).filter(Boolean);
    return normalized.length > 0 ? normalized.join(", ") : "Not defined";
  }

  if (typeof value === "object") {
    const preferredKeys = ["items", "description", "details", "meal", "food", "note", "value"];
    for (const key of preferredKeys) {
      const nestedValue = value[key];
      if (typeof nestedValue === "string" && nestedValue.trim()) return nestedValue.trim();
      if (Array.isArray(nestedValue)) {
        const list = nestedValue.map((item) => String(item).trim()).filter(Boolean);
        if (list.length > 0) return list.join(", ");
      }
    }
    return "Not defined";
  }

  return String(value).trim() || "Not defined";
};

const renderMealPlan = (mealPlan) => {
  if (!mealPlan || typeof mealPlan !== "object") {
    return <p className="text-sm text-slate-600">No meal plan details available.</p>;
  }

  const keys = Object.keys(mealPlan);
  if (keys.length === 0) {
    return <p className="text-sm text-slate-600">No meal plan details available.</p>;
  }

  const orderedKeys = [
    ...MEAL_ORDER.filter((key) => keys.includes(key)),
    ...keys.filter((key) => !MEAL_ORDER.includes(key)),
  ];

  return (
    <div className="space-y-3">
      {orderedKeys.map((mealKey) => (
        <div key={mealKey} className="border-b border-slate-300 pb-3 last:border-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            {toLabel(mealKey)}
          </p>
          <p className="mt-1 whitespace-pre-wrap text-sm text-slate-800">{toText(mealPlan[mealKey])}</p>
        </div>
      ))}
    </div>
  );
};

const ListSection = ({ title, icon: Icon, items }) => {
  if (!items || items.length === 0) return null;
  return (
    <section className="border-b border-slate-300 pb-4">
      <h3 className="mb-2 flex items-center gap-2 text-base font-semibold text-slate-900">
        <Icon className="h-4 w-4 text-slate-700" />
        {title}
      </h3>
      <p className="text-sm text-slate-800">{items.map((item) => toText(item)).join(", ")}</p>
    </section>
  );
};

const DietPlanDisplay = ({ dietPlan }) => {
  if (!dietPlan) {
    return <p className="text-sm text-slate-600">No diet plan data available.</p>;
  }

  return (
    <div className="space-y-6 rounded-xl bg-[#e7ebf2] p-5 text-slate-900">
      <section className="border-b border-slate-300 pb-4">
        <h2 className="text-xl font-semibold">{dietPlan.planTitle || "Untitled Plan"}</h2>
        <p className="mt-1 text-sm text-slate-600">Structured meal view and plan overview.</p>
      </section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="space-y-4">
          <div className="border-b border-slate-300 pb-4">
            <h3 className="mb-2 flex items-center gap-2 text-base font-semibold text-slate-900">
              <List className="h-4 w-4 text-slate-700" />
              Meal Plan Details
            </h3>
            {renderMealPlan(dietPlan.mealPlan)}
          </div>

          {dietPlan.generalInstructions && (
            <section className="border-b border-slate-300 pb-4">
              <h3 className="mb-2 flex items-center gap-2 text-base font-semibold text-slate-900">
                <Info className="h-4 w-4 text-slate-700" />
                General Instructions
              </h3>
              <p className="whitespace-pre-wrap text-sm text-slate-800">
                {toText(dietPlan.generalInstructions)}
              </p>
            </section>
          )}

          <ListSection title="Dos" icon={CheckCircle} items={dietPlan.dosList} />
          <ListSection title="Don'ts" icon={AlertCircle} items={dietPlan.dontsList} />
          <ListSection title="Supplements" icon={Pill} items={dietPlan.supplements} />
        </section>

        <aside className="space-y-3 rounded-lg bg-[#dde3ee] p-4">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-600">Overview</h3>

          <div className="space-y-2 text-sm">
            <div className="flex items-start gap-2">
              <Soup className="mt-0.5 h-4 w-4 text-slate-700" />
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">Plan Type</p>
                <p className="font-medium">{toText(dietPlan.planType)}</p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Target className="mt-0.5 h-4 w-4 text-slate-700" />
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">Target Audience</p>
                <p className="font-medium">{toText(dietPlan.targetAudience)}</p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <CalendarDays className="mt-0.5 h-4 w-4 text-slate-700" />
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">Duration</p>
                <p className="font-medium">{toText(dietPlan.planDuration)}</p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Droplet className="mt-0.5 h-4 w-4 text-slate-700" />
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">Water Intake</p>
                <p className="font-medium">{toText(dietPlan.waterIntake)}</p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <CalendarDays className="mt-0.5 h-4 w-4 text-slate-700" />
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">Created</p>
                <p className="font-medium">
                  {dietPlan.createdAt
                    ? new Date(dietPlan.createdAt).toLocaleDateString()
                    : "Not defined"}
                </p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default DietPlanDisplay;
