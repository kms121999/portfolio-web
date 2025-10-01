import { getHighlightedSkills } from "@/sanity/SkillManager";
import Skill from "./Skill";

export default async function SkillsSection() {
  const skills = await getHighlightedSkills();

  return (
    <section id="skills" className="py-20 px-6 max-w-3xl mx-auto text-center">
      <h2 className="text-3xl font-bold">Skills</h2>
      
      {/* Flex container for free-form wrapping */}
      <div className="mt-12 flex flex-wrap justify-center gap-5">
        {skills.map((skill) => (
          <Skill data={skill} key={skill.name} />
        ))}
      </div>
    </section>
  );
}
