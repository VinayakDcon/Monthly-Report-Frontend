import { Chart, registerables } from 'chart.js';
import type { DashboardData } from '../types';
import { API_BASE } from '../config';

Chart.register(...registerables);
Chart.defaults.font.family = "'Inter', system-ui, sans-serif";
Chart.defaults.color = "#6b7280";

export const renderRFQDashboard = async () => {
    const app = document.querySelector<HTMLDivElement>('#app')!

    app.innerHTML = `
        <div class="dashboard-container">
            <div class="header-section" style="display:flex;justify-content:space-between;align-items:center;margin-bottom:2rem;">
                <h2>📊 RFQ Analytics Dashboard</h2>
                <div class="header-actions">
                    <a href="#/add-rfq" class="btn">+ Add RFQ</a>
                    <button id="download-btn" class="btn btn-secondary" style="background-color:#10b981; margin-left: 10px;">Download Excel</button>
                </div>
            </div>

            <!-- KPI CARDS -->
            <div class="summary-grid">
                <div class="kpi-card"><h4>Total RFQs</h4><div class="value" id="total-rfqs">...</div></div>
                <div class="kpi-card"><h4>Customers</h4><div class="value" id="customers">...</div></div>
                <div class="kpi-card"><h4>Converted Projects</h4><div class="value" id="converted-projects">...</div></div>
                <div class="kpi-card highlight"><h4>Conversion Rate</h4><div class="value" id="conversion-rate">...</div></div>
            </div>

            <!-- CHARTS -->
            <div class="charts-grid">
                <div class="chart-container">
                    <h3>RFQs by Status</h3>
                    <div style="position: relative; height: 100%; width: 100%;">
                        <canvas id="statusChart"></canvas>
                    </div>
                </div>
                <div class="chart-container">
                    <h3>RFQ Funnel</h3>
                    <div style="position: relative; height: 100%; width: 100%;">
                         <canvas id="funnelChart"></canvas>
                    </div>
                </div>
                <div class="chart-container" style="grid-column:span 2;">
                    <h3>Top Customers by RFQs</h3>
                    <div style="position: relative; height: 100%; width: 100%;">
                        <canvas id="customerChart"></canvas>
                    </div>
                </div>
            </div>

            <!-- TABLE -->
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>RFQ ID</th>
                            <th>Customer</th>
                            <th>Status</th>
                            <th>Feasibility</th>
                            <th>Quote</th>
                            <th>Outcome</th>
                            <th>Owner</th>
                            <th style="text-align:right;">Action</th>
                        </tr>
                    </thead>
                    <tbody id="rfq-table-body"></tbody>
                </table>
            </div>
        </div>
    `

    // Fetch Data
    try {
        const res = await fetch(`${API_BASE}/rfq-dashboard`);
        const data: DashboardData = await res.json();

        // Update KPI
        document.getElementById("total-rfqs")!.innerText = String(data.summary.total_rfqs);
        document.getElementById("customers")!.innerText = String(data.summary.customers);
        document.getElementById("converted-projects")!.innerText = String(data.summary.converted_projects);
        document.getElementById("conversion-rate")!.innerText = data.summary.conversion_rate + "%";

        // Update Table
        const tbody = document.getElementById("rfq-table-body")!;
        tbody.innerHTML = "";

        data.table_data.forEach(row => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td style="font-weight: 500;">${row.RFQ_ID}</td>
                <td>${row.Customer || ""}</td>
                <td>
                    ${row.Status?.toLowerCase() === 'open' ? '<span class="badge badge-green">Open</span>' :
                    row.Status?.toLowerCase() === 'closed' ? '<span class="badge badge-gray">Closed</span>' :
                        `<span class="badge">${row.Status || ""}</span>`}
                </td>
                <td>${row.Feasibility_Completed || ""}</td>
                <td>${row.Quote_Submitted || ""}</td>
                <td>
                    ${row.Outcome?.toLowerCase() === 'won' ? '<span class="badge badge-blue">WON</span>' :
                    row.Outcome?.toLowerCase() === 'lost' ? '<span class="badge badge-yellow">LOST</span>' :
                        row.Outcome || ""}
                </td>
                <td>${row.Responsible || ""}</td>
                <td style="text-align:right;">
                    <a href="#/edit-rfq?rfq_id=${row.RFQ_ID}" class="btn btn-sm btn-secondary">Edit</a>
                    <button class="btn btn-sm btn-danger delete-btn" data-id="${row.RFQ_ID}">Delete</button>
                </td>
            `;
            tbody.appendChild(tr);
        });

        // Add Delete Listeners
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const rfqId = (e.target as HTMLButtonElement).dataset.id;
                if (!rfqId || !confirm("Delete this RFQ?")) return;

                await fetch(`${API_BASE}/delete-rfq/${rfqId}`, { method: "DELETE" });
                // Reload dashboard
                renderRFQDashboard();
            });
        });

        // Download Listener
        document.getElementById("download-btn")?.addEventListener('click', async () => {
            try {
                const btn = document.getElementById("download-btn") as HTMLButtonElement;
                const originalText = btn.innerText;
                btn.innerText = "Downloading...";
                btn.disabled = true;

                const response = await fetch(`${API_BASE}/download-rfq`);

                if (!response.ok) throw new Error("Network response was not ok");

                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = "rfq_database.xlsx";
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                a.remove();

                btn.innerText = originalText;
                btn.disabled = false;
            } catch (error) {
                console.error("Download failed:", error);
                alert("Failed to download file. Please check backend connection.");

                const btn = document.getElementById("download-btn") as HTMLButtonElement;
                if (btn) {
                    btn.innerText = "Download Excel";
                    btn.disabled = false;
                }
            }
        });

        // Charts
        renderCharts(data);

    } catch (e) {
        console.error("Failed to load dashboard data", e);
        app.innerHTML += `<div style="color:red;padding:1rem;">Failed to load data. Is the backend running?</div>`;
    }
}

function renderCharts(data: DashboardData) {
    const statusData = data.status_counts;
    const labels = Object.keys(statusData);
    const totalValues = Object.values(statusData);
    const wonData = labels.map(label => label.toLowerCase() === "closed" ? data.closed_won : 0);

    new Chart(
        document.getElementById("statusChart") as HTMLCanvasElement,
        {
            type: "bar",
            data: {
                labels: labels,
                datasets: [
                    { label: "Total", data: totalValues, backgroundColor: "#10b981", borderRadius: 4 },
                    { label: "Won", data: wonData, backgroundColor: "#34d399", borderRadius: 4 }
                ]
            },
            options: {
                indexAxis: "y",
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: 'bottom' } },
                scales: {
                    x: { stacked: true, grid: { display: false } },
                    y: { stacked: true, grid: { display: false } }
                }
            }
        }
    );

    new Chart(
        document.getElementById("funnelChart") as HTMLCanvasElement,
        {
            type: "bar",
            data: {
                labels: ["Total RFQs", "Feasibility", "Quote", "Converted"],
                datasets: [{
                    data: [
                        data.summary.total_rfqs,
                        data.funnel.feasibility,
                        data.funnel.quote,
                        data.summary.converted_projects
                    ],
                    backgroundColor: "#3b82f6",
                    borderRadius: 6,
                    barPercentage: 0.6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    y: { grid: { borderDash: [2, 4] } as any },
                    x: { grid: { display: false } }
                }
            }
        }
    );

    new Chart(
        document.getElementById("customerChart") as HTMLCanvasElement,
        {
            type: "bar",
            data: {
                labels: Object.keys(data.top_customers),
                datasets: [{
                    data: Object.values(data.top_customers),
                    backgroundColor: "#6366f1",
                    borderRadius: 4,
                    barPercentage: 0.7
                }]
            },
            options: {
                indexAxis: "y",
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    x: { grid: { borderDash: [2, 4] } as any },
                    y: { grid: { display: false } }
                }
            }
        }
    );
}
