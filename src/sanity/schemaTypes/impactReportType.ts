import {DocumentTextIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

export const impactReportType = defineType({
  name: 'impactReport',
  title: 'Impact Report',
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
      name: 'reportYear',
      title: 'Report Year',
      type: 'number',
      validation: (Rule) => Rule.required().min(2020).max(new Date().getFullYear()),
    }),
    defineField({
      name: 'summary',
      title: 'Summary',
      type: 'text',
      rows: 3,
      description: 'Brief summary of the impact report',
      validation: (Rule) => Rule.required().max(300),
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
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
      name: 'metrics',
      title: 'Impact Metrics',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'metric',
          fields: [
            defineField({
              name: 'title',
              type: 'string',
              title: 'Metric Title',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'value',
              type: 'string',
              title: 'Value',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'description',
              type: 'text',
              title: 'Description',
              rows: 2,
            }),
          ],
          preview: {
            select: {
              title: 'title',
              value: 'value',
            },
            prepare(selection) {
              const {title, value} = selection
              return {
                title: `${title}: ${value}`,
              }
            },
          },
        }),
      ],
    }),
    defineField({
      name: 'sections',
      title: 'Report Sections',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'section',
          fields: [
            defineField({
              name: 'title',
              type: 'string',
              title: 'Section Title',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'content',
              type: 'blockContent',
              title: 'Content',
            }),
            defineField({
              name: 'image',
              type: 'image',
              title: 'Section Image',
              options: {
                hotspot: true,
              },
            }),
          ],
          preview: {
            select: {
              title: 'title',
            },
            prepare(selection) {
              const {title} = selection
              return {
                title: title || 'Untitled Section',
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
      title: 'Featured Report',
      type: 'boolean',
      description: 'Mark this report as featured',
      initialValue: false,
    }),
    defineField({
      name: 'downloadUrl',
      title: 'Download URL',
      type: 'url',
      description: 'URL to download the full report PDF',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      year: 'reportYear',
      media: 'coverImage',
    },
    prepare(selection) {
      const {title, year, media} = selection
      return {
        title: title || 'Untitled Report',
        subtitle: year ? `Report ${year}` : 'No year set',
        media,
      }
    },
  },
})