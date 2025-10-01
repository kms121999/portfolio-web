import type {SKILL_QUERYResult, CATEGORY_QUERYResult} from "@/sanity/types";
import { client } from "./client";
import { defineQuery } from "next-sanity";

type CategoryData = CATEGORY_QUERYResult[number] & {
  skills?: Array<{ id: string; displayPriority: number }>;
}

type SkillData = SKILL_QUERYResult[number] & {
  childrenSkills?: string[];
  childrenCategories?: { [key: string]: string[] }
}

type SimpleSkill = {
  name: string;
}

export type FullSkill = {
  name: string;
  childrenCategories: ChildCategory[];
}

type ChildCategory = {
  name: string;
  skills: SimpleSkill[];
}

const CACHE_DURATION_MS = 5 * 60 * 1000;

const cacheLastUpdated = new Date(0);

let highlightedSkills: FullSkill[] = [];
let allSkills: { [key: string]: SkillData } = {};
let allCategories: { [key: string]: CategoryData } = {};
let allTags: { [key: string]: string[] } = {};


const SKILL_QUERY = defineQuery(`*[_type == "skill"]`);
const CATEGORY_QUERY = defineQuery(`*[_type == "skillCategory"]`);


export async function updateCache() {
  const skills = await client.fetch(SKILL_QUERY);
  const categories = await client.fetch(CATEGORY_QUERY);

  updateSkills(skills, categories);
}


function getCategoryChildren(categoryId: string) {
  const category = allCategories[categoryId];

  return category.childrenCategories?.map(categoryEntry => {
    return categoryEntry._ref;
  }) ?? [];
}

function getChildrenCategories(skillId: string) {
  const skill = allSkills[skillId];

  console.log("Getting children categories for skill:", skillId, skill);
  if (!skill) {
    console.warn("Skill not found:", skillId);
    console.log(`Available skills:`, Object.keys(allSkills));
    return {};
  }
  if (skill.childrenCategories) return skill.childrenCategories;

  skill.childrenCategories = {};

  const parentCategories = skill.categories.map(categoryEntry => {
    return categoryEntry.category._ref;
  });



  for (const categoryId of parentCategories) {
    const childrenCategoryIds = getCategoryChildren(categoryId);

    for (const childCategoryId of childrenCategoryIds) {
      skill.childrenCategories[childCategoryId] = [];
    }
  }

  for (const skillId of skill.childrenSkills!) {
    const childSkill = allSkills[skillId]

    for (const categoryEntryObject of childSkill.categories) {
      const categoryId = categoryEntryObject.category._ref;
      if (skill.childrenCategories![categoryId]) {
        skill.childrenCategories![categoryId].push(skillId);
      }
    }
  }

  return skill.childrenCategories;
}



export function updateSkills(newSkills: SKILL_QUERYResult, newCategories: CATEGORY_QUERYResult) {
  allCategories = {};
  allSkills = {};
  highlightedSkills = [];
  allTags = {};

  newCategories.forEach(category => {
    allCategories[category._id] = category;

    // Prepare to receive children skills
    allCategories[category._id].skills = [];
  });
  
  newSkills.forEach(skill => {
    // Map skill ID to skill object
    allSkills[skill._id] = skill;

    // Prepare to recieve children skills
    allSkills[skill._id].childrenSkills = [];

    // Add skill ID to each of its categories
    skill.categories.forEach(categoryEntryObject  => {
      const category = allCategories[categoryEntryObject.category._ref]
      category.skills!.push({
        id: skill._id,
        displayPriority: categoryEntryObject.displayPriority ?? 0
      });
    })

    // Map tags to skills
    skill.tags?.forEach(tag => {
      if (!allTags[tag]) allTags[tag] = [];
      allTags[tag].push(skill._id);
    });
  });

  for (const skillId in allSkills) {
    const skill = allSkills[skillId]
    skill.parentSkills?.forEach(skillEntryObject => {
      allSkills[skillEntryObject._ref].childrenSkills!.push(skillId)
    })
  }

  // Sort skills in each category by display priority
  for (const categoryId in allCategories) {
    allCategories[categoryId].skills!.sort((a, b) => b.displayPriority - a.displayPriority);
  }

  const  highlightedIds: { [id: string]: true } = {};
  const highlightedSkillsList: { displayPriority: number, id: string }[] = [];
  for (const categoryId in allCategories) {
    const category = allCategories[categoryId];
    if (!category.highlightSettings?.isHighlighted) continue;

    const categoryLimit = category.highlightSettings?.count ?? 3;

    category.skills!
      .slice(0, categoryLimit)
      .forEach(skillEntry => {
        if (highlightedIds[skillEntry.id]) return;
        highlightedIds[skillEntry.id] = true;
        highlightedSkillsList.push(skillEntry);
      });
  }

  highlightedSkillsList.sort((a, b) => b.displayPriority - a.displayPriority)
  .forEach(skillEntry => {
    highlightedSkills.push(getFullSkill(skillEntry.id));
  });
}

function getFullSkill(skillId: string): FullSkill {
  const skill = allSkills[skillId];
  if (!skill) throw new Error(`Skill not found: ${skillId}`);
  const childrenCategoriesData = getChildrenCategories(skillId);
  const childrenCategories: ChildCategory[] = Object.entries(childrenCategoriesData).map(([categoryId, skillIds]) => {
    const category = allCategories[categoryId];
    return {
      name: category.name,
      skills: skillIds.map(id => ({
        name: allSkills[id].name
      }))
    }
  });
  return {
    name: skill.name,
    childrenCategories
  };
}

function ensureUptoDate() {
  const now = new Date();
  if (now.getTime() - cacheLastUpdated.getTime() > CACHE_DURATION_MS) {
    console.log("Cache is stale, updating...");
    return updateCache().then(() => {
      cacheLastUpdated.setTime(now.getTime());
    });
  }

  return Promise.resolve()
}

export async function getHighlightedSkills(): Promise<FullSkill[]> {
  await ensureUptoDate();
  return highlightedSkills;
}


// TODO: Skill pagination, filtering, etc.