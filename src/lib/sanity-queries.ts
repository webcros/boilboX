import { sanityClient } from './sanity';
import {
  BlogPost,
  ImpactReport,
  KioskLocation,
  LiveKitchenVideo,
  Meal,
  Partner,
  Story,
  Testimonial,
} from './types';

const publishedFilter = '!(_id in path("drafts.**"))';

const mealFields = `
  _id,
  "slug": coalesce(slug.current, _id),
  name,
  description,
  price,
  calories,
  protein,
  carbs,
  fats,
  "image": coalesce(image.asset->url, ""),
  "imageAlt": image.alt,
  category,
  tags,
  featured,
  available,
  order
`;

// GROQ query to fetch all meals
// Includes meals where `available` is either true or not set (for older documents)
// and only meals with a defined image asset so menu cards always have an image
export const mealsQuery = `*[_type == "meal" && ${publishedFilter} && (!defined(available) || available == true)] | order(order asc, name asc) {${mealFields}}`;

// Fetch all meals from Sanity
export async function getMeals(): Promise<Meal[]> {
  const meals = await sanityClient.fetch(mealsQuery);
  return meals.map(mapMeal);
}

// Fetch featured meals (for homepage)
export async function getFeaturedMeals(limit: number = 3): Promise<Meal[]> {
  try {
    const query = `*[_type == "meal" && ${publishedFilter} && (!defined(available) || available == true)]
      | order(coalesce(publishedAt, _createdAt) desc) {${mealFields}}`;

    const meals = await sanityClient.fetch(query);
    return meals.map(mapMeal);
  } catch {
    return [];
  }
}

// Fetch meals by category
export async function getMealsByCategory(category: string): Promise<Meal[]> {
  const query = `*[_type == "meal" && ${publishedFilter} && category == $category && (!defined(available) || available == true)] | order(order asc, name asc) {${mealFields}}`;

  const meals = await sanityClient.fetch(query, { category });
  return meals.map(mapMeal);
}

export async function getMealBySlug(slug: string): Promise<Meal | null> {
  try {
    const query = `*[_type == "meal" && (slug.current == $slug || _id == $slug)][0]{${mealFields}}`;
    const meal = await sanityClient.fetch(query, { slug });
    return meal ? mapMeal(meal) : null;
  } catch {
    return null;
  }
}

export async function getMealSlugs(): Promise<string[]> {
  try {
    const query = `*[_type == "meal" && defined(slug.current)].slug.current`;
    return await sanityClient.fetch(query);
  } catch {
    return [];
  }
}

export async function getTestimonials(): Promise<Testimonial[]> {
  try {
    const query = `*[_type == "testimonial" && ${publishedFilter}] | order(coalesce(isFeatured, false) desc, publishedAt desc) {
      _id,
      name,
      role,
      quote,
      "avatar": avatar.asset->url,
      rating,
      "featuredMealId": meal._ref
    }`;
    const testimonials = await sanityClient.fetch(query);
    return testimonials.map((t: any) => ({
      id: t._id,
      name: t.name,
      role: t.role || '',
      quote: t.quote,
      avatar: t.avatar || '',
      rating: t.rating,
      featuredMealId: t.featuredMealId,
    }));
  } catch {
    return [];
  }
}

export async function getLocations(): Promise<KioskLocation[]> {
  try {
    const query = `*[_type == "location" && ${publishedFilter}] | order(order asc, name asc) {
      _id,
      name,
      "slug": slug.current,
      address,
      coordinates,
      status,
      availability,
      distance,
      features,
      operator {
        name,
        quote,
        "avatar": avatar.asset->url
      }
    }`;

    const locations = await sanityClient.fetch(query);
    return locations.map((loc: any) => {
      const statusLabel = mapLocationStatus(loc);
      const address = loc.address
        ? `${loc.address.street || ''}${loc.address.street ? ', ' : ''}${loc.address.city || ''}${loc.address.city ? ', ' : ''}${loc.address.state || ''} ${loc.address.zipCode || ''}`.trim()
        : '';

      return {
        id: loc._id,
        name: loc.name,
        address,
        status: statusLabel,
        closingTime: loc.availability?.closingTime || undefined,
        distance: loc.distance || '',
        lat: loc.coordinates?.lat || 0,
        lng: loc.coordinates?.lng || 0,
        wheelchairAccessible: (loc.features || []).includes('wheelchair-accessible'),
        ebtAccepted: (loc.features || []).includes('ebt-accepted'),
        operator: loc.operator?.name
          ? {
              name: loc.operator.name,
              avatar: loc.operator.avatar || '',
              quote: loc.operator.quote || '',
            }
          : undefined,
      } as KioskLocation;
    });
  } catch {
    return [];
  }
}

export async function getPartners(): Promise<Partner[]> {
  try {
    const query = `*[_type == "partner" && ${publishedFilter} && defined(slug.current)] | order(coalesce(featured, false) desc, name asc) {
      _id,
      name,
      "slug": slug.current,
      "logo": logo.asset->url,
      type,
      description,
      website,
      featured,
      testimonials,
      socialLinks
    }`;
    const partners = await sanityClient.fetch(query);
    return partners.map((partner: any) => ({
      id: partner._id,
      name: partner.name,
      slug: partner.slug,
      logo: partner.logo || '',
      type: partner.type,
      description: partner.description,
      website: partner.website,
      featured: partner.featured,
      testimonials: partner.testimonials || [],
      socialLinks: partner.socialLinks || undefined,
    }));
  } catch {
    return [];
  }
}

export async function getStories(): Promise<Story[]> {
  try {
    const query = `*[_type == "story" && ${publishedFilter} && defined(slug.current)] | order(coalesce(isFeatured, false) desc, publishedAt desc) {
      _id,
      title,
      "slug": slug.current,
      subtitle,
      summary,
      "heroImage": heroImage.asset->url,
      "heroImageAlt": heroImage.alt,
      chapters[]{
        title,
        "image": image.asset->url,
        content,
        order
      },
      keyMoments[]{
        year,
        title,
        description,
        "image": image.asset->url
      },
      publishedAt,
      isFeatured,
      seoTitle,
      seoDescription
    }`;
    const stories = await sanityClient.fetch(query);
    return stories.map(mapStory);
  } catch {
    return [];
  }
}

export async function getStoryBySlug(slug: string): Promise<Story | null> {
  try {
    const query = `*[_type == "story" && ${publishedFilter} && slug.current == $slug][0]{
      _id,
      title,
      "slug": slug.current,
      subtitle,
      summary,
      "heroImage": heroImage.asset->url,
      "heroImageAlt": heroImage.alt,
      chapters[]{
        title,
        "image": image.asset->url,
        content,
        order
      },
      keyMoments[]{
        year,
        title,
        description,
        "image": image.asset->url
      },
      publishedAt,
      isFeatured,
      seoTitle,
      seoDescription
    }`;
    const story = await sanityClient.fetch(query, { slug });
    return story ? mapStory(story) : null;
  } catch {
    return null;
  }
}

export async function getStorySlugs(): Promise<string[]> {
  try {
    const query = `*[_type == "story" && ${publishedFilter} && defined(slug.current)].slug.current`;
    return await sanityClient.fetch(query);
  } catch {
    return [];
  }
}

export async function getImpactReports(): Promise<ImpactReport[]> {
  try {
    const query = `*[_type == "impactReport" && ${publishedFilter} && defined(slug.current)] | order(coalesce(isFeatured, false) desc, publishedAt desc) {
      _id,
      title,
      "slug": slug.current,
      reportYear,
      summary,
      "coverImage": coverImage.asset->url,
      "coverImageAlt": coverImage.alt,
      metrics[]{
        title,
        value,
        description
      },
      sections[]{
        title,
        content,
        "image": image.asset->url
      },
      publishedAt,
      isFeatured,
      downloadUrl
    }`;
    const reports = await sanityClient.fetch(query);
    return reports.map(mapImpactReport);
  } catch {
    return [];
  }
}

export async function getImpactReportBySlug(slug: string): Promise<ImpactReport | null> {
  try {
    const query = `*[_type == "impactReport" && ${publishedFilter} && slug.current == $slug][0]{
      _id,
      title,
      "slug": slug.current,
      reportYear,
      summary,
      "coverImage": coverImage.asset->url,
      "coverImageAlt": coverImage.alt,
      metrics[]{
        title,
        value,
        description
      },
      sections[]{
        title,
        content,
        "image": image.asset->url
      },
      publishedAt,
      isFeatured,
      downloadUrl
    }`;
    const report = await sanityClient.fetch(query, { slug });
    return report ? mapImpactReport(report) : null;
  } catch {
    return null;
  }
}

export async function getImpactReportSlugs(): Promise<string[]> {
  try {
    const query = `*[_type == "impactReport" && ${publishedFilter} && defined(slug.current)].slug.current`;
    return await sanityClient.fetch(query);
  } catch {
    return [];
  }
}

export async function getPosts(): Promise<BlogPost[]> {
  try {
    const query = `*[_type == "post" && ${publishedFilter} && defined(slug.current) && isPublished == true] | order(publishedAt desc) {
      _id,
      title,
      "slug": slug.current,
      excerpt,
      "mainImage": mainImage.asset->url,
      "mainImageAlt": mainImage.alt,
      "mainImageCaption": mainImage.caption,
      author->{
        _id,
        name,
        "slug": slug.current,
        "image": image.asset->url,
        bio
      },
      categories[]->{
        _id,
        title,
        "slug": slug.current,
        description
      },
      tags,
      publishedAt,
      readingTime,
      seoTitle,
      seoDescription,
      body
    }`;
    const posts = await sanityClient.fetch(query);
    return posts.map(mapBlogPost);
  } catch {
    return [];
  }
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const query = `*[_type == "post" && ${publishedFilter} && slug.current == $slug && isPublished == true][0]{
      _id,
      title,
      "slug": slug.current,
      excerpt,
      "mainImage": mainImage.asset->url,
      "mainImageAlt": mainImage.alt,
      "mainImageCaption": mainImage.caption,
      author->{
        _id,
        name,
        "slug": slug.current,
        "image": image.asset->url,
        bio
      },
      categories[]->{
        _id,
        title,
        "slug": slug.current,
        description
      },
      tags,
      publishedAt,
      readingTime,
      seoTitle,
      seoDescription,
      body
    }`;
    const post = await sanityClient.fetch(query, { slug });
    return post ? mapBlogPost(post) : null;
  } catch {
    return null;
  }
}

export async function getPostSlugs(): Promise<string[]> {
  try {
    const query = `*[_type == "post" && ${publishedFilter} && defined(slug.current) && isPublished == true].slug.current`;
    return await sanityClient.fetch(query);
  } catch {
    return [];
  }
}

const mapMeal = (meal: any): Meal => ({
  id: meal._id,
  slug: meal.slug,
  name: meal.name,
  description: meal.description,
  price: meal.price,
  calories: meal.calories,
  protein: meal.protein,
  carbs: meal.carbs,
  fats: meal.fats,
  image: meal.image || '',
  imageAlt: meal.imageAlt || undefined,
  category: meal.category as Meal['category'],
  tags: meal.tags || [],
});

const mapStory = (story: any): Story => ({
  id: story._id,
  title: story.title,
  slug: story.slug,
  subtitle: story.subtitle || undefined,
  summary: story.summary || undefined,
  heroImage: story.heroImage || '',
  heroImageAlt: story.heroImageAlt || undefined,
  chapters: (story.chapters || []).sort((a: any, b: any) => (a.order || 0) - (b.order || 0)),
  keyMoments: story.keyMoments || [],
  publishedAt: story.publishedAt,
  isFeatured: story.isFeatured,
  seoTitle: story.seoTitle || undefined,
  seoDescription: story.seoDescription || undefined,
});

const mapImpactReport = (report: any): ImpactReport => ({
  id: report._id,
  title: report.title,
  slug: report.slug,
  reportYear: report.reportYear,
  summary: report.summary,
  coverImage: report.coverImage || '',
  coverImageAlt: report.coverImageAlt || undefined,
  metrics: report.metrics || [],
  sections: report.sections || [],
  publishedAt: report.publishedAt,
  isFeatured: report.isFeatured,
  downloadUrl: report.downloadUrl || undefined,
});

const mapBlogPost = (post: any): BlogPost => ({
  id: post._id,
  title: post.title,
  slug: post.slug,
  excerpt: post.excerpt || undefined,
  mainImage: post.mainImage || '',
  mainImageAlt: post.mainImageAlt || undefined,
  mainImageCaption: post.mainImageCaption || undefined,
  author: post.author,
  categories: post.categories || [],
  tags: post.tags || [],
  publishedAt: post.publishedAt,
  readingTime: post.readingTime || undefined,
  seoTitle: post.seoTitle || undefined,
  seoDescription: post.seoDescription || undefined,
  body: post.body,
});

const mapLocationStatus = (location: any): KioskLocation['status'] => {
  if (location.availability?.isOpenNow || location.status === 'open') {
    return 'Open Now';
  }
  if (location.status === 'opening-soon') {
    return 'Opening Soon';
  }
  if (location.status === 'closed' || location.status === 'temporarily-closed' || location.status === 'permanently-closed') {
    return 'Closed';
  }
  return 'Closed';
};

// ── Live Kitchen Videos ──────────────────────────────────────────────

const liveKitchenVideoFields = `
  _id,
  title,
  description,
  "videoUrl": video.asset->url,
  "thumbnailUrl": thumbnail.asset->url,
  "thumbnailAlt": thumbnail.alt,
  label,
  featured,
  order,
  publishedAt
`;

export const liveKitchenVideosQuery = `*[_type == "liveKitchenVideo" && ${publishedFilter}] | order(coalesce(featured, false) desc, order asc, publishedAt desc) {${liveKitchenVideoFields}}`;

export async function getLiveKitchenVideos(): Promise<LiveKitchenVideo[]> {
  try {
    const videos = await sanityClient.fetch(liveKitchenVideosQuery);
    return videos.map((v: any): LiveKitchenVideo => ({
      id: v._id,
      title: v.title,
      description: v.description || '',
      videoUrl: v.videoUrl || '',
      thumbnailUrl: v.thumbnailUrl || '',
      thumbnailAlt: v.thumbnailAlt || '',
      label: v.label || '',
      featured: v.featured || false,
      order: v.order || 0,
      publishedAt: v.publishedAt || '',
    }));
  } catch {
    return [];
  }
}



