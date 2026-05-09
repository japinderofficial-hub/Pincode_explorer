# Bangalore Pincode Explorer

A full-stack Next.js app for looking up Bangalore pincodes and locality names in both directions.

## Features

- Search by 6-digit pincode or locality/area name.
- API-backed lookup route for server-side filtering.
- Responsive UI with quick suggestions and result summaries.

## Tech Stack

- Next.js App Router
- TypeScript
- Serverless API route
- Plain CSS for a lightweight, custom design

## Run Locally

```bash
npm install
npm run dev
```

Open http://localhost:3000 and try a pincode like `560001` or an area like `Indiranagar`.

## API

`GET /api/lookup?q=560001`

`GET /api/lookup?q=indiranagar&mode=area`

The response includes matching Bangalore postal areas, grouped by pincode or matched by locality name.