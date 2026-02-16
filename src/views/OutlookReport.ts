import type { OutlookReportData } from '../types';
import { API_BASE } from '../config';

export const renderOutlookReport = () => {
    const app = document.querySelector<HTMLDivElement>('#app')!

    app.innerHTML = `
        <div class="dashboard-container">
            <div class="header-section" style="margin-bottom: 2rem;">
                <h2>📧 Outlook Mail Report</h2>
                <p style="color: #6b7280;">Generate reports based on sent emails</p>
            </div>

            <!-- FILTER CARD -->
            <div class="card" style="max-width: 800px; margin-bottom: 2rem;">
                <form id="report-form" style="display: flex; gap: 1.5rem; align-items: flex-end; flex-wrap: wrap;">
                    <div class="form-group" style="margin-bottom: 0; flex: 1; min-width: 200px;">
                        <label>Start Date</label>
                        <input type="date" name="start_date" required>
                    </div>

                    <div class="form-group" style="margin-bottom: 0; flex: 1; min-width: 200px;">
                        <label>End Date</label>
                        <input type="date" name="end_date" required>
                    </div>

                    <button type="submit" class="btn" style="height: 42px;">Generate Report</button>
                </form>
            </div>

            <!-- ERROR -->
            <div id="error-box" style="display:none; background-color: #fee2e2; color: #b91c1c; padding: 1rem; border-radius: 0.5rem; margin-bottom: 2rem;"></div>

            <!-- SUMMARY -->
            <div id="summary-section" class="summary-grid" style="display:none; margin-bottom: 2rem;">
                <div class="kpi-card">
                    <h4>Total Emails</h4>
                    <div class="value" id="total-mails"></div>
                </div>
                <div class="kpi-card">
                    <h4>Conversations</h4>
                    <div class="value" id="total-conversations"></div>
                </div>
                <div class="kpi-card highlight">
                    <h4>Date Range</h4>
                    <div class="value" id="date-range" style="font-size: 1.25rem;"></div>
                </div>
            </div>

            <!-- RESULTS TABLE -->
            <div id="table-section" class="table-container" style="display:none;">
                <table>
                    <thead>
                        <tr>
                            <th>Sent By</th>
                            <th>Sent To</th>
                            <th>Date</th>
                            <th style="width: 30%;">Mail Sent</th>
                            <th style="width: 30%;">Reply Received</th>
                        </tr>
                    </thead>
                    <tbody id="report-table-body"></tbody>
                </table>
            </div>
        </div>
    `

    document.getElementById("report-form")?.addEventListener("submit", async function (e) {
        e.preventDefault();
        const formData = new FormData(this as HTMLFormElement);
        const payload = Object.fromEntries(formData.entries());
        const errorBox = document.getElementById("error-box")!;

        errorBox.style.display = "none";

        try {
            const response = await fetch(`${API_BASE}/outlook-report`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            const data: OutlookReportData = await response.json();

            if (!response.ok) throw new Error((data as any).error || "Failed");

            /* SUMMARY */
            document.getElementById("summary-section")!.style.display = "grid";
            document.getElementById("total-mails")!.innerText = String(data.summary.total_mails);
            document.getElementById("total-conversations")!.innerText = String(data.summary.total_conversations);
            document.getElementById("date-range")!.innerText = `${data.summary.start_date} → ${data.summary.end_date}`;

            /* TABLE */
            const tbody = document.getElementById("report-table-body")!;
            tbody.innerHTML = "";

            data.report_data.forEach(row => {
                const tr = document.createElement("tr");
                tr.innerHTML = `
                    <td style="font-weight: 500;">${row.sendbywho || ""}</td>
                    <td>${row.sendtowho || ""}</td>
                    <td>${row.onwhichdatehesend || ""}</td>
                    <td style="font-size: 0.9rem; color: #4b5563;">
                        <div style="max-height:100px;overflow-y:auto;">${row.whathesend || ""}</div>
                    </td>
                    <td style="font-size: 0.9rem; color: #4b5563;">
                        <div style="max-height:100px;overflow-y:auto;">${row.whatreplyheget || ""}</div>
                    </td>
                `;
                tbody.appendChild(tr);
            });

            document.getElementById("table-section")!.style.display = "block";

        } catch (error: any) {
            errorBox.innerText = error.message;
            errorBox.style.display = "block";
        }
    });
}
