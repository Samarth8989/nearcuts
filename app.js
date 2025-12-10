// App State
let state = {
    userLocation: null,
    selectedArea: null,
    salons: [],
    selectedSalon: null,
    selectedServices: [], // Changed to array for multiple services
    selectedDate: null,
    selectedSlots: [],
    customerName: '',
    customerPhone: ''
};

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    populateAreaDropdown();
});

// Populate area dropdown
function populateAreaDropdown() {
    const select = document.getElementById('area-select');
    BANGALORE_AREAS.forEach(area => {
        const option = document.createElement('option');
        option.value = area.name;
        option.textContent = area.name;
        select.appendChild(option);
    });
}

// Use browser geolocation
function useMyLocation() {
    if (!navigator.geolocation) {
        showToast('Geolocation is not supported by your browser', 'error');
        return;
    }

    showLoading(true);

    navigator.geolocation.getCurrentPosition(
        (position) => {
            state.userLocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            state.selectedArea = findNearestArea(state.userLocation);
            showLoading(false);
            loadSalons();
        },
        (error) => {
            showLoading(false);
            let message = 'Unable to get your location';
            if (error.code === error.PERMISSION_DENIED) {
                message = 'Location permission denied. Please select your area manually.';
            }
            showToast(message, 'error');
        },
        { enableHighAccuracy: true, timeout: 10000 }
    );
}

// Find nearest area from user's location
function findNearestArea(userLoc) {
    let nearest = BANGALORE_AREAS[0];
    let minDistance = calculateDistance(userLoc.lat, userLoc.lng, nearest.lat, nearest.lng);

    BANGALORE_AREAS.forEach(area => {
        const distance = calculateDistance(userLoc.lat, userLoc.lng, area.lat, area.lng);
        if (distance < minDistance) {
            minDistance = distance;
            nearest = area;
        }
    });

    return nearest;
}

// On area select from dropdown
function onAreaSelect() {
    const select = document.getElementById('area-select');
    const areaName = select.value;
    
    if (!areaName) return;

    const area = BANGALORE_AREAS.find(a => a.name === areaName);
    if (area) {
        state.userLocation = { lat: area.lat, lng: area.lng };
        state.selectedArea = area;
        loadSalons();
    }
}

// Calculate distance between two points (Haversine formula)
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

function toRad(deg) {
    return deg * (Math.PI / 180);
}

// Format distance for display
function formatDistance(km) {
    if (km < 1) {
        return Math.round(km * 1000) + ' m';
    }
    return km.toFixed(1) + ' km';
}

// Load and display salons
function loadSalons() {
    // Calculate distance for each salon
    state.salons = SALONS_DATA.map(salon => ({
        ...salon,
        distance: calculateDistance(
            state.userLocation.lat,
            state.userLocation.lng,
            salon.lat,
            salon.lng
        )
    })).sort((a, b) => a.distance - b.distance);

    renderSalonsList();
    showScreen('screen-salons');
}

// Render salons list
function renderSalonsList() {
    const container = document.getElementById('salons-list');
    const areaName = document.getElementById('selected-area-name');
    const salonCount = document.getElementById('salon-count');

    areaName.textContent = state.selectedArea ? state.selectedArea.name : 'you';
    salonCount.textContent = `${state.salons.length} salons found`;

    // Salon icons array for variety
    const salonIcons = ['💇', '💈', '✂️', '💇‍♂️', '💆'];

    container.innerHTML = state.salons.map((salon, index) => `
        <div class="salon-card" onclick="selectSalon(${salon.id})">
            <div class="salon-card-icon">
                ${salonIcons[index % salonIcons.length]}
            </div>
            <div class="salon-card-content">
                <div class="salon-card-header">
                    <h3 class="salon-card-name">${salon.name}</h3>
                    <span class="salon-card-distance">${formatDistance(salon.distance)}</span>
                </div>
                <p class="salon-card-address">📍 ${salon.address}</p>
                <div class="salon-card-services">
                    ${salon.services.slice(0, 3).map(s => `
                        <span class="service-tag">${s.name} • ₹${s.price}</span>
                    `).join('')}
                    ${salon.services.length > 3 ? `<span class="service-tag">+${salon.services.length - 3} more</span>` : ''}
                </div>
                <div class="salon-card-footer">
                    <div class="salon-card-rating">
                        <span class="star">★</span>
                        <span>${salon.rating}</span>
                        <span style="color: var(--color-gray-400); font-weight: 400;">(${salon.reviewCount})</span>
                    </div>
                    <span class="salon-card-cta">Book Now →</span>
                </div>
            </div>
        </div>
    `).join('');
}

// Select a salon
function selectSalon(salonId) {
    state.selectedSalon = state.salons.find(s => s.id === salonId);
    state.selectedServices = []; // Reset to empty array
    renderSalonDetail();
    showScreen('screen-salon-detail');
}

// Render salon detail
function renderSalonDetail() {
    const container = document.getElementById('salon-detail');
    const salon = state.selectedSalon;
    
    // Calculate total price
    let totalPrice = 0;
    state.selectedServices.forEach(index => {
        totalPrice += salon.services[index].price;
    });

    container.innerHTML = `
        <div class="salon-detail-header">
            <h2 class="salon-detail-name">${salon.name}</h2>
            <p class="salon-detail-address">${salon.address}</p>
            <div class="salon-detail-meta">
                <span>
                    <span class="star" style="color: #fbbf24;">★</span>
                    ${salon.rating} (${salon.reviewCount} reviews)
                </span>
                <span>📍 ${formatDistance(salon.distance)} away</span>
            </div>
        </div>
        <div class="salon-detail-body">
            <h3>Select Services <span class="hint">(Select one or more)</span></h3>
            <div class="services-list">
                ${salon.services.map((service, index) => `
                    <div class="service-item ${state.selectedServices.includes(index) ? 'selected' : ''}" 
                         onclick="toggleService(${index})">
                        <div class="service-item-info">
                            <h4>${service.name}</h4>
                            <p>${service.duration}</p>
                        </div>
                        <span class="service-item-price">₹${service.price}</span>
                    </div>
                `).join('')}
            </div>
            ${state.selectedServices.length > 0 ? `
                <div class="selected-services-summary">
                    <div class="summary-row">
                        <span>${state.selectedServices.length} service${state.selectedServices.length > 1 ? 's' : ''} selected</span>
                        <span class="summary-total">₹${totalPrice}</span>
                    </div>
                </div>
            ` : ''}
            <button class="btn btn-primary btn-book-service" 
                    onclick="proceedToBooking()"
                    ${state.selectedServices.length === 0 ? 'disabled style="opacity: 0.5; cursor: not-allowed;"' : ''}>
                Book ${state.selectedServices.length > 0 ? `(${state.selectedServices.length}) Service${state.selectedServices.length > 1 ? 's' : ''}` : 'Services'}
            </button>
        </div>
    `;
}

// Toggle service selection (multi-select)
function toggleService(index) {
    const serviceIndex = state.selectedServices.indexOf(index);
    
    if (serviceIndex > -1) {
        // Remove if already selected
        state.selectedServices.splice(serviceIndex, 1);
    } else {
        // Add if not selected
        state.selectedServices.push(index);
    }
    
    renderSalonDetail();
}

// Proceed to booking
function proceedToBooking() {
    if (state.selectedServices.length === 0) {
        showToast('Please select at least one service', 'error');
        return;
    }

    state.selectedDate = null;
    state.selectedSlots = [];
    renderBookingForm();
    showScreen('screen-booking');
}

// Render booking form
function renderBookingForm() {
    const salon = state.selectedSalon;
    
    // Calculate totals for selected services
    let totalPrice = 0;
    const serviceNames = [];
    
    state.selectedServices.forEach(index => {
        const service = salon.services[index];
        totalPrice += service.price;
        serviceNames.push(service.name);
    });

    // Booking summary
    const summaryContainer = document.getElementById('booking-summary');
    summaryContainer.innerHTML = `
        <div class="booking-summary-item">
            <span class="booking-summary-label">Salon</span>
            <span class="booking-summary-value">${salon.name}</span>
        </div>
        <div class="booking-summary-item">
            <span class="booking-summary-label">Services</span>
            <span class="booking-summary-value">${serviceNames.join(', ')}</span>
        </div>
        <div class="booking-summary-item">
            <span class="booking-summary-label">Total Price</span>
            <span class="booking-summary-value">₹${totalPrice}</span>
        </div>
    `;

    // Date picker (next 7 days)
    const dateContainer = document.getElementById('date-picker');
    const dates = getNextDays(7);
    dateContainer.innerHTML = dates.map((date, index) => `
        <div class="date-option ${state.selectedDate === index ? 'selected' : ''}" 
             onclick="selectDate(${index})">
            <div class="date-option-day">${date.day}</div>
            <div class="date-option-date">${date.date}</div>
            <div class="date-option-month">${date.month}</div>
        </div>
    `).join('');

    // Time slots
    renderTimeSlots();
}

// Get next N days
function getNextDays(n) {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const result = [];

    for (let i = 0; i < n; i++) {
        const d = new Date();
        d.setDate(d.getDate() + i);
        result.push({
            day: i === 0 ? 'Today' : days[d.getDay()],
            date: d.getDate(),
            month: months[d.getMonth()],
            fullDate: d
        });
    }

    return result;
}

// Select date
function selectDate(index) {
    state.selectedDate = index;
    state.selectedSlots = [];
    renderBookingForm();
}

// Render time slots
function renderTimeSlots() {
    const container = document.getElementById('time-slots');
    const now = new Date();
    const selectedDateObj = state.selectedDate !== null ? getNextDays(7)[state.selectedDate].fullDate : null;
    const isToday = selectedDateObj && selectedDateObj.toDateString() === now.toDateString();

    // Filter out past slots for today
    const availableSlots = TIME_SLOTS.map((slot, index) => {
        let isPast = false;
        if (isToday) {
            const [time, period] = slot.split(' ');
            const [hours, minutes] = time.split(':');
            let slotHour = parseInt(hours);
            if (period === 'PM' && slotHour !== 12) slotHour += 12;
            if (period === 'AM' && slotHour === 12) slotHour = 0;
            
            if (slotHour < now.getHours() || (slotHour === now.getHours() && parseInt(minutes) <= now.getMinutes())) {
                isPast = true;
            }
        }
        return { slot, index, isPast };
    }).filter(item => !item.isPast); // Remove past slots

    if (availableSlots.length === 0) {
        container.innerHTML = '<p style="color: var(--color-gray-500); text-align: center; padding: 20px;">No slots available for today. Please select another date.</p>';
        return;
    }

    container.innerHTML = availableSlots.map(({ slot, index }) => {
        const isSelected = state.selectedSlots.includes(index);
        const canSelect = state.selectedSlots.length < 3 || isSelected;

        return `
            <div class="time-slot ${isSelected ? 'selected' : ''} ${!canSelect && !isSelected ? 'disabled' : ''}" 
                 onclick="toggleTimeSlot(${index})">
                ${slot}
            </div>
        `;
    }).join('');
}

// Toggle time slot selection
function toggleTimeSlot(index) {
    if (state.selectedDate === null) {
        showToast('Please select a date first', 'error');
        return;
    }

    const slotIndex = state.selectedSlots.indexOf(index);
    
    if (slotIndex > -1) {
        state.selectedSlots.splice(slotIndex, 1);
    } else if (state.selectedSlots.length < 3) {
        state.selectedSlots.push(index);
    } else {
        showToast('You can select up to 3 time slots', 'error');
        return;
    }

    renderTimeSlots();
}

// Submit booking
async function submitBooking() {
    const name = document.getElementById('customer-name').value.trim();
    const phone = document.getElementById('customer-phone').value.trim();

    // Validation
    if (!name) {
        showToast('Please enter your name', 'error');
        return;
    }

    if (!phone || !/^\d{10}$/.test(phone)) {
        showToast('Please enter a valid 10-digit phone number', 'error');
        return;
    }

    if (state.selectedDate === null) {
        showToast('Please select a date', 'error');
        return;
    }

    if (state.selectedSlots.length === 0) {
        showToast('Please select at least one time slot', 'error');
        return;
    }

    state.customerName = name;
    state.customerPhone = phone;

    showLoading(true);

    // Prepare booking data with multiple services
    const salon = state.selectedSalon;
    
    // Calculate totals
    let totalPrice = 0;
    const serviceNames = [];
    
    state.selectedServices.forEach(index => {
        const service = salon.services[index];
        totalPrice += service.price;
        serviceNames.push(`${service.name} (₹${service.price})`);
    });
    
    const dateInfo = getNextDays(7)[state.selectedDate];
    const slots = state.selectedSlots.map(i => TIME_SLOTS[i]).join(', ');

    const bookingData = {
        timestamp: new Date().toISOString(),
        customerName: name,
        customerPhone: phone,
        salonName: salon.name,
        salonAddress: salon.address,
        salonOwnerName: salon.ownerName,
        salonOwnerPhone: salon.ownerPhone,
        services: serviceNames.join(', '),
        totalPrice: totalPrice,
        date: `${dateInfo.day}, ${dateInfo.date} ${dateInfo.month}`,
        preferredSlots: slots
    };

    try {
        // Send email notification
        await sendEmailNotification(bookingData);
        
        showLoading(false);
        showConfirmation(bookingData);
    } catch (error) {
        showLoading(false);
        // Still show confirmation even if email fails
        // In production, you'd want to handle this better
        console.error('Email send failed:', error);
        showConfirmation(bookingData);
    }
}

// Send email notification (using a serverless function or email service)
async function sendEmailNotification(bookingData) {
    // For demo purposes, we'll use EmailJS or a similar service
    // You'll need to set up EmailJS (free tier available) or use your own backend
    
    // Option 1: Log to console for now (you'll manually check and forward)
    console.log('=== NEW BOOKING REQUEST ===');
    console.log(JSON.stringify(bookingData, null, 2));
    console.log('=========================');
    
    // Option 2: Using EmailJS (uncomment and configure if you set up EmailJS)
    /*
    const templateParams = {
        to_email: EMAIL_CONFIG.recipientEmail,
        customer_name: bookingData.customerName,
        customer_phone: bookingData.customerPhone,
        salon_name: bookingData.salonName,
        salon_address: bookingData.salonAddress,
        salon_owner_name: bookingData.salonOwnerName,
        salon_owner_phone: bookingData.salonOwnerPhone,
        service: `${bookingData.serviceName} - ₹${bookingData.servicePrice}`,
        date: bookingData.date,
        time_slots: bookingData.preferredSlots,
        timestamp: bookingData.timestamp
    };

    await emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', templateParams);
    */

    // Option 3: Using a serverless function / API endpoint
    // You would create an API endpoint that sends emails
    /*
    const response = await fetch('/api/send-booking-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData)
    });
    
    if (!response.ok) throw new Error('Failed to send email');
    */

    // For now, we'll store in localStorage as a backup
    const bookings = JSON.parse(localStorage.getItem('nearcuts_bookings') || '[]');
    bookings.push(bookingData);
    localStorage.setItem('nearcuts_bookings', JSON.stringify(bookings));

    return Promise.resolve();
}

// Show confirmation screen
function showConfirmation(bookingData) {
    const container = document.getElementById('confirmation-details');
    
    // Generate a dummy booking ID
    const bookingId = 'NC' + Math.random().toString(36).substring(2, 8).toUpperCase();
    bookingData.bookingId = bookingId;
    
    // Update localStorage with booking ID
    const bookings = JSON.parse(localStorage.getItem('nearcuts_bookings') || '[]');
    if (bookings.length > 0) {
        bookings[bookings.length - 1].bookingId = bookingId;
        bookings[bookings.length - 1].status = 'pending'; // pending, confirmed, cancelled
        localStorage.setItem('nearcuts_bookings', JSON.stringify(bookings));
    }
    
    // Store current booking for cancel functionality
    state.currentBooking = bookingData;
    
    container.innerHTML = `
        <div class="confirmation-details-item">
            <span class="confirmation-details-label">Booking ID</span>
            <span class="confirmation-details-value">${bookingId}</span>
        </div>
        <div class="confirmation-details-item">
            <span class="confirmation-details-label">Status</span>
            <span class="confirmation-details-value status-pending">⏳ Waiting for salon confirmation</span>
        </div>
        <div class="confirmation-details-item">
            <span class="confirmation-details-label">Salon</span>
            <span class="confirmation-details-value">${bookingData.salonName}</span>
        </div>
        <div class="confirmation-details-item">
            <span class="confirmation-details-label">Services</span>
            <span class="confirmation-details-value">${bookingData.services}</span>
        </div>
        <div class="confirmation-details-item">
            <span class="confirmation-details-label">Total</span>
            <span class="confirmation-details-value">₹${bookingData.totalPrice}</span>
        </div>
        <div class="confirmation-details-item">
            <span class="confirmation-details-label">Date</span>
            <span class="confirmation-details-value">${bookingData.date}</span>
        </div>
        <div class="confirmation-details-item">
            <span class="confirmation-details-label">Preferred Slots</span>
            <span class="confirmation-details-value">${bookingData.preferredSlots}</span>
        </div>
        <div class="confirmation-details-item">
            <span class="confirmation-details-label">Your Number</span>
            <span class="confirmation-details-value">${bookingData.customerPhone}</span>
        </div>
    `;

    showScreen('screen-confirmation');
}

// Navigation functions
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
    window.scrollTo(0, 0);
}

function goToHome() {
    // Reset state
    state = {
        userLocation: null,
        selectedArea: null,
        salons: [],
        selectedSalon: null,
        selectedServices: [], // Reset to empty array
        selectedDate: null,
        selectedSlots: [],
        customerName: '',
        customerPhone: ''
    };
    document.getElementById('area-select').value = '';
    document.getElementById('customer-name').value = '';
    document.getElementById('customer-phone').value = '';
    showScreen('screen-location');
}

function goToSalons() {
    showScreen('screen-salons');
}

function goToSalonDetail() {
    showScreen('screen-salon-detail');
}

// Utility functions
function showLoading(show) {
    const loader = document.getElementById('loading');
    if (show) {
        loader.classList.add('active');
    } else {
        loader.classList.remove('active');
    }
}

function showToast(message, type = 'info') {
    // Remove existing toast
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);

    // Trigger animation
    setTimeout(() => toast.classList.add('show'), 10);

    // Remove after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// View bookings (for admin/debugging)
function viewBookings() {
    const bookings = JSON.parse(localStorage.getItem('nearcuts_bookings') || '[]');
    console.table(bookings);
    return bookings;
}

// Cancel booking
function cancelBooking() {
    if (!state.currentBooking || !state.currentBooking.bookingId) {
        showToast('No booking to cancel', 'error');
        return;
    }
    
    if (!confirm('Are you sure you want to cancel this booking?')) {
        return;
    }
    
    // Update booking status in localStorage
    const bookings = JSON.parse(localStorage.getItem('nearcuts_bookings') || '[]');
    const bookingIndex = bookings.findIndex(b => b.bookingId === state.currentBooking.bookingId);
    
    if (bookingIndex > -1) {
        bookings[bookingIndex].status = 'cancelled';
        localStorage.setItem('nearcuts_bookings', JSON.stringify(bookings));
    }
    
    // Show cancellation confirmation
    showCancellationConfirmation();
}

// Show cancellation confirmation
function showCancellationConfirmation() {
    const container = document.getElementById('confirmation-details');
    const card = document.querySelector('.confirmation-card');
    
    // Update icon and title
    card.querySelector('.confirmation-icon').textContent = '✕';
    card.querySelector('.confirmation-icon').classList.add('cancelled');
    card.querySelector('h2').textContent = 'Booking Cancelled';
    card.querySelector('.confirmation-card > p').textContent = 'Your booking has been cancelled. The salon will be notified.';
    
    // Update details to show cancelled status
    const statusItem = container.querySelector('.status-pending');
    if (statusItem) {
        statusItem.textContent = '❌ Cancelled';
        statusItem.classList.remove('status-pending');
        statusItem.classList.add('status-cancelled');
    }
    
    // Update buttons
    const actionsContainer = card.querySelector('.confirmation-actions');
    actionsContainer.innerHTML = `
        <button class="btn btn-primary" onclick="goToHome()">
            Book Again
        </button>
    `;
    
    showToast('Booking cancelled successfully');
}
