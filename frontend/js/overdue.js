const PENALTY_RATE = 50;

document.addEventListener("DOMContentLoaded", fetchMonthlyDues);

async function fetchMonthlyDues() {
  try {
    const res = await fetch("http://localhost:5000/api/monthly-dues");
    const data = await res.json();
    renderTable(data);
  } catch (err) {
    console.error("Failed to load dues", err);
  }
}

function renderTable(data) {
  const table = document.getElementById("dueTable");
  table.innerHTML = "";

  data.forEach(item => {
    const penalty = item.lateDays * PENALTY_RATE;
    const totalDue = item.baseAmount + penalty;

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>
        <b>${item.name}</b><br/>
        <span class="penalty-amount">₹${penalty}</span>
      </td>
      <td>
        Installment ${item.installment}<br/>
        ₹${totalDue}
      </td>
      <td>${item.dueDate}</td>
      <td>₹${item.baseAmount}</td>
      <td>${item.lateDays}</td>
    `;

    table.appendChild(row);
  });
}