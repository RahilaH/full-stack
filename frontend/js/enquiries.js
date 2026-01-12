document.addEventListener("DOMContentLoaded", () => {
  loadEnquiries();

  const enquiryForm = document.getElementById("enquiryForm");
  const enquiryModal = document.getElementById("enquiryModal");
  const addBtn = document.getElementById("addEnquiryBtn");
  const cancelBtn = document.getElementById("cancelBtn");
  const searchInput = document.getElementById("searchInput");

  const uploadBtn = document.getElementById("uploadBtn");
  const fileInput = document.getElementById("fileInput");

  // OPEN MODAL
  addBtn.onclick = () => {
    enquiryForm.reset();
    enquiryModal.style.display = "block";
  };

  // CLOSE MODAL
  cancelBtn.onclick = () => {
    enquiryModal.style.display = "none";
  };

  // ADD ENQUIRY
  enquiryForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const payload = {
      name: document.getElementById("name").value.trim(),
      email: document.getElementById("email").value.trim(),
      course: document.getElementById("course").value.trim(),
      status: document.getElementById("status").value.trim() || "New",
      reason: document.getElementById("dropouts").value.trim() || "-"
    };

    if (!payload.name || !payload.email || !payload.course) {
      alert("Name, Email and Course are required");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/enquiries/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        alert("Failed to add enquiry");
        return;
      }

      enquiryModal.style.display = "none";
      loadEnquiries();
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  });

  // SEARCH
  searchInput.addEventListener("input", () => {
    const q = searchInput.value.toLowerCase();
    const rows = document.querySelectorAll("#enquiryTable tr");

    rows.forEach(row => {
      row.style.display = row.innerText.toLowerCase().includes(q)
        ? ""
        : "none";
    });
  });

  // UPLOAD CSV BUTTON CLICK
  uploadBtn.addEventListener("click", () => {
    fileInput.click();
  });

  // HANDLE CSV FILE
  fileInput.addEventListener("change", async () => {
    const file = fileInput.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://localhost:5000/enquiries/upload-csv", {
        method: "POST",
        body: formData
      });

      if (!res.ok) {
        alert("CSV upload failed");
        return;
      }

      alert("CSV uploaded successfully");
      loadEnquiries();
    } catch (err) {
      console.error(err);
      alert("Server error during CSV upload");
    }

    fileInput.value = "";
  });
});

// LOAD TABLE DATA
function loadEnquiries() {
  fetch("http://localhost:5000/enquiries")
    .then(res => res.json())
    .then(data => {
      console.log("ENQUIRIES DATA:", data); // 👈 important

      const table = document.getElementById("enquiryTable");
      table.innerHTML = "";

      data.forEach(e => {
        table.innerHTML += `
          <tr>
            <td>${e.name || "-"}</td>
            <td>${e.email || "-"}</td>
            <td>${e.course || "-"}</td>
            <td>${e.status || "-"}</td>
            <td>${e.reason || "-"}</td>
          </tr>
        `;
      });
    })
    .catch(err => console.error(err));
}
