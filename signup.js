// Initialize Supabase client
const supabaseUrl = 'https://dogdesxjhtlohsdyrfbt.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRvZ2Rlc3hqaHRsb2hzZHlyZmJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQyMjIwOTMsImV4cCI6MjA1OTc5ODA5M30.Z4TcFHveNt8v8x3DYWufv6kpNmYH3fHcD5KZnHIVkLc';
const supabase = window.supabase.createClient(supabaseUrl, supabaseAnonKey);

// Handle sign up form submission
document.querySelector('.signup-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    
    // Validate passwords match
    if (password !== confirmPassword) {
        alert("Passwords don't match!");
        return;
    }

    try {
        // Sign up the user
        const { data: { user }, error } = await supabase.auth.signUp({
            email: email,
            password: password,
            options: {
                data: {
                    full_name: name
                }
            }
        });

        if (error) throw error;

        // Successfully signed up
        alert('Registration successful! Please check your email to confirm your account.');
        window.location.href = 'signin.html';
        
    } catch (error) {
        alert(error.message);
    }
});

// Handle Google Sign Up
document.querySelector('.google').addEventListener('click', async () => {
    try {
        const { user, error } = await supabase.auth.signInWithOAuth({
            provider: 'google'
        });
        if (error) throw error;
    } catch (error) {
        alert(error.message);
    }
});

// Handle Facebook Sign Up
document.querySelector('.facebook').addEventListener('click', async () => {
    try {
        const { user, error } = await supabase.auth.signInWithOAuth({
            provider: 'facebook'
        });
        if (error) throw error;
    } catch (error) {
        alert(error.message);
    }
});
