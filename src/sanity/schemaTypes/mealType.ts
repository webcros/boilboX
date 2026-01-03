import { defineType, defineField } from 'sanity';

export const mealType = defineType({
  name: 'meal',
  title: 'Meal',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Meal Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'price',
      title: 'Price',
      type: 'number',
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: 'calories',
      title: 'Calories',
      type: 'number',
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: 'protein',
      title: 'Protein (e.g., "32g")',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'carbs',
      title: 'Carbs (e.g., "12g")',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'fats',
      title: 'Fats (optional, e.g., "5g")',
      type: 'string',
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
        },
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'High Protein', value: 'High Protein' },
          { title: 'Vegan', value: 'Vegan' },
          { title: 'Low Carb', value: 'Low Carb' },
          { title: 'Heart Healthy', value: 'Heart Healthy' },
          { title: 'Balanced', value: 'Balanced' },
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags',
      },
    }),
    defineField({
      name: 'featured',
      title: 'Featured Meal',
      type: 'boolean',
      description: 'Show this meal on the homepage',
      initialValue: false,
    }),
    defineField({
      name: 'available',
      title: 'Available',
      type: 'boolean',
      description: 'Is this meal currently available?',
      initialValue: true,
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
      subtitle: 'category',
      media: 'image',
      price: 'price',
    },
    prepare({ title, subtitle, media, price }) {
      // Ensure media is a proper image asset and not a raw URL
      const imageUrl = media && typeof media === 'object' && media.asset ? media : null;
      
      return {
        title,
        subtitle: `${subtitle} - $${price?.toFixed(2) || '0.00'}`,
        media: imageUrl,
      };
    },
  },
  orderings: [
    {
      title: 'Display Order',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
    {
      title: 'Price: Low to High',
      name: 'priceAsc',
      by: [{ field: 'price', direction: 'asc' }],
    },
    {
      title: 'Price: High to Low',
      name: 'priceDesc',
      by: [{ field: 'price', direction: 'desc' }],
    },
    {
      title: 'Name A-Z',
      name: 'nameAsc',
      by: [{ field: 'name', direction: 'asc' }],
    },
  ],
});

