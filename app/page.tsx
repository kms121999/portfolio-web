import { type SanityDocument, PortableText } from "next-sanity";

import ProjectsSection from "@/app/components/ProjectsSection";

import { client, urlFor } from "@/sanity/client";


// app/page.tsx
import Image from "next/image";
import Link from "next/link";
import { Github, Linkedin, Mail } from "lucide-react";
import SkillsSection from "./components/SkillsSection";
import { MessageButton } from "./components/MessageButton";

// Example: Later, fetch data from Sanity
// TODO import { getProjects, getSkills } from "@/sanity/queries";}

export const revalidate = 3600; // revalidate every hour

export default async function Home() {
  // TODO: these queries should be cached with a ttl
  const profile: SanityDocument = await client.fetch(`*[_type == "profile"][0]`);
  const socialMediaLinks = profile?.socialMediaLinks;

  // TODO integrate skills into page
  // Skills should be clickable to trigger expanding details?


  return (
    <main className="flex flex-col">
      {/* Hero Section */}
      <section className="relative flex flex-col md:flex-row items-center justify-center h-[80vh] text-center md:text-left px-6 bg-gradient-to-br from-blue-50 to-white">
  {/* Profile Picture */}
  <div className="flex-shrink-0 mb-6 md:mb-0 md:mr-8">
    <Image
      src={urlFor(profile?.profileImage).url()}
      alt={profile.profileImage?.alt || "Profile Picture"}
      width={160}
      height={160}
      className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-blue-600 shadow-lg"
      priority
    />
  </div>

  {/* Text Content */}
  <div>
    <h1 className="text-5xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
      Hi, I’m {profile.firstName}
    </h1>
    <p className="mt-4 text-xl text-gray-700 max-w-xl">
      {profile.content.tagline}
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
        <div className="mt-6 text-gray-600 leading-relaxed max-w-3xl mx-auto">
          <PortableText
            value={profile.content.aboutMe}
            components={{
              types: {
                image: ({ value }) => {
                  return (
                    <Image
                      src={urlFor(value).url()}
                      alt={value.alt || "About me image"}
                      width={500}
                      height={300}
                      className="rounded-lg"
                    />
                  );
                },
              },
            }}
          />
        </div>
      </section>

      {/* Projects Section */}
      <ProjectsSection/>

      {/* Skills Section */}
      <SkillsSection/>

      {/* Contact Section */}
      {/* TODO: update contact section. Also implement testing */}
      <section id="contact" className="py-20 px-6 bg-gray-50 text-center">
        <h2 className="text-3xl font-bold">Get in Touch</h2>
        <p className="mt-4 text-gray-600">
          Interested in working together? Let’s connect.
        </p>
        <div className="mt-8 flex justify-center gap-6">
          <MessageButton aria-label="Open Contact Form">
            <Mail className="h-6 w-6 text-gray-700 hover:text-blue-600" />
          </MessageButton>
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
