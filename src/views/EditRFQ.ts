import type { RFQ } from '../types';
import { API_BASE } from '../config';

export const renderEditRFQ = async () => {
    const app = document.querySelector<HTMLDivElement>('#app')!

    // Parse query params manually to avoid circular dependency
    const hash = window.location.hash.slice(1)
    const [_, query] = hash.split('?')
    const params = new URLSearchParams(query)
    const rfqId = params.get("rfq_id");

    if (!rfqId) {
        app.innerHTML = `<div class="container"><p style="color:red; text-align:center;">Error: RFQ ID missing</p></div>`
        return;
    }

    app.innerHTML = `
        <div class="form-container">
            <div style="margin-bottom: 2rem; text-align: center;">
                <h2>Edit RFQ</h2>
                <p style="color: #6b7280;">Update details for RFQ: <strong id="rfq-id-display">${rfqId}</strong></p>
            </div>

            <form id="edit-rfq-form">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;">
                    <div class="form-group">
                        <label>Customer</label>
                        <input type="text" name="Customer" id="Customer">
                    </div>
                    <div class="form-group">
                        <label>Received Date</label>
                        <input type="date" name="Received_Date" id="Received_Date">
                    </div>
                </div>

                <div class="form-group">
                    <label>Description</label>
                    <textarea name="Description" rows="3" id="Description"></textarea>
                </div>

                <div class="form-group">
                    <label>Technical Ownership</label>
                    <input type="text" name="TECHNICAL_OWNERSHIP" id="TECHNICAL_OWNERSHIP">
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;">
                    <div class="form-group">
                        <label>Feasibility Completed</label>
                        <select name="Feasibility_Completed" id="Feasibility_Completed">
                            <option value="">Select...</option>
                            <option value="YES">Yes</option>
                            <option value="NO">No</option>
                            <option value="WIP">WIP</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Quote Submitted</label>
                        <select name="Quote_Submitted" id="Quote_Submitted">
                            <option value="">Select...</option>
                            <option value="YES">Yes</option>
                            <option value="NO">No</option>
                        </select>
                    </div>
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;">
                    <div class="form-group">
                        <label>Status</label>
                        <select name="Status" id="Status">
                            <option value="Open">Open</option>
                            <option value="Closed">Closed</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Outcome</label>
                        <select name="Outcome" id="Outcome">
                            <option value="">Select...</option>
                            <option value="WON">WON</option>
                            <option value="LOST">LOST</option>
                            <option value="CLARIFICATION">CLARIFICATION</option>
                        </select>
                    </div>
                </div>

                <div class="form-group">
                    <label>Responsible</label>
                    <input type="text" name="Responsible" id="Responsible">
                </div>

                <div class="form-group">
                    <label>Converted Project ID</label>
                    <input type="text" name="Converted_Project_ID" id="Converted_Project_ID">
                </div>

                <div style="margin-top: 2rem; display: flex; gap: 1rem;">
                    <button type="submit" class="btn" style="flex: 1;">Update RFQ</button>
                    <a href="#/rfq-dashboard" class="btn btn-secondary" style="flex: 1; text-align: center;">Cancel</a>
                </div>
            </form>
        </div>
    `

    // Fetch RFQ Data
    try {
        const response = await fetch(`${API_BASE}/rfq/${rfqId}`, { credentials: 'include' });
        if (!response.ok) throw new Error("Failed to load RFQ");

        const rfq: RFQ = await response.json();

        (document.getElementById("Customer") as HTMLInputElement).value = rfq.Customer || "";
        (document.getElementById("Received_Date") as HTMLInputElement).value = rfq.Received_Date || "";
        (document.getElementById("Description") as HTMLTextAreaElement).value = rfq.Description || "";
        (document.getElementById("TECHNICAL_OWNERSHIP") as HTMLInputElement).value = rfq.TECHNICAL_OWNERSHIP || "";
        (document.getElementById("Feasibility_Completed") as HTMLSelectElement).value = rfq.Feasibility_Completed || "";
        (document.getElementById("Quote_Submitted") as HTMLSelectElement).value = rfq.Quote_Submitted || "";
        (document.getElementById("Status") as HTMLSelectElement).value = rfq.Status || "Open";
        (document.getElementById("Outcome") as HTMLSelectElement).value = rfq.Outcome || "";
        (document.getElementById("Responsible") as HTMLInputElement).value = rfq.Responsible || "";
        (document.getElementById("Converted_Project_ID") as HTMLInputElement).value = rfq.Converted_Project_ID || "";

    } catch (e) {
        alert("Failed to load RFQ data");
        console.error(e);
    }

    // Handle Submit
    document.getElementById("edit-rfq-form")?.addEventListener("submit", async function (e) {
        e.preventDefault();
        const formData = new FormData(this as HTMLFormElement);
        const payload = Object.fromEntries(formData.entries());

        try {
            const response = await fetch(`${API_BASE}/rfq/${rfqId}`, {
                method: "PUT",
                credentials: 'include',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (!response.ok) throw new Error("Update failed");

            alert("RFQ updated successfully");
            window.location.hash = "#/rfq-dashboard";

        } catch (error) {
            console.error(error);
            alert("Error updating RFQ");
        }
    });
}
