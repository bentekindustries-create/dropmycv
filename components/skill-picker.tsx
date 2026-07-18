"use client";

import { useEffect, useState } from "react";

interface SkillSubcategory {
  id: string;
  label: string;
  icon: string;
  skills: string[];
}

interface SkillCategoryDef {
  id: string;
  label: string;
  icon: string;
  skills?: string[];
  subcategories?: SkillSubcategory[];
}

const SKILL_CATEGORIES: SkillCategoryDef[] = [
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
    subcategories: [
      {
        id: "domestic",
        label: "Domestic / Residential",
        icon: "🏠",
        skills: ["Residential Electrician", "Domestic Plumber", "Carpenter", "Painter & Decorator", "Wall & Floor Tiler", "Plasterer", "Bricklayer", "Concreter", "Kitchen Renovation", "Bathroom Renovation", "Landscape Gardener", "Handyman"],
      },
      {
        id: "commercial",
        label: "Commercial / Fit-Out",
        icon: "🏢",
        skills: ["Commercial Electrician", "Commercial Plumber", "Shop Fitter", "Commercial Painter", "Commercial Tiler", "Suspended Ceiling Installer", "Glazier", "Fire Protection Installer", "Commercial Flooring", "Partition Installer"],
      },
      {
        id: "industrial",
        label: "Industrial / Heavy",
        icon: "🏭",
        skills: ["Industrial Electrician", "Boilermaker", "Pipefitter", "Rigger", "Scaffolder", "Industrial Mechanic", "Instrumentation Technician", "Millwright", "Shutdown Maintenance", "Process Operator"],
      },
      {
        id: "civil",
        label: "Civil / Infrastructure",
        icon: "🛣️",
        skills: ["Civil Construction", "Road Worker", "Drainer & Sewerage", "Gas Fitter", "Cable Jointer", "Underground Services", "Water & Wastewater", "Traffic Controller", "Earthworks Operator", "Linesperson"],
      },
      {
        id: "general",
        label: "General / Multi-trade",
        icon: "🔨",
        skills: ["Welder", "HVAC Technician", "Refrigeration Mechanic", "General Maintenance", "Facilities Maintenance", "Estimator (Trades)", "Building Inspector", "Trade Assistant", "Safety & Compliance"],
      },
    ],
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

function getAllSkills(cat: SkillCategoryDef): string[] {
  if (cat.skills) return cat.skills;
  return cat.subcategories?.flatMap((s) => s.skills) ?? [];
}

interface SkillPickerProps {
  value: string;
  onChange: (v: string) => void;
}

export function SkillPicker({ value, onChange }: SkillPickerProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
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

  function goBack() {
    if (selectedSubcategory) {
      setSelectedSubcategory(null);
    } else {
      setSelectedCategory(null);
    }
  }

  const activeCategory = SKILL_CATEGORIES.find((c) => c.id === selectedCategory);
  const activeSubcategory = activeCategory?.subcategories?.find((s) => s.id === selectedSubcategory);

  const skillChips: string[] = activeSubcategory
    ? activeSubcategory.skills
    : (activeCategory?.skills ?? []);

  const isShowingSkills = selectedCategory && (activeCategory?.skills || selectedSubcategory);
  const isShowingSubcategories = selectedCategory && activeCategory?.subcategories && !selectedSubcategory;

  const breadcrumb = activeSubcategory
    ? `${activeCategory?.icon} ${activeCategory?.label} › ${activeSubcategory.label}`
    : activeCategory
    ? `${activeCategory.icon} ${activeCategory.label}`
    : null;

  return (
    <div className="space-y-4">
      {/* Selected skill tags */}
      {selectedSkills.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedSkills.map((skill) => (
            <span
              key={skill}
              className="inline-flex items-center gap-1 text-xs bg-teal-light text-navy px-2.5 py-1 rounded-full font-medium"
            >
              {skill}
              <button
                onClick={() => setSelectedSkills((prev) => prev.filter((s) => s !== skill))}
                className="ml-0.5 hover:text-navy-dark font-bold leading-none"
                aria-label={`Remove ${skill}`}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Navigation header */}
      {selectedCategory && (
        <div className="flex items-center gap-2">
          <button
            onClick={goBack}
            className="text-xs text-slate-500 hover:text-slate-600 transition-colors"
          >
            ←
          </button>
          <p className="text-sm font-semibold text-slate-700">{breadcrumb}</p>
        </div>
      )}

      {/* Category grid */}
      {!selectedCategory && (
        <div className="grid grid-cols-2 gap-2">
          {SKILL_CATEGORIES.map((cat) => {
            const selectedCount = getAllSkills(cat).filter((s) => selectedSkills.includes(s)).length;
            return (
              <button
                key={cat.id}
                onClick={() => { setSelectedCategory(cat.id); setSelectedSubcategory(null); }}
                className="flex items-center gap-2 px-3 py-2.5 rounded-xl border-2 text-sm font-medium text-left transition-all border-slate-200 text-slate-600 hover:border-teal hover:bg-slate-50"
              >
                <span className="text-base">{cat.icon}</span>
                <span className="flex-1">{cat.label}</span>
                {selectedCount > 0 && (
                  <span className="text-xs bg-teal-light text-teal-ink px-1.5 py-0.5 rounded-full font-semibold">
                    {selectedCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Subcategory grid (Trades and any future nested categories) */}
      {isShowingSubcategories && activeCategory.subcategories && (
        <div className="grid grid-cols-1 gap-2">
          {activeCategory.subcategories.map((sub) => {
            const selectedCount = sub.skills.filter((s) => selectedSkills.includes(s)).length;
            return (
              <button
                key={sub.id}
                onClick={() => setSelectedSubcategory(sub.id)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl border-2 text-sm font-medium text-left transition-all border-slate-200 text-slate-600 hover:border-teal hover:bg-slate-50"
              >
                <span className="text-xl">{sub.icon}</span>
                <span className="flex-1">{sub.label}</span>
                {selectedCount > 0 && (
                  <span className="text-xs bg-teal-light text-teal-ink px-1.5 py-0.5 rounded-full font-semibold">
                    {selectedCount}
                  </span>
                )}
                <span className="text-slate-500 text-xs">→</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Skill chips */}
      {isShowingSkills && (
        <div className="flex flex-wrap gap-2">
          {skillChips.map((skill) => {
            const selected = selectedSkills.includes(skill);
            return (
              <button
                key={skill}
                onClick={() => toggleSkill(skill)}
                className={[
                  "text-sm px-3 py-1.5 rounded-full border-2 font-medium transition-all",
                  selected
                    ? "border-teal bg-teal-light text-navy"
                    : "border-slate-200 text-slate-600 hover:border-teal hover:bg-slate-50",
                ].join(" ")}
              >
                {selected && <span className="mr-1">✓</span>}
                {skill}
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
        className="w-full text-sm border border-slate-200 rounded-xl px-4 py-3 bg-white text-slate-700 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent"
      />
    </div>
  );
}
