document.addEventListener("DOMContentLoaded", loadDashboard);

let enrollmentChart = null; // prevent duplicate charts

/* ===============================
   LOAD DASHBOARD DATA FROM BACKEND
   Dropout is calculated ONLY by:
   status = 'Dropout'
================================ */
function loadDashboard() {
  fetch("http://localhost:5000/dashboard/counts")
    .then(res => res.json())
    .then(data => {

      const totalEnquiries = data.enquiries || 0;
      const totalEnrollments = data.enrollments || 0;
      const totalDropouts = data.dropouts || 0; // status = 'Dropout'

      // ===============================
      // DROPOUT PERCENTAGE
      // ===============================
      // ===============================
// DROPOUT PERCENTAGE (OUT OF 100%)
// ===============================
let dropoutPercentage = 0;

if (totalEnquiries > 0) {
  dropoutPercentage = (
    (totalDropouts / totalEnquiries) * 100
  ).toFixed(2);
}

document.getElementById("totalDropouts").innerText = dropoutPercentage + "%";


      document.getElementById("totalEnquiries").innerText = totalEnquiries;
      document.getElementById("totalEnrollments").innerText = totalEnrollments;
      

      // ===============================
      // CHART (USES COUNTS, NOT %)
      // ===============================
      if (enrollmentChart) enrollmentChart.destroy();

      enrollmentChart = new Chart(
        document.getElementById("enrollmentChart"),
        {
          type: "bar",
          data: {
            labels: ["Enquiries", "Enrollments", "Dropouts"],
            datasets: [{
              data: [totalEnquiries, totalEnrollments, totalDropouts],
              backgroundColor: [
                "#10b981",
                "#22c55e",
                "#ef4444"
              ],
              borderRadius: 10
            }]
          },
          options: {
            plugins: { legend: { display: false } },
            scales: { y: { beginAtZero: true } }
          }
        }
      );

    })
    .catch(err => console.error("Dashboard error:", err));
}
