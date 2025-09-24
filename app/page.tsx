import { type SanityDocument } from "next-sanity";

import ProjectsSection from "@/app/components/ProjectsSection";

import { client } from "@/sanity/client";

// app/page.tsx
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Github, Linkedin, Mail } from "lucide-react";

// Example: Later, fetch data from Sanity
// TODO import { getProjects, getSkills } from "@/sanity/queries";}

export const revalidate = 3600; // revalidate every hour

export default async function Home() {
  const siteSettings: SanityDocument = await client.fetch(`*[_type == "siteSettings"][0]`);
  const socialMediaLinks = siteSettings?.socialMediaLinks;

  return (
    <main className="flex flex-col">
      {/* Hero Section */}
      <section className="relative flex flex-col md:flex-row items-center justify-center h-[80vh] text-center md:text-left px-6 bg-gradient-to-br from-blue-50 to-white">
  {/* Profile Picture */}
  <div className="flex-shrink-0 mb-6 md:mb-0 md:mr-8">
    <Image
      src="/keaton-smith-profile.jpg"
      alt="Keaton Smith"
      width={160}
      height={160}
      className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-blue-600 shadow-lg"
      priority
    />
  </div>

  {/* Text Content */}
  <div>
    <h1 className="text-5xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
      Hi, I’m Keaton
    </h1>
    <p className="mt-4 text-xl text-gray-700 max-w-xl">
      I build infrastructure, automate workflows, and craft clean web experiences for small businesses.
    </p>
    <div className="flex gap-4 mt-6 justify-center md:justify-start">
      <a href="#projects" className="px-6 py-3 rounded-2xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition">
        View Projects
      </a>
      <a href="#contact" className="px-6 py-3 rounded-2xl border border-gray-300 font-medium hover:bg-gray-100 transition">
        Contact Me
      </a>
    </div>
  </div>
</section>

      {/* About Section */}
      <section id="about" className="py-20 px-6 max-w-5xl mx-auto text-center">
        <h2 className="text-3xl font-bold">About Me</h2>
        <p className="mt-6 text-gray-600 leading-relaxed max-w-3xl mx-auto">
          I’ve been coding for 13 years, starting with small games in Python and
          evolving into building scalable systems with modern frameworks. I love
          learning, solving problems, and sharing knowledge with others.
        </p>
      </section>

      {/* Projects Section */}
      <ProjectsSection/>

      {/* Skills Section */}
      <section id="skills" className="py-20 px-6 max-w-5xl mx-auto text-center">
        <h2 className="text-3xl font-bold">Skills</h2>
        <div className="mt-12 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {["React", "Next.js", "TypeScript", "Tailwind", "Node.js", "PostgreSQL", "Docker"].map(
            (skill) => (
              <div
                key={skill}
                className="p-4 bg-gray-100 rounded-xl shadow-sm hover:shadow-md transition"
              >
                {skill}
              </div>
            )
          )}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-6 bg-gray-50 text-center">
        <h2 className="text-3xl font-bold">Get in Touch</h2>
        <p className="mt-4 text-gray-600">
          Interested in working together? Let’s connect.
        </p>
        <div className="mt-8 flex justify-center gap-6">
          <Link href="mailto:your@email.com" aria-label="Email">
            <Mail className="h-6 w-6 text-gray-700 hover:text-blue-600" />
          </Link>
          <Link href={socialMediaLinks?.github ?? ""} target="_blank" aria-label="GitHub">
            <Github className="h-6 w-6 text-gray-700 hover:text-blue-600" />
          </Link>
          <Link
            href={socialMediaLinks?.linkedin ?? ""}
            target="_blank"
            aria-label="LinkedIn"
          >
            <Linkedin className="h-6 w-6 text-gray-700 hover:text-blue-600" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 border-t text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} Keaton Smith. All rights reserved.
      </footer>
    </main>
  );
}
