import { API_BASE } from '../config';

export const renderAddRFQ = () => {
    const app = document.querySelector<HTMLDivElement>('#app')!

    app.innerHTML = `
        <div class="form-container">
            <div style="margin-bottom: 2rem; text-align: center;">
                <h2>Add New RFQ</h2>
                <p style="color: #6b7280;">Enter the details for the new Request for Quotation</p>
            </div>

            <form id="add-rfq-form">
                <div class="form-group">
                    <label>RFQ ID <span style="color: red;">*</span></label>
                    <input type="text" name="RFQ_ID" required placeholder="e.g. R001">
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;">
                    <div class="form-group">
                        <label>Customer</label>
                        <input type="text" name="Customer" placeholder="Client Name">
                    </div>
                    <div class="form-group">
                        <label>Received Date</label>
                        <input type="date" name="Received_Date">
                    </div>
                </div>

                <div class="form-group">
                    <label>Description</label>
                    <textarea name="Description" rows="3" placeholder="Brief description of the project..."></textarea>
                </div>

                <div class="form-group">
                    <label>Technical Ownership</label>
                    <input type="text" name="TECHNICAL_OWNERSHIP">
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;">
                    <div class="form-group">
                        <label>Feasibility Completed</label>
                        <select name="Feasibility_Completed">
                            <option value="">Select...</option>
                            <option value="YES">Yes</option>
                            <option value="NO">No</option>
                            <option value="WIP">WIP</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Quote Submitted</label>
                        <select name="Quote_Submitted">
                            <option value="">Select...</option>
                            <option value="YES">Yes</option>
                            <option value="NO">No</option>
                        </select>
                    </div>
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;">
                    <div class="form-group">
                        <label>Status</label>
                        <select name="Status">
                            <option value="Open">Open</option>
                            <option value="Closed">Closed</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Outcome</label>
                        <select name="Outcome">
                            <option value="">Select...</option>
                            <option value="WON">WON</option>
                            <option value="LOST">LOST</option>
                            <option value="CLARIFICATION">CLARIFICATION</option>
                        </select>
                    </div>
                </div>

                <div class="form-group">
                    <label>Responsible</label>
                    <input type="text" name="Responsible">
                </div>

                <div style="margin-top: 2rem; display: flex; gap: 1rem;">
                    <button type="submit" class="btn" style="flex: 1;">Save RFQ</button>
                    <a href="#/rfq-dashboard" class="btn btn-secondary" style="flex: 1; text-align: center;">Cancel</a>
                </div>
            </form>
        </div>
    `

    document.getElementById("add-rfq-form")?.addEventListener("submit", async function (e) {
        e.preventDefault();
        const formData = new FormData(this as HTMLFormElement);
        const payload = Object.fromEntries(formData.entries());

        try {
            const response = await fetch(`${API_BASE}/add-rfq`, {
                method: "POST",
                credentials: 'include',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (!response.ok) throw new Error("Failed to save RFQ");

            alert("RFQ saved successfully");
            window.location.hash = "#/rfq-dashboard";

        } catch (error) {
            console.error(error);
            alert("Error saving RFQ");
        }
    });
}
