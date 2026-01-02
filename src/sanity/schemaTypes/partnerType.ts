import {UserIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const partnerType = defineType({
  name: 'partner',
  title: 'Partner',
  type: 'document',
  icon: UserIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Partner Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
      options: {
        hotspot: true,
      },
      description: 'Partner logo',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'type',
      title: 'Partner Type',
      type: 'string',
      options: {
        list: [
          { title: 'Franchise', value: 'franchise' },
          { title: 'Supplier', value: 'supplier' },
          { title: 'Location Operator', value: 'location-operator' },
          { title: 'Community Partner', value: 'community-partner' },
          { title: 'Other', value: 'other' },
        ],
        layout: 'dropdown',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      description: 'Brief description of the partnership',
      validation: (Rule) => Rule.required().max(500),
    }),
    defineField({
      name: 'website',
      title: 'Website',
      type: 'url',
      description: 'Partner website URL',
    }),
    defineField({
      name: 'startDate',
      title: 'Partnership Start Date',
      type: 'date',
      description: 'Date when the partnership started',
    }),
    defineField({
      name: 'featured',
      title: 'Featured Partner',
      type: 'boolean',
      description: 'Show this partner prominently',
      initialValue: false,
    }),
    defineField({
      name: 'contactInfo',
      title: 'Contact Information',
      type: 'object',
      fields: [
        defineField({
          name: 'email',
          type: 'email',
          title: 'Email',
        }),
        defineField({
          name: 'phone',
          type: 'string',
          title: 'Phone',
        }),
        defineField({
          name: 'address',
          type: 'text',
          title: 'Address',
          rows: 3,
        }),
      ],
    }),
    defineField({
      name: 'testimonials',
      title: 'Partner Testimonials',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'testimonial',
          fields: [
            defineField({
              name: 'quote',
              type: 'text',
              title: 'Quote',
              rows: 3,
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'author',
              type: 'string',
              title: 'Author',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'role',
              type: 'string',
              title: 'Author Role',
            }),
          ],
        },
      ],
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social Media Links',
      type: 'object',
      fields: [
        defineField({
          name: 'facebook',
          type: 'url',
          title: 'Facebook',
        }),
        defineField({
          name: 'instagram',
          type: 'url',
          title: 'Instagram',
        }),
        defineField({
          name: 'linkedin',
          type: 'url',
          title: 'LinkedIn',
        }),
        defineField({
          name: 'twitter',
          type: 'url',
          title: 'Twitter',
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'type',
      media: 'logo',
    },
    prepare(selection) {
      const {title, subtitle, media} = selection
      return {
        title: title || 'No name',
        subtitle: subtitle ? `Partner Type: ${subtitle}` : 'No type',
        media,
      }
    },
  },
})