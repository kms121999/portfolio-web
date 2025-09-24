export type Project = {
  name: string;
  description: string;
  isTeamProject: boolean;
  programmingLanguage: string | null;
  repoUrl: string;
  homepageUrl: string;
  imageUrl: string;
  createdAt: Date | null;
  updatedAt: Date | null;
};
