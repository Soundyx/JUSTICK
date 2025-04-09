// Get URL parameters
const urlParams = new URLSearchParams(window.location.search);
const movieId = urlParams.get('movie');
const cinema = urlParams.get('cinema');
const selectedDate = urlParams.get('date');
const selectedTime = urlParams.get('time');
const screen = urlParams.get('screen');
const price = urlParams.get('price');

// Update page information
document.getElementById('movieTitle').textContent = movies[movieId]?.title || 'Movie Title';
document.getElementById('cinemaName').textContent = cinema || 'Cinema Name';
document.getElementById('showDateTime').textContent = `${selectedDate} | ${selectedTime}`;
document.getElementById('screenType').textContent = screen || 'Standard';

// Constants for pricing
const REGULAR_PRICE = 250;
const PREMIUM_PRICE = 350;

// Initialize selected seats
let selectedSeats = [];

// Handle seat selection
document.querySelector('.seating-map').addEventListener('click', (e) => {
    if (e.target.classList.contains('seat') && !e.target.classList.contains('occupied')) {
        e.target.classList.toggle('selected');
        updateSelectedSeats();
    }
});

// Update selected seats and pricing information
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

// Handle proceed button click
document.getElementById('proceedBtn').addEventListener('click', () => {
    // Create booking data
    const bookingData = {
        movieId,
        cinema,
        date: selectedDate,
        time: selectedTime,
        screen,
        seats: selectedSeats,
        totalAmount: (REGULAR_PRICE * selectedSeats.filter(seat => !document.querySelector(`[data-seat="${seat}"]`).parentElement.classList.contains('premium')).length) +
                    (PREMIUM_PRICE * selectedSeats.filter(seat => document.querySelector(`[data-seat="${seat}"]`).parentElement.classList.contains('premium')).length)
    };

    // In a real application, this would make an API call to save the booking
    // For now, we'll simulate a successful booking
    localStorage.setItem('lastBooking', JSON.stringify(bookingData));

    // Show success message
    const successMessage = document.createElement('div');
    successMessage.className = 'booking-success';
    successMessage.innerHTML = `
        <div class="success-content">
            <i class="fas fa-check-circle"></i>
            <h2>Booking Successful!</h2>
            <p>Your seats have been booked successfully.</p>
            <div class="booking-details">
                <p><strong>Movie:</strong> ${movies[movieId]?.title}</p>
                <p><strong>Cinema:</strong> ${cinema}</p>
                <p><strong>Date & Time:</strong> ${selectedDate} | ${selectedTime}</p>
                <p><strong>Seats:</strong> ${selectedSeats.join(', ')}</p>
                <p><strong>Total Amount:</strong> ₹${bookingData.totalAmount}</p>
            </div>
            <button onclick="window.location.href='index.html'" class="home-btn">
                <i class="fas fa-home"></i> Back to Home
            </button>
        </div>
    `;
    document.body.appendChild(successMessage);

    // Add success message styles
    const style = document.createElement('style');
    style.textContent = `
        .booking-success {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
        }
        .success-content {
            background: white;
            padding: 2rem;
            border-radius: 10px;
            text-align: center;
            max-width: 500px;
            width: 90%;
            animation: slideIn 0.5s ease-out;
        }
        .success-content i {
            font-size: 4rem;
            color: #4CAF50;
            margin-bottom: 1rem;
        }
        .booking-details {
            text-align: left;
            margin: 1.5rem 0;
            padding: 1rem;
            background: #f5f5f5;
            border-radius: 5px;
        }
        .booking-details p {
            margin: 0.5rem 0;
        }
        .home-btn {
            background: #4CAF50;
            color: white;
            border: none;
            padding: 0.8rem 1.5rem;
            border-radius: 5px;
            cursor: pointer;
            font-size: 1rem;
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            transition: background 0.3s;
        }
        .home-btn:hover {
            background: #45a049;
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
});

// Initialize
updateSelectedSeats();
