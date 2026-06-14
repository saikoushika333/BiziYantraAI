
export const BUSINESS_TYPES = [
  "Restaurant",
  "Cafe",
  "Coffee Shop",
  "Gym",
  "Retail Store",
  "Grocery Store",
  "Pharmacy",
  "Salon",
  "Electronics Store",
  "Bakery",
  "Fast Food",
  "Co-working Space",
  "Diagnostic Center"
];

export interface LocationData {
  name: string;
  lat: number;
  lng: number;
}

export const VIZAG_LOCATIONS: LocationData[] = [
  { name: "Gajuwaka", lat: 17.6912, lng: 83.2085 },
  { name: "MVP Colony", lat: 17.7410, lng: 83.3320 },
  { name: "Siripuram", lat: 17.7214, lng: 83.3155 },
  { name: "Madhurawada", lat: 17.8188, lng: 83.3444 },
  { name: "Dwaraka Nagar", lat: 17.7233, lng: 83.3039 },
  { name: "Seethammadhara", lat: 17.7420, lng: 83.3110 },
  { name: "Waltair Uplands", lat: 17.7200, lng: 83.3250 },
  { name: "Akkayyapalem", lat: 17.7275, lng: 83.2954 },
  { name: "Kurmannapalem", lat: 17.6515, lng: 83.1585 },
  { name: "Jagadamba Junction", lat: 17.7110, lng: 83.3005 },
  { name: "Rushikonda", lat: 17.7820, lng: 83.3840 }
];

export const VIZAG_CENTER = VIZAG_LOCATIONS[0];

export const DEFAULT_INPUTS = {
  businessType: "Cafe",
  locationName: VIZAG_LOCATIONS[0].name,
  latitude: VIZAG_LOCATIONS[0].lat,
  longitude: VIZAG_LOCATIONS[0].lng,
  budget: 15, // Lakhs
  area: 120, // Sq.M
  radius: 3 // KM
};
