document.addEventListener("DOMContentLoaded", loadDashboard);

/* ===============================
   LOAD DASHBOARD DATA FROM BACKEND
================================ */
function loadDashboard() {
  fetch("http://localhost:5000/dashboard/counts")
    .then(res => res.json())
    .then(data => {

      // ===============================
      // KPI COUNTS (SAME IDS, SAME UI)
      // ===============================
      const totalEnquiries = data.enquiries || 0;
      const totalEnrollments = data.enrollments || 0;
      const totalDropouts = data.dropouts || 0; // optional

      document.getElementById("totalEnquiries").innerText = totalEnquiries;
      document.getElementById("totalEnrollments").innerText = totalEnrollments;
      document.getElementById("totalDropouts").innerText = totalDropouts;

      // ===============================
      // CHART (SAME COLORS & STYLE)
      // ===============================
      new Chart(document.getElementById("enrollmentChart"), {
        type: "bar",
        data: {
          labels: ["Enquiries", "Enrollments", "Dropouts"],
          datasets: [{
            data: [totalEnquiries, totalEnrollments, totalDropouts],
            backgroundColor: [
              "#10b981", // emerald
              "#22c55e", // green
              "#ef4444"  // red
            ],
            borderRadius: 10
          }]
        },
        options: {
          plugins: { legend: { display: false } },
          scales: { y: { beginAtZero: true } }
        }
      });

    })
    .catch(err => {
      console.error("Dashboard error:", err);
    });
}
