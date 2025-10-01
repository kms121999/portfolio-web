import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Octokit } from "@octokit/rest";
import { load } from 'cheerio';
import { Project } from "./types";

const CACHE_TTL_MS = 1000*5;// 1000 * 60 * 60; // 1 hour

// In-memory cache
let cache: {
  timestamp: number;
  projects: Project[];
} | null = null;

const GITHUB_USERNAME: string = process.env.GITHUB_USERNAME ?? (() => { 
  throw new Error("GITHUB_USERNAME environment variable is not set"); 
})();

const GITHUB_TOKEN: string = process.env.GITHUB_TOKEN ?? (() => {
  throw new Error("GITHUB_TOKEN environment variable is not set");
})();

const octokit = new Octokit({ auth: GITHUB_TOKEN });

async function getPreviewImage(url: string | URL | Request) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
    const html = await res.text();

    const cheerioAPI = load(html);

    // Try OG image first
    const ogImage = cheerioAPI('meta[property="og:image"]').attr('content');
    if (ogImage) return ogImage;

    // Fallback to Twitter image
    const twitterImage = cheerioAPI('meta[name="twitter:image"]').attr('content');
    if (twitterImage) return twitterImage;

    return null; // No image found
  } catch (err) {
    console.error(err);
    return null;
  }
}

function isGenericImage(url: string): boolean {
  // TODO: Make sure is catching generic patterns
  const genericImagePatterns = [
    /https:\/\/opengraph\.githubassets\.com\/.+/
  ];
  return genericImagePatterns.some(pattern => pattern.test(url));
}

async function fetchReposAndReadmes() : Promise<Project[]> {
  // Get all public repositories
  const allRepos = await octokit.paginate(octokit.repos.listForUser, { username: GITHUB_USERNAME });
  console.log(`Fetched ${allRepos.length} repositories for user ${GITHUB_USERNAME} with id: ${allRepos[0]?.owner?.id}`);

  // Filter repos for displayable qualities
  const filteredRepos = allRepos.filter(repo => repo.description);

  const projects = await Promise.all(
    filteredRepos.map(async (repo) => {
      let imageUrl = await getPreviewImage(repo.html_url);
      if (imageUrl && isGenericImage(imageUrl)) {
        imageUrl = ""; // Clear generic image URLs
      }

      const { data: contributors } = await octokit.repos.listContributors({
        owner: repo.owner.login,
        repo: repo.name,
      });

      return {
        name: repo.name,
        repoUrl: repo.html_url,
        imageUrl: imageUrl || "",
        homepageUrl: repo.homepage || "",
        description: repo.description || "",
        isTeamProject: contributors.length > 1,
        programmingLanguage: repo.language ? repo.language : null,
        createdAt: repo.created_at ? new Date(repo.created_at) : null,
        updatedAt: repo.updated_at ? new Date(repo.updated_at) : null,
      };
    })
  );

  console.log(`Filtered to ${projects.length} projects ready for display.`);

  return projects;
}

async function getProjects() {
  if (!cache || Date.now() - cache.timestamp > CACHE_TTL_MS) {
    cache = {
      timestamp: Date.now(),
      projects: await fetchReposAndReadmes(),
    };
  }
  return cache.projects;
}

export default async function ProjectsSection() {
  const projects = await getProjects();

  // TODO: Create a highlight section for select projects
  return (
    <section id="projects" className="py-20 px-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center">Projects</h2>
        <div className="mt-12 grid md:grid-cols-3 gap-8">
          {projects.length === 0 && (
            <p className="text-center text-gray-500 col-span-full">
              No projects found.
            </p>
          )}

          {/* Generate project cards */}
          {projects.map((project) => (
            <div
              key={project.name}
              className="bg-white rounded-2xl shadow p-6 hover:shadow-lg transition flex flex-col justify-between h-full"
            >
              {/* Top section */}
              <div>
                <Image
                  src={project.imageUrl || `https://picsum.photos/seed/${project.name}/400/250`}
                  alt={`${project.name} ${project.imageUrl ? "project image" : "placeholder image from picsum.photos"}`}
                  title={project.imageUrl ? project.name : "Placeholder image from picsum.photos"}
                  width={400}
                  height={198} // h-48
                  className="rounded-xl w-full h-48 object-cover"
                  />
                <h3 className="mt-4 text-xl font-semibold">{project.name}</h3>
                {project.description && (
                  <p className="mt-2 text-gray-600 text-sm">{project.description}</p>
                )}
              </div>

              {/* Bottom section */}
              <div>
                {/* Project tags */}
                <div className="mt-2 flex flex-wrap gap-2">
                  {project.programmingLanguage && (
                    <span className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                      {project.programmingLanguage}
                    </span>
                  )}
                  {project.isTeamProject && (
                    <span className="inline-block px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full">
                      Team Project
                    </span>
                  )}
                </div>
                <div className="mt-4 flex flex-wrap gap-4">
                  <Link
                    href={project.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-blue-600 hover:underline"
                  >
                    GitHub <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                  {project.homepageUrl && (
                    <Link
                      href={project.homepageUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-green-600 hover:underline"
                    >
                      Live Site <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  )}
                </div>
                {(project.createdAt || project.updatedAt) && (
                  <p className="mt-2 text-gray-400 text-xs">
                    {project.createdAt && (
                      <>Created: {project.createdAt.toLocaleDateString()}</>
                    )}
                    {project.createdAt && project.updatedAt && <> | </>}
                    {project.updatedAt && (
                      <>Updated: {project.updatedAt.toLocaleDateString()}</>
                    )}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
