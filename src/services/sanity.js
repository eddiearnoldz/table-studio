import { createClient } from '@sanity/client'
import { createImageUrlBuilder } from '@sanity/image-url'

export const client = createClient({
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID,
  dataset: import.meta.env.VITE_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
})

const builder = createImageUrlBuilder(client)

export function urlFor(source) {
  return builder.image(source)
}

export const queries = {
  homePage: `*[_type == "homePage"][0]{
    aboutText,
    contactEmail,
    instagramHandle,
    instagramUrl
  }`,

  eventsPage: `*[_type == "eventsPage"][0]{
    title,
    description
  }`,

  allEvents: `*[_type == "event"] | order(date desc){
    _id,
    title,
    date,
    slug,
    coverImage,
    gallery[]
  }`,
}
