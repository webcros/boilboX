import {DocumentTextIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

export const storyType = defineType({
  name: 'story',
  title: 'Our Story',
  type: 'document',
  icon: DocumentTextIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required().min(10).max(120),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtitle',
      type: 'string',
      description: 'A brief subtitle or tagline for the story',
      validation: (Rule) => Rule.max(150),
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: 'alt',
          type: 'string',
          title: 'Alternative text',
        }),
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'summary',
      title: 'Summary',
      type: 'text',
      rows: 3,
      description: 'Brief summary of the story',
      validation: (Rule) => Rule.max(300),
    }),
    defineField({
      name: 'chapters',
      title: 'Story Chapters',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'chapter',
          fields: [
            defineField({
              name: 'title',
              type: 'string',
              title: 'Chapter Title',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'image',
              type: 'image',
              title: 'Chapter Image',
              options: {
                hotspot: true,
              },
            }),
            defineField({
              name: 'content',
              type: 'blockContent',
              title: 'Content',
            }),
            defineField({
              name: 'order',
              type: 'number',
              title: 'Display Order',
              description: 'Lower numbers appear first',
              initialValue: 0,
            }),
          ],
          preview: {
            select: {
              title: 'title',
              order: 'order',
            },
            prepare(selection) {
              const {title, order} = selection
              return {
                title: title || 'Untitled Chapter',
                subtitle: order !== undefined ? `Order: ${order}` : 'No order set',
              }
            },
          },
        }),
      ],
    }),
    defineField({
      name: 'keyMoments',
      title: 'Key Moments',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'moment',
          fields: [
            defineField({
              name: 'year',
              type: 'number',
              title: 'Year',
              validation: (Rule) => Rule.required().min(2000).max(new Date().getFullYear() + 1),
            }),
            defineField({
              name: 'title',
              type: 'string',
              title: 'Title',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'description',
              type: 'text',
              title: 'Description',
              rows: 2,
            }),
            defineField({
              name: 'image',
              type: 'image',
              title: 'Image',
              options: {
                hotspot: true,
              },
            }),
          ],
          preview: {
            select: {
              title: 'title',
              year: 'year',
            },
            prepare(selection) {
              const {title, year} = selection
              return {
                title: title || 'Untitled Moment',
                subtitle: year ? `Year: ${year}` : 'No year set',
              }
            },
          },
        }),
      ],
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'isFeatured',
      title: 'Featured Story',
      type: 'boolean',
      description: 'Mark this story as featured',
      initialValue: false,
    }),
    defineField({
      name: 'seoTitle',
      title: 'SEO Title',
      type: 'string',
      description: 'Title for SEO purposes (if different from main title)',
      validation: (Rule) => Rule.max(60),
    }),
    defineField({
      name: 'seoDescription',
      title: 'SEO Description',
      type: 'text',
      rows: 3,
      description: 'Description for SEO purposes',
      validation: (Rule) => Rule.max(160),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'subtitle',
      media: 'heroImage',
    },
    prepare(selection) {
      const {title, subtitle, media} = selection
      return {
        title: title || 'Untitled Story',
        subtitle: subtitle || 'No subtitle',
        media,
      }
    },
  },
})