const table = document.getElementById("studentTable");

let studentsData = [];

/* ================= RENDER STUDENTS ================= */
function renderStudents(filter = "") {
  table.innerHTML = "";
  const q = filter.trim().toLowerCase();

  studentsData
    .filter(s => {
      if (!q) return true;
      return (
        (s.name || "").toLowerCase().includes(q) ||
        (s.email || "").toLowerCase().includes(q) ||
        (s.course || "").toLowerCase().includes(q)
      );
    })
    .forEach(student => {
      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${student.name}<br><small>${student.email}</small></td>
        <td>${student.course}</td>
        <td>${student.joining_date?.split("T")[0] || "-"}</td>
        <td>${student.plan}</td>
        <td>${student.amount}</td>
        <td>
          <button class="view-btn">View EMI</button>
        </td>
      `;

      row.querySelector(".view-btn").addEventListener("click", () => {
        window.location.href =
          `../pages/student-details.html?id=${student.id}`;
      });

      table.appendChild(row);
    });
}

/* ================= LOAD STUDENTS ================= */
function loadStudentsFromDB() {
  fetch("http://localhost:5000/students")
    .then(res => res.json())
    .then(data => {
      studentsData = Array.isArray(data) ? data : [];
      renderStudents(document.getElementById("searchInput")?.value || "");
    })
    .catch(err => console.error("Load error:", err));
}

/* ================= UI & EVENTS ================= */
document.addEventListener("DOMContentLoaded", () => {
  const openModalBtn = document.getElementById("openModal");
  const studentModal = document.getElementById("studentModal");
  const closeModalBtn = document.getElementById("closeModal");
  const addBtn = document.getElementById("addStudent");
  const searchInput = document.getElementById("searchInput");

  const showModal = () => (studentModal.style.display = "block");
  const hideModal = () => (studentModal.style.display = "none");

  if (openModalBtn) openModalBtn.addEventListener("click", showModal);
  if (closeModalBtn) closeModalBtn.addEventListener("click", hideModal);

  if (searchInput) {
    searchInput.addEventListener("input", e => {
      renderStudents(e.target.value);
    });
  }

  /* ================= ADD STUDENT ================= */
  if (addBtn) {
    addBtn.addEventListener("click", async () => {
      const name = document.getElementById("name")?.value.trim();
      const email = document.getElementById("email")?.value.trim();
      const course = document.getElementById("program")?.value.trim();
      const joining_date = document.getElementById("date")?.value || null;
      const plan = document.getElementById("plan")?.value.trim();
      const amount = document.getElementById("amount")?.value.trim();

      if (!name || !email || !course || !plan || !amount) {
        alert("Please fill all required fields");
        return;
      }

      const payload = {
        name,
        email,
        course,
        joining_date,
        plan,
        amount
      };

      try {
        const res = await fetch("http://localhost:5000/students/add", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });

        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || "Insert failed");
        }

        // Clear inputs
        ["name", "email", "program", "date", "plan", "amount"].forEach(id => {
          const el = document.getElementById(id);
          if (el) el.value = "";
        });

        hideModal();
        loadStudentsFromDB();
      } catch (err) {
        console.error("Add error:", err);
        alert("Could not add student — check console for details");
      }
    });
  }

  loadStudentsFromDB();
});
