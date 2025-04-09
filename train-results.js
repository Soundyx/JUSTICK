// Get URL parameters
const urlParams = new URLSearchParams(window.location.search);
const from = urlParams.get('from');
const to = urlParams.get('to');
const date = urlParams.get('date');
const trainClass = urlParams.get('class');
const passengers = urlParams.get('passengers');

// Update journey summary
document.getElementById('fromStation').textContent = from || 'Delhi';
document.getElementById('toStation').textContent = to || 'Mumbai';
document.getElementById('journeyDate').textContent = formatDate(date);

// Filter buttons functionality
const filterButtons = document.querySelectorAll('.filter-btn');
filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons
        filterButtons.forEach(btn => btn.classList.remove('active'));
        // Add active class to clicked button
        button.classList.add('active');
        
        // Apply filter
        filterTrains(button.dataset.filter);
    });
});

// Format date
function formatDate(dateString) {
    if (!dateString) return '10 Apr, 2025';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });
}

// Filter trains based on selected option
function filterTrains(filter) {
    const trainCards = document.querySelectorAll('.train-card');
    trainCards.forEach(card => {
        switch(filter) {
            case 'ac':
                // Show only trains with AC classes available
                card.style.display = card.querySelector('.class-option[class*="AC"]') ? 'block' : 'none';
                break;
            case 'sleeper':
                // Show only trains with sleeper class
                card.style.display = card.querySelector('.class-option[class*="SL"]') ? 'block' : 'none';
                break;
            case 'fastest':
                // Sort by duration (would need actual data)
                break;
            case 'cheapest':
                // Sort by price (would need actual data)
                break;
            default:
                card.style.display = 'block';
        }
    });
}

// Book button functionality
document.querySelectorAll('.book-btn').forEach(button => {
    button.addEventListener('click', function() {
        const trainCard = this.closest('.train-card');
        const trainName = trainCard.querySelector('.train-name h3').textContent;
        const trainNumber = trainCard.querySelector('.train-number').textContent;
        
        // Redirect to booking page with train details
        const bookingUrl = `train-booking.html?train=${encodeURIComponent(trainName)}&number=${trainNumber}&from=${from}&to=${to}&date=${date}&passengers=${passengers}`;
        window.location.href = bookingUrl;
    });
});
