// Bangalore Areas with Coordinates
const BANGALORE_AREAS = [
    { name: "Koramangala", lat: 12.9352, lng: 77.6245 },
    { name: "HSR Layout", lat: 12.9116, lng: 77.6389 },
    { name: "Indiranagar", lat: 12.9784, lng: 77.6408 },
    { name: "Whitefield", lat: 12.9698, lng: 77.7500 },
    { name: "Marathahalli", lat: 12.9591, lng: 77.6974 },
    { name: "BTM Layout", lat: 12.9166, lng: 77.6101 },
    { name: "Jayanagar", lat: 12.9308, lng: 77.5838 },
    { name: "JP Nagar", lat: 12.9063, lng: 77.5857 },
    { name: "Banashankari", lat: 12.9255, lng: 77.5468 },
    { name: "Electronic City", lat: 12.8399, lng: 77.6770 },
    { name: "Bellandur", lat: 12.9262, lng: 77.6762 },
    { name: "Sarjapur Road", lat: 12.9107, lng: 77.6872 },
    { name: "Hebbal", lat: 13.0358, lng: 77.5970 },
    { name: "Yelahanka", lat: 13.1007, lng: 77.5963 },
    { name: "Rajajinagar", lat: 12.9914, lng: 77.5521 },
    { name: "Malleshwaram", lat: 13.0035, lng: 77.5647 },
    { name: "Basavanagudi", lat: 12.9425, lng: 77.5756 },
    { name: "MG Road", lat: 12.9758, lng: 77.6045 },
    { name: "Brigade Road", lat: 12.9716, lng: 77.6070 },
    { name: "Richmond Town", lat: 12.9634, lng: 77.5987 },
    { name: "Sadashivanagar", lat: 13.0067, lng: 77.5819 },
    { name: "RT Nagar", lat: 13.0211, lng: 77.5967 },
    { name: "Hennur", lat: 13.0450, lng: 77.6380 },
    { name: "KR Puram", lat: 13.0073, lng: 77.6969 },
    { name: "Bommanahalli", lat: 12.9010, lng: 77.6185 }
];

// Dummy Salon Data
// Replace this with real data from Google Sheet later
const SALONS_DATA = [
    {
        id: 1,
        name: "Style Studio",
        address: "123, 1st Cross, Koramangala 4th Block",
        area: "Koramangala",
        lat: 12.9342,
        lng: 77.6260,
        ownerName: "Ravi Kumar",
        ownerPhone: "9876543210",
        rating: 4.5,
        reviewCount: 48,
        services: [
            { name: "Haircut", price: 150, duration: "30 min" },
            { name: "Beard Trim", price: 80, duration: "15 min" },
            { name: "Hair + Beard Combo", price: 200, duration: "45 min" },
            { name: "Head Massage", price: 100, duration: "20 min" },
            { name: "Hair Color", price: 400, duration: "60 min" },
            { name: "Facial", price: 350, duration: "45 min" }
        ]
    },
    {
        id: 2,
        name: "Classic Cuts",
        address: "45, 80 Feet Road, Koramangala 6th Block",
        area: "Koramangala",
        lat: 12.9365,
        lng: 77.6190,
        ownerName: "Suresh Babu",
        ownerPhone: "9876543211",
        rating: 4.2,
        reviewCount: 32,
        services: [
            { name: "Haircut", price: 120, duration: "25 min" },
            { name: "Beard Trim", price: 60, duration: "15 min" },
            { name: "Shave", price: 80, duration: "20 min" },
            { name: "Hair Wash", price: 50, duration: "15 min" },
            { name: "Oil Massage", price: 150, duration: "30 min" }
        ]
    },
    {
        id: 3,
        name: "The Barber Shop",
        address: "78, Sector 2, HSR Layout",
        area: "HSR Layout",
        lat: 12.9120,
        lng: 77.6350,
        ownerName: "Mohammed Ali",
        ownerPhone: "9876543212",
        rating: 4.7,
        reviewCount: 89,
        services: [
            { name: "Haircut", price: 180, duration: "30 min" },
            { name: "Beard Styling", price: 100, duration: "20 min" },
            { name: "Premium Combo", price: 250, duration: "50 min" },
            { name: "Kids Haircut", price: 120, duration: "20 min" },
            { name: "Hair Spa", price: 500, duration: "60 min" }
        ]
    },
    {
        id: 4,
        name: "Fresh Look Salon",
        address: "12, 27th Main, HSR Layout Sector 1",
        area: "HSR Layout",
        lat: 12.9085,
        lng: 77.6410,
        ownerName: "Prakash Reddy",
        ownerPhone: "9876543213",
        rating: 4.0,
        reviewCount: 21,
        services: [
            { name: "Haircut", price: 100, duration: "25 min" },
            { name: "Beard Trim", price: 50, duration: "10 min" },
            { name: "Clean Shave", price: 70, duration: "15 min" },
            { name: "Hair Color", price: 300, duration: "45 min" }
        ]
    },
    {
        id: 5,
        name: "Urban Edge",
        address: "34, 12th Main, Indiranagar",
        area: "Indiranagar",
        lat: 12.9790,
        lng: 77.6380,
        ownerName: "Vinay Sharma",
        ownerPhone: "9876543214",
        rating: 4.6,
        reviewCount: 67,
        services: [
            { name: "Haircut", price: 200, duration: "30 min" },
            { name: "Designer Beard", price: 150, duration: "25 min" },
            { name: "Hair + Beard", price: 300, duration: "50 min" },
            { name: "Keratin Treatment", price: 1500, duration: "90 min" },
            { name: "Hair Spa", price: 600, duration: "60 min" },
            { name: "Facial", price: 450, duration: "45 min" }
        ]
    },
    {
        id: 6,
        name: "Dapper Den",
        address: "56, CMH Road, Indiranagar",
        area: "Indiranagar",
        lat: 12.9810,
        lng: 77.6420,
        ownerName: "Arjun Menon",
        ownerPhone: "9876543215",
        rating: 4.4,
        reviewCount: 53,
        services: [
            { name: "Haircut", price: 180, duration: "30 min" },
            { name: "Beard Trim", price: 100, duration: "15 min" },
            { name: "Royal Shave", price: 150, duration: "25 min" },
            { name: "Head Massage", price: 200, duration: "30 min" }
        ]
    },
    {
        id: 7,
        name: "Trim & Style",
        address: "89, BTM 2nd Stage, 16th Main",
        area: "BTM Layout",
        lat: 12.9150,
        lng: 77.6120,
        ownerName: "Ganesh Iyer",
        ownerPhone: "9876543216",
        rating: 4.1,
        reviewCount: 35,
        services: [
            { name: "Haircut", price: 100, duration: "25 min" },
            { name: "Beard Trim", price: 50, duration: "10 min" },
            { name: "Combo", price: 130, duration: "35 min" },
            { name: "Hair Wash", price: 40, duration: "10 min" }
        ]
    },
    {
        id: 8,
        name: "Gents Corner",
        address: "23, 9th Block, Jayanagar",
        area: "Jayanagar",
        lat: 12.9280,
        lng: 77.5820,
        ownerName: "Ramesh Gowda",
        ownerPhone: "9876543217",
        rating: 4.3,
        reviewCount: 42,
        services: [
            { name: "Haircut", price: 120, duration: "25 min" },
            { name: "Beard Trim", price: 60, duration: "15 min" },
            { name: "Shave", price: 80, duration: "20 min" },
            { name: "Hair Color", price: 350, duration: "50 min" },
            { name: "Facial", price: 300, duration: "40 min" }
        ]
    },
    {
        id: 9,
        name: "Scissors & Razors",
        address: "67, JP Nagar 6th Phase",
        area: "JP Nagar",
        lat: 12.9050,
        lng: 77.5880,
        ownerName: "Kiran Rao",
        ownerPhone: "9876543218",
        rating: 4.0,
        reviewCount: 28,
        services: [
            { name: "Haircut", price: 100, duration: "25 min" },
            { name: "Beard Trim", price: 50, duration: "10 min" },
            { name: "Combo", price: 140, duration: "35 min" },
            { name: "Kids Haircut", price: 80, duration: "20 min" }
        ]
    },
    {
        id: 10,
        name: "Metro Cuts",
        address: "45, Marathahalli Bridge Road",
        area: "Marathahalli",
        lat: 12.9580,
        lng: 77.7010,
        ownerName: "Naveen Kumar",
        ownerPhone: "9876543219",
        rating: 4.2,
        reviewCount: 38,
        services: [
            { name: "Haircut", price: 150, duration: "30 min" },
            { name: "Beard Styling", price: 80, duration: "15 min" },
            { name: "Hair + Beard", price: 200, duration: "40 min" },
            { name: "Hair Spa", price: 400, duration: "45 min" },
            { name: "Facial", price: 350, duration: "40 min" }
        ]
    }
];

// Email configuration
const EMAIL_CONFIG = {
    recipientEmail: "arorasamarth17@gmail.com"
};

// Time slots available for booking
const TIME_SLOTS = [
    "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM",
    "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM",
    "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM",
    "04:00 PM", "04:30 PM", "05:00 PM", "05:30 PM",
    "06:00 PM", "06:30 PM", "07:00 PM", "07:30 PM",
    "08:00 PM"
];
