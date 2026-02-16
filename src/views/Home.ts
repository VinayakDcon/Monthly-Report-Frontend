export const renderHome = () => {
    const app = document.querySelector<HTMLDivElement>('#app')!

    app.innerHTML = `
        <div class="home-header">
            <h2>Select Dashboard</h2>
        </div>

        <div class="dashboard-grid">
            <!-- Outlook Mail Report Card -->
            <a href="#/outlook-report" class="dashboard-card">
                <div class="dashboard-icon">📧</div>
                <h3>Outlook Mail Report</h3>
                <p>View sent mail analytics and reports</p>
            </a>

            <!-- RFQ Dashboard Card -->
            <a href="#/rfq-dashboard" class="dashboard-card">
                <div class="dashboard-icon">📊</div>
                <h3>RFQ Dashboard</h3>
                <p>Track and manage RFQ analytics</p>
            </a>

            <!-- Upload RFQ Card -->
            <a href="#/upload-rfq" class="dashboard-card">
                <div class="dashboard-icon">⬆️</div>
                <h3>Upload RFQ</h3>
                <p>Upload new RFQ data files</p>
            </a>
        </div>
    `
}
