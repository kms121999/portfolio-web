"use client";

import type { FullSkill } from "@/sanity/SkillManager";

type Props = {
  data: FullSkill;
};

export default function SkillDetails({ data }: Props) {
  return (
    <div className="relative mt-2 group inline-block">
      {/* Skill button */}
      <button className="text-black-600 px-3 py-1 rounded-lg bg-blue-100 hover:bg-blue-200 transition">
        {data.name}
      </button>

      {/* Overlay on hover */}
      <div className="absolute left-0 top-full mt-2 w-80 max-w-full bg-white shadow-lg rounded-lg p-4 border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-200">
        {data.childrenCategories.map((category) => (
          <div key={category.name} className="mb-4 last:mb-0">
            <h3 className="text-sm font-semibold mb-2">{category.name}</h3>
            <div className="flex flex-wrap gap-2">
              {category.skills.map((skill) => (
                <span
                  key={skill.name}
                  className="px-3 py-1 bg-gray-200 text-gray-800 rounded-full text-sm shadow-sm"
                >
                  {skill.name}
                </span>
              ))}
            </div>
          </div>
        ))}
        {data.childrenCategories.length === 0 && (<span className="text-sm text-gray-500">No more details</span>)}
      </div>
    </div>
  );
}
