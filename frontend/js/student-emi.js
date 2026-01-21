document.addEventListener("DOMContentLoaded", () => {

  const params = new URLSearchParams(window.location.search);
  const studentId = params.get("id");

  if (!studentId) {
    alert("Student ID missing");
    return;
  }

  let TOTAL_FEE = 0;
  let PAID_AMOUNT = 0;
  let STUDENT_NAME = "";

  /* ===============================
     LOAD STUDENT DETAILS
  =============================== */
  fetch(`http://localhost:5000/students/${studentId}`)
    .then(res => res.json())
    .then(student => {
      STUDENT_NAME = student.name; // ✅ IMPORTANT

      document.getElementById("studentName").textContent = student.name;
      document.getElementById("courseInfo").textContent = student.course;

      TOTAL_FEE = Number(student.amount);

      document.getElementById("totalFee").textContent = "₹ " + TOTAL_FEE;
    })
    .then(() => loadEMIs()) // ✅ load EMI only AFTER student loads
    .catch(err => console.error("Student load error:", err));


  /* ===============================
     LOAD EMI LIST (BY STUDENT NAME)
  =============================== */
  function loadEMIs() {
    fetch(`http://localhost:5000/emis/student/${STUDENT_NAME}`)
      .then(res => res.json())
      .then(emis => {
        const table = document.getElementById("installmentTable");
        table.innerHTML = "";

        PAID_AMOUNT = 0;

        if (emis.length === 0) {
          table.innerHTML = `<tr><td colspan="5">No EMI records</td></tr>`;
          updateSummary(0);
          return;
        }

        emis.forEach(e => {
          if (e.status === "Paid") {
            PAID_AMOUNT += Number(e.amount);
          }

          table.innerHTML += `
            <tr>
              <td>Installment ${e.emi_no}</td>
              <td>${e.due_date.split("T")[0]}</td>
              <td>₹ ${e.amount}</td>
              <td>${e.status}</td>
              <td>${e.paid_on || "-"}</td>
            </tr>
          `;
        });

        updateSummary(PAID_AMOUNT);
      })
      .catch(err => console.error("EMI load error:", err));
  }


  /* ===============================
     UPDATE SUMMARY + PROGRESS BAR
  =============================== */
  function updateSummary(paid) {
    const remaining = TOTAL_FEE - paid;

    document.getElementById("paidFee").textContent = "₹ " + paid;
    document.getElementById("remainingFee").textContent = "₹ " + remaining;

    const percent =
      TOTAL_FEE > 0 ? Math.round((paid / TOTAL_FEE) * 100) : 0;

    document.getElementById("progressFill").style.width = percent + "%";

    document.getElementById("installmentText").textContent =
      `Paid ₹${paid} of ₹${TOTAL_FEE} (${percent}%)`;
  }

});
