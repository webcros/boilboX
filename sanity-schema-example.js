// Example Sanity Schema for Analytics
// Add this to your Sanity Studio's schemas folder

export default {
  name: 'analytics',
  title: 'Analytics',
  type: 'document',
  fields: [
    {
      name: 'location',
      title: 'Location',
      type: 'object',
      fields: [
        {
          name: 'address',
          title: 'Address',
          type: 'string',
        },
        {
          name: 'lat',
          title: 'Latitude',
          type: 'number',
        },
        {
          name: 'lng',
          title: 'Longitude',
          type: 'number',
        },
      ],
    },
    {
      name: 'pageViews',
      title: 'Page Views',
      type: 'number',
    },
    {
      name: 'uniqueVisitors',
      title: 'Unique Visitors',
      type: 'number',
    },
    {
      name: 'bounceRate',
      title: 'Bounce Rate (%)',
      type: 'number',
    },
    {
      name: 'avgSessionDuration',
      title: 'Average Session Duration (seconds)',
      type: 'number',
    },
    {
      name: 'createdAt',
      title: 'Created At',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    },
  ],
  preview: {
    select: {
      address: 'location.address',
      pageViews: 'pageViews',
    },
    prepare({ address, pageViews }) {
      return {
        title: address || 'Unknown Location',
        subtitle: `${pageViews || 0} page views`,
      };
    },
  },
};




