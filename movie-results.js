// Get URL parameters
const urlParams = new URLSearchParams(window.location.search);
const movieId = urlParams.get('movie');
const selectedDate = urlParams.get('date');
const seats = urlParams.get('seats');

// Movie data (in a real app, this would come from an API)
const movies = {
    'movie1': {
        title: 'The Dark Knight',
        duration: '2h 32m',
        rating: '9.0/10',
        genre: 'Action, Drama, Crime'
    },
    'movie2': {
        title: 'Inception',
        duration: '2h 28m',
        rating: '8.8/10',
        genre: 'Sci-Fi, Action, Adventure'
    },
    'movie3': {
        title: 'Interstellar',
        duration: '2h 49m',
        rating: '8.6/10',
        genre: 'Sci-Fi, Adventure, Drama'
    },
    'movie4': {
        title: 'Avatar',
        duration: '2h 42m',
        rating: '7.8/10',
        genre: 'Sci-Fi, Action, Adventure'
    }
};

// Update movie information
function updateMovieInfo() {
    const movie = movies[movieId] || movies['movie1']; // Default to first movie if ID not found
    document.getElementById('movieTitle').textContent = movie.title;
    
    const metaElements = document.querySelector('.movie-meta').children;
    metaElements[0].innerHTML = `<i class="fas fa-clock"></i> ${movie.duration}`;
    metaElements[1].innerHTML = `<i class="fas fa-star"></i> ${movie.rating}`;
    metaElements[2].innerHTML = `<i class="fas fa-film"></i> ${movie.genre}`;
}

// Handle time slot selection
document.querySelectorAll('.time-slot').forEach(slot => {
    if (!slot.classList.contains('sold-out')) {
        slot.addEventListener('click', function() {
            // Remove active class from all slots
            document.querySelectorAll('.time-slot').forEach(s => s.classList.remove('active'));
            // Add active class to clicked slot
            this.classList.add('active');
            
            // Get show details
            const time = this.querySelector('.time').textContent;
            const screen = this.querySelector('.screen').textContent;
            const price = this.dataset.price;
            const cinema = this.closest('.cinema-card').querySelector('h3').textContent;
            
            // Redirect to seat selection page
            const bookingUrl = `seat-selection.html?movie=${movieId}&cinema=${encodeURIComponent(cinema)}&date=${selectedDate}&time=${encodeURIComponent(time)}&screen=${encodeURIComponent(screen)}&price=${price}`;
            window.location.href = bookingUrl;
        });
    }
});

// Initialize
updateMovieInfo();
