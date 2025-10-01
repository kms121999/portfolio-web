"use client";

import type { FullSkill } from "@/sanity/SkillManager";
import { useState } from "react";

type Props = {
  data: FullSkill;
};

export default function SkillDetails({ data }: Props) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="mt-2">
      <button
        onClick={() => setExpanded((prev) => !prev)}
        className="text-blue-600 underline"
      >
        {data.name} {expanded ? "▲" : "▼"}
      </button>

      {expanded && (
        <div className="mt-3 space-y-4">
          {data.childrenCategories.map((category) => (
            <div key={category.name}>
              <h3 className="text-sm font-semibold">{category.name}</h3>
              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill) => (
                  <span
                    key={skill.name}
                    className="px-2 py-1 bg-white rounded-lg shadow-sm text-sm"
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
