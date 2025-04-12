document.addEventListener('DOMContentLoaded', () => {
    // Get booking data from session storage
    const bookingData = JSON.parse(sessionStorage.getItem('bookingData') || '{}');
    console.log('Booking data:', bookingData); // Debug log
    
    // Update summary
    if (bookingData) {
        document.getElementById('movieTitle').textContent = bookingData.movieTitle || 'N/A';
        document.getElementById('selectedSeats').textContent = bookingData.seats ? bookingData.seats.join(', ') : 'N/A';
        document.getElementById('totalAmount').textContent = `₹${bookingData.totalAmount || 0}`;
    }

    // Payment method selection
    const paymentMethods = document.querySelectorAll('.payment-method');
    const cardDetails = document.getElementById('cardDetails');
    const upiDetails = document.getElementById('upiDetails');
    const payButton = document.getElementById('payButton');

    paymentMethods.forEach(method => {
        method.addEventListener('click', () => {
            // Remove active class from all methods
            paymentMethods.forEach(m => m.classList.remove('active'));
            // Add active class to selected method
            method.classList.add('active');
            
            // Show relevant payment details
            if (method.dataset.method === 'card') {
                cardDetails.style.display = 'block';
                upiDetails.style.display = 'none';
            } else {
                cardDetails.style.display = 'none';
                upiDetails.style.display = 'block';
            }
        });
    });

    // Format card number input
    const cardNumber = document.getElementById('cardNumber');
    cardNumber.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        e.target.value = value;
    });

    // Format expiry date input
    const expiryDate = document.getElementById('expiryDate');
    expiryDate.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 2) {
            value = value.slice(0, 2) + '/' + value.slice(2);
        }
        e.target.value = value;
    });

    // Handle payment
    payButton.addEventListener('click', async () => {
        const selectedMethod = document.querySelector('.payment-method.active');
        if (!selectedMethod) {
            alert('Please select a payment method');
            return;
        }

        let isValid = true;
        let paymentDetails = {};

        if (selectedMethod.dataset.method === 'card') {
            const cardNumber = document.getElementById('cardNumber').value;
            const expiryDate = document.getElementById('expiryDate').value;
            const cvv = document.getElementById('cvv').value;

            if (!cardNumber || !expiryDate || !cvv) {
                alert('Please fill in all card details');
                isValid = false;
            } else if (cardNumber.length !== 16) {
                alert('Please enter a valid 16-digit card number');
                isValid = false;
            } else if (!expiryDate.match(/^(0[1-9]|1[0-2])\/\d{2}$/)) {
                alert('Please enter a valid expiry date (MM/YY)');
                isValid = false;
            } else if (cvv.length !== 3) {
                alert('Please enter a valid 3-digit CVV');
                isValid = false;
            } else {
                paymentDetails = { cardNumber, expiryDate, cvv };
            }
        } else {
            const upiId = document.getElementById('upiId').value;
            if (!upiId || !upiId.includes('@')) {
                alert('Please enter a valid UPI ID');
                isValid = false;
            } else {
                paymentDetails = { upiId };
            }
        }

        if (isValid) {
            // Disable pay button and show loading state
            payButton.disabled = true;
            payButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';

            try {
                // In a real app, you would make an API call to process the payment
                // For demo, we'll simulate a payment process
                await new Promise(resolve => setTimeout(resolve, 1500));

                // Update booking data with payment info
                bookingData.payment = {
                    method: selectedMethod.dataset.method,
                    details: paymentDetails,
                    timestamp: new Date().toISOString()
                };
                sessionStorage.setItem('bookingData', JSON.stringify(bookingData));

                // Save to localStorage for booking history
                const allBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
                allBookings.push(bookingData);
                localStorage.setItem('bookings', JSON.stringify(allBookings));

                // Redirect to success page
                window.location.href = 'booking-success.html';
            } catch (error) {
                console.error('Payment error:', error); // Debug log
                alert('Payment failed. Please try again.');
                payButton.disabled = false;
                payButton.innerHTML = 'Process Payment <i class="fas fa-lock"></i>';
            }
        }
    });
});
