import './style.css'
import { checkAuth } from './auth';
import { AUTH_BASE } from './config';
import { renderHome } from './views/Home.ts'
import { renderRFQDashboard } from './views/RFQDashboard.ts'
import { renderOutlookReport } from './views/OutlookReport.ts'
import { renderAddRFQ } from './views/AddRFQ.ts'
import { renderEditRFQ } from './views/EditRFQ.ts'
import { renderUploadRFQ } from './views/UploadRFQ.ts'

const app = document.querySelector<HTMLDivElement>('#app')!

const routes: Record<string, () => Promise<void> | void> = {
  '/': renderHome,
  '/outlook-report': renderOutlookReport,
  '/rfq-dashboard': renderRFQDashboard,
  '/add-rfq': renderAddRFQ,
  '/edit-rfq': renderEditRFQ,
  '/upload-rfq': renderUploadRFQ,
}

const router = async () => {
  const hash = window.location.hash.slice(1) || '/'
  const [path] = hash.split('?')
  console.log(`Navigating to ${path}`)
  const view = routes[path] || renderHome
  app.innerHTML = ''
  await view()
}

// Auth Guard & Router
const handleRoute = async () => {
  const isAuthenticated = await checkAuth();

  if (!isAuthenticated) {
    renderLogin();
    return;
  }

  await router();
}

window.addEventListener('hashchange', handleRoute)
window.addEventListener('load', handleRoute)

function renderLogin() {
  // Clear app content
  app.innerHTML = `
        <div class="login-container">
            <div class="login-card">
                <h2>Welcome Back</h2>
                <p style="color: #6b7280; margin-bottom: 2rem;">Please sign in to access the dashboard.</p>
                <button id="ms-login-btn" class="login-btn-large">Login with Microsoft</button>
            </div>
        </div>
    `;

  // Hide nav links if any are visible 
  const navLinks = document.querySelector('.nav-links');
  if (navLinks) {
    const links = navLinks.querySelectorAll('a:not(#login-btn)');
    links.forEach((link: any) => link.style.display = 'none');
  }

  // Attach Login Logic
    document.getElementById('ms-login-btn')?.addEventListener('click', async () => {
    try {
      const res = await fetch(`${AUTH_BASE}/login`, { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        if (data.auth_url) {
          window.location.href = data.auth_url;
        }
      } else {
        alert('Could not connect to login service.');
      }
    } catch (e) {
      console.error("Login Error", e);
    }
  });
}

// Helper to get query params
export const getQueryParams = () => {
  const hash = window.location.hash.slice(1)
  const [_, query] = hash.split('?')
  return new URLSearchParams(query)
}
