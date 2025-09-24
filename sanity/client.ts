import { createClient } from "next-sanity";

  const SANITY_PROJECT_ID: string = process.env.SANITY_PROJECT_ID ?? (() => { 
    throw new Error("SANITY_PROJECT_ID environment variable is not set"); 
  })();

export const client = createClient({
  projectId: SANITY_PROJECT_ID,
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: false,
});