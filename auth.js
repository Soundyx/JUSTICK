// Initialize Supabase client
const supabaseUrl = 'https://dogdesxjhtlohsdyrfbt.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRvZ2Rlc3hqaHRsb2hzZHlyZmJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQyMjIwOTMsImV4cCI6MjA1OTc5ODA5M30.Z4TcFHveNt8v8x3DYWufv6kpNmYH3fHcD5KZnHIVkLc';
const supabase = window.supabase.createClient(supabaseUrl, supabaseAnonKey);

// Check if we have a session
async function checkSession() {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (session) {
        // Already signed in, redirect to profile
        window.location.href = 'profile.html';
    }
}

// Check session on page load
checkSession();

// Handle sign in form submission
document.querySelector('.signin-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password
        });

        if (error) {
            if (error.message.includes('Email not confirmed')) {
                // Offer to resend confirmation email
                if (confirm('Your email is not confirmed. Would you like us to resend the confirmation email?')) {
                    const { error: resendError } = await supabase.auth.resend({
                        type: 'signup',
                        email: email
                    });
                    if (resendError) {
                        throw resendError;
                    } else {
                        alert('Confirmation email resent. Please check your inbox.');
                    }
                }
            }
            throw error;
        }

        // Successfully signed in
        console.log('Signed in:', data.user);
        window.location.href = 'profile.html';
        
    } catch (error) {
        alert(error.message);
    }
});

// Handle Google Sign In
document.querySelector('.google').addEventListener('click', async () => {
    try {
        const { user, error } = await supabase.auth.signInWithOAuth({
            provider: 'google'
        });
        if (error) throw error;
        window.location.href = 'profile.html';
    } catch (error) {
        alert(error.message);
    }
});

// Handle Facebook Sign In
document.querySelector('.facebook').addEventListener('click', async () => {
    try {
        const { user, error } = await supabase.auth.signInWithOAuth({
            provider: 'facebook'
        });
        if (error) throw error;
        window.location.href = 'profile.html';
    } catch (error) {
        alert(error.message);
    }
});
