"use client";

import { useEffect, useState } from "react";

const SKILL_CATEGORIES = [
  {
    id: "technology",
    label: "Technology",
    icon: "💻",
    skills: ["Software Engineer", "Data Analyst", "UX Designer", "IT Support", "DevOps Engineer", "Cybersecurity Analyst", "Product Manager", "QA Engineer", "Systems Administrator"],
  },
  {
    id: "trades",
    label: "Trades",
    icon: "🔧",
    skills: ["Electrician", "Plumber", "Carpenter", "Bricklayer", "Welder", "Painter", "Tiler", "HVAC Technician", "Concretor", "Plasterer"],
  },
  {
    id: "healthcare",
    label: "Healthcare",
    icon: "🏥",
    skills: ["Registered Nurse", "Doctor / GP", "Physiotherapist", "Pharmacist", "Paramedic", "Aged Care Worker", "Dentist", "Radiographer", "Occupational Therapist", "Speech Pathologist"],
  },
  {
    id: "business",
    label: "Business & Finance",
    icon: "📊",
    skills: ["Accountant", "Financial Analyst", "Project Manager", "Business Analyst", "HR Manager", "Operations Manager", "Bookkeeper", "Finance Manager", "Payroll Officer"],
  },
  {
    id: "engineering",
    label: "Engineering",
    icon: "⚙️",
    skills: ["Civil Engineer", "Mechanical Engineer", "Electrical Engineer", "Structural Engineer", "Chemical Engineer", "Environmental Engineer", "Mining Engineer"],
  },
  {
    id: "education",
    label: "Education",
    icon: "📚",
    skills: ["Primary Teacher", "Secondary Teacher", "Early Childhood Educator", "University Lecturer", "School Administrator", "Tutor", "Special Education Teacher"],
  },
  {
    id: "retail",
    label: "Retail & Hospitality",
    icon: "🛍️",
    skills: ["Retail Manager", "Chef", "Barista", "Customer Service", "Store Assistant", "Hotel Manager", "Wait Staff", "Sous Chef", "Food & Beverage Manager"],
  },
  {
    id: "creative",
    label: "Creative & Marketing",
    icon: "🎨",
    skills: ["Graphic Designer", "Copywriter", "Social Media Manager", "Marketing Manager", "Photographer", "Video Editor", "Brand Manager", "Content Creator", "Art Director"],
  },
  {
    id: "legal",
    label: "Legal",
    icon: "⚖️",
    skills: ["Lawyer", "Paralegal", "Compliance Officer", "Legal Secretary", "Contracts Manager", "Solicitor", "Legal Counsel"],
  },
  {
    id: "admin",
    label: "Administration",
    icon: "📋",
    skills: ["Executive Assistant", "Office Manager", "Receptionist", "Data Entry Clerk", "Office Administrator", "Personal Assistant", "Team Coordinator"],
  },
  {
    id: "construction",
    label: "Construction",
    icon: "🏗️",
    skills: ["Site Manager", "Project Engineer", "Quantity Surveyor", "Estimator", "Draftsperson", "Building Inspector", "Foreman"],
  },
  {
    id: "transport",
    label: "Transport & Logistics",
    icon: "🚚",
    skills: ["Truck Driver", "Warehouse Operator", "Logistics Coordinator", "Supply Chain Manager", "Forklift Operator", "Delivery Driver", "Fleet Manager"],
  },
];

interface SkillPickerProps {
  value: string;
  onChange: (v: string) => void;
}

export function SkillPicker({ value, onChange }: SkillPickerProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSkills, setSelectedSkills] = useState<string[]>(() =>
    value ? value.split(",").map((s) => s.trim()).filter(Boolean) : []
  );
  const [customText, setCustomText] = useState("");

  useEffect(() => {
    const all = [
      ...selectedSkills,
      ...(customText.trim() ? customText.split(",").map((s) => s.trim()).filter(Boolean) : []),
    ];
    onChange(all.join(", "));
  }, [selectedSkills, customText]);

  function toggleSkill(skill: string) {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  }

  const activeCategory = SKILL_CATEGORIES.find((c) => c.id === selectedCategory);

  return (
    <div className="space-y-4">
      {/* Selected skill tags */}
      {selectedSkills.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedSkills.map((skill) => (
            <span
              key={skill}
              className="inline-flex items-center gap-1 text-xs bg-indigo-100 text-indigo-700 px-2.5 py-1 rounded-full font-medium"
            >
              {skill}
              <button
                onClick={() => setSelectedSkills((prev) => prev.filter((s) => s !== skill))}
                className="ml-0.5 hover:text-indigo-900 font-bold leading-none"
                aria-label={`Remove ${skill}`}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Category grid or skill chips */}
      {selectedCategory ? (
        <div className="space-y-3">
          <button
            onClick={() => setSelectedCategory(null)}
            className="text-xs text-slate-400 hover:text-slate-600 transition-colors"
          >
            ← All categories
          </button>
          <p className="text-sm font-semibold text-slate-700">
            {activeCategory?.icon} {activeCategory?.label}
          </p>
          <div className="flex flex-wrap gap-2">
            {activeCategory?.skills.map((skill) => {
              const selected = selectedSkills.includes(skill);
              return (
                <button
                  key={skill}
                  onClick={() => toggleSkill(skill)}
                  className={[
                    "text-sm px-3 py-1.5 rounded-full border-2 font-medium transition-all",
                    selected
                      ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                      : "border-slate-200 text-slate-600 hover:border-indigo-300 hover:bg-slate-50",
                  ].join(" ")}
                >
                  {selected && <span className="mr-1">✓</span>}
                  {skill}
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          {SKILL_CATEGORIES.map((cat) => {
            const selectedCount = cat.skills.filter((s) => selectedSkills.includes(s)).length;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className="flex items-center gap-2 px-3 py-2.5 rounded-xl border-2 text-sm font-medium text-left transition-all border-slate-200 text-slate-600 hover:border-indigo-300 hover:bg-slate-50"
              >
                <span className="text-base">{cat.icon}</span>
                <span className="flex-1">{cat.label}</span>
                {selectedCount > 0 && (
                  <span className="text-xs bg-indigo-100 text-indigo-600 px-1.5 py-0.5 rounded-full font-semibold">
                    {selectedCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Free text */}
      <input
        type="text"
        value={customText}
        onChange={(e) => setCustomText(e.target.value)}
        placeholder="Or type your own skills, comma separated…"
        className="w-full text-sm border border-slate-200 rounded-xl px-4 py-3 bg-white text-slate-700 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
      />
    </div>
  );
}
