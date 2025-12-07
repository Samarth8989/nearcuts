# NearCuts - Google Sheet Setup Guide

## Step 1: Create a Google Sheet

Create a new Google Sheet with the following columns:

| Column | Description | Example |
|--------|-------------|---------|
| id | Unique salon ID | 1, 2, 3... |
| name | Salon name | Style Studio |
| address | Full address | 123, 1st Cross, Koramangala |
| area | Area name (must match dropdown) | Koramangala |
| lat | Latitude | 12.9342 |
| lng | Longitude | 77.6260 |
| ownerName | Owner's name | Ravi Kumar |
| ownerPhone | Owner's WhatsApp (10 digits) | 9876543210 |
| rating | Rating (1-5) | 4.5 |
| reviewCount | Number of reviews | 48 |
| services | Services in JSON format | See below |

### Services Format (JSON):
```json
[
  {"name": "Haircut", "price": 150, "duration": "30 min"},
  {"name": "Beard Trim", "price": 80, "duration": "15 min"}
]
```

## Step 2: Get Coordinates

For each salon, get lat/lng from Google Maps:
1. Open Google Maps
2. Search for the salon address
3. Right-click on the exact location
4. Click the coordinates to copy them
5. First number is latitude, second is longitude

## Step 3: Publish Sheet as JSON (Optional - for auto-sync)

1. Go to Extensions > Apps Script
2. Create a web app that returns sheet data as JSON
3. Update data.js to fetch from your sheet URL

## Bangalore Areas List (Pre-configured)

The website has these areas configured:
- Koramangala
- HSR Layout
- Indiranagar
- Whitefield
- Marathahalli
- BTM Layout
- Jayanagar
- JP Nagar
- Banashankari
- Electronic City
- Bellandur
- Sarjapur Road
- Hebbal
- Yelahanka
- Rajajinagar
- Malleshwaram
- Basavanagudi
- MG Road
- Brigade Road
- Richmond Town
- Sadashivanagar
- RT Nagar
- Hennur
- KR Puram
- Bommanahalli

Make sure your salon's "area" matches one of these exactly.

## Step 4: Update data.js

Replace the SALONS_DATA array in data.js with your actual salon data.

---

## Sample Data Entry

```javascript
{
    id: 1,
    name: "Your Salon Name",
    address: "Full Address Here",
    area: "Koramangala", // Must match area list
    lat: 12.9342,        // From Google Maps
    lng: 77.6260,        // From Google Maps
    ownerName: "Owner Name",
    ownerPhone: "9876543210",
    rating: 4.5,
    reviewCount: 0,      // Start with 0 for new salons
    services: [
        { name: "Haircut", price: 150, duration: "30 min" },
        { name: "Beard Trim", price: 80, duration: "15 min" }
    ]
}
```
