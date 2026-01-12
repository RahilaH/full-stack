// ===== Elements =====
const modal = document.getElementById("studentModal");
const openModalBtn = document.getElementById("openModal");
const closeModalBtn = document.getElementById("closeModal");
const addStudentBtn = document.getElementById("addStudent");
const table = document.getElementById("studentTable");
const searchInput = document.getElementById("searchInput");

// ===== Modal open / close =====
openModalBtn.onclick = () => modal.classList.add("show");
closeModalBtn.onclick = () => modal.classList.remove("show");

// ===== Search filter =====
function filterStudents() {
  const q = (searchInput?.value || "").toLowerCase();
  const rows = table.getElementsByTagName("tr");

  for (let row of rows) {
    row.style.display = row.textContent.toLowerCase().includes(q) ? "" : "none";
  }
}

if (searchInput) searchInput.addEventListener("input", filterStudents);

// ===== DATE FORMATTER =====
function formatDate(date) {
  if (!date) return "-";
  return new Date(date).toISOString().split("T")[0];
}

// ===== LOAD STUDENTS FROM DATABASE =====
function loadStudentsFromDB() {
  fetch("http://localhost:5000/students")
    .then(res => res.json())
    .then(data => {
      table.innerHTML = "";

      data.forEach(student => {
        const row = document.createElement("tr");

        row.innerHTML = `
          <td>
            ${student.name}<br>
            <small>${student.email}</small>
          </td>
          <td>${student.course}</td>
          <td>${formatDate(student.joining_date)}</td>
          <td>${student.plan}</td>
          <td>${student.amount}</td>
          <td>
            <button 
              onclick="viewEMI('${student.name}')"
              style="
                color:#0f766e;
                font-weight:600;
                background:none;
                border:none;
                cursor:pointer;">
              View EMI
            </button>
          </td>
        `;

        table.appendChild(row);
      });
    })
    .catch(err => console.error("Load error:", err));
}


window.onload = loadStudentsFromDB;

// ===== ADD STUDENT =====
addStudentBtn.onclick = () => {
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const program = document.getElementById("program").value;
  const date = document.getElementById("date").value;
  const plan = document.getElementById("plan").value;
  const amount = document.getElementById("amount").value;

  if (!name || !email || !program || !date || !plan || !amount) {
    alert("Please fill all fields");
    return;
  }

  fetch("http://localhost:5000/students/add", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name,
      email,
      course: program,
      joining_date: date,
      plan,
      amount
    })
  })
    .then(res => res.json())
    .then(() => {
      loadStudentsFromDB();
      modal.classList.remove("show");
    })
    .catch(err => console.error("Save error:", err));

  ["name","email","program","date","plan","amount"].forEach(id => {
    document.getElementById(id).value = "";
  });
};

// ===== VIEW EMI =====
function viewEMI(studentName) {
  localStorage.setItem("emiStudent", studentName);
  window.location.href = "../pages/EMI.html";
}

