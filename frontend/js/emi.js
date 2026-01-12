const tableBody = document.querySelector("#emiTable tbody");
const modal = document.getElementById("emiModal");

/* =========================
   MODAL CONTROL
========================= */
function openModal() {
  modal.style.display = "flex";
}
function closeModal() {
  modal.style.display = "none";
}

/* =========================
   LOAD EMI (BY STUDENT)
========================= */
function loadEMIs() {
  const studentName = localStorage.getItem("emiStudent");

  if (!studentName) {
    tableBody.innerHTML = `
      <tr><td colspan="5">No student selected</td></tr>
    `;
    return;
  }

  fetch(`http://localhost:5000/emis/student/${studentName}`)
    .then(res => res.json())
    .then(data => {
      tableBody.innerHTML = "";

      if (data.length === 0) {
        tableBody.innerHTML = `
          <tr><td colspan="5">No EMI records found</td></tr>
        `;
        return;
      }

      data.forEach(e => {
        tableBody.innerHTML += `
          <tr>
            <td>${e.student_name}</td>
            <td>${e.emi_no}</td>
            <td>${e.amount}</td>
            <td>${e.due_date.split("T")[0]}</td>
            <td>${e.status}</td>
          </tr>
        `;
      });
    })
    .catch(err => {
      console.error(err);
      tableBody.innerHTML = `
        <tr><td colspan="5">Error loading EMI</td></tr>
      `;
    });
}

/* =========================
   ADD EMI
========================= */
function addEMI() {
  const student_name = localStorage.getItem("emiStudent");
  const emi_no = document.getElementById("emiNo").value;
  const amount = document.getElementById("amount").value;
  const due_date = document.getElementById("dueDate").value;
  const status = document.getElementById("status").value;

  if (!student_name || !emi_no || !amount || !due_date) {
    alert("Fill all fields");
    return;
  }

  fetch("http://localhost:5000/emis/add", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      student_name,
      emi_no,
      amount,
      due_date,
      status
    })
  })
    .then(res => res.json())
    .then(() => {
      alert("EMI added");
      closeModal();
      loadEMIs();
    })
    .catch(err => {
      console.error(err);
      alert("Failed to add EMI");
    });
}

/* =========================
   INIT
========================= */
window.onload = loadEMIs;
