// Event data
const events = {
    '1': {
        title: 'Coldplay - Music of the Spheres Tour',
        date: 'June 15, 2025',
        time: '7:00 PM',
        venue: 'National Stadium, Singapore',
        image: 'https://wallpapercave.com/wp/wp11883615.jpg',
        description: 'Experience Coldplay\'s groundbreaking Music of the Spheres World Tour. The spectacular show features state-of-the-art visuals, stunning pyrotechnics, and all their greatest hits in an unforgettable evening of music and magic.'
    },
    '2': {
        title: 'Taylor Swift - Eras Tour',
        date: 'July 22, 2025',
        time: '8:00 PM',
        venue: 'National Stadium, Singapore',
        image: 'https://wallpapercave.com/wp/wp12056578.jpg',
        description: 'Taylor Swift brings her record-breaking Eras Tour to Singapore! Join us for a spectacular journey through all of Taylor\'s musical eras in this once-in-a-lifetime concert experience.'
    },
    '3': {
        title: 'Premier League: Liverpool vs Manchester City',
        date: 'August 5, 2025',
        time: '3:00 PM',
        venue: 'Sports Hub, Singapore',
        image: 'https://wallpapercave.com/wp/wp3737390.jpg',
        description: 'Watch two Premier League giants clash in this exciting match! Experience world-class football as Liverpool takes on Manchester City in what promises to be an unforgettable game.'
    }
};

// Ticket prices for each category
const ticketPrices = {
    'VIP': 688,
    'A': 388,
    'B': 288
};

let selectedTicketType = '';
let quantity = 1;

// Load event details when page loads
document.addEventListener('DOMContentLoaded', () => {
    // Get event ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const eventId = urlParams.get('eventId');
    
    if (eventId && events[eventId]) {
        const event = events[eventId];
        
        // Update page content with event details
        document.querySelector('.event-banner img').src = event.image;
        document.querySelector('.event-overlay h1').textContent = event.title;
        document.querySelector('.event-meta span:nth-child(1)').innerHTML = `<i class="fas fa-calendar"></i> ${event.date}`;
        document.querySelector('.event-meta span:nth-child(2)').innerHTML = `<i class="fas fa-clock"></i> ${event.time}`;
        document.querySelector('.event-meta span:nth-child(3)').innerHTML = `<i class="fas fa-map-marker-alt"></i> ${event.venue}`;
        document.querySelector('.event-description').textContent = event.description;

        // Update booking summary
        document.querySelector('.summary-row:nth-child(1) span:last-child').textContent = event.title;
        document.querySelector('.summary-row:nth-child(2) span:last-child').textContent = `${event.date} - ${event.time}`;
        document.querySelector('.summary-row:nth-child(3) span:last-child').textContent = event.venue;
    } else {
        // Redirect back to events page if no valid event ID
        window.location.href = 'events.html';
    }

    // Add animation to ticket cards
    const cards = document.querySelectorAll('.ticket-card');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.2}s`;
        card.classList.add('fade-in');
    });
});

// Function to select ticket type
function selectTicket(type) {
    selectedTicketType = type;
    document.getElementById('selectedTicketType').textContent = `Category ${type}`;
    document.getElementById('bookingSummary').classList.remove('hidden');
    updateTotal();

    // Highlight selected ticket card
    document.querySelectorAll('.ticket-card').forEach(card => {
        card.classList.remove('selected');
        if (card.querySelector('.ticket-type').textContent.includes(type)) {
            card.classList.add('selected');
        }
    });

    // Smooth scroll to booking summary
    document.getElementById('bookingSummary').scrollIntoView({ behavior: 'smooth' });
}

// Function to update ticket quantity
function updateQuantity(change) {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= 10) {
        quantity = newQuantity;
        document.getElementById('ticketQuantity').textContent = quantity;
        updateTotal();
    }
}

// Function to update total amount
function updateTotal() {
    if (selectedTicketType && ticketPrices[selectedTicketType]) {
        const total = ticketPrices[selectedTicketType] * quantity;
        document.getElementById('totalAmount').textContent = `S$${total}`;
    }
}

// Function to proceed to payment
function proceedToPayment() {
    if (!selectedTicketType) {
        alert('Please select a ticket type first.');
        return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const eventId = urlParams.get('eventId');
    const event = events[eventId];

    const bookingDetails = {
        event: event.title,
        date: event.date,
        time: event.time,
        venue: event.venue,
        ticketType: `Category ${selectedTicketType}`,
        quantity: quantity,
        totalAmount: ticketPrices[selectedTicketType] * quantity
    };

    // Save booking details to session storage
    sessionStorage.setItem('bookingDetails', JSON.stringify(bookingDetails));

    // Show booking confirmation
    alert('Booking Confirmed!\n\nBooking Details:\n' + 
          `Event: ${bookingDetails.event}\n` +
          `Date: ${bookingDetails.date}\n` +
          `Time: ${bookingDetails.time}\n` +
          `Venue: ${bookingDetails.venue}\n` +
          `Ticket Type: ${bookingDetails.ticketType}\n` +
          `Quantity: ${bookingDetails.quantity}\n` +
          `Total Amount: S$${bookingDetails.totalAmount}`);
}
