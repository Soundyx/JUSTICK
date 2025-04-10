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
let ticketQuantity = 1;

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
    ticketQuantity = Math.max(1, Math.min(10, ticketQuantity + change));
    document.getElementById('ticketQuantity').textContent = ticketQuantity;
    updateTotal();
}

// Function to update total amount
function updateTotal() {
    const total = selectedTicketType ? ticketPrices[selectedTicketType] * ticketQuantity : 0;
    document.getElementById('totalAmount').textContent = `S$${total}`;
}

// Handle payment
function proceedToPayment() {
    // Show customer details form
    showCustomerForm();
}

// Show customer form
function showCustomerForm() {
    const customerForm = document.createElement('div');
    customerForm.className = 'customer-form-overlay';
    
    customerForm.innerHTML = `
        <div class="customer-form-content">
            <h2>Enter Your Details</h2>
            <div class="form-group">
                <input type="text" id="customerName" placeholder="Full Name" required>
            </div>
            <div class="form-group">
                <input type="email" id="customerEmail" placeholder="Email" required>
            </div>
            <div class="form-group">
                <input type="tel" id="customerPhone" placeholder="Phone Number" required>
            </div>
            <button onclick="confirmBooking()" class="confirm-btn">
                Confirm Booking
                <i class="fas fa-check"></i>
            </button>
        </div>
    `;

    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        .customer-form-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
        }
        .customer-form-content {
            background: #1a1a1a;
            padding: 2rem;
            border-radius: 10px;
            width: 90%;
            max-width: 500px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
            border: 1px solid #333;
            animation: slideIn 0.3s ease-out;
        }
        .customer-form-content h2 {
            color: #ffffff;
            margin-bottom: 1.5rem;
            text-align: center;
        }
        .form-group {
            margin-bottom: 1.2rem;
        }
        .form-group input {
            width: 100%;
            padding: 1rem;
            border: 2px solid #333333;
            border-radius: 6px;
            font-size: 1rem;
            color: #ffffff;
            background-color: #2a2a2a;
            transition: all 0.3s ease;
        }
        .form-group input:focus {
            outline: none;
            border-color: #4CAF50;
            box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.2);
            background-color: #333333;
        }
        .form-group input::placeholder {
            color: #999999;
        }
        .confirm-btn {
            width: 100%;
            padding: 1rem;
            background: #4CAF50;
            color: white;
            border: none;
            border-radius: 6px;
            font-size: 1.1rem;
            font-weight: 500;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            transition: all 0.3s ease;
        }
        .confirm-btn:hover {
            background: #45a049;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
        }
        @keyframes slideIn {
            from {
                transform: translateY(-50px);
                opacity: 0;
            }
            to {
                transform: translateY(0);
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(style);
    document.body.appendChild(customerForm);
}

// Handle booking confirmation
function confirmBooking() {
    const customerName = document.getElementById('customerName').value;
    const customerEmail = document.getElementById('customerEmail').value;
    const customerPhone = document.getElementById('customerPhone').value;

    if (!customerName || !customerEmail || !customerPhone) {
        alert('Please fill in all customer details');
        return;
    }

    // Create booking data
    const urlParams = new URLSearchParams(window.location.search);
    const eventId = urlParams.get('eventId');
    const event = events[eventId];

    const bookingData = {
        event: event.title,
        date: event.date,
        time: event.time,
        venue: event.venue,
        ticketType: `Category ${selectedTicketType}`,
        quantity: ticketQuantity,
        totalAmount: ticketPrices[selectedTicketType] * ticketQuantity,
        customer: {
            name: customerName,
            email: customerEmail,
            phone: customerPhone
        },
        bookingDate: new Date().toISOString()
    };

    // Save to localStorage
    const existingBookings = JSON.parse(localStorage.getItem('userBookings') || '[]');
    existingBookings.push(bookingData);
    localStorage.setItem('userBookings', JSON.stringify(existingBookings));

    // Show success message
    showBookingSuccess(bookingData);
}

// Show booking success message
function showBookingSuccess(bookingData) {
    const successMessage = document.createElement('div');
    successMessage.className = 'booking-success';
    successMessage.innerHTML = `
        <div class="success-content">
            <i class="fas fa-check-circle"></i>
            <h2>Booking Successful!</h2>
            <div class="booking-details">
                <p><strong>Event:</strong> ${bookingData.event}</p>
                <p><strong>Date & Time:</strong> ${bookingData.date} - ${bookingData.time}</p>
                <p><strong>Venue:</strong> ${bookingData.venue}</p>
                <p><strong>Ticket Type:</strong> ${bookingData.ticketType}</p>
                <p><strong>Quantity:</strong> ${bookingData.quantity}</p>
                <p><strong>Customer Name:</strong> ${bookingData.customer.name}</p>
                <p><strong>Email:</strong> ${bookingData.customer.email}</p>
                <p><strong>Phone:</strong> ${bookingData.customer.phone}</p>
                <p><strong>Total Amount:</strong> S$${bookingData.totalAmount}</p>
            </div>
            <div class="success-buttons">
                <button onclick="window.location.href='events.html'" class="home-btn">
                    <i class="fas fa-home"></i> Back to Events
                </button>
                <button onclick="window.location.href='events.html'; setTimeout(() => document.querySelector('.btn-bookings').click(), 500)" class="view-bookings-btn">
                    <i class="fas fa-ticket-alt"></i> View All Bookings
                </button>
            </div>
        </div>
    `;

    // Add success message styles
    const style = document.createElement('style');
    style.textContent = `
        .booking-success {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
        }
        .success-content {
            background: #1a1a1a;
            padding: 2rem;
            border-radius: 10px;
            text-align: center;
            max-width: 500px;
            width: 90%;
            animation: slideIn 0.5s ease-out;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
            border: 1px solid #333;
        }
        .success-content i {
            font-size: 4rem;
            color: #4CAF50;
            margin-bottom: 1rem;
        }
        .success-content h2 {
            color: #ffffff;
            margin-bottom: 1.5rem;
        }
        .booking-details {
            text-align: left;
            margin: 1.5rem 0;
            padding: 1.5rem;
            background: #2a2a2a;
            border-radius: 8px;
            border: 1px solid #333;
        }
        .booking-details p {
            margin: 0.8rem 0;
            color: #ffffff;
        }
        .booking-details strong {
            color: #4CAF50;
        }
        .success-buttons {
            display: flex;
            gap: 1rem;
            justify-content: center;
            margin-top: 1.5rem;
        }
        .home-btn, .view-bookings-btn {
            background: #2196F3;
            color: white;
            border: none;
            padding: 1rem 1.5rem;
            border-radius: 5px;
            cursor: pointer;
            font-size: 1rem;
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            transition: all 0.3s ease;
        }
        .home-btn:hover, .view-bookings-btn:hover {
            background: #1976D2;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(33, 150, 243, 0.3);
        }
        .view-bookings-btn {
            background: #4CAF50;
        }
        .view-bookings-btn:hover {
            background: #45a049;
            box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
        }
    `;
    document.head.appendChild(style);

    // Remove the customer form and show success message
    document.querySelector('.customer-form-overlay').remove();
    document.body.appendChild(successMessage);
}
