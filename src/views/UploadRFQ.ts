import { API_BASE } from '../config';

export const renderUploadRFQ = () => {
    const app = document.querySelector<HTMLDivElement>('#app')!

    app.innerHTML = `
        <div class="form-container" style="max-width:500px;text-align:center;">
            <div style="margin-bottom:2rem;">
                <div style="font-size:3rem;margin-bottom:1rem;">📂</div>
                <h2>Upload RFQ Data</h2>
                <p style="color:#6b7280;">Upload an Excel file to bulk import RFQs</p>
            </div>

            <form id="upload-form" style="display:flex; flex-direction:column; gap:1.5rem;">
                <div class="form-group">
                    <input type="file" name="file" id="file-input" required class="file-input"
                        style="padding:1rem; border:2px dashed #cbd5e1; background:#f8fafc; text-align:center; width:100%;">
                </div>
                
                <button type="submit" class="btn">Upload Excel</button>
                <a href="#/rfq-dashboard" style="color:#6b7280;font-size:0.9rem;">Cancel</a>
            </form>

            <div id="upload-status" style="margin-top:1rem; font-weight:500;"></div>
        </div>
    `

    document.getElementById("upload-form")?.addEventListener("submit", async function (e) {
        e.preventDefault();
        const fileInput = document.getElementById("file-input") as HTMLInputElement;

        if (!fileInput.files?.length) {
            alert("Select a file");
            return;
        }

        const formData = new FormData();
        formData.append("file", fileInput.files[0]);

        const statusBox = document.getElementById("upload-status")!;
        statusBox.innerText = "Uploading...";

        try {
            const response = await fetch(`${API_BASE}/upload-rfq`, {
                method: "POST",
                body: formData
            });

            if (!response.ok) throw new Error("Upload failed");

            statusBox.innerText = "Upload successful";
            setTimeout(() => {
                window.location.hash = "#/rfq-dashboard";
            }, 1000);

        } catch (error) {
            statusBox.innerText = "Upload failed";
            console.error(error);
        }
    });
}
