// Initialize variables
let selectedSeats = [];
const REGULAR_PRICE = 250;
const PREMIUM_PRICE = 350;

// Handle seat selection
document.addEventListener('DOMContentLoaded', () => {
    const seatingMap = document.querySelector('.seating-map');
    const proceedBtn = document.getElementById('proceedBtn');
    const customerForm = document.getElementById('customerForm');

    // Hide customer form initially
    customerForm.style.display = 'none';

    // Handle seat clicks
    seatingMap.addEventListener('click', (e) => {
        if (e.target.classList.contains('seat') && !e.target.classList.contains('occupied')) {
            e.target.classList.toggle('selected');
            updateSelectedSeats();
        }
    });

    // Handle proceed button click
    proceedBtn.addEventListener('click', () => {
        if (selectedSeats.length > 0) {
            customerForm.style.display = 'block';
            proceedBtn.style.display = 'none';
            
            // Add a new confirm button
            if (!document.getElementById('confirmBtn')) {
                const confirmBtn = document.createElement('button');
                confirmBtn.id = 'confirmBtn';
                confirmBtn.className = 'proceed-btn';
                confirmBtn.innerHTML = 'Confirm Booking <i class="fas fa-arrow-right"></i>';
                customerForm.appendChild(confirmBtn);

                // Handle confirm button click
                confirmBtn.addEventListener('click', handleBookingConfirmation);
            }
        }
    });
});

// Update selected seats and pricing
function updateSelectedSeats() {
    const selected = document.querySelectorAll('.seat.selected');
    const regularSeats = Array.from(selected).filter(seat => !seat.parentElement.classList.contains('premium'));
    const premiumSeats = Array.from(selected).filter(seat => seat.parentElement.classList.contains('premium'));
    
    selectedSeats = Array.from(selected).map(seat => seat.dataset.seat);
    
    // Update display
    document.getElementById('selectedSeats').textContent = selectedSeats.length > 0 ? selectedSeats.join(', ') : 'None';
    document.getElementById('regularPrice').textContent = `₹${REGULAR_PRICE} × ${regularSeats.length} = ₹${REGULAR_PRICE * regularSeats.length}`;
    document.getElementById('premiumPrice').textContent = `₹${PREMIUM_PRICE} × ${premiumSeats.length} = ₹${PREMIUM_PRICE * premiumSeats.length}`;
    document.getElementById('totalAmount').textContent = `₹${(REGULAR_PRICE * regularSeats.length) + (PREMIUM_PRICE * premiumSeats.length)}`;
    
    // Enable/disable proceed button
    document.getElementById('proceedBtn').disabled = selectedSeats.length === 0;
}

// Handle booking confirmation
function handleBookingConfirmation() {
    const customerName = document.getElementById('customerName').value;
    const customerEmail = document.getElementById('customerEmail').value;
    const customerPhone = document.getElementById('customerPhone').value;

    if (!customerName || !customerEmail || !customerPhone) {
        alert('Please fill in all customer details');
        return;
    }

    // Create booking data
    const bookingData = {
        seats: selectedSeats,
        customer: {
            name: customerName,
            email: customerEmail,
            phone: customerPhone
        },
        totalAmount: calculateTotal()
    };

    // Show success message
    showBookingSuccess(bookingData);
}

// Calculate total amount
function calculateTotal() {
    const selected = document.querySelectorAll('.seat.selected');
    const regularSeats = Array.from(selected).filter(seat => !seat.parentElement.classList.contains('premium'));
    const premiumSeats = Array.from(selected).filter(seat => seat.parentElement.classList.contains('premium'));
    return (REGULAR_PRICE * regularSeats.length) + (PREMIUM_PRICE * premiumSeats.length);
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
                <p><strong>Customer Name:</strong> ${bookingData.customer.name}</p>
                <p><strong>Email:</strong> ${bookingData.customer.email}</p>
                <p><strong>Phone:</strong> ${bookingData.customer.phone}</p>
                <p><strong>Selected Seats:</strong> ${bookingData.seats.join(', ')}</p>
                <p><strong>Total Amount:</strong> ₹${bookingData.totalAmount}</p>
            </div>
            <div class="success-buttons">
                <button onclick="window.location.href='movies.html'" class="home-btn">
                    <i class="fas fa-home"></i> Back to Movies
                </button>
                <button onclick="window.location.href='movies.html'; setTimeout(() => document.querySelector('.btn-bookings').click(), 500)" class="view-bookings-btn">
                    <i class="fas fa-ticket-alt"></i> View All Bookings
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(successMessage);

    // Save booking to localStorage
    const existingBookings = JSON.parse(localStorage.getItem('userBookings') || '[]');
    existingBookings.push({
        ...bookingData,
        bookingDate: new Date().toISOString(),
        movieTitle: document.getElementById('movieTitle').textContent,
        cinema: document.getElementById('cinemaName').textContent,
        showDateTime: document.getElementById('showDateTime').textContent
    });
    localStorage.setItem('userBookings', JSON.stringify(existingBookings));

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
}
