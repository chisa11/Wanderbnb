// utils/geocoding.js
const axios = require('axios');               // HTTP client
const MAPTILER_KEY = process.env.MAPTILER_API_KEY; // key from .env

if (!MAPTILER_KEY) {
  throw new Error('MAPTILER_API_KEY is not set in environment');
}

async function geocodeLocation(location) {
  // 1) Build the request URL. MapTiler expects the query text URL-encoded.
  const url = `https://api.maptiler.com/geocoding/${encodeURIComponent(location)}.json?key=${MAPTILER_KEY}`;

  // 2) Make the GET request to MapTiler geocoding endpoint
  const response = await axios.get(url);

  // 3) Check response structure and presence of results
  // MapTiler returns an object with `features` (GeoJSON-like, similar to Mapbox)
  if (!response.data || !response.data.features || response.data.features.length === 0) {
    throw new Error('No coordinates found for that location');
  }

  // 4) Return the first feature's geometry object, e.g. { type: "Point", coordinates: [lng, lat] }
  return response.data.features[0].geometry;
}

module.exports = geocodeLocation;
