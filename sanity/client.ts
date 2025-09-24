import { createClient } from "next-sanity";
import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'

  const SANITY_PROJECT_ID: string = process.env.SANITY_PROJECT_ID ?? (() => { 
    throw new Error("SANITY_PROJECT_ID environment variable is not set"); 
  })();

export const client = createClient({
  projectId: SANITY_PROJECT_ID,
  dataset: "production",
  apiVersion: "2025-09-23",
  useCdn: false,
});

const builder = imageUrlBuilder(client);

export function urlFor(source: SanityImageSource) {
  return builder.image(source)
}