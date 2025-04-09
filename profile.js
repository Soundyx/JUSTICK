// Initialize Supabase client
const supabaseUrl = 'https://dogdesxjhtlohsdyrfbt.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRvZ2Rlc3hqaHRsb2hzZHlyZmJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQyMjIwOTMsImV4cCI6MjA1OTc5ODA5M30.Z4TcFHveNt8v8x3DYWufv6kpNmYH3fHcD5KZnHIVkLc';
const supabase = window.supabase.createClient(supabaseUrl, supabaseAnonKey);

// Check if user is signed in
async function checkAuth() {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (!session) {
        // Redirect to signin if not authenticated
        window.location.href = 'signin.html';
        return;
    }
    
    // Update UI with user info
    const user = session.user;
    document.getElementById('userEmail').textContent = user.email;
    document.getElementById('userFullName').textContent = user.user_metadata.full_name || 'User';
}

// Handle sign out
document.getElementById('signOutBtn').addEventListener('click', async () => {
    try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        window.location.href = 'index.html';
    } catch (error) {
        alert(error.message);
    }
});

// Initialize page
checkAuth();
