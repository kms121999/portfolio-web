import { getHighlightedSkills } from "@/sanity/SkillManager";
import Skill from "./Skill";


export default async function SkillsSection() {
  const skills = await getHighlightedSkills();

  return (
    <section id="skills" className="py-20 px-6 max-w-5xl mx-auto text-center">
      <h2 className="text-3xl font-bold">Skills</h2>
      <div className="mt-12 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {skills.map(
          (skill) => (
            <Skill data={skill} key={skill.name} />
          )
        )}
      </div>
    </section>
  );
}