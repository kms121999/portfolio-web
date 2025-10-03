import type { FullSkill } from "@/sanity/SkillManager";

type Props = {
  data: FullSkill;
};

export default function SkillDetails({ data }: Props) {
  return (
    <div className="relative mt-2 group inline-block">
      {/* Skill button */}
      <div className="px-5 py-2 rounded-full bg-gradient-to-b from-gray-100 to-gray-300 text-gray-900 shadow-md shadow-inner">
  {data.name}
</div>

      {/* Overlay on hover */}
      <div
        className="fixed sm:absolute left-1/2 top-1/3 sm:top-full sm:mt-2 
                  w-screen max-w-[calc(100vw-2rem)] sm:max-w-md
                  bg-gradient-to-b from-white to-gray-50
                  shadow-xl rounded-xl p-5 border border-gray-200 
                  opacity-0 invisible group-hover:opacity-100 group-hover:visible 
                  transform -translate-x-1/2 sm:translate-y-2 group-hover:translate-y-0 
                  transition-all duration-300 ease-out z-50"
      >
        <div>
          <h2 className="text-lg font-bold mb-3 sm:hidden">{data.name}</h2>
        </div>
        {data.childrenCategories.map((category) => {
          if (category.skills.length === 0) {
            return null;
          }
          
          return (
          <div key={category.name} className="mb-5 last:mb-0">
            <h3 className="text-sm font-semibold text-gray-700 border-b border-gray-200 pb-1 mb-3">
              {category.name}
            </h3>
            <div className="flex flex-wrap justify-center gap-2">
              {category.skills.map((skill) => (
                <span
                  key={skill.name}
                  className="px-3 py-1 bg-gradient-to-b from-gray-100 to-gray-300 
                            text-gray-900 rounded-full text-sm
                            shadow-sm hover:shadow-md transition"
                >
                  {skill.name}
                </span>
              ))}
            </div>
          </div>
        )})}

        {data.childrenCategories.every((c) => c.skills.length === 0) && (
          <span className="text-sm text-gray-700">No more details</span>
        )}
      </div>
    </div>
  );
}
