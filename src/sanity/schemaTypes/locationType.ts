import {UserIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

export const locationType = defineType({
  name: 'location',
  title: 'Location',
  type: 'document',
  icon: UserIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Location Name',
      type: 'string',
      validation: (Rule) => Rule.required().min(5).max(100),
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
      name: 'address',
      title: 'Address',
      type: 'object',
      fields: [
        defineField({
          name: 'street',
          type: 'string',
          title: 'Street Address',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'city',
          type: 'string',
          title: 'City',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'state',
          type: 'string',
          title: 'State/Province',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'zipCode',
          type: 'string',
          title: 'ZIP/Postal Code',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'country',
          type: 'string',
          title: 'Country',
          validation: (Rule) => Rule.required(),
        }),
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'coordinates',
      title: 'Coordinates',
      type: 'geopoint',
      description: 'Latitude and longitude for the location',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Open Now', value: 'open' },
          { title: 'Closed', value: 'closed' },
          { title: 'Opening Soon', value: 'opening-soon' },
          { title: 'Temporarily Closed', value: 'temporarily-closed' },
          { title: 'Permanently Closed', value: 'permanently-closed' },
        ],
        layout: 'radio',
      },
      initialValue: 'closed',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'openingHours',
      title: 'Opening Hours',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'dayHours',
          fields: [
            defineField({
              name: 'day',
              type: 'string',
              title: 'Day of Week',
              options: {
                list: [
                  { title: 'Monday', value: 'monday' },
                  { title: 'Tuesday', value: 'tuesday' },
                  { title: 'Wednesday', value: 'wednesday' },
                  { title: 'Thursday', value: 'thursday' },
                  { title: 'Friday', value: 'friday' },
                  { title: 'Saturday', value: 'saturday' },
                  { title: 'Sunday', value: 'sunday' },
                ],
                layout: 'dropdown',
              },
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'openTime',
              type: 'string',
              title: 'Opening Time',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'closeTime',
              type: 'string',
              title: 'Closing Time',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'isOpen',
              type: 'boolean',
              title: 'Is Open',
              initialValue: true,
            }),
          ],
          preview: {
            select: {
              day: 'day',
              openTime: 'openTime',
              closeTime: 'closeTime',
              isOpen: 'isOpen',
            },
            prepare(selection) {
              const {day, openTime, closeTime, isOpen} = selection
              const dayTitle = day ? day.charAt(0).toUpperCase() + day.slice(1) : 'Unknown Day'
              const status = isOpen ? `${openTime} - ${closeTime}` : 'Closed'
              return {
                title: dayTitle,
                subtitle: status,
              }
            },
          },
        }),
      ],
    }),
    defineField({
      name: 'contactInfo',
      title: 'Contact Information',
      type: 'object',
      fields: [
        defineField({
          name: 'phone',
          type: 'string',
          title: 'Phone Number',
        }),
        defineField({
          name: 'email',
          type: 'string',
          title: 'Email',
          validation: (Rule) => Rule.email(),
        }),
        defineField({
          name: 'manager',
          type: 'string',
          title: 'Manager Name',
        }),
      ],
    }),
    defineField({
      name: 'kioskImage',
      title: 'Kiosk Image',
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
    }),
    defineField({
      name: 'features',
      title: 'Features',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'string',
          options: {
            list: [
              { title: 'Wheelchair Accessible', value: 'wheelchair-accessible' },
              { title: 'EBT Accepted', value: 'ebt-accepted' },
              { title: 'Outdoor Seating', value: 'outdoor-seating' },
              { title: 'Free WiFi', value: 'free-wifi' },
              { title: 'Parking Available', value: 'parking' },
              { title: 'Drive-through', value: 'drive-through' },
              { title: 'Delivery Available', value: 'delivery' },
              { title: 'Curbside Pickup', value: 'curbside-pickup' },
            ],
          },
        }),
      ],
    }),
    defineField({
      name: 'distance',
      title: 'Distance from User',
      type: 'string',
      description: 'Distance shown to users (e.g., "0.3 miles away")',
    }),
    defineField({
      name: 'operator',
      title: 'Kiosk Operator',
      type: 'object',
      fields: [
        defineField({
          name: 'name',
          type: 'string',
          title: 'Operator Name',
        }),
        defineField({
          name: 'avatar',
          type: 'image',
          title: 'Operator Avatar',
          options: {
            hotspot: true,
          },
        }),
        defineField({
          name: 'quote',
          type: 'string',
          title: 'Operator Quote',
          description: 'A quote from the operator about the location',
        }),
      ],
    }),
    defineField({
      name: 'availability',
      title: 'Availability',
      type: 'object',
      fields: [
        defineField({
          name: 'isOpenNow',
          type: 'boolean',
          title: 'Is Open Now',
          description: 'Automatically calculated based on opening hours',
          initialValue: false,
        }),
        defineField({
          name: 'closingTime',
          type: 'string',
          title: 'Closing Time Today',
          description: 'Today\'s closing time',
        }),
      ],
    }),
    defineField({
      name: 'socialImpact',
      title: 'Social Impact',
      type: 'object',
      fields: [
        defineField({
          name: 'mealsDonated',
          type: 'number',
          title: 'Meals Donated',
          description: 'Number of meals donated through this location',
        }),
        defineField({
          name: 'localFarmers',
          type: 'number',
          title: 'Local Farmers Supported',
          description: 'Number of local farmers supported by this location',
        }),
      ],
    }),
    defineField({
      name: 'seoTitle',
      title: 'SEO Title',
      type: 'string',
      description: 'Title for SEO purposes',
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
    defineField({
      name: 'isFeatured',
      title: 'Featured Location',
      type: 'boolean',
      description: 'Show this location prominently',
      initialValue: false,
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Lower numbers appear first',
      initialValue: 0,
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'address.city',
      media: 'kioskImage',
    },
    prepare(selection) {
      const {title, subtitle, media} = selection
      return {
        title: title || 'No name',
        subtitle: subtitle ? `Location in ${subtitle}` : 'No city specified',
        media,
      }
    },
  },
  orderings: [
    {
      title: 'Display Order',
      name: 'displayOrder',
      by: [{ field: 'order', direction: 'asc' }],
    },
    {
      title: 'Location Name',
      name: 'nameAsc',
      by: [{ field: 'name', direction: 'asc' }],
    },
    {
      title: 'Status',
      name: 'status',
      by: [{ field: 'status', direction: 'asc' }],
    },
  ],
})