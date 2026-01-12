document.addEventListener("DOMContentLoaded", () => {
  const studentName = localStorage.getItem("emiStudent");

  if (!studentName) {
    alert("No student selected");
    return;
  }

  document.getElementById("studentTitle").innerText =
    `EMI Details - ${studentName}`;

  fetch(`http://localhost:5000/emis/student/${encodeURIComponent(studentName)}`)
    .then(res => res.json())
    .then(data => {
      const tbody = document.querySelector("#emiTable tbody");
      tbody.innerHTML = "";

      if (!Array.isArray(data) || data.length === 0) {
        tbody.innerHTML = `
          <tr>
            <td colspan="4">No EMI records found</td>
          </tr>`;
        return;
      }

      data.forEach(e => {
        tbody.innerHTML += `
          <tr>
            <td>${e.emi_no}</td>
            <td>${e.amount}</td>
            <td>${formatDate(e.due_date)}</td>
            <td>${e.status}</td>
          </tr>
        `;
      });
    })
    .catch(err => {
      console.error(err);
      alert("Failed to load EMI data");
    });
});

function formatDate(date) {
  return new Date(date).toISOString().split("T")[0];
}
