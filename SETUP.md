# Setup Instructions

This project integrates Sanity CMS and Google Maps API to display analytics data on an admin page.

## Prerequisites

1. A Sanity account and project
2. A Google Maps API key

## Installation Steps

### 1. Install Dependencies

Dependencies are already installed. If you need to reinstall:

```bash
npm install
```

### 2. Set Up Sanity CMS

1. Create a Sanity account at [sanity.io](https://www.sanity.io/)
2. Create a new project or use an existing one
3. Note your Project ID and Dataset name

### 3. Create Sanity Schema

Add the analytics schema to your Sanity Studio. See `sanity-schema-example.js` for the schema definition.

The schema includes:
- Location (address, latitude, longitude)
- Page Views
- Unique Visitors
- Bounce Rate
- Average Session Duration

### 4. Get Google Maps API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Maps JavaScript API
4. Create credentials (API Key)
5. Restrict the API key to your domain (recommended for production)

### 5. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
# Sanity CMS Configuration
NEXT_PUBLIC_SANITY_PROJECT_ID=your_sanity_project_id
NEXT_PUBLIC_SANITY_DATASET=production

# Google Maps API
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

Replace the placeholder values with your actual credentials.

### 6. Add Sample Data to Sanity

Add some analytics documents to your Sanity CMS with the following structure:

```json
{
  "location": {
    "address": "New York, NY",
    "lat": 40.7128,
    "lng": -74.0060
  },
  "pageViews": 1500,
  "uniqueVisitors": 800,
  "bounceRate": 45.5,
  "avgSessionDuration": 120
}
```

### 7. Run the Development Server

```bash
npm run dev
```

### 8. Access the Admin Page

Navigate to `http://localhost:3000/admin` to see the analytics dashboard.

## Features

- **Analytics Dashboard**: View summary statistics (total page views, unique visitors, bounce rate, average session duration)
- **Google Maps Integration**: Interactive map showing analytics data by location
- **Data Table**: Detailed table view of all analytics entries
- **Real-time Updates**: Refresh button to fetch latest data from Sanity

## Troubleshooting

### Map not loading
- Verify your Google Maps API key is correct
- Check that the Maps JavaScript API is enabled in Google Cloud Console
- Ensure your API key restrictions allow your domain

### No data showing
- Verify your Sanity Project ID and Dataset are correct
- Check that you have created analytics documents in Sanity
- Ensure the document type is named "analytics" (matching the schema)

### API errors
- Check browser console for detailed error messages
- Verify all environment variables are set correctly
- Ensure your Sanity project has the correct permissions




