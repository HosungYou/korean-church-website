# Korean-American Church Website

A bilingual (Korean/English) church website built with Next.js, TypeScript, and Tailwind CSS.

## Features

- 🌐 Full Korean/English language support
- 📱 Mobile responsive design
- 🗺️ Google Maps integration for directions
- 💳 Online giving information with multiple payment methods
- 📹 YouTube sermon integration
- ⏰ Service times with timezone support (EST/EDT)

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Google Maps Setup

To enable the Google Maps feature on the directions page:

1. Get a Google Maps API key from [Google Cloud Console](https://console.cloud.google.com/)
2. Replace `YOUR_GOOGLE_MAPS_API_KEY` in `/src/pages/directions.tsx` with your actual API key

## Pages

- **Home** - Church introduction, service times, latest sermons
- **About** - Church vision, history, pastor's message
- **Service Times** - Detailed schedule for all services
- **Sermons** - Video sermons with language filtering
- **Church News** - Announcements and events
- **Directions** - Google Maps integration with parking info
- **New Here?** - Information for first-time visitors
- **Online Giving** - Payment methods and tax information

## Technology Stack

- Next.js 15
- TypeScript
- Tailwind CSS
- next-i18next for internationalization
- Google Maps API

## Deployment

Build for production:
```bash
npm run build
```

Start production server:
```bash
npm start
```