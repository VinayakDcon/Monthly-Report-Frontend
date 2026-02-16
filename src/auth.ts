export const checkAuth = async (): Promise<boolean> => {
    try {
        const res = await fetch('/api/me');
        if (res.ok) {
            const user = await res.json();
            if (user && user.name) {
                updateAuthUI(user);
                return true;
            }
        }
        updateAuthUI(null);
        return false;
    } catch (e) {
        console.log("Not logged in");
        updateAuthUI(null);
        return false;
    }
}

function updateAuthUI(user: any) {
    const userDisplay = document.getElementById('user-display');
    const userName = document.getElementById('user-name');
    const logoutBtn = document.getElementById('logout-btn');
    const loginBtn = document.getElementById('login-btn');
    const navLinks = document.querySelector('.nav-links'); // Get nav links container

    if (user) {
        // Logged In State
        if (userDisplay) userDisplay.style.display = 'inline';
        if (userName) userName.innerText = user.name;

        if (logoutBtn) {
            logoutBtn.style.display = 'inline';
            logoutBtn.onclick = () => window.location.href = '/logout';
        }

        if (loginBtn) loginBtn.style.display = 'none';

        // Show navigation links when logged in
        if (navLinks) {
            const links = navLinks.querySelectorAll('a:not(#login-btn)');
            links.forEach((link: any) => link.style.display = 'inline-block');
        }

    } else {
        // Logged Out State
        if (userDisplay) userDisplay.style.display = 'none';
        if (logoutBtn) logoutBtn.style.display = 'none';

        if (loginBtn) {
            loginBtn.style.display = 'inline-block';
            // loginBtn.style.margin = '0 auto'; // We will handle centering in CSS or main layout
        }

        // Hide navigation links when logged out
        if (navLinks) {
            const links = navLinks.querySelectorAll('a:not(#login-btn)');
            links.forEach((link: any) => link.style.display = 'none');
        }
    }
}
