// --- MINISTRY OF COAL DEDICATED PORTAL ---
document.addEventListener('DOMContentLoaded', () => {
    // 1. Validate Session & Inject Profile Data
    const sessionStr = localStorage.getItem('hqActiveSession');
    if (!sessionStr) {
        window.location.href = 'index.html'; // Kick to login if unauthorized
        return;
    }

    const session = JSON.parse(sessionStr);

    // Populate Sidebar Profile Details dynamically
    if (document.getElementById('min-name')) {
        document.getElementById('min-name').innerText = session.userName || 'Gov. Secretary';
    }
    if (document.getElementById('min-role')) {
        document.getElementById('min-role').innerText = session.title || 'Ministry Oversight';
    }
    if (document.getElementById('min-avatar') && session.userName) {
        const initials = session.userName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
        document.getElementById('min-avatar').innerText = initials;
    }

    // 2. Secure Logout Handler
    const btnLogout = document.getElementById('btn-ministry-logout');
    if (btnLogout) {
        btnLogout.addEventListener('click', (e) => {
            e.preventDefault();
            // Clear session memory
            localStorage.removeItem('hqActiveSession');

            // Redirect back to HQ login
            window.location.href = 'index.html';
        });
    }
});